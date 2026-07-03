/* =========================================================================
   app.js — application controller: routing, theme, search, bookmarks,
   reading progress, and all delegated interactivity.
   ========================================================================= */
import { api } from "./api.js";
import { theme, progress, bookmarks, revChecklist, readingPrefs, lastRead } from "./store.js";
import * as R from "./render.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

const app = $("#app");
const sidebar = $("#sidebar");
const sidebarContent = $("#sidebar-content");

let manifest = null;
let currentChapter = null; // loaded chapter data
let searchIndex = null;

/* ============================================================
   THEME
   ============================================================ */
function initTheme() {
  const saved = theme.get();
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const mode = saved || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", mode);
}
$("#theme-toggle").addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  theme.set(next);
});

/* ============================================================
   ROUTER (hash-based)
   Routes:  #/           -> home
            #/chapter/<slug>[#topic-xxx] -> chapter
   ============================================================ */
async function router() {
  const hash = location.hash || "#/";
  const [path, anchor] = hash.split(/#(?=topic-|exam|revision)/); // split off in-page anchor
  const parts = path.replace(/^#\//, "").split("/").filter(Boolean);

  // Fast path: same-chapter in-page anchor navigation — no loader, no re-render.
  if (parts[0] === "chapter" && parts[1] && currentChapter
      && currentChapter.meta.slug === decodeURIComponent(parts[1])) {
    if (anchor) {
      const target = document.getElementById(anchor);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    closeSidebar();
    return;
  }

  showLoader();
  try {
    if (parts[0] === "chapter" && parts[1]) {
      await showChapter(decodeURIComponent(parts[1]), anchor);
    } else {
      await showHome();
    }
  } catch (err) {
    app.innerHTML = `<div class="view"><div class="empty"><p>⚠️ ${R.esc(err.message || "কিছু একটা সমস্যা হয়েছে")}</p><a class="btn btn--primary" href="#/" data-link>হোমে ফিরুন</a></div></div>`;
  }
  closeSidebar();
}

function showLoader() {
  app.innerHTML = `<div class="loader"><div class="loader__spinner"></div><p>লোড হচ্ছে…</p></div>`;
}

async function showHome() {
  currentChapter = null;
  if (!manifest) manifest = await api.manifest();
  document.title = `${manifest.site.title} | Interactive Study`;
  app.innerHTML = R.renderHome(manifest);
  sidebarContent.innerHTML = R.renderSidebar(manifest, null, null);
  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0 });
}

async function showChapter(slug, anchor) {
  if (!manifest) manifest = await api.manifest();

  // If we're already viewing this chapter, only the in-page anchor changed —
  // just scroll instead of re-rendering (preserves quiz / expandable state).
  if (currentChapter && currentChapter.meta.slug === slug) {
    if (anchor) {
      const target = document.getElementById(anchor);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    closeSidebar();
    return;
  }

  const data = await api.chapter(slug);
  currentChapter = data;
  document.title = `${data.meta.title} | ${manifest.site.title}`;
  app.innerHTML = R.renderChapter(data, manifest);
  sidebarContent.innerHTML = R.renderSidebar(manifest, slug, data);

  observeTopics(slug);
  wireExamTabs();

  if (anchor) {
    // wait a tick for layout
    requestAnimationFrame(() => {
      const target = document.getElementById(anchor);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  } else {
    app.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }
}

/* ============================================================
   TOPIC OBSERVER — mark read + highlight active TOC link
   ============================================================ */
let topicObserver = null;
function observeTopics(slug) {
  if (topicObserver) topicObserver.disconnect();
  const topics = $$("#topics-root .topic");
  if (!topics.length) return;

  topicObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const id = e.target.dataset.topic;
      if (e.isIntersecting) {
        // Highlight in TOC
        $$(".toc-link").forEach(l => l.classList.remove("active"));
        const link = $(`.toc-link[data-toc="${CSS.escape(id)}"]`);
        if (link) link.classList.add("active");
        // Mark read after it has been meaningfully viewed
        // Always remember the most recently viewed topic for "resume reading"
        const topicEl = e.target;
        const titleEl = topicEl.querySelector(".topic__titles h2");
        lastRead.set({
          slug, topicId: id,
          title: titleEl ? titleEl.textContent.trim() : "",
          chapterTitle: currentChapter ? currentChapter.meta.title : "",
        });
        if (e.intersectionRatio > 0.35 && !progress.isRead(slug, id)) {
          progress.markRead(slug, id);
          refreshProgressUI(slug);
          if (link) link.classList.add("done");
        }
      }
    });
  }, { threshold: [0.35, 0.6], rootMargin: `-${70}px 0px -55% 0px` });

  topics.forEach(t => topicObserver.observe(t));
}

