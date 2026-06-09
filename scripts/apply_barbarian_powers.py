#!/usr/bin/env python3
"""Backfill the Barbarian (Blademaster) power/feat data in data/classes.json from
in-game screenshots verified by n00b 2026-06-09.

Conservative & idempotent:
- Preserves the existing mechanic entries verbatim (esp. the verified Battlerage
  drain note) — only APPENDS new items.
- Updates a handful of existing values that the screenshots corrected
  (cooldowns 13.6 -> 13.2, IBS cd 10.9 -> 10.6 + base magnitude 750,
   Savage Advance range 82 -> 62).
- Adds new paragon powers/features and the Blademaster T1-T5 feat tree under a
  new additive "paragonFeats" key (CLASSES_DATA is pass-through; nothing does
  stat math on it, so this is display-safe).
Run from anywhere: python apply_barbarian_powers.py [--apply]
Dry-run prints a summary; --apply writes the file.
"""
import json, sys
from pathlib import Path

P = Path("G:/ai_projects/nwcb/data/classes.json")
APPLY = "--apply" in sys.argv
PARAGON = "Blademaster"

d = json.loads(P.read_text(encoding="utf-8"))
b = next(c for c in d if c["name"] == "Barbarian")

def find(lst, name):
    return next((x for x in lst if x.get("name") == name), None)

def has(lst, name):
    return find(lst, name) is not None

changes = []

# ---------- AT-WILLS ----------
aw = b["powers"]["atWill"]
for p in [
    {"name": "Brash Strike", "type": "atWill", "magnitude": 140, "castSeconds": 0.65,
     "rangeMelee": True, "paragon": PARAGON,
     "notes": "Threefold attack to target enemy, dealing physical damage each hit."},
    {"name": "Relentless Slash", "type": "atWill", "magnitude": 55, "castSeconds": 0.8,
     "rangeMelee": True, "paragon": PARAGON, "addedEffect": "Increases damage dealt by 5%",
     "notes": "Twofold attack to enemies in a cone before you, dealing physical damage each hit."},
]:
    if not has(aw, p["name"]):
        aw.append(p); changes.append("ADD at-will " + p["name"])

# ---------- ENCOUNTERS ----------
enc = b["powers"]["encounter"]
# IMPORTANT: cooldowns shown in n00b's screenshots are reduced by the character's
# Recharge Speed and are NOT base values. So we do NOT overwrite the existing base
# cooldowns of pre-existing powers, and new powers below store base cooldown as null
# (the recharge-affected reading is kept separately as cooldownObservedSeconds).
# Magnitude, cast time, range, radius and effects are NOT affected by recharge.
ibs = find(enc, "Indomitable Battle Strike")
if ibs:
    if ibs.get("magnitude") != 750 or "magnitudeRange" in ibs:
        ibs.pop("magnitudeRange", None)
        ibs["magnitude"] = 750
        note = ("Base magnitude 750. With the Indomitable Rage feat it scales from 800 "
                "(no Rage) to 1200 (max Rage). Verified 2026-06-09.")
        ibs["notes"] = (ibs.get("notes", "").strip() + " " + note).strip()
        changes.append("FIX Indomitable Battle Strike -> base magnitude 750 + feat note (cooldown left at base)")
for p in [
    {"name": "Hidden Daggers", "type": "encounter", "magnitude": 100, "castSeconds": 0.8,
     "cooldownSeconds": None, "cooldownObservedSeconds": 7, "range": 40, "charges": 2, "paragon": PARAGON,
     "addedEffect": "Gain the effect of Surprise Attack: deal additional physical damage after your next attack that is not Hidden Daggers",
     "notes": "Slide backwards and deal projectile damage to enemies in a cone before you. Two charges. (Observed cooldown reduced by Recharge Speed; base not yet captured.)"},
    {"name": "Roar", "type": "encounter", "magnitude": 250, "castSeconds": 0.61,
     "cooldownSeconds": None, "cooldownObservedSeconds": 11.5, "range": 30, "paragon": PARAGON, "addedEffect": "Stun",
     "notes": "Unleash a battle roar in front of you, interrupting enemies and building Rage for every target hit. (Observed cooldown reduced by Recharge Speed; base not yet captured.)"},
    {"name": "Frenzy", "type": "encounter", "magnitude": 1275, "castSeconds": 1.1,
     "cooldownSeconds": None, "cooldownObservedSeconds": 14.1, "range": 17, "paragon": PARAGON,
     "notes": "Deal physical damage to target enemy. Highest-magnitude Barbarian encounter. (Observed cooldown reduced by Recharge Speed; base not yet captured.)"},
    {"name": "Battle Fury", "type": "encounter", "castSeconds": 1.2, "cooldownSeconds": None, "cooldownObservedSeconds": 17.6,
     "radius": 80, "durationSeconds": 10, "paragon": PARAGON,
     "notes": "Increases your damage dealt by 10% and nearby allies' damage dealt by 5%, and generates additional Rage. Duration 10s. (Observed cooldown reduced by Recharge Speed; base not yet captured.)"},
    {"name": "Axestorm", "type": "encounter", "magnitude": 450, "castSeconds": 1.4,
     "cooldownSeconds": None, "cooldownObservedSeconds": 13.2, "range": 50, "radius": 10, "paragon": PARAGON,
     "notes": "Deal projectile damage to enemies in a line before you. (Observed cooldown reduced by Recharge Speed; base not yet captured.)"},
]:
    if not has(enc, p["name"]):
        enc.append(p); changes.append("ADD encounter " + p["name"])

