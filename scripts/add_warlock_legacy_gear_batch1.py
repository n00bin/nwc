"""Legacy Warlock gear batch 1 (screenshots 220025-220136).

Sets covered:
- Cosmic Corsair's Armor (Defense of the Moondancer Master, IL 2700)
- Starforged/Pulsar Armor (Defense of the Moondancer Advanced, IL 2600)
- Astral Raider's Armor (Xaryxian Invasions, IL 2200)
- Lolthian Gear (Seals Store / Module 27 Light of Xarvesh, IL 2050)
- Abyssal Master Gear (Demonweb Pits Master, IL 2475)
- Duergar Weapon Set (IL 1900)
- Beholder Slayer (Gromnir's Reliquary Master, IL 2050)
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

# ---------- Cosmic Corsair's Armor (Defense of the Moondancer Master, IL 2700) ----------
add("Starweave Hood", "Head", 2700, {"Critical Severity": 2025, "Forte": 2025}, 2430,
    "Defense of the Moondancer (Master)", "Cosmic Corsair's Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Maximized Opportunity", "description": "When in combat with only one enemy, your Combat Advantage is increased by 7%."}])
add("Starweave Robe", "Armor", 2700, {"Critical Strike": 2025, "Critical Severity": 2025}, 2430,
    "Defense of the Moondancer (Master)", "Cosmic Corsair's Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Focused Daily", "description": "When you deal damage with a Daily power, your next encounter power will deal 20% more damage. (30 second cooldown)"}])
add("Starweave Sleeves", "Arms", 2700, {"Accuracy": 2025, "Combat Advantage": 2025}, 2430,
    "Defense of the Moondancer (Master)", "Cosmic Corsair's Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Butcher's Zeal", "description": "When you damage or heal your target for more than 15% of your Maximum Hit Points in a single blow, you gain 10 Action Points. Can only occur once every 5 seconds."}])
add("Starweave Slippers", "Feet", 2700, {"Combat Advantage": 2025, "Critical Strike": 2025}, 2430,
    "Defense of the Moondancer (Master)", "Cosmic Corsair's Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Wildspace Hunter", "description": "+5% Damage in Wildspace."}])
add("Starhide Skullcap", "Head", 2700, {"Awareness": 2025, "Outgoing Healing": 2025}, 2430,
    "Defense of the Moondancer (Master)", "Cosmic Corsair's Armor", 4, ["Warlock", "Bard"],
    [{"name": "Death Defying Medic", "description": "Gain 2000 Outgoing Healing for each enemy you are engaged in battle within 100'. (Max of 10 targets)"}])
add("Starhide Doublet", "Armor", 2700, {"Forte": 2025, "Outgoing Healing": 2025}, 2430,
    "Defense of the Moondancer (Master)", "Cosmic Corsair's Armor", 4, ["Warlock", "Bard"],
    [{"name": "Medic's Respite", "description": "Healing an ally with an Encounter power also heals you for 75,000 and grants Allies within 25' +1.5% Awareness for 5s."}])
add("Starhide Cuffs", "Arms", 2700, {"Critical Strike": 2025, "Critical Severity": 2025}, 2430,
    "Defense of the Moondancer (Master)", "Cosmic Corsair's Armor", 4, ["Warlock", "Bard"],
    [{"name": "Mystic Inspiration", "description": "Your Performance/Soulweave/Soul Spark maximum increases by 25%."}])
add("Starhide Cackrows", "Feet", 2700, {"Critical Strike": 2025, "Forte": 2025}, 2430,
    "Defense of the Moondancer (Master)", "Cosmic Corsair's Armor", 4, ["Warlock", "Bard"],
    [{"name": "Divine Muse", "description": "Your Divinity/Performance/Soulweave regenerates 20% faster."}])

# ---------- Pulsar Armor (Defense of the Moondancer Advanced, IL 2600) ----------
add("Pulsar Cap", "Head", 2600, {"Critical Strike": 1950, "Critical Severity": 1170, "Defense": 780}, 2340,
    "Defense of the Moondancer (Advanced)", "Pulsar Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Shielded Force", "description": "When you have a Shield or Temp HP, your Ranged Powers do 7% more damage."}])
add("Pulsar Coat", "Armor", 2600, {"Combat Advantage": 1950, "Critical Strike": 1170, "Forte": 780}, 2340,
    "Defense of the Moondancer (Advanced)", "Pulsar Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Ruthless Might", "description": "When you damage or heal your target for more than 10% of your Maximum Hit Points in a single blow, you gain 1.5% Critical Strike and Critical Severity for 15 seconds. Max 5 stacks: 7.5%."}])
add("Pulsar Sleeves", "Arms", 2600, {"Accuracy": 1950, "Combat Advantage": 1170, "Critical Severity": 780}, 2340,
    "Defense of the Moondancer (Advanced)", "Pulsar Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Escalating Torrent", "description": "Gain 400 Power for 10 seconds when you strike an enemy. Lose a stack when you are struck. Stacks 50 times."}])
add("Pulsar Poulaines", "Feet", 2600, {"Accuracy": 780, "Combat Advantage": 1170, "Critical Severity": 1950}, 2340,
    "Defense of the Moondancer (Advanced)", "Pulsar Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Tenacious Luck", "description": "When in combat with only one enemy, your Critical Strike is increased by 7%."}])
add("Pulsar Boots", "Feet", 2600, {"Critical Strike": 1170, "Critical Severity": 1950, "Outgoing Healing": 780}, 2340,
    "Defense of the Moondancer (Advanced)", "Pulsar Armor", 4, ["Warlock", "Bard"],
    [{"name": "Self Sacrifice", "description": "+5% Outgoing Healing, -5% Awareness."}])
add("Pulsar Armlets", "Arms", 2600, {"Critical Severity": 780, "Awareness": 1950, "Outgoing Healing": 1170}, 2340,
    "Defense of the Moondancer (Advanced)", "Pulsar Armor", 4, ["Warlock", "Bard"],
    [{"name": "Charged Rejuvenation", "description": "Whenever you are healed in combat, you have a 10% chance to gain 5% Recharge Speed for 10 seconds. (20 second cooldown)"}])
add("Pulsar Leathers", "Armor", 2600, {"Critical Strike": 1950, "Forte": 780, "Outgoing Healing": 1170}, 2340,
    "Defense of the Moondancer (Advanced)", "Pulsar Armor", 4, ["Warlock", "Bard"],
    [{"name": "Survivor's Gift", "description": "Your current Hit Points increases your Outgoing Healing by a max of 6%. Currently: 6%."}])
add("Pulsar Coif", "Head", 2600, {"Critical Strike": 1170, "Defense": 780, "Outgoing Healing": 1950}, 2340,
    "Defense of the Moondancer (Advanced)", "Pulsar Armor", 4, ["Warlock", "Bard"],
    [{"name": "Gladiator's Focus", "description": "For every 5 seconds you are in combat, you gain 1% Critical Strike, to the max of 12%."}])

# ---------- Astral Raider's Armor (Xaryxian Invasions, IL 2200) ----------
add("Astral Raider's Cap", "Head", 2200, {"Accuracy": 1320, "Defense": 990, "Control Resistance": 1980}, 1980,
    "Xaryxian Invasions", "Astral Raider's Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Reckless Brutality", "description": "Whenever you deal damage to an enemy, gain a stack of Reckless Brutality, increasing your Power by 2000 but increasing your damage taken by 2% for 5 seconds. (Max 5 stacks)"}])
add("Astral Raider's Coat", "Armor", 2200, {"Critical Strike": 1320, "Defense": 990, "Critical Avoidance": 1980}, 1980,
    "Xaryxian Invasions", "Astral Raider's Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Death Defying Advantage", "description": "Gain 2% Combat Advantage for each enemy you are engaged in battle within 100'. (Max of 10 targets)"}])
add("Astral Raider's Sleeves", "Arms", 2200, {"Critical Severity": 1320, "Defense": 990, "Incoming Healing": 1980}, 1980,
    "Xaryxian Invasions", "Astral Raider's Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Scaled Furor", "description": "Grants up to 20% bonus Damage when your total item level is being scaled down."}])
add("Astral Raider's Poulaines", "Feet", 2200, {"Defense": 990, "Deflection": 1320, "Control Resistance": 990}, 1980,
    "Xaryxian Invasions", "Astral Raider's Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Scaled Disdain", "description": "Grants up to -20% Incoming Damage when your total item level is being scaled down."}])
add("Astral Raider's Coif", "Head", 2200, {"Critical Strike": 1320, "Defense": 990, "Deflect Severity": 990, "Outgoing Healing": 1980}, 1980,
    "Xaryxian Invasions", "Astral Raider's Armor", 4, ["Warlock", "Bard"],
    [{"name": "Healer's Sacrifice", "description": "Increases Overall Outgoing Healing by 5%. Decreases Incoming Healing by 30%."}])
add("Astral Raider's Leathers", "Armor", 2200, {"Critical Severity": 1320, "Defense": 990, "Deflection": 1980}, 1980,
    "Xaryxian Invasions", "Astral Raider's Armor", 4, ["Warlock", "Bard"],
    [{"name": "Death Defying Medic", "description": "Gain 1500 Outgoing Healing for each enemy you are engaged in battle within 100'. (Max of 10 targets)"}])
add("Astral Raider's Armlets", "Arms", 2200, {"Defense": 990, "Deflect Severity": 990, "Outgoing Healing": 1320}, 1980,
    "Xaryxian Invasions", "Astral Raider's Armor", 4, ["Warlock", "Bard"],
    [{"name": "Scaled Furor", "description": "Grants up to 20% bonus Damage when your total item level is being scaled down."}])
add("Astral Raider's Jackboots", "Feet", 2200, {"Defense": 990, "Awareness": 1320, "Incoming Healing": 990}, 1980,
    "Xaryxian Invasions", "Astral Raider's Armor", 4, ["Warlock", "Bard"],
    [{"name": "Scaled Disdain", "description": "Grants up to -20% Incoming Damage when your total item level is being scaled down."}])

# ---------- Lolthian Gear (Seals Store / Module 27 Light of Xarvesh, IL 2050) ----------
add("Lolthian Circlet", "Head", 2050, {"Combat Advantage": 1230, "Defense": 923, "Deflection": 1845}, 1845,
    "Seals Store (Seals of the Spider God)", "Lolthian Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Skirmisher's Might", "description": "Whenever you deal Combat Advantage damage with your powers, you have a 10% chance to gain 7300 Power for 10 seconds. (20 second cooldown)"}])
add("Lolthian Leathers", "Armor", 2050, {"Critical Severity": 1230, "Defense": 923, "Awareness": 1845}, 1845,
    "Seals Store (Seals of the Spider God)", "Lolthian Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Charged Focus", "description": "When Action Points are full, your Critical Severity is increased by 5000."}])
add("Lolthian Sleeves", "Arms", 2050, {"Accuracy": 1538, "Defense": 1538}, 1845,
    "Seals Store (Seals of the Spider God)", "Lolthian Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Executioner's Ferocity", "description": "When you kill an enemy, your Critical Severity increases by 5% for 10 seconds."}])
add("Lolthian Poulaines", "Feet", 2050, {"Combat Advantage": 1230, "Critical Strike": 923, "Defense": 1845}, 1845,
    "Seals Store (Seals of the Spider God)", "Lolthian Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Gladiator's Advantage", "description": "For every 5 seconds you are in combat, you gain 650 Combat Advantage, to the max of 7800."}])
add("Lolthian Coif", "Head", 2050, {"Critical Strike": 1210, "Defense": 923, "Incoming Healing": 1845}, 1845,
    "Seals Store (Seals of the Spider God)", "Lolthian Gear", 4, ["Warlock", "Bard"],
    [{"name": "Skirmisher's Might", "description": "Whenever you deal Combat Advantage damage with your powers, you have a 10% chance to gain 7300 Power for 10 seconds. (20 second cooldown)"}])
add("Lolthian Raiment", "Armor", 2050, {"Critical Severity": 1210, "Defense": 923, "Incoming Healing": 1845}, 1845,
    "Seals Store (Seals of the Spider God)", "Lolthian Gear", 4, ["Warlock", "Bard"],
    [{"name": "This or That", "description": "When not in a party, gain 10,000 Forte. When in a party, gain 10,000 Outgoing Healing."}])
add("Lolthian Cuffs", "Arms", 2050, {"Defense": 1538, "Outgoing Healing": 1538}, 1845,
    "Seals Store (Seals of the Spider God)", "Lolthian Gear", 4, ["Warlock", "Bard"],
    [{"name": "Executioner's Ferocity", "description": "When you kill an enemy, your Critical Severity increases by 5% for 10 seconds."}])
add("Lolthian Cackrows", "Feet", 2050, {"Defense": 923, "Awareness": 1210, "Control Resistance": 923, "Critical Strike": 1845}, 1845,
    "Seals Store (Seals of the Spider God)", "Lolthian Gear", 4, ["Warlock", "Bard"],
    [{"name": "The Ol' Switcheroo", "description": "Trades stat positions; specific behavior varies by build."}])

# ---------- Abyssal Master Gear (Demonweb Pits Master, IL 2475) ----------
add("Perfect Mark of Lolth", "Main Hand", 2475, {"Combat Advantage": 1856, "Critical Strike": 1856}, 2228,
    "The Demonweb Pits (Master)", "Demonweb Empowerment", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Demonweb Empowerment", "pieces": 2,
      "description": "2 of Set: Your Base Damage Boost and Overall Outgoing Healing are increased by 3%. Your incoming damage is reduced by up to 7.5% when your Stamina is empty. At the start of Combat, your Critical Strike and Critical Severity increase by 1%. For every 3 seconds you are in combat, they increase by 1%. (Maximum 5% stacks)."}],
    ps={"Damage Bonus": 2.5})  # +250 Damage flat
add("Perfect Book of Lolth", "Off Hand", 2475, {"Combat Advantage": 1856, "Critical Severity": 1856}, 2228,
    "The Demonweb Pits (Master)", "Demonweb Empowerment", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Demonweb Empowerment", "pieces": 2}])

# ---------- Duergar Weapon Set (IL 1900) ----------
add("Duergar Mercenary's Steel Pactblade", "Main Hand", 1900, {"Critical Strike": 1425, "Critical Severity": 1425}, 1710,
    "Adventures in Thay", "Duergar Weapon Set", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 2,
      "setName": "Duergar Weapon Set", "pieces": 2,
      "description": "2 of Set: +2% Base Damage Boost, +2% Overall Outgoing Healing, -3% Incoming Damage. May stack up to 5 times when allies are equipped with a set of Duergar weapons."}],
    ps={"Damage Bonus": 2.0})  # +200 Damage flat
add("Duergar Mercenary's Steel Book", "Off Hand", 1900, {"Critical Strike": 1425, "Defense": 1423}, 1710,
    "Adventures in Thay", "Duergar Weapon Set", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 2,
      "setName": "Duergar Weapon Set", "pieces": 2}])

# ---------- Beholder Slayer (Gromnir's Reliquary Master, IL 2050) ----------
add("The Weaver's Pactblade", "Main Hand", 2050, {"Critical Severity": 1538, "Forte": 1538}, 1845,
    "Gromnir's Reliquary (Master)", "Beholder Slayer", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Beholder Slayer", "pieces": 2,
      "description": "2 of Set: Deal or heal up to 5% additional damage based on the difference in hit point percentage between the player and the target. DPS +2% Base Damage Boost, Tank -2% Incoming Damage, Healer +2% Overall Outgoing Healing. May stack up to 5 times when allies are equipped with a set of beholder slayer weapons. When in the Underdark, your Damage is increased by 5%."}],
    ps={"Damage Bonus": 2.5})  # +250 Damage flat

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
