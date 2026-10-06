# Migration B dry run: Barbarian

Every effect the simulator will read for this class, in plain English. Nothing here changes the live site.
Old blocks stay as the human record. **MISSING** = not on the tooltip, counts zero until captured.
**ASSUMED** = used and labelled in the confidence line.

## Both paragons

- **Raging Criticals** (classFeatures)
  - buff Critical Severity +10% (you), while Battlerage is up
  - buff Critical Severity +10% (you), while Unstoppable is up

## Blademaster

- **Steady Rage** (slottedClassFeatures)
  - +2 Rage, every 1 s, - +2 Rage per second in combat
- **Trample the Fallen** (slottedClassFeatures)
  - buff Trample the Fallen Damage Bonus +5% (you) for 10 s, on each hit from encounter/daily powers
  - debuff Trample the Fallen Damage Taken +5% (on the target) for 10 s, on each hit from encounter/daily powers
- **Bounding Slam** (atWill)
  - Bounding Slam: magnitude set 120, while Battlerage is up, - 120 during Battlerage
- **Not So Fast** (encounter)
  - slow 6 s
- **Punishing Charge** (encounter)
  - stun 3 s
- **Bloodletter** (encounter)
  - heal 100% of damage dealt, - absorbs the damage dealt as hit points
- **Savage Advance** (daily)
  - knockback, MISSING seconds (counts zero)
- **Crescendo** (daily)
  - stun 3 s
- **Battlerage** (mechanic)
  - buff Battlerage Damage Bonus +25%, Incoming Damage -15% (you) for 8.7 s, only when Rage >= 50 and not (while Battlerage is up), - 8.7 s window while attacking (n00b, June); +at-will speed (amount not captured)
  - spend Rage, only when Rage >= 50 and not (while Battlerage is up), - activating spends the Rage (it drains over the window)
  - +0 Rage, on each hit from atWill/encounter/daily powers, MISSING amount (counts zero), - dealing damage, taking damage and kills build Rage: amount not captured (gating test)
- **Barbed Strikes** (slottedClassFeatures)
  - buff Critical Strike +5%, Critical Severity +5% (you), scaled by currentStaminaPct, ASSUMED, - full at full stamina, falling with it (straight line assumed); your stamina slider
- **Raging Strikes** (slottedClassFeatures)
  - buff Damage Bonus +15% (you), scaled by stack:Rage, ASSUMED, - up to 15% by how full the Rage bar is (straight line assumed)
- **Impatience** (slottedClassFeatures)
  - encounter cooldowns -2 s, when Battlerage starts
- **Relentless Speed** (feats)
  - proc: Not So Fast cooldown reset, 15% chance on cast from Relentless Slash, - a free Not So Fast within 6 s
- **Bloodspiller** (feats)
  - Bloodletter: magnitude set 950
  - Bloodletter: cooldownSeconds add -3
  - removes from Bloodletter: heal, - no lifesteal; hurts you instead (amount not stated)
- **Indomitable Rage** (feats)
  - Indomitable Battle Strike: magnitude set 800
  - Indomitable Battle Strike: magnitudePct add 50, scaled by stack:Rage, ASSUMED, - 800 at no Rage to 1,200 at full (straight line assumed)
- **Overpenetration** (feats)
  - buff Damage Bonus +10% (you), scaled by critCapProximity, ASSUMED, - by how close Critical Strike and Critical Severity are to the cap (page wiring pending; straight line assumed)
- **Brutal Critical** (feats)
  - +3 Rage, on a critical hit
- **Steel Slam** (feats)
  - adds to Avalanche of Steel: damage over time 200 x5 over 12 s; slow 3 s
- **Unstoppable Spin** (feats)
  - set Rage to 50, on cast from Spinning Strike, only when Rage < 50
  - buff Battlerage Damage Bonus +25%, Incoming Damage -15% (you) for 14.7 s, on cast from Spinning Strike, not (while Rampage is up), - Battlerage starts on its own, 6 s longer
  - buff Unstoppable Spin Damage Bonus +25% (you) for 14.7 s, on cast from Spinning Strike, not (while Rampage is up), - the bonus is 50% instead of 25%
  - spend Rage, on cast from Spinning Strike, not (while Rampage is up)
