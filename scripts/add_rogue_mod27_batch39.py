"""Rogue gear batch 39 — Mirage Stiletto OH IL 800, Fey Weapons (Fey Dagger MH 4 tiers + Fey Stiletto OH 2 tiers)."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))
max_id = max((i.get('id', 0) for i in data), default=0)
INTAKE = "Rogue gear — screenshot intake 2026-05-15."

def add(name, slot, il, rs, cr, source, set_name, classes, equip=None, percent=None, set_size=2, abilities=None):
    global max_id
    max_id += 1
    entry = {"id": max_id, "name": name, "slot": slot, "item_level": il,
        "ratingStats": rs, "combinedRating": cr,
        "equipBonuses": equip or [], "set": set_name or "", "setSize": set_size if set_name else 0,
        "source": source, "percentStats": percent or {}, "abilityBonuses": abilities or {},
        "allowedClasses": classes, "notes": INTAKE}
    data.append(entry)

src_ca = "Cloaked Ascendancy Campaign Vendor / River District (Module 15)"

# Mirage Stiletto OH IL 800
mir_eb = [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 3,
           "setName": "Mirage", "pieces": 2,
           "description": "2 of Set: Master of Illusion — illusion attacks enemies for 10s, +3% damage. (30s CD)"}]
add("Mirage Stiletto (IL 800)", "Off Hand", 800, {"Accuracy": 300, "Combat Advantage": 600, "Critical Strike": 300}, 720, src_ca, "Mirage", ["Rogue"], mir_eb)

# Fey Weapons
fey_eb = [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 3,
           "setName": "Fey", "pieces": 2,
           "description": "2 of Set: Fey-Touched. Encounter power triggers Fey-Touched for 10s: restores 10% AP, BDB +3%, OOH +6%. (30s CD)"}]

TIERS = [(350,315,131,262,131),(500,450,188,375,188),(650,585,244,488,244),(800,720,300,600,300)]

# Fey Dagger MH — 4 tiers
for il, cr, accu, ca, cs in TIERS:
    name = "Fey Dagger" if il == 350 else f"Fey Dagger (IL {il})"
    add(name, "Main Hand", il, {"Accuracy": accu, "Combat Advantage": ca, "Critical Strike": cs}, cr, src_ca, "Fey", ["Rogue"], fey_eb)

# Fey Stiletto OH — 2 tiers (350, 500)
for il, cr, accu, ca, cs in TIERS[:2]:
    name = "Fey Stiletto" if il == 350 else f"Fey Stiletto (IL {il})"
    add(name, "Off Hand", il, {"Accuracy": accu, "Combat Advantage": ca, "Critical Strike": cs}, cr, src_ca, "Fey", ["Rogue"], fey_eb)

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
