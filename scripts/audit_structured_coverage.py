# audit_structured_coverage.py — census of engine-visible vs text-only effects
# across every data system Toon Forge consumes.
#
# "Structured" mirrors what toon-forge.html actually ingests:
#   gear/artifact/overload equipBonuses ..... eb.stat && eb.amount != null
#   set markers (type Set, no stat, no desc) . intentional partner pieces, NOT gaps
#   sequence procs ........................... modeled at runtime via regex (RE below)
#   companion powers ......................... stats[] entries OR procEffect.statEffects
#   insignia bonuses ......................... stats[] / instanceStats / proc profile /
#                                              "N to all ratings" effectText regex
#   collars / buffs / kits / mounts .......... ratingStats / percentStats values
#
# Usage:  python scripts/audit_structured_coverage.py
# Writes: docs/audit/structured_coverage.md (+ console summary)

import json
import re
import collections
import os
import datetime

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.normpath(os.path.join(HERE, "..", "..", "data"))
OUT = os.path.normpath(os.path.join(HERE, "..", "docs", "audit", "structured_coverage.md"))


def load(name):
    with open(os.path.join(DATA, name), encoding="utf-8") as f:
        return json.load(f)


# --- classification helpers -------------------------------------------------

# runtime sequence-proc regex copied from toon-forge.html (getSequenceProcBonus)
SEQ_RE = re.compile(
    r"when(?:ever)? you (?:use|deal damage with|activate|cast)[^.]*?\b(daily|encounter)\b"
    r"[^.]*?your next (\d+ )?(encounter|at-?will|daily)[^.]*?(?:deal|do)\w*\s*\+?"
    r"(\d+(?:\.\d+)?)%\s*(?:more )?damage", re.I)

PANEL_STATS = (
    r"power|critical strike|critical severity|accuracy|combat advantage|defense|"
    r"deflect(?:ion)?(?: severity)?|awareness|forte|control bonus|control resist(?:ance)?|"
    r"outgoing healing|incoming healing|max(?:imum)? (?:hit points|hp)")

BUCKETS = [
    # (bucket key, human label, regex) — first match wins, checked in order
    # heals/shields phrased "X% OF (your) Maximum Hit Points" are procs, not
    # stat grants — catch them before the parseable-% bucket claims them
    ("heal_shield_proc", "A. Heal / shield proc (needs engine layer)",
     re.compile(r"(?:heal|shield|restore|regenerat)\w*[^.]{0,60}%\s*of\b"
                r"|%\s*of\s*(?:your |their )?max(?:imum)? hit ?points", re.I)),
    ("parseable_pct", "C. Parseable stat % (panel stat, just needs parsing)",
     re.compile(r"[+-]?\d+(?:\.\d+)?\s*%[^.]*?\b(?:" + PANEL_STATS + r")\b", re.I)),
    ("parseable_flat", "C. Parseable flat rating (panel stat, just needs parsing)",
     re.compile(r"[+-]\s*\d{1,2}?,?\d{3}\b[^.%]*?\b(?:" + PANEL_STATS + r")\b", re.I)),
    ("recharge", "A. Recharge / cooldown (needs engine layer)",
     re.compile(r"recharge|cooldown", re.I)),
    ("resource", "A. Resource gen: AP / Divinity / Stamina etc. (needs engine layer)",
     re.compile(r"action ?points?|divinity|stamina|soulweave|guard\b|performance\b", re.I)),
    ("heal_proc", "A. Heal / lifesteal proc (needs engine layer)",
     re.compile(r"heal(?:s|ed|ing)?\b|restore(?:s|d)?\b|regenerat|hit ?points?", re.I)),
    ("mitigation", "A. Mitigation: incoming dmg / shields (needs engine layer)",
     re.compile(r"incoming damage|damage taken|take[^.]*?less damage|damage resist|absorb|shield|barrier|immune|immunity", re.I)),
    ("damage_proc", "A. Flat damage proc / magnitude (needs engine layer)",
     re.compile(r"deal(?:s|ing)?\b[^.]*?damage|damage to (?:the )?target|magnitude|weapon damage", re.I)),
    ("movement", "B. Movement speed only (excluded by design)",
     re.compile(r"movement|run(?:ning)? speed|mount(?:ed)? speed", re.I)),
    ("control", "A/B. Control effects: stun/daze/slow (mostly not build stats)",
     re.compile(r"stun|daze|root|prone|knock|slow(?:s|ed)?\b|interrupt", re.I)),
    ("gold_utility", "B. Loot/gold/XP utility (excluded by design)",
     re.compile(r"gold|glory|experience|\bxp\b|refinement|treasure|chance to find", re.I)),
]


