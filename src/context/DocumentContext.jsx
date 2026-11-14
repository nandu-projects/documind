import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  getAllDocuments,
  getAllChunks,
  saveDocument,
  deleteDocument,
  clearAllDocuments,
  getRecentActivities,
  getSearchHistory,
  saveSearchQuery,
  logActivity,
  findDuplicateDocument,
} from '../services/db';
import { extractPDFText } from '../services/pdfParser';
import {
  createChunksFromDocument,
  BM25Engine,
  generateExtractiveAnswer,
  generateDynamicSuggestedQuestions,
} from '../services/nlpEngine';
import { DEMO_DOCUMENTS, SAMPLE_QUESTIONS } from '../data/demoDocuments';

const DocumentContext = createContext();

export function DocumentProvider({ children }) {
  const [documents, setDocuments] = useState([]);
  const [chunks, setChunks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [searchHistoryList, setSearchHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Progress tracker for uploads / batch indexing
  const [uploadProgress, setUploadProgress] = useState({
    active: false,
    fileName: '',
    pagePercent: 0,
    currentPage: 0,
    totalPages: 0,
    currentFileIndex: 0,
    totalFiles: 0,
    statusText: '',
  });

  // Modal viewer state
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewPage, setPreviewPage] = useState(1);

  // Initialize data from IndexedDB
  const refreshData = useCallback(async () => {
    try {
      const [docs, allChunks, acts, history] = await Promise.all([
        getAllDocuments(),
        getAllChunks(),
        getRecentActivities(20),
        getSearchHistory(20),
      ]);

      setDocuments(docs || []);
      setChunks(allChunks || []);
      setActivities(acts || []);
      setSearchHistoryList(history || []);
    } catch (err) {
      console.error('Failed to load data from IndexedDB:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Construct BM25 engine reactively whenever chunks change
  const bm25Engine = useMemo(() => {
    return new BM25Engine(chunks, { k1: 1.5, b: 0.75 });
  }, [chunks]);

  /**
   * Determine suggested questions dynamically:
   * 1. If no documents -> empty list.
   * 2. If USER has uploaded any documents -> ONLY generate from user uploaded documents!
   *    Never mix in demo questions (library, attendance, security) when user documents exist.
   * 3. If ONLY demo documents are loaded -> return SAMPLE_QUESTIONS.
   */
  const suggestedQuestions = useMemo(() => {
    if (documents.length === 0) return [];

    const userDocs = documents.filter(d => !d.isDemo);

    if (userDocs.length > 0) {
      // Exclusively generate from user documents
      return generateDynamicSuggestedQuestions(userDocs);
    }

    // Only demo documents are present
    return SAMPLE_QUESTIONS;
  }, [documents]);

  /**
   * Get suggested questions specifically scoped to a document filter
   */
  const getScopedSuggestedQuestions = useCallback((filterDocId = null) => {
    const userDocs = documents.filter(d => !d.isDemo);

    if (filterDocId) {
      const targetDoc = documents.find(d => d.id === filterDocId);
      if (!targetDoc) return suggestedQuestions;

      // If user documents exist, never show demo questions even if filterDocId points to demo
      if (targetDoc.isDemo) {
        if (userDocs.length > 0) {
          return generateDynamicSuggestedQuestions(userDocs);
        }
        return SAMPLE_QUESTIONS.filter(sq => sq.expectedDoc === targetDoc.name);
      }

      return generateDynamicSuggestedQuestions([targetDoc]);
    }

    return suggestedQuestions;
  }, [documents, suggestedQuestions]);

  /**
   * Load Built-in Demo Workspace
   */
  const loadDemoWorkspace = async () => {
    setUploadProgress({
      active: true,
      fileName: 'Loading Demo Workspace...',
      pagePercent: 20,
      currentPage: 1,
      totalPages: 4,
      currentFileIndex: 1,
      totalFiles: 4,
      statusText: 'Indexing institutional academic and security policies...',
    });

    try {
      for (let i = 0; i < DEMO_DOCUMENTS.length; i++) {
        const demoDoc = DEMO_DOCUMENTS[i];
        setUploadProgress(prev => ({
          ...prev,
          fileName: demoDoc.name,
          currentFileIndex: i + 1,
          pagePercent: Math.round(((i + 1) / DEMO_DOCUMENTS.length) * 100),
          statusText: `Chunking & tokenizing ${demoDoc.name}...`,
        }));

        const docChunks = createChunksFromDocument(demoDoc, 120, 25);
        await saveDocument(demoDoc, docChunks);
      }

      await logActivity('demo_loaded', 'Loaded 4 verified college exhibition demo documents');
      await refreshData();
      return { success: true };
    } catch (err) {
      console.error('Failed to load demo workspace:', err);
      throw err;
    } finally {
      setUploadProgress({
        active: false,
        fileName: '',
        pagePercent: 0,
        currentPage: 0,
        totalPages: 0,
        currentFileIndex: 0,
        totalFiles: 0,
        statusText: '',
      });
    }
  };

  /**
   * Upload and index PDF files with Duplicate Detection & Quality Assessment
   * @param {FileList|Array} fileList
   * @param {Object} options { replaceDuplicates: boolean }
   */
  const uploadPDFFiles = async (fileList, options = { replaceDuplicates: false }) => {
    const files = Array.from(fileList).filter(f => f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf');
    if (files.length === 0) {
      throw new Error('No PDF files found. Please select valid .pdf files.');
    }

    const errors = [];
    const duplicates = [];
    const processedDocs = [];
    let successCount = 0;

    setUploadProgress({
      active: true,
      fileName: files[0].name,
      pagePercent: 0,
      currentPage: 0,
      totalPages: 0,
      currentFileIndex: 1,
      totalFiles: files.length,
      statusText: 'Validating PDF integrity, magic bytes, and reading order...',
    });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        setUploadProgress(prev => ({
          ...prev,
          fileName: file.name,
          currentFileIndex: i + 1,
          pagePercent: 0,
          statusText: `Parsing pages from "${file.name}"...`,
        }));

        // Extract text page by page with spatial layout, math symbols, and duplicate hash
        const extractedDoc = await extractPDFText(file, (percent, curr, total) => {
          setUploadProgress(prev => ({
            ...prev,
            pagePercent: percent,
            currentPage: curr,
            totalPages: total,
            statusText: `Extracted page ${curr} of ${total} (${percent}%)`,
          }));
        });

        // Duplicate Detection Check
        const dupCheck = await findDuplicateDocument(extractedDoc.hash, extractedDoc.name, extractedDoc.size);
        if (dupCheck.isDuplicate && !options.replaceDuplicates) {
          duplicates.push({
            fileName: file.name,
            reason: dupCheck.reason === 'identical_hash' ? 'Exact duplicate (SHA-256 matched)' : 'Identical file name and size',
            existingDoc: dupCheck.existingDoc,
            newDoc: extractedDoc,
          });
          continue; // Skip re-indexing duplicate unless user requested replace
        } else if (dupCheck.isDuplicate && options.replaceDuplicates) {
          // Delete existing duplicate document first
          await deleteDocument(dupCheck.existingDoc.id);
        }

        // Mark as user upload (not demo)
        extractedDoc.isDemo = false;

        // Break into passages & compute tokens
        setUploadProgress(prev => ({
          ...prev,
          statusText: `Indexing passages for BM25 retrieval...`,
        }));
        const docChunks = createChunksFromDocument(extractedDoc, 130, 30);
        extractedDoc.meaningfulPassages = docChunks.length;

        // Compute generated questions count
        const genQ = generateDynamicSuggestedQuestions([extractedDoc]);
        extractedDoc.generatedQuestionsCount = genQ.length;

        // Save to IndexedDB
        await saveDocument(extractedDoc, docChunks);
        processedDocs.push(extractedDoc);
        successCount++;
      } catch (err) {
        console.error(`Error processing "${file.name}":`, err);
        errors.push(`${file.name}: ${err.message}`);
      }
    }

    setUploadProgress({
      active: false,
      fileName: '',
      pagePercent: 0,
      currentPage: 0,
      totalPages: 0,
      currentFileIndex: 0,
      totalFiles: 0,
      statusText: '',
    });

    await refreshData();

    return {
      success: successCount > 0,
      successCount,
      duplicates,
      errors,
      processedDocs,
    };
  };

  /**
   * Delete a document
   */
  const removeDocument = async (id) => {
    await deleteDocument(id);
    await refreshData();
  };

  /**
   * Clear all documents and database
   */
  const resetLibrary = async () => {
    await clearAllDocuments();
    await refreshData();
  };

  /**
   * Execute BM25 search
   */
  const executeSearch = async (query, filters = {}) => {
    const startTime = performance.now();
    const results = bm25Engine.search(query, filters);
    const duration = Math.round(performance.now() - startTime);

    if (query && query.trim().length > 1) {
      await saveSearchQuery(query.trim(), results.length, results[0]?.score || 0, 'search');
      refreshData();
    }

    return {
      results,
      duration,
      totalMatches: results.length,
    };
  };

  /**
   * Execute Question Answering with answer formulation & citations
   */
  const executeQA = async (question, filters = {}) => {
    const startTime = performance.now();
    const rankedPassages = bm25Engine.search(question, { ...filters, limit: 12 });
    const duration = Math.round(performance.now() - startTime);

    // Filter documents matching scope (isolating user docs from demo docs)
    const userDocs = documents.filter(d => !d.isDemo);
    let targetDocs = filters.docId
      ? documents.filter(d => d.id === filters.docId)
      : (userDocs.length > 0 ? userDocs : documents);

    const answerResult = generateExtractiveAnswer(question, rankedPassages, targetDocs);

    if (question && question.trim().length > 1) {
      await saveSearchQuery(
        question.trim(),
        rankedPassages.length,
        answerResult.confidence,
        'qa'
      );
      refreshData();
    }

    return {
      question,
      ...answerResult,
      passages: rankedPassages,
      duration,
    };
  };

  /**
   * Open document preview modal at a specific page
   */
  const openDocumentViewer = (docOrId, pageNum = 1) => {
    if (typeof docOrId === 'string') {
      const found = documents.find(d => d.id === docOrId);
      if (found) {
        setPreviewDoc(found);
        setPreviewPage(pageNum);
      }
    } else if (docOrId) {
      setPreviewDoc(docOrId);
      setPreviewPage(pageNum);
    }
  };

  const closeDocumentViewer = () => {
    setPreviewDoc(null);
    setPreviewPage(1);
  };

  // Stats calculation
  const stats = useMemo(() => {
    const totalDocs = documents.length;
    const totalPages = documents.reduce((sum, d) => sum + (d.pageCount || 0), 0);
    const totalWords = documents.reduce((sum, d) => sum + (d.totalWords || 0), 0);
    const totalChunks = chunks.length;
    const totalSearches = searchHistoryList.length;

    return {
      totalDocs,
      totalPages,
      totalWords,
      totalChunks,
      totalSearches,
    };
  }, [documents, chunks, searchHistoryList]);

  return (
    <DocumentContext.Provider
      value={{
        documents,
        chunks,
        activities,
        searchHistoryList,
        isLoading,
        uploadProgress,
        stats,
        suggestedQuestions,
        getScopedSuggestedQuestions,
        previewDoc,
        previewPage,
        setPreviewPage,
        openDocumentViewer,
        closeDocumentViewer,
        uploadPDFFiles,
        loadDemoWorkspace,
        removeDocument,
        resetLibrary,
        executeSearch,
        executeQA,
        refreshData,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}
