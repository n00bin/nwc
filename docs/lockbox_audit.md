# Lockbox audit — icons + coverage (2026-09-28)

**Shipped:** icons are wired into `data/lockboxes.json` (`icon.direct_image_url` → `images/lockboxes/<catalog id>.webp`) and render on the Consumables → Lockboxes tab. 80 of 85 catalog entries have an icon. Still without one: Wild Adventures, Astral Casket, Tarmalune Mystery Box, Magnificent Resurgence Lockbox. (Buried Treasure added 2026-09-28 from wiki File:Icon_M33_Lockbox_B.png.)

Sources: Official Neverwinter Wiki `Lockbox` table (stops at Dragon Cult, June 2022), NW Hub "Packs & Lockboxes" catalogue (72 boxes, 2013–2026), and the official Arc Games news feed (every "Lockbox" article, 103 hits, used for the post-2022 names and the newest two boxes).

**75 lockboxes total. Icons staged for 73; 2 still need an in-game screenshot.** Icons live in `images/lockboxes/<slug>.webp` (64px, WebP). Master list with dates + featured rewards: `docs/reference/lockboxes_master.json`.

## Missing icons (need an in-game tooltip/inventory screenshot)

- **Buried Treasure Lockbox** (2026-07-09) — not on the wiki, not on NW Hub; the official article only has mount/companion showcase renders.
- **Wild Adventures Lockbox** (2026-09-01) — not on the wiki, not on NW Hub; the official article only has mount/companion showcase renders.

## Sourcing notes
- Wiki icons exist for 48 boxes (all 64px except Runic at 128px). NW Hub has 71 (all 64px). Overlap is the same art; NW Hub used for consistent slugs, wiki used for Runic (higher-res), Astral and Shimmering (NW Hub does not list those two).
- The NW Hub catalogue calls it "Dragonslayer's Lockbox"; the official article and our data say "Dragonslayer Lockbox" — canonical name kept as the official one.
- Our data also carries `Red Harvest II Lockbox` (1 mount) and `Tyrannical / Draconic Rage Lockbox` (1 mount) as sources. Neither name appears in any of the three external sources — flag as unverified source text, not as real boxes.
- NW Hub `releaseDate` values are PC dates; console timing differed for the older boxes (wiki caveat).


## Full list

