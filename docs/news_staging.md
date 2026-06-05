# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

(Last published June 5, 2026: "Damage Procs Now Count, Real Max HP & Role-True Sims")

## Week of 2026-06-05 (since last publish)

### Bug Fixes
- **Toon Forge — Max HP was counting Constitution twice.** The engine applied CON's +0.5%-per-point HP bonus in two different places, so every Max HP figure ran about 7% high (at CON 14: ×1.07 applied twice). Found in the June 5 full-site audit; one of the two paths removed and verified with a before/after check. Max HP numbers across all builds are now slightly lower and correct.
