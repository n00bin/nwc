"""Find context for the 5 Shirt/Pants orphan families."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

for keyword in ["Negotiator", "Interrogator", "Pact Brands", "Dragonflight Shirt"]:
    print(f"\n=== Items matching {keyword!r} ===")
    hits = 0
    for it in data:
        n = it.get("name", "")
        if keyword in n:
            hits += 1
            if hits > 12:
                continue
            s = it.get("set", "")
            src = it.get("source", "")
            print(f"  id={it['id']:>5}  IL={it.get('item_level'):>4}  {it.get('slot'):>5}  {n!r:50}  set={s!r:30}  src={src[:50]!r}")
    if hits > 12:
        print(f"  ... and {hits-12} more")
