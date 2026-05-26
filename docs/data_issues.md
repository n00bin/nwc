# Data Issues To Investigate

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
