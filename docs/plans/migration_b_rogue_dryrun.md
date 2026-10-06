# Migration B dry run: Rogue

Every effect the simulator will read for this class, in plain English. Nothing here changes the live site.
Old blocks stay as the human record. **MISSING** = not on the tooltip, counts zero until captured.
**ASSUMED** = used and labelled in the confidence line.

## Both paragons

- **Cunning Ambusher** (classFeatures)
  - buff Cunning Ambusher Damage Bonus +10% (you) for 5 s, when Stealth ends

## Assassin

- **Sneak Attack** (slottedClassFeatures)
  - buff Recharge Speed +10% (you), while Stealth is up, - while Stealthed (cooldown rate read as Recharge Speed)
- **Tenacious Concealment** (slottedClassFeatures)
  - Stealth (Stealth refill): amount mult 1.5, - +50% Stealth regeneration (the base is not captured, so this is zero too)
- **Cloud of Steel** (atWill)
  - hit 45 (single)
  - +1 Cloud of Steel on the target, on each hit, ASSUMED, - 5 s, refreshed by each hit (assumed)
  - Cloud of Steel: magnitudePct add 2.5, scaled by Cloud of Steel stacks, - +2.5% Cloud of Steel damage per stack, 10 max
- **Blade Flurry** (encounter)
  - Blade Flurry: cooldownSeconds set 0, while Stealth is up, - Stealthed: no cooldown (radius 25 ft)
- **Lashing Blade** (encounter)
  - hit 715 (single)
  - hit 300 (single), while Stealth is up, - Stealthed: another 300 hit
- **Path of the Blade** (encounter)
  - Path of the Blade: durationSeconds set 3, while Stealth is up, - Stealthed: same 4 pulses in 3 s
- **Smoke Bomb** (encounter)
  - daze 4 s
  - buff Combat Advantage (party) for 4 s, while Stealth is up, - Stealthed: you and allies inside
- **Bait and Switch** (encounter)
  - set Stealth Meter to 100, while Stealth is up, - Stealthed: refills the meter and keeps Stealth
- **Hateful Knives** (daily)
  - knockdown, MISSING seconds (counts zero)
  - buff Combat Advantage (you) for 6 s, ASSUMED, - yours against the target (assumed)
- **Whirlwind of Blades** (daily)
  - buff Whirlwind of Blades Damage Bonus +3% (you) for 10 s, x1 per enemyCount (max 5), - 3% per enemy hit, first 5
- **Courage Breaker** (daily)
  - debuff Courage Breaker Outgoing Damage -15% (on the target) for 8 s
  - slow 8 s, - 70%, ignores control immunity
- **Stealth** (mechanic)
  - set Stealth Meter to 100, at the pull, ASSUMED, - full at the pull (the meter refills out of combat)
  - +0 Stealth Meter, every 1 s, not (while Stealth is up), MISSING amount (counts zero), - refill time not captured (gating test): counts zero
  - buff Stealth (you), only when Stealth Meter > 0 and not (while Stealth is up), - entering Stealth (the rotation decides when; cooldown 0.4 s)
  - spend Stealth Meter (all held, up to 16.666666666666668), every 1 s, while Stealth is up, - a full meter lasts 6 s
  - spend Stealth Meter (all held, up to 15), on cast from atWill powers, while Stealth is up
  - end Stealth, per 1 Stealth Meter spent, only when Stealth Meter <= 0, - the meter is empty
  - end Stealth, on cast from encounter powers except Bait and Switch, while Stealth is up, - encounters end Stealth unless the power keeps it (Bait and Switch); dailies assumed not to
- **Invisible Infiltrator** (slottedClassFeatures)
  - set Stealth Meter to 100, on cast from daily powers, - each daily refills the meter
  - buff Invisible Infiltrator Damage Bonus +5% (you) for 5 s, on cast from daily powers
- **Infiltrator's Action** (slottedClassFeatures)
  - buff Combat Advantage (you) for 10 s, on cast from daily powers
- **Oppressive Darkness** (slottedClassFeatures)
  - hit 20, on each hit from atWill/encounter/daily powers, scaled by flankUptime, ASSUMED, - with Combat Advantage; per hit (assumed, test)
