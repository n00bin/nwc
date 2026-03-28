# Data Issues To Investigate

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
