# Rogue Whisperknife audit (2026-10-18)

n00b: "make that change then audit another class ... pick which ever". Picked Whisperknife: the damage paragon with the
most open test flags left (18), and the other path of n00b's Rogue. Two passes: (1) every feat and class feature through
the real scored fight; (2) every Whisperknife item against its tooltip capture (all 44 match the screenshots).

## Summary

1. **FIXED 2026-10-18 - the encounter that ends Stealth lost its own Stealth bonuses.** The Stealth mechanic's cast records
   (meter wipe, Stealth drop) ran before the encounter's hits landed, so Ambusher's Haste (+up to 40% while Stealthed),
   Shadow of Demise (40% echo), Last Moments' Stealth doubling and the Stealth half of Dark Reimbursement all missed the
   one hit they exist for. New: when.afterCast - a cast-triggered record runs once the cast's hits have landed, all of a
   cast's such records in order. Stealth's wipe, Dark Reimbursement's +25 refund and the Stealth drop (both Rogue paths)
   and One with the Shadows' +50 now run after the hit, in that order. Shadow of Demise echo in a 180 s fight: 0 -> 16.8M
   (~16% of damage). Smoke test on all 18 paragons: every non-Rogue result unchanged; no errors.
2. **Shadowy Opportunity looks too strong** (+14-19% after the fix): counts every hit of multi-hit powers and every damage
   tick. Top in-game test.
3. **Last Moments is worth ~0 in a full-health boss fight** (scales with the target's missing health). Same execute-phase
   design question as the Assassin's Execution.
4. Smaller, from the tooltip pass: two 5% vulnerability debuffs stack to 10% (assumed no); Lurker's Assault's fast Stealth
   regen has no number; Hidden Attacks x Tenacious Concealment multiply where the note says add; Dagger Threat is a hard
   20 ft cut where the tooltip scales; three base cooldowns (Blade Flurry, Lashing Blade, Path of the Blade) look 0.3-0.4 s
   long against the others' Recharge factor.

## Simulator-side findings (zero-value check, 2026-10-18)

Method: the page's real scored fight (pt2ScoredSetup + pt2SimScored, crits on), 180 s, one enemy, with the Stealth
rules measured on the Assassin (8/s refill, full meter to enter, encounters wipe it).
Kit A: Disheartening Strike + Shuriken Toss; Vengeance's Pursuit / Blitz / Shadow Strike; Killing Storm + Lurker's Assault.
Kit B: Shuriken Toss + Cloud of Steel; Impact Shot / Lashing Blade / Shadowy Disappearance; Hateful Knives + Whirlwind of Blades.
Base feats Last Moments / Dark Reimbursement / One with the Shadows / Shadow of Demise / Ambusher's Haste; features
Skillful Infiltrator + Sneak Attack. Base: A 593,634, B 457,909.

| Swap | Kit A | Kit B |
|---|---|---|
| T1 Last Moments -> Shady Preparations | +11.81% | +5.17% |
| T2 Dark Reimbursement -> Hidden Attacks | -0.94% | +1.19% |
| T3 One with the Shadows -> Return to Shadows | -4.35% | +6.60% |
| T4 Shadow of Demise -> Shadowy Opportunity | **+17.53%** | **+27.13%** |
| T5 Ambusher's Haste -> Gutterborn's Touch | -2.77% | +0.99% |

| Feature next to Skillful Infiltrator | Kit A | Kit B |
|---|---|---|
| Sneak Attack | -1.50% | -0.78% |
| Tenacious Concealment | 0.00% | +0.59% |
| Tactics | +0.70% | +0.57% |
| Dagger Threat | +5.60% | +4.11% |
| Razor Action | +2.44% | +2.32% |
| Advantageous Position | 0.00% | 0.00% |
| Talisman of Shadows | 0.00% | 0.00% |

1. **Shadowy Opportunity looks too strong** (+17-27%, the biggest swing in the kit): "Each of your hits deals an additional
   hit for 130 magnitude damage" for 5 s after leaving Stealth. The record counts every hit of multi-hit powers AND every
   damage-over-time tick (provisional). If ticks don't count, or a multi-hit power counts once, it shrinks a lot. Top test.
2. **Shadow of Demise** (its pair) echoes 40% of damage for 5 s after a Stealth encounter; crit and refresh behaviour
   provisional. Settles the tier-4 choice together with 1.
3. **Last Moments** reads enemy health; at the fight's default 100% health only its Stealth half... both halves are 0 at
   full health, so its value here is ~0 and Shady Preparations wins by default. Same "execute phase" design question as
   Assassin's Execution.
4. **Sneak Attack lowers damage slightly** (pure upside: +10% recharge while Stealthed): same search-path symptom as Tactics
   on the Assassin and Flame Strike on the Arbiter. Search issue, logged.
5. Advantageous Position (Combat Advantage after Stealth, damage reduction) and Talisman of Shadows (daze / slow) are
   correctly 0 for damage at the default 100% Combat Advantage.

## Whisperknife (Rogue) tooltip audit - 2026-10-18

Read-only. Data: `G:/ai_projects/nwcb/data/classes.json` -> Rogue -> paragonPaths "Whisperknife" (4 at-wills, 10 encounters, 5 dailies, 10 feats, 8 slotted class features, 3 mechanics) + the 4 class-wide General skills. Screenshots: `G:/ai_projects/nwcb/website/docs/calibration/inbox/powers/rogue-powers/`. Every plain-named capture read for this audit shows the header "Rogue - Whisperknife". `Blade Flurry (2).png` was spot-checked and shows "Rogue - Assassin". Sim checks were run with `node` against `toon-forge-rotation.js` (`simulateFx`) using the live data. No files were changed.

### Verdict on the data

The stored tooltip text is clean. Every magnitude, duration, cast time, range, radius, AP cost and percentage in the 44 Whisperknife items matches the screenshots word for word, and no tooltip effect that changes damage is missing a record. The real problems are in how the fight simulator runs the Stealth records, not in the transcription. When an encounter ends Stealth, the Stealth mechanic's cast records fire first: they wipe the meter and remove the Stealth buff. Only after that do the feat records and the hit itself check whether you are Stealthed. As a result, the three Stealth-payoff feats (Ambusher's Haste, Shadow of Demise, the Stealth doubling of Last Moments) give zero on every encounter that breaks Stealth, and Dark Reimbursement does nothing at all. The same ordering gives One with the Shadows a refill that may not happen in game. Smaller issues: three shared encounters have base cooldowns that do not fit the Recharge ratio of the other seven, the two 5% vulnerability debuffs stack in the sim although the notes say they are assumed not to, the two +50% regen bonuses multiply although the notes say they are assumed to add, and several notes still say the Stealth refill time is unknown.

