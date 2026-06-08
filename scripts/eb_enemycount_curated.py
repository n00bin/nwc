#!/usr/bin/env python3
"""Structure the enemy-count-gated stacking bonuses (Challenger's/Enveloped
families). CRITICAL: the NAME does not match the condition — Challenger's
Awareness is "3+ enemies", Enveloped Rage (Ascendant) is "1 enemy". The gate
is parsed from the BUILD clause ("when in combat with X enemies, ... increased").

  python scripts/eb_enemycount_curated.py            # dry run (review gates!)
  python scripts/eb_enemycount_curated.py --apply

Modeling (default sim = single strong boss target):
- build gate "1 enemy" / "only 1 enemy" / "1 or more enemies"  -> SINGLE/ANY:
  up against a boss -> always-on at max stated total.
- build gate "2/3/4/5 or more enemies"                          -> MULTI (AoE):
  down vs a single boss -> alwaysActive:false (0 in base/optimizer, shown in
  the "show conditional" AoE view).
Uses the EXPLICIT max total. Panel offensive/defensive stats only; skips
Recharge/Movement/Incoming-Damage extras and no-total/empty entries.
"""
import json, re, sys
from pathlib import Path
P = Path(__file__).resolve().parent.parent.parent / "data" / "gear.json"
APPLY = "--apply" in sys.argv

STATS = {"power":"Power","combat advantage":"Combat Advantage","critical strike":"Critical Strike",
 "critical severity":"Critical Severity","accuracy":"Accuracy","armor penetration":"Armor Penetration",
 "defense":"Defense","awareness":"Awareness","critical avoidance":"Critical Avoidance","deflect":"Deflect",
 "deflect severity":"Deflect Severity","forte":"Forte","outgoing healing":"Outgoing Healing",
 "control bonus":"Control Bonus","control resist":"Control Resist"}
def canon(s): return STATS.get(re.sub(r"\s+"," ",s.strip().lower()))

def gate(d):
    """-> 'single' (up vs boss) | 'multi' (down vs boss) | None (unknown)."""
    # the BUILD clause: "in combat with X enem... (is )?increased / gain / +"
    m = re.search(r"in combat with\s+(only\s+)?(\d+|one)\s*(or more\s+)?enem", d, re.I)
    if not m:
        # shorthand "vs N+ enemies:" / "vs 1 enemy:"
        m2 = re.search(r"vs\s+(\d+)\s*\+?\s*enem", d, re.I)
        if m2: return "single" if m2.group(1)=="1" else "multi"
        return None
    n = 1 if m.group(2).lower()=="one" else int(m.group(2))
    orMore = bool(m.group(3))
    if n == 1: return "single"      # "1 enemy", "only 1 enemy", "1 or more" all up vs a boss
    return "multi"                  # 2/3/4/5 or more -> needs a crowd

def parse_total(d):
    """list of (stat, amount, is_pct) from the explicit max total."""
    out=[]
    # "Max [Stacks:]? N [stacks]? [:—-] <segment>"  OR shorthand "Max N (segment)"
    # Capture lazily until a SENTENCE-ending period (". " or end) or ")", NOT a
    # decimal period inside values like "2.5%".
    m = re.search(r"max(?:imum)?\s*(?:stacks?:?\s*)?\d*\s*(?:stacks?)?\s*[:\-—(]\s*(.+?)(?:\.\s|\.$|\)|$)", d, re.I)
    if not m: return out
    seg=m.group(1)
    two=re.findall(r"\+?([\d.]+)%\s*([A-Za-z][A-Za-z ]*?)(?=\s+and\s+\+?[\d.]+%|\.|,|$)", seg)
    if len(two)>=2:
        for v,s in two:
            st=canon(s);  out.append((st,float(v),True)) if st else None
        if out: return out
    m1=re.search(r"\+?([\d.]+)%\s*([A-Za-z ]+?)(?:\.|,|$)", seg)
    if m1:
        val=float(m1.group(1))
        for n in re.split(r"\s+and\s+", m1.group(2).strip()):
            st=canon(n);  out.append((st,val,True)) if st else None
        if out: return out
    mr=re.search(r"([\d,]{3,})\s+([A-Za-z ]+?)(?:\.|,|$)", seg) or re.search(r"([\d,]{3,})", seg)
    if mr:
        val=int(mr.group(1).replace(",",""))
        names = re.split(r"\s+and\s+", mr.group(2).strip()) if mr.lastindex and mr.re.groups>=2 else []
        if not names:
            # paren form "(11250)" — stat from the build clause "+2250 Accuracy"
            g=re.search(r"\+?[\d,]+\s+([A-Za-z ]+?)(?:/2s|\b)", d)
            if g and canon(g.group(1)): names=[g.group(1)]
        for n in names:
            st=canon(n);  out.append((st,val,False)) if st else None
    return out

def main():
    g=json.loads(P.read_text(encoding="utf-8"))
    PANEL=set(STATS.values())|{"Maximum Hit Points","Combined Rating"}
    def routed(eb):
        s=eb.get("stat"); return bool(s) and (s in PANEL or re.search(r"Damage|Dmg|Boost",s or ""))
    applied=0; rows=[]; skipped=[]
    for it in g:
        ebs=it.get("equipBonuses") or []; add=[]
        routedNames={(e.get("name") or "") for e in ebs if routed(e)}
        for idx,eb in enumerate(ebs):
            nm=(eb.get("name") or "")
            if not re.match(r"Challenger's|Enveloped",nm): continue
            if routed(eb) or nm in routedNames: continue
            d=(eb.get("description") or eb.get("effect") or "").strip()
            if not d: continue
            gt=gate(d); parsed=parse_total(d)
            if not gt or not parsed:
                if len(skipped)<16: skipped.append((it['id'],nm,gt,d[:80]));
                continue
            cond = (gt=="multi")
            # multi-enemy -> requiresMultiEnemy (engine EXCLUDES from the single-
            # target total; alwaysActive:false alone wouldn't, the flag is
            # display-only). single-target -> always-on (up vs a boss).
            extra = {"requiresMultiEnemy":True,"alwaysActive":False} if cond else {}
            first=parsed[0]
            ebs[idx]={"type":eb.get("type","Equip"),"scope":"self","stat":first[0],"amount":first[1],
                      **({} if first[2] else {"kind":"rating"}), **extra,
                      "name":nm,"description":d,"parsedFrom":"enemycount",
                      "note":("multi-enemy (AoE) — excluded vs a single boss" if cond else "single-target — up vs a boss")}
            for s,a,pp in parsed[1:]:
                add.append({"type":eb.get("type","Equip"),"scope":"self","stat":s,"amount":a,
                            **({} if pp else {"kind":"rating"}), **extra,
                            "name":nm,"parsedFrom":"enemycount"})
            applied+=1
            rows.append((it['id'],nm,gt,[(s,a,'%' if pp else 'rtg') for s,a,pp in parsed]))
        ebs.extend(add)
    print(f"{applied} enemy-count bonuses structured:\n  (gate=single -> always-on vs boss; gate=multi -> conditional/AoE)")
    for r in rows: print(f"  [{r[0]}] {r[1]:26} gate={r[2]:6} {r[3]}")
    print("\nSKIPPED (no gate parsed / no total / empty):")
    for i,nm,gt,d in skipped: print(f"  [{i}] {nm} gate={gt}: {d}")
    if APPLY:
        P.write_text(json.dumps(g,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
        print("\nAPPLIED. Run build-data.py.")
    else:
        print("\nDry run. --apply to write.")

if __name__=="__main__": main()
