# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

## Week of 2026-05-29

### Features
- **Companions — Summoned Buffs tab now shows all buff scopes.** Previously only party-wide buffs appeared; enemy debuffs (like Black Scorpion's Combat Advantage grant), self buffs, and mixed buffs were hidden. Each entry now carries a color-coded scope tag (Party / Self / Enemy Debuff / Mixed).
- **Toon Forge — Party Buffs section now models ally summoned companions of every scope.** Combat-Advantage-granting allies (Black Scorpion, Yeth Hound, Panther, etc.) raise your effective CA uptime in the damage sim; enemy "takes more damage" debuffs (Spined Devil, Succubus, Rattigan, Zariel) boost your simulated damage (Spined Devil and Succubus correctly don't stack). Self buffs and enemy stat debuffs are shown for reference. All 40 summoned-buff companions are now selectable.

### Bug Fixes
- Black Scorpion (and 17 other companions) were missing from the Summoned Buffs list and the Toon Forge Party Buffs picker.
- Enchantments: Celestial Jade's defense stat was wrong — it listed Deflect Severity but the enchant actually gives Critical Avoidance (2,700 at Celestial). Corrected, so Jade now shows Critical Strike / Critical Avoidance / Outgoing Healing. (Reports #71, #72)
- Gear: Bloodwoven Signs (Critical Empowerment), Shirt version, was showing Outgoing Healing where it should show Forte. Corrected to Forte 1,276 to match the in-game card. (Report #49)
- Gear: removed a duplicate, generically-named "Arcane Conduit Sigil" — it was the Explosive Defense variant all along, identical to the properly-named entry. Toon Forge now auto-updates any saved build that had the old one equipped, so nothing breaks. (Report #65)
- Gear: removed a second broken generic entry, "Arcane Conduit Insignia" — its stats and our in-game screenshot show it's the Challenger's Awareness variant (its old bonus text was wrong). Builder auto-updates affected saved builds. (found while verifying Report #41)
- Gear: Deep-Riven Stonevein Harness — corrected its stats (Deflect 2728, was wrongly Defense 2037), added its +1.5% Recharge Speed, fixed its set to Freezing Fortitude, and opened it to all classes. Verified from an in-game screenshot. (Report #60)
- Gear: Darklake Ward Ring — corrected its stats (Critical Avoidance 3825 / Deflection 1275 were reversed) and opened it to all classes (it was wrongly limited to four). Verified from an in-game screenshot. (Report #61) Also added its **+1** tier (IL 1800).
- Gear: Arcane Conduit Sigil (Explosive Defense) — moved from Pants to its correct Shirt slot. (Report #64)
- Gear: Scintillant & Shroomwood Sash and Amulet — corrected to be usable by all classes (they were wrongly limited to four).
- Gear: fixed class restrictions across the board — every Pants-slot item (26) and every Ring (24, the Frostsilver/Rimetouched/Snowbound/Demonweb lines) is now correctly usable by all classes. (Pants and rings are never class-locked in Neverwinter.)
- Gear: Frostsilver Hoop of Tenacity — corrected its second stat to Critical Avoidance 9900 (was Defense) and added its +5% Forte. Verified from an in-game screenshot. (Report #58)
- Gear: Arcane Conduit Insignia (Corrupt Power) — fixed its third stat from Power to Defense to match the in-game card; its Corrupt Power bonus (+5% Power, −7.5% Incoming Healing) was verified correct from an in-game screenshot. (Report #41)
- Gear: cleaned up the Bloodwoven set — removed four duplicate/broken entries (two exact-duplicate listings and two malformed copies of Bloodwoven Ink). Saved builds using the removed names auto-update in the builder. (found while checking Report #70)

### Features
- **Toon Forge — paragon powers now show up in the power picker.** A display bug was hiding every paragon-path-specific at-will, encounter, and daily for most classes (only Paladin was unaffected). Now the full power list is selectable — e.g. Devout Cleric jumps from 2/5/3 to 4/10/5 powers, and Barbarian, Bard, Fighter, Ranger, Warlock, Wizard, and Rogue all regained their hidden paragon powers too. (Report #79)

### Data Additions
- **Masterwork "+1" gear tiers added (IL 1800).** From in-game auction-house screenshots: Shroomwood Amulet +1, Shroomwood Sash +1, Scintillant Sash +1, and Scintillant Amulet +1 — the refined-rank versions of the existing IL 1700 pieces, completing the base/+1 set for all four. (Reports #66, #48)
- **Gear database — screenshot intake backlog fully cleared.** Worked through the remaining gear card screenshots and added every genuinely-new item. Final additions this session: the Wizard Reinforced Dragonflight Assault/Raid set, Duergar Wizard Orb & Talisman, Weathered Bracers of the Successor (Ranger), the Wintermarked & Frostbound "Chilling Flow" weapons, the Wintermarked Skirmisher armor set, the Stormforged Orb, Huntsman Assault Cap, and more.
