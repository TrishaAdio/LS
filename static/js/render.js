/* =========================================================================
   render.js — pure functions that turn content data into HTML strings.
   Interactivity is wired via event delegation in app.js.
   ========================================================================= */
import { diagrams } from "./diagrams.js";
import { figures } from "./figures.js";
import { animations } from "./animations.js";
import { progress, bookmarks, revChecklist, lastRead } from "./store.js";

/* --------------------------- helpers --------------------------- */
export function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
const icon = {
  spark: `<svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" fill="currentColor"/></svg>`,
  bulb: `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.8.7 1 1.2 1 2h6c0-.8.2-1.3 1-2A6 6 0 0012 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  brain: `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 5a3 3 0 00-3 3 3 3 0 000 6 3 3 0 003 3M12 5a3 3 0 013 3 3 3 0 010 6 3 3 0 01-3 3M12 5v14" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
  target: `<svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>`,
  book: `<svg viewBox="0 0 24 24" width="18" height="18"><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  chev: `<svg class="chev" viewBox="0 0 24 24" width="18" height="18"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  bookmark: `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  bookmarkFill: `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z" fill="currentColor"/></svg>`,
};

/* ============================================================
   HOME VIEW
   ============================================================ */
const subjectSvg = {
  leaf: `<svg viewBox="0 0 24 24" width="30" height="30"><path d="M5 21c0-8 5-14 14-14 0 9-6 14-14 14z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 17c3-4 6-6 9-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  scroll: `<svg viewBox="0 0 24 24" width="30" height="30"><path d="M6 4h11a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 8h7M9 12h7M9 16h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M6 4a2 2 0 00-2 2v0a2 2 0 002 2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
  atom: `<svg viewBox="0 0 24 24" width="30" height="30"><circle cx="12" cy="12" r="2.4" fill="currentColor"/><ellipse cx="12" cy="12" rx="10" ry="4.4" fill="none" stroke="currentColor" stroke-width="1.6"/><ellipse cx="12" cy="12" rx="10" ry="4.4" fill="none" stroke="currentColor" stroke-width="1.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.4" fill="none" stroke="currentColor" stroke-width="1.6" transform="rotate(120 12 12)"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" width="30" height="30"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
  sigma: `<svg viewBox="0 0 24 24" width="30" height="30"><path d="M7 5h10M7 5l6 7-6 7h10" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"/></svg>`,
};

/* Single chapter card (used inside a subject's chapter list). */
function chapterCard(c) {
  const pct = progress.percent(c.slug, c.topicCount || 0);
  return `
    <a class="chapter-card" href="#/chapter/${esc(c.slug)}" data-link>
      <div class="chapter-card__top">
        <div class="chapter-card__num">${esc(c.number ?? "•")}</div>
        <div class="chip chip--accent">গুরুত্ব: ${esc(c.importance || "—")}</div>
      </div>
      <h3>${esc(c.title)}</h3>
      <div class="chapter-card__en">${esc(c.titleEn || "")}</div>
      <p class="chapter-card__sub">${esc(c.subtitle || "")}</p>
      <div class="chapter-card__foot">
        <span class="chip">${esc(c.topicCount || 0)} টি টপিক</span>
        <span class="chip">≈ ${esc(c.estimatedMinutes || 0)} মিনিট</span>
        ${c.pages ? `<span class="chip">পৃষ্ঠা ${esc(c.pages)}</span>` : ""}
      </div>
      <div class="chapter-card__progress"><i style="width:${pct}%"></i></div>
      <div class="chapter-card__en" style="margin-top:6px">${pct}% পড়া হয়েছে</div>
    </a>`;
}

