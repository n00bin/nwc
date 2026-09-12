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
| 1 | 8,661 | 109,840 rating / 21.2% | 109,840 rating / **22.2%** | 8s |
| 2 (Rare) | 9,035 | 110,214 rating / 21.0% | 110,214 rating / **22.0%** | 8s |

### Test B baseline — n00b, 2026-09-11

| | |
|---|---|
| Total item level | 138,685 |
| Your Critical Avoidance at rest | 109,840 rating = 21.2% |
| Acolyte of Kelemvor rarity | Uncommon (green) — its base rarity |
| Companion's own Critical Avoidance | 8,661 rating |
| Out of combat | **no change** — expected, Kelemvor's Sword is a cast ability, not a standing buff |

### Test B trial 1 RESULT — **it is a flat percentage, and the tooltip is misleading**

| | At rest | Kelemvor's Sword up |
|---|---|---|
| Critical Avoidance rating | 109,840 | **109,840 — unchanged** |
| Critical Avoidance percent | 21.2% | **22.2%** |
| Companion's own Critical Avoidance | 8,661 | 8,661 — unchanged |
| Duration | | **8 seconds** |

**The grant is +1 percentage point.** The rating never moved, so it is not a share of the
companion's stat. A 10% share would have pushed the rating to 110,706 and a full share to
118,501; neither happened.

That contradicts the tooltip, which says the grant is "based on your companions level and
total Critical Avoidance". Whatever that phrase means, it is not a rating transfer.

Duration is **8 seconds**, not the 15 the enhancement procs use — so durations are
per-ability and cannot be assumed across a companion's kit.

Stored as `Critical Avoidance +1%, 8s` on the Acolyte's summoned bonus.

### Test B trial 2 — does it scale with the Acolyte's rarity?

n00b upgraded the Acolyte **Uncommon (green, IL 150) to Rare (blue, IL 250)**.
New baseline: TIL 139,225, Critical Avoidance 110,214 rating = 21.0%
(formula predicts 20.99% — a fourth match).

This is a clean either/or, because every scaling model we use gives the same answer here:

| If the grant | Grant | Your % reads |
|---|---|---|
| does not scale with rarity | 1.00% | **22.0%** |
| scales linearly with item level | 1.67% | **22.7%** |
| follows the single-stat table | 1.67% | 22.7% |
| follows the double-stat table | 1.67% | 22.7% |

### Test B trial 2 RESULT — **22.0%. It does not scale. TEST B CLOSED.**

| | Trial 1 | Trial 2 |
|---|---|---|
| Acolyte rarity | Uncommon | **Rare** |
| Companion's own Critical Avoidance | 8,661 | **9,035** |
| Your CA rating, at rest and buffed | 109,840 / 109,840 | 110,214 / 110,214 |
| Your CA percent | 21.2% → 22.2% | 21.0% → 22.0% |
| **Grant** | **+1.0 point** | **+1.0 point** |

**Kelemvor's Sword is a flat +1 percentage point of Critical Avoidance for 8 seconds.**
It does not scale with the companion's rarity, its level, or its own Critical Avoidance.

**The tooltip is wrong on every clause.** It reads "granting Critical Avoidance based on
your companions level and total Critical Avoidance". Between the two trials the level
changed *and* the companion's own Critical Avoidance changed, and the grant did not
budge. The player's rating never moves either, so it is not a rating transfer of any
kind. Treat that sentence as legacy text.

Stored with `noRarityScale` so nothing in the tool scales it.

### Lead worth remembering

This is the second time today a companion tooltip described a scaling relationship that
does not exist (the first: "target ally" actually meaning the summoner). **Wording that
claims an ability scales off the companion cannot be trusted without a measurement.**
Where such a claim affects a stored number, measure it or mark it unverified — do not
encode the tooltip's arithmetic.

_(A first baseline of TIL 143,535 / CA 114,205 / 20.7% was discarded — n00b was wearing
gear that interfered. The formula checked out on that reading too: it predicted 20.67%.)_

**Bonus validation from these numbers.** The rating-to-percent formula
`(rating - (TIL - 50,000)) / 1000` gives **21.16%** here against an observed 21.2%.
It also explains the Test A Accuracy reading: it predicts 48.6% where n00b saw 53.6%,
and that 5.0 point gap is exactly percent-type bonuses stacking on top of the rating
contribution — which is the `finalPct = ratingContribPct + percentTotal` model the
engine already uses. Two independent stats, both consistent.

---

## Test C — how often does Bobby swing? (Swing For the Fences uptime)

