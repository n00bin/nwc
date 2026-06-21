"""IL<2000 offense equip-bonus parse — batch 4 (low-IL completeness).

The cleanly-structurable core of the IL<2000 long tail. Explicit per-name
table, values read from each instance's prose. Everything else at IL<2000 is
left free-text ON PURPOSE: cooldown procs (Encounter Reprieve), heal procs
(Critical Remedy), CC/debuffs, collection set bonuses, positional either/or,
party-state, enemy/zone-specific, random-stat procs, unknown-stack ramps.
"""
import json, sys, re, collections
PATH = "../data/gear.json"; APPLY = "--apply" in sys.argv

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
def f(rx, d, default=None):
    m=re.search(rx, d); return float(m.group(1).replace(',','')) if m else default

def parse(N, d, il):
    if il >= 2000: return None
    dl = d.lower()
    if N == "Executioner's Might" and "kill an enemy" in dl:
        v=f(r'Power increases by ([\d,]+)', d)
        return [ent("Power", v, rating=True, cond=True, name=N, desc=d)] if v else None
    if N == "Charged At-Will" and "at-will attacks by" in dl:
        v=f(r'at-?will attacks by ([\d.]+)%', d)
        return [ent("At Will Dmg Bonus", v, cond=True, name=N, desc=d)] if v else None
    if N == "Contender's Focus" and "start of combat" in dl:
        v=f(r'Critical Strike is increased by ([\d,]+)', d)
        return [ent("Critical Strike", v, rating=True, cond=True, name=N, desc=d)] if v else None
    if N == "Enduring Critical" and "hit points" in dl:
        v=f(r'maximum of ([\d.]+)%', d)
        return [ent("Critical Strike", v, name=N, desc=d)] if v else None
    if N == "Durable Critical" and "hit points" in dl:
        v=f(r'maximum of ([\d,]+)', d)
        return [ent("Critical Strike", v, rating=True, name=N, desc=d)] if v else None
    if N == "Durable Focus" and "hit points" in dl:
        v=f(r'maximum of ([\d,]+)', d)
        return [ent("Critical Severity", v, rating=True, name=N, desc=d)] if v else None
    if N == "Maiden's Serenity":
        return [ent("Critical Strike", 5, name=N, desc=d),
                ent("Critical Severity", 2.5, cond=True, multiEnemy=True, name=N)]
    if N == "Tenacious Luck" and "one enemy" in dl:
        return [ent("Critical Strike", 7, cond=True, name=N, desc=d)]
    if N == "Maximized Opportunity" and "one enemy" in dl:
        return [ent("Combat Advantage", 7, cond=True, name=N, desc=d)]
    if N == "Critical Serenity" and "or more enemies" in dl:
        v=f(r'([\d,]+) Critical Severity', d)
        return [ent("Critical Severity", v, rating=True, cond=True, multiEnemy=True, name=N, desc=d)] if v else None
    if N == "Escalating Torrent" and "strike an enemy" in dl:
        v=f(r'Gain ([\d,]+) Power', d)
        mx=50 if "50 times" in d else 20
        return [ent("Power", v, rating=True, cond=True, perStack=True, maxStacks=mx, name=N, desc=d)] if v else None
    if N == "Brute's Advantage" and "closer to" in dl:
        v=f(r'increased by ([\d,]+)', d)
        return [ent("Combat Advantage", v, rating=True, cond=True, name=N, desc=d),
                ent("Accuracy", v, rating=True, cond=True, name=N)] if v else None
    if N == "Sniper's Advantage" and "further" in dl:
        v=f(r'Combat Advantage is increased by ([\d.]+)%', d)
        return [ent("Combat Advantage", v, cond=True, name=N, desc=d)] if v else None
    if N == "Occult Advantage" and "control res" in dl:   # the +5% CA / -Control Resist variant
        v=f(r'([\d.]+)% Combat Advantage', d)
        return [ent("Combat Advantage", v, name=N, desc=d)] if v else None
    return None

g=json.load(open(PATH,encoding="utf-8")); done=collections.Counter()
for it in g:
    ebs=it.get("equipBonuses")
    if not ebs: continue
    il=it.get("item_level") or 0
    out=[]
    for eb in ebs:
        blind = eb.get("type")!="Set" and not (eb.get("stat") and eb.get("amount") is not None)
        nm=(eb.get("name") or "").strip()
        if not blind: out.append(eb); continue
        d=(eb.get("description") or eb.get("effectText") or "").strip()
        p=parse(nm,d,il) if d else None
        if p and all(e.get("amount") is not None for e in p): done[nm]+=1; out.extend(p)
        else: out.append(eb)
    it["equipBonuses"]=out
print(f"structured: {sum(done.values())} instances across {len(done)} names")
for nm,c in sorted(done.items()): print(f"  {c}x  {nm}")
if APPLY:
    json.dump(g, open(PATH,"w",encoding="utf-8"), indent=2, ensure_ascii=False); print("WROTE",PATH)
else: print("DRY RUN — re-run with --apply")