/* HOME = subject picker. */
export function renderHome(manifest) {
  const subjects = manifest.subjects || [];
  const chapters = manifest.chapters || [];
  const totalTopics = chapters.reduce((a, c) => a + (c.topicCount || 0), 0);

  const subjectCards = subjects.map((s) => `
    <a class="subject-card" href="#/subject/${esc(s.id)}" data-link style="--sub-accent:${esc(s.accent || "var(--accent)")}">
      <div class="subject-card__icon">${subjectSvg[s.icon] || subjectSvg.scroll}</div>
      <div class="subject-card__body">
        <h3>${esc(s.name)}</h3>
        <div class="subject-card__en">${esc(s.nameEn || "")}</div>
        <div class="subject-card__foot">
          <span class="chip">${esc(s.chapterCount || 0)} অধ্যায়</span>
          <span class="chip">${esc(s.topicCount || 0)} টপিক</span>
        </div>
      </div>
      <svg class="subject-card__arrow" viewBox="0 0 24 24" width="22" height="22"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>`).join("");

  return `
  <div class="view">
    <section class="hero">
      <span class="hero__badge">${icon.spark} ${esc(manifest.site.board || "WBBSE · মাধ্যমিক")}</span>
      <h1>${esc(manifest.site.title)}</h1>
      <p>${esc(manifest.site.tagline)} — প্রতিটি বিষয় সহজ বাংলায়, উদাহরণ, ছবি ও পরীক্ষার প্রশ্নসহ। একটা বিষয়ে ক্লিক করে অধ্যায়গুলো দেখো।</p>
      <div class="hero__stats">
        <div class="hero__stat"><b>${subjects.length}</b><span>বিষয়</span></div>
        <div class="hero__stat"><b>${chapters.length}</b><span>অধ্যায়</span></div>
        <div class="hero__stat"><b>${totalTopics}</b><span>টপিক</span></div>
      </div>
    </section>

    ${renderResume()}

    <h2 class="section-title"><span class="bar"></span> বিষয় বেছে নাও</h2>
    <div class="subject-grid">${subjectCards || emptyState("এখনও কোনো বিষয় যোগ করা হয়নি।")}</div>

    <h2 class="section-title"><span class="bar"></span> কীভাবে ব্যবহার করবে</h2>
    <div class="card-grid">
      ${featureCard(icon.book, "পড়া", "প্রতিটি টপিক সহজ ভাষায় ব্যাখ্যা, ছবি ও উদাহরণসহ। কঠিন অংশ বারবার সহজ করে বোঝানো।")}
      ${featureCard(icon.target, "অনুশীলন", "প্রতি অধ্যায়ে MCQ, সংক্ষিপ্ত ও বড় প্রশ্ন — উত্তর ও ব্যাখ্যাসহ। নিজেকে যাচাই করো।")}
      ${featureCard(icon.brain, "রিভিশন", "শেষ মুহূর্তের রিভিশন, মূল সংজ্ঞা ও মনে রাখার কৌশল এক জায়গায়।")}
    </div>
  </div>`;
}

/* SUBJECT view = the chapters/topics inside one subject. */
export function renderSubjectView(subjectId, manifest) {
  const subject = (manifest.subjects || []).find((s) => s.id === subjectId);
  const chapters = (manifest.chapters || []).filter((c) => c.subjectId === subjectId);
  if (!subject) {
    return `<div class="view"><div class="empty"><p>এই বিষয়টি খুঁজে পাওয়া যায়নি।</p><a class="btn btn--primary" href="#/" data-link>হোমে ফিরুন</a></div></div>`;
  }
  const cards = chapters.map(chapterCard).join("");
  return `
  <div class="view">
    <div class="chapter-head">
      <nav class="breadcrumb"><a href="#/" data-link>হোম</a> <span>›</span> <span>${esc(subject.name)}</span></nav>
      <h1>${esc(subject.name)}</h1>
      <div class="chapter-head__en">${esc(subject.nameEn || "")}</div>
      <div class="chapter-head__meta">
        <span class="chip chip--accent">${esc(chapters.length)} অধ্যায়</span>
        <span class="chip">${esc(subject.topicCount || 0)} টপিক</span>
      </div>
    </div>
    <h2 class="section-title"><span class="bar"></span> অধ্যায়সমূহ</h2>
    <div class="card-grid">${cards || emptyState("এই বিষয়ে এখনও অধ্যায় যোগ করা হয়নি।")}</div>
  </div>`;
}
function renderResume() {
  const last = lastRead.get();
  if (!last || !last.slug || !last.topicId) return "";
  return `
  <a class="resume-card" href="#/chapter/${esc(last.slug)}#topic-${esc(last.topicId)}" data-link>
    <div class="resume-card__icon">
      <svg viewBox="0 0 24 24" width="24" height="24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
    </div>
    <div class="resume-card__body">
      <div class="resume-card__label">যেখানে থেমেছিলে — পড়া চালিয়ে যাও</div>
      <div class="resume-card__title">${esc(last.title || "")}</div>
      <div class="resume-card__sub">${esc(last.chapterTitle || "")}</div>
    </div>
    <svg class="resume-card__arrow" viewBox="0 0 24 24" width="22" height="22"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </a>`;
}
function featureCard(ic, t, d) {
  return `<div class="chapter-card" style="cursor:default"><div class="chapter-card__num">${ic}</div><h3 style="margin-top:12px">${t}</h3><p class="chapter-card__sub">${d}</p></div>`;
}
function emptyState(msg) {
  return `<div class="empty"><svg viewBox="0 0 24 24" width="46" height="46"><path d="M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><p>${msg}</p></div>`;
}

/* ============================================================
   CHAPTER VIEW
   ============================================================ */
