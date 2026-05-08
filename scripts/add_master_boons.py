#!/usr/bin/env python3
"""Populate the Master tier in data/campaign_boons.json.

Source: in-game screenshots from NW Hub character editor 2026-05-08
(verified by n00b, full readable resolution).

Master tier rules learned:
- 8 Master boons total.
- Each has 3 ranks max.
- Each rank adds the same per-rank stat amount (linear stacking):
  e.g., Deathly Rage R1 line "Add 2% CA per rank" -> +6% at rank 3.
- Cost increases per boon position: 3, 6, 9, 12, 15, 18, 21, 24
  (the cost is the TOTAL to fully rank that boon — "Varying Cost"
  in the UI). Total to fully rank all 8 = 108 pts.
- Triggers vary: Chance on kill / Chance on encounter use / etc.
- Master pts come out of the same campaign budget; not all 8 can be
  fully ranked at once (n00b confirmed by toggling ranks during data
  collection).
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PATH = ROOT / "data" / "campaign_boons.json"

MASTER_BOONS = [
    {
        "id": 1,
        "name": "Deathly Rage",
        "trigger": "Chance on kill",
        "duration": 10,
        "totalCost": 3,
        "maxRanks": 3,
        "perRankEffects": [
            {"stat": "Combat Advantage",  "amount": 2, "type": "percent"},
            {"stat": "Power",             "amount": 2, "type": "percent"},
            {"stat": "Critical Severity", "amount": 2, "type": "percent"},
        ],
        "notes": "Verified from screenshot 2026-05-08."
    },
    {
        "id": 2,
        "name": "Death's Bulwark",
        "trigger": "Chance on kill",
        "duration": 10,
        "totalCost": 6,
        "maxRanks": 3,
        "perRankEffects": [
            {"stat": "Defense",            "amount": 2, "type": "percent"},
            {"stat": "Critical Avoidance", "amount": 2, "type": "percent"},
            {"stat": "Maximum Hit Points", "amount": 2, "type": "percent",
             "label": "Temp HP equal to 2% of max HP per rank"},
        ],
        "notes": "Verified from screenshot 2026-05-08. R3 grants temp HP based on max HP."
    },
    {
        "id": 3,
        "name": "Blood Lust",
        "trigger": "Chance on encounter use",
        "duration": 10,
        "totalCost": 9,
        "maxRanks": 3,
        "perRankEffects": [
            {"stat": "Defense",          "amount": -1, "type": "percent",
             "scope": "enemy",
             "label": "Decrease target's Defense by 1% per rank for 10s"},
            {"stat": "magnitude",        "amount": 10, "type": "flat",
             "label": "Additional 120-magnitude attack +10 mag per rank"},
            {"stat": "Action Point Gain","amount": 0.5, "type": "percent",
             "label": "+0.5% AP Gain per rank for 10s"},
        ],
        "notes": "Verified from screenshot 2026-05-08."
    },
    {
        "id": 4,
        "name": "Focused Retaliation",
        "trigger": "Chance on encounter use",
        "duration": 15,
        "totalCost": 12,
        "maxRanks": 3,
        "perRankEffects": [
            {"stat": "Control Resist",   "amount": 2, "type": "percent"},
            {"stat": "Deflect",          "amount": 2, "type": "percent"},
            {"stat": "Deflect Severity", "amount": 2, "type": "percent"},
        ],
        "notes": "Verified from screenshot 2026-05-08."
    },
    {
        "id": 5,
        "name": "Life Lessons",
        "trigger": "Chance on At-Will use when health is below 30%",
        "duration": 10,
        "totalCost": 15,
        "maxRanks": 3,
        "perRankEffects": [
            {"stat": "magnitude", "amount": 50, "type": "flat",
             "label": "+50 magnitude damage to your attack per rank"},
            {"stat": "magnitude", "amount": 50, "type": "flat",
             "label": "+50 magnitude effect to your target per rank"},
            {"stat": "heal_pct_damage", "amount": 15, "type": "percent",
             "label": "Return 15% of damage done as a heal over time per rank"},
        ],
        "notes": "Verified from screenshot 2026-05-08 092027/092031. R3 wording does not literally say 'per rank' but follows the master-tier pattern; flag for in-game retest if R1-only behavior differs."
    },
    {
        "id": 6,
        "name": "Enhanced Application",
        "trigger": "Chance on encounter use",
        "duration": 10,
        "totalCost": 18,
        "maxRanks": 3,
        "perRankEffects": [
            {"stat": "Maximum Hit Points", "amount": 5, "type": "percent",
             "label": "Heal you for 5% of Maximum Hit Points per rank"},
            {"stat": "Maximum Hit Points", "amount": 5, "type": "percent",
             "label": "HoT for 5% of Maximum Hit Points per rank"},
            {"stat": "damage_taken",       "amount": -15, "type": "percent",
             "label": "Reduces damage of next 1 attack taken by 15% per rank"},
        ],
        "notes": "Verified from screenshot 2026-05-08 092035. Trigger inferred from earlier data — recheck wording on a follow-up screenshot if precise trigger needed for tooltip."
    },
    {
        "id": 7,
        "name": "Blessed Advantage",
        "trigger": "Chance on heal for at least 10% of the target's Health",
        "duration": 10,
        "totalCost": 21,
        "maxRanks": 3,
        "perRankEffects": [
            {"stat": "Maximum Hit Points", "amount": 5, "type": "percent",
             "label": "Apply HoT for 5% of Maximum Hit Points per rank"},
            {"stat": "Power",              "amount": 5, "type": "percent",
             "label": "+5% Power per rank"},
            {"stat": "Recharge Speed",     "amount": 5, "type": "percent",
             "label": "Reduce recharge of abilities by 5% per rank"},
        ],
        "notes": "Verified from screenshot 2026-05-08 092048."
    },
    {
        "id": 8,
        "name": "Blessed Resilience",
        "trigger": "Chance on heal for at least 10% of the target's Health",
        "duration": 10,
        "totalCost": 24,
        "maxRanks": 3,
        "perRankEffects": [
            {"stat": "Defense",            "amount": 2, "type": "percent",
             "label": "+2% Defense per rank"},
            {"stat": "Maximum Hit Points", "amount": 2, "type": "percent",
             "label": "+2% Maximum Hit Points per rank"},
            {"stat": "Stamina",            "amount": 2, "type": "percent",
             "label": "Restore Stamina by 4% +2% per rank (verify base value in-game)"},
        ],
        "notes": "Partial verification from screenshot 2026-05-08 092048. R3 wording on Stamina restore was hard to read at full resolution — recommend re-screenshot for the exact stamina-restore formula."
    },
]


def main():
    data = json.loads(PATH.read_text(encoding="utf-8"))
    data["master"] = MASTER_BOONS

    rules = data.get("rules", {})
    rules["master"] = {
        "description": "Master tier: 8 unique boons, 3 ranks each, varying total cost (3/6/9/12/15/18/21/24). Per-rank effects stack linearly. Total cost to fully rank all 8: 108 pts.",
        "perRankStacks": True,
        "costSchedule": [3, 6, 9, 12, 15, 18, 21, 24],
        "totalCostToFullyRankAll": 108,
    }
    data["rules"] = rules

    PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    fully_verified = sum(1 for b in MASTER_BOONS if b["perRankEffects"])
    print(f"Wrote {len(MASTER_BOONS)} Master tier boons.")
    print(f"  With per-rank effects encoded: {fully_verified}")


if __name__ == "__main__":
    main()
