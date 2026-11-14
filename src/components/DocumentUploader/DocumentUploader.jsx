import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Copy,
  Layers,
  HelpCircle,
  Cpu,
  RefreshCw,
  Info
} from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';

export default function DocumentUploader({ setActiveTab }) {
  const { uploadPDFFiles, uploadProgress, loadDemoWorkspace } = useDocuments();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // { success, message, errors, duplicates, processedDocs }
  const [pendingFiles, setPendingFiles] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(e.target.files);
    }
  };

  const processFiles = async (files, options = { replaceDuplicates: false }) => {
    setUploadStatus(null);
    setPendingFiles(files);
    try {
      const result = await uploadPDFFiles(files, options);
      if (result.success || (result.duplicates && result.duplicates.length > 0)) {
        setUploadStatus({
          type: result.success ? 'success' : 'warning',
          message: result.success
            ? `Successfully extracted and indexed ${result.successCount} document(s)!`
            : 'Duplicate documents detected in your library.',
          errors: result.errors,
          duplicates: result.duplicates,
          processedDocs: result.processedDocs || [],
        });
      } else {
        setUploadStatus({
          type: 'error',
          message: 'No valid documents were processed.',
          errors: result.errors,
          duplicates: [],
          processedDocs: [],
        });
      }
    } catch (err) {
      setUploadStatus({
        type: 'error',
        message: err.message || 'An error occurred during PDF extraction.',
        errors: [],
        duplicates: [],
        processedDocs: [],
      });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleReplaceDuplicate = async () => {
    if (pendingFiles) {
      await processFiles(pendingFiles, { replaceDuplicates: true });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Intro Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Upload & Index Documents
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Upload multi-page PDFs. Text is spatially ordered, mathematical formulas and symbols are preserved, and duplicate files are detected locally via SHA-256.
        </p>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative p-10 sm:p-14 rounded-3xl border-2 border-dashed transition-all text-center cursor-pointer ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 hover:border-indigo-400 dark:hover:border-indigo-500/80 shadow-xs hover:shadow-lg'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Drag and drop your PDF files here
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Multi-column ordering • Math symbol preservation (∫, ∑, √, π, θ, ≥, ≤, x²) • SHA-256 duplicate checking
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all pointer-events-none"
            >
              Select Files from Computer
            </button>
          </div>
        </div>
      </div>

      {/* Live Progress Bar Card */}
      {uploadProgress.active && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 shadow-md space-y-3 animate-pulse">
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <FileText className="w-4 h-4 animate-spin" />
              <span>Processing: {uploadProgress.fileName}</span>
            </div>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              {uploadProgress.pagePercent}%
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress.pagePercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{uploadProgress.statusText}</span>
            {uploadProgress.totalFiles > 1 && (
              <span>
                Document {uploadProgress.currentFileIndex} of {uploadProgress.totalFiles}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Duplicate Document Detection Alert */}
      {uploadStatus && uploadStatus.duplicates && uploadStatus.duplicates.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 space-y-3 animate-fadeIn">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Copy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>Duplicate Document(s) Detected</span>
            </div>
            <button
              onClick={() => setUploadStatus(prev => ({ ...prev, duplicates: [] }))}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            The following files are already indexed in your library:
          </p>

          <ul className="text-xs space-y-1.5 list-disc list-inside">
            {uploadStatus.duplicates.map((dup, i) => (
              <li key={i}>
                <strong>"{dup.fileName}"</strong> — {dup.reason} (Matches existing: <em>{dup.existingDoc?.name}</em>)
              </li>
            ))}
          </ul>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={handleReplaceDuplicate}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace Existing Document</span>
            </button>
            <button
              onClick={() => setUploadStatus(prev => ({ ...prev, duplicates: [] }))}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              Keep Existing (Skip Re-indexing)
            </button>
          </div>
        </div>
      )}

      {/* Document Quality Assessment Check */}
      {uploadStatus && uploadStatus.processedDocs && uploadStatus.processedDocs.length > 0 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-600" />
              <span>Document Extraction Quality Check</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploadStatus.processedDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate" title={doc.name}>
                      {doc.name}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      SHA-256: {doc.hash ? doc.hash.substring(0, 16) + '...' : 'Verified'}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      doc.isScanned
                        ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                        : doc.qualityScore >= 85
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {doc.qualityRating} ({doc.qualityScore}%)
                  </span>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Pages</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{doc.pageCount}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Extracted Pages</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{doc.successfulPages}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Passages</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{doc.meaningfulPassages || 0}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Generated Questions: <strong>{doc.generatedQuestionsCount || 0}</strong></span>
                  </span>

                  {doc.hasMath && (
                    <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                      Math / Formulas Detected
                    </span>
                  )}
                </div>

                {/* Scanned / OCR Alert if any page is image-only */}
                {doc.ocrRequiredPages && doc.ocrRequiredPages.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">OCR Notice:</span> Pages{' '}
                      <strong>{doc.ocrRequiredPages.join(', ')}</strong> contain image-only or low-density text. Optical Character Recognition (OCR) is required to index bitmap images.
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 flex gap-3 justify-center">
            <button
              onClick={() => setActiveTab('qa')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ask Document Questions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              View Document Library
            </button>
          </div>
        </div>
      )}

      {/* Upload Feedback Status */}
      {uploadStatus && uploadStatus.type !== 'warning' && (
        <div
          className={`p-5 rounded-2xl border space-y-2 ${
            uploadStatus.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
              : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60 text-red-900 dark:text-red-200'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 font-bold text-sm">
              {uploadStatus.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              )}
              <span>{uploadStatus.message}</span>
            </div>
            <button
              onClick={() => setUploadStatus(null)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {uploadStatus.errors && uploadStatus.errors.length > 0 && (
            <div className="pt-2 border-t border-red-200 dark:border-red-800/40 space-y-1">
              <span className="text-xs font-semibold text-red-700 dark:text-red-300">Errors:</span>
              <ul className="text-xs list-disc list-inside space-y-0.5 text-red-600 dark:text-red-400">
                {uploadStatus.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Verification & Privacy Assurance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">100% In-Browser</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
              Documents are processed locally in RAM using Mozilla's PDF.js. Zero bytes leave your device.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Math & Reading Order</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
              Multi-column separation, hyphen repair, and unicode equations (∫, ∑, √, π, θ, ≥, ≤, x²) are preserved.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Duplicate Detection</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
              SHA-256 fingerprinting prevents re-indexing existing files and allows instant replacement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
