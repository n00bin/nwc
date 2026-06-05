#!/usr/bin/env python3
"""Batch 2: next wave of TEXT-ONLY gear equip bonuses → structured fields.
Pattern-driven (description shapes), runs only on still-blind entries.
Unmatched text is left untouched. Heal/damage/AP procs and random-stat
effects are skip-listed by PATTERN (no engine layer — never faked).
See docs/audit/eb_parse_progress.md for conventions.
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

STATWORDS = ("Critical Strike|Critical Severity|Critical Avoidance|Combat Advantage|Accuracy|Power|Defense|Deflect Severity|Deflection|Deflect|Awareness|Movement Speed|Recharge Speed|Outgoing Healing|Incoming Healing|Forte|Maximum Hit Points|Stamina Regeneration|Control Resistance|Control Bonus|Action Point Gain")
def canon(s): return {"Deflection": "Deflect", "Control Resistance": "Control Resist"}.get(s, s)

# Effects with no engine layer yet — leave as prose, count separately.
SKIP_PATTERNS = re.compile(
    r"restore .*?(?:Maximum Hit Points|of your health)|of your health back|magnitude damage|"
    r"deal [\d,]+ damage|damage in a \d+'? ?radius|regenerates? \d+(?:\.\d+)?% of|you regenerate|"
    r"take \d+(?:\.\d+)?% less damage|gain \d+ Action Points|gain \d+(?:\.\d+)?% (?:of your )?Action Points|"
    r"random stat|one of the following stats|cooldowns? (?:are reduced|by \d)|reduce .* cooldown", re.I)

def parse(name, d):
    t = re.sub(r"\s+", " ", d).strip()

    if SKIP_PATTERNS.search(t):
        # mixed lines: still try to salvage a trailing always-on clause
        m = re.search(rf"You gain {NUM}% ({STATWORDS})\.?$", t)
        if m: return [ent(canon(m[2]), n(m[1]), name=name, desc=d)]
        return "SKIP"

    # --- start-of-combat surges (Contender's Might / Call of the Undermountain) ---
    m = re.search(rf"At the start of combat,.*?(?:increasing )?your Power (?:is increased by |increases by |by ){NUM}(%?)(?: for \d+ seconds)?", t)
    if m: return [ent("Power", n(m[1]), rating=(m[2] != "%"), cond=True, name=name, desc=d)]

    # --- resource/health thresholds: over/greater = on, under/below = conditional ---
    m = re.fullmatch(rf"When your (?:Stamina|[Hh]ealth) is (over|greater than|under|below) {NUM}%, your ({STATWORDS}) is increased by {NUM}(%?)\.?(?: This boost only applies during combat\.?)?", t)
    if m:
        on = m[1] in ("over", "greater than")
        return [ent(canon(m[3]), n(m[4]), rating=(m[5] != "%"), cond=not on, name=name, desc=d)]
    m = re.fullmatch(rf"When your Stamina is (over|under) {NUM}%, your Movement Speed is increased by {NUM}%\.?(?: This boost only applies during combat\.?)?", t)
    if m: return [ent("Movement Speed", n(m[3]), cond=True, name=name, desc=d)]

    # --- single-target (Challenger's family, non-Power stats) ---
    m = re.fullmatch(rf"When in combat with only one enemy,? (?:your )?({STATWORDS}) (?:is increased by |\+){NUM}\.?", t)
    if m: return [ent(canon(m[1]), n(m[2]), rating=True, cond=True, name=name, desc=d)]

    # --- range-gated bonuses (Brute's Advantage / Sniper's Fury) ---
    m = re.fullmatch(rf"When you are \d+' or closer to your target, your ({STATWORDS}) is increased by {NUM}%\.?", t)
    if m: return [ent(canon(m[1]), n(m[2]), cond=True, name=name, desc=d)]
    m = re.fullmatch(rf"Your Powers deal {NUM}% more damage when you are \d+' or (?:further|closer)(?: away)? from your target\.?", t)
    if m: return [ent("Dmg Bonus", n(m[1]), cond=True, name=name, desc=d)]

    # --- positional damage (Maiden's Blade) ---
    m = re.match(rf"You do {NUM}% more damage to enemies that are not facing you\.?", t)
    if m: return [ent("Dmg Bonus", n(m[1]), cond=True, name=name, desc=d)]

    # --- solo-gated (Herald's family): "no teammates within 30'" ---
    m = re.fullmatch(rf"When you have no teammates within \d+' of you, your ({STATWORDS})(?: and ({STATWORDS}))? (?:is|are) increased by {NUM}%\.?", t)
    if m:
        out = [ent(canon(m[1]), n(m[3]), cond=True, name=name, desc=d)]
        if m[2]: out.append(ent(canon(m[2]), n(m[3]), cond=True, name=name))
        return out

    # --- per-team-member, percent + MaxHP + Movement Speed variants ---
    m = re.fullmatch(rf"(?:You gain|Gain|Your Movement Speed increases by) {NUM}(%?) ?({STATWORDS})? ?for each player in your team\.?(?: When your teammates are \d+' or closer to you, their ({STATWORDS}) is increased by {NUM}%\.?)?", t)
    if m:
        stat = canon(m[3]) if m[3] else "Movement Speed"
        out = [ent(stat, n(m[1]), rating=(m[2] != "%"), perStack=True, maxStacks=5, name=name, desc=d)]
        if m[4]:  # teammate aura — party scope, engine skips for self but data is structured
            out.append(ent(canon(m[4]), n(m[5]), cond=True, scope="party", name=name))
        return out

    # --- per-enemy engaged, other stats (Death Defier's Guard etc.) ---
    m = re.fullmatch(rf"Gain {NUM} ({STATWORDS}) for each enemy you are engaged in battle(?: with)?\.? ?\(Max(?: of)? 15(?: targets)?\)\.?", t)
    if m: return [ent(canon(m[2]), n(m[1]), rating=True, cond=True, perStack=True, maxStacks=15, name=name, desc=d)]

    # --- in-combat percent ramps "Max Stacks: N" (Combatant's Advantage) ---
    m = re.fullmatch(rf"(?:For e|E)very (\d+) ?s(?:econds)? (?:you are )?in combat, (?:you )?gain (\.?[\d,]*\.?\d+)% ({STATWORDS})\.? ?Max Stacks?: ?(\d+)\.?", t)
    if m:
        per = n(m[2] if not m[2].startswith('.') else '0' + m[2])
        return [ent(canon(m[3]), per, cond=True, perStack=True, maxStacks=int(m[4]), name=name, desc=d)]

    # --- on-hit / when-hit short stacks (Rising Power / Rising Defense) ---
    m = re.fullmatch(rf"(?:On hitting a foe|When hit by a foe) you gain {NUM} ({STATWORDS}) for \d+ seconds\. This effect can stack a maximum of (\d+) times\.?", t)
    if m: return [ent(canon(m[2]), n(m[1]), rating=True, cond=True, perStack=True, maxStacks=int(m[3]), name=name, desc=d)]

    # --- big-hit dealt/healed triggers (Butcher's Might/Guard) ---
    m = re.search(rf"damage or heal your target for more than \d+% .*? you gain {NUM}% ({STATWORDS}) for 10 seconds\.? ?(?:\(Max(?:imum)? ?(\d+)? ?[Ss]tacks?\)?)?", t)
    if m:
        stacks = int(m[3]) if m[3] else None
        return [ent(canon(m[2]), n(m[1]), cond=True, perStack=bool(stacks), maxStacks=stacks, name=name, desc=d)]

    # --- zone damage families ---
    m = re.fullmatch(rf"\+{NUM}% Damage in (?:all of )?(?:the )?(Chult|Undermountain|Wildspace|Avernus|Underdark|Icewind Dale|Sharandar|Barovia|Vallenhas|Dragon ?bone Vale|Menzoberranzan|Northdark Reaches|Sword Coast)\.?", t)
    if m: return [ent("Dmg Bonus", n(m[1]), zones=[m[2]], name=name, desc=d)]
    m = re.fullmatch(rf"\+{NUM}% Damage in (Wildspace)\. \+{NUM}% Damage in non-Wildspace\.?", t)
    if m:
        base = n(m[3]); extra = n(m[1]) - base
        return [ent("Dmg Bonus", base, name=name, desc=d), ent("Dmg Bonus", extra, zones=["Wildspace"], name=name)]
    m = re.fullmatch(rf"\+{NUM}% Damage on (fire-themed|ice-themed|water-themed|[\w-]+) maps\. \+{NUM}% Damage on other maps\.?", t)
    if m:
        base = n(m[3]); extra = n(m[1]) - base
        return [ent("Dmg Bonus", base, name=name, desc=d), ent("Dmg Bonus", extra, zones=[m[2].capitalize() + " maps"], name=name)]

    # --- class resource (Divine Muse / Resourceful Forte) ---
    m = re.fullmatch(rf"Your (?:Divinity|Performance|Soulweave|Divinity/Performance/Soulweave)[\w/ ]* regenerates {NUM}% faster\.?", t)
    if m: return [ent("Class Resource Regen", n(m[1]), name=name, desc=d)]
    m = re.fullmatch(rf"Your (?:Divinity|Performance|Soulweave|Divinity/Performance/Soulweave)[\w/ ]* maximum increases by {NUM}%\.(?: Gain {NUM}% Forte\.?)?", t)
    if m:
        out = [ent("Class Resource Max", n(m[1]), name=name, desc=d)]
        if m[2]: out.append(ent("Forte", n(m[2]), name=name))
        return out

    # --- chance-procs granting a stat for a duration (generic, incl. multi-stat) ---
    m = re.search(rf"\d+% chance to (?:gain|increase) (?:your )?({STATWORDS})(?: and ({STATWORDS}))? by \+?{NUM}(%?) for \d+ ?s", t)
    if m:
        out = [ent(canon(m[1]), n(m[3]), rating=(m[4] != "%"), cond=True, name=name, desc=d)]
        if m[2]: out.append(ent(canon(m[2]), n(m[3]), rating=(m[4] != "%"), cond=True, name=name))
        return out

    # --- Tactical Defense family: encounter-proc part has no layer; the
    #     trailing flat Combat Advantage clause is real and always-on ---
    if name.startswith("Tactical Defense"):
        m = re.search(rf"You gain {NUM}% Combat Advantage", t)
        if m: return [ent("Combat Advantage", n(m[1]), name=name, desc=d)]

    # --- safe catch-alls (always-on simple lines) — keep LAST ---
    m = re.fullmatch(rf"\+{NUM}(%?) ?({STATWORDS})\.?", t)
    if m: return [ent(canon(m[3]), n(m[1]), rating=(m[2] != "%"), name=name, desc=d)]
    m = re.fullmatch(rf"(?:You gain|Gain|Grants) \+?{NUM}(%?) ?({STATWORDS})\.?", t)
    if m: return [ent(canon(m[3]), n(m[1]), rating=(m[2] != "%"), name=name, desc=d)]
    m = re.fullmatch(rf"(?:Your )?({STATWORDS}) is increased by {NUM}(%?)\.?", t)
    if m: return [ent(canon(m[1]), n(m[2]), rating=(m[3] != "%"), name=name, desc=d)]
    m = re.fullmatch(rf"Increases? (?:your )?({STATWORDS}) by {NUM}(%?)\.?", t)
    if m: return [ent(canon(m[1]), n(m[2]), rating=(m[3] != "%"), name=name, desc=d)]

    return None

g = json.load(open(PATH, encoding="utf-8"))
done = collections.Counter(); flagged = collections.Counter(); skipped = collections.Counter()
for it in g:
    ebs = it.get("equipBonuses")
    if not ebs: continue
    out = []
    for eb in ebs:
        blind = eb.get("type") != "Set" and not (eb.get("stat") and eb.get("amount") is not None)
        if not blind:
            out.append(eb); continue
        nm = (eb.get("name") or "").strip()
        d = (eb.get("description") or eb.get("effectText") or "").strip()
        r = parse(nm, d) if d else None
        if r == "SKIP":
            skipped[nm] += 1; out.append(eb)
        elif r:
            done[nm] += 1; out.extend(r)
        else:
            if nm and d: flagged[nm] += 1
            out.append(eb)
    it["equipBonuses"] = out

print(f"structured: {sum(done.values())} instances across {len(done)} names")
for nm, c in done.most_common(25): print(f"  {c:4}x {nm}")
print(f"skip-listed (no engine layer), instances: {sum(skipped.values())} across {len(skipped)} names")
print(f"still untouched: {sum(flagged.values())} instances across {len(flagged)} names")
if DRY:
    print("\nDRY RUN — re-run with --apply to write")
else:
    json.dump(g, open(PATH, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print("WROTE", PATH)
