# Tested in Game: what the tooltips don't tell you

A living record of every mechanic we have measured in game, where the tooltip is silent, vague or wrong.
Each entry answers a question players actually ask. Add a new entry after every test, the same day.

- Tested on PS5 by n00b, read frame by frame from his recordings.
- **Status** words: **Verified** (measured, matches or corrects the tooltip), **Measured** (a number we
  measured that the game never prints), **Open** (not settled yet, with the test that would settle it).
- The "Plain answer" line of each entry is written for players and can be published as is (see gap TESTED-1:
  a public "Tested in Game" page, parked 2026-10-16). Everything under "Proof" is ours: numbers, clips, method.
- The simulator data for each entry lives in `../data/classes.json` (a `test` record on the power or feature);
  the full working is in `docs/data_issues.md`.
- **Evidence survives the clips.** n00b deletes recordings to free space, so every test clip gets an evidence pack
  the same day it is read: `docs/calibration/inbox/class_powers/<class>/tests/<clip date>_<clip time>_<test>/` with
  `readings/` (bar series, combat-log reads, contact sheets, crops) and, while the clip still exists, `frames/`
  (a full still every 2 s at 1920x1080, enough to re-read the combat log and the bar). The archive is local (the
  inbox folder is not in git). Clip names below match the folder names.

### Template

```
#### <Power / feature name> (<class / paragon>)
- **Question:** what players want to know
- **Tooltip says:** the exact wording that leaves it open
- **Plain answer:** one or two sentences a player can act on
- **Proof:** the numbers
- **Tested:** date, character, clip file
- **Status:** Verified / Measured / Open
```

---

## Cleric: Arbiter

All Arbiter tests ran on Eliza (Arbiter, Expanded Faith) against the Conjured Fighter dummy, October 2026.

**Gear note (n00b 2026-10-16):** every Arbiter test was recorded wearing Prismatic Luminstep Sabatons (Ruthless
Resources (Greater): a hit or heal over 10% of your max HP gives +5% divinity regen for 15 s, up to 5 stacks).
Checked against each result: the boots never speed Channel Divinity (boots-off clip), taps and refunds are instant,
the base regen of 7.2/s was read after the stacks ran out, the Divine Glow rounds were idle (no hits, no stacks),
Critical Insight compares two runs in the same gear, and the counters, Shifts and damage numbers do not involve
regen. No result changes. The open "slower regen while attacking" lead is not explained by the boots either: they
would raise regen, not lower it.

### The divinity bar

#### Divinity pool size
- **Question:** how big is the divinity bar?
- **Tooltip says:** nothing; the game never prints the number.
- **Plain answer:** 1,000 divinity for an Arbiter. Expanded Faith adds 150, for 1,150.
- **Proof:** casts from a full bar before "Not enough Divinity": Bastion of Health (200) x5, Searing Javelin
  (240) x5, Forgemaster's Flame (300) x3. Only a 1,150 bar fits all three. Bar drops per cast then matched:
  Flame 25.4% (300 / 1,150 = 26.1%), Javelin ~21% (20.9%), Bastion 15.9% (17.4%), a 150 encounter 13% (13.0%).
- **Tested:** 2026-10-14/15. Clips `2026-10-14 22-52-58`, `2026-10-14 23-30-54`, `2026-10-15 01-23-29`.
- **Status:** Measured. Devout's pool is untested.

#### Natural divinity regen
- **Question:** how fast does divinity come back on its own?
- **Tooltip says:** nothing.
- **Plain answer:** about 7.5 divinity a second, roughly empty to full in 2.5 minutes. Divinity-regen gear
  (for example Ruthless Resources on Prismatic Luminstep Sabatons) speeds this up.
- **Proof:** standing idle 7.2/s (2026-10-15, after the boot stacks ran out) and 7.5/s (2026-10-16, two
  rounds). Boots active: 8.3/s.
- **Tested:** 2026-10-15/16. Clips `2026-10-14 22-52-58`, `2026-10-16 07-53-31`.
- **Status:** Measured. **Open:** while attacking with Lance of Faith it read only ~5.7-5.9/s
  (`2026-10-16 07-28-06`, run B). Either regen slows in combat or something else differed; not tested yet.

