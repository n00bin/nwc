# Toon Forge — Coverage Audit

Live audit of which Neverwinter systems the Toon Forge stat engine and the
(local-only) optimizer model. Required by the parent `CLAUDE.md` Coverage
Audit Policy. **Update this file whenever Toon inputs, optimizer constraints,
or modeled systems change.**

Status legend: `Implemented` · `Partial` · `Missing`

Last full review: **2026-06-09** (post full-site /audit: 4 of 5 blockers fixed
same-day; numbers below re-counted from live data, not carried forward).

---

## System coverage

| System | Status | Where |
|---|---|---|
| Gear (all slots, per-IL tiers, picked-tier resolution) | Implemented | `toon-forge.html` (`findGearByName`, `state.gear`/`state.gearIL`), `../data/gear.json` (6,376 entries) |
| Gear set bonuses (incl. role-conditional `eb.role`; Freezing 2-pc pairs gated on piece count) | Implemented | engine equip-bonus ingestion (`eb.setName` matching, `setPieceCounts`); role filter at every ingestion path |
| Gear equip bonuses — structured | Partial | see §Partial-1 |
| Zone-gated bonuses (Content-zone picker) | Implemented | `#content-zone-select` (Step 6) → `state.contentZone`; gate at both ingestion paths (`eb.zones`); data convention = base + zone DELTA (in-zone total = base+delta, never both-at-full); 72 zone-tagged entries |
| Sequence-proc damage layer ("use Daily → next Encounter +X%") | Implemented | `computeSequenceProcBoost()` — parses gear FREE TEXT directly, weights by rotation share; see §Note-2 landmine |
| Gear reinforcement kits | Implemented | `../data/kits.json`, kit chips per slot |
| Frostsilver gem synergy | Implemented | `gemSynergy` field + `buildEngineCharacter` merge (only while matching enchant slotted) |
| Enchantments (stats + Universal CR 1620 + gemstone multi-stat) | Implemented | `../data/enchants.json`, `pushEnchant` (CR fix b6f0043); bonus enchants contribute 0 TIL (verified) |
| Overloads | Implemented | `../data/overloads.json`; contribute 0 Total Item Level (owner-verified 2026-06-07) |
| Weapon Artifact Modifications (Off Hand Art Mod 1 + 2; Main Hand Enhanced power) | Partial | `state.artifactMods`; Art Mod 1 fixed owner-verified values, Art Mod 2 clamped entry; see §Partial-3 |
| Artifacts (primary + 3 secondary) | Implemented | `../data/artifacts.json` |
| Companions: summoned + 5 active, rarity scaling | Implemented | `../data/companions.json` / `companion_powers.json` |
| Companion proc effects (`statEffects`, always-on passives) | Implemented | engine routes percent/rating/flat; Passive+100%+self = base panel |
| Companion enhancements | Implemented | `../data/companion_enhancements.json` |
| Companion gear | Implemented | routed via `buffs[]` (`compGearToBuff`) — see §Note-1 landmine |
| Companion bolster (IL × bolster%) | Implemented | verified formula; companion gear/enchant do NOT affect it |
| Mounts: combat power (125% bolster anchor) | Implemented | magnitudes stored at 125%; engine scales `(1+b/100)/2.25`; `anchorRarity` for Celestial captures |
| Mounts: equip powers, insignias, insignia bonuses, collars | Implemented | `../data/mount_*.json`; 5-mount loadout rules; mount powers count TIL at rarity IL (Celestial 3,937 vs Mythic 3,000); mount-collection bolster grants NO TIL (2026-06-07 re-add reverted 2026-06-10 — anchor build was stale; see history note in toon-forge.html) |
| Combined Rating distribution (15 stats) | Implemented | `CR_CORE_STATS` in `toon-forge.html` — in-game verified incl. Forte/Control Bonus/Control Resist |
| Stat caps / rating formula / Forte distribution | Implemented | `toon-forge-stats.js` (caps), `toon-forge-engine.js` (rating→%, Forte 50/25/25) |
| Ability scores (per-point conversions) | Implemented | `ABILITY_CONVERSIONS`; CON→HP lives ONLY in the HP model (double-count fixed 2026-06-05) |
| Max HP model (TIL×10×role + flats, ×CON, ×HP%) | Partial | see §Partial-2 |
| Boons (campaign + guild) | Implemented | `../data/campaign_boons.json`, `guild_boons.json` |
| Races | Implemented | `../data/races.json` |
| Classes / paragons / feats / powers | Implemented | `../data/classes.json`, `general_feats.json`; stance/song/sparks modeled; Soulweaver class-shared features + Soul Puppet added 2026-06-07 |
| Consumable buffs | Implemented | `../data/buffs.json` → `buffs[]` (double `Buff: Buff:` source prefix is intentional — the Hide-buffs filter keys on it) |
| Damage layer: buckets + proc damage (companion + gear) | Implemented | `DAMAGE_BUCKET_MAP`, proc cadence × chance × magnitude; Xuna ~+14% meta-verified |
| Party allies / Pack meta (Raptor) | Implemented | `partyPackMeta` toggle; ally equip powers at Mythic (factor 1.0) |
| Detailed Stats explainability (Hide buffs / Hide party buffs / Hide in-combat bonuses, proc-uptime tags) | Implemented | three consistent "Hide X" toggles (in-combat default-hidden, checkbox checked = hidden); uptime % shown on proc stat-grant lines |
| Share links / saved builds | Implemented | `serializeBuild`/`applyBuild`; incl. `gearIL`, sim settings (`flankUptime`, `simMag`), `contentZone`, `artifactMods` |
| Resource & heal proc engine layers | Missing | see §Missing-1 |
| Optimizer (engine-scored, role objectives) | Implemented (local-only) | `js/optimizer-local.js` — gitignored, paid IP, never deployed; button lives in the local-only "Premium" hero group |
| Conditional-uptime weighting — ALL bonuses (OPT-G1, 2026-06-10) | Implemented | `conditionalDamageUptime` applies to every gear/overload equip bonus (stat grants included, no longer damage-buckets-only) and to non-passive companion proc stat-grants (duty-cycle from structured trigger/chance/duration/cooldownSeconds; party-scope Pack stacks exempt). Kill switch `CONDITIONAL_UPTIME.apply_to_stat_grants=false`; per-bonus pin `uptimeOverride` (0..1, NaN-guarded) on gear equip bonuses and companion `procEffect`. Lines credited <100% show `~X% uptime`. 11 gear.json pins shipped (6 Charged Rejuvenation @0.90, 5 Living Magma @0.55) |

