# Toon Forge engine vs NW Hub mechanics — full cross-check (2026-07-14)

Cross-checked every Toon Forge combat formula against NW Hub's mechanics pages
(prose formulas + live calculators driven with puppeteer and reverse-engineered
where the enemy constants were hidden). **Result: our engine matches NW Hub on
every mechanic.** Extends the tank-only record in
`tank_ehp_validation_2026-07-13.md`.

## Per-mechanic result

| Mechanic | NW Hub | Our engine | Verdict |
|---|---|---|---|
| Base damage/heal | IL/10 × role (DPS 1.2 / Heal 1.1 / Tank 1.0) | `ROLE_MULT` | ✅ |
| Base HP | IL×10 × role (Tank 1.2 / Heal 1.1 / DPS 1.0) | HP model | ✅ |
| Rating → % | `50 + (rating−IL)/1000` | engine line 566 | ✅ |
| Rating/total caps | 50/60 rating, 90/120 total | `ratingCapForStat` + stat caps | ✅ |
| Power | `1 + Power%` (power=100 → 2× verified) | `powerMult` | ✅ |
| Combat Advantage | `1 + CA%` | dmg scorer | ✅ |
| Crit (damage) | `1 + CritSev%` | dmg scorer | ✅ |
| Crit (healing) | **CritSev halved** (`1 + CritSev%/2`) | `critHealMult = 1 + critSev/2` | ✅ |
| Outgoing Healing | `1 + OH%` | `healMult` (+OOH uncapped) | ✅ |
| Damage bonus | `1 + bonus%` | damage boost layer | ✅ |
| Recharge | `Base CD / (1 + RS%/100)` | `cdBase / (1 + rsi)` | ✅ (+6s base-cd data guard) |

## Enemy constants — reverse-engineered from the calculators, match exactly

**Tank EHP calc → enemy OFFENSE** (`computeTankExpectedTaken`, line 17582):
Combat Advantage 90% @ 100% uptime · Crit 50% / CritSev 90% · **Accuracy 0**.

**Damage calc → enemy DEFENSE** (`getEnemyStats`, line 17363):
Defense 50% (the 2/3 base-damage factor) · Deflect 50% · Deflect Severity 90% ·
Awareness 0 · Crit Avoidance 0 · Accuracy 0. Reverse-engineered values:
- all-zero non-crit = 9,600 = base 14,400 × 2/3 → **enemy Defense 50%**
- deflected/normal = 5,052.6 / 9,600 = 100/190 → **enemy Deflect Severity 90%**
- expected-value solve → **enemy Deflect Chance 50%**
- accuracy counters deflect: `100/(100 + DeflectSev − Accuracy)` = our
  `1/(1 + deflectSev − accuracy)` ✅

So both halves of the combat model are validated: the tank scorer against the
enemy's *offense*, the DPS scorer against the enemy's *defense*, and they use
identical constants to NW Hub.

## Our deliberate additions (not disagreements)
- **6s base-cd data guard** (recharge): floors a mis-recorded sub-6s cooldown
  before the `/(1+RS)` division so one bad data row can't dominate a rotation.
  Never binds on real cooldowns (all ≥10s) → identical output to NW Hub.
- **Overall Outgoing Healing** uncapped multiplier (healing): extra correct
  modeling NW Hub's simple calc doesn't expose.

## Method note
NW Hub calculators expose only *player* stats; enemy stats are baked constants.
Drove the Angular calcs with puppeteer (native-setter input events), read the
result/​breakdown, and solved for the hidden enemy constants — same technique as
the tank EHP reverse-engineering. Prose formulas confirm the multiplier forms;
the crit-severity-halved-for-healing note is explicit on NW Hub's healing page.