#### Channel Divinity: holding
- **Question:** how fast does holding Channel Divinity refill the bar, and do regen items speed it up?
- **Tooltip says:** it restores divinity over time; no rate.
- **Plain answer:** about 80-87 divinity a second, empty to full in about 10-14 seconds, and you cannot attack or
  move while holding. Divinity-regen gear does NOT speed it up; that gear only boosts your natural regen.
- **Proof:** 39.5% to 100% in 8.6 s and 57.6% to 100% in 6.1 s (boots on, ~7%/s); 12.9% to 99.1% in 11.3 s with
  the boots removed (7.6%/s, ~87/s), the same or faster.
- **Bar size:** the speed is FIXED, not a percent of your bar. With Expanded Faith off (1,000 bar) three holds ran
  77, 81 and 82 divinity a second, the same as on the 1,150 bar; a percent rule would have given about 70-76. So a
  smaller bar refills sooner (about 12 s from empty instead of 14) and a bigger bar takes longer.
- **Tested:** 2026-10-14/15/16. Clips `2026-10-14 23-30-54`, `2026-10-15 01-23-29`, `2026-10-16 10-36-51`.
- **Status:** Measured.

#### Channel Divinity: the Judgement gauge refund (tap vs hold)
- **Question:** how much divinity do you get back when Channel Divinity empties your Judgement gauge, and is a
  quick tap worth it?
- **Tooltip says:** it "empties the Judgement Gauge, restoring additional divinity"; no number.
- **Plain answer:** every release refunds about 115 divinity plus about 52 per Judgement pip, instantly. A quick tap
  does this without holding, so tapping after every one or two pips refills you far faster than one long hold.
  The catch: the tap throws away the Judgement your next power would have spent for bonus damage (Forgemaster's
  Flame loses its +100 magnitude), so on a damage rotation short channels and taps come out close.
- **Proof:** taps measured at 1 pip ~140-160, 2 pips ~150, 3 pips ~271 (+23.6% of the bar), 5 pips ~374 (+32.5%),
  4 and 6 pips refilled to full. 115 + 52 per pip fits 3, 5 and 6 pips within ~6%.
- **Tested:** 2026-10-15/16. Clips `2026-10-15 22-46-36`, `2026-10-15 23-01-00`, `2026-10-16 05-10-50`.
- **Status:** Measured. **Open:** the 1 and 2 pip readings sit off the straight line; the time a tap takes
  (0.4 s assumed).

#### Sudden Verdict
- **Question:** which kind of Judgement does Sudden Verdict fill?
- **Plain answer:** the kind the power that triggered it builds.
- **Tested:** 2026-10-14.
- **Status:** Verified.

### Feats and class features

#### Angel of Death (feat)
- **Question:** how does the 26-stack counter work, what counts toward it, and what happens if you wait?
- **Tooltip says:** "Encounter powers which cost divinity now grant Angelic Inspiration. When you reach 26
  stacks the effect is converted into Angelic Presence. Duration: 60s." It doesn't say whether the counter resets,
  whether healing powers count, or how the stacks fall off.
- **Plain answer:** every encounter that costs divinity adds one stack, Bastion of Health included. The 26th cast
  converts the counter and it resets to zero. All stacks fall off together 60 seconds after your last stack, and
  each new stack restarts that timer. Once converted you have 60 seconds to tap Channel Divinity for the free
  window, or you lose it. In the buff list the counter shows as "Angel of Death x N" and the ready buff as
  "Angelic Inspiration", not the names the tooltip uses.
- **Proof:** counter read every second. 25 stacks at 3:35, ready buff at 3:39.5, no counter after. Bastion alone
  from 2:16 to 3:39: 16 casts, counter 10 to 26. 6 stacks gone at 1:15 (last stack 0:16); 10 stacks gone at 6:23
  (last stack 5:23.5). Ready buff 3:39.5 to 4:39.5, untapped and lost.
- **Tested:** 2026-10-15. Clip `2026-10-15 23-16-14`.
- **Status:** Verified. **Open:** whether the counter keeps building while the ready buff is up.

#### Perfect Balance (feat)
- **Question:** which powers build which Shift, and what does "exceed one another by a single stack" mean?
- **Tooltip says:** "Encounter powers which generate Radiant Judgement now grant Radiant Shift ... If either
  Radiant Shift or Burning Shift exceed one another by a single stack, both effects will expire immediately."
