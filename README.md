# মাধ্যমিক জীবনবিজ্ঞান — Interactive Study Platform

**WBBSE Madhyamik (Class 10) Life Science** — একটি প্রিমিয়াম, ইন্টার‌্যাকটিভ স্টাডি ওয়েবসাইট। টেক্সটবুকের চেয়ে সহজ, কোচিং নোটের চেয়ে সম্পূর্ণ — সবকিছু সহজ, কথ্য বাংলায়।

A modern, mobile-first study platform that turns Madhyamik Life Science textbook chapters into
easy-to-understand interactive notes, complete with diagrams, an exam question bank, and
revision tools. Everything a student sees is written in simple, conversational Bengali.

---

## ✨ Features

- **সহজ বাংলায় নোট** — every concept explained like a great teacher would, with real-life
  examples, analogies, "did you know", memory tricks, board tips and common-mistake callouts.
- **Interactive exam bank** — MCQs with instant answer-checking + explanations, short/long
  questions with reveal-able model answers, fill-in-the-blanks, match-the-following, true/false,
  and assertion–reason.
- **Custom SVG diagrams** — coacervate/protobiont, Miller–Urey apparatus, evolution timeline,
  and Lamarck vs Darwin giraffe illustrations that adapt to dark mode.
- **Student-friendly tooling** — instant search (`/` shortcut), dark mode, per-topic reading
  progress tracking, bookmarks, a reading-progress bar, sticky navigation, next/previous chapter
  buttons, a responsive sidebar and a scroll-to-top button.
- **Responsive & fast** — mobile-first, no build step, no heavy frameworks.

---

## 🚀 Getting Started

The app runs on **http://localhost:5000**.

### 1. Prerequisites
- Python 3.10+

### 2. Install dependencies
```bash
cd madhyamik-life-science
pip install -r requirements.txt
```

### 3. Run
```bash
python app.py
```

Then open your browser at **http://localhost:5000**.

> The server runs in debug mode by default. To use a different port:
> `PORT=8000 python app.py`

---

## 📁 Project Structure

```
madhyamik-life-science/
├── app.py                    # Flask server + JSON content API (port 5000)
├── requirements.txt
├── README.md
├── content/
│   └── chapters/
│       └── chapter-04-evolution-adaptation.json   # all chapter content (data-driven)
├── templates/
│   └── index.html            # single-page app shell
└── static/
    ├── css/
    │   ├── variables.css      # design tokens + light/dark themes
    │   ├── base.css           # reset + typography
    │   ├── components.css     # cards, blocks, quiz, callouts…
    │   └── layout.css         # topbar, sidebar, modals, responsive
    ├── js/
    │   ├── app.js             # controller: routing, theme, search, bookmarks
    │   ├── api.js             # data fetching + cache
    │   ├── store.js           # localStorage (theme, progress, bookmarks)
    │   ├── render.js          # content → HTML renderer (all block types)
    │   └── diagrams.js        # inline SVG illustrations
    └── img/
        └── favicon.svg
```

---

## 🧩 How the content works

All teaching content lives in `content/chapters/*.json`. The Flask app auto-discovers these files
and builds the table of contents, so **adding a new chapter needs no code changes** — just drop in
a new JSON file that follows the same schema.

Each chapter file has:

| Key | Purpose |
|-----|---------|
| `meta` | id, slug, number, title (bn/en), pages, importance, etc. |
| `intro` | chapter introduction, why it matters, where students struggle |
| `objectives` | learning objectives |
| `topics[]` | each topic is a list of typed **content blocks** (see below) |
| `exam` | `mcqs`, `veryShort`, `short`, `long`, `fillBlanks`, `match`, `trueFalse`, `assertionReason`, `diagramBased` |
| `revision` | summary, key definitions, must-remember facts, last-minute notes |

**Supported block types** (rendered by `static/js/render.js`):
`paragraph`, `definition`, `termlist`, `keypoints`, `callout`, `didyouknow`, `memorytrick`,
`boardtip`, `analogy`, `flow`, `timeline`, `diagram`, `table`, `mistake`, `prevyear`,
`quickrecap`, `expandable`.

To add a **new diagram**, add an SVG string to `static/js/diagrams.js` keyed by a `ref`, then
reference it from a `diagram` block: `{ "type": "diagram", "ref": "your-ref", "caption": "…" }`.

---

## 📚 Content coverage

- **Chapter 4 — অভিব্যক্তি ও অভিযোজন (Evolution & Adaptation)**
  - অভিব্যক্তির ধারণা (Concept of Evolution)
  - জীবনের উৎপত্তি — রাসায়নিক বিবর্তনবাদ (Origin of Life)
  - মিলার ও উরের পরীক্ষা (Miller–Urey Experiment)
  - অভিব্যক্তির মুখ্য ঘটনাবলি (Major Evolutionary Events)
  - ল্যামার্কবাদ (Lamarckism)
  - ডারউইনবাদ ও প্রাকৃতিক নির্বাচন (Darwinism)

More chapters can be added as new JSON files under `content/chapters/`.

---

## 🔌 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/manifest` | Site info + chapter list (auto-generated) |
| `GET /api/chapters/<slug>` | Full content for one chapter |
| `GET /api/search` | Flat search index across all chapters |
| `GET /health` | Health check |

---

## ⌨️ Keyboard shortcuts

- `/` — open search
- `Esc` — close any open panel

---

Made for motivated Madhyamik students. পড়ায় মন দাও — বাকিটা আমরা সহজ করে দিয়েছি। 💙
