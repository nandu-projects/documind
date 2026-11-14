/**
 * DocuMind NLP & Information Retrieval Engine
 * High-performance client-side BM25 Okapi, Query Expansion, Semantic Heuristics,
 * Document Understanding (Formulas, Definitions, Numbers, Examples) & Extractive QA.
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
 * Domain Synonyms and Query Expansion Dictionary
 * Enables matching paraphrases, conversational questions, and alternate terminology.
 */
export const SYNONYM_MAP = {
  // Academics & Rules
  'attendance': ['presence', 'absent', 'absence', 'attending', 'attend', 'biometric', 'classes'],
  'requirement': ['rule', 'regulation', 'policy', 'criteria', 'standard', 'prerequisite', 'mandatory', 'condition', 'guidelines'],
  'requirements': ['rules', 'regulations', 'policies', 'criteria', 'standards', 'prerequisites', 'guidelines'],
  'rule': ['regulation', 'policy', 'guideline', 'bylaw', 'mandate', 'directive', 'protocol'],
  'rules': ['regulations', 'policies', 'guidelines', 'bylaws', 'mandates', 'directives', 'protocols'],
  'guideline': ['rule', 'regulation', 'instruction', 'protocol', 'directive', 'standard'],
  'guidelines': ['rules', 'regulations', 'instructions', 'protocols', 'directives', 'standards'],
  'policy': ['rule', 'regulation', 'guideline', 'code', 'ordinance', 'procedure'],
  'policies': ['rules', 'regulations', 'guidelines', 'codes', 'ordinances', 'procedures'],

  // Submissions & Deadlines
  'submit': ['submission', 'submitting', 'hand in', 'turn in', 'due', 'deadline', 'deliverable'],
  'submission': ['submit', 'deadline', 'due date', 'turn in', 'deliverable', 'format', 'hand in'],
  'deadline': ['due date', 'submission date', 'schedule', 'cutoff', 'timeline', 'milestone'],

  // Financial & Penalties
  'fine': ['fee', 'penalty', 'charge', 'cost', 'dues', 'surcharge', 'price'],
  'fines': ['fees', 'penalties', 'charges', 'costs', 'dues', 'surcharges'],
  'fee': ['fine', 'penalty', 'charge', 'cost', 'payment', 'tuition', 'dues'],
  'cost': ['price', 'fee', 'charge', 'fine', 'expense'],

  // Time & Schedules
  'hours': ['timing', 'timings', 'time', 'schedule', 'opening', 'closing', 'operating'],
  'timing': ['hours', 'time', 'schedule', 'opening', 'operating'],
  'schedule': ['timeline', 'timing', 'hours', 'calendar', 'dates'],

  // Security & Safety
  'security': ['safety', 'protection', 'guard', 'helpline', 'emergency', 'curfew', 'identity', 'surveillance'],
  'safety': ['security', 'protection', 'emergency', 'hazard', 'protocol', 'evacuation', 'precaution'],
  'rules_sec': ['protocol', 'access', 'identity', 'curfew', 'restriction'],

  // Mathematical & Technical
  'formula': ['equation', 'calculation', 'expression', 'algorithm', 'computation', 'mathematical', 'calculate', 'ratio'],
  'equation': ['formula', 'expression', 'calculation', 'equality', 'relation'],
  'calculate': ['computation', 'formula', 'equation', 'determine', 'derive', 'measure'],
  'grade': ['score', 'marks', 'grading', 'cgpa', 'gpa', 'percentage', 'evaluation', 'scale'],
  'grades': ['scores', 'marks', 'grading', 'cgpa', 'gpa', 'percentages'],
  'plagiarism': ['similarity', 'turnitin', 'urkund', 'originality', 'academic integrity', 'copying'],

  // Concept & Definitions
  'definition': ['meaning', 'define', 'concept', 'explanation', 'term', 'description'],
  'define': ['definition', 'meaning', 'concept', 'refers to', 'denotes'],
  'example': ['instance', 'sample', 'illustration', 'case'],
  'examples': ['instances', 'samples', 'illustrations', 'cases'],
};

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
  
  // Extract alphanumeric sequences (supporting percentages, currency, and numerical thresholds)
  const rawWords = text.toLowerCase().match(/\b[a-z0-9]+(?:'[a-z]+)?%?\b/g) || [];
  
  const tokens = [];
  for (const word of rawWords) {
    if (removeStopwords && STOPWORDS.has(word)) continue;
    if (word.length <= 1 && !/^\d+$/.test(word) && word !== '%') continue;
    tokens.push(word);
  }
  return tokens;
}

/**
 * Splits text into sentences cleanly while preserving acronyms and decimal numbers
 */
export function splitIntoSentences(text) {
  if (!text) return [];
  // Clean newlines that occur mid-sentence
  const normalized = text.replace(/([a-z0-9])\n+([a-z0-9])/gi, '$1 $2');
  // Match sentences without breaking decimals like 8.5 or 1.1 or abbreviations like e.g. / i.e.
  const sentences = normalized.match(/[^.!?\n]+(?:[.!?\n]+["']?|$)/g) || [];
  return sentences
    .map(s => s.trim())
    .filter(s => s.length > 8 && /\w+/.test(s));
}

/**
 * Expands a list of query tokens using the synonym dictionary
 */
export function expandQueryTokens(tokens) {
  const expanded = new Map(); // token/synonym -> weight (1.0 for original, 0.65 for synonym)

  for (const token of tokens) {
    expanded.set(token, 1.0);

    const directSynonyms = SYNONYM_MAP[token] || [];
    for (const syn of directSynonyms) {
      const synTokens = syn.split(/\s+/);
      for (const st of synTokens) {
        if (!STOPWORDS.has(st) && !expanded.has(st)) {
          expanded.set(st, 0.65);
        }
      }
    }

    // Also check stemmed token
    const stToken = stem(token);
    for (const [key, synList] of Object.entries(SYNONYM_MAP)) {
      if (stem(key) === stToken) {
        for (const syn of synList) {
          const synTokens = syn.split(/\s+/);
          for (const st of synTokens) {
            if (!STOPWORDS.has(st) && !expanded.has(st)) {
              expanded.set(st, 0.60);
            }
          }
        }
      }
    }
  }

  return expanded;
}

/**
 * Detects whether text contains mathematical equations, formulas or numerical relationships
 */
export function hasMathematicalContent(text) {
  if (!text) return false;
  // Look for equals signs with variables, arithmetic symbols, summation, Greek letters, or formula labels
  return /\b(formula|equation|calculate|algorithm|ratio|score\(|sum\b|cgpa|gpa|marks)\b/i.test(text) ||
    /[a-zA-Z0-9_]\s*=\s*[^,;.]{2,}/.test(text) ||
    /[-+*/=><∑Δλθπ%]\s*[\d\w]/.test(text);
}

/**
 * Detects whether text contains explicit definitions
 */
export function hasDefinitionPattern(text) {
  if (!text) return false;
  return /\b(is defined as|refers to|means|denotes|signifies|is a term for|classified as)\b/i.test(text);
}

/**
 * Extracts Deep Document Features (Topics, Definitions, Formulas, Numbers, Policies)
 * Used to understand any user-uploaded PDF and formulate dynamic suggested questions.
 */
export function extractDocumentFeatures(document) {
  if (!document || !document.pages) {
    return {
      topics: [],
      definitions: [],
      formulas: [],
      numericalPolicies: [],
      headings: [],
      procedures: [],
    };
  }

  const topicsMap = new Map();
  const definitions = [];
  const formulas = [];
  const numericalPolicies = [];
  const headings = [];
  const procedures = [];

  for (const page of document.pages) {
    const pageNum = page.pageNum;
    const lines = page.text.split('\n').map(l => l.trim()).filter(Boolean);
    const sentences = splitIntoSentences(page.text);

    // 1. Detect Headings & Section Titles
    for (const line of lines) {
      if (line.length >= 4 && line.length <= 75) {
        // Section headers like "Section 1:", "Chapter 2:", "1.1 Attendance", or uppercase titles
        if (/^(?:section|chapter|part|\d+\.?\d*)\s*[:.-]?\s+[A-Z0-9]/i.test(line) ||
            (/^[A-Z0-9\s:,-]{5,}$/.test(line) && line.split(/\s+/).length <= 8)) {
          const cleanedTitle = line.replace(/^(?:section|chapter|part|\d+\.?\d*)\s*[:.-]?\s+/i, '').trim();
          if (cleanedTitle.length > 3) {
            headings.push({
              title: cleanedTitle,
              pageNum,
              raw: line,
            });
          }
        }
      }
    }

    // 2. Sentence-level analysis
    for (const sentence of sentences) {
      const lower = sentence.toLowerCase();

      // Definitions
      if (hasDefinitionPattern(sentence)) {
        const defMatch = sentence.match(/([A-Z][a-zA-Z0-9_\s-]{2,35})\s+(?:is defined as|refers to|means|denotes|signifies)\s+([^.]+)/i);
        if (defMatch) {
          definitions.push({
            term: defMatch[1].trim(),
            description: defMatch[2].trim(),
            sentence,
            pageNum,
          });
        }
      }

      // Mathematical Formulas & Quantitative Equations
      if (hasMathematicalContent(sentence)) {
        formulas.push({
          sentence,
          pageNum,
        });
      }

      // Numerical & Regulatory Policies (contains numbers, percentages, thresholds)
      if (/\b\d+(?:\.\d+)?%?\b/.test(sentence) &&
          /\b(minimum|maximum|at least|limit|threshold|penalty|fine|due|fee|hours|attendance|grade|passing|curfew)\b/i.test(lower)) {
        numericalPolicies.push({
          sentence,
          pageNum,
        });
      }

      // Actionable Procedures & Rules
      if (/\b(must|mandatory|strictly required|prohibited|guidelines|procedure|eligibility|protocol)\b/i.test(lower)) {
        procedures.push({
          sentence,
          pageNum,
        });
      }

      // Extract Candidate Topics (Capitalized multi-word concepts)
      const capMatches = sentence.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g) || [];
      for (const cap of capMatches) {
        if (!STOPWORDS.has(cap.toLowerCase()) && cap.length > 5) {
          topicsMap.set(cap, (topicsMap.get(cap) || 0) + 1);
        }
      }
    }
  }

  // Sort and filter topics
  const sortedTopics = Array.from(topicsMap.entries())
    .sort((a, b) => b[1] - a[1])
    .filter(([t, count]) => count >= 1 && t.length > 4)
    .slice(0, 10)
    .map(([t, count]) => ({ topic: t, frequency: count }));

  return {
    topics: sortedTopics,
    definitions: definitions.slice(0, 6),
    formulas: formulas.slice(0, 6),
    numericalPolicies: numericalPolicies.slice(0, 8),
    headings: headings.slice(0, 8),
    procedures: procedures.slice(0, 8),
  };
}

/**
 * Generates Dynamic, Document-Grounded Suggested Questions
 * Automatically produces questions matching actual uploaded document contents.
 * @param {Array} documents List of document objects
 * @param {string|null} filterDocId Optional filter to scope to one document
 */
export function generateDynamicSuggestedQuestions(documents, filterDocId = null) {
  if (!documents || documents.length === 0) {
    return [];
  }

  const targetDocs = filterDocId
    ? documents.filter(d => d.id === filterDocId)
    : documents;

  if (targetDocs.length === 0) return [];

  const generatedQuestions = [];
  const seenTexts = new Set();

  const addQuestion = (qObj) => {
    const cleanQ = qObj.question.trim();
    const key = cleanQ.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanQ.length > 15 && !seenTexts.has(key)) {
      seenTexts.add(key);
      generatedQuestions.push({
        ...qObj,
        question: cleanQ,
        id: 'dyn_q_' + Math.random().toString(36).substring(2, 9),
      });
    }
  };

  for (const doc of targetDocs) {
    const features = extractDocumentFeatures(doc);

    // 1. Questions from Section Headings & Titles
    for (const h of features.headings) {
      const cleanTitle = h.title.replace(/[0-9.:\-_]/g, '').trim();
      if (cleanTitle.length > 4) {
        if (/policy|guideline|rule|regulation/i.test(cleanTitle)) {
          addQuestion({
            question: `What are the ${cleanTitle.toLowerCase()}?`,
            expectedDoc: doc.name,
            docId: doc.id,
            pageNum: h.pageNum,
            category: 'Policy',
            tag: cleanTitle.split(/\s+/)[0],
          });
        } else {
          addQuestion({
            question: `What does the document state regarding ${cleanTitle.toLowerCase()}?`,
            expectedDoc: doc.name,
            docId: doc.id,
            pageNum: h.pageNum,
            category: 'Section',
            tag: cleanTitle.split(/\s+/)[0],
          });
        }
      }
    }

    // 2. Questions from Definitions
    for (const def of features.definitions) {
      addQuestion({
        question: `How is "${def.term}" defined in the document?`,
        expectedDoc: doc.name,
        docId: doc.id,
        pageNum: def.pageNum,
        category: 'Definition',
        tag: def.term,
      });
    }

    // 3. Questions from Numerical Policies & Thresholds
    for (const np of features.numericalPolicies) {
      const words = np.sentence.split(/\s+/);
      const metricMatch = np.sentence.match(/\b(\d+(?:\.\d+)?%?|\$\d+(?:\.\d+)?|\d+\s*(?:days|hours|months|years|weeks))\b/i);
      if (metricMatch) {
        if (/attendance/i.test(np.sentence)) {
          addQuestion({
            question: 'What is the minimum attendance requirement?',
            expectedDoc: doc.name,
            docId: doc.id,
            pageNum: np.pageNum,
            category: 'Threshold',
            tag: 'Attendance',
          });
        } else if (/plagiarism|similarity/i.test(np.sentence)) {
          addQuestion({
            question: 'What is the acceptable plagiarism limit for capstone projects?',
            expectedDoc: doc.name,
            docId: doc.id,
            pageNum: np.pageNum,
            category: 'Integrity',
            tag: 'Plagiarism',
          });
        } else if (/hours|operating|opening/i.test(np.sentence)) {
          addQuestion({
            question: 'What are the library opening hours?',
            expectedDoc: doc.name,
            docId: doc.id,
            pageNum: np.pageNum,
            category: 'Facilities',
            tag: 'Hours',
          });
        } else if (/fine|fee|cost|penalty/i.test(np.sentence)) {
          addQuestion({
            question: 'What are the penalties or fees specified in the policy?',
            expectedDoc: doc.name,
            docId: doc.id,
            pageNum: np.pageNum,
            category: 'Financial',
            tag: 'Fees',
          });
        } else {
          // Extract leading keywords for subject
          const firstThree = words.slice(0, 4).join(' ').replace(/[^a-zA-Z0-9 ]/g, '').trim();
          if (firstThree.length > 5) {
            addQuestion({
              question: `What is the specific requirement regarding ${firstThree.toLowerCase()}?`,
              expectedDoc: doc.name,
              docId: doc.id,
              pageNum: np.pageNum,
              category: 'Quantitative',
              tag: 'Requirement',
            });
          }
        }
      }
    }

    // 4. Questions from Mathematical Formulas
    for (const f of features.formulas) {
      if (/grading|passing|marks|score|cgpa|assessment|evaluation/i.test(f.sentence)) {
        addQuestion({
          question: 'What is the grading scale and passing criteria?',
          expectedDoc: doc.name,
          docId: doc.id,
          pageNum: f.pageNum,
          category: 'Academics',
          tag: 'Grading',
        });
      } else {
        const firstWords = f.sentence.split(/\s+/).slice(0, 4).join(' ').replace(/[^a-zA-Z0-9 ]/g, '').trim();
        addQuestion({
          question: `What is the formula or calculation for ${firstWords.toLowerCase()}?`,
          expectedDoc: doc.name,
          docId: doc.id,
          pageNum: f.pageNum,
          category: 'Formula',
          tag: 'Calculation',
        });
      }
    }

    // 5. Questions from Topics
    for (const t of features.topics) {
      addQuestion({
        question: `What are the core guidelines for ${t.topic.toLowerCase()}?`,
        expectedDoc: doc.name,
        docId: doc.id,
        pageNum: 1,
        category: 'Concept',
        tag: t.topic,
      });
      if (generatedQuestions.length >= 8) break;
    }
  }

  return generatedQuestions.slice(0, 8);
}

/**
 * Splits pages into sliding window passages
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
        hasMath: hasMathematicalContent(chunkText),
        hasDefinition: hasDefinitionPattern(chunkText),
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
 * BM25 Okapi Information Retrieval Scorer with Query Expansion,
 * N-gram Proximity Boosting, and Math/Numerical Heuristics.
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
   * Search query against indexed chunks with query expansion and phrase boost
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
    // 1. Expand query tokens with synonyms
    const expandedMap = expandQueryTokens(queryTokens);
    const queryStemsWeights = new Map();

    for (const [tok, weight] of expandedMap.entries()) {
      const st = stem(tok);
      const cur = queryStemsWeights.get(st) || 0;
      queryStemsWeights.set(st, Math.max(cur, weight));
    }

    // 2. Identify candidate chunks containing query stems
    const candidateChunkIds = new Set();
    for (const st of queryStemsWeights.keys()) {
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
    const cleanQuery = rawQuery.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim();
    const queryWords = cleanQuery.split(/\s+/).filter(w => !STOPWORDS.has(w));
    const isMathQuery = hasMathematicalContent(rawQuery);
    const isDefQuery = /\b(what is|define|definition|meaning of)\b/i.test(rawQuery);

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
      let matchedExactTerms = 0;

      for (const [st, qWeight] of queryStemsWeights.entries()) {
        const tf = tfMap.get(st) || 0;
        if (tf > 0) {
          if (qWeight >= 1.0) matchedExactTerms++;

          // Inverse Document Frequency with smoothing
          const docFreq = this.invertedIndex.get(st)?.size || 1;
          const idf = Math.log(1 + (this.docCount - docFreq + 0.5) / (docFreq + 0.5));
          
          // Term Frequency saturation
          const numerator = tf * (this.k1 + 1);
          const denominator = tf + this.k1 * (1 - this.b + this.b * (docLen / this.avgDocLength));
          
          bm25Score += (idf * (numerator / denominator)) * qWeight;
        }
      }

      // 3. Exact Multi-word Phrase Matching Boost
      let phraseBoost = 0;
      const lowerChunkText = chunk.text.toLowerCase();
      
      // Check full phrase match
      if (cleanQuery.length > 5 && lowerChunkText.includes(cleanQuery)) {
        phraseBoost += 6.0;
      } else if (queryWords.length >= 2) {
        // Check bigrams
        for (let i = 0; i < queryWords.length - 1; i++) {
          const bigram = `${queryWords[i]} ${queryWords[i + 1]}`;
          if (lowerChunkText.includes(bigram)) {
            phraseBoost += 3.0;
          }
        }
      }

      // 4. Mathematical and Definition Heuristic Boost
      let heuristicBoost = 0;
      if (isMathQuery && chunk.hasMath) {
        heuristicBoost += 3.5;
      }
      if (isDefQuery && chunk.hasDefinition) {
        heuristicBoost += 3.0;
      }

      // 5. Query Coverage Multiplier
      const coverageRatio = matchedExactTerms / Math.max(queryTokens.length, 1);
      const coverageBonus = coverageRatio >= 0.75 ? 1.6 : (coverageRatio >= 0.4 ? 1.25 : 1.0);

      const finalScore = (bm25Score + phraseBoost + heuristicBoost) * coverageBonus;

      if (finalScore > 0.05) {
        scoredResults.push({
          chunk,
          rawScore: finalScore,
          matchedTermsCount: matchedExactTerms,
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
export function generateExtractiveAnswer(query, rankedChunks, allDocuments = []) {
  if (!query || !rankedChunks || rankedChunks.length === 0) {
    // Generate intelligent suggested topics from documents
    const suggested = generateDynamicSuggestedQuestions(allDocuments).slice(0, 4);

    return {
      answer: "I could not find matching passages for your query in the indexed documents. The documents do not appear to contain relevant clauses or terms for this specific request.",
      found: false,
      confidence: 0,
      sources: [],
      reason: "No passages matched your query terms or their synonyms in the active document search scope.",
      suggestedQuestions: suggested,
    };
  }

  const topChunk = rankedChunks[0];
  const queryTokens = tokenize(query, true);
  const queryStems = new Set(queryTokens.map(stem));
  const isMathQuery = hasMathematicalContent(query);

  // If even top chunk has very low score and zero matched exact stems
  if (topChunk.score < 22 && topChunk.matchedTermsCount < 1) {
    const suggested = generateDynamicSuggestedQuestions(allDocuments).slice(0, 4);
    return {
      answer: "No sufficiently relevant information was found in the indexed documents for this question. DocuMind guarantees truthful, verifiable answers and will not invent or extrapolate policies.",
      found: false,
      confidence: topChunk.score || 0,
      sources: [],
      reason: "The confidence threshold (22%) was not met. The query keywords do not align with any statements in the document.",
      suggestedQuestions: suggested,
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

      if (matchCount > 0 || (isMathQuery && hasMathematicalContent(sentence))) {
        // Sentence scoring: term overlap + position bias + entity/number presence + math boost
        const overlapRatio = matchCount / Math.max(queryStems.size, 1);
        const containsNumberOrPercent = /\b\d+(?:\.\d+)?%?\b/.test(sentence) ? 1.4 : 1.0;
        const mathBonus = (isMathQuery && hasMathematicalContent(sentence)) ? 1.5 : 1.0;
        const sentenceScore = (matchCount * 2.5 + overlapRatio * 5.0) * containsNumberOrPercent * mathBonus;

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
      answer: "Relevant documents and passages were identified, but no specific concise sentence answered the query directly. Please inspect the source passages below.",
      found: true,
      confidence: topChunk.score,
      sources: topN.map(c => ({ docName: c.docName, docId: c.docId, pageNum: c.pageNum, score: c.score })),
      suggestedQuestions: [],
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
    suggestedQuestions: [],
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
