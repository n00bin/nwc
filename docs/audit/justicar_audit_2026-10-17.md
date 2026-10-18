# Paladin Justicar audit (2026-10-17)

n00b: "u choose" (next class after Assassin). Picked Justicar: n00b plays one (Erik, tank) and it has the most open test
flags (25) of any paragon. Read-only; the only change made with it was Faerie Fire's duration (3 -> 5 s, screenshot).
Two passes: (1) every feat, class feature and defensive daily through the TANK objective (Effective HP, what the optimizer
maximises for a tank) and the real scored fight; (2) every Justicar item against its tooltip capture.

## Summary

The data matches the tooltips almost everywhere (cooldowns consistently ~3% under the stored base, Recharge Speed).
The problems are in what the tank score can see:

1. **Every timed defensive effect scores zero for a tank.** The Effective HP number reads only the always-on stat sheet.
   Shield of Faith (-5% damage taken), Shield of the Gods (-30%), Absolution (-20%), Heroism (+20% Max HP), Divine
   Champion's absorb, Unyielding Champion's 60% absorb, Block / Divine Palisade: all exactly zero. All ten Justicar feats
   and every class feature except Aura of Protection move Effective HP by 0.00%. The optimizer cannot tell a defensive
   Justicar loadout from an offensive one. This is a design question (2026-07-17 ruling: tank objective = pure eHP from
   the sheet), not a data bug.
