/* =========================================================================
   diagrams.js — inline SVG illustrations for key concepts.
   Each entry is keyed by the "ref" used in the chapter content JSON.
   The SVGs use `currentColor` and CSS variables so they adapt to dark mode.
   ========================================================================= */

const stroke = "var(--text-soft, #4a556b)";
const accent = "var(--accent, #3b82f6)";
const green = "var(--c-success, #10b981)";
const purple = "var(--c-purple, #8b5cf6)";
const warn = "var(--c-warn, #f59e0b)";
const surf = "var(--surface, #fff)";

export const diagrams = {
  /* ---------------- Protobiont / coacervate / microsphere ---------------- */
  protobiont: `
  <svg viewBox="0 0 640 300" role="img" aria-label="কোয়াসারভেট, মাইক্রোস্ফিয়ার ও প্রোটোবায়োন্ট">
    <g font-family="var(--font-bn)" font-size="13" fill="${stroke}" text-anchor="middle">
      <!-- Coacervate -->
      <circle cx="120" cy="130" r="66" fill="${accent}" fill-opacity="0.10" stroke="${accent}" stroke-width="2.5"/>
      <circle cx="105" cy="115" r="10" fill="${accent}" fill-opacity="0.35"/>
      <circle cx="140" cy="140" r="13" fill="${accent}" fill-opacity="0.35"/>
      <circle cx="118" cy="155" r="7" fill="${accent}" fill-opacity="0.35"/>
      <circle cx="150" cy="110" r="6" fill="${accent}" fill-opacity="0.35"/>
      <text x="120" y="220" font-weight="700" fill="${accent}">কোয়াসারভেট</text>
      <text x="120" y="238" font-size="11">(ওপারিন)</text>

      <!-- arrow -->
      <path d="M205 130h55" stroke="${stroke}" stroke-width="2" marker-end="url(#ar)"/>

      <!-- Microsphere -->
      <circle cx="330" cy="130" r="66" fill="${purple}" fill-opacity="0.10" stroke="${purple}" stroke-width="2.5" stroke-dasharray="1 0"/>
      <circle cx="330" cy="130" r="52" fill="none" stroke="${purple}" stroke-width="1.5" stroke-opacity="0.5"/>
      <circle cx="318" cy="120" r="9" fill="${purple}" fill-opacity="0.4"/>
      <circle cx="345" cy="140" r="11" fill="${purple}" fill-opacity="0.4"/>
      <text x="330" y="220" font-weight="700" fill="${purple}">মাইক্রোস্ফিয়ার</text>
      <text x="330" y="238" font-size="11">(ফক্স, ১৯৬৫)</text>

      <!-- arrow -->
      <path d="M415 130h55" stroke="${stroke}" stroke-width="2" marker-end="url(#ar)"/>

      <!-- Protobiont -->
      <circle cx="545" cy="130" r="66" fill="${green}" fill-opacity="0.12" stroke="${green}" stroke-width="3"/>
      <path d="M545 90c14 12 14 68 0 80M545 90c-14 12-14 68 0 80" fill="none" stroke="${green}" stroke-width="2"/>
      <circle cx="532" cy="122" r="8" fill="${green}" fill-opacity="0.5"/>
      <circle cx="558" cy="138" r="10" fill="${green}" fill-opacity="0.5"/>
      <text x="545" y="220" font-weight="700" fill="${green}">প্রোটোবায়োন্ট</text>
      <text x="545" y="238" font-size="11">(কোশসদৃশ গঠন)</text>
    </g>
    <defs>
      <marker id="ar" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0 0l6 3-6 3z" fill="${stroke}"/></marker>
    </defs>
  </svg>`,

  /* ---------------- Miller–Urey apparatus ---------------- */
  "miller-urey": `
  <svg viewBox="0 0 560 340" role="img" aria-label="মিলার ও উরের পরীক্ষার যন্ত্র">
    <g fill="none" stroke="${stroke}" stroke-width="2.5" font-family="var(--font-bn)">
      <!-- Upper gas chamber -->
      <circle cx="360" cy="80" r="52" fill="${accent}" fill-opacity="0.08"/>
      <!-- electrodes / spark -->
      <line x1="338" y1="62" x2="348" y2="80" stroke="${warn}" stroke-width="3"/>
      <line x1="382" y1="62" x2="372" y2="80" stroke="${warn}" stroke-width="3"/>
      <path d="M348 80l10 6 -6 8 12 6" stroke="${warn}" stroke-width="2.5" fill="none"/>
      <!-- top pipe -->
      <path d="M360 132 v40 h-210 v-40" />
      <!-- left tube down to boiling flask -->
      <path d="M150 172 v70" />
      <!-- boiling flask -->
      <circle cx="150" cy="272" r="40" fill="${accent}" fill-opacity="0.14"/>
      <path d="M150 236 v-24" />
      <!-- water waves -->
      <path d="M124 278q13 -10 26 0t26 0" stroke="${accent}" stroke-width="2" fill="none"/>
      <!-- heat -->
      <path d="M138 316q6 8 12 0M150 316q6 8 12 0" stroke="${warn}" stroke-width="2.5" fill="none"/>
      <!-- condenser (right, going down) -->
      <path d="M412 80 h40 v150 h-40" />
      <path d="M452 120 l-40 20M452 150 l-40 20M452 180 l-40 20" stroke-width="1.5" stroke-opacity="0.6"/>
      <!-- collection trap -->
      <path d="M372 230 v40 a28 28 0 0 0 56 0 v-40 z" fill="${green}" fill-opacity="0.16"/>
      <path d="M382 258q18 -8 36 0" stroke="${green}" stroke-width="2" fill="none"/>
    </g>
    <g font-family="var(--font-bn)" font-size="12" fill="${stroke}">
      <text x="360" y="20" text-anchor="middle" font-weight="700" fill="${accent}">গ্যাস: CH₄·NH₃·H₂·বাষ্প</text>
      <text x="415" y="52" fill="${warn}" font-weight="700">স্ফুলিঙ্গ</text>
      <text x="150" y="330" text-anchor="middle">জলের ফ্লাস্ক</text>
      <text x="500" y="150" text-anchor="middle" transform="rotate(90 500 150)">কনডেন্সার</text>
      <text x="400" y="315" text-anchor="middle" fill="${green}" font-weight="700">অ্যামাইনো অ্যাসিড</text>
    </g>
  </svg>`,

  /* ---------------- Evolution timeline ---------------- */
  "evolution-timeline": `
  <svg viewBox="0 0 560 340" role="img" aria-label="অভিব্যক্তির সময়রেখা">
    <defs><linearGradient id="tg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="${purple}"/></linearGradient></defs>
    <line x1="60" y1="315" x2="60" y2="25" stroke="url(#tg)" stroke-width="5" stroke-linecap="round"/>
    <g font-family="var(--font-bn)" font-size="12.5" fill="${stroke}">
      ${[
        ["পৃথিবীর সৃষ্টি (৪৫০ কোটি)", 300, accent],
        ["জীবনের উৎপত্তি (৩৫০ কোটি)", 255, accent],
        ["এককোশী জীব (৩০০ কোটি)", 210, accent],
        ["সালোকসংশ্লেষী ব্যাকটেরিয়া → O₂", 165, green],
        ["বহুকোশী জীব", 120, purple],
        ["মাছ → মেরুদণ্ডী", 78, purple],
        ["ডাঙার প্রাণী (পাখি, স্তন্যপায়ী)", 38, warn],
      ].map(([t,y,c]) => `
        <circle cx="60" cy="${y}" r="8" fill="${surf}" stroke="${c}" stroke-width="3.5"/>
        <text x="82" y="${y+4}">${t}</text>
      `).join("")}
    </g>
    <text x="60" y="332" font-family="var(--font-bn)" font-size="11" fill="${stroke}" text-anchor="middle">অতীত</text>
  </svg>`,

  /* ---------------- Lamarck giraffe ---------------- */
  "lamarck-giraffe": `
  <svg viewBox="0 0 560 260" role="img" aria-label="ল্যামার্কের জিরাফ ব্যাখ্যা">
    ${giraffe(70, 60, "#c99a4e")}
    ${giraffe(230, 140, "#c99a4e")}
    ${giraffe(400, 200, "#c99a4e")}
    <g font-family="var(--font-bn)" font-size="12" fill="${stroke}" text-anchor="middle">
      <path d="M155 130h45" stroke="${stroke}" stroke-width="2" marker-end="url(#ar2)"/>
      <path d="M320 150h45" stroke="${stroke}" stroke-width="2" marker-end="url(#ar2)"/>
      <text x="110" y="245">ছোট গলা</text>
      <text x="270" y="245">গলা টেনে টেনে</text>
      <text x="450" y="245" font-weight="700" fill="#b45309">লম্বা গলা (বংশে যায়)</text>
    </g>
    <defs><marker id="ar2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0 0l6 3-6 3z" fill="${stroke}"/></marker></defs>
  </svg>`,

  /* ---------------- Darwin giraffe ---------------- */
  "darwin-giraffe": `
  <svg viewBox="0 0 560 270" role="img" aria-label="ডারউইনের জিরাফ ব্যাখ্যা">
    <!-- Stage 1: variation -->
    ${giraffe(40, 150, "#c99a4e")}
    ${giraffe(110, 70, "#c99a4e")}
    <!-- cross out short one -->
    <path d="M55 205l45 45M100 205l-45 45" stroke="var(--c-danger,#ef4444)" stroke-width="3"/>
    <!-- arrow -->
    <path d="M215 130h50" stroke="${stroke}" stroke-width="2" marker-end="url(#ar3)"/>
    <!-- Stage 2: selected tall giraffes -->
    ${giraffe(300, 60, "#c99a4e")}
    ${giraffe(430, 70, "#c99a4e")}
    <g font-family="var(--font-bn)" font-size="12" fill="${stroke}" text-anchor="middle">
      <text x="110" y="262">নানা গলার প্রকরণ</text>
      <text x="110" y="196" fill="var(--c-danger,#ef4444)" font-weight="700">✗ ছোট গলা মরে</text>
      <text x="400" y="262" font-weight="700" fill="${green}">যোগ্যতম (লম্বা গলা) টেকে</text>
    </g>
    <defs><marker id="ar3" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0 0l6 3-6 3z" fill="${stroke}"/></marker></defs>
  </svg>`,
};

/* Small reusable giraffe glyph. x = left, neckTop = y of head, colour. */
function giraffe(x, neckTop, color) {
  const bodyY = 200;
  return `
  <g stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round">
    <!-- legs -->
    <line x1="${x}" y1="${bodyY}" x2="${x}" y2="${bodyY + 40}"/>
    <line x1="${x + 34}" y1="${bodyY}" x2="${x + 34}" y2="${bodyY + 40}"/>
    <!-- body -->
    <line x1="${x - 4}" y1="${bodyY}" x2="${x + 38}" y2="${bodyY}"/>
    <!-- neck -->
    <line x1="${x + 34}" y1="${bodyY}" x2="${x + 46}" y2="${neckTop}"/>
    <!-- head -->
    <line x1="${x + 46}" y1="${neckTop}" x2="${x + 62}" y2="${neckTop - 6}"/>
  </g>
  <circle cx="${x + 63}" cy="${neckTop - 7}" r="4" fill="${color}"/>`;
}
