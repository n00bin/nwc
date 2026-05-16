"""Rogue gear batch 40 — Fey Stiletto OH 2 more tiers + Lifeforged Weapons (Dagger MH 4 tiers + Stiletto OH IL 350 start)."""
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

# Fey Stiletto OH IL 650/800
fey_eb = [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 3,
           "setName": "Fey", "pieces": 2,
           "description": "2 of Set: Fey-Touched on encounter power: 10% AP + 3% BDB + 6% OOH for 10s. (30s CD)"}]
add("Fey Stiletto (IL 650)", "Off Hand", 650, {"Accuracy": 244, "Combat Advantage": 488, "Critical Strike": 244}, 585, src_ca, "Fey", ["Rogue"], fey_eb)
add("Fey Stiletto (IL 800)", "Off Hand", 800, {"Accuracy": 300, "Combat Advantage": 600, "Critical Strike": 300}, 720, src_ca, "Fey", ["Rogue"], fey_eb)

# Lifeforged Weapons
lf_eb = [{"type": "Set", "scope": "self", "stat": "Defense", "amount": 5,
          "setName": "Lifeforged", "pieces": 2,
          "description": "2 of Set: Encounter power triggers Fortified: Defense +5%, 10% of Defense added to Power for 10s. (30s CD)"}]

TIERS = [(350,315,131,262,131),(500,450,188,375,188),(650,585,244,488,244),(800,720,300,600,300)]

# Lifeforged Dagger MH — 4 tiers
for il, cr, accu, ca, cs in TIERS:
    name = "Lifeforged Dagger" if il == 350 else f"Lifeforged Dagger (IL {il})"
    add(name, "Main Hand", il, {"Accuracy": accu, "Combat Advantage": ca, "Critical Strike": cs}, cr, src_ca, "Lifeforged", ["Rogue"], lf_eb)

# Lifeforged Stiletto OH — IL 350 start
add("Lifeforged Stiletto", "Off Hand", 350, {"Accuracy": 131, "Combat Advantage": 262, "Critical Strike": 131}, 315, src_ca, "Lifeforged", ["Rogue"], lf_eb)

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
