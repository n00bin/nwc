"""Healer Phase 1 batch-2 — IL<4000 healing-stat bonuses (clean OH/OOH/IH).

Structures clean Outgoing Healing / Overall Outgoing Healing / Incoming Healing
(+ paired Power/Crit) on lower-IL healer gear. SKIPS the complex ones:
role-conditional zone (Spider's Bane, Umbral Stride), party-state either/or
(This or That), zone-specific (Menzoberranzan Spider), heal-procs/ally-target
(Medic's Respite/Devotion/Regards, Healing Foci), stamina either/or (Brutish
Tactics, Depleted Expert).

DEDUP GUARD (lesson from batch-1): never add a (name, stat) that's ALREADY
structured on the same item, and never structure the same (name, stat) twice
from duplicate free-text copies. Prevents the 41-duplicate bug.
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
def f(rx,d,dflt=None):
    m=re.search(rx,d); return float(m.group(1).replace(',','')) if m else dflt

def parse(N, d, il):
    if il >= 4000: return None
    OH="Outgoing Healing"; OOH="Overall Outgoing Healing"; IH="Incoming Healing"
    # --- always-on flat OH rating ---
    if N == "Battlefield Tranquility": return [ent(OH, 7500, rating=True, name=N, desc=d)]
    if N == "Fiery Harmony":           return [ent(OH, 3775, rating=True, name=N, desc=d)]
    if N == "Spelljammer's Harmony":   return [ent(OH, 3350, rating=True, name=N, desc=d)]
    # --- always-on percent OH (read value; divinity-regen clause ignored) ---
    if N in ("Fiery Mote","Fiery Muse","Galactic Muse","Occult Invigoration"):
        v=f(r'[Gg]ain ([\d.]+)% Outgoing Healing', d) or f(r'\+?([\d.]+)% Outgoing Healing', d)
        return [ent(OH, v, name=N, desc=d)] if v else None
    # --- HP-scaler OH (+ optional Power rating) ---
    if N == "Survivor's Gift":
        out=[ent(OH, 6, name=N, desc=d)]
        p=f(r'Power up to a max of ([\d,]+)', d)
        if p: out.append(ent("Power", p, rating=True, name=N))
        return out
    # --- per-party-member OH ---
    if N == "Graceful Harmony":
        v=f(r'([\d.]+)% Outgoing Healing', d)
        return [ent(OH, v, perStack=True, maxStacks=5, name=N, desc=d)] if v else None
    if N == "Leader's Power":
        return [ent("Power", 1000, rating=True, perStack=True, maxStacks=5, name=N, desc=d),
                ent(OH, 1000, rating=True, perStack=True, maxStacks=5, name=N)]
    # --- conditional OH ---
    if N == "Expert's Focus":      return [ent(OH, 5, cond=True, name=N, desc=d)]
    if N == "Healing Preparation": return [ent(OH, 10, cond=True, name=N, desc=d)]
    if N == "Overwhelming Grace":
        v=f(r'up to ([\d.]+)% Outgoing Healing', d)
        return [ent(OH, v, cond=True, multiEnemy=True, name=N, desc=d)] if v else None
    if N == "Solitary Grace":
        v=f(r'up to ([\d.]+)% Outgoing Healing', d)
        return [ent(OH, v, cond=True, name=N, desc=d)] if v else None
    # --- combat-ramp OH (+ paired stat) ---
    if N == "Channeler's Focus":
        v=f(r'\+?([\d.]+)% Outgoing Healing', d)
        return [ent(OH, v, cond=True, perStack=True, maxStacks=10, name=N, desc=d),
                ent("Power", v, cond=True, perStack=True, maxStacks=10, name=N)] if v else None
    if N == "Gladiator's Restoration (Greater)":
        return [ent(OH, 0.8, cond=True, perStack=True, maxStacks=5, name=N, desc=d),
                ent("Critical Strike", 0.8, cond=True, perStack=True, maxStacks=5, name=N)]
    # --- OOH (heal-type-specific -> modeled as the flat OOH multiplier) ---
    if N == "Calculated Healer": return [ent(OOH, 7, name=N, desc=d)]
    if N == "Tunneled Healer":   return [ent(OOH, 8, name=N, desc=d)]
    if N == "Healer's Sacrifice": return [ent(OOH, 5, name=N, desc=d)]   # -30% IH cost left in prose
    # --- clean IH (survivability) ---
    if N == "Spelljammer's Fortified Ally": return [ent(IH, 2.5, name=N, desc=d)]
    if N == "Warded Health":                return [ent(IH, 7, cond=True, name=N, desc=d)]
    if N == "Medic's Expertise":            return [ent(IH, 3000, rating=True, cond=True, name=N, desc=d)]
    return None

g=json.load(open(PATH,encoding="utf-8")); done=collections.Counter(); guard_skips=0
for it in g:
    ebs=it.get("equipBonuses")
    if not ebs: continue
    il=it.get("item_level") or 0
    # existing (name,stat) already structured on THIS item -> the dedup guard
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
                key=(e.get("name"), e.get("stat"))
                if key in have: guard_skips+=1; continue   # GUARD: already on this item
                have.add(key); kept.append(e)
            if kept: done[nm]+=1; out.extend(kept)
            else: out.append(eb)
        else: out.append(eb)
    it["equipBonuses"]=out
print(f"structured: {sum(done.values())} instances across {len(done)} names  (guard skipped {guard_skips} would-be duplicates)")
for nm,c in sorted(done.items()): print(f"  {c}x  {nm}")
if APPLY:
    json.dump(g, open(PATH,"w",encoding="utf-8"), indent=2, ensure_ascii=False); print("WROTE",PATH)
else: print("DRY RUN — re-run with --apply")
