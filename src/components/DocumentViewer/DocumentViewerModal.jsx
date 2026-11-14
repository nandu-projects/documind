import React, { useState, useMemo } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Copy,
  Check,
  Search,
  FileText,
  Calendar,
  Layers,
  HardDrive
} from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';
import { highlightText } from '../../services/nlpEngine';

export default function DocumentViewerModal() {
  const { previewDoc, previewPage, setPreviewPage, closeDocumentViewer } = useDocuments();
  const [copied, setCopied] = useState(false);
  const [internalQuery, setInternalQuery] = useState('');

  if (!previewDoc) return null;

  const totalPages = previewDoc.pages?.length || 1;
  const currentPageData = previewDoc.pages?.find(p => p.pageNum === previewPage) || previewDoc.pages?.[0] || { pageNum: 1, text: '' };

  const handleCopyText = () => {
    if (currentPageData.text) {
      navigator.clipboard.writeText(currentPageData.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrevPage = () => {
    if (previewPage > 1) {
      setPreviewPage(previewPage - 1);
    }
  };

  const handleNextPage = () => {
    if (previewPage < totalPages) {
      setPreviewPage(previewPage + 1);
    }
  };

  const highlightedContent = useMemo(() => {
    if (!internalQuery.trim()) {
      return currentPageData.text;
    }
    return highlightText(currentPageData.text, internalQuery);
  }, [currentPageData.text, internalQuery]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                {previewDoc.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  {totalPages} {totalPages === 1 ? 'Page' : 'Pages'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5" />
                  {(previewDoc.size / 1024).toFixed(0)} KB
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Copy current page text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Page'}</span>
            </button>

            <button
              onClick={closeDocumentViewer}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: In-document search & page jumper */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-100/60 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Quick Find In Document */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Find in page text..."
              value={internalQuery}
              onChange={(e) => setInternalQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-indigo-500"
            />
          </div>

          {/* Page Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={previewPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs px-2">
              Page {previewPage} of {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={previewPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Page Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4 font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-200 select-text">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80 shadow-inner whitespace-pre-wrap">
            {internalQuery.trim() ? (
              <div dangerouslySetInnerHTML={{ __html: highlightedContent }} />
            ) : (
              currentPageData.text || (
                <span className="text-slate-400 italic">No text content found on this page.</span>
              )
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Words on this page: {currentPageData.wordCount || 0}</span>
          <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
            Document ID: {previewDoc.id}
          </span>
        </div>
      </div>
    </div>
  );
}
