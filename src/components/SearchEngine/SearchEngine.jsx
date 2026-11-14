import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  BookOpen,
  ExternalLink,
  Layers,
  Sparkles,
  FileText,
  Clock
} from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';
import { highlightText } from '../../services/nlpEngine';

export default function SearchEngine() {
  const { documents, executeSearch, openDocumentViewer, searchHistoryList } = useDocuments();
  const [query, setQuery] = useState('');
  const [selectedDocId, setSelectedDocId] = useState('');
  const [sortBy, setSortBy] = useState('relevance'); // 'relevance' | 'page' | 'doc'
  const [results, setResults] = useState([]);
  const [searchMeta, setSearchMeta] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (targetQuery = null) => {
    const q = (typeof targetQuery === 'string' ? targetQuery : query).trim();
    if (!q) return;

    setIsSearching(true);
    try {
      const filters = {};
      if (selectedDocId) filters.docId = selectedDocId;

      const res = await executeSearch(q, filters);
      setResults(res.results);
      setSearchMeta({
        query: q,
        duration: res.duration,
        total: res.totalMatches,
      });
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'relevance') {
      return (b.score || 0) - (a.score || 0);
    } else if (sortBy === 'page') {
      return (a.pageNum || 0) - (b.pageNum || 0);
    } else if (sortBy === 'doc') {
      return a.docName.localeCompare(b.docName);
    }
    return 0;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Search className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>Advanced Multi-Document Search</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          BM25 Okapi retrieval engine with token stemming, phrase boosting, and precise passage boundary tracking.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search keywords, phrases, regulations, clauses, policies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-12 pr-28 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-2 focus:outline-indigo-500"
          />
          <button
            onClick={() => handleSearch()}
            disabled={isSearching || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-600 dark:text-slate-400">Filter by Document:</span>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-indigo-500"
            >
              <option value="">All Documents ({documents.length})</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-600 dark:text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-indigo-500"
            >
              <option value="relevance">Highest Relevance</option>
              <option value="page">Page Number (Ascending)</option>
              <option value="doc">Document Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Meta Feedback */}
      {searchMeta && (
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>
            Found <strong className="text-slate-900 dark:text-white">{searchMeta.total}</strong> relevant passages for "{searchMeta.query}"
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {searchMeta.duration} ms
          </span>
        </div>
      )}

      {/* Results List */}
      {searchMeta && sortedResults.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
          No passages found matching "{searchMeta.query}". Try alternative terms or synonyms.
        </div>
      ) : (
        <div className="space-y-3.5">
          {sortedResults.map((result, idx) => (
            <div
              key={result.id || idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800/80 transition-all space-y-3 group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-sm">
                    {result.docName}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                    Page {result.pageNum}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold text-xs">
                    Relevance: {result.score}%
                  </span>
                  <button
                    onClick={() => openDocumentViewer(result.docId, result.pageNum)}
                    className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                    title="Open Document at this page"
                  >
                    <span>View Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Passage text with highlights */}
              <p
                className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans"
                dangerouslySetInnerHTML={{
                  __html: highlightText(result.text, searchMeta?.query || query),
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Recent Searches Pill List */}
      {searchHistoryList.length > 0 && !searchMeta && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Recent Query History:
          </span>
          <div className="flex flex-wrap gap-2">
            {searchHistoryList.slice(0, 8).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setQuery(item.query);
                  handleSearch(item.query);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 text-xs font-medium transition-colors cursor-pointer"
              >
                {item.query}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
