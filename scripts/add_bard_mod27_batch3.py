"""Bard Mod 27 gear batch 3 — Mod 22 Dragonbone Vale + Module 19 weapons:
Scalebreaker's Wrath, Vale, Fortified Vale, Grand Alliance, Blessed Blade (Bard variants)."""
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

# Scalebreaker's Wrath (Crown of Keldegonn, IL 1850)
sw_eb = [{"type": "Set", "scope": "self", "stat": "Recharge Speed", "amount": 1,
          "setName": "Scalebreaker's Wrath", "pieces": 2,
          "description": "2 of Set: Use encounter/daily during combat to gain Scalebreaker's Wrath stacks. Each stack 20s: role-based bonus. 6 stacks empower for 30s."}]
add("Durgarn Thord Point", "Main Hand", 1850, {"Critical Strike": 1388, "Forte": 1388}, 1665, "The Crown of Keldegonn", "Scalebreaker's Wrath", ["Bard"], sw_eb)
add("Durgarn Thord Lute",  "Off Hand",  1850, {"Accuracy": 1388, "Combat Advantage": 1388}, 1665, "The Crown of Keldegonn", "Scalebreaker's Wrath", ["Bard"], sw_eb)

# Vale weapons (IL 1700)
v_eb = [{"type": "Set", "scope": "self", "stat": "Power", "amount": 5,
         "setName": "Vale", "pieces": 2,
         "description": "2 of Set: Adventurer's Might. 10% chance per encounter power to gain 4% Boost for 10s by role."}]
add("Antique Rapier of the Vale", "Main Hand", 1700, {"Combat Advantage": 1275, "Forte": 1275}, 1530, "Sharandar", "Vale", ["Bard"], v_eb)

# Fortified Vale (IL 1800)
fv_eb = [{"type": "Set", "scope": "self", "stat": "Power", "amount": 5,
          "setName": "Fortified Vale", "pieces": 2,
          "description": "2 of Set: Adventurer's Might. DPS +5% Power, Tank +5% Defense, Healer +5% Outgoing Healing. 15% chance per encounter power to gain 7.5% Boost for 10s by role."}]
add("Fortified Rapier of the Vale", "Main Hand", 1800, {"Combat Advantage": 1350, "Critical Severity": 1350}, 1620, "Sharandar", "Fortified Vale", ["Bard"], fv_eb)
add("Fortified Lute of the Vale",   "Off Hand",  1800, {"Critical Strike": 1350, "Awareness": 1350}, 1620, "Sharandar", "Fortified Vale", ["Bard"], fv_eb)

# Grand Alliance (Dragonbone Vale, IL 1700)
ga_eb = [{"type": "Set", "scope": "self", "stat": "Power", "amount": 3,
          "setName": "Grand Alliance", "pieces": 2,
          "description": "2 of Set: Brute's Expertise. When 25' or closer, role stat and Forte +3%: DPS Power, Tank Awareness, Healer Outgoing Healing."}]
add("Grand Alliance Rapier", "Main Hand", 1700, {"Accuracy": 1275, "Critical Strike": 1275}, 1530, "Dragonbone Vale", "Grand Alliance", ["Bard"], ga_eb)

# Blessed Blade (Module 19) — Honed Tip of the Blessed Blade
bb_eb = [{"type": "Set", "scope": "self", "stat": "Power", "amount": 3,
          "setName": "Blessed Blade", "pieces": 2,
          "description": "2 of Set: Sure Edge of the Blessed Blade. Encounter power triggers Blessed: +3% Power/Accuracy/CA + random buff (Blessed Guidance +5% CritStrike or Blessed Insight +7.5% AP gain) for 10s. (30s CD)"}]
add("Honed Tip of the Blessed Blade", "Main Hand", 650, {"Accuracy": 488, "Critical Severity": 488}, 585, "The Redeemed Citadel", "Blessed Blade", ["Bard"], bb_eb)

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
