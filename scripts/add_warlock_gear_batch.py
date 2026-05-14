"""Add 44 missing Warlock gear items from screenshot intake 2026-05-13.

Each entry captures one IL tier (highest seen in screenshots is preferred).
Schema matches existing gear.json: id, name, slot, item_level, allowedClasses,
ratingStats, percentStats, abilityBonuses, combinedRating, equipBonuses, set,
setSize, source, notes.
"""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

# Get next id
max_id = max((i.get('id', 0) for i in data), default=0)

INTAKE = "Warlock gear collection screenshot intake 2026-05-13."

def add(name, slot, il, rs, cr, source, set_name=None, set_size=None,
        allowed=None, equip=None, ps=None, ab=None, notes=None):
    global max_id
    max_id += 1
    entry = {
        "id": max_id,
        "name": name,
        "slot": slot,
        "item_level": il,
        "ratingStats": rs,
        "combinedRating": cr,
        "equipBonuses": equip or [],
        "set": set_name or "",
        "setSize": set_size or 0,
        "source": source,
        "percentStats": ps or {},
        "abilityBonuses": ab or {},
        "notes": notes or INTAKE
    }
    if allowed:
        entry["allowedClasses"] = allowed
    data.append(entry)

# ---------- Artifact weapons: Omen of Doom (Main Hand) + Codex of Eternal Chains (Off Hand) ----------
# Set: Whisper of Power (2pc, base) → Impending Doom (2pc, at higher tier)
# Highest IL seen: 4800
omen_eb = [
    {"type": "Set", "scope": "self", "stat": "Critical Severity", "amount": 2.5,
     "setName": "Impending Doom", "pieces": 2,
     "description": "2 of Set: Accumulate 18 Charges to consume them and become Unleashed. Charged by: 1 charge per Daily power (10s CD), 1 charge per Encounter power (1s CD), 1 charge per 5s in combat. Unleashed grants: DPS +4% Base Damage Boost, Heal +4% Outgoing Healing. Charges and Unleashed last 20s and are refreshable. Leaving combat removes all Charges."},
    {"type": "Set", "scope": "self", "stat": "Power", "amount": 2.5,
     "setName": "Impending Doom", "pieces": 2}
]
codex_eb = [
    {"type": "Set", "scope": "self", "stat": "Critical Severity", "amount": 2.5,
     "setName": "Impending Doom", "pieces": 2,
     "description": "Same 2pc set bonus as Omen of Doom partner. Accumulate 18 Charges → Unleashed grants role-based damage/healing boost."},
    {"type": "Set", "scope": "self", "stat": "Power", "amount": 2.5,
     "setName": "Impending Doom", "pieces": 2}
]
add("Omen of Doom", "Main Hand", 4800, {"Accuracy": 3120, "Critical Strike": 2880}, 4320,
    "Soul Harvest (Master)", "Impending Doom", 2, ["Warlock"], omen_eb,
    ps={"Damage Bonus": 100/100},  # +100 Damage flat appears at this IL
    notes="Artifact Equipment. Max IL 4800 from Soul Harvest Master. Lower tiers (3400/3750/3690+1/4100/4450) drop from Soul Collector Zone Mechanic and Soul Harvest Advanced. " + INTAKE)
add("Codex of Eternal Chains", "Off Hand", 4800, {"Accuracy": 3120, "Critical Strike": 2880}, 4320,
    "Soul Harvest (Master)", "Impending Doom", 2, ["Warlock"], codex_eb,
    notes="Artifact Equipment. Grimoire. Partner to Omen of Doom. " + INTAKE)

# ---------- Soulpiercer (Greater) set: Voidcaller's Treatise + Cursebearer's Maw + +Fang/+Trace ----------
soulpiercer_eb = [
    {"type": "Set", "scope": "self", "stat": "Movement Speed", "amount": 12,
     "setName": "Soulpiercer (Greater)", "pieces": 2,
     "description": "2 of Set: While in Thay, your Movement Speed is increased by 12% and your Damage is increased by 2%. Your Powers deal 2.5% more damage when you are 25' or further away from your target."},
    {"type": "Set", "scope": "self", "stat": "Damage Bonus", "amount": 2,
     "setName": "Soulpiercer (Greater)", "pieces": 2}
]
# Cursebearer's Maw (Pact Blade, Warlock) IL 4000
add("Cursebearer's Maw", "Main Hand", 4000, {"Critical Severity": 3510, "Forte": 3960}, 3600,
    "Shackles of Divinity (Master)", "Soulpiercer (Greater)", 2, ["Warlock"], soulpiercer_eb,
    ps={"Damage Bonus": 1.0},
    notes="Pact Blade. +100 Damage flat. " + INTAKE)