---

## Partial entries — what's missing to reach full optimizer support

### Partial-1: Gear equip bonuses (free-text long tail)
- **Location:** `../data/gear.json` `equipBonuses[]`; parse conventions in
  `docs/audit/eb_parse_progress.md`; parse scripts `scripts/eb_parse_batch*.py` (parent repo).
- **Current (re-counted 2026-06-09):** 2,952 of 4,810 equip-bonus entries are
  structured (`stat`+`amount`) and scored by the engine; 1,478 remain
  description-only. The 2026-06-08 parse batches added four whole families:
  always-on percent grants, combat-time stackers (counted at max), enemy-count
  bonuses (`requiresMultiEnemy` gate vs single-target), and proc stat-grants
  (`uptimeWeighted` at sustained uptime). Zone-gated bonuses use the base+delta
  convention and are live behind the Content-zone picker.
- **Required:** continue parse batches; each structured bonus immediately counts
  in stats/optimizer (no engine change needed for plain stat bonuses). Do NOT
  structure sequence-proc texts (§Note-2).

### Partial-2: Max HP calibration
- **Location:** `toon-forge-engine.js` finalize() HP branch; constants `TOON_FORGE_HP_MODEL`.
- **Current:** full formula implemented; CON double-count removed 2026-06-05
  (~7% overshoot fixed). Anchor on file: Erik (healer Paladin, TIL 126,775,
  CON 14 → 1,588,795 HP).
- **Required:** n00b's HP calibration screenshot to validate flats/percent
  sources against the anchor, then tune `TOON_FORGE_HP_MODEL` if needed.

### Partial-3: Main Hand Enhanced powers (Artifact Modification Management)
- **Location:** `state.artifactMods`, Enhanced-power menus in `../data/classes.json`.
- **Current:** all six Warlock Enhanced options captured from owner screenshots
  (+10% to one power; damage picks boost that power in the sim while slotted;
  healing/per-stack picks recorded but excluded from the sim).
- **Required:** in-game screenshots of the other seven classes' Enhanced menus
  before their options can appear.

## Missing entries

### Missing-1: Resource & heal proc engine layers
- **Location (data ready):** ~324 gear equip bonuses describing resource gain
  (AP/stamina/divinity/Soulweave) and heal procs sit unparsed in
  `../data/gear.json` (was ~430; the 2026-06-08 batches structured the rest).
- **Current:** display-only; contribute nothing to scores.
- **Required:** an engine layer that converts resource/heal procs into role
  value (healer throughput, AP uptime). Blocked on modeling decisions, not data.

---

## Notes / landmines

- **Note-1:** `buildEngineCharacter` hardcodes `companionGear: {}` — companion
  gear is routed ONLY via `buffs[]`. If a refactor ever populates the
  `companionGear` field, it will double-count. (Audit 2026-06-05 #30.)
- **Note-2:** the sequence-proc layer (`computeSequenceProcBoost`) parses gear
  description FREE TEXT directly ("use a Daily → next Encounter +X%"). Do NOT
  add structured `stat`/`amount` to those ~21 bonuses — the engine would count
  them twice (once uptime-weighted, once at face value).
- **Note-3:** zone matching is EXACT-string (`eb.zones.includes(contentZone)`).
  Overlaps (e.g. should "Thay" also trigger "Fire-themed maps"?) are not
  modeled; revisit if a zone belongs to two gear vocabularies.
- **Note-4:** `conditionalDamageUptime` returns 1 for zone-tagged bonuses — the
  zone gate upstream already confirmed in-zone, so they are always-on there.
  (Was 0 until 2026-06-09, which silently zeroed every zone delta.)
- **Note-5 (OPT-G1 landmines, 2026-06-10):** the `vs_enemy: 0.0` family matches
  `/\bagainst\b|\bvs\b/` in bonus text — broad on purpose, but a non-enemy use
  of "against" in an effectText would zero a legitimate bonus. Escape hatch:
  set `uptimeOverride` on that bonus. Also: `alwaysActive` must NEVER double as
  an uptime override — it drives the stack-split ingestion (permanent baseline
  + conditional extras); `uptimeOverride` is the only sanctioned pin.
- Engine consumes canonical short stat names (`Deflect`, `Control Resist`);
  legacy long forms still alias via `STAT_NAME_ALIASES` for old saved builds.
- Energon (power 201) +35,000 MaxHP is game-verified and intentionally off the
  MAX_HP scale — do not normalize.
- Open data verifications that affect scoring quality live in
  `docs/data_issues.md` (Demonweb Empowerment stack interval 3s/5s, Flayed
  Legion classes + missing stat, Enchanted Advantage/Awareness real set
  names, set-suffix clusters, clothing-variant slots). Balgora id 56,
  Hellfire Remains, and Ultraviolet Cap were all RESOLVED 2026-06-09.
