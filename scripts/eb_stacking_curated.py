#!/usr/bin/env python3
"""Structure COMBAT-TIME stacking equip bonuses (always-on at max in a
sustained fight) that the engine counted as zero. Conservative:

  python scripts/eb_stacking_curated.py            # dry run (review every row)
  python scripts/eb_stacking_curated.py --apply

ONLY handles "for every N seconds you are in combat ... Max [...]: TOTAL Stat"
with an EXPLICIT total — these reach max stacks in any sustained boss/dungeon
fight, so they're modeled always-on at the stated MAX value.

DELIBERATELY SKIPPED (need bespoke handling, reported):
- enemy-count-gated ("Challenger's" = single-target, "Enveloped" = 3+ enemies)
- zone-gated (Wildspace/Thay/Skyhold/Biting Cold/Reghed)
- proc/decay ("gain X when you strike, lose when struck")
- movement/health-loss-gated, role-mapped sets, no-explicit-total
Stat grants only; Stamina Regen / Recharge / Movement extras are captured if
they ride along but never block a damage/defensive stat from being added.
"""
import json, re, sys
from pathlib import Path
P = Path(__file__).resolve().parent.parent.parent / "data" / "gear.json"
APPLY = "--apply" in sys.argv

STATS = {"power":"Power","combat advantage":"Combat Advantage","critical strike":"Critical Strike",
 "critical severity":"Critical Severity","accuracy":"Accuracy","armor penetration":"Armor Penetration",
 "defense":"Defense","awareness":"Awareness","critical avoidance":"Critical Avoidance","deflect":"Deflect",
 "deflect severity":"Deflect Severity","forte":"Forte","outgoing healing":"Outgoing Healing",
 "control bonus":"Control Bonus","control resist":"Control Resist","stamina regeneration":"Stamina Regeneration",
 "recharge speed":"Recharge Speed"}
def canon(s):
    return STATS.get(re.sub(r"\s+"," ",s.strip().lower()))

EXCLUDE = re.compile(r"in combat with|enem(y|ies)|wildspace|thay|skyhold|biting cold|reghed|"
 r"underdark|when you (strike|deal|are|kill|deflect|damage|use|cast|critically)|while moving|"
 r"standing|maximum health|full health|max health|role bonus|dps \+|tank \+|heal", re.I)
REQUIRE = re.compile(r"for every \d+ seconds? you are in combat|for every \d+s in combat|for every \d+ seconds you're in combat", re.I)

def parse_total(d):
    """Return list of (stat, amount, is_pct). Reads the EXPLICIT max total."""
    # "Max amount: 7.5% at N stacks" (single stat named earlier)
    m = re.search(r"max amount:?\s*([\d.]+)%\s*at \d+ stacks", d, re.I)
    seg = None
    if m:
        # find the stat named in the "you gain X% STAT" clause
        g = re.search(r"gain\s+[\d.]+%\s*([A-Za-z ]+?)(?:\.|,|$)", d, re.I)
        st = canon(g.group(1)) if g else None
        return [(st, float(m.group(1)), True)] if st else []
    # "Max [N] [Stacks][:—-] <total segment up to sentence end>"
    m = re.search(r"max(?:imum)?\s*(?:stacks?:?\s*)?\d*\s*(?:stacks?)?\s*[:\-—]\s*([^.]+)", d, re.I)
    if not m: return []
    seg = m.group(1)
    out = []
    # "X% A and Y% B"  (two explicit % values)
    two = re.findall(r"\+?([\d.]+)%\s*([A-Za-z][A-Za-z ]*?)(?=\s+and\s+\+?[\d.]+%|\.|,|$)", seg)
    if len(two) >= 2:
        for v,s in two:
            st = canon(s)
            if st: out.append((st, float(v), True))
        if out: return out
    # "X% A and B"  (one % value, two stats)  e.g. "5% Outgoing Healing and Critical Strike"
    m1 = re.search(r"\+?([\d.]+)%\s*([A-Za-z ]+?)(?:\.|,|$)", seg)
    if m1:
        val = float(m1.group(1))
        names = re.split(r"\s+and\s+", m1.group(2).strip())
        for n in names:
            st = canon(n)
            if st: out.append((st, val, True))
        if out: return out
    # flat rating: "T,TTT A and B"  (same value, one or two stats)
    mr = re.search(r"([\d,]{3,})\s+([A-Za-z ]+?)(?:\.|,|$)", seg)
    if mr:
        val = int(mr.group(1).replace(",",""))
        names = re.split(r"\s+and\s+", mr.group(2).strip())
        for n in names:
            st = canon(n)
            if st: out.append((st, val, False))
    return out

def main():
    g = json.loads(P.read_text(encoding="utf-8"))
    PANEL=set(STATS.values())|{"Maximum Hit Points","Combined Rating"}
    def routed(eb):
        s=eb.get("stat"); return bool(s) and (s in PANEL or re.search(r"Damage|Dmg|Boost", s or ""))
    applied=0; rows=[]; skipped=[]
    for it in g:
        ebs=it.get("equipBonuses") or []; add=[]
        # names already structured on THIS item — never add a duplicate stat for them
        routedNames={ (e.get("name") or "") for e in ebs if routed(e) }
        for idx,eb in enumerate(ebs):
            if routed(eb): continue
            if (eb.get("name") or "") in routedNames: continue   # same bonus already modeled here
            d=(eb.get("description") or eb.get("effect") or "").strip()
            if "stack" not in d.lower(): continue
            if not re.search(r"power|critical|combat advantage|accuracy|forte|defense|awareness|deflect|outgoing healing|control", d, re.I): continue
            if not REQUIRE.search(d) or EXCLUDE.search(d):
                if len(skipped)<14: skipped.append((it['name'],eb.get('name'),d[:85]))
                continue
            parsed=parse_total(d)
            # keep only offensive/defensive panel stats (drop stamina/recharge extras)
            parsed=[(s,a,p) for (s,a,p) in parsed if s not in ("Stamina Regeneration","Recharge Speed")]
            if not parsed:
                if len(skipped)<14: skipped.append((it['name'],eb.get('name'),d[:85]))
                continue
            first=parsed[0]
            ebs[idx]={"type":eb.get("type","Equip"),"scope":"self","stat":first[0],"amount":first[1],
                      **({} if first[2] else {"kind":"rating"}),"name":eb.get("name"),"description":d,
                      "parsedFrom":"stacking-max","note":"max-stack total, always-on in sustained combat"}
            for s,a,p in parsed[1:]:
                add.append({"type":eb.get("type","Equip"),"scope":"self","stat":s,"amount":a,
                            **({} if p else {"kind":"rating"}),"name":eb.get("name"),"parsedFrom":"stacking-max"})
            applied+=1
            rows.append((it['id'],eb.get('name'),[(s,a,'%' if p else 'rtg') for s,a,p in parsed]))
        ebs.extend(add)
    print(f"{applied} stacking bonuses structured:")
    for r in rows: print(f"  [{r[0]}] {r[1]}: {r[2]}")
    print(f"\nSKIPPED sample (enemy-count/zone/proc/no-total — bespoke):")
    for nm,bn,d in skipped: print(f"  {nm} / {bn}: {d}")
    if APPLY:
        P.write_text(json.dumps(g,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
        print("\nAPPLIED. Run build-data.py.")
    else:
        print("\nDry run. --apply to write.")

if __name__=="__main__": main()
