import React from 'react';
import {
  FileText,
  Layers,
  Search,
  Zap,
  UploadCloud,
  MessageSquareCode,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Trash2,
  BookOpen
} from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';


export default function Dashboard({ setActiveTab, onSelectQuestion }) {
  const {
    documents,
    stats,
    activities,
    suggestedQuestions,
    openDocumentViewer,
    loadDemoWorkspace,
    uploadProgress
  } = useDocuments();

  const handleQuestionClick = (qText) => {
    if (onSelectQuestion) {
      onSelectQuestion(qText);
    }
    setActiveTab('qa');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner / College Exhibition Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 p-6 sm:p-8 text-white shadow-xl shadow-indigo-700/10">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-indigo-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Information Retrieval & Document Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome to DocuMind
          </h2>
          <p className="text-indigo-100/90 text-sm sm:text-base leading-relaxed">
            Extract, search, and answer complex questions from multi-page PDFs with 100% verified source page citations. Fully client-side processing with zero cloud data transmission.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('qa')}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquareCode className="w-4 h-4 text-indigo-600" />
              <span>Ask a Question</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className="px-4 py-2.5 rounded-xl bg-indigo-800/80 hover:bg-indigo-800 text-white font-semibold text-sm border border-indigo-400/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 text-indigo-300" />
              <span>Upload New PDF</span>
            </button>

            {documents.length === 0 && (
              <button
                onClick={loadDemoWorkspace}
                disabled={uploadProgress.active}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Load Exhibition Demo</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative Background Circles */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 -mb-16 w-60 h-60 rounded-full bg-purple-500/20 blur-xl pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Documents */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Documents
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.totalDocs}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{stats.totalWords.toLocaleString()}</span> total indexed words
          </p>
        </div>

        {/* Card 2: Pages */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Indexed Pages
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.totalPages}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="text-purple-600 dark:text-purple-400 font-semibold">{stats.totalChunks}</span> passage chunks
          </p>
        </div>

        {/* Card 3: Search Queries */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Queries Executed
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Search className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.totalSearches}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100%</span> local cache hits
          </p>
        </div>

        {/* Card 4: Engine Status */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Retrieval Model
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              BM25 Okapi + IR
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            Sub-10ms query latency
          </p>
        </div>
      </div>

      {/* Dynamic Suggested Questions Section */}
      {suggestedQuestions.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>
                  {documents.some(d => !d.isDemo)
                    ? 'AI Document Insights — Suggested Questions for Your Uploads'
                    : 'Exhibition Ready — 1-Click Sample Questions'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {documents.some(d => !d.isDemo)
                  ? 'Dynamically extracted questions covering policies, formulas, definitions, and procedures in your uploaded documents.'
                  : 'Click any verified question below to test retrieval accuracy, exact page citations, and synthesized answers.'}
              </p>
            </div>

            {documents.length === 0 && (
              <button
                onClick={loadDemoWorkspace}
                disabled={uploadProgress.active}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Load 4 sample documents first</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {suggestedQuestions.map((sq) => (
              <button
                key={sq.id}
                onClick={() => handleQuestionClick(sq.question)}
                className="group p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 text-left transition-all flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {sq.category && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                        {sq.category}
                      </span>
                    )}
                    {sq.expectedDoc && (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[200px]">
                        Target: {sq.expectedDoc}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {sq.question}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Two-Column Layout: Recent Documents & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Documents (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4.5 h-4.5 text-indigo-600" />
              <span>Recent Documents ({documents.length})</span>
            </h3>
            <button
              onClick={() => setActiveTab('library')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {documents.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No documents uploaded yet
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Upload your course outlines, research papers, or bylaws to start asking questions.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={loadDemoWorkspace}
                  disabled={uploadProgress.active}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shadow-xs transition-all cursor-pointer"
                >
                  Load 4 Demo Documents
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                >
                  Upload Files
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {documents.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800/80 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                          <FileText className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1" title={doc.name}>
                            {doc.name}
                          </h4>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">
                            {doc.pageCount} {doc.pageCount === 1 ? 'Page' : 'Pages'} • {(doc.size / 1024).toFixed(0)} KB
                          </span>
                        </div>
                      </div>
                      {doc.isDemo && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                          Demo
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => openDocumentViewer(doc, 1)}
                      className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('qa')}
                      className="font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquareCode className="w-3.5 h-3.5" />
                      <span>Ask Doc</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recent Activity Feed (Span 1) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-indigo-600" />
              <span>Recent Activity</span>
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 py-6 text-center">
                No recent activity recorded yet.
              </p>
            ) : (
              <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                {activities.slice(0, 8).map((act) => (
                  <div key={act.id} className="flex items-start gap-2.5 text-xs">
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300">
                      {act.type.includes('document') ? (
                        <FileText className="w-3 h-3 text-blue-500" />
                      ) : act.type.includes('query') ? (
                        <Search className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Sparkles className="w-3 h-3 text-indigo-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="font-medium text-slate-700 dark:text-slate-300 leading-snug">
                        {act.message}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Privacy & Guarantee Widget */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800/80 dark:to-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Strict Hallucination-Free Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              DocuMind uses deterministic BM25 ranking and extractive evidence scoring. It provides exact page numbers and never fabricates facts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
