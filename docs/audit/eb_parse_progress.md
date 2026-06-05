# Equip-Bonus Text→Structure Conversion — Progress

Goal: convert gear equip bonuses whose effect exists only as prose
(`description`) into structured fields the engine/optimizer can score
(`stat` / `amount` / `kind:"rating"` / `alwaysActive:false` / `perStack` +
`maxStacks` / `zones`). Baseline census 2026-06-04: **2,748 text-only
instances across 634 unique bonus names** (engine-blind).

Parser: `scripts/eb_parse_batch1.py` — per-instance description parsing
(same bonus name carries different numbers per IL tier, and occasionally a
different mechanic entirely). No rule match → left untouched, never guessed.
Entries written by the parser carry `"parsedFrom": "description"`.

## Conventions locked in batch 1
- Number without `%` = flat rating (`kind:"rating"`); with `%` = percent.
- "While above X% HP/stamina" → counts as on (`alwaysActive` true) — matches
  the in-game stat sheet standing around. "Below X%" halves → conditional.
- "AP full" gating → conditional (AP is empty standing around).
- Ramps "every Ns in combat … 2 minutes" → perStack with maxStacks = 120/N
  (24 confirmed explicitly by Gladiator's Might "Max 24 Stacks: 4800").
- Per-party-member → perStack, maxStacks 5, baseline always-on (you count).
- Per-enemy-engaged (max 15) → perStack, maxStacks 15, conditional
  (engine's full-stacks-conditional convention; single-target sim uptime
  handling is the engine's concern, not the data's).
- Per-percent-health-missing → perStack, maxStacks 100, conditional.
- "+X% Damage against <type>" → stat "Dmg Bonus", conditional; the engine's
  vs-enemy uptime model credits 0 in the general sim (accurately situational).
- "+X% Damage in <zone>" → stat "Dmg Bonus" + `zones:["<Zone>"]` (zone gate).
- Multi-stat lines (The Ol' Switcheroo "+9,650 Power, −3,200 Defense") split
  into multiple entries; description kept on the first only.

## Status
| Batch | Date | Structured | Names covered |
|---|---|---|---|
| 1 | 2026-06-04 | **933 instances / 84 names** | Survivor's/Challenger's/Warden's/Gladiator's/Leader's/Death Defier's/Executioner's/Charged/Skirmisher's families, Hunter family (enemy-type + Undermountain), The Ol' Switcheroo, health-threshold Survivor's pairs, Heroic Tactics, Focused Rejuvenation, Skyhold Predator, Occult Advantage, more |
| 2 | 2026-06-04 | **387 instances / 86 names** | Start-of-combat surges (Contender's, Call of the Undermountain), range/positional gates (Brute's Advantage, Sniper's Fury, Maiden's Blade), solo gates (Herald's), more resource/health thresholds (Charged Precision/Mastery, Unfaltered, Depleted, Champion's), per-player percent/MaxHP/MS (Leader's Dash/Vitality, Harmony pair w/ party-scope aura), Rising Power/Defense stacks, Butcher's Might/Guard, zone families (Chult, Wildspace split, themed maps split), class-resource (Divine Muse, Resourceful Forte), chance-procs incl. multi-stat (Sudden Intuition), Tactical Defense salvage, simple always-on catch-alls |

Batch-2 conventions added: "X% in <zone> / Y% elsewhere" decomposes into
Y% always-on + (X−Y)% zone-gated (exact in both contexts); mixed lines with
an unmodelable proc + a flat always-on clause keep the prose and salvage
the flat clause; over/greater thresholds = on, under/below = conditional.

Remaining: **1,081 text-only instances (454 unique names)** + 293 instances
skip-listed by pattern (heal/damage/AP/cooldown procs, random-stat effects).

## UPDATE 2026-06-04: gear DAMAGE procs now modeled
33 prose damage procs (Critical Force ×14, Explosive Force ×8, Summon
Myconid ×6, Daily Burst ×2, Power at Any Cost, Rothe's Intimidation,
Daily Explosion) carry structured `procDamage` fields
(scripts/gear_proc_damage.py) consumed by the proc-damage layer
(computeGearProcDamagePerHit in toon-forge.html). Magnitude procs ride
the player multiplier chain (Snowbound Ring's Explosive Force = +10.0%
verified); flatDamage procs (tooltip captures) add flat post-multiplier
damage (+0.57% for Smoldering Loop at endgame — honestly small).
Conjure Orb skipped (ambiguous summon uptime).

## Skipped by design (no engine layer yet — do NOT structure as stats)
- Encounter Reprieve (52): cooldown-reduction proc
- Critical Charge (45): flat Action Point grant proc
- Executioner's Zeal (22): AP-on-kill proc
- Butcher's Zeal (18): AP-on-big-hit proc
- (pre-existing, same class) stat "Incoming Damage" ×36: damage-taken
  reduction, awaits survivability layer

## Pre-existing unknown-stat warnings (not from this work)
`Damage`, `Stamina Regen` (from non-gear data files), `Incoming Damage`
(above). Candidates for STAT_NAME_ALIASES or future layers.