# ---------- DAILIES ----------
dly = b["powers"]["daily"]
sa = find(dly, "Savage Advance")
if sa and sa.get("range") != 62:
    sa["range"] = 62; changes.append("FIX Savage Advance range -> 62")
for p in [
    {"name": "Avalanche of Steel", "type": "daily", "magnitude": 1400, "castSeconds": 5,
     "range": 30, "actionPointCost": 1000, "paragon": PARAGON, "addedEffect": "Knock Down",
     "notes": "Leap into the air, avoiding most damage and control for 5s, then crash down dealing physical damage to nearby enemies."},
    {"name": "Adamantine Strike", "type": "daily", "magnitude": 1200, "castSeconds": 1.3,
     "range": 30, "actionPointCost": 1000, "paragon": PARAGON,
     "addedEffect": "Increases target's damage taken by 5% for 10s",
     "notes": "Deal physical damage to enemies in a cone before you."},
]:
    if not has(dly, p["name"]):
        dly.append(p); changes.append("ADD daily " + p["name"])

# ---------- MECHANIC (append Forte only; never touch Battlerage note) ----------
mech = b["powers"]["mechanic"]
if not has(mech, "Forte"):
    mech.append({"name": "Forte", "type": "mechanic", "paragon": PARAGON,
                 "notes": "Your paragon path provides an increase to Power and excels at Critical Severity and Awareness. Automatic; not slotted."})
    changes.append("ADD mechanic Forte")

# Ensure the verified Battlerage drain note/fields are present (n00b 2026-06-08).
# This was an uncommitted working-tree change; encoding it here so the script
# reproduces the FULL correct state even from a bare HEAD.
br = find(mech, "Battlerage")
if br is not None and not br.get("drainSecondsIdle"):
    br["drainSecondsIdle"] = 16.7
    br["drainSecondsAttacking"] = 8.7
    br["sustainable"] = False
    br["notes"] = ("Generates Rage from damage and kills. At 50% Rage, activate Battlerage. "
        "Increases at-will speed, drains Rage. DRAIN VERIFIED by n00b 2026-06-08: a FULL Rage "
        "bar empties in ~16.7s idle (3 tests: 16.03/16.67/16.67) but only ~8.7s while ATTACKING "
        "- even with Steady Rage + Brutal Critical + Relentless Battlerage all active. So attacking "
        "drains Rage roughly TWICE as fast as idle (the at-will-speed boost spends Rage per action), "
        "and NO amount of generation sustains Battlerage. This is a hard BUILD-AND-DUMP class: "
        "Battlerage is a ~8.7s burst window, not a holdable state. Relentless Battlerage's 2x gen "
        "speeds the REBUILD between windows (more frequent windows), it does NOT extend a window. "
        "Raging Strikes / Indomitable Battle Strike scale with current Rage, so they peak at window "
        "START (if you pop near full) and fade as it drains - front-load big hits.")
    changes.append("RESTORE Battlerage verified drain note + fields")

# ---------- CLASS FEATURES (append paragon ones) ----------
cf = b["classFeatures"]
for p in [
    {"name": "Steel Blitz", "description": "Your at-will attacks now have a 20% chance to strike the target twice.", "paragon": PARAGON},
    {"name": "Barbed Strikes", "description": "Increases your Critical Strike and Critical Severity by 5% whenever your stamina is full. These effects decrease as stamina decreases.", "paragon": PARAGON},
    {"name": "Raging Strikes", "description": "Rage increases the damage your attacks deal, up to a maximum of 15%.", "paragon": PARAGON},
    {"name": "Impatience", "description": "Entering Battlerage reduces all of your cooldowns by 2 seconds.", "paragon": PARAGON},
]:
    if not has(cf, p["name"]):
        cf.append(p); changes.append("ADD class feature " + p["name"])

# ---------- SKILL FEATS (append Raging Criticals) ----------
ft = b["feats"]
if not has(ft, "Raging Criticals"):
    ft.append({"name": "Raging Criticals",
               "description": "Increases your critical severity by 10% when under the effect of Battlerage or Unstoppable.",
               "type": "skill"})
    changes.append("ADD skill feat Raging Criticals")

