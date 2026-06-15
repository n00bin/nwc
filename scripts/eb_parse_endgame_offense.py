"""Endgame DPS equip-bonus parse (IL >= 4000 offense long-tail).

Targets the 45 distinct offense bonus names still text-only at IL>=4000
(census 2026-06-15). Explicit per-name patch table — NEVER regex-guessed —
each mapped to its verified in-game prose. Mirrors scripts/eb_parse_batch1.py
conventions exactly (ent() schema, blind-detection, replace-in-place).

Conventions reused:
- number with % = percent; without % = flat rating (kind:"rating").
- "current HP increases X up to max%" / "at max HP" = ON (no alwaysActive flag).
- combat ramps / per-enemy / moving / on-kill / on-crit / single-enemy = cond
  (alwaysActive:false) + perStack/maxStacks where it stacks. Engine credits
  these at modeled uptime.
- multi-stat lines split into multiple entries; description kept on the first.
- "X% in <zone>" -> zones gate.

SKIP (left free-text on purpose):
- pure sequence-procs ("next encounter +X%"): Focused Burst, Malignant Energy,
  Battle Reserves, Daily Reserves  (computeSequenceProcBoost owns these; Note-2)
- damage procs (proc-damage layer): Critical Force, Power at Any Cost
- reflect procs: Manticore's Mane Bite, Pact of Vengence
- off-role / defensive / heal-trigger: Healer's Influence, Combatant's Advantage,
  Shared Vitality, Manticore (Defense), Brute's Expertise (positional either/or),
  Past Regards (survival teleport proc)
- already skip-listed by design: Encounter Reprieve (cooldown proc)
"""
import json, sys, collections

PATH = "../data/gear.json"
APPLY = "--apply" in sys.argv

def ent(stat, amount, *, rating=False, cond=False, perStack=False, maxStacks=None,
        zones=None, scope="self", name=None, desc=None):
    e = {"type": "Equip", "scope": scope, "stat": stat, "amount": round(amount, 3)}
    if rating: e["kind"] = "rating"
    if cond: e["alwaysActive"] = False
    if perStack: e["perStack"] = True
    if maxStacks: e["maxStacks"] = int(maxStacks)
    if zones: e["zones"] = zones
    if name: e["name"] = name
    if desc is not None: e["description"] = desc
    e["parsedFrom"] = "description"
    return e