export function renderChapter(data, manifest) {
  const m = data.meta;
  const chEntry = (manifest.chapters || []).find((c) => c.slug === m.slug) || {};
  const subjectId = m.subjectId || chEntry.subjectId;
  const subjectName = m.subject || chEntry.subject;
  const topicsHtml = (data.topics || []).map((t, i) => renderTopic(t, i, m.slug)).join(
    `<div class="topic-divider"><span>◆</span></div>`
  );

  const crumbSubject = subjectId
    ? `<a href="#/subject/${esc(subjectId)}" data-link>${esc(subjectName || "বিষয়")}</a> <span>›</span> `
    : "";

  return `
  <div class="view">
    <div class="chapter-head">
      <nav class="breadcrumb"><a href="#/" data-link>হোম</a> <span>›</span> ${crumbSubject}<span>অধ্যায় ${esc(m.number)}</span></nav>
      <h1>${esc(m.title)}</h1>
      <div class="chapter-head__en">${esc(m.titleEn || "")}</div>
      <div class="chapter-head__meta">
        <span class="chip chip--accent">গুরুত্ব: ${esc(m.importance || "—")}</span>
        <span class="chip">${(data.topics || []).length} টি টপিক</span>
        <span class="chip">≈ ${esc(m.estimatedMinutes || 0)} মিনিট</span>
        ${m.pages ? `<span class="chip">পৃষ্ঠা ${esc(m.pages)}</span>` : ""}
        ${m.complete ? `<span class="chip chip--done"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 12l5 5L20 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg> সম্পূর্ণ অধ্যায়</span>` : ""}
      </div>
    </div>

    ${renderIntro(data.intro, m)}
    ${renderObjectives(data.objectives)}

    <div id="topics-root">${topicsHtml}</div>

    ${renderExam(data.exam)}
    ${renderRevision(data.revision, m.slug)}
    ${renderChapterNav(m, manifest)}
  </div>`;
}

function renderIntro(intro, m) {
  if (!intro) return "";
  return `
  <div class="intro-card">
    <h2>${icon.bulb} ${esc(intro.heading || "ভূমিকা")}</h2>
    ${(intro.paragraphs || []).map(p => `<p>${esc(p)}</p>`).join("")}
    ${m.importanceNote ? `<div class="intro-note intro-note--why"><span>📌</span><div><b>কেন গুরুত্বপূর্ণ</b>${esc(intro.whyImportant || m.importanceNote)}</div></div>` : ""}
    ${intro.struggle ? `<div class="intro-note intro-note--struggle"><span>⚠️</span><div><b>কোথায় আটকায়</b>${esc(intro.struggle)}</div></div>` : ""}
  </div>`;
}

function renderObjectives(list) {
  if (!list || !list.length) return "";
  return `
  <h2 class="section-title"><span class="bar"></span> এই অধ্যায় শেষে তুমি পারবে</h2>
  <ul class="objectives">${list.map(o => `<li>${esc(o)}</li>`).join("")}</ul>`;
}

function renderTopic(t, i, slug) {
  const saved = bookmarks.has(slug, t.id);
  const read = progress.isRead(slug, t.id);
  return `
  <section class="topic" id="topic-${esc(t.id)}" data-topic="${esc(t.id)}">
    <div class="topic__head">
      <div class="topic__index">${i + 1}</div>
      <div class="topic__titles">
        <h2>${esc(t.title)}</h2>
        ${t.titleEn ? `<span class="en">${esc(t.titleEn)}</span>` : ""}
      </div>
      <button class="icon-btn topic__bookmark ${saved ? "saved" : ""}" data-bookmark="${esc(t.id)}" data-title="${esc(t.title)}" aria-label="বুকমার্ক">
        ${saved ? icon.bookmarkFill : icon.bookmark}
      </button>
    </div>
    ${(t.blocks || []).map(renderBlock).join("")}
  </section>`;
}

/* ============================================================
   BLOCK RENDERER
   ============================================================ */
