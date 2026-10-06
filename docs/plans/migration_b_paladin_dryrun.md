# Migration B dry run: Paladin

Every effect the simulator will read for this class, in plain English. Nothing here changes the live site.
Old blocks stay as the human record. **MISSING** = not on the tooltip, counts zero until captured.
**ASSUMED** = used and labelled in the confidence line.

## Oathkeeper

- **Blessed Wanderer** (slottedClassFeatures)
  - buff Damage Bonus +20% (you), only when soloOrIsolated, - no party members within 30 ft
- **Valorous Strike** (atWill)
  - hit 60 x3 (single), ASSUMED, - 60 per hit x3 (per-hit reading, test)
- **Burning Light** (encounter)
  - hit 400 (area), - full 2 s charge (a tap is 200)
  - stun 3 s
- **Sacred Weapon** (encounter)
  - buff Sacred Weapon (you) for 10 s
  - hit 52 (single), on each hit from atWill/encounter/daily powers, while Sacred Weapon is up, ASSUMED, - 52 radiant after most attacks for 10 s (per hit assumed, test)
- **Smite** (encounter)
  - Smite: magnitudePct add -100, scaled by divinityLevel, ASSUMED, - 1,150 at full Divinity falling to 0 at empty (straight line assumed); your average Divinity level (default 50%)
  - divinity spend 220
- **Bane** (encounter)
  - divinity spend 300
- **Divine Touch** (encounter)
  - heal 900, - split across targets
  - divinity spend 100
  - barrier 100% of healing for 20 s
- **Shield of Faith** (daily)
  - buff Shield of Faith Incoming Damage -5%, Incoming Healing +10% (party) for 10 s
- **Radiant Charge** (daily)
  - knockdown, MISSING seconds (counts zero)
- **Aura of Life** (slottedClassFeatures)
  - heal 50, on cast from Divine Touch, Divine Shelter, Cleansing Touch, Bond of Virtue, - each healing encounter cast (150 on your Aura of Divinity target)
- **Critical Touch** (feats)
  - proc: buff Critical Touch (you) for 10 s, - next Divine Touch / Divine Shelter crits, 10% chance on cast from Cure Wounds, Divine Touch, Divine Shelter, Cleansing Touch, Bond of Virtue
- **Sheltered Healing** (feats)
  - Cure Wounds (Cure Wounds): magnitude add 150, scaled by cureWoundsOnBarrierShare, - target has a Divine Barrier (80% of the time, review default)
- **Spirit of Austerity** (feats)
  - Smite: magnitude set 600
  - adds to Smite: divinity spend 80, removes from Smite: resource
  - Bane: magnitude set 310
  - adds to Bane: divinity spend 100, removes from Bane: resource
- **Enduring Spirit** (feats)
  - buff Incoming Damage -10% (you), while Sacred Weapon is up
  - divinity regenPct ?, while Sacred Weapon is up, MISSING amount (counts zero)
- **Divine Vessel** (feats)
  - buff Divine Vessel Outgoing Healing +20% (you) for 12 s, every 180 s, only when divinityBelow100, - only when Divinity drops below 100 (toggle, default off); once per 180 s
- **Cure Wounds** (atWill)
  - heal 275
  - divinity spend 40
- **Divine Shelter** (encounter)
  - heal 360
  - barrier 100% of healing for 20 s
  - divinity spend 120
- **Banishment** (encounter)
  - stun 6 s
  - debuff Banishment Outgoing Damage -5% (on the target) for 6 s
- **Cleansing Touch** (encounter)
  - heal 300
  - divinity spend 40
- **Circle of Divinity** (encounter)
  - buff Circle of Divinity Outgoing Healing +15% (you) for 12 s, - standing in it
  - divinity regenPct ?, MISSING amount (counts zero)
- **Bond of Virtue** (encounter)
  - heal 300, - +300 more on the most injured
- **Sanctuary** (daily)
  - Sanctuary: channelSeconds set 12, - a 12 s held channel: nothing else is cast meanwhile (n00b OD-5)
  - buff Sanctuary Incoming Damage -15% (party) for 12 s
  - heal 600 over 12 s, ASSUMED, - 600 over 12 s (total assumed)
- **Hand of Divinity** (mechanic)
  - heal 1200, - full 2.5 s charge
  - barrier 100% of healing for 20 s
  - divinity spend 140

## Justicar

- **Blessed Wanderer** (slottedClassFeatures)
  - buff Damage Bonus +20% (you), only when soloOrIsolated, - no party members within 30 ft
- **Valorous Strike** (atWill)
  - hit 60 x3 (single), ASSUMED, - 60 per hit x3 (per-hit reading, test)
- **Burning Light** (encounter)
  - hit 400 (area), - full 2 s charge (a tap is 200)
  - stun 3 s
- **Sacred Weapon** (encounter)
  - buff Sacred Weapon (you) for 10 s
  - hit 52 (single), on each hit from atWill/encounter/daily powers, while Sacred Weapon is up, ASSUMED, - 52 radiant after most attacks for 10 s (per hit assumed, test)
- **Smite** (encounter)
  - Smite: magnitudePct add -100, scaled by divinityLevel, ASSUMED, - 1,150 at full Divinity falling to 0 at empty (straight line assumed); your average Divinity level (default 50%)
  - divinity spend 220
- **Bane** (encounter)
  - divinity spend 300
- **Divine Touch** (encounter)
  - heal 900, - split across targets
  - divinity spend 200
- **Shield of Faith** (daily)
  - buff Shield of Faith Incoming Damage -5%, Incoming Healing +10% (party) for 10 s
