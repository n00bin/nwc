# Toon Forge — Coverage Audit

Live audit of which Neverwinter systems the Toon Forge stat engine and the
(local-only) optimizer model. Required by the parent `CLAUDE.md` Coverage
Audit Policy. **Update this file whenever Toon inputs, optimizer constraints,
or modeled systems change.**

Status legend: `Implemented` · `Partial` · `Missing`

Last full review: **2026-06-05** (post site-wide audit; 41/62 findings fixed).

---

## System coverage

| System | Status | Where |
|---|---|---|
| Gear (all slots, per-IL tiers, picked-tier resolution) | Implemented | `toon-forge.html` (`findGearByName`, `state.gear`/`state.gearIL`), `../data/gear.json` (6,373 entries) |
| Gear set bonuses (incl. role-conditional `eb.role`) | Implemented | engine equip-bonus ingestion (`eb.setName` matching); role filter at every ingestion path |
| Gear equip bonuses — structured | Partial | see §Partial-1 |
| Gear reinforcement kits | Implemented | `../data/kits.json`, kit chips per slot |
| Frostsilver gem synergy | Implemented | `gemSynergy` field + `buildEngineCharacter` merge (only while matching enchant slotted) |
| Enchantments (stats + Universal CR 1620 + gemstone multi-stat) | Implemented | `../data/enchants.json`, `pushEnchant` (CR fix b6f0043) |
| Overloads | Implemented | `../data/overloads.json` |
| Artifacts (primary + 3 secondary) | Implemented | `../data/artifacts.json` |
| Companions: summoned + 5 active, rarity scaling | Implemented | `../data/companions.json` / `companion_powers.json` |
| Companion proc effects (`statEffects`, always-on passives) | Implemented | engine routes percent/rating/flat; Passive+100%+self = base panel |
| Companion enhancements | Implemented | `../data/companion_enhancements.json` |
| Companion gear | Implemented | routed via `buffs[]` (`compGearToBuff`) — see §Note-1 landmine |
| Companion bolster (IL × bolster%) | Implemented | verified formula; companion gear/enchant do NOT affect it |
| Mounts: combat power (125% bolster anchor) | Implemented | magnitudes stored at 125%; engine scales `(1+b/100)/2.25` |
| Mounts: equip powers, insignias, insignia bonuses, collars | Implemented | `../data/mount_*.json`; 5-mount loadout rules |
| Combined Rating distribution (15 stats) | Implemented | `CR_CORE_STATS` in `toon-forge.html` — in-game verified incl. Forte/Control Bonus/Control Resist |
| Stat caps / rating formula / Forte distribution | Implemented | `toon-forge-stats.js` (caps), `toon-forge-engine.js` (rating→%, Forte 50/25/25) |
| Ability scores (per-point conversions) | Implemented | `ABILITY_CONVERSIONS`; CON→HP lives ONLY in the HP model (double-count fixed 2026-06-05) |
| Max HP model (TIL×10×role + flats, ×CON, ×HP%) | Partial | see §Partial-2 |
| Boons (campaign + guild) | Implemented | `../data/campaign_boons.json`, `guild_boons.json` |
| Races | Implemented | `../data/races.json` |
| Classes / paragons / feats / powers | Implemented | `../data/classes.json`, `general_feats.json`; stance/song/sparks modeled |
| Consumable buffs | Implemented | `../data/buffs.json` → `buffs[]` (double `Buff: Buff:` source prefix is intentional — the Hide-buffs filter keys on it) |
| Damage layer: buckets + proc damage (companion + gear) | Implemented | `DAMAGE_BUCKET_MAP`, proc cadence × chance × magnitude; Xuna ~+14% meta-verified |
| Party allies / Pack meta (Raptor) | Implemented | `partyPackMeta` toggle; ally equip powers at Mythic (factor 1.0) |
| Share links / saved builds | Implemented | `serializeBuild`/`applyBuild`; incl. `gearIL`, sim settings (`flankUptime`, `simMag` added 2026-06-05) |
| Resource & heal proc engine layers | Missing | see §Missing-1 |
| Optimizer (engine-scored, role objectives) | Implemented (local-only) | `js/optimizer-local.js` — gitignored, paid IP, never deployed |

---

## Partial entries — what's missing to reach full optimizer support

### Partial-1: Gear equip bonuses (free-text long tail)
- **Location:** `../data/gear.json` `equipBonuses[]`; parse conventions in
  `docs/audit/eb_parse_progress.md`; parse scripts `scripts/eb_parse_batch*.py` (parent repo).
- **Current:** ~1,320 of 2,748 prose bonuses structured (`parsedFrom: "description"`)
  and scored by the engine. ~1,081 long-tail prose bonuses are display-only.
- **Required:** continue parse batches; each structured bonus immediately counts
  in stats/optimizer (no engine change needed for plain stat bonuses).

### Partial-2: Max HP calibration
- **Location:** `toon-forge-engine.js` finalize() HP branch; constants `TOON_FORGE_HP_MODEL`.
- **Current:** full formula implemented; CON double-count removed 2026-06-05
  (~7% overshoot fixed). Anchor on file: Erik (healer Paladin, TIL 126,775,
  CON 14 → 1,588,795 HP).
- **Required:** n00b's HP calibration screenshot to validate flats/percent
  sources against the anchor, then tune `TOON_FORGE_HP_MODEL` if needed.

## Missing entries

### Missing-1: Resource & heal proc engine layers
- **Location (data ready):** ~430 gear equip bonuses describing resource gain
  (AP/stamina/divinity) and heal procs sit unparsed in `../data/gear.json`.
- **Current:** display-only; contribute nothing to scores.
- **Required:** an engine layer that converts resource/heal procs into role
  value (healer throughput, AP uptime). Blocked on modeling decisions, not data.

---

## Notes / landmines

- **Note-1:** `buildEngineCharacter` hardcodes `companionGear: {}` — companion
  gear is routed ONLY via `buffs[]`. If a refactor ever populates the
  `companionGear` field, it will double-count. (Audit 2026-06-05 #30.)
- Engine consumes canonical short stat names (`Deflect`, `Control Resist`);
  legacy long forms still alias via `STAT_NAME_ALIASES` for old saved builds.
- Energon (power 201) +35,000 MaxHP is game-verified and intentionally off the
  MAX_HP scale — do not normalize.
- Open data verifications that affect scoring quality live in
  `docs/data_issues.md` (companion scaling clusters, set-suffix clusters,
  clothing-variant slots).
