#!/usr/bin/env python3
"""Archive the 46 Barbarian/Blademaster power screenshots out of the capture inbox
into the project, renamed by the item each one shows (extracted & verified
2026-06-09). Frees the inbox folder for the next capture batch.
  python archive_barbarian_shots.py            # dry-run (shows the renames)
  python archive_barbarian_shots.py --apply    # move + rename
"""
import re, shutil, sys
from pathlib import Path

SRC = Path("C:/Users/N00Bin/OneDrive/Pictures/Screenshots/New folder")
DST = Path("G:/ai_projects/nwcb/website/docs/screenshots/barbarian")
APPLY = "--apply" in sys.argv
DATE = "2026-06-09"

# (HHMMSS timestamp, naming-category, item name) — from the verified extraction
MAP = [
    ("053740", "atwill", "Bounding Slam"), ("053743", "atwill", "Sure Strike"),
    ("053745", "atwill", "Relentless Slash"), ("053747", "atwill", "Brash Strike"),
    ("053750", "encounter", "Not So Fast"), ("053752", "encounter", "Bloodletter"),
    ("053754", "encounter", "Mighty Leap"), ("053756", "encounter", "Indomitable Battle Strike"),
    ("053758", "encounter", "Punishing Charge"), ("053800", "encounter", "Hidden Daggers"),
    ("053801", "encounter", "Roar"), ("053803", "encounter", "Frenzy"),
    ("053805", "encounter", "Battle Fury"), ("053807", "encounter", "Axestorm"),
    ("053809", "daily", "Savage Advance"), ("053811", "daily", "Spinning Strike"),
    ("053813", "daily", "Crescendo"), ("053814", "daily", "Avalanche of Steel"),
    ("053816", "daily", "Adamantine Strike"), ("053818", "mechanic", "Sprint"),
    ("053820", "mechanic", "Battlerage"), ("053822", "mechanic", "Forte"),
    ("053825", "feature", "Bravery"), ("053826", "feature", "Steady Rage"),
    ("053828", "feature", "Trample the Fallen"), ("053830", "feature", "Mighty Vitality"),
    ("053832", "feature", "Steel Blitz"), ("053834", "feature", "Barbed Strikes"),
    ("053835", "feature", "Raging Strikes"), ("053837", "feature", "Impatience"),
    ("053839", "feat", "Relentless Speed"), ("053841", "feat", "Bloodspiller"),
    ("053843", "feat", "Overpenetration"), ("053845", "feat", "Steel Slam"),
    ("053847", "feat", "Relentless Battlerage"), ("053851", "feat", "Mightier Leap"),
    ("053853", "feat", "Indomitable Rage"), ("053855", "feat", "Brutal Critical"),
    ("053857", "feat", "Unstoppable Spin"), ("053858", "feat", "Escalating Rage"),
    ("053917", "skill", "Dungeoneering"), ("053919", "skill", "Persistent Rage"),
    ("053921", "skill", "Marathon Runner"), ("053923", "skill", "Raging Criticals"),
    ("053938", "species", "Dragonborn Fury"), ("053940", "species", "Metallic Ancestry"),
]

def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

DST.mkdir(parents=True, exist_ok=True)
moved, missing = 0, []
for ts, cat, name in MAP:
    src = SRC / f"Screenshot {DATE} {ts}.png"
    dst = DST / f"barbarian_{cat}_{slug(name)}_{DATE}.png"
    if not src.exists():
        missing.append(src.name)
        continue
    if APPLY:
        shutil.move(str(src), str(dst))
    moved += 1
    print(("MOVED " if APPLY else "WOULD MOVE ") + src.name + "  ->  " + dst.name)

print(f"\n{moved}/{len(MAP)} mapped. missing: {missing}")
if SRC.exists():
    leftover = [p.name for p in SRC.iterdir() if p.is_file()]
    print("leftover in inbox:", len(leftover), leftover[:8])
