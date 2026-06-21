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
| 2026-06-15 08:16 | 702 | 408 | 0 / 0 | No change — held intentionally pending the concurrent set-bonus session. Next when clear: IL<3000 non-set offense. |
| 2026-06-15 09:16 | 702 | 408 | 0 / 0 | 2nd stall. `structured` flat at 3258 since 07:59 → concurrent session looks quiet. Coast likely clear to resume IL<3000 non-set offense. |
| 2026-06-15 10:16 | 702 | 408 | 0 / 0 | 3rd stall. Nothing blocking — concurrent session quiet, lane clear. This IS the sidetrack pattern. Need n00b's "go" to run the next batch. |
| 2026-06-15 11:16 | 702 | 408 | 0 / 0 | 4th stall, no n00b response. Nudge-only isn't converting. Suggested upgrading the loop to auto-run safe batches + report. |
| 2026-06-15 12:17 | 849 | 489 | +147 / +81 | Backlog GREW — concurrent session added a wave of set-bonus text (`heal_blocked` +398, `structured` flat at 3258). They're actively writing again → HOLD, don't race. Not a stall. |
| 2026-06-15 13:16 | 1304 | 811 | +455 / +322 | Still climbing — 2nd straight bulk-add wave (`structured` still flat 3258 = no one parsing, only adding text). Heavy data-growth phase; HOLD until totals plateau. Parsing a moving target is wasted. |
| 2026-06-15 14:16 | 1304 | 811 | 0 / 0 | PLATEAU — every metric flat for 1hr (their bulk-add paused). Tentative all-clear; one more flat check confirms it's safe to resume. Awaiting n00b "go"/"auto". |
| 2026-06-15 15:16 | 1304 | 811 | 0 / 0 | ALL-CLEAR CONFIRMED (2 flat hrs). Lane clear, but resume needs n00b authorization (absent ~8h). Standing the hourly loop DOWN to stop pinging an empty room — resume instantly on "go"/"auto". |
| 2026-06-21 14:36 | 1494 | 931 | −46 (batch-3) / net +190 since 6/15 | Batch-3 IL2000-2999 offense: 46 instances / 23 names applied & verified (scripts/eb_parse_il2000_offense.py, committed website a0142a5). NET backlog up vs 6/15 — other sessions bulk-added ~236 more gear bonuses. ⚠️ gear.json NOT committed by me: a concurrent session has it dirty (uncommitted re-verify edits); batch-3 reproducible from script, will land via their commit. **LESSON: check `git diff` CONTENT before writing gear.json, not just the commit log — uncommitted writers don't show in `git log`.** |
