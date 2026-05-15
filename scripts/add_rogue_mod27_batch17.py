"""Rogue gear batch 17 — Armor of the Successor (Master IL 1010 + Advanced IL 990),
Runed Apprentice Armor (Master Expeditions, IL 965)."""
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
cls_all = ["Cleric", "Bard", "Rogue", "Ranger"]
src_lmm = "Lair of the Mad Mage Epic Dungeon"
src_mex = "Master Expeditions in Undermountain (Module 16)"

# ---- Armor of the Successor (Set 1/9 Master, IL 1010) — Bard/Rogue
SET_HS = "Armor of Halaster's Successor"
add("Elegant Cap of Halaster's Successor",       "Head",  1010,
    {"Combat Advantage": 303, "Critical Strike": 455, "Defense": 758}, 909, src_lmm, SET_HS, cls_br,
    [{"name": "Executioner's Focus",
      "description": "When you kill an enemy, your Critical Strike increases by 5% for 10 seconds."}])
add("Elegant Leathers of Halaster's Successor",  "Armor", 1010,
    {"Critical Severity": 758, "Defense": 758}, 909, src_lmm, SET_HS, cls_br,
    [{"name": "Gladiator's Guard",
      "description": "For every 5 seconds you are in combat, you gain 0.5% Defense, to the max of 6%."}])
add("Banded Bracers of Halaster's Successor",    "Arms",  1010,
    {"Accuracy": 303, "Critical Severity": 455, "Defense": 758}, 909, src_lmm, SET_HS, cls_br,
    [{"name": "Call of the Undermountain",
      "description": "At the start of combat, you will call forth creatures of Undermountain, summoning them to help you and increasing your Power by 5% for 15 seconds. (60 second cooldown)"}])
add("Banded Boots of Halaster's Successor",      "Feet",  1010,
    {"Combat Advantage": 303, "Critical Strike": 455, "Defense": 758}, 909, src_lmm, SET_HS, cls_br,
    [{"name": "Brute's Advantage",
      "description": "When you are 25' or closer to your target, your Combat Advantage is increased by 5%."}])

# ---- Armor of the Successor (Advanced, IL 990)
SET_S = "Armor of the Successor"
add("Elegant Cap of the Successor",       "Head",  990,
    {"Combat Advantage": 297, "Critical Strike": 446, "Defense": 742}, 891, src_lmm, SET_S, cls_br,
    [{"name": "Executioner's Focus",
      "description": "When you kill an enemy, your Critical Strike increases by 5% for 10 seconds."}])
add("Elegant Leathers of the Successor",  "Armor", 990,
    {"Critical Severity": 742, "Defense": 742}, 891, src_lmm, SET_S, cls_br,
    [{"name": "Gladiator's Guard",
      "description": "For every 5 seconds you are in combat, you gain 0.5% Defense, to the max of 6%."}])
add("Banded Bracers of the Successor",    "Arms",  990,
    {"Accuracy": 297, "Critical Severity": 446, "Defense": 742}, 891, src_lmm, SET_S, cls_br,
    [{"name": "Call of the Undermountain",
      "description": "At the start of combat, you will call forth creatures of Undermountain, summoning them to help you and increasing your Power by 5% for 15 seconds. (60s CD)"}])
add("Banded Boots of the Successor",      "Feet",  990,
    {"Combat Advantage": 297, "Critical Strike": 446, "Defense": 742}, 891, src_lmm, SET_S, cls_br,
    [{"name": "Brute's Advantage",
      "description": "When you are 25' or closer to your target, your Combat Advantage is increased by 5%."}])

# ---- Runed Apprentice Armor (Set 2/9, IL 965) — Cleric/Ranger/Bard/Rogue
SET_RA = "Runed Apprentice Armor"
add("Apprentice's Runed Hood",    "Head",  965,
    {"Combat Advantage": 290, "Critical Strike": 434, "Defense": 724}, 868, src_mex, SET_RA, cls_all,
    [{"name": "Undermountain Hunter",
      "description": "+5% Damage in the Undermountain."}])
add("Apprentice's Runed Bracers", "Arms",  965,
    {"Accuracy": 290, "Critical Severity": 434, "Defense": 724}, 868, src_mex, SET_RA, cls_all,
    [{"name": "Leader's Might",
      "description": "Gain 250 Power for each player in your team."}])

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