2. **Paladin divinity is not simulated** (Bane, Divine Champion drain, Justicar's Charge, Composure, three feats).
3. **Stamina / block economy not simulated** (Block, Divine Palisade, Divine Champion, Binding Oath, Sacred Shield).
4. **Thorns never fire**: Aura of Vengeance and Binding Oath trigger on taking damage, an event the fight never raises.
5. **Faerie Fire** (racial): duration 3 s in the data, 5 s on the tooltip - FIXED 2026-10-17.
6. Heroism stores Max HP as a flat 20 in one place and a percent in another; would mis-scale once a tank path reads it.

## Decision needed first (gap JUS-1)

Should the tank score credit timed defensive effects by their uptime (Shield of Faith 10 s every daily, Shield of the Gods
6 s per Divine Protector, Divine Champion while it's up), or stay "always-on sheet only"? Most in-game tests below only
matter if the answer is "credit them".

## Simulator-side findings (zero-value check, 2026-10-17)

Method: tank role, the tank objective (`computeTankSurvivalScore(100).eHP`, the number the optimizer maximises for a
tank) plus the real scored fight for damage. Kit: Oath Strike + Radiant Slam; Bane / Binding Oath / Smite; Divine
Protector + Shield of Faith. Base feats Sacred Shield / Burning Vengeance / Justicar's Bulwark / Shield of the Gods /
Intimidating Presence; features Aura of Protection + Blessed Wanderer. Base eHP 1,698,338 (Max HP 1,831,264,
mitigation -7.83%).

| Swap | eHP | damage |
|---|---|---|
| T1 Sacred Shield -> Divine Reciprocation | 0.00% | 0.00% |
| T2 Burning Vengeance -> Baneful Strikes | 0.00% | 0.00% |
| T3 Justicar's Bulwark -> Divine Pursuit | 0.00% | 0.00% |
| T4 Shield of the Gods -> Sheltering Light | 0.00% | 0.00% |
| T5 Intimidating Presence -> Unyielding Champion | 0.00% | -8.83% |

Every class feature added next to Aura of Protection: eHP 0.00% (Composure, Aura of Valor, Divine Retribution, Divine
Challenger, Aura of Vengeance, Aura of Wrath, Blessed Wanderer). Aura of Protection itself counts (+4% Defense,
always on): 1,698,338 vs 1,657,288 without it.

Dailies: Divine Protector + Shield of Faith 1,698,338; Divine Protector + Radiant Charge 1,698,338; Radiant Charge +
Divine Judgement 1,698,338.

1. **The tank objective ignores every timed defensive effect.** eHP is built from the always-on stat sheet only. Shield
   of Faith (-5% damage taken, 10 s), Shield of the Gods (-30% damage taken, 6 s per Divine Protector), Divine
   Champion's absorb, Unyielding Champion's 60% absorb, Block / Divine Palisade and Burning Vengeance's auto-block all
   score exactly zero, so the optimizer cannot tell a defensive Justicar loadout from an offensive one. This is a
   design question (the tank objective was ruled "pure eHP from the sheet" on 2026-07-17), not a data bug.
2. **Paladin divinity is not simulated.** Only the Cleric (Arbiter) has a divinity pool in the fight. Bane (300),
   Divine Champion's drain, Justicar's Charge (restore per block), Composure (+10% regen), Baneful Strikes, Justicar's
   Bulwark and Divine Pursuit all depend on it and score zero. Same shape as DIV-1 for Arbiter.
3. **Stamina / block economy is not simulated** (Block, Divine Palisade, Divine Champion, Binding Oath's stamina, Sacred
   Shield's stamina on strike): all `fx: null` or missing amounts.
4. **Unyielding Champion lowers damage 8.8%** while its only listed effects are a cheaper Divine Champion and an absorb:
   it should be neutral for damage. Probably the tier-5 swap removes Intimidating Presence's 100-magnitude pulse
   (that is its damage), so this is the value of Intimidating Presence, not a penalty - check.
5. Threat (Oath of Protection, Sacred Shield, Divine Challenger, Aura of Valor, Intimidating Presence) is not part of any
   score; docs/threat_mechanics.md holds the constants. Expected for an eHP objective.

## Justicar (Paladin tank) tooltip vs data audit — 2026-10-17

Read-only. Data: `G:/ai_projects/nwcb/data/classes.json` (Paladin `classFeatures` + `paragonPaths[Justicar]`; the class-wide `powers` lists are empty by design). Captures: `website/docs/calibration/inbox/powers/paladin-powers/`. Code checked for "does the simulator / tank score actually read this": `website/toon-forge.html`, `website/toon-forge-rotation.js`, `website/toon-forge-engine.js`.

Owner loadout visible on every Justicar capture: class features **Aura of Protection** (aura slot) + **Divine Challenger**; feats **Sacred Shield, Baneful Strikes, Justicar's Bulwark, Shield of the Gods, Intimidating Presence**; race Menzoberranzan Renegade (Faerie Fire + Honed Defenses).

### Verdict on the data

The stored text and numbers are in very good shape: every Justicar power, feature and feat I compared matches its tooltip word for word (magnitudes, casts, costs, durations, radii), and the feat-modified captures (Sacred Weapon, Divine Protector, Divine Champion) are correctly split from their base versions. The cooldowns shown are all about 3.2% below the stored base values (13.8/14.2, 27.6/28.5, 18.4/19, 22.1/22.8, 11/11.4), so the base cooldowns are consistent. The gaps are not in the data text but in what reaches the numbers. As far as I can find in the code, **none of the Justicar's own defensive effects feed the tank Effective HP score**. That includes Divine Champion's 50% absorb, Absolution's -20%, Shield of Faith's -5%, Shield of the Gods' -30%, Heroism's +20% Max HP, Divine Palisade and Block. There is one real number mismatch, on the racial Faerie Fire (3 s stored, 5 s on the tooltip). Its 3% enemy-damage cut is not modelled at all.

### Findings (most tank impact first)

1. **Class defensive powers never reach the tank score (system gap).** The tank objective is `computeTankSurvivalScore` / `computeTankExpectedTaken` (toon-forge.html ~L21893–22050). It reads engine stats, `damageBoosts` contributors bucketed `incomingDamage` (gear/enchants) and the active mount combat power's self buffs, and nothing else. Power `fx` buffs only run in the rotation simulator. There, defensive stats are dropped (`scoreHit`: "defensive / healing stats: not damage") and `heal`/`shield`/`control` records are "recorded, not scored" (toon-forge-rotation.js ~L939). `TF_POWER_BUFFS` (toon-forge-rotation-profiles.js) holds damage buffs only. So these stored, correct fx records have zero tank value: Absolution `Incoming Damage -20, 8 s` (Absolution.png, "Decreases damage taken by 20%. Duration: 8s"), Shield of Faith `-5 / +10 Incoming Healing, 10 s` (Shield of Faith.png), Shield of the Gods `-30, 6 s` + `Awareness 30, 12 s` (Divine Protector.png), Heroism `Maximum Hit Points 20, 12 s` (Heroism.png). The optimizer therefore cannot value the tank kit, and the Effective HP panel understates in-fight survivability. Fixing this is engine work, not data work.

2. **Divine Champion absorb has no fx (the biggest Justicar mitigation).** The tooltip (Divine Champion.png) says: "Absorbs 50% of all damage taken, up to 40% of your total maximum hit points. Damage taken depletes your stamina. Stamina regeneration is reduced. Added Effect: Immunity to Control Effects". The data has a descriptive `stance.absorb {share 0.5, capPctMaxHP 40}` and `uptime 50`, but no fx. No code reads `absorbCap`, `stance` or `divineChampion` (grep: 0 hits in toon-forge.html / rotation / engine). Cost 60, cooldown 5 s and cast 0 s all match the tooltip. Unyielding Champion (60% cap, -10 cost; not owner-picked) also has no fx.

3. **Faerie Fire (owner's racial) is wrong and partly unmodelled.** Faerie Fire.png says: "When attacking a foe, you have a 10% chance to apply Faerie Fire for **5 seconds**. This effect reduces the target's Defense by 3% and **the damage of their attacks by 3%**." `general_feats.json` stores `durationSeconds: 3` and "for 3 seconds". `races.json` (Menzoberranzan Renegade and Drow) calls it a "Drow racial encounter power: marks targets, reducing Defense", which is wrong: it is a passive proc. There is no fx, and no code applies either half. With Oath Strike / Valorous Strike landing 3 hits per cast, uptime on a single boss is probably near-constant, so this is a nearly permanent 3% incoming-damage cut plus a 3% target-Defense debuff that the tank score misses.

4. **Divine Palisade and Block have no fx.** Divine Palisade.png says: "absorbing damage up to 60% ... Decrease damage taken by self and allies in a cone behind you by 10% ... Heal ... Heal Magnitude: 200 ... Effect ends when stamina or divinity are depleted". Block.png says: "absorbing damage from the front ... up to 40% of your total maximum hit points". The held share defaults to 0 by ruling (JM-3), which is fine, but nothing could use a non-zero share. Side trap: the PT2 condition key `blocking` is hard-wired to Fighter/Barbarian (toon-forge.html L15265 `case "blocking": return kit.cls === "Fighter" || kit.cls === "Barbarian";`), so a future Paladin record gated on blocking would read false.

5. **Shield of the Gods 25% vs 30% is confirmed on screen.** The feat text says "reduces damage dealt to you by 25%" (Shield of the Gods.png). The equipped Divine Protector tooltip says "Reduces damage by 30%. Duration: 6s. Added Effect: Grants you 30% Awareness. Duration: 12s." (Divine Protector.png, owner has the feat picked). The data uses 30 / 6 s / 30 / 12 s, which matches the live tooltip. The existing test stays open. Base Divine Protector (tether, 20% Awareness) has no capture of its own; it comes from n00b's typed text.

6. **Heroism Max HP fx unit is ambiguous.** The fx is `stats: {"Maximum Hit Points": 20}`, but the same record's `buff` uses `"Max HP Percent": 20`. Elsewhere the engine's `Maximum Hit Points` is a flat pool, and only the mount-power path treats that key as a percent. This is harmless today (finding 1: nothing reads it), but it will mis-scale the moment a tank path reads power buffs. Tooltip: "Increases your maximum hit points by 20%, restores the amount increased, and increases damage dealt by 10%. Duration: 12s".

7. **Aura of Protection Divine Champion +2% Defense is not counted.** The tooltip says "Increases Defense of self and nearby party members by 4% ... Divine Champion Effect: Defense increased by an additional 2%" (Aura of Protection.png, Justicar, Active). The base 4% is on the sheet. The +2% (x50% uptime) exists only as a party `buff` fx, which neither the sim nor the tank score reads. The data note admits this ("engine does not read divineChampionBonus yet"). It is worth about +1% Defense on average.

8. **Divine Protection is counted at full value all fight.** The tooltip says "Adds up to 10% Critical Avoidance whenever your divinity is full. This effect decreases as divinity decreases." (Divine Protection.png). The data keeps 10% always on, and the `divinityScaling` placeholder is not wired. Divine Champion drains Divinity and Smite/Bane/Templar's Wrath spend it, so the in-fight value is lower than the score assumes.

9. **The Divinity economy is not simulated, so Divinity spenders are over-cast (damage).** The Paladin has no `resourcePools`, so `spend` records do nothing (toon-forge-rotation.js L929 only acts when `pools[r.pool]` exists). The `divinityLevel` gate falls back to its default of 50, so Smite is always 575. Smite, Bane, Templar's Wrath and Divine Touch (stored cooldown 0.5 s) hit the "sub-2 s cooldown = capture error" guard and are cast every 6 s / (1+Recharge), with no Divinity limit. Divine Champion's drain and Justicar's Charge income also don't exist. The damage and threat side is likely overstated, and Divine Touch's heal is free.

10. **Aura of Vengeance and Binding Oath thorns never fire.** Their fx use `when: {on: "takeHit"}`. The simulator never fires a `takeHit` event (fire() events: hit, dotTick, crit, noncrit, caHit, bigHit, buff*, stack*, combatStart). The notes say "scored off the tank model hits-taken rate", but no such code exists. Tooltip numbers match: Magnitude 25 / 40 with Divine Champion (Aura of Vengeance.png); 65 for 12 s plus Stamina Restoration for 12 s (Binding Oath.png).

11. **Stamina-scaled effects ignore the stamina slider in the simulator.** Divine Retribution ("up to 5% as remaining stamina decreases") and Burning Vengeance ("up to 800 magnitude damage as your remaining stamina decreases") gate on `currentStaminaPct`. The sim's `fight` object does not carry that key, so the gate default (100) always applies: 0% and the 200 floor. Only the stat panel path reads `state.currentStaminaPct`. Text matches the tooltips (Divine Retribution.png, Burning Vengeance.png).

12. **Stamina and Divinity amounts are still unknown (data marked missing, tooltips give none).** These are Shielding Strike "Stamina Restoration", Sacred Shield "restores stamina with every strike", Binding Oath stamina, Justicar's Charge / Justicar's Bulwark reserve, Divine Pursuit and Baneful Strikes (5%, 10 s). All texts match their captures. They are correctly flagged, not wrong.

13. **Minor text items.** Radiant Charge `description` omits "Magnitude: 750", and the knockdown fx has no seconds (the tooltip gives none; Radiant Charge.png). The Aura of Protection note says its tooltip was captured on the Oathkeeper screen, but a Justicar capture now exists (Aura of Protection.png). The `general_feats.json` Honed Defenses note says "need to verify which race": the Justicar capture shows it on the Menzoberranzan Renegade (Honed Defenses.png, "You gain a bonus 5% Deflect Severity", which matches).

**Checked and matching**, with no action needed: Smite (1.1 s cast = Divine Challenger charge, 0.5 s, 220, 1150), Bane (0.74 s, 300, 620, 80'/15'), Templar's Wrath (1 s, 300, 400, 30'), Burning Light (2 s, 13.8 s, 200–400, Stun 3 s, 25'), Sacred Weapon (Sacred Shield version: 52, stamina, threat, 10 s, 27.6 s), Divine Touch (0.8 s, 200, 900, 80'/20'), Vow of Enmity (0.5 s, 18.4 s, 130, 80'/20'), Relentless Avenger (0.65 s, 11 s, 600, 60'), Oath Strike (0.3 s, 200°, 25, threat), Shielding Strike (0.3 s, 60), Valorous Strike (0.35 s, 60), Radiant Slam (0.8 s, 30'/10', 60), Intimidating Presence, Divine Challenger, Aura of Valor (25% / +15%), Aura of Wrath (4% / +2%), Composure (10%), Blessed Wanderer (20%), Oath of Protection, Forte (Defense; Critical Strike, Deflect Severity), Divine Reciprocation, Sheltering Light, Justicar's Charge, Justicar's Bulwark, Divine Pursuit, Baneful Strikes, Unyielding Champion.

### Candidate in-game tests

- With Divine Champion on vs off, do the combat-log incoming-damage lines from the same mob attack drop by half? After about 40% of your Max HP has been absorbed, do they jump back to full, and does the cap refill while the stance stays on?
- What is Divine Champion's Divinity drain per second (time a full bar to empty while standing in the stance)?
- Faerie Fire: how long does the debuff icon last on the target (3 s or 5 s)? With it up, are that enemy's hits on you about 3% smaller in the combat log?
- Absolution plus Shield of Faith together: is the incoming hit cut 24% (multiplicative) or 25% (additive)?
- Heroism: does Max HP on the character sheet rise by exactly 20% of the pre-buff value, and does current HP jump by the same amount?
- With Shield of the Gods, is a repeated hit cut 30% or 25% while Divine Protector is up, and does the cut last 6 s? (Already open.)
- Turning Divine Champion on: does the stat-panel Defense rise by exactly 2 points with Aura of Protection active?
- Divine Protection: what Critical Avoidance does the stat panel show at full Divinity, at half and near empty?
- Divine Palisade: does the -10% apply to you yourself? Is the 200 heal one tick on raise or repeating while held? Does the 60% absorb take full hits (no front limit)?
- Block: does a blocked front hit show 0 in the combat log until 40% of Max HP has been absorbed, and how much stamina does one blocked hit cost?
- Aura of Vengeance / Binding Oath: does each hit you take produce one reflect line in the combat log, including multi-hit attacks?
- Paladin Divinity: what is the bar maximum and the idle refill time empty to full? Does Composure shorten it by 10%?
- Intimidating Presence: does the 100-magnitude pulse hit a dummy standing 30 ft away, and one at 40 ft?
- Justicar's Charge: how much Divinity does one blocked hit restore, and does it stop after a few blocks? (Repeat the test with and without Justicar's Bulwark.)

### Coverage

- **Data items checked: 47** (4 class skills, 8 Justicar class features, 10 feats, 4 at-wills, 10 encounters, 5 dailies, 6 mechanics). Every item has a Justicar or shared capture. **No data item lacks a screenshot.**
- **Screenshots with no class item:** `Faerie Fire.png`, `Faerie Fire (2).png`, `Honed Defenses.png`, `Honed Defenses (2).png`. These are racial traits, stored in `general_feats.json` / `races.json` (see finding 3).
- **Not re-read in this pass** (data says identical to the Oathkeeper copy; low tank impact): Divine Judgement, Marathon Runner, Divine Meditation, Religion, and the "(2)" duplicates other than Aura of Protection (2) and Sacred Weapon (2), which are Oathkeeper screens.
- About 30 Oathkeeper-only captures were ignored (Aura of Divinity/Life/Restoration, Cure Wounds, Lay on Hands, Sanctuary, Hand of Divinity, Channel Divinity, etc.).
- Code paths named above are from greps and reading the relevant functions, not from running the simulator. "Never reaches the tank score" means I found no reader. A quick check is to slot Absolution vs an empty slot and compare the Effective HP number.

## Locked decisions

- **JUS-1 = 2 (n00b 2026-10-18, "for now, maybe we will revisit it"):** tanks pick powers for aggro, and aggro can't be
  measured cleanly (threat race 2026-10-17 inconclusive on the Increased Threat tag). So for the tank role the optimizer
  should build gear only and leave powers, feats and class features to the player. BUILT 2026-10-18 on n00b's
  word: the optimizer's class-feature search is off for the tank objective (powers and feats were already DPS-only), and
  the dialog says so for tank paragons. Check: a quick tank run keeps powers / features / feats unchanged (68 gear
  changes); the same run with the gate removed swaps the class features. Premium deployed (premium-evv3y4psq).
  Revisit if a cleaner threat test turns up.
