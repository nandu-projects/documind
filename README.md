# DocuMind — AI-Powered Knowledge Assistant

> **Production-grade, client-side intelligent document assistant.** Extract, search, and answer complex queries across multi-page PDFs with **100% verified source page citations**, BM25 Okapi information retrieval, and zero cloud data transmission.

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](https://opensource.org/licenses/MIT)
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-purple.svg)](https://vitejs.dev/)
[![100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20In--Browser-emerald.svg)]()
[![Zero API Keys](https://img.shields.io/badge/API%20Keys-None%20Required-amber.svg)]()

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack & Architecture](#technology-stack--architecture)
4. [Live Exhibition Demo Workspace](#live-exhibition-demo-workspace)
5. [Installation & Windows Startup](#installation--windows-startup)
6. [Information Retrieval & QA Engine](#information-retrieval--qa-engine)
7. [Testing & Quality Control](#testing--quality-control)
8. [Privacy & Security Auditing](#privacy--security-auditing)
9. [Limitations & Future Roadmap](#limitations--future-roadmap)
10. [College Exhibition & Viva Defense Guide](#college-exhibition--viva-defense-guide)

---

## 1. Project Overview

Academic institutions, legal offices, and research teams routinely handle dense multi-page PDFs containing regulations, bylaws, and research papers. Standard keyword finders fail to understand semantic inquiries, while public Cloud LLM wrappers leak sensitive data to third-party servers and hallucinate fabricated facts.

**DocuMind** eliminates these hazards through a high-performance **client-side Information Retrieval (IR) and Extractive Question Answering pipeline**. Running entirely inside the browser using Mozilla's PDF.js and HTML5 IndexedDB, DocuMind indexes document passages with sliding window boundaries, ranks passages via BM25 Okapi, synthesizes truthful factual answers, and cites exact page numbers.

---

## 2. Key Features

### A. Professional Dashboard
- Real-time repository metrics: Total Documents, Total Pages, Indexed Words, Query Count.
- Instant 1-click sample question triggers for immediate demonstration.
- Recent documents carousel with quick preview and direct question shortcuts.
- Live system activity log tracking document additions, searches, and summaries.

### B. PDF Document Management
- Multi-file drag-and-drop & native file picker.
- Page-by-page text extraction with coordinate-aware line break reconstruction using `pdfjs-dist`.
- File validation verifying `%PDF-` magic header bytes to block corrupted or disguised files.
- Document library with search, filtering, grid and table views, and deletion controls.
- Persistent local storage using IndexedDB across browser refreshes and system restarts.

### C. Intelligent Extractive Question Answering
- Natural English querying across all documents or filtered to a single document.
- Exact page number and document name citation chips with 1-click jump to page preview.
- Deterministic relevance confidence scores.
- Strict anti-hallucination guardrail: Explains clearly when an answer cannot be found.
- 1-click answer copy with clipboard notification.

### D. Smart Summarization & Reports
- Multi-level document summaries:
  - Executive Overview paragraph.
  - Actionable Takeaways with verified page citations.
  - Top concepts and domain topic frequency mining.
- Export summaries to clean plain text (`.txt`).
- Export formatted executive summaries directly to styled PDF documents via `jsPDF`.

### E. Advanced BM25 Search Engine
- Full-text search with term frequency saturation ($k_1 = 1.5$) and length normalization ($b = 0.75$).
- N-gram exact phrase boost for regulatory clauses.
- Highlighted query terms in search snippets.
- Sort results by relevance score, page number, or document name.

### F. Built-in Demo Mode
- 4 pre-configured, realistic college exhibition documents:
  1. `Campus_Academic_Policies_2026.pdf` (Minimum 75% attendance rule, condonation, grading scale)
  2. `Senior_Capstone_Project_Guidelines.pdf` (Submission rules, <15% plagiarism threshold)
  3. `Central_University_Library_Regulations.pdf` (8:00 AM - 10:00 PM operating hours, borrowing limits)
  4. `Campus_Security_and_Safety_Protocols.pdf` (Mandatory RFID student security rules, emergency helpline)
- 1-click loading without requiring personal files.

---

## 3. Technology Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + Vite 6 | Modern reactive UI with sub-second hot reload |
| **Styling & Design** | Tailwind CSS v4 + Lucide Icons | Responsive SaaS design with dark/light mode |
| **PDF Extraction** | Mozilla PDF.js (`pdfjs-dist`) | In-browser multi-page PDF text extraction |
| **Local Storage** | HTML5 IndexedDB (`idb`) | Zero-cloud persistent local object storage |
| **IR / Retrieval** | BM25 Okapi Algorithm + Stemming | Relevance ranking with sliding-window passages |
| **Document Export** | jsPDF | Client-side styled PDF generation |

---

## 4. Live Exhibition Demo Workspace

DocuMind includes pre-verified sample questions aligned with the exhibition dataset:
1. *"What is the minimum attendance requirement?"*
   - **Answer**: 75% mandatory attendance; condonation allowed between 65% and 74.9% for medical emergencies.
   - **Source**: `Campus_Academic_Policies_2026.pdf` — **Page 1**
2. *"What are the project submission guidelines?"*
   - **Answer**: 3-4 member teams, Phase-1 (30%) & Phase-2 (70%) reviews, IEEE format report.
   - **Source**: `Senior_Capstone_Project_Guidelines.pdf` — **Page 1 & Page 3**
3. *"What are the library opening hours?"*
   - **Answer**: Weekdays 8:00 AM to 10:00 PM; Weekends 9:00 AM to 5:00 PM; 24/7 digital portal.
   - **Source**: `Central_University_Library_Regulations.pdf` — **Page 1**
4. *"What are the student security rules?"*
   - **Answer**: Mandatory display of RFID Smart Identity Card; 24/7 security helpline (Ext. 5555).
   - **Source**: `Campus_Security_and_Safety_Protocols.pdf` — **Page 1**

---

## 5. Installation & Windows Startup

### Prerequisites
- Node.js v18+ or v20+
- Modern Web Browser (Google Chrome, Microsoft Edge, Firefox)

### Quick Start
```powershell
# 1. Clone or navigate to the repository
cd documind

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Windows 1-Click Launchers
Double click `start-documind.bat` or run `start-documind.ps1` in PowerShell to automatically install dependencies and launch the browser!

---

## 6. Information Retrieval & QA Engine

### Mathematical Foundation: BM25 Okapi
For a document passage $D$ and query $Q$:
$$\text{Score}(D, Q) = \sum_{q \in Q} \text{IDF}(q) \cdot \frac{f(q, D) \cdot (k_1 + 1)}{f(q, D) + k_1 \cdot \left(1 - b + b \cdot \frac{|D|}{\text{avgdl}}\right)}$$

Where:
- $\text{IDF}(q) = \ln\left(1 + \frac{N - n(q) + 0.5}{n(q) + 0.5}\right)$
- $k_1 = 1.5$: Term frequency saturation parameter
- $b = 0.75$: Document length normalization ratio
- Sliding window passage chunking: 130 words per passage with 30-word overlap

---

## 7. Testing & Quality Control

DocuMind includes an automated verification test suite covering 37 criteria:
```powershell
npm test
```
**Test Results: 37 / 37 PASSED (100%)**
- Tokenizer & English stopword removal
- Porter inflection stemmer
- Passage chunk boundary preservation
- Multi-document BM25 Okapi indexing
- Extractive answer formulation & citation accuracy for all 4 demo questions
- Hallucination refusal on out-of-domain queries
- Document summarizer & topic clustering
- PDF header magic byte check

---

## 8. Privacy & Security Auditing
- **100% In-Browser**: Open Chrome DevTools (`F12` $\rightarrow$ Network tab). When uploading files, asking questions, or generating summaries, zero network requests leave the device.
- **Zero API Keys**: No OpenAI, Anthropic, or external API keys needed.
- **IndexedDB Isolation**: Documents are stored strictly in the user's browser sandbox.

---

## 9. Limitations & Future Roadmap
- **Limitations**: Scanned raster image PDFs without an OCR layer require pre-OCR processing; complex tabular spreadsheets inside PDFs are parsed linearly.
- **Future Roadmap**:
  - Integration of in-browser WebAssembly Tesseract OCR for scanned PDF images.
  - Optional local WebLLM / ONNX Runtime for natural language answer paraphrasing.
  - Export citations to BibTeX and Mendeley formats.

---

## 10. College Exhibition & Viva Defense Guide
See [`COLLEGE_EXHIBITION.md`](./COLLEGE_EXHIBITION.md) for the project abstract, problem statement, methodology, system diagrams, and evaluator viva questions with complete answers.

---

**Developed for user `nandu-projects` • MIT License**
