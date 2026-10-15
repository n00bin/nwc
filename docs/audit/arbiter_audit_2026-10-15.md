# Cleric Arbiter audit (2026-10-15)

n00b: "what you need to do now then is audit the cleric arbiter class" (after DIV-1/2 shipped as v2.1).
Method: every Arbiter power / mechanic / class feature / feat in `../data/classes.json` read against the
2026-05-27 tooltip captures (`docs/calibration/inbox/powers/cleric-powers/`, 102 files, transcribed by a
vision pass) and against what the fight simulator (`toon-forge-rotation.js` simulateFx) actually does with
the records. Read-only; nothing changed by the audit itself.

## Verdict on the data

Tooltip numbers match the data for every Arbiter power: magnitudes (incl. the per-paragon ones, Sacred Flame
100, Geas 650, read through `magnitudeByParagon`), Judgement gains and charged magnitudes, divinity costs
(Searing Javelin 240, Forgemaster's Flame 300, Daunting Light 150, Bastion of Health 200), cast times and
action point costs. Encounters with no divinity cost on the tooltip (Sun Burst, Geas, Chains of Blazing
Light, Break the Spirit, Prophecy of Doom, Divine Glow) are correctly free in the data. Cooldowns: data keeps
the base value, the captures show slightly lower values after Recharge Speed (Chains 15.4 vs 15.2, Break the
Spirit 20.3 vs 20, Prophecy 25.1 vs 24.8, Sun Burst 11.6 vs 11.4, Geas 14.5 vs 14.3, Divine Glow 29 vs 28.6) -
consistent, no change.

## Findings (most impact first)

1. **Angel of Death scores zero** (feat tier 5, `fx: null`). "Encounter powers which cost divinity grant
   Angelic Inspiration; at 26 stacks it becomes Angelic Presence (60 s); tap Channel Divinity to gain Angel of
   Death: damaging spells cost no divinity for 12 s." With divinity now in the fight this is the biggest
   missing piece: a Javelin / Flame Arbiter reaches 26 casts in roughly 30-40 s. Open tests from 2026-09-30:
   does the counter reset after converting, do divinity-costing heals (Bastion of Health) count, do the stacks
   drop after 60 s without a cast.
2. **Light of the Scales scores zero** (class feature, `fx: null`): +10% to the divinity Channel Divinity
   restores from the Judgement gauge. Data carries `resource.multiplier 1.1`; the fight ignores it.
3. **Inner Balance scores zero** (feat, `fx: null`): "up to 20" more divinity per gauge dump, when Critical
   Strike = Accuracy (Radiant) / Combat Advantage = Critical Severity (Burning), less the further apart. Open:
   is it +20 per dump or per charge, and the falloff curve.
4. **Divine Glow's divinity regeneration scores zero** (`resource op "regenPct"`, amount missing). The tooltip
   gives no number ("gain Divinity Regeneration", 12 s). Tipping Scales depends on Divine Glow too.
5. **Doomsayer misses Geas.** Doomsayer fires on "an encounter power that inflicts a negative condition"; the
   data lists Chains of Blazing Light, Break the Spirit, Prophecy of Doom. Geas "decreases target's damage
   dealt by 5% for 6 s" - a negative condition by the same reading, and the kit search already picks Geas.
6. **Gauge refund is an estimate** (~70 per charge, from two holds), and the Scales of Judgement review flag
   "dump amount to test" is still open. Findings 2 and 3 multiply this number.
7. **Channel rule with a bigger pool (DIV-3, open)**: "hold to full" makes a +20% max divinity item score
   lower; and whether the channel refills a fixed ~83/s or a % of the bar is untested (every clip had 1,150).
8. **Open September tests that move Arbiter damage** (unchanged, listed for completeness): Perfect Balance
   gap rule ("exceed by a single stack" - the whole feat hinges on it), Critical Insight per crit vs per cast,
   Lightspeed's Daunting Light cast time, Piercing Javelin per hit vs per cast, Critical Sun window, Burning
   Patch ticks, Tipping Scales with both kinds held, Divine Equilibrium's real curve, gauge cap of 6 per kind.
9. **Divinity-regen gear works but matters little** (n00b: the MSoD helmet, Visage of the Eternal Herald,
   Ruthless Resources 5% x 10 = +50% regen; also in the data): natural regen 7.2 -> 10.8/s in the fight, but an
   Arbiter channels anyway and the channel (~83/s) is not sped up by Ruthless Resources (boots-off test), so
   these items move Arbiter damage by ~1-2%. Correct as modelled; worth knowing when reading results.

Not findings: Hallowed Armor and Soothing Prayer (defensive / self-heal while channelling, now live but not
scored for damage); Pilgrim's Light (party toggle); Expanded Faith (wired through `resourcePools`).

## Transcription notes

Captured on two characters (Arbiter and Devout headers). Arbiter versions differ from Devout on Sacred Flame
(100 vs 90), Geas (650 vs 700), Daunting Light cost (150 vs 100), Bastion of Health (heal 1,200 / cost 200 vs
1,600 / 100) and the Channel Divinity mechanic itself (Arbiter: refill channel; Devout: Mark / Light of
Divinity / Gathering Light). Low-confidence reads to re-check if they ever matter: Tipping Scales says
"divine judgement" (lowercase), Divine Glow's regen clause.
