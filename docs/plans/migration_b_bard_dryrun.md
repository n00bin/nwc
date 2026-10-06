# Migration B dry run: Bard

Every effect the simulator will read for this class, in plain English. Nothing here changes the live site.
Old blocks stay as the human record. **MISSING** = not on the tooltip, counts zero until captured.
**ASSUMED** = used and labelled in the confidence line.

## Both paragons

- **Fleche** (atWill)
  - hit 180 (single)
  - hit 60 (single), on every 3rd cast, - the third bolt is enhanced: 240
- **Lunge** (encounter)
  - stun 1 s
- **Dancing Lights** (encounter)
  - daze 3 s
  - debuff Dancing Lights Outgoing Damage -5% (on the target) for 6 s
- **Flourish** (encounter)
  - buff Flourish Damage Bonus +30% (you) for 4 s, to type encounter/song, ASSUMED, - encounters and songs +30% for 4 s; a second Flourish after another encounter (up to 8 s per cooldown) is not modelled
- **Duet** (encounter)
  - daze 2 s
- **Inspiration** (daily)
  - buff Inspiration Damage Bonus +25%, Incoming Damage -15% (you) for 12 s
  - heal 2000 over 12 s
  - Inspiration: magnitude set 0, - no hit (the 400x5 is the heal)
- **Critical Tuning** (classFeatures)
  - buff Critical Tuning Critical Severity +10% (you) for 20 s, on cast from song powers, - after a song that is not in a quick play slot
- **Truly Inspired** (classFeatures)
  - buff Truly Inspired Damage Bonus +10% (you) for 20 s, on cast from song powers, Songblade only
  - buff Truly Inspired Outgoing Healing +10% (you) for 20 s, on cast from song powers, Minstrel only
- **Encore** (daily)
  - performance gain 100, - replays your last song for no Performance

## Songblade

- **Soloist** (slottedClassFeatures)
  - buff Damage Bonus +10% (you), only when soloOrIsolated, - no party members within ~30 ft
- **Sforzando** (slottedClassFeatures)
  - buff Sforzando Damage Bonus +5%, Outgoing Healing +5% (you) for 20 s, on cast from song powers
- **Mystifying Strikes** (slottedClassFeatures)
  - proc: damage over time 100 x5 over 12 s, 5% chance on each hit from atWill/encounter/daily powers, only when soloOrIsolated, - solo: 100 x5 over 12 s
  - proc: hit 400, 5% chance on each hit from atWill/encounter/daily powers, not (only when soloOrIsolated), - in a group an ally's hit pops it for 400
- **Advancing Parry** (slottedClassFeatures)
  - buff Advancing Parry Deflect +25% (you) for 2 s, on cast from Reprise, Flourish, Volti Subito
- **Advancing Blade** (slottedClassFeatures)
  - +1 Advancing Blade, on cast from atWill powers, ASSUMED, - the final hit of each at-will combo (counted per at-will cast)
  - buff Damage Bonus +1% (you), scaled by Advancing Blade stacks, - 1% per stack, 5 max
- **Masterful Performance** (slottedClassFeatures)
  - powers matching {"type": ["atWill", "encounter"]}: magnitude add 10, while Blaze Flamenco is up, - +50% on the song's added effects when played manually: +20 -> +30
  - powers matching {"type": ["atWill", "encounter"]}: magnitude add 10, while Steel March is up, - +50% on the song's added effects when played manually: +20 -> +30
  - powers matching {"type": ["atWill", "encounter"]}: magnitude add 10, while Tailwind Mambo is up, - +50% on the song's added effects when played manually: +20 -> +30
  - buff Damage Bonus +1% (you), while Blaze Flamenco is up, - +2% -> +3%
  - buff Damage Bonus +1% (you), while Steel March is up, - +2% -> +3%
  - buff Damage Bonus +1% (you), while Tailwind Mambo is up, - +2% -> +3%
- **Musician's Flow** (slottedClassFeatures)
  - performance regenPct ?, MISSING amount (counts zero), - +25% Performance regeneration (base not captured)
- **Battlefield Ostinato** (feats)
  - buff Ostinato Vivo (you) for 12 s, on cast from powers tagged targets single
  - buff Ostinato Bellicoso (you) for 12 s, on cast from powers tagged targets area
  - buff Damage Bonus +20% (you), to type atWill, tags {"targets": "area"}, while Ostinato Vivo is up, - single-target at-wills boost area at-wills
  - buff Damage Bonus +20% (you), to type atWill, tags {"targets": "single"}, while Ostinato Bellicoso is up, - and the reverse
