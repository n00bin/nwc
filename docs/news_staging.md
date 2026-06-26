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

### Bug Fixes
- **Detector's set (Unstable Drive) was double-counted.** The Detector's Choker
  listed its "Unstable Scan" bonus twice in the data, so the engine applied
  **14% Combat Advantage / Forte / Outgoing Healing instead of 7%**. Removed the
  duplicate so the set now shows its true value. (This was also making the build
  optimizer over-favor the set.)
- **Removed a duplicate companion.** "Golden Bulette" and "Golden Bulette Pup"
  were the same companion entered twice (once at Mythic 7.5% Outgoing Healing,
  once at Celestial 9%). Merged into **Golden Bulette Pup** — choose Celestial
  rarity for the 9% value.
