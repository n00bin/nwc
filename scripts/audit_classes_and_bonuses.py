# -*- coding: utf-8 -*-
"""Offline sweeps over the captured tooltip text (scripts/_ocr_text.jsonl).

Two checks the stat audit never covered, both of which produced real errors
that were only ever found by accident:
  1. allowedClasses vs the tooltip's "Requires Class" line.
  2. equip bonuses present on the tooltip but absent from our entry.

Variant-aware: an item is fine if ANY entry sharing its name+item level agrees.
"""
import json, io, os, re, collections, difflib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
gear = json.loads(io.open(os.path.join(os.path.dirname(ROOT), 'data', 'gear.json'), encoding='utf-8').read())

CLASSES = ['Barbarian', 'Bard', 'Cleric', 'Fighter', 'Paladin', 'Ranger', 'Rogue', 'Warlock', 'Wizard']


def norm(s):
    s = (s or '').lower().replace('’', "'")
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", s)).strip()


variants = collections.defaultdict(list)
for g in gear:
    variants[(norm(g.get('name')), g.get('item_level'))].append(g)

# Take the whole span between "Requires Class" and "Minimum Level" and collect
# EVERY class name in it. OCR sprinkles junk through the list ("Paladin,
# ~Barbarian, Fighter" / "Warlock, , Wizard"), so stopping at the first
# unrecognised token silently drops real classes.
REQ = re.compile(r"requires?\s*class\s*[:\.]?\s*(.{4,90}?)(?:minimum\s*level|$)", re.I | re.S)
EQUIP = re.compile(r"\bequip\s*[:\.]\s*([A-Za-z'’\s\(\)]{3,44})", re.I)


def shot_classes(text):
    m = REQ.search(text)
    if not m:
        return None
    tail = m.group(1)
    found = [c for c in CLASSES if re.search(r"\b" + c + r"\b", tail, re.I)]
    return found or None


def shot_bonus(text):
    for m in EQUIP.finditer(text):
        nm = re.split(r"\s{2,}|\|", m.group(1))[0].strip(" .:-")
        # OCR renders the curly apostrophe of "Survivor's" as a bare quote, so
        # naive trimming truncates nearly every bonus name to its first word.
        nm = nm.replace('’', "'")
        nm = re.sub(r"'\s*'", "'s ", nm)
        nm = re.sub(r"'(?=\s)", "'s", nm)
        nm = re.sub(r"'$", "'s", nm)
        nm = re.sub(r"\s+(Whenever|When|Your|Gain|You|For|Increases|Deal|Every|This)\b.*$", "", nm).strip()
        if 3 <= len(nm) <= 40 and not nm.lower().startswith('character'):
            return nm
    return None


cls_bad, bonus_missing = collections.OrderedDict(), collections.OrderedDict()
cls_seen = collections.OrderedDict()
seen_txt = 0
for line in io.open(os.path.join(ROOT, 'scripts', '_ocr_text.jsonl'), encoding='utf-8'):
    r = json.loads(line)
    t = r.get('text')
    if not t:
        continue
    seen_txt += 1
    cands = variants.get((norm(r['name']), r['il']), [])
    if not cands:
        continue

    sc = shot_classes(t)
    if sc:
        # Several copies of the same tooltip exist and OCR quality varies, so a
        # single bad read must not condemn an item. Accumulate the UNION of
        # classes seen across every copy and judge once, at the end.
        key = (r['name'], r['il'])
        u = cls_seen.setdefault(key, [set(), [sorted(g.get('allowedClasses') or []) for g in cands], r['rel'],
                                      any(not (g.get('allowedClasses') or []) for g in cands)])
        u[0].update(sc)

    sb = shot_bonus(t)
    if sb:
        names = {(b.get('name') or '').lower() for g in cands for b in (g.get('equipBonuses') or [])}
        names.discard('')
        # easyocr emits each text region separately and we join with ' | ', so a
        # bonus name is routinely cut in half ("Equip: Survivor's | Critical
        # Resilience"). Treat a stored name that STARTS WITH the read fragment
        # as the same bonus.
        frag = sb.lower().rstrip(" '")
        prefix_hit = any(nm.startswith(frag) or frag.startswith(nm[:14]) for nm in names)
        if not names or (not prefix_hit and not difflib.get_close_matches(sb.lower(), list(names), n=1, cutoff=0.72)):
            key = (r['name'], r['il'])
            if key not in bonus_missing:
                bonus_missing[key] = (sb, sorted(names)[:2], r['rel'], r['il'] or 0)

# Resolve the class check ONCE, after every copy of every tooltip has been
# seen, so a single bad OCR read cannot condemn an item its other copies
# agree on. This step went MISSING in an earlier revision, which made the
# script silently report ZERO class disagreements no matter what the data
# said. It reported 0 for hours while real errors sat in the file.
for _k, (_seen, _ours, _rel, _anyall) in cls_seen.items():
    _sc = sorted(_seen)
    if _anyall:            # empty allowedClasses = all classes, never flag
        continue
    if not any(o == _sc for o in _ours):
        cls_bad[_k] = (_sc, _ours, _rel)

print("tooltips with text: %d\n" % seen_txt)
print("=" * 92)
print("CLASS-LIST DISAGREEMENTS: %d items" % len(cls_bad))
print("=" * 92)
for (n, il), (sc, ours, rel) in sorted(cls_bad.items(), key=lambda kv: -(kv[0][1] or 0))[:30]:
    print("  %-42s IL%-6s shot=%-26s ours=%s" % (n[:42], il, '/'.join(sc), ' | '.join('/'.join(o) or 'ALL' for o in ours)))
print()
print("=" * 92)
print("EQUIP BONUS ON TOOLTIP BUT NOT IN OUR ENTRY: %d items" % len(bonus_missing))
print("=" * 92)
for (n, il), (sb, ours, rel, ilv) in sorted(bonus_missing.items(), key=lambda kv: -(kv[1][3] or 0))[:30]:
    print("  %-42s IL%-6s shot='%s'%s" % (n[:42], il, sb[:34],
          ('   ours=' + ','.join(ours)) if ours else '   (no equipBonuses at all)'))
io.open(os.path.join(ROOT, 'scripts', '_audit_classes.txt'), 'w', encoding='utf-8').write(
    "\n".join("%s\tIL%s\tshot=%s\tours=%s\t%s" % (n, il, '/'.join(sc), ' | '.join('/'.join(o) or 'ALL' for o in ours), rel)
              for (n, il), (sc, ours, rel) in cls_bad.items()))
io.open(os.path.join(ROOT, 'scripts', '_audit_bonuses.txt'), 'w', encoding='utf-8').write(
    "\n".join("%s\tIL%s\t%s\t%s" % (n, il, sb, rel) for (n, il), (sb, ours, rel, ilv) in bonus_missing.items()))
print("\nwrote scripts/_audit_classes.txt and scripts/_audit_bonuses.txt")
