# Tank EHP validation vs NW Hub (2026-07-13)

Cross-checked our Toon Forge **tank survivability math** against the NW Hub
community EHP calculator (`nw-hub.com/mechanics/ehpcalc` + `/ehpmath`).

**Method (why it's authoritative):** NW Hub's calculator only exposes the
*player's* defensive stats as inputs — the *enemy* stats are hidden constants.
So I drove the live Angular calculator (puppeteer, set inputs → read the
`.result-value` EHP), fixed a clean base HP (IL=100000, HP bonus=0 → base
HP = 1,200,000 at tank role bonus ×1.2), then varied one defensive stat at a
time to back out each hidden term. The driver reproduces NW Hub's own default
output **exactly** (4,819,672.131 EHP), so the reverse-engineered numbers are
trustworthy.

## Reverse-engineered enemy profile (all fits exact)

| Enemy stat | NW Hub (derived) | Our tank `toon-forge.html:17582` | Match |
|---|---|---|---|
| Combat Advantage | 90% @ 100% uptime | `ENEMY_CA = 0.90` (always on) | ✓ |
| Crit Chance | 50% | `ENEMY_CRIT = 0.50` | ✓ |
| Crit Severity | 90% | `ENEMY_CRIT_SEV = 0.90` | ✓ |
| **Accuracy** | **0 — no accuracy term exists** | `"0% Accuracy"` | ✓ |
| Power | not in EHP (relative; factors out of build comparison) | included as constant, factors out | ✓ |

Derivations that pinned CA and crit:
- EHP(awa=90)/EHP(awa=0) = **1.9000** and EHP(awa=45)/EHP(awa=0) = **1.31034**
  → CA amp = `1 + 1.00·(0.90 − awareness)` (enemy CA 90%, uptime 100%).
- EHP(critAvoid=90)/EHP(0) = **1.4500**, EHP(critAvoid=45)/EHP(0) = **1.18367**
  → crit amp = `1 + 0.50·(0.90 − critAvoid)` (enemy crit 50% chance / 90% severity).
- Scale check: base HP / (CA_amp × crit_amp) = 1,200,000 / (1.9 × 1.45) =
  435,571.69 = measured all-zero EHP. ✓ confirms base HP = IL·10·1.2.

## Confirmed per-term formula (and that we match)

| Term | NW Hub (empirical) | Our tank |
|---|---|---|
| Base HP | IL·10·RoleBonus (tank 1.2) | ✓ |
| Defense | `(100 + Defense)/100` (no enemy armor-pen) | `defenseDiv = 1 + defense` ✓ exact |
| CA / Awareness | `1 + (0.90 − awareness)`, clamp ≥ 0 | `1 + max(0, ENEMY_CA − awareness)` ✓ |
| Crit / Crit Avoid | expected value `1 + 0.50·(0.90 − critAvoid)` | probabilistic `pCrit·critMult` = same expected value ✓ |
| **Deflect severity** | reduction `sev/(sev+100)` — perfect fit, **no offset** | `1/(1+deflectSev)` = `1 − sev/(sev+100)` ✓ algebraically identical |
| Deflect chance | caps at **90%** | Deflect stat total cap is 90% → same limit ✓ |
| Deflect severity cap | caps at **120%** (reduction flat beyond, max 54.5%) | Deflect Severity total cap is 120% → same limit ✓ |

## The "tank deflect gap" was a misread — there is none

An earlier pass read NW Hub's *flattened MathML* formula text as
`DeflectSeverity − EnemyAccuracy`. The **live calculator disproves that**:
deflect reduction is a clean `sev/(sev+100)` with **no accuracy offset** (sev=5
gives exactly 5/105, not (5−acc)/…). There is no enemy-Accuracy term anywhere
in EHP. Our tank's `deflectDiv = 1 + deflectSev` already matches NW Hub exactly.

**Do not re-open a "tank deflect / enemy-accuracy" fix.** Our tank scorer is
validated correct against the community reference, enemy Accuracy included
(it's zero in both). Note: our `deflectDiv`/DPS `e.deflectSev − accuracy` are
opposite sides of the table — the DPS term (your Accuracy vs an enemy's Deflect
when *attacking*) is correct and unrelated to the tank's *defensive* deflect.

Lesson: when a formula comes from scraped/flattened math, **drive the live
calculator to verify** before acting on the text — MathML flattening silently
drops grouping and can invent terms that aren't there.
