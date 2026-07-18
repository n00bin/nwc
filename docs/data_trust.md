# Data Trust Ledger

This is the **Data Steward team's** record of what data has been *proven correct against an in-game screenshot.* It is maintained by the `/steward` command (see `~/.claude/commands/steward.md`).

## Owner tank proc audit — Shadow Demon + Blood Bargain — 2026-07-18

| id | name | system | status | source | data version | date verified |
|----|------|--------|--------|--------|--------------|---------------|
| power 11 | Shadow Demon's Presence | companion_powers | FIXED — proc interval **10s→30s** ("for one deflect every 30 seconds, increase Deflect Severity by 90%"); damage-back prose corrected 1.2→**112 physical** + 20%-chance framing. The **+90% Deflect Severity buff is REAL** (confirmed in-game) — a mid-investigation nw-hub scrape had OMITTED that line and I briefly mis-flagged it as fabricated; the ground-truth tooltip corrected that. Impact on owner's Justicar: the 10s error over-credited Deflect Severity (+84% @ ~39% uptime → showed CAPPED 120); corrected to +50% @ ~23% uptime. THEN two more owner rulings (2026-07-18): (1) the +90% is a **FLAT** proc value — it does NOT scale with companion rarity/IL (only the damage magnitude does), so the engine was inflating it +90%→~+217% on a Celestial companion; added `statEffect.noRarityScale:true` (respected in toon-forge.html engine + companions-page.js + gen-item-pages.js — three consumers). (2) The buff is **one deflect per 30s** (single-use, consumed on next deflect), NOT sustained; `procEffect.uptimeOverride:0.12` models ~1 of the ~8 deflects a ~90%-deflect tank makes in 30s. Net: Deflect Severity contribution +50% → **+10.8%** (90×0.12) → **real Deflect Severity 51.3** (was showing 120). Full arc for this one stat: 120 (10s+scaled+sustained) → 90 (30s) → **51 (flat + one-deflect-per-30s)**. | Screenshot 2026-07-18 042636.png + owner rulings | 2026.03.17a | 2026-07-18 |

**Related engine fix (same session, `toon-forge.html` commit f458399f):** weapon MH/OH pair "Equip" procs were double-counted — Blood Bargain's on-crit-struck +10% Critical Avoidance / +5% Power (and Umbral Stride) is printed on BOTH weapons but is one non-stacking effect, and `ingestEquipBonuses` (per-item) summed it once per weapon. Added `seenWeaponProc` dedup: credit each (name,stat) Equip proc once across the equipped MH+OH; **weapon-slot-scoped** so the 353 same-named non-weapon Equip bonuses (which may legitimately stack) are untouched. Only 6 combos qualify (Blood Bargain CA+Power, Umbral Stride ×4). On owner's Justicar this dropped CA from a false 90 (capped) to a real ~84. Critic-APPROVED (independent code+data verification, no blockers).

**Open follow-up (NOT fixed — pending owner in-game read):** `conditionalDamageUptime` misclassifies "struck by a Critical Strike" procs as the OUTGOING crit rate (2.0/s → ~88% uptime) instead of an incoming rate (`struck` 0.3/s → ~27%) — the `/critical/` branch is tested before `/struck/`. Affects ~11 defensive tank procs (Blood Bargain CA; Deflect-Sev / Max-HP "Ghosted"-style boots). Even 27% likely overstates it (high CA suppresses being crit-struck). Awaiting owner's read on realistic in-game uptime before finalizing.

## Owner calibration session — Erik (Paladin Justicar tank) — 2026-07-17

Full defensive stat-panel calibration of the owner's tank. After two build-loadout corrections in Toon Forge (offense enchant one Rubellite Tourmaline → **Celestial Ruby**; Snowtusk **Enlightened Fortitude → Enlightened Brutality**), all 15 stat ratings AND percentages, Max HP (2,987,257 vs game 2,987,258), Damage (14,974), and TIL (148,737) match the in-game panel exactly. Those two were *build* fixes, not data. The one **data** fix:

| id | name | system | status | source | data version | date verified |
|----|------|--------|--------|--------|--------------|---------------|
| artifact 106 | Broken Halo | artifacts | VERIFIED+STRUCTURED — ratingStats corrected from placeholder 1950/1950/1950 → **Critical Avoidance 2145 / Deflect 2925 / Deflect Severity 2925** at IL-2600 max quality; combinedRating 2210 & IL 2600 confirmed correct (0.85× ratio); source set to "Shackles of Divinity (Advanced)"; stun text 1.3s→1.2s | 2026-07-17_paladin-justicar_broken-halo-tooltip-il2600.png | 2026.03.17a | 2026-07-17 |
| enchant 46 | Celestial Shattered Resolve | enchants | STRUCTURED — on-damage-taken proc now modeled as a conditional "at full stacks" buff: **+18% Def/Awareness/Deflect (3.6%/stack ×5) Celestial, +16.5% (3.3%/stack) Mythic**. HP/IDR baseline stays always-on; proc routes to the Show-Conditional in-combat view (stripped at rest, calibration preserved). Applied at all read-sites (JSON source, Mythic+Celestial rarity blocks, static db page). Tank optimizer credits proc at full uptime per owner ruling 2026-07-17. | 2026-07-09_celestial-shattered-resolve-r_*.png | 2026.03.17a | 2026-07-17 |
| gear 285/1069-1074/1263/5362/5375 | "Charged Defiance" bonus (10 items) | gear | STRUCTURED — the "When Stamina >75%, take X% less damage" bonus was description-ONLY (engine applied nothing). Added `type:Equip / stat:Incoming Damage / amount:-X` (9 items −3%, Frost-Riven Earthshard Guard id 5375 −4.5%). Full at rest via the engine's stamina-graded handling. 8 of 10 originally lacked `type:Equip` (critic-caught: `ingestEquipBonuses` gates on it) — added. Verified via page load that a previously-dead item (id 285) now contributes. | owner in-game test (see note) | 2026.03.17a | 2026-07-17 |

**Data-pipeline note (2026-07-17):** the served `website/data/*.js` files are AUTO-GENERATED by `website/build-data.py` from the `../data/*.json` source of truth ("Do not edit" headers). All fixes above were applied at the JSON source and regenerated, so a future `build-data.py` run will not revert them. Static db pages regenerated via `scripts/gen-item-pages.js` (gear pages unaffected — they render the description text, which was already present).

**Erik Incoming-Damage mystery — RESOLVED 2026-07-17.** Game showed −14.6% at rest; tool showed −13.75%. Owner's decisive in-game test (before Daily −14.6%, after Daily −16.8%) proved: (1) Malignant Energy (Ritualistic 3-pc, −2.5%) is a Daily-power proc, correctly OFF at rest — the −14.6% does NOT include it; (2) the hidden always-on source was **Cracked Earthshard Guard's "Charged Defiance" −3%** (fixed above); (3) NW stacks incoming-damage reductions **MULTIPLICATIVELY** — Shattered Resolve × Charged Defiance = 0.88 × 0.97 = 0.8536 → −14.6% ✓, ×Malignant 0.975 → −16.8% ✓ (both matched to the decimal). **Known limitation (logged, not fixed):** the engine stacks incoming-damage reductions ADDITIVELY, not multiplicatively (would touch `computeTankExpectedTaken`/`incFactor`, tank-survival scoring blast radius). The tool's "Incoming Damage (mitigation)" row is a sustained-combat estimate (weights the Daily proc ~70%), not the at-rest panel value.

**Creature-ward optimizer exploit — FIXED 2026-07-17.** A headless tank optimization produced an inflated build (survival score 402→4027, 25%-floor exploit): the optimizer slotted **Dragon Ward + Greater Fiend Ward** (−10% each) as if general mitigation. Those 7 "creature wards" (Dragon/Elemental/Giant/Undead/Lesser+Greater Fiend/Astral Elf) only reduce damage from their specific creature, but stored `Incoming Damage` in `percentStats` (applied unconditionally). FIX (data): moved each to a `zones`-gated `equipBonus` (`zones:["vs <enemyType>"]`), mirroring the existing zone wards (Thay/Wildspace) — dropped in General content (zero credit → optimizer stops stacking them), selectable via the content-zone picker to model that content. Two supporting code fixes: `gen-item-pages.js` now renders overload equipBonuses (+`effectText` fallback so zone-conditional prose shows instead of a bare always-on-looking stat line — also corrected 12 gear pages e.g. Ritualistic Necklace, Delzoun Sabatons); `toon-forge.html` `openContentZonePicker` now scans OVERLOADS_DATA so the "vs <enemy>" scenarios are reachable. `Resiliency of the Depths` (−5%, no enemyType) left as-is (ambiguous — verify in-game). Verified: General drops both wards (−38.25%→−18.25%), "vs Dragon" reactivates Dragon Ward; 0 `[object Object]` across all 8,277 pages.

Open follow-ups (not blocking): additive→multiplicative incoming-damage stacking (above) — still the largest remaining optimizer-scoring distortion for tanks; sibling enchant Celestial Rime Temper (id 40) shares Shattered Resolve's HP/IDR baseline but has a DIFFERENT proc (enemy Outgoing-Damage debuff, currently inert in-engine) — left unmodeled by design; `Resiliency of the Depths` overload gating unverified.

## Owner capture session 2 — HEALER GATE CLOSED — 2026-07-10

