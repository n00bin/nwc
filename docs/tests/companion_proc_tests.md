# Companion proc measurement tests

Two things we cannot read off a tooltip, written as repeatable in-game procedures.
Both use the character sheet as the measuring instrument, because it reports the
live value of every rating.

Record results at the bottom of this file, then Claude writes them into the data.

---

## Ruling and current state (n00b, 2026-09-11)

24 of our 30 enhancements describe themselves as **"Chance on hit to ..."**. All 24
are now flagged `conditional` in the data, which means Toon Forge keeps them **out of
the at-rest stat panel** and shows them in the **combat / Show conditional** view.
That is the ruling: in practice the proc is up almost continuously once a fight is
going, so it belongs behind the combat buff rather than in the unbuffed sheet.

Before this change only Perfect Vision was flagged, so the other 23 were inflating the
at-rest panel. **161 companions** carried a self-affecting one. The other 81 use
enemy-scope debuffs, which the engine already skipped.

The five **Enduring** enhancements say "While your companion is summoned and not
downed" and remain genuinely always-on. **Reinvigorate has no description text at all**
in our data and is left unflagged until someone reads its tooltip.

**What the test is still for:** we want the real proc chance, so the card can state it
instead of only saying "chance on hit". The modelling question is settled; the number
is not.

---

## Test A — is an enhancement a proc, and what are its numbers?

Run this once on **any one** chance-on-hit enhancement first. If it behaves as a proc,
the finding applies to the class and we only spot-check the rest.

