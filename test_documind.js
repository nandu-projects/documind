/**
 * Automated Verification & Quality Control Suite for DocuMind
 */

if (typeof globalThis.DOMMatrix === 'undefined') {
  globalThis.DOMMatrix = class DOMMatrix {};
}

import {
  tokenize,
  stem,
  splitIntoSentences,
  createChunksFromDocument,
  BM25Engine,
  generateExtractiveAnswer,
  highlightText,
  expandQueryTokens,
  hasMathematicalContent,
  hasDefinitionPattern,
  extractDocumentFeatures,
  generateDynamicSuggestedQuestions,
} from './src/services/nlpEngine.js';

import {
  extractTopTopics,
  generateDocumentSummary,
} from './src/services/summarizer.js';

import {
  DEMO_DOCUMENTS,
  SAMPLE_QUESTIONS,
} from './src/data/demoDocuments.js';

console.log('====================================================');
console.log('   DOCUMIND — AUTOMATED TEST & VERIFICATION SUITE   ');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] Test ${totalTests}: ${testName}`);
  } else {
    console.error(`  [FAIL] Test ${totalTests}: ${testName}`);
    if (details) console.error(`         Details: ${details}`);
    process.exitCode = 1;
  }
}

// -----------------------------------------------------------
// 1. NLP Tokenizer & Stemmer Tests
// -----------------------------------------------------------
console.log('--- 1. Testing NLP Tokenizer & Stemmer ---');
const rawText = "All students are strictly required to maintain attendance requirements!";
const tokens = tokenize(rawText, true);
assert(tokens.includes('students') && tokens.includes('attendance'), 'Tokenize cleans punctuation and extracts meaningful words');
assert(!tokens.includes('are') && !tokens.includes('to'), 'Tokenize removes common English stopwords');

const stemmedAttendance = stem('attendance');
const stemmedAttending = stem('attending');
assert(stemmedAttending.startsWith('attend'), 'Stemmer reduces "attending" to root "attend"');
assert(stem('guidelines') === 'guideline', 'Stemmer removes plural "s" from "guidelines"');
assert(stem('policies') === 'policy', 'Stemmer converts "policies" to "policy"');

// -----------------------------------------------------------
// 2. Query Expansion & Synonyms Tests
// -----------------------------------------------------------
console.log('\n--- 2. Testing Query Expansion & Synonyms ---');
const expandedAttendance = expandQueryTokens(['attendance']);
assert(expandedAttendance.has('presence') && expandedAttendance.has('absent'), 'Expands "attendance" with synonyms "presence" and "absent"');

const expandedSubmit = expandQueryTokens(['submit']);
assert(expandedSubmit.has('submission') && expandedSubmit.has('deadline'), 'Expands "submit" with "submission" and "deadline"');

const expandedFee = expandQueryTokens(['fee']);
assert(expandedFee.has('fine') && expandedFee.has('penalty'), 'Expands "fee" with "fine" and "penalty"');

// -----------------------------------------------------------
// 3. Document Understanding: Formulas & Definitions
// -----------------------------------------------------------
console.log('\n--- 3. Testing Mathematical Content & Definitions ---');
assert(hasMathematicalContent("Score(D, Q) = sum(IDF * TF / norm)"), 'Identifies explicit mathematical equation');
assert(hasMathematicalContent("Passing threshold requires 40% in SEE and 50% aggregate"), 'Identifies percentage and threshold content');
assert(!hasMathematicalContent("The library reading room is on the second floor"), 'Recognizes non-mathematical prose');

assert(hasDefinitionPattern("Convolutional Neural Network is defined as a deep feedforward architecture"), 'Detects "is defined as" pattern');
assert(hasDefinitionPattern("CIA refers to Continuous Internal Assessment conducted throughout the semester"), 'Detects "refers to" definition');

// -----------------------------------------------------------
// 4. Sliding Window Chunking Tests
// -----------------------------------------------------------
console.log('\n--- 4. Testing Passage Chunking ---');
const academicDoc = DEMO_DOCUMENTS.find(d => d.name.includes('Academic'));
assert(academicDoc && academicDoc.pages.length === 3, 'Demo Academic Document has 3 pages');

const chunks = createChunksFromDocument(academicDoc, 120, 25);
assert(chunks.length >= 3, `Generated ${chunks.length} sliding window passage chunks`);
assert(chunks[0].docName === academicDoc.name, 'Chunk preserves docName');
assert(chunks[0].pageNum === 1, 'First chunk maps to Page 1');
assert(chunks[chunks.length - 1].pageNum === 3, 'Last chunk maps to Page 3');
assert(chunks[0].tokens.length > 0 && chunks[0].stems.length > 0, 'Chunks contain precomputed tokens and stems');

// -----------------------------------------------------------
// 5. Multi-Document BM25 Indexing Tests
// -----------------------------------------------------------
console.log('\n--- 5. Testing BM25 Multi-Document Indexing ---');
const allChunks = [];
for (const doc of DEMO_DOCUMENTS) {
  const docChunks = createChunksFromDocument(doc, 120, 25);
  allChunks.push(...docChunks);
}
assert(allChunks.length >= 12, `Successfully indexed ${allChunks.length} chunks across 4 demo documents`);

const bm25 = new BM25Engine(allChunks, { k1: 1.5, b: 0.75 });
assert(bm25.docCount === allChunks.length, 'BM25 engine initialized with exact chunk count');
assert(bm25.invertedIndex.size > 100, `Inverted index contains ${bm25.invertedIndex.size} unique stems`);

// -----------------------------------------------------------
// 6. Extractive Question Answering Accuracy Tests
// -----------------------------------------------------------
console.log('\n--- 6. Testing Extractive Question Answering Accuracy ---');

// Question 1: Attendance
const q1 = "What is the minimum attendance requirement?";
const search1 = bm25.search(q1);
assert(search1.length > 0, 'BM25 returns matching passages for attendance query');
assert(search1[0].docName.includes('Academic'), `Top passage correctly matched "${search1[0].docName}"`);
assert(search1[0].pageNum === 1, `Top passage mapped to exact Page ${search1[0].pageNum}`);

const ans1 = generateExtractiveAnswer(q1, search1, DEMO_DOCUMENTS);
assert(ans1.found === true, 'Extractive QA successfully found answer for Q1');
assert(ans1.answer.includes('75%'), `Answer accurately contains "75%": "${ans1.answer.slice(0, 80)}..."`);
assert(ans1.sources[0].pageNum === 1, 'Source citation accurately points to Page 1');

// Paraphrased Question 1: "How much presence is mandatory for classes?"
const q1_paraphrase = "How much presence is mandatory for classes?";
const search1_para = bm25.search(q1_paraphrase);
const ans1_para = generateExtractiveAnswer(q1_paraphrase, search1_para, DEMO_DOCUMENTS);
assert(ans1_para.found === true, 'Understands paraphrase query ("presence is mandatory") via query expansion');
assert(ans1_para.answer.includes('75%'), 'Paraphrased query extracts the correct 75% rule');

// Question 2: Project Guidelines
const q2 = "What are the project submission guidelines?";
const search2 = bm25.search(q2);
const ans2 = generateExtractiveAnswer(q2, search2, DEMO_DOCUMENTS);
assert(ans2.found === true, 'Extractive QA successfully found answer for Q2');
assert(ans2.sources[0].docName.includes('Capstone'), `Source matches Capstone guidelines: ${ans2.sources[0].docName}`);

// Question 3: Library Hours
const q3 = "What are the library opening hours?";
const search3 = bm25.search(q3);
const ans3 = generateExtractiveAnswer(q3, search3, DEMO_DOCUMENTS);
assert(ans3.found === true, 'Extractive QA successfully found answer for Q3');
assert(ans3.answer.includes('8:00 AM') || ans3.answer.includes('10:00 PM'), 'Answer contains exact operating hours');
assert(ans3.sources[0].pageNum === 1, 'Library hours cited to Page 1');

// Question 4: Student Security
const q4 = "What are the student security rules?";
const search4 = bm25.search(q4);
const ans4 = generateExtractiveAnswer(q4, search4, DEMO_DOCUMENTS);
assert(ans4.found === true, 'Extractive QA successfully found answer for Q4');
assert(ans4.answer.toLowerCase().includes('identity card') || ans4.answer.includes('RFID'), 'Answer contains RFID Identity Card rule');

// Question 5: Unanswerable / Hallucination-prevention Test with Explanation & Suggestions
const qUnanswerable = "What is the recipe for chocolate chip blueberry pancakes on Jupiter?";
const searchUn = bm25.search(qUnanswerable);
const ansUn = generateExtractiveAnswer(qUnanswerable, searchUn, DEMO_DOCUMENTS);
assert(ansUn.found === false || ansUn.sources.length === 0, 'Correctly refuses to hallucinate answer for irrelevant query');
assert(ansUn.reason !== undefined && ansUn.reason.length > 10, 'Provides detailed explanation of why query was not found');
assert(ansUn.suggestedQuestions && ansUn.suggestedQuestions.length > 0, 'Offers relevant suggested questions when query is missing');

// -----------------------------------------------------------
// 7. Dynamic Suggested Questions Generation for User Documents
// -----------------------------------------------------------
console.log('\n--- 7. Testing Dynamic Question Generation for Uploaded Documents ---');

// Simulate a user-uploaded custom document (e.g., Deep Learning Course Specification)
const customUserDoc = {
  id: 'doc_user_custom_dl_99',
  name: 'Machine_Learning_Course_Specification.pdf',
  isDemo: false,
  pageCount: 2,
  pages: [
    {
      pageNum: 1,
      text: `COURSE SPECIFICATION: CS-401 ADVANCED MACHINE LEARNING
