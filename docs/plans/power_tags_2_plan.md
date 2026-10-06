# POWER-TAGS-2 implementation plan

Written 2026-10-06 from the locked gaps PT2-0 to PT2-18 (register: `docs/audit/power_tag_review_2026-09-09.md`,
section "POWER-TAGS-2 engine pass"). Nothing here is built yet. Each step ships only after its check passes.

**Goal, in n00b's words:** "which powers and what rotation make me do the most damage." Players skip the optimizer
today because it cannot get powers right or match gear to powers.

## Ground rules for every step

- One small step per commit. Push both repos after each step that touches data (`../data` is live and shared with
  other sessions; never build or push `data/*.js` blind).
- `python3 build-data.py` after every source JSON edit.
- New player-facing behaviour sits behind a local-only flag until n00b checks it and says go.
- Every data migration is a script with a dry run. n00b sees the list before it applies. Anything the script cannot
  map cleanly is listed, never guessed.
- Saved builds from before the change must still load with no error. Retired fields are ignored, not crashed on.
- `js/optimizer-local.js` is paid IP: never committed, hardlinked to `premium/private/optimizer-local.js`
  (`cmp` after every edit), shipped only by `vercel deploy --prod --yes` from `premium/` on n00b's go.
- `docs/toon_coverage.md` is updated whenever a modeled system changes (project rule).
- Stage news items in `docs/news_staging.md` as each stage ships.

## Stage 0: safety rails (before any behaviour changes)

| Step | What | Check that proves it |
|---|---|---|
| 0.1 | Baseline script `scripts/_pt2_baseline.js`: for a fixed set of reference builds, record the at-rest panel, the in-combat panel, the current simulator totals and the current optimizer score. Builds: the saved owner builds in `scripts/*.b64`, the calibrated tank and healer links in `scripts/_*_url.txt`, `docs/best_build_warlock_dps_bis.build.json`, plus one build per paragon from the rotation profiles. | Two runs in a row give identical output. |
| 0.2 | Flags `TF_PT2_PANEL_LIVE` and `TF_PT2_SIM_LIVE` (local-only by default), following the `TF_CLASS_TAB_LIVE` pattern. | Live site renders exactly as before with the flags off. |

## Stage 1: stat panel and fight inputs (PT2-1 to 4, 6 to 9)

| Step | What | Check |
|---|---|---|
| 1.1 | Migration A: give the 39 conditional features and feats a stat map plus one gate shape (toggle, linear, perStack, dutyCycle, threshold, count). Folds `gatedPercentStats` into a toggle gate; keeps `percentStatsConditionalByParagon`; keeps `outOfCombatStats`. Pieces whose bonus is not a panel stat (element or power restricted) are marked for Stage 2. **n00b approves the dry-run list.** | Validator passes; with every gate at full, the in-combat panel equals the Stage 0 baseline exactly on every reference build. |
| 1.2 | Resolver: grow `BUILD_CONDITIONS` into the single resolver. It returns a 0 to 1 fraction for each shape; gear `conditionId` and class `conditionKey` both route through it. The three old special cases (`assumeAlwaysOn`, `curseGated`, `enemyMissingHealthScaled`) fold in. An unknown key keeps today's behaviour and is flagged. | Three-state check per key on both paragons of its class: old data against new, control off against on. |
| 1.3 | Build-result states, Stage 1 version: a state shows its peak when the kit has a source (from resource tags), zero when it has none. Shown in the Conditions tab with the reason, no player override. | Wizard with and without Ray of Frost: Chill 6 against 0; Frigid Winds follows. |
| 1.4 | Fight-fact toggles in the Conditions tab: behind target, solo, control immune target (default on), being attacked, heal target within 15 ft, ally below a health line (the others default off). Each appears only when an equipped piece reads it. Stamina and health map to the existing sliders. | Show and hide follow the slotted pieces; values survive save and load; old builds load. |
| 1.5 | Views: the in-combat view is a snapshot (gated stats at the scenario values, timed buffs counted as up, lines tagged with the gate and its input). The at-rest view is unchanged except that out-of-combat stats (Marathon Runner) show there and disappear in the in-combat view. The optimizer scores fight averages, shown only as a tag. | Headless panel render: at-rest equals the baseline except Marathon Runner; in-combat at full equals the baseline. |
| 1.6 | Remove the Class tab. `activeMechanics`, `forcedPowerBuffs` and `warlockSoulSparks` are ignored on load. (Correction 2026-10-06: `scorchAtSparks` is NOT a Class tab field - it is the "Fire Soul Scorch at N sparks" setting in the rotation section and keeps working until Stage 4 lets the optimizer choose it.) Retire `TF_CLASS_TAB_LIVE`. | Every reference build and saved fixture loads with no page error. |
| 1.7 | **Checkpoint: n00b checks Stage 1 locally, then on his go the panel flag goes live.** | n00b compares in-combat sheets in game against the snapshot view. |

