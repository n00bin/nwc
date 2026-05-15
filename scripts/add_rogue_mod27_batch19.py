"""Rogue gear batch 19 — Spy's Guild remaining, Armor of the Dungeon Raider,
Antiquities of Undermountain (Trapper of the Twilight, Stealer of the Star) start."""
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
src_ums = "Undermountain Seals Store"
src_zen = "Zen Market"
src_exp = "Expeditions (Module 16)"

# ---- Spy's Guild Armor remaining (IL 940)
SET_SG = "Spy's Guild Armor"
add("Hide of the Spy's Guild",    "Armor", 940,
    {"Critical Severity": 705, "Defense": 705}, 846, src_ums, SET_SG, cls_all,
    [{"name": "Warden's Defense",
      "description": "When damaged for more than 10% of Max HP in a single blow, gain 5% Defense for 10s."}])
add("Bracers of the Spy's Guild", "Arms",  940,
    {"Accuracy": 282, "Critical Severity": 423, "Defense": 705}, 846, src_ums, SET_SG, cls_all,
    [{"name": "Leader's Might",
      "description": "Gain 250 Power for each player in your team."}])

# ---- Armor of the Dungeon Raider (Set 5/9, IL 940)
SET_DR = "Armor of the Dungeon Raider"
add("Dungeon Raider's Hood",    "Head",  940,
    {"Combat Advantage": 282, "Critical Strike": 423, "Defense": 705}, 846, src_zen, SET_DR, cls_all,
    [{"name": "Undermountain Hunter",
      "description": "+5% Damage in the Undermountain."}])
add("Dungeon Raider's Hide",    "Armor", 940,
    {"Critical Severity": 705, "Defense": 705}, 846, src_zen, SET_DR, cls_all,
    [{"name": "Warden's Defense",
      "description": "When damaged for more than 10% of Max HP in a single blow, gain 5% Defense for 10s."}])
add("Dungeon Raider's Bracers", "Arms",  940,
    {"Accuracy": 282, "Critical Severity": 423, "Defense": 705}, 846, src_zen, SET_DR, cls_all,
    [{"name": "Leader's Might",
      "description": "Gain 250 Power for each player in your team."}])
add("Dungeon Raider's Gaiters", "Feet",  940,
    {"Combat Advantage": 282, "Critical Strike": 423, "Defense": 705}, 846, src_zen, SET_DR, cls_all,
    [{"name": "Death Defier's Advantage",
      "description": "Gain 250 Combat Advantage for each enemy you are engaged in battle. (Max of 15 targets)"}])

# ---- Antiquities of Undermountain (Set 7/9, IL 1000) — Expeditions
SET_AU = "Antiquities of Undermountain"
add("Trapper of the Twilight's Hood", "Head", 1000,
    {"Accuracy": 300, "Critical Severity": 450, "Defense": 450, "Critical Avoidance": 300}, 900, src_exp, SET_AU, cls_all,
    [{"name": "Executioner's Might",
      "description": "When you kill an enemy, your Power increases by 5% for 10 seconds. (30 second cooldown)"}])
add("Stealer of the Star's Hood",     "Head", 1000,
    {"Accuracy": 375, "Critical Strike": 525, "Defense": 450, "Critical Avoidance": 300}, 900, src_exp, SET_AU, cls_all,
    [{"name": "Executioner's Zeal",
      "description": "When you kill an enemy, you gain 1% Action Points."}])

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
