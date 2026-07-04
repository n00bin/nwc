// Toon Forge — stat catalog (single source of truth)
//
// All stats the engine knows about, with their caps. Caps copied
// from mekaniks.html:631-655 (the canonical reference).
//
// cap: number = total cap %, null = no cap, "unverified" = unknown
// ratingPerPercent: how much rating equals 1% AT the rating cap.
//   For most stats this is "TIL-relative" (rating = TIL → 50%, see
//   ratingFormula in toon-forge-engine.js). For special stats with
//   fixed conversion (Recharge Speed, AP Gain), we store the rate
//   directly in `flatRating`.
// kind: "rating" = uses rating-to-% conversion + percent bonuses
//       "flat"   = no rating-to-% formula (e.g. Max HP just adds up)
//       "fixed"  = fixed rating conversion (Recharge: 200/1%, AP: 400/1%)

const TOON_FORGE_STATS = [
  // === Offensive ===
  // Order matches the in-game character sheet's Main Stats block
  // (n00b 2026-07-04): Power, Accuracy, Combat Advantage, Crit Strike,
  // Crit Severity. Display iterates this array — keep it sheet-ordered.
  { name: "Power",             cap: 120, kind: "rating", category: "Offensive" },
  { name: "Accuracy",          cap: 90,  kind: "rating", category: "Offensive" },
  { name: "Combat Advantage",  cap: 120, kind: "rating", category: "Offensive" },
  { name: "Critical Strike",   cap: 90,  kind: "rating", category: "Offensive" },
  { name: "Critical Severity", cap: 120, kind: "rating", category: "Offensive" },

  // === Defensive ===
  { name: "Defense",           cap: 120, kind: "rating", category: "Defensive" },
  { name: "Awareness",         cap: 90,  kind: "rating", category: "Defensive" },
  { name: "Critical Avoidance",cap: 90,  kind: "rating", category: "Defensive" },
  { name: "Deflect",           cap: 90,  kind: "rating", category: "Defensive" },
  { name: "Deflect Severity",  cap: 120, kind: "rating", category: "Defensive" },

  // === Control ===
  // Control Bonus / Control Resist verified 2026-05-11 (n00b in-game):
  //   Control Bonus = 94,870 rating → 25.1% total (≈ 18.1% rating contribution + 7% bonus)
  //   Control Resist = 98,965 rating → 36.2% total (≈ 22.2% rating contribution + 14% bonus)
  // Both use the standard rating-to-% formula. Cap not yet verified —
  // setting to 90 conservatively (matches most uncapped-feeling rating
  // stats). Will adjust if a player ever overcaps in-game.
  { name: "Control Bonus",     cap: 90, kind: "rating", category: "Control" },
  { name: "Control Resist",    cap: 90, kind: "rating", category: "Control" },

  // === Special ===
  { name: "Forte",             cap: 120, kind: "rating", category: "Special",
    note: "Forte rating is distributed (50/25/25) into 3 stats per paragon. Bypasses rating cap of those stats." },
  { name: "Maximum Hit Points",cap: null, kind: "flat",  category: "Special",
    note: "Flat HP value, no percentage. (TIL × 10 + role bonus + item HP) × (1 + CON/200)." },
  { name: "Class Resource Max", cap: null, kind: "flat", category: "Special",
    base: 1000,
    note: "Hidden in-game stat. Base 1000 for all classes. Gear and certain items add to max. Display label varies per class: Rage / Performance / Divinity / Soul Sparks / etc." },
  { name: "Class Resource Regen", cap: null, kind: "rating", category: "Special",
    note: "Hidden in-game stat. Percent-style regen rate. Forte primary for healer paragons (Minstrel/Devout/etc.) routes here. Display label varies per class." },

  // === Utility ===
  { name: "Action Point Gain", cap: null, kind: "fixed", category: "Utility", flatRating: 400 },
  { name: "Recharge Speed",    cap: null, kind: "fixed", category: "Utility", flatRating: 200 },
  { name: "Movement Speed",    cap: null, kind: "rating",category: "Utility" },
  { name: "Stamina Regeneration", cap: null, kind: "rating", category: "Utility" },

  // === Healing ===
  { name: "Outgoing Healing",  cap: 120, kind: "rating", category: "Healing" },
  { name: "Incoming Healing",  cap: 120, kind: "rating", category: "Healing" },
  { name: "Overall Outgoing Healing", cap: null, kind: "rating", category: "Healing",
    note: "Distinct from OH. Flat % multiplier on heal output (set bonuses, certain feats). Doesn't show on in-game OH stat row." },
];

