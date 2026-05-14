"""Append Ranger Hunter paragon powers/feats + class-shared at-wills/encounters/dailies.

Batch from screenshot intake 2026-05-13.
"""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/classes.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

ranger = next(c for c in data if c["name"] == "Ranger")

# --- Class-shared at-wills, encounters, dailies ---
class_atwill = [
    {"name": "Rapid Shot", "type": "atWill", "stance": "ranged", "magnitude": 65, "castSeconds": 0.4, "range": 80, "notes": "Quickly fire an arrow at your enemy."},
    {"name": "Rapid Strike", "type": "atWill", "stance": "melee", "magnitude": 55, "enhancedMagnitude": 80, "castSeconds": 0.4, "notes": "Strike your target at close range. Fourth hit of combo has enhanced magnitude."},
    {"name": "Split Shot", "type": "atWill", "stance": "ranged", "magnitude": "95-220", "castSeconds": 2.1, "range": 80, "arc": 75, "notes": "Spray of arrows. More damage the longer you focus."},
    {"name": "Split Strike", "type": "atWill", "stance": "melee", "magnitude": 50, "castSeconds": 0.55, "rangeRadius": 8, "notes": "Dash forward, striking enemies in front of you."}
]

class_encounter = [
    {"name": "Hindering Shot", "type": "encounter", "stance": "ranged", "magnitude": 130, "castSeconds": 0.5, "cooldownSeconds": 10.8, "range": 80, "addedEffect": "Weak Grasping Roots", "notes": "Two arrows into enemy's shins. 3 charges, 2s cooldown between charges."},
    {"name": "Hindering Strike", "type": "encounter", "stance": "melee", "magnitude": 520, "castSeconds": 0.5, "cooldownSeconds": 12.6, "rangeRadius": 15, "addedEffect": "Strong Grasping Roots", "notes": "Slash enemies' ankles."},
    {"name": "Marauder's Escape", "type": "encounter", "stance": "ranged", "magnitude": 550, "castSeconds": 1.3, "cooldownSeconds": 13.5, "range": 80, "addedEffect": "Confusion", "durationSeconds": 1, "notes": "Dash backward 50ft, firing 3 quick arrows."},
    {"name": "Marauder's Rush", "type": "encounter", "stance": "melee", "magnitude": 580, "castSeconds": 0.7, "cooldownSeconds": 12.6, "range": 83, "addedEffect": "Confusion", "durationSeconds": 1, "notes": "Rush your target, striking them with your weapons."},
    {"name": "Constricting Arrow", "type": "encounter", "stance": "ranged", "magnitude": 520, "castSeconds": 0.5, "cooldownSeconds": 13.5, "range": 80, "radius": 12, "addedEffect": "Strong Grasping Roots", "notes": "Fire a gnarled arrow at your opponent."},
    {"name": "Steel Breeze", "type": "encounter", "stance": "melee", "magnitude": 230, "castSeconds": 0.5, "cooldownSeconds": 12.6, "radius": 20, "addedEffect": "Gain 10% stamina for each enemy hit.", "notes": "Spin and slash with blades."},
    {"name": "Rain of Arrows", "type": "encounter", "stance": "ranged", "magnitude": "60x5", "castSeconds": 1, "cooldownSeconds": 14.4, "range": 80, "notes": "Several shots fired into the air, raining down in a small area."},
    {"name": "Rain of Swords", "type": "encounter", "stance": "melee", "magnitude": 200, "dotMagnitude": "50x4", "dotDurationSeconds": 8, "castSeconds": 1.5, "cooldownSeconds": 12.6, "radius": 15, "addedEffect": "DoT", "notes": "Strike down with blades in a large area."},
    {"name": "Cordon of Arrows", "type": "encounter", "stance": "ranged", "magnitude": 225, "castSeconds": 1.2, "cooldownSeconds": 18, "range": 80, "radius": 12, "addedEffect": "Strong Grasping Roots", "notes": "Designate a target location; if enemy steps within 15', becomes entangled. Up to 3 active at a time."},
    {"name": "Plant Growth", "type": "encounter", "stance": "melee", "magnitude": 150, "dotMagnitude": "50x4", "dotDurationSeconds": 4, "castSeconds": 0.7, "cooldownSeconds": 18, "radius": 20, "addedEffect": "DoT + Weak Grasping Roots", "notes": "Thorny plants grow around you."}
]