# Voidcaller's Trace (off-hand) IL 3800
add("Voidcaller's Trace", "Off Hand", 3800, {"Combat Advantage": 2052, "Critical Avoidance": 3449}, 3420,
    "Shackles of Divinity (Advanced)", "Soulpiercer", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Movement Speed", "amount": 10,
      "setName": "Soulpiercer", "pieces": 2,
      "description": "2 of Set: While in Thay, Movement Speed +10%, Damage +2%. Your powers deal 2.3% more damage when you are 25' or further away from your target."}],
    notes="Grimoire. Soulpiercer (base) variant. " + INTAKE)
# Cursebearer's Fang (Pact Blade) IL 3800
add("Cursebearer's Fang", "Main Hand", 3800, {"Accuracy": 3334, "Critical Severity": 3762}, 3420,
    "Shackles of Divinity (Advanced)", "Soulpiercer", 2, ["Warlock"],
    [{"type": "Set", "scope": "self", "stat": "Movement Speed", "amount": 10,
      "setName": "Soulpiercer", "pieces": 2}],
    ps={"Damage Bonus": 0.5},
    notes="Pact Blade. +50 Damage flat. " + INTAKE)

# ---------- Umbral Stride set: Doomscript Grimoire of the Thayan Zealot + Profaned Pact Blade ----------
# Both already in DB at IL 3300. Skip.

# ---------- Doomed Reaver Armor set: Infernal Tempest items (Warlock/Wizard) ----------
# Treads (Feet), Bracers (Arms), Robes (Chest), Circlet (Head) — all IL 5000, Soul Harvest (Master)
add("Treads of the Infernal Tempest", "Feet", 5000, {"Combat Advantage": 2400, "Forte": 2025}, 4500,
    "Soul Harvest (Master)", "Doomed Reaver Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Surge of Dominance", "description": "Whenever you use a Daily power, your Combat Advantage and Movement Speed increase by +15% for 3 seconds. (15 second cooldown)"}],
    ps={"Accuracy": 2925/1000})  # 2925 Accuracy
add("Bracers of the Infernal Tempest", "Arms", 5000, {"Critical Strike": 4050, "Forte": 3712}, 4500,
    "Soul Harvest (Master)", "Doomed Reaver Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Critical Flow", "description": "Whenever you Critically Strike with any Power, gain +4.5% Critical Strike and +1.5% Recharge Speed for 6 seconds."}])
add("Robes of the Infernal Tempest", "Armor", 5000, {"Combat Advantage": 3300, "Critical Severity": 4050}, 4500,
    "Soul Harvest (Master)", "Doomed Reaver Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Perfect Form", "description": "While your health is at Maximum, you gain a stack of Immaculate State per second. When not at Maximum health, you lose all stacks at once. Each stack grants +1.2% Combat Advantage. Maximum stacks: 5 (+6% Combat Advantage)."}])
add("Circlet of the Infernal Tempest", "Head", 5000, {"Critical Strike": 4050, "Forte": 3712}, 4500,
    "Soul Harvest (Master)", "Doomed Reaver Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Sharpened Instincts", "description": "Whenever you Critically Strike with an at-will power, gain +5% Critical Strike and Critical Severity for 6 seconds. Re-applying the effect will refresh its duration."}])

# ---------- Eternal Bloom set (Healer items — Warlock/Bard) — IL 5000 Soul Harvest (Master) ----------
add("Sabatons of the Eternal Bloom", "Feet", 5000, {"Critical Severity": 4050, "Outgoing Healing": 3300}, 4500,
    "Soul Harvest (Master)", "Eternal Bloom", 4, ["Warlock", "Bard"],
    [{"name": "Harmonizing Radiance", "description": "When you use an Encounter power, you have a 30% chance to pulse Harmonizing Light, granting yourself and the two closest friendly players within 20' +1% Power and +1.5% Critical Strike for 6 seconds. Re-applying the effect will refresh its duration."}])
add("Vambraces of the Eternal Bloom", "Arms", 5000, {"Critical Strike": 4050, "Outgoing Healing": 3300}, 4500,
    "Soul Harvest (Master)", "Eternal Bloom", 4, ["Warlock", "Bard"],
    [{"name": "Harmonized Momentum", "description": "Your Performance/Soulweave maximum is increased by 15%. While moving, your closest 4 nearby allies gain +0.8% Awareness. The effect is removed after standing still for 5 seconds."}])
add("Breastplate of the Eternal Bloom", "Armor", 5000, {"Critical Severity": 4050, "Outgoing Healing": 3300}, 4500,
    "Soul Harvest (Master)", "Eternal Bloom", 4, ["Warlock", "Bard"],
    [{"name": "Guardian's Impact", "description": "When you damage or heal your targets for more than 15% of your Maximum Hit Points in a single action, you and your 2 closest allies within 25' gain +1.3% Defense and +2% Critical Avoidance for 10 seconds (10 second cooldown)."}])
