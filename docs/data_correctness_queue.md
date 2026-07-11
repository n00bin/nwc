# Data Correctness Queue — pre-launch optimizer trust campaign

Generated 2026-07-07 by the unparsed-bonus / unknown-stat census (session with n00b:
"we have to get the data correct first... paying customers will feel cheated").
## Reconciliation with n00b's engine-blind audit (2026-07-07, parallel session)
That audit counts every ENGINE-BLIND surface (contributes nothing to the score),
which is broader than this doc's fully-unparsed census — both are real, the
audit is the true trust exposure:
- Gear equip bonuses: 7,763 surfaces, 3,273 blind (42%) — THE problem. This
  doc's Tier 1 (137 endgame fully-unparsed) is its worst subset; the remainder
  splits into (a) structurable text (steward work) and (b) parsed-but-waiting
  on engine layers (damage-output / heal-sim HoT / survivability — dev
  roadmap, NOT data entry; see toon-forge-stats.js silenced list).
- Companion power procs: 124 surfaces, 68 blind (55%) — every one a potential
  Siege Master (a mis-transcription there fed ~13.5% phantom Power). Tier 1.5.
- Mount equip powers: 6 blind, values already in the text — QUICKEST WINS,
  clear these first for momentum.
- Buffs/consumables 25 blind (mostly by design), collars/artifacts/overloads/
  boons 1-6 each, enchants/kits/insignia-bonuses/enhancements/companion-gear 0.
PRIORITIZATION RULE: a blind bonus only cheats a paying member if it could
CHANGE A RECOMMENDATION — endgame IL first, role-defining bonus types first
(healing/divinity next, for the healer preview), optimizer-adjacent items first.

Failure classes named after their live discoveries:
- LIFEBRAID CLASS: equip bonus is description text only (no structured stat/amount) -> engine scores 0, item invisible to the optimizer.
- SIEGE MASTER CLASS: stat name the engine does not recognize -> silently dropped (or was mis-transcribed).

## Tier 1 — endgame unparsed equip bonuses (IL >= 3000): 137 entries
Parse each into structured effects, verified against archived tooltips in docs/calibration/inbox/
where they exist (most were screenshot-intake batches); anything without a screenshot goes to the
n00b in-game verification queue. NEVER guess amounts.