- **First Strike** (slottedClassFeatures)
  - set First Strike to 1, at the pull
  - buff Damage Bonus +15% (you), while you have any First Strike, - your first attack in combat
  - spend First Strike, on each hit from atWill/encounter/daily powers
- **Assassin's Target** (feats)
  - +1 Targeted on the target, on each hit from atWill/daily powers, ASSUMED, - per hit (assumed, test)
  - buff Damage Bonus +1% (you), to type encounter, scaled by Targeted stacks, - 1% per stack on the next encounter
  - spend Targeted on the target, on each hit from encounter powers, ASSUMED, - used by the next encounter that strikes (assumed)
- **Toxic Blades** (feats)
  - +1 Toxic Blades on the target, on each hit from encounter/daily powers, ASSUMED, - 15 s; a new stack refreshes all (assumed)
  - hit 20, every 3 s, scaled by Toxic Blades stacks, - 20 per stack every 3 s
- **Knife's Edge** (feats)
  - encounter cooldowns -4 s, on cast from daily powers
- **Master of Shadows** (feats)
  - Stealth (Stealth refill): amount mult 1.5, - +50% regeneration (base not captured)
  - Stealth (Stealth drain): amount mult 0.8, - Stealth lasts 25% longer (7.5 s)
- **Duelist's Expertise** (feats)
  - +1 Duelist's Expertise, every 1 s, only when Duelist's Expertise < 15 and not (while Master Duelist is up), ASSUMED, - 1 per second in combat; assumed not to rebuild during Master Duelist (test)
  - buff Damage Bonus +0.5%, Deflect +0.5% (you), scaled by Duelist's Expertise stacks, - per stack
  - buff Master Duelist Damage Bonus +15%, Deflect +15% (you) for 10 s, every 1 s, only when Duelist's Expertise >= 15, - the 16th stack cashes in
  - spend Duelist's Expertise, when Master Duelist starts
- **Skullcracker** (feats)
  - set Skullcracker to 1, every 15 s
  - debuff Skullcracker mark Damage Taken +10% (on the target) for 15 s, on cast from atWill/encounter powers, while you have any Skullcracker, ASSUMED, - 10 s, +0.5 s per damage instance up to +5 s: counted at 15 s (a fast at-will extends it fully)
  - daze 3 s, on cast from atWill/encounter powers, while you have any Skullcracker
  - spend Skullcracker, on cast from atWill/encounter powers
- **Back Alley Tactics** (feats)
  - buff Damage Bonus +10% (you), scaled by pool:apPct, ASSUMED, - up to 10% with an empty Action Point bar; straight line assumed
- **Hastily Sharpened Blades** (feats)
  - buff Critical Strike +5% (you), - rolled 5-10% per attack; counted at the guaranteed 5% (n00b 2026-10-04)
- **Execution** (feats)
  - proc: hit 200, 10% chance on each hit from atWill/encounter/daily powers, only when enemyHealthPct < 20, ASSUMED, - rolled per hit (assumed)
- **Shadow's Flurry** (feats)
  - proc: hit (amount missing), MISSING magnitude (counts zero), - the final combo of Duelist's Flurry: hit count not on any tooltip, 5% chance on each hit from atWill/encounter/daily powers
- **Duelist's Flurry** (atWill)
  - hit 35 (single)
  - damage over time (amount and length missing), on each hit, MISSING magnitude/ticks (counts zero), - a chance per flurry hit (chance, damage and tick rate not on the tooltip)
- **Gloaming Cut** (atWill)
  - hit 150 (single), ASSUMED, - base unconfirmed (n00b unsure)
  - Gloaming Cut: magnitudePct add 100, grows as the target loses health, - up to +100% by the target's missing health
  - buff Gloaming Cut (you) for 8 s, - +50% Stealth regeneration (base not captured)
  - +20 Stealth Meter, on a kill, - a kill with it refills 20%
- **Impossible to Catch** (encounter)
  - buff Impossible to Catch Deflect +10% (you) for 4 s
  - buff Impossible to Catch (Stealth) Defense +10%, Movement Speed +25% (you) for 4 s, while Stealth is up
- **Deft Strike** (encounter)
  - slow 5 s
- **Wicked Reminder** (encounter)
  - debuff Wicked Reminder Damage Taken +10% (on the target) for 10 s, to damageType physical, - physical attacks
  - debuff Wicked Reminder (Stealth) Critical Avoidance -5% (on the target) for 10 s, while Stealth is up