export function renderBlock(b) {
  switch (b.type) {
    case "paragraph": return `<div class="block"><p>${esc(b.text)}</p></div>`;

    case "definition": return `
      <div class="block definition">
        <div class="definition__tag">সংজ্ঞা / Definition</div>
        ${b.intro ? `<div class="definition__intro">${esc(b.intro)}</div>` : ""}
        <div class="definition__term">${esc(b.term)} ${b.en ? `<span class="en">(${esc(b.en)})</span>` : ""}</div>
        ${b.pronunciation ? `<div class="definition__pron">উচ্চারণ: ${esc(b.pronunciation)}</div>` : ""}
        <div class="definition__text">${esc(b.text)}</div>
      </div>`;

    case "termlist": return `
      <div class="block card">
        ${b.title ? `<div class="termlist__title">${icon.book} ${esc(b.title)}</div>` : ""}
        ${(b.items || []).map(it => `
          <div class="term-item">
            <div class="term-item__head">
              <span class="term-item__bn">${esc(it.bn)}</span>
              ${it.en ? `<span class="term-item__en">${esc(it.en)}</span>` : ""}
              ${it.pron ? `<span class="term-item__pron">/${esc(it.pron)}/</span>` : ""}
            </div>
            <div class="term-item__meaning">${esc(it.meaning)}</div>
          </div>`).join("")}
      </div>`;

    case "keypoints": return `
      <div class="block card keypoints">
        ${b.title ? `<div class="keypoints__title">${icon.spark} ${esc(b.title)}</div>` : ""}
        <ul>${(b.items || []).map(it => `<li>${esc(it)}</li>`).join("")}</ul>
      </div>`;

    case "callout": {
      const v = b.variant || "info";
      const emoji = { info: "ℹ️", success: "✅", danger: "⛔", warn: "⚠️" }[v] || "ℹ️";
      return `
      <div class="block callout callout--${esc(v)}">
        <div class="callout__icon">${emoji}</div>
        <div class="callout__body">${b.title ? `<b>${esc(b.title)}</b>` : ""}${esc(b.text)}</div>
      </div>`;
    }

    case "didyouknow": return noteBlock("nb-didyouknow", "💡", "জানো কি?", b.text);
    case "memorytrick": return noteBlock("nb-memorytrick", "🧠", "মনে রাখার কৌশল" + (b.title ? " · " + esc(b.title) : ""), b.text, true);
    case "boardtip": return noteBlock("nb-boardtip", "🎯", "বোর্ড টিপ", b.text);
    case "analogy": return noteBlock("nb-analogy", "🔗", "সহজ উপমা" + (b.title ? "" : ""), b.text);

    case "flow": return `
      <div class="block">
        ${b.title ? `<div class="flow__title">${icon.spark} ${esc(b.title)}</div>` : ""}
        <div class="flow">${(b.steps || []).map((s, i) => `
          <div class="flow-step"><div class="flow-step__num">${i + 1}</div>
            <div><div class="flow-step__title">${esc(s.title)}</div><div class="flow-step__text">${esc(s.text)}</div></div>
          </div>`).join("")}</div>
      </div>`;

    case "timeline": return `
      <div class="block card">
        ${b.title ? `<div class="timeline__title">${icon.spark} ${esc(b.title)}</div>` : ""}
        <div class="timeline">${(b.events || []).map(e => `
          <div class="tl-item">
            <div class="tl-item__time">${esc(e.time)}</div>
            <div class="tl-item__title">${esc(e.title)}</div>
            <div class="tl-item__text">${esc(e.text)}</div>
          </div>`).join("")}</div>
      </div>`;

    case "diagram": {
      const anim = (b.animate && animations[b.ref]) ? animations[b.ref] : null;
      const fig = figures[b.ref];
      const labels = (b.labels && b.labels.length)
        ? `<div class="figure__labels">${b.labels.map(l => `<span class="figure__label">${esc(l)}</span>`).join("")}</div>` : "";
      const caption = b.caption ? `<figcaption class="figure__caption">${esc(b.caption)}</figcaption>` : "";
      const explain = b.explanation ? `<div class="figure__explain">${esc(b.explanation)}</div>` : "";
      // Animated variant (opt-in via "animate": true). Resting state is the
      // full diagram; @media reduced-motion + no-anim fallback keep it safe.
      if (anim) {
        return `
        <figure class="block figure figure--anim">
          <div class="figure__canvas figure__canvas--anim${b.autoplay ? " playing" : ""}" data-anim-canvas>${anim.svg}</div>
          <div class="figure__anim-controls">
            <button class="anim-btn" data-anim-replay type="button" aria-label="অ্যানিমেশন চালাও">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
              <span>অ্যানিমেশন চালাও</span>
            </button>
          </div>
          ${caption}
          ${labels}
          ${explain}
        </figure>`;
      }
      if (fig) {
        const credit = `<div class="figure__credit">চিত্র: <a href="${esc(fig.source)}" target="_blank" rel="noopener noreferrer">${esc(fig.artist)}</a>${fig.license ? ` · ${fig.licenseUrl ? `<a href="${esc(fig.licenseUrl)}" target="_blank" rel="noopener noreferrer">${esc(fig.license)}</a>` : esc(fig.license)}` : ""} · Wikimedia Commons</div>`;
        return `
        <figure class="block figure figure--photo">
          <div class="figure__canvas figure__canvas--img"><img src="${esc(fig.img)}" alt="${esc(b.caption || b.ref)}" loading="lazy" decoding="async" /></div>
          ${caption}
          ${labels}
          ${explain}
          ${credit}
        </figure>`;
      }
      const svg = diagrams[b.ref] || `<div class="empty">চিত্র পাওয়া যায়নি</div>`;
      return `
      <figure class="block figure">
        <div class="figure__canvas">${svg}</div>
        ${caption}
        ${labels}
        ${explain}
      </figure>`;
    }

    case "table": return `
      <div class="block table-wrap">
        <table class="data">
          ${b.caption ? `<caption>${esc(b.caption)}</caption>` : ""}
          <thead><tr>${(b.headers || []).map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead>
          <tbody>${(b.rows || []).map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>`;

    case "mistake": return `
      <div class="block card">
        <div class="mistake__title">⚠️ ${esc(b.title || "সাধারণ ভুল")}</div>
        ${(b.items || []).map(it => `
          <div class="mistake-item">
            <div class="mistake-item__wrong">${esc(it.wrong)}</div>
            <div class="mistake-item__right">${esc(it.right)}</div>
          </div>`).join("")}
      </div>`;

    case "prevyear": return `
      <div class="block prevyear">
        <div class="prevyear__head">📊 বিগত বোর্ডে গুরুত্ব</div>
        ${b.frequency ? `<div class="prevyear__row"><b>কত ঘন ঘন:</b> ${esc(b.frequency)}</div>` : ""}
        ${b.nature ? `<div class="prevyear__row"><b>কী ধরনের প্রশ্ন:</b> ${esc(b.nature)}</div>` : ""}
        ${b.advice ? `<div class="prevyear__row"><b>প্রস্তুতির পরামর্শ:</b> ${esc(b.advice)}</div>` : ""}
      </div>`;

    case "quickrecap": return `
      <div class="block quickrecap">
        <div class="quickrecap__head">⚡ কুইক রিক্যাপ</div>
        <ul>${(b.items || []).map(it => `<li>${esc(it)}</li>`).join("")}</ul>
      </div>`;

    case "expandable": return `
      <div class="block expandable">
        <button class="expandable__btn" data-expand>${esc(b.title)} ${icon.chev}</button>
        <div class="expandable__body">${(b.blocks || []).map(renderBlock).join("")}</div>
      </div>`;

    /* ---- understand-first pedagogy blocks ---- */

    // Curiosity opener: a real-life scene / question that hooks the student
    // BEFORE any facts. Should be the first block of most topics.
    case "hook": return `
      <div class="block hook">
        <div class="hook__label">🤔 একটু ভাবো তো…</div>
        ${(Array.isArray(b.text) ? b.text : [b.text]).filter(Boolean).map(t => `<p class="hook__text">${esc(t)}</p>`).join("")}
        ${b.think ? `<p class="hook__think">${esc(b.think)}</p>` : ""}
      </div>`;

    // Word-check: explain scientific jargon the moment it appears, in plain
    // Bengali. Lighter and friendlier than the formal definition block.
    case "wordcheck": return `
      <div class="block wordcheck">
        <div class="wordcheck__label">🔤 ${esc(b.intro || "নতুন শব্দ? আগে সেটা বুঝে নিই")}</div>
        <div class="wordcheck__items">
          ${(b.items || []).map(it => `
            <div class="wordcheck__item">
              <div class="wordcheck__word">${esc(it.word)}${it.en ? ` <span class="en">(${esc(it.en)})</span>` : ""}${it.say ? ` <span class="wordcheck__say">উচ্চারণ: ${esc(it.say)}</span>` : ""}</div>
              <div class="wordcheck__mean">${esc(it.meaning)}</div>
            </div>`).join("")}
        </div>
      </div>`;

    // Understanding ladder: a chain of "why / how / what-if-not" questions,
    // each with a plain answer, that builds intuition step by step.
    case "buildup": return `
      <div class="block buildup">
        ${b.title ? `<div class="buildup__title">🌱 ${esc(b.title)}</div>` : ""}
        <div class="buildup__steps">
          ${(b.steps || []).map(s => `
            <div class="buildup__step">
              <div class="buildup__q"><span class="buildup__qbubble">?</span>${esc(s.q)}</div>
              <div class="buildup__a">${esc(s.a)}</div>
            </div>`).join("")}
        </div>
      </div>`;

    // Flashcards: click a card to flip and reveal the answer. Great for
    // quick self-testing of names / facts.
    case "flashcards": return `
      <div class="block flashcards-block">
        ${b.title ? `<div class="flashcards-block__title">🃏 ${esc(b.title)}</div>` : ""}
        <div class="flashcards">
          ${(b.cards || []).map(c => `
            <button class="flashcard" data-flashcard type="button" aria-label="কার্ড উলটে উত্তর দেখো">
              <div class="flashcard__inner">
                <div class="flashcard__face flashcard__front"><span>${esc(c.front)}</span><em class="flashcard__hint">উত্তর দেখতে ক্লিক করো</em></div>
                <div class="flashcard__face flashcard__back"><span>${esc(c.back)}</span></div>
              </div>
            </button>`).join("")}
        </div>
      </div>`;

    // Story / scenario used to make an idea feel obvious.
    case "story": return `
      <div class="block story">
        <div class="story__icon">🎬</div>
        <div class="story__body">
          ${b.title ? `<div class="story__title">${esc(b.title)}</div>` : ""}
          ${(Array.isArray(b.text) ? b.text : [b.text]).filter(Boolean).map(t => `<p>${esc(t)}</p>`).join("")}
        </div>
      </div>`;

    default: return "";
  }
}