def classify_text(text):
    for key, label, rx in BUCKETS:
        if rx.search(text):
            return key
    return "other"


BUCKET_LABELS = {k: lbl for k, lbl, _ in BUCKETS}
BUCKET_LABELS["other"] = "?. Other / bespoke mechanics"
BUCKET_LABELS["set_no_data"] = "C. Set family with NO structured piece (needs data)"
BUCKET_LABELS["empty_desc"] = "?. Empty name+description (needs data)"
BUCKET_LABELS["rolemap"] = "C. Legacy roleMap shape (looks structured; engine reads stat+amount only)"


def has_vals(d):
    if isinstance(d, list):
        return len(d) > 0
    return isinstance(d, dict) and any(v for v in d.values())


REPORT = []          # markdown lines
SUMMARY_ROWS = []    # (system, total_surfaces, structured, intentional, blind)


def sec(title):
    REPORT.append("\n## " + title + "\n")


# ============================================================ GEAR
gear = load("gear.json")
set_has_stat = collections.defaultdict(bool)
for it in gear:
    for eb in (it.get("equipBonuses") or []):
        if eb.get("setName") and eb.get("stat") and eb.get("amount") is not None:
            set_has_stat[eb["setName"]] = True

inst = collections.Counter()          # instance-level census
blind_by_bucket = collections.Counter()
blind_names = collections.Counter()   # (bucket, bonus name) -> count
blind_name_example = {}
blind_items = {}                      # item name -> (il, slot, n blind)
unmodeled_sets = collections.Counter()

for it in gear:
    il = it.get("item_level") or 0
    n_blind = 0
    for eb in (it.get("equipBonuses") or []):
        if not isinstance(eb, dict):
            continue
        desc = (eb.get("description") or eb.get("effect") or "").strip()
        name = (eb.get("name") or "").strip()
        inst["total"] += 1
        if eb.get("stat") and eb.get("amount") is not None:
            inst["structured"] += 1
            continue
        if eb.get("type") == "Set" and eb.get("setName") and not desc:
            if set_has_stat[eb["setName"]]:
                inst["marker"] += 1          # partner piece of a modeled set — by design
            else:
                inst["blind"] += 1
                n_blind += 1
                blind_by_bucket["set_no_data"] += 1
                unmodeled_sets[eb["setName"]] += 1
                blind_names[("set_no_data", eb["setName"] + " (set)")] += 1
            continue
        if SEQ_RE.search(desc):
            inst["seq_regex"] += 1           # modeled at runtime by sequence-proc layer
            continue
        if not desc and not name:
            inst["blind"] += 1
            n_blind += 1
            blind_by_bucket["empty_desc"] += 1
            continue
        # free-text, engine-blind
        inst["blind"] += 1
        n_blind += 1
        b = "rolemap" if eb.get("roleMap") else classify_text(name + " " + desc)
        if eb.get("type") == "Set" and eb.get("setName") and not set_has_stat[eb.get("setName")]:
            b = "set_no_data"
            unmodeled_sets[eb["setName"]] += 1
        blind_by_bucket[b] += 1
        key = (b, name or desc[:50])
        blind_names[key] += 1
        blind_name_example.setdefault(key, "%s (IL %s)" % (it.get("name"), il))
    if n_blind:
        blind_items[it.get("name")] = (il, it.get("slot"), n_blind)

