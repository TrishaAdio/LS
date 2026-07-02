"""
মাধ্যমিক জীবনবিজ্ঞান — Interactive Study Platform
==================================================
WBBSE Madhyamik Life Science interactive study website.

A lightweight Flask application that serves a single-page study platform.
All chapter content lives as structured JSON under ``content/chapters`` so
new chapters can be added without touching application code.

Run:
    python app.py
Then open http://localhost:5000
"""

from __future__ import annotations

import json
import os
from functools import lru_cache
from pathlib import Path

from flask import Flask, abort, jsonify, render_template, send_from_directory

# --------------------------------------------------------------------------- #
# Paths & app setup
# --------------------------------------------------------------------------- #
BASE_DIR = Path(__file__).resolve().parent
CONTENT_DIR = BASE_DIR / "content"
CHAPTERS_DIR = CONTENT_DIR / "chapters"

app = Flask(
    __name__,
    static_folder="static",
    template_folder="templates",
)

# During development we don't want the browser to aggressively cache assets.
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0


# --------------------------------------------------------------------------- #
# Content loading helpers
# --------------------------------------------------------------------------- #
def _read_json(path: Path) -> dict:
    """Read and parse a JSON file, raising a clear error on failure."""
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


@lru_cache(maxsize=1)
def load_manifest() -> dict:
    """Return the site manifest describing all available chapters.

    The manifest is derived automatically from the chapter JSON files so the
    table of contents always stays in sync with the actual content.
    """
    chapters = []
    if CHAPTERS_DIR.exists():
        for path in sorted(CHAPTERS_DIR.glob("*.json")):
            data = _read_json(path)
            meta = data.get("meta", {})
            chapters.append(
                {
                    "id": meta.get("id", path.stem),
                    "slug": meta.get("slug", path.stem),
                    "number": meta.get("number"),
                    "title": meta.get("title"),
                    "titleEn": meta.get("titleEn"),
                    "subtitle": meta.get("subtitle"),
                    "pages": meta.get("pages"),
                    "icon": meta.get("icon"),
                    "accent": meta.get("accent"),
                    "topicCount": len(data.get("topics", [])),
                    "estimatedMinutes": meta.get("estimatedMinutes"),
                    "importance": meta.get("importance"),
                }
            )
    chapters.sort(key=lambda c: (c.get("number") is None, c.get("number")))
    return {
        "site": {
            "title": "মাধ্যমিক জীবনবিজ্ঞান",
            "titleEn": "Madhyamik Life Science",
            "board": "WBBSE",
            "tagline": "সহজ ভাষায়, গভীর বোঝাপড়া",
        },
        "chapters": chapters,
    }


def _chapter_path(slug: str) -> Path | None:
    """Resolve a chapter slug to its JSON file path (safely)."""
    # Prevent path traversal — only allow simple slugs.
    if not slug or "/" in slug or "\\" in slug or ".." in slug:
        return None
    for path in CHAPTERS_DIR.glob("*.json"):
        data = _read_json(path)
        if data.get("meta", {}).get("slug") == slug or path.stem == slug:
            return path
    return None


# --------------------------------------------------------------------------- #
# Page routes
# --------------------------------------------------------------------------- #
@app.route("/")
def index():
    """Serve the single-page application shell."""
    return render_template("index.html")


# --------------------------------------------------------------------------- #
# JSON API
# --------------------------------------------------------------------------- #
@app.route("/api/manifest")
def api_manifest():
    """Return the chapter manifest / table of contents."""
    return jsonify(load_manifest())


@app.route("/api/chapters/<slug>")
def api_chapter(slug: str):
    """Return the full content payload for a single chapter."""
    path = _chapter_path(slug)
    if path is None:
        abort(404, description="এই অধ্যায়টি খুঁজে পাওয়া যায়নি।")
    return jsonify(_read_json(path))


@app.route("/api/search")
def api_search():
    """Return a lightweight search index built from all chapters.

    The heavy lifting (fuzzy matching, highlighting) happens client-side; the
    server just exposes a flat list of searchable entries.
    """
    index = []
    if CHAPTERS_DIR.exists():
        for path in sorted(CHAPTERS_DIR.glob("*.json")):
            data = _read_json(path)
            meta = data.get("meta", {})
            slug = meta.get("slug", path.stem)
            for topic in data.get("topics", []):
                index.append(
                    {
                        "chapterSlug": slug,
                        "chapterTitle": meta.get("title"),
                        "chapterNumber": meta.get("number"),
                        "topicId": topic.get("id"),
                        "title": topic.get("title"),
                        "titleEn": topic.get("titleEn", ""),
                        "keywords": topic.get("keywords", []),
                        "snippet": topic.get("summary", ""),
                    }
                )
    return jsonify({"entries": index})


# --------------------------------------------------------------------------- #
# Misc
# --------------------------------------------------------------------------- #
@app.route("/health")
def health():
    return jsonify({"status": "ok"})


@app.errorhandler(404)
def not_found(err):
    # For API calls return JSON, otherwise fall back to the SPA shell so the
    # client-side router can handle unknown routes gracefully.
    from flask import request

    if request.path.startswith("/api/"):
        return jsonify({"error": str(getattr(err, "description", "Not found"))}), 404
    return render_template("index.html"), 200


@app.route("/favicon.ico")
def favicon():
    return send_from_directory(app.static_folder, "img/favicon.svg")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "1") not in ("0", "false", "False")
    # The auto-reloader spawns a child process which is undesirable in some
    # sandboxed/background setups; allow disabling it via USE_RELOADER=0.
    use_reloader = debug and os.environ.get("USE_RELOADER", "1") not in ("0", "false", "False")
    app.run(host="0.0.0.0", port=port, debug=debug, use_reloader=use_reloader)