class_daily = [
    {"name": "Forest Ghost", "type": "daily", "magnitude": "250x4", "actionPointCost": 50, "durationSeconds": 5, "notes": "Slip into the forest where you remain unseen for 5s. Automatically strike a foe within 15ft."},
    {"name": "Seismic Shot", "type": "daily", "stance": "ranged", "magnitude": 800, "castSeconds": 1, "actionPointCost": 1000, "range": 80, "notes": "Concussive blast into the ground, shockwave pulls enemies in."},
    {"name": "Snipe", "type": "daily", "stance": "ranged", "magnitude": 1900, "castSeconds": 1.25, "actionPointCost": 1000, "range": 80, "notes": "A powerful precision shot at a single target."}
]

ranger["powers"]["atWill"] = class_atwill
ranger["powers"]["encounter"] = class_encounter
# Existing daily list already has Cold Steel Hurricane and Call of the Storm (Warden-specific).
# Move those out and replace with class-shared.
ranger["powers"]["daily"] = class_daily

# --- Warden paragon: add powers (Cold Steel Hurricane, Call of the Storm — Warden-only dailies) ---
warden = next(p for p in ranger["paragonPaths"] if p["name"] == "Warden")
warden["powers"] = warden.get("powers", {})
warden["powers"]["atWill"] = warden["powers"].get("atWill", [])
warden["powers"]["encounter"] = warden["powers"].get("encounter", [])
warden["powers"]["daily"] = [
    {"name": "Cold Steel Hurricane", "type": "daily", "actionPointCost": 1000, "notes": "Warden paragon daily."},
    {"name": "Call of the Storm", "type": "daily", "actionPointCost": 1000, "notes": "Warden paragon daily."}
]

# --- Hunter paragon: add powers ---
hunter = next(p for p in ranger["paragonPaths"] if p["name"] == "Hunter")
hunter["powers"] = {
    "atWill": [
        {"name": "Aimed Shot", "type": "atWill", "paragon": True, "stance": "ranged", "magnitude": 260, "castSeconds": 1, "range": 80, "notes": "Precise aim, deadly shot into your enemy."},
        {"name": "Aimed Strike", "type": "atWill", "paragon": True, "stance": "melee", "magnitude": 65, "dotMagnitude": "65x5", "dotDurationSeconds": 10, "castSeconds": 1.2, "range": 20, "addedEffect": "DoT", "notes": "Careful aim, vital strike causing damage over time."},
        {"name": "Hunter's Teamwork", "type": "atWill", "paragon": True, "stance": "ranged", "magnitude": 160, "castSeconds": 0.7, "range": 80, "durationSeconds": 20, "addedEffect": "Marked targets drop supplies on death: 10% HP, 10% Stamina, 5% Action Points to allies.", "notes": "Spot supplies; one target marked at a time."},
        {"name": "Careful Attack", "type": "atWill", "paragon": True, "stance": "melee", "castSeconds": 0.8, "range": 80, "notes": "Study target, signaling gaps in defense. Enemies studied take more damage from at-wills/encounters/dailies."}
    ],
    "encounter": [
        {"name": "Ambush", "type": "encounter", "paragon": True, "stance": "ranged", "magnitude": 150, "castSeconds": 0.5, "cooldownSeconds": 13.5, "addedEffect": "Targets take 10% more damage from your attacks", "durationSeconds": 3, "notes": "Hide in tall grasses, gain Ambush and Stealth for short period."},
        {"name": "Bear Trap", "type": "encounter", "paragon": True, "stance": "melee", "magnitude": 220, "dotMagnitude": 185, "castSeconds": 0.47, "cooldownSeconds": 9, "range": 30, "radius": 4, "addedEffect": "DoT", "notes": "Toss a massive bear trap; first enemy near triggers it."},
        {"name": "Longstrider's Shot", "type": "encounter", "paragon": True, "stance": "ranged", "magnitude": 650, "castSeconds": 0.6, "cooldownSeconds": 12.6, "range": 80, "notes": "Launch a swift arrow at your target."},
        {"name": "Gushing Wound", "type": "encounter", "paragon": True, "stance": "melee", "magnitude": 400, "dotMagnitude": 400, "dotDurationSeconds": 10, "castSeconds": 1.3, "cooldownSeconds": 14.4, "addedEffect": "DoT", "notes": "Slice open your enemy."},
        {"name": "Hawk Shot", "type": "encounter", "paragon": True, "stance": "ranged", "magnitude": 273, "castSeconds": 1.5, "cooldownSeconds": 13.5, "range": 80, "radius": 3, "notes": "Fire an arrow that deals damage to all enemies in a line."},
        {"name": "Hawkeye", "type": "encounter", "paragon": True, "stance": "melee", "castSeconds": 0.5, "cooldownSeconds": 16.2, "radius": 100, "addedEffect": "Increase damage of Encounter powers by 5% for 3s", "notes": "Channel hawk's power; grant precision to you and allies."},
        {"name": "Commanding Shot", "type": "encounter", "paragon": True, "stance": "ranged", "magnitude": 520, "castSeconds": 1.4, "cooldownSeconds": 13.5, "range": 80, "addedEffect": "Increases target's damage taken by 10% for 10s + Strong Grasping Roots", "notes": "Powerful bugle of the Stag penetrates vulnerable spots."},
        {"name": "Stag Heart", "type": "encounter", "paragon": True, "stance": "melee", "castSeconds": 0.5, "cooldownSeconds": 18, "radius": 100, "addedEffect": "Temporary Hit Points equal to 15% of max life", "notes": "Grants you and allies constitution of the Stag."},
        {"name": "Rapid Volley", "type": "encounter", "paragon": True, "stance": "ranged", "magnitude": 100, "castSeconds": 0.5, "cooldownSeconds": 4.5, "range": 80, "arc": 60, "charges": 5, "notes": "Rapidly fire a volley of arrows. 5 charges."},
        {"name": "Windwalk Strike", "type": "encounter", "paragon": True, "stance": "melee", "magnitude": 180, "castSeconds": 0.6, "cooldownSeconds": 15, "range": 35, "radius": 4, "notes": "Dash forward, striking enemies in your path."}
    ],
    "daily": [
        {"name": "Slasher's Mark", "type": "daily", "paragon": True, "stance": "melee", "magnitude": 2100, "castSeconds": 0.7, "actionPointCost": 1000, "range": 83, "durationSeconds": 10, "addedEffect": "Restores Stamina or Guard Meter whenever target is hit.", "notes": "Leap to target, slashing strike leaves a mark."},
        {"name": "Disruptive Shot", "type": "daily", "paragon": True, "magnitude": 400, "castSeconds": 0.5, "actionPointCost": 250, "range": 80, "notes": "Quickly fire arrow at target's head, dealing damage and interrupting their attack."}
    ],
    "mechanic": [
        {"name": "Forte", "type": "mechanic", "paragon": True, "notes": "Hunter Forte: Power (primary), excels at Accuracy and Deflect."}
    ]
}

