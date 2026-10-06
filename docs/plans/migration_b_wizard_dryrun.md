# Migration B dry run: Wizard

Every effect the simulator will read for this class, in plain English. Nothing here changes the live site.
Old blocks stay as the human record. **MISSING** = not on the tooltip, counts zero until captured.
**ASSUMED** = used and labelled in the confidence line.

## Arcanist

- **Magic Missile** (atWill)
  - hit 60 (single)
  - hit 60 x2 (single), on every 3rd cast, ASSUMED, - the third cast strikes 3 times: 60 x3 assumed
  - +1 Arcane Mastery, - per cast (assumed, not per hit)
- **Ray of Frost** (atWill)
  - +1 Chill on the target, on each hit
  - freeze, only when Chill >= 6, MISSING seconds (counts zero), - freezes at 6 Chill; bosses cannot be frozen
- **Entangling Force** (encounter)
  - hold 2 s +0.1 s per Arcane Mastery stack
- **Repel** (encounter)
  - push, MISSING seconds (counts zero)
- **Ray of Enfeeblement** (encounter)
  - damage over time 520 over 10 s, ASSUMED, - 520 over 10 s; window and tick rate not measured
  - debuff Enfeebled Outgoing Damage -10% (on the target) for 10 s, outside the Spell Mastery slot
  - debuff Enfeebled (Spell Mastery) Damage Taken +10% (on the target) for 10 s, to damageType magical/projectile, in the Spell Mastery slot, - magical and projectile damage
- **Icy Terrain** (encounter)
  - root 1.5 s
  - +1 Chill on the target, ASSUMED, - 1 on the cast; more while enemies stand on the ice (rate and ice duration not on the tooltip)
- **Shield** (encounter)
  - barrier 30% of max HP, outside the Spell Mastery slot
  - barrier 40% of max HP, in the Spell Mastery slot
  - hit 350 (area), ASSUMED, - the explosion when the shield breaks or is recast; counted once per cast
  - push, MISSING seconds (counts zero)
- **Arcane Singularity** (daily)
  - +1 Arcane Mastery
  - pull, MISSING seconds (counts zero)
- **Ice Knife** (daily)
  - +3 Chill on the target
  - knockdown 1.5 s
- **Oppressive Force** (daily)
  - hit 200 x2 (area)
  - hit 500 (area), MISSING delaySeconds (counts zero), - after a brief delay (not on the tooltip)
  - daze 1 s
  - push, MISSING seconds (counts zero)
  - +1 Arcane Mastery
- **Arcane Presence** (slottedClassFeatures)
  - buff Damage Bonus +1% (you), to element cold/fire/lightning, scaled by Arcane Mastery stacks, - 1% per Arcane Mastery stack
  - buff Damage Bonus +1% (you), to element cold/fire/lightning, scaled by Arcane Mastery stacks and while Arcane Power Field is up, ASSUMED, - doubled by Arcane Power Field (assumed)
- **Evocation** (slottedClassFeatures)
  - buff Damage Bonus +10% (you), to tags {"targets": "area"}, ASSUMED, - area powers, also when they hit one enemy (assumed); area procs not included (assumed)
- **Chilling Presence** (slottedClassFeatures)
  - buff Damage Bonus +0.5% (you), scaled by Chill stacks, - 0.5% per Chill stack on the target
- **Orb of Imposition** (slottedClassFeatures)
  - buff Damage Bonus +5% (you), to hasControl True, only when targetControlImmune, ASSUMED, - control powers against control-immune targets (which control kinds count is a test)
- **Arcane Mastery** (mechanic)
  - buff Damage Bonus +0.5% (you), to element arcane, scaled by Arcane Mastery stacks, - 0.5% per stack, arcane powers
- **Eye of the Storm** (slottedClassFeatures)
  - buff Eye of the Storm Critical Strike +10% (you) for 5 s, on cast (once per 10 s) from encounter/daily powers, ASSUMED, - lockout assumed to start at the grant
- **Storm Spell** (slottedClassFeatures)
  - proc: hit 120, 20% chance on a critical hit, ASSUMED, - no lockout on the tooltip; whether dot ticks trigger it is a test
- **Storm Fury** (slottedClassFeatures)
  - hit 200, when you are hit (once per 3 s), - once per 3 s per attacking enemy
