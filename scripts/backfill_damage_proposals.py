"""READ-ONLY: propose structured damage fields for free-text damage bonuses.
Does NOT modify any data — prints what a backfill WOULD change, with confidence.
Conservative: mixed "in-Zone / elsewhere" takes the unconditional value; anything
ambiguous is flagged 'low' (skip) for manual review.
Run: python scripts/backfill_damage_proposals.py
"""
import json, glob, re, collections, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES = ['gear.json', 'overloads.json', 'artifacts.json', 'mount_equip_powers.json', 'mount_combat_powers.json']
ZONES = ['Thay', 'Wildspace', 'Sword Coast', 'Underdark', 'Avernus', 'Sharandar', 'Undermountain', 'Barovia', 'Vellosk', 'Chult']
DMGSTAT = re.compile(r'damage|dmg|boost', re.I)
PCT_DMG = re.compile(r'(\d+(?:\.\d+)?)\s*%\s*(?:more |additional |increased? )?(?:total |outgoing )?(?:damage|dmg)', re.I)
DEAL = re.compile(r'deal(?:s)?\s+(?:an? )?(?:additional )?(\d+(?:\.\d+)?)\s*%', re.I)
ELSEWHERE = re.compile(r'(\d+(?:\.\d+)?)\s*%\s*(?:damage\b)?[^.]*?(?:non-?\w+|other\b|otherwise|elsewhere|other maps?)', re.I)
ELSEWHERE2 = re.compile(r'(?:non-?\w+|other maps?|otherwise|elsewhere)[^.]*?(\d+(?:\.\d+)?)\s*%', re.I)

def zones_in(txt):
    return [z for z in ZONES if re.search(r'\b' + re.escape(z) + r'\b', txt, re.I)]

def propose(eb):
    txt = (eb.get('effectText') or eb.get('description') or '').strip()
    if not txt:
        return None
    low = txt.lower()
    # slot type
    if re.search(r'at-?will', low): stat = 'At Will Dmg Bonus'
    elif re.search(r'\bencounter\b', low): stat = 'Encounter Dmg Bonus'
    elif re.search(r'\bdaily\b', low): stat = 'Daily Dmg Bonus'
    else: stat = 'Dmg Bonus'
    nums = [float(m.group(1)) for m in PCT_DMG.finditer(txt)]
    if not nums:
        m = DEAL.search(txt); nums = [float(m.group(1))] if m else []
    if not nums:
        return None
    z = zones_in(txt)
    mapped = bool(re.search(r'\bmaps?\b', low))
    conditional = bool(re.search(r'when you|whenever|\bchance\b|\bstack|per enemy|next (?:encounter|at-?will|daily)|\bbelow\b|\babove\b|\bwhile\b', low))
    prop = {'stat': stat}; conf = 'high'; note = ''
    if z or mapped:
        em = ELSEWHERE.search(txt) or ELSEWHERE2.search(txt)
        if em:
            prop['amount'] = float(em.group(1)); conf = 'medium'
            note = 'took UNCONDITIONAL (elsewhere) value; zone-gated part dropped'
        else:
            prop['amount'] = min(nums); prop['zones'] = z or ['map']; conf = 'medium'
            note = 'zone/map-gated; set zones (excluded in General)'
    elif len(set(nums)) > 1:
        prop['amount'] = min(nums); conf = 'low'; note = f'multiple values {sorted(set(nums))}; took min — REVIEW'
    else:
        prop['amount'] = nums[0]
        if conditional:
            prop['alwaysActive'] = False; conf = 'medium'; note = 'conditional/proc — uptime model applies'
    # very long / chained text → low confidence
    if conf != 'low' and (len(txt) > 130 or txt.count('%') > 2):
        conf = 'low'; note = (note + '; ' if note else '') + 'complex text — REVIEW'
    return {'prop': prop, 'conf': conf, 'note': note, 'text': txt}

buckets = collections.defaultdict(list)
total = 0
for fn in FILES:
    p = os.path.join(ROOT, '..', 'data', fn)
    try: d = json.load(open(p, encoding='utf-8'))
    except Exception: continue
    items = d if isinstance(d, list) else next((v for v in d.values() if isinstance(v, list)), [])
    for it in (items if isinstance(items, list) else []):
        if not isinstance(it, dict): continue
        for i, eb in enumerate(it.get('equipBonuses') or []):
            if not isinstance(eb, dict): continue
            if DMGSTAT.search(str(eb.get('stat') or '')): continue   # already structured
            r = propose(eb)
            if not r: continue
            total += 1
            buckets[r['conf']].append((fn, it.get('name', '?'), it.get('id'), i, eb.get('name') or '', r))

print(f"=== Free-text damage bonuses with a proposed structured field: {total} ===")
for c in ['high', 'medium', 'low']:
    print(f"   {c.upper():6}: {len(buckets[c])}")

print("\n===== HIGH confidence (would apply automatically) =====")
for fn, nm, iid, idx, ebn, r in buckets['high'][:40]:
    print(f"  {nm[:30]:30} id{iid} eb[{idx}]  ->  {json.dumps(r['prop'])}")
    print(f"       from: \"{r['text'][:90]}\"")

print("\n===== MEDIUM confidence (apply with a glance) — sample =====")
for fn, nm, iid, idx, ebn, r in buckets['medium'][:18]:
    print(f"  {nm[:28]:28} -> {json.dumps(r['prop'])}  [{r['note']}]")
    print(f"       from: \"{r['text'][:85]}\"")

print("\n===== LOW confidence (FLAG for your review, not applied) — sample =====")
for fn, nm, iid, idx, ebn, r in buckets['low'][:14]:
    print(f"  {nm[:28]:28} -> {json.dumps(r['prop'])}  [{r['note']}]")
    print(f"       from: \"{r['text'][:85]}\"")

# write full proposals locally for review (not committed)
out = os.path.join(ROOT, 'scripts', '_damage_proposals.json')
dump = {c: [{'file': fn, 'name': nm, 'id': iid, 'ebIndex': idx, 'proposal': r['prop'], 'note': r['note'], 'text': r['text']}
            for fn, nm, iid, idx, ebn, r in buckets[c]] for c in buckets}
json.dump(dump, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f"\nFull proposal list written to scripts/_damage_proposals.json ({total} entries) — review before applying.")
