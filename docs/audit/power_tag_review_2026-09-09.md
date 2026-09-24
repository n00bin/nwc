# Power tag review - rulings log (2026-09-09 -> )

One power at a time, in queue order (`scripts/_power_tag_queue.py`; Warlock first, then classes alphabetically; at-wills, encounters, dailies). Locked rulings are written onto the power as `tags` in `../data/classes.json` by `scripts/_power_tag_apply.py`. Schema: targets single|area, delivery melee|ranged, control [...], dot bool, damageType physical|magical, optional note. Purpose: control tags for Enchanter's Hex / Combatant's Maneuver, targets/delivery for enemy-count and distance scenario inputs.

- PT-1 Dark Helix (Warlock at-will): single / ranged / none / no DoT / magical (2026-09-09)
- PT-2 Eldritch Blast (Warlock at-will): single / ranged / none / no DoT / magical; note: third combo hit (mag 90) splashes 12 ft (2026-09-10, Recommended)
- PT-3 Hellish Rebuke (Warlock Hellbringer at-will): single / ranged / none / DoT / magical; note: DoT mag 15 over 10 s, Retaliate mag 25, Soul Spark on cast + per tick (2026-09-10, Recommended)

## Side gap DUAL-1 (opened at PT-4, locked 2026-09-10 = Recommended)
Dual-mode powers (melee/ranged forms of ONE power, e.g. Hand of Blight) get a `modes` block ({melee:{...}, ranged:{...}} each with magnitude/castSeconds/effects) and tags.delivery = "dual"; the engine resolves the counted mode from the Distance-to-target slider (within melee reach = melee). Rangers keep their stance pair model; revisit when their powers come up. Engine support not built yet; rulings record both modes in the data from now on.

## Side gap CLASS-1 (opened by n00b at PT-4, locked 2026-09-10 = Recommended)
Warlock mechanics live in The Fight -> Class tab. Curse and Soul Investiture already do. Soul Sparks is duplicated: Character-step slider (0-10, state.warlockSoulSparks, live) vs Class-tab mechanic (0-30 per verbatim tooltip, activeMechanics['Soul Spark'], local-only) and the engine adds BOTH. Locked: the Class-tab mechanic is the single source of truth (0-30); old slider value migrates into activeMechanics on load; while TF_CLASS_TAB_LIVE is false the Character-step slider keeps rendering (raised to 30) but writes the same mechanics key; it stops rendering when the tab goes live. Flipping the tab live is a separate decision. Not built yet.
- PT-4 Hand of Blight (Warlock Hellbringer at-will): single / DUAL / none / no DoT / magical; modes: melee mag 55 @0.4 s (4th hit +2 Soul Sparks, Blight -4% target dmg 5 s), ranged mag 75 @0.65 s 80 ft (+1 Soul Spark) (2026-09-10, Recommended)

## RESTART 2026-09-10 (n00b): re-review from Dark Helix, Hellbringer focus only (class-wide Warlock + Hellbringer). PT-1..PT-4 tags removed and re-opened; Hand of Blight keeps its sourced magnitude 55 + modes block (tooltip facts, not rulings). Soulweaver powers parked.
- PT-1 Dark Helix (Warlock at-will): single / ranged / none / no DoT / magical; note: +50 mag per Dark Spiral (kill-fed, max 2), Hellbringer +2 Soul Sparks per cast (+1 per Spiral) = 2 on a boss (2026-09-10, Recommended)
- PT-2 Eldritch Blast (Warlock at-will): single / ranged / none / no DoT / magical; note: 3-hit combo 180 mag/1.2 s, third hit splashes 12 ft, Hellbringer +1 Soul Spark per combo (2026-09-10, Recommended)
- PT-3 Hellish Rebuke (Hellbringer at-will): single / ranged / none / DoT / magical; note: DoT mag 15 over 10 s, Retaliate mag 25 (rare for DPS, n00b), sparks +1 cast +1 per tick, tick ~1 s per n00b (unverified) (2026-09-10, Recommended)
- PT-4 Hand of Blight (Hellbringer at-will): single / DUAL / none / no DoT / magical; melee 55@0.4 s (137.5/s, 1.25 sparks/s, Blight -4% permanent), ranged 75@0.65 s (115/s, 1.5 sparks/s) (2026-09-10, Recommended)
- PT-5 Arms of Hadar (Warlock encounter): AREA / ranged / KNOCKDOWN / no DoT / magical; note: escalating cooldown +2 s per use, 10 s reset; 1 spark per enemy hit (2026-09-10, Recommended)
- PT-6 Vampiric Embrace (Warlock encounter): single / ranged / none / no DoT / magical / curse: CONSUME; note: lifesteal, Curse Consume doubles it; Soulweaver version differs (mag 200, 0.5 s cd, heals) - Soulweaver pass (2026-09-10, Recommended). NEW tag field: curse = consume | synergy | apply
- COOLDOWN NOTE (n00b 2026-09-10): power screens show cooldowns AFTER his Recharge Speed; base values are his call. Arms of Hadar 1.8 (unchanged), Vampiric Embrace 8.5 -> 10.8, Blades of Vanquished Armies 12.4 (was missing).
- PT-7 Blades of Vanquished Armies (Warlock encounter): AREA / ranged / none / DoT (3 pulses over 6 s) / magical / curse: SYNERGY; cd 12.4 base; -5% damage taken on the carrier (2026-09-10, Recommended)
- PT-8 Hadar's Grasp (Warlock encounter): single / ranged / HOLD / DoT / magical / curse: CONSUME; cd 15.5 base (n00b); 300 + 300 DoT, Curse Consume +150 & Soul Puppet; n00b test: 4 hits on a Cursed boss (2026-09-10, Recommended)
- PT-9 Dreadtheft (Warlock encounter): AREA / ranged / none / DoT / magical / curse: SYNERGY / CHANNEL 4 s; mag 200x4 (800) filled; cd 12.4 base (n00b) (2026-09-10, Recommended). NEW tag fields: channel (bool) + channelSeconds
- PT-10 Fiery Bolt (Hellbringer encounter): AREA / ranged / none / no DoT / magical / curse: APPLY; cd 13.9 base (n00b) (2026-09-10, Recommended)
- PT-11 Curse Bite (Hellbringer encounter): AREA (Cursed targets only) / ranged / none / no DoT / magical / curse: CONSUME / charges 2, each on its own cooldown; cd 11.4 base **FLAGGED FOR REVIEW** (n00b unsure) (2026-09-10, Recommended). NEW tag fields: charges, chargesRechargeIndependently, reviewFlag
- PT-12 Infernal Spheres (Hellbringer encounter): AREA / ranged / none / no DoT / magical / curse: APPLY; mag 750 filled (single-target release; min 250), +5% dmg 10 s buff; cd 18.6 base (n00b) (2026-09-10, Recommended)
- PT-13 Killing Flames (Hellbringer encounter): single / ranged / none / no DoT / magical / curse: APPLY; magnitudeRange 650-975 scaling with enemy missing health (NEW power field, engine read pending); cd 12.4 base (n00b) (2026-09-10, Recommended)
- PT-14 Hellfire Ring (Hellbringer encounter): AREA / ranged / none / DoT / magical / curse: APPLY; magnitude 200 -> 450 (blast + 50x5 field, hazard block, NEW power field); cd 11.6 base (n00b) (2026-09-10, Recommended)
- PT-15 Soul Siphon (Warlock daily): AREA (self-centred 40 ft) / ranged / none / no DoT / magical / curse: APPLY; mag 600x2 (1200) + AP 1000 filled; Soul Puppet; Soulweaver version differs (2026-09-10, Recommended)
- PT-16 Brood of Hadar (Warlock daily): single / ranged / STUN / no DoT / magical / curse: APPLY; magnitude 800 -> 2000 (hit + 6 imps x 200; summon block, NEW power field); 400 splash excludes the primary target (n00b counted 7 hits on a boss); AP 1000 filled (2026-09-10, Recommended)
- PT-17 Flames of Phlegethos (Warlock daily): single / ranged / none / DoT / magical / curse: APPLY; magnitude 500 -> 2100 (hit + 1600 burn over 4 s, dotBlock); n00b test: 5 hits (1 s ticks), 5 sparks + 3 from the Soul Puppet; AP 1000 filled (2026-09-10, Recommended). NOTE: Soul Puppet attacks generate sparks (about 3 per 4 s window) - feed into the Soul Spark model.
- PT-18 Gates of Hell (Hellbringer daily): AREA / ranged / KNOCKDOWN / no DoT / magical / curse: SYNERGY; range 60 -> 80 (tooltip); cursedMagnitude 1400 (NEW power field), base 1100 kept; AP 1000 filled (2026-09-10, Recommended)
- PT-19 Tyrannical Curse (Hellbringer daily): single / ranged / none / no DoT / magical / curse: APPLY; +15% debuff already modeled; damage link adds-only; AP 1000 filled (2026-09-10, Recommended). HELLBRINGER POWER PASS COMPLETE: 19/19 (4 at-wills, 10 encounters, 5 dailies).

