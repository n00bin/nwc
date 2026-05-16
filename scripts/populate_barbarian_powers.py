"""Populate Barbarian powers in classes.json from 2026-05-16 power-screen screenshots.

Covers:
- Sentinel paragon (Tank): encounters, mechanics, class features, feats
- Blademaster paragon (DPS): encounters, dailies, class features, feats
"""
import json
from pathlib import Path

CLASSES = Path("G:/ai_projects/nwcb/data/classes.json")
data = json.loads(CLASSES.read_text(encoding="utf-8"))

barb = next(c for c in data if c["name"] == "Barbarian")

# Base shared Barbarian class features (Bravery, Steady Rage, Mighty Vitality, Trample the Fallen)
barb["classFeatures"] = [
    {"name": "Bravery", "description": "Increases Movement Speed and Deflect by 10%.", "active": True},
    {"name": "Steady Rage", "description": "Generate 2 Rage per second while in combat."},
    {"name": "Mighty Vitality", "description": "Increases Maximum Hit Points by 10% and Power by 2.5%."},
    {"name": "Trample the Fallen", "description": "Whenever you hit an enemy with an Encounter or Daily power with a control effect, target takes 5% more damage and you deal 5% more damage for 10s.", "active": True}
]
barb["feats"] = [
    {"name": "Persistent Rage", "description": "Increases the rate at which you generate Rage.", "type": "skill"}
]

# ---- Sentinel paragon (Tank)
sent = next(p for p in barb["paragonPaths"] if p["name"] == "Sentinel")
sent["encounter"] = [
    {"name": "Come and Get It", "type": "encounter", "paragon": True, "castSeconds": 1.0, "cooldownSeconds": 13.4, "radius": 30, "addedEffect": "Draw In", "notes": "Threaten nearby enemies, place top of threat list."},
    {"name": "Enduring Shout", "type": "encounter", "paragon": True, "castSeconds": 1.15, "cooldownSeconds": 26.9, "range": "Self", "durationSeconds": 15, "addedEffect": "+20% Max HP and restore amount increased", "notes": "Self defensive cooldown."},
    {"name": "Takedown", "type": "encounter", "paragon": True, "magnitude": 400, "castSeconds": 0.9, "cooldownSeconds": 8.9, "rangeMelee": True, "addedEffect": "Knock Down + Increased Threat", "notes": "Deal physical damage to target enemy."},
    {"name": "Ignore Weakness", "type": "encounter", "paragon": True, "castSeconds": 0.7, "cooldownSeconds": 21.5, "range": "Self", "addedEffect": "Instantly restore stamina (50% min, 100% max scaling with HP loss)", "notes": "Stamina cooldown."},
    {"name": "Primal Fury", "type": "encounter", "paragon": True, "magnitudeRange": [200, 600], "castSeconds": 1.0, "cooldownSeconds": 0.8, "radius": 15, "rageCost": 30, "addedEffect": "Ends Unstoppable, scales damage with stamina", "notes": "Deal physical damage to nearby enemies."}
]
sent["mechanic"] = [
    {"name": "Forte", "type": "mechanic", "paragon": True, "notes": "Paragon provides Defense increase, excels at Critical Severity and Awareness."}
]
sent["classFeatures"] = [
    {"name": "Raging Bladeturn", "description": "Rage adds up to 5% Deflect and Critical Avoidance.", "paragon": True, "active": True},
    {"name": "Challenger's Charge", "description": "Punishing Charge places you at top of target's threat list. May now be charged; fully charged it will not place you at top of threat list.", "paragon": True},
    {"name": "Threatening Presence", "description": "Threat generation increased.", "paragon": True},
    {"name": "Furious Reaction", "description": "When stamina is depleted you generate 10 Rage and heal for 10% of Max HP over 10s. Does not occur if already under Furious Reaction.", "paragon": True}
]
sent["feats"] = [
    {"name": "Frustrating Slash", "description": "Whenever you hit an enemy with Sentinel's Slash, threat generation is increased for 5 seconds.", "paragon": True},
    {"name": "Indomitable Might", "description": "Indomitable Battle Strike's max magnitude increased to 1000, decreases to 500 as remaining HP decrease.", "paragon": True},
    {"name": "On the Move", "description": "Not So Fast's magnitude increased to 350 and now increases Movement Speed of self and nearby allies by 20% for 4 seconds.", "paragon": True}
]

# ---- Blademaster paragon (DPS)
bm = next(p for p in barb["paragonPaths"] if p["name"] == "Blademaster")
bm["encounter"] = [
    {"name": "Punishing Charge", "type": "encounter", "paragon": True, "magnitude": 650, "castSeconds": 0.25, "cooldownSeconds": 13.6, "range": 60, "durationSeconds": 3, "addedEffect": "Stun", "notes": "Lunge at target enemy."},
    {"name": "Battle Fury", "type": "encounter", "paragon": True, "castSeconds": 1.2, "cooldownSeconds": 18.1, "range": 80, "radius": 8, "durationSeconds": 10, "addedEffect": "Self +10% damage dealt, nearby allies +5%, generates additional Rage", "notes": "Unleash inner rage."}
]
bm["daily"] = [
    {"name": "Avalanche of Steel", "type": "daily", "paragon": True, "magnitude": 1400, "castSeconds": 5.0, "actionPointCost": 1000, "range": 30, "addedEffect": "Knock Down + Immune to most damage and control for 5s pre-impact", "notes": "Leap into the air, slam to ground dealing damage to nearby enemies."}
]
bm["classFeatures"] = [
    {"name": "Barbed Strikes", "description": "Increases Critical Strike and Critical Severity by 5% whenever your stamina is full. Effects decrease as stamina decreases.", "paragon": True}
]
bm["feats"] = [
    {"name": "Unstoppable Spin", "description": "When you use Spinning Strike with <50 Rage, set Rage to 50. Battlerage activates automatically, duration +6s, damage bonus +50%. Does not stack with or activate Rampage.", "paragon": True},
    {"name": "Raging Criticals", "description": "Critical severity +10% when under Battlerage or Unstoppable.", "paragon": True}
]

CLASSES.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print("Barbarian powers populated (Sentinel + Blademaster paragons — partial).")
