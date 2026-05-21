# Mount Rarity Scaling — Design Doc

**Status:** Revised after Critic Round 1 (2026-05-20). Pending Round 2 review.
**Created:** 2026-05-20
**Owner:** Planner (per `_team-protocols.md` Section 2)

This document is the **canonical Decision Log** for the mount rarity scaling feature. The Planner reads this as input and writes a plan against it. The Planner does **not** maintain a separate Decision Log in the plan document. New decisions discovered during build go through the escalation path (`LOCKED-DECISION-WRONG` or `USER-DIRECTION-CHANGE`) — they do not silently appear in plans.

---

## Decision Log (Task: Mount Rarity Scaling)

| # | Decision | Locked by | Locked on | Notes |
|---|----------|-----------|-----------|-------|
| 1 | Storage model: stored values are at **"Mythic rarity at 125% bolster"** baseline (n00b's character's bolster, used as calibration anchor). Scaling happens at runtime. No data migration. | user | 2026-05-20 | Matches engine constant `MOUNT_POWER_CALIBRATION_BOLSTER_PCT = 125` (`toon-forge.html:5506`) and the comment block at `toon-forge.html:5495-5511`. Earlier "100% bolster" framing in this doc was wrong. |
| 2 | Skip list: see "Per-field scaling rules" table below — the simple "everything scales" framing was insufficient. Categories: rarity+bolster, rarity-only, tier-invariant, not-mount-owned. | user | 2026-05-20 | Replaces the earlier prose form. The table is the binding spec. |
| 2b | Named mount-insignia bonuses (from `mount_insignia_bonuses.json` via `bonusRef`) are **invariant** — they do NOT scale with mount rarity or bolster. The only multiplier that affects displayed value is the diminishing-returns stacking multiplier (1.0 / 0.5 / 0.25) already in the engine. | user | 2026-05-20 | **Supersedes the implicit "named bonuses scale with mount rarity" piece of #2.** Matches engine at `toon-forge.html:6264-6283` (no rarity/bolster factor applied) and tooltip at `toon-forge.html:2312` ("Does NOT boost Insignia stats or Insignia Bonuses"). No engine change required. |
| 3 | Equip power scaling: **rarity YES, bolster NO.** Equip-power values (and the CR they contribute) scale across rarities using the locked 1.3124 table. They do NOT scale with bolster. This narrows the earlier "scale identically to stats" framing. | user | 2026-05-20 | Reconciles with the 2026-05-12 engine revert at `toon-forge.html:6051-6054` (n00b verified equip-power values are face-value across bolster). The rarity dimension is separate and was not part of that revert. Party-mount-allies equip powers follow the same rule. |
| 4 | Rarity × bolster interaction: independent multipliers. `effective = stored × bolster_factor × rarity_factor`, capped at `stored × 1.3124` (the Celestial-at-125%-bolster ceiling). For fields where bolster does not apply (Decision 3 + table below), the `bolster_factor` term is omitted (treated as 1.0). | user | 2026-05-20 | The cap exists for over-Mythic + over-125% combinations; both controls remain free at all times. |
| 5 | Default rarity for newly-added stable-slot mounts: **Mythic**. Matches the stored baseline. | user | 2026-05-20 | |
| 6 | Picker scope: **all 7 tiers** selectable — Common, Uncommon, Rare, Epic, Legendary, Mythic, Celestial. | user | 2026-05-20 | Plan v3 silently narrowed this to 2 options. Held the line at 7. |
| 7 | ~~Picker scope: per-stable-slot picker (not global). Each of the 5 stable slots has its own rarity dropdown.~~ **SUPERSEDED BY #11 on 2026-05-21.** Initial implementation shipped this way; user found the UX gap (slot rarity does nothing when active power isn't from a slotted mount). | user | 2026-05-20 | Original note: "Set all" button is not in scope. |
| 8 | Party Mount Buff section: **always evaluated at Mythic** in v1. No per-ally rarity picker for the party mount ally equip powers (the Party Mount Buff UI section that picks `MOUNT_EQUIP_POWERS_DATA` for ally auras). | user | 2026-05-21 | Scope cut. Plan v1 critic found that hardcoding Mythic with a TODO would violate Done When item 2 (R-only fields scale). Adding a Decision Log entry makes the scope cut explicit. Party ally rarity picker is a future task. Engine site: `toon-forge.html:5872-5892`. |
| 9 | Combat power values (`magnitude` + `equipBonuses` on `mount_combat_powers.json` entries): **tooltip-only scaling in v1**. Rarity × bolster scaling applies in the `renderCombatPower` detail-card display only. The stat-pipeline path for combat power values does not yet exist; building it is **out of scope** for this feature. | user | 2026-05-21 | Scope cut. Plan v1 critic found that combat power values aren't currently in the buffs pipeline at all, so Step 8 was scaling a tooltip and calling it Done. This Decision Log entry makes the scope honest: feature scales the tooltip; stat-panel injection is a separate future task. Done When item 8 narrows accordingly. |
| 10 | Equip-power **proc and stacking-buff amounts** also scale R-only (rarity YES, bolster NO). Specifically: `equipEffect.amount` (triggered procs like Quick Action's "+6% AP Gain") and `stackingBuff.perStack` (stacking buffs like Ferocity's "+1.6% per stack"). These fields are stored at the Mythic-125% baseline per their data notes and follow the same R-only rule as `stats[].value`. | user | 2026-05-21 | Added post-build by critic finding. Plan v3 Step 6 scaled `stats[].value` and `combinedRating` but the Builder did not extend scaling to `equipEffect.amount` and `stackingBuff.perStack`. Without this Decision, those proc/stacking-buff values would stay at Mythic value across all rarities, inconsistent with the surrounding always-on stats on the same equip power. Engine site: `toon-forge.html:6143-6179`. |
| 11 | **Rarity pickers live next to the Active Power pickers, NOT on stable slots.** Two new state fields: `state.activeEquipPowerRarity` and `state.activeCombatPowerRarity`. Each defaults to "Mythic". Stable slots no longer have a `mountRarity` field or dropdown. The compute paths read directly from these state fields instead of scanning `state.stable` for the owning mount. | user | 2026-05-21 | **Supersedes Decision 7.** Reason: the slot-based picker only affected stats when a slotted mount happened to also be the active-power source. Many players slot mounts for insignia bonuses but pick active powers from non-slotted mounts they own. The slot-based dropdown did nothing visible for those users. Active-Power-based rarity matches the in-game mental model: "the equip power I'm using is from my Celestial mount" — independent of stable composition. Math (multiplier table, cap rule) is unchanged from prior decisions. |

