# POWER-TAGS-2 step 2.5: fight script and artifact call window (plan)

Written 2026-10-06. **Built locally 2026-10-06** (commits 2.5.1 to 2.5.5; results in the step log, `docs/audit/power_tag_review_2026-09-09.md`). Part of `docs/plans/power_tags_2_plan.md`, Stage 2; locked by PT2-12
(register: `docs/audit/power_tag_review_2026-09-09.md`). Everything stays local-only (one go-live at the very end).

**PT2-12 in n00b's words:** one fight script - 1-2 full rotations, then a 10 s artifact call window (the length players
build for), repeat to fight end. Score = total damage over the whole fight; the result shows the split inside / outside
the window and the timeline. Party buffs only from the Party section. Nothing new for the player to set.

## What the code does now

- **The artifact is a trigger only.** The simulator fires the artifact every 60 s (the existing "artifact cadence"
  setting, `tfCadence("artifact")`) with no damage and no buff (`toon-forge-rotation.js` ~line 1035). Its power is only
  text on the item card; it is never scored. Insignia bonuses that trigger "on artifact use" read the same cadence.
- **The artifact power texts are summaries, not numbers.** `../data/artifacts.json` has `power` (free text), `debuff`
  (free text) and `cooldown` for 151 rows (141 names). No structured effect, no length field, no damage number.
- **Your mount combat power is an average.** Its enemy debuff and self buffs count at 10 s / recharge uptime, its
  damage as a share of your magnitude per second capped at 6% (`getPartySummonedCombatMods`). The simulator fires it as
  a trigger only, not tied to these numbers.
- **The Party section is always on.** With "Assume support party" on, ally companions' buffs and ally mounts' party
  auras go into your stats at full value for the whole fight; ally companions' Combat Advantage grants and enemy
  debuffs count at their uptime. Ally mounts' combat powers are not modelled at all. With the switch off (the default)
  the Party section adds nothing.
- **There is no window anywhere.** Only fixed 10 s constants for the mount power uptime.

## What it should do

1. **Fight script.** The simulator runs the rotation, opens a 10 s call window, runs the rotation again, and repeats
   to the end of the 180 s fight (when the window opens: gap 2.5-A).
2. **The call.** At the window start you use your artifact (when off cooldown) and your mount combat power. Their
   effects become timed records like any other buff or debuff, so step 2.4's per-hit scoring counts them on exactly
   the hits they cover. Effects that outlast the window keep counting until they run out ("buffs last their own
   length").
3. **Artifact effects from the approved list.** `callFx` records per artifact, extracted from the power text
   (`docs/plans/artifact_window_dryrun.md`, **n00b approves before apply**). Missing lengths or amounts count zero;
   assumed numbers are used and labelled; random effects count their guaranteed minimum (zero).
4. **Mount combat power in the window.** Its existing stored numbers (debuff, self buffs, damage) move from averages
   to timed records cast at the window start. No new extraction.
5. **Party buffs** stay as today, all fight (2.5-B): they are passive in game.
6. **Result.** Damage inside windows and outside, which add up to the total; the timeline marks each window.
   Damage belt items, artifact damage and ally mount combat powers have no numbers: they count zero and join the
   capture list.

Holding encounters, dailies and Action Points for the window is step 2.8 (the rule-built rotation). Step 2.5 only
opens the window and fires the call in it.

## How it is proved

- **No-window check:** with the window switched off (artifact and mount power back to triggers, Party section as
  today), every result equals step 2.4's exactly, on all 33 baseline builds.
- **Split check:** inside + outside = total on every build.
- **Attribution:** artifact effects, mount power, party rule switched on one at a time.
- **Live unchanged:** the live-mode baseline does not move.

## Decisions n00b locks before building (one at a time)

| Gap | Question | Recommended |
|---|---|---|
| 2.5-A | When does the window open? | **LOCKED 2026-10-06 (n00b: 1) = Recommended.** The existing artifact cadence setting (default 60 s): the first window opens when the first full rotation ends, then one every cadence seconds to the fight end. The artifact fires in a window when off cooldown (a 180 s artifact every third window); the mount combat power fires in every window. Nothing new to set. |
| 2.5-B | The Party section's always-on buffs (ally companion buffs, ally mount auras, Pack): whole fight, or the window only? | **LOCKED 2026-10-06 (n00b: 1) = Recommended.** Passive party buffs (ally companion buffs, ally mount auras, Pack, ally CA grants and debuffs) stay as today, all fight. The window adds only timed effects: your artifact and your mount combat power. Timed party effects (an ally artifact, a banner) would go inside the window if ever modelled; none exist in the Party section today. |
| 2.5-C | Approve the artifact extraction list (`docs/plans/artifact_window_dryrun.md`). | **APPROVED 2026-10-06 (n00b: approve)**, including the 7 assumed rows; applied in build step 2. |
| 2.5-D | Insignia bonuses triggered by the call (found from n00b's question): Predator's Instinct, Cavalry's Alarm / Warning, Cavalry's Haste, Artificer's Enticement / Persuasion, Tactician's Precision. Today each is a fight-long average off the cadence sliders. | **LOCKED 2026-10-06 (n00b: 1) = Recommended.** Fired by the simulator with the triggering action: the rating buffs as 20 s buffs from the mount power cast (per hit, clamped), the cooldown cuts as real cuts when the mount power / artifact / daily fires. Their averaged copies are left out of the new number (as 2.4-B); today's damage score is unchanged. Shepherd's Devotion is defensive and stays out. |

**Gap list complete 2026-10-06 (reopened once for 2.5-D).** Gear procs triggered by Daily / Encounter use
(Umbral Convergence, Controlled Sandstorm, Battle Reserves, Malignant Energy) are step 2.6's timeline procs, not this
step. Rescan found nothing else: every mount combat power has a 60 s recharge (98 of 98), so
it fires in every window at the default cadence; the simulator still checks its cooldown, so a longer cadence or a
future slower power behaves like the artifact. The 13 rows missing a number are logged in `docs/data_issues.md`.

## Build order (one commit each, local only)

1. Vocabulary: buff `ratingStats` (rating buffs such as banners' 5,000 Power, turned into % per hit at your item
   level and current rating), buff `role`, resource gain over `seconds`. Validator in `build-data.py`.
2. Apply the approved artifact list (`callFx`, `callStatus`, `callNote` in `../data/artifacts.json`), rebuild
   `data/artifacts.js`.
3. Simulator: the fight script and the window; the artifact and mount power as owners cast at the window start;
   inside / outside totals. No-window check.
4. Page: pass the artifact's `callFx`, the mount power records and the call-triggered insignia bonuses (2.5-D), with
   their averaged copies left out of the new number. Split check, attribution.
5. Rotation panel: the inside / outside split and the windows on the timeline. Page test, baseline, step log,
   `docs/toon_coverage.md`.
