"""Own-icons tool (ICON-1, 2026-11-13).

Finds each site icon inside n00b's own archived game screenshots, crops it from
the SCREENSHOT (never from the current icon file), and stages a 64 px copy for
review. The current icon is only used as a search key to locate where the icon
sits in the screenshot; every saved pixel comes from n00b's capture.

Only `apply --go` touches the site (images/). Everything else goes to
docs/calibration/inbox/_own_icons/ (local, gitignored with the rest of inbox).

Usage (from the website folder):
  python scripts/icons/own_icons.py scan      # find + crop, writes manifest.json
  python scripts/icons/own_icons.py report    # coverage.md + review.html
  python scripts/icons/own_icons.py apply --cats a,b [--go]   # swap approved icons on the site

Quality rules (n00b approved the look 2026-11-13):
  - full-size captures beat OBS-preview shots (OBS shrinks the game to 60%)
  - tooltips / inspect windows beat Auction House rows (rows are dimmed)
  - nothing selected (a selected icon carries a glow)
"""
import base64
import html
import json
import os
import sys
import time
from concurrent.futures import ProcessPoolExecutor, as_completed

import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
INBOX = os.path.join(ROOT, "docs", "calibration", "inbox")
OUT = os.path.join(INBOX, "_own_icons")
MANIFEST = os.path.join(OUT, "manifest.json")
CACHE = os.path.join(OUT, "scan_cache.jsonl")      # one line per screenshot searched
PROGRESS = os.path.join(OUT, "scan_progress.log")  # tail this to watch a run

# Site icon categories this pass replaces (images/<category>/).
# insignias + collars are NOT here: they get drawn original badges instead.
CATEGORIES = ["mount-powers", "mounts", "enchants", "artifacts", "lockboxes",
              "companions", "enhancements"]

# Which categories to look for in which archive folder. "*" = all of them.
SOURCES = {
    "mounts": ["mount-powers", "mounts"],
    "enchants": ["enchants"],
    "artifacts": ["artifacts"],
    "companions": ["companions", "enhancements"],
    "companion-gear": ["companions", "enhancements"],
    # consumables / boons / overloads / belt-items were searched for every
    # category on 2026-11-14: 53 shots, ~22 min, 2 hits (one a false match).
    # Not worth it; lockbox icons go on the shopping list instead.
    # _originals also holds gear/weapon shots (no site icons): only these two.
    "consumables": ["lockboxes"],   # lockbox icons only (cheap: ~20 shots)
    "_originals/mounts_celestial": ["mount-powers", "mounts"],
    "_originals/boons_gear_artifacts": ["artifacts", "enhancements"],
}
IMG_EXT = (".png", ".jpg", ".jpeg", ".webp")
SKIP_PARTS = ("frames", "readings", "tests", "_trash")

COARSE = 0.5                       # screenshots searched at half size first
# Icon art 32..100 px at full size. Reward-claims / collection grids show
# icons at ~80 px, so the first range (up to 60 px) missed them (2026-11-14).
# Step 2 above 30: the full-size refine (+-3 px) covers the gap.
COARSE_SIZES = list(range(16, 31)) + list(range(32, 51, 2))
TOP_SPOTS = 6                      # coarse candidate spots per icon checked in colour
SEARCH_VERSION = "v2-sizes100-top6"  # bump when the search changes; cache lines carry it
GRAY_MIN = 0.86                    # coarse grayscale match needed to keep a hit
COLOR_MIN = 0.85                   # full-size colour match needed to keep a hit
OUT_SIZE = 64


def load_templates(cats):
    t = {}
    for c in cats:
        d = os.path.join(ROOT, "images", c)
        if not os.path.isdir(d):
            continue
        for f in sorted(os.listdir(d)):
            if not f.lower().endswith(IMG_EXT):
                continue
            im = cv2.imread(os.path.join(d, f), cv2.IMREAD_COLOR)
            if im is None or min(im.shape[:2]) < 24:
                continue
            t[(c, f)] = im
    return t