# --- Hunter slottedClassFeatures (paragon-specific only; class-shared already in Warden) ---
hunter_slotted_new = [
    {
        "name": "Aspect of the Falcon",
        "description": "Ranged powers deal 10% more damage if you are within 25 feet of your target.",
        "percentStatsConditional": {"Damage Bonus": 10},
        "conditional": "ranged power within 25ft",
        "notes": "Hunter paragon slottable. Screenshot intake 2026-05-13."
    },
    {
        "name": "Pathfinder's Action",
        "description": "When activating a Daily power, increase your Movement Speed by 10% and adds 5% Deflection for 10 seconds.",
        "trigger": "Daily power activation",
        "durationSeconds": 10,
        "percentStatsConditional": {"Movement Speed": 10, "Deflection": 5},
        "notes": "Hunter paragon slottable. Screenshot intake 2026-05-13."
    },
    {
        "name": "Cruel Recovery",
        "description": "When you deal critical damage to an enemy, heal 1% of your maximum Hit Points. Can only heal once every 2 seconds.",
        "trigger": "critical damage",
        "internalCooldownSeconds": 2,
        "notes": "Hunter paragon slottable. Self-heal proc. Screenshot intake 2026-05-13."
    },
    {
        "name": "Primal Instincts",
        "description": "Call upon your Primal Instincts, increasing the effectiveness of the buffs granted by Hawkeye and Stag Heart by 20%.",
        "modifies": ["Hawkeye", "Stag Heart"],
        "notes": "Hunter paragon slottable. Screenshot intake 2026-05-13."
    }
]

existing_hunter_slotted = {cf["name"] for cf in hunter["slottedClassFeatures"]}
for cf in hunter_slotted_new:
    if cf["name"] not in existing_hunter_slotted:
        hunter["slottedClassFeatures"].append(cf)

# Note: class-shared slottedClassFeatures (Seeker's Vengeance, Crushing Roots, Aspect of the Pack,
# Aspect of the Serpent, Stormstep Action) currently live only in Warden. Add a cross-reference
# entry in Hunter so the picker can see them.
class_shared_ref = [
    {"name": "Seeker's Vengeance", "classShared": True, "notes": "See Warden.slottedClassFeatures for canonical entry."},
    {"name": "Crushing Roots", "classShared": True, "notes": "See Warden.slottedClassFeatures."},
    {"name": "Aspect of the Pack", "classShared": True, "notes": "See Warden.slottedClassFeatures."},
    {"name": "Aspect of the Serpent", "classShared": True, "notes": "See Warden.slottedClassFeatures."},
    {"name": "Stormstep Action", "classShared": True, "notes": "See Warden.slottedClassFeatures."}
]
for cf in class_shared_ref:
    if cf["name"] not in existing_hunter_slotted:
        hunter["slottedClassFeatures"].append(cf)