- **Arcane Power Field** (slottedClassFeatures)
  - buff Arcane Power Field (you) for 8 s, on cast from daily powers
  - hit 60 (area), every 2 s while Arcane Power Field is up, only when targetRangeFt <= 30, ASSUMED, - foes within 30 ft; element assumed arcane
  - buff Damage Bonus +0.5% (you), to element arcane, scaled by Arcane Mastery stacks and while Arcane Power Field is up, - doubles the Arcane Mastery bonus
  - buff Damage Bonus +0.5% (you), to element arcane, scaled by Arcane Mastery stacks and while Arcane Power Field is up, needs feat A Step Above Mastery, - doubles A Step Above's extra 0.5% too
- **Alacrity** (feats)
  - encounter cooldowns -5 s, on cast from daily powers, ASSUMED, - all slotted encounters (assumed); self-buff dailies like Arcane Empowerment assumed to count
- **Spell Twisting** (feats)
  - +1 Spell Twisting, on cast from encounter powers
  - spend Spell Twisting (all held, up to 1), on cast from atWill powers
  - Action Points gain 1% of the bar, per 1 Spell Twisting spent
- **Assailing Force** (feats)
  - spend Assailing Force, on cast from encounter powers
  - proc: +1 Assailing Force, 10% chance on cast from encounter powers
  - powers matching {"type": "encounter"}: magnitude mult 2, while you have any Assailing Force, - next encounter: initial hit x2 (not damage over time)
- **Snap Freeze** (feats)
  - hit 70, per Chill stack applied, ASSUMED, - per Chill stack applied (Ice Knife = 3); assumed to keep firing at 6 stacks
- **Chaos Magic** (feats)
  - proc: buff Power Surge Damage Bonus +100% (you) for 5 s, to type atWill, 7% chance on cast from encounter/daily powers, if you pick powerSurge
  - proc: buff Rapid Recovery Recharge Speed +100% (you) for 5 s, 7% chance on cast from encounter/daily powers, if you pick rapidRecovery
  - proc: Action Points gain 20% of the bar, - over 5 s, 7% chance on cast from encounter/daily powers, if you pick quickAction
- **Iced Lightning** (feats)
  - powers matching {"names": ["Storm Pillar", "Lightning Bolt", "Storm Spell", "Storm Fury", "Striking Advantage"]}: magnitude mult 1.3, while you have any Chill, - +30% base damage against chilled targets
- **Nightmare Wizardry** (feats)
  - proc: buff Combat Advantage (you) for 10 s, 10% chance on a critical hit
- **Striking Advantage** (feats)
  - proc: hit 120, 25% chance on each hit (once per 1 s) from atWill/encounter/daily powers, scaled by flankUptime, - only on Combat Advantage hits
- **A Step Above Mastery** (feats)
  - Arcane Mastery stacks: max set 10
  - Arcane Mastery stacks: seconds set 10
  - buff Damage Bonus +0.5% (you), to element arcane, scaled by Arcane Mastery stacks, - +0.5% more per stack (1% in all, n00b 2026-10-05)
- **Elemental Reinforcement** (feats)
  - buff Elemental Reinforcement Damage Bonus +7% (you) for 10 s, on cast from arcane/cold/lightning powers
  - buff Damage Bonus +7% (you), while Elemental Reinforcement is up and only when alternateElements, - doubled while you never cast the same element twice in a row (your toggle, n00b 2026-10-05)
- **Storm Pillar** (atWill)
  - hit 100 (area), - full charge (1.6 s); a tap is 40
  - damage over time 50 x3 over 3 s, ASSUMED, - full charge only; 50 for 3 s, hits assumed 3
  - refresh Arcane Mastery
  - refresh Chill on the target
- **Arcane Bolt** (atWill)
  - +1 Arcane Mastery
- **Lightning Bolt** (encounter)
  - refresh Arcane Mastery
  - refresh Chill on the target
- **Disintegrate** (encounter)
  - Disintegrate: magnitude set 750, only when enemyHealthPct < 20, - +50% below 20% health
- **Steal Time** (encounter)
  - slow 4 s +0.2 s per Arcane Mastery stack
  - stun 1 s +0.2 s per Arcane Mastery stack
- **Arcane Tempest** (encounter)
  - knockdown, MISSING seconds (counts zero)
- **Arcane Conduit** (encounter)
  - debuff Arcane Conduit Damage Taken +15% (on the target) for 5 s, to element arcane, outside the Spell Mastery slot
  - debuff Arcane Conduit Damage Taken +20% (on the target) for 5 s, to element arcane, in the Spell Mastery slot
  - +1 Arcane Mastery
