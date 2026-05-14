"""Populate Bard class + Songblade/Minstrel paragons from screenshot intake 2026-05-13."""
import json
from pathlib import Path

PATH = Path("G:/ai_projects/nwcb/data/classes.json")
data = json.loads(PATH.read_text(encoding="utf-8"))

bard = next(c for c in data if c["name"] == "Bard")

# --- Class skills (visible in both paragons' Skills tab / general row) ---
bard["classFeatures"] = [
    {"name": "Thievery", "description": "You can see and disarm traps, preventing you from taking damage or getting stuck. You can also collect and sell treasure from special thievery objects.", "notes": "Bard utility skill. Auto-applied."},
    {"name": "Harmonize", "description": "Increases Action Point Gain by 2%.", "percentStats": {"Action Point Gain": 2}, "notes": "Bard class skill. Auto-applied."},
    {"name": "Critical Tuning", "description": "After playing a song that is not in a quick play slot, gain 10% Critical Severity for 20 seconds.", "trigger": "song played non-quickplay", "durationSeconds": 20, "percentStatsConditional": {"Critical Severity": 10}, "notes": "Bard class skill. Auto-applied conditional buff."},
    {"name": "Truly Inspired", "description": "Whenever you play a song in combat, that is not in a quickplay slot, you will receive an inspiration based on your paragon path. Songblade's Inspiration: Damage bonus +10%. Minstrel's Inspiration: Healing bonus +10%. Duration: 20s.", "trigger": "song played in combat non-quickplay", "durationSeconds": 20, "notes": "Bard class skill. Paragon-specific buff."}
]

# --- Class-shared at-wills ---
bard["powers"]["atWill"] = [
    {"name": "Reprise", "type": "atWill", "magnitude": 35, "castSeconds": 0.3, "rangeMelee": "200 arc", "notes": "Delivers a fourfold attack to enemies in a cone before you, dealing physical damage each hit."},
    {"name": "Fleche", "type": "atWill", "magnitude": 180, "enhancedMagnitude": 240, "castSeconds": 0.6, "range": 80, "notes": "Hurl a series of psychic bolts at target enemy. The third hit of the combo has enhanced magnitude."}
]

# --- Class-shared encounters ---
bard["powers"]["encounter"] = [
    {"name": "Lunge", "type": "encounter", "magnitude": 500, "castSeconds": 0.25, "range": 60, "addedEffect": "Stun", "durationSeconds": 1,
     "cooldownByParagon": {"Songblade": 6.8, "Minstrel": 7.1}, "notes": "Lunge at target enemy dealing physical damage."},
    {"name": "Dancing Lights", "type": "encounter", "magnitude": 900, "castSeconds": 0.8, "cooldownSeconds": 12.5, "range": 80, "addedEffect": "Daze (3s) + decreases target's damage dealt by 5% (6s)", "notes": "Deal psychic damage to target enemy."},
    {"name": "Flourish", "type": "encounter", "castSeconds": 0.9, "range": "Self", "durationSeconds": 4,
     "cooldownByParagon": {"Songblade": 15.5, "Minstrel": 16}, "addedEffect": "Increases damage and healing of encounter powers and songs by 30%. Activating any other encounter power or song allows for an additional use of Flourish for 4s.", "notes": "Does not affect song damage enhancements or ballad finales."},
    {"name": "Duet", "type": "encounter", "magnitude": "250x2", "castSeconds": 0.7, "cooldownSeconds": 13.7, "radius": 20, "addedEffect": "Daze 2s", "notes": "Delivers a twofold arcane damage attack to nearby enemies. If you hold a direction while initiating the power your character will launch in that direction."}
]

# --- Class-shared dailies ---
bard["powers"]["daily"] = [
    {"name": "Inspiration", "type": "daily", "castSeconds": 0.8, "range": "Self+15'", "actionPointCost": 1000, "healMagnitude": "400x5 HoT", "durationSeconds": 12,
     "addedEffect": "Grants you and the nearest ally within 15' immunity to most control effects, reduces damage taken by 15%, and increases damage dealt by 25%.",
     "notes": "Self+ally daily buff with HoT."},
    {"name": "Encore", "type": "daily", "castSeconds": 0, "actionPointCost": 1000, "notes": "Activate the last song you played without depleting your Performance Gauge."}
]

