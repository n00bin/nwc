# -*- coding: utf-8 -*-
"""OCR-then-diff gear audit: every gear entry is compared to ITS OWN tooltip
screenshot, never to sibling items. (n00b's ruling 2026-08-31: the screenshot
is the truth.)

Reads each archived tooltip with easyocr, parses the "+N Stat Name" lines and
the Combined Rating, and diffs them against gear.json. Writes one JSONL row
per screenshot so the run is resumable and so only the DISAGREEMENTS need a
human/vision pass.

  python scripts/ocr_gear_audit.py [--limit N] [--only SUBSTR] [--out FILE]
"""
import argparse, difflib, io, json, os, re, sys, time
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEAR = os.path.join(os.path.dirname(ROOT), 'data', 'gear.json')
ARCHIVES = [os.path.join(ROOT, 'docs', 'audit', '_up'),
            os.path.join(ROOT, 'docs', 'calibration', 'inbox', 'gear')]
SKIP_DIRS = {'_trash', '_originals', '_archived_dups', '_skipped', '_no_card',
             '_set_details', '_pending_review'}

STATS = ['Accuracy', 'Action Point Gain', 'Awareness', 'Combat Advantage',
         'Control Bonus', 'Control Resist', 'Critical Avoidance',
         'Critical Severity', 'Critical Strike', 'Defense', 'Deflect',
         'Deflect Severity', 'Forte', 'Incoming Healing', 'Maximum Hit Points',
         'Movement Speed', 'Outgoing Healing', 'Power', 'Recharge Speed',
         'Stamina Regeneration', 'Combined Rating']
# tooltip spellings -> canonical (matches STAT_NAME_ALIASES in toon-forge-stats.js)
ALIAS = {'deflection': 'Deflect', 'deflect chance': 'Deflect',
         'control resistance': 'Control Resist', 'max hp': 'Maximum Hit Points',
         'maximum hit points': 'Maximum Hit Points', 'stamina regen': 'Stamina Regeneration',
         'combined': 'Combined Rating'}
STAT_KEYS = {s.lower(): s for s in STATS}
STAT_KEYS.update(ALIAS)


def norm(s):
    s = (s or '').lower().replace('’', "'").replace('—', '-')
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", s)).strip()


def canon_stat(raw):
    """Fuzzy-map an OCR'd stat name onto the catalog. OCR welds junk onto the
    tail ('DefenseJtrike To PTRATE'), so try progressively shorter prefixes."""
    t = re.sub(r"[^a-z ]+", " ", (raw or '').lower())
    t = re.sub(r"\s+", " ", t).strip()
    if not t:
        return None
    if t in STAT_KEYS:
        return STAT_KEYS[t]
    words = t.split()
    for n in (3, 2, 1):
        if len(words) >= n:
            cand = ' '.join(words[:n])
            if cand in STAT_KEYS:
                return STAT_KEYS[cand]
            m = difflib.get_close_matches(cand, list(STAT_KEYS), n=1, cutoff=0.86)
            if m:
                return STAT_KEYS[m[0]]
    return None


NUMSTAT = re.compile(r"[+†]?\s*([\d][\d,\.]{1,8})\s+([A-Za-z][A-Za-z' ]{2,40})")
ILRE = re.compile(r"item\s*level\s*[:\.]?\s*([\d,]{2,7})", re.I)


# The base-stat block sits between "Item Level:" and the first Equip/Reinforced
# marker. Anything after that is equip-bonus prose or the set panel behind the
# tooltip, and its numbers are NOT base ratings.
BLOCK_END = re.compile(r"(equip\s*[:\.]|reinforced|requires\s*class|minimum\s*level|you can find|set\s+\d)", re.I)


def parse_tooltip(text):
    """-> (stats dict, item_level or None). ONLY the base '+N Stat' block."""
    stats, il = {}, None
    m = ILRE.search(text)
    if m:
        try:
            il = int(m.group(1).replace(',', '').replace('.', ''))
        except ValueError:
            pass
        block = text[m.end():]
    else:
        block = text
    e = BLOCK_END.search(block)
    if e:
        block = block[:e.start()]
    for num, name in NUMSTAT.findall(block):
        st = canon_stat(name)
        if not st:
            continue
        try:
            v = int(num.replace(',', '').replace('.', ''))
        except ValueError:
            continue
        if v <= 0 or v > 200000:
            continue
        stats.setdefault(st, v)          # first read wins; tooltips list once
    return stats, il


