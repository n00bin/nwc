"""Bulk-backfill source for 31 Avernus-era armor orphans (IL 1225-1250).
Set field left empty (these are standalone zone-drop gear, not set members).
This removes them from orphan status (orphan = no set AND no source)."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

TARGET_IDS = {
    # Head
    1517, 1448, 1447, 1446, 1452, 1453,
    # Armor
    1506, 1507, 1513, 1508, 1455, 1457, 1456, 1458, 1463,
    # Arms
    1499, 1500, 1504, 1505, 1460, 1462, 1459, 1461,
    # Feet
    1510, 1512, 1509, 1511, 1450, 1451, 1449, 1454,
}
NOTE = ("Source classified 2026-05-17 as Avernus Adventure Zone (Mod 19). "
        "These are universal-class standalone armor pieces from Avernus zone "
        "content (heroic encounters, boss drops, etc.); not part of a 2pc set. "
        "n00b ack — Path A bulk source backfill.")

count = 0
for it in data:
    if it["id"] in TARGET_IDS:
        it["source"] = "Avernus Adventure Zone"
        it["notes"] = NOTE
        count += 1

print(f"Backfilled source on {count} Avernus armor orphans. Total items: {len(data)}.")
PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
