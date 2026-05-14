"""Populate Warlock class + Hellbringer/Soulweaver paragons from screenshots 2026-05-13."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/classes.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

warlock = next(c for c in data if c["name"] == "Warlock")

# --- Class-wide class skills (visible in both paragons' Skills tab) ---
warlock["classFeatures"] = [
    {"name": "Arcana", "description": "Innate understanding of arcane forces and how to interact with magical objects.", "notes": "Lore skill; no combat stats. Auto-applied."},
    {"name": "Demonic Vision", "description": "Adds 2.5% Awareness.", "percentStats": {"Awareness": 2.5}, "notes": "Warlock class skill. Auto-applied."},
    {"name": "Devastating Critical", "description": "Adds 10% Critical Severity.", "percentStats": {"Critical Severity": 10}, "notes": "Warlock class skill. Auto-applied."},
    {"name": "Vengeful Blades", "description": "5% chance to deal physical damage (magnitude 100) to attackers whenever you take damage.", "trigger": "on damage taken", "chance": 5, "notes": "Warlock class skill visible in Soulweaver Skills tab. Auto-applied retaliation proc."},
    {"name": "Vengeful Curse", "description": "When damaged, 5% chance to apply Curse to your attacker.", "trigger": "on damage taken", "chance": 5, "notes": "Warlock class skill visible in Hellbringer Skills tab. Auto-applied curse proc."}
]

# --- Class-shared at-wills (visible from both paragon views) ---
warlock["powers"]["atWill"] = [
    {"name": "Dark Helix", "type": "atWill", "magnitude": 135, "perDarkSpiralBonus": 50, "castSeconds": 0.9, "range": 80, "addedEffect": "Killing enemy grants Dark Spiral (max 2 stacks)", "notes": "Hellbringer view also: +2 Soul Sparks +1 per Dark Spiral consumed. Damage type: necrotic."},
    {"name": "Eldritch Blast", "type": "atWill", "magnitude": 45, "enhancedMagnitude": 90, "castSeconds": 0.4, "range": 80, "addedEffect": "Threefold attack; third hit AoE 12'; Hellbringer enhanced: +1 Soul Spark", "notes": "Damage type: necrotic."}
]

# --- Class-shared encounters (same names show across paragons; magnitudes/effects differ slightly) ---
warlock["powers"]["encounter"] = [
    {
        "name": "Arms of Hadar", "type": "encounter", "magnitude": 175, "castSeconds": 0.95, "cooldownSeconds": 1.8,
        "range": 35, "radius": 8, "addedEffect": "Knockdown",
        "notes": "AoE necrotic damage in path before you. Cooldown +2s with each use (resets after 10s)."
    },
    {
        "name": "Vampiric Embrace", "type": "encounter", "castSeconds": 0.6, "range": 80,
        "magnitudeByParagon": {"Soulweaver": 200, "Hellbringer": 500},
        "cooldownByParagon": {"Soulweaver": 0.5, "Hellbringer": 8.5},
        "soulweaveCost": 200,
        "addedEffect": "Soulweaver: heal self+allies 600 mag + HoT 250/12s. Hellbringer: absorb damage dealt as HP; Curse Consume doubles HP absorbed.",
        "notes": "Necrotic damage to target."
    },
    {
        "name": "Blades of Vanquished Armies", "type": "encounter",
        "magnitude": "130x3 (390)", "castSeconds": 0.7, "range": 80, "durationSeconds": 6,
        "cooldownByParagon": {"Soulweaver": 10.2, "Hellbringer": 9.4},
        "addedEffect": "Whirling blades follow target; -5% target damage taken within 12'. Hellbringer Curse Synergy: +50% damage to cursed enemies.",
        "notes": "Surrounds party member or self with whirling blades."
    },
    {
        "name": "Hadar's Grasp", "type": "encounter", "castSeconds": 0.55, "range": 80, "durationSeconds": 2,
        "magnitudeByParagon": {"Soulweaver": 200, "Hellbringer": 300},
        "cooldownByParagon": {"Soulweaver": 13.9, "Hellbringer": 12.8},
        "dotMagnitude": 300, "addedEffect": "Hold + DoT. Hellbringer Curse Consume: held +1s, +150 mag, summons Soul Puppet, Curse expended.",
        "notes": "Grab enemy with necrotic force."
    },
    {
        "name": "Dreadtheft", "type": "encounter", "castSeconds": 0.3, "range": 80, "radius": 4, "durationSeconds": 4,
        "magnitudeByParagon": {"Soulweaver": "175x4 (700)", "Hellbringer": "200x4 (800)"},
        "cooldownByParagon": {"Soulweaver": 10.2, "Hellbringer": 9.4},
        "addedEffect": "Channel; cannot execute other actions. Hellbringer Curse Synergy: refreshes Curse on all targets hit.",
        "notes": "Necrotic damage to enemies in a line."
    }
]

# --- Class-shared dailies ---
warlock["powers"]["daily"] = [
    {"name": "Soul Siphon", "type": "daily", "castSeconds": 2, "radius": 40, "actionPointCost": 1000,
     "magnitudeByParagon": {"Soulweaver": 600, "Hellbringer": "600x2"},
     "addedEffectByParagon": {
         "Soulweaver": "Heal yourself and nearby allies mag 1500",
         "Hellbringer": "Curse + summon Soul Puppet"
     },
     "notes": "Necrotic damage to nearby enemies."},
    {"name": "Brood of Hadar", "type": "daily", "magnitude": 800, "secondaryMagnitude": 400, "castSeconds": 1.3,
     "range": 80, "actionPointCost": 1000, "stunSeconds": 2, "durationSeconds": 10,
     "addedEffect": "Stun + AoE necrotic + summons 6 shadow imps (mag 200) for 10s.",
     "notes": "Necrotic damage to target enemy."},
    {"name": "Flames of Phlegethos", "type": "daily", "magnitude": 500, "dotMagnitude": 1600, "dotDurationSeconds": 4,
     "castSeconds": 1.45, "range": 80, "actionPointCost": 1000,
     "addedEffect": "DoT + Combat Advantage",
     "notes": "Rain deadly fire upon an enemy."}
]

# --- Class-shared mechanic ---
warlock["powers"]["mechanic"] = [
    {"name": "Shadow Slip", "type": "mechanic", "tactical": True, "castSeconds": 0, "range": "Self",
     "addedEffect": "+100% MS, drains stamina; first 1s grants Control Immunity (3s ICD).",
     "notes": "Warlock dodge."}
]

# --- Soulweaver paragon ---
soulweaver = next(p for p in warlock["paragonPaths"] if p["name"] == "Soulweaver")
soulweaver["powers"] = {
    "atWill": [
        {"name": "Soul Reconstruction", "type": "atWill", "paragon": True, "castSeconds": 0, "cooldownSeconds": 1, "range": "Self/ally", "healMagnitude": 275, "soulweaveCost": 40, "notes": "Heal target ally or self."},
        {"name": "Infernal Sanction", "type": "atWill", "paragon": True, "castSeconds": 1, "cooldownSeconds": 0.5, "range": "Self/ally", "healMagnitude": 50, "barrierMagnitude": 800, "durationSeconds": 20, "soulweaveCost": 80, "notes": "Heal + raise Infernal Barrier that absorbs damage."}
    ],
    "encounter": [
        {"name": "Revitalize", "type": "encounter", "paragon": True, "castSeconds": 0.8, "cooldownSeconds": 0.5, "range": 80, "radius": 20, "healMagnitude": 850, "hotMagnitude": 200, "durationSeconds": 12, "soulweaveCost": 100, "addedEffect": "Removes one negative condition. Heal mag decreases with target count.", "notes": "Heal allies at target location."},
        {"name": "Pillar of Power", "type": "encounter", "paragon": True, "castSeconds": 0.5, "cooldownSeconds": 23.2, "radius": 8, "durationSeconds": 10, "addedEffect": "+5% damage dealt, +5% outgoing healing, -5% damage taken to party members in pillar.", "notes": "Erects conduit of power."},
        {"name": "Wraith's Shadow", "type": "encounter", "paragon": True, "magnitude": 500, "castSeconds": 0.8, "cooldownSeconds": 17.6, "range": 80, "durationSeconds": 6, "addedEffect": "-5% target damage dealt + Slow.", "notes": "Necrotic damage."},
        {"name": "Soulstorm", "type": "encounter", "paragon": True, "castSeconds": 1.1, "cooldownSeconds": 0.4, "range": 80, "healMagnitude": 500, "hotMagnitude": 250, "durationSeconds": 12, "soulweaveCost": 220, "notes": "Circle at target location healing party. Recasting ends effect early."},
        {"name": "Warlock's Bargain", "type": "encounter", "paragon": True, "castSeconds": 0.9, "cooldownSeconds": 25.1, "range": "Self", "durationSeconds": 10, "addedEffect": "Absorb lifespark, restore soulweave, +10% outgoing healing. Lifespark returns when effect ends.", "notes": "Self-utility."}
    ],
    "daily": [
        {"name": "Soul Barrier", "type": "daily", "paragon": True, "castSeconds": 0.48, "range": "Self", "actionPointCost": 1000, "hotMagnitude": 250, "hotDurationSeconds": 12, "barrierDurationSeconds": 20, "addedEffect": "Lifespark summons barrier around damaged allies within 70', -10% damage taken. Infernal Barrier absorbs damage = HP healed. Cannot take other actions while channeling.", "notes": "Channeled defensive daily."},
        {"name": "Soul Pact", "type": "daily", "paragon": True, "castSeconds": 1, "radius": 100, "actionPointCost": 1000, "healMagnitude": 800, "durationSeconds": 10, "addedEffect": "+10% damage resistance to self and pact targets; you lose 1% max HP per second.", "notes": "Soul Pact with up to 9 allies. Heals on cast and decreases damage taken."}
    ],
    "mechanic": [
        {"name": "Forte", "type": "mechanic", "paragon": True, "notes": "Soulweaver Forte: Soulweave Regen (primary), excels at Critical Strike and Awareness."},
        {"name": "Soul Manipulation", "type": "mechanic", "notes": "Generates Soulweave (not Soul Sparks). Resource for spells. Regen over time, +out of combat. Increases healing effectiveness and reduces healing threat."},
        {"name": "Lifespark", "type": "mechanic", "paragon": True, "notes": "Conjures spark of soul energy fighting by your side. Auto-casts Inspirit on wounded allies."},
        {"name": "Inspirit", "type": "mechanic", "paragon": True, "castSeconds": 0.5, "cooldownSeconds": 2.5, "range": 80, "healMagnitude": 120, "hotMagnitude": 60, "durationSeconds": 12, "notes": "Auto-cast by Lifespark on wounded allies."},
        {"name": "Lifemark", "type": "mechanic", "paragon": True, "notes": "Bestows Lifemark on party member or self; Lifespark prioritizes healing this target. Activated by tapping Lifelink."},
        {"name": "Lifelink", "type": "mechanic", "paragon": True, "notes": "Tap = Lifemark, Hold = Lifepact channel."},
        {"name": "Lifepact", "type": "mechanic", "paragon": True, "range": 120, "healMagnitudePerSecond": 1000, "notes": "Channel heal every second on party member affected by Lifemark. Target self if Lifemark inactive or affected party member out of range."}
    ]
}

soulweaver["slottedClassFeatures"] = [
    {"name": "Borrowed Spirit", "description": "Whenever you are healed by another player's at-will, encounter, or daily power you regain 50 soulweave. Once every 10s.", "notes": "Slottable. Screenshot intake 2026-05-13."},
    {"name": "Flowing Link", "description": "Allows movement at a reduced speed when channeling Lifelink.", "notes": "Slottable. Screenshot intake 2026-05-13."},
    {"name": "Souleater", "description": "Deal additional necrotic damage (magnitude 20) after most attacks. Consumes 10 soulweave.", "magnitude": 20, "notes": "Slottable. Screenshot intake 2026-05-13."},
    {"name": "Soulbond", "description": "Whenever an ally within 30' is below 50% health, they receive a heal (magnitude 300). Once every 10s.", "healMagnitude": 300, "notes": "Slottable. Screenshot intake 2026-05-13. Currently Active."}
]

soulweaver["feats"] = [
    {"name": "Essence of Time", "description": "Increases soulweave regeneration rate every 3 seconds. Stacks up to 4 times. Reset whenever an action consumes soulweave.", "notes": "Auto-applied. Screenshot intake 2026-05-13."},
    {"name": "Focused Spark", "description": "Soul Reconstruction grants target the effect of Focused Spark: increases heal magnitude of Inspirit on this target by 100 and causes Lifespark to focus on healing this target above other party members. Duration: 6s.", "notes": "Soul Reconstruction modifier. Screenshot intake 2026-05-13."},
    {"name": "Oversoul", "description": "You deal up to 10% more damage when your soulweave is full. Decreases as soulweave decreases.", "notes": "Auto-applied scaling damage bonus. Screenshot intake 2026-05-13."},
    {"name": "Bright Spark", "description": "Whenever you activate a daily power your Lifespark gains effect of Bright Spark, increasing the healing magnitude of Inspirit by 300. Duration: 12s.", "notes": "Daily-trigger modifier. Screenshot intake 2026-05-13."},
    {"name": "Feypact", "description": "Vampiric Embrace, Revitalize, Soulstorm, and Inspirit now bestow a heal over time effect.", "notes": "Auto-applied. Screenshot intake 2026-05-13."},
    {"name": "Hellpact", "description": "Vampiric Embrace, Revitalize, Soulstorm, and Inspirit now bestow an Infernal Barrier that absorbs damage based on the strength of the heal. Infernal Sanction's Infernal Barrier is now stronger.", "notes": "Auto-applied. Screenshot intake 2026-05-13."},
    {"name": "From the Brink", "description": "When healing allies with less than 25% of their maximum hit points, healing is increased by 15%.", "percentStatsConditional": {"Outgoing Healing": 15}, "conditional": "ally below 25% HP", "notes": "Auto-applied conditional healing buff. Screenshot intake 2026-05-13."},
    {"name": "Soultheft", "description": "Whenever you are struck, regain 25 soulweave. Once every 10 seconds.", "notes": "Auto-applied. Screenshot intake 2026-05-13."},
    {"name": "Soul Reclamation", "description": "Whenever your soulweave is below 30% of your maximum soulweave your Lifespark will channel Soul Reclamation on you, increasing your soulweave regeneration. While channeling, your Lifespark will not cast Inspirit.", "notes": "Auto-applied. Screenshot intake 2026-05-13."},
    {"name": "Essence of Power", "description": "Whenever you deal damage to an enemy your soulweave regeneration rate is increased. Duration: 6s.", "notes": "Auto-applied. Screenshot intake 2026-05-13."}
]

# --- Hellbringer paragon ---
hellbringer = next(p for p in warlock["paragonPaths"] if p["name"] == "Hellbringer")
hellbringer["powers"] = {
    "atWill": [
        {"name": "Hellish Rebuke", "type": "atWill", "paragon": True, "magnitude": 70, "dotMagnitude": 15, "retaliateMagnitude": 25, "castSeconds": 0.8, "range": 80, "durationSeconds": 10, "addedEffect": "+1 Soul Spark, DoT, +1 Soul Spark per DoT hit, +Retaliate when hit.", "notes": "Fiery rebuke that ignites target with hellfire."},
        {"name": "Hand of Blight", "type": "atWill", "paragon": True, "castSeconds": 0.4, "rangedMagnitude": 75, "meleeMagnitude": 55, "rangeMelee": "Melee", "rangeRanged": "Ranged", "enhancedRangedSparks": 1, "enhancedMeleeSparks": 2, "addedEffect": "Fourth melee hit enhanced: Blight reduces target damage 4% for 5s.", "notes": "Necrotic power; faster in melee."}
    ],
    "encounter": [
        {"name": "Fiery Bolt", "type": "encounter", "paragon": True, "magnitude": 350, "castSeconds": 0.75, "cooldownSeconds": 11.1, "range": 80, "radius": 15, "notes": "Ball of Eldritch Flame that explodes on impact."},
        {"name": "Curse Bite", "type": "encounter", "paragon": True, "magnitude": 325, "castSeconds": 0.7, "cooldownSeconds": 11.1, "range": 150, "charges": 2, "addedEffect": "Curse Consume rips Curse from all targets afflicted.", "notes": "Necrotic damage."},
        {"name": "Infernal Spheres", "type": "encounter", "paragon": True, "magnitudePerSphere": 75, "maxMagnitude": 750, "minMagnitude": 250, "castSeconds": 1, "cooldownSeconds": 11.9, "range": "Self", "durationSeconds": 10, "addedEffect": "+5% damage. Additional action: Seeking Spheres fires in arc.", "notes": "Summon six infernal spheres."},
        {"name": "Killing Flames", "type": "encounter", "paragon": True, "minMagnitude": 650, "maxMagnitude": 975, "castSeconds": 0.68, "cooldownSeconds": 9.4, "range": 80, "addedEffect": "Damage increased based on target's missing Hit Points. Killing target spawns Soul Puppet.", "notes": "Use target's suffering to fuel infernal flames."},
        {"name": "Hellfire Ring", "type": "encounter", "paragon": True, "magnitude": 200, "hazardMagnitude": "50x5", "hazardDurationSeconds": 5, "castSeconds": 1.13, "cooldownSeconds": 9.4, "range": 80, "radius": 15, "addedEffect": "Hazard field of fire after initial blast.", "notes": "Ring of hellfire at target location."}
    ],
    "daily": [
        {"name": "Gates of Hell", "type": "daily", "paragon": True, "magnitude": 1100, "enhancedMagnitude": 1400, "castSeconds": 1.05, "range": 60, "radius": 10, "actionPointCost": 1000, "addedEffect": "Knockdown. Enhanced damage vs cursed targets.", "notes": "Hellgate at target location."},
        {"name": "Tyrannical Curse", "type": "daily", "paragon": True, "magnitude": 1150, "castSeconds": 0.9, "range": 80, "actionPointCost": 1000, "durationSeconds": 20, "addedEffect": "Curse + +15% damage received by target. Target links damage: 15% of damage dealt passes to other targets within 30'.", "notes": "Devastating hex."}
    ],
    "mechanic": [
        {"name": "Forte", "type": "mechanic", "paragon": True, "notes": "Hellbringer Forte: Power (primary), excels at Critical Strike and Awareness."},
        {"name": "Curse", "type": "mechanic", "paragon": True, "castSeconds": 0, "range": 800, "durationSeconds": 8, "addedEffect": "Combat Advantage 3s.", "notes": "Encounter powers without Curse Consume/Synergy apply Curse to all enemies hit. Counts as Curse for power interactions."},
        {"name": "Soul Spark", "type": "mechanic", "paragon": True, "addedEffect": "+1% damage per Soul Spark (max 10). When out of combat with 6+ Soul Sparks, consumes 1/s healing 0.5% max HP. Regen up to 6 out of combat.", "notes": "Hellbringer resource."},
        {"name": "Soul Scorch", "type": "mechanic", "paragon": True, "castSeconds": 1, "range": 80, "soulSparkCost": 6, "minMagnitude": 300, "maxMagnitude": 800, "dotMinMagnitude": 150, "dotMaxMagnitude": 450, "dotDurationSeconds": 6, "addedEffect": "Curse up to 18 Soul Sparks blast at foe. +50 mag fire per Soul Spark. AoE DoT 12'.", "notes": "Expends Soul Sparks for damage."}
    ]
}

hellbringer["slottedClassFeatures"] = [
    {"name": "Flames of Empowerment", "description": "When you attack a target with your At-Will powers, they are affected by Flames of Empowerment for 10 seconds. Flames of Empowerment increases your powers' damage against the target by 1% per stack and increases all damage against the target by 1% per stack. Max 2 stacks.", "notes": "Class-shared slottable. Currently Active. Screenshot intake 2026-05-13."},
    {"name": "Dark One's Blessing", "description": "Upon entering combat, or whenever you kill an enemy, generate 60 Soulweave / 6 Soul Sparks and heal for 5% of your maximum hit points. Each condition may only trigger its effects once every 10 seconds.", "notes": "Class-shared slottable. Effect varies by paragon resource. Screenshot intake 2026-05-13."},
    {"name": "Dust to Dust", "description": "Your damage dealt is increased by 5%.", "percentStats": {"Damage Bonus": 5}, "notes": "Class-shared slottable. Currently Active. Screenshot intake 2026-05-13."},
    {"name": "Shadow Walk", "description": "Increase your Movement Speed by 10%. Adds 2.5% Deflect and Critical Strike.", "percentStats": {"Movement Speed": 10, "Deflect": 2.5, "Critical Strike": 2.5}, "notes": "Class-shared slottable. Screenshot intake 2026-05-13."},
    {"name": "Deadly Curse", "description": "Your Curse deals 25 magnitude damage whenever it is applied to an enemy.", "notes": "Hellbringer paragon slottable. Currently Active. Screenshot intake 2026-05-13."},
    {"name": "No Pity, No Mercy", "description": "Hellish Rebuke no longer deals damage over time. Instead, initial hits and retaliate hits have their magnitude increased by 15. 3 Soul Sparks are now generated on each initial hit.", "notes": "Hellbringer paragon slottable. Screenshot intake 2026-05-13."},
    {"name": "Dark Prayers", "description": "Whenever a target affected by your Curse dies you spawn a Soul Puppet. Whenever your Soul Puppet hits a target, generate a Soul Spark.", "notes": "Hellbringer paragon slottable. Screenshot intake 2026-05-13."},
    {"name": "All-Consuming Curse", "description": "At-will powers now apply Curse to enemies hit.", "notes": "Hellbringer paragon slottable. Screenshot intake 2026-05-13."}
]

hellbringer["feats"] = [
    {"name": "Double Scorch", "description": "Soul Scorch's initial hit deals an additional 25 magnitude damage per Soul Spark spent.", "notes": "Soul Scorch modifier. Screenshot intake 2026-05-13."},
    {"name": "Power of the Nine Hells", "description": "Grants your encounter powers without Curse Consume or Curse Synergy the ability to summon a Soul Puppet.", "notes": "Auto-applied. Screenshot intake 2026-05-13."},
    {"name": "Warlock's Curse", "description": "Your powers deal 15% more damage to targets afflicted with Curse.", "percentStatsConditional": {"Damage Bonus": 15}, "conditional": "target afflicted with Curse", "notes": "Auto-applied. Screenshot intake 2026-05-13."},
    {"name": "Soul Desecration", "description": "Your Soul Puppet no longer dissipates after 20 seconds, deals 100% more damage, and you will automatically summon a Soul Puppet if one is not active.", "notes": "Auto-applied. Screenshot intake 2026-05-13."},
    {"name": "Executioner's Gift", "description": "Your powers deal up to 10% more damage as your target's health diminishes.", "notes": "Auto-applied scaling damage bonus. Screenshot intake 2026-05-13."},
    {"name": "Wrathful Souls", "description": "Soul Sparks now increase your damage by 1.0% each.", "notes": "Auto-applied; upgrades Soul Spark scaling. Screenshot intake 2026-05-13."},
    {"name": "Soul Spark Recovery", "description": "Every 6 Soul Sparks spent on Soul Scorch reduces your encounter cooldowns by 1 second.", "notes": "Auto-applied. Screenshot intake 2026-05-13."},
    {"name": "Creeping Death", "description": "When you deal damage with your At-Will, Encounter, or Daily powers to enemies they are afflicted with Creeping Death. Creeping Death deals 25 magnitude damage as Necrotic damage every 2 seconds for 10 seconds. Stacks up to 5 times.", "magnitude": 25, "notes": "Auto-applied DoT debuff. Screenshot intake 2026-05-13."},
    {"name": "Risky Investment", "description": "Soul Investiture now grants you a 20% bonus to Encounter damage, +2% for each stack you have.", "notes": "Soul Investiture modifier. Screenshot intake 2026-05-13."},
    {"name": "Parting Blasphemy", "description": "Whenever Curse is removed from a target it deals 85 magnitude damage.", "magnitude": 85, "notes": "Auto-applied. Screenshot intake 2026-05-13."}
]

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Warlock classFeatures: {len(warlock['classFeatures'])}")
print(f"Class at-wills: {len(warlock['powers']['atWill'])}, encounters: {len(warlock['powers']['encounter'])}, dailies: {len(warlock['powers']['daily'])}, mechanics: {len(warlock['powers']['mechanic'])}")
print(f"Soulweaver: powers={ {k: len(v) for k,v in soulweaver['powers'].items()} }, slotted={len(soulweaver['slottedClassFeatures'])}, feats={len(soulweaver['feats'])}")
print(f"Hellbringer: powers={ {k: len(v) for k,v in hellbringer['powers'].items()} }, slotted={len(hellbringer['slottedClassFeatures'])}, feats={len(hellbringer['feats'])}")
