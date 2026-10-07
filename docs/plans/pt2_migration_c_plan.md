# POWER-TAGS-2 Migration C: gear, companion and insignia procs onto the timeline (plan)

Written 2026-10-06. Nothing here is built yet. Added to `docs/plans/power_tags_2_plan.md` by lock 2.6-B (class procs
moved in step 2.6; gear / companion / insignia procs wait for this migration). Same process as Migration B: a dry-run
list n00b approves, then parity. Everything stays local-only until the one go-live.

## What the code does now

All of these are fight-long AVERAGES computed in the engine, then baked into the per-hit "build part" (step 2.4):

| Shape | Count | Today | Where |
|---|---|---|---|
| Gear `apProc` {ap, trigger, chance, icd} | 112 | Action Point Gain % = 100 x AP x procs/s / 40 | `_procConvert` (~13512) |
| Gear `cdProc` {seconds, trigger, chance, icd} | 52 | Recharge Speed % = 100 x seconds x procs/s | `_procConvert` |
| Gear `procDamage` {magnitude / flatDamage / percentMaxHP, trigger, chance, icd} | 57 | damage per hit = procs/s x amount / 2 hits/s | `computeGearProcDamagePerHit` (~13573) |
| Gear `procModel` {trigger, durationSeconds} + stat | 39 | stat x min(1, duration x trigger rate); chance and lockout ignored | `conditionalDamageUptime` (~13311) |
| Companion `procEffect` (active slots) | 120 powers (51 statEffects, 22 procDamage) | stat x uptime from the trigger TEXT by regex; damage as procs/s x magnitude | `pushCompanionPower` (~16347), `computeCompanionProcMagPerHit` (~13611) |
| Insignia `window` / `procDamage` (struck, kill, big hit, crit ...) | 15 | uptime / damage per hit, same rate table | insignia loop (~16721) |

- **One fixed rate table** (`procRatePerSec`): 2 hits/s, 1.4 at-wills/s, 0.3 encounters/s, 1 daily / 60 s, 0.3 hits
  taken/s, 0.02 kills/s ... - the same for every build, whatever your rotation does.
- **Trigger text is guessed by regex for companions**, with known misses: "Critically hit" (being crit by an enemy) and
  "When you fail to critically hit" both read as YOUR crits (2 per second); "Whenever you run", "After being revived",
  "While Controlled", "below 50% Health" fall to the generic 0.3/s.
- **Double counting risk**: the per-hit score always adds the averaged proc damage (`procMult`, `flatPerHit`) and the
  averaged proc stats sit in the build's base stats. If the simulator also fired them, they would count twice.

## What it should do

1. Each proc whose trigger the simulator actually produces becomes `fx` records on its item / companion power /
   insignia bonus (the effect vocabulary): fired by real casts, hits, crits, Combat Advantage hits, the call window,
   combat start - at the build's own rotation, not the fixed table.
2. Its averaged copy is left out of the per-hit run (the 2.4-B rule), so it counts once.
3. Expected values, no dice (2.6-A): damage adds its share per event; buffs / AP / cooldown cuts fire whole when the
   share reaches 100%; lockouts exact.
4. Today's damage score and the live site do not change (2.4-A).

## How it is proved

- **Dry-run list** (`docs/plans/migration_c_dryrun.md`): every proc with its trigger mapping, its records, and its
  status (moves / stays averaged / display only). **n00b approves before apply.**
- **Equality**: with the migration switched off, every number equals today's on the 33 builds.
- **Rate sanity**: for each trigger kind, the simulated proc count against the old table's (expected to differ: that
  is the point - listed per build).
- **Live unchanged.**

## Decisions n00b locks before building (one at a time)

| Gap | Question | Recommended |
|---|---|---|
| C-A | Which procs move onto the timeline? | **LOCKED 2026-10-06 (n00b: 1) = Recommended.** Every proc whose trigger the simulator produces: your hits, at-will hits, encounter / daily casts, your crits and non-crits, Combat Advantage hits (flank share), artifact and mount power use, combat start. Triggers on things the simulator does not model (being hit / crit by enemies, kills, deflects, big hits taken, healing, revives, running, being controlled) stay engine averages as today (PT2-16: no incoming-damage / healing timeline); tank and healer scores unchanged. Moved procs leave their averaged copy out of the per-hit run. |
| C-B | Flat-damage and %-of-max-HP procs: scaled by your damage stats or not? | **LOCKED 2026-10-06 (n00b: 1) = Recommended.** Today's rule: the tooltip number, not raised by Power / crit / Combat Advantage / damage bonuses; %-of-max-HP uses the engine's Max HP. Capture test added: does Daily Explosion's 16,336 change with a Power buff up on a dummy? The five "next enemy that attacks you" %-HP procs need the being-attacked fight fact (off by default) under C-A. |

**Gap list complete 2026-10-06.** Rescan: overload `window` procs (Aspect of Ice, on hit) are included with gear;
summoned companions' procEffect stays out (today they contribute only through the summoned buff); the companion
trigger-text mapping (including the known regex misses) is shown line by line in the dry-run list for approval.

## Build order (one commit each, local only)

1. Vocabulary additions (flat-damage hit, %-max-HP hit, Combat Advantage hit trigger) + validator.
2. Migration script + dry-run list (gear, companion, insignia) -> n00b approves.
3. Apply; the page passes equipped gear / companions / insignias as owners; the per-hit run leaves their averages out.
4. Equality and rate checks; baseline; docs.
