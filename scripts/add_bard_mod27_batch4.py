"""Bard Mod 27 gear batch 4 — Blessed Blade additional tiers, Pure Note of Blessed Blade (Bard OH),
Celestial set Bard (Point of Melody MH + Lute of Song OH), Devil's Legion (Legion Guard's Barbed Rapier + Twisted Lute),
Hellfire Engine Bard (Jimmy Hook MH + Noise Maker OH)."""
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

# ---- Blessed Blade — Bard (Module 19) — IL 1150 + Pure Note OH (IL 650)
bb_eb = [{"type": "Set", "scope": "self", "stat": "Power", "amount": 3,
          "setName": "Blessed Blade", "pieces": 2,
          "description": "2 of Set: Sure Edge of the Blessed Blade. Encounter triggers Blessed: +3% Power/Accuracy/CA + random buff (Blessed Guidance: +5% Critical Strike, Blessed Insight: +7.5% Action Point gain) for 10s. (30s CD)"}]
src_rc = "The Redeemed Citadel"
add("Honed Tip of the Blessed Blade (IL 1150)", "Main Hand", 1150, {"Accuracy": 862, "Critical Severity": 862}, 1015, src_rc, "Blessed Blade", ["Bard"], bb_eb)
add("Pure Note of the Blessed Blade",          "Off Hand",  650,  {"Combat Advantage": 488, "Critical Strike": 488}, 585, src_rc, "Blessed Blade", ["Bard"], bb_eb)

# ---- Celestial Set (Bard) — Zariel's Challenge
src_zc = "Trial: Zariel's Challenge"
cel_eb = [{"type": "Set", "scope": "self", "stat": "Base Damage Boost", "amount": 7.5,
           "setName": "Celestial", "pieces": 2,
           "description": "2 of Set: Use encounter/daily during combat to gain Divine Charge stacks (15s each). 5 stacks consume and grant Divine Fury for 30s: +7.5% Base Damage Boost, +7.5% Overall Outgoing Healing."}]
add("Celestial Point of Melody",          "Main Hand", 650,  {"Accuracy": 488, "Critical Severity": 488}, 585, src_zc, "Celestial", ["Bard"], cel_eb)
add("Celestial Lute of Song (IL 1150)",   "Off Hand",  1150, {"Combat Advantage": 862, "Critical Strike": 862}, 1015, src_zc, "Celestial", ["Bard"], cel_eb)

# ---- Devil's Legion (Bard) — Avernus
src_av = "Avernus Adventure Zone"
dl_eb = [{"type": "Set", "scope": "self", "stat": "Power", "amount": 1500,
          "setName": "Devil's Legion", "pieces": 2,
          "description": "2 of Set: You and nearby allies: +1500 Power, +1500 Combat Advantage, +1500 Defense, +1500 Critical Avoidance. Stacks up to 5 times when allies are equipped with full Legion Guard's weapons."}]
add("The Legion Guard's Barbed Rapier",          "Main Hand", 600,  {"Accuracy": 450, "Critical Severity": 450}, 540, src_av, "Devil's Legion", ["Bard"], dl_eb)
add("The Legion Guard's Barbed Rapier (IL 1200)", "Main Hand", 1200, {"Accuracy": 900, "Critical Severity": 900}, 1080, src_av, "Devil's Legion", ["Bard"], dl_eb)
add("The Legion Guard's Twisted Lute (IL 1200)",  "Off Hand",  1200, {"Combat Advantage": 900, "Critical Strike": 900}, 1080, src_av, "Devil's Legion", ["Bard"], dl_eb)

# ---- Hellfire Engine Remains (Bard) — Blood War
src_bw = "Blood War Campaign Store"
he_eb = [{"type": "Set", "scope": "self", "stat": "Stamina Regeneration", "amount": 15,
          "setName": "Hellfire Engine Remains", "pieces": 2,
          "description": "2 of Set: At start of combat, Stamina Regen +15% and Movement Speed +15% for 10s. Refreshes on kill. Expires when leaving combat."}]
add("Hellfire Engine Jimmy Hook (IL 800)",      "Main Hand", 800,  {"Accuracy": 600, "Critical Strike": 600}, 720, src_bw, "Hellfire Engine Remains", ["Bard"], he_eb)
add("Hellfire Engine Noise Maker (IL 1000)",    "Off Hand",  1000, {"Combat Advantage": 750, "Critical Strike": 750}, 900, src_bw, "Hellfire Engine Remains", ["Bard"], he_eb)

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
