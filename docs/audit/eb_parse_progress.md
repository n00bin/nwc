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

Remaining: ~1,652 text-only instances (550 unique names), mostly low-frequency.

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
