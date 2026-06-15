"""IL>=3000 offense equip-bonus parse — batch 2 of the gear long-tail.

NEW names not covered by eb_parse_endgame_offense.py (which gates IL>=4000).
Explicit per-name table, verified against prose from scripts/eb_census dump
(2026-06-15). Guards the two tier-divergent names that would collide if the
endgame gate were simply lowered:
  - Critical Momentum: Crit STRIKE @IL3800 vs Crit SEVERITY @IL4600+  -> deferred here
  - Sprinter's Advantage: flat RATING @IL3600 vs PERCENT @IL4350      -> rating handled, % left to endgame script

DEFERRED (not this batch):
  - SET bonuses ("(2/2)" / "X of Set" / Whisper of Power x16, Freezing x5,
    blank-name +2% CA x6) -> need engine set-crediting verified first.
  - defensive / survivability / reflect / off-role: Combatant's Advantage
    (Defense variant), Critical Guard, Overwhelming Parry, Reckless Remedy,
    Reprisal/Reptilial Reflex, Sudden Intuition, Tactical Insight, Brute's
    Expertise (positional), Past Regards (survival proc), Critical Momentum
    (IL3800 CritStrike, ambiguous max-stacks).
"""
import json, sys, collections
PATH = "../data/gear.json"
APPLY = "--apply" in sys.argv

def ent(stat, amount, *, rating=False, cond=False, perStack=False, maxStacks=None,
        zones=None, scope="self", multiEnemy=False, name=None, desc=None):
    e = {"type": "Equip", "scope": scope, "stat": stat, "amount": round(amount, 3)}
    if rating: e["kind"] = "rating"
    if cond: e["alwaysActive"] = False
    if perStack: e["perStack"] = True
    if maxStacks: e["maxStacks"] = int(maxStacks)
    if multiEnemy: e["requiresMultiEnemy"] = True
    if zones: e["zones"] = zones
    if name: e["name"] = name
    if desc is not None: e["description"] = desc
    e["parsedFrom"] = "description"
    return e

def parse(name, d, il):
    if il < 3000: return None
    N = name; dl = d.lower()

    if N == "Brutal Power":            # on-crit at-will ramp
        return [ent("Power", 1, cond=True, perStack=True, maxStacks=3, name=N, desc=d)]
    if N == "Combatant's Advantage":
        if "defense" in dl or "lose" in dl: return None   # IL4600 defensive variant
        return [ent("Combat Advantage", 0.8, cond=True, perStack=True, maxStacks=10, name=N, desc=d)]
    if N == "Controlled Criticals":
        return [ent("Critical Strike", 496, rating=True, cond=True, perStack=True, maxStacks=20, name=N, desc=d)]
    if N == "Corrupt Power":           # +5% Power (the -7.5% Incoming Healing penalty is off-role for DPS)
        return [ent("Power", 5, name=N, desc=d)]
    if N == "Critical Empowerment":
        return [ent("Dmg Bonus", 3.5, cond=True, name=N, desc=d)]
    if N == "Critical Spiker (Greater)":
        return [ent("Critical Strike", 1.8, cond=True, perStack=True, maxStacks=5, name=N, desc=d)]
    if N == "Enveloped Rage (Greater)":
        return [ent("Critical Severity", 1.8, cond=True, perStack=True, maxStacks=5, multiEnemy=True, name=N, desc=d)]
    if N == "Explosive Precision":     # Daily trigger
        return [ent("Critical Severity", 6, cond=True, name=N, desc=d)]
    if N == "Frenzied Onslaught":      # on-crit
        return [ent("Critical Severity", 7, cond=True, name=N, desc=d)]
    if N == "Sprinter's Advantage":    # rating variant only (% variant is the endgame script's)
        if "%" in d: return None
        return [ent("Power", 5100, rating=True, cond=True, name=N, desc=d),
                ent("Combat Advantage", 5625, rating=True, cond=True, name=N)]
    if N == "Surge of Dominance":      # Daily trigger
        return [ent("Combat Advantage", 15, cond=True, name=N, desc=d)]
    if N == "Thay Might":
        return [ent("Power", 4950, rating=True, name=N, desc=d),
                ent("Combat Advantage", 2, zones=["Thay"], name=N)]
    if N == "Thayan Harmony":
        return [ent("Critical Strike", 4950, rating=True, name=N, desc=d)]
    return None

g = json.load(open(PATH, encoding="utf-8"))
done = collections.Counter()
for it in g:
    ebs = it.get("equipBonuses")
    if not ebs: continue
    il = it.get("item_level") or 0
    out = []
    for eb in ebs:
        blind = eb.get("type") != "Set" and not (eb.get("stat") and eb.get("amount") is not None)
        nm = (eb.get("name") or "").strip()
        if not blind: out.append(eb); continue
        d = (eb.get("description") or eb.get("effectText") or "").strip()
        parsed = parse(nm, d, il) if d else None
        if parsed: done[nm] += 1; out.extend(parsed)
        else: out.append(eb)
    it["equipBonuses"] = out

print(f"structured: {sum(done.values())} instances across {len(done)} names")
for nm, c in sorted(done.items()): print(f"  {c}x  {nm}")
if APPLY:
    json.dump(g, open(PATH, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print("WROTE", PATH)
else:
    print("DRY RUN — re-run with --apply")
