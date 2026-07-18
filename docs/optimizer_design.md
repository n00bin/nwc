# Toon Forge — "Best Build" Optimizer: Scope & Design

**Status:** Built & in QA — pre-launch (updated 2026-06-19). Drafted 2026-05-30 in response to Report #33; now implemented in `website/js/optimizer-local.js` (premium, served via `/api/optimizer_js`).
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

---

## 11. Investigated & rejected: two-slot / ILS-VND neighborhood (2026-07-16)

**Question:** would adding a two-slot move (Variable Neighborhood Descent on top of
the existing Iterated Local Search) find better builds than the shipped single-slot
search? Tested via the headless runner (`scripts/optimize_build.js`) on the Warlock
DPS BiS build, deterministic seed, baseline vs. variant.

**Findings:**
1. The shipped search is **already an ILS** (greedy single-slot descent + perturbation
   kicks), converging to a true local optimum in ~11 kicks at +109% on the test build.
2. A naive two-slot move ("force slot A, re-optimize all other slots") is **intractable**:
   run inside every kick it timed out (>10 min, millions of full re-scores); run once as
   a post-convergence polish it exhausted a 40k-eval budget after **~7 probes** (each probe
   is a full slot sweep). Both produced a byte-identical build to the baseline.
3. **Audit of the set data before rebuilding**: every coordinated set-trap the single-slot
   search is blind to is **already hand-completed** — Neck/Belt/Artifact 3pc, Shirt/Pants
   2pc, weapon MH/OH sets — or is an armor 4pc set **excluded from the meta by owner ruling
   (2026-06-21)**. The *only* genuinely-uncovered, non-armor coordinated trap is **Ring 2pc
   sets** (Lolthian Might IL2050, The Dark Maiden IL1850; Pioneer/Primal are low-IL, not meta).
4. Built a targeted **ring 2pc set-completion pass** (mirroring `completeClothingSets`, same
   never-regress guard + cap-repair) and tested it: it evaluated all ring-set pairs (the
   headless run excludes nothing, so every ring was eligible) and **none beat the Frostsilver
   stat rings**. Result identical to baseline.

**Conclusion:** the two-slot idea does **not** improve the optimizer for this meta — the
search already extracts everything the coordinated-move idea can find that the meta allows.
Prototype (flag + ring pass + benchmark toggle) was **removed**; the file is back to the
shipped single-slot ILS. Kept this note so the ~6 test-run investigation isn't repeated.

**What would change the calculus:** a class/build where a ring set (Dark Maiden, Lolthian
Might) is actually BiS. There the single-slot search has a real blind spot, and the removed
ring-set pass — cheap and never-regressing — would be worth restoring/shipping.

---

## 12. RULINGS (owner spec) — summon SUPPORT/TEAM value + support-party UX (2026-07-17)

Surfaced running a HEALER build through the optimizer (Community-Meta video prep). The
summoned slot picked **Dread Warrior** (+5,000 Power, +5% Crit Severity, party, ~66% uptime)
over **Portobello DaVinci** (+3.5% Power, +3.5% Combat Advantage, party, 100% uptime in a
full party).

**OWNER RULING (hard spec, verbatim 2026-07-17):**
> "the power and ca are up all the time in endgame content where the dread warrior is not.
> plus the porto buffs the team"