def screenshots():
    out = []
    for folder, cats in SOURCES.items():
        base = os.path.join(INBOX, folder)
        if not os.path.isdir(base):
            continue
        cats = CATEGORIES if cats == "*" else cats
        for dp, dns, fns in os.walk(base):
            if any(p in dp.replace("\\", "/").split("/") for p in SKIP_PARTS):
                continue
            for f in fns:
                if f.lower().endswith(IMG_EXT):
                    out.append((os.path.join(dp, f), tuple(cats)))
    return sorted(out)


_T = None


def _init(only=None):
    # One OpenCV thread per worker: 22 workers x a full thread pool each
    # oversubscribed the CPU and made the first full run crawl (2026-11-14).
    cv2.setNumThreads(1)
    global _T
    _T = {}
    for k, tpl in load_templates(CATEGORIES).items():
        # only = {category: [file, ...]}: search just these icons (e.g. the NW Hub files).
        if only is not None and k[1] not in only.get(k[0], ()):
            continue
        tg = cv2.cvtColor(tpl, cv2.COLOR_BGR2GRAY)
        _T[k] = (tpl, {s: cv2.resize(tg, (s, s), interpolation=cv2.INTER_AREA) for s in COARSE_SIZES})


def _scan_one(job):
    path, cats = job
    img = cv2.imread(path, cv2.IMREAD_COLOR)
    if img is None:
        return []
    H, W = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    small = cv2.resize(gray, None, fx=COARSE, fy=COARSE, interpolation=cv2.INTER_AREA)
    hits = []
    for (cat, name), (tpl, coarse) in _T.items():
        if cat not in cats:
            continue
        # Coarse pass keeps the top few SPOTS, not just the single best one: in a
        # grid of same-frame icons (gems) every slot looks alike in grey, and the
        # right slot can lose to a neighbour. Colour decides between them below.
        cands = []
        for s in COARSE_SIZES:
            if s >= min(small.shape):
                continue
            r = cv2.matchTemplate(small, coarse[s], cv2.TM_CCOEFF_NORMED)
            ys, xs = np.where(r >= GRAY_MIN)
            if len(xs) > 200:  # flat area matching everything: keep the 200 best
                idx = np.argsort(r[ys, xs])[-200:]
                ys, xs = ys[idx], xs[idx]
            cands.extend((float(r[y, x]), x, y, s) for y, x in zip(ys, xs))
        if not cands:
            continue
        cands.sort(reverse=True)
        spots = []
        for v, cx, cy, cs in cands:
            if any(abs(cx - sx) < cs * 0.5 and abs(cy - sy) < cs * 0.5 for _, sx, sy, _ in spots):
                continue
            spots.append((v, cx, cy, cs))
            if len(spots) >= TOP_SPOTS:
                break
        for gv, cx, cy, cs in spots:
            # Refine at full size, in colour, around the coarse spot.
            fx, fy, fs = int(cx / COARSE), int(cy / COARSE), int(cs / COARSE)
            ref = (-1.0, None)
            for s in range(max(24, fs - 4), fs + 5):
                x0, y0 = max(0, fx - 6), max(0, fy - 6)
                x1, y1 = min(W, fx + fs + 12), min(H, fy + fs + 12)
                win = img[y0:y1, x0:x1]
                if win.shape[0] < s or win.shape[1] < s:
                    continue
                r = cv2.matchTemplate(win, cv2.resize(tpl, (s, s), interpolation=cv2.INTER_AREA),
                                      cv2.TM_CCOEFF_NORMED)
                _, mv, _, ml = cv2.minMaxLoc(r)
                if mv > ref[0]:
                    ref = (mv, (x0 + ml[0], y0 + ml[1], s))
            if ref[0] < COLOR_MIN:
                continue
            x, y, s = ref[1]
            crop = img[y:y + s, x:x + s]
            tsm = cv2.resize(tpl, (s, s), interpolation=cv2.INTER_AREA)
            bright = float(crop.mean()) / max(1.0, float(tsm.mean()))
            hits.append({"category": cat, "icon": name, "src": os.path.relpath(path, INBOX).replace("\\", "/"),
                         "box": [int(x), int(y), int(s)], "gray": round(gv, 4),
                         "color": round(ref[0], 4), "bright": round(bright, 3)})
    # One icon per spot: overlapping hits keep only the best colour match.
    hits.sort(key=lambda h: -h["color"])
    kept = []
    for h in hits:
        x, y, s = h["box"]
        if any(abs(x - k["box"][0]) < s * 0.5 and abs(y - k["box"][1]) < s * 0.5 for k in kept):
            continue
        kept.append(h)
    return [dict(h, path=path) for h in kept] or [{"path": path, "none": True}]


