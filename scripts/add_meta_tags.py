#!/usr/bin/env python3
"""Add favicon link, meta description, and Open Graph tags to all HTML pages.

Inserts new tags right after the existing <title> tag on each page.
Idempotent — skips pages that already have a <meta name="description">.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Site name (used in og:title)
SITE = "Neverwinter Compendium"

# Per-page meta descriptions
PAGES = {
    "index.html": (
        "Neverwinter Compendium",
        "Searchable databases for companions, mounts, artifacts, consumables, "
        "and game mechanics for Neverwinter PS5 players."
    ),
    "companions.html": (
        "Companions — " + SITE,
        "Browse all Neverwinter companions with stats, powers, enhancements, "
        "summoned buffs, and damage rankings."
    ),
    "mounts.html": (
        "Mounts — " + SITE,
        "Browse all Neverwinter mounts with combat/equip powers, insignia slots, "
        "set bonuses, the Insignias reference, and a Stable Planner for cross-loadout sharing."
    ),
    "artifacts.html": (
        "Artifacts — " + SITE,
        "All Neverwinter artifacts with item levels, stats, set bonuses, sources, "
        "and combat power details."
    ),
    "consumables.html": (
        "Consumables — " + SITE,
        "Filterable Neverwinter consumables and buffs with duration, slot category, "
        "and stat effects."
    ),
    "mekaniks.html": (
        "Mekaniks — " + SITE,
        "Neverwinter game mechanics: stat reference with caps, damage / healing / EHP "
        "formulas, ability scores, stat priorities by role, bolster, scaling, stacking, "
        "and dungeon guides."
    ),
    "professions.html": (
        "Professions — " + SITE,
        "Neverwinter professions and crafting guide including masterworks."
    ),
    "campaign-boosters.html": (
        "Campaign Boosters — " + SITE,
        "Companions and items that boost Neverwinter campaign currencies, with sources."
    ),
    "patchnotes.html": (
        "Patch Notes — " + SITE,
        "Latest Neverwinter patch notes auto-fetched from the Arc Games API."
    ),
    "reports.html": (
        "Reports — " + SITE,
        "Community bug reports and data verification for the Neverwinter Compendium."
    ),
    "creators-tools.html": (
        "Creators & Tools — " + SITE,
        "Friends and community members making Neverwinter content, tools, and resources."
    ),
    "insignia-priority.html": (
        "Celestial Insignia Tracker — " + SITE,
        "Track every non-Celestial-Account-Bound insignia across your Neverwinter "
        "roster and prioritize upgrades for maximum payoff."
    ),
    "preview.html": (
        "Mod 33 Preview — " + SITE,
        "Mod 33 preview content for Neverwinter — upcoming companions, mounts, "
        "and Warlock gear."
    ),
}


def build_meta_block(og_title: str, description: str) -> str:
    # Escape any quotes in description (shouldn't occur but be safe)
    desc_safe = description.replace('"', "&quot;")
    title_safe = og_title.replace('"', "&quot;")
    return (
        f'  <meta name="description" content="{desc_safe}">\n'
        f'  <meta property="og:title" content="{title_safe}">\n'
        f'  <meta property="og:description" content="{desc_safe}">\n'
        f'  <meta property="og:type" content="website">\n'
        f'  <link rel="icon" type="image/svg+xml" href="favicon.svg">\n'
    )


def main():
    title_re = re.compile(r"(<title>[^<]*</title>\s*\n)", re.IGNORECASE)
    updated, skipped, missing = [], [], []

    for fname, (og_title, description) in PAGES.items():
        path = ROOT / fname
        if not path.exists():
            missing.append(fname)
            continue

        text = path.read_text(encoding="utf-8")

        # Skip if already has meta description
        if 'name="description"' in text:
            skipped.append(fname)
            continue

        block = build_meta_block(og_title, description)
        new_text, n = title_re.subn(r"\1" + block, text, count=1)
        if n == 0:
            print(f"  WARN: <title> not found in {fname}, skipping")
            skipped.append(fname)
            continue

        path.write_text(new_text, encoding="utf-8")
        updated.append(fname)

    print(f"Updated {len(updated)} pages:")
    for f in updated: print(f"  + {f}")
    if skipped:
        print(f"\nSkipped {len(skipped)} (already had meta or no <title>):")
        for f in skipped: print(f"  - {f}")
    if missing:
        print(f"\nMissing files ({len(missing)}):")
        for f in missing: print(f"  ! {f}")


if __name__ == "__main__":
    main()
