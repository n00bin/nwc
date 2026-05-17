"""Find all Bloodwoven and related items to identify the set name."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

print("=== All Bloodwoven items ===")
for it in data:
    if "Bloodwoven" in it.get("name", "") or "Bloodwoven" in (it.get("set") or ""):
        s = it.get("set", "")
        src = it.get("source", "")
        print(f"  id={it.get('id'):>5}  IL={it.get('item_level'):>4}  {it.get('slot'):>9}  {it.get('name')!r:50}  set={s!r}  src={src[:50]!r}")

print("\n=== All IL 3150 Shirt/Pants with set names assigned (find Bloodwoven era) ===")
for it in data:
    if it.get("item_level") == 3150 and it.get("slot") in ("Shirt", "Pants") and it.get("set"):
        print(f"  id={it.get('id'):>5}  {it.get('slot'):>9}  {it.get('name')!r:50}  set={it.get('set','')!r}  src={it.get('source','')[:50]!r}")
