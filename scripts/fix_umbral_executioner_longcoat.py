"""Fix Umbral Executioner Longcoat — n00b confirmed in-game has Critical Avoidance.
Delete id 3864 (wrong: Critical Severity). Keep id 3898."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))
before = len(data)

for it in data:
    if it.get("id") == 3898:
        it["notes"] = "Verified in-game 2026-05-16 — n00b confirmed Crit Avoidance (not Crit Sev)."

data = [it for it in data if it.get("id") != 3864]
PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Before: {before} items; After: {len(data)} items (removed id 3864).")
