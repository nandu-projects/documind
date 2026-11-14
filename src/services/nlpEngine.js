/**
 * DocuMind NLP & Information Retrieval Engine
 * High-performance client-side BM25 Okapi & Extractive Question Answering
 */

// Comprehensive English stopwords list
export const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t',
  'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have',
  'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself',
  'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into',
  'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my',
  'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s',
  'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re',
  'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t',
  'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s',
  'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t',
  'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself',
  'yourselves', 'please', 'tell', 'show', 'give', 'find', 'explain'
]);

/**
 * Algorithmic rule-based stemmer (Porter-inspired) for inflection normalization
 */
export function stem(word) {
  if (!word || word.length < 3) return word;
  let w = word.toLowerCase();

  // Basic step 1: Plurals and suffixes
  if (w.endsWith('sses')) w = w.slice(0, -2);
  else if (w.endsWith('ies')) w = w.slice(0, -3) + 'y';
  else if (w.endsWith('ss')) { /* keep */ }
  else if (w.endsWith('s') && !w.endsWith('us') && !w.endsWith('is')) w = w.slice(0, -1);

  // Common noun/verb derivational suffixes
  if (w.endsWith('ational')) w = w.slice(0, -7) + 'ate';
  else if (w.endsWith('tional')) w = w.slice(0, -6) + 'tion';
  else if (w.endsWith('ization')) w = w.slice(0, -7) + 'ize';
  else if (w.endsWith('ation')) w = w.slice(0, -5) + 'ate';
  else if (w.endsWith('ment') && w.length > 7) w = w.slice(0, -4);
  else if (w.endsWith('ness') && w.length > 7) w = w.slice(0, -4);
  else if (w.endsWith('ities')) w = w.slice(0, -5) + 'y';
  else if (w.endsWith('ing') && w.length > 5) w = w.slice(0, -3);
  else if (w.endsWith('ed') && w.length > 4) w = w.slice(0, -2);
  else if (w.endsWith('ly') && w.length > 4) w = w.slice(0, -2);
  else if (w.endsWith('al') && w.length > 5) w = w.slice(0, -2);

  return w;
}

/**
 * Tokenizes string into cleaned words and stems
 */