- **Maelstrom of Chaos** (daily)
  - knockdown 1 s
  - refresh Arcane Mastery
  - refresh Chill on the target
- **Arcane Empowerment** (daily)
  - buff Arcane Empowerment Damage Bonus +20% (you) for 10 s, to type encounter
  - buff Arcane Empowerment recharge Recharge Speed 0% (you) for 10 s, MISSING stats (counts zero), - encounters recharge faster; amount not on the tooltip
  - +5 Arcane Mastery

## Thaumaturge

- **Magic Missile** (atWill)
  - hit 60 (single)
  - hit 60 x2 (single), on every 3rd cast, ASSUMED, - the third cast strikes 3 times: 60 x3 assumed
  - +1 Arcane Mastery, - per cast (assumed, not per hit)
- **Ray of Frost** (atWill)
  - +1 Chill on the target, on each hit
  - freeze, only when Chill >= 6, MISSING seconds (counts zero), - freezes at 6 Chill; bosses cannot be frozen
- **Entangling Force** (encounter)
  - hold 2 s +0.1 s per Arcane Mastery stack
- **Repel** (encounter)
  - push, MISSING seconds (counts zero)
- **Ray of Enfeeblement** (encounter)
  - damage over time 520 over 10 s, ASSUMED, - 520 over 10 s; window and tick rate not measured
  - debuff Enfeebled Outgoing Damage -10% (on the target) for 10 s, outside the Spell Mastery slot
  - debuff Enfeebled (Spell Mastery) Damage Taken +10% (on the target) for 10 s, to damageType magical/projectile, in the Spell Mastery slot, - magical and projectile damage
- **Icy Terrain** (encounter)
  - root 1.5 s
  - +1 Chill on the target, ASSUMED, - 1 on the cast; more while enemies stand on the ice (rate and ice duration not on the tooltip)
- **Shield** (encounter)
  - barrier 30% of max HP, outside the Spell Mastery slot
  - barrier 40% of max HP, in the Spell Mastery slot
  - hit 350 (area), ASSUMED, - the explosion when the shield breaks or is recast; counted once per cast
  - push, MISSING seconds (counts zero)
- **Arcane Singularity** (daily)
  - +1 Arcane Mastery
  - pull, MISSING seconds (counts zero)
- **Ice Knife** (daily)
  - +3 Chill on the target
  - knockdown 1.5 s
- **Oppressive Force** (daily)
  - hit 200 x2 (area)
  - hit 500 (area), MISSING delaySeconds (counts zero), - after a brief delay (not on the tooltip)
  - daze 1 s
  - push, MISSING seconds (counts zero)
  - +1 Arcane Mastery
- **Arcane Presence** (slottedClassFeatures)
  - buff Damage Bonus +1% (you), to element cold/fire/lightning, scaled by Arcane Mastery stacks, - 1% per Arcane Mastery stack
- **Evocation** (slottedClassFeatures)
  - buff Damage Bonus +10% (you), to tags {"targets": "area"}, ASSUMED, - area powers, also when they hit one enemy (assumed); area procs not included (assumed)
- **Chilling Presence** (slottedClassFeatures)
  - buff Damage Bonus +0.5% (you), scaled by Chill stacks, - 0.5% per Chill stack on the target
- **Orb of Imposition** (slottedClassFeatures)
  - buff Damage Bonus +5% (you), to hasControl True, only when targetControlImmune, ASSUMED, - control powers against control-immune targets (which control kinds count is a test)
- **Arcane Mastery** (mechanic)
  - buff Damage Bonus +0.5% (you), to element arcane, scaled by Arcane Mastery stacks, - 0.5% per stack, arcane powers
- **Smolder** (mechanic)
  - debuff Smolder (on the target), on each hit from fire powers, MISSING seconds (counts zero), ASSUMED, - lasts while refreshed; duration not captured
  - damage over time (amount and length missing), on each hit from fire powers, MISSING magnitude/ticks/seconds (counts zero), - Smolder numbers are not captured yet (gating test): presence counts, damage is zero
  - debuff Smolder (on the target), when Chill is applied, while Smolder is up, MISSING seconds (counts zero), ASSUMED, - Rimefire: Chill on a smoldering target refreshes Smolder
  - damage over time (amount and length missing), when Chill is applied, while Smolder is up, MISSING magnitude/ticks/seconds (counts zero), - Rimefire: Chill on a smoldering target refreshes Smolder
