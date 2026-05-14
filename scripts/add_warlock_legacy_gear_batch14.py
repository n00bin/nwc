"""Legacy Warlock gear batch 14 — Antiquities continued + Expedition items + Sun Set weapons."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))
max_id = max((i.get('id', 0) for i in data), default=0)

INTAKE = "Legacy Warlock gear collection screenshot intake 2026-05-13."

def add(name, slot, il, rs, cr, source, set_name=None, set_size=None,
        allowed=None, equip=None, ps=None, ab=None, notes=None):
    global max_id
    max_id += 1
    entry = {
        "id": max_id, "name": name, "slot": slot, "item_level": il,
        "ratingStats": rs, "combinedRating": cr,
        "equipBonuses": equip or [], "set": set_name or "",
        "setSize": set_size or 0, "source": source,
        "percentStats": ps or {}, "abilityBonuses": ab or {},
        "notes": notes or INTAKE
    }
    if allowed:
        entry["allowedClasses"] = allowed
    data.append(entry)

# Antiquities of Undermountain — IL 1000, Expeditions
src = "Expeditions (Undermountain)"
sn = "Antiquities of Undermountain"
add("Seer of the Star's Hat", "Head", 1000, {"Accuracy": 375, "Critical Strike": 375, "Defense": 450, "Awareness": 300}, 900, src, sn, 4, ["Warlock", "Wizard"],
    [{"name": "Executioner's Zeal", "description": "When you kill an enemy, you gain 1% Action Points."}])
add("Mage of the Maze's Hat", "Head", 1000, {"Accuracy": 375, "Combat Advantage": 375, "Defense": 450, "Awareness": 300}, 900, src, sn, 4, ["Warlock", "Wizard"],
    [{"name": "Executioner's Guard", "description": "When you kill an enemy, your Defense increases by 5% for 10 seconds. (30 second cooldown)"}])
add("Tempter of the Twilight's Gaiters", "Feet", 1000, {"Combat Advantage": 300, "Critical Severity": 450, "Defense": 450, "Awareness": 300}, 900, src, sn, 4, ["Warlock", "Wizard"],
    [{"name": "Death Defier's Haste", "description": "Gain 2.5% Movement Speed for each enemy you are engaged in battle. (Max of 12%)"}])
add("Seer of the Star's Gaiters", "Feet", 1000, {"Combat Advantage": 375, "Critical Strike": 375, "Defense": 450, "Awareness": 300}, 900, src, sn, 4, ["Warlock", "Wizard"],
    [{"name": "Death Defier's Might", "description": "Gain 250 Power for each enemy you are engaged in battle. (Max of 15 targets)"}])
add("Tempter of the Twilight's Gloves", "Arms", 1000, {"Critical Strike": 375, "Critical Severity": 375, "Defense": 450, "Awareness": 300}, 900, src, sn, 4, ["Warlock", "Wizard"],
    [{"name": "Encounter Perk", "description": "Your Encounter Powers do 3% more damage."}])
add("Mage of the Maze's Robes", "Armor", 1000, {"Combat Advantage": 375, "Critical Severity": 375, "Defense": 450, "Awareness": 300}, 900, src, sn, 4, ["Warlock", "Wizard"],
    [{"name": "Butcher's Remedy", "description": "When you damage or heal your target for more than 15% of your Maximum Hit Points in a single blow, you gain 3% of your health back."}])
add("Seer of the Star's Robes", "Armor", 1000, {"Critical Strike": 375, "Critical Severity": 375, "Defense": 450, "Awareness": 300}, 900, src, sn, 4, ["Warlock", "Wizard"],
    [{"name": "Butcher's Might", "description": "When you damage or heal your target for more than 15% of your Maximum Hit Points in a single blow, you gain 1% Power for 10 seconds. (Max stack 5)"}])
add("Tempter of the Twilight's Robes", "Armor", 1000, {"Critical Severity": 750, "Defense": 450, "Awareness": 300}, 900, src, sn, 4, ["Warlock", "Wizard"],
    [{"name": "Butcher's Tenacity", "description": "When you damage or heal your target for more than 15% of your Maximum Hit Points in a single blow, you gain 1% Critical Severity for 10 seconds. (Max stack 5)"}])
add("Mage of the Maze's Gaiters", "Feet", 1000, {"Combat Advantage": 750, "Defense": 450, "Awareness": 300}, 900, src, sn, 4, ["Warlock", "Wizard"],
    [{"name": "Death Defier's Focus", "description": "Gain 200 Critical Strike for each enemy you are engaged in battle. (Max of 15 targets)"}])
add("Seer of the Star's Gloves", "Arms", 1000, {"Critical Strike": 750, "Defense": 450, "Awareness": 300}, 900, src, sn, 4, ["Warlock", "Wizard"],
    [{"name": "At-Will Perk", "description": "Your At-Will Powers do 3% more damage."}])
add("Mage of the Maze's Gloves", "Arms", 1000, {"Combat Advantage": 375, "Critical Strike": 375, "Defense": 450, "Awareness": 300}, 900, src, sn, 4, ["Warlock", "Wizard"],
    [{"name": "Bulwark's Shield", "description": "You take 3% less damage from Ranged attacks."}])

# Expedition reward items (mixed sets)
add("Crash Guards", "Arms", 950, {"Critical Strike": 285, "Critical Severity": 428, "Defense": 712}, 855,
    "Expeditions (Undermountain)", "Expedition Rewards", 0, ["Warlock", "Wizard", "Bard"],
    [{"name": "Leader's Might", "description": "Gain 250 Power for each player in your team."}])
add("Curtunk's Furry Sleeves", "Arms", 1000, {"Defense": 750, "Critical Avoidance": 300, "Deflection": 450}, 900,
    "Expeditions (Undermountain)", "Expedition Rewards", 0, ["Warlock", "Wizard"],
    [{"name": "Challenger's Guard", "description": "When in combat with only one enemy, your Defense and Deflect is increased by 1000."}])
add("Moldy Apprentice Braces", "Arms", 950, {"Accuracy": 428, "Defense": 712, "Awareness": 285}, 855,
    "Expeditions (Undermountain)", "Expedition Rewards", 0, ["Warlock", "Wizard"],
    [{"name": "The Ol' Switcharoo", "description": "+1500 Critical Severity, -2500 Defense."}])
add("Glistening Scales", "Armor", 950, {"Combat Advantage": 356, "Defense": 712, "Deflection": 356}, 855,
    "Expeditions (Undermountain)", "Expedition Rewards", 0, ["Warlock", "Bard"],
    [{"name": "Victim's Parry", "description": "When you are hit at 25% health or lower, your Deflect increases 15% for 5 seconds. If you have less than 30000 Deflect, you will gain 7500 for 5 seconds instead. (15 second cooldown)"}])
add("Barkhide", "Armor", 1000, {"Defense": 750, "Awareness": 375, "Critical Avoidance": 375}, 900,
    "Expeditions (Undermountain)", "Expedition Rewards", 0, ["Warlock", "Wizard"],
    [{"name": "Warden's Defiance", "description": "Whenever you are damaged for more than 15% of your Maximum Hit Points in a single blow, you will take 3% less damage for 10 seconds. Cooldown 30 seconds."}])
add("Thief's Stolen Gloves", "Arms", 950, {"Accuracy": 428, "Critical Strike": 285, "Defense": 712}, 855,
    "Expeditions (Undermountain)", "Expedition Rewards", 0, ["Warlock", "Wizard"],
    [{"name": "Golden Steal", "description": "Your attacks have a chance to cause extra damage, but at a financial cost."}])
add("Slimy Bracers of the Kuo-Toa", "Arms", 1000, {"Combat Advantage": 450, "Defense": 750, "Critical Avoidance": 300}, 900,
    "Expeditions (Undermountain)", "Expedition Rewards", 0, ["Warlock", "Wizard"],
    [{"name": "Sniper's Advantage", "description": "When you are 50' or further away from your target, your Combat Advantage is increased by 1,500."}])
add("Quark's Rock Gauntlets", "Arms", 950, {"Defense": 712, "Critical Avoidance": 285, "Deflection": 428}, 855,
    "Expeditions (Undermountain)", "Expedition Rewards", 0, ["Warlock", "Wizard"],
    [{"name": "Leader's Guard", "description": "Gain 250 Defense for each player in your team."}])
add("Gurdunn's Defense", "Armor", 950, {"Accuracy": 356, "Critical Severity": 356, "Defense": 712}, 855,
    "Expeditions (Undermountain)", "Expedition Rewards", 0, ["Warlock", "Wizard"],
    [{"name": "The Ol' Switcharoo", "description": "+1500 Power, -2500 Defense."}])

# Sun Set — Sunset Pact Blade (Main Hand) + Sunset Grimoire (Off-Hand) — Module 14 Ravenloft PvP
sun_eb = [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
           "setName": "Sun Set", "pieces": 2,
           "description": "2 of Set: Your Base Damage Boost and Overall Outgoing Healing are increased by 5%. While in Barovia, your Damage Resistance and Movement Speed are also increased by 5%. While in Barovia during nightfall, your Base Damage Boost, Damage Resistance, Overall Outgoing Healing, and Movement Speed are increased by 10%."}]
add("Sunset Pact Blade (Uncommon)", "Main Hand", 350, {"Accuracy": 131, "Combat Advantage": 262, "Critical Strike": 131}, 315,
    "Barovia / Module 14 Ravenloft", "Sun Set", 2, ["Warlock"], sun_eb)
add("Sunset Pact Blade (Rare)", "Main Hand", 500, {"Accuracy": 188, "Combat Advantage": 375, "Critical Strike": 188}, 450,
    "Barovia / Module 14 Ravenloft", "Sun Set", 2, ["Warlock"], sun_eb)
add("Sunset Pact Blade (Epic)", "Main Hand", 650, {"Accuracy": 244, "Combat Advantage": 488, "Critical Strike": 244}, 585,
    "Barovia / Module 14 Ravenloft", "Sun Set", 2, ["Warlock"], sun_eb)
add("Sunset Pact Blade (Legendary)", "Main Hand", 800, {"Accuracy": 300, "Combat Advantage": 600, "Critical Strike": 300}, 720,
    "Barovia / Module 14 Ravenloft", "Sun Set", 2, ["Warlock"], sun_eb)
add("Sunset Grimoire (Uncommon)", "Off Hand", 350, {"Accuracy": 131, "Combat Advantage": 262, "Critical Strike": 131}, 315,
    "Barovia / Module 14 Ravenloft", "Sun Set", 2, ["Warlock"], sun_eb)
add("Sunset Grimoire (Rare)", "Off Hand", 500, {"Accuracy": 188, "Combat Advantage": 375, "Critical Strike": 188}, 450,
    "Barovia / Module 14 Ravenloft", "Sun Set", 2, ["Warlock"], sun_eb)
add("Sunset Grimoire (Epic)", "Off Hand", 650, {"Accuracy": 244, "Combat Advantage": 488, "Critical Strike": 244}, 585,
    "Barovia / Module 14 Ravenloft", "Sun Set", 2, ["Warlock"], sun_eb)
add("Sunset Grimoire (Legendary)", "Off Hand", 800, {"Accuracy": 300, "Combat Advantage": 600, "Critical Strike": 300}, 720,
    "Barovia / Module 14 Ravenloft", "Sun Set", 2, ["Warlock"], sun_eb)

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
