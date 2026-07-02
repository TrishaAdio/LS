/* =========================================================================
   store.js — thin wrapper around localStorage for user state:
   theme, read-progress per topic, and bookmarks. All namespaced.
   ========================================================================= */
const NS = "mls:"; // Madhyamik Life Science

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(NS + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function write(key, value) {
  try { localStorage.setItem(NS + key, JSON.stringify(value)); } catch { /* quota / private mode */ }
}

/* ---------------- Theme ---------------- */
export const theme = {
  get() { return read("theme", null); },
  set(v) { write("theme", v); },
};

/* ---------------- Read progress ----------------
   Shape: { [chapterSlug]: { [topicId]: true } } */
export const progress = {
  all() { return read("progress", {}); },
  markRead(slug, topicId) {
    const all = this.all();
    all[slug] = all[slug] || {};
    all[slug][topicId] = true;
    write("progress", all);
  },
  chapterDone(slug) { return Object.keys(this.all()[slug] || {}).length; },
  isRead(slug, topicId) { return !!(this.all()[slug] || {})[topicId]; },
  percent(slug, total) {
    if (!total) return 0;
    return Math.round((this.chapterDone(slug) / total) * 100);
  },
};

/* ---------------- Bookmarks ----------------
   Array of { slug, topicId, title, chapterTitle } */
export const bookmarks = {
  all() { return read("bookmarks", []); },
  has(slug, topicId) { return this.all().some(b => b.slug === slug && b.topicId === topicId); },
  toggle(entry) {
    let list = this.all();
    const i = list.findIndex(b => b.slug === entry.slug && b.topicId === entry.topicId);
    if (i >= 0) { list.splice(i, 1); }
    else { list.unshift(entry); }
    write("bookmarks", list);
    return i < 0; // true if added
  },
  remove(slug, topicId) {
    write("bookmarks", this.all().filter(b => !(b.slug === slug && b.topicId === topicId)));
  },
};