add("Hood of the Eternal Bloom", "Head", 5000, {"Critical Strike": 4050, "Outgoing Healing": 3300}, 4500,
    "Soul Harvest (Master)", "Eternal Bloom", 4, ["Warlock", "Bard"],
    [{"name": "Renewed Spirit", "description": "Your Divinity regenerates 25% faster."}])

# ---------- Scarlet Tempest set (DPS Warlock/Wizard) — IL 4700 Soul Harvest (Advanced) ----------
add("Boots of the Scarlet Tempest", "Feet", 4700, {"Combat Advantage": 3102, "Forte": 2855}, 4230,
    "Soul Harvest (Advanced)", "Dread March Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Frenzied Onslaught", "description": "Whenever you Critically Strike with your Powers, gain +3% Movement Speed and +7% Critical Severity for 5 seconds (8 second cooldown)."}])
add("Bindings of the Scarlet Tempest", "Arms", 4700, {"Combat Advantage": 3102, "Critical Severity": 3807}, 4230,
    "Soul Harvest (Advanced)", "Dread March Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Sanguine Strike", "description": "When you damage your targets for more than 15% of your Maximum Hit Points in a single blow, you gain +3.5% Critical Chance and +3.5% Critical Severity for 5 seconds. Additionally, you are healed for 5% of your health (7 second cooldown). Disabled in Thay Arena PvP."}])
add("Vestments of the Scarlet Tempest", "Armor", 4700, {"Critical Strike": 4653, "Critical Severity": 3807}, 4230,
    "Soul Harvest (Advanced)", "Dread March Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Vital Equilibrium", "description": "While your health is above 50%, gain +5% Power. When your health is below 50%, your Incoming Healing is increased by +7%. Disabled in Thay Arena PvP."}])
add("Hood of the Scarlet Tempest", "Head", 4700, {"Critical Strike": 3807, "Forte": 3490}, 4230,
    "Soul Harvest (Advanced)", "Dread March Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Focused Assault", "description": "When you use a Daily power, you gain +5% Power and +6.5% Critical Chance for 8 seconds (15 second cooldown)."}])

# ---------- Lifebloom set (Healer Warlock/Bard) — IL 4700 Soul Harvest (Advanced) ----------
add("Hood of the Lifebloom", "Head", 4700, {"Forte": 3490, "Outgoing Healing": 2538}, 4230,
    "Soul Harvest (Advanced)", "Dread March Armor", 4, ["Warlock", "Bard"],
    [{"name": "Flowing Vitality", "description": "After moving, your Performance/Soulweave regenerates 20% faster. You lose this benefit if you stand still for at least 4 seconds."}])
add("Cuirass of the Lifebloom", "Armor", 4700, {"Critical Strike": 4653, "Forte": 3807}, 4230,
    "Soul Harvest (Advanced)", "Dread March Armor", 4, ["Warlock", "Bard"],
    [{"name": "Radiant Empowerment", "description": "When you damage or heal your targets for more than 15% of your Maximum Hit Points in a single action, you and your 2 closest allies within 25' gain +3.5% Power for 5 seconds (5 second cooldown)."}])
add("Gauntlets of the Lifebloom", "Arms", 4700, {"Critical Severity": 3807, "Outgoing Healing": 3102}, 4230,
    "Soul Harvest (Advanced)", "Dread March Armor", 4, ["Warlock", "Bard"],
    [{"name": "Amplified Potential", "description": "Your Performance/Soulweave maximum is increased by 20%."}])
add("Boots of the Lifebloom", "Feet", 4700, {"Critical Strike": 3807, "Outgoing Healing": 3102}, 4230,
    "Soul Harvest (Advanced)", "Dread March Armor", 4, ["Warlock", "Bard"],
    [{"name": "Restorative Discipline", "description": "For every 3 seconds you are in combat, gain +0.4% Outgoing Healing and +0.2% Recharge Speed. Max 8 Stacks: +3.2% Outgoing Healing and +1.6% Recharge Speed. Each step sows vitality, leaving faint traces of flourishing life behind."}])

# ---------- Prismatic Defier of Dread set: Crystal/Bismuth Pactblades + Tomes ----------
prismatic_eb = [
    {"type": "Set", "scope": "self", "stat": "Movement Speed", "amount": 12,
     "setName": "Prismatic Defier of Dread", "pieces": 2,
     "description": "2 of Set: While in the Pirates' Skyhold or Dread Sanctum, your Movement Speed is increased by 12%. Every 3s in combat, gain a stack of Prismatic Force. Each stack grants role-based bonuses: General +0.35% Power, DPS +0.5% Critical Severity, Healer +0.4% Overall Outgoing Healing, Tank +0.4% Awareness. Max 10 stacks."}
]
add("Bismuth Pactblade", "Main Hand", 3400, {"Critical Severity": 3060, "Forte": 2295}, 3060,
    "Pirates' Skyhold / Dread Sanctum", "Prismatic Defier of Dread", 2, ["Warlock"], prismatic_eb,
    ps={"Damage Bonus": 1.0}, notes="+100 Damage flat. " + INTAKE)
