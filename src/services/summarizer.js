import { jsPDF } from 'jspdf';
import { splitIntoSentences, tokenize, STOPWORDS } from './nlpEngine.js';

/**
 * Extracts top topics/keywords and n-grams from document pages
 */
export function extractTopTopics(pages, maxTopics = 8) {
  const wordFreq = new Map();
  const bigramFreq = new Map();

  for (const page of pages) {
    const rawTokens = tokenize(page.text, false);
    for (let i = 0; i < rawTokens.length; i++) {
      const w1 = rawTokens[i];
      if (!STOPWORDS.has(w1) && w1.length > 3) {
        wordFreq.set(w1, (wordFreq.get(w1) || 0) + 1);
      }

      if (i < rawTokens.length - 1) {
        const w2 = rawTokens[i + 1];
        if (!STOPWORDS.has(w1) && !STOPWORDS.has(w2) && w1.length > 2 && w2.length > 2) {
          const bigram = `${w1} ${w2}`;
          bigramFreq.set(bigram, (bigramFreq.get(bigram) || 0) + 1);
        }
      }
    }
  }

  // Combine top unigrams and bigrams
  const topics = [];
  const sortedBigrams = Array.from(bigramFreq.entries()).sort((a, b) => b[1] - a[1]);
  for (const [bigram, count] of sortedBigrams) {
    if (count >= 2) {
      topics.push({
        topic: bigram.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        frequency: count,
        type: 'concept'
      });
    }
    if (topics.length >= 4) break;
  }

  const sortedWords = Array.from(wordFreq.entries()).sort((a, b) => b[1] - a[1]);
  for (const [word, count] of sortedWords) {
    if (!topics.some(t => t.topic.toLowerCase().includes(word))) {
      topics.push({
        topic: word.charAt(0).toUpperCase() + word.slice(1),
        frequency: count,
        type: 'keyword'
      });
    }
    if (topics.length >= maxTopics) break;
  }

  return topics;
}

/**
 * Generates an extractive, structured summary of a document
 * @param {Object} document { name, pageCount, pages: [{ pageNum, text }] }
 */
export function generateDocumentSummary(document) {
  if (!document || !document.pages || document.pages.length === 0) {
    return null;
  }

  const allSentencesWithPages = [];
  const docWordFreq = new Map();
  let totalDocWords = 0;

  // Extract sentences with page tracking
  for (const page of document.pages) {
    const sentences = splitIntoSentences(page.text);
    for (const sent of sentences) {
      const tokens = tokenize(sent, true);
      for (const t of tokens) {
        docWordFreq.set(t, (docWordFreq.get(t) || 0) + 1);
        totalDocWords++;
      }
      allSentencesWithPages.push({
        sentence: sent,
        pageNum: page.pageNum,
        tokens,
        wordCount: sent.split(/\s+/).length,
      });
    }
  }

  if (allSentencesWithPages.length === 0) {
    return {
      executiveSummary: 'This document does not contain sufficient text content to generate a summary.',
      keyTakeaways: [],
      importantSentences: [],
      topics: [],
    };
  }

  // Calculate TF-ISF score for each sentence
  const scoredSentences = allSentencesWithPages.map((item, idx) => {
    let score = 0;
    for (const t of item.tokens) {
      const freq = docWordFreq.get(t) || 1;
      score += freq;
    }

    // Normalize by length
    const len = Math.max(item.tokens.length, 1);
    let normalizedScore = score / Math.sqrt(len);

    // Boost markers indicative of conclusions, rules, and core policies
    const lower = item.sentence.toLowerCase();
    if (/\b(must|mandatory|require|requirement|objective|rule|guideline|policy|prohibited|ensure|minimum|maximum|deadline)\b/.test(lower)) {
      normalizedScore *= 1.45;
    }
    if (/\b\d+(?:\.\d+)?%?\b/.test(lower)) {
      normalizedScore *= 1.2;
    }
    // Boost introductory sentences in the first page
    if (item.pageNum === 1 && idx < 5) {
      normalizedScore *= 1.25;
    }

    return {
      ...item,
      score: normalizedScore,
      index: idx,
    };
  });

  // Rank sentences
  const ranked = [...scoredSentences].sort((a, b) => b.score - a.score);

  // Pick top 4-6 diverse sentences for key takeaways (avoiding consecutive duplicates)
  const keyTakeaways = [];
  const seenPages = new Set();
  const seenNgrams = new Set();

  for (const s of ranked) {
    const simplified = s.sentence.toLowerCase().slice(0, 30);
    if (seenNgrams.has(simplified)) continue;
    seenNgrams.add(simplified);

    keyTakeaways.push({
      text: s.sentence,
      pageNum: s.pageNum,
      score: Math.round(s.score),
    });
    seenPages.add(s.pageNum);

    if (keyTakeaways.length >= 6) break;
  }

  // Pick top 3 sentences in chronological document order for Executive Overview
  const topForOverview = [...ranked.slice(0, 4)].sort((a, b) => a.index - b.index);
  const executiveSummary = topForOverview.map(s => s.sentence).join(' ');

  // Extract key topics
  const topics = extractTopTopics(document.pages, 8);

  return {
    docName: document.name,
    pageCount: document.pageCount,
    generatedAt: new Date().toLocaleString(),
    executiveSummary,
    keyTakeaways,
    importantSentences: ranked.slice(0, 8),
    topics,
  };
}

