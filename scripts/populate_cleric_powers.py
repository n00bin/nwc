"""Populate Cleric powers in classes.json from 2026-05-16 power-screen screenshots.

Cleric is a Healer/DPS class with Divinity resource. Devout paragon (Heal) is the
primary focus. Arcanist-... wait, Cleric has Arbiter (DPS) and Devout (Heal).
"""
import json
from pathlib import Path

CLASSES = Path("G:/ai_projects/nwcb/data/classes.json")
data = json.loads(CLASSES.read_text(encoding="utf-8"))
cleric = next(c for c in data if c["name"] == "Cleric")

# Base shared Cleric powers
cleric["powers"] = {
    "atWill": [
        {"name": "Sacred Flame", "type": "atWill", "magnitude": 90, "castSeconds": 0.8, "range": 80, "notes": "Threefold attack to target enemy, dealing fire damage each hit."},
        {"name": "Scattering Light", "type": "atWill", "magnitude": 70, "castSeconds": 0.8, "range": 80, "radius": 10, "notes": "Deal radiant damage to target and enemies near it."}
    ],
    "encounter": [
        {"name": "Sun Burst", "type": "encounter", "magnitude": 260, "castSeconds": 1.0, "cooldownSeconds": 11.2, "radius": 25, "addedEffect": "Fully-charged knocks back nearby enemies", "notes": "Deal fire damage to all nearby enemies."},
        {"name": "Daunting Light", "type": "encounter", "magnitude": 280, "castSeconds": 0.7, "cooldownSeconds": 0.9, "divinityCost": 100, "range": 80, "radius": 12, "notes": "Deal radiant damage at target location."},
        {"name": "Geas", "type": "encounter", "magnitude": 700, "castSeconds": 0.8, "cooldownSeconds": 14.1, "range": 80, "durationSeconds": 6, "addedEffect": "Decreases target's damage dealt by 3%", "notes": "Deal radiant damage to target enemy."},
        {"name": "Bastion of Health", "type": "encounter", "healMagnitude": 1600, "castSeconds": 0.8, "cooldownSeconds": 0.4, "divinityCost": 100, "range": 80, "radius": 20, "notes": "Heal allies at target location. Magnitude decreases as targets increase."},
        {"name": "Divine Glow", "type": "encounter", "castSeconds": 1.0, "cooldownSeconds": 28.2, "range": "Self", "durationSeconds": 12, "addedEffect": "Reduce threat by half + gain Divinity Regen. Allies within 25' on cast receive +5% Damage Dealt, Incoming Healing and Recharge Speed.", "notes": "Self/AoE party buff."}
    ],
    "daily": [
        {"name": "Guardian of Faith", "type": "daily", "magnitude": 1700, "castSeconds": 1.5, "actionPointCost": 1000, "range": 60, "radius": 10, "durationSeconds": 3, "addedEffect": "Stun target and all enemies near it", "notes": "Deal radiant damage to target."},
        {"name": "Hallowed Ground", "type": "daily", "castSeconds": 1.5, "actionPointCost": 1000, "radius": 25, "durationSeconds": 18, "healMagnitude": 500, "addedEffect": "Allies within take 10% less damage + Heal over time", "notes": "Sanctify a circle around you."},
        {"name": "Flame Strike", "type": "daily", "magnitude": 260, "castSeconds": 2.0, "actionPointCost": 1000, "range": 60, "radius": 15, "durationSeconds": 12, "addedEffect": "Damage over time, mag 180", "notes": "Deal fire damage at target location."}
    ],
    "mechanic": [
        {"name": "Dodge", "type": "mechanic", "tactical": True, "castSeconds": 0, "range": "Self", "notes": "Quickly dodge direction you are running, immune to most damage and control. Activated while moving."},
        {"name": "Channel Divinity", "type": "mechanic", "castSeconds": 3.0, "cooldownSeconds": 0.4, "range": "Self", "notes": "Tap briefly to activate Mark of Divinity. Hold and release for Light of Divinity. Hold 3s for Gathering Light."}
    ]
}

cleric["classFeatures"] = [
    {"name": "Soothing Prayer", "description": "Whenever you Channel Divinity you receive a heal over time. Heal Magnitude: 25."},
    {"name": "Hallowed Armor", "description": "Take 5% less damage from all sources and 10% less damage when under the effect of Channel Divinity."},
    {"name": "Pilgrim's Light", "description": "You deal 5% more damage when there are no party members nearby."},
    {"name": "Expanded Faith", "description": "Increases your maximum divinity by 150."}
]

cleric["feats"] = []  # General/Skill feats will be added once seen in screenshots

