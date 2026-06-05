#!/usr/bin/env python3
"""Batch 3: long-tail TEXT-ONLY gear equip bonuses → structured fields.
Generic pattern rules with case-insensitive stat matching, broader trigger
phrasings, and an expanded no-engine-layer skip list (control / stealth /
threat / reflect / heal / AP effects stay prose). Unmatched = untouched.
Conventions: docs/audit/eb_parse_progress.md.
"""
import json, re, sys, collections

DRY = "--apply" not in sys.argv
PATH = r"G:\ai_projects\nwcb\data\gear.json"

NUM = r"([\d,]+(?:\.\d+)?)"
def n(s): return float(str(s).replace(",", "").lstrip("+"))
def ent(stat, amount, *, rating=False, cond=False, perStack=False, maxStacks=None, zones=None, scope="self", name=None, desc=None):
    e = {"type": "Equip", "scope": scope, "stat": stat, "amount": round(float(amount), 3)}
    if rating: e["kind"] = "rating"
    if cond: e["alwaysActive"] = False
    if perStack: e["perStack"] = True
    if maxStacks: e["maxStacks"] = int(maxStacks)
    if zones: e["zones"] = zones
    if name: e["name"] = name
    if desc is not None: e["description"] = desc
    e["parsedFrom"] = "description"
    return e

CANON = {
    "critical strike": "Critical Strike", "crit": "Critical Strike",
    "critical severity": "Critical Severity", "critical avoidance": "Critical Avoidance",
    "combat advantage": "Combat Advantage", "accuracy": "Accuracy", "power": "Power",
    "defense": "Defense", "deflect severity": "Deflect Severity", "deflection": "Deflect",
    "deflect": "Deflect", "awareness": "Awareness", "movement speed": "Movement Speed",
    "recharge speed": "Recharge Speed", "outgoing healing": "Outgoing Healing",
    "incoming healing": "Incoming Healing", "forte": "Forte",
    "maximum hit points": "Maximum Hit Points", "stamina regeneration": "Stamina Regeneration",
    "control resistance": "Control Resist", "control bonus": "Control Bonus",
    "action point gain": "Action Point Gain",
}
SW = "|".join(sorted(CANON.keys(), key=len, reverse=True))
def canon(s): return CANON[s.lower()]

# No engine layer — leave as prose. (Heals/AP/cooldown carried over from
# batch 2, plus control/stealth/threat/reflect/utility procs.)
SKIP_PATTERNS = re.compile(
    r"restore .*?(?:Maximum Hit Points|of your health)|of your health back|regenerates? \d+(?:\.\d+)?% of|you regenerate|"
    r"gain \d+ Action Points|gain \d+(?:\.\d+)?% (?:of your )?Action Points|random stat|one of the following stats|"
    r"cooldowns? (?:are reduced|by \d)|reduce .* cooldown|take \d+(?:\.\d+)?% less damage|damage resistance|"
    r"\bvanish\b|stealth|invulnerab|reveal|threat\b|repel|root(?:ed)? your|daze|knock|interrupt|"
    r"will be poisoned|chance to Poison|reflect|damage equal to \d+% of your max", re.I)

