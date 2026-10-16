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

### Still to test (Arbiter)

| # | Question |
|---|---|
| 9 | Piercing Javelin: per hit or per cast? |
| 11 | Burning Patch: tick count, can ticks crit, do they feed Judgement? |
| 12 | Tipping Scales with both Judgement kinds held |
| - | Natural regen while attacking vs standing still |
| - | Angel of Death: does the counter build while the ready buff is up? |
| - | How long a Channel Divinity tap takes |

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
| `2026-10-16_13-26-40_critical-sun` | free Celestial Prominence after a crit, 6 s window, no chaining | yes (plus every 0.25 s in the three windows) |
| `2026-10-16_12-04-27_lightspeed` | Lightspeed makes one Daunting Light instant | yes (plus every 0.1 s around four casts) |
| `2026-10-16_10-36-51_channel-on-1000-bar` | Channel Divinity speed is fixed (1,000 bar), pool 1,000 without Expanded Faith | yes |

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
