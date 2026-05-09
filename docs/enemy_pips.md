# Neverwinter Enemy "Pip" System — Reference Document

## Purpose

Authoritative reference data on Neverwinter's enemy "pip" system (the segmented bars above an enemy's name/health) and how those pips relate to actual enemy stats. Drop this in your project folder for Claude Code to reference when working on guide tools, the Neverwinter companion site, video assets, or any feature that needs to interpret or display enemy difficulty.

## Quick Definition

The "pips" are the visible segments of an enemy's health bar. The number of pips communicates the enemy's **difficulty tier**, which is one of two systems (along with **role**) that determine that enemy's stats and combat behavior.

---

## System 1: Difficulty Tiers

There are **5 difficulty tiers**, ordered from weakest to strongest:

1. Minion
2. Standard
3. Elite
4. Solo
5. Boss

### Pip Count by Tier — Adventure Zones (open world)

| Tier | Pips |
|---|---|
| Minion | 1 |
| Standard | 3 |
| Elite | 5 |
| Solo | 7 |
| Boss | 10 (Console) / 20 (PC) |

### Pip Count by Tier — Group Content (Skirmishes & Dungeon Delves)

| Tier | Pips |
|---|---|
| Minion | 3 |
| Standard | 5 |
| Elite | 9 |
| Solo | 13 |
| Boss | 10 (Console) / 20 (PC) |

### Caveats
- **Summoned enemies** are an exception — their pip counts can vary and shouldn't be trusted as a tier indicator.
- Boss pip counts differ between PC (20) and Console (10) — important if your tooling targets a specific platform.

---

## System 2: Roles

Every enemy also has **1 of 4 roles**, which determines combat behavior:

| Role | Behavior |
|---|---|
| Brute | Melee tank. Charges in, hits hardest. Baseline damage role. |
| Skirmisher | Mobile melee. Darts in and out of combat. |
| Artillery | Ranged attacker. Stays at distance. |
| Controller | Crowd control / debuffs / disables. |

Roles are not visible above the enemy's head — they're defined in the Foundry entry / data, but you can usually infer them from behavior.

---

## Stat Modifier System (Damage Taken / DT)

The wiki labels enemy stat modifiers as **"Damage Taken" (DT)**. Each enemy gets a DT multiplier from its **difficulty** AND its **role**, multiplied together.

### Difficulty multipliers (Minion Brute = 1.0 baseline)

| Difficulty | Multiplier | Fraction |
|---|---|---|
| Minion | 1.000 | 8/8 |
| Standard | 1.125 | 9/8 |
| Elite | 1.250 | 10/8 |
| Solo | 1.375 | 11/8 |
| Boss | 1.500 | 12/8 |

### Role multipliers (Brute baseline = 100%)

| Role | Multiplier |
|---|---|
| Brute | 1.00 (100%) |
| Skirmisher | 0.90 (90%) |
| Artillery | 0.80 (80%) |
| Controller | 0.70 (70%) |

### Combined Difficulty × Role Lookup Table

Final DT modifier for any enemy = **difficulty multiplier × role multiplier**.

| Difficulty | Brute | Skirmisher | Artillery | Controller |
|---|---|---|---|---|
| Minion | 1.000 | 0.900 | 0.800 | 0.700 |
| Standard | 1.125 | 1.013 | 0.900 | 0.788 |
| Elite | 1.250 | 1.125 | 1.000 | 0.875 |
| Solo | 1.375 | 1.238 | 1.100 | 0.963 |
| Boss | 1.500 | 1.350 | 1.200 | 1.050 |

### Note on "Damage Taken" terminology
The wiki uses the label "Damage Taken" but the directionality isn't perfectly explicit in the source. In practice it acts as the per-tier/per-role enemy stat multiplier. If precision matters for a specific feature, validate with in-game testing.

---

## Universal Enemy Stats

These baseline stats apply to **all** enemies regardless of tier or role (player-side reference):

| Stat | Value | Notes |
|---|---|---|
| Power | 90% | offensive — they apply this against you |
| Combat Advantage | 90% | offensive |
| Critical Severity | 90% | offensive |
| Critical Strike | 50% | offensive |
| Defense | **50%** | reduces YOUR damage to them; divisor 1.5 (or 1.35 with Defenses Ignored) |
| Deflect Severity | 90% | countered by your Accuracy when they deflect your hits |
| Deflect chance | **50%** | half of your hits get deflected by PvE enemies |
| Awareness | 0% | they don't reduce your Combat Advantage |
| Accuracy | 0% | their Accuracy doesn't reduce your Deflect Severity |
| Critical Avoidance | 0% | they don't reduce your Critical Severity |

