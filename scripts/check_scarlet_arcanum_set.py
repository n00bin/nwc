"""Check all surviving Scarlet Arcanum pieces — the Greaves had CA=3500 wrong,
so the other 3 pieces (Cuirass id 2712, Helm id 2713, Gauntlets id 2711) might
also be wrong if they were intaken in the same batch."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

print("=== All Scarlet Arcanum pieces currently in data ===\n")
for it in data:
    if "Scarlet Arcanum" in it.get("name", ""):
        print(f"id={it['id']:>5}  {it.get('slot'):>6}  {it.get('name')}")
        print(f"        IL={it.get('item_level')}  CR={it.get('combinedRating')}")
        print(f"        ratings={it.get('ratingStats')}")
        print(f"        source={it.get('source','')!r}")
        print()