def rank(h):
    # Prefer: not dimmed, larger native size, better match.
    dim_pen = 0 if 0.8 <= h["bright"] <= 1.25 else 1
    return (dim_pen, -h["box"][2], -h["color"])


def _arg(name):
    a = sys.argv
    return a[a.index(name) + 1] if name in a and a.index(name) + 1 < len(a) else None


def cmd_scan():
    """scan [--cats a,b] [--hub]
    --cats  search only these categories (others keep their earlier results)
    --hub   search only the icons that came from NW Hub (nwhub_files.json)"""
    jobs = screenshots()
    allowed = {(p, c) for p, cats in jobs for c in cats}  # folder->category map as it stands now
    want = _arg("--cats")
    if want:
        want = set(want.split(","))
        jobs = [(p, tuple(c for c in cats if c in want)) for p, cats in jobs]
        jobs = [j for j in jobs if j[1]]
    only = None
    if "--hub" in sys.argv:
        only = json.load(open(os.path.join(OUT, "nwhub_files.json"), encoding="utf-8"))
    ver = SEARCH_VERSION + ("-hub" if only is not None else "")
    print(f"{len(jobs)} screenshots to search", flush=True)
    t0 = time.time()
    os.makedirs(OUT, exist_ok=True)
    # Resume: screenshots already searched (same file, same size+mtime) are not searched again.
    # Per (screenshot, category) the NEWEST cache line wins, so a re-search with a
    # better method replaces the old hits (incl. old false matches) for those categories.
    done, per = set(), {}
    if os.path.exists(CACHE):
        for line in open(CACHE, encoding="utf-8"):
            r = json.loads(line)
            cats = r.get("cats") or sorted({h["category"] for h in r["hits"]})
            done.add((r["path"], r["stamp"], r.get("ver", "v1"), tuple(r.get("cats") or ())))
            for c in cats:
                per[(r["path"], c)] = [h for h in r["hits"] if h["category"] == c]
    # Drop old hits from folders/categories no longer searched (e.g. belt-items).
    per = {k: v for k, v in per.items() if k in allowed}
    stamp = lambda p: f"{os.path.getsize(p)}-{int(os.path.getmtime(p))}"
    todo = [j for j in jobs if (j[0], stamp(j[0]), ver, tuple(j[1])) not in done]
    # Heaviest jobs (all categories) first, so the tail of the run is short ones.
    todo.sort(key=lambda j: -len(j[1]))
    log = open(PROGRESS, "a", encoding="utf-8")
    log.write(f"--- {time.strftime('%Y-%m-%d %H:%M:%S')} {len(todo)} to search, {len(jobs)-len(todo)} already done\n")
    log.flush()
    with ProcessPoolExecutor(max_workers=max(1, (os.cpu_count() or 2) - 2), initializer=_init, initargs=(only,)) as ex, \
            open(CACHE, "a", encoding="utf-8") as cache:
        futs = {ex.submit(_scan_one, j): j for j in todo}
        for i, f in enumerate(as_completed(futs), 1):
            path = futs[f][0]
            hs = [h for h in f.result() if not h.get("none")]
            for h in hs:
                h.pop("path", None)
            cats = list(futs[f][1])
            cache.write(json.dumps({"path": path, "stamp": stamp(path), "ver": ver, "cats": cats,
                                    "hits": hs}) + "\n")
            cache.flush()
            for c in cats:
                per[(path, c)] = [h for h in hs if h["category"] == c]
            log.write(f"{i}/{len(todo)}  {int(time.time()-t0)}s  {sum(map(len, per.values()))} hits  {os.path.basename(path)}\n")
            log.flush()
    log.write(f"--- searching done in {int(time.time()-t0)}s\n")
    log.close()
    best = {}
    for h in (h for hs in per.values() for h in hs):
        k = (h["category"], h["icon"])
        if k not in best or rank(h) < rank(best[k]):
            best[k] = h
    os.makedirs(OUT, exist_ok=True)
    for (cat, name), h in best.items():
        img = cv2.imread(os.path.join(INBOX, h["src"]), cv2.IMREAD_COLOR)
        x, y, s = h["box"]
        crop = cv2.resize(img[y:y + s, x:x + s], (OUT_SIZE, OUT_SIZE), interpolation=cv2.INTER_LANCZOS4)
        d = os.path.join(OUT, cat)
        os.makedirs(d, exist_ok=True)
        fn = os.path.splitext(name)[0] + ".png"
        cv2.imwrite(os.path.join(d, fn), crop)
        h["out"] = f"{cat}/{fn}"
    total = {c: len([f for f in os.listdir(os.path.join(ROOT, "images", c)) if f.lower().endswith(IMG_EXT)])
             for c in CATEGORIES if os.path.isdir(os.path.join(ROOT, "images", c))}
    json.dump({"generated": time.strftime("%Y-%m-%d %H:%M"), "screenshots": len(jobs),
               "totals": total, "icons": sorted(best.values(), key=lambda h: (h["category"], h["icon"]))},
              open(MANIFEST, "w", encoding="utf-8"), indent=1)
    print(f"done in {int(time.time()-t0)}s: {len(best)} icons staged -> {OUT}")


