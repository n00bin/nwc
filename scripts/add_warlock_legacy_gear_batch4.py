"""Legacy Warlock gear batch 4 (screenshots 220437-220507).

Sets covered:
- Dark Maiden's Gear (Northdark Reaches Campaign Store, IL 2000)
- Dragonsteel Gear / Dragonhide (Northdark Reaches Seals Store, IL 1900)
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

# Dark Maiden's Gear — IL 2000
add("The Dark Maiden's Raid Mask", "Head", 2000, {"Combat Advantage": 900, "Critical Severity": 1200, "Defense": 900}, 1800,
    "Northdark Reaches Campaign Store", "Dark Maiden's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Executioner's Zeal", "description": "When you kill an enemy, you gain 1% Action Points."}])
add("The Dark Maiden's Raid Coat", "Armor", 2000, {"Combat Advantage": 1500, "Defense": 1500}, 1800,
    "Northdark Reaches Campaign Store", "Dark Maiden's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Maiden's Blade", "description": "You do 5% more damage to enemies that are not facing you. This bonus doubles in the Underdark."}])
add("The Dark Maiden's Raid Wristguards", "Arms", 2000, {"Critical Strike": 1500, "Defense": 1500}, 1800,
    "Northdark Reaches Campaign Store", "Dark Maiden's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Critical Force", "description": "Whenever you Critically Strike with your Powers, you have a 10% chance to deal 150 magnitude damage around you. (15 second cooldown)"}])
add("The Dark Maiden's Raid Longboots", "Feet", 2000, {"Critical Strike": 1200, "Critical Severity": 900, "Defense": 900}, 1800,
    "Northdark Reaches Campaign Store", "Dark Maiden's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Spider's Bane", "description": "Gain 4,500 Power in the Underdark and gain more role effectiveness when in the Temple of the Spider. DPS +5% Base Damage Boost, Tank -5% Incoming Damage, Healer +5% Overall Outgoing Healing."}])
add("The Dark Maiden's Rejuvenation Hood", "Head", 2000, {"Critical Strike": 1500, "Defense": 1500}, 1800,
    "Northdark Reaches Campaign Store", "Dark Maiden's Gear", 4, ["Warlock", "Bard"],
    [{"name": "Divine Muse", "description": "Your Divinity/Performance/Soulweave regenerates 10% faster."}])
add("The Dark Maiden's Rejuvenation Raiment", "Armor", 2000, {"Critical Strike": 1200, "Defense": 900, "Outgoing Healing": 900}, 1800,
    "Northdark Reaches Campaign Store", "Dark Maiden's Gear", 4, ["Warlock", "Bard"],
    [{"name": "Maiden's Blade", "description": "You do 5% more damage to enemies that are not facing you. This bonus doubles in the Underdark."}])
add("The Dark Maiden's Rejuvenation Mitts", "Arms", 2000, {"Critical Strike": 1500, "Outgoing Healing": 1500}, 1800,
    "Northdark Reaches Campaign Store", "Dark Maiden's Gear", 4, ["Warlock", "Bard"],
    [{"name": "Critical Force", "description": "Whenever you Critically Strike with your Powers, you have a 10% chance to deal 150 magnitude damage around you. (15 second cooldown)"}])
add("The Dark Maiden's Rejuvenation Steps", "Feet", 2000, {"Defense": 900, "Deflect Severity": 900, "Forte": 1200}, 1800,
    "Northdark Reaches Campaign Store", "Dark Maiden's Gear", 4, ["Warlock", "Bard"],
    [{"name": "Spider's Bane", "description": "Gain 4,500 Power in the Underdark and gain more role effectiveness when in the Temple of the Spider. DPS +5% Base Damage Boost, Tank -5% Incoming Damage, Healer +5% Overall Outgoing Healing."}])

# Dragonhide Gear — IL 1900, Northdark Reaches Seals Store, Module 24
add("Dragonhide Horn", "Head", 1900, {"Combat Advantage": 1140, "Defense": 855, "Deflection": 855}, 1710,
    "Northdark Reaches Seals Store", "Dragonsteel Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Dragon Hunter's Might", "description": "+5% Damage against Dragons. When your health is below 50%, your Awareness is increased by 8,000."}])
add("Dragonhide Leathers", "Armor", 1900, {"Critical Severity": 1140, "Defense": 855, "Awareness": 855}, 1710,
    "Northdark Reaches Seals Store", "Dragonsteel Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Leader's Power", "description": "Gain 1000 Power and Accuracy for each player in your team."}])
add("Dragonhide Sleeves", "Arms", 1900, {"Accuracy": 1425, "Defense": 1425}, 1710,
    "Northdark Reaches Seals Store", "Dragonsteel Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Charged At-Will", "description": "Whenever you activate a Daily power, increase the damage dealt by your at-will attacks by 15% for 10 seconds. (20 second cooldown)"}])
add("Dragonhide Poulaines", "Feet", 1900, {"Combat Advantage": 1140, "Critical Strike": 855, "Defense": 855}, 1710,
    "Northdark Reaches Seals Store", "Dragonsteel Gear", 4, ["Warlock", "Wizard"],
    [{"name": "This or That", "description": "When not in a party, gain 3,000 Defense. When in a party, gain 10,000 Critical Severity."}])
add("Dragonhide Coif", "Head", 1900, {"Critical Strike": 1140, "Defense": 855, "Incoming Healing": 855}, 1710,
    "Northdark Reaches Seals Store", "Dragonsteel Gear", 4, ["Warlock", "Bard"],
    [{"name": "Dragon Hunter's Might", "description": "+5% Damage against Dragons. When your health is below 50%, your Awareness is increased by 8,000."}])
add("Dragonhide Raiment", "Armor", 1900, {"Critical Severity": 1140, "Defense": 855, "Deflection": 855}, 1710,
    "Northdark Reaches Seals Store", "Dragonsteel Gear", 4, ["Warlock", "Bard"],
    [{"name": "Leader's Power", "description": "Gain 1000 Power and Outgoing Healing for each player in your team."}])
add("Dragonhide Cuffs", "Arms", 1900, {"Defense": 1425, "Outgoing Healing": 1425}, 1710,
    "Northdark Reaches Seals Store", "Dragonsteel Gear", 4, ["Warlock", "Bard"],
    [{"name": "Resistance Rune", "description": "You gain 5% Defense while Controlled."}])
add("Dragonhide Crakows", "Feet", 1900, {"Defense": 855, "Awareness": 1140, "Control Resistance": 855}, 1710,
    "Northdark Reaches Seals Store", "Dragonsteel Gear", 4, ["Warlock", "Bard"],
    [{"name": "This or That", "description": "When not in a party, gain 10,000 Forte. When in a party, gain 10,000 Critical Strike."}])

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
