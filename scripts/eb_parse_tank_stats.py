"""Tank Phase 1 — endgame defensive-stat equip bonuses (IL>=4000, non-set).

Structures the stats the tank model (computeTankExpectedTaken) consumes:
Awareness / Defense / Deflect / Critical Avoidance / Deflect Severity (mitigation)
+ Maximum Hit Points (pool). Many of these are the "defensive" bonuses skipped
during the DPS work — now relevant for tank.

DEFER: "Incoming Damage" reduction bonuses (the tank formula doesn't consume that
stat yet — needs a model term first). Off-role/ally/reflect/utility skipped.
WITH the within-item dedup guard (no same-item duplicates).
"""
import json, sys, re, collections
PATH = "../data/gear.json"; APPLY = "--apply" in sys.argv

def ent(stat, amount, *, rating=False, cond=False, perStack=False, maxStacks=None, name=None, desc=None):
    e = {"type":"Equip","scope":"self","stat":stat,"amount":round(amount,3)}
    if rating: e["kind"]="rating"
    if cond: e["alwaysActive"]=False
    if perStack: e["perStack"]=True
    if maxStacks: e["maxStacks"]=int(maxStacks)
    if name: e["name"]=name
    if desc is not None: e["description"]=desc
    e["parsedFrom"]="description"
    return e
def f(rx,d,dflt=None):
    m=re.search(rx,d); return float(m.group(1).replace(',','')) if m else dflt

def parse(N, d, il):
    if il < 4000: return None
    AW="Awareness"; DEF="Defense"; DFL="Deflect"; CA="Critical Avoidance"; DS="Deflect Severity"; MHP="Maximum Hit Points"
    if N == "Battle Acumen":
        return [ent(AW, 0.4, cond=True, perStack=True, maxStacks=10, name=N, desc=d),
                ent(CA, 0.5, cond=True, perStack=True, maxStacks=10, name=N)]
    if N == "Blitz Rush":          return [ent(AW, 3350, rating=True, name=N, desc=d)]
    if N == "Combatant's Advantage" and "Defense" in d:   # the defensive variant
        return [ent(DEF, 1.1, cond=True, perStack=True, maxStacks=5, name=N, desc=d)]
    if N == "Deflective Agility":  return [ent(DEF, 2.5, cond=True, name=N, desc=d)]
    if N == "Immovable Bulwark":   return [ent(DEF, 2.5, cond=True, name=N, desc=d),
                                           ent(DFL, 4, cond=True, name=N)]
    if N == "Survivor's Critical Resilience":   # at full health -> on; per-tier values
        aw=f(r'Gain ([\d.]+)% Awareness', d)
        dfl=f(r'and ([\d.]+)% Deflect', d) or aw
        return [ent(AW, aw, name=N, desc=d), ent(DFL, dfl, name=N)] if aw else None
    if N == "Survivor's Resistance":
        v=f(r'([\d.]+)% Awareness', d)
        return [ent(AW, v, name=N, desc=d)] if v else None
    if N == "Tactical Insight":    return [ent(AW, 0.4, cond=True, perStack=True, maxStacks=8, name=N, desc=d)]
    if N in ("Reprisal Reflex","Reptilial Reflex"):
        return [ent(AW, 7.5, cond=True, name=N, desc=d)]
    if N == "Retaliatory Shockwave":
        return [ent(AW, 3.5, cond=True, name=N, desc=d)]
    if N == "Sudden Intuition":
        return [ent(AW, 7, cond=True, name=N, desc=d), ent(DS, 7, cond=True, name=N)]
    if N == "Divine Blessing (Ascendant)":      # MaxHP % (the -Incoming Damage HP-scaler deferred)
        return [ent(MHP, 5, name=N, desc=d)]
    return None

g=json.load(open(PATH,encoding="utf-8")); done=collections.Counter(); guard_skips=0
for it in g:
    ebs=it.get("equipBonuses")
    if not ebs: continue
    il=it.get("item_level") or 0
    have={(eb.get("name"), eb.get("stat")) for eb in ebs
          if isinstance(eb.get("stat"),str) and isinstance(eb.get("amount"),(int,float))}
    out=[]
    for eb in ebs:
        blind = eb.get("type")!="Set" and not (eb.get("stat") and eb.get("amount") is not None)
        nm=(eb.get("name") or "").strip()
        if not blind: out.append(eb); continue
        d=(eb.get("description") or eb.get("effectText") or "").strip()
        p=parse(nm,d,il) if d else None
        if p and all(e.get("amount") is not None for e in p):
            kept=[]
            for e in p:
                k=(e.get("name"), e.get("stat"))
                if k in have: guard_skips+=1; continue
                have.add(k); kept.append(e)
            if kept: done[nm]+=1; out.extend(kept)
            else: out.append(eb)
        else: out.append(eb)
    it["equipBonuses"]=out
print(f"structured: {sum(done.values())} instances across {len(done)} names  (guard skipped {guard_skips})")
for nm,c in sorted(done.items()): print(f"  {c}x  {nm}")
if APPLY:
    json.dump(g, open(PATH,"w",encoding="utf-8"), indent=2, ensure_ascii=False); print("WROTE",PATH)
else: print("DRY RUN — re-run with --apply")
