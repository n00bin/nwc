"""Bard Mod 27 gear batch 1 — Strings of the Forsaken (OH) 4 IL tiers (Whisper of Power → Impending Doom),
Echo of the Damned + Note of the Forsaken (Abyssal Prowess), Umbral Stride Bard weapons, Doomed Reaver
Feet (Sabatons of the Eternal Bloom for Warlock/Bard), Crystalline Bard weapons (Bismuth/Crystal Rapier+Lute)."""
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

# Whisper of Power / Impending Doom set bonus (already defined earlier for Rogue, replicate)
wp_eb = [{"type": "Set", "scope": "self", "stat": "Movement Speed", "amount": 10,
          "setName": "Whisper of Power", "pieces": 2,
          "description": "2 of Set: +10% Movement Speed in Thay."}]
id_eb = [{"type": "Set", "scope": "self", "stat": "Critical Severity", "amount": 2.5,
          "setName": "Impending Doom", "pieces": 2,
          "description": "2 of Set: Accumulate 18 Charges to consume them and become Unleashed. DPS +4% BDB, Heal +4% OH. Refreshable."}]

src_zone = "The Soul Collector Zone Mechanic / Adventures in Thay (Module 27)"
src_adv = "Soul Harvest (Advanced) (Module 27)"
src_mst = "Soul Harvest (Master) (Module 27)"

# Strings of the Forsaken (Bard OH) — 4 tiers (3750, 4100 implied, 4450, 5250 captured)
add("Strings of the Forsaken (IL 3750)", "Off Hand", 3750, {"Critical Severity": 3375, "Forte": 2535}, 3375, src_zone, "Impending Doom", ["Bard"], id_eb)
add("Strings of the Forsaken (IL 4450)", "Off Hand", 4450, {"Critical Severity": 4005, "Forte": 3004}, 4005, src_adv, "Impending Doom", ["Bard"], id_eb)
add("Strings of the Forsaken (IL 5250)", "Off Hand", 5250, {"Power": 1837, "Critical Severity": 3150, "Forte": 2362}, 4725, src_mst, "Impending Doom", ["Bard"], id_eb)

# Dirgeblade (Bard MH) — multiple tiers
add("Dirgeblade (IL 3400)", "Main Hand", 3400, {"Accuracy": 3315, "Critical Strike": 3060}, 3060, src_zone, "Whisper of Power", ["Bard"], wp_eb)
add("Dirgeblade (IL 3750)", "Main Hand", 3750, {"Accuracy": 1997, "Critical Strike": 1690, "Outgoing Healing": 1690}, 3375, src_zone, "Impending Doom", ["Bard"], id_eb)
add("Dirgeblade (IL 4100)", "Main Hand", 4100, {"Accuracy": 2892, "Critical Strike": 2470, "Outgoing Healing": 1780}, 4005, src_zone, "Impending Doom", ["Bard"], id_eb, {"Damage Bonus": 0.5})
add("Dirgeblade (IL 4450)", "Main Hand", 4450, {"Accuracy": 3120, "Critical Strike": 2880, "Outgoing Healing": 1780}, 4320, src_adv, "Impending Doom", ["Bard"], id_eb, {"Damage Bonus": 1.0})
add("Dirgeblade (IL 4800)", "Main Hand", 4800, {"Accuracy": 3412, "Critical Strike": 2160, "Outgoing Healing": 2100}, 4725, src_adv, "Impending Doom", ["Bard"], id_eb, {"Damage Bonus": 2.0})

# Dirge of the Damned Weapons (Set 2/21) — Abyssal Prowess
ap_eb = [{"type": "Set", "scope": "self", "stat": "Movement Speed", "amount": 14,
          "setName": "Abyssal Prowess (Greater)", "pieces": 2,
          "description": "2 of Set: While in Thay, Movement Speed +14%, Forte +3%. Whenever you use an encounter power, 15% chance to gain 10% Critical Severity for 6s."}]
ap_adv_eb = [{"type": "Set", "scope": "self", "stat": "Movement Speed", "amount": 10,
              "setName": "Abyssal Prowess", "pieces": 2,
              "description": "2 of Set: While in Thay, Movement Speed +10%. 10% chance on encounter power to gain 5% Critical Severity for 6s."}]

