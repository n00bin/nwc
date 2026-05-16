"""Rogue gear batch 49 — Elemental Drowcraft Raid 3 more pieces + Elemental Drowcraft Assault start."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))
max_id = max((i.get('id', 0) for i in data), default=0)
INTAKE = "Rogue gear — screenshot intake 2026-05-15."

def add(name, slot, il, rs, cr, source, set_name, classes, equip=None, percent=None, set_size=4, abilities=None):
    global max_id
    max_id += 1
    entry = {"id": max_id, "name": name, "slot": slot, "item_level": il,
        "ratingStats": rs, "combinedRating": cr,
        "equipBonuses": equip or [], "set": set_name or "", "setSize": set_size if set_name else 0,
        "source": source, "percentStats": percent or {}, "abilityBonuses": abilities or {},
        "allowedClasses": classes, "notes": INTAKE}
    data.append(entry)

cls_br = ["Bard", "Rogue"]
src_ei = "Elemental Infusion"

# Elemental Drowcraft Raid 3 more pieces (IL 588)
SET_EDR = "Elemental Drowcraft Raid"
add("Elemental Drowcraft Raid Vest",   "Armor", 588,
    {"Accuracy": 176, "Combat Advantage": 265, "Defense": 441}, 529, src_ei, SET_EDR, cls_br)
add("Elemental Drowcraft Raid Gloves", "Arms",  588,
    {"Combat Advantage": 265, "Critical Strike": 176, "Defense": 441}, 529, src_ei, SET_EDR, cls_br)
add("Elemental Drowcraft Raid Boots",  "Feet",  588,
    {"Combat Advantage": 176, "Critical Strike": 265, "Defense": 441}, 529, src_ei, SET_EDR, cls_br)

# Elemental Drowcraft Assault (IL 588) — start
SET_EDA = "Elemental Drowcraft Assault"
add("Elemental Drowcraft Assault Mask", "Head",  588,
    {"Accuracy": 265, "Critical Severity": 176, "Defense": 441}, 529, src_ei, SET_EDA, cls_br)
add("Elemental Drowcraft Assault Vest", "Armor", 588,
    {"Combat Advantage": 265, "Critical Severity": 176, "Defense": 441}, 529, src_ei, SET_EDA, cls_br)

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