# --- Class-shared mechanics ---
bard["powers"]["mechanic"] = [
    {"name": "Roll", "type": "mechanic", "tactical": True, "castSeconds": 0, "notes": "Quickly dodge the direction you are running and briefly become immune to most damage and control effects. May only be activated while moving."},
    {"name": "Perform", "type": "mechanic", "castSeconds": 0, "notes": "Enter Performance Mode allowing for the activation of songs via a sequence of notes. Must have at least 100 Performance to begin. Performance Gauge fills gradually over time and is depleted when you play a song."},
    {"name": "Free Perform", "type": "mechanic", "castSeconds": 0, "addedEffect": "Out of combat only", "notes": "Enter free perform mode and create songs."}
]

# --- Songblade paragon ---
songblade = next(p for p in bard["paragonPaths"] if p["name"] == "Songblade")
songblade["powers"] = {
    "atWill": [
        {"name": "Con Elemento", "type": "atWill", "paragon": True, "magnitude": 140, "castSeconds": 0.8, "radius": 15,
         "addedEffect": "Changes type based on active song: Blaze Flamenco→Con Fuoco (fire AoE), Tailwind Mambo→Con Moto (projectile line), Steel March→Con Brio (physical cone)",
         "notes": "Deal fire damage to enemies in a radius around you by default."}
    ],
    "encounter": [
        {"name": "Ad Libitum", "type": "encounter", "paragon": True, "magnitude": 700, "castSeconds": 0.35, "cooldownSeconds": 13.7, "range": "Melee", "addedEffect": "50% chance to allow you to use this ability again immediately (max 3 times)", "notes": "Deal physical damage to target enemy."},
        {"name": "Contre", "type": "encounter", "paragon": True, "castSeconds": 4.75, "cooldownSeconds": 12.9, "range": "Self", "addedEffect": "Raise blade, absorbing 50% of damage from front of character up to 40% Max HP. Damage taken depletes stamina. Stamina cannot regenerate. Control immunity. On release: Contre Seconde (immediate, mag 500 AoE + knockdown), Contre Septime (after 1s, mag 1200 single target + knockback), Contre Neuvieme (after 2s, mag 900 AoE 3-hit).", "notes": "Hold for parry; release for one of three counter attacks."},
        {"name": "Volti Subito", "type": "encounter", "paragon": True, "magnitude": 300, "castSeconds": 0.9, "cooldownSeconds": 13.7, "range": 34, "addedEffect": "May be executed twice more in rapid succession within 6s.", "notes": "Rush forward dealing physical damage to enemies in a path before you."}
    ],
    "daily": [
        {"name": "Lore", "type": "daily", "paragon": True, "castSeconds": 1.2, "range": 80, "actionPointCost": 1000, "durationSeconds": 10,
         "addedEffect": "Increases the critical severity of attacks against the target by 10% and increasing your damage dealt by 20%. Also grants you physical, magic, or projectile lore. Attacks dealing damage of the matching type gain 10% damage bonus. Duration 30s.",
         "notes": "Identify the target's weakness."}
    ],
    "mechanic": [
        {"name": "Forte", "type": "mechanic", "paragon": True, "notes": "Songblade Forte: Power (primary), excels at Critical Severity and Deflect Severity."},
        {"name": "All the World's a Stage", "type": "mechanic", "paragon": True, "notes": "Increases your Performance Gauge maximum by 50. Extends the duration of most songs to 72s. Increases Performance regeneration."},
        {"name": "Battle Harmony", "type": "mechanic", "paragon": True, "notes": "Songs which grant a damage bonus now grant an additional damage bonus to party members whose damage matches the type of the song."}
    ],
    "songs": [
        {"name": "Ballad of the Hero", "type": "song", "paragon": True, "castSeconds": 1.1, "range": "Self", "performanceCost": 100, "durationSeconds": 20,
         "addedEffect": "Grants the effect of Ballad of the Hero, causing your at-wills, encounters, and dailies to deal additional radiant damage against the primary target. Magnitude: 85. Hero's Finale: While under the effect of Ballad of the Hero, Perform changes to Hero's Finale. Hero's Finale deals radiant damage to the target. Magnitude: 800. Cancels Ballad of the Hero.",
         "notes": "Does not cancel other songs."},
        {"name": "Ballad of the Witch", "type": "song", "paragon": True, "castSeconds": 1.1, "range": "Self", "performanceCost": 100, "durationSeconds": 20,
         "addedEffect": "Grants the effect of Ballad of the Witch, causing your at-wills, encounters, and dailies to deal additional arcane damage against all targets. Magnitude: 40. Witch's Finale: Perform changes to Witch's Finale. Mag 400 arcane damage to nearby enemies. Cancels Ballad of the Witch.",
         "notes": "Does not cancel other songs."},
        {"name": "Steel March", "type": "song", "paragon": True, "castSeconds": 1.1, "range": 40, "performanceCost": 100, "magnitude": 350, "durationSeconds": 72,
         "addedEffect": "Deal physical damage to enemies in a cone before you. Increases magnitude of your at-will/encounter actions by 20 and converts their damage type to physical. Increases damage dealt by nearby allies by 2% and an additional 2% for physical damage.",
         "notes": "Cancels other songs currently in effect."},
        {"name": "Tailwind Mambo", "type": "song", "paragon": True, "castSeconds": 1.1, "range": 80, "performanceCost": 100, "magnitude": 350, "durationSeconds": 72,
         "addedEffect": "Deal projectile damage to enemies in a line before you. Increases magnitude of your at-will/encounter actions by 20 and converts their damage type to projectile. Increases damage bonus of you and nearby allies by 2% and an additional 2% for projectile damage.",
         "notes": "Cancels other songs currently in effect."},
        {"name": "Rejuvenating Carol", "type": "song", "castSeconds": 1.1, "range": "Self", "performanceCost": 100, "healMagnitude": 100, "durationSeconds": 60,
         "addedEffect": "Apply a heal over time to self and all nearby allies.",
         "notes": "Cancels other songs currently in effect."},
        {"name": "Blaze Flamenco", "type": "song", "castSeconds": 1.1, "range": 30, "performanceCost": 100, "magnitude": 350, "durationSeconds": 72,
         "addedEffect": "Deal fire damage to nearby enemies. Increases the magnitude of your at-will/encounter actions by 20 and converts their damage type to fire. Increases damage bonus of you and nearby allies by 2% and an additional 2% for magical damage.",
         "notes": "Cancels other songs currently in effect."}
    ]
}

