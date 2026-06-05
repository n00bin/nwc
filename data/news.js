// Site news entries — newest first
var NEWS_DATA = [
  {
    date: "June 5, 2026",
    title: "Damage Procs Now Count, Real Max HP & Role-True Sims",
    tags: ["Feature", "Fix", "Data"],
    body: "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-feature'>Feature</span></div>" +
      "<ul>" +
      "<li><strong>Toon Forge — companion damage procs now count.</strong> Companions whose real value is a damage proc (Xuna's poison, Black Scorpion's sting, Hank the Ranger's bleed, Elminster's lightning, Spined Devil's spines, and ~17 more) used to contribute nothing to the damage estimate — their procs were tooltip text only. The damage sim now models them properly: proc chance × how often the trigger happens in a real rotation (crit-based procs even scale with your actual crit chance) × the proc's magnitude at your companion's rarity. The damage readout shows the bonus and which companions provide it, and the numbers line up with community testing (a Mythic+ Xuna adds ~14%). Companion choices in the sim just got a lot more honest.</li>" +
      "<li><strong>Toon Forge — gear damage procs now count too.</strong> Same treatment for gear: bonuses like Critical Force, Daily Burst, Explosive Force and Summon Myconid now feed the damage estimate at their real cadence (chance × trigger rate, respecting internal cooldowns). Magnitude-based procs scale with your build; flat-damage procs are counted at face value — which correctly shows them fading at endgame.</li>" +
      "<li><strong>Toon Forge — Maximum Hit Points is now modeled for real.</strong> The Max HP number used to show only the flat HP printed on your items (~20k); now it computes the full in-game formula — base HP from your Total Item Level (×10), the role bonus (Tanks +20%, Healers +10%), Constitution (+0.5% per point), your items' flat HP, and percent-HP bonuses — landing in the realistic millions that match your character sheet. This also powers a new Tank readout: how many average boss hits you can absorb.</li>" +
      "<li><strong>Toon Forge — role-true damage sim upgrades.</strong> The Healer sim now includes the uncapped <strong>Overall Outgoing Healing</strong> multiplier (bonuses worded \"Overall Outgoing Healing\" were previously shown on the stat sheet but not counted in the heal estimate). The Tank sim gained a plain-English <strong>mitigation multiple</strong> readout — how many times smaller the average boss hit is thanks to your defenses.</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-fix'>Fix</span></div>" +
      "<ul>" +
      "<li><strong>Toon Forge — always-on companion passives now count in your base stats.</strong> 16 companion bonus powers that are permanent passives in game (Stormrider's +3,000 Max HP, Skeletal Dog's +15,000 Max HP, Neverwinter Knight's boss damage, Xegut's Insight, and 12 more) were filed under the \"Show Conditional\" toggle, so the default stat panel quietly undercounted them. They now land in the base panel at full value — Tank Max HP scores in particular get more honest. Genuinely situational procs (stacking buffs, party-dependent effects like Part of the Pack) correctly stay behind the toggle. A related companion data bug — flat HP values counting as percent — was fixed along the way.</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-data'>Data</span></div>" +
      "<ul>" +
      "<li><strong>The Slaughterhouse collection — all 24 armor pieces added.</strong> Full Head/Armor/Arms/Feet sets for six armor families from the Soul Collector Campaign Store, all at Item Level 4,050: Whispersilk (Warlock/Wizard), Gladebind (Warlock/Bard), Thistledown (Rogue/Cleric/Bard/Ranger), Oakenthorn (Paladin/Barbarian/Fighter), Ambersteel (Paladin/Cleric), and Ironblossom (Barbarian/Fighter). Every piece includes its exact stats and equip bonus text (Channeler's Focus, Critical Force, Fount of Healing, and more) — note that the same bonus name can roll different numbers on different families, and those per-item differences are captured.</li>" +
      "</ul>"
  },
  {
    date: "June 4, 2026",
    title: "Massive Gear Audit, 1,300+ Bonuses Now Count & Pack Meta Toggle",
    tags: ["Feature", "Fix", "Data"],
    body: "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-feature'>Feature</span></div>" +
      "<ul>" +
      "<li><strong>Toon Forge — \"Party runs Part of the Pack\" toggle.</strong> New switch in the Party Buffs section (default <strong>on</strong>, matching the current group meta where everyone slots a Pack companion). With it on, party-wide stacking companion buffs count at full strength on your stat sheet — e.g. Raptor's Part of the Pack counts all 5 stacks (+22.5% Power) instead of just your own stack (+4.5%). Turn it off for solo play and the sheet drops back to your own stack only. Works for any current or future companion with a party-wide stacking buff, and your choice saves with the build/share link.</li>" +
      "<li><strong>Stable Planner — \"What can I build with my insignias?\"</strong> Each loadout now has its own <strong>My insignias</strong> counts (just 5 numbers — Crescent / Barbed / Illuminated / Enlightened / Regal). Fill them in, then click <strong>\"What can I build with my insignias?\"</strong> on that loadout to see which of its bonuses you can run at the same time with no insignia doing double duty, plus exactly how many more of each type you're short for the rest. Saves in your browser with the rest of your loadouts.</li>" +
      "<li><strong>Toon Forge — \"Add Missing\" is now everywhere.</strong> The add-it-yourself flow (slots into your build immediately, files a report, tracked in My Contributions) now covers <strong>Overloads, Insignias, Buffs, Guild Boons, Artifacts, Companions, and Mounts</strong> — not just gear and enchantments. Companions capture the companion + its active power; Mounts capture the insignia-slot layout.</li>" +
      "<li><strong>Toon Forge — \"Clear all\" button.</strong> A new <strong>🗑️ Clear all</strong> button (next to Share link) resets every field back to a blank build in one click. It asks for confirmation first, and your saved builds in <strong>My Builds</strong> are kept safe.</li>" +
      "<li><strong>Chain of Scales belt — upgrade-level picker.</strong> One entry with a dropdown for its 7 upgrade levels; pick your level and the Awareness value updates (1.2% base → 3% Empowered). On the Consumables page.</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-fix'>Fix</span></div>" +
      "<ul>" +
      "<li><strong>Toon Forge — 1,320 gear bonuses now actually count toward your stats.</strong> Many gear equip bonuses (Survivor's Might, Challenger's Might, the Gladiator ramps, Leader's team bonuses, the Hunter family, The Ol' Switcheroo trades, and ~165 more bonus families) existed only as tooltip text, so the stat sheet and damage numbers silently ignored them. The most common families — 1,320 individual item bonuses — are now real, structured stats: always-on ones show on your sheet, conditional ones (procs, stacks, health-gated) appear in the \"Show conditional\" view and count in the damage estimate. More batches coming; resource procs (Action Point / cooldown bonuses) are tracked but need new engine support first.</li>" +
      "<li><strong>Toon Forge — shared builds now load exactly as they were built.</strong> Two fixes from a player-reported case where the same share link showed three different Item Levels. Item names in links are no longer capitalization-sensitive (a hand-typed \"Eye of the doomweaver\" now finds the real item instead of silently counting as an empty slot — 19,900 missing IL on the reported build). And when you pick a gear piece that exists at several item-level tiers, the tool now remembers <strong>which tier you picked</strong> and carries it inside the share link — so anyone loading your build sees your exact weapons, not the weakest version with the same name. Existing links keep working; re-pick and re-share to get the exact-tier treatment.</li>" +
      "<li><strong>Gear database deep-audit — 411 items corrected.</strong> Every gear screenshot was re-read by the vision pipeline and compared against the database: <strong>266 wrong/swapped stat values</strong> fixed (including a systematic Critical Strike ↔ Critical Avoidance/Severity mix-up and \"leading digit\" typos), <strong>197 missing set tags</strong> added so set-completion detects pieces like the Mirage, Sun, Dragonflight, and Prismatic Defier of Dread sets, and 6 set-name conflicts resolved. Spot-checked against in-game tooltips.</li>" +
      "<li><strong>Equip-bonus text cleanup — 79 fixes across 77 items.</strong> Corrected bonus names that were stored wrong (\"Critical Strike\" → \"Controlled Strike\", \"Steady Henson\" → \"Steady Precision\") and effect text with wrong numbers or inverted conditions (e.g. Astral Raider's Wristguards read \"70% bonus Damage\" but is actually 20%). Also added the missing \"Butcher's Might\" bonus to the Primal Assault/Raid Shabas.</li>" +
      "<li><strong>Companion power audit — 3 mis-entered powers fixed.</strong> All 267 in-game companion captures were re-read; companion data came back 88% clean. Three Warlock \"Insight\" powers were corrected to match their tooltips (Cambion's → Accuracy + Critical Severity, Cryptic → Combat Advantage + Defense, Deceptive → Defense + Awareness), plus a misspelled power name (Gromph's Confidence).</li>" +
      "<li><strong>Bard — Critical Tuning now counts as always-on.</strong> The class skill (+10% Critical Severity after playing a song) was hidden behind the \"Show conditional\" toggle, so a Bard's sheet looked 10% short. Since songs are the heart of every Bard rotation, it now counts by default.</li>" +
      "<li><strong>Wizard weapons now show up in the Main Hand and Off Hand pickers.</strong> Hundreds of Wizard Orbs and Talismans were mis-filed as \"Artifact Equipment.\" All 232 were re-sorted — the pickers now list 144 / 145 weapons instead of 23 / 22.</li>" +
      "<li><strong>Report #94 — insignia Combined Rating display fixed.</strong> The insignia detail popup now scales to whatever rarity you pick instead of always showing Mythic numbers.</li>" +
      "<li><strong>Report #84 — Bloodwoven Ink (healer Pants) corrected</strong> to its real Survivor's Gift bonus. <strong>Report #91 — Deathsilver Ring of Submission</strong> no longer lists a Forte stat it doesn't have.</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-data'>Data</span></div>" +
      "<ul>" +
      "<li><strong>586 new gear pieces</strong> added from in-game screenshot batches — mostly Barbarian and all-class armor/weapon sets (Aboleth artifact weapons, Adamant, Bladelord's, Astral Raider's, Bloodbrass/Bloodforged, Thayan Servitor, and many more) plus full Wizard sets for Alliance, Elemental Alliance, Elven, Elemental Elven, and Manticore, each across its item-level tiers with equip bonuses.</li>" +
      "<li><strong>Mount icons overhauled.</strong> The Mounts page now uses consistent, high-quality artwork from the Official Neverwinter Wiki — 103 previously-missing icons added, 207 mounts standardized (coverage 255/279). The remaining 24 have no wiki icon and need in-game captures.</li>" +
      "<li><strong>Companion icons completed.</strong> Every companion (264/264) now has an icon — added the missing Festive Tiger, fixed Rothé's encoding bug, and sharpened 18 low-res icons.</li>" +
      "</ul>"
  },
  {
    date: "May 29, 2026",
    title: "Toon Forge Power Fixes, Frostsilver Gem Synergy & Gear Cleanup",
    tags: ["Feature", "Fix", "Data"],
    body: "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-feature'>Feature</span></div>" +
      "<ul>" +
      "<li><strong>Toon Forge — paragon powers now show up in the power picker.</strong> A display bug was hiding every paragon-path at-will, encounter, and daily for most classes (only Paladin was unaffected). The full power list is now selectable — e.g. Devout Cleric jumps from 2/5/3 to 4/10/5 powers, and Barbarian, Bard, Fighter, Ranger, Warlock, Wizard, and Rogue all regained their hidden paragon powers.</li>" +
      "<li><strong>Toon Forge — Frostsilver ring gem synergy is now modeled.</strong> The 7 Frostsilver rings hard-slot two Celestial gems each, but those +3% bonuses only count when you have the matching enchantment (same type and rank) slotted in your build. The builder applies each bonus only when its gem is slotted, and shows a ✅ / ⬜ status for each gem both in the ring picker and on the equipped ring — updating live as you slot or remove gems.</li>" +
      "<li><strong>Toon Forge — empty gear slots are now usable.</strong> A slot with no items yet (like a Cleric off-hand) wouldn't open at all, which also hid the Add Missing Item button. Empty slots now open their picker so you can add the gear yourself.</li>" +
      "<li><strong>Companions — Summoned Buffs tab now shows all buff scopes.</strong> Enemy debuffs (like Black Scorpion's Combat Advantage grant), self buffs, and mixed buffs were hidden before. Each entry now carries a color-coded scope tag (Party / Self / Enemy Debuff / Mixed), and the Toon Forge Party Buffs section models ally summoned companions of every scope (Spined Devil and Succubus correctly don't stack). All 40 summoned-buff companions are selectable.</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-fix'>Fix</span></div>" +
      "<ul>" +
      "<li><strong>Class restrictions corrected across rings and pants.</strong> Every Pants-slot item (26) and every Ring (24 — the Frostsilver, Rimetouched, Snowbound and Demonweb lines), plus the Scintillant and Shroomwood Sash and Amulet, were wrongly limited to a few classes. Pants and rings are never class-locked in Neverwinter, so all are now usable by any class.</li>" +
      "<li><strong>Gear stats and slots corrected from in-game screenshots.</strong> Frostsilver Hoop of Tenacity (second stat is Critical Avoidance 9,900, plus +5% Forte); Deep-Riven Stonevein Harness (Deflect 2,728, +1.5% Recharge Speed, set Freezing Fortitude); Darklake Ward Ring (Critical Avoidance 3,825 / Deflection 1,275 were reversed); Arcane Conduit Sigil (Explosive Defense) moved to its correct Shirt slot; Arcane Conduit Insignia (Corrupt Power) third stat fixed to Defense; Bloodwoven Signs (Critical Empowerment) corrected to Forte 1,276.</li>" +
      "<li><strong>Removed duplicate and broken gear entries.</strong> Two generic Arcane Conduit duplicates and four broken Bloodwoven entries were removed; the builder auto-updates any saved build that used the old names, so nothing breaks.</li>" +
      "<li><strong>Enchantments — Celestial Jade</strong> was listing Deflect Severity but actually gives Critical Avoidance (2,700 at Celestial). Corrected, so Jade now shows Critical Strike / Critical Avoidance / Outgoing Healing.</li>" +
      "<li><strong>Companions</strong> — Black Scorpion and 17 others were missing from the Summoned Buffs list and the Party Buffs picker; all added.</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-data'>Data</span></div>" +
      "<ul>" +
      "<li><strong>Masterwork +1 gear tiers added (IL 1,800).</strong> Shroomwood Amulet +1, Shroomwood Sash +1, Scintillant Sash +1, and Scintillant Amulet +1 — the refined-rank versions of the IL 1,700 pieces, completing the base/+1 set for all four. Plus the Darklake Ward Ring +1.</li>" +
      "<li><strong>Gear screenshot backlog cleared.</strong> Worked through the remaining in-game gear card screenshots and added every genuinely-new item — the Wizard Reinforced Dragonflight set, Duergar Wizard Orb and Talisman, Weathered Bracers of the Successor, the Wintermarked and Frostbound weapons, the Wintermarked Skirmisher armor set, the Stormforged Orb, and more.</li>" +
      "</ul>"
  },
  {
    date: "May 29, 2026",
    title: "Insignia Bonus Matching Fixes + Add Missing Enchantment",
    tags: ["Feature", "Fix", "Data"],
    body: "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-feature'>Feature</span></div>" +
      "<ul>" +
      "<li><strong>Fix the stat itself in the Toon Forge enchantment editor.</strong> The ✎ correction editor now lets you fix the stat name, not just its value. Each stat line in an enchant (Rating Stats, Percent Bonuses, and the Universal Offense/Defense/Utility stats) has a small ✎ on the stat name that opens a dropdown of the game's real stats. Pick the correct one and the value resets to 0 so you enter the right number — your build uses the corrected stat immediately, and a report is filed so we can fix it site-wide.</li>" +
      "<li><strong>+ Add Missing Enchantment in Toon Forge.</strong> The enchantment pickers (Offense / Defense / Utility / Combat / Bonus) now have a green <strong>+ Add Missing Enchantment</strong> button, matching the gear flow. If an enchantment isn't in our list, add it yourself — it slots into your build right away with its stats, and a report is filed so we can add it site-wide. The form adapts to the slot: Universal enchants capture per-slot stats, while Combat/Bonus enchants capture rating + percent stats and an optional effect description. Pending, approved, and declined submissions show in <strong>My Contributions</strong> and clean up automatically once reviewed.</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-fix'>Fix</span></div>" +
      "<ul>" +
      "<li><strong>Mounts — insignia bonus matching for 4-slot mounts.</strong> The old logic only ever checked the first 3 slots, which both hid valid bonuses and showed invalid ones. It now follows the real rule: a mount's fixed (locked) slots are mandatory, so every bonus must use them, while universal slots are optional fill. A mount with 4 locked slots can only form 4-insignia bonuses; a mount with universal slots lists exactly the bonuses it can actually build. Affects all 51 four-slot mounts.</li>" +
      "<li><strong>Toon Forge — bonus no longer turns off when you fill the 4th slot.</strong> A 3-insignia bonus on a 4-slot mount stayed active with 3 insignias but went inactive the moment you slotted a 4th, even though the extra insignia just adds stats. The builder now uses the same rule as the Mounts page: the bonus stays active as long as your fixed slots feed it and any leftover insignia sits in a universal slot. The bonus picker also now offers only bonuses a mount can actually run.</li>" +
      "<li><strong>Gear — Bulwark of the Eternal Zulkirate (Eternal Dominion Armor).</strong> Its Ruthless Might (Greater) buff (1.5% Critical Strike and Critical Severity per stack, up to 7.5% each at 5 stacks) was stored as text only, so the stat engine never counted it. It now applies correctly as a conditional in-combat buff.</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-data'>Data</span></div>" +
      "<ul>" +
      "<li><strong>Snowtusk insignia slots corrected</strong> to Regal / Illuminated / Universal / Universal (4th slot prefers Enlightened), verified in-game. Slots 3-4 were previously mis-recorded as locked Enlightened. Snowtusk now lists exactly its 5 three-insignia bonuses (Gladiator's Guile, Shepherd's Devotion, Wanderer's Fortune, Alchemist's Invigoration, Combatant's Maneuver) plus 7 four-insignia bonuses.</li>" +
      "</ul>"
  },
  {
    date: "May 29, 2026",
    title: "Toon Forge Auto-Save Fixed + Stackable Insignia Bonuses",
    tags: ["Feature", "Fix"],
    body: "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-feature'>Feature</span></div>" +
      "<ul>" +
      "<li><strong>Stable Planner — stack the same insignia bonus.</strong> You can now add the same insignia bonus to a loadout multiple times to plan stacked bonuses (like Ice Cold Aggression). Copies are capped at each bonus's max stacks (1× bonuses can't be duplicated) and at the 5-slot loadout limit; the picker greys out a bonus once its cap is reached.</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-fix'>Fix</span></div>" +
      "<ul>" +
      "<li><strong>Toon Forge now actually auto-saves your build.</strong> The \"Auto-saved\" label used to be cosmetic only — reloading the page or hitting the back button would wipe your work. Your current build now saves automatically as you edit and reloads when you come back, even after closing the tab. (Use <strong>📁 My Builds</strong> to keep multiple named builds.)</li>" +
      "</ul>"
  },
  {
    date: "May 28, 2026",
    title: "Ice Cold Aggression Insignia Requirement Updated (05/28 Patch)",
    tags: ["Fix"],
    body: "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-fix'>Fix</span></div>" +
      "<ul>" +
      "<li><strong>Ice Cold Aggression now requires Regal + Enlightened ×3.</strong> The 05/28/2026 game patch changed this insignia bonus's requirement from Regal / Illuminated / Enlightened / Enlightened to <strong>Regal / Enlightened / Enlightened / Enlightened</strong>. The Mounts page, the Insignia Calculator, and the Stable Planner all use the new requirement.</li>" +
      "<li><strong>Fewer mounts can run it now.</strong> Because the bonus no longer uses an Illuminated insignia, mounts with an Illuminated-locked slot (such as Bestial Fire Archon) can no longer assemble the full set on their own. The bonus filter correctly shows only the mounts whose slots can hold Regal + 3 Enlightened.</li>" +
      "</ul>"
  },
  {
    date: "May 26, 2026",
    title: "Add Missing Item in Toon Forge + Stable Planner Bonus Descriptions",
    tags: ["Feature", "Fix", "Data"],
    body: "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-feature'>Feature</span></div>" +
      "<ul>" +
      "<li><strong>+ Add Missing Item button in every Toon Forge gear picker.</strong> Found a piece of gear that isn't on the site? Open any gear slot, click the green <strong>+ Add Missing Item</strong> button at the top of the picker, and fill in a quick form: name, item level, Combined Rating, up to 6 stats (pick the stat name, type the +value), set name, in-game description, allowed classes (multi-select with an All toggle). The slot fills in automatically based on which picker you're in.</li>" +
      "<li><strong>Items work in your build immediately.</strong> Hit <strong>Add to my build</strong> — the item equips right away with the stats you entered, so you can keep building without waiting. Your submission is also sent to the team for review.</li>" +
      "<li><strong>Auto-cleanup when reviewed.</strong> When we add the verified item to the database (or decide it shouldn't be added), the next time you load Toon Forge your local placeholder is automatically cleaned up and your build switches to the verified version. No need to re-equip or re-add anything.</li>" +
      "<li><strong>📋 Your Submissions panel</strong> in the Toon Forge hero area lets you see exactly which submissions are still pending review, which have been added, and which were declined — with admin notes for the declined ones so you know why.</li>" +
      "<li><strong>Cleaner report formatting.</strong> Reports submitted via the ✎ correction pencil or the new + Add Missing Item button now read like plain English instead of dumping developer field paths and raw JSON. Easier for everyone (including us) to actually read.</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-fix'>Fix</span></div>" +
      "<ul>" +
      "<li><strong>Stable Planner — bonus descriptions everywhere.</strong> Two improvements to the insignia bonus UX:" +
        "<ul>" +
        "<li><strong>Picking a bonus:</strong> Clicking <strong>+ Add Bonus</strong> now opens a searchable popup where every bonus shows its name and full effect text side-by-side. Previously it was just a dropdown of cryptic names — no way for a new player to tell what each one did without picking blindly.</li>" +
        "<li><strong>After adding:</strong> Each selected bonus shows as a small card with the full effect text directly under the name. Always visible, works on desktop and mobile.</li>" +
        "</ul>" +
      "</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-data'>Data</span></div>" +
      "<ul>" +
      "<li><strong>Ranger weapons batch — 27 new entries</strong> across artifact and Masterwork sets: Pilgrim (Eyepiercer, Exalted Eyepiercer), Pioneer Alqaws, Primal Tlahuitolli, Tyrant (Woundsender), Trailblazer's Axes, Howling Longbow, Hammerstone Bow, Blessed Blade, Celestial Bow of Dignity, Masterwork II/III Ranger weapons, Chultan Wootz Kilij. Stats verified from in-game screenshots at multiple item levels.</li>" +
      "<li><strong>Warlock Jotunskar gear batch — 22 new Mod 33 items</strong> from Jotunskar (Master + Advanced) and The Biting Cold Campaign Store: 6 weapons in the Chilling Flow set (Wintermarked / Runefrost / Frostbound Grimoires + Pact Blades) and 16 Frostforged Warplate armor pieces — Hunter / Trail / Swift (Warlock + Wizard DPS) and Mender / Pilgrim (Warlock + Bard healer) variants. All stats and equip effects verified from in-game screenshots.</li>" +
      "</ul>"
  },
  {
    date: "May 25, 2026",
    title: "Major Data Pass — Gear, Feats, Set Bonuses, Optimizer Fixes",
    tags: ["Feature", "Fix", "Data"],
    body: "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-feature'>Feature</span></div>" +
      "<ul>" +
      "<li><strong>5 missing paragon feats added</strong> with descriptions read straight from in-game tooltips: Trip Attack (Fighter Dreadnought T1), Piercing Javelin and Tipping Scales (Cleric Arbiter), Shatter Strike and Frigid Winds (Wizard Thaumaturge). These feats existed in NW but were missing from Toon Forge entirely.</li>" +
      "<li><strong>Toon Forge correction submissions now validate.</strong> The data-correction form was accepting submissions where the player hadn't actually changed the value (form pre-filled both fields and got sent back unchanged). Now the form blocks zero-change submissions with a friendly \"that's the same value that's already there\" message.</li>" +
      "<li><strong>Set bonus descriptions visible on item cards.</strong> 312+ items across 27 different sets (Impending Doom, Whisper of Power, Celestial, Hellfire Engine Remains, Pioneer, Primal, Tyrant, Pilgrim, Skyhold Arms, Prismatic Defier of Dread, Devil's Legion, Blessed Blade, Dark Matter, Peer Into the Void, Meteoric Fury, Demonweb Empowerment, Duergar, Beholder Slayer, Living Magma, Stormforged, Blaspheme, Vale, Fortified Vale, Scalebreaker's Wrath, Grand Alliance, Sun, Vistani, Umbral Stride, plus more) now show their 2-piece set bonus text on the gear card.</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-fix'>Fix</span></div>" +
      "<ul>" +
      "<li><strong>Paragon feat tier ordering corrected across ALL 18 paragons.</strong> A viewer reported feat tiers were swapped for Warlock; turned out every paragon had ordering issues. All 9 classes × 2 paragons = 18 paragons verified in-game and reordered to match what you see when picking feats on your character. Highlights: Cleric Arbiter and Wizard Thaumaturge gained 2 missing feats each; Fighter Dreadnought gained 1; Barbarian Blademaster lost a stray feat (\"Raging Criticals\" — not a real Blademaster feat).</li>" +
      "<li><strong>~960 items now contribute their stats correctly to the optimizer.</strong> Hundreds of items had their stats silently dropped because the engine didn't recognize the stat name format. Tank, Deflect-stacking, and Control-Resist builds will see different (and correct) optimization results.</li>" +
      "<li><strong>Solar Band and Lunar Knot — double stat values now apply.</strong> Both rings show two stacking sources of the same stat in their tooltip but only half was counting. Solar Band now shows Deflect 6,000 (was 4,500); Lunar Knot Critical Severity 6,600 (was 4,950).</li>" +
      "<li><strong>7 Coldsilver Jotunskar rings (IL 5,700) fully updated</strong> — each ring now shows its unique equip effect (Deity's Gift, Manticore's Mane Bite, Accumulating Precision, Circular Healing, Charging Bull, Dashing Ranger, Maiden's Advantage), 4 stat misreads corrected, percent stats moved to the right field.</li>" +
      "<li><strong>Item stat misreads fixed:</strong> Strings of the Forsaken (Critical Severity at IL 3,400 and 4,100 + set assignment), Titansteel Lute IL 800 (Accuracy and Critical Strike), Bulwark of the Zulkirate (Critical Avoidance value verified), Vestments of the Crimson Magister (Combat Advantage + Control Bonus + Control Resist), Vistani Raiments (Critical Strike + Combat Advantage), Elemental Drowcraft Raid Wristguards (Accuracy + Combat Advantage + Defense), Ring of Orcus +1 through +5 (stat is Forte), 5 Bard weapons (missing third stat identified as Critical Strike), 6 Dominion tank pieces (\"Combat Resistance\" → Control Resist).</li>" +
      "<li><strong>Mount and companion notes panels cleaned up.</strong> Notes sections were leaking developer calibration trails (e.g., \"Stored at Mythic-125%-bolster baseline (3000). Re-verified 2026-05-20...\") into the user-visible Notes block. These developer audit sentences are now stripped from display; real game-info text (proc effects, magnitudes, slot info) still shows.</li>" +
      "<li><strong>Item name OCR corrections (35 fixes):</strong> Loithian → Lolthian, Cuises → Cuisses, Crystallex → Crystalflex, Glaves → Greaves, Bronerwood → Bronzewood, Chinibii → Chinibili, Omibuitsili → Omihuiclli, Tecpail → Tecpatl, Preaches → Breeches, plus the Veinlit set (three OCR variants consolidated). Also fixed Luremaster → Loremaster (Bard Songblade feat).</li>" +
      "<li><strong>5 mounts — insignia slots fixed:</strong> Ornate Apparatus of Gond, Red-Hued Apparatus of Gond, Carmine Bulette, Sienna Tribal Lion, Blueforged Rage Drake were showing no valid insignia types in the slot calculator. Their universal slots now work.</li>" +
      "<li><strong>Two Pact Blade items</strong> (Durgarrn Thord Pactblade, Earthen Pact Blade) had garbled arrow symbols in their description text. Fixed.</li>" +
      "<li><strong>Companion \"Rothé\" name display fixed</strong> — was rendering as \"RothÃ©\" in some browsers due to a double-encoded character.</li>" +
      "<li><strong>Reports page — three improvements:</strong> admin status changes now refresh the list immediately (no manual reload); a shadow variable bug in the sort logic was breaking ordering; reports awaiting admin review now show \"Replies open once an admin has reviewed this report.\" instead of a blank reply area.</li>" +
      "<li><strong>Insignia Tracker page</strong> was incorrectly highlighting \"Creators & Tools\" in the nav bar. Fixed.</li>" +
      "<li><strong>Stat name display</strong> — internal stat names like \"CriticalStrike\" and \"MaximumHitPoints\" now render as \"Critical Strike\" and \"Maximum Hit Points\" throughout the site.</li>" +
      "<li><strong>83 duplicate gear entries removed.</strong> Some items had been entered twice from separate screenshot sessions. Less-complete copies removed; more-complete versions (with set bonus info and class restrictions) kept.</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-data'>Data</span></div>" +
      "<ul>" +
      "<li><strong>Gear database expanded by ~376 net new items.</strong> Major intake pass covering bard, warlock (current + legacy), and rogue gear from screenshot batches. Highlights:" +
        "<ul>" +
        "<li><strong>Bard:</strong> Strings of the Forsaken (IL 3,400 / 4,100 / 4,800), Bismuth Lute, Bloodbrass Lute, Solarium and Xaryxian Rapier variants, full Howling / Earthen / Burning / Drowned Bard artifact sets, Woote Jambiya and Lute variants (IL 350–800), Shadesinger's Rapier and Lute.</li>" +
        "<li><strong>Warlock:</strong> Curseford's Raid + Assault 8-piece armor set (IL 770), Codex of Eternal Chains at IL 3,400 / 3,750 / 4,100 (previously only IL 4,800), Bronzewood Quauhololli / Tlahuitolli weapon set, Mirage / Fey / Lifeforged / Aboleth / Hexweaver Pact Blade and Grimoire variants, Dusk Raid + Assault armor at IL 1,375.</li>" +
        "<li><strong>Rogue:</strong> Lionsmane Stronghold armor (Duelist + Executioner sets), Trapper of the Twilight / Stealer of the Star / Mugger of the Maze 3-set armor at IL 3,000, Nightspiercer Dagger of the Thayan Zealot, Lolthian set, Primal Omihuiclli weapon variants.</li>" +
        "<li><strong>High-end:</strong> Coldsilver Jotunskar rings (IL 5,700, all 7 variants with full equip effects), Celestial Bow of Dignity and Celestial Steel of Grace (IL 650–1,400), Manticore Raid/Duelist gear.</li>" +
        "<li><strong>Low-IL variants:</strong> Hammerstone full set at IL 152, Elk Tribe Noble's weapons at IL 199 — so early-game characters can find appropriate gear in Toon Forge.</li>" +
        "</ul>" +
      "</li>" +
      "<li><strong>Enchant stat names normalized</strong> (21 universal enchants, 70 stat entries) — now consistently Title Case to match gear and other data.</li>" +
      "<li><strong>Schema cleanup:</strong> 44 entries unified — \"Off-hand\" → \"Off Hand\" and \"Waist\" → \"Belt\" — so Toon Forge's slot filter behaves consistently.</li>" +
      "</ul>"
  },
  {
    date: "May 6, 2026",
    title: "Stable Planner Fix + Site-Wide Polish Pass",
    tags: ["Fix", "Data"],
    body: "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-fix'>Fix</span></div>" +
      "<ul>" +
      "<li><strong>Stable Planner — Insignia Sharing Plan now reuses mounts across loadouts.</strong> Previously, if a mount was picked for one bonus (e.g., Crimson Crystal Horse for Cautious Devotion in a Healer loadout), the planner refused to suggest it for a different bonus in another loadout (e.g., Guardian's Spirit in a Tank loadout) — even though only one loadout is active at a time. The planner now actively prefers reusing already-picked mounts across loadouts (saves you from owning a separate mount for every bonus) and marks those picks with a green \"shared\" badge. A mount only conflicts if it's already picked for a different bonus <em>in the same loadout</em>.</li>" +
      "<li><strong>Resolved 5 orphan companion power references</strong> — Phasespider, Celeste, Harper Bard, Riotous Rothé, and Armored Orc Wolf all referenced power entries that didn't exist. The 5 missing powers are now in the database with full stat data sourced from NW Hub click-through tooltips: Phasespider's Presence (Defense, 4.5% Crit/CA), Celeste's Wisdom (Utility, 20% heal-on-low-HP proc), Bard's Discipline (Defense+Utility, 18,000 Max HP / 4.5% Awareness), Snow Worries (Defense+Utility, 9% Incoming Healing), Orc Wolf's Instincts (Offense, 4.5% Accuracy/Crit).</li>" +
      "<li><strong>Filled in stat data for 7 companion powers</strong> that previously had IL 0 and zero stat values: Wolf's Instincts (9% Crit Severity), Damaran Shepherd's Instincts (4.5%/4.5% Crit Strike + Crit Avoidance), Feywild Sylph's Insight, Cryptic Insight, Cambion's Insight, Dancing Blade's Insight, Maestro's Observation. Stat names corrected on 3 entries where the placeholders had wrong names.</li>" +
      "<li>Removed 2 broken mount image references that pointed to missing files (Aberrant Drake, Aberrant Fey Wolf) — those mounts now render without a broken-image icon.</li>" +
      "<li>Renamed companion id 76 from \"Stag\" placeholder to \"Festive Tiger\" (in-game verified).</li>" +
      "<li>Visual polish: card padding standardized across all pages, consumables search input now uses the shared style, table header font sizes unified, hardcoded border-radius values replaced with the design-system variable, section-header padding consolidated.</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-data'>Data</span></div>" +
      "<ul>" +
      "<li><strong>Companion sources — 100% coverage.</strong> Backfilled real source data for 11 companions that were missing it: Tutor (Astral Lockbox), Cantankerous Mage (Random queue / 2013 Zen Market), Lysaera (Phantasmal Fantasy Lockbox), Soradiel (Mod 19 Redeemed Citadel Zen Market), Kingfisher Intern (Astral Lockbox post-Mod 26), Archmage's Apprentice (Newegg/Razer promo code), Crimson Crystal Golem (Protector's Jubilee 12-yr), Proud Pink Yeti (Hugs and Kisses Valentine's), Coldlight Walker (Simril's Winter Festival), Little White (Rothé Valley adventure), Festive Tiger (formerly Stag).</li>" +
      "<li><strong>Mount sources — 98% coverage</strong> (up from ~59%). Backfilled source data for 100+ mounts. Highlights: 4 Zen Market 4-insignia slot mounts (Armored Pale Horse, Maltese Tiger, Red Dragon Wings, Golden Rage Drake); 5 horse variants from the Mysterious Crystal Charger; the Day of the Dungeon Master event mounts (Balgora, Beholder Personal Tank); Cavalry's Mount Pack family (Heavy Inferno Nightmare, Hell Emblazon Worg, Poisonous Looking Spider); Abolethic Mount Pack family (Heavy Twilight Nightmare, Sylvan Stag, Shadow Wolf); the Atramentous and Lolthian Choice Pack pairs (Deadly Driderform, Ebon Riding Lizard); recent additions like Twice-Pale Alder, Neverwinter's Hand, Red Mountain Fox, Sunscorch Rune Board, Regal Cobra; and dozens of campaign/event sources verified.</li>" +
      "<li>Trimmed 1,153 orphan image files (~59 MB) from local disk that were never referenced by anything. Repo footprint smaller; nothing user-visible removed.</li>" +
      "<li>Verified 21 mount combat powers with magnitude=0 are legitimately status-only effects (debuffs, shields, stuns) — not placeholders.</li>" +
      "</ul>"
  },
  {
    date: "May 4, 2026",
    title: "Stable Planner, Insignias Reference + Combat Formulas",
    tags: ["Feature", "Fix", "Data"],
    body: "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-feature'>Feature</span></div>" +
      "<ul>" +
      "<li>New <strong>Stable Planner</strong> tab on the Mounts page: define your loadouts (name + role + desired insignia bonuses) and the planner finds every mount whose 4 (or 3) slots can host each bonus. Mounts where a preferred slot can be filled with its preferred type are listed first. The Sharing Plan summary tells you exactly which mounts to pick across loadouts to stop upgrading duplicate insignias — with a concrete \"save N upgrades\" estimate per bonus. Per-mount exclude (× to skip mounts you don't own — picks the next best). Saved per browser via localStorage.</li>" +
      "<li>New <strong>Insignias</strong> tab on the Mounts page: browseable reference of all 16 stat templates × 6 quality tiers (Uncommon → Celestial), with stats auto-scaled per tier and slot-type badges showing which insignia categories carry each template. Filter by name, quality, or slot type. Cross-checked against external sources — every value verified.</li>" +
      "<li>Mount detail panel now shows compatible bonuses with their required insignias <strong>in slot order</strong> (matching the mount's actual slot layout) instead of canonical order. Makes it visible at a glance which slot each insignia would land in.</li>" +
      "<li>Gold ★ markers on bonuses that activate a preferred slot (+20% IL & stats), and on slot boxes themselves with a preferred type. Tooltips on hover.</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-fix'>Fix</span></div>" +
      "<ul>" +
      "<li>Fixed mount name typo: \"Legendary Barigura\" → \"Legendary Barlgura\" (matches the regular Barlgura spelling and D&D source).</li>" +
      "<li>Mekaniks: corrected 3 wrong rows in the Forte distribution table — Cleric Arbiter primary (Divinity Regen → Power), Fighter Vanguard secondaries (CritStrike/DeflectSev → Accuracy/CritAvoid), Paladin Oathkeeper secondaries (Accuracy/Awareness → CritStrike/DeflectSev).</li>" +
      "<li>Mekaniks: removed incorrect \"At 0 rating: ~45% base\" line from the Rating-to-Percentage card (formula returns 0%/clamped at 0 rating, not 45%).</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-data'>Data</span></div>" +
      "<ul>" +
      "<li>Mekaniks: added <strong>Control Bonus</strong> and <strong>Control Resist</strong> as full stat cards under a new \"Control Stats\" section.</li>" +
      "<li>Mekaniks: rating cap vs. total cap distinction now explained — rating contribution alone caps at 50% (for 90% stats) or 60% (for 120% stats); the rest comes from non-rating sources.</li>" +
      "<li>Mekaniks: documented Forte's special property of <strong>bypassing individual rating caps</strong> (contributes directly to total percentage).</li>" +
      "<li>Mekaniks: added \"1 IL ≈ 15 stat rating points\" rule of thumb and a worked rating-to-percent example.</li>" +
      "<li>Mekaniks: new <strong>Base Damage & Base HP by Role</strong> card on the Damage tab, showing the inverted role multipliers (DPS ×1.2 dmg / ×1.0 HP, Healer ×1.1 / ×1.1, Tank ×1.0 / ×1.2).</li>" +
      "<li>Mekaniks: renamed the <strong>Damage</strong> tab to <strong>Combat Formulas</strong> and added three theorycraft cards (collapsed by default): <strong>Full Expected-Value Damage Formula</strong> (13-term formula with variable glossary; insights on CA uptime, multiplicative damage-boost categories, additive within-category bonuses), <strong>Full Expected-Value Healing Formula</strong> (6-term formula with healer crit-severity penalty ÷2; insights on heals not reduced by defensive stats, IH stacking on tanks, Power/OH balance), and <strong>Full Expected-Value EHP Formula</strong> (defender's mirror with three EHP cases Min/Avg/Max; insights on multiplicative defensive stat compounding, Awareness vs Defense above 45%, Crit Avoidance preventing tank one-shots, stat investment beating flat HP at scale).</li>" +
      "</ul>"
  },
  {
    date: "May 2, 2026",
    title: "Mod 33 Preview, Dungeon Guides + New Tools",
    tags: ["Feature", "Fix", "Data"],
    body: "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-feature'>Feature</span></div>" +
      "<ul>" +
      "<li>Added <strong>Mod 33 Preview page</strong>: rotating section for upcoming module content (gear, companions, mounts) with lightbox for full-size screenshots</li>" +
      "<li>Added Content Roadmap banner to home page linking to the Mod 33 preview</li>" +
      "<li>Added Mod 33 Warlock preview gear, grouped by slot with filterable buttons</li>" +
      "<li>Added <strong>Dungeons tab to the Mekaniks page</strong>: embedded video guide system for trials and dungeons</li>" +
      "<li>Added <strong>Creators & Tools page</strong>: friends and community members making Neverwinter content, tools, and resources</li>" +
      "<li>Added <strong>Celestial Insignia Tracker</strong> tool under Creators & Tools: track every non-Celestial-Account-Bound insignia across your roster and see which to upgrade first for maximum payoff (saved to browser with export/import backup)</li>" +
      "<li>Added per-rarity proc-chance scaling to companion powers — Chance line on the detail panel now updates with the selected rarity</li>" +
      "<li>Added insignia bonus stacking badges to the mount page (Report #21)</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-fix'>Fix</span></div>" +
      "<ul>" +
      "<li>Fixed Blue Fire Eye: power was incorrectly showing Movement Speed, corrected to damage versus Kabal's minions with full rarity scaling (Report #22)</li>" +
      "<li>Fixed Abyssal Guidance: chance to summon Abyssal Chicken now scales with rarity (1.50%/3.00%/5.00%/7.50%/11.00%/15.00%/18.00%) instead of a flat 2.5%</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-data'>Data</span></div>" +
      "<ul>" +
      "<li>Added 13 dungeon/trial video walkthroughs: Vault of Stars Maze (Mod 20), Crown of Keldegonn (Master) (Mod 22), Rise of Tiamat (Mod 23), Temple of the Spider (Master) (Mod 24), Defense of the Moondancer (Mod 27), Demogorgon (Master), Soul Harvest, Shackles of Divinity, Dread Sanctum, Lair of the Mad Dragon, Imperial Citadel, Demonweb Pits, Gzemnid's Reliquary</li>" +
      "<li>Added Mod 33 preview content: upcoming companions, mounts, and Warlock gear screenshots</li>" +
      "</ul>"
  },
  {
    date: "March 28, 2026",
    title: "Bug Reports Resolved + New Data",
    tags: ["Feature", "Fix", "Data"],
    body: "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-feature'>Feature</span></div>" +
      "<ul>" +
      "<li>Companion proc effects now scale with rarity (heal %, magnitude, etc. update when switching rarity)</li>" +
      "<li>Rarity selector now shows on all companion powers, not just stat-scaling ones</li>" +
      "<li>Admin notes on reports: admins can post status updates visible to everyone</li>" +
      "<li>Community replies on reports: when admin requests help, users can reply with text and screenshots</li>" +
      "<li>Added collaboration contact email to site footer</li>" +
      "<li>Renamed YouTube links to The N00bin Network / Join on YouTube</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-fix'>Fix</span></div>" +
      "<ul>" +
      "<li>Fixed Hank's Aim: magnitude scales 30x single stat, was incorrectly listed as fixed 225 (Report #3)</li>" +
      "<li>Fixed Elminster's Chain Lightning: scales 10x/2x single stat, old values 66/16.5 were wrong (Report #7)</li>" +
      "<li>Fixed Doom and Bloom: heal % scales ~3.33x single stat, was showing 10% at all rarities (Report #10)</li>" +
      "<li>Confirmed Ox Stot, Chickenmancer, Eric the Cavalier as intentionally fixed effects (Reports #6, #8, #9)</li>" +
      "<li>Fixed Ox Stot base rarity from Mythic to Uncommon (was showing wrong rarity buttons)</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-data'>Data</span></div>" +
      "<ul>" +
      "<li>Added mount: Cactus the Hedgehog (Vigilance + Stabby Stabs) (Report #19)</li>" +
      "<li>Added 6 companions: Soradiel, Kingfisher Intern, Elite Intern, Archmage's Apprentice, Crimson Crystal Golem, Proud Pink Yeti (Report #18)</li>" +
      "<li>Added new enhancement: Deflecting Shards (Accuracy + companion Crit Avoidance)</li>" +
      "</ul>"
  },
  {
    date: "March 27, 2026",
    title: "Major Site Update",
    tags: ["Feature", "Fix", "Data"],
    body: "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-feature'>Feature</span></div>" +
      "<ul>" +
      "<li>Added companion rarity scaling system (Common through Celestial) with rarity selector buttons</li>" +
      "<li>Added 4-Slot Only filter for mounts</li>" +
      "<li>Reports page: Active/Resolved split, In Progress priority sorting, resolved reports can't be upvoted</li>" +
      "<li>Added admin delete button for reports</li>" +
      "<li>Mounts list now sorted alphabetically</li>" +
      "<li>Added artifact icons to All Artifacts list view</li>" +
      "<li>Added News tab on the landing page</li>" +
      "<li>Added YouTube and N00bin Network links across the site</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-fix'>Fix</span></div>" +
      "<ul>" +
      "<li>Fixed insignia bonus matching: 3-slot bonuses now correctly check only the first 3 mount slots (Report #13)</li>" +
      "<li>Fixed multiple mount insignia slot and preferred data errors (Maltese Tiger, Demonic Gravehound, Red Mountain Fox, Space Guppy School, Brain Stealer Dragon, Phantom Panther, Golden Rage Drake, Pink Yeti, Golden Goose)</li>" +
      "<li>Removed Vision of Lolth from artifacts (it's a mount combat power)</li>" +
      "<li>Removed duplicate Fire Eye companion (was Blue Fire Eye)</li>" +
      "<li>Fixed Phasespider power assignment and added Little White companion</li>" +
      "<li>Fixed Celeste power: was Divine Answers, now Celeste's Wisdom</li>" +
      "<li>Fixed multiple companion name errors (Wailer, Portalerhound, Undying Overbound, etc.)</li>" +
      "</ul>" +
      "<div style='margin-top:0.5rem;'><span class='news-tag news-tag-data'>Data</span></div>" +
      "<ul>" +
      "<li>Filled in power data for all 256 companions</li>" +
      "<li>Added 177 companion sources</li>" +
      "<li>Added all 28 companion enhancement icons</li>" +
      "<li>Added 241 companion icons</li>" +
      "<li>Added 92+ artifact icons and 50+ consumable icons</li>" +
      "<li>Added 4 new Mod 26 artifacts: Demon Skull, Nightflame Censer, Marilith Mask, Xeleth's Blast Scepter</li>" +
      "<li>Added new companions: Demonic Servant, Little White</li>" +
      "<li>Added new mount: Balgora (Hell's Impact + Seeing Red)</li>" +
      "<li>Added 9 new foods including Menzoberranzan vendor foods</li>" +
      "<li>Expanded Campaign Boosters page with 10+ new entries including Gravity Orb gadget</li>" +
      "</ul>"
  }
];