### Findings (most damage impact first)

1. **Ambusher's Haste gives 0 on the Stealth opener (and on any encounter that ends Stealth).** Tooltip: "While Stealthed, your powers deal up to 40% more damage based on how full your Stealth meter is." Data: a buff gated on `buff:Stealth` + `stack:Stealth Meter` (linear). The sim reads that gate when the hit lands, at the end of the cast. By then the Stealth mechanic's encounter-cast records ("Stealth wiped" set 0, then remove Stealth) have already fired. Sim check (Lashing Blade / Blade Flurry / Impact Shot, Stealth in the loop): no encounter hit ever carried the bonus. The item's own value model ("open Stealth with the biggest hit, Lashing Blade 1,015 x 1.4") is never realised. Only at-wills cast while Stealthed and the keep-Stealth encounters (Vengeance's Pursuit, Shadow Strike, Shadowy Disappearance) can get it. This is the largest Whisperknife damage feat, so the whole tier-5 choice is under-scored. Screenshot: `Ambusher's Haste.png`.

2. **Shadow of Demise never triggers on a Stealth-breaking encounter.** Tooltip: "While in Stealth, your encounter powers add the Shadow of Demise effect to the target for 5 seconds. Shadow of Demise: 40% of the damage you deal to this target is dealt again when Shadow of Demise expires." Data: an `echo` record, `when` = cast from an encounter, gated on `buff:Stealth`. The sim builds listeners in the order mechanics then feats, so the Stealth mechanic removes the buff before this gate is checked. Sim check: `echoDamage` = 0 over a 120 s fight with Stealth used 7 times. It can only fire from the four keep-Stealth encounters. Screenshot: `Shadow of Demise.png`.