sec("Gear (`gear.json`) — %d items" % len(gear))
REPORT.append("Equip-bonus **instances** (a 2-piece item counts twice):\n")
REPORT.append("| census | count |")
REPORT.append("|---|---|")
REPORT.append("| total instances | %d |" % inst["total"])
REPORT.append("| structured (stat+amount, engine-counted) | %d |" % inst["structured"])
REPORT.append("| set markers (partner pieces, counted via their set — by design) | %d |" % inst["marker"])
REPORT.append("| sequence procs (modeled at runtime via regex) | %d |" % inst["seq_regex"])
REPORT.append("| **engine-blind (text-only)** | **%d** |" % inst["blind"])
pct = 100.0 * (inst["structured"] + inst["marker"] + inst["seq_regex"]) / max(inst["total"], 1)
REPORT.append("\nEffective coverage: **%.1f%%** of instances are engine-visible or intentional.\n" % pct)
distinct_blind = len(set(nm for (_b, nm) in blind_names))
REPORT.append("Distinct blind bonus NAMES: **%d** (each usually appears on several items/tiers — "
              "fixing one name clears all its copies).\n" % distinct_blind)

REPORT.append("Blind instances by category (A = needs a new engine layer, B = excluded by design, C = parseable/needs data):\n")
REPORT.append("| category | instances |")
REPORT.append("|---|---|")
for b, n in blind_by_bucket.most_common():
    REPORT.append("| %s | %d |" % (BUCKET_LABELS[b], n))

# IL bands of blind ITEMS
bands = [(1400, 10 ** 9, "IL 1400+ (current endgame)"), (1200, 1399, "IL 1200-1399"),
         (800, 1199, "IL 800-1199"), (1, 799, "IL 1-799"), (0, 0, "no IL")]
band_ct = collections.Counter()
for nm, (il, slot, nb) in blind_items.items():
    for lo, hi, lbl in bands:
        if lo <= il <= hi:
            band_ct[lbl] += 1
            break
REPORT.append("\nItems carrying >=1 blind bonus: **%d of %d** — by item level:\n" % (len(blind_items), len(gear)))
REPORT.append("| IL band | items w/ blind bonus |")
REPORT.append("|---|---|")
for lo, hi, lbl in bands:
    REPORT.append("| %s | %d |" % (lbl, band_ct[lbl]))

REPORT.append("\nTop 30 blind bonus names by frequency (fixing one name fixes all its copies):\n")
REPORT.append("| bonus | category | copies | example item |")
REPORT.append("|---|---|---|---|")
for (b, name), n in blind_names.most_common(30):
    REPORT.append("| %s | %s | %d | %s |" % (name, b, n, blind_name_example.get((b, name), "")))

REPORT.append("\nUnmodeled SET families (no piece carries stat+amount anywhere): **%d families / %d instances**\n"
              % (len(unmodeled_sets), sum(unmodeled_sets.values())))
REPORT.append("| set | instances |")
REPORT.append("|---|---|")
for s, n in unmodeled_sets.most_common(20):
    REPORT.append("| %s | %d |" % (s, n))

SUMMARY_ROWS.append(("Gear equip bonuses", inst["total"],
                     inst["structured"] + inst["seq_regex"], inst["marker"], inst["blind"]))

# ============================================================ COMPANION POWERS
cp = load("companion_powers.json")
c_stats = sum(1 for p in cp if p.get("stats"))
procs = [p for p in cp if p.get("procEffect")]
proc_ok = [p for p in procs if (p["procEffect"].get("statEffects") or p["procEffect"].get("effectScaling"))]
proc_blind = [p for p in procs if not (p["procEffect"].get("statEffects") or p["procEffect"].get("effectScaling"))]
neither = [p for p in cp if not p.get("stats") and not p.get("procEffect")]
proc_buckets = collections.Counter()
proc_blind_rows = []
for p in proc_blind:
    pe = p["procEffect"]
    txt = " ".join(str(pe.get(k) or "") for k in ("trigger", "effect")) + " " + str(p.get("notes") or "")
    b = classify_text(txt)
    proc_buckets[b] += 1
    proc_blind_rows.append((p.get("name"), b, (pe.get("effect") or "")[:90]))

