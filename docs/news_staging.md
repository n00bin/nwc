# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

## Week of August 31, 2026

### Features

- **Proc bonuses now follow your own crit and deflect chance.** Action-point procs (Critical Charge, Raging Zeal, Skirmisher's Zeal, Butcher's Zeal, Executioner's Zeal) and cooldown procs (Encounter Reprieve, Medic's Haste) are computed from the proc's own terms at your build's crit chance rather than a fixed number, and deflect-triggered heals (Survivor's Remedy) use your Deflect chance. The Detailed Stats line shows the math, for example "25 AP x 0.161/s at 81% crit".

- **Solo mode (Toon Forge).** Content type in Party Buffs now has "Solo (no party)". Gear that only works alone (Wanderer's Vigor, Garb of the Ascended's HP half, Herald's Cunning) switches on, party-only halves switch off, and "per player in your team" pieces (Leader's Vitality) count 1 / 5 / 10 for solo / dungeon / trial. Proc-style bonuses now respect zone, role, solo and build-condition gates too.
- **Sim controls only show when they matter (Toon Forge).** The distance, action-point, stamina, movement, enemies, enemy-attacks and target-shield controls now appear only when a piece on your build actually uses them. An empty build shows just the Content zone picker.
- **Build conditions (Toon Forge).** Some gear only works in a situation your party or your powers create, like "when you have a Shield or Temp HP". Instead of a global switch, the build now answers these itself where it can (a Wizard with Shield slotted, or a Paladin / Warlock party healer, set in the new "Party healer" pick in Party Buffs) and otherwise asks you a Yes / No only when a piece that needs it is on your build. Unanswered counts as No, so nothing gets credit you have not confirmed. First users: Shielded Strength on the Caster's Robe and the Radiant Elven Jerkin (which was missing its damage half entirely).
- **Raging Rally and Vital Onslaught use the sequence-proc model (Toon Forge).** "Your next three strikes from encounter powers deal X% more" now counts the three boosted strikes against your real rotation share, instead of a flat guessed uptime.
- **Target has a shield checkbox (Toon Forge).** Tick it when the enemy carries a shield. Shield Breaker on the Garnet Abyssal Loop (+8% damage vs shielded targets) now counts only when ticked, instead of never.
- **Missing-health bonuses follow the health slider (Toon Forge).** "Gain up to X based on your missing health" gear (Survivor's Resilience, Enduring Resilience, Survivor's Reflexes, Survivor's Critical Resilience, 19 pieces) now scales with your Current health setting: nothing at full health, the full value at 25% or below, exactly like the tooltip. Endless Loop of Xaryxis also keeps its smaller outside-Wildspace half. Before this they were counted at a flat half or only under the threshold.
- **Enemy attacks toggle (Toon Forge).** Beside the enemies slider: say whether what hits you is mostly melee or mostly ranged. Bulwark's Shield ("3% less damage from Ranged attacks", 7 pieces) now only counts when you pick ranged, instead of a guessed half. Saved in builds; default Mostly melee.
- **Enemies in combat slider (Toon Forge).** Set how many enemies you usually fight at once (1 = a single boss). Bonuses that need 2, 3 or more enemies (Enveloped, Maiden's Advantage, Challenger's Awareness), bonuses that only work against one enemy (Challenger's Might/Guard/Strength, Overwhelming Offense, Solitary Power, Tenacious Luck) and bonuses that grow per enemy (Death Defier's family, Death Defying Advantage, Berserking Might, Overwhelming Parry) all follow this number. 353 entries. Saved in builds; default 1.

- **Moving / Standing still toggle (Toon Forge).** Beside the sliders: say whether you usually move or hold position. Bonuses that only work while moving (Critical Momentum, Serpentine, Expert's Grace, Momentum's Edge, Kinetic Precision, Dancer's Guard) or only after standing still (Defense, Advantage, Healing and Control Preparation, Immovable Bulwark, Bulwark Preparation) now count exactly by your setting. 48 entries. Saved in builds; default Moving.

- **Current stamina slider (Toon Forge).** Third slider beside distance and action points: set how full your stamina bar usually is. The 164 shirt, pants, ring and helm bonuses that only work over 75% stamina (Charged Fury, Charged Might, Precision Tactics, Charged Precision) or only under 25% (Depleted Grace, Depleted Advantage, Enervated Parry, Unfazed Finesse) now count exactly when your setting allows it. Before this, both sides were being counted at once. Saved in builds and share links; default 100%.

- **Current action points slider (Toon Forge).** Next to the distance slider: set how full your action-point bar usually is. Gear that only works below 80% (Discharged Force, Discharged Precision, Sharpened Precision) or only at a full bar (Charged Focus, Charged Power, Charged Might) now counts exactly when your setting allows it. Saved in builds and share links; default 50%.

- **Distance to target slider (Toon Forge).** Next to the Content zone picker: set how far you usually stand from the boss, in feet. Gear that only works up close (Brute's Expertise, Brute's Fury, Brute's Might, Brute's Advantage, Abyssal Fury rings) or only at range (Sniper's Fury, Sniper's Advantage, Magician's Fury, Soulpiercer) now counts exactly when your distance allows it, instead of an assumed 85/15 split. Saved in builds and share links; default 10 ft.

- **Every gear proc now counts, or says why it does not.** Action-point procs (Critical Charge, Butcher's Zeal, Skirmisher's and Raging Zeal, Advantageous Action, Executioner's Zeal) now feed Action Point Gain, cooldown procs (Encounter Reprieve, Medic's Haste, Artifact Fanatic, Death Defier's Haste, Challenger's Alacrity) feed Recharge Speed, heal-on-hit and healing-orb effects feed the healer score (ally) and survivability view (self), and flat-damage procs including the reflect rings (Manticore's Mane Bite, Pact of Vengeance, Fanged Vice/Vex, Reprisal Reflex) count as proc damage sized by your own Max HP. Each entry states the formula it uses. Effects with nothing to score, such as threat, stealth, control, gold and pet summons with no stated damage, are marked display-only with the reason instead of silently being ignored. Gear tooltip coverage went from 60% to 96.5% today.

- **The Voidbound set is in the databases, verified from in-game tooltips.** All three Battle Pass pieces are now real entries you can pick in Toon Forge: **Laughing Void** (artifact, Item Level 2,600 — +2,340 Critical Strike, +2,340 Critical Severity, +1,560 Combat Advantage, +15% Stamina Regeneration, +2,600 Combined Rating, with Corrupting Form on a 60-second recharge), **Voidbound Necklace** and **Voidbound Belt** (both Item Level 4,050, no class restriction). Wearing all three completes the **Evolving Form** set.

- **The Evolving Form set bonus is modelled.** Three pieces gives a lasting **+2% Combat Advantage, +7.5% Movement Speed and +2% Critical Strike**, which double for 13 seconds while Corrupting Form is running. Toon Forge counts the lasting values, and only counts them once no matter which of the three pieces you look at. The announcement article had said the third stat was Accuracy — the in-game tooltip says Critical Strike, so Critical Strike is what we use.

- **The Mod 33.5 preview page has been rebuilt from the official release article.** Everything Cryptic published for **Monoliths of Madness** is now written up on the preview page: how the 12-week event campaign works (four phases of three weeks, one of four rotating zones active each week, everyone downscaled), what you need to join each zone, how **Shards of Madness** and the server-wide **Nightmare Progression** bar pay out, how the **corrupted altars** are opened (three Lesser Abyssal Lures, then three Greater ones), the roaming world boss **Maxare'xek the Mad**, and the reworked corrupted Heroic Encounters.

- **Two new sections on the preview page: New Items & Rewards, and Battle Pass & Lockbox.** Full stat lines as published for the **Staring Cat of Uldun-Dar** companion (Unflinching Will / Grim Omen), the **Umbral Widow** mount (Shadow Sight / Tunnel Vission), the **Burning Hope** artifact (Healing Flame), the **Laughing Void** artifact with its **Voidbound Necklace + Belt** set effect, **Star Angler** mount (Uncanny Precision: 2,700 Combined Rating, 2,250 Combat Advantage, 2,250 Accuracy) and **Encore the Virtuoso** companion, plus the Warden's Cache contents, the 90-slot Brimming Bountiful Bag, the Peeper Keeper, and the new **Coffer of Celestial Insignias** in the Vault of Piety. None of it is in the databases yet — it goes in once we have in-game screenshots.

- **The preview page now carries the official data tables.** The release article's four tables are on the page as real tables: the **campaign phase schedule** (which three zones rotate in each phase, with dates from September 1 to November 24), the **event currencies** and how each one drops, a **full item list** naming exactly where every new item comes from and which phase it unlocks in, and the **content calendar** through November 13 with events, Battle Pass phases, lockbox and the weekly double-currency schedule.

- **Three things the article's text never mentioned.** Reading the tables turned up a **Warden Mark** currency, a **Monoliths of Madness Vendor** selling the Epic armor, shirts/pants, rings and Magnificent Illusion Essence, and a **Champion of the Emerald Vigil** title from Phase 4. The page also now says which phase each Nightmare reward comes from instead of lumping them together.

- **Corrections to what was on the preview page before.** The earlier write-up came from the August announcement and several details had changed or were wrong: the fourth zone is **Dragonbone Vale** (not Dragonbane), the altar currency is **Abyssal Lures** (not Nightmare Fragments), the event mount is the **Umbral Widow** (not "Abyssal Spider"), and the lockbox pair are **Star Angler** and **Encore the Virtuoso**. The two Combat Enchantment slots are **Strike and Guard** — not Offense and Defense — and two important details were missing: Combat Enchantment **Item Level is halved** so two of them total what one did before, and they now increase **Base Damage** instead of Damage, which means they no longer boost Outgoing Healing.

- **Toon Forge now has both Combat Enchantment slots.** Module 33.5 gave every character a second Combat Enchantment slot, and Toon Forge now matches the game: the Enhancements step shows **Combat · Strike** and **Combat · Guard**. Strike takes the offensive combat enchants, Guard takes the defensive ones, and the three that work either way (**Divine Aegis**, **Radiant Sanctuary**, **Fluid Aurora**) show up in both. The optimizer searches the new slot too. Builds you saved before this still load exactly as you saved them.

- **Combat Enchantment Item Level is now halved, matching the patch.** The game halved the Item Level on every Combat Enchantment so that wearing two of them adds up to what one used to give. Toon Forge's Item Level totals now use the new numbers, so your Total Item Level reads the same as in-game instead of running 3,000 to 3,500 high.

- **Combat Enchantments now boost Base Damage, not Damage.** The patch changed this because their damage bonus was also boosting Outgoing Healing, which was never intended. The damage sim now treats that bonus the same way the game does. Healers: nothing you see changes — Toon Forge never counted combat enchants toward healing in the first place.

### Bug Fixes

- **Guard slot: Divine Aegis, Radiant Sanctuary and Fluid Aurora.** These three combat enchantments were tagged as fitting either the Strike or the Guard slot. They are Guard-slot enchantments, so the Toon Forge pickers and the optimizer now offer them only for Guard, and Strike lists only the Offense combat enchantments.

- **Every remaining set bonus is now structured (leveling-tier sweep).** The Overcharge weapon families (Hexweaver, Shadewalker, Oathkeeper, Trailblazer, Shadesinger, Manaseeker, Headsman), the Stronghold-style party-stack sets (Duergar, Masterwork II/III, Stronghold Unity, Devil's Legion), the four Alacrity accessory sets, Stormforged, Blaspheme, Scalebreaker's Wrath, Fortified Vale, Vale, Blessed Blade, Fey, Lifeforged, Mirage, Sun, Earthen Heart, Howling Heart, Pilgrim, Tyrant, Primal, Pioneer, Hellfire Engine Remains, Duality/Twisted, Celestial, Aboleth, Grand Alliance, Astral Dash, Rune of Replenishment, Lolthian Might, Dusk, Dragonflight and Enchanted Advantage now carry real stat entries with a stated uptime (a 10-second buff on a 30-second cooldown counts at a third, and so on). The 283 placeholder zero-value entries that made some sets look wired are gone. Dusk and Dragonflight's Maximum Hit Points now count as a flat pool amount, not a percentage. Seventeen weapon slot labels were corrected where a class's pair had two main-hands (Bard lutes, Ranger knives and dual blades, a Rogue stiletto, the Wizard Nether Convergence).

- **More weapon set bonuses now count, for every class.** Umbral Stride, Prismatic Defier of Dread and Skyhold Arms (the Thay / Pirates' Skyhold / Dread Sanctum stacking sets), Living Magma (Power at full health plus the role riders), Peer Into the Void (flat +5% Overall Outgoing Healing, -5% Incoming Damage and the Darklight stacks), Demonweb Empowerment, Whisper of Power (each class's own rating), and the eight Thay weapon sets (Soulpiercer, Essence Reap, Abyssal Prowess, Crimson Clarity, Executioner's Bloodthirst, Ghastly Eruption, Umbral Convergence, Blood Bargain) are now structured on every class's pair instead of only the classes that had been captured first. Zone-only parts (Thay, Wildspace, Pirates' Skyhold) still only count when that zone is selected. Toon Forge also stopped cancelling two different bonuses of the same stat within one set (a flat bonus plus a per-stack one, or a zone bonus plus a proc).

- **"Up to X% damage by hit-point difference" weapon sets no longer count at full value.** Dark Matter (Solarium/Starcore), Meteoric Fury (Meteoric Iron), Beholder Slayer (The Weaver's) and Demon Lords' Immortality were scored as a permanent +5.5% / +3% / +5% / +10% damage, which is what let the optimizer hand a Bard the Item Level 2,700 Solarium/Starcore pair over 5,800 Wintermarked weapons. The HP-difference part now counts at an assumed 40% average over a boss kill (a tunable in the engine), and the always-on role riders that were missing are in: DPS Base Damage Boost (+3% / +2% / +1% per ally stack), Tank Incoming Damage (-6% / -4% / -2% per stack), Healer Overall Outgoing Healing (+6% / +4% / +2% per stack). All eight classes' pairs are wired; before, only Bard/Rogue/Paladin (Dark Matter) and Rogue (the other two) had any of it.

- **Chilling Flow weapon set bonus now counts for every class.** The Wintermarked (Item Level 5,800) and Runefrost (5,500) weapon pairs' 2-piece bonus was only wired up on the Paladin shield; the other eight classes' pairs were text-only, so Toon Forge and the optimizer scored the set as zero. All 17 off-hands now carry the tier-exact stacks (5,800: +0.4% Power and +0.6% Critical Severity per stack for DPS, +0.5% Overall Outgoing Healing for healers, +0.5% Awareness for tanks, 10 stacks; 5,500: +0.35% / +0.5% / +0.4% / +0.4%). The Frostbound (4,800) rung stays text-only until a tooltip with its per-stack numbers is captured.

- **Frostsilver Circlet of Protection's Rubellite gem line never paid out.** The ring's "+3% Forte when a Celestial Rubellite Tourmaline is slotted" line was spelled with one L in the database, so the tool never recognised the slotted enchant and quietly dropped the 3%. Fixed against the ring's own tooltip; a Justicar tank sheet now reads Forte 54.0% exactly as in-game.

- **Aasimar ability bonuses were the wrong way round.** The race gives a fixed +2 Charisma with a choice of +2 Constitution or +2 Wisdom. We had the fixed +2 on Wisdom and the choice between Constitution and Charisma, which put Aasimar characters 2 points high on Wisdom and 2 low on Charisma — nudging Forte, Recharge Speed, Control Resist and Outgoing Healing. Verified against an in-game ability panel.

- **Priestess of Sehanine Moonbow gave too little Deflect.** Her Sehanine's Wisdom power was stored as +1.8% Deflect / +3.75% Awareness at Legendary. In-game both stats are equal (+4.5% each at Celestial), so Deflect is now +3.75% at Legendary and scales with the other stat.

- **Shadow Demon's +90% Deflect Severity now shows on your standing stats.** The buff is handed out every 30 seconds whether or not you are fighting, and the in-game sheet shows it at rest, so Toon Forge now does too. Previously it was treated as a rare proc and hidden behind "in-combat bonuses". Tanks will see Deflect Severity jump when this companion is active, which is what the game shows.

- **Aasimar's Celestial Presence now counts for you.** The +2% Maximum Hit Points aura was listed under its wiki name and treated as party-only. The in-game tooltip says it includes you, so it is now always on. Max HP for an Aasimar tank went from 2% under the sheet to within a rounding error of it.

---

## Week of August 24, 2026

### Data Additions

- **Leveling-tier gear bonuses structured (Item Level under 3,000), plus three lost accessory sets restored.** About 55 bonus families that only existed as tooltip text now count, each with the number taken from that item's own text and a stated uptime for procs: Brute's Expertise/Fury/Tactics, Warden's Defiance, Maiden's Blade, Bulwark's Shield, the Chult and Undermountain hunter bonuses, Victim's Parry/Resistance, This or That, Reckless Brutality/Rage/Advantage, Defender Guard/Strike, Charged Expertise/Precision/Power, Awareness Escalation, Herald's Cry/Defense/Cunning, Executioner's Guard/Fury, Discharged Force, Killer's and Destroyer's Might, Depleted Determination/Desperado/Expert, Medic's Devotion, Gluttonous Might, Veiled Barricade, Ascended Party Bonus, Fairy's Whimsy, Challenger's Haste/Resilience, Adrenaline Rush, Shielded Strength, Skirmisher's Versatility and more. The Wrathful Bindings, Magmatic Efficiency and Diamond 3-piece sets, whose values were lost in a May data rewrite, are back from the in-game validated March baseline. 180 duplicate text entries were removed so cards read once.

- **37 more endgame gear bonuses now count (Item Level 3,000 and up).** Text-only equip bonuses are structured from each item's own tooltip, with a stated uptime for procs: Frostsilver and Coldsilver Circlet/Hoop riders (+Defense / +Forte), Divine Blessing, Warden's Defiance, Critical Guard, Battle Reserves, Focused Burst, Vital Onslaught, Malignant Energy (the "next Encounter after a Daily" family now feeds Encounter damage), Challenger's Lethality, Sharpened Precision and the Discharged Precision boots (with their Pirates' Skyhold / Dread Sanctum / Reghed Edge zone extras), Charged Fortitude, Discharged Force, Berserking Might, Past Regards, Defender Strike, Renegade's Stamina and Footwork, Rested/Corrupt Healing, Survivors Healing Aura, Critical Momentum, Charged Fury, Reckless Remedy (Defense up, Critical Severity down), Duelist's Strength, Critical Tactics and Indefatigable Advantage. Bonuses that key on "Action Points below 80%" were being counted at 15%; they now count at 75% of a fight. 24 duplicate text stubs were removed so gear cards read once.

- **Immortal Jade Horse mount (Feast of Lanterns).** Added with its Barbed + Regal + 2 Universal insignia slots, the Indestructible equip power (+5,062 Defense / +3,038 Combined Rating at Item Level 3,375), and the new Bolstering Cry combat power (+19.7% Maximum Hit Points for allies and yourself plus +13.1% Recharge Speed for 10s, 60s recharge, Celestial Item Level 3,937). Screenshot-verified from the Mount Preview.

- **Four gear pieces were missing a second version.** Some items share a name and item level but come in two versions with completely different stats and a different equip bonus — the game shows them as separate pieces, but we only had one of each. Now added: a second **Veinlit Earthshard Guard** (Pants, Survivor's Avoidance), **Veinlit Stonevein Straps** (Pants, Warden's Defense), **Veinlit Stormbind Tunic** (Pants, Pinpoint Tactics) and **Enchanted Depthforged Gauntlets** (Arms, Enveloped Precision — Barbarian and Fighter only, unlike its Paladin-inclusive twin).

### Bug Fixes

### Bug Fixes

- **The last of the gear audit: 40+ more corrections across older gear.** Stat blocks that had slid one name out of place (**Bronzewood**, **Banditlord's**, **League's Ward**, **Prestige Duelist**), the whole **IL 500 artifact weapon tier** reading 376 instead of **375**, all four tiers of **Primal Rapier** with Combat Advantage at half value, and a batch of stats sitting under the wrong name. Also added versions of items that existed in-game for classes we'd never recorded — Barbarian **Black Ice Armor**, Wizard **Black Ice Boots** and **Gloves**.

- **Older gear had its decimal stats rounded off.** Low item-level gear genuinely gives fractional ratings — 87.6 Critical Strike, 39.6 Accuracy, 91.9 Combat Advantage — and at some point those were rounded to whole numbers. **21 items** across the **Hammerstone**, **Black Ice**, **Thayan Servitor** and **Brynnyr's Demise** families now show their real values again. A few had bigger problems hiding underneath: **Brynnyr's Demise** was missing its Defense entirely and had Critical Strike listed at 57 instead of **5.7**, and the Ranger **Boots of the Thayan Servitor** were carrying the Bard/Rogue version's stats. Also added four versions of items that were missing for a class: **Eternal Boots** (Paladin/Fighter), a Barbarian **Eternal Helm**, and Wizard **Hammerstone Boots** and **Gloves**, plus the Wizard **Boots of the Thayan Servitor**.

- **Six more Combined Rating fixes, and a damage bonus that was too generous.** **Ring of the Shadowstalker +5** had its Combined Rating at 538 instead of 571, and its Brute's Fury bonus listed as 3% extra damage when the real tooltip says **2.5%** — that one was inflating damage numbers for anyone using the ring. **Black Draconic Guise** and **Bracers of Defense** both read 472 instead of **567**, and the three Atropal/Skull Lord artifact pieces all read 385 instead of **315**.

- **37 items were in the wrong equipment slot.** Six whole armour sets — Huntsman, Pilgrim, Pioneer, Primal, League's and League's Elite — had every non-chest piece filed as body Armor, so their helmets, bracers and boots couldn't be equipped where they belong and were competing against chest pieces in the optimizer. Also fixed: **Eternal Greaves** (listed as Arms, actually Feet) and **Stormforged Lute** (listed as a Main Hand, actually an Off-Hand — its set partner is the main hand, so the pair had two main hands and no off-hand).

- **Two dozen items were hidden from classes that can use them, or shown to ones that can't.** The **Protege's** and **Lionsmane** sets had their class lists cut down to a single class — Protege's gear is for Bard, Cleric, Ranger and Rogue (or Warlock and Wizard), and Lionsmane is Bard and Rogue. Six more were labelled with the wrong class entirely, all of them Barbarian gear filed under Paladin, Fighter, Ranger or Warlock, and the four **Ancient Scalebreaker** pieces had their Wizard and Bard versions swapped. A duplicate **Tunic of the Thayan Servitor** that offered Rangers the wrong stats has been removed.

- **13 items showed a bonus called “Equip”.** Some Neverwinter bonuses have no name, and on those the word “Equip” from the tooltip label had been captured as the bonus title — so the item card displayed a bonus literally named “Equip” or “Equip Bonus”. Now shown as the game shows them. **Golden Dragon's Hellbringer** and **Soulbinder of the Golden Dragon** were also missing their bonus entirely (+10% damage to Hellish Rebuke and Essence Defiler).

- **All eight Rosegold rings had the wrong Combined Rating.** Every rating stat on them was right, but the Combined Rating read 382 instead of **582** on all eight — Assault, Duelist, Executioner, Gladiator, Medic, Raid, Restoration and Ward. **Fret Barbute of Halaster's Successor** had the same kind of error (999 instead of **909**). Combined Rating is spread across fifteen stats behind the scenes, so a wrong one quietly skews everything rather than showing up as one obviously bad number. Also fixed: the **Warlock** version of **Eternal Helmet**, which had picked up two numbers belonging to the Bard/Rogue version.

### Data Additions

- **22 Manticore and Umbral pieces were missing their equip bonus.** Every Cowl, Longcoat, Wristguard and Pigache in these two sets showed a bonus in-game that the site didn't know about — **Gladiator's Accuracy** and **Gladiator's Focus** (100 Accuracy or Critical Strike every 5 seconds in combat), **Challenger's Might** (+1,500 Power against a single enemy) and **Survivor's Parry** (25 Deflect per 1% of health missing). All now added.

### Bug Fixes

- **Seven of those same pieces also had wrong stats.** Checking each tooltip one by one turned up five stats recorded under the wrong name — mostly a defensive stat sitting in an offensive slot — plus two items whose numbers belonged to a completely different piece: **Manticore Duelist Pigaches** and **Umbral Duelist Pigaches** had both been given the Executioner version's stat line. Their real stats are Combat Advantage and Awareness, not Accuracy and Critical Strike.

- **Two more missing class versions found.** Several older sets give each class group its own version of the same item, and we only had some of them. Added: **Eternal Boots** for **Paladin and Fighter** (the set's Gauntlets, Armor and Helm were listed but the boots never were) and a **Barbarian Eternal Helm**. **Reinforced Dragonflight Assault Hood** also had Critical Severity recorded under the wrong stat name.

- **Six more corrections, including two items the wrong classes could see.** **Prismatic Crystalflex Bracers** and **Crystalflex Bracers** were listed for Warlock and Bard when they actually require **Rogue, Cleric, Bard or Ranger** — so they were being offered to a class that can't wear them and hidden from three that can — and both had wrong stats too. **Blaspheme Longbow** was missing its first two lines entirely (+50 Damage, +570 Accuracy). **Crimson Scalebreaker's Raid Hood** and **Tracker's Dragonflight Ring** each had Critical Severity recorded under the wrong stat name. And **Knight's Dragonflight Ring** had Defense and Incoming Healing **swapped** — 1,125 and 3,375 the wrong way round.

- **Three healer and Bard pieces had stats in the wrong slots.** **Exalted Maiden's Rejuvenation Mitts** had its Outgoing Healing recorded as Critical Strike, with Outgoing Healing left at zero — a healer was getting 1,538 of a stat the item doesn't give while losing 1,538 of the one it does. **The Dark Maiden's Rejuvenation Mitts** had the same problem one tier down (Defense recorded as Critical Strike), and **Stormforged Point** was missing 900 Critical Severity while carrying 600 Forte that isn't on the weapon at all.

- **Four more stat and bonus corrections.** **Astral Raider's Cap** had Control Resist at 1,980 and **Lolthian Coif** had Incoming Healing at 1,845 — in both cases the item's Combined Rating had been copied into a stat slot; both should be **990** and **923**. And **Lolthian Coif** and **Lolthian Circlet** both listed their Skirmisher's Might bonus as 7,300 Power when the real tooltip says **7,500**.

- **Eight more gear pieces had wrong stats — including two endgame weapons.** A new audit reads every archived in-game tooltip and compares each item to its *own* screenshot. Corrections: **Wintermarked Twin Shardblades** was missing **+3,480 Critical Severity** (a top-tier Warlock main hand), **Omen of Doom** was missing **+100 Damage**, **Treads of the Infernal Tempest** was missing **+2,925 Accuracy**, **Deep-Riven Earthshard Guard** was missing **+2,728 Deflect**, and **Huntsman Ward Armet** was missing **+302 Awareness**. **Manticore Duelist Bracers** had Defense at 227 instead of **567**, **Snowbound Halo of Mending** had Forte at 8,445 instead of **6,345**, and **Astral Raider's Coif** carried a phantom +1,980 Outgoing Healing that was really just its Combined Rating counted twice.

- **Dragonsteel Spikes and Sabatons had the wrong stats.** Two of the Northdark Reaches seal-store boots were recorded incorrectly. **Dragonsteel Spikes** (Paladin/Cleric) was carrying a phantom **+1,710 Forte** that was really just its Combined Rating counted twice, and its equip bonus read 3,000 Forte when the real tooltip says **5,000**. **Dragonsteel Sabatons** (Paladin/Barbarian/Fighter) was missing **+1,140 Awareness** entirely. Both are now corrected against in-game tooltips. Other pieces in the Dragonsteel family are still being checked.

- **Off-hand Artifact Modification 1 can now be upgraded.** The first off-hand modification was treated as a single fixed amount per stat. Five of its eight options actually upgrade over a range - **Control Bonus, Control Resist, Incoming Healing, Forte and Critical Severity all run 1,200 to 3,000** - so those now get a value box where you enter what yours currently grants. The three percent options (Action Point Gain 2.5%, Recharge Speed 2.5%, Stamina Regeneration 5%) are genuinely fixed and stay a simple pick. Builds you had already saved keep the amount they were saved with.

### Bug Fixes

- **Wizards can now pick their main-hand Artifact Modification.** In Toon Forge the main hand showed its set bonus but had no place to choose your active modification — the picker only appeared for classes whose verified list we had. The Wizard's six are now in: **Enhanced Magic Missile, Storm Pillar, Scorching Burst, Chilling Cloud, Ray of Frost and Arcane Bolt**, each +10% damage to that power. Pick the one you have Set to Active and, if that power is slotted, the damage sim counts it. (Report #210)

### Data Additions

- **The whole Northdark Merchant overload set is now in.** Underdark Lurker (300 House Baenre Coins) gives **+5% Critical Avoidance**, and the tooltip's "doubles in the Underdark" is modelled properly — pick Underdark as your content zone in Toon Forge and it becomes 10%, everywhere else it stays 5%. Joining it: **Drow Ward** and **Spider Ward** (−10% damage taken from Drow / Spiders) and **Spider Slayer** (+10% damage to Spiders), 100 coins each. Drow Slayer was already on the site and its +10% checked out exactly against the in-game tooltip. (Report #275)

### Bug Fixes

- **"Add Missing" submissions were being lost.** If you used **+ Add Missing Artifact, Mount, Companion, Enchantment, Insignia, Collar, Buff, Guild Boon or Overload** in Toon Forge, the item still went into your own build — but the report telling us about it never reached us, so it could never be added to the site for everyone. (The gear one always worked; these nine did not.) That's fixed. If you added something this way and it never showed up on the site, please add it again — it will reach us now, and you'll see it under **Your Submissions**.

### Data Additions

- **Bloodthirst Chalice added** — the artifact from Tempus Arena: The Slaughterhouse. All five ranks are in, from Uncommon (item level 1,300) up to Artifact Maximum Quality (item level 2,600), each with its own stats, recharge time and debuff strength. At the top rank it gives **1,638 Power / 1,092 Defense / 1,502 Critical Avoidance**, hits for 26,171 AoE damage, applies a bleed, and weakens enemy damage by 10% while slowing lesser enemies by 15%. Thanks to the player who flagged it as missing. (Reports #268-#273)

### Bug Fixes

- **Bulwark of the Eternal Zulkirate had two wrong stats.** The IL 4,300 chest piece was listed with 4,154 Deflect Severity and a Defense stat it does not have. It is actually **4,354 Deflect Severity** and **2,612 Forte** — now corrected and verified against the in-game Collections tooltip. (Report #265)
- **Ruthless Might (Lesser) was under-valued.** The IL 4,050 Bulwark of the Zulkirate's equip bonus was stored as 1% Critical Strike and Critical Severity per stack; in game it is **1.2% per stack** (5 stacks = 6%). Toon Forge now scores this chest correctly.

### Features

- **New Races tab on the Mekaniks page.** Right next to the Classes tab: every playable race with its ability score bonuses (including "choose one" picks and Human/Dragonborn's "any ability" slots) and all its racial traits with their stat bonuses spelled out. Premium races are marked, and situational traits (like party auras) are labelled so you know they're not always-on.

- **Currency Tracker now resets your week by itself.** Set your weekly reset day and time once in the bar at the top, and this week's earnings zero themselves the moment it arrives — you no longer have to press “Reset week now”. It works even if you leave the page open (or come back to a sleeping tab): the tracker re-checks the moment you return, drops the week back to 0, and tells you a new week started. The bar also shows a live countdown (“auto-resets in 2d 14h”) so you can see when it is due. Your held totals and your full log are untouched — only the this-week numbers roll over. The “Reset week now” button is still there as a manual override if you want to start a fresh week early.

---

## Week of August 17, 2026

### Features

- **Currency Tracker — Cap Status now counts up.** Each character row in the Cap Status list now shows progress as earned / cap (e.g. "1,200 / 3,000 this week") instead of counting down what's left, matching the progress lines on the character cards. Capped rows show the full amount with a checkmark.

### Bug Fixes

- **Ranger at-will and encounter pickers are readable again.** Since mid-July, opening the At-Will or Encounter picker on a Ranger in Toon Forge showed a wall of raw code text instead of the powers. The pickers now show each ranged/melee pair properly again — 🏹 ranged side and ⚔ melee side, each with its own damage, cast time and description — and searching the list by power name works too. Only Rangers were affected (they're the only class whose powers come in stance pairs).

---

## Week of August 10, 2026

### Data Additions

- **Star of Simril added** — the Winter Festival augment companion. It shares Power, Awareness and Critical Avoidance with you, comes with the Perfect Vision enhancement, and its Offense/Utility power (Star of Simril's Insight) gives Maximum Hit Points, Critical Strike and a Gold Bonus — 12,000 HP / 3% Critical Strike / 6% Gold at Celestial. Thanks to the player who reported it missing! (Report #253)

### Features

- **Guild boons now say which rank you're looking at.** When you open a guild boon's correction card in Toon Forge, it now explains up front that the numbers shown are the fully upgraded rank-10 values, and that each structure rank is worth 300 stat / 80 Combined Rating / 100 item level — with a pointer to the Rank dropdown on the Boons panel. Two players' "wrong value" reports turned out to be rank-3 guild structures. (Reports #254, #255)

### Bug Fixes

- **Correction reports now remember the site's original value.** If you edited the same field twice on a Toon Forge correction card, the report sent to us said the site showed "(empty)" instead of the real original number. Reports now always carry the site's original value, and re-typing your own earlier edit no longer counts as a change. (Reports #256–#262)

---

## Week of August 3, 2026

(Last published August 3, 2026: "The Optimizer & Forgemaster's Verdict Go Live, Toon Forge Hits v1.0 & a Stable Cleanup")

### Features

- **Optimizer "Build style" choice — Formula vs Cap Stats.** (LOCAL-ONLY until n00b's go — optimizer is the premium tool.) The Optimizer Setup dialog now lets you pick how the search builds: **Formula** (the default — chases the highest real damage/healing/survivability, and only caps a main stat when doing so is free; that's why a healer's Crit Severity can sit under cap on purpose — it's halved on heals) or **Cap Stats** (the community build order — push every main stat to its cap first, then maximize output with what's left; it will trade output away to raise an uncapped main). The result panel's Build order note now says which style produced the build. Your choice is remembered between runs.

- **Preview page rotated to Mod 33.5: Monoliths of Madness.** The preview section now covers the upcoming module (PC test servers opened August 5; release aimed at early September): the new Monoliths of Madness event campaign across four returning zones, a second Combat Enchantment slot (Offense + Defense), item stacks raised from 99 to 999, and the announced upcoming rewards (Abyssal Spider mount, Burning Hope artifact, Staring Cat of Uldunn-Dar legendary companion, Renewed gear, and more). Mod 33 preview screenshots have been retired. Test-server screenshots will be added as content gets verified.

### Data Additions (Preview)

- **First Mod 33.5 test-server screenshots are up on the Preview page (29 images).** The Staring Cat of Uldun-Dar legendary companion (both tooltip tabs), the Umbral Widow mount (equip/combat powers + insignia slots), the Burning Hope artifact, and the full Renewed gear lineup: Delzoun armor (Head/Chest/Arms/Feet, 3 variants each) plus all 6 Obsidian shirt and 6 pants variants. The Renewed gear has no class requirement, so the Gear section now has an "All Classes" group with slot filters.

### Bug Fixes

- **Wizard Thaumaturge — Critical Burn feat now counts.** Slotting the Critical Burn paragon feat now adds its +10% Critical Severity to your stat panel in Toon Forge, matching the in-game sheet. (Report #248)

- **Ichorpact Gauntlets** — the Renegade's Stamina equip bonus is now applied to your stats (1.4% Stamina Regeneration per stack, 7% at 5 stacks), not just shown as text. (Report #236)

### Data Additions

- **Rogue frost weapons — all four Chilling Flow daggers.** Added the Rogue Jotunskar weapon pairs: Runefrost Nightknife + Runefrost Sideblade (Item Level 5,500, Advanced) and Wintermarked Shardfang + Wintermarked Offhand Fang (Item Level 5,800, Master), all screenshot-verified from in-game collections, including the tier-exact Chilling Flow set bonuses. Thanks to the player who submitted them! (Reports #239, #240, #241)

- **Reinforcement kits — full Greater/Major ladder, 33 new kits.** Every armor kit and jewel family (Power, Defense, Critical Strike, Critical Severity, Deflect, Accuracy, Critical Avoidance, Hit Points, Awareness, Combat Advantage, Stamina Regeneration) now lists the Greater, Greater +1, and Major tiers alongside the existing Major +1 — so lower-budget builds can pick the kit they actually own. Started from a player report suggesting the Major Combat Advantage Jewel +1 (+880) was misnamed — it's correct; Greater and Major are separate crafting tiers. (Report #242)

- **The Slaughterhouse tier 2 — 8 more armor pieces at Item Level 4,600.** Full Head/Armor/Arms/Feet sets for two more families from the Soul Collector Campaign Store: **Ichorpact** (Paladin/Barbarian/Fighter) and **Cruorforged** (Paladin/Cleric), all screenshot-verified with their equip bonuses. These went live August 2 but were never announced. (Reports #234, #235, #236, #237, #238)
