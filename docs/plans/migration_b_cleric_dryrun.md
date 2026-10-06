# Migration B dry run: Cleric

Every effect the simulator will read for this class, in plain English. Nothing here changes the live site.
Old blocks stay as the human record. **MISSING** = not on the tooltip, counts zero until captured.
**ASSUMED** = used and labelled in the confidence line.

## Both paragons

- **Sacred Flame** (atWill)
  - Sacred Flame: magnitude set 110, while you have any Burning Judgement, Arbiter only, - Burning Judgement charged: 110
  - spend Burning Judgement, Arbiter only, - uses all Burning Judgement
  - +1 Radiant Judgement, Arbiter only
- **Scattering Light** (atWill)
  - Scattering Light: magnitude set 77, while you have any Radiant Judgement, Arbiter only, - Radiant Judgement charged: 77
  - spend Radiant Judgement, Arbiter only, - uses all Radiant Judgement
  - +1 Burning Judgement, Arbiter only
- **Sun Burst** (encounter)
  - Sun Burst: magnitude set 310, while you have any Burning Judgement, Arbiter only, - Burning Judgement charged: 310
  - spend Burning Judgement, Arbiter only, - uses all Burning Judgement
  - +1 Radiant Judgement, Arbiter only
  - knockback, MISSING seconds (counts zero), - full charge only (tap by default)
- **Daunting Light** (encounter)
  - Daunting Light: magnitude set 320, while you have any Radiant Judgement, Arbiter only, - Radiant Judgement charged: 320
  - spend Radiant Judgement, Arbiter only, - uses all Radiant Judgement
  - +1 Burning Judgement, Arbiter only
  - divinity spend 100, Devout only
  - divinity spend 150, Arbiter only
- **Geas** (encounter)
  - Geas: magnitude set 750, while you have any Radiant Judgement, Arbiter only, - Radiant Judgement charged: 750
  - spend Radiant Judgement, Arbiter only, - uses all Radiant Judgement
  - +1 Burning Judgement, Arbiter only
  - debuff Geas Outgoing Damage -5% (on the target) for 6 s
- **Bastion of Health** (encounter)
  - heal 1600, Devout only, - 20 ft; smaller as targets increase
  - heal 1200, Arbiter only
  - divinity spend 100, Devout only
  - divinity spend 200, Arbiter only
- **Divine Glow** (encounter)
  - buff Divine Glow Damage Bonus +5%, Incoming Healing +5%, Recharge Speed +5% (party) for 12 s, ASSUMED, - allies within 25 ft on cast (you assumed included)
  - divinity regenPct ?, MISSING amount (counts zero), - Divinity regen boost for 12 s (not on the tooltip); threat halved
- **Guardian of Faith** (daily)
  - Guardian of Faith: magnitude set 1800, while you have any Radiant Judgement, Arbiter only, - Radiant Judgement charged: 1800
  - spend Radiant Judgement, Arbiter only, - uses all Radiant Judgement
  - +1 Burning Judgement, Arbiter only
  - stun 3 s
- **Hallowed Ground** (daily)
  - buff Hallowed Ground Incoming Damage -10% (party) for 18 s
  - heal 500 over 18 s, MISSING ticks (counts zero), - 500 per tick; tick interval not captured
- **Flame Strike** (daily)
  - Flame Strike: magnitude set 360, while you have any Burning Judgement, Arbiter only, - Burning Judgement charged: 360
  - spend Burning Judgement, Arbiter only, - uses all Burning Judgement
  - +1 Radiant Judgement, Arbiter only
  - hit 260 (area)
  - damage over time 180 x1 over 12 s, ASSUMED, - 180 per tick for 12 s; tick interval not captured, counted at the one guaranteed tick

## Arbiter

- **Pilgrim's Light** (slottedClassFeatures)
  - buff Damage Bonus +5% (you), only when soloOrIsolated, - no party members nearby
- **Hallowed Armor** (slottedClassFeatures)
  - buff Incoming Damage -10% (you), only when channelingDivinity, ASSUMED, - while channelling Divinity (10% on top of the always-on 5%, or replacing it, is a test)
- **Soothing Prayer** (slottedClassFeatures)
  - heal 25, only when channelingDivinity, - 25 per second while channelling
- **Critical Insight** (slottedClassFeatures)
  - divinity gain 10, on a critical hit