- **Escalating Rage** (feats)
  - +1 Escalating Rage, on a critical hit, not (while Battlerage is up)
  - buff Rampage (you) for 20 s, when Escalating Rage is applied, only when Escalating Rage >= 5
  - spend Escalating Rage, when Rampage starts
  - buff Battlerage Damage Bonus +25%, Incoming Damage -15% (you) for 16.7 s, when Battlerage starts, while Rampage is up, - Rampage: Battlerage 8 s longer
  - buff Rampage bonus Damage Bonus +25% (you) for 16.7 s, when Battlerage starts, while Rampage is up, - +25% more
- **Relentless Slash** (atWill)
  - buff Relentless Slash Damage Bonus +5% (you) for 12 s
- **Battle Fury** (encounter)
  - buff Battle Fury Damage Bonus +10% (you) for 10 s
  - buff Battle Fury (allies) Damage Bonus +5% (party) for 10 s, - allies only
  - +0 Rage, MISSING amount (counts zero), - generates additional Rage (amount not on the tooltip)
- **Hidden Daggers** (encounter)
  - set Surprise Attack to 1
  - hit 150, on cast from atWill/encounter/daily powers except Hidden Daggers, while you have any Surprise Attack
  - spend Surprise Attack, on cast from atWill/encounter/daily powers except Hidden Daggers
- **Roar** (encounter)
  - stun 2 s
  - interrupt
  - +0 Rage, MISSING amount (counts zero), - Rage per target hit (not on the tooltip)
- **Avalanche of Steel** (daily)
  - knockdown, MISSING seconds (counts zero)
- **Adamantine Strike** (daily)
  - debuff Adamantine Strike Damage Taken +5% (on the target) for 10 s

## Sentinel

- **Steady Rage** (slottedClassFeatures)
  - +2 Rage, every 1 s, - +2 Rage per second in combat
- **Trample the Fallen** (slottedClassFeatures)
  - buff Trample the Fallen Damage Bonus +5% (you) for 10 s, on each hit from encounter/daily powers
  - debuff Trample the Fallen Damage Taken +5% (on the target) for 10 s, on each hit from encounter/daily powers
- **Bounding Slam** (atWill)
  - Bounding Slam: magnitude set 120, while Unstoppable is up, - 120 during Unstoppable
- **Not So Fast** (encounter)
  - slow 6 s
- **Punishing Charge** (encounter)
  - stun 3 s
- **Bloodletter** (encounter)
  - heal 100% of damage dealt, - absorbs the damage dealt as hit points
- **Savage Advance** (daily)
  - knockback, MISSING seconds (counts zero)
- **Crescendo** (daily)
  - stun 3 s
- **Unstoppable** (mechanic)
  - buff Unstoppable (you), only when Rage >= 50 and not (while Unstoppable is up), MISSING seconds (counts zero), - absorbs up to 60% max HP; window length not measured on the Sentinel (counts zero)
  - spend Rage, only when Rage >= 50 and not (while Unstoppable is up), - activating spends the Rage (it drains over the window)
  - +0 Rage, on each hit from atWill/encounter/daily powers, MISSING amount (counts zero), - dealing damage, taking damage and kills build Rage: amount not captured (gating test)
- **Block** (mechanic)
  - buff Critical Avoidance +15% (you), while Unstoppable is up and only when blocking, - blocking during Unstoppable
- **Raging Bladeturn** (slottedClassFeatures)
  - buff Deflect +5%, Critical Avoidance +5% (you), scaled by stack:Rage, ASSUMED, - up to 5% by Rage (straight line assumed)
- **Furious Reaction** (slottedClassFeatures)
  - +10 Rage, every 10 s, only when staminaDepleted, - when stamina runs dry (block model not built)
  - heal 10% max HP over 10 s, only when staminaDepleted
- **Indomitable Might** (feats)
  - Indomitable Battle Strike: magnitude set 500
  - Indomitable Battle Strike: magnitudePct add 100, scaled by currentHealthPct, ASSUMED, - 1,000 at full health down to 500 (straight line assumed)
- **On the Move** (feats)
  - Not So Fast: magnitude set 350
  - adds to Not So Fast: buff On the Move Movement Speed +20% (party) for 4 s
- **Disarming Takedown** (feats)
  - adds to Takedown: debuff Disarming Takedown Damage Taken +5% (on the target) for 10 s, to damageType physical, - physical attacks
