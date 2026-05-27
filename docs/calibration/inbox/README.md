# Calibration Inbox — Organization

This is where raw screenshots land before they're processed into `data/*.json`.

## Folder Structure

```
inbox/
├── _pending_review/      → raw screenshots waiting for the cropper
├── _ready_for_db/        → cropped, awaiting renamer
├── _ready_to_add/        → cropped + renamed, awaiting intake
├── _already_in_db/       → archive of items already cataloged
├── _skipped/             → "come back to" pile (set-detail panels, weird formatting)
├── _trash/               → discarded (OCR garbage, mis-screenshots)
├── gear/                 → archived gear screenshots, per-class subfolders
│   ├── bard-gear/
│   ├── paladin-gear/
│   ├── ranger-gear/
│   ├── rogue-gear/
│   ├── warlock-gear/
│   └── accessories/      → unbound rings, amulets, belts, sashes, etc.
├── powers/               → archived class-power screenshots, per-class subfolders
│   ├── barbarian-powers/
│   ├── bard-powers/
│   └── … (one per class)
├── companions/           → companion screenshots (cards, enhancement icons, stats)
├── mounts/               → mount screenshots (cards, combat/equip powers, slots)
├── enhancements/         → companion enhancement icons
└── other/                → anything that doesn't fit the above
```

## Workflow

The six folders at the top (`_pending_review/`, `_ready_for_db/`, `_ready_to_add/`,
`_already_in_db/`, `_skipped/`, `_trash/`) form the **processing pipeline** that
applies to ANY type of screenshot — gear, powers, companions, mounts, etc.

```
   raw screenshots dropped in
              ↓
       _pending_review/         (1,469 files at last count)
              ↓
   python scripts/screenshot_reviewer.py
   ├ auto-crops via OCR
   ├ user reviews + manual crop if needed
   └ Pass → saves crop to _ready_for_db/
              ↓
       _ready_for_db/           (cropped, awaiting rename)
              ↓
   python scripts/screenshot_renamer.py
   ├ OCRs the crop to identify name + IL
   ├ user reviews proposed filename
   └ Pass → renames and moves to _ready_to_add/
              ↓
       _ready_to_add/           (cropped + named, ready for intake)
              ↓
   Hand off to Claude (or the intake script) for gear.json ingestion.
   After processing, screenshot moves into the right archive folder
   under gear/<class>-gear/ or powers/<class>-powers/ etc.
```

## Naming Convention

Files inside any archive folder use:
```
<Item Name>_IL<level>.png
```
e.g. `Wintermarked Hunter Hood_IL5700.png`. For set-bonus detail panels:
```
<Set Name>_set_details.png
```

## Cleanup History

- 2026-05-26: Initial reorganization. 1,978 loose PNGs from inbox root moved to
  `gear/_uncategorized/` for sorting. 18 existing class-batch folders moved
  into `gear/` or `powers/` parents.
- 2026-05-27: Built screenshot reviewer + renamer apps. Renamed
  `_uncategorized/` → `_pending_review/` and added `_approved/` (later renamed
  to `_ready_for_db/`), `_ready_to_add/`, `_already_in_db/`, `_skipped/`,
  `_trash/`. Date suffixes dropped from per-class archive folders
  (e.g. `paladin-gear-2026-05-25/` + `paladin-gear-2026-05-27/` → `paladin-gear/`).
- 2026-05-27: Workflow folders moved up one level — they were nested under
  `gear/` but the same pipeline applies to powers / companions / mounts too,
  so they now live at the inbox root.
