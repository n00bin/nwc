# OPT-READ-1: what the optimizer cannot read (audit, 2026-10-13)

Why: every class power was tagged (POWER-TAGS-2) so the fight simulator and optimizer read real effects instead of
guessing. n00b: "we need to continue improvements for the optimizer to read" and "we tagged all powers we skipped
none of them". This audit lists, per data file, which fields the engine / optimizer actually consume and which
effects exist only as words. It ORDERS the tagging pass; it does not filter it: every entry in every group gets
reviewed and tagged (screenshots are the truth), including entries that are already numeric.

Read-only. Nothing was changed. Three data-auditor agents, one group each.

---

## Group 1: mounts (combat powers, equip powers, insignia bonuses, collars, insignias)

Scope: 321 records in 5 files. All engine code for these is inline in `website/toon-forge.html`; optimizer curation
in `js/optimizer-local.js`. Combat-power classification partly rests on a keyword scan of `notes` (counts +/- 3).

### How each file is consumed

**mount_combat_powers** (`MOUNT_COMBAT_POWERS_DATA`). Read: `magnitude` (one hit, burst capped at 6% of DPS; the
`hit` record in `pt2MountCallFx`), `rechargeTimeSeconds` (uptime), `equipBonuses[]` only in these shapes:
`scope:"enemy"` with stat exactly "Enemy Dmg Taken" or "Dmg Debuff" (larger amount, treated as damage-TAKEN
amplifier), `scope:"self"` numeric amounts (DPS path credits only Base Damage Boost, Power, Combat Advantage,
Critical Strike, Critical Severity, Accuracy, capped; tank path reads only Max HP), `procHeal`. Duration is a
hard-coded 10 s for every power. `item_level` / `anchorRarity` / `stackingBuff` only scale rarity.
Never read: `roleMap`, any `scope:"party"` entry, enemy debuffs other than the two names above (Deflect, Crit
Strike, Accuracy, CA, Defense, Crit Avoidance, Dmg Bonus), self stats outside the DPS list, everything in `notes`
(stun, root, slow, knockback, pull, shield, DoT totals, stacking). Optimizer `combatPowerScore` (~1352):
`magnitude/50` + `eb.amount*100` where the STAT NAME matches a role regex.

**mount_equip_powers** (`MOUNT_EQUIP_POWERS_DATA`). Read (~15690-15800): `stats[]` (rarity factor, 1.3125 cap),
`combinedRating`, `equipEffect{stat,amount,unit,trigger}`, `stackingBuff{perStack,maxStacks,effectiveStacks,
soloStacks,groupGated,flatPerStack,trigger}` (counted at full stacks; >100 = rating else percent), `partyEffects[]`
(ALLY mounts only), `anchorRarity`. Never read: `cooldownSeconds`, `duration`, trigger chance, heal, `notes`.

**mount_insignia_bonuses** (`MOUNT_INSIGNIA_BONUSES_DATA`). Read (~15900-17010): `equipBonuses` through the gear
pipeline (stat/amount/kind, role, perStack/maxStacks, window{triggerRateKey,seconds}, uptimeOverride, gates
staminaAbove/BelowPct, apAbove/BelowPct, apFullOnly, healthBelowPct, whileDebuffed; procDamage, procHeal,
apProc/cdProc -> AP Gain / Recharge Speed %; `scope:"party"` shown not counted); `stats[]` only without
equipBonuses (and in the optimizer pre-filter + tail scoring); `instanceStats`, `standingActive`, `condition`,
`stackingMode`, `maxStacks`, `exclusiveWith`, `requiredInsignias`, `fxStatus` (timeline vs stays). `effectText` is
read as WORDS in three places (below). `displayOnly` = unread.

**mount_collars**: `ratingStats`, `percentStats`, `combinedRating`, `collarSlot`; `effectText` display-only.
**mount_insignias**: `stats[]`, `combinedRating`, `category` (+20% preferred slot), `tierScaling`. Fully numeric.

### Counts

| File | Total | Structured | Partial | Text-only | Other |
|---|---|---|---|---|---|
| mount_combat_powers | 98 | 22 | 71 | 5 | |
| mount_equip_powers | 56 | 45 | 4 | 7 | |
| mount_insignia_bonuses | 43 | 32 | 3 (party half unread) | 4 | 2 regex-parsed only, 2 no combat value |
| mount_collars | 75 | 60 | 0 | 0 | 15 no combat value (Glory / Gold / RAD) |
| mount_insignias | 49 | 49 | 0 | 0 | Prosperity Gold/Glory % non-combat |

### Combat powers (98)

Structured (22): ids 8, 13, 27, 31, 33, 37, 38, 43, 47, 48, 60, 62, 64, 66, 67, 71, 77, 81, 84, 85, 90, 94.

Text-only (5, nothing consumed): 18 Hamsphere (party shield 20% MaxHP, +45% move); 59 Aureal Armament (shield,
Radiant Weapon 3 stacks); 86 Protector's Hand (30% HP shield; -7.5% incoming stored, unread); 88 Stabby Stabs
(shield, +7.8% Defense, thorns); 97 Bolstering Cry (party +19.7% MaxHP, +13.1% Recharge, both stored, unread).

Partial (71), unread part:
- 3, 78: `roleMap` (DPS BDB / Tank DR / Healer OH) never read; only magnitude counts.
- 21: Incoming -15% and Outgoing Healing +15% unread. 16: +30% Power/Crit Sev, -15% Def/Awareness at 20 stacks,
  text only. 14: party +9.8% CA/Defense 15 s unread. 91, 92: party CA / party BDB unread. 17: allies +5% CA aura,
  stun. 41, 42: ally Accuracy/CA share. 24: allies +15% Recharge aura.
- 2, 4, 20, 25, 36, 61, 64: carry ONLY "Dmg Debuff" (enemy OUTGOING damage), credited as damage-taken amp (see
  concern 1).
- 6, 40, 51: enemy Deflect / Crit Strike / Accuracy debuffs, slow. 26, 73, 75: enemy Accuracy / Crit Avoidance
  debuff, stun. 29: enemy Defense/Crit Avoidance. 35, 98: enemy Crit Strike / CA debuff, slow. 80: crit-avoid.
- 72: vs Devils/Demons +100 magnitude. 87 Hell's Impact: "Incoming damage +14.8%" has NO equipBonuses (notes
  only); DoT 151. 22, 35, 96: DoT / pool magnitude (460, 459). 5, 15, 30, 49, 46, 68: DoT totals (460, 345,
  1725, 1725, 920, 920) text only.
- 11: allies' CA, +6% HP read for tank only; knockdown. 7, 56, 74, 46, 68: slow 60%. 12, 17, 26, 34, 45, 65, 76,
  95, 10, 9, 54, 55: stun / root / knockdown / control-immune extra magnitude. 19: dodge, invulnerability 1 s.
  39: treasure stat pickup. 44, 52, 57, 58, 63, 82, 89, 93, 53, 23, 1, 36: knockback / pull / daze. 32: heal read
  via procHeal, 20% scaling flagged "assumed". 69, 79: Movement / AP Gain / Forte unread. 70: ok.
- File-wide: duration hard-coded 10 s (15 s party buffs id 14, 12 s Lolth stacks, 3-6 s CC); recharge 60 s on all
  98 rows (effectively unaudited); 93, 94, 95 "assumed 60s (not in source - verify)".

### Equip powers (56)

Text-only (7; effect only in `notes`, `cooldownSeconds` unread): 17 Celestial Luck (Daily use +9,000 Crit Strike
10 s); 51 The High Ground (Encounter 40% for +19,688 CA 8 s); 56 Seeing Red (Encounter 40% for +13,125 Accuracy
8 s); 25 Reptilian Skin (when struck +2,700 Crit Avoid +300 Power); 44 Rejuvenation (Daily use heals 12% HP over
10 s); 2 Opportunism (artifact use -12% all cooldowns); 28 Avian Aura (`stats` empty; Forte 4,500 / Power 1,600
live only in `partyEffects`, so the WEARER gets only the Combined Rating).
Partial (4): 27 Providence (6%/7.9% MaxHP heal-on-struck unread; damage stacks read); 32 Quick Action (AP trigger,
20 s cd, 10 s duration unread; "percentTotal" routed as flat percent); 45 Ferocity (struck chance + ICD unread);
50 Reactive Agility (2 s duration + 1 s ICD unread; counted at full 3 stacks flat).

### Insignia bonuses (43)

