"""Legacy Warlock gear batch 7 — Weathered Wood + Crone's Gear (Sharandar).

Sets covered:
- Weathered Wood Gear (Sharandar Seals Store, IL 1300, Module 20)
- The Crone's Gear (Sharandar Seals Store, IL 1225, Module 20)
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

# Forest Guardian's Raid Coat — missed from batch 6
add("Forest Guardian's Raid Coat", "Armor", 1500, {"Accuracy": 1125, "Defense": 1125}, 1350,
    "Vault of Stars (Epic Dungeon)", "Forest Guardian's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Leader's Awareness", "description": "Gain 1500 Awareness for each player in your team."}])

# Weathered Wood Gear — IL 1300
add("Weathered Wood Coif", "Head", 1300, {"Critical Strike": 682, "Defense": 975, "Incoming Healing": 292}, 1170,
    "Sharandar Seals Store", "Weathered Wood Gear", 4, ["Warlock", "Bard"],
    [{"name": "Skirmisher's Might", "description": "Whenever you deal Combat Advantage damage with your powers, you have a 10% chance to gain 5000 Power for 10 seconds. (30 second cooldown)"}])
add("Weathered Wood Cowl", "Head", 1300, {"Combat Advantage": 390, "Defense": 975, "Control Bonus": 585}, 1170,
    "Sharandar Seals Store", "Weathered Wood Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Skirmisher's Might", "description": "Whenever you deal Combat Advantage damage with your powers, you have a 10% chance to gain 5000 Power for 10 seconds. (30 second cooldown)"}])
add("Weathered Wood Cuisses", "Feet", 1300, {"Critical Strike": 488, "Defense": 975, "Critical Avoidance": 488}, 1170,
    "Sharandar Seals Store", "Weathered Wood Gear", 4, ["Warlock", "Bard"],
    [{"name": "Gladiator's Might", "description": "For every 3 seconds you are in combat, you gain 200 Power. Max 24 Stacks: 4800 Power."}])
add("Weathered Wood Shoes", "Feet", 1300, {"Combat Advantage": 390, "Critical Strike": 585, "Defense": 975}, 1170,
    "Sharandar Seals Store", "Weathered Wood Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Gladiator's Might", "description": "For every 3 seconds you are in combat, you gain 200 Power. Max 24 Stacks: 4800 Power."}])
add("Weathered Wood Scalemail", "Armor", 1300, {"Defense": 975, "Forte": 975}, 1170,
    "Sharandar Seals Store", "Weathered Wood Gear", 4, ["Warlock", "Bard"],
    [{"name": "Leader's Guard", "description": "Gain 1000 Defense for each player in your team."}])
add("Weathered Wood Robe", "Armor", 1300, {"Accuracy": 975, "Defense": 975}, 1170,
    "Sharandar Seals Store", "Weathered Wood Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Leader's Guard", "description": "Gain 1000 Defense for each player in your team."}])
add("Weathered Wood Restoration Trousers", "Feet", 1300, {"Defense": 651, "Awareness": 1299}, 1170,
    "Sharandar Seals Store", "Weathered Wood Gear", 4, ["Warlock", "Bard"],
    [{"name": "Warden's Haste", "description": "Whenever you are damaged for more than 15% of your Maximum Hit Points in a single blow, your Movement Speed increases by 5% for 10 seconds."}])
add("Weathered Wood Ward Trousers", "Feet", 1300, {"Defense": 651, "Deflection": 1299}, 1170,
    "Sharandar Seals Store", "Weathered Wood Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Warden's Haste", "description": "Whenever you are damaged for more than 15% of your Maximum Hit Points in a single blow, your Movement Speed increases by 5% for 10 seconds."}])
add("Weathered Wood Wristguards", "Arms", 1300, {"Accuracy": 390, "Critical Severity": 585, "Defense": 975}, 1170,
    "Sharandar Seals Store", "Weathered Wood Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Survivor's Might", "description": "Whenever you Deflect an attack, gain 1000 Power for 10 seconds. Max 5 stacks."}])
add("Weathered Wood Braces", "Arms", 1300, {"Defense": 975, "Deflection": 488, "Outgoing Healing": 488}, 1170,
    "Sharandar Seals Store", "Weathered Wood Gear", 4, ["Warlock", "Bard"],
    [{"name": "Survivor's Might", "description": "Whenever you Deflect an attack, gain 1000 Power for 10 seconds. Max 5 stacks."}])

# Crone's Gear — IL 1225
add("Crone's Coif", "Head", 1225, {"Critical Strike": 643, "Defense": 919, "Incoming Healing": 276}, 1102,
    "Sharandar Seals Store", "Crone's Gear", 4, ["Warlock", "Bard", "Paladin", "Cleric"],
    [{"name": "Executioner's Might", "description": "When you kill an enemy, your Power increases by 5000 for 10 seconds. (30 second cooldown)"}])
add("Crone's Cowl", "Head", 1225, {"Accuracy": 551, "Combat Advantage": 368, "Defense": 919}, 1102,
    "Sharandar Seals Store", "Crone's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Executioner's Might", "description": "When you kill an enemy, your Power increases by 5000 for 10 seconds. (30 second cooldown)"}])
add("Crone's Cuisses", "Feet", 1225, {"Critical Strike": 459, "Defense": 919, "Critical Avoidance": 459}, 1102,
    "Sharandar Seals Store", "Crone's Gear", 4, ["Warlock", "Bard", "Paladin", "Cleric"],
    [{"name": "Contender's Might", "description": "At the start of combat, your Power is increased by 3000 for 10 seconds."}])
add("Crone's Shoes", "Feet", 1225, {"Combat Advantage": 368, "Critical Strike": 551, "Defense": 919}, 1102,
    "Sharandar Seals Store", "Crone's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Contender's Might", "description": "At the start of combat, your Power is increased by 3000 for 10 seconds."}])
add("Crone's Scalemail", "Armor", 1225, {"Defense": 919, "Forte": 919}, 1102,
    "Sharandar Seals Store", "Crone's Gear", 4, ["Warlock", "Bard", "Paladin", "Cleric"],
    [{"name": "Survivor's Remedy", "description": "Whenever you Deflect an attack, you have a 10% chance to restore 5% of your Maximum Hit Points. This effect may only occur once every 5 seconds."}])

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
