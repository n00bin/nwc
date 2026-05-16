"""Populate Fighter powers in classes.json from 2026-05-16 power-screen screenshots
(misfiled in 'wizard-powers' batch — actually covered Wizard + Fighter + Barbarian).

Fighter has unique mechanic: Block-mode at-wills (Shield Bash, Guarded Strike), plus
paragon-specific atwills and Tactical mechanic (Forge Ahead / Block).
"""
import json
from pathlib import Path

CLASSES = Path("G:/ai_projects/nwcb/data/classes.json")
data = json.loads(CLASSES.read_text(encoding="utf-8"))

fighter = next(c for c in data if c["name"] == "Fighter")

# Base shared Fighter powers
fighter["powers"] = {
    "atWill": [
        {"name": "Brazen Slash", "type": "atWill", "magnitude": 100, "castSeconds": 0.5, "rangeMelee": True, "addedEffect": "Stamina Restoration", "notes": "Threefold attack to target, dealing physical damage each hit."},
        {"name": "Shield Bash", "type": "atWill", "block": True, "magnitude": 55, "castSeconds": 0.6, "rangeMelee": True, "radius": 5, "notes": "Deal physical damage to enemies in a line. Available while blocking."},
        {"name": "Guarded Strike", "type": "atWill", "block": True, "magnitude": 100, "castSeconds": 0.5, "rangeMelee": True, "notes": "Deal physical damage to target. Available while blocking."}
    ],
    "encounter": [
        {"name": "Shield Throw", "type": "encounter", "magnitude": 325, "castSeconds": 0.65, "cooldownSeconds": 5.5, "range": 50, "addedEffect": "Increased Threat", "notes": "Projectile to target enemy."},
        {"name": "Anvil of Doom", "type": "encounter", "magnitude": 880, "castSeconds": 1.36, "cooldownSeconds": 16.6, "rangeMelee": True, "notes": "Deal physical damage to target enemy."}
    ],
    "daily": [
        {"name": "Earthshaker", "type": "daily", "magnitude": 1050, "castSeconds": 1.6, "actionPointCost": 1000, "radius": 20, "durationSeconds": 3, "addedEffect": "Stun", "notes": "Deal physical damage to nearby enemies."},
        {"name": "Second Wind", "type": "daily", "castSeconds": 1.1, "actionPointCost": 1000, "range": "Self", "durationSeconds": 10, "addedEffect": "+20% Max HP, restore amount increased, recover damage dealt as HP", "notes": "Defensive cooldown."},
        {"name": "Determination", "type": "daily", "castSeconds": 0.8, "actionPointCost": 1000, "range": "Self", "durationSeconds": 10, "addedEffect": "Immunity to most control + 40% Damage Boost", "notes": "Dispel and immune to control."}
    ],
    "mechanic": [
        {"name": "Forge Ahead", "type": "mechanic", "tactical": True, "castSeconds": 0, "range": "Self", "notes": "Raise shield, absorbs damage from front (10% Max HP). Drains stamina. First 1s grants immunity to most damage and +50% Movement Speed (3s CD). Effects end when stamina depleted."},
        {"name": "Seethe", "type": "mechanic", "castSeconds": 0.1, "range": "Self", "staminaCost": 1, "addedEffect": "Immune to Control Effects + drains stamina + fills Vengeance Gauge", "notes": "Seethe with rage behind shield, absorbing 50% Max HP. May not move/attack. Ends when stamina depleted."}
    ]
}

fighter["classFeatures"] = [
    {"name": "Vigorous Strikes", "description": "Critical Strike +5% when stamina is full. Effect decreases as stamina decreases."}
]
fighter["feats"] = [
    {"name": "Marathon Runner", "description": "Movement speed +10% when out of combat.", "type": "skill"}
]

