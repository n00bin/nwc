"""Fix Umbral Duelist Longcoat — n00b confirmed in-game has Awareness (not Crit Strike).
Delete id 3860 (wrong: Critical Strike). Keep id 3897."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))
before = len(data)

for it in data:
    if it.get("id") == 3897:
        it["notes"] = "Verified in-game 2026-05-16 — n00b confirmed Awareness (not Crit Strike)."

data = [it for it in data if it.get("id") != 3860]
PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Before: {before} items; After: {len(data)} items (removed id 3860).")
