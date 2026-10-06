# POWER-TAGS-2 step 2.8: rule-built rotation (plan)

Written 2026-10-06. Nothing here is built yet. Part of `docs/plans/power_tags_2_plan.md`, Stage 2; locked by PT2-5
(the rotation is BUILT, rule-based: buff / debuff before what it boosts, refresh stacks before expiry, spend
cooldowns as they come up, best charge / channel length), PT2-12 (hold encounters / Action Points for the call
window; score = total damage over the fight) and PT2-18 (free: the simulator runs your own powers in a rule-built
order or your typed order). Everything stays local-only.

## What the code does now

- **With no typed rotation, the order is "strongest per cast first"** (`defaultSteps`, `toon-forge-rotation.js`
  ~line 58): encounters and dailies sorted by magnitude, then at-wills by magnitude per second. It knows nothing
  about buffs, stacks, the call window or castable mechanics.
- **A typed rotation is a strict script** (ROT-3): the opener once, the loop repeating; each entry casts in order, a
  step still on cooldown is waited for (an at-will fills the gap) unless it is more than 5 s away, then skipped.
- **Dailies fire on their own** whenever ready and not in the list; the spender (Soul Scorch-type mechanics) fires at
  its threshold; the artifact and mount power fire at the call window (step 2.5).
- **Castable mechanics never cast unless typed**: Stealth (Rogue), Battlerage / Unstoppable (Barbarian), songs (Bard,
  once song slots exist in step 2.9). That is why the 2.4-G panel lists them as "never turned on".
- **Modes are fixed**: 40 powers have modes (Rogue stealth / base 20, Spell Mastery 12, tap / full charge 4, keyed-on 3,
  Contre's three stances, early / enhanced). The simulator uses the first non-Spell-Mastery mode unless told otherwise.
- **Nothing is held for the call window.** A daily fires the moment it is ready, even 2 s before the window.

## What it should do

1. **A rule-built rotation** when the player has typed none (what form it takes: gap 2.8-A). A typed rotation always
   wins and keeps today's strict-script rules.
2. **Buff / debuff before what it boosts**: a power or mechanic whose records raise your damage (buff, debuff, mod) goes
   before the damage it boosts, read from its fx, no names in code.
3. **Refresh stacks and buffs before they expire**: re-cast when the remaining time is shorter than the time to the
   next chance to cast it.
4. **Spend cooldowns as they come up**, strongest damage per cast first.
5. **Castable mechanics and songs** join the rotation when their records say they can be cast and would do something
   (Stealth when the meter allows, Battlerage at its Rage minimum, songs whose effect is down).
6. **Hold for the call window** (how: gap 2.8-B).
7. **Best mode** for powers with modes (gap 2.8-C).
8. **Display**: the rule-built rotation is shown in the rotation panel the way a typed one is, with a short reason per
   entry ("buff: boosts your next hits", "refresh: stacks expire in 2 s", "held for the call").

## How it is proved

- **Valid on every build:** every reference build (33) produces a rotation that never casts a power on cooldown or a
  mechanic it cannot afford (a checker walks the timeline).
- **Never worse than today's default:** on every build the rule-built rotation's fight damage is at least the
  "strongest per cast first" order's; any build where it is lower is listed and explained.
- **Typed rotations unchanged:** a build with a typed rotation gives exactly the step 2.7 result.
- **Unit tests** for each rule (buff first, refresh timing, hold, mode choice).
- **Live unchanged.**

## Decisions n00b locks before building (one at a time)

| Gap | Question | Recommended |
|---|---|---|
| 2.8-A | What form does the rule-built rotation take? | **LOCKED 2026-10-06 (n00b: 1) = Recommended.** A priority list: the rules rank powers and mechanics; at every free moment the simulator casts the first entry that is ready and useful (refresh a dropping buff / stack, buffs and debuffs before damage, encounters strongest first, at-wills fill). Stage 4 refinement reorders the list. The panel shows the list with a reason per entry plus the first loop from the timeline. A typed rotation always wins (strict script, as today). |
| 2.8-B | How does it hold encounters, dailies and Action Points for the call window? | Open. |
| 2.8-C | Powers with modes (tap / full charge, channel length, Contre stances): which mode? | Open. |

## Build order (one commit each, local only)

1. Simulator: the rule-built rotation (2.8-A) with buff-first, refresh and spend rules; castable mechanics and songs.
   Unit tests; validity checker on the 33 builds.
2. Holding for the window (2.8-B); never-worse check against the default order.
3. Modes (2.8-C).
4. Panel: the rule-built rotation with reasons. Page test, baseline, step log, `docs/toon_coverage.md`.