- **Doomsayer** (slottedClassFeatures)
  - buff Doomsayer Damage Bonus +10% (you) for 10 s, on cast from Chains of Blazing Light, Break the Spirit, Prophecy of Doom, - encounters that put a negative condition on the enemy
- **Divine Equilibrium** (slottedClassFeatures)
  - buff Damage Bonus +15% (you), scaled by divinityLevel and scaled by divinityLevel, ASSUMED, - peak at half Divinity, falling to 0 at empty and full (straight lines assumed); your average Divinity level (default 50%)
- **Lightspeed** (feats)
  - buff Lightspeed (you) for 10 s, on cast from Searing Javelin
  - Daunting Light: castSeconds set 0.7, while Lightspeed is up, MISSING value (counts zero), - faster cast (amount not on the tooltip)
  - adds to Daunting Light: +1 Burning Judgement, Arbiter only, - +1 more Burning Judgement, while Lightspeed is up
- **Piercing Javelin** (feats)
  - proc: buff Piercing Javelin (you) for 10 s, 10% chance on each hit from atWill powers, ASSUMED, - rolled per hit (assumed)
  - Searing Javelin: guaranteedCrit set True, while Piercing Javelin is up, - the next Searing Javelin crits (used up)
- **Focused Light** (feats)
  - buff Focused Light (you) for 10 s, on cast from Forgemaster's Flame
  - Daunting Light: magnitude set 450, while Focused Light is up and not (while you have any Radiant Judgement), - single target, 450
  - Daunting Light: magnitude set 550, while Focused Light is up and while you have any Radiant Judgement, - 450 + 100 with Radiant Judgement
- **Tipping Scales** (feats)
  - set Radiant Judgement to 6, on cast from Divine Glow, while you have any Radiant Judgement, Arbiter only, ASSUMED, - fills the kind you hold (both held: which fills is a test)
  - set Burning Judgement to 6, on cast from Divine Glow, while you have any Burning Judgement and not (while you have any Radiant Judgement), Arbiter only, ASSUMED
- **Sudden Verdict** (feats)
  - proc: set Radiant Judgement to 6, 25% chance on cast from Searing Javelin, Forgemaster's Flame, Sun Burst, ASSUMED, - fire encounters fill Radiant (assumed the kind the cast builds)
  - proc: set Burning Judgement to 6, 25% chance on cast from Daunting Light, Chains of Blazing Light, Break the Spirit, Geas, ASSUMED
- **Critical Sun** (feats)
  - proc: Celestial Prominence cooldown reset, on a critical hit from Celestial Prominence, - a free recast within 6 s (no action points), not twice in a row
- **Burning Patch** (feats)
  - adds to Flame Strike: damage over time 540 x6 over 18 s, - a ground patch: a boss that leaves it takes nothing; scored on a boss that stays, removes from Flame Strike: dot
- **Perfect Balance** (feats)
  - +1 Radiant Shift, on cast from Searing Javelin, Forgemaster's Flame, Sun Burst
  - +1 Burning Shift, on cast from Daunting Light, Chains of Blazing Light, Break the Spirit, Geas
  - buff Damage Bonus +1% (you), scaled by Radiant Shift stacks
  - buff Damage Bonus +1% (you), scaled by Burning Shift stacks
  - divinity set ?, when Radiant Shift is applied, only when Radiant Shift >= 4 and only when Burning Shift >= 4, MISSING amount (counts zero), - 4 + 4: Divinity to full (base maximum not captured)
  - spend Radiant Shift, when Radiant Shift is applied, only when Radiant Shift >= 4 and only when Burning Shift >= 4
  - spend Burning Shift, when Radiant Shift is applied, only when Radiant Shift >= 4 and only when Burning Shift >= 4, ASSUMED, - strict alternation assumed (the gap rule that clears both is a test)
- **Lance of Faith** (atWill)
  - Lance of Faith: magnitude set 121, while you have any Radiant Judgement, Arbiter only, - Radiant Judgement charged: 121
  - spend Radiant Judgement, Arbiter only, - uses all Radiant Judgement
  - +1 Burning Judgement, Arbiter only
- **Conflagrate** (atWill)
  - Conflagrate: magnitude set 165, while you have any Burning Judgement, Arbiter only, - Burning Judgement charged: 165
  - spend Burning Judgement, Arbiter only, - uses all Burning Judgement
  - +3 Radiant Judgement, Arbiter only
