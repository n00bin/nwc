"""Rogue gear batch 20 — Antiquities of Undermountain (multiple variants for all slots),
Crash Guards, Curtunk's Furry Sleeves, Sunset Weapons (Sun Set Ravenloft Mod 14)."""
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
src_exp = "Expeditions (Module 16)"
SET_AU = "Antiquities of Undermountain"

# ---- Trapper of the Twilight (Crit-Sev focus)
add("Trapper of the Twilight's Boots",  "Feet",  1000,
    {"Combat Advantage": 450, "Critical Severity": 375, "Defense": 450, "Critical Avoidance": 300}, 900, src_exp, SET_AU, cls_all,
    [{"name": "Death Defier's Haste",
      "description": "Gain 2.5% Movement Speed for each enemy you are engaged in battle, to the max of 12%."}])
add("Trapper of the Twilight's Braces", "Arms",  1000,
    {"Critical Strike": 375, "Critical Severity": 375, "Defense": 450, "Critical Avoidance": 300}, 900, src_exp, SET_AU, cls_all,
    [{"name": "Encounter Perk",
      "description": "Your Encounter Powers do 3% more damage."}])
add("Trapper of the Twilight's Hides",  "Armor", 1000,
    {"Critical Severity": 750, "Defense": 450, "Critical Avoidance": 300}, 900, src_exp, SET_AU, cls_all,
    [{"name": "Butcher's Tenacity",
      "description": "When you damage or heal your target for more than 15% of your Max HP in a single blow, you gain 1% Critical Severity for 10s. (Max stack 5)"}])

# ---- Stealer of the Star (Action Points / At-Will)
add("Stealer of the Star's Boots",  "Feet",  1000,
    {"Combat Advantage": 375, "Critical Strike": 375, "Defense": 450, "Critical Avoidance": 300}, 900, src_exp, SET_AU, cls_all,
    [{"name": "Death Defier's Might",
      "description": "Gain 250 Power for each enemy you are engaged in battle. (Max of 15 targets)"}])
add("Stealer of the Star's Braces", "Arms",  1000,
    {"Critical Strike": 750, "Defense": 450, "Critical Avoidance": 300}, 900, src_exp, SET_AU, cls_all,
    [{"name": "At-Will Perk",
      "description": "Your At-Will Powers do 3% more damage."}])
add("Stealer of the Star's Hides",  "Armor", 1000,
    {"Critical Strike": 375, "Critical Severity": 375, "Defense": 450, "Critical Avoidance": 300}, 900, src_exp, SET_AU, cls_all,
    [{"name": "Butcher's Might",
      "description": "When you damage or heal your target for more than 15% of your Max HP in a single blow, you gain 1% Power for 10s. (Max stack 5)"}])

# ---- Mugger of the Maze (Defense focus)
add("Mugger of the Maze's Hood",    "Head",  1000,
    {"Accuracy": 375, "Combat Advantage": 375, "Defense": 450, "Critical Avoidance": 300}, 900, src_exp, SET_AU, cls_all,
    [{"name": "Executioner's Guard",
      "description": "When you kill an enemy, your Defense increases by 5% for 10 seconds. (30s CD)"}])
add("Mugger of the Maze's Hides",   "Armor", 1000,
    {"Combat Advantage": 375, "Critical Severity": 375, "Defense": 450, "Critical Avoidance": 300}, 900, src_exp, SET_AU, cls_all,
    [{"name": "Butcher's Remedy",
      "description": "When you damage or heal your target for more than 15% of your Max HP in a single blow, you gain 1% of your health back."}])
add("Mugger of the Maze's Braces",  "Arms",  1000,
    {"Combat Advantage": 375, "Critical Strike": 375, "Defense": 450, "Critical Avoidance": 300}, 900, src_exp, SET_AU, cls_all,
    [{"name": "Bulwark's Shield",
      "description": "You take 5% less damage from Ranged attacks."}])
add("Mugger of the Maze's Boots",   "Feet",  1000,
    {"Combat Advantage": 750, "Defense": 450, "Critical Avoidance": 300}, 900, src_exp, SET_AU, cls_all,
    [{"name": "Death Defier's Focus",
      "description": "Gain 200 Critical Strike for each enemy you are engaged in battle. (Max of 15 targets)"}])

# ---- Standalone Antiquities pieces
add("Crash Guards",          "Arms", 950,
    {"Critical Strike": 285, "Critical Severity": 428, "Defense": 712}, 855, src_exp, "", cls_all,
    [{"name": "Leader's Might",
      "description": "Gain 250 Power for each player in your team."}], set_size=0)
add("Curtunk's Furry Sleeves", "Arms", 1000,
    {"Defense": 750, "Critical Avoidance": 300, "Deflection": 450}, 900, src_exp, "", cls_all,
    [{"name": "Challenger's Guard",
      "description": "When in combat with only one enemy, your Defense and Deflect is increased by 1000."}], set_size=0)

# ---- Sun Set (Ravenloft Mod 14) — Sunset Dagger MH IL 350 + 500
src_rv = "Ravenloft (Module 14) — Bonvia"
sun_eb = [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 5,
           "setName": "Sun Set", "pieces": 2,
           "description": "2 of Set: Base Damage Boost and Overall Outgoing Healing +5%. In Bonvia during nightfall, Damage Resistance and Movement Speed +5%. In Bonvia during nightfall, Base Damage Boost/Damage Resistance/OOH/Movement Speed +10%."}]
add("Sunset Dagger",          "Main Hand", 350,
    {"Accuracy": 131, "Combat Advantage": 262, "Critical Strike": 131}, 315, src_rv, "Sun Set", ["Rogue"], sun_eb, set_size=2)
add("Sunset Dagger (IL 500)", "Main Hand", 500,
    {"Accuracy": 188, "Combat Advantage": 375, "Critical Strike": 188}, 450, src_rv, "Sun Set", ["Rogue"], sun_eb, set_size=2)

# ---- Dull Sunset Dagger (precursor item, IL 490)
add("Dull Sunset Dagger", "Main Hand", 490,
    {}, 0, src_rv, "", ["Rogue"],
    [{"name": "Restore",
      "description": "Vampire-slaying weapon precursor. Restore to obtain a Sunset Dagger."}], set_size=0)

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