- **Dazing Strike** (encounter)
  - Dazing Strike: magnitude set 500, while Stealth is up, - Stealthed: 500
  - daze 4 s
  - interrupt
  - buff Combat Advantage (you) for 4 s, ASSUMED, - yours against the targets hit (assumed)
- **Assassinate** (encounter)
  - Assassinate: magnitude mult 1.25, only when behindTarget, - +25% from behind
  - Assassinate: magnitude mult 1.25, while Stealth is up and not (only when behindTarget), ASSUMED, - Stealthed: +25% from any direction; assumed the same 25% (not stacked from behind)
  - interrupt
- **Shocking Execution** (daily)
  - Action Points gain 50% of the bar, on each hit (once per 20 s), only when enemyHealthPct < 20, - target below 20%: refills half the bar, once per 20 s

## Whisperknife

- **Sneak Attack** (slottedClassFeatures)
  - buff Recharge Speed +10% (you), while Stealth is up, - while Stealthed (cooldown rate read as Recharge Speed)
- **Tenacious Concealment** (slottedClassFeatures)
  - Stealth (Stealth refill): amount mult 1.5, - +50% Stealth regeneration (the base is not captured, so this is zero too)
- **Cloud of Steel** (atWill)
  - hit 60 (single)
  - +1 Cloud of Steel on the target, on each hit, ASSUMED, - 5 s, refreshed by each hit (assumed)
  - Cloud of Steel: magnitudePct add 5, scaled by Cloud of Steel stacks, - +5% Cloud of Steel damage per stack, 10 max
- **Blade Flurry** (encounter)
  - Blade Flurry: cooldownSeconds set 0, while Stealth is up, - Stealthed: no cooldown (radius 25 ft)
- **Lashing Blade** (encounter)
  - hit 715 (single)
  - hit 300 (single), while Stealth is up, - Stealthed: another 300 hit
- **Path of the Blade** (encounter)
  - Path of the Blade: durationSeconds set 3, while Stealth is up, - Stealthed: same 4 pulses in 3 s
- **Smoke Bomb** (encounter)
  - daze 4 s
  - buff Combat Advantage (party) for 4 s, while Stealth is up, - Stealthed: you and allies inside
- **Bait and Switch** (encounter)
  - set Stealth Meter to 100, while Stealth is up, - Stealthed: refills the meter and keeps Stealth
- **Hateful Knives** (daily)
  - knockdown, MISSING seconds (counts zero)
  - buff Combat Advantage (you) for 6 s, ASSUMED, - yours against the target (assumed)
- **Whirlwind of Blades** (daily)
  - buff Whirlwind of Blades Damage Bonus +3% (you) for 10 s, x1 per enemyCount (max 5), - 3% per enemy hit, first 5
- **Courage Breaker** (daily)
  - debuff Courage Breaker Outgoing Damage -15% (on the target) for 8 s
  - slow 8 s, - 70%, ignores control immunity
- **Stealth** (mechanic)
  - set Stealth Meter to 100, at the pull, ASSUMED, - full at the pull (the meter refills out of combat)
  - +0 Stealth Meter, every 1 s, not (while Stealth is up), MISSING amount (counts zero), - refill time not captured (gating test): counts zero
  - buff Stealth (you), only when Stealth Meter > 0 and not (while Stealth is up), - entering Stealth (the rotation decides when; cooldown 0.4 s)
  - spend Stealth Meter (all held, up to 16.666666666666668), every 1 s, while Stealth is up, - a full meter lasts 6 s
  - spend Stealth Meter (all held, up to 15), on cast from atWill powers, while Stealth is up
  - end Stealth, per 1 Stealth Meter spent, only when Stealth Meter <= 0, - the meter is empty
  - +25 Stealth Meter, on cast from encounter powers except Vengeance's Pursuit, Shadow Strike, Shadowy Disappearance, Bait and Switch, while Stealth is up, needs feat Dark Reimbursement, - Dark Reimbursement: leaving Stealth with an encounter refunds 25%
  - end Stealth, on cast from encounter powers except Vengeance's Pursuit, Shadow Strike, Shadowy Disappearance, Bait and Switch, while Stealth is up, - encounters end Stealth unless the power keeps it (Vengeance's Pursuit, Shadow Strike, Shadowy Disappearance, Bait and Switch); dailies assumed not to