Bobby's **Swing For the Fences** makes the target take **5% more damage from you and
Bobby for 5 seconds**. Both numbers are read straight off card c087. What we do NOT
have is how often Bobby actually uses it, and without that the uptime is a guess.

Right now the data carries **25%**, borrowed from Succubus because it is the only
other five-second enemy damage debuff we hold. It is flagged `uptimeUnmeasured` and
must not be treated as a finding until this test replaces it.

**What we are measuring:** the average gap, in seconds, between one Swing For the
Fences and the next, while Bobby is in continuous combat.
Then `uptime = min(100%, 5 / average gap)`.

**Why a gap and not a proc chance:** this is not a chance-on-hit like Test A. It is a
companion power on its own AI cadence, so the thing to measure is rhythm, not a rate
per hit. Ten or more gaps is enough to see the cadence.

**Steps**

1. Summon Bobby. Any rarity is fine - power cadence is not a scaling stat, and if it
   turns out to differ by rarity that is a separate finding.
2. Go somewhere with a target that will not die and will not run: a training dummy in
   Protector's Enclave is ideal. A dummy keeps Bobby in continuous combat, which is
   what we want, and removes the risk of the gap being an artifact of things dying.
3. Attack the dummy and keep attacking, so Bobby stays engaged the whole time. Bobby
   only uses powers while actively fighting.
4. Watch for the **wind-up swing** - it is a distinct, slow animation, unlike his
   normal cone attack. If the dummy can be knocked down, the knockdown is an even
   clearer cue.
5. **Count swings inside a fixed 2-minute window** and report just the count. Repeat
   the window a few times. n00b chose 2 minutes over 1 (2026-09-12) - fewer stopwatch
   reads and each round carries twice the sample, so three or four rounds is enough.

**The timing has to happen on your side.** Claude cannot time the gaps between
messages - typing "now" each swing conveys the order but not the seconds, and message
latency would swamp the real gaps. A phone stopwatch and a count is the whole
instrument. This is the same shape as Test A2, where n00b reported hits-to-proc as
numbers rather than Claude observing anything.

`uptime = min(100%, (swings x 5 seconds) / 120 seconds)`

| Swings in 2 minutes | Uptime |
|---|---|
| 3 | 12.5% |
| 4 | 16.7% |
| 6 | 25% |
| 8 | 33% |
| 12 | 50% |
| 24 or more | effectively always on |

The placeholder currently in the data, 25%, is 6 swings in 2 minutes. That is the
number to beat or break.

**If the dummy will not work.** Some dummies are immune to knockdown, which removes
the clearest cue but not the wind-up animation. If Bobby will not engage a dummy at
all, use any normal-difficulty trash mob area where enemies live long enough to watch
several swings, and tell me that is what you did, since respawn gaps would then need
allowing for.

**One thing worth checking while you are there.** If you can see the dummy's or
enemy's debuff icons, tell me whether an icon appears when Bobby swings, and how long
it stays. That would confirm the 5-second duration directly instead of trusting the
tooltip, the same way the buff bar confirmed 15 seconds in Test A.

### Test C results — n00b, 2026-09-12 (in progress)

2-minute windows, dummy, continuous attack.

| Round | Swings in 2 min | Implied uptime |
|---|---|---|
| 1 | 7 | 29.2% |
| 2 | 8 | 33.3% |
| 3 | 8 | 33.3% |
| 4 | 8 | 33.3% |

**31 swings over 480 seconds = one every 15.5 seconds. Uptime 32.3%.**

### TEST C RESULT — **32% uptime, and the 25% placeholder is replaced**

Three of the four windows gave exactly 8, and the spread never left 7-8. That is a
fixed cooldown, not a random roll, which is what we expected from a companion power
rather than a chance-on-hit.

**The cadence is ~15.5 seconds.** A 15-second design cooldown fits well: a perfect 15s
timer yields 8 swings in a 120s window depending on where the window starts, and the
half-second of slack is the wind-up animation and the time he spends on other attacks.
Round 1's 7 is window alignment, not a different rate.

**Stored as 32%**, the measured figure, not the 33.3% that an exactly-15s cooldown
would give. Same principle as Test A2's ~13%: record what was measured and note the
likely design number without asserting it. 33.3% is very likely the real value but we
have not proven the cooldown is exactly 15.

**What this means for Bobby.** 5% damage on the target about a third of the time is a
real contribution, and it now actually reaches the sim after the own-summon fix. It is
still narrower than the party-wide buffs because only n00b and Bobby benefit.