- [ ] IL6000 Ring: **Frostsilver Hoop of Tenacity** (id 5405) — "When you have been running for 1 seconds you generate threat around you every second as long as you continue r"
- [ ] IL6000 Ring: **Frostsilver Circlet of Protection** (id 5402) — "When you use a Daily power, the next enemy that attacks you takes damage equal to 50% of your max health (30 s"
- [ ] IL5700 Ring: **Coldsilver Hoop of Tenacity** (id 5323) — "When you have been running for 1 second you generate threat around you every second you continue running. +3.5"
- [ ] IL5700 Ring: **Coldsilver Circlet of Protection** (id 5320) — "When you use a Daily power, the next enemy that attacks you takes damage equal to 50% of your max health (30 s"
- [x] IL5700 Feet: **Wintermarked Pilgrim Poleyns** (id 5489) — DONE 2026-07-07: split into structured Class Resource Regen proc (2%/stack, max 5) + always-on 6% Critical Strike rider, verified vs docs/calibration/inbox/gear/warlock-gear/feet screenshot
- [ ] IL5700 Feet: **Wintermarked Lifeward Greaves** (id 5345) — "Healing an ally has a 40% chance to grant you and your nearest ally +3% Critical Strike and +3.5% Critical Sev"
- [x] IL5700 Arms: **Wintermarked Skirmisher Bracers** (id 6242) — DONE 2026-07-07 (n00b flagged for a double look): split into structured Class Resource Regen proc (2%/stack, max 5) + always-on 6% Critical Strike rider, verified vs docs/audit/_up/unbound-gear screenshot
- [ ] IL5700 Armor: **Wintermarked Ravager Cuirass** (id 6816) — "When you damage or heal your target for more than 10% of your Maximum Hit Points in a single blow, you gain +0"
- [ ] IL5700 Armor: **Wintermarked Mender's Breastplate** (id 5490) — "When you damage or heal your target for more than 15% of your Maximum Hit Points in a single action, you and y"
- [ ] IL5400 Ring: **Rimetouched Hoop of Tenacity** (id 5412) — "Whenever you are damaged for more than 19% of your Maximum Hit Points in a single blow, you will take 3% less "
- [ ] IL5400 Ring: **Rimetouched Coil of Wrath** (id 5410) — "Your current Hit Points increases your Forte, up to a max of 4%."
- [ ] IL5400 Feet: **Runefrost Pilgrim Poleyns** (id 5497) — "Whenever you critically heal a teammate with a single-target heal, the target and up to 4 nearby teammates rec"
- [ ] IL5400 Feet: **Runefrost Marcher Poleyns** (id 6209) — "When you are 20ft or closer to your target, your Critical Severity is increased by 5%. When you are 20ft or fu"
- [ ] IL5400 Arms: **Runefrost Skirmisher Bracers** (id 6212) — "When you damage or heal your target for more than 15% of your Maximum Hit Points in a single blow, you gain 70"
- [ ] IL5400 Arms: **Runefrost Skirmisher Bracers** (id 6212) — "When you damage or heal your target for more than 15% of your Maximum Hit Points in a single blow, you gain 70"
- [ ] IL5400 Arms: **Runefrost Lifeward Vambraces** (id 5355) — "Your Divinity maximum increases by 15%. Gain 3.5% Critical Severity."
- [ ] IL5400 Armor: **Runefrost Ravager Cuirass** (id 6840) — "When you use a Daily power, your next encounter power will deal 20% more damage. (30 second cooldown) Addition"
- [ ] IL5400 Armor: **Runefrost Hunter's Coat** (id 5494) — "When you deal damage with a Daily power, your next encounter power will deal 20% more damage. (30 second coold"
- [ ] IL5400 Armor: **Runefrost Bulwark Cuirass** (id 5358) — "Upon taking critical damage in The Reghed Edge, you have a 25% chance to gain -5% Incoming Damage for 5s. In n"
- [ ] IL5000 Head: **Visage of the Eternal Sigil** (id 377) — "Your Divinity regenerates 25% faster."
- [ ] IL5000 Head: **Visage of the Eternal Sigil** (id 377) — "Divinity regen 25% faster"
- [ ] IL5000 Head: **Helm of the Unyielding Bastion** (id 380) — "Per 5s in combat: +0.4% Awareness, +0.5% Crit Avoid. Max 10 stacks (4%/5%)"
- [ ] IL5000 Feet: **Sabatons of the Eternal Sigil** (id 375) — "On heal: 40% chance for self + nearest ally to gain 3% CritStrike + 3.5% CritSev 10s (15s cd)"
- [ ] IL5000 Feet: **Greaves of the Unyielding Bastion** (id 256) — "On Deflect: +2.5% Defense and +2% Movement Speed for 10s (12s cd)"
- [ ] IL5000 Arms: **Vambraces of the Eternal Sigil** (id 216) — "Per 6s in combat: +2.5% Divinity regen + 0.2% CritStrike to nearest 2 allies. Max 8 stacks (20%/1.6%)"
- [ ] IL5000 Arms: **Vambraces of the Eternal Bloom** (id 3154) — "Your Performance/Soulweave maximum is increased by 15%. While moving, your closest 4 nearby allies gain +0.8% "
- [ ] IL5000 Arms: **Gauntlets of the Unyielding Bastion** (id 378) — "On Critical Strike against you, you reflect 10% of your Maximum Hit Points as damage and gain +7.5% Awareness "
- [ ] IL5000 Armor: **Plate of the Unyielding Bastion** (id 379) — "On hit > 15% MaxHP: 60 mag shockwave + 3.5% Awareness 7s (12s cd)"
- [ ] IL5000 Armor: **Cuirass of the Scarlet Arcanum** (id 2712) — "When you use a Daily power, for the next 30 seconds your next Encounter Power deals +75% more Damage."
- [ ] IL5000 Armor: **Cuirass of the Scarlet Arcanum** (id 2712) — "When you use a Daily power, for the next 30 seconds your next Encounter Power deals +75% more Damage."
- [ ] IL5000 Armor: **Cuirass of the Bloodborne Reaper** (id 6830) — "When you use a Daily power, your next three strikes from encounter powers will deal 15% more damage and heal y"
- [ ] IL5000 Armor: **Cuirass of the Bloodborne Reaper** (id 6830) — "When you use a Daily power, your next three strikes from encounter powers will deal 15% more damage and heal y"
- [ ] IL5000 Armor: **Breastplate of the Eternal Bloom** (id 3155) — "When you damage or heal your targets for more than 15% of your Maximum Hit Points in a single action, you and "
- [ ] IL4900 Ring: **Deathsilver Loop of Influence** (id 313) — "vs 1 enemy: per 2s gain +0.4% CritStrike + 0.4% CritSev. vs 4+: -1 stack/2s. Max 10 (4%/4%)"
- [ ] IL4900 Ring: **Deathsilver Halo of Obedience** (id 311) — "When Stamina > 75%: +4% CritStrike, +3% Power"
- [ ] IL4900 Ring: **Deathsilver Band of Sacrifice** (id 315) — "When healed in combat: +9% OH for 10s (15s cd)"
- [ ] IL4850 Shirt: **Frost-Riven Earthshard Guard** (id 5375) — "When your Stamina is over 75%, you take 4.5% less damage."
- [ ] IL4800 Off Hand: **Aegis of the Condemned · IL 4800** (id 465) — "Set Impending Doom (0/2) — Charges by daily/encounter/in-combat. Unleashed: Tank −1% Incoming dmg, Heal −1% OH"
- [ ] IL4700 Ring: **Snowbound Ring of Initiative** (id 5428) — "Whenever you damage an enemy with your Powers, you have a 10% chance to deal 100 magnitude damage in a 20 radi"
- [ ] IL4700 Head: **Mask of the Vital Sigil** (id 383) — "After moving: Divinity regen +8%, allies in 15' gain +1.3% IH for 4s. Pauses after 4s of standing still"
- [ ] IL4700 Head: **Hood of the Lifebloom** (id 3161) — "After moving, your Performance/Soulweave regenerates 20% faster. You lose this benefit if you stand still for "
- [ ] IL4700 Head: **Hood of the Lifebloom** (id 3161) — "After moving, your Performance/Soulweave regenerates 20% faster. You lose this benefit if you stand still for "
- [ ] IL4700 Head: **Crown of the Iron Bulwark** (id 384) — "On encounter use: 40% chance for self + lowest-HP ally in 25' to gain +5% Forte and +3.5% Defense 8s (15s cd)"
- [ ] IL4700 Feet: **Sabatons of the Vital Sigil** (id 228) — "Per 5s in combat: +0.5% OH and +0.6% Forte. Max 6 stacks (3% OH, 3.6% Forte)"
- [ ] IL4700 Feet: **Frostbound Warboots** (id 5388) — "When Action Points are less than 80%, your Accuracy is increased: +5.5% while outside of The Reched Edge, +7% "
- [ ] IL4700 Feet: **Frostbound Hearthboots** (id 5381) — "When you damage or heal your target for more than 10% of your Maximum Hit Points in a single blow, you gain 2%"
- [ ] IL4700 Arms: **Vambraces of the Vital Sigil** (id 381) — "Divinity maximum increased by 20%"
- [ ] IL4700 Arms: **Vambraces of the Iron Bulwark** (id 204) — "Per 6s in combat: +0.4% Awareness, +0.1% Power to allies in 20'. Max 8 (3.2% / 0.8% per ally)"
- [ ] IL4700 Arms: **Gauntlets of the Lifebloom** (id 3163) — "Your Performance/Soulweave maximum is increased by 20%."
- [ ] IL4700 Arms: **Gauntlets of the Lifebloom** (id 3163) — "Your Performance/Soulweave maximum is increased by 20%."
- [ ] IL4700 Armor: **Cuirass of the Lifebloom** (id 3162) — "When you damage or heal your targets for more than 15% of your Maximum Hit Points in a single action, you and "
- [ ] IL4700 Armor: **Cuirass of the Iron Bulwark** (id 385) — "On dmg > 15% MaxHP: 20' aura gives allies +1% Defense and +2.5% IH 8s (15s cd)"
- [ ] IL4700 Armor: **Cuirass of the Crimson Scythe** (id 6831) — "When in combat with 3 or more enemies, your Forte is increased by +1.8% every 2 seconds. Every 2 seconds you a"
- [ ] IL4700 Armor: **Breastplate of the Vital Sigil** (id 382) — "Heal ally grants them +1% Defense for 6s. Max 5 stacks (5%)"
- [ ] IL4650 Ring: **Rotsteel Hoop of Corruption** (id 253) — "When Stamina ≥ 75%, Defense increased by 5%"
- [ ] IL4600 Shirt: **Cracked Earthshard Guard** (id 5362) — "When your Stamina is over 75%, you take 3% less damage."
- [ ] IL4600 Feet: **Cindersilk Shoes** (id 7384) — "When Action Points are less than 80%, your Critical Severity is increased by 7%."
- [ ] IL4550 Head: **Visage of the Eternal Herald** (id 43) — "When you damage or heal your target for more than 10% of your Maximum Hit Points, you gain 3% faster Divinity/"
- [ ] IL4350 Shirt: **Veinlit Aetherwrap** (id 5439) — "Whenever you Critically Strike with your Powers, you have a 10% chance to reduce your Encounter Power cooldown"
- [ ] IL4300 Feet: **Boots of the Endless March** (id 58) — "On encounter use: 15% chance for +10% CritSev for 8s"
- [ ] IL4300 Arms: **Gauntlets of the High Hierarch** (id 56) — "On dmg > 50% MaxHP single blow: drop 3 orbs (15% MaxHP each); orb pickup grants +2% Forte 10s (30s cd)"
- [ ] IL4300 Armor: **Cuirass of the Black Flame** (id 51) — "On kill: +5% health"
- [ ] IL4150 Ring: **The Watcher's Gaze** (id 80) — "Every 3 seconds your next attack deals 91,980 damage to your target, but you take 46,990 poison damage."
- [ ] IL4150 Ring: **The Claw of Covetous Flame** (id 79) — "When you use an Encounter power, the next enemy that attacks you takes lightning damage equal to 25% of your m"
- [ ] IL4100 Head: **Cowl of the Ashen Chant** (id 293) — "+18% Divinity/Performance/Soulweave regeneration in Thay. +12% Divinity/Performance/Soulweave regeneration out"
- [ ] IL4100 Feet: **Sabatons of the Flayed Legion** (id 286) — "When you use a Daily power, for the next 30 seconds your next Encounter Power deals +60% more Damage."
- [ ] IL4050 Head: **Whispersilk Cowl** (id 6846) — "When you kill an enemy, you gain 3% Action Points."
- [ ] IL4050 Head: **Visage of the Undying Faith** (id 77) — "When you damage or heal your target for more than 10% of your Maximum Hit Points in a single blow, you gain 4%"
- [ ] IL4050 Feet: **Whispersilk Boots** (id 6849) — "When Action Points are less than 80%, your Critical Severity is increased by 7%."
- [ ] IL4050 Feet: **Gladebind Greaves** (id 6853) — "Whenever you are damaged for more than 15% of your Maximum Hit Points in a single blow, you will be teleported"
- [ ] IL4050 Feet: **Ambersteel Greaves** (id 6865) — "Whenever you Deflect an attack, gain 1% Movement Speed and Recharge Speed for 10 seconds. Max 5 Stacks: 5% Mov"
- [ ] IL4050 Arms: **Thistledown Vambraces** (id 6856) — "Whenever you Critically Strike with your Powers, you have a 10% chance to deal 150 magnitude damage around you"
- [ ] IL4050 Arms: **Oakenthorn Vambraces** (id 6860) — "Whenever you Deflect an attack, gain 1.4% Stamina Regeneration for 10 seconds. Max 5 Stacks: 7% Stamina Regene"
- [ ] IL4050 Arms: **Gladebind Vambraces** (id 6852) — "Your Performance/Soulweave maximum increases by 15%. Gain 3% Forte."
- [ ] IL4050 Arms: **Gauntlets of the Hierarch** (id 69) — "Whenever you are damaged for more than 50% of your Maximum Hit Points in a single blow, you drop 3 orbs around"
- [ ] IL4050 Arms: **Bindings of the Black Pact** (id 473) — "Gain 0.7% Damage for 5 seconds to each enemy you're fighting around you. (Max of 10 targets)"
- [ ] IL4050 Arms: **Ambersteel Vambraces** (id 6864) — "Your Divinity maximum increases by 15%. Gain 3% Forte."
- [ ] IL4050 Armor: **Whispersilk Tunic** (id 6847) — "When you damage or heal your target for more than 10% of your Maximum Hit Points in a single blow, you gain 1."
- [ ] IL4050 Armor: **Thistledown Mailcoat** (id 6855) — "Gain -1% Incoming Damage when you strike an enemy. Stacks 5 times. When you are struck, the stacks are consume"
- [ ] IL4050 Armor: **Oakenthorn Cuirass** (id 6859) — "Gain 1% Recharge Speed for each enemy you are engaged in battle within 100'. Max 10 Stacks: 10% Recharge Speed"
- [ ] IL4050 Armor: **Ironblossom Cuirass** (id 6867) — "Whenever you Critically Strike with your Powers, you have a 15% chance to deal 175 magnitude damage around you"
- [ ] IL4050 Armor: **Cuirass of the Ethralled Flame** (id 73) — "When you kill an enemy, you gain 3.5% of your health back."
- [ ] IL4050 Armor: **Cuirass of the Crimson Reckoning** (id 65) — "Gain up to 3.3% Control Resistance and -1.8% Incoming Damage based on your missing health. The max bonus is ac"
- [ ] IL4050 Armor: **Ambersteel Cuirass** (id 6863) — "Whenever you are damaged for more than 50% of your Maximum Hit Points in a single blow, you drop 5 orbs around"
- [ ] IL3950 Ring: **The Crimson Inlay** (id 85) — "Your current Hit Points increases your Recharge Speed, up to a maximum of 3%."
- [ ] IL3950 Ring: **The Bladed Ascendant** (id 81) — "Your current Hit Points increases your Recharge Speed, up to a maximum of 3%."
- [ ] IL3900 Off Hand: **Doomward Bastion of the Thayan Zealot** (id 373) — "Every 3s in combat, you will gain a stack of Umbral Stride. Each stack grants the following bonuses: General: "
- [ ] IL3900 Main Hand: **Oathbreaker's Judgment of the Thayan Zealot** (id 374) — "Every 3s in combat, you will gain a stack of Umbral Stride. Each stack grants the following bonuses: General: "
- [ ] IL3800 Shirt: **Veinlit Aetherwrap** (id 5438) — "Your Critical Severity as your health decreases to a maximum of 5%. Currently: 0%."
- [ ] IL3800 Shirt: **Runemarked Titanwave Harness** (id 7383) — "When your Stamina is over 75%, your Power is increased by 7,500."
- [ ] IL3800 Shirt: **Arcane Conduit Sigil — Explosive Defense** (id 447) — "On Daily: +6.3% Defense 8s + 150 dmg in 25' (10s cd)"
- [ ] IL3800 Shirt: **Arcane Conduit Seal — Corrupt Healing** (id 446) — "+5% OH, -7.5% IH (corrupt trade)"
- [ ] IL3800 Shirt: **Arcane Conduit Mark — Survivors Healing Aura** (id 449) — "At ≤50% HP: 5% IH for self + allies in 25' for 6s (15s cd)"
- [ ] IL3800 Shirt: **Arcane Conduit Crest — Critical Momentum** (id 452) — "Moving in combat: stack +3% CritStrike per 2s for 4s"
- [ ] IL3800 Pants: **Arcane Conduit Sigil — Survivor's Avoidance** (id 442) — "Up to 8% Crit Avoid based on health %"
- [ ] IL3800 Pants: **Arcane Conduit Seal — Pressured Muse** (id 441) — "Resource regen 10% faster when Stamina ≤ 50%"
- [ ] IL3800 Pants: **Arcane Conduit Mark — Rested Healing** (id 443) — "+7.5% OH when Stamina > 75%"
- [ ] IL3800 Pants: **Arcane Conduit Insignia — Challenger's Awareness** (id 448) — "vs 2+ enemies: CritStrike +8.5%. vs 1: removed"
- [ ] IL3800 Pants: **Arcane Conduit Ink — Ruthless Critical** (id 444) — "On dmg/heal > 15% MaxHP: +1.2% CritStrike + 0.7% Power 15s. Max 5 (6%/3.5%)"
- [ ] IL3800 Pants: **Arcane Conduit Crest — Combatant's Advantage** (id 445) — "Per 2s in combat: +1.2% CA, -1.7% Defense. Max 5 stacks"
- [ ] IL3700 Feet: **Prismatic Luminstep Sabatons — Enduring Resilience** (id 514) — "Gain up to 5% Control Resistance and -2.5% Incoming Damage based on your missing health. The max bonus is achi"
- [ ] IL3700 Feet: **Prismatic Luminstep Greaves** (id 15) — "When Action Points are less than 80%, your Accuracy is increased. +5% while outside of the Pirates' Skyhold or"
- [ ] IL3700 Feet: **Prismatic Luminstep Boots** (id 3171) — "When Action Points are less than 80%, your Accuracy is increased. +5% while outside of the Pirates' Skyhold or"
- [ ] IL3700 Arms: **Prismatic Crystalgard Gauntlets — Reckless Remedy** (id 515) — "Whenever you deal damage to an enemy gain a stack of Reckless Remedy, increasing your Defense by 1% but decrea"
- [ ] IL3600 Shirt: **Mystic Conduit Seal — Survivor's Forte** (id 463) — "Up to 8% Forte based on health %"
- [ ] IL3600 Shirt: **Mystic Conduit Seal — Healer's Influence** (id 457) — "Healing ally with encounter: 10% chance to gain +11,250 OH for 5s (10s cd)"
- [ ] IL3600 Shirt: **Mystic Conduit Ink — Critical Tactics** (id 455) — "When Stamina > 75%, CritStrike increased by 11250"
- [ ] IL3600 Shirt: **Mystic Conduit Ink — Butcher's Precision (Lesser)** (id 461) — "On dmg/heal > 10% MaxHP: +11,250 CritSev for 5s (10s cd)"
- [ ] IL3600 Shirt: **Mystic Conduit Crest — Duelist's Strength** (id 453) — "vs 1 enemy: +2250 CA every 2s. vs 2+: -1 stack. Max 5 (11250 CA)"
- [ ] IL3600 Pants: **Mystic Conduit Insignia — Indefatigable Advantage** (id 456) — "When Stamina < 25%, Power increased by 11250"
- [ ] IL3550 Head: **Helm of the Eternal Gaze** (id 310) — "You gain 9,925 Defence. And when in Thay you gain -1.2% Incoming Damage."
- [ ] IL3550 Arms: **Gauntlets of the Anointed** (id 304) — "Gain a stack of 0.6% Divinity/Performance/Soulweave regeneration for 15 seconds when you heal an ally, lose a "
- [ ] IL3550 Armor: **Bulwark of the Deathless Tyrant** (id 309) — "When in combat with multiple enemies, gain 9,925 Awareness. This bonus is at full power when in combat with 7 "
- [ ] IL3500 Ring: **Dreadbreaker Hoop** (id 244) — "Your current Hit Points increases your Forte, up to a max of 7%. Currently: 7% Forte"
- [ ] IL3450 Ring: **The Forgotten Relic** (id 111) — "Gain -1.5% Incoming Damage."
- [ ] IL3350 Feet: **Luminstep Sabatons — Ruthless Resources** (id 518) — "When you damage or heal your target for more than 10% of your Maximum Hit Points in a single blow, you gain 5%"
- [ ] IL3350 Feet: **Luminstep Sabatons — Enduring Resilience** (id 525) — "Gain up to 5% Control Resistance and -2.5% Incoming Damage based on your missing health. The max bonus is achi"
- [ ] IL3350 Feet: **Luminstep Greaves** (id 2726) — "When Action Points are less than 80%, your Accuracy is increased. +5% while outside of the Pirates' Skyhold or"
- [ ] IL3350 Feet: **Luminstep Boots** (id 3179) — "When Action Points are less than 80%, your Accuracy is increased. +5% outside Pirates' Skyhold/Dread Sanctum. "
- [ ] IL3350 Arms: **Crystalgard Gauntlets — Reckless Remedy** (id 524) — "Whenever you deal damage to an enemy gain a stack of Reckless Remedy, increasing your Defense by 1% but decrea"
- [ ] IL3350 Arms: **Crystalflex Bracers** (id 3185) — "+20% Divinity/Performance/Soulweave maximum. +3.5% Forte."
- [ ] IL3350 Armor: **Bismuth Mail** (id 3184) — "Encounter heal on ally also heals you 80,000 and grants you and close Allies 3% Defense for 5s."
- [ ] IL3350 Armor: **Bismuth Jerkin** (id 3181) — "Daily damage = next encounter +20% damage, +5% Combat Advantage. (30s cooldown)"
- [ ] IL3200 Feet: **Enchanted Depthforged Greaves** (id 233) — "Gain 3.8% Awareness and Deflect while at full health. These bonuses decrease relative to your missing health."
- [ ] IL3150 Shirt: **Bloodwoven Ink (Butcher's Zeal)** (id 423) — "When you damage or heal your target for more than 15% of your Maximum Hit Points in a single blow, you gain 10"
- [ ] IL3150 Ring: **Dreadwalker Hoop** (id 255) — "Your current Hit Points increases your Forte, up to a max of 7%. Currently: 7% Forte"
- [ ] IL3000 Shirt: **Runes of the Promised — Encounter Reprieve** (id 479) — "Whenever you Critically Strike with your Powers, you have a 10% chance to reduce your Encounter Power cooldown"
- [ ] IL3000 Pants: **Runes of the Oathbound — Encounter Reprieve** (id 477) — "Whenever you Critically Strike with your Powers, you have a 10% chance to reduce your Encounter Power cooldown"
- [ ] IL3000 Pants: **Runes of the Covenant — Encounter Reprieve** (id 476) — "Whenever you Critically Strike with your Powers, you have a 10% chance to reduce your Encounter Power cooldown"
- [ ] IL3000 Head: **Depthcured Skullcap** (id 3190) — "Every 3 seconds in combat, +0.4% Outgoing Healing and 0.4% Power. Max 10 stacks: 4% Outgoing Healing and 4% Po"
- [ ] IL3000 Feet: **Mirestep Boots — Ruthless Resources** (id 530) — "When you damage or heal your target for more than 10% of your Maximum Hit Points in a single blow, you gain 4%"
- [ ] IL3000 Feet: **Mirestep Boots — Enduring Resilience** (id 534) — "Gain up to 3.5% Control Resistance and -1.8% Incoming Damage based on your missing health. The max bonus is ac"
- [ ] IL3000 Feet: **Mirestep Boots — Discharged Precision** (id 526) — "When Action Points are less than 80%, your Accuracy is increased. +3.5% while outside of the Pirates' Skyhold "
- [ ] IL3000 Feet: **Depthforged Sabatons** (id 604) — "Gain 3.25% Awareness and Deflect while at full health. These bonuses decrease relative to your missing health."
- [ ] IL3000 Feet: **Depthcured Cackrows** (id 3191) — "Your Divinity/Performance/Soulweave regenerates 12% faster while on fire-themed maps. On other maps the regen "
- [ ] IL3000 Arms: **Vinewoven Bracers — Reckless Remedy** (id 535) — "Whenever you deal damage to an enemy gain a stack of Reckless Remedy, increasing your Defense by 0.7% but decr"
- [ ] IL3000 Armor: **Depthcured Doublet** (id 3192) — "Damage or heal target >10% Max HP = +1.5% Critical Strike and Critical Severity for 15s. Max 5 stacks: 7.5%."

## Tier 2 — unknown stat names (engine drops them): 15

- [ ] 'Base Damage Boost' — 108 items (e.g. Oathbreaker's Malevolence — IL 4450, Starforged Sabatons, Destroyed Boots of the Deformed) — decide: map to a real channel, add to the silenced list deliberately, or fix a transcription error.
- [ ] 'Daily Dmg Bonus' — 17 items (e.g. Moondancer's Binding of Advantage, Ruby Abyssal Loop, Abyssal Touched Malachite) — decide: map to a real channel, add to the silenced list deliberately, or fix a transcription error.
- [ ] 'Action Points' — 16 items (e.g. Burning Dagger, Burning Dagger (IL 400), Burning Dagger (IL 500)) — decide: map to a real channel, add to the silenced list deliberately, or fix a transcription error.
- [ ] 'Heal Self' — 16 items (e.g. Drowned Dagger, Drowned Dagger (IL 400), Drowned Dagger (IL 500)) — decide: map to a real channel, add to the silenced list deliberately, or fix a transcription error.
- [ ] 'Ranged Dmg Bonus' — 8 items (e.g. Eilistraee's Elegance, Hag's Rags, Guiding Ring of the Spy) — decide: map to a real channel, add to the silenced list deliberately, or fix a transcription error.
- [ ] 'Damage against Demons, Devils, and Fiends' — 8 items (e.g. Fiend Forged Coif, Fiend Forged Helm, Fiend Forged Sabatons) — decide: map to a real channel, add to the silenced list deliberately, or fix a transcription error.
- [ ] 'Damage against Demons' — 8 items (e.g. Devil Forged Helm, Devil Forged Coif, Devil Forged Cuisses) — decide: map to a real channel, add to the silenced list deliberately, or fix a transcription error.
- [ ] 'Damage against Devils' — 8 items (e.g. Demon Forged Sabatons, Demon Forged Cuisses, Demon Forged Helm) — decide: map to a real channel, add to the silenced list deliberately, or fix a transcription error.
- [ ] 'Damage against Beasts' — 8 items (e.g. Inherited Ring, Borrowed Ring, Bypass Silver Ring) — decide: map to a real channel, add to the silenced list deliberately, or fix a transcription error.
- [ ] 'Melee Dmg Bonus' — 6 items (e.g. Eilistraee's Harmony, Heels of Fury, Striking Ring of the Veteran) — decide: map to a real channel, add to the silenced list deliberately, or fix a transcription error.
- [ ] 'Damage against Undead' — 2 items (e.g. Piercing Ring of the Killer, Piercing Ring of the Assassin) — decide: map to a real channel, add to the silenced list deliberately, or fix a transcription error.
- [ ] 'Damage against Hunts in Chult' — 2 items (e.g. Huntsman Ward Armet, Huntsman Restoration Armet) — decide: map to a real channel, add to the silenced list deliberately, or fix a transcription error.
- [ ] 'Damage in all of Chult' — 2 items (e.g. Pilgrim Ward Taj, Pilgrim Restoration Taj) — decide: map to a real channel, add to the silenced list deliberately, or fix a transcription error.
- [ ] 'Damage in the Undermountain' — 1 items (e.g. Dungeon Raider's Helm) — decide: map to a real channel, add to the silenced list deliberately, or fix a transcription error.
- [ ] 'Damage in Wildspace' — 1 items (e.g. Starforged Greaves) — decide: map to a real channel, add to the silenced list deliberately, or fix a transcription error.

## Tier 3 — sub-endgame unparsed bonuses (IL < 3000): 813 entries (lower priority; matters for progression builds).

## Tier 4 — in-game verification queue (n00b, PS5)
- [ ] Trainer's Restoration stacking across mounts (protocol in data_issues.md)
- [ ] Master boon proc chances other than Deathly Rage/Death's Bulwark/Blessed Advantage (engine assumes 20% default)
- [ ] Frostbound-tier Chilling Flow per-stack values (data_issues.md)
- [ ] Healer-relevant collars beyond the 3 in data (data_issues.md)

### Added from Healer Gate campaign (2026-07-10) — no screenshot in archive
- [ ] IL3150 Shirt: **Bloodwoven Ink (Butcher's Zeal)** (id 423) — Butcher's Zeal shirt variant, not captured.
- [ ] IL4700 Head: **Mask of the Vital Sigil** (id 383) — not captured.
- [ ] IL4700 Arms: **Vambraces of the Vital Sigil** (id 381) — not captured.
- [ ] IL3600 Shirt: **Mystic Conduit Seal — Healer's Influence** (id 457) — not captured.
- [ ] IL3600 Shirt: **Mystic Conduit Ink — Butcher's Precision (Lesser)** (id 461) — not captured.
- [ ] IL3350 Feet: **Luminstep Sabatons — Ruthless Resources** (id 518) — not captured.
- [ ] IL3000 Feet: **Mirestep Boots — Ruthless Resources** (id 530) — not captured.
- [ ] IL4900 Ring: **Deathsilver Band of Sacrifice** (id 315) — zero hits, Batch D.
- [ ] IL4300 Armor: **Cuirass of the Black Flame** (id 51) — zero hits, Batch D.
- [ ] IL4150 Ring: **The Claw of Covetous Flame** (id 79) — zero hits, Batch D.
- [ ] IL4100 Head: **Cowl of the Ashen Chant** (id 293) — zero hits, Batch D.
- [ ] IL4050 Arms: **Gauntlets of the Hierarch** (id 69) — zero hits, Batch D.
- [ ] IL4050 Armor: **Cuirass of the Ethralled Flame** (id 73) — zero hits, Batch D.
- [ ] IL3550 Arms: **Gauntlets of the Anointed** (id 304) — zero hits, Batch D.

### Companion owner-judgment questions (2026-07-10) — validator flagged, needs n00b's call
- [ ] power 110 Vallenhas Elite Soldier — zoom re-read needed: 11% vs 11.3% (screenshot legibility, not a scaling question).
- [ ] power 173 Grace Revoir — non-linear scaling: confirm 5%@750 vs 13.5%@900, reconcile via effectScaling (notes claim 13.5 is actually the 900 value; record's own IL is 750, math says 11.25 at 750 — needs owner confirmation, not guessed).
- [ ] power 184/185 Incubus/Succubus (Fiendish Charmer's Distraction / Succubus's Distraction) — in-game name splash ambiguous (card shows "Fiendish..." vs stored "Feywild/Succubus's..."), plus +0 CR anomaly and shared-kit companion identity; content values themselves are fine.
- [ ] power 193 Lillend — 18% (stored) vs 37.5%@375 (screenshot) heal, same tier — double the value, needs owner confirmation before touching (likely stored value is simply wrong, but not guessed here).
- [ ] power 259 Celeste — base value/IL pairing implausible as stored (20%@IL75 → over 100% at high tiers); screenshot reads 7.5%@IL375. Derive correct base value/IL pairing from the scaling model before applying.

### Follow-ups — Healer Gate campaign (2026-07-10)
- [ ] id 3154 (Vambraces of the Eternal Bloom, gear.json) — the "+15% Class Resource Max" sub-effect named in its equip-bonus prose is still unstructured; needs its own equipBonus entry later (percentOfPool pattern, per id 25/291-family precedent). Not attempted this batch per validator instruction.
- [ ] Repo-wide 94-item duplicate-placeholder dedup (see data_trust.md campaign note 2026-07-07/10) — this batch cleared the 27 healer-gate-relevant ids; the remaining ~67 non-healer-gate ids carrying the same stat:null-placeholder-plus-structured-sibling pattern are still open, campaign-level, out of this batch's scope.
- [ ] Ledger-vs-JSON drift check (Vampire's Kiss pattern) — Vampire's Kiss (power 92) had a data_trust.md ledger row saying CONFIRMED at 3.8% while the live JSON still said 3.6% (now fixed to 3.8% in this batch). Spot-check other CONFIRMED ledger rows against their live JSON values for the same silent-drift pattern.

## Owner rulings applied 2026-07-10 (held items closed)
- [x] Lillend 18→37.5% | Celeste re-anchor 7.5%@375 | Grace Revoir effectScaling 750:5/900:13.5 | Vallenhas 11→11.3% (card re-read)
- [ ] PS5 name-splash check: Incubus vs Succubus — whose power is "Fiendish Charmer's Distraction"? (content verified; name + per-companion identity only)

## Capture session 2026-07-10 — 9 of 15 Tier-4 items resolved
- [x] Captured + structured: 51, 73, 69, 315, 79, 423, 457, 461, 530 (see data_trust.md rows)
- [ ] STILL NEEDED (PS5): Gauntlets of the Anointed (304), Vambraces of the Vital Sigil (381), Mask of the Vital Sigil (383), Cowl of the Ashen Chant (293), Luminstep Sabatons — Ruthless Resources variant (518)
- [ ] STILL NEEDED (PS5): Incubus vs Succubus name-splash (whose power panel says "Fiendish Charmer's Distraction")