# ---- Vanguard paragon (Tank)
vang = next(p for p in fighter["paragonPaths"] if p["name"] == "Vanguard")
vang["atWill"] = [
    {"name": "Tide of Iron", "type": "atWill", "paragon": True, "magnitude": 100, "castSeconds": 1.0, "rangeMelee": True, "durationSeconds": 5, "addedEffect": "Threat generation increased. Deals additional 40 magnitude physical damage on multi-enemy attacks (6s duration).", "notes": "Multi-target threat-builder."},
    {"name": "Threatening Rush", "type": "atWill", "paragon": True, "magnitude": 60, "castSeconds": 0.8, "range": 25, "addedEffect": "Increased Threat", "notes": "Lunge at target. Cannot execute while rooted."}
]
vang["encounter"] = [
    {"name": "Enforced Threat", "type": "encounter", "paragon": True, "castSeconds": 0.55, "cooldownSeconds": 12.9, "radius": 30, "durationSeconds": 10, "addedEffect": "Threaten nearby enemies, top of threat list. Reduces awareness of targets by 70%.", "notes": "AoE taunt."},
    {"name": "Knight's Challenge", "type": "encounter", "paragon": True, "magnitude": 100, "castSeconds": 0.75, "cooldownSeconds": 22.2, "range": "Self", "durationSeconds": 8, "addedEffect": "Instantly restore 50% Stamina. Deal 100 mag physical damage to attackers whenever you block.", "notes": "Stamina + defensive cooldown."},
    {"name": "Linebreaker", "type": "encounter", "paragon": True, "magnitude": 300, "castSeconds": 0.7, "cooldownSeconds": 12.9, "range": 55, "arc": 90, "addedEffect": "Increased Threat", "notes": "Lunge at target, cone damage to enemies in front."},
    {"name": "Iron Warrior", "type": "encounter", "paragon": True, "castSeconds": 1.2, "cooldownSeconds": 22.2, "range": 80, "durationSeconds": 8, "addedEffect": "Decreases damage taken by 20%", "notes": "Defensive cooldown."},
    {"name": "Knight's Valor", "type": "encounter", "paragon": True, "castSeconds": 0.2, "cooldownSeconds": 16.6, "radius": 25, "durationSeconds": 10, "addedEffect": "Cover nearest party member, intercept damage. All threat from covered target transferred to you.", "notes": "Effect ends early upon reuse."}
]
vang["mechanic"] = [
    {"name": "Path of the Vanguard", "type": "mechanic", "paragon": True, "notes": "Threat generation greatly increased. Auto-applied."}
]
vang["feats"] = [
    {"name": "Critical Deflection", "description": "Whenever you deflect, recover up to 10 stamina if Critical Strike rating matches/exceeds Deflect. Decreases as rates diverge. Not while blocking. 3s CD.", "paragon": True},
    {"name": "Combat Balance", "description": "When not blocking, decrease damage taken by up to 10% if Critical Avoidance, Deflect, and Awareness ratings are equal. Decreases as ratings diverge.", "paragon": True}
]

# ---- Dreadnought paragon (DPS)
dread = next(p for p in fighter["paragonPaths"] if p["name"] == "Dreadnought")
dread["encounter"] = [
    {"name": "Knee Breaker", "type": "encounter", "paragon": True, "magnitude": 700, "castSeconds": 0.55, "cooldownSeconds": 14.8, "rangeMelee": True, "durationSeconds": 8, "addedEffect": "Slow", "notes": "Deal physical damage to target enemy."},
    {"name": "Griffon's Wrath", "type": "encounter", "paragon": True, "magnitude": 1350, "castSeconds": 0.55, "cooldownSeconds": 14.8, "rangeMelee": True, "notes": "Threefold attack to target. Total Combo Magnitude."},
    {"name": "Onslaught", "type": "encounter", "paragon": True, "magnitude": 550, "castSeconds": 1.1, "cooldownSeconds": 16.7, "rangeMelee": True, "radius": 20, "durationSeconds": 1, "addedEffect": "Stun", "notes": "Deal physical damage to target and nearby enemies."}
]
dread["daily"] = [
    {"name": "Shockwave", "type": "daily", "paragon": True, "magnitude": 1150, "castSeconds": 1.2, "actionPointCost": 1000, "range": 50, "radius": 5, "addedEffect": "Knockback", "notes": "Deal physical damage to enemies in a line."},
    {"name": "Mow Down", "type": "daily", "paragon": True, "magnitude": 2100, "castSeconds": 1.5, "actionPointCost": 1000, "rangeMelee": True, "addedEffect": "Knock", "notes": "Twofold attack. Total Combo Magnitude."}
]
dread["mechanic"] = [
    {"name": "Forte", "type": "mechanic", "paragon": True, "notes": "Paragon provides Power increase, excels at Accuracy and Critical Avoidance."},
    {"name": "Vengeance", "type": "mechanic", "paragon": True, "notes": "Blocking attacks fills Vengeance Gauge. At 50%, you become Vengeful: damage dealt increased by 20%."},
    {"name": "Revengeance", "type": "mechanic", "paragon": True, "magnitude": 500, "castSeconds": 1.0, "range": 20, "arc": 80, "notes": "When you release Seethe immediately after blocking an attack, trigger Revengeance dealing cone damage. 3s CD. Auto-applied."}
]
dread["classFeatures"] = [
    {"name": "Momentum", "description": "Bull Charge no longer knocks targets, but deals additional 400 magnitude damage. Movement speed +20% after running for 2s. Effect ends when movement stops.", "paragon": True}
]
dread["feats"] = [
    {"name": "Crushing Blows", "description": "20% chance on hit to deal a crushing blow consuming 5 vengeance for additional 150 magnitude damage. No effect if Vengeance Gauge is below 5.", "paragon": True}
]

CLASSES.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print("Fighter powers populated (Vanguard + Dreadnought paragons — partial; many encounters/feats remain to add).")
