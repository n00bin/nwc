# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

## Week of July 5, 2026

(Last published July 9, 2026: "New Combat Enchantments, Smarter Combat-Power Scoring & Ollie the Octie")

### Features
- **Mounts page: one power-tier toggle for the whole mount** — The mount detail panel now has a single "Power tier" toggle (Mythic / Celestial, defaults to Celestial) that scales BOTH the Combat Power and Equip Power sections at once. Previously only Combat Power had a toggle and Equip Power always showed its Mythic base — so a Celestial mount's equip stats now display their real max-tier values (item level, Combined Rating, and stats like Max HP), and flip to Mythic together with the combat power.

### Data Additions
- **New dungeon guide video** — Added the Jotunskar Dungeon (Module 33, Biting Cold expansion) mechanics walkthrough to the Dungeons tab on the Mekaniks page.

### Bug Fixes
- **Mount power item level now matches the game exactly** — Celestial mount equip/combat powers displayed as IL 3938 instead of the in-game 3937. This was a display-only rounding quirk (the true value is 3937.5) — your character's total item level was always correct — and the shown number now reads 3937 like the in-game tooltip.
- **Ally mount auras now count at Celestial** — In Toon Forge's "assume support party" section, the buffs an ally's mount aura gives you (Mystic Aura, Pack Tactics, Runic Aura, etc.) were being valued at Mythic. Since allies run their mounts at max tier, these now show and award their Celestial values (e.g. +2,250 → +2,953 Power), both in the picker and in your stats.
- **Your own mount equip power now defaults to Celestial** — The Equip Power rarity in Toon Forge was defaulting to Mythic (a leftover from before Celestial equip-power scaling was verified). It now defaults to Celestial like Combat Power does, so your stat bar and the power picker show your real max-tier numbers out of the box. You can still drop it to any lower tier with the "Equip rarity" dropdown. (Also fixed the Combat rarity dropdown, which was showing "Mythic" even though it was already calculating at Celestial.)
- **Mount power stat values are now exact at Celestial** — The Mythic→Celestial multiplier was very slightly rounded, which showed up on big numbers (e.g. Stalwart's Max HP read 39,373 instead of the in-game 39,375). It now uses the exact game ratio, so large mount-power stats match the in-game tooltip to the point. Smaller values were already correct.

### Needs review before publishing
- **Life Lessons (master boon)** — a staged correction said its trigger is a 10% chance (model had assumed 20%) and its Rank 3 returns 10% of damage as a heal per rank (was 15%). NOT published on July 9 because the live news already describes a *different* Life Lessons correction (it "lost its below-30%-HP requirement", proc healing 1%/2% per rank). Need to confirm whether this 10%/10% correction is a separate, still-unannounced fix or part of the already-published rework before adding it to the feed.
