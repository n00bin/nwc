"""Legacy Warlock gear batch 8 — Crone's continued + PvP weapon sets (Avernus Module 19).

Sets covered:
- The Crone's Gear remaining pieces (IL 1225)
- Blessed Blade (Redeemed Citadel campaign, IL 650-1400, PvP)
- Celestial (Trial: Zariel's Challenge, IL 650-1400, PvP)
- Devil's Legion (Avernus Adventure Zone, IL 600-1200, PvP)
- Hellfire Engine Remains (Blood War Campaign, IL 600+)
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

# Crone's continued
add("Crone's Wristguard", "Arms", 1225, {"Accuracy": 368, "Critical Severity": 551, "Defense": 919}, 1102,
    "Sharandar Seals Store", "Crone's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Survivor's Might", "description": "Gain 45 Power for each percent of health you are missing."}])
add("Crone's Braces", "Arms", 1225, {"Defense": 919, "Deflection": 459, "Outgoing Healing": 459}, 1102,
    "Sharandar Seals Store", "Crone's Gear", 4, ["Warlock", "Bard", "Paladin", "Cleric"],
    [{"name": "Survivor's Might", "description": "Gain 45 Power for each percent of health you are missing."}])
add("Crone's Robe", "Armor", 1225, {"Accuracy": 919, "Defense": 919}, 1102,
    "Sharandar Seals Store", "Crone's Gear", 4, ["Warlock", "Wizard"],
    [{"name": "Survivor's Remedy", "description": "Whenever you Deflect an attack, you have a 10% chance to restore 5% of your Maximum Hit Points. This effect may only occur once every 5 seconds."}])

# Blessed Blade — Pactsealer of the Blessed Blade (Main Hand) at multiple ILs
def add_blessed_blade(il, accuracy, crit_sev, cr, rarity_label):
    add(f"Pactsealer of the Blessed Blade", "Main Hand", il,
        {"Accuracy": accuracy, "Critical Severity": crit_sev}, cr,
        "The Redeemed Citadel (Module 19)", "Blessed Blade", 2, ["Warlock"],
        [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
          "setName": "Blessed Blade", "pieces": 2,
          "description": "2 of Set: When you use an encounter power during combat, you gain a stack of Blessed (max 5). Each stack of Blessed increases your Power, Accuracy, Combat Advantage by 3% and grants you a random buff for 10 seconds, granting the following: Blessed Guidance increases your Critical Strike by 5%, Blessed Might increases your Action Point Gain Speed by 7.5%, Blessed Fury increases your Overall Outgoing Healing by 7.5%."}],
        notes=f"PvP artifact weapon. Module 19 Redeemed Citadel. {rarity_label}. " + INTAKE)
# Avoid duplicate names by skipping multi-IL — instead use unique IL identifiers in name suffix
del add_blessed_blade

# Use distinct entries per IL (collection shows 4 tiers)
add("Pactsealer of the Blessed Blade (Uncommon)", "Main Hand", 650,
    {"Accuracy": 488, "Critical Severity": 488}, 585,
    "The Redeemed Citadel (Module 19)", "Blessed Blade", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Blessed Blade", "pieces": 2,
      "description": "2 of Set: Encounter use grants Blessed stack (max 5): +3% Power/Accuracy/Combat Advantage + random buff (Blessed Guidance +5% Critical Strike, Blessed Might +7.5% AP Gain, Blessed Fury +7.5% Overall Outgoing Healing) for 10s."}])
add("Pactsealer of the Blessed Blade (Rare)", "Main Hand", 900,
    {"Accuracy": 675, "Critical Severity": 675}, 810,
    "The Redeemed Citadel (Module 19)", "Blessed Blade", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Blessed Blade", "pieces": 2}])
add("Pactsealer of the Blessed Blade (Epic)", "Main Hand", 1150,
    {"Accuracy": 862, "Critical Severity": 862}, 1035,
    "The Redeemed Citadel (Module 19)", "Blessed Blade", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Blessed Blade", "pieces": 2}])
add("Pactsealer of the Blessed Blade (Legendary)", "Main Hand", 1400,
    {"Accuracy": 1050, "Critical Severity": 1050}, 1260,
    "The Redeemed Citadel (Module 19)", "Blessed Blade", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Blessed Blade", "pieces": 2}])

# Revered Word of the Blessed Blade (Off-Hand grimoire) — 4 IL tiers
add("Revered Word of the Blessed Blade (Uncommon)", "Off Hand", 650,
    {"Combat Advantage": 488, "Critical Strike": 488}, 585,
    "The Redeemed Citadel (Module 19)", "Blessed Blade", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Blessed Blade", "pieces": 2}])
add("Revered Word of the Blessed Blade (Rare)", "Off Hand", 900,
    {"Combat Advantage": 675, "Critical Strike": 675}, 810,
    "The Redeemed Citadel (Module 19)", "Blessed Blade", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Blessed Blade", "pieces": 2}])
add("Revered Word of the Blessed Blade (Epic)", "Off Hand", 1150,
    {"Combat Advantage": 862, "Critical Strike": 862}, 1035,
    "The Redeemed Citadel (Module 19)", "Blessed Blade", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Blessed Blade", "pieces": 2}])
add("Revered Word of the Blessed Blade (Legendary)", "Off Hand", 1400,
    {"Combat Advantage": 1050, "Critical Strike": 1050}, 1260,
    "The Redeemed Citadel (Module 19)", "Blessed Blade", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Blessed Blade", "pieces": 2}])

# Celestial Lancet of Honor (Main Hand) and Celestial Words of Hope (Off-Hand) — Celestial set
celestial_eb = [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
                 "setName": "Celestial", "pieces": 2,
                 "description": "2 of Set: When you use an encounter or daily power during combat, you gain a stack of Divine Charge for 15 seconds. Once you reach 5 stacks of Divine Charge, they are consumed and you are empowered with Divine Fury for 30 seconds, granting the following: +7.5% Base Damage Boost, +7.5% Overall Outgoing Healing. May only have 1 stack of Divine Fury at a time. Duration refreshed each time you reach 5 stacks of Divine Charge."}]
add("Celestial Lancet of Honor (Uncommon)", "Main Hand", 650, {"Accuracy": 488, "Critical Severity": 488}, 585,
    "Trial: Zariel's Challenge (Module 19)", "Celestial", 2, ["Warlock"], celestial_eb)
add("Celestial Lancet of Honor (Rare)", "Main Hand", 900, {"Accuracy": 675, "Critical Severity": 675}, 810,
    "Trial: Zariel's Challenge (Module 19)", "Celestial", 2, ["Warlock"], celestial_eb)
add("Celestial Lancet of Honor (Epic)", "Main Hand", 1150, {"Accuracy": 862, "Critical Severity": 862}, 1035,
    "Trial: Zariel's Challenge (Module 19)", "Celestial", 2, ["Warlock"], celestial_eb)
add("Celestial Lancet of Honor (Legendary)", "Main Hand", 1400, {"Accuracy": 1050, "Critical Severity": 1050}, 1260,
    "Trial: Zariel's Challenge (Module 19)", "Celestial", 2, ["Warlock"], celestial_eb)
add("Celestial Words of Hope (Uncommon)", "Off Hand", 650, {"Combat Advantage": 488, "Critical Strike": 488}, 585,
    "Trial: Zariel's Challenge (Module 19)", "Celestial", 2, ["Warlock"], celestial_eb)
add("Celestial Words of Hope (Rare)", "Off Hand", 900, {"Combat Advantage": 675, "Critical Strike": 675}, 810,
    "Trial: Zariel's Challenge (Module 19)", "Celestial", 2, ["Warlock"], celestial_eb)
add("Celestial Words of Hope (Epic)", "Off Hand", 1150, {"Combat Advantage": 862, "Critical Strike": 862}, 1035,
    "Trial: Zariel's Challenge (Module 19)", "Celestial", 2, ["Warlock"], celestial_eb)
add("Celestial Words of Hope (Legendary)", "Off Hand", 1400, {"Combat Advantage": 1050, "Critical Strike": 1050}, 1260,
    "Trial: Zariel's Challenge (Module 19)", "Celestial", 2, ["Warlock"], celestial_eb)

# Devil's Legion (Avernus) — The Legion Guard's Bloodletter + Contract Keeper
devils_eb = [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
              "setName": "Devil's Legion", "pieces": 2,
              "description": "2 of Set: You and nearby allies are granted the following: +1000 Power, +1000 Combat Advantage, +1000 Defense, +1000 Critical Avoidance. May stack up to 5 times when allies are equipped with a full set of Legion Guard's weapons."}]
add("The Legion Guard's Bloodletter (Uncommon)", "Main Hand", 600, {"Accuracy": 450, "Critical Severity": 450}, 540,
    "Avernus Adventure Zone", "Devil's Legion", 2, ["Warlock"], devils_eb)
add("The Legion Guard's Bloodletter (Rare)", "Main Hand", 800, {"Accuracy": 600, "Critical Severity": 600}, 720,
    "Avernus Adventure Zone", "Devil's Legion", 2, ["Warlock"], devils_eb)
add("The Legion Guard's Bloodletter (Epic)", "Main Hand", 1000, {"Accuracy": 750, "Critical Severity": 750}, 900,
    "Avernus Adventure Zone", "Devil's Legion", 2, ["Warlock"], devils_eb)
add("The Legion Guard's Bloodletter (Legendary)", "Main Hand", 1200, {"Accuracy": 900, "Critical Severity": 900}, 1080,
    "Avernus Adventure Zone", "Devil's Legion", 2, ["Warlock"], devils_eb)
add("The Legion Guard's Contract Keeper (Uncommon)", "Off Hand", 600, {"Combat Advantage": 450, "Critical Strike": 450}, 540,
    "Avernus Adventure Zone", "Devil's Legion", 2, ["Warlock"], devils_eb)
add("The Legion Guard's Contract Keeper (Rare)", "Off Hand", 800, {"Combat Advantage": 600, "Critical Strike": 600}, 720,
    "Avernus Adventure Zone", "Devil's Legion", 2, ["Warlock"], devils_eb)
add("The Legion Guard's Contract Keeper (Epic)", "Off Hand", 1000, {"Combat Advantage": 750, "Critical Strike": 750}, 900,
    "Avernus Adventure Zone", "Devil's Legion", 2, ["Warlock"], devils_eb)
add("The Legion Guard's Contract Keeper (Legendary)", "Off Hand", 1200, {"Combat Advantage": 900, "Critical Strike": 900}, 1080,
    "Avernus Adventure Zone", "Devil's Legion", 2, ["Warlock"], devils_eb)

# Hellfire Engine Remains — Hellfire Engine Oil Stick (Main Hand)
add("Hellfire Engine Oil Stick", "Main Hand", 600, {"Accuracy": 450, "Critical Severity": 450}, 540,
    "Blood War Campaign Store (Module 19)", "Hellfire Engine Remains", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0,
      "setName": "Hellfire Engine Remains", "pieces": 2,
      "description": "2 of Set: At the start of combat, your Stamina Regeneration will be increased by 15% and your Movement Speed by 15% for 10 seconds. When you kill an enemy, this buff will refresh. When you leave combat, this buff will expire."}])

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
