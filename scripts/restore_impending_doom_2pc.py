"""RESTORE the Impending Doom 2pc Power/Crit Severity I wrongly removed.

MISTAKE (2026-06-22): I read the Dread Confessor IL5250 set_details + the Grimfang
evidence tooltip, saw only the "Unleashed: +X% Base Damage Boost" line, and
concluded the 2pc was BDB-only -> removed +2.5% Power / +7.5% Critical Severity.
Those captures were TRUNCATED at the panel boundary.

The full Omen of Doom IL4800 *Details* panel
(docs/audit/_up/warlock-gear/Omen of Doom_IL4800_details.png) shows the COMPLETE 2pc:
  2 of Set: 10 Charges -> Unleashed (DPS +4.5% Base Damage Boost /
            Heal +4.5% Outgoing Healing, 20s, refreshable)
  +7.5% Critical Severity   <- always-on line below the Unleashed block
  +2.5% Power               <- always-on line below the Unleashed block
This matches the data_issues.md note "RESOLVED 2026-06-10". The 7.5%/2.5% are
flat (tier-invariant); only the Base Damage Boost scales by IL (3.0..5.0).

FIX: every item carrying an Impending Doom 'Base Damage Boost' Set entry also gets
a 'Power' 2.5 and 'Critical Severity' 7.5 Set entry (idempotent — skip if present).
Applying to ALL members (not just the MH/OH ones the prior backfill touched) so an
AE-weapon-only pair (e.g. Grimfang + Harrowed Messengers) also completes the full
2pc; the engine set-dedup credits each (setName,stat) once regardless.
"""
import json, sys
PATH = "../data/gear.json"; APPLY = "--apply" in sys.argv
SET = "Impending Doom"
g = json.load(open(PATH, encoding="utf-8"))
added_p = added_c = 0
for it in g:
    ebs = it.get("equipBonuses") or []
    has_bdb = any(eb.get("setName") == SET and eb.get("stat") == "Base Damage Boost" for eb in ebs)
    if not has_bdb:
        continue
    has_power = any(eb.get("setName") == SET and eb.get("stat") == "Power" for eb in ebs)
    has_crit  = any(eb.get("setName") == SET and eb.get("stat") == "Critical Severity" for eb in ebs)
    if not has_power:
        ebs.append({"type":"Set","setName":SET,"pieces":2,"stat":"Power","amount":2.5,
                    "parsedFrom":"screenshot"}); added_p += 1
    if not has_crit:
        ebs.append({"type":"Set","setName":SET,"pieces":2,"stat":"Critical Severity","amount":7.5,
                    "parsedFrom":"screenshot"}); added_c += 1
    it["equipBonuses"] = ebs
print(f"restored Power 2.5 on {added_p} items, Critical Severity 7.5 on {added_c} items")
if APPLY:
    json.dump(g, open(PATH, "w", encoding="utf-8"), indent=2, ensure_ascii=False); print("WROTE", PATH)
else:
    print("DRY RUN — re-run with --apply")
