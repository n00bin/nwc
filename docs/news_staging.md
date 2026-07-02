# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

(Last published June 23, 2026: "Providence & Cavalry Mount Fixes, Group-Stacking Toggles & Add-Missing Collar")

## Week of 2026-06-23 (since last publish)

### Features
- **Toon Forge — "Assume support party" toggle.** New switch in the Party Buffs
  section makes your build account for the support companions your allies bring
  (Tutor, Flapjack, Portobello DaVinci, etc.). Off by default — matches the
  Part-of-the-Pack and Providence group toggles. A **Fill standard set** button
  loads the common support trio in one click, all editable, and you can slot any
  party-buff companion you like. When off, the ally slots are dimmed and
  contribute nothing.
- **Mounts — combat powers now shown at Celestial (max tier) with a Mythic toggle.**
  Mount combat-power values now display at **Celestial** by default — what an endgame
  account actually sees — with a **Mythic ⇄ Celestial** toggle on each mount's detail.
  Previously the page showed a fixed lower-tier number that never matched the game.
- **Enchantments — pick the tier you own.** Every enchantment is stored at its top
  rank (Celestial); the enchantment picker now has a **"Tier you own"** dropdown
  (Uncommon → Celestial). Set it to your rank and the name, item level, and stat
  values all update to match — e.g. **Mythic Citrine**, **Mythic Companion**. Picking
  an enchant adds it at that tier, and the quick dropdown on each slot stays in sync.
  Works for both character and companion enchantments. (Reports #164 & #165.)

### Bug Fixes
- **Toon Forge — Paladin healer and tank no longer blend together.** Paladin's
  two paths were bleeding into each other everywhere: a **Justicar** (tank) was
  offered Oathkeeper healing powers (Cure Wounds, Lay on Hands, Divine Shelter…)
  in the At-Will/Encounter/Daily pickers, and the Mechanics panel showed **both**
  paths' mechanics at once (both Fortes, Hand of Divinity next to Divine
  Champion). Every power list is now scoped to your selected paragon path — a
  Justicar sees only tank powers and mechanics, an Oathkeeper only healer ones.
  Also verified from the in-game Powers screens that **Channel Divinity is the
  Oathkeeper's mechanic** (the Justicar's R1 mechanic is Divine Champion) and
  split Sacred Weapon correctly per path.
- **Toon Forge — Justicar was missing its shared class features.** The Justicar
  class-feature picker only offered its 4 paragon-exclusive features. Added the
  4 features it shares with Oathkeeper (**Aura of Protection, Blessed Wanderer,
  Composure, Aura of Wrath**) — confirmed from the Justicar's own Powers screen,
  where they appear (and Aura of Protection is Active).
- **Toon Forge — Soulweaver's shared class features were unpickable.** The
  class-feature picker was hiding the 4 features Soulweaver shares with
  Hellbringer (**Flames of Empowerment, Dark One's Blessing, Dust to Dust,
  Shadow Walk** — the last two carry real stats), so a Soulweaver could only
  ever slot its 4 path-exclusive features. All 8 now show, matching the
  in-game Class Feature row.
- **Toon Forge — Barbarian Blademaster rotation powers now score.** Duplicate
  copies of Blademaster's powers (stored in two places in the data) meant the
  rotation model read the stale copy with no cooldown, so Battle Fury, Roar,
  Frenzy, Hidden Daggers and Axestorm contributed **zero** to rotation
  throughput and the pickers listed them twice. The duplicates now collapse to
  the correct copy, Sentinel no longer sees Blademaster-only powers, and each
  Ranger path shows exactly one Forte.
- **Toon Forge — healers now get credit for Recharge Speed.** The healing
  throughput model counted your class resource (Divinity/Soul Weave pool and
  regen) but ignored Recharge Speed entirely — two healer items differing only
  in Recharge Speed scored a flat tie, even though shorter encounter cooldowns
  mean more heals per fight. Recharge Speed now raises healing throughput
  (weighted at half, since heals are also resource-limited), in the simulator
  and the optimizer. Also hardened the stat engine against proc-chance typos
  (a bad "chance %" in data can no longer poison a stat with NaN) and fixed a
  stale-cache case when changing an artifact's owned tier on shared builds.