## REVIEW-2 (locked 2026-09-10 = Recommended): Hellbringer mechanics / class features / slotted class features / feats, one at a time (scripts/_class_item_queue.py + _class_item_apply.py). Rulings: always-on stats -> percentStats/ratingStats; conditional -> percentStatsConditional (+conditionNote / assumeAlwaysOn); stacking mechanics -> effects[]; power-specific modifiers -> powerMods[] (data now, engine later); no combat value -> displayOnly. Every item gets a review stamp.
- R2-1 Shadow Slip (Warlock mechanic): displayOnly - dodge, no modeled effect (2026-09-10, Recommended)
- R2-2 Forte (Hellbringer mechanic): alreadyModeled - paragon percentStats 50/25/25 + engine applyForte; no data change (2026-09-10, Recommended)
- R2-3 Curse (Hellbringer mechanic): modelDefined - curseModel block (8 s; apply/consume/synergy from power tags); CA 3 s not counted (inside 100% CA); engine uptime derivation NOT BUILT (2026-09-10, Recommended)
- R2-4 Soul Spark (Hellbringer mechanic): modeled - per-stack BASE 0.5% (was 1.0%: July tooltip captured with the doubling feat slotted - find it in the feat pass); sparkModel block; soulSparks block on all 19 Hellbringer powers (NEW power field) (2026-09-10, Recommended)
- CLASS-2 (n00b request 2026-09-10, to build): Class section shows the full Soul Spark income table (at-wills, encounters, dailies, Soul Puppet) from the soulSparks blocks. NOT BUILT.
- R2-5 Soul Scorch (Hellbringer mechanic): modeled - tags single/ranged/DoT/magical + sparkSpend block (6-18 sparks, 50 hit + 25 DoT per spark, 1350 at 18); policy setting scorchAtSparks default 18 (n00b fires at max) to build WITH the engine work; engine NOT BUILT (2026-09-10, Recommended + Alternative setting)
- R2-6 Soul Puppet (Hellbringer mechanic): modeled - summon block (60 mag per attack, 1 attack/s per n00b, 20 s, 3 summoners, refresh = Soul Investiture stack, 1 spark/s); engine NOT BUILT (companion damage layer) (2026-09-10, Recommended, rate = 1/s)
- R2-7 Soul Investiture (Hellbringer mechanic): modeled - Risky Investment effect kept; puppetEffect +10%/stack (pet layer, not built); stackModel; **FLAGGED FOR TESTING**: n00b says full 5 stacks near 100% with Hadar's Grasp, arithmetic says 1-2 (2026-09-10, Recommended)
- R2-8 Arcana (Warlock class feature): displayOnly - lore skill (2026-09-10)
- R2-9 Demonic Vision (Warlock class feature): alreadyModeled +2.5% Awareness (2026-09-10)
- R2-10 Devastating Critical (Warlock class feature): alreadyModeled +10% Critical Severity (2026-09-10)
- R2-11 Vengeful Curse (Hellbringer class feature): modelDefined - curseProc 5% on damage taken, secondary applier in the Curse model (2026-09-10, Recommended)
- R2-12 Flames of Empowerment (Hellbringer slotted feature): modeled - conditional Dmg Bonus +4% assumeAlwaysOn (2 stacks via at-wills); partyDebuff +2% block (2026-09-10, Recommended)
- R2-13 Dark One's Blessing (Hellbringer slotted feature): modelDefined - sparkIncome 6 on combat start / kill (10 s ICD each) + procHeal 5% max HP; no stat; boss value about one 6-spark burst (2026-09-10, Recommended)
- R2-14 Dust to Dust (Hellbringer slotted feature): alreadyModeled +5% Damage Bonus (2026-09-10)
- R2-15 Shadow Walk (Hellbringer slotted feature): alreadyModeled (2026-09-10)
- R2-16 Deadly Curse (Hellbringer slotted feature): modelDefined - curseApplyDamage 25 per application per enemy; engine NOT BUILT (Curse model) (2026-09-10, Recommended)
- R2-17 No Pity, No Mercy (Hellbringer slotted feature): modelDefined - powerMods on Hellish Rebuke (no DoT, +15 hit, +15 Retaliate, 3 sparks/hit = 3.75/s) - FIRST powerMods entry; engine NOT BUILT (2026-09-10, Recommended)
- R2-18 Dark Prayers (Hellbringer slotted feature): modelDefined - puppetSparkOnHit 1/hit (about 1/s), summonOnCursedKill (trash only). CORRECTION: base puppet makes NO sparks; n00b's puppet-spark count had Dark Prayers slotted. Soul Puppet + Soul Spark entries updated (2026-09-10, Recommended)
- R2-19 All-Consuming Curse (Hellbringer slotted feature): modelDefined - curseSource: at-wills apply Curse (100% uptime, free consumes; Deadly Curse pairing); engine NOT BUILT (2026-09-10, Recommended). SLOTTED FEATURES COMPLETE 8/8.
- BASE COOLDOWN CORRECTION (n00b naked retrained level-20 toon screenshots, 2026-09-10 23:21): Arms 1.9, Vampiric 9.5, Blades 10.5, Hadar's Grasp 14.3, Dreadtheft 10.5, Fiery Bolt 12.4, Curse Bite 12.4 (review flag cleared), Infernal Spheres 13.3, Killing Flames 10.5, Hellfire Ring 10.5. Geared main / naked = 0.895 on every power = his 10.5% recharge reduction. Earlier n00b-estimated bases replaced.
- SOUL SCORCH BASE CORRECTION: 25 magnitude per spark on the hit (150-450) + 25/spark DoT (150-450); July tooltip (50/spark) had Double Scorch slotted. Same trap as Soul Spark 1.0% vs 0.5% base.
- LESSON: tooltips captured on a geared/featured character include feat effects and recharge; the naked retrained toon is the base reference. All July at-will / daily magnitudes should be re-checked on it.
- WORDING RULE (n00b 2026-09-10): for hit + DoT powers, quote the hit and the burn as separate lines matching the tooltip; a sum is always labelled 'total magnitude (hit + burn)'. Soul Scorch: hit 150-450 base / 300-900 with Double Scorch, burn 150-450; 18-spark total (hit + burn) 900 base / 1350 with Double Scorch.
- R2-20 Double Scorch (Hellbringer feat T1): modelDefined - powerMods Soul Scorch hit +25/spark (450 -> 900 at 18; total hit+burn 900 -> 1350); engine NOT BUILT (2026-09-10, Recommended)
- R2-21 Power of the Nine Hells (Hellbringer feat T1): modelDefined - puppetSummon on every curse-apply encounter (re-summon every ~4 s with three slotted = 5 Investiture stacks permanent); Soul Investiture test flag refined to 'Nine Hells vs Grasp' (2026-09-10, Recommended)
- R2-22 Parting Blasphemy (Hellbringer feat T2): modelDefined - curseRemoveDamage 85 per removal (consume or expiry); engine NOT BUILT (2026-09-10, Recommended)
- R2-23 Warlock's Curse (Hellbringer feat T2): modeled - existing conditional +15% kept, curseGated marker (follows the Curse model / switch) (2026-09-10, Recommended)
- R2-24 Risky Investment (Hellbringer feat T3): alreadyModeled via Soul Investiture effects (2026-09-10)
- R2-25 Soul Desecration (Hellbringer feat T3): modelDefined - puppetMods (permanent, x2 damage = 120/attack, auto-summon); engine NOT BUILT (pet layer) (2026-09-10, Recommended)
- R2-26 Creeping Death (Hellbringer feat T4): modelDefined - dotDebuff 25 per 2 s x5 stacks = 62.5 mag/s sustained; engine NOT BUILT (2026-09-10, Recommended)
- R2-27 Executioner's Gift (Hellbringer feat T4): modelDefined - DATA FIX 10% -> 30% (tooltip); conditional Damage Bonus 30 scaled by enemy missing health (enemyMissingHealthScaled, reads the enemy-health slider); engine PARTIAL (2026-09-10, Recommended)
- R2-28 Soul Spark Recovery (Hellbringer feat T5): modelDefined - cooldownProc 1 s per 6 sparks spent on Soul Scorch (3 s at 18), all encounters; engine NOT BUILT (2026-09-10, Recommended)
- R2-29 Wrathful Souls (Hellbringer feat T5): modeled via a feat-gated +0.5%/spark second effect on the Soul Spark mechanic (base 0.5 + 0.5 = 1.0) - resolves the R2-4 open item (2026-09-10, Recommended)

