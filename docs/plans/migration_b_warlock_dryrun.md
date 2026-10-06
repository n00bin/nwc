# Migration B dry run: Warlock

Every effect the simulator will read for this class, in plain English. Nothing here changes the live site.
Old blocks stay as the human record. **MISSING** = not on the tooltip, counts zero until captured.
**ASSUMED** = used and labelled in the confidence line.

## Both paragons

- **Dark Helix** (atWill)
  - +1 Dark Spiral, on a kill, - max 2; kill-fed, rare on a boss
  - spend Dark Spiral (all held, up to 2)
  - hit 135 + 50 per Dark Spiral spent (single)
  - +2 Soul Spark, on each hit, Hellbringer only, - Hellbringer tooltip: +2 per cast, stored as the total
  - +1 Soul Spark per Dark Spiral spent, Hellbringer only
- **Eldritch Blast** (atWill)
  - +1 Soul Spark, on every 3rd hit, Hellbringer only, - enhanced third hit of the 45/45/90 combo only
- **Arms of Hadar** (encounter)
  - knockdown, MISSING seconds (counts zero)
  - +1 Soul Spark, on each hit, Hellbringer only
- **Vampiric Embrace** (encounter)
  - heal 100% of damage dealt, Hellbringer only, - absorbs the damage dealt as hit points
  - heal 100% of damage dealt, only while the target is Cursed, Hellbringer only, - Curse Consume doubles the hit points absorbed
  - +1 Soul Spark, on each hit, Hellbringer only
  - heal 600, Soulweaver only
  - Soulweave spend 200, Soulweaver only
- **Blades of Vanquished Armies** (encounter)
  - damage over time 130 x3 over 6 s, - 130 x3 pulses to enemies within 12 ft of the blades
  - buff Blades protection Incoming Damage -5% (you) for 6 s, - cast on yourself or an ally; 12 ft
  - Blades of Vanquished Armies: magnitudePct add 50, only while the target is Cursed, Hellbringer only, - Curse Synergy: +50% damage to Cursed enemies, checked on each pulse
  - +1 Soul Spark, on each hit, Hellbringer only
- **Hadar's Grasp** (encounter)
  - hit 300 (single), Hellbringer only
  - hit 200 (single), Soulweaver only
  - damage over time 150 x2 over 2 s
  - hold 2 s
  - Hadar's Grasp (Hadar's Grasp): magnitude add 150, only while the target is Cursed, Hellbringer only, - Curse Consume: +150 magnitude
  - hold 1 s, only while the target is Cursed, Hellbringer only, - Curse Consume: hold +1 s
  - hit (amount missing) (single), only while the target is Cursed, Hellbringer only, MISSING magnitude (counts zero), - n00b counted a 4th hit on a Cursed boss; its damage is not on the tooltip
  - buff Soul Puppet (you) for 20 s, only while the target is Cursed, Hellbringer only, - Curse Consume summons a Soul Puppet
  - +1 Soul Spark, on each hit, Hellbringer only
- **Dreadtheft** (encounter)
  - refresh Curse on the target, on each hit, only while the target is Cursed, Hellbringer only, - Curse Synergy: refreshes Curse on every target hit
  - +1 Soul Spark, on each hit, Hellbringer only
- **Soul Siphon** (daily)
  - buff Soul Puppet (you) for 20 s, Hellbringer only
  - +1 Soul Spark, on each hit, Hellbringer only
  - heal 1500, Soulweaver only
- **Brood of Hadar** (daily)
  - hit 800 (single)
  - stun 2 s
  - damage over time 200 x6 over 10 s, - six imps, one attack each (n00b counted 7 hits on a boss)
  - hit 400 (others), - other enemies near the target only; the primary target does not take it
  - +1 Soul Spark, on each hit, Hellbringer only
- **Flames of Phlegethos** (daily)
  - hit 500 (single)
  - damage over time 400 x4 over 4 s
  - +1 Soul Spark, on each hit, Hellbringer only

## Hellbringer

- **Flames of Empowerment** (slottedClassFeatures)
  - debuff Flames of Empowerment (your powers) Damage Taken +1% (on the target) for 10 s, up to 2 stacks, on each hit from atWill powers
  - debuff Flames of Empowerment (all damage) Damage Taken +1% (on the target) for 10 s, up to 2 stacks, on each hit from atWill powers