add("Bismuth Tome", "Off Hand", 3400, {"Accuracy": 3315, "Combat Advantage": 2040}, 3060,
    "Pirates' Skyhold / Dread Sanctum", "Prismatic Defier of Dread", 2, ["Warlock"], prismatic_eb,
    ps={"Damage Bonus": 1.0}, notes="Grimoire. +100 Damage flat. " + INTAKE)
add("Crystal Pactblade", "Main Hand", 3100, {"Critical Severity": 2790, "Forte": 2092}, 2790,
    "Pirates' Skyhold / Dread Sanctum", "Prismatic Defier of Dread", 2, ["Warlock"], prismatic_eb,
    ps={"Damage Bonus": 1.0}, notes="+100 Damage flat. " + INTAKE)
add("Crystal Tome", "Off Hand", 3100, {"Accuracy": 3022, "Combat Advantage": 1860}, 2790,
    "Pirates' Skyhold / Dread Sanctum", "Prismatic Defier of Dread", 2, ["Warlock"], prismatic_eb,
    ps={"Damage Bonus": 1.0}, notes="Grimoire. +100 Damage flat. " + INTAKE)

# ---------- Skyhold Arms set: Bloodbrass Pactblade + Tome ----------
skyhold_eb = [
    {"type": "Set", "scope": "self", "stat": "Movement Speed", "amount": 12,
     "setName": "Skyhold Arms", "pieces": 2,
     "description": "2 of Set: While in the Pirates' Skyhold, your Movement Speed is increased by 12%. Every 3s in combat, gain a stack of Freebooter's Will. Each stack grants role-based bonuses: General +0.4% Power, DPS +0.55% Critical Severity, Healer +0.3% Overall Outgoing Healing, Tank +0.3% Awareness. Max 10 stacks."}
]
add("Bloodbrass Pactblade", "Main Hand", 2750, {"Critical Severity": 2475, "Forte": 1856}, 2475,
    "Pirates' Skyhold Campaign Store", "Skyhold Arms", 2, ["Warlock"], skyhold_eb,
    notes=INTAKE)
add("Bloodbrass Tome", "Off Hand", 2750, {"Accuracy": 2681, "Combat Advantage": 1650}, 2475,
    "Pirates' Skyhold Campaign Store", "Skyhold Arms", 2, ["Warlock"], skyhold_eb,
    notes="Grimoire. " + INTAKE)

# ---------- Prismatic Crystalline Armor (Warlock/Wizard or Warlock/Bard variants) — IL 3700 Dread Sanctum (Master) ----------
add("Prismatic Luminstep Boots", "Feet", 3700, {"Combat Advantage": 2220, "Critical Severity": 3330}, 3330,
    "Dread Sanctum (Master)", "Prismatic Crystalline Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Discharged Precision (Lesser)", "description": "When Action Points are less than 80%, your Accuracy is increased. +5% while outside of the Pirates' Skyhold or the Dread Sanctum. +10% while inside of the Pirates' Skyhold or the Dread Sanctum."}])
add("Prismatic Crystalweave Armlets", "Arms", 3700, {"Critical Strike": 3330, "Critical Severity": 3330}, 3330,
    "Dread Sanctum (Master)", "Prismatic Crystalline Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Enveloped Rage (Greater)", "description": "When in combat with 3 or more enemies, your Critical Severity is increased by 1.8% every 2 seconds. Every 2 seconds you are in combat with 1 or fewer enemies, lose 1 stack. Max 5 stacks: 9% Critical Severity."}])
add("Prismatic Bismuth Jerkin", "Armor", 3700, {"Accuracy": 1804, "Combat Advantage": 2220, "Forte": 1249}, 3330,
    "Dread Sanctum (Master)", "Prismatic Crystalline Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Tactical Daily (Greater)", "description": "When you deal damage with a Daily power, your next encounter power will deal 20% more damage. You gain 5% Combat Advantage. (30 second cooldown)"}])
add("Prismatic Fractal Cowl", "Head", 3700, {"Critical Strike": 3330, "Forte": 2498}, 3330,
    "Dread Sanctum (Master)", "Prismatic Crystalline Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Critical Spiker (Greater)", "description": "For every 3 seconds you are in combat, you gain 1.8% Critical Strike. Max Stacks: 5."}])
add("Prismatic Luminstep Greaves", "Feet", 3700, {"Forte": 2498, "Outgoing Healing": 2220}, 3330,
    "Dread Sanctum (Master)", "Prismatic Crystalline Armor", 4, ["Warlock", "Bard"],
    [{"name": "Ruthless Resources (Greater)", "description": "When you damage or heal your target for more than 10% of your Maximum Hit Points in a single blow, your Divinity/Performance/Soulweave regeneration for 15 seconds. (Max stack 5)"}])
