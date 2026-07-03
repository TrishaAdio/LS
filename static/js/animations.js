/* =========================================================================
   animations.js — animated variants of key diagrams.
   Sibling of diagrams.js / figures.js. Keyed by the same "ref" used in the
   chapter content JSON. A diagram block opts in with "animate": true.

   Design rules (match production constraints):
   - Pure inline SVG. Motion lives in CSS @keyframes (see components.css),
     gated by the `.playing` class on the canvas — NOT SMIL, no build step.
   - The RESTING state (no `.playing`) is the fully-composed diagram, so the
     visual is complete even before/without interaction, and under
     prefers-reduced-motion (which disables the keyframes).
   - Uses the same CSS-variable colour tokens as diagrams.js => dark-mode aware.
   - All Bengali copy is real <text>, using var(--font-bn).
   ========================================================================= */

const stroke = "var(--text-soft, #4a556b)";
const accent = "var(--accent, #3b82f6)";
const green = "var(--c-success, #10b981)";
const warn = "var(--c-warn, #f59e0b)";

export const animations = {
  /* ---------------- Miller–Urey apparatus (step-by-step) ---------------- */
  "miller-urey": {
    // ~10s single-run timeline; four phases labelled in Bengali.
    "svg": `
  <svg viewBox="0 0 560 372" role="img" aria-label="মিলার ও উরের পরীক্ষা — ধাপে ধাপে অ্যানিমেশন">
    <!-- ===== static apparatus (always visible = resting state) ===== -->
    <g fill="none" stroke="${stroke}" stroke-width="2.5" font-family="var(--font-bn)">
      <circle cx="360" cy="80" r="52" fill="${accent}" fill-opacity="0.08"/>
      <!-- electrodes (structural, static) -->
      <line x1="338" y1="62" x2="348" y2="80" stroke="${warn}" stroke-width="3"/>
      <line x1="382" y1="62" x2="372" y2="80" stroke="${warn}" stroke-width="3"/>
      <!-- top pipe + left tube -->
      <path d="M360 132 v40 h-210 v-40" />
      <path d="M150 172 v70" />
      <!-- boiling flask -->
      <circle cx="150" cy="272" r="40" fill="${accent}" fill-opacity="0.14"/>
      <path d="M150 236 v-24" />
      <path d="M124 278q13 -10 26 0t26 0" stroke="${accent}" stroke-width="2" fill="none"/>
      <!-- condenser -->
      <path d="M412 80 h40 v150 h-40" />
      <path d="M452 120 l-40 20M452 150 l-40 20M452 180 l-40 20" stroke-width="1.5" stroke-opacity="0.6"/>
      <!-- collection trap outline -->
      <path d="M372 230 v40 a28 28 0 0 0 56 0 v-40 z" fill="${green}" fill-opacity="0.10"/>
    </g>

    <!-- ===== animated layers (resting state below = complete look) ===== -->

    <!-- liquid collected in the trap (rests full; fills up while playing) -->
    <path class="mu-fill" d="M373 231 v39 a27 27 0 0 0 54 0 v-39 z" fill="${green}" fill-opacity="0.34"/>

    <!-- heat under the flask -->
    <g class="mu-heat" stroke="${warn}" stroke-width="2.5" fill="none" stroke-linecap="round">
      <path d="M138 316q6 8 12 0M150 316q6 8 12 0"/>
    </g>

    <!-- rising vapour in the left tube (transient: hidden at rest) -->
    <g class="mu-vapor" fill="${accent}" fill-opacity="0.55">
      <circle cx="150" cy="250" r="4"/><circle cx="145" cy="256" r="3"/><circle cx="155" cy="258" r="3.2"/>
    </g>

    <!-- electric spark (rests visible; flashes during step 2) -->
    <g class="mu-spark" stroke="${warn}" stroke-width="2.6" fill="none" stroke-linecap="round">
      <path d="M348 80l10 6 -6 8 12 6"/>
      <path d="M352 70l8 8" stroke-width="1.6"/>
    </g>

    <!-- newly-formed molecules travelling chamber -> condenser -> trap
         (transient: hidden at rest) -->
    <g class="mu-mol" fill="${green}">
      <circle cx="356" cy="76" r="4"/><circle cx="364" cy="82" r="4.5"/>
      <circle cx="358" cy="88" r="3.5"/><circle cx="366" cy="79" r="3.8"/>
    </g>

    <!-- ===== labels ===== -->
    <g font-family="var(--font-bn)" font-size="12" fill="${stroke}">
      <text x="360" y="20" text-anchor="middle" font-weight="700" fill="${accent}">গ্যাস: CH₄·NH₃·H₂·বাষ্প</text>
      <text x="415" y="52" fill="${warn}" font-weight="700">স্ফুলিঙ্গ</text>
      <text x="150" y="330" text-anchor="middle">জলের ফ্লাস্ক</text>
      <text x="512" y="150" text-anchor="middle" transform="rotate(90 512 150)">কনডেন্সার</text>
      <text class="mu-amino" x="400" y="316" text-anchor="middle" fill="${green}" font-weight="700">অ্যামাইনো অ্যাসিড</text>
    </g>

    <!-- ===== step captions (only visible for their phase while playing) ===== -->
    <g font-family="var(--font-bn)" font-size="13" font-weight="700" text-anchor="middle">
      <text class="mu-step mu-step-1" x="280" y="360" fill="${accent}">ধাপ ১ — জল ফুটে বাষ্প উপরে গ্যাসের সঙ্গে মেশে</text>
      <text class="mu-step mu-step-2" x="280" y="360" fill="${warn}">ধাপ ২ — বৈদ্যুতিক স্ফুলিঙ্গ শক্তি জোগায় (বাজের বদলে)</text>
      <text class="mu-step mu-step-3" x="280" y="360" fill="${stroke}">ধাপ ৩ — অণু তৈরি হয়ে কনডেন্সার দিয়ে নেমে আসে</text>
      <text class="mu-step mu-step-4" x="280" y="360" fill="${green}">ধাপ ৪ — সংগ্রহপাত্রে জমে অ্যামাইনো অ্যাসিড</text>
    </g>
  </svg>`,
  },
};