- **Elemental Medley** (feats)
  - powers matching {"type": ["atWill", "encounter"]}: magnitude add 10, while Blaze Flamenco is up, ASSUMED, - one stack per Con Elemento variant: holding one song = 1 stack (+10)
  - powers matching {"type": ["atWill", "encounter"]}: magnitude add 10, while Steel March is up, ASSUMED, - one stack per Con Elemento variant: holding one song = 1 stack (+10)
  - powers matching {"type": ["atWill", "encounter"]}: magnitude add 10, while Tailwind Mambo is up, ASSUMED, - one stack per Con Elemento variant: holding one song = 1 stack (+10)
- **Ballad Colla Voce** (feats)
  - buff Colla Voce Damage Bonus +5% (you), while Ballad of the Hero is up, - DPS role: +5% while the ballad runs (party)
  - buff Colla Voce Damage Bonus +5% (you), while Ballad of the Witch is up, - DPS role: +5% while the ballad runs (party)
- **A Due** (feats)
  - buff A Due Damage Bonus +10%, Incoming Damage -10%, Outgoing Healing +10% (you), not (only when soloOrIsolated), - you and the nearest party member within 25 ft
- **Redoublement** (feats)
  - buff Redoublement Encounter Damage +10% (you) for 6 s, on cast from Ad Libitum, Volti Subito, ASSUMED, - encounters between Ad Libitum / Volti Subito strikes +10% (window read as 6 s)
- **Martial Performance** (feats)
  - powers matching {"type": ["atWill", "encounter"]}: magnitude add 10, while Blaze Flamenco is up, - +10 for the song when its opening hit lands
  - powers matching {"type": ["atWill", "encounter"]}: magnitude add 10, while Steel March is up, - +10 for the song when its opening hit lands
  - powers matching {"type": ["atWill", "encounter"]}: magnitude add 10, while Tailwind Mambo is up, - +10 for the song when its opening hit lands
- **Performer** (feats)
  - proc: hit (amount missing), MISSING magnitude (counts zero), on cast from atWill/encounter powers, MISSING chance (counts zero), - a chance (not on the tooltip) to cast an improvised encounter
- **Loremaster** (feats)
  - buff Ready to Exploit! Encounter Damage +125% (you) for 10 s, MISSING trigger (counts zero), - 5 Battle Research stacks (at-will proc chance not on the tooltip; 1 s Research casts) open a 10 s window
- **Con Elemento** (atWill)
  - hit 140 (area), - the song variants (Con Fuoco / Moto / Brio) have higher numbers not on the tooltip
- **Ad Libitum** (encounter)
  - proc: Ad Libitum cooldown reset, 50% chance on cast from Ad Libitum, - 50% to reuse at once, up to 3 extra
- **Volti Subito** (encounter)
  - hit 300 x3 (area), - 3 rushes per cooldown (within 6 s)
  - Volti Subito: castSeconds set 2.7, - three 0.9 s rushes
- **Contre** (encounter)
  - knockback, MISSING seconds (counts zero)
  - barrier 40% of max HP, - 50% of frontal damage while held
- **Lore** (daily)
  - debuff Lore Critical Severity Taken +10% (on the target) for 10 s
  - buff Lore Damage Bonus +20% (you) for 10 s
  - buff Lore (type) Damage Bonus +10% (you) for 30 s, to damageType magical, ASSUMED, - the lore of your damage type (magic assumed with Blaze Flamenco)
- **Blaze Flamenco** (songs)
  - hit 350 (area)
  - buff Blaze Flamenco Damage Bonus +2% (party) for 72 s, - you and nearby allies +2%
  - buff Damage Bonus +2% (you), to damageType magical, while Blaze Flamenco is up, - +2% more on fire damage (Battle Harmony)
  - powers matching {"type": ["atWill", "encounter"]}: magnitude add 20, while Blaze Flamenco is up, - your at-wills and encounters +20 magnitude, converted to fire
  - performance spend 100
  - end Steel March, - songs cancel each other (the ballad keeps running)
  - end Tailwind Mambo, - songs cancel each other (the ballad keeps running)
  - end Rejuvenating Carol, - songs cancel each other (the ballad keeps running)
