import React from 'react';
import {
  LayoutDashboard,
  MessageSquareCode,
  FileText,
  Search,
  Library,
  UploadCloud,
  Award,
  Settings,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Database,
  Layers
} from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';

export default function Sidebar({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) {
  const { stats, documents, loadDemoWorkspace, uploadProgress } = useDocuments();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'qa', label: 'Ask Questions', icon: MessageSquareCode, badge: 'AI Extractive' },
    { id: 'summaries', label: 'Smart Summaries', icon: FileText, badge: null },
    { id: 'search', label: 'Advanced Search', icon: Search, badge: null },
    { id: 'library', label: 'Document Library', icon: Library, badge: documents.length > 0 ? documents.length : null },
    { id: 'upload', label: 'Upload Documents', icon: UploadCloud, badge: null },
    { id: 'exhibition', label: 'Exhibition Guide', icon: Award, badge: 'College Ready' },
    { id: 'settings', label: 'Settings & Privacy', icon: Settings, badge: null },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">DocuMind</span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                  AI IR
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Knowledge Assistant</p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Demo Workspace trigger if library is empty */}
          {documents.length === 0 && (
            <div className="pt-4">
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800/80 dark:to-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
                <div className="flex items-center gap-2 mb-1.5 text-indigo-900 dark:text-indigo-200 font-semibold text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>First time here?</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  Instantly load 4 verified university policy documents to test QA and summarization.
                </p>
                <button
                  onClick={loadDemoWorkspace}
                  disabled={uploadProgress.active}
                  className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Load Demo Workspace</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Local Security & Stats Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>{stats.totalDocs} Docs</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Database className="w-3.5 h-3.5 text-purple-500" />
              <span>{stats.totalPages} Pages</span>
            </span>
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side • Local IDB</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
