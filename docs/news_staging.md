# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

## Week of July 5, 2026

(Last published July 8, 2026: "The Great Data Trust Sweep: Every Database Audited, 60+ Fixes")

### Features
- Currency Tracker: added a **− Spent** button — record currency you spent without touching your weekly-earned total.

### Bug Fixes
- The optimizer now understands combat powers that buff YOU. Powers like Mighty Dragon's Roar (+15% Base Damage Boost / Critical Strike / Accuracy, no direct hit) used to score near-zero because the model only credited direct damage — so a genuinely strong pure-buff power looked worthless. It's now valued cap-aware: an uncapped buff like Base Damage Boost counts in full, while a Critical Strike buff is worth a lot below your cap and nothing once you're capped (no wasted overcap). Verified against the live builder, and the picks it already got right (Wicked Lich over bigger no-buff powers) still hold.
- Tank builds now get credit for defensive combat powers too. A power like Skyhold Alligator's Bellow (-15% Incoming Damage while it's active) used to score as if it did nothing for survivability — now it properly lowers your expected damage taken. Same cap-aware treatment as above for self Defense/Awareness/Critical Avoidance buffs (won't overcredit a stat you're already capped on) and self Max HP% buffs, so the optimizer can now recognize when a defensive mount power is worth equipping.
- Mount combat-power self-heals now count toward survivability: the Golden Rage Drake / Celestial Dragonnel's Rejuvenating Favor (heal 20% of Max HP over 10s, per 60s) was stored under a stat name the engine didn't recognize and contributed nothing — it now feeds the self-sustain/Tank survivability model (not the healer output score, per the standing convention).
- Three always-on potions you could never toggle before now appear in the buff list: Potion of Giant Strength, Potion of Speed, and Minor Potion of Heroism (they carry real stats and last long enough to count).
- 63 more items now score in Toon Forge: a first-ever full census found items whose stat effects existed only as tooltip text (the same "invisible to the optimizer" issue as the Lifebraid shirt). The cleanly-parseable ones are now structured — the Bloodwoven 2-piece sets, the Company belt set, Chilling Flow's Wintermarked role-stacking shield, the Enchanted accessory sets, and ~55 individual items.
- Life Lessons (master boon) corrected against its live tooltip: its trigger is a 10% chance (the model had assumed 20%, doubling its effect), and its Rank 3 returns 10% of damage as a heal per rank (was 15%).
- Celestial Lightning Flash verified at max rank: its damage bonus is 12% (a long-standing stored 24% is corrected), and its Accuracy/Critical Strike are Lightning Charge stacks (3.6% × 3), which is what its full-stack value already reflected.
- Combat-power detail pages: two Thayan Zealot weapons (Doomscript Grimoire, Profaned Pact Blade) had their Tank and Healer role bonuses shown swapped — corrected.

- Tenser's Floating Disk was showing the wrong combat power — our data had it granting Rejuvenating Favor (a healing power that actually belongs to the Golden Rage Drake) instead of its real Tenser's Transformation (+15% Base Damage Boost / Movement Speed). Fixed, and the correct power now feeds the optimizer's combat-power valuation.

### Data
- Confirmed that same-name gear which differs by class (e.g. Hammerstone Mask for Warlocks vs Hammerstone Helmet for Paladins/Fighters — same slot and item level, different secondary stats) is **intentional per-class itemization**, not duplicate data. Those variants are all kept.
