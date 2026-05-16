"""Rogue gear batch 38 — Mirage Weapons (Cloaked Ascendancy Mod 15) — Mirage Dagger MH 4 tiers + Mirage Stiletto OH 3 tiers."""
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

src_ca = "Cloaked Ascendancy Campaign Vendor / River District (Module 15)"
mir_eb = [{"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 3,
           "setName": "Mirage", "pieces": 2,
           "description": "2 of Set: When you use an encounter power, you become a Master of Illusion for 10s. Summons an illusion to attack enemies, does 3% more damage (+10% vs enemies with Shields/Temp HP). 30s CD."}]

TIERS = [(350,315,131,262,131),(500,450,188,375,188),(650,585,244,488,244),(800,720,300,600,300)]

# Mirage Dagger MH — 4 tiers
for il, cr, accu, ca, cs in TIERS:
    name = "Mirage Dagger" if il == 350 else f"Mirage Dagger (IL {il})"
    add(name, "Main Hand", il, {"Accuracy": accu, "Combat Advantage": ca, "Critical Strike": cs}, cr, src_ca, "Mirage", ["Rogue"], mir_eb)

# Mirage Stiletto OH — 3 tiers (350/500/650)
for il, cr, accu, ca, cs in TIERS[:-1]:
    name = "Mirage Stiletto" if il == 350 else f"Mirage Stiletto (IL {il})"
    add(name, "Off Hand", il, {"Accuracy": accu, "Combat Advantage": ca, "Critical Strike": cs}, cr, src_ca, "Mirage", ["Rogue"], mir_eb)

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
