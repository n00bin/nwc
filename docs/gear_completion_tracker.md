# Gear Equip-Bonus Parse — Completion Tracker

**The one task:** drive the gear free-text equip-bonus backlog to zero so the
stat engine + optimizer can see every gear effect. This is the accountability
log for the hourly grounding loop. **Don't get sidetracked — finish this first,
THEN move to optimizer search work (A1).**

## Metric
- **`structurable_now`** = free-text bonuses that CAN be structured today → the
  real target. **Done = 0.**
- `dps_remaining` = the DPS-relevant subset (priority — the optimizer-vision lever).
- NOT counted (separate engine work, don't let them inflate the number):
  - `heal_blocked` (644) — heal/resource procs, need the Missing-1 engine layer.
  - `proc_skip` (225) — sequence-procs / damage-procs / by-design procs handled
    by other layers (computeSequenceProcBoost, procDamage).

## How a check works (hourly loop)
1. `cd website && python scripts/eb_census.py`
2. append a row below, compute delta vs the previous row
3. nudge n00b: remaining, stalled-or-progressing, exact next batch
4. when `structurable_now` hits 0 → milestone complete, stop the loop, move to A1

## Next batch (current pointer)
My lane = **non-set offense** bonuses at **IL < 3000** (the bulk of the
remaining DPS tail). Hand-map an explicit table like
`scripts/eb_parse_il3000_offense.py`, verify each against prose. Do NOT touch
SET bonuses — a concurrent session owns those (Tier-1/Tier-3a set transcription).

⚠️ **CONCURRENCY:** another session edits `gear.json` live. ALWAYS run
`scripts/eb_census.py` first; if `structured` moved without my edits, a session
is active — work in SMALL atomic apply→commit steps (a race already swept
batch-2 into their commit; data survived, but don't rely on that). Never rebuild
`data/gear.js` while they're active; let them own the build/deploy.

## Check-in log
| When | structurable_now | dps_remaining | Δ since last | Note |
|---|---|---|---|---|
| 2026-06-15 (baseline) | 711 | 420 | — | After endgame IL≥4000 offense batch (37 structured). IL<4000 DPS tail is next. |
| 2026-06-15 07:59 | 702 | 408 | −9 / −12 | Batch-2: IL≥3000 non-set offense (17 instances, 13 names) committed to parent. A concurrent set-bonus session is also reducing this; my edits got swept into their gear commit (data safe). |