- **Critical Conflagration** (slottedClassFeatures)
  - debuff Smolder (on the target), on a critical hit, not (while Smolder is up), MISSING seconds (counts zero), ASSUMED, - only if the target has no Smolder
  - damage over time (amount and length missing), on a critical hit, not (while Smolder is up), MISSING magnitude/ticks/seconds (counts zero), - only if the target has no Smolder
- **Swath of Destruction** (slottedClassFeatures)
  - Smolder (Smolder): magnitudePct add 10
  - debuff Swath of Destruction Damage Taken +3% (on the target), while Smolder is up, - party-wide; counted for you
- **Combustive Action** (slottedClassFeatures)
  - Action Points gain 5% of the bar, on a kill (once per 1 s), while Smolder is up, - trash packs only; nothing dies in a boss fight
- **Frost Wave** (slottedClassFeatures)
  - set Chill to 6 on the target, on cast from daily powers, only when targetRangeFt <= 30
  - freeze, on cast from daily powers, only when targetRangeFt <= 30, MISSING seconds (counts zero), - bosses cannot be frozen
- **Relative Haste** (feats)
  - buff Recharge Speed +5% (you), x1 per enemyCount (max 4) and while you have any Chill, ASSUMED, - 5% per chilled enemy nearby, max 20%; every enemy assumed chilled
- **Smoldering Recovery** (feats)
  - Action Points gain 0.5% of the bar, each Smolder tick, - per Smolder tick (tick rate not captured)
  - Action Points gain 0.3% of the bar, on each Directed Flames hit, needs feat Directed Flames
- **Glowing Flames** (feats)
  - hit (amount missing) (others), each Smolder tick, MISSING magnitude (counts zero), - 30% of a Smolder tick to other smoldering enemies within 15 ft
- **Icy Veins** (feats)
  - +1 Chill on the target, on cast from encounter powers, only when targetRangeFt <= 20, - all foes within 20 ft
- **Chilling Advantage** (feats)
  - debuff Smolder (on the target), on each hit from Ray of Frost, Chilling Cloud, Icy Terrain, Icy Rays, Chill Strike, Conduit of Ice, Ice Knife, Ice Storm, MISSING seconds (counts zero), ASSUMED, - cold powers that apply Chill also apply Rimefire Smolder
  - damage over time (amount and length missing), on each hit from Ray of Frost, Chilling Cloud, Icy Terrain, Icy Rays, Chill Strike, Conduit of Ice, Ice Knife, Ice Storm, MISSING magnitude/ticks/seconds (counts zero), - cold powers that apply Chill also apply Rimefire Smolder
- **Shatter Strike** (feats)
  - proc: hit 300; stun 5 s, 20% chance on each hit, while Frozen is up, - frozen targets only; bosses cannot be frozen
  - powers matching {"hasControl": true}: magnitude add 200, only when targetControlImmune, ASSUMED, - per cast against control-immune targets (assumed not per hit)
- **Critical Burn** (feats)
  - Smolder (Smolder): critDamagePct add 25, - Smolder crits; the +10% Critical Severity is already on the sheet
- **Frigid Winds** (feats)
  - buff Damage Bonus +1.5% (you), scaled by Chill stacks, - 1.5% per Chill stack
- **Directed Flames** (feats)
  - adds to Smolder: hit (amount missing), on each hit (once per 1 s) from fire powers, MISSING magnitude (counts zero), - 25% of Smolder's total damage on apply, removes from Smolder: dot, - no damage over time; a burst when Smolder is applied or reapplied, once per second
- **Rimefire Weaving** (feats)
  - debuff Rimefire Weaving (Chill) Damage Resistance -5% (on the target), while you have any Chill, ASSUMED
  - debuff Rimefire Weaving (Smolder) Damage Resistance -5% (on the target), while Smolder is up, ASSUMED, - 5% with Chill or Smolder, 10% with both (Rimefire); read as damage dealt (assumed)
- **Scorching Burst** (atWill)
  - hit 110 (area), - full charge (1.7 s); a tap is 60
- **Chilling Cloud** (atWill)
  - +1 Chill on the target, on each hit
  - hit 90 (others), on every 3rd cast, ASSUMED, - third hit also hits enemies near the target (full 90 assumed)
  - +1 Chill on the target, on every 3rd cast, - third hit chills all targets
