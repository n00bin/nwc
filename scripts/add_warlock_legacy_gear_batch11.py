"""Legacy Warlock gear batch 11 — Infernal Forged base + Armor of the Successor.

Sets covered:
- Infernal Forged Armor (continued, IL 1200 base tier)
- Armor of the Successor (Lair of the Mad Mage Epic, Module 18, IL 990-1010, Warlock-only)
"""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))
max_id = max((i.get('id', 0) for i in data), default=0)

INTAKE = "Legacy Warlock gear collection screenshot intake 2026-05-13."

def add(name, slot, il, rs, cr, source, set_name=None, set_size=None,
        allowed=None, equip=None, ps=None, ab=None):
    global max_id
    max_id += 1
    entry = {
        "id": max_id, "name": name, "slot": slot, "item_level": il,
        "ratingStats": rs, "combinedRating": cr,
        "equipBonuses": equip or [], "set": set_name or "",
        "setSize": set_size or 0, "source": source,
        "percentStats": ps or {}, "abilityBonuses": ab or {},
        "notes": INTAKE
    }
    if allowed:
        entry["allowedClasses"] = allowed
    data.append(entry)

# Infernal Forged (IL 1200, base tier) — additional pieces
source = "Vallenhas Seals Store"
set_name = "Infernal Forged Armor"

add("Infernal Forged Robe", "Armor", 1200, {"Critical Severity": 900, "Defense": 900}, 1080, source, set_name, 4, ["Warlock", "Wizard"],
    [{"name": "Leader's Guard", "description": "Gain 1000 Defense for each player in your team."}])
