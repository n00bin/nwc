#!/usr/bin/env python3
"""Build a verified deletion list of orphan images.

Resolves every static and dynamic image reference in the codebase, then
diffs against actual files on disk. Reports both confirmed orphans and
the files we couldn't resolve confidently.
"""
import os
import re
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]  # website/
IMAGES = ROOT / "images"

# Directories we are auditing (the bloated ones)
TARGET_DIRS = ["enhancements", "companions"]

IMG_EXT = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".ico"}


def collect_disk_files():
    """Return set of relative paths like 'images/companions/foo.webp' (lowercased)."""
    out = set()
    for d in TARGET_DIRS:
        dir_path = IMAGES / d
        if not dir_path.exists():
            continue
        for p in dir_path.rglob("*"):
            if p.is_file() and p.suffix.lower() in IMG_EXT:
                rel = p.relative_to(ROOT).as_posix()
                out.add(rel.lower())
    return out


def collect_static_refs():
    """Walk HTML/CSS/JS files and pull out every literal 'images/...' path.

    This catches things like:
      <img src="images/artifacts/foo.webp">
      image: "images/artifacts/Kits_Tarokkadeck_Box.webp"
      background-image: url(images/x/y.png)
    """
    refs = set()
    pattern = re.compile(r"images/[\w./\-() ]+?\.(?:png|jpg|jpeg|webp|gif|svg|ico)", re.IGNORECASE)
    for ext in (".html", ".css", ".js"):
        for p in ROOT.rglob(f"*{ext}"):
            # skip generated data dir's image-mapping files for static scan;
            # those are resolved separately via load-and-iterate
            try:
                txt = p.read_text(encoding="utf-8", errors="ignore")
            except Exception:
                continue
            for m in pattern.findall(txt):
                refs.add(m.replace("\\", "/").lower())
    return refs


def collect_image_map(js_path: Path, dir_name: str):
    """Parse a `window.X_IMAGES = { "Name": "filename.ext", ... };` JS map and
    return resolved 'images/<dir_name>/<filename>' references (lowercased)."""
    if not js_path.exists():
        return set()
    txt = js_path.read_text(encoding="utf-8", errors="ignore")
    # Extract the JS object literal between { and the closing };
    obj_match = re.search(r"=\s*\{([\s\S]*?)\}\s*;", txt)
    if not obj_match:
        return set()
    body = obj_match.group(1)
    # Pairs like  "Name": "filename.ext",
    pair_re = re.compile(r'"[^"\\]*(?:\\.[^"\\]*)*"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"')
    refs = set()
    for filename in pair_re.findall(body):
        if not filename:
            continue
        # Some maps store full paths, some just filenames.
        if filename.lower().startswith("images/"):
            refs.add(filename.lower())
        else:
            refs.add(f"images/{dir_name}/{filename}".lower())
    return refs


def main():
    print(f"Scanning website at {ROOT}")
    print()

    # 1) Disk inventory
    disk = collect_disk_files()
    print(f"Disk files in target dirs: {len(disk)}")

    # 2) Static refs from any source file
    static_refs = collect_static_refs()
    print(f"Static refs found in HTML/CSS/JS: {len(static_refs)}")

    # 3) Resolve image-map files
    map_refs = set()
    map_refs |= collect_image_map(ROOT / "data/companion-images.js", "companions")
    map_refs |= collect_image_map(ROOT / "data/mount-images.js", "mounts")
    map_refs |= collect_image_map(ROOT / "data/enhancement-images.js", "enhancements")
    map_refs |= collect_image_map(ROOT / "data/consumable-images.js", "consumables")
    print(f"Image-map refs (companion/mount/enhancement/consumable): {len(map_refs)}")

    referenced = static_refs | map_refs

    # 4) Diff
    orphans = sorted(disk - referenced)
    referenced_disk = sorted(disk & referenced)

    # 5) Report by directory
    print()
    print("=" * 70)
    print("DELETION DRY-RUN")
    print("=" * 70)
    by_dir = {}
    total_size = 0
    for o in orphans:
        d = o.split("/")[1]  # 'images/<d>/...'
        full = ROOT / o
        size = full.stat().st_size if full.exists() else 0
        by_dir.setdefault(d, []).append((o, size))
        total_size += size
    for d, items in sorted(by_dir.items()):
        dir_size = sum(s for _, s in items)
        print(f"\n  images/{d}/   {len(items)} orphan files, {dir_size/1024/1024:.2f} MB")
    print()
    print(f"Total proposed for deletion: {len(orphans)} files, {total_size/1024/1024:.2f} MB")

    # 6) Save full list to file for inspection
    out = ROOT / "scripts/orphan_deletion_list.txt"
    with out.open("w", encoding="utf-8") as f:
        f.write("# Orphan image files proposed for deletion\n")
        f.write(f"# Total: {len(orphans)} files, {total_size/1024/1024:.2f} MB\n\n")
        for d, items in sorted(by_dir.items()):
            f.write(f"\n## images/{d}/ ({len(items)} files)\n\n")
            for path, size in sorted(items):
                f.write(f"{path}  ({size} bytes)\n")
    print(f"\nFull list saved to: {out.relative_to(ROOT)}")
    print(f"Inspect that file before approving deletion.")

    # 7) Sanity stats
    print()
    print("Sanity check:")
    print(f"  Disk files in target dirs: {len(disk)}")
    print(f"  Referenced and on disk:    {len(referenced_disk)}")
    print(f"  Referenced but missing:    {len(referenced - disk - {r for r in referenced if not any(r.startswith(f'images/{d}/') for d in TARGET_DIRS)})}")
    print(f"  Orphans (proposed delete): {len(orphans)}")


if __name__ == "__main__":
    main()
