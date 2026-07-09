# Screenshot Capture Checklist — updated 2026-07-07 (evening, post-Wave-2)

One page to keep open while playing. Ordered by value — #1 can change what the
optimizer recommends; everything below it fixes or confirms display data.
Drop the screenshots anywhere (or paste them in a session) and Claude files
them into the calibration archive — no need to rename anything.

**General tips:** tooltip/panel fully open, Item Level visible, scroll all the
way down before shooting, one item per shot.

## ~~1. Trainer's Restoration stacking test~~ ✅ DONE 2026-07-08
Measured live (full-AP vs used-AP deltas): 3,500 / 5,250 / 6,125 for 1/2/3
copies — exact 100%/50%/25% diminishing curve, matching the engine's default.
Encoded on insignia bonus id 18; nothing further needed.

## ~~2. Whisper of Power 2-piece value~~ ✅ DONE 2026-07-08
Confirmed +7,200 Forte (Oathbreaker's Malevolence Whisper of Power_IL3400_set_details.png).

## ~~2b. Survivalist's Expertise stacking test~~ ✅ DONE 2026-07-08
Combo-break probe: second copy = exactly 2,500 (50% of base). Same 100/50/25
law as Trainer's Restoration; encoded on insignia bonus id 20. Protocol note
for future unconditional bonuses: break the combo by SWAPPING an insignia
(slot stays filled) rather than unslotting — an unslotted insignia's own
stats pollute the reading.

## ~~3. Dirgeblade IL 3750 set details~~ ✅ DONE 2026-07-08
Full capture filed (…_set_details_full.png): 3%/3% confirmed, 9s/15s text
corrected, and the equip line proven flat +5,200 Power (stored 5% was wrong —
fixed). Dirgeblade ladder now proven end to end.

## ~~4. Company PvE Armor — does a 4-piece bonus exist?~~ ✅ DONE 2026-07-08
It doesn't — the tooltip has no set section at all (Company Raid Mask proof
filed). The family is intentionally blank; database was already correct.

## ~~5. Blood Bargain 2-piece~~ ✅ DONE 2026-07-08
Confirmed +12% Movement Speed / +3% Forte in Thay — the old records' 3% was
right; the 8% from the restored text was wrong and is corrected. Per-item
crit-proc confirmed too. Proof filed.

## 6. Single-tooltip quick shots (one screenshot each)
- **Enchanted Bregan D'aerthe Assassin's Longboots** — STILL OPEN (the
  *Leathers*, id 4004, was resolved 2026-07-08 — Liquid Luck confirmed, phantom
  "Precise Teamwork" entry removed — but the Longboots pair 2791/4006 is a
  different item with a positional close/far bonus and still needs its shot).
- ~~**Visor of the Red Bastion**~~ ✅ DONE 2026-07-08 — yes, it has the
  Thay-Defense bonus (+2.3% in Thay); added (Wave 4 had skipped it).
- ~~**Crown of the Everscourge**~~ ✅ DONE 2026-07-08 — Recharge Speed 3%
  (corrected from a description-sourced 5%).
- ~~**Vambraces of the Tyrant's Grip**~~ ✅ DONE 2026-07-08 — Defense 4%
  confirmed (drift flag cleared).
- ~~**Greaves of the Unbroken Doctrine**~~ ✅ DONE 2026-07-08 — SWAPPED to
  40% Movement Speed / 13% Incoming Healing (we'd had them reversed).
- **Demon Skull** (artifact) — file the proof image for its stats (two old
  records disagreed 5% vs 3% on its debuff).
- **Astral Raider's Jackboots** — Scaled Disdain text (cosmetic tidy-up).
- **Visage of the Eternal Herald** — old records and current text disagree on
  whether its bonus is resource MAX or resource REGEN.
- **Mask of the Bloodletter** — an old 20% Encounter-damage proc vanished from
  its records entirely; tooltip settles whether it still exists.
- **Iridescent Diamond Pendant** — 8th "total-loss" item: no bonus data
  survives anywhere; only a tooltip can restore it.
- Value-drift confirmations (one tooltip each, low priority): Cuirass of the
  Crimson Reckoning (3.3%?), Ebon Crusader's Aegis set panel (Forte 8%?),
  Eilistraee's rings (5,000 Forte?), Visage of the Undying Faith (stacking
  regen model).

