"""Find all Umbral Stride set members and Thayan Zealot weapons to map orphans."""
import json
from collections import defaultdict
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

print("=== All items with set 'Umbral Stride' ===")
for it in data:
    if it.get("set") == "Umbral Stride":
        print(f"  id={it.get('id'):>5}  IL={it.get('item_level'):>4}  {it.get('slot'):>9}  {it.get('name')!r:55}  classes={it.get('allowedClasses')}")

print("\n=== All items with 'Thayan' or 'Zealot' in name ===")
for it in data:
    n = it.get("name", "")
    if "Thayan" in n or "Zealot" in n:
        s = it.get("set", "")
        src = it.get("source", "")
        print(f"  id={it.get('id'):>5}  IL={it.get('item_level'):>4}  {it.get('slot'):>9}  {n!r:55}  set={s!r}  src={src[:40]!r}")

print("\n=== Other IL 3300 weapons (find Thayan Zealot family by IL) ===")
for it in data:
    if it.get("item_level") == 3300 and it.get("slot") in ("Main Hand", "Off Hand") and it.get("set"):
        print(f"  id={it.get('id'):>5}  {it.get('slot'):>9}  {it.get('name')!r:55}  set={it.get('set','')!r}")

print("\n=== Other IL 3900 weapons (Paladin Mod 27 mythic-tier?) ===")
for it in data:
    if it.get("item_level") == 3900 and it.get("slot") in ("Main Hand", "Off Hand") and it.get("set"):
        print(f"  id={it.get('id'):>5}  {it.get('slot'):>9}  {it.get('name')!r:55}  set={it.get('set','')!r}  classes={it.get('allowedClasses')}")
