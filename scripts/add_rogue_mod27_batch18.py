"""Rogue gear batch 18 — Runed Apprentice remaining, Protégé Set (4-pc, IL 980),
Spy's Guild Armor (start, IL 940)."""
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

cls_all = ["Cleric", "Bard", "Rogue", "Ranger"]
src_mex = "Master Expeditions in Undermountain (Module 16)"
src_ums = "Undermountain Seals Store"

# ---- Runed Apprentice remaining (IL 965)
SET_RA = "Runed Apprentice Armor"
add("Apprentice's Runed Hide",    "Armor", 965,
    {"Critical Severity": 724, "Defense": 724}, 868, src_mex, SET_RA, cls_all,
    [{"name": "Warden's Defense",
      "description": "Whenever you are damaged for more than 10% of your Maximum Hit Points in a single blow, you gain 5% Defense for 10 seconds."}])
add("Apprentice's Runed Gaiters", "Feet",  965,
    {"Combat Advantage": 290, "Critical Strike": 434, "Defense": 724}, 868, src_mex, SET_RA, cls_all,
    [{"name": "Death Defier's Advantage",
      "description": "Gain 230 Combat Advantage for each enemy you are engaged in battle with. (Max of 15 targets)"}])

# ---- Protégé Set (Set 3/9, IL 980)
SET_PR = "Protégé Set"
add("Protégé's Hood",              "Head",  980,
    {"Combat Advantage": 294, "Critical Strike": 441, "Defense": 735}, 882, src_ums, SET_PR, cls_all,
    [{"name": "Undermountain Hunter",
      "description": "+5% Damage in the Undermountain."}])
add("Protégé's Layered Leathers",  "Armor", 980,
    {"Critical Severity": 735, "Defense": 735}, 882, src_ums, SET_PR, cls_all,
    [{"name": "Warden's Defense",
      "description": "When damaged for more than 10% of your Max HP in a single blow, gain 5% Defense for 10s."}])
add("Protégé's Weathered Gloves",  "Arms",  980,
    {"Accuracy": 294, "Critical Severity": 441, "Defense": 735}, 882, src_ums, SET_PR, cls_all,
    [{"name": "Leader's Might",
      "description": "Gain 250 Power for each player in your team."}])
add("Protégé's Buckled Boots",     "Feet",  980,
    {"Combat Advantage": 294, "Critical Strike": 441, "Defense": 735}, 882, src_ums, SET_PR, cls_all,
    [{"name": "Death Defier's Advantage",
      "description": "Gain 250 Combat Advantage for each enemy you are engaged in battle. (Max of 15 targets)"}])

# ---- Spy's Guild Armor (Set 4/9, IL 940)
SET_SG = "Spy's Guild Armor"
add("Hood of the Spy's Guild",    "Head", 940,
    {"Combat Advantage": 282, "Critical Strike": 423, "Defense": 705}, 846, src_ums, SET_SG, cls_all,
    [{"name": "Undermountain Hunter",
      "description": "+5% Damage in the Undermountain."}])
add("Gaiters of the Spy's Guild", "Feet", 940,
    {"Combat Advantage": 282, "Critical Strike": 423, "Defense": 705}, 846, src_ums, SET_SG, cls_all,
    [{"name": "Death Defier's Advantage",
      "description": "Gain 250 Combat Advantage for each enemy you are engaged in battle. (Max of 15 targets)"}])

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