Read: for a SUPPORT role (healer), endgame = full party, so party-scoped summon buffs are
always on (Portobello 100%) while Dread Warrior's is not (~66%); and a companion's value to
the TEAM (buffing allies' damage) is real healer value the objective must credit.

**FIX 1 — score a summon's PARTY-BUFF TEAM value for support roles (SCORING — the real gap).**
The summoned slot is scored purely on `realScore()` = the player's own heal throughput
(optimizer-local.js ~L182). A party buff only counts for the sliver that helps the healer's
OWN heal: Portobello's +Power helps a little, its +Combat Advantage helps a healer ZERO (CA
is not a heal weight, L82), and its buff to the GROUP's damage is never credited — burying
genuine support summons under self-heal-only scoring. FIX: for the heal/support objective,
add a team-buff-value term to the SUMMONED-companion score = the party buff's offensive
stats (Power/CA/Crit…) × uptime, so a healer's summon is valued for what it gives the party.
  OWNER WEIGHT (locked 2026-07-17): option (b) PARTIAL + TUNABLE. Team-buff offensive value
  is credited at a FRACTION of its DPS-equivalent, added to the summoned-companion score:
  `summonScore = ownHealValue + TEAM_BUFF_W * teamBuffOffensiveValue`, starting
  `TEAM_BUFF_W = 0.40` (single named constant, easy to dial after real-build testing).
  Rationale: flips clear cases (Portobello's always-on party Power > Dread Warrior for a
  healer) without auto-grabbing the biggest team-buffer when a genuine self-heal summon serves
  the healer better. Gate behind the HEAL_SUPPORT default (support/heal roles only; must NOT
  touch DPS/tank scoring). VERIFY on a real healer build before redeploy (paid-tool
  correctness gate). STATUS: weight locked; awaiting critic review, THEN implement — not yet
  in code.

**FIX 2 — make "assume support party" VISIBLE in the optimizer setup (UX). [SHIPPED 2026-07-17]**
Unlike the manual builder (explicit toggle), the optimizer setup has NO toggle:
`readAccountInputs()` derives `state.assumeSupportParty = supportComps.length > 0` on run
(~L3905). So filling "Standard set" / adding any support comp silently switches the whole run
to full-party scoring — the owner hit exactly this and didn't realize it was on. FIX
(shipped, source `js/optimizer-local.js` — SYNC RULE: re-copy to `premium/private/` + redeploy
to reach paid members): the setup panel now states that adding any comp switches the run to
full-party scoring (allies' buffs + your own party-scope summon buff count) and empty = solo.
  Polish TODO: a live on/off badge reflecting the current list state.

Data note: the "Standard set" comes from `meta_top_comps` (LIVE community meta), which today
reflects only the 2 unlocked DPS paragons — so it's "popular DPS summons" (Drizzt, Black
Scorpion, Flapjack, Spined Devil, Tutor), NOT a curated support set. Portobello is NOT in it
today, so it is NOT reserved-for-ally on a standard-set run. Improves as more paragons unlock.

**CRITIC REVIEW (2026-07-17) — found a BUG bigger than Fix 1; Fix 1 REVISED, not yet built.**
Diagnosis (a)-(d) CONFIRMED; Fix 2 APPROVED as shipped (2 minor follow-ups applied: doc line
citation corrected to ~L3905; Fix-2 "over-stacking CA" copy tightened — `_allyReserved` only
blocks self-summoning the SAME named companion an ally runs, not general stat coverage).

**BUG (higher priority than Fix 1) — own-summon party buff applied at FULL value, IGNORING
uptime** (toon-forge.html ~L11929-11960; identical ally-buff copy path ~L12039-12087). The
loop sums `sb.effects[].amount` / `sb.stats{}` straight into the player's sheet and never
reads `sb.uptime`. Dread Warrior's +5,000 Power / +5% Crit Sev (uptime 66) land at 100%, NOT
×0.66 — inflating its self-heal score; Portobello (no uptime field = 100%) is undamaged. The
same file already applies uptime for the CA-grant channel (~L11218: `uptime/100`); the
rating/percent channel just never got it — inconsistency, not a decision → FIX. Because
`realScore()` now DOMINATES the heal summon pick (post-2026-07-09 formula migration), this
inflation is likely a bigger cause of Dread-over-Portobello than the missing team value.
→ FIX THE UPTIME BUG FIRST, re-run the healer build; Portobello may win on corrected numbers
alone, which also gives Fix 1's weight a stable target to tune against.

**Fix 1 REVISED per critic (do NOT ship the original scope):**
1. Uptime fix first (above); tune TEAM_BUFF_W against the CORRECTED numbers, not today's.
2. Team-value = ALLY-ONLY share (party−1), NOT the raw buff amount — the healer's own share
   is already counted via realScore(); raw would double-count.
3. Implement in `expectedDamage()`'s `ROLE==='heal'` branch (own constant), NOT in
   `realScore()` — realScore() feeds every slot's marginal comparison AND the set-completion
   cost explainer (~L2374), so a companion constant there pollutes unrelated "% healing" text.
   Keep strictly inside the heal branch; must never touch DPS/tank.
