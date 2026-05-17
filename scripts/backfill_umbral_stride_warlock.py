"""Backfill the 2 Warlock IL 3300 'of the Thayan Zealot' weapons into Umbral Stride."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

TARGETS = {47, 48}
NOTE = "Set classified 2026-05-17 — matches 6 existing IL 3300 'Thayan Zealot' weapons in Umbral Stride (Bard/Rogue/Ranger); n00b ack."

for it in data:
    if it["id"] in TARGETS:
        it["set"] = "Umbral Stride"
        it["setSize"] = 2
        it["source"] = "Adventures in Thay"
        it["notes"] = NOTE
        print(f"  Backfilled id={it['id']:>5}  {it.get('slot'):>9}  {it.get('name')!r}")

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"\nTotal items: {len(data)}.")
