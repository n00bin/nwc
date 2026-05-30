# Toon Forge — "Best Build" Optimizer: Scope & Design

**Status:** Design / not built. Drafted 2026-05-30 in response to Report #33.
**Owner:** NWCB-Dev. **Lives in:** `website/toon-forge.html` (Toon Forge), reusing the existing stat engine.

---

## 1. Goal

Given a player's **owned items** and a chosen **role (DPS / Tank / Healer)**, pick the
loadout that maximizes that role's objective, obey every Neverwinter slot/equip rule,
and **explain why** each choice was made.

Two modes:
- **Owned-only** — optimize over what the player actually has (they flag owned items). Small search space.
- **BiS / aspirational** — optimize over all site data; output doubles as a "what to chase" shopping list.

---

## 2. Build on the engine we already have (do NOT reinvent the stat math)

The deterministic stat pipeline already does the hard part:

| Existing piece | Location | Role in the optimizer |
|---|---|---|
| `TOON_FORGE_ENGINE.computeStats(character)` | engine | The **scorer** — any loadout → 13 final stats with `{finalPct, cap}` |
| `buildEngineCharacter(state)` | `toon-forge.html` ~L9475 | Turns a UI state into an engine character |
| `ROLE_PRIORITY_STATS` | ~L10650 | Per-role priority stat lists (DPS/Tank/Heal) |
| `engineStatCoverage()` | ~L10656 | `avg( min(1, finalPct/cap) )` over priority stats → already a 0..1 objective |
| cap clamp (rating past cap = wasted) | ~L10778 | Encodes overcap = 0 marginal value |
| `gearOptionsForSlot`, insignia matcher, boon cost model | various | Candidate generators + constraints |

**Consequence:** the optimizer is a **search that repeatedly calls the existing scorer**.
Same engine the builder displays → optimizer results can never disagree with the stat bar.

---

## 3. Objective function (per role)

Refine `engineStatCoverage` into the optimizer objective `J(loadout)`:

```
J = Σ over role-priority stats:  w[stat] * saturate(rating[stat], cap[stat])
    + setBonusValue(loadout)
    + percentStatValue(loadout)        // Damage Bonus, Outgoing Healing %, etc.
```

- `saturate(r, cap)` rewards rating **up to cap** and gives **zero credit past cap**
  (overcap = wasted, exactly the in-game rule). This makes `J` **concave/saturating** —
  the property that lets greedy + local search find near-optimal builds cheaply.
- `w[stat]` = role weights, **data-driven** (config over code, per project rules). Default
  = descending weight down the priority list.
- Set bonuses and percent stats already flow through `computeStats`, so they're scored for free
  once the pieces are slotted; the optimizer just needs to *consider committing to them* (Phase 2).

**Decision to lock:** overcap policy = zero credit, with a tiny epsilon toward "closest to cap"
to break ties; set-bonus valuation = threshold lookahead (see Phase 2).

---

## 4. Why the search is tractable

Slots in play: 12 gear + per-slot enchants, 4 artifacts, 5 mounts × (collar + mount + insignias),
summoned + 5 active companions (+ companion gear), campaign boons (point budget), 2 overloads, buffs.
The full cross-product is astronomical — but `J` is **additive in stats with caps**, so it is
**near-separable**. Only three things couple the slots:

1. **Rating caps** — slots compete for the same stat pool (once Crit Sev caps, more is wasted).
2. **Set bonuses** — threshold rewards (2/4-piece).
3. **Stacking / matching rules** — mount-bonus 100/50/25 stacking, insignia category matching, unique-equip.

The algorithm handles each explicitly instead of brute force.

---

## 5. Algorithm (phased)

**Phase 0 — Constraint model.** Prune illegal options up front: class + slot eligibility,
two rings share the `Ring` pool but must be distinct, unique-equip flags, mount uniqueness within
the loadout, insignia category matching, set min-pieces, owned-only filter.

**Phase 1 — Cap-aware marginal greedy (baseline).** Process slots in rounds; for each slot pick the
option with the highest **marginal** `ΔJ` given current totals. After each pick, recompute marginals —
a stat nearing cap loses value, automatically redirecting later picks to the next under-cap priority stat.
`O(slots × options × stats)`; runs in milliseconds client-side.

**Phase 2 — Set-bonus branch.** Enumerate sets the player can *complete* (owns ≥ N pieces of a set whose
bonus is role-relevant). For each "commit set X" scenario, lock those slots and re-run Phase 1 on the rest;
keep the best scenario. Bounded — few sets are completable from one inventory.

**Phase 3 — Local-search refinement.** Hill-climb single-item swaps (plus ring-pair / artifact-pair swaps)
that raise `J`; accept improvements; stop at a local optimum or an iteration cap. Catches cap/set
interactions greedy missed.

**Phase 4 — Per-system sub-optimizers** (called inside the above):
- **Mounts/insignias** — choose 5 mounts + insignia layout for max bonus value under the 100/50/25 stacking
  rule and category matching (small assignment problem; reuse the matcher in `mounts-page.js`).
- **Companions** — pick summon + 5 active to maximize stat contributions (knapsack-ish).
- **Boons** — allocate the point budget (incl. master-boon ordering cost) toward priority stats (knapsack).
- **Enchants** — per slot, choose the enchant feeding the most under-cap priority stat.

---

## 6. Inventory input (owned-only)

- Lightweight **"I own this"** toggle in each picker, stored in `localStorage` — reuse the existing
  `nwcb_user_added_gear_v1` storage pattern and `getUserAddedGear()` plumbing.
- Owned-only keeps option counts tiny, so Phases 1–3 are effectively exhaustive per system.
- No account/server needed — stays a static site.

---

## 7. Output (matches the project's optimizer requirements)

1. **Selected loadout** — every slot and system.
2. **Final stat summary** — the 13 stats with caps hit / rating remaining to cap.
3. **Reasoning** — top contributors per priority stat; which sets were completed and why; biggest
   tradeoffs ("took B over A: +X to under-cap Crit Sev; A would have overcapped Power"); any priority
   stat still under cap and by how much.
4. **Data pack version stamp** (`source_version`).
5. **Mode flag** — owned-only vs BiS.

Every pick carries a one-line "why" captured from its marginal-value record → explainability is a
byproduct of the algorithm, not bolted on.

---

## 8. Determinism

Same inputs → same output. Stable tie-breaks: higher `J`, then higher item level, then name A→Z.

---

## 9. Open decisions to lock before building (gaps)

1. **Role weights** — exact `w[stat]` per role (start from `ROLE_PRIORITY_STATS` order).
2. **Set-bonus valuation** — how much a 2/4-piece bonus is worth vs raw rating (threshold lookahead depth).
3. **Overcap epsilon** — pure zero vs tiny tie-break credit.
4. **Combat-power / proc valuation** — procs are hard to value generically; Phase 1 ignores them,
   Phase 3 may swap toward them. Likely needs per-power data later.
5. **Client perf budget** — must run in-browser; cap local-search iterations.

---

## 10. Delivery milestones

- **M1** — Objective + owned-only greedy over the 12 gear slots + enchants (biggest lever, simplest).
  Output: loadout + stat summary + per-stat "why". Proves the approach end-to-end.
- **M2** — Set-bonus branch + ring/artifact pairs + local-search refinement.
- **M3** — Mounts/insignias + companions + boons sub-optimizers.
- **M4** — BiS mode + shopping list + tradeoff-explainer polish.

Each milestone is independently shippable and visibly improves build quality.
