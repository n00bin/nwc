#!/usr/bin/env python3
"""Rename CamelCase keys to spaced form inside ratingStats/percentStats/abilityBonuses
and dict-form stats objects across all JSON data files.

Companion of rename_camelcase_stats.py — that one targeted "stat": "..." VALUES.
This one targets the OBJECT KEYS in dict-form stat collections.

Idempotent. Backs up modified files to .bak alongside.
"""
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT.parent / "data"

# Object fields whose KEYS should be renamed if CamelCase
TARGET_FIELDS = {"ratingStats", "percentStats", "abilityBonuses", "stats"}

SPECIAL = {
    "MaxHPPercent": "Max HP Percent",
    "MaxHP":        "Max HP",
}


def to_spaced(name: str) -> str:
    if name in SPECIAL:
        return SPECIAL[name]
    return re.sub(r"(?<=[a-z])(?=[A-Z])", " ", name)


def is_camelcase(name: str) -> bool:
    return " " not in name and bool(re.search(r"[a-z][A-Z]", name))


def rename_keys(obj):
    """Recursively walk; when we see a target field whose value is a dict,
    rename CamelCase keys inside that dict. Returns count of renames."""
    count = [0]

    def walk(o):
        if isinstance(o, dict):
            for k, v in list(o.items()):
                if k in TARGET_FIELDS and isinstance(v, dict):
                    new_inner = {}
                    for stat_k, stat_v in v.items():
                        new_k = to_spaced(stat_k) if is_camelcase(stat_k) else stat_k
                        if new_k != stat_k:
                            count[0] += 1
                        new_inner[new_k] = stat_v
                    o[k] = new_inner
                walk(v)
        elif isinstance(o, list):
            for item in o:
                walk(item)

    walk(obj)
    return count[0]


def main():
    total = 0
    files_updated = 0
    for path in sorted(DATA_DIR.glob("*.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            continue
        n = rename_keys(data)
        if n:
            bak = path.with_suffix(path.suffix + ".bak")
            if not bak.exists():
                shutil.copy2(path, bak)
            path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
            print(f"  {path.name:35s} +{n} key renames")
            total += n
            files_updated += 1
    print(f"\nUpdated {files_updated} files, {total} total key renames.")


if __name__ == "__main__":
    main()
