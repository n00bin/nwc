"""Fix the 3 modern straggler orphans:
- Backfill id 0 (Voidcaller's Treatise IL 4000) into Soulpiercer (Greater)
- Delete id 207 (Oathbreaker's Malevolence IL 3400 Variant - stub)
- Delete id 217 (Prismatic Crystalgard Gauntlets - stub)
"""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

DELETE_IDS = {207, 217}
before = len(data)

for it in data:
    if it["id"] == 0:
        it["set"] = "Soulpiercer (Greater)"
        it["setSize"] = 2
        it["source"] = "Shackles of Divinity (Master)"
        it["notes"] = "Set classified 2026-05-17 — IL 4000 Master variant of Voidcaller's Trace (IL 3800 Advanced, Soulpiercer). n00b ack."
        print(f"  Backfilled id={it['id']:>5}  {it.get('name')!r} -> Soulpiercer (Greater)")
    if it["id"] in DELETE_IDS:
        print(f"  Deleting   id={it['id']:>5}  {it.get('slot'):>6}  {it.get('name')!r}")

data = [it for it in data if it["id"] not in DELETE_IDS]
PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"\nBefore: {before} items; After: {len(data)} items (removed {before-len(data)}).")
