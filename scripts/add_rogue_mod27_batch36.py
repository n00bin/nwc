"""Rogue gear batch 36 — League's Elite Raid 3 pieces, League's Elite Assault 4-pc,
Chultan Crafted Weapons start (Wootz Jambiya). Also fix Elite Raid Keffiyeh CR (was 1355, should be 542)."""
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
src_prof = "Professions"

# Fix Elite Raid Keffiyeh CR (was 1355 — wrong; should be 542)
for it in data:
    if it.get("name") == "League's Elite Raid Keffiyeh":
        it["combinedRating"] = 542
        it["notes"] = INTAKE + " (CR corrected from 1355 to 542)"

# League's Elite Raid — remaining 3 pieces (Armor, Arms, Feet)
SET_LER = "League's Elite Raid"
add("League's Elite Raid Khaftan", "Armor", 602,
    {"Accuracy": 542, "Combat Advantage": 361, "Defense": 452}, 542, src_prof, SET_LER, cls_br,
    [{"name": "Survivor's Guard",
      "description": "Gain 15 Defense for each percent of health you are missing."}])
add("League's Elite Raid Qafaz",   "Arms",  602,
    {"Combat Advantage": 361, "Critical Strike": 542, "Defense": 452}, 542, src_prof, SET_LER, cls_br,
    [{"name": "Survivor's Might",
      "description": "Gain 15 Power for each percent of health you are missing."}])
add("League's Elite Raid Soqs",    "Feet",  602,
    {"Accuracy": 542, "Combat Advantage": 361, "Defense": 452}, 542, src_prof, SET_LER, cls_br,
    [{"name": "Warden's Haste",
      "description": "When damaged for more than 10% of Max HP in a single blow, Movement Speed +5% for 10s."}])

# League's Elite Assault — 4 pieces
SET_LEA = "League's Elite Assault"
add("League's Elite Assault Keffiyeh", "Head",  602,
    {"Accuracy": 542, "Critical Severity": 361, "Defense": 452}, 542, src_prof, SET_LEA, cls_br,
    [{"name": "Warden's Defense",
      "description": "When damaged for more than 10% of Max HP in a single blow, gain 5% Defense for 10s."}])
add("League's Elite Assault Khaftan",  "Armor", 602,
    {"Critical Strike": 542, "Critical Severity": 361, "Defense": 452}, 542, src_prof, SET_LEA, cls_br,
    [{"name": "Survivor's Guard",
      "description": "Gain 15 Defense for each percent of health missing."}])
add("League's Elite Assault Qafaz",    "Arms",  602,
    {"Critical Strike": 542, "Critical Severity": 361, "Defense": 452}, 542, src_prof, SET_LEA, cls_br,
    [{"name": "Survivor's Might",
      "description": "Gain 15 Power for each percent of health missing."}])
add("League's Elite Assault Soqs",     "Feet",  602,
    {"Combat Advantage": 542, "Critical Severity": 361, "Defense": 452}, 542, src_prof, SET_LEA, cls_br,
    [{"name": "Warden's Haste",
      "description": "When damaged for more than 10% of Max HP in a single blow, Movement Speed +5% for 10s."}])

# Chultan Crafted Weapons (Set 7/18) — Wootz Jambiya MH IL 350
src_chc = "Professions / Tomb of Annihilation (Module 12)"
ch_eb = [{"type": "Set", "scope": "self", "stat": "Power", "amount": 500,
          "setName": "Chultan", "pieces": 2,
          "description": "2 of Set: Enhances the wielder's strength when entering combat. (Tomb of Annihilation, Module 12)"}]
add("Wootz Jambiya", "Main Hand", 350,
    {"Accuracy": 131, "Combat Advantage": 262, "Critical Strike": 131}, 315, src_chc, "Chultan", ["Rogue"], ch_eb, set_size=2)

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
