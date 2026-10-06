# Migration B dry run: Ranger

Every effect the simulator will read for this class, in plain English. Nothing here changes the live site.
Old blocks stay as the human record. **MISSING** = not on the tooltip, counts zero until captured.
**ASSUMED** = used and labelled in the confidence line.

## Hunter

- **Seeker's Vengeance** (slottedClassFeatures)
  - buff Damage Bonus +10% (you), only when behindTarget, - from behind the target
- **Crushing Roots** (slottedClassFeatures)
  - Grasping Roots (Weak Grasping Roots): seconds mult 2
  - Grasping Roots (Strong Grasping Roots): seconds mult 2
  - daze 0.5 s, on cast from Hindering Shot, Plant Growth, not (only when targetControlImmune)
  - daze 1 s, on cast from Hindering Strike, Constricting Arrow, Commanding Shot, Cordon of Arrows, Binding Arrow, not (only when targetControlImmune), - control only; whether the immune-target damage changes is a test
- **Aspect of the Pack** (slottedClassFeatures)
  - buff Combat Advantage +5% (party), not (only when soloOrIsolated), ASSUMED, - 1% per friendly in 30 ft (you included), max 5%: a full group in range assumed; 0 solo
- **Aspect of the Serpent** (slottedClassFeatures)
  - +1 Serpent (ranged-built), on cast from powers tagged stance ranged
  - +1 Serpent (melee-built), on cast from powers tagged stance melee
  - buff Damage Bonus +3% (you), to type atWill/encounter, tags {"stance": "melee"}, scaled by Serpent (ranged-built) stacks, - ranged-built stacks buff melee attacks (maximum stacks unknown)
  - buff Damage Bonus +3% (you), to type atWill/encounter, tags {"stance": "ranged"}, scaled by Serpent (melee-built) stacks
  - spend Serpent (ranged-built) (all held, up to 1), on each hit from powers tagged stance melee, - each buffed attack spends one
  - spend Serpent (melee-built) (all held, up to 1), on each hit from powers tagged stance ranged
- **Rapid Strike** (atWill)
  - hit 55 (single)
  - hit 25 (single), on every 4th cast, - the fourth hit is enhanced (80 / 120)
- **Split Shot** (atWill)
  - hit 220 (area), - full 2.1 s focus (a tap is 95)
- **Rain of Swords** (encounter)
  - hit 200 (area)
  - damage over time 200 over 8 s
- **Plant Growth** (encounter)
  - hit 150 (area)
  - damage over time 200 over 4 s
- **Marauder's Escape** (encounter)
  - confuse 1 s
- **Marauder's Rush** (encounter)
  - confuse 1 s
- **Steel Breeze** (encounter)
  - stamina gain 10% of the bar, - per enemy hit
- **Seismic Shot** (daily)
  - pull, MISSING seconds (counts zero)
- **Ranged Stance** (mechanic)
  - buff Ranged Stance (you), at the pull, - starting stance (review default)
  - buff Ranged Stance (you), on cast from powers tagged stance ranged, not (while Ranged Stance is up), - casting a ranged-stance power swaps to Ranged Stance
  - end Melee Stance, on cast from powers tagged stance ranged
- **Melee Stance** (mechanic)
  - buff Melee Stance (you), on cast from powers tagged stance melee, not (while Melee Stance is up), - casting a melee-stance power swaps to Melee Stance
  - end Ranged Stance, on cast from powers tagged stance melee
- **Grasping Roots** (mechanic)
  - hit 80 (single), on cast from Hindering Shot, Plant Growth, only when targetControlImmune, ASSUMED, - a Weak root on a control-immune target deals 80 instead (test)
  - hit 175 (single), on cast from Hindering Strike, Constricting Arrow, Commanding Shot, Cordon of Arrows, only when targetControlImmune, ASSUMED, - a Strong root on a control-immune target deals 175 instead (test)
  - root 1.5 s, on cast from Hindering Shot, Plant Growth, not (only when targetControlImmune)
  - root 3 s, on cast from Hindering Strike, Constricting Arrow, Commanding Shot, Cordon of Arrows, not (only when targetControlImmune)
- **Aspect of the Falcon** (slottedClassFeatures)
  - buff Damage Bonus +10% (you), to tags {"stance": "ranged"}, only when targetRangeFt <= 25, - ranged powers within 25 ft
- **Pathfinder's Action** (slottedClassFeatures)
  - buff Pathfinder's Action Deflect +5%, Movement Speed +10% (you) for 10 s, on cast from daily powers
