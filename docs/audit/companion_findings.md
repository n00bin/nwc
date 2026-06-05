# Companion Power Audit — Findings (2026-06-03)

Source: 267 in-game "Inspect Companion → Player Powers" screenshots (`data/screenshots/companions`),
upscaled 2× and read by a 34-agent vision pass, matched by **power name** to
`companion_powers.json` / `companion_enhancements.json`.

## Headline
- **239 powers observed**, **211 matched the DB cleanly (88%)**, 28 flagged.
- Companion power data is in markedly better shape than gear (which was ~85% clean).

## ✅ Applied (3) — verified pure stat-name swaps (values/scale unchanged)
These Warlock "Insight" powers were mis-entered with a default `Critical Avoidance / Critical Strike`
(or `Defense / Forte`) pair. Confirmed against screenshots:

| id | Power | DB (wrong) | Corrected (screenshot) |
|----|-------|------------|------------------------|
| 205 | Cambion's Insight | Critical Strike, Critical Avoidance | **Accuracy, Critical Severity** |
| 187 | Cryptic Insight | Critical Strike, Critical Avoidance | **Combat Advantage, Defense** |
| 220 | Deceptive Insight | Defense, Forte | **Defense, Awareness** |

## ⚠️ Flagged — NOT auto-applied (need care / your input)

### Missing "Maximum Hit Points" stat line (8) — needs scaling-coordinated fix
DB dropped a `+Maximum Hit Points` line. Verified on **Apprentice's Wisdom** (screenshot shows
`+1,500 Maximum Hit Points` @ IL75 + Incoming Healing; DB has only Incoming Healing). Fixing these
correctly also means re-scaling the *other* stat (1-stat → 2-stat changes its per-stat value), so
they need deliberate edits, not a blind add:
`Apprentice's Wisdom (168)`, `Dragon's Insight (208)`, `Ghost Paladin's Wisdom (162)`,
`Moonshae Druid's Wisdom (165)`, `Skeleton Dog's Instincts (222)`, `Zhentarim Warlock's Wisdom (154)`,
`Crystal Golem's Presence (186)`, `Stormrider's Discipline (128)`.

### Other stat-set differences (3) — verify before fixing
- `Baby Boar's Instincts (84)` — DB `Critical Severity, Maximum Hit Points`; screenshot `Critical Severity, Deflect` (MaxHP→Deflect changes scale).
- `Cleric Disciple's Wisdom (170)` — DB `Incoming Healing, Power`; screenshot showed only `Power` (DB may have an extra stat, or the screenshot line was cut off).

### Value differences (5) — likely vision IL-misreads, DB probably correct
Several read as "1.8 vs DB 3.8 @IL750" — but 1.8 is exactly the IL**375** double-stat value, i.e. the
agent misread the tier. Treat DB as correct unless re-verified:
`Baby Polar Bear's (53)`, `Deva Champion's (210)`, `Divine Answers (146)`, `Quickling's (171)`, `Werewolf's (34)`.

### Slot "mismatches" (10) — DISCARDED (vision errors, DB is correct)
All 10 read "screenshot Defense / DB Offense." Spot-check of **Aranea's Wisdom** shows the tooltip
clearly reads "OFFENSE POWER" — the DB is right; the agent misread the slot header. No action.

### Power names not found in DB (11) — TRIAGED (each screenshot read)

**Resolved automatically:**
- ✅ **Gromph's Conscience → Gromph's Confidence** (power id 137). The tooltip reads "Confidence";
  same companion (Gromph, summons a Barlgura), same signature (Offense / IL375 / Critical Strike).
  Applied as a name fix.
- ↩️ **"Xrgy's Insight" = Xegut's Insight** (already in DB, id 201). Vision typo, no action.
  (The screenshot's "IL375 / 15,000 MaxHP" was a tier-misread; DB IL750 is correct.)

**Needs your decision (1):**
- ⚠️ **Fiendish Charmer's Distraction** (Offense / IL375 / proc: 10% on Encounter, Daze 3s, 10s cd;
  Enh: Potency; companion has succubus powers — Deadly Kiss / Draining Kiss). The DB has a
  *Feywild* Charmer's Distraction with an identical signature. Either the DB name is wrong
  (Feywild→Fiendish) **or** these are two distinct charmer companions. Needs an in-game check of
  which companion owns the DB entry.

**Genuinely MISSING from the DB (8)** — extracted power data below. I did **not** auto-add these:
the companion's own name isn't shown on the "Player Powers" panel, and adding a companion entry
without its verified name would be fabrication. Confirm each companion name in-game and I'll wire
them in (companions.json + companion_powers.json).

| Power | Slot | IL | Stats / Effect | Enhancement | Companion clue (active powers) |
|-------|------|----|----------------|-------------|-------------------------------|
| Sardina's Grace | Offense, Utility | 750 | +3.8% Power, +4% Movement Speed | Enduring Alacrity | cat: Cataclysmic Meow, Murder Mittens, Pounce |
| Halfling Thief's Discipline | Offense | 250 | +1.3% Critical Strike, +1.3% Critical Severity | Blurred Vision | Deft Strike, Sly Brutality, Sly Flourish |
| Blacksmith's Discipline | Utility | 250 | proc: 10% reflect 1.3% dmg taken (≤50k); 4-hit → reflect 3× | Slowed Reactions | Anvil, Hammer, Improved Anvil |
| Dreadwarrior's Insight | Utility | 750 | proc: 10% on dmg taken → enrage, +15% threat 10s | Slowed Reactions | Siphon Strike, Slice of Dread, Warrior's Thirst |
| Mercenary's Discipline | Offense, Utility | 900 | +4.5% Power, +4.5% Combat Advantage | Precision | Deft Strike, Sly Brutality, Sly Flourish |
| Aoth's Wisdom | Offense, Utility | 750 | +3.8% Accuracy, +3.8% Combat Advantage | Keen Eyes | Aoth Fezim: Emerald Darts, Lunge, Lurch |
| Divine Insight | Defense | 250 | +5,000 Maximum Hit Points, +1.3% Critical Avoidance | Redemption | Cleaving Spear, Judgement, Spear of Light, Take A Knee |
| Twitchspine's Resilience | Defense | 750 | proc: 25% on dmg taken → +4% Awareness & +4% Crit Avoidance 7s (10s cd) | Enduring Guard | Bonebreaker, Frenzied Resilience, Spinal Slam |

Also surfaced: enhancement **Keen Eyes** (on Aoth's companion) is not in `companion_enhancements.json` —
likely a missing enhancement too.

### Enhancement names not found (6) — likely vision typos / possibly missing
`Weapon Briar`/`Weapon Breaker` (likely "Weapon Break"), `Counterstrike`/`Countertrace`/`Countrace`
(likely "Counteract"), `Keen Eyes`. Low priority.

## Notes
- 19 power names were fuzzy-matched past obvious OCR typos (e.g. `Rustimonster's`→`Rustmonster's`,
  `Remorhas's`→`Remorhaz's`) — these are reading artifacts, **not** DB errors.
- Proc/equip-only powers (no flat stat lines) were not stat-compared; their DB `stats` arrays
  intentionally model the proc's granted/debuffed stat.