## 6b. Healer collar sweep (in-game collar list)
The database can only supply 2–3 heal-relevant collars for a healer's five
stable slots — likely a data-supply gap, not reality. Browse the collar
vendor/collection list in-game and screenshot any pages showing collars with
**Outgoing Healing, Incoming Healing, Defense, or Awareness** stats — anything
missing from our 75 known collars gets added.

## 6c. Name-collision pairs — real in-game names needed
Seven database pairs share a name + item level but are genuinely different
items (different bonuses/classes). Before renaming them, we need their REAL
in-game names — screenshot each item's tooltip if you ever encounter them:
Prismatic Crystalflex Bracers, Prismatic Bismuth Mail, Crystalflex Bracers,
Fractal Barbut (plus the Skinstealer pair — its two rows disagree on a
stacking proc).

## 6d. From the Wave 8 sweep (consumables + mount powers)
- **Effervescent Tidespan Potion** tooltip — its stored stat says "Recovery",
  a name that doesn't exist; the potion currently contributes 0.
- ~~**Tenser's Floating Disk**~~ ✅ DONE 2026-07-08 — confirmed: its power is
  Tenser's Transformation (+15% Base Damage Boost / +15% Movement Speed /
  +2 STR-DEX-CON, 60s), NOT the Rejuvenating Favor heal our data linked.
  Fixed the link on both mounts (120/336) and completed the power's data.
  (Its equip power Rapid Accuracy is correctly linked but has empty stats —
  a Mythic-tier tooltip would fill its Accuracy value.) Soft follow-on: other
  UNIQUE/premium mounts could be similarly mis-linked to a common stock power
  (Explosive Equalizer / Tunnel Vision / Rejuvenating Favor) — spot-check any
  named mount whose combat power looks generic.
- **Predator's Grace** (mount equip power) tooltip — its stored Combined
  Rating breaks the file-wide 0.9×IL rule; verify CR + the 3-stat kit.
- **Unified Crescent Collar** (any rank) tooltip — its CR ladder (200-type)
  breaks the Unified family's 180-ladder; likely a copy-paste from the
  Practical template.
- **Grand Summer Feast** tooltip — confirm Deflect is 1.5% (corrected from a
  2.5% transcription; every other stat matched the source guide).
- **Rejuvenating Favor** (mount combat power, Golden Rage Drake) tooltip at
  TWO mount rarities (e.g. Mythic and Celestial) — settles whether the 20%
  MaxHP heal scales with rarity/bolster. Currently modeled unscaled (Wave 12,
  2026-07-08); no in-game evidence either way yet.
- **Combat-power buff % rarity scaling — general question** (Wave 14): do a
  combat power's self-buff PERCENTAGES (e.g. +15% Base Damage Boost) change
  with mount rarity, or only the magnitude/recharge? All self-buffs are now
  modeled rarity-invariant. Most-affected single case: **Relentless Hunter**
  (id 14, self Accuracy +9.8%) is stored at a Celestial anchor, so if the %
  DOES scale, its DPS credit runs ~31% high. Any two-rarity combat-power
  tooltip comparison settles the whole class.
  **CHARACTERIZED 2026-07-08 (three consistent points) — it scales, and our
  Mythic anchors are correct.** Tenser's Transformation 11.3%/15% and
  Rejuvenating Favor 15%/20% both = 0.750× at IL2250; Infernal Pounce
  magnitude 3,000→3,938 at max = 1.3127× (the known Celestial bolster ratio).
  So the curve is: sub-Mythic tier ×0.75, Mythic anchor ×1.0 (our stored
  values), Celestial max ×1.31. **Refinement is LOW VALUE and deferred:** the
  combat-power SCORING layer values at the Mythic anchor while the optimizer
  defaults to Celestial — but the scale factor is uniform across all combat
  powers, so the optimizer's PICK never changes (monotonic transform); it
  would only make the displayed contribution match the card. Not worth a
  scoring-convention change touching all combat-power credit. Question RESOLVED
  — our data is right; no engine change warranted.

