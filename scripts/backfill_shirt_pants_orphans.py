"""Backfill all 29 Shirt/Pants orphans:
- 4 Dragonflight Shirts -> source from existing siblings (Stronghold Guild Marketplace)
- 25 Avernus Conduits (Negotiator/Interrogator/Pact Brands) -> Avernus Campaign Leveling set
"""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

DRAGONFLIGHT_IDS = {2402, 2403, 2404, 2405}
NEGOTIATOR_PANTS = {1479, 1480, 1481, 1482, 1483}
INTERROGATOR_SHIRTS = {1469, 1470, 1471, 1472, 1473}
INTERROGATOR_PANTS = {1484, 1485, 1486, 1487, 1488}
UPPER_PACT_BRANDS = {1474, 1475, 1476, 1477, 1478}
LOWER_PACT_BRANDS = {1489, 1490, 1491, 1492, 1493}

DRAGONFLIGHT_NOTE = "Source classified 2026-05-17 from sibling Dragonflight Shirt entries (Stronghold Guild Marketplace Rank 3); n00b ack. Set name still unknown."
AVERNUS_NOTE = "Backfilled 2026-05-17 as Avernus campaign leveling Conduit (educated guess from naming pattern + IL tier 1225-1325 spanning Uncommon-Mythic); n00b ack. Set name to be verified in-game when convenient."

count = 0
for it in data:
    iid = it["id"]
    if iid in DRAGONFLIGHT_IDS:
        it["source"] = "Stronghold Guild Marketplace (Rank 3)"
        it["notes"] = DRAGONFLIGHT_NOTE
        count += 1
        print(f"  Dragonflight: id={iid:>5}  {it.get('name')!r}")
    elif iid in (NEGOTIATOR_PANTS | INTERROGATOR_SHIRTS | INTERROGATOR_PANTS):
        it["set"] = "Avernus Campaign Leveling Armor"
        it["setSize"] = 2
        it["source"] = "Avernus Campaign"
        it["notes"] = AVERNUS_NOTE
        count += 1
        print(f"  Negotiator/Interrogator: id={iid:>5}  {it.get('name')!r}")
    elif iid in (UPPER_PACT_BRANDS | LOWER_PACT_BRANDS):
        it["set"] = "Avernus Campaign Leveling Conduits"
        it["setSize"] = 2
        it["source"] = "Avernus Campaign"
        it["notes"] = AVERNUS_NOTE
        count += 1
        print(f"  Pact Brands: id={iid:>5}  {it.get('name')!r}")

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"\nBackfilled {count} entries. Total items: {len(data)}.")
