import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  ShieldCheck,
  Database,
  Trash2,
  Cpu,
  CheckCircle2,
  HardDrive,
  Info,
  Sparkles,
  Layers,
  Lock
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useDocuments } from '../../context/DocumentContext';

export default function Settings() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { stats, resetLibrary, loadDemoWorkspace, uploadProgress } = useDocuments();
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to delete all indexed documents and query logs from your browser?')) {
      await resetLibrary();
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>Settings & Privacy Controls</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Manage local appearance, IndexedDB database storage, information retrieval tuning, and security audits.
        </p>
      </div>

      {/* Appearance Settings */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {isDark ? <Moon className="w-4.5 h-4.5 text-indigo-400" /> : <Sun className="w-4.5 h-4.5 text-amber-500" />}
          <span>Appearance & Theme</span>
        </h3>

        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Color Mode: <strong className="capitalize">{theme}</strong>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select between eye-friendly dark mode and crisp high-contrast light mode.
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            <span>Switch to {isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>

      {/* Privacy & Security Audit Checklist */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Privacy & Security Compliance Checklist</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {[
            {
              title: '100% In-Browser Execution',
              desc: 'PDF text parsing, tokenization, and BM25 IR run in client memory without external server dependencies.',
            },
            {
              title: 'Zero Cloud Transmission',
              desc: 'No confidential documents or user search queries are uploaded to third-party APIs or cloud databases.',
            },
            {
              title: 'Zero API Key Requirements',
              desc: 'Fully standalone architecture. No OpenAI, Anthropic, or external credentials required.',
            },
            {
              title: 'PDF Magic Bytes Validation',
              desc: 'Enforces strict file verification (%PDF- binary check) preventing malicious file camouflage.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40 flex items-start gap-3"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IndexedDB Local Storage Status */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600" />
          <span>Local Storage & IndexedDB Status</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Documents</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.totalDocs}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Total Pages</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.totalPages}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Passage Chunks</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.totalChunks}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Total Words</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.totalWords.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={loadDemoWorkspace}
            disabled={uploadProgress.active}
            className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
          >
            Reload 4 Exhibition Demo Documents
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear IndexedDB Database</span>
          </button>
        </div>

        {clearedNotice && (
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-fadeIn">
            ✓ Database successfully cleared!
          </p>
        )}
      </div>

      {/* Information Retrieval (IR) Tuning */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-600" />
          <span>BM25 Okapi Algorithm Parameters</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Standard parameter configurations calibrated for academic bylaws, specifications, and regulatory guidelines.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">k₁ = 1.5</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Term frequency saturation parameter. Controls how quickly repeated terms saturate.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">b = 0.75</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Document length normalization ratio. Penalizes overly lengthy documents.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">Overlap = 30w</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Sliding passage window overlap to avoid losing context across chunk boundaries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
