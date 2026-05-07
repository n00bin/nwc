#!/usr/bin/env python3
"""Find every JS/HTML reference to a CamelCase stat name."""
import re
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

CAMEL = [
    "CriticalStrike", "CriticalSeverity", "CriticalAvoidance",
    "MaximumHitPoints", "OutgoingHealing", "IncomingHealing",
    "MovementSpeed", "RechargeSpeed", "StaminaRegeneration",
    "DeflectSeverity", "ControlResist", "ControlBonus",
    "IncomingDamage", "OutgoingDamage", "BaseDamageBoost",
    "CompanionDamageBoost", "OverallOutgoingHealing", "GoldBonus",
    "GloryBonus", "ActionPointGain", "DamageResistance",
    "EnemyDmgTaken", "DmgBonus", "DmgDebuff", "MaxHPPercent",
    "CriticalSeverityReduction", "AccuracyReduction", "DefenseReduction",
    "AtWillDamageRange", "AtWillDamageVsDisabled", "AtWillDamageVsRooted",
    "AtWillPower", "DailyDamage", "DamageReduction", "DamageTakenReduction",
    "DivinityRegen", "EncounterDamage", "EncounterDamageVsDisabled",
    "EncounterDmgBonus", "AtWillDmgBonus", "GroupHealPotionBonus",
    "HealAndDamage", "HealBonus", "HealPercent", "MountSpeed",
    "MovementDebuff", "PerformanceRegen", "ResourceMaxPercent",
    "ReviveSickness", "SoulweaveRegen", "StaminaRestore",
    "UnmodeledDamageProcMagnitude",
    "DamageVsBosses", "DamageVsDragons", "DamageVsFey", "DamageVsGyrion",
    "DamageVsKabal", "DamageVsNotFacing", "DamageVsStrong",
    "IncomingDamageReduction",
]

total = 0
by_file = []
for path in ROOT.rglob("*"):
    if not path.is_file(): continue
    if any(seg in path.parts for seg in (".git", "node_modules", "data", "scripts")): continue
    if path.suffix.lower() not in (".js", ".html"): continue
    try:
        txt = path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        continue
    file_hits = 0
    found_stats = set()
    for s in CAMEL:
        n = len(re.findall(r"\b" + re.escape(s) + r"\b", txt))
        if n:
            file_hits += n
            found_stats.add(s)
    if file_hits:
        by_file.append((file_hits, path.relative_to(ROOT).as_posix(), sorted(found_stats)))
        total += file_hits

by_file.sort(reverse=True)
for hits, p, stats in by_file:
    print(f"  {hits:4d}  {p}  ({len(stats)} distinct)")
print(f"\nTotal code refs: {total} across {len(by_file)} files")