- **Cruel Recovery** (slottedClassFeatures)
  - heal 1% max HP, on a critical hit (once per 2 s)
- **Primal Instincts** (slottedClassFeatures)
  - Hawkeye (Hawkeye): stats.Encounter Damage mult 1.2, ASSUMED, - +20% effectiveness read as the amount (5% -> 6%), not the duration (test)
  - Stag Heart (Stag Heart): pctMaxHp mult 1.2, ASSUMED
- **Longshot** (feats)
  - powers matching {"type": "encounter", "tags": {"stance": "ranged"}}: magnitude mult 1.5
  - powers matching {"type": "encounter", "tags": {"stance": "melee"}}: magnitude mult 0.5
- **Rate of Change** (feats)
  - buff Rate of Change (0-9 s) Damage Bonus +5% (you) for 9 s, when Ranged Stance starts
  - buff Rate of Change (0-6 s) Damage Bonus +5% (you) for 6 s, when Ranged Stance starts
  - buff Rate of Change (0-3 s) Damage Bonus +5% (you) for 3 s, when Ranged Stance starts
  - buff Rate of Change (0-9 s) Damage Bonus +5% (you) for 9 s, when Melee Stance starts
  - buff Rate of Change (0-6 s) Damage Bonus +5% (you) for 6 s, when Melee Stance starts
  - buff Rate of Change (0-3 s) Damage Bonus +5% (you) for 3 s, when Melee Stance starts, - 15% on a stance switch, falling 5% every 3 s, back to full on the next switch
- **Critical Action** (feats)
  - buff Critical Action Critical Severity +24% (you) for 10 s, on cast from daily powers except Disruptive Shot, Forest Ghost, Call of the Storm, - 1,000 AP daily = 4 stacks
  - buff Critical Action Critical Severity +12% (you) for 10 s, on cast from Forest Ghost, Call of the Storm, - 500 AP = 2 stacks
  - buff Critical Action Critical Severity +6% (you) for 10 s, on cast from Disruptive Shot, ASSUMED, - 250 AP = 1 stack; a second daily inside 10 s assumed to replace
- **Thorned Roots** (feats)
  - Grasping Roots (Strong Grasping Roots): magnitude set 225, only when targetControlImmune, ASSUMED, - control-immune: 225 instead of 175 (one hit, assumed)
  - damage over time 225 over 3 s, on cast from Hindering Strike, Constricting Arrow, Commanding Shot, Cordon of Arrows, not (only when targetControlImmune), - 75 per second while rooted
- **Biting Snares** (feats)
  - Action Points gain 1% of the bar, on cast from Hindering Shot, Plant Growth, Hindering Strike, Constricting Arrow, Commanding Shot, Cordon of Arrows, ASSUMED, - per root applied (counts on control-immune targets: test)
- **Predator** (feats)
  - debuff Prey Damage Taken +10% (on the target) for 10 s, on cast from powers tagged stance ranged, not (while Prey is up), - ranged encounters; cannot be reapplied until it expires
- **Forestbond** (feats)
  - encounter cooldowns -10% of the time left, on cast from Hindering Strike, Constricting Arrow, Commanding Shot, Cordon of Arrows, ASSUMED, - Strong roots: -10% of the time left on everything recharging (immune targets count: test)
  - encounter cooldowns -5% of the time left, on cast from Hindering Shot, Plant Growth, ASSUMED
- **Commander in Chief** (feats)
  - buff Commander in Chief Damage Bonus +10% (you) for 10 s, to tags {"stance": "ranged"}, on cast from Commanding Shot, ASSUMED, - projectile damage: every ranged-stance attack assumed
- **More Than Disruptive** (feats)
  - buff More Than Disruptive Damage Bonus +10% (you) for 5 s, to tags {"stance": "ranged"}, on cast from Disruptive Shot
- **Slasher's Expertise** (feats)
  - buff Slasher's Expertise Damage Bonus +10% (you) for 15 s, to tags {"stance": "melee"}, on cast from Slasher's Mark
- **Aimed Strike** (atWill)
  - hit 65 (single)
  - damage over time 325 over 10 s, ASSUMED, - 65 x5 over 10 s; a recast assumed to refresh
- **Careful Attack** (atWill)
  - debuff Careful Attack (on the target) for 10 s
  - hit 15 (single), on each hit from atWill/encounter/daily powers, while Careful Attack is up, - +15 on every At-Will / Encounter / Daily hit on the studied target
