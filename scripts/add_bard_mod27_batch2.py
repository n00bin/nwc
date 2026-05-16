"""Bard Mod 27 gear batch 2 — Bloodbrass (Skyhold Arms), Magma Infused (Living Magma),
Dark Matter, Demonweb Empowerment, Duergar weapons (all Bard MH/OH variants)."""
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

# Bloodbrass Rapier (Bard MH, Skyhold Arms, IL 2750)
skyhold_eb = [{"type": "Set", "scope": "self", "stat": "Movement Speed", "amount": 12,
               "setName": "Skyhold Arms", "pieces": 2,
               "description": "2 of Set: In Pirates' Skyhold, Movement Speed +12%. Each Freebooter's Will stack (max 10): General +0.25% Power, DPS +0.35% Critical Severity, Healer +0.3% Overall Outgoing Healing, Tank +0.3% Awareness."}]
add("Bloodbrass Rapier", "Main Hand", 2750, {"Critical Strike": 2475, "Forte": 1856}, 2475, "Pirates' Skyhold Campaign Store", "Skyhold Arms", ["Bard"], skyhold_eb)

# Encased Magma Saber (Bard MH, Living Magma, IL 2700)
lm_eb = [{"type": "Set", "scope": "self", "stat": "Power", "amount": 7.5,
          "setName": "Living Magma", "pieces": 2,
          "description": "2 of Set: Gain 7.5% Power while at full health. Decreases relative to missing health. Role bonus: DPS +2.5% CA, Tank +2.5% Defense, Healer +2.5% OH. Fire maps double role bonus + 10% Movement Speed."}]
add("Encased Magma Saber", "Main Hand", 2700, {"Critical Strike": 1012, "Defense": 1012, "Forte": 2025}, 2430, "Mountain of Flame Campaign Store", "Living Magma", ["Bard"], lm_eb, {"Damage Bonus": 1.75})

# Starcore Lute (Bard OH, Dark Matter, IL 2500 + IL 2700 variants)
dm_eb = [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 5.5,
          "setName": "Dark Matter", "pieces": 2,
          "description": "2 of Set: Deal/heal up to 5.5% additional damage based on HP percentage difference. Role: DPS +1% BDB, Tank +5% Incoming Damage, Healer +6% OOH. Doubled in Wildspace, +10% Movement Speed."}]
add("Starcore Lute",     "Off Hand", 2500, {"Combat Advantage": 1875, "Critical Severity": 1875}, 2250, "Defense of the Moondancer (Advanced)", "Dark Matter", ["Bard"], dm_eb)
add("Starcore Lute +1",  "Off Hand", 2700, {"Combat Advantage": 2025, "Critical Severity": 2025}, 2430, "Defense of the Moondancer (Master)", "Dark Matter", ["Bard"], dm_eb)

# Xaryxian Lute (Bard OH, Peer Into the Void)
piv_eb = [{"type": "Set", "scope": "self", "stat": "Overall Outgoing Healing", "amount": 5,
           "setName": "Peer Into the Void", "pieces": 2,
           "description": "2 of Set: +5% Overall Outgoing Healing, -5% Incoming Damage. In Wildspace, Movement Speed +12%. Each Darklight stack: DPS +0.6% BDB, Tank -0.6% Incoming Damage, Healer +0.6% OOH. Max 10 stacks. Doubled in Wildspace."}]
add("Xaryxian Lute", "Off Hand", 2750, {"Accuracy": 2062, "Forte": 2062}, 2475, "The Imperial Citadel (Advanced)", "Peer Into the Void", ["Bard"], piv_eb)

# Perfect Nail of Lolth (Bard MH, Demonweb Empowerment, IL 2475)
de_eb = [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 1,
          "setName": "Demonweb Empowerment", "pieces": 2,
          "description": "2 of Set: Your Base Damage Boost and Overall Outgoing Healing increase. Stamina empty: -7.5% Incoming Damage. Start of combat: +1% Critical Strike and Critical Severity. Every 5s in combat: these increase by 1% (Max 5%)."}]
add("Perfect Nail of Lolth", "Main Hand", 2475, {"Combat Advantage": 1856, "Critical Strike": 1856}, 2228, "The Demonweb Pits (Master)", "Demonweb Empowerment", ["Bard"], de_eb, {"Damage Bonus": 1.25})

# Duergar Mercenary's Steel Rapier (Bard MH, Duergar Weapon Set, IL 1900)
duer_eb = [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 2,
            "setName": "Duergar Weapon Set", "pieces": 2,
            "description": "2 of Set: You and nearby allies are granted: +2% Base Damage Boost, +2% Overall Outgoing Healing, -2% Incoming Damage. Stacks up to 5 times with similarly equipped allies."}]
add("Duergar Mercenary's Steel Rapier", "Main Hand", 1900, {"Combat Advantage": 1425, "Critical Strike": 1425}, 1710, "Northdark Reaches Campaign", "Duergar Weapon Set", ["Bard"], duer_eb, {"Damage Bonus": 1.0})

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