- **Plain answer:** it works the opposite way round from the tooltip. Forgemaster's Flame gives Burning Shift and
  Daunting Light gives Radiant Shift; the Shift follows the Judgement the power USES, not the one it builds. Being
  one stack ahead is safe; two ahead wipes both. Alternate the two kinds; at 4 and 4 both are consumed and your
  divinity refills to full. Tapping Channel Divinity between casts keeps you casting long enough to get there.
- **Proof:** Flame first: Burning Shift 1 alone stayed up 17 s. A second Flame (2 ahead) cleared it at once.
  Flame, Daunting Light, Flame, Daunting Light to 4 + 4: both gone, bar from ~12% to full.
- **Tested:** 2026-10-16. Clip `2026-10-16 05-10-50`.
- **Status:** Verified for Flame and Daunting Light. Searing Javelin, Sun Burst (Burning) and Chains of Blazing
  Light, Break the Spirit, Geas (Radiant) are assumed to follow the same rule; untested.

#### Critical Insight (class feature)
- **Question:** "whenever you critically strike you recover 10 divinity": per hit or per cast? Does each enemy
  count?
- **Plain answer:** 10 divinity for every critical hit, and every enemy you crit counts. On a pack, an area at-will
  like Conflagrate refills far faster than on a single target.
- **Proof:** one dummy, Lance of Faith: 14.9/s with it vs 5.7/s without (+9.2/s, about one crit a second). A pack
  of dummies, Conflagrate (1.8 s cast): 17.5-18.8/s, so ~12-13/s from Critical Insight, more than twice the 5.6/s
  a once-per-cast rule could ever give.
- **Tested:** 2026-10-16. Clip `2026-10-16 07-28-06`.
- **Status:** Verified.

#### Divine Glow (encounter)
- **Question:** how much "Divinity Regeneration" does Divine Glow give?
- **Tooltip says:** "gain Divinity Regeneration ... Duration: 12s"; no number.
- **Plain answer:** it more than doubles your refill: from about 7.5 to about 18.3 divinity a second for its 12
  seconds, roughly 130 extra divinity per cast.
- **Proof:** two rounds standing idle: 7.5/s without, 18.3/s and 18.2/s with Divine Glow.
- **Tested:** 2026-10-16. Clip `2026-10-16 07-53-31`.
- **Status:** Measured. **Open:** whether it is a flat +10.8/s, 1% of your bar per second, or a % of your regen
  (one bar size cannot tell them apart); whether it also speeds Channel Divinity.

#### Divine Equilibrium (class feature)
- **Question:** "decreases as your divinity becomes further away from this point": how fast, and is there anything
  left at empty or full?
- **Plain answer:** +15% at exactly half your bar, falling in a straight line to nothing at empty and at full. At
  three-quarters or a quarter you get about half the bonus. It adds to your other damage bonuses rather than
  multiplying them, so on a build that already has damage bonuses the real gain is a little under 15%.
- **Proof:** same stripped gear, feature off: Lance of Faith crit 36,829 at every divinity level. Feature on:
  full +0%, 85% +3.5%, 73% +6.5%, 64% +9.4%, 53% about +12.5%, 43% about +11.5%, 32% about +8.5%, 21% about +5.7%,
  11% about +2.7%, empty about +0.3%.
- **Tested:** 2026-10-16. Clips `2026-10-16 09-01-59` (feature off) and `2026-10-16 09-11-14` (feature on).
- **Status:** Verified.

#### Lightspeed (feat)
- **Question:** how much faster does Daunting Light cast with Lightspeed, and for how many casts?
- **Tooltip says:** "Searing Javelin now grants the effect of Lightspeed. Lightspeed enhances Daunting Light, reducing
  the cast time ... Duration: 10s." No number, and it doesn't say whether one cast uses it up.
- **Plain answer:** it makes your next Daunting Light effectively instant, down from 0.7 seconds. It's good for ONE
  Daunting Light: the glowing border on the Daunting Light button appears when your Javelin lands and clears after
  one cast. So pair them: Javelin, then Daunting Light.
- **Proof:** the light-blue "casting" glow on the button lasted 0.93-0.97 s for five normal Daunting Lights and
  1.23-1.33 s for Searing Javelin (1.1 s cast), so the glow runs about 0.23 s longer than the cast itself. With
  Lightspeed it lasted 0.20-0.25 s on three casts: the cast itself is about zero.