def index_screenshots():
    ILNAME = re.compile(r"^(?P<name>.+?)[_ ]IL(?P<il>\d+)", re.I)
    out = []
    for base in ARCHIVES:
        for dp, dn, fns in os.walk(base):
            dn[:] = [d for d in dn if d not in SKIP_DIRS]
            for fn in sorted(fns):
                if not fn.lower().endswith(('.png', '.jpg', '.jpeg')):
                    continue
                stem = os.path.splitext(fn)[0]
                if 'set-details' in stem.lower() or 'no-set-section' in stem.lower():
                    continue
                m = ILNAME.match(stem)
                if not m:
                    continue
                out.append(dict(path=os.path.join(dp, fn),
                                rel=os.path.relpath(os.path.join(dp, fn), ROOT).replace('\\', '/'),
                                name=m.group('name').strip(), il=int(m.group('il'))))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--only', default='')
    ap.add_argument('--out', default=os.path.join(ROOT, 'scripts', '_ocr_audit.jsonl'))
    a = ap.parse_args()

    gear = json.loads(io.open(GEAR, encoding='utf-8').read())
    by_key = {}
    for g in gear:
        by_key.setdefault((norm(g.get('name')), g.get('item_level')), g)

    shots = index_screenshots()
    if a.only:
        shots = [s for s in shots if a.only.lower() in s['rel'].lower()]

    done = set()
    if os.path.exists(a.out):
        for line in io.open(a.out, encoding='utf-8'):
            try:
                done.add(json.loads(line)['rel'])
            except Exception:
                pass
    todo = [s for s in shots if s['rel'] not in done]
    if a.limit:
        todo = todo[:a.limit]
    print("screenshots indexed=%d  already done=%d  this run=%d" % (len(shots), len(done), len(todo)))
    sys.stdout.flush()
    if not todo:
        return

    import easyocr
    reader = easyocr.Reader(['en'], gpu=True, verbose=False)

    fh = io.open(a.out, 'a', encoding='utf-8')
    t0 = time.time()
    counts = defaultdict(int)
    for i, s in enumerate(todo, 1):
        rec = dict(rel=s['rel'], name=s['name'], il=s['il'])
        try:
            # cv2.imread cannot open paths with non-ASCII characters on Windows
            # (em dashes in item names), so decode via PIL and hand over an array.
            import numpy as np
            from PIL import Image
            img = np.array(Image.open(s['path']).convert('RGB'))
            text = ' | '.join(reader.readtext(img, detail=0, paragraph=False))
        except Exception as e:
            rec['verdict'] = 'OCR_ERROR'; rec['err'] = str(e)[:150]
            counts['OCR_ERROR'] += 1
            fh.write(json.dumps(rec) + '\n'); continue

        ocr_stats, ocr_il = parse_tooltip(text)
        rec['ocr'] = ocr_stats
        rec['ocr_il'] = ocr_il
        g = by_key.get((norm(s['name']), s['il']))
        if not g:
            rec['verdict'] = 'NO_JSON_ENTRY'
            counts['NO_JSON_ENTRY'] += 1
            fh.write(json.dumps(rec) + '\n'); continue

        rec['id'] = g.get('id'); rec['slot'] = g.get('slot')
        js = dict(g.get('ratingStats') or {})
        cr = g.get('combinedRating')
        if cr:
            js['Combined Rating'] = cr
        rec['json'] = js

        # OCR that could not even find the item level is not trustworthy
        if ocr_il is None or not ocr_stats:
            rec['verdict'] = 'OCR_UNREADABLE'
            counts['OCR_UNREADABLE'] += 1
            fh.write(json.dumps(rec) + '\n'); continue
        if ocr_il != s['il']:
            rec['verdict'] = 'IL_MISMATCH'
            counts['IL_MISMATCH'] += 1
            fh.write(json.dumps(rec) + '\n'); continue

        diffs = []
        for st, v in sorted(ocr_stats.items()):
            if st not in js:
                diffs.append(dict(stat=st, shot=v, json=None, kind='missing_in_json'))
            elif js[st] != v:
                diffs.append(dict(stat=st, shot=v, json=js[st], kind='value_differs'))
        for st, v in sorted(js.items()):
            if st not in ocr_stats:
                diffs.append(dict(stat=st, shot=None, json=v, kind='not_seen_in_shot'))
        rec['diffs'] = diffs
        hard = [d for d in diffs if d['kind'] in ('value_differs', 'missing_in_json')]
        rec['verdict'] = 'MATCH' if not diffs else ('SUSPECT' if hard else 'PARTIAL_READ')
        counts[rec['verdict']] += 1
        fh.write(json.dumps(rec) + '\n')

        if i % 100 == 0:
            el = time.time() - t0
            print("  %d/%d  %.1f img/s  eta %.0f min   %s"
                  % (i, len(todo), i / el, (len(todo) - i) / (i / el) / 60, dict(counts)))
            sys.stdout.flush()
            fh.flush()
    fh.close()
    print("DONE %d in %.0f min" % (len(todo), (time.time() - t0) / 60))
    print(dict(counts))


if __name__ == '__main__':
    main()
