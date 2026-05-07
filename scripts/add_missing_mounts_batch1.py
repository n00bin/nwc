#!/usr/bin/env python3
"""Add 6 missing mounts where all combat/equip powers already exist in our DB.

Each entry sourced from the NW Hub mount list paste (slot layout, combat
power, equip power). bonusRef=0 (informational only per project convention).
Source field left empty - n00b can fill in over time.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MOUNTS_PATH = ROOT / "data" / "mounts.json"

NEW_MOUNTS = [
    {
        "name": "New Year's Ox",
        "combat": "Tunnel Vision",
        "equip": "Hearty Resistance",
        "slots": ["Enlightened", "Illuminated", "Enlightened"],
        "notes": "Source from NW Hub mount list paste 2026-05-06: Rare. Likely from Lunar New Year / Feast of Lanterns event."
    },
    {
        "name": "Ornate Apparatus of Gond",
        "combat": "Tunnel Vision",
        "equip": "Rejuvenation",
        "slots": ["Crescent", "Enlightened", "Universal"],
        "notes": "Source from NW Hub mount list paste 2026-05-06: Epic. Variant of Apparatus of Gond family."
    },
    {
        "name": "Red-Hued Apparatus of Gond",
        "combat": "Tunnel Vision",
        "equip": "Rapid Accuracy",
        "slots": ["Crescent", "Enlightened", "Universal"],
        "notes": "Source from NW Hub mount list paste 2026-05-06: Epic. Variant of Apparatus of Gond family."
    },
    {
        "name": "Carmine Bulette",
        "combat": "Tunnel Vision",
        "equip": "Untouchable",
        "slots": ["Barbed", "Barbed", "Universal"],
        "notes": "Source from NW Hub mount list paste 2026-05-06: Rare. Variant of Bulette family."
    },
    {
        "name": "Sienna Tribal Lion",
        "combat": "Tunnel Vision",
        "equip": "Ferocity",
        "slots": ["Illuminated", "Crescent", "Universal"],
        "notes": "Source from NW Hub mount list paste 2026-05-06: Rare. Variant of Tribal Lion family (sibling of Eku's Titivated Lion)."
    },
    {
        "name": "Blueforged Rage Drake",
        "combat": "Explosive Equalizer",
        "equip": "Ruthless Efficiency",
        "slots": ["Barbed", "Illuminated", "Universal"],
        "notes": "Source from NW Hub mount list paste 2026-05-06: Epic. Variant of Rage Drake family."
    },
]


def main():
    with open(MOUNTS_PATH, encoding="utf-8") as f:
        mounts = json.load(f)
    with open(ROOT / "data" / "mount_combat_powers.json", encoding="utf-8") as f:
        cps = json.load(f)
    with open(ROOT / "data" / "mount_equip_powers.json", encoding="utf-8") as f:
        eps = json.load(f)

    cp_by_name = {p["name"]: p["id"] for p in cps}
    ep_by_name = {p["name"]: p["id"] for p in eps}
    existing_names = {m["name"] for m in mounts}
    next_id = max(m["id"] for m in mounts) + 1

    added = 0
    for spec in NEW_MOUNTS:
        if spec["name"] in existing_names:
            print(f"  SKIP {spec['name']!r} - already exists")
            continue
        cp_id = cp_by_name.get(spec["combat"])
        ep_id = ep_by_name.get(spec["equip"])
        if not cp_id or not ep_id:
            print(f"  FAIL {spec['name']!r} - missing power refs")
            continue
        entry = {
            "id": next_id,
            "name": spec["name"],
            "combatRef": cp_id,
            "equipRef": ep_id,
            "bonusRef": 0,
            "insigniaSlots": [{"allowed": [s]} for s in spec["slots"]],
            "notes": spec["notes"],
            "source": ""
        }
        mounts.append(entry)
        print(f"  ADD  id={next_id:4d}  {spec['name']!r:40s}  cp={cp_id} ep={ep_id} slots={spec['slots']}")
        next_id += 1
        added += 1

    with open(MOUNTS_PATH, "w", encoding="utf-8") as f:
        json.dump(mounts, f, indent=2, ensure_ascii=False)
    print(f"\nAdded {added} mounts. Total now: {len(mounts)}")


if __name__ == "__main__":
    main()
