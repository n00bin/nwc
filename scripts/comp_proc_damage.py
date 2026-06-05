#!/usr/bin/env python3
"""Add structured procDamage to companion damage procs so the engine's
proc-damage layer can score them. Per-power parse of the prose effect:
  procDamage: { magnitude | magnitudeKey, icdSeconds?, triggerRateKey }
Plain magnitudes are stored as written (base-rarity values — the engine
scales them by compRarityScale like stats). Placeholder magnitudes
({mag}/{magnitude}) resolve via the existing effectScaling tables.

Excluded on purpose (documented in companion_proc_census.md):
  126 (passive daily-% needing verification), heal-only procs.
[231] Elminster: main bolt only (the 10% chain adds ~1%, ignored v1).
[38] Death Slaad: base 5-magnitude DoT only (stack explosion ignored v1).
"""
import json, re, sys

DRY = "--apply" not in sys.argv
PATH = r"G:\ai_projects\nwcb\data\companion_powers.json"

TRIGGER_KEY = [
    (r"non-critical", "noncrit"),
    (r"critical|critically", "crit"),
    (r"at-will", "atwill"),
    (r"encounter", "encounter"),
    (r"daily", "daily"),
    (r"taking damage|receiving|when you take|struck", "struck"),
    (r"^hit$|^on hit$|^hit\b|\bhit\b", "hit"),
]
def trig_key(t):
    t = (t or "").lower()
    for pat, key in TRIGGER_KEY:
        if re.search(pat, t): return key
    return None

def icd_of(text):
    m = re.search(r"[Oo]nce per second", text)
    if m: return 1
    m = re.search(r"[Oo]nce every (\d+(?:\.\d+)?) ?s", text)
    if m: return float(m[1])
    m = re.search(r"\((\d+(?:\.\d+)?) ?second cooldown\)", text)
    if m: return float(m[1])
    return None

EXCLUDE_IDS = {126}

cp = json.load(open(PATH, encoding="utf-8"))
added = []
for p in cp:
    pe = p.get("procEffect")
    if not pe or p["id"] in EXCLUDE_IDS: continue
    if pe.get("procDamage"): continue
    eff = re.sub(r"\s+", " ", pe.get("effect") or "")
    if "magnitude" not in eff.lower(): continue
    if isinstance(pe.get("statEffects"), list) and pe["statEffects"]: continue
    key = trig_key(pe.get("trigger"))
    if not key: continue
    pd = {"triggerRateKey": key}
    # placeholder magnitude -> effectScaling key
    m = re.search(r"\{(mag|magnitude)\}\s*magnitude", eff)
    if m and (pe.get("effectScaling") or {}).get(m[1]):
        pd["magnitudeKey"] = m[1]
    else:
        m = re.search(r"(\d+(?:\.\d+)?)\s*magnitude", eff)
        if not m: continue
        pd["magnitude"] = float(m[1])
    icd = icd_of(eff)
    if icd: pd["icdSeconds"] = icd
    pe["procDamage"] = pd
    added.append((p["id"], p["name"], pd))

print(f"procDamage added to {len(added)} powers:")
for pid, nm, pd in added:
    print(f"  [{pid:3}] {nm[:32]:32} {pd}")
if DRY:
    print("\nDRY RUN — re-run with --apply")
else:
    json.dump(cp, open(PATH, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print("WROTE", PATH)
