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

  /* ---------------- Horse evolution (Eohippus → Equus) ---------------- */
  "horse-evolution": `
  <svg viewBox="0 0 640 300" role="img" aria-label="ঘোড়ার বিবর্তন: ইওহিপ্পাস থেকে ইকুয়াস">
    <line x1="30" y1="250" x2="610" y2="250" stroke="${stroke}" stroke-width="2"/>
    <g font-family="var(--font-bn)" font-size="11" fill="${stroke}" text-anchor="middle">
      ${[
        ["ইওহিপ্পাস", "৩০ cm", 90, 22, "#c99a4e"],
        ["মেসোহিপ্পাস", "৬০ cm", 210, 34, "#c79245"],
        ["মেরিচিপ্পাস", "১০০ cm", 330, 48, "#bf863a"],
        ["প্লায়োহিপ্পাস", "১২০ cm", 450, 60, "#b07d33"],
        ["ইকুয়াস", "১৫০ cm", 570, 74, "#9c6b28"],
      ].map(([n,h,x,size,col]) => `
        <g>
          <ellipse cx="${x}" cy="${240 - size*0.55}" rx="${size*0.62}" ry="${size*0.42}" fill="${col}" fill-opacity="0.85"/>
          <rect x="${x + size*0.4}" y="${240 - size*1.05}" width="${size*0.5}" height="${size*0.6}" rx="${size*0.18}" fill="${col}" fill-opacity="0.85"/>
          <line x1="${x - size*0.35}" y1="${240 - size*0.4}" x2="${x - size*0.35}" y2="248" stroke="${col}" stroke-width="3"/>
          <line x1="${x + size*0.3}" y1="${240 - size*0.35}" x2="${x + size*0.3}" y2="248" stroke="${col}" stroke-width="3"/>
          <text x="${x}" y="268" font-weight="700">${n}</text>
          <text x="${x}" y="283" font-size="10" fill="${accent}">${h}</text>
        </g>`).join("")}
      <path d="M150 200h20M270 200h20M390 200h20M510 200h20" stroke="${stroke}" stroke-width="2" marker-end="url(#hev)"/>
    </g>
    <text x="320" y="18" font-family="var(--font-bn)" font-size="12.5" font-weight="700" fill="${accent}" text-anchor="middle">ছোট → বড়, ৪ আঙুল → ১ ক্ষুর (কোটি বছরে)</text>
    <defs><marker id="hev" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0 0l6 3-6 3z" fill="${stroke}"/></marker></defs>
  </svg>`,

  /* ---------------- Homologous forelimbs ---------------- */
  "homologous-limbs": `
  <svg viewBox="0 0 640 260" role="img" aria-label="সমসংস্থ অঙ্গ: বিভিন্ন প্রাণীর অগ্রপদ">
    <g font-family="var(--font-bn)" font-size="12" fill="${stroke}" text-anchor="middle">
      ${[
        ["তিমি", 90],
        ["পাখি", 235],
        ["বাদুড়", 400],
        ["মানুষ", 560],
      ].map(([n,x],idx) => `
        <g transform="translate(${x},40)">
          <rect x="-14" y="0" width="28" height="46" rx="10" fill="${accent}" fill-opacity="0.7"/>
          <rect x="-11" y="48" width="22" height="40" rx="8" fill="${green}" fill-opacity="0.7"/>
          <rect x="-9" y="90" width="18" height="24" rx="6" fill="${warn}" fill-opacity="0.8"/>
          ${idx===1
            ? `<path d="M-6 116 l-14 60 M0 116 l0 66 M6 116 l16 58" stroke="${purple}" stroke-width="5" stroke-linecap="round"/>`
            : idx===2
            ? `<path d="M-8 116 l-24 54 M-3 116 l-6 66 M2 116 l10 64 M7 116 l26 50" stroke="${purple}" stroke-width="4" stroke-linecap="round"/>`
            : `<path d="M-8 116 l-8 46 M-3 116 l-2 54 M2 116 l4 52 M7 116 l12 44" stroke="${purple}" stroke-width="5" stroke-linecap="round"/>`}
          <text x="0" y="205" font-weight="700">${n}</text>
        </g>`).join("")}
    </g>
    <g font-family="var(--font-bn)" font-size="11" text-anchor="start">
      <rect x="20" y="228" width="14" height="12" fill="${accent}" fill-opacity="0.7"/><text x="40" y="238" fill="${stroke}">হিউমেরাস</text>
      <rect x="150" y="228" width="14" height="12" fill="${green}" fill-opacity="0.7"/><text x="170" y="238" fill="${stroke}">রেডিয়াস-আলনা</text>
      <rect x="320" y="228" width="14" height="12" fill="${warn}" fill-opacity="0.8"/><text x="340" y="238" fill="${stroke}">কার্পাল</text>
      <rect x="430" y="228" width="14" height="12" fill="${purple}" fill-opacity="0.8"/><text x="450" y="238" fill="${stroke}">মেটাকার্পাল-ফ্যালাঞ্জেস</text>
    </g>
  </svg>`,

  /* ---------------- Vertebrate heart evolution ---------------- */
  "vertebrate-hearts": `
  <svg viewBox="0 0 640 280" role="img" aria-label="মেরুদণ্ডী প্রাণীর হৃৎপিণ্ডের ক্রমবিকাশ">
    <g font-family="var(--font-bn)" font-size="12" fill="${stroke}" text-anchor="middle">
      <!-- Fish: 2 chambers -->
      <g transform="translate(80,50)">
        <rect x="-30" y="0" width="60" height="42" rx="16" fill="${accent}" fill-opacity="0.3" stroke="${accent}" stroke-width="2"/>
        <rect x="-30" y="52" width="60" height="52" rx="16" fill="${accent}" fill-opacity="0.55" stroke="${accent}" stroke-width="2"/>
        <text x="0" y="150" font-weight="700">মাছ</text>
        <text x="0" y="167" font-size="11">২ প্রকোষ্ঠ</text>
      </g>
      <!-- Frog: 3 chambers -->
      <g transform="translate(240,50)">
        <rect x="-38" y="0" width="34" height="42" rx="14" fill="${green}" fill-opacity="0.35" stroke="${green}" stroke-width="2"/>
        <rect x="6" y="0" width="34" height="42" rx="14" fill="${warn}" fill-opacity="0.35" stroke="${warn}" stroke-width="2"/>
        <rect x="-30" y="52" width="60" height="54" rx="16" fill="${purple}" fill-opacity="0.45" stroke="${purple}" stroke-width="2"/>
        <text x="0" y="150" font-weight="700">উভচর</text>
        <text x="0" y="167" font-size="11">৩ প্রকোষ্ঠ</text>
      </g>
      <!-- Reptile: 3 (part-divided ventricle) -->
      <g transform="translate(400,50)">
        <rect x="-38" y="0" width="34" height="42" rx="14" fill="${green}" fill-opacity="0.35" stroke="${green}" stroke-width="2"/>
        <rect x="6" y="0" width="34" height="42" rx="14" fill="${warn}" fill-opacity="0.35" stroke="${warn}" stroke-width="2"/>
        <rect x="-30" y="52" width="60" height="54" rx="16" fill="${purple}" fill-opacity="0.45" stroke="${purple}" stroke-width="2"/>
        <path d="M0 60 v40" stroke="${purple}" stroke-width="2" stroke-dasharray="4 4"/>
        <text x="0" y="150" font-weight="700">সরীসৃপ</text>
        <text x="0" y="167" font-size="11">নিলয় আংশিক বিভক্ত</text>
      </g>
      <!-- Bird/mammal: 4 chambers -->
      <g transform="translate(560,50)">
        <rect x="-38" y="0" width="34" height="42" rx="14" fill="${green}" fill-opacity="0.4" stroke="${green}" stroke-width="2"/>
        <rect x="6" y="0" width="34" height="42" rx="14" fill="${warn}" fill-opacity="0.4" stroke="${warn}" stroke-width="2"/>
        <rect x="-38" y="52" width="34" height="54" rx="12" fill="${accent}" fill-opacity="0.5" stroke="${accent}" stroke-width="2"/>
        <rect x="6" y="52" width="34" height="54" rx="12" fill="${'var(--c-danger,#ef4444)'}" fill-opacity="0.45" stroke="var(--c-danger,#ef4444)" stroke-width="2"/>
        <text x="0" y="150" font-weight="700">পাখি ও স্তন্যপায়ী</text>
        <text x="0" y="167" font-size="11">৪ প্রকোষ্ঠ</text>
      </g>
      <path d="M120 78h70M280 78h70M440 78h70" stroke="${stroke}" stroke-width="2" marker-end="url(#hrt)"/>
    </g>
    <text x="320" y="210" font-family="var(--font-bn)" font-size="12.5" font-weight="700" fill="${green}" text-anchor="middle">সরল → জটিল: রক্ত ক্রমশ ভালোভাবে আলাদা হয়েছে</text>
    <defs><marker id="hrt" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0 0l6 3-6 3z" fill="${stroke}"/></marker></defs>
  </svg>`,

  /* ---------------- Comparative embryology ---------------- */
  "comparative-embryo": `
  <svg viewBox="0 0 600 240" role="img" aria-label="তুলনামূলক ভ্রূণতত্ত্ব: বিভিন্ন প্রাণীর প্রাথমিক ভ্রূণ প্রায় একরকম">
    <g font-family="var(--font-bn)" font-size="12" fill="${stroke}" text-anchor="middle">
      ${[["মাছ",100],["সরীসৃপ",250],["পাখি",400],["মানুষ",520]].map(([n,x]) => `
        <g transform="translate(${x},60)">
          <path d="M0 -34 C 40 -34 44 6 20 34 C 8 48 -6 44 -8 28 C -20 30 -30 20 -24 6 C -34 -6 -24 -28 0 -34 Z"
                fill="${accent}" fill-opacity="0.16" stroke="${accent}" stroke-width="2"/>
          <circle cx="6" cy="-14" r="6" fill="${accent}" fill-opacity="0.5"/>
          <path d="M-14 -4 q6 -6 12 0 M-14 4 q6 -6 12 0 M-14 12 q6 -6 12 0" stroke="${warn}" stroke-width="1.6" fill="none"/>
          <text x="0" y="70" font-weight="700">${n}</text>
        </g>`).join("")}
    </g>
    <text x="300" y="30" font-family="var(--font-bn)" font-size="12.5" font-weight="700" fill="${warn}" text-anchor="middle">প্রাথমিক ভ্রূণে সবারই ফুলকা-খাঁজ (কমলা) থাকে</text>
    <text x="300" y="220" font-family="var(--font-bn)" font-size="11.5" fill="${stroke}" text-anchor="middle">হেকেলের সূত্র — 'ব্যক্তিজনি জাতিজনির পুনরাবৃত্তি ঘটায়'</text>
  </svg>`,

  /* ---------------- Pigeon air sacs ---------------- */
  "pigeon-air-sacs": `
  <svg viewBox="0 0 560 280" role="img" aria-label="পায়রার বায়ুথলি">
    <g font-family="var(--font-bn)" font-size="12" fill="${stroke}">
      <path d="M120 150 q40 -80 150 -70 q80 6 150 40 q30 14 60 6 q-20 30 -60 30 q-90 6 -150 24 q-90 26 -150 -20 q-16 -18 0 -40 Z"
            fill="${accent}" fill-opacity="0.12" stroke="${accent}" stroke-width="2"/>
      <ellipse cx="200" cy="120" rx="22" ry="16" fill="${warn}" fill-opacity="0.5" stroke="${warn}" stroke-width="1.6"/>
      <ellipse cx="255" cy="150" rx="30" ry="20" fill="${green}" fill-opacity="0.45" stroke="${green}" stroke-width="1.6"/>
      <ellipse cx="320" cy="165" rx="34" ry="22" fill="${purple}" fill-opacity="0.4" stroke="${purple}" stroke-width="1.6"/>
      <ellipse cx="240" cy="108" rx="20" ry="13" fill="${'var(--c-danger,#ef4444)'}" fill-opacity="0.35" stroke="var(--c-danger,#ef4444)" stroke-width="1.6"/>
      <circle cx="450" cy="120" r="10" fill="${stroke}" fill-opacity="0.5"/>
      <text x="200" y="123" text-anchor="middle" font-size="10" font-weight="700">গ্রীবা</text>
      <text x="255" y="154" text-anchor="middle" font-size="10" font-weight="700">বক্ষীয়</text>
      <text x="320" y="169" text-anchor="middle" font-size="10" font-weight="700">উদরীয়</text>
    </g>
    <text x="280" y="255" font-family="var(--font-bn)" font-size="12.5" font-weight="700" fill="${accent}" text-anchor="middle">৯টি বায়ুথলি — দেহ হালকা, ওড়ার সময় বাড়তি অক্সিজেন</text>
  </svg>`,

  /* ---------------- Fish air bladder ---------------- */
  "fish-air-bladder": `
  <svg viewBox="0 0 560 240" role="img" aria-label="রুই মাছের পটকা (বায়ুথলি)">
    <g font-family="var(--font-bn)" font-size="12" fill="${stroke}">
      <path d="M70 120 q120 -70 300 -30 q60 14 120 30 q-60 16 -120 30 q-180 40 -300 -30 Z"
            fill="${accent}" fill-opacity="0.12" stroke="${accent}" stroke-width="2"/>
      <path d="M470 90 l40 -22 l0 44 Z" fill="${accent}" fill-opacity="0.2" stroke="${accent}" stroke-width="2"/>
      <circle cx="150" cy="108" r="7" fill="${stroke}"/>
      <ellipse cx="250" cy="112" rx="90" ry="24" fill="${warn}" fill-opacity="0.55" stroke="${warn}" stroke-width="2"/>
      <text x="250" y="116" text-anchor="middle" font-weight="700" font-size="12">পটকা (বায়ুথলি)</text>
    </g>
    <text x="280" y="200" font-family="var(--font-bn)" font-size="12.5" font-weight="700" fill="${warn}" text-anchor="middle">গ্যাসভর্তি থলি — জলে ভেসে থাকার প্লবতা নিয়ন্ত্রণ</text>
  </svg>`,

  /* ---------------- Sundari pneumatophore ---------------- */
  "sundari-pneumatophore": `
  <svg viewBox="0 0 560 260" role="img" aria-label="সুন্দরী গাছের শ্বাসমূল">
    <rect x="0" y="150" width="560" height="110" fill="${stroke}" fill-opacity="0.12"/>
    <line x1="0" y1="150" x2="560" y2="150" stroke="${stroke}" stroke-width="2" stroke-dasharray="6 5"/>
    <g stroke="#6b4f2a" stroke-width="7" stroke-linecap="round" fill="none">
      <path d="M280 150 V60"/>
      <path d="M280 90 q-30 -26 -60 -34 M280 80 q30 -24 60 -30 M280 70 q-14 -30 -34 -44 M280 66 q18 -30 40 -40"/>
    </g>
    <g fill="${green}" fill-opacity="0.75"><circle cx="230" cy="34" r="26"/><circle cx="300" cy="26" r="30"/><circle cx="330" cy="52" r="22"/><circle cx="255" cy="52" r="20"/></g>
    <g stroke="#8a6a38" stroke-width="6" stroke-linecap="round">
      ${[120,170,205,355,395,445].map(x=>`<line x1="${x}" y1="150" x2="${x}" y2="${118 - (x%40)}"/>`).join("")}
    </g>
    <g font-family="var(--font-bn)" font-size="12" fill="${stroke}" text-anchor="middle">
      <text x="140" y="175" font-weight="700" fill="#8a6a38">শ্বাসমূল</text>
      <text x="410" y="175" font-weight="700" fill="#8a6a38">(নিউম্যাটোফোর)</text>
      <text x="280" y="245" font-size="12.5" font-weight="700" fill="${green}">কাদায় অক্সিজেন কম → মূল উপরে উঠে বাতাস থেকে O₂ নেয়</text>
    </g>
  </svg>`,

  /* ---------------- Camel adaptation ---------------- */
  "camel-adaptation": `
  <svg viewBox="0 0 560 260" role="img" aria-label="উটের মরুভূমির অভিযোজন">
    <g stroke="#c79245" stroke-width="6" fill="#d8a860" fill-opacity="0.85" stroke-linejoin="round">
      <path d="M120 180 q10 -70 60 -70 q20 -34 46 0 q20 -30 40 0 q40 0 60 20 q30 6 40 30 q-6 10 -20 8 l-6 -10 q-30 6 -60 4 q-40 30 -100 20 q-10 20 -34 10 q-6 -20 8 -30 q-16 -6 -14 -12 Z"/>
    </g>
    <g stroke="#c79245" stroke-width="7" stroke-linecap="round"><line x1="150" y1="180" x2="150" y2="230"/><line x1="200" y1="182" x2="200" y2="230"/><line x1="290" y1="184" x2="290" y2="230"/><line x1="330" y1="184" x2="330" y2="230"/></g>
    <g font-family="var(--font-bn)" font-size="11.5" fill="${stroke}" text-anchor="middle">
      <path d="M215 105 l0 -34" stroke="${accent}" stroke-width="1.4"/><text x="215" y="60" font-weight="700" fill="${accent}">কুঁজে চর্বি → বিপাকে জল</text>
      <path d="M400 135 l40 -20" stroke="${warn}" stroke-width="1.4"/><text x="470" y="112" font-weight="700" fill="${warn}">পুরু চামড়া</text>
      <text x="280" y="252" font-size="12.5" font-weight="700" fill="${green}">অল্প জল খরচ: ঘন মূত্র, শুষ্ক বিষ্ঠা, ঠান্ডা নিঃশ্বাস</text>
    </g>
  </svg>`,

  /* ---------------- Honeybee waggle dance ---------------- */
  "bee-dance": `
  <svg viewBox="0 0 560 260" role="img" aria-label="মৌমাছির নৃত্য: চক্রাকার ও ওয়াগটেল">
    <g font-family="var(--font-bn)" font-size="12" fill="${stroke}" text-anchor="middle">
      <!-- round dance -->
      <circle cx="150" cy="110" r="52" fill="none" stroke="${accent}" stroke-width="2.5" stroke-dasharray="6 6"/>
      <path d="M150 58 a52 52 0 0 1 40 78" fill="none" stroke="${accent}" stroke-width="2.5" marker-end="url(#bd)"/>
      <ellipse cx="150" cy="110" rx="9" ry="14" fill="${warn}" stroke="${stroke}" stroke-width="1.4"/>
      <text x="150" y="192" font-weight="700">চক্রাকার নৃত্য</text>
      <text x="150" y="208" font-size="10.5">কাছের খাবার (৫০–৭৫ m)</text>
      <!-- waggle (figure 8) -->
      <path d="M410 60 C 350 90 350 120 410 130 C 470 140 470 170 410 190 C 350 170 350 140 410 130 C 470 120 470 90 410 60 Z"
            fill="none" stroke="${purple}" stroke-width="2.5"/>
      <line x1="410" y1="70" x2="410" y2="180" stroke="${'var(--c-danger,#ef4444)'}" stroke-width="3" stroke-dasharray="4 4"/>
      <ellipse cx="410" cy="125" rx="9" ry="14" fill="${warn}" stroke="${stroke}" stroke-width="1.4"/>
      <text x="410" y="215" font-weight="700">ওয়াগটেল নৃত্য</text>
      <text x="410" y="231" font-size="10.5">দূরের খাবার (৭৫ m+), অভিমুখ বোঝায়</text>
    </g>
    <defs><marker id="bd" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0 0l6 3-6 3z" fill="${accent}"/></marker></defs>
  </svg>`,

  /* ---------------- Cactus (xerophyte) ---------------- */
  "cactus-xerophyte": `
  <svg viewBox="0 0 480 280" role="img" aria-label="ক্যাকটাস — মরু উদ্ভিদের অভিযোজন">
    <rect x="0" y="200" width="480" height="80" fill="${warn}" fill-opacity="0.12"/>
    <line x1="0" y1="200" x2="480" y2="200" stroke="${stroke}" stroke-width="1.5" stroke-dasharray="6 5"/>
    <g fill="${green}" fill-opacity="0.8" stroke="${green}" stroke-width="2">
      <rect x="205" y="70" width="70" height="140" rx="34"/>
      <rect x="150" y="110" width="30" height="70" rx="15"/>
      <rect x="300" y="100" width="30" height="80" rx="15"/>
      <path d="M165 110 q-30 -20 -14 -46" fill="none" stroke-width="8"/>
      <path d="M315 100 q30 -20 16 -50" fill="none" stroke-width="8"/>
    </g>
    <g stroke="${stroke}" stroke-width="1.4">${Array.from({length:9}).map((_,i)=>`<line x1="240" y1="${84+i*14}" x2="${i%2?232:248}" y2="${80+i*14}"/>`).join("")}</g>
    <g stroke="#8a6a38" stroke-width="4" stroke-linecap="round" fill="none">
      <path d="M240 210 v50 M225 210 q-30 30 -50 46 M255 210 q30 30 50 46 M240 210 q-10 40 -20 60 M240 210 q10 40 20 60"/>
    </g>
    <g font-family="var(--font-bn)" font-size="11.5" fill="${stroke}">
      <text x="360" y="150" font-weight="700" fill="${green}">রসালো কাণ্ডে জল জমা</text>
      <text x="150" y="66" font-weight="700" fill="${stroke}">পাতা → কাঁটা</text>
      <text x="240" y="276" text-anchor="middle" font-weight="700" fill="#8a6a38">গভীর ও বিস্তৃত মূল</text>
    </g>
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
