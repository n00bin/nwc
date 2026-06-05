#!/usr/bin/env python3
"""Bulk-update mount source fields for the high+medium confidence batch.

Per the polish pass, n00b approved Option A: write 50+ entries based on
training-data knowledge. Low-confidence (🔴) mounts stay empty.
"""
import json
from pathlib import Path

JSON_PATH = Path(__file__).resolve().parents[2] / "data" / "mounts.json"

# Mount name -> source string. All values 🟢 (HIGH) or 🟡 (MEDIUM) confidence.
# Per CLAUDE.md "needs verification" applies — these are best-effort recalls.
UPDATES = {
    # Starter race/class horses (5)
    "Appaloosa Horse":          "Race/Class starter horse (Common, vendor)",
    "Black Horse":              "Race/Class starter horse (Common, vendor)",
    "Black Stallion":           "Race/Class starter horse (Common, vendor)",
    "Sabino Horse":             "Race/Class starter horse (Common, vendor)",
    "White Horse":              "Race/Class starter horse (Common, vendor)",

    # Medium-tier race horses (Trade Bar Store) (7)
    "Medium Adventurer's Horse": "Trade Bar Store",
    "Medium Black Horse":        "Trade Bar Store",
    "Medium Pharaoh Steed":      "Trade Bar Store / event",
    "Medium Snowswift Steed":    "Trade Bar Store / Winter Festival",
    "Medium Tiger":              "Trade Bar Store",
    "Medium Waterdeep Horse":    "Trade Bar Store",
    "Medium Worg":               "Trade Bar Store",

    # Event mounts — HIGH confidence (8)
    "Crimson Crystal Horse":    "Protector's Jubilee 12-yr anniversary event",
    "Jubilee Parade Horse":     "Protector's Jubilee anniversary event",
    "Jubilee Unicorn":          "Protector's Jubilee anniversary event",
    "Eclipse Lion":             "Lunar New Year event",
    "Neo Eclipse Lion":         "Lunar New Year event (Mythic upgrade)",
    "Lunar New Year's Dragonnel": "Lunar New Year event",
    "Rothe Traveler":           "Simril's Winter Festival",
    "Protective Pink Yeti":     "Hugs and Kisses Valentine's event (Feb 2024)",

    # Event mounts — MEDIUM confidence (10)
    "Maltese Tiger":            "Lunar New Year event (needs verification)",
    "Swift Golden Lion":        "Lunar New Year event (needs verification)",
    "White Tiger":              "Lunar New Year event (needs verification)",
    "Witch's Broom":            "Liar's Night Halloween event (needs verification)",
    "Reanimated Chariot":       "Liar's Night Halloween event (needs verification)",
    "Reanimated Destrier":      "Liar's Night Halloween event (needs verification)",
    "Decaying Stag":            "Liar's Night Halloween event (needs verification)",
    "Enchanted Broom":          "Liar's Night Halloween event (needs verification)",
    "Mechanical Goose":         "Wonders of Gond event (needs verification)",
    "Confetti Machination":     "Anniversary / Jubilee event (needs verification)",

    # Campaign / module rewards — HIGH confidence (7)
    "Black Ice Warhorse":       "Icewind Dale campaign (Mod 3 Curse of Icewind Dale)",
    "Triceratops":              "Tomb of Annihilation (Chult campaign)",
    "Bigby's Hand":             "Hells / Avernus campaign (Mod 23)",
    "Phantom Panther":          "Phantasmal Fantasy Lockbox (Jul 2025)",
    "Space Guppy School":       "Spelljammer Adventure (Mod 27)",
    "Giant Space Hamster":      "Spelljammer Adventure (Mod 27)",
    "Gas Spore":                "Astral Lockbox (Mod 26+)",

    # Campaign / module rewards — MEDIUM confidence (~26)
    "Polar Siege Bear":         "Icewind Dale campaign (needs verification)",
    "Savage Polar Bear":        "Icewind Dale campaign (needs verification)",
    "Crag Cat":                 "Icewind Dale region (needs verification)",
    "Glacier Prowler":          "Icewind Dale region (needs verification)",
    "Axe Beak":                 "Tomb of Annihilation (Chult, needs verification)",
    "Demon Wings":              "Hells / Avernus campaign (needs verification)",
    "Demonic Gravehound":       "Hells / Avernus campaign (needs verification)",
    "Hell Emblazon Worg":       "Hells / Avernus campaign (needs verification)",
    "Golden Warhorse":          "Tyranny of Dragons era (needs verification)",
    "Golden Rage Drake":        "Tyranny of Dragons era (needs verification)",
    "Guard Drake":              "Tyranny of Dragons era (needs verification)",
    "Red Dragon":               "Tyranny of Dragons era (needs verification)",
    "Red Dragon Wings":         "Tyranny of Dragons era (needs verification)",
    "Gold Dragon Wings":        "Rise of Tiamat / TOD era (needs verification)",
    "Bulette":                  "Underdark campaign (needs verification)",
    "Umber Hulk":               "Underdark / lockbox (needs verification)",
    "Brain Stealer Dragon":     "Underdark / Mind Flayer themed lockbox (needs verification)",
    "Sylvan Stag":              "Sharandar / Feywild (needs verification)",
    "Silverleaf Sled":          "Sharandar / Feywild (needs verification)",
    "Autumn Stag":              "Sharandar / Feywild (needs verification)",
    "Dusk Unicorn":             "Sharandar campaign (needs verification)",
    "Skyhold Alligator":        "Skyhold Adventures (needs verification)",
    "Skyhold Throne":           "Skyhold Adventures (needs verification)",
    "Slab of Vecna":            "Vecna's Lair campaign (needs verification)",
    "Toothsome":                "Northdark / Astral Lockbox Mod 26+ (needs verification)",
    "Tenser's Floating Disk":   "Astral Lockbox / Wizard pack (needs verification)",
    "Divine Wings":             "Redeemed Citadel campaign Mod 19 (needs verification)",
}


def main():
    with open(JSON_PATH, encoding="utf-8") as f:
        mounts = json.load(f)

    by_name = {m["name"]: m for m in mounts}

    updated, missing, skipped = [], [], []
    for name, source in UPDATES.items():
        m = by_name.get(name)
        if m is None:
            missing.append(name)
            continue
        existing = m.get("source", "").strip()
        if existing:
            skipped.append((name, existing))
            continue
        m["source"] = source
        updated.append(name)

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(mounts, f, indent=2, ensure_ascii=False)

    print(f"Updated {len(updated)} mounts.")
    if missing:
        print(f"\nMissing in JSON ({len(missing)}):")
        for n in missing: print(f"  - {n}")
    if skipped:
        print(f"\nSkipped (already had source) ({len(skipped)}):")
        for n, s in skipped: print(f"  - {n!r} -> {s!r}")


if __name__ == "__main__":
    main()
