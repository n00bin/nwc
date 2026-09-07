# v1.1 Blind-Spot Sweep — make the optimizer see everything it scores

**STATUS: IN PROGRESS (go from n00b 2026-09-07). Batch 1 shipped; see the status block at the end.** n00b locked
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

---

## Status 2026-09-07 — go received, batch 1 shipped

n00b: "let's go back to work: equip bonuses that are broken or text only or
placeholders or partials." Set bonuses were cleared first the same day
(`docs/audit/set_bonus_audit_2026-09-07.md`, ~75 sets, 283 placeholders).

**Batch 1 (IL >= 3000, `scripts/_eb_wire_batch1.py`, idempotent):**
- A1: 24 text-only stubs deleted (structured same-name sibling on the same item;
  kept when the stub was the only carrier of the full tooltip — Manticore's
  Mane Bite / Charging Bull keep their proc text next to the appended rider).
  3 exact duplicate blind entries removed.
- A2: 37 bonuses structured from own text, incl. the reverted 2026-08-04 batch
  (253, 5410, 6849, 7384, 6860, 6865) and the "next up" list (313, 286, 6853,
  6855 — 3978's conflicting text still to reconcile). New convention: "next
  Encounter after a Daily" family (Battle Reserves, Focused Burst, Vital
  Onslaught, Malignant Energy) -> `Encounter Dmg Bonus` at 0.11 uptime
  (1 of ~9 encounter casts per 30s cooldown); 3-strike variant 0.6.
- Fix: "Action Points less than 80%" family pinned to `uptimeOverride 0.75`
  (classifier read "less than" as a low-HP threshold = 0.15). 9 entries.
- Verified headless: every structured entry credits (engine contributors), no
  page errors.

**Still blind at IL >= 3000 (by design, A3/A4):** Butcher's Zeal x2, Critical
Charge, Executioner's Zeal, Encounter Reprieve x4, Skirmisher's Zeal, Pressured
Muse, Medic's Haste (resource/cooldown); Fount of Healing x4, Executioner's
Remedy x2 (heal); Explosive Force, Pact of Vengeance, Power at Any Cost,
Critical Force x2, Manticore's/Charging Bull proc halves (flat damage / threat);
Charged At-Will + the two Bloodwoven blanks (A4 screenshots).

**Next:** A2b e50971a verify-then-restore (82 items), then the IL < 3000 tail
(census: ~1,144 parseable-% + 360 parseable-rating instances, mostly IL<3000),
then A3 as a design gap.

**Batch 2 (IL < 3000 tail + A2b, `scripts/_eb_wire_batch2.py`, idempotent) — shipped same day:**
- ~55 bonus NAMES with a rule each (shape from the name, magnitude regex-parsed from
  the item's own text): 106 instances structured. Unparsed by rule: 7 (Manticore
  IL<3000 texts have no rider; two Brute's Expertise phrasings).
- A1 at every IL: 95 stubs removed; 85 exact duplicate text entries removed.
- A2b: 43 of 82 still differed from baseline — all but 3 sets were already
  restored/re-shaped (perStack forms) or are contradicted by current text
  (Oathbreaker Forte 7200, Spine of Dominion CS vs CSev, Dark Maiden 3000 vs
  5000). Restored with `parsedFrom: baseline-420454c` + screenshot-wanted note:
  Wrathful Bindings (-5% Incoming Damage), Magmatic Efficiency (+2% Power/Forte/
  Defense), Diamond (Dashing Decoy -5% Incoming / +5% Awareness).
- Census after batch 2: structured 5880 / engine-blind 3560 instances
  (`docs/audit/structured_coverage.md`). What is left is A3 (resource / heal /
  cooldown / flat-damage procs — a design gap), by-design text (movement-only,
  vanity IL<700 effects, enemy debuffs, zone-only trivia), and A4 screenshots.

**Open design gap for n00b (A3):** ~700 surfaces need an engine bucket — AP /
resource gain, heal-on-hit / orbs, cooldown reduction, flat-magnitude damage
procs, incoming-damage riders. Options: (1) score as display-only forever,
(2) add a "utility value" side-score the optimizer can weight per role,
(3) map the DPS-relevant subset (flat-damage procs -> burst share like mount
combat powers; cooldown reduction -> Recharge Speed equivalent) and leave
heal/resource for the heal-sim layer. Needs a lock before any data work.

**Correction (same day):** 6 'next Encounter after a Daily' entries had been structured as `Encounter Dmg Bonus` in batches 1-2 while `computeSequenceProcBoost` already models that sentence at runtime from the text (Note-2) -> double count. Reverted to text-only (note on the entry); riders kept; both batch scripts now refuse to structure a `SEQ_RE` match. Vital Onslaught / Raging Rally ('next three strikes') do NOT match the runtime regex and stay structured.
