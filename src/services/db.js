import { openDB } from 'idb';

const DB_NAME = 'DocuMind_DB';
const DB_VERSION = 1;

let dbPromise = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Documents store: holds metadata and page-by-page text
        if (!db.objectStoreNames.contains('documents')) {
          const docStore = db.createObjectStore('documents', { keyPath: 'id' });
          docStore.createIndex('name', 'name', { unique: false });
          docStore.createIndex('uploadDate', 'uploadDate', { unique: false });
        }

        // Chunks store: holds tokenized & indexed passages for BM25/TF-IDF
        if (!db.objectStoreNames.contains('chunks')) {
          const chunkStore = db.createObjectStore('chunks', { keyPath: 'id' });
          chunkStore.createIndex('docId', 'docId', { unique: false });
          chunkStore.createIndex('pageNum', 'pageNum', { unique: false });
        }

        // Search history store
        if (!db.objectStoreNames.contains('searchHistory')) {
          const histStore = db.createObjectStore('searchHistory', { keyPath: 'id' });
          histStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Activity log store
        if (!db.objectStoreNames.contains('activityLog')) {
          const actStore = db.createObjectStore('activityLog', { keyPath: 'id' });
          actStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Settings / key-value store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

// Document Operations
export async function saveDocument(document, chunks = []) {
  const db = await getDB();
  const tx = db.transaction(['documents', 'chunks'], 'readwrite');
  await tx.objectStore('documents').put(document);
  for (const chunk of chunks) {
    await tx.objectStore('chunks').put(chunk);
  }
  await tx.done;
  await logActivity('document_added', `Uploaded document: "${document.name}" (${document.pageCount} pages)`);
}

export async function getAllDocuments() {
  const db = await getDB();
  return await db.getAll('documents');
}

export async function getDocumentById(id) {
  const db = await getDB();
  return await db.get('documents', id);
}

export async function findDuplicateDocument(hash, name, size) {
  const db = await getDB();
  const allDocs = await db.getAll('documents');
  for (const doc of allDocs) {
    if (hash && doc.hash && doc.hash === hash) {
      return { isDuplicate: true, reason: 'identical_hash', existingDoc: doc };
    }
    if (name && doc.name && doc.name.toLowerCase() === name.toLowerCase() && Math.abs(doc.size - size) < 10) {
      return { isDuplicate: true, reason: 'identical_name_and_size', existingDoc: doc };
    }
  }
  return { isDuplicate: false, reason: null, existingDoc: null };
}

export async function deleteDocument(id) {
  const db = await getDB();
  const doc = await db.get('documents', id);
  const tx = db.transaction(['documents', 'chunks'], 'readwrite');
  await tx.objectStore('documents').delete(id);

  // Delete all chunks for this docId
  const chunkStore = tx.objectStore('chunks');
  const index = chunkStore.index('docId');
  let cursor = await index.openCursor(IDBKeyRange.only(id));
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }
  await tx.done;

  if (doc) {
    await logActivity('document_deleted', `Deleted document: "${doc.name}"`);
  }
}

export async function clearAllDocuments() {
  const db = await getDB();
  const tx = db.transaction(['documents', 'chunks', 'searchHistory', 'activityLog'], 'readwrite');
  await tx.objectStore('documents').clear();
  await tx.objectStore('chunks').clear();
  await tx.objectStore('searchHistory').clear();
  await tx.objectStore('activityLog').clear();
  await tx.done;
  await logActivity('library_cleared', 'Cleared entire document library and search logs');
}

// Chunk Operations
export async function getAllChunks() {
  const db = await getDB();
  return await db.getAll('chunks');
}

export async function getChunksByDocId(docId) {
  const db = await getDB();
  return await db.getAllFromIndex('chunks', 'docId', docId);
}

// Activity Logging
export async function logActivity(type, message, metadata = {}) {
  try {
    const db = await getDB();
    const item = {
      id: 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      type,
      message,
      metadata,
      timestamp: Date.now(),
    };
    await db.put('activityLog', item);
  } catch (err) {
    console.warn('Could not log activity to IndexedDB:', err);
  }
}

export async function getRecentActivities(limit = 15) {
  const db = await getDB();
  const all = await db.getAll('activityLog');
  all.sort((a, b) => b.timestamp - a.timestamp);
  return all.slice(0, limit);
}

// Search History
export async function saveSearchQuery(query, resultCount, topScore, mode = 'qa') {
  try {
    const db = await getDB();
    const item = {
      id: 'query_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      query,
      resultCount,
      topScore,
      mode,
      timestamp: Date.now(),
    };
    await db.put('searchHistory', item);
    await logActivity('query_executed', `Queried: "${query.length > 50 ? query.substring(0, 47) + '...' : query}" (${resultCount} results found)`);
  } catch (err) {
    console.warn('Could not save search query:', err);
  }
}

export async function getSearchHistory(limit = 20) {
  const db = await getDB();
  const all = await db.getAll('searchHistory');
  all.sort((a, b) => b.timestamp - a.timestamp);
  return all.slice(0, limit);
}

// Settings
export async function getSetting(key, defaultValue = null) {
  const db = await getDB();
  const res = await db.get('settings', key);
  return res ? res.value : defaultValue;
}

export async function setSetting(key, value) {
  const db = await getDB();
  await db.put('settings', { key, value });
}
