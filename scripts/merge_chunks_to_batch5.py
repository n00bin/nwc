#!/usr/bin/env python3
"""Combine all gear_batch5_chunk_NN.json files into a single
gear_batch5_items.json, deduping by name (later chunks win).
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "gear_batch5_items.json"

def main():
    by_name = {}
    chunks = sorted(ROOT.glob("gear_batch5_chunk_*.json"))
    if not chunks:
        print("No chunks found.")
        return
    for chunk in chunks:
        items = json.loads(chunk.read_text(encoding="utf-8"))
        before = len(by_name)
        for it in items:
            by_name[it["name"]] = it
        print(f"  {chunk.name}: {len(items)} items ({len(by_name) - before} new)")
    merged = list(by_name.values())
    OUT.write_text(json.dumps(merged, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nWrote {len(merged)} unique items to {OUT.name}")

if __name__ == "__main__":
    main()
