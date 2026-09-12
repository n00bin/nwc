# DPS Rotation Profiles — draft for gut-check

Purpose: give the optimizer each DPS paragon's **rotation archetype** so it
(1) weights slot-specific damage bonuses correctly (per-paragon POWER_MIX) and
(2) auto-picks a *functional* power set, not just highest magnitude/cooldown.

Source: community-meta research (Obikin89, NW Hub, mmorpgtips Mod 30, Warlock
Compendium) reconciled against actual `../data/classes.json` power names via
`scripts/_rotation_reconcile.py` on 2026-06-16.

**Status:** all recommended powers verified present in classes.json. Drafts below
are ready for n00b's gut-check. The `mix` values (at-will/encounter/daily emphasis)
are starting estimates — correct any that feel wrong.

## Data flags
- **Cleric/Arbiter:** our data stores `Prophecy of Doom`; the real NW power and all
  guides call it **Prophecy of Doom**. Likely a typo to fix in classes.json.

## Open judgment calls (sneak-preview is fine with the primary pick; confirm later)
- **Fighter/Dreadnought 3rd encounter:** Griffon's Wrath (high mag) vs Knee Breaker
  (slow utility) vs Bull Charge. Primary = Griffon's Wrath.
- **Warlock/Hellbringer 3rd encounter:** Infernal Spheres (AoE, "inconsistent") vs
  Curse Bite (curse uptime). Primary = Infernal Spheres for ST burst.
- **Bard/Songblade:** lowest-confidence paragon (guides had fabricated names). Picks
  below are the classes.json-verified Songblade set; confirm the song/daily loop.
- **Ranger/Warden:** community notes it's weak single-target, strong AoE.

---

## Profiles (2 at-wills / 3 encounters / 2 dailies = optimizer slot counts)

Tags: [dmg] damage · [buff] · [debuff] · [apgen] AP/resource gen · [setup] enables another power

### Barbarian / Blademaster — encounter-dominant (Battlerage burst)
- mix: atwill 0.35 / encounter 0.50 / daily 0.15
- At-Wills: Relentless Slash [dmg][buff], Brash Strike [dmg]
- Encounters: Frenzy [dmg], Bloodletter [dmg], Punishing Charge [dmg][setup]
- Dailies: Crescendo [dmg], Avalanche of Steel [dmg]
- AoE alt: Hidden Daggers / Axestorm / Not So Fast

### Bard / Songblade — daily/encounter hybrid (Loremaster loop) · MEDIUM confidence
- mix: atwill 0.30 / encounter 0.45 / daily 0.25
- At-Wills: Staccato [dmg], Con Elemento [dmg][setup]
- Encounters: Lunge [dmg], Dancing Lights [dmg][debuff], Ad Libitum [dmg]
- Dailies: Lore [dmg][buff][apgen], Inspiration [buff]
- Note: songs (elemental song 72s + Ballad 20s metronome) maintained throughout.
- Source: n00b's live Songblade build "Surina" (share link, 2026-07-07) — real
  player loadout replaces the guide-derived guesses. Feats: Voice Throw /
  Elemental Medley / A Due / Redoublement / Performer; features Mystifying
  Strikes + Masterful Performance; MH art mod Enhanced Staccato; active song
  Tailwind Mambo. Volti Subito / Contre / Encore NOT run by the owner.
- Core engine (owner-explained 2026-07-07): Performer + Ad Libitum = encounter
  spam. Performer's improvised encounter casts (free, no cooldown interaction,
  proc off at-wills/encounters) + Ad Libitum's 50% immediate-rechain (max 3) +
  Redoublement's +10% encounter damage between Ad Lib uses. Grandstand/Encore
  is a deliberately skipped rider, NOT a reason to swap Performer→Loremaster —
  that trade kills the spam engine. Supports the 0.45 encounter mix weight.

