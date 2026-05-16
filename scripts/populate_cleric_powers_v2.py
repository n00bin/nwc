"""v2 update — comprehensive Cleric Arbiter + general/skill feats.
Includes per-paragon magnitude adjustments where Arbiter and Devout differ.
"""
import json
from pathlib import Path

CLASSES = Path("G:/ai_projects/nwcb/data/classes.json")
data = json.loads(CLASSES.read_text(encoding="utf-8"))
cleric = next(c for c in data if c["name"] == "Cleric")

# Update base shared powers to use byParagon for differing values
for p in cleric["powers"]["atWill"]:
    if p["name"] == "Sacred Flame":
        p["magnitudeByParagon"] = {"Devout": 90, "Arbiter": 100}
        p.pop("magnitude", None)
        p["notes"] = "Threefold attack to target, dealing fire damage each hit. Arbiter: Increases Radiant Judgement by 1; Burning Judgement Effect: +10 mag."
    elif p["name"] == "Scattering Light":
        p["notes"] = "Deal radiant damage to target and enemies near it. Arbiter: Increases Burning Judgement by 1; Radiant Judgement Effect: +7 mag."

for e in cleric["powers"]["encounter"]:
    if e["name"] == "Bastion of Health":
        e["healMagnitudeByParagon"] = {"Devout": 1600, "Arbiter": 1200}
        e["divinityCostByParagon"] = {"Devout": 100, "Arbiter": 200}
        e.pop("healMagnitude", None); e.pop("divinityCost", None)
        e["notes"] = "Heal allies at target location. Magnitude decreases as targets increase. Arbiter: divinity cost 200."
    elif e["name"] == "Daunting Light":
        e["divinityCostByParagon"] = {"Devout": 100, "Arbiter": 150}
        e.pop("divinityCost", None)
        e["notes"] = "Deal radiant damage at target location. Arbiter: Increases Burning Judgement by 1; Radiant Judgement Effect: +40 mag."
    elif e["name"] == "Geas":
        e["magnitudeByParagon"] = {"Devout": 700, "Arbiter": 650}
        e.pop("magnitude", None)
        e["notes"] = "Deal radiant damage to target enemy. Arbiter: Increases Burning Judgement by 1; Radiant Judgement Effect: +100 mag."
    elif e["name"] == "Sun Burst":
        e["notes"] = "Deal fire damage to all nearby enemies. Arbiter: Increases Radiant Judgement by 1; Burning Judgement Effect: +50 mag."

# Update base mechanic Channel Divinity for Arbiter notes
for m in cleric["powers"]["mechanic"]:
    if m["name"] == "Channel Divinity":
        m["castSecondsByParagon"] = {"Devout": 3.0, "Arbiter": 0}
        m.pop("castSeconds", None)
        m["notes"] = "Devout: Tap for Mark of Divinity; hold/release for Light of Divinity; hold 3s for Gathering Light. Arbiter: Restores divinity over time. May not move or attack while active."

# General/Skill feats
cleric["feats"] = [
    {"name": "Religion", "description": "Interact with religious objects and collect artifacts to sell from them.", "type": "skill"},
    {"name": "Divine Meditation", "description": "Increases divinity regeneration rate when out of combat.", "type": "skill"},
    {"name": "Composed Insight", "description": "Adds up to 10% Accuracy when stamina is full. Decreases as stamina decreases.", "type": "skill"},
    {"name": "Divine Protection", "description": "Adds up to 10% Critical Avoidance whenever your divinity is full. Decreases as divinity decreases.", "type": "skill"}
]

