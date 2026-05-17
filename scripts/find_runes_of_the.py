"""Find Runes of the X items and their potential set name."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

orphan_ids = {96, 97, 98, 99, 100, 101}

print("=== 6 Orphan 'Runes of the X' entries ===")
for it in data:
    if it["id"] in orphan_ids:
        rs = it.get("ratingStats", {})
        print(f"  id={it['id']:>5}  {it.get('slot')}  IL={it.get('item_level')}  {it.get('name')!r}")
        print(f"    {dict(rs)}")
print()

print("=== Other 'Runes of the' or 'Runes' related items in data ===")
for it in data:
    n = it.get("name", "")
    if it["id"] in orphan_ids:
        continue
    if ("Runes of the" in n) or (n.startswith("Runes") and len(n) < 35):
        print(f"  id={it['id']:>5}  {it.get('slot'):>6}  IL={it.get('item_level'):>4}  {n!r:55}  set={it.get('set','')!r:30}  src={(it.get('source','') or '')[:50]!r}")

print()
print("=== Items at IL 3000 Pants with set names assigned (Runes era candidates) ===")
for it in data:
    if it.get("item_level") == 3000 and it.get("slot") == "Pants" and it.get("set"):
        print(f"  id={it['id']:>5}  {it.get('name')!r:55}  set={it.get('set','')!r:30}  src={(it.get('source','') or '')[:50]!r}")
