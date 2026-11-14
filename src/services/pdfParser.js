import * as pdfjsLib from 'pdfjs-dist';

// Use the local worker copied to public folder for 100% offline reliability
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

/**
 * Calculates SHA-256 hash of a PDF arrayBuffer for duplicate detection
 */
export async function computePDFHash(arrayBuffer) {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback below
    }
  }

  // Fast polynomial hash fallback
  let hash = 0x811c9dc5;
  const view = new Uint8Array(arrayBuffer);
  const sampleSize = Math.min(view.length, 128000);
  for (let i = 0; i < sampleSize; i++) {
    hash ^= view[i];
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16) + '_' + view.length;
}

/**
 * Validates whether the given file or arrayBuffer is a valid PDF
 */
export async function validatePDFFile(file) {
  if (!file) {
    throw new Error('No file provided.');
  }

  const isPdfExtension = file.name.toLowerCase().endsWith('.pdf');
  const isPdfMime = file.type === 'application/pdf' || file.type === '';

  if (!isPdfExtension && !isPdfMime) {
    throw new Error(`Invalid file type for "${file.name}". Only standard PDF documents are supported.`);
  }

  // Check magic bytes %PDF-
  const headerSlice = await file.slice(0, 5).arrayBuffer();
  const headerView = new Uint8Array(headerSlice);
  const headerString = String.fromCharCode(...headerView);

  if (!headerString.startsWith('%PDF-')) {
    throw new Error(`The file "${file.name}" does not have a valid PDF header (%PDF-). It may be corrupted or disguised.`);
  }

  return true;
}

/**
 * Spatial Text Block & Multi-Column Reconstruction
 * Preserves reading order, joins hyphenated words, handles math symbols,
 * removes meaningless noise, and preserves paragraph cohesion.
 */
