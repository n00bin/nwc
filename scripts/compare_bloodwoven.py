"""Compare each orphan Bloodwoven entry to its named siblings to see if they're
distinct items or duplicates that should merge."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

orphan_ids = {13, 22, 23, 87, 88, 94}

# Build by-base-name map
by_base = {}
for it in data:
    n = it.get("name", "")
    if "Bloodwoven" not in n:
        continue
    base = n.split(" (")[0].split(" — ")[0].split(" - ")[0]
    by_base.setdefault(base, []).append(it)

for base, items in sorted(by_base.items()):
    print(f"\n=== {base} ({len(items)} entries) ===")
    items.sort(key=lambda x: x.get("id", 0))
    for it in items:
        marker = " <-- ORPHAN" if it["id"] in orphan_ids else ""
        rs = it.get("ratingStats", {})
        rs_str = " ".join(f"{k}={v}" for k, v in rs.items())
        print(f"  id={it['id']:>5} {it.get('slot'):>6} set={it.get('set','')!r:25} src={(it.get('source','') or '')[:40]!r:42}{marker}")
        print(f"    name={it.get('name')!r}")
        print(f"    {rs_str}")