def _b64(p):
    return "data:image/png;base64," + base64.b64encode(open(p, "rb").read()).decode()


def _site_b64(cat, name):
    im = cv2.imread(os.path.join(ROOT, "images", cat, name), cv2.IMREAD_COLOR)
    im = cv2.resize(im, (OUT_SIZE, OUT_SIZE), interpolation=cv2.INTER_AREA)
    ok, buf = cv2.imencode(".png", im)
    return "data:image/png;base64," + base64.b64encode(buf.tobytes()).decode()


def _load_list(name):
    p = os.path.join(OUT, name)
    return json.load(open(p, encoding="utf-8")) if os.path.exists(p) else {}


# Where in game to capture each category (shopping list). Rules for every shot:
# full-size capture (PS5 Share / PC screenshot, not the OBS preview), nothing
# selected or hovered (the selected tile glows), not an Auction House row (dimmed).
WHERE = {
    "mount-powers": "Character sheet > Mounts tab, or Collections > Mounts > inspect the mount that carries the power. "
                    "Keep the cursor off the power icon (hover adds a glow).",
    "enchants": "The Reward Claims Agent enchantment list (the screen in your Celestial Fluid Aurora shot). One screenshot "
                "per page of the list gives 8 to 10 icons at full quality. Park the cursor on a tile you already have, so "
                "the glow lands on that one.",
    "artifacts": "Collections > Artifacts grid, page by page, or a character sheet with the artifact slotted (13 of the "
                 "ones found came from a character sheet).",
    "mounts": "Collections > Mounts grid, page by page. Names ending in -account are the account-wide copy of a mount "
              "and share its picture.",
    "lockboxes": "Lockboxes are not in Collections. The Zen Market lockbox page or your inventory shows them; many are "
                 "retired and may not be reachable. What can't be captured needs a decision later.",
    "companions": "Collections > Companions grid.",
    "enhancements": "Inspect a companion that has this enhancement; it shows in the enhancement slot.",
}
ORDER = ["mount-powers", "enchants", "artifacts", "mounts", "lockboxes", "companions", "enhancements"]
LABEL = {"mount-powers": "Mount powers", "enchants": "Enchantments", "artifacts": "Artifacts", "mounts": "Mounts",
         "lockboxes": "Lockboxes", "companions": "Companions", "enhancements": "Companion enhancements"}


