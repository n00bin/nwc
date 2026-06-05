#!/usr/bin/env python3
"""Compare NW Hub mount list against our mounts.json with naming-aware matching."""
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data"

def norm(s: str) -> str:
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    return s.strip().lower().replace("'", "'").replace("'", "'")

def base_name(s: str) -> str:
    """Normalize and strip ' - account' suffix for cross-matching."""
    n = norm(s)
    n = re.sub(r"\s*-\s*account$", "", n)
    return n

with open(DATA / "mounts.json", encoding="utf-8") as f:
    ours = json.load(f)

with open(Path(__file__).parent / "nw_hub_mounts.txt", encoding="utf-8") as f:
    hub_names = [ln.strip() for ln in f if ln.strip()]

ours_norm = {norm(m["name"]): m["name"] for m in ours}
ours_base = {base_name(m["name"]): m["name"] for m in ours}

hub_norm = {norm(n): n for n in hub_names}
hub_base = {base_name(n): n for n in hub_names}

# True missing from our DB (not present even after stripping Account suffix)
true_missing = []
account_variant = []  # NW Hub has "- Account" version, we have base or vice versa
for n in hub_names:
    nn = norm(n)
    bn = base_name(n)
    if nn in ours_norm:
        continue  # exact match
    if bn in ours_base:
        # one side has Account suffix, other doesn't
        account_variant.append((n, ours_base[bn]))
        continue
    true_missing.append(n)

# In ours not in hub
true_extra = []
extra_account_variant = []
for k, name in ours_norm.items():
    bn = base_name(name)
    if k in hub_norm:
        continue
    if bn in hub_base:
        extra_account_variant.append((name, hub_base[bn]))
        continue
    true_extra.append(name)

print(f"Our DB: {len(ours)} mounts | NW Hub: {len(hub_names)} mounts")
print()
print(f"=== TRULY MISSING from our DB ({len(true_missing)}) ===")
for n in sorted(true_missing):
    print(f"  + {n}")
print()
print(f"=== Account-suffix differences ({len(account_variant)}) — likely same mount, naming mismatch ===")
for hub, ours_n in sorted(account_variant):
    print(f"    NW Hub: {hub!r}  vs  Ours: {ours_n!r}")
print()
print(f"=== In OUR DB but not in NW Hub ({len(true_extra)}) — verify these are real ===")
for n in sorted(true_extra):
    print(f"  - {n}")
print()
print(f"=== Reverse account variants ({len(extra_account_variant)}) ===")
for ours_n, hub in sorted(extra_account_variant):
    print(f"    Ours: {ours_n!r}  vs  NW Hub: {hub!r}")