- **Tested:** 2026-10-16. Clip `2026-10-16 12-04-27`.
- **Status:** Verified. **Open:** the extra Burning Judgement pip was not read from this clip.

#### Critical Sun (feat)
- **Question:** what does "you may cast Celestial Prominence again without spending any action points. Duration: 6s.
  This effect may not trigger twice in a row" actually allow?
- **Plain answer:** when a Celestial Prominence crits, your daily button lights up even with an empty action point bar,
  and you have about 6 seconds to cast it again for free. The free one works like a normal cast: place it, and it
  grows for 5 seconds into the full hit. The free cast's own crit can't give you another one.
- **Proof:** three rounds. Each Celestial Prominence crit lit the button with the gem empty. In round 3 it was left
  alone and went dark 5.6 s after lighting, about 6 s after the crit. Both free casts crit, and neither lit the button
  again. n00b confirmed the free cast places and grows like the tooltip says (the quick hits in the clip were early
  pops while he learned the daily).
- **Early pop vs full grow (same clip, all crits, damage before mitigation):** left to grow then popped 403,186;
  popped early 205,135, 211,528, 217,100 and 217,100. 217,100 / 403,186 = 0.538, exactly 700 / 1,300, so the
  tooltip's two magnitudes are right: waiting the 5 seconds nearly doubles the hit. The small spread among the early
  pops is other buffs coming and going.
- **Tested:** 2026-10-16. Clip `2026-10-16 13-26-40`.
- **Status:** Verified.

#### Flame Strike (daily)
- **Question:** how does Flame Strike's burn tick, can it crit, and does the Burning Judgement bonus reach it?
- **Tooltip says:** "Magnitude: 260. Added Effect: Damage over time. Magnitude: 180. Duration: 12s ... Burning
  Judgement Effect: Increases magnitude by 100." It doesn't say how often the burn ticks.
- **Plain answer:** the burn ticks 4 times, once every 3 seconds, and each tick hits as hard as the tooltip's 180.
  The ticks can crit. Burning Judgement only boosts the first hit, not the burn.
- **Proof:** first hit 80,637 and each tick 55,826 before mitigation, all crits. 55,826 / 80,637 = 0.692, exactly
  180 / 260. Ticks landed 3, 6, 9 and 12 s after the cast, and the debuff on the dummy lasted 12 s. Holding Burning
  Judgement, the first hit rose to 116,537 while the ticks stayed at 55,202.
- **Tested:** 2026-10-16. Clip `2026-10-16 15-42-34`.
- **Status:** Verified. **Open:** the Judgement bonus on the first hit measured about +118 magnitude twice
  (clips `15-42-34` and `16-49-51`), not the tooltip's +100.

#### Burning Patch (feat)
- **Question:** how does the patch tick, can it crit, and does Burning Judgement boost it?
- **Tooltip says:** "Flame Strike no longer applies a damage over time and instead ignites the target location dealing
  magnitude 3240 damage over 18s. Magnitude: 540 x 6."
- **Plain answer:** exactly as written: the ground burns for 18 seconds and hits 6 times, once every 3 seconds, each
  tick three times as hard as Flame Strike's normal burn. The ticks can crit. Burning Judgement only boosts the first
  hit, not the patch. It's a ground patch, so a boss has to stand in it.
- **Proof:** the patch flared every 3 s, with 6 hits after the cast. A crit tick did 167,477 before mitigation, against
  80,637 for the first hit (magnitude 260): 167,477 / 80,637 = 2.08 = 540 / 260, and three times the normal burn's
  crit tick (55,826). Ticks landed both as crits (167,477) and non-crits (94,982). With Burning Judgement held, the
  first hit rose to 117,854 and the ticks stayed the same.
- **Tested:** 2026-10-16. Clip `2026-10-16 16-49-51`.
- **Status:** Verified.

#### Piercing Javelin (feat)
- **Question:** "Grants your at-will powers a 10% chance to grant the effect of Piercing Javelin": does every enemy an
  area at-will hits get a roll, or one roll per cast?
- **Plain answer:** one roll per at-will cast. Hitting a whole pack with Conflagrate does not give you more chances
  than hitting one enemy. When it procs, your next Searing Javelin is a sure crit, and that Javelin uses it up.