def parse(name, d):
    t = re.sub(r"\s+", " ", d).strip()

    # --- targeted: Tactical family (proc part unmodelable, flat clause real) ---
    if name.startswith("Tactical"):
        m = re.search(rf"You gain {NUM}% ({SW})", t, re.I)
        if m: return [ent(canon(m[2]), n(m[1]), name=name, desc=d)]
        return "SKIP"
    # --- targeted: Bloodletting (MaxHP-for-damage trade proc) ---
    m = re.search(rf"chance to reduce your Maximum Hit Points by {NUM}% and gain {NUM}% Damage(?: Bonus)?(?: for (\d+) ?s)?", t, re.I)
    if m:
        return [ent("Dmg Bonus", n(m[2]), cond=True, name=name, desc=d),
                ent("Max HP Percent", -n(m[1]), cond=True, name=name)]

    if SKIP_PATTERNS.search(t):
        m = re.search(rf"You gain {NUM}% ({SW})\.?$", t, re.I)
        if m: return [ent(canon(m[2]), n(m[1]), name=name, desc=d)]
        return "SKIP"

    # --- slot-damage trades (Tit for Tat) ---
    m = re.fullmatch(rf"Your At-Will and Encounter Powers do {NUM}% more damage, but your Daily Powers do {NUM}% less damage\.?", t, re.I)
    if m:
        return [ent("At Will Dmg Bonus", n(m[1]), name=name, desc=d),
                ent("Encounter Dmg Bonus", n(m[1]), name=name),
                ent("Daily Dmg Bonus", -n(m[2]), name=name)]

    # --- stat-first phrasing: "increase your A by N% (and (gain M%|B by M%)) for Ns" ---
    m = re.search(
        rf"(?:Whenever|When) (?:you|your)[^.]*?(?:,? you have a (\d+(?:\.\d+)?)% chance to)?[^.]*?"
        rf"increase (?:your )?({SW}) by {NUM}(%?)"
        rf"(?: and (?:gain {NUM}(%?) ?({SW})|(?:your )?({SW}) by {NUM}(%?)))? for \d+ ?s(?:econds)?", t, re.I)
    if m and not re.search(r"for each|every \d+ seconds you are in combat", t, re.I):
        # groups: 1 chance · 2 stat1 · 3 amt1 · 4 pct1 · 5 gain-amt · 6 gain-pct
        #         7 gain-stat · 8 by-stat · 9 by-amt · 10 by-pct
        out = [ent(canon(m[2]), n(m[3]), rating=(m[4] != "%"), cond=True, name=name, desc=d)]
        if m[7]:   # "and gain M% STAT"
            out.append(ent(canon(m[7]), n(m[5]), rating=(m[6] != "%"), cond=True, name=name))
        elif m[8]: # "and STAT by M%"
            out.append(ent(canon(m[8]), n(m[9]), rating=(m[10] != "%"), cond=True, name=name))
        return out

    # --- trigger + (chance) + gain X (and Y) (by) N(%) for Ns [(cd)] ---
    m = re.search(
        rf"(?:Whenever|When) (?:you|your)[^.]*?(?:,? you have a (\d+(?:\.\d+)?)% chance to)?[^.]*?"
        rf"(?:gain|increase(?: your)?|you gain) {NUM}(%?) ?({SW})"
        rf"(?: and (?:gain )?({SW})(?: by)? ?(?:{NUM}(%?))?)?"
        rf"(?: by ?{NUM}(%?))? for \d+ ?s(?:econds)?", t, re.I)
    if m and not re.search(r"for each|every \d+ seconds you are in combat", t, re.I):
        chance = m[1]
        amt, pct, stat = m[2], m[3], m[4]
        out = []
        stacks = None
        sm = re.search(r"Max (\d+) [Ss]tacks", t)
        if sm: stacks = int(sm[1])
        out.append(ent(canon(stat), n(amt), rating=(pct != "%"), cond=True,
                       perStack=bool(stacks), maxStacks=stacks, name=name, desc=d))
        if m[5]:  # second stat — same amount unless its own number given
            amt2 = m[6] if m[6] else amt; pct2 = m[7] if m[6] else pct
            out.append(ent(canon(m[5]), n(amt2), rating=(pct2 != "%"), cond=True,
                           perStack=bool(stacks), maxStacks=stacks, name=name))
        return out

    # --- periodic self-buff (Sudden Power: every 30s gain 5500 Power for 15s) ---
    m = re.fullmatch(rf"Every (\d+) seconds you gain {NUM}(%?) ?({SW}) for (\d+) seconds\.(?: This effect only works in combat\.?)?", t, re.I)
    if m: return [ent(canon(m[4]), n(m[2]), rating=(m[3] != "%"), cond=True, name=name, desc=d)]

    # --- on-hit short stacks, broader (Rising Precision: 135 Crit, max 10) ---
    m = re.fullmatch(rf"(?:On hitting a foe|When hit by a foe) you gain {NUM}(%?) ?({SW}) for \d+ seconds\. This effect can stack a maximum of (\d+) times\.?", t, re.I)
    if m: return [ent(canon(m[2 + 1]), n(m[1]), rating=(m[2] != "%"), cond=True, perStack=True, maxStacks=int(m[4]), name=name, desc=d)]

    # --- strike-stacks (Escalating Might) ---
    m = re.fullmatch(rf"Gain {NUM} ({SW}) for \d+ seconds when you strike an enemy.*?Max (\d+) Stacks.*", t, re.I)
    if m: return [ent(canon(m[2]), n(m[1]), rating=True, cond=True, perStack=True, maxStacks=int(m[3]), name=name, desc=d)]

    # --- thresholds, broader words + case-insensitive stats ---
    m = re.fullmatch(rf"When your (?:Stamina|[Hh]ealth) is (over|above|greater than|under|below) {NUM}%,? (?:your )?({SW}) is increased by {NUM}(%?)\.?(?: This boost only applies during combat\.?)?", t, re.I)
    if m:
        on = m[1].lower() in ("over", "above", "greater than")
        return [ent(canon(m[3]), n(m[4]), rating=(m[5] != "%"), cond=not on, name=name, desc=d)]

    # --- health-threshold two-half, extended stat vocab ---
    m = re.fullmatch(
        rf"When (?:your )?health is 50% or more, (?:your )?({SW}) is increased by {NUM}(%?)\. "
        rf"When (?:your )?health is below 50%,? (?:your )?({SW})(?: is increased by | increases by )?\+?{NUM}(%?)\.?", t, re.I)
    if m:
        return [ent(canon(m[1]), n(m[2]), rating=(m[3] != "%"), name=name, desc=d),
                ent(canon(m[4]), n(m[5]), rating=(m[6] != "%"), cond=True, name=name)]

    # --- "up to N STAT based on missing health" (Survivor's Reflexes/Rush) ---
    m = re.fullmatch(rf"Gain (?:up to )?{NUM}(%?) ?({SW}) (?:based on|as) your (?:missing )?health(?: decreases)?.*", t, re.I)
    if m: return [ent(canon(m[3]), n(m[1]), rating=(m[2] != "%"), cond=True, name=name, desc=d)]
    m = re.fullmatch(rf"Gain up to {NUM}(%?) ?({SW}) based on your missing health\..*", t, re.I)
    if m: return [ent(canon(m[3]), n(m[1]), rating=(m[2] != "%"), cond=True, name=name, desc=d)]
    m = re.fullmatch(rf"Gain ({SW}) as your health decreases to a maximum of {NUM}%\.?", t, re.I)
    if m: return [ent(canon(m[1]), n(m[2]), cond=True, name=name, desc=d)]

    # --- per-enemy engaged, with range + max N (Death Defying Medic) ---
    m = re.fullmatch(rf"Gain {NUM} ({SW}) for each enemy you are engaged in battle(?: with)?(?:in)? ?(?:within \d+')?\.? ?\(Max(?: of)? (\d+)(?: targets)?\)\.?", t, re.I)
    if m: return [ent(canon(m[2]), n(m[1]), rating=True, cond=True, perStack=True, maxStacks=int(m[3]), name=name, desc=d)]

    # --- single-target, multi-stat list (Overwhelming Offense) ---
    m = re.match(rf"When in combat with only one enemy, gain {NUM} ((?:(?:{SW})(?:, | and |, and ))*(?:{SW}))\.", t, re.I)
    if m:
        stats = re.split(r", and |, | and ", m[2])
        return [ent(canon(s), n(m[1]), rating=True, cond=True, name=name, desc=(d if i == 0 else None)) for i, s in enumerate(stats)]

    # --- range-gated, to/from + further/closer (Sniper's Advantage, Brute's Fury) ---
    m = re.fullmatch(rf"When you are \d+' or (?:closer|further)(?: away)? (?:to|from) your target, your ({SW}) is increased by {NUM}(%?)\.?", t, re.I)
    if m: return [ent(canon(m[1]), n(m[2]), rating=(m[3] != "%"), cond=True, name=name, desc=d)]
    m = re.fullmatch(rf"Your Powers deal {NUM}% more damage when you are \d+' or (?:further|closer)(?: away)? (?:to|from) your target\.?", t, re.I)
    if m: return [ent("Dmg Bonus", n(m[1]), cond=True, name=name, desc=d)]

    # --- conditional Defense states (Protector's/Dancer's Guard) ---
    m = re.fullmatch(rf"(?:When you have a Shield or Temp HP|Your Defense is increased by {NUM} when you are moving)[,.]? ?(?:your Defense is increased by {NUM})?\.?", t, re.I)
    if m:
        amt = m[1] or m[2]
        return [ent("Defense", n(amt), rating=True, cond=True, name=name, desc=d)]

    # --- zone movement speed (+N% Movement Speed in the X) ---
    m = re.fullmatch(rf"\+{NUM}% Movement Speed in (?:the )?(\w[\w' ]*?)\.?(?: This effect can stack\.?)?", t)
    if m: return [ent("Movement Speed", n(m[1]), zones=[m[2]], name=name, desc=d)]

    return None

