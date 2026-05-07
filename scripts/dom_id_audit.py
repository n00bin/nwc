#!/usr/bin/env python3
"""For each HTML page that pairs with a JS file, report dangling DOM IDs."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PAIRS = [
    ("companions.html", "js/companions-page.js"),
    ("mounts.html", "js/mounts-page.js"),
    ("artifacts.html", "js/artifacts-page.js"),
    ("consumables.html", "js/consumables-page.js"),
    ("reports.html", "js/reports-page.js"),
    # mekaniks.html has inline JS, handled separately
]

JS_ID_RE = re.compile(r"""getElementById\(['"]([^'"]+)['"]\)""")
HTML_ID_RE = re.compile(r"""\bid=['"]([^'"]+)['"]""")


def audit(html_name, js_name):
    html_path = ROOT / html_name
    js_path = ROOT / js_name
    if not html_path.exists() or not js_path.exists():
        return None
    html = html_path.read_text(encoding="utf-8")
    js = js_path.read_text(encoding="utf-8", errors="ignore")
    js_ids = set(JS_ID_RE.findall(js))
    html_ids = set(HTML_ID_RE.findall(html))
    dangling = sorted(js_ids - html_ids)
    return js_ids, html_ids, dangling


for html_name, js_name in PAIRS:
    result = audit(html_name, js_name)
    if result is None:
        print(f"  SKIP  {html_name} (file missing)")
        continue
    js_ids, html_ids, dangling = result
    if dangling:
        print(f"  FAIL{html_name:25s} {len(dangling)} dangling: {dangling}")
    else:
        print(f"  OK{html_name:25s} ({len(js_ids)} IDs all resolve)")

# Mekaniks has inline JS — extract and audit specially
mek = (ROOT / "mekaniks.html").read_text(encoding="utf-8")
mek_ids_in_attrs = set(HTML_ID_RE.findall(mek))
mek_ids_in_js = set(JS_ID_RE.findall(mek))
dangling_mek = sorted(mek_ids_in_js - mek_ids_in_attrs)
if dangling_mek:
    print(f"  FAIL{'mekaniks.html':25s} {len(dangling_mek)} dangling: {dangling_mek}")
else:
    print(f"  OK{'mekaniks.html':25s} ({len(mek_ids_in_js)} IDs all resolve)")

# Index, patchnotes, etc. — pages with mostly inline scripts
for hname in ["index.html", "patchnotes.html", "professions.html",
              "campaign-boosters.html", "creators-tools.html",
              "insignia-priority.html", "preview.html"]:
    p = ROOT / hname
    if not p.exists():
        print(f"  SKIP  {hname}")
        continue
    txt = p.read_text(encoding="utf-8")
    ids_attrs = set(HTML_ID_RE.findall(txt))
    ids_js = set(JS_ID_RE.findall(txt))
    dangling = sorted(ids_js - ids_attrs)
    if dangling:
        print(f"  FAIL{hname:25s} {len(dangling)} dangling: {dangling}")
    else:
        print(f"  OK{hname:25s} ({len(ids_js)} IDs all resolve)")
