# Migration A dry run (POWER-TAGS-2 step 1.1)

Entries touched: 61 (48 distinct after merging identical paragon copies). Nothing is applied until n00b approves.

Key kinds: **fight** = you set it in the Fight panel; **you** = existing stamina or health slider; **build** = worked out from your slotted kit, never set by hand.


## Barbarian

- **Marathon Runner** (general): view rule. +10% Movement Speed out of combat: shown on the at-rest sheet, removed in the in-combat view (PT2-3). Not a gate.
- **Raging Criticals** (general): toggle on `rageWindowActive` (build); Critical Severity +10. On while Battlerage (Blademaster) or Unstoppable (Sentinel) is up. Folds the inactive gatedPercentStats in.
- **Trample the Fallen** (Blademaster, Sentinel): toggle on `controlHitRecently` (build); Dmg Bonus +5. On after a control encounter or daily hits (10 s). The "target takes 5% more" half is an enemy debuff: Stage 2.

## Bard

- **Advancing Parry** (Songblade): toggle on `parryFinisherRecently` (build); Deflect +25. 2 s after Reprise, Flourish or Volti Subito; on when the kit has one of them.
- **Critical Tuning** (general): dutyCycle on `songPlayed` (build); Critical Severity +10. 20 s after a non-quick-play song; songs are the Bard rotation, so up the whole fight.
- **Sforzando** (Minstrel, Songblade): dutyCycle on `songPlayed` (build); Damage Bonus +5, Outgoing Healing +5. 20 s after a song in combat; up the whole fight.
- **Soloist** (Minstrel, Songblade): toggle on `soloOrIsolated` (fight); Damage Bonus +10. No party member within 30 ft (Fight panel toggle "solo").
- **Truly Inspired** (general): dutyCycle on `songPlayed` (build); per paragon. 20 s after a song in combat; Songblade Damage Bonus 10, Minstrel Outgoing Healing 10.

## Cleric

- **Hallowed Armor** (Arbiter, Devout): toggle on `channelingDivinity` (build); Incoming Damage -10. While holding Channel Divinity (the -5% base part stays always on).
- **Hallowed Guide** (Devout): toggle on `healTargetWithin15ft` (fight); Outgoing Healing +5. Heal target within 15 ft (new Fight panel toggle).
- **Overflowing Spirit** (Devout): toggle on `divinityFull` (build); Outgoing Healing +25. Divinity at 100%.
- **Pilgrim's Light** (Arbiter, Devout): toggle on `soloOrIsolated` (fight); Dmg Bonus +5. No party member within 30 ft (Fight panel toggle "solo").

## Fighter

- **Vigorous Strikes** (Dreadnought, Vanguard): linear on `currentStaminaPct` (you); Critical Strike +5. Full value at full stamina, falling as stamina drops (existing stamina slider).

## Paladin

- **Blessed Wanderer** (Justicar, Oathkeeper): toggle on `soloOrIsolated` (fight); Damage Bonus +20. No party member within 30 ft (Fight panel toggle "solo"). Had no condition key before.
- **Divine Retribution** (Justicar): linear on `currentStaminaPct` (you); Damage Bonus +5. 0% at full stamina up to 5% at empty (existing stamina slider).

## Ranger

- **Aspect of the Falcon** (Hunter): threshold on `targetRangeFt` (fight); Dmg Bonus +10. Within 25 ft of the target (existing range slider).
- **Aspect of the Lone Wolf** (Warden): count on `enemyCount` (fight); Deflect +10. 1% Deflect per enemy within 30 ft, max 10% (stat map holds the 10% max; gate gives 0.1 per enemy).
- **Pathfinder's Action** (Hunter): dutyCycle on `dailyUsedRecently` (build); Deflect +5, Movement Speed +10. 10 s after a daily. Snapshot: on. Optimizer: 10 s per daily cycle.
- **Seeker's Vengeance** (Hunter, Warden): toggle on `behindTarget` (fight); Dmg Bonus +10. Attacking from behind (new Fight panel toggle).
- **Twin-Blade Storm** (Warden): threshold on `enemyCount` (fight); Dmg Bonus +8. The attack hits 3 or more enemies (existing enemy count slider).

## Rogue

