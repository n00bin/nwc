"""Backfill the 4 orphan IL 4550 armor pieces with set: 'Supreme Dominion Armor'.

Pattern-match basis: same IL, same 9-class roster, same '(Ascendant)' equip-power
suffix, same naming convention as 8 existing pieces already in that set.
Source left empty for now (consistent with siblings)."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

ORPHAN_IDS = {25, 37, 40, 41}
NOTE = "Set classified 2026-05-17 from naming/equip-power pattern match against 8 sibling Supreme Dominion pieces; n00b ack."

count = 0
for it in data:
    if it["id"] in ORPHAN_IDS:
        it["set"] = "Supreme Dominion Armor"
        it["setSize"] = 2
        it["tier"] = "Ascendant"
        it["notes"] = NOTE
        count += 1
        print(f"  Backfilled id={it['id']:>5}  {it.get('slot'):>8}  {it.get('name')!r}")

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"\nUpdated {count} entries. Total items: {len(data)}.")
