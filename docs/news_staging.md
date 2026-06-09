# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

(Last published June 9, 2026: "Content Zones, Weapon Mods, One-Row Pickers & a Site-Wide Honesty Audit")

## Week of 2026-06-09 (since last publish)

### Features
(none staged yet)

### Data Additions
(none staged yet)

### Bug Fixes
- **Audit cleanup round 2 — friendlier words everywhere.** Failed screenshot uploads on the Reports page now say "Couldn't upload your screenshot — try a smaller image or check your connection" instead of raw technical error codes, and the reports-list loading error suggests checking your connection. The Preview page's empty sections no longer show internal folder paths. Toon Forge's footer no longer flashes the placeholder text "Buff state" while loading, and the "Hide in-combat bonuses" hover tip was rewritten so checked clearly means hidden. Under the hood: a latent engine inconsistency was fixed so overload proc bonuses would be uptime-weighted exactly like gear procs if any ever appear, and the data build script now fails loudly if a file write goes wrong instead of leaving a half-written file.