function noteBlock(cls, emoji, label, text, isTrick) {
  return `
  <div class="block note-block ${cls}">
    <div class="note-block__icon">${emoji}</div>
    <div><div class="note-block__label">${esc(label)}</div><div class="note-block__body">${esc(text)}</div></div>
  </div>`;
}

/* ============================================================
   EXAM SECTION
   ============================================================ */
export function renderExam(exam) {
  if (!exam) return "";
  const tabs = [
    ["mcq", "MCQ", exam.mcqs],
    ["vshort", "অতি সংক্ষিপ্ত", exam.veryShort],
    ["short", "সংক্ষিপ্ত", exam.short],
    ["long", "বড় প্রশ্ন", exam.long],
    ["fib", "শূন্যস্থান", exam.fillBlanks],
    ["match", "মেলাও", exam.match],
    ["tf", "সত্য / মিথ্যা", exam.trueFalse],
    ["ar", "কারণ-বিবৃতি", exam.assertionReason],
    ["diag", "চিত্রভিত্তিক", exam.diagramBased],
  ].filter(([, , d]) => d && d.length);

  const tabBtns = tabs.map(([id, label], i) => `<button class="tab ${i === 0 ? "active" : ""}" data-tab="${id}">${label}</button>`).join("");
  const panels = tabs.map(([id, , data], i) => `<div class="tab-panel" data-panel="${id}" ${i === 0 ? "" : "hidden"}>${examPanel(id, data)}</div>`).join("");

  return `
  <div id="exam">
    <div class="exam-hero">
      <div class="exam-hero__icon">📝</div>
      <div><h2>পরীক্ষা প্রস্তুতি</h2><p>প্রতিটি প্রশ্ন উত্তর ও ব্যাখ্যাসহ। MCQ-তে অপশনে ক্লিক করে নিজেকে যাচাই করো।</p></div>
    </div>
    <div class="tabs" id="exam-tabs">${tabBtns}</div>
    ${panels}
  </div>`;
}

