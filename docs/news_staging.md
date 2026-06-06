# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

(Last published June 5, 2026: "Damage Procs Now Count, Real Max HP & Role-True Sims")

## Week of 2026-06-05 (since last publish)

### Features
- **Clearer everywhere — audit polish pass.** The home page's Artifacts card now shows live database counts (138 artifacts & 38 sets — the old hardcoded label said 61 & 18!). Mount ranking tabs and insignia filters explain themselves on hover. Profession table headers spell out Proficiency / Commission / Skill Chance. Links into Mekaniks now open the right tab. The one unverified campaign booster is clearly marked UNCONFIRMED. And on phones, Toon Forge now shows its "Experimental" explanation instead of hiding it behind a hover tooltip.

### Data Additions
- **Bloodwoven Brands (Warden's Defense version) added.** The Doomvault Remains clothing piece with the Warden's Defense bonus (gain 5% Defense for 10s when a single hit takes more than 15% of your Max HP) is now in the gear database as a Pants item — the database previously only had the Depleted Defiance version. Also from the same screenshot batch: the Enchanted Forte 2-piece set bonus was corrected to +3,000 Forte (it was listed as +1,000), the Enchanted Advantage bonus is confirmed as +3,000 Accuracy, and the Dark Magic Defence set's bonus is +2% Awareness.

### Bug Fixes
- **Dragonflight Ward Necklace stat corrected.** In-game verification showed +529 Critical Avoidance (the database said Defense); fixed, and a duplicate entry was removed. Two long-suspicious companion powers were also checked in-game and confirmed CORRECT as stored: Raptor's Instincts (4.5% Power per Pack stack — it stacks ×5 party-wide) and Bobby's Vigor (+12,000 Max HP — an intentional outlier like Energon).
- **Toon Forge — Max HP was counting Constitution twice.** The engine applied CON's +0.5%-per-point HP bonus in two different places, so every Max HP figure ran about 7% high (at CON 14: ×1.07 applied twice). Found in the June 5 full-site audit; one of the two paths removed and verified with a before/after check. Max HP numbers across all builds are now slightly lower and correct.
- **Friendlier error messages site-wide.** The patch notes page now tells you when it couldn't load (instead of showing a blank page), and the Reports page speaks plain English when something fails ("Couldn't update the status — check your connection and try again") instead of raw technical codes. Replying on one report no longer locks the reply box on every other report.
- **Toon Forge — share links now carry your damage-sim settings.** The Combat Advantage uptime slider and sim magnitude were being dropped from saved builds and share links, silently resetting to defaults on load. They're included now.
- **Reports page — newest reports now sort to the top.** A flipped sort order was pinning "In Progress" reports first and burying brand-new ones at the bottom of the active list. New > Confirmed > In Progress now, as intended. Also fixed: deleting a community reply as admin no longer triggers a stray second "delete this report?" prompt.
- **Toon Forge — small stat-accuracy fixes from the audit.** 66 items whose tooltip bonuses like "+1.5% Movement Speed" had been stored as (worthless) rating points now count as the real percent bonuses; 13 of them were even counted twice. Renamed items in old saved builds now reliably load the right item tier, and the 🔍 gear details popup now shows the tier you actually picked instead of the first one in the database.
- **Gear database cleanup (June 5 audit).** Corrected 9 items whose stored item level was wrong (four Aegis of the Condemned tiers were saved with their rarity tier instead of the real IL 3750–4800; five Tempest Gaze accessories were IL 1150 instead of 3150), fixed one wrong Combined Rating, re-linked two Impending Doom weapons whose set bonus pointed at the wrong set name, and removed 33 duplicate gear entries that were cluttering the Toon Forge pickers. Stat names were also normalized to the exact in-game spellings ("Deflect", "Control Resist") across 800+ entries.
- **Reports #95–#97 — Cerebral Predator Ink moved to the Pants slot.** Two players reported this Dread Sanctum collection piece as "missing" — it was in the database, but filed under Shirt, so the Pants picker never showed it. Collection tooltips don't state the slot, and the original intake guessed wrong. The Combat Advantage/Critical Severity and Combat Advantage/Awareness versions are now Pants (player-verified); the Critical Strike/Defense version is flagged for an in-game slot check since slots can differ per variant.
