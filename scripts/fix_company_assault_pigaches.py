"""Fix Company Assault Pigaches — n00b confirmed in-game has Crit Sev.
Only id 3886 has Crit Sev (Crit Strike 265 / Crit Sev 176 / Defense 441).
Delete id 3874 (wrong: no Crit Sev). Keep id 3886."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))
before = len(data)

for it in data:
    if it.get("id") == 3886:
        it["notes"] = "Verified in-game 2026-05-16 — n00b confirmed Crit Strike 265 / Crit Sev 176 / Defense 441."

data = [it for it in data if it.get("id") != 3874]
PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Before: {before} items; After: {len(data)} items (removed id 3874).")