function examPanel(id, data) {
  switch (id) {
    case "mcq": return data.map((q, i) => renderMCQ(q, i)).join("") + `<div class="quiz-score" id="quiz-score" hidden>স্কোর: <b><span id="quiz-correct">0</span></b> / ${data.length}</div>`;
    case "vshort":
    case "short":
    case "long": return data.map((q, i) => renderQA(q, i)).join("");
    case "fib": return `<div class="card">${data.map((q, i) => `
      <div class="fib"><span class="fib__n">${i + 1}.</span><div><div class="fib__q">${esc(q.q)}</div>
      <button class="qa__toggle" data-reveal="fib-${i}">উত্তর দেখাও</button>
      <span class="fib__a" id="fib-${i}" hidden>${esc(q.a)}</span></div></div>`).join("")}</div>`;
    case "match": return renderMatch(data);
    case "tf": return data.map((q, i) => `
      <div class="tf-item">
        <span class="tf-item__verdict ${q.answer ? "tf-true" : "tf-false"}">${q.answer ? "সত্য" : "মিথ্যা"}</span>
        <div><div>${esc(q.q)}</div><button class="qa__toggle" data-reveal="tf-${i}">ব্যাখ্যা</button>
        <div class="qa__a" id="tf-${i}" hidden>${esc(q.explanation)}</div></div>
      </div>`).join("");
    case "ar": return data.map((q, i) => `
      <div class="ar">
        <div class="ar__line"><b>বিবৃতি (A):</b> ${esc(q.assertion)}</div>
        <div class="ar__line"><b>কারণ (R):</b> ${esc(q.reason)}</div>
        <button class="qa__toggle" data-reveal="ar-${i}">উত্তর ও ব্যাখ্যা</button>
        <div class="qa__a" id="ar-${i}" hidden><b>${esc(q.verdict)}</b><br>${esc(q.explanation)}</div>
      </div>`).join("");
    case "diag": return data.map((q, i) => renderQA(q, i, "diag")).join("");
    default: return "";
  }
}

