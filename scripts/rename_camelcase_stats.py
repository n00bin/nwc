#!/usr/bin/env python3
"""Rename CamelCase stat names to spaced form across data + code.

Affects:
- All JSON files in ../data/ (parent project) — every "stat": "X" value
- 5 specific JS/HTML files — quoted string occurrences only

Idempotent: running twice is safe (already-spaced names won't match).
Backup: writes .bak alongside each modified file on first run.
"""
import json
import os
import re
import shutil
from pathlib import Path

WEBSITE = Path(__file__).resolve().parents[1]
PARENT = WEBSITE.parent
DATA_DIR = PARENT / "data"

# CamelCase splitter: insert space before any uppercase letter that follows a lowercase.
# Special cases handled below to keep abbreviations readable.
SPECIAL = {
    "MaxHPPercent": "Max HP Percent",
    "MaxHP": "Max HP",
}


def to_spaced(name: str) -> str:
    if name in SPECIAL:
        return SPECIAL[name]
    # Insert space before uppercase letter following lowercase
    return re.sub(r"(?<=[a-z])(?=[A-Z])", " ", name)


def is_camelcase_stat(name: str) -> bool:
    """Already-spaced or single-word names are skipped."""
    if " " in name: return False
    if not re.search(r"[a-z][A-Z]", name): return False
    return True


def rename_in_json(path: Path) -> int:
    """Walk JSON looking for 'stat' fields with CamelCase values; rename in-place."""
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return 0

    count = [0]

    def walk(obj):
        if isinstance(obj, dict):
            for k, v in obj.items():
                if k == "stat" and isinstance(v, str) and is_camelcase_stat(v):
                    obj[k] = to_spaced(v)
                    count[0] += 1
                else:
                    walk(v)
        elif isinstance(obj, list):
            for item in obj:
                walk(item)

    walk(data)
    if count[0]:
        # Backup once
        bak = path.with_suffix(path.suffix + ".bak")
        if not bak.exists():
            shutil.copy2(path, bak)
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    return count[0]


def rename_in_code(path: Path, names: list[str]) -> int:
    """In JS/HTML, only rename CamelCase stat names that appear as quoted strings."""
    txt = path.read_text(encoding="utf-8", errors="ignore")
    original = txt
    count = 0

    for name in names:
        spaced = to_spaced(name)
        # Match the name when surrounded by quotes (single or double)
        # \b boundaries to avoid partial-word matches.
        pattern = r"(['\"])\b" + re.escape(name) + r"\b\1"
        new_txt, n = re.subn(pattern, lambda m: m.group(1) + spaced + m.group(1), txt)
        if n:
            txt = new_txt
            count += n

    if count:
        bak = path.with_suffix(path.suffix + ".bak")
        if not bak.exists():
            shutil.copy2(path, bak)
        path.write_text(txt, encoding="utf-8")
    return count


def collect_camelcase_stats() -> list[str]:
    """First pass: gather every CamelCase 'stat' value seen across all JSONs."""
    out = set()
    for p in DATA_DIR.glob("*.json"):
        try:
            txt = p.read_text(encoding="utf-8")
        except Exception:
            continue
        for m in re.finditer(r'"stat":\s*"([^"]+)"', txt):
            v = m.group(1)
            if is_camelcase_stat(v):
                out.add(v)
    return sorted(out)


def main():
    print(f"Scanning {DATA_DIR}")
    camel = collect_camelcase_stats()
    print(f"Found {len(camel)} distinct CamelCase stat names\n")

    # Pass 1: JSON files
    json_total = 0
    for p in DATA_DIR.glob("*.json"):
        n = rename_in_json(p)
        if n:
            print(f"  JSON: {p.name:40s}  +{n} renames")
            json_total += n

    # Pass 2: code files (only those identified by audit)
    code_files = [
        WEBSITE / "js" / "artifacts-page.js",
        WEBSITE / "js" / "consumables-page.js",
        WEBSITE / "js" / "mounts-page.js",
        WEBSITE / "js" / "companions-page.js",
        WEBSITE / "mekaniks.html",
    ]
    code_total = 0
    for p in code_files:
        if not p.exists():
            print(f"  WARN: {p} not found")
            continue
        n = rename_in_code(p, camel)
        if n:
            rel = p.relative_to(WEBSITE)
            print(f"  CODE: {str(rel):40s}  +{n} renames")
            code_total += n

    print(f"\nTotal: {json_total} JSON renames + {code_total} code renames = {json_total + code_total}")
    print("Backups (.bak files) written for any file modified.")


if __name__ == "__main__":
    main()
