# Equip-bonus one-at-a-time review - rulings log (2026-09-07 to 2026-09-08)

One line per bonus name reviewed with n00b (assumption shown, n00b said fine or gave the rule). Queue: scripts/_review_queue.py. 148 names, queue closed 2026-09-08.

Systems built during the review: Distance / AP / Stamina / Movement / Enemies / Enemy attacks / Target shield sim controls (contextual), build-conditions registry (party healer), Solo mode, missing-health grading, zonesExclude, runtime AP / cooldown proc conversions, sequence-proc matcher widening, proc collectors gated (bug fix).

- 1 Manticore's Mane Bite: confirmed 2026-09-07 (reflect 50% once/30s; riders per item)
- 2 Charging Bull: confirmed (Forte rider always-on; threat display-only)
- 3 Butcher's Zeal: confirmed (once per 5s, 40 AP/s baseline)
- 4 Healer's Influence (Greater): Defense 3 rider added (heal role, per-encounter uptime)
- 5 Brute's Expertise: Distance-to-target slider built; exact gate replaces 85/15
- 6 Warden's Defiance: confirmed (10s per 30s)
- 7 Critical Guard: confirmed (20% uptime; zone via picker)
- 8 Battle Reserves: dailies 60s cd -> daily rate 1/60 everywhere (proc/uptime/seq); rotation AP cadence (25s) open question
- 9 Reprisal Reflex: enemy crit 50% (engine constant); once per 20s unchanged
- 10 Vital Onslaught: 0.17 uptime (60s daily) + procHeal 3%/daily
- 11 Explosive Force: confirmed
- 12 Sharpened Precision: Current-AP slider built; 20 entries gated (Discharged x9, Charged x8, etc.)
- 13 Fount of Healing (Lesser): confirmed; 14 Discharged Force: covered by AP slider
- 15 Healer's Influence (Ascendant): Defense 3.5 counted for wearer
- 16 Encounter Reprieve: UNVERIFIED - come back with dummy test (15s encounter with/without)
- 17 Critical Charge: fine, UNVERIFIED (same test)
- 18 Executioner's Remedy: confirmed
- 19 Fount of Healing (Greater): confirmed
- 20 Pact of Vengeance: confirmed
- 21 Power at Any Cost: confirmed (self poison ignored)
- 22 Healer's Influence (Lesser): Defense rider counted (family ruling); 23 Executioner's Remedy (Lesser): covered by 18
- 24 Critical Force: confirmed
- 25 Defender Strike: confirmed
- 26 Executioner's Zeal: confirmed
- 27 Past Regards: confirmed
- 28 Pressured Muse: Current-stamina slider built (164 entries gated)
- 29 Survivors Healing Aura: health gate on existing Current Health slider (+Victim's family)
- 30 Critical Momentum: Movement toggle built (48 entries)
- 31 Medic's Respite: family ruling applied (rider for wearer, requiresHeal)
- 32 Rothe's Intimidation: confirmed (kept 5,517; screenshot wanted)
- 33 Overwhelming Parry: Enemies-in-combat slider built (353 entries)
- 34 Controlled Divinity: confirmed; Defender Guard = mirror of Defender Strike
- 35 Survivor's Remedy family: deflect trigger = struck rate x build Deflect chance
- 36 Raging/Skirmisher's Zeal + all AP/cooldown procs: runtime crit-aware conversion built
- 37 Bulwark's Shield -> Enemy attacks toggle (vsRangedOnly), n00b: make it a toggle
- 38 Controlled Strike -> per-role: tank ID -5 @0.75 + CB display-only; dps/heal ID -5 @0.35 + CB 5 @0.6. n00b: control bonus gives nothing to roles w/o control powers (already true: optimizer never scores it)
- 39 Survivor's Resilience -> missingHealthMaxAtPct graded by health slider (fine); same tag applied to Enduring Resilience (+Lesser), Survivor's Reflexes/Refexes, Survivor's Critical Resilience 'up to' entry. Astral Dash/Rune of Replenishment refinement = notes, done.
- 40 Shield Breaker -> Target has a shield toggle (vsShieldedOnly), Dmg Bonus 8. n00b: toggle
- 41/42 Scaled Furor/Disdain -> REVISIT (noted in docs/data_issues.md); Wristguards 3983 dup entry flagged
- 43 Daily Explosion -> fine (flat 16336 daily proc, icd 10)
- 44 Death Defier's Haste -> Hat stub removed (real bonus = Reckless Brutality, already modeled); dup entries 720/726 removed; movement per-enemy 2.4x5; notes deduped
- 45 Elegant Reply -> note (fine); Divine Word -> note (threat)
- 46 Daily Burst -> fine
- 47 Raging Rally -> sequence-proc model (matcher widened; Vital Onslaught dmg half moved too)
- 48 Miracle Crit -> party-scoped CA3/CritAvoid3 (display, no self credit); Poleyns self entries fixed
- 49 Fanged Vice -> fine
- 50 Fount of Power -> apProc fullheal 0.1/s (7.5% / 3.75% AP gain)
- 51 Awareness Escalation -> 1 stack always-on (fine)
- 52 Maiden's Blade -> always-on (facing=tank, not-facing=flank) + Underdark zone entry; Apothecary's Repel -> party-scoped CritSev
- 53 Artifact Fanatic -> flat 6 always-on (ramp avg)
- 54 Spider's Stride -> 0.75 uptime + Underdark entry
- 55 Butcher's Frenzy -> max stacks always-on; Adrenaline Rush bogus entry removed (screenshot)
- 56 Shielded Strength -> BUILD CONDITIONS registry built (shield_or_temphp), party healer setting; n00b: conditional questions per piece, auto-resolve from build
- 57 Magnified Force -> fine (dups removed); contextual sim controls built
- 58 Low Reserve -> bogus stub removed (screenshot)
- 59 Menacing Aura -> Dmg Bonus 3.45/2.39 within 10 ft
- 60 Medic's Regards -> 0.4 uptime
- 61 Positional Advantage -> stub removed; duplicate item 2791 deleted (screenshot)
- 62/63 Vital Toll -> note; Contender's Action -> fine (0.08)
- 64 Relentless Assault -> stub removed; Reckless Advantage max stacks always-on (screenshot)
- 65 Warden's Defense -> fine (0.33); Contender's Fortune -> note
- 66 Aura of Enfeeblement -> stub removed (dup of Menacing Aura, screenshot)
- 67/68 Power Siphon fine (0.5); Resistance Rune 0.1 all
- 69-71 Shielded Offense procDamage+condition; Midnight's Malady 2.39 always-on (n00b: AoE at-wills -> ~100%); Moonlight's Blessing party
- 72/73 Skirmisher's Versatility 0.08 x4 stats; Survivor's Rush missingHealthMaxAtPct 0
- 74/75 Destroyer's Might fine; Herald's Cunning 0.2 all
- 76-78 Fleeing Mouse note; Necromancer's Repel note; Soul Siphon icd 40 (half pickup)
- 79-82 Perilous Attraction note; Executioner's Pursuit note; Executioner's Guard 0.2; Contender's Haste 0.25
- 83-86 Summon Myconid fine; Spider's Cunning gold note; Tangled Shadows fine; Controlled Sandstorm fine
- 87-90 Reckon Fey note; Killer's Might fine; Poisonous Strike/Daily notes (no magnitude)
- 91-94 Warden's Daze note; Air/Darkness rings notes; Berserker's Might 0.5 ramp + Crusader condition
- 95-98 Critical Remedy icd; Eagle's Precision max stacks; Charged Might Fighter helms pending reshoot; Veiled Barricade max stacks
- 99-102 Bone Armor fine; Summon Devil fine; Butcher's Remedy fine; Golden Steal note
- 103-107 Executioner's Fury fine; Necromancer's Command/Bring Out Your Dead/Calling the Guards notes; Contender's Parry 0.08 + Barovia
- 108-112 Daily Daze/Cursed Strike/Death's Endowment notes; Superstition fine; Fanged Vex fine
- 113-117 pet summons/Voodoo Curse notes; unnamed low-IL group left as is
- 118-123 Drafting/On Daily Use notes; Wanderer's Vigor soloOnly; Survivor's Vigor fine; Leader's Vitality perTeammate; Shroud fine; SOLO MODE built; proc collectors now gated (bug fix)
- 124-129 Control Power Regen fine; Gold Bonus/Vanishing/Reflexive/Impenetrability/Cowardice notes
- 130-148 Underdark rings + old artifact text: all fine / notes. QUEUE CLOSED 2026-09-08


# Insignia bonus review - rulings log (2026-09-09)

Same process as the gear review: 43 names, one at a time. Queue: scripts/_insig_review_queue.py. Insignia bonuses now carry gear-style equipBonuses (gates, procs, windows, cadence triggers).

- INSIG 1-3: Master's Cruelty fine; Defender's Retort procDamage 200 struck icd10; Tactician's Precision cdProc 5s/daily
- INSIG 4-6: Enchanter's Hex REVISIT (control-tag powers); Protector's Covenant fine; Lionheart's procHeal 20% <=30% hp
- INSIG 7-10: Warlord's Motivation display-only (no comp dmg layer); Ally's Resilience party; Master's Precision stamina 25-75; Mender's fine
- INSIG 11-14: cadence sliders built (daily/artifact/mountpower 60s, n00b); Artificer's cdProc artifact 3s; Cavalry's Haste cdProc mountpower 4s; Accursed's 0.9; Executioner's fine
- INSIG 15-19: Cautious Devotion/Guardian's/Trainer's fine; Predator's Instinct window 20s mountpower; Cavalry's Alarm old text rule (cadence-driven)
- INSIG 20-25: Knight's Condemnation procHeal struck 100% (enemy CA on every hit, n00b) icd10; Shepherd's window daily 10s + party; Traveler's note; rest fine
- INSIG 26-29: Wanderer's note; Assassin's fine; Champion's Return procHeal 10% <=50% icd30; Berserker's fine
- INSIG 30-36 applied per assumptions (n00b fine)
- INSIG 37-43 applied; INSIGNIA QUEUE CLOSED 2026-09-09
- 2026-09-10 REVISION (n00b): Accursed's Resolve 0.9 uptime was an assumption that went through in the 11-14 batch, not a ruling. Replaced by a "You are debuffed" scenario toggle (default off) and the `whileDebuffed` entry field; the bonus is now never counted unless the player says so.
