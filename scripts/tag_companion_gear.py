#!/usr/bin/env python3
"""Tag-only pass on data/companion_gear.json:

- Add `slot` field (Neck / Waist / Ring) inferred from item name.
- Add `tier` field ("Thayan") so future tiers can be added cleanly.
- Normalize shape toward gear.json (percentStats, equipBonuses empty, etc.).
- Idempotent.

NW companion gear has 3 slots:
- Neck:  Necklace / Talisman / Tome / Grimoire / Icon
- Waist: Belt / Girdle / Sword Knot
- Ring:  Ring
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PATH = ROOT / "data" / "companion_gear.json"

NECK_KEYWORDS  = ("Necklace", "Talisman", "Tome", "Grimoire", "Icon")
WAIST_KEYWORDS = ("Belt", "Girdle", "Sword Knot", "Sash")
RING_KEYWORDS  = ("Ring",)


def infer_slot(name):
    for kw in NECK_KEYWORDS:
        if kw in name:
            return "Neck"
    for kw in WAIST_KEYWORDS:
        if kw in name:
            return "Waist"
    for kw in RING_KEYWORDS:
        if kw in name:
            return "Ring"
    return None


def infer_tier(name):
    # First word in our current data is the tier label.
    return name.split()[0]


def main():
    items = json.loads(PATH.read_text(encoding="utf-8"))
    unmapped = []
    for it in items:
        slot = infer_slot(it["name"])
        if slot is None:
            unmapped.append(it["name"])
            continue
        it["slot"] = slot
        it["tier"] = infer_tier(it["name"])
        it.setdefault("percentStats", {})
        it.setdefault("abilityBonuses", {})
        it.setdefault("equipBonuses", [])
        it.setdefault("notes", "")
        it.setdefault("source", "")

    PATH.write_text(json.dumps(items, indent=2, ensure_ascii=False), encoding="utf-8")
    by_slot = {}
    for it in items:
        by_slot.setdefault(it.get("slot", "?"), []).append(it["name"])
    print(f"Tagged {len(items)} companion gear entries.")
    for slot, names in sorted(by_slot.items()):
        print(f"  {slot}: {len(names)}")
        for n in names:
            print(f"    - {n}")
    if unmapped:
        print(f"\n  WARN: {len(unmapped)} unmapped: {unmapped}")


if __name__ == "__main__":
    main()