### Cleric / Arbiter — encounter-dominant (Divinity spam) · HIGH confidence (Obikin89)
- mix: atwill 0.25 / encounter 0.60 / daily 0.15
- At-Wills: Lance of Faith [dmg][apgen], Conflagrate [dmg][apgen]
- Encounters: Forgemaster's Flame [dmg][apgen], Daunting Light [dmg], Prophecy of Doom [debuff][setup]
- Dailies: Celestial Prominence [dmg][apgen], Hammer of Fate [dmg][apgen]

### Fighter / Dreadnought — encounter-dominant (Vengeance)
- mix: atwill 0.30 / encounter 0.55 / daily 0.15
- At-Wills: Heavy Slash [dmg][buff], Reave [dmg]
- Encounters: Commander's Strike [dmg][debuff], Anvil of Doom [dmg], Griffon's Wrath [dmg]
- Dailies: Mow Down [dmg], Shockwave [dmg]

### Ranger / Hunter — AT-WILL-DOMINANT (the key outlier)
- mix: atwill 0.55 / encounter 0.35 / daily 0.10
- At-Wills: Aimed Shot [dmg], Hunter's Teamwork [dmg][buff]
- Encounters: Commanding Shot [dmg][debuff], Longstrider's Shot [dmg], Rapid Volley [dmg][apgen]
- Dailies: Disruptive Shot [dmg][apgen] (cheap, frequent), Slasher's Mark [dmg][buff]

### Ranger / Warden — encounter-dominant (stance-weave) · weak ST
- mix: atwill 0.35 / encounter 0.50 / daily 0.15
- At-Wills: Electric Shot [dmg], Storm Strike [dmg]
- Encounters: Throw Caution [dmg][buff], Split the Sky [dmg], Boar Charge [dmg]
- Dailies: Forest Ghost [setup], Call of the Storm [dmg]

### Warlock / Hellbringer — encounter-dominant (Soul Spark loop) — ✅ n00b-verified 2026-06-16
- mix: atwill 0.30 / encounter 0.55 / daily 0.15
- At-Wills: Hellish Rebuke [dmg][apgen], Dark Helix [dmg]
- Encounters: Killing Flames [dmg], Vampiric Embrace [dmg], Hadar's Grasp [dmg][setup]
- Dailies: Tyrannical Curse [dmg][debuff][buff], Soul Siphon [buff]

### Wizard / Arcanist — encounter-dominant (Arcane Mastery)
- mix: atwill 0.30 / encounter 0.55 / daily 0.15
- At-Wills: Storm Pillar [dmg][setup], Arcane Bolt [dmg][apgen]
- Encounters: Disintegrate [dmg], Arcane Conduit [dmg][debuff], Steal Time [dmg][setup]
- Dailies: Arcane Empowerment [buff][setup], Maelstrom of Chaos [dmg]

### Wizard / Thaumaturge — encounter-dominant + DoT (Smolder/Chill)
- mix: atwill 0.35 / encounter 0.50 / daily 0.15
- At-Wills: Chilling Cloud [dmg][setup], Scorching Burst [dmg][setup]
- Encounters: Icy Rays [dmg][setup], Chill Strike [dmg][setup], Fanning the Flame [dmg][setup]
- Dailies: Ice Storm [dmg][setup], Furious Immolation [dmg][setup]

### Rogue / Assassin — encounter-dominant (Stealth burst)
- mix: atwill 0.30 / encounter 0.55 / daily 0.15
- At-Wills: Duelist's Flurry [dmg][apgen], Gloaming Cut [dmg][setup]
- Encounters: Lashing Blade [dmg][setup], Wicked Reminder [dmg][debuff], Assassinate [dmg]
- Dailies: Shocking Execution [dmg][apgen], Bloodbath [dmg]

### Rogue / Whisperknife — encounter-dominant (Stealth cycling, Shadow of Demise)
- mix: atwill 0.30 / encounter 0.55 / daily 0.15
- At-Wills: Disheartening Strike [dmg][debuff], Cloud of Steel [dmg]
- Encounters: Shadow Strike [dmg][setup], Impact Shot [dmg], Blitz [dmg][setup]
- Dailies: Lurker's Assault [buff][dmg], Killing Storm [dmg]
