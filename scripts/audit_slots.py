# -*- coding: utf-8 -*-
"""Slot audit: our stored slot vs the slot line on the item's own tooltip.

A field no earlier pass checked. An item in the wrong slot cannot be equipped
where it belongs and competes against the wrong items in the optimizer.

Reads the slot from the chunk immediately above "Requires Class" - NOT from a
character window around it, which swallows background text ("DREAD RING" was
being read as a Ring slot). Multi-variant items are attributed to the right
entry by matching base stats first, exactly as audit_class_lists.py does.

  python scripts/audit_slots.py            # report
  python scripts/audit_slots.py --list     # tab-separated, for driving fixes
"""
import collections, io, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
gear = json.loads(io.open(os.path.join(os.path.dirname(ROOT), 'data', 'gear.json'), encoding='utf-8').read())


def norm(s):
    s = (s or '').lower().replace('’', "'")
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", s)).strip()


variants = collections.defaultdict(list)
for g in gear:
    variants[(norm(g.get('name')), g.get('item_level'))].append(g)

stats_by_rel = {}
for line in io.open(os.path.join(ROOT, 'scripts', '_ocr_audit.jsonl'), encoding='utf-8'):
    r = json.loads(line)
    if r.get('ocr'):
        stats_by_rel[r['rel']] = r['ocr']

# Anchored patterns: the slot line is its own short line, so anchor to the
# start of the chunk. 'armor' is the exception - it appears as "Armor, Cloth"
# or "Scale, Armor", so it is matched anywhere in the chunk.
SLOT = [('Main Hand', r'main[\s-]?hand'), ('Off Hand', r'off[\s-]?hand'),
        ('Head', r'^head\b'), ('Arms', r'^arms\b'), ('Feet', r'^feet\b'),
        ('Shirt', r'^shirt\b'), ('Pants', r'^pants\b'), ('Ring', r'^ring\b'),
        ('Neck', r'^neck\b'), ('Waist', r'^waist\b'), ('Armor', r'\barmor\b')]

# Our schema deliberately uses its own slot names for these; never flag them.
SCHEMA_ONLY = {'Companion Equipment', 'Artifact Equipment'}


def shot_slot(text):
    m = re.search(r"requires?\s*class", text, re.I)
    if not m:
        return None
    chunks = [c.strip(" .:-") for c in text[:m.start()].split('|') if c.strip(" .:-")]
    for c in reversed(chunks[-3:]):
        for name, pat in SLOT:
            if re.search(pat, c, re.I):
                return name
    return None


def score(ocr, g):
    rs = dict(g.get('ratingStats') or {})
    if g.get('combinedRating'):
        rs['Combined Rating'] = g['combinedRating']
    return sum(1 for st, v in rs.items()
               if st in ocr and (ocr[st] == v or (not float(v).is_integer() and abs(float(v) * 10 - ocr[st]) <= 2)))


seen = collections.defaultdict(lambda: [set(), set()])
for line in io.open(os.path.join(ROOT, 'scripts', '_ocr_text.jsonl'), encoding='utf-8'):
    r = json.loads(line)
    t = r.get('text')
    if not t:
        continue
    ss = shot_slot(t)
    if not ss:
        continue
    cands = variants.get((norm(r['name']), r['il']), [])
    if not cands:
        continue
    if len(cands) == 1:
        best = cands[0]
    else:
        ocr = stats_by_rel.get(r['rel'])
        if not ocr:
            continue
        ranked = sorted(((score(ocr, g), g) for g in cands), key=lambda x: -x[0])
        if ranked[0][0] < 2 or (len(ranked) > 1 and ranked[0][0] == ranked[1][0]):
            continue
        best = ranked[0][1]
    e = seen[best['id']]
    e[0].add(ss)
    e[1].add(r['rel'])

byid = {g['id']: g for g in gear}
bad = []
for gid, (slots, rels) in seen.items():
    g = byid[gid]
    if g.get('slot') in SCHEMA_ONLY:
        continue
    if len(slots) != 1:                     # copies disagree - not confident
        continue
    ss = next(iter(slots))
    if ss != g.get('slot'):
        bad.append((g, ss, sorted(rels)[0]))
bad.sort(key=lambda t: (-(t[0].get('item_level') or 0), t[0].get('name') or ''))

if '--list' in sys.argv:
    for g, ss, rel in bad:
        print("%s\t%s\t%s\t%s\t%s\t%s" % (g['id'], g.get('name'), g.get('item_level'),
                                          g.get('slot'), ss, rel))
else:
    print("SLOT DISAGREEMENTS: %d\n" % len(bad))
    for g, ss, rel in bad:
        print("  id%-6s %-44s IL%-6s ours=%-10s shot=%s" %
              (g['id'], (g.get('name') or '')[:44], g.get('item_level'), g.get('slot'), ss))
