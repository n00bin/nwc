# Gear data audit — screenshot vs DB

Goal: verify every gear item in `../data/gear.json` against its in-game screenshot
under `docs/calibration/inbox/gear/<class>/<slot>/`, and correct wrong data.

## Infrastructure (built 2026-06-03)
- `scripts/_audit_manifest.py` → builds `docs/audit/gear_audit_manifest.json`,
  matching each screenshot to its DB entry by name + item level.
- `scripts/_audit_novision.py` → categorizes the no-vision (name/IL) findings.

## Scale
- 6,382 gear entries in the DB.
- 7,019 gear screenshots (filenames encode `Name_ILxxx`).
- 6,249 screenshots matched to a DB entry (the verifiable set).
- 2,889 DB entries have no screenshot (can't verify this way).

## No-vision findings (name + item-level only — NOISY, need confirmation)
These come from name/IL matching alone, so they include real issues AND matching
artifacts (accented names, "· IL xxx" embedded in some DB names, slot synonyms):
- ~407 screenshots at an IL tier the DB lacks → DB may be **missing IL tiers**
  (e.g. Aboleth Rapier has 500/650/800 screenshots but only IL 350 in the DB).
- ~387 screenshots whose name isn't in the DB → **possibly-missing items**
  (heavy on "Vambraces"-named arms).
- A systematic naming split: game says **"Vambraces"**, DB often says **"Bracers"**
  for the same arm slot — needs a decision (rename DB to match the game?).
- 3 filename typos (e.g. "Pulsar Coif_IL26000" = extra zero) — screenshot naming,
  not DB errors.
- No mojibake/encoding bugs in DB names (the "Pi�a" hit was a terminal artifact).

## Value-level verification (the real audit) — BLOCKED on tooling
Verifying actual stat values / equip bonuses requires reading each screenshot.
Per the intake pipeline, screenshots **must be 2× upscaled** before a vision read
or the values get fabricated. This environment has **no Pillow and no ImageMagick**,
so the value sweep can't run reliably yet.

To unblock: `pip install Pillow` (then a chunked, class-by-class vision sweep,
~6,249 reads, each comparing the screenshot's real stats to the DB entry).