export function tokenize(text, removeStopwords = true) {
  if (!text || typeof text !== 'string') return [];
  
  // Extract alphanumeric sequences
  const rawWords = text.toLowerCase().match(/\b[a-z0-9]+(?:'[a-z]+)?\b/g) || [];
  
  const tokens = [];
  for (const word of rawWords) {
    if (removeStopwords && STOPWORDS.has(word)) continue;
    if (word.length <= 1 && !/^\d+$/.test(word)) continue;
    tokens.push(word);
  }
  return tokens;
}

/**
 * Splits text into sentences cleanly
 */
export function splitIntoSentences(text) {
  if (!text) return [];
  // Clean newlines that occur mid-sentence
  const normalized = text.replace(/([a-z0-9])\n+([a-z0-9])/gi, '$1 $2');
  const sentences = normalized.match(/[^.!?]+(?:[.!?]+["']?|$)/g) || [];
  return sentences
    .map(s => s.trim())
    .filter(s => s.length > 10 && /\w+/.test(s));
}

/**
 * Splits pages into sliding window passages
 * @param {Object} document 
 * @param {number} chunkSize Words per chunk (default: 130)
 * @param {number} overlap Words overlap (default: 30)
 */
export function createChunksFromDocument(document, chunkSize = 130, overlap = 30) {
  const chunks = [];
  let globalChunkIndex = 0;

  for (const page of document.pages) {
    const pageText = page.text;
    if (!pageText || pageText.trim().length === 0) continue;

    // Split page into words
    const words = pageText.split(/\s+/).filter(Boolean);
    if (words.length === 0) continue;

    let start = 0;
    while (start < words.length) {
      const end = Math.min(start + chunkSize, words.length);
      const chunkWords = words.slice(start, end);
      const chunkText = chunkWords.join(' ');
      
      const tokens = tokenize(chunkText, false);
      const filteredTokens = tokens.filter(t => !STOPWORDS.has(t));
      const stems = filteredTokens.map(stem);

      chunks.push({
        id: `${document.id}_p${page.pageNum}_c${globalChunkIndex}`,
        docId: document.id,
        docName: document.name,
        pageNum: page.pageNum,
        chunkIndex: globalChunkIndex,
        text: chunkText,
        wordCount: chunkWords.length,
        tokens: filteredTokens,
        stems,
      });

      globalChunkIndex++;

      // If we reached the end of words on this page
      if (end >= words.length) break;
      start += (chunkSize - overlap);
    }
  }

  return chunks;
}

/**
 * BM25 Okapi Information Retrieval Scorer
 */
export class BM25Engine {
  constructor(chunks = [], options = {}) {
    this.k1 = options.k1 ?? 1.5;
    this.b = options.b ?? 0.75;
    this.chunks = chunks;
    this.docCount = chunks.length;
    this.docLengths = new Map();
    this.avgDocLength = 0;
    this.invertedIndex = new Map(); // stem -> Set of chunk ids
    this.termFreqs = new Map(); // chunkId -> Map(stem -> count)

    this.buildIndex();
  }

  buildIndex() {
    let totalLength = 0;

    for (const chunk of this.chunks) {
      const length = chunk.stems.length;
      this.docLengths.set(chunk.id, length);
      totalLength += length;

      const tf = new Map();
      for (const st of chunk.stems) {
        tf.set(st, (tf.get(st) || 0) + 1);

        if (!this.invertedIndex.has(st)) {
          this.invertedIndex.set(st, new Set());
        }
        this.invertedIndex.get(st).add(chunk.id);
      }
      this.termFreqs.set(chunk.id, tf);
    }

    this.avgDocLength = this.docCount > 0 ? (totalLength / this.docCount) : 1;
  }

  /**
   * Search query against indexed chunks
   * @param {string} query 
   * @param {Object} filters { docId, limit }
   */
  search(query, filters = {}) {
    if (!query || typeof query !== 'string' || this.docCount === 0) {
      return [];
    }

    const rawQueryTokens = tokenize(query, true);
    if (rawQueryTokens.length === 0) {
      // If all stopwords, fallback to all tokens
      const fallback = tokenize(query, false);
      if (fallback.length === 0) return [];
      return this.searchWithTokens(fallback, query, filters);
    }

    return this.searchWithTokens(rawQueryTokens, query, filters);
  }

  searchWithTokens(queryTokens, rawQuery, filters = {}) {
    const queryStems = queryTokens.map(stem);
    const queryStemCounts = new Map();
    for (const st of queryStems) {
      queryStemCounts.set(st, (queryStemCounts.get(st) || 0) + 1);
    }

    // Candidate chunks containing at least one query stem
    const candidateChunkIds = new Set();
    for (const st of queryStems) {
      const matching = this.invertedIndex.get(st);
      if (matching) {
        for (const id of matching) {
          candidateChunkIds.add(id);
        }
      }
    }

    if (candidateChunkIds.size === 0) {
      return [];
    }

    const scoredResults = [];
    const lowerQuery = rawQuery.toLowerCase();
    const queryPhrases = queryTokens.length >= 2 ? [rawQuery.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim()] : [];

    for (const chunkId of candidateChunkIds) {
      const chunk = this.chunks.find(c => c.id === chunkId);
      if (!chunk) continue;

      // Filter by docId if specified
      if (filters.docId && chunk.docId !== filters.docId) {
        continue;
      }

      const docLen = this.docLengths.get(chunkId) || 1;
      const tfMap = this.termFreqs.get(chunkId) || new Map();

      let bm25Score = 0;
      let matchedTermsCount = 0;

      for (const [st, qCount] of queryStemCounts.entries()) {
        const tf = tfMap.get(st) || 0;
        if (tf > 0) {
          matchedTermsCount++;
          // Inverse Document Frequency with smoothing
          const docFreq = this.invertedIndex.get(st)?.size || 1;
          const idf = Math.log(1 + (this.docCount - docFreq + 0.5) / (docFreq + 0.5));
          
          // Term Frequency saturation
          const numerator = tf * (this.k1 + 1);
          const denominator = tf + this.k1 * (1 - this.b + this.b * (docLen / this.avgDocLength));
          
          bm25Score += (idf * (numerator / denominator)) * qCount;
        }
      }

      // Exact Phrase Matching Boost
      let phraseBoost = 0;
      const lowerChunkText = chunk.text.toLowerCase();
      for (const phrase of queryPhrases) {
        if (phrase.length > 5 && lowerChunkText.includes(phrase)) {
          phraseBoost += 4.5;
        }
      }

      // Query coverage multiplier (rewarding chunks covering higher % of query terms)
      const coverageRatio = matchedTermsCount / queryStemCounts.size;
      const coverageBonus = coverageRatio >= 0.75 ? 1.5 : (coverageRatio >= 0.5 ? 1.2 : 1.0);

      const finalScore = (bm25Score + phraseBoost) * coverageBonus;

      if (finalScore > 0.05) {
        scoredResults.push({
          chunk,
          rawScore: finalScore,
          matchedTermsCount,
          coverageRatio,
        });
      }
    }

    scoredResults.sort((a, b) => b.rawScore - a.rawScore);

    // Normalize scores to percentage (0% to 100%)
    const maxScore = scoredResults[0]?.rawScore || 1;
    const limit = filters.limit || 10;

    return scoredResults.slice(0, limit).map(item => ({
      ...item.chunk,
      rawScore: item.rawScore,
      score: Math.min(99, Math.round((item.rawScore / Math.max(maxScore, 10)) * 60 + (item.coverageRatio * 39))),
      matchedTermsCount: item.matchedTermsCount,
      coverageRatio: item.coverageRatio,
    }));
  }
}

/**
 * Intelligent Answer Synthesizer
 * Formulates a grounded, factual answer based strictly on retrieved passages.
 */
export function generateExtractiveAnswer(query, rankedChunks) {
  if (!query || !rankedChunks || rankedChunks.length === 0) {
    return {
      answer: "I could not find any matching passages in your uploaded documents. Please try rephrasing your question or verify that the relevant document is uploaded.",
      found: false,
      confidence: 0,
      sources: [],
    };
  }

  const topChunk = rankedChunks[0];
  const queryTokens = tokenize(query, true);
  const queryStems = new Set(queryTokens.map(stem));

  // If even the top chunk has very low score or no matching stems
  if (topChunk.score < 25 && topChunk.matchedTermsCount < 1) {
    return {
      answer: "No sufficiently relevant information was found in the indexed documents for this question. DocuMind guarantees verifiable answers and will not fabricate information.",
      found: false,
      confidence: topChunk.score || 0,
      sources: [],
    };
  }

  // Extract sentences from top 3 passages
  const candidateSentences = [];
  const topN = rankedChunks.slice(0, 3);

  for (const chunk of topN) {
    const sentences = splitIntoSentences(chunk.text);
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      const sTokens = tokenize(sentence, true);
      const sStems = sTokens.map(stem);
      
      let matchCount = 0;
      for (const st of sStems) {
        if (queryStems.has(st)) matchCount++;
      }

      if (matchCount > 0) {
        // Sentence scoring: term overlap + position bias + entity/number presence
        const overlapRatio = matchCount / Math.max(queryStems.size, 1);
        const containsNumberOrPercent = /\b\d+(?:\.\d+)?%?\b/.test(sentence) ? 1.3 : 1.0;
        const sentenceScore = (matchCount * 2 + overlapRatio * 5) * containsNumberOrPercent;

        candidateSentences.push({
          sentence,
          score: sentenceScore,
          docName: chunk.docName,
          docId: chunk.docId,
          pageNum: chunk.pageNum,
          chunkId: chunk.id,
        });
      }
    }
  }

  if (candidateSentences.length === 0) {
    return {
      answer: "Relevant documents were identified, but no specific sentence directly answered your query. Please review the retrieved passages below.",
      found: true,
      confidence: topChunk.score,
      sources: topN.map(c => ({ docName: c.docName, docId: c.docId, pageNum: c.pageNum, score: c.score })),
    };
  }

  // Sort candidate sentences by relevance
  candidateSentences.sort((a, b) => b.score - a.score);

  // Pick top 2-3 unique non-redundant sentences
  const selectedSentences = [];
  const seenTexts = new Set();

  for (const cs of candidateSentences) {
    const normalized = cs.sentence.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seenTexts.has(normalized)) continue;
    seenTexts.add(normalized);
    selectedSentences.push(cs);
    if (selectedSentences.length >= 3) break;
  }

  // Construct structured answer
  const answerBody = selectedSentences.map(s => s.sentence).join(' ');
  
  // Collect distinct source pages
  const sourceMap = new Map();
  for (const cs of selectedSentences) {
    const key = `${cs.docId}_p${cs.pageNum}`;
    if (!sourceMap.has(key)) {
      sourceMap.set(key, {
        docName: cs.docName,
        docId: cs.docId,
        pageNum: cs.pageNum,
        score: topChunk.score,
      });
    }
  }

  return {
    answer: answerBody,
    found: true,
    confidence: topChunk.score,
    sources: Array.from(sourceMap.values()),
  };
}

/**
 * Highlights matching query words in text
 */
export function highlightText(text, query) {
  if (!text || !query) return text;
  const tokens = tokenize(query, true);
  if (tokens.length === 0) return text;

  // Escape regex special chars
  const pattern = tokens
    .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  if (!pattern) return text;

  try {
    const regex = new RegExp(`\\b(${pattern})\\b`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  } catch {
    return text;
  }
}