3. **Dark Reimbursement does nothing in the sim.** Tooltip: "When you use an encounter power to leave stealth, you regain 25% Stealth." Data: the feat has no fx. The refund lives in the Stealth mechanic as a `requiresFeat` record (+25), but that record sits *before* "Stealth wiped" (set 0) in the same list, so the 25 is erased at once. Sim check: Stealth entries over 300 s were 15 without the feat and 15 with it. Fix: move the refund after the wipe (or make it a set-to-25). Screenshot: `Dark Reimbursement.png`.

4. **The Stealth doubling of Last Moments misses every Stealth-breaking encounter.** Tooltip: "Your at-will, encounter, and daily powers deal up to 10% more damage to foes as their health bar diminishes. This bonus is doubled while in Stealth." Data: the second record is gated on `buff:Stealth`, and it has the same land-time problem as Finding 1. Sim check: encounter hits only ever showed the base Last Moments half (5% at 50% enemy health). Screenshot: `Last Moments.png`.

5. **One with the Shadows refills the meter in two cases the tooltips do not support.** Tooltip: "Every 12 seconds you gain One with the Shadows. One with the Shadows causes your next Encounter power to refill half of your Stealth Meter." Data: +50 on any encounter cast, with no Stealth gate. Because feat listeners run after the mechanic's wipe, a Stealth-breaking encounter ends with the meter at 50 instead of 0. A keep-Stealth encounter also adds 50 while you are still Stealthed. Return to Shadows' tooltip says "Stealth cannot be gained while stealthed". Sim effect: Stealth entries 15 -> 25 per 300 s with this feat, the biggest jump of any Stealth item. The value may be right, but it rests on untested ordering. Screenshots: `One with the Shadows.png`, `Return to Shadows.png`.

6. **Base cooldowns of Blade Flurry, Lashing Blade and Path of the Blade do not fit the Recharge ratio of the other seven encounters.** Shown on the Whisperknife captures -> stored base (base / shown):
   - Vengeance's Pursuit 9.4 -> 9.7 (1.032)
   - Impact Shot 9.4 -> 9.7 (1.032)
   - Blitz 13.2 -> 13.5 (1.023)
   - Shadow Strike 13.2 -> 13.5 (1.023)
   - Shadowy Disappearance 13.2 -> 13.5 (1.023)
   - Smoke Bomb 14.1 -> 14.5 (1.028)
   - Bait and Switch 22.6 -> 23.3 (1.031)
   - **Blade Flurry 11 -> 11.6 (1.055)**
   - **Lashing Blade 11 -> 11.6 (1.055)**
   - **Path of the Blade 14.7 -> 15.5 (1.054)**

   One ratio of about 1.026-1.03 fits the first seven within display rounding. At that ratio the three outliers would have bases of about 11.3 and 15.1. So those three are probably about 0.3-0.4 s too long, which means about 3% fewer casts of the two most-used shared encounters. Minor: Bait and Switch (1.031) and the 13.5 group (1.023) only just fail to share one ratio, so one of them may be 0.1 s off. The Assassin capture `Blade Flurry (2).png` also shows "11s". Screenshots: the encounter PNGs named above.

7. **The two 5% vulnerability debuffs stack to 10% in the sim, while the notes say they are assumed not to stack.** Disheartening Strike: "Increases the target's damage taken from projectile and physical attacks by 5%. Duration: 10". Shadow Strike: "Added Effect: Increases the target's damage taken from projectile and physical attacks by 5%. Duration: 10s". Both fx are named "Exposed", but the sim keys stat records by owner + name, so both count. Sim check: 54 of 84 hits carried "Exposed+Exposed" = 10% Damage Taken. Shadow Strike's `debuff.stacksWith` says "ASSUMED no (test)". The data and the sim disagree, which is about 5% on every physical hit. Screenshots: `Disheartening Strike.png`, `Shadow Strike.png`.