# Fix Warden Aspect of the Pack description to match in-game text exactly (screenshot 201835)
for cf in warden["slottedClassFeatures"]:
    if cf["name"] == "Aspect of the Pack":
        cf["description"] = (
            "If you are within 30' of an ally, you and your ally gain 1% Combat "
            "Advantage per friendly target affected. Maximum 5%."
        )

# --- Hunter feats (paragon-specific) ---
hunter_feats = [
    {"name": "Longshot", "description": "Your ranged encounter powers do 50% more damage. Your melee encounter powers do 50% less damage.", "notes": "Trade-off feat. Screenshot intake 2026-05-13."},
    {"name": "Critical Action", "description": "Every 25% action points you spend on a Daily power grants you a stack of 'Critical Action'. This increases your Critical Severity by 6% per stack for 10 seconds.", "notes": "Conditional crit sev stack. Screenshot intake 2026-05-13."},
    {"name": "Biting Snares", "description": "When you apply Grasping Roots or Thorned Roots you gain 1% of your Action Points.", "notes": "Auto-applied. Screenshot intake 2026-05-13."},
    {"name": "Forestbond", "description": "When you apply Strong Grasping Roots or Thorned Roots you reduce the cooldown of all of your currently recharging powers by 10%. Reduced to 5% for Weak Grasping Roots.", "notes": "Auto-applied cooldown reduction. Screenshot intake 2026-05-13."},
    {"name": "More Than Disruptive", "description": "Disruptive Shot increases the damage of your ranged powers by 10% for 5 seconds.", "notes": "Disruptive Shot modifier. Screenshot intake 2026-05-13."},
    {"name": "Slasher's Expertise", "description": "Slasher's Mark increases the damage of your melee powers by 10% for 15s.", "notes": "Auto-applied. Slasher's Mark modifier. Screenshot intake 2026-05-13."},
    {"name": "Commander in Chief", "description": "Commanding Shot now increases your projectile damage by 10% for 10 seconds.", "notes": "Commanding Shot modifier. Screenshot intake 2026-05-13."},
    {"name": "Predator", "description": "Using a ranged encounter power applies Prey to the first target hit, increasing the damage of your attacks against them by 10%. Lasts 10 seconds. Prey may only be active on one target at a time and cannot be reapplied until it expires.", "notes": "Conditional. Screenshot intake 2026-05-13."},
    {"name": "Thorned Roots", "description": "Your Strong Grasping Roots are upgraded to Thorned Roots. Thorned Roots deal 75 magnitude damage every second. When hitting a control immune target, the damage magnitude is increased to 225.", "notes": "Strong Grasping Roots upgrade. Screenshot intake 2026-05-13."},
    {"name": "Rate of Change", "description": "When switching stances, gain a 15% damage boost for 9 seconds. This bonus is reduced by 5% every 3 seconds and refreshes to full on your next stance change.", "notes": "Auto-applied stance-conditional. Screenshot intake 2026-05-13."}
]

existing_hunter_feats = {f["name"] for f in hunter["feats"]}
for ft in hunter_feats:
    if ft["name"] not in existing_hunter_feats:
        hunter["feats"].append(ft)

# Write back
PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")

print(f"Class at-wills: {len(ranger['powers']['atWill'])}")
print(f"Class encounters: {len(ranger['powers']['encounter'])}")
print(f"Class dailies: {len(ranger['powers']['daily'])}")
print(f"Class mechanics: {len(ranger['powers']['mechanic'])}")
print(f"Warden paragon dailies: {len(warden['powers']['daily'])}")
print(f"Warden slottedClassFeatures: {len(warden['slottedClassFeatures'])}")
print(f"Warden feats: {len(warden['feats'])}")
print(f"Hunter at-wills: {len(hunter['powers']['atWill'])}")
print(f"Hunter encounters: {len(hunter['powers']['encounter'])}")
print(f"Hunter dailies: {len(hunter['powers']['daily'])}")
print(f"Hunter slottedClassFeatures: {len(hunter['slottedClassFeatures'])}")
print(f"Hunter feats: {len(hunter['feats'])}")
