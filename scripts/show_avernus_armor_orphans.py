"""Show all IL 1225-1250 armor orphans (Avernus era, excluding already-fixed Forsaken)."""
import json
from collections import defaultdict
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

orphans = [it for it in data
           if not it.get("set") and not it.get("source")
           and it.get("slot") in ("Head", "Armor", "Arms", "Feet")
           and 1225 <= (it.get("item_level") or 0) <= 1250]

print(f"Total Avernus-era armor orphans (IL 1225-1250): {len(orphans)}\n")

by_slot = defaultdict(list)
for o in orphans:
    by_slot[o.get("slot", "(none)")].append(o)

for slot in ["Head", "Armor", "Arms", "Feet"]:
    items = by_slot.get(slot, [])
    if not items:
        continue
    items.sort(key=lambda x: (x.get("item_level") or 0, x.get("name", "")))
    print(f"=== {slot} ({len(items)}) ===")
    for o in items:
        rs = list((o.get("ratingStats") or {}).keys())
        cls = o.get("allowedClasses") or []
        cls_str = ",".join(cls) if cls else "univ"
        print(f"  id={o['id']:>5}  IL={o.get('item_level')!s:>5}  {o.get('name')!r:50}  ratings={'/'.join(rs)[:45]:<45}  {cls_str}")
    print()