- **Dark One's Blessing** (slottedClassFeatures)
  - +6 Soul Spark, at the pull
  - +6 Soul Spark, on a kill (once per 10 s)
  - heal 5% max HP, at the pull
  - heal 5% max HP, on a kill (once per 10 s)
- **Deadly Curse** (slottedClassFeatures)
  - hit 25, when Curse is applied
- **No Pity, No Mercy** (slottedClassFeatures)
  - adds to Hellish Rebuke: +3 Soul Spark, on each Hellish Rebuke hit, - 3 per initial hit, removes from Hellish Rebuke: dot, Soul Spark, - no burn; 3 sparks per initial hit
  - Hellish Rebuke (Hellish Rebuke): magnitude add 15
  - Hellish Rebuke (Retaliate): magnitude add 15
- **Dark Prayers** (slottedClassFeatures)
  - +1 Soul Spark, on each hit from Soul Puppet, - 1 spark per Soul Puppet hit
  - buff Soul Puppet (you) for 20 s, on a kill, only while the target is Cursed, - a Cursed target dies: spawn a Soul Puppet
- **All-Consuming Curse** (slottedClassFeatures)
  - set Curse to 1 on the target, lasts 8 s, on cast from atWill powers, - at-will powers apply Curse
- **Double Scorch** (feats)
  - Soul Scorch (Soul Scorch hit): scalesWith.per add 25, - hit 25 -> 50 per spark; the burn stays 25
- **Power of the Nine Hells** (feats)
  - adds to powers matching {"type": "encounter", "tags": {"curse": "apply"}}: buff Soul Puppet (you) for 20 s, - encounters without Curse Consume or Synergy summon a Soul Puppet
- **Parting Blasphemy** (feats)
  - hit 85, when Curse is removed, - consumed or expired
- **Warlock's Curse** (feats)
  - buff Damage Bonus +15% (you), only while the target is Cursed
- **Soul Desecration** (feats)
  - Soul Puppet: permanent set True
  - Soul Puppet (Soul Puppet attack): magnitude mult 2, - deals 100% more damage
  - buff Soul Puppet (you) for 20 s, at the pull, - auto-summons when none is active; never dissipates
- **Creeping Death** (feats)
  - damage over time 25 x5 over 10 s, up to 5 stacks, on each hit from atWill/encounter/daily powers
- **Executioner's Gift** (feats)
  - buff Damage Bonus +30% (you), grows as the target loses health, ASSUMED, - straight line from 0 at full health to 30 at zero is assumed
- **Soul Spark Recovery** (feats)
  - encounter cooldowns -1 s, per 6 Soul Spark spent
- **Vengeful Curse** (classFeatures)
  - set Curse to 1 on the target, lasts 8 s, 5% chance when you are hit
- **Hellish Rebuke** (atWill)
  - hit 70 (single)
  - damage over time 1.5 x10 over 10 s, ASSUMED, - 15 over 10 s; 1 s ticks per n00b (unverified)
  - hit 25, when you are hit, - when the ignited target attacks you
  - +1 Soul Spark, on each hit, - +1 on the hit and +1 per burn tick
- **Hand of Blight** (atWill)
  - melee form: +2 Soul Spark, on every 4th hit, - +2 on every fourth hit
  - melee form: debuff Blight Outgoing Damage -4% (on the target) for 5 s, on every 4th hit
  - ranged form: +1 Soul Spark, on each hit
- **Fiery Bolt** (encounter)
  - +1 Soul Spark, on each hit
- **Curse Bite** (encounter)
  - hit 325 (area), only while the target is Cursed, - only Cursed enemies are hit
  - +1 Soul Spark, on each hit
- **Infernal Spheres** (encounter)
  - buff Infernal Spheres Damage Bonus +5% (you) for 10 s
  - hit 75, when you are hit, - up to six spheres
  - hit 750 (area), - 750 on one target, falling to 250 as targets increase (curve not on the tooltip)
  - +1 Soul Spark, on each hit
- **Killing Flames** (encounter)
  - buff Soul Puppet (you) for 20 s, on a kill, - killing blow spawns a Soul Puppet
  - +1 Soul Spark, on each hit