function refreshProgressUI(slug) {
  if (!currentChapter) return;
  const total = (currentChapter.topics || []).length;
  const pct = progress.percent(slug, total);
  const fill = $(".progress-bar__fill");
  if (fill) fill.style.width = pct + "%";
  const label = $(".side-progress__label span:last-child");
  if (label) label.textContent = pct + "%";
}

/* ============================================================
   EXAM TABS
   ============================================================ */
function wireExamTabs() {
  const tabs = $("#exam-tabs");
  if (!tabs) return;
  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab");
    if (!btn) return;
    $$(".tab", tabs).forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
    const id = btn.dataset.tab;
    $$("[data-panel]").forEach(p => { p.hidden = p.dataset.panel !== id; });
  });
}

/* ============================================================
   GLOBAL EVENT DELEGATION (content interactivity)
   ============================================================ */
app.addEventListener("click", (e) => {
  // Expandable
  const exp = e.target.closest("[data-expand]");
  if (exp) { exp.closest(".expandable").classList.toggle("open"); return; }

  // Reveal answers (QA, fib, tf, ar, match)
  const rev = e.target.closest("[data-reveal]");
  if (rev) {
    const el = document.getElementById(rev.dataset.reveal);
    if (el) {
      const show = el.hidden;
      el.hidden = !show;
      rev.textContent = show ? "উত্তর লুকাও" : (rev.textContent.includes("ব্যাখ্যা") ? "ব্যাখ্যা" : "উত্তর দেখাও");
    }
    return;
  }

  // MCQ option
  const opt = e.target.closest(".mcq-opt");
  if (opt) { handleMCQ(opt); return; }

  // Bookmark toggle
  const bm = e.target.closest("[data-bookmark]");
  if (bm) { handleBookmark(bm); return; }

  // Flashcard flip
  const fc = e.target.closest("[data-flashcard]");
  if (fc) { fc.classList.toggle("flipped"); return; }

  // Revision checklist toggle
  const chk = e.target.closest("[data-check]");
  if (chk) { handleChecklist(chk); return; }
});

function handleChecklist(btn) {
  const list = btn.closest("[data-checklist]");
  if (!list) return;
  const slug = list.dataset.checklist;
  const idx = Number(btn.dataset.check);
  const nowChecked = revChecklist.toggle(slug, idx);
  btn.setAttribute("aria-checked", String(nowChecked));
  btn.closest(".checklist__item").classList.toggle("done", nowChecked);
  const countEl = list.parentElement.querySelector("[data-checklist-count]");
  if (countEl) countEl.textContent = revChecklist.get(slug).length;
}

function handleMCQ(opt) {
  const mcq = opt.closest(".mcq");
  if (mcq.dataset.answered) return;
  mcq.dataset.answered = "1";
  const answer = Number(mcq.dataset.answer);
  const chosen = Number(opt.dataset.opt);
  $$(".mcq-opt", mcq).forEach(o => {
    o.disabled = true;
    const j = Number(o.dataset.opt);
    if (j === answer) o.classList.add("correct");
    if (j === chosen && chosen !== answer) o.classList.add("wrong");
  });
  $(".mcq__explain", mcq).hidden = false;
  updateQuizScore(chosen === answer);
}

let quizCorrect = 0, quizAttempted = 0;
function updateQuizScore(isCorrect) {
  quizAttempted++;
  if (isCorrect) quizCorrect++;
  const box = $("#quiz-score");
  const span = $("#quiz-correct");
  if (box && span) { box.hidden = false; span.textContent = quizCorrect; }
}

