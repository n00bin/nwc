"""Delete the 6 'Runes of the X' orphan entries — same stub pattern as Bloodwoven.
Each has an em-dash sibling entry (ids 474-479) with proper set name."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

DELETE_IDS = {96, 97, 98, 99, 100, 101}
before = len(data)

for it in data:
    if it["id"] in DELETE_IDS:
        print(f"  id={it['id']:>5}  {it.get('slot'):>6}  {it.get('name')!r}")

data = [it for it in data if it["id"] not in DELETE_IDS]
PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"\nBefore: {before} items; After: {len(data)} items (removed {before-len(data)}).")
