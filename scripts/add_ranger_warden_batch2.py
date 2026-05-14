"""Append Ranger Warden class features + paragon feats to classes.json.

Batch 2 of the Ranger Warden capture (2026-05-13).
"""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/classes.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

ranger = next(c for c in data if c["name"] == "Ranger")

# --- Rename "Stance Bonus" classFeature to canonical in-game name "Stance Mastery" ---
for cf in ranger.get("classFeatures", []):
    if cf["name"] == "Stance Bonus":
        cf["name"] = "Stance Mastery"
        cf["description"] = (
            "Melee Stance now increases your Movement Speed by 5%. "
            "Ranged Stance now increases your Stamina regeneration by 5%."
        )

warden = next(p for p in ranger["paragonPaths"] if p["name"] == "Warden")

# --- More slottable class features (Power tab -> Class Feature row) ---
new_slotted = [
    {
        "name": "Blade Storm",
        "description": (
            "When dealing melee damage, gain a 20% chance to deal an additional "
            "20% of your attack's damage in an area around you."
        ),
        "notes": "Slottable. Proc. Screenshot intake 2026-05-13."
    },
    {
        "name": "Twin-Blade Storm",
        "description": "Any time you hit more than 2 enemies, deal an additional 8% damage.",
        "notes": "Slottable. AoE damage bonus. Screenshot intake 2026-05-13."
    },
    {
        "name": "Aspect of the Lone Wolf",
        "description": (
            "Gain 5% Accuracy. Gain 1% Deflect for each enemy within 30' of you. "
            "Maximum Deflect bonus 10%."
        ),
        "percentStats": {
            "Accuracy": 5
        },
        "conditionalPercentStats": {
            "Deflect": {
                "perEnemyWithin30ft": 1,
                "maxBonus": 10
            }
        },
        "notes": "Slottable. +5% Accuracy is always-on; Deflect bonus scales with nearby enemies (conditional). Screenshot intake 2026-05-13."
    }
]

# Append only entries not already present
existing_slotted = {cf["name"] for cf in warden["slottedClassFeatures"]}
for cf in new_slotted:
    if cf["name"] not in existing_slotted:
        warden["slottedClassFeatures"].append(cf)

# --- Paragon feats (Feat row in Powers tab under Warden path) ---
new_feats = [
    {
        "name": "Deft Strikes",
        "description": (
            "Your Melee encounter powers cause your Ranged encounter powers to deal "
            "30% more damage for 3 seconds. Your Ranged encounter powers cause your "
            "Melee encounter powers to deal 30% more damage for 3 seconds."
        ),
        "notes": "Damage modifier. Screenshot intake 2026-05-13."
    },
    {
        "name": "Focused",
        "description": (
            "Each second you stay in melee stance, your melee powers deal 4% more "
            "damage, up to a total of 20% after 5 seconds. Each second you stay in "
            "ranged stance, your ranged powers deal 4% more damage, up to a total "
            "of 20% after 5 seconds. Switching stances resets this effect."
        ),
        "notes": "Stance-conditional damage stack. Auto-applied. Screenshot intake 2026-05-13."
    },
    {
        "name": "Swiftness of the Fox",
        "description": (
            "Your Melee Encounter powers shorten the cooldown of your Ranged Encounter "
            "powers by 2s. Cordon of Arrows and Hindering Shot reduce cooldowns by 1s. "
            "Your Ranged Encounter powers shorten the cooldown of your Melee Encounter "
            "powers by 2s. Your powers' damage is increased by 5%."
        ),
        "notes": "Cooldown reduction + 5% damage. Screenshot intake 2026-05-13."
    },
    {
        "name": "Storm's Recovery",
        "description": (
            "Using a ranged encounter power reduces your other ranged encounter cooldowns "
            "by 3 seconds. Using a melee encounter power reduces your other melee encounter "
            "cooldowns by 3 seconds."
        ),
        "notes": "Cooldown reduction. Auto-applied. Screenshot intake 2026-05-13."
    },
    {
        "name": "Blade Hurricane",
        "description": (
            "Using a melee encounter power grants Melee Flurry for 3 seconds, doubling your "
            "melee at-will damage. Using a ranged encounter power grants Ranged Flurry for "
            "3 seconds, doubling your ranged at-will damage."
        ),
        "notes": "At-will damage buff. Auto-applied. Screenshot intake 2026-05-13."
    },
    {
        "name": "Storm Conduit",
        "description": (
            "Your lightning hits from Clear the Ground, Electric Shot, Split the Sky, Call "
            "of the Storm, Cold Steel Hurricane, and the third hit of Storm Strike apply "
            "Storm Conduit to the target. Storm Conduit increases the damage the target "
            "takes from your powers by 10%."
        ),
        "notes": "Debuff. Auto-applied. Screenshot intake 2026-05-13."
    },
    {
        "name": "To the Wind",
        "description": "Throw Caution grants an additional 5% damage boost.",
        "notes": "Throw Caution modifier. Screenshot intake 2026-05-13."
    },
    {
        "name": "Skirmisher's Gambit",
        "description": "Your Critical Severity is increased by 10%.",
        "notes": (
            "Auto-applied. Same effect as the class-skill entry already named 'Skirmisher Gambit' "
            "in classFeatures. Stats applied via that entry to avoid double-count. "
            "Screenshot intake 2026-05-13."
        )
    },
    {
        "name": "Enhanced Conductivity",
        "description": "Call of the Storm now enhances your weapon with an additional 50 magnitude damage boost.",
        "notes": "Power modifier. Screenshot intake 2026-05-13."
    },
    {
        "name": "Nature's Envoy",
        "description": "When you activate Forest Ghost, your powers' damage is increased by 15% for 10s.",
        "notes": "Forest Ghost conditional damage buff. Screenshot intake 2026-05-13."
    }
]

existing_feats = {f["name"] for f in warden["feats"]}
for ft in new_feats:
    if ft["name"] not in existing_feats:
        warden["feats"].append(ft)

# Write back
PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")

print(f"Warden slottedClassFeatures: {len(warden['slottedClassFeatures'])}")
print(f"Warden feats: {len(warden['feats'])}")
print(f"Ranger classFeatures: {[cf['name'] for cf in ranger['classFeatures']]}")
