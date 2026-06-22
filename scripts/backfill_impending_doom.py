"""Backfill the COMPLETE Impending Doom 2pc bonus onto all weapon members.

Intended 2pc (memory + Omen of Doom, the one complete member):
  Base Damage Boost (scales by IL), Power +2.5%, Critical Severity +7.5%.
Currently most members carry ONLY Base Damage Boost (Power/CritSev missing);
a few are markers (no stat). With the engine set-dedup now live, giving every
member the full bonus is SAFE (credited once) and makes any MH+OH pairing
correct.

Scope: Main Hand + Off Hand only. Artifact-Equipment Impending Doom entries
(slot legitimacy unverified) are LEFT ALONE — the dedup makes their BDB-only
state harmless. Base Damage Boost kept always-on (matches current/calibrated
data; the 'Unleashed' conditional question is separate and untouched).
"""
import json, sys, collections
PATH = "../data/gear.json"; APPLY = "--apply" in sys.argv
SET = "Impending Doom"
POWER_PCT, CRITSEV_PCT = 2.5, 7.5

def is_struct(eb): return isinstance(eb.get("stat"),str) and eb.get("stat") and isinstance(eb.get("amount"),(int,float))

g = json.load(open(PATH, encoding="utf-8"))

# 1) Build Base Damage Boost by item_level from existing Impending Doom members.
bdb_by_il = {}
for it in g:
    il = it.get("item_level")
    for eb in it.get("equipBonuses") or []:
        if eb.get("type")=="Set" and eb.get("setName")==SET and eb.get("stat")=="Base Damage Boost" and is_struct(eb):
            bdb_by_il[il] = eb["amount"]
print("Base Damage Boost by IL (from data):", dict(sorted(bdb_by_il.items())))

def bdb_for(il):
    if il in bdb_by_il: return bdb_by_il[il]
    if not bdb_by_il: return None
    # off-tier (e.g. IL4550): use the nearest known tier's value
    return bdb_by_il[min(bdb_by_il, key=lambda k: abs(k - (il or 0)))]

def complete_set(il):
    out = []
    _bdb = bdb_for(il)
    if _bdb is not None:
        out.append({"type":"Set","scope":"self","stat":"Base Damage Boost","amount":_bdb,
                    "setName":SET,"pieces":2})
    out.append({"type":"Set","scope":"self","stat":"Power","amount":POWER_PCT,"setName":SET,"pieces":2})
    out.append({"type":"Set","scope":"self","stat":"Critical Severity","amount":CRITSEV_PCT,"setName":SET,"pieces":2})
    return out

changed = collections.Counter(); skipped_noBDB = []
for it in g:
    slot = it.get("slot"); il = it.get("item_level")
    ebs = it.get("equipBonuses") or []
    if not any(eb.get("type")=="Set" and eb.get("setName")==SET for eb in ebs): continue
    if slot not in ("Main Hand","Off Hand"): continue   # leave Artifact Equipment alone
    # signature before
    before = tuple(sorted((eb.get("stat") or "MARKER") for eb in ebs if eb.get("type")=="Set" and eb.get("setName")==SET))
    # rebuild: keep all NON-(Impending Doom Set) ebs, append the complete set
    kept = [eb for eb in ebs if not (eb.get("type")=="Set" and eb.get("setName")==SET)]
    if il not in bdb_by_il: skipped_noBDB.append((it.get("name"), il, bdb_for(il)))
    it["equipBonuses"] = kept + complete_set(il)
    changed[(slot, before)] += 1

print(f"\nnormalized {sum(changed.values())} Main/Off Hand members to the complete 2pc:")
for (slot,before),c in sorted(changed.items()):
    print(f"  {c:3d}x  [{slot}]  was {before}  ->  (Base Damage Boost, Power 2.5, Critical Severity 7.5)")
if skipped_noBDB:
    print(f"\noff-tier IL (used NEAREST tier's BDB) for {len(skipped_noBDB)} members: {skipped_noBDB[:6]}")
if APPLY:
    json.dump(g, open(PATH,"w",encoding="utf-8"), indent=2, ensure_ascii=False); print("\nWROTE", PATH)
else:
    print("\nDRY RUN — re-run with --apply")