- **Hellfire Ring** (encounter)
  - hit 200 (area)
  - damage over time 50 x5 over 5 s
  - +1 Soul Spark, on each hit
- **Gates of Hell** (daily)
  - Gates of Hell: magnitude set 1400, only while the target is Cursed, - Curse Synergy: 1100 -> 1400 against Cursed targets
  - knockdown, MISSING seconds (counts zero)
  - +1 Soul Spark, on each hit
- **Tyrannical Curse** (daily)
  - debuff Tyrannical Curse Damage Taken +15% (on the target) for 20 s
  - echo 15% of your damage to the target over 20 s, copied to other enemies as it lands, - 15% of your damage to the target is copied to other enemies within 30 ft (zero on a single boss)
  - +1 Soul Spark, on each hit
- **Curse** (mechanic)
  - set Curse to 1 on the target, lasts 8 s, on cast from powers tagged curse apply, - powers tagged Curse apply
  - spend Curse on the target, on cast from powers tagged curse consume, - powers tagged Curse Consume
- **Soul Spark** (mechanic)
  - set Soul Spark to 6, at the pull, - tooltip: you regenerate up to 6 Soul Sparks out of combat, so a fresh pull starts with 6
  - buff Dmg Bonus +15% (you), scaled by Soul Spark stacks, - 0.5% per spark
  - buff Dmg Bonus +15% (you), scaled by Soul Spark stacks, needs feat Wrathful Souls, - +0.5% per spark more
- **Soul Scorch** (mechanic)
  - spend Soul Spark (up to 18, at least 6), - spends up to 18; needs at least 6. When to fire is the rotation's choice (scorchAtSparks)
  - hit 25 per Soul Spark spent (single)
  - damage over time 25 per Soul Spark spent over 6 s, ASSUMED, - 12 ft around the target; 1 s ticks assumed; a second Scorch is assumed to REPLACE a burn still running (not on the tooltip)
- **Soul Puppet** (mechanic)
  - hit 60 (single), every 1 s while Soul Puppet is up, - about one swing per second while the puppet is up (n00b)
  - +1 Soul Investiture, lasts 20 s, when Soul Puppet is summoned again while up, - summoning while one is active refreshes it and adds a stack
- **Soul Investiture** (mechanic)
  - Soul Puppet (Soul Puppet attack): magnitudePct add 50, scaled by Soul Investiture stacks, - +10% per stack
  - buff Encounter Dmg Bonus +20% (you), while you have any Soul Investiture, needs feat Risky Investment
  - buff Encounter Dmg Bonus +10% (you), scaled by Soul Investiture stacks, needs feat Risky Investment, - +2% per stack

## Soulweaver

- **Flames of Empowerment** (slottedClassFeatures)
  - debuff Flames of Empowerment (your powers) Damage Taken +1% (on the target) for 10 s, up to 2 stacks, on each hit from atWill powers
  - debuff Flames of Empowerment (all damage) Damage Taken +1% (on the target) for 10 s, up to 2 stacks, on each hit from atWill powers
- **Dark One's Blessing** (slottedClassFeatures)
  - Soulweave gain 60, at the pull
  - Soulweave gain 60, on a kill (once per 10 s)
  - heal 5% max HP, at the pull
  - heal 5% max HP, on a kill (once per 10 s)
- **Souleater** (slottedClassFeatures)
  - proc: hit 20; Soulweave spend 10, on each hit, - after most damaging attacks (which ones are excluded is not on the tooltip)
- **Soulbond** (slottedClassFeatures)
  - heal 300, every 10 s, only when an ally is low on health (fight fact), - ally under 50% within 30 ft, once per 10 s
- **Vengeful Blades** (classFeatures)
  - proc: hit 100, 5% chance when you are hit
- **Essence of Time** (feats)
  - Soulweave regenPct ?, every 3 s, MISSING amount (counts zero), - up to 4 stacks; reset by any Soulweave spend
- **Essence of Power** (feats)
  - Soulweave regenPct ?, on each hit, MISSING amount (counts zero), - for 6 s
- **Focused Spark** (feats)
  - adds to Soul Reconstruction: buff Focused Spark (party) for 6 s
  - Inspirit: magnitude add 100, while Focused Spark is up
