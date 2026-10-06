# Migration B dry run: Fighter

Every effect the simulator will read for this class, in plain English. Nothing here changes the live site.
Old blocks stay as the human record. **MISSING** = not on the tooltip, counts zero until captured.
**ASSUMED** = used and labelled in the confidence line.

## Both paragons

- **Brazen Slash** (atWill)
  - hit 100 x3 (single), ASSUMED, - 100 per hit x3 (n00b 2026-10-01 per-hit reading, still to test)
  - stamina gain 0% of the bar, MISSING pctOfBar (counts zero), - Stamina Restoration (amount not on the tooltip)
- **Cleave** (atWill)
  - hit 55 x3 (area), ASSUMED, - 55 per hit x3 (per-hit reading, test)

## Dreadnought

- **Vengeance** (mechanic)
  - buff Vengeful Damage Bonus +20% (you), when Vengeance is applied, only when Vengeance >= 50, - Vengeful at 50% of the gauge
  - end Vengeful, per 1 Vengeance spent, only when Vengeance < 50, - ends below 50%
  - +0 Vengeance, block, MISSING amount (counts zero), - blocking attacks fills the gauge: amount per blocked hit not captured (gating test)
- **Reprisal** (mechanic)
  - Guarded Strike: magnitude add 20
  - Shield Bash: magnitude add 35
  - +0 Vengeance, on each hit from Guarded Strike, Shield Bash, MISSING amount (counts zero), - each hit fills the gauge (amount not captured)
- **Combat Superiority** (slottedClassFeatures)
  - buff Combat Superiority Damage Bonus +10% (you) for 10 s, to type atWill, on cast from encounter/daily powers
- **Vigorous Strikes** (slottedClassFeatures)
  - buff Critical Strike +5% (you), scaled by currentStaminaPct, ASSUMED, - falls with stamina (straight line assumed); your stamina slider
- **Momentum** (slottedClassFeatures)
  - Bull Charge: magnitude add 400, - 520 -> 920
  - removes from Bull Charge: control, - no knock back
- **Plow the Road** (slottedClassFeatures)
  - Shield Slam: magnitude add 200, only when Vengeance >= 10
  - adds to Shield Slam: spend Vengeance (all held, up to 10), only when Vengeance >= 10, - costs 10 Vengeance
- **Always Spiteful** (slottedClassFeatures)
  - set Vengeance to 55, at the pull (once per 12 s), only when Vengeance < 55
- **Enduring Vengeance** (slottedClassFeatures)
  - +1 Enduring Vengeance, every 10 s, while Vengeful is up
  - spend Enduring Vengeance, when Vengeful ends
  - buff Damage Bonus +1% (you), scaled by Enduring Vengeance stacks, - 1% per stack
- **Trip Attack** (feats)
  - Knee Breaker: magnitude set 1300, only when Vengeance >= 10
  - adds to Knee Breaker: spend Vengeance (all held, up to 10); knockdown, MISSING seconds (counts zero); buff Combat Advantage (you) for 0.5 s, ASSUMED, - combat advantage on that hit (assumed), only when Vengeance >= 10
- **Weight of Vengeance** (feats)
  - Anvil of Doom: magnitude add 480, only when Vengeance >= 15
  - Anvil of Doom: cooldownSeconds add -4, only when Vengeance >= 15
  - adds to Anvil of Doom: spend Vengeance (all held, up to 15), only when Vengeance >= 15
- **Ricochet** (feats)
  - adds to Shield Throw: hit 360 (others), ASSUMED, - bounces at -10/-20/-30%: counted at the -20% middle
  - proc: Shield Throw cooldown reset, 10% chance on cast from powers tagged targets area, only when enemyCount > 1, - a free Shield Throw (rolled per cast, assumed)
- **Prepared Slam** (feats)
  - adds to Tremor: pull, MISSING seconds (counts zero)
- **Crushing Blows** (feats)
  - proc: hit 150 (single); spend Vengeance (all held, up to 5), 20% chance on each hit from atWill/encounter/daily powers, only when Vengeance >= 5, ASSUMED, - rolled per hit (assumed)
- **Executioner's Cut** (feats)
  - proc: hit 200 (single); spend Vengeance (all held, up to 5), on cast from encounter powers, only when Vengeance >= 5, ASSUMED, - 200 after 2 s to each target hit; 5 Vengeance once per cast (assumed); does not stack
