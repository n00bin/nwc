"""Gear equip-bonus completion census — the metric the grounding loop tracks.

Splits every gear equip bonus into: structured / heal-resource (engine-layer
blocked, NOT parseable now) / proc-skip (sequence + damage + by-design procs,
handled by other layers) / STRUCTURABLE-NOW (the real backlog) — with the
DPS-relevant subset called out. "Gear parse complete" == structurable_now == 0.

Run from website/ :  python scripts/eb_census.py
"""
import json, re, collections

g = json.load(open("../data/gear.json", encoding="utf-8"))

def is_struct(eb): return isinstance(eb.get("stat"), str) and eb.get("stat") and isinstance(eb.get("amount"), (int, float))

SEQ   = re.compile(r'next (encounter|at-?will|daily|power)|after you use|deals? \+?\d+% more damage|→', re.I)
DMGP  = re.compile(r'\bmagnitude\b|chance to deal|takes (?:lightning )?damage equal to|damage to your target', re.I)
HEAL  = re.compile(r'\bheal|outgoing healing|incoming healing|divinit|action point|\bAP\b|stamina|soulweave|temporary hit points|lifesteal|regenerat', re.I)
DPS   = re.compile(r'critical|\bpower\b|severity|accuracy|combat advantage|outgoing damage|\bdmg bonus|\bdamage bonus', re.I)
SKIP_NAMES = {"Encounter Reprieve","Critical Charge","Executioner's Zeal","Butcher's Zeal",
              "Critical Force","Explosive Force","Summon Myconid","Daily Burst","Daily Explosion",
              "Power at Any Cost","Rothe's Intimidation","Conjure Orb","Manticore's Mane Bite","Pact of Vengence"}

c = collections.Counter()
dps_il = collections.Counter()
for it in g:
    il = it.get("item_level") or 0
    for eb in (it.get("equipBonuses") or []):
        c["total"] += 1
        if is_struct(eb): c["structured"] += 1; continue
        d = (eb.get("description") or eb.get("effectText") or "").strip()
        nm = (eb.get("name") or "").strip()
        if not d: c["empty"] += 1; continue
        blob = d + " " + nm
        if nm in SKIP_NAMES or SEQ.search(blob) or DMGP.search(blob): c["proc_skip"] += 1; continue
        if HEAL.search(blob): c["heal_blocked"] += 1; continue
        c["structurable_now"] += 1
        if DPS.search(blob):
            c["dps_remaining"] += 1
            dps_il[(il // 1000) * 1000] += 1

print(f"total={c['total']} structured={c['structured']} empty={c['empty']}")
print(f"heal/resource (engine-blocked, not parseable): {c['heal_blocked']}")
print(f"proc-skip (sequence/damage/by-design):         {c['proc_skip']}")
print(f"STRUCTURABLE-NOW (the backlog):                {c['structurable_now']}")
print(f"  of which DPS-relevant:                       {c['dps_remaining']}")
print("  DPS-relevant by IL band:")
for il in sorted(dps_il, reverse=True):
    print(f"    IL {il}-{il+999}: {dps_il[il]}")
# machine-readable line for the tracker
print(f"CENSUS|structurable_now={c['structurable_now']}|dps_remaining={c['dps_remaining']}|heal_blocked={c['heal_blocked']}|structured={c['structured']}")