def _pretty(fn):
    return os.path.splitext(fn)[0].replace("_", " ").replace("-", " ")


def cmd_report():
    """Coverage of the NW Hub icons (nwhub_files.json) + review page + shopping list.
    reject.json = {category: [file, ...]} icons checked by eye and found WRONG."""
    m = json.load(open(MANIFEST, encoding="utf-8"))
    hub = _load_list("nwhub_files.json")
    reject = _load_list("reject.json")
    by = {}
    for h in m["icons"]:
        by.setdefault(h["category"], {})[h["icon"]] = h
    rows, ready, redo, missing = [], {}, {}, {}
    for c in ORDER:
        names = sorted(hub.get(c, []))
        if not names:
            continue
        got = {n: by[c][n] for n in names if n in by.get(c, {}) and n not in reject.get(c, [])}
        redo[c] = [n for n, h in got.items() if not (0.8 <= h["bright"] <= 1.25)]
        ready[c] = [n for n in got if n not in redo[c]]
        missing[c] = [n for n in names if n not in got]
        rows.append((c, len(names), len(ready[c]), len(redo[c]), len(missing[c])))
    tot = [sum(r[i] for r in rows) for i in range(1, 5)]
    lines = [f"# Own icons: NW Hub coverage ({m['generated']})", "",
             f"Searched {m['screenshots']} archived screenshots.", "",
             "| Category | NW Hub icons | Ready (from our screenshots) | Found but too dark | Missing |",
             "|---|---|---|---|---|"]
    lines += [f"| {c} | {a} | {b} | {d} | {e} |" for c, a, b, d, e in rows]
    lines += [f"| **total** | {tot[0]} | {tot[1]} | {tot[2]} | {tot[3]} |", "",
              "Shopping list: shopping_list.md next to this file."]
    open(os.path.join(OUT, "coverage.md"), "w", encoding="utf-8").write("\n".join(lines) + "\n")
    shop = ["# Own icons: shopping list", "",
            "Every shot: full-size capture (PS5 Share or PC screenshot, not the OBS preview), nothing selected "
            "or hovered, not an Auction House row.", ""]
    for c in ORDER:
        need = redo.get(c, []) + missing.get(c, [])
        if need:
            shop += [f"## {LABEL[c]} ({len(need)})", "", WHERE[c], ""]
            shop += [f"- {_pretty(n)}" + ("  (have it, too dark: retake)" if n in redo[c] else "") for n in need]
            shop.append("")
    open(os.path.join(OUT, "shopping_list.md"), "w", encoding="utf-8").write("\n".join(shop))
    print("\n".join(lines))

    # ---- review page ----
    E = html.escape
    summary = "".join(
        f'<tr><th scope="row">{E(LABEL[c])}</th><td>{a}</td><td class="ok">{b}</td><td class="warn">{d or ""}</td>'
        f'<td>{e or ""}</td></tr>' for c, a, b, d, e in rows)
    summary += (f'<tr class="tot"><th scope="row">Total</th><td>{tot[0]}</td><td class="ok">{tot[1]}</td>'
                f'<td class="warn">{tot[2]}</td><td>{tot[3]}</td></tr>')
    sections = []
    for c in ORDER:
        got = [n for n in ready.get(c, []) + redo.get(c, [])]
        if not got:
            continue
        tiles = []
        for n in sorted(got):
            h = by[c][n]
            dim = n in redo[c]
            tiles.append(
                f'<figure class="t{" dim" if dim else ""}"><div class="p"><img src="{_b64(os.path.join(OUT, h["out"]))}" '
                f'alt="Ours: {E(_pretty(n))}"><img src="{_site_b64(c, n)}" alt="On the site now: {E(_pretty(n))}"></div>'
                f'<figcaption><span class="n">{E(_pretty(n))}</span><span class="m">{h["box"][2]} px in your shot'
                f'{" · too dark, retake" if dim else ""}</span></figcaption></figure>')
        sections.append(f'<section class="cat"><h3>{E(LABEL[c])} <span>{len(got)}</span></h3>'
                        f'<div class="g">{"".join(tiles)}</div></section>')
    shopping = []
    for c in ORDER:
        need = redo.get(c, []) + missing.get(c, [])
        if not need:
            continue
        redo_cls = ' class="redo"'
        chips = "".join(f'<li{redo_cls if n in redo[c] else ""}>{E(_pretty(n))}</li>' for n in need)
        shopping.append(f'<section class="shop"><h3>{E(LABEL[c])} <span>{len(need)}</span></h3>'
                        f'<p class="where">{E(WHERE[c])}</p><ul class="chips">{chips}</ul></section>')
    rej = sum(len(v) for v in reject.values())
    page = REVIEW_HEAD + f"""<div class="wrap">
<header><p class="eyebrow">ICON-1 · steps 2 to 4 · nothing on the live site has changed</p>
<h1>Own Icons Review</h1>
<p class="lede">Every icon the site took from NW Hub, and how many we can replace with a crop from your own screenshots.
Left of each pair is the crop from your screenshot, right is the icon on the site now. Insignias and collars are not
here: they get original drawn badges instead.</p></header>
<section><h2>Coverage</h2><div class="tw"><table><thead><tr><th scope="col">Category</th><th scope="col">From NW Hub</th>
<th scope="col">Ready</th><th scope="col">Too dark</th><th scope="col">Missing</th></tr></thead><tbody>{summary}</tbody></table></div>
<p class="note">Searched {m['screenshots']} of your archived screenshots. Every ready pair below was checked by eye.
{rej} wrong match{"es" if rej != 1 else ""} found that way {"were" if rej != 1 else "was"} removed.</p></section>
<section><h2>Check these</h2><p class="note">Amber outline: right icon, but it came from a dimmed spot. It is on the
shopping list for a retake.</p>{"".join(sections)}</section>
<section><h2>Shopping list</h2><p class="note">For every shot: a full-size capture (PS5 Share or PC screenshot, not
the OBS preview), nothing selected or hovered, and not an Auction House row. Amber names: we have the icon, but too
dark.</p>{"".join(shopping)}</section>
</div>"""
    open(os.path.join(OUT, "review.html"), "w", encoding="utf-8").write(page)
    print("review page:", os.path.join(OUT, "review.html"))


