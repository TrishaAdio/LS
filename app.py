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
import secrets
import sqlite3
import time
from datetime import datetime
from functools import lru_cache
from pathlib import Path

from flask import (
    Flask,
    abort,
    jsonify,
    redirect,
    render_template,
    render_template_string,
    request,
    send_from_directory,
    session,
    url_for,
)

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

# Secret for the /lol admin session cookie. Set SECRET_KEY in production so the
# login survives restarts; otherwise a fresh random key is generated per boot.
app.secret_key = os.environ.get("SECRET_KEY") or secrets.token_hex(16)

# Access key for the /lol analytics page. CONFIGURE THIS at deploy time:
#     export LOL_KEY="your-secret-here"
# (kept out of source on purpose — do not hardcode a real key here).
LOL_KEY = os.environ.get("LOL_KEY", "open-sesame")

# Visit-tracking database (simple SQLite file; ignored by git).
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "analytics.db"


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
                    # Subject grouping (defaults keep old single-subject content working).
                    "subjectId": meta.get("subjectId", "life-science"),
                    "subject": meta.get("subject", "জীবন বিজ্ঞান"),
                    "subjectEn": meta.get("subjectEn", "Life Science"),
                    "subjectIcon": meta.get("subjectIcon", "leaf"),
                    "subjectAccent": meta.get("subjectAccent", "#10b981"),
                }
            )
    chapters.sort(key=lambda c: (c.get("number") is None, c.get("number")))

    # Build the subjects index (home page groups by subject).
    subjects: dict[str, dict] = {}
    order: list[str] = []
    for c in chapters:
        sid = c["subjectId"]
        if sid not in subjects:
            order.append(sid)
            subjects[sid] = {
                "id": sid,
                "name": c["subject"],
                "nameEn": c["subjectEn"],
                "icon": c["subjectIcon"],
                "accent": c["subjectAccent"],
                "chapterCount": 0,
                "topicCount": 0,
            }
        subjects[sid]["chapterCount"] += 1
        subjects[sid]["topicCount"] += c.get("topicCount") or 0

    return {
        "site": {
            "title": "Ani's Study Hub",
            "titleEn": "Ani's Study Hub",
            "board": "WBBSE · মাধ্যমিক",
            "tagline": "এক জায়গায় সব বিষয় — সহজ ভাষায়, গভীর বোঝাপড়া",
        },
        "subjects": [subjects[s] for s in order],
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


# --------------------------------------------------------------------------- #
# Visit tracking  (first-party analytics for THIS site)
# --------------------------------------------------------------------------- #
def _db() -> sqlite3.Connection:
    """Open a fresh SQLite connection (one per request => thread-safe)."""
    DATA_DIR.mkdir(exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """CREATE TABLE IF NOT EXISTS visits (
               sid       TEXT PRIMARY KEY,
               ip        TEXT,
               ua        TEXT,
               path      TEXT,
               started   REAL,
               last_seen REAL,
               hits      INTEGER DEFAULT 1
           )"""
    )
    return conn


def _client_ip() -> str:
    """Best-effort real client IP (this app runs behind a reverse proxy)."""
    xff = request.headers.get("X-Forwarded-For", "")
    if xff:
        return xff.split(",")[0].strip()
    return request.headers.get("X-Real-IP") or request.remote_addr or "unknown"


def _json_body() -> dict:
    """Parse a JSON body, tolerating navigator.sendBeacon blobs."""
    data = request.get_json(silent=True)
    if isinstance(data, dict):
        return data
    try:
        raw = request.get_data() or b"{}"
        parsed = json.loads(raw)
        return parsed if isinstance(parsed, dict) else {}
    except Exception:
        return {}


@app.route("/api/track/start", methods=["POST"])
def track_start():
    """Begin (or resume) a per-tab visit session and return its id."""
    data = _json_body()
    sid = (data.get("sid") or "").strip()
    now = time.time()
    ip = _client_ip()
    ua = (request.headers.get("User-Agent") or "")[:300]
    path = (data.get("path") or "/")[:300]

    conn = _db()
    try:
        existing = None
        if sid:
            existing = conn.execute("SELECT sid FROM visits WHERE sid=?", (sid,)).fetchone()
        if not existing:
            sid = secrets.token_hex(9)
            conn.execute(
                "INSERT INTO visits (sid, ip, ua, path, started, last_seen, hits) "
                "VALUES (?, ?, ?, ?, ?, ?, 1)",
                (sid, ip, ua, path, now, now),
            )
        else:
            conn.execute(
                "UPDATE visits SET last_seen=?, ip=?, path=?, hits=hits+1 WHERE sid=?",
                (now, ip, path, sid),
            )
        conn.commit()
    finally:
        conn.close()
    return jsonify({"sid": sid})


@app.route("/api/track/ping", methods=["POST"])
def track_ping():
    """Heartbeat — keeps the tab's 'open duration' (last_seen - started) fresh."""
    sid = (_json_body().get("sid") or "").strip()
    if sid:
        conn = _db()
        try:
            conn.execute(
                "UPDATE visits SET last_seen=?, hits=hits+1 WHERE sid=?",
                (time.time(), sid),
            )
            conn.commit()
        finally:
            conn.close()
    return ("", 204)


# --------------------------------------------------------------------------- #
# /lol  — key-gated analytics dashboard
# --------------------------------------------------------------------------- #
def _fmt_duration(seconds: float) -> str:
    s = int(max(0, seconds))
    h, rem = divmod(s, 3600)
    m, sec = divmod(rem, 60)
    return f"{h}ঘ {m}মি {sec}সে"


def _visit_rows() -> dict:
    conn = _db()
    try:
        cur = conn.execute(
            "SELECT ip, ua, path, started, last_seen, hits "
            "FROM visits ORDER BY last_seen DESC LIMIT 1000"
        )
        rows, ips, total_secs = [], set(), 0
        for ip, ua, path, started, last_seen, hits in cur.fetchall():
            dur = max(0.0, (last_seen or 0) - (started or 0))
            total_secs += dur
            ips.add(ip)
            rows.append(
                {
                    "ip": ip,
                    "ua": ua or "",
                    "path": path or "/",
                    "started": datetime.fromtimestamp(started).strftime("%d %b, %H:%M:%S"),
                    "last_seen": datetime.fromtimestamp(last_seen).strftime("%d %b, %H:%M:%S"),
                    "dur": _fmt_duration(dur),
                    "secs": int(dur),
                    "hits": hits,
                }
            )
        return {"rows": rows, "sessions": len(rows), "unique_ips": len(ips),
                "total_dur": _fmt_duration(total_secs)}
    finally:
        conn.close()


@app.route("/lol", methods=["GET", "POST"])
def lol_gate():
    error = None
    if request.method == "POST":
        if (request.form.get("key") or "") == LOL_KEY:
            session["lol"] = True
            return redirect(url_for("lol_gate"))
        error = "ভুল কী — আবার চেষ্টা করো।"
    if session.get("lol"):
        return render_template_string(_DASHBOARD_HTML, **_visit_rows())
    return render_template_string(_GATE_HTML, error=error)


@app.route("/lol/logout")
def lol_logout():
    session.pop("lol", None)
    return redirect(url_for("lol_gate"))


_GATE_HTML = """<!doctype html><html lang="bn"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>lol</title>
<style>
 :root{color-scheme:dark}
 *{box-sizing:border-box}
 body{margin:0;min-height:100vh;display:grid;place-items:center;
   font-family:system-ui,'Segoe UI',sans-serif;background:#0b1120;color:#e8edf7}
 .card{width:min(92vw,360px);background:#131b2e;border:1px solid #263149;
   border-radius:18px;padding:30px;box-shadow:0 20px 50px rgba(0,0,0,.5)}
 h1{margin:0 0 4px;font-size:20px}
 p{margin:0 0 20px;color:#7f8caa;font-size:13px}
 input{width:100%;padding:12px 14px;border-radius:12px;border:1px solid #33415f;
   background:#0e1526;color:#e8edf7;font-size:15px;margin-bottom:14px}
 button{width:100%;padding:12px;border:0;border-radius:12px;cursor:pointer;
   background:#3b82f6;color:#fff;font-size:15px;font-weight:700}
 .err{color:#f87171;font-size:13px;margin-bottom:12px}
</style></head><body>
 <form class="card" method="post" autocomplete="off">
   <h1>🔒 lol</h1>
   <p>Enter lol key</p>
   {% if error %}<div class="err">{{ error }}</div>{% endif %}
   <input type="password" name="key" placeholder="lol key" autofocus>
   <button type="submit">Enter</button>
 </form>
</body></html>"""


_DASHBOARD_HTML = """<!doctype html><html lang="bn"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow"><meta http-equiv="refresh" content="20">
<title>lol · visits</title>
<style>
 :root{color-scheme:dark}
 *{box-sizing:border-box}
 body{margin:0;font-family:system-ui,'Segoe UI',sans-serif;background:#0b1120;color:#e8edf7;padding:20px}
 header{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;margin-bottom:18px}
 h1{margin:0;font-size:20px}
 .stats{display:flex;gap:10px;flex-wrap:wrap}
 .stat{background:#131b2e;border:1px solid #263149;border-radius:12px;padding:8px 14px}
 .stat b{font-size:18px;display:block}
 .stat span{font-size:11px;color:#7f8caa}
 a.logout{color:#7f8caa;font-size:13px}
 .wrap{overflow:auto;border:1px solid #263149;border-radius:14px}
 table{border-collapse:collapse;width:100%;font-size:13px;min-width:720px}
 th,td{padding:10px 12px;text-align:left;border-bottom:1px solid #1c2740;white-space:nowrap}
 th{background:#131b2e;color:#9fb0cc;position:sticky;top:0}
 tr:hover td{background:#101a30}
 .ip{font-family:ui-monospace,monospace;color:#60a5fa}
 .dur{font-weight:700}
 .ua{max-width:320px;overflow:hidden;text-overflow:ellipsis;color:#7f8caa}
 .muted{color:#7f8caa}
 footer{margin-top:14px;color:#59657f;font-size:12px}
</style></head><body>
 <header>
   <h1>👀 কারা এসেছিল</h1>
   <div class="stats">
     <div class="stat"><b>{{ sessions }}</b><span>সেশন / ট্যাব</span></div>
     <div class="stat"><b>{{ unique_ips }}</b><span>ইউনিক IP</span></div>
     <div class="stat"><b>{{ total_dur }}</b><span>মোট সময়</span></div>
   </div>
   <a class="logout" href="{{ url_for('lol_logout') }}">লগআউট</a>
 </header>
 <div class="wrap"><table>
   <thead><tr>
     <th>IP</th><th>পেজ</th><th>প্রথম</th><th>শেষ দেখা</th>
     <th>ট্যাব খোলা ছিল (ঘ/মি/সে)</th><th>সেকেন্ড</th><th>hits</th><th>ব্রাউজার</th>
   </tr></thead>
   <tbody>
   {% for r in rows %}
     <tr>
       <td class="ip">{{ r.ip }}</td>
       <td class="muted">{{ r.path }}</td>
       <td class="muted">{{ r.started }}</td>
       <td class="muted">{{ r.last_seen }}</td>
       <td class="dur">{{ r.dur }}</td>
       <td>{{ r.secs }}s</td>
       <td>{{ r.hits }}</td>
       <td class="ua" title="{{ r.ua }}">{{ r.ua }}</td>
     </tr>
   {% else %}
     <tr><td colspan="8" class="muted">এখনও কেউ আসেনি।</td></tr>
   {% endfor %}
   </tbody>
 </table></div>
 <footer>প্রতি ২০ সেকেন্ডে অটো-রিফ্রেশ হয় · সময় = শেষ দেখা − প্রথম লোড</footer>
</body></html>"""


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "1") not in ("0", "false", "False")
    # The auto-reloader spawns a child process which is undesirable in some
    # sandboxed/background setups; allow disabling it via USE_RELOADER=0.
    use_reloader = debug and os.environ.get("USE_RELOADER", "1") not in ("0", "false", "False")
    app.run(host="0.0.0.0", port=port, debug=debug, use_reloader=use_reloader)
