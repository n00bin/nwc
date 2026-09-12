# Full Item Audit — 2026-08-10

**Scope:** every item in every system — gear (6,722 entries), artifacts (140), enchants (47 + rarity ladders), companions (268) + powers (265) + enhancements (30), companion gear (221), mounts (339) + combat powers (96) + equip powers (56), insignias (49) + bonuses (43) + collars (75), overloads (44), kits (44), buffs (123), boons/races/classes/feats — checked on four dimensions: **readability → formula sanity → optimizer/picker visibility → screenshot evidence**, plus a dedicated set-bonus sweep and a vision pass that re-read actual screenshots for every flagged item.

**Method:** 30-agent fleet. 3 contract extractors (optimizer gates from `js/optimizer-local.js`, engine/picker/stat-catalog from `toon-forge.html` + `toon-forge-stats.js` + `toon-forge-engine.js`, build pipeline from `build-data.py`) → 13 category auditors + 1 archive mapper → 13 vision agents (26 flagged items adversarially re-verified against screenshots, plus ~90 unflagged samples). Evidence index: all 16,734 archived screenshots matched by filename against every item name. **Read-only run — no data or code was changed.**

**Companion doc:** `missing_screenshot_evidence_2026-08-10.md` — the full per-category list of items with no screenshot evidence (2,610 unique names across all systems, incl. 1,265 gear names; collars and kits are at 0% coverage).

---

## Verdict at a glance

| Dimension | Result |
|---|---|
| File readability | **All 33 source JSON files parse clean.** No unreadable files. Refs (companion powerRef/enhancementRef, mount combatRef/equipRef/bonusRef) resolve 100% — zero orphans. |
| Build pipeline | **Fully in sync.** Every converted `data/*.js` matches its source JSON (counts + spot checks). 12 unconverted JSON files are all engine-side by design. |
| Optimizer visibility | **~30 items provably invisible or inert that shouldn't be** (details below), plus 2 code bugs that zero out whole power classes. |
| Formulas | Ladders and scaling tables check out almost everywhere; ~20 concrete value bugs found, most screenshot-confirmed. |
| Set bonuses | **Weakest area.** 18 critical findings: missing set partners, mistagged sets, and a systemic zero-stub pattern across 34 set families (278 items). |
| Vision re-check | 26 flagged items re-read from screenshots: **flags confirmed in every decisive case** (0 false alarms among criticals). ~90-item random sample: values match tooltips almost everywhere — the underlying stat data is solid. |

---

## A. Screenshot-CONFIRMED data bugs (fix-ready — tooltip proof in hand)

