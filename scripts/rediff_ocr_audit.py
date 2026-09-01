# -*- coding: utf-8 -*-
"""Re-diff the OCR audit WITHOUT re-reading any image.

Fixes a matching flaw in the first pass: 47 name+IL pairs have more than one
gear entry (the Shirt/Pants collection variants that share a name), and the
first pass kept only one of them, so a Pants screenshot was diffed against the
Shirt row. Now a screenshot is compared against EVERY variant sharing its
name+IL and only flagged if it disagrees with all of them.
"""
import json, io, os, re, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
gear = json.loads(io.open(os.path.join(os.path.dirname(ROOT), 'data', 'gear.json'), encoding='utf-8').read())

def norm(s):
    s = (s or '').lower().replace('\u2019', "'").replace('\u2014', '-')
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", s)).strip()

variants = collections.defaultdict(list)
for g in gear:
    variants[(norm(g.get('name')), g.get('item_level'))].append(g)

KIT = {'Action Point Gain', 'Stamina Regeneration', 'Movement Speed', 'Recharge Speed'}

def js_stats(g):
    d = dict(g.get('ratingStats') or {})
    if g.get('combinedRating'):
        d['Combined Rating'] = g['combinedRating']
    return d

def score(ocr, js):
    """(hard disagreements, diffs) for one candidate variant."""
    diffs = []
    for st, v in sorted(ocr.items()):
        if st not in js:
            if st in KIT:            # Reinforced-jewel bleed, not a base stat
                continue
            # Split-name artifact: easyocr returns each text region separately
            # and we join with ' | ', so a two-word stat can be cut in half --
            # "+4,084 Deflect Severity" is read as "+4,084 Deflect". If the JSON
            # carries a LONGER stat name starting with this one at the SAME
            # value, that is the same line, not a missing stat.
            if any(k != st and k.startswith(st + ' ') and jv == v for k, jv in js.items()):
                continue
            diffs.append(dict(stat=st, shot=v, json=None, kind='missing_in_json'))
        elif js[st] != v:
            j = js[st]
            # Decimal-strip artifact: the first OCR pass parsed "+39.6" as 396
            # because it stripped the '.'. Fractional ratings are REAL on old
            # low-IL gear, so a JSON value that is exactly the shot value / 10
            # with a fractional part is the SAME number, not a x10 error.
            if not float(j).is_integer() and abs(float(j) * 10 - v) <= 2:
                continue
            sj, ss = str(int(j)) if float(j).is_integer() else str(j), str(v)
            if len(sj) > len(ss) and sj.endswith(ss):
                continue             # OCR dropped a leading digit (4,800 -> 800)
            diffs.append(dict(stat=st, shot=v, json=j, kind='value_differs'))
    hard = [d for d in diffs if d['kind'] in ('value_differs', 'missing_in_json')]
    return len(hard), diffs

cleared = set()
_cp = os.path.join(ROOT, 'scripts', 'ocr_cleared.tsv')
if os.path.exists(_cp):
    for line in io.open(_cp, encoding='utf-8'):
        if line.startswith('#') or not line.strip():
            continue
        parts = line.rstrip().split(chr(9))
        if len(parts) >= 2:
            cleared.add((norm(parts[0]), int(parts[1])))

rows = [json.loads(l) for l in io.open(os.path.join(ROOT, 'scripts', '_ocr_audit.jsonl'), encoding='utf-8')]
out, counts, multi_rescued = [], collections.Counter(), 0
for r in rows:
    if r.get('verdict') in ('OCR_ERROR', 'OCR_UNREADABLE', 'NO_JSON_ENTRY', 'IL_MISMATCH'):
        counts[r['verdict']] += 1
        continue
    if (norm(r['name']), r['il']) in cleared:
        counts['CLEARED'] += 1
        continue
    ocr = r.get('ocr') or {}
    cands = variants.get((norm(r['name']), r['il']), [])
    if not ocr or not cands:
        counts['NO_JSON_ENTRY'] += 1
        continue
    scored = sorted((score(ocr, js_stats(g)) + (g,) for g in cands), key=lambda t: t[0])
    hard, diffs, best = scored[0]
    if hard == 0:
        counts['MATCH'] += 1
        if len(cands) > 1 and r.get('id') != best.get('id'):
            multi_rescued += 1
        continue
    counts['SUSPECT'] += 1
    out.append(dict(name=r['name'], il=r['il'], slot=best.get('slot'), id=best.get('id'),
                    rel=r['rel'], variants=len(cands),
                    diffs=[d for d in diffs if d['kind'] != 'not_seen_in_shot']))

print("RE-DIFF (no images re-read)")
for k, v in counts.most_common():
    print("   %-16s %d" % (k, v))
print("   false positives cleared by variant-aware matching: %d" % multi_rescued)
print()
byitem = collections.OrderedDict()
for r in sorted(out, key=lambda r: -(r['il'] or 0)):
    byitem.setdefault((r['name'], r['il']), r)
print("DISTINCT SUSPECT ITEMS: %d  (was 152)" % len(byitem))
io.open(os.path.join(ROOT, 'scripts', '_ocr_candidates2.txt'), 'w', encoding='utf-8').write(
    "\n".join("%s\tIL%s\t%s\t%s\t%s" % (n, il, r['slot'],
              "; ".join("%s shot=%s json=%s" % (d['stat'], d['shot'], d['json']) for d in r['diffs']),
              r['rel']) for (n, il), r in byitem.items()))
print("\nTOP 20 BY ITEM LEVEL")
for (n, il), r in list(byitem.items())[:20]:
    print("  %-40s %-8s IL%-6s %s" % (n[:40], r['slot'], il,
          "; ".join("%s %s!=%s" % (d['stat'], d['shot'], d['json']) for d in r['diffs'][:3])))
print("\nwrote scripts/_ocr_candidates2.txt")