songblade["slottedClassFeatures"] = [
    {"name": "Soloist", "description": "Increases damage bonus by 10% whenever there are no party members nearby.", "percentStatsConditional": {"Damage Bonus": 10}, "conditional": "no party members nearby", "notes": "Class-shared slottable."},
    {"name": "Songward", "description": "Whenever you are in Performance Mode, absorb 50% of incoming damage up to 20% of your total maximum hit points. This pool of hit points gradually regenerates when not in Performance Mode. In addition, for 6s after entering Performance Mode you are granted immunity to most control effects. This effect may only occur once every 12s.", "notes": "Class-shared slottable."},
    {"name": "Mystifying Strikes", "description": "Your attacks now have a 5% chance to apply the effect Mystify to the target, dealing psychic damage over time. Magnitude: 100x5. Duration: 12s. Whenever another player strikes a target affected by your Mystify the effect ends immediately and the mystified target takes psychic damage (magnitude 400). The player who triggered the effect is healed (heal magnitude 400).", "notes": "Class-shared slottable."},
    {"name": "Sforzando", "description": "Whenever you play a song in combat your damage and healing bonus is increased by 5%. Duration: 20s.", "trigger": "play song in combat", "durationSeconds": 20, "percentStatsConditional": {"Damage Bonus": 5, "Outgoing Healing": 5}, "notes": "Class-shared slottable. Currently Active."},
    {"name": "Advancing Parry", "description": "Reprise, Flourish, and Volti Subito now increase your deflect chance by 25%. Duration: 2s.", "notes": "Songblade paragon slottable."},
    {"name": "Advancing Blade", "description": "The final hit of your at-will attacks now grant the effect of Advancing Blade, increasing damage bonus by 1%. This effect may stack up to 5 times. Duration: 12s.", "notes": "Songblade paragon slottable. Currently Active."},
    {"name": "Masterful Performance", "description": "Increases the effectiveness of Blaze Flamenco, Steel March, Tailwind Mambo's added effects by 50% when not in a quickplay slot.", "notes": "Songblade paragon slottable. Currently Active."},
    {"name": "Musician's Flow", "description": "Increases Performance regeneration by 25%.", "notes": "Songblade paragon slottable."}
]

