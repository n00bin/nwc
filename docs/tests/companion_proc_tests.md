# Companion proc measurement tests

Two things we cannot read off a tooltip, written as repeatable in-game procedures.
Both use the character sheet as the measuring instrument, because it reports the
live value of every rating.

Record results at the bottom of this file, then Claude writes them into the data.

---

## Why Test A matters

23 of our 30 companion enhancements describe themselves as **"Chance on hit to ..."**,
which is a proc, not a standing buff. Only **one** of them (Perfect Vision) is flagged
as conditional in our data. The other 22 are currently treated as always-on.

Those 22 are attached to **242 of 274 companions**, so if they really are procs, the
standing stat panel in Toon Forge is crediting a buff that is not up at rest for
almost every companion in the database.

The six **Enduring** enhancements (Precision, Alacrity, Craft, Guard, Senses, plus
Reinvigorate) say "While your companion is summoned and not downed", which is a
genuine always-on buff. Those are not in question.

---

## Test A — is an enhancement a proc, and what are its numbers?

Run this once on **any one** chance-on-hit enhancement first. If it behaves as a proc,
the finding applies to the class and we only spot-check the rest.

Suggested subject: **Vulnerability** on Acolyte of Kelemvor, or **Precision**
(21 companions) if you would rather test the most common one.

**What we are trying to learn**
1. Does the buff show on the character sheet while standing still, out of combat?
2. What triggers it?
3. Roughly how often does it fire?
4. How long does it last after you stop attacking?

**Steps**

1. Summon the companion carrying the enhancement. Stand somewhere safe, out of
   combat, and let every buff drop. Open the character sheet and write down the
   exact value of the affected stat. For Vulnerability that stat sits on the enemy,
   so use **Perfect Vision (Accuracy)** or **Precision (Critical Strike)** instead,
   which buff you directly.
2. Unsummon the companion. Read the same stat again and write it down. The
   difference between steps 1 and 2 is what the enhancement gives you **at rest**.
   If the difference is zero, it is a proc and our always-on modelling is wrong.
3. Re-summon, go to a target dummy, and attack continuously while watching that
   stat on the character sheet. Write down the highest value it reaches. Subtract
   the step 2 reading to get the **proc size**.
4. Stop attacking and keep watching. Write down how many seconds pass before the
   stat drops back. That is the **duration**. The tooltips claim 15 seconds.
5. Restart the fight from a clean state and count how many hits you land before
   the buff first appears. Repeat five times and note each count. That gives us a
   rough **chance per hit**.

**Record**

| Field | Value |
|---|---|
| Enhancement tested | |
| Stat | |
| At rest, companion summoned | |
| At rest, companion unsummoned | |
| Peak during combat | |
| Duration after last hit | |
| Hits to first proc (5 trials) | |

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

_Nothing recorded yet._