function handleBookmark(btn) {
  if (!currentChapter) return;
  const slug = currentChapter.meta.slug;
  const topicId = btn.dataset.bookmark;
  const added = bookmarks.toggle({
    slug, topicId,
    title: btn.dataset.title,
    chapterTitle: currentChapter.meta.title,
  });
  btn.classList.toggle("saved", added);
  btn.innerHTML = added
    ? `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z" fill="currentColor"/></svg>`
    : `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`;
  toast(added ? "বুকমার্কে যোগ হলো ✓" : "বুকমার্ক সরানো হলো");
}

/* ============================================================
   SEARCH
   ============================================================ */
const searchModal = $("#search-modal");
const searchInput = $("#search-input");
const searchResults = $("#search-results");
let searchActiveIndex = -1;

async function openSearch() {
  searchModal.hidden = false;
  if (!searchIndex) {
    try { searchIndex = (await api.searchIndex()).entries; } catch { searchIndex = []; }
  }
  searchInput.value = "";
  renderSearch("");
  setTimeout(() => searchInput.focus(), 30);
}
function closeSearch() { searchModal.hidden = true; }

function renderSearch(query) {
  const q = query.trim().toLowerCase();
  searchActiveIndex = -1;
  if (!q) {
    searchResults.innerHTML = `<p class="search-panel__hint">টাইপ করে যে-কোনো টপিক বা ধারণা খুঁজুন।</p>`;
    return;
  }
  const results = (searchIndex || []).map(e => {
    const hay = `${e.title} ${e.titleEn} ${(e.keywords || []).join(" ")} ${e.snippet} ${e.chapterTitle}`.toLowerCase();
    let score = 0;
    if (e.title.toLowerCase().includes(q)) score += 5;
    if ((e.keywords || []).some(k => k.toLowerCase().includes(q))) score += 3;
    if (hay.includes(q)) score += 1;
    return { e, score };
  }).filter(r => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 12);

  if (!results.length) {
    searchResults.innerHTML = `<p class="search-panel__hint">"${R.esc(query)}" এর জন্য কিছু পাওয়া যায়নি।</p>`;
    return;
  }
  const hl = (t) => R.esc(t).replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"), "<mark>$1</mark>");
  searchResults.innerHTML = results.map(({ e }, i) => `
    <a class="search-result" data-si="${i}" href="#/chapter/${R.esc(e.chapterSlug)}#topic-${R.esc(e.topicId)}">
      <div class="search-result__title">${hl(e.title)} ${e.titleEn ? `<span class="en" style="color:var(--text-mute)">(${R.esc(e.titleEn)})</span>` : ""}</div>
      <div class="search-result__meta">অধ্যায় ${R.esc(e.chapterNumber)} · ${R.esc(e.chapterTitle)}</div>
    </a>`).join("");
  $$(".search-result", searchResults).forEach(a => a.addEventListener("click", closeSearch));
}

searchInput.addEventListener("input", (e) => renderSearch(e.target.value));
searchInput.addEventListener("keydown", (e) => {
  const items = $$(".search-result", searchResults);
  if (e.key === "ArrowDown") { e.preventDefault(); searchActiveIndex = Math.min(searchActiveIndex + 1, items.length - 1); }
  else if (e.key === "ArrowUp") { e.preventDefault(); searchActiveIndex = Math.max(searchActiveIndex - 1, 0); }
  else if (e.key === "Enter" && items[searchActiveIndex]) { items[searchActiveIndex].click(); return; }
  else return;
  items.forEach((it, i) => it.classList.toggle("active", i === searchActiveIndex));
  if (items[searchActiveIndex]) items[searchActiveIndex].scrollIntoView({ block: "nearest" });
});

$("#search-open").addEventListener("click", openSearch);
$$("[data-close-search]").forEach(b => b.addEventListener("click", closeSearch));

/* ============================================================
   BOOKMARKS DRAWER
   ============================================================ */
