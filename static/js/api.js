/* =========================================================================
   api.js — data access with a tiny in-memory cache.
   ========================================================================= */
const cache = new Map();

async function getJSON(url) {
  if (cache.has(url)) return cache.get(url);
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `অনুরোধ ব্যর্থ (${res.status})`);
  }
  const data = await res.json();
  cache.set(url, data);
  return data;
}

export const api = {
  manifest: () => getJSON("/api/manifest"),
  chapter: (slug) => getJSON(`/api/chapters/${encodeURIComponent(slug)}`),
  searchIndex: () => getJSON("/api/search"),
};
