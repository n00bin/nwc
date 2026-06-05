"""Find every Dungeon Raider piece in the gear data, plus any other items
that share its source ('Zen Market' / 'Trade Bar Store') and item_level (940)
to help identify the era and whether the Cuisses are real."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

print("=== All 'Dungeon Raider' items ===\n")
for it in data:
    if "Dungeon Raider" in it.get("name", "") or "Dungeon Raider" in (it.get("set") or ""):
        print(f"id={it['id']:>5}  {it.get('slot'):>8}  {it.get('name')}")
        print(f"        IL={it.get('item_level')}  CR={it.get('combinedRating')}  set={it.get('set','')!r}")
        print(f"        ratings={it.get('ratingStats')}")
        print(f"        source={it.get('source','')!r}")
        print(f"        notes={(it.get('notes','') or '')[:120]!r}")
        print()

print("\n=== Other IL 940 Zen Market / Trade Bar Store items (same era) ===\n")
hits = 0
for it in data:
    src = (it.get("source") or "").lower()
    if it.get("item_level") == 940 and ("zen market" in src or "trade bar" in src):
        if "Dungeon Raider" in it.get("name", ""):
            continue
        hits += 1
        if hits > 25:
            continue
        print(f"id={it['id']:>5}  {it.get('slot'):>8}  {it.get('name')!r:50}  set={it.get('set','')!r}")
print(f"\n(Showing up to 25; total IL-940 Zen/Trade Bar items: {hits})")
