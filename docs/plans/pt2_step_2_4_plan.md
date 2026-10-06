# POWER-TAGS-2 step 2.4: per-hit multipliers (plan)

Written 2026-10-06. Nothing here is built yet. Part of `docs/plans/power_tags_2_plan.md`, Stage 2. Everything stays
local-only (one go-live at the very end, n00b 2026-10-06).

**The step in one line:** every hit the simulator lands is turned into real damage at that moment, using the build's
stats plus the buffs and debuffs that are up right then, instead of counting raw magnitude.

## What the code does today

- **The damage score is one average hit, not a fight.** `computeDpsExpectedDamage(mag)` (`toon-forge.html` ~20906)
  scores one hit of magnitude 100: item level, Power, Critical Strike and Severity (crit as an expected value), Combat
  Advantage (flank slider joined with companion grants), Accuracy against deflect, enemy Defense, and the damage
  bonus groups from the engine. The baseline, the optimizer and the stat advisor all read this number.
- **The simulator's output never reaches it.** `rotationMagPerSec()` returns the simulator's magnitude per second,
  but it is only used as a divider (sequence procs, the mount burst share). Nothing multiplies the score by it. The
  comment in `toon-forge-rotation.js` that says multipliers are "applied later by computeDpsExpectedDamage" is wrong
  today.
- **Every timed bonus is an average folded into the stats.** Gear procs, race traits, mount and companion buffs,
  class-feature gates and slotted buff powers (`slottedBuffMultiplier`) are each multiplied by an uptime and added to
  the stats before the score runs. Nothing is judged hit by hit.
- **The power-type bonuses use a fixed mix.** At-will, encounter and daily bonuses are blended by a per-paragon
  profile (`getPowerMix()`), not by what the rotation actually cast. Magical or physical comes from the paragon, not
  from the power.
- **The simulator ignores what buffs do.** `simulateFx` records only when each buff and debuff runs out. The `stats`
  on 251 of the 367 buff and debuff records (for example Inspiration's +25% Damage Bonus, Critical Tuning's +10%
  Critical Severity) and the `appliesTo` filters on 52 of them are never read. They only work as on/off switches for
  other records.

## What it should do

1. Split the score's formula in two: a **build part** worked out once (item level, stats, enemy numbers, Combat
   Advantage, proc damage, the bonus groups) and a **hit part** worked out for each hit.
2. The simulator calls the hit part every time a hit lands, passing what it knows at that moment: the power, its
   type (at-will, encounter, daily, damage over time), its element and damage type, whether it is a proc or a
   secondary target, and the stats of every buff and debuff that is up and applies to this hit.
3. Buff stats join the build's stats for that hit only, then the stat caps apply (a buff cannot push Critical
   Strike past its cap). Debuffs that raise damage taken add to the damage-taken group.
4. The simulator returns damage beside magnitude: a damage total, damage per power and damage per second.
5. The rotation panel shows damage per second next to magnitude per second (local only).

## How it is proved

- **Refactor check (no behaviour change):** after the split, `scores.dps` is identical on all 33 baseline builds,
  local and live.
- **Equality check (the plan's rule):** with the new parts switched off (no buff stats, the fixed power-type mix,
  the paragon damage type), total damage equals magnitude total times the one-hit score divided by 100, exactly, on
  every baseline build and every class's test kits.
- **Attribution:** each new part switched on one at a time, the same way as the Migration B parity checks. Every
  change in the total traces to a listed part.
- **Live unchanged:** the live-mode baseline does not move.

## Decisions n00b locks before building (one at a time)

| Gap | Question | Recommended |
|---|---|---|
| 2.4-A | What does the new number replace? | **LOCKED 2026-10-06 (n00b: ok) = Recommended.** Nothing yet. `scores.dps` (one average hit) stays as it is; fight damage per second is a new number on the rotation panel. The optimizer starts using it in Stage 4. Alternative: the damage score switches to fight damage per second now, behind the local flag, so the gear optimizer reads it straight away (bigger change, every damage score moves). |
| 2.4-B | Double counting: a power buff is counted today as an average (slotted buff powers, Class tab buffs, class-feature gates) and would now also count per hit. | **LOCKED 2026-10-06 (n00b: recommended) = Recommended.** When the new simulator runs, it owns every buff that comes from the kit (powers, class features, feats, mechanics, songs), and the averaged copies of those same buffs are left out of the per-hit path. Gear, companion, mount, boon and race bonuses stay averaged (the simulator does not model them yet). |
| 2.4-C | Power-type and damage-type bonuses: blend by the fixed profile, or by each hit? | **LOCKED 2026-10-06 (n00b: 1) = Recommended.** By each hit: an at-will bonus counts on at-will hits only, a magical bonus on magical hits only. Listed as a difference in the attribution check. |
| 2.4-D | A buff that pushes a stat past its cap. | Clamp per hit to the engine's cap, like the panel. |

## Build order (one commit each, local only)

1. Split `computeDpsExpectedDamage` into the build part and the hit part. Refactor check.
2. Simulator: buffs and debuffs keep their stats and filters while they are up; `land()` calls an optional
   `input.scoreHit` with the hit and the active stats. With no `scoreHit` passed, the simulator behaves exactly as
   now (all nine parity scripts still pass).
3. The page passes `scoreHit` (built from the build part) when the new simulator runs. Equality check.
4. Switch on, one at a time: buff stats per hit, per-hit power type, per-hit damage type, the 2.4-B rule.
   Attribution check per class.
5. Rotation panel: damage per second beside magnitude per second. Page test, 33-build baseline, step log entry,
   `docs/toon_coverage.md` updated.

## Not in this step

- Procs stay as averages (step 2.6). Extra targets stay one enemy (step 2.7). The artifact window waits for the
  fight script (step 2.5).
- `js/optimizer-local.js` is not touched (Stage 4).
- Party buffs from the Party section stay as they are (step 2.5 puts them inside the artifact window).