export function reconstructPageText(items, viewportWidth = 600) {
  if (!items || items.length === 0) {
    return {
      text: '',
      wordCount: 0,
      charCount: 0,
      hasMath: false,
      needsOCR: true,
      hasMultiColumn: false,
    };
  }

  // 1. Extract geometric bounds and clean raw items
  const cleanItems = [];
  let minX = Infinity;
  let maxX = -Infinity;

  for (const item of items) {
    if (!item.str || item.str.trim().length === 0) continue;
    
    // transform: [scaleX, skewY, skewX, scaleY, tx, ty]
    const x = item.transform ? item.transform[4] : 0;
    const y = item.transform ? item.transform[5] : 0;
    const width = item.width || 0;
    const height = item.height || 10;

    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x + width);

    cleanItems.push({
      str: item.str,
      x,
      y,
      width,
      height,
    });
  }

  if (cleanItems.length === 0) {
    return {
      text: '',
      wordCount: 0,
      charCount: 0,
      hasMath: false,
      needsOCR: true,
      hasMultiColumn: false,
    };
  }

  // 2. Multi-column Detection
  const pageWidth = maxX - minX;
  const midX = minX + (pageWidth / 2);
  let leftCount = 0;
  let rightCount = 0;
  let centerSpanningCount = 0;

  for (const it of cleanItems) {
    const itemEnd = it.x + it.width;
    if (it.x < midX && itemEnd > midX) {
      centerSpanningCount++;
    } else if (itemEnd <= midX) {
      leftCount++;
    } else if (it.x >= midX) {
      rightCount++;
    }
  }

  // If both left and right have significant items and few center-spanning items, treat as 2-column
  const isMultiColumn = leftCount > 15 && rightCount > 15 && centerSpanningCount < (leftCount + rightCount) * 0.15;

  let sortedItems;
  if (isMultiColumn) {
    // Sort left column top-to-bottom, then right column top-to-bottom
    const colLeft = cleanItems.filter(it => (it.x + it.width / 2) <= midX);
    const colRight = cleanItems.filter(it => (it.x + it.width / 2) > midX);

    colLeft.sort((a, b) => (b.y - a.y !== 0 ? b.y - a.y : a.x - b.x));
    colRight.sort((a, b) => (b.y - a.y !== 0 ? b.y - a.y : a.x - b.x));

    sortedItems = [...colLeft, ...colRight];
  } else {
    // Standard single-column: Top to bottom (descending Y), Left to right (ascending X)
    sortedItems = cleanItems.sort((a, b) => {
      const yDiff = b.y - a.y;
      if (Math.abs(yDiff) > 4) {
        return yDiff;
      }
      return a.x - b.x;
    });
  }

  // 3. Group items into lines
  const lines = [];
  let currentLine = [];
  let currentY = null;

  for (const it of sortedItems) {
    if (currentY === null || Math.abs(it.y - currentY) <= 3.5) {
      currentLine.push(it);
      currentY = it.y;
    } else {
      if (currentLine.length > 0) {
        currentLine.sort((a, b) => a.x - b.x);
        lines.push({
          y: currentY,
          text: currentLine.map(i => i.str).join(' ').replace(/\s+/g, ' ').trim(),
        });
      }
      currentLine = [it];
      currentY = it.y;
    }
  }

  if (currentLine.length > 0) {
    currentLine.sort((a, b) => a.x - b.x);
    lines.push({
      y: currentY,
      text: currentLine.map(i => i.str).join(' ').replace(/\s+/g, ' ').trim(),
    });
  }

  // 4. Paragraph & Sentence Reconstruction (repairing hyphenation & soft line breaks)
  const paragraphs = [];
  let currentPara = '';

  for (let i = 0; i < lines.length; i++) {
    let lineText = lines[i].text.trim();
    if (!lineText) continue;

    // Filter single-character noise artifacts (e.g. isolated stray dots or pipes)
    if (lineText.length === 1 && !/[0-9a-zA-Z∫∑√πθ]/.test(lineText)) {
      continue;
    }

    if (!currentPara) {
      currentPara = lineText;
      continue;
    }

    // Hyphenation repair: "algo-" + "rithm" -> "algorithm"
    if (currentPara.endsWith('-') && /^[a-z]/.test(lineText)) {
      currentPara = currentPara.slice(0, -1) + lineText;
      continue;
    }

    // Check if line is a new section heading, numbered item, or mathematical problem
    const isHeading = /^(?:section|chapter|part|\d+\.?\d*|problem|exercise|theorem|definition|lemma)\s*[:.-]?\s+[A-Z0-9]/i.test(lineText) ||
                      (/^[A-Z0-9\s:,-]{5,}$/.test(lineText) && lineText.split(/\s+/).length <= 7);

    // Check vertical distance from previous line
    const yDelta = lines[i - 1] ? Math.abs(lines[i - 1].y - lines[i].y) : 12;

    if (isHeading || yDelta > 16 || currentPara.endsWith('.') || currentPara.endsWith(':') || currentPara.endsWith('?')) {
      paragraphs.push(currentPara);
      currentPara = lineText;
    } else {
      // Soft line break: continue sentence
      currentPara += (currentPara.endsWith(' ') ? '' : ' ') + lineText;
    }
  }

  if (currentPara) {
    paragraphs.push(currentPara);
  }

  const fullText = paragraphs.join('\n\n').trim();
  const words = fullText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = fullText.length;

  // Check for mathematical symbols
  const hasMath = /[∫∑√πθ≥≤≠±∞∂αβγx²x³x₁x₂=+\-*/^]/.test(fullText) ||
                  /\b(formula|equation|integral|summation|theorem|derivative|limit|matrix|eigen)\b/i.test(fullText);

  // A page needs OCR if it has almost zero extractable words despite being a non-empty page
  const needsOCR = wordCount < 12;

  return {
    text: fullText,
    wordCount,
    charCount,
    hasMath,
    needsOCR,
    hasMultiColumn: isMultiColumn,
  };
}