sec("Companion powers (`companion_powers.json`) — %d powers" % len(cp))
REPORT.append("| census | count |")
REPORT.append("|---|---|")
REPORT.append("| with structured stats[] | %d |" % c_stats)
REPORT.append("| procEffect WITH statEffects/effectScaling (engine-visible) | %d |" % len(proc_ok))
REPORT.append("| **procEffect TEXT-ONLY (engine-blind)** | **%d** |" % len(proc_blind))
REPORT.append("| no stats and no procEffect (flavor/CR-only) | %d |" % len(neither))
REPORT.append("\nBlind procs by category:\n")
REPORT.append("| category | powers |")
REPORT.append("|---|---|")
for b, n in proc_buckets.most_common():
    REPORT.append("| %s | %d |" % (BUCKET_LABELS[b], n))
REPORT.append("\n<details><summary>All engine-blind companion procs (%d)</summary>\n" % len(proc_blind_rows))
REPORT.append("| power | category | effect text |")
REPORT.append("|---|---|---|")
for nm, b, tx in sorted(proc_blind_rows):
    REPORT.append("| %s | %s | %s |" % (nm, b, tx.replace("|", "/")))
REPORT.append("\n</details>")
SUMMARY_ROWS.append(("Companion power procs", len(procs), len(proc_ok), 0, len(proc_blind)))

# ============================================================ COMPANION ENHANCEMENTS
ce = load("companion_enhancements.json")
ce_enemy = [e for e in ce if e.get("scope") == "enemy"]
ce_ok = [e for e in ce if e.get("scope") != "enemy" and (e.get("stat") or e.get("stats"))]
ce_blind = [e for e in ce if e.get("scope") != "enemy" and not (e.get("stat") or e.get("stats"))]
sec("Companion enhancements — %d entries" % len(ce))
REPORT.append("structured: %d - enemy-scope debuffs (skipped by design): %d - **blind: %d**"
              % (len(ce_ok), len(ce_enemy), len(ce_blind)))
for e in ce_blind:
    REPORT.append("- BLIND: %s — %s" % (e.get("name"), str(e.get("notes") or e.get("description") or "")[:100]))
SUMMARY_ROWS.append(("Companion enhancements", len(ce), len(ce_ok), len(ce_enemy), len(ce_blind)))

# ============================================================ INSIGNIA BONUSES
ib = load("mount_insignia_bonuses.json")
prof = set((load("mount_insignia_proc_profiles.json").get("profiles") or {}).keys())
ratings_rx = re.compile(r"(\d[\d,]*)\s+to all (?:of your )?ratings for (\d+)\s*second", re.I)
ib_rows = []
ib_ct = collections.Counter()
for b in ib:
    if b.get("stats") or b.get("instanceStats"):
        ib_ct["structured"] += 1
    elif b.get("name") in prof:
        ib_ct["proc_profile"] += 1
    elif ratings_rx.search(b.get("effectText") or ""):
        ib_ct["regex"] += 1
    else:
        ib_ct["blind"] += 1
        ib_rows.append((b.get("name"), classify_text(b.get("effectText") or ""), (b.get("effectText") or "")[:90]))
sec("Mount insignia bonuses — %d entries" % len(ib))
REPORT.append("structured stats/instanceStats: %d - proc profile: %d - all-ratings regex: %d - **blind: %d**"
              % (ib_ct["structured"], ib_ct["proc_profile"], ib_ct["regex"], ib_ct["blind"]))
