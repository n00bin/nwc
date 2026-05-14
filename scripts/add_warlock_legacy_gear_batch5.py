"""Legacy Warlock gear batch 5 — Dragonbone Vale (Scalebreaker, Vale weapons).

Sets covered:
- Weapons of the Vale: Durgarn Thord (Scalebreaker's Wrath IL 1850), Antique Vale (IL 1700), Fortified Vale (IL 1800)
- Crimson Scalebreaker's Gear (Dragonbone Vale Campaign Store, IL 1800)
- Ancient Scalebreaker's Gear (Dragonbone Vale Seals Store, IL 1700)
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

# Durgarn Thord (Scalebreaker's Wrath) — IL 1850
add("Durgarn Thord Pactblade", "Main Hand", 1850, {"Critical Severity": 1388, "Forte": 1388}, 1665,
    "The Crown of Keldegonn (Dragonbone Vale)", "Scalebreaker's Wrath", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Scalebreaker's Wrath", "pieces": 2,
      "description": "2 of Set: When you use an encounter or daily power during combat, you gain a stack of Scalebreaker's for 20 seconds. Each stack of Scalebreaker's grants you bonuses depending on your role. DPS +1% Recharge Speed and Action Point Gain, Tank +1% Stamina Regeneration and Action Point Gain, Healer +1% Movement Speed and Action Point Gain. Once you reach 6 stacks of Scalebreaker's, they are consumed and you are empowered with Scalebreaker's Wrath for 30 seconds, granting the following: DPS +7.5% Base Damage Boost, Tank -7.5% Incoming Damage, Healer +7.5% Overall Outgoing Healing. May only have 1 active at a time and the duration is refreshed each time you reach 6 stacks of Scalebreaker's."}])
add("Durgarn Thord Tome", "Off Hand", 1850, {"Accuracy": 1388, "Combat Advantage": 1388}, 1665,
    "The Crown of Keldegonn (Dragonbone Vale)", "Scalebreaker's Wrath", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Scalebreaker's Wrath", "pieces": 2}])

# Antique Pactblade/Book of the Vale — IL 1700
add("Antique Pactblade of the Vale", "Main Hand", 1700, {"Combat Advantage": 1275, "Critical Severity": 1275}, 1530,
    "Sharandar (Dragonbone Vale)", "Vale", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Vale", "pieces": 2,
      "description": "2 of Set (Adventurer's Might): When you use an encounter power, you have a 10% chance to receive a Boost based on your role by 4% for 10 seconds. DPS Recharge Speed, Tank Stamina Regeneration, Healer Action Point Gain."}])
add("Antique Book of the Vale", "Off Hand", 1700, {"Combat Advantage": 1275, "Critical Severity": 1275}, 1530,
    "Sharandar (Dragonbone Vale)", "Vale", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Vale", "pieces": 2}])

# Fortified Pactblade/Book of the Vale — IL 1800
add("Fortified Pactblade of the Vale", "Main Hand", 1800, {"Combat Advantage": 1350, "Critical Severity": 1350}, 1620,
    "Sharandar (Dragonbone Vale)", "Fortified Vale", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Fortified Vale", "pieces": 2,
      "description": "2 of Set (Adventurer's Might): DPS +5% Outgoing Healing, Tank +5% Outgoing Healing, Healer +5% Outgoing Healing. When you use an encounter power, you have a 15% chance to receive a Boost based on your role by 7.5% for 10 seconds. DPS Recharge Speed, Tank Stamina Regeneration, Healer Action Point Gain."}])
add("Fortified Book of the Vale", "Off Hand", 1800, {"Combat Advantage": 1350, "Critical Severity": 1350}, 1620,
    "Sharandar (Dragonbone Vale)", "Fortified Vale", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Fortified Vale", "pieces": 2}])

# Crimson Scalebreaker's Gear — IL 1800
add("Crimson Scalebreaker's Raid Hood", "Head", 1800, {"Accuracy": 810, "Combat Advantage": 1080, "Defense": 810}, 1620,
    "Dragonbone Vale Campaign Store", "Crimson Scalebreaker's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Executioner's Ferocity", "description": "When you kill an enemy, your Critical Severity increases by 5% for 10 seconds."}])
add("Crimson Scalebreaker's Raid Leathers", "Armor", 1800, {"Combat Advantage": 1080, "Defense": 810, "Awareness": 810}, 1620,
    "Dragonbone Vale Campaign Store", "Crimson Scalebreaker's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Skirmisher's Versatility", "description": "Whenever you deal Combat Advantage damage with your powers, you have a 10% chance to increase one of the following stats by 8% for 10 seconds: Accuracy, Combat Advantage, Critical Avoidance, or Deflect Severity. (30 second cooldown)"}])
add("Crimson Scalebreaker's Raid Sleeves", "Arms", 1800, {"Critical Strike": 1080, "Defense": 810, "Forte": 810}, 1620,
    "Dragonbone Vale Campaign Store", "Crimson Scalebreaker's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Herald's Cunning", "description": "When you have no teammates within 30' of you, your Stamina Regeneration and Control Resistance is increased by 5%."}])
add("Crimson Scalebreaker's Raid Poulaines", "Feet", 1800, {"Defense": 810, "Critical Avoidance": 810, "Control Bonus": 1080}, 1620,
    "Dragonbone Vale Campaign Store", "Crimson Scalebreaker's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Renegade's Footwork", "description": "Whenever you Deflect an attack, gain 1% Movement Speed and Recharge Speed for 10 seconds. Max 5 stacks: 5% Movement Speed and Recharge Speed."}])
add("Crimson Scalebreaker's Rejuvenation Coif", "Head", 1800, {"Critical Strike": 1080, "Defense": 810, "Control Bonus": 810}, 1620,
    "Dragonbone Vale Campaign Store", "Crimson Scalebreaker's Gear", 4, ["Warlock", "Bard"],
    [{"name": "Executioner's Ferocity", "description": "When you kill an enemy, your Critical Severity increases by 5% for 10 seconds."}])
add("Crimson Scalebreaker's Rejuvenation Raiment", "Armor", 1800, {"Critical Strike": 810, "Defense": 810, "Outgoing Healing": 1080}, 1620,
    "Dragonbone Vale Campaign Store", "Crimson Scalebreaker's Gear", 4, ["Warlock", "Bard"],
    [{"name": "Skirmisher's Versatility", "description": "Whenever you deal Combat Advantage damage with your powers, you have a 10% chance to increase one of the following stats by 8% for 10 seconds: Accuracy, Combat Advantage, Critical Avoidance, or Deflect Severity. (30 second cooldown)"}])
add("Crimson Scalebreaker's Rejuvenation Cuffs", "Arms", 1800, {"Critical Severity": 1080, "Defense": 810, "Forte": 810}, 1620,
    "Dragonbone Vale Campaign Store", "Crimson Scalebreaker's Gear", 4, ["Warlock", "Bard"],
    [{"name": "Herald's Cunning", "description": "When you have no teammates within 30' of you, your Stamina Regeneration and Control Resistance is increased by 5%."}])
add("Crimson Scalebreaker's Rejuvenation Crakows", "Feet", 1800, {"Defense": 810, "Awareness": 1080, "Forte": 810}, 1620,
    "Dragonbone Vale Campaign Store", "Crimson Scalebreaker's Gear", 4, ["Warlock", "Bard"],
    [{"name": "Renegade's Footwork", "description": "Whenever you Deflect an attack, gain 1% Movement Speed and Recharge Speed for 10 seconds. Max 5 stacks: 5% Movement Speed and Recharge Speed."}])

# Ancient Scalebreaker's Gear — IL 1700 (Seals Store)
add("Ancient Scalebreaker's Hood", "Head", 1700, {"Accuracy": 765, "Critical Strike": 1020, "Defense": 765}, 1530,
    "Dragonbone Vale Seals Store", "Ancient Scalebreaker's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Executioner's Ferocity", "description": "When you kill an enemy, your Critical Severity increases by 5% for 10 seconds."}])
add("Ancient Scalebreaker's Leathers", "Armor", 1700, {"Combat Advantage": 1020, "Defense": 765, "Awareness": 765}, 1530,
    "Dragonbone Vale Seals Store", "Ancient Scalebreaker's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Skirmisher's Versatility", "description": "Whenever you deal Combat Advantage damage with your powers, you have a 10% chance to increase one of the following stats by 8% for 10 seconds: Accuracy, Combat Advantage, Critical Avoidance, or Deflect Severity. (30 second cooldown)"}])
add("Ancient Scalebreaker's Cuffs", "Arms", 1700, {"Critical Severity": 1020, "Defense": 765}, 1530,
    "Dragonbone Vale Seals Store", "Ancient Scalebreaker's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Herald's Cunning", "description": "When you have no teammates within 30' of you, your Stamina Regeneration and Control Resistance is increased by 5%."}])
add("Ancient Scalebreaker's Crakows", "Feet", 1700, {"Defense": 765, "Awareness": 1020, "Critical Avoidance": 765}, 1530,
    "Dragonbone Vale Seals Store", "Ancient Scalebreaker's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Renegade's Footwork", "description": "Whenever you Deflect an attack, gain 1% Movement Speed and Recharge Speed for 10 seconds. Max 5 stacks: 5% Movement Speed and Recharge Speed."}])
add("Ancient Scalebreaker's Coif", "Head", 1700, {"Critical Strike": 1020, "Defense": 765, "Control Bonus": 765}, 1530,
    "Dragonbone Vale Seals Store", "Ancient Scalebreaker's Gear", 4, ["Warlock", "Bard"],
    [{"name": "Executioner's Ferocity", "description": "When you kill an enemy, your Critical Severity increases by 5% for 10 seconds."}])
add("Ancient Scalebreaker's Raiment", "Armor", 1700, {"Critical Strike": 765, "Defense": 765, "Outgoing Healing": 1020}, 1530,
    "Dragonbone Vale Seals Store", "Ancient Scalebreaker's Gear", 4, ["Warlock", "Bard"],
    [{"name": "Skirmisher's Versatility", "description": "Whenever you deal Combat Advantage damage with your powers, you have a 10% chance to increase one of the following stats by 8% for 10 seconds: Accuracy, Combat Advantage, Critical Avoidance, or Deflect Severity. (30 second cooldown)"}])
add("Ancient Scalebreaker's Poulaines", "Feet", 1700, {"Defense": 765, "Critical Avoidance": 765, "Control Bonus": 1020}, 1530,
    "Dragonbone Vale Seals Store", "Ancient Scalebreaker's Gear", 4, ["Warlock", "Bard"],
    [{"name": "Renegade's Footwork", "description": "Whenever you Deflect an attack, gain 1% Movement Speed and Recharge Speed for 10 seconds. Max 5 stacks: 5% Movement Speed and Recharge Speed."}])

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
