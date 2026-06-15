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
| power 60 | War Boar's Instincts | companion_powers | FIXED (CR 230→75 — invalid rating value); verified as a PROC, not a stat buff | scaling math + screenshot 2026-06-15 125559 | 2026.03.17a | 2026-06-15 |
| power 261 | War Drummer's Discipline (Cyclops War Drummer) | companion_powers | NEW/FIXED — pet was showing Crimson Crystal Golem's power; now correct (+4.5% Incoming Healing, +18,000 Max HP, IL 900) | screenshot 2026-06-15 125618 | 2026.03.17a | 2026-06-15 |

### Pending — needs in-game screenshots before they can be fixed/trusted

From the 2026-06-15 companion sweep, these are wrong or unverifiable but have no usable screenshot in the archive:

- **4 companions still show the wrong power** (powers point to another pet's entry): Stalwart Golden Lion (250), Portobello DaVinci (251), Blue Fire Eye (252), Dread Warrior (254). Need a screenshot of each pet's power card. ✅ Cyclops War Drummer (253) FIXED 2026-06-15.
- **Linu La'neral** (power 226 Divine Answers) — values unconfirmed.
- **Baby Boar** (power 84) — two archive screenshots 21s apart genuinely disagree on the first stat: **c075 shows Deflect Chance**, **c081 shows Maximum Hit Points** (both +0.75% Critical Severity, IL 150, Offense). Our data has Max HP. Needs an in-game check — or confirm whether two "Baby Boar" variants exist.
- **Wolf** (power 83) and **Damaran Shepherd** (power 86) — power stats stored as 0 (placeholders, per their notes). Need power-card screenshots to fill in.
- _Done 2026-06-15 (no screenshot needed): fixed garbled em-dash ("â€"" → "—") in 4 companion notes (companions 83/86, powers 10/88)._
- **War Boar's Instincts** (power 60) — screenshot-verified 2026-06-15: it's a PROC, not a stat buff (15% on At-Will hit → 82.5-magnitude aggravated wound over 4s at IL 550, once/sec). Combined Rating fix confirmed. Still TODO: model the proc-damage scaling across rarities (82.5 @ Legendary sits below the standard magnitude curve, so it needs a 2nd rarity data point before it can feed the damage layer).
- **Cold Iron Warrior's Discipline** (power 119) — Combined Rating is 0 (only one like it). Verify whether that's intentional or a gap.

Note: the old March-2026 automated audit flagged 28 companion "mismatches"; re-reading at full resolution found most were misreads (a "3" read as "1"/"5") or already-correct schema. Always re-read the screenshot at zoom before trusting an automated flag.

### Companion integrity scan (2026-06-15) — structurally clean

Full scan of all companion `powerRef`/`enhancementRef` + shared-power + CR/IL:

- ✅ **No broken references** — every companion resolves to a real power and enhancement.
- **Shared-power suspects** (one power used by 2 companions — the Cyclops War Drummer bug class). The name-matching companion is the rightful owner; the other likely needs its own power (screenshot to confirm + fill):
  - power 250 Kingfisher's Wisdom → owner **Kingfisher Intern**; Stalwart Golden Lion likely wrong.
  - power 251 Elite Intern's Wisdom → owner **Elite Intern**; Portobello DaVinci likely wrong.
  - power 254 Proud Pink Yeti's Presence → owner **Proud Pink Yeti**; Dread Warrior likely wrong.
  - power 252 Fire Eye's Insight → Blue Fire Eye vs Archmage's Apprentice (which owns it?).
  - power 92 Vampire's Kiss → Vampire vs Vampire Bride (could be legit — both vampires; verify).
  - power 248 Highborn Status → Mercenary vs Demonic Servant (verify).
  - power 249 Divine Judgement → Soradiel (documented owner) vs Mini Apparatus of Gond (verify).
- **CR ≠ IL remaining**: power 119 Cold Iron Warrior (CR 0) and power 174 Spiteful Hex (CR 900 vs IL 750 — left by the proc-verification batch; n00b confirmed Lysaera is Mythic/750, so CR likely should be 750 — coordinate with that batch before changing).

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

_Ledger created 2026-06-15. Current data pack version: 2026.03.17a (Mod 32.5)._
