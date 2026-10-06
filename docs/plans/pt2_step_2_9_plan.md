# POWER-TAGS-2 step 2.9: the free simulator display (plan)

Written 2026-10-06. Nothing here is built yet. Part of `docs/plans/power_tags_2_plan.md`, Stage 2; locked by PT2-18
(the simulator is FREE: stat panel with the in-combat snapshot, derived states, a simulated fight with the player's own
powers in rule-built or typed order, per-power table, inside / outside call-window split, confidence line), PT2-13
(random picks stay with the player: Chaos Magic) and PT2-4 / PT2-5 (build states are derived; the snapshot view keeps
the peak, scoring uses the simulated value). Everything stays local-only until the one go-live.

## What the code does now

- **The rotation panel** (The Fight -> Powers, `renderRotationBuilder`, `#rotation-builder-box`) shows: magnitude/s,
  damage/s (2.4), the call-window split (2.5), the confidence line (2.6), the rule-built list and choices (2.8), stack
  and buff chips, "Top sources" by magnitude and a first-loop timeline (text). There is no per-power table and the
  timeline does not mark the call windows.
- **Bard songs never reach the simulator.** The kit has no songs (`pt2SimKit` passes none). The page has one old
  picker, `state.bardActiveSong`, which adds the chosen song's buff to the stat sheet (engine, ~line 15258).
  The data has no song slot count and no pin data; n00b 2026-10-06: one quick play slot for DPS (Minstrel two with
  Natural Talents), up to 4 pins that only show the button sequence.
- **No Spell Mastery picker.** `state.spellMasteryPower` is read by the simulator (Wizard Spell Mastery records and
  magnitudes) but nothing on the page sets it, so it is always empty.
- **No Chaos Magic picker.** `state.chaosMagicBuff` is read (the `pick:chaosMagicBuff:<value>` gates) but never set, so
  every Chaos Magic outcome counts zero.
- **No quick play choice.** `input.quickplay` (2.2 Bard) is never passed.
- **Build states are peaks everywhere.** `pt2KeyValue` answers chillStacks 6, stealthed yes, vengeful yes ... from the
  kit alone, in both the snapshot view and the optimizer's "average" scoring mode. Only `stack:` keys and the Curse
  read the simulation.

## What it should do

1. **Per-power table**: each power, mechanic and proc: casts, damage, share of the fight, damage per cast, inside /
   outside the call window.
2. **Timeline** marks each call window and what fired in it (artifact, mount power, held casts).
3. **Bard songs** reach the simulator (which songs: gap 2.9-A) and the rule-built rotation plays them (2.8 refresh
   rule). The old `bardActiveSong` picker retires for Bards on the fx simulator (saved builds still load).
4. **Quick play** choice (gap 2.9-B).
5. **Spell Mastery** (gap 2.9-C) and **Chaos Magic** pickers (the player's pick, PT2-13; none = zero).
6. **Scoring reads simulated build states**: in the "average" scoring mode the build states read the simulation
   (Chill average stacks, Stealth uptime, Vengeful uptime ...); the snapshot view keeps the peak (PT2-4).
7. Everything the player sets here saves with the build and loads from old builds without errors.

## How it is proved

- **Headless render** of every reference build (33) with no page errors (plan check).
- **Per-power table adds up**: its damage column sums to the fight total; inside + outside per row sum to the row.
- **Pickers round-trip**: a build saved with each picker set loads with the same values; old builds load with none.
- **Snapshot unchanged**: the in-combat view equals the step 2.8 baseline (peaks), only the scoring numbers move.
- **Live unchanged.**

## Decisions n00b locks before building (one at a time)

| Gap | Question | Recommended |
|---|---|---|
| 2.9-A | Bard songs: which songs can the simulator play? | **LOCKED 2026-10-06 (n00b: "we have tagged everything so everything that can and can not already holds a tag") = Recommended, availability from the tags.** Every song in the paragon's `powers.songs` list is playable (no slot count in the data); `requiresFeat` gates the Reprised Carols (Gambler); `tags.songType` (ballad / elemental / heal / utility) tells the rule-built rotation what each does; songs whose value is healing or utility do nothing for the damage score. The search tries each elemental song and each ballad and keeps the best. The old "active song" picker retires for Bards on the fx simulator; the `songsActive` class input becomes a simulated build state for scoring (the snapshot view keeps its value). |
| 2.9-B | Quick play: who decides which song sits in the quick play slot? | **LOCKED 2026-10-06 (n00b: "the optimizer is supposed to be doing the pick not the user; the only thing the user picks are the optimizer settings").** No player picker. The search decides: it tries no quick play and each eligible song in the slot (up to 1, Minstrel 2 with Natural Talents; manual-only songs excluded) and keeps the most damage; the panel shows the choice and what quick-playing each song would cost. RULE FOR THE REST OF PT2: in-game choices are made by the search, never a player picker. |
| 2.9-C | Spell Mastery: who picks the encounter in the slot? | Open. |

## Build order (one commit each, local only)

1. Per-power table and the timeline window marks.
2. Songs into the kit (2.9-A) and quick play (2.9-B); Bard parity kit B4 re-run on the page.
3. Spell Mastery (2.9-C) and Chaos Magic pickers; save / load.
4. Scoring reads simulated build states (average mode only).
5. Page test on the 33 builds, baseline, step log, `docs/toon_coverage.md`.
