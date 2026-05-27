# Calibration Inbox — Organization

This is where raw screenshots land before they're processed into `data/*.json`.

## Folder Structure

```
inbox/
├── gear/                  → gear/item screenshots
│   ├── _uncategorized/    → loose files awaiting sorting into a batch
│   └── <batch folders>    → e.g., paladin-gear-2026-05-25
├── powers/                → class power screenshots (At-Will, Encounter, Daily, Class Feature)
│   └── <batch folders>    → e.g., barbarian-powers-2026-05-16
├── companions/            → companion screenshots (cards, enhancement icons, stats)
├── mounts/                → mount screenshots (cards, combat power, equip power, insignia slots)
├── enhancements/          → companion enhancement icons (small icons cropped from tooltips)
└── other/                 → anything that doesn't fit (artifacts, consumables, boons, etc.)
```

## Naming Convention for Batch Folders

When intaking a new batch, create a subfolder named:

```
<class>-<type>-YYYY-MM-DD
```

Examples:
- `paladin-gear-2026-05-25` — Paladin gear screenshots intaken on May 25
- `bard-powers-2026-05-13` — Bard class powers
- `warlock-gear-legacy-2026-05-13` — extra qualifier OK (e.g., "legacy")

For non-class-specific items, drop the class prefix:
- `mounts-2026-06-01`
- `companions-2026-06-01`

## Filename Convention Inside Batches

```
<Item Name>_IL<level>.png
```

Examples:
- `Wintermarked Hunter Hood_IL5700.png`
- `Trailblazer's Axes_IL500.png`

For set-bonus detail panels, append `_details`:
- `Wintermarked Grimoire of Rime_IL5800_details.png`

## Workflow

1. New screenshots arrive (usually OneDrive Screenshots folder or a specific drop folder).
2. **Read them** to identify name + item level.
3. **Rename** to the convention above.
4. **Move** into the right batch folder under `gear/`, `powers/`, etc.
5. Run the appropriate intake script (e.g., `scripts/add_<class>_intake_<date>.py`).
6. After intake, the batch folder serves as the source-of-truth screenshot archive — don't delete it; future verification depends on it.

## Cleanup History

- 2026-05-26: Initial reorganization. 1,978 loose PNGs from inbox root moved to `gear/_uncategorized/` for later sorting into batches. 18 existing class-batch folders moved into `gear/` or `powers/` parents.
