"""Rogue gear batch 54 — Drowned Dagger MH 2 more tiers, Drowned Stiletto OH 4 tiers,
Eternal Armor Set start (Bard/Rogue, Tyranny of Dragons)."""
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

src_ue = "Weapons of the Elements (Module 8)"
TIERS = [(300,270,112,225,112),(400,360,150,300,150),(500,450,188,375,188),(600,540,225,450,225)]

dh_eb = [{"type": "Set", "scope": "self", "stat": "Heal Self", "amount": 50,
          "setName": "Drowned Heart", "pieces": 2,
          "description": "2 of Set: When struck, Heal for 50% of Max HP over 30s. (30s CD)"}]

# Drowned Dagger MH — 2 more tiers (500/600)
for il, cr, accu, ca, cs in TIERS[2:]:
    add(f"Drowned Dagger (IL {il})", "Main Hand", il, {"Accuracy": accu, "Combat Advantage": ca, "Critical Strike": cs}, cr, src_ue, "Drowned Heart", ["Rogue"], dh_eb)

# Drowned Stiletto OH — 4 tiers
for il, cr, accu, ca, cs in TIERS:
    name = "Drowned Stiletto" if il == 300 else f"Drowned Stiletto (IL {il})"
    add(name, "Off Hand", il, {"Accuracy": accu, "Combat Advantage": ca, "Critical Strike": cs}, cr, src_ue, "Drowned Heart", ["Rogue"], dh_eb)

# Eternal Armor Set (Set 1/5, IL 1300) — Tyranny of Dragons Epic Adventure
src_tod = "Tyranny of Dragons Epic Adventure"
SET_EA = "Eternal Armor Set"
cls_br = ["Bard", "Rogue"]
add("Eternal Boots",  "Feet", 1300,
    {"Accuracy": 337, "Critical Severity": 337, "Defense": 975, "Critical Avoidance": 296}, 1170, src_tod, SET_EA, cls_br, set_size=4)
add("Eternal Gloves", "Arms", 1300,
    {"Accuracy": 339, "Critical Strike": 339, "Defense": 975, "Deflection": 296}, 1170, src_tod, SET_EA, cls_br, set_size=4)

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