const bmModal = $("#bookmarks-modal");
const bmList = $("#bookmarks-list");
function openBookmarks() {
  bmModal.hidden = false;
  const list = bookmarks.all();
  bmList.innerHTML = list.length ? list.map(b => `
    <div class="bm-item">
      <a class="bm-item__body" href="#/chapter/${R.esc(b.slug)}#topic-${R.esc(b.topicId)}" data-bm-go>
        <div class="bm-item__title">${R.esc(b.title)}</div>
        <div class="bm-item__meta">${R.esc(b.chapterTitle)}</div>
      </a>
      <button class="icon-btn bm-item__remove" data-bm-remove data-slug="${R.esc(b.slug)}" data-topic="${R.esc(b.topicId)}" aria-label="সরাও">
        <svg viewBox="0 0 24 24" width="18" height="18"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
    </div>`).join("") : `<div class="empty"><p>এখনও কোনো বুকমার্ক নেই। টপিকের পাশে 🔖 আইকনে ক্লিক করে সেভ করো।</p></div>`;
}
function closeBookmarks() { bmModal.hidden = true; }
bmList.addEventListener("click", (e) => {
  const go = e.target.closest("[data-bm-go]");
  if (go) { closeBookmarks(); return; }
  const rm = e.target.closest("[data-bm-remove]");
  if (rm) { bookmarks.remove(rm.dataset.slug, rm.dataset.topic); openBookmarks(); toast("বুকমার্ক সরানো হলো"); }
});
$("#bookmarks-open").addEventListener("click", openBookmarks);
$$("[data-close-bookmarks]").forEach(b => b.addEventListener("click", closeBookmarks));

/* ============================================================
   SIDEBAR (mobile) + overlay
   ============================================================ */
const overlay = $("#overlay");
function openSidebar() { sidebar.classList.add("open"); overlay.hidden = false; }
function closeSidebar() { sidebar.classList.remove("open"); overlay.hidden = true; }
$("#menu-toggle").addEventListener("click", () => sidebar.classList.contains("open") ? closeSidebar() : openSidebar());
overlay.addEventListener("click", closeSidebar);

/* ============================================================
   READING PROGRESS BAR + SCROLL TOP
   ============================================================ */
const progressBar = $("#reading-progress");
const scrollTopBtn = $("#scroll-top");
function onScroll() {
  const h = document.documentElement;
  const scrolled = h.scrollTop;
  const max = h.scrollHeight - h.clientHeight;
  progressBar.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + "%";
  scrollTopBtn.hidden = scrolled < 400;
}
window.addEventListener("scroll", onScroll, { passive: true });
scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ============================================================
   LINKS (delegated) + keyboard shortcuts
   ============================================================ */
document.addEventListener("click", (e) => {
  const link = e.target.closest("a[data-link], a[data-toc]");
  if (link && link.getAttribute("href")?.startsWith("#")) {
    // let the hashchange handle routing; just close sidebar on mobile
    closeSidebar();
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
  if (e.key === "Escape") { closeSearch(); closeBookmarks(); closeSidebar(); }
});

/* ============================================================
   TOAST
   ============================================================ */
let toastTimer = null;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2200);
}

/* ============================================================
   READING SETTINGS (font size, line spacing, focus mode)
   ============================================================ */