REVIEW_HEAD = """<title>Own Icons Review</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
/* Layout: one reading column; coverage table first, then category grids of pairs (ours | site), then the shopping list.
   Single dark look on purpose: it matches the Compendium's own theme. */
:root{--bg:#0d1117;--surface:#161b22;--elev:#1c2129;--border:#30363d;--fg:#e6edf3;--fg2:#9aa4b0;--ok:#3fb950;
--warn:#d29922;--accent:#58a6ff;
--font:'Inter','Segoe UI',system-ui,-apple-system,sans-serif;--display:'Space Grotesk','Segoe UI',system-ui,sans-serif;
color-scheme:dark}
body{background:var(--bg);color:var(--fg);font-family:var(--font);line-height:1.5;
padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:24px 48px}
.wrap{max-width:1100px;margin:0 auto;display:flex;flex-direction:column;gap:32px}
.wrap>section{display:flex;flex-direction:column;gap:12px;min-width:0}
header{display:flex;flex-direction:column;gap:8px}
.eyebrow{margin:0;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--fg2)}
h1{font-family:var(--display);font-size:2rem;margin:0;text-wrap:balance}
h2{font-family:var(--display);font-size:1.3rem;margin:0}
h3{font-size:1rem;margin:0 0 8px}h3 span{color:var(--fg2);font-weight:400;font-variant-numeric:tabular-nums}
.lede{margin:0;color:var(--fg2);max-width:68ch}.note{margin:0;color:var(--fg2);font-size:.88rem;max-width:72ch}
.tw{overflow-x:auto}
table{border-collapse:collapse;font-variant-numeric:tabular-nums;min-width:460px}
th,td{padding:7px 14px;text-align:right;border-bottom:1px solid var(--border)}
th[scope=row],thead th:first-child{text-align:left}thead th{font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;color:var(--fg2);font-weight:600}
td.ok{color:var(--ok);font-weight:600}td.warn{color:var(--warn)}tr.tot th,tr.tot td{border-bottom:0;border-top:2px solid var(--border);font-weight:700}
.cat{display:flex;flex-direction:column}
.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
.t{margin:0;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:8px;min-width:0;display:flex;flex-direction:column;gap:6px}
.t.dim{border-color:var(--warn)}
.p{display:flex;gap:4px}.p img{width:50%;max-width:64px;aspect-ratio:1;border-radius:4px;background:var(--elev)}
figcaption{display:flex;flex-direction:column;gap:2px}
.n{font-size:.8rem;overflow-wrap:anywhere;text-transform:capitalize}.m{font-size:.7rem;color:var(--fg2)}
.dim .m{color:var(--warn)}
.shop{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px 16px;min-width:0}
.where{margin:0 0 10px;color:var(--fg2);font-size:.88rem;max-width:80ch}
.chips{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px}
.chips li{background:var(--elev);border:1px solid var(--border);border-radius:999px;padding:2px 10px;font-size:.78rem;text-transform:capitalize}
.chips li.redo{border-color:var(--warn);color:var(--warn)}
@media (max-width:480px){h1{font-size:1.6rem}.g{grid-template-columns:repeat(auto-fill,minmax(130px,1fr))}}
</style>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Space+Grotesk:wght@600;700&display=swap">
"""