add("Prismatic Crystalflex Bracers", "Arms", 3700, {"Critical Strike": 3330, "Outgoing Healing": 2220}, 3330,
    "Dread Sanctum (Master)", "Prismatic Crystalline Armor", 4, ["Warlock", "Bard"],
    [{"name": "Resourceful Forte (Greater)", "description": "Your Divinity/Performance/Soulweave maximum increases by 20%. Gain 3.5% Forte."}])
add("Prismatic Bismuth Mail", "Armor", 3700, {"Critical Severity": 3530, "Outgoing Healing": 2220}, 3330,
    "Dread Sanctum (Master)", "Prismatic Crystalline Armor", 4, ["Warlock", "Bard"],
    [{"name": "Healer's Influence (Greater)", "description": "Healing an ally with an Encounter power also heals you for 80,000 and grants you and close Allies 3% Defense for 5s."}])
add("Prismatic Fractal Barbut", "Head", 3700, {"Critical Strike": 3330, "Critical Severity": 3330}, 3330,
    "Dread Sanctum (Master)", "Prismatic Crystalline Armor", 4, ["Warlock", "Bard"],
    [{"name": "Gladiator's Restoration (Greater)", "description": "For every 3 seconds you are in combat, you gain 0.8% Outgoing Healing and Critical Strike. Max Stacks: 5."}])

# ---------- Crystalline Armor (non-prismatic) — IL 3350 Dread Sanctum (Advanced) ----------
add("Luminstep Boots", "Feet", 3350, {"Combat Advantage": 2010, "Critical Severity": 3015}, 3015,
    "Dread Sanctum (Advanced)", "Crystalline Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Discharged Precision (Lesser)", "description": "When Action Points are less than 80%, your Accuracy is increased. +5% outside Pirates' Skyhold/Dread Sanctum. +10% inside."}])
add("Crystalweave Armlets", "Arms", 3350, {"Accuracy": 1633, "Combat Advantage": 2010, "Forte": 1131}, 3015,
    "Dread Sanctum (Advanced)", "Crystalline Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Enveloped Rage (Greater)", "description": "When in combat with 3+ enemies, Critical Severity +1.8% every 2s. Max 5 stacks: 9% Critical Severity."}])
add("Bismuth Jerkin", "Armor", 3350, {"Critical Strike": 3015, "Critical Severity": 3015}, 3015,
    "Dread Sanctum (Advanced)", "Crystalline Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Tactical Daily (Greater)", "description": "Daily damage = next encounter +20% damage, +5% Combat Advantage. (30s cooldown)"}])
add("Fractal Cowl", "Head", 3350, {"Critical Strike": 3015, "Forte": 2261}, 3015,
    "Dread Sanctum (Advanced)", "Crystalline Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Critical Spiker (Greater)", "description": "Every 3s in combat: +1.8% Critical Strike. Max 5 stacks."}])
add("Fractal Barbut", "Head", 3350, {"Critical Strike": 3015, "Critical Severity": 3015}, 3015,
    "Dread Sanctum (Advanced)", "Crystalline Armor", 4, ["Warlock", "Bard"],
    [{"name": "Gladiator's Restoration (Greater)", "description": "Every 3s in combat: +0.8% Outgoing Healing and Critical Strike. Max 5 stacks."}])
add("Bismuth Mail", "Armor", 3350, {"Critical Strike": 3015, "Critical Severity": 3015}, 3015,
    "Dread Sanctum (Advanced)", "Crystalline Armor", 4, ["Warlock", "Bard"],
    [{"name": "Healer's Influence (Greater)", "description": "Encounter heal on ally also heals you 80,000 and grants you and close Allies 3% Defense for 5s."}])
add("Crystalflex Bracers", "Arms", 3350, {"Critical Strike": 3015, "Outgoing Healing": 2010}, 3015,
    "Dread Sanctum (Advanced)", "Crystalline Armor", 4, ["Warlock", "Bard"],
    [{"name": "Resourceful Forte (Greater)", "description": "+20% Divinity/Performance/Soulweave maximum. +3.5% Forte."}])

# ---------- Enchanted Depths Armor — IL 3000 Lair of the Mad Dragon (Advanced) ----------
add("Depthweave Hood", "Head", 3000, {"Combat Advantage": 2250, "Critical Strike": 2250}, 2700,
    "Lair of the Mad Dragon (Advanced)", "Enchanted Depths Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Combatant's Advantage", "description": "Every 3 seconds in combat, +0.8% Combat Advantage. Max 10 stacks: 8% Combat Advantage."}])
add("Depthweave Slippers", "Feet", 3000, {"Combat Advantage": 2250, "Critical Severity": 2250}, 2700,
    "Lair of the Mad Dragon (Advanced)", "Enchanted Depths Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Fiery Predator", "description": "+3.5% Damage on fire-themed maps. +1% Damage on other maps."}])