| # | Lockbox | Released (PC) | Icon | Named in our data? | Featured mount(s) | Featured companion(s) | Featured artifact(s) |
|---|---|---|---|---|---|---|---|
| 1 | Nightmare Lockbox | 2013-04-25 | yes | yes | Heavy Inferno Nightmare | Phoera | — |
| 2 | Feywild Lockbox | 2013-08-15 | yes | yes | Sylvan Stag | Aranea | — |
| 3 | Dark Forest Lockbox | 2013-10-03 | yes | yes | Owlbear | Pseudodragon | — |
| 4 | Rusted Iron Lockbox | 2013-12-05 | yes | yes | Apparatus of Kwalish | Rust Monster | — |
| 5 | Unearthed Lockbox | 2014-02-13 | yes | yes | Emperor Beetle, Giant Beetle | — | Thayan Book of the Dead |
| 6 | Frozen Crystal Lockbox | 2014-05-13 | yes | yes | Black Ice Warhorse | Black Ice Ioun Stone | Sphere of Black Ice |
| 7 | Lockbox of the Magnificent Emporium | 2014-06-26 | yes | yes | Tenser's Floating Disk | Laughing Skull | Kessell's Spheres of Annihilation |
| 8 | Tyrannical Lockbox | 2014-08-14 | yes | yes | Imperial Rage Drake, Rage Drake | — | Oghma's Token of Free Movement |
| 9 | Fell Dragon Lockbox | 2014-11-02 | yes | yes | Skeleton Steed | Assassin Drake | Belial's Portal Stone |
| 10 | Nine Hells Lockbox | 2014-11-18 | yes | yes | — | — | Token of Chromatic Storm, Heart of the White Dragon, Heart of the Green Dragon, Heart of the Blue Dragon, Heart of the Black Dragon |
| 11 | Dragonforged Lockbox | 2015-01-15 | yes | yes | Gorgon | Iron Golem | — |
| 12 | Black Earth Lockbox | 2015-04-07 | yes | yes | Armored Bulette, Bulette | — | Symbol of Earth |
| 13 | Eternal Flame Lockbox | 2015-06-04 | yes | yes | Armored Giant Strider, Giant Strider | — | Symbol of Fire |
| 14 | Crushing Wave Lockbox | 2015-08-11 | yes | yes | Coastal Flail Snail, Flail Snail | — | Symbol of Water |
| 15 | Howling Hatred Lockbox | 2015-10-01 | yes | yes | Armored Axe Beak, Axe Beak | — | Symbol of Air |
| 16 | Glorious Resurgence Lockbox | 2015-11-17 | yes | yes | Glorious Resurgence Epic Mounts Pack | Glorious Resurgence Epic Companions Pack | Glorious Resurgence Epic Artifacts Pack |
| 17 | New Life Lockbox | 2016-01-21 | yes | yes | — | New Life Legendary Companion Pack, New Life Epic Companion Pack | Horn of Valhalla |
| 18 | Shaundakul Lockbox | 2016-03-15 | yes | yes | Armored Griffon Mount Pack | — | — |
| 19 | Firemane Lockbox | 2016-06-07 | yes | yes | Swift Golden Lion | Stalwart Golden Lion | — |
| 20 | Runic Lockbox | 2016-08-16 | yes | yes | Runeclad Manticore | — | — |
| 21 | Giants' Lockbox | 2016-11-08 | yes | yes | — | Manticore | Eye of the Giant |
| 22 | Many-Starred Lockbox | 2017-02-21 | yes | yes | Arcane Whirlwind, Whirlwind | — | Tome of Ascendance |
| 23 | Lockbox of the Nine | 2017-05-02 | yes | yes | Celestial Stag, Starfade Stag | — | Sigil of the Nine |
| 24 | Merchant Prince Lockbox | 2017-07-25 | yes | yes | Legendary Tyrannosaur Pack, Cavalry Tyrannosaur | Tamed Velociraptor | — |
| 25 | Lockbox of the Lost | 2017-10-24 | yes | yes | Legendary Carpet of Flying, Carpet of Flying | Savage Allosaur | — |
| 26 | Soulmonger's Lockbox | 2018-02-27 | yes | yes | War Triceratops, Triceratops | Infant Gorilla | — |
| 27 | Undying Lockbox | 2018-06-26 | yes | yes | Swarm, Mist Form | Razorwood | — |
| 28 | New Opportunities Lockbox | 2018-11-06 | yes | yes | Legendary Adolescent Deep Crow, Adolescent Deep Crow | Deep Crow Hatchling | — |
| 29 | Reborn Lockbox | 2018-11-06 | yes | yes | Reborn Legendary Mounts Pack, Reborn Epic Mounts Pack | Reborn Epic Companions Pack | Shard of Orcus' Wand |
| 30 | Acquired Treasures Lockbox | 2019-02-12 | yes | yes | Acquired Treasures Legendary Mount Pack, Acquired Treasures Epic Mount Pack | Acquired Treasures Epic Companion Pack | — |
| 31 | Lockbox of the Mad Mage | 2019-04-23 | yes | yes | Legendary Hellfire Engine, Hellfire Engine | Grung | Wheel of Elements |
| 32 | Excavated Lockbox | 2019-06-11 | yes | no | Excavated Legendary Mounts Pack, Excavated Epic Mounts Pack | Excavated Epic Companions Pack | — |
| 33 | Halaster's Lockbox | 2019-08-13 | yes | yes | Legendary Giant Toad, Epic Giant Toad | Crystal Golem | — |
| 34 | Stardock Lockbox | 2019-11-22 | yes | yes | Stardock Legendary Mount Pack, Stardock Epic Mount Pack | Stardock Epic Companion Pack | — |
| 35 | The Descent Lockbox | 2020-01-21 | yes | yes | Legendary Barlgura, Barlgura | Fiendish Charmer Pack | Belial's Portal Stone |
| 36 | Wasteland Lockbox | 2020-04-16 | yes | yes | Wasteland Legendary Mount Pack, Wasteland Epic Mount Pack | Wasteland Epic Companion Pack | — |
| 37 | The Blood War Lockbox | 2020-06-30 | yes | yes | Infernal War Machine | Spined Devil | Staff of Flowers |
| 38 | Astral Lockbox | 2020-07-30 | yes | yes | — | — | — |
| 39 | Redeemed Lockbox | 2020-09-15 | yes | yes | King of Spines, Legendary Tyrannosaur Pack | Redeemed Epic Companion Pack | — |
| 40 | Forsaken Lockbox | 2020-12-08 | yes | yes | Polar Siege Bear, Brown Siege Bear | Forsaken Epic Companion Pack | — |
| 41 | Spellbound Lockbox | 2021-02-09 | yes | yes | Hag's Hexing Cauldron, Hag's Cooking Cauldron | Displacer Beast | — |
| 42 | Enchanting Lockbox | 2021-04-29 | yes | yes | Feywild Stag, Cosmos Stag | Enchanting Epic Companion Pack | — |
| 43 | Ensorcelled Lockbox | 2021-06-17 | yes | yes | Feywild Griffon, Armored Griffon | Butterfly | — |
| 44 | Lockbox of Justice | 2021-07-27 | yes | yes | Noble Pegasus, Pegasus | Minsc | — |
| 45 | Reconnaissance Lockbox | 2021-10-07 | yes | yes | Marvelous Reconnaissance Balloons, Legendary Reconnaissance Balloons | Legendary Class Companion Choice Pack | — |
| 46 | Stealth Lockbox | 2021-12-02 | yes | yes | Rimefire Salamander, Frost Salamander | Shadow Elemental | — |
| 47 | Skeletal Lockbox | 2022-01-11 | yes | yes | Empowered Dragonbone Golem, Dragonbone Golem | Lich | — |
| 48 | Lockbox of Dark Omens | 2022-03-24 | yes | yes | Omen of Despair, Black Unicorn | Dragon Hunter | — |
| 49 | Dragon Cult Lockbox | 2022-06-14 | yes | yes | Nightfire Dragonnel | — | Dragonbone Blades |
| 50 | Dragonslayer Lockbox | 2022-09-01 | yes | yes | Bigby's Hand | Kavatos Stormeye | — |
| 51 | Myconid Lockbox | 2022-11-08 | yes | yes | Myconid Bulette | Rumpadump | — |
| 52 | Lockbox of Lost Knowledge | 2023-01-12 | yes | yes | Umber Hulk | Flumph | — |
| 53 | Lolthian Lockbox | 2023-03-28 | yes | yes | Ebon Riding Lizard | Blaspheme Assassin | — |
| 54 | Atramentous Lockbox | 2023-05-25 | yes | yes | Deadly Driderform | Minotaur Mercenary | — |
| 55 | Planar Panic Lockbox | 2023-07-07 | yes | yes | Uni the Unicorn | Bobby the Barbarian | — |
| 56 | Lockbox of Shadowy Flight | 2023-09-14 | yes | yes | Demon Wings | — | Crystal of Soul's Flight |
| 57 | Miniature Giant Space Lockbox | 2023-11-07 | yes | no | Giant Space Hamster | Xaryxian Defector | — |
| 58 | Starlight Armaments Lockbox | 2024-01-18 | yes | yes | Golden Armored Griffon | — | Marco's Mystic Marker |
| 59 | Doomspace Lockbox | 2024-04-23 | yes | yes | Zodar Armor | — | Beacon of Meteor Swarm |
| 60 | Astronautical Lockbox | 2024-06-03 | yes | no | Space Guppy School | Flapjack | — |
| 61 | Leaping Flame Lockbox | 2024-07-16 | yes | yes | Bestial Fire Archon | Diana the Acrobat | — |
| 62 | Foxfire Lockbox | 2024-09-19 | yes | yes | Red Mountain Fox | — | Heart of the Volcano |
| 63 | Psionic Lockbox | 2024-11-19 | yes | no | Brain Stealer Dragon | — | Grace of Pelor |
| 64 | Earth Mote Lockbox | 2025-01-12 | yes | no | Skyhold Alligator | Hank the Ranger | — |
| 65 | Glorious Undead Lockbox | 2025-03-11 | yes | yes | Glorious Undead Lion | — | Nightflame Censer |
| 66 | Wings and Cauldrons Lockbox | 2025-05-14 | yes | yes | Hag's Enchanted Cauldron | Aoth Fezim & Brightwing | — |
| 67 | Phantasmal Fantasy Lockbox | 2025-07-17 | yes | yes | Phantom Panther | Lysaera | — |
| 68 | Feywild Wonders Lockbox | 2025-08-27 | yes | yes | Twice-Pale Alder Mount | Grace Revoir | — |
| 69 | Grubby Goods Lockbox | 2025-11-25 | yes | no | Grubshank the Burdened | — | Combat Enchantments Choice Pack |
| 70 | Deathly Delights Lockbox | 2026-01-20 | yes | no | Demonic Gravehound | — | Demon Skull |
| 71 | Pet Pals Lockbox | 2026-03-10 | yes | yes | Cactus the Hedgehog | Sardina the Tressym | — |
| 72 | Encroaching Frost Lockbox | 2026-05-19 | yes | yes | Snowtusk | Sir Waddlelot | — |
| 73 | Buried Treasure Lockbox | 2026-07-09 | **MISSING** | no | Ollie the Octie | — | — |
| 74 | Wild Adventures Lockbox | 2026-09-01 | **MISSING** | yes | Star Angler | Encore the Virtuoso | — |
| 75 | Shimmering Lockbox | — | yes | no | Marbled Stallion | — | — |

