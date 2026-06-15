#!/usr/bin/env python3
"""
Tier-2 pass 2: resolve conflict sets where the disagreement is JUNK noise
around a single real bonus value.

A variant is JUNK (not a real set bonus) if it is collection/flavor/placeholder
text rather than the bonus: "Module N", "...crafted...", "Modification",
"A set of...", "Any ...", "Set pieces:", "restore through", "Equip: 0 ...",
or it contains no number at all.

Decision per conflict set:
  real = variants that are NOT junk
  - 0 real           -> FLAG (no real bonus captured; needs a screenshot)
  - all real agree   -> SAFE: canonical = longest real text, applied to EVERY
                        member (junk/empty members included — junk was wrong)
  - real disagree    -> FLAG (tier-scaling / bad read / dup-name collision /
                        complex meta set — never guessed here)

SAFE picks are written in place (overwrite divergent/junk Set descriptions,
append to blank members), parsedFrom:"canonical". --apply to write.
Already-canonicalised sets (pass 1) are unaffected (single variant -> skipped).
"""
import json, sys, os, re
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
GEAR = os.path.join(ROOT, "data", "gear.json")
APPLY = "--apply" in sys.argv

JUNK = [r"module\s*\d+", r"\bcrafted\b", r"\bmodification\b", r"^\s*a set of",
        r"^\s*any\s", r"^\s*set pieces:", r"restore through", r"equip:\s*0\b"]
def is_junk(t):
    if not re.search(r"\d", t or ""): return True          # no number = not a real bonus
    return any(re.search(p, t, re.I) for p in JUNK)

def norm(s): return re.sub(r"\s+", " ", (s or "").strip()).lower()
def nums(t): return tuple(sorted(x.replace(",", "").rstrip(".")
                                 for x in re.findall(r"\d[\d,]*\.?\d*", t or "")))
def member_desc(e):
    if e.get("setBonus"): return e["setBonus"]
    for eb in (e.get("equipBonuses") or []):
        if eb.get("type") == "Set" and eb.get("description"): return eb["description"]
    return None

data = json.load(open(GEAR, encoding="utf-8"))
by_set = defaultdict(list)
for e in data:
    if e.get("set"): by_set[e["set"]].append(e)

safe, flag = {}, {}
for s, members in by_set.items():
    variants = {}
    for e in members:
        d = member_desc(e)
        if d: variants.setdefault(norm(d), d)
    if len(variants) <= 1:
        continue
    real = [v for v in variants.values() if not is_junk(v)]
    if not real:
        flag[s] = "no real bonus (all junk/flavor)"
    elif len({nums(v) for v in real}) == 1:
        safe[s] = max(real, key=len)
    else:
        flag[s] = f"{len({nums(v) for v in real})} real values (tier/bad-read/complex)"

print(f"Conflict sets needing pass-2: {len(safe)+len(flag)}")
print(f"  SAFE (junk noise around one value): {len(safe)}")
print(f"  FLAG (real disagreement):           {len(flag)}\n")
print("=== SAFE picks ===")
for s in sorted(safe):
    print(f"  {s}: {safe[s][:100]!r}")
print("\n=== FLAG (left for screenshot-verified pass) ===")
for s in sorted(flag):
    print(f"  {s}  — {flag[s]}")

if APPLY:
    ov = ap = 0
    for s, canon in safe.items():
        pcs = None
        m = re.match(r"\s*(\d+)\s+of\s+set", canon, re.I)
        if m: pcs = int(m.group(1))
        for e in by_set[s]:
            pcs_e = pcs or e.get("setSize") or 2
            described = False
            for eb in (e.get("equipBonuses") or []):
                if eb.get("type") == "Set" and eb.get("description"):
                    if norm(eb["description"]) != norm(canon):
                        eb["description"] = canon; eb["parsedFrom"] = "canonical"; ov += 1
                    described = True
            if e.get("setBonus") and norm(e["setBonus"]) != norm(canon):
                e["setBonus"] = canon
            if not described:
                e.setdefault("equipBonuses", []).append({
                    "type": "Set", "scope": "self", "setName": s, "pieces": pcs_e,
                    "name": f"{s} ({pcs_e}/{pcs_e})", "description": canon,
                    "parsedFrom": "canonical"})
                ap += 1
    with open(GEAR, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"\nAPPLIED across {len(safe)} sets: {ov} normalised, {ap} added to blank members")
else:
    print("\n(dry run — pass --apply)")
