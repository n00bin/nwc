"""Legacy Warlock gear batch 13 — Protégé + Spy's Guild + Dungeon Raider + Antiquities."""
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

# Protégé Set continued — IL 980
src = "Undermountain Seals Store"
sn = "Protégé Set"
add("Protégé's Layered Boots", "Feet", 980, {"Combat Advantage": 294, "Critical Strike": 441, "Defense": 735}, 882, src, sn, 4, ["Wizard", "Warlock"],
    [{"name": "Death Defier's Advantage", "description": "Gain 250 Combat Advantage for each enemy you are engaged in battle. (Max of 15 targets)"}])
add("Protégé's Trimmed Gaiters", "Feet", 980, {"Critical Strike": 368, "Defense": 735, "Critical Avoidance": 368}, 882, src, sn, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Death Defier's Advantage", "description": "Gain 250 Combat Advantage for each enemy you are engaged in battle. (Max of 15 targets)"}])
add("Protégé's Charmed Hat", "Head", 980, {"Combat Advantage": 294, "Critical Strike": 441, "Defense": 735}, 882, src, sn, 4, ["Wizard", "Warlock"],
    [{"name": "Undermountain Hunter", "description": "+5% Damage in the Undermountain."}])
add("Protégé's Crowned Coif", "Head", 980, {"Critical Strike": 514, "Defense": 735, "Critical Avoidance": 221}, 882, src, sn, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Undermountain Hunter", "description": "+5% Damage in the Undermountain."}])
add("Protégé's Mantled Robes", "Armor", 980, {"Critical Severity": 735, "Defense": 735}, 882, src, sn, 4, ["Wizard", "Warlock"],
    [{"name": "Warden's Defense", "description": "Whenever you are damaged for more than 10% of your Maximum Hit Points in a single blow, you gain 5% Defense for 10 seconds."}])
add("Protégé's Trimmed Gloves", "Arms", 980, {"Critical Strike": 368, "Defense": 735, "Deflection": 368}, 882, src, sn, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Leader's Might", "description": "Gain 250 Power for each player in your team."}])
add("Protégé's Charmed Gloves", "Arms", 980, {"Accuracy": 294, "Critical Severity": 441, "Defense": 735}, 882, src, sn, 4, ["Wizard", "Warlock"],
    [{"name": "Leader's Might", "description": "Gain 250 Power for each player in your team."}])

# Spy's Guild Armor — IL 940
sn2 = "Spy's Guild Armor"
add("Wristguard of the Spy's Guild", "Arms", 940, {"Accuracy": 282, "Critical Severity": 423, "Defense": 705}, 846, src, sn2, 4, ["Wizard", "Warlock"],
    [{"name": "Leader's Might", "description": "Gain 250 Power for each player in your team."}])
add("Braces of the Spy's Guild", "Arms", 940, {"Critical Strike": 352, "Defense": 705, "Deflection": 352}, 846, src, sn2, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Leader's Might", "description": "Gain 250 Power for each player in your team."}])
add("Robes of the Spy's Guild", "Armor", 940, {"Critical Severity": 705, "Defense": 705}, 846, src, sn2, 4, ["Wizard", "Warlock"],
    [{"name": "Warden's Defense", "description": "Whenever you are damaged for more than 10% of your Maximum Hit Points in a single blow, you gain 5% Defense for 10 seconds."}])
add("Scalemail of the Spy's Guild", "Armor", 940, {"Defense": 705, "Deflection": 705}, 846, src, sn2, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Warden's Defense", "description": "Whenever you are damaged for more than 10% of your Maximum Hit Points in a single blow, you gain 5% Defense for 10 seconds."}])
add("Coif of the Spy's Guild", "Head", 940, {"Critical Strike": 494, "Defense": 705, "Critical Avoidance": 212}, 846, src, sn2, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Undermountain Hunter", "description": "+5% Damage in the Undermountain."}])
add("Cowl of the Spy's Guild", "Head", 940, {"Combat Advantage": 282, "Critical Strike": 423, "Defense": 705}, 846, src, sn2, 4, ["Wizard", "Warlock"],
    [{"name": "Undermountain Hunter", "description": "+5% Damage in the Undermountain."}])
add("Cuisses of the Spy's Guild", "Feet", 940, {"Critical Strike": 352, "Defense": 705, "Critical Avoidance": 352}, 846, src, sn2, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Death Defier's Advantage", "description": "Gain 250 Combat Advantage for each enemy you are engaged in battle. (Max of 15 targets)"}])
add("Shoes of the Spy's Guild", "Feet", 940, {"Combat Advantage": 282, "Critical Strike": 423, "Defense": 705}, 846, src, sn2, 4, ["Wizard", "Warlock"],
    [{"name": "Death Defier's Advantage", "description": "Gain 250 Combat Advantage for each enemy you are engaged in battle. (Max of 15 targets)"}])

# Armor of the Dungeon Raider — IL 940, Zen Market (Trade Bar Store)
src3 = "Zen Market / Trade Bar Store"
sn3 = "Armor of the Dungeon Raider"
add("Dungeon Raider's Coif", "Head", 940, {"Critical Strike": 494, "Defense": 705, "Critical Avoidance": 212}, 846, src3, sn3, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Undermountain Hunter", "description": "+5% Damage in the Undermountain."}])
add("Dungeon Raider's Cowl", "Head", 940, {"Combat Advantage": 282, "Critical Strike": 423, "Defense": 705}, 846, src3, sn3, 4, ["Wizard", "Warlock"],
    [{"name": "Undermountain Hunter", "description": "+5% Damage in the Undermountain."}])
add("Dungeon Raider's Cuisses", "Feet", 940, {"Critical Strike": 352, "Defense": 705, "Critical Avoidance": 352}, 846, src3, sn3, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Death Defier's Advantage", "description": "Gain 250 Combat Advantage for each enemy you are engaged in battle. (Max of 15 targets)"}])
add("Dungeon Raider's Shoes", "Feet", 940, {"Combat Advantage": 282, "Critical Strike": 423, "Defense": 705}, 846, src3, sn3, 4, ["Wizard", "Warlock"],
    [{"name": "Death Defier's Advantage", "description": "Gain 250 Combat Advantage for each enemy you are engaged in battle. (Max of 15 targets)"}])
add("Dungeon Raider's Scalemail", "Armor", 940, {"Defense": 705, "Deflection": 705}, 846, src3, sn3, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Warden's Defense", "description": "Whenever you are damaged for more than 10% of your Maximum Hit Points in a single blow, you gain 5% Defense for 10 seconds."}])
add("Dungeon Raider's Robe", "Armor", 940, {"Critical Severity": 705, "Defense": 705}, 846, src3, sn3, 4, ["Wizard", "Warlock"],
    [{"name": "Warden's Defense", "description": "Whenever you are damaged for more than 10% of your Maximum Hit Points in a single blow, you gain 5% Defense for 10 seconds."}])
add("Dungeon Raider's Wristguard", "Arms", 940, {"Accuracy": 282, "Critical Severity": 423, "Defense": 705}, 846, src3, sn3, 4, ["Wizard", "Warlock"],
    [{"name": "Leader's Might", "description": "Gain 250 Power for each player in your team."}])
add("Dungeon Raider's Braces", "Arms", 940, {"Critical Strike": 352, "Defense": 705, "Deflection": 352}, 846, src3, sn3, 4, ["Bard", "Warlock", "Paladin", "Cleric"],
    [{"name": "Leader's Might", "description": "Gain 250 Power for each player in your team."}])

# Antiquities of Undermountain — Tempter of the Twilight's Hat (IL 1000)
add("Tempter of the Twilight's Hat", "Head", 1000, {"Accuracy": 300, "Critical Severity": 450, "Defense": 300, "Awareness": 300}, 900,
    "Expeditions (Undermountain)", "Antiquities of Undermountain", 4, ["Warlock", "Wizard"],
    [{"name": "Executioner's Might", "description": "When you kill an enemy, your Power increases by 5% for 10 seconds. (30 second cooldown)"}])

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Added items. Max id now: {max_id}, Total items: {len(data)}")