## REVIEW-2 HELLBRINGER PASS COMPLETE 2026-09-10: 29/29 (7 mechanics, 4 class features, 8 slotted features, 10 feats). Open test flag: Soul Investiture stack count (Nine Hells vs Grasp). Open data check: July at-will/daily magnitudes not yet re-read on the naked toon. Engine work queued (data-first, none built): Curse model, spark income/spend + scorchAtSparks, powerMods, pet layer, puppet/Investiture derivation, enemy-missing-health scaling, Scorch-cadence cooldown proc, Class-section spark table (CLASS-2), DUAL-1 modes, CLASS-1 slider consolidation.

## ROT-1 (locked 2026-09-11 = Recommended, n00b): rotation SIMULATOR replaces the rate model as the engine foundation; Curse, sparks, puppet, Investiture, DoTs become sim layers. CONSTRAINT (n00b): the opener is an open-ended ADD-a-step list, not fixed slots - the rotation's own length is the only limit. CURSE-1 absorbed (built as the first sim layer). Design gap ROT-2 next (inputs, order semantics, defaults, placement) before code.

## ROT-2 (locked 2026-09-11 = Recommended bundle, n00b): (1) Add-step list from slotted at-wills/encounters/dailies + Soul Scorch + artifact + mount power, duplicates allowed, drag to reorder; (2) tenth-second sim, list order = priority, skip steps not ready, loop from the top, gaps filled by the first at-will in the list; (3) dailies at full AP on their turn, artifact/mount on their cadence sliders, Soul Scorch auto at scorchAtSparks unless placed; (4) no list = default order by magnitude per cast, flagged; (5) lives on The Fight -> Powers with mag/s + first-cycle timeline + uptimes (Curse, sparks, puppet, Investiture) that also feed the Class tab; (6) fight length = Time in combat. CONSTRAINT (n00b): LOCAL ONLY - gated like the Class tab (flag false on live); the live site keeps the rate model for both display and optimizer scoring until the flag flips.

## TAG-NEXT (locked 2026-09-11, n00b): Soulweaver next (finish the Warlock after the Hellbringer). Queue: at-wills Soul Reconstruction, Infernal Sanction; encounters Revitalize, Pillar of Power, Wraith's Shadow, Soulstorm, Warlock's Bargain (+ Soulweaver Vampiric Embrace variant); dailies Soul Barrier, Soul Pact; then 7 mechanics, 1 class feature, 8 slotted features, 10 feats. Threat chart PINNED at v20.
- SW-1 Dark Helix (shared, Soulweaver screen): IDENTICAL to Hellbringer minus the Soul Spark line; shared entry stamped sharedIdentical, soulSparks block gated paragon=Hellbringer, soulweave.generation=unknown (does the at-will feed the Soulweave bar? asked n00b, open) (2026-09-11, Recommended). PASS RULE: identical tooltip -> stamp the shared entry; different -> paragon copy in the Soulweaver block.
- SW-2 Eldritch Blast (shared, Soulweaver screen): IDENTICAL minus the Soul Spark line; stamped sharedIdentical, soulSparks gated paragon=Hellbringer, soulweave.generation=unknown (2026-09-11, Recommended)
- SW-3 Soul Reconstruction (Soulweaver at-will): single / ranged / none / no DoT / kind HEAL; heal 275 per press, 1 s cadence (base), 40 Soulweave -> 275 heal mag/s at 40 Soulweave/s; NEW fields heal{magnitude,targets,cadenceSeconds,perSecond} + resource{type,cost,perSecond}; ruling modelDefined, engine read pending (2026-09-11, Recommended)
- SW-4 Infernal Sanction (Soulweaver at-will): single / ranged / none / no DoT / kind SHIELD; heal 50 rider + NEW shield block {800, 20 s, refreshOnRecast + no stacking ASSUMED, reviewFlag}; rotationBasis maintenance = 42.5 mag/s + 4 Soulweave/s per protected target; ruling modelDefined (2026-09-11, Recommended). Open: recast on a live barrier = refresh / add / waste?

## AMENDMENT 2026-09-20 (n00b: "can we make it both") - targets gains a third value **mixed**
- PT-2 / SW-2 Eldritch Blast: targets single -> **mixed**, areaShare 0.5 (hits 1-2 = 90 single, hit 3 = 90 area of the 180-magnitude combo). Rule: a power whose combo/ticks are part single-target, part area is tagged mixed with areaShare = the area share of its magnitude; single-target bonuses count on (1 - areaShare), area bonuses on areaShare. Engine read pending with the rest of POWER-TAGS-2.
- SW-5 Revitalize (Soulweaver encounter): AREA (20 ft ground target, split by target count) / ranged / none / no DoT / kind HEAL; heal 850 per cast, Soulweave 100, base cd 0.5 s (n00b); the 200-over-12 s heal over time on the screenshot is FEAT-ADDED, not base (n00b 2026-09-20) - moved to featAdded, attribute at the feat pass; cleanse 1 display only (2026-09-20, n00b ruling)
- SW-6 Pillar of Power (Soulweaver encounter): AREA (8 ft zone at own position) / melee / none / no DoT / kind BUFF party: +5% damage dealt, +5% Outgoing Healing, -5% damage taken, 10 s each; base cd 23.8 s (n00b; 23.2 s shown after Recharge); uptime 10 s per cooldown unless forced (2026-09-20, n00b ruling). Engine: TF_POWER_BUFFS party entry pending with POWER-TAGS-2.
- SW-7 Wraith's Shadow (Soulweaver encounter): single / ranged / SLOW 6 s / no DoT / magical; mag 500; target -5% damage dealt 6 s (enemy debuff block); base cd 18.1 s (n00b; 17.6 s shown after Recharge) (2026-09-20, n00b ruling)
- SW-8 Soulstorm (Soulweaver encounter): AREA (ground circle, party inside) / ranged / none / no DoT / kind HEAL; 500 over 6 s per member inside, Soulweave 220, base cd 0.4 s (n00b); the 250-over-12 s heal over time is FEAT-ADDED like Revitalize's (n00b 2026-09-20) - parked in featAdded (2026-09-20, n00b ruling)
- SW-9 Warlock's Bargain (Soulweaver encounter): single (self) / melee / none / no DoT / kind BUFF self +10% Outgoing Healing 10 s; base cd 25.7 s (n00b; 25.1 s shown); Soulweave restored per cast UNKNOWN - n00b to test (reviewFlag) (2026-09-20, n00b ruling)
- SW-10 Soul Barrier (Soulweaver daily): AREA (20 ft around the lifespark; old 70 ft note dropped per n00b) / melee / none / no DoT / kind BUFF+HEAL+SHIELD: allies -10% damage taken 12 s; heal over time 250 over 12 s (BASE, n00b); Infernal Barrier absorbs = HP healed, 20 s; 1,000 AP at the Daily cadence (2026-09-20, n00b ruling)
- SW-11 Soul Pact (Soulweaver daily): AREA (up to 9 allies, 100 ft) / melee / none / no DoT / kind HEAL+BUFF: 800 burst heal each, +10% damage resistance self+targets 10 s, self drain 1% max HP/s for 10 s (cost); 1,000 AP at the Daily cadence (2026-09-20, fine)