function renderMCQ(q, i) {
  const lvl = { "সহজ": "lvl-easy", "মাঝারি": "lvl-medium", "কঠিন": "lvl-hard" }[q.level] || "lvl-medium";
  return `
  <div class="mcq" data-mcq="${i}" data-answer="${q.answer}">
    <div class="mcq__q"><span class="mcq__n">${i + 1}</span><p>${esc(q.q)}</p><span class="mcq__level ${lvl}">${esc(q.level || "")}</span></div>
    <div class="mcq__options">
      ${q.options.map((opt, j) => `
        <button class="mcq-opt" data-opt="${j}"><span class="mcq-opt__key">${String.fromCharCode(2453 + j)}</span><span>${esc(opt)}</span></button>`).join("")}
    </div>
    <div class="mcq__explain" hidden>
      ${q.concept ? `<div class="mcq__concept">🎯 কোন ধারণা যাচাই হচ্ছে: <b>${esc(q.concept)}</b></div>` : ""}
      <div class="mcq__why"><b>কেন সঠিক:</b> ${esc(q.explanation)}</div>
      ${q.whyWrong ? `<div class="mcq__why mcq__why--wrong"><b>অন্যগুলো কেন নয়:</b> ${esc(q.whyWrong)}</div>` : ""}
    </div>
  </div>`;
}

function renderQA(q, i, prefix = "qa") {
  return `
  <div class="qa">
    <div class="qa__q"><span class="qmark">প্র.</span><span>${esc(q.q)}</span></div>
    <div class="qa__reveal">
      <button class="qa__toggle" data-reveal="${prefix}-${i}">${icon.chev} মডেল উত্তর দেখাও</button>
      <div class="qa__a" id="${prefix}-${i}" hidden><b>উত্তর:</b> ${esc(q.a)}</div>
    </div>
  </div>`;
}

function renderMatch(data) {
  // Shuffle right column for a genuine "match" feel, but keep answer key below.
  const right = data.map((d, i) => ({ text: d.right, i }));
  for (let k = right.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [right[k], right[j]] = [right[j], right[k]]; }
  const rows = data.map((d, i) => `
    <div class="match-cell match-cell--a">${esc(String.fromCharCode(2453 + i))}. ${esc(d.left)}</div>
    <div class="match-arrow">↔</div>
    <div class="match-cell match-cell--b">${esc(String.fromCharCode(105 + i))}. ${esc(right[i].text)}</div>`).join("");
  const key = data.map((d, i) => `${String.fromCharCode(2453 + i)} → ${esc(d.right)}`).join(" · ");
  return `<div class="card"><div class="match-grid">${rows}</div>
    <button class="qa__toggle" style="margin-top:14px" data-reveal="match-key">সঠিক মিল দেখাও</button>
    <div class="qa__a" id="match-key" hidden><b>সঠিক মিল:</b> ${key}</div></div>`;
}

/* ============================================================
   REVISION
   ============================================================ */
export function renderRevision(rev, slug) {
  if (!rev) return "";
  const checked = revChecklist.get(slug);
  return `
  <div id="revision">
    <h2 class="section-title"><span class="bar"></span> রিভিশন জোন</h2>
    <div class="revision-card">
      <h3>📖 অধ্যায় সারসংক্ষেপ</h3>
      <p style="color:var(--text-soft)">${esc(rev.summary || "")}</p>
    </div>
    ${(rev.keyDefinitions && rev.keyDefinitions.length) ? `
    <div class="revision-card">
      <h3>🔑 মূল সংজ্ঞা</h3>
      <div class="def-list">${rev.keyDefinitions.map(d => `<div class="def-list__item"><b>${esc(d.term)}:</b> <span>${esc(d.def)}</span></div>`).join("")}</div>
    </div>` : ""}
    ${(rev.mustRemember && rev.mustRemember.length) ? `
    <div class="revision-card">
      <h3>⭐ রিভিশন চেকলিস্ট — টিক দিয়ে এগোও</h3>
      <ul class="remember-list checklist" data-checklist="${esc(slug)}">${rev.mustRemember.map((x, i) => `
        <li class="checklist__item ${checked.includes(i) ? "done" : ""}">
          <button class="checklist__box" data-check="${i}" role="checkbox" aria-checked="${checked.includes(i)}" aria-label="সম্পন্ন">
            <svg viewBox="0 0 24 24" width="15" height="15"><path d="M5 12l5 5L20 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <span>${esc(x)}</span>
        </li>`).join("")}</ul>
      <div class="checklist__progress"><span data-checklist-count>${checked.length}</span> / ${rev.mustRemember.length} সম্পন্ন</div>
    </div>` : ""}
    ${rev.lastMinute ? `<div class="lastminute"><h3>⏱️ শেষ মুহূর্তের রিভিশন</h3><p style="color:var(--text-soft)">${esc(rev.lastMinute)}</p></div>` : ""}
  </div>`;
}

/* ============================================================
   CHAPTER PREV/NEXT NAV
   ============================================================ */
