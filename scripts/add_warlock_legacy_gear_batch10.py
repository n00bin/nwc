"""Legacy Warlock gear batch 10 — Infernal Forged Armor (3 tiers).

Sets covered: Infernal Forged Armor (Vallenhas Seals Store, Module 19)
- Fiend Forged (IL 1230) — Maximum Quality
- Devil Forged (IL 1215) — Mid tier
- Demon Forged (IL 1215) — Mid tier (different stat variant)
- Infernal Forged (IL 1200) — Base tier
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

source = "Vallenhas Seals Store"
set_name = "Infernal Forged Armor"

# --- Fiend Forged (IL 1230, Maximum Quality) ---
add("Fiend Forged Cowl", "Head", 1230, {"Combat Advantage": 369, "Critical Strike": 554, "Defense": 922}, 1107, source, set_name, 4, ["Warlock", "Wizard"],
    [{"name": "Skirmisher's Might", "description": "Whenever you deal Combat Advantage damage with your powers, you have a 10% chance to gain 5000 Power for 10 seconds. (30 second cooldown)"},
     {"name": "Fiend Hunter", "description": "+1% Damage against Demons, Devils, and Fiends."}])
add("Fiend Forged Cuisses", "Feet", 1230, {"Critical Strike": 461, "Defense": 922, "Critical Avoidance": 461}, 1107, source, set_name, 4, ["Warlock", "Bard", "Paladin", "Cleric"],
    [{"name": "Gladiator's Might", "description": "For every 3 seconds you are in combat, you gain 200 Power. Max 24 Stacks: 4800 Power."},
     {"name": "Fiend Hunter", "description": "+1% Damage against Demons, Devils, and Fiends."}])
add("Fiend Forged Shoes", "Feet", 1230, {"Combat Advantage": 369, "Critical Strike": 554, "Defense": 922}, 1107, source, set_name, 4, ["Warlock", "Wizard"],
    [{"name": "Gladiator's Might", "description": "For every 3 seconds you are in combat, you gain 200 Power. Max 24 Stacks: 4800 Power."},
     {"name": "Fiend Hunter", "description": "+1% Damage against Demons, Devils, and Fiends."}])
add("Fiend Forged Scalemail", "Armor", 1230, {"Defense": 922, "Deflection": 922}, 1107, source, set_name, 4, ["Warlock", "Bard", "Paladin", "Cleric"],
    [{"name": "Leader's Guard", "description": "Gain 1000 Defense for each player in your team."},
     {"name": "Fiend Hunter", "description": "+1% Damage against Demons, Devils, and Fiends."}])
add("Fiend Forged Robe", "Armor", 1230, {"Critical Severity": 922, "Defense": 922}, 1107, source, set_name, 4, ["Warlock", "Wizard"],
    [{"name": "Leader's Guard", "description": "Gain 1000 Defense for each player in your team."},
     {"name": "Fiend Hunter", "description": "+1% Damage against Demons, Devils, and Fiends."}])
add("Fiend Forged Wristguards", "Arms", 1230, {"Accuracy": 369, "Critical Severity": 554, "Defense": 922}, 1107, source, set_name, 4, ["Warlock", "Wizard"],
    [{"name": "Survivor's Might", "description": "Whenever you Deflect an attack, gain 1000 Power for 10 seconds. (Max 5 stacks)"},
     {"name": "Fiend Hunter", "description": "+1% Damage against Demons, Devils, and Fiends."}])
add("Fiend Forged Braces", "Arms", 1230, {"Critical Strike": 461, "Defense": 922, "Deflection": 461}, 1107, source, set_name, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Survivor's Might", "description": "Whenever you Deflect an attack, gain 1000 Power for 10 seconds. (Max 5 stacks)"},
     {"name": "Fiend Hunter", "description": "+1% Damage against Demons, Devils, and Fiends."}])

# --- Devil Forged (IL 1215) ---
add("Devil Forged Cowl", "Head", 1215, {"Combat Advantage": 364, "Critical Strike": 547, "Defense": 911}, 1094, source, set_name, 4, ["Warlock", "Wizard"],
    [{"name": "Skirmisher's Might", "description": "Whenever you deal Combat Advantage damage with your powers, you have a 10% chance to gain 5000 Power for 10 seconds. (30 second cooldown)"},
     {"name": "Devil Hunter", "description": "+1% Damage against Demons"}])
add("Devil Forged Coif", "Head", 1215, {"Critical Strike": 638, "Defense": 911, "Critical Avoidance": 273}, 1094, source, set_name, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Skirmisher's Might", "description": "Whenever you deal Combat Advantage damage with your powers, you have a 10% chance to gain 5000 Power for 10 seconds. (30 second cooldown)"},
     {"name": "Devil Hunter", "description": "+1% Damage against Demons"}])
add("Devil Forged Cuisses", "Feet", 1215, {"Critical Strike": 456, "Defense": 911, "Critical Avoidance": 456}, 1094, source, set_name, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Gladiator's Might", "description": "For every 5 seconds you are in combat, you gain 200 Power. Max 24 Stacks: 4800 Power."},
     {"name": "Devil Hunter", "description": "+7% Damage against Demons"}])
add("Devil Forged Shoes", "Feet", 1215, {"Combat Advantage": 364, "Critical Strike": 547, "Defense": 911}, 1094, source, set_name, 4, ["Warlock", "Wizard"],
    [{"name": "Gladiator's Might", "description": "For every 5 seconds you are in combat, you gain 200 Power. Max 24 Stacks: 4800 Power."},
     {"name": "Devil Hunter", "description": "+7% Damage against Demons"}])
add("Devil Forged Scalemail", "Armor", 1215, {"Defense": 911, "Deflection": 911}, 1094, source, set_name, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Leader's Guard", "description": "Gain 1000 Defense for each player in your team."},
     {"name": "Devil Hunter", "description": "+7% Damage against Demons"}])
add("Devil Forged Robe", "Armor", 1215, {"Critical Severity": 911, "Defense": 911}, 1094, source, set_name, 4, ["Warlock", "Wizard"],
    [{"name": "Leader's Guard", "description": "Gain 1000 Defense for each player in your team."},
     {"name": "Devil Hunter", "description": "+7% Damage against Demons"}])
add("Devil Forged Wristguards", "Arms", 1215, {"Accuracy": 364, "Critical Severity": 547, "Defense": 911}, 1094, source, set_name, 4, ["Warlock", "Wizard"],
    [{"name": "Survivor's Might", "description": "Whenever you Deflect an attack, gain 1000 Power for 10 seconds. (Max 5 stacks)"},
     {"name": "Devil Hunter", "description": "+1% Damage against Demons"}])
add("Devil Forged Braces", "Arms", 1215, {"Critical Strike": 456, "Defense": 911, "Deflection": 456}, 1094, source, set_name, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Survivor's Might", "description": "Whenever you Deflect an attack, gain 1000 Power for 10 seconds. (Max 5 stacks)"},
     {"name": "Devil Hunter", "description": "+1% Damage against Demons"}])

# --- Demon Forged (IL 1215) ---
add("Demon Forged Cowl", "Head", 1215, {"Combat Advantage": 364, "Critical Strike": 547, "Defense": 911}, 1094, source, set_name, 4, ["Warlock", "Wizard"],
    [{"name": "Skirmisher's Might", "description": "Whenever you deal Combat Advantage damage with your powers, you have a 10% chance to gain 5000 Power for 10 seconds. (30 second cooldown)"},
     {"name": "Devil Hunter", "description": "+1% Damage against Devils"}])
add("Demon Forged Coif", "Head", 1215, {"Critical Strike": 638, "Defense": 911, "Critical Avoidance": 273}, 1094, source, set_name, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Skirmisher's Might", "description": "Whenever you deal Combat Advantage damage with your powers, you have a 10% chance to gain 5000 Power for 10 seconds. (30 second cooldown)"},
     {"name": "Devil Hunter", "description": "+1% Damage against Devils"}])
add("Demon Forged Cuisses", "Feet", 1215, {"Critical Strike": 456, "Defense": 911, "Critical Avoidance": 456}, 1094, source, set_name, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Gladiator's Might", "description": "For every 5 seconds you are in combat, you gain 200 Power. Max 24 Stacks: 4800 Power."},
     {"name": "Devil Hunter", "description": "+7% Damage against Devils"}])
add("Demon Forged Shoes", "Feet", 1215, {"Combat Advantage": 364, "Critical Strike": 547, "Defense": 911}, 1094, source, set_name, 4, ["Warlock", "Wizard"],
    [{"name": "Gladiator's Might", "description": "For every 5 seconds you are in combat, you gain 200 Power. Max 24 Stacks: 4800 Power."},
     {"name": "Devil Hunter", "description": "+1% Damage against Devils"}])
add("Demon Forged Scalemail", "Armor", 1215, {"Defense": 911, "Deflection": 911}, 1094, source, set_name, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Leader's Guard", "description": "Gain 1000 Defense for each player in your team."},
     {"name": "Devil Hunter", "description": "+7% Damage against Devils"}])
add("Demon Forged Robe", "Armor", 1215, {"Critical Severity": 911, "Defense": 911}, 1094, source, set_name, 4, ["Warlock", "Wizard"],
    [{"name": "Leader's Guard", "description": "Gain 1000 Defense for each player in your team."},
     {"name": "Devil Hunter", "description": "+7% Damage against Devils"}])
add("Demon Forged Wristguards", "Arms", 1215, {"Accuracy": 364, "Critical Severity": 547, "Defense": 911}, 1094, source, set_name, 4, ["Warlock", "Wizard"],
    [{"name": "Survivor's Might", "description": "Whenever you Deflect an attack, gain 1000 Power for 10 seconds. (Max 5 stacks)"},
     {"name": "Devil Hunter", "description": "+1% Damage against Devils"}])
add("Demon Forged Braces", "Arms", 1215, {"Critical Strike": 456, "Defense": 911, "Deflection": 456}, 1094, source, set_name, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Survivor's Might", "description": "Whenever you Deflect an attack, gain 1000 Power for 10 seconds. (Max 5 stacks)"},
     {"name": "Devil Hunter", "description": "+1% Damage against Devils"}])

# --- Infernal Forged (IL 1200, base tier) ---
add("Infernal Forged Coif", "Head", 1200, {"Critical Strike": 630, "Defense": 900, "Critical Avoidance": 270}, 1080,
    "Vallenhas Seals Store", "Infernal Forged Armor", 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Skirmisher's Might", "description": "Whenever you deal Combat Advantage damage with your powers, you have a 10% chance to gain 5000 Power for 10 seconds. (30 second cooldown)"}])

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