add("Depthweave Robe", "Armor", 3000, {"Accuracy": 1125, "Combat Advantage": 2250, "Forte": 1125}, 2700,
    "Lair of the Mad Dragon (Advanced)", "Enchanted Depths Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Ruthless Might", "description": "When you damage or heal your target for more than 10% of your Maximum Hit Points in a single blow, you gain 1.5% Critical Strike and Critical Severity for 15 seconds. Max 5 stacks: 7.5%."}])
add("Depthweave Sleeves", "Arms", 3000, {"Critical Strike": 2250, "Critical Severity": 2250}, 2700,
    "Lair of the Mad Dragon (Advanced)", "Enchanted Depths Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Enveloped Precision", "description": "When in combat with 3 or more enemies, your Critical Strike is increased by 1.3% every 2 seconds. Max 5 stacks: 6.5% Critical Strike."}])
add("Depthcured Skullcap", "Head", 3000, {"Forte": 2250, "Outgoing Healing": 2250}, 2700,
    "Lair of the Mad Dragon (Advanced)", "Enchanted Depths Armor", 4, ["Warlock", "Bard"],
    [{"name": "Channeler's Focus", "description": "Every 3 seconds in combat, +0.4% Outgoing Healing and 0.4% Power. Max 10 stacks: 4% Outgoing Healing and 4% Power."}])
add("Depthcured Cackrows", "Feet", 3000, {"Critical Strike": 2250, "Outgoing Healing": 2250}, 2700,
    "Lair of the Mad Dragon (Advanced)", "Enchanted Depths Armor", 4, ["Warlock", "Bard"],
    [{"name": "Fiery Muse", "description": "Your Divinity/Performance/Soulweave regenerates 12% faster while on fire-themed maps. On other maps the regen bonus is 6%. Gain 4% Outgoing Healing."}])
add("Depthcured Doublet", "Armor", 3000, {"Critical Strike": 2250, "Critical Severity": 2250}, 2700,
    "Lair of the Mad Dragon (Advanced)", "Enchanted Depths Armor", 4, ["Warlock", "Bard"],
    [{"name": "Ruthless Might", "description": "Damage or heal target >10% Max HP = +1.5% Critical Strike and Critical Severity for 15s. Max 5 stacks: 7.5%."}])
add("Depthcured Cuffs", "Arms", 3000, {"Critical Severity": 2250, "Outgoing Healing": 2250}, 2700,
    "Lair of the Mad Dragon (Advanced)", "Enchanted Depths Armor", 4, ["Warlock", "Bard"],
    [{"name": "Spiritual Inspiration", "description": "Your Performance/Soulweave maximum increases by 15%. Gain 3% Forte."}])

# ---------- Dark Matter set: Solarium / Voidtouched / Starcore / Xaryxian Pactblade + Tome ----------
dark_matter_eb = [
    {"type": "Set", "scope": "self", "roleMap": {
        "DPS": {"stat": "Damage Bonus", "amount": 3},
        "Tank": {"stat": "Incoming Damage", "amount": -6},
        "Heal": {"stat": "Overall Outgoing Healing", "amount": 4}
    }, "setName": "Dark Matter", "pieces": 2,
     "description": "2 of Set: Deal or heal up to 5.5% additional damage based on the difference in hit point percentage between the player and the target. DPS +3% Base Damage Boost, Tank -6% Incoming Damage, Healer +4% Overall Outgoing Healing. Does not stack. When in Wildspace, the above bonuses are doubled, and your Movement Speed is increased by 10%."}
]
add("Starcore Tome", "Off Hand", 2500, {"Combat Advantage": 1875, "Critical Strike": 1875}, 2250,
    "Defense of the Moondancer (Advanced)", "Dark Matter", 2, ["Warlock"], dark_matter_eb,
    notes="Grimoire. " + INTAKE)
add("Starcore Tome +1", "Off Hand", 2700, {"Combat Advantage": 2025, "Critical Strike": 2025}, 2430,
    "Defense of the Moondancer (Master)", "Dark Matter", 2, ["Warlock"], dark_matter_eb,
    notes="Grimoire. Maximum Quality. " + INTAKE)

# ---------- Peer Into the Void set: Xaryxian/Voidtouched Pactblade + Tome ----------
peer_void_eb = [
    {"type": "Set", "scope": "self", "stat": "Overall Outgoing Healing", "amount": 1,
     "setName": "Peer Into the Void", "pieces": 2,
     "description": "2 of Set: +1% Overall Outgoing Healing and -5% Incoming Damage. When in Wildspace, your Movement Speed is increased by 12%. Every 2s in combat with a single opponent, gain a stack of Darklight. Every 2s in combat with 4+ opponents, lose a stack. Based on your role, each stack of Darklight grants: DPS +0.6% Base Damage Boost, Tank -0.6% Incoming Damage, Healer +0.6% Overall Outgoing Healing. Max 10 stacks. Stack bonuses doubled in Wildspace."}
]
add("Xaryxian Tome", "Off Hand", 2750, {"Accuracy": 2062, "Combat Advantage": 2062}, 2475,
    "The Imperial Citadel (Advanced)", "Peer Into the Void", 2, ["Warlock"], peer_void_eb,
    notes="Grimoire. " + INTAKE)
