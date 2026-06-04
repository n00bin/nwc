#!/usr/bin/env python3
"""Batch 1: structure the highest-frequency TEXT-ONLY gear equip bonuses so the
engine/optimizer can see them. Parses each instance's own description (same
bonus name carries different numbers per IL tier, and sometimes a different
mechanic entirely). Anything that doesn't match a rule is left untouched and
reported — never guessed.

Engine schema written: stat, amount, kind:"rating" (flat) | default percent,
type:"Equip", alwaysActive:false (conditional), perStack/maxStacks, zones,
scope:"self". parsedFrom:"description" marks provenance.

Resource-grant procs (AP / cooldown reduction) are SKIPPED by design — the
engine has no layer for them yet: Encounter Reprieve, Critical Charge,
Executioner's Zeal, Butcher's Zeal.
"""
import json, re, sys, collections

DRY = "--apply" not in sys.argv
PATH = r"G:\ai_projects\nwcb\data\gear.json"

NUM = r"([\d,]+(?:\.\d+)?)"
def n(s): return float(s.replace(",", ""))
def ent(stat, amount, *, rating=False, cond=False, perStack=False, maxStacks=None, zones=None, name=None, desc=None):
    e = {"type": "Equip", "scope": "self", "stat": stat, "amount": round(amount, 3)}
    if rating: e["kind"] = "rating"
    if cond: e["alwaysActive"] = False
    if perStack: e["perStack"] = True
    if maxStacks: e["maxStacks"] = int(maxStacks)
    if zones: e["zones"] = zones
    if name: e["name"] = name
    if desc is not None: e["description"] = desc
    e["parsedFrom"] = "description"
    return e

STATWORDS = ("Critical Strike|Critical Severity|Critical Avoidance|Combat Advantage|Accuracy|Power|Defense|Deflection|Deflect|Awareness|Movement Speed|Recharge Speed|Outgoing Healing|Incoming Healing|Forte")
def canon(stat): return {"Deflection": "Deflect"}.get(stat, stat)

SKIP_BY_DESIGN = {"Encounter Reprieve", "Critical Charge", "Executioner's Zeal", "Butcher's Zeal"}

