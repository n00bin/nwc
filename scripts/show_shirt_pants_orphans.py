"""Show all Shirt/Pants orphans organized by family."""
import json
from collections import defaultdict
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

orphans = [it for it in data if not it.get("set") and not it.get("source")
           and it.get("slot") in ("Shirt", "Pants")]
print(f"Total Shirt/Pants orphans: {len(orphans)}\n")

# Group by base name family (first 1-2 words)
families = defaultdict(list)
for o in orphans:
    n = o.get("name", "")
    # Use first 2 words to group
    parts = n.split()
    if len(parts) >= 2:
        key = " ".join(parts[:2])
    else:
        key = n
    families[key].append(o)

# Show families with 2+ entries first (likely Conduit pattern)
print("=== Families with multiple entries (likely Conduit stubs) ===\n")
for fam, items in sorted(families.items(), key=lambda x: -len(x[1])):
    if len(items) < 2:
        continue
    print(f"-- {fam} ({len(items)} items) --")
    for it in items:
        rs = list((it.get("ratingStats") or {}).keys())
        print(f"  id={it['id']:>5}  {it.get('slot'):>5}  IL={it.get('item_level'):>4}  {it.get('name')!r:50}  ratings={'/'.join(rs)}")
    print()

print("=== Single-family items (one-offs) ===\n")
for fam, items in sorted(families.items(), key=lambda x: -len(x[1])):
    if len(items) != 1:
        continue
    it = items[0]
    rs = list((it.get("ratingStats") or {}).keys())
    print(f"  id={it['id']:>5}  {it.get('slot'):>5}  IL={it.get('item_level'):>4}  {it.get('name')!r:50}  ratings={'/'.join(rs)}")