- **Fanning the Flame** (encounter)
  - damage over time 500 over 6 s, ASSUMED, - 500 read as the burn over 6 s (could be up front)
  - hit 100 (others), ASSUMED, - to each smoldering enemy within 15 ft, once per cast (assumed)
  - hit 100 (single), x1 per otherEnemies (max 10), ASSUMED, - 100 to the burning target per nearby smoldering enemy
- **Icy Rays** (encounter)
  - stun 1 s
  - +1 Chill on the target
- **Chill Strike** (encounter)
  - stun 0.5 s
  - +1 Chill on the target, on each hit, - per target hit (Spell Mastery hits nearby enemies too)
- **Conduit of Ice** (encounter)
  - +1 Chill on the target, on each hit, - every target hit
- **Furious Immolation** (daily)
  - pull 1 s
  - knockdown, MISSING seconds (counts zero)
- **Ice Storm** (daily)
  - slow 5 s
  - knockdown, MISSING seconds (counts zero)
  - +1 Chill on the target, on each hit, ASSUMED, - every enemy hit (assumed)

## Not mapped (and why)

- **Control Mastery**: Stun, root, hold and daze last 2.5x as long on non-player enemies: control length only, no damage. Shown on the tooltip display, not scored.
- **Orb of Imposition**: +25% control duration: control length only, display.
- **Chilling Presence**: Doubled on Frozen targets: bosses cannot be frozen, so only the normal 0.5% per stack is scored.
- **Spell Mastery**: The extra R1 slot itself: which encounter sits there is your build choice (spellMasteryPower); the slot changes are the 'Spell Mastery slot' lines on each power.
- **Teleport / Brisk Transport**: Dodge and +10 Movement Speed for 2 s: no damage.
- **Controlled Momentum**: Allies within 30 ft deal 2% more: the tooltip says allies, so it is not your own damage (PT2-15).
- **Icy Rays**: Two casts per use (mark, then fire): scored as one 850 hit per cooldown (n00b's reading); the 0.22 s mark cast is not counted as time spent.
- **Nightmare Wizardry + Striking Advantage**: Striking Advantage reads your Combat Advantage uptime slider; the extra Combat Advantage Nightmare Wizardry grants is recorded but not yet combined with it.
- **Repel, Arcane Tempest, Chill Strike, Fireball (Spell Mastery slot)**: Their Spell Mastery damage lives on the power already (modes.spellMastery magnitude / area); the simulator reads it when that power sits in the R1 slot.
- **Ray of Frost / Storm Pillar / Scorching Burst**: Channel and charge timing: scored at the stored cast time (0.5 s per beam hit, full charge).
- **Smolder (Thaumaturge)**: Every Smolder number is missing (gating test): presence is modelled, damage is zero, so Thaumaturge fire builds are a known underestimate.

## Where this differs from today's simulator

The step 2.3 parity check must show exactly these differences and nothing else.

1. Storm Pillar and Scorching Burst: today's simulator reads the stored text '40-100' / '60-110' as the low end (40 / 60). New data scores the full charge (100 / 110) the review recorded, plus Storm Pillar's lightning pillar.
2. Magic Missile: today's simulator gives every cast 60. New data adds the third cast's two extra strikes (assumed 60 each).
3. Oppressive Force: today's simulator lands 900 as one hit. New data: 200 twice, then the 500 explosion (delay not on the tooltip, counted at once).
4. Ray of Enfeeblement and Fanning the Flame: today's simulator lands the whole 520 / 500 at once. New data spreads it over 10 s / 6 s (assumed ticks).
5. Disintegrate: today's simulator ignores the 750 below 20% enemy health. New data uses it when you set enemy health under 20%.
6. Everything else today's simulator does not model for Wizard (Chill, Arcane Mastery, Smolder presence, procs, feats) starts counting; Smolder damage stays zero.

## In-game checks this batch adds to the test list

- Magic Missile third cast: 3 x 60, or 60 split three ways?
- Chill: how long does a stack last without being refreshed? Do bosses take Chill stacks?
- Arcane Mastery: does a new stack reset the 8 s timer on all stacks?
- Ray of Enfeeblement and Fanning the Flame: is the 520 / 500 all at once or over the duration?
- Smolder (gating): damage per tick, tick interval, duration.

## Stack rules

- **Arcane Mastery**: max 5, lasts 8 s, a new stack resets every timer - a new stack resets the timer on all (assumed)
- **Chill**: max 6 (ASSUMED) - how long a stack lasts is not captured; counted as lasting while refreshed
- **Spell Twisting**: max 4
- **Assailing Force**: max 1

Records: 149. Validator: PASS.
