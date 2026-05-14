"""Legacy Warlock gear batch 6 — Shield of the North + Forest Guardian's.

Sets covered:
- Shield of the North Gear (Dragonbone Vale Seals Store, IL 1600, Module 22 Dragonslayer)
- Forest Guardian's Gear (Vault of Stars Epic Dungeon, IL 1500, Echoes of Prophecy)
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

# Shield of the North Gear — IL 1600
add("Enclave Medic's Armlets", "Arms", 1600, {"Defense": 720, "Deflect Severity": 720, "Outgoing Healing": 960}, 1440,
    "Dragonbone Vale Seals Store", "Shield of the North Gear", 4, ["Warlock", "Bard"],
    [{"name": "Leader's Ward", "description": "Gain 500 Deflect Severity for each player in your team."}])
add("Enclave Medic's Boots", "Feet", 1600, {"Defense": 720, "Awareness": 720, "Incoming Healing": 960}, 1440,
    "Dragonbone Vale Seals Store", "Shield of the North Gear", 4, ["Warlock", "Bard"],
    [{"name": "Death Defier's Focus", "description": "Gain 500 Critical Strike for each enemy you are engaged in battle within. (Max of 15 targets)"}])
add("Enclave Medic's Coif", "Head", 1600, {"Critical Strike": 960, "Defense": 720, "Deflect Severity": 720}, 1440,
    "Dragonbone Vale Seals Store", "Shield of the North Gear", 4, ["Warlock", "Bard"],
    [{"name": "Charged Precision", "description": "When your Stamina is over 75%, your Accuracy is increased by 7.5%."}])
add("Enclave Medic's Leathers", "Armor", 1600, {"Critical Severity": 960, "Defense": 720, "Deflection": 720}, 1440,
    "Dragonbone Vale Seals Store", "Shield of the North Gear", 4, ["Warlock", "Bard"],
    [{"name": "Leader's Might", "description": "Gain 1500 Power for each player in your team."}])
add("Alliance Officer's Sleeves", "Arms", 1600, {"Critical Severity": 960, "Defense": 720, "Incoming Healing": 720}, 1440,
    "Dragonbone Vale Seals Store", "Shield of the North Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Leader's Ward", "description": "Gain 500 Deflect Severity for each player in your team."}])
add("Alliance Officer's Poulaines", "Feet", 1600, {"Defense": 720, "Deflection": 960, "Control Resistance": 720}, 1440,
    "Dragonbone Vale Seals Store", "Shield of the North Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Death Defier's Focus", "description": "Gain 500 Critical Strike for each enemy you are engaged in battle within. (Max of 15 targets)"}])
add("Alliance Officer's Cap", "Head", 1600, {"Accuracy": 960, "Defense": 720, "Control Resistance": 720}, 1440,
    "Dragonbone Vale Seals Store", "Shield of the North Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Charged Precision", "description": "When your Stamina is over 75%, your Accuracy is increased by 7.5%."}])
add("Alliance Officer's Coat", "Armor", 1600, {"Critical Strike": 960, "Defense": 720, "Critical Avoidance": 720}, 1440,
    "Dragonbone Vale Seals Store", "Shield of the North Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Leader's Might", "description": "Gain 1500 Power for each player in your team."}])

# Forest Guardian's Gear — IL 1500
add("Forest Guardian's Restoration Crown", "Head", 1500, {"Critical Strike": 788, "Defense": 1125, "Incoming Healing": 338}, 1350,
    "Vault of Stars (Epic Dungeon)", "Forest Guardian's Gear", 4, ["Warlock", "Bard"],
    [{"name": "Fey Hunter", "description": "+5% Damage in all of Sharandar."}])
add("Forest Guardian's Restoration Cuisses", "Feet", 1500, {"Critical Strike": 562, "Defense": 1125, "Critical Avoidance": 562}, 1350,
    "Vault of Stars (Epic Dungeon)", "Forest Guardian's Gear", 4, ["Warlock", "Bard"],
    [{"name": "Charged Mastery", "description": "When your Stamina is over 75%, your Combat Advantage is increased by 7500."}])
add("Forest Guardian's Restoration Leathers", "Armor", 1500, {"Defense": 1125, "Forte": 1125}, 1350,
    "Vault of Stars (Epic Dungeon)", "Forest Guardian's Gear", 4, ["Warlock", "Bard"],
    [{"name": "Leader's Awareness", "description": "Gain 1500 Awareness for each player in your team."}])
add("Forest Guardian's Restoration Braces", "Arms", 1500, {"Defense": 1125, "Deflection": 562, "Outgoing Healing": 562}, 1350,
    "Vault of Stars (Epic Dungeon)", "Forest Guardian's Gear", 4, ["Warlock", "Bard"],
    [{"name": "Death Defier's Accuracy", "description": "Gain 500 Accuracy for each enemy you are engaged in battle with. (Max of 15 targets)"}])
add("Forest Guardian's Raid Crown", "Head", 1500, {"Accuracy": 675, "Combat Advantage": 450, "Defense": 1125}, 1350,
    "Vault of Stars (Epic Dungeon)", "Forest Guardian's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Fey Hunter", "description": "+5% Damage in all of Sharandar."}])
add("Forest Guardian's Raid Shoes", "Feet", 1500, {"Combat Advantage": 450, "Critical Strike": 675, "Defense": 1125}, 1350,
    "Vault of Stars (Epic Dungeon)", "Forest Guardian's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Charged Mastery", "description": "When your Stamina is over 75%, your Combat Advantage is increased by 7500."}])
add("Forest Guardian's Raid Armlets", "Arms", 1500, {"Accuracy": 450, "Critical Severity": 673, "Defense": 1125}, 1350,
    "Vault of Stars (Epic Dungeon)", "Forest Guardian's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Death Defier's Accuracy", "description": "Gain 500 Accuracy for each enemy you are engaged in battle with. (Max of 15 targets)"}])

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
