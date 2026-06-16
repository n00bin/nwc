# Data Issues To Investigate

## Set-bonus text backfill — 3 gaps found (2026-06-15)
During the set-bonus text pass (gear cards now show the full tooltip text
instead of a bare stat), three items need a look:
- **Malignant Energy & Crimson Retaliation are 3-piece artifact sets**, but
  gear.json has only 2 gear members each (neck + waist). The artifact piece
  (Sealing Parchment / Crimson Calamity) lives in artifacts.json and isn't
  modeled as a set member, so the set reads 2/3 and can't complete in the
  optimizer. `setSize` bumped to 3 and the real "3 of Set" text is now shown,
  but the artifact-as-set-member still needs modeling.
- **Black Ice** — in-game tooltip reads "3 of Set" (Cloak of Black Ice /
  Greater Belt of Black Ice / Black Ice Beholder), but our data tags 4 members
  under "Black Ice" and there are several Black Ice sets. Member mapping is
  ambiguous; skipped the text write pending disambiguation.
- **Pact Blade of Elemental Fire** — its 2-of-Set tooltip shows "Equip: 0
  Critical Strike / 0 Critical Avoidance" (degenerate zeros). Needs a cleaner
  capture, or it genuinely has no meaningful set bonus; skipped.

## Race traits structured (2026-06-11) — 3 leftovers need an in-game look
Player report (relayed by n00b): Gith's +5% Combat Advantage wasn't counted.
Audit found 10 of 15 races had description-only traits with no structured
stats — all now wired (see news staging). Remaining opens:
- **Gith "Decentralized Mind"** — Control Resist amount unknown; the wiki
  instead lists "Gith Endurance" (+5% stamina regen) as the second trait,
  so the current in-game Gith trait list/names need a look.
- **Half-Orc "Furious Assault"** — our old text said "on first hit of an
  encounter power"; wiki says unconditional +5% Critical Severity (used
  that). Worth an in-game tooltip glance to confirm the rework wording.
- Unmodeled by design: Dwarf Stand Your Ground (knock resist, PvP-bugged),
  Half-Orc Swift Charge (move-speed proc), Tiefling Infernal Wrath
  (defensive proc — awaiting survivability layer), Wood Elf Wild Step
  (slow resist), Drow/Menzo Darkfire/Faerie Fire (enemy debuff encounter).

## Boon unlock gates + budget corrected from NW Hub screenshot (2026-06-11)
Re-reading the May-8 NW Hub captures (prompted by n00b's "you should have
screenshots") surfaced `Screenshot 2026-05-08 084358.png`: the Hub's boon
panel header reads **"0 / 130 Boon Points"** (we had 132, no recorded
source) and the tier rows show the real unlock gates — **Tier 2 at 10 pts,
Tier 3 at 20, Tier 4 at 30, "Advanced" (our Tier 5) at 45** (we had
20/40/60/80). Obikin89 independently confirms the 45. Both fixed in
`../data/campaign_boons.json` (provenance notes inline). STILL OPEN: the
**Master gate** — the Hub shows no lock on the Master row; Obikin
(mod-20-era) says master ranks unlock at 10/30/60 total spent; we keep the
conservative 100 until an in-game boon-screen capture settles it. A full
OCR sweep of the 6.8k-image archive for in-game boon screens is logged at
`scripts/_boon_scan_hits.txt`.

## Master boon triggers (2026-06-11) — Deathly Rage RESOLVED, other 7 chances open
~~Deathly Rage wording needs an in-game tooltip screenshot~~ **RESOLVED
2026-06-11: n00b read the live tooltip in-game — "On kill, or when taking
more than 50% of your Maximum Hit Points in a single blow, 30% chance to do
the following for 10s."** Two corrections vs every external source (wiki
Module-23, NW Hub, Obikin89 all say just "chance on kill"): the second
trigger path, and an explicit **30% proc chance**. Data updated
(`trigger`/`chance` fields); `masterBoonUptime` now reads the per-boon
`chance` and models the big-hit path (+1 qualifying blow per ~50s) —
Deathly Rage credits ~13% uptime (was ~4% under kill-only/20% assumptions).
STILL OPEN: the other 7 master boons' proc chances — Hub omits them, engine
assumes 20% until each tooltip is read in-game (same quick read-aloud
works). While verifying, two related notes:
- Obikin89's claim "you can only pick 1 master boon" (and "2 tier-5 boons,
  unlock at 45 points") is mod-20-era text; the NW Hub simulator (current,
  May 2026 screenshots in `docs/calibration/_misc-archive/`) ranks multiple
  master boons with the escalating cost schedule our data models. If an
  in-game boon-screen screenshot ever shows a pick limit, revisit
  `rules.master` in campaign_boons.json.
- Potion boons (Lingering Medicine/Fortification/Power) gain a proc at max
  rank per Obikin (HoT / +MaxHP / +Power for 30s after drinking a potion) —
  unmodeled, `optimizerRelevant: false`, low priority.

## Companion enhancement multi-stat fix (2026-06-10) — Enduring Precision value needs in-game check
Player report (relayed by n00b): companion enhancements that do multiple
things only apply one. Confirmed — the enhancement schema carried a single
stat/value pair, so the three dual-player-stat enhancements fed only their
first stat to Toon Forge:
- **Unflinching Will** (Bobby) — Deflect + **Deflect Severity** 4.5% (DeflectSev was missing)
- **Impactful Maneuvers** (Minotaur) — Power + **Forte** 4.5% (Forte was missing)
- **Exploit Weakness** (Blaspheme Assassin) — Critical Strike + **Critical Severity** 4.5% (CritSev was missing)

Fixed via a `stats[]` array on those three entries in
`../data/companion_enhancements.json` (legacy `stat`/`value` stays as a
mirror of `stats[0]` for back-compat; `enhToBuff` + `renderEnhancement` in
toon-forge.html and both companions-page.js render paths read the array).
Player+companion dual enhancements (Counteract, Fortification, Anticipation,
Deflecting Shards, Precision, the Enduring family) are CORRECT as
single-stat — the second effect buffs the companion itself, which has no
player stat-panel impact. Also fixed: **Reinvigorate** (id 1) was missing
`type: "percent"`, so the engine routed it as 9 RATING Outgoing Healing
(~nothing) instead of 9%.

- ~~Enduring Precision (id 6) stores player value 6 vs tooltip note "4%"~~
  **RESOLVED 2026-06-10: n00b verified in-game — player gets 6% Critical
  Strike at IL 900.** The stored value was right; the tooltip's "4%" is
  base-quality text that scales with rune quality (same pattern as Enduring
  Senses, verified 6%/6% on 2026-05-12). Note text corrected to 6%.

- ~~Enduring Alacrity/Craft/Guard store player value 4 (from the same "4%"
  base tooltip text)~~ **RESOLVED 2026-06-10 (same day): n00b verified all
  three in-game at 6%.** Values updated 4 → 6 (Movement Speed / Forte /
  Defense). The whole Enduring family (Senses, Precision, Alacrity, Craft,
  Guard) is now in-game verified at 6% player-side at IL 900 — tooltips
  show base-quality text; always store the IL-900 value.

## Del's gear sweep round 2 (2026-06-10) — Swiftguards + rings fixed; Soul Collector weapon sets still messy
Player report #2 (Del's owner): Wintermarked Swiftguards' Eagle's Mastery
(Lesser) not counting. Fixed (3 structured entries at 0.6%/stack, max 5,
mirroring the Greater sibling on Treads of the Arch-Thrall). Full audit of
Del's equipped 12 found two more:
- **Maiden's Advantage was description-only on 3 rings** — Frostsilver Ring
  of Initiative IL 6000 (6% CA + 3.25% Power w/ 2+ enemies), Coldsilver Ring
  of Initiative IL 5700 and Eilistraee's Beauty IL 1850 (5% / 2.5%). All
  split per the Bloodlit Veil two-entry convention. The flat CA halves are
  significant always-on stats that were silently missing.
- **Omen of Doom IL 4800 carried set 'Whisper of Power' while its partner
  Codex of Eternal Chains IL 4800 carried 'Impending Doom'** → the 2pc never
  completed; Del got NO weapon set bonus. Archived IL 3400 tooltip proves
  Whisper of Power (+7,700 Critical Severity at that tier) belongs to the
  3400 tier; cross-class tags say 3750+ tiers are Impending Doom. Retagged
  Omen 4800 to Impending Doom as a MARKER piece (Codex carries the
  structured 2pc: 2.5% Critical Severity + 2.5% Power), dropping the
  fabricated "+5,200 Power" text.

**Still open on this family (part of the ~29 dup-name set-conflict pile):**
- Some Impending Doom pairs carry the structured 2.5/2.5 on BOTH pieces
  (Scream Seeker + Dread Confessor 4100–5250 → engine counts 5%/5%), others
  on one piece (Bard 4800, now Warlock 4800 → 2.5%/2.5%). Same in-game set,
  two different modeled values — needs one convention.
- ~~The 2.5% model / ASK for a 4800 tooltip~~ **RESOLVED 2026-06-10 (same
  day):** the archived captures already held the answer — the one-hover-
  behind batch had the 4,800 Omen Details under the il4450_details filename
  (now also archived as `_up/warlock-gear/Omen of Doom_IL4800_details.png`).
  Verified at 4,800: BOTH weapons carry Accuracy 3,120 / Crit Strike 2,880 /
  **Critical Severity 2,880** / CR 4,320 (Omen was missing its CritSev —
  player-reported as "crit sev rating off"); the 2pc = 10 Charges →
  Unleashed (DPS +4.5% Base Damage Boost / Heal +4.5% OH, 20s, refreshable)
  PLUS flat **+7.5% Critical Severity** + 2.5% Power (the 2.5% CritSev in
  the model was wrong). Omen's phantom "Damage Bonus 1%" dropped (tooltip
  line is "+100 Damage" weapon damage, unmodeled). Charge cadence varies by
  tier (4,450: 13 charges/7s/+4%/15s — keep tier texts distinct if ever
  structuring mid-tiers).
