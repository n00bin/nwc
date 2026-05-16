"""Bard Mod 27 gear batch 5 — Masterwork II/III Bard weapons (Titansteel, Obsidian, Exalted Obsidian/Mekatl),
Stronghold Unity Bard variants."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))
max_id = max((i.get('id', 0) for i in data), default=0)
INTAKE = "Mod 27 Bard gear — screenshot intake 2026-05-16."

def add(name, slot, il, rs, cr, source, set_name, classes, equip=None, percent=None, set_size=2, abilities=None):
    global max_id
    max_id += 1
    entry = {"id": max_id, "name": name, "slot": slot, "item_level": il,
        "ratingStats": rs, "combinedRating": cr,
        "equipBonuses": equip or [], "set": set_name or "", "setSize": set_size if set_name else 0,
        "source": source, "percentStats": percent or {}, "abilityBonuses": abilities or {},
        "allowedClasses": classes, "notes": INTAKE}
    data.append(entry)

# Masterwork II Weapon Set (Bard) — Mod 11 Shroud of Souls
src_sos = "Masterwork Crafting / The Shroud of Souls (Module 11)"
mw2_eb = [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 2,
           "setName": "Masterwork II Weapon Set", "pieces": 2,
           "description": "2 of Set: You and nearby allies: +2% BDB, +2% OOH, -2% Incoming Damage. Stacks up to 5x with similar Stronghold weapons."}]
add("Titansteel Rapier", "Main Hand", 350, {"Accuracy": 131, "Combat Advantage": 262, "Critical Strike": 131}, 315, src_sos, "Masterwork II Weapon Set", ["Bard"], mw2_eb)
add("Titansteel Lute",   "Off Hand",  350, {"Accuracy": 131, "Combat Advantage": 262, "Critical Strike": 131}, 315, src_sos, "Masterwork II Weapon Set", ["Bard"], mw2_eb)

# Masterwork III Weapon Set (Bard) — Mod 13 Lost City of Omu
src_omu = "Masterwork Armor III / The Lost City of Omu (Module 13)"
mw3_eb = [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 2,
           "setName": "Masterwork III Weapon Set", "pieces": 2,
           "description": "2 of Set: +2% BDB, +2% OOH, -2% Incoming Damage. Stacks up to 5x with Stronghold weapons."}]
# Mastered Obsidian Rapier IL 350-800 (4 tiers)
for il, cr, accu, ca, cs in [(350,315,131,262,131),(500,450,188,375,188),(650,585,244,488,244),(800,720,300,600,300)]:
    name = "Mastered Obsidian Rapier" if il == 350 else f"Mastered Obsidian Rapier (IL {il})"
    add(name, "Main Hand", il, {"Accuracy": accu, "Combat Advantage": ca, "Critical Strike": cs}, cr, src_omu, "Masterwork III Weapon Set", ["Bard"], mw3_eb)
# Mastered Obsidian Mekatl IL 350-800 (4 tiers)
for il, cr, accu, ca, cs in [(350,315,131,262,131),(500,450,188,375,188),(650,585,244,488,244),(800,720,300,600,300)]:
    name = "Mastered Obsidian Mekatl" if il == 350 else f"Mastered Obsidian Mekatl (IL {il})"
    add(name, "Off Hand", il, {"Accuracy": accu, "Combat Advantage": ca, "Critical Strike": cs}, cr, src_omu, "Masterwork III Weapon Set", ["Bard"], mw3_eb)
# Exalted Obsidian Rapier IL 400+ tiers
for il, cr, accu, ca, cs in [(400,360,150,300,150),(550,495,206,412,206),(700,630,262,525,262),(850,765,319,638,319)]:
    add(f"Exalted Obsidian Rapier (IL {il})", "Main Hand", il, {"Accuracy": accu, "Combat Advantage": ca, "Critical Strike": cs}, cr, src_omu, "Masterwork III Weapon Set", ["Bard"], mw3_eb)
# Exalted Obsidian Mekatl IL 400+ tiers
for il, cr, accu, ca, cs in [(400,360,150,300,150),(550,495,206,412,206),(700,630,262,525,262),(850,765,319,638,319)]:
    add(f"Exalted Obsidian Mekatl (IL {il})", "Off Hand", il, {"Accuracy": accu, "Combat Advantage": ca, "Critical Strike": cs}, cr, src_omu, "Masterwork III Weapon Set", ["Bard"], mw3_eb)

# Stronghold Unity (Bard) — Stronghold Rapier MH + Stronghold Lute OH
src_sh = "Stronghold Outfitter"
stronghold_eb = [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 2,
                  "setName": "Stronghold Unity", "pieces": 2,
                  "description": "2 of Set: +2% BDB, +2% OOH, -2% Incoming Damage. Stacks up to 5x with similar Stronghold weapons."}]
for il, cr, accu, ca, cs in [(300,270,112,225,112),(400,360,150,300,150),(500,450,188,375,188),(600,540,225,450,225)]:
    name_mh = "Stronghold Rapier" if il == 300 else f"Stronghold Rapier (IL {il})"
    name_oh = "Stronghold Lute" if il == 300 else f"Stronghold Lute (IL {il})"
    add(name_mh, "Main Hand", il, {"Accuracy": accu, "Combat Advantage": ca, "Critical Strike": cs}, cr, src_sh, "Stronghold Unity", ["Bard"], stronghold_eb)
    add(name_oh, "Off Hand",  il, {"Accuracy": accu, "Combat Advantage": ca, "Critical Strike": cs}, cr, src_sh, "Stronghold Unity", ["Bard"], stronghold_eb)

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
