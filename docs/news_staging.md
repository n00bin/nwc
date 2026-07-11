# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

## Week of July 5, 2026

(Last published July 10, 2026: "Mount Powers Go Full Celestial — Exact to the Point, with a One-Tap Tier Toggle")

### Bug Fixes
- **Combat-proc gear bonuses no longer inflate the out-of-combat panel (fleet-wide sweep).**
  Audited every equip bonus in the gear database and fixed 220 combat procs
  (across 69 set families — Unleashed, the Challenger's / Survivor's-adjacent
  stacking lines, Daily/Encounter-triggered buffs, etc.) that were missing the
  "conditional" flag and so counted as always-on at rest. They now correctly show
  only with "Hide in-combat bonuses" unchecked. Health-gated "either/or" bonuses
  and passive party/resource scaling were verified and deliberately left as-is.
- **Daily-triggered gear procs now sit behind the conditional toggle.**
  Two set bonuses — *Tactical Daily* (Wintermarked/Tactical set, +5% Combat
  Advantage) and *Malignant Energy* (Ritualistic set, ±2.5% damage) — only fire
  when you use a Daily power, but were being counted as always-on in the
  out-of-combat stat panel. They're now correctly gated (shown only with
  "Hide in-combat bonuses" unchecked), so the resting panel matches the in-game
  tooltip. Fixed across all rarity tiers of both sets.
- **Summoned companion Combined Rating now uses the summoned slot's rarity.**
  When a build set the bulk companion rarity differently from the summoned
  companion (e.g. bulk Mythic but Drizzt summoned at Celestial), the summoned
  base-item-level Combined Rating was read at the wrong rarity and under-credited
  ~1,683 rating to *every* stat (~1.5% low across the whole sheet). Now reads the
  summoned rarity, so every rating matches the in-game stat sheet to within a
  point. Verified against a friend's Warlock/Hellbringer DPS build (all 13 main
  stats within ±1, Max HP within 24, Damage exact).

<!-- Resolved 2026-07-10: the Life Lessons master-boon correction (chance 20%->10%,
     R3 heal 15%->10%/rank, 4s durations) was screenshot-verified and applied to
     campaign_boons.json on 2026-07-08 (data_trust.md, tooltip capture
     2026-07-08_master-boon_Life-Lessons_...). Owner decided it does not need a
     news entry. Prior "needs review" note was stale (it conflated the 1%/2%
     heal, which belongs to Enhanced Application, with Life Lessons). -->