- **Crushing Advance** (feats)
  - adds to Savage Advance: debuff Crushing Advance Outgoing Damage -12% (on the target) for 12 s, removes from Savage Advance: control
- **Inspiring Bravado** (feats)
  - adds to Battle High: buff Inspiring Bravado Maximum Hit Points +15% (party) for 10 s
- **Blood Fury** (feats)
  - Primal Fury (Primal Fury cost): amount set 30
  - Primal Fury (Primal Fury): gate set {'shape': 'threshold', 'key': 'stack:Rage', 'op': '>=', 'value': 30}, - costs 30 Rage
  - Primal Fury (Primal Fury cost): amount set 0, while Unstoppable is up, - free during Unstoppable (and heals for the damage dealt)
- **Sentinel's Slash** (atWill)
  - hit 300 (area), - full 2.8 s charge (a tap is 50); blocks frontal hits while charging
- **Come and Get It** (encounter)
  - pull, MISSING seconds (counts zero)
- **Enduring Shout** (encounter)
  - buff Enduring Shout Maximum Hit Points +20% (you) for 15 s
  - heal 20% max HP
- **Takedown** (encounter)
  - knockdown, MISSING seconds (counts zero)
- **Ignore Weakness** (encounter)
  - stamina gain 50% of the bar, - 50% at full health up to 100% when low
- **Primal Fury** (encounter)
  - hit 200 (area), only when Rage >= 40
  - Primal Fury (Primal Fury): magnitudePct add 200, scaled by currentStaminaPct, ASSUMED, - 200 at full stamina up to 600 at empty (straight line assumed)
  - spend Rage (all held, up to 40), - 40 Rage
  - end Unstoppable, - ends Unstoppable
- **Primal Instinct** (daily)
  - buff Primal Instinct Awareness +30%, Critical Avoidance +90% (you) for 10 s
  - +0 Rage, MISSING amount (counts zero), - Rage over the 10 s (amount not on the tooltip)
- **Battle High** (daily)
  - buff Battle High Maximum Hit Points +35% (you) for 10 s
  - heal 35% max HP

## Not mapped (and why)

- **Rage income**: GATING: Rage from dealing damage, taking damage, kills, Roar, Battle Fury and Primal Instinct is not on any tooltip, nor is Persistent Rage's boost or Relentless Battlerage's x2 of them. Until captured, only Steady Rage (+2/s), Brutal Critical (+3 per crit) and Furious Reaction fill the bar, so Battlerage windows and Primal Fury are a known underestimate in the simulator (the stat panel keeps the Battlerage snapshot, as Stage 1 does).
- **Unstoppable window (Sentinel)**: Window length not measured on the Sentinel: counts zero until captured.
- **Steel Blitz**: 20% chance of a second at-will hit: already the +20% at-will bonus on the panel.
- **Mightier Leap**: A deliberate empty leap then a 780 recast: a play pattern, off by default (review).
- **Rage and Rally, Furious Reaction trigger, Ignore Weakness scaling, Sprint, Block absorb**: Stamina and block model (not built): recorded, no damage.
- **Challenger's Charge, Threatening Presence, Frustrating Slash, Leap into Action, Boasting Takedown, Path of the Sentinel, Challenger's Slash threat**: Threat only, no damage.
- **Overpenetration**: Reads how close your Critical Strike and Severity are to the cap: recorded on a page input that is not wired yet (counts zero).

## Where this differs from today's simulator

The step 2.3 parity check must show exactly these differences and nothing else.

1. Primal Fury: today's simulator casts it every 6 s at 600. New data needs 40 Rage (only known income counts) and scales 200 at full stamina to 600 at empty (your stamina slider, default full = 200).
2. Bounding Slam: today's simulator always uses 80. New data uses 120 while Battlerage / Unstoppable is up.
3. Everything else today's simulator does not model for Barbarian (Rage, Battlerage windows, Relentless Slash and Battle Fury buffs, Trample the Fallen, feats) starts counting where the data has numbers.

## In-game checks this batch adds to the test list

- (gating) Rage gained per hit dealt, per hit taken, per Roar target, from Battle Fury and Primal Instinct; time to rebuild 50 Rage after Battlerage.
- Unstoppable window length on the Sentinel.

## Stack rules

- **Rage**: max 100
- **Escalating Rage**: max 5
- **Surprise Attack**: max 1

Records: 87. Validator: PASS.