8. **Lurker's Assault's fast Stealth regeneration is not modelled.** Tooltip: "Your Stealth meter regenerates very quickly in this state." Data: a buff "Lurker's Assault regen" with `missing: ["stats"]`, which does nothing. The +40% Damage Boost is modelled correctly. During the 10 s window, more Stealth entries would mean more Stealth-mode encounters (Lashing Blade +300, Blade Flurry free recast) plus Findings 1-4. This is now testable, because the base rate is known (8 per second). Screenshot: `Lurker's Assault.png`.

9. **Hidden Attacks and Tenacious Concealment multiply in the sim, while the notes say they are assumed to add.** Hidden Attacks: "Stealth regeneration is increased by +50%". Tenacious Concealment: "Increases Stealth regeneration by +50%." Both fx are `op: "mult", value: 1.5` on the "Stealth refill" record, so 8/s x 1.5 x 1.5 = 18/s (+125%). Hidden Attacks' `featAdded.stealth.stackingWithTenaciousConcealment` says "ASSUMED additive (+100% total)", which would be 16/s. The fx notes "base not captured" / "the base is not captured, so this is zero too" are stale now that 8/s is measured. Screenshots: `Hidden Attacks.png`, `Tenacious Concealment.png`.

10. **Shadowy Disappearance's 1.5 s Stealth runs on the meter in the sim.** Tooltip: "Apply Effect: Stealth. Duration: 1.5s." Data: a timed "Stealth" buff "outside the meter", but the mechanic's drain and wipe records gate on the same `buff:Stealth`. So during those 1.5 s the meter stops refilling and drains about 25, and the next Stealth-breaking encounter wipes whatever was refilled. This granted Stealth also fires "buffApplied Stealth", so it triggers Shady Preparations (-2 s cooldowns) and Talisman of Shadows. Whether the game does either is unknown. Screenshot: `Shadowy Disappearance.png`.

11. **Dagger Threat is a hard cut at 20 ft, but the tooltip describes a falloff.** Tooltip: "Your ranged attacks deal up to 10% more damage based on how close you are to your target. You gain the maximum benefit from this class feature when within 20' of your target." Data: the fx gate is `targetRangeFt <= 20` (n00b 2026-10-06), so 0% past 20 ft. `rangeFalloff` still describes a placeholder linear 20->50 ft curve that nothing uses. No effect at the default 10 ft slider. Screenshot: `Dagger Threat.png`.

12. **Stale Stealth notes (no damage effect).**
    - The Stealth mechanic still has `stealth.meterRefillSeconds: null`.
    - Its `reviewFlag` "TEST (gating for the Rogue): seconds for the Stealth meter to refill from empty in combat" and its `valueModel` ("UNTIL the refill time is measured the toggle cannot compute") were both answered on 2026-10-17 (12.5 s).
    - Feat valueModels still say "gated on the refill test": Shady Preparations, Dark Reimbursement, Hidden Attacks, Ambusher's Haste, Advantageous Position, Sneak Attack, Tenacious Concealment.
    - Disheartening Strike's tag note ("Cloud of Steel fills the rest") is fine.

    Screenshot: `Stealth.png` (tooltip "Cast 0s Cooldown 0.4s ... Lasts 6 seconds." matches the stored numbers).

13. **Small modelling gaps with no damage effect at default settings.**
    - Killing Storm's "-5% Awareness to target" is dropped by the scorer, as designed (enemy Awareness does not change your hit). The tag note's "more Combat Advantage damage" only matters below 100% Combat Advantage uptime.
    - The same applies to Hateful Knives' "Combat Advantage, Duration: 6s", Smoke Bomb's Stealthed party Combat Advantage and Advantageous Position's "maintain Combat Advantage": the Combat Advantage share comes only from the uptime slider (default 100%).
    - Path of the Blade's Stealth "Pulses twice as fast for half of the duration" is modelled (duration set to 3). Same total damage.