add("Xaryxian Pactblade", "Main Hand", 2750, {"Critical Severity": 2062, "Forte": 2062}, 2475,
    "The Imperial Citadel (Advanced)", "Peer Into the Void", 2, ["Warlock"], peer_void_eb,
    ps={"Damage Bonus": 2.5}, notes="+250 Damage flat. " + INTAKE)
add("Voidtouched Tome", "Off Hand", 3000, {"Accuracy": 2250, "Combat Advantage": 2250}, 2700,
    "The Imperial Citadel (Master)", "Peer Into the Void", 2, ["Warlock"], peer_void_eb,
    notes="Grimoire. " + INTAKE)

# ---------- Meteoric Fury set: Meteoric Iron Pactblade + Tome ----------
meteoric_eb = [
    {"type": "Set", "scope": "self", "roleMap": {
        "DPS": {"stat": "Damage Bonus", "amount": 2},
        "Tank": {"stat": "Incoming Damage", "amount": -4},
        "Heal": {"stat": "Overall Outgoing Healing", "amount": 4}
    }, "setName": "Meteoric Fury", "pieces": 2,
     "description": "2 of Set: Deal or heal up to 9% additional damage based on the difference in hit point percentage between the player and the target. DPS +2% Base Damage Boost, Tank -4% Incoming Damage, Healer +4% Overall Outgoing Healing. Does not stack. When in Wildspace, the above bonuses are doubled, and your Movement Speed is increased by 15%."}
]
add("Meteoric Iron Tome", "Off Hand", 2450, {"Forte": 1838, "Outgoing Healing": 1838}, 2205,
    "Adventures in Wildspace Campaign", "Meteoric Fury", 2, ["Warlock"], meteoric_eb,
    notes="Grimoire. " + INTAKE)
add("Meteoric Iron Pactblade", "Main Hand", 2450, {"Critical Strike": 1838, "Forte": 1838}, 2205,
    "Adventures in Wildspace Campaign", "Meteoric Fury", 2, ["Warlock"], meteoric_eb,
    notes=INTAKE)

# ---------- Ultraviolet Elven Armor (Warlock/Wizard and Warlock/Bard variants) — IL 2900 Imperial Citadel (Master) ----------
add("Ultraviolet Elven Cap", "Head", 2900, {"Combat Advantage": 2175, "Critical Severity": 2175}, 2610,
    "The Imperial Citadel (Master)", "Ultraviolet Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Combatant's Advantage", "description": "Every 3 seconds in combat, +1% Combat Advantage. Max 10 stacks."}])
add("Ultraviolet Elven Coat", "Armor", 2900, {"Critical Strike": 2175, "Forte": 2175}, 2610,
    "The Imperial Citadel (Master)", "Ultraviolet Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Focused Daily", "description": "When you use a Daily power, your next encounter power will deal 20% more damage. (10 second cooldown) Additionally, when Focused Daily triggers, you gain 2.5% Critical Severity for 10s."}])
add("Ultraviolet Elven Sleeves", "Arms", 2900, {"Accuracy": 1088, "Combat Advantage": 2175, "Forte": 1088}, 2610,
    "The Imperial Citadel (Master)", "Ultraviolet Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Challenger's Precision", "description": "When in combat with only 1 enemy, your Critical Strike is increased by 1.5% every 2 seconds. Every 2 seconds you are in combat with 4 or more enemies, lose 1 stack. Max 5 stacks: 7.5% Critical Strike."}])
add("Ultraviolet Elven Poulaines", "Feet", 2900, {"Critical Strike": 2175, "Critical Severity": 2175}, 2610,
    "The Imperial Citadel (Master)", "Ultraviolet Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Wildspace Predator", "description": "+7% Damage in Wildspace. +3% Damage in non-Wildspace."}])
add("Ultraviolet Elven Coif", "Head", 2900, {"Critical Strike": 2175, "Outgoing Healing": 2175}, 2610,
    "The Imperial Citadel (Master)", "Ultraviolet Armor", 4, ["Warlock", "Bard"],
    [{"name": "Channeler's Focus", "description": "Every 3s in combat: +0.5% Outgoing Healing and 0.5% Power. Max 10 stacks: 5% each."}])
add("Ultraviolet Elven Leathers", "Armor", 2900, {"Forte": 2175, "Outgoing Healing": 2175}, 2610,
    "The Imperial Citadel (Master)", "Ultraviolet Armor", 4, ["Warlock", "Bard"],
    [{"name": "Medic's Respite", "description": "Healing an ally with an Encounter power also heals you for 80,000 and grants Allies within 25' +1.5% Awareness and Incoming Healing for 5s."}])
