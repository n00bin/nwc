// Toon Forge — per-paragon DPS rotation profiles (public).
//
// WHY: the optimizer needs each paragon's rotation ARCHETYPE so it (1) weights
// slot-specific damage bonuses to the class's real damage split (mix) and
// (2) auto-picks a functional standard loadout instead of raw magnitude/cooldown.
//
// SOURCE: community-meta research (Obikin89/NW Hub/mmorpgtips Mod 30) reconciled
// against ../data/classes.json power names via scripts/_rotation_reconcile.py
// on 2026-06-16. See docs/audit/dps_rotation_profiles.md. Names MUST match
// classes.json exactly or the optimizer can't slot them.
//
// mix keys merge OVER the engine default (getPowerMix() in toon-forge.html):
//   atwill/encounter/daily = damage-split emphasis; melee/ranged/single/dot =
//   damage-tag emphasis for slot-tagged gear bonuses.
//
// NOTE: Cleric uses "Prophet of Doom" to match current data — the real NW power
// is "Prophecy of Doom"; classes.json has a typo to fix (then update here).

var TF_ROTATION_PROFILES = {
  "Barbarian/Blademaster": {
    emphasis: "encounter", confidence: "medium",
    mix: { atwill: 0.35, encounter: 0.50, daily: 0.15, melee: 1.0, ranged: 0.0 },
    atWills: ["Relentless Slash", "Brash Strike"],
    encounters: ["Frenzy", "Bloodletter", "Punishing Charge"],
    dailies: ["Crescendo", "Avalanche of Steel"]
  },
  "Bard/Songblade": {
    emphasis: "hybrid", confidence: "low",
    mix: { atwill: 0.30, encounter: 0.45, daily: 0.25, melee: 0.5, ranged: 0.5 },
    atWills: ["Reprise", "Con Elemento"],
    encounters: ["Ad Libitum", "Volti Subito", "Contre"],
    dailies: ["Lore", "Encore"]
  },
  "Cleric/Arbiter": {
    emphasis: "encounter", confidence: "high",
    mix: { atwill: 0.25, encounter: 0.60, daily: 0.15, melee: 0.0, ranged: 1.0 },
    atWills: ["Lance of Faith", "Conflagrate"],
    encounters: ["Forgemaster's Flame", "Daunting Light", "Prophet of Doom"],
    dailies: ["Celestial Prominence", "Hammer of Fate"]
  },
  "Fighter/Dreadnought": {
    emphasis: "encounter", confidence: "medium",
    mix: { atwill: 0.30, encounter: 0.55, daily: 0.15, melee: 1.0, ranged: 0.0 },
    atWills: ["Heavy Slash", "Reave"],
    encounters: ["Commander's Strike", "Anvil of Doom", "Griffon's Wrath"],
    dailies: ["Mow Down", "Shockwave"]
  },
  "Ranger/Hunter": {
    emphasis: "atwill", confidence: "medium",
    mix: { atwill: 0.55, encounter: 0.35, daily: 0.10, melee: 0.0, ranged: 1.0 },
    atWills: ["Aimed Shot", "Hunter's Teamwork"],
    encounters: ["Commanding Shot", "Longstrider's Shot", "Rapid Volley"],
    dailies: ["Disruptive Shot", "Slasher's Mark"]
  },
  "Ranger/Warden": {
    emphasis: "encounter", confidence: "low",
    mix: { atwill: 0.35, encounter: 0.50, daily: 0.15, melee: 0.5, ranged: 0.5 },
    atWills: ["Electric Shot", "Storm Strike"],
    encounters: ["Throw Caution", "Split the Sky", "Boar Charge"],
    dailies: ["Forest Ghost", "Call of the Storm"]
  },
  "Warlock/Hellbringer": {
    emphasis: "encounter", confidence: "n00b-verified",  // ST rotation verified by n00b 2026-06-16
    mix: { atwill: 0.30, encounter: 0.55, daily: 0.15, melee: 0.0, ranged: 1.0 },
    atWills: ["Hellish Rebuke", "Dark Helix"],
    encounters: ["Killing Flames", "Vampiric Embrace", "Hadar's Grasp"],
    dailies: ["Tyrannical Curse", "Soul Siphon"]
  },
  "Wizard/Arcanist": {
    emphasis: "encounter", confidence: "medium",
    mix: { atwill: 0.30, encounter: 0.55, daily: 0.15, melee: 0.0, ranged: 1.0 },
    atWills: ["Storm Pillar", "Arcane Bolt"],
    encounters: ["Disintegrate", "Arcane Conduit", "Steal Time"],
    dailies: ["Arcane Empowerment", "Maelstrom of Chaos"]
  },
  "Wizard/Thaumaturge": {
    emphasis: "encounter", confidence: "medium",
    mix: { atwill: 0.35, encounter: 0.50, daily: 0.15, melee: 0.0, ranged: 1.0, dot: 0.6 },
    atWills: ["Chilling Cloud", "Scorching Burst"],
    encounters: ["Icy Rays", "Chill Strike", "Fanning the Flame"],
    dailies: ["Ice Storm", "Furious Immolation"]
  },
  "Rogue/Assassin": {
    emphasis: "encounter", confidence: "medium",
    mix: { atwill: 0.30, encounter: 0.55, daily: 0.15, melee: 1.0, ranged: 0.0 },
    atWills: ["Duelist's Flurry", "Gloaming Cut"],
    encounters: ["Lashing Blade", "Wicked Reminder", "Assassinate"],
    dailies: ["Shocking Execution", "Bloodbath"]
  },
  "Rogue/Whisperknife": {
    emphasis: "encounter", confidence: "medium",
    mix: { atwill: 0.30, encounter: 0.55, daily: 0.15, melee: 0.3, ranged: 0.7 },
    atWills: ["Disheartening Strike", "Cloud of Steel"],
    encounters: ["Shadow Strike", "Impact Shot", "Blitz"],
    dailies: ["Lurker's Assault", "Killing Storm"]
  }
};

if (typeof module !== "undefined" && module.exports) module.exports = TF_ROTATION_PROFILES;
