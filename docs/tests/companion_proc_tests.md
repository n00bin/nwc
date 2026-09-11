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
| Summoned companion used (and rarity) | |
| At rest, rune NOT equipped | |
| At rest, rune equipped | |
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

_Nothing recorded yet._
