import * as pdfjsLib from 'pdfjs-dist';

// Use the local worker copied to public folder for 100% offline reliability
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

/**
 * Validates whether the given file or arrayBuffer is a valid PDF
 */
export async function validatePDFFile(file) {
  if (!file) {
    throw new Error('No file provided.');
  }

  // Check file type / extension
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
 * Extracts page-by-page text from a PDF file using pdfjs-dist
 * @param {File|ArrayBuffer} fileInput 
 * @param {Function} onProgress (percent, currentPage, totalPages)
 * @returns {Promise<Object>} { name, size, pageCount, pages: [{ pageNum, text, wordCount }] }
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

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    try {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Reconstruct text with natural spacing
      let lastY = null;
      let pageText = '';

      for (const item of textContent.items) {
        if (!item.str) continue;
        
        // Detect line breaks based on transform Y coordinate changes
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 6) {
          pageText += '\n';
        } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
          pageText += ' ';
        }

        pageText += item.str;
        lastY = item.transform[5];
      }

      const cleanedText = pageText.trim();
      const words = cleanedText ? cleanedText.split(/\s+/).filter(Boolean) : [];
      const wordCount = words.length;
      totalWords += wordCount;

      pages.push({
        pageNum,
        text: cleanedText,
        wordCount,
      });

      if (onProgress) {
        const percent = Math.round((pageNum / numPages) * 100);
        onProgress(percent, pageNum, numPages);
      }
    } catch (pageErr) {
      console.warn(`Error extracting text on page ${pageNum} of ${fileName}:`, pageErr);
      pages.push({
        pageNum,
        text: `[Text extraction failed on page ${pageNum}]`,
        wordCount: 0,
      });
    }
  }

  return {
    id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
    name: fileName,
    size: fileSize,
    pageCount: numPages,
    totalWords,
    uploadDate: new Date().toISOString(),
    pages,
  };
}