- **Soul Reclamation** (feats)
  - Soulweave regenPct ?, only when pool:soulweavePct < 30, MISSING amount (counts zero), - Lifespark stops casting Inspirit meanwhile
- **Oversoul** (feats)
  - buff Dmg Bonus +10% (you), scaled by how full the Soulweave bar is, ASSUMED, - straight-line fall-off assumed
- **Soultheft** (feats)
  - Soulweave gain 25, when you are hit (once per 10 s)
- **Bright Spark** (feats)
  - buff Bright Spark (you) for 12 s, on cast from daily powers
  - Inspirit: magnitude add 300, while Bright Spark is up
- **From the Brink** (feats)
  - buff Outgoing Healing +15% (you), only when an ally is low on health (fight fact)
- **Feypact** (feats)
  - adds to Revitalize: heal 200 over 12 s
  - adds to Soulstorm: heal 250 over 12 s
  - adds to Inspirit: heal 60 over 12 s
  - adds to Vampiric Embrace: heal 250 over 12 s
- **Hellpact** (feats)
  - adds to Vampiric Embrace: barrier 65% of healing for 20 s
  - adds to Revitalize: barrier 65% of healing for 20 s
  - adds to Soulstorm: barrier 65% of healing for 20 s
  - adds to Inspirit: barrier 65% of healing for 20 s
  - Infernal Sanction (Infernal Barrier): magnitude add ?, MISSING value (counts zero), - the barrier is stronger by an amount not on the tooltip
- **Soul Reconstruction** (atWill)
  - heal 275
  - Soulweave spend 40
- **Infernal Sanction** (atWill)
  - heal 50
  - barrier 800 for 20 s, ASSUMED, - a recast is assumed to refresh, not add
  - Soulweave spend 80
- **Revitalize** (encounter)
  - heal 850, - 20 ft; smaller as targets increase (curve not on the tooltip)
  - Soulweave spend 100
- **Pillar of Power** (encounter)
  - buff Pillar of Power Dmg Bonus +5%, Outgoing Healing +5%, Incoming Damage -5% (party) for 10 s
- **Wraith's Shadow** (encounter)
  - debuff Wraith's Shadow Outgoing Damage -5% (on the target) for 6 s
  - slow 6 s
- **Soulstorm** (encounter)
  - heal 500 over 6 s, - recasting ends the previous circle
  - Soulweave spend 220
- **Warlock's Bargain** (encounter)
  - buff Warlock's Bargain Outgoing Healing +10% (you) for 10 s
  - Soulweave gain ?, MISSING amount (counts zero)
- **Soul Barrier** (daily)
  - buff Soul Barrier Incoming Damage -10% (party) for 12 s
  - heal 250 over 12 s
  - barrier 100% of healing for 20 s
- **Soul Pact** (daily)
  - heal 800, - up to 9 allies
  - buff Soul Pact Incoming Damage -10% (you) for 10 s
- **Soul Manipulation** (mechanic)
  - Soulweave regenPct ?, MISSING amount (counts zero), - in-combat regen not on the tooltip
- **Inspirit** (mechanic)
  - heal 120, every 2.5 s, - cast automatically by the Lifespark
- **Lifepact** (mechanic)
  - heal 1000, - per second while held
  - Soulweave spend ?, MISSING amount (counts zero), - drain per second not on the tooltip

## Not mapped (and why)

- **Curse**: Combat Advantage for 3 s: already inside the 100% Combat Advantage the engine assumes, so not counted twice.
- **Flames of Phlegethos**: Combat Advantage for the burn: same reason as Curse.
- **Soul Spark**: Out of combat, sparks above 6 burn off at 1 per second and heal 0.5% max HP: not part of a fight.
- **Soul Puppet**: Inherits your stats, +50% max HP, immune to area damage: survival only, no damage number.
- **Dark Helix / Eldritch Blast (Soulweaver)**: Whether Soulweaver at-wills feed the Soulweave bar is untested (open since 2026-09-11).
- **Borrowed Spirit**: Needs another player healing you. The builder does not model other players (PT2-15), so it stays zero.
- **Soul Pact**: You lose 1% of max HP per second for 10 s: a self-damage cost the vocabulary has no kind for. Survival only.
- **Soul Barrier**: The Lifespark cannot cast Inspirit while it channels the barrier: a pet-busy rule, healing only.
- **Warlock's Bargain**: The Lifespark is absorbed for 10 s (no Inspirit): same pet-busy rule, healing only.
- **Revitalize**: Removes one negative condition: display only.
- **Lifespark / Lifemark / Lifelink / Flowing Link**: Targeting and movement rules, no numbers.

