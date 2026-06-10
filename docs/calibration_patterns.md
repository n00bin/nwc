# Toon Forge Calibration Patterns

Living library of "symptom → cause → fix" patterns discovered while calibrating
the Toon Forge prototype against in-game stat panels.

**Purpose**: speed up future calibration sessions. When a stat reads off vs
in-game, scan this doc first — most gaps map to a known pattern. Only chase
unknown gaps after these patterns are ruled out.

**Tolerance reminder** (also stored in Claude memory):
- Rating-based stats (Power, Crit Strike, Crit Sev, CA, Accuracy, Defense,
  Deflect, Deflect Sev, Awareness, Crit Avoid, Forte, Control Bonus, Control
  Resist): **±1.5%**
- Non-rating stats (Outgoing Healing %, AP Gain %, Recharge %, Movement %,
  Stamina Regen %): **±1%**
- Flat stats (Max HP, Class Resource Max): **±5%**

Inside the band = calibrated. Don't chase.

---

## Pattern: TIL gap that exactly equals one breakdown line — suspect a STALE BUILD ENTRY before touching constants

**Symptom**: Total Item Level off by a suspiciously clean amount (e.g. exactly
1,800) that happens to match a whole breakdown line or a sum of slot upgrades.
**Cause**: The tool build lags the in-game character on one or more slots
(player upgraded in-game, never updated the build — or vice versa). If you
"fix" it by anchoring a model constant to close the residual, the constant
absorbs the stale-entry error and detonates later when the player corrects
the entry. This is exactly how the phantom Mount Bolster TIL line (1,440
Celestial base) was born on 2026-06-07 and exposed on 2026-06-10: the anchor
build's Feet (4,300 vs in-game 5,700) and companion ring (2,600 vs 3,000)
were stale — 1,800 on the nose.
**Fix / protocol**: Before anchoring ANY constant against a player build:
(1) replicate `computeTILBreakdown()` line-by-line against the decoded share
link; (2) diff every slot against fresh in-game screenshots or an owner
walkthrough; (3) if a residual matches a clean sum of plausible slot upgrades,
assume stale entry first; (4) prefer anchors confirmed on TWO independent
characters — the May-12 Paladin/Ranger pair correctly showed mount-collection
bolster grants 0 TIL, and a single contaminated anchor overrode them.
**Verified**: 2026-06-10 via Del Warlock old+new share links — both anchor-day
numbers (147,736 tool / 147,735 in-game) reproduce exactly under the
stale-entry model; post-fix the build reads 148,036 vs in-game 148,037.

---

## Pattern: Rotsteel Ring of Spores — Critical Severity (not Critical Strike)

**Symptom**: Crit Strike rating ~8,000 over OR Crit Severity ~8,000 short, with
Rotsteel Ring of Spores in build.
**Cause**: NW item gives Critical Severity direct, not Critical Strike. Our
data had it swapped.
**Fix**: `data/gear.json` Rotsteel Ring of Spores — `ratingStats.Critical
Strike` → `Critical Severity` (8,370 unchanged; Combat Advantage 5,580 stays).
**Verified**: 2026-05-13 by n00b on Ranger Warden build.

---

## Pattern: The Bloodlit Veil — no direct Combat Advantage; +5% CA from Maiden's Advantage

**Symptom**: CA bonus ~5% short. Bloodlit Veil in build.
**Cause**: Bloodlit Veil's "Maiden's Advantage" equipBonus gives 5% CA
always-on, but our data had it as narrative description only — engine doesn't
apply.
**Fix**: `data/gear.json` Bloodlit Veil — structure Maiden's Advantage as two
equipBonuses: (1) `Combat Advantage 5%, alwaysActive: true`, (2) `Power 2.5%,
alwaysActive: false, condition: "in combat with 2+ enemies"`.
**Counter-pattern**: do NOT add Combat Advantage to Bloodlit Veil's
`ratingStats` — the item has only Accuracy + Critical Severity as direct stats
in-game.
**Verified**: 2026-05-13 by n00b on Ranger Warden build.

---

## Pattern: Thayan Talisman of the Companion — direct Crit Strike = 2,340

**Symptom**: Crit Strike rating ~1,800 short, 3 Thayan Talismans on companion.
**Cause**: Stored direct Critical Strike was 1,740. In-game value is 2,340.
**Fix**: `data/companion_gear.json` Thayan Talisman — `ratingStats.Critical
Strike: 1740` → `2340`. CA stays at 1,950 (verified in-game by n00b).
**Verified**: 2026-05-13 by n00b on Ranger Warden build.

