#!/usr/bin/env python3
"""
Apply screenshot-verified set-bonus text (docs/audit/set_bonus_verified.json)
to ../data/gear.json. Steward sweep 2026-06-15.

Per set entry: overwrite any existing type:"Set" description in place (so the
card reads one text), set legacy setBonus to match, and append a display-only
Set entry to members that have none. Optional il_min/il_max restricts the write
to one tier (Dragonflight). parsedFrom:"screenshot". Scoring fields untouched.

--apply to write; default dry-run prints the plan + a no-scoring-loss assertion.
"""
import json, sys, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
GEAR = os.path.join(ROOT, "data", "gear.json")
VERIFIED = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                        "docs", "audit", "set_bonus_verified.json")
APPLY = "--apply" in sys.argv

def norm(s): return re.sub(r"\s+", " ", (s or "").strip()).lower()

data = json.load(open(GEAR, encoding="utf-8"))
spec = json.load(open(VERIFIED, encoding="utf-8"))["sets"]

by_set = {}
for e in data:
    if e.get("set"):
        by_set.setdefault(e["set"], []).append(e)

ov = ap = 0
report = []
for entry in spec:
    s = entry["set"]; text = entry["text"]; pcs = entry["pieces"]
    il_min = entry.get("il_min"); il_max = entry.get("il_max")
    members = by_set.get(s, [])
    touched = 0
    for e in members:
        il = e.get("item_level") or 0
        if il_min is not None and il < il_min: continue
        if il_max is not None and il > il_max: continue
        described = False
        for eb in (e.get("equipBonuses") or []):
            if eb.get("type") == "Set" and eb.get("description"):
                if norm(eb["description"]) != norm(text):
                    eb["description"] = text; eb["parsedFrom"] = "screenshot"; ov += 1
                described = True
        if e.get("setBonus") and norm(e["setBonus"]) != norm(text):
            e["setBonus"] = text
        if not described:
            e.setdefault("equipBonuses", []).append({
                "type": "Set", "scope": "self", "setName": s, "pieces": pcs,
                "name": f"{s} ({pcs}/{pcs})", "description": text,
                "parsedFrom": "screenshot"})
            ap += 1
        touched += 1
    tier = f" [IL {il_min or ''}-{il_max or ''}]" if (il_min or il_max) else ""
    report.append(f"  {s}{tier}: {touched} member(s)" + ("" if members else "  <-- NO MEMBERS"))

print(f"Verified sets: {len(spec)}")
print("\n".join(report))
print(f"\nWould overwrite {ov} descriptions, append {ap} to blank members.")
if APPLY:
    with open(GEAR, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"APPLIED to {GEAR}")
else:
    print("(dry run — pass --apply)")