- **Ambush** (encounter)
  - Ambush: magnitude set 0, - no hit of its own
  - set Ambush to 1
  - hit 150 (single), on cast from atWill/encounter/daily powers except Ambush, while you have any Ambush, - your next attack +150
  - spend Ambush, on cast from atWill/encounter/daily powers except Ambush
  - debuff Ambush Damage Taken +10% (on the target) for 5 s
- **Bear Trap** (encounter)
  - hit 220 (single)
  - damage over time 185 over 5 s, ASSUMED, - 185 over 5 s (total, assumed); triggers at once under a boss (test)
  - hold 2 s
  - slow 5 s
- **Gushing Wound** (encounter)
  - hit 400 (single)
  - damage over time 400 over 10 s, ASSUMED, - 400 over 10 s (total)
- **Hawkeye** (encounter)
  - buff Hawkeye Encounter Damage +5% (party) for 5 s
- **Commanding Shot** (encounter)
  - debuff Commanding Shot Damage Taken +10% (on the target) for 10 s
- **Stag Heart** (encounter)
  - barrier 15% of max HP for 15 s
- **Slasher's Mark** (daily)
  - stamina gain ?, MISSING amount (counts zero), - stamina back on each hit on the mark (amount not stated)
- **Disruptive Shot** (daily)
  - interrupt

## Warden

- **Seeker's Vengeance** (slottedClassFeatures)
  - buff Damage Bonus +10% (you), only when behindTarget, - from behind the target
- **Crushing Roots** (slottedClassFeatures)
  - Grasping Roots (Weak Grasping Roots): seconds mult 2
  - Grasping Roots (Strong Grasping Roots): seconds mult 2
  - daze 0.5 s, on cast from Hindering Shot, Plant Growth, not (only when targetControlImmune)
  - daze 1 s, on cast from Hindering Strike, Constricting Arrow, Commanding Shot, Cordon of Arrows, Binding Arrow, not (only when targetControlImmune), - control only; whether the immune-target damage changes is a test
- **Aspect of the Pack** (slottedClassFeatures)
  - buff Combat Advantage +5% (party), not (only when soloOrIsolated), ASSUMED, - 1% per friendly in 30 ft (you included), max 5%: a full group in range assumed; 0 solo
- **Aspect of the Serpent** (slottedClassFeatures)
  - +1 Serpent (ranged-built), on cast from powers tagged stance ranged
  - +1 Serpent (melee-built), on cast from powers tagged stance melee
  - buff Damage Bonus +3% (you), to type atWill/encounter, tags {"stance": "melee"}, scaled by Serpent (ranged-built) stacks, - ranged-built stacks buff melee attacks (maximum stacks unknown)
  - buff Damage Bonus +3% (you), to type atWill/encounter, tags {"stance": "ranged"}, scaled by Serpent (melee-built) stacks
  - spend Serpent (ranged-built) (all held, up to 1), on each hit from powers tagged stance melee, - each buffed attack spends one
  - spend Serpent (melee-built) (all held, up to 1), on each hit from powers tagged stance ranged
- **Rapid Strike** (atWill)
  - hit 80 (single)
  - hit 40 (single), on every 4th cast, - the fourth hit is enhanced (80 / 120)
- **Split Shot** (atWill)
  - hit 220 (area), - full 2.1 s focus (a tap is 95)
- **Rain of Swords** (encounter)
  - hit 200 (area)
  - damage over time 200 over 8 s
- **Plant Growth** (encounter)
  - hit 150 (area)
  - damage over time 200 over 4 s
- **Marauder's Escape** (encounter)
  - confuse 1 s
- **Marauder's Rush** (encounter)
  - confuse 1 s
- **Steel Breeze** (encounter)
  - stamina gain 10% of the bar, - per enemy hit
- **Seismic Shot** (daily)
  - pull, MISSING seconds (counts zero)
- **Ranged Stance** (mechanic)
  - buff Ranged Stance (you), on cast from powers tagged stance ranged, not (while Ranged Stance is up), - casting a ranged-stance power swaps to Ranged Stance
  - end Melee Stance, on cast from powers tagged stance ranged
- **Melee Stance** (mechanic)
  - buff Melee Stance (you), at the pull, - starting stance (review default)
  - buff Melee Stance (you), on cast from powers tagged stance melee, not (while Melee Stance is up), - casting a melee-stance power swaps to Melee Stance
  - end Ranged Stance, on cast from powers tagged stance melee
