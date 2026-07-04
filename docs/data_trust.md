# Data Trust Ledger

This is the **Data Steward team's** record of what data has been *proven correct against an in-game screenshot.* It is maintained by the `/steward` command (see `~/.claude/commands/steward.md`).

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

### Integrity issues found (set-matching bugs — separate from the text backfill, not yet fixed)
- **Company "PvE" vs "PVE"** (ids 3127-3134) — capitalization split; the 4pc Company armor set never matches.
- **Pioneer Assault Sevars** (id 3543) — `set:"Pioneer Armor"` (set of one); should be "Pioneer Assault".
- **Vistani Pendant/Raiments** (ids 1250-1251) — `setSize:3` contradicts `pieces:2`; `item_level:0`.
- **Lionsmane Armor** (ids 5212-5219) — `set:"Lionsmane Armor"` but their equipBonus `setName:"Lionsmane"`; never matches.
- **Masterwork II Equipment** (25) vs **Masterwork II Equipment Set** (68) — parallel duplicate sets that can't combine.
- **"Sun Set"** set name has no in-game header (everything reads "Set Sun") — likely a spurious duplicate of "Sun".
- Minor: "Vistani Rapiera"/"Obsidian Omihuiclli" name typos; Titansteel Tabars slot (Main vs Off Hand); Manticore "Masterwork Armor II / Ranger Stronghold Set II" composite set string.

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

_Ledger created 2026-06-15. Current data pack version: 2026.03.17a (Mod 32.5)._
