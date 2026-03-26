/* ============================================================
   NWC Artifacts Page
   ============================================================ */
(function () {
  renderNav("Artifacts");

  // ============================================================
  // ALL ARTIFACTS DATA
  // ============================================================
  var artifacts = [
    // -- Group Debuff --
    { name: "Halaster's Blast Scepter", type: "debuff", power: "Single-target stun. Reduces target's damage resistance by 15% for 10s.", debuff: "15% damage resistance reduction", cooldown: 60, set: "Mad Dash", source: "Tower of the Mad Mage", image: "https://static.wikia.nocookie.net/neverwinter_gamepedia/images/b/b9/Icon_Inventory_Artifact_Halaster.png/revision/latest?cb=20191012233012" },
    { name: "Wyvern-Venom Coated Knives", type: "debuff", power: "AoE knives + poison DoT. Envenomated enemies take 12% more damage and deal 12% less damage for 10s.", debuff: "12% more damage taken + 12% less damage dealt", cooldown: 60, set: "Armaments of the Wyvern", source: "Undermountain Campaign" },
    { name: "Frozen Storyteller's Journal", type: "debuff", power: "25' AoE damage. Stuns 3s. Summons 3 ice dwarves (20s). Allies deal 10% more damage. Incoming damage reduced 10% for 15s.", debuff: "10% party damage buff + 10% damage reduction", cooldown: 60, set: "Storyteller's Journals", source: "Zen Market / Tales of Old" },
    { name: "Charm of the Serpent", type: "debuff", power: "Cone attack. Targets take 16% more damage for 10s.", debuff: "16% more damage taken (cone)", cooldown: 60, set: "Set of the Serpent", source: "Tomb of the Nine Gods" },
    { name: "Lantern of Revelation", type: "debuff", power: "AoE damage. Targets take 10% more damage for 10s. Reveals hidden enemies.", debuff: "10% more damage taken", cooldown: 60, set: "None", source: "Quest reward" },
    { name: "Thirst", type: "debuff", power: "Lunge forward dealing line damage. Enemies take 10% more damage for 10s.", debuff: "10% more damage taken (lunge)", cooldown: 60, set: "None", source: "Castle Ravenloft" },
    { name: "Heart of the Black Dragon", type: "debuff", power: "Line AoE acid damage to 7 enemies + DoT. Enemies take 10% more damage for 6s.", debuff: "10% more damage taken (6s)", cooldown: 60, set: "Hearts of the Dragons", source: "Dungeon drop" },
    { name: "Token of Chromatic Storm", type: "debuff", power: "9 chromatic meteors near target. Acid meteors cause 10% more damage taken for 10s. Fire = DoT, Ice = freeze.", debuff: "10% more damage taken (RNG acid)", cooldown: 60, set: "None", source: "Lockbox" },
    { name: "Sparkling Fey Emblem", type: "debuff", power: "Field for 15s. Enemies take 5% more damage. Allies gain 5% Defense and 5% Critical Avoidance.", debuff: "5% more damage + ally defense buffs", cooldown: 60, set: "Star Set", source: "Vault of Stars" },
    { name: "Vanguard's Banner", type: "debuff", power: "Banner for 30s. Allies gain 5,000 Power and 5,000 Crit Avoidance. Foes take 5% more damage.", debuff: "5% more damage + ally Power buff (30s)", cooldown: 60, set: "None", source: "PVP (40k Glory)" },
    { name: "Refulgent Diamond Pin", type: "debuff", power: "AoE damage. Enemies deal 5% less damage for 15s. Allies gain 7.5% Combat Advantage for 15s.", debuff: "5% less enemy damage + 7.5% ally CA", cooldown: 60, set: "Diamond Set", source: "Shattered Diamonds" },
    { name: "Tiamat's Orb of Majesty", type: "tank", power: "Stuns monsters 4s (players 2s). Reduces their damage by 15% for 6s.", debuff: "15% less enemy damage (6s) + stun", cooldown: 60, set: "Tiamat Set", source: "Rise of Tiamat" },
    { name: "Defender's Banner", type: "tank", power: "Banner for 30s. Allies gain 5,000 Power and 5,000 Awareness. Foes deal 5% less damage.", debuff: "5% less enemy damage + ally buffs (30s)", cooldown: 60, set: "None", source: "PVP (40k Glory)" },
    { name: "Erratic Drift Globe", type: "tank", power: "Orbit for 15s. Allies gain 15,000 Deflection. Foes lose 15,000 Crit Strike and 15,000 Deflection.", debuff: "Stat shred on enemies", cooldown: 60, set: "Reflective Armaments", source: "Undermountain Campaign" },
    // -- Personal DPS --
    { name: "Soul Sight Crystal", type: "personal", power: "Target takes 25% more damage from YOUR attacks only for 10s.", debuff: "25% personal damage buff (solo only)", cooldown: 60, set: "None", source: "Quest reward" },
    { name: "Arcturia's Music Box", type: "personal", power: "Summons 2 mimics dealing AoE damage. Consumes minions on hit.", debuff: "None (set bonus is the value)", cooldown: 60, set: "Apprentices' Spoils", source: "Zok boxes (Undermountain)" },
    { name: "Decanter of Atropal Essence", type: "personal", power: "Boon of Atropal for 20s. Powers deal extra damage per hit. Each proc: +1s duration, +1% damage, up to 10 stacks (10%).", debuff: "10% personal damage ramp", cooldown: 60, set: "Soulmonger Set", source: "Tomb of Annihilation" },
    { name: "Sigil of the Barbarian", type: "personal", power: "AoE damage. YOUR damage and mitigation +14% for up to 16s (scales with targets hit).", debuff: "14% personal damage + mitigation", cooldown: 60, set: "None", source: "Vault of the Nine (Barbarian)" },
    { name: "Wheel of Elements", type: "personal", power: "4 elemental symbols. Fire: +5% bonus fire damage for 30s. Earth: 100% HP shield 5s. Water: heal 50% HP over 30s. Wind: CC immunity.", debuff: "5% fire damage (if correct symbol)", cooldown: 60, set: "None", source: "Elemental Evil" },
    { name: "Eye of the Giant", type: "personal", power: "+5,000 Power and Defense for 12s. +1,000 per enemy (up to 5). At 5+ enemies: icy blast.", debuff: "Scaling self-buff", cooldown: 60, set: "None", source: "Storm King's Thunder" },
    // -- Tank / Mitigation --
    { name: "Horn of Valhalla", type: "tank", power: "Summons Barbarian for 30s. When enemies attack you, their damage -3% for 6s, stacks 5x (15% max).", debuff: "15% stacking enemy damage reduction", cooldown: 60, set: "Valhalla's Rebuke", source: "Assault on Svardborg" },
    { name: "Sigil of the Paladin", type: "tank", power: "Protective field for 10s. Allies inside gain 15% damage resistance + HoT.", debuff: "15% ally damage resistance", cooldown: 60, set: "None", source: "Vault of the Nine (Paladin)" },
    { name: "Sigil of the Fighter", type: "tank", power: "Blocks 90% of next attack (up to 25% max HP) every second for 10s.", debuff: "90% block (self)", cooldown: 60, set: "None", source: "Vault of the Nine (Fighter)" },
    { name: "Forgehammer of Gond", type: "tank", power: "Damage taken halved (50% reduction) for 5s.", debuff: "50% damage reduction (5s)", cooldown: 60, set: "None", source: "Wonders of Gond" },
    { name: "Gond's Anvil of Creation", type: "tank", power: "Shield for 15% of max HP. Regenerates every 3s for 15s.", debuff: "Regenerating shield", cooldown: 60, set: "None", source: "Wonders of Gond" },
    // -- Utility / Healing --
    { name: "Sigil of the Cleric", type: "utility", power: "Fills 25% of Action Points over 15s. Heals on Encounter power use.", debuff: "AP generation + self heal", cooldown: 60, set: "None", source: "Vault of the Nine (Cleric)" },
    { name: "Staff of Flowers", type: "utility", power: "Ring of flowers for 15s. Allies gain 15,000 Power and 15,000 Crit Strike. Foes slowed 25% + poison DoT.", debuff: "Ally Power + Crit buff zone", cooldown: 60, set: "Enchanted Thumb", source: "Zok boxes (Undermountain)" },
    { name: "Bloodcrystal Raven Skull", type: "utility", power: "Shield = 10% max HP + 110% missing HP. Single-target heals buff target's Power and Accuracy by 5% for 5s.", debuff: "Shield + heal buff", cooldown: 60, set: "None", source: "Dungeon drop" },
    { name: "Eye of Lathander", type: "utility", power: "Resurrects ally or companion at 80' range. Restores 80% HP.", debuff: "Long-range resurrect", cooldown: 60, set: "Lathander Set", source: "Dread Ring / Tiamat" },
    { name: "Oghma's Token of Free Movement", type: "utility", power: "Removes control effects. CC immunity for 6s. Deals damage.", debuff: "CC break + immunity", cooldown: 60, set: "None", source: "Lockbox" },
    { name: "Waters of Elah'zad", type: "utility", power: "Self-heal over 6s. Removes DoT effects. Not affected by PvP healing depression.", debuff: "Self-heal + DoT cleanse", cooldown: 60, set: "None", source: "Quest reward" },
    { name: "Aurora's Whole Realms Catalogue", type: "utility", power: "Out of combat: summons vendor. In combat: fire damage + stun.", debuff: "Portable vendor", cooldown: 60, set: "None", source: "Quest reward" },
    // -- Damage Only --
    { name: "Lostmauth's Horn of Blasting", type: "damage", power: "Cone damage + knockback.", debuff: "None", cooldown: 60, set: "Lostmauth's Hoard", source: "Lair of Lostmauth" },
    { name: "Book of Vile Darkness", type: "damage", power: "Reduces cooldowns 1-2s. Slows nearby enemies.", debuff: "None", cooldown: 60, set: "Dark Remnant", source: "Infernal Citadel" },
    { name: "Trobriand's Ring", type: "damage", power: "Electric stun + damage. Spawns Scaladar for 15s.", debuff: "None", cooldown: 60, set: "Armaments of Construct Demise", source: "Lair of the Mad Mage" },
    { name: "Apocalypse Dagger", type: "damage", power: "25' AoE damage.", debuff: "None (set bonus: stacking 5% group debuff on crit)", cooldown: 60, set: "Apocalypse Set", source: "Manycoins Bank Heist" },
    { name: "Shard of Orcus' Wand", type: "damage", power: "Pursuing orb deals damage. Explodes after 5 hits or 15s.", debuff: "None", cooldown: 60, set: "Demon Lords' Immortality", source: "Castle Never" },
    { name: "Sword of Zariel", type: "damage", power: "Celestial swords rain on target. Bleed DoT 12s.", debuff: "None", cooldown: 60, set: "None", source: "Avernus content" },
    { name: "Tarokka Deck", type: "damage", power: "Draw 3 random cards with different effects (damage, heal, buff).", debuff: "None", cooldown: 60, set: "Vistani Set", source: "Barovia / Ravenloft" },
    // -- Sigils --
    { name: "Sigil of the Warlock", type: "utility", power: "Damages up to 5 targets. Heals you per target hit.", debuff: "Self-heal on hit", cooldown: 60, set: "None", source: "Vault of the Nine (Warlock)" },
    { name: "Sigil of the Wizard", type: "damage", power: "Pushes enemies + ice root for 1.5s.", debuff: "CC push + root", cooldown: 60, set: "None", source: "Vault of the Nine (Wizard)" },
    { name: "Sigil of the Ranger", type: "damage", power: "Rain of arrows + bramble thorns AoE.", debuff: "None", cooldown: 60, set: "None", source: "Vault of the Nine (Ranger)" },
    { name: "Sigil of the Rogue", type: "damage", power: "Teleport to enemy within 40'. Cone knife spray.", debuff: "None", cooldown: 60, set: "None", source: "Vault of the Nine (Rogue)" },
    // -- Dragon Hearts --
    { name: "Heart of the Blue Dragon", type: "damage", power: "Lightning line to 7 enemies + chain. +2,550 Defense 8s.", debuff: "None", cooldown: 60, set: "Hearts of the Dragons", source: "Dragon content" },
    { name: "Heart of the Red Dragon", type: "damage", power: "AoE fire to 7 enemies + fire DoT 4s. +2,550 Defense 8s.", debuff: "None", cooldown: 60, set: "Hearts of the Dragons", source: "Dragon content" },
    { name: "Heart of the Green Dragon", type: "damage", power: "Poison AoE + poison cloud DoT 13s. +2,550 Defense 8s.", debuff: "None", cooldown: 60, set: "Hearts of the Dragons", source: "Dragon content" },
    { name: "Heart of the White Dragon", type: "damage", power: "Cone cold to 7 enemies + slow 6.3s. +2,550 Defense 8s.", debuff: "None", cooldown: 60, set: "Hearts of the Dragons", source: "Dragon content" },
    // -- Elemental Symbols --
    { name: "Symbol of Air", type: "utility", power: "Teleport 40' + AoE damage. If no enemies: +30% movement speed 5s.", debuff: "Teleport / escape", cooldown: 60, set: "None", source: "Elemental Evil" },
    { name: "Symbol of Fire", type: "damage", power: "Spreading fire on target. Activate again for AoE fire burst.", debuff: "None", cooldown: 60, set: "None", source: "Elemental Evil" },
    { name: "Symbol of Water", type: "damage", power: "Maelstrom pulls enemies in. Damage over 5s + final burst.", debuff: "None", cooldown: 60, set: "None", source: "Elemental Evil" },
    { name: "Symbol of Earth", type: "damage", power: "Earthmote drops on target. Knockback + ring damage.", debuff: "None", cooldown: 60, set: "None", source: "Elemental Evil" },
    // -- Misc --
    { name: "Shard of Valindra's Crown", type: "utility", power: "Two swipes of Valindra's hand. Immune to damage and control while casting.", debuff: "Self-immunity during cast", cooldown: 60, set: "None", source: "Dungeon content" },
    { name: "Fragmented Key of Stars", type: "damage", power: "Summons Far Realm Horror dealing AoE damage + knockback.", debuff: "None", cooldown: 60, set: "None", source: "Cloaked Ascendancy" },
    { name: "Kessell's Spheres of Annihilation", type: "damage", power: "8 spheres orbit damaging enemies on contact.", debuff: "None", cooldown: 60, set: "None", source: "Kessell's Retreat" },
    { name: "Black Ice Beholder", type: "damage", power: "Illusory Beholder moves forward attacking. Explodes after 10s.", debuff: "None", cooldown: 60, set: "None", source: "Icewind Dale" },
    { name: "Bruenor's Helm", type: "utility", power: "Summons Throne. Allies gain +378 Defense and Crit Avoidance. Foes slowed 25% (demons 50%).", debuff: "Ally defense + slow", cooldown: 60, set: "None", source: "Promotional" },
    { name: "Skull Lord Staff", type: "damage", power: "Tri-point attack. On kill: chance to summon skeleton for 15s.", debuff: "None", cooldown: 60, set: "None", source: "Dungeon content" },
    { name: "Memories (Redeemed)", type: "utility", power: "Grants 3% Incoming Healing. When healed: +5% Power for 6s.", debuff: "Healing + Power buff", cooldown: 60, set: "Redeemed Set", source: "Redeemed Citadel event" },
    // -- Storyteller Journals --
    { name: "Flayed Storyteller's Journal", type: "personal", power: "25' AoE + stun 3s. +5% damage after 15s. Summons intellect devourer. +10% Deflect 20s.", debuff: "5% personal damage + Deflect", cooldown: 60, set: "Storyteller's Journals", source: "Zen Market / Tales of Old" },
    { name: "Envenomed Storyteller's Journal", type: "personal", power: "25' AoE + stun 3s. +5% weapon damage per stack. +5% damage. Generates 20 AP/s for 15s.", debuff: "5% damage + AP gen", cooldown: 60, set: "Storyteller's Journals", source: "Zen Market / Tales of Old" },
    { name: "Darkened Storyteller's Journal", type: "personal", power: "25' AoE + stun 3.2s. +5% necrotic weapon damage per stack. -5,000 enemy Armor Pen.", debuff: "5% necrotic damage + enemy ArP shred", cooldown: 60, set: "Storyteller's Journals", source: "Zen Market / Tales of Old" },
    // -- Newly discovered artifacts --
    { name: "Demogorgon's Reach", type: "debuff", power: "Summons 6 tentacles over 6s. Struck foes gain Rotting for 6s: +3% damage taken per stack, -5% incoming healing per stack. Stacks up to 6x (max 18% more damage taken).", debuff: "18% stacking group debuff", cooldown: 60, set: "None", source: "Demogorgon (Master)" },
    { name: "Vision of Lolth", type: "debuff", power: "Summons Vision for 10s in 20' radius. DoT 115 mag/s. Allies gain 1 stack every 0.5s: +1.5% Power, +1.5% Crit Severity, +0.75% Defense, +0.75% Awareness. Up to 20 stacks (max +30% Power/Crit Sev, +15% Def/Awareness).", debuff: "30% Power/Crit Sev + 15% Def/Awareness party buff", cooldown: 60, set: "None", source: "Demonweb Pits (Mod 26)" },
    { name: "Dragonbone Blades", type: "debuff", power: "Throws blades dealing Necrotic damage + DoT every 1s for 10s. Enemies take 12% more damage and deal 12% less damage.", debuff: "12% more damage taken + 12% less damage dealt", cooldown: 60, set: "None", source: "Lockbox" },
    { name: "Mythallar Fragment", type: "debuff", power: "Arcane blast, stuns target. Target's damage resistance lowered by 15% for duration.", debuff: "15% damage resistance reduction", cooldown: 60, set: "None", source: "Dragonbone Vale Campaign" },
    { name: "Jewel of the North", type: "debuff", power: "Lunge forward dealing line damage. Targets take 10% more damage for 10s. Passive: 15% more/less threat based on role.", debuff: "10% more damage taken", cooldown: 60, set: "None", source: "Echoes of Prophecy Battle Pass" },
    { name: "Tentacle Rod", type: "debuff", power: "Damages 4 times, dazes 6.1s. Enemies lose 5% Movement Speed, 5% Awareness, take 5% more damage from party for 10s.", debuff: "5% more damage + stat shred", cooldown: 60, set: "None", source: "Lockbox" },
    { name: "Neverwinter's Standard", type: "debuff", power: "Banner for 15s. Allies gain 5% Recharge Speed. Foes take 5% more damage.", debuff: "5% more damage + ally Recharge Speed", cooldown: 60, set: "None", source: "Promotional" },
    { name: "Tome of Ascendance", type: "utility", power: "4 random spell glyphs on ground. Allies consume for 15s buff: Fey = 10% less damage taken + 15% Healing/Speed. Illusion = Stealth + 15% enemy Defense reduction. Aboleth/Fireforged = damage bonuses.", debuff: "10-15% buffs (RNG-dependent)", cooldown: 60, set: "None", source: "Many-Starred Lockbox" },
    { name: "Assassin's Dice", type: "debuff", power: "Throw dice at enemy. Target marked for 15s: -5% Critical Chance, -5% Critical Avoidance, -5% Deflect Severity.", debuff: "-5% Crit/CA/Deflect Sev on target", cooldown: 60, set: "None", source: "Lockbox" },
    { name: "Empowered Illusionist's Mask", type: "personal", power: "Gaze deals damage, polymorphs enemies. You deal up to 15% more damage against transformed targets for up to 15s.", debuff: "15% personal damage vs transformed", cooldown: 60, set: "None", source: "Masquerade of Liars event" },
    { name: "Golden Memories", type: "personal", power: "Radiant AoE in 20'. +3% damage per enemy hit for 6s, stacks up to 5x (max 15% self-damage).", debuff: "15% personal damage ramp", cooldown: 60, set: "None", source: "Promotional" },
    { name: "Alaric's Artillery Beacon", type: "debuff", power: "AoE damage (50' range, 20' radius), stun up to 4s. Enemies take up to 5% more damage for 10s.", debuff: "5% more damage taken + stun", cooldown: 60, set: "None", source: "First Contact Battle Pass" },
    { name: "Tiamat's Arcane Globe", type: "tank", power: "Restores 75 stamina. Passive: when stamina below 15%, 8% damage reduction + 8% Critical Avoidance for 10s (20s CD).", debuff: "8% damage reduction (conditional)", cooldown: 60, set: "Tiamat's Prized Possessions", source: "Rise of Tiamat (Master)" },
    { name: "Tactician's Banner", type: "utility", power: "Banner for 30s. Allies gain 25% Movement Speed and 5% faster AP gain. Foes gain AP 5% slower.", debuff: "25% ally Movement Speed + 5% AP Gain", cooldown: 60, set: "None", source: "PVP (40k Glory)" },
    { name: "Champion's Banner", type: "tank", power: "Banner for 30s. Allies gain 5% Incoming Healing and 2,500 Accuracy. Foes deal 5% less damage.", debuff: "5% less enemy damage + ally heals", cooldown: 60, set: "None", source: "PVP (40k Glory)" },
    { name: "Siegebreaker's Banner", type: "utility", power: "Banner for 30s. Allies gain 2,500 Crit Avoidance, 2,500 Armor Penetration, 5% Recharge Speed.", debuff: "Ally stat buffs (30s)", cooldown: 60, set: "None", source: "Siege of Neverwinter" },
    { name: "Red Dragon's Mark", type: "personal", power: "Fireball + knockdown. Passive: on Encounter use, gain 2.5% Combat Advantage + 5% Movement Speed for 5s, stacks 3x (7.5% CA).", debuff: "7.5% CA passive (stacking)", cooldown: 60, set: "Aggressive Alacrity", source: "Dragonslayer Campaign" },
    { name: "Black Dragon's Mark", type: "debuff", power: "Acid ball dealing damage. Decreases target damage resistance by 10%.", debuff: "10% damage resistance reduction", cooldown: 60, set: "None", source: "Dragonslayer Campaign" },
    { name: "White Dragon's Mark", type: "utility", power: "Cold ball + slow. Passive: on Encounter use, gain 2.5% Critical Strike + 5% Incoming Healing for 5s, stacks 3x.", debuff: "7.5% Crit Strike passive", cooldown: 60, set: "Celestial Alacrity", source: "Dragonslayer Campaign" },
    { name: "Green Dragon's Mark", type: "personal", power: "Poison ball + DoT. Passive: on Encounter use, gain 2.5% Crit Severity + 5% Movement Speed for 5s, stacks 3x (7.5% Crit Sev).", debuff: "7.5% Crit Severity passive", cooldown: 60, set: "Insightful Alacrity", source: "Dragonslayer Campaign" },
    { name: "Blue Dragon's Mark", type: "personal", power: "Lightning ball + stun. Passive: on Encounter use, gain stat buff for 5s, stacks 3x.", debuff: "Stacking passive buff", cooldown: 60, set: "Vanguard's Alacrity", source: "Dragonslayer Campaign" },
    { name: "Sigil of the Nine", type: "debuff", power: "Spirits of the Nine attack, dealing damage + root 4.5s. Allies' damage increased 3% for 9s.", debuff: "3% ally damage buff", cooldown: 60, set: "None", source: "Lockbox" },
    { name: "Thayan Book of the Dead", type: "personal", power: "Summons 3 undead + root 2s + necrotic DoT. Passive: on dodge/block/sprint, +5% Power + 5% Movement Speed for 10s (45s CD).", debuff: "5% Power passive", cooldown: 60, set: "Set of the Dead", source: "Dread Ring" },
    { name: "Emblem of the Seldarine", type: "utility", power: "Buffs allies with Seldarine's Blessing for 15s: healed for 4,816 HP every time hit (1/s max).", debuff: "Party HoT on hit", cooldown: 60, set: "Seldarine Set", source: "Malabog's Castle" },
    { name: "Belial's Portal Stone", type: "damage", power: "Summons portal that generates threat. Explodes after 20s for massive AoE damage.", debuff: "None", cooldown: 60, set: "None", source: "Lockbox" },
    { name: "Sphere of Black Ice", type: "damage", power: "Roots target 3s + damage/s. After 3s, explodes dealing AoE damage.", debuff: "Root + AoE", cooldown: 60, set: "None", source: "Frozen Crystal Lockbox" },
    { name: "Champion's Battle Horn", type: "tank", power: "Grants 5,494 Temp HP for 8s + 50% Run Speed for 3s. When taking damage, CD reduced by 1s.", debuff: "Temp HP + speed burst", cooldown: 60, set: "None", source: "Siege of Neverwinter" },
    { name: "Beacon of Simril", type: "utility", power: "6 lanterns fall over 15s. Allies catch for heal. At 6 stacks: gain Power buff for 30s.", debuff: "Party heal + Power buff", cooldown: 60, set: "None", source: "Winter Festival" },
    { name: "Flask of Brewing", type: "damage", power: "Throws burning brew at 60' range, AoE puddle for 10-15s. Passive: at combat start +1,000 Power + 5% Movement Speed for 10s.", debuff: "None", cooldown: 60, set: "None", source: "Festival event" },
    { name: "Illusionist's Mask", type: "utility", power: "Become illusion of random monster for 5s, significantly reducing threat.", debuff: "Threat drop", cooldown: 60, set: "None", source: "Masquerade of Liars" },
    { name: "Crown of the Undead", type: "utility", power: "When using Daily, pulls enemies within 20' towards you, stuns undead 3s.", debuff: "Pull + undead stun", cooldown: 30, set: "None", source: "Dread Ring" },
    { name: "Manticore Talon", type: "damage", power: "Leap to location, summon avalanche dealing damage + pushback over 4s.", debuff: "None", cooldown: 60, set: "None", source: "Manticore content" },
    { name: "Rod of Imperial Restraint", type: "utility", power: "Hold target 4s (2s vs players). Creates 3 hold zones.", debuff: "CC hold", cooldown: 60, set: "None", source: "Stronghold Siege" },
    { name: "Siege Master's War Horn", type: "damage", power: "Calls catapult bombardment on target area. Each teammate with one adds a catapult (max 5).", debuff: "None", cooldown: 60, set: "None", source: "Siege of Neverwinter" },
  ];

  // ============================================================
  // TRIAL RANKING
  // ============================================================
  var trialRanking = [
    { rank: 1, name: "Vision of Lolth", effect: "Stacking party buff: up to +30% Power/Crit Severity, +15% Defense/Awareness", duration: "10s" },
    { rank: 2, name: "Demogorgon's Reach", effect: "Stacking debuff: +3% damage taken per stack, up to 18% (6 stacks)", duration: "6s per stack" },
    { rank: 3, name: "Charm of the Serpent", effect: "+16% damage taken by enemies (cone)", duration: "10s" },
    { rank: 4, name: "Halaster's Blast Scepter", effect: "-15% enemy damage resistance", duration: "10s" },
    { rank: 5, name: "Mythallar Fragment", effect: "-15% enemy damage resistance", duration: "10s" },
    { rank: 6, name: "Wyvern-Venom Coated Knives", effect: "+12% damage taken, -12% enemy damage dealt", duration: "10s" },
    { rank: 7, name: "Dragonbone Blades", effect: "+12% damage taken, -12% enemy damage dealt", duration: "10s" },
    { rank: 8, name: "Frozen Storyteller's Journal", effect: "+10% ally damage, -10% incoming damage, stun, summons", duration: "15s" },
    { rank: 9, name: "Lantern of Revelation", effect: "+10% damage taken by enemies", duration: "10s" },
    { rank: 10, name: "Thirst", effect: "+10% damage taken by enemies (lunge)", duration: "10s" },
    { rank: 11, name: "Heart of the Black Dragon", effect: "+10% damage taken by enemies", duration: "6s" },
    { rank: 12, name: "Black Dragon's Mark", effect: "-10% enemy damage resistance", duration: "10s" },
    { rank: 13, name: "Vanguard's Banner", effect: "+5% damage taken, +5,000 ally Power", duration: "30s" },
    { rank: 14, name: "Sparkling Fey Emblem", effect: "+5% damage taken, +5% ally Defense/Crit Avoidance", duration: "15s" },
    { rank: 15, name: "Refulgent Diamond Pin", effect: "-5% enemy damage, +7.5% ally Combat Advantage", duration: "15s" },
  ];

  // ============================================================
  // DUNGEON RANKING
  // ============================================================
  var dungeonRanking = [
    { rank: 1, name: "Vision of Lolth", effect: "Stacking party buff: up to +30% Power/Crit Severity, +15% Defense/Awareness", duration: "10s" },
    { rank: 2, name: "Demogorgon's Reach", effect: "Stacking debuff: +3% damage taken per stack, up to 18% (6 stacks)", duration: "6s per stack" },
    { rank: 3, name: "Charm of the Serpent", effect: "+16% damage taken by enemies (cone)", duration: "10s" },
    { rank: 4, name: "Halaster's Blast Scepter", effect: "-15% enemy damage resistance", duration: "10s" },
    { rank: 5, name: "Mythallar Fragment", effect: "-15% enemy damage resistance", duration: "10s" },
    { rank: 6, name: "Frozen Storyteller's Journal", effect: "+10% ally damage, -10% incoming damage, stun, summons", duration: "15s" },
    { rank: 7, name: "Wyvern-Venom Coated Knives", effect: "+12% damage taken, -12% enemy damage dealt", duration: "10s" },
    { rank: 8, name: "Dragonbone Blades", effect: "+12% damage taken, -12% enemy damage dealt", duration: "10s" },
    { rank: 9, name: "Lantern of Revelation", effect: "+10% damage taken by enemies", duration: "10s" },
    { rank: 10, name: "Thirst", effect: "+10% damage taken by enemies (lunge)", duration: "10s" },
    { rank: 11, name: "Heart of the Black Dragon", effect: "+10% damage taken by enemies", duration: "6s" },
    { rank: 12, name: "Black Dragon's Mark", effect: "-10% enemy damage resistance", duration: "10s" },
    { rank: 13, name: "Vanguard's Banner", effect: "+5% damage taken, +5,000 ally Power", duration: "30s" },
    { rank: 14, name: "Defender's Banner", effect: "-5% enemy damage, +5,000 ally Power/Awareness", duration: "30s" },
    { rank: 15, name: "Sparkling Fey Emblem", effect: "+5% damage taken, +5% ally Defense/Crit Avoidance", duration: "15s" },
  ];

  // ============================================================
  // ARTIFACT SETS
  // ============================================================
  var artifactSets = [
    { name: "Apprentices' Spoils", pieces: "Arcturia's Music Box + Jhesiyra's Tattered Mantle + Trobriand's Conduction Cable", bonus: "When you use a Daily Power, deal 15% more damage vs monsters not facing you for 10s.", best: "DPS (Best in Slot)" },
    { name: "Armaments of the Wyvern", pieces: "Wyvern-Venom Coated Knives + Wyvern's Eye Necklace + Wyvern-Skin Belt", bonus: "Daily Power creates Rune of Aggression: allies gain +5% Power, +5% Crit Severity, +5% damage for 6s.", best: "Support DPS" },
    { name: "Reflective Armaments", pieces: "Erratic Drift Globe + Reflective Collar + Mirror-Plated Belt", bonus: "Daily Power creates Rune of Fortification: allies gain +5% Defense, +5% Deflect, -5% damage taken for 6s.", best: "Support Tank" },
    { name: "Enchanted Thumb", pieces: "Staff of Flowers + Woven Vine + Blooming Cord", bonus: "Daily Power creates Rune of Cooperation: allies gain +5% Awareness, +5% CA, CC immunity for 6s.", best: "Support" },
    { name: "Valhalla's Rebuke", pieces: "Horn of Valhalla + Cloak of Valhalla + Belt of Valhalla", bonus: "When foe hits you, they deal 1% less damage for 6s, stacks 5x (5% max).", best: "Tank (Best in Slot)" },
    { name: "Tiamat", pieces: "Tiamat's Orb of Majesty + Amulet of Tiamat's Demise + Tiamat Sash", bonus: "+5% Outgoing Healing and +5% Incoming Healing.", best: "Healer (Best in Slot)" },
    { name: "Dark Remnant", pieces: "Book of Vile Darkness + Engine Master's Mantle + Whip of the Erinyes", bonus: "+5% damage vs demons/devils/fiends, +2.5% vs others.", best: "DPS (Avernus/IC)" },
    { name: "Lostmauth's Hoard", pieces: "Lostmauth's Horn + Lostmauth's Hoard Necklace + Golden Belt of Puissance", bonus: "On crit, additional hit equal to your Damage stat.", best: "DPS (crit builds)" },
    { name: "Apocalypse", pieces: "Apocalypse Dagger + Apocalypse Choker + Apocalypse Bindings", bonus: "On crit, target takes +1% more damage for 5s, stacks 5x (5% group debuff).", best: "Support" },
    { name: "Star Set", pieces: "Sparkling Fey Emblem + Starshard Choker + Twinkle of the Stars", bonus: "Up to 10% additional damage or healing based on HP% difference.", best: "DPS / Healer" },
    { name: "Demon Lords' Immortality", pieces: "Shard of Orcus' Wand + Baphomet's Infernal Talisman + Demogorgon's Girdle", bonus: "Up to 10% additional damage based on HP% difference.", best: "DPS (budget)" },
    { name: "Mad Dash", pieces: "Halaster's Blast Scepter + Necklace/Belt of the Mad Mage", bonus: "Stand still 3s: +5% damage and movement speed.", best: "DPS (situational)" },
    { name: "Set of the Serpent", pieces: "Charm of the Serpent + Skin of the Serpent + Wrap of the Serpent", bonus: "Moving 3s: +1% damage, up to 5% after 15s. Resets standing still 5s.", best: "DPS (hard to use)" },
    { name: "Diamond Set", pieces: "Refulgent Diamond Pin + Iridescent Diamond Pendant + Scintilliant Diamond Buckle", bonus: "Stand still 3s: -5% damage taken, +5% Awareness.", best: "Tank (situational)" },
    { name: "Armaments of Construct Demise", pieces: "Trobriand's Ring + Electric Collar + Chained Restraints", bonus: "Daily Power: +5% damage, -5% damage taken for 10s.", best: "Hybrid" },
    { name: "Vistani", pieces: "Tarokka Deck + Vistani Pendant + Vistani Raiments", bonus: "Single-target AoE: target takes +5% damage for 5s.", best: "Tank support" },
    { name: "Soulmonger", pieces: "Decanter of Atropal Essence + Mantle/Cincture of Atropal Essence", bonus: "On heal: Temp HP = 25% of heal, up to 5% max HP (30s CD).", best: "Tank sustain" },
    { name: "Storyteller's Journals", pieces: "2-3 of 4 Journals", bonus: "2pc: +1 all ability scores, +0.5% Power, +5k HP per journal. 3pc: Crit = bonus damage hit.", best: "DPS (expensive)" },
    { name: "Hearts of the Dragons", pieces: "Any 3 of 5 Dragon Hearts", bonus: "+10% Recharge Speed.", best: "Cooldown builds" },
    { name: "Lathander", pieces: "Eye of Lathander + Lathander's Cloak + Greater Lathander's Belt", bonus: "On revive: allies heal 50% HP, +1% Awareness, injury immunity.", best: "Niche" },
    { name: "Redeemed", pieces: "Memories + Divine Focus + Celestial Sash", bonus: "+3% Incoming Healing. When healed: +5% Power for 6s.", best: "Healer (rare)" },
  ];

  // ============================================================
  // RENDERING
  // ============================================================
  var searchInput = document.getElementById("search");
  var filterType = document.getElementById("filter-type");
  var allControls = document.getElementById("all-controls");

  var typeLabels = { debuff: "Group Debuff", personal: "Personal DPS", tank: "Tank / Mitigation", utility: "Utility / Healing", damage: "Damage Only" };
  var typeBadgeClass = { debuff: "stat-negative", personal: "stat-positive", tank: "stat-neutral", utility: "stat-neutral", damage: "stat-positive" };

  function renderAllArtifacts() {
    var query = searchInput.value.trim().toLowerCase();
    var typeVal = filterType.value;

    var filtered = artifacts.filter(function (a) {
      if (query && (a.name + " " + a.power + " " + a.set).toLowerCase().indexOf(query) === -1) return false;
      if (typeVal && a.type !== typeVal) return false;
      return true;
    });

    var html = "";
    for (var i = 0; i < filtered.length; i++) {
      var a = filtered[i];
      html += '<div class="art-card" data-idx="' + i + '">';
      html += '<div class="art-card-header">';
      html += '<span class="art-card-name">' + escapeHtml(a.name) + '</span>';
      html += '<span><span class="' + (typeBadgeClass[a.type] || '') + '" style="font-size:0.78rem;">' + (typeLabels[a.type] || a.type) + '</span> <span class="toggle-arrow">&#9654;</span></span>';
      html += '</div>';
      html += '<div class="art-card-body">';
      if (a.image) {
        html += '<img class="art-icon" src="' + escapeHtml(a.image) + '" alt="' + escapeHtml(a.name) + '">';
      }
      html += '<div class="art-effect">' + escapeHtml(a.power) + '</div>';
      if (a.debuff && a.debuff !== "None") {
        html += '<div class="art-info-row"><span class="art-info-label">Buff/Debuff</span><span class="art-info-value">' + escapeHtml(a.debuff) + '</span></div>';
      }
      html += '<div class="art-info-row"><span class="art-info-label">Cooldown</span><span class="art-info-value">' + a.cooldown + 's</span></div>';
      if (a.set && a.set !== "None") {
        html += '<div class="art-info-row"><span class="art-info-label">Set</span><span class="art-info-value">' + escapeHtml(a.set) + '</span></div>';
      }
      html += '<div class="art-info-row"><span class="art-info-label">Source</span><span class="art-info-value">' + escapeHtml(a.source) + '</span></div>';
      html += '</div></div>';
    }
    document.getElementById("all-list").innerHTML = html || '<div class="empty-state">No artifacts match your filters</div>';
  }

  function renderRanking(data, containerId) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
      var r = data[i];
      html += '<div class="rank-card">';
      html += '<div style="font-weight:600;"><span style="color:var(--highlight);margin-right:0.5rem;">#' + r.rank + '</span>' + escapeHtml(r.name) + '</div>';
      html += '<div class="art-effect" style="margin-top:0.4rem;">' + escapeHtml(r.effect) + '</div>';
      html += '<div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.25rem;">Duration: ' + r.duration + '</div>';
      html += '</div>';
    }
    document.getElementById(containerId).innerHTML = html;
  }

  function renderSets() {
    var html = "";
    for (var i = 0; i < artifactSets.length; i++) {
      var s = artifactSets[i];
      html += '<div class="art-card" data-idx="' + i + '">';
      html += '<div class="art-card-header">';
      html += '<span class="art-card-name">' + escapeHtml(s.name) + '</span>';
      html += '<span style="font-size:0.78rem;color:var(--text-muted);">' + escapeHtml(s.best) + ' <span class="toggle-arrow">&#9654;</span></span>';
      html += '</div>';
      html += '<div class="art-card-body">';
      html += '<div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.4rem;">' + escapeHtml(s.pieces) + '</div>';
      html += '<div class="art-set">' + escapeHtml(s.bonus) + '</div>';
      html += '</div></div>';
    }
    document.getElementById("sets-list").innerHTML = html;
  }

  // ============================================================
  // TAB SWITCHING
  // ============================================================
  var tabs = document.querySelectorAll(".view-tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");
      document.querySelectorAll(".art-view").forEach(function (v) { v.classList.remove("active"); });
      document.getElementById("view-" + tab.getAttribute("data-tab")).classList.add("active");
      allControls.style.display = tab.getAttribute("data-tab") === "all" ? "" : "none";

      if (tab.getAttribute("data-tab") === "trial") renderRanking(trialRanking, "trial-list");
      if (tab.getAttribute("data-tab") === "dungeon") renderRanking(dungeonRanking, "dungeon-list");
      if (tab.getAttribute("data-tab") === "sets") renderSets();
    });
  });

  // ============================================================
  // EVENT HANDLERS
  // ============================================================
  document.querySelectorAll(".art-container").forEach(function (container) {
    container.addEventListener("click", function (e) {
      var card = e.target.closest(".art-card");
      if (card) card.classList.toggle("open");
    });
  });

  searchInput.addEventListener("input", renderAllArtifacts);
  filterType.addEventListener("change", renderAllArtifacts);

  // Initial render
  renderAllArtifacts();
})();