SOURCES_FILE = os.path.join(ROOT, "docs", "icon_sources.json")  # committed: which site icons are ours


def cmd_apply():
    """apply --cats a,b [--go]
    Writes the READY crops (NW Hub icon, found, not rejected, not too dark) over
    images/<category>/<same file name>, so no page code changes. Dry run unless --go.
    Records every swapped file in docs/icon_sources.json (own capture + which screenshot),
    which is how we know when a credit line can be dropped."""
    from PIL import Image
    want = _arg("--cats")
    if not want:
        print("apply needs --cats a,b (step 5 goes one approved category at a time)")
        return
    want = want.split(",")
    go = "--go" in sys.argv
    m = json.load(open(MANIFEST, encoding="utf-8"))
    hub = _load_list("nwhub_files.json")
    reject = _load_list("reject.json")
    by = {(h["category"], h["icon"]): h for h in m["icons"]}
    src = json.load(open(SOURCES_FILE, encoding="utf-8")) if os.path.exists(SOURCES_FILE) else {
        "about": "Site icons replaced by crops from n00b's own in-game screenshots (scripts/icons/own_icons.py). "
                 "Every file listed here is our own capture. Icons not listed still come from NW Hub or the "
                 "Neverwinter Wiki and stay credited in the footer.",
        "own_capture": {}}
    today = time.strftime("%Y-%m-%d")
    n = 0
    for c in want:
        for name in sorted(hub.get(c, [])):
            h = by.get((c, name))
            if not h or name in reject.get(c, []) or not (0.8 <= h["bright"] <= 1.25):
                continue
            dst = os.path.join(ROOT, "images", c, name)
            n += 1
            if go:
                im = Image.open(os.path.join(OUT, h["out"])).convert("RGB")
                im.save(dst, "WEBP", quality=92, method=6)
                src["own_capture"].setdefault(c, {})[name] = {
                    "screenshot": h["src"].replace("\\", "/"), "size_in_shot": h["box"][2], "applied": today}
        print(f"{c}: {sum(1 for x in hub.get(c, []) if x in src['own_capture'].get(c, {}))} swapped"
              if go else f"{c}: would swap")
    if go:
        json.dump(src, open(SOURCES_FILE, "w", encoding="utf-8"), indent=1, sort_keys=True)
    print(f"{n} icons {'written' if go else 'ready (dry run, add --go)'}")


if __name__ == "__main__":
    {"scan": cmd_scan, "report": cmd_report, "apply": cmd_apply}.get(
        sys.argv[1] if len(sys.argv) > 1 else "", lambda: print(__doc__))()