- **Proof:** the "Piercing Javelin" text popped 6 times in about 50 s of Lance of Faith on one dummy (about 85 casts,
  close to 1 in 10), and 5 times in about 75 s of Conflagrate on a pack of about 6 dummies (about 42 casts: once per
  cast predicts about 4, once per enemy hit would predict about 25).
- **Tested:** 2026-10-16. Clip `2026-10-16 19-45-31`.
- **Status:** Verified.

#### Tipping Scales (feat) and the Judgement gauge
- **Question:** "Divine glow now generates a full stack of burning judgement or divine judgement as long as you have
  at least one charge of either": which kind fills if you hold both?
- **Plain answer:** you can never hold both. The Judgement gauge holds one kind at a time: a power that builds one
  kind empties the other first. Divine Glow tops up whichever kind you hold to the full 6 pips.
- **Proof:** 3 Radiant pips, then Divine Glow: 6 Radiant. 1 Burning pip, then Divine Glow: 6 Burning (each twice).
  Conflagrate on a full Burning gauge emptied it and left 3 Radiant.
- **Tested:** 2026-10-17, in the training room with cooldowns switched off (a test-only setting). Clip
  `2026-10-17 07-23-18`.
- **Status:** Verified. **Open:** Divine Glow on an empty gauge (the tooltip says it needs at least one charge).

### Still to test (Arbiter)

| # | Question |
|---|---|
| - | Natural regen while attacking vs standing still |
| - | Angel of Death: does the counter build while the ready buff is up? |
| - | How long a Channel Divinity tap takes |

---

## Paladin: Justicar

Audit: `docs/audit/justicar_audit_2026-10-17.md`. JUS-1 = 2 locked 2026-10-18: tanks pick powers for AGGRO, aggro can't be
measured cleanly, so the optimizer will leave a tank's kit to the player (not built yet). Fixed from the audit: Faerie Fire lasts 5 s,
not 3 (tooltip capture).

#### Threat race: does "Increased Threat" make a power pull aggro faster?
- **Method:** the game never shows threat, but the combat log shows the moment the dummy turns on you (the first
  "Conjured Fighter deals ... to you" line). A companion (Sardina the Tressym, no taunt) fights the dummy alone for about
  55 s, then the tank uses one at-will until the dummy hits them. Compare how much damage each power needed.
- **Result:** untagged Shielding Strike flipped it in about 3 s after 4-8 hits (about 105,000-210,000 before
  mitigation; the log scroll made the count fuzzy). Tagged Oath Strike flipped it in about 5 s after about 8-13 small hits
  (about 80,000-125,000). If the tag were worth 2.7x, Oath Strike should have needed only about 40,000-80,000.
- **Reading:** both powers pull aggro off a minute of companion damage within seconds, so tank threat is many times
  damage. The tag looks worth somewhere around 1-2x, not clearly the 2.7x the "layered" reading predicts. Too noisy to
  settle: the companion's head start wasn't identical, and the log repeats lines as it scrolls.
- **Tested:** 2026-10-17. Clips `2026-10-17 19-30-57` (Shielding Strike) and `2026-10-17 19-47-54` (Oath Strike).
- **Status:** Open.

---

## Evidence archive (Arbiter)

Folder root: `docs/calibration/inbox/class_powers/cleric/tests/`. "Stills" = a frame every 2 s from the clip.