songblade["feats"] = [
    {"name": "Backup Performer", "description": "When not in a quickplay slot, Rejuvenating Carol becomes Reinvigorating Carol. Instantly heal nearby party members. Magnitude: 1200. Restores 100 mana (divinity/soulweave/performance) to any healers and does not cancel other songs. Reverts back to Rejuvenating Carol for 30s afterwards.", "notes": "Auto-applied."},
    {"name": "Battlefield Ostinato", "description": "Your single target at-will attacks now grant the effect of Ostinato Vivo, increasing the damage dealt by your area of effect at-will attacks by 20%. Duration: 12s. Your area of effect at-will attacks now grant the effect of Ostinato Bellicoso, increasing the damage dealt by your single target at-will attacks by 20%. Duration: 12s.", "notes": "Auto-applied."},
    {"name": "Ballad Colla Voce", "description": "When not in a quickplay slot and you play Ballad of the Hero or Ballad of the Witch, you and nearby party members are granted the effect of Colla Voce, granting a bonus based on their combat role. DPS: +5% total outgoing damage. Tank: -5% total damage taken. Healer: +5% Outgoing Healing. Duration: 20s. Effect ends upon activating Hero's Finale or Witch's Finale.", "notes": "Auto-applied."},
    {"name": "Redoublement", "description": "Allows for the execution of other encounters between strikes of Ad Libitum and Volti Subito. Between uses of either power, your Encounter powers deal 10% more damage.", "notes": "Auto-applied."},
    {"name": "Performer", "description": "Your at-will and encounter powers now have a chance to randomly activate an improvised version of an encounter power. This improvised version does not trigger or affect the cooldown of the actual encounter power. Every time you use an improvised power, you gain a stack of 'Playing to the Audience'. When you reach 8 stacks, the daily 'Encore' switches to 'Grandstand'. Grandstand doubles the damage or healing of the triggered song. Does not affect finale damage for Ballad of the Hero or Ballad of the Witch. Using grandstand resets your stacks.", "notes": "Auto-applied."},
    {"name": "Luremaster", "description": "You now have a chance to gain Battle Research whenever you use an at-will power. When your action points are below 100%, the daily power Lore is replaced with Research. Research has a 1 second cast time and grants a stack of Battle Research. Upon reaching 5 stacks of Battle Research, activating Research or Lore grants you Ready to Exploit. Ready to Exploit increases encounter and ballad finale damage by 125% for 10s.", "notes": "Auto-applied."},
    {"name": "Martial Performance", "description": "When not in a quickplay slot, whenever you damage an enemy with the initial activation of Blaze Flamenco, Tailwind Mambo, or Steel March the damage bonus added to your attacks is increased by 10 magnitude for the duration of the song effect.", "notes": "Auto-applied."},
    {"name": "A Due", "description": "You and the nearest party member within 25' are granted the effect of A Due, increasing total outgoing damage by 10%, decreasing total damage taken by 10%, and increasing Outgoing Healing by 10%. Effect ends when the party members moves out of range, or the effect moves to a closer party member.", "notes": "Auto-applied."},
    {"name": "Elemental Medley", "description": "Con Fuoco, Con Moto, and Con Brio now grant the effect of Elemental Medley, increasing the damage bonus of your elemental songs on your attacks by 10 magnitude. Duration: 60s. This effect may stack up to 3 times while in normal but cannot be reapplied by the same at-will until the effect dissipates.", "notes": "Auto-applied."},
    {"name": "Voice Throw", "description": "Whenever you play a song that is not in a quickplay slot and a tank is in range, your attacks grant the tank 50% of the threat they generate to that tank. Duration: 10s.", "notes": "Auto-applied. Useful for high-DPS in tank parties."}
]