// Quick lookup helpers
const TOON_FORGE_STAT_BY_NAME = TOON_FORGE_STATS.reduce(function(acc, s) {
  acc[s.name] = s;
  return acc;
}, {});

const TOON_FORGE_STAT_NAMES = TOON_FORGE_STATS.map(function(s) { return s.name; });

// Bonus stats that may appear in source data (race traits, boons) but
// aren't core combat stats. Listed here so the engine doesn't warn
// about them, but they don't get a final % computation.
const TOON_FORGE_BONUS_STATS = [
  "Gold Bonus",
  "Glory Bonus",
  "Stamina",          // distinct from Stamina Regeneration
  "magnitude",        // damage-formula side; not a stat percentage
  "Physical Damage",  // damage-formula side (Phase 4); not a stat panel entry
  "Magical Damage",   // damage-formula side (Phase 4)
  // "Max HP Percent" moved OUT of this silenced list 2026-07-03: it now
  // aliases to Maximum Hit Points (percent channel) in STAT_NAME_ALIASES.
  "Encounter Dmg Bonus", // class/feat data; not a core stat
  "Dmg Bonus",        // generic damage-bonus tag from artifact data
  "Damage Bonus",     // alias of the above
  "Damage Vs Bosses", // boon/feat conditional bonus
  "Outgoing Damage",  // class power data; not a stat panel entry

  // === Silenced 2026-05-10: data references these but no layer to apply them yet ===
  // When the prototype gains a damage-output layer / heal-sim HoT layer /
  // incoming-damage survivability layer, MOVE these out of this list into
  // TOON_FORGE_STATS (or wire them into the appropriate formula) and
  // un-silence so we get the warning back if anything is overlooked.
  // Tracked in docs/toon_coverage.md → "Open Gaps → Toon Forge stat catalog".
  "At Will Dmg Bonus",  // Sturdy Barbed Collar V "At-Will Powers do 5% more damage" — multiplies at-will magnitudes. Wire when damage-output layer exists.
  "Damage",             // weapon tooltips' base "Damage" line (rating 50–275 on ~90 weapons in gear.json). The damage model is TIL-driven; NEVER route this to Dmg Bonus (it would read as +100%+ damage).
  "Incoming Damage",    // gear equip bonuses with damage-taken reduction (e.g. Masterwork "-2 Incoming Damage"). Wire when survivability layer exists.
  "heal_pct_damage",    // Master Boon Life Lessons R3 "Return 15% of damage done as a heal over time per rank" — converts damage→HoT. Wire when heal-sim HoT layer exists.
  "heal_pct_max_hp",    // Master Boon procs that heal/HoT/temp-HP for X% of Maximum Hit Points per rank (Death's Bulwark, Enhanced Application, Blessed Advantage). Scales heal output by current Max HP — NOT a Max HP stat bonus. Wire when heal-sim HoT/heal layer exists.
  "damage_taken",       // Master Boon Enhanced Application R3 "Reduces damage of next 1 attack taken by 15% per rank" — incoming-damage mitigation. Wire when survivability layer exists.
];

