#!/usr/bin/env python3
"""Structure the CLEAN collection 2-piece SET bonuses (Enchanted + Freezing
families) whose value is stated plainly in the description ("2 of Set: +3,000
Accuracy" / "+4% Power") but had no machine-readable stat, so the engine
counted them as zero.

  python scripts/eb_setbonus_curated.py            # dry run
  python scripts/eb_setbonus_curated.py --apply

DOUBLE-COUNT SAFETY (critical): the engine pushes a Set bonus once PER equipped
piece that carries the full {stat,amount} entry — there is NO dedup. A 2-piece
set spans two slots (Shirt + Pants), and you can only wear ONE of each slot, so
the rule is: put the FULL entry on exactly ONE slot per set; every piece in the
OTHER slot(s) becomes a marker (type:Set, setName, pieces — NO stat). Markers
still count toward the piece tally (countSetPieces ignores stat) but are skipped
by the stat ingest (`if (!eb.stat) continue`), and the card renderer hides a
description-less marker when a described entry exists. Result: a complete
Shirt+Pants pair = exactly 1 full + 1 marker = counted once.

Single-slot sets (partner piece missing in data) get full on their only slot;
they simply never reach 2 pieces, so they stay inert (no regression) until the
partner is added — reported at the end.

ALLOW-LISTED set names only (curated, hand-verified values). Excluded and left
for the user / future passes: Whisper of Power (overlaps the structured
Impending Doom weapon set; user wants it verified), Blaspheme (role proc, 70 vs
7500 flag), Pioneer/Primal/Pilgrim (party-size / HP-difference scaled),
zone-gated (Chilling Flow / Skyhold Arms / Prismatic Defier), party-scope
(Devil's Legion), damage-boost (Demonweb), health-scaled (Living Magma).
"""
import json, re, sys
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
P = Path(__file__).resolve().parent.parent.parent / "data" / "gear.json"
APPLY = "--apply" in sys.argv

# ONLY the verified-clean, completable, collision-free sets: each is exactly one
# Shirt + one Pants, identical stat/value on both pieces, IL 4850 Jotunskar.
# DELIBERATELY EXCLUDED (need user/in-game resolution, see report at end):
#  - Freezing Touch / Stand / Rage: both pieces mis-slotted as Pants (can't
#    complete until one is corrected to Shirt — don't guess the slot).
#  - Enchanted Advantage / Awareness: setName COLLISION — the "Mark of X" line
#    (+3,000 rating) and the "Bloodwoven X" line (+2%) share one setName but are
#    different in-game sets; structuring would let a mixed pair wrongly trigger.
#  - Enchanted Forte / Healing: Shirt-only in data (partner piece missing).
ALLOW = {
    "Freezing Energy", "Freezing Grasp", "Freezing Fortitude", "Freezing Advantage",
}
STATS = {"power":"Power","combat advantage":"Combat Advantage","critical strike":"Critical Strike",
 "critical severity":"Critical Severity","accuracy":"Accuracy","armor penetration":"Armor Penetration",
 "defense":"Defense","awareness":"Awareness","critical avoidance":"Critical Avoidance","deflect":"Deflect",
 "deflect severity":"Deflect Severity","forte":"Forte","outgoing healing":"Outgoing Healing"}
def canon(s): return STATS.get(re.sub(r"\s+"," ",s.strip().lower()))

# "+3,000 Accuracy" | "+2% Awareness" | "+4% Critical Severity"  (after the colon)
VAL = re.compile(r"\+\s*([\d,]+)\s*(%?)\s*([A-Za-z][A-Za-z ]+?)\s*\.?\s*$")

def parse(desc):
    """Return (stat, amount, is_pct) or None from a single clean set line."""
    tail = desc.split(":", 1)[1] if ":" in desc else desc
    # set line may have several clauses; take the first "+N[%] Stat"
    m = VAL.search(tail.strip())
    if not m:
        m = re.search(r"\+\s*([\d,]+)\s*(%?)\s*([A-Za-z][A-Za-z ]+?)(?:[.,]|$)", tail)
        if not m: return None
    val = float(m.group(1).replace(",", ""))
    is_pct = m.group(2) == "%"
    st = canon(m.group(3))
    if not st: return None
    # flat rating safety: a value >= 1000 with no % is a rating, not a percent
    if not is_pct and val < 100:
        is_pct = True  # e.g. "+4 Power" style would be percent; but our targets are explicit
    return (st, val, is_pct)

def main():
    g = json.loads(P.read_text(encoding="utf-8"))
    # PASS 1: collect target (item-idx, eb-idx, setName, slot, parsed)
    found = []  # (item, ebidx, setName, slot, stat, amount, is_pct, desc)
    slots_by_set = {}
    for it in g:
        ebs = it.get("equipBonuses") or []
        for i, eb in enumerate(ebs):
            sn = eb.get("setName")
            if sn not in ALLOW: continue
            if eb.get("stat") or eb.get("roleMap"): continue  # already structured
            d = (eb.get("description") or eb.get("effect") or "").strip()
            pr = parse(d)
            if not pr: continue
            slot = it.get("slot")
            found.append([it, i, sn, slot, pr[0], pr[1], pr[2], d])
            slots_by_set.setdefault(sn, {}).setdefault(slot, 0)
            slots_by_set[sn][slot] += 1
    # primary slot per set: prefer Shirt, else Pants, else first
    primary = {}
    for sn, sl in slots_by_set.items():
        primary[sn] = "Shirt" if "Shirt" in sl else ("Pants" if "Pants" in sl else sorted(sl)[0])
    # PASS 2: rewrite
    rows = []
    for rec in found:
        it, i, sn, slot, st, amt, is_pct, d = rec
        eb = it["equipBonuses"][i]
        if slot == primary[sn]:
            new = {"type": "Set", "scope": "self", "stat": st, "amount": amt,
                   **({} if is_pct else {"kind": "rating"}),
                   "setName": sn, "pieces": 2, "description": d, "parsedFrom": "setbonus"}
        else:
            new = {"type": "Set", "setName": sn, "pieces": 2, "parsedFrom": "setbonus",
                   "note": f"marker — bonus carried on the {primary[sn]} piece"}
        it["equipBonuses"][i] = new
        rows.append((it["id"], sn, slot, primary[sn], st, amt, "%" if is_pct else "rtg",
                     "FULL" if slot == primary[sn] else "marker"))
    # report
    by_set = {}
    for id_, sn, slot, pr, st, amt, k, role in rows:
        by_set.setdefault(sn, {"full": None, "markers": 0, "primary": pr})
        if role == "FULL":
            by_set[sn]["full"] = f"{st} {amt}{k}"
        else:
            by_set[sn]["markers"] += 1
    print(f"{len(rows)} set-bonus entries restructured across {len(by_set)} sets:\n")
    complete = incomplete = 0
    for sn in sorted(by_set):
        b = by_set[sn]; sl = slots_by_set[sn]
        works = len([s for s in sl]) >= 2
        flag = "[completes]" if works else "[single-slot - partner missing in data]"
        if works: complete += 1
        else: incomplete += 1
        print(f"  {sn:22} full={(b['full'] or '(none - all one slot)'):16} on {b['primary']:6} markers={b['markers']}  {flag}")
    print(f"\n{complete} sets will work now; {incomplete} inert until their partner piece is added.")
    if APPLY:
        P.write_text(json.dumps(g, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("\nAPPLIED. Run build-data.py.")
    else:
        print("\nDry run. --apply to write.")

if __name__ == "__main__": main()
