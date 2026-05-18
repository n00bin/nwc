"""Delete 83 confirmed PvP gear items per n00b directive 2026-05-18.
PvP is non-functional on NW PS5, so this gear is unobtainable and not useful
for current builds.

Categories deleted:
- Lionsmane Set membership (55 items)
- Source: 'Company PVP Armor' (8 items)
- Set: 'Company PvP Armor' (8 items)
- Source: 'Guild PVP Accessories' (12 items)
"""
import json
from collections import defaultdict
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

def is_pvp(it):
    s = it.get("set", "") or ""
    src = it.get("source", "") or ""
    if s.startswith("Lionsmane"):
        return True
    if s == "Company PvP Armor":
        return True
    if src == "Company PVP Armor":
        return True
    if src == "Guild PVP Accessories":
        return True
    return False

DELETE_IDS = {it["id"] for it in data if is_pvp(it)}
before = len(data)

# Print summary
groups = defaultdict(int)
for it in data:
    if it["id"] in DELETE_IDS:
        s = it.get("set", "") or ""
        src = it.get("source", "") or ""
        if s.startswith("Lionsmane"):
            groups["Lionsmane Set"] += 1
        elif s == "Company PvP Armor":
            groups["set: Company PvP Armor"] += 1
        elif src == "Company PVP Armor":
            groups["src: Company PVP Armor"] += 1
        elif src == "Guild PVP Accessories":
            groups["src: Guild PVP Accessories"] += 1

print(f"Deletion summary:")
for g, n in groups.items():
    print(f"  {g}: {n} items")
print(f"\nTotal deleting: {len(DELETE_IDS)} items")

data = [it for it in data if it["id"] not in DELETE_IDS]
PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"\nBefore: {before} items; After: {len(data)} items (removed {before-len(data)}).")
