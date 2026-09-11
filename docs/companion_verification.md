# Companion verification pass (started 2026-09-11)
n00b and Claude walk every companion in alphabetical order. For each one we confirm FOUR things against an in-game screenshot:
1. **Starting rarity** (the rarity it drops at = the rung its power is stored on)
2. **Slotted bonuses** (the stats the power gives while slotted)
3. **Summoned bonuses** (anything it gives while summoned - drives the Summoned Buffs tab)
4. **Slot** (Offense / Defense / Utility, and combinations)

Status values: `unchecked` | `verified` | `fixed` | `needs screenshot`

**Card map:** `docs/audit/companion_card_map.json` maps 157 companions to their archived Inspect card under `docs/audit/companions/_up/`. 117 companions have no card. Cards show slot, slotted bonuses, the summoned Powers list and the enhancement, but they are the owner's UPGRADED copy - they never prove starting rarity.

**Bolster is rarity-driven, NOT a companion property (n00b 2026-09-11).** The Inspect panel's "Companions Bolster Contribution" just reports the rarity the companion is currently at:

| Rarity | Bolster |
|---|---|
| Common | 0.5% |
| Uncommon | 1% |
| Rare | 2% |
| Epic | 3% |
| Legendary | 5% |
| Mythic | 10% |
| Celestial | 12% |

Best 10 companions count, so the ceiling is 120% (ten Celestials). The old "Bolster 10%" in 130 companion notes was never stale data - those were captures of Mythic copies. Do NOT store a bolster figure per companion; strip it as we pass through. Published as the "Companion Bolster" tab on companions.html.

**CONFLICT TO RESOLVE:** Toon Forge's own per-tier table (toon-forge.html, the comp-bolster hint text and `compBolsterFromCollection`) reads Common 1 / Uncommon 2 / Rare 3.5 / Epic 5 / Legendary 7.5 / Mythic 10 / Celestial 12. Mythic and Celestial agree with n00b; the five lower tiers do not. Those five were flagged "unverified (estimated)" in project memory. Engine NOT changed yet - needs n00b's go, because it moves TIL math.