for nm, b, tx in sorted(ib_rows):
    REPORT.append("- BLIND: **%s** [%s] — %s" % (nm, b, tx))
SUMMARY_ROWS.append(("Insignia bonuses", len(ib), ib_ct["structured"] + ib_ct["proc_profile"] + ib_ct["regex"], 0, ib_ct["blind"]))

# ============================================================ MOUNT POWERS
mep = load("mount_equip_powers.json")
mep_blind = [p for p in mep if not has_vals(p.get("stats")) and not p.get("stackingBuff")
             and not p.get("partyEffects") and not p.get("equipEffect")]
mcp = load("mount_combat_powers.json")
mcp_eb = [(p, eb) for p in mcp for eb in (p.get("equipBonuses") or [])]
mcp_blind = [(p, eb) for p, eb in mcp_eb if not (eb.get("stat") and eb.get("amount") is not None)]
sec("Mount powers")
REPORT.append("Equip powers: %d - engine-blind (no stats/stackingBuff/partyEffects): **%d**" % (len(mep), len(mep_blind)))
for p in mep_blind:
    REPORT.append("- BLIND equip power: **%s** — %s" % (p.get("name"), str(p.get("notes") or "")[:100]))
REPORT.append("\nCombat powers: %d (magnitude on all) - equipBonus effects: %d - blind: **%d**" % (len(mcp), len(mcp_eb), len(mcp_blind)))
for p, eb in mcp_blind:
    REPORT.append("- BLIND combat eb: **%s** — %s" % (p.get("name"), json.dumps(eb, ensure_ascii=False)[:120]))
SUMMARY_ROWS.append(("Mount equip powers", len(mep), len(mep) - len(mep_blind), 0, len(mep_blind)))
SUMMARY_ROWS.append(("Mount combat eb", len(mcp_eb), len(mcp_eb) - len(mcp_blind), 0, len(mcp_blind)))

# ============================================================ COLLARS
col = load("mount_collars.json")
col_blind = [c for c in col if not has_vals(c.get("ratingStats")) and not has_vals(c.get("percentStats"))]
sec("Mount collars — %d entries" % len(col))
REPORT.append("engine-blind (no rating/percent stats): **%d**" % len(col_blind))
for c in col_blind:
    REPORT.append("- BLIND: **%s** — %s" % (c.get("name"), (c.get("effectText") or "")[:110]))
SUMMARY_ROWS.append(("Collars", len(col), len(col) - len(col_blind), 0, len(col_blind)))

# ============================================================ ARTIFACTS
arts = load("artifacts.json")
a_nostats = [a for a in arts if not has_vals(a.get("ratingStats")) and not has_vals(a.get("percentStats"))]
a_eb = [(a, eb) for a in arts for eb in (a.get("equipBonuses") or [])]
a_eb_blind = [(a, eb) for a, eb in a_eb if not (eb.get("stat") and eb.get("amount") is not None)]
sec("Artifacts — %d rank-rows" % len(arts))
REPORT.append("rows w/o any rating/percent stats: %d - equipBonuses: %d (blind: %d)" % (len(a_nostats), len(a_eb), len(a_eb_blind)))
REPORT.append("(activation `power`/`debuff` text is display+sim-side by design, not counted here)")
for a in a_nostats[:15]:
    REPORT.append("- no stats: %s (IL %s)" % (a.get("name"), a.get("item_level")))
SUMMARY_ROWS.append(("Artifacts (stat rows)", len(arts), len(arts) - len(a_nostats), 0, len(a_nostats)))

# ============================================================ ENCHANTS / OVERLOADS / KITS
ench = load("enchants.json")
e_blind = [e for e in ench if not has_vals(e.get("ratingStats")) and not has_vals(e.get("percentStats"))
           and not e.get("rarities") and not e.get("rarityLadder")]
