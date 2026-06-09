#!/usr/bin/env python3
"""Parse "you gain X% Stat" equip-bonus prose into structured {stat,amount}
so the engine counts it. These slipped earlier eb-parse passes because they're
worded "gain X%" rather than the flat "+X% Stat" the old parser keyed on.

Conservative & dry-run by default:
  python scripts/eb_parse_statgrant.py            # report only
  python scripts/eb_parse_statgrant.py --apply    # write ../data/gear.json

Modeling rules (documented so audits don't 'fix' them):
- FLAT "(you) gain X% Stat" with no condition          -> always-on {stat,amount}
- "...while at full health"                            -> always-on (DPS sims assume full HP)
- "for every Ns in combat ... Max M stacks: T%"        -> always-on at MAX (T%): sustained
                                                          boss fights reach max stacks
- chance/short-duration PROC ("Xx% chance on crit...")  -> {alwaysActive:false} (uptime-modeled)
- flat rating grant ("gain 4,950 Critical Strike")     -> {kind:"rating"}
- "Gain X% Forte" tail after a Divinity/Soulweave line  -> always-on Forte (resource-max part skipped)
- zone words (Wildspace/Thay/Underdark/Reghed)          -> zones:[...] (excluded in General)
- party/enemy-count scaling, control, healing-orb,      -> SKIPPED (reported, need bespoke handling)
  resource-max-only, ally-aura-only

Only ONE structured stat entry is added per clean numeric stat; the original
description is preserved. parsedFrom:"statgrant" marks them.
"""
import json, re, sys
from pathlib import Path

P = Path(__file__).resolve().parent.parent.parent / "data" / "gear.json"
APPLY = "--apply" in sys.argv

PANEL = {"power","combat advantage","critical strike","critical severity","accuracy",
 "armor penetration","defense","awareness","critical avoidance","deflect","deflect severity",
 "forte","incoming healing","outgoing healing","control bonus","control resist"}
DMG = re.compile(r"Damage|Dmg|Boost", re.I)
def already_routed(eb):
    s = eb.get("stat")
    return bool(s) and (s.lower() in PANEL or s in ("Maximum Hit Points","Combined Rating")
                        or (DMG.search(s) and "Healing" not in s))

def canon(stat):
    s = re.sub(r"\s+"," ", stat.strip().lower())
    m = {"power":"Power","combat advantage":"Combat Advantage","critical strike":"Critical Strike",
     "critical severity":"Critical Severity","accuracy":"Accuracy","armor penetration":"Armor Penetration",
     "defense":"Defense","awareness":"Awareness","critical avoidance":"Critical Avoidance",
     "deflect":"Deflect","deflect severity":"Deflect Severity","forte":"Forte",
     "incoming healing":"Incoming Healing","outgoing healing":"Outgoing Healing",
     "control bonus":"Control Bonus","control resist":"Control Resist","critical chance":"Critical Strike"}
    return m.get(s)

ZONES = {"wildspace":"Wildspace","thay":"Thay","underdark":"Underdark","reghed":"The Reghed Edge"}
def zones_in(d):
    z=[]
    for k,v in ZONES.items():
        if re.search(r"\bin "+k, d, re.I) or re.search(k+r" arena", d, re.I): z.append(v)
    return z

# Skip patterns — genuinely not a clean self stat we should auto-model
SKIP = re.compile(r"for each (player|enemy)|teammates?|allies|orbs around|knockback|"
 r"reflect \d|drop \d orbs|maximum increases|lowest-?hp", re.I)

