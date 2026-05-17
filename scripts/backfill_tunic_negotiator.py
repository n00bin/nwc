"""Backfill the 5 Tunic of the X Negotiator orphans (Armor slot, IL 1223-1323).
Same Avernus family as today's Shirt/Pants Negotiator backfill — same set/source."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

# First show them
print("=== Tunic of the X Negotiator items ===")
TUNIC_IDS = {1464, 1465, 1466, 1467, 1468}
NOTE = ("Backfilled 2026-05-17 alongside same-family Avernus Conduit cleanup. "
        "Set name is best-guess (same Avernus campaign leveling line as "
        "Pants/Shirts of the X Negotiator/Interrogator).")

count = 0
for it in data:
    if it["id"] in TUNIC_IDS:
        it["set"] = "Avernus Campaign Leveling Armor"
        it["setSize"] = 2
        it["source"] = "Avernus Campaign"
        it["notes"] = NOTE
        count += 1
        print(f"  id={it['id']:>5}  IL={it.get('item_level'):>4}  {it.get('name')!r}")

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"\nBackfilled {count} entries. Total items: {len(data)}.")