Subject: **Perfect Vision** (n00b's pick). It buffs your Accuracy directly, so your own
character sheet moves, and it is carried by 15 companions including Abyssal Chicken.

**What we are trying to learn**
1. Does the buff show on the character sheet while standing still, out of combat?
2. What triggers it?
3. Roughly how often does it fire?
4. How long does it last after you stop attacking?

**Key fact (n00b, 2026-09-11):** a companion only **unlocks** its enhancement. The rune
is equipped independently and needs neither that companion summoned nor slotted. So the
clean way to isolate it is to **leave one companion summoned and unchanged, and swap the
rune in and out**. Companion item level, its power stats and its bolster all stay
constant, so the only thing that moves is the enhancement. Unsummoning would change
several things at once and ruin the reading.

Avoid enemy-scope enhancements as a test subject (Vulnerability, Blurred Vision,
Dulled Senses, Armor Break, Weapon Break, Slowed Reactions, Precision Breaker) - those
debuff the target, so your own sheet never moves.

**Steps**

1. Stand somewhere quiet and out of combat, with no campfire, no VIP, no potions and
   no zone buff. Let every buff icon clear.
2. Summon any companion and leave it alone for the whole test. Note which one and its
   rarity - the buff scales off the **summoned** companion's item level, whichever
   companion unlocked the rune.
3. Make sure nothing else in the build touches **Accuracy** (active companions, mount
   insignia bonuses, food, enchantments). Anything else that procs Accuracy pollutes
   the reading.
4. With **Perfect Vision NOT equipped**, write down your exact Accuracy. This is the
   baseline.
5. Equip **Perfect Vision**, still standing still and out of combat, and write down
   Accuracy again. **If it has not moved, the buff is off at rest and our conditional
   model is right. If it has moved, the model is wrong and we revert.**
6. Go to a target dummy and attack continuously, watching Accuracy. Write down the
   highest value it reaches. Subtract the step 4 baseline to get the proc size.
7. Stop attacking and keep watching. Write down how many seconds pass before Accuracy
   drops back. The tooltip claims 15 seconds.
8. From a clean state, count how many hits you land before Accuracy first jumps.
   Repeat five times and note each count. That gives the rough chance per hit.

**Record**

| Field | Value |
|---|---|
| Enhancement tested | Perfect Vision |
| Stat | Accuracy |
| Summoned companion used (and rarity) | not recorded - ask |
| At rest, rune NOT equipped | Accuracy 138,402 (53.6%), TIL 139,797 |
| At rest, rune equipped | **138,402 - no change** |
| Peak during combat | |
| Duration after last hit | |
| Hits to first proc (5 trials) | |
| Peak minus baseline (proc size) | |

---

## Test B — what does Kelemvor's Sword actually grant?

Acolyte of Kelemvor's **Kelemvor's Sword** grants Critical Avoidance "based on your
companions level and total Critical Avoidance". It prints no number, so we cannot
store a value or score it in the optimizer.

**Steps**

1. Summon Acolyte of Kelemvor. Out of combat, write down your own **Critical
   Avoidance** from the character sheet, and the companion's Critical Avoidance
   from its own stats page.
2. Enter combat and let the companion cast Kelemvor's Sword. Write down the highest
   Critical Avoidance your sheet reaches, and how long it lasts.
3. Change the companion's own Critical Avoidance by a large amount, by swapping its
   runestones or gear, and write down the new companion figure.
4. Repeat step 2 with the new setup and write down the new peak.
5. Two readings at different companion Critical Avoidance values let us work out
   whether the grant is a flat share, a percentage of the companion's stat, or
   scales with its level.

**Record**

| Trial | Companion Critical Avoidance | Your CA at rest | Your CA peak | Duration |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |

---

## Results

### Test A, steps 1-5 — n00b, 2026-09-11 — **PROC CONFIRMED**

Standing still, out of combat, base item level 139,797:

| Rune | Accuracy |
|---|---|
| Perfect Vision NOT equipped | 138,402 (53.6%) |
| Perfect Vision equipped | 138,402 — **no change** |

Equipping the rune moves nothing at rest. The buff is genuinely off until it procs,
so **`conditional: true` on all 24 chance-on-hit enhancements is correct** and the
at-rest stat panel should not credit them. No revert needed.

This was tested by swapping the rune with the companion left summoned, so item level,
companion power stats and bolster were all held constant — the rune was the only
variable.

### Test A, step 6 — proc size — **it is percentage POINTS, not rating**

Celestial companion summoned, so Perfect Vision is at its 9% maximum.

| | Accuracy rating | Accuracy % |
|---|---|---|
| At rest | 138,402 | 53.6% |
| Procced | **138,402 — unchanged** | **62.6%** |

The rating never moves. The buff adds **9 percentage points** straight onto the final
percentage: 53.6 + 9 = 62.6 exactly.

**This confirms the engine is already correct.** `toon-forge-engine.js` computes
`finalPct = ratingContribPct + percentTotal`, i.e. percent bonuses are added as points
on top of the rating contribution and never touch the rating itself. No change needed.

### Test A — the companion triggers it, not just you

n00b, 2026-09-11: **the proc fired while he was not attacking at all.** The companion's
own attacks trigger it. The tooltip only says "Chance on hit" and never says whose hit.

Two consequences:
- All 24 proc triggers now read "On hit, including your companion's own attacks".
- Counting your own hits is meaningless while the pet lands its own in between, so
  step 8 as originally written cannot work. **Test A2 solves it** by using a companion
  that never attacks.

### Test A, step 7 — duration — **15 seconds, confirmed**

n00b, 2026-09-11: the proc appears **in the buff bar with a visible 15 second countdown**.
The tooltip's 15 seconds is correct.

### TEST A IS CLOSED

| Question | Answer |
|---|---|
| Is it a proc, or always on? | A proc. Zero change at rest. |
| What does it add? | Percentage POINTS on the final percentage, never rating. |
| What triggers it? | Any hit, **including the companion's own attacks**. |
| How long? | 15 seconds. |
| Chance per hit | **Test A2 below** — measurable by removing the pet's hits. |

Everything here matches how we now model it: `conditional: true`, shown behind the
combat buff, value added as percent points.

### Instrument note for every future proc test

**The buff bar shows these procs with a live countdown.** That is a far better
instrument than the character sheet, which you cannot watch while fighting. For any
future proc work — mount powers, gear procs, companion powers — check the buff bar
first: it gives you the trigger, the duration and whether the effect refreshes or
stacks, without any arithmetic.

---

## Test A2 — the proc chance, with the pet's hits removed

The problem with counting hits is that the companion attacks too. **Augment companions
do not attack.** Summon one and every trigger is yours, so a straight count works.

We have 33 augments. Good choices, because their rarity is easy to hold fixed:
**Black Dragon Ioun Stone**, **Baby Owlbear** or **Baby Deep Crow** (all base Mythic),
or any Ioun Stone you have at Celestial.

The buff bar is the instrument — the proc shows there with its 15 second countdown, so
you do not need the character sheet at all.

**Steps**

1. Summon an **augment** companion. Keep **Perfect Vision** equipped. Note which augment
   and its rarity.
2. Go to a target dummy. Confirm the augment is not attacking it — augments never do.
3. Land **single, deliberate at-will hits**, counting them, and stop the moment
   Perfect Vision appears on your buff bar. Write down the count.
4. Wait for the buff to fully expire (15 seconds), then repeat. Do this **ten times** —
   the count varies a lot, so a handful of trials is not enough to pin a percentage.
5. If the buff appears on the very first hit every single time, the chance is likely
   100% with an internal cooldown instead. In that case, note how many seconds pass
   between one proc ending and the next one being able to start.

### Test A2 RESULT — n00b, 2026-09-11 — **20 trials**

Augment summoned: **Proud Pink Yeti (Celestial)** — confirmed in-game that it does not
attack, so every trigger was the player's own hit. The enhancement still procs with an
augment out, so the "companion is near" condition is satisfied. (It was stored
`augment: false` — corrected as part of this test.)

Hits to proc, 20 trials:
**1, 2, 4, 7, 2, 26, 8, 12, 8, 9, 11, 2, 11, 2, 9, 2, 2, 6, 17, 9**

150 hits, 20 procs, mean 7.5 hits per proc.

| | |
|---|---|
| Point estimate | **13.3% per hit** |
| 95% range | 8.1% to 19.8% |
| 20% | ruled out |
| 10% / 12.5% / 15% | all still possible |
| Best-fitting round number | **12.5%, exactly 1 in 8** |

The 26-hit trial is ordinary variance at this rate, not an internal cooldown.

Stored on Perfect Vision as `chanceApprox: 13.3` with all 20 raw trials kept. The card
shows "~13.3% (measured over 20 trials)" so it never reads as an exact game figure.

**Not copied to the other 23 enhancements** — they share the wording but the number is
unmeasured for them. One more 20-trial run on a different enhancement would show
whether the family shares a single rate; if it does, applying 12.5% across the family
would be justified.

Doubling again to 40 trials would only tighten the range to roughly 9.5-18%, which
still would not separate 10% from 15%. Not worth the time.

---

## Still outstanding

- Test A2, the proc chance.
- Test B, Kelemvor's Sword.