| id | name | system | status | source | data version | date verified |
|----|------|--------|--------|--------|--------------|---------------|
| gear 293 | Cowl of the Ashen Chant | gear | VERIFIED+STRUCTURED — Crit 2952/Power 861/CritSev 2952/CR 3690; Thayan Resourcefulness: **12% Class Resource Regen baseline (18% in Thay) — now SCORES** | Cowl of the Ashen Chant_IL4100_verified.png | 2026.03.17a | 2026-07-10 |
| gear 304 | Gauntlets of the Anointed | gear | VERIFIED+STRUCTURED — IL corrected 3550; CritSev 1917/Deflect 2396/OH 1704/CR 3195; Controlled Divinity: **0.6%/stack regen ×10 on ally heals — now SCORES** | Gauntlets of the Anointed_IL3550_verified.png | 2026.03.17a | 2026-07-10 |
| gear 381 | Vambraces of the Vital Sigil | gear | VERIFIED+STRUCTURED — Forte 3490/OH 2538/CR 4230; Divine Ascendance: **Divinity max +20% (percentOfPool) — now SCORES** | Vambraces of the Vital Sigil_IL4700_verified.png | 2026.03.17a | 2026-07-10 |
| gear 383 | Mask of the Vital Sigil | gear | VERIFIED+STRUCTURED — Crit 3807/OH 3102/CR 4230; Healing Momentum: **8% regen after moving — now SCORES** (ally IH rider recorded in description) | Mask of the Vital Sigil_IL4700_verified.png | 2026.03.17a | 2026-07-10 |
| gear 518 | Luminstep Sabatons — Ruthless Resources | gear | VERIFIED+STRUCTURED — Forte 2261/OH 2010/CR 3015; Ruthless Resources (Greater): **5%/stack regen ×5 — now SCORES** | Luminstep Sabatons (Ruthless Resources)_IL3350_verified.png | 2026.03.17a | 2026-07-10 |
| power 184 | Incubus (Charmer's Distraction) | companion_powers | NAME FIXED — "Feywild Charmer's Distraction" → **"Fiendish Charmer's Distraction"** per auction-house name-splash inspect; content already verified | Incubus_FiendishCharmersDistraction_IL375_name-splash_verified.png | 2026.03.17a | 2026-07-10 |
| power 185 | Succubus (Charmer's Distraction) | companion_powers | NAME FIXED — "Succubus's Distraction" → **"Fiendish Charmer's Distraction"** (identical power on both companions, name included) | Succubus_FiendishCharmersDistraction_IL375_name-splash_verified.png | 2026.03.17a | 2026-07-10 |

## Owner capture session — 9 of 15 Tier-4 items verified — 2026-07-10

| id | name | system | status | source | data version | date verified |
|----|------|--------|--------|--------|--------------|---------------|
| gear 51 | Cuirass of the Black Flame | gear | VERIFIED+STRUCTURED — stats/CR from tooltip (Acc 3773/CA 2838/Forte 3193/CR 3870); Executioner's Remedy (Greater) "5% health back on kill" captured, unmodeled (no heal-layer) | Cuirass of the Black Flame_IL4300_verified.png | 2026.03.17a | 2026-07-10 |
| gear 73 | Cuirass of the Ethralled Flame | gear | VERIFIED+STRUCTURED — Acc 4344/CA 2187/Aware 2187/CR 3645; Executioner's Remedy (Lesser) 3.5% on-kill heal, unmodeled | Cuirass of the Ethralled Flame_IL4050_verified.png | 2026.03.17a | 2026-07-10 |
| gear 69 | Gauntlets of the Hierarch | gear | VERIFIED+STRUCTURED — CritSev 4010/Def 1914/CR 3645; Fount of Healing (Lesser) full orb text captured, descriptive-only per convention | Gauntlets of the Hierarch_IL4050_verified.png | 2026.03.17a | 2026-07-10 |
| gear 315 | Deathsilver Band of Sacrifice | gear | VERIFIED+STRUCTURED — Crit 8820/Forte 6615/+1.5% Recharge/CR 3920; **Circular Healing: +9% Outgoing Healing 10s on being healed (15s cd) — now SCORES** | Deathsilver Band of Sacrifice_IL4900_verified.png | 2026.03.17a | 2026-07-10 |
| gear 79 | The Claw of Covetous Flame | gear | VERIFIED+STRUCTURED — Def 3486/CritAvoid 8217/+1.5% StamRegen/CR 3320; Pact of Vengence retaliation proc captured, unmodeled (damage layer) | The Claw of Covetous Flame_IL4150_verified.png | 2026.03.17a | 2026-07-10 |
| gear 423 | Bloodwoven Ink (Butcher's Zeal) | gear | VERIFIED+STRUCTURED — CritSev 2268/Forte 1276/OH 1134/+1.5% Recharge/CR 2835; Butcher's Zeal 15 AP proc (flat-AP convention, descriptive); **NEW: "Enchanted Healing" 2pc set +2% Outgoing Healing recorded — set was previously unknown** | Bloodwoven Ink (Butcher's Zeal)_IL3150_verified.png | 2026.03.17a | 2026-07-10 |
| gear 457 | Mystic Conduit Seal (Healer's Influence) | gear | VERIFIED+STRUCTURED — Crit 1944/CtrlRes 1620/OH 1728/+1.5% Recharge/CR 3240; **Healer's Influence: +11,250 OH rating 5s proc — now SCORES** | Mystic Conduit Seal (Healer's Influence)_IL3600_verified.png | 2026.03.17a | 2026-07-10 |
| gear 461 | Mystic Conduit Ink (Butcher's Precision Lesser) | gear | VERIFIED+STRUCTURED — CA 1296/Crit 2592/Def 1134/+1.5% APG/CR 3240; Butcher's Precision: +11,250 CritSev rating 5s proc — now scores | Mystic Conduit Ink (Butcher's Precision Lesser)_IL3600_verified.png | 2026.03.17a | 2026-07-10 |
| gear 530 | Mirestep Boots (Ruthless Resources) | gear | VERIFIED+STRUCTURED — CritSev 1350/Deflect 1688/OH 1800/CR 2700; **Ruthless Resources (Lesser): 4%/stack Divinity-Performance-Soulweave regen, max 5 — now SCORES** | Mirestep Boots_IL3000_verified.png | 2026.03.17a | 2026-07-10 |

## Held-item resolutions — owner rulings 2026-07-10

| id | name | system | status | source | data version | date verified |
|----|------|--------|--------|--------|--------------|---------------|
| power 193 | Lillend (Song of Restoration) | companion_powers | FIXED — heal 18% → **37.5%** of max HP (owner-approved; card shows 37.5 @ IL375, exact 10× single-stat match; stored 18% was uncited) | audit card c206.png | 2026.03.17a | 2026-07-10 |
| power 259 | Celeste (Angelic Renewal) | companion_powers | RE-ANCHORED — was IL75/20% (unconfirmed NW Hub, scaled implausibly); now **7.5% @ IL375/CR375** per hard card read (base 1.5%@75, 2× single-stat) | audit card c153.png | 2026.03.17a | 2026-07-10 |
| power 173 | Grace Revoir (Unseelie Cruelty) | companion_powers | FIXED — non-linear curve stored as effectScaling **750→5% / 900→13.5%** per the record's own declared points (13.5 card-confirmed; 5% uncited — update if an in-game Mythic tooltip disagrees); stats[] tier-mixing resolved | audit card c180.png | 2026.03.17a | 2026-07-10 |
| power 110 | Vallenhas Elite Soldier (Vallenhas' Discipline) | companion_powers | FIXED — 11% → **11.3%** damage vs Avernus devils; card re-read at full resolution 2026-07-10 settled the digit-misread concern | audit card c109.png | 2026.03.17a | 2026-07-10 |
| power 184/185 | Incubus / Succubus (Charmer's Distraction) | companion_powers | CONTENT CONFIRMED (10% / Encounter / Daze 3s / 10s ICD); displayed power NAME ("Fiendish" vs stored "Feywild"/"Succubus's") + companion identity on the shared card UNRESOLVABLE from archive → owner in-game name-splash check queued | audit card c194.png | 2026.03.17a | 2026-07-10 |

## What this is for

The website's data lives in the JSON files in `../data/` (the source of truth). A value being *in* the JSON does not mean it's *right*. This ledger tracks which values have been verified against a screenshot, so that:

- When something looks wrong on the site, we can check whether that value was ever verified.
- A verified value can be **looked up** with confidence instead of re-checked from scratch.
- We can see at a glance which systems still need screenshots captured.

**Status meanings**
- `CONFIRMED` — JSON matches an in-game screenshot. Trusted.
- `MISMATCH` — JSON disagreed with a screenshot (should already be fixed; left here only if a fix is pending).
- `UNVERIFIABLE` — no screenshot exists yet. Not wrong, just unproven. Capture one to promote it.

## How a row gets added

`/steward` adds/updates a row whenever it verifies an entry. The Steward Lead emits the rows; the builder (or orchestrator) writes them here — the Lead is read-only.

| id | name | system | status | source screenshot | data version | date verified |
|----|------|--------|--------|-------------------|--------------|---------------|
| power 34 | Werewolf's Presence | companion_powers | CONFIRMED (no change — was already correct) | c030.png | 2026.03.17a | 2026-06-15 |
| power 53 | Baby Polar Bear's Instincts (companion renamed Polar Bear Cub) | companion_powers | FIXED→CONFIRMED (base rarity 750→375 Epic; stats 3.8→1.9; CR 750→375) | c048.png | 2026.03.17a | 2026-06-15 |
| power 171 | Quickling's Wisdom | companion_powers | FIXED→CONFIRMED (Critical Strike 1.8→3.8) | c176.png | 2026.03.17a | 2026-06-15 |
| power 210 | Deva Champion's Insight | companion_powers | FIXED→CONFIRMED (both stats 1.5→1.3) | c222.png | 2026.03.17a | 2026-06-15 |
| power 64 | Hunting Hawk's Presence | companion_powers | FIXED→CONFIRMED (CR 230→75; stat 0.75 confirms base IL 75) | scaling math | 2026.03.17a | 2026-06-15 |
| power 82 | Wardog's Instincts | companion_powers | FIXED→CONFIRMED (CR 230→75; stats 0.38 confirm base IL 75) | scaling math | 2026.03.17a | 2026-06-15 |
| power 223 | Air Archon's Insight | companion_powers | FIXED→CONFIRMED (CR 230→75; stat 0.75 confirms base IL 75) | scaling math | 2026.03.17a | 2026-06-15 |
| power 60 | War Boar's Instincts | companion_powers | FIXED (CR 230→75 — invalid rating value); verified as a PROC, not a stat buff | scaling math + War Boar_IL550_verified.png | 2026.03.17a | 2026-06-15 |
| power 261 | War Drummer's Discipline (Cyclops War Drummer) | companion_powers | NEW/FIXED — was showing Crimson Crystal Golem's power; now correct. Base rarity Epic confirmed: re-anchored IL 900→375 (+1.88% Incoming Healing, +7,500 Max HP, +375 CR at Epic; 4.5%/18,000/900 at Celestial) | Cyclops War Drummer_IL900_verified.png | 2026.03.17a | 2026-06-15 |
| power 262 | Celestial Lion's Presence (Stalwart Golden Lion) | companion_powers | NEW/FIXED — was sharing Kingfisher's Wisdom; now correct (Utility, +900 CR, proc +9% radiant dmg, IL 900) | Stalwart Golden Lion_IL900_verified.png | 2026.03.17a | 2026-06-15 |
| power 263 | Dungeon Master's Wisdom (Portobello DaVinci) | companion_powers | NEW/FIXED — was sharing Elite Intern's Wisdom; now correct (Utility, +900 CR, +2.4 all attributes, IL 900) | Portobello DaVinci_IL900_verified.png | 2026.03.17a | 2026-06-15 |
| power 264 | Dreadwarrior's Insight (Dread Warrior) | companion_powers | NEW/FIXED — was sharing Proud Pink Yeti's Presence; now correct (Utility, +750 CR, proc +15% threat, IL 750) | Dread Warrior_IL750_verified.png | 2026.03.17a | 2026-06-15 |
| power 252 | Fire Eye's Insight (Blue Fire Eye) | companion_powers | CONFIRMED — Blue Fire Eye already owns it (+6.6% dmg vs Kabal's minions, IL 900); Archmage's Apprentice now the suspect | Blue Fire Eye_IL900_verified.png | 2026.03.17a | 2026-06-15 |
| power 92 | Vampire's Kiss (Vampire Bride) | companion_powers | CONFIRMED — legit shared with Vampire (proc: 30% on Encounter → 3.8% Max HP, IL 375) | Vampire Bride_IL375_verified.png | 2026.03.17a | 2026-06-15 |
| power 226 | Divine Answers (Linu La'neral) | companion_powers | CONFIRMED (Forte 3.8 + Outgoing Healing 3.8, IL 750 — exact match) | Linu La'neral_IL750_verified.png | 2026.03.17a | 2026-06-15 |
| power 83 | Wolf's Instincts | companion_powers | CONFIRMED (Critical Severity 0.75 single-stat = 9% at Celestial; stale "stats at 0" note fixed) | Wolf_IL900_verified.png | 2026.03.17a | 2026-06-15 |
| power 86 | Damaran Shepherd's Instincts | companion_powers | CONFIRMED (Crit Strike + Crit Avoidance 0.38 at IL 75; stale note fixed) | Damaran Shepherd_IL75_verified.png | 2026.03.17a | 2026-06-15 |
| power 84 | Baby Boar's Instincts | companion_powers | FIXED→CONFIRMED — was Maximum Hit Points; correct stats are Deflect + Critical Severity (0.75 each, IL 150). Resolves the c075/c081 conflict (c075 was right) | n00b in-game 2026-06-15 | 2026.03.17a | 2026-06-15 |
| power 106 | Mageslayer's Assault (Mage Slayer) | companion_powers | CONFIRMED — campaign-utility (Portal Stone drops + 5.6% dmg vs Kabal/Cyrion/Nostura minions); fixed "Gyrion"→"Cyrion" typo | Mage Slayer_IL375_verified.png | 2026.03.17a | 2026-06-15 |
| power 153 | Cantankerous Mage's Wisdom | companion_powers | CONFIRMED (Accuracy 0.75 + Defense 0.75, IL 150 — exact match) | Cantankerous Mage_IL150_verified.png | 2026.03.17a | 2026-06-15 |
| power 228 | Coldlight Walker's Gaze (Coldlight Walker) | companion_powers | CONFIRMED — IL 750 base (Crit Strike + Crit Severity 3.8) scales to 4.5/4.5 at Celestial, matches screenshot. Base anchor 750 assumed (lowest rarity unverified) | Coldlight Walker_IL900_verified.png | 2026.03.17a | 2026-06-15 |
| power 119 | Cold Iron Warrior's Discipline | companion_powers | FIXED→CONFIRMED — CR 0→75 (was wrongly 0; CR tracks IL); Damage vs Fey 1.13@IL75 confirmed (→2.3% at IL 150); removed +0% placeholder proc | Cold Iron Warrior_IL150_verified.png | 2026.03.17a | 2026-06-15 |
| power 248 | Highborn Status (Demonic Servant) | companion_powers | CONFIRMED — Demonic Servant correctly owns it (Forte 1.9 + Accuracy 1.9, IL 375, +10% Menzoberranzan currency, exact match); Mercenary is now the suspect | Demonic Servant_IL375_verified.png | 2026.03.17a | 2026-06-15 |
| power 168 | Apprentice's Wisdom (Apprentice Healer) | companion_powers | CONFIRMED (Incoming Healing 0.37 + 1,500 Max HP + 75 CR, IL 75 — exact match; Max HP correctly in Passive procEffect) | Apprentice Healer_IL75_verified.png | 2026.03.17a | 2026-06-15 |
| power 265 | Mercenary's Discipline (Mercenary) | companion_powers | NEW/FIXED — Mercenary was sharing Demonic Servant's Highborn Status; now correct (Offense/Utility, +4.5% Power, +4.5% Combat Advantage, +900 CR, IL 900). Base anchor 900; lowest rarity unconfirmed | Mercenary_IL900_verified.png | 2026.03.17a | 2026-06-15 |
| power 169 | Wayward Wisdom (Wayward Wizard + Halfling Wayward Wizard) | companion_powers | FIXED — Archmage's Apprentice (263) was renamed in-game to Halfling Wayward Wizard and wrongly shared Fire Eye's Insight; repointed to Wayward Wisdom. Power 169 repurposed from fabricated "Wayward Wizard's Wisdom" (Defense+CritSev) → real Wayward Wisdom (Utility, IL 150, +150 CR, proc −7% move speed). Both Wayward Wizards share it (per n00b) | Halfling Wayward Wizard_IL150_verified.png | 2026.03.17a | 2026-06-15 |
| power 256 | Snow Worries (Riotous Rothe) | companion_powers | CONFIRMED — Incoming Healing single-stat (Defense+Utility), +9% at Celestial. n00b-confirmed 2026-05-04 AND archive card c071 (IL 900) matches | c071.png + n00b 2026-05-04 | 2026.03.17a | 2026-06-15 |
| power 257 | Orc Wolf's Instincts (Armored Orc Wolf) | companion_powers | CONFIRMED via OCR-found archive card c070 (+3.8% Accuracy, +3.8% Critical Strike @ IL 750 = our 0.38@IL75 scaled). The NW-Hub value was actually correct | c070.png | 2026.03.17a | 2026-06-15 |
| power 255 | Bard's Discipline (Harper Bard) | companion_powers | CONFIRMED via OCR-found archive card c118 (+7,500 Max HP, +1.9% Awareness @ IL 375 = our 1500 HP / 0.38 @ IL75 scaled). The NW-Hub value was actually correct | c118.png | 2026.03.17a | 2026-06-15 |
| power 10 | Hell Hound's Senses | companion_powers | FIXED — was rendering blank (no stats/effect); added procEffect text (+10% Family Crest / Chaotic Writing drops in Vallenhas, zone-conditional). Campaign utility, not optimizer-relevant | DB-scan 2026-06-15 | 2026.03.17a | 2026-06-15 |
| power 174 | Spiteful Hex (Lysaera) | companion_powers | FIXED — Combined Rating 900→750 to match item level 750 (n00b confirmed Lysaera is Mythic). Batch's proc structure unchanged | DB-scan + n00b | 2026.03.17a | 2026-06-15 |

### Pending — needs in-game screenshots before they can be fixed/trusted

From the 2026-06-15 companion sweep, these are wrong or unverifiable but have no usable screenshot in the archive:

- ✅ **Wrong-power pets RESOLVED 2026-06-15** (screenshots provided): Stalwart Golden Lion → Celestial Lion's Presence (262), Portobello DaVinci → Dungeon Master's Wisdom (263), Dread Warrior → Dreadwarrior's Insight (264), Cyclops War Drummer → War Drummer's Discipline (261). Blue Fire Eye, Wolf, Damaran Shepherd, Linu La'neral, Vampire Bride all verified correct as-is.
- ⏸️ **PARKED — Mini Apparatus of Gond** (249): n00b does **not own** this companion, so it can't be verified yet (verify when acquired). DB has it sharing Soradiel's Divine Judgement, but it's a Gond *construct* — the 3 captured Divine Judgement cards (c249/c259/c260) are all paladins, so its real power is unknown and likely wrong. This is the only un-verified companion power; everything else is confirmed.
  - ✅ Harper Bard (255), Armored Orc Wolf (257), Riotous Rothe (256) — all CONFIRMED from OCR-found archive cards (c118 / c070 / c071); the NW-Hub-sourced values turned out correct.

_OCR archive-sweep method (2026-06-15): ran pytesseract over all 267 cards in `docs/audit/companions/_up/` searching for companion/power names; 7 candidate hits, read at zoom to confirm. This is how to "check the screenshots" when there's no filename index — don't conclude "not in archive" from a text/manifest search alone._
- ✅ **Baby Boar** (power 84) RESOLVED 2026-06-15 (n00b in-game): correct stats are **Deflect + Critical Severity** (c075 was the right archive shot; c081 wrong). Was wrongly Maximum Hit Points; fixed.
- ✅ **Cold Iron Warrior's Discipline** (power 119) RESOLVED 2026-06-15 (screenshot): Combined Rating was wrongly 0 → fixed to 75 (tracks base IL 75). Damage vs Fey 1.13 confirmed (scales to 2.3% at IL 150).
- _Done 2026-06-15 (no screenshot needed): fixed garbled em-dash ("â€"" → "—") in 4 companion notes (companions 83/86, powers 10/88)._
- **War Boar's Instincts** (power 60) — screenshot-verified 2026-06-15: it's a PROC, not a stat buff (15% on At-Will hit → 82.5-magnitude aggravated wound over 4s at IL 550, once/sec). Combined Rating fix confirmed. Still TODO: model the proc-damage scaling across rarities (82.5 @ Legendary sits below the standard magnitude curve, so it needs a 2nd rarity data point before it can feed the damage layer).

Note: the old March-2026 automated audit flagged 28 companion "mismatches"; re-reading at full resolution found most were misreads (a "3" read as "1"/"5") or already-correct schema. Always re-read the screenshot at zoom before trusting an automated flag.

### Companion integrity scan (2026-06-15) — structurally clean

Full scan of all companion `powerRef`/`enhancementRef` + shared-power + CR/IL:

- ✅ **No broken references** — every companion resolves to a real power and enhancement.
- **Shared-power suspects** (one power used by 2 companions — the Cyclops War Drummer bug class):
  - ✅ power 250 Kingfisher's Wisdom — RESOLVED: Stalwart Golden Lion got its own power (Celestial Lion's Presence, 262); Kingfisher Intern keeps 250.
  - ✅ power 251 Elite Intern's Wisdom — RESOLVED: Portobello DaVinci got Dungeon Master's Wisdom (263); Elite Intern keeps 251.
  - ✅ power 254 Proud Pink Yeti's Presence — RESOLVED: Dread Warrior got Dreadwarrior's Insight (264); Proud Pink Yeti keeps 254.
  - ✅ power 252 Fire Eye's Insight — RESOLVED: Blue Fire Eye owns it; Archmage's Apprentice (renamed Halfling Wayward Wizard in-game) repointed to its real power Wayward Wisdom (169).
  - ✅ power 92 Vampire's Kiss — CONFIRMED legit: Vampire Bride verified has it; shared with Vampire by design (both vampires).
  - ✅ power 248 Highborn Status — RESOLVED: Demonic Servant owns it; Mercenary got its own power (Mercenary's Discipline, 265).
  - ⏸️ power 249 Divine Judgement — Soradiel (documented owner); **Mini Apparatus of Gond** PARKED (n00b doesn't own the companion — verify when acquired).
- ✅ **CR ≠ IL: RESOLVED** — power 119 Cold Iron Warrior (0→75) and power 174 Spiteful Hex (900→750) both fixed 2026-06-15. A full DB scan confirms no companion-power CR≠IL mismatches remain.

### Base-rarity re-anchoring + sheet reconciliation (2026-06-16)

Cross-checked all companion powers against the cached reference sheet (`docs/reference/sheets/sheet1__Companions_Equip_Bonuses.csv`, per-rarity Common→Mythic). **109 powers independently confirmed.** Then **re-anchored 23 pets** stored at too-high a base rarity (which hid lower-tier buttons) to their true lowest tier — each verified against n00b's in-game card (authoritative for both lowest tier and values), sheet confirming the scaling: Wailer, Dragonborn's Brawler, Golden Deep Crow, Blink Dog, Yeth Hound, Yeti, Baby Gorilla, Myconid, Neverember Guard, Minstrel, Goat, Makos, Boney, Windsoul Genasi, Dancing Shield, Radiant, Moonshae Druid, Cat, Slime, Golden Goat, Skeleton Dog, Jagged Blade, Hollyphant. Several value errors fixed too (Blink Dog 1.8, Windsoul Genasi 1.8, Dancing Shield 1.5-high, Goat's missing Max HP, Gromph 1.8→3.8). Energon left as the off-scale outlier; Allosaurus already correct.

- ✅ **3 MISSING companions ADDED** 2026-06-16 (were in n00b's collection + the sheet, absent from our DB): **Lightfoot Thief** (comp 267 → power 266 Halfling Thief's Discipline), **Blacksmith** (comp 268 → power 267 Blacksmith's Discipline, reflect proc), **Vanguard of the Citadel** (comp 269 → power 268 Divine Insight, Max HP + Crit Avoidance). Anchored at Rare (n00b's owned tier), values from sheet + cards c116/c119/c215; enhancements linked.

**Companion anchor/missing-pet pass COMPLETE** (2026-06-16): 23 pets re-anchored + 3 added. Lookup now shows every pet's full lowest→highest tier range. Remaining companion work (separate, lower-priority): ~20 proc-modeling reconciliations vs the sheet, and filling the other sheet tabs (Companion Skills, Enhancement Powers, Companion Gear).

## Gear set-bonus text (2026-06-15 steward sweep)

36 sets had their full set-bonus text verified against `docs/calibration/inbox/_set_details/` screenshots and written to `gear.json` (`parsedFrom:"screenshot"`). Set bonuses are set-wide, so one verified text covers every member. Verified texts are stored in `docs/audit/set_bonus_verified.json`.

| set | pieces | status | source screenshot |
|-----|--------|--------|-------------------|
| Pioneer | 2 | CONFIRMED (resolved conflict → party-scaling) | Pioneer_set_details.png |
| Pilgrim | 2 | CONFIRMED (resolved conflict) | Pilgrim_set_details.png |
| Company | 2 | CONFIRMED (was blank; +500 Power) | Company_set_details.png |
| Drowcraft | 4 | FIXED→CONFIRMED (3-of-Set −30%→−50%) | Drowcraft_set_details.png |
| Drowcraft Undergarb | 2 | CONFIRMED (was blank) | Drowcraft Undergarb_set_details.png |
| Black Ice | 3 | CONFIRMED (was 3-vs-4 ambiguous → 3pc) | Black Ice set_set_details.png |
| Aboleth | 2 | CONFIRMED | Aboleth_set_details.png |
| Tyrant | 2 | CONFIRMED | Tyrant_set_details.png |
| Mirage | 2 | CONFIRMED | Mirage_set_details.png |
| Sun | 2 | CONFIRMED | Sun_set_details.png |
| Vistani | 2 | FIXED→CONFIRMED (+500 Movement Speed→+500 Defense) | Vistani_set_details.png |
| Drowned Heart | 2 | CONFIRMED | Drowned Heart_set_details.png |
| Earthen Heart | 2 | CONFIRMED | Earthen Heart_set_details.png |
| Howling Heart | 2 | CONFIRMED | Howling Heart_set_details.png |
| Duality | 2 | CONFIRMED | Duality_set_details.png |
| Stormforged | 2 | CONFIRMED | Stormforged_set_details.png |
| Scalebreaker's Wrath | 2 | CONFIRMED | Scalebreaker's Wrath_set_details.png |
| Fortified Vale | 2 | CONFIRMED | Fortified Vale_set_details.png |
| Vale | 2 | CONFIRMED | Vale_set_details.png |
| Grand Alliance | 2 | CONFIRMED | Grand Alliance_set_details.png |
| Beholder Slayer | 2 | CONFIRMED | Beholder Slayer_set_details.png |
| Celestial | 2 | CONFIRMED (uniform across IL tiers) | Celestial_set_details.png |
| Blessed Blade | 2 | CONFIRMED (uniform across IL tiers) | Blessed Blade_set_details.png |
| Dusk | 4 | CONFIRMED (identical IL1058/1175) | Dusk_set_details.png |
| Masterwork II Weapon Set | 2 | CONFIRMED (Stronghold party buff) | Masterwork Il Weapon Set_set_details.png |
| Masterwork III Equipment Set | 2 | CONFIRMED (Alacrity 1%/5%) | Masterwork III Equipment Set_set_details.png |
| Masterwork of Menzoberranzan Equipment Set | 2 | FIXED→CONFIRMED (Speedy Anointing→Speedy Alacrity) | Masterwork of Menzoberranzan Equipment Set_set_details (2).png |
| Umbral Stride | 2 | CONFIRMED (IL3300; IL3900 unverified) | Umbral Stride_set_details (2).png |
| Prismatic Defier of Dread | 2 | CONFIRMED (uniform IL3100/3400) | Prismatic Defier of Dread_set_details.png |
| Peer Into the Void | 2 | CONFIRMED (uniform IL2750/3000) | Peer Into the Void_set_details (3).png |
| Skyhold Arms | 2 | CONFIRMED | Skyhold Arms_set_details (3).png |
| Dark Matter | 2 | CONFIRMED (uniform IL2500/2700) | Dark Matter_set_details (3).png |
| Demonweb Empowerment | 2 | CONFIRMED | Demonweb Empowerment_set_details.png |
| Meteoric Fury | 2 | CONFIRMED (3% — not 5/9%, those were Impending Doom mod-slot) | Meteoric Fury_set_details (2).png |
| Dragonflight | 4 | FIXED→CONFIRMED per-tier (IL≤596 +2,000HP/+500Pwr; IL1400 +5,000HP/+3,000Pwr — high tier was +1,000Pwr) | Dragonflight_set_details.png |

### Confirmed: NO set bonus (zero-placeholder in-game — do not add text)
- **Golden Dragon** (all weapon variants) and **Pact Blade of Elemental Fire** display "Equip: 0 [stat]" placeholders in-game — genuinely no functional 2pc set bonus.

### UNVERIFIABLE — need a new in-game capture (panel open, Item Level visible)
- **Blood Bargain**, **Infused Defense** — no `_set_details` screenshot at all.
- **Pioneer Raid/Assault**, **Pilgrim Raid/Assault** — separate 4pc sets; their headers were not in any capture (all captures showed the base 2pc set).
- Untaptured tiers: **Impending Doom** IL 3400 & 4550; **Whisper of Power** IL 3750; **Umbral Stride** IL 3900.
- **Enchanted Advantage/Awareness** lower tiers (IL2600/3000) and **Enchanted Healing** IL3000 (only IL3150 captured: Healing +2% OH, Awareness +2% Awareness).
- **Prestige** 4-of-Set (panel truncated; 2/3-of-Set = +1% Power / +10% DR while Controlled). **Vistani** IL650. **Lionsmane** 2-of-Set value (collection view showed "0 Max HP" — unreliable; 3-of-Set +1% Power confirmed).

### DEFERRED — complex, need a careful per-item/per-tier pass (not guessed)
- **Impending Doom** — the Unleashed bonus scales by IL (DPS/Heal +3%→+5%, duration 15s→20s at IL4800) AND the charge count is item-pair-driven (10 for Doomcleaver/Omen/Oathbreaker; 13 for Grimfang/Dirgeblade), not IL. The trailing "+N stat" lines are artifact mod-slot bonuses, not the set bonus.
- **Whisper of Power** — per-weapon flat stat grant (+5,200 Power / +7,700 Critical Strike / +7,200 Forte by item, IL3400).
- **Devil's Legion** — "+1000" tier confirmed but no IL visible in captures, so the 600/800/1000/1200 tiers can't be mapped.

### Integrity issues found (set-matching bugs) — 5 of 6 RESOLVED 2026-07-07
- ✅ **Pioneer Assault Sevars** (id 3543) — RESOLVED: `set` now reads "Pioneer Assault", `setSize:4`.
- ✅ **Vistani Pendant/Raiments** (ids 1250-1251) — `setSize` contradiction RESOLVED (now `2`, matches `pieces:2`). `item_level:0` residual is a SEPARATE bug that remains OPEN (needs a real IL value).
- ✅ **Lionsmane Armor** (ids 5212-5219 and the wider Lionsmane family) — RESOLVED: all members now use `set:"Lionsmane"` consistently, matching the equipBonus `setName`.
- ✅ **Masterwork II Equipment (25) vs Masterwork II Equipment Set (68)** — RESOLVED: only "Masterwork II Equipment Set" remains; the parallel duplicate is gone.
- ✅ **"Sun Set"** — RESOLVED: only "Sun" exists now; the spurious duplicate is gone.
- ✅ **Company "PvE" vs "PVE" family — RESOLVED 2026-07-08: NO SET BONUS EXISTS IN-GAME.** The capitalization split was fixed earlier; the deeper question (24-item family with zero `type:"Set"` equip bonuses — can the 4pc ever register?) is now answered by capture: the Company Raid Mask tooltip has **no set section at all** (stat block → Reinforced → slot/class footer; evidence `inbox/gear/Company Raid Mask_IL588_no-set-section.png`). The family is intentionally blank — our zero-set-bonus data is CORRECT. The `set:"Company PvE Armor"` label on 16 entries (vs `set:null` on ids 2628-2635) is a cosmetic cataloging inconsistency only; the engine can never mis-fire a bonus that has no markers.
- Minor (unchanged, still open): "Vistani Rapiera"/"Obsidian Omihuiclli" name typos; Titansteel Tabars slot (Main vs Off Hand); Manticore "Masterwork Armor II / Ranger Stronghold Set II" composite set string.

## Gear per-item EQUIP bonuses (2026-06-15 backfill)

Distinct from set-bonus text above: an item's own `Equip:` line. **514 items** now
carry a screenshot-sourced Equip bonus (`parsedFrom:"screenshot"`), backfilled
top-to-bottom across all armor tiers, clothing, and accessories from the existing
`docs/calibration/inbox/` archive. Per-item bonuses are read individually (NOT
propagated), since they vary by slot/variant.

**Armor tail — FULL SWEEP COMPLETE.** Every armor piece (Head/Armor/Arms/Feet)
outside the 35 blank-by-design families that had a screenshot was read: **~208
CONFIRMED have a bonus** (Shieldlord's/Adamant/Titansteel/Bronzewood Gladiator &
dual-HP-threshold lines, League's/League's Elite, Pioneer Leader's, Huntsman,
Crone's, Divine, Successor, Primal/Pilgrim/Lion Guard), **~95 CONFIRMED blank**.
102 weapon pieces in bonus-bearing families stay blank by design (set bonus only).
No readable armor/accessory equip-bonus gaps remain.

**Accessory tail — fully swept.** 103 low-IL (<IL1500) neck/ring/amulet/cloak
"gaps" resolved: **13 CONFIRMED have a bonus** (Survivor's missing-health ring
family — Tenacity/Accuracy/Focus/Might/Avoidance; Daily Defiance/Edge/Perk rings;
Cursed Strike; Challenger's Might), **90 CONFIRMED blank by design** (stat-sticks:
Dragonflight/Elemental/Drowcraft/Alliance/Guild rings+necks, all low-IL amulets,
Company cloaks, Valhalla necks). No readable accessory equip-bonus gaps remain.

**Blank-by-design (armor)** is catalogued in `docs/audit/equip_bonus_blank_families.md`
— 35 families (~621 items) confirmed to predate the per-item equip-bonus feature.

**Flagged for in-game re-verification (NOT fixed — do not guess):**
- Elemental Alliance Ward Ring (id 2321) / Assault Ring (id 2324), IL554 — oversized
  tooltip stats (+1,994/+2,992) with Combined Rating 222 (siblings ~499). Logged in
  `docs/data_issues.md`.

## Fighter endgame weapon sets — verified 2026-06-16 (n00b If-Equipped captures)

24 in-game captures from n00b (archived under `calibration/inbox/_set_details/` and
`.../gear/fighter-gear/{main-hand,off-hand}/`). All three sets written parsedFrom "screenshot".

- **Umbral Convergence** 2pc — IL3800 Advanced (ids 6898 Tombwarden's Guard / 6899 Dreadwatch
  Halberd) and IL4000 Greater (6896 Tombwarden's Bastion / 6897 Dread Sentinel). In-Thay Movement
  Speed +10%/+12%; IL4000 also +3% Forte; shared Daily proc (pull within 25ft, +5% Deflect
  Severity, enemy -2.5% Accuracy 6s, 30s CD). Source: `Umbral Convergence_IL3800_set_details.png`,
  `Umbral Convergence Greater_IL4000_set_details.png`.
- **Whisper of Power** 2pc — Ironfang (6884) + Bulwark of Ruin (6890), IL3400 = **+5,200 Power**
  (FIXED: was mislabeled "+10% Movement Speed in Thay"). Source:
  `Whisper of Power Ironfang+Bulwark_IL3400_set_details.png`.
- **Impending Doom** 2pc — Ironfang (6885-6889) + Bulwark of Ruin (6891-6895), IL3750-5250.
  FIXED→CONFIRMED: pre-existing data was a different pair's bonus (Heal +Outgoing Healing, no tier
  scaling, from a mis-named 2026-06-10 capture). Correct = DPS Base Damage Boost +3/3.5/4/4.5/5%,
  Tank -Incoming Damage matching, extras Power (flat 5,200 -> +5% -> +6%) + Combat Advantage
  (+3.5% -> +6%). Sources: `Impending Doom Ironfang+Bulwark_IL{3750,4100,4450,4800,5250}_set_details.png`.

Item-stat (Details-tab) captures for all three weapons at every tier also archived (`*_collection.png`).

FLAGGED (NOT verified, NOT fixed): broader Impending Doom "Heal +OH" suspect list (Aegis of the
Condemned, Oathbreaker's Malevolence, Codex of Eternal Chains, Omen of Doom, Strings of the
Forsaken, and dup-name Grimfang/Harrowed variants) — see `docs/data_issues.md` "Impending Doom
wrong-data signature ELSEWHERE". Some may be genuinely Healer-role; need captures.

## Impending Doom full-set reconciliation — verified 2026-06-16 (archive master captures)

Source: 43 `Impending Doom_set_details` + 8 `Whisper of Power_set_details` captures in
`calibration/inbox/_set_details/`, read by 5 parallel vision-extractor agents and cross-checked
(Paladin pair self-verified). Each capture header names its weapon pair, giving an authoritative
per-pair model (charges, role split, BDB ladder, extras). See `data_issues.md` "Endgame weapon
sets" for the full table.

FIXED→CONFIRMED (40 gear items rewritten to the verified model):
- **Oathbreaker's Malevolence + Aegis of the Condemned** (Paladin) — Tank+Heal, **no DPS**, 10 charges,
  Forte+Defense extras. ids 205/206/465/466/480/481/482/483/484/485/5328/5329/5330/5331.
- **Omen of Doom + Codex of Eternal Chains** (Warlock) — DPS+Heal, 10 charges, Crit Severity+Power.
  ids 3144/3145/5153/5154. (Codex 5154 CR3690 extras pattern-inferred — `derived`.)
- **Dirgeblade + Strings of the Forsaken** (Bard) — DPS+Heal, 13 charges, Power+Crit Strike.
  ids 4603/4604/4605/4607/4608/4609/4610/4873/4874.
- **Grimfang + Harrowed Messengers dup-name variants** — corrected from wrong Heal to verified
  pure-DPS, 13 charges, Crit Strike+Accuracy. ids 2693-2697 / 2699-2703 (canonical entries were
  already correct).
- Paladin IL4550 dup tiers (480/481, CR4065/4095) tier-matched to the +4% band — `derived`.

CONFIRMED-CORRECT (no change needed — captures matched existing data): Doomcleaver+Knot,
Eye of the Doomweaver+Remnant, Dread Confessor+Scream Seeker, Ironfang+Bulwark.

Bard Whisper of Power — RESOLVED 2026-06-16 (n00b Dirgeblade IL3400 capture): Dirgeblade +
Strings of the Forsaken = +5,200 Power (ids 4606/5642/4872). Source:
`Whisper of Power Dirgeblade+Strings_IL3400_set_details.png`.

UNVERIFIABLE (need a new capture): Warden of the Last Rite (Cleric) Impending Doom — only
remaining gap (n00b deferred 2026-06-16).

---

## Enchants (enchants.json) — screenshot-verified gemstones

2026-06-16: added two 3-stat-per-slot Universal gemstone enchants at Celestial, transcribed from in-game Uncommon (IL 300) tooltips and scaled ×6 (IL 300→1,800, Combined Rating 270→1,620 — the standard gemstone scaling).

| id | name | status | source screenshot | notes |
|----|------|--------|-------------------|-------|
| 41 | Celestial Sugilite | CONFIRMED | inbox/enchants/uncommon-sugilite_il300_celestial-source.png | Off: CA 864 / Crit Strike 1296 / Crit Sev 1296 · Def: Defense 756 / Awareness 864 / Deflect Sev 1620 · Util: Ctrl Bonus 1080 / Ctrl Resist 1080 / Out Healing 864 |
| 42 | Celestial Obsidian | CONFIRMED | inbox/enchants/uncommon-obsidian_il300_celestial-source.png | Off: Power 756 / Accuracy 1404 / Crit Sev 1296 · Def: Crit Avoid 1188 / Deflect 1620 / Deflect Sev 1620 · Util: Forte 972 / Ctrl Bonus 1080 / Inc Healing 1296 |
| 43 | Celestial Netherite | CONFIRMED | inbox/enchants/celestial-netherite_il300-source.png | uniform 3-stat (all 1080). Off: Power/Accuracy/Combat Advantage · Def: Defense/Deflect/Deflect Sev · Util: Forte/Ctrl Resist/Out Healing |
| 44 | Celestial Skullite | CONFIRMED | inbox/enchants/celestial-skullite_il300-source.png | uniform 3-stat (all 1080). Off: Power/Accuracy/Crit Strike · Def: Defense/Crit Avoidance/Deflect · Util: Forte/Ctrl Resist/Inc Healing |
| 40 | Celestial Rime Temper (R) | FIXED→CONFIRMED (Celestial: HP 16→15, IDR -13→-12, debuff 4→4.5%/stack; name +\" (R)\") | inbox/enchants/Celestial Rime Temper (R)_IL7000_celestial-verified.png | n00b's PS5 tooltip 2026-07-03; Mythic (14/-11/4%) separately verified 2026-03-17. Uncommon–Legendary rows remain estimates. NW Hub + Arc Mod-32 preview independently corroborate 15/12 |

## Max HP formula — SOLVED EXACTLY via nine-state in-game calibration (2026-07-03/04)

Controlled A/B protocol on n00b's tank Paladin (Erik, TIL 147,487): one change per step,
HP+TIL read each time, re-slot + confirm-return between steps. Result (commit 9c7e9ba):

`MaxHP = (TIL×10×role + item flat HP) × (1 + CON×0.5% + insignia-bonus% + VIP%) × (1 + boon% + overload%) × (1 + enchant%)`

All 8 reproducible states match within 1–2 HP (worst 0.0001%). Verified per-source facts
(all CONFIRMED, screenshot/measurement evidence in `docs/calibration/evidence/2026-07-04_*`):

| fact | measured value | note |
|------|----------------|------|
| Base HP | TIL×10, tank ×1.2, healer ×1.1 | game's own HP tooltip states it verbatim |
| CON | +0.5%/point, base bucket | campfire +1-CON A/B exact (11,611 HP) |
| Guardian's Spirit | 8/12/15% ladder, base bucket | live bonus text + instance-2 A/B exact (92,078) |
| VIP (rank 3+) | +1% Max HP per VIP party member (max 5) | "The Power of VIP" buff; solo = 1% |
| Bulwark boons ×4 | 0.2%/rank each (tooltip TRUE), boon bucket | decrement A/B = 27,457 = 1%×base×enchant |
| Bulwark of Brimstone (overload) | 5% (tooltip TRUE), boon bucket | the "+6.375% phantom" = 5%×1.275 base |
| Rime Temper | +15% Celestial, own enchant bucket; IL 7,000 rides TIL | unslot A/B exact |
| Prime Rib | +20,000 flat HP (+4,000 Power) | eat A/B = +31,964 = 20,000×full chain, exact |
| Insignias | flat values ×1.5 Celestial; preferred slot ×1.2 on stats AND IL (750→900) | TIL-verified |
| Duplicate insignias on one mount | DO stack (both count) | Snowtusk A/B — earlier dedup theory disproven |
| Power boons ×4 | 1.0% each (tooltip TRUE) | stat-panel A/B 39.2→35.2% |
| Blessed Resilience R3 proc | +6% Max HP (2%/rank ×3, tooltip TRUE), boon bucket | live proc A/B 2026-07-04: healed/standing ratio 1.055045 == (1.09+0.06)/1.09 to 6 decimals — first live proc verification; also proves master boons sit in the boon bucket |

Session artifacts: build-state screenshots in `docs/calibration/inbox/boons/` +
`evidence/2026-07-04_*`; session baseline in `docs/audit/_tank_baseline_2026-07-03.json`.
n00b's LIVE build vs his shared link (input drift found during calibration): Snowtusk
slot 2 = Enlightened of **Brutality** (not Fortitude), abilities are 1 lower across the
board (entered while campfired; CON 29 not 30), overloads include **Bulwark of Brimstone**,
boon spend is 104+1 pts (not 132), guild boons Power/Awareness/Movement confirmed active.

## Mounts (mount_*.json) — verification pass 2026-06-16 (vs cached sheet1 mount tabs)

| file | result |
|------|--------|
| **mount_insignia_bonuses** (43) | ✅ VERIFIED — all 32 sheet bonuses matched; 0 required-insignia mismatches, 0 missing |
| **mount_insignias** (49) | ✅ VERIFIED — every Mythic Combined Rating matches the sheet; Celestial already derived via `tierScaling` (×1.5) |
| **mounts** (337) | ✅ 0 missing (all 278 sheet mounts present + 59 more). 268 "insignia-bonus" diffs are NOT errors (sheet lists *compatible* bonuses; our `bonusRef` is the mount's own, informational). Sheet typos where OUR data is right: Uni "Celectial Luck", Griffon "Oppotunism", Giant Space Hamster "Hamstphere". |
| **mount_collars** (75) | linear rank scaling I–V consistent; not in sheets; **NO Celestial tier** (owner-confirmed) |
| **mount_equip_powers** (56) | stored at Mythic, most match sheet |

**Needs in-game tooltips (NOT auto-fixed — sheet is community-sourced; our values may be the verified ones):**
- Equip power values disputed: **Stalwart** 30000 vs 18000, **Deadly Decay** & **Dash of Life** 15000 vs 9000 (Max HP, ~1.67×); **Pack Tactics** & **Unstoppable Force** 2953 vs 2250; **Rapid Accuracy** 3000 vs 4500.
- Mount→power name diffs (real, not typos): **Heavy Giant Spider / Apparatus of Gond / Glorious Whirlwind** (ours Heroic Soul vs sheet Dominant Force), **Yellow Butterfly Swarm** (Dawn vs Dash of Life), **Tenser's Floating Disk** (Rejuvenating Favor vs Tenser's Transformation), **Legendary Recon Balloon** & **Volcanic Flail Snail** (combat-power name variants).

**Celestial PARKED** — equip/combat powers are at Mythic; no reliable Mythic→Celestial multiplier (companions ×1.2 vs insignias ×1.5). Need a Celestial-rarity mount equip+combat tooltip to lock the factor. No such screenshot exists in any archive. See [[project-mount-celestial-pending]].

## Overloads (overloads.json) — screenshot-verified, conditional

2026-06-16: added 26 Overload enchants from in-game tooltips (`inbox/enchants/overload-*.png`). All modeled CONDITIONALLY so they never inflate a general build:
- **Enemy-type** (Undead, Fiend = Demons/Devils/Fiends, Astral Elf): `enemyType` + `damagePct` (slayers) or `percentStats.Incoming Damage` (wards).
- **Zone** (The Reghed Edge, Doomvault, Thay, Pirate's Skyhold, Dread Vault, Wildspace, +Trial/Jotunskar/Soul Harvest Trial): `equipBonuses` with `zones[]` — Dmg Bonus / Incoming Damage / Outgoing Healing / Incoming Healing.
- **Natives** = multi-zone, multi-effect (the +2% Accuracy leg is in notes/effectText, not structured, to avoid percent-vs-rating ambiguity). **Pirates' Skyhold Tracker** = 3% lifesteal (no clean engine stat — catalogued via notes).
- Skipped 2 already present: Astral Elf Slayer, Wildspace Slayer.

## Artifacts (artifacts.json) — DO NOT bulk-source stats from sheet1

2026-06-16: tried updating all artifact stats to "Mythic" values from the cached `sheet1__Artifacts.csv` (community sheet) — n00b reviewed the result and the IL/CR/stats all looked wrong, so it was **reverted**. Lesson: **sheet1's artifact stat columns are NOT reliable** for our display (and its `CombinedRating` column ~85,000 is junk). Artifact stats must come from in-game screenshots, not this sheet. The page's "Stats at Mythic" label vs. the stored low-rank values is a known open question — resolve with screenshots, not the sheet.

## Consumables (buffs.json) — community-guide entries needing in-game verification

Added/fixed 2026-06-16 by cross-referencing the cached `sheet2__Consumables_and_belt_Items.csv` (Aragon's Mod 24 guide) against our data.

| id | name | system | status | notes |
|----|------|--------|--------|-------|
| 11 | Wild Storm Elixir | buffs | name CONFIRMED | Renamed from typo "Wild Strom Elixer"; stat values (+2,000 Critical Strike, +5% Critical Severity) already matched the guide — corrected the misleading "+2200 Crit & Accuracy" note |
| 137 | Honeyed Bread | buffs | UNVERIFIED | +20,000 Max HP, +4,000 Defense (Stronghold food) — from community guide; needs in-game screenshot |
| 138 | Ratatouille | buffs | UNVERIFIED | +20,000 Max HP, +4,000 Accuracy (Stronghold food) — from community guide; needs in-game screenshot |
| 139 | Owlbear Figurine | buffs | UNVERIFIED | 1,000 Magnitude damage proc, 60s cooldown (Battle Belt) — from community guide; needs in-game screenshot |

Note: "Empowered Chain of Scales" from the guide is NOT a separate item — it's the top tier (+3% Awareness) of our existing tiered "Chain of Scales" (id 93).

---

## Known intentional outliers (CONFIRMED by design — never re-flag)

These look "off-scale" but are verified correct per `website/CLAUDE.md`. The Steward treats them as CONFIRMED and never proposes "normalizing" them.

| id | name | system | why it's correct |
|----|------|--------|------------------|
| power 201 | Energon | companion_powers | +35,000 MaxHP at IL 750 — deliberately off the MAX_HP scale (verified) |
| power 49 | Raptor's Instincts | companion_powers | 4.5% Power at IL 900 — per-stack party power (Part of the Pack, max 5), not single-stat scale (verified 2026-06-05) |
| power 89 | Bobby's Vigor | companion_powers | +12,000 MaxHP + 4.5% Defense at IL 750 — hybrid, off both scales (verified 2026-06-05) |
| — | Gemstone enchants (multi-stat) | enchants | 2700/1485/1080 per-stat at Celestial are correct (1/2/3-stat-per-slot by design, ×6 from Rank 1) |

---

## Tank defensive-stat calibration — CLOSED 2026-07-04

Erik (Paladin Justicar tank, TIL 147,787). All five defensive RATINGS now match the PS5 sheet within ±1. Verified via fresh tooltips (archived in `docs/calibration/inbox/`):

| item | system | status | notes |
|------|--------|--------|-------|
| Wrath of Kossuth | artifacts | CONFIRMED (was wrong) | Tooltip: +1,650 CritAvoid / +2,250 Deflection / +2,250 Deflect Severity / +1,700 CR at IL 2,000. Stored 1,500s were unverified — fixed. Explained CritAvoid −150 / Deflect −750 / DeflectSev −750 gaps exactly. |
| Sealing Parchment | artifacts | CONFIRMED | 1,365 Def / 1,560 CA / 1,560 Awareness / +15% Stamina Regen / 2,600 CR. The 15% was stored as rating 15 — moved to percent channel. |
| Crimson Calamity | artifacts | CONFIRMED | 1,365 Def / 2,925 DeflectSev / 1,560 CA / +15% Stamina Regen / 2,600 CR. Same percent-channel fix. |
| Ritualistic Necklace | gear | CONFIRMED | 1,215 CA / 2,126 Def / 1,671 CritAvoid / 3,645 CR + jewel line "Major Stamina Regeneration Jewel +1 = +2.2%" (kits.json had 1.5 — fixed). Tooltip also shows +3 STR / +3 CON. |
| Abyss Conquerer's Provoker Cuirass | gear | CONFIRMED | 1,538 CA / 1,538 Awareness / 1,845 CR; Provoker's Stance text matches restored 3-effect structure; kit +3,520 Max HP confirmed. |
| Major Stamina Regeneration Jewel +1 | kits | CONFIRMED (was wrong) | 2.2% per jewel (was 1.5% unverified). Stamina Regeneration panel: at-rest 53.6% now EXACT. |
| Crimson Crystal Horse slot 3 | build-side | n/a | Build had Crescent of Courage; game has Crescent of Balance — user build fix, not data. Defense rating exact after fix. |
| Quick Action (Celestial Dragonnel preview) | mount_equip_powers | CONFIRMED | Celestial 7.9% AP / CR 3,544 / IL 3,937 = Mythic 6.0% × 1.3125 — first confirmation the Celestial ratio applies to equip-power STAT values, not just IL. |

RESOLVED SAME DAY: Action Point Gain — the build was missing the Call of Power advanced boon pick (3 pts = +3%; data already modeled it); tool 10.25 vs game display 10.2. Defense percent — Coldsilver Circlet's narrative '+3% Defense' rider extracted (tool 104.0 vs game 104.2; last 0.2 = display rounding, accepted). Aura of Protection verified 4% and counted at rest by both game and tool. 61 companion powers normalized to canonical rungs + engine table-ratio scaling (Bruenor's Bulwark 4.50 at Celestial, was 4.56). Pack Tactics 2,953 cross-validated by the CA rating matching ±1. FULL SHEET NOW MIRRORED: all ratings ±1, all percents ±0.2.

---

## Healer (Lia, Warlock Soulweaver) TIL/HP floor — logged 2026-07-04

Anchors: Damage EXACT (15,450 = TIL-damage + Omen of Doom +100). TIL: tool 139,543 vs game
139,542 (+1); HP at-rest: tool 1,745,147 vs game 1,745,135 (+12 — entirely the TIL+1 through
the x10 x1.1 heal pool plus rounding). EVERY input atom verified: all 12 gear ILs
(screenshots), all 4 artifact ILs (in-game reads: Scepter/Mask 1,500, Censer/Skull 2,600),
comp gear x3, kit names all "+1", categories structurally Erik-validated. Remaining +1 is
attributed to the game's internal integer rounding of the two Celestial mount-power ILs
(true 3,937.5 each; game displays 3,937) — Erik's pair sums to 7,875 in-game, Lia's evidently
7,874. UNFALSIFIED ALTERNATIVE: kit-family IL variation (Major Power / Crit Severity Armor
Kit +1 never IL-verified; jewels + HP kits = 44 via Erik). Check a spare kit tooltip's Item
Level line if one ever surfaces. Build-side note: Lia's ability inputs were campfire-inflated
(+1 all); corrected to at-rest values during this session.

---

## Healer (Lia) stat calibration — 2026-07-05 session

All ratings now EXACT (±3 floor): Power 156,244 / Acc / CA / CS / CSev 154,046 / Forte 138,285 / OH / IncH.
Proven via tooltips + in-game A/B probes:

| finding | status |
|---------|--------|
| Head item was WRONG ITEM in build: live = Wintermarked Mender Barbute (CS 5,130 + CSev 5,130 + Survivor's Instinct >90%hp +9% OH), build said Hunter Hood (CS+Forte). Same-name-family trap. | build fixed |
| Cautious Devotion: FULL 5 stacks standing (2,500 Forte + 5% OH) with >=1 instance; duplicate adds NOTHING (both-break A/B). | data fixed (cumulative instanceStats) |
| Mender's Covenant: 1,500 + 750 diminishing per stat, all 8 stats — defensive block matched exactly. | model CONFIRMED |
| Preferred insignia slots: two probes, each −1,350 stat −720 CR −900 TIL. | CONFIRMED |
| Divine Aegis +9% OOH is static (game OOH = OH + 9) — was hidden behind conditional. | data fixed (alwaysActive) |
| Boon-cost: masters escalate (her 4th cost 4/rank, next previews 5) — re-confirms Erik model. Her tool counter 120 vs game 121: 1 pt of picks missing in build transcription. | open (minor) |
| Dawnshard Raiment Power 1,273 (was 1,275). | data fixed |
| CSev overcap proven visible: game rating contribution capped at 60% (overcap rating invisible in %). | noted |

RESOLVED SAME NIGHT: OH gap = Dawnshard's Rested Healing uptime-averaged instead of full-at-rest (stamina thresholds now graded-full); Forte gap = Graceful Harmony's +1.5% Forte aura includes YOURSELF; Soul Manipulation carries no hidden static. After fixes: Forte 66.2 / OH 93.6 / OOH 102.6 / CritSev 106.5 — ALL EXACT vs live sheet. TWIN −0.4 RESOLVED 2026-07-05 (day session): the game ROUNDS each Forte-distribution share to a whole percent (8-state probe proof on Lia; Erik regression: his last +0.2 Defense residual was 50%-share 25.77→26). Along the way: Mender's Covenant diminishing model confirmed at n=1 (single-copy probe, ratings exact); boons proven NOT suppressed during loadout edits (Power% test). BOTH CHARACTERS NOW EXACT ON EVERY STAT, rating and percent. Remaining cosmetics: boon-pick −1 (cost quirk on one of Lia's unique boons), TIL +1 floor. Lingering Medicine = potion-only (documented).

---

## Paladin/Bard Impending Doom + Whisper of Power weapons — verified 2026-07-07 (gear.json Wave 1 sweep)

Steward sweep (pre-launch optimizer trust campaign). Screenshots:
`docs/calibration/inbox/gear/bard-gear/artifacts/Dirgeblade_IL{3400,3750,4100,4450,4800,5250}.png`,
`docs/calibration/inbox/_set_details/Dirgeblade {Whisper of Power_IL3400, Impending Doom_IL3750...IL5250}_set_details.png`,
`docs/calibration/inbox/gear/paladin-gear/artifacts/Aegis of the Condemned_IL3400.png`,
`docs/calibration/inbox/_trash/originals/Aegis Of The Condemned.png` + `(2)`–`(11).png` (SHA-256-unique, two scroll positions per tier, IL3750–5250).

| id | name | system | status | source screenshot | data version | date verified |
|----|------|--------|--------|-------------------|--------------|---------------|
| gear 5642 | Dirgeblade (IL 3400) | gear | CONFIRMED (Acc3315/CS3060/CR3060; Whisper of Power 2pc +5,200 Power flat) | Dirgeblade_IL3400.png + Dirgeblade Whisper of Power_IL3400_set_details.png | 2026.03.17a | 2026-07-07 |
| gear 4606 | Dirgeblade (IL 3400, description mirror) | gear | CONFIRMED (same evidence as 5642) | Dirgeblade_IL3400.png | 2026.03.17a | 2026-07-07 |
| gear 4607 | Dirgeblade (IL 3750) | gear | CONFIRMED — base stats only (Acc3656/CS3375/CR3375 match; the 2pc Unleashed %/duration panel was cut off in the capture — stored 3%/3% and duration text are inferred, not screenshot-proven; see UNVERIFIABLE list below) | Dirgeblade_IL3750.png | 2026.03.17a | 2026-07-07 |
| gear 4608 | Dirgeblade (IL 4100) | gear | FIXED 2026-07-07 (was MISMATCH: base stats Acc3997/CS3690/CR3690 + Unleashed 3.5%/3.5% CONFIRMED; stored duration/CD text ("...5s-in-combat...~20s") is wrong — screenshot shows 1-per-7s combat, 15s duration) | Dirgeblade_IL4100.png + Dirgeblade Impending Doom_IL4100_set_details.png | 2026.03.17a | 2026-07-07 |
| gear 4609 | Dirgeblade (IL 4450) | gear | FIXED 2026-07-07 (was MISMATCH: base stats + 4%/4% + equip +5% Power/+3.7% CS CONFIRMED; stored duration/CD text wrong — screenshot shows 7s combat, 15s duration, not "~20s") | Dirgeblade_IL4450.png + Dirgeblade Impending Doom_IL4450_set_details.png | 2026.03.17a | 2026-07-07 |
| gear 4610 | Dirgeblade (IL 4800) | gear | CONFIRMED (4.5%/4.5%, 5s combat/20s duration, +5% Power/+3.7% CS — full match) | Dirgeblade_IL4800.png + Dirgeblade Impending Doom_IL4800_set_details.png | 2026.03.17a | 2026-07-07 |
| gear 7387 | Dirgeblade (IL 5250) | gear | CONFIRMED (5%/5%, 5s/20s, +6% Power/+7.5% CS — full match) | Dirgeblade_IL5250.png + Dirgeblade Impending Doom_IL5250_set_details.png | 2026.03.17a | 2026-07-07 |
| gear 486 | Aegis of the Condemned (IL 3400) | gear | CONFIRMED (Awareness2040/OH2040/CR3060, no Unleashed at this tier) | Aegis of the Condemned_IL3400.png | 2026.03.17a | 2026-07-07 |
| gear 1802 | Aegis of the Condemned (IL 3,400, dup) | gear | CONFIRMED (same evidence as 486) | Aegis of the Condemned_IL3400.png | 2026.03.17a | 2026-07-07 |
| gear 5240 | Aegis of the Condemned (IL3400, plain name) | gear | CONFIRMED (same evidence as 486) | Aegis of the Condemned_IL3400.png | 2026.03.17a | 2026-07-07 |
| gear 484 | Aegis of the Condemned (IL 3750) | gear | FIXED 2026-07-07 (was MISMATCH: base Awareness2250/OH2250/CR3375 + Unleashed 3%/3% CONFIRMED; Forte is wrongly stored as a 7% percent — screenshot shows a flat +7,200 rating; duration/CD text wrong, should read 1-per-9s combat/15s, not "~20s") | Aegis Of The Condemned (2)–(11).png [IL3750 scroll position] | 2026.03.17a | 2026-07-07 |
| gear 482 | Aegis of the Condemned (IL 4100) | gear | FIXED 2026-07-07 (was MISMATCH: base Awareness2460/OH2460/CR3690 + Forte +7% + Unleashed 3.5%/3.5% CONFIRMED; duration/CD text wrong, should read 7s combat/15s not "~20s") | Aegis Of The Condemned (2)–(11).png [IL4100 scroll position] | 2026.03.17a | 2026-07-07 |
| gear 5330 | Aegis of the Condemned (IL 4450) | gear | FIXED 2026-07-07 (was MISMATCH: base Awareness2670/OH2670/CR4005 + Forte7%/Defense2.5%/Unleashed4%/4% CONFIRMED; duration/CD text wrong, should read 7s/15s not "~20s") | Aegis Of The Condemned (2)–(11).png [IL4450 scroll position] | 2026.03.17a | 2026-07-07 |
| gear 465 | Aegis of the Condemned (IL 4800) | gear | FIXED 2026-07-07 (was MISMATCH: base CS2880/Awareness1920/OH1920/CR4320 + Forte7%/Defense2.5%/Unleashed4.5%/4.5%/5s/20s all CONFIRMED correct; equipBonuses[0] is a stale unstructured placeholder stub ("Set Impending Doom (0/2)...-1%/-1%...+x% Forte") duplicating/contradicting the real structured entries below it — delete) | Aegis Of The Condemned (2)–(11).png [IL4800 scroll position] | 2026.03.17a | 2026-07-07 |
| gear 206 | Aegis of the Condemned (IL 5250) | gear | CONFIRMED (CS3150/Awareness2100/OH2100/CR4725, Forte8%/Defense5%, Unleashed5%/5%/5s/20s — full clean match) | Aegis Of The Condemned (2)–(11).png [IL5250 scroll position] | 2026.03.17a | 2026-07-07 |
| gear 5328 | Aegis of the Condemned (IL3750, dup) | gear | FIXED 2026-07-07 (was MISMATCH: stat identity wrong: stored "Critical Strike 2250" should be "Outgoing Healing 2250" to match sibling 484; Forte 7%→flat 7,200; same duration-text bug as 484) | same evidence as 484 | 2026.03.17a | 2026-07-07 |
| gear 5329 | Aegis of the Condemned (IL4100, dup) | gear | FIXED 2026-07-07 (was MISMATCH: stat identity AND value wrong: stored "Critical Strike 2490" should be "Outgoing Healing 2460" to match sibling 482) | same evidence as 482 | 2026.03.17a | 2026-07-07 |
| gear 5331 | Aegis of the Condemned (IL4800, dup) | gear | FIXED 2026-07-07 (was MISMATCH: missing Awareness 1920 entirely; screenshot + sibling 465 both show the 3-stat CS/Awareness/OH layout) | same evidence as 465 | 2026.03.17a | 2026-07-07 |
| gear 1807–1811 | Aegis of the Condemned · Epic/Legendary/Mythic/Ascendant/Maximum (legacy quality-rung dupes) | gear | FIXED 2026-07-07 (relabel locked by n00b: item_level corrected to 3750/4100/4450/4800/5250 per each row's CR; set/setSize/setBonus/equipBonuses mirrored from verified canonical ids 484/482/5330/465/206; was INTEGRITY: stuck at IL3400 with "Whisper of Power (2/2)" mislabels) | indirect (matches canonical IL tiers' evidence) | 2026.03.17a | 2026-07-07 |
| gear 487 | Oathbreaker's Malevolence (IL 3400) | gear | CONFIRMED (Power1785/Defense1785/CR3060; Whisper of Power 2pc "+7,200 Forte" clean, no Unleashed) | Aegis of the Condemned_IL3400.png (paired weapon panel) | 2026.03.17a | 2026-07-07 |
| gear 1801 | Oathbreaker's Malevolence (IL 3,400, dup) | gear | FIXED 2026-07-07 (was MISMATCH: ratingStats match 487; but the top-level `setBonus` string has IL4450-tier Unleashed text (Tank-4%/Heal+4%, 7s/15s) grafted onto it — this tier has no Unleashed mechanic at all; should read "+7,200 Forte" like 487) | same evidence as 487 | 2026.03.17a | 2026-07-07 |
| gear 466 | Oathbreaker's Malevolence (IL 4800) | gear | CONFIRMED (full match) | Aegis Of The Condemned (2)–(11).png [IL4800 scroll, Oathbreaker panel] | 2026.03.17a | 2026-07-07 |
| gear 205 | Oathbreaker's Malevolence (IL 5250) | gear | CONFIRMED (full match) | Aegis Of The Condemned (2)–(11).png [IL5250 scroll, Oathbreaker panel] | 2026.03.17a | 2026-07-07 |
| gear 481 | Oathbreaker's Malevolence (IL 4450) | gear | FIXED 2026-07-07 (was MISMATCH — SEVERE: entire equipBonuses block (Base Damage Boost 4% / Power 2.5% / Critical Severity 7.5%) is byte-identical to the Warlock Omen of Doom (id 7390) / Codex of Eternal Chains (id 7391) DPS block; Paladin has no such DPS line — should be Forte 7% / Defense 2.5% / Unleashed Tank-4%/Heal+4%, 10 charges, 7s combat, 15s duration, matching sibling Aegis 5330) | Aegis Of The Condemned (2)–(11).png [IL4450 scroll, Oathbreaker panel] | 2026.03.17a | 2026-07-07 |
| gear 1805 | Oathbreaker's Malevolence · Mythic (legacy rung) | gear | FIXED 2026-07-07 (relabeled to IL4800 per its CR 4320; set data mirrored from verified id 466; was INTEGRITY: stuck at IL3400) | indirect | 2026.03.17a | 2026-07-07 |
| gear 1806 | Oathbreaker's Malevolence · Ascendant (legacy rung) | gear | PARTIAL FIX 2026-07-07 (relabeled to IL5250 per its CR 4725; set data mirrored from verified id 205) — ratingStats still UNVERIFIABLE (missing Power stat; Defense 2937 vs ~1837 expected; no screenshot exists; do not guess) | none — needs capture for stats | 2026.03.17a | 2026-07-07 |
| gear 1803, 1804 | Oathbreaker's Malevolence · Epic/Legendary (legacy rungs, same ladder) | gear | FIXED 2026-07-07 (same stale-IL bug as the rows above, included in the same relabel: 1803→IL3750 mirrored from id 483, 1804→IL4100 mirrored from id 485) | indirect | 2026.03.17a | 2026-07-07 |
| gear 72 | Bulwark of the Zulkirate | gear | FIXED 2026-07-07 (was INTEGRITY: missing `perStack:true`/`maxStacks:5` present on sibling id 53 "Bulwark of the Eternal Zulkirate"; engine currently credits only 1% Critical Strike/Severity instead of the tooltip's 5-stack ladder) | sibling schema (id 53) + in-data description text | 2026.03.17a | 2026-07-07 |
| gear 441 | Arcane Conduit Seal — Pressured Muse (formerly "Demon Skull") | gear | RESOLVED 2026-07-07 (re-add locked by n00b; Wave 2 then found Demon Skull ALREADY exists tooltip-verified as artifacts.json id 95 — the interim gear.json copy (id 7401) was removed as dead data and gear 441's migration note now points at artifacts 95; was INTEGRITY — BLOCKER: deleted item's id silently recycled) | n/a (integrity finding) | 2026.03.17a | 2026-07-07 |
| gear 7401 | Demon Skull (interim restore — superseded) | gear | SUPERSEDED same day: created from baseline 420454c, then Wave 2 audit found the verified canonical copy at artifacts.json id 95 and a code-path check proved this gear copy unreachable — removed 2026-07-07. See the Wave 2 Demon Skull row below | n/a | 2026.03.17a | 2026-07-07 |
| gear 200 | Ebon Crusader's Aegis | gear | UNVERIFIABLE (Blood Bargain 2pc set bonus text entirely absent; a pre-e50971a baseline had "+12% Movement Speed / +3% Forte while in Thay" but it was never screenshot-confirmed — capture needed before restoring) | none | 2026.03.17a | 2026-07-07 |
| gear 201 | Oathbreaker's Judgment | gear | UNVERIFIABLE (same Blood Bargain 2pc gap as 200) | none | 2026.03.17a | 2026-07-07 |

### Integrity (structural, not per-screenshot) — gear.json Wave 1 sweep 2026-07-07
- **Company PvE Armor family (24 items: ids 2628–2635 `set:null` + ids 3127–3134/3867–3889 `set:"Company PvE Armor"`)** — no member carries a `type:"Set"` equip bonus, so the 4pc can never register in toon-forge's `countSetPieces()`. Needs 1 screenshot before writing anything.
- **16 one-member set families** (ids 141, 147, 171, 172, 177, 182, 1889, 1890, 5025, 5040, 5077, 5089, 5137, 5179, 7381, 7396) — each `set` value only matches itself; either the partner piece is genuinely missing from our data or the name has drifted. Needs per-family check, not a blind rename.
- **6 set:null orphan duplicates — 5 DELETED 2026-07-07, 1 HELD.** Pre-delete verification showed 5 pairs truly redundant (core stats identical, twin carries the richer set/notes): ids 2769, 2786, 2787, 2790, 2806 deleted; twins 3984, 4001, 4002, 4005, 4021 retained. **id 2791 vs 4006 (Enchanted Bregan D'aerthe Assassin's Longboots) HELD — NOT a duplicate in its bonus block:** the two rows are conflicting readings of a bad capture (2791: Brute's Expertise Critical Strike 7.5% + structured "Attentigor" Power 7.5% alwaysActive; 4006: Critical Severity 7.5% + "Positional Advantage" marked "[pending re-verify — small/dark capture]"). Needs one fresh in-game tooltip to resolve; both rows kept until then. Minor note: the deleted 2769's unstructured Scaled Disdain text read "up to −9%" vs twin 3984's "up to −70%" (screenshot-parsed entries on both agree at −20%; scaling proc, not engine-consumed) — a Jackboots re-capture would tidy that text.
- **e50971a worklist** (82 items, `docs/audit/_e50971a_dropped_structured.json`) — 2026-07-07 classification: 19 RESTORED (no action), 10 PARTIAL with concrete recoverable values (ids 39, 42, 52, 57, 61, 62, 71, 74, 210, 218, 297) — **restored 2026-07-07 (Batch 5)**, 49 MISSING (7 total-loss needing fresh screenshots: 237, 238, 240, 257, 258, 261, 262), 2 SUSPECT-do-not-restore (205/206 — current data verified correct, old baseline value wrong), 1 BLOCKER (id 441, above).
  - **Batch 5 detail:** 9 of the 11 listed ids got a new structured `equipBonuses` entry parsed straight from the item's own current tooltip text (39 Incoming Damage −4%; 42 Recharge Speed +5%; 52/71 Thayan Hunter Defense half, mirroring the already-structured Power zone-split; 57/61 the missing Movement Speed half of the Undying's Grasp pairing; 74 Movement Speed +10%; 210 Critical Strike +7,500 flat, health<50% branch; 218 Awareness +1% and Movement Speed −2.5% self-debuff, both per-stack). id 62 needed **no edit** — both halves (Defense/Power) were already structured; only flagged for tooltip drift. id 297's baseline-only Thay-Defense delta (+0.8%) was **not added** — the item's current tooltip text doesn't mention it at all (only Thay Awareness + non-Thay Defense/Awareness), so it stays unstructured pending a fresh in-game screenshot rather than restoring an unverifiable baseline number.
  - **Flagged for in-game tooltip re-verification** (value is used as-authored from the current description, but is suspicious enough to want a screenshot): **id 42** Crown of the Everscourge — description says Recharge Speed +5%, old baseline said +3%; **id 57** Greaves of the Unbroken Doctrine — description pairs Incoming Healing 40%/Movement Speed 13%, old baseline had the pairing reversed (40/13 swap); **id 62** Vambraces of the Tyrant's Grip — Defense value read as 4% in the current tooltip vs 3% in the old baseline, already structured at 4%, left unchanged; **id 297** Visor of the Red Bastion — baseline's Thay-only +0.8% Defense delta has no corroboration anywhere in the current tooltip text, skipped rather than guessed.
- Minor nits (auditor pass, not independently re-verified): ids 1591 vs 3492 (tracked dup), 5247 vs 7150 (Lifeforged Shield schema divergence), 4184 (stray Damage Bonus stat on Skinstealer), 5237/5238/5244/5253 (Aboleth Shield degenerate-zero fields vs the 71xx set), id 233 (redundant description entry).

**Follow-up fix (same day):** the shared `setBonus` template string on all 9 Aegis/Oathbreaker Impending Doom entries (ids 205, 206, 465, 466, 481, 482, 483, 484, 485) carried a wrong Encounter-power charge CD ("7s CD" — screenshots read **1s CD** at every legible tier) and tier-agnostic combat-rate/duration values. Corrected per tier from the same evidence set: IL3750 = 9s combat/15s; IL4100/4450 = 7s/15s; IL4800/5250 = 5s/20s. Display-text only (the engine doesn't consume these strings).

---

## Wave 2 — Artifacts + Master Boons — verified 2026-07-07

Steward sweep Wave 2 (pre-launch optimizer trust campaign). Screenshots: `docs/calibration/inbox/artifacts/` (7 files) + `docs/calibration/inbox/boons/` (10 files).

**Scaling model established:** single-row artifacts are stored at Mythic; the 7 Uncommon-rank tooltips validate the stored values under an exact uniform **×6.0** factor (IL 100→600, per-stat 75→450, CR 85→510, MaxHP 300→1,800 — 0.00% deviation on every field). This anchor makes the whole rank ladder computable.

| id | name | system | status | source screenshot | data version | date verified |
|----|------|--------|--------|-------------------|--------------|---------------|
| artifact 4 | Charm of the Serpent | artifacts | CONFIRMED (stats/CR/set via ×6 model). Cone debuff: JSON's 16% corroborated by a second internal source; vision's "+2%" read is the likely error — re-capture that tooltip line to close it. Cooldown FIXED to 180s (see systemic note) | Charm of the Serpent.png | 2026.03.17a | 2026-07-07 |
| artifact 57 | Skull Lord Staff | artifacts | CONFIRMED stats/CR/set (×6). Gold Bonus FIXED 2026-07-07: the mistyped rating-450 entry removed (it's a percent stat — tooltip reads "+3%" at Uncommon); structured percent value deliberately NOT written until a Mythic-rank capture exists | Skull Lord Staff.png | 2026.03.17a | 2026-07-07 |
| artifact 17 | Decanter of Atropal Essence | artifacts | CONFIRMED (stats/CR/Use text via ×6 model; set-bonus text not in frame) | Decanter of Atropal Essence.png | 2026.03.17a | 2026-07-07 |
| artifact 53 | Fragmented Key of Stars | artifacts | CONFIRMED (stats/CR/Use text; no set — JSON agrees) | Fragmented Key of Stars.png | 2026.03.17a | 2026-07-07 |
| artifact 93 | Rod of Imperial Restraint | artifacts | CONFIRMED (stats/CR/Use text/set) | Rod of Imperial Restraint.png | 2026.03.17a | 2026-07-07 |
| artifact 33 | Lostmauth's Horn of Blasting | artifacts | CONFIRMED (stats/CR/Use text/set) | Lostmauth's Horn of Blasting.png | 2026.03.17a | 2026-07-07 |
| artifact 12 | Tiamat's Orb of Majesty | artifacts | CONFIRMED — **intentional outlier, do not "fix"**: 5 named stats (vs siblings' 3) with a LOWER Combined Rating (450 Mythic / 75 Uncommon vs siblings' 510/85). JSON and screenshot independently agree on this shape; the game trades one CR line for two extra stats | Tiamat's Orb of Majesty.png | 2026.03.17a | 2026-07-07 |
| boons master 1, 2, 3, 4, 6, 7, 8 | Deathly Rage, Death's Bulwark, Blood Lust, Focused Retaliation, Enhanced Application, Blessed Advantage, Blessed Resilience | campaign_boons | CONFIRMED — every trigger, chance (30/30/10/20/5/10/10), duration, and per-rank effect (type + value) matches the tooltips exactly. Per-boon `totalCost` is a documented convention, NOT per-boon fact (real captured costs 4/4/4/5/5 reflect acquisition order, which is unknowable — no numeric change needed, label as convention) | 2026-07-02_master-boon_*.png (7 tooltips + rank-gates panel) | 2026.03.17a | 2026-07-07 |
| boons master 5 | Life Lessons | campaign_boons | UNVERIFIABLE — the one master boon with no screenshot; `chance` field missing in JSON (engine assumes 20%). Needs 1 tooltip capture | none — needs capture | 2026.03.17a | 2026-07-07 |
| boons rules | Master rank gates | campaign_boons | CONFIRMED — [10, 30, 60] matches the in-game gate panel exactly | 2026-07-02_master-boon_rank-gates-10-30-60_panel.png | 2026.03.17a | 2026-07-07 |
| gear 7401 vs artifact 95 | Demon Skull (duplicate pair) | gear/artifacts | RESOLVED 2026-07-07 (gear 7401 REMOVED same day it was created — the 2026-07-07 restore had duplicated artifacts.json id 95, tooltip-verified 2026-07-02; code-path check proved the gear copy dead data (no picker/engine reads gear slot "Artifact"). artifacts 95 = canonical; gear 441's migration note repointed to it. Residual: 95's debuff text (5%) vs the old gear record's (3%) — needs a Demon Skull capture) | n/a (code-path + cross-file check) | 2026.03.17a | 2026-07-07 |

### Systemic findings — artifacts.json (Wave 2 audit)
- **`cooldown` is a placeholder on ~136/140 entries**: `website/scripts/extract_artifacts.py` defaults to 60 when unspecified; all 7 tooltips this wave read **180s recharge**. FIXED 2026-07-07 on the 7 verified ids (4, 12, 17, 33, 53, 57, 93 → 180); every other entry's cooldown remains unverified until captured.
- **130/140 entries have no verification provenance** (no notes). Structured and scoreable, but unproven — per the standing rule (community-sheet import was reverted), artifact values only count once screenshot-verified. This wave verified 7; tank calibration previously verified 3 (ids 107, 129, 138) + ids 95-97, 100, 108, 139, 140.
- **ids 58 (Memories Redeemed), 87 (Champion's Battle Horn), 91 (Crown of the Undead)**: zero structured stats despite real described buffs — CR 0 means the optimizer can never pick them. Need captures to confirm whether a passive stat line exists in-game.
- Placeholders: id 113 (Globe of the Third Eye — "Effect details unknown"), id 119 (Mystic Bolt — "value TBD"), 5 entries with "? (needs verification)" sources.
- Minor: ids 107/129 top-level `set:"None"` despite carrying real Set markers (display-only drift); id 32 (Aurora's Whole Realms Catalogue) shares the Gold Bonus rating-vs-percent mistyping with id 57.
- campaign_boons.json minors — FIXED 2026-07-07: "Saquire's Training" typo corrected to "Squire's Training"; `scope: "self"` added to the 2 untagged ambiguous master-boon effects (Life Lessons R3 heal-from-damage, Enhanced Application R3 damage-reduction). guild_boons id 18 schema quirk documented only (modeled:false, no action).

---

## Wave 3 — Enchantments (+ overload corroboration) — verified 2026-07-07

Steward sweep Wave 3. Screenshots: `docs/calibration/inbox/enchants/` (39 files: 11 enchants.json + 28 overloads.json).

| id | name | system | status | source screenshot | data version | date verified |
|----|------|--------|--------|-------------------|--------------|---------------|
| enchant 41–44 | Celestial Sugilite / Obsidian / Netherite / Skullite — Uncommon rungs | enchants | CONFIRMED — all 40 data points (9 stats + CR × 4 gemstones) exact vs the IL300 Uncommon tooltips. Ladder proven = Celestial × (1..6)/6 exactly; with the Celestial tier already trusted (2026-06-16), both ends of the gemstone ladder are now screenshot-anchored | uncommon-obsidian/sugilite_il300_celestial-source.png, celestial-netherite/skullite_il300-source.png | 2026.03.17a | 2026-07-07 |
| enchant 26 | Celestial Recharge Bonus — Epic/Legendary/Mythic rungs | enchants | CONFIRMED (3%/4%/5% — the former "linear estimate" is now screenshot-proven for these 3 rungs; Uncommon/Rare/Celestial rungs remain estimates) | enchant_recharge-bonus_{epic,legendary,mythic}_2026-06-16.png | 2026.03.17a | 2026-07-07 |
| enchant 37 | Celestial Companion — Uncommon/Legendary/Mythic rungs | enchants | RE-CONFIRMED (30%/1,500 · 120%/6,000 · 150%/7,500 — matched the already-screenshot-tagged rungs). SEPARATE open item: the enchant's effect is not wired into engine scoring at all (contributes zero to any build) — tracked in data_issues.md as a code gap | enchant_companion-enchantment_{uncommon,legendary,mythic}_2026-06-16.png | 2026.03.17a | 2026-07-07 |
| enchant 40 | Celestial Rime Temper (R) | enchants | RE-CONFIRMED (15% MaxHP / −12% Incoming Damage / proc 30%·−4.5%·8s·3 stacks — second independent read matches the 2026-07-03 verification) | Celestial Rime Temper (R)_IL7000_celestial-verified.png | 2026.03.17a | 2026-07-07 |
| enchant 32 | Celestial Lightning Flash | enchants | FIXED 2026-07-07 (Dmg Bonus 24→12 + ladder to 2/4/6/8/10/12; was MISMATCH: stored value contradicted its own description and all 5 siblings, traced to the initial commit with no source. Screenshot still wanted to close it fully) | none — needs capture | 2026.03.17a | 2026-07-07 |
| overloads (24 entries) | Reghed / Doomvault-Thay / Red Harvest-Thay / Pirates' Skyhold / Dread Sanctum / Fiend / Astral Elf / Wildspace families | overloads | RE-CORROBORATED — 24 effect %/zone/target checks exact vs the 2026-06-16 verification. The two distinct "Thay" families are correctly separated (via `zones`: Doomvault vs Thay) — naming-prefix trap documented: never merge them | overload-*.png (28 files) | 2026.03.17a | 2026-07-07 |
| overload 41, 42 | Reghed Native, Thay Native | overloads | FIXED 2026-07-07 (structured Accuracy +2% entries added per tier's zones; was MISMATCH: component existed only in effectText) | overload-reghed-native.png, overload-thay-native.png | 2026.03.17a | 2026-07-07 |
| overload 40 | Thay Supremacy | overloads | FIXED 2026-07-07 (structured Incoming Damage −5% entry added for Thay+Trial; was MISMATCH: entire defensive half unstructured) | overload-thay-supremacy.png | 2026.03.17a | 2026-07-07 |

### Wave 3 audit findings (enchants.json, engine-checked)
- **id 37 Celestial Companion — engine wiring gap (BLOCKER-class, code not data):** ratingStats/percentStats are empty; the real values live in `companionEnchant`/`rarityLadder` which nothing in the scoring pipeline reads. The only Companion-slot enchant thus contributes exactly 0 to every build. Tracked in data_issues.md 2026-07-07.
- **10 Combat enchants missing `alwaysActive:true`** (ids 27, 29, 30, 31, 32, 33, 34, 35, 38, 39) — FIXED 2026-07-07 (16 static Equip % lines marked/added, mirroring the ids 36/40 pattern; was display-only, engine totals unaffected).
- **7 `appliesTo` mislabels** — FIXED 2026-07-07 (ids 30/31/33/34/40 → Defense, ids 36/39 → Utility).
- **id 39 Radiant Sanctuary** — FIXED 2026-07-07 (structured party +6% Incoming Healing entry added, same proc trigger/CD as the +5% Dmg Bonus half).
- **id 26 Recharge Bonus** — Epic/Legendary/Mythic rungs now carry `source:"screenshot"` provenance (2026-07-07).
- Minors: ids 32/38 `rarities.Celestial` independently rounded (11 vs true 10.8 — public page disagrees with engine by 0.2); `ratingStats` vestigial ({}) on all 44; id 28 per-stack ambiguity (enemy-scope, engine-skipped); overloads schema has no bind/campaign/req-IL/combat-time fields at all (modeling decision, documented).
- Negative findings: ids clean 1–44 no dups; all 43 rarity ladders 100% monotonic; CR = 0.9×IL exact across 150 gemstone ladder points; every stat name resolves through the engine's catalog/aliases — nothing silently dropped except the items flagged above.

---

## Wave 4 — e50971a long tail (gear.json) — structured 2026-07-07

The remaining MISSING bucket of the 82-item e50971a worklist: **35 items** got their dropped equip/set bonuses re-structured from their OWN in-data tooltip text (`parsedFrom:"description"` — corroborated, not screenshot-proven; treat as structured-but-unverified until captured). Re-classification against current data: 23 ids already RESTORED by earlier passes (incl. 10/242/275 whose stat names were legitimately corrected vs baseline), 11 PARTIAL done in Batch 5, 2 SUSPECT protected (205/206), 1 BLOCKER resolved (441).

Highlights: Blood Bargain 2pc structured on ids 200/201 from in-data setBonus text (Thay-zoned +12% Movement Speed / +8% Forte — baseline said 3% Forte, drift flagged, capture still wanted); Prismatic Defier of Dread fully structured on ids 223/224 using the existing `roleEffects` convention (per-role per-stack values from verified siblings 143/150); Spider's Bane role trio on id 235 mirrored from verified siblings; Lolthblessed +3% AP Gain on all six Lolth's Embrace pieces; Dwarven Resilience/Tiamat's/Rune of the Underdark set bonuses; plus 15 single-item procs/bonuses.

**Value-drift flags (description used, capture wanted):** id 65 (Control Resist 3.5→3.3), ids 200/201 (Forte 3→8), ids 239/260 (BaseDamageBoost→Outgoing Damage naming), ids 246/247 (Forte 3,000→5,000; their 33-magnitude damage proc left unstructured — no schema convention for proc damage).
**Skipped + need tooltips:** id 43 (Visage of the Eternal Herald — resource-MAX vs REGEN mechanic conflict), id 78 (Mask of the Bloodletter — flagged proc gone without text trace), id 77 corrected Max→Regen from its own text (4%×5 stacking, flagged for confirmation).
**New total-loss find:** id 241 (Iridescent Diamond Pendant) — `equipBonuses: []`, zero description text; joins the 7 known total-loss ids (237/238/240/257/258/261/262). All 8 need fresh captures.

---

## Wave 5 — Companion gear + belt items — verified 2026-07-07

Screenshots: `docs/calibration/inbox/companion-gear/` (18 files) + `docs/calibration/inbox/belt-items/` (7 files). Note the naming collision: the `belt-items` folder holds the **Chain of Scales consumable relic family (buffs.json id 93, category "Belt Item")**, NOT gear.json Belt-slot equipment.

| id | name | system | status | source screenshot | data version | date verified |
|----|------|--------|--------|-------------------|--------------|---------------|
| companion_gear 19–27 | Frostforged Belt/Girdle/Grimoire/Icon/Necklace/Ring/Sword Knot/Talisman/Tome of the Companion (IL 2850, CR 2565) | companion_gear | CONFIRMED — all 9 pieces, every stat exact vs tooltips | Frostforged *_IL2850.png (9 files) | 2026.03.17a | 2026-07-07 |
| companion_gear 28–36 | True Ice (same 9 pieces, IL 3000, CR 2700) | companion_gear | CONFIRMED — all 9 pieces, every stat exact vs tooltips | True Ice *_IL3000.png (9 files) | 2026.03.17a | 2026-07-07 |
| companion_gear 19/28 vs 20/29 | Tome vs Grimoire stat-budget skew | companion_gear | CONFIRMED REAL — **intentional outlier, do not normalize**: Tome carries ~1.8× the Grimoire's stat sum at the identical Combined Rating; both items' screenshots match stored values exactly, so the skew is in-game itemization, not a data error | the 4 Tome/Grimoire files above | 2026.03.17a | 2026-07-07 |
| companion_gear 1–18 | Thayan + Molten tiers (all 18) | companion_gear | UNVERIFIABLE — no screenshot exists anywhere in the archive for these two tiers; needs captures (Thayan ids 1-9 also have empty `source` fields) | none — needs capture | 2026.03.17a | 2026-07-07 |
| buffs 93 | Chain of Scales (7-tier belt relic) | buffs | CONFIRMED (Awareness ladder 1.2/1.5/1.8/2.1/2.4/2.7/3.0 exact vs all 7 tooltips). Per-tier secondary choice-stat values BACKFILLED 2026-07-07 into levels[].choiceStats. FLAG kept in-data: Empowered tier's Stamina Regeneration stored verbatim as 6 (tooltip reads "6%") with a choiceStatsNote — breaks the 0.02→0.05% progression, likely a game-tooltip typo for ~0.06%; re-capture before relying on it | Chain of Scales.png … Empowered Chain of Scales.png (7 files) | 2026.03.17a | 2026-07-07 |

### Wave 5 audit findings — gear.json Belt slot (207 entries) + companion_gear
- **NEW SYSTEMIC: duplicate-intake epidemic on class-universal crafted accessories.** 47 duplicate clusters covering 117 of 207 belt entries (~69 redundant rows) — the same physical item was screenshot-intaken once per class folder across 3 intake generations (pre-05-15 / 2026-05-15 warlock + rogue batches / 2026-05-27 pipeline batch). Worse: several clusters DISAGREE — the newer screenshot-intake copies systematically dropped abilityBonuses (Silverspruce Sash 2518-2520 vs 4843-4845; Company Gladiator/Ward Belts), and a few have 1-point stat drift (Silverspruce Belt 3802/3803 vs 4534/4535; Company Assault Belt 3877 Charisma). Winners must be arbitrated against the original screenshots (they exist per class folder) — newer ≠ more correct here. **Project-wide: the same 3 intake-batch signatures touch ~947 gear.json entries — a dedicated dedup wave is recommended.**
- **Barovian Cummerbund (1252) vs Cumberbund (1736)** — FIXED 2026-07-07: typo-dup 1736 deleted, its extra note detail folded into 1252 (gear count 6,847 → 6,846).
- **Draining Sash (861 vs 862)** — FIXED 2026-07-07: 861 renamed "Draining Sash — CON/CHA", matching 862's existing "— STR/CHA" convention.
- **7 Belt items with item_level: 0** (ids 12, 1251, 1252, 1255, 1256, 1736, 2047 — Ravenloft/Valhalla families; 1251 already tracked, other 6 new) + 8 more Neck-slot items same bug. IL-range filters misplace them. Real ILs need verification (legacy tiers deviate from the 0.9 CR ratio — don't derive, capture).
- Reference sheet `sheet1__Companion_Gear.csv`: CombinedRating column corrupt (all 382 rows = 90,000) — never bulk-import it; also documents ~382 lower-tier companion gear items (IL 405–1800) absent from our data (leveling-range completeness gap, low priority for an endgame optimizer).
- Cosmetic: companion_gear slot-vocabulary drift across tiers (Neck vs Grimoire/Icon/Talisman — engine-safe, SEO pages show it); 2 screenshot filename typos; companions.html has no companion-gear browsing surface (SEO pages dead-end — site feature gap, not data).
- Negative findings: companion_gear.json schema 100% consistent, no dups, no placeholders; empty equipBonuses correct-by-design (pure stat-sticks); belt subset has no PvE/PVE contamination, no encoding bugs, no id dups; the "Silverspruce mis-slot" note in data_issues.md is stale (already resolved).

---

## Wave 6 — gear.json dedup (duplicate-intake epidemic) — 2026-07-07

Full project-wide cluster map built and executed for the safe subset. Artifacts: `docs/audit/_dup_clusters_2026-07-07.json` (200 clusters / 414 entries, classified) and `docs/audit/dedup_merge_map_2026-07-07.json` (permanent deleted-id → kept-id trace, 123 records).

**Merged (123 rows deleted; gear 6,846 → 6,723):** 112 SUPERSET clusters (keeper provably contains every value of each deleted row — independently re-verified per deletion at merge time + 10-merge post-hoc spot-check, all pass) and 11 metadata-only field-unions (Grimfang/Harrowed Messengers IL3400, Company belts/cloaks with only ability-key-spelling differences). Notes/source folded into keepers with "[merged from id N]" prefixes.

**Deliberately NOT merged (~76 clusters, need arbitration):**
- **45 class-partition clusters — RESOLVED 2026-07-08: KEEP EVERY ROW, they are real per-class variants.** Two-class proof capture (Hammerstone Armor collection, same slot, IL 352, CR 317 on both): the Warlock sees "Hammerstone Mask" (Requires: Warlock — CA 92.4/CritSev 39.6/Def 264/CritAvoid 92.4/Deflection 39.6) while the Paladin sees "Hammerstone Helmet" (Requires: Paladin, Fighter — Accuracy 39.6/CritSev 39.6/Def 264/CritAvoid 92.4/Deflection 92.4). The game serves different names AND different secondary stats per class for older campaign gear. The 32 conservative union-skips with class partitions get the same KEEP ruling. Evidence: `inbox/gear/Hammerstone {Mask,Helmet}_IL352_*_two-class-proof.png`. Note for future intake: class variants may share a generic name (Gloves/Boots) or differ by armor weight (Mask/Helmet/Cap) — same-name different-stat rows with disjoint classes are NOT duplicates.
- **10 Main-vs-Off-Hand slot-mismatch weapon pairs** (Titansteel Tabars already tracked; 9 newly surfaced: Wootz Kilij, Aboleth Axes ×4, Trailblazer's Axes, Burning Axes ×3) — need a tooltip each.
- **~7 genuine name collisions** (Prismatic Crystalflex Bracers, Prismatic Bismuth Mail, Crystalflex Bracers, Fractal Barbut, etc.) — two different physical items sharing name+IL; need per-item arbitration/renaming, not merging.
- **1 SUPERSET skip:** Skinstealer 4184/6221 — the map's keeper (6221) lacks a stacking-proc entry the loser carries (already a Wave-1 minor: possibly an incomplete parse on 4184); refused mechanically, needs a screenshot.
- **32 conservative union-skips** whose conflicts touched ratingStats/percentStats (incl. Grimfang upper tiers, where the loser's `ratingStats.Damage` duplicates the keeper's `weaponDamage` field).
- Cross-cutting note: ability-score keys exist in 3 spellings file-wide (Constitution/CON/con, ~454 occurrences) — confirmed engine-safe (Wave 5: `addAbilityBonus()` aliases all forms via ABIL_NAME_TO_KEY); cosmetic normalization candidate only.

---

## Capture session 2026-07-08 — live probes + captures

| id | name | system | status | source | data version | date verified |
|----|------|--------|--------|--------|--------------|---------------|
| mount_insignia_bonuses 18 | Trainer's Restoration | mounts | CONFIRMED — stacks with **exact 100%/50%/25% diminishing** across equipped copies. Three-point full-AP vs used-AP Incoming Healing deltas, fixed stable per reading: 1 copy 3,500 (both test mounts identical solo — quality variance ruled out) · 2 copies 5,250 · 3 copies 6,125. Matches the engine's default DIMINISHING_MULTIPLIERS [1, 0.5, 0.25] exactly — no engine change needed. stackingMode:"diminishing" + maxStacks:3 made explicit in data | live probe (n00b, PS5, 2026-07-08 — panel readings logged in data_issues.md; no screenshots filed) | 2026.03.17a | 2026-07-08 |
| gear — Whisper of Power 2pc (Paladin pair) | Oathbreaker's Malevolence + Aegis of the Condemned, IL 3400 | gear | CONFIRMED — set panel reads "2 of Set: Whisper of Power **+7,200 Forte**", exactly the DB's stored value. Clears the UNVERIFIABLE flags on ids 486, 1802, 5240, 487, 1801 and the legacy rungs 1803, 1807–1811 (whose set data mirrors these). Same capture re-confirms Oathbreaker IL3400 base stats (Power 1,785 / Defense 1,785 / CR 3,060) | Oathbreaker's Malevolence Whisper of Power_IL3400_set_details.png | 2026.03.17a | 2026-07-08 |
| mount_insignia_bonuses 20 | Survivalist's Expertise | mounts | CONFIRMED — same **100/50/25 diminishing** stacking as Trainer's Restoration. Combo-break probe (insignia swapped, slot kept filled, fixed stable): 2 copies Forte 108,642 → 1 copy 106,142 = exactly 2,500 (second copy at 50% of the 5,000 base). Earlier unslot reading (−3,100) decomposed as 2,500 combo + 600 Forte on the removed insignia. Engine default already correct; stackingMode/maxStacks made explicit | live probe (n00b, PS5, 2026-07-08) | 2026.03.17a | 2026-07-08 |
| gear 4607 | Dirgeblade (IL 3750) | gear | CONFIRMED + FIXED — full set-details capture closes the last Dirgeblade gap: Unleashed 3%/3% CONFIRMED (was inference); combat tick **9s** + duration **15s** corrected from the leftover 5s/20s template; equip line proven **flat +5,200 Power** (stored 5% was mistyped — same flat-at-3750/percent-at-4100 transition as Aegis Forte, fixed with kind:"rating"). Base stats re-confirmed (Acc 3,656 / CS 3,375 / CR 3,375). Entire Dirgeblade ladder now screenshot-proven end to end | Dirgeblade Impending Doom_IL3750_set_details_full.png | 2026.03.17a | 2026-07-08 |
| gear — Company PvE Armor family (24 items) | Company Ward/Restoration/Raid/Assault pieces | gear | CONFIRMED INTENTIONALLY BLANK — the in-game tooltip has NO set section at all; the family has no set bonus to model, so our zero-set-bonus data is correct. Long-open "4pc never matches" bug closed: nothing to match | Company Raid Mask_IL588_no-set-section.png | 2026.03.17a | 2026-07-08 |
| enchant 32 | Celestial Lightning Flash | enchants | CONFIRMED + REFINED — Celestial tooltip proves "Increases damage by 12%" (the 24→12 correction is now screenshot-closed). Accuracy/Critical Strike are Lightning Charge STACKS (3.6%/stack, max 3, 10s on attack — exactly 10.8% at cap, matching stored full-stack totals): structure corrected from static to per-stack; Celestial ladder-mirror rounding 11→10.8 fixed. New description-only fact: crits deal 18 extra magnitude, once per 10s (unmodeled) | Celestial Lightning Flash (R)_IL6000_celestial-verified.png | 2026.03.17a | 2026-07-08 |
| boons master 5 | Life Lessons | campaign_boons | CONFIRMED + FIXED — the last uncaptured master boon. Tooltip: "Once per second, 10% chance on At-Will hit"; R1 +50 magnitude/rank; R2 50 magnitude DoT/rank over 4s; R3 return **10%** of damage done **per rank** as a heal over 4s. Corrections: `chance: 10` added (engine had assumed 20% — uptime was doubled), R3 15→10, duration 10→4. Same capture is the genuine Erik Boons-tab allocation view (masters 4/5/8 at 3/3, 104 spent, rank gates 10/30/60 re-confirmed) — closes that re-capture item too | 2026-07-08_master-boon_Life-Lessons_tooltip_erik-boons-104-masters-4-5-8.png | 2026.03.17a | 2026-07-08 |
| gear 200, 201 | Ebon Crusader's Aegis + Oathbreaker's Judgment (Blood Bargain (Greater) 2pc) | gear | CONFIRMED + FIXED — set panel reads "While in Thay, Movement Speed +12% and Forte +**3%**": the Wave-4 restore had used in-data text claiming 8% (drift-flagged at the time) — flag did its job, corrected 8→3 on both items' structured entries + text. Per-item "Blood Bargain Equip" proc CONFIRMED (10% chance when struck by a crit → +10% Critical Avoidance + 5% Power, 10s — matches stored). id 200 base stats re-confirmed (CS 3,960 / Awareness 2,160 / CR 3,600 at IL 4000). In-game set name is "Blood Bargain (Greater)" | Ebon Crusader's Aegis Blood Bargain (Greater)_IL4000_set_details.png | 2026.03.17a | 2026-07-08 |

---

## Wave 8 — final unswept files (buffs, kits, mount powers, collars) — 2026-07-08

Integrity audit of the last five unswept source files (336 records; no screenshot archive exists for these — engine-consumption + cross-reference sweep). **Zero broken cross-file references** (all 339 mounts' combatRef/equipRef/bonusRef resolve); kits.json fully clean; consumable stat values almost all accurate vs the intake-source guide.

**Fixed 2026-07-08 (bundle approved by n00b):**
- mount_combat_powers ids 93/94/95 (Mossy Flail Snail, Spinning Axe Strike (Teal), Terrifying Roar): magnitude was stored at Legendary with no anchorRarity → engine read ~33% low at every rarity. Corrected to the Mythic anchor (1000/1000/800, values from each entry's own documented ladder) — same fix class as the 2026-06-29 sweep that caught ids 38/40/48/53/74.
- mount_combat_powers id 87 (Hell's Impact): `rechargeTime` → `rechargeTimeSeconds` (only entry with the misnamed field; display + burst calc read the canonical name).
- buffs: ids 40 "Honey Bread" + 42 "Rataoulle" deleted (typo-dups of 137 "Honeyed Bread"/138 "Ratatouille", identical stats+source; 98 → 96 entries). id 33 Squash Soup category Elixir → Event Food (was unfindable in its tab). id 69 Lightwine "Regeneration" → "Awareness" 312 (unrecognized stat scoring 0; successor id 70 already used Awareness). id 30 Grand Summer Feast Deflect 2.5 → 1.5 (intake-source guide value; every other stat matched it — flagged for in-game verify). 7 stale notes rewritten to match stored stats. ids 91/98/103 (Dragon scrolls + Siegebreaker horn): effects structured from their own notes per existing conventions (enemyType/damagePct like id 51; timed rating window like id 108).
- mount_combat_powers id 32 (Rejuvenating Favor) note corrected: its 20% MaxHP heal is NOT modeled (was falsely claimed) — engine gap tracked in data_issues.md.

**Still needs captures (on the checklist):** Effervescent Tidespan Potion's true stat ("Recovery" is unrecognized, contributes 0); Tenser's Floating Disk's real combat power (orphaned power id 69 self-identifies as its power while mounts 120/336 point at id 32 — one screenshot decides the swap); Predator's Grace CR/stats (breaks the file's 0.9×IL convention); Unified Crescent Collar CR ladder (breaks its family's 180-ladder); Grand Summer Feast Deflect confirm.
**Code gaps tracked in data_issues.md:** self-scope mount combat-power bonuses never ingested + "Heal Bonus" stat unrecognized; exclusiveGroup:"None" buffs (Potion of Giant Strength, Potion of Speed) can never surface in any picker.

---

## Wave 9 — text-only stat-line census + structuring — 2026-07-08

First-ever full census of unstructured text across gear.json (~3,056 text-only bonus lines): 1,775 covered by set-sibling payloads, 694 proc/conditional class (await engine layers), 235 misc, **287 items with genuinely structurable stat effects scoring zero**. Worklist frozen at `docs/audit/_textonly_stat_lines_2026-07-08.json`; change log at `docs/audit/_wave9_structured_2026-07-08.json`.

**Structured (63 items, description-sourced, append-only):** 8 payload-less set families given exactly ONE payload member each (Company belts +500 Power, Bloodwoven 2pcs, Chilling Flow Wintermarked Oath Shield with role-split stacks via the engine-live `role` key, Enchanted Advantage/Healing/Awareness/Forte, Barovian Lord's Armor, Lionsmane 2pc) — one-payload rule verified file-wide; plus 55 per-item effects (static, zone-conditional, stacking, multi-enemy via engine-live `requiresMultiEnemy`, party-scope). The builder's pre-write audit caught 2 items already structured under different ability names (1994, 3305) — skipped, no double-count.

**Skipped with reasons (229 lines):** 186 set-sibling text copies (correct — payload lives on one member); 23-line Relic family (mixed uncataloged/proc/ambiguous clauses); 20 true flags incl. Modification: mod-slot lines, Menzoberranzan Executioner 30-min procs, Berserker's Might ramp-reverse, id 3306 conflicting party values, id 913 double-"in a party" typo (capture wanted), id 1891 uncapped scaling. "Healer's Influence" family structured for the party % only (flat 80,000 self-heal has no catalog stat — conservative).

**Pre-existing concerns surfaced (not touched, tracked in data_issues):** Umbral Stride + Dark Matter families carry set payloads on 8 members each (vs the one-payload convention — engine double-count semantics need a code-auditor check; note Erik's exact calibration suggests it may be benign in practice); ids 47/48 Umbral Stride roleMap has DPS/Tank/Healer roles swapped.

## Tenser's Floating Disk combat-power link — fixed 2026-07-08

| id | name | system | status | source | data version | date verified |
|----|------|--------|--------|--------|--------------|---------------|
| mounts 120, 336 | Tenser's Floating Disk (+ epic) | mounts | FIXED — combatRef was 32 (Rejuvenating Favor, the Golden Rage Drake's heal); corrected to 69 (Tenser's Transformation), the mount's actual power per the in-game preview | Tensers Floating Disk_mount-preview_combat-power.png | 2026.03.17a | 2026-07-08 |
| mount_combat_powers 69 | Tenser's Transformation | mounts | CONFIRMED + COMPLETED — +15% Base Damage Boost (existing) + added +15% Movement Speed (was missing); +2 STR/DEX/CON flavor; 60s recharge, 10s windows. Now correctly reaches the DPS self-buff valuation (Wave 14) via the fixed mount link | same | 2026.03.17a | 2026-07-08 |

**Mount combat-power rarity scaling — CHARACTERIZED 2026-07-08 (three consistent points), our Mythic anchors CONFIRMED correct:**
- Tenser's Transformation Base Damage Boost: 15% stored → 11.3% at IL2250 = **0.750×**
- Rejuvenating Favor heal: 20% stored → 15% at IL2250 = **0.750×** (`Rejuvenating Favor_IL2250 + Infernal Pounce_max_combat-power-picker.png`)
- Infernal Pounce magnitude: 3,000 stored → **3,938 at max** = **1.3127×** (the known Celestial bolster cap ~1.3124)

Curve: sub-Mythic tier ×0.75 · Mythic anchor ×1.0 (all our stored values) · Celestial max ×1.31. The two 0.75× buff-% points and the 1.31× magnitude point are mutually consistent, confirming every stored value is the correct Mythic anchor — no data changes. The combat-power SCORING layer uses the Mythic anchor while the optimizer defaults to Celestial, but since the factor is uniform across all combat powers the PICK never changes (monotonic) — a scoring-vs-Celestial refinement would only affect displayed magnitude, so it's deferred as low-value. Note: combat powers 31/33/32 (Explosive Equalizer/Tunnel Vision/Rejuvenating Favor, 105/73/35 mounts) are legitimately common stock powers; Tenser's was a specific mis-assignment, not a systemic dump.

## Value-drift capture batch — 2026-07-08/09

| id | name | system | status | source | data version | date verified |
|----|------|--------|--------|--------|--------------|---------------|
| gear 42 | Crown of the Everscourge | gear | FIXED — Recharge Speed 5%→3% (the Wave-4 description read 5%; live tooltip + old baseline agree on 3%) | in-game (n00b, verbal) | 2026.03.17a | 2026-07-08 |
| gear 62 | Vambraces of the Tyrant's Grip | gear | CONFIRMED — Defense 4% (drift flag vs baseline's 3% cleared; no change) | in-game (n00b, verbal) | 2026.03.17a | 2026-07-08 |
| gear 57 | Greaves of the Unbroken Doctrine | gear | FIXED — Movement Speed / Incoming Healing SWAPPED to 40% / 13% (Wave 4's description had them reversed; the old baseline was right) | in-game (n00b, verbal) | 2026.03.17a | 2026-07-08 |
| gear 297 | Visor of the Red Bastion | gear | FIXED — added the Thay-only Defense +2.3% (Wave 4 skipped it as unsupported; the screenshot shows it exists). Full set: in Thay Def+2.3/Aware+2.7, outside Def+1.5/Aware+2 | Visor of the Red Bastion_IL4100_set-details.png | 2026.03.17a | 2026-07-08 |
| gear 4004 | Enchanted Bregan D'aerthe Assassin's Leathers | gear | FIXED — equip is only "Liquid Luck" (1.5% Crit Strike/teammate + 8% Crit Sev moving, both already correct); removed the phantom "Precise Teamwork" entry a dark capture had invented. (NOTE: the *Longboots* 2791/4006 are a different item, still open) | Enchanted Bregan Daerthe Assassins Leathers_IL2050_set-details.png | 2026.03.17a | 2026-07-08 |

## Archive re-processing — Molten companion gear + Demon Skull — 2026-07-09

Found already-filed screenshots for open items during an archive sweep (no new captures needed).

| id | name | system | status | source | data version | date verified |
|----|------|--------|--------|--------|--------------|---------------|
| companion_gear 10–18 | Molten companion gear (all 9 pieces, IL 2200, CR 1980) | companion_gear | CONFIRMED — every ratingStats value + CR matches the data exactly (same clean result as the Frostforged/True Ice tiers in Wave 5). Now HALF the previously-uncaptured companion-gear tiers are verified; only the 9 Thayan pieces (ids 1–9) still lack shots | Molten *of the Companion_IL2200.png (9 files, unbound-gear/companion-gear/) | 2026.03.17a | 2026-07-09 |
| artifact 95 | Demon Skull | artifacts | FIXED — debuff corrected **5% → 3%** (both the damage-taken and Accuracy-reduction; the crisp verified tooltip reads 3%, and the old gear baseline had 3% right — the 2026-07-02 "5%" was an error). ratingStats/CR/cooldown all re-confirmed exact; AoE 31,271/imp at max quality added to the text | Demon Skull_IL2600_verified.png | 2026.03.17a | 2026-07-09 |

Note: the Molten Girdle's stat shows as "Deflection" on the tooltip but is stored "Deflect" — the project's canonical key (matches the verified Frostforged/True Ice Girdles); value identical, no change.

## Effervescent Tidespan Potion — stat unknown, flagged — 2026-07-09

| id | name | system | status | source | data version | date verified |
|----|------|--------|--------|--------|--------------|---------------|
| buffs 78 | Effervescent Tidespan Potion | buffs | UNVERIFIABLE (stat unknown) — part of the CURRENT Effervescent Masterwork Alchemy III family (siblings 75/76/77/79 grant +2,000 Power/Crit Strike/Defense/Deflect), so it grants +2,000 of ONE stat. Was stored as "+2,000 Recovery" — a non-canonical name (mis-transcription; "Recovery" is a defunct pre-Mod-16 stat). Real modern stat is UNKNOWN; not in the Mod-24 guide; n00b thinks it may be removed from game. Phantom stat cleared (scored 0 + warned); do NOT guess — needs an in-game tooltip | reference-sheet search (absent) + family cross-check | 2026.03.17a | 2026-07-09 |

## "Total-loss" accessories — captured, mostly a misnomer — 2026-07-09

The 8 "total-loss" accessory items turned out to be **pure stat-sticks** (their base stats were always stored; there was never an individual equip bonus to lose) belonging to **4 three-piece sets** (not pairs). Captures fixed real errors and filled set-bonus text.

| id(s) | items | system | status | source | data version | date verified |
|-------|-------|--------|--------|--------|--------------|---------------|
| gear 238, 258 | Wrathful Strangler + Waistband (Wrathful Bindings 3pc, 3rd = Wrath of Kossuth artifact) | gear | FIXED — **IL 1,400→3,400, CR 1,060→3,060** (stats were always sized for 3,400 — resolves the Wave-5 outlier flag). Confirmed stat-sticks; "Flames of Kossuth" 3pc text already present | Wrathful Strangler/Waistband_IL3400*.png | 2026.03.17a | 2026-07-09 |
| gear 241, 261 | Iridescent Diamond Pendant + Scintillating Diamond Buckle (Diamond 3pc, 3rd = Refulgent Diamond Pin) | gear | FIXED — **IL 350→550** (CR 495 was already right); added the "Dashing Decoy" 3pc set text (stand-still 3s → −5% dmg taken, +5% Awareness, +threat). Confirmed stat-sticks | Iridescent Diamond Pendant/Scintillating Diamond Buckle_IL550*.png | 2026.03.17a | 2026-07-09 |
| gear 240, 262 | Mythallar Shard + Piece (Mythallar 3pc, 3rd = Mythallar Fragment) | gear | CONFIRMED (IL 1,500/CR 1,350 exact) + added "Raw Pressure" 3pc set text (extra 100-magnitude hit on Combat Advantage damage). Stat-sticks | Mythallar Shard/Piece_IL1500_set-details.png | 2026.03.17a | 2026-07-09 |
| gear 237, 257 | Choker of Searing Magma + Girdle of Coagulated Magma (Magmatic Efficiency 3pc) | gear | CONFIRMED — stats (IL 2,800/CR 2,520) + setBonus **VERIFIED 2026-07-09** from the expanded panel: "+2% Power / +2% Forte / +2% Defense" (the stored guess was exactly right). Pure stat-sticks | Choker/Girdle of ..._IL2800_set-details.png | 2026.03.17a | 2026-07-09 |

**All 4 accessory sets are cross-file "artifact sets"** — each = 2 gear accessories (Neck + Belt) + 1 artifact 3rd member (Searing Conduit of Magma / Wrath of Kossuth / Mythallar Fragment / Refulgent Diamond Pin, all in artifacts.json). Nothing missing. Deferred (consistency): none of these set bonuses is structured for SCORING (all text-only, matching convention); structuring the scorable ones (Magmatic +2%×3, Dashing Decoy) + confirming whether the engine counts cross-file gear+artifact set completion is a separate code-side decision.

| companion_gear 1–9 | Thayan companion gear (all 9 pieces, IL 2600, CR 2340) | companion_gear | CONFIRMED — every ratingStats value + CR matches the tooltips exactly (the "Control Resist" entries use the engine's canonical name; the tooltip's "Control Resistance" is an alias). Empty `source` filled with "Red Harvest Zone Mechanic". **This completes ALL FOUR companion-gear tiers verified** (Thayan/Molten/Frostforged/True Ice). Known cosmetic-only cross-tier inconsistency left as-is: the `slot` field uses a normalized bucket ("Neck"/"Waist") on older tiers vs specific labels on newer ones — engine treats companion-gear slots as universal so it's display-only; canonical-convention call deferred to n00b | Thayan *of the Companion_IL2600.png (9 files) | 2026.03.17a | 2026-07-09 |
| gear 43 | Visage of the Eternal Herald | gear | FIXED 2026-07-09 — the Wave-4 MAX-vs-REGEN conflict settled: it's **REGEN** (Class Resource Regen 5%/stack, max 10, 15s, on damage/heal >10% MaxHP), now structured like the Lesser sibling id 77; + static +5% Critical Strike. Also corrected Critical Severity 4,305→4,505 (transcription error) | Visage of the Eternal Herald_IL4550_set-details.png | 2026.03.17a | 2026-07-09 |
| gear 78 | Mask of the Bloodletter | gear | CONFIRMED + FIXED 2026-07-09 — stats (Crit Strike 4010 / Defense 1914 / CR 3645) match exactly; equip name corrected "Tactical Defense"→"Tactical Daily (Lesser)". The 20% Daily→Encounter sequence proc IS present and correctly scored: the engine's `computeSequenceProcBoost` reads sequence procs from the equipBonus DESCRIPTION regex (verified match), so no structured field is needed — the Wave-4 "proc gone" flag was a false alarm (it looked for a structured EncounterDmgBonus field the engine doesn't use) | Mask of the Bloodletter_IL4050_set-details.png | 2026.03.17a | 2026-07-09 |

---

## Healer Gate campaign — gear + companion corrections — verified 2026-07-10

Steward sweep for the Healer Preview video blocker list (`healer_gate_list.md`). Source: vision-extractor GEAR/COMPANION reports (batches A-F) + data-auditor report, reconciled by the validator into `validator_verdicts.md` (owner approved "GO — apply it all" 2026-07-10). Screenshots per `docs/calibration/inbox/` archive; OCR card archive for the companion exact-match rows.

### Gear — 11 endgame equip bonuses structured (screenshot-verified)

| id | name | system | status | source | data version | date verified |
|----|------|--------|--------|--------|--------------|---------------|
| gear 377 | Visage of the Eternal Sigil | gear | FIXED→CONFIRMED — "Renewed Spirit" structured (Class Resource Regen 25%, matches siblings 3156/5344); stale duplicate "Renewed Divinity" placeholder retired | docs/calibration/inbox/ (screenshot-intake batches, per validator_verdicts.md) | 2026.03.17a | 2026-07-10 |
| gear 3161 | Hood of the Lifebloom | gear | FIXED→CONFIRMED — "Flowing Vitality" structured (Class Resource Regen 20%, alwaysActive false, condition: active after moving, lost after 4s standing still); redundant text-only placeholder merged | docs/calibration/inbox/ (screenshot-intake batches, per validator_verdicts.md) | 2026.03.17a | 2026-07-10 |
| gear 3163 | Gauntlets of the Lifebloom | gear | FIXED→CONFIRMED — "Amplified Potential" structured (Class Resource Max 20%, kind:percentOfPool per the Resourceful Healer (Ascendant) id 25 precedent); redundant text-only placeholder merged | docs/calibration/inbox/ (screenshot-intake batches, per validator_verdicts.md) | 2026.03.17a | 2026-07-10 |
| gear 5345 | Wintermarked Lifeward Greaves | gear | FIXED→CONFIRMED — "Shared Vitality" structured (Critical Strike 3% + Critical Severity 3.5%); scope corrected party→self (engine skips non-self gear bonuses — precedent id 375) | docs/calibration/inbox/ (screenshot-intake batches, per validator_verdicts.md) | 2026.03.17a | 2026-07-10 |
| gear 5490 | Wintermarked Mender's Breastplate | gear | FIXED→CONFIRMED — "Guardian's Impact" structured (Defense 1.3% + Critical Avoidance 2%); scope corrected party→self; description "target"→"targets" (plural, screenshot) | docs/calibration/inbox/ (screenshot-intake batches, per validator_verdicts.md) | 2026.03.17a | 2026-07-10 |
| gear 5497 | Runefrost Pilgrim Poleyns | gear | FIXED→CONFIRMED — "Miracle Crit" structured (Combat Advantage 3% + Critical Avoidance 3%), scope self | docs/calibration/inbox/ (screenshot-intake batches, per validator_verdicts.md) | 2026.03.17a | 2026-07-10 |
| gear 5381 | Frostbound Hearthboots | gear | FIXED→CONFIRMED — "Relentless Reserves" structured (Class Resource Regen 2%/stack, max 5), matches byte-identical siblings 5489/6242; description fixed to "Divinity/Performance/Soulweave" in both sentences (was inconsistent Stamina/Deflect wording) | docs/calibration/inbox/ (screenshot-intake batches, per validator_verdicts.md) | 2026.03.17a | 2026-07-10 |
| gear 6847 | Whispersilk Tunic | gear | FIXED→CONFIRMED — "Ruthless Might" structured (Critical Strike 1.2% + Critical Severity 1.2%/stack, max 5), 1.2% confirmed via sibling id 6876 (not 1.5%) | docs/calibration/inbox/ (screenshot-intake batches, per validator_verdicts.md) | 2026.03.17a | 2026-07-10 |
| gear 442 | Arcane Conduit Sigil — Survivor's Avoidance | gear | FIXED→CONFIRMED — "Survivor's Avoidance" structured (Critical Avoidance 8%, alwaysActive false, health-percentage condition), matches sibling id 5364 | docs/calibration/inbox/ (screenshot-intake batches, per validator_verdicts.md) | 2026.03.17a | 2026-07-10 |
| gear 5438 | Veinlit Aetherwrap | gear | FIXED→CONFIRMED — "Survivor's Rush" structured (Recharge Speed 5%, alwaysActive false); description corrected from wrongly-named "Critical Severity" to "Recharge Speed", matches the 6 Dragonflight Pants siblings (2394/2395/2396/2397/2400/2401) | docs/calibration/inbox/ (screenshot-intake batches, per validator_verdicts.md) | 2026.03.17a | 2026-07-10 |
| gear 5402 | Frostsilver Circlet of Protection | gear | FIXED→CONFIRMED — added Defense 4.5% to percentStats (Manticore's Mane Bite rider, already stated in description text); matches sibling id 5320's Defense 3.0 pattern; equipBonuses stays descriptive-only by convention | docs/calibration/inbox/ (screenshot-intake batches, per validator_verdicts.md) | 2026.03.17a | 2026-07-10 |

### Gear — 27 redundant text-only placeholders merged into their structured sibling

| id | name | system | status | source | data version | date verified |
|----|------|--------|--------|--------|--------------|---------------|
| gear 43 | Visage of the Eternal Herald | gear | FIXED — redundant text-only placeholder ("Ruthless Resources (Ascendant)") deleted; effect already covered by its structured sibling entry. Placeholder's fuller description text moved onto the structured Class Resource Regen entry (which previously carried none). | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 65 | Cuirass of the Crimson Reckoning | gear | FIXED — redundant text-only placeholder ("Enduring Resilience (Lesser)") deleted; effect already covered by its structured sibling entry. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 77 | Visage of the Undying Faith | gear | FIXED — redundant text-only placeholder ("Ruthless Resources (Lesser)") deleted; effect already covered by its structured sibling entry. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 216 | Vambraces of the Eternal Sigil | gear | FIXED — redundant text-only placeholder ("Radiant Guidance") deleted; effect already covered by its structured sibling entry. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 233 | Enchanted Depthforged Greaves | gear | FIXED — redundant text-only placeholder ("Survivor's Critical Resilience") deleted; effect already covered by its structured sibling entry. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 373 | Doomward Bastion of the Thayan Zealot | gear | FIXED — redundant text-only placeholder ("Umbral Stride") deleted; effect already covered by its structured sibling entry. Placeholder's description moved onto the structured "Umbral Stride (General)" Power entry; the separate 2pc "Umbral Stride (0/2)" Set-type entry is untouched (legitimate distinct structured data, not a duplicate). | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 374 | Oathbreaker's Judgment of the Thayan Zealot | gear | FIXED — redundant text-only placeholder ("Umbral Stride") deleted; effect already covered by its structured sibling entry. Same treatment as sibling id 373 (identical Umbral Stride kit). | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 375 | Sabatons of the Eternal Sigil | gear | FIXED — redundant text-only placeholder ("Shared Vitality") deleted; effect already covered by its structured sibling entry. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 382 | Breastplate of the Vital Sigil | gear | FIXED — redundant text-only placeholder ("Protective Embrace") deleted; effect already covered by its structured sibling entry. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 444 | Arcane Conduit Ink — Ruthless Critical | gear | FIXED — redundant text-only placeholder ("Ruthless Critical") deleted; effect already covered by its structured sibling entry. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 463 | Mystic Conduit Seal — Survivor's Forte | gear | FIXED — redundant text-only placeholder ("Survivor's Forte") deleted; effect already covered by its structured sibling entry. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 514 | Prismatic Luminstep Sabatons — Enduring Resilience | gear | FIXED — redundant text-only placeholder ("Enduring Resilience (Greater)") deleted; effect already covered by its structured sibling entry. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 525 | Luminstep Sabatons — Enduring Resilience | gear | FIXED — redundant text-only placeholder ("Enduring Resilience (Greater)") deleted; effect already covered by its structured sibling entry. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 534 | Mirestep Boots — Enduring Resilience | gear | FIXED — redundant text-only placeholder ("Enduring Resilience (Lesser)") deleted; effect already covered by its structured sibling entry. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 604 | Depthforged Sabatons | gear | FIXED — redundant text-only placeholder ("Survivor's Critical Resilience") deleted; effect already covered by its structured sibling entry. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 3154 | Vambraces of the Eternal Bloom | gear | FIXED — redundant text-only placeholder ("Harmonized Momentum") deleted; effect already covered by its structured sibling entry. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 3155 | Breastplate of the Eternal Bloom | gear | FIXED — redundant text-only placeholder ("Guardian's Impact") deleted; effect already covered by its structured sibling entry. SPECIAL: bundled with a scope party→self fix on both structured entries (engine-inertness fix); screenshot's "8 seconds" duration already present on the surviving entry, wins over the deleted placeholder's stale "10 seconds". | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 3162 | Cuirass of the Lifebloom | gear | FIXED — redundant text-only placeholder ("Radiant Empowerment") deleted; effect already covered by its structured sibling entry. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 3184 | Bismuth Mail | gear | FIXED — redundant text-only placeholder ("Healer's Influence (Greater)") deleted; effect already covered by its structured sibling entry. Placeholder ("Healer's Influence (Greater)") merged into the base-name structured sibling "Healer's Influence"; the unrelated "Tactical Daily (Greater)" entry on the same id is untouched. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 3185 | Crystalflex Bracers | gear | FIXED — redundant text-only placeholder ("Resourceful Forte (Greater)") deleted; effect already covered by its structured sibling entry. Placeholder ("Resourceful Forte (Greater)") merged into its base-name structured sibling; the unrelated "Stacking Critical (Greater)" entry on the same id is untouched. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 3190 | Depthcured Skullcap | gear | FIXED — redundant text-only placeholder ("Channeler's Focus") deleted; effect already covered by its structured sibling entry. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 3191 | Depthcured Cackrows | gear | FIXED — redundant text-only placeholder ("Fiery Muse") deleted; effect already covered by its structured sibling entry. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 3192 | Depthcured Doublet | gear | FIXED — redundant text-only placeholder ("Ruthless Might") deleted; effect already covered by its structured sibling entry. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 5355 | Runefrost Lifeward Vambraces | gear | FIXED — redundant text-only placeholder ("Greater Adaptive Strength") deleted; effect already covered by its structured sibling entry. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 6816 | Wintermarked Ravager Cuirass | gear | FIXED — redundant text-only placeholder ("Ruthless Advantage") deleted; effect already covered by its structured sibling entry. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 6852 | Gladebind Vambraces | gear | FIXED — redundant text-only placeholder ("Spiritual Inspiration") deleted; effect already covered by its structured sibling entry. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |
| gear 6864 | Ambersteel Vambraces | gear | FIXED — redundant text-only placeholder ("Divine Inspiration") deleted; effect already covered by its structured sibling entry. | docs/calibration/inbox/ (screenshot-intake batches) | 2026.03.17a | 2026-07-10 |

### Gear — 4 items reviewed, no change needed

| id | name | system | status | source | data version | date verified |
|----|------|--------|--------|--------|--------------|---------------|
| gear 5320 | Coldsilver Circlet of Protection | gear | CONFIRMED correct as-is — descriptive-only equip bonus stays unstructured by convention (flat-rating item) | docs/calibration/inbox/ | 2026.03.17a | 2026-07-10 |
| gear 6212 | Runefrost Skirmisher Bracers | gear | CONFIRMED correct as-is — flat 70 AP proc, stays descriptive by convention | docs/calibration/inbox/ | 2026.03.17a | 2026-07-10 |
| gear 6830 | Cuirass of the Bloodborne Reaper | gear | CONFIRMED correct as-is — damage+heal combo, stays descriptive/silenced by convention | docs/calibration/inbox/ | 2026.03.17a | 2026-07-10 |
| gear 6863 | Ambersteel Cuirass | gear | CONFIRMED correct as-is — orb-drop proc, stays descriptive by convention | docs/calibration/inbox/ | 2026.03.17a | 2026-07-10 |

### Companion powers — 11 proc corrections (screenshot/scaling-verified)

| id | name | system | status | source | data version | date verified |
|----|------|--------|--------|--------|--------------|---------------|
| power 2 | Effulgent Epuration | companion_powers | FIXED — procEffect.trigger "below 30% HP"->"below 50% Health" (matches notes, which already said 50%); notes' stray "15%" shield text corrected to "10%" (procEffect.effect's 10% was already right, unchanged) | wave1_findings.md screenshot/scaling evidence | 2026.03.17a | 2026-07-10 |
| power 23 | Volcanic Galeb Duhr's Presence | companion_powers | FIXED — procEffect prose 3.6%->3.75% (stats[] was already 3.75%, exact) | wave1_findings.md screenshot/scaling evidence | 2026.03.17a | 2026-07-10 |
| power 31 | Baby Bulette's Presence | companion_powers | FIXED — procEffect prose 11%->11.25% (documented 3x single-stat multiplier; 22.5%@CR750 exact) | wave1_findings.md screenshot/scaling evidence | 2026.03.17a | 2026-07-10 |
| power 35 | Lava Galeb Duhr's Presence | companion_powers | FIXED — procEffect prose 3.6%->3.75% (Card IL/CR display anomaly noted, not touched — no data change there) | wave1_findings.md screenshot/scaling evidence | 2026.03.17a | 2026-07-10 |
| power 92 | Vampire's Kiss | companion_powers | FIXED — procEffect prose 3.6%->3.8%; stale "At Epic: 3.6%. Special scaling." note replaced with a reference to the verifying screenshot; retired the matching data_issues.md "special scaling" line | wave1_findings.md screenshot/scaling evidence | 2026.03.17a | 2026-07-10 |
| power 93 | Elaina's Riposte | companion_powers | FIXED — procEffect prose 1.3%->3.75% (base IL375; 9%@CR900 exact; stats[] was already 3.75%) | wave1_findings.md screenshot/scaling evidence | 2026.03.17a | 2026-07-10 |
| power 116 | Slyblade Kobold's Discipline | companion_powers | FIXED — stats[] value 1.13->2.25 (1.5x SINGLE_STAT at the record's own IL150); procEffect prose 2.5%->2.25% | wave1_findings.md screenshot/scaling evidence | 2026.03.17a | 2026-07-10 |
| power 176 | Intelligent & Wise | companion_powers | FIXED — reflect prose 3.7%->5.63% (0.75x table, Mythic rung — record's own IL750); heal 5% portion unchanged | wave1_findings.md screenshot/scaling evidence | 2026.03.17a | 2026-07-10 |
| power 223 | Air Archon's Insight | companion_powers | FIXED — procEffect prose 2.5%->0.75% (base IL75); added structured statEffects (Power 0.75% self), durationSeconds 10, cooldownSeconds 10 (id 42/73 precedent); Archon-stacking clause stays prose-only | wave1_findings.md screenshot/scaling evidence | 2026.03.17a | 2026-07-10 |
| power 245 | Cowardly Dash | companion_powers | FIXED — durationSeconds 5->3 (screenshot outranks uncited legacy value); matching "5 seconds"/"5s" mentions in the effect prose and notes updated to 3 for internal consistency | wave1_findings.md screenshot/scaling evidence | 2026.03.17a | 2026-07-10 |
| power 20 | Celestial Lion's Presence | companion_powers | ENRICHED — added cooldownSeconds:15 (matches sibling id 262, the same companion's higher-rarity record) | wave1_findings.md screenshot/scaling evidence | 2026.03.17a | 2026-07-10 |

### Companion powers — 22 exact-match confirmed (no change)

| id | name | system | status | source | data version | date verified |
|----|------|--------|--------|--------|--------------|---------------|
| power 14 | Pseudodragon's Presence | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 25 | Galeb Duhr's Presence | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 64 | Hunting Hawk's Presence | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 69 | Pig's Instincts | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 75 | Ox Stot's Instincts | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 78 | Greenscale Hunter's Discipline | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 81 | Panther's Instincts | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 94 | I'm Just a Little Adventurer | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 96 | Dragon's Bane | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 97 | The Bigger They Are | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 115 | Chickenmancer's Discipline | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 159 | Netherese Warlock's Wisdom | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 164 | Batiri's Wisdom | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 169 | Wayward Wisdom | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 179 | Abyssal Guidance | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 195 | Delusional Insight | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 196 | Angel's Insight | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 214 | Astral Deva's Insight | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 262 | Celestial Lion's Presence | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 263 | Dungeon Master's Wisdom | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 264 | Dreadwarrior's Insight | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 267 | Blacksmith's Discipline | companion_powers | CONFIRMED — proc value matches the archived OCR card exactly, no change | OCR card archive (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |

### Companion powers — 12 utility procs closed (text-only by design)

| id | name | system | status | source | data version | date verified |
|----|------|--------|--------|--------|--------------|---------------|
| power 10 | Hell Hound's Senses | companion_powers | CLOSED — confirmed text-only-by-design (currency/drop effect) or already structured; no stat work needed | data-auditor + vision-extractor reconciled list (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 98 | Eladrin's Senses | companion_powers | CLOSED — confirmed text-only-by-design (currency/drop effect) or already structured; no stat work needed | data-auditor + vision-extractor reconciled list (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 102 | Chultan Hunter's Discipline | companion_powers | CLOSED — confirmed text-only-by-design (currency/drop effect) or already structured; no stat work needed | data-auditor + vision-extractor reconciled list (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 103 | Vistani's Discipline | companion_powers | CLOSED — confirmed text-only-by-design (currency/drop effect) or already structured; no stat work needed | data-auditor + vision-extractor reconciled list (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 106 | Mageslayer's Assault | companion_powers | CLOSED — confirmed text-only-by-design (currency/drop effect) or already structured; no stat work needed | data-auditor + vision-extractor reconciled list (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 138 | Wiggin's Wisdom | companion_powers | CLOSED — confirmed text-only-by-design (currency/drop effect) or already structured; no stat work needed | data-auditor + vision-extractor reconciled list (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 143 | Stronghold Cleric's Wisdom | companion_powers | CLOSED — confirmed text-only-by-design (currency/drop effect) or already structured; no stat work needed | data-auditor + vision-extractor reconciled list (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 178 | Skyblazer's Sight | companion_powers | CLOSED — confirmed text-only-by-design (currency/drop effect) or already structured; no stat work needed | data-auditor + vision-extractor reconciled list (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 224 | Black Ice Stone's Insight | companion_powers | CLOSED — confirmed text-only-by-design (currency/drop effect) or already structured; no stat work needed | data-auditor + vision-extractor reconciled list (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 232 | Dark Dealings | companion_powers | CLOSED — confirmed text-only-by-design (currency/drop effect) or already structured; no stat work needed | data-auditor + vision-extractor reconciled list (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 242 | Sense Through the Shadowfell | companion_powers | CLOSED — confirmed text-only-by-design (currency/drop effect) or already structured; no stat work needed | data-auditor + vision-extractor reconciled list (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |
| power 248 | Highborn Status | companion_powers | CLOSED — confirmed text-only-by-design (currency/drop effect) or already structured; no stat work needed | data-auditor + vision-extractor reconciled list (per wave1_findings.md) | 2026.03.17a | 2026-07-10 |

**Not touched (owner-held, pending his answers):** companion powers 110, 173, 184, 185, 193, 259 — see `data_correctness_queue.md` Tier 4 for the specific owner-judgment questions on each.

---

_Ledger created 2026-06-15. Current data pack version: 2026.03.17a (Mod 32.5)._
