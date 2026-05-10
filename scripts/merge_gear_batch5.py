#!/usr/bin/env python3
"""Merge gear_batch5_items.json into ../data/gear.json."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GEAR_PATH = ROOT / "data" / "gear.json"
BATCH_PATH = Path(__file__).resolve().parent / "gear_batch5_items.json"


def main():
    gear = json.loads(GEAR_PATH.read_text(encoding="utf-8"))
    batch = json.loads(BATCH_PATH.read_text(encoding="utf-8"))

    by_name = {item["name"]: i for i, item in enumerate(gear)}
    next_id = max((g.get("id", 0) for g in gear), default=0) + 1

    added, updated = [], []
    for entry in batch:
        name = entry["name"]
        entry.setdefault("ratingStats", {})
        entry.setdefault("percentStats", {})
        entry.setdefault("abilityBonuses", {})
        entry.setdefault("equipBonuses", [])
        entry.setdefault("notes", "")

        if name in by_name:
            idx = by_name[name]
            entry["id"] = gear[idx].get("id")
            gear[idx] = entry
            updated.append(name)
        else:
            entry["id"] = next_id
            next_id += 1
            gear.append(entry)
            added.append(name)

    GEAR_PATH.write_text(json.dumps(gear, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Merge complete:")
    print(f"  Added:   {len(added)}")
    print(f"  Updated: {len(updated)}")
    print(f"  Total in gear.json: {len(gear)}")


if __name__ == "__main__":
    main()