4. OPEN OWNER DECISION: should HEAL_SUPPORT hard-FILTER the summon slot (as it filters the
   enhancement + mount-power pools) or stay a soft NUDGE? Default proposed: soft nudge for v1.
5. Deferred scope: the same blind spot exists on the healer's own MOUNT EQUIP power
   (partyEffects). Fix 1 handles the summon slot only; the mount analog is explicitly deferred.

**RESOLUTION (2026-07-17):**
- UPTIME FIX — SHIPPED to `toon-forge.html` (~L11940: own-summon rating/percent buff channel
  now ×uptime, missing field = 100%, matching the enemy-damage-boost path). VERIFIED via
  `scripts/_compare_summon_heal.js` on the saved Soulweaver healer (IL 138487, support party
  on): Dread Warrior 249,618 vs Portobello 247,288 heal throughput — Dread's lead collapsed
  to +0.93% (near-tie), confirming the ~33% over-credit was real. This corrects the DISPLAYED
  stat sheet for anyone running a <100%-uptime party summon, not just the optimizer's pick.
  Ships with a normal site deploy. Keep.
- FIX 1 (team-buff scoring) — DEFERRED (OWNER CALL 2026-07-17): the summoned-slot pick is
  low-stakes because users almost always change their summon to one of the community-meta
  top-5 summoned comps anyway, so a precise team-value score there isn't worth the paid-tool
  scoring risk. The design (0.40 weight, ally-only share, heal-branch only, HEAL_SUPPORT
  filter-vs-nudge open) stays spec'd above if ever revisited. NOT implemented.
- FIX 2 (UX visibility) — SHIPPED to `js/optimizer-local.js` (needs `premium/private/` re-copy
  + redeploy to reach members).

---

## §13 — Tank over-cap valuation + survival-score sensitivity (owner findings 2026-07-17)