| Folder | What it proves | Stills |
|---|---|---|
| `2026-10-14_22-52-58_divinity-pool-and-regen` | pool size, natural regen, boots regen | no (clip deleted) |
| `2026-10-14_23-30-54_channel-hold` | Channel Divinity hold speed, gauge refund on press | no |
| `2026-10-15_01-23-29_channel-boots-off` | regen gear does not speed the channel | no |
| `2026-10-15_22-46-36_tap-refund` | quick tap refunds instantly; 1 / 2 / 6 pips | no |
| `2026-10-15_23-01-00_pip-refund` | refund for 3 / 4 / 5 / 6 pips | no |
| `2026-10-15_23-16-14_angel-of-death` | counter, reset, Bastion counts, 60 s drop, buff names | no |
| `2026-10-16_05-10-50_perfect-balance` | Shift kinds reversed, 2-ahead wipe, 4 + 4 refill, taps | no |
| `2026-10-16_07-28-06_critical-insight` | per crit hit, each target | no |
| `2026-10-16_07-53-31_divine-glow` | regen 7.5 -> 18.3 per second | yes |
| `2026-10-16_08-44-26_divine-equilibrium_UNSLOTTED_discarded` | (feature was off; kept only as a record) | yes |
| `2026-10-16_09-01-59_divine-equilibrium_feature-off-baseline` | damage flat at every divinity level without it | yes |
| `2026-10-16_09-11-14_divine-equilibrium_feature-on` | the straight-line curve | yes |
| `2026-10-16_07-53-07_short-clip_unused` | not used in any test | yes |
| `2026-10-17_07-23-18_tipping-scales` | Divine Glow fills the held kind to 6; the gauge holds one kind | yes (every 0.2 s) |
| `2026-10-16_19-45-31_piercing-javelin` | Piercing Javelin rolls once per at-will cast | yes (one still per second) |
| `2026-10-16_16-49-51_burning-patch` | Burning Patch: 6 ticks of 540 every 3 s, crits, no Judgement bonus | yes (plus every 0.5 s in both casts) |
| `2026-10-16_15-42-34_flame-strike_burning-patch-not-active` | Flame Strike's burn: 4 ticks every 3 s, crits, no Judgement bonus | yes (plus every 0.5 s in both casts) |
| `2026-10-16_13-26-40_critical-sun` | free Celestial Prominence after a crit, 6 s window, no chaining | yes (plus every 0.25 s in the three windows) |
| `2026-10-16_12-04-27_lightspeed` | Lightspeed makes one Daunting Light instant | yes (plus every 0.1 s around four casts) |
| `2026-10-16_10-36-51_channel-on-1000-bar` | Channel Divinity speed is fixed (1,000 bar), pool 1,000 without Expanded Faith | yes |

---

## Rogue: Assassin

Audit: `docs/audit/assassin_audit_2026-10-17.md`. Tests on n00b's Assassin, October 2026.

#### The Stealth meter
- **Question:** how long does Stealth last, how fast does the meter come back, and when can you go back in?
- **Tooltip says:** "Lasts 6 seconds." Nothing about the refill.
- **Plain answer:** a full meter lasts about 6 seconds if you just stand in Stealth, but only about 2.5 seconds
  while you attack, because every at-will press takes a chunk too. Once it runs out, it takes about 12.5 seconds to
  refill from empty. While refilling the bar is grey, and it only turns blue (usable) when it's completely full.
  Ending Stealth with an encounter throws away whatever was left: the bar empties at once and you wait the full
  12.5 seconds. So you get one Stealth roughly every 13-15 seconds; spend it on your best Stealth encounter.
- **Proof:** idle in Stealth: 100% to 0 in 5.9 s. Attacking: gone in 2.4 s, with drops of about 16-18% per press on
  top of the steady drain. Refill from empty: 12.5 s, twice, with no Stealth-regen bonuses slotted.
- **Proof (leftover):** Stealth entered and ended by an encounter at about 86% and 90% left: the bar went empty at
  once both times and came back full 12.5-12.7 s later.
- **Tested:** 2026-10-17. Clips `2026-10-17 08-45-23` and `2026-10-17 08-57-30`.
- **Status:** Measured.

#### Oppressive Darkness (class feature)
- **Question:** "When you have Combat Advantage your powers deal an additional 20 magnitude damage": once per power
  use, or on every hit?
