"""Rogue gear batch 53 — Burning Dagger IL 600, Burning Stiletto OH 4 tiers, Drowned Dagger MH 2 tiers."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))
max_id = max((i.get('id', 0) for i in data), default=0)
INTAKE = "Rogue gear — screenshot intake 2026-05-15."

def add(name, slot, il, rs, cr, source, set_name, classes, equip=None, percent=None, set_size=2, abilities=None):
    global max_id
    max_id += 1
    entry = {"id": max_id, "name": name, "slot": slot, "item_level": il,
        "ratingStats": rs, "combinedRating": cr,
        "equipBonuses": equip or [], "set": set_name or "", "setSize": set_size if set_name else 0,
        "source": source, "percentStats": percent or {}, "abilityBonuses": abilities or {},
        "allowedClasses": classes, "notes": INTAKE}
    data.append(entry)

src_ue = "Weapons of the Elements (Module 8)"
TIERS = [(300,270,112,225,112),(400,360,150,300,150),(500,450,188,375,188),(600,540,225,450,225)]

# Burning Dagger MH IL 600 (was missing from batch 52)
bh_eb = [{"type": "Set", "scope": "self", "stat": "Action Points", "amount": 25,
          "setName": "Burning Heart", "pieces": 2,
          "description": "2 of Set: Daily power 25% chance to immediately restore AP."}]
add("Burning Dagger (IL 600)", "Main Hand", 600, {"Accuracy": 225, "Combat Advantage": 450, "Critical Strike": 225}, 540, src_ue, "Burning Heart", ["Rogue"], bh_eb)

# Burning Stiletto OH — 4 tiers
for il, cr, accu, ca, cs in TIERS:
    name = "Burning Stiletto" if il == 300 else f"Burning Stiletto (IL {il})"
    add(name, "Off Hand", il, {"Accuracy": accu, "Combat Advantage": ca, "Critical Strike": cs}, cr, src_ue, "Burning Heart", ["Rogue"], bh_eb)

# Drowned Dagger MH — 2 tiers
dh_eb = [{"type": "Set", "scope": "self", "stat": "Heal Self", "amount": 50,
          "setName": "Drowned Heart", "pieces": 2,
          "description": "2 of Set: When struck, Heal for 50% of Max HP over next 30s. (30s CD) Disabled in Thay Arena PvP."}]
for il, cr, accu, ca, cs in TIERS[:2]:
    name = "Drowned Dagger" if il == 300 else f"Drowned Dagger (IL {il})"
    add(name, "Main Hand", il, {"Accuracy": accu, "Combat Advantage": ca, "Critical Strike": cs}, cr, src_ue, "Drowned Heart", ["Rogue"], dh_eb)

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
