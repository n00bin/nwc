# Rogue Assassin audit (2026-10-17)

n00b: "audit next class you can pick" (after the 12 Arbiter tests). Picked Assassin: the damage paragon with the most
open test flags (20) and guessed records (14) in ../data/classes.json. Read-only; nothing changed by the audit.
Two passes: (1) every feat and class feature run through the real scored fight to catch anything that scores zero
(the check that found Critical Sun and Piercing Javelin on Arbiter); (2) every Assassin item read against its
tooltip capture in docs/calibration/inbox/powers/rogue-powers/.

## Summary

The numbers are clean: every magnitude, cast time, AP cost, duration and stack cap matches the Assassin captures.
The problems are mechanics the simulator scores at zero or on a guess, led by Stealth itself:

1. **Stealth never refills in the fight** (refill amount unknown). Every Stealth-linked bonus counts only at the pull
   and after a daily: Lashing Blade, Dazing Strike, Assassinate, Blade Flurry's recast, Sneak Attack, Cunning
   Ambusher, Skillful Infiltrator. Tenacious Concealment, Master of Shadows' regen half and Gloaming Cut's +50% all
   multiply that zero. Invisible Infiltrator looks like +18% only because it is the one Stealth source.
2. **Tier 5 is a coin flip**: Execution (needs the enemy under 20% health; the fight's default is 100%) and Shadow's
   Flurry (its hit has magnitude 0) both score zero.
3. **Oppressive Darkness may be overstated**: +20 magnitude on EVERY hit (a guess) is +57% on Duelist's Flurry.
4. **Duelist's Flurry's Bleed scores zero** (numbers not on the tooltip).
5. **Combat Advantage grants do nothing** (Dazing Strike, Hateful Knives, Smoke Bomb, Infiltrator's Action): the fight
   assumes 100% Combat Advantage already. Correct under that setting.
6. **Search lead**: Tactics (pure upside) LOWERS the score 0.3-1.8%. Same as the Flame Strike case on 2026-10-16.

## In-game test plan (ordered by impact)

1. Stealth: refill time from empty (no regen feats), and how fast Duelist's Flurry drains it in Stealth.
2. Oppressive Darkness: one extra hit per Duelist's Flurry hit, or per press?
3. Duelist's Flurry: hits per press, Bleed tick size / rate / stacks.
4. Shadow's Flurry: the shadow's hits, their size, and whether they Bleed.
5. Assassinate in Stealth from behind vs out of Stealth from the front.
6. Toxic Blades stacks per Path of the Blade; Assassin's Target stacks per Flurry press.
7. Cooldowns: Assassinate / Blade Flurry / Lashing Blade vs Dazing Strike on a stopwatch.
8. The rest of the list below (Back Alley Tactics curve, Skullcracker, Smoke Bomb + Wicked Reminder, Bloodbath, Sly
   Flourish, Duelist's Expertise timing). Execution needs a target that can drop under 20%.

## Simulator-side findings (zero-damage check, 2026-10-17)

Method: the page's real scored fight (pt2ScoredSetup + pt2SimScored, crits on), 180 s, one enemy, two kits.
Kit A: Duelist's Flurry + Sly Flourish; Assassinate / Blade Flurry / Lashing Blade; Bloodbath + Shocking Execution.
Kit B: Gloaming Cut + Cloud of Steel; Wicked Reminder / Dazing Strike / Smoke Bomb; Hateful Knives + Whirlwind of Blades.
Base feats Assassin's Target / Knife's Edge / Duelist's Expertise / Back Alley Tactics / Execution; features
Skillful Infiltrator + Sneak Attack. Base damage per second: A 647,892, B 417,664.

| Swap | Kit A | Kit B |
|---|---|---|
| T1 Assassin's Target -> Toxic Blades | +5.06% | +8.43% |
| T2 Knife's Edge -> Master of Shadows | +0.13% | -3.24% |
| T3 Duelist's Expertise -> Skullcracker | +1.56% | +1.11% |
| T4 Back Alley Tactics -> Hastily Sharpened Blades | +1.70% | +1.18% |
| T5 Execution -> Shadow's Flurry | **0.00%** | **0.00%** |

| Feature added next to Skillful Infiltrator | Kit A | Kit B |
|---|---|---|
| Sneak Attack | +1.26% | 0.00% |
| Tenacious Concealment | **0.00%** | **0.00%** |
| Tactics | **-0.31%** | **-1.83%** |
| Invisible Infiltrator | **+18.03%** | +2.13% |
| Infiltrator's Action | 0.00% | +0.34% |
| Oppressive Darkness | +7.94% | +7.90% |
| First Strike | +0.03% | +0.03% |

1. **The Stealth meter never refills** (Stealth mechanic, record "Stealth refill", amount missing: "refill time not
   captured"). The meter is full at the pull and refilled only by Invisible Infiltrator's daily refill. Stealth is the
   Assassin's core mechanic (Combat Advantage, stealth versions of encounters, Sneak Attack, Skillful Infiltrator),
   so every stealth-linked item is under-counted, and Invisible Infiltrator looks huge (+18% in kit A) only because
   it is the one source of Stealth. Same shape as divinity for Arbiter: needs a refill-rate test.
2. **Tenacious Concealment scores zero**: +50% Stealth regeneration multiplies the zero refill above.
3. **Execution scores zero at the default fight**: gated on enemy health below 20%, and the fight's enemy health is
   a fixed setting (default 100%). Shadow's Flurry, its tier-5 pair, also scores zero (finding 4), so tier 5 is a
   coin flip in the optimizer today. Design question for n00b: should the default fight include the boss's last
   20% (an execute phase), which would also wake up every other "below X% health" effect in the game.
4. **Shadow's Flurry scores zero**: its shadow's hit has magnitude 0, missing ("the final combo of Duelist's
   Flurry: hit count not on any tooltip").
5. **Tactics lowers the score** (-0.3% / -1.8%) although it is pure upside (+10% Action Point Gain, `fx: null`; the
   engine reads it as a stat). Same symptom as the Flame Strike lead on 2026-10-16: adding a benefit lands the
   best-of search on a worse path. A search issue, not an Assassin data issue; worth its own gap.
6. **Infiltrator's Action adds ~0**: its 10 s of Combat Advantage after a daily changes nothing because the fight
   assumes 100% Combat Advantage uptime (the scenario default). Correct under that setting, not a bug.
7. **Master of Shadows -3.2% in kit B**: "+50% Stealth regeneration, Stealth lasts 25% longer". The regen half
   multiplies the zero refill (finding 1), so only the longer duration counts, and here it lowers damage (fewer
   stealth cycles in the fight, or the search effect in 5). Re-check after the Stealth refill is measured.

## Tooltip vs data (all 44 Assassin items against their Assassin captures)

Data: `G:/ai_projects/nwcb/data/classes.json` -> Rogue -> `paragonPaths[0]` (Assassin: 4 at-wills, 10 encounters, 5 dailies, 3 mechanics, 10 feats, 8 slotted class features) + `classFeatures` (4 always-on General skills). Class-wide `powers` lists are empty by design (per-paragon copies).
Screenshots: `G:/ai_projects/nwcb/website/docs/calibration/inbox/powers/rogue-powers/`. For paired files the Assassin capture is the "(2)" file; the plain file is a Whisperknife capture (checked: Smoke Bomb, Hateful Knives, Stealth). All Assassin captures were readable.
Sim checked: `G:/ai_projects/nwcb/website/toon-forge-rotation.js` (fx runner) and the per-hit scorer in `toon-forge.html` (`pt2MakeScoreHit`).

### Verdict on the data

The data is in very good shape on numbers. Every magnitude, cast time, range, radius, arc, AP cost, duration, percentage and stack cap on all 44 Assassin tooltips matches the stored description, the numeric fields and the fx values. Assassinate's earlier 865 -> 845 fix is correct. Stored descriptions match the tooltip wording. Powers with no `hit` fx are fine: the sim falls back to the top-level magnitude (`scheduleTopLevel`), including the "140x4" / "120x4" pulse shapes. The real gaps are in mechanics, not numbers:
- The Stealth refill rate is unknown, so every Stealth-mode bonus is scored near zero.
- Three damage sources are scored 0: the Duelist's Flurry Bleed, Shadow's Flurry, and part of the Sly Flourish combo.
- One large provisional (Oppressive Darkness per hit) could swing the main filler by about 57%.
- A few fx records cannot have any effect (Combat Advantage grants, the Gloaming Cut regen buff, the Wicked Reminder Stealth crit-avoidance debuff).
- One cooldown inconsistency suggests three base cooldowns may be slightly off.

### Findings (most damage impact first)

1. **Stealth: the refill rate is unknown, so all Stealth modes are scored almost never.** `Stealth (2).png` (Assassin): "Cast 0s, Cooldown 0.4s ... Lasts 6 seconds." The tooltip gives no refill time and no at-will drain. Data: Stealth `fx` "Stealth refill" `amount: 0, missing: ["amount"]`. The meter starts full at the pull, drains 16.67/s (6 s), and loses 15% per at-will cast. That 15% comes from the *Whisperknife* Hidden Attacks tooltip ("instead of 15%") and is not shown on any Assassin capture. With Duelist's Flurry at 0.15 s per cast, a 15%-per-cast drain empties a full bar in about 7 presses (~1 s). Why it matters: Lashing Blade +300, Dazing Strike 350 -> 500, Assassinate x1.25 from any direction, Blade Flurry's free recast, the Smoke Bomb party CA, Sneak Attack's +10% Recharge, Cunning Ambusher's +10% for 5 s, Tenacious Concealment, Master of Shadows and the Gloaming Cut regen all hang off this one unknown. Today Stealth only happens at the pull, after each daily (Invisible Infiltrator) and from Bait and Switch. This is a known underestimate (`reviewFlag` already on the record) and still the single largest Assassin gap.

2. **Oppressive Darkness: per hit vs per power use (large swing, currently the optimistic reading).** `Oppressive Darkness.png`: "When you have Combat Advantage your powers deal an additional 20 magnitude damage to the target." Data `fx`: `hit 20`, `when: {on: "hit", from: [atWill, encounter, daily]}`, `provisional: true`, gated by the flankUptime slider (default 100%). Why it matters: per hit, Duelist's Flurry goes from 35 to 55 per 0.15 s attack (+57% on the main filler, ~+133 mag/s). Per power use, it is far smaller. The tooltip says "powers", not "hits". The sim currently counts the larger reading at 100% CA uptime, so an Assassin build with this slotted may be overstated.

3. **Duelist's Flurry: the Bleed is scored 0, and the opening slashes are unmodelled.** `Duelist's Flurry.png`: "Strike with two slashes followed by a flurry of attacks. Magnitude: 35. Apply Effect: Attacks from the flurry each have a chance to add a Bleed effect which can be stacked up to 10 times. Duration: 9s." Cast 0.15s. Data: `hit 35` per 0.15 s cast, plus a `dot` "Bleed" with `magnitude: 0, missing: ["magnitude","ticks"]`, and `chancePerFlurryHit: null`. The numbers match. The gap: Bleed damage, tick rate and proc chance are not on the tooltip, so the Assassin's main filler is an underestimate. The "two slashes" opening is modelled as more 35s at 0.15 s; their magnitude and timing are not stated.

4. **Shadow's Flurry: scored 0, and n00b runs this feat.** `Shadow's Flurry.png`: "Your attacks have a 5% chance to spawn a shadowy figure that uses the final combo of Duelist's Flurry on the target." Data `fx`: `proc` 5% on hit -> `hit` `magnitude: 0, missing: ["magnitude"]`. The 5% matches. The damage per shadow is unknown, because no tooltip gives the final-combo hit count. Known underestimate. If every Duelist's Flurry hit rolls, that is about one shadow every 3 s.

5. **Gloaming Cut: the "+50% Stealth regeneration" fx can never do anything, and the stacking rule contradicts itself.** `Gloaming Cut.png`: "Magnitude: 150. Apply Effect: +50% Stealth regeneration. Duration: 8s." Cast 1.1s, Range 20'. Data `fx`: `buff "Gloaming Cut" seconds 8` with **no stats and no mod**. Tenacious Concealment and Master of Shadows, by contrast, have `mod` records that multiply the "Stealth refill" record. Why it matters: once the refill rate is measured (finding 1), Gloaming Cut's regen still won't count. There is also a second problem. Master of Shadows' `featAdded.stealth.stacking` says "ASSUMED additive with Tenacious Concealment (+50%) and Gloaming Cut (+50%) = +150%". The fx actually chain `op: "mult", value: 1.5` twice (x2.25, or x3.375 with Gloaming). The written assumption and the implementation disagree. The rest of Gloaming Cut matches (up to +100% by missing health, 20% Stealth bar on a kill).

6. **Encounter cooldowns: the shown/base ratio differs between powers on the same screen.** On the Assassin captures (same toon, same Recharge Speed):

   | Power | Shown | Data base | Ratio |
   |---|---|---|---|
   | Impossible to Catch | 17.8s | 19.4 | 0.918 |
   | Dazing Strike | 8.9s | 9.7 | 0.918 |
   | Bait and Switch | 21.4s | 23.3 | 0.918 |
   | Path of the Blade | 14.3s | 15.5 | 0.923 |
   | Smoke Bomb | 13.4s | 14.5 | 0.924 |
   | Wicked Reminder | 16.1s | 17.4 | 0.925 |
   | Deft Strike | 12.5s | 13.5 | 0.926 |
   | Assassinate | 13.7s | 14.5 | **0.945** |
   | Blade Flurry | 11s | 11.6 | **0.948** |
   | Lashing Blade | 11s | 11.6 | **0.948** |

   One Recharge Speed should give one ratio. Either the three bold bases are about 3% low (would be ~14.9 / ~12.0 / ~12.0 at the 0.92 ratio) or the other seven are high. It only changes encounter cadence by ~3%, but it affects three of the highest-damage encounters. (Files: `Assassinate.png`, `Blade Flurry (2).png`, `Lashing Blade (2).png` vs the others.)

7. **Combat Advantage grants do nothing in the sim; Infiltrator's Action is worth exactly 0.** The tooltips grant CA in four places:
   - `Dazing Strike.png` "Apply Effect: Combat Advantage"
   - `Hateful Knives (2).png` "Apply Effect: Combat Advantage. Duration: 6s"
   - `Smoke Bomb (2).png` Stealthed: you and allies get CA vs enemies inside
   - `Infiltrator's Action.png` "When you use a Daily power, you gain Combat Advantage for 10 seconds."

   The data has `buff "Combat Advantage"` records with no stats. The sim and scorer read CA only from the flankUptime slider (`toon-forge-rotation.js` line ~793; no code reads a "Combat Advantage" buff). Infiltrator's Action's `readsInput` says it "adds to state.flankUptime", but nothing implements that. At the default 100% CA uptime this costs nothing. For anyone who lowers the CA slider, these powers don't raise CA, and Oppressive Darkness's CA gate never sees them.

8. **Toxic Blades: per hit vs per cast on multi-hit encounters.** `Toxic Blades.png`: "Encounter and Daily attacks to apply a DoT. This DoT deals 20 magnitude weapon damage once every 3 seconds, for 15 seconds, and stacks up to 5 times." The numbers match the data (20 / 3 s / 15 s / 5, `fxStacks` max 5, 15 s). The `fx` adds a stack `on: "hit"` (provisional). Path of the Blade (140x4) and Smoke Bomb (120x4) would therefore give up to 4 stacks per cast, which reaches the 5-stack cap much faster than one-per-cast. The refresh-all rule is also assumed.

9. **Wicked Reminder (Stealthed): the -5% Critical Avoidance debuff is ignored.** `Wicked Reminder.png`: "Stealthed: Also reduces the target's Critical Avoidance by 5% for 10 seconds." Data `fx`: `debuff {Critical Avoidance: -5}`, gated by Stealth. The scorer explicitly skips enemy Critical Avoidance debuffs (`toon-forge.html` `pt2MakeScoreHit`: "enemy Outgoing Damage, Awareness, Critical Avoidance: no change to your hit"). In-game, lower target crit avoidance raises your effective crit chance. The effect is small and Stealth-only, but it is a party damage debuff scored 0. The main +10% physical vulnerability (10 s) matches and is scored.

10. **Smoke Bomb's damage type decides whether Wicked Reminder boosts it.** `Smoke Bomb (2).png`: "dealing poison damage every second ... Magnitude: 120x4 ... Daze 4s". Cast 0.5s, Radius 20'. Data: `damageType: "magical"` (provisional). Wicked Reminder's +10% applies to `damageType: physical` only, so the tag decides whether Smoke Bomb gets +10%. Toxic Blades says "weapon damage" and is tagged physical. The open shared test is already flagged.

11. **Duelist's Expertise: Master Duelist may fire one second early.** `Duelist's Expertise.png`: "0.5% increased damage and deflect chance for each second ... stacking up to 15 times. When you would gain your 16th stack ... granted Master Duelist ... 15% Damage and Deflect chance, for 10 seconds." The numbers match. The `fx` fires Master Duelist on the periodic tick when `stack >= 15`, while stacks stop at 15. Depending on tick order, it fires at the 15th second instead of the 16th, about 4% more often than the 26 s cycle used for `representativeValue: 8`. Minor. "Do stacks rebuild during Master Duelist?" is still open.

12. **Smaller provisionals that affect damage (all match the tooltip numbers; only the reading is assumed):**
    - **Assassinate:** Stealth + behind is treated as one 25% (1,056, not 1,320). `Assassinate.png`: "from behind ... 25% stronger ... Stealthed: Attack is 25% stronger from any direction."
    - **Assassin's Target:** a stack per hit (tooltip: "apply a stack of 'targeted' to the first enemy hit").
    - **Execution:** "10% chance ... 200 magnitude" is rolled per hit.
    - **Back Alley Tactics:** "up to 10% more damage based on how few Action Points" uses a linear placeholder.
    - **Skullcracker:** the mark is counted at a full 15 s and assumed to still apply when the Daze is immune.
    - **Bloodbath:** the full 2,200 is assumed on a single boss. `fx: null`, top-level 2200. `Bloodbath.png` shows "Range 30' Range 30'" with no hit count.
    - **Sly Flourish:** scored at the 40 floor. The tooltip says the magnitude increases through the combo, with no values.
    - **Hastily Sharpened Blades:** counted at 5%, which is the locked n00b ruling and not a mismatch.

13. **Data hygiene (no damage effect):**
    - **Smoke Bomb and Bait and Switch:** `cooldownByParagon` stores the recharge-reduced numbers shown on screen (Assassin 13.4 / 21.4, Whisperknife 14.1 / 22.6) as if they were per-paragon cooldowns. The encounter picker reads this field when `cooldownSeconds` is missing. Today `cooldownSeconds` (14.5 / 23.3) always wins, so it is harmless but misleading.
    - **Bloodbath:** the data has `radius: 30`, but the tooltip shows only "Range 30'" twice.
    - **Hateful Knives:** the knockdown `missing: ["seconds"]` is correct. The tooltip gives no Prone duration.

### Candidate in-game tests (training dummy, short clip)

- **Stealth:** From an empty Stealth bar with no Tenacious Concealment or Master of Shadows slotted, how many seconds until the bar is full?
- **Stealth / Duelist's Flurry:** Enter Stealth and spam Duelist's Flurry. How many presses (or seconds) until Stealth drops? Does each press drain ~15%?
- **Duelist's Flurry:** How much does each Bleed tick deal, how often does it tick, and roughly how many flurry hits does it take to reach 10 stacks?
- **Duelist's Flurry:** On one press, how many damage numbers appear, and do the two opening slashes hit for the same as the flurry hits?
- **Shadow's Flurry:** When the shadow appears, how many hits does it make, how much is each, and do its hits add Bleed stacks?
- **Oppressive Darkness:** With Combat Advantage (behind the dummy), does every Duelist's Flurry hit show an extra ~20-magnitude number, or only one per press?
- **Toxic Blades:** After one Path of the Blade cast, how many Toxic Blades stacks are on the dummy (1 or 4)? Does a new stack restart the 15 s on the old ones?
- **Assassin's Target:** After one Duelist's Flurry press, how many "targeted" stacks are on the dummy?
- **Assassinate:** In Stealth and from behind, is the hit ~1,056 or ~1,320 magnitude-equivalent (compare against a non-Stealth hit from the front)?
- **Gloaming Cut / Tenacious Concealment / Master of Shadows:** With all three active, how long does a refill take, compared with the base and with each one alone?
- **Encounter cooldowns:** With a stopwatch on one character, do Assassinate, Blade Flurry and Lashing Blade really come back in 13.7 / 11 / 11 s while Dazing Strike takes 8.9 s? Or check the tooltips on a character with 0 Recharge Speed.
- **Dazing Strike / Hateful Knives:** From in front of the dummy (no flank), do your hits during the 4 s / 6 s after the cast hit harder? In other words, is the Combat Advantage yours?
- **Duelist's Expertise:** Does Master Duelist appear at 15 s or 16 s of combat? Do new stacks appear while Master Duelist is running?
- **Skullcracker:** On a boss that is immune to Daze, does the mark still appear? Does the 15 s timer restart when the buff is gained or when it is used?
- **Back Alley Tactics:** What is the damage bonus at an empty bar, half a bar and just under full?
- **Smoke Bomb + Wicked Reminder:** Do Smoke Bomb ticks rise about 10% while Wicked Reminder's debuff is up? If yes, the poison is physical.
- **Bloodbath:** On a single dummy, how many hits land, and does the total come to the full 2,200 magnitude?
- **Sly Flourish:** What magnitude does each step of the combo deal, and how many steps are there?
- **Execution:** On a target under 20% HP, does each hit of Duelist's Flurry roll the 10%, or one roll per press? Needs a target that can drop below 20%, so not an infinite-HP dummy.

### Coverage

- **All 44 Assassin items have an Assassin capture.** Plain file name: Duelist's Flurry, Gloaming Cut, Impossible to Catch, Deft Strike, Wicked Reminder, Dazing Strike, Assassinate, Bloodbath, Shocking Execution, all 10 feats, Invisible Infiltrator, Infiltrator's Action, Oppressive Darkness, First Strike. "(2)" file: Cloud of Steel, Sly Flourish, Blade Flurry, Lashing Blade, Path of the Blade, Smoke Bomb, Bait and Switch, Hateful Knives, Whirlwind of Blades, Courage Breaker, Roll, Stealth, Forte, Skillful Infiltrator, Sneak Attack, Tenacious Concealment, Tactics, Thievery, Swift Footwork, Cunning Ambusher, Scoundrel Training. No item needed a Whisperknife-only capture.
- **Items with no screenshot:** none.
- **Screenshots with no class-data item:** `Furious Assault.png` / `(2)` and `Swift Charge.png` / `(2)`. These are Half-Orc **Racial** traits shown in the General row, stored in `G:/ai_projects/nwcb/data/races.json`, not classes.json.
  - Furious Assault matches: "Critical Severity is 5% higher", `percentStats {Critical Severity: 5}`.
  - Swift Charge's races.json entry has only `notes` and **no `description`**. The tooltip text is: "You gain a 10% bonus to Movement Speed for 3 seconds when you enter combat. This effect can only occur once every 20 seconds."
- **Whisperknife-only screenshots (out of scope, 23):** Advantageous Position, Ambusher's Haste, Blitz, Dagger Threat, Dark Reimbursement, Disheartening Strike, Gutterborn's Touch, Hidden Attacks, Impact Shot, Killing Storm, Last Moments, Lurker's Assault, One with the Shadows, Razor Action, Return to Shadows, Shadow Strike, Shadow of Demise, Shadowy Disappearance, Shadowy Opportunity, Shady Preparations, Shuriken Toss, Talisman of Shadows, Vengeance's Pursuit.
