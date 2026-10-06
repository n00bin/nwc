# POWER-TAGS-2 step 2.7: extra targets (plan)

Written 2026-10-06. Nothing here is built yet. Part of `docs/plans/power_tags_2_plan.md`, Stage 2; locked by PT2-15
(revised): area hits count once per enemy up to the enemy count slider (single-target once; mixed by area share);
the score is your own damage only. Everything stays local-only.

## What the code does now

- **Area hits count once.** `simulateFx` multiplies a hit only when its record says `targets: "others"` (7 records,
  e.g. splash on the enemies around the target: enemy count minus 1). Every other hit lands once, whatever the enemy
  count slider says (`hitTargets`, `toon-forge-rotation.js` ~line 739).
- **The data knows which powers are area.** 132 powers are tagged `tags.targets: "area"`, 139 `"single"`, 11
  `"mixed"`, 11 untagged. Hit records: 49 area, 67 single, 23 untagged (they follow their power), 7 others.
  100 area powers deal their damage through the top-level magnitude (no hit record of their own).
- **Target caps are almost never stored.** One record has `maxTargets`; only 4 power texts name a count (Ballad of
  the Witch 3 targets, Oath Strike 3 enemies, Steel Breeze 5 targets, Shuriken Toss 3 enemies).
- **No area share is stored** for the 11 mixed powers (`areaShare` is in the vocabulary, used 0 times).
- **Debuffs hit every enemy equally.** A debuff that is up boosts every hit in step 2.4's scoring, whichever enemy it
  lands on. 44 class debuffs carry no target tag; the artifact call debuffs carry none either.
- **The enemy count slider** (`state.enemyCount`, default 1) already reaches the simulator (`input.enemyCount`) and
  drives the `enemyCount` / `otherEnemies` gates.

## What it should do

1. An area hit lands on every enemy up to the slider (a cap where one is known: gap 2.7-A).
2. A mixed power: gap 2.7-B.
3. A debuff boosts only the hits on the enemies it is on: gap 2.7-C.
4. On-hit procs and stacks already run per target hit (each extra target is its own landed hit, flagged as not the
   main target); echoes and copies keep their own rules (main target only unless the record says others).
5. With the slider at 1 (the default, a boss) nothing changes.

## How it is proved

- **One enemy:** with the slider at 1, every result equals step 2.6's exactly, on all 33 baseline builds.
- **Unit tests:** an area hit at 3 enemies lands 3 times; a capped hit stops at its cap; a single-target debuff
  boosts only main-target hits; an area debuff boosts all.
- **Attribution** per rule at 3 and 5 enemies on the parity kits.
- **Live unchanged.**

## Decisions n00b locks before building (one at a time)

| Gap | Question | Recommended |
|---|---|---|
| 2.7-A | Target caps: almost none stored. | **LOCKED 2026-10-06 (n00b: 1) = Recommended.** An area hit reaches every enemy up to the slider; the 4 caps named in power text apply (Ballad of the Witch 3, Oath Strike 3, Steel Breeze 5, Shuriken Toss 3). With the slider above 1 the confidence line lists "target cap unknown" for each area power in the kit. |
| 2.7-B | Mixed powers: how much lands on the extra enemies? (The 11 untagged powers deal no damage; 10 mixed once paragon copies merge.) | **LOCKED 2026-10-06 (n00b: 1) = Recommended.** Mixed powers with split records (Storm Strike, Shuriken Toss, Vengeance's Pursuit, Chilling Cloud) follow each record's tag. The 6 with one total magnitude (Savage Advance, Contre, Guardian of Faith, Fox Shift, Killing Storm, Eldritch Blast) count as single-target, the guaranteed minimum; with the slider above 1 the confidence line lists each as "area share unknown". |
| 2.7-C | Which hits does a debuff boost when there are several enemies? | **LOCKED 2026-10-06 (n00b: 1) = Recommended.** Only the hits on the enemies it landed on. A class debuff follows its power's tag (area power: every enemy it hits; single: the main target); a feature / feat debuff (no tag) covers the main target; artifact call debuffs get the tag their text gives (24 area, 6 single: a small data addition shown as a dry run before apply); mount power debuffs cover the main target until captured. At 1 enemy nothing changes. |

**Gap list complete 2026-10-06.** Rescan: per-target procs and stacks already run per landed hit; damage over time
records follow the same per-enemy rule as hits; echoes stay on the main target unless their record says others.

## Build order (one commit each, local only)

1. Simulator: area hits per enemy (top-level magnitudes and hit records), caps, the per-target debuff rule.
   Unit tests; one-enemy check.
2. Data: whatever 2.7-A / 2.7-C add (caps from text, artifact debuff targets), dry run first.
3. Page: the confidence line lists "target cap unknown" for area powers when the slider is above 1 (if 2.7-A says so).
4. Page test, baseline, step log, `docs/toon_coverage.md`.
