"""Fix Gauntlets of the Scarlet Arcanum — n00b confirmed in-game CA=3300, CritSev=4050.
Delete id 2711 (wrong: CA=3500, CritStrike). Keep id 3931."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))
before = len(data)

for it in data:
    if it.get("id") == 3931:
        it["notes"] = "Verified in-game 2026-05-16 — n00b confirmed CA=3300, CritSev=4050."

data = [it for it in data if it.get("id") != 2711]
PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Before: {before} items; After: {len(data)} items (removed id 2711).")
