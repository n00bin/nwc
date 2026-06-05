"""Find Dusk Raid set pieces in the gear data."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

print("=== All 'Dusk' items ===\n")
for it in data:
    name = it.get("name", "")
    setn = it.get("set", "") or ""
    if "Dusk" in name or "Dusk" in setn:
        print(f"id={it['id']:>5}  {it.get('slot'):>8}  {it.get('name')!r}")
        print(f"        IL={it.get('item_level')}  CR={it.get('combinedRating')}  set={setn!r}  classes={it.get('allowedClasses')}")
        print(f"        ratings={it.get('ratingStats')}")
        print(f"        source={it.get('source','')!r}")
        print()

print("\n=== All 'Raid' items (any slot) ===\n")
hits = 0
for it in data:
    if "Raid" in it.get("name", "") and "Dusk" not in it.get("name", ""):
        hits += 1
        if hits > 30:
            continue
        print(f"id={it['id']:>5}  {it.get('slot'):>8}  {it.get('name')!r:60}  IL={it.get('item_level')}  set={it.get('set','')!r}")
print(f"\n(Showing up to 30; total non-Dusk 'Raid' items: {hits})")
