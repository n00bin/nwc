"""Legacy Warlock gear batch 15 — Vistani + Barovian + older Mod 11-13 PvP weapons (lean mode)."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))
max_id = max((i.get('id', 0) for i in data), default=0)

INTAKE = "Legacy Warlock gear collection screenshot intake 2026-05-13."

def add(name, slot, il, rs, cr, source, set_name=None, set_size=None, allowed=None, equip=None, ps=None, notes=None):
    global max_id
    max_id += 1
    entry = {"id": max_id, "name": name, "slot": slot, "item_level": il,
        "ratingStats": rs, "combinedRating": cr,
        "equipBonuses": equip or [], "set": set_name or "",
        "setSize": set_size or 0, "source": source,
        "percentStats": ps or {}, "abilityBonuses": {},
        "notes": notes or INTAKE}
    if allowed: entry["allowedClasses"] = allowed
    data.append(entry)

# Vistani Set — Module 14 Ravenloft PvP, 4 IL tiers
ve = [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0, "setName": "Vistani", "pieces": 2,
       "description": "2 of Set: +500 Movement Speed."}]
for il, acc, cs, cr in [(350, 262, 262, 315), (500, 375, 375, 450), (650, 488, 488, 585), (800, 600, 600, 720)]:
    rarity = {350: "Uncommon", 500: "Rare", 650: "Epic", 800: "Legendary"}[il]
    add(f"Vistani Pact Blade ({rarity})", "Main Hand", il, {"Accuracy": acc, "Critical Strike": cs}, cr,
        "Barovia / Module 14 Ravenloft", "Vistani", 2, ["Warlock"], ve)
    add(f"Vistani Grimoire ({rarity})", "Off Hand", il, {"Accuracy": acc, "Critical Strike": cs}, cr,
        "Barovia / Module 14 Ravenloft", "Vistani", 2, ["Warlock"], ve)

# Barovian Lord's Armor — Curselord's set IL 770, Barovia Seals Store
add("Curselord's Raid Ushanka", "Head", 770, {"Combat Advantage": 247, "Critical Strike": 330}, 693,
    "Barovia Seals Store", "Barovian Lord's Armor", 4, ["Warlock"],
    [{"name": "Survivor's Savagery", "description": "When your health is 50% or more, your Critical Strike is increased by 1500. When your health is below 50%, Critical Avoidance is increased by 2000."}])
add("Curselord's Raid Pigaches", "Feet", 770, {"Combat Advantage": 329, "Critical Strike": 248}, 693,
    "Barovia Seals Store", "Barovian Lord's Armor", 4, ["Warlock"],
    [{"name": "Survivor's Strike", "description": "When your health is 50% or more, your Accuracy is increased by 1500. When your health is below 50%, Movement Speed is increased by 10%."}])
add("Curselord's Assault Pigaches", "Feet", 770, {"Combat Advantage": 329, "Critical Severity": 248}, 693,
    "Barovia Seals Store", "Barovian Lord's Armor", 4, ["Warlock"],
    [{"name": "Survivor's Strike", "description": "When your health is 50% or more, your Accuracy is increased by 1500. When your health is below 50%, Movement Speed is increased by 10%."}])

# Tyrant Weapons (Module 13 Lost City of Omu) - Corpseslayer
ts = [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0, "setName": "Tyrant", "pieces": 2,
       "description": "Module 13 set bonus."}]
add("Corpselayer", "Main Hand", 350, {"Accuracy": 131, "Combat Advantage": 262, "Critical Strike": 131}, 315,
    "Lost City of Omu (Module 13)", "Tyrant", 2, ["Warlock"], ts)

# Primal Weapons (Module 13) - Primal Tepatl
ps = [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0, "setName": "Primal", "pieces": 2,
       "description": "2 of Set: If you are hit or healed for more than 10% of your Maximum Hit Points in a single blow, your Base Damage Boost and Overall Outgoing Healing will be increased by 10% for 10 seconds."}]
add("Primal Tepatl", "Main Hand", 350, {"Accuracy": 131, "Combat Advantage": 262, "Critical Strike": 131}, 315,
    "Lost City of Omu (Module 13)", "Primal", 2, ["Warlock"], ps)
add("Primal Tomicamatl", "Off Hand", 350, {"Accuracy": 131, "Combat Advantage": 262, "Critical Strike": 131}, 315,
    "Lost City of Omu (Module 13)", "Primal", 2, ["Warlock"], ps)

# Pilgrim Weapons (Module 12) - Deathreader (Off-Hand)
add("Deathreader", "Off Hand", 500, {"Accuracy": 188, "Combat Advantage": 375, "Critical Strike": 188}, 450,
    "Sea of Moving Ice / River District (Module 12)", "Pilgrim", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0, "setName": "Pilgrim", "pieces": 2}])

# Pioneer Weapons (Module 12 Stronghold/Storm King's Thunder) - Exalted Pioneer Khanjar
add("Exalted Pioneer Khanjar", "Main Hand", 350, {"Accuracy": 131, "Combat Advantage": 262, "Critical Strike": 131}, 315,
    "Storm King's Thunder Campaign (Module 12)", "Pioneer", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0, "setName": "Pioneer", "pieces": 2,
      "description": "2 of Set: Granted increased stat per team member: Party 2 +200 Power, Party 3 +400 Power/Defense, Party 4 +600 Power/Defense/Accuracy, Party 5 +800 Power/Defense/Accuracy/Critical Strike."}])

# Pioneer Assault Sevars (Arms, IL 616)
add("Pioneer Assault Sevars", "Arms", 616, {"Critical Strike": 277, "Critical Severity": 185, "Defense": 462}, 554,
    "Campaign Rewards and Store (Storm King's Thunder)", "Pioneer Armor", 4, ["Warlock"],
    [{"name": "Leader's Might", "description": "Gain 200 Power for each player in your team."}])

# Chultan Crafted Weapons (Module 11 Tomb of Annihilation) - Wootz Khanjar + Dinosaur Hide Jarimwiri
ce = [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 0, "setName": "Chultan", "pieces": 2,
       "description": "Chultan crafted PvE weapons. Module 11 Tomb of Annihilation."}]
add("Wootz Khanjar", "Main Hand", 350, {"Accuracy": 131, "Combat Advantage": 262, "Critical Strike": 131}, 315,
    "Crafting (Tomb of Annihilation)", "Chultan", 2, ["Warlock"], ce)
add("Dinosaur Hide Jarimwiri", "Off Hand", 800, {"Accuracy": 300, "Combat Advantage": 600, "Critical Strike": 300}, 720,
    "Crafting (Tomb of Annihilation)", "Chultan", 2, ["Warlock"], ce)

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
