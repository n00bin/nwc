"""Audit fixes verified 2026-06-22 from in-game screenshots.

SOULPIERCER (GREATER) 2pc — screenshot:
  docs/calibration/inbox/_set_details/Soulpiercer (Greater)_set_details.png
  "2 of Set: While in Thay, your Movement Speed is increased by 12% and your
   Damage is increased by 2%."  (the rest is italic flavor text — no Power bonus)
  Data bugs on the two members (Voidcaller's Treatise, Cursebearer's Maw):
   - Voidcaller carries a phantom 'Dmg Bonus' 2.5 AND a 'Dmg Bonus' 2 (real = 2%).
   - Members disagree on stat string ('Dmg Bonus' vs 'Damage Bonus') — both map
     to the generic damage bucket, so the set-dedup (keyed setName+stat string)
     credits them SEPARATELY => double-count.
   - Neither MS nor Damage is zone-gated, so a Thay-only set inflates General builds.
  FIX: each member's Soulpiercer set = Movement Speed 12 + Damage Bonus 2, BOTH
       zones:["Thay"]; canonical stat name 'Damage Bonus'; drop the phantom 2.5.
       The stat=None set-sibling display marker is left untouched.

RADIANT ELVEN HOOD (id 3209) Spelljammer's Advantage — screenshot:
  docs/calibration/inbox/gear/warlock-gear/heads/Radiant Elven Hood_IL2800.png
  "For every 5 seconds you are in combat, you gain 0.85% Combat Advantage.
   Max Stacks: 7 (10 in Wildspace)."
  Data carries TWO entries for the same bonus: an old description-parsed
  0.65%/3s (wrong) and the screenshot-parsed 0.85%/5s (correct). Both credit
  (different amount => within-item dedup didn't catch it) => 10.5% CA.
  FIX: drop the parsedFrom=='description' 0.65 entry; keep the 0.85 screenshot one.
"""
import json, sys
PATH = "../data/gear.json"; APPLY = "--apply" in sys.argv
g = json.load(open(PATH, encoding="utf-8"))

# ---- Soulpiercer (Greater) ----
sp_items = 0; sp_removed = 0
for it in g:
    ebs = it.get("equipBonuses") or []
    if not any(eb.get("setName") == "Soulpiercer (Greater)" for eb in ebs):
        continue
    sp_items += 1
    out = []; have_ms = have_dmg = False
    for eb in ebs:
        if eb.get("setName") != "Soulpiercer (Greater)":
            out.append(eb); continue
        st = eb.get("stat")
        if st == "Movement Speed":
            if have_ms: sp_removed += 1; continue
            have_ms = True
            eb["amount"] = 12; eb["zones"] = ["Thay"]
            out.append(eb)
        elif st in ("Dmg Bonus", "Damage Bonus"):
            if have_dmg: sp_removed += 1; continue   # drop phantom / duplicate dmg entry
            have_dmg = True
            eb["stat"] = "Damage Bonus"; eb["amount"] = 2; eb["zones"] = ["Thay"]
            out.append(eb)
        else:
            out.append(eb)   # display marker (stat=None) etc.
    it["equipBonuses"] = out
print(f"Soulpiercer: normalized {sp_items} members, dropped {sp_removed} phantom/dup dmg entries; "
      f"set MS 12 + Damage Bonus 2, both zones=[Thay]")

# ---- Radiant Elven Hood ----
reh = next((it for it in g if it.get("id") == 3209), None)
reh_removed = 0
if reh:
    out = []
    for eb in reh.get("equipBonuses") or []:
        if (eb.get("name") == "Spelljammer's Advantage" and eb.get("stat") == "Combat Advantage"
                and eb.get("parsedFrom") == "description"):
            reh_removed += 1; continue
        out.append(eb)
    reh["equipBonuses"] = out
print(f"Radiant Elven Hood: dropped {reh_removed} stale description-parsed Spelljammer entry (kept 0.85 screenshot)")

if APPLY:
    json.dump(g, open(PATH, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print("WROTE", PATH)
else:
    print("DRY RUN — re-run with --apply")
