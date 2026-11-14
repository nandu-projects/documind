import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  Layers,
  Tag,
  BookOpen,
  ArrowRight,
  Printer,
  Calendar,
  Clock
} from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';
import {
  generateDocumentSummary,
  exportSummaryAsTxt,
  exportSummaryAsPdf,
} from '../../services/summarizer';

export default function SummaryGenerator({ initialDocId = '', onClearInitialDocId }) {
  const { documents, openDocumentViewer, loadDemoWorkspace, uploadProgress } = useDocuments();
  const [selectedDocId, setSelectedDocId] = useState(initialDocId || '');
  const [summary, setSummary] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialDocId) {
      setSelectedDocId(initialDocId);
      handleGenerate(initialDocId);
      if (onClearInitialDocId) onClearInitialDocId();
    } else if (!selectedDocId && documents.length > 0) {
      setSelectedDocId(documents[0].id);
      handleGenerate(documents[0].id);
    }
  }, [initialDocId, documents]);

  const handleGenerate = (targetDocId = null) => {
    const docId = targetDocId || selectedDocId;
    if (!docId) return;

    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    setIsGenerating(true);
    // Slight tick for UI fluidity
    setTimeout(() => {
      try {
        const result = generateDocumentSummary(doc);
        setSummary(result);
      } catch (err) {
        console.error('Summary generation error:', err);
      } finally {
        setIsGenerating(false);
      }
    }, 150);
  };

  const currentDoc = documents.find(d => d.id === selectedDocId);

  const handleCopySummary = () => {
    if (!summary) return;
    const text = `Document: ${summary.docName}\n\n1. Executive Overview:\n${summary.executiveSummary}\n\n2. Key Takeaways:\n` +
      summary.keyTakeaways.map((k, i) => `${i + 1}. [Page ${k.pageNum}] ${k.text}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>Smart Document Summarizer</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Multi-level extractive summarization, key policy points, topic clustering, and verifiable page citations.
        </p>
      </div>

      {/* Document Selector & Action Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[260px] space-y-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Select Document to Summarize:
          </label>
          <select
            value={selectedDocId}
            onChange={(e) => {
              setSelectedDocId(e.target.value);
              handleGenerate(e.target.value);
            }}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-indigo-500"
          >
            {documents.length === 0 ? (
              <option value="">No documents uploaded</option>
            ) : (
              documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.pageCount} pages, {d.totalWords || 0} words)
                </option>
              ))
            )}
          </select>
        </div>

        <div className="flex items-center gap-2 pt-4 sm:pt-0">
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating || !selectedDocId}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Summarizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Regenerate Summary</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Empty State */}
      {documents.length === 0 ? (
        <div className="p-10 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <FileText className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Documents Available
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Upload a PDF or load the demo workspace to test summarization with page citations.
          </p>
          <button
            onClick={loadDemoWorkspace}
            disabled={uploadProgress.active}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all cursor-pointer"
          >
            Load 4 Demo Documents
          </button>
        </div>
      ) : summary ? (
        /* Summary Results View */
        <div className="space-y-6 animate-fadeIn">
          {/* Action Ribbon: Export as TXT / PDF, Copy */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Generated: {summary.generatedAt}</span>
              <span>•</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{summary.pageCount} Pages Analyzed</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySummary}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => exportSummaryAsTxt(summary, currentDoc?.name || 'document.pdf')}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>TXT</span>
              </button>

              <button
                onClick={() => exportSummaryAsPdf(summary, currentDoc?.name || 'document.pdf')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Section 1: Executive Overview */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                <span>Executive Overview</span>
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {summary.executiveSummary}
            </p>
          </div>

          {/* Section 2: Key Topics & Extracted Concepts */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
              <span>Extracted Topics & Dominant Concepts</span>
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {summary.topics.map((t, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>{t.topic}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-200/60 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                    {t.frequency}x
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Section 3: Core Takeaways with Page Citations */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
              <span>Actionable Takeaways & Key Clauses ({summary.keyTakeaways.length})</span>
            </h3>

            <div className="space-y-3">
              {summary.keyTakeaways.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-start justify-between gap-3 hover:border-indigo-300 dark:hover:border-indigo-800/80 transition-all"
                >
                  <div className="space-y-1.5">
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      {item.text}
                    </p>
                  </div>

                  <button
                    onClick={() => openDocumentViewer(selectedDocId, item.pageNum)}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title="Jump to this page in preview"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Page {item.pageNum}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
