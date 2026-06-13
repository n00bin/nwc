import os, json, glob
from PIL import Image

SRC = r"C:\Users\N00Bin\OneDrive\Pictures\Screenshots\New folder"
OUT = r"docs/audit/fighter_intake/_crops"
os.makedirs(OUT + "/grid", exist_ok=True)
os.makedirs(OUT + "/details", exist_ok=True)

THRESH = 1_400_000  # >= grid (item tooltip, left), < details (set panel, right)
GRID_BOX = (20, 70, 680, 850)      # universal: tooltip position varies by collection tab
GRID_SCALE = 2.0
DET_BOX = (1168, 44, 1722, 536)     # right details panel
DET_SCALE = 2.78

manifest = []
files = sorted(glob.glob(os.path.join(SRC, "*.png")))
gi = di = 0
for f in files:
    sz = os.path.getsize(f)
    im = Image.open(f)
    base = os.path.basename(f)
    ts = base.replace("Screenshot ", "").replace(".png", "")  # "2026-06-12 204705"
    if sz >= THRESH:
        box, scale, kind, idx = GRID_BOX, GRID_SCALE, "grid", gi; gi += 1
        name = f"g{idx:03d}.png"; sub = "grid"
    else:
        box, scale, kind, idx = DET_BOX, DET_SCALE, "details", di; di += 1
        name = f"d{idx:03d}.png"; sub = "details"
    crop = im.crop(box)
    crop = crop.resize((int(crop.width*scale), int(crop.height*scale)), Image.LANCZOS)
    crop.save(os.path.join(OUT, sub, name))
    manifest.append({"crop": f"{sub}/{name}", "src": base, "ts": ts, "kind": kind, "bytes": sz})

json.dump(manifest, open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8"), indent=1)
print(f"grid={gi} details={di} total={len(files)}")
