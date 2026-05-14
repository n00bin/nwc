"""Legacy Warlock gear batch 3 (screenshots 220344-220433).

Sets covered:
- Bregan D'aerthe (Menzoberranzan Campaign Store, IL 2000) — base version w/ Wizard/Bard variants
- Exalted Dark Maiden's Gear (Menzoberranzan Campaign Store, IL 2050) — Wizard (Raid) and Bard (Rejuvenation) variants
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

# Bregan D'aerthe (base) — IL 2000
add("Bregan D'aerthe Caster's Hood", "Head", 2000, {"Accuracy": 1500, "Critical Strike": 900, "Incoming Healing": 600}, 1800,
    "Menzoberranzan Campaign Store", "Bregan D'aerthe Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Butcher's Frenzy", "description": "When you damage or heal your target for more than 10% of your Maximum Hit Points in a single blow, your Power is increased by 1.5% and Movement Speed increased by 1% for 10 seconds. (Max stack 5)"}])
add("Bregan D'aerthe Caster's Robe", "Armor", 2000, {"Combat Advantage": 1500, "Critical Severity": 1500}, 1800,
    "Menzoberranzan Campaign Store", "Bregan D'aerthe Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Shielded Force", "description": "When you have a Shield or Temp HP, your Ranged Powers do 7% more damage."}])
add("Bregan D'aerthe Caster's Mitts", "Arms", 2000, {"Critical Strike": 1500, "Defense": 600, "Deflect Severity": 900}, 1800,
    "Menzoberranzan Campaign Store", "Bregan D'aerthe Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Magnified Force", "description": "You have a 10% chance to deal 250 additional magnitude damage to a single target when using ranged attacks. (20 second cooldown)"}])
add("Bregan D'aerthe Caster's Crakows", "Feet", 2000, {"Combat Advantage": 1500, "Critical Severity": 1500}, 1800,
    "Menzoberranzan Campaign Store", "Bregan D'aerthe Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Discharged Force", "description": "When Action Points are less than 80%, your Critical Severity is increased by 6%."}])
add("Bregan D'aerthe Expert's Coif", "Head", 2000, {"Critical Strike": 1500, "Deflect Severity": 1500}, 1800,
    "Menzoberranzan Campaign Store", "Bregan D'aerthe Gear", 4, ["Warlock", "Bard"],
    [{"name": "Mystic Inspiration", "description": "Your Performance/Soulweave/Soul Spark maximum increases by 15%."}])
add("Bregan D'aerthe Expert's Cloth", "Armor", 2000, {"Critical Strike": 1500, "Critical Severity": 900, "Critical Avoidance": 600}, 1800,
    "Menzoberranzan Campaign Store", "Bregan D'aerthe Gear", 4, ["Warlock", "Bard"],
    [{"name": "Menacing Aura", "description": "You gain an aura that decreases enemy Defense, Awareness, and Critical Avoidance by 3.5% for enemies standing within 10ft of you. Multiple of the same aura will not stack."}])
add("Bregan D'aerthe Expert's Gloves", "Arms", 2000, {"Defense": 1500, "Outgoing Healing": 1500}, 1800,
    "Menzoberranzan Campaign Store", "Bregan D'aerthe Gear", 4, ["Warlock", "Bard"],
    [{"name": "Medic's Regards", "description": "Whenever you heal your target for more than 10% of your Maximum Hit Points in a single blow, you will immediately be reduced (max 5 targets within 15 ft), and will gain 3% Incoming Healing, Outgoing Healing, and generate less threat for 10 seconds. (20 second cooldown)"}])
add("Bregan D'aerthe Expert's Shoes", "Feet", 2000, {"Critical Strike": 900, "Defense": 600, "Control Resistance": 1800}, 1800,
    "Menzoberranzan Campaign Store", "Bregan D'aerthe Gear", 4, ["Warlock", "Bard"],
    [{"name": "Death Defying Medic", "description": "Gain 1500 Outgoing Healing for each enemy you are engaged in battle within 100'. (Max of 10 targets)"}])

# Exalted Dark Maiden's Gear — IL 2050
add("Exalted Maiden's Raid Mask", "Head", 2050, {"Combat Advantage": 923, "Critical Severity": 1210, "Defense": 923}, 1845,
    "Menzoberranzan Campaign Store", "Exalted Dark Maiden's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Executioner's Zeal", "description": "When you kill an enemy, you gain 3% Action Points."}])
add("Exalted Maiden's Raid Coat", "Armor", 2050, {"Combat Advantage": 1518, "Defense": 1518}, 1845,
    "Menzoberranzan Campaign Store", "Exalted Dark Maiden's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Maiden's Blade", "description": "You do 6% more damage to enemies that are not facing you. This bonus doubles in the Underdark."}])
add("Exalted Maiden's Raid Wristguards", "Arms", 2050, {"Critical Strike": 1538, "Defense": 1538}, 1845,
    "Menzoberranzan Campaign Store", "Exalted Dark Maiden's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Critical Force", "description": "Whenever you Critically Strike with your Powers, you have a 15% chance to deal 175 magnitude damage around you. (15 second cooldown)"}])
add("Exalted Maiden's Raid Longboots", "Feet", 2050, {"Critical Strike": 1230, "Critical Severity": 923, "Defense": 923}, 1845,
    "Menzoberranzan Campaign Store", "Exalted Dark Maiden's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Spider's Bane", "description": "Gain 5,000 Power and gain more role effectiveness when in the Temple of the Spider. DPS +6% Base Damage Boost, Tank -6% Incoming Damage, Healer +6% Overall Outgoing Healing."}])
add("Exalted Maiden's Rejuvenation Hood", "Head", 2050, {"Critical Strike": 1518, "Defense": 1518}, 1845,
    "Menzoberranzan Campaign Store", "Exalted Dark Maiden's Gear", 4, ["Warlock", "Bard"],
    [{"name": "Divine Muse", "description": "Your Divinity/Performance/Soulweave regenerates 20% faster."}])
add("Exalted Maiden's Rejuvenation Raiment", "Armor", 2050, {"Critical Strike": 1230, "Defense": 923, "Outgoing Healing": 923}, 1845,
    "Menzoberranzan Campaign Store", "Exalted Dark Maiden's Gear", 4, ["Warlock", "Bard"],
    [{"name": "Maiden's Blade", "description": "You do 6% more damage to enemies that are not facing you. This bonus doubles in the Underdark."}])
add("Exalted Maiden's Rejuvenation Mitts", "Arms", 2050, {"Critical Strike": 1538, "Defense": 1538, "Outgoing Healing": 0}, 1845,
    "Menzoberranzan Campaign Store", "Exalted Dark Maiden's Gear", 4, ["Warlock", "Bard"],
    [{"name": "Critical Force", "description": "Whenever you Critically Strike with your Powers, you have a 15% chance to deal 175 magnitude damage around you. (15 second cooldown)"}])
add("Exalted Maiden's Rejuvenation Steps", "Feet", 2050, {"Defense": 923, "Deflect Severity": 923, "Forte": 1230}, 1845,
    "Menzoberranzan Campaign Store", "Exalted Dark Maiden's Gear", 4, ["Warlock", "Bard"],
    [{"name": "Spider's Bane", "description": "Gain 5,000 Power and gain more role effectiveness when in the Temple of the Spider. DPS +6% Base Damage Boost, Tank -6% Incoming Damage, Healer +6% Overall Outgoing Healing."}])

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
