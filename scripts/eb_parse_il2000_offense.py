"""IL 2000-2999 offense equip-bonus parse — batch 3 of the gear long-tail.

Explicit per-name table, verified against prose (scripts dump 2026-06-21).
Gated 2000<=il<3000 (disjoint from the IL>=3000 / IL>=4000 batches, so no
tier-collision). Per-tier numbers are READ FROM each instance's description,
not hardcoded, so variant tiers get their own values.

SKIPPED (with reason): enemy-debuff auras (Cursed/Menacing Aura, Aura of
Enfeeblement — enemy scope, engine ignores); positional either/or (Brute's
Expertise/Tactics); shield+zone gated (Shielded Might/Strength); party-state
either/or (This or That); sequence-proc (Raging Rally); orb pickup (Power
Siphon); ally-only buff (Apothecary's Repel); unknown stack cap / truncated
(Reckless Advantage/Brutality/Rage); `[pending re-verify]` captures (Aura of
Enfeeblement, Death Defier's Haste, Positional Advantage, Precise Teamwork,
Relentless Assault); defensive (Spelljammer's Critical Resilience).
"""
import json, sys, re
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

def f(rx, d, default=None):
    m = re.search(rx, d)
    return float(m.group(1).replace(',', '')) if m else default

def parse(N, d, il):
    if not (2000 <= il < 3000): return None
    if "[pending re-verify" in d or "[needs re-verify" in d: return None

    if N == "Advantage Preparation":
        return [ent("Combat Advantage", 11 if "11%" in d else 10, cond=True, name=N, desc=d)]
    if N == "Brute's Advantage":
        return [ent("Combat Advantage", 3000, rating=True, cond=True, name=N, desc=d),
                ent("Accuracy", 3000, rating=True, cond=True, name=N)]
    if N == "Controlled Criticals":
        return [ent("Critical Strike", f(r'stack of ([\d,]+) Critical Strike', d), rating=True, cond=True, perStack=True, maxStacks=20, name=N, desc=d)]
    if N == "Critical Step":
        return [ent("Critical Strike", f(r'Critical Strike by ([\d,]+)', d), rating=True, cond=True, name=N, desc=d)]
    if N == "Death Defying Advantage":
        return [ent("Combat Advantage", 2, cond=True, perStack=True, maxStacks=(6 if "Max of 6" in d else 10), name=N, desc=d)]
    if N == "Deity's Gift":
        return [ent("Power", 7, name=N, desc=d)]
    if N == "Escalating Precision":
        return [ent("Accuracy", f(r'Gain ([\d,]+) Accuracy', d), rating=True, cond=True, perStack=True, maxStacks=20, name=N, desc=d)]
    if N == "Escalating Torrent":
        return [ent("Power", f(r'Gain ([\d,]+) Power', d), rating=True, cond=True, perStack=True, maxStacks=(50 if "50 times" in d else 20), name=N, desc=d)]
    if N == "Executioner's Advantage":
        return [ent("Combat Advantage", 5, cond=True, name=N, desc=d)]
    if N == "Executioner's Haste":
        return [ent("Accuracy", 5, cond=True, name=N, desc=d)]
    if N == "Executioner's Offense":
        stats = ["Power", "Combat Advantage", "Critical Strike", "Critical Severity"]
        return [ent(s, 1300, rating=True, cond=True, perStack=True, maxStacks=10, name=N, desc=(d if i == 0 else None)) for i, s in enumerate(stats)]
    if N == "Fiery Might":
        return [ent("Combat Advantage", 3775, rating=True, name=N, desc=d)]   # +2% fire-map Power kept in prose
    if N == "Liquid Luck":
        return [ent("Critical Strike", 1.5 if "1.5%" in d else 1, perStack=True, maxStacks=5, name=N, desc=d),
                ent("Critical Severity", f(r'gain ([\d.]+)% Critical Severity', d, 5), cond=True, name=N)]
    if N == "Magician's Fury":
        return [ent("Power", 3000, rating=True, cond=True, name=N, desc=d),
                ent("Critical Severity", 3000, rating=True, cond=True, name=N)]
    if N == "Maiden's Serenity":
        return [ent("Critical Strike", 5, name=N, desc=d),
                ent("Critical Severity", 2.5, cond=True, multiEnemy=True, name=N)]
    if N == "Maximized Opportunity":
        return [ent("Combat Advantage", 7, cond=True, name=N, desc=d)]
    if N == "Mighty Valor":
        return [ent("Power", 1, cond=True, perStack=True, maxStacks=10, name=N, desc=d)]   # Awareness/MS clauses off-role
    if N == "Renegade's Courage":
        return [ent("Critical Severity", 5, cond=True, name=N, desc=d),
                ent("Combat Advantage", 2.5, cond=True, name=N)]
    if N == "Solitary Power":
        return [ent("Power", 2.5, cond=True, name=N, desc=d)]
    if N == "Spelljammer's Advantage":
        return [ent("Combat Advantage", 0.65, cond=True, perStack=True, maxStacks=7, name=N, desc=d)]
    if N == "Spelljammer's Might":
        return [ent("Combat Advantage", 3350, rating=True, name=N, desc=d),
                ent("Power", 2.5, zones=["Wildspace"], name=N)]
    if N == "Tenacious Luck":
        return [ent("Critical Strike", 7, cond=True, name=N, desc=d)]
    if N == "Wildspace Gladiator":
        return [ent("Critical Strike", 1, cond=True, perStack=True, maxStacks=7, name=N, desc=d)]
    return None

g = json.load(open(PATH, encoding="utf-8"))
import collections
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
        if parsed and all(e.get("amount") is not None for e in parsed):
            done[nm] += 1; out.extend(parsed)
        else:
            out.append(eb)
    it["equipBonuses"] = out

print(f"structured: {sum(done.values())} instances across {len(done)} names")
for nm, c in sorted(done.items()): print(f"  {c}x  {nm}")
if APPLY:
    json.dump(g, open(PATH, "w", encoding="utf-8"), indent=2, ensure_ascii=False); print("WROTE", PATH)
else:
    print("DRY RUN — re-run with --apply")
