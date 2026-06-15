#!/usr/bin/env python3
"""
Propagate a set's existing, verified set-bonus prose to its sibling members
that currently show nothing (empty stub) or only a bare synthesized stat.

WHY: set bonuses are set-wide and (verified) tier-uniform within a set, but our
data often carries the full description on only ONE member; the others render as
a misleading bare "+X% Stat". This fills them in from our OWN data — no new
text is invented.

SAFETY:
  - TIER 1 ONLY by default: a set is eligible only if all its members that have
    a description AGREE on exactly ONE text (after whitespace-normalisation).
    Sets whose members disagree (Tier 2 conflicts) are SKIPPED and listed.
  - We never touch existing scoring entries (stat/amount Set bonuses remain).
  - We add ONE description-only Set equipBonus per under-described member:
        {type:"Set", setName, pieces, name:"<Set> (Npc)", description:T,
         parsedFrom:"set-sibling"}
    The card renderer's `describedSets` logic then shows T once and hides the
    bare stat siblings — exactly how already-correct members render.

Run with --apply to write; default is dry-run.
"""
import json, sys, re, os
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
GEAR = os.path.join(ROOT, "data", "gear.json")
APPLY = "--apply" in sys.argv

def norm(s):
    return re.sub(r"\s+", " ", (s or "").strip()).lower()

def member_desc(e):
    """Canonical set description visible on this member, if any."""
    if e.get("setBonus"):
        return e["setBonus"]
    for eb in (e.get("equipBonuses") or []):
        if eb.get("type") == "Set" and eb.get("description"):
            return eb["description"]
    return None

def member_shows(e, text):
    """Does this member already render `text` as its set bonus?"""
    nt = norm(text)
    if norm(e.get("setBonus")) == nt:
        return True
    for eb in (e.get("equipBonuses") or []):
        if eb.get("type") == "Set" and norm(eb.get("description")) == nt:
            return True
    return False

data = json.load(open(GEAR, encoding="utf-8"))

# group members by set name
sets = defaultdict(list)
for e in data:
    if e.get("set"):
        sets[e["set"]].append(e)

tier1 = {}      # set -> canonical text (single agreed)
conflicts = {}  # set -> list of distinct texts
none_sets = []  # set with no prose anywhere

for s, members in sets.items():
    texts = {}
    for e in members:
        d = member_desc(e)
        if d:
            texts.setdefault(norm(d), d)  # keep first verbatim per normalised key
    if not texts:
        none_sets.append(s)
    elif len(texts) == 1:
        tier1[s] = next(iter(texts.values()))
    else:
        conflicts[s] = list(texts.values())

# plan Tier-1 propagation
to_fill = []  # (set, member)
for s, text in tier1.items():
    for e in sets[s]:
        if not member_shows(e, text):
            to_fill.append((s, e, text))

print(f"GEAR: {GEAR}")
print(f"Distinct sets: {len(sets)}")
print(f"  Tier-1 (single agreed text): {len(tier1)} sets")
print(f"  Tier-2 (conflicting texts):  {len(conflicts)} sets  -> SKIPPED, review separately")
print(f"  None (no prose anywhere):    {len(none_sets)} sets  -> need transcription")
print(f"Member-entries to fill (Tier-1): {len(to_fill)}")
print()

# show a few concrete before/after examples
print("=== sample fills (first 6) ===")
for s, e, text in to_fill[:6]:
    print(f"  set={s!r}  member={e.get('name')!r} (IL {e.get('item_level')}, id {e.get('id')})")
    print(f"     + Set desc: {text[:120]!r}")
print()
print("=== Tier-2 conflict sets (need manual canonicalisation) ===")
for s in sorted(conflicts):
    print(f"  {s}  ({len(conflicts[s])} texts)")

if APPLY:
    n = 0
    for s, e, text in to_fill:
        e.setdefault("equipBonuses", [])
        pcs = e.get("setSize") or 2
        e["equipBonuses"].append({
            "type": "Set",
            "scope": "self",
            "setName": s,
            "pieces": pcs,
            "name": f"{s} ({pcs}/{pcs})",
            "description": text,
            "parsedFrom": "set-sibling",
        })
        n += 1
    with open(GEAR, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"\nAPPLIED: added {n} description-only Set entries to {GEAR}")
else:
    print("\n(dry run — pass --apply to write)")