# --- Minstrel paragon ---
minstrel = next(p for p in bard["paragonPaths"] if p["name"] == "Minstrel")
minstrel["powers"] = {
    "atWill": [
        {"name": "Arpeggio", "type": "atWill", "paragon": True, "castSeconds": 0, "cooldownSeconds": 1, "range": "Self/ally", "healMagnitude": 250, "performanceCost": 40, "notes": "Heal target ally or self."},
        {"name": "Phantasmal Concerto", "type": "atWill", "paragon": True, "magnitude": 70, "castSeconds": 1.1, "range": 30, "addedEffect": "Channel; moves at reduced speed", "notes": "Channel to deal psychic damage to nearby enemies while moving at a reduced speed."}
    ],
    "encounter": [
        {"name": "Serenade", "type": "encounter", "paragon": True, "castSeconds": 2, "cooldownSeconds": 21.4, "range": "Self", "durationSeconds": 10,
         "addedEffect": "Tap: briefly Serenade target, increasing effectiveness of your heals on the target by 5%. Hold and release: increases effectiveness of your heals on the target by an additional 50%. Effect remains active until target leaves party, dies, or you cast Serenade again. This action does not trigger the cooldown.",
         "notes": "Tap or hold for healing focus."},
        {"name": "Delayed Play", "type": "encounter", "paragon": True, "castSeconds": 1.5, "cooldownSeconds": 10.7, "range": "Self", "durationSeconds": 12,
         "addedEffect": "The next song you play will be stored rather than take effect immediately. Song will be stored until you log out or change areas. Trigger by activating Delayed Play again.",
         "notes": "Stores next song for delayed activation."},
        {"name": "Bassline", "type": "encounter", "paragon": True, "castSeconds": 10, "cooldownSeconds": 21.4, "range": "Self",
         "addedEffect": "Channel to restore up to 200 performance while moving at a reduced speed. Performance restored and cooldown reduced if power cancelled early.",
         "notes": "Performance recovery channel."}
    ],
    "daily": [
        {"name": "Curtain Call", "type": "daily", "paragon": True, "castSeconds": 0.8, "radius": 100, "actionPointCost": 1000,
         "addedEffect": "Cancels all your song effects on nearby allies and grants added effects based on songs cancelled: Blaze Flamenco: Restores 100 action points. Rejuvenating Carol: 800 magnitude heal. Warding Carol: Reduces damage taken by 10%. Duration: 10s. Sheltering Etude: 800 magnitude shield. Duration: 20s.",
         "notes": "Trade-off daily for song-end effects."}
    ],
    "mechanic": [
        {"name": "Forte", "type": "mechanic", "paragon": True, "notes": "Minstrel Forte: Performance Regen (primary), excels at Critical Severity and Deflect Severity."},
        {"name": "The Gift of Song", "type": "mechanic", "paragon": True, "notes": "Increases your Performance Gauge maximum to 1000. Reduces threat generated by your healing spells. Songs no longer cancel the effect of other songs."},
        {"name": "Natural Talents", "type": "mechanic", "paragon": True, "notes": "Unlocks an additional quick play slot."}
    ],
    "songs": [
        {"name": "Defender's Minuet", "type": "song", "paragon": True, "castSeconds": 0.6, "range": 100, "performanceCost": 160, "healMagnitude": 2000,
         "addedEffect": "Instantly heal the nearby party member with the least hit points. Heals the party member affected by your Serenade instead if there is one.",
         "notes": "Single-target instant heal."},
        {"name": "Warding Carol", "type": "song", "paragon": True, "castSeconds": 1, "radius": 80, "performanceCost": 120, "durationSeconds": 10,
         "addedEffect": "Removes one negative condition from all nearby allies. Continually removes negative effects for duration.",
         "notes": "Cleanse song."},
        {"name": "Aurora Fantasia", "type": "song", "paragon": True, "castSeconds": 1.1, "range": "Self", "performanceCost": 100,
         "addedEffect": "Grants the effect of Aurora Fantasia, causing your attacks to deal additional psychic damage against all targets. Magnitude: 25. Added Effect: Whenever you attack, heal nearby allies. Heal Magnitude: 50. May be maintained indefinitely, but performance is drained over time. While under the effect of Aurora Fantasia, Perform changes to Aurora Finale. Aurora Finale ends the effect of Aurora Fantasia and deals psychic damage to nearby enemies. Magnitude: 400. Added Effect: Heal nearby allies. Heal Magnitude: 400.",
         "notes": "Cancels other songs."},
        {"name": "Sheltering Etude", "type": "song", "paragon": True, "castSeconds": 1, "radius": 80, "performanceCost": 200, "healMagnitude": 600, "durationSeconds": 60,
         "addedEffect": "Grants self and nearby party members the effect of Sheltering Etude, restoring HP when their health falls below 50% or upon expiration. If a target is already under the effect of Sheltering Etude, the effect will apply its heal and end immediately as the new effect is applied.",
         "notes": "Conditional shield/heal."},
        {"name": "Reprised Carol: Enhance", "type": "song", "paragon": True, "castSeconds": 1, "radius": 80, "performanceCost": 100, "durationSeconds": 15,
         "addedEffect": "Requires Gambler feat. Cannot be put into a quick play slot. Consumes all stacks of Gambler's Delight and has a chance to grants one of the following effects (strength based on Gambler's Delight stacks): Critical Severity Bonus: 2%, Mitigation Bonus: 2%, Recharge Speed Bonus: 2%. If none of these effects is applied then a heal over time will be applied to self and all nearby allies. Heal Magnitude: 100.",
         "notes": "Gambler synergy carol."},
        {"name": "Reprised Carol: Recovery", "type": "song", "paragon": True, "castSeconds": 1, "radius": 80, "performanceCost": 100, "durationSeconds": 15,
         "addedEffect": "Requires Gambler feat. Cannot be put into a quick play slot. Consumes all stacks of Gambler's Delight and has a chance to grants one of the following effects: Stamina regen bonus: 10% every 2 seconds. Shield Absorbs damage. Regenerates every 5 seconds. AP Regen Bonus: 4% every 3 seconds. If none of these effects is applied then a heal over time will be applied to self and all nearby allies. Heal Magnitude: 100.",
         "notes": "Gambler synergy carol."}
    ]
}

