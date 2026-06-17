// Companion active skills — reference lookup for the Companions Lookup detail panel.
// Hand-curated from the community Companion Skills sheet (docs/reference/sheets/
// sheet1__Companion_Skills.csv). Keyed by LOWERCASE companion name.
// NOT built by build-data.py — edit directly or regenerate from the skills sheet.

const COMPANION_SKILLS = {
  "abyssal chicken": [
    {
      "name": "Bite",
      "text": "Bites the target, dealing physical damage."
    },
    {
      "name": "Focused Cry",
      "text": "Increases the duration of swarm and allows it to affect an additional target."
    },
    {
      "name": "Rake",
      "text": "Rakes at all enemies in front of her causing them to take Damage Over Time through a Bleed effect if they have combat advantage."
    },
    {
      "name": "Swarm",
      "text": "Causes a swarm of abyssal chickens, attacking your target."
    }
  ],
  "acolyte of kelemvor": [
    {
      "name": "Blessings of Kelemvor",
      "text": "Shields target ally, reducing damage taken by 10%."
    },
    {
      "name": "Kelemvor's Retribution",
      "text": "Blessings of Kelemvor now lasts twice as long and Kelmvor's Sword now heals you."
    },
    {
      "name": "Kelemvor's Sword",
      "text": "Blesses target ally, granting Critical Avoidance based on your companions level and total Critical Avoidance."
    }
  ],
  "air archon": [
    {
      "name": "Flail Strike",
      "text": "Spins around and hits up to 5 enemies with multiple attacks in every direction. While spinning the archon is highly resistant to damage."
    },
    {
      "name": "Tempest Blade",
      "text": "A mighty swing of the archon's blade."
    },
    {
      "name": "Typhoon's Rage",
      "text": "Flail Strike deals more damage, provides more damage resistance, and gains more threat."
    }
  ],
  "alchemist experimenter": [
    {
      "name": "Ember Flask",
      "text": "Throw a random Ember Flask at an enemy. This flask can deal damage instantly, over 6 seconds, or to all foes within 10'"
    },
    {
      "name": "One for the Doctor",
      "text": "The alchemist benefits from each potion when throwing it. Ember Flasks increase his damage by 10%. Rejuvenating Potions heal him for 10% of his health over 3 seconds."
    },
    {
      "name": "Rejuvenating Potion",
      "text": "Throw a random Rejuvenating Potion at an ally. This potion can heal 5% of the ally's life over 6 seconds, instantly or instantly to all allies within 10'"
    }
  ],
  "alpha compy": [
    {
      "name": "Animal Magnetism",
      "text": "Alpha Compy will randomly gather other compies to follow her. Any compy that joins her pack will fight for you."
    },
    {
      "name": "Call of Vengeance",
      "text": "When the Alpha Compy is below 50% health, all nearby player allies gain 1% increased damage, and all companion allies gain 20% increased damage."
    },
    {
      "name": "Nip",
      "text": "Compy takes a bite out of its target, doing damage."
    },
    {
      "name": "Pounce",
      "text": "Compy pounces on the target, doing damage."
    }
  ],
  "alphonse knox": [
    {
      "name": "Reaping Strike",
      "text": "An all-out attack that hits up to 5 targets around Knox and also gives him 25% damage resistance for 5 seconds."
    },
    {
      "name": "Wicked Strike",
      "text": "Sergeant Knox swings his famous axe, damaging foes to his front and increasing his damage by 5%. The second hit deals additional damage and the third hit still more."
    },
    {
      "name": "Will Not Fail",
      "text": "Reduces all incoming damage by 33%"
    }
  ],
  "ambush drake": [
    {
      "name": "Deadly Infection",
      "text": "The Ambush Drake's bite now has a chance in increse its attack by 5% for 5 seconds."
    },
    {
      "name": "Septic Bite",
      "text": "A vicious bite that deals damage to a single target."
    },
    {
      "name": "Stealth",
      "text": "The ambush drake becomes hidden only to strike a single target from the shadows."
    }
  ],
  "angel of protection": [
    {
      "name": "Angel's Touch",
      "text": "Heals the summoner."
    },
    {
      "name": "Protective Ward",
      "text": "Summoner takes 5% less damage."
    },
    {
      "name": "Ward",
      "text": "Angel of Protection wards you from harm when you take more than 5% of your Max Hit Points in damage, intercepting half of all incoming damage for 10 seconds. This may only take place every 60 seconds."
    }
  ],
  "apprentice healer": [
    {
      "name": "Healing Pass",
      "text": "Heals the summoner over 10 seconds."
    },
    {
      "name": "Sun Burst",
      "text": "Invoke a blast of radiant light that burns foes around you and Heals yourself and allies."
    },
    {
      "name": "Sunstroke",
      "text": "Increases the damage done by Sunburst by 50%."
    }
  ],
  "aranea": [
    {
      "name": "Bite",
      "text": "Spider fangs tear at the target foe to deal damage."
    },
    {
      "name": "Storm Pillar",
      "text": "A small bolt of lightning strikes the target and other enemies close by."
    },
    {
      "name": "Webbed Terrain",
      "text": "Creates a zone of spider webs that slows the target."
    }
  ],
  "armored orc wolf": [
    {
      "name": "Bite",
      "text": "A vicious bite that deals direct damage to target foe."
    },
    {
      "name": "Bleed",
      "text": "Rips the target's flesh leaves a bleeding wound that deals damage over time for 10 seconds."
    },
    {
      "name": "Go for the Jugular",
      "text": "Bleed now lasts 50% longer and the first tick hits twice."
    }
  ],
  "assassin drake": [
    {
      "name": "Acid Prepared",
      "text": "The Assassin' Drake's biite does 50% more damage if the target is taking damage from his acid spit."
    },
    {
      "name": "Acid Spew",
      "text": "Spits acid on up to 5 target foes, dealing initial acid damage and damage over time."
    },
    {
      "name": "Vicious Bite",
      "text": "A vicious bite that deals direct damage to target foe."
    }
  ],
  "astral deva": [
    {
      "name": "Divine Strikes",
      "text": "Strike target foe twice with holy force, dealing damage to the foe and up to 4 additional foes caught in the arc."
    },
    {
      "name": "Holy Light",
      "text": "An explosion of Holy Light that damages up to 5 foes around the Deva. 4% of the Deva's maximum health is restored for each target hit."
    },
    {
      "name": "Light of Vengeance",
      "text": "When taking damage greater than 20% of the Deva's maximum life, the cooldown on Holy Light is refreshed."
    }
  ],
  "baby displacer beast": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Accuracy, Critical Strike, and Critical Severity shared with the owner."
    }
  ],
  "barbarian shaman": [
    {
      "name": "Howling Wrath",
      "text": "Natures Wind now damages foes caught in the storm."
    },
    {
      "name": "Nature's Wind",
      "text": "A gust of fortifying wind surrounds all allies near the Shaman, granting them temporary hit points."
    },
    {
      "name": "Protecting Strike",
      "text": "Damages target foe and restores health to you."
    }
  ],
  "batiri": [
    {
      "name": "Blow Darts",
      "text": "A blow dart that damages the target foe."
    },
    {
      "name": "Chief Killer",
      "text": "Batiri does 25% more damage against bosses."
    },
    {
      "name": "Poisoned Bolt",
      "text": "A poisoned bolt that damages and poisons the target foe."
    }
  ],
  "battlefield medic": [
    {
      "name": "Advanced Healing",
      "text": "Increases the duration of Combat Heal by 50%."
    },
    {
      "name": "Aid All",
      "text": "Heals all allies within 10 feet for 6 seconds."
    },
    {
      "name": "Combat Heal",
      "text": "Heals the summoner and self over 6 seconds."
    }
  ],
  "bear cub": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Accuracy, Deflect, and Control Bonus shared with the owner."
    }
  ],
  "black death scorpion": [
    {
      "name": "Savage Pincers",
      "text": "The scorpion's pincers hit his target, doing damage."
    },
    {
      "name": "Tail Sting",
      "text": "The scorpion's tail rapidly strikes the target dealing damage and poisoning the target. Damage is increased if the black scorpion has combat advantage."
    },
    {
      "name": "Too Many Legs",
      "text": "Enemies hit by the scorpion's pincers are struck with fear, giving the black scorpion and allies combat advantage."
    }
  ],
  "black dragon ioun stone": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Hit Points, Critical Avoidance, and Defense shared with the owner."
    }
  ],
  "black ice ioun stone": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Critical Strike, Deflect, and Awareness shared with the owner."
    }
  ],
  "black ice prospector": [
    {
      "name": "Mountain Hard",
      "text": "Increases this companion's chance to deflect by 25%."
    },
    {
      "name": "Pick Attack",
      "text": "A forceful swing of his deadly black ice pick, dealing a damaging blow."
    },
    {
      "name": "Spinning Pick",
      "text": "Spin around and hit up to 5 enemies with multiple attacks in every direction."
    }
  ],
  "blacksmith": [
    {
      "name": "Anvil",
      "text": "Slams the target with the head of the hammer to deal damage."
    },
    {
      "name": "Hammer",
      "text": "Deals damage to target foe with a massive blow of the hammer."
    },
    {
      "name": "Improved Anvil",
      "text": "Improved Anvil deals damage to foes in an arc in front of the Blacksmith. This power replaces Anvil at companion level 30."
    }
  ],
  "blink dog": [
    {
      "name": "Bite",
      "text": "Bite down on the target, dealing damage. Damage is increased if the Blink Dog has combat advantage."
    },
    {
      "name": "Blink Strike",
      "text": "Teleport behind the enemy and deliver a painful bite."
    },
    {
      "name": "Lightning Claws",
      "text": "Blink Strike deals 40% more damage and grants combat advantage over the target."
    }
  ],
  "blue fire eye": [
    {
      "name": "Eye Bolt",
      "text": "Shoots a ranged fire attack at the foe."
    },
    {
      "name": "Focused Attack",
      "text": "Blue Fire Eye gains an additional 300 Crit."
    },
    {
      "name": "Hex",
      "text": "Creates a hex on the ground that does damage to the enemies that stand in it."
    }
  ],
  "boar": [
    {
      "name": "Charge",
      "text": "Charges at and deals damage to target foe."
    },
    {
      "name": "Gouge",
      "text": "A vicious bite that leaves a bleeding wound."
    },
    {
      "name": "Wild Bloodlust",
      "text": "If the Boar charges a Gouged foe he enrages, healing himself for 10% of his hit points over 20 seconds and the Charge deals bonus damage. This consumes the Gouge."
    }
  ],
  "boar shoat": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Accuracy, Deflect, and Critical Strike shared with the owner."
    }
  ],
  "book imp": [
    {
      "name": "Blink Strike",
      "text": "Sneakily teleports next to a target and attacks it from an unexpected angle."
    },
    {
      "name": "Claw",
      "text": "Deals damage to target foe."
    },
    {
      "name": "Impish Flurry",
      "text": "When the Book Imp strikes a target it gains a stacking damage buff that grants 5% bonus damage per stack. Stacks up to 10 times."
    }
  ],
  "bruenor battlehammer": [
    {
      "name": "Cleave",
      "text": "Delivers a threefold attack to enemies."
    },
    {
      "name": "Shield Charge",
      "text": "A charging attack that damages the target."
    },
    {
      "name": "Stand United",
      "text": "Reduces incoming damage to allies by 3%."
    }
  ],
  "bulette pup": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Combat Advantage, Defense, and Power shared with the owner."
    }
  ],
  "butterfly": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Defense, Deflect, and Awareness shared with the owner."
    }
  ],
  "cambion magus": [
    {
      "name": "Hellfire",
      "text": "Soulscorch now sets targets on fire doing damage over time."
    },
    {
      "name": "Soulscorch",
      "text": "Blasts enemies with hellish force, knocking monsters down and doing fire damage."
    },
    {
      "name": "Staff Smash",
      "text": "Smashes enemies to the cambion's front with his arcane staff."
    }
  ],
  "cantankerous mage": [
    {
      "name": "Repel",
      "text": "Repels a group of enemies with a forceful blast, dealing minor damage."
    },
    {
      "name": "Storm Pillar",
      "text": "A small bolt of lightning strikes the target and other enemies close by."
    },
    {
      "name": "Unbridled Force",
      "text": "Repel now deals 35% more damage and gives combat advantage on the target for 4 seconds."
    }
  ],
  "cat": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Deflect, Awareness, and Deflect Severity shared with the owner."
    }
  ],
  "catti-brie": [
    {
      "name": "Aimed Shot",
      "text": "A precision shot."
    },
    {
      "name": "Catti-Like",
      "text": "Increases movement speed for allies by 3%."
    },
    {
      "name": "Rapid Shot",
      "text": "Several arrows loosed in quick succession."
    }
  ],
  "cave bear": [
    {
      "name": "Claw",
      "text": "Claws the target, dealing damage."
    },
    {
      "name": "Maul",
      "text": "Mauls the target with two swipes, dealing damage and taunting."
    },
    {
      "name": "Restoring Strikes",
      "text": "Grants 150 bonus Critical Avoidance."
    }
  ],
  "celeste": [
    {
      "name": "Flame Strike",
      "text": "Raise a column of holy fire that knocks targets upwards, and then splashes down in a wider area."
    },
    {
      "name": "Master of Mercy",
      "text": "Increases healing of Sunburst by 20%"
    },
    {
      "name": "Sun Burst",
      "text": "Invoke a blast of radiant light that burns foes around you and Heals yourself and allies"
    }
  ],
  "chicken": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Critical Avoidance, Combat Advantage, and Defense shared with the owner."
    }
  ],
  "chultan hunter": [
    {
      "name": "Hunter of Chult",
      "text": "Chultan Hunter does 25% more damage in Chult."
    },
    {
      "name": "Poison Arrow",
      "text": "Fires a poisoned arrow, damaging the target and poisoning it for 5 seconds."
    },
    {
      "name": "True Shot",
      "text": "An arrow, fired straight and true, that deals damage to a targeted foe."
    }
  ],
  "chultan tiger": [
    {
      "name": "Claw",
      "text": "Claws the target, dealing physical damage."
    },
    {
      "name": "Killer Instinct",
      "text": "Increases the damage of the Tiger's instant attacks by 10% against any targets affected by its bleed attacks. Claw now has a chance to apply a bleed affect if the Tiger has Combat Advantage."
    },
    {
      "name": "Rending Swipe",
      "text": "The Tiger swipes at all enemies in front of him causing them to take Damage Over Time through a Bleed effect."
    }
  ],
  "cleric disciple": [
    {
      "name": "Divine Wildfire",
      "text": "Increases the radius of Sacred Flame Healing."
    },
    {
      "name": "Healing Word",
      "text": "Heals the summoner over 10 seconds."
    },
    {
      "name": "Sacred Flame",
      "text": "Sears foes with radiant flame. On third hit deals damage and heals nearby friendly players."
    }
  ],
  "cockatrice": [
    {
      "name": "Flesh to Stone",
      "text": "When biting a target already slowed by Petrifying Bite, the target's feet turn to stone and it becomes immobilized. The next Talon Assaunt shatters the stone, removing the immobilization and sending damaging shrapnel in all directions."
    },
    {
      "name": "Petrifying Bite",
      "text": "Bite target foe with a razor sharp beak and slow their movement for 10 seconds. This slow only has effect on targets not already slowed by Petrifying Bite."
    },
    {
      "name": "Talon Assault",
      "text": "Simultaneously attack the target foe with both claws to deal damage."
    }
  ],
  "cold iron warrior": [
    {
      "name": "Iron Strike",
      "text": "Multiple narrow swings against a single target. If that target is a Fey creature, additional damage is dealt and the last hit will knock them prone. The prone effect cannot activate more than once every 30 seconds."
    },
    {
      "name": "Mortal Vengeance",
      "text": "Whenever the summoner within 30' is hit, Cold Iron Warrior gains a stack of Vengeance for 10s. Each stack increases his damage by 5%. Stacks up to 3 times."
    },
    {
      "name": "Spinning Steel",
      "text": "Spin around and cut up to 5 enemies multiple times in every direction."
    }
  ],
  "con artist": [
    {
      "name": "Consumed by Battle",
      "text": "The final strike of Wicked Strike now has a chance to increase the companion's damage by 10%"
    },
    {
      "name": "Weapon Master",
      "text": "An attack using a mastery of great weapons. This attack increases critical strike chance on every successive hit."
    },
    {
      "name": "Wicked Strike",
      "text": "Deals damage to many foes standing in the way of this attack."
    }
  ],
  "corbin the venerated": [
    {
      "name": "Corbin's Charge",
      "text": "Lunge forward and deal damage to enemies in a line."
    },
    {
      "name": "Corbin's Combo",
      "text": "Deal damage to target foe with a well executed 3-hit combo."
    },
    {
      "name": "Fireball",
      "text": "Tosses a conjured ball of fire onto the ground that lingers for 4 seconds, dealing damage every second to enemies that stand in it."
    }
  ],
  "crab": [
    {
      "name": "Crustacean Bloodlust",
      "text": "Each time the crab applies a bleed to a foe it increases its recharge speed by 20%. This buff can stack up to 5 times."
    },
    {
      "name": "Lacerating Claws",
      "text": "Snip the target, causing severe bleeding. This bleed stacks."
    },
    {
      "name": "Snapping Fury",
      "text": "The crab snaps its claws wildly, causing damage to any nearby foes. This snapping continues for 2 seconds."
    }
  ],
  "crystal golem": [
    {
      "name": "Charge",
      "text": "A lunging strike that deals damage to the target."
    },
    {
      "name": "Dazing Fist",
      "text": "Slams fist on the ground, stunning and knocking back nearby foes."
    },
    {
      "name": "Swipe",
      "text": "Smashes the target with his fist, dealing damage."
    }
  ],
  "cunning mimic - account": [
    {
      "name": "Despicable Trap",
      "text": "Taunt foes and immediately enter a dormant chest state for 3 seconds."
    },
    {
      "name": "Lid Slam",
      "text": "Slam the lid shut on the target, dealing damage."
    },
    {
      "name": "Pseudopods",
      "text": "Interrupt all nearby foes with pseudopods, dealing damage."
    },
    {
      "name": "Unbashable",
      "text": "While mimicking a dormant chest the mimic is immune to damage."
    }
  ],
  "cyclops war drummer": [
    {
      "name": "Bash",
      "text": "The cyclops attacks a single target with a club, dealing a small amount of physical damage."
    },
    {
      "name": "Percussion",
      "text": "The cyclops plays his drum, increasing the damage resistance of himself and nearby allies by 3% for 10 seconds."
    },
    {
      "name": "Repercussion",
      "text": "Enemy attacks against allies with Percussion have a 10% chance to deal a medium amount of damage as psychic damage and an even smaller chance to knock the attacker down."
    }
  ],
  "damaran shepherd": [
    {
      "name": "Bite",
      "text": "A vicious bite that deals direct damage to target foe."
    },
    {
      "name": "Crippling Bite",
      "text": "Bite slows movement speed of targets that are hit to 25% for 6 seconds."
    },
    {
      "name": "Takedown",
      "text": "Bites the legs of the target. The target is knocked down if the dog has combat advantage."
    }
  ],
  "dancing blade": [
    {
      "name": "Stab",
      "text": "Deals damage to target foe with a single, well-placed attack."
    },
    {
      "name": "Swipe",
      "text": "Deals damage to target foe."
    },
    {
      "name": "True Strike",
      "text": "Stab deals more damage and grants combat advantage on the target."
    }
  ],
  "dancing shield": [
    {
      "name": "Shield Bash",
      "text": "Deals damage to target foe."
    },
    {
      "name": "Shield Slam",
      "text": "Slams a single foe."
    },
    {
      "name": "Staggering Bash",
      "text": "Shield Bash has a chance to daze the target."
    }
  ],
  "dark dealer": [
    {
      "name": "Blood Bath",
      "text": "Teleports to random enemies to stab them."
    },
    {
      "name": "Sly Flourish",
      "text": "Strike the enemy with a series of 4 quick strikes."
    },
    {
      "name": "Stab",
      "text": "A vicious stab."
    }
  ],
  "death slaad": [
    {
      "name": "Cloudkill",
      "text": "Summons a poison cloud that poisons enemies in a 18' radius around the slaad."
    },
    {
      "name": "Planar Recovery",
      "text": "Quickly regenerates when taking damage."
    },
    {
      "name": "Poisonous Slash",
      "text": "A horizontal slash that can poison its targets."
    }
  ],
  "dedicated squire": [
    {
      "name": "Cleansing Touch",
      "text": "The squire heals and cleanses all allies in melee range, removing any CC effects and healing up to 15% of targets health over 6 seconds."
    },
    {
      "name": "Holy Orders",
      "text": "This companion has a bonus 25% chance to deflect."
    },
    {
      "name": "Smite",
      "text": "Smash a target, igniting them and nearby enemies with radiant damage for 4 seconds.~Heals any of the Squire's allies near the target."
    }
  ],
  "deepcrow hatchling": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Critical Strike, Deflect, and Awareness shared with the owner."
    }
  ],
  "deva champion": [
    {
      "name": "Shielding Light",
      "text": "Unleashes a wave of divine radiance in an area, shielding you and all party members for 5% of that target's maximum health."
    },
    {
      "name": "Smiting Blows",
      "text": "Smites the foe twice, dealing damage with each strike."
    },
    {
      "name": "Transcendent Light",
      "text": "Doubles the area effect radius of Shielding Light to 50'."
    }
  ],
  "displacer beast": [
    {
      "name": "Claw Swipe",
      "text": "A vicious swipe of both claws."
    },
    {
      "name": "Shifting Tactics",
      "text": "Whenever the Displacer Beast is attacked, it will reposition and attack the attacker."
    },
    {
      "name": "Tentacle Sweep",
      "text": "A sweep of tentacles, damaging foes in front of the Displacer Beast."
    },
    {
      "name": "Tentacle Whip",
      "text": "The Displacer beast lashes out with its tentacles against a single foe."
    },
    {
      "name": "Toothed Tentacles",
      "text": "Tentacle Whip and Tentacle Sweep cause bleeding for a short duration."
    }
  ],
  "dog": [
    {
      "name": "Bite",
      "text": "A vicious bite that deals direct damage to target foe."
    },
    {
      "name": "Crippling Bite",
      "text": "Bite slows movement speed of targets that are hit to 25% for 6 seconds."
    },
    {
      "name": "Takedown",
      "text": "Bites the legs of the target. The target is knocked down if the dog has combat advantage."
    }
  ],
  "dragon hunter": [
    {
      "name": "Caltrops",
      "text": "Toss a handful of caltrops, damaging and snaring all enemies in the affected area."
    },
    {
      "name": "Charged Shot",
      "text": "Take precise aim, firing an incredibly deadly shot into your enemy."
    },
    {
      "name": "Crossbow Bolt",
      "text": "Shoots the enemy with a crossbow bolt."
    }
  ],
  "dragonborn brawler": [
    {
      "name": "Burn Hotter",
      "text": "Increases the damage of Firebreath by 25%."
    },
    {
      "name": "Firebreath",
      "text": "The dragonborn's Firebreath sets up to 5 target foes on fire, dealing initial fire damage and burning damage over time."
    },
    {
      "name": "Massive Punch",
      "text": "Smashes the target with his fist, dealing damage."
    }
  ],
  "dragonborn grillmaster": [
    {
      "name": "Flame Broiler",
      "text": "Sets up to 5 target foes on fire, dealing initial fire damage and burning damage over time."
    },
    {
      "name": "Serve 'Em Up!",
      "text": "When 3 or more enemies are near the Grillmaster, you gain +2000 Power and +2000 Defense."
    },
    {
      "name": "Slice",
      "text": "The Grillmaster slices up to 3 nearby foes with his carving knife."
    }
  ],
  "dragonborn raider": [
    {
      "name": "Burn Longer",
      "text": "Extends the duration of Firebreath by 3 seconds."
    },
    {
      "name": "Firebreath",
      "text": "The dragonborn's Firebreath sets up to 5 target foes on fire, dealing initial fire damage and burning damage over time."
    },
    {
      "name": "Wicked Dagger Toss",
      "text": "Using both skill and strength, this dragonborn uses thrown daggers to damage a target foe."
    }
  ],
  "dread warrior": [
    {
      "name": "Siphon Strike",
      "text": "Deals damage over time to target foe and heals allies near the target and increases the power of their attacks by 5000."
    },
    {
      "name": "Slice of Dread",
      "text": "Slice multiple foes in an arc dealing damage to all of them."
    },
    {
      "name": "Warrior's Thirst",
      "text": "Life gained by Siphon Strike fills the recipient with a thirst for combat and increases damage dealt by 10% for the duration of the heal."
    }
  ],
  "drizzt do'urden": [
    {
      "name": "Quick Strike",
      "text": "Finely honed strike so quick his enemies are cut before they know what happened."
    },
    {
      "name": "Stab The Way",
      "text": "Increases outgoing damage from allies by 3%."
    },
    {
      "name": "Tempest Slash",
      "text": "Devestating slashes dicing up all enemies in front of him."
    }
  ],
  "duergar guard": [
    {
      "name": "Hammer Blow",
      "text": "A forceful swing of his deadly warhammer, dealing a damaging blow."
    },
    {
      "name": "Hardened Grudgeholder",
      "text": "Bonus 25% chance to deflect."
    },
    {
      "name": "Infernal Quill",
      "text": "Flings a poison quill drawn from his own beard, dealing damage and poisoning an opponent."
    }
  ],
  "duergar theurge": [
    {
      "name": "Hail of Brimstone",
      "text": "Brings down a fiery rain that damages foes and sets them on fire."
    },
    {
      "name": "Hell's Shield",
      "text": "Theurge now has a bonus 25% chance to deflect."
    },
    {
      "name": "Hellbolt",
      "text": "Attacks a single target doing fire damage and setting it on fire."
    }
  ],
  "dwarven battlerager": [
    {
      "name": "Double Punch",
      "text": "Overwhelms the target with a one-two combo, dealing damage. This damage is increased by 10% if the target has been hit with the battlerager's double punch in the last 5 seconds."
    },
    {
      "name": "Escalating Fury",
      "text": "Double Punch applies a stacking short-duration attack speed buff to the Dwarven Battlerager, causing him to attack with increasing frequency the longer he's in the fight."
    },
    {
      "name": "Ferocious Leap",
      "text": "Leaps to its target's location, dealing damage to nearby foes on landing."
    }
  ],
  "earl the chickenmancer": [
    {
      "name": "Cluck and Dagger",
      "text": "Throws a dagger at the target. Each dagger has a chance of summoning a chicken."
    },
    {
      "name": "Nothing Poultry",
      "text": "Chickens summoned from Cluck and Dagger have a chance to be feral and deal 20% increased damage."
    },
    {
      "name": "One Fowl Swoop",
      "text": "Call forth a large hen to charge a single target, knocking them down and dealing physical damage."
    }
  ],
  "earth archon": [
    {
      "name": "Hammer Blow",
      "text": "Swings his massive earth hammer doing damage to the target."
    },
    {
      "name": "Heart of the Mountain",
      "text": "Increases the damage, threat, and duration of Shatter Strike's Damage Immunity."
    },
    {
      "name": "Shatter Blast",
      "text": "The earth archon's fury explodes into massive shards of rock, damaging up to 5 foes and gaining him temporary immunity to damage."
    }
  ],
  "eladrin": [
    {
      "name": "Elegant Shot",
      "text": "Fires a sleek arrow that deals damage to the target."
    },
    {
      "name": "Magical Resistance",
      "text": "The Eladrin are naturally resistant to magic, gaining an additional 500 Awareness, Critical Avoidance, Deflect, and Control Resistance."
    },
    {
      "name": "Playful Step",
      "text": "Teleports behind the enemy, and attack them with a weapon."
    },
    {
      "name": "Poison Arrow",
      "text": "Fires a poisoned arrow, damaging the target and poisoning it for 5 seconds."
    }
  ],
  "elemental air cultist": [
    {
      "name": "Shockstorm",
      "text": "Summons forth 5 spheres of lightning, shocking those nearby."
    },
    {
      "name": "Storm Front",
      "text": "Increase the number of lightning spheres summoned during Shockstorm."
    },
    {
      "name": "Wind Blast",
      "text": "Blasts the target with a gust of wind and has a chance to slow their movement speed."
    }
  ],
  "elite intern": [
    {
      "name": "Cure Light Wounds",
      "text": "Heals you for a percentage of your maximum health that scales with your intern''s rank."
    },
    {
      "name": "Overachiever",
      "text": "Your intern puts extra effort into the snacks he prepares for you, increasing the effectiveness of food buffs from these snacks by 50% when consumed while he is summoned. This only affects snacks provided by your intern."
    },
    {
      "name": "Snack Delivery",
      "text": "When your intern is summoned, he will fetch a random buff snack for you to enjoy in a fervent attempt to please his master. This can occur once every 30 minutes."
    }
  ],
  "elminster aumar": [
    {
      "name": "Aganazzar's Scorcher",
      "text": "A line of raging fire that damages foes."
    },
    {
      "name": "Elminster's Effulgent Epuration",
      "text": "Shield the summoner from damage for 30 seconds."
    },
    {
      "name": "Ice Rays",
      "text": "A bolt of ice strike target foe and deals damage."
    }
  ],
  "elminster simulacrum": [
    {
      "name": "Cone of Cold",
      "text": "A blast of cold air that damages foes in a cone. Foes struck by Cone of Cold are Slowed."
    },
    {
      "name": "Fire Bolt",
      "text": "A constant barrage of fire that strikes a target foe, dealing damage and causing the target to burn over time."
    },
    {
      "name": "Lightning Strikes",
      "text": "Elminster of the Realm's elemental powers are accompanied by constant Lightning Strikes. When Elminster strike a foe, this lightning has a 50% chance of arcing a bolt of lightning off of them to a nearby foe, dealing damage. This can chain up to 3 times."
    }
  ],
  "energon": [
    {
      "name": "Gathering Energy",
      "text": "When in combat, the Energon will slowly gather energies from your enemies. Once the battle is over, he will convert the energy into Action Points and give it to you over time."
    }
  ],
  "erinyes of avernus": [
    {
      "name": "Bloody Spiral",
      "text": "Grants you and the erinyes Temporary Hit Points."
    },
    {
      "name": "Furious Vengeance",
      "text": "When below 50% health, the erinyes's Bloody Spiral power provides twice as many Temporary Hit Points."
    },
    {
      "name": "Jab",
      "text": "Strikes the target, dealing damage."
    }
  ],
  "erinyes of belial": [
    {
      "name": "Bloody Spiral",
      "text": "Grants you and the erinyes Temporary Hit Points."
    },
    {
      "name": "Furious Vengeance",
      "text": "When below 50% health, the erinyes's Bloody Spiral power provides twice as many Temporary Hit Points."
    },
    {
      "name": "Jab",
      "text": "Strikes the target, dealing damage."
    }
  ],
  "etrien": [
    {
      "name": "Bardic Inspiration",
      "text": "Allies who are above 50% Health have their Power and Critical Strike increased. Allies who are below 50% Health have their Defense and Deflect increased."
    },
    {
      "name": "Slash",
      "text": "Swings through the foes in front of you, dealing damage."
    },
    {
      "name": "Thrust",
      "text": "Deals damage to target foe with a single, well-placed attack."
    }
  ],
  "faithful initiate": [
    {
      "name": "Divine Wildfire",
      "text": "Increases the radius of Sacred Flame Healing."
    },
    {
      "name": "Healing Word",
      "text": "Heals the summoner over 10 seconds."
    },
    {
      "name": "Sacred Flame",
      "text": "Sears foes with radiant flame. On third hit deals damage and heals nearby friendly players."
    }
  ],
  "fawn of shiallia": [
    {
      "name": "Gift of Life",
      "text": "Increases effect of Natures Vigor to triple the Fawn's Power."
    },
    {
      "name": "Nature's Vigor",
      "text": "Regen health over 6 seconds."
    },
    {
      "name": "Spring of Life",
      "text": "Creates a healing spring that lasts for 10 seconds."
    }
  ],
  "feral velociraptor": [
    {
      "name": "Chomp",
      "text": "A vicious bite that deals direct damage to target foe."
    },
    {
      "name": "Pounce",
      "text": "Raptor pounces on the target, doing damage with a 10% chance of knocking them down."
    },
    {
      "name": "Prepare to Strike",
      "text": "Increases Pounce's knockdown chance by 10%."
    }
  ],
  "festive tiger": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Combat Advantage, Critical Severity, and Forte shared with the owner."
    }
  ],
  "fey panther": [
    {
      "name": "Claw",
      "text": "Claws the target, dealing damage."
    },
    {
      "name": "Rake",
      "text": "Slash the target with both paws, knocking the target down. The knock down cannot occur more than once every 25 seconds."
    },
    {
      "name": "Wild Claws",
      "text": "Rake and Claw do 30% additional damage. Rake also knocks the target down for twice as long."
    }
  ],
  "feywild sylph": [
    {
      "name": "Buffeting Wings",
      "text": "A focused blast of wind that deals damage to target foe."
    },
    {
      "name": "Dazzling Sunray",
      "text": "A ray of sunlight that dazes and deals damage to target foe. The daze cannot activate more than once every 25 seconds."
    },
    {
      "name": "Kindling Wind",
      "text": "Dazzling Sunray burns the target and deals additional damage over time."
    }
  ],
  "fire archon": [
    {
      "name": "Flame Fist",
      "text": "Hits target foe with fire damage."
    },
    {
      "name": "Immolate",
      "text": "Sets target foe on fire, dealing initial damage and damage over time."
    },
    {
      "name": "Resurgent Flames",
      "text": "The Fire Archon's Damage over Time effects deal additional damage based on how much health the target is missing when they are applied."
    }
  ],
  "fireblossom zealot": [
    {
      "name": "Butterfly Swarm",
      "text": "The kobold channels a swarm of butterflies to hold a target, dealing a small amount of damage over 8 seconds to it and all nearby foes."
    },
    {
      "name": "Fireblossom Bloom",
      "text": "The kobold conjures a gale of fireblossom petals in an area, increasing Forte for all allies by 1000 in the area."
    },
    {
      "name": "Refreshing Bloom",
      "text": "Fireblossom Bloom heals allies in the target area for a small amount over its duration."
    }
  ],
  "flame sprite": [
    {
      "name": "Combustive Arrows",
      "text": "Flame Sprites wield combustive arrows that set foes alight.~~The Fire Sprite's Spark Arrow now ignites the target; dealing 10% more damage over 5 seconds."
    },
    {
      "name": "Spark Arrow",
      "text": "The Flame Sprite's spark arrow ignites in a bright flash, dazing victims for 1 second. The daze cannot activate more than once every 22 seconds."
    },
    {
      "name": "Twin Ember",
      "text": "The Flame Sprite shoots two flaming arrows that burn the target."
    }
  ],
  "flumph": [
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Combined Rating."
    },
    {
      "name": "Tendrils",
      "text": "Deals damage instantly and over time to nearby enemies."
    }
  ],
  "frost mimic": [
    {
      "name": "Lid Slam",
      "text": "Slam the lid shut on the target, dealing damage."
    },
    {
      "name": "Ravening Maw",
      "text": "Taunt target foe and wait in a dormant chest state for 3 seconds. Then reveal the clever ruse and deliver a devastating attack."
    },
    {
      "name": "Unbashable",
      "text": "While mimicking a dormant chest the mimic is immune to damage."
    }
  ],
  "frozen galeb duhr": [
    {
      "name": "Demanding Stomp",
      "text": "Deals damage to the primary target."
    },
    {
      "name": "Slam",
      "text": "Lifting his arms high in the air, the Galeb Duhr slams his target with all his might."
    },
    {
      "name": "Stone Warden",
      "text": "Deal up to 50% more damage based on how much HP is missing. Every 10 seconds heal for 8% of missing health."
    }
  ],
  "galeb duhr": [
    {
      "name": "Hurl Stones",
      "text": "Deals damage to the primary target."
    },
    {
      "name": "Slam",
      "text": "Lifting his arms high in the air, the Galeb Duhr slams his target with all his might."
    },
    {
      "name": "Stone Warden",
      "text": "Deal up to 50% more damage based on how much HP is missing. Every 10 seconds heal for 8% of missing health."
    }
  ],
  "gelatinous cube": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Critical Strike, Critical Avoidance, and Deflect shared with the owner."
    }
  ],
  "ghost": [
    {
      "name": "Cloying Touch",
      "text": "Spirit Touch now reduces the cooldown of Ghostly Possession by 1 second each time it is used."
    },
    {
      "name": "Ghostly Possession",
      "text": "Possesses an enemy minion, turning it briefly to your side. When the possession ends, the minion is killed."
    },
    {
      "name": "Spirit Touch",
      "text": "Burns the target with magic from the Astral Plane."
    }
  ],
  "githyanki": [
    {
      "name": "Cleave",
      "text": "Attack which hits multiple targets."
    },
    {
      "name": "Spinning Strike",
      "text": "Spinning attack which damages multiple enemies."
    },
    {
      "name": "Wicked Strike",
      "text": "Damages foes in front of the companion. The third hit deals additional damage."
    }
  ],
  "goat": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Critical Strike, Combat Advantage, and Control Bonus shared with the owner."
    }
  ],
  "golden bulette pup - account": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Outgoing Healing shared with the owner."
    }
  ],
  "golden cat - account": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Combat Advantage shared with the owner."
    }
  ],
  "golden deep crow egg - account": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Awareness shared with the owner."
    }
  ],
  "golden goat - account": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Forte shared with the owner."
    }
  ],
  "goldfish": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Hit Points, Critical Strike, and Deflect shared with the owner."
    }
  ],
  "grazilaxx": [
    {
      "name": "Illithilash",
      "text": "A short ranged melee attack that strikes opponents in a line. Deals 50% more damage against demons."
    },
    {
      "name": "Powerful Mind",
      "text": "Grazilaxx will stun targets of his Psychic Blast for twice as long."
    },
    {
      "name": "Psychic Blast",
      "text": "A cone blast of psychic force that damages targets and stuns them for a short time."
    }
  ],
  "green slime": [
    {
      "name": "Acid Aura",
      "text": "Deals damage over time to any foe that gets close enough to touch the slime."
    },
    {
      "name": "Engulf",
      "text": "Grabs target foe, pulls them into the slime and deals damage to nearby foes."
    },
    {
      "name": "Thick Sludge",
      "text": "Targets hit by Acid Aura are caught in the sludge and have reduced movement speed."
    }
  ],
  "greenscale bowman": [
    {
      "name": "Debilitating Toxin",
      "text": "Targets affected by Poison Arrow take 10% more damage from the poison."
    },
    {
      "name": "Poison Arrow",
      "text": "Fires a poisoned arrow, damaging the target and poisoning it for 5 seconds."
    },
    {
      "name": "Savage Shot",
      "text": "Fires a serrated arrow that deals damage to the target."
    }
  ],
  "grung": [
    {
      "name": "Mesmerizing Chirr",
      "text": "Stuns and damages enemies in a cone."
    },
    {
      "name": "Poisonous Skin",
      "text": "Periodic poison damage to nearby foes."
    },
    {
      "name": "Stab",
      "text": "A quick single target attack."
    }
  ],
  "halfling wayward wizard": [
    {
      "name": "Arcane Warping",
      "text": "Slow now lasts twice as long and Chilling Cloud deals bonus damage."
    },
    {
      "name": "Chilling Cloud",
      "text": "Blasts a group of enemies with chilling cold, dealing damage."
    },
    {
      "name": "Slow",
      "text": "Slows nearby enemies, greatly reducing their move speed."
    }
  ],
  "harper bard": [
    {
      "name": "Bardic Inspiration",
      "text": "The Bard plays a soothing refrain that empowers allies. Allies who are above 50% Health have their Power and Critical Strike increased. Allies who are below 50% Health have their Defense and Deflect increased. The potency of this buff scales with the Bard's level."
    },
    {
      "name": "Discordant Discouragement",
      "text": "The bard plays a discordant note that damages the foe and has a chance to stun them for 2 seconds."
    },
    {
      "name": "Extended Inspiration",
      "text": "Increases the duration of Bardic Inspiration."
    }
  ],
  "hawk": [
    {
      "name": "Blinding Dive",
      "text": "Dive now has a chance to increases the Hawk's damage by 5% for 5 seconds."
    },
    {
      "name": "Dive",
      "text": "After flying high in the air, the hawk dives on its target dealing damage."
    },
    {
      "name": "Rake",
      "text": "Deals moderate damage to the primary target."
    }
  ],
  "hell hound": [
    {
      "name": "Burning Hunger",
      "text": "Firefang now applies Burning Hunger, increasing damage of the next Fire Breath by 10% per stack. (Max 3 stacks)"
    },
    {
      "name": "Fire Breath",
      "text": "Breaths a jet of flame, dealing fire damage to up to 5 target foes."
    },
    {
      "name": "Firefang",
      "text": "Bites the target, dealing fire damage and damage over time."
    }
  ],
  "helmite paladin ghost": [
    {
      "name": "Helmite Seal",
      "text": "Attacking a target afflicted with a Helmite Seal heals the attacker for up to 3% of their maximum health."
    },
    {
      "name": "Shield Bash",
      "text": "Deal damage to target foe. Shield Bash applies a Helmite Seal to the target for 5 seconds."
    },
    {
      "name": "Sweep",
      "text": "Strike all foes in a forward arc."
    }
  ],
  "hezrou": [
    {
      "name": "Claws",
      "text": "Claws the target, dealing physical damage."
    },
    {
      "name": "Frenzy",
      "text": "Strike multiple times with a flurry of attacks, dealing physical damage."
    },
    {
      "name": "Stench",
      "text": "Periodic poison damage to nearby foes."
    }
  ],
  "honey badger": [
    {
      "name": "Can't Be Stopped",
      "text": "Honey Badger deals double damage while above 80% hit points and takes 20% less damage while below 35% hit points."
    },
    {
      "name": "Ferocious Swipe",
      "text": "Ferociously swipes at all enemies in front of it, dealing damage and causing the targets to bleed over time."
    },
    {
      "name": "Rip and Tear",
      "text": "Bites the target and tears, dealing increased damage if that target is affected by Ferocious Swipe."
    }
  ],
  "hunting drake": [
    {
      "name": "Frost Spit",
      "text": "The Hunting Drake's Ice Spit now freezes a foe."
    },
    {
      "name": "Ice Spit",
      "text": "Spits ice to deal damage and slow down a single foe."
    },
    {
      "name": "Tail Swipe",
      "text": "A swift and powerful spin with the tail that deals damage to target foes in a circle."
    }
  ],
  "hunting hawk": [
    {
      "name": "Dive",
      "text": "After flying high in the air, the hawk dives on its target dealing damage."
    },
    {
      "name": "Nature's Wind",
      "text": "Dive now summons strong wind around the target to slow its movement speed by 75%."
    },
    {
      "name": "Wing Buffet",
      "text": "A focused blast of wind that deals damage to target foe."
    }
  ],
  "ice sprite": [
    {
      "name": "Freezing Arrows",
      "text": "Ice Sprites wield Freezing arrows that freeze foes.~~The Ice Sprite's Frost Arrow now deals 20% additional damage over 5 seconds, and freezes the target once every 22 seconds."
    },
    {
      "name": "Frost Arrow",
      "text": "The Ice Sprite's frost arrow smashes into brilliant shards, dazing victims for 1 second. The daze cannot activate more than once every 22 seconds."
    },
    {
      "name": "Twin Ice Strike",
      "text": "The Ice Sprite shoots two icy arrows that burn the target."
    }
  ],
  "icosahedron ioun stone": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Critical Strike, Combat Advantage, and Power shared with the owner."
    }
  ],
  "incubus": [
    {
      "name": "Deadly Kiss",
      "text": "Damages and causes Vulnerability for a brief duration to enemies in a cone."
    },
    {
      "name": "Draining Kiss",
      "text": "A ranged single target attack."
    },
    {
      "name": "Enhanced Deadly Kiss",
      "text": "Deadly Kiss additionally reduces enemy outgoing damage for a brief duration."
    },
    {
      "name": "Necrotic Claw",
      "text": "A quick single target attack."
    }
  ],
  "infant gorilla": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Hit Points, Deflect, and Defense shared with the owner."
    }
  ],
  "intellect devourer": [
    {
      "name": "Mind Blast",
      "text": "Ranged blast of psychic energy."
    },
    {
      "name": "Mind Flay",
      "text": "Doubles Hold duration of Mind Shock."
    },
    {
      "name": "Mind Shock",
      "text": "A psychic shock blast that damages your foes and holds them for 2 seconds."
    }
  ],
  "ioun stone of allure": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Awareness, Control Resistance, and Hit Points shared with the owner."
    }
  ],
  "ioun stone of might": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Hit Points, Deflect, and Defense shared with the owner."
    }
  ],
  "ioun stone of radiance": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Combat Advantage, Critical Avoidance, and Deflect shared with the owner."
    }
  ],
  "ioun stone of the feywild": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Accuracy, Critical Strike, and Critical Avoidance shared with the owner."
    }
  ],
  "iron golem": [
    {
      "name": "Dazing Fist",
      "text": "Smashes up to 5 targets with a blast from smashing his fists, dazing and knocking back up to 5 targets as well as dealing damage."
    },
    {
      "name": "Fist Smash",
      "text": "Smashes the target with his fist, dealing damage."
    },
    {
      "name": "Restoring Strikes",
      "text": "Grants 150 bonus Critical Avoidance."
    }
  ],
  "jagged dancing blade": [
    {
      "name": "Adroit Swordplay",
      "text": "All attacks recharge faster for smaller individual hits but more damage over time."
    },
    {
      "name": "Blade Flurry",
      "text": "Deals damage to target foe with two strikes in rapid succession."
    },
    {
      "name": "Stab",
      "text": "Deals damage to target foe."
    }
  ],
  "jarlaxle baenre": [
    {
      "name": "Graceful Swordplay",
      "text": "Deal damage to target foe with a graceful rapier strike."
    },
    {
      "name": "Illusion Fireball",
      "text": "Throw an illusion of a Fireball onto the ground that lingers for 4 seconds, dealing damage every second to enemies that stand in it."
    },
    {
      "name": "Wand of Web",
      "text": "Activates a Wand of Web on the target, causing a spiderweb to appear beneath them, creating difficult terrain and inhibiting movement."
    }
  ],
  "joy dancer of lliira": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Outgoing Healing, Incoming Healing and Control Resist shared with the owner."
    }
  ],
  "kavatos stormeye": [
    {
      "name": "Defensive Ward",
      "text": "Reduces incoming damage to the summoner for 10 seconds."
    },
    {
      "name": "Ethereal Eyes",
      "text": "Deals damage to foes in a frontal cone."
    },
    {
      "name": "Lightning Bolt",
      "text": "A bolt of lightning strikes target for and deals damage."
    }
  ],
  "kenku archer": [
    {
      "name": "Cloud the eye",
      "text": "All arrows fired while stealthed do 33% more damage."
    },
    {
      "name": "Hide and Shoot",
      "text": "The kenku goes into stealth and fires a brace of arrows from the shadows which strike several targets."
    },
    {
      "name": "Malicious Shot",
      "text": "A truly wicked poison arrow that deals damage and poisons a targeted foe."
    }
  ],
  "kingfisher's intern": [
    {
      "name": "Cure Light Wounds",
      "text": "Heals you for a percentage of your maximum health that scales with your intern's rank."
    },
    {
      "name": "Overachiever",
      "text": "Your intern puts extra effort into the snacks he prepares for you, increasing the effectiveness of food buffs from these snacks by 50% when consumed while he is summoned. This only affects snacks provided by your intern."
    },
    {
      "name": "Snack Delivery",
      "text": "When your intern is summoned, he will fetch a random buff snack for you to enjoy in a fervent attempt to please his master. This can occur once every 30 minutes."
    }
  ],
  "kuo-toa": [
    {
      "name": "Quick Jab",
      "text": "A spear strike that damages the target foe."
    }
  ],
  "laughing skull": [
    {
      "name": "Burning Insult",
      "text": "Sling an insult at target foe, dealing damage."
    },
    {
      "name": "Flying Bite",
      "text": "Fly forward and bite the target, dealing damage and generating extra threat."
    },
    {
      "name": "Severe Burn",
      "text": "Burning Insult now increases the Laughing Skull's damage resistance by 15% for 5 seconds."
    }
  ],
  "lava galeb duhr": [
    {
      "name": "Lava Eruption",
      "text": "A fierce stomp that forces the earth to rupture around the target, damaging nearby enemies."
    },
    {
      "name": "Lava Smash",
      "text": "The Lava Galeb Duhr smashes his fist into his enemy, burning his foe."
    },
    {
      "name": "Stone Warden",
      "text": "Deal up to 50% more damage based on how much HP is missing. Every 10 seconds heal for 8% of missing health."
    }
  ],
  "leprechaun": [
    {
      "name": "Cut and Run",
      "text": "Deal damage to target foe. The Leprechaun disappears if that foe targets him."
    },
    {
      "name": "Full of Holes",
      "text": "The leprechaun's bag is full of holes. Increases your gold gain by 7.5% It's probably best if you don't tell him."
    },
    {
      "name": "Illusory Grasp",
      "text": "Throws pebbles of illusory grasp at the target, summoning an illusion to choke the target. The stun cannot activate more than once every 30 seconds."
    }
  ],
  "lich": [
    {
      "name": "Disrupt Life",
      "text": "Channel necrotic energy, damaging nearby foes multiple times."
    },
    {
      "name": "Ice Rays",
      "text": "A bolt of ice strike target foe and deals damage."
    }
  ],
  "lich makos": [
    {
      "name": "Consume Soul",
      "text": "A blast of psychic energy hits the target, and siphons some of their soul, healing the caster."
    },
    {
      "name": "Fireball",
      "text": "Blasts the target with a fire projectile that explodes on impact and deals initial damage and fire damage over time to up to 5 nearby foes."
    },
    {
      "name": "Meteor Blasts",
      "text": "Summons a shower of 5 meteors in random locations around the target enemy."
    },
    {
      "name": "Meteor Storm",
      "text": "Makos drops more meteors during Meteor Blasts."
    }
  ],
  "lightfoot thief": [
    {
      "name": "Deft Strike",
      "text": "Teleport behind the enemy and deliver a painful stab."
    },
    {
      "name": "Sly Brutality",
      "text": "The last strike of Sly Flourish now causes the target to bleed."
    },
    {
      "name": "Sly Flourish",
      "text": "Strike the enemy with a series of 4 quick strikes."
    }
  ],
  "lillend": [
    {
      "name": "Audio Drain",
      "text": "Deals damage over time to target foe and heals allies near the target for 5 seconds."
    },
    {
      "name": "Piercing Notes",
      "text": "Foes hit by Audio Drain are weakened and take 20% more damage from Audio Drain. Additionally, Audio Drain now heals for 10% more."
    },
    {
      "name": "Rejuvenating Chord",
      "text": "Heals the owner."
    }
  ],
  "linu la'neral": [
    {
      "name": "Lunar Light",
      "text": "Heals all allies within 25 feet."
    },
    {
      "name": "Moonlight Mystery",
      "text": "Summon a blast of Moonlight that damages foes around you and Heals yourself and allies."
    },
    {
      "name": "Sacred Flame",
      "text": "Sears foes with a radiant flame."
    }
  ],
  "little white": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Critical Strike, Critical Avoidance and Incoming Healing shared with the owner."
    }
  ],
  "lizardfolk shaman": [
    {
      "name": "Marsh Blessing",
      "text": "Marsh Blessing heals you and up to 3 allies around you."
    },
    {
      "name": "Poisoned Dart",
      "text": "Fires a dart at a single target doing damage and additional poison damage over time."
    },
    {
      "name": "Power of the Marshlands",
      "text": "Increases the amount that Marsh Blessing heals by 25%."
    }
  ],
  "lulu the hollyphant": [
    {
      "name": "Hollyphant's Heal",
      "text": "Heals the summoner."
    },
    {
      "name": "Holy Help",
      "text": "Summoner's Health increased by 5%."
    },
    {
      "name": "Tusk",
      "text": "Strikes the target with tusk, dealing physical damage."
    }
  ],
  "mage slayer": [
    {
      "name": "Magical Resistance",
      "text": "Getting hit by a critical strike increases the Mage Slayer's Defense, Deflect, and Life Steal."
    },
    {
      "name": "Merciless End",
      "text": "The Mage Slayer delivers a precise attack to the foe, aiming for vulnerable parts."
    },
    {
      "name": "Slayer's Fury",
      "text": "A series of attacks that the Mage Slayer uses to put his victims off-balance."
    }
  ],
  "makos": [
    {
      "name": "Fireball",
      "text": "Blasts the target with a fire projectile that explodes on impact and deals initial damage and fire damage over time to up to 5 nearby foes."
    },
    {
      "name": "Meteor Blasts",
      "text": "Summons a shower of 5 meteors in random locations around the target enemy."
    },
    {
      "name": "Meteor Storm",
      "text": "Makos drops more meteors during Meteor Blasts."
    }
  ],
  "man at arms": [
    {
      "name": "Crushing Strike",
      "text": "Strikes the target, dealing damage."
    },
    {
      "name": "Lunging Strike",
      "text": "Charges at a foe, dealing damage."
    },
    {
      "name": "Seasoned Scrapper",
      "text": "Bonus 25% chance to deflect."
    }
  ],
  "manticore": [
    {
      "name": "Favored Prey",
      "text": "The Manticore does an extra 20% damage against humanoids."
    },
    {
      "name": "Fierce Swipe",
      "text": "Manticore swipes at the enemy, causing damage."
    },
    {
      "name": "Tail Spin",
      "text": "Manticore does a back flip, throwing tail spines at enemies in front of him, doing damage with a lingering poison, with a chance of knockback."
    }
  ],
  "mercenary": [
    {
      "name": "Deft Strike",
      "text": "Teleport behind the enemy and deliver a painful stab."
    },
    {
      "name": "Sly Brutality",
      "text": "The last strike of Sly Flourish now causes the target to bleed."
    },
    {
      "name": "Sly Flourish",
      "text": "Strike the enemy with a series of 4 quick strikes."
    }
  ],
  "mini apparatus of gond": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Deflect, Combat Advantage, and Awareness shared with the owner."
    }
  ],
  "minotaur mercenary": [
    {
      "name": "Spin to Win",
      "text": "In a display of pure brute strength, minotaurs can whirl their massive weapons too fast for the eye to follow, striking all who remain within reach."
    },
    {
      "name": "Stone Cleaver",
      "text": "A powerful cleaving melee strike that damage foes firectly in front of the attacker."
    },
    {
      "name": "Tidal Force",
      "text": "Using an innate magical ability to briefly increase its gravitational mass, the minotaur pulls nearby enemies into close striking range."
    }
  ],
  "minsc": [
    {
      "name": "A Cute Sense",
      "text": "Boo thirsts for battle! Minsc calms his faithful companion and bolsters the Incoming Healing and Combat Advantage of his allies by 5%."
    },
    {
      "name": "Berserk",
      "text": "Evil can be annoying, but Minsc says don't get mad.. Get even - and mad! When Minsc or his friends take damage, Minsc has a chance to become enraged gaining increased damage and damage resistance."
    },
    {
      "name": "Sword Meet Evil",
      "text": "Minsc swings wildly into the fray, dispensing justice to all foes in front of him. The third hit deals additional damage."
    },
    {
      "name": "Three Hundred Pounds of Justice",
      "text": "Minsc slams sword first into the ground, crushing nearby enemies beneath his might and urging them to attack him."
    }
  ],
  "minstrel": [
    {
      "name": "Inspire Regeneration",
      "text": "The minstrel sings your greatness, inspiring you and regenerating your health over 10 seconds."
    },
    {
      "name": "Resounding Inspiration",
      "text": "Increases the amount healed by Inspired Regeneration."
    },
    {
      "name": "Tragic Tale",
      "text": "The minstrel sings a woeful tune that damages the foe and has a chance to slow them for 10 seconds."
    }
  ],
  "moonshae druid": [
    {
      "name": "Call Lightning",
      "text": "A lightning storm strikes within 5' of target foe's feet for a short duration, dealing area damage and stunning the target. This stun cannot occur more than once every 30 seconds."
    },
    {
      "name": "Electrified Area",
      "text": "Area damaged by Call Lightning increases by 5' and daze cooldown reduces by 5 seconds."
    },
    {
      "name": "Fire Seed",
      "text": "Throw a fire seed at the target, dealing impact damage and additional damage over time."
    }
  ],
  "myconid": [
    {
      "name": "Give me Spore",
      "text": "Myconid's Slam now spawns a poison mushroom to deal extra damage to nearby foes."
    },
    {
      "name": "Punch",
      "text": "A punch that damages the target foe."
    },
    {
      "name": "Slam",
      "text": "A slam that sprouts mushrooms that damage the target foe."
    }
  ],
  "mystagogue": [
    {
      "name": "Arcane Warping",
      "text": "Slow now lasts twice as long and Chilling Cloud deals bonus damage."
    },
    {
      "name": "Chilling Cloud",
      "text": "Blasts a group of enemies with chilling cold, dealing damage."
    },
    {
      "name": "Slow",
      "text": "Slows nearby enemies, greatly reducing their move speed."
    }
  ],
  "mystic phoera": [
    {
      "name": "Feathers of Flame",
      "text": "Scatters several flaming feathers in a cone in front of it."
    },
    {
      "name": "Fiery Talon",
      "text": "Rakes the target and sets it on fire for a few seconds."
    },
    {
      "name": "Phoenix Heat",
      "text": "Deal fire damage to all nearby foes every second."
    }
  ],
  "netherese arcanist": [
    {
      "name": "Deadly Embrace",
      "text": "Shadow's Embrace now converts some of it's damage into health."
    },
    {
      "name": "Netherese Strike",
      "text": "The Netherese summons shadows to smother the foe in a sickly mass of darkness, dealing damage over time."
    },
    {
      "name": "Shadow's Embrace",
      "text": "Rip the life essence from the target, dealing damage."
    }
  ],
  "neverember guard": [
    {
      "name": "Dutybound",
      "text": "When receiving damage the Guard has a chance to gain a second wind and heal himself for 15% of his max HP."
    },
    {
      "name": "Shield Charge",
      "text": "A charging attack that damages the target."
    },
    {
      "name": "Stab",
      "text": "Strikes the target, dealing damage."
    }
  ],
  "neverember guard archer": [
    {
      "name": "Deadeye",
      "text": "True Shot slows the target on impact by 3' per second for 4 seconds."
    },
    {
      "name": "Heavy Fire",
      "text": "Fired from a fully drawn bow, this arrow penetrates through targets and deals additional damage to enemies hit by True Shot."
    },
    {
      "name": "True Shot",
      "text": "An arrow, fired straight and true, that deals damage to a targeted foe."
    }
  ],
  "neverwinter knight": [
    {
      "name": "Hammer Blow",
      "text": "A forceful swing with a heavy weapon, dealing a damaging blow."
    },
    {
      "name": "Neverwintan Bulwark",
      "text": "Increases the Defense of nearby allies by 2%."
    },
    {
      "name": "Shield Charge",
      "text": "A charging attack that damages the target."
    }
  ],
  "owl": [
    {
      "name": "Owl's wisdom",
      "text": "Makes Owl immune to damage while using it's buffet power."
    },
    {
      "name": "Talon Attack",
      "text": "Your owl strikes a foe with his powerful talons."
    },
    {
      "name": "Talon Strike",
      "text": "Using his natural speed and agility, the owl quickly strikes multiple foes."
    },
    {
      "name": "Wing Buffet",
      "text": "A wild buffeting attack that taunts your target."
    }
  ],
  "owlbear cub": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Accuracy, Combat Advantage, and Critical Severity shared with the owner."
    }
  ],
  "ox stot": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Hit Points, Defense, and Power shared with the owner."
    }
  ],
  "panda": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Critical Strike, Accuracy and Forte shared with the owner."
    }
  ],
  "panther": [
    {
      "name": "Claw",
      "text": "Claws the target, dealing damage. Damage is increased if the panther has combat advantage."
    },
    {
      "name": "Pounce",
      "text": "Pounces on a target, dealing damage and causing it to grant combat advantage for a short time."
    }
  ],
  "paranoid delusion": [
    {
      "name": "Clone",
      "text": "Manifests itself in its master's image, taking on his or her form."
    },
    {
      "name": "Mimic",
      "text": "Attacks with an at-will power that varies depending on the master's class."
    },
    {
      "name": "Paranoia",
      "text": "Infects the minds of enemies in an area with paranoia, briefly immobilizing them with fear."
    },
    {
      "name": "Scare Tactics",
      "text": "Confirms the enemies' fears, spooking them at the end of Paranoia's duration and knocking them prone."
    }
  ],
  "pewter golem": [
    {
      "name": "Crushing Whirl",
      "text": "A spinning attack the can crush up to 5 of the golem's enemies multiple times in every direction."
    },
    {
      "name": "Fist Smash",
      "text": "A crushing attack that can knockdown the golem's target."
    },
    {
      "name": "Toxic Metal",
      "text": "Adds a poison attack to the Fist Smash ability."
    }
  ],
  "phase spider": [
    {
      "name": "Bite",
      "text": "Slam down on the target and deal damage with a bite."
    },
    {
      "name": "Phasing Bite",
      "text": "Teleport behind the enemy and attack them to deal damage."
    },
    {
      "name": "Planar Venom",
      "text": "All attacks have chance to poison the target for 6 seconds."
    }
  ],
  "phoera": [
    {
      "name": "Feathers of Flame",
      "text": "Scatters several flaming feathers in a cone in front of it."
    },
    {
      "name": "Fiery Talon",
      "text": "Rakes the target and sets it on fire for a few seconds."
    },
    {
      "name": "Phoenix Heat",
      "text": "Deal fire damage to all nearby foes every second."
    }
  ],
  "pig": [
    {
      "name": "Charge",
      "text": "Charges at and deals damage to target foe."
    },
    {
      "name": "Filthy Animal",
      "text": "The mud thrown around by Mud Sling is extra potent, dealing extra damage and slowing affected targets by 3' per second for 7 seconds."
    },
    {
      "name": "Mud Sling",
      "text": "Thows mud all over, dealing damage to nearby foes."
    }
  ],
  "polar bear cub": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Critical Strike, Awareness, and Power shared with the owner."
    }
  ],
  "portal hound": [
    {
      "name": "Bite",
      "text": "Bite down on the target, dealing damage."
    },
    {
      "name": "Dimensional Jaws",
      "text": "Bite once and then follow up with a second bite through a portal, dealing damage."
    },
    {
      "name": "Portal Charge",
      "text": "Teleports the Portal Hound in front of the target when attempting to bite from out of range."
    }
  ],
  "portobello davinci": [
    {
      "name": "D&D In Session",
      "text": "When you have a team of 5 players, Portobello DaVinci will start a roleplaying group. This causes your team to gain 3.5% Power and Combat Advantage."
    },
    {
      "name": "Fireball",
      "text": "Blast the target with a fire projectile that explodes on impact and deals damage to nearby foes."
    },
    {
      "name": "Magic Missile",
      "text": "Blast the enemy with arcane damage."
    }
  ],
  "priestess of sehanine moonbow": [
    {
      "name": "Full Moon",
      "text": "Increases the duration of Moon Shadow and Moon Beams by 50%."
    },
    {
      "name": "Moon Beams",
      "text": "Reduces Critical Avoidance for enemies within 20' by 50 per companion level and increases Critical Strike for allies within 20' by 50 per companion level for 6 seconds."
    },
    {
      "name": "Moon Shadow",
      "text": "The Priestess vanishes from sight, confusing up to 5 enemies within 10' for 4 seconds."
    }
  ],
  "priestess of sune": [
    {
      "name": "Blessings of Sune",
      "text": "Wraps you with the Blessing of Sune, making you more difficult to hit by increasing Deflection for 4 seconds."
    },
    {
      "name": "Sune's Gift",
      "text": "Increases the power of Sune's Grace by 25%."
    },
    {
      "name": "Sune's Grace",
      "text": "The power of Sune's Grace heals 3%-18% of owner's Max Health over 5 seconds."
    }
  ],
  "pseudodragon": [
    {
      "name": "Bite",
      "text": "The Pseudodragon's jaws snap twice with astounding speed and strength to deal damage to target foe."
    },
    {
      "name": "Poison Sting",
      "text": "Whip target foe with a poison barbed tail. The target takes damage from the tail and is poisoned for 5 seconds."
    },
    {
      "name": "Rampant Venom",
      "text": "Pseudodragon's poison spreads rapidly to the victim's brain. Poisoned enemies are more vulnerable, granting combat advantage and taking more damage from Snapping jaws."
    }
  ],
  "quasit": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Defense, Power, and Accuracy shared with the owner."
    }
  ],
  "quickling": [
    {
      "name": "Fey Speed",
      "text": "Quick Cuts hits two additional times."
    },
    {
      "name": "Quick Cuts",
      "text": "Slash the target multiple times in rapid succession, knocking the target back."
    },
    {
      "name": "Sprinting Strike",
      "text": "Sprint at a foe to deal damage"
    }
  ],
  "rabbit kit": [
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Accuracy, Awareness, and Critical Avoidance shared with the owner."
    }
  ],
  "rat pup": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Hit Points, Combat Advantage, and Power shared with the owner."
    }
  ],
  "razorwood": [
    {
      "name": "Blighted Claw",
      "text": "A claw swipe dealing damage to nearby enemies"
    },
    {
      "name": "Vinecrash",
      "text": "Vines shoot in a cone hurting enemies in their path."
    },
    {
      "name": "Wooden Spike",
      "text": "Wooden spikes shoot up from the ground causing damage and knocking enemies back."
    }
  ],
  "rebel mercenary": [
    {
      "name": "Consumed by Battle",
      "text": "The final strike of Wicked Strike now has a chance to increase the companion's damage by 10%"
    },
    {
      "name": "Weapon Master",
      "text": "An attack using a mastery of great weapons. This attack increases critical strike chance on every successive hit."
    },
    {
      "name": "Wicked Strike",
      "text": "Deals damage to many foes standing in the way of this attack."
    }
  ],
  "red dragon ioun stone": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Awareness, Defense, and Control Bonus shared with the owner."
    }
  ],
  "red slaad": [
    {
      "name": "Goading Bash",
      "text": "A punishing hit to the target enemy that raises your companion's defense by 20% for 3 seconds."
    },
    {
      "name": "Shoulder Slam",
      "text": "A charging attack that damages the target."
    },
    {
      "name": "Takedown Fist",
      "text": "Goading Bash now knocks targets down if the Red Slaad has combat advantage."
    }
  ],
  "redcap powrie": [
    {
      "name": "Inevitable Doom",
      "text": "Slice stacks Doom on the target, granting 15% bonus damage to Murderous Charge per stack (Max of 4). Murderous Charge removes all stacks of Doom."
    },
    {
      "name": "Murderous Charge",
      "text": "Single out a target foe then charge them and deal a devastating strike."
    },
    {
      "name": "Slice",
      "text": "Deals damage to target foe."
    }
  ],
  "redeemed fallen": [
    {
      "name": "Hellish Flurry",
      "text": "Piercing Flurry now does additional damage over time."
    },
    {
      "name": "Piercing Flurry",
      "text": "The Fallen Redeemed strikes with two slashes followed by a flurry of attacks."
    },
    {
      "name": "Slash",
      "text": "Slash target foe with the sword to deal damage. This attack deals 40% additional damage to targets granting combat advantage."
    }
  ],
  "regis": [
    {
      "name": "Charge 'Em Up",
      "text": "Increases Recharge Speed for allies by 3%."
    },
    {
      "name": "Sly Flourish",
      "text": "Strike the enemy with a series of 4 quick strikes."
    },
    {
      "name": "Whirlwind of Blades",
      "text": "Blades thrown out in every direction."
    }
  ],
  "remorhaz": [
    {
      "name": "Excavate",
      "text": "Whenver you dig up a relic, the Remorhaz burrows underground in search of an additional relic with a 20% chance of success. The rarity of the relic found is based on your chance to find rare relics."
    },
    {
      "name": "Fire Bile",
      "text": "Hurls a ball of fire onto the ground that lingers for 4 seconds, dealing damage every second to enemies that stand in it."
    },
    {
      "name": "Fire Burst",
      "text": "Releases a burst of fire that deals damage to the target."
    },
    {
      "name": "Relic Scavenger",
      "text": "Doubles the chance for the Remorhaz to find an additional relic when using Excavate."
    }
  ],
  "renegade evoker": [
    {
      "name": "Critical Combustion",
      "text": "Critical hits cause the target to catch fire and deal additional damage over time."
    },
    {
      "name": "Fireball",
      "text": "Blasts the target with a fire projectile that explodes on impact and deals damage to up to 5 nearby foes."
    },
    {
      "name": "Pillar of Flame",
      "text": "A pillar of flame erupts under the target foe and deals damage."
    }
  ],
  "renegade illusionist": [
    {
      "name": "Haunting Illusions",
      "text": "Mirror Image summons a second image to wrack the target's mind with horrifying images. These images daze the target and cannot occur more than once every 25 seconds."
    },
    {
      "name": "Mirror Image",
      "text": "Summons an identical image to cast a movement hindering spell while the illusionist attacks the target with a psychic beam."
    },
    {
      "name": "Phantom Bolt",
      "text": "A phantom bolt of psychic energy strikes target foe and deals damage."
    }
  ],
  "repentant dragon cultist": [
    {
      "name": "Acidic Stab",
      "text": "Strikes the target with a corrosive blade, dealing damage over time for 6 seconds."
    },
    {
      "name": "Draconic Incarnation",
      "text": "Fully Heals the companion and increases the companion's Maximum Hit Points by 100% and Damage by 25% for 10 seconds."
    },
    {
      "name": "Dragon Rage",
      "text": "Increases the duration of Draconic Incarnation by 5 seconds."
    }
  ],
  "rimefire golem": [
    {
      "name": "Draining Heat",
      "text": "Grants 150 bonus Critical Avoidance."
    },
    {
      "name": "Frozen Fist",
      "text": "Smashes the target with his fist, dealing damage, and focusing their anger."
    },
    {
      "name": "Rimefire Unleashed",
      "text": "The power of Rimefire explodes out of the golem damaging up to 5 foes."
    }
  ],
  "rumpadump": [
    {
      "name": "Animating Spores",
      "text": "Rumpadump uses spores to animate the corpse of a fallen creature and have it infect the target, inflicting high damage over time."
    },
    {
      "name": "Fist Attack",
      "text": "A violent punch."
    },
    {
      "name": "Hallucinating Spores",
      "text": "Infects the target with spores, dealing damage over time."
    },
    {
      "name": "Multi-Attack",
      "text": "Rumpadump periodically releases Pacifying Spores when attacking, stunning its target."
    }
  ],
  "rust monster": [
    {
      "name": "Bite",
      "text": "Chomp down on target foe with teeth and mandibles to deal damage."
    },
    {
      "name": "Corrosive Touch",
      "text": "Corrodes the target dealing damage."
    },
    {
      "name": "Hypercorrosion",
      "text": "The rusting caused by Corrosive Touch becomes rampant, spreading to the target's armor causing them to take additional damage over time."
    }
  ],
  "savage allosaur": [
    {
      "name": "Broadside",
      "text": "A lunge into enemies which will cause damage and knock them back."
    },
    {
      "name": "Overbite",
      "text": "Several bites chained in a row dealing direct damage to the enemy."
    },
    {
      "name": "Tailwhip",
      "text": "A tailswipe which damages and knocks down enemies."
    },
    {
      "name": "Terrifying Roar",
      "text": "A terrifying roar that stuns enemies."
    }
  ],
  "sellsword": [
    {
      "name": "Consumed by Battle",
      "text": "The final strike of Wicked Strike now has a chance to increase the companion's damage by 10%"
    },
    {
      "name": "Weapon Master",
      "text": "An attack using a mastery of great weapons. This attack increases critical strike chance on every successive hit."
    },
    {
      "name": "Wicked Strike",
      "text": "Deals damage to many foes standing in the way of this attack."
    }
  ],
  "sergeant knox": [
    {
      "name": "Reaping Strike",
      "text": "An all-out attack that hits up to 5 targets around Knox and also gives him 25% damage resistance for 5 seconds."
    },
    {
      "name": "Wicked Strike",
      "text": "Sergeant Knox swings his famous axe, damaging foes to his front. The second hit deals additional damage and the third hit still more."
    },
    {
      "name": "Will Not Fail",
      "text": "Reduces all incoming damage by 33%"
    }
  ],
  "shadar-kai witch": [
    {
      "name": "Beshadowed Mind",
      "text": "A cloud of necrotic energy that damages and dazes targets."
    },
    {
      "name": "Grasp of Shadows",
      "text": "A necrotic hand springs from beneath the target, dealing damage and knocking it into the air."
    },
    {
      "name": "Visage of the Shadowfell",
      "text": "A necrotic blast strikes target foe and deals damage."
    }
  ],
  "shadow demon": [
    {
      "name": "One with the Shadows",
      "text": "Doubles the time that the Shadow Demon stays stealthed after a Shadow Strike. Increases the Shadow Demon's Deflect chance and Deflect Severity by 25%"
    },
    {
      "name": "Shadow Claw",
      "text": "Deals damage to target foe with a single terrifying swipe."
    },
    {
      "name": "Shadow Strike",
      "text": "Appear behind the target and strike with both claws. Disappear into the shadows for a short time afterwards."
    }
  ],
  "shadow elemental": [
    {
      "name": "Creeping Death",
      "text": "Increasing Crit Avoidance by 1.5% and Movement Speed by 2% for allies."
    },
    {
      "name": "Shadow Assassination",
      "text": "A lunge to the enemy, followed up with a powerful melee attack."
    },
    {
      "name": "Stab",
      "text": "A vicious stab."
    }
  ],
  "shieldmaiden": [
    {
      "name": "Crushing Strike",
      "text": "Strikes the target, dealing damage."
    },
    {
      "name": "Lunging Strike",
      "text": "Charges at a foe, dealing damage."
    },
    {
      "name": "Seasoned Scrapper",
      "text": "Bonus 25% chance to deflect."
    }
  ],
  "siege master": [
    {
      "name": "Direct Catapult",
      "text": "Call down a catapult strike on your enemy."
    },
    {
      "name": "Master of Sieges",
      "text": "Doubles the number of boulders called in with Direct Catapult."
    },
    {
      "name": "Shield Wall",
      "text": "Chance to buff your owner with each attack."
    }
  ],
  "silver-scaled cleric disciple": [
    {
      "name": "Divine Wildfire",
      "text": "Increases the radius of Sacred Flame Healing."
    },
    {
      "name": "Healing Word",
      "text": "Heals the summoner over 10 seconds."
    },
    {
      "name": "Sacred Flame",
      "text": "Sears foes with radiant flame. On third hit deals damage and heals nearby friendly players."
    }
  ],
  "simril's holiday helper": [
    {
      "name": "Frost Bite",
      "text": "Ice Boulder will also slow enemies down for 5 seconds."
    },
    {
      "name": "Ice Boulder",
      "text": "Hurls an ice-packed boulder at the enemies, damaging with a chance on knockdown."
    },
    {
      "name": "Snowball",
      "text": "Throws a snowball at the enemy that damages."
    }
  ],
  "skeletal dog": [
    {
      "name": "Bite",
      "text": "A vicious bite that deals direct damage to target foe."
    },
    {
      "name": "Crippling Bite",
      "text": "Bite slows movement speed of targets that are hit to 25% for 6 seconds."
    },
    {
      "name": "Takedown",
      "text": "Bites the legs of the target. The target is knocked down if the dog has combat advantage."
    }
  ],
  "skeleton": [
    {
      "name": "Bludgeon",
      "text": "Deals damage to target foe."
    },
    {
      "name": "Bonemeal",
      "text": "Bashes a single target with the shield. This attack does bonus damage to undead."
    },
    {
      "name": "Tenderizer",
      "text": "Bludgeon stacks Tender on the target, granting 10% bonus damage to Bonemeal per stack. Bonemeal removes all stacks of Tender."
    }
  ],
  "skyblazer": [
    {
      "name": "Cleave",
      "text": "Strikes the target with a grevious attack."
    },
    {
      "name": "Favored Enemy",
      "text": "Skyblazer does 25% extra damage against Fiends."
    },
    {
      "name": "Sword Slash",
      "text": "Strikes target with a flourish attack."
    }
  ],
  "slyblade kobold": [
    {
      "name": "Between the Ribs",
      "text": "Slash now deals 100% more damage to targets affected by Gluepot."
    },
    {
      "name": "Gluepot",
      "text": "A sticky pot of goopy glue keeps your target in place for a few seconds."
    },
    {
      "name": "Slash",
      "text": "The Kobold uses both blades, leaving behind deadly gashes."
    }
  ],
  "snow leopard": [
    {
      "name": "Chilling Claws",
      "text": "Rake the target and send frost through their veins, slowing the target. If the target is already slowed, the snow leopard's damage is increased by 5% for 6 seconds."
    },
    {
      "name": "Swipe",
      "text": "Claws the target, dealing damage."
    },
    {
      "name": "Thril of the Hunt",
      "text": "Swipe cuts extra deep against targets weakened by Chilling Claws, causing a short bleed for additional damage."
    }
  ],
  "snowy fawn": [
    {
      "name": "Gift of Life",
      "text": "Increases effect of Natures Vigor to triple the Fawn's Power."
    },
    {
      "name": "Nature's Vigor",
      "text": "Regen health over 6 seconds."
    },
    {
      "name": "Spring of Life",
      "text": "Creates a healing spring that lasts for 10 seconds."
    }
  ],
  "songstress": [
    {
      "name": "Discordant Discouragement",
      "text": "The bard plays a discordant note that damages the foe and has a chance to stun them for 2 seconds."
    },
    {
      "name": "Slash",
      "text": "Swings through foes in front of you, dealing damage."
    },
    {
      "name": "Thrust",
      "text": "Deals damage to target foe with a single, well-placed attack."
    }
  ],
  "soradiel": [
    {
      "name": "Blade of Light",
      "text": "Deal physical damage to target enemy."
    },
    {
      "name": "Cleaving Blade",
      "text": "Deal physical damage to enemies in a cone."
    },
    {
      "name": "Shatterfall",
      "text": "Swordfall now has a chance to increase all target's damage taken by 1%."
    },
    {
      "name": "Swordfall",
      "text": "Deal radiant damage to enemies at the target location."
    }
  ],
  "spined devil": [
    {
      "name": "Impaling Fork",
      "text": "A more forcefully thrown pitchfork that impales the target, making them vulnerable for a short duration."
    },
    {
      "name": "Spine Fling",
      "text": "A flick of the tail that unleashes a torrent of burning hot spines that cause burning for a short duration."
    },
    {
      "name": "Thrown Fork",
      "text": "Throws a pitchfork at the target."
    },
    {
      "name": "Toxic Barbs",
      "text": "The spines thrown by Spine Fling now additionally poison for a short duration."
    }
  ],
  "splinters": [
    {
      "name": "Clean Slate",
      "text": "Sweeps away the dirt and grime from battle making you squeaky clean healing you, damaging the targets around you, and increasing it's damage for a period of time."
    },
    {
      "name": "Clean Sweep",
      "text": "Forward sweeping attack that can disorient the target."
    },
    {
      "name": "Swept off Their Feet",
      "text": "Sweeping arc attack that sends forth a blast of dust knocking targets back filling their lungs with dust causing them to choke and slowing their movement speed."
    }
  ],
  "sprite": [
    {
      "name": "Good and Evil",
      "text": "Sprites have an uncanny ability to discern good and evil natures in mortal hearts.~~Judging your foe to be evil, the Sprite's Languishing Shot now poisons the target; dealing 10% more damage over 5 seconds.~~The Sprite will sometimes give good natured friends a douse of well-aimed magic, which makes"
    },
    {
      "name": "Languishing Shot",
      "text": "The Sprite's poison arrow make their victims sleepy for 1 second. The sleep cannot activate more than once every 22 seconds."
    },
    {
      "name": "Split the Tree",
      "text": "The Sprite shoots two war arrows that cause painful wounds."
    }
  ],
  "staldorf": [
    {
      "name": "Jab",
      "text": "Strikes the target with its claws, dealing damage."
    },
    {
      "name": "Rebuttal",
      "text": "Flies up a short distance and crashes to the ground, damaging nearby enemies."
    },
    {
      "name": "Shock Value",
      "text": "Enemies that strike Staldorf during Rebuttal's cast time become dazed, and other nearby enemies also become dazed for a lesser duration."
    }
  ],
  "stalwart golden lion": [
    {
      "name": "Aureal Claw",
      "text": "Rake a foe with radiant fire dealing physical damage and radiant damage over time."
    },
    {
      "name": "Aurulent Coalition",
      "text": "Intercepts 10% of the damage allies within 5' would take. If any allies are standing within the effect area of Aurulent Coalition the threat generated by Aurulent Roar will instead be directed to those allies."
    },
    {
      "name": "Aurulent Roar",
      "text": "A sky shattering roar that grants nearby party members 2 stacks of Radiant Weapon.~~Radiant Weapon grants 2% additional damage as radiant damage for 12 seconds. You may have no more than 8 stacks of Radiant Weapon from any source."
    },
    {
      "name": "Aurum Armor",
      "text": "The lion's radiant aura forms armor in combat. Visual only."
    }
  ],
  "star of simril": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Critical Avoidance, Awareness, and Power shared with the owner."
    }
  ],
  "storm rider": [
    {
      "name": "Charged Shot",
      "text": "A charged arrow that deals additional damage to enemies slowed by Ice Arrow."
    },
    {
      "name": "Chilling Arrowheads",
      "text": "Ice Arrow slows the target on impact by 3' per second for 4 seconds."
    },
    {
      "name": "Ice Arrow",
      "text": "An arrow of made of ice that deals damage to a targeted foe."
    }
  ],
  "stronghold's cleric": [
    {
      "name": "Aid and Protect",
      "text": "Stronghold Cleric's Reinforced Aid All will also add a shield that is 5% of the allies' maximum health."
    },
    {
      "name": "Reinforced Aid",
      "text": "Heals all allies within 10 feet for 6 seconds."
    },
    {
      "name": "Sacred Flame",
      "text": "Sears foes with radiant flame. On third hit deals damage and heals nearby friendly players."
    }
  ],
  "succubus": [
    {
      "name": "Deadly Kiss",
      "text": "Damages and causes Vulnerability for a brief duration to enemies in a cone."
    },
    {
      "name": "Draining Kiss",
      "text": "A ranged single target attack."
    },
    {
      "name": "Enhanced Deadly Kiss",
      "text": "Deadly Kiss additionally reduces enemy outgoing damage for a brief duration."
    },
    {
      "name": "Necrotic Claw",
      "text": "A quick single target attack."
    }
  ],
  "sun of sune": [
    {
      "name": "Brilliance",
      "text": "A burst of sunlight the dazes those around."
    },
    {
      "name": "Healing Brilliance",
      "text": "Adds a heal to Brilliance"
    },
    {
      "name": "Solar Flare",
      "text": "[UNTRANSLATED: ]"
    },
    {
      "name": "Sunbeam",
      "text": "A beam of fire that burns the target"
    }
  ],
  "swashbuckler": [
    {
      "name": "Devastating Impact",
      "text": "Shield Charge grants combat advantage on the target."
    },
    {
      "name": "Shield Charge",
      "text": "Charge at target foe and hit them with the edge of the shield to deal damage."
    },
    {
      "name": "Slash",
      "text": "Slash target foe with the sword to deal damage. This attack deals 40% additional damage to targets granting combat advantage."
    }
  ],
  "sylph": [
    {
      "name": "Buffeting Wings",
      "text": "A focused blast of wind that deals damage to target foe."
    },
    {
      "name": "Dazzling Sunray",
      "text": "A ray of sunlight that dazes and deals damage to target foe. The daze cannot activate more than once every 25 seconds."
    },
    {
      "name": "Kindling Wind",
      "text": "Dazzling Sunray burns the target and deals additional damage over time."
    }
  ],
  "tamed velociraptor": [
    {
      "name": "Chomp",
      "text": "A vicious bite that deals direct damage to target foe."
    },
    {
      "name": "Pounce",
      "text": "Raptor pounces on the target, doing damage with a 10% chance of knocking them down."
    },
    {
      "name": "Prepare to Strike",
      "text": "Increases Pounce's knockdown chance by 10%."
    }
  ],
  "tomb spider": [
    {
      "name": "Bite",
      "text": "Spider fangs tear at the target foe to deal damage."
    },
    {
      "name": "Rake",
      "text": "Razor sharp legs strike the target foe to deal damage."
    },
    {
      "name": "Weaver's Grasp",
      "text": "The Tomb Spider's attacks apply Webbing, which slows the target and causes Physical damage over time."
    }
  ],
  "traveling entertainer": [
    {
      "name": "Breathe Fire",
      "text": "Sets up to 5 target foes on fire, dealing initial fire damage and burning damage over time."
    },
    {
      "name": "Burn Hotter",
      "text": "Breathe Fire now does 50% more burning damage over time."
    },
    {
      "name": "Firework Blast",
      "text": "Shoots fireworks that explode on impact and deals damage to the target and up to 5 nearby foes."
    }
  ],
  "trobriand's construct": [
    {
      "name": "Discharge",
      "text": "A punch to the enemy, causing damage and knocking the enemy back."
    },
    {
      "name": "Jab",
      "text": "A jab dealing damage to the enemy."
    },
    {
      "name": "Shockwave",
      "text": "Burst of energy in a cone hurting enemies in their path."
    }
  ],
  "tutor": [
    {
      "name": "Class In Session",
      "text": "When you have a team of 5 players, the Tutor will start a study group increasing their Combat Advantage by 5%"
    },
    {
      "name": "Instructional Aid",
      "text": "To teach both students and enemies alike the importance of fencing, the Tutor will summon a spiritual weapon to help assist him."
    },
    {
      "name": "Slash",
      "text": "Swings through the foes in front of him, dealing damage."
    },
    {
      "name": "Thrust",
      "text": "Deals damage to target foe with a single, well-placed attack."
    }
  ],
  "vallenhas elite soldier": [
    {
      "name": "Alric's Teachings",
      "text": "Gives Shield Charge a chance to knockback enemies and For Vallenhas! a radiant damage over time effect."
    },
    {
      "name": "For Vallenhas!",
      "text": "Sweeping strike that deals extra damage to Avernus devils"
    },
    {
      "name": "Shield Charge",
      "text": "A charging attack that deals extra damage to Avernus devils."
    },
    {
      "name": "Stab",
      "text": "Strikes enemies and can cause them to bleed for a period of time."
    }
  ],
  "vanguard of the citadel": [
    {
      "name": "Cleaving Spear",
      "text": "Deal physical damage to enemies in a cone."
    },
    {
      "name": "Judgement",
      "text": "Deal radiant damage to target enemy."
    },
    {
      "name": "Spear of Light",
      "text": "Deal physical damage to target enemy."
    },
    {
      "name": "Take a Knee",
      "text": "Pummel has a chance of stunning its target."
    }
  ],
  "vicious dire wolf": [
    {
      "name": "Dire Fury",
      "text": "While the Dire Wolf has combat advantage against a foe, its attacks also knock its target prone."
    },
    {
      "name": "Tear",
      "text": "Tears at the target, causing a bleeding effect."
    },
    {
      "name": "Vicious Bites",
      "text": "Three quick bites in succession that stagger the target backwards."
    }
  ],
  "vistani wanderer": [
    {
      "name": "Duelist's Flurry",
      "text": "The Vistani Wanderer strikes with two slashes followed by a flurry of attacks."
    },
    {
      "name": "Gloaming Cut",
      "text": "The Vistani Wanderer delivers a precise attack to the foe, aiming for vulnerable parts."
    },
    {
      "name": "Swift Feet",
      "text": "The Vistani Wanderer and all nearby player allies gain 5% increased Movement Speed."
    }
  ],
  "volcanic galeb duhr": [
    {
      "name": "Lava Eruption",
      "text": "A fierce stomp that forces the earth to rupture around the target, damaging nearby enemies."
    },
    {
      "name": "Lava Smash",
      "text": "The Volcanic Galeb Duhr smashes his fist into his enemy, burning his foe."
    },
    {
      "name": "Stone Warden",
      "text": "Deal up to 50% more damage based on how much HP is missing. Every 10 seconds heal for 8% of missing health."
    }
  ],
  "wandering scarecrow": [
    {
      "name": "Claws",
      "text": "A savage claw attack."
    },
    {
      "name": "Fearful Loathing",
      "text": "Increases the damage and reduces the time between stuns of Horrid Gaze by 10 seconds."
    },
    {
      "name": "Horrid Gaze",
      "text": "A terrifying gaze that damages and stuns its target for 2 seconds. The disabling effect only happens every 25 seconds."
    }
  ],
  "war boar": [
    {
      "name": "Gore",
      "text": "Gores the enemy with its sharp tusks, dealing damage and leaving a bleeding wound that stacks with each hit."
    },
    {
      "name": "Rampage",
      "text": "Charges up to three nearby enemies in rapid succession, dealing damage."
    },
    {
      "name": "Takedown",
      "text": "Rampage also knocks down targets. This does not affect player targets."
    }
  ],
  "war dog": [
    {
      "name": "Bite",
      "text": "Deals damage and snares the target."
    },
    {
      "name": "Crippling Bite",
      "text": "The Bite attack slows movement speed of targets that are hit to 25% for 6 seconds."
    },
    {
      "name": "Takedown",
      "text": "Bites the legs of the target, dealing damage. The target is knocked down if the dog has combat advantage."
    }
  ],
  "water archon": [
    {
      "name": "Power of the Tides",
      "text": "Tidal blast does more damage and provides more damage resistance."
    },
    {
      "name": "Tidal Blast",
      "text": "The Water Archon strikes out with tidal power, damaging foes arround him and become highly resistant to damage."
    },
    {
      "name": "Trident Strike",
      "text": "Strikes with the force of the ocean, damaging your foe and rooting him in place."
    }
  ],
  "watler": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Combat Advantage, Awareness, Defense shared with the owner."
    }
  ],
  "wayward wizard": [
    {
      "name": "Arcane Warping",
      "text": "Slow now lasts twice as long and Chilling Cloud deals bonus damage."
    },
    {
      "name": "Chilling Cloud",
      "text": "Blasts a group of enemies with chilling cold, dealing damage."
    },
    {
      "name": "Slow",
      "text": "Slows nearby enemies, greatly reducing their move speed."
    }
  ],
  "wererat thief": [
    {
      "name": "Creeping Death",
      "text": "Poison now deals 30% more damage and Devastating Smash deals 30% more to poisoned targets."
    },
    {
      "name": "Devastating Smash",
      "text": "Whirls around, attacking all nearby enemies and knocking them back."
    },
    {
      "name": "Poison Strike",
      "text": "Strikes all targets in an arc, dealing damage and poisoning it."
    }
  ],
  "werewolf": [
    {
      "name": "Bloodthirst",
      "text": "Grants the owner +10% Life Steal Chance as long as an enemy is infected with Lycanthropy."
    },
    {
      "name": "Lycanthropy",
      "text": "Bites a weak-willed humanoid enemy, turning it into a werewolf for 10 seconds that will temporarily fight by your side."
    },
    {
      "name": "Slash",
      "text": "Performs a wide sweep with its blade, dealing damage to enemies in a cone."
    }
  ],
  "wiggins the undead intern": [
    {
      "name": "Slash",
      "text": "You swing through foes in front of you, dealing damage."
    },
    {
      "name": "Thrust",
      "text": "Deals damage to target foe with a single, well-placed attack."
    },
    {
      "name": "Union Strike",
      "text": "If Wiggins stays in combat for longer than 30 seconds, he will start a strike, summoning other undead interns for 60 seconds."
    }
  ],
  "wild hunt rider": [
    {
      "name": "Hunter's Tenacity",
      "text": "For each percent of health missing, the Wild Hunt Rider gains 5 defense."
    },
    {
      "name": "Leaping Spear",
      "text": "A poised leap through the air ending in a devastating thrust that deals damage to the target foe."
    },
    {
      "name": "Puncture",
      "text": "Stabs the spear into target foe, dealing damage on impact and when ripping the spear out."
    }
  ],
  "will-o'-wisp": [
    {
      "name": "Flash",
      "text": "A burst of magical light that deals damage to up to 5 nearby foes."
    },
    {
      "name": "Magical Charge",
      "text": "Shock deals additional damage and can daze targets once every 15 seconds."
    },
    {
      "name": "Shock",
      "text": "Zap the target with a tiny bolt that deals damage and dazes the target. This daze cannot activate more than once every 25 seconds."
    }
  ],
  "windsoul genasi": [
    {
      "name": "Flail Strike",
      "text": "Spins around and hits up to 5 enemies with multiple attacks in every direction."
    },
    {
      "name": "Storm Pillar",
      "text": "A small bolt of lightning strikes the target and other enemies close by."
    },
    {
      "name": "Tempest Blade",
      "text": "A mighty thrust."
    }
  ],
  "winter fox": [
    {
      "name": "Augmentation",
      "text": "Adds your companion's ratings to your own while it is summoned. Increases your maximum Hit Points based on your level."
    },
    {
      "name": "Enhancement",
      "text": "Gives an additional bonus to Hit Points, Power, and Forte shared with the owner."
    }
  ],
  "winter wolf": [
    {
      "name": "Bite",
      "text": "Deals damage to target foe with giant, crushing jaws."
    },
    {
      "name": "Freezing Breath",
      "text": "Icy breath attack that reaches out in a long, narrow cone. Deals cold damage and slows targets caught in the breath."
    },
    {
      "name": "Taste for Frost",
      "text": "Foes slowed by Freezing Breath take additional damage from Bite and make delicious snacks for the Winter Wolf"
    }
  ],
  "wolf": [
    {
      "name": "Bite",
      "text": "A vicious bite that deals direct damage to target foe."
    },
    {
      "name": "Bleed",
      "text": "Rips the target's flesh leaves a bleeding wound that deals damage over time for 10 seconds."
    },
    {
      "name": "Go for the Jugular",
      "text": "Bleed now lasts 50% longer and the first tick hits twice."
    }
  ],
  "wulfgar": [
    {
      "name": "Action Star",
      "text": "Increases Action Point Gain for allies by 3%."
    },
    {
      "name": "Lunge",
      "text": "An aggressive lunge at the enemy."
    },
    {
      "name": "Swing",
      "text": "A forceful swing striking nearby foes."
    },
    {
      "name": "Wicked Strike",
      "text": "Damages foes in front of the companion. The third hit deals additional damage."
    }
  ],
  "xaryxian defector": [
    {
      "name": "Exploding Arrow",
      "text": "Fires an arrow at the enemy, dealing less damage in an area around the target."
    },
    {
      "name": "Starlight Beam",
      "text": "Unleashes starlight energy in a forward-facing cone, dealing damage to all enemies in its path."
    },
    {
      "name": "Sticky Bomb",
      "text": "Attaches a bomb to an enemy, dealing damage to the target and every enemy nearby after 4 seconds."
    }
  ],
  "xuna": [
    {
      "name": "Blood Bath",
      "text": "Xuna teleports to random enemies to stab them."
    },
    {
      "name": "Envenomed Blades",
      "text": "Blood Bath now poisons enemies."
    },
    {
      "name": "Stab",
      "text": "A vicious stab."
    }
  ],
  "yeth hound": [
    {
      "name": "Claw",
      "text": "Claws the target, dealing damage. Damage is increased if the panther has combat advantage."
    },
    {
      "name": "Petrified Defense",
      "text": "Yeth Hound gains an additional 300 Deflection."
    },
    {
      "name": "Pounce",
      "text": "Pounces on a target, dealing damage and causing it to grant combat advantage for a short time."
    }
  ],
  "yojimbo": [
    {
      "name": "Hayase",
      "text": "Deal damage to enemies in a narrow cone. Executes a 3-hit a combo."
    },
    {
      "name": "Iainuki",
      "text": "Deal damage to enemies in a large cone."
    },
    {
      "name": "Kawaki",
      "text": "Iainuki now has a chance to increase Yojimbo's damage by 10% for 5 seconds. Whenever you take damage, the Yojimbo teleports to your location and deflects 25% of that damage. This effect may not exceed 80% of your maximum hit points. This effect may occur once every 20 seconds."
    }
  ],
  "young yeti": [
    {
      "name": "Call for Blood",
      "text": "Fearsome Howl buffs the yeti's damage dealt by 10% and stacks up to 3 times."
    },
    {
      "name": "Claw",
      "text": "Deals damage to target foe with a single terrifying swipe."
    },
    {
      "name": "Fearsome Howl",
      "text": "A thunderous roar that deals damage to multiple foes and increases the companions damage by 10%."
    }
  ],
  "zariel": [
    {
      "name": "Blade of Light",
      "text": "Deal physical damage to target enemy."
    },
    {
      "name": "Cleaving Blade",
      "text": "Deal physical damage to enemies in a cone."
    },
    {
      "name": "Shatterfall",
      "text": "Swordfall now has a chance to increase all target's damage taken by 1%."
    },
    {
      "name": "Swordfall",
      "text": "Deal radiant damage to enemies at the target location."
    }
  ],
  "zhentarim warlock": [
    {
      "name": "Arcane Boost",
      "text": "Hellfire eruption now does additional damage over time."
    },
    {
      "name": "Eldritch Blast",
      "text": "A blast of eldritch flame scorches your target. The third strike also damages enemies around your primary target."
    },
    {
      "name": "Hellfire Eruption",
      "text": "Ignites target with hellfire, instantly dealing massive damage. The intense heat will also deal damage to their nearby allies."
    }
  ]
};
