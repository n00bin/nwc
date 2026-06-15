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

### Pending — needs in-game screenshots before they can be fixed/trusted

From the 2026-06-15 companion sweep, these are wrong or unverifiable but have no usable screenshot in the archive:

- **5 companions show the wrong power entirely** (powers point to another pet's entry): Stalwart Golden Lion (250), Portobello DaVinci (251), Blue Fire Eye (252), Cyclops War Drummer (253), Dread Warrior (254). Need a screenshot of each pet's power card.
- **Linu La'neral** (power 226 Divine Answers) — values unconfirmed.
- **Baby Boar** (power 84) — two archive screenshots disagree on the first stat.

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
