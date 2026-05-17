"""Show all 10 role-variant gear pairs (same slot+name+IL but different ratingStats).
These are likely DPS vs Tank vs Healer variants of the same item that should be
disambiguated by name."""
import json
from collections import defaultdict
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

groups = defaultdict(list)
for it in data:
    if it.get("name") and it.get("slot"):
        groups[(it["slot"], it["name"])].append(it)

variants = []
for (slot, name), items in groups.items():
    if len(items) < 2:
        continue
    ils = {i.get("item_level") for i in items}
    sets = {i.get("set", "") for i in items}
    classes = {tuple(sorted(i.get("allowedClasses") or [])) for i in items}
    rstats = {tuple(sorted((i.get("ratingStats") or {}).items())) for i in items}
    if len(ils) == 1 and len(sets) == 1 and len(classes) == 1 and len(rstats) > 1:
        variants.append((slot, name, items))

print(f"=== {len(variants)} role-variant pairs ===\n")
for slot, name, items in variants:
    items.sort(key=lambda x: x.get("id", 0))
    print(f"-- {slot}: {name} --")
    print(f"   IL={items[0].get('item_level')}  CR={items[0].get('combinedRating')}  set={items[0].get('set','')!r}  classes={items[0].get('allowedClasses')}")
    for i in items:
        rs = i.get("ratingStats") or {}
        ps = i.get("percentStats") or {}
        ab = i.get("abilityBonuses") or {}
        rs_str = "  ".join(f"{k}={v}" for k, v in rs.items())
        extras = []
        if ps: extras.append(f"%={ps}")
        if ab: extras.append(f"abilities={ab}")
        extras_str = ("  " + "  ".join(extras)) if extras else ""
        print(f"   id={i['id']}  {rs_str}{extras_str}")
        src = i.get("source", "")
        if src:
            print(f"             source={src!r}")
    print()