- **Toon Forge — flat Max HP gear bonuses were being read as percentages.**
  Six items whose equip bonus grants flat Maximum Hit Points (Garb of the
  Ascended's +15,000, and five Pioneer helmets' +1,000) were ingested as
  +15,000% / +1,000% Max HP. On the stat panel this only showed if you
  equipped one, but the build optimizer's new tank scoring found it
  immediately — recommending Garb of the Ascended on every tank and reporting
  194 million hit points. Flat pool amounts now ride the same channel as
  ratings everywhere (engine scoring and item cards), and the tank optimizer
  was re-validated end-to-end for the first time: it now assembles a real
  mitigation build (Defense/Deflect Severity capped, −35% incoming damage,
  ~2.9M effective HP) instead of chasing the phantom hit points.
- **Toon Forge — Master boons corrected against live in-game tooltips (and the
  boon point cap is 132).** Three master-boon tooltips (Deathly Rage, Death's
  Bulwark, Blessed Advantage) settled how these actually work: each rank
  UNLOCKS its own effect (rank 1: Combat Advantage, rank 2: Power, rank 3:
  Critical Severity), and every unlocked effect then grows with your total
  ranks — so a rank-3 master gives all three at full strength, but a rank-1
  master gives only its first effect. The engine and optimizer now model
  exactly that. Also corrected from the same screenshots: **Blessed
  Advantage** procs at **10%** (not 20%) and its rank-3 grants **5% Recharge
  Speed per rank** (we had 2%); **Death's Bulwark** shares Deathly Rage's
  30% chance and dual trigger; **master ranks unlock at 10/30/60 total
  points spent** (not 100 — you can start ranking masters far earlier);
  **Advanced-tier boons cost 2 points each**, which the spent counter now
  counts correctly; and the total budget is **132**, matching the current
  campaign list.
- **Data — five "sheet-only" endgame items verified against tooltips.**
  Vambraces of the Bloodforged Edict, Aegis of the Bloodwrought Covenant,
  Bloodwoven Symbols (Graceful Harmony), Nightflame Censer, and Demon Skull
  all matched their in-game tooltips exactly — except one fix: the Vambraces'
  Resourceful Healer bonus raises your class-resource **maximum** by 20% (we
  had it as resource regen). Healer builds now credit that correctly as more
  casts per fight.
- **Toon Forge — campaign boons: over-cap warning + smarter optimizer handling.**
  The boons panel now flags in red when you've allocated more points than the
  maximum we have on record (130), instead of silently accepting any number —
  if a new campaign raised the in-game cap, report it and we'll update the data.
  Behind the scenes the build optimizer also stopped two bad boon habits: it no
  longer trims points off builds that have more than the recorded cap (your
  points are never removed), and the ~100 "filler" points it spends climbing to
  the Master tier now go into stats that fit your role — a healer gets Max HP
  and healing stats instead of leftovers like Gold Gain or single-enemy-family
  boons.
- **Toon Forge — healer math now matches the game's own Overall Outgoing Healing rule.**
  The in-game tooltip defines the Overall Outgoing Healing boost as your Outgoing
  Healing stat **plus** any other healing modifiers — one combined bonus (e.g.
  105.3% + 6% = +111.3%, verified against an in-game Oathkeeper panel). The heal
  simulator was applying them as two separate multipliers instead, which slightly
  inflated per-cast heals and made the optimizer over-value "Overall Outgoing
  Healing" gear/set bonuses (they looked ~2× as good as they really are at
  endgame). Healing now uses the game's additive rule, so healer optimizer picks
  shift a little toward Power and Critical Severity — matching what actually
  heals harder in game.