def parse(eb):
    """-> (list_of_structured_entries, classification) or (None, reason)."""
    d = (eb.get("description") or eb.get("effect") or "").strip()
    if not d: return None, "no-desc"
    low = d.lower()
    z = zones_in(d)

    # flat rating grant: "gain 4,950 Critical Strike" (no % on the stat)
    mr = re.search(r"gain[s]?\s+([\d,]{3,})\s+(critical strike|critical severity|power|combat advantage|accuracy|outgoing healing|defense|awareness|forte|deflect)", d, re.I)
    if mr and "%" not in d[mr.start():mr.start()+40]:
        st = canon(mr.group(2));
        if st:
            e = {"type":eb.get("type","Equip"),"scope":"self","stat":st,"amount":int(mr.group(1).replace(",","")),
                 "kind":"rating","name":eb.get("name"),"description":d,"parsedFrom":"statgrant"}
            return [e], "flat-rating"

    # stacking "Max [M] [Stacks]: T% Stat[ and Stat2]" — capture the TOTAL at max
    ms = re.search(r"max(?:imum)?[^:]*?:\s*\+?(\d+(?:\.\d+)?)%\s*([A-Za-z ]+?)(?:\.|,|$|\band\b\s*\+?\d)", d, re.I)
    if ms and "stack" in low:
        st = canon(ms.group(2))
        if st:
            out=[{"type":eb.get("type","Equip"),"scope":"self","stat":st,"amount":float(ms.group(1)),
                  "name":eb.get("name"),"description":d,"parsedFrom":"statgrant","note":"max-stacks total (sustained-combat always-on)"}]
            if z: out[0]["zones"]=z
            # second stat in "Max ...: X% A and Y% B"
            ms2 = re.search(r":\s*\+?\d+(?:\.\d+)?%\s*[A-Za-z ]+?\s+and\s+\+?(\d+(?:\.\d+)?)%\s*([A-Za-z ]+?)(?:\.|,|$)", d, re.I)
            if ms2 and canon(ms2.group(2)):
                out.append({"type":eb.get("type","Equip"),"scope":"self","stat":canon(ms2.group(2)),"amount":float(ms2.group(1)),
                            "name":eb.get("name"),"parsedFrom":"statgrant"})
            return out, "stacking-max"

    # chance/short-duration proc -> conditional (uptime-modeled)
    is_proc = bool(re.search(r"\d+%\s*(chance|to gain)|whenever you (critically strike|deal|are damaged|deflect)|when you (strike|use|damage|deal)", low)) and "for" in low and "second" in low

    # plain "(you) gain X% Stat" (+ optional "and Y% Stat2"), incl. "while at full health"
    mg = re.search(r"gain[s]?\s+\+?(\d+(?:\.\d+)?)%\s*([A-Za-z ]+?)(?:\.|,|$|\band\b|\bwhen\b|\bwhile\b|\bfor\b)", d, re.I)
    if mg:
        st = canon(mg.group(2))
        if st:
            cond = is_proc or bool(re.search(r"\bwhen (you|your|in)\b|\bwhile (moving|your)\b|over 75%|above 50%|below 50%", low)) and "full health" not in low
            e = {"type":eb.get("type","Equip"),"scope":"self","stat":st,"amount":float(mg.group(1)),
                 "name":eb.get("name"),"description":d,"parsedFrom":"statgrant"}
            if cond: e["alwaysActive"]=False
            if z: e["zones"]=z
            out=[e]
            # second "and Y% Stat2" immediately after
            m2 = re.search(r"gain[s]?\s+\+?\d+(?:\.\d+)?%\s*[A-Za-z ]+?\s+and\s+\+?(\d+(?:\.\d+)?)%\s*([A-Za-z ]+?)(?:\.|,|$|\bfor\b|\bwhen\b)", d, re.I)
            if m2 and canon(m2.group(2)):
                e2={"type":eb.get("type","Equip"),"scope":"self","stat":canon(m2.group(2)),"amount":float(m2.group(1)),
                    "name":eb.get("name"),"parsedFrom":"statgrant"}
                if cond: e2["alwaysActive"]=False
                out.append(e2)
            return out, ("proc-conditional" if cond else "flat-alwayson")
    return None, "unparsed"

def main():
    g = json.loads(P.read_text(encoding="utf-8"))
    from collections import Counter
    cls = Counter(); applied=0; skipped=[]; samples=[]
    for it in g:
        ebs = it.get("equipBonuses") or []
        for idx,eb in enumerate(ebs):
            if already_routed(eb): continue
            d=(eb.get("description") or eb.get("effect") or "")
            if not re.search(r"gain[s]?\s+\+?[\d,]", d, re.I): continue
            if not re.search(r"power|critical|combat advantage|accuracy|armor penetration|forte|defense|awareness|deflect|outgoing healing", d, re.I): continue
            if SKIP.search(d):
                cls["SKIP-bespoke"]+=1
                if len(skipped)<12: skipped.append((it['name'],eb.get('name'),d[:90]))
                continue
            entries,klass = parse(eb)
            if not entries:
                cls["SKIP-"+klass]+=1
                if len(skipped)<12: skipped.append((it['name'],eb.get('name'),d[:90]))
                continue
            cls[klass]+=1
            if len(samples)<22:
                samples.append((it['name'],klass,[{k:e[k] for k in ('stat','amount','kind','alwaysActive','zones') if k in e} for e in entries]))
            if APPLY:
                # replace this eb with the first structured entry; append extras
                ebs[idx]=entries[0]
                for extra in entries[1:]: ebs.append(extra)
                applied+=1
    print("classification:")
    for k,n in cls.most_common(): print(f"  {n:4}  {k}")
    print("\nsample parses:")
    for nm,kl,es in samples: print(f"  [{kl}] {nm}: {es}")
    print("\nsample SKIPPED (need bespoke):")
    for nm,bn,d in skipped: print(f"  {nm} / {bn}: {d}")
    if APPLY:
        P.write_text(json.dumps(g,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
        print(f"\nAPPLIED {applied} parses. Run build-data.py + review git diff.")
    else:
        print("\nDry run. Re-run with --apply to write.")

if __name__=="__main__": main()