- **Plain answer:** on every hit. Each Duelist's Flurry hit from behind brings its own extra 20-magnitude hit, which
  is more than half again on your main at-will (Duelist's Flurry hits for 35). It's one of the strongest Assassin
  picks whenever you have Combat Advantage.
- **Proof:** from behind, every slow Duelist's Flurry press logged one Duelist's Flurry line and one Oppressive
  Darkness line (11 presses). With the feature swapped out, 5 presses logged no Oppressive Darkness at all. The extra
  hit was 5,706 before mitigation against Duelist's Flurry's 10,635, close to 20 / 35.
- **Tested:** 2026-10-17. Clip `2026-10-17 09-12-53`.
- **Status:** Verified.

#### Duelist's Flurry Bleed (at-will)
- **Question:** "Attacks from the flurry each have a chance to add a Bleed effect which can be stacked up to 10
  times. Duration: 9s." How hard does the Bleed hit, how often, and how do you get it?
- **Plain answer:** only the flurry applies Bleed, so hold or mash Duelist's Flurry: single slow presses never Bleed.
  After about 6-8 seconds of nonstop flurry the Bleed is at full stacks, and then each Bleed tick hits about as hard as
  five Duelist's Flurry hits, every 1.5 seconds. It keeps ticking for 9 seconds after your last flurry, and the ticks
  can crit. At full stacks the Bleed does about as much damage as the flurry itself.
- **Proof:** the first stacks ticked for 4,581, 9,161 and 13,742 before mitigation (1, 2, 3 stacks). At full stacks a
  tick did 53,830 against 11,419 for a Duelist's Flurry hit. After stopping, 6 ticks landed 1.5 s apart, all at the full
  value.
- **Tested:** 2026-10-17. Clips `2026-10-17 09-25-32` (held) and `2026-10-17 09-12-53` (single presses, no Bleed).
- **Status:** Measured. **Open:** the exact chance per flurry hit, and how many hits per second a held Duelist's
  Flurry makes.

#### Shadow's Flurry (feat)
- **Question:** "Your attacks have a 5% chance to spawn a shadowy figure that uses the final combo of Duelist's
  Flurry on the target." How hard does the shadow hit, and how often does it show up?
- **Plain answer:** the shadow hits 5 times in about a second and a half, each hit about three-quarters of a
  Duelist's Flurry hit, and its hits can crit. It showed up far less often than "5% per attack" suggests: once in
  about 30 seconds of nonstop flurry. That makes it a small bonus, about 1% in the simulator, a little ahead of
  Execution for a full-health boss fight.
- **Proof:** 5 shadow hits: 15,214, 14,598 and 14,628 (crits) and 8,559 and 8,613 (non-crits) before mitigation,
  against 11,419 for a non-crit Duelist's Flurry hit. One shadow in about 110 flurry hits.
- **Tested:** 2026-10-17. Clip `2026-10-17 09-40-04`.
- **Status:** Measured. **Open:** whether it has a hidden cooldown (modelled as 30 s for now). A longer clip of
  nonstop flurry would settle it.

#### Assassinate (encounter)
- **Question:** "If you attack from behind ... 25% stronger ... Stealthed: Attack is 25% stronger from any direction."
  Does Stealth from behind give both?
- **Plain answer:** no, it's one 25% either way. From behind, from Stealth in front and from Stealth behind all hit the
  same. So Stealth is for when you can't get behind the target; behind it, Stealth adds nothing to Assassinate.
- **Proof:** every Assassinate in those three positions landed in one band: 317,019-322,905 before mitigation
  (non-crit), 521,702-559,766 (crit). None landed a further 25% higher. One hit from the front with no Stealth was
  147,144, which is that band without the 25% and without Combat Advantage.
- **Tested:** 2026-10-17, training room with cooldowns off and Lysera holding the dummy. Clip `2026-10-17 10-00-10`.
- **Status:** Verified.

#### Toxic Blades (feat)
- **Question:** "Encounter and Daily attacks ... apply a DoT ... 20 magnitude ... once every 3 seconds, for 15 seconds,
  and stacks up to 5 times." Does every hit add a stack, and does a new stack restart the old ones?
- **Plain answer:** yes to both. Every hit of an encounter or daily adds a stack, so one Path of the Blade (4 hits)
  gives 4 stacks at once. Each new stack restarts the 15-second timer on all of them, so keep landing an encounter
  every so often and the poison never drops.
- **Proof:** one Path of the Blade: ticks of 22,043 before mitigation every 3 s (4 stacks). An Assassinate as those
  stacks ran out: ticks of 44,721 (5 stacks of 8,944) for another 15 s. A lone Assassinate later: 8,944 (1 stack).
- **Tested:** 2026-10-17. Clip `2026-10-17 10-21-58`.
- **Status:** Verified. Side note: every tick from one application was either a crit or not, so the crit seems
  decided when the stacks go on.

#### Encounter cooldowns and Recharge Speed (Assassin)
- **Question:** do the tooltip cooldowns tell the truth, and does Recharge Speed from clothing count?
- **Plain answer:** the real cooldowns use ALL of your Recharge Speed, including the +1.5% on shirts and pants. The
  power tooltips leave the item part out, so they show a cooldown a little longer than you really get.
- **Proof:** the sheet showed +8.7% Recharge Speed (+5.7% from ability scores, +3% from items: 1.5% shirt, 1.5% pants).
  Every encounter tooltip matched the 5.7% alone (all ten at 0.94-0.95 of base; Bait and Switch shows 22 s). But
  casting Bait and Switch the moment it was ready, the gap between casts was 23.27 and 23.26 s wearing the shirt and
  pants, and 23.89, 23.90 and 23.85 s without them. That 0.6 s difference is exactly what 3% Recharge Speed is worth on
  Bait and Switch (23.3 s base: 21.4 s with 8.7%, 22.0 s with 5.7%).
- **Tested:** 2026-10-17. Clips `2026-10-17 10-43-19` (tooltips) and `2026-10-17 11-06-52` (stopwatch).
- **Status:** Verified.

### Still to test (Assassin)

| # | Question |
|---|---|
| 3b | Duelist's Flurry: hits per second when held |
| 4b | Shadow's Flurry: how often it really shows up (a minute or two of nonstop flurry) |
| 6b | Assassin's Target: stacks per Duelist's Flurry press (needs it slotted; tier-1 is Toxic Blades) |

---

## Evidence archive (Rogue)

Folder root: `docs/calibration/inbox/class_powers/rogue/tests/`.

| Folder | What it proves | Stills |
|---|---|---|
| `2026-10-17_11-06-52_recharge-speed-clothing` | clothing Recharge Speed counts in real cooldowns (Bait and Switch timing) | yes (every 1 s) |
| `2026-10-17_10-43-19_assassin-encounter-cooldowns` | all 10 encounter tooltips at ~0.945 of base | tooltip and stats screenshots |
| `2026-10-17_10-21-58_toxic-blades` | Toxic Blades: a stack per hit, new stacks refresh all | yes (every 0.5 s) |
| `2026-10-17_10-00-10_assassinate-stealth-behind` | Assassinate: Stealth and behind do not stack | yes (every 0.5 s) |
| `2026-10-17_09-40-04_shadows-flurry` | the shadow: 5 hits of ~26 magnitude; once in ~30 s | yes (every 0.1 s around the shadow) |
| `2026-10-17_09-25-32_duelists-flurry-bleed` | Bleed: 1.5 s ticks, 9 s, full stacks ~4.7x a flurry hit | yes (every 1/6 s in both rounds) |
| `2026-10-17_09-12-53_oppressive-darkness` | Oppressive Darkness: one extra hit per Duelist's Flurry hit | yes (every 0.5 s) |
| `2026-10-17_08-57-30_assassin-stealth-reentry` | ending Stealth with an encounter wipes the leftover meter | yes (every 0.5 s) |
| `2026-10-17_08-45-23_assassin-stealth-meter` | Stealth: 6 s idle, ~2.4 s attacking, 12.5 s refill, usable only when full | yes (every 0.25 s in the Stealth windows) |

---

## Evidence archive (Paladin)

Folder root: `docs/calibration/inbox/class_powers/paladin/tests/`.

| Folder | What it proves | Stills |
|---|---|---|
| `2026-10-17_19-30-57_threat-race-shielding-strike` | untagged at-will pulls aggro off a companion in ~3 s | yes (every 1 s) |
| `2026-10-17_19-47-54_threat-race-oath-strike` | tagged at-will pulls it in ~5 s; tag value unclear | yes (every 1 s) |

---

## Testing lessons (method)

- **Strip buff gear first.** Stacking buffs from gear, weapons and companions (Combatant's Advantage, Astral
  Absorption, a weapon stack of 10) move damage by several percent on their own. Either remove them or let them
  reach their cap before measuring.
- **Check the feature is Active in the Powers menu before recording.** One Divine Equilibrium clip was recorded with
  it unslotted; it made a convincing fake curve out of buff stacks.
- **Use the number in brackets in the combat log** (damage before mitigation). It moves with damage bonuses and is
  identical to the last digit when nothing changed, which makes tiny effects visible.
- **Read the bar in steady stretches.** The class emblem beside the divinity bar fools a pixel reader around the
  middle of the bar; compare rates over the same stretch of the bar.
