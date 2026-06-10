# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

(Last published June 9, 2026: "Content Zones, Weapon Mods, One-Row Pickers & a Site-Wide Honesty Audit")

## Week of 2026-06-09 (since last publish)

### Features
(none staged yet)

### Data Additions
- **Balgora's powers are finally complete — the last audit blocker is closed.** An owner Mount Preview screenshot filled in the long-missing **Seeing Red** equip power (40% chance on encounter powers to gain 13,125 Accuracy for 8s at Celestial, once per 15s, +3,544 Combined Rating) and confirmed **Hell's Impact** was stored at its Celestial values (Magnitude 984, DoT 151, +14.8% Incoming Damage debuff for 10s). The capture was taken at a lower rarity and scaled to the Celestial anchor with integer-perfect math — Balgora now displays correctly in the mount inspector and counts in build calculations.
- **Hellfire Engine weapon set bonus — found and structured.** This morning we stripped a made-up "+1,500 Power" from the Hellfire Engine Tow Hook; by evening the real bonus turned up on the set's own higher-tier siblings in our screenshot archive: at the start of combat you gain **+15% Stamina Regeneration and +15% Movement Speed for 10s** (refreshes on kill). All nine lower-tier Hellfire weapons (Tow Hook, Oil Stick, Instruction Manual tiers) now carry the verified bonus instead of placeholders.
- **Six more duplicate gear entries removed, two more phantom "sets" busted.** Archived tooltips settled five duplicate pairs — Blaspheme Pactblade, Perfect Mark of Lolth, Exalted Maiden's Raid Wristguards, Starhide Skullcap and Doublet, and Runefrost Hunter's Coat — each now exists exactly once with screenshot-verified stats (the deleted copies carried stray bonuses or wrong values). And the same tooltips proved "Cosmic Corsair's Armor" (12 Starweave/Starhide pieces) and "Frostforged Warplate" (36 Wintermarked/Runefrost pieces) were collection-tab names, not real sets — items don't show set lines in game, so the false set tags are gone from all 48 pieces.
- **Ultraviolet Elven Cap — the 3-vs-5-second mystery, solved.** The database had this Warlock/Wizard head twice, and the copies disagreed on how fast its Combat Advantage stack builds (every 3s vs every 5s). The archived tooltip settled it: **every 5 seconds**, 1% per stack, max 10. The correct copy (whose stacking bonus Toon Forge already counts) is now the only one — and the same tooltip revealed "Ultraviolet Armor" was another phantom collection-tab set, now cleared from all 12 pieces.

### Bug Fixes
- **Audit cleanup round 2 — friendlier words everywhere.** Failed screenshot uploads on the Reports page now say "Couldn't upload your screenshot — try a smaller image or check your connection" instead of raw technical error codes, and the reports-list loading error suggests checking your connection. The Preview page's empty sections no longer show internal folder paths. Toon Forge's footer no longer flashes the placeholder text "Buff state" while loading, and the "Hide in-combat bonuses" hover tip was rewritten so checked clearly means hidden. Under the hood: a latent engine inconsistency was fixed so overload proc bonuses would be uptime-weighted exactly like gear procs if any ever appear, and the data build script now fails loudly if a file write goes wrong instead of leaving a half-written file.