e_eb = [(e, eb) for e in ench for eb in (e.get("equipBonuses") or [])]
e_eb_blind = [(e, eb) for e, eb in e_eb if not (eb.get("stat") and eb.get("amount") is not None)]
sec("Enchants — %d" % len(ench))
REPORT.append("no stats/no ladder: %d - equipBonuses blind: %d" % (len(e_blind), len(e_eb_blind)))
for e in e_blind:
    REPORT.append("- no stats: %s — %s" % (e.get("name"), (e.get("description") or "")[:90]))
for e, eb in e_eb_blind:
    REPORT.append("- blind eb on %s: %s" % (e.get("name"), json.dumps(eb, ensure_ascii=False)[:110]))
SUMMARY_ROWS.append(("Enchants", len(ench), len(ench) - len(e_blind), 0, len(e_blind)))

ov = load("overloads.json")
ov_eb = [(o, eb) for o in ov for eb in (o.get("equipBonuses") or [])]
ov_eb_blind = [(o, eb) for o, eb in ov_eb if not (eb.get("stat") and eb.get("amount") is not None)]
ov_blind = [o for o in ov if not has_vals(o.get("ratingStats")) and not has_vals(o.get("percentStats"))
            and not o.get("damagePct") and not any(eb.get("stat") for eb in (o.get("equipBonuses") or []))]
sec("Overloads — %d" % len(ov))
REPORT.append("fully blind entries: %d - blind equipBonuses: %d" % (len(ov_blind), len(ov_eb_blind)))
for o in ov_blind:
    REPORT.append("- blind: %s — %s" % (o.get("name"), (o.get("notes") or "")[:90]))
for o, eb in ov_eb_blind:
    REPORT.append("- blind eb on %s: %s" % (o.get("name"), json.dumps(eb, ensure_ascii=False)[:110]))
SUMMARY_ROWS.append(("Overloads", len(ov), len(ov) - len(ov_blind), 0, len(ov_blind)))

kits = load("kits.json")
k_blind = [k for k in kits if not has_vals(k.get("ratingStats")) and not has_vals(k.get("percentStats"))]
sec("Kits/Jewels — %d" % len(kits))
REPORT.append("blind: %d %s" % (len(k_blind), [k.get("name") for k in k_blind]))
SUMMARY_ROWS.append(("Kits", len(kits), len(kits) - len(k_blind), 0, len(k_blind)))

# ============================================================ COMPANION GEAR
cg = load("companion_gear.json")
cg_eb = [(g, eb) for g in cg for eb in (g.get("equipBonuses") or [])]
cg_eb_blind = [(g, eb) for g, eb in cg_eb if not (eb.get("stat") and eb.get("amount") is not None)]
cg_blind = [g for g in cg if not has_vals(g.get("ratingStats")) and not has_vals(g.get("percentStats"))]
sec("Companion gear — %d items" % len(cg))
REPORT.append("items w/o stats: %d - equipBonuses: %d (blind: %d)" % (len(cg_blind), len(cg_eb), len(cg_eb_blind)))
for g in cg_blind:
    REPORT.append("- no stats: %s" % g.get("name"))
for g, eb in cg_eb_blind:
    REPORT.append("- blind eb on %s: %s" % (g.get("name"), json.dumps(eb, ensure_ascii=False)[:120]))
SUMMARY_ROWS.append(("Companion gear", len(cg), len(cg) - len(cg_blind), 0, len(cg_blind)))

# ============================================================ BUFFS (consumables)
bf = load("buffs.json")
bf_blind = [b for b in bf if not has_vals(b.get("ratingStats")) and not has_vals(b.get("percentStats"))
            and not b.get("damagePct") and not b.get("abilityBonuses")]
sec("Buffs/consumables — %d" % len(bf))
REPORT.append("engine-blind (no stats, no damagePct, no ability bonuses): **%d**" % len(bf_blind))
for b in bf_blind:
    REPORT.append("- BLIND: **%s** — %s" % (b.get("name"), (str(b.get("notes") or ""))[:100]))