const FONT_MIN = 0.9, FONT_MAX = 1.35, LINE_MIN = 0.85, LINE_MAX = 1.3;
function applyReadingPrefs() {
  const p = readingPrefs.get();
  // Font: base 1.02rem scaled by fontScale.
  document.documentElement.style.setProperty("--fs-base", (1.02 * p.fontScale).toFixed(3) + "rem");
  // Line height: base 1.85 shifted by lineScale (1 = default).
  document.documentElement.style.setProperty("--leading", (1.85 * p.lineScale).toFixed(3));
  document.body.classList.toggle("focus-mode", !!p.focus);
  const fl = $("#rs-font-val"), ll = $("#rs-line-val"), fb = $("#rs-focus");
  if (fl) fl.textContent = Math.round(p.fontScale * 100) + "%";
  if (ll) ll.textContent = Math.round(p.lineScale * 100) + "%";
  if (fb) fb.setAttribute("aria-pressed", String(!!p.focus));
}
function wireReadingSettings() {
  const btn = $("#reading-settings-open");
  const panel = $("#reading-settings");
  if (!btn || !panel) return;
  const toggle = (show) => { panel.hidden = show === undefined ? !panel.hidden : !show; btn.setAttribute("aria-expanded", String(!panel.hidden)); };
  btn.addEventListener("click", (e) => { e.stopPropagation(); toggle(); });
  document.addEventListener("click", (e) => { if (!panel.hidden && !panel.contains(e.target) && e.target !== btn) toggle(false); });
  panel.addEventListener("click", (e) => {
    const a = e.target.closest("[data-rs]"); if (!a) return;
    const p = readingPrefs.get();
    const step = 0.05;
    switch (a.dataset.rs) {
      case "font-inc": readingPrefs.set({ fontScale: Math.min(FONT_MAX, +(p.fontScale + step).toFixed(2)) }); break;
      case "font-dec": readingPrefs.set({ fontScale: Math.max(FONT_MIN, +(p.fontScale - step).toFixed(2)) }); break;
      case "line-inc": readingPrefs.set({ lineScale: Math.min(LINE_MAX, +(p.lineScale + step).toFixed(2)) }); break;
      case "line-dec": readingPrefs.set({ lineScale: Math.max(LINE_MIN, +(p.lineScale - step).toFixed(2)) }); break;
      case "focus": readingPrefs.set({ focus: !p.focus }); break;
      case "reset": readingPrefs.set({ fontScale: 1, lineScale: 1, focus: false }); break;
    }
    applyReadingPrefs();
  });
}

/* ============================================================
   CURSOR GLOW (soft mouse-follow spotlight)
   ============================================================ */
function initCursorGlow() {
  const fine = window.matchMedia("(pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduced) return;
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  glow.setAttribute("aria-hidden", "true");
  document.body.appendChild(glow);
  let tx = 0, ty = 0, x = 0, y = 0, raf = null;
  const loop = () => {
    x += (tx - x) * 0.18; y += (ty - y) * 0.18;
    glow.style.transform = `translate(${x}px, ${y}px)`;
    if (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) raf = requestAnimationFrame(loop);
    else raf = null;
  };
  window.addEventListener("pointermove", (e) => {
    tx = e.clientX; ty = e.clientY;
    glow.style.opacity = "1";
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  window.addEventListener("pointerdown", () => glow.classList.add("cursor-glow--tap"));
  window.addEventListener("pointerup", () => glow.classList.remove("cursor-glow--tap"));
  document.addEventListener("mouseleave", () => { glow.style.opacity = "0"; });
}

/* ============================================================
   RIPPLE + MAGNETIC BUTTONS
   ============================================================ */
function initRipple() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.addEventListener("pointerdown", (e) => {
    const el = e.target.closest(".btn, .mcq-opt, .tab, .chapter-card, .qa__toggle, .expandable__btn, .rs-btn, .resume-card");
    if (!el) return;
    const r = el.getBoundingClientRect();
    const span = document.createElement("span");
    span.className = "ripple";
    const size = Math.max(r.width, r.height);
    span.style.width = span.style.height = size + "px";
    span.style.left = (e.clientX - r.left - size / 2) + "px";
    span.style.top = (e.clientY - r.top - size / 2) + "px";
    const prevPos = getComputedStyle(el).position;
    if (prevPos === "static") el.style.position = "relative";
    el.appendChild(span);
    setTimeout(() => span.remove(), 620);
  }, { passive: true });
}
function initMagnetic() {
  const fine = window.matchMedia("(pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduced) return;
  document.addEventListener("pointermove", (e) => {
    const el = e.target.closest(".icon-btn, .btn--primary, .scroll-top");
    if (!el) { return; }
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${mx * 0.22}px, ${my * 0.22}px)`;
  }, { passive: true });
  document.addEventListener("pointerout", (e) => {
    const el = e.target.closest(".icon-btn, .btn--primary, .scroll-top");
    if (el) el.style.transform = "";
  }, { passive: true });
}

/* ============================================================
   BOOT
   ============================================================ */
initTheme();
applyReadingPrefs();
wireReadingSettings();
initCursorGlow();
initRipple();
initMagnetic();
window.addEventListener("hashchange", router);
router();