def parse(name, d, il):
    """Explicit table. Return list of structured entries or None (leave free-text)."""
    if il < 4000:
        return None
    N = name
    has = lambda s: s.lower() in d.lower()

    # ---- always-on HP-scaling percent (counts at full HP) ----
    if N == "Daily's Gift":            return [ent("Power", 8.5, name=N, desc=d)]
    if N == "Deity's Gift":
        amt = 6.5 if "6.5%" in d else 5.5
        return [ent("Power", amt, name=N, desc=d)]
    if N == "Enduring Critical":       return [ent("Critical Severity", 7, name=N, desc=d)]
    if N == "Enduring Advantage (Ascendant)":
        return [ent("Combat Advantage", 7, name=N, desc=d)]   # +5% Recharge clause not modeled
    if N == "Survivor's Tenacity":     return [ent("Critical Severity", 7.5, name=N, desc=d)]

    # ---- single-enemy gates (cond per batch-1 convention) ----
    if N == "Unseelie Might":
        return [ent("Power", 5, cond=True, name=N, desc=d),
                ent("Critical Severity", 2.5, cond=True, name=N)]
    if N == "Tenacious Luck":
        return [ent("Critical Strike", 7, cond=True, name=N, desc=d)]

    # ---- in-combat / movement / per-enemy ramps (perStack + cond) ----
    if N == "Combatant's Power":
        return [ent("Power", 0.4, cond=True, perStack=True, maxStacks=13, name=N, desc=d)]
    if N == "Critical Spiker":
        return [ent("Critical Strike", 1.1, cond=True, perStack=True, maxStacks=6, name=N, desc=d)]
    if N == "Escalating Might":
        return [ent("Power", 250, rating=True, cond=True, perStack=True, maxStacks=20, name=N, desc=d)]
    if N == "Critical Momentum":
        per = 3.3 if "3.3" in d else 3.0
        return [ent("Critical Severity", per, cond=True, perStack=True, maxStacks=3, name=N, desc=d)]
    if N == "Kinetic Precision":
        return [ent("Power", 1, cond=True, perStack=True, maxStacks=5, name=N, desc=d),
                ent("Combat Advantage", 0.7, cond=True, perStack=True, maxStacks=5, name=N)]
    if N == "Momentum's Edge":
        return [ent("Power", 0.5, cond=True, perStack=True, maxStacks=5, name=N, desc=d),
                ent("Combat Advantage", 0.6, cond=True, perStack=True, maxStacks=5, name=N)]
    if N == "Defiant Advantage":
        return [ent("Combat Advantage", 1.5, cond=True, perStack=True, maxStacks=6, name=N, desc=d)]
    if N == "Precision Against Odds":
        return [ent("Critical Strike", 1.8, cond=True, perStack=True, maxStacks=5, name=N, desc=d)]
    if N == "Perfect Form":
        return [ent("Combat Advantage", 1.2, cond=True, perStack=True, maxStacks=5, name=N, desc=d)]
    if N == "Unbroken Strength":
        if "Accuracy" in d:
            return [ent("Power", 0.55, cond=True, perStack=True, maxStacks=10, name=N, desc=d),
                    ent("Accuracy", 0.6, cond=True, perStack=True, maxStacks=10, name=N)]
        return [ent("Power", 0.55, cond=True, perStack=True, maxStacks=10, name=N, desc=d),
                ent("Critical Severity", 0.35, cond=True, perStack=True, maxStacks=10, name=N)]

    # ---- trigger buffs (cond; engine scores at uptime) ----
    if N == "Critical Daily (Greater)": return [ent("Critical Strike", 15, cond=True, name=N, desc=d)]
    if N == "Critical Daily (Lesser)":  return [ent("Critical Strike", 13, cond=True, name=N, desc=d)]
    if N == "Critical Flow":            return [ent("Critical Strike", 4.5, cond=True, name=N, desc=d)]
    if N == "Critical Surge":
        return [ent("Combat Advantage", 4.5, cond=True, name=N, desc=d),
                ent("Power", 3.5, cond=True, name=N)]
    if N == "Sharpened Instincts":
        return [ent("Critical Strike", 5, cond=True, name=N, desc=d),
                ent("Critical Severity", 5, cond=True, name=N)]
    if N == "Precise Severity":         return [ent("Critical Severity", 4.5, cond=True, name=N, desc=d)]
    if N == "Focused Assault":
        return [ent("Power", 5, cond=True, name=N, desc=d),
                ent("Critical Strike", 6.5, cond=True, name=N)]   # "Critical Chance" = Critical Strike
    if N == "Sprinter's Advantage":
        return [ent("Power", 2.5, cond=True, name=N, desc=d),
                ent("Combat Advantage", 3.5, cond=True, name=N)]
    if N == "Executioner's Accuracy":   return [ent("Accuracy", 5, cond=True, name=N, desc=d)]
    if N == "Executioner's Ferocity":   return [ent("Critical Severity", 5, cond=True, name=N, desc=d)]
    if N == "Sanguine Strike":
        return [ent("Critical Strike", 3.5, cond=True, name=N, desc=d),
                ent("Critical Severity", 3.5, cond=True, name=N)]
    if N == "Dashing Ranger":
        if d.strip().startswith("When moving:"):                 # IL4900
            return [ent("Accuracy", 5, cond=True, name=N, desc=d),
                    ent("Critical Strike", 3.5, cond=True, name=N)]
        if "offensive" in d:                                     # IL5700: Acc always, CritStr cond
            return [ent("Accuracy", 5, name=N, desc=d),
                    ent("Critical Strike", 5.5, cond=True, name=N)]
        return [ent("Accuracy", 6, name=N, desc=d),              # IL6000: Acc always, CritStr cond
                ent("Critical Strike", 6.5, cond=True, name=N)]
    if N == "Harmonizing Radiance":
        return [ent("Power", 1, cond=True, scope="party", name=N, desc=d),
                ent("Critical Strike", 1.5, cond=True, scope="party", name=N)]

    # ---- zone-gated ----
    if N == "Battleforged Might":
        return [ent("Combat Advantage", 3350, rating=True, name=N, desc=d),
                ent("Power", 2.5, zones=["The Reched Edge"], name=N)]

    return None  # everything else: leave free-text

g = json.load(open(PATH, encoding="utf-8"))
done = collections.Counter(); left = collections.Counter()
for it in g:
    ebs = it.get("equipBonuses")
    if not ebs: continue
    il = it.get("item_level") or 0
    out = []
    for eb in ebs:
        blind = eb.get("type") != "Set" and not (eb.get("stat") and eb.get("amount") is not None)
        nm = (eb.get("name") or "").strip()
        if not blind:
            out.append(eb); continue
        d = (eb.get("description") or eb.get("effectText") or "").strip()
        parsed = parse(nm, d, il) if d else None
        if parsed:
            done[nm] += 1
            out.extend(parsed)
        else:
            if il >= 4000 and nm: left[nm] += 1
            out.append(eb)
    it["equipBonuses"] = out

print(f"structured: {sum(done.values())} instances across {len(done)} names")
for nm, c in sorted(done.items()):
    print(f"  {c}x  {nm}")
print(f"\nleft free-text @IL>=4000 (skipped on purpose): {sum(left.values())} instances / {len(left)} names")
for nm, c in sorted(left.items()):
    print(f"  {c}x  {nm}")
if APPLY:
    json.dump(g, open(PATH, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print("\nWROTE", PATH)
else:
    print("\nDRY RUN — re-run with --apply to write gear.json")
