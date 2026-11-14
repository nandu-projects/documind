import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Cpu,
  Layers,
  HelpCircle,
  PlayCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  Code2,
  FileCheck,
  Compass
} from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';

export default function ExhibitionGuide({ setActiveTab, onSelectQuestion }) {
  const { loadDemoWorkspace, uploadProgress } = useDocuments();
  const [activeSubTab, setActiveSubTab] = useState('demo_script'); // 'demo_script' | 'architecture' | 'evaluator_qa' | 'abstract'

  const demoSteps = [
    {
      step: 1,
      title: 'Initialize Demo Workspace',
      desc: 'Click "Load Demo Workspace" to populate the local IndexedDB with 4 realistic university policy documents.',
      action: () => loadDemoWorkspace(),
      btnText: 'Load Demo Data (1-Click)',
    },
    {
      step: 2,
      title: 'Test Extractive Question Answering',
      desc: 'Demonstrate natural language QA without hallucinations. Ask: "What is the minimum attendance requirement?"',
      action: () => {
        if (onSelectQuestion) onSelectQuestion('What is the minimum attendance requirement?');
        setActiveTab('qa');
      },
      btnText: 'Ask Attendance Question',
    },
    {
      step: 3,
      title: 'Verify Source Page Citations',
      desc: 'Demonstrate clicking on the "Page 1" citation badge in the answer card to jump directly to the original document page.',
      action: () => setActiveTab('qa'),
      btnText: 'Go to QA Citations',
    },
    {
      step: 4,
      title: 'Demonstrate Smart Summarization & PDF Export',
      desc: 'Generate executive summary, extracted topics, and download the report as a styled PDF using client-side jsPDF.',
      action: () => setActiveTab('summaries'),
      btnText: 'Go to Summarizer',
    },
    {
      step: 5,
      title: 'Prove 100% Privacy & Local Operation',
      desc: 'Open DevTools Network tab to prove zero external API calls or confidential document transmission.',
      action: () => setActiveTab('settings'),
      btnText: 'View Privacy Audit',
    },
  ];

  const evaluatorQA = [
    {
      q: 'How does DocuMind differ from typical ChatGPT / API wrappers?',
      a: 'Unlike third-party LLM wrappers that send confidential student/institution documents to external clouds and hallucinate fake facts, DocuMind operates 100% in-browser using local BM25 Okapi information retrieval, Porter-based tokenization, and deterministic sentence scoring. It guarantees zero privacy leakage and provides exact page-number verification.',
    },
    {
      q: 'What algorithm is used for passage retrieval?',
      a: 'DocuMind implements BM25 Okapi (Best Matching 25) with smoothed Inverse Document Frequency (IDF), term frequency saturation (k1 = 1.5), document length normalization (b = 0.75), and sliding window passage chunking with 30-word overlap. It also applies n-gram exact phrase boost for regulatory and legal clauses.',
    },
    {
      q: 'How does it extract text from multi-page PDFs locally?',
      a: 'It embeds Mozilla\'s official PDF.js engine via a dedicated web worker. It reads raw PDF binary byte arrays, extracts text runs with spatial coordinate reconstruction (tracking Y-offsets for genuine line breaks), and retains per-page boundaries.',
    },
    {
      q: 'How is data persisted without a backend server or database?',
      a: 'DocuMind utilizes the browser\'s native IndexedDB via the IDB Promise interface. It maintains structured object stores for documents, passage chunks, query logs, and activity feeds. Data persists seamlessly across browser reloads, system restarts, and operates completely offline.',
    },
    {
      q: 'How are the document summaries generated?',
      a: 'DocuMind applies extractive graph-based and TF-ISF (Term Frequency - Inverse Sentence Frequency) scoring. It ranks sentences by information density, policy cue words (e.g., "mandatory", "must", "deadline"), and extracts key bi-grams and unigrams for topic clustering.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Title Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/20">
          <Award className="w-3.5 h-3.5 text-amber-300" />
          <span>College Exhibition & Viva Voce Defense Kit</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          DocuMind — Project Presentation & Evaluation
        </h2>
        <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed max-w-2xl">
          Complete project documentation, live demonstration script, system architecture diagram, and frequently asked evaluator questions.
        </p>

        {/* Sub-tab navigation */}
        <div className="pt-2 flex flex-wrap gap-2">
          {[
            { id: 'demo_script', label: 'Live Demo Script', icon: PlayCircle },
            { id: 'architecture', label: 'System Architecture', icon: Cpu },
            { id: 'evaluator_qa', label: 'Evaluator Q&A (Viva)', icon: HelpCircle },
            { id: 'abstract', label: 'Project Abstract & Scope', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  active
                    ? 'bg-white text-indigo-900 shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtab 1: Demonstration Script */}
      {activeSubTab === 'demo_script' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              5-Step Live Demonstration Walkthrough
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Follow these sequential steps during your college exhibition or viva voce presentation.
            </p>
          </div>

          <div className="space-y-3">
            {demoSteps.map((step) => (
              <div
                key={step.step}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shrink-0 shadow-xs">
                    {step.step}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                      {step.desc}
                    </p>
                  </div>
                </div>

                <button
                  onClick={step.action}
                  disabled={uploadProgress.active}
                  className="shrink-0 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-center"
                >
                  <span>{step.btnText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 2: System Architecture */}
      {activeSubTab === 'architecture' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <span>DocuMind End-to-End System Architecture</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Modular pipeline combining PDF rendering, spatial text parsing, sliding-window chunking, BM25 Okapi IR, and extractive answer generation.
            </p>
          </div>

          {/* Architecture Pipeline Flow */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="font-bold text-indigo-600 dark:text-indigo-400">1. Ingestion Layer</div>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                <li>• Drag & Drop Multi-PDF</li>
                <li>• Header Magic-Byte Check</li>
                <li>• PDF.js Web Worker</li>
                <li>• Spatial text layout</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="font-bold text-purple-600 dark:text-purple-400">2. Indexing Layer</div>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                <li>• Sliding window passages</li>
                <li>• Stopword filtering</li>
                <li>• Porter rule-based stemmer</li>
                <li>• Inverted index creation</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="font-bold text-emerald-600 dark:text-emerald-400">3. Storage Layer</div>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                <li>• HTML5 IndexedDB (idb)</li>
                <li>• Document Store</li>
                <li>• Chunks Store</li>
                <li>• Query Logs & History</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="font-bold text-amber-600 dark:text-amber-400">4. Retrieval & QA</div>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                <li>• BM25 Okapi Scoring</li>
                <li>• N-gram Phrase Boost</li>
                <li>• Sentence Centrality QA</li>
                <li>• Verified Page Citations</li>
              </ul>
            </div>
          </div>

          {/* Mathematical Formulations */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/60 space-y-2 text-xs">
            <h4 className="font-bold text-indigo-950 dark:text-indigo-200">
              Mathematical Foundation (BM25 Okapi Algorithm):
            </h4>
            <div className="font-mono bg-white dark:bg-slate-900 p-3 rounded-xl border border-indigo-200/60 dark:border-indigo-800/60 text-slate-800 dark:text-slate-200 overflow-x-auto">
              Score(D, Q) = ∑ [ IDF(q) × ( f(q, D) × (k₁ + 1) ) / ( f(q, D) + k₁ × (1 - b + b × (|D| / avgdl)) ) ]
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              Parameters tuned for document regulations: k₁ = 1.5 (term frequency saturation), b = 0.75 (length normalization).
            </p>
          </div>
        </div>
      )}

      {/* Subtab 3: Evaluator Q&A */}
      {activeSubTab === 'evaluator_qa' && (
        <div className="space-y-3.5 animate-fadeIn">
          {evaluatorQA.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2"
            >
              <div className="flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.q}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6.5">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 4: Abstract & Objectives */}
      {activeSubTab === 'abstract' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5 animate-fadeIn text-xs sm:text-sm leading-relaxed">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Project Abstract
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Modern academic institutions, legal bodies, and research organizations handle hundreds of dense, multi-page PDF documents containing critical policies, curricula, and guidelines. Traditional keyword searches fail to comprehend natural language intent, while public Generative AI chatbots hallucinate false answers and breach confidentiality by uploading proprietary data to external cloud servers.
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              <strong>DocuMind</strong> solves this challenge by delivering an intelligent, 100% client-side document assistant powered by high-performance BM25 Okapi information retrieval, spatial PDF text extraction, sentence scoring, and persistent IndexedDB storage. Users can ask questions in natural English, obtain synthesized factual answers, jump directly to verifiable source pages, and export structured executive summaries—completely offline with zero API keys and zero cloud data leakage.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Key Objectives
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
              <li>Eliminate generative AI hallucinations through strictly grounded extractive synthesis.</li>
              <li>Ensure 100% privacy and zero cloud transmission of institutional documents.</li>
              <li>Provide instant, clickable source page citations for all extracted facts.</li>
              <li>Support persistent offline document libraries via browser-native IndexedDB.</li>
              <li>Generate exportable executive summaries in TXT and formatted PDF formats.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
