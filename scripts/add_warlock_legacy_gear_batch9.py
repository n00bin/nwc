"""Legacy Warlock gear batch 9 — Hellfire Engine + Divine + Lion Guard + Fiend Forged.

Sets covered:
- Hellfire Engine Remains continued (IL 800/1000/1200)
- Hellfire Engine Instruction Manual (Off-Hand) IL 600/800/1000/1200
- Divine Armor (Redeemed Citadel Campaign Store, IL 1230)
- Lion Guard's Armor (Vallenhas Campaign, IL 1250 — Warlock only)
- Infernal Forged Armor / Fiend Forged Gear (IL 1230)
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

# Hellfire Engine Oil Stick (Main Hand) — additional ILs
hf_eb = [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
          "setName": "Hellfire Engine Remains", "pieces": 2}]
add("Hellfire Engine Oil Stick (Rare)", "Main Hand", 800, {"Accuracy": 600, "Critical Severity": 600}, 720,
    "Blood War Campaign Store (Module 19)", "Hellfire Engine Remains", 2, ["Warlock"], hf_eb)
add("Hellfire Engine Oil Stick (Epic)", "Main Hand", 1000, {"Accuracy": 750, "Critical Severity": 750}, 900,
    "Blood War Campaign Store (Module 19)", "Hellfire Engine Remains", 2, ["Warlock"], hf_eb)
add("Hellfire Engine Oil Stick (Legendary)", "Main Hand", 1200, {"Accuracy": 900, "Critical Severity": 900}, 1080,
    "Blood War Campaign Store (Module 19)", "Hellfire Engine Remains", 2, ["Warlock"], hf_eb)

# Hellfire Engine Instruction Manual (Off-Hand)
add("Hellfire Engine Instruction Manual (Uncommon)", "Off Hand", 600, {"Combat Advantage": 450, "Critical Strike": 450}, 540,
    "Blood War Campaign Store (Module 19)", "Hellfire Engine Remains", 2, ["Warlock"], hf_eb)
add("Hellfire Engine Instruction Manual (Rare)", "Off Hand", 800, {"Combat Advantage": 600, "Critical Strike": 600}, 720,
    "Blood War Campaign Store (Module 19)", "Hellfire Engine Remains", 2, ["Warlock"], hf_eb)
add("Hellfire Engine Instruction Manual (Epic)", "Off Hand", 1000, {"Combat Advantage": 750, "Critical Strike": 750}, 900,
    "Blood War Campaign Store (Module 19)", "Hellfire Engine Remains", 2, ["Warlock"], hf_eb)
add("Hellfire Engine Instruction Manual (Legendary)", "Off Hand", 1200, {"Combat Advantage": 900, "Critical Strike": 900}, 1080,
    "Blood War Campaign Store (Module 19)", "Hellfire Engine Remains", 2, ["Warlock"], hf_eb)

# Divine Armor — IL 1230, Redeemed Citadel
add("Divine Restoration Helm", "Head", 1230, {"Critical Strike": 646, "Defense": 922, "Critical Avoidance": 277}, 1107,
    "The Redeemed Citadel Campaign Store", "Divine Armor", 4, ["Warlock", "Bard"],
    [{"name": "Charged Might", "description": "When your Stamina is over 75%, your Power is increased by 5000."}])
add("Divine Raid Hood", "Head", 1230, {"Combat Advantage": 369, "Critical Strike": 554, "Defense": 922}, 1107,
    "The Redeemed Citadel Campaign Store", "Divine Armor", 4, ["Warlock", "Cleric", "Wizard"],
    [{"name": "Charged Might", "description": "When your Stamina is over 75%, your Power is increased by 5000."}])
add("Divine Restoration Cuisses", "Feet", 1230, {"Critical Strike": 461, "Defense": 922, "Critical Avoidance": 461}, 1107,
    "The Redeemed Citadel Campaign Store", "Divine Armor", 4, ["Warlock", "Bard"],
    [{"name": "Death Defier's Might", "description": "Gain 300 Power for each enemy you are engaged in battle. (Max of 15 targets)"}])
add("Divine Raid Shoes", "Feet", 1230, {"Combat Advantage": 369, "Critical Strike": 554, "Defense": 922}, 1107,
    "The Redeemed Citadel Campaign Store", "Divine Armor", 4, ["Warlock", "Cleric", "Wizard"],
    [{"name": "Death Defier's Might", "description": "Gain 300 Power for each enemy you are engaged in battle. (Max of 15 targets)"}])
add("Divine Restoration Surcoat", "Armor", 1230, {"Defense": 922, "Deflection": 922}, 1107,
    "The Redeemed Citadel Campaign Store", "Divine Armor", 4, ["Warlock", "Bard"],
    [{"name": "Critical Remedy", "description": "Whenever you Critically Strike with your Powers, you have a 10% chance to restore 5% of your Maximum Hit Points. This effect may only occur once every 5 seconds."}])
add("Divine Raid Robe", "Armor", 1230, {"Critical Severity": 922, "Defense": 922}, 1107,
    "The Redeemed Citadel Campaign Store", "Divine Armor", 4, ["Warlock", "Cleric", "Wizard"],
    [{"name": "Critical Remedy", "description": "Whenever you Critically Strike with your Powers, you have a 10% chance to restore 5% of your Maximum Hit Points. This effect may only occur once every 5 seconds."}])
add("Divine Restoration Braces", "Arms", 1230, {"Critical Strike": 461, "Defense": 922, "Deflection": 461}, 1107,
    "The Redeemed Citadel Campaign Store", "Divine Armor", 4, ["Warlock", "Bard"],
    [{"name": "Escalating Might", "description": "Gain 250 Power for 10 seconds when you strike an enemy. Lose a stack when you are struck. Max 20 stacks: 5000 Power."}])
add("Divine Raid Armlets", "Arms", 1230, {"Accuracy": 369, "Critical Severity": 554, "Defense": 922}, 1107,
    "The Redeemed Citadel Campaign Store", "Divine Armor", 4, ["Cleric", "Warlock", "Wizard"],
    [{"name": "Escalating Might", "description": "Gain 250 Power for 10 seconds when you strike an enemy. Lose a stack when you are struck. Max 20 stacks: 5000 Power."}])

# Lion Guard's Armor — IL 1250, Vallenhas Campaign, Warlock only
add("Lion Guard's Mystic Cowl", "Head", 1250, {"Critical Strike": 656, "Defense": 938, "Critical Avoidance": 281}, 1125,
    "Vallenhas Campaign Rewards and Store", "Lion Guard's Armor", 4, ["Warlock"],
    [{"name": "Charged Might", "description": "When your Stamina is over 75%, your Power is increased by 5000."}])
add("Lion Guard's Raid Cowl", "Head", 1250, {"Combat Advantage": 375, "Critical Strike": 562, "Defense": 938}, 1125,
    "Vallenhas Campaign Rewards and Store", "Lion Guard's Armor", 4, ["Warlock"],
    [{"name": "Charged Might", "description": "When your Stamina is over 75%, your Power is increased by 5000."}])
add("Lion Guard's Mystic Pigaches", "Feet", 1250, {"Critical Strike": 469, "Defense": 938, "Critical Avoidance": 469}, 1125,
    "Vallenhas Campaign Rewards and Store", "Lion Guard's Armor", 4, ["Warlock"],
    [{"name": "Death Defier's Might", "description": "Gain 300 Power for each enemy you are engaged in battle. (Max of 15 targets)"}])
add("Lion Guard's Raid Pigaches", "Feet", 1250, {"Combat Advantage": 375, "Critical Strike": 562, "Defense": 938}, 1125,
    "Vallenhas Campaign Rewards and Store", "Lion Guard's Armor", 4, ["Warlock"],
    [{"name": "Death Defier's Might", "description": "Gain 300 Power for each enemy you are engaged in battle. (Max of 15 targets)"}])
add("Lion Guard's Mystic Coat", "Armor", 1250, {"Defense": 938, "Deflection": 938}, 1125,
    "Vallenhas Campaign Rewards and Store", "Lion Guard's Armor", 4, ["Warlock"],
    [{"name": "Critical Remedy", "description": "Whenever you Critically Strike with your Powers, you have a 10% chance to restore 5% of your Maximum Hit Points. This effect may only occur once every 5 seconds."}])
add("Lion Guard's Raid Coat", "Armor", 1250, {"Critical Severity": 938, "Defense": 938}, 1125,
    "Vallenhas Campaign Rewards and Store", "Lion Guard's Armor", 4, ["Warlock"],
    [{"name": "Critical Remedy", "description": "Whenever you Critically Strike with your Powers, you have a 10% chance to restore 5% of your Maximum Hit Points. This effect may only occur once every 5 seconds."}])
add("Lion Guard's Mystic Wristguards", "Arms", 1250, {"Accuracy": 375, "Critical Severity": 562, "Defense": 938}, 1125,
    "Vallenhas Campaign Rewards and Store", "Lion Guard's Armor", 4, ["Warlock"],
    [{"name": "Escalating Might", "description": "Gain 250 Power for 10 seconds when you strike an enemy. Lose a stack when you are struck. Max 20 stacks: 5000 Power."}])
add("Lion Guard's Raid Wristguards", "Arms", 1250, {"Critical Strike": 469, "Defense": 938, "Deflection": 469}, 1125,
    "Vallenhas Campaign Rewards and Store", "Lion Guard's Armor", 4, ["Warlock"],
    [{"name": "Escalating Might", "description": "Gain 250 Power for 10 seconds when you strike an enemy. Lose a stack when you are struck. Max 20 stacks: 5000 Power."}])

# Infernal Forged Armor — Fiend Forged Coif
add("Fiend Forged Coif", "Head", 1230, {"Critical Strike": 646, "Defense": 922, "Critical Avoidance": 277}, 1107,
    "The Infernal Citadel (Epic Dungeon)", "Infernal Forged Armor", 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Skirmisher's Might", "description": "Whenever you deal Combat Advantage damage with your powers, you have a 10% chance to gain 5000 Power for 10 seconds. (30 second cooldown)"},
     {"name": "Fiend Hunter", "description": "+1% Damage against Demons, Devils, and Fiends."}])

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