---

## Pattern: Ranger class skills

**Symptom**: Specific stats short by exact percentages.
- Crit Strike bonus 2.5% short → Weapon Mastery missing
- Crit Severity bonus 10% short → Skirmisher Gambit missing
- Deflect bonus 2.5% short → Lucky Skirmisher missing
**Cause**: Ranger class skills not modeled in `data/classes.json` before
2026-05-13.
**Fix**: Class skills now in `classes.json` Ranger.classFeatures array.
**Likely 4th skill exists** but not yet identified — check in-game Skills tab
when calibrating future Ranger builds.
**Verified**: 2026-05-13 by n00b on Ranger Warden build.

---

## Pattern: Impending Doom 2pc (Grimfang + Harrowed Messengers IL 4800)

**Symptom**: Crit Strike bonus 7.5% short AND Accuracy bonus 3.7% short.
Both Impending Doom weapons equipped at Mythic IL 4800.
**Cause**: 2pc always-on stat bonus undocumented in data.
**Fix**: `data/gear.json` — Grimfang IL 4800 carries `Critical Strike 7.5%`
Set entry; Harrowed Messengers IL 4800 carries `Accuracy 3.7%` Set entry. Both
needed; engine counts pieces by `type: "Set"` entries.
**Note**: 2pc Unleashed proc mechanic still undocumented — see
`docs/data_issues.md`.
**Class-specific**: values verified for Ranger Mythic; other classes likely
differ.
**Verified**: 2026-05-12 by n00b on Ranger Warden build.

---

## Pattern: Executioner's Covenant — stacks per-mount with diminishing returns

**Symptom**: Defense, Awareness, Crit Avoidance, Deflect rating slightly off
when multiple mounts trigger EC; gains on Accuracy, CA, Crit Strike, Crit Sev
similarly off.
**Cause**: 4-shape combo CREI (Crescent + Regal + Enlightened + Illuminated)
on a 4-slot mount triggers Executioner's Covenant, which gives +1,500 to four
gain stats and -1,500 to four penalty stats.
**Stacking**: confirmed 2026-05-13 by Mount 3 insignia removal test —
penalty side drops by 375 when one of three stacking mounts loses EC, matching
the diminishing 1.0/0.5/0.25 stacking model on BOTH gain and penalty.
**Model**: `id 12` in `mount_insignia_bonuses.json`; engine handles diminishing
stacks across mounts triggering the same bonus.
**Verified**: 2026-05-13 by n00b — Mount 3 Crescent removal dropped Defense by
225 (= -600 CR loss + 375 penalty restored), matching prediction exactly.

---

## Pattern: Mount Combat Power IL/rating asymmetry (Combat Power compensation)

