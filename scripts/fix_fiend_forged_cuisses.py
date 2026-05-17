"""Fix Fiend Forged Cuisses (Feet, IL 1230):
- Delete id 1397 (wrong: had Awareness instead of Critical Avoidance).
- Update id 3412 to add the missing % bonus (+1% Damage vs Demons/Devils/Fiends)
  and merge source to cover both Citadel + Vallenhas vendor."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

before = len(data)
for it in data:
    if it.get("id") == 3412:
        it["percentStats"] = {"Damage against Demons, Devils, and Fiends": 1}
        it["source"] = "Seals of the Fallen — The Infernal Citadel (Avernus) / Vallenhas Seals Store"
        it["notes"] = "Verified in-game 2026-05-16 — n00b confirmed Crit Strike / Defense / Crit Avoidance."

data = [it for it in data if it.get("id") != 1397]
PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Before: {before} items; After: {len(data)} items (removed id 1397).")
