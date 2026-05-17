"""Fix Company Assault Cowl — n00b confirmed in-game has Critical Severity (not Crit Strike).
Delete id 3871 (wrong). Keep id 3888."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))
before = len(data)

for it in data:
    if it.get("id") == 3888:
        it["notes"] = "Verified in-game 2026-05-16 — n00b confirmed CA 265 / Crit Sev 176."

data = [it for it in data if it.get("id") != 3871]
PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Before: {before} items; After: {len(data)} items (removed id 3871).")
