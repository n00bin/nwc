# Mount Icons — Still Missing

Last updated: 2026-06-01

Mount icons live in `images/mounts/*.webp` and are wired up in `data/mount-images.js`
(`window.MOUNT_IMAGES`, keyed by exact mount name). A mount shows no icon when its
name is absent from that map.

## Status
- **279** mounts total (`../data/mounts.json`)
- **255** have an icon
- **24** still missing (below)

On 2026-06-01, 103 icons were pulled from the Official Neverwinter Wiki (Fandom):
77 from the [Collection/Mounts](https://neverwinter.fandom.com/wiki/Collection/Mounts)
table and 26 from individual mount pages.

## Still missing (24)
These have no usable icon on the Fandom wiki — either no page exists, or the page
has no uploaded inventory icon. They need an **in-game screenshot** to capture.
"Wiki hint" = a similarly-named wiki entry that *might* be the same mount but is not
confirmed (do not assume — verify before reusing its art).

| Mount | Notes |
|-------|-------|
| Balgora | No page. Wiki hint: "Barlgura" (we already have `barlgura.webp`) — confirm if same. |
| Beholder Rune Board | No page / no icon. |
| Cactus the Hedgehog | No wiki page. |
| Carmine Bulette | No page. We have `bulette.webp` (plain Bulette) — different recolor. |
| Divine Wings | No page / no icon (wings cosmetic). |
| Forever Familiar | No page / no icon. |
| Hag's Cauldron | Ambiguous: wiki has "Hag's Cooking Cauldron" and "Hag's Hexing Cauldron". Confirm which. |
| Halaster's Green Whirlwind | No page. Wiki only has "Halaster's Whirly Whirlwind" (we have it). |
| Hound of the Forge | Page exists but no inventory icon uploaded. |
| Legendary Adolescent Deep Crow | Page exists but icon is "Noicon" placeholder. We have `adolescent-deep-crow.webp` (epic). |
| Lunar New Year's Dragonnel | No page / no icon. |
| Mechanical Goose | No wiki page. |
| Medium Snowswift Steed | Wiki hint: "Medium Snowswift Horse" — confirm if same mount. |
| Mystical Butterfly Wings | No page / no icon (wings cosmetic). |
| Neo Eclipse Lion | No page. We have `eclipse-lion.webp` — different recolor. |
| New Year's Rabbit | No page / no icon (we got New Year's Ox and Tiger). |
| Rune Board | Page exists but no inventory icon uploaded. |
| Sienna Tribal Lion | No wiki page. |
| Skyhold Throne | No page / no icon. |
| Slaghound | Page exists but no inventory icon uploaded. |
| Snowtusk | No wiki page. |
| Suratuk's Blue Poisonous Looking Spider | No page (we have plain "Poisonous Looking Spider"). |
| Suratuk's Giant Spider | No page. Wiki hint: "Suratuk's Banded Spider" (we have it) — recolor. |
| Suratuk's Orange Poisonous Looking Spider | No page (recolor). |

## How to add a missing icon
1. Drop the icon image into `images/mounts/` named in slug form
   (lowercase, no apostrophes, spaces → hyphens), e.g. `cactus-the-hedgehog.webp`.
2. Add a line to `data/mount-images.js`:
   `"Cactus the Hedgehog": "cactus-the-hedgehog.webp",`
3. No build step needed — `mount-images.js` is hand-maintained, not generated.
4. Reload `mounts.html` to confirm the icon shows.