All other items match their tooltips exactly. That includes Shuriken Toss 60 + 2 ricochets, Cloud of Steel 60 / +5% x10 / 5s, Sly Flourish 40 (combo values unknown and already flagged), Blitz 450 / -2 s, Impact Shot 600 / Stun 2 s, Lashing Blade 715 + 300, Smoke Bomb 120x4 / Daze 4s, Killing Storm 200 x 12 / 0.2s / 1,000, Hateful Knives 2000 / 1.8s / 82', Whirlwind of Blades 450 / 3% per enemy up to 5 / 10s, Courage Breaker 1800 / 15% / 70% / 8s / 45', Shadowy Opportunity 130 / 5 s, Gutterborn's Touch 10% ranged / 5 s, Razor Action 300 / 30' / 2% to 10%, Skillful Infiltrator 10% / 2.5% / 2.5%, Sneak Attack 15% / 10%, Tactics 10%, Talisman of Shadows 20' / 1 s, Cunning Ambusher 10% / 5 s, Scoundrel Training 2%, Swift Footwork 5%, Forte and Roll text. Nothing Whisperknife-specific contradicts the Assassin Stealth measurements. Hidden Attacks' "instead of 15%" agrees with the measured 15-18 per at-will.

### Candidate in-game tests (training dummy, short clips)

- Ambusher's Haste: Stealth, then Lashing Blade at full meter. Does the hit come in about 40% higher than Lashing Blade from Stealth without the feat?
- Shadow of Demise: Stealth, then Lashing Blade. Does a delayed hit for about 40% of the damage dealt appear 5 s later in the combat log?
- Dark Reimbursement: Stealth, then an encounter that ends it. Does the meter restart at about 25% (refill shorter than 12.5 s, about 9.4 s) or at 0?
- Last Moments: on a dummy below about 10% health, is the Stealth-opening encounter boosted about 20% (doubled) or about 10%?
- One with the Shadows: with the buff icon up, Stealth then Lashing Blade. Is the meter at 50% right after, or empty? And does Vengeance's Pursuit cast from Stealth with the buff up raise the meter while you stay Stealthed?
- Cooldowns: with no Recharge gear, what do the Blade Flurry, Lashing Blade and Path of the Blade tooltips read, and do they still read 11 / 11 / 14.7 next to Impact Shot 9.4?
- Disheartening Strike + Shadow Strike on one dummy: does Cloud of Steel damage rise by about 5% or about 10% with both debuffs up (two separate icons, or one)?
- Lurker's Assault: from an empty meter, how many seconds until the bar turns blue (normal is 12.5 s)?
- Hidden Attacks + Tenacious Concealment together: refill time from empty (16/s means about 6.25 s, 18/s means about 5.6 s)?
- Shadowy Disappearance: does its 1.5 s Stealth change the meter bar (stop refilling or drain), and does an encounter cast inside it empty the meter?
- Shadowy Opportunity: does the encounter that breaks Stealth already get the extra 130 hit, and does each Disheartening Strike DoT tick trigger it?
- Cunning Ambusher: does the encounter that breaks Stealth get the +10% (log comparison with and without the skill effect)?
- Dagger Threat: Cloud of Steel damage at 20 ft, 30 ft and 45 ft. Falloff or a hard cut?
- Killing Storm: does "Vanish from sight" put you in Stealth (Stealth-gated feats active during the dashes)?

### Coverage

- Whisperknife items checked: 44 of 44. They are the 4 at-wills, 10 encounters, 5 dailies, 10 feats, 8 slotted class features, 3 mechanics (Roll, Stealth, Forte) and 4 General skills (Thievery, Swift Footwork, Cunning Ambusher, Scoundrel Training). Every one has a Whisperknife-headed screenshot, and all 44 were opened.
- Items with no screenshot: none.
- Screenshots with no Whisperknife item:
  - `Swift Charge.png` and `Furious Assault.png` (+ their "(2)" copies) are **Racial** (Half-Orc). They live in `races.json`, not in the class data.
  - Assassin-only captures: Assassin's Target, Assassinate, Back Alley Tactics, Bloodbath, Dazing Strike, Deft Strike, Duelist's Expertise, Duelist's Flurry, Execution, First Strike, Gloaming Cut, Hastily Sharpened Blades, Impossible to Catch, Infiltrator's Action, Invisible Infiltrator, Knife's Edge, Master of Shadows, Oppressive Darkness, Shadow's Flurry, Shocking Execution, Skullcracker, Toxic Blades, Wicked Reminder.
  - The "(2)" files of the shared items are taken to be the Assassin captures. Only `Blade Flurry (2).png` was opened to confirm this.
