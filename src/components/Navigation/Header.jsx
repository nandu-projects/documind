import React from 'react';
import {
  Menu,
  Sun,
  Moon,
  Sparkles,
  Search,
  Upload,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useDocuments } from '../../context/DocumentContext';

export default function Header({ activeTab, setActiveTab, setIsMobileOpen }) {
  const { isDark, toggleTheme } = useTheme();
  const { documents, loadDemoWorkspace, uploadProgress } = useDocuments();

  const getPageInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Dashboard Overview', desc: 'Real-time repository statistics, recent activity, and quick actions' };
      case 'qa':
        return { title: 'Intelligent Question Answering', desc: 'Ask natural English questions across documents with verified source citations' };
      case 'summaries':
        return { title: 'Smart Summarization', desc: 'Generate multi-level executive summaries, key takeaways, and PDF exports' };
      case 'search':
        return { title: 'Advanced BM25 Search', desc: 'Precision information retrieval with highlighted passages and relevance scoring' };
      case 'library':
        return { title: 'Document Library', desc: 'Manage uploaded PDF documents, view page counts, and inspect content' };
      case 'upload':
        return { title: 'Upload & Index Documents', desc: 'Client-side PDF extraction with sliding window passage chunking' };
      case 'exhibition':
        return { title: 'College Exhibition Presentation', desc: 'Complete project defense guide, system architecture, and evaluator Q&A' };
      case 'settings':
        return { title: 'Settings & Privacy Controls', desc: 'Configure BM25 parameters, local IndexedDB storage, and offline audit' };
      default:
        return { title: 'DocuMind', desc: 'AI-Powered Knowledge Assistant' };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(prev => !prev)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-hidden"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              {pageInfo.title}
            </h1>
            <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
              {pageInfo.desc}
            </p>
          </div>
        </div>

        {/* Right: Actions & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Loader */}
          {documents.length === 0 ? (
            <button
              onClick={loadDemoWorkspace}
              disabled={uploadProgress.active}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all cursor-pointer"
              title="Preload exhibition demo documents"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden md:inline">Load Demo Workspace</span>
              <span className="md:hidden">Demo</span>
            </button>
          ) : (
            <button
              onClick={loadDemoWorkspace}
              disabled={uploadProgress.active}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reload / Refresh Demo Workspace"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Demo</span>
            </button>
          )}

          {/* Quick QA Button */}
          {activeTab !== 'qa' && (
            <button
              onClick={() => setActiveTab('qa')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Ask Document</span>
            </button>
          )}

          {/* Upload Button */}
          {activeTab !== 'upload' && (
            <button
              onClick={() => setActiveTab('upload')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload PDF</span>
            </button>
          )}

          {/* Dark / Light Mode Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle theme"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700 hover:-rotate-12 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