- **Searing Javelin** (encounter)
  - Searing Javelin: magnitude set 530, while you have any Burning Judgement, Arbiter only, - Burning Judgement charged: 530
  - spend Burning Judgement, Arbiter only, - uses all Burning Judgement
  - +1 Radiant Judgement, Arbiter only
  - divinity spend 240
- **Forgemaster's Flame** (encounter)
  - Forgemaster's Flame: magnitude set 870, while you have any Burning Judgement, Arbiter only, - Burning Judgement charged: 870
  - spend Burning Judgement, Arbiter only, - uses all Burning Judgement
  - +1 Radiant Judgement, Arbiter only
  - divinity spend 300
- **Chains of Blazing Light** (encounter)
  - Chains of Blazing Light: magnitude set 360, while you have any Radiant Judgement, Arbiter only, - Radiant Judgement charged: 360
  - spend Radiant Judgement, Arbiter only, - uses all Radiant Judgement
  - +1 Burning Judgement, Arbiter only
  - root 5 s
- **Break the Spirit** (encounter)
  - Break the Spirit: magnitude set 620, while you have any Radiant Judgement, Arbiter only, - Radiant Judgement charged: 620
  - spend Radiant Judgement, Arbiter only, - uses all Radiant Judgement
  - +1 Burning Judgement, Arbiter only
  - debuff Break the Spirit Damage Taken +10% (on the target) for 10 s, to damageType magical/projectile, - magical and projectile attacks
- **Prophecy of Doom** (encounter)
  - echo 30% of your damage to the target over 10 s, dealt again at the end, - 30% of most damage you deal to the target in 10 s, dealt at the end ('most' exclusions unknown)
- **Celestial Prominence** (daily)
  - Celestial Prominence: magnitude set 1400, while you have any Radiant Judgement, Arbiter only, - Radiant Judgement charged: 1400
  - spend Radiant Judgement, Arbiter only, - uses all Radiant Judgement
  - +1 Burning Judgement, Arbiter only
  - hit 1300 (area), ASSUMED, - detonated after the 5 s expansion (1,300; 700 if popped early) - the review's default
  - stun 3 s
- **Hammer of Fate** (daily)
  - Hammer of Fate: magnitude set 1900, while you have any Burning Judgement, Arbiter only, - Burning Judgement charged: 1900
  - spend Burning Judgement, Arbiter only, - uses all Burning Judgement
  - +3 Radiant Judgement, Arbiter only

## Devout

- **Pilgrim's Light** (slottedClassFeatures)
  - buff Damage Bonus +5% (you), only when soloOrIsolated, - no party members nearby
- **Hallowed Armor** (slottedClassFeatures)
  - buff Incoming Damage -10% (you), only when channelingDivinity, ASSUMED, - while channelling Divinity (10% on top of the always-on 5%, or replacing it, is a test)
- **Soothing Prayer** (slottedClassFeatures)
  - heal 25, only when channelingDivinity, - 25 per second while channelling
- **Desperate Prayers** (slottedClassFeatures)
  - buff Outgoing Healing +20% (you), scaled by divinityLevel, ASSUMED, - 0 at half Divinity rising to 20% at empty (straight line assumed)
- **Hallowed Guide** (slottedClassFeatures)
  - buff Outgoing Healing +5% (you), only when healTargetWithin15ft
- **Overflowing Spirit** (slottedClassFeatures)
  - buff Outgoing Healing +25% (you), only when divinityLevel >= 100, - while Divinity is full
- **Towering Light** (feats)
  - buff Damage Bonus +10% (you), scaled by divinityLevel, ASSUMED, - 10% at full Divinity falling to 0 at empty (straight line assumed)
- **Blessed Armaments** (feats)
  - buff Incoming Damage -10% (you), while Divine Glow is up, - while Divine Glow or Exaltation is up
  - buff Incoming Damage -10% (you), while Exaltation is up and not (while Divine Glow is up)
  - hit 20, on each hit from atWill/encounter/daily powers, while Divine Glow is up, ASSUMED, - after most attacks (one per damaging hit assumed)
  - hit 20, on each hit from atWill/encounter/daily powers, while Exaltation is up and not (while Divine Glow is up), ASSUMED
- **Sanctified Ground** (feats)
  - adds to Hallowed Ground: buff Sanctified Ground Incoming Damage -5%, Recharge Speed +15% (party) for 18 s
- **Persistent Guardian** (feats)
  - heal 600, on cast from Guardian of Faith, Guardian of Life, ASSUMED, - up to 6 heals of 600 within 45 s (interval not on the tooltip)