---

## Locked Facts (Phase 0 verification — already user-confirmed, not re-litigable)

- **Universal rarity multiplier table** (Rainer's picker, user-verified):

  | Rarity | Multiplier |
  |--------|------------|
  | Common | 0.00667 |
  | Uncommon | 0.0667 |
  | Rare | 0.2 |
  | Epic | 0.4 |
  | Legendary | 0.667 |
  | Mythic | 1.0 |
  | Celestial | 1.3124 |

- **Bolster formula** (per existing engine at `toon-forge.html:5507-5511`):

  ```
  bolster_factor = (1 + bolster_percent / 100) / 2.25
  ```

  where `2.25 = 1 + MOUNT_POWER_CALIBRATION_BOLSTER_PCT/100 = 1 + 125/100`.

  Sanity values:
  - 125% bolster: factor = 1.00 (calibration anchor — returns stored as-is)
  - 100% bolster: factor = 0.89
  - 50% bolster:  factor = 0.67
  - 0% bolster:   factor = 0.44

- **Cap rule:** `effective = min(stored × bolster_factor × rarity_factor, stored × 1.3124)`. The cap is the **Celestial-at-125%-bolster** ceiling, which evaluates to `stored × 1.0 × 1.3124 = stored × 1.3124`.

- **Storage convention:** all mount-power and mount-stat values stored at "Mythic rarity, 125% bolster" (n00b's character's bolster). All 18 recent data fixes brought entries to this convention.

---

## Per-field scaling rules (binding spec — replaces narrative skip list)

For every field on a mount entry, exactly one of these rules applies. Plan steps must reference this table by row name, not by re-stating behavior.

| Row name | Fields | Rarity factor | Bolster factor | Cap applies? | Data source |
|----------|--------|---------------|----------------|--------------|-------------|
| R-stats | Combat-power magnitudes (`magnitude`); combat-power debuff/buff percent values | YES | YES | YES | `mount_combat_powers.json` |
| R-only | Equip-power stat values (`stats[].value`); equip-power CR contribution (`combinedRating`); equip-power magnitudes; equip-power **proc amounts** (`equipEffect.amount`); equip-power **stacking-buff amounts** (`stackingBuff.perStack`); mount IL | YES | NO | YES (rarity-only ceiling = `stored × 1.3124`) | `mount_equip_powers.json` |
| Invariant-bonus | Named mount-insignia-bonus values (the entry in `mount_insignia_bonuses.json` referenced by a mount's `bonusRef` field) | NO | NO | n/a | `mount_insignia_bonuses.json` |
| Invariant | Combat-power `recharge` / cooldown; combat-power `duration`; equip-power `procEffect.maxStacks`; any other count/duration | NO | NO | n/a | various |
| Not-mount | Insignia stat bonuses (each insignia piece's own `+rating`/`+%` from `mount_insignias.json`) — scale with the insignia's own tier, not the mount's rarity | n/a (out of scope for this feature) | n/a | n/a | `mount_insignias.json` |

**Definition — "named mount insignia bonus":** the bonus entry stored in `mount_insignia_bonuses.json`, referenced from a mount entry by `bonusRef` (which links to the `id` field in that JSON file). This is distinct from "insignia stat bonuses," which are the per-insignia `+rating`/`+%` values contributed by each individual insignia piece in `mount_insignias.json`. **Per Decision 2b, named mount-insignia bonuses are invariant** — they do not scale with mount rarity or bolster (Invariant-bonus row above). The per-insignia stat bonuses scale with each **insignia**'s own tier (Not-mount row — out of scope for this feature).

---

## Scope Boundary (what this feature does NOT do)

- **No "set all" bulk-rarity button.** Per-slot only; add later if needed.
- **No per-mount "native rarity" field in JSON.** Default-to-Mythic is global, not data-driven.
- **No "highest rarity wins" cross-mount rule** (was future task #34, **closed 2026-05-21 as obsolete**). Reason: Decision 11 makes the user pick the active power's rarity directly via dropdown. The user reads their in-game tooltip (which already shows the post-HRW effective rarity) and sets the dropdown to match. Replicating the game's HRW logic in the builder would mean tracking owned-mount inventory — out of scope for a planner tool, since the user's eyes already do the HRW lookup.
- **No rarity scaling of equip-power picker card values** in `renderEquipPower` (was future task #50, **closed 2026-05-21 as not-worth-doing**). Reason: the stat bar is the source of truth for rarity-scaled values; once the user picks an active equip power, the stat panel applies the set rarity correctly. The picker shows MYTHIC-BASELINE values across all cards, which is fine for relative comparison ("Pack Tactics 2953 CA vs Mighty Action 800 power") — the user doesn't need the builder to do mental scaling math for shopping purposes. The asymmetry with `renderCombatPower` (which DOES scale its tooltip per Decision 9) is acceptable: that tooltip inspects a power the user already has active, while the picker is for browsing. A planned investigation into whether the design doc's R-only row entry for "mount IL" matches in-game behavior remains open but is deferred — neither the compute path nor any UI currently scales IL, and no symptom is visible.
- **No re-baselining of stored data** to Common or Celestial. Mythic-125% baseline stays.
- **No changes to per-insignia stat bonus rendering or scaling** (those follow each insignia's own tier).
- **No changes to the bolster slider's tooltip or behavior** beyond what the new formula requires.
- **No re-application of bolster scaling to equip powers** (the 2026-05-12 revert stands — equip powers are rarity-only).
- **No per-ally rarity picker for the Party Mount Buff section** (Decision 8). Party ally equip powers always evaluated at Mythic in v1.
- **No combat-power-to-stat-pipeline plumbing** (Decision 9). Combat power R-stats scaling lives in the detail-card tooltip only. Building the stat-pipeline path is a separate future task.

---

## Definition of "decision" vs. "implementation detail" (feature-specific)

- **A decision** = anything that changes what the user sees, what scales with what, how the formula is shaped, or what storage convention is used. Decisions live in the Decision Log + Per-field scaling rules above and require user sign-off to change.
- **An implementation detail** = which function in `toon-forge-engine.js` (or the inline engine in `toon-forge.html`) to extend vs. add new, naming of internal helpers, where the dropdown HTML node lives in existing stable-slot markup, how the per-slot rarity is persisted in the existing save shape.

## "Defer to builder" deferrals (cap: 1)

- **Slot-persistence location:** how the per-slot rarity is stored in the existing build save shape (key name, where in the slot object it lives). Builder picks based on existing patterns in the save logic. **This is the one allowed deferral.**

---

## Done When (acceptance criteria for the feature as a whole)

**Updated 2026-05-21 for Decision 11 (active-power-based rarity, superseding slot-based).**

- [ ] No "Mount rarity" dropdown appears on any of the 5 stable-slot rows (the slot-based UI is fully removed).
- [ ] Two rarity dropdowns exist — one adjacent to the **Active Combat Power** chip, one adjacent to the **Active Equip Power** chip. Both show all 7 tiers (Common through Celestial) and default to Mythic.
- [ ] Changing the **Active Equip Power rarity** immediately rescales every field marked "Rarity factor: YES" on the R-only row of the Per-field scaling rules table (equip-power stats, `combinedRating`, equip-power magnitudes, `equipEffect.amount` proc values, `stackingBuff.perStack` stacking-buff values, mount IL). The stat bar reflects the change **regardless of whether the owning mount is in any stable slot**.
- [ ] Changing the **Active Combat Power rarity** immediately rescales the combat-power detail-card tooltip values (`magnitude`, `equipBonuses`) with both rarity AND bolster (R-stats row). The stat panel does NOT change for combat powers (Decision 9 — tooltip-only).
- [ ] Changing either rarity dropdown does NOT change fields marked "Rarity factor: NO" (Invariant + Invariant-bonus + Not-mount rows). Named mount-insignia bonuses remain unaffected (Decision 2b).
- [ ] The bolster slider continues to scale R-stats rows using the existing formula. It does NOT scale R-only rows (Decision 3).
- [ ] The cap rule produces the right ceiling at Celestial + 125% bolster: `effective = stored × 1.3124`.
- [ ] Save shape persists `state.activeEquipPowerRarity` and `state.activeCombatPowerRarity`; loading a saved build restores both correctly.
- [ ] Old saves (from before Decision 11) load cleanly with both new rarities defaulting to Mythic. Stale `mountRarity` keys on loaded stable slots are deleted on load.
- [ ] **Spot-check at least 1 entry against in-game values at a non-Mythic rarity**: pick a known equip power, set the **Active Equip Power rarity** dropdown to Legendary, confirm the displayed stat-bar value matches `stored × 0.667` (capped at `stored × 1.3124`). This must work even if no mount in the stable provides the active equip power. Party mount buffs (Decision 8) are Mythic-only in v1 and do not have their own rarity picker.

---

## Notes for the Planner

- Read this doc once and treat every Decision Log entry **and** every row in the Per-field scaling rules table as **immutable**. If a step in your plan would contradict any of those, escalate (`LOCKED-DECISION-WRONG`) — do not silently override.
- Phase 0 verification is done. Researcher is NOT in the loop — math is locked above.
- The previous attempt looped at 5 Planner revisions because Decisions 2, 3, 6, 7 were never locked and the formula/storage-convention were silently fluctuating. They are now nailed down. Use them.
- The Critic reviewing the plan will measure your plan against THIS doc — not against an external rubric.