Already largely tagged with gear-style `equipBonuses` + `fxStatus` (2026-09-09 sweep). Gaps: 7 Warlord's
Motivation (companion +12% damage, displayOnly); 34 Warlord's Inspiration (+8%, displayOnly); 4 Enchanter's Hex
(+50 magnitude on control hit, displayOnly); 35 Combatant's Maneuver (2,500 CA 10 s on control, displayOnly);
19 Cavalry's Alarm and 25 Cavalry's Warning (3,000 / 2,000 all ratings 20 s: `equipBonuses: []`, regex-parsed from
effectText); 8 Ally's Resilience (party 0.25%/stack Def+Deflect, shown not counted); 24 Shepherd's Devotion
(teammates' Defense +1,500 / Move +10% unread); 30 Magistrate's Patience (teammates +2,500 Defense unread);
22, 26 loot only (correctly display-only). Minor: 39 Slayer's Bloodlust "max 5 stacks" not encoded; 20
Survivalist's resurrection-sickness drawback text only; 29 Berserker's Rage `stats` lists only Deflect (harmless).

### Collars and insignias
Fully numeric. Sturdy collars (At Will / Encounter / Daily Dmg Bonus) route to damage buckets via
`DAMAGE_BUCKET_MAP`; the comment in `toon-forge-stats.js:102` ("Wire when damage-output layer exists") is stale.

### Word matching found (INS-TAGS-1 and siblings)
1. `bonusIsDps(b)` (optimizer ~1558) builds the curated insignia-bonus pool: `stats[]` positive role stat admits;
   `equipBonuses` with ANY `procDamage`, `apProc` or `cdProc` admits for EVERY role (how Tactician's Precision
   enters a healer pool); stat-less bonuses by regex on `effectText`: dps /Critical Strike|Critical Severity|Combat
   Advantage|\bAccuracy\b|Armor Penetration|Outgoing Damage|more damage|\bgain\b[^.]*\bPower\b/i; heal
   /Outgoing Healing|(?<!Incoming )Healing|Power|Critical|Forte|Class Resource|Divinity|Performance|Soul.?Weave|
   Soul.?Spark|Resource Regen/i; tank /Defense|Awareness|Deflect|Critical Avoidance|Hit Points|Incoming Healing/i.
   The bare `Power` in the heal regex matches "Daily power", "Encounter powers", "Artifact power", "Mount Combat
   Power", so every trigger-wording bonus leaks into the healer pool. procHeal bonuses are not admitted via the
   equipBonuses branch. Tail scoring (~1604) reads `stats[]` only.
2. `exclusiveWith` winner picked by /overwrites/i in `effectText` (~15944).
3. Cavalry's Alarm/Warning value regex-parsed from effectText, gated on /mount combat power/ (~16050).
4. `conditionalDamageUptime` (~13333) regex-tests `eb.effectText || eb.description || eb.name` (gear path shared).
5. Combat / equip power optimizer scoring keys on stat NAMES, not text.

### Top 10 by player impact
1. Equip 17 Celestial Luck, 51 The High Ground, 56 Seeing Red: big DPS procs, 100% invisible.
2. Equip 28 Avian Aura: wearer gets neither Forte 4,500 nor Power 1,600.
3. Combat 3 / 78 Pegasus Inspiration: role-conditional buff never read; healers/tanks get nothing.
4. Combat 16 Lolth's Gift: +30% Power/Crit Sev at 20 stacks only in notes.
5. Combat debuffs beyond damage-taken (6, 40, 51, 98, 73, 26, 75, 29, 35, 80) unread; party buffs (14, 91, 92,
   97, 17, 41/42, 24) ignored even with assumeSupportParty.
6. Combat "Dmg Debuff" misuse (concern 1).
7. Insignia 7 / 34 Warlord's: companion damage unchoosable (`Companion Damage` stat silenced in toon-forge-stats).
8. Insignia 19 / 25 Cavalry's: value exists only as regex; healer pre-filter leaks them in.
9. Equip 27 Providence heal, 44 Rejuvenation, 25 Reptilian Skin, 2 Opportunism: survivability/cooldown text only.
10. Insignia 4 Enchanter's Hex, 35 Combatant's Maneuver displayOnly; DoT totals on combat powers notes only.

### Concerns found en route
1. Combat powers 2, 4, 20, 25, 36, 61, 64 carry only "Dmg Debuff" (enemy OUTGOING damage -15%, defensive) but
   `toon-forge.html` ~13052 and `pt2MountCallFx` credit it as damage-TAKEN amplification for the player's DPS.
   Where both lines exist (1, 10, 28, 91, 98) the "take the larger, never sum" rule drops one real effect. Split
   into `Damage Taken` and `Damage Dealt` debuffs. Modeling error, not a data typo.
2. 87 Hell's Impact: "Incoming Damage +14.8%" notes-only; 7, 56, 74 notes-only slow.
3. Equip 28 Avian Aura (above).
4. U+FFFD encoding artefacts in notes: combat 16, 37, name of 49 ("Hell on Faer?n", user-visible), insignia bonus
   15 condition, equip 6, 14, 33-40 notes, mount_insignias notes.

### Proposed tag shape (reuse the POWER-TAGS-2 `fx` vocabulary)
`build-data.py` already validates `fx` for classes.json (kinds hit/dot/buff/debuff/stack/resource/cooldown/proc/
control/heal/shield/mod/echo; `when{on,from,chance,icdSeconds,every}`, `seconds`, `role`, `appliesTo`, `scope`,
`gate`, `provisional`, `note`).
- Add `fx: [...]` to every combat power and equip power; extend the validator to both files.
- Combat power: one record per effect with its own `seconds` (removes the global 10 s): hit, dot, control, buff
  (scope party), debuff with `"Damage Taken"` / `"Damage Dealt"` / other stats, stacking buff (maxStacks),
  roleMap as one buff per role, shield / heal with pctMaxHp.
- Equip power: triggered effects get `when` (e.g. Celestial Luck `when:{on:"cast",from:{type:["daily"]},
  icdSeconds:30}`; High Ground chance 0.4; Reptilian Skin `on:"takeHit"`; Opportunism `kind:"cooldown"`;
  Rejuvenation `kind:"heal"`); Avian Aura self stats into `stats[]`. `from.type` needs "artifact" and
  "mountpower" added.
- Insignia bonuses: keep `equipBonuses` + `fxStatus`; fill Warlord's (scope companion, needs a reader),
  Enchanter's Hex (procDamage on control), Combatant's Maneuver (CA window on control), Cavalry's pair (window
  triggerRateKey mountpower, drop the regex), party halves need an engine switch; add a `roles` tag per bonus so
  the pre-filter stops word-matching.
- Collars / insignias: nothing needed (optionally `displayOnly` on Glory / Gold / RAD).

---

## Group 2: companions and artifacts

Scope: companion_powers (270), companion_enhancements (31), companion_gear (221), companions.json summonedBuff (43
of 273), artifacts (156). Consumers: toon-forge.html (stat panel, sim set-up, scorers) and toon-forge-rotation.js
(fight sim, fed through toon-forge.html). optimizer-local.js does no scoring of its own on these fields (it sends
`procEffect.effect` text to the AI review only). toon-forge-engine.js never touches these globals.

### How each file is consumed

**companion_powers** (~16530-16700, ~13642, ~14262). Read: `stats[]` (percent channel; Maximum Hit Points flat;
rarity-scaled; only catalog / alias / DAMAGE_BUCKET_MAP names count, others silently dropped), `combinedRating`,
`procEffect.statEffects` with trigger / chance / durationSeconds / cooldownSeconds / maxStacks / scope ("enemy"
skipped; "party" full value, stacks follow the pack toggle; non-passive uptime-weighted from trigger text by
regex for crit / encounter / daily / struck / kill / combat start / hit, anything else 0.3 events/s; the
"Passive + 100% + self + no duration" convention and `standingActive` go to the base panel), `procEffect.procDamage`
+ `effectScaling[magnitudeKey]` (legacy averaged damage, any fxStatus), `procEffect.fx` ONLY when
`fxStatus === "moves"` (sim owns it; active slots only, the summoned companion's proc stays out).
Not read: `procEffect.effect` text, `fxNote`, `zoneConditional`, `zone`, `optimizerRelevant`, `roleConditional`,
`fx` on "stays" / "passive" powers. fxStatus across the 120 powers with a procEffect: moves 29, passive 34, stays 57.

**companion_enhancements** (`enhToBuff` ~15383; summoned slot only). Read: `stats[]` or `stat`/`value`/`type`
(percent or rating channel), `conditional` (flag only, NO uptime / chance / duration weighting), `scope==="enemy"`
(entry skipped), `item_level`. Not read: `procEffect` (trigger, effect, durationSeconds, chance), `tooltip`,
`notes`. The simulator never touches enhancements.

**companion_gear**: ratingStats, percentStats, combinedRating, item_level read; `slot` ignored; equipBonuses /
abilityBonuses empty on all 221. 185 of 221 rows carry "Source from NW Hub, pending in-game screenshot
verification" (ids 37-221): a confidence problem, not a tagging one.

**companions.json**: `summonedBuff` read in three shapes (`effects[]`, `stats{}` positive only, `stat`/`value`);
`effect:"combat_advantage_grant"` and enemy-scope `damageBoost` with `uptime` read by the damage layer (~13015);
`uptime` derates the own summon; party scope needs `assumeSupportParty`; `augment` / `augmentShares`, refs read.
Not read: `condition` / `buff` text, `range`, `noStack`, `cooldownEffects`, `perStack` / `stacksPerUse`, the
companion's own active skills (display-only companion-skills.js).

**artifacts** (~13897, ~14300, ~14392; rotation ~645). Read: ratingStats, percentStats, combinedRating (all 156);
equipBonuses `type:"Set"` only with `stat` + `amount` (ids 97, 146); `callFx` (validated by build-data.py
`validate_callfx`) + `cooldown` for the PRIMARY artifact only, DPS sim only; `callStatus` (A "assumed", L/M
"missing" on the confidence line). Not read: `power`, `debuff`, `callNote` text; callFx in tank / healer
scorers; `abilityBonuses` (empty); secondary / tertiary artifact calls.

### Counts

| File | Total | Structured | Partial | Text-only |
|---|---|---|---|---|
| companion_powers | 270 | 201 | 24 | 45 |
| companion_enhancements | 31 | 6 | 17 | 8 |
| companion_gear | 221 | 221 | 0 | 0 |
| companions summonedBuff | 43 | 33 | 8 | 2 |
| artifacts: equip stats | 156 | 156 | 0 | 0 |
| artifacts: CALL effect | 156 | 30 | 40 | 86 |
| artifacts: set bonuses | 39 sets | 3 usable | 5 text or empty | 24 sets have no record at all |

Powers: the 201 structured include 150 stat-only, 22 simulated procs, flat-HP / always-on / uptime-weighted
stat powers; 232, 242, 270 have non-combat currency lines. Artifact call: structured = W no gap (23) + A (7);
partial = W with callNote gap (23) + L (14) + M (3); text-only = N (36) + D (36) + R (7) + P (7).

### companion_powers partial (24)
38 Death Slaad (poison stacking, 5-stack explosion); 51 Tiger (Movement Speed); 55 Vicious Direwolf (interrupt);
114 Wererat (11% slow); 227 Consume Soul (heal {heal}% max HP); 231 Elminster (arcing chain lightning); 223 Air
Archon (other-Archon quarter bonus); 11 Shadow Demon (112 reflect); 15/16 Phoera (revive trigger at generic rate);
40 Portalhound (Damage Vs Kabal unread); 58 Chicken (attacker damage debuff, big-hit trigger); 79 Honeybadger
(HP<20% gate approximated); 90 Igneous Skin (+10% AoE); 95 Spiteful Presence ({necro}% necrotic); 126 Repentant
Cultist (>50% HP gate, dragon doubling); 174 Spiteful Hex (100 AoE hit, enemy +4.5% taken); 243 Hollyphant (3.8%
max-HP heal, Heal Percent); 269 Wind of Nature (12.5% max-HP heal, 50%); 21 Manticore (knockdown); 32 Cockatrice
(root); 237 Cunning Hunter (roleConditional stat); 54 Compy (doubled in Chult); 110 Vallenhas (+11.3% vs devils).

### companion_powers text-only (45)
2 Effulgent Epuration (shield 10% HP below 50%); 14, 78 Pseudodragon / Greenscale (stamina on at-will); 25 Galeb
Duhr (Stamina Restore); 20 Celestial Lion (radiant damage-add stacks); 12 Rustmonster (enemy Crit Sev -3.8% x3);
52 Crab (root, deflect reduction); 163 Elemental Cultist (enemy Accuracy -1.5%); 212 Jagged Blade (enemy damage
taken); 31 Baby Bulette (heal over 5 s); 69 Pig (heal 1.5%/s while controlled); 75 Ox Stot (stun 3 s); 92
Vampire's Kiss (3.8% HP on encounter); 93 Elaina's Riposte (heal + damage); 94 Little Adventurer (stun, threat
-90%); 115 Chickenmancer (polymorph); 141 Doom and Bloom (daily heal % HP); 169 Wayward Wisdom (7% slow); 176
Intelligent and Wise (reflect, heal/shield); 179 Abyssal Guidance (chicken on kill); 184, 185 Fiendish Charmer
(daze 3 s; possible duplicate); 193 Lillend's Insight (party heal 37.5% max HP); 196 Angel's Insight (shield 5%
on revive); 214 Astral Deva (heal self + companion); 259 Celeste's Wisdom (heal below 50%); 264 Dreadwarrior (+15%
threat); 267 Blacksmith (reflect up to 50k); 263 Dungeon Master's Wisdom (+2.4 all attributes); 81 Panther
(At Will vs Rooted); 96 Dragon's Bane (vs Dragons +5.6%); 106 Mageslayer's Assault (vs Kabal minions); 116
Slyblade Kobold (Encounter vs Disabled); 195 Delusional Insight (At Will vs Disabled); 159 Netherese Warlock (vs
not-facing); 43 Yeth Hound (vs Gyrion); 119 Cold Iron Warrior (vs Fey); 252 Fire Eye (vs Kabal); 98 Eladrin's
Senses (DR vs Fey/Trolls); 10, 102, 103, 143, 178 drop rates (non-combat); 224 Black Ice (non-combat).
Note: the situational "vs X" / "vs Disabled" powers may stay as a gated entry (bosses are control-immune); the
build-conditions registry already carries that kind of gate.