| # | Companion | Status | Base rarity (stored) | Slot (stored) | Slotted bonuses (stored) | Summoned (stored) |
|---|---|---|---|---|---|---|
| 1 | Abyssal Chicken | 3/4 verified - rarity open | Epic | Offense | PROC | - |
| 2 | Acolyte of Kelemvor | unchecked | Uncommon | Utility | Deflect 0.75%, Incoming Healing 0.75% | - |
| 3 | Air Archon | unchecked | Common | Offense/Utility | Power 0.75% | - |
| 4 | Alchemist Experimenter | unchecked | Epic | Offense/Utility | Critical Strike 1.88%, Combat Advantage 1.88% | - |
| 5 | Allosaurus | unchecked | Epic | Defense/Utility | Maximum Hit Points 7500, Critical Strike 1.9% | - |
| 6 | Alpha Compy | unchecked | Mythic | Utility | Power 7.5% | party: Damage Bonus 1.0% |
| 7 | Ambush Drake | unchecked | Epic | Offense/Utility | Critical Severity 1.88%, Awareness 1.88% | - |
| 8 | Angel of Protection | unchecked | Epic | Defense | PROC | party: Defense 3.0% |
| 9 | Aoth Fezim & Brightwing | unchecked | Mythic | Offense/Utility | Accuracy 3.75%, Combat Advantage 3.75% | - |
| 10 | Apprentice Healer | unchecked | Common | Utility | Incoming Healing 0.37% | - |
| 11 | Aranea | unchecked | Uncommon | Offense | PROC | - |
| 12 | Armored Orc Wolf | unchecked | Common | Offense | Accuracy 0.38%, Critical Strike 0.38% | - |
| 13 | Assassin Drake | unchecked | Epic | Offense | Accuracy 1.88%, Critical Severity 1.88% | - |
| 14 | Astral Deva | unchecked | Rare | Defense | Heal Percent 2.5% | - |
| 15 | Baby Bear (augment) | unchecked | Uncommon | Defense | PROC | - |
| 16 | Baby Boar (augment) | unchecked | Uncommon | Offense | Deflect 0.75%, Critical Severity 0.75% | - |
| 17 | Baby Bulette (augment) | unchecked | Epic | Defense | PROC | - |
| 18 | Baby Deep Crow (augment) | unchecked | Mythic | Offense | Power 7.5% | - |
| 19 | Baby Displacer Beast (augment) | unchecked | Uncommon | Defense/Offense | PROC | - |
| 20 | Baby Gorilla (augment) | unchecked | Epic | Offense/Utility | Deflect 1.88%, Critical Severity 1.88% | - |
| 21 | Baby Owlbear (augment) | unchecked | Mythic | Utility | PROC | - |
| 22 | Barbarian Shaman | unchecked | Rare | Offense/Utility | Combat Advantage 1.25%, Power 1.25% | - |
| 23 | Basic Bok | unchecked | Epic | Utility | PROC | - |
| 24 | Batiri Runt | unchecked | Legendary | Offense | Damage Vs Bosses 8.25% | - |
| 25 | Battlefield Medic | unchecked | Epic | Utility | Combat Advantage 1.88%, Incoming Healing 1.88% | - |
| 26 | Black Dragon Ioun Stone (augment) | unchecked | Mythic | Offense | Critical Strike 7.5% | - |
| 27 | Black Ice Prospector | unchecked | Epic | Defense | Deflect 1.88%, Critical Avoidance 1.88% | - |
| 28 | Black Ice Stone (augment) | unchecked | Uncommon | Utility | PROC | - |
| 29 | Black Scorpion | unchecked | Celestial | Offense | PROC | enemy |
| 30 | Blacksmith | unchecked | Rare | Utility | PROC | - |
| 31 | Blaspheme Assassin | unchecked | Mythic | Offense | PROC | enemy |
| 32 | Blink Dog | unchecked | Uncommon | Offense | Deflect 0.75%, Critical Avoidance 0.75% | enemy |
| 33 | Blue Fire Eye | unchecked | Common | Offense | PROC | party: Critical Strike 3.0% |
| 34 | Bobby | unchecked | Mythic | Defense/Utility | Maximum Hit Points 12000, Defense 4.5% | - |
| 35 | Book Imp | unchecked | Epic | Offense/Utility | Accuracy 1.88%, Combat Advantage 1.88% | - |
| 36 | Bruenor Battlehammer | unchecked | Mythic | Defense | Awareness 3.75%, Defense 3.75% | party: Incoming Damage -3.0% |
| 37 | Butterfly (augment) | unchecked | Mythic | Defense | PROC | - |
| 38 | Cambion Magus | unchecked | Common | Offense | Accuracy 0.38%, Critical Severity 0.38% | - |
| 39 | Cantankerous Mage | unchecked | Uncommon | Defense | Accuracy 0.75%, Defense 0.75% | enemy |
| 40 | Captain Elaina Sartell | unchecked | Epic | Offense/Defense | Heal And Damage 3.75% | party: Action Point Gain 5.0%, Critical Severity 5.0% |
| 41 | Cat (augment) | unchecked | Rare | Defense/Utility | Deflect 1.25%, Defense 1.25% | - |
| 42 | Catti-brie | unchecked | Epic | Utility | Movement Speed 1.88%, Control Resist 1.88% | party: Movement Speed 5.0% |
| 43 | Cave Bear | unchecked | Legendary | Offense/Utility | Maximum Hit Points 11000, Accuracy 2.8% | - |
| 44 | Celeste | unchecked | Epic | Utility | PROC | - |
| 45 | Celestial Lion | unchecked | Epic | Utility | PROC | - |
| 46 | Chicken (augment) | unchecked | Epic | Defense | PROC | - |
| 47 | Chultan Hunter | unchecked | Epic | Utility | PROC | - |
| 48 | Cleric Disciple | unchecked | Uncommon | Utility | Incoming Healing 0.75%, Power 0.75% | - |
| 49 | Cockatrice | unchecked | Epic | Utility | PROC | - |
| 50 | Cold Iron Warrior | unchecked | Common | Offense | Damage Vs Fey 1.13% | - |
| 51 | Coldlight Walker | unchecked | Mythic | Utility | Critical Strike 3.75%, Critical Severity 3.75% | - |
| 52 | Con Artist | unchecked | Common | Offense | PROC | - |
| 53 | Crab | unchecked | Epic | Utility | PROC | - |
| 54 | Crimson Crystal Golem | unchecked | Common | Utility/Defense | Accuracy 0.38%, Combat Advantage 0.38% | - |
| 55 | Crystalline Golem | unchecked | Epic | Offense/Utility | Power 1.9% | - |
| 56 | Cunning Mimic | unchecked | Mythic | Offense | Forte 3.8% | - |
| 57 | Cyclops War Drummer | unchecked | Epic | Utility | Incoming Healing 1.88% | party: Incoming Damage -3.0% |
| 58 | Damaran Shepherd | unchecked | Common | Offense | Critical Strike 0.38%, Critical Avoidance 0.38% | - |
| 59 | Dancing Blade | unchecked | Common | Offense | Critical Severity 0.38%, Combat Advantage 0.38% | enemy |
| 60 | Dancing Shield | unchecked | Uncommon | Defense | Deflect 0.75%, Critical Strike 0.75% | - |
| 61 | Dark Dealer | unchecked | Epic | Utility | Combat Advantage 1.88%, Accuracy 1.88% | - |
| 62 | Death Slaad | unchecked | Uncommon | Offense | PROC | - |
| 63 | Dedicated Squire | unchecked | Legendary | Utility | Accuracy 2.75%, Incoming Healing 2.75% | - |
| 64 | Demonic Servant | unchecked | Epic | Utility | Forte 1.88%, Accuracy 1.88% | - |
| 65 | Deva Champion | unchecked | Rare | Utility | Critical Avoidance 1.25%, Incoming Healing 1.25% | self |
| 66 | Diana | unchecked | Mythic | Utility | Movement Speed 3.75%, Stamina Regeneration 3.75% | party: Movement Speed 10.0% |
| 67 | Displacer Beast | unchecked | Epic | Offense | PROC | - |
| 68 | Dog | unchecked | Mythic | Offense | Critical Severity 3.75%, Power 3.75% | - |
| 69 | Dragon Hunter | unchecked | Epic | Offense | Damage Vs Dragons 5.63% | - |
| 70 | Dragonborn Brawler | unchecked | Rare | Defense | Deflect 1.25%, Awareness 1.25% | - |
| 71 | Dragonborn Raider | unchecked | Uncommon | Defense/Offense | Awareness 0.75%, Combat Advantage 0.75% | - |
| 72 | Dread Warrior | unchecked | Mythic | Utility | PROC | party: Power 5000%, Critical Severity 5.0% |
| 73 | Drizzt Do'Urden | unchecked | Celestial | Offense | Critical Strike 4.5%, Critical Severity 4.5% | party: Damage Bonus 3.0% |
| 74 | Duergar Guard | unchecked | Celestial | Defense | Critical Avoidance 9% | - |
| 75 | Duergar Theurge | unchecked | Epic | Defense | Critical Severity 1.88%, Incoming Healing 1.88% | - |
| 76 | Dwarven Battlerager | unchecked | Uncommon | Defense | Critical Severity 0.75%, Critical Avoidance 0.75% | - |
| 77 | Earl the Chickenmancer | unchecked | Rare | Offense/Utility | PROC | - |
| 78 | Earth Archon | unchecked | Uncommon | Defense/Offense | PROC | - |
| 79 | Eladrin | unchecked | Epic | Utility | PROC | - |
| 80 | Elemental Air Cultist | unchecked | Uncommon | Defense | Accuracy Reduction 0.75% | - |
| 81 | Elite Intern | unchecked | Common | Offense | Critical Severity 0.38%, Awareness 0.38% | - |
| 82 | Elminster Aumar | unchecked | Mythic | Defense | PROC | - |
| 83 | Elminster Simulacrum | unchecked | Legendary | Offense | PROC | - |
| 84 | Encore the Virtuoso | unchecked | Mythic | Defense/Utility | Critical Severity 2.5%, Outgoing Healing 2.5%, Power 2.5% | mixed: Outgoing Healing 1.5%, Power 1.5%, Critical Severity 1.5% |
| 85 | Energon | unchecked | Mythic | Utility | PROC | - |
| 86 | Eric the Cavalier | unchecked | Epic | Utility/Defense | PROC | - |
| 87 | Erinyes of Belial | unchecked | Rare | Offense | Critical Severity 1.25%, Defense 1.25% | - |
| 88 | Etrien | unchecked | Epic | Utility | Movement Speed 1.3%, Action Point Gain 1.3%, Recharge Speed 1.3% | party: Power 2.0%, Critical Strike 2.0% |
| 89 | Faithful Initiate | unchecked | Epic | Offense | Combat Advantage 1.88%, Outgoing Healing 1.88% | - |
| 90 | Fawn | unchecked | Mythic | Offense/Utility | Critical Strike 3.75%, Power 3.75% | - |
| 91 | Feral Velociraptor | unchecked | Epic | Offense | Awareness 1.88% | - |
| 92 | Festive Tiger (augment) | unchecked | Uncommon | Offense | Movement Speed 0.75%, Critical Strike 0.75% | - |
| 93 | Feywild Sylph | unchecked | Common | Defense | Critical Strike 0.38%, Critical Avoidance 0.38% | - |
| 94 | Fire Archon | unchecked | Epic | Defense/Offense | PROC | - |
| 95 | Fireblossom Zealot | unchecked | Epic | Defense | PROC | party |
| 96 | Flame Sprite | unchecked | Uncommon | Offense | Accuracy 0.75%, Critical Strike 0.75% | - |
| 97 | Flaming Skull | unchecked | Common | Defense/Offense | Combat Advantage 0.38%, Defense 0.38% | - |
| 98 | Flapjack | unchecked | Celestial | Defense/Utility | Stamina Regeneration 9% | party: Combat Advantage 5.0% |
| 99 | Flumph | unchecked | Mythic | Defense | PROC | - |
| 100 | Frost Mimic | unchecked | Mythic | Defense | Defense 3.75%, Awareness 3.75% | - |
| 101 | Galeb Duhr | unchecked | Rare | Offense | Stamina Restore 2.5% | - |
| 102 | Ghost | unchecked | Epic | Offense/Utility | Power 1.88%, Critical Strike 1.88% | - |
| 103 | Githyanki | unchecked | Epic | Utility | Stamina Regeneration 1.88%, Power 1.88% | - |
| 104 | Goat (augment) | unchecked | Uncommon | Defense/Utility | Maximum Hit Points 3000, Deflect 0.75% | - |
| 105 | Golden Bulette Pup (augment) | unchecked | Mythic | Offense/Defense/Utility | Outgoing Healing 7.5% | - |
| 106 | Golden Cat (augment) | unchecked | Celestial | Defense/Utility/Offense | Combat Advantage 9% | - |
| 107 | Golden Deep Crow Egg (augment) | unchecked | Mythic | Defense/Offense/Utility | Awareness 7.5% | - |
| 108 | Golden Goat (augment) | unchecked | Epic | Defense/Utility/Offense | Forte 3.75% | - |
| 109 | Goldfish (augment) | unchecked | Uncommon | Offense/Utility | Critical Avoidance 0.75%, Incoming Healing 0.75% | - |
| 110 | Grace Revoir | unchecked | Mythic | Offense | At Will Dmg Bonus 5.0% | - |
| 111 | Grazilaxx | unchecked | Rare | Defense/Offense | Deflect 1.25%, Critical Strike 1.25% | - |
| 112 | Green Slime | unchecked | Uncommon | Defense | Defense 1.5% | - |
| 113 | Greenscale Hunter | unchecked | Legendary | Utility | PROC | - |
| 114 | Grillmaster | unchecked | Epic | Offense/Defense | Power 1.88%, Movement Speed 1.88% | - |
| 115 | Gromph Baenre | unchecked | Epic | Offense | Critical Strike 3.75% | - |
| 116 | Grung | unchecked | Epic | Offense | PROC | - |
| 117 | Halfling Wayward Wizard | unchecked | Uncommon | Utility | PROC | - |
| 118 | Hank the Ranger | unchecked | Mythic | Offense | PROC | - |
| 119 | Harper Bard | unchecked | Common | Defense/Utility | Maximum Hit Points 1500, Awareness 0.38% | party: Power 2.0%, Critical Strike 2.0% |
| 120 | Hawk | unchecked | Rare | Offense | Critical Severity 1.25%, Critical Strike 1.25% | - |
| 121 | Hell Hound | unchecked | Epic | Utility | PROC | - |
| 122 | Helmite Paladin Ghost | unchecked | Uncommon | Offense/Utility | Critical Strike 0.75% | - |
| 123 | Honey Badger | unchecked | Epic | Defense/Utility | Damage Taken Reduction 3.75% | - |
| 124 | Hunting Drake | unchecked | Epic | Defense | Maximum Hit Points 7500, Accuracy 1.9% | - |
| 125 | Hunting Hawk | unchecked | Common | Offense/Utility | At Will Damage Range 0.75% | - |
| 126 | Ice Galeb Duhr | unchecked | Epic | Defense | Damage Resistance 3.75% | - |
| 127 | Ice Sprite | unchecked | Uncommon | Defense | Accuracy 0.75%, Critical Avoidance 0.75% | - |
| 128 | Icosahedron Ioun Stone (augment) | unchecked | Mythic | Utility | Movement Speed 7.5% | - |
| 129 | Incubus | unchecked | Epic | Offense | PROC | - |
| 130 | Intellect Devourer | unchecked | Mythic | Offense | Awareness 3.75%, Combat Advantage 3.75% | - |
| 131 | Ioun Stone of Allure (augment) | unchecked | Mythic | Defense/Utility | Incoming Healing 3.75%, Forte 3.75% | - |
| 132 | Ioun Stone of Might (augment) | unchecked | Epic | Defense/Utility | Deflect 1.88%, Power 1.88% | - |
| 133 | Ioun Stone of Radiance (augment) | unchecked | Epic | Defense/Utility | Deflect 1.88%, Outgoing Healing 1.88% | - |
| 134 | Iron Golem | unchecked | Epic | Defense/Utility | Maximum Hit Points 7500, Defense 1.9% | - |
| 135 | Jagged Dancing Blade | unchecked | Uncommon | Offense | Defense Reduction 1.5% | - |
| 136 | Jarlaxle Baenre | unchecked | Common | Offense | Accuracy 0.75% | - |
| 137 | Kavatos Stormeye | unchecked | Mythic | Defense | Critical Strike 3.75%, Forte 3.75% | - |
| 138 | Kenku Archer | unchecked | Mythic | Offense/Utility | Power 3.75%, Critical Severity 3.75% | - |
| 139 | Kingfisher Intern | unchecked | Common | Offense/Utility | Maximum Hit Points 1500%, Combat Advantage 0.38% | - |
| 140 | Kuo-toa | unchecked | Uncommon | Defense/Offense | PROC | - |
| 141 | Laughing Skull | unchecked | Epic | Defense/Offense | Combat Advantage 1.88%, Defense 1.88% | - |
| 142 | Lava Galeb Duhr | unchecked | Epic | Offense | Daily Damage 3.75% | - |
| 143 | Leprechaun | unchecked | Rare | Defense | Critical Avoidance 1.25%, Combat Advantage 1.25% | - |
| 144 | Lich | unchecked | Celestial | Defense | Incoming Damage -9.0% | - |
| 145 | Lich Makos | unchecked | Mythic | Offense | PROC | - |
| 146 | Lightfoot Thief | unchecked | Rare | Offense | Critical Strike 1.25%, Critical Severity 1.25% | - |
| 147 | Lillend | unchecked | Epic | Utility | PROC | - |
| 148 | Linu La'neral | unchecked | Mythic | Utility | Forte 3.75%, Outgoing Healing 3.75% | - |
| 149 | Little White (augment) | unchecked | Epic | Utility | Incoming Healing 1.25%, Critical Avoidance 1.25%, Movement Speed 1.25% | - |
| 150 | Lizardfolk Shaman | unchecked | Uncommon | Utility | Awareness 0.75%, Incoming Healing 0.75% | - |
| 151 | Lulu the Hollyphant | unchecked | Epic | Defense | Damage Resistance 1.88%, Heal Percent 3.75% | - |
| 152 | Lysaera | unchecked | Mythic | Utility/Defense | PROC | enemy |
| 153 | Mage Slayer | unchecked | Epic | Utility | PROC | - |
| 154 | Makos | unchecked | Epic | Defense | Defense 1.88%, Deflect 1.88% | - |
| 155 | Man at Arms | unchecked | Uncommon | Defense | Defense 0.75%, Combat Advantage 0.75% | - |
| 156 | Manticore | unchecked | Epic | Utility | PROC | - |
| 157 | Mercenary | unchecked | Celestial | Offense/Utility | Power 4.5%, Combat Advantage 4.5% | - |
| 158 | Mini Apparatus of Gond (augment) | unchecked | Common | Defense | Critical Strike 0.38%, Critical Severity 0.38% | - |
| 159 | Minotaur | unchecked | Mythic | Defense | PROC | - |
| 160 | Minsc | unchecked | Celestial | Defense | Damage Vs Strong 9.8% | party: Combat Advantage 2.0%, Incoming Healing 2.0% |
| 161 | Minstrel | unchecked | Uncommon | Defense/Utility | Power 0.75%, Awareness 0.75% | - |
| 162 | Moonshae Druid | unchecked | Uncommon | Defense/Utility | Critical Avoidance 0.75% | - |
| 163 | Mornhelm the Severed | unchecked | Epic | Offense | Forte 1.88%, Combat Advantage 1.88% | - |
| 164 | Myconid | unchecked | Epic | Defense | Critical Avoidance 1.88%, Awareness 1.88% | - |
| 165 | Mystagogue | unchecked | Legendary | Offense | Critical Severity 2.75%, Combat Advantage 2.75% | - |
| 166 | Mystic Phoera | unchecked | Epic | Defense/Utility | PROC | - |
| 167 | Netherese Arcanist | unchecked | Uncommon | Offense | Damage Vs Not Facing 0.75% | - |
| 168 | Neverember Guard | unchecked | Rare | Offense | Awareness 1.25%, Outgoing Healing 1.25% | - |
| 169 | Neverember Guard Archer | unchecked | Uncommon | Utility | Power 0.75%, Defense 0.75% | - |
| 170 | Neverwinter Knight | unchecked | Epic | Offense | Outgoing Damage 3.75% | party: Defense 2.0% |
| 171 | Orc Wolf | unchecked | Uncommon | Offense | Accuracy 0.75%, Critical Strike 0.75% | - |
| 172 | Owl | unchecked | Mythic | Defense/Utility | Maximum Hit Points 15000, Awareness 3.8% | - |
| 173 | Ox Stot (augment) | unchecked | Uncommon | Offense | PROC | - |
| 174 | Panther | unchecked | Uncommon | Offense | At Will Damage Vs Rooted 1.13% | enemy |
| 175 | Paranoid Delusion | unchecked | Epic | Offense | At Will Damage Vs Disabled 5.63% | - |
| 176 | Pewter Golem | unchecked | Rare | Defense/Utility | Defense 1.25%, Critical Strike 1.25% | - |
| 177 | Phasespider | unchecked | Common | Defense | Critical Strike 0.38%, Combat Advantage 0.38% | - |
| 178 | Phoera | unchecked | Uncommon | Utility | PROC | - |
| 179 | Pig | unchecked | Uncommon | Utility | PROC | - |
| 180 | Polar Bear Cub (augment) | unchecked | Epic | Defense/Utility | Outgoing Healing 1.88%, Defense 1.88% | - |
| 181 | Portal Hound | unchecked | Uncommon | Defense | Damage Vs Kabal 1.5% | - |
| 182 | Portobello DaVinci | unchecked | Celestial | Utility | PROC | party: Power 3.5%, Combat Advantage 3.5% |
| 183 | Presto the Magician | unchecked | Mythic | Utility/Defense | Outgoing Healing 3.75%, Defense 3.75% | - |
| 184 | Priestess of Sehanine Moonbow | unchecked | Mythic | Defense | Deflect 3.75%, Awareness 3.75% | mixed |
| 185 | Priestess of Sune | unchecked | Rare | Defense | Deflect 1.25%, Accuracy 1.25% | - |
| 186 | Proud Pink Yeti | unchecked | Common | Defense/Offense/Utility | Outgoing Healing 0.75% | - |
| 187 | Pseudodragon | unchecked | Epic | Utility | PROC | - |
| 188 | Quasit (augment) | unchecked | Legendary | Defense/Utility | Deflect 2.75%, Critical Severity 2.75% | - |
| 189 | Quickling | unchecked | Mythic | Offense/Utility | Critical Strike 3.75%, Outgoing Healing 3.75% | - |
| 190 | Rabbit (augment) | unchecked | Uncommon | Utility | Movement Speed 0.75%, Critical Avoidance 0.75% | - |
| 191 | Rat Pup (augment) | unchecked | Uncommon | Offense | PROC | - |
| 192 | Rath Modar | unchecked | Mythic | Utility/Defense | PROC | - |
| 193 | Rattigan the Wise | unchecked | Mythic | Utility | PROC | enemy |
| 194 | Razorwood | unchecked | Epic | Offense | Accuracy 1.88%, Critical Severity 1.88% | - |
| 195 | Red Dragon Ioun Stone (augment) | unchecked | Rare | Defense/Utility | Incoming Healing 1.3% | - |
| 196 | Red Slaad | unchecked | Rare | Defense | Accuracy 1.25%, Critical Severity 1.25% | - |
| 197 | Redcap Powrie | unchecked | Epic | Defense/Offense | Critical Severity 1.88%, Critical Avoidance 1.88% | - |
| 198 | Redeemed Fallen | unchecked | Epic | Defense | Accuracy 1.88%, Combat Advantage 1.88% | - |
| 199 | Regis | unchecked | Celestial | Defense | Deflect 4.5%, Deflect Severity 4.5% | party: Recharge Speed 3.0% |
| 200 | Remorhaz | unchecked | Epic | Offense | PROC | - |
| 201 | Renegade Evoker | unchecked | Uncommon | Offense | PROC | - |
| 202 | Renegade Illusionist | unchecked | Uncommon | Defense | Accuracy 0.75%, Critical Avoidance 0.75% | - |
| 203 | Repentant Dragon Cultist | unchecked | Epic | Offense | PROC | - |
| 204 | Rimefire Golem | unchecked | Epic | Offense/Utility | Maximum Hit Points 7500, Critical Severity 1.9% | - |
| 205 | Riotous Rothe | unchecked | Common | Defense/Utility | Incoming Healing 0.75% | enemy |
| 206 | Rothé | unchecked | Uncommon | Defense/Utility | Incoming Healing 1.5% | - |
| 207 | Rumpadump | unchecked | Mythic | Offense | PROC | - |
| 208 | Rust Monster | unchecked | Epic | Defense | Critical Severity Reduction 3.75% | - |
| 209 | Sardina the Tressym | unchecked | Mythic | Offense/Utility | Power 3.75%, Movement Speed 4% | - |
| 210 | Scarecrow | unchecked | Rare | Offense/Utility | Critical Severity 1.25%, Defense 1.25% | - |
| 211 | Sellsword | unchecked | Uncommon | Offense/Utility | Accuracy 0.75%, Awareness 0.75% | - |
| 212 | Sergeant Knox | unchecked | Epic | Defense | Defense 1.88%, Accuracy 1.88% | - |
| 213 | Shadar-kai Witch | unchecked | Epic | Utility | Power 1.88%, Critical Strike 1.88% | - |
| 214 | Shadow Demon | unchecked | Epic | Utility | PROC | - |
| 215 | Shadow Elemental | unchecked | Epic | Offense | PROC | party: Critical Avoidance 1.5%, Movement Speed 2.5% |
| 216 | Shieldmaiden | unchecked | Common | Defense | Deflect 0.38%, Combat Advantage 0.38% | - |
| 217 | Siege Master | unchecked | Rare | Offense | At Will Power 3.75% | party: Defense 3.0% |
| 218 | Sir Waddlelot | unchecked | Mythic | Defense/Offense | PROC | party: Defense 3.5%, Power 3.5% |
| 219 | Skeletal Dog | unchecked | Epic | Defense | Critical Avoidance 1.88% | - |
| 220 | Skeleton | unchecked | Uncommon | Defense | Critical Avoidance 0.75%, Defense 0.75% | - |
| 221 | Skyblazer | unchecked | Epic | Utility | PROC | - |
| 222 | Slyblade Kobold | unchecked | Uncommon | Offense | Encounter Damage Vs Disabled 2.25% | - |
| 223 | Snow Fawn | unchecked | Uncommon | Utility | Critical Severity 0.75%, Defense 0.75% | - |
| 224 | Snow Leopard | unchecked | Epic | Offense | PROC | - |
| 225 | Songstress | unchecked | Rare | Defense/Utility | Control Resist 1.25%, Incoming Healing 1.25% | - |
| 226 | Soradiel | unchecked | Common | Defense | Critical Strike 0.38%, Critical Severity 0.38% | - |
| 227 | Spined Devil | unchecked | Celestial | Offense | PROC | enemy |
| 228 | Splinters | unchecked | Uncommon | Defense | Critical Severity 0.75%, Critical Avoidance 0.75% | - |
| 229 | Sprite | unchecked | Epic | Defense/Offense | Accuracy 1.88%, Critical Avoidance 1.88% | - |
| 230 | Staldorf | unchecked | Epic | Offense | Combat Advantage 3.75% | - |
| 231 | Stalwart Golden Lion | unchecked | Celestial | Utility | PROC | self |
| 232 | Star of Simril (augment) | unchecked | Uncommon | Offense/Utility | Maximum Hit Points 2000, Critical Strike 0.5%, Gold Bonus 1% | - |
| 233 | Storm Rider | unchecked | Uncommon | Utility | Power 0.75% | - |
| 234 | Stronghold's Cleric | unchecked | Epic | Utility | PROC | - |
| 235 | Succubus | unchecked | Epic | Offense | PROC | enemy |
| 236 | Swashbuckler | unchecked | Uncommon | Offense | PROC | enemy |
| 237 | Sylph | unchecked | Epic | Defense | Critical Strike 1.88%, Awareness 1.88% | - |
| 238 | Tamed Velociraptor | unchecked | Celestial | Offense | Power 4.5% | - |
| 239 | Tiger | unchecked | Epic | Offense | PROC | - |
| 240 | Tomb Spider | unchecked | Rare | Offense | PROC | - |
| 241 | Traveling Entertainer | unchecked | Uncommon | Offense | Critical Strike 0.75%, Defense 0.75% | - |
| 242 | Trobriand's Construct | unchecked | Epic | Defense | PROC | - |
| 243 | Tutor | unchecked | Celestial | Offense | PROC | party: Combat Advantage 5.0% |
| 244 | Twitchspine the Clinging | unchecked | Mythic | Defense | PROC | - |
| 245 | Vallenhas Elite Soldier | unchecked | Epic | Offense/Utility | Outgoing Healing 1.3%, Awareness 1.3% | - |
| 246 | Vampire | unchecked | Epic | Offense | PROC | - |
| 247 | Vampire Bride | unchecked | Epic | Offense | PROC | - |
| 248 | Vanguard of the Citadel | unchecked | Rare | Defense | Critical Avoidance 1.25% | - |
| 249 | Verdant Elder | unchecked | Epic | Offense/Utility | Power 1.9% | - |
| 250 | Vicious Dire Wolf | unchecked | Epic | Utility | PROC | - |
| 251 | Vistani Wanderer | unchecked | Epic | Utility | PROC | party: Movement Speed 5.0% |
| 252 | Volcanic Galeb Duhr | unchecked | Epic | Offense | Encounter Damage 3.75% | - |
| 253 | War Boar | unchecked | Common | Offense | PROC | - |
| 254 | War Dog | unchecked | Common | Defense | Awareness 0.38%, Defense 0.38% | - |
| 255 | Water Archon | unchecked | Rare | Offense/Utility | PROC | - |
| 256 | Watler (augment) | unchecked | Rare | Utility | Deflect 2.5% | - |
| 257 | Wayward Wizard | unchecked | Uncommon | Utility | PROC | - |
| 258 | Wererat Thief | unchecked | Rare | Offense | PROC | - |
| 259 | Werewolf | unchecked | Rare | Offense | Incoming Healing 1.25%, Defense 1.25% | - |
| 260 | Wiggins the Undead Intern | unchecked | Epic | Utility | PROC | - |
| 261 | Wild Hunt Rider | unchecked | Uncommon | Offense | PROC | - |
| 262 | Will-O'-Wisp | unchecked | Epic | Defense/Offense | Critical Severity 1.88%, Awareness 1.88% | - |
| 263 | Windsoul Genasi | unchecked | Epic | Offense | Deflect 1.88%, Combat Advantage 1.88% | - |
| 264 | Wolf | unchecked | Common | Offense/Utility | Critical Severity 0.75% | - |
| 265 | Wormungandr | unchecked | Mythic | Offense | Critical Strike 3.75%, Power 3.75% | mixed: Power 2.5% |
| 266 | Wulfgar | unchecked | Epic | Offense | Accuracy 1.88%, Combat Advantage 1.88% | party: Action Point Gain 3.0% |
| 267 | Xaryxian | unchecked | Mythic | Offense | Critical Strike 4.5%, Critical Severity 3% | - |
| 268 | Xuna | unchecked | Epic | Offense | PROC | - |
| 269 | Yeth Hound | unchecked | Uncommon | Offense | Damage Vs Gyrion 2.25% | enemy |
| 270 | Yeti | unchecked | Uncommon | Offense | PROC | - |
| 271 | Yojimbo | unchecked | Mythic | Defense | Deflect 7.5% | - |
| 272 | Zariel | unchecked | Epic | Defense | Critical Strike 1.88%, Critical Severity 1.88% | enemy |
| 273 | Zariel the Redeemed | unchecked | Epic | Defense | Critical Strike 1.88%, Critical Severity 1.88% | - |
| 274 | Zhentarim Warlock | unchecked | Legendary | Offense/Utility | Combat Advantage 2.8% | - |
