"""Show all IL 756 armor orphans and find context from siblings."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

orphans = [it for it in data
           if not it.get("set") and not it.get("source")
           and it.get("slot") in ("Head", "Armor", "Arms", "Feet")
           and it.get("item_level") == 756]

print(f"=== Total IL 756 armor orphans: {len(orphans)} ===\n")
for o in orphans:
    print(f"  id={o['id']:>5}  {o.get('slot'):>6}  {o.get('name')!r:55}  ratings={list((o.get('ratingStats') or {}).keys())}")

# Context: other IL 756 items with set/source
print("\n=== Other IL 756 items with set/source (era context) ===")
hits = 0
for it in data:
    if it.get("item_level") == 756 and (it.get("set") or it.get("source")):
        hits += 1
        if hits > 15: continue
        print(f"  id={it['id']:>5}  {it.get('slot'):>6}  {it.get('name')!r:50}  set={it.get('set','')!r:30}  src={(it.get('source','') or '')[:50]!r}")
if hits > 15:
    print(f"  ... and {hits-15} more")

# Search for character clues — "Ras Manca" hint
print("\n=== Items with 'Ras Manca' or 'Lazaric' or 'Lycosa' (character names) ===")
for it in data:
    n = it.get("name", "")
    if any(k in n for k in ["Ras Manca", "Lazaric", "Lycosa", "Brailiel"]):
        print(f"  id={it['id']:>5}  IL={it.get('item_level'):>4}  {it.get('slot'):>6}  {n!r:50}  set={it.get('set','')!r}  src={(it.get('source','') or '')[:50]!r}")
