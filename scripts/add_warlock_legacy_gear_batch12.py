"""Legacy Warlock gear batch 12 — Runed Apprentice Armor + Protégé Set."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/gear.json")
data = json.loads(PATH.read_text(encoding="utf-8"))
max_id = max((i.get('id', 0) for i in data), default=0)

INTAKE = "Legacy Warlock gear collection screenshot intake 2026-05-13."

def add(name, slot, il, rs, cr, source, set_name=None, set_size=None,
        allowed=None, equip=None, ps=None, ab=None, notes=None):
    global max_id
    max_id += 1
    entry = {
        "id": max_id, "name": name, "slot": slot, "item_level": il,
        "ratingStats": rs, "combinedRating": cr,
        "equipBonuses": equip or [], "set": set_name or "",
        "setSize": set_size or 0, "source": source,
        "percentStats": ps or {}, "abilityBonuses": ab or {},
        "notes": notes or INTAKE
    }
    if allowed:
        entry["allowedClasses"] = allowed
    data.append(entry)

# Runed Apprentice Armor — IL 965, Lair of the Mad Mage Advanced
src = "Lair of the Mad Mage (Advanced)"
sn = "Runed Apprentice Armor"

add("Apprentice's Runed Cuisses", "Feet", 965, {"Critical Strike": 362, "Defense": 724, "Critical Avoidance": 362}, 868, src, sn, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Death Defier's Advantage", "description": "Gain 250 Combat Advantage for each enemy you are engaged in battle. (Max of 15 targets)"}])
add("Apprentice's Runed Shoes", "Feet", 965, {"Combat Advantage": 290, "Critical Strike": 434, "Defense": 724}, 868, src, sn, 4, ["Wizard", "Warlock"],
    [{"name": "Death Defier's Advantage", "description": "Gain 250 Combat Advantage for each enemy you are engaged in battle. (Max of 15 targets)"}])
add("Apprentice's Runed Scalemail", "Armor", 965, {"Defense": 724, "Deflection": 724}, 868, src, sn, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Warden's Defense", "description": "Whenever you are damaged for more than 10% of your Maximum Hit Points in a single blow, you gain 5% Defense for 10 seconds."}])
add("Apprentice's Runed Robe", "Armor", 965, {"Critical Severity": 724, "Defense": 724}, 868, src, sn, 4, ["Wizard", "Warlock"],
    [{"name": "Warden's Defense", "description": "Whenever you are damaged for more than 10% of your Maximum Hit Points in a single blow, you gain 5% Defense for 10 seconds."}])
add("Apprentice's Runed Braces", "Arms", 965, {"Critical Strike": 362, "Defense": 724, "Deflection": 362}, 868, src, sn, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Leader's Might", "description": "Gain 250 Power for each player in your team."}])
add("Apprentice's Runed Cowl", "Head", 965, {"Combat Advantage": 290, "Critical Strike": 434, "Defense": 724}, 868, src, sn, 4, ["Wizard", "Warlock"],
    [{"name": "Undermountain Hunter", "description": "+5% Damage in the Undermountain."}])
add("Apprentice's Runed Coif", "Head", 965, {"Critical Strike": 507, "Defense": 724, "Critical Avoidance": 217}, 868, src, sn, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Undermountain Hunter", "description": "+5% Damage in the Undermountain."}])

# Decaying relic versions (Apprentice's Runed) — IL 690, restorable, no level requirement
src_relic = "Expeditions (Undermountain)"
add("Apprentice's Ruined Wristguard", "Arms", 690, {}, 0, src_relic, sn, 4, ["Wizard", "Warlock"],
    notes="A decaying armor that must undergo relic restoration before it may be equipped. " + INTAKE)
add("Apprentice's Ruined Braces", "Arms", 690, {}, 0, src_relic, sn, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    notes="A decaying armor that must undergo relic restoration before it may be equipped. " + INTAKE)
add("Apprentice's Ruined Robe", "Armor", 690, {}, 0, src_relic, sn, 4, ["Wizard", "Warlock"],
    notes="A decaying armor that must undergo relic restoration before it may be equipped. " + INTAKE)
add("Apprentice's Ruined Coif", "Head", 690, {}, 0, src_relic, sn, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    notes="A decaying armor that must undergo relic restoration before it may be equipped. " + INTAKE)
add("Apprentice's Ruined Cowl", "Head", 690, {}, 0, src_relic, sn, 4, ["Wizard", "Warlock"],
    notes="A decaying armor that must undergo relic restoration before it may be equipped. " + INTAKE)
add("Apprentice's Ruined Cuisses", "Feet", 690, {}, 0, src_relic, sn, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    notes="A decaying armor that must undergo relic restoration before it may be equipped. " + INTAKE)
add("Apprentice's Ruined Shoes", "Feet", 690, {}, 0, src_relic, sn, 4, ["Wizard", "Warlock"],
    notes="A decaying armor that must undergo relic restoration before it may be equipped. " + INTAKE)
add("Apprentice's Ruined Scalemail", "Armor", 690, {}, 0, src_relic, sn, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    notes="A decaying armor that must undergo relic restoration before it may be equipped. " + INTAKE)

# Protégé Set — IL 980, Lair of the Mad Mage Epic Dungeon
src_p = "Undermountain Seals Store"
sn_p = "Protégé Set"
add("Protégé's Chained Robe", "Armor", 980, {"Defense": 735, "Deflection": 735}, 882, src_p, sn_p, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Warden's Defense", "description": "Whenever you are damaged for more than 10% of your Maximum Hit Points in a single blow, you gain 5% Defense for 10 seconds."}])

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
