#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
WORKING = ROOT / "gear_batch1_items.json"

NEW_ITEMS = [
    # Paladin Blood Bargain set — lower tier (IL 3800, no Lesser/Greater suffix)
    {"name": "Ebon Crusader's Ward", "slot": "Off Hand", "subSlot": "Shield", "item_level": 3800, "allowedClasses": ["Paladin"], "ratingStats": {"Critical Strike": 3762, "Awareness": 2052}, "combinedRating": 3420, "equipBonuses": [{"name": "Blood Bargain Equip", "description": "Whenever you are struck by a Critical Strike, you have a 10% chance to increase your Critical Avoidance by 10% and gain 5% Power for 10 seconds."}], "set": "Blood Bargain", "setSize": 2, "setBonus": "While in Thay, your Movement Speed is increased by 10%.", "setPartners": ["Oathbound Judgment"], "notes": "Heavy, Off-Hand, Shield"},
    {"name": "Oathbound Judgment", "slot": "Main Hand", "subSlot": "Blade", "item_level": 3800, "allowedClasses": ["Paladin"], "weaponDamage": 50, "ratingStats": {"Awareness": 2508, "Forte": 2308}, "combinedRating": 3420, "equipBonuses": [{"name": "Blood Bargain Equip", "description": "Whenever you are struck by a Critical Strike, you have a 10% chance to increase your Critical Avoidance by 10% and gain 5% Power for 10 seconds."}], "set": "Blood Bargain", "setSize": 2, "setBonus": "While in Thay, your Movement Speed is increased by 10%.", "setPartners": ["Ebon Crusader's Ward"], "notes": "Blade, Weapon"},

    # Bloodwoven-tier clothing — lower tier (IL 3000)
    {"name": "Runes of the Avowed", "slot": "Pants", "item_level": 3000, "ratingStats": {"Combat Advantage": 1080, "Forte": 1215, "Incoming Healing": 2160}, "percentStats": {"Action Point Gain": 1.5}, "combinedRating": 2700, "equipBonuses": [{"name": "Challenger's Resilience", "description": "When in combat with 3 or more enemies, your Incoming Damage is decreased by 0.125% every 2 seconds. Every 2 seconds you are in combat with 1 or fewer enemies, lose 1 stack. Max Stacks: 10 — -1.25% Incoming Damage."}], "set": "Enchanted Awareness", "setSize": 2},
]


def main():
    items = json.loads(WORKING.read_text(encoding="utf-8"))
    existing_names = {it["name"] for it in items}
    added = 0
    for new in NEW_ITEMS:
        if new["name"] in existing_names:
            continue
        items.append(new)
        existing_names.add(new["name"])
        added += 1
    WORKING.write_text(json.dumps(items, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Appended {added} new items. Working file now has {len(items)} total.")


if __name__ == "__main__":
    main()