**Not measured:** whether the 5-second duration is exact (the tooltip's number was
taken on trust) and whether the cadence changes with Bobby's rarity.

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
| Raw estimate (n/S) | 13.33% per hit |
| Bias-corrected ((n-1)/(S-1)) | **12.75% per hit** |
| Displayed on the card | **~13%** |
| 95% range | 8.1% to 19.8% |
| 20% | ruled out |
| 10% / 12.5% / 15% | all still possible |
| Best-fitting round number | **12.5%, exactly 1 in 8** |

The 26-hit trial is ordinary variance at this rate, not an internal cooldown.

**Why ~13% and not 13.3%:** the simple estimator `n/S` is known to run high on small
samples. The bias-corrected form `(n-1)/(S-1)` gives 12.75%, and 20 trials only supports
about two significant figures anyway — 13.33% claimed a precision we do not have. So the
card rounds to **~13%**.

**Why not just say 12.5%:** it sits 0.25 points off the bias-corrected figure and one in
eight is exactly the kind of number a designer picks, so it is very likely the truth —
but likely is not proven, and the card should not state a design number we inferred.
It is recorded in the notes as the leading hypothesis.

Stored as `chanceApprox: 13` with all 20 raw trials kept, so the sample can be extended
later without redoing any of it.

### RULING — n00b, 2026-09-11

**One rate for the whole "Chance on hit" family.** All 24 conditional enhancements read
*exactly* "Chance on hit", with no variants, so the Perfect Vision measurement is applied
across all of them. The card distinguishes the two cases honestly:

- Perfect Vision: "~13.3% (measured over 20 trials)"
- The other 23: "~13.3% (same trigger wording, measured on Perfect Vision)"

**Anything worded differently must be retested.** A "chance on getting hit" trigger, or
any trigger that is not a plain on-hit, gets its own 20 trials. None of the current 24
fall into that bucket, but new data will.

**The companion's hits are assumed to proc at the same rate.** Augments are rarely used
in practice, so in a real build the pet is landing most of the hits. Measuring the pet's
rate separately is not practical, and there is no reason to expect the game rolls a
different number for it.

### Does the companion's hits raise the 13.3%?

**No.** 13.3% is a probability **per hit**, not a rate per second. The pet does not change
the odds on any given swing; it changes how many swings happen. Adding its hits into the
percentage would be double-counting and would make the number mean something else.

What the pet does change is **uptime**, and that is the part worth knowing. The buff
lasts 15 seconds and averages one proc per 7.5 hits, so you only need **0.5 hits per
second**, from you and the pet combined, to average one proc per duration:

| Hits landed in a 15s window | Chance the buff is up |
|---|---|
| 5 | 51% |
| 10 | 76% |
| 20 | 94% |
| 30 | 99% |
| 40 | 99.7% |

In a real fight your at-will chain alone clears that bar, and the pet's hits push it
further. This is the arithmetic behind treating these as **effectively always on in
combat**, which is exactly how they are modelled — `conditional: true`, credited behind
the combat buff and kept out of the at-rest panel.

It also explains why the augment was necessary for the measurement: with a normal pet
attacking, the buff would have been re-procced before it ever expired, and counting your
own hits would have been meaningless.

**Why we stopped at 20 trials.** Separating 10% from 15% needs roughly 120 procs, about
960 hits — precision improves only with the square root of the sample:

| Total procs | Hits needed | 95% range | Separates 10/15? |
|---|---|---|---|
| 20 | 150 | 8.1-19.8% | no |
| 40 | ~320 | 8.9-16.7% | no |
| 80 | ~640 | 9.9-15.4% | no |
| 120 | ~960 | 10.4-14.8% | yes |

Not worth it: **the chance is display-only.** Nothing computes with it. These
enhancements are modelled as conditional and effectively always-up in combat, so no
optimizer result or stat panel changes whether the true figure is 12.5% or 13.3%.

---

## Blessings of Kelemvor — partial

- **Duration: 3 seconds** (n00b, 2026-09-11, off the buff bar).
- **10% damage reduction: taken from the tooltip, NOT measured.** Flagged
  `amountFromTooltip`. This companion has already produced two false tooltip claims, so
  the figure is carried as unconfirmed rather than as fact.

Two things left hanging:

1. **Kelemvor's Retribution claims to double the Blessings duration.** So is the observed
   3s already doubled (base 1.5s), or was Retribution not active? Unresolved.
2. **No uptime is set**, so the engine credits this 3-second buff at full strength. On a
   buff this short that is almost certainly too generous — see the open question in
   `companion_verification.md`.

## Still outstanding

- Nothing blocking. Both tests are closed.