g = json.load(open(PATH, encoding="utf-8"))
SKIP_NAMES = {"Encounter Reprieve", "Critical Charge", "Executioner's Zeal", "Butcher's Zeal"}
done = collections.Counter(); flagged = collections.Counter(); skipped = collections.Counter()
for it in g:
    ebs = it.get("equipBonuses")
    if not ebs: continue
    out = []
    for eb in ebs:
        blind = eb.get("type") != "Set" and not (eb.get("stat") and eb.get("amount") is not None) and not eb.get("procDamage")
        nm = (eb.get("name") or "").strip()
        if not blind or nm in SKIP_NAMES:
            out.append(eb); continue
        d = (eb.get("description") or eb.get("effectText") or "").strip()
        r = parse(nm, d) if d else None
        if r == "SKIP": skipped[nm] += 1; out.append(eb)
        elif r: done[nm] += 1; out.extend(r)
        else:
            if nm and d: flagged[nm] += 1
            out.append(eb)
    it["equipBonuses"] = out

print(f"structured: {sum(done.values())} instances across {len(done)} names")
for nm, c in done.most_common(30): print(f"  {c:3}x {nm}")
print(f"skip-listed (no engine layer): {sum(skipped.values())} across {len(skipped)} names")
print(f"still untouched: {sum(flagged.values())} across {len(flagged)} names")
if DRY: print("\nDRY RUN — re-run with --apply")
else:
    json.dump(g, open(PATH, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print("WROTE", PATH)