- **Dagger Threat** (slottedClassFeatures)
  - buff Damage Bonus +10% (you), to tags {"delivery": "ranged"}, only when targetRangeFt <= 20, - ranged attacks within 20 ft (n00b 2026-10-06)
- **Razor Action** (slottedClassFeatures)
  - hit 300 (area), on cast from daily powers
- **Advantageous Position** (slottedClassFeatures)
  - buff Combat Advantage (you) for 2 s, when Stealth ends
  - buff Advantageous Position Incoming Damage -20% (you) for 2 s, when Stealth ends, - area and ranged attacks
- **Talisman of Shadows** (slottedClassFeatures)
  - daze 1 s, when Stealth starts
  - slow 1 s, when Stealth starts
- **Last Moments** (feats)
  - buff Damage Bonus +10% (you), to type atWill/encounter/daily, grows as the target loses health, ASSUMED, - up to 10% by the target's missing health (straight line assumed)
  - buff Damage Bonus +10% (you), to type atWill/encounter/daily, grows as the target loses health and while Stealth is up, ASSUMED, - doubled while Stealthed
- **Shady Preparations** (feats)
  - encounter cooldowns -2 s, when Stealth starts
- **Hidden Attacks** (feats)
  - Stealth (At-will drain): amount set 10
  - Stealth (Stealth refill): amount mult 1.5, - +50% regeneration (base not captured)
- **One with the Shadows** (feats)
  - set One with the Shadows to 1, every 12 s
  - +50 Stealth Meter, on cast from encounter powers, while you have any One with the Shadows
  - spend One with the Shadows, on cast from encounter powers
- **Return to Shadows** (feats)
  - +7.5 Stealth Meter, on cast from encounter powers, not (while Stealth is up) and x1 per enemyCount (max 99), ASSUMED, - 7.5% per target hit; target cap unknown
  - +2.5 Stealth Meter, on cast from encounter powers, not (while Stealth is up) and only when behindTarget and x1 per enemyCount (max 99), - 10% from behind
- **Shadowy Opportunity** (feats)
  - buff Shadowy Opportunity (you) for 5 s, when Stealth ends
  - hit 130, on each hit from atWill/encounter/daily powers, while Shadowy Opportunity is up, ASSUMED, - each of your hits (dot ticks counted, test)
- **Ambusher's Haste** (feats)
  - buff Damage Bonus +40% (you), scaled by stack:Stealth Meter and while Stealth is up, ASSUMED, - up to 40% by how full the meter is, while Stealthed (straight line assumed)
- **Gutterborn's Touch** (feats)
  - buff Gutterborn Damage Bonus +10% (you), to tags {"delivery": "ranged"}, scaled by flankUptime, - ranged powers, while you hold Combat Advantage
- **Disheartening Strike** (atWill)
  - hit 75 (single)
  - damage over time 450 over 10 s, ASSUMED, - 450 over 10 s; tick rate not on the tooltip; refresh assumed
  - debuff Exposed Damage Taken +5% (on the target) for 10 s, to damageType physical/projectile, - physical and projectile attacks
- **Shuriken Toss** (atWill)
  - hit 60 (single)
  - hit 60 (others), - up to 2 more enemies
- **Vengeance's Pursuit** (encounter)
  - hit 200 (single)
  - hit 250 (area), not (while Stealth is up), - re-activate: teleport and hit around you
  - hit 715 (single), while Stealth is up, - Stealthed: single target 715, keeps Stealth
  - stun 1 s, while Stealth is up
  - debuff Vengeance Outgoing Damage -5% (on the target) for 8 s
- **Blitz** (encounter)
  - encounter cooldowns -2 s, while Stealth is up, ASSUMED, - Stealthed: your encounter cooldowns -2 s (whether Blitz itself counts is a test)
- **Impact Shot** (encounter)
  - stun 2 s, while Stealth is up
- **Shadow Strike** (encounter)
  - +20 Stealth Meter, on each hit, not (while Stealth is up), - refills 20% on hit (Stealth cannot be gained while Stealthed)
  - debuff Exposed Damage Taken +5% (on the target) for 10 s, to damageType physical/projectile, - physical and projectile attacks
  - daze 3 s, while Stealth is up