- **Landwaster** (feats)
  - proc: hit 1150 (area), - press Earthshaker again within 5 s: a free Shockwave (no action points); spend Vengeance (all held, up to 50), on cast from Earthshaker, only when Vengeance > 50
- **Striker's Mark** (feats)
  - powers matching {"type": "daily"}: magnitude add 400, while Physical Vulnerability Up is up
  - adds to powers matching {"type": "daily"}: end Physical Vulnerability Up, - removes the vulnerability (for the party too), while Physical Vulnerability Up is up
- **Roiling Hatred** (feats)
  - +2 Vengeance, on a critical hit, - per critical strike (per hit or per cast is a test)
- **Bloody Reprise** (feats)
  - buff Bloody Reprise (you) for 3 s, when Vengeful ends
  - set Vengeance to 75, on cast from encounter powers, while Bloody Reprise is up
  - end Bloody Reprise, on cast from encounter powers
- **Heavy Slash** (atWill)
  - buff Heavy Slash Damage Bonus +5% (you) for 12 s
- **Reave** (atWill)
  - hit 60 x2 (area), ASSUMED, - 60 per hit x2 (per-hit reading, test)
- **Knee Breaker** (encounter)
  - slow 8 s
- **Onslaught** (encounter)
  - stun 1 s
- **Commander's Strike** (encounter)
  - debuff Physical Vulnerability Up Damage Taken +10% (on the target) for 10 s, to damageType physical, - physical damage (party)
- **Shield Throw** (encounter)
  - stun 3 s
- **Shield Slam** (encounter)
  - knockdown, MISSING seconds (counts zero)
- **Bull Charge** (encounter)
  - knockback, MISSING seconds (counts zero)
- **Into the Fray** (encounter)
  - stamina gain 100% of the bar
  - buff Into the Fray Movement Speed +20% (party) for 8 s
- **Shockwave** (daily)
  - knockback, MISSING seconds (counts zero)
- **Mow Down** (daily)
  - knockdown, MISSING seconds (counts zero)
- **Earthshaker** (daily)
  - stun 3 s
- **Second Wind** (daily)
  - buff Second Wind Maximum Hit Points +20% (you) for 10 s
  - heal 20% max HP
  - heal lifesteal (share missing) over 10 s, MISSING pctOfDamage (counts zero), - lifesteal portion not on the tooltip
- **Determination** (daily)
  - buff Determination Damage Bonus +40% (you) for 10 s

## Vanguard

- **Combat Superiority** (slottedClassFeatures)
  - buff Combat Superiority Damage Bonus +10% (you) for 10 s, to type atWill, on cast from encounter/daily powers
- **Vigorous Strikes** (slottedClassFeatures)
  - buff Critical Strike +5% (you), scaled by currentStaminaPct, ASSUMED, - falls with stamina (straight line assumed); your stamina slider
- **Ferocious Reaction** (slottedClassFeatures)
  - hit 25, deflect, - each deflected attack
- **Steel Recovery** (slottedClassFeatures)
  - stamina gain 5% of the bar, on cast from encounter/daily powers
- **Enduring Warrior** (slottedClassFeatures)
  - buff Incoming Damage -5% (you), only when lowHp, - below 25% hit points
- **Shieldthrower** (feats)
  - Shield Throw: magnitude set 325
  - Shield Throw: cooldownSeconds set 6
  - removes from Shield Throw: control, - no stun; more threat
- **Rising Tide** (feats)
  - buff Rising Tide (you) for 3 s, on cast from Tide of Iron
  - hit 25, on cast from powers tagged targets area, while Rising Tide is up and only when enemyCount > 1, - per attack that strikes several enemies
- **Cleaving Bull** (feats)
  - removes from Bull Charge: control, - no knock back
  - buff Cleaving Bull (you) for 6 s, on cast from Bull Charge
  - hit 40, on cast from powers tagged targets area, while Cleaving Bull is up and only when enemyCount > 1
- **Sharpened Senses** (feats)
  - adds to Bladed Rampart: buff Sharpened Senses Awareness +30% (you) for 10 s
- **Perfect Block** (feats)
  - Determination: cooldownSeconds set 180, - Determination gets a 180 s cooldown (and blocks most attacks without stamina for its 10 s)
