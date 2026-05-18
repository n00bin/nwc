"""Find genuinely PvP gear based on n00b's corrections:
- Lionsmane Set = PvP
- Company Armor (any 'PvP' label) = PvP
- Guild PVP Accessories = PvP
- Drowcraft = NOT PvP (PvE Underdark)
- 'Gladiator' prefix on ITEM NAME (not equip power) = likely PvP
- Equip-power names like 'Gladiator's Restoration' on Prismatic gear = NOT PvP
"""
import json
from collections import defaultdict
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

# Define PvP membership criteria
def is_pvp(it):
    n = it.get("name", "")
    s = it.get("set", "") or ""
    src = it.get("source", "") or ""

    # Lionsmane Set membership
    if s == "Lionsmane Set" or s.startswith("Lionsmane"):
        return ("Lionsmane Set", n)
    # Company PvP Armor by set or source
    if "PvP" in s or "PVP" in s:
        return (f"set: {s}", n)
    if "PvP" in src or "PVP" in src:
        return (f"source: {src}", n)
    if "Stronghold Siege" in src:
        return ("Stronghold Siege source", n)
    # 'Gladiator' prefix on item name (but exclude equip-power references)
    # e.g. 'Prestige Gladiator', 'Warborn Gladiator', 'Gladiator's Dragonflight'
    if "Gladiator" in n:
        # Check if "Gladiator" is in equip-power name only (false positive)
        ebs = it.get("equipBonuses") or []
        eq_names = " ".join((eb.get("name") or "") for eb in ebs)
        if "Gladiator" in eq_names and "Gladiator" not in n.replace(" ", ""):
            return None  # likely false positive
        # Standalone Gladiator-named gear
        return ("Gladiator name", n)
    # Drowcraft is NOT PvP per n00b
    return None

pvp_items = []
for it in data:
    reason = is_pvp(it)
    if reason:
        pvp_items.append((reason[0], it))

print(f"=== Likely PvP items: {len(pvp_items)} ===\n")
by_reason = defaultdict(list)
for reason, it in pvp_items:
    # Bucket by reason category prefix
    if reason.startswith("set: "):
        bucket = "Set has PvP marker"
    elif reason.startswith("source: ") or "Stronghold Siege" in reason:
        bucket = "Source has PvP marker (incl. Stronghold Siege)"
    elif reason == "Lionsmane Set":
        bucket = "Lionsmane Set membership"
    elif reason == "Gladiator name":
        bucket = "Gladiator in item name"
    else:
        bucket = reason
    by_reason[bucket].append(it)

for bucket, items in by_reason.items():
    print(f"--- {bucket} ({len(items)} items) ---")
    items.sort(key=lambda x: x["id"])
    for it in items[:30]:
        print(f"  id={it['id']:>5}  IL={it.get('item_level')!s:>5}  {it.get('slot'):>6}  {it.get('name')!r:50}  set={(it.get('set','') or '')!r:25}  src={(it.get('source','') or '')[:40]!r}")
    if len(items) > 30:
        print(f"  ... and {len(items)-30} more")
    print()
