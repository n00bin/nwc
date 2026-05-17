"""Show all IL 4550+ orphan items (Mod 27 endgame cluster)."""
import json
from collections import defaultdict
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

orphans = [it for it in data if not it.get("set") and not it.get("source")
           and (it.get("item_level") or 0) >= 3000]

print(f"=== Orphans at IL 3000+ (modern cluster): {len(orphans)} ===\n")

# Group by slot
by_slot = defaultdict(list)
for o in orphans:
    by_slot[o.get("slot", "(none)")].append(o)

for slot in ["Main Hand", "Off Hand", "Head", "Armor", "Arms", "Feet",
             "Shirt", "Pants", "Belt", "Neck", "Ring"]:
    items = by_slot.get(slot, [])
    if not items:
        continue
    items.sort(key=lambda x: (x.get("item_level") or 0, x.get("name", "")))
    print(f"--- {slot} ({len(items)}) ---")
    for o in items:
        rs = list((o.get("ratingStats") or {}).keys())
        cls = o.get("allowedClasses") or []
        cls_str = ",".join(cls) if cls else "univ"
        print(f"  id={o['id']:>5}  IL={o.get('item_level'):>4}  {o.get('name')!r:55}  ratings={'/'.join(rs):<55}  {cls_str}")
    print()
