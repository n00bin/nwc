"""Backfill the 2 Enchanted Depthweave orphans (Cap + Coat) into Enchanted Depths Armor."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

TARGETS = {19, 20}
NOTE = "Set classified 2026-05-17 — matches sibling Enchanted Depths Armor pieces (Depthcured variants) at IL 3200 from same dungeon; n00b ack."

for it in data:
    if it["id"] in TARGETS:
        it["set"] = "Enchanted Depths Armor"
        it["setSize"] = 2
        it["source"] = "Lair of the Mad Dragon (Master)"
        it["notes"] = NOTE
        print(f"  Backfilled id={it['id']:>5}  {it.get('slot'):>9}  {it.get('name')!r}")

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"\nTotal items: {len(data)}.")