## Where this differs from today's simulator

The step 2.3 parity check must show exactly these differences and nothing else.

1. Dreadtheft: today's simulator also gives it the +50% Cursed bonus that belongs to Blades of Vanquished Armies. New data: Dreadtheft only refreshes Curse.
2. Blades of Vanquished Armies: today's simulator also lets it refresh Curse (Dreadtheft's line). New data: Blades only gets +50% on Cursed enemies.
3. Power of the Nine Hells: today's simulator also summons the puppet from the four dailies that apply Curse. The tooltip says encounter powers, so new data: encounters only.
4. Soul Spark at the pull: today's simulator starts at 0 sparks. The tooltip says you regenerate up to 6 out of combat, so new data starts at 6 (12 with Dark One's Blessing).
5. Creeping Death: today's simulator also lets Soul Scorch apply it. The tooltip says At-Will, Encounter or Daily powers, so new data leaves Soul Scorch out.
6. Soul Spark Recovery: today's simulator cuts cooldowns by sparks spent / 6 even for part-sixes (10 sparks = 1.67 s). New data: 1 s per full 6 (10 sparks = 1 s). Same at the default 18.
7. Hand of Blight (melee): today's simulator adds 0.5 sparks every hit. New data: 2 sparks on every fourth hit. Same total, different timing.
8. Brood of Hadar imps: spacing changes from 10/7 s to 10/6 s apart. Same total.
9. Hadar's Grasp on a Cursed target: today's simulator gives all 4 sparks on the grab. New data: 1 per hit, the 4th on the extra hold second (damage unknown, counted zero).
10. Retaliate (Hellish Rebuke), Sphere retaliation, Vengeful Curse: only fire when the 'being attacked' fight fact is on; today's simulator never fires them. Default off, so no change unless you switch it on.
11. Soul Scorch burn (found in the step 2.3 check, not in the approved list): today's simulator lets a second burn run beside one still ticking; the new data assumes the new burn replaces it. Worth about 2% on a No Pity, No Mercy build. Marked ASSUMED and added to the in-game checks.
12. Flames of Phlegethos sparks (found in the step 2.3 check): today's simulator gives all 5 on the first hit; the new data gives 1 per hit as the burn ticks. Same total, different timing.
13. Arms of Hadar escalating cooldown (found in the step 2.3 check): today's simulator never resets the +2 s per use, because it stamps the use time before checking the 10 s reset. The new simulator resets after 10 s unused, as the tooltip says.
14. Soulweaver damage numbers (found in the step 2.3 check): today's simulator uses the Hellbringer numbers for shared powers (Dreadtheft 200x4, Hadar's Grasp 300). The new one uses each paragon's own tooltip (Soulweaver 175x4 and 200).
15. Soulweaver and Curse (found in the step 2.3 check): today's simulator lets a Soulweaver apply Curse (Flames of Phlegethos, Brood of Hadar) and so boosts Dreadtheft. Curse is a Hellbringer mechanic, so the new one never curses on a Soulweaver.

## In-game checks this batch adds to the test list

- Soul Scorch and Creeping Death: does a Soul Scorch hit add a Creeping Death stack? (Watch the stack count on a dummy.)
- Infernal Spheres: does releasing Seeking Spheres end the +5% damage buff early?
- Brood of Hadar and Flames of Phlegethos: do they really apply Curse? The Curse tooltip says encounter powers; these are dailies.
- Do you start a fight with 6 Soul Sparks? (Look at the spark counter just before the pull.)
- Soul Scorch burn: cast two Scorches within 6 s on a dummy - does the second burn replace the first, or do both tick?

## Stack rules

- **Soul Spark**: max 30
- **Soul Investiture**: max 5
- **Curse**: max 1
- **Dark Spiral**: max 2

Records: 152. Validator: PASS.
