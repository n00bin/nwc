# Data Trust Ledger

This is the **Data Steward team's** record of what data has been *proven correct against an in-game screenshot.* It is maintained by the `/steward` command (see `~/.claude/commands/steward.md`).

## What this is for

The website's data lives in the JSON files in `../data/` (the source of truth). A value being *in* the JSON does not mean it's *right*. This ledger tracks which values have been verified against a screenshot, so that:

- When something looks wrong on the site, we can check whether that value was ever verified.
- A verified value can be **looked up** with confidence instead of re-checked from scratch.
- We can see at a glance which systems still need screenshots captured.

**Status meanings**
- `CONFIRMED` — JSON matches an in-game screenshot. Trusted.
- `MISMATCH` — JSON disagreed with a screenshot (should already be fixed; left here only if a fix is pending).
- `UNVERIFIABLE` — no screenshot exists yet. Not wrong, just unproven. Capture one to promote it.

## How a row gets added

`/steward` adds/updates a row whenever it verifies an entry. The Steward Lead emits the rows; the builder (or orchestrator) writes them here — the Lead is read-only.

| id | name | system | status | source screenshot | data version | date verified |
|----|------|--------|--------|-------------------|--------------|---------------|
| power 34 | Werewolf's Presence | companion_powers | CONFIRMED (no change — was already correct) | c030.png | 2026.03.17a | 2026-06-15 |
| power 53 | Baby Polar Bear's Instincts (companion renamed Polar Bear Cub) | companion_powers | FIXED→CONFIRMED (base rarity 750→375 Epic; stats 3.8→1.9; CR 750→375) | c048.png | 2026.03.17a | 2026-06-15 |
| power 171 | Quickling's Wisdom | companion_powers | FIXED→CONFIRMED (Critical Strike 1.8→3.8) | c176.png | 2026.03.17a | 2026-06-15 |
| power 210 | Deva Champion's Insight | companion_powers | FIXED→CONFIRMED (both stats 1.5→1.3) | c222.png | 2026.03.17a | 2026-06-15 |
| power 64 | Hunting Hawk's Presence | companion_powers | FIXED→CONFIRMED (CR 230→75; stat 0.75 confirms base IL 75) | scaling math | 2026.03.17a | 2026-06-15 |
| power 82 | Wardog's Instincts | companion_powers | FIXED→CONFIRMED (CR 230→75; stats 0.38 confirm base IL 75) | scaling math | 2026.03.17a | 2026-06-15 |
| power 223 | Air Archon's Insight | companion_powers | FIXED→CONFIRMED (CR 230→75; stat 0.75 confirms base IL 75) | scaling math | 2026.03.17a | 2026-06-15 |
| power 60 | War Boar's Instincts | companion_powers | FIXED (CR 230→75 — invalid rating value); verified as a PROC, not a stat buff | scaling math + screenshot 2026-06-15 125559 | 2026.03.17a | 2026-06-15 |
| power 261 | War Drummer's Discipline (Cyclops War Drummer) | companion_powers | NEW/FIXED — pet was showing Crimson Crystal Golem's power; now correct (+4.5% Incoming Healing, +18,000 Max HP, IL 900) | screenshot 2026-06-15 125618 | 2026.03.17a | 2026-06-15 |

### Pending — needs in-game screenshots before they can be fixed/trusted

From the 2026-06-15 companion sweep, these are wrong or unverifiable but have no usable screenshot in the archive:

- **4 companions still show the wrong power** (powers point to another pet's entry): Stalwart Golden Lion (250), Portobello DaVinci (251), Blue Fire Eye (252), Dread Warrior (254). Need a screenshot of each pet's power card. ✅ Cyclops War Drummer (253) FIXED 2026-06-15.
- **Linu La'neral** (power 226 Divine Answers) — values unconfirmed.
- **Baby Boar** (power 84) — two archive screenshots disagree on the first stat.
- **War Boar's Instincts** (power 60) — screenshot-verified 2026-06-15: it's a PROC, not a stat buff (15% on At-Will hit → 82.5-magnitude aggravated wound over 4s at IL 550, once/sec). Combined Rating fix confirmed. Still TODO: model the proc-damage scaling across rarities (82.5 @ Legendary sits below the standard magnitude curve, so it needs a 2nd rarity data point before it can feed the damage layer).
- **Cold Iron Warrior's Discipline** (power 119) — Combined Rating is 0 (only one like it). Verify whether that's intentional or a gap.

Note: the old March-2026 automated audit flagged 28 companion "mismatches"; re-reading at full resolution found most were misreads (a "3" read as "1"/"5") or already-correct schema. Always re-read the screenshot at zoom before trusting an automated flag.

## Known intentional outliers (CONFIRMED by design — never re-flag)

These look "off-scale" but are verified correct per `website/CLAUDE.md`. The Steward treats them as CONFIRMED and never proposes "normalizing" them.

| id | name | system | why it's correct |
|----|------|--------|------------------|
| power 201 | Energon | companion_powers | +35,000 MaxHP at IL 750 — deliberately off the MAX_HP scale (verified) |
| power 49 | Raptor's Instincts | companion_powers | 4.5% Power at IL 900 — per-stack party power (Part of the Pack, max 5), not single-stat scale (verified 2026-06-05) |
| power 89 | Bobby's Vigor | companion_powers | +12,000 MaxHP + 4.5% Defense at IL 750 — hybrid, off both scales (verified 2026-06-05) |
| — | Gemstone enchants (multi-stat) | enchants | 2700/1485/1080 per-stat at Celestial are correct (1/2/3-stat-per-slot by design, ×6 from Rank 1) |

---

_Ledger created 2026-06-15. Current data pack version: 2026.03.17a (Mod 32.5)._
