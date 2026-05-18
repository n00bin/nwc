"""Show all 83 confirmed PvP deletion candidates organized by group."""
import json
from collections import defaultdict
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

# Confirmed PvP groups
GROUPS = {
    "Lionsmane Set (55)": lambda it: (it.get("set", "") or "").startswith("Lionsmane"),
    "Source: Company PVP Armor (8)": lambda it: (it.get("source", "") or "") == "Company PVP Armor",
    "Source: Guild PVP Accessories (12)": lambda it: (it.get("source", "") or "") == "Guild PVP Accessories",
    "Set: Company PvP Armor (8)": lambda it: (it.get("set", "") or "") == "Company PvP Armor",
}

shown_ids = set()
for group_label, predicate in GROUPS.items():
    matches = [it for it in data if predicate(it) and it["id"] not in shown_ids]
    matches.sort(key=lambda x: (x.get("slot", ""), x.get("item_level") or 0, x["id"]))
    print(f"\n=== {group_label} ===")
    for it in matches:
        shown_ids.add(it["id"])
        print(f"  id={it['id']:>5}  IL={it.get('item_level')!s:>4}  {it.get('slot'):>6}  {it.get('name')!r:55}  set={(it.get('set','') or '')!r:25}  src={(it.get('source','') or '')[:50]!r}")

print(f"\n\nTotal unique items to delete: {len(shown_ids)}")