function renderChapterNav(m, manifest) {
  const all = manifest.chapters || [];
  const current = all.find(c => c.slug === m.slug);
  const sid = (current && current.subjectId) || m.subjectId;
  // Keep prev/next within the same subject.
  const list = all.filter(c => c.subjectId === sid);
  const idx = list.findIndex(c => c.slug === m.slug);
  const prev = idx > 0 ? list[idx - 1] : null;
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
  const backHref = sid ? `#/subject/${esc(sid)}` : "#/";
  const backLabel = sid ? "বিষয়ে ফিরুন" : "হোমে ফিরুন";
  return `
  <div class="chapter-nav">
    ${prev ? `<a href="#/chapter/${esc(prev.slug)}" data-link><div><div class="chapter-nav__label">← আগের অধ্যায়</div><div class="chapter-nav__title">${esc(prev.title)}</div></div></a>` : `<a href="${backHref}" data-link><div><div class="chapter-nav__label">←</div><div class="chapter-nav__title">${backLabel}</div></div></a>`}
    ${next ? `<a class="next" href="#/chapter/${esc(next.slug)}" data-link><div><div class="chapter-nav__label">পরের অধ্যায় →</div><div class="chapter-nav__title">${esc(next.title)}</div></div></a>` : ""}
  </div>`;
}

/* ============================================================
   SIDEBAR
   ============================================================ */
export function renderSidebar(manifest, activeSlug, chapterData, activeSubjectId) {
  const chapters = manifest.chapters || [];
  const subjects = manifest.subjects || [];

  // Which subject are we in? (from an open chapter, or an open subject view)
  const activeChapter = chapters.find(c => c.slug === activeSlug);
  const curSubjectId = (chapterData && chapterData.meta && chapterData.meta.subjectId)
    || (activeChapter && activeChapter.subjectId)
    || activeSubjectId
    || null;

  // Subjects list (always shown).
  const subjectList = subjects.map(s => `
    <a class="chap-link chap-link--subject ${s.id === curSubjectId && !chapterData ? "active" : ""}" href="#/subject/${esc(s.id)}" data-link>
      <span class="chap-link__num" style="color:${esc(s.accent || "var(--accent)")}">${subjectSvg[s.icon] || "•"}</span>
      <span class="chap-link__body">
        <span class="chap-link__title">${esc(s.name)}</span>
        <span class="chap-link__meta">${esc(s.chapterCount || 0)} অধ্যায় · ${esc(s.topicCount || 0)} টপিক</span>
      </span>
    </a>`).join("");

  // Sibling chapters within the current subject (shown when inside a subject/chapter).
  let siblingChapters = "";
  if (curSubjectId) {
    const sibs = chapters.filter(c => c.subjectId === curSubjectId);
    if (sibs.length) {
      siblingChapters = `
      <div class="side-section">
        <div class="side-title">এই বিষয়ের অধ্যায়</div>
        ${sibs.map(c => `
        <a class="chap-link ${c.slug === activeSlug ? "active" : ""}" href="#/chapter/${esc(c.slug)}" data-link>
          <span class="chap-link__num">${esc(c.number ?? "•")}</span>
          <span class="chap-link__body">
            <span class="chap-link__title">${esc(c.title)}</span>
            <span class="chap-link__meta">${esc(c.topicCount || 0)} টপিক · গুরুত্ব ${esc(c.importance || "—")}</span>
          </span>
        </a>`).join("")}
      </div>`;
    }
  }

  let toc = "";
  if (chapterData) {
    const slug = chapterData.meta.slug;
    const total = (chapterData.topics || []).length;
    const pct = progress.percent(slug, total);
    const links = (chapterData.topics || []).map((t, i) => {
      const done = progress.isRead(slug, t.id);
      return `<a class="toc-link ${done ? "done" : ""}" href="#/chapter/${esc(slug)}#topic-${esc(t.id)}" data-toc="${esc(t.id)}"><span class="toc-dot"></span>${i + 1}. ${esc(t.title)}</a>`;
    }).join("");
    toc = `
    <div class="side-section">
      <div class="side-progress">
        <div class="side-progress__label"><span>পড়ার অগ্রগতি</span><span>${pct}%</span></div>
        <div class="progress-bar"><div class="progress-bar__fill" style="width:${pct}%"></div></div>
      </div>
    </div>
    <div class="side-section">
      <div class="side-title">এই অধ্যায়ের টপিক</div>
      ${links}
      <a class="toc-link" href="#/chapter/${esc(slug)}#exam" data-toc="exam"><span class="toc-dot"></span>📝 পরীক্ষা প্রস্তুতি</a>
      <a class="toc-link" href="#/chapter/${esc(slug)}#revision" data-toc="revision"><span class="toc-dot"></span>📖 রিভিশন জোন</a>
    </div>`;
  }

  return `
  ${toc}
  ${siblingChapters}
  <div class="side-section">
    <div class="side-title">সব বিষয়</div>
    ${subjectList}
  </div>`;
}
