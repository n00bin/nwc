# -*- coding: utf-8 -*-
"""Class-list audit that matches each screenshot to the RIGHT variant first.

The earlier sweep compared a tooltip's "Requires Class" line against every
entry sharing that name+item level, taking the union of classes seen across
all of them. Where several class variants share a name that union is
meaningless - it made every multi-variant item look wrong.

This version identifies which variant a screenshot actually shows by matching
its BASE STATS, then compares only that variant's allowedClasses. An item is
reported only when a screenshot confidently matched to one entry disagrees
with that entry's stored class list.

  python scripts/audit_class_lists.py
"""
import collections, io, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
gear = json.loads(io.open(os.path.join(os.path.dirname(ROOT), 'data', 'gear.json'), encoding='utf-8').read())

CLASSES = ['Barbarian', 'Bard', 'Cleric', 'Fighter', 'Paladin', 'Ranger', 'Rogue', 'Warlock', 'Wizard']
REQ = re.compile(r"requires?\s*class\s*[:\.]?\s*(.{4,90}?)(?:minimum\s*level|$)", re.I | re.S)


def norm(s):
    s = (s or '').lower().replace('’', "'")
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", s)).strip()


def shot_classes(text):
    m = REQ.search(text)
    if not m:
        return None
    # OCR welds punctuation onto class names ("Paladin_", "Barbarian;"), and \b
    # does not fire before an underscore - match the bare word instead.
    found = [c for c in CLASSES if re.search(r"(?<![A-Za-z])" + c + r"(?![A-Za-z])", m.group(1), re.I)]
    return found or None


variants = collections.defaultdict(list)
for g in gear:
    variants[(norm(g.get('name')), g.get('item_level'))].append(g)

# rel -> parsed base stats (from the OCR-diff pass)
stats_by_rel = {}
for line in io.open(os.path.join(ROOT, 'scripts', '_ocr_audit.jsonl'), encoding='utf-8'):
    r = json.loads(line)
    if r.get('ocr'):
        stats_by_rel[r['rel']] = r['ocr']


def score(ocr, g):
    """How many base stats of this entry the screenshot confirms."""
    rs = dict(g.get('ratingStats') or {})
    if g.get('combinedRating'):
        rs['Combined Rating'] = g['combinedRating']
    hits = 0
    for st, v in rs.items():
        s = ocr.get(st)
        if s is None:
            continue
        # the first OCR pass stripped decimal points, so 87.6 was read as 876
        if s == v or (not float(v).is_integer() and abs(float(v) * 10 - s) <= 2):
            hits += 1
    return hits


seen = collections.defaultdict(lambda: [set(), set()])   # id -> (classes seen, rels)
ambiguous = 0
for line in io.open(os.path.join(ROOT, 'scripts', '_ocr_text.jsonl'), encoding='utf-8'):
    r = json.loads(line)
    t = r.get('text')
    if not t:
        continue
    sc = shot_classes(t)
    if not sc:
        continue
    cands = variants.get((norm(r['name']), r['il']), [])
    if not cands:
        continue
    if len(cands) == 1:
        best = cands[0]
    else:
        ocr = stats_by_rel.get(r['rel'])
        if not ocr:
            ambiguous += 1
            continue
        ranked = sorted(((score(ocr, g), g) for g in cands), key=lambda x: -x[0])
        # need a clear winner: at least 2 confirmed stats and no tie at the top
        if ranked[0][0] < 2 or (len(ranked) > 1 and ranked[0][0] == ranked[1][0]):
            ambiguous += 1
            continue
        best = ranked[0][1]
    if not (best.get('allowedClasses') or []):    # empty = all classes
        continue
    e = seen[best['id']]
    e[0].add(tuple(sorted(sc)))
    e[1].add(r['rel'])

byid = {g['id']: g for g in gear}
bad = []
for gid, (classsets, rels) in seen.items():
    g = byid[gid]
    ours = tuple(sorted(g.get('allowedClasses') or []))
    if ours in classsets:
        continue
    # every screenshot that matched this entry must agree on one class list
    if len(classsets) != 1:
        continue                     # copies disagree - not confident
    bad.append((g, sorted(classsets)[0], sorted(rels)[0]))

bad.sort(key=lambda t: -(t[0].get('item_level') or 0))
print("variant-matched screenshots: %d entries    ambiguous, skipped: %d\n" % (len(seen), ambiguous))
print("=" * 96)
print("CLASS-LIST DISAGREEMENTS (screenshot matched to THIS entry by its stats): %d" % len(bad))
print("=" * 96)
for g, sc, rel in bad[:40]:
    print("  id%-6s %-40s IL%-6s shot=%-26s ours=%s"
          % (g['id'], (g.get('name') or '')[:40], g.get('item_level'),
             '/'.join(sc), '/'.join(g.get('allowedClasses') or [])))
io.open(os.path.join(ROOT, 'scripts', '_audit_classes.txt'), 'w', encoding='utf-8').write(
    "\n".join("%s\t%s\tIL%s\tshot=%s\tours=%s\t%s"
              % (g['id'], g.get('name'), g.get('item_level'), '/'.join(sc),
                 '/'.join(g.get('allowedClasses') or []), rel) for g, sc, rel in bad))
print("\nwrote scripts/_audit_classes.txt")
