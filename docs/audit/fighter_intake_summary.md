# Fighter Gear Intake — 2026-06-12

Processed **582** in-game "Inspect → collection" screenshots of a Fighter's gear
collection (provided by n00b). Tooltip position varied by collection tab, so a
generous universal left-panel crop was used, upscaled 2× before reading (native
res fabricates stats). 18 vision passes extracted 518 item tooltips; 64
set-detail panels were captured but mostly clipped (skipped — set bonuses sourced
from existing DB members instead).

## Result
- **503 new gear entries** added to `../../data/gear.json` (ids 6878–7380),
  rebuilt into `data/gear.js`.
- Fighter weapon coverage: **Main Hand 3 → 132, Off Hand 4 → 133, Artifact
  Equipment 0 → 32** (290 weapons; was the core of Report #112).
- Armor: 213 pieces (Head/Armor/Arms/Feet) across Drowcraft, Dragonflight,
  Lionsmane, Lion Guard, Halaster's Successor, Primal, Dusk, Adamant, Titansteel,
  Bronzewood, Alliance, Pioneer/Pilgrim/League's, Shieldlord's, Huntsman,
  Thayan Servitor.
- 7 items skipped as already Fighter-usable in the DB; 1 skipped (Faulty Mirage
  Shield — placeholder item, no stats). 36 shields that shared a name+IL with a
  Paladin-only DB entry were correctly added as separate Fighter entries (class
  variants, often different stats — e.g. Antique Shield of the Vale).

## Method notes
- Stat names normalized to DB canon ("Deflection" → "Deflect").
- Weapon "Damage" stored in `ratingStats`. `combinedRating` is display-only
  (not used by the engine).
- Set bonuses (class-agnostic) copied from existing same-set DB members onto the
  new Fighter pieces — 334 of 346 set items now carry their full 2-piece bonus.

## Follow-ups
- **3 sets new to the DB, added without a structured set bonus** (need an
  in-game 2-piece detail capture): **Umbral Convergence**, **Umbral Convergence
  (Greater)**, **Weapons of the Shieldbearer**. Items exist and count their
  stats; only the set bonus is pending.
- **Dragon Bone Trident** (IL 800): tooltip showed no Combined Rating line;
  stored as null (harmless — display only).
- **Cleric weapons still missing** (separate from this Fighter batch): Report
  #112 also asked for the Cleric off-hand and missing Warden of the Last Rite
  tiers — no Cleric screenshots were provided, still outstanding.

**Archiving:** each screenshot was cropped to a tight native tooltip image,
renamed `<Item>_IL<level>.png`, and filed into the standard gear archive
`docs/calibration/inbox/gear/fighter-gear/<slot>/` (slot dirs: main-hand,
off-hand, artifacts, heads, chest, arms, feet, neck) — 511 item crops + 64
set-detail crops, gitignored/local-only. Working files (2×-upscaled crops,
extraction JSONL, scripts) live in `docs/audit/fighter_intake/` (gitignored).
Raw full-screen originals were deleted after the per-item crops were archived.