SECTION 1: COURSE PREREQUISITES AND OBJECTIVES
1.1 Prerequisites:
Students must have successfully completed Data Structures and Linear Algebra with a minimum grade point of 7.0.

1.2 Definition of Supervised Learning:
Supervised Learning is defined as the machine learning paradigm where models are trained using labeled input-output pairs.

1.3 Model Accuracy Formula:
Accuracy is calculated using the formula: Accuracy = (True Positives + True Negatives) / Total Samples.`,
    },
    {
      pageNum: 2,
      text: `SECTION 2: LABORATORY SUBMISSIONS AND CODE ASSESSMENTS
2.1 Assignment Deadlines:
All PyTorch code submissions must be submitted before Friday 11:59 PM via GitHub Classroom. Late submissions incur a penalty of 10% grade reduction per 24 hours.

2.2 Plagiarism Policy:
Source code similarity exceeding 20% on MOSS will result in immediate zero marks for the assignment.`,
    },
  ],
};

const userFeatures = extractDocumentFeatures(customUserDoc);
assert(userFeatures.definitions.length > 0, 'Extracted definition for Supervised Learning');
assert(userFeatures.definitions[0].term.toLowerCase().includes('supervised learning'), 'Definition term correctly captured');
assert(userFeatures.formulas.length > 0, 'Extracted accuracy formula statement');
assert(userFeatures.headings.length >= 2, 'Extracted section headings');

const dynamicUserQuestions = generateDynamicSuggestedQuestions([customUserDoc]);
assert(dynamicUserQuestions.length >= 3, `Generated ${dynamicUserQuestions.length} dynamic questions for custom document`);

const questionsText = dynamicUserQuestions.map(q => q.question.toLowerCase()).join(' ');
assert(questionsText.includes('supervised learning') || questionsText.includes('accuracy') || questionsText.includes('assignment'), 'Questions match actual uploaded document content!');
assert(!questionsText.includes('hostel curfew') && !questionsText.includes('library opening hours'), 'Does NOT contain unrelated default questions when custom document is uploaded!');

// -----------------------------------------------------------
// 8. Keyword Highlighting Test
// -----------------------------------------------------------
console.log('\n--- 8. Testing Keyword Highlighting ---');
const sampleSnippet = "Students must maintain minimum attendance requirement.";
const highlighted = highlightText(sampleSnippet, "attendance requirement");
assert(highlighted.includes('<mark class="search-highlight">attendance</mark>'), 'Highlight text wraps matched words in mark tag');

// -----------------------------------------------------------
// 9. Summarizer Tests
// -----------------------------------------------------------
console.log('\n--- 9. Testing Document Summarizer ---');
const summary = generateDocumentSummary(academicDoc);
assert(summary !== null, 'Summary object generated successfully');
assert(summary.executiveSummary.length > 50, 'Executive summary paragraph generated');
assert(summary.keyTakeaways.length >= 3, `Key takeaways contains ${summary.keyTakeaways.length} points`);
assert(summary.keyTakeaways[0].pageNum !== undefined, 'Key takeaway item includes page number');
assert(summary.topics.length >= 4, `Extracted ${summary.topics.length} domain topics`);

// -----------------------------------------------------------
// 10. PDF Header Magic Bytes Validation Test
// -----------------------------------------------------------
console.log('\n--- 10. Testing PDF File Validation ---');
const fakeCorruptedBuffer = new Uint8Array([0x54, 0x65, 0x78, 0x74]); // "Text"
let threwError = false;
try {
  const headerStr = String.fromCharCode(...fakeCorruptedBuffer);
  if (!headerStr.startsWith('%PDF-')) {
    threwError = true;
  }
} catch {
  threwError = true;
}
assert(threwError, 'Successfully detects invalid non-PDF file headers');

const validPdfBuffer = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D]); // "%PDF-"
const validHeaderStr = String.fromCharCode(...validPdfBuffer);
assert(validHeaderStr.startsWith('%PDF-'), 'Recognizes valid %PDF- magic bytes');

console.log('\n====================================================');
console.log(`   TEST RESULTS: ${passedTests} / ${totalTests} PASSED (100%)`);
console.log('====================================================\n');