add("Infernal Forged Scalemail", "Armor", 1200, {"Defense": 900, "Deflection": 900}, 1080, source, set_name, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Leader's Guard", "description": "Gain 1000 Defense for each player in your team."}])
add("Infernal Forged Shoes", "Feet", 1200, {"Combat Advantage": 360, "Critical Strike": 540, "Defense": 900}, 1080, source, set_name, 4, ["Warlock", "Wizard"],
    [{"name": "Gladiator's Might", "description": "For every 5 seconds you are in combat, you gain 200 Power. Max 24 Stacks: 4800 Power."}])
add("Infernal Forged Cuisses", "Feet", 1200, {"Critical Strike": 450, "Defense": 900, "Critical Avoidance": 450}, 1080, source, set_name, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Gladiator's Might", "description": "For every 5 seconds you are in combat, you gain 200 Power. Max 24 Stacks: 4800 Power."}])
add("Infernal Forged Cowl", "Head", 1200, {"Combat Advantage": 360, "Critical Strike": 540, "Defense": 900}, 1080, source, set_name, 4, ["Warlock", "Wizard"],
    [{"name": "Skirmisher's Might", "description": "Whenever you deal Combat Advantage damage with your powers, you have a 10% chance to gain 5000 Power for 10 seconds. (30 second cooldown)"}])
add("Infernal Forged Braces", "Arms", 1200, {"Critical Strike": 450, "Defense": 900, "Deflection": 450}, 1080, source, set_name, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Survivor's Might", "description": "Whenever you Deflect an attack, gain 1000 Power for 10 seconds. (Max 5 stacks)"}])
add("Infernal Forged Wristguards", "Arms", 1200, {"Accuracy": 360, "Critical Severity": 540, "Defense": 900}, 1080, source, set_name, 4, ["Warlock", "Wizard"],
    [{"name": "Survivor's Might", "description": "Whenever you Deflect an attack, gain 1000 Power for 10 seconds. (Max 5 stacks)"}])

# Armor of the Successor — IL 1010 (Master) and 990 (Advanced), Warlock only, Lair of the Mad Mage
source = "Lair of the Mad Mage (Epic Dungeon)"
set_name = "Armor of the Successor"

add("Mystic Cowl of Halaster's Successor", "Head", 1010, {"Critical Strike": 530, "Defense": 758, "Critical Avoidance": 227}, 909, source, set_name, 4, ["Warlock"],
    [{"name": "Executioner's Focus", "description": "When you kill an enemy, your Critical Strike increases by 5% for 10 seconds."}])
add("Barbed Cowl of Halaster's Successor", "Head", 1010, {"Combat Advantage": 303, "Critical Strike": 455, "Defense": 758}, 909, source, set_name, 4, ["Warlock"],
    [{"name": "Executioner's Focus", "description": "When you kill an enemy, your Critical Strike increases by 5% for 10 seconds."}])
add("Charmed Boots of Halaster's Successor", "Feet", 1010, {"Critical Strike": 379, "Defense": 758, "Critical Avoidance": 379}, 909, source, set_name, 4, ["Warlock"],
    [{"name": "Sniper's Advantage", "description": "When you are 50' or further away from your target, your Combat Advantage is increased by 5%."}])
add("Cursed Boots of Halaster's Successor", "Feet", 1010, {"Combat Advantage": 303, "Critical Strike": 455, "Defense": 758}, 909, source, set_name, 4, ["Warlock"],
    [{"name": "Sniper's Advantage", "description": "When you are 50' or further away from your target, your Combat Advantage is increased by 5%."}])
add("Mystic Robes of Halaster's Successor", "Armor", 1010, {"Defense": 758, "Deflection": 758}, 909, source, set_name, 4, ["Warlock"],
    [{"name": "Gladiator's Guard", "description": "For every 5 seconds you are in combat, you gain .5% Defense, to the max of 6%."}])
add("Barbed Robe of Halaster's Successor", "Armor", 1010, {"Critical Severity": 758, "Defense": 758}, 909, source, set_name, 4, ["Warlock"],
    [{"name": "Gladiator's Guard", "description": "For every 5 seconds you are in combat, you gain .5% Defense, to the max of 6%."}])
add("Cursed Gloves of Halaster's Successor", "Arms", 1010, {"Accuracy": 303, "Critical Severity": 455, "Defense": 758}, 909, source, set_name, 4, ["Warlock"],
    [{"name": "Call of the Undermountain", "description": "At the start of combat, you will call forth creatures of Undermountain, summoning them to help you and increasing your Power by 5% for 15 seconds. (60 second cooldown)"}])
add("Charmed Gloves of Halaster's Successor", "Arms", 1010, {"Critical Strike": 379, "Defense": 758, "Deflection": 379}, 909, source, set_name, 4, ["Warlock"],
    [{"name": "Call of the Undermountain", "description": "At the start of combat, you will call forth creatures of Undermountain, summoning them to help you and increasing your Power by 5% for 15 seconds. (60 second cooldown)"}])

# Armor of the Successor (IL 990, Advanced)
source990 = "Lair of the Mad Mage (Advanced)"
add("Barbed Cowl of the Successor", "Head", 990, {"Combat Advantage": 297, "Critical Strike": 446, "Defense": 742}, 891, source990, set_name, 4, ["Warlock"],
    [{"name": "Executioner's Focus", "description": "When you kill an enemy, your Critical Strike increases by 5% for 10 seconds."}])
add("Mystic Cowl of the Successor", "Head", 990, {"Critical Strike": 520, "Defense": 742, "Critical Avoidance": 223}, 891, source990, set_name, 4, ["Warlock"],
    [{"name": "Executioner's Focus", "description": "When you kill an enemy, your Critical Strike increases by 5% for 10 seconds."}])
add("Charmed Boots of the Successor", "Feet", 990, {"Critical Strike": 371, "Defense": 742, "Critical Avoidance": 379}, 891, source990, set_name, 4, ["Warlock"],
    [{"name": "Sniper's Advantage", "description": "When you are 50' or further away from your target, your Combat Advantage is increased by 5%."}])
add("Cursed Boots of the Successor", "Feet", 990, {"Combat Advantage": 297, "Critical Strike": 446, "Defense": 742}, 891, source990, set_name, 4, ["Warlock"],
    [{"name": "Sniper's Advantage", "description": "When you are 50' or further away from your target, your Combat Advantage is increased by 5%."}])
add("Mystic Robes of the Successor", "Armor", 990, {"Defense": 742, "Deflection": 742}, 891, source990, set_name, 4, ["Warlock"],
    [{"name": "Gladiator's Guard", "description": "For every 5 seconds you are in combat, you gain .5% Defense, to the max of 6%."}])
add("Barbed Robe of the Successor", "Armor", 990, {"Critical Severity": 742, "Defense": 742}, 891, source990, set_name, 4, ["Warlock"],
    [{"name": "Gladiator's Guard", "description": "For every 5 seconds you are in combat, you gain .5% Defense, to the max of 6%."}])
add("Charmed Gloves of the Successor", "Arms", 990, {"Critical Strike": 371, "Defense": 742, "Deflection": 379}, 891, source990, set_name, 4, ["Warlock"],
    [{"name": "Call of the Undermountain", "description": "At the start of combat, you will call forth creatures of Undermountain, summoning them to help you and increasing your Power by 5% for 15 seconds. (60 second cooldown)"}])
add("Cursed Gloves of the Successor", "Arms", 990, {"Accuracy": 297, "Critical Severity": 446, "Defense": 742}, 891, source990, set_name, 4, ["Warlock"],
    [{"name": "Call of the Undermountain", "description": "At the start of combat, you will call forth creatures of Undermountain, summoning them to help you and increasing your Power by 5% for 15 seconds. (60 second cooldown)"}])

# Runed Apprentice Armor — Apprentice's Runed Wristguard (IL 965)
add("Apprentice's Runed Wristguard", "Arms", 965, {"Accuracy": 290, "Critical Severity": 414, "Defense": 724}, 868,
    "Lair of the Mad Mage (Advanced)", "Runed Apprentice Armor", 4, ["Wizard", "Warlock"],
    [{"name": "Leader's Might", "description": "Gain 250 Power for each player in your team."}])

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
