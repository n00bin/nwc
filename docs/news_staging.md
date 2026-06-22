# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

(Last published June 21, 2026: "Community Build Sharing + Meta Tracker, Searchable Pickers & Hundreds of Verified Bonuses")

## Week of 2026-06-21 (since last publish)

### Features
- Toon Forge → **Detailed Stats** now has a **Damage Boosts** section: the multiplicative damage bonuses that never show on the in-game stat panel — your **Base Damage Boost**, **Damage Bonus / Outgoing Damage**, your **Magical or Physical damage boost** (fed by Intelligence / Strength, matched to your paragon), and power-slot boosts (At-Will / Encounter / Daily) — each with a "Sources" breakdown. They always fed your damage; now you can see them.

### Bug Fixes
- Toon Forge: **set bonuses were counted multiple times** — a 2-piece set applied its bonus twice, and 4-piece armor sets applied it four times, overstating damage (worst on uncapped stats like Base Damage Boost — e.g. the Impending Doom weapon set read +10% instead of +5%). Fixed so each set bonus counts once, like in game.
- Toon Forge: **Impending Doom** now grants its **full 2-piece bonus** on every weapon — the +2.5% Power and +7.5% Critical Severity were missing from most pieces (only one had them), so most pairings under-counted the set. All 66 weapons now carry the complete bonus.
- Companions page: swept ~55 companion **power and enhancement notes** that were leaking internal developer text onto the Lookup panel — re-anchor/calibration notes, "verified in-game" stamps, loose dates, source tags, and the like. The stat values were always shown in the stat table, so most of these just disappear; the rest now read as clean effect text (and intentional outliers like Raptor's Pack power keep their real description). Also fixed run-together wording (missing spaces after a period) and stray double-commas, and notes that clean down to nothing no longer leave an empty line behind.