add("Ultraviolet Elven Armlets", "Arms", 2900, {"Critical Strike": 2175, "Critical Severity": 2175}, 2610,
    "The Imperial Citadel (Master)", "Ultraviolet Armor", 4, ["Warlock", "Bard"],
    [{"name": "Spiritual Inspiration", "description": "Your Performance/Soulweave maximum increases by 25%. Gain 2.5% Forte."}])
add("Ultraviolet Elven Boots", "Feet", 2900, {"Forte": 2175, "Outgoing Healing": 2175}, 2610,
    "The Imperial Citadel (Master)", "Ultraviolet Armor", 4, ["Warlock", "Bard"],
    [{"name": "Galactic Muse", "description": "Your Divinity/Performance/Soulweave regenerates 20% faster while in Wildspace. In non-Wildspace, the regen bonus is 10%. Gain 2.5% Outgoing Healing."}])

# ---------- Radiant Elven Armor (Warlock/Wizard and Warlock/Bard) — IL 2800 Imperial Citadel (Advanced) ----------
add("Radiant Elven Hood", "Head", 2800, {"Combat Advantage": 2100, "Critical Severity": 2100}, 2520,
    "The Imperial Citadel (Advanced)", "Radiant Elven Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Spelljammer's Advantage", "description": "Every 3s in combat, +0.65% Combat Advantage. Max 7 stacks (10 in Wildspace)."}])
add("Radiant Elven Robe", "Armor", 2800, {"Critical Strike": 2100, "Forte": 2100}, 2520,
    "The Imperial Citadel (Advanced)", "Radiant Elven Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Shielded Might", "description": "When you have a Shield or Temp HP in Wildspace, gain 7.5% Critical Strike and 7.5% Critical Severity. In non-Wildspace, these bonuses are reduced to 3.8% Critical Strike and 3.8% Critical Severity."}])
add("Radiant Elven Sleeves", "Arms", 2800, {"Accuracy": 1050, "Combat Advantage": 2100, "Forte": 1050}, 2520,
    "The Imperial Citadel (Advanced)", "Radiant Elven Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Challenger's Presence", "description": "When in combat with only 1 enemy, every 2s you gain 875 Power and 0.5% Critical Strike. Every 2s in combat with 4+ enemies, lose 1 stack. Max 5 stacks: 4,375 Power and 2.5% Critical Strike."}])
add("Radiant Elven Slippers", "Feet", 2800, {"Critical Strike": 2100, "Critical Severity": 2100}, 2520,
    "The Imperial Citadel (Advanced)", "Radiant Elven Armor", 4, ["Warlock", "Wizard"],
    [{"name": "Wildspace Precision", "description": "+7.5% Critical Strike in Wildspace. +3% Critical Strike in non-Wildspace."}])
add("Radiant Elven Cackrows", "Feet", 2800, {"Forte": 2100, "Outgoing Healing": 2100}, 2520,
    "The Imperial Citadel (Advanced)", "Radiant Elven Armor", 4, ["Warlock", "Bard"],
    [{"name": "Galactic Muse", "description": "Performance/Soulweave regenerates 10% faster in Wildspace. In non-Wildspace, the regen bonus is 5%. Gain 2.5% Outgoing Healing."}])
add("Radiant Elven Cuffs", "Arms", 2800, {"Critical Strike": 2100, "Critical Severity": 2100}, 2520,
    "The Imperial Citadel (Advanced)", "Radiant Elven Armor", 4, ["Warlock", "Bard"],
    [{"name": "Challenger's Alacrity", "description": "When in combat with only 1 enemy, your Recharge Speed is increased by 0.6% every 2 seconds. Every 2s in combat with 4+ enemies, lose 1 stack. Max 5 stacks: 3% Recharge Speed."}])
add("Radiant Elven Doublet", "Armor", 2800, {"Forte": 2100, "Outgoing Healing": 2100}, 2520,
    "The Imperial Citadel (Advanced)", "Radiant Elven Armor", 4, ["Warlock", "Bard"],
    [{"name": "Survivor's Gift", "description": "Your current Hit Points increases your Outgoing Healing by a max of 6%, and your Power up to a max of 4,375. Currently: 6% Outgoing Healing and 4,375 Power."}])
add("Radiant Elven Skullcap", "Head", 2800, {"Critical Strike": 2100, "Outgoing Healing": 2100}, 2520,
    "The Imperial Citadel (Advanced)", "Radiant Elven Armor", 4, ["Warlock", "Bard"],
    [{"name": "Wildspace Gladiator", "description": "For every 5s in combat, gain 1% Critical Strike. Max 7 stacks (13 in Wildspace)."}])

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. New max id: {max_id}")
print(f"Total items now: {len(data)}")
