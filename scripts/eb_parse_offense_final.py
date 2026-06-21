"""Batch-5: the final clean-offense leftovers (all IL). Explicit table.

The 15 genuinely-clean offense one-offs from the clean-bucket dump (2026-06-21).
Everything else in that bucket is left free-text: defensive-trade ramps
(Reckless*/Veiled Barricade), shield+zone reductions (Shielded Might/Strength),
reflects (Rothe's/Reprisal), heal/orb/trinket procs (Critical Remedy/Power
Siphon/Superstition), ally auras (Tactical Insight), positional either/or
(Brute's Expertise), party-state (Fairy's Whimsy/Equip Bonus), Awareness/
Incoming-Damage defensive, and minion-death procs.
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

def parse(N, d, il):
    dl = d.lower()
    if N == "Abyssal Accuracy":                         # "5% Accuracy and 3% AP Gain"
        return [ent("Accuracy", 5, name=N, desc=d)]
    if N == "Bloodlust" and "kill an enemy" in dl:      # 100 Power/stack max25
        return [ent("Power", 100, rating=True, cond=True, perStack=True, maxStacks=25, name=N, desc=d)]
    if N == "Daily Edge" and "daily power" in dl:       # Damage +3% on daily
        return [ent("Dmg Bonus", 3, cond=True, name=N, desc=d)]
    if N == "Dashing Ranger" and "3,000" in d:          # rating tier (moving)
        return [ent("Accuracy", 3000, rating=True, cond=True, name=N, desc=d),
                ent("Critical Severity", 3000, rating=True, cond=True, name=N)]
    if N == "Death Defier's Focus":                     # 200 CritStrike per enemy, max15
        return [ent("Critical Strike", 200, rating=True, cond=True, perStack=True, maxStacks=15, name=N, desc=d)]
    if N == "Enduring Accuracy" and "hit points" in dl:
        return [ent("Accuracy", 5, name=N, desc=d)]
    if N == "Enduring Focus" and "hit points" in dl:
        return [ent("Critical Severity", 5, name=N, desc=d)]
    if N == "Executioner's Haste" and "kill an enemy" in dl:   # +Acc 5% (MS off-role)
        return [ent("Accuracy", 5, cond=True, name=N, desc=d)]
    if N == "Expert's Might" and "moving" in dl:        # Power +5% moving
        return [ent("Power", 5, cond=True, name=N, desc=d)]
    if N == "Gutsy Mercenary" and "moving" in dl:       # CA + Power +3000 moving
        return [ent("Combat Advantage", 3000, rating=True, cond=True, name=N, desc=d),
                ent("Power", 3000, rating=True, cond=True, name=N)]
    if N == "Protector's Focus" and "shield" in dl:     # CritStrike +1000 when shielded
        return [ent("Critical Strike", 1000, rating=True, cond=True, name=N, desc=d)]
    if N == "Running Apothecary" and "moving" in dl:    # CritStrike + Forte +3000 moving
        return [ent("Critical Strike", 3000, rating=True, cond=True, name=N, desc=d),
                ent("Forte", 3000, rating=True, cond=True, name=N)]
    if N == "Blessed Land":                             # +5% Base Damage Boost in blessed area
        return [ent("Base Damage Boost", 5, cond=True, name=N, desc=d)]
    if N == "Escalating Might" and "strike an enemy" in dl:    # 250 Power/stack max20
        return [ent("Power", 250, rating=True, cond=True, perStack=True, maxStacks=20, name=N, desc=d)]
    if N == "Mountain's Valor" and "strike an enemy" in dl:    # 0.5% Power/stack max10 (Awareness/MS off-role)
        return [ent("Power", 0.5, cond=True, perStack=True, maxStacks=10, name=N, desc=d)]
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
        if p: done[nm]+=1; out.extend(p)
        else: out.append(eb)
    it["equipBonuses"]=out
print(f"structured: {sum(done.values())} instances across {len(done)} names")
for nm,c in sorted(done.items()): print(f"  {c}x  {nm}")
if APPLY:
    json.dump(g, open(PATH,"w",encoding="utf-8"), indent=2, ensure_ascii=False); print("WROTE",PATH)
else: print("DRY RUN — re-run with --apply")