**Symptom**: Every rating-based stat reads systematically ~1-2% low vs
in-game.
**Cause**: Combat Powers (e.g. Bigby's Crushing Hand) contribute IL to TIL but
**no rating**. The rating-to-% formula `50 + (rating − TIL)/1000` mathematically
drops every rating-based stat by ~3.6% when ~3,675 IL is added without
rating. In-game silently compensates ("phantom 100% CR" per Obikin89); our
prototype tells the math truth.
**Fix**: NONE — accept the asymmetry. Our model is correct; the game fudges.
Calibration tolerance for rating-based stats is widened to ±1.5% to absorb
this gap.
**Implications**: when a rating-based stat is 1-1.5% off, it's the Combat
Power phantom drag, NOT a data error. Only chase gaps > 1.5%.
**Documented**: in Claude memory + this file. Mount Combat Power data has
notes (`mount_combat_powers.json` for Bigby).
**Verified**: 2026-05-13 by n00b research (Obikin89 community guidance).

---

## Pattern: Berserking Might (Greater) on Bindings of the Death Pact → Damage Bonus

**Symptom**: Power bonus 0.9% short when in combat (with 1+ enemy nearby), but
no obvious source.
**Cause**: Berserking Might gives **+0.9% Damage Bonus** per enemy nearby
(stacking up to 10). In NW, "Damage Bonus" is a separate stat from Power —
multiplies damage formula but doesn't appear on Power stat panel.
**Fix**: `data/gear.json` Bindings of the Death Pact — structured equipBonus
with `stat: "Damage Bonus", amount: 0.9, perStack: true, maxStacks: 10,
alwaysActive: false`. Engine recognizes Damage Bonus is silenced for stat panel
(see `TOON_FORGE_BONUS_STATS` in `toon-forge-stats.js`).
**Counter-pattern**: do NOT model Berserking Might as Power %. The stat name
matters: "Damage" / "Dmg Bonus" / "Damage Bonus" all route to the damage
formula multiplier, not the Power stat.
**Verified**: 2026-05-12 by n00b on Ranger Warden build.

---

## Pattern: Eternal Dominion Armor 2pc — UNDOCUMENTED

**Symptom**: Forte rating ~1,746 short (after all other fixes) on builds with
Bindings (Arms) + Treads (Feet).
**Cause**: SUSPECTED — Eternal Dominion 2pc set bonus gives Forte rating or
similar, undocumented in our data.
**Status**: Open. Both pieces have `set: "Eternal Dominion Armor"` and
`setSize: 2` metadata but no structured 2pc bonus. Need n00b to hover both
pieces in-game and report the 2pc tooltip text.
**Cascading effect**: Forte shortfall cascades into Power/Acc/Deflect via
Warden's 50%/25%/25% Forte distribution → all three are 0.5-1% short until
Eternal Dominion is backfilled.

---

## Pattern: Companion gear direct stats DO apply to player

**Symptom**: After "engine fix" that skipped comp gear direct stats, CA short
~5,850 and CritStrike short ~5,220 (3 Thayan Talisman direct values × CA 1,950
and CS 2,340).
**Cause**: Comp gear direct ratingStats apply to the PLAYER (not the
companion). The engine briefly skipped them based on a misinterpretation of
"Talisman gives 2,340 Crit Strike" — that was a data correction (1,740 →
2,340), not a behavioral change.
**Fix**: `compGearToBuff()` in `toon-forge.html` applies both `ratingStats`
AND `combinedRating` to the player. Don't revert this.
**Verified**: 2026-05-13 by n00b — after revert, prototype showed Talisman
direct stats correctly in the breakdown.

---

## Pattern: Mystic Conduit Mark — Precise Severity stats are correct (don't swap)

**Symptom**: Tempting to swap Critical Strike → Critical Severity based on
"Precise Severity" variant name (matching Rotsteel pattern).
**Cause**: "Precise Severity" is the equipBonus proc name, NOT the direct
stat type. The base item's direct stats are Critical Strike + Defense +
Outgoing Healing.
**Fix**: NONE — data is correct.
**Verified**: 2026-05-13 by n00b — hover tooltip shows "2592 CS, 1134 Def, 1296
OH, 1.5% Recharge, 3240 CR".
**Counter-pattern**: don't assume variant name dictates stat type. Verify in
in-game tooltip before swapping.

---

## Pattern: Campfire buff (+1 all abilities) requires engine aggregation

**Symptom**: Even with Campfire buff checked in prototype, stats don't reflect
+1 ability boost — AP Gain stays at CON-based value, Crit Severity stays at
DEX-based value, etc.
**Cause**: `getAutoAbilityBonus()` summed gear and artifact `abilityBonuses`
but NOT buff `abilityBonuses`.
**Fix**: 2026-05-13 added buff iteration to `getAutoAbilityBonus()` —
aggregates `findBuffByName(state.buffs).abilityBonuses` for each active buff.
**Verified**: 2026-05-13 by n00b — Campfire enabled but not propagating before
the fix.

---

## Evidence library

Committed screenshots in `docs/calibration/evidence/` referenced by patterns above:

- **`2026-05-11_paladin-healer_erik_stat-panel-main-stats.png`** — Erik (Paladin Oathkeeper Healer) main stats panel: TIL 126,775, all 13 rating stats (Power 133,648 / Acc 96,543 / CA 112,727 / CritStrike 127,015 / CritSev 136,420 / Defense 102,772 / Awareness 109,368 / CritAvoid 92,620 / Deflect 93,745 / Deflect Sev 94,870 / Forte 121,182 / Control Bonus 94,870 / Control Resist 98,965). The authoritative Paladin Healer calibration source-of-truth.
- **`2026-05-11_paladin-healer_erik_stat-panel-boosts.png`** — Erik bottom column with Incoming Healing 98,370 (24.1%), Outgoing Healing 130,591 (105.3%), and Boosts column (AP Gain +10.5%, Recharge +9.2%, Movement +61.2%, Stamina +3%, Damage Boost +0%, Magical Damage +3.5%, Physical Damage +2.5%, Overall Outgoing Healing +111.3%).
- **`2026-05-11_paladin-healer_erik_stat-panel-deflect-forte-boosts.png`** — Same right column but with OOH tooltip overlaid (explains the OH vs OOH distinction in our memory entry).
- **`2026-05-11_paladin-healer_erik_stat-panel-til-126775.png`** — TIL 126,775 visible alongside ability scores. Snapshot at a different state than main-stats (CritStrike at 73% vs 78%).
- **`2026-05-11_paladin-healer_erik_stat-panel-til-tooltip.png`** — TIL tooltip popup: "Your Total Item Level is calculated from your equipped items, mounts, and companions. Your Total Item Level determines your base Maximum Hit Points, Damage, and your maximum Main Stat values."
- **`2026-05-11_paladin-healer_brain-stealer-dragon_insignia-bonuses-preferred-slot.png`** — Brain Stealer Dragon mount + insignia setup screen. Shows Regal Insignia of Dominance tooltip with **"Item Level (Preferred Slot): 900"** — direct proof of the +20% preferred slot IL rule (base 750 × 1.20 = 900). Also lists Cautious Devotion as active insignia bonus with stacking text.
- **`2026-05-11_paladin-healer_erik_damage-tooltip-base-damage-formula.png`** — Erik stat panel with Damage stat tooltip overlay: "Base Damage is your Total Item Level / 10. DPS role gains a 20% extra base Damage. Healer role gains a 10% extra base Damage." Foundational evidence for the role-multiplier in our damage simulator.
- **`2026-05-11_grimfang-impending-doom-unleashed-mechanic-tooltip.png`** — Grimfang weapon tooltip showing the Impending Doom 2pc Unleashed mechanic in detail: 13 charges → Unleashed buff; charged by Daily power (10s CD) / Encounter power (1.5s CD) / 3s in combat; +4.5% Base Damage Boost when Unleashed; 15s duration, refreshable. This is the structured evidence for the "Unleashed mechanic UNDOCUMENTED" entry in `data_issues.md` — values shown here are for IL 3,750 variant; higher IL likely scales.
- **`nwhub_damage-formula-reference.png`** — NW Hub Damage Formula reference page. Canonical NW damage math showing Magnitude × Power × CritChance × CritSev × CA × Awareness × DamageResistance × Accuracy × Deflect × Defense × outgoing/incoming modifiers. Foundational reference for the damage simulator implementation.
- **`nwhub_character-editor-vs-toon-forge-comparison.png`** — NW Hub Character Editor next to Toon Forge prototype tab — proves we've been cross-validating against NW Hub during calibration. Useful for "did we match NW Hub" comparisons.
- **`2026-05-09_warlock-hellbringer_powers-tab-class-feature-feat-slots.png`** — In-game Powers tab for a Warlock Hellbringer. Shows the structure: At-Will / Encounter / Daily / Mechanic / **Class Feature** / Feat slots, plus the "Parting Blasphemy" feat tooltip. Evidence that NW has slotted Class Features distinct from class skills (which are passive). Reference for future class-feature modeling (we currently model class skills only in `classes.json` classFeatures array — confusingly named).

Local-only triage folder: `docs/calibration/inbox/` (gitignored). 1,646 screenshots restored from recycle bin 2026-05-13. Most are gear database data-gathering (collection browser, NW Hub web reference, item tooltips for stat extraction, Unity dev for unrelated project). Browse manually to promote any additional evidence shots to `evidence/` with the naming convention. No Ranger Warden screenshots present — that calibration session was verbal.

## Workflow checklist for new calibration sessions

When starting a new calibration audit:

1. Verify the prototype state matches in-game (rarities, kits, enchant slots).
2. Capture full stat panel screenshot → save to `docs/calibration/`.
3. For each stat outside ±1.5% / ±1% / ±5% tolerance:
   a. Scan this pattern library for a match.
   b. If matched, apply the known fix.
   c. If not matched, capture supporting tooltips and dig.
4. When a new pattern is discovered, add it here with date and evidence link.
5. After session, snapshot full stat panel again — verify all changes landed.