add("Echo of the Damned", "Off Hand", 4000, {"Accuracy": 3510, "Combat Advantage": 2640}, 3600, "Shackles of Divinity (Master)", "Abyssal Prowess (Greater)", ["Bard"], ap_eb)
add("Hymn of the Forsaken", "Main Hand", 4000, {"Critical Severity": 3960, "Forte": 2640}, 3600, "Shackles of Divinity (Master)", "Abyssal Prowess (Greater)", ["Bard"], ap_eb, {"Damage Bonus": 1.0})
add("Echo of the Forsaken", "Main Hand", 3800, {"Combat Advantage": 2508, "Forte": 2308}, 3420, "Shackles of Divinity (Advanced)", "Abyssal Prowess", ["Bard"], ap_adv_eb, {"Damage Bonus": 0.5})
add("Note of the Forsaken", "Off Hand", 3800, {"Accuracy": 3134, "Combat Advantage": 2508, "Forte": 2308}, 3420, "Shackles of Divinity (Advanced)", "Abyssal Prowess", ["Bard"], ap_adv_eb)

# Umbral Stride (Bard weapons, IL 3300)
us_eb = [{"type": "Set", "scope": "self", "stat": "Movement Speed", "amount": 10,
          "setName": "Umbral Stride", "pieces": 2,
          "description": "2 of Set: While in Thay, Movement Speed +10%. Every 3s in combat, gain Umbral Stride stack: General +0.25% Power, DPS +0.5% Critical Severity, Healer +0.3% Overall Outgoing Healing, Tank +0.4% Awareness. Max 10 stacks."}]
add("Ebonfang Rapier of the Thayan Zealot", "Main Hand", 3300, {"Critical Strike": 3267, "Forte": 2005}, 2970, "Adventures in Thay", "Umbral Stride", ["Bard"], us_eb)
add("Dirge-Touched Lute of the Thayan Zealot", "Off Hand", 3300, {"Accuracy": 2896, "Combat Advantage": 2178}, 2970, "Adventures in Thay", "Umbral Stride", ["Bard"], us_eb)

# Doomed Reaver Armor — Sabatons of the Eternal Bloom (Warlock/Bard Feet variant)
src_dr = "Soul Harvest (Master) (Module 27)"
add("Sabatons of the Eternal Bloom", "Feet", 5000, {"Critical Severity": 4050, "Outgoing Healing": 3300}, 4500, src_dr, "Doomed Reaver Armor", ["Warlock", "Bard"],
    [{"name": "Harmonizing Radiance",
      "description": "When you use an encounter power, 30% chance to pulse Harmonizing Light, granting yourself and the two closest friendly players within 20' +1% Power and +1.5% Critical Strike for 6s. Re-applying refreshes duration."}],
    None, 4)

# Crystalline Bard Weapons (Bismuth Rapier MH, Crystal Rapier MH IL 3100, Crystal Lute OH IL 3100)
prismatic_eb = [{"type": "Set", "scope": "self", "stat": "Movement Speed", "amount": 12,
                 "setName": "Prismatic Defier of Dread", "pieces": 2,
                 "description": "2 of Set: While in Pirates' Skyhold or Dread Sanctum, Movement Speed +12%. Each Prismatic Force stack (max 10): General +0.35% Power, DPS +0.5% Critical Severity, Healer +0.4% OOH, Tank +0.4% Awareness."}]
add("Bismuth Rapier", "Main Hand", 3400, {"Critical Strike": 3060, "Forte": 2295}, 3060, "Pirates' Skyhold / Dread Sanctum", "Prismatic Defier of Dread", ["Bard"], prismatic_eb, {"Damage Bonus": 1.0})
add("Crystal Rapier", "Main Hand", 3100, {"Critical Strike": 2790, "Forte": 2292}, 2790, "Pirates' Skyhold / Dread Sanctum", "Prismatic Defier of Dread", ["Bard"], prismatic_eb, {"Damage Bonus": 1.0})
add("Crystal Lute",   "Off Hand",  3100, {"Accuracy": 3022, "Combat Advantage": 1860}, 2790, "Pirates' Skyhold / Dread Sanctum", "Prismatic Defier of Dread", ["Bard"], prismatic_eb, {"Damage Bonus": 1.0})

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
