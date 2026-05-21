# Combat Power Magnitude Audit — 2026-05-21

## Background

User reported Tunnel Vision (id 33) showed wrong magnitude in the calculator. Investigation found stored magnitude was `5000` but in-game at Celestial + 125% bolster the value is `3938`. The stored value came from the **Mount Preview** screen, which displays at a different state than actual cast magnitude.

**The mismatch may apply to every other combat power whose data note says "Screenshot ... (Mount Preview)".**

Tunnel Vision was fixed: stored 5000 → 3000 (so 3000 × 1.3124 = 3937, matching in-game 3938).

## Calibration rule

Stored magnitude SHOULD be at the **Mythic-125%-bolster baseline**. To verify in-game:
- Set mount to **Celestial** rarity
- Confirm bolster is at **125%** (your character's bolster)
- Note the magnitude shown in-game
- That value = `stored × 1.3124` per the design (cap rule)
- If the predicted value below MATCHES in-game, data is correct
- If MISMATCH, recalibrate: `correct stored = in-game value / 1.3124`

## Checklist (57 entries)

For each, check in-game at Celestial + 125% bolster. If predicted ≠ in-game, recalibrate.

| id | name | IL | stored mag | predicted Celestial-125 (`stored × 1.3124`) | in-game actual | status |
|---:|------|---:|-----------:|---------------------------------------------:|---------------:|:------:|
|  1 | Ethereal Vortex                  | 3000 |   800 |  1050 |  |   |
|  3 | Magnificent Inspiration          | 3000 |  1000 |  1312 |  |   |
|  4 | Vortex of Despair                | 3000 |   700 |   919 |  |   |
|  5 | Mystic Fireball                  | 3000 |   600 |   787 |  |   |
|  7 | Call of the Heavens              | 3000 |   920 |  1207 |  |   |
|  8 | Arcane Siege Volley              | 3000 |  1150 |  1509 |  |   |
| 10 | Eclipsed Armament                | 3000 |   600 |   787 |  |   |
| 13 | Spore Explosion                  | 3000 |   750 |   984 |  |   |
| 15 | Sand Coffin                      | 3000 |   345 |   453 |  |   |
| 16 | Lolth's Gift                     | 3000 |   920 |  1207 |  |   |
| 17 | Uni's Charge                     | 3000 |  2250 |  2953 |  |   |
| 19 | Shadowy Rush                     | 3000 |  1000 |  1312 |  |   |
| 21 | Actions Speak Louder             | 3000 |  2400 |  3150 |  |   |
| 22 | Hot Streak                       | 3000 |   400 |   525 |  |   |
| 23 | School's in Session              | 3000 |   700 |   919 |  |   |
| 24 | Invigorating Foxfire             | 3000 |   920 |  1207 |  |   |
| 25 | Skyhold Alligator's Bellow       | 3000 |   730 |   958 |  |   |
| 26 | Necrotic Roar                    | 3000 |   700 |   919 |  |   |
| 27 | Psionic Blast                    | 3000 |   800 |  1050 |  |   |
| 28 | Dragon Nugget Bomb               | 3000 |   700 |   919 |  |   |
| 29 | Perilous Polymorph Potion        | 3000 |   400 |   525 |  |   |
| 30 | Grubshank SMAAASH                | 3000 |  1800 |  2362 |  |   |
| 31 | Explosive Equalizer              | 3000 |  1000 |  1312 |  |   |
| 33 | Tunnel Vision                    | 3000 |  3000 |  3937 | 3938 | ✓ FIXED |
| 34 | Infernal Pounce                  | 3000 |  3000 |  3937 |  |   |
| 35 | Phantasmic Wake                  | 3000 |   700 |   919 |  |   |
| 36 | Dark Vortex                      | 3000 |   700 |   919 |  |   |
| 37 | Empowered Dragonbone Whirl       | 3000 |  3450 |  4528 |  |   |
| 38 | Dragonbone Whirl                 | 2000 |  2300 |  3019 |  |   |
| 39 | Marvelous Balloon Bombardment    | 3000 |   920 |  1207 |  |   |
| 41 | Cauldron Gasses                  | 3000 |   490 |   643 |  |   |
| 42 | Cauldron Fumes                   | 3000 |   490 |   643 |  |   |
| 43 | Cannon Siege Volley              | 3000 |  1150 |  1509 |  |   |
| 44 | Mow Down                         | 3000 |  1000 |  1312 |  |   |
| 45 | Meteoric Impact                  | 3000 |   800 |  1050 |  |   |
| 46 | Rush of Torment                  | 3000 |   920 |  1207 |  |   |
| 47 | Crystal Eruption                 | 3000 |  1000 |  1312 |  |   |
| 48 | Giant Toad Tongue Lash           | 2000 |  2000 |  2625 |  |   |
| 49 | Hell on Faerûn                   | 3000 |  1725 |  2264 |  |   |
| 52 | Trample                          | 3000 |  1000 |  1312 |  |   |
| 53 | Vortex                           | 2000 |   533 |   700 |  |   |
| 56 | Call of the Stars                | 3000 |   920 |  1207 |  |   |
| 57 | Arcane Maelstrom                 | 3000 |  1000 |  1312 |  |   |
| 58 | Rain of Spines                   | 3000 |   800 |  1050 |  |   |
| 60 | Black Ice Storm                  | 3000 |  1000 |  1312 |  |   |
| 62 | Path of Fire                     | 3000 |  1000 |  1312 |  |   |
| 63 | Flail Snail                      | 3000 |  1000 |  1312 |  |   |
| 64 | Ferocious Roar                   | 3000 |   800 |  1050 |  |   |
| 65 | Imperious Stomp                  | 3000 |   800 |  1050 |  |   |
| 66 | Strider Fire                     | 3000 |  1000 |  1312 |  |   |
| 67 | Spinning Axe Strike              | 3000 |  1000 |  1312 |  |   |
| 68 | Rush of Despair                  | 3000 |   920 |  1207 |  |   |
| 71 | Disintegration Beam              | 3000 |  1000 |  1312 |  |   |
| 72 | Divine Intervention              | 3000 |  1000 |  1312 |  |   |
| 74 | Call of the Cosmos               | 2250 |   690 |   906 |  |   |
| 75 | Rain of Shards                   | 3937 |   910 |  1194 |  |   |
| 76 | Frozen Stamp                     | 3937 |  1050 |  1378 |  |   |
| 78 | Grand Inspiration                | 3937 |  1332 |  1748 |  |   |
| 83 | Ground Slam                      | 3937 |   788 |  1034 |  |   |

## How to fix a mismatch

1. Find the entry in `G:\ai_projects\NWCB\data\mount_combat_powers.json` by id
2. Replace `"magnitude": X` with `"magnitude": ROUND(in-game / 1.3124)`
3. Update the note to reflect the in-game verification
4. Run `python build-data.py` in `G:\ai_projects\NWCB\website`
5. Hard-refresh the toon-forge and re-verify

## Important context

Per Decision 9 in `mount-rarity-scaling-design.md`: combat power scaling is **tooltip-only** in v1. These calibration errors only affect the detail-card tooltip display — they do NOT affect the stat panel or build optimization scores. So while the audit is worth doing for correctness, it's not blocking gameplay-affecting features.

## Possible systemic patterns to watch for

If the "Mount Preview" screen consistently shows values at, say, "Mythic at 100% bolster" rather than "Mythic at 125% bolster", then ALL Mount Preview captures would be off by the same factor:
- Mythic-100% factor = `(1 + 100/100) / 2.25 = 0.889`
- Mythic-125% factor = `(1 + 125/100) / 2.25 = 1.0`
- Conversion: `actual_mythic-125 = preview / 0.889 * 1.0 = preview × 1.125`?  But Tunnel Vision was off by `3000/5000 = 0.6`, not `0.889` — so this isn't the pattern.

More likely: Mount Preview shows the **maximum possible value** (Celestial-rarity-equivalent magnitude, not bolster-scaled). If so:
- preview = stored × 1.3124 (Celestial scaling, no bolster scaling at preview)
- For Tunnel Vision: preview 5000 / 1.3124 = 3810 → close to but not exactly 3000

Or: Mount Preview is a separate display that shows IL-based magnitudes, not the actual combat-cast magnitude.

The Tunnel Vision data point suggests in-game cast at Celestial-125% = 3938, stored should be 3000. The ratio `3000/5000 = 0.6 = 3/5`. Could mean Mount Preview multiplies stored by ~1.67. No clear systemic factor — each entry needs individual verification.