/**
 * Extracts page-by-page text with spatial layout, math preservation,
 * duplicate detection hash, and extraction quality analytics.
 * @param {File|ArrayBuffer} fileInput 
 * @param {Function} onProgress (percent, currentPage, totalPages)
 * @returns {Promise<Object>}
 */
export async function extractPDFText(fileInput, onProgress = null) {
  let arrayBuffer;
  let fileName = 'document.pdf';
  let fileSize = 0;

  if (fileInput instanceof File || fileInput instanceof Blob) {
    fileName = fileInput.name || 'document.pdf';
    fileSize = fileInput.size || 0;
    await validatePDFFile(fileInput);
    arrayBuffer = await fileInput.arrayBuffer();
  } else if (fileInput instanceof ArrayBuffer) {
    arrayBuffer = fileInput;
    fileSize = arrayBuffer.byteLength;
  } else {
    throw new Error('Unsupported input type for PDF extraction.');
  }

  // Calculate SHA-256 hash for duplicate prevention
  const fileHash = await computePDFHash(arrayBuffer);

  let loadingTask;
  try {
    loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });
  } catch (err) {
    throw new Error(`Failed to initialize PDF parser for "${fileName}": ${err.message}`);
  }

  let pdf;
  try {
    pdf = await loadingTask.promise;
  } catch (err) {
    if (err.name === 'PasswordException') {
      throw new Error(`"${fileName}" is password protected. Password-encrypted PDFs are not supported for local text indexing.`);
    }
    throw new Error(`Could not parse "${fileName}". The file appears to be corrupted or invalid PDF format.`);
  }

  const numPages = pdf.numPages;
  if (numPages === 0) {
    throw new Error(`PDF "${fileName}" contains 0 pages.`);
  }

  const pages = [];
  let totalWords = 0;
  let successfulPagesCount = 0;
  let ocrRequiredPages = [];
  let docHasMath = false;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    try {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.0 });
      const textContent = await page.getTextContent();

      // Spatial reading order & sentence reconstruction
      const result = reconstructPageText(textContent.items, viewport.width);

      if (!result.needsOCR && result.wordCount >= 10) {
        successfulPagesCount++;
      } else {
        ocrRequiredPages.push(pageNum);
      }

      if (result.hasMath) {
        docHasMath = true;
      }

      totalWords += result.wordCount;

      pages.push({
        pageNum,
        text: result.text,
        wordCount: result.wordCount,
        charCount: result.charCount,
        hasMath: result.hasMath,
        needsOCR: result.needsOCR,
        hasMultiColumn: result.hasMultiColumn,
      });

      if (onProgress) {
        const percent = Math.round((pageNum / numPages) * 100);
        onProgress(percent, pageNum, numPages);
      }
    } catch (pageErr) {
      console.warn(`Error extracting text on page ${pageNum} of ${fileName}:`, pageErr);
      ocrRequiredPages.push(pageNum);
      pages.push({
        pageNum,
        text: `[Text extraction failed on page ${pageNum}]`,
        wordCount: 0,
        charCount: 0,
        hasMath: false,
        needsOCR: true,
        hasMultiColumn: false,
      });
    }
  }

  // Calculate Document Quality Assessment Metrics
  const qualityScore = Math.round((successfulPagesCount / numPages) * 100);
  const isScanned = (successfulPagesCount === 0) || (successfulPagesCount / numPages < 0.35);

  let qualityRating = 'High Quality';
  if (isScanned) {
    qualityRating = 'Scanned (OCR Required)';
  } else if (qualityScore < 70) {
    qualityRating = 'Partial Text Layer';
  } else if (qualityScore < 90) {
    qualityRating = 'Good Quality';
  }

  return {
    id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
    hash: fileHash,
    name: fileName,
    size: fileSize,
    pageCount: numPages,
    totalWords,
    successfulPages: successfulPagesCount,
    ocrRequiredPages,
    isScanned,
    qualityScore,
    qualityRating,
    hasMath: docHasMath,
    uploadDate: new Date().toISOString(),
    isDemo: false,
    pages,
  };
}