- **Radiant Charge** (daily)
  - knockdown, MISSING seconds (counts zero)
- **Aura of Protection** (slottedClassFeatures)
  - buff Defense +2% (party), x0.5 (Divine Champion up 50% (n00b JM-2)), - Divine Champion: +2% more
- **Aura of Wrath** (slottedClassFeatures)
  - buff Critical Strike +2% (party), x0.5 (Divine Champion up 50% (n00b JM-2)), - Divine Champion: +2% more
- **Aura of Vengeance** (slottedClassFeatures)
  - hit 25 (single), when you are hit, - to attackers when you are hit
  - hit 15 (single), when you are hit, x0.5 (Divine Champion up 50% (n00b JM-2))
- **Divine Retribution** (slottedClassFeatures)
  - buff Damage Bonus +5% (you), scaled by currentStaminaPct, ASSUMED, - 0 at full stamina up to 5% at empty (straight line assumed)
- **Burning Vengeance** (feats)
  - Burning Light (Burning Light): magnitude set 200, ASSUMED, - no charge scaling: 200 (assumed minimum) at full stamina up to 800 at empty
  - Burning Light (Burning Light): magnitudePct add 300, scaled by currentStaminaPct, ASSUMED
- **Shield of the Gods** (feats)
  - adds to Divine Protector: buff Shield of the Gods Incoming Damage -30% (you) for 6 s; buff Shield of the Gods awareness Awareness +30% (you) for 12 s, removes from Divine Protector: buff, - the equipped tooltip in game (30%, n00b) wins over the feat's own 25% text
- **Intimidating Presence** (feats)
  - hit 100 (area), every 1 s, x0.5 (Divine Champion up 50% (n00b JM-2)), ASSUMED, - 100 every second to nearby enemies while Divine Champion is up (radius assumed 30 ft)
- **Divine Reciprocation** (feats)
  - heal 100% of the amount healed, on cast from Divine Touch, - when Divine Touch heals an ally
- **Oath Strike** (atWill)
  - hit 25 x3 (area), ASSUMED, - 25 per hit x3 (per-hit reading, test)
- **Shielding Strike** (atWill)
  - hit 60 x3 (single), ASSUMED, - 60 per hit x3 (per-hit reading, test)
  - stamina gain ?, MISSING amount (counts zero)
- **Templar's Wrath** (encounter)
  - divinity spend 300
- **Absolution** (encounter)
  - buff Absolution Incoming Damage -20% (you) for 8 s
- **Binding Oath** (encounter)
  - buff Binding Oath (you) for 12 s
  - hit 65 (single), when you are hit, while Binding Oath is up, - to attackers while it is up
  - stamina gain ?, MISSING amount (counts zero)
- **Divine Protector** (daily)
  - buff Divine Protector Awareness +20% (you) for 12 s, - while tethered to an ally (their damage comes to you)
- **Heroism** (daily)
  - buff Heroism Maximum Hit Points +20%, Damage Bonus +10% (you) for 12 s
  - heal 20% max HP

## Not mapped (and why)

- **Divinity (both paragons)**: GATING: pool size, regeneration, Justicar's Charge reserve and every Divinity income feat (Composure, Battle Focus, Circle of Divinity, Enduring Spirit, Divine Pursuit, Justicar's Bulwark, Prayer of Opportunity, Baneful Strikes) are not captured: costs recorded, not limiting casts yet.
- **Divine Champion (Justicar)**: Cast cost 60 and the Divinity drain are not modelled; its bonuses use your 50% uptime ruling (JM-2).
- **Divine Protection**: Up to 10% Critical Avoidance by Divinity level: the sheet shows the full 10% at rest; combat scaling is survival only.
- **Block, Divine Palisade, Guarded Prayers, Justicar's Charge, Burning Vengeance's block while charging**: Stamina / block model not built: survival only.
- **Lay on Hands, Divine Intervention, Timely Intervention, Convalescence, Emissary of Warding**: Healing conversions and the emergency heal: recorded on the heal side, not in the damage simulator (PT2-16).
- **Auras of Protection / Wrath / Restoration on the Oathkeeper**: Their extra marked-target bonus goes to an ally (n00b OC-1): party benefit only.
- **Aura of Valor, Divine Challenger, Oath of Protection, Sacred Shield, Vow of Enmity taunt**: Threat only.
- **Unyielding Champion, Sheltering Light**: Divine Champion cost and absorb cap, and healing you receive: survival only.

## Where this differs from today's simulator

The step 2.3 parity check must show exactly these differences and nothing else.

1. Valorous Strike, Oath Strike, Shielding Strike: today's simulator reads the per-hit number as the whole cast. New data uses n00b's per-hit reading (x3, still to test).
2. Burning Light: today's simulator scores 0 (it cannot read the stored '[200, 400]'). New data scores the full charge, 400.
3. Smite: today's simulator always uses 1,150. New data scales it by your average Divinity level (default 50% = 575; straight line assumed).
4. Sacred Weapon: today's simulator lands 52 at the cast. New data adds 52 to every hit for 10 s instead.
5. Sanctuary: today's simulator treats it as a 0.25 s cast. New data holds the 12 s channel (n00b OD-5): nothing else is cast meanwhile.
6. Everything else today's simulator does not model for Paladin (Divine Champion bonuses, Intimidating Presence, Heroism and other buffs, feats) starts counting where the data has numbers.

## In-game checks this batch adds to the test list

- (gating, both) Divinity pool size and regeneration; Justicar's Charge reserve and refill.
- Smite magnitude at full / half / low Divinity (the scaling curve).
- Valorous / Oath / Shielding Strike: per hit or per cast?

Records: 76. Validator: PASS.
