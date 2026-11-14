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
} from '../services/db';
import { extractPDFText } from '../services/pdfParser';
import {
  createChunksFromDocument,
  BM25Engine,
  generateExtractiveAnswer,
} from '../services/nlpEngine';
import { DEMO_DOCUMENTS } from '../data/demoDocuments';

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

        // Generate chunks
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
   * Upload and index one or multiple PDF files
   */
  const uploadPDFFiles = async (fileList) => {
    const files = Array.from(fileList).filter(f => f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf');
    if (files.length === 0) {
      throw new Error('No PDF files found. Please select valid .pdf files.');
    }

    const errors = [];
    let successCount = 0;

    setUploadProgress({
      active: true,
      fileName: files[0].name,
      pagePercent: 0,
      currentPage: 0,
      totalPages: 0,
      currentFileIndex: 1,
      totalFiles: files.length,
      statusText: 'Validating PDF integrity and structure...',
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

        // Extract text page by page with PDF.js
        const extractedDoc = await extractPDFText(file, (percent, curr, total) => {
          setUploadProgress(prev => ({
            ...prev,
            pagePercent: percent,
            currentPage: curr,
            totalPages: total,
            statusText: `Extracted page ${curr} of ${total} (${percent}%)`,
          }));
        });

        // Break into passages & compute tokens
        setUploadProgress(prev => ({
          ...prev,
          statusText: `Indexing passages for Information Retrieval...`,
        }));
        const docChunks = createChunksFromDocument(extractedDoc, 130, 30);

        // Save to IndexedDB
        await saveDocument(extractedDoc, docChunks);
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
      errors,
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

    const answerResult = generateExtractiveAnswer(question, rankedPassages);

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