- **Shadowy Disappearance** (encounter)
  - hit 300 (area), ASSUMED, - 300 at one point; a boss takes both only on a short hop (test)
  - hit 300 (others)
  - buff Stealth (you) for 1.5 s, - Stealth for 1.5 s, outside the meter
- **Killing Storm** (daily)
  - debuff Killing Storm Awareness -5% (on the target) for 10 s, - all 12 hits assumed to land on one boss (test)
- **Lurker's Assault** (daily)
  - buff Lurker's Assault Damage Bonus +40% (you) for 10 s
  - buff Lurker's Assault regen (you) for 10 s, MISSING stats (counts zero), - the Stealth meter regenerates very quickly (rate not on the tooltip)

## Not mapped (and why)

- **Stealth refill**: THE gating number: seconds to refill the meter from empty. Until captured it counts zero, so Stealth only comes from Invisible Infiltrator, One with the Shadows, Return to Shadows, Shadow Strike, Bait and Switch, Shadowy Disappearance and the full meter at the pull. Every Stealth-dependent number is a known underestimate.
- **Shadow of Demise**: 40% of the damage you deal during the 5 s mark is dealt again: the vocabulary has no 'repeat damage' effect (same gap as Tyrannical Curse). Proposing one new kind, 'echo' (a percent of the damage you deal to the target over a window, dealt again at the end).
- **Sly Flourish**: Magnitude rises through the combo but later hits and combo length are not on the tooltip: scored at the 40 floor (known underestimate).
- **Duelist's Flurry Bleed**: Chance, damage per stack and tick rate are not on the tooltip: recorded, scores zero (the biggest open Assassin number).
- **Skullcracker mark extension**: +0.5 s per damage instance up to +5 s: counted as the full 15 s (a fast at-will reaches it in under 2 s).
- **Lurker's Assault / Gloaming Cut / Master of Shadows / Tenacious Concealment / Hidden Attacks regen**: All multiply the Stealth refill, which is not captured: recorded, zero until it is.
- **Infiltrator's Action / Dazing Strike / Hateful Knives / Smoke Bomb / Advantageous Position Combat Advantage**: Recorded as Combat Advantage windows; your Combat Advantage uptime slider still decides Combat Advantage damage (not yet combined).
- **Bait and Switch decoy / Impossible to Catch control immunity / Courage Breaker slow / Deft Strike range**: Survival, taunt and movement: no damage.
- **Swift Footwork, Scoundrel Training, Skillful Infiltrator, Tactics**: Plain sheet stats, already on the stat panel.
- **Thievery, Roll**: No combat damage.

## Where this differs from today's simulator

The step 2.3 parity check must show exactly these differences and nothing else.

1. Cloud of Steel: today's simulator gives every throw the flat 60 / 45. New data adds its own +5% / +2.5% per stack (up to 10 stacks): about +50% / +25% once stacked.
2. Disheartening Strike: today's simulator counts only the 75 hit. New data adds the 450 damage over time and the +5% physical damage taken debuff.
3. Vengeance's Pursuit: today's simulator counts only the 200 throw. New data adds the 250 follow-up (715 from Stealth).
4. Shadowy Disappearance: today's simulator lands 300 x2 = 600 on a single target. New data: 300 on a single target (both points only on a short hop, test).
5. Gloaming Cut: today's simulator always uses 150. New data adds up to +100% as the target loses health (same 150 at full health).
6. Everything else today's simulator does not model for Rogue (Stealth, its modes and feats, procs) starts counting where the data has numbers.

## In-game checks this batch adds to the test list

- (gating) Stealth meter: seconds to refill from empty in combat.
- Is the Stealth meter full when a fight starts?
- Do dailies end Stealth?
- Sly Flourish combo: number of hits and the magnitude of each.
- Duelist's Flurry Bleed: chance per hit, damage per stack, tick interval.

## Stack rules

- **Stealth Meter**: max 100 - percent of the bar
- **Cloud of Steel**: max 10, lasts 5 s, a new stack resets every timer
- **Targeted**: max 5
- **Toxic Blades**: max 5, lasts 15 s, a new stack resets every timer (ASSUMED)
- **Duelist's Expertise**: max 15
- **Skullcracker**: max 1
- **One with the Shadows**: max 1
- **First Strike**: max 1

Records: 137. Validator: PASS.