// Per-paragon display labels for the class resource. The internal
// stats are "Class Resource Max" and "Class Resource Regen", but the
// UI shows the paragon-flavored name. Stored per-paragon because
// some classes (e.g. Fighter) use different resources for DPS vs Tank.
//
// Forte primaries that read as "<Label> Regen" (e.g.,
// "Performance Regen") route to "Class Resource Regen" in the engine.
const CLASS_RESOURCE_LABELS = {
  "Barbarian/Blademaster": "Rage",
  "Barbarian/Sentinel":    "Rage",
  "Bard/Songblade":        "Performance",
  "Bard/Minstrel":         "Performance",
  "Cleric/Arbiter":        "Divinity",
  "Cleric/Devout":         "Divinity",
  "Fighter/Dreadnought":   "Vengeance",
  "Fighter/Vanguard":      "Stamina",   // uses universal Stamina bar, not a unique class resource
  "Paladin/Justicar":      "Divinity",
  "Paladin/Oathkeeper":    "Divinity",
  "Ranger/Hunter":         "(none)",  // no class resource
  "Ranger/Warden":         "(none)",  // no class resource
  "Rogue/Assassin":        "Stealth",
  "Rogue/Whisperknife":    "Stealth",
  "Warlock/Hellbringer":   "Soul Sparks",
  "Warlock/Soulweaver":    "Soulweave",
  "Wizard/Arcanist":       "(none)",  // no class resource
  "Wizard/Thaumaturge":    "(none)",  // no class resource
};

// Aliases the engine treats as Class Resource Regen — any of these
// stat names appearing in source data (forte primary, gear stats, etc.)
// route to the internal "Class Resource Regen" stat.
const CLASS_RESOURCE_REGEN_ALIASES = [
  "Rage Regen",
  "Performance Regen",
  "Divinity Regen",
  "Vengeance Regen",
  "Soul Sparks Regen",
  "Soulweave Regen",
  // Stamina & Stealth are class resources too but already exist as
  // their own stats / mechanics; not aliased here.
];

// CamelCase stat-name aliases. Source data (notably enchants.js, some
// gear, artifacts) carries stat names without spaces. The engine
// canonicalizes them on ingest so contributions don't get silently
// dropped into "unknown-stat" warnings.
const STAT_NAME_ALIASES = {
  // Shorthand from artifact data ("Stamina Regen": 15)
  "Stamina Regen":      "Stamina Regeneration",
  // CamelCase (from enchants.js and some gear)
  "CriticalStrike":     "Critical Strike",
  "CriticalSeverity":   "Critical Severity",
  "CombatAdvantage":    "Combat Advantage",
  "CriticalAvoidance":  "Critical Avoidance",
  "DeflectChance":      "Deflect",
  "DeflectSeverity":    "Deflect Severity",
  "OutgoingHealing":    "Outgoing Healing",
  "IncomingHealing":    "Incoming Healing",
  "ControlBonus":       "Control Bonus",
  "ControlResist":      "Control Resist",
  "MaximumHitPoints":   "Maximum Hit Points",
  "MaxHP":              "Maximum Hit Points",
  "Max HP":             "Maximum Hit Points",
  // HP-percent bonuses (Rime Temper +15%, gear Bloodletting downsides)
  // ride the percent channel of Maximum Hit Points — the Max HP model
  // multiplies by (1 + percentTotal). Was a silenced dead-end name until
  // 2026-07-03 (found calibrating n00b's tank: HP read 10.6% low).
  "Max HP Percent":     "Maximum Hit Points",
  "ActionPointGain":    "Action Point Gain",
  "RechargeSpeed":      "Recharge Speed",
  "MovementSpeed":      "Movement Speed",
  "StaminaRegeneration":"Stamina Regeneration",
  "StaminaRegen":       "Stamina Regeneration",
  "DeflectSev":         "Deflect Severity",
  "CritStrike":         "Critical Strike",
  "CritSeverity":       "Critical Severity",
  "CritAvoidance":      "Critical Avoidance",
  // Plural variants found in gear.json (audit C8 fix) — same in-game stat
  "Deflection":         "Deflect",               // 708 gear entries; in-game stat is "Deflect"
  "Control Resistance": "Control Resist",        // 72 gear entries; in-game stat is "Control Resist"
  // Number-suffixed dupes (audit C10 — two values of same stat on one item)
  "Critical Severity 2": "Critical Severity",    // Lunar Knot — second source stacks
  "Deflection 2":        "Deflect"               // Solar Band — second source stacks
};