(Defense and Deflect were missing from the v1 doc — added 2026-05 from cross-referenced sources: Fandom Wiki, Obikin89, nwguide.gitbook.io, nw-hub.com/mechanics/stats.)

### Boss-specific
- **Combat Advantage Uptime: 100%** — bosses always have CA against the player and don't need surrounding allies to trigger it. This is why Awareness becomes the dominant defensive stat past ~45%.

### Universal modifier
- ~~**Defenses Ignored: -15%** flat across all enemies.~~  **REMOVED 2026-05** — could not be independently verified by research. "Defenses Ignored" appears to be the old Armor Penetration stat from pre-Mod 16, not a universal enemy modifier in current NW. The Toon Forge prototype uses raw 50% Defense without this adjustment.

---

## Sample Enemy Data

A reference subset of generic enemies with role + difficulty for testing/lookup:

| Name | Category | Role | Difficulty |
|---|---|---|---|
| Cutthroat | Bandit | — | Minion |
| Decrepit Skeleton | Skeleton | Skirmisher | Minion |
| Drudge | Orc | Brute | Minion |
| Wolf | Orc | — | Minion |
| Hurler | Cult of the Dragon | Artillery | Minion |
| Kobold Minion | Cult of the Dragon | Skirmisher | Minion |
| Salvager | Bandit | — | Standard |
| Battletested Orc | Orc | Brute | Standard |
| Skeleton Soldier | Skeleton | Skirmisher | Standard |
| Taskmaster | Orc | — | Standard |
| Red Wizard of Thay | Thayans | — | Standard |
| Bloodtracker | Bandit | — | Elite |
| Eye of Gruumsh | Orc | Controller | Elite |
| Zombie Hulk | Zombie | Brute | Elite |
| Bandit Officer | Bandit | — | Elite |
| Drow Priestess | Drow | Controller | Elite |
| Wyrmpriest | Kobold | Artillery | Elite |
| Mind Flayer Mastermind | Mind Flayer | Artillery | Elite |
| Foulspawn Hulk | Foulspawn | Brute | Solo |
| Thoon Hulk | Mind Flayer | Brute | Solo |
| Magma Brute | Magma Beast | Brute | Solo |
| Ogre Savage | Ogre | Brute | Solo |
| Plaguechanged Maw | Aberrant | Brute | Solo |
| Shocktroop Devil | Ashmadai | Brute | Solo |

---

## Implementation Notes

If you're building a calculator, lookup tool, or enemy reference page:

- **HP scales roughly linearly with pip count** within a given level/scaling tier. A 5-pip Elite has ~5× the HP of a 1-pip Minion of the same level.
- **Per-hit enemy stats** use the combined Difficulty × Role table above.
- **Time-to-kill heuristic:** `TTK ≈ enemy_HP / player_DPS`, where `enemy_HP ≈ base_HP × pip_count` for that tier.
- **Threat level heuristic:** `threat ≈ DT_modifier × universal_damage_factor` — Brutes within a tier are always the most dangerous per hit, Controllers least.
- **Platform branch:** Boss pip count differs between PC (20) and Console (10). Branch on platform if relevant.
- **Group content branch:** Pip counts increase for Minion / Standard / Elite / Solo when in Skirmishes or Dungeon Delves. Boss pip count stays the same.

---

## Data Schema (suggested)

If modeling enemies in code, a clean schema would be:

```json
{
  "name": "Battletested Orc",
  "category": "Orc",
  "role": "Brute",
  "difficulty": "Standard",
  "log_id": "Orc_Battletested",
  "pips_open_world": 3,
  "pips_group_content": 5,
  "dt_modifier": 1.125,
  "foundry_available": true
}
```

---

## Sources

Primary:
- Neverwinter Wiki — Table of Generic Enemies: https://neverwinter.fandom.com/wiki/Table_of_Generic_Enemies

Tier pages:
- Minion: https://neverwinter.fandom.com/wiki/Minion
- Standard: https://neverwinter.fandom.com/wiki/Standard
- Elite: https://neverwinter.fandom.com/wiki/Elite
- Solo: https://neverwinter.fandom.com/wiki/Solo

Supporting (player-side stats):
- NW Guide GitBook — Stat System: https://nwguide.gitbook.io/main/basics-of-neverwinter/stat-system-in-basic
- Obikin89's Neverwinter Guide — Stats: https://neverwinter.obikin89.com/stats

---

*Compiled for The N00bin Network. Last updated: May 2026.*
