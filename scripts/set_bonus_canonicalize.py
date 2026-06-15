#!/usr/bin/env python3
"""
Tier-2: for sets whose members carry DIFFERENT wordings of the set bonus,
pick ONE canonical text and propagate it set-wide.

Safe-vs-review split:
  - Extract the numeric tokens from each variant text (percentages, ratings,
    durations, cooldowns, stack caps). If every variant has the SAME multiset
    of numbers, the differences are pure WORDING -> safe to auto-canonicalise
    (pick the longest/most-complete variant, which keeps every clause).
  - If the numbers DIFFER, it's a bad read, real tier-scaling, or a dup-name
    set collision -> REVIEW (printed in full, never auto-written).

--apply writes only the SAFE picks. Review sets are always left untouched.
Canonical entry per under-described member:
  {type:"Set", scope:"self", setName, pieces, name:"<Set> (canonical)",
   description:<chosen>, parsedFrom:"canonical"}
Existing described members are RE-POINTED to the canonical text too (so the
whole set reads identically) by appending the canonical entry; the renderer
de-dupes by description, and older divergent Set descriptions are left in place
only if they already match. Engine scoring untouched (no stat/amount).
"""
import json, sys, os, re
from collections import defaultdict, Counter

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
GEAR = os.path.join(ROOT, "data", "gear.json")
APPLY = "--apply" in sys.argv
SHOW_REVIEW = "--review" in sys.argv

def norm(s): return re.sub(r"\s+", " ", (s or "").strip()).lower()

def numbers(text):
    # numeric tokens, commas stripped (5,000 -> 5000); keep decimals
    toks = re.findall(r"\d[\d,]*\.?\d*", text or "")
    return Counter(t.replace(",", "").rstrip(".") for t in toks)

def member_desc(e):
    if e.get("setBonus"): return e["setBonus"]
    for eb in (e.get("equipBonuses") or []):
        if eb.get("type") == "Set" and eb.get("description"): return eb["description"]
    return None

data = json.load(open(GEAR, encoding="utf-8"))
by_set = defaultdict(list)
for e in data:
    if e.get("set"): by_set[e["set"]].append(e)

safe, review = {}, {}
for s, members in by_set.items():
    variants = {}   # norm -> verbatim
    vmembers = defaultdict(int)
    for e in members:
        d = member_desc(e)
        if d:
            variants.setdefault(norm(d), d)
            vmembers[norm(d)] += 1
    if len(variants) <= 1:
        continue  # not a conflict
    numsets = {k: numbers(v) for k, v in variants.items()}
    distinct_numsets = {frozenset(c.items()) for c in numsets.values()}
    if len(distinct_numsets) == 1:
        # numbers agree -> wording-only. canonical = longest verbatim.
        canon = max(variants.values(), key=len)
        safe[s] = canon
    else:
        review[s] = [(variants[k], vmembers[k], sorted(numsets[k].elements()))
                     for k in variants]

print(f"Conflict sets: {len(safe)+len(review)}")
print(f"  SAFE  (numbers agree, wording-only): {len(safe)}")
print(f"  REVIEW(numbers differ):              {len(review)}")
print()
print("=== SAFE canonical picks ===")
for s in sorted(safe):
    print(f"  {s}: {safe[s][:110]!r}")

if SHOW_REVIEW:
    print("\n=== REVIEW (numbers differ — NOT auto-written) ===")
    for s in sorted(review):
        print(f"\n## {s}")
        for txt, nmem, nums in review[s]:
            print(f"   [{nmem} member(s)] nums={nums}")
            print(f"      {txt[:200]!r}")

if APPLY:
    overwritten = appended = 0
    for s, canon in safe.items():
        pcs = None
        m = re.match(r"\s*(\d+)\s+of\s+set", canon, re.I)
        if m: pcs = int(m.group(1))
        for e in by_set[s]:
            pcs_e = pcs or e.get("setSize") or 2
            # 1) normalise any EXISTING Set description in place (no duplicate blocks)
            has_described = False
            for eb in (e.get("equipBonuses") or []):
                if eb.get("type") == "Set" and eb.get("description"):
                    if norm(eb["description"]) != norm(canon):
                        eb["description"] = canon
                        eb["parsedFrom"] = "canonical"
                        overwritten += 1
                    has_described = True
            # legacy setBonus string -> normalise too (it is suppressed when a
            # structured Set entry exists, but keep it consistent if it shows)
            if e.get("setBonus") and norm(e["setBonus"]) != norm(canon):
                e["setBonus"] = canon
            # 2) members with NO Set description get a display-only canonical entry
            if not has_described:
                e.setdefault("equipBonuses", []).append({
                    "type": "Set", "scope": "self", "setName": s, "pieces": pcs_e,
                    "name": f"{s} ({pcs_e}/{pcs_e})",
                    "description": canon, "parsedFrom": "canonical",
                })
                appended += 1
    with open(GEAR, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"\nAPPLIED across {len(safe)} safe sets: {overwritten} descriptions normalised, "
          f"{appended} added to blank members")
else:
    print("\n(dry run — pass --apply to write SAFE picks; --review to print review sets)")