## SOULWEAVER FEATURES PASS (2026-09-20): 7 mechanics, 1 class feature, 8 slotted features, 10 feats
- SF-1 Forte (Soulweaver mechanic): Soulweave Regen primary (resource rate, rotation model), excels Critical Strike + Awareness (paragon percentStats via applyForte) - alreadyModeled (2026-09-20, fine)
- SF-2 Soul Manipulation (Soulweaver mechanic): Soulweave replaces Soul Sparks (no spark slider for Soulweavers); regen per second in combat + out-of-combat bonus UNKNOWN - n00b to test (reviewFlag); no hidden healing static (Lia 2026-07-05); threat reduction display only (2026-09-20, n00b ruling)
- SF-3 Lifespark (Soulweaver mechanic): always-present pet, auto-casts Inspirit; silenced by Warlock's Bargain (10 s) and Soul Barrier (channel); pet layer not built (2026-09-20, fine)
- SF-4 Inspirit (Soulweaver mechanic, pet spell): single / ranged 80 ft / kind HEAL 120 per cast, fixed 2.5 s cadence (n00b) = 48 heal mag/s passive; the 60-over-12 s heal over time is FEAT-ADDED (n00b) (2026-09-20, n00b ruling)
- SF-5 Lifemark (Soulweaver mechanic): pet priority-target rule, no numbers - displayOnly (2026-09-20, fine)
- SF-6 Lifelink (Soulweaver mechanic): input binding (tap Lifemark / hold Lifepact) - displayOnly (2026-09-20, fine)
- SF-7 Lifepact (Soulweaver mechanic): single (Lifemark ally or self) / ranged 120 ft / kind HEAL CHANNEL 1,000 heal mag/s while held, no cooldown; DRAINS Soulweave while channelled (n00b), rate UNKNOWN - test (reviewFlag); rotation = channel share bounded by Soulweave (2026-09-20, n00b ruling)
- SF-8 Vengeful Blades (Soulweaver class feature / General skill): retaliation proc 5% per hit taken, 100 mag PHYSICAL to the attacker; rate from the enemy-attacks input; procDamage block (2026-09-20, fine)
- SF-9..SF-12 Flames of Empowerment / Dark One's Blessing / Dust to Dust / Shadow Walk (class-shared slotted features, Soulweaver screens): IDENTICAL to the Hellbringer rulings of 2026-09-10 (Dark One's Blessing reads 60 Soulweave instead of 6 Soul Sparks - resource block added); Soulweaver copies stamped sharedIdentical with the Hellbringer stat blocks (2026-09-20, pass rule)
- SF-13 Borrowed Spirit (Soulweaver slotted feature): Soulweave income 50 per 10 s (5/s) only when ANOTHER player's power heals you - party condition (second healer), 0 solo; no stat effect (2026-09-20, fine)
- SF-14 Flowing Link (Soulweaver slotted feature): move while channelling Lifelink - displayOnly (2026-09-20, fine)
- SF-15 Souleater (Soulweaver slotted feature): damage proc +20 mag necrotic after damaging attacks only (n00b; never heals), 10 Soulweave per proc - rotation model charges the Soulweave (~20/s at 2 hits/s); excluded attacks unknown (2026-09-20, n00b ruling)
- SF-16 Soulbond (Soulweaver slotted feature): heal proc 300 mag to an ally under 50% within 30 ft, once per 10 s, no cost; conditional heal stream (party-health uptime) (2026-09-20, fine)
## Soulweaver slotted features complete 8/8; feats next (10)
- SF-17 Essence of Time (Soulweaver feat T1a): Soulweave regen ramp, 1 stack per 3 s idle, max 4, reset on any spend; per-stack value UNKNOWN - test (reviewFlag); model = regen while idle (2026-09-20, n00b ruling)
- SF-18 Essence of Power (Soulweaver feat T1b): Soulweave regen boost for 6 s after any damaging hit; amount UNKNOWN - test (reviewFlag); model = regen while attacking, uptime from hit rate (2026-09-20, n00b ruling)
- SF-19 Focused Spark (Soulweaver feat T2a): Soul Reconstruction marks the target 6 s -> Inspirit +100 (220) on them + pet priority; ~+80 heal mag per press on the same ally; powerMods block (2026-09-20, fine)
- SF-20 Soul Reclamation (Soulweaver feat T2b): under 30% Soulweave the pet channels regen on you instead of Inspirit; amount UNKNOWN - test (reviewFlag) (2026-09-20, n00b ruling)
- SF-21 Oversoul (Soulweaver feat T3a): +10% Dmg Bonus at full Soulweave, falling with the bar; Class-tab Soulweave slider, linear ASSUMED (steps unknown - reviewFlag) (2026-09-20, n00b ruling)
- SF-22 Soultheft (Soulweaver feat T3b): 25 Soulweave per 10 s when struck (2.5/s, enemy-attacks input) (2026-09-20, fine)
- SF-23 Bright Spark (Soulweaver feat T4a): Inspirit +300 for 12 s after each Daily (~+1,500 heal mag per Daily, ~25/s at 60 s cadence); stacking with Focused Spark UNKNOWN - test (reviewFlag) (2026-09-20, n00b ruling)
- SF-24 From the Brink (Soulweaver feat T4b): +15% Outgoing Healing on allies under 25% HP; counted at the party-health uptime share (same input as Soulbond) (2026-09-20, fine)
- SF-25 Feypact (Soulweaver feat T5a): owns the heal-over-time blocks parked on Revitalize 200/12 s, Soulstorm 250/12 s, Inspirit 60/12 s and Soulweaver Vampiric Embrace 250/12 s (screens were taken with Feypact selected); powerMods block, featAdded entries re-pointed (2026-09-20, fine)
- SF-26 Hellpact (Soulweaver feat T5b): Vampiric Embrace / Revitalize / Soulstorm / Inspirit raise an Infernal Barrier = 65% of HP healed, 20 s (n00b, from the affected powers' tooltips); Infernal Sanction barrier stronger by UNKNOWN - test (2026-09-20, n00b ruling)

## SOULWEAVER FEATURES PASS COMPLETE 2026-09-20: 26/26 (7 mechanics, 1 class feature, 8 slotted, 10 feats). WARLOCK CLASS FULLY REVIEWED (both paragons). Open tests: Soulweave regen rate + OOC bonus, Warlock's Bargain restore, Lifepact drain, Essence of Time/Power values, Soul Reclamation value, Oversoul curve, Bright+Focused Spark stacking, Hellpact Infernal Sanction size. Next: Barbarian (19 powers).

## BARBARIAN PASS (2026-09-20). Count check first (n00b): Sentinel's Slash + Challenger's Slash were MISSING (added from tooltips), Sprint marked Blademaster-only; queue/apply now read the direct paragon shape and dedupe marked copies. Order: shared -> Blademaster -> Sentinel per section; Sentinel-side differences reviewed on the Sentinel pass.
- BB-1 Sure Strike (shared at-will, Blademaster screen): single / melee / none / no DoT / physical; 4 x 60 @0.45 s (240 per 1.8 s); Sentinel adds Stamina Restoration - Sentinel pass (2026-09-20, fine)
- BB-2 Bounding Slam (shared at-will): AREA (10 ft around target) / melee (30 ft lunge) / none / no DoT / physical; 80 mag @1 s, 120 under Battlerage/Unstoppable (Class-tab toggle) (2026-09-20, fine)
- BB-3 Brash Strike (Blademaster at-will): single / melee / none / no DoT / physical; 3 x 140 @0.65 s (~215 mag/s) (2026-09-20, fine)
- BB-4 Relentless Slash (Blademaster at-will): AREA (240-degree cone) / melee / none / no DoT / physical; 2 x 55 @0.8 s (~69 mag/s); self +5% damage 12 s, ~100% uptime while used (2026-09-20, fine)
- BB-5 Not So Fast (shared encounter): AREA 15 ft / melee / SLOW 6 s / no DoT / physical; mag 300; base cd 11.7 s (n00b; 10.9 shown) (2026-09-20, n00b ruling)
- BB-6 Mighty Leap (shared encounter): AREA 12 ft at landing / melee (50 ft leap) / none / no DoT / physical; mag 380; base cd 14.6 s (n00b; 13.6 shown) (2026-09-20, n00b ruling)
- BB-7 Punishing Charge (shared encounter, + duplicate Blademaster block copy): single / melee (60 ft lunge) / STUN 3 s / no DoT / physical; mag 650; base cd 14.6 s (n00b; 13.6 shown) (2026-09-20, n00b ruling)
- BB-8 Indomitable Battle Strike (shared encounter): single / melee / none / no DoT / physical; mag 750 flat, base cd 11.7 s (n00b live reading); archived screenshot is STALE (shows rage-scaling 800-1200, 10.9 s) - reshoot (2026-09-20, n00b ruling)
- BB-9 Bloodletter (shared encounter): single / melee / none / no DoT / physical; mag 600 (live-confirmed) with lifesteal rider; base cd 14.6 s (n00b; 13.6 shown) (2026-09-20, n00b ruling)
- BB-10 Hidden Daggers (Blademaster encounter): AREA cone / ranged 40 ft / none / no DoT / physical; mag 100 + Surprise Attack 150 on next other attack (sequence proc, 1 per cast); 2 charges, base cd 7.8 s each (n00b; 7.2 shown) (2026-09-20, n00b ruling)
- BB-11 Roar (Blademaster encounter): AREA 45-degree cone 30 ft / ranged (shout) / STUN 2 s + INTERRUPT / no DoT / physical; mag 250; Rage per target hit (amount unknown); base cd 12.6 s (n00b; 11.8 shown) (2026-09-20, n00b ruling)
- BB-12 Frenzy (Blademaster encounter): single / melee 17 ft / none / no DoT / physical; mag 1275; base cd 15.6 s (n00b; 14.5 shown) (2026-09-20, n00b ruling)
- BB-13 Battle Fury (Blademaster encounter): AREA 80 ft / melee (self-cast) / none / no DoT / kind BUFF: self +10% dmg, party +5% dmg, 10 s; Rage on cast (amount unknown); base cd 19.5 s (n00b; 18.1 shown); party 5% needs a TF_POWER_BUFFS party entry (POWER-TAGS-2) (2026-09-20, n00b ruling)
- BB-14 Axestorm (Blademaster encounter): AREA line 50 x 10 ft / ranged / none / no DoT / physical; mag 450; base cd 14.6 s (n00b; 13.6 shown) (2026-09-20, n00b ruling). Blademaster encounters complete.
- BB-15 Savage Advance (shared daily): MIXED (single 1800 hit, area KNOCKBACK, areaShare 0) / melee (82 ft lunge) / physical; 1,000 AP at the Daily cadence (2026-09-20, fine)
- BB-16 Spinning Strike (shared daily): AREA 15 ft / melee / none / no DoT / physical; 1400 over a 3 s CHANNEL; control immunity + 100% movement display only; 1,000 AP (2026-09-20, fine)
- BB-17 Crescendo (shared daily): single / melee (30 ft) / STUN 3 s / no DoT / physical; 2800 multi-hit combo; control immunity display only; 1,000 AP (2026-09-20, fine)
- BB-18 Avalanche of Steel (Blademaster daily): AREA at landing / melee (30 ft leap) / KNOCKDOWN / no DoT / physical; 1400 after a 5 s airborne cast (dead time charged by the rotation model); 1,000 AP (2026-09-20, fine)
- BB-19 Adamantine Strike (Blademaster daily): AREA 180-degree cone 30 ft / melee / none / no DoT / physical; 1200; targets +5% damage taken 10 s (buff table); 1,000 AP (2026-09-20, fine). BLADEMASTER POWERS COMPLETE (shared + paragon).

## BLADEMASTER FEATURES PASS (2026-09-20)
- BF-1 Battlerage (Blademaster mechanic): +25% dmg / -15% taken / control immunity / faster at-wills; burst window ~8.7 s attacking (n00b 2026-06-08), NOT holdable; Class-tab toggle stands in; TEST: at-will speed %, rebuild-to-50% time, Rage income per source (2026-09-20, n00b ruling)
- BF-2 Forte (Blademaster mechanic): Power primary, excels Critical Severity + Awareness - alreadyModeled via paragon percentStats (2026-09-20, fine)
- BF-3 Shared class features (Bravery / Steady Rage / Mighty Vitality / Trample the Fallen): STRUCTURE - they are slottable (2 of 8 with the paragon four), NOT always-on; moved out of class.classFeatures into BOTH paragons' slottedClassFeatures as full copies (Warlock/Paladin convention), 'active' flags dropped. Bravery +10% Movement/Deflect; Steady Rage 2 Rage/s; Mighty Vitality +10% Max HP +2.5% Power; Trample the Fallen control-proc +5% self dmg / +5% target taken 10 s (uptime from tags.control cadence, POWER-TAGS-2) (2026-09-20, fine)
- BF-4 Barbed Strikes (Blademaster feature): +5% Crit Strike + Crit Severity at full stamina, scaling down (stamina slider, linear assumed) (2026-09-20, fine)
- BF-5 Steel Blitz: at-wills 20% double-strike = +20% At Will Dmg Bonus (slot.atwill bucket) (2026-09-20, fine)
- BF-6 Raging Strikes: up to +15% Dmg Bonus by Rage level (Class-tab Rage slider, linear assumed) (2026-09-20, fine)
- BF-7 Impatience: -2 s all cooldowns on entering Battlerage (cdProc on the Battlerage cadence, BF-1 test) (2026-09-20, fine)
- BF-8 Relentless Speed (Blademaster feat T1a): 15% per Relentless Slash combo -> free Not So Fast cast (no cooldown), ~1 per 11 s; needs both slotted (2026-09-20, fine)
- BF-9 Mightier Leap (T1b): whiff-recast mode on Mighty Leap (second cast 780), cannot chain; optional play pattern, off by default (2026-09-20, fine)
- BF-10 Bloodspiller (T2a): Bloodletter 950 mag, cd -3 s, lifesteal -> self damage (powerMods) (2026-09-20, fine)
- BF-11 Indomitable Rage (T2b): Indomitable Battle Strike 800-1200 by Rage level (linear assumed) replaces flat 750; RETRACTS the BB-8 stale-screenshot flag - the archive was feat-modified (same lesson as Feypact) (2026-09-20, fine)
- BF-12 Overpenetration (T3a): up to +10% Dmg Bonus by crit-stat cap proximity (sheet-computed, linear assumed; capped build = flat 10%) (2026-09-20, fine)
- BF-13 Brutal Critical (T3b): +3 Rage per crit (~5.4/s), Rage income only (2026-09-20, fine)
- BF-14 Steel Slam (T4a): Avalanche of Steel + 200 x 5 area DoT over 12 s + Slow 3 s (data said x3, tooltip x5 - corrected) (2026-09-20, fine)
- BF-15 Unstoppable Spin (T4b): Spinning Strike sets Rage >= 50 and auto-Battlerage +6 s at 50% dmg; excludes Rampage; value pends BF-1 test (2026-09-20, fine)
- BF-16 Relentless Battlerage (T5a): 2x Rage from hits/encounters/damage taken/kills; shortens rebuild only (BF-1 test) (2026-09-20, fine)
- BF-17 Escalating Rage (T5b): 5 crits outside Battlerage arm Rampage 20 s -> next window +8 s and +25% (50% total); excludes Unstoppable Spin (2026-09-20, fine)
## BLADEMASTER COMPLETE 2026-09-20: 19 powers + 2 mechanics + 8 features + 10 feats. Open tests: Battlerage at-will speed / rebuild time / Rage income; curves on Raging Strikes, Barbed Strikes, Overpenetration (linear assumed). Next: SENTINEL side (2 at-wills, 5 encounters, 2 dailies, 4 mechanics, 4 features, 10 feats + Sentinel screens of the shared powers).

## SENTINEL PASS (2026-09-20)
- BS-1 Sentinel's Slash (Sentinel at-will): AREA 15 ft / melee / none / no DoT / physical; CHARGE 50-300 over 2.8 s (default full hold); blocks frontal attacks on stamina while charging (display only) (2026-09-20, fine)
- BS-2 Challenger's Slash (Sentinel at-will): AREA 260-degree cone / melee / none / no DoT / physical; 3 x 30 @0.65 s (~46 mag/s); Increased Threat flag (2026-09-20, fine)
- BS-3 Come and Get It (Sentinel encounter): AREA 30 ft / melee / PULL (Draw In) / no damage / kind TAUNT; base cd OPEN (13.4 shown) (2026-09-20, fine)
- BS-3 addendum: Come and Get It base cd 14.6 s (n00b)
- BS-4 Enduring Shout (Sentinel encounter): self / melee / none / kind BUFF +20% Max HP 15 s + heal 20% max HP per cast; base cd 29.2 s (n00b; 26.9 shown) (2026-09-20, fine)
- BS-5 Takedown (Sentinel encounter): single / melee / KNOCKDOWN / no DoT / physical; mag 400; base cd 9.7 s (n00b; 8.9 shown); the Increased Threat line is FEAT-ADDED, not base (n00b) - parked, attribute at the feat pass (2026-09-20, n00b ruling)
- BS-6 Ignore Weakness (Sentinel encounter): self / melee / none / kind RESOURCE: stamina 50%-100% by missing health (linear assumed); base cd 23.4 s (n00b; 21.5 shown) (2026-09-20, n00b ruling)
- BS-7 Primal Fury (Sentinel encounter): AREA 15 ft / melee / none / no DoT / physical; 200-600 by missing stamina (linear assumed); Rage spender 30 per cast, base cd 0.9 s (n00b; 0.8 shown); threat line BASE (n00b); ends Unstoppable (2026-09-20, n00b ruling). Sentinel encounters complete.
- BS-8 Primal Instinct (Sentinel daily): self / melee / kind BUFF +30% Awareness +90% Crit Avoidance 10 s; Rage over time (amount unknown); 1,000 AP (2026-09-20, fine)
- BS-9 Battle High (Sentinel daily): self / melee / kind BUFF +35% Max HP 10 s + heal 35% per cast; allies +15% is FEAT-ADDED, not base (n00b) - parked; 1,000 AP (2026-09-20, n00b ruling). SENTINEL POWERS COMPLETE.
- BM-1 Block (Sentinel tactical): frontal absorb up to 40% max HP on stamina, control immunity; during Unstoppable -> +15% Crit Avoidance instead; blockModel block, tank-model input (2026-09-20, fine)
- BM-2 Unstoppable (Sentinel mechanic): Battlerage engine (50% Rage, faster at-wills, drains) but the window = absorb all damage up to 60% max HP on stamina + control immunity, no damage bonus; window/rebuild/speed TESTS separate from the Blademaster numbers (2026-09-20, fine)
- BM-3 Path of the Sentinel: threat multiplier, no number - displayOnly (2026-09-20, ok)
- BM-4 Sentinel Forte: Defense primary, Crit Sev + Awareness - alreadyModeled (2026-09-20, ok). Sentinel mechanics complete 4/4.
- BF-S1 Raging Bladeturn (Sentinel feature): up to +5% Deflect + Crit Avoidance by Rage level (slider, linear assumed) (2026-09-20, fine)
- BF-S2 Challenger's Charge: Punishing Charge taunts, chargeable (charged = no taunt) - displayOnly (2026-09-20, fine)
- BF-S3 Threatening Presence: threat up - displayOnly (2026-09-20, fine)
- BF-S4 Furious Reaction: stamina empty -> 10 Rage + heal 10% max HP over 10 s, ICD 10 s (procHeal) (2026-09-20, fine)
- BF-S5 Frustrating Slash (Sentinel feat T1a): Sentinel's Slash threat boost 5 s - displayOnly (2026-09-20, fine)
- BF-S6 Leap into Action (T1b): Mighty Leap threat boost 10 s - displayOnly (2026-09-20, fine)
- BF-S7 Indomitable Might (Sentinel feat T2a): Indomitable Battle Strike 500-1000 by remaining health (linear assumed) replaces flat 750 (2026-09-20, fine)
- BF-S8 On the Move (T2b): Not So Fast 350 mag + party +20% movement 4 s (display only) (2026-09-20, fine)
- BF-S9 Disarming Takedown (Sentinel feat T3a): Takedown -> target +5% physical damage taken 10 s (~100% uptime), party-wide for physical (2026-09-20, fine)
- BF-S10 Boasting Takedown (T3b): Takedown threat - displayOnly; confirmed source of the BS-5 parked threat line (2026-09-20, fine)
- BF-S11 Crushing Advance (Sentinel feat T4a): Savage Advance loses knockback, gains target -12% damage dealt 12 s (2026-09-20, fine)
- BF-S12 Inspiring Bravado (T4b): Battle High party +15% max HP 10 s - owns the BS-9 parked ally line (2026-09-20, fine)
- BF-S13 Rage and Rally (Sentinel feat T5a): Unstoppable threat (display) + up to 40% stamina refund when it ends (2026-09-20, fine)
- BF-S14 Blood Fury (T5b): Primal Fury cost 30 (base is 40 - n00b; BS-7's 30 was feat-modified, corrected), free + lifesteal during Unstoppable (2026-09-20, fine)
## BARBARIAN COMPLETE 2026-09-20: both paragons - 29 powers, 6 mechanics, 16 features, 20 feats. Open tests: Battlerage/Unstoppable windows (speed, rebuild, income); linear-assumed curves (Raging Strikes, Raging Bladeturn, Barbed Strikes, Overpenetration, Indomitable Might/Rage, Primal Fury, Ignore Weakness). Lesson repeated: archived tooltips carry the capture character's FEATS (Indomitable Rage, Boasting Takedown, Inspiring Bravado, Blood Fury) - always ask n00b for base. Next: Bard.

## BARD-DUP-1 (locked 2026-09-21 = Recommended, n00b "1 copy"): every Bard paragon power existed twice (direct pp[t] = July screenshot rebuild; pp.powers[t] = older copy) and songs in three places, with the engine reading the OLD song list. Merged to ONE copy: direct pp[t] kept (old-only keys filled in, conflicts noted in mergeNote), pp.powers[t] deleted; songs merged into pp.powers.songs (the engine key) with July fields overlaid (conflict flagged: Rejuvenating Carol performanceCost 100 vs 150 - settle at the song review), class.powers.song + pp.song deleted; shared Blaze Flamenco + Rejuvenating Carol ADDED to the Minstrel list (were missing - a Minstrel could not pick them). Verified headless: Songblade 4/7/3/6 + 6 songs, Minstrel 4/7/3/6 + 8 songs, rotation profile names resolve, engine ok. Count check vs the Powers screens: all rows match on both paragons (Minstrel shows 2 locked song slots on n00b's toon).

## BARD PASS (2026-09-21). Order: shared -> Songblade -> Minstrel per section; songs after dailies.
- BD-1 Reprise (shared at-will): AREA 200-degree cone / melee / none / no DoT / physical; 4 x 35 @0.3 s (~117 mag/s) (2026-09-21, fine)
- BD-2 Fleche (shared at-will): single / ranged 80 ft / none / no DoT / magical (psychic); 180+180+240 = 600 per 1.8 s (~333 mag/s) (2026-09-21, fine)
- BD-3 Con Elemento (Songblade at-will): AREA / DUAL (song-keyed modes block: base 140 fire radius melee; Con Fuoco fire radius; Con Moto projectile line ranged; Con Brio physical cone) / none / no DoT / damage type follows the song; variant magnitudes TEST (2026-09-21, n00b ruling)
- BD-4 Staccato (Songblade at-will): single / melee / none / no DoT / physical; 120 per hit @0.5 s; combo hit count TEST (2026-09-21, n00b ruling)
- BD-5 Lunge (shared encounter): single / melee (60 ft lunge) / STUN 1 s / no DoT / physical; mag 500; base cd 7.6 s (n00b; 6.8 shown) (2026-09-21, n00b ruling). Minstrel at-wills deferred to the Minstrel pass (n00b).
- BD-6 Dancing Lights (shared encounter): single / ranged 80 ft / DAZE 3 s / no DoT / magical; mag 900; target -5% damage 6 s; base cd 13.3 s (n00b; 12.5 shown) (2026-09-21, n00b ruling)
- BD-7 Flourish (shared encounter): self / melee / kind BUFF +30% encounter + song damage AND healing 4 s, re-cast unlocked by any other encounter/song (2 casts per cooldown, up to 8 s); base cd 17.2 s (n00b; 16 shown) (2026-09-21, n00b ruling). TF_POWER_BUFFS needs an appliesTo encounter+song entry (POWER-TAGS-2).
- BD-8 Duet (shared encounter): AREA 20 ft / melee / DAZE 2 s / no DoT / magical (arcane); 250 x 2 = 500; base cd 15.3 s (n00b; 14.2 shown) (2026-09-21, n00b ruling)
- BD-9 Ad Libitum (Songblade encounter): single / melee / none / no DoT / physical; 700, 50% re-cast chain up to 3x (1.875 expected casts); base cd 15.3 s (n00b; 13.7 shown) (2026-09-21, n00b ruling)
- BD-10 Contre (Songblade encounter): hold-keyed modes: Seconde tap 500 area knockdown / Septime 1 s 1200 single knockback (default) / Neuvieme 2 s 900 area x3; frontal absorb + control immunity while held (display); base cd 14.3 s (n00b; 12.9 shown) (2026-09-21, n00b ruling)
- BD-11 Volti Subito (Songblade encounter): AREA path 34 ft / melee rush / none / no DoT / physical; 300 x 3 guaranteed rushes per cooldown; base cd 15.3 s (n00b; 13.7 shown) (2026-09-21, n00b ruling). Songblade encounters complete.
- BD-12 Inspiration (shared daily): self + nearest ally 15 ft / kind BUFF +25% dmg, -15% taken, control immunity 12 s; HoT 400 x 5 over 12 s BASE (n00b); 1,000 AP (2026-09-21, fine)
- BD-13 Encore (shared daily): self / kind RESOURCE - free replay of the last song; 1,000 AP and 0.8 s cast once a song has been played (n00b; tooltip shows 0 s / no cost before then) (2026-09-21, n00b ruling)
- BD-14 Lore (Songblade daily): single / ranged 80 ft / kind BUFF: target +10% crit sev taken 10 s (party), self +20% dmg 10 s, typed lore +10% 30 s (type follows the song); 1,000 AP (2026-09-21, fine). SONGBLADE POWERS COMPLETE (shared + paragon).

## BARD SONGS (2026-09-21). Song tag shape: kind song, songType elemental|ballad|heal|utility, targets/delivery/damageType for the on-cast hit, plus a songEffects block {durationSeconds, cancelsOtherSongs, onCast, powerMods (flat magnitude / type conversion), partyBuff, links}. Written onto BOTH paragon copies of a shared song.
- BS-1 Blaze Flamenco (shared song): elemental 72 s; on cast 350 fire area 30 ft; at-wills/encounters +20 flat mag -> fire; party +2% dmg +2% magical; 100 Performance (2026-09-21, fine)
- BS-2 Steel March (Songblade song): elemental 72 s; on cast 350 physical cone 40 ft; at-wills/encounters +20 flat -> physical; self + party +2% dmg +2% physical (n00b: includes you); 100 Performance (2026-09-21, fine)
- BS-3 Tailwind Mambo (Songblade song): elemental 72 s; on cast 350 projectile line 80 ft; at-wills/encounters +20 flat -> projectile; self + party +2% dmg +2% projectile; projectile bucket = physical ASSUMED (n00b unsure - test) (2026-09-21, fine)
- BS-4 Ballad of the Hero (Songblade song): BALLAD 20 s (stacks with the elemental song); +85 radiant rider per hit on the primary target; Hero's Finale 800 single via Perform (ends it); 100 Performance (2026-09-21, fine)
- BS-5 Ballad of the Witch (Songblade song): BALLAD 20 s; +40 arcane rider on all targets per hit; Witch's Finale 400 area via Perform; 100 Performance (2026-09-21, fine)
- BS-6 Rejuvenating Carol (shared song): HEAL song 60 s (cancels elemental); HoT 100 on self + party; per-tick vs total and tick interval UNKNOWN - test; screen fixes the merge conflict (100 cost / 100 mag) (2026-09-21, fine). Songblade-side songs complete 6/6.
- BM-B1 Roll (shared tactical): dodge + brief immunity - displayOnly (2026-09-21, fine)
- BM-B2 Perform (shared mechanic): Performance resource block (min 100, songs cost 100, doubles as the finale button); fill rate TEST (2026-09-21, n00b ruling)
- BM-B3 Free Perform: out-of-combat song creation - displayOnly (2026-09-21, fine)
- BM-B4 All the World's a Stage (Songblade mechanic): gauge 100 -> 150 (base 100, n00b), songs 72 s, regen up (amount in the fill-rate test) (2026-09-21, fine)
- BM-B5 Battle Harmony: the matching-type +2% inside each elemental song - alreadyModeled (2026-09-21, fine)
- BM-B6 Songblade Forte: Power / Crit Sev / Deflect Sev - alreadyModeled (2026-09-21, fine). Songblade mechanics complete.

## BARD CLASS FEATURES (2026-09-21; 8 slottable per paragon already as full copies)
- BF-B1 Soloist (shared): +10% dmg with no party member nearby; n00b: reportedly also works IN a group when nobody is within 30 ft - TEST; Solo toggle gates until then (2026-09-21, n00b ruling)
- BF-B2 Songward (shared): absorb while in Performance Mode - displayOnly (2026-09-21, fine)
- BF-B3 Mystifying Strikes (shared): 5% proc; solo 500 psychic DoT/12 s, group = ally pops it for 400 + 400 heal (Solo toggle) (2026-09-21, fine)
- BF-B4 Sforzando (shared): +5% dmg + healing 20 s per song (100% on the ballad metronome) (2026-09-21, fine)
- BF-B5 Advancing Parry (Songblade): +25% Deflect 2 s after Reprise/Flourish/Volti Subito (~100% with Reprise) (2026-09-21, fine)
- BF-B6 Advancing Blade: +1% dmg per finished at-will combo, 5 stacks, 12 s (default 5) (2026-09-21, fine)
- BF-B7 Masterful Performance: elemental song added effects x1.5 when played manually (default on) (2026-09-21, fine)
- BF-B8 Musician's Flow: Performance regen x1.25 (2026-09-21, fine). Songblade class features complete 8/8.

## SONGBLADE FEATS (2026-09-21)
- BF-B9 Backup Performer (T1a): manual Rejuvenating Carol -> Reinvigorating Carol: 1,200 instant party heal + 100 resource to healers, no song cancel, 30 s lockout (2026-09-21, fine)
- BF-B10 Voice Throw (T1b): 50% threat to the tank 10 s - displayOnly (2026-09-21, fine)
- BF-B11 Battlefield Ostinato (T2a): single-target at-wills buff area at-wills +20% and vice versa (12 s) - reads tags.targets; +20% all at-will dmg with one of each (2026-09-21, fine)
- BF-B12 Elemental Medley (T2b): +10 flat song magnitude per Con Elemento variant, 3 stacks/60 s, default 1 (2026-09-21, fine)
- BF-B13 Ballad Colla Voce (T3a): manual ballad -> party role buff (DPS +5% dmg / tank -5% taken / healer +5% OH) 20 s, ends on finale (2026-09-21, fine)
- BF-B14 A Due (T3b): self + nearest ally 25 ft: +10% dmg, -10% taken, +10% OH; ~100% in a group, 0 solo (2026-09-21, fine)
- BF-B15 Redoublement (T4a): weave inside Ad Libitum / Volti Subito; encounters +10% inside the window (2026-09-21, fine)
- BF-B16 Martial Performance (T4b): manual elemental song whose opening hit lands -> +10 flat for the song's 72 s (stacks: +60 with Medley + Masterful) (2026-09-21, fine)
- BF-B17 Performer (T5a): chance for a free improvised encounter cast per at-will/encounter use; 8 procs -> Grandstand (Encore song x2); proc chance TEST (2026-09-21, fine)
- BF-B18 Loremaster (T5b): Battle Research 5 stacks (at-will proc / 1 s Research casts) -> Ready to Exploit! +125% encounter + finale dmg 10 s; proc chance TEST (2026-09-21, fine)
## SONGBLADE COMPLETE 2026-09-21: 14 powers, 6 songs, 6 mechanics, 8 features, 10 feats. Open tests: Performance fill rate, Con Elemento variants, Staccato hits, Rejuvenating Carol ticks, projectile bucket, Soloist in group, Performer + Loremaster proc chances. Next: MINSTREL (2 at-wills, 3 encounters, 1 daily, 6 songs, 3 mechanics, 4 features, 10 feats).

## MINSTREL PASS (2026-09-21)
- BN-1 Arpeggio (Minstrel at-will): single / ranged / kind HEAL 250 per press, 1 s cadence, 40 Performance (250 heal mag/s) (2026-09-21, fine)
- BN-2 Phantasmal Concerto (Minstrel at-will): AREA 30 ft / ranged / none / CHANNEL 70 psychic per 1.1 s tick (~64 mag/s) (2026-09-21, fine)
- BN-3 Serenade (Minstrel encounter): single / ranged / kind BUFF on own healing: tap +5% permanent mark (no cd), hold +50% 10 s; base cd 22.9 s (n00b; 21.4 shown) (2026-09-21, n00b ruling)
- BN-4 Delayed Play (Minstrel encounter): self / kind UTILITY - store a song, fire it instantly later; display only; base cd 11.4 s (n00b; 10.7 shown) (2026-09-21, n00b ruling)
- BN-5 Bassline (Minstrel encounter): self / kind RESOURCE - 10 s channel, up to 200 Performance (20/s), early-cancel refund; base cd 22.9 s (n00b; 21.4 shown) (2026-09-21, n00b ruling). Minstrel encounters complete.
- BN-6 Curtain Call (Minstrel daily): AREA 100 ft / kind HEAL+BUFF cash-in of active songs (Rejuv 800 heal, Etude 800 shield 20 s, Warding -10% taken 10 s, Blaze 100 AP); 1,000 AP (2026-09-21, fine). MINSTREL POWERS COMPLETE.

## MINSTREL SONGS (2026-09-22)
- BNS-1 Defender's Minuet (Minstrel song): instant single-target 2,000 heal (lowest HP / Serenade mark), 160 Performance, no duration (2026-09-22, fine)
- BNS-2 Warding Carol (Minstrel song): utility cleanse 10 s, 80 ft, 120 Performance - displayOnly (Curtain Call cash-in carries the number) (2026-09-22, fine)
- BNS-3 Aurora Fantasia (Minstrel song): held ballad (Performance drain, rate TEST); rider +25 psychic all targets + 50 party heal per attack; Aurora Finale 400 dmg + 400 party heal via Perform (2026-09-22, n00b ruling)
- BNS-4 Sheltering Etude (Minstrel song): heal 60 s; 600 delayed heal per member (under 50% or expiry; recast pops it), 200 Performance (2026-09-22, fine)
- BNS-5 Reprised Carol: Enhance (Minstrel song, Gambler): spends Gambler's Delight, rolls Crit Sev / Mitigation / Recharge 2% (stack-scaled) 15 s, else 100 party HoT; odds + scaling TEST (2026-09-22, fine)
- BNS-6 Reprised Carol: Recovery (Gambler): rolls stamina regen / shield / AP regen 15 s, else 100 HoT; odds TEST (2026-09-22, fine). Minstrel songs complete 8/8.
- BM-N1 The Gift of Song (Minstrel mechanic): gauge 1000, songs do not cancel each other, heal threat down (display) (2026-09-22, fine)
- BM-N2 Natural Talents: +1 quickplay slot - displayOnly (2026-09-22, fine)
- BM-N3 Minstrel Forte: Performance Regen / Crit Sev / Deflect Sev - alreadyModeled (2026-09-22, fine). Minstrel mechanics complete.
- BF-N1 Arpeggio Fortissimo (Minstrel feature): Arpeggio -> 100 per member within 40 ft for 60 Performance (2026-09-22, fine)
- BF-N2 Vamos Alla!: Blaze Flamenco party movement +10% (20% OOC) - displayOnly (2026-09-22, fine)
- BF-N3 Play it Back: Aurora drain -10/tick; Aurora Finale 20% double (x1.2) (2026-09-22, fine)
- BF-N4 Starstruck: role-keyed proc heal on manual carol targets 10 s; chance/amount/rates TEST (2026-09-22, fine). Minstrel class features complete 8/8.

## MINSTREL FEATS (2026-09-22). Arpeggio confirmed a held 1 s-tick channel.
- BF-N5 Crescendo (T1a): Arpeggio ramps +50 per 3 s held to 400 (hold feat) (2026-09-22, fine)
- BF-N6 Diminuendo (T1b): Arpeggio starts 500, -50/s to 250 (Fortissimo 200 -> 100), resets 5 s after stopping (tap feat) (2026-09-22, fine)
- BF-N7 Art of War (T2a): Fleche 3rd hit 390 primary + 15 ft splash for 40 Performance; 3 stacks -> next Dancing Lights 1,400 primary + 20 ft splash (~every cast) (2026-09-22, fine)
- BF-N8 Rhapsody at Arms (T2b): +1% dmg / -1% taken per active song; NEW shared Class-tab input `songsActive` 0-4 (Minstrel default 4, Songblade 2) - n00b: the sim must be told how many songs are usually active (2026-09-22, n00b ruling)
- BF-N9 Vamp (T3a): 20% per song -> Delayed Play keeps the stored song 20 s - displayOnly (2026-09-22, fine)
- BF-N10 Sudden Muse (T3b): 10% per 3 s (ICD 20 s, ~every 30 s) -> one of three next-cast muses (heal x1.25 / carol duration x2 / free elemental song); even odds assumed (2026-09-22, fine)

## CORRECTION 2026-09-22 (n00b): shared powers can DIFFER per paragon and each item is reviewed individually. Rejuvenating Carol on the MINSTREL = cost 150 / heal 200 (Songblade copy stays 100 / 100). Every shared Bard item stamped from one screen is being re-checked against its second-paragon screenshot one per turn; the Barbarian Sentinel-side pass on shared powers (promised at BS-1) is still owed.
- RC-1 Blaze Flamenco (Minstrel copy): 36 s not 72, flat +2% party dmg (no magical bonus), does not cancel songs; rest identical (2026-09-22, fine)
- RC-2 Rejuvenating Carol (Minstrel copy): 150 cost, 200 PER TICK (n00b), 30 s, radius 80 ft, no cancel (Songblade: 100 / 100 per tick / 60 s / Self / cancels); tick interval still to test (2026-09-22, n00b ruling)
- RC-3 Fleche (Minstrel screen): IDENTICAL to the Songblade - sharedIdentical (2026-09-24, fine)