minstrel["slottedClassFeatures"] = [
    {"name": "Soloist", "description": "Increases damage bonus by 10% whenever there are no party members nearby.", "notes": "Class-shared slottable."},
    {"name": "Songward", "description": "Whenever you are in Performance Mode, absorb 50% of incoming damage up to 20% of your total maximum hit points...", "notes": "Class-shared slottable."},
    {"name": "Mystifying Strikes", "description": "Your attacks now have a 5% chance to apply the effect Mystify...", "notes": "Class-shared slottable."},
    {"name": "Sforzando", "description": "Whenever you play a song in combat your damage and healing bonus is increased by 5%. Duration: 20s.", "notes": "Class-shared slottable. Currently Active."},
    {"name": "Starstruck", "description": "Whenever a teammate is healed by Rejuvenating Carol while it is not in a quickplay slot, there is a chance that they become starstruck. Starstruck Effect: Heals the affected player when they do certain things depending on their role. DPS: Heal on critical damage. Tank: Heal on critical damage taken. Healer: Heal on critical heal. Duration: 10s. This does not affect other bards.", "notes": "Minstrel paragon slottable."},
    {"name": "Play it Back", "description": "Aurora Fantasia's maintained cost reduced by 10. Aurora Finale has a 20% chance to fire a second time.", "notes": "Minstrel paragon slottable."},
    {"name": "Vamos Alla!", "description": "Blaze Flamenco now increases the running speed of all affected by 10%. This effect expands to 20% when outside of combat.", "notes": "Minstrel paragon slottable. Currently Active."},
    {"name": "Arpeggio Fortissimo", "description": "Reduces the magnitude of Arpeggio to 100, increases the performance cost to 60, and extends the area of effect from a single ally to allies within 40'.", "notes": "Minstrel paragon slottable."}
]

