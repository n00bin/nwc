#!/usr/bin/env python3
"""Curated, hand-verified fix for always-on flat-% stat-grant equip bonuses
the engine was counting as zero. NOT a general regex — each bonus name has an
exact extraction matched to its verified phrasing, and ONLY entries currently
missing the stat are touched (won't double-add to already-modeled tiers).

  python scripts/eb_statgrant_curated.py            # dry run
  python scripts/eb_statgrant_curated.py --apply

Modeling: the leading "(you) gain X% Stat" is always-on; a trailing
"when in combat with 2+ enemies, gain Y% Stat2" is added conditional
(alwaysActive:false). Resource-max ("Divinity maximum +Z%") is left to the
existing Class Resource Max entry — not touched here.
"""
import json, re, sys
from pathlib import Path
P = Path(__file__).resolve().parent.parent.parent / "data" / "gear.json"
APPLY = "--apply" in sys.argv

def num(s): return float(s) if "." in s else int(s)

# name -> function(desc) -> list of structured stat dicts (without type/name; added later)
def maidens(stat_main, stat_cond):
    def f(d):
        m = re.search(r"gain\s+(\d+(?:\.\d+)?)%\s*"+re.escape(stat_main), d, re.I)
        if not m: return None
        out=[{"stat":stat_main,"amount":num(m.group(1))}]
        m2 = re.search(r"2 or more enemies[^.]*?gain\s+(\d+(?:\.\d+)?)%\s*"+re.escape(stat_cond), d, re.I)
        if m2: out.append({"stat":stat_cond,"amount":num(m2.group(1)),"alwaysActive":False})
        return out
    return f
def gain_tail(stat):
    def f(d):
        m = re.search(r"gain\s+(\d+(?:\.\d+)?)%\s*"+re.escape(stat), d, re.I)
        return [{"stat":stat,"amount":num(m.group(1))}] if m else None
    return f

CURATED = {
    "Maiden's Serenity":          maidens("Critical Strike","Critical Severity"),
    "Maiden's Advantage":         maidens("Combat Advantage","Power"),
    "Abyssal Accuracy":           gain_tail("Accuracy"),
    "Greater Adaptive Strength":  gain_tail("Critical Severity"),
    "Divine Inspiration":         gain_tail("Forte"),
    "Spiritual Inspiration":      gain_tail("Forte"),
    "Resourceful Forte (Greater)":gain_tail("Forte"),
    "Resourceful Forte (Lesser)": gain_tail("Forte"),
}

def main():
    g = json.loads(P.read_text(encoding="utf-8"))
    applied=0; rows=[]
    for it in g:
        ebs = it.get("equipBonuses") or []
        add=[]
        for idx,eb in enumerate(ebs):
            nm=(eb.get("name") or "").strip()
            if nm not in CURATED: continue
            if eb.get("stat"): continue           # already modeled — leave it
            d=eb.get("description") or eb.get("effect") or ""
            parsed=CURATED[nm](d)
            if not parsed: continue
            first=parsed[0]
            ebs[idx]={"type":eb.get("type","Equip"),"scope":"self","stat":first["stat"],
                      "amount":first["amount"], **({"alwaysActive":False} if first.get("alwaysActive") else {}),
                      "name":nm,"description":d,"parsedFrom":"statgrant-curated"}
            for ex in parsed[1:]:
                add.append({"type":eb.get("type","Equip"),"scope":"self","stat":ex["stat"],"amount":ex["amount"],
                            **({"alwaysActive":False} if ex.get("alwaysActive") else {}),"name":nm,"parsedFrom":"statgrant-curated"})
            applied+=1
            rows.append((it["id"],it["name"],nm,[(p["stat"],p["amount"],p.get("alwaysActive",True)) for p in parsed]))
        ebs.extend(add)
    print(f"{applied} bonuses structured:")
    for r in rows: print(f"  [{r[0]}] {r[2]} on {r[1][:30]}: {r[3]}")
    if APPLY:
        P.write_text(json.dumps(g,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
        print("\nAPPLIED. Run build-data.py.")
    else:
        print("\nDry run. --apply to write.")

if __name__=="__main__": main()
