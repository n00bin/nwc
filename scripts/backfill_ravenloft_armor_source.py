"""Bulk-backfill source for 19 Ravenloft-era armor orphans (IL 756, Barovia).
Set field left empty (standalone zone drops, not set members)."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

TARGET_IDS = {1257, 1258, 1259, 1260, 1261, 1262, 1263, 1264, 1265, 1266,
              1267, 1268, 1269, 1270, 1271, 1272, 1273, 1274, 1275}
NOTE = ("Source classified 2026-05-18 as Ravenloft Adventure Zone (Mod 14). "
        "IL 756 universal-class armor with Barovia-themed names (Hag, Lycan, "
        "Bandit, Cult, Undead, Ras Manca, Lazaric, Lycosa NPCs) — Mod 14 zone "
        "drops, not part of a 2pc set. n00b ack — Path A bulk source backfill.")

count = 0
for it in data:
    if it["id"] in TARGET_IDS:
        it["source"] = "Ravenloft Adventure Zone (Barovia)"
        it["notes"] = NOTE
        count += 1

print(f"Backfilled source on {count} Ravenloft armor orphans. Total items: {len(data)}.")
PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
