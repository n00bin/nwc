"""Legacy Warlock gear batch 2 (screenshots 220215-220340).

Sets covered:
- Beholder Slayer Tome partner (IL 2050)
- Stormforged set (Northdark Reaches Campaign, IL 2000)
- Blaspheme set (Northdark Reaches Campaign, IL 1900)
- Menzoberranzan Masterwork Gear (Mastered Duergar Mercenary's, IL 1900)
- Enchanted Menzoberranzan Gear (Enchanted Bregan D'aerthe, IL 2050)
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

# Beholder Slayer Tome partner
add("The Weaver's Tome", "Off Hand", 2050, {"Accuracy": 1538, "Combat Advantage": 1538}, 1845,
    "Gromnir's Reliquary (Master)", "Beholder Slayer", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Beholder Slayer", "pieces": 2}])

# Stormforged set
add("Stormforged Pactblade", "Main Hand", 2000, {"Accuracy": 600, "Combat Advantage": 1500, "Critical Severity": 900}, 1800,
    "Northdark Reaches Campaign", "Stormforged", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Stormforged", "pieces": 2,
      "description": "2 of Set: 2% Base Damage Boost, -2% Incoming Damage, or 2% Overall Outgoing Healing depending on role, while in the Underdark. Gain 7.5% Base Damage Boost, -7.5% Incoming Damage, or 7.5% Overall Outgoing Healing on your role, for 15 seconds when you dodge, block, sprint or shadow slip (30 second cooldown). When dealing combat advantage damage, you have a 10% chance to gain 3% Base Damage Boost, -3% Incoming Damage, or 3% Overall Outgoing Healing for 15s (30s cooldown)."}],
    ps={"Damage Bonus": 2.0})
add("Stormforged Tome", "Off Hand", 2000, {"Combat Advantage": 900, "Critical Severity": 1500, "Critical Avoidance": 600}, 1800,
    "Northdark Reaches Campaign", "Stormforged", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Stormforged", "pieces": 2}])

# Blaspheme set
add("Blaspheme Pactblade", "Main Hand", 1900, {"Accuracy": 570, "Combat Advantage": 1425, "Critical Severity": 855}, 1710,
    "Northdark Reaches Campaign", "Blaspheme", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Blaspheme", "pieces": 2,
      "description": "2 of Set: Gain 7500 Power, Defense, or Outgoing Healing, depending on role. Gain 10% Base Damage Boost, -5% Incoming Damage, or 5% Overall Outgoing Healing depending on your role, for 15 seconds when you dodge, block, sprint or shadow slip (30 second cooldown). When dealing combat advantage damage, you have a 10% chance to gain 3% Base Damage Boost, -3% Incoming Damage, or 3% Overall Outgoing Healing for 15s (30s cooldown)."}],
    ps={"Damage Bonus": 1.0})
add("Blaspheme Book", "Off Hand", 1900, {"Combat Advantage": 855, "Critical Severity": 1425, "Critical Avoidance": 570}, 1710,
    "Northdark Reaches Campaign", "Blaspheme", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Blaspheme", "pieces": 2}])

# Menzoberranzan Masterwork Gear (Mastered Duergar Mercenary's) — IL 1900, Warlock/Wizard DPS variants
add("Mastered Duergar Mercenary's Hood", "Head", 1900, {"Accuracy": 1538, "Critical Severity": 1425}, 1710,
    "Menzoberranzan Masterwork Crafting", "Menzoberranzan Masterwork Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Survivor's Strike", "description": "When your health is 50% or more, your Accuracy is increased by 10,000. When your health is below 50%, Recharge Speed is increased by 20%."}])
add("Mastered Duergar Mercenary's Jerkin", "Armor", 1900, {"Combat Advantage": 1425, "Critical Severity": 1425}, 1710,
    "Menzoberranzan Masterwork Crafting", "Menzoberranzan Masterwork Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Survivor's Action", "description": "When your health is 50% or more, your Action Point Gain is increased by 7.5%. When your health is below 50%, Stamina Regeneration is increased by 15%."}])
add("Mastered Duergar Mercenary's Gloves", "Arms", 1900, {"Accuracy": 1425, "Critical Strike": 1425}, 1710,
    "Menzoberranzan Masterwork Crafting", "Menzoberranzan Masterwork Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Survivor's Savagery", "description": "When your health is 50% or more, your Critical Strike is increased by 10,000. When your health is below 50%, Critical Avoidance is increased by 10,000."}])
add("Mastered Duergar Mercenary's Crakows", "Feet", 1900, {"Accuracy": 1425, "Critical Severity": 1425}, 1710,
    "Menzoberranzan Masterwork Crafting", "Menzoberranzan Masterwork Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Survivor's Finesse", "description": "When your health is 50% or more, your Critical Severity is increased by 10,000. When your health is below 50%, Movement Speed is increased by 20%."}])
add("Mastered Duergar Mercenary's Helm", "Head", 1900, {"Accuracy": 1425, "Outgoing Healing": 1425}, 1710,
    "Menzoberranzan Masterwork Crafting", "Menzoberranzan Masterwork Gear", 4, ["Warlock", "Bard"],
    [{"name": "Survivor's Strike", "description": "When your health is 50% or more, your Accuracy is increased by 10,000. When your health is below 50%, Recharge Speed is increased by 20%."}])
add("Mastered Duergar Mercenary's Raiment", "Armor", 1900, {"Forte": 1425, "Incoming Healing": 1425}, 1710,
    "Menzoberranzan Masterwork Crafting", "Menzoberranzan Masterwork Gear", 4, ["Warlock", "Bard"],
    [{"name": "Survivor's Action", "description": "When your health is 50% or more, your Action Point Gain is increased by 7.5%. When your health is below 50%, Stamina Regeneration is increased by 15%."}])
add("Mastered Duergar Mercenary's Armlets", "Arms", 1900, {"Critical Strike": 1425, "Critical Severity": 1425}, 1710,
    "Menzoberranzan Masterwork Crafting", "Menzoberranzan Masterwork Gear", 4, ["Warlock", "Bard"],
    [{"name": "Survivor's Savagery", "description": "When your health is 50% or more, your Critical Strike is increased by 10,000. When your health is below 50%, Critical Avoidance is increased by 10,000."}])
add("Mastered Duergar Mercenary's Boots", "Feet", 1900, {"Critical Avoidance": 1425, "Outgoing Healing": 1425}, 1710,
    "Menzoberranzan Masterwork Crafting", "Menzoberranzan Masterwork Gear", 4, ["Warlock", "Bard"],
    [{"name": "Survivor's Finesse", "description": "When your health is 50% or more, your Critical Strike is increased by 10,000. When your health is below 50%, Movement Speed is increased by 20%."}])

# Enchanted Menzoberranzan Gear (Enchanted Bregan D'aerthe) — IL 2050, Warlock/Wizard or Warlock/Bard
add("Enchanted Bregan D'aerthe Caster's Hood", "Head", 2050, {"Accuracy": 1538, "Critical Strike": 923, "Incoming Healing": 615}, 1845,
    "Demonweb Pits Campaign Store", "Enchanted Menzoberranzan Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Butcher's Frenzy", "description": "When you damage or heal your target for more than 10% of your Maximum Hit Points in a single blow, your Power is increased by 2% and Movement Speed increased by 1.5% for 10 seconds. (Max stack 5)"}])
add("Enchanted Bregan D'aerthe Caster's Robe", "Armor", 2050, {"Combat Advantage": 1538, "Critical Strike": 1538}, 1845,
    "Demonweb Pits Campaign Store", "Enchanted Menzoberranzan Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Shielded Force", "description": "When you have a Shield or Temp HP, your Ranged Powers do 6% more damage."}])
add("Enchanted Bregan D'aerthe Caster's Mitts", "Arms", 2050, {"Critical Strike": 1538, "Defense": 615, "Deflect Severity": 923}, 1845,
    "Demonweb Pits Campaign Store", "Enchanted Menzoberranzan Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Magnified Force", "description": "You have a 20% chance to deal 300 additional magnitude damage to a single target when using ranged powers. This effect may only occur once every 20 seconds."}])
add("Enchanted Bregan D'aerthe Caster's Crakows", "Feet", 2050, {"Combat Advantage": 1538, "Critical Severity": 1538}, 1845,
    "Demonweb Pits Campaign Store", "Enchanted Menzoberranzan Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Discharged Force", "description": "When Action Points are less than 80%, your Critical Severity is increased by 7%."}])
add("Enchanted Bregan D'aerthe Expert's Coif", "Head", 2050, {"Critical Strike": 1538, "Deflect Severity": 1538}, 1845,
    "Demonweb Pits Campaign Store", "Enchanted Menzoberranzan Gear", 4, ["Warlock", "Bard"],
    [{"name": "Mystic Inspiration", "description": "Your Performance/Soulweave/Soul Spark maximum increases by 25%."}])
add("Enchanted Bregan D'aerthe Expert's Cloth", "Armor", 2050, {"Critical Strike": 1538, "Critical Severity": 923, "Critical Avoidance": 615}, 1845,
    "Demonweb Pits Campaign Store", "Enchanted Menzoberranzan Gear", 4, ["Warlock", "Bard"],
    [{"name": "Menacing Aura", "description": "You gain an aura that decreases enemy Defense, Awareness, and Critical Avoidance by 5% for enemies standing within 10ft of you. Multiple of the same aura will not stack."}])
add("Enchanted Bregan D'aerthe Expert's Gloves", "Arms", 2050, {"Defense": 1538, "Outgoing Healing": 1538}, 1845,
    "Demonweb Pits Campaign Store", "Enchanted Menzoberranzan Gear", 4, ["Warlock", "Bard"],
    [{"name": "Medic's Regards", "description": "Whenever you heal your target for more than 10% of your Maximum Hit Points in a single blow, you will immediately be reduced (max 5 targets within 15 ft), and will gain 5% Incoming Healing, Outgoing Healing, and generate less threat for 10 seconds. (20 second cooldown)"}])
add("Enchanted Bregan D'aerthe Expert's Shoes", "Feet", 2050, {"Critical Strike": 1538, "Defense": 923, "Control Resistance": 615}, 1845,
    "Demonweb Pits Campaign Store", "Enchanted Menzoberranzan Gear", 4, ["Warlock", "Bard"],
    [{"name": "Death Defying Medic", "description": "Gain 2000 Outgoing Healing for each enemy you are engaged in battle within 100'. (Max of 10 targets)"}])

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
