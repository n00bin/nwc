#!/usr/bin/env python3
"""Enrich Dragonborn racial traits in data/races.json with verified effect data
from in-game screenshots (n00b, 2026-06-09). These traits previously held only a
name with no effect text. Idempotent.
  python apply_barbarian_racials.py            # dry-run
  python apply_barbarian_racials.py --apply    # write data/races.json
"""
import json, sys
from pathlib import Path

P = Path("G:/ai_projects/nwcb/data/races.json")
APPLY = "--apply" in sys.argv
d = json.loads(P.read_text(encoding="utf-8"))

# Verified in-game 2026-06-09. Bonuses are percent (NW racial "3% Power" etc.).
TRAIT_DATA = {
    "Dragonborn Fury": {
        "description": "You gain a bonus 3% Critical Strike and 3% Power.",
        "effects": [
            {"stat": "Critical Strike", "amount": 3, "type": "percent"},
            {"stat": "Power", "amount": 3, "type": "percent"},
        ],
    },
    "Metallic Ancestry": {
        "description": ("You receive 3% more healing from all spells and abilities. "
                        "Your Maximum Hit Points total is 3% higher than that of other species."),
        "effects": [
            {"stat": "Incoming Healing", "amount": 3, "type": "percent"},
            {"stat": "Maximum Hit Points", "amount": 3, "type": "percent"},
        ],
    },
}

changes = []
for race in d:
    for tr in race.get("traits", []):
        td = TRAIT_DATA.get(tr.get("name"))
        if td and tr.get("description") != td["description"]:
            tr["description"] = td["description"]
            tr["effects"] = td["effects"]
            changes.append(f"{race['name']} / {tr['name']}")

print(f"{len(changes)} trait enrichment(s):")
for c in changes:
    print("  -", c)

if APPLY:
    P.write_text(json.dumps(d, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("WROTE", P)
else:
    print("(dry-run; pass --apply)")
