# Fighter Dreadnought audit (2026-10-20)

n00b picked Dreadnought (23 open TEST flags, 6 provisional records; the most among classes he can log into after the
Paladin and Rogue paths already done). Two passes: (1) every feat and class feature through the real scored fight;
(2) tooltip spot check against `docs/calibration/inbox/powers/fighter-powers/` (Vengeance, Seethe, Reprisal, Roiling
Hatred, Brazen Slash, Executioner's Cut, Crushing Blows, Bloody Reprise all match the stored text; the full screen read
was done 2026-10-01, DG-x rulings).

## Summary

1. **FIXED 2026-10-20 - Vigorous Strikes scored 0.** Its stamina gate had no full-stamina default, and the scored fight is
   not handed the stamina slider, so it read 0% stamina. The other four stamina-gated records (Barbed Strikes, Primal
   Fury, Divine Retribution, Burning Vengeance) already carry `default: 100`. Added the same to both Fighter copies:
   kit A 1,144,664 -> 1,180,125 (+3.1%).
2. **The Vengeance gauge has almost no income in the fight.** Blocking (`amount` missing), Seethe (`fx: null`) and
   Reprisal's per-hit fill (`amount` missing) all add 0. The only sources are Roiling Hatred (+2 per crit, rolled per
   hit as an assumption) and Always Spiteful (55 at the pull). Vengeful (+20% damage) uptime: 81% / 76% with Roiling
   Hatred, and swapping it for Bloody Reprise costs -29.5% / -20%: the tier-5 choice, Enduring Vengeance, Plow the Road,
   Weight of Vengeance, Trip Attack, Crushing Blows, Executioner's Cut and Landwaster all ride on a gauge we never
   measured. Same shape as the Assassin's Stealth refill before 2026-10-17. Top test.
3. **Brazen Slash per-hit magnitude** (100 x 3 per 0.5 s cast, flipped 2026-10-01, still untested) decides the filler:
   Brazen Slash is 228 of ~290 casts in kit A. Reave has the same per-hit question.
4. Smaller, from the stored TEST flags: Crushing Blows / Roiling Hatred per hit or per cast; Executioner's Cut cost per
   cast or per target and whether a second encounter in 2 s loses the first slice; Bloody Reprise cooldown; Trip Attack's
   combat advantage window; Ricochet roll per cast; Second Wind lifesteal; Marathon Runner out-of-combat speed missing
   from the sheet.

## Simulator-side findings (zero-value check, 2026-10-20)

Method: the page's real scored fight (pt2ScoredSetup + pt2SimScored, crits on), 180 s, one enemy.
Kit A: Brazen Slash + Heavy Slash; Anvil of Doom / Knee Breaker / Commander's Strike; Earthshaker + Determination.
Kit B: Guarded Strike + Shield Bash; Shield Slam / Griffon's Wrath / Bull Charge; Mow Down + Shockwave.
Base feats Trip Attack / Ricochet / Crushing Blows / Landwaster / Roiling Hatred; features Vigorous Strikes + Greater
Endurance. Base (before the fix): A 1,144,664, B 591,402.

| Swap | Kit A | Kit B |
|---|---|---|
| T1 Trip Attack -> Weight of Vengeance | -0.46% | 0.00% (neither power slotted) |
| T2 Ricochet -> Prepared Slam | 0.00% | 0.00% (neither power slotted) |
| T3 Crushing Blows -> Executioner's Cut | -8.76% | +0.03% |
| T4 Landwaster -> Striker's Mark | -0.44% | 0.00% |
| T5 Roiling Hatred -> Bloody Reprise | **-29.50%** | **-20.01%** |

| Feature next to Vigorous Strikes | Kit A | Kit B |
|---|---|---|
| Greater Endurance | 0.00% (movement) | 0.00% |
| Shield Talent | 0.00% (stamina regen) | 0.00% |
| Combat Superiority | +3.10% | +2.65% |
| Momentum | 0.00% (no Bull Charge) | +7.03% |
| Plow the Road | 0.00% (no Shield Slam) | -3.41% |
| Always Spiteful | +2.04% | +4.10% |
| Enduring Vengeance | +1.11% | +2.28% |

Vigorous Strikes alone and Greater Endurance alone scored the same before the fix (finding 1).

1. **Bloody Reprise looks terrible only because Vengeance has no income** without Roiling Hatred's crit refills
   (finding 2). Re-check after the gauge is measured.
2. **Plow the Road lowers damage** in kit B: +200 on Shield Slam costs 10 Vengeance and pulls the gauge under the
   Vengeful line. Plausible with today's tiny income; re-check after 2.
3. Greater Endurance / Shield Talent / Marathon Runner are movement or stamina only: correctly 0 for damage.
