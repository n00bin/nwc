# Power magnitude verification (from in-game captures)

**Source:** `docs/calibration/inbox/powers/<class>-powers/` (~95-104 tooltip captures per class).
**Process:** vision-extract magnitude from each At-Will/Encounter/Daily tooltip → reconcile vs `../data/classes.json` → batch-fix → `build-data.py` → commit/deploy.
**Paragon note:** powers can differ per paragon (e.g. Warlock Vampiric Embrace 500 Hellbringer / 200 Soulweaver). Use the **DPS-paragon** value. classes.json stores one magnitude per power = the DPS value; a per-paragon split (`magnitudeByParagon`, as Rogue Cloud of Steel) is only needed if we ever model heal/tank paragons' damage.

## Warlock / Hellbringer — DONE (vision-extracted 2026-06-17)
16 / 19 already correct. **Fixes to apply:**
- **Soul Siphon**: no-mag → `600x2` (Hellbringer; Soulweaver = 600 heal)
- **Tyrannical Curse**: `1150` → `1350`
- **Dreadtheft**: no-mag → `200x4` (800) (Hellbringer; Soulweaver 175x4)

Confirmed correct: Killing Flames 650-975, Vampiric Embrace 500, Hadar's Grasp 300, Infernal Spheres 250-750 (75/sphere), Hellfire Ring 200 (+50x5 hazard), Hellish Rebuke 70, Dark Helix 135, Hand of Blight 75r/55m, Eldritch Blast 45, Arms of Hadar 175, Blades of Vanquished Armies 130x3 (390), Fiery Bolt 350, Curse Bite 325, Brood of Hadar 800, Flames of Phlegethos 500, Gates of Hell 1100.

## Pending — 7 vision agents launched 2026-06-17
Barbarian · Bard · Cleric · Fighter · Ranger · Wizard · Rogue. Reconcile each against classes.json, then ONE batched data update + build + deploy.

(Paladin skipped — no DPS paragon; its tank/heal power magnitudes can be a later pass.)

---

## Extracted magnitudes (raw, pre-reconciliation vs classes.json)

### Barbarian — DPS = Blademaster (extracted 2026-06-17)
- at-will: Sure Strike 60, Bounding Slam 80, Brash Strike 140, Relentless Slash 55
- encounter: Not So Fast 300 (Sentinel 350), Mighty Leap 380, Punishing Charge 650, Indomitable Battle Strike 800-1200 (Sentinel flat 750), Bloodletter 600, Hidden Daggers 100, Roar 250, Frenzy 1275, Battle Fury none(buff), Axestorm 450; Sentinel-only: Takedown 400, Primal Fury 200-600, Come and Get It/Enduring Shout/Ignore Weakness none(buff)
- daily: Savage Advance 1800, Spinning Strike 1400, Crescendo 2800, Avalanche of Steel 1400, Adamantine Strike 1200; Sentinel-only: Primal Instinct/Battle High none(buff)
- WATCH: our data had Roar 290 (first classes.json read) — in-game is 250. Verify at reconciliation.

### Bard — DPS = Songblade (extracted 2026-06-17)
- at-will: Reprise 35, Fleche 180 (enh 240), Con Elemento 140; Minstrel-only: Phantasmal Concerto 70, Arpeggio none(heal)
- encounter: Lunge 500, Dancing Lights 900, Duet 250x2, Volti Subito 300, Contre 500/1200/900 (release variants), Ad Libitum 700 (title obscured — n00b verify), Flourish none(buff); Minstrel-only: Serenade/Delayed Play/Bassline none
- daily: Inspiration none(heal+buff), Encore none, Lore none(buff), Curtain Call none(Minstrel)
- NOTE: ALL Songblade dailies are buffs (no damage) — Bard genuinely has no damage daily (confirms its weakest-DPS-daily status; not a data error).

### Cleric — DPS = Arbiter (extracted 2026-06-17)
- at-will: Sacred Flame 100, Scattering Light 70, Lance of Faith 110, Conflagrate 150
- encounter: Sun Burst 260, Daunting Light 280, Geas 650, Searing Javelin 470, Forgemaster's Flame 770, Chains of Blazing Light 320, Break the Spirit 520, Prophecy of Doom none(debuff, stores 30% of damage)
- daily: Guardian of Faith 1700, Flame Strike 260 (+DoT 180), Celestial Prominence 700 (enh 1300), Hammer of Fate 1800 (600x3)
- **FIX: our data name "Prophet of Doom" is WRONG — real power is "Prophecy of Doom"** (rename in classes.json + profile + doc).

