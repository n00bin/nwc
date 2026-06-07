# Data Issues To Investigate

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

- **Slaughterhouse Cindersilk gear** — likely a Mod 32+ clothing set
- **Ritualistic Necklace & Strap** — accessory pieces
- **Mod 33 gear** — new equipment from the latest module

Need to: source screenshots (in-game tooltips or NW Hub references),
extract stats, add to `gear.json` with proper slot/set/IL data.

## Missing Gear — Doomcleaver (Reports #36–#40, 2026-05-26)

Player tried to use the data-correction form on Elk Tribe Noble's Mace
to flag a missing weapon called **Doomcleaver** (didn't find it in our
database, so they used the closest weapon-shaped entry as a vehicle).

Suspected stats from the corrections submitted:
- Name: **Doomcleaver**
- Slot: Main Hand
- Item Level: 4450
- Set: **Impending Doom** (Mod 33)
- Combined Rating: 4005
- Accuracy: 0 (i.e. likely a Tank/Healer-stat distribution — Defense / Crit Avoidance / Awareness)

Set context: Impending Doom main-hand weapons we already have are
Oathbreaker's Malevolence, Grimfang, Omen of Doom, Scream Seeker,
Dirgeblade — Doomcleaver is the missing 6th, likely the Barbarian or
Fighter variant.

**Action:** Source an in-game screenshot of Doomcleaver tooltip
(stats + equip bonus) and add as a new gear.json entry. Don't apply
the submitted stat values directly — they came from a correction
form on the wrong item, so they should be treated as unverified hints.

## B2 — Mount Equip Power ID 56 "Seeing Red" Missing Stats (2026-05-22)

Mount 271 (Balgora) references equip power ID 56 ("Seeing Red") via `equipRef: 56`.
That equip power entry in `mount_equip_powers.json` is missing `item_level`,
`combinedRating`, and `stats` — the fields needed for it to display correctly in the
mount inspector and to be included in any future optimizer calculations.

**Blocked on:** in-game verification. Someone needs to open Balgora's tooltip in-game
and read the equip power values directly.

**Action:** Backfill `item_level`, `combinedRating`, and `stats` for equip power ID 56
in `G:/ai_projects/nwcb/data/mount_equip_powers.json`, then re-run `build-data.py`.

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

### Missing Companion Data
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