- **Steel March** (songs)
  - hit 350 (area)
  - buff Steel March Damage Bonus +2% (party) for 72 s, - you and nearby allies +2%
  - buff Damage Bonus +2% (you), to damageType physical, while Steel March is up, - +2% more on physical damage (Battle Harmony)
  - powers matching {"type": ["atWill", "encounter"]}: magnitude add 20, while Steel March is up, - your at-wills and encounters +20 magnitude, converted to physical
  - performance spend 100
  - end Blaze Flamenco, - songs cancel each other (the ballad keeps running)
  - end Tailwind Mambo, - songs cancel each other (the ballad keeps running)
  - end Rejuvenating Carol, - songs cancel each other (the ballad keeps running)
- **Tailwind Mambo** (songs)
  - hit 350 (area)
  - buff Tailwind Mambo Damage Bonus +2% (party) for 72 s, - you and nearby allies +2%
  - buff Damage Bonus +2% (you), to damageType physical, while Tailwind Mambo is up, - +2% more on projectile damage (Battle Harmony)
  - powers matching {"type": ["atWill", "encounter"]}: magnitude add 20, while Tailwind Mambo is up, - your at-wills and encounters +20 magnitude, converted to projectile
  - performance spend 100
  - end Blaze Flamenco, - songs cancel each other (the ballad keeps running)
  - end Steel March, - songs cancel each other (the ballad keeps running)
  - end Rejuvenating Carol, - songs cancel each other (the ballad keeps running)
- **Ballad of the Hero** (songs)
  - buff Ballad of the Hero (you) for 20 s
  - hit 85 (single), on each hit from atWill/encounter/daily powers, while Ballad of the Hero is up, - +85 radiant on the primary target per at-will / encounter / daily hit
  - performance spend 100
  - hit 800 (single), on cast from Perform, while Ballad of the Hero is up, MISSING delaySeconds (counts zero), - Perform becomes the finale; it ends the ballad
- **Ballad of the Witch** (songs)
  - buff Ballad of the Witch (you) for 20 s
  - hit 40 (area), on each hit from atWill/encounter/daily powers, while Ballad of the Witch is up, - +40 arcane on every target per at-will / encounter / daily hit
  - performance spend 100
  - hit 400 (area), on cast from Perform, while Ballad of the Witch is up, MISSING delaySeconds (counts zero), - Perform becomes the finale; it ends the ballad
- **Rejuvenating Carol** (songs)
  - heal 100 over 60 s, ASSUMED, - 100 over 60 s (per tick or total: test)
  - buff Rejuvenating Carol (you) for 60 s
  - performance spend 100
  - end Blaze Flamenco, - cancels the elemental song
  - end Steel March, - cancels the elemental song
  - end Tailwind Mambo, - cancels the elemental song

## Minstrel

- **Soloist** (slottedClassFeatures)
  - buff Damage Bonus +10% (you), only when soloOrIsolated, - no party members within ~30 ft
- **Sforzando** (slottedClassFeatures)
  - buff Sforzando Damage Bonus +5%, Outgoing Healing +5% (you) for 20 s, on cast from song powers
- **Mystifying Strikes** (slottedClassFeatures)
  - proc: damage over time 100 x5 over 12 s, 5% chance on each hit from atWill/encounter/daily powers, only when soloOrIsolated, - solo: 100 x5 over 12 s
  - proc: hit 400, 5% chance on each hit from atWill/encounter/daily powers, not (only when soloOrIsolated), - in a group an ally's hit pops it for 400
- **Rhapsody at Arms** (feats)
  - buff Damage Bonus +1%, Incoming Damage -1% (you), x1 per songsActive (max 4), - 1% per song you are under (songs active input, Minstrel default 4)
- **Art of War** (feats)
  - Fleche (Fleche (third bolt)): magnitude add 150, - the final bolt +150 on the primary and splashes 15 ft (40 Performance)
  - Dancing Lights: magnitude set 1400, ASSUMED, - 3 Art of War stacks (3 Fleche combos) convert it: effectively every cast while Fleche is the filler
- **Storyteller** (feats)
  - +1 Storyteller, lasts 15 s, on cast from song powers
  - buff Damage Bonus +5% (you), scaled by Storyteller stacks, - DPS role: +5% per stack, 3 max (party)
- **Desperate Finale** (feats)
  - performance gain 600, MISSING trigger (counts zero), - below 200 Performance, once per 360 s