- **Grasping Roots** (mechanic)
  - hit 80 (single), on cast from Hindering Shot, Plant Growth, only when targetControlImmune, ASSUMED, - a Weak root on a control-immune target deals 80 instead (test)
  - hit 175 (single), on cast from Hindering Strike, Constricting Arrow, Cordon of Arrows, Binding Arrow, only when targetControlImmune, ASSUMED, - a Strong root on a control-immune target deals 175 instead (test)
  - root 1.5 s, on cast from Hindering Shot, Plant Growth, not (only when targetControlImmune)
  - root 3 s, on cast from Hindering Strike, Constricting Arrow, Cordon of Arrows, Binding Arrow, not (only when targetControlImmune)
- **Stormstep Action** (slottedClassFeatures)
  - encounter cooldowns -2 s, on cast from daily powers except Forest Ghost, Call of the Storm, ASSUMED, - up to 2 s by AP spent: 1,000 AP = 2 s, 500 AP = 1 s (assumed)
  - encounter cooldowns -1 s, on cast from Forest Ghost, Call of the Storm, ASSUMED
- **Blade Storm** (slottedClassFeatures)
  - proc: hit 0 (area), 20% chance on each hit from powers tagged stance melee, ASSUMED, - 20% of the attack's damage around you (the attacked enemy included, assumed)
- **Twin-Blade Storm** (slottedClassFeatures)
  - buff Damage Bonus +8% (you), to tags {"targets": "area"}, only when enemyCount >= 3, - attacks that hit 3+ enemies
- **Aspect of the Lone Wolf** (slottedClassFeatures)
  - buff Deflect +10% (you), x0.1 per enemyCount (max 10) and only when targetRangeFt <= 30, - 1% Deflect per enemy within 30 ft, max 10%
- **Deft Strikes** (feats)
  - buff Deft Strikes (ranged) Damage Bonus +30% (you) for 3 s, to type encounter, tags {"stance": "ranged"}, on cast from powers tagged stance melee
  - buff Deft Strikes (melee) Damage Bonus +30% (you) for 3 s, to type encounter, tags {"stance": "melee"}, on cast from powers tagged stance ranged
- **Focused** (feats)
  - +1 Focused, every 1 s
  - spend Focused, when Ranged Stance starts
  - spend Focused, when Melee Stance starts
  - buff Damage Bonus +4% (you), to tags {"stance": "ranged"}, scaled by Focused stacks and while Ranged Stance is up
  - buff Damage Bonus +4% (you), to tags {"stance": "melee"}, scaled by Focused stacks and while Melee Stance is up, - 4% per second in a stance, max 20%; a switch resets
- **Storm's Recovery** (feats)
  - ranged encounter cooldowns -3 s, on cast from powers tagged stance ranged, - your other ranged encounters
  - melee encounter cooldowns -3 s, on cast from powers tagged stance melee
- **Swiftness of the Fox** (feats)
  - ranged encounter cooldowns -2 s, on cast from powers tagged stance melee
  - melee encounter cooldowns -2 s, on cast from powers tagged stance ranged
  - melee encounter cooldowns -1 s, on cast from Cordon of Arrows, Hindering Shot, - +5% damage is on the sheet already
- **Blade Hurricane** (feats)
  - buff Melee Flurry (you) for 3 s, on cast from powers tagged stance melee
  - buff Ranged Flurry (you) for 3 s, on cast from powers tagged stance ranged
  - powers matching {"type": "atWill", "tags": {"stance": "melee"}}: magnitudePct add 100, while Melee Flurry is up
  - powers matching {"type": "atWill", "tags": {"stance": "ranged"}}: magnitudePct add 100, while Ranged Flurry is up, - same-stance at-will damage x2 for 3 s
- **Storm Conduit** (feats)
  - debuff Storm Conduit Damage Taken +10% (on the target), on each hit from Clear the Ground, Electric Shot, Split the Sky, Call of the Storm, Cold Steel Hurricane, MISSING seconds (counts zero), ASSUMED, - duration not on the tooltip: counted as lasting while lightning hits refresh it
  - debuff Storm Conduit Damage Taken +10% (on the target), on each Storm Strike lightning hit, MISSING seconds (counts zero), ASSUMED
- **To the Wind** (feats)
  - Throw Caution (Throw Caution): stats.Damage Bonus add 5
- **Enhanced Conductivity** (feats)
  - Call of the Storm (Lightning Enchanted Weapon): magnitude add 50