SUMMARY_ROWS.append(("Buffs", len(bf), len(bf) - len(bf_blind), 0, len(bf_blind)))

# ============================================================ BOONS
cb = load("campaign_boons.json")
boon_rows = []            # (tier, boon)
for tier_name, boons in (cb.get("tiers") or {}).items():
    for bn in boons or []:
        boon_rows.append(("tier " + str(tier_name), bn))
for bn in cb.get("master") or []:
    boon_rows.append(("master", bn))
boon_blind = []
for tier, bn in boon_rows:
    structured = ((bn.get("stat") and (bn.get("perPoint") is not None or bn.get("amount") is not None))
                  or bn.get("perRankEffects") or bn.get("effects") or bn.get("stats")
                  or has_vals(bn.get("ratingStats")) or has_vals(bn.get("percentStats")))
    if not structured:
        boon_blind.append((tier, bn.get("name"), str(bn.get("notes") or bn.get("description") or "")[:80]))
sec("Campaign boons — %d boons" % len(boon_rows))
REPORT.append("engine-blind: **%d**" % len(boon_blind))
for tier, nm, tx in boon_blind:
    REPORT.append("- BLIND: **%s** (%s) — %s" % (nm, tier, tx))
SUMMARY_ROWS.append(("Campaign boons", len(boon_rows), len(boon_rows) - len(boon_blind), 0, len(boon_blind)))

gb = load("guild_boons.json")
gb_items = gb if isinstance(gb, list) else [b for v in gb.values() for b in (v if isinstance(v, list) else [v])]
gb_blind = [b for b in gb_items if not (b.get("stat") and (b.get("perRank") is not None or b.get("amount") is not None))
            and b.get("modeled") is not False]
gb_unmod = [b for b in gb_items if b.get("modeled") is False]
sec("Guild boons — %d" % len(gb_items))
REPORT.append("structured: %d - explicitly modeled:false: %d %s - blind: %d %s"
              % (len(gb_items) - len(gb_unmod) - len(gb_blind), len(gb_unmod),
                 [b.get("name") for b in gb_unmod], len(gb_blind), [b.get("name") for b in gb_blind]))
SUMMARY_ROWS.append(("Guild boons", len(gb_items), len(gb_items) - len(gb_unmod) - len(gb_blind), 0,
                     len(gb_unmod) + len(gb_blind)))

# ============================================================ SUMMARY
now = "2026-07-07"
head = ["# Structured-coverage census — %s" % now,
        "",
        "Every effect surface Toon Forge reads, split into: engine-visible (structured),",
        "intentional exclusions (set markers / enemy debuffs), and **engine-blind text**",
        "(shows on the card, contributes 0 to the stat panel / optimizer).",
        "",
        "Generated by `scripts/audit_structured_coverage.py` — re-run any time.",
        "",
        "## Summary",
        "",
        "| system | surfaces | engine-visible | intentional | **blind** | blind % |",
        "|---|---|---|---|---|---|"]
tot = [0, 0, 0, 0]
for name, t, s, i, bl in SUMMARY_ROWS:
    tot[0] += t; tot[1] += s; tot[2] += i; tot[3] += bl
    head.append("| %s | %d | %d | %d | **%d** | %.0f%% |" % (name, t, s, i, bl, 100.0 * bl / max(t, 1)))
head.append("| **TOTAL** | %d | %d | %d | **%d** | %.0f%% |" % (tot[0], tot[1], tot[2], tot[3], 100.0 * tot[3] / max(tot[0], 1)))

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(head + REPORT) + "\n")

print("wrote", OUT)
print()
print("%-28s %9s %9s %12s %8s" % ("system", "surfaces", "visible", "intentional", "BLIND"))
for name, t, s, i, bl in SUMMARY_ROWS:
    print("%-28s %9d %9d %12d %8d" % (name, t, s, i, bl))
print("%-28s %9d %9d %12d %8d" % ("TOTAL", tot[0], tot[1], tot[2], tot[3]))