# ---------- PARAGON FEAT TREE (new additive key) ----------
if "paragonFeats" not in b:
    b["paragonFeats"] = {}
b["paragonFeats"][PARAGON] = [
    {"tier": 1, "choices": [
        {"name": "Relentless Speed", "modifies": "Relentless Slash",
         "description": "Relentless Slash gains a 15% chance to grant the effect of Relentless Speed for 6s, allowing the use of Not So Fast regardless of the power's cooldown and without triggering a cooldown."},
        {"name": "Mightier Leap", "modifies": "Mighty Leap", "magnitudeOnProc": 780,
         "description": "Whenever Mighty Leap hits no enemies, gain the effect of Mightier Leap for 6s, increasing the magnitude of Mighty Leap to 780 and allowing its immediate reuse. May not trigger consecutively."},
    ]},
    {"tier": 2, "choices": [
        {"name": "Bloodspiller", "modifies": "Bloodletter", "magnitude": 950,
         "description": "Increases the magnitude of Bloodletter to 950, recovers from cooldown 3x faster, and causes Bloodletter to deal damage to you."},
        {"name": "Indomitable Rage", "modifies": "Indomitable Battle Strike", "magnitudeRange": [800, 1200],
         "description": "Indomitable Battle Strike's magnitude is increased to 1200 when you are at maximum Rage, but decreases to 800 when you have no Rage."},
    ]},
    {"tier": 3, "choices": [
        {"name": "Overpenetration", "maxDamagePercent": 10,
         "description": "Your powers deal up to 10% more damage, based on your Critical Strike and Critical Severity ratings. The closer these stats are to the rating cap, the larger the damage increase."},
        {"name": "Brutal Critical", "rageOnCrit": 3,
         "description": "Whenever your attacks deal critical damage, increase Rage by 3. Automatic; not slotted."},
    ]},
    {"tier": 4, "choices": [
        {"name": "Steel Slam", "modifies": "Avalanche of Steel", "magnitude": 200, "hits": 3, "durationSeconds": 12,
         "description": "Whenever you use Avalanche of Steel, create a circle of unstable ground upon landing, dealing physical damage over time (magnitude 200 x3 over 12s). Added Effect: Slow (3s)."},
        {"name": "Unstoppable Spin", "modifies": "Spinning Strike", "battlerageDamageBonusPercent": 50, "battlerageDurationBonusSeconds": 6,
         "description": "Whenever you use Spinning Strike, if you have less than 50 Rage, set your Rage to 50. Battlerage then activates automatically, its duration is increased by 6 seconds, and the damage bonus is increased to 50%. Does not stack with or activate Rampage.",
         "notes": "Its +6s duration extension is likely gated the same way as Rampage's +8s (the ~8.7s attacking Rage drain ends Battlerage regardless) - net +50% for ~8.7s. Not separately tested as of 2026-06-09."},
    ]},
    {"tier": 5, "choices": [
        {"name": "Relentless Battlerage", "rageGenMultiplier": 2,
         "description": "You build twice as much Rage from At-Will powers, Encounter powers, taking damage, and defeating enemies."},
        {"name": "Escalating Rage", "stacksForRampage": 5, "rampageDurationSeconds": 20,
         "battlerageExtendSeconds": 8, "battlerageExtendEffectiveWhileAttacking": False, "battlerageDamageBonusPercent": 25,
         "description": "Whenever you deal critical damage, gain a stack of Escalating Rage. At 5 stacks, gain Rampage for 20s. Rampage extends the duration of Battlerage by 8s and increases the damage bonus by +25%. You may not build Escalating Rage while under the effect of Battlerage.",
         "notes": "Verified n00b 2026-06-09: Rampage's +8s does NOT lengthen the Battlerage window while attacking - the ~8.7s Rage drain still ends it. Net effect is +50% damage (vs +25%) for the SAME ~8.7s window, not a longer one."},
    ]},
]
changes.append("ADD paragonFeats.Blademaster (T1-T5, 10 feats)")

# stamp
b["source_version"] = "2026-06-09 barbarian-blademaster screenshot pass"

print(f"{len(changes)} change(s):")
for c in changes:
    print("  -", c)
print(f"\nBarbarian now: {len(b['powers']['atWill'])} at-wills, "
      f"{len(b['powers']['encounter'])} encounters, {len(b['powers']['daily'])} dailies, "
      f"{len(b['powers']['mechanic'])} mechanics, {len(b['classFeatures'])} class features, "
      f"{len(b['feats'])} skill feats, paragonFeats.{PARAGON}={len(b['paragonFeats'][PARAGON])} tiers")

if APPLY:
    P.write_text(json.dumps(d, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("\nWROTE", P)
else:
    print("\n(dry-run; pass --apply to write)")