- **Nature's Envoy** (feats)
  - buff Nature's Envoy Damage Bonus +15% (you) for 10 s, on cast from Forest Ghost
- **Storm Strike** (atWill)
  - hit 110 (single)
  - hit 55 (others), on every 3rd cast, - the third hit strikes nearby enemies for half (lightning = magical)
- **Split the Sky** (encounter)
  - slow 3 s
- **Throw Caution** (encounter)
  - buff Throw Caution Damage Bonus +10% (you) for 5 s
- **Boar Hide** (encounter)
  - buff Thick Skin Defense +10% (party), MISSING seconds (counts zero), ASSUMED, - 5 stacks of 2%; each hit taken removes one
- **Boar Charge** (encounter)
  - knockdown 1 s
- **Fox's Cunning** (encounter)
  - buff Fox's Cunning Incoming Damage -10% (party) for 8 s
- **Fox Shift** (encounter)
  - slow 7 s
- **Oak Skin** (encounter)
  - heal 9% max HP over 9 s
  - buff Oak Skin Incoming Healing +10% (you) for 9 s
- **Thorn Ward** (encounter)
  - debuff Thorn Ward Damage Taken +10% (on the target) for 10 s, to damageType physical/projectile, on each hit, - each ward hit refreshes it
- **Thorn Strike** (encounter)
  - Thorn Strike: magnitudePct add 50, grows as the target loses health, ASSUMED, - 500 at full health to 750 (straight line assumed)
- **Cold Steel Hurricane** (daily)
  - slow 3 s
- **Call of the Storm** (daily)
  - buff Lightning Enchanted Weapon (you) for 10 s
  - hit 100 (single), on each hit (once per 1 s) from atWill/encounter/daily powers, while Lightning Enchanted Weapon is up, - one 100 lightning strike per second while attacking

## Not mapped (and why)

- **Boar Charge magnitude**: DATA QUESTION: the stored magnitude is 385 but the tooltip text and the review note both read 585. Left as stored until n00b confirms.
- **Cold Steel Hurricane, Call of the Storm cast times**: No castSeconds stored (the notes say 1.5 s and 1 s): they cast instantly in the simulator until added.
- **Stance swap time**: Swapping stance (0.4 s cooldown) is treated as free.
- **Bear Trap, Cordon of Arrows**: Traps: assumed to fire at once under a stationary boss (open trap test).
- **Hindering Shot**: 3 charges with a 2 s gap between uses: the 2 s gap is not enforced.
- **Rapid Volley**: 5 charges: assumed each charge refills on its own 4.8 s (test).
- **Hunter's Teamwork, Slasher's Mark, Steel Breeze, Stance Mastery, Shift**: Supply drops, stamina and movement: no damage number.
- **Boar Hide**: Thick Skin loses a stack per hit taken: counted as +10% Defense with no expiry until the incoming-hit model exists.

## Where this differs from today's simulator

The step 2.3 parity check must show exactly these differences and nothing else.

1. Split Shot: today's simulator reads '95-220' as 95. New data scores the full 2.1 s focus (220), the review's default.
2. Rapid Strike: today's simulator never adds the enhanced fourth hit. New data adds it (+25 Hunter, +40 Warden every fourth cast).
3. Aimed Strike, Bear Trap, Gushing Wound, Rain of Swords, Plant Growth: today's simulator counts only the hit. New data adds their damage over time.
4. Ambush: today's simulator lands 150 at the cast. New data adds 150 to your next attack and the +10% damage taken debuff.
5. Grasping Roots: today's simulator never converts roots. New data adds an 80 / 175 hit per root power cast on a control-immune target (the default boss toggle, provisional).
6. Careful Attack: today's simulator scores 0. New data adds +15 to every At-Will / Encounter / Daily hit while the target is studied.
7. Everything else today's simulator does not model for Ranger (stances and their feats, buffs, debuffs, procs) starts counting where the data has numbers.

## In-game checks this batch adds to the test list

- Grasping Roots on a boss: do the 80 / 175 hits land; does each Hindering Shot charge convert?
- Boar Charge: is the hit 385 or 585?
- Storm Conduit duration on the target.
- Aspect of the Serpent: maximum stacks.

## Stack rules

- **Focused**: max 5
- **Ambush**: max 1
- **Serpent (ranged-built)**: max - (ASSUMED) - maximum not on the tooltip
- **Serpent (melee-built)**: max - (ASSUMED)

Records: 150. Validator: PASS.
