# Toon Forge — Coverage Audit

Live audit of which Neverwinter systems the Toon Forge stat engine and the
(local-only) optimizer model. Required by the parent `CLAUDE.md` Coverage
Audit Policy. **Update this file whenever Toon inputs, optimizer constraints,
or modeled systems change.**

Status legend: `Implemented` · `Partial` · `Missing`

Last full review: **2026-06-09** (post full-site /audit: 4 of 5 blockers fixed
same-day; numbers below re-counted from live data, not carried forward).

---

## System coverage

| System | Status | Where |
|---|---|---|
| Gear (all slots, per-IL tiers, picked-tier resolution) | Implemented | `toon-forge.html` (`findGearByName`, `state.gear`/`state.gearIL`), `../data/gear.json` (6,376 entries) |
| Gear set bonuses (incl. role-conditional `eb.role`; Freezing 2-pc pairs gated on piece count) | Implemented | engine equip-bonus ingestion (`eb.setName` matching, `setPieceCounts`); role filter at every ingestion path |
| Gear equip bonuses — structured | Partial | see §Partial-1 |
| Runtime proc conversions (apProc / cdProc) at the build's crit + deflect | Implemented (2026-09-08) | `_procConvert` (toon-forge.html) turns `apProc {ap,trigger,chance,icd}` into Action Point Gain % and `cdProc {seconds,...}` into Recharge Speed % using `procRatePerSec` at hints from a deterministic two-pass `getEngineResult` (pass 1 fixed 90%/20%, pass 2 at the build's crit/deflect); `deflect` trigger = struck rate x build Deflect. 162 entries carry apProc/cdProc; static `amount` kept as a 90%-crit fallback |
| Enemy-count gate + per-enemy scaling (Enemies in combat slider) | Implemented (2026-09-08) | `#enemy-count` -> `state.enemyCount` (1-10, default 1, saved); entries `minEnemies` / `maxEnemies` / `perEnemy` (+`perEnemyBaseAmount`), `requiresMultiEnemy` now = minEnemies 3 (`_enemyCountSkip`); per-enemy stackers scale to min(count, maxStacks) in the isStacked block. 353 entries tagged by `scripts/_eb_enemy_tag.py`. The old `aoeScenario` flag still forces multi-enemy on |
| Movement gate (Moving / Standing still toggle) + explicit health gate | Implemented (2026-09-08) | `#movement-state` -> `state.movementState`; entries `movingOnly` / `standingOnly` (`_movementSkip`, 48 tagged). `healthBelowPct` / `healthAbovePct` on the existing Current Health slider (`_healthSkip`) for wordings the text regex misses |
| Stamina gate (Current stamina % slider) | Implemented (2026-09-07) | `#current-stamina-pct` -> `state.currentStaminaPct` (default 100, saved); entries tagged `staminaAbovePct` / `staminaBelowPct` gated exactly (`_staminaSkip`); 164 entries tagged from text. Fixed a double count: 'over 75%' and 'under 25%' bonuses were both counted at once |
| Action-point gate (Current AP % slider) | Implemented (2026-09-07) | `#current-ap-pct` -> `state.currentApPct` (default 50, saved); entries tagged `apBelowPct` / `apFullOnly` gated exactly (`_apSkip`, both ingestion paths); 20 entries tagged from text |
| Distance-to-target gate (feet slider) | Implemented (2026-09-07) | `#target-range-ft` -> `state.targetRangeFt` (default 10, saved); entries tagged `targetRangeFt` + `targetRangeSide` (within/beyond) are gated exactly in both ingestion paths (`_targetRangeSkip`); `scripts/_eb_range_tag.py` tags them from text (66 entries). Ally-proximity and enemy-count text are NOT this gate |
| Zone-gated bonuses (Content-zone picker) | Implemented | `#content-zone-select` (Step 6) → `state.contentZone`; gate at both ingestion paths (`eb.zones`); data convention = base + zone DELTA (in-zone total = base+delta, never both-at-full); 72 zone-tagged entries |
| Sequence-proc damage layer ("use Daily → next Encounter +X%") | Implemented | `computeSequenceProcBoost()` — parses gear FREE TEXT directly, weights by rotation share; see §Note-2 landmine |
| Gear reinforcement kits | Implemented | `../data/kits.json`, kit chips per slot |
| Frostsilver gem synergy | Implemented | `gemSynergy` field + `buildEngineCharacter` merge (only while matching enchant slotted) |
| Enchantments (stats + Universal CR 1620 + gemstone multi-stat) | Implemented | `../data/enchants.json`, `pushEnchant` (CR fix b6f0043); bonus enchants contribute 0 TIL (verified) |
| M33.5 dual Combat Enchantment slots (Strike + Guard) | Implemented | Live since M33.5 shipped 2026-09-01. `M335_DUAL_COMBAT = true` in `toon-forge.html` (kept as a named constant so the dual-slot paths stay greppable). UI chips read `Combat · Strike` / `Combat · Guard`; stored key stays `state.enchants.combat2` (share links / saves). Engine (`pushEnchant "Combat 2"`), TIL, gem-synergy sets and the optimizer (`enchant:Combat 2` slot, own candidate pool) all wired. Data side: every Combat enchant's Item Level HALVED and its damage line moved from `Dmg Bonus` to `Base Damage Boost`, per the release article. Slot layout + rules VERIFIED against the in-game Enhancements tab screenshot in the release article (`docs/calibration/evidence/2026-09-01_m335_enhancements-tab_strike-guard-slots.jpg`): Strike sits under the Offense column holding Celestial Lightning Flash (Offense-tagged), Guard under the Defense column holding Celestial Shattered Resolve (Defense-tagged). RULING 2026-09-07 (n00b): there are NO Utility-tagged combat enchants — Divine Aegis / Radiant Sanctuary / Fluid Aurora are Guard-slot (Defense) enchants; data retagged, picker + optimizer pools now strictly Strike = Offense, Guard = Defense, so the earlier duplicate-in-both-slots question is moot |
| Overloads | Implemented | `../data/overloads.json`; contribute 0 Total Item Level (owner-verified 2026-06-07) |
| Weapon Artifact Modifications (Off Hand Art Mod 1 + 2; Main Hand Enhanced power) | Partial | `state.artifactMods`; Art Mod 1 fixed owner-verified values, Art Mod 2 clamped entry; see §Partial-3 |
| Artifacts (primary + 3 secondary) | Implemented | `../data/artifacts.json` |
| Companions: summoned + 5 active, rarity scaling | Implemented | `../data/companions.json` / `companion_powers.json` |
| Companion proc effects (`statEffects`, always-on passives) | Implemented | engine routes percent/rating/flat; Passive+100%+self = base panel |
| Companion enhancements | Implemented | `../data/companion_enhancements.json` |
| Companion gear | Implemented | routed via `buffs[]` (`compGearToBuff`) — see §Note-1 landmine |
| Companion-slot enchant (choice: Companion Damage % / Augment stat grant) | Partial | see §Partial-4 |
| Companion bolster (IL × bolster%) | Implemented | verified formula; companion gear/enchant do NOT affect it |
| Mounts: combat power (125% bolster anchor) | Implemented | magnitudes stored at 125%; engine scales `(1+b/100)/2.25`; `anchorRarity` for Celestial captures |
| Mounts: equip powers, insignias, insignia bonuses, collars | Implemented | `../data/mount_*.json`; 5-mount loadout rules; mount powers count TIL at rarity IL (Celestial 3,937 vs Mythic 3,000); mount-collection bolster grants NO TIL (2026-06-07 re-add reverted 2026-06-10 — anchor build was stale; see history note in toon-forge.html) |
| Combined Rating distribution (15 stats) | Implemented | `CR_CORE_STATS` in `toon-forge.html` — in-game verified incl. Forte/Control Bonus/Control Resist |
| Stat caps / rating formula / Forte distribution | Implemented | `toon-forge-stats.js` (caps), `toon-forge-engine.js` (rating→%, Forte 50/25/25) |
| Ability scores (per-point conversions) | Implemented | `ABILITY_CONVERSIONS`; CON→HP lives ONLY in the HP model (double-count fixed 2026-06-05) |
| Max HP model (TIL×10×role + flats, ×CON, ×HP%) | Partial | see §Partial-2 |
| Boons (campaign + guild) | Implemented | `../data/campaign_boons.json`, `guild_boons.json` |
| Races | Implemented | `../data/races.json` |
| Classes / paragons / feats / powers | Implemented | `../data/classes.json`, `general_feats.json`; stance/song/sparks modeled; Soulweaver class-shared features + Soul Puppet added 2026-06-07 |
| Consumable buffs | Implemented | `../data/buffs.json` → `buffs[]` (double `Buff: Buff:` source prefix is intentional — the Hide-buffs filter keys on it) |
| Damage layer: buckets + proc damage (companion + gear) | Implemented | `DAMAGE_BUCKET_MAP`, proc cadence × chance × magnitude; Xuna ~+14% meta-verified |
| Party allies / Pack meta (Raptor) | Implemented | `partyPackMeta` toggle; ally equip powers at Mythic (factor 1.0) |
| Detailed Stats explainability (Hide buffs / Hide party buffs / Hide in-combat bonuses, proc-uptime tags) | Implemented | three consistent "Hide X" toggles (in-combat default-hidden, checkbox checked = hidden); uptime % shown on proc stat-grant lines |
| Share links / saved builds | Implemented | `serializeBuild`/`applyBuild`; incl. `gearIL`, sim settings (`flankUptime`, `simMag`), `contentZone`, `artifactMods` |
| Resource & heal proc layers (gear) | Implemented (2026-09-07 conversions) | `procHeal` / `procDamage` (+`percentMaxHP`) on gear; AP procs -> Action Point Gain %, cooldown procs -> Recharge Speed % (formulas in each entry's `note`); `PROC_DAMAGE.rates` kill/deflect/bighit/heal/combat_start. Self-heal stays sustain-only per the tank ruling. Remaining: heal-sim consumption of ally procs is per-cast averaged (HEAL_PROC.CAST_RATE) — see §Missing-1 for what is still unmodeled |
| Optimizer: honest total item level per candidate (OPT-TIL = 2, 2026-09-07) | Implemented (local-only, not on Vercel) | `js/optimizer-local.js` `refreshTIL()` at the top of `expectedDamage()` — `computeTILFromBuild()` → `state.il` on every scoring call, memoized on the TIL-relevant state slices. Before this TIL was read once at optimize-start and frozen through the whole search (a fresh Bard settled at TIL 89k with 1,900 weapons; honest search reaches 143k). Flag `OPT_HONEST_TIL`; A/B hook `window.__OPT_HONEST_TIL=false`; `scripts/_optimize_validate.js` honours `HONEST_TIL=0`. Cost: more candidates survive pruning on low-TIL builds (quick 30s→80s); ~none at endgame |
| Optimizer (engine-scored, role objectives) | Implemented (local-only) | `js/optimizer-local.js` — gitignored, paid IP, never deployed; button lives in the local-only "Premium" hero group |
| Conditional-uptime weighting — ALL bonuses (OPT-G1, 2026-06-10) | Implemented | `conditionalDamageUptime` applies to every gear/overload equip bonus (stat grants included, no longer damage-buckets-only) and to non-passive companion proc stat-grants (duty-cycle from structured trigger/chance/duration/cooldownSeconds; party-scope Pack stacks exempt). Kill switch `CONDITIONAL_UPTIME.apply_to_stat_grants=false`; per-bonus pin `uptimeOverride` (0..1, NaN-guarded) on gear equip bonuses and companion `procEffect`. Lines credited <100% show `~X% uptime`. 11 gear.json pins shipped (6 Charged Rejuvenation @0.90, 5 Living Magma @0.55) |

---

## Partial entries — what's missing to reach full optimizer support

### Partial-1: Gear equip bonuses (free-text long tail)
- **Location:** `../data/gear.json` `equipBonuses[]`; parse conventions in
  `docs/audit/eb_parse_progress.md`; parse scripts `scripts/eb_parse_batch*.py` (parent repo).
- **Current (re-counted 2026-06-09):** 2,952 of 4,810 equip-bonus entries are
  structured (`stat`+`amount`) and scored by the engine; 1,478 remain
  description-only. The 2026-06-08 parse batches added four whole families:
  always-on percent grants, combat-time stackers (counted at max), enemy-count
  bonuses (`requiresMultiEnemy` gate vs single-target), and proc stat-grants
  (`uptimeWeighted` at sustained uptime). Zone-gated bonuses use the base+delta
  convention and are live behind the Content-zone picker.
- **Required:** continue parse batches; each structured bonus immediately counts
  in stats/optimizer (no engine change needed for plain stat bonuses). Do NOT
  structure sequence-proc texts (§Note-2).
- **Update 2026-09-07 (set bonuses):** the SET-bonus subset of the long tail is
  now cleared — `docs/audit/set_bonus_audit_2026-09-07.md`. Chilling Flow was
  wired on Paladin only (8 classes scored it as zero); Dark Matter's "up to 5.5%
  by HP difference" read as always-on; 48 sets had per-class wiring holes; 283
  amount-0 placeholders looked wired. Four batches structured ~75 sets on every
  class (one wired piece per class+tier, stat-less marker, stated uptimes via
  `uptimeOverride` / `uptimeClass` / `procModel`). Engine: `CONDITIONAL_UPTIME.hp_diff`
  (0.40) + generic `uptimeClass`; set dedup key gained `#stack/#zone/#cond` so two
  mechanics on one stat coexist. Scripts: `scripts/_set_wire*.py` (local). Still
  text-only by nature: Crimson Retaliation, Astral Absorption, Lostmauth's Hoard,
  Vistani 3pc, Chultan, Drowcraft; Chilling Flow 4800 numbers not captured.
- **Update 2026-06-15:** re-census (all instances incl. Set) = **3,238 of 5,233
  structured (61%)**; ~1,679 description-only, of which **744 are heal/resource
  (blocked on Missing-1, not data work)** and ~515 DPS-relevant skew low-IL. The
  endgame (IL>=4000) offensive long-tail is now CLEARED: 37 instances / 31 names
  structured via `scripts/eb_parse_endgame_offense.py` (see
  `docs/audit/eb_parse_progress.md` 2026-06-15). Remaining DPS-relevant work is
  the lower-IL tail; the bigger lever now is optimizer search quality
  (multi-start + armor set-completion), not data vision.
- **Update 2026-09-10:** optimizer set-completion now also assembles **Neck+Belt
  2-piece accessory sets** (`completeAccessorySets`, mirror of the clothing pass
  with cap-repair). Found via the Shroomwood/Scintillant vs Voidbound case: each
  Menzoberranzan piece alone is IL 1800 vs 4050 with no bonus, so a from-scratch
  greedy never tried the pair. With the pass the pair scores +2.8% on the shared
  Warlock build and is picked from bare gear too. 4pc armor still omitted.

### Partial-2: Max HP calibration
- **Location:** `toon-forge-engine.js` finalize() HP branch; constants `TOON_FORGE_HP_MODEL`.
- **Current:** full formula implemented; CON double-count removed 2026-06-05
  (~7% overshoot fixed). Anchor on file: Erik (healer Paladin, TIL 126,775,
  CON 14 → 1,588,795 HP).
- **Required:** n00b's HP calibration screenshot to validate flats/percent
  sources against the anchor, then tune `TOON_FORGE_HP_MODEL` if needed.

### Partial-3: Main Hand Enhanced powers (Artifact Modification Management)
- **Location:** `state.artifactMods`, Enhanced-power menus in `../data/classes.json`.
- **Current:** all six Warlock Enhanced options captured from owner screenshots
  (+10% to one power; damage picks boost that power in the sim while slotted;
  healing/per-stack picks recorded but excluded from the sim).
- **Required:** in-game screenshots of the other seven classes' Enhanced menus
  before their options can appear.

### Partial-4: Companion-slot enchant (choice: Companion Damage % / Augment stat grant)
- **Location:** `toon-forge.html` ~12902; data in `../data/enchants.json` id 37
  (Celestial Companion) `companionEnchant`/`rarityLadder`.
- **Current (fixed 2026-07-07):** augment-summon branch wired — pushes a
  `ratingStats` buff of `rung.augmentBonusPerStat` per stat in the summoned
  companion's `augmentShares` (rank-aware via `state.enchantRarity["Companion"]`).
- **Required:** the Companion Damage % branch (non-augment summons) needs a
  damage-output layer before it can be applied — silenced as `"Companion
  Damage"` in `toon-forge-stats.js` in the meantime.
- **Optimizer note (2026-07-23):** because only the augment branch is wired,
  augments out-score every other summon and the optimizer picked them at every
  role. They are now barred from the summoned slot by default via a
  role-independent gate in `js/optimizer-local.js` (`OPT.augments`,
  `ALLOW_AUGMENTS`/`isAugmentComp`), lifted by the `tf-allow-augment` checkbox.
  This is a COMMUNITY-META constraint, not a math fix — closing the Companion
  Damage % branch above will narrow the real gap and is the thing that would
  justify revisiting the default.

## Missing entries

### Missing-1: Resource & heal proc engine layers
- **Location (data ready):** ~324 gear equip bonuses describing resource gain
  (AP/stamina/divinity/Soulweave) and heal procs sit unparsed in
  `../data/gear.json` (was ~430; the 2026-06-08 batches structured the rest).
- **Current:** display-only; contribute nothing to scores.
- **Required:** an engine layer that converts resource/heal procs into role
  value (healer throughput, AP uptime). Blocked on modeling decisions, not data.

---

## Notes / landmines

- **Note-1:** `buildEngineCharacter` hardcodes `companionGear: {}` — companion
  gear is routed ONLY via `buffs[]`. If a refactor ever populates the
  `companionGear` field, it will double-count. (Audit 2026-06-05 #30.)
- **Note-2:** the sequence-proc layer (`computeSequenceProcBoost`) parses gear
  description FREE TEXT directly ("use a Daily → next Encounter +X%"). Do NOT
  add structured `stat`/`amount` to those ~21 bonuses — the engine would count
  them twice (once uptime-weighted, once at face value).
- **Note-3:** zone matching is EXACT-string (`eb.zones.includes(contentZone)`).
  Overlaps (e.g. should "Thay" also trigger "Fire-themed maps"?) are not
  modeled; revisit if a zone belongs to two gear vocabularies.
- **Note-4:** `conditionalDamageUptime` returns 1 for zone-tagged bonuses — the
  zone gate upstream already confirmed in-zone, so they are always-on there.
  (Was 0 until 2026-06-09, which silently zeroed every zone delta.)
- **Note-5 (OPT-G1 landmines, 2026-06-10):** the `vs_enemy: 0.0` family matches
  `/\bagainst\b|\bvs\b/` in bonus text — broad on purpose, but a non-enemy use
  of "against" in an effectText would zero a legitimate bonus. Escape hatch:
  set `uptimeOverride` on that bonus. Also: `alwaysActive` must NEVER double as
  an uptime override — it drives the stack-split ingestion (permanent baseline
  + conditional extras); `uptimeOverride` is the only sanctioned pin.
- Engine consumes canonical short stat names (`Deflect`, `Control Resist`);
  legacy long forms still alias via `STAT_NAME_ALIASES` for old saved builds.
- Energon (power 201) +35,000 MaxHP is game-verified and intentionally off the
  MAX_HP scale — do not normalize.
- Open data verifications that affect scoring quality live in
  `docs/data_issues.md` (Demonweb Empowerment stack interval 3s/5s, Flayed
  Legion classes + missing stat, Enchanted Advantage/Awareness real set
  names, set-suffix clusters, clothing-variant slots). Balgora id 56,
  Hellfire Remains, and Ultraviolet Cap were all RESOLVED 2026-06-09.
| Enemy attacks toggle (melee / ranged) | Implemented | `toon-forge.html` `state.incomingAttackType`, `_attackTypeSkip`; `vsRangedOnly` / `vsMeleeOnly` entry fields | Sim-row select "Mostly melee / Mostly ranged" (default melee) gates 7 Bulwark's Shield entries ("3% less damage from Ranged attacks"); serialized, in the share link + engine cache key (n00b 2026-09-08). | n/a |
| Missing-health graded bonuses | Implemented | `toon-forge.html` `_missingHpFactor`; entry field `missingHealthMaxAtPct` (+ `zonesExclude` for the outside-zone half) | "Gain up to X based on your missing health, max at N% or less" scales linearly off the Current Health slider: 0 at full health, full at N%. 19 entries (Survivor's Resilience, Enduring Resilience, Survivor's Reflexes, Survivor's Critical Resilience) + 3 Xaryxis outside-Wildspace halves. Bypasses the legacy threshold gate. n00b 2026-09-08. | n/a |
| Target has a shield toggle | Implemented | `toon-forge.html` `state.targetShielded`, `_attackTypeSkip`; entry field `vsShieldedOnly` | Sim-row checkbox (default off) gates Shield Breaker (Garnet Abyssal Loop, Dmg Bonus 8, was display-only). Serialized + cache key. n00b 2026-09-08. | n/a |
| Build conditions registry | Implemented | `toon-forge.html` `BUILD_CONDITIONS`, `resolveBuildCondition`, `renderBuildConditions`, `_conditionSkip`; entry field `conditionId`; state `partyHealerClass`, `conditionAnswers` | Situations that depend on the party or slotted powers (not the player alone). Auto-resolved from the build when possible (Wizard with Shield slotted; Paladin/Warlock party healer), else a Yes/No asked in the "Build conditions" box that lists only conditions attached to equipped pieces. Unanswered = No; the optimizer resolves through the same function silently. First condition: shield_or_temphp (Shielded Strength: Caster's Robe 8%, Radiant Elven Jerkin 5% Wildspace / 2% elsewhere + 2.5% CritSev). Party healer select lives in the Party Buffs panel. n00b 2026-09-08. | add conditions as the review finds them |
| Contextual sim controls | Implemented | `toon-forge.html` `SIM_CONTROL_NEEDS`, `updateSimControlVisibility`, `equippedEquipBonuses` | The distance / AP / stamina / movement / enemies / enemy-attacks / target-shield controls are shown only when a piece on the build (gear or overload) carries an entry that reads them; Content zone always shows. Hidden controls keep their value. n00b 2026-09-08. | register any new gate in SIM_CONTROL_NEEDS |
| Solo / party mode | Implemented | `toon-forge.html` Content type select (`state.partyContent` = dungeon / trial / solo), `_partySkip`, `_partySize`; entry fields `soloOnly`, `partyOnly`, `perTeammate`; `equipBonusGatedByState` for proc entries | Solo = 0 ally slots, party size 1; soloOnly entries on (Wanderer's Vigor, Garb of the Ascended solo half, Herald's Cunning solo twin), partyOnly off, perTeammate stackers scale 1/5/10 (Leader's Vitality). Proc collectors (procDamage/procHeal) now honour conditionId / zones / role / solo-party gates they previously ignored. n00b 2026-09-08. | n/a |
| Combat scenario panel | Implemented | `toon-forge.html` `#combat-scenario-panel`, `scenarioSummary`, `scenarioTagsForItem`, `updateScenarioControls`, `wireScenarioPanel` | Always-visible panel above the steps (summary line + Edit): tabs You (health, AP, stamina, movement, time in combat) / Fight (zone, distance, enemies, enemy attacks, target shield) / Party (content type, party healer, mirrored with Party Buffs) / Conditions (whole registry). The old sim-row controls moved here; contextual hiding retired. Modeled on NWCharBuilderPlus's Combat Simulator (n00b 2026-09-08). | snapshot mode (time-since procs), damage-type mix, class tab |
| Optimizer scenario awareness | Implemented | `js/optimizer-local.js` showResult (scenario line + per-pick tags via `window.scenarioSummary` / `window.scenarioTagsForItem`) | Result header states the exact scenario every candidate was scored against; each changed gear card lists the scenario inputs its bonuses relied on (counted / off, with the value). Premium copy not redeployed. | n/a |
| Time in combat / ramp bonuses | Implemented | `state.timeInCombatSec` (default 120); entry field `ramp: {perMin}` with `amount` as cap; `_ebAmount` | Artifact Fanatic = +2%/min capped 20%. Berserker's Might still uses a fixed 50% (piecewise ramp not encoded). | encode Berserker's ramp table |
| Combat scenario round 2 | Implemented | `toon-forge.html` `_enemyHpSkip`, `_zoneSkip` (areas vs `vs X` enemy types), `standingAfterSec`, `state.flankUptime` slider, `state.enemyHealthPct`, `state.enemyTypes`, `state.standingSec`, In-combat toggle (= `_dstatsShowConditional`) | Fight: enemy health %, enemy types (checkboxes, several at once; removed from the zone picker), Combat Advantage uptime. You: standing-still seconds, In combat. Tags + proc collectors updated. Data: enemyHealthAbovePct (3), standingAfterSec (9). n00b 2026-09-08. | enemyHealthBelowPct texts (none in data yet) |
| Damage mix (read-only) | Implemented | `rotationMixOverTime(T)`, `renderDamageMix` (Powers tab) | At-will / encounter / daily share of magnitude over Time in combat from the slotted powers: encounters every effective cooldown (first at 0 s), dailies every AP bar, strongest at-will fills. Display only; the engine keeps its own rotation model. n00b: mix from powers is better than sliders. | n/a |
| Class mechanics tab (LOCAL-ONLY, coming soon on live) | Partial | `classMechanicsFor`, `renderClassMechanics`, `state.activeMechanics`; classes.json `mechanic[].effects[]` | Lists the class + paragon mechanics from classes.json as toggles (stack sliders for per-stack ones). 8 mechanics carry effects (Battlerage +25% dmg / -15% taken, Dig In +15% Awareness, Vengeance +20% dmg, Soul Spark +1%/stack x30, Soul Investiture 0-5 stacks = +20% +2%/stack Encounter Dmg Bonus but ONLY while the Risky Investment feat is slotted (`effects[].base` + `requiresFeat`, 2026-09-09), Arcane Mastery +0.5%/stack x5, Ranger stances). Soul Investiture's +10%/stack Soul Puppet magnitude is display-only (no puppet damage layer). The rest are listed with no stat effect. | `TF_CLASS_TAB_LIVE=false`: live site shows Coming soon and the engine ignores activeMechanics/forcedPowerBuffs; only mechanics with effects render as controls, the rest collapse to a 'not modeled yet' line. Flip the flag when n00b says go. Then: structure the remaining mechanics (Unstoppable absorb, Block, Divinity, Smolder, Chill...) from screenshots |
| Class tab: powers with buffs / debuffs | Partial | `renderClassMechanics` powers section, `state.forcedPowerBuffs`, `slottedBuffMultiplier` override; data `TF_POWER_BUFFS` (toon-forge-rotation-profiles.js) + power `addedEffect` texts | Lists every class + paragon power whose text reads as a buff/debuff; greyed when not slotted; slotted + modeled ones show the counted uptime ('counted at 33% uptime (20 s up every 60 s, your Daily cadence)') and a 'count as up the whole fight' switch (uptime 1). `slottedBuffLines()` is the single uptime calculation shared by the multiplier, this row and the Detailed Stats 'Slotted power buffs / debuffs' row (2026-09-09). Only 16 powers are modeled in TF_POWER_BUFFS; the rest show 'no stat effect on record'. | model more powers in TF_POWER_BUFFS; Barbarian list is missing Enduring Shout / Primal Instinct / Battle High / Takedown / Not so Fast / Rampage (screenshots needed) |
| Toon Forge 7-step flow (2026-09-08) | Implemented | `toon-forge.html` step bar, `.step-panel[data-panel=1..7]`, `gotoStep`, `renderStepDoneStates`, `renderBuffs` party split (`#party-buffs-list`), `#scenario-strip` | 1 Role & Class · 2 Character & Powers · 3 Gear (gear, artifacts, enchants, overloads) · 4 Companions & Mounts (companions, stable, bolster) · 5 Boons · 6 The Fight (Combat scenario tabs You/Fight/Party/Consumables/Powers/Class/Conditions; Party Buffs live in Party, Optional buffs in Consumables) · 7 Results (hit sim, upgrade advisor, build summary; the premium Optimize/Verdict buttons STAY in the header - n00b 2026-09-08 - no Optimize section in Results). A one-line Fight strip under the step bar shows the scenario on every step and jumps to step 6. | n/a |
| Powers gate for damage / healing scoring | Implemented | `toon-forge.html` `hasRotationSlotted` / `window.tfHasRotation`; `js/optimizer-local.js` `rotationMissingFor` (runPass card + runOptimize throw) | At least one at-will AND one encounter must be slotted before the Results damage view, the upgrade advisor and the dps/heal optimizer score anything; tank survival is exempt. Fight strip shows 'NO POWERS SLOTTED'. n00b 2026-09-09 ("users have to fill in the powers before the optimizer can run"). | n/a |
| Optimizer rotation factor = real formula | Implemented (local, not deployed) | `js/optimizer-local.js` `powerFactor`: `mps / MPS_REF(500)` instead of `1 + mps/1500` | Score is now damage per hit x casts per second (proportional). The old nudge credited a +5% casting gain as +1.3% and undervalued Recharge Speed / AP Gain everywhere. Absolute scores ~25% lower; only differences matter. Validation fixtures (scripts/_optimize_validate.js) NOT yet re-run. | re-run the 3 role fixtures (step 4) |
| Optimizer mount packages: insignia-preserving refit + snapshot restore | Implemented (local, not deployed) | `js/optimizer-local.js` `applyMountPackage` (keeps insignias whose category already fits the new package's slot), package slot `getV/setV` (snapshot of the stable row; candidates applied FROM the snapshot; original key restores it exactly), `dpsBonusIds` (a non-DPS current bonus reads as 'no bonus') | Before: every package trial threw away all four insignias, so a mount with good insignias and a worthless bonus (Enchanter's Hex) could never be improved, and tryBest's restore kept the last candidate's leftovers. After: mount 3 on the Bard build moves Hex -> Defender's Retort keeping Barbed Dominance / Enlightened Brutality (+0.8%). n00b 2026-09-09. | insignia-only slots ignore 'mount:stable:i' locks (diffs on locked mounts) - fix |
| Insignia bonuses on the gear equip-bonus machinery | Implemented | `toon-forge.html` `_insigniaEqQueue` (ingested after the overload loop through every gate), `activeInsigniaBonuses` (proc collectors), `apAbovePct` gate; data `mount_insignia_bonuses.json` `equipBonuses[]` | Insignia bonuses can carry the same entries gear does (gates, procs, conditions, ramps) times the per-instance multiplier. 10 structured bonuses converted (Master's Cruelty + Gladiator's Guile on the stamina slider, Berserker's Rage both halves on the AP slider, Cautious Devotion on health, Trainer's Restoration on full AP). instanceStats bonuses (Ice Cold x2, Guardian's Spirit) keep the old path. All 43 reviewed one at a time 2026-09-09: 31 structured (gates, heal/damage procs, cooldown cuts on the cadence sliders, windows), 4 per-instance tables, 2 on the Cavalry all-ratings text rule, 6 display-only (Warlord's x2 need a companion damage layer; Enchanter's Hex + Combatant's Maneuver need control-tagged powers; Traveler's / Wanderer's have no combat value). Log in docs/audit/equip_bonus_review_2026-09-08.md. | companion damage layer; control tags on powers |
| Cadence sliders: Daily / Artifact / Mount power | Implemented | `toon-forge.html` `tfCadence(kind)`; state `dailyCadenceSec`, `artifactCadenceSec`, `mountPowerCadenceSec` (60 s each); Powers tab sliders; proc trigger keys `daily`, `artifact`, `mountpower` | n00b 2026-09-09: all three go off about every 60 s (their cooldown). Replaces the hardcoded 1/60 daily rate, the 80 s mount-power window and the AP-only daily interval (now the slower of the AP bar and the cadence, in the rotation, buff uptimes and the Powers mix). Resolves the open Daily-cadence question. | n/a |