def parse(name, d):
    """Return list of structured entries, or None if no rule matched."""
    t = re.sub(r"\s+", " ", d).strip().replace("Movement Speed Movement Speed", "Movement Speed")

    # --- per-percent-of-missing-health ramps (Survivor's Might/Guard/Parry) ---
    m = re.fullmatch(rf"Gain {NUM} (Power|Defense|Deflect) for each percent of health(?: you are)? missing\.?", t)
    if m: return [ent(m[2], n(m[1]), rating=True, cond=True, perStack=True, maxStacks=100, name=name, desc=d)]

    # --- deflect-proc stacks (Survivor's Might) ---
    m = re.fullmatch(rf"(?:Whenever you Deflect an attack|When you Deflect), gain {NUM} Power for 10 ?s(?:econds)?\.? ?\(?[Mm]ax 5 [Ss]tacks\.?\)?\.?", t)
    if m: return [ent("Power", n(m[1]), rating=True, cond=True, perStack=True, maxStacks=5, name=name, desc=d)]

    # --- generic chance-proc stat gain ---
    m = re.fullmatch(rf".*?\d+% chance to gain \+?{NUM}(%?) ?({STATWORDS}) for {NUM} ?s(?:econds)?\.?.*", t)
    if m: return [ent(canon(m[3]), n(m[1]), rating=(m[2] != "%"), cond=True, name=name, desc=d)]

    # --- single-target Power (Challenger's Might) ---
    m = re.fullmatch(rf"When in combat with only one enemy,? (?:your )?Power (?:is increased by |\+){NUM}\.?", t)
    if m: return [ent("Power", n(m[1]), rating=True, cond=True, name=name, desc=d)]

    # --- big-hit-taken reactions (Warden's Defense / Warden's Haste) ---
    # The FIRST %-number is the trigger threshold (10/15% of Max HP); the
    # bonus amount is the one attached to the stat. Match them explicitly.
    if re.match(r"(?:Whenever you are |When )damaged for more than \d+% of (?:your )?Max(?:imum)? (?:Hit Points|HP)", t):
        m = re.search(rf"(?:you )?gain {NUM}% Defense for 10 ?s(?:econds)?\.?", t)
        if m: return [ent("Defense", n(m[1]), cond=True, name=name, desc=d)]
        m = re.search(rf"Movement Speed (?:increases by |\+){NUM}% for 10 ?s(?:econds)?\.?", t)
        if m: return [ent("Movement Speed", n(m[1]), cond=True, name=name, desc=d)]

    # --- in-combat ramps, rating (Gladiator family) ---
    m = re.fullmatch(rf"(?:For e|E)very (\d+) ?s(?:econds)?,? (?:you are )?(?:in combat,? )?(?:you )?gain {NUM} ({STATWORDS})\.?(?: If you stay in combat (?:for )?longer than 2 minutes.*|\.? ?After 2 minutes.*|\.? ?Max (\d+) [Ss]tacks.*)?", t)
    if m:
        interval = int(m[1]); per = n(m[2]); stat = canon(m[3])
        stacks = int(m[4]) if m[4] else max(1, 120 // interval)
        return [ent(stat, per, rating=True, cond=True, perStack=True, maxStacks=stacks, name=name, desc=d)]
    # --- in-combat ramps, percent with explicit cap (handles ".5%" decimals) ---
    m = re.fullmatch(rf"(?:For e|E)very (\d+) ?s(?:econds)? (?:you are )?in combat, (?:you )?gain (\.?[\d,]*\.?\d+)% ({STATWORDS}), to the max of {NUM}%\.?", t)
    if m:
        per = n(m[2] if not m[2].startswith('.') else '0' + m[2]); cap = n(m[4])
        return [ent(canon(m[3]), per, cond=True, perStack=True, maxStacks=max(1, round(cap / per)), name=name, desc=d)]

    # --- per-party-member (Leader's) ---
    m = re.fullmatch(rf"Gain {NUM} (Power|Defense) (?:for each player in your team|per team player)\.?", t)
    if m: return [ent(m[2], n(m[1]), rating=True, perStack=True, maxStacks=5, name=name, desc=d)]

    # --- per-engaged-enemy (Death Defier's) ---
    m = re.fullmatch(rf"Gain {NUM} (Power|Combat Advantage) for each enemy(?: you are)?(?: engaged)?(?: in battle)?(?: with)?\.? ?\(Max(?: of)? 15(?: targets)?\)\.?", t)
    if m: return [ent(m[2], n(m[1]), rating=True, cond=True, perStack=True, maxStacks=15, name=name, desc=d)]
    m = re.fullmatch(rf"Gain {NUM} (Power|Combat Advantage) for each enemy in battle\. ?\(Max 15\)", t)
    if m: return [ent(m[2], n(m[1]), rating=True, cond=True, perStack=True, maxStacks=15, name=name, desc=d)]

    # --- stamina / AP gated flat boosts (Charged family) ---
    m = re.fullmatch(rf"When your Stamina is over 75%, your (Power|damage) is increased by {NUM}(%?)\.?", t)
    if m:
        if m[1] == "damage": return [ent("Dmg Bonus", n(m[2]), name=name, desc=d)]
        return [ent("Power", n(m[2]), rating=(m[3] != "%"), name=name, desc=d)]
    m = re.fullmatch(rf"When Action Points are full, your Power is increased by {NUM}\.?", t)
    if m: return [ent("Power", n(m[1]), rating=True, cond=True, name=name, desc=d)]

    # --- stat trade lines (The Ol' Switcheroo): "+N Stat, -M Stat" ---
    if re.match(rf"(?:Gain )?[+-] ?\+?{NUM}%? ?({STATWORDS})", t):
        terms = re.findall(rf"([+-]|lose )\s*{NUM}(%?)\s*({STATWORDS})", t)
        if terms and len(terms) >= 2:
            out = []
            for i, (sign, amt, pct, stat) in enumerate(terms):
                v = n(amt) * (-1 if sign.strip() in ("-", "lose") else 1)
                out.append(ent(canon(stat), v, rating=(pct != "%"), name=name, desc=(d if i == 0 else None)))
            return out

    # --- enemy-type damage (Hunter family) → vs_enemy (engine credits 0 uptime) ---
    m = re.fullmatch(rf"\+{NUM}% Damage against (.+?)\.?", t)
    if m: return [ent("Dmg Bonus", n(m[1]), cond=True, name=name, desc=d)]

    # --- zone damage (Undermountain Hunter) ---
    m = re.fullmatch(rf"\+{NUM}% Damage in the Undermountain\.?", t)
    if m: return [ent("Dmg Bonus", n(m[1]), zones=["Undermountain"], name=name, desc=d)]

    # --- on-kill stat surges (Executioner's Ferocity/Focus) ---
    m = re.fullmatch(rf"When you kill an enemy, your ({STATWORDS}) increases by {NUM}% for 10 seconds\.?", t)
    if m: return [ent(canon(m[1]), n(m[2]), cond=True, name=name, desc=d)]

    # --- health-threshold two-half bonuses (Survivor's Strike/Savagery/Finesse) ---
    m = re.fullmatch(
        rf"When (?:your )?health is 50% or more, (?:your )?({STATWORDS}) is increased by {NUM}(%?)\. "
        rf"When (?:your )?health is below 50%,? (?:your )?({STATWORDS})(?: is increased by | increases by | is increased by your )?\+?{NUM}(%?)\.?", t)
    if m:
        hi = ent(canon(m[1]), n(m[2]), rating=(m[3] != "%"), name=name, desc=d)            # ≥50%: matches in-game sheet
        lo = ent(canon(m[4]), n(m[5]), rating=(m[6] != "%"), cond=True, name=name)         # <50%: conditional
        return [hi, lo]

    return None

g = json.load(open(PATH, encoding="utf-8"))
done = collections.Counter(); flagged = []; skipped = collections.Counter()
for it in g:
    ebs = it.get("equipBonuses")
    if not ebs: continue
    out = []
    for eb in ebs:
        blind = eb.get("type") != "Set" and not (eb.get("stat") and eb.get("amount") is not None)
        nm = (eb.get("name") or "").strip()
        if not blind:
            out.append(eb); continue
        if nm in SKIP_BY_DESIGN:
            skipped[nm] += 1; out.append(eb); continue
        d = (eb.get("description") or eb.get("effectText") or "").strip()
        parsed = parse(nm, d) if d else None
        if parsed:
            done[nm] += 1
            out.extend(parsed)
        else:
            if nm and d: flagged.append((nm, d[:110]))
            out.append(eb)
    it["equipBonuses"] = out

print(f"structured: {sum(done.values())} instances across {len(done)} names")
for nm, c in done.most_common(40): print(f"  {c:4}x {nm}")
print(f"skipped by design (no engine layer): {dict(skipped)}")
print(f"left untouched (no rule matched): {len(flagged)}")
if DRY:
    print("\nDRY RUN — nothing written. Re-run with --apply to write gear.json")
else:
    json.dump(g, open(PATH, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print("WROTE", PATH)