/**
 * Exports summary data to plain text format
 */
export function exportSummaryAsTxt(summary, docName) {
  if (!summary) return;

  let text = `=======================================================\n`;
  text += ` DOCUMIND — DOCUMENT KNOWLEDGE SUMMARY\n`;
  text += ` Document: ${docName}\n`;
  text += ` Generated: ${summary.generatedAt || new Date().toLocaleString()}\n`;
  text += ` Total Pages Analyzed: ${summary.pageCount || 'N/A'}\n`;
  text += `=======================================================\n\n`;

  text += `1. EXECUTIVE OVERVIEW\n`;
  text += `-------------------------------------------------------\n`;
  text += `${summary.executiveSummary}\n\n`;

  text += `2. KEY TOPICS & FREQUENT DOMAIN CONCEPTS\n`;
  text += `-------------------------------------------------------\n`;
  text += summary.topics.map(t => `• ${t.topic} (${t.frequency} mentions)`).join('\n') + `\n\n`;

  text += `3. CORE TAKEAWAYS & ACTIONABLE POLICIES\n`;
  text += `-------------------------------------------------------\n`;
  text += summary.keyTakeaways.map((k, i) => `${i + 1}. [Page ${k.pageNum}] ${k.text}`).join('\n\n') + `\n\n`;

  text += `=======================================================\n`;
  text += ` Processed locally in-browser by DocuMind AI Engine.\n`;
  text += ` Zero cloud transmission. Privacy preserved.\n`;
  text += `=======================================================\n`;

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${docName.replace(/\.pdf$/i, '')}_DocuMind_Summary.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports summary to PDF format using jsPDF
 */
export function exportSummaryAsPdf(summary, docName) {
  if (!summary) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - (margin * 2);
  let y = 18;

  // Header banner
  doc.setFillColor(79, 70, 229); // Indigo 600
  doc.rect(margin, y, contentWidth, 22, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('DocuMind — Document Knowledge Summary', margin + 6, y + 9);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Document: ${docName} | Pages: ${summary.pageCount} | Generated: ${summary.generatedAt}`, margin + 6, y + 16);

  y += 30;

  // Executive Overview Section
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Executive Overview', margin, y);
  y += 6;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const overviewLines = doc.splitTextToSize(summary.executiveSummary, contentWidth);
  doc.text(overviewLines, margin, y);
  y += (overviewLines.length * 5) + 8;

  // Topics Section
  if (y > 240) { doc.addPage(); y = 20; }
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Core Topics & Extracted Concepts', margin, y);
  y += 6;

  const topicText = summary.topics.map(t => `${t.topic} (${t.frequency}x)`).join('  •  ');
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(99, 102, 241);
  const topicLines = doc.splitTextToSize(topicText, contentWidth);
  doc.text(topicLines, margin, y);
  y += (topicLines.length * 5) + 8;

  // Key Takeaways Section
  if (y > 240) { doc.addPage(); y = 20; }
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Key Takeaways & Source Citations', margin, y);
  y += 6;

  doc.setFontSize(9.5);
  summary.keyTakeaways.forEach((item, index) => {
    if (y > 265) { doc.addPage(); y = 20; }
    
    // Page Badge
    doc.setFillColor(238, 242, 255);
    doc.roundedRect(margin, y - 4, 18, 5.5, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text(`Page ${item.pageNum}`, margin + 2, y);

    // Sentence Text
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const itemLines = doc.splitTextToSize(item.text, contentWidth - 22);
    doc.text(itemLines, margin + 22, y);
    y += Math.max(itemLines.length * 4.8, 7) + 3;
  });

  // Footer banner
  const footerY = doc.internal.pageSize.getHeight() - 12;
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated 100% locally by DocuMind AI Engine • Zero Cloud Data Transmission', margin, footerY);

  doc.save(`${docName.replace(/\.pdf$/i, '')}_DocuMind_Summary.pdf`);
}