### companion_enhancements
Partial (17; value read as a flat conditional, trigger / 15 s duration / chance NOT read, no uptime weighting;
the "and your companion's X" half unread on 3, 11, 12, 14, 29, 30 ...): ids 2, 3, 4, 5, 7, 8, 11, 12, 14, 15,
20, 22, 23, 26, 29, 30, 31. Text-only (8): enemy debuffs skipped entirely 9 Vulnerability (Crit Avoid), 10
Blurred Vision (Accuracy), 13 Dulled Senses (Awareness), 17 Armor Break (Defense), 18 Weapon Break (Crit Sev),
19 Slowed Reactions (Deflect), 27 Precision Breaker (Crit Strike); 16 Redemption is a 9% max-HP heal-over-time
stored as stat "Maximum Hit Points" 9 percent conditional = MISREAD as +9% Max HP. Structured (6): 1, 6, 21, 24,
25, 28.

### companions.json summonedBuff
Partial: 96 Blaspheme Assassin (see concern); 98 Minsc, 105 Tutor, 251 Portobello (full-party / within-X-ft
conditions ignored); 152 Priestess (-100 enemy Crit Chance unread); 250 Stalwart Golden Lion (Radiant Weapon
stacks, ally intercept -10%); 272 Encore (heals, enemy +2.5% incoming, -5% outgoing); 273 Wormungandr (enemy
+0.5% incoming). Text-only: 175 Lysaera (negative values skipped), 256 Riotous Rothe ("Damage Reduction" not a
stat).

### artifacts, call effect
Text-only (86): D damage-only, no magnitude stored (36): 16, 30, 32, 33, 35-38, 40, 42-47, 49-51, 53-55, 57, 85,
86, 92, 94, 99, 100, 110, 123, 126-128, 133, 139, 140. N defensive / utility (36): 12, 14, 21-25, 28, 29, 31, 41,
48, 52, 56, 69, 73, 74, 84, 87, 90, 91, 93, 102, 104, 107, 112, 119, 122, 125, 132, 135, 141-145 (shields,
heals, resurrects, damage reduction, enemy damage-down: unread by every scorer). R random (7): 8, 19, 39, 68,
109, 134, 137. P passive attached to the artifact, not modelled (7): 58, 77, 79, 80, 81, 83, 89.
Partial (40): L duration missing (14): 59, 61, 64, 78, 98, 147-151, 153-156 (Mythallar Fragment = 5 rows, one
duration fixes five); M amount missing (3): 18 Sigil of the Barbarian, 88 Beacon of Simril, 113 Globe of the
Third Eye; W with a callNote gap (23): ally defensive stats, enemy slows / poison, Awareness part, flat damage
numbers (Demon Skull 31,271, Spelljammer 53,635), Wildspace/Underdark doubling, Pirates' Skyhold boost.

### artifacts, set bonuses
24 of 39 set names have NO record anywhere (artifacts.json or gear.json): Heart of the Dragons (5 artifacts),
Storyteller's Journals (4), Apocalypse, Apprentices' Spoils, Armaments of Construct Demise, Armaments of the
Wyvern, Attuned Eye of Odran, Beyond Death, Dark Remnant, Diamond, Enchanted Thumb, Imperial, Lathander, Mad
Dash, Redeemed, Reflective Armaments, Ruthless Domination, Seldarine, Set of the Dead, Set of the Serpent, Set of
the Skull Lord, Soulmonger, Star, Valhalla's Rebuke. Empty Set records: 107 Crimson Retaliation, 120 Unstable
Drive, 129 Malignant Energy. Text only: 12 Tiamat Set (+5% OH and IH, structurable), 39 Vistani 3pc. Structured:
97, 146. Caveat: matched by `setName` on gear equipBonuses + text search; docs/ screenshots not checked.

