"""Delete the 6 Bloodwoven orphan entries — they're stale stubs.
Each has 3+ richer sibling entries (with equip-power variants and set/source)."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

DELETE_IDS = {13, 22, 23, 87, 88, 94}

before = len(data)
deleted = []
for it in data:
    if it["id"] in DELETE_IDS:
        deleted.append(f"  id={it['id']:>5}  {it.get('slot'):>6}  {it.get('name')!r}")

for d in deleted:
    print(d)

data = [it for it in data if it["id"] not in DELETE_IDS]
PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"\nBefore: {before} items; After: {len(data)} items (removed {before-len(data)}).")
