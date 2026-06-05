"""Backfill structured slot/power-type damage stats onto CLEAN free-text bonuses.
Targets ONLY unambiguous "Your [At-Will/Encounter/Daily/Ranged/Melee] Powers do
X% more damage" (and bare "Your Powers do X% more damage"). Skips multi-slot,
enemy-type, AoE, zone, and proc phrasings (left for manual / scenario work).

Dry-run by default (prints changes). Pass --apply to write the data + rebuild.
  python scripts/backfill_slot_damage.py          # show
  python scripts/backfill_slot_damage.py --apply   # write + build-data.py
"""
import json, re, os, sys, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APPLY = '--apply' in sys.argv
FILES = ['gear.json', 'overloads.json', 'artifacts.json', 'mount_equip_powers.json', 'mount_combat_powers.json']
DMGSTAT = re.compile(r'damage|dmg|boost', re.I)
SLOTTED = re.compile(r'\bYour\s+(At-?Will|Encounter|Daily|Ranged|Melee)\s+Powers?\s+(?:do|deal)\s+(\d+(?:\.\d+)?)\s*%\s+more\s+damage', re.I)
GENERIC = re.compile(r'\bYour\s+Powers?\s+(?:do|deal)\s+(\d+(?:\.\d+)?)\s*%\s+more\s+damage', re.I)
STATMAP = {'at-will': 'At Will Dmg Bonus', 'atwill': 'At Will Dmg Bonus', 'encounter': 'Encounter Dmg Bonus',
           'daily': 'Daily Dmg Bonus', 'ranged': 'Ranged Dmg Bonus', 'melee': 'Melee Dmg Bonus'}

def classify(txt):
    m = SLOTTED.search(txt)
    if m:
        return STATMAP[m.group(1).lower().replace('-', '')] if m.group(1).lower().replace('-', '') in STATMAP else STATMAP[m.group(1).lower()], float(m.group(2))
    # Bare "Your Powers do X% more damage" — ONLY if there's no trailing
    # condition (when/while/against/closer/further). Range/positional generic
    # lines are deferred to the range-uptime handling, not credited as flat.
    m = GENERIC.search(txt)
    if m and not re.search(r'\b(when|while|against|closer|further|enem|stack|chance|map|behind|facing)\b', txt, re.I):
        return 'Dmg Bonus', float(m.group(1))
    return None, None

changes = []
for fn in FILES:
    p = os.path.join(ROOT, '..', 'data', fn)
    try: data = json.load(open(p, encoding='utf-8'))
    except Exception: continue
    items = data if isinstance(data, list) else next((v for v in data.values() if isinstance(v, list)), [])
    touched = False
    for it in (items if isinstance(items, list) else []):
        if not isinstance(it, dict): continue
        for eb in (it.get('equipBonuses') or []):
            if not isinstance(eb, dict): continue
            if eb.get('stat'): continue                          # already has a stat — don't overwrite
            txt = (eb.get('effectText') or eb.get('description') or '')
            stat, amt = classify(txt)
            if not stat: continue
            changes.append((fn, it.get('name', '?'), it.get('id'), stat, amt, txt.strip()[:70]))
            if APPLY:
                eb['stat'] = stat; eb['amount'] = amt; touched = True
    if APPLY and touched:
        json.dump(data, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

print(f"{'APPLIED' if APPLY else 'DRY-RUN'} — {len(changes)} clean slot/power-type damage bonuses:")
byfile = {}
for fn, nm, iid, stat, amt, txt in changes:
    byfile.setdefault(fn, 0); byfile[fn] += 1
for fn, n in byfile.items(): print(f"   {fn}: {n}")
print()
for fn, nm, iid, stat, amt, txt in changes[:60]:
    print(f"  {nm[:34]:34} id{iid}  +{{{stat}: {amt}}}   <- \"{txt}\"")

if APPLY:
    print("\nRebuilding data/*.js via build-data.py …")
    r = subprocess.run(['python3', 'build-data.py'], cwd=ROOT, capture_output=True, text=True)
    print(r.stdout[-400:] if r.stdout else '', r.stderr[-400:] if r.stderr else '')