## Stage 2: tag-driven simulator, free (PT2-10 to 15, 17, 18)

| Step | What | Check |
|---|---|---|
| 2.1 | Effect vocabulary spec (`docs/plans/effect_vocabulary.md`) with about ten kinds: hit, damage over time, buff, debuff, stack change, resource change, cooldown change, proc, control, heal or shield. A validator in the build step rejects fields outside it. | The validator runs in `build-data.py`; a planted bad field fails loudly. |
| 2.2 | Migration B: the ~950 stored effect blocks (500 distinct field names) into the vocabulary. **n00b approves the dry-run list and the list of blocks that did not map.** | The validator passes on all nine classes. |
| 2.3 | Simulator core rewrite in `toon-forge-rotation.js`: a generic event engine reading the vocabulary. The Warlock layers (Curse, Soul Sparks, Soul Puppet, Creeping Death) move into data; no name-based code remains. | The Hellbringer reference rotation gives the same totals as today's simulator before any new feature is switched on. |
| 2.4 | Per-hit multipliers: each hit is scored at the moment it lands with the engine's base stats plus active buffs and debuffs, clamped to caps, filtered by element, power type and named power. The existing damage formula is called per hit. Crits as expected value. | With no timed buffs in the build, the new total equals the old total exactly. |
| 2.5 | Fight script: one or two full rotations, a 10 s artifact call window, repeat; party buffs only from the Party section, inside the window. Artifact buff lengths are extracted from the power text into numbers (**n00b approves the extraction list**); missing ones count no window. | The timeline shows the window; inside plus outside equals the total. |
| 2.6 | Expected-value procs with lockouts; next-cast procs; random amounts at the minimum; random picks from the player. Missing numbers count zero; assumed numbers are used and labelled; the confidence line carries the ranked capture list. | Node unit tests (the simulator loads in node); the same build gives the same answer every run. |
| 2.7 | Extra targets: area hits count once per enemy up to the enemy count slider; mixed powers by their area share. | Enemy count 1 equals the step 2.6 result exactly. |
| 2.8 | Rule-built rotation (free): opener, loop and burst from the tags. Buff or debuff before what it boosts; refresh stacks before expiry; spend cooldowns as they come up; best charge or channel length; hold encounters, dailies and action points for the call. | Every reference build produces a valid rotation that never casts a power on cooldown. |
| 2.9 | Free simulator display: per-power table, inside and outside split, timeline, confidence line; own powers in rule-built or typed order. Build-result states switch from peak to simulated values for scoring; the snapshot view keeps the peak. | Headless render on every reference build with no page errors. |
| 2.10 | **Checkpoint: n00b checks the simulator locally, then on his go the simulator flag goes live.** | n00b's live runs (PT2-17). |

## Stage 3: data captures and the live-run loop (n00b-driven, ongoing)

- Captures, ranked by the confidence line: Smolder numbers (Thaumaturge gating), Stealth refill time (Rogue gating),
  the 25 artifact buff lengths missing from their text, damage belt items (magnitude and cooldown), then the open
  test list in `docs/data_issues.md`.
- Live runs of recommended builds. An optional recording can go through the combat parser for a per-power comparison.
- Each capture becomes a measured number in the data, followed by the simulator check for that class.

## Stage 4: premium search (private optimizer file)

| Step | What | Check |
|---|---|---|
| 4.1 | Setup window rebuild: a checklist of only the fight facts this kit reads, editing the same shared inputs as the free Fight panel. Optimizer-only choices stay (search scope, build style, account, party, augments). Slot locks extend to powers, class features and feats. | Changing an input in either place shows in the other. |
| 4.2 | Joint kit search: powers, class features and feats searched together, one pick at a time with restarts. Each kit is scored with its rule-built rotation and the per-hit damage over the whole fight. | Run time measured on the reference builds (estimate 10 to 30 s on top of the gear search); repeat runs give the same answer. |
| 4.3 | Rotation-order refinement for the best ~20 kits. | A refined rotation never scores below the rule-built one. |
| 4.4 | Result: the kit, the rotation with a reason per step, the inside and outside split, the confidence line. The gear search scores against the chosen kit's rotation. Healer and tank gear scoring stays unchanged unless the Damage goal is picked. | n00b reviews the result screen locally. |
| 4.5 | **Checkpoint: premium redeploy on n00b's go.** `cmp` the hardlinked copies first. | A member build on the live site, then n00b's live runs. |

## n00b's checkpoints, in order

1. Approve the Migration A list (step 1.1).
2. Check Stage 1 locally, then go live (1.7).
3. Approve the Migration B list and its unmapped blocks (2.2).
4. Approve the artifact length extraction list (2.5).
5. Check the free simulator locally, then go live (2.10).
6. Review the premium result screen, then give the redeploy go (4.4, 4.5).