- **Enforced Threat** (encounter)
  - debuff Enforced Threat Awareness -10% (on the target) for 10 s
- **Knight's Challenge** (encounter)
  - stamina gain 50% of the bar
  - buff Knight's Challenge (you) for 8 s
  - hit 100, block, while Knight's Challenge is up, - to each attacker whose hit you block
- **Iron Warrior** (encounter)
  - buff Iron Warrior Incoming Damage -20% (you) for 8 s
- **Shield Throw** (encounter)
  - stun 3 s
- **Shield Slam** (encounter)
  - knockdown, MISSING seconds (counts zero)
- **Knee Breaker** (encounter)
  - slow 8 s
- **Bull Charge** (encounter)
  - knockback, MISSING seconds (counts zero)
- **Bladed Rampart** (daily)
  - buff Bladed Rampart Defense +30% (you) for 10 s, ASSUMED, - read as the sheet stat (test)
  - hit 260, when you are hit, while Bladed Rampart is up, - to the attacker on every hit taken
- **Phalanx** (daily)
  - buff Phalanx Incoming Damage -20% (party) for 14 s, ASSUMED, - ends early when you block; you assumed inside
- **Earthshaker** (daily)
  - stun 3 s
- **Second Wind** (daily)
  - buff Second Wind Maximum Hit Points +20% (you) for 10 s
  - heal 20% max HP
  - heal lifesteal (share missing) over 10 s, MISSING pctOfDamage (counts zero), - lifesteal portion not on the tooltip
- **Determination** (daily)
  - buff Determination Damage Bonus +40% (you) for 10 s

## Not mapped (and why)

- **Vengeance income (Dreadnought)**: GATING: Vengeance per blocked hit, Seethe fill rate and Reprisal per hit are not on any tooltip. Until captured, the gauge only fills from Always Spiteful (55 at the pull) and Roiling Hatred (+2 per crit), so Vengeful (+20%) and every spender feat are a known underestimate in the simulator (the stat panel keeps Vengeful on, as Stage 1 does).
- **Block, Dig In, Seethe, Forge Ahead**: Stamina pool, regen and drain per blocked hit are not captured, so the damage simulator does not block. Dig In's +15% Awareness stays on the panel (Stage 1).
- **Retaliate, Revengeance, Shake It Off, Deep Breathing, Perfect Block's free block**: Fire on releasing a block after a blocked hit, or while blocking: need the block model above.
- **Shield Talent, Critical Deflection, Combat Balance, Greater Endurance**: Stamina regen and defensive rating rules: survival only, no damage number.
- **Anvil of Challenge**: Fully charged Anvil of Doom magnitude is not on the tooltip; the tap (880, taunt) is the stored power.
- **Path of the Vanguard, Staying Power, Tide of Iron, Threatening Rush, Linebreaker threat lines**: Threat only (docs/threat_mechanics.md), no damage.
- **Knight's Valor, Into the Fray speed, Phalanx control immunity, Determination dispel**: Cover, movement and control immunity: no damage.
- **Ricochet bounces**: Each bounce hits a different enemy at -10/-20/-30%: counted as up to 3 extra enemies at the -20% middle.

## Where this differs from today's simulator

The step 2.3 parity check must show exactly these differences and nothing else.

1. Brazen Slash, Cleave, Reave: today's simulator reads 100 / 55 / 60 as the whole cast. New data uses n00b's 2026-10-01 per-hit reading: 100 x3, 55 x3, 60 x2 (still to test).
2. Everything else today's simulator does not model for Fighter (Vengeance and its spenders, Heavy Slash and Combat Superiority buffs, procs, feats) starts counting where the data has numbers.

## In-game checks this batch adds to the test list

- (gating, Dreadnought) Vengeance gained per blocked hit, per second of Seethe, and per Reprisal hit; the gauge maximum.
- (gating, both) stamina pool, idle refill time, stamina drained by a blocked hit.
- Brazen Slash / Cleave / Reave: per hit or per cast (equal damage numbers per hit?).

## Stack rules

- **Vengeance**: max 100 (ASSUMED) - maximum inferred from the spender costs (test)
- **Enduring Vengeance**: max 5

Records: 85. Validator: PASS.
