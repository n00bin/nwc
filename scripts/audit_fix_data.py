"""Audit fixes (data side) — gear.json BLOCKERs 1-3. Dry-run unless --apply.

B1: 15 zone items store base + delta both always-on (double-count). Zone-tag the
    HIGHER-amount entry (the delta) so only the base is always-on — matches the
    working sibling pattern (IDs 82/83: base 2.0 + delta 3.0 zones:['Thay']).
B2: within-item Equip duplicates (same stat+amount under different names, or
    float-vs-int) — engine has no within-item Equip dedup, so they SUM. Dedup by
    (stat, amount) [name-agnostic, float-normalized], keep first.
B3: duplicate procHeal entries (identical proc written twice -> 2x self-heal).
    Dedup by procHeal JSON, keep first.
"""
import json, sys
PATH = "../data/gear.json"; APPLY = "--apply" in sys.argv

ZONE_FIX = {52:"Thay", 71:"Thay", 289:"Thay", 297:"Thay",
            540:"Pirates' Skyhold",541:"Pirates' Skyhold",542:"Pirates' Skyhold",
            545:"Pirates' Skyhold",546:"Pirates' Skyhold",547:"Pirates' Skyhold",
            551:"Pirates' Skyhold",552:"Pirates' Skyhold",553:"Pirates' Skyhold",
            3212:"Wildspace", 3972:"Wildspace"}

g = json.load(open(PATH, encoding="utf-8"))
byid = {it.get("id"): it for it in g}
def is_struct(eb): return isinstance(eb.get("stat"),str) and eb.get("stat") and isinstance(eb.get("amount"),(int,float))

# ---- B2 + B3 dedup ----
dropped_equip = dropped_proc = 0
for it in g:
    seen = set(); out = []
    for eb in it.get("equipBonuses") or []:
        if eb.get("type") != "Set" and is_struct(eb):
            k = ("S", eb.get("stat"), float(eb.get("amount")))
            if k in seen: dropped_equip += 1; continue
            seen.add(k)
        elif eb.get("procHeal"):
            k = ("P", json.dumps(eb["procHeal"], sort_keys=True))
            if k in seen: dropped_proc += 1; continue
            seen.add(k)
        out.append(eb)
    it["equipBonuses"] = out
print(f"B2 dropped {dropped_equip} within-item Equip duplicates")
print(f"B3 dropped {dropped_proc} duplicate procHeal entries")

# ---- B1 zone tags ----
zoned = 0; warns = []
for _id, zone in ZONE_FIX.items():
    it = byid.get(_id)
    if not it: warns.append(f"ID {_id} not found"); continue
    # group no-zone Equip entries by (name, stat)
    from collections import defaultdict
    grp = defaultdict(list)
    for eb in it.get("equipBonuses") or []:
        if is_struct(eb) and not eb.get("zones") and eb.get("type") != "Set":
            grp[(eb.get("name"), eb.get("stat"))].append(eb)
    tagged_here = 0
    for (nm, st), ebs in grp.items():
        if len(ebs) == 2:                       # base + delta pair
            hi = max(ebs, key=lambda e: e["amount"])
            hi["zones"] = [zone]; zoned += 1; tagged_here += 1
    if tagged_here == 0: warns.append(f"ID {_id} ({it.get('name')}): no 2-entry no-zone pair found — NOT tagged")
print(f"\nB1 zone-tagged {zoned} delta entries across {len(ZONE_FIX)} items")
for w in warns: print(f"  WARN {w}")

if APPLY:
    json.dump(g, open(PATH,"w",encoding="utf-8"), indent=2, ensure_ascii=False); print("\nWROTE", PATH)
else:
    print("\nDRY RUN — re-run with --apply")
