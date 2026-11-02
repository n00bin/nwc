#!/usr/bin/env python3
"""
update_patch_notes.py - refresh data/patch-notes.json from Arc's news feed and fill in each
note's TOPICS (gaps J-7/J-8, 2026-11-02).

Run daily by .github/workflows/update-patch-notes.yml (and by hand for the one-time backfill):
    python3 scripts/update_patch_notes.py [--max-topics N]

What it does:
  1. Fetches the patch-note list (titles, tags) from the Arc API, as the workflow always did.
  2. Merges it with the existing file so fields we add (topics) are never lost.
  3. For notes with no `topics` yet, fetches that one note's text from Arc's per-article
     endpoint (the same one playneverwinter.com uses) and keeps ONLY the topic names: the
     section headings and bolded subjects ("Bards", "Red Harvest itemization", ...).
     Arc's paragraphs are never stored. A note with no headings gets topics = [].
  4. Writes data/patch-notes.json and data/patch-notes-var.js only if something changed.

The "What it means for you" rewrites live in data/patch-digests.js (hand-written, our own words).
scripts/patch-rewrites-due.js lists console notes that still need one.
"""
import html
import json
import re
import sys
import time
import urllib.request

LIST_URL = "https://api.arcgames.com/v1.0/games/nw/news?tag=nw-patch-notes&limit=50&offset={offset}"
ONE_URL = "https://api.arcgames.com/v1.0/games/news/{id}?field[]=content"
JSON_PATH = "data/patch-notes.json"
VAR_PATH = "data/patch-notes-var.js"
UA = {"User-Agent": "NeverwinterCompendium/1.0 (+https://n00bin.github.io/nwc/)"}

# Bold words that are labels inside a section, not topics.
NOISE = {
    "common", "uncommon", "rare", "epic", "legendary", "mythic", "celestial", "note", "notes",
    "new", "fixed", "fixes", "bug fixes", "known issues", "general", "other", "update", "updates",
    "pc", "console", "xbox", "playstation", "ps4", "ps5", "and", "or",
}
MAX_TOPICS = 14


def get_json(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def fetch_list():
    notes, offset = [], 0
    while True:
        data = get_json(LIST_URL.format(offset=offset))
        batch = data.get("news", [])
        notes.extend(batch)
        if not data.get("more_news") or not batch:
            return notes
        offset += 50


def clean(fragment):
    t = html.unescape(re.sub(r"<[^>]+>", "", fragment))
    t = t.replace("\u200b", "").replace("\xa0", " ").replace("\ufffd", "")
    t = re.sub(r"\s+", " ", t).strip().strip(":").strip()
    return t


def extract_topics(content):
    found = []
    for m in re.finditer(r"<(h[1-4]|strong|b)\b[^>]*>(.*?)</\1>", content or "", re.S | re.I):
        t = clean(m.group(2))
        if not t or len(t) < 3 or len(t) > 60:
            continue
        # Topics are named things ("Bards", "Juma Store"); a lowercase start is a phrase bolded
        # mid-sentence ("lag spikes"), not a topic.
        if not re.match(r"[A-Z0-9]", t):
            continue
        if t.lower() in NOISE or re.fullmatch(r"[\d\s.,:%x/+-]+", t):
            continue
        if any(t.lower() == f.lower() for f in found):
            continue
        found.append(t)
        if len(found) >= MAX_TOPICS:
            break
    return found


def main():
    max_topics = 1000
    if "--max-topics" in sys.argv:
        max_topics = int(sys.argv[sys.argv.index("--max-topics") + 1])

    try:
        with open(JSON_PATH, encoding="utf-8") as f:
            existing = json.load(f)
    except FileNotFoundError:
        existing = []
    by_id = {n["id"]: n for n in existing}

    fresh = fetch_list()
    print(f"Total from API: {len(fresh)}, new: {sum(1 for n in fresh if n['id'] not in by_id)}")

    merged = []
    for n in fresh:
        old = by_id.get(n["id"], {})
        if "topics" in old:
            n["topics"] = old["topics"]
        merged.append(n)
    # Keep any note Arc no longer lists rather than dropping it.
    fresh_ids = {n["id"] for n in fresh}
    merged.extend(n for n in existing if n["id"] not in fresh_ids)

    filled = 0
    for n in merged:
        if "topics" in n or filled >= max_topics:
            continue
        try:
            one = get_json(ONE_URL.format(id=n["id"]))
            n["topics"] = extract_topics(one.get("content", ""))
            filled += 1
        except Exception as exc:  # leave it for the next run
            print(f"  topics for {n['id']} failed: {exc}")
        time.sleep(0.8)
    print(f"Topics filled this run: {filled}; still missing: {sum(1 for n in merged if 'topics' not in n)}")

    if merged == existing:
        print("No changes.")
        return
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(merged, f, indent=2, ensure_ascii=False)
    with open(VAR_PATH, "w", encoding="utf-8") as f:
        f.write("const PATCH_NOTES_DATA = ")
        json.dump(merged, f, indent=2, ensure_ascii=False)
        f.write(";")
    print("Wrote", JSON_PATH, "and", VAR_PATH)


if __name__ == "__main__":
    main()
