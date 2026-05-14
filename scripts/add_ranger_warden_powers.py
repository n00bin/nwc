"""Add Warden paragon at-wills + encounters + per-paragon magnitude overrides."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/classes.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

ranger = next(c for c in data if c["name"] == "Ranger")

# Add magnitudeByParagon override to class-shared at-wills where values differ
for aw in ranger["powers"]["atWill"]:
    if aw["name"] == "Rapid Shot":
        aw["magnitudeByParagon"] = {"Hunter": 65, "Warden": 90}
    elif aw["name"] == "Rapid Strike":
        aw["magnitudeByParagon"] = {"Hunter": 55, "Warden": 80}
        aw["enhancedMagnitudeByParagon"] = {"Hunter": 80, "Warden": 120}

# Warden encounter cooldowns ~4% lower than Hunter — capture as cooldownByParagon
warden_encounter_cd = {
    "Hindering Shot": 10.4, "Hindering Strike": 12.1,
    "Marauder's Escape": 13.0, "Marauder's Rush": 12.1,
    "Constricting Arrow": 13.0, "Steel Breeze": 12.1,
    "Rain of Arrows": 13.9, "Rain of Swords": 12.1,
    "Cordon of Arrows": 17.3, "Plant Growth": 17.3
}
hunter_encounter_cd = {
    "Hindering Shot": 10.8, "Hindering Strike": 12.6,
    "Marauder's Escape": 13.5, "Marauder's Rush": 12.6,
    "Constricting Arrow": 13.5, "Steel Breeze": 12.6,
    "Rain of Arrows": 14.4, "Rain of Swords": 12.6,
    "Cordon of Arrows": 18.0, "Plant Growth": 18.0
}
for enc in ranger["powers"]["encounter"]:
    if enc["name"] in warden_encounter_cd:
        enc["cooldownByParagon"] = {
            "Hunter": hunter_encounter_cd[enc["name"]],
            "Warden": warden_encounter_cd[enc["name"]]
        }
        enc.pop("cooldownSeconds", None)

warden = next(p for p in ranger["paragonPaths"] if p["name"] == "Warden")
warden["powers"] = warden.get("powers", {})

# Warden paragon at-wills
warden["powers"]["atWill"] = [
    {"name": "Electric Shot", "type": "atWill", "paragon": True, "stance": "ranged", "magnitude": 100, "castSeconds": 0.7, "range": 80, "radius": 25, "notes": "Storm-imbued arrow; gust of damage in an area around them."},
    {"name": "Clear the Ground", "type": "atWill", "paragon": True, "stance": "melee", "magnitude": 60, "castSeconds": 0.4, "radius": 15, "notes": "Slice enemies in an area, dealing lightning damage."},
    {"name": "Penetrating Arrows", "type": "atWill", "paragon": True, "stance": "ranged", "magnitude": 90, "castSeconds": 0.7, "range": 80, "radius": 3, "notes": "Line up a shot and fire a penetrating arrow, damage to all enemies in a line."},
    {"name": "Storm Strike", "type": "atWill", "paragon": True, "stance": "melee", "magnitude": 110, "castSeconds": 0.6, "notes": "Series of heavy blows; final strike causes target struck by lightning, half magnitude lightning to nearby enemies."}
]

# Warden paragon encounters
warden["powers"]["encounter"] = [
    {"name": "Split the Sky", "type": "encounter", "paragon": True, "stance": "ranged", "magnitude": "225x5", "castSeconds": 1.5, "cooldownSeconds": 15.6, "range": 80, "radius": 30, "durationSeconds": 3, "addedEffect": "Slow", "notes": "Open a storm in a large area; random enemy struck by lightning and slowed."},
    {"name": "Throw Caution", "type": "encounter", "paragon": True, "stance": "melee", "magnitude": 500, "castSeconds": 0.5, "cooldownSeconds": 10.4, "durationSeconds": 5, "addedEffect": "+10% damage", "notes": "Recklessly attack your enemy."},
    {"name": "Boar Hide", "type": "encounter", "paragon": True, "stance": "ranged", "castSeconds": 0.5, "cooldownSeconds": 17.3, "radius": 100, "addedEffect": "Increases Defense by 2% per stack (5 stacks Thick Skin)", "notes": "Grants yourself and nearby allies 5 stacks of Thick Skin. Taking damage removes a stack."},
    {"name": "Boar Charge", "type": "encounter", "paragon": True, "stance": "melee", "magnitude": 585, "castSeconds": 0.1, "cooldownSeconds": 13.9, "range": 26, "durationSeconds": 1, "addedEffect": "Knockdown", "notes": "Charge your enemy."},
    {"name": "Fox's Cunning", "type": "encounter", "paragon": True, "stance": "ranged", "castSeconds": 0.5, "cooldownSeconds": 19.1, "radius": 100, "durationSeconds": 8, "addedEffect": "+10% damage resistance to you and nearby allies", "notes": "With the agility of the fox."},
    {"name": "Fox Shift", "type": "encounter", "paragon": True, "stance": "melee", "magnitude": "400x3", "castSeconds": 0.1, "cooldownSeconds": 15.6, "range": 15, "durationSeconds": 7, "addedEffect": "Increase MS / Slow target", "notes": "Perform 3 dashes, each to a nearby enemy."},
    {"name": "Binding Arrow", "type": "encounter", "paragon": True, "stance": "ranged", "magnitude": 1000, "castSeconds": 0.7, "cooldownSeconds": 15.6, "range": 80, "addedEffect": "Strong Grasping Roots", "notes": "Fire a binding arrow at opponent."},
    {"name": "Oak Skin", "type": "encounter", "paragon": True, "stance": "melee", "castSeconds": 0.6, "cooldownSeconds": 0, "radius": 100, "durationSeconds": 9, "addedEffect": "Self: heals 9% max HP + 10% incoming healing. Allies: 4.5% + 5%.", "notes": "Enhances yourself and nearby allies with Oaken Skin."},
    {"name": "Thorn Ward", "type": "encounter", "paragon": True, "stance": "ranged", "magnitude": "200x6", "castSeconds": 1.5, "cooldownSeconds": 19.1, "range": 40, "rangeBeam": 25, "durationSeconds": 10, "addedEffect": "+10% projectile and physical damage taken; each hit refreshes effect.", "notes": "Summon a thorn ward to attack your enemy."},
    {"name": "Thorn Strike", "type": "encounter", "paragon": True, "stance": "melee", "minMagnitude": 500, "maxMagnitude": 750, "castSeconds": 0.7, "cooldownSeconds": 10.4, "notes": "Strike enemy with thorny vines that deal more damage the lower the target's current hitpoints are."}
]

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Warden at-wills: {len(warden['powers']['atWill'])}")
print(f"Warden encounters: {len(warden['powers']['encounter'])}")
print(f"Class shared at-wills with magnitudeByParagon: {sum(1 for a in ranger['powers']['atWill'] if 'magnitudeByParagon' in a)}")
print(f"Class shared encounters with cooldownByParagon: {sum(1 for e in ranger['powers']['encounter'] if 'cooldownByParagon' in e)}")