## 7. Chilling Flow — Frostbound tier (IL 4800)
Any Frostbound weapon's set-details panel; per-stack values for this tier are
unverified.

## 8. From the Wave 2 sweep (artifacts + boons)
- ~~**Life Lessons master boon tooltip**~~ ✅ DONE 2026-07-08 — chance is 10%
  (engine had guessed 20%), R3 heal corrected 15→10%/rank, durations 4s.
  Same shot closed the Erik Boons-tab re-capture below.
- **Charm of the Serpent** — close-up of the Use-effect line (settles a 16%
  vs 2% damage-taken reading).
- **Skull Lord Staff at Mythic** — the Gold Bonus % at max rank (stored value
  is mistyped and unverified).
- **Aurora's Whole Realms Catalogue** — same Gold Bonus issue, any rank helps.
- **Demon Skull** — full tooltip (two database records disagree 5% vs 3% on
  its debuff; also files the missing evidence image).
- **Any artifact tooltips at all** — the recharge time on ~136 of 140
  artifacts is an unverified default (60s in data; the 7 checked all read
  180s in-game). Every artifact tooltip you shoot fixes its cooldown +
  provenance. Especially wanted: Memories (Redeemed), Champion's Battle
  Horn, Crown of the Undead (stored with NO stats at all), Globe of the
  Third Eye, Mystic Bolt.
- **Enhanced Application + Blessed Resilience boon tooltips, re-framed** —
  the first captures cut off the point-cost footer.
- ~~**Erik's Boons tab (Masters view)**~~ ✅ DONE 2026-07-08 — captured
  together with the Life Lessons tooltip (masters 4/5/8 at 3/3, 104 spent,
  rank gates re-confirmed).

## ~~9. The one screenshot that settles 45 open clusters~~ ✅ DONE 2026-07-08
Answered: **per-class variants are real** (Hammerstone Mask vs Helmet proof —
different names, different secondary stats, same slot/IL/CR). All 45 clusters
+ the 32 conservative skips keep every row. Proof filed.

## 10. From the Wave 5 sweep (companion gear + belts)
- ~~**Molten companion-gear**~~ ✅ DONE 2026-07-09 — all 9 pieces (IL2200)
  found already-filed in the archive and verified exact against the data.
- **Thayan companion-gear tooltip** — the OTHER 9 (ids 1–9, IL2600) still have
  zero screenshots anywhere; any tooltip extends the now-verified pattern.
- **Empowered Chain of Scales, zoomed on the Stamina Regeneration line** —
  tooltip reads "6%" but every lower tier runs 0.02–0.05%; confirm whether
  it's really 6% or a game typo for 0.06%.

## 11. From the Wave 3 sweep (enchantments)
- ~~**Celestial Lightning Flash tooltip**~~ ✅ DONE 2026-07-08 — 12% confirmed
  at Celestial; Accuracy/Crit Strike proven to be 3.6%/stack ×3 stacks
  (structure refined); proof filed.
- **Recharge Bonus at Uncommon, Rare, or Celestial** — Epic/Legendary/Mythic
  are now proven; the outer rungs are still estimates (low priority).

## Backlog (when bored, not urgent)
- **177 gear sets with no set-bonus text** — the full IL-sorted list lives in
  `docs/missing_set_bonuses.md`.
- **Artifacts** — most families have no capture at all; any artifact tooltip
  you shoot is new evidence (the community sheet's values are not trusted).