Slot mislabels — these items sit in the WRONG optimizer pool (Off-Hand items competing as Main Hand, breaking their 2pc sets):
1. **6 Ranger "…Knives"** tagged `Main Hand`, are Off Hand: ids 2781 (Stormforged Knives), 2783 (Blaspheme Knives), 2811 (Antique Knives of the Vale), + 3 more in the auditor detail. Each pairs with a same-set Bow already in Main Hand.
2. **4 Bard "…Lute"** tagged `Main Hand`, are Off Hand: ids 4885 (Duergar Mercenary's Steel Lute), 4889 (Stormforged Lute — tooltip literally reads "Physical, Weapon, Off-Hand"), 4892 (Antique Lute of the Vale), +1. 89 other lutes are correctly Off Hand.
3. **Celestial Steel of Grace** (Ranger, ids 5313/5314/5315/5316) — all 4 tiers tagged Main Hand; it's the Ranger Off Hand of the Celestial set (every other class has a clean MH+OH pair).
4. **Twined Brands of the Blessed Blade** (Ranger, ids 5457/5458) — tagged Main Hand, screenshots filed under off-hand; also missing at 2 of its 4 in-game tiers (650/1400).

Duplicates / wrong IL:
5. **Wootz Kilij** id 5477 (Main Hand, Ranger) is a stray duplicate of id 2873 (Off Hand, correct) — contaminates the Ranger MH pool.
6. **Celestial Bow of Dignity** id 5310 (IL1350) is a clone of id 5337 (IL1150) with a mis-keyed IL — screenshots prove the real ladder is 650/900/1150/1400 only.
7. **Hammerstone Pact Blade / Grimoire** duplicated at IL152 (ids 4822/4823) AND IL352 (ids 3595/3596) — tooltips read **Item Level: 352**; the 152 pair is wrong.
8. **Manticore Duelist Longcoat** id 4842 — tooltip reads IL **630** (data: 810) and Awareness **142** (data: 342). Two errors in one entry; the wrong IL also collides with its real IL-756 sibling (id 3777).
9. **Dragon Bone Whirl / Swirl** (ids 4428/4429) — `combinedRating` is a copy-paste of one of their own stat values; the tooltips show **no CR line at all**. 7 more Dragon Bone family items have stats but no CR field (ids 2360, 2361, 3018, 3019, 5582, 5583, 7265) — likely the same legacy no-CR family.
10. **Veinlit Earthhard Guard** id 5326 — slot is the literal string `"Clothing: Jotunskar"` (invisible to every pool and picker) AND the name is a typo for **Veinlit Earthshard Guard** (sibling id 5442 is correct).
11. **Chain of Scales (Empowered)** — Stamina Regen stored as **6%**; tooltip clearly shows the tier ladder 0.02→0.05%, so 6 is a dropped decimal (real value 0.06%).
12. **Grand Alliance Pactblade** id 172 — setName says "Brute's Expertise" (a different set); its own description and all 15 sibling Grand Alliance weapons prove the right set tag.
13. **Enchant "Celestial Obsidian"** — Celestial-tier point total 11,232 vs the uniform 9,720 of all 8 peer triple-stat gems; Uncommon-tier screenshot supports the 9,720-family scaling. One or more stat values are inflated.
14. **Enchant "Celestial Swift Synergy"** — `rarities.Celestial` says 11%, while top-level stats, equipBonuses, and the 2026-05-11 verified stacking note all agree on 10.8%. The 11 is the stray.
15. **Elemental Dragonflight Raid Sallet** — tooltip shows "Set Dragonflight (0/4)", data has `setSize: 2`.
16. **Lichstone Amulet (Legendary)** id 3755 — tooltip: Accuracy 400 / Crit **Avoidance 401** / Deflection 400; data has the 401 on the wrong stat (stored as Deflect 401 / Crit Avoidance 400).

## B. Items INVISIBLE to the optimizer (should be visible)

Malformed slot values (fail `gearOptionsForSlot`'s exact-string match → unreachable by optimizer AND manual picker):
- **9 Bard lutes** with slot `"Physical, Weapon"` (Woote Lute ×4, Shadesinger's Lute ×4) or `"Physical"` (Hammerstone Lute) instead of `Off Hand`.
- **Veinlit Earthhard Guard** (`"Clothing: Jotunskar"`, see A-10).
- **9 "Artifact Equipment" items** (Khaltan family + Exalted Pioneer Lett) whose names match none of `artifactHand()`'s keyword regexes — they fall through ambiguously; stat mix suggests some may actually be Neck/Waist items.

Stat-empty entries (dropped whole by the `notStub()` gate):
- Artifacts **Memories (Redeemed)**, **Champion's Battle Horn**, **Crown of the Undead** — real powers, but every stat field empty ⇒ never candidates.
- **Weapons of the Bear Tribe** (ids 2091/2092, IL4, empty stats) — plausibly a real cosmetic vendor item; verify or annotate.

Stats stored under names the engine doesn't know (silently score 0):
- **Burning Heart** (16 weapons): 2pc stat `"Action Points"`; **Drowned Heart** (16 weapons): 2pc stat `"Heal Self"` — both set bonuses are completely inert.
- **10 rings** with percentStats `"Damage against Beasts"/"Damage against Undead"` — dropped.
- **30 items** with dead zone-damage percentStats keys ("Damage against Demons…", etc.).
- **Anniversary Ham**: `"Max Block Stamina"` — dropped, and the unknown-stat warning for it is filtered from view.
- **7 companion powers** with narrow `"Damage Vs <family/positional>"` stats and **4 heal-proc stats** ("Heal Percent", "Heal And Damage", "Stamina") — all silently dropped.
- **8 Slayer overloads** (Drow/Giant/Undead/Fiend/etc.) store their whole effect in `enemyType`/`damagePct`, which the stat engine **never ingests** ⇒ zero contribution despite being the only reason to slot them.
- **4 dragon-damage buffs** (Scroll of Dragon Slaying R5, 3 Wondrous dragon items) — same `damagePct` gap: description renders, effect never counted.

Pool/config gaps:
- **Companion's Mark of the Orc Slayer** (slotType `CompanionOverload`, "no effect when equipped by a player") is not filtered out of the player Overload pool — the optimizer can equip a do-nothing item.
- **Tenser's Floating Disk (epic)** — insignia slot 1 allows `"Enlighteded"` (typo): no insignia can ever legally fill that slot in data-driven filtering.
- **Oil of Sharpness** (exclusiveGroup "Ancient/Misc" is in renderBuffs' SKIP_GROUPS — only buff with no rendering path) and **Potion of Coalesced** (group "None", 20s duration, fails the always-on filter) — real buffs unreachable in Toon Forge UI.
- Stamina-Regeneration Jewel kits (4) are unreachable under every role objective — arguably by design (no role scores Stamina Regen), worth an explicit note.

## C. Code bugs found while verifying (not data)

1. **Ranger 10/10 encounters + Warlock Blades of Vanquished Armies & Dreadtheft score 0 in DPS rotation math** — they store cooldown only as `cooldownByParagon`, but `rotationMagPerSec()`/`slottedBuffMultiplier()` (toon-forge.html:11451/11498) read only flat `cooldownSeconds`. **Vampiric Embrace** is worse: it has both fields, so Soulweaver builds price it at 8.5s instead of 0.5s — a ~17× undervaluation of its rotation weight.
2. **`_equipBonusSection` (toon-forge.html:6224) drops nameless equipBonuses** on the enchant/overload/companion-gear picker cards (22/30 enchant + 26/33 overload bonus rows hidden from display; they still SCORE). Gear/artifact card paths were already patched with a fallback label — this third path wasn't. Related data-side: **1,038 value-bearing gear equipBonuses lack `name`** and are hidden on the gear-card path too.
3. **Mount combat-power `roleMap` structures are dead** — zero readers anywhere; those self-buffs never count. Enemy-scope mount debuffs only count if stat is exactly `Enemy Dmg Taken`/`Dmg Debuff` — 15 entries across 10 powers use other stat names and are ignored.
4. **`js/artifacts-page.js` renders/searches only `a.set`**, so Crimson Calamity and Sealing Parchment (correct `setName` in equipBonuses, `set:"None"`) show no set row and aren't findable by set name.
5. Orphaned config files (loaded by nothing): `companion_power_proc_profiles.json`, `mount_insignia_proc_profiles.json`, `gear_bonuses.json` + `gear_bonus_proc_profiles.json`, `feats.json` (rich Soulweaver feat modeling never wired), Warlock top-level `skills` array. Either wire them or mark deprecated.
6. **general_feats "Vengeful Blades"** has no paragon scope — renders for Hellbringer though it's Soulweaver-only.

## D. Set bonuses (dedicated sweep of all 7,828 bonus rows)

**Sets that can NEVER complete (missing partner in data):**
- Warlock Pact Blade 2pc sets with no Grimoire anywhere: **Alabaster, Burnished, Watcher, Lionheart, Mountaineer** (ids 141/147/171/177/182).
- **Masterwork III Weapon Set** — Warlock Mastered tier MH exists (ids 178/179), matching Off Hand doesn't. **Masterwork VII** — Warlock OH missing entirely; Paladin MH (IL1400 only) and OH (IL1500 only) never share a tier, which the optimizer's same-IL pair rule can never satisfy.
- **Executioner's Bloodthirst (Greater)** — both members (Dark Arcanum id 5569, Nether Convergence id 6031) are Off Hand per screenshots; the set as stored can't be worn. (Screenshots confirm they ARE the 2 set members — so one is probably actually a Main Hand, or the set is cross-slot mislabeled.)
- **Golden Dragon** — Fighter can hold both MH weapons but the only OH (Shield of the Golden Dragon, id 2353) is Paladin-locked. **Chultan** — Bard shares Wootz Jambiya MH but the Wootz Sakin OH is Rogue-locked.
- **Infused Defense** — Ember Plated Shirt (id 273) is the sole member; Ember Plated Pants (id 646) exists but carries an unrelated bonus.
- 3pc Neck+Belt sets with **no artifact 3rd piece carrying the set tag**: Lostmauth's Hoard (artifact id 33 EXISTS, screenshot names it as the 3rd piece, but has no Set entry), Apocalypse (artifact id 36 exists, equipBonuses empty), Tiamat's Prized Possessions (id 73), Rune of the Underdark, Astral Absorption, Astral Dash, Rune of Replenishment, Soulmonger (candidate at wrong IL), and the 4 Alacrity sets (Insightful/Aggressive/Vanguard's/Celestial — artifact ids 77/79 etc. self-identify in text but carry no Set entry). **8 artifacts total name their set in the display field but have no scoring entry.**

**Systemic:** the `{stat:"Damage Bonus", amount:0}` unnamed stub pattern spans **278 items across 34 set families** — the set membership counts, but the actual bonus text/values were never structured. Screenshot-verified worst offenders: **Dusk** (68 armor items; real bonus is 1pc regen / 2pc +5,000 HP +1% Power +1% Defense / 3pc move speed), **Drowcraft** (~48), **Dragonflight** (~144 incl. variants; real 2pc +5,000 HP / 3pc +3,000 Power). The vision pass also found **Dusk head/armor pieces (e.g. "Dusk Raid Sallet") exist in-game but not in gear.json at all**.
**Mistags:** Grand Alliance Pactblade (A-12); Tempest Gaze Seal id 409 (`set` field disagrees with own setName; 5 siblings consistent); Shard of Orcus' Wand artifact claims a set that gear already completes as a weapon+neck+belt trio (naming collision with the gear weapon of the same name); Wootz Jambiya id 4296 Chultan Power 500 vs 2000 on every sibling; zone strings `"Fire-themed maps"` (8 items) and `"The Reched Edge"` (typo) pollute the zone dropdown.

## E. Formula verification (what checked out, what didn't)

- **Companion powers:** all on-scale vs SINGLE/DOUBLE/MAX_HP tables except: Xaryxian Precision (4.5/3.0 at IL750 — off both rungs, self-noted), Vallenhas' Discipline (1.3 vs 1.88 expected), Sehanine's Wisdom (Deflect 1.8 off-scale while Awareness is exact). Verified outliers (Energon/Raptor/Bobby) respected, no false flags.
- **Enchants:** all 47 ladders complete and monotonic. Issues: Obsidian + Swift Synergy (section A), Celestial-combat family Mythic ILs disagree (5833 vs 5000 across the 6-member IL7000 family — one convention is wrong), Sugilite's uneven 9-stat split (totals correct — probably genuine, noted only).
- **Artifacts:** CR/IL ratio clusters at 0.85 (94) and 0.80 (34) plus small 1.0/0.75 clusters — likely era conventions, not errors; flagged for one-time confirmation. Globe of the Third Eye (IL310, "effect unknown") and Assassin's Knife (source "?") are explicit unverified placeholders. Only Arma-Egg-On has multi-rank rows; other 137 are single-row (probably fine — flagged as note).
- **Collars:** all 15 families ladder cleanly I–V… except **Unified Barbed/Regal Collar use 0.9×IL CR while Unified Crescent uses 1.0×** and NW Hub says all three should be 1.0 — verify.
- **Insignias:** all 49 clean vs tierScaling. **Cautious Devotion (bonus id 15)** outer stats ≠ its verified instanceStats (5× mismatch) unlike every sibling.
- **Kits:** ladder consistent; ids 1/2 missing the "Major" prefix in their names; all 44 kits have zero screenshot evidence (self-noted "needs verification").
- **Overloads:** 11 notes say "IL set to 450" while `item_level` is 0 — field/note contradiction across the file.
- **Companion gear:** verified tiers (ids 1–36) fully consistent; ids 37–221 are NW Hub scrapes with 42 items missing stats their verified siblings' pattern requires (1 stat where 2–3 expected). "Noble Peridot of the Companion" (id 108) breaks its cohort's naming/slot pattern.
- **Mounts:** 16 mounts with combatRef=0 / 17 with equipRef=0 placeholders (named list in auditor output); mojibake `â€”` baked into 20 notes fields (renders on live site); companion power id 66 note has same mojibake.
- **Buffs:** Chain of Scales (section A); Elixir of Corelion's Blood breaks its 4-elixir sibling pattern; Mochi/Niangao store ratings where 19 of 21 event foods store percents; Lliira's Fare/Neverwintan Red Veins self-noted legacy-stat risk.
- **Boons/races/classes:** structures sound. Paragon-duplication status is actually **Cleric/Fighter/Rogue DONE, only Wizard open** (memory note was stale). Bard's IL-anchor and class power data consistent with the 2026-07-14 sweep.

## F. Vision verification results

116 item-verdicts from 13 vision agents: **67 match, 28 mismatch, 19 no-usable-screenshot, 2 unreadable.** Every "mismatch" on a critical flag confirmed the flag (sections A/D above) — none overturned the auditors. The random sample (~90 unflagged items across gear/artifacts/enchants/companions/mounts/sets/buffs) found only 2 new issues (Dragonflight setSize, Lichstone stat-swap), i.e. **the base stat data is highly accurate** — the problems concentrate in slot labels, set wiring, and unstructured bonus text, not in the numbers.

## G. Deliberately NOT flagged (verified conventions honored)

Energon / Raptor's Instincts / Bobby's Vigor off-scale powers; gemstone 1/2/3-stat design; Vistani dual-set name; mount powers stored at 125% bolster; mixed-tier combat powers (Celestial toggle pending); companion gear non-unique; augment summon gate; `allowedClasses: []` = unbound; bonus-slot enchants 0 IL; 'Buff: Buff:' text; companion-enchant STOPGAP (slotType lowercase `companion` is load-bearing — do not "fix" its case); slot words Grimoire/Icon/Talisman in companion gear (compat by design); campaign boons excluded from slot locking.

## H. Suggested fix order

1. **Slot mislabels + malformed slots** (A-1..4, B: lutes, Veinlit) — every one poisons optimizer pools today. Pure data edits.
2. **Rotation cooldownByParagon code bug** (C-1) — silently mis-ranks Ranger/Warlock DPS builds.
3. **Screenshot-proven value bugs** (A-5..16) — mechanical edits with evidence in hand.
4. **Slayer overloads / damagePct ingestion** (B) — decide: wire `damagePct` into the engine or restate as percentStats; 12 items currently do nothing.
5. **Set wiring** (D) — add the screenshot-confirmed artifact Set entries (Lostmauth first), fix mistags, then chip at the 278-item stub pattern (Dusk/Drowcraft/Dragonflight have screenshot-verified real values ready to structure).
6. **Evidence backlog** — see companion doc; top priorities: collars (0%), kits (0%, self-noted unverified), companion gear ids 37–221, the 8 artifact set 3rd-pieces.

*Fleet stats: 30 agents, 1,153 tool calls, ~31 min wall clock. All findings above trace to per-agent detail in the workflow journal (`wf_f9242c2d-3fe`).*
