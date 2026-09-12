# Class power-magnitude sweep — NW Hub vs our classes.json (2026-07-14)

Cross-checked all 9 classes' power magnitudes against NW Hub's class pages.
**Verify-then-fix**: power magnitudes are a case where the in-game tooltip is
truth; NW Hub is a strong *lead* (their simulator depends on accurate values),
but where we disagree a screenshot decides. NOT auto-applied.

Caveats baked into the numbers below:
- **combo-rep** = our per-hit value × the combo's hit-count = NW's total
  (e.g. Sure Strike 60×fourfold = NW 240). Representation difference, NOT an error.
- **no-mag** = we HAVE the power but stored no magnitude; **absent** = not in our data.

## Scorecard

| Class | exact | combo-rep | REAL discrepancy | no-mag | absent |
|---|---|---|---|---|---|
| Fighter | 3 | 3 | 10 | 1 | 7 |
| Barbarian | 16 | 3 | 1 | 0 | 2 |
| Paladin | 11 | 1 | 2 | 1 | 0 |
| Cleric | 10 | 0 | 3 | 2 | 0 |
| Wizard | 0 | 1 | 25 | 0 | 1 |
| Warlock | 4 | 1 | 3 | 2 | 10 |
| Rogue | 19 | 0 | 4 | 2 | 0 |
| Ranger | 8 | 0 | 2 | 0 | 16 |
| Bard | 2 | 1 | 0 | 0 | 17 |

## Genuine magnitude discrepancies (verify vs in-game tooltip)

**Fighter** (10):
- Brazen Slash: NW 195 vs ours 100
- Tide of Iron: NW 120 vs ours 100
- Bull Charge: NW 300 vs ours 520
- Anvil of Doom: NW 800 vs ours 880
- Retaliate: NW 350 vs ours 800
- Shield Throw: NW 250 vs ours 325
- Knee Breaker: NW 400 vs ours 700
- Linebreaker: NW 500 vs ours 300
- Earthshaker: NW 800 vs ours 1050
- Bladed Rampart: NW 250 vs ours 260

**Barbarian** (1):
- Roar: NW 250 vs ours 290

**Paladin** (2):
- Valorous Strike: NW 290 vs ours 60
- Shielding Strike: NW 100 vs ours 60

**Cleric** (3):
- Lance of Faith: NW 240 vs ours 110
- Celestial Prominence: NW 1300 vs ours 700
- Flame Strike: NW 2420 vs ours 260

**Wizard** (25):
- Ray of Frost: NW 55 vs ours 65
- Scorching Burst: NW 80 vs ours 110
- Chilling Cloud: NW 195 vs ours 90
- Storm Pillar: NW 80 vs ours 100
- Arcane Bolt: NW 60 vs ours 120
- Repel: NW 500 vs ours 580
- Ray of Enfeeblement: NW 450 vs ours 520
- Icy Terrain: NW 348 vs ours 400
- Shield: NW 230 vs ours 350
- Fanning the Flame: NW 102 vs ours 500
- Icy Rays: NW 720 vs ours 850
- Chill Strike: NW 575 vs ours 660
- Conduit of Ice: NW 230 vs ours 550
- Fireball: NW 550 vs ours 350
- Lightning Bolt: NW 200 vs ours 350
- Disintegrate: NW 600 vs ours 500
- Steal Time: NW 260 vs ours 350
- Arcane Tempest: NW 300 vs ours 400
- Arcane Conduit: NW 200 vs ours 300
- Arcane Singularity: NW 800 vs ours 1200
- Ice Knife: NW 1800 vs ours 2300
- Oppressive Force: NW 700 vs ours 400
- Furious Immolation: NW 700 vs ours 900
- Ice Storm: NW 600 vs ours 1200
- Maelstrom of Chaos: NW 600 vs ours 1400

**Warlock** (3):
- Vampiric Embrace: NW 200 vs ours 500
- Hadar's Grasp: NW 500 vs ours 300
- Flames of Phlegethos: NW 2100 vs ours 500

**Rogue** (4):
- Sly Flourish: NW 184 vs ours 40
- Gloaming Cut: NW 125 vs ours 150
- Disheartening Strike: NW 525 vs ours 75
- Assassinate: NW 845 vs ours 865

**Ranger** (2):
- Rapid Shot: NW 90 vs ours 65
- Rain of Arrows: NW 240 vs ours 300

## Powers we have but with NO magnitude (fill from tooltip)
- **Fighter**: Enforced Threat (NW 250)
- **Paladin**: Burning Light (NW 400)
- **Cleric**: Sacred Flame (NW 300), Geas (NW 700)
- **Warlock**: Dreadtheft (NW 700), Soul Siphon (NW 600)
- **Rogue**: Cloud of Steel (NW 135), Vengeance's Pursuit (NW 450)

## Powers absent from our data (verify + add)
- **Fighter** (7): Weapon Master Strike (130), Mighty Leap (500), Indomitable Battle Strike (1100), Not So Fast (400), Rising Tide (400), Crescendo (800), Explosive Defense (600)
- **Barbarian** (2): Sentinel's Slash (300), Challenger's Slash (90)
- **Wizard** (1): Shard of the Endless Avalanche (250)
- **Warlock** (10): Hellish Rebuke (140), Hand of Blight (75), Curse Bite (325), Fiery Bolt (350), Hellfire Ring (450), Infernal Spheres (450), Killing Flames (650), Wraith's Shadow (500), Gates of Hell (1100), Tyrannical Curse (1150)
- **Ranger** (16): Aimed Shot (200), Hunter's Teamwork (120), Electric Shot (100), Penetrating Arrows (90), Ambush (150), Longstrider's Shot (650), Hawk Shot (275), Commanding Shot (520), Rapid Volley (100), Split the Sky (1125), Binding Arrow (1000), Thorn Ward (1200), Slasher's Mark (2100), Disruptive Shot (400), Cold Steel Hurricane (1000), Call of the Storm (400)
- **Bard** (17): Con Elemento (130), Con Fuoco (130), Con Moto (130), Con Brio (130), Staccato (80), Improvised Lunge (400), Ad Libitum (400), Volti Subito (200), Contre (700), Improvised Ad Libitum (400), Improvised Contre Seconde (700), Contre Seconde (700), Blaze Flamenco (350), Tailwind Mambo (350), Steel March (350), Ballad of the Witch (800), Ballad of the Hero (2000)

## Priorities
1. **Wizard** — 0/27 exact, magnitudes differ power-by-power in both directions
   → our Wizard values look stale (an older patch); needs a full refresh.
2. **Fighter** — 10 real magnitude discrepancies + absent powers.
3. **Bard** — roster differs substantially (our 11 fencing-named powers vs NW's
   musical-named set); likely outdated/incomplete Bard data.
4. **Ranger / Warlock** — several absent/no-mag powers to fill.
5. Barbarian / Rogue / Paladin / Cleric — solid; only a few items each.