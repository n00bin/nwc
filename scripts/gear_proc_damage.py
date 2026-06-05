#!/usr/bin/env python3
"""Structure gear DAMAGE procs so the proc-damage layer can score them.
Adds eb.procDamage { triggerRateKey, chance, magnitude|flatDamage,
icdSeconds } to the 30-odd prose damage procs in gear.json. Magnitude
procs ride the player's multiplier chain; flatDamage procs are tooltip
captures (character-dependent) the engine adds as flat post-multiplier
damage — documented approximation. Conjure Orb is skipped (ambiguous
uptime/summon duration). Prose stays for display.
"""
import json, re, sys, collections

DRY = "--apply" not in sys.argv
PATH = r"G:\ai_projects\nwcb\data\gear.json"

def trig_key(text):
    t = text.lower()
    if re.search(r"critically strike|critical strike|on crit", t): return "crit"
    if re.search(r"when struck|whenever you are damaged|when you are damaged", t): return "struck"
    if re.search(r"daily power", t): return "daily"
    if re.search(r"encounter power", t): return "encounter"
    if re.search(r"at-will", t): return "atwill"
    if re.search(r"damage an enemy|whenever you damage|your next attack|with your powers|hit", t): return "hit"
    return None

def icd_of(t):
    m = re.search(r"once every (\d+(?:\.\d+)?) ?s", t, re.I)
    if m: return float(m[1])
    m = re.search(r"\((\d+(?:\.\d+)?) ?second cooldown\)", t)
    if m: return float(m[1])
    m = re.search(r"[Ee]very (\d+(?:\.\d+)?) seconds your next attack", t)
    if m: return float(m[1])
    return None

g = json.load(open(PATH, encoding="utf-8"))
DMG = re.compile(r"deal(?:s|ing)?\s+(?:up to\s+)?([\d,]+(?:\.\d+)?)\s*(magnitude\s*)?(?:\w+\s+)?damage", re.I)
added = collections.Counter(); skipped = collections.Counter()
for it in g:
    for eb in (it.get("equipBonuses") or []):
        if eb.get("stat") and eb.get("amount") is not None: continue
        if eb.get("procDamage"): continue
        d = re.sub(r"\s+", " ", (eb.get("description") or eb.get("effectText") or "")).strip()
        if not d: continue
        m = DMG.search(d)
        if not m: continue
        nm = (eb.get("name") or "?").strip()
        if nm.startswith("Conjure Orb"):
            skipped[nm] += 1; continue
        key = trig_key(d)
        if not key:
            skipped[nm] += 1; continue
        val = float(m[1].replace(",", ""))
        pd = {"triggerRateKey": key}
        cm = re.search(r"(\d+(?:\.\d+)?)% chance", d)
        if cm: pd["chance"] = float(cm[1])
        if m[2]: pd["magnitude"] = val          # "N magnitude damage"
        else: pd["flatDamage"] = val            # "N damage" (tooltip capture)
        icd = icd_of(d)
        if icd: pd["icdSeconds"] = icd
        eb["procDamage"] = pd
        added[nm + (" [flat]" if "flatDamage" in pd else " [mag]")] += 1

print(f"procDamage added to {sum(added.values())} gear bonuses:")
for nm, c in added.most_common(): print(f"  {c:3}x {nm}")
print("skipped:", dict(skipped))
if DRY: print("\nDRY RUN — re-run with --apply")
else:
    json.dump(g, open(PATH, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print("WROTE", PATH)