- **Arpeggio** (atWill)
  - heal 250
  - performance spend 40
- **Bassline** (encounter)
  - performance gain 200, - over the 10 s channel
- **Curtain Call** (daily)
  - Action Points gain 100, while Blaze Flamenco is up, - Blaze Flamenco cashed in
  - heal 800, while Rejuvenating Carol is up
  - buff Curtain Call Incoming Damage -10% (party) for 10 s, while Warding Carol is up
  - barrier 800 for 20 s, while Sheltering Etude is up
- **Blaze Flamenco** (songs)
  - hit 350 (area)
  - buff Blaze Flamenco Damage Bonus +2% (party) for 36 s, - you and nearby allies +2%
  - powers matching {"type": ["atWill", "encounter"]}: magnitude add 20, while Blaze Flamenco is up, - your at-wills and encounters +20 magnitude, converted to fire
  - performance spend 100
- **Rejuvenating Carol** (songs)
  - buff Rejuvenating Carol (you) for 30 s
  - heal 200 over 30 s, MISSING ticks (counts zero), - 200 per tick (interval not captured)
  - performance spend 150
- **Defender's Minuet** (songs)
  - heal 2000, - lowest-HP ally or your Serenade target
  - performance spend 160
- **Warding Carol** (songs)
  - buff Warding Carol (party) for 10 s, - keeps cleansing
  - performance spend 120
- **Aurora Fantasia** (songs)
  - buff Aurora Fantasia (you), MISSING seconds (counts zero), - held while Performance lasts (drain rate not captured)
  - hit 25 (area), on each hit from atWill/encounter/daily powers, while Aurora Fantasia is up
  - heal 50, on each hit from atWill/encounter/daily powers, while Aurora Fantasia is up
  - performance spend 100
- **Sheltering Etude** (songs)
  - buff Sheltering Etude (party) for 60 s
  - heal 600, - under 50% health or at the 60 s end
  - performance spend 200

## Not mapped (and why)

- **Performance (both paragons)**: GATING: the gauge fill rate is not captured: song costs recorded, not limiting casts. All the World's a Stage / Musician's Flow / Gift of Song regen boosts wait on it.
- **Song slots on the page**: There is no song picker in the builder yet: songs reach the simulator once the step 2.9 controls exist (the data is ready).
- **Con Elemento variants**: Con Fuoco / Moto / Brio magnitudes are not on the tooltip: the base 140 fire is used.
- **Staccato**: Combo hit count not on the tooltip: scored per cast at 120.
- **Performer, Loremaster**: Their at-will / encounter proc chances are not on the tooltips: recorded, zero.
- **Flourish second use**: A second Flourish after another encounter (up to 8 s per cooldown) is not modelled.
- **Songward, Contre absorb, Voice Throw, Natural Talents, Vamp, Delayed Play, Serenade, Gambler and the Reprised Carols, Starstruck, Sudden Muse, Pianissimo, Crescendo, Diminuendo, Play it Back, Arpeggio Fortissimo, Vamos Alla!**: Shields, threat, quick-play rules, song storage and healing-side feats: recorded on the heal side or display only.
- **Ballad finales**: Hero's / Witch's Finale fire on the Perform button (not yet a rotation step).

## Where this differs from today's simulator

The step 2.3 parity check must show exactly these differences and nothing else.

1. Fleche: today's simulator lands the whole 600 combo on EVERY cast. New data: 180 per cast with the enhanced third bolt (240) - about a third of today's number, the stored total read as per cast was a bug.
2. Volti Subito: today's simulator counts one 300 rush. New data: three rushes per cooldown (900) over 2.7 s of casting.
3. Inspiration: today's simulator lands '400x5' as damage. New data: it is a heal over time (400 x5) plus the +25% damage buff.
4. Songs: today's simulator has none. New data has them ready (elemental songs, ballads and their riders) once the page can slot them (step 2.9).
5. Everything else today's simulator does not model for Bard (Flourish, Critical Tuning, Truly Inspired, Sforzando, Lore, feats) starts counting where the data has numbers.

## In-game checks this batch adds to the test list

- (gating, both) Performance gauge fill rate in combat.
- Staccato combo hit count; Con Elemento variant magnitudes.
- Performer and Loremaster proc chances.

## Stack rules

- **Advancing Blade**: max 5, lasts 12 s, a new stack resets every timer
- **Storyteller**: max 3

Records: 126. Validator: PASS.
