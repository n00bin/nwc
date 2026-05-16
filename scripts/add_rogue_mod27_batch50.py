"""Rogue gear batch 50 — Elemental Drowcraft Assault Gloves+Boots,
Howling Rogue Set (Howling Dagger MH 4 tiers + Howling Stiletto OH IL 300)."""
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

cls_br = ["Bard", "Rogue"]

# Elemental Drowcraft Assault Gloves + Boots
src_ei = "Elemental Infusion"
SET_EDA = "Elemental Drowcraft Assault"
add("Elemental Drowcraft Assault Gloves", "Arms", 588,
    {"Combat Advantage": 265, "Critical Severity": 176, "Defense": 441}, 529, src_ei, SET_EDA, cls_br, set_size=4)
add("Elemental Drowcraft Assault Boots",  "Feet", 588,
    {"Critical Strike": 265, "Critical Severity": 176, "Defense": 441}, 529, src_ei, SET_EDA, cls_br, set_size=4)

# Howling Rogue Set (Mod 6 Underdark — Weapons of the Elements)
src_ue = "Weapons of the Elements (Module 8) / Protector's Enclave quest"
hw_eb = [{"type": "Set", "scope": "self", "stat": "Movement Speed", "amount": 30,
          "setName": "Howling Heart", "pieces": 2,
          "description": "2 of Set: Dodge/block/sprint/shadow slip increases Movement Speed by 30% for 2s. (10s CD)"}]

TIERS = [(300,270,112,225,112),(400,360,150,300,150),(500,450,188,375,188),(600,540,225,450,225)]

# Howling Dagger MH — 4 tiers
for il, cr, accu, ca, cs in TIERS:
    name = "Howling Dagger" if il == 300 else f"Howling Dagger (IL {il})"
    add(name, "Main Hand", il, {"Accuracy": accu, "Combat Advantage": ca, "Critical Strike": cs}, cr, src_ue, "Howling Heart", ["Rogue"], hw_eb)

# Howling Stiletto OH — IL 300 start
add("Howling Stiletto", "Off Hand", 300, {"Accuracy": 112, "Combat Advantage": 225, "Critical Strike": 112}, 270, src_ue, "Howling Heart", ["Rogue"], hw_eb)

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