- **Stable Planner — mounts with preferred slots are now recommended first.**
  The planner's help text always promised that ★ mounts (preferred slot filled
  with its preferred type = +20% item level & stats on that insignia) are listed
  first — but two different sorting rules could bury them. For every 3-insignia
  bonus, plain 3-slot mounts outranked the ★ mounts, so the ★ pick never
  appeared (e.g. **Gladiator's Guile** now recommends **Snowtusk ★** instead of
  a starless 3-slot mount). And when a mount was already recommended for a
  bonus in another loadout, "reuse that mount" outranked ★ too — e.g. with
  bonuses in two loadouts, **Tactician's Precision** recommended a starless
  Bestial Fire Archon over **Snowtusk ★**. Preferred-slot mounts now genuinely
  come first; reusing a mount across loadouts only breaks ties between equally
  starred picks. Also, if the only mount that can activate a bonus's preferred
  slot is one you've excluded, the plan now says so — instead of silently
  recommending a lesser pick — and hovering the ★ explains what it means.
  All **6 upgrade ranks** (IL 3,400–5,250) are now in the database for **both** the main
  hand and off hand, with accurate set bonuses. The always-on bonus is a flat **+7,700
  Critical Severity** at the lowest ranks and converts to **percentages** higher up (up to
  **+9% Critical Severity / +5% Power**), and the Unleashed charge bonus scales **+3% → +5%
  Base Damage Boost**. The full Unleashed charge mechanic is now shown, and the item tier
  (Artifact Equipment) — which was blank — is fixed. (Report #166.)
- **Jotunskar Paladin gear — translated a German report, added a missing pants + fixed a slot.**
  A player reported two pieces in German. Translated and resolved: added the missing
  **Veinlit Lifebraid Vestment** (pants — *Charged Rejuvenation*: +4.5% Recharge Speed
  when healed in combat), and corrected **Runemarked Dawnshard Raiment** from pants to
  **shirt**. (The third, "Veinlit Dawnshard Raiment," was already in the database as the
  pants.) Reports #162 & #163.
- **Toon Forge — optimizer no longer always picks Tiefling.** A racial trait that
  only works part of the time (Tiefling's **Bloodhunt**, *+5% damage to targets
  below 50% HP*) was being counted as if it were on for the whole fight. That made
  Tiefling look like a permanent +5% damage no other race could match, so the
  optimizer chose it every time. Racial traits with a condition now use the same
  uptime model gear already uses — Bloodhunt now counts as its real execute-window
  value (~0.75%), so race is judged on its actual benefit. (Aasimar's party-aura
  trait is likewise weighted; always-on racials are unchanged.)
- **Cracked Dawnshard Raiment — fixed wrong stat & equip bonus (healer pants).**
  This Jotunskar item-level 4,600 piece was showing a DPS profile by mistake
  (Action Point Gain + an "Occult Advantage" +9% Critical Severity / −5% Defense
  bonus). The real item is a **healer** piece — corrected to **1.5% Stamina
  Regeneration** and a single **Rested Healing** bonus (*when your Stamina is over
  75%, your Outgoing Healing is increased by 7.5%*). Verified against an in-game
  screenshot. (Reports #155–#159.)
- **Mount combat-power values were stuck at lower rarities.** Six mounts had their
  combat-power numbers captured at a lower tier (Dragonbone Golem, Frost Salamander,
  Legendary Giant Toad, Legendary Carpet of Flying, Cosmos Stag, Radiant Rune Board)
  and now scale correctly. **Ethereal Vortex** (Twice-Pale Alder) now reads **20.7%**
  at Celestial instead of 16%. Verified against in-game screenshots. (Reports #160 & #161.)
- **Detector's set (Unstable Drive) was double-counted.** The Detector's Choker
  listed its "Unstable Scan" bonus twice in the data, so the engine applied
  **14% Combat Advantage / Forte / Outgoing Healing instead of 7%**. Removed the
  duplicate so the set now shows its true value. (This was also making the build
  optimizer over-favor the set.)
- **Removed a duplicate companion.** "Golden Bulette" and "Golden Bulette Pup"
  were the same companion entered twice (once at Mythic 7.5% Outgoing Healing,
  once at Celestial 9%). Merged into **Golden Bulette Pup** — choose Celestial
  rarity for the 9% value.
- **Bard weapons — Celestial Dirgeblade added + Impending Doom set fixed.** Added
  the missing item-level 5,250 (Celestial) Dirgeblade, and corrected the Impending
  Doom 2-piece set bonus on the Bard weapons (Dirgeblade + Strings of the Forsaken):
  now **+5% Power and +7.5% Critical Strike** (was 2.5% Power / wrong crit stat).
  Also fixed the item-level 3,400 Strings, which was mislabeled — at that tier the
  set is **Whisper of Power**, not Impending Doom. (Report #151.)
- **Impending Doom weapon sets — fixed per class (were all identical).** Every
  class's Mod 27 weapon set had the same wrong bonus stamped on it. Re-read each
  from in-game screenshots: each class now has its **own** correct set bonus —
  e.g. **Ranger** = Crit Strike + Accuracy, **Barbarian/Fighter** = Power +
  (Crit Severity / Combat Advantage) with a Tank mitigation, **Paladin** = Forte
  + Defense (Tank/Heal), **Bard/Warlock** add a Heal bonus, **Rogue** = Accuracy
  + Power. 8 of 9 classes done (89 weapon entries); only Cleric is left, pending
  its captures.