### Top 10 by impact (by what the scorers get wrong; no meta ranking in these files)
1. Artifact D calls (36): pure-damage artifacts (Symbols, Sword of Zariel, Kessell's Spheres, Arma-Egg-On) count
   zero in the sim. Needs an in-game number = screenshot job.
2. Artifact L / M calls (17): one missing number each; Mythallar x5 and Burning Hope x5 cheapest.
3. Artifact P passives (7) + Dragon's Mark family: on-use / on-encounter stat buffs, same shape as gear fx.
4. Artifact sets with no record (24 of 39).
5. Companion enhancements (24 of 31 with a proc): 17 flat conditionals with no chance / duration; 7 enemy
   debuffs ignored; Redemption misread.
6. Healer / tank companion powers: heals and shields text-only (193, 141, 92, 259, 214, 269, 243, 2, 196, 31,
   69, 176, 267); the gear heal-proc layer (`eb.procHeal` ~13671) exists but companion powers never feed it.
7. DPS damage-add companion powers: 20, 95, 93, 227, 174, 90, 38, 231.
8. Companion enemy-debuff powers 12, 52, 58, 163, 212 + summonedBuff 96, 152, 272, 273. First confirm the sim
   models any enemy-stat debuff other than "Damage Taken".
9. Artifact N group (36) for tank / healer scoring: `callFx` reader is DPS-only (consumer change + data).
10. Unread stat names (12 powers): Damage Vs Kabal / Gyrion / Dragons / Fey / Not Facing; At Will Vs Rooted /
    Vs Disabled; Encounter Vs Disabled; At Will Power; Damage Resistance; Damage Taken Reduction; Stamina
    Restore; Heal Percent. Powers 24, 79, 90, 243 store damage reduction as Defense (wrong stat). 263 +2.4 all
    attributes unread.

### Proposed tag shape
No new vocabulary for most of it (`validate_proc_fx` allows heal, shield, control, debuff, buff, resource, hit,
dot). Companion powers: add `fx[]` + `fxStatus` to the 91 procEffect powers lacking it, e.g. `{kind:"proc",
when:{on:"takeHit",chance:50,icdSeconds:30}, effects:[{kind:"heal",pctMaxHp:12.5,scope:"self"}]}`; missing
FX_EVENTS (revived, controlled, run, receiving healing, HP below X) added deliberately or left "stays" with a
note; tank / healer scorers must read heal / shield fx (or reuse gear's `procHeal` as `procEffect.procHeal`);
debuffs as `kind:"debuff"` + a consumer; "Damage Vs X" via a catalog bucket or a `conditionId` gate;
`roleConditional` needs a reader (`eb.role`-style gate). Enhancements: copy the companion-power shape
(`statEffects` + durationSeconds + chance + fxStatus, the existing power path then uptime-weights them for
free); enemy debuffs as fx; mark the "and your companion's X" half; Redemption -> fx heal 9% over 5 s, stat
removed. Artifacts: P -> `equipBonuses[]` with fx (like gear), D -> `hit` records (magnitude, targets,
damageType; `missing` / `provisional` until measured), L/M -> fill seconds / amount, N -> heal / shield / buff
records + a tank / healer `callFx` reader; sets -> `type:"Set"` equipBonuses (stat, amount, setName, pieces,
fx for 3pc procs), fill the 3 empties, structure Tiamat, add the 24 missing after screenshots.

### Data concerns found en route (not fixed)
- companion_enhancements 3 Master of Craft: stat Forte, tooltip Forte, procEffect text says Critical Avoidance.
- companion_powers 243 Hollyphant: stat Damage Resistance 1.875 / text 1.9% / statEffects Defense 3.8 (mismatch).
- companions 96 Blaspheme Assassin: enemy-scope `effects[]` (Deflect -2, Enemy Dmg Taken +1); own-summon code
  (~15310-15335) tests party/mixed only, so it may land on the player's own sheet. 256 same shape.
- artifacts 113 Globe of the Third Eye: "Effect details unknown ? needs verification" (U+FFFD); 108 notes too.
- artifacts 32: Gold Bonus stored as a rating. companion_powers 184/185 same name + text (possible duplicate).

### Clean
Every `powerRef` resolves; companion_gear stat names all recognised; all callFx pass `validate_callfx`; flat-HP
powers and Pack powers (49, 241) fully consumed per CLAUDE.md.

## Group 3: overloads, buffs, enchants, boons, feats, kits, races, gear bonuses

Strict grading: a number no consumer reads is unread (exception: proc chance / duration / cooldown that the
uptime model re-reads from the item's own text count as read). All stat flow runs through `buildEngineCharacter()`
in toon-forge.html then toon-forge-engine.js; the optimizer scores through the same engine, so the engine's blind
spots are the optimizer's.

### Headline vs the old census (docs/audit/structured_coverage.md)
The census counts a surface "blind" only with no stat+amount at all (335 gear, 24 buffs, 6 guild boons, 3
campaign boons, 1 overload, 0 enchants). Strictly: all 16 Combat enchants + the Companion enchant are PARTIAL
(every proc, shield, DoT, debuff is words); overloads 11 blind (all 10 Slayer overloads: nothing reads
`damagePct` / `enemyType`); 122 gear rows whose set bonus lives only in the legacy top-level `setBonus` string
(rendered, never scored); gear rows with an effect still text-only = 481 excluding deliberate `displayOnly`
(99 at IL 1400+, 23 at IL 3000+), 670 including displayOnly and party-scope.

### How each file is consumed
- **gear.json equipBonuses** (`ingestEquipBonuses` ~16183): an entry counts only with `stat` + `amount` and self
  scope. Read: kind, alwaysActive, uptimeWeighted, uptimeOverride, uptimeClass, window, procModel, perStack /
  maxStacks / perEnemy / perTeammate, ramp, role, zones / zonesExclude, gates targetRange*, ap*, stamina*,
  health*, missingHealthMaxAtPct, movingOnly, standingOnly, min/maxEnemies, requiresMultiEnemy, vsRanged/Melee/
  ShieldedOnly, whileDebuffed, conditionId, soloOnly, partyOnly, enemyHealth*, apProc / cdProc. Simulator only:
  procHeal, procDamage, fx + fxStatus "moves" (collected by `pt2ProcOwners()` ~14258: gear, overloads, active
  companions only). From text: uptime heuristics (chance, "for N seconds", cooldown), health-gate regex,
  `computeSequenceProcBoost` (~12908, "after a Daily, next Encounter +X%"). NOT read: effects,
  effects_per_stack, roleEffects (26), roleMap, stacking, proc objects, condition, note(s), effectText (except
  uptime heuristic), displayOnly, modeled; party-scope stat entries (47) skipped; legacy `setBonus` string
  display only (~18290, ~19002).
- **overloads.json**: ratingStats / percentStats; equipBonuses via a separate loop (~16947) with the same gates;
  fx via pt2ProcOwners. `damagePct` / `enemyType` display only (~7773).
- **enchants.json** (`pushEnchant` ~16836): universal, ratingStats, percentStats, combinedRating, per-rank
  `rarities`; Combat enchants' equipBonuses read for ONE thing: `alwaysActive` (base panel vs full-stack
  conditional). Never read: description, notes, stacking, enemy / party scope entries, anything with fx.
  Companion enchant: `rarityLadder.augmentBonusPerStat` read (~16771); `companionDamagePct` display only
  ("Companion Damage" silenced in toon-forge-stats.js). enchants.json is not in `validate_proc_fx`; pt2ProcOwners
  does not walk it.
- **buffs.json**: ratingStats, percentStats, abilityBonuses read (~15406, ~11975); damagePct, enemyType, levels,
  duration_s, expiration, scope, notes display / UI-filter only. `enemyType` does not gate percentStats, so
  "vs Dragons" resists count all the time (91, 98, 144, 150).
- **campaign_boons.json**: tiers `stat` x `perPoint` x points; `enemyFamily` boons skipped on purpose (engine
  ~372); masters `perRankEffects` type percent with a real stat + non-enemy scope, uptime-scaled from trigger /
  chance / duration (`masterBoonUptime`); `heal_pct_max_hp` (ally / party) feeds the healer heal layer only;
  `magnitude`, `heal_pct_damage`, `damage_taken`, Stamina, Control Resist (silenced), `type:"flat"` unscored.
- **guild_boons.json**: statType / stat / amount / perRank; `statType:"effect"` and `modeled:false` do nothing.
- **general_feats.json**: only `type:"skill"` rows shown (~19757); nothing scored.
- **races.json**: fixedBonuses, choiceBonuses, traits[].percentStats / ratingStats (engine ~350);
  `conditional:true` uptime-scaled from description; traits[].effects and description not read.
- **kits.json**: ratingStats / percentStats; nothing else exists.

### Counts (strict)
| file | total | structured | partial | text-only |
|---|---|---|---|---|
| kits | 44 | 44 | 0 | 0 |
| enchants | 47 | 30 (25 Universal gems, 5 Bonus) | 17 (16 Combat, 1 Companion) | 0 |
| overloads | 50 | 39 | 0 | 11 |
| buffs | 123 | 85 | 12 | 26 |
| campaign boons tiers | 34 | 27 | 0 | 7 (4 enemy-family, 3 potion-only) |
| campaign boons masters | 8 | 3 | 3 | 2 |
| guild boons | 21 | 12 | 0 | 9 |
| general feats | 3 | 0 | 0 | 3 (one a dead duplicate of a Drow racial) |
| races traits (15 races) | 32 | 20 | 0 | 12 |

Gear entries (9,590 equipBonuses across 5,932 of 6,743 rows): 6,202 stat+amount (6,155 credited, 47 party-scope
skipped); 147 simulator-only (procHeal / procDamage / fx); 2,704 set markers whose set has a structured carrier.
TEXT-ONLY: 323 set markers in 17 families with no structured piece (321 rows); 14 plain Equip entries (10
covered by the sequence-proc parser); 26 entries with effects / effects_per_stack / roleEffects (Masterwork
VI/VII party aura, Watcher stacking, Brute's Expertise role map); 174 owner-flagged displayOnly (162 rows;
threat, stealth, control, pets, gold - deliberate); 122 legacy setBonus-only rows (30 families). PARTIAL: ~87
distinct bonus texts on 156 rows carry a rider the engine cannot see; ally / party grants 39 texts / 61 rows
(wearer half credited, ally half not); ~10 confirmed heal / damage riders (Sanguine Strike, Retaliatory
Shockwave); ~40 set families with real unread riders (heuristic flagged 72 of 128).

### Enchants (all 17 partial; stat line credited)
27 Cursed Burn (fire DoT, 10% explosion); 28 Poisoned Thorn (delayed 30-mag poison, 12% slow); 29 Battle
Tempered (1% MaxHP shield per attack x20); 30 Fortified Nature (on-hit Def/Awr/Deflect stacks, 6% heal); 31
Flash Freeze (20% slow + outgoing-damage debuff); 32 Lightning Flash (crit proc 18-mag per 10 s); 33 Refulgent
Fortification (ally +18% speed, -6% damage); 34 Living Hex (reflect 1.8% to five targets); 35 Wild Card (+1.2%
damage per enemy faced); 36 Divine Aegis (heal shield stacks self + target); 38 Swift Synergy (solo 6 vs party
12 stacks; full party value always taken); 39 Radiant Sanctuary (40% ally buff +5% damage, +6% IH; enemy
debuff); 40 Rime Temper (30% chance, -4.5% enemy damage x3); 45 Fluid Aurora (on-heal +5% Power to you + two
allies); 46 Shattered Resolve (350-mag shockwave at max stacks); 47 Shifting Shards (CA proc stacks; melee
Defense +6%); 37 Celestial Companion (+180% Companion Damage, non-augment).

### Overloads text-only (11)
4, 5, 10, 14, 15, 19, 20, 21, 46 (damage vs enemy type, damagePct 8-10%); 17 (companion-only +25% vs Orc); 43
Pirates' Skyhold Tracker (3% lifesteal).

### Buffs
Text-only (26): Battle Belt damage procs 95, 96, 97, 139; horns / bells 101 (Temp HP burst), 102 (+4,000 Power
and 32% AP), 105, 106, 107; heals / utility 84, 87, 88, 100, 110, 113-118; random-roll 94, 104; vs Dragons 51,
151; other 78 (stat unknown), 149 (gold). Partial (12): 60 (+2.5k core stats and AP gain unread); 92 (+1% vs
Drow, random stat); 93 (chosen secondary stat, 7 levels); 103 (-5 s cooldown); 98, 144, 150 (+91) vs-Dragon
damage unread while the resist is over-credited ungated; 86, 109 heal / Temp HP stored as "+X% Max HP"
(mis-modeled); 72, 85 per-3s resource ticks stored as flat regen %.

### Campaign boons
Masters: 5 Life Lessons text-only (magnitude hits, heal-from-damage); 6 Enhanced Application text-only (self
heals, next-hit -10% per rank); 2 Death's Bulwark partial (Temp HP); 3 Blood Lust partial (120+10/rank extra
attack); 8 Blessed Resilience partial (stamina heal). Tiers: 6 Cultist Power, 11 Demonic Mastery, 18 Dino Power,
25 Necrotic Mastery skipped on purpose (damage / resist vs family unread); 13, 20, 27 potions only.

### Guild boons, feats, races
Guild: 16, 17, 18 Enhance Overload (Slayer / Ward / Companion +1-10%); 14, 22 potion strength; 15 revive
sickness; 13 mount speed; 20, 21 gold / glory. General feats: Vengeful Blades (5% chance, 100 magnitude on being
hit) and Faerie Fire text only; Honed Defenses a dead duplicate of the Drow trait. Races: Darkfire, Faerie Fire,
Infernal Wrath (10% chance, attacker -5% damage 5 s), Wild Step, Trance x2, Decentralized Mind (no number)
unscored; Stand Your Ground, Swift Charge, Heroic Effort, Draconic Heritage have EMPTY descriptions; Dilettante
(+2 ability by class) not read.

### Gear text-only
17 set families with no structured piece (rows / max IL): Crimson Retaliation 2 / 4050 (stacks on damage-boost
artifact power); Clothing: Soul Harvest 6 / 3150 (empty text); Astral Absorption 5 / 2250 (below-75% HP drain
explosion); Burning Heart 72 / 600 (25% AP refund on Daily); Drowned Heart 69 / 600 (50% MaxHP heal when struck);
Chultan 69 / 800 (random stat +2000 10 s); Relic 23 / 645 (zone-only, -10% from Giants); Drowcraft 49 / 588
(-10% from Demons, Madness); Drowcraft Undergarb 2 / 567; Black Ice 6 / 512; Soulmonger 2 / 350; Golden Dragon
8 / 300 (placeholder 0); Apocalypse 2 (crit stacks, +1% taken x5); Lostmauth's Hoard 2 / 600; Dagger of
Elemental Fire 2 / 300; Alabaster, Burnished 1 each / 1000 (empty).
122 legacy setBonus-only rows (30 families), top by IL: Focused Radiance 2 / 4050 (+1,500 Power + Crit Avoid to
allies); Finish the Job 2 / 4050 (4% / 10% in Thay Power on kill); Blood Bargain 2 / 3800; Volcanic Jewels 2 /
3200 (threat); Infused Defense 15 / 2400, Infused Recharge 8, Infused Accuracy 8, Infused Healing 8, Infused
Power 8 (one flat stat each, ~54 rows trivially fixed); Ruthless Domination 2 / 2050; Dashing Action 2 / 2000;
Assassin's Luck 2 / 1800; Tentacle Rod 2 / 1800; Mythallar 2 / 1500; 16 more families at IL 588 or lower.
Plain Equip text-only (14 entries / 12 rows): Bloodwoven Medic's Haste, Skirmisher's Zeal, Charged At-Will (IL
3150, queued behind a screenshot; Charged At-Will not matched by the sequence-proc regex); Feywood Club
(power-specific +10%), Feywood Shield (+2,354 Crit Avoid as an artifact-mod line), Stalwartneedle Ring Charging
Bull (threat, not displayOnly); sequence-proc riders unread (Battle Reserves +5% CA 10 s, Vital Onslaught 1% heal).

### Gear partial (meta first)
Healer / support gear IL 4550-5700, ally half unread: Guardian's Impact, Shared Vitality, Critical Harmony,
Graceful Harmony, Healer's Influence, Radiant Guidance, Tactical Insight, Shared Resilience, Radiant Empowerment,
Healing Momentum, Survivors Healing Aura. Retaliatory Shockwave (60-mag proc); Explosive Defense (150 dmg within
25'); Sanguine Strike (5% heal). Set families: Impending Doom 5250 (Unleashed 10-charge mode, tank / healer);
Chilling Flow 5800 (zone speed + per-3s ramp); Soulpiercer Greater 4000 (25' clause); Umbral Stride / Prismatic
Defier / Skyhold Arms / Peer Into the Void (zone Movement Speed); Essence Reap Greater 3800 (10% extra damage);
Abyssal Prowess 3800 (15%, 6 s window); Ghastly Eruption 3800 (300-mag Daily blast); Umbral Convergence 3800
(pull + accuracy debuff); Evolving Form 4050 (13 s doubling); Living Magma 3200; Grand Alliance / Vale /
Fortified Vale (role-stat proc); Lolthian Might 2050; The Dark Maiden 1850; Blaspheme 1900 (7,500 stat 15 s on
dodge); Tiamat's Prized 1800; Rune sets (ground runes for allies); Pioneer / Pilgrim / Tyrant / Duality
(party-size ramps, per-enemy starts).

### Top 10 by impact
1. Celestial Combat enchants: 16 partial, every endgame build slots one or two (Shifting Shards, Shattered
   Resolve, Fluid Aurora, Rime Temper, Radiant Sanctuary, Cursed Burn, Poisoned Thorn, Lightning Flash).
2. Slayer overloads (10) + vs-Dragon buffs: damage vs type scores zero while the Ward twins score fully;
   cheapest high-value fix, no new code (shape 5a).
3. Impending Doom (IL 5250, 96 items): the tank / healer Unleashed charge mode unread.
4. Crimson Retaliation (4050) and Clothing: Soul Harvest (3150): fully unscored.
5. Sequence-proc armour (Scarlet Arcanum, Bloodborne Reaper, Runefrost, Flayed Legion; IL 4100-5400): text
   parsed, riders not; Bloodwoven Charged At-Will not matched.
6. Legacy setBonus rows (122): Focused Radiance, Finish the Job, Blood Bargain, the Infused family.
7. Healer / support gear ally grants (IL 4550-5700): party half of ~39 bonuses unscored.
8. Master boons Life Lessons, Enhanced Application, Death's Bulwark: zero / partial for tank and healer.
9. Battle Belt damage items (Dragonfire, Neverwintan Hawk, Owlbear Figurine, Wondrous Doohicky) and Alliance
   Battle Horn (+4,000 Power / 32% AP): three belt slots, score 0.
10. Thay / Sharandar set procs (3800-4050) + party-scope enchant and guild Enhance Overload effects.

### Proposed tag shape (vocabulary + validator exist; gear and overloads already use them)
`FX_KINDS` in build-data.py: hit, dot, buff, debuff, stack, resource, cooldown, proc, control, heal, shield, mod,
echo; gating `gate:{shape:"toggle"|"perStack"|"linear"|"threshold"|"count"|"dutyCycle", key}`; `validate_proc_fx`
covers gear, overloads, insignias; owner `pt2ProcOwners()`. Note: `conditionKey` on class powers is a label
only - no code reads it; the real gate is `gate`, and gear uses `conditionId` into `BUILD_CONDITIONS`.
a. Slayer overloads + vs-Dragon buffs (no new code): `equipBonuses:[{type:"Equip",scope:"self",stat:"Dmg
   Bonus",amount:8,zones:["vs Giant"]}]` (read by `_zoneSkip` and the Enemy-types checkboxes); same for the
   ungated Dragon Incoming Damage percents and the enemy-family campaign boons.
b. Lifesteal / heals / shields: `fxStatus:"moves"`, `fx:[{kind:"proc",when:{on:"hit",from:{type:[...]},chance,
   icdSeconds},effects:[{kind:"heal",pctOfDamage:3,scope:"self"}]}]`; `kind:"shield"` with pctMaxHp, seconds,
   maxStacks; stacking via `kind:"stack"` + FX_STACKS.
c. Enchant procs: fx + fxStatus "moves" on the existing equipBonuses entry (dot / proc+hit / debuff / reflect /
   gated buff examples in the agent report).
d. Master boons: replace unscored stat names (magnitude, heal_pct_*, damage_taken) with fx records; when /
   chance / icd from the boon's trigger; per-rank via scalesPerRank / unlockRank.
e. Gear: one structured carrier per set-marker family; legacy setBonus rows -> `{type:"Set",setName,pieces,stat,
   amount}`; party halves either credited under "Assume support party" or a `partyShare:true` field; the 26
   effects / effects_per_stack entries -> stat/amount + perStack/maxStacks or fx.
f. Races / general feats: fx for Infernal Wrath, Faerie Fire, Vengeful Blades; fill the 4 empty descriptions.
g. Infrastructure: add enchants, buffs, campaign_boons, races, guild_boons to `validate_proc_fx`; make
   `pt2ProcOwners()` walk enchants, belt buffs, master boons, race; `pushEnchant()` skip fxStatus "moves"
   entries like `ingestEquipBonuses` does via `window.__pt2SimOwnsProcs`.

### Other
Honed Defenses / Faerie Fire rows in general_feats never shown or scored (duplicate races traits). Celestial
Cursed Burn text "+12%" vs stored Base Damage Boost 15 (notes attribute to the 2026-09-10 patch; left).

---

## Batch 1 DONE 2026-10-13: combat enchants (OR-1 = 1, n00b: go)

Patch: scratchpad `or1_enchants.py` (re-runnable). Every combat enchant (16) got an `equipBonuses` entry
`{name, fxStatus:"moves", fx:[...]}` with Celestial tooltip values; the Companion enchant got a
`Companion Damage` 180% entry (no reader yet). Stack names registered in
`docs/plans/effect_vocabulary_resources.json` as "Enchant stack: X" (Fortified Nature, Flash Freeze, Lightning
Charge, Preparation, Rime Temper, Shattered Resolve, Shifting Shards). `build-data.py` now validates
enchants.json (passes). `toon-forge.html`: `pt2ProcOwners()` hands the Combat / Combat 2 enchant records to the
simulator scaled by `enchFxRankScale()` (the enchant's own percentStats ladder, else rank/6); `pushEnchant()`
drops the full-stack conditional stats the simulator now builds from stacks (no double count).

Conventions used (same vocabulary as powers): stacking buffs = `stack` record (on hit / crit / caHit) + a `buff`
gated `perStack` on `stack:Enchant stack: X`; "on receiving damage" = `when.on:"takeHit"` (truthful; the
simulator has no incoming-hit model yet, so Fortified Nature, Flash Freeze, Living Hex, Rime Temper, Shattered
Resolve stay inert until the tank stage adds one); heal-triggered = `when:{on:"cast", from:{tags:{kind:"heal"}}}`
(inert in the damage fight; live for the healer fight model later): Refulgent Fortification, Divine Aegis,
Radiant Sanctuary, Fluid Aurora. Wild Card = buff gated `count` on enemyCount; Shifting Shards melee Defense =
threshold targetRangeFt <= 10.

Check (`ench_ab.js`, Barbarian test build, fight-sim DPS, old frozen copy vs tagged working copy, Celestial):
Poisoned Thorn +8.62%, Wild Card +1.01%, Cursed Burn +0.48%, Shifting Shards +0.37%, Lightning Flash +0.25%,
Swift Synergy -0.41% (fight-built stacks instead of full-stack assumption), all defensive / heal enchants 0.00%
(inert by design), no page errors. Poisoned Thorn's size rests on "Magnitude 30 after 4 s on every power hit"
with no cooldown in the stored text - a screenshot must confirm it.

REVIEWED BY n00b 2026-10-13, one enchant per turn, each against a fresh tooltip screenshot (archived in
docs/calibration/inbox/enchants/2026-10-13_*.png). Rulings: Cursed Burn - the burn STACKS up to 3 (stored text
had dropped it; sim share 0.5% -> 5.2%); Battle Tempered - 0.9% per stack, not 1%; Swift Synergy - 0.9% per
stack confirmed (text said 0.98); Lightning Flash, Wild Card, Shifting Shards - Base Damage Boost +15%
confirmed post-patch; Poisoned Thorn, Fortified Nature, Flash Freeze, Living Hex, Divine Aegis, Radiant
Sanctuary, Rime Temper, Fluid Aurora, Shattered Resolve, Companion enchantment - text matches, tag unchanged.
Still provisional: Refulgent Fortification only (n00b does not own it). Open point: Poisoned Thorn - whether
every power hit queues its own 30-magnitude poison (tagged, literal) or one pending poison is refreshed; the
combat log on a dummy settles it. Stored descriptions replaced with the tooltip wording where they differed.

## Batch 2 BUILT 2026-10-13: overloads + buffs (OR-1 = 1, n00b: go) - awaiting n00b's per-item review

Patch: scratchpad `or1_batch2.py` (re-runnable). Data: the 9 Slayer overloads get `equipBonuses` `Dmg Bonus`
with the Ward twin's `zones:["vs <Type>"]` (Astral Elf, Drow, Giant, Demon, Elemental, Undead, Fiend x2, Spider);
Companion's Mark of the Orc Slayer = scope companion (no reader); Pirates' Skyhold Tracker = fx heal
pctOfDamage 3 on hit (provisional); Dragon Ward gets its party half (shown, not counted). Buffs: vs-Dragon damage
and resistance lines (51, 151, 98, 144, 150, 91) and Spider Totem's vs-Drow line become zone-gated equipBonuses
(the ungated Incoming Damage percentStats removed); belt damage items Doohicky 125 area / Hawk 630 / Owlbear 1000
= fx hit `periodic` every cooldown ("used on cooldown"; Dragonfire has no magnitude in the data: `missing`);
Champions Battle Horn = Temp HP 41,998 for 8 s every 60 s + move speed; Alliance Battle Horn = AP +32% and Power
4,000 for 60 s at combat start (10-min cooldown); Siegebreakers Horn = cooldown -5 s at combat start; Lathander's
Dew / Lliira's Fare = resource ticks (AP / stamina +1% of bar every 3 s, the flat stat lines removed); Red Veins =
heal 1% max HP every 3 s (was +1% Max HP); Minor Potion of Heroism = Temp HP 25% max HP (was +25% MAX HP, a
real tank mis-credit); on-use heals / AP potions / scrolls of life = fx with `when.from.type:"use"` (truthful,
inert: nothing in the fight uses an item by hand); random-roll items, Lliira's bells (companion), injury kits,
Portable Altar, Blue Dragon (gold) = displayOnly with a reason; Awakened Forger's Box and Chain of Scales carry a
reviewNote. Validator: buffs.json added; heal / shield learn `flat`. Consumers (toon-forge.html): buffs'
equipBonuses pass through the same gates as overloads' (second pass after the overload loop; iterates the Set);
`pt2ProcOwners()` hands buff fx to the simulator; `enemyTypeChoices()` scans BUFFS_DATA.
Check (`batch2_ab.js`, Barbarian test build): Drow Slayer 0% without the type, +8.8% with Drow ticked; Scroll of
Dragon Slaying +8.8% with Dragon ticked; Hawk +3.8%, Owlbear +2.4%, Doohicky +0.75% simulated; owners list shows
the belt items; enemy-type checkboxes now offer Astral Elf, Demon, Elemental, Fiend, Giant, Orc, Spider, Undead
as well; no page errors. Review page: https://claude.ai/artifact/7c5vJXWeiSwMFM3Dd4KBE6 (47 changed, 126
unchanged).

Review rulings (n00b, 2026-10-13, one per turn): Astral Elf Slayer ok; Drow Slayer ok; Giant Slayer ok; Lesser
Demon Slayer ok + LEAD: "most lesser have a greater" - the data has Lesser/Greater Fiend Slayer and Ward but only a
LESSER Demon Slayer; Greater variants of the other Slayers / Wards may exist in game. No item is added without a
tooltip screenshot ([[feedback_no_unverified_item_adds]]): ask n00b for captures of each Greater overload he can
find, then add them as rows with the same zone gate.

Batch 2 REVIEWED by n00b 2026-10-13, all 47 changed items one per turn (the 126 unchanged on the review page).
Rulings and corrections from fresh tooltips (archived under docs/calibration/inbox/belt-items|consumables|
overloads): Fiend Slayers + Wards fire on Demon OR Devil OR Fiend; belt damage items are used INSIDE the
artifact call, after the mount power (`when.anchor:"call"` added to the vocabulary + simulator: cadence starts
1 s after the first call window; Hawk +5.3%, Owlbear +4.8%, Doohicky +1.1%); Dragonfire = 150-mag line hit (up
to 7) + 100/s fire for 6 s, 30 s (+6.3%, the strongest belt item); Champion's Battle Horn recharge is 600 s (not
1 min), Alliance Battle Horn = +36% AP REGEN (not a 32% fill) + 4,000 Power 60 s, 600 s; all three horns share
`exclusiveGroup: battlehorn`; Minor Potion of Heroism confirmed (411,506 Temp HP on Lia = ~25% max HP);
Elixir of the Moonmaiden = 11,669 HP / 2 s for 16 s, 18 s, one elixir at a time (old 1,535 x 12 s wrong);
"Potion of Power" row was a different item - it is a ranked Power potion (+100/300/500/1,000 for 1 h, 18 s,
one stat potion at a time): row -> Rank 6, Ranks 1/3/5 added from captures, Ranks 2/4 not added; Potion of
Healing = full ladder of 20 rows (Rank N = 30,000 x N, +1 = 35,000 x N, min level 2N; 11 captured, 9 derived
and marked); Forger's Box = 7-tier ladder (Power 1.2 -> 3.0%, chosen secondary at 2/3 or 2x, 1,800 s, 600 s)
stored like Chain of Scales (choice stat not read yet - builder needs a picker); everything else ok as tagged.
Leads: "most lesser have a greater" (Greater Slayer / Ward variants to capture); the on-use items (potions,
scrolls, Stone of Health, Cured Meat) stay inert until a hand-used-item model exists.
Still need a screenshot: Giant Slayer, Lesser Demon Slayer, Elemental Slayer, Companion's Mark of the Orc
Slayer, Dragon Ward, Pristine Siegebreakers Battle Horn, Elixir of Life, Effervescent Tidespan Potion, the
Wondrous dragons (Black / White / Green / Gold), Scroll of Dragon Slaying / Protection, Perfect Spider Totem,
Lathander's Dew, Lliira's Fare, Neverwintan Red Veins, Cured Meat, Stone of Health, Scrolls of Life / Mass
Life, Adorable Pocket Pet, Tymora's Lucky Coin, Lliira's Bells x3, Refulgent Fortification (batch 1).

## Batch 3a BUILT 2026-10-13: insignia bonuses (n00b: "lets do insignia bonuses first") - awaiting review

Patch: scratchpad `or1_insignia.py`. Data (mount_insignia_bonuses.json): every bonus gets `roles` (dps / tank /
heal; proposed, see the review page) + `rolesNote`; exclusive pairs get `exclusiveRank` (2 = the greater wins:
Cavalry's Alarm > Warning, Warlord's Motivation > Inspiration, Artificer's Enticement > Persuasion, Knight's
Condemnation > Rebuke); Cavalry's Alarm / Warning = 15 structured equipBonuses (one per CR core stat, 3000 /
2000, `window:{triggerRateKey:"mountpower", seconds:20}`) replacing the text parse; Enchanter's Hex = fx hit 50
magnitude `when:{on:"hit", from:{type:[encounter,daily], hasControl:true}}` (fxStatus moves); Combatant's
Maneuver = fx buff Combat Advantage 2500 for 10 s on the same trigger; Warlord's pair = `scope:"companion"`
Companion Damage 12 / 8 (no reader yet); Berserker's Rage `stats` now carries both halves (the pre-filter list
was missing Critical Strike); Slayer's Bloodlust maxStacks 5 / linear (one stack counted); Survivalist's
drawback + the party halves annotated. Code: toon-forge.html - exclusivity prefers `exclusiveRank` over the
"overwrites" text test; the Cavalry regex block is removed; `pt2ProcOwners()` walks the active stable bonuses
with fx (control-triggered procs); js/optimizer-local.js `bonusIsDps()` returns `roles.includes(ROLE)` when the
tag exists (word regex only for untagged data). Hardlink + syntax + build OK.
Checks (`insig_ab.js`, `insig_uptime*.js`, Barbarian test build, no page errors): Cavalry's Alarm reaches the
engine (15 entries at ~33% uptime) AND the fight timeline (15 mount-power buffs); Enchanter's Hex fires on the
controlling hits (+1.1% DPS); Combatant's Maneuver, Cavalry's Alarm / Warning and the pre-existing Predator's
Instinct all read 0.00% on the test build - the fight prices rating buffs through the rating cap
(`pt2MakeScoreHit`, `rules.buffStats`) and this build is capped on every rating, so +3,000 over cap = 0. Not a
regression (Predator's Instinct behaved the same before). Below-cap check: see the next entry.
Review page: https://claude.ai/artifact/787pakyeCY6MySbgenCSM1 (43 cards, 8 changed).
RULING during review (n00b 2026-10-13): "i dont want to limit bonuses to certain roles because who knows what
someone might want slotted" -> the `roles` tags were REMOVED again (`or1_insignia_noroles.py`); `bonusIsDps()`
now admits every bonus with a scorable effect (stats / instanceStats / a self stat entry / procDamage /
procHeal / cdProc / apProc / fx) for every objective, 38 of 43; left out only the no-effect ones (Traveler's
Treasures, Wanderer's Fortune) and the companion / party-only ones with no reader yet (Warlord's pair, Ally's
Resilience). The fight model decides value; the old word regex is kept in the file as a dead reference only.
Review rulings (n00b 2026-10-13, all 43 one per turn): all ok as tagged, with two additions: Master's Cruelty
"healers can use this also" (moot once roles were dropped); Protector's Camaraderie gated on a FIGHTING summon
(`requiresFightingSummon` on its entries; the page skips it when the summoned companion is an augment or absent).
Batch 3a CLOSED 2026-10-13. Remaining mounts: combat powers (98) and equip powers (56) = batch 3b, on "go".
Below-cap attempt (8 gear slots, enchants, companions removed; DPS 138,815): Alarm / Predator / Maneuver still
0.00%. Cause found, not a bug: the per-hit pricing turns a rating buff into % through the rating cap
(`after = min(rcap, 50 + (ratingTotal + v - TIL) / 1000)`); on this build Combat Advantage is ratingTotal
142,098 vs TIL 131,126 = 61 > the 60 cap, and stripping gear lowers TIL along with the ratings, so it stays
over cap. In game a rating over its cap adds nothing, so 0 is the right answer for an endgame build; a
mid-level build below cap gets the full benefit. Formula verified by hand against the engine's stat record.

## Batch 3b BUILT 2026-10-13: mount combat powers (98) + equip powers (56) - awaiting review

Patch: scratchpad `or1_mountpowers.py`. Data: every combat power carries a top-level `fx` list (fxStatus moves)
with one record per effect in its text at the stored anchor - hit / dot (total over N s as perTick x ticks) /
debuff / buff / control / shield / heal / proc; conventions: "Dmg Debuff" -> `{"Outgoing Damage": -X}` (the
enemy deals less; defensive), "Enemy Dmg Taken" -> `{"Damage Taken": +X}`, other enemy stat debuffs by name
(recorded; the per-hit scorer reads Damage Taken only), scope `allies` = others only (dropped for you), `party`
= you included, role maps = one buff per role, control-immune extra hits gated on `targetControlImmune`, Divine
Intervention's +100 vs fiends gated on `enemyType:Fiend` (Fiend / Demon / Devil ticked), Lolth's Gift and
Radiant Weapon at their stack caps (provisional). 66 of 98 have no capture (`fxProvisional`). Equip powers: fx on
17 Celestial Luck, 51 High Ground, 56 Seeing Red, 44 Rejuvenation, 2 Opportunism, 32 Quick Action, 25 Reptilian
Skin (fxStatus moves) and 27 Providence, 45 Ferocity, 50 Reactive Agility (fxStatus stays: engine stack model
kept until the incoming-hit model); 28 Avian Aura gets its own Forte 4,500 + Power 1,600 (the wearer had only
the CR). Stack names "Mount stack: Radiant Weapon / Ferocity" registered. Validator: both files, top-level fx,
`control.scope`. Page: `pt2MountCallFx` prefers `cp.fx` scaled by selected rarity / anchor (every number, buff
percentages too), drops `allies` and other-role records; the legacy engine path counts ONLY "Enemy Dmg Taken" as
damage taken (the "Dmg Debuff" misuse is fixed on both paths); the active equip power's fx go to the simulator
via `pt2ProcOwners()` (rarity-scaled, capped at Celestial); the averaged `equipEffect` steps aside when the sim
owns the proc; the fight input carries `enemyTypes`. Simulator: `keyValue("enemyType:X")`, and the artifact /
mount call fires cast listeners (Opportunism).
Checks (`mount_ab.js`, Barbarian test build, fight DPS, old frozen copy -> new; no page errors): Spore
Explosion 480,426 -> 481,623 (same debuff, now with its own duration); Ferocious Roar (Dmg Debuff only) 479,258
-> 472,251 = the false damage-taken credit is gone, the 800 hit stays; Eclipsed Armament (both lines) 474,776 ->
475,961; Wicked Lich 514,833 -> 516,017; Pegasus role map 481,634 -> 485,061 (the DPS buff now reaches the
fight); Divine Intervention 475,069 -> 476,206, and 478,183 with Demon ticked (the enemyType gate works);
Hell's Impact (Celestial anchor) 474,753 -> 479,656 (DoT + debuff added, magnitude now scaled to the selected
tier). Equip powers: Celestial Luck 480,426 (nothing) -> 482,100; The High Ground -> 481,645; Opportunism ->
486,540 (the artifact call now fires cast listeners); Quick Action 487,998 -> 488,021 (sim-owned, same value);
Dominant Force unchanged. Bigby's control-immune extra hit, re-tested through `pt2SetFightFact`: 515,753 immune
vs 506,855 controllable - the gate works (the first test flipped the wrong key).
Review page: https://claude.ai/artifact/W8JV32pDn61MMvxnS1JuKJ (98 + 56 cards).
Review, item 1 (n00b: "these obviously change based on the bolster"): the fight's call records now scale like the
tooltip card's `_scaleCombat`: stored (Mythic + 125% bolster anchor) x rarity x `mountPowerBolsterFactor(
state.mountBolster)` / anchor, capped at the Celestial value. Ethereal Vortex: Mythic@125 800 / 15.8%,
Mythic@100 711 / 14.0%, Celestial@125 1,050 / 20.7% (= the Celestial tooltip), Epic@125 320 / 6.3%. The
player's mount bolster comes from the optimizer dialog ("I have max" or entered). Equip-power procs stay
rarity-only (Decision 3: rarity yes, bolster no).
Item 2 Resonating Screech, n00b's capture (IL 3,000, 15% / stun 3 s / +3 INT WIS CHA, archived as
docs/calibration/inbox/mounts/2026-10-13_mount-combat_Resonating-Screech_IL3000_and_Arcane-Maelstrom_IL2000-mag667.png)
exposed a CONVENTION BUG: the data is stored at the Mythic 100%-bolster reading (the 2026-05-20 sweep divided
the 125% readings by 1.125; 10 notes say so) but the page constant `MOUNT_POWER_CALIBRATION_BOLSTER_PCT` was
still 125, so every player above 100% bolster was under-scaled (15% shown where the game shows 16.9% at 125%).
Set to 100: Mythic@100 15%, Mythic@125 16.9%, Celestial 19.7% (cap). Memory
`project_mount_combat_power_storage` corrected. The same capture confirms Arcane Maelstrom (57): IL 2,000 /
magnitude 667 = the stored Mythic 1,000 at Legendary (x 0.667). Two entries whose notes say "stored at
Mythic-125%" (33 Tunnel Vision, 37 Empowered Dragonbone Whirl, both 3,000) need a Mythic@125 read to tell
3,375 from 3,000. Ability-score buffs (+3 INT ...) also get scaled by tier/bolster now - harmless (not scored),
tidy later.

### Batch 3b combat-power review DONE 2026-10-14 (n00b, one per turn, 94 of 98 confirmed)
Every power was shown to n00b with its fight records; almost all got a fresh AH / collection / claims preview
or a character-sheet tooltip, archived under docs/calibration/inbox/mounts/2026-10-13_* and 2026-10-14_* and
referenced from each power's notes. Tier rule used throughout: previews ignore the viewer's bolster (IL 3,000
Mythic x1, 3,500 x7/6, 3,937 Celestial x1.3125, 2,250 = Legendary at 125% bolster x0.75, 2,000 x0.6667, 1,200
x0.4, 675 = Rare at 125% x0.225); the character sheet shows the player's own copy at their bolster (n00b = 125%).
Corrections made in this pass (68-98): 69 Tenser's abilities +3 at Mythic (display truncates); 74 Call of the
Cosmos DoT confirmed at three tiers; 78 Grand Inspiration re-anchored Celestial 1,332 / 19.7% -> Mythic 1,000 /
15% (= Magnificent Inspiration under a new name; also fixes its TIL item level); 79 Radical Radiance cleaned
15.1 -> 15 / 7.5; 81 Intoxicating Venom = area DoT over 10 s (was single, 5 s) + the Accuracy/Power buff is for
allies in the area (party, was self); 84 Wicked Lich knockdown recorded; 85 Lunar Fireball split into main hit
2,000 + splash 750 on the others (the splash was missing); 86 Protector's Hand = 20% party shield (was 30% self)
+ -7.5% incoming + +5% Combat Advantage (missing), party; 87 Hell's Impact DoT 10 s (was 5); 89 Rabbit Hole
Mythic 800 from n00b's Rare copy (the picker's 1,600 was double); 96 Dark Call DoT 10 s (was 5). Confirmed
unchanged: 68, 70-73, 76, 77, 80, 82, 83, 88, 90-92, 97, 98. Stale `fxProvisional` cleared on 2 and 25 (reviewed
2026-10-13 with captures).
Parked (4): 75 Rain of Shards (Celestial-anchor 910 / 7% are not clean Mythic values, bleed number missing -
needs a Crimson Crystal Horse preview); 93 "Mossy Flail Snail", 94 "Spinning Axe Strike (Teal)", 95 Terrifying
Roar - picker-sourced duplicates of 63 / 67 / nothing; n00b flagged their mounts (313 Mossy Flail Snail, 335 Teal
Armored Axe Beak, 290 Champion's Armored Bulette) as probably not real mounts ("Teal" = Mythic rarity colour
folded into the name). Tracked in docs/data_issues.md; closing needs one look at the in-game mount collection.
Equip-power side panels confirmed 39 of 56 equip powers along the way (noted in the combat powers' notes).
Next: the 12 equip powers whose read changed (2, 17, 25, 27, 28, 32, 37, 44, 45, 50, 51, 56), one per turn.

### Batch 3b equip-power review DONE 2026-10-14 (n00b, alphabetical, one per turn)
All 12 changed entries ruled: Avian Aura, Celestial Luck, Ferocity, Opportunism, Providence, Quick Action, Rapid
Accuracy, Reactive Agility, Rejuvenation, Reptilian Skin, Seeing Red, The High Ground - every one confirmed with a
fresh preview or character-sheet tooltip (archived as docs/calibration/inbox/mounts/2026-10-14_mount-equip_*) and
marked `fxReviewed` in mount_equip_powers.json; no value changed. The other 44 are plain always-on stats that did
not change; 39 of 56 equip powers were confirmed on the side panels of this week's previews.
EQUIP-BOLSTER-1 (FIXED 2026-10-14, n00b: 'go bolster' - toon-forge.html equip paths now rarity x bolster, capped at Celestial; probe = n00b's sheet): n00b's own copies read Rejuvenation 13.5% and Rapid Accuracy 5,062 / 3,038 at IL
3,375 = Mythic x 1.125, so equip-power stats AND proc values scale with the player's bolster like combat powers
do, but the page scales equip powers by rarity only (toon-forge.html `statIdx && isEquip` branch and the equip
proc scaling in `pt2ProcOwners` / `_eqFactor`; audit "Decision 3: rarity yes, bolster no" was wrong). Players
above 100% bolster are under-credited by up to 12.5% on every equip power. Fix after the review, same shape as
the combat-power bolster factor (cap at the Celestial value).

## Batch 4 BUILT 2026-10-14: artifacts (156 rows, 141 names) - awaiting n00b's per-item review (alphabetical)

Patch: scratchpad `or1_artifacts.py`. Every artifact row now carries `callFx` (150 of 156; the 6 left empty are the
random-card / unknown ones: Tarokka Deck, Tome of Ascendance, Deck of a Few Things, Illusionist's Mask (threat only),
Globe of the Third Eye (unknown), Memories (Redeemed) (passive only)). Records were written from the stored text:
D damage calls as `hit` / `dot` with `missing: ["magnitude"]` (counted as zero until a tooltip gives the number);
N defensive calls as shield / heal / buff (Incoming Damage) / debuff (Outgoing Damage, enemy ratings) / control;
L durations as `missing: ["seconds"]` with 10 s provisional; M amounts missing; R random calls at expected value
(Wheel of Elements fire 5% x 1/4, Tymora's coin x 1/2) or nothing (card draws); P passives moved to
`equipBonuses[]` entries (`type: "Proc"`, fx, fxStatus) for Memories (Redeemed), the four Dragon's Marks, Thayan
Book of the Dead, Flask of Brewing, Tiamat's Arcane Globe. Flat tooltip numbers (Bloodthirst Chalice x5, Demon
Skull, Spelljammer, Repurposed Phylactory, Emblem of the Seldarine, Champion's Battle Horn, Decanter 816/hit) are
recorded as `flat` + `noScale`. Vocabulary: `debuff.ratingStats`, event `healed`; `validate_callfx` now also checks
artifact equipBonuses fx. Page: `pt2ProcOwners` takes passives from all four artifact slots; the call records
already reached the fight through `pt2CallInput`. Every row except Bloodthirst Chalice / Burning Hope / Laughing
Void is `callProvisional` (no capture). Review page: scratchpad `build_artifact_review.py`.
Checks (`artifact_ab.js`, Barbarian fixture, no page errors on either copy): none 450,139; Charm of the Serpent
452,464; Lantern 454,851; Bloodthirst Chalice 2,600 455,000 (flat hit + 5 bleed ticks now count); Demon Skull
462,532 (3 x 31,271 flat); Spelljammer 456,665; Wheel of Elements 451,381; Tiamat's Orb 450,910 (defensive);
Decanter 451,838; Eye of the Giant 449,437 / 907,046 at 6 enemies; Red Dragon's Mark passive counts from a
secondary slot (456,666 vs 452,808 as primary); Flask of Brewing passive in the owners list.
AR-2c (2026-10-14, OPEN): Bloodthirst Chalice IL 2,600 collection tooltip read 26,171 / 6,266 on 2026-08-27 and 62,176 / 14,065 on Lia today - viewer-dependent, and NOT by one multiplier (2.38 vs 2.24), so the 'clean ratio' test cannot tell flat from computed. Only Marco's Mystic Marker (same number on two toons) and Assassin's Knife (= Damage stat on two toons) are settled; every other 'flat' today is provisional. Surina same day: 62,683 / 15,701 vs Lia 62,176 / 14,065 (hit +0.8%, bleed +11.6%) - the viewer's CLASS boosts are in the printed number (Marco's says 'not influenced by class powers' and is the one that matched), so no simple stat ratio exists. AR-2c = 2 LOCKED 2026-10-14 (n00b): the artifact DAMAGE-number review stops until the formula is cracked (an engine calibration job: Lia's build in Toon Forge vs the 2026-10-14 readings); the review continues only for what the optimizer could not see before - defensive / utility calls (N), missing durations (L / M), passives (P), random calls (R) and set bonuses. Damage numbers read so far stay provisional (Lia-read); the pure-damage group (D) is skipped. PAUSED 2026-10-14 at Bloodcrystal Raven Skull (1 of the 62 N/L/M/R/P entries, alphabetical; the 14 reviewed so far are marked callReviewed) - n00b: 'lets take care of some of the testing we need to do we will come back to this'. AR-2b (2026-10-14): NOT every artifact prints flat - Assassin's Knife reads 17,850 on Lia and 17,411 on Surina = each toon's Damage stat exactly, so its hit is magnitude 100 and its poison (24,990 = 1.40 x Damage) magnitude 140/s. Rule: divide the printed number by the viewing toon's Damage stat; a clean percentage (100, 140 ...) = magnitude, stored as `magnitude`; otherwise flat (Marco's 132,288 on both toons). Flat ones: Alaric 33,072 (1.853x), Apocalypse 22,292, Music Box 50,158, Egg 44,096, Dice 120,579 - none a clean ratio. AR-2 SETTLED 2026-10-14 (for the flat kind): artifact tooltips print a FLAT damage number per rank, the same on every toon - Marco's Mystic Marker IL 1,500 reads 132,288 on Lia (Damage 17,850 / Power 98.6%) AND on Surina (Bard, Damage 17,411 / Power 101.2%). No conversion: store the printed number as `flat` + `noScale` (the simulator counts flat hits at their number, lock C-B), one row per rank. Collection previews are fine for the rank they show. Earlier note: Lia's Stats tab at capture time - Warlock Hellbringer (DPS loadout), TIL 147,086, Damage
17,850 (= 147,086 / 10 x 1.2 + ~200 weapon), Power 149,703 = 98.6%, Accuracy 60.1%, CA 84.5%, Crit 73%, Crit Sev 99%.
Console POWER tooltips print the magnitude (Dark Helix: "Magnitude: 135 + 50 per Dark Spiral"), so they give no
damage reference; ARTIFACT tooltips print damage. Conversion assumed until a two-toon check: magnitude = printed /
(Damage x (1 + Power%)) x 100, i.e. Alaric's 33,072 / (17,850 x 1.986) = 93.3. Screenshots:
docs/calibration/inbox/artifacts/2026-10-14_Lia_stats-tab_*.png, 2026-10-14_Lia_Dark-Helix_tooltip_magnitude135.png.
AR-1 = 1 LOCKED 2026-10-14 (n00b): artifact call numbers are captured from n00b's OWN character sheet / bag at his rank; Toon Forge backs the magnitude out of the printed damage with his weapon damage and Power; collection previews (rank 1, unknown stats) only confirm wording and durations. Background: artifact tooltips print DAMAGE, not magnitude - the number is computed from the
viewer's stats (Lantern IL 100 read 6,172 on n00b's toon; the collection previews at IL 100 read 648 / 8,806 / 436
for Key of Stars / Lostmauth / Skull Lord). A flat number is only right for the toon that read it; backing a
magnitude out needs the reader's weapon damage and Power (the engine formula), i.e. captures from n00b's own
character sheet at his rank, not collection previews (which also show rank 1).

## Totals across the three groups (strict)

| Group | Entries | Fully read | Partly read | Words only |
|---|---|---|---|---|
| Mount combat powers | 98 | 22 | 71 | 5 |
| Mount equip powers | 56 | 45 | 4 | 7 |
| Insignia bonuses | 43 | 32 | 3 | 4 (+2 regex-only) |
| Collars / insignias | 124 | 109 | 0 | 0 (15 non-combat) |
| Companion powers | 270 | 201 | 24 | 45 |
| Companion enhancements | 31 | 6 | 17 | 8 |
| Companion summoned buffs | 43 | 33 | 8 | 2 |
| Artifact call effects | 156 | 30 | 40 | 86 |
| Artifact set bonuses | 39 sets | 3 | 5 | 24 missing + 3 empty |
| Combat enchants (+ companion enchant) | 17 | 0 | 17 | 0 |
| Overloads | 50 | 39 | 0 | 11 |
| Buffs / food / belts | 123 | 85 | 12 | 26 |
| Campaign boons (tiers + masters) | 42 | 30 | 3 | 9 |
| Guild boons / feats / races | 56 | 32 | 0 | 24 |
| Gear bonus rows (strict) | 5,932 rows | most | ~156 rows | 481 rows (+122 legacy set text) |

Engine / optimizer changes that tagging alone cannot fix (consumer work): combat-power durations hard-coded to
10 s; "Dmg Debuff" credited as damage taken; party-scope entries skipped everywhere; tank / healer scorers read
no callFx / fx heal / shield; enemy-stat debuffs other than Damage Taken not modelled; the insignia-bonus pool
built by word regex; Companion Damage stat silenced; enchants / buffs / boons / races outside `validate_proc_fx`
and `pt2ProcOwners()`.