- **Cunning Ambusher** (general): dutyCycle on `afterStealth` (build); Dmg Bonus +10. 5 s after leaving Stealth. Snapshot: on. Optimizer: share of the fight after Stealth (Stage 2).
- **Dagger Threat** (Whisperknife): threshold on `targetRangeFt` (fight); Dmg Bonus +10. Full 10% within 20 ft. NEEDS YOUR CALL: how it falls off past 20 ft is unknown, so past 20 ft it counts 0 (guaranteed minimum).
- **Hastily Sharpened Blades** (Assassin): toggle on `inCombat` (build); Critical Strike +5. In combat; rolled 5-10%, counted at the guaranteed 5% (your ruling).
- **Sneak Attack** (Assassin, Whisperknife): toggle on `stealthed` (build); Recharge Speed +10. While Stealthed.

## Warlock

- **Executioner's Gift** (Hellbringer): linear on `enemyHealthPct` (fight); Damage Bonus +30. Up to 30% as the target loses health (existing enemy health slider). Replaces the hardcoded enemyMissingHealthScaled case.
- **Flames of Empowerment** (Hellbringer, Soulweaver): toggle on `flamesOnTarget` (build); Dmg Bonus +4. On the target 10 s after an at-will hit; on when at-wills are slotted. Was assumeAlwaysOn. Stack count = Stage 2.
- **From the Brink** (Soulweaver): toggle on `allyBelowHealthPct` (fight); Outgoing Healing +15. An ally below 25% health (new Fight panel toggle).
- **Warlock's Curse** (Hellbringer): toggle on `targetCursed` (build); Damage Bonus +15. Target is Cursed. Replaces the hardcoded curseGated special case; Stage 2 uses the simulated Curse uptime.

## Wizard

- **A Step Above Mastery** (Arcanist): Stage 2, not a panel stat (changes the Arcane Mastery mechanic).
- **Arcane Power Field** (Arcanist): Stage 2, not a panel stat (aura proc and Arcane Mastery doubling).
- **Arcane Presence** (Arcanist, Thaumaturge): Stage 2, not a panel stat (boosts only cold, fire and lightning hits).
- **Brisk Transport** (general): dutyCycle on `teleportedRecently` (build); Movement Speed +10. 2 s after a Teleport. Snapshot: on. Never scored.
- **Chilling Presence** (Arcanist, Thaumaturge): perStack on `chillStacks` (build); Dmg Bonus +3. 0.5% per Chill stack, 3% at 6 (stat map holds the 3% max; gate = stacks/6).
- **Elemental Reinforcement** (Arcanist): two parts: Dmg Bonus +7 when castingSpells (build); Dmg Bonus +7 when alternateElements (build). 7% while casting; another 7% while elements alternate (derived from the slotted kit).
- **Eye of the Storm** (Arcanist): dutyCycle on `encounterOrDailyUsed` (build); Critical Strike +10. 5 s of every 10 s. Snapshot: 10%. Optimizer: 50%.
- **Frigid Winds** (Thaumaturge): perStack on `chillStacks` (build); Dmg Bonus +9. 1.5% per Chill stack, 9% at 6.
- **Frost Wave** (Thaumaturge): Stage 2, not a panel stat (applies Chill).
- **Glowing Flames** (Thaumaturge): Stage 2, not a panel stat (Smolder splash).
- **Iced Lightning** (Arcanist): Stage 2, not a panel stat (boosts five named powers).
- **Icy Veins** (Thaumaturge): Stage 2, not a panel stat (applies Chill).
- **Nightmare Wizardry** (Arcanist): Stage 2, not a panel stat (raises Combat Advantage uptime from crits).
- **Orb of Imposition** (Arcanist, Thaumaturge): Stage 2, not a panel stat (boosts only control powers vs immune targets).
- **Relative Haste** (Thaumaturge): count on `enemyCount` (fight); Recharge Speed +20. 5% per chilled enemy, max 20% at 4 enemies; needs Chill on them.
- **Rimefire Weaving** (Thaumaturge): two parts: Dmg Bonus +5 when chillOrSmolderOnTarget (build); Dmg Bonus +5 when rimefireOnTarget (build). 5% with Chill or Smolder on the target, 10% with both (Rimefire).
- **Shatter Strike** (Thaumaturge): Stage 2, not a panel stat (proc and power bonus).
- **Smolder** (Thaumaturge): Stage 2, not a panel stat (a damage over time mechanic).
- **Storm Fury** (Arcanist): Stage 2, not a panel stat (a damage proc).
- **Striking Advantage** (Arcanist): Stage 2, not a panel stat (a damage proc).

## Counts

- toggle: 15
- linear: 3
- perStack: 2
- dutyCycle: 7
- threshold: 3
- count: 2
- two parts: 2
- view rule: 1
- Stage 2: 13
