# POWER-TAGS-2 step 2.6: expected-value procs and the confidence line (plan)

Written 2026-10-06. Nothing here is built yet. Part of `docs/plans/power_tags_2_plan.md`, Stage 2; locked by PT2-13
and PT2-14 (register: `docs/audit/power_tag_review_2026-09-09.md`). Everything stays local-only.

**PT2-13 (locked):** the review rulings apply on the timeline as EXPECTED VALUES - each eligible hit adds its share of
a chance proc; lockouts reduce eligible hits (computed exactly, not rolled); next-cast procs add their expected bonus
to the next cast; random amounts stay at the guaranteed minimum; random picks stay with the player. Same build = same
answer every run. Dice (Monte Carlo) rejected.
**PT2-14 (locked):** missing numbers count zero; assumed numbers are used but labelled; every result carries a
confidence line ("N% of this build's damage rests on assumed numbers") and the open tests that would firm it up,
most valuable first - that list doubles as n00b's capture priority.

## What the code does now

- **Chance procs are skipped.** `simulateFx` ignores every trigger with a chance below 100%
  (`toon-forge-rotation.js` ~lines 884 and 898). 26 class records are affected, for example Storm Spell (20% on
  crit), Assailing Force (10% on encounter cast), Ad Libitum (50% to reuse), Sudden Verdict (25%), Crushing Blows
  (20% on hit), Mystifying Strikes (5% on hit), Execution (10% below 20% health), Chaos Magic (7%, the player's pick).
- **Crits never happen in the simulator.** No "crit" event is fired, so every on-crit record (with or without a
  chance) never triggers. Damage counts crits as an expected value inside the per-hit score (step 2.4), but nothing
  that reacts to a crit runs.
- **13 records carry a lockout** (`icdSeconds`); the simulator already honours it for triggers that do fire.
- **Assumed and missing numbers are flagged, not reported.** 148 records are `provisional` (assumed) and 91 have
  `missing` fields across the nine classes; nothing adds them up or tells the player.
- **Gear, companion and insignia procs** are averaged in the engine today (`computeGearProcDamagePerHit`,
  `computeCompanionProcMagPerHit`, `conditionalDamageUptime`) and reach the new number through the build part of the
  per-hit score.

## What it should do

1. **Chance procs count as expected values** on every eligible event (how each kind of effect plays out: gap 2.6-A).
2. **Crits fire.** Every hit is a crit for its share: the per-hit score already knows the crit chance at that moment
   (with the buffs up then), so on-crit records see that share of each hit. With no scorer (the plain magnitude run)
   the build's Critical Strike is used.
3. **Lockouts are exact:** after a proc fires, eligible events inside its lockout add nothing.
4. **Next-cast procs** (Assailing Force: a stack the next encounter spends) carry their expected share into that
   cast.
5. **Random amounts** stay at the guaranteed minimum; **random picks** (Chaos Magic) stay with the player's pick
   (the picker arrives with the free simulator display, step 2.9).
6. **Confidence line** on the rotation panel (ranking: gap 2.6-C).

## How it is proved

- **Node unit tests** (`scripts/_pt2_proc_unit.js`): a 20% proc on 100 eligible hits adds exactly 20 procs' worth;
  a lockout cuts the count to the exact expected value; a crit-triggered proc scales with the crit chance; two runs
  of the same build give the same answer to the last digit.
- **Parity:** with chance procs and crit events switched off, every class's parity output is unchanged.
- **Attribution:** each class's chance procs switched on one at a time on the parity kits.
- **Live unchanged:** the live-mode baseline does not move.

## Decisions n00b locks before building (one at a time)

| Gap | Question | Recommended |
|---|---|---|
| 2.6-A | How does a chance proc play out without dice? | Open. |
| 2.6-B | Which procs move into the simulator: the class ones only, or gear, companion and insignia procs too? | Open. |
| 2.6-C | How is the capture list in the confidence line ranked? | Open. |

## Build order (one commit each, local only)

1. Simulator: expected-value chance procs (2.6-A), exact lockouts, crit events with the per-hit crit chance.
   Unit tests; parity with them switched off.
2. Next-cast procs; per-class attribution on the parity kits.
3. Confidence line: damage resting on assumed records, the capture list (2.6-C). Rotation panel line.
4. Page test, 33-build baseline, step log, `docs/toon_coverage.md`.
