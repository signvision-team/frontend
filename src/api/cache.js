// src/api/cache.js
// ─────────────────────────────────────────────────────────────
// Simple in-memory cache. Data loads instantly on repeat visits.
// Cache expires after 60 seconds so data stays fresh.
// ─────────────────────────────────────────────────────────────

const store = new Map();
const TTL_MS = 60_000; // 60 seconds

export const cache = {
  get(key) {
    const entry = store.get(key);
    if (!entry) return null;
    if (Date.now() - entry.ts > TTL_MS) {
      store.delete(key);
      return null;
    }
    return entry.data;
  },

  set(key, data) {
    store.set(key, { data, ts: Date.now() });
  },

  invalidate(key) {
    store.delete(key);
  },

  invalidateAll() {
    store.clear();
  },
};