"""Find context for the 3 modern straggler orphans."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

print("=== id 0: Voidcaller's Treatise context ===")
for it in data:
    if "Voidcaller" in it.get("name", ""):
        print(f"  id={it['id']:>5}  IL={it.get('item_level'):>4}  {it.get('slot'):>9}  {it.get('name')!r:50}  set={it.get('set','')!r}  src={(it.get('source','') or '')[:50]!r}")

print("\n=== id 207: Oathbreaker's Malevolence (IL 3400 Variant) context ===")
for it in data:
    if "Oathbreaker's Malevolence" in it.get("name", ""):
        print(f"  id={it['id']:>5}  IL={it.get('item_level'):>4}  {it.get('slot'):>9}  {it.get('name')!r:50}  set={it.get('set','')!r}  src={(it.get('source','') or '')[:50]!r}")

print("\n=== id 217: Prismatic Crystalgard Gauntlets context ===")
for it in data:
    n = it.get("name", "")
    if "Prismatic" in n or "Crystalgard" in n:
        print(f"  id={it['id']:>5}  IL={it.get('item_level'):>4}  {it.get('slot'):>9}  {n!r:50}  set={it.get('set','')!r}  src={(it.get('source','') or '')[:50]!r}")