# ---- Arbiter paragon (DPS)
arb = next(p for p in cleric["paragonPaths"] if p["name"] == "Arbiter")
arb["atWill"] = [
    {"name": "Lance of Faith", "type": "atWill", "paragon": True, "magnitude": 110, "castSeconds": 0.6, "range": 80, "addedEffect": "Increases Burning Judgement by 1; Radiant Judgement Effect: +11 mag", "notes": "Threefold attack to target, dealing radiant damage."},
    {"name": "Conflagrate", "type": "atWill", "paragon": True, "magnitude": 150, "castSeconds": 1.8, "range": 80, "radius": 10, "addedEffect": "Increases Radiant Judgement by 3; Burning Judgement Effect: +15 mag", "notes": "Deal fire damage to target and nearby enemies."}
]
arb["encounter"] = [
    {"name": "Searing Javelin", "type": "encounter", "paragon": True, "magnitude": 470, "castSeconds": 1.1, "cooldownSeconds": 0.9, "divinityCost": 240, "range": 80, "radius": 8, "addedEffect": "Increases Radiant Judgement by 1; Burning Judgement Effect: +60 mag", "notes": "Deal fire damage to enemies in a line before you."},
    {"name": "Forgemaster's Flame", "type": "encounter", "paragon": True, "magnitude": 770, "castSeconds": 0.8, "cooldownSeconds": 0.9, "divinityCost": 300, "range": 80, "addedEffect": "Increases Radiant Judgement by 1; Burning Judgement Effect: +100 mag", "notes": "Deal fire damage to target enemy."},
    {"name": "Chains of Blazing Light", "type": "encounter", "paragon": True, "magnitude": 320, "castSeconds": 1.2, "cooldownSeconds": 15.2, "range": 80, "radius": 20, "durationSeconds": 5, "addedEffect": "Restrain + Increases Burning Judgement by 1; Radiant Judgement Effect: +40 mag", "notes": "Restrain enemies at target location and deal radiant damage."},
    {"name": "Break the Spirit", "type": "encounter", "paragon": True, "magnitude": 520, "castSeconds": 0.8, "cooldownSeconds": 20, "range": 80, "durationSeconds": 10, "addedEffect": "Target takes +10% damage from magical/projectile + Increases Burning Judgement by 1; Radiant Judgement Effect: +100 mag", "notes": "Deal radiant damage to target."},
    {"name": "Prophet of Doom", "type": "encounter", "paragon": True, "castSeconds": 1.2, "cooldownSeconds": 24.8, "range": 80, "durationSeconds": 10, "addedEffect": "10% of damage you deal to target is stored and dealt at duration end", "notes": "Predict the target's demise."}
]
arb["daily"] = [
    {"name": "Celestial Prominence", "type": "daily", "paragon": True, "magnitude": 700, "enhancedMagnitude": 1300, "castSeconds": 0, "actionPointCost": 1000, "range": 80, "radius": 15, "durationSeconds": 3, "addedEffect": "Stun + Increases Burning Judgement by 1; Radiant Judgement Effect: +100 mag. Auto-detonates after 15s.", "notes": "Summon radiant energy; reactivate to detonate and expand."},
    {"name": "Hammer of Fate", "type": "daily", "paragon": True, "magnitude": 1800, "castSeconds": 0.25, "actionPointCost": 1000, "range": 80, "addedEffect": "Increases Radiant Judgement by 3; Burning Judgement Effect: +100 mag", "notes": "Threefold attack to target. Total Combo Magnitude."}
]
arb["mechanic"] = [
    {"name": "Scales of Judgement", "type": "mechanic", "paragon": True, "notes": "Powers cost more divinity; certain powers fill Judgement Gauge (Radiant or Burning). Radiant is consumed by radiant powers (enhanced effect); Burning is consumed by fire powers (enhanced effect). Channel Divinity empties Gauge, restoring divinity."},
    {"name": "Forte", "type": "mechanic", "paragon": True, "notes": "Paragon provides Power increase, excels at Critical Severity and Deflect."}
]
arb["classFeatures"] = [
    {"name": "Critical Insight", "description": "Whenever you critically strike you recover 10 divinity.", "paragon": True},
    {"name": "Doomsayer", "description": "When you use an encounter that inflicts a negative condition, gain Doomsayer (10s): damage dealt +10%.", "paragon": True},
    {"name": "Light of the Scales", "description": "Increases divinity restored when Channel Divinity consumes Radiant Judgement or Burning Judgement by 10%.", "paragon": True, "active": True},
    {"name": "Divine Equilibrium", "description": "Damage dealt +15% when current divinity is exactly half of max. Decreases as divinity moves away from this point.", "paragon": True, "active": True}
]
arb["feats"] = [
    {"name": "Lightspeed", "description": "Searing Javelin grants Lightspeed (10s): Daunting Light cast time reduced; +1 Burning Judgement charge.", "paragon": True},
    {"name": "Focused Light", "description": "Forgemaster's Flame grants Focused Light (10s): Daunting Light becomes single-target, mag 450; Radiant Judgement effect mag 100.", "paragon": True},
    {"name": "Sudden Verdict", "description": "Encounter powers that generate Radiant/Burning Judgement now have 25% chance to instantly fill Judgement Gauge.", "paragon": True},
    {"name": "Critical Sun", "description": "When Celestial Prominence critically deals damage, may cast Celestial Prominence again without AP. Duration 6s. Can't trigger consecutively.", "paragon": True},
    {"name": "Perfect Balance", "description": "Radiant Shift / Burning Shift stack to 4 (+1% damage per stack, 60s). Imbalance >1 stack expires both. 4+4 stacks consumed restores divinity to full.", "paragon": True},
    {"name": "Angel of Death", "description": "Encounter powers that cost divinity grant Angelic Inspiration. At 26 stacks (60s), becomes Angelic Presence: Channel Divinity + release grants Angel of Death (12s) — cast damaging spells without divinity cost. Combat only.", "paragon": True},
    {"name": "Burning Patch", "description": "Flame Strike no longer DoTs; instead ignites target location for mag 3240 over 18s (540 x 6).", "paragon": True},
    {"name": "Inner Balance", "description": "Divinity restored when CD consumes Radiant Judgement: +20 if Critical Strike + Accuracy equal. Burning: +20 if Combat Advantage + Critical Severity equal. Diminished as ratings diverge.", "paragon": True}
]

CLASSES.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print("Cleric v2 — comprehensive Arbiter paragon + general/skill feats + per-paragon overrides.")
