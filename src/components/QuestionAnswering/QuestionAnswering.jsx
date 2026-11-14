import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquareCode,
  Search,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Layers,
  HelpCircle,
  BookOpen,
  Filter,
  ArrowRight,
  RotateCcw,
  Tag,
  Info
} from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';
import { highlightText } from '../../services/nlpEngine';

export default function QuestionAnswering({ initialQuestion = '', onClearInitialQuestion }) {
  const {
    documents,
    executeQA,
    openDocumentViewer,
    loadDemoWorkspace,
    uploadProgress,
    getScopedSuggestedQuestions,
  } = useDocuments();

  const [question, setQuestion] = useState(initialQuestion || '');
  const [selectedDocId, setSelectedDocId] = useState(''); // '' means all documents
  const [isLoading, setIsLoading] = useState(false);
  const [qaResult, setQaResult] = useState(null);
  const [copiedAnswer, setCopiedAnswer] = useState(false);

  // Dynamically compute suggested questions tailored to the active filter and uploaded documents
  const activeSuggestedQuestions = useMemo(() => {
    return getScopedSuggestedQuestions(selectedDocId);
  }, [getScopedSuggestedQuestions, selectedDocId]);

  // If initialQuestion changes from dashboard or sample pill
  useEffect(() => {
    if (initialQuestion) {
      setQuestion(initialQuestion);
      handleAsk(initialQuestion);
      if (onClearInitialQuestion) {
        onClearInitialQuestion();
      }
    }
  }, [initialQuestion]);

  const handleAsk = async (qToAsk = null, overrideFilterDocId = undefined) => {
    const targetQuery = (typeof qToAsk === 'string' ? qToAsk : question).trim();
    if (!targetQuery) return;

    setIsLoading(true);
    setQaResult(null);

    try {
      const filters = {};
      const filterId = overrideFilterDocId !== undefined ? overrideFilterDocId : selectedDocId;
      if (filterId) {
        filters.docId = filterId;
      }
      const res = await executeQA(targetQuery, filters);
      setQaResult(res);
    } catch (err) {
      console.error('QA execution error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const handleCopyAnswer = () => {
    if (qaResult?.answer) {
      let copyPayload = `Question: ${qaResult.question}\nAnswer: ${qaResult.answer}\n\nSources:`;
      qaResult.sources?.forEach(s => {
        copyPayload += `\n- ${s.docName} (Page ${s.pageNum}) [Confidence: ${s.score}%]`;
      });
      navigator.clipboard.writeText(copyPayload);
      setCopiedAnswer(true);
      setTimeout(() => setCopiedAnswer(false), 2000);
    }
  };

  const handleClearScope = () => {
    setSelectedDocId('');
    if (question.trim()) {
      handleAsk(question, '');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <MessageSquareCode className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>Intelligent Question Answering</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Ask questions in natural English. DocuMind utilizes BM25 retrieval, query expansion, and sentence scoring to extract truthful facts with verifiable source page numbers.
        </p>
      </div>

      {/* Input Box Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        {/* Document Filter Dropdown & Clear */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-600 dark:text-slate-400">Search Scope:</span>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-indigo-500"
            >
              <option value="">All Uploaded Documents ({documents.length})</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.pageCount} pages){d.isDemo ? ' [Demo]' : ''}
                </option>
              ))}
            </select>
          </div>

          {documents.length === 0 && (
            <button
              onClick={loadDemoWorkspace}
              disabled={uploadProgress.active}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Demo Documents</span>
            </button>
          )}
        </div>

        {/* Query Input & Submit */}
        <div className="relative">
          <input
            type="text"
            placeholder="Ask anything about formulas, regulations, numbers, policies, definitions, or procedures..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-4 pr-24 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-2 focus:outline-indigo-500 shadow-inner"
          />
          <button
            onClick={() => handleAsk()}
            disabled={isLoading || !question.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Ask</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Suggested Questions based on Active Documents */}
        {activeSuggestedQuestions.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>Suggested Questions for {selectedDocId ? 'Selected Document' : 'Uploaded Library'}:</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeSuggestedQuestions.map((sq) => (
                <button
                  key={sq.id}
                  onClick={() => {
                    setQuestion(sq.question);
                    handleAsk(sq.question);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/40 text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium transition-all text-left flex items-center gap-1.5 cursor-pointer"
                >
                  {sq.category && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold">
                      {sq.category}
                    </span>
                  )}
                  <span>{sq.question}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Answer Presentation Card */}
      {qaResult && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Synthesized Answer Box */}
          <div
            className={`p-6 rounded-3xl border shadow-md space-y-4 ${
              qaResult.found
                ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-800/80'
                : 'bg-amber-50/60 dark:bg-slate-900 border-amber-200 dark:border-amber-800/60'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${
                    qaResult.found
                      ? 'bg-gradient-to-tr from-indigo-600 to-purple-600'
                      : 'bg-amber-500'
                  }`}
                >
                  {qaResult.found ? <Sparkles className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {qaResult.found ? 'Synthesized Factual Answer' : 'No Relevant Information Found'}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Query execution: {qaResult.duration}ms</span>
                    <span>•</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      Confidence: {qaResult.confidence}%
                    </span>
                  </div>
                </div>
              </div>

              {qaResult.found && (
                <button
                  onClick={handleCopyAnswer}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedAnswer ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Answer</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Answer Content */}
            <div className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 font-normal">
              {qaResult.answer}
            </div>

            {/* Detailed Explanation and Recovery when Not Found */}
            {!qaResult.found && (
              <div className="p-4 rounded-2xl bg-amber-100/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-3 text-xs">
                <div className="flex items-center gap-2 font-semibold text-amber-900 dark:text-amber-200">
                  <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Why couldn't an answer be found?</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {qaResult.reason || 'None of the indexed text passages contained sufficient semantic or keyword overlap for this query.'}
                </p>

                {selectedDocId && (
                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400">Currently searching only in selected document.</span>
                    <button
                      onClick={handleClearScope}
                      className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-all cursor-pointer"
                    >
                      Search Across All Documents
                    </button>
                  </div>
                )}

                {/* Suggested alternative questions from the documents */}
                {qaResult.suggestedQuestions && qaResult.suggestedQuestions.length > 0 && (
                  <div className="pt-2 space-y-2 border-t border-amber-200/60 dark:border-amber-800/50">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Try asking one of these questions from your uploaded document instead:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {qaResult.suggestedQuestions.map((sq) => (
                        <button
                          key={sq.id}
                          onClick={() => {
                            setQuestion(sq.question);
                            handleAsk(sq.question);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 font-medium transition-all text-left flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-indigo-500" />
                          <span>{sq.question}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Source Citations Badges */}
            {qaResult.sources && qaResult.sources.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Verified Source References (Click to inspect):
                </span>
                <div className="flex flex-wrap gap-2">
                  {qaResult.sources.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => openDocumentViewer(src.docId, src.pageNum)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      title="Jump directly to this exact page in Document Viewer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span className="truncate max-w-[200px]">{src.docName}</span>
                      <span className="px-1.5 py-0.2 rounded bg-indigo-200/70 dark:bg-indigo-900 text-[10px] font-bold">
                        Page {src.pageNum}
                      </span>
                      <ExternalLink className="w-3 h-3 text-indigo-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Retrieved Evidence Passages List */}
          {qaResult.passages && qaResult.passages.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Original Source Passages Ranked by BM25 ({qaResult.passages.length})</span>
                </h3>
              </div>

              <div className="space-y-3">
                {qaResult.passages.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2 hover:border-indigo-300 dark:hover:border-indigo-800/80 transition-all"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {p.docName}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-400 text-[11px]">
                          Page {p.pageNum}
                        </span>
                        {p.hasMath && (
                          <span className="px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-semibold">
                            Formula / Math
                          </span>
                        )}
                        {p.hasDefinition && (
                          <span className="px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-semibold">
                            Definition
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-[11px]">
                          Score: {p.score}%
                        </span>
                        <button
                          onClick={() => openDocumentViewer(p.docId, p.pageNum)}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <p
                      className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(p.text, qaResult.question),
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
