#!/usr/bin/env python3
"""Structure PROC stat-grant equip bonuses ("whenever you crit/strike/deal a
big hit, gain X% Stat for Ys") that counted as zero. The engine uptime-weights
them (uptimeWeighted:true -> amount x duty-cycle), so they count at the honest
sustained average, not full value or zero.

  python scripts/eb_procstat_curated.py            # dry run
  python scripts/eb_procstat_curated.py --apply

Conservative: only panel offensive/defensive stats; SKIPS stacking hybrids
("Max N stacks"/"Stacks N times"), and stamina/movement/recharge/control-only
procs. Non-panel extras riding along (Recharge/Movement) are dropped, never
blocking a real stat. Each parsed entry keeps its description so the engine's
conditionalDamageUptime() can read the trigger/chance/duration/ICD.
"""
import json, re, sys
from pathlib import Path
P = Path(__file__).resolve().parent.parent.parent / "data" / "gear.json"
APPLY = "--apply" in sys.argv

STATS = {"power":"Power","combat advantage":"Combat Advantage","critical strike":"Critical Strike",
 "critical severity":"Critical Severity","critical chance":"Critical Strike","accuracy":"Accuracy",
 "armor penetration":"Armor Penetration","defense":"Defense","awareness":"Awareness",
 "critical avoidance":"Critical Avoidance","deflect":"Deflect","deflect severity":"Deflect Severity",
 "forte":"Forte","outgoing healing":"Outgoing Healing"}
def canon(s): return STATS.get(re.sub(r"\s+"," ",s.strip().lower()))
PANEL=set(STATS.values())|{"Maximum Hit Points","Combined Rating"}
def routed(eb):
    s=eb.get("stat"); return bool(s) and (s in PANEL or re.search(r"Damage|Dmg|Boost",s or ""))

# "gain +X% Stat" occurrences (one or more, joined by 'and')
GAIN = re.compile(r"\+?(\d+(?:\.\d+)?)%\s*([A-Za-z][A-Za-z ]*?)(?=\s+and\b|\s+for\b|\.|,|$)", re.I)
TRIGGER = re.compile(r"(whenever|when) you .{0,50}?(critically strike|critical strike|deal combat advantage|deal|strike|deflect|damage)", re.I)

def main():
    g=json.loads(P.read_text(encoding="utf-8"))
    applied=0; rows=[]; skipped=[]
    for it in g:
        ebs=it.get("equipBonuses") or []; add=[]
        routedNames={(e.get("name") or "") for e in ebs if routed(e)}
        for idx,eb in enumerate(ebs):
            if routed(eb): continue
            nm=(eb.get("name") or "")
            if nm in routedNames: continue
            d=(eb.get("description") or eb.get("effect") or "").strip()
            dl=d.lower()
            if not TRIGGER.search(d): continue
            if "for" not in dl or "second" not in dl: continue
            if "gain" not in dl: continue
            # SKIP hybrids/wrong scope
            if re.search(r"max \d+ stack|max stack|stacks \d+ times|stacks up to|in combat with|"
                         r"wildspace|thay|underdark|reghed|biting cold|skyhold|for each|teammate|ally|allies|"
                         r"next encounter|next at|\borbs?\b", dl):
                if len(skipped)<14: skipped.append((it['id'],nm,d[:80]));
                continue
            # parse the gains after the first "gain"
            gi = dl.find("gain")
            seg = d[gi:]
            seg = seg.split(" for ")[0] if " for " in seg.lower() else seg
            parsed=[]
            for v,s in GAIN.findall(seg):
                st=canon(s)
                if st and st not in ("Stamina Regeneration","Recharge Speed","Movement Speed"):
                    parsed.append((st,float(v)))
            if not parsed:
                if len(skipped)<14: skipped.append((it['id'],nm,d[:80]))
                continue
            first=parsed[0]
            ebs[idx]={"type":eb.get("type","Equip"),"scope":"self","stat":first[0],"amount":first[1],
                      "alwaysActive":False,"uptimeWeighted":True,"name":nm,"description":d,
                      "parsedFrom":"procstat"}
            for s,a in parsed[1:]:
                add.append({"type":eb.get("type","Equip"),"scope":"self","stat":s,"amount":a,
                            "alwaysActive":False,"uptimeWeighted":True,"name":nm,"parsedFrom":"procstat"})
            applied+=1; rows.append((it['id'],nm,parsed))
        ebs.extend(add)
    print(f"{applied} proc stat-grants structured (engine will uptime-weight):")
    for r in rows: print(f"  [{r[0]}] {r[1][:26]}: {r[2]}")
    print("\nSKIPPED (stacking hybrid / non-panel / scope):")
    for i,nm,d in skipped: print(f"  [{i}] {nm}: {d}")
    if APPLY:
        P.write_text(json.dumps(g,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
        print("\nAPPLIED. Run build-data.py.")
    else:
        print("\nDry run. --apply to write.")

if __name__=="__main__": main()
