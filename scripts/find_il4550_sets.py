"""Find all IL 4550 items with set names assigned, to identify which set
each orphan likely belongs to based on equip-power names."""
import json
from collections import defaultdict
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

il4550 = [it for it in data if it.get("item_level") == 4550]
print(f"Total IL 4550 items: {len(il4550)}\n")

# Group by set name
sets_at_4550 = defaultdict(list)
for it in il4550:
    s = it.get("set", "(orphan - no set)")
    sets_at_4550[s].append(it)

# Print each set's pieces with their equip power names
for setn in sorted(sets_at_4550):
    items = sets_at_4550[setn]
    print(f"=== Set: {setn!r} ({len(items)} pieces) ===")
    for it in sorted(items, key=lambda x: x.get("slot", "")):
        ebs = it.get("equipBonuses") or []
        # Get unique equip power names
        ep_names = sorted({(eb.get("name") or "") for eb in ebs if eb.get("name")})
        print(f"  id={it.get('id'):>5}  {it.get('slot'):>9}  {it.get('name')!r:55}  EQ: {ep_names}")
    print()