- Sibling classes (Rogue Scream Seeker/Dread Confessor, Bard, Wizard,
  Ranger, Barbarian, Paladin pairs) still carry the old 2.5/2.5 guess and
  possibly the same missing-third-stat problem — audit against their own
  collection captures before copying the Warlock numbers.

## Combat-stacking equip bonuses structured (2026-06-10) — 3 contradictory tooltips still open
Player report (Del's owner): Wintermarked Hunter Hood's "Critical Breaker"
(9% Critical Strike at 5 stacks) wasn't counted by Toon Forge — the equip
bonus was description-only. Sweep found 65 same-shape "in combat stacking"
bonuses still unstructured; 62 were structured via
`scripts/eb_parse_combat_stacking.py` (per-stack amount + maxStacks,
`kind: rating` for flat values, `requiresMultiEnemy` for 3+-enemy gates,
zone gate for Spelljammer's Grace). **3 skipped — their tooltips contradict
themselves; need in-game re-capture before structuring:**
- **Crown of the Unyielding Will** — "gain 2.4% Incoming Healing ... Max
  Stacks: 5 — 2.4%" (max equals one stack?)
- **Crown of the Supreme Will** — "gain 1.6% ... Max Stacks: 5 — 9%"
  (1.6 × 5 = 8, not 9)
- **Cuirass of the Crimson Scythe** — "Forte +1.8% every 2s ... Max 5
  stacks: 6%" (1.8 × 5 = 9, not 6)

## Elk Tribe / Hammerstone phantom set — RESOLVED 2026-06-09 (audit blocker #2 follow-up)
Archived collection screenshots (docs/audit/_up/) proved "Weapons of the Elk
Tribe Chiefs" is a **collection tab, not an in-game set**: four Elk tooltips
(Lute, Poniard, Dirk + stored rogue Poniard values) show NO set line, while the
Hellfire Tow Hook tooltip in the same UI format DOES show its set line. Fixes:
- Removed the false Set equipBonus from ids 4766/4767 (Bard Lute/Poniard).
- Cleared `set` on all 16 tagged entries — including **4 Hammerstone weapons
  (ids 2087, 2088, 2954, 2955) that were wrongly tagged with the Elk set**.
- Corrected rounded stats 98 -> 97.6 (Critical Severity / Critical Avoidance)
  on ids 4354, 4766, 4767 — matches the Dirk/Lute/Poniard tooltips and the
  values already stored on ids 4353 / 6833 / 6834.

## Hellfire Engine Remains set bonus — RESOLVED 2026-06-09 (same day)
The set is REAL (Tow Hook IL600 tooltip shows "Set Hellfire Engine Remains
(0/2)", base stats verified 450/450/540). The bonus text was then found on the
set's own higher-tier siblings: ids 4091–4097 carry the verified structured
bonus (Stamina Regeneration +15% + Movement Speed +15% for 10s at combat
start; refreshes on kill), and id 3386's intake description holds the same
text. Structured it across the whole set: id 4090 (was the stripped
fabricated +1,500 Power) and ids 3386–3393 (were stat "Damage Bonus"/0
placeholders) now all carry stat Stamina Regeneration / amount 15 like their
verified siblings.

## Ultraviolet Elven Cap 3s/5s conflict — RESOLVED 2026-06-09
The archived Cap tooltip (docs/audit/_up/wizard-gear/, IL 2,900) settled the
duplicate pair's conflicting proc cadence: **"For every 5 seconds you are in
combat, you gain 1% Combat Advantage. Max Stacks: 10"** (bonus name
Combatant's Advantage; stats 2,175/2,175, CR 2,610 — all match). Kept id 6220
(correct 5s wording + structured engine-scored stacker); deleted id 3201
(wrong "every 3 seconds" text, description-only). The tooltip also shows NO
set line → **"Ultraviolet Armor" was a third phantom collection-tab set** —
cleared from all 12 tagged entries (zero Set-type ebs referenced it).
NOTE: the Perfect Mark of Lolth set-popup interval question (3s vs 5s) is
SEPARATE and still open — that one is about the Demonweb set bonus text,
which collection tooltips don't display.

## Audit pile-1 sweep — RESOLVED 2026-06-09 (duplicate pairs + phantom sets)
All verified against archived tooltips (docs/audit/_up/warlock-gear/):
- **Blaspheme Pactblade:** tooltip matches id 144 exactly (Damage 100 /
  Accuracy 570 / CA 1,425 / Crit Sev 855 / CR 1,710). Deleted stub id 3257
  (carried a stray percentStats "Damage Bonus" 1.0 not on the tooltip).
- **Perfect Mark of Lolth:** tooltip matches id 186 (Damage 250 / CA 1,856 /
  Crit Strike 1,856 / CR 2,228). Deleted stub id 3249. NOTE — open question:
  the deleted stub's set-bonus text said the crit stack ticks "every 3
  seconds" while id 186's structured proc says every 5s (collection tooltip
  doesn't show set text). Same class of conflict as Ultraviolet Elven Cap —
  verify the Demonweb Empowerment popup in-game.
- **Exalted Maiden's Raid Wristguards:** true duplicate — deleted id 3285,
  kept id 6249 (identical stats, richer notes).
- **Starhide Skullcap / Doublet:** deleted re-intake dupes 5914/5915, kept
  3221/3222 (3221 carries the engine-scored structured per-enemy bonus).
- **"Cosmic Corsair's Armor" phantom set:** Starhide Cackrows tooltip shows
  NO set line → collection tab, not a set. Cleared from all 12
  Starweave/Starhide entries (no Set-type ebs existed — display-only tag).
- **Runefrost Hunter's Coat:** tooltip verified (4,860 Crit Sev / 3,645 Forte
  / CR 4,860, Battle Reserves, NO set line). Deleted dupe id 6208, kept 5494.
- **"Frostforged Warplate" phantom set:** Hunter's Coat AND Hunter Hood
  tooltips both show no set line → cleared from all 36 Wintermarked/Runefrost
  entries (zero Set-type ebs referenced it — display-only tag).
- **Greaves of the Crimson March id 37 (−20 Maximum Hit Points):** resolved
  by analysis, no change — engine treats equip-bonus amounts as PERCENT by
  default (toon-forge.html ingestion), so −20 already reads −20% Max HP.
- **Cindersilk id 6876:** added `set: ""` for schema consistency.

## Flayed Legion — classes RESOLVED 2026-06-14 (Report #113); one missing stat OPEN
id 288 (Harness) is now player-confirmed usable by **Paladin** (Report #113),
which falsifies the old "Barbarian-only" read from Report #87 — that tag just
reflected the first reporter's class. Cleared to `allowedClasses: []` (all
classes), matching its three siblings 286/287/289 which were already
unrestricted. So the whole Flayed Legion sub-set is all-classes (shared Spider
Seal vendor gear); the earlier "siblings are PROBABLY Barbarian too" guess is
withdrawn — leave them unrestricted.
STILL OPEN: id 286 (Sabatons, Feet, IL 4100) carries a single rating stat
(Accuracy 1,997) vs CR 3,690 — likely missing 1–2 stats. **Action:** in-game
tooltip for the Sabatons' full stat block.

## Elk Tribe Grimoire / Pact Blade duplicate pairs — RESOLVED 2026-06-09
ids 3597/4824 ("Elk Tribe Noble's Grimoire") and 3598/4825 ("Elk Tribe Noble's
Pact Blade") were same-name duplicate pairs with conflicting Accuracy (98 vs 97)
— and the 4824/4825 copies also carried a wrong item_level (199 vs the real 399).
Archive tooltips (docs/audit/_up/warlock-gear/) settled it: real values are
**IL 399, Accuracy 97.6 / CA 202 / Crit Strike 202 / Crit Avoidance 97.6, CR 359**.
Kept 3597/3598 (correct IL/slots) with stats exact-matched to 97.6; deleted
4824/4825 (bad re-intake). No external references to the deleted ids existed.

## Set-bonus data problems found 2026-06-08 (during set-bonus structuring pass)
The set-bonus parse pass (`scripts/eb_setbonus_curated.py`) structured 4 clean
Freezing sets but found these needing in-game verification before they can be
modeled — they were deliberately LEFT as free-text:
- **setName COLLISION — "Enchanted Advantage" & "Enchanted Awareness".** Two
  different in-game sets share each name: the **Mark of the X** line (Recruit/
  Initiate/Novice/Convert) grants flat ratings (+3,000 Accuracy / +3,000
  Awareness), while the **Bloodwoven X** line (Sigils/Signs/Runes) grants
  percentages (+2% Combat Advantage / +2% Awareness). One setName can't hold two
  different stat/value pairs without a mixed pair wrongly triggering the bonus.
  FIX NEEDED: confirm the real in-game set names and split them (e.g. Mark line
  vs Bloodwoven line get distinct setName) before structuring.
- **Freezing Stand / Freezing Touch — RESOLVED 2026-06-09 (Report #106).**
  Frost-Riven Earthshard Guard (5375, Freezing Stand) corrected Pants->Shirt —
  player-verified in-game via Report #106. Frost-Riven Dawnshard Raiment (5374,
  Freezing Touch) corrected Pants->Shirt — inferred (impossible two-pants set +
  Deep-Riven=Pants/Frost-Riven=Shirt family rule; pending a screenshot but
  logically forced). Full set bonus (+4% Awareness / +4% Power) structured on the
  Shirt; the Deep-Riven Pants partner (5369 / 5368) demoted to a marker so the
  bonus counts once. Shipped in commit 50c1f37.
- **Freezing Rage — RESOLVED 2026-06-09.** Frost-Riven Titanweave Harness (5379)
  corrected Pants->Shirt; +4% Critical Severity structured on the Shirt, and the
  Deep-Riven partner (6844, verified Pants) demoted to a marker. Evidence: Corrupt
  Power (on 5379) is a verified Shirt bonus, Ruthless Critical (on 6844) a Pants
  bonus, plus the Deep-Riven=Pants/Frost-Riven=Shirt family rule. **All 3 flagged
  Freezing sets (Stand / Touch / Rage) are now fixed.** Shipped in commit 941f0c2.
- **Enchanted Forte — RESOLVED 2026-06-14 (Report #114).** The set's two
  "Mark of the Adept" variants were both wrongly slotted Shirt. Report #114
  (in-game) confirmed the Challenger's Forte variant (id 495) is the **Pants**;
  corrected Shirt->Pants. The set now has Shirt (id 501, Healing Tactics) +
  Pants (id 495, Challenger's Forte) and can complete. **Enchanted Healing**
  (Bloodwoven Symbols line) STILL OPEN — only a Shirt exists; its partner Pants
  piece is still missing. Add it from a collection screenshot to enable.
- **Whisper of Power (+5,200 Power, 2-pc)** — sits on the Soul Collector weapons
  (Oathbreaker's Malevolence MH / Aegis of the Condemned OH) that ALSO carry the
  structured **Impending Doom** weapon set, and the two names were swapped on
  some tiers (see news 2026-06-05). Verify in-game whether these weapons grant
  BOTH set bonuses or whether Whisper of Power replaced Impending Doom at lower
  tiers, before structuring the +5,200 Power.

## Warlock Soul Spark — base mechanic FIXED 2026-06-08; per-power values still to verify

n00b corrected the base Soul Spark mechanic in-game (classes.json fixed): every At-Will/
Encounter/Daily hit generates 1 spark, pool caps at **30**, **+0.5% damage/spark** base
(Wrathful Souls doubles to **1.0%** → up to **+30%** at cap). Prior data wrongly said
"+1%/spark, max 10". Wrathful Souls note updated; warlock-hellbringer.html build doc rewritten
(spark generation is universal → at-wills are now damage picks, No Pity No Mercy devalued,
"Soul Scorch spam" reframed as a burst-timing variant since dumping sacrifices the +30% passive).

STILL OPEN — the **per-power bonus spark values** in classes.json may be stale relics of the
wrong model and need in-game verification now that base = 1/hit:
- Dark Helix "+2 Soul Sparks +1 per Dark Spiral consumed"
- Eldritch Blast enhanced "+1 Soul Spark"
- Hellish Rebuke "+1 Soul Spark, +1 per DoT hit"
- No Pity, No Mercy "3 Soul Sparks on each initial hit"
- Dark One's Blessing "6 Soul Sparks"; Dark Prayers "puppet hit → 1 spark"
Are these ADD to the base 1/hit, or REPLACE it? Verify before leaning on any of them.

Soul Scorch FIXED 2026-06-08 (n00b in-game): costs 6 (min) up to 18 (max) sparks — NOT all 30;
50 mag/spark spent → 300 (at 6) to **900** (at 18, was wrongly 800); DoT 150→450 over 6s within 12';
and it does **NOT apply Curse** (prior data had an erroneous "Curse" in the effect — removed).

## Crystalline / Prismatic Crystalline Armor (Dread Sanctum) — cross-class audit needed

Context: n00b flagged the Prismatic Luminstep Greaves reading wrong (2026-06-07).
Root cause: the 2026-05-13 warlock collection captures have tooltips MISALIGNED
with their filenames (tooltip lags one hover behind while paging the collection).
Decoding the whole warlock batch verified/fixed the Warlock+Bard healer pieces
(greaves restored + verified, Fractal Barbut stats, Bismuth Mail CritSev) — see
commits b211ec5 (data) / 69ef609 (site).

STILL OPEN (same decode treatment needed for the OTHER class folders — bard/
cleric/ranger/rogue inbox captures may carry the proof):
- **IL3350 healer feet missing**: "Luminstep Greaves — Ruthless Resources"
  (Warlock/Bard, Dread Sanctum Advanced) almost certainly exists (every other
  Wl/Bard healer piece has a 3350 sibling; expected stats Forte 2,261 /
  OH 2,010 by the ×1.105 tier ratio) but NO tooltip captured — do not add
  without a screenshot.
- **Suspect Ro/Cl/Ba/Ra-side entries** (same name, conflicting stats/bonuses):
  - id 2 Prismatic Crystalflex Bracers (CA 2220+CritSev 3330, Enveloped Rage)
    vs 3350 sibling id 2727/3942 (CritStrike+CritSev 3015, Enveloped Rage) —
    stat-line mismatch across tiers, plus 2727/3942 are exact-name dups.
  - id 3940 Prismatic Fractal Barbut (Acc/CA/Forte, Critical Spiker) — same
    Jerkin-stat-line contamination the Wl/Bard Barbut had.
  - id 3937 Prismatic Bismuth Mail (CritStrike/CritSev 3530, Tactical Daily) —
    3530 is the OCR-suspect value twice; id 2724 same name (3330/3330).
  - id 3944 Fractal Barbut 3350 (Forte 3265?!) — 3265 matches no known pattern.
  - id 3941 Bismuth Mail 3350 (CA 2010+CritSev 3015, Tactical Daily) vs id 3184
    (CritStrike+CritSev 3015, Healer's Influence) — bonus/stat conflict.
- Cross-tier stat lines genuinely SWAP for some pieces (3350 Armlets =
  Acc/CA/Forte but 3700 Armlets = CritStrike/CritSev; Jerkin swaps the other
  way) — verified on warlock side; don't "normalize" tiers to match each other.

## Jotunskar clothing family — leftovers from 2026-06-06 pants verification

Context: n00b's 4 collection screenshots (Deep-Riven pants) triggered a family-wide
review. FIXED same day: 4 Deep-Riven pants slots (3 were "Shirt", 1 was "Armor"),
Lifebraid Power 1275→1273, top-level set fields ("Winterworn Harness" is the
collection tab, not a set; real sets are Freezing Energy/Grasp/Advantage/Touch/
Stand/Fortitude/Rage, 2pc, shirt+pants pairs), structured parses for the 4 pants
bonuses, and removal of bogus Freezing set markers from ALL sub-4850 tiers
(archived tooltips show the set line exists only on Deep-Riven/Frost-Riven 4850).

STILL OPEN:
- ~~id 5327 Veinlit Stormbind Tunic (IL 3800)~~ FIXED 2026-06-06: n00b's Reghed
  Edge collection tooltip confirmed Pants, Accuracy 1852 (was 1862 — and 1852 =
  0.4875×3800, the same ratio as Deep-Riven Stormbind's Accuracy at 4850),
  Precision Tactics equip bonus (+10,625 Critical Strike while Stamina > 75%),
  source The Biting Cold Heroic Encounters, and no set line (another sub-4850
  no-set data point).
- **Freezing set 2pc bonus texts** are carried on markers ("2 of Set: +4% X") but
  none of the pairs apply a structured stat — if/when both 4850 pieces of a pair
  are confirmed, decide which piece carries the structured set-bonus entry
  (role-conditional set pattern).

VERIFIED CORRECT (2026-06-06 tooltips, no changes needed):
- id 5420 Runemarked Stormbind Tunic (Shirt, IL 3800) — full tooltip match:
  stats, Lethal Tactics (+10,625 Critical Severity @ Stamina>75%), source, no
  set. Confirms the shirt-row position in the Reghed Edge collection grid and
  the Lethal(shirt/CritSev) ↔ Precision(pants/CS) Tactics mirror pair.

## Set field vs Set marker drift — global backlog (found 2026-06-06)

A scan for entries whose top-level `set`/`setSize` disagrees with their own
equipBonuses `type:"Set"` marker found a large pre-existing backlog (hundreds),
mostly `setSize: null` where the marker says `pieces: 2` (Pioneer/Primal/Pilgrim
families, Prismatic Defier, Mark of the Initiate/Novice/Recruit, …) plus a few
name/size conflicts (Vistani Pendant/Raiments: set "Vistani"/3 vs marker /2).
Top-level set/setSize is display/filter only (badge + advanced search); the
engine counts pieces via markers, so math is unaffected. Worth a mechanical
backfill pass someday — but verify each family's marker is itself trustworthy
first (the Jotunskar case above shows markers can be intake copy-paste errors).

## Mount power capture anchors — Celestial fixed, 7 lower-IL entries to confirm (2026-06-06)

n00b verified in-game: a standard mount power shows **IL 3000 at Mythic and
IL 3937 at Celestial** (combat and equip alike; 3937/3000 = the Celestial stat
multiplier). FIXED same day: the 11 powers captured at Celestial (IL 3937 —
Pack Tactics, Reactive Agility, The High Ground, Unstoppable Force, Vigilance;
Relentless Hunter, Rain of Shards, Frozen Stamp, Grand Inspiration, Ground
Slam, Stabby Stabs) now carry `anchorRarity: "Celestial"`, and toon-forge
scales every application (stats, CR, procs, party effects, damage debuff,
display) by selected÷anchor — previously they double-scaled at Celestial and
TIL ignored mount-power rarity entirely.

STILL TO CONFIRM (likely Legendary captures — IL 2000 = 3000×2/3 — but the
2250s match no known tier ratio):
- equip 37 Rapid Accuracy (IL 2000); combat 38 Dragonbone Whirl, 40 Frozen
  Retribution, 48 Giant Toad Tongue Lash, 53 Vortex (IL 2000)
- combat 74 Call of the Cosmos, 79 Radical Radiance (IL **2250** — odd; maybe
  a different base IL family or an Epic-ish capture)
Need: one in-game screenshot of any of these at a known rarity to set their
`anchorRarity` (until then they're treated as Mythic-anchored, status quo).
Also unverified: power IL at Legendary/Epic/etc. for the TIL ratio table
(`MOUNT_POWER_IL_RATIO` only has Mythic + Celestial).

## 2026-06-05 audit — data corruption batch RESOLVED + parked leftovers

FIXED (gear.json, commits this date):
- ids 5328–5331 Aegis of the Condemned: item_level was the rarity tier
  (350/500/650/800); corrected to 3750/4100/4450/4800 via CR/0.9.
- ids 340–344 Tempest Gaze Seal/Mark/Ink/Insignia/Crest: IL 1150 → 3150
  (CR 2835 = 0.9×3150, matches sibling id 264).
- id 480: combinedRating 4805 → 4095 (0.9×4550).
- ids 5152, 5240: equipBonus setName 'Whisper of Power' → 'Impending Doom'
  (set field already said Impending Doom; engine matches on setName).
- Deleted 33 entries: 10 stub dups (5169–5178, empty equipBonuses + wrong
  IL 3000, richer 4146-series kept) + 23 exact dups (identical on every
  core field; metadata folded into the kept entry first).

PARKED — same-name pairs that are NOT exact dups, need judgment/in-game check:
- ~~Dragonflight Ward Necklace ids 2569 vs 5938~~ **RESOLVED 2026-06-05**:
  in-game tooltip (archived: `gear/accessories/Dragonflight Ward Necklace_IL588.png`)
  shows +353 Combat Advantage / +529 **Critical Avoidance** — the sourceless
  id 5938 had the right stats. Kept the documented id 2569 with its stat
  corrected (Defense → Critical Avoidance) and deleted 5938.
- **Starhide Skullcap 3221 vs 5914, Starhide Doublet 3222 vs 5915,
  Runefrost Hunter's Coat 5494 vs 6208**: same item, equipBonuses differ in
  STRUCTURE (one parsed/structured, one prose-only — possibly different
  bonus magnitudes too). Reconcile the bonus content, keep one entry each.

Companion-power "suspicious scaling" cluster — first two verified 2026-06-05,
BOTH were correct in the db (archived in `inbox/companions/`):
- **Raptor's Instincts (id 49)**: 4.5% Power at IL 900 confirmed — it's a
  per-stack party power (Part of the Pack, ×5 stacks), so the single-stat
  scale (9.0) never applied. Notes updated; do not normalize.
- **Bobby's Vigor (id 89)**: +12,000 Max HP / +4.5% Defense at IL 750
  confirmed — deliberately off both scales (Energon-class outlier). Notes
  updated; do not normalize.
- Lesson: the remaining ~exp/2 cluster members (Blink Dog id 39, Moonshae
  Druid id 165, Skeleton Dog id 222, Cunning Hunter id 237, etc.) are now
  LOW-suspicion — special mechanics likely explain them too. Verify
  opportunistically, not urgently.

## Flayed Legion siblings — incomplete entries (spotted while fixing Report #87, 2026-06-06)

Report #87 fixed the Harness (id 288: added missing Combat Advantage 1,968 +
`allowedClasses: ["Barbarian"]`, both player-verified). Its three set siblings in
`../data/gear.json` share the same gaps but have NO player verification yet — do not
guess; fix during a Barbarian-gear screenshot pass:

- **id 286 Sabatons of the Flayed Legion** (Feet, IL 4100): only ONE stat
  (Accuracy 1,997) against CR 3,690 — almost certainly missing 1–2 stats.
  No `allowedClasses`.
- **id 287 Vambraces of the Flayed Legion** (Arms, IL 4100): stats plausible
  (CA 2,460 + Power 2,152) but no `allowedClasses`.
- **id 289 Mask of the Flayed Legion** (Head, IL 4100): 3 stats present but no
  `allowedClasses`.

All four slots are class-specific, so missing `allowedClasses` means these show in
every class's picker. Likely all Barbarian (matching the Harness), but unverified.

## Six clothing variants from 2026-06-02 screenshots — RESOLVED 2026-06-05 (verifies done)

Resolution of the section previously titled "Six clothing variants fully transcribed,
awaiting slot confirmation":

- **The five Mark variants were ALREADY in gear.json** — ids 500 (Convert — Survivor's
  Remedy, Shirt), 501 (Adept — Healing Tactics, Shirt), 502 (Fledgling — Healing
  Tactics, Shirt), 504 (Recruit — Solitary Power, Shirt), 505 (Initiate — Solitary
  Power, Pants), all noted "Verified in-game 2026-05-17". The earlier transcription
  pass missed them (it checked the bare display names, which match ids 494–499, and
  concluded the variants were absent). The 2026-06-02 screenshots re-confirm all five
  stat-for-stat. No insertion was needed.
- **Bloodwoven Brands — Warden's Defense ADDED as id 6870** (Pants — slot confirmed by
  n00b 2026-06-05; IL 3150, CR 2,835).
- Set-bonus text corrections applied from the same screenshots: Enchanted Forte 2pc
  is **+3,000 Forte** (was +1,000 in ids 495/496/501/502); legacy `setBonus` strings
  on 494/500 (+3,000 Awareness), 497/499 (+3,000 Accuracy, replacing a speculative
  "+3% Combat Advantage" note), and 467 (**+2% Awareness** — the Dark Magic family
  bonus is a percent, unlike the Glorious Undead family's flat +3,000 rating).
  Structured Set entries added to 467/497/499, which previously had none.

In-game checks — BOTH CONFIRMED by n00b 2026-06-05:
- **id 6870 Defense 1,323**: confirmed (the line had been clipped by tooltip scrolling
  in both captures; recovered at 6x and matched sibling id 467). Entry notes updated.
- **id 500 Accuracy 1,521**: confirmed — the db value was right all along; the
  2026-06-05 transcription pass's 1,524 was the OCR misread.

KNOWN HAZARD (display-only, documented not fixed): the set name **"Enchanted
Awareness" is used by two different in-game sets** — Glorious Undead Defence
Shirt+Pants (IL 2600, 2pc +3,000 Awareness; ids 494/500) and Dark Magic Defence
Shirt+Pants (IL 3150, 2pc +2% Awareness; ids 467/6870). toon-forge.html
`countSetPieces()` keys on `setName` alone, so equipping a Glorious Undead Shirt with
the Dark Magic Pants (id 6870) shows a false "set complete" badge. No stat corruption:
these Set entries carry description text only (no stat/amount), so the engine applies
nothing. Proper fix: key set matching on setName + setPieces signature when
`setPieces` is present — needs a sweep first to confirm partner pieces carry
consistent `setPieces` arrays, else currently-working sets would silently break.

## Toon Forge: artifact weapons in pickers — FIXED, residual data cleanup (2026-05-31)

FIXED (commit 0d18a66): the Main Hand / Off Hand pickers now include "Artifact
Equipment" weapons via artifactHand() — routes by notes/weapon type (165 Off,
149 Main), shows hand-unknown exotic weapons (128) in BOTH hand pickers.

RESIDUAL data cleanup still open:
- **~13 mis-slotted "armor" tagged Artifact Equipment** — Silverspruce Sash (Belt),
  Company Raider's Cloak (Neck), Protege's Hood/Boots/Gloves (Head/Feet/Arms), etc.
  These are intake slot errors; re-slot them to their real slots (then they'll be
  pickable in the right slot AND drop out of the weapon pickers).
- **128 exotic-named weapons show in BOTH Main+Off pickers** (hand unknown from
  name). To resolve, add weapon-type→hand for the Chult/Aztec names (Khaltan,
  Itztopilli, Temicamatl, Mekatl, Latt, Kenshar, Quauhololli, Cuauhchimalli, etc.)
  or capture the hand from a screenshot per line.
- Other bad slots needing cleanup: `Physical, Weapon` ×8, `Epic Equipment` ×5,
  `Clothing: Jotunskar` ×2, `Physical` ×1.

## Pending Cleric add: Warden of the Last Rite (Report #78, Confirmed 2026-05-30)

Genuinely missing Cleric main-hand weapon. Player-form data (verify vs screenshot when
processing Cleric gear): Main Hand, IL 4800, CR 4320, Set Impending Doom, Soul Harvest.
Stats Damage 100 / Power 1680 / Critical Severity 2880 / Outgoing Healing 1920. Usable by
Cleric. Add during the Cleric-gear pass with an in-game screenshot.

## Jotunskar gear: "Winterworn Harness" is a placeholder set name (OPEN, 2026-05-29)

37 Jotunskar (Master) entries carry `set: "Winterworn Harness"` — but it spans many
unrelated item lines (Aetherwrap, Dawnshard Raiment, Earthshard Guard, Stormbind Tunic,
Titanweave Harness, Lifebraid Vestment, Stonevein, AND the Frostbound 4-piece armor). It's
an intake placeholder; no in-game tooltip shows "Winterworn Harness" as a set.
KNOWN so far (from screenshots): the **Stonevein** line (Harness=Pants, Straps=Shirt) =
**Freezing Fortitude** (Reports #59/#60) — fixed on ids 5371, 5377, 5447. The other lines'
real set names need screenshots. Also: each shirt/pants line is a 2-piece set (Harness=Pants,
Straps=Shirt; likely Raiment/Guard/Vestment/Tunic/Aetherwrap pair up similarly) — verify
slots per line. And Veinlit Stonevein Straps (5447) stats are still UNVERIFIED.

UPDATE 2026-06-06: the Lifebraid/Stormbind/Aetherwrap lines DON'T use distinct
shirt/pants names — they reuse the SAME display name in both slots with a different
bonus variant (like Bloodwoven). Added the missing Cracked-tier **Pants** variants from
n00b's collection screenshots (slot confirmed via grid tiles): ids 6872 (Cracked
Lifebraid Vestment — Survivor's Gift), 6873 (Cracked Stormbind Tunic — Reckless
Advantage), 6874 (Cracked Aetherwrap — Challenger's Awareness), all IL 4,600. Their
tooltips show NO set block, so they were deliberately NOT linked to the shirts'
"Freezing …" sets — verify pairing in-game before linking. STILL MISSING: the Pants
variants of the other tiers (Veinlit / Runemarked / Deep-Riven / Frost-Riven) for these
three lines — need screenshots. The new `set: ""` on the pants is intentional (the
"Winterworn Harness" placeholder was not propagated).

## Bloodwoven set — slot-conflict pairs need screenshots (OPEN, 2026-05-29)

Cleaned up 2026-05-29: deleted exact-dup em-dash entries (468, 470) and two malformed
"Bloodwoven Ink" Armor-slot stubs (5268, 5333; folded into real id 416 Survivor's Gift
Ink, confirmed by screenshot). STILL OPEN — same-name+bonus pairs sitting in DIFFERENT
slots; per the per-variant-slot lesson ([[reference_nw_collection_slot_per_variant]]) these
may both be real or one may be a slot error. Need in-game shots to decide:
- Critical Empowerment: id 420 (Pants) vs id 472 (Shirt)
- Challenger's Strength: id 421 (Shirt) vs id 469 (Pants)
- Butcher's Zeal: id 423 (Shirt) vs id 471 (Pants)
Also: Bloodwoven uses two naming styles — "(Bonus)" parens (415-424) and "- Bonus"
em-dash (467-472). Pick one convention during a future set audit.

## Arcane Conduit Insignia — Corrupt Power (Report #41, RESOLVED 2026-05-29)

RESOLVED via in-game screenshot of the Corrupt Power variant (Screenshot 2026-05-29
160558; cropped to `gear/unbound-gear/shirt/Arcane Conduit Insignia Corrupt Power_IL3800.png`).
Tooltip confirms the equip bonus IS **+5% Power, -7.5% Incoming Healing** (player's
"+11,250" was the game's flat display of 5% Power). #41 closed Won't Fix.
Separate bug fixed while verifying: id 451's third rating stat was **Power 1197**, in-game
it's **Defense 1197** — corrected.

SLOTS CONFIRMED (n00b, 2026-05-29): the two Insignia variants are in DIFFERENT slots —
Challenger's Awareness = **Pants** (id 448), Corrupt Power = **Shirt** (id 451). Both are
correct in the data. Sigil variants likewise: Explosive Defense = **Shirt** (id 447, was
wrongly Pants, fixed Report #64), Survivor's Avoidance = **Pants** (id 442). All four
verified by in-game screenshots. **Lesson: slot is per bonus-variant, NOT per piece-name** — do not
infer a piece's slot from another variant with the same name. (An earlier "consistency"
edit that flipped 448 to Shirt was reverted.) By the same logic the Critical Momentum
Crests (388/452, Shirt) are NOT assumed wrong just because the Combatant's Advantage
Crest (445) is Pants — leave them unless a screenshot says otherwise.

## Missing Gear Sets — flagged by community (Report #33, 2026-05-26)

Player report flagged the following gear as missing from the site:

- **Slaughterhouse Cindersilk set** — Cindersilk Robes RESOLVED 2026-06-09:
  added as gear id 6876 from n00b's in-game tooltip (Report #105 → Fixed).
  Armor, Warlock/Wizard, IL 4,600, CR 4,140, Accuracy +3,319 / Combat
  Advantage +2,484, equip bonus **Ruthless Might** (1.2%/stack Crit Strike +
  Crit Sev, max 5 = 6%), drops from The Slaughterhouse. The tooltip shows
  only 2 stats and NO set block — the 2-stat budget is real, and no set is
  modeled. Other Cindersilk pieces (Hood/Sleeves/Boots etc.) still missing —
  need tooltips as they drop.
- **Ritualistic Necklace & Strap** — accessory pieces
- **Mod 33 gear** — new equipment from the latest module

Need to: source screenshots (in-game tooltips or NW Hub references),
extract stats, add to `gear.json` with proper slot/set/IL data.

## Missing Gear — Doomcleaver (Reports #36–#40, 2026-05-26) — RESOLVED 2026-06-12

Player tried to use the data-correction form on Elk Tribe Noble's Mace
to flag a missing weapon called **Doomcleaver** (didn't find it in our
database, so they used the closest weapon-shaped entry as a vehicle).

RESOLVED: Doomcleaver turned out to be the **Barbarian** variant (the
"Barbarian or Fighter?" question is answered — see the next section for
the Fighter side). Ingested from n00b's barbarian collection captures
(`docs/audit/_up/barbarian-gear/Doomcleaver_IL*.png`, batch_06) as a
complete 6-tier family: IL 3400 (Whisper of Power tier) + IL 3750–5250
(Impending Doom, gear ids 6429–6433). Its off-hand partner **Knot of
the Bloodbound** is also complete (6 tiers). The player's guessed stats
were close but the real distribution is Crit Strike / Crit Severity /
Deflect + 50 weapon damage.

## Fighter weapons missing — including the Mod 33 / Soul Collector set (2026-06-12)

Follow-up to the Doomcleaver investigation: the **Impending Doom**
artifact weapon set (Soul Collector zone mechanic — the "Mod 33 gear"
flagged in Report #33) now covers 8 of 9 classes. **Fighter has no
entries at all** — no main hand, no shield, at any tier.

Coverage by class (MH + OH unless noted):
- Barbarian: Doomcleaver + Knot of the Bloodbound — complete
- Bard: Dirgeblade + Strings of the Forsaken — complete
- Cleric: **MH only** (Warden of the Last Rite, single IL 4800 entry;
  no off-hand, no other tiers)
- Paladin: Oathbreaker's Malevolence + Aegis of the Condemned — complete
- Ranger: Grimfang + Harrowed Messengers — complete
- Rogue: Scream Seeker + Dread Confessor — complete
- Warlock: Omen of Doom (only IL 3400 + 4800 tiers) + Codex of Eternal
  Chains
- Wizard: Eye of the Doomweaver + Remnant of the Shattered Veil — complete
- **Fighter: nothing**

The gap is much wider than one set: **gear.json has only 7 Fighter
weapon entries total, topping out at IL 800** (Dragon Bone Shield).
Cleric has exactly 1. Every other class has 264–371 weapon entries.
A Fighter or Cleric in Toon Forge effectively has no endgame weapon
options.

Archives swept 2026-06-12 (calibration inbox incl. `_trash/originals`,
audit `_up`/`batches`): the only Fighter weapon captures are the 6
ancient ones already in the DB. The Broadsword/Kite Shield captures in
`_trash` are Paladin collection tabs, not Fighter. Community wikis
don't list the new Fighter weapon names yet (fandom wiki is pre-Mod-32).

**Action (needs n00b):** in-game screenshots of the Fighter weapon
collection tabs (or tooltips from a Fighter character) — at minimum the
Impending Doom MH + OH at one verified tier; ideally the full 6-tier
ladders. Same ask for the Cleric off-hand, the missing Warden of the
Last Rite tiers, and Omen of Doom's middle tiers (3750/4100/4450).
Filed as a public report on the reports board 2026-06-12 so it's
tracked until the screenshots can be captured (n00b's Fighter was
unavailable at the time — other toon mid-dungeon).

## Cracked Earthshard Guard — two variants merged into one — RESOLVED 2026-06-12

Player-flagged (relayed by n00b): the Charged Defiance ("take 3% less
damage") Cracked Earthshard Guard was filed as Pants but is a Shirt.
Archive originals (`_trash/originals/Cracked Earthshard Guard*.png`,
2026-05-25 batch) showed the in-game truth: there are TWO IL 4600
Jotunskar (Master) variants with this name, and entry id 5362 had
merged them — Combatant's Advantage variant's stats with the Charged
Defiance variant's bonus, slotted Pants.

Fix (tooltip-verified at 2x upscale):
- id 5362 → the true **Charged Defiance Shirt**: Power 1,449 /
  Deflect 4,140 / Incoming Healing 2,484 / +1.5% Recharge Speed.
  Template is byte-identical in ratios to the player-verified
  Frost-Riven Earthshard Guard Shirt (id 5375), which carries the SAME
  bonus at 4.5% — the 4850-tier scaling of Cracked's 3%.
- new id 6877 → the **Combatant's Advantage Pants**: Defense 1,932 /
  Deflect 2,588 / Deflect Severity 2,588 / +1.5% Stamina Regeneration.
  Defense+Deflect+Deflect Severity is the established Pants template.

Pattern note: this is the same per-bonus-variant slot rule as Reports
#64/#106/#107 — and a new twist: a dual-variant name can get its two
tooltips MERGED into one entry at intake. When a slot complaint comes
in, check whether the archive holds two different tooltips under the
same name before assuming a simple slot flip.

## B2 — Mount Equip Power ID 56 "Seeing Red" — RESOLVED 2026-06-09

n00b captured Balgora's Mount Preview in-game (2026-06-09): Seeing Red at
IL 3,718 shows 12,396 Accuracy proc (40% on encounter, 8s, 15s ICD) and
+3,347 CR. Those values scale EXACTLY to the Celestial anchor (IL 3,937 →
13,125 Accuracy / 3,544 CR — integer-perfect, and identical template to The
High Ground id 51, which stores 5.0-per-IL vs Seeing Red's 3.333-per-IL).
Backfilled id 56 with item_level 3937 / anchorRarity Celestial /
combinedRating 3544 / cooldownSeconds 15. The same screenshot confirmed
Hell's Impact (combat power id 87) was a Celestial capture — its entry now
carries item_level 3937 / anchorRarity Celestial too (930/143/13.9% at 3,718
= exact 3,937/3,718 scaling of the stored 984/151/14.8%).

---

## Avernus Campaign Leveling Conduits — Set Name Best-Guess (2026-05-17)

Backfilled 25 Shirt/Pants orphans (IL 1225-1325, 5 rarity tiers each) into
two best-guess set buckets pending in-game verification:

- `Avernus Campaign Leveling Armor` — Shirts/Pants of the Negotiator/Interrogator
  (15 items, ids 1469-1473, 1479-1488)
- `Avernus Campaign Leveling Conduits` — Upper/Lower Pact Brands of the
  Flame/Fire/Pyre/Inferno/Blaze-bond (10 items, ids 1474-1478, 1489-1493)

Source set to "Avernus Campaign" for all. Note these are pre-Mod 16 era
leveling Conduits — not relevant to current endgame builds.

**Action:** Verify actual set names in-game if/when n00b encounters them on
a low-level Avernus playthrough or in the campaign collections menu.
Related Tunic items (ids 1464-1468 Armor slot) remain orphans — same
verification path applies.

## Dragonflight Shirt Orphans — Source Backfilled, Set Unknown (2026-05-17)

4 Dragonflight Shirts (ids 2402-2405, IL 1500) backfilled with source
"Stronghold Guild Marketplace (Rank 3)" derived from sibling entries
(ids 2398-2399). Set name still unknown — possibly "Dragonflight Conduit"
or similar Mod 18 Stronghold-themed name.

## Bloodwoven / Tempest Gaze Conduit Family — Triple-Entry Pattern (2026-05-17)

Discovered during orphan cleanup. For each base Conduit name (e.g.,
`Bloodwoven Signs`), the data has up to 3 entries:

  1. **Parenthetical:** `Bloodwoven Signs (Critical Empowerment)` —
     has source ("Collection Set 16 of 21 — Doomvault Remains") but no set
  2. **Em-dash:** `Bloodwoven Signs — Critical Empowerment` —
     has set name (Enchanted Awareness/Healing/Advantage) but no source

These should probably be merged so each (base + equip power) combination
is ONE entry that carries both `set` AND `source`. Affects:

- Bloodwoven (Brands/Ink/Runes/Sigils/Signs/Symbols) — 6 base names
- Tempest Gaze (Sigil/Seal/Mark/Crest/Insignia/Ink/Mark) — similar pattern

**Action:** Walk through each base name pair and merge. Verify in-game that
the slot assignment (some are Pants, some Shirt) is correct per equip
power, since base orphan entries showed Pants/Shirt inconsistencies.

## Celestial Sash + Divine Focus — Singleton Belt/Neck Orphans (2026-05-18)

Two IL 550 singleton orphans with no sibling family context:

- id 1436 `Celestial Sash` (Belt) — Accuracy 412 / Defense 412 + DEX 1
- id 1435 `Divine Focus` (Neck) — Crit Strike 412 / Crit Severity 412 + CON 2

"Celestial" + "Divine" naming + ability bonuses suggest Cleric-themed class
quest or campaign reward, possibly from Mod 5-7 era. Needs in-game lookup
to confirm source.

## Class-Themed Ring Orphans Pending Source Verification (2026-05-18)

17 ring orphans left after the 70-ring bulk source backfill on 2026-05-18.
n00b couldn't recall the source for these on-the-spot. Pending verification:

**IL 1400 role-themed rings (6 items):**
- id 1129 Medic's Ring of Mending
- id 1130 Mercenary's Ring of Resistance
- id 1132 Officer's Ring of Striking
- id 1137 Physician's Ring of Healing
- id 1136 Scout's Ring of Striking
- id 1131 Soldier's Ring of Advantage

**IL 1650 class-themed rings (11 items):**
- id 1119 Wayseeker's Ring of Punishment
- id 1120 Mightbreaker's Ring of Elegance
- id 1121 Soulfire Ring of Piety
- id 1122 Stalwartneedle Ring of Bulwark
- id 1123 Waywatcher's Ring of Advantage
- id 1124 Wayseeker's Ring of Intellect
- id 1125 Soulfire Ring of Penance
- id 1126 Soothsayer's Ring of Confession
- id 1127 Waywatcher's Ring of Precision
- id 1128 Mightbreaker's Ring of Clarity
- id 243  Soothsayer's Ring of Absolution

Likely Avernus/Vallenhas era (Mod 17-19) but needs verification. If found
in-game, update with proper source.

## Silverspruce Gladiator Ring — PvP/PvE Status Unknown (2026-05-18)

id 2494 `Silverspruce Gladiator Ring` (IL 756) — Sea of Moving Ice
gemstone ring family. Other Silverspruce rings (Ward, etc.) at the same
IL exist as PvE. The "Gladiator" suffix variant could be PvE DPS or
PvP variant.

n00b couldn't locate this item in-game during 2026-05-18 audit. Kept
pending verification. If verified as PvP, delete per n00b's PvP gear
policy.

## Paladin IL 3900 'of the Thayan Zealot' Weapons — Set Unknown (2026-05-17)

Two Paladin orphan weapons at IL 3900 share the "Thayan Zealot" naming
convention with the Umbral Stride set, but the IL doesn't match any
known Umbral Stride tier (existing pieces are all IL 3300):

- id 374 `Oathbreaker's Judgment of the Thayan Zealot` (Main Hand)
  ratings: Critical Severity / Defense
- id 373 `Doomward Bastion of the Thayan Zealot` (Off Hand)
  ratings: Awareness / Forte

**Action:** Verify in-game — could be Umbral Stride at a different tier,
a separate Paladin-only set, or a Whisper of Power lower-tier variant.

## Role-Variant Gear Pairs — Needs In-Game Verification (2026-05-16)

Audit found 10 gear entries that share the same (slot, name, item_level, set,
allowedClasses) but have *different* `ratingStats`. Each pair is either a
legitimate role variant (DPS vs Tank version of the same item) or a data error.
n00b is walking through one at a time and verifying in-game.

**Status of each pair:**

- [x] **Fiend Forged Cuisses** (Feet, IL 1230, Infernal Forged Armor) —
  Resolved 2026-05-16. n00b confirmed in-game shows Crit Strike / Defense /
  Crit Avoidance only. Deleted id 1397 (had wrong Awareness stat); kept id
  3412 and added missing +1% Damage vs Demons/Devils/Fiends bonus.

- [ ] **Dungeon Raider's Cuisses** (Feet, IL 940, Armor of the Dungeon Raider) —
  Flagged 2026-05-16. n00b does not see this item in-game; unclear whether it
  was retired in Mod 16 rework or still exists as legacy Zen Market gear.
  - id 1591: CA 352 / Defense 705 / Awareness 352 — source Zen Market
  - id 3492: Crit Strike 352 / Defense 705 / Crit Avoidance 352 — source
    Zen Market / Trade Bar Store
  - **Action:** Verify if item still exists in-game. If retired, delete both.
    If exists, verify which stats are correct.

- [x] **Greaves of the Scarlet Arcanum** (Feet, IL 5000, Doomed Reaver) —
  Resolved 2026-05-16. n00b confirmed in-game CA=3300. Deleted id 2710
  (wrong CA=3500); kept id 3924.

- [x] **Gauntlets of the Scarlet Arcanum** (Arms, IL 5000, Doomed Reaver) —
  Resolved 2026-05-16. n00b confirmed in-game CA=3300, CritSev=4050.
  Deleted id 2711 (wrong: CA=3500, CritStrike); kept id 3931.

- [x] **Umbral Duelist Longcoat** (Armor, IL 728, Umbral Set, Warlock) —
  Resolved 2026-05-16. n00b confirmed Awareness. Deleted id 3860 (Crit
  Strike variant); kept id 3897.

- [x] **Umbral Executioner Longcoat** (Armor, IL 728, Umbral Set, Warlock) —
  Resolved 2026-05-16. n00b confirmed Crit Avoidance. Deleted id 3864 (Crit
  Sev variant); kept id 3898.

- [x] **Company Raid Wristguards** (Arms, IL 588, Company PVE Armor, Warlock) —
  Resolved 2026-05-16. n00b confirmed Crit Strike. Deleted id 3869
  (Accuracy variant); kept id 3889.

- [x] **Company Assault Cowl** (Head, IL 588, Company PVE Armor, Warlock) —
  Resolved 2026-05-16. n00b confirmed CA 265 / Crit Sev 176. Deleted id 3871
  (Crit Strike variant); kept id 3888.

- [x] **Company Assault Longcoat** (Armor, IL 588, Company PVE Armor, Warlock) —
  Resolved 2026-05-16. n00b confirmed CA 265 / Crit Sev 176. Deleted id 3872
  (Crit Strike variant); kept id 3885.

- [x] **Company Assault Pigaches** (Feet, IL 588, Company PVE Armor, Warlock) —
  Resolved 2026-05-16. n00b confirmed Crit Strike 265 / Crit Sev 176 /
  Defense 441. Deleted id 3874 (no Crit Sev); kept id 3886.

**Decision rule when resolving:** if both variants genuinely exist in-game,
disambiguate names (e.g., "Item Name (DPS)" / "Item Name (Tank)"). If only
one is correct, delete the wrong id and update the surviving entry.

**Outcome (2026-05-16):** 9 of 10 pairs were data-entry errors (not real
role variants). One entry had the correct stats, the other was wrong from
an old intake batch. Only Dungeon Raider's Cuisses remains open pending
n00b finding the item in-game.

## Gear Slot Assignment Audit Needed

Verified 2026-05-12 by n00b: **Mystic Conduit Mark** (Conduit family Shirt/Trousers
gear) was stored as `slot: "Pants"` across 4 entries (ids 395, 402, 454, 460)
but is actually a **Shirt** slot item in-game. Fixed those 4 entries.

Broader concern — several Conduit-family pieces have suspicious slot
assignments worth verifying:

- **Bloodwoven Ink** appears in both Pants (id 13, id 471) and Shirt
  (id 416, id 423) — same name, two slots. Possibly two distinct NW
  items, or one of them mis-slotted.
- **Tempest Gaze Mark** appears as Shirt (id 341), Pants (id 410), and
  Shirt (id 490) — same naming inconsistency.
- **Mark of the Convert / Adept / Fledgling / Recruit / Novice /
  Initiate** — **PARTIALLY RESOLVED 2026-05-17.** n00b verified in-game
  that `Mark of the Convert (Survivor's Remedy)` is a **Shirt**, not Ring,
  and comes from Red Harvest Heroic Encounters / Red Harvest Campaign
  Store. Applied to all 12 Ring entries (ids 350-361):
  - Convert/Adept/Fledgling/Recruit (8 entries) → Shirt
  - Novice/Initiate (4 entries) → Pants
  - 9 merged into existing Shirt/Pants twins (richer Ring data preserved
    — full equipBonuses + allowedClasses)
  - 3 re-slotted in place (no twin existed)
  Still open: confirm the Pants vs Shirt assignment for Novice/Initiate is
  consistent (Pants in current data may itself be wrong — n00b said only
  Convert was Shirt; pants for the others is inferred from existing data).

For each: verify in-game tooltip slot, correct any wrong assignments.
Best path is one Conduit-family piece at a time as n00b encounters them.

## Gear Set Bonuses — Missing Data

### Impending Doom (Paladin / Ranger Main+Off, two-piece set)

The whole set needs structured equipBonuses + Unleashed proc data.
Source pieces in `data/gear.json`:

- **Paladin** — Oathbreaker's Malevolence (Main Hand) + Aegis of the Condemned (Off Hand)
  - IL tiers in data: 3,750 / 4,100 / 4,550 / 4,800 (Mythic) / 5,250 (Celestial)
  - Tier-4800 Off Hand (id 465) has narrative-only set bonus text — the
    rest of the Paladin pieces are completely empty.
- **Ranger** — Grimfang (Main Hand) + Harrowed Messengers (Off Hand)
  - IL tiers in data: 3,750 / 4,100 / 4,450 / 4,800 (Mythic) / 5,250 (Celestial)
  - All pieces have empty equipBonuses.
- **Other classes** (Cleric / Warlock / Bard / etc.) not present in data
  at all — need separate ingestion if they have Impending Doom variants.

**What's missing per piece:**

1. **2pc stat bonus** — class- and role-specific. Known anchor from n00b
   2026-05-12: **Ranger Mythic (IL 4800) 2pc = +7.5% Critical Strike +
   3.7% Accuracy**. Scale to other tiers via the standard tier
   multiplier and verify each rarity in-game.

2. **Unleashed mechanic** — set builds 10 Charges (1 per Daily power use
   on a 10s cooldown; 1 per Encounter on a 1s cooldown; +1 per Nsec in
   combat). On reaching 10, triggers an "Unleashed" buff with
   class/role-specific effects. Per id 465's existing narrative on the
   Paladin variant: Tank −1% Incoming Damage, Heal −1% Outgoing Healing,
   plus +x% Forte and +x% Defense (numbers unverified). Need:
   - charge generation triggers + cooldowns
   - buff duration when unleashed
   - per-class/role stat values

**How to backfill (when ready):**
1. n00b hovers each class/tier variant in-game and pastes the 2pc tooltip text + the Unleashed effect text per role.
2. Structure into equipBonuses with `type: "Set"`, role filter, stat/amount fields, perStack/maxStacks for the Unleashed proc.
3. Engine already supports role-conditional set bonuses (Dark Matter 2pc Healer pattern) and perStack proc bonuses (Critical Harmony pattern) — no engine work expected.

## Companion Power Scaling Issues

### Fixed-Effect Powers (No Scaling)
These powers show the same values at all rarities. Verified in-game — confirmed fixed or scaling added.

#### Resolved (2026-03-28)
- **Hank's Aim** (Hank the Ranger) — DOES scale. 30x single stat magnitude (225 at Mythic, 270 at Celestial). Report #3 Fixed.
- **Elminster's Chain Lightning** (Elminster Simulacrum) — DOES scale. 10x single stat main mag, 2x single stat chain. Old values (66/16.5) were wrong. Report #7 Fixed.
- **Doom and Bloom** (Fireblossom Zealot) — DOES scale. ~3.33x single stat heal % (18.3% at Legendary, ~30% at Celestial). Report #10 Fixed.
- **Ox Stot's Instincts** (Ox Stot) — Confirmed fixed effect. 20% stun 3s does not change (verified IL 150 vs 550). Report #6 Fixed.
- **Chickenmancer's Discipline** (Earl the Chickenmancer) — Confirmed fixed effect. 10% polymorph does not change (verified IL 250 vs 375). Report #8 Fixed.
- **I'm Just a Little Adventurer** (Eric the Cavalier) — Confirmed fixed effect. Stun 3s + 90% threat does not change (verified IL 375 vs 550). Report #9 Fixed.
- **The Bigger They Are** (Minsc) — Previously fixed. Scales 6.8%-9.8% at Celestial. Report #16 Fixed.

#### Still Open
- **Consume Soul** (Lich Makos) — 90 magnitude + 5% heal. Needs verification at two rarities. Report #4 Confirmed. Need owner to check.
- **Effulgent Epuration** (Elminster Aumar) — 15% shield at all rarities. No report submitted.
- **Fiendish Charmer's Distraction** (Incubus) — 10% daze 3s at all rarities. No report submitted.
- **Succubus's Distraction** (Succubus) — Same as Incubus. No report submitted.

### Special Scaling Patterns
Powers that scale but don't follow standard single/double stat tables.

- **Igneous Skin** (Minotaur) — Reduces damage taken + increases AoE damage. Known values: screenshot showed 10%/7.5%, Celestial is 12%/12%. Non-standard scaling. Deleted bug report #5 after correction.
- **Rattigan the Wise** (Plagueborne Insight) — 4.8% Power + CA per stack at Celestial. Doesn't match standard double (4.50%). Base rarity Mythic.
- **Grace Revoir** (Unseelie Cruelty) — 5% at Mythic, 13.5% at Celestial. Big jump, doesn't match any table.
- **Vampire's Kiss** (Vampire/Vampire Bride) — 3.6% heal at Epic. Doesn't match standard tables.
- **Hollyphant's Guidance** (Lulu the Hollyphant) — DR follows double stat, heal follows single stat. Two different scales on same power.
- **Blaspheme Assassin** (Spiteful Presence) — 6% fixed necrotic + 0.75x single Crit Severity. Mixed fixed/scaling.
- **Wererat Thief** (Wererat Discipline) — Slow at 2.2x single, magnitude at 0.5x standard. Two different scales.
- **Baby Bear** (Baby Bear's Instincts) — Chance at 2x single, stats at 0.75x single. Two different scales.

### Celeste Power Name Fix
- **Celeste** — Was "Divine Answers" (Forte + Outgoing Healing), corrected to "Celeste's Wisdom" (proc heal when below 50% HP). The old "Divine Answers" power (ID 146) may still exist as orphaned data.

### Companion Name Issues
- **Watler** — Was "Wailer" in data, corrected to Watler.
- **Portalhound** — Was "Portalerhound" in data, corrected.
- **Conartist** — Was "Con Artist" in data, in-game shows "Conartist's Discipline".
- **Undying Overlord** (Lich) — Was "Undying Overbound" in data, corrected.
- **Fire Eye** — Removed as duplicate of Blue Fire Eye.
- **Phasespider** — Was assigned wrong power (Phasespider's Instincts = Little White's power). Fixed to Phasespider's Presence.

### RESOLVED 2026-06-12: Master of Craft was Forte, corrected to Critical Avoidance
Audit screenshot `docs/audit/companions/_up/c141.png` (Rath Modar inspect) showed enhancement
"Master of Craft" (IL 900) as "increase your **critical avoidance** by up to 9% and your companion's
critical avoidance by up to 9%" — but `companion_enhancements.json` id 3 stored it as **Forte** 9%
(wiki/NW-Hub sourced, never n00b-verified). Per n00b: go with the screenshot. Changed id 3 stat
Forte → Critical Avoidance (value 9%, type percent). This is a shared enhancement (one catalog entry),
so the fix applies to all 5 companions that grant it: Kavatos Stormeye, Rath Modar, Golden Goat,
Catti-brie, Etrien.

### Fighter gear intake (2026-06-12) — Report #112 CLOSED (Fixed 2026-06-13)
- Added **503 Fighter gear entries** from 582 in-game collection screenshots (ids 6878–7380). Fighter weapons went from 7 → 297 (MH 132, OH 133, Artifact 32), plus 213 armor pieces. Includes the Impending Doom set MH+shield (Ironfang / Bulwark of Ruin) at every tier IL 3750–5250. Full method in `docs/audit/fighter_intake_summary.md`. Report #112 marked Fixed per n00b.
- **Open follow-up — set bonus pending capture:** Umbral Convergence, Umbral Convergence (Greater), Weapons of the Shieldbearer — items exist and count stats; only the 2-piece set bonus is missing (new sets, no existing DB member to copy from).
- **Open follow-up — Cleric weapons (was the secondary half of #112, now tracked standalone):** Cleric off-hand + missing Warden of the Last Rite tiers + Omen of Doom middle tiers (3750/4100/4450). No Cleric screenshots provided yet — needs a Cleric collection sweep (same pipeline as the Fighter intake).
- Minor: Dragon Bone Trident (IL 800) has no Combined Rating line on its tooltip; stored null (display-only field).

### Missing Companion Data
- **Aoth Fezim & Brightwing** (2026-06-12) — Added from companion-audit screenshot c140. Power: Aoth's Wisdom (id 260 — reassigned 2026-06-13 from a colliding id 257 that it shared with Orc Wolf's Instincts, which silently 10x-undercredited Aoth; found by the full site audit. Offense+Utility, IL 750, +3.8% Accuracy / +3.8% Combat Advantage). Enhancement: Keen Eyes (id 30, player Crit Severity + companion Crit Strike, max 9.6% — tooltip-verified above the usual 9%). Source: Wings and Cauldrons Lockbox (May 2025); display name from official announcement — confirm in-game '&' vs 'and'.
- **Little White** — New companion added. Has Phasespider's Instincts (Utility, 3 stats). Enhancement ref not set.
- **Celeste** — New power created (Celeste's Wisdom, ID 259). Verify proc heal scaling matches in-game.
- **Apprentice Healer** — Fixed from IL 75 to IL 150. Has Max HP + Incoming Healing (uses flat HP scaling table).

### Max HP Scaling Table
Used by multiple companions. Verified from in-game screenshots:
- Com: 1,500 | Unc: 3,000 | Rar: 5,000 | Epi: 7,500 | Leg: 11,000 | Myc: 15,000 | Cel: 18,000
- 2x Max HP table (Energon): 3,000 | 6,000 | 10,000 | 15,000 | 22,000 | 30,000 | 36,000

### Companions Still Without Sources
- Tutor
- Cantankerous Mage
- Lysaera

### Scaling Whitelist
The following Utility companions were manually whitelisted for rarity scaling. If the slot-based filter is removed later, this whitelist can be cleaned up:
Acolyte of Kelemvor, Alpha Compy, Battlefield Medic, Catti-brie, Cleric Disciple, Coldlight Walker, Dark Dealer, Dedicated Squire, Deva Champion, Diana, Githyanki, Icosahedron Ioun Stone, Linu La'neral, Lizardfolk Shaman, Neverember Guard Archer, Rabbit, Shadar-kai Witch, Snow Fawn, Storm Rider, Watler, Apprentice Healer, Lysaera, Tutor.

### Campaign Boosters Added
Companions with campaign currency bonuses added to campaign-boosters.html:
- Eladrin (Sharandar +10%)
- Skyblazer (Blood War +10%)
- Vistani Wanderer (Barovia +10%)
- Dark Dealer (Northdark Reaches +10%)
- Watler (Portobello's 2x)
- Hell Hound (Vallenhas +10%)
- Mage Slayer (River District 2x Portal Stones)
- Wiggins (Acquisitions Inc +10% Time Cards/IOUs)
- Shadar-kai Witch (Dragonbone Vale +10%) — was already listed
- Chultan Hunter (Chult +10%) — was already listed

### Companions Added (2026-03-28)
From Report #18:
- **Soradiel** — Divine Judgement (Defense), Crit Strike + Crit Severity, double stat. Enhancement: Redemption.
- **Kingfisher Intern** — Kingfisher's Wisdom (Offense/Utility), Max HP + Combat Advantage. Enhancement: Slowed Reactions.
- **Elite Intern** — Elite Intern's Wisdom (Offense), Crit Severity + Awareness, double stat. Enhancement: Dulled Senses. Source: Elite Intern Bundle (Module 15).
- **Archmage's Apprentice** — Archmage's Wisdom (Utility), Movement Speed, single stat. No enhancement (old companion).
- **Crimson Crystal Golem** — Crimson Crystal Golem's Influence (Utility/Defense), Accuracy + Combat Advantage, double stat. Enhancement: Deflecting Shards (new).
- **Proud Pink Yeti** — Proud Pink Yeti's Presence (Defense/Offense/Utility), Outgoing Healing, single stat. Enhancement: Reinvigorate.

### Mount Added (2026-03-28)
From Report #19:
- **Cactus the Hedgehog** — Equip: Vigilance (Awareness + Stamina Regen). Combat: Stabby Stabs (shield + defense + reflect). Slots: Regal/Barbed/Uni/Uni(Illuminated).

## Date: 2026-03-28

## C1 audit enrichment TODOs (2026-06-12)
- ~~Ring of Defensive Action / Ring of Offensive Action: tooltips carry Daily-use procs
  (Daily Defiance: -3% Incoming Damage 5s / Daily Edge: +3% Damage 5s) absent from DB.~~
  RESOLVED 2026-06-15 — both added as structured Equip bonuses (ids 1939/1940), plus
  Daily Perk (id 1832, description-only).
- Astral Raider's Coif: Healer's Sacrifice proc (+5% Overall Outgoing Healing,
  -30% Incoming Healing) absent from DB (negative-effect modeling needed).
- Lionsmane IL560: 4 of 8 pieces value-checked by tooltip; remaining 4 (Duelist Vest,
  Executioner Gloves/Boots/Vest) should get the same stat-value spot-check.
- Frostbound boots: Movement Speed contribution to combinedRating inconsistent
  between Hearthboots (1,058) and Stoneboots (1,410) at same 3% — check convention.

## C2 audit side-catches (2026-06-12)
- Curselord's Raid Longcoat: tooltip's Power condition reads "health 90% or more"
  (Assault variant reads 50%) — verify our stored condition text per variant.
- Brynnyr's Demise: capture filename/tooltip says IL 630; our entry says 610.
- Forged family (Fiend/Devil/Demon/Infernal Coif/Cowl/Hood/Sallet): Skirmisher's
  Might confirmed 5,000 Power (10% on CA damage, 10s, 30s CD) on all 16 tooltips.

## Accessory equip-bonus sweep side-catches (2026-06-15)
- ~~**Elemental Alliance Ward Ring (id 2321) / Elemental Alliance Assault Ring (id 2324),
  IL554**: oversized stats (+1,994 / +2,992) with CR 222 — possible data error.~~
  **RESOLVED 2026-06-15 (FALSE ALARM):** verified against
  `docs/audit/_up/unbound-gear/Elemental Alliance {Ward,Assault} Ring_IL554.png` —
  data matches the in-game tooltip EXACTLY (Ward: Critical Severity 1994 + Critical
  Avoidance 2992; Assault: Combat Advantage 2992 + Critical Strike 1994; both CR 222,
  Temple of the Spider [Master]). The stats live in `ratingStats`, not `stats`; the
  original flag came from querying the wrong field name. These are real legacy values
  for these rings — do NOT "normalize" them. Now screenshot-confirmed correct.
- Pattern confirmed: the entire low-IL (<IL1500) accessory tail (necks/rings/amulets/
  cloaks) is stat-only by design — only 13 carry a per-item equip bonus (the
  Survivor's missing-health ring family + Daily-power rings + Challenger's Might).
  Logged in docs/audit/equip_bonus_blank_families.md so these stop reading as gaps.

## Armor equip-bonus sweep — reconstructed-from-truncated tooltips (2026-06-15)
Stat names + values were read clearly; only trailing sentence fragments were
clipped at the screenshot's right edge, so the verbatim DESCRIPTION wording was
reconstructed (standard NW dual-branch format). Re-capture for exact wording when
convenient — the scoring stats are solid and need no change:
- **Shieldlord's Raid/Ward** set (ids 7000-7007): Survivor's Savagery / Warden's
  Balance / Survivor's Finesse / Survivor's Strike — dual 50%-HP-threshold ratings.
- **Pioneer Ward** Leader's Dash pieces (ids 7088, 7095, 7093, 7094 etc.): the
  per-player value was clipped; filled from verified Pioneer Assault siblings
  (Leader's Dash 1% / Guard 200 / Might 200 / Vitality 1000 per team-member).
- **Leader's "per player in your team"** maxStacks stored as 4 (a full party is you
  + 4); in-game cap not shown on tooltip — verify if it counts self (would be 5).


## Missing companions/mounts found in _misc-archive cleanup (2026-06-15)
While clearing the local `_misc-archive` junk folder, 3 in-game tooltips turned up
for entities NOT in our databases. Tooltips preserved under
`docs/calibration/inbox/mounts/` and `.../companions/`. Add when convenient
(companions.json / companion_powers.json are being touched by a concurrent
session — coordinate before adding the two companions; the mount is clear to add).

- **Olive the Octopus** (MOUNT) — ADDED 2026-06-15 (mount id 282; combat power Tidal
  Wave id 92; equip power reuses Mystic Aura id 13). STILL NEEDS: insigniaSlots +
  lockbox bonus (currently placeholder 4-universal / bonusRef 0) — capture required.
  - Equip Power **Mystic Aura** (IL 3,000): "+2,250 Power and Accuracy to you and your
    party members within 80'. Multiple of the same Aura do not stack. +2,700 Combined Rating."
  - Combat Power **Tidal Wave** (60s recharge): summons "Ollie the Octie", three expanding
    tidal waves. Wave Magnitude 300; Knockback; enemies take +12.8% damage for 10s;
    you & nearby allies deal +12.8% damage for 10s.
- **Sir Waddlelot** (COMPANION) — not in companions.json.
  - Enhancement **Enduring Guard**: "While your companion is summoned and not downed,
    increases your Defense and your companion's Defense. Value scales with summoned
    companion's item level. Maximum 6%."
  - Power **Relentless Waddle** (IL 750, Offense/Defense): "Whenever you run, … increasing
    you and your summoned companions' Critical Severity by +7.5% for 7 seconds." +750 CR.
- **Wormungandr** (COMPANION) — not in companions.json.
  - Enhancement **Exploit Weakness**: "Chance on hit to increase your and your companion's
    critical strike and severity for 15 seconds. Value scales with summoned pet's item
    level. Maximum 4.5%."
  - Power **Continental Craving** (IL 750, Offense): +3.8% Critical Strike, +3.8% Power, +750 CR.

## Set-completion fixes (2026-06-16)
The Toon Forge builder counts set pieces by the equipBonus `setName` (or, for
fully-legacy items, the `set` field via the legacy registry). Two real break
classes were fixed in gear.json:
- **Name splits (105 refs renamed):** `Masterwork II Equipment` -> `Masterwork II
  Equipment Set`; `Sun Set`/`Set Sun` -> `Sun`; `Company PVE Armor` -> `Company PvE
  Armor` (case); `Black Ice set` -> `Black Ice`. These were two keys for one set.
- **Legacy pieces not counting (38 converted):** pieces with only a legacy
  `setBonus` (and a `set` != the family's structured `setName`) were converted to
  structured Set entries (parsedFrom:"legacy-merge") so they count toward
  completion (Astral Absorption/Dash, Twisted, Lostmauth's Hoard, The Dark Maiden,
  Lolthian Might, Dwarven Resilience, the Alacrity sets, etc.).
- Fully-legacy sets (Infused, Abyssal Fury, Prestige, Warborn, Frostborn, ...) were
  LEFT ALONE — they already complete via the legacy `set`-field path.

### Still need game knowledge (NOT auto-fixed)
- ~~**Reinforced Dragonflight:** setName split.~~ **RESOLVED 2026-06-16** — tooltip
  `docs/audit/_up/.../Reinforced Dragonflight Raid Mask_IL1400.png` reads "Set
  Dragonflight (0/4)": setName is `Dragonflight`, 4pc. Fixed the 1 outlier +
  converted 8 legacy pieces to structured `Dragonflight` 4pc. (setName `Dragonflight`
  is used only by reinforced pieces — base Dragonflight is blank — so no cross-merge.)
- ~~**Generic `Relic` setName.**~~ **RESOLVED 2026-06-16 (NOT a bug)** — tooltip
  `docs/audit/_up/paladin-gear/Vivified Oathkeeper's Ward Armet_IL645.png` reads
  "Set Relic (0/4)": `Relic` IS the real in-game set name, 4pc. Converted 15 legacy
  Oathkeeper relic pieces to structured `Relic` 4pc so the set completes.
- ~~**Barovian Lord's Armor (id 1241)** — ambiguous 2pc vs 4pc.~~ **RESOLVED
  2026-06-16** — screenshots were filed under the class-specific piece names
  (Banditlord's / Curselord's / Oathlord's / Shieldlord's = the Ravenloft "lord's"
  armor, source "Barovia – Seals Store"). Tooltips (`docs/audit/_up/...`) show only
  the per-piece dual-HP-threshold equip bonuses (all 32 already structured) — there
  is NO N-of-Set stat bonus. "Barovian Lord's Armor" is a COLLECTION; its only set
  reward is "+20 Power" on completion (id 1241). Normalized the 7 inconsistent Set
  entries to 4pc + folded in the legacy piece. Lesson: search by piece name, not
  just set name — the captures existed all along.