## Featured-reward coverage in our databases
Every featured mount/companion/artifact from all 75 boxes exists in our data except:
- **Black Ice Ioun Stone** (companion, Frozen Crystal Lockbox, 2014) — not in `companions.json`.
- **Hag's Hexing Cauldron** (legendary mount, Spellbound Lockbox) — we have "Hag's Cauldron", "Hag's Cooking Cauldron" and "Hag's Enchanted Cauldron"; confirm which entry is the Hexing (legendary) one or whether it is missing.

Name-only differences (present, spelled differently): Crystal Golem → Crystalline Golem; Bobby the Barbarian → Bobby; Xaryxian Defector → Xaryxian; Diana the Acrobat → Diana; Minotaur Mercenary → Minotaur; Twice-Pale Alder Mount → Twice-Pale Alder.

## Trust note (2026-09-28)
NW Hub's `bloodthirst_chalice.webp` is actually the **Laughing Void** icon (pink orb). Verified against n00b's Bloodthirst Chalice tooltip silhouette (a ring/bowl) and the wiki uploads `Icon_Inventory_Artifact_M325_Bloodthirstchalice.png` / `Icon_Inventory_Artifact_M335_Laughingvoid.png`. Treat NW Hub artifact icon names for Mod 32.5+ items as unverified; the wiki `File:` namespace (`list=allimages&aiprefix=Icon_Inventory_Artifact_M3`) is the better source for new-module icons.
