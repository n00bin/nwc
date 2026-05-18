"""Find all PvP-tagged gear in the database for deletion review."""
import json
from collections import defaultdict, Counter
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

# Search heuristics for PvP gear
PVP_KEYWORDS_NAME = ["Gladiator", "Drowcraft", "PVP", "PvP", "Pvp"]
PVP_KEYWORDS_SOURCE = ["PvP", "PVP", "Gauntlgrym PvP", "Stronghold Siege",
                       "Gladiator", "Domination", "Open PvP"]
PVP_KEYWORDS_SET = ["PVP", "PvP", "Drowcraft", "Gladiator's"]

matches = defaultdict(list)
for it in data:
    n = it.get("name", "")
    s = it.get("set", "") or ""
    src = it.get("source", "") or ""
    if any(k in n for k in PVP_KEYWORDS_NAME):
        matches["name has PvP marker"].append(it)
    elif any(k in src for k in PVP_KEYWORDS_SOURCE):
        matches["source has PvP marker"].append(it)
    elif any(k in s for k in PVP_KEYWORDS_SET):
        matches["set has PvP marker"].append(it)

total = sum(len(v) for v in matches.values())
print(f"=== PvP-tagged items in data: {total} ===\n")
for category, items in matches.items():
    print(f"--- {category} ({len(items)} items) ---")
    for it in items[:30]:
        print(f"  id={it['id']:>5}  IL={it.get('item_level')!s:>5}  {it.get('slot'):>6}  {it.get('name')!r:50}  set={it.get('set','')!r:25}  src={(it.get('source','') or '')[:40]!r}")
    if len(items) > 30:
        print(f"  ... and {len(items)-30} more")
    print()

# Also show all "Assault/Raid/Defender" Dragonflight/Lionsmane rings — could be PvE or PvP
print("=== Stronghold ring families (often confused — Dragonflight/Lionsmane may be PvE Stronghold, not PvP) ===")
hits = 0
for it in data:
    n = it.get("name", "")
    if it.get("slot") == "Ring" and any(prefix in n for prefix in ["Dragonflight", "Lionsmane"]):
        hits += 1
        if hits > 15: continue
        print(f"  id={it['id']:>5}  IL={it.get('item_level'):>4}  {n!r:50}  set={it.get('set','')!r:25}  src={(it.get('source','') or '')[:40]!r}")
print(f"\n(Total Dragonflight/Lionsmane Rings: {hits})")
