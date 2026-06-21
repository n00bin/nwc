"""Generic OFFENSE family parser — bulk pass across ALL item levels.

Instead of per-name/per-IL tables, this detects a small set of DISTINCTIVE
trigger phrases and structures the offense stat/amount pairs inside them.
Only fires on confident matches; anything ambiguous is left free-text.
Run with no flag = dry-run + per-family verification sample. --apply writes.

SAFETY:
- only OFFENSE stats (Power/Crit Strike/Crit Severity/Combat Advantage/
  Accuracy/Dmg Bonus). Defensive/utility left for a separate pass.
- hard skip-guards: [pending re-verify], sequence-procs (next encounter / more
  damage), damage-procs (magnitude / chance to deal), enemy-debuff auras
  (decreases enemy), positional either/or (closer ... further), shield/zone
  either-or with reductions, party-state either/or.
- multi-stat clauses handled (extracts every amount+stat pair in the clause).
"""
import json, sys, re, collections
PATH = "../data/gear.json"
APPLY = "--apply" in sys.argv

STAT_ALT = r"(Power|Critical Strike|Crit Strike|CritStrike|Critical Chance|Critical Severity|Crit Severity|CritSev|Combat Advantage|Accuracy)"
def canon(s):
    s = s.lower().strip()
    return {"power":"Power","critical strike":"Critical Strike","crit strike":"Critical Strike",
            "critstrike":"Critical Strike","critical chance":"Critical Strike",
            "critical severity":"Critical Severity","crit severity":"Critical Severity","critsev":"Critical Severity",
            "combat advantage":"Combat Advantage","accuracy":"Accuracy"}.get(s)

def ent(stat, amount, *, rating=False, cond=False, perStack=False, maxStacks=None,
        multiEnemy=False, name=None, desc=None):
    e = {"type":"Equip","scope":"self","stat":stat,"amount":round(amount,3)}
    if rating: e["kind"]="rating"
    if cond: e["alwaysActive"]=False
    if perStack: e["perStack"]=True
    if maxStacks: e["maxStacks"]=int(maxStacks)
    if multiEnemy: e["requiresMultiEnemy"]=True
    if name: e["name"]=name
    if desc is not None: e["description"]=desc
    e["parsedFrom"]="description"
    return e

# hard skips — never structure these
SKIP = re.compile(r"\[pending re-verify|\[needs re-verify|next (encounter|at-?will|daily|power)|"
                  r"more damage|\bmagnitude\b|chance to deal|takes .*damage equal|"
                  r"decreases? enemy|enemy .*(Defense|Awareness)|aura that decreases|"
                  r"closer to (your )?target.*(further|farther)|further (away )?from your target.*("
                  r"closer)|non-Wildspace|in non-|when not in a party|orb which can be", re.I)

def pairs_pct(span):
    out=[]
    for m in re.finditer(rf"\+?([\d.]+)%\s*{STAT_ALT}", span):
        c=canon(m.group(2))
        if c: out.append((c, float(m.group(1))))
    return out
def pairs_rating(span):
    out=[]
    for m in re.finditer(rf"(?<![\d.])([\d,]{{3,}})\s*{STAT_ALT}", span):
        c=canon(m.group(2))
        if c: out.append((c, float(m.group(1).replace(',',''))))
    return out

def families(N, d):
    if SKIP.search(d): return None
    out=[]
    def mk(plist, **fl):
        for i,(st,amt) in enumerate(plist):
            out.append(ent(st, amt, name=N, desc=(d if not out else None), **fl))

    # 1) HP-scaler -> always on
    m=re.search(rf"current Hit Points (?:increases|increase) (?:your )?{STAT_ALT},? up to a max(?:imum)? of ([\d.]+)%", d)
    if m and canon(m.group(1)):
        mk([(canon(m.group(1)), float(m.group(2)))]); return out

    # 2) single-enemy gate -> conditional
    m=re.search(r"(?:When |While )?in combat with (?:only )?one enemy", d, re.I)
    if m:
        ps=pairs_pct(d[m.start():])
        if ps: mk(ps, cond=True); return out

    # 3) kill-trigger -> conditional (percent only; rating Exec Offense handled by hand)
    m=re.search(r"When you kill an enemy", d, re.I)
    if m:
        ps=pairs_pct(d[m.start():])
        if ps: mk(ps, cond=True); return out

    # 4) daily-trigger stat buff -> conditional
    m=re.search(r"When you use a Daily power", d, re.I)
    if m:
        ps=pairs_pct(d[m.start():])
        if ps: mk(ps, cond=True); return out

    # 5) crit-trigger stat buff -> conditional
    m=re.search(r"(?:Whenever|When) you Critically Strike", d, re.I)
    if m:
        ps=pairs_pct(d[m.start():])
        if ps: mk(ps, cond=True); return out

    # 6) on-strike RATING ramp -> rating, perStack, maxStacks
    if re.search(r"when you strike an enemy", d, re.I):
        mx=None
        mm=re.search(r"Max (\d+) Stacks", d) or re.search(r"Stacks (\d+) times", d) or re.search(r"Stacks? (\d+)", d)
        if mm: mx=int(mm.group(1))
        if mx:
            rs=pairs_rating(d.split("when you strike")[0] + " ")  # the "Gain X STAT" before the trigger
            rs=[(s,a) for s,a in rs if 100<=a<=20000]
            if rs: mk(rs, rating=True, cond=True, perStack=True, maxStacks=mx); return out

    return out or None

g=json.load(open(PATH,encoding="utf-8"))
done=collections.Counter(); samples=collections.defaultdict(list)
fam_of={}
for it in g:
    ebs=it.get("equipBonuses")
    if not ebs: continue
    out=[]
    for eb in ebs:
        blind = eb.get("type")!="Set" and not (eb.get("stat") and eb.get("amount") is not None)
        nm=(eb.get("name") or "").strip()
        if not blind: out.append(eb); continue
        d=(eb.get("description") or eb.get("effectText") or "").strip()
        parsed=families(nm,d) if d else None
        if parsed:
            done[nm]+=1
            # capture a few samples for eyeball verification
            key = "HP" if "Hit Points" in d else ("single-enemy" if "one enemy" in d.lower() else
                  ("kill" if "kill an enemy" in d.lower() else ("daily" if "Daily power" in d else
                  ("crit" if "Critically Strike" in d else "strike-ramp"))))
            if len(samples[key])<4:
                samples[key].append((d[:120], [(e["stat"],e["amount"],{k:e[k] for k in ("kind","alwaysActive","perStack","maxStacks") if k in e}) for e in parsed]))
            out.extend(parsed)
        else:
            out.append(eb)
    it["equipBonuses"]=out

print(f"structured: {sum(done.values())} instances across {len(done)} names\n")
for fam in ("HP","single-enemy","kill","daily","crit","strike-ramp"):
    print(f"=== family: {fam} ===")
    for desc,res in samples[fam]:
        print(f"   PROSE: {desc}")
        print(f"   ->     {res}")
    print()
if APPLY:
    json.dump(g, open(PATH,"w",encoding="utf-8"), indent=2, ensure_ascii=False); print("WROTE",PATH)
else:
    print("DRY RUN — verify the samples above, then --apply")
