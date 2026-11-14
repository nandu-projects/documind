import React, { useState, useMemo } from 'react';
import {
  Library,
  Search,
  FileText,
  Calendar,
  Layers,
  Trash2,
  BookOpen,
  MessageSquareCode,
  FileSpreadsheet,
  Grid,
  List,
  Sparkles,
  AlertTriangle,
  HardDrive,
  CheckCircle2,
  Sigma,
  HelpCircle
} from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';

export default function DocumentLibrary({ setActiveTab, onSelectDocForSummary }) {
  const {
    documents,
    removeDocument,
    resetLibrary,
    openDocumentViewer,
    loadDemoWorkspace,
    uploadProgress
  } = useDocuments();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  // Filter documents by name
  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const q = searchQuery.toLowerCase();
    return documents.filter(d => d.name.toLowerCase().includes(q));
  }, [documents, searchQuery]);

  const handleSummarize = (doc) => {
    if (onSelectDocForSummary) {
      onSelectDocForSummary(doc.id);
    }
    setActiveTab('summaries');
  };

  const handleAskQuestions = (doc) => {
    setActiveTab('qa');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Library className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Document Library ({documents.length})</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Persistent local repository stored securely inside your browser's IndexedDB.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {documents.length > 0 && (
            <button
              onClick={() => setConfirmClearOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Library</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('upload')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            Upload More
          </button>
        </div>
      </div>

      {/* Filter and View Toggle Bar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents by file name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Empty State */}
      {documents.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Library className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Your Document Library is Empty
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Upload your own PDFs or test instantly with our pre-configured college demo dataset.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={loadDemoWorkspace}
              disabled={uploadProgress.active}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Load 4 Demo Documents</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              Upload PDF Files
            </button>
          </div>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
          No documents matching "{searchQuery}".
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-800/80 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4
                        className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                        title={doc.name}
                      >
                        {doc.name}
                      </h4>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {(doc.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {doc.isDemo && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                        Demo
                      </span>
                    )}
                    {doc.hasMath && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 flex items-center gap-1">
                        <Sigma className="w-2.5 h-2.5" />
                        <span>Math</span>
                      </span>
                    )}
                    {doc.qualityRating && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          doc.needsOCR || doc.qualityRating.includes('OCR')
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}
                      >
                        {doc.qualityRating}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-500" />
                    <span>{doc.pageCount} {doc.pageCount === 1 ? 'Page' : 'Pages'}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-blue-500" />
                    <span>{doc.totalWords || 0} Words</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{doc.meaningfulPassages || (doc.pages ? doc.pages.length * 3 : 0)} Passages</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span>{doc.suggestedQuestions?.length || doc.generatedQuestionsCount || 0} Questions</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                  <Calendar className="w-3 h-3" />
                  <span>Indexed: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                <button
                  onClick={() => openDocumentViewer(doc, 1)}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSummarize(doc)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Generate Summary"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAskQuestions(doc)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Ask Questions"
                  >
                    <MessageSquareCode className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Delete Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Document</th>
                  <th className="py-3 px-4">Pages</th>
                  <th className="py-3 px-4">Words</th>
                  <th className="py-3 px-4">Quality</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Indexed Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span className="truncate max-w-[220px]" title={doc.name}>{doc.name}</span>
                        {doc.isDemo && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                            Demo
                          </span>
                        )}
                        {doc.hasMath && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 flex items-center gap-0.5">
                            <Sigma className="w-2.5 h-2.5" />
                            <span>Math</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">{doc.pageCount}</td>
                    <td className="py-3 px-4">{doc.totalWords || 0}</td>
                    <td className="py-3 px-4">
                      {doc.qualityRating ? (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            doc.needsOCR || doc.qualityRating.includes('OCR')
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          {doc.qualityRating}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-4">{(doc.size / 1024).toFixed(0)} KB</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openDocumentViewer(doc, 1)}
                          className="px-2 py-1 rounded-md text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => handleSummarize(doc)}
                          className="px-2 py-1 rounded-md text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          Summarize
                        </button>
                        <button
                          onClick={() => removeDocument(doc.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Clearing Library */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/60 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Clear Entire Library?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              This will remove all {documents.length} indexed documents, passage chunks, and query history from your browser's IndexedDB.
            </p>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                onClick={() => setConfirmClearOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await resetLibrary();
                  setConfirmClearOpen(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-xs cursor-pointer"
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
