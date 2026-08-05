# v1.1 Blind-Spot Sweep — make the optimizer see everything it scores

**STATUS: PLAN ONLY (2026-08-04). Nothing here is implemented.** n00b locked
`OPT-V1.1 = A` as the *direction* for the next version; implementation waits
for an explicit go. A trial batch of 6 items was briefly shipped 2026-08-04
and **reverted the same day** (parent `485f936` → revert `451bfa2`) — the
per-item analysis below is real and verified, only the data changes were
backed out.

The optimizer/engine can only value bonuses that carry structured
`{stat, amount}` fields. This sweep closes the gap between what tooltips say
and what the score sees, endgame-first.

Canonical census: `python scripts/audit_structured_coverage.py` →
`docs/audit/structured_coverage.md`. At sweep start (2026-08-04):
**gear 7,820 bonus surfaces / 4,249 visible / 533 intentional / 3,038 blind.**

## Rules (unchanged from the June sweeps)
1. **Own-text only**: a magnitude is written to `stat`/`amount` only when the
   item's OWN stored description states it. Same-name bonuses on other items
   supply the SHAPE (perStack/maxStacks/alwaysActive/uptimeWeighted), never
   the number — magnitudes vary by item (Renegade's Stamina: 1.4/2.0/3.0).
2. `parsedFrom: "description"` provenance on every converted entry.
3. No fabrication: blank descriptions stay blank until screenshot-verified.
4. e50971a restores are verify-then-restore, never blind
   (`docs/audit/_e50971a_dropped_structured.json`, 82 items).

## Work queues

### A2 — structure-from-own-text (IL≥3000 first)
Triage 2026-08-04 of the 97 blind bonuses on 94 items at IL≥3000:
~55 stat-parseable, ~23 resource/heal procs (A3), 4 blank (A4), 14 bespoke.

- **Batch 1 (analyzed + verified, REVERTED — ready to reapply on go):**
  253 Rotsteel Hoop (Charged Fortitude Defense 5, twin 5409), 5410
  Rimetouched Coil (Divine Blessing L Forte 4, twin 548), 6849 Whispersilk
  Boots + 7384 Cindersilk Shoes (Discharged Force CritSev 7 always-on, twin
  3278), 6860 Oakenthorn Vambraces (Renegade's Stamina 1.4×5, same as #236),
  6865 Ambersteel Greaves (Renegade's Footwork MoveSpd+RechSpd 1×5, twin
  1097). Exact edits recoverable from reverted parent commit `485f936`.
- **Next up (hand-review, own text explicit):** 313 Deathsilver Loop
  (Challenger's Lethality 0.4% CS+CSev ×10, vs-1-enemy condition), 286
  Sabatons of the Flayed Legion (Malignant Energy +60% next Encounter —
  needs uptime judgment), 6853 Gladebind Greaves (Past Regards 5000 Power
  proc — procstat/uptimeWeighted shape), 423 Butcher's Zeal, Arcane/Mystic
  Conduit clothing rows (441/443/445–449/452/453/455/456), 6855+3978
  Defender Strike (**conflicting stored texts** between the two carriers —
  reconcile first, then structure both halves: IncDmg −1×5 + BDB 1×5).

### A1 — same-item duplicate stubs (~25)
Items carrying a RAW entry whose SAME-NAME structured sibling already exists
on the same item with the same/fuller text (85, 255, 256, 309, 532, 3181,
6859, 36, 58, 60, 81, 111, 204, 228, 244, 310, 311, 378, 379, 380, 384, 385,
421, 447, 448, 449…). Value already counted; the RAW copy likely
double-renders on the gear card. **Verify the render before deleting.**

### A2b — e50971a verify-then-restore (82 items)
Worklist already prepared: `docs/audit/_e50971a_dropped_structured.json`.
Restore only entries whose values survive scrutiny (some baseline values are
known-wrong; June sweeps deliberately re-shaped others).

### A3 — engine-layer procs (needs a design gap with n00b — NOT parseable)
~737 census surfaces have nowhere to put their value: resource gen (AP/
divinity/stamina ~239), heal procs ~190, recharge/cooldown ~159,
incoming-damage riders ~92, flat-magnitude damage procs ~57. Define scoring
conventions (or explicit display-only status) before touching.

### A4 — blocked on screenshots (n00b, when convenient)
- Bloodwoven (IL3150, blank/unverifiable text): **Medic's Haste** (415),
  **Skirmisher's Zeal** (419), **Charged At-Will** (422 — Dragonhide text
  exists at IL1900/15% but magnitude unverified for Bloodwoven).
- **Wizard class powers — all 27 stale** (docs/audit worklist from the
  2026-07-14 class power sweep). Biggest realScore distortion left.

### Deferred
IL<3000 long tail (~686 items) — after the endgame set is clean.
