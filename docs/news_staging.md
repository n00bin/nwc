# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

## Week of July 5, 2026

(Last published July 10, 2026: "Mount Powers Go Full Celestial — Exact to the Point, with a One-Tap Tier Toggle")

### New Features
- **Lock your artifacts, not just your gear.** The 🔒 lock now appears on
  filled artifact slots too. Lock an artifact and the optimizer keeps that
  exact piece and builds the rest of your loadout around it — the missing
  piece for pinning a Neck + Waist + Artifact set like Vistani. Locks are
  saved with your build and travel in share links.

### Bug Fixes
- **Impending Doom set now gives Healers its Outgoing Healing (Warlock, Bard, Paladin).**
  The Impending Doom 2-piece Unleashed bonus grants Outgoing Healing to Healers,
  but only the DPS half was wired up, so a healer got nothing from Unleashed.
  All ranks (IL 3750–5250) now credit the matching Outgoing Healing (+3% to +5%)
  in the Healer role — for Warlock (Omen of Doom + Codex of Eternal Chains),
  Bard (Dirgeblade + Strings of the Forsaken), and Paladin (Oathbreaker's
  Malevolence + Aegis of the Condemned). It shows on the Outgoing Healing row
  with in-combat bonuses on (Unleashed is a charge state, so it's conditional).
- **Swift Synergy combat enchant no longer counts its stacks at rest.**
  Celestial Swift Synergy's Combat Advantage and Critical Severity come from
  Preparation stacks that build as you attack and drop when you leave combat, so
  they don't belong in the out-of-combat panel. They now show only behind the
  conditional toggle (its always-on +12% damage is unchanged).
- **Combat-proc gear bonuses no longer inflate the out-of-combat panel (fleet-wide sweep).**
  Audited every equip bonus in the gear database and fixed 220 combat procs
  (across 69 set families — Unleashed, the Challenger's / Survivor's-adjacent
  stacking lines, Daily/Encounter-triggered buffs, etc.) that were missing the
  "conditional" flag and so counted as always-on at rest. They now correctly show
  only with "Hide in-combat bonuses" unchecked. Health-gated "either/or" bonuses
  and passive party/resource scaling were verified and deliberately left as-is.
- **Malignant Energy (Ritualistic set) now sits behind the conditional toggle.**
  Its ±2.5% damage only fires when you use a Daily power, but was counted as
  always-on in the out-of-combat stat panel. Now correctly gated (shown only with
  "Hide in-combat bonuses" unchecked). *Tactical Daily* (Wintermarked/Tactical set)
  keeps its +5% Combat Advantage always-on — that half is unconditional; only its
  encounter-damage bonus is Daily-triggered.
- **Summoned companion Combined Rating now uses the summoned slot's rarity.**
  When a build set the bulk companion rarity differently from the summoned
  companion (e.g. bulk Mythic but Drizzt summoned at Celestial), the summoned
  base-item-level Combined Rating was read at the wrong rarity and under-credited
  ~1,683 rating to *every* stat (~1.5% low across the whole sheet). Now reads the
  summoned rarity, so every rating matches the in-game stat sheet to within a
  point. Verified against a friend's Warlock/Hellbringer DPS build (all 13 main
  stats within ±1, Max HP within 24, Damage exact).
- **Vistani set data corrected — it's a 3-piece Neck + Waist + Artifact set.**
  The Vistani Pendant (Neck) and Vistani Raiments (Waist) had wrong stats and
  were carrying the Vistani *weapon* set's 2-piece bonus by mistake, and the
  Tarokka Deck artifact was tagged with a mismatched set name so it never
  counted. Now fixed and verified from in-game tooltips: Pendant (Accuracy 400
  / Combat Advantage 400 / Critical Avoidance 401, +4 CON), Raiments (Critical
  Strike 600 / Combat Advantage 600, +2 STR +2 DEX), and the Tarokka Deck now
  completes the set. Equipping all three shows Vistani 3/3 with its real
  3-of-Set bonus (a single-target AoE takes +5% damage for 5s).

<!-- Resolved 2026-07-10: the Life Lessons master-boon correction (chance 20%->10%,
     R3 heal 15%->10%/rank, 4s durations) was screenshot-verified and applied to
     campaign_boons.json on 2026-07-08 (data_trust.md, tooltip capture
     2026-07-08_master-boon_Life-Lessons_...). Owner decided it does not need a
     news entry. Prior "needs review" note was stale (it conflated the 1%/2%
     heal, which belongs to Enhanced Application, with Life Lessons). -->