Surfaced when the owner questioned an optimized tank build (it wore a *healer* chest
"Prismatic Bismuth Plate — Healer's Influence" id 512 and picked "Resiliency of the Depths"
over the owner's preferred Unholy Protection + Bulwark of Brimstone).

**Finding A — survival SCORE over-amplifies tiny mitigation differences near the self-heal
sustain floor.** `computeTankSurvivalScore`: `effTaken = max(expected·0.25, expected − healPerHit)`,
`score = maxHP / effTaken`. As `expected` shrinks toward `healPerHit`, `score` blows up
hyperbolically. Measured: the healer chest vs a tank chest differ by only ~2.5% in Effective HP
(23.39M vs 22.82M) but 4× in score (3304 vs 806) — a 2-pt Defense/Deflect cap-maintenance
difference misreported as a huge survivability gap. This makes the optimizer chase marginal
CR/cap-maintenance too aggressively (why the higher-CR healer chest won despite wasted
Forte/Outgoing-Healing named stats). eHP is the stable, honest metric; the score is not.
→ TASK 1: make the tank objective monotonic/stable (e.g. score on eHP, or saturate the
self-heal benefit so effTaken can't approach 0), so marginal cap-maintenance stops dominating.

**Finding B — over-cap stats are valued at ZERO, but the owner deliberately runs some over cap.**
Two cases:
  - General: the owner keeps Bulwark of Brimstone (+stats even over cap) and swaps creature/zone
    wards situationally; the optimizer zeroes the over-cap stats so it drops Bulwark for a flat
    −5% IDR overload (Resiliency of the Depths — also the one still-ungated overload; verify).
  - PALADIN-SPECIFIC (owner game-mechanics ruling 2026-07-17): the Justicar's **Divine Protection
    is tied to Critical Avoidance**, and spending Divinity drops it. So the owner intentionally
    stacks **Critical Avoidance ~10% OVER cap** so that when Divinity is spent, Crit Avoid is
    still at/near cap. For a Paladin, over-cap Crit Avoid has REAL value (a depletion buffer) —
    the tool's blanket "over-cap = worthless" headroom clamp is wrong here.
→ TASK 2: add a Paladin-only credit for over-cap Critical Avoidance up to ~cap+10% (a buffer),
  instead of zeroing it. Class/paragon-gated; must not touch other classes/stats.

Both are being worked 2026-07-17 (owner chose "both"). Sequenced: Task 1 (score stability,
affects all tanks) then Task 2 (Paladin Crit Avoid). Each investigate→design→critic→ship.

**TASK 1 RESOLUTION (2026-07-17):** tank optimizer `.score` changed from the unstable
`maxHP / effTaken` (hits-survived, hyperbolic near the self-heal floor) to
`eHP + healPerHit × REF_HITS` (REF_HITS=60). CORRECTION to Finding A's aside: eHP and
healPerHit are BOTH real-HP-scaled (eHP = maxHP·ratio; healPerHit from
computeGearHealProcPerSec = % of maxHP), so they add directly — the incompatible-scale
problem was only between healPerHit and the RELATIVE t.expected, not eHP (an earlier
draft that dropped sustain on a false "incompatible scale" claim was corrected after
critic review). Owner ruling: value PASSIVE self-heal procs (gear procHeal — no active
input, doesn't complicate tank play), NOT the castable heal power; computeGearHealProcPerSec
is gear-proc-only, so the credit hits exactly that. Modest (~+6% for a 0.64%-of-maxHP/hit
proc). `.score` is optimizer-only (realScore, scale-invariant proportional objective);
display reads .eHP/.mitigationPct. Fixed the AI-review backend unit label + progress
overlay + header comment in js/ AND premium/private/ optimizer-local.js (were "boss hits
absorbed"/"survival score" — false for the new metric). TASK 2 (Paladin over-cap Crit
Avoid) still pending.

**TASK 1 FINAL (2026-07-17, owner ruling):** after the sustain credit kept surfacing
valuation problems (hyperbolic blowup → false "incompatible scale" drop → additive credit →
unbounded-runaway BLOCKER → heal-ally over-credit), the owner chose the simplest, fully-bounded
option: **tank `.score` = pure Effective HP, no self-heal credit at all.** eHP is stable,
monotonic, matches the display. Supersedes the additive-credit resolution above.
KEPT as a separate correctness fix (surfaced by the owner): the 8 "heal an ally with an
Encounter" gear procs (Healer's Influence / Runefrost Mender lines — ids 36, 60, 512, 520,
532, 3177, 5353, 5498) now carry `requiresHeal: true` in gear.json, and computeGearHealProcPerSec
skips `requiresHeal` procs when role !== 'heal' — they never fire for a non-healer, so they must
not credit self-heal to a tank/DPS anywhere they're read (e.g. `.taken`). The 16 crit-triggered
self-heal procs are unaffected (fire automatically regardless of role). optimizer-local.js
labels/comments scrubbed of the (now-superseded) self-heal wording in BOTH js/ and
premium/private/ copies — AI-review backend `score.unit` and the progress-overlay unit are
"effective HP (mitigation + Max HP)"; the role-objective header + realScore comments no longer
claim a self-heal credit (critic round 3 caught one label twin left stale after the additive→pure-eHP
revert). TASK 2 (Paladin over-cap Crit Avoid) still pending.

**TASK 2 RESOLUTION (2026-07-17, owner ruling — an OPT-IN TOGGLE, not the always-on credit
originally proposed above).** The owner rejected touching the engine/score directly: *"leave
everything where it is and maybe build in … a toggle … for the optimizer to say that crit avoid
it 10% so that it tries to build 10% over — this is silent in the engine, never show, only by the
optimizer toggle."* So instead of an always-on Crit-Avoidance over-cap credit, TASK 2 shipped as a
**Paladin-only, opt-in optimizer toggle** in `js/optimizer-local.js` (the buffer must be invisible
everywhere except that it steers item/boon selection):

- **UI:** a checkbox in the Optimize dialog, *"Crit Avoidance buffer (+10% over cap …)"*, rendered
  ONLY when `state.class === 'Paladin'`. `OPT.critBuffer` / `tfOptimizerToggles.critBuffer`, default
  off. Subtext discloses it applies to the **Group-Role** build, not the ⚔ Damage objective.
- **Mechanism (isolated to SCORING only):** `caBufferBonus()` = 0 at/below the 90 cap, ramping
  linearly to 1 at uncapped ≥ cap+10 (uncapped = `ratingContribPct + percentTotal`, pre-clamp). Added
  to the tank AND heal branches of `expectedDamage()` weighted `× *_CAP_NUDGE` (0.002) — same bracket
  and weight as the existing cap nudge, so it can only win survivability-/heal-**neutral** ties
  (< ~0.2% of real eHP/healing), never trade a meaningful survivability delta for CA. Gated by
  `critBufferOn()` (`OPT.critBuffer && state.class === 'Paladin'`) → returns 0 (no-op) for everyone
  else; toggle-off is provably byte-identical to before.
- **Why NOT the cap ladder:** a first cut moved CA's cap-ladder target to cap+10, but `capsDoneOf()`/
  `fillOf()` also feed the member-facing "Build order: X of 5 mains at cap" note — so a buffer-on
  Paladin would have seen "4 of 5" while the sheet showed CA capped at 90 (a visible contradiction).
  Reverted; the ladder + flat-% weights are byte-unchanged. Every gear/enchant/overload/artifact/comp/
  boon candidate is already scored by the full `expectedDamage()` (`tryBest`/`boonReallocPhase`), so
  the single `caBufferBonus` nudge steers the search with no pruning exception needed.
- **Silence — verified across 4 critic rounds + headless runs:** engine hard-clamps CA `finalPct` at
  90 (toon-forge.html untouched); the build-order note, under-cap explainers, and tail note read the
  capped `finalPct` (CA never flagged); the tank tail is Power/Combat-Advantage (no CA). The one real
  leak the critic found — the Forgemaster **AI-review payload** (`runAiReview`→`slim()`), which quotes
  raw item stats & prose — is scrubbed when `res.critBuffer` (stamped on `runOptimize`'s return, since
  `critBufferOn()` is scoped to `runOptimize` and unreachable in the sibling `runAiReview`): CA is
  removed from `rating`/`percent` (cloned first — they alias shared GEAR_DATA), from `bonuses[].stat/
  name`, and from ALL free-text (`description`/`effect`/`proc.effect`/bonus `desc`) via
  `CA_RE = /Crit(ical)?\s*Avoid|\bCA\b/i` (the `\bCA\b` catches the data's bare-"CA" abbreviation used
  in ~9 proc descriptions; it over-redacts ~7 "CA damage"=Combat-Advantage lines on buffer-on runs —
  an accepted trade). Accepted residual (disclosed): the full `serializeBuild()` + raw diff item NAMES
  in the POST body bypass `slim()` and can't be scrubbed without breaking the review, so a
  Neverwinter-knowledgeable model could in theory infer over-cap CA from item names.
- **Empirical proof (headless optimize on the owner's tank "Erik", Paladin/Justicar):** toggle OFF the
  optimizer let CA drift to uncapped **91.34** (dropped CA rating 50→46.5) chasing neutral gains;
  toggle ON it held CA at uncapped **93.87** (kept CA rating maxed at 50) — a **+2.5-pt buffer above
  the 90 cap**, with the character sheet showing **90** in both cases. Cost: eHP 26.17M vs 26.30M
  (**≈0.5%**), the deliberate small tradeoff of building a depletion buffer. It reached +3.87 (not the
  full +10) because Erik's gear can't cheaply support more — the nudge correctly stops where further CA
  stops being worth it rather than forcing a large eHP loss.
- **Deploy:** `js/optimizer-local.js` is gitignored and served only on localhost (live-site optimizer
  delivery is still disabled pre-launch — see toon-forge.html), so this change is not committed. The
  `premium/private/optimizer-local.js` at-launch copy is ~918 lines BEHIND `js/` (predates the whole
  formula-driven migration, not just this toggle) — it needs a wholesale re-sync at launch prep, NOT a
  piecemeal hand-port; flagged to the owner as a separate decision.
- **Maintenance note (critic):** the AI-payload CA scrub is a denylist verified against the current
  gear.js/artifacts.js. Re-run the sweep (`Critical Avoidance` and `\bCA\b` in description/effect
  fields) against any future data additions before assuming full coverage.