minstrel["feats"] = [
    {"name": "Crescendo", "description": "For every 3s you are channeling Arpeggio, magnitude is increased by 30 to a maximum magnitude of 400.", "notes": "Auto-applied. Arpeggio modifier."},
    {"name": "Art of War", "description": "Expands the effect of the final strike of Fleche to hit all enemies within 15' of the target. This final hit now deals an additional 150 magnitude damage against the primary target and costs 40 performance. The final hit now applies a stack of Art of War. Art of War Effect: Converts to Dancing Lights Enhanced after reaching 3 stacks. Duration: 30s. Dancing Lights Enhanced: Expands the area of effect of your next Dancing Lights to all enemies within 20' of the target and increases magnitude against the primary target by 500 magnitude.", "notes": "Auto-applied. Fleche/Dancing Lights modifier."},
    {"name": "Vamp", "description": "Whenever you play a song in combat there is a 20% chance to gain the effect of Vamp. Vamp Effect: Activating Delayed Play will not clear the stored song. Duration: 20s.", "notes": "Auto-applied."},
    {"name": "Desperate Finale", "description": "Whenever your Performance Gauge drops below 200, restore 400 Performance immediately. This effect may only occur once every 360s.", "notes": "Auto-applied. 6-min ICD."},
    {"name": "Storyteller", "description": "Whenever you play a song, that is not in a quickplay slot, grant Storyteller's Boon to party members within 50'. Effect varies by role and stacks up to 3 times. DPS: Increases damage bonus by 5%. Tank: Decreases damage taken by 5%. Healer: Increases outgoing healing by 5%. Duration: 13s.", "notes": "Auto-applied."},
    {"name": "Gambler", "description": "While in combat, whenever you play Sheltering Etude, Defender's Minuet, Rejuvenating Carol or they are not in a quickplay slot, gain a stack of Gambler's Delight. Gambler's Delight Effect: Allows the execution of reprised carols. Duration: 15s. If this effect times out self and all nearby allies receive a heal. Heal Magnitude: 100. Reprised Carols: Applies one of 3 group buffs whose strength is based on the number of Gambler's Delight stacks. The possible buffs depend on the carol used.", "notes": "Auto-applied. Enables Reprised Carols."},
    {"name": "Pianissimo", "description": "Reduces the cost of Rejuvenating Carol to 100 and the magnitude to 160. Reduces the cost of Defender's Minuet to 120 and the magnitude to 1600. Reduces the cost of Sheltering Etude to 150 and the magnitude to 480. The magnitude of these songs is not reduced when activating them via Encore.", "notes": "Auto-applied. Healer cost-reduction feat."},
    {"name": "Sudden Muse", "description": "Every 3s you are engaged in combat there is a 10% chance to gain the effect of Healer's Muse, Warden's Muse, or Fighter's Muse. Healer's Muse Effect: The next time you play Defender's Minuet or Sheltering Etude the magnitude of the heal effect is increased by 25%. Duration: 20s. Warden's Muse Effect: The next time you play Rejuvenating Carol or Warding Carol the duration of the effect is increased by 100%. Duration: 20s. Fighter's Muse Effect: The next time you play Blaze Flamenco or Aurora Fantasia it will not cost any performance. Duration: 20s. This effect may not occur more than once every 20s. Only one effect may trigger at a time.", "notes": "Auto-applied. RNG muse procs."},
    {"name": "Rhapsody at Arms", "description": "Increases damage bonus by 1% and reduces damage taken by 1% for every song you are affected by.", "notes": "Auto-applied."},
    {"name": "Diminuendo", "description": "The magnitude of Arpeggio is increased to 300. For every 1s you are channeling Arpeggio, magnitude is decreased by 50 to a minimum magnitude of 250. When used with Arpeggio Fortissimo the magnitude is increased to 200 and decreased by 20 to a minimum magnitude of 100. This effect resets 5s after you stop channeling Arpeggio.", "notes": "Auto-applied. Alternative Arpeggio modifier (anti-Crescendo)."}
]

PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Bard classFeatures: {len(bard['classFeatures'])}")
print(f"Class at-wills: {len(bard['powers']['atWill'])}, encounters: {len(bard['powers']['encounter'])}, dailies: {len(bard['powers']['daily'])}, mechanics: {len(bard['powers']['mechanic'])}")
print(f"Songblade: powers={ {k: len(v) for k,v in songblade['powers'].items()} }, songs={len(songblade['powers']['songs'])}, slotted={len(songblade['slottedClassFeatures'])}, feats={len(songblade['feats'])}")
print(f"Minstrel: powers={ {k: len(v) for k,v in minstrel['powers'].items()} }, songs={len(minstrel['powers']['songs'])}, slotted={len(minstrel['slottedClassFeatures'])}, feats={len(minstrel['feats'])}")
