"""Healer Phase 1 — endgame healing-stat equip bonuses (IL>=4000, non-set).

Structures the Outgoing Healing / Incoming Healing / Power bonuses on endgame
healer gear so the existing heal model (computeHealExpectedHeal: Power × OH ×
OOH) scores them. Explicit per-name table, values read from prose.
OH = Outgoing Healing (feeds heal OUTPUT). IH = Incoming Healing (survivability,
on-panel, NOT in heal output). "above X% HP" = on (alwaysActive), "below X%" /
low-HP trigger = conditional. Per-party-member = perStack/maxStacks 5, baseline on.
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
def f(rx,d,default=None):
    m=re.search(rx,d); return float(m.group(1).replace(',','')) if m else default

def parse(N, d, il):
    if il < 4000: return None
    if N == "Battle Harmony":                       # flat OH rating, always
        return [ent("Outgoing Healing", 3350, rating=True, name=N, desc=d)]
    if N == "Gladiator's Sustenance (Greater)":     # combat ramp IH
        return [ent("Incoming Healing", 2.4, cond=True, perStack=True, maxStacks=5, name=N, desc=d)]
    if N == "Gladiator's Sustenance (Lesser)":
        return [ent("Incoming Healing", 1.6, cond=True, perStack=True, maxStacks=5, name=N, desc=d)]
    if N == "Graceful Harmony":                     # per-party-member OH (only the explicit-value tier)
        v = f(r'([\d.]+)% Outgoing Healing', d)
        return [ent("Outgoing Healing", v, perStack=True, maxStacks=5, name=N, desc=d)] if v else None
    if N == "Survivor's Gift":                      # HP-scaler: OH% + Power rating, both on
        return [ent("Outgoing Healing", 6, name=N, desc=d),
                ent("Power", 5650, rating=True, name=N)]
    if N in ("Survivor's Grace (Greater)", "Survivor's Grace (Lesser)", "Survivor's Instinct"):
        v = f(r'Outgoing Healing is increased by ([\d.]+)%', d)   # above-90% = on
        return [ent("Outgoing Healing", v, name=N, desc=d)] if v else None
    if N == "Undying's Grasp (Greater)":            # low-HP trigger IH (conditional)
        return [ent("Incoming Healing", 40, cond=True, name=N, desc=d)]
    if N == "Undying's Grasp (Lesser)":
        return [ent("Incoming Healing", 10, cond=True, name=N, desc=d)]
    if N == "Vital Equilibrium":                    # above-50% Power (on) + below-50% IH (cond)
        return [ent("Power", 5, name=N, desc=d),
                ent("Incoming Healing", 7, cond=True, name=N)]
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