# ---- Devout paragon (Heal)
dev = next(p for p in cleric["paragonPaths"] if p["name"] == "Devout")
dev["atWill"] = [
    {"name": "Soothe", "type": "atWill", "paragon": True, "healMagnitude": 275, "castSeconds": 1.0, "divinityCost": 40, "range": "Self", "notes": "Heal target ally or self."},
    {"name": "Blessing of Light", "type": "atWill", "paragon": True, "castSeconds": 1.2, "range": "Self", "durationSeconds": 12, "addedEffect": "Increases the effect of your next healing spell by 10%", "notes": "Buff for next heal."}
]
dev["encounter"] = [
    {"name": "Healing Word", "type": "encounter", "paragon": True, "healMagnitude": 450, "castSeconds": 1.6, "cooldownSeconds": 0.4, "divinityCost": 220, "radius": 80, "addedEffect": "Heal over time: mag 300, duration 18s", "notes": "Heal self and nearby allies."},
    {"name": "Exaltation", "type": "encounter", "paragon": True, "castSeconds": 0.8, "cooldownSeconds": 18.8, "range": "Self", "durationSeconds": 8, "addedEffect": "+20% Outgoing Healing and Damage Dealt; closest DPS within 25' gets +10% Damage Dealt", "notes": "Self/party buff."},
    {"name": "Cleansing Light", "type": "encounter", "paragon": True, "healMagnitude": 300, "castSeconds": 1.61, "cooldownSeconds": 0.4, "divinityCost": 150, "range": 80, "radius": 20, "addedEffect": "Removes one negative condition", "notes": "Heal allies at target location."},
    {"name": "Astral Shield", "type": "encounter", "paragon": True, "healMagnitude": 250, "castSeconds": 0.15, "cooldownSeconds": 0.4, "divinityCost": 22, "range": 80, "radius": 10, "durationSeconds": 10, "addedEffect": "-10% damage taken for party members entering + Heal over time mag 250", "notes": "Erects a barrier. Channeling — cannot move/execute additional actions."},
    {"name": "Intercession", "type": "encounter", "paragon": True, "healMagnitude": 1800, "castSeconds": 0.3, "cooldownSeconds": 22.5, "range": 100, "notes": "Instantly heal the nearby party member with the least HP."}
]
dev["daily"] = [
    {"name": "Anointed Army", "type": "daily", "paragon": True, "healMagnitude": 900, "castSeconds": 1.1, "actionPointCost": 1000, "radius": 40, "durationSeconds": 15, "addedEffect": "Restores HP when health falls below 50% or upon expiration + Damage dealt +6%", "notes": "Grants Anointed Army effect."},
    {"name": "Guardian of Life", "type": "daily", "paragon": True, "healMagnitude": 800, "castSeconds": 5.4, "actionPointCost": 1000, "radius": 40, "durationSeconds": 15, "addedEffect": "Heal over time mag 500. Full charge revives up to 4 random party members. Guardian Exhausted prevents charging.", "notes": "Heal self and nearby allies, plus charge-up revive."}
]
dev["mechanic"] = [
    {"name": "Forte", "type": "mechanic", "paragon": True, "notes": "Paragon provides Divinity Regen increase, excels at Critical Severity and Deflect."},
    {"name": "Righteousness", "type": "mechanic", "paragon": True, "notes": "Increases healing spell effectiveness, reduces divinity cost of healing spells, reduces threat from healing spells, increases divinity regeneration rate."},
    {"name": "Light of Divinity", "type": "mechanic", "paragon": True, "healMagnitude": 1700, "castSeconds": 2.5, "divinityCost": 120, "range": 120, "notes": "Heal party member with your Mark of Divinity. Hold Channel Divinity to activate. Magnitude/cost decrease when not fully charged. Heals you if Mark inactive or out of range."},
    {"name": "Mark of Divinity", "type": "mechanic", "paragon": True, "castSeconds": 0, "range": "Self", "notes": "Bestows target party member or self with Mark of Divinity, increasing the effectiveness of your heals on the target by 5%. Stays until target leaves party, dies, or recast. Briefly tap Channel Divinity to activate."}
]
dev["classFeatures"] = [
    {"name": "Desperate Prayers", "description": "When divinity is below half max, outgoing healing increases by up to 20% as divinity approaches 0.", "paragon": True},
    {"name": "Swift Prayers", "description": "Allows movement at reduced speed when activating Channel Divinity or casting Astral Shield.", "paragon": True},
    {"name": "Hallowed Guide", "description": "Increases healing by 5% when the target is within 15'.", "paragon": True, "active": True},
    {"name": "Overflowing Spirit", "description": "Whenever your divinity is full, outgoing healing is increased by 25%.", "paragon": True, "active": True}
]
dev["feats"] = [
    {"name": "Repeated Blessings", "description": "When you heal an ally affected by Healing Word with an encounter or daily power, Healing Word is extended by 6 seconds. Cannot extend past original duration.", "paragon": True},
    {"name": "Cycle of Prayer", "description": "Increases divinity regeneration rate every 3 seconds. Stacks up to 4 times. Resets when action consumes divinity.", "paragon": True},
    {"name": "Blessed Armaments", "description": "Divine Glow and Exaltation: damage taken -10% and deal additional radiant damage (mag 20) after most attacks while active.", "paragon": True},
    {"name": "Sanctified Ground", "description": "Hallowed Ground provides additional 5% Damage Reduction and 15% Recharge Speed while in effect.", "paragon": True},
    {"name": "Gathering Light", "description": "Extends Channel Divinity cast time to 3s; full cast casts Gathering Light. Heal the party member affected by your Mark of Divinity and party members near the target. Heal Magnitude: 800.", "paragon": True},
    {"name": "Angel of Life", "description": "Grants Angel of Life Ready: extends Channel Divinity to 4s; full cast grants Angel of Life for 12s, allowing healing spells without divinity cost. 180s CD.", "paragon": True},
    {"name": "Persistent Guardian", "description": "After Guardian of Faith or Guardian of Life, the guardian remains and heals wounded party members for 600 magnitude every few seconds. Persists until 6 heals or 45 seconds elapsed.", "paragon": True},
    {"name": "Towering Light", "description": "Increases damage dealt by 10%. Decreases as remaining divinity decreases.", "paragon": True},
    {"name": "Battle Prayer", "description": "Encounter powers that cost divinity grant Battle Prayer (12s): next Light of Divinity has 1s cast time and -50 divinity cost.", "paragon": True},
    {"name": "Empowered Soothe", "description": "Encounter powers that cost divinity grant 3 stacks of Empowered Soothe (30s). When Soothe is cast under this effect, consume a stack; heal magnitude of Soothe +100.", "paragon": True}
]

CLASSES.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print("Cleric powers populated (Devout paragon — partial; Arbiter to come).")
