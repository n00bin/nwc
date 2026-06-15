#!/usr/bin/env python3
"""
Tier-3a: write VERBATIM set-bonus text transcribed from existing
docs/calibration/inbox/_set_details/ screenshots into gear.json, for sets
that previously had NO prose on any member.

Each text below was read directly from the in-game set tooltip (2x-upscaled).
Set bonuses are set-wide, so the text is applied to every member of the set.

Adds one display-only Set equipBonus per member that lacks it:
  {type:"Set", scope:"self", setName, pieces, name:"<Set> (N/N)",
   description:<verbatim>, parsedFrom:"screenshot"}
Engine scoring is unchanged (no stat/amount). Run with --apply to write.

Skipped on purpose (ambiguous/degenerate — left for a careful pass):
  - Black Ice          (screenshot "3 of Set" vs 4 members in data; multiple
                        Black Ice sets — member mapping uncertain)
  - Pact Blade of Elemental Fire (set bonus shows "Equip: 0 ..." — degenerate)
"""
import json, sys, os, re
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
GEAR = os.path.join(ROOT, "data", "gear.json")
APPLY = "--apply" in sys.argv

OVERCHARGE = ("If you dodge, block, sprint or shadow slip, you gain Overcharge: "
    "Defense, which decreases your Incoming Damage by 10% and increases your "
    "Movement Speed by 15% for 10 seconds. If you use an Encounter power, you "
    "gain Overcharge: Attack, which increases your Outgoing Damage by 10% and "
    "heals you 15% of your health over 10 seconds. You can only activate an "
    "Overcharge power once every 30 seconds.")

# set name -> (pieces, verbatim description incl. "N of Set:" prefix)
TEXTS = {
    "Malignant Energy": (3,
        "3 of Set: When you use a Daily power, you will take 2.5% less damage "
        "and will do 2.5% more damage to enemies for 10 seconds."),
    "Crimson Retaliation": (3,
        "3 of Set: While this set bonus is active, you will accumulate Crimson "
        "Retaliation stacks whenever you take damage. For each stack of Crimson "
        "Retaliation, the active power of your Crimson Calamity artifact will be "
        "amplified. Shield gain: +4%. Self damage: +4%. Maximum stacks: 10."),
    "Executioner's Bloodthirst": (2,
        "2 of Set: While in Thay, your Movement Speed is increased by 10%. When "
        "you kill an enemy, your Damage increases by 5% for 10 seconds. "
        "(30 second cooldown)"),
    "Executioner's Bloodthirst (Greater)": (2,
        "2 of Set: While in Thay, your Movement Speed is increased by 12% and "
        "your Damage is increased by 2%. When you kill an enemy, your Damage "
        "increases by 5% for 10 seconds. (15 second cooldown)"),
    "Ghastly Eruption": (2,
        "2 of Set: While in Thay, your Movement Speed is increased by 10%. "
        "Using a daily power will deal 300 magnitude damage around you. "
        "(30 second cooldown)"),
    "Ghastly Eruption (Greater)": (2,
        "2 of Set: While in Thay, your Movement Speed is increased by 12% and "
        "your Damage is increased by 2%. Using a daily power will deal 300 "
        "magnitude damage around you. (30 second cooldown)"),
    "Weapons of the Shadesinger": (2, "2 of Set: " + OVERCHARGE),
    "Weapons of the Manaseeker": (2, "2 of Set: " + OVERCHARGE),
    "Weapons of the Headsman": (2, "2 of Set: " + OVERCHARGE),
}

def norm(s): return re.sub(r"\s+", " ", (s or "").strip()).lower()

def member_shows(e, text):
    if norm(e.get("setBonus")) == norm(text): return True
    for eb in (e.get("equipBonuses") or []):
        if eb.get("type") == "Set" and norm(eb.get("description")) == norm(text):
            return True
    return False

data = json.load(open(GEAR, encoding="utf-8"))
by_set = defaultdict(list)
for e in data:
    if e.get("set"): by_set[e["set"]].append(e)

added = 0
for sname, (pcs, text) in TEXTS.items():
    members = by_set.get(sname, [])
    if not members:
        print(f"  WARN  no members found for set {sname!r}")
        continue
    names = sorted({m.get("name") for m in members})
    print(f"  {sname!r}: {len(members)} member(s), pieces={pcs}")
    print(f"     members: {names}")
    for e in members:
        if member_shows(e, text):
            continue
        e.setdefault("equipBonuses", []).append({
            "type": "Set", "scope": "self", "setName": sname, "pieces": pcs,
            "name": f"{sname} ({pcs}/{pcs})",
            "description": text, "parsedFrom": "screenshot",
        })
        # keep the visible piece-count consistent with the "N of Set" text
        if e.get("setSize") != pcs:
            e["setSize"] = pcs
        added += 1

print(f"\nWould add {added} description entries across {len(TEXTS)} sets.")
if APPLY:
    with open(GEAR, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"APPLIED to {GEAR}")
else:
    print("(dry run — pass --apply)")