- **Empowered Soothe** (feats)
  - set Empowered Soothe to 3, lasts 30 s, on cast from Daunting Light, Bastion of Health, Healing Word, Cleansing Light, Astral Shield
  - Soothe: healMagnitude add 100, while you have any Empowered Soothe
  - spend Empowered Soothe (all held, up to 1), on cast from Soothe
- **Soothe** (atWill)
  - heal 275
  - divinity spend 40
- **Blessing of Light** (atWill)
  - buff Blessing of Light Outgoing Healing +10% (you) for 12 s, - your next healing spell
- **Healing Word** (encounter)
  - heal 450
  - heal 300 over 18 s, ASSUMED, - 300 over 18 s (per tick or total is a test)
  - divinity spend 220
- **Exaltation** (encounter)
  - buff Exaltation Outgoing Healing +20%, Damage Bonus +20% (you) for 8 s
- **Cleansing Light** (encounter)
  - heal 300
  - divinity spend 150
- **Astral Shield** (encounter)
  - buff Astral Shield Incoming Damage -10% (party) for 10 s
  - heal 250 over 10 s, ASSUMED
  - divinity spend 22, - 22 per tick while held (tick interval not captured)
- **Intercession** (encounter)
  - heal 1800
- **Anointed Army** (daily)
  - heal 900, - fires under 50% health or at the 15 s end
  - buff Anointed Army Damage Bonus +6% (party) for 15 s
- **Guardian of Life** (daily)
  - heal 800
  - heal 500 over 15 s, MISSING ticks (counts zero), - 500 per tick; tick interval not captured
- **Light of Divinity** (mechanic)
  - heal 1700, - full 2.5 s hold
  - divinity spend 120
- **Mark of Divinity** (mechanic)
  - buff Mark of Divinity Outgoing Healing +5% (party), - on the marked ally

## Not mapped (and why)

- **Divinity (both paragons)**: GATING: maximum Divinity, regeneration per second, and the Arbiter Channel Divinity refill and Judgement dump are not captured. Costs are recorded but do not yet limit casting, so Divinity spenders (Searing Javelin, Forgemaster's Flame, Daunting Light) keep today's cadence - a known over- or underestimate until measured.
- **Angel of Death, Angel of Life, Cycle of Prayer, Inner Balance, Light of the Scales, Expanded Faith, Battle Prayer, Gathering Light, Repeated Blessings**: Divinity and healing-cadence feats: need the Divinity model above.
- **Channel Divinity, Dodge, Swift Prayers, Righteousness**: Input hub, movement and the Devout regen rate (missing): no damage number.
- **Celestial Prominence early pop**: 700 if detonated before the 5 s expansion: the review scores the 1,300 enhanced detonation.
- **Sun Burst full charge**: Knock back only on a full charge (tap by default): recorded as control, no damage change.

## Where this differs from today's simulator

The step 2.3 parity check must show exactly these differences and nothing else.

1. Arbiter Judgement: today's simulator always uses each power's plain magnitude. New data alternates fire and radiant charges, so a power cast with the other kind's Judgement held lands at its charged magnitude (e.g. Forgemaster's Flame 770 -> 870).
2. Flame Strike: today's simulator counts only the 260 impact. New data adds its burn at the one guaranteed tick (180) until the tick interval is captured.
3. Celestial Prominence: today's simulator lands 700 at the cast. New data detonates 1,300 after the 5 s expansion (the review's default).
4. Everything else today's simulator does not model for Cleric (Prophecy of Doom echo, Doomsayer, Divine Equilibrium, feats) starts counting where the data has numbers.

## In-game checks this batch adds to the test list

- (gating, both) maximum Divinity, Divinity regeneration per second; Arbiter Channel Divinity refill rate and the Judgement dump refill.
- Flame Strike, Hallowed Ground, Guardian of Life: tick interval of the per-tick numbers.
- Judgement gauge: 6 charges shared, or 6 of each kind?

## Stack rules

- **Radiant Judgement**: max 6 (ASSUMED) - the gauge holds 6 charges (each kind capped at 6, assumed)
- **Burning Judgement**: max 6 (ASSUMED)
- **Radiant Shift**: max 4, lasts 60 s, a new stack resets every timer
- **Burning Shift**: max 4, lasts 60 s, a new stack resets every timer
- **Empowered Soothe**: max 3

Records: 130. Validator: PASS.
