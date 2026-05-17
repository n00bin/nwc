"""Find Enchanted Depthweave and related items to identify the set."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

print("=== Enchanted Depthweave / Depthcured items ===")
for it in data:
    n = it.get("name", "")
    s = it.get("set", "")
    if "Depthweave" in n or "Depthcured" in n or "Depths" in s or "Depths" in n:
        print(f"  id={it['id']:>5}  IL={it.get('item_level'):>4}  {it.get('slot'):>9}  {n!r:50}  set={s!r:30}  src={(it.get('source','') or '')[:50]!r}")