### Rogue — DPS = Assassin / Whisperknife (extracted 2026-06-17)
- at-will: Cloud of Steel 60(WK)/45(Assassin), Sly Flourish 40, Duelist's Flurry 35, Gloaming Cut 150, Disheartening Strike 75 (+DoT 450), Shuriken Toss 60
- encounter: Blade Flurry 330, Lashing Blade 715 (+300 stealth), Path of the Blade 140x4, Smoke Bomb 120x4, Deft Strike 800, Wicked Reminder 800, Dazing Strike 350, Assassinate 865, Vengeance's Pursuit 250/250, Blitz 450, Impact Shot 600, Shadow Strike 775, Shadowy Disappearance 300x2, Bait and Switch/Impossible to Catch none
- daily: Hateful Knives 2000, Whirlwind of Blades 450, Courage Breaker 1800, Bloodbath 2200, Shocking Execution 2200, Killing Storm 200x12, Lurker's Assault none(+40% buff)
- WATCH: our data may have Assassinate 845 → in-game 865. Verify at reconciliation.

### Wizard — DPS = Arcanist & Thaumaturge (extracted 2026-06-17)
- at-will: Magic Missile 60, Ray of Frost 65, Storm Pillar 40-100, Arcane Bolt 120, Scorching Burst 60-110, Chilling Cloud 90
- encounter: Entangling Force 600, Repel 580, Ray of Enfeeblement 520, Icy Terrain 400, Shield 350(pulse), Lightning Bolt 350, Disintegrate 500/750(exec), Steal Time 350, Arcane Tempest 400, Arcane Conduit 300(SM 330), Fanning the Flame 500, Icy Rays 600-830, Chill Strike 660, Conduit of Ice 550, Fireball 350(SM 700 ST)
- daily: Arcane Singularity 1200, Ice Knife 2300, Oppressive Force 200x2(+500 explode), Maelstrom of Chaos 1400, Arcane Empowerment none(buff +20% enc), Furious Immolation 900, Ice Storm 1200
- NOTE: file "Ray of Enfeelement.png" is a filename typo; real power = Ray of Enfeeblement.

### Fighter — DPS = Dreadnought (extracted 2026-06-17)
- at-will: Brazen Slash 100, Shield Bash 55, Guarded Strike 100, Cleave 55, Heavy Slash 175, Reave 60, Tide of Iron 100, Threatening Rush 60
- encounter: Shield Throw 450(Dread)/325(Vanguard), **Anvil of Doom (Dreadnought) 880 base / 1360 enhanced** (>15 Vengeance), Shield Slam 400(Dread)/350, Knee Breaker 700, **Bull Charge 520** (CONFIRMED exists), Griffon's Wrath 1350 total(3-hit), Onslaught 550, Commander's Strike 780, Tremor 440, Linebreaker 300; Vanguard buffs none: Enforced Threat/Iron Warrior/Knight's Valor; Knight's Challenge 100(retaliate)
- daily: Earthshaker 1050, Shockwave 1150, Mow Down 2100 total(2-hit), Bladed Rampart 260; Vanguard: Second Wind/Determination/Phalanx none

### Ranger — DPS = Hunter & Warden (extracted 2026-06-17)
- at-will: Rapid Shot 65(H)/90(W), Rapid Strike 55(H)/80(W) (+enh), Split Shot 95-220, Split Strike 50, Aimed Shot 260(H), Aimed Strike 65(+DoT 65x5), Electric Shot 100(W), Clear the Ground 60(W), Hunter's Teamwork 160(H), Careful Attack UNREAD(text clipped), Penetrating Arrows 90(W), Storm Strike 110(W)
- encounter: Hindering Shot 130, Hindering Strike 520, Marauder's Escape 550, Marauder's Rush 580, Constricting Arrow 520, Steel Breeze 250, Rain of Arrows 60x5, Rain of Swords 200(+DoT50x4), Cordon of Arrows 225, Plant Growth 150(+DoT50x4), Ambush 150, Bear Trap 220(+DoT185), Longstrider's Shot 650, Gushing Wound 400(+DoT400), Hawk Shot 275, Hawkeye none, Commanding Shot 520, Stag Heart none, Rapid Volley 100, Windwalk Strike 180, Split the Sky 225x5, Throw Caution 500, Boar Hide none, Boar Charge 385, Fox's Cunning none, Fox Shift 400x3, Binding Arrow 1000, Oak Skin none, Thorn Ward 200x6, Thorn Strike 500-750
- daily: Forest Ghost 250x4, Seismic Shot 800, Snipe 1900, Slasher's Mark 2100(H), Disruptive Shot 400(H, 250 AP), Cold Steel Hurricane 1000(W), **Call of the Storm 400 (+100/lightning strike)** — our data had it as NO-MAG; FIX
- WATCH: Boar Charge — our Warden profile context suggested ~585; in-game is 385. Verify at reconciliation.

---

## ALL 8 DPS CLASSES EXTRACTED ✅ (Warlock + Barbarian/Bard/Cleric/Fighter/Ranger/Wizard/Rogue). Next: diff vs classes.json → apply fixes → build → deploy.
## Known fixes so far: Warlock (Soul Siphon 600x2, Tyrannical Curse 1350, Dreadtheft 200x4) · Cleric name Prophet→Prophecy of Doom · Barbarian Roar 290→250 · Ranger Call of the Storm add 400 · + whatever the full diff surfaces.
