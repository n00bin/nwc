# Companion verification pass (started 2026-09-11)
n00b and Claude walk every companion in alphabetical order. For each one we confirm FOUR things against an in-game screenshot:
1. **Is it an augment?** (does it attack in game) - flags are known-unreliable, see below
2. **Starting rarity** (the rarity it drops at = the rung its power is stored on)
3. **Slotted bonuses** (the stats the power gives while slotted)
4. **Summoned bonuses** (anything it gives while summoned - drives the Summoned Buffs tab)
5. **Slot** (Offense / Defense / Utility, and combinations)

## LOCKED CARD STYLE (set on Abyssal Chicken, 2026-09-11) — every companion follows this

1. **Proc layout is the structured breakdown** — `Trigger / Chance / Effect / stat rows / Duration / Cooldown`. Do NOT collapse it into one paragraph.
2. **The wording in those fields is the game's own**, copied from the screenshot (e.g. trigger `When you kill an enemy`, not our shorthand `Enemy kill`). Only the cooldown drops the game's parenthetical, because the row label already says Cooldown.
3. **`notes` is INTERNAL** — provenance, scaling reasoning, engine flags. Never rendered once verbatim text exists. Never restate the stat rows in prose.
4. **Enhancements carry a top-level `tooltip`** with the full verbatim sentence; they have no structure to break into rows.
5. **Descriptions live INSIDE their card**, never as a loose paragraph beneath it.
6. **Every rarity-dependent figure is painted in the rarity colour, label included**, and the number is bold: item level, Combined Rating, Bolster, proc chance, proc stat effects, power stats, enhancement value and enhancement item level. Fixed figures keep normal styling — the contrast is the point.
7. **Never restate what the game's own text already says.** The tooltip states the maximum itself (often twice), so our line beside the value only names the rarity it is shown for.
8. **The enhancement scales with the summoned companion's item level.** Stored value is the printed maximum at IL 900 and the ladder is linear, so 9% x 375/900 = 3.75%. The card shows the value for the selected rarity, its item level, and the maximum alongside. DISPLAY ONLY — the engine and optimizer keep using the stored maximum.
9. **Rarity palette:** Common #a8a8a8, Uncommon #4caf50, Rare #4a9eff, Epic #b46cff, Legendary #ff9c3a, **Mythic #56d6f0 (light blue)**, **Celestial #ff7bd1 (pink)**.

**PENDING (n00b agreed, not yet done):** the Artifacts page (`js/artifacts-page.js` RARITY_COLOR) and `insignia-priority.html` still use the old palette — Mythic red, Celestial cyan/light blue. Bring them onto the palette above so a rarity colour means one thing site-wide.

**WHAT COUNTS AS A SUMMONED BONUS (n00b ruling 2026-09-11).** The point of the Summoned Bonuses tab is to surface buffs that are **actually useful and have good uptime**. Effects that are trivially small or blink in and out are NOT recorded as buffs at all — no `summonedBuff` entry, so they are absent from the tab and from the engine. Measurements are still kept in the companion's `notes` so the work is never lost.

First application: **Acolyte of Kelemvor**, both effects dropped — Kelemvor's Sword (+1 point Critical Avoidance, 8s) and Blessings of Kelemvor (10% damage reduction, **3s**).

**THRESHOLD NOT YET PINNED — needs n00b.** 43 companions currently carry a summonedBuff and they were never filtered by this standard. They range from Dread Warrior (+5,000 Power party-wide, 66% uptime) down to Alpha Compy (+1% damage, and only while the companion is below half health). Only 14 of the 43 record an uptime at all and **none** record a duration, so most cannot be judged against a magnitude-times-uptime rule without more reading. See the open question at the end of this file.

**THE ENHANCEMENT ITEM LEVEL ON A SCREENSHOT FOLLOWS THE SUMMONED COMPANION (n00b, 2026-09-11).** Not the companion being inspected, and not the one that unlocks the rune - it is the same input the tooltip names, "the item level of your summoned pet". Evidence: n00b had just upgraded Acolyte of Kelemvor to Rare and had it summoned, so every Inspect panel showed its enhancement at IL 250 even where the companion's own power read IL 900.

Two consequences:
- **Never infer a companion's rarity from the enhancement item level on a card.** That number describes whatever pet was out when the screenshot was taken.
- **An enhancement value read off a card is understated whenever the summoned pet was below IL 900.** Already bitten once - the Enduring family was stored at 4% from a low reading and corrected to 6%. All 30 enhancements are stored at IL 900, which is right; the exposure is in any value transcribed from a low-pet screenshot, and a bad one looks like a plausible number.

This also **confirms the Companions page card is modelled correctly**: its enhancement item level and value both follow the rarity selector, which stands in for the summoned companion.

**SAME STAT IN TWO PLACES = DOUBLE COUNT (found on Air Archon, 2026-09-11).** Air Archon's Insight stored its Power bonus BOTH as an always-on `stats[]` entry AND inside its daily-use proc, so the engine credited it twice - permanently and again conditionally. Fixed: it is proc-only, `stats[]` emptied. A bogus `chance: 10` was also removed (a daily-use trigger is not a chance roll; the 10 was the cooldown misread).

Scan found **3 other powers with the same stat in both places**:
- **Yojimbo's Discipline** (105) - CORRECT as stored. The proc *swaps* the stat (+7.5% Power, **-7.5% Deflect**) so the base Deflect must stay in `stats[]` for the negative to cancel it.
- **Raptor's Instincts** (49, Tamed Velociraptor) and **Feral Raptor's Instincts** (241, Feral Velociraptor) - SUSPECTED double count, **NOT touched**. Both carry a per-stack party Power/Awareness value in `stats[]` *and* in a `trigger: "Passive", chance: 100` proc, which project memory says the engine treats as always-on and counts in the base panel. The Tamed Velociraptor is a meta companion (18 of 20 captured builds), so changing it moves real build numbers - needs n00b's go and ideally an in-game read.

**TOOLTIP SCALING CLAIMS ARE NOT TRUSTWORTHY (2026-09-11).** Twice in one companion: "target ally" actually meant the summoner, and Kelemvor's Sword's "based on your companions level and total Critical Avoidance" is false on every clause - measured flat at +1 point across two rarities with two different companion stat values. **Never encode a tooltip's arithmetic; measure it or mark it unverified.**

**Verbatim text rule (n00b 2026-09-11) - the style every companion must follow:**
- `tooltip` = the game's own wording, copied EXACTLY from the screenshot (keep its grammar quirks; drop only the UI label prefix such as `Equip:`). Powers use `procEffect.tooltip`; enhancements use a top-level `tooltip`.
- `notes` = INTERNAL only - provenance, scaling reasoning, engine flags. Once an entity has verbatim text, `notes` is never rendered anywhere.
- Placeholders (`{chance}`, `effectScaling` keys) interpolate so the verbatim line stays correct at every rarity.
- Verbatim text replaces our derived Trigger/Chance/Effect/Duration/Cooldown lines on the card, and is used by the Lookup, Enhancements and Damage tabs alike.

**Old rule text:** any proc description must be VERBATIM from the screenshot. Store the game's own wording in `procEffect.tooltip`, with `{chance}` and `effectScaling` placeholders so it stays correct at every rarity. Keep the game's grammar quirks. The card shows the verbatim line instead of our parsed Trigger/Chance/Effect wording.

**Card shows bolster (n00b 2026-09-11):** the Lookup card's meta line now prints the companion's bolster contribution at the selected rarity, from the rarity table.

Status values: `unchecked` | `verified` | `fixed` | `needs screenshot`

**Card map:** `docs/audit/companion_card_map.json` maps 157 companions to their archived Inspect card under `docs/audit/companions/_up/`. 117 companions have no card. Cards show slot, slotted bonuses, the summoned Powers list and the enhancement, but they are the owner's UPGRADED copy - they never prove starting rarity.

**Bolster is rarity-driven, NOT a companion property (n00b 2026-09-11).** The Inspect panel's "Companions Bolster Contribution" just reports the rarity the companion is currently at:

| Rarity | Bolster |
|---|---|
| Common | 0.5% |
| Uncommon | 1% |
| Rare | 2% |
| Epic | 3% |
| Legendary | 5% |
| Mythic | 10% |
| Celestial | 12% |

Best 10 companions count, so the ceiling is 120% (ten Celestials). The old "Bolster 10%" in 130 companion notes was never stale data - those were captures of Mythic copies. Do NOT store a bolster figure per companion; strip it as we pass through. Published as the "Companion Bolster" tab on companions.html.

**Enhancements are INDEPENDENT of the companion (n00b 2026-09-11):** a companion only UNLOCKS its enhancement rune; the rune is equipped on its own and needs neither that companion summoned nor slotted. So `enhancementRef` means "unlocks", not "wears", and the tooltip's "item level of your summoned pet" means whichever companion IS summoned. Toon Forge already models this (`s.summonedEnh` is picked separately). The Companions page card simply labels it "Enhancement", which is a little misleading - worth relabelling.

**RULED + APPLIED + VERIFIED IN-GAME 2026-09-11 — enhancement procs sit behind the combat buff.** n00b measured it: with a companion summoned and held constant, equipping Perfect Vision changed Accuracy by **zero** at rest (138,402 both ways, TIL 139,797). The buff really is off until it procs, so the conditional flags are correct. All 24 "Chance on hit to ..." enhancements are flagged `conditional`, so Toon Forge drops them from the at-rest stat panel and shows them in the combat / Show conditional view. n00b's reasoning: once a fight is running the proc is up almost continuously, so it is a combat buff, not a standing one — and the unbuffed sheet then reads correctly. Previously only Perfect Vision was flagged, so 161 companions were inflating the at-rest panel (a further 81 used enemy-scope debuffs the engine already skipped). The 5 Enduring enhancements stay always-on. **Reinvigorate has NO description text in our data** — left unflagged until its tooltip is read. **Measured 2026-09-11 (Perfect Vision, Celestial companion summoned):**
- **Percent enhancements add percentage POINTS, not rating.** Accuracy rating stayed 138,402 while the panel went 53.6% -> 62.6%, i.e. exactly +9 points. The engine already does this (`finalPct = ratingContribPct + percentTotal` in toon-forge-engine.js) - VALIDATED, no change needed.
- **The companion's own attacks trigger the proc** - it fired with the player not attacking at all. All 24 triggers now read "On hit, including your companion's own attacks". This also makes a chance-per-hit measurement impractical, since you cannot count your own hits while the pet lands its own; the practical answer is that it stays up through a fight, which is how we model it.
- **Duration 15s CONFIRMED** - the proc shows in the buff bar with a live countdown. TEST A IS CLOSED; every answer matches how we model it.
- **Proc chance measured: ~13% per hit** (raw 13.33%, bias-corrected 12.75%; displayed rounded because 20 trials supports ~2 significant figures) (Perfect Vision, **20 trials**, augment summoned so only the player's hits counted; 150 hits / 20 procs, 95% range 8.1-19.8%). 20% ruled out; 12.5% (1 in 8) is the best-fitting round number. **Applied to all 24** per n00b's ruling 2026-09-11: every one reads exactly "Chance on hit", so they share a rate. The card labels the difference - Perfect Vision says "measured over 20 trials", the rest say "same trigger wording, measured on Perfect Vision". Differently-worded triggers ("chance on getting hit" etc.) must be retested; none exist today. The companion's own hits are assumed to use the same rate, since augments are rarely used in real builds and the pet lands most of the hits. **The pet's hits do NOT get added into the 13.3%** - that figure is a probability per hit, not a rate per second; the pet raises how many hits land, i.e. UPTIME, not the odds on any one swing. At 13.3% per hit over a 15s buff you need only 0.5 hits/sec to average one proc per duration, and ~20 hits in a 15s window already gives 94% uptime - which is the arithmetic behind modelling these as effectively always-on in combat.
- **Instrument note:** the buff bar shows these procs with a countdown, which beats reading the character sheet for any future proc work (mount powers, gear procs, companion powers).

**ORIGINAL FINDING:** 23 of 30 enhancements say "Chance on hit to ...", but only Perfect Vision is flagged `conditional`. The other 22 are attached to **242 of 274 companions** and are currently modelled as always-on. The six Enduring ones plus Reinvigorate say "While your companion is summoned and not downed" and are genuinely always-on. Measurement procedure written up in `docs/tests/companion_proc_tests.md`. Engine NOT changed - this would move the standing stat panel for nearly every companion.

**AUGMENT FLAGS ARE NOT TRUSTWORTHY (found 2026-09-11).** Proud Pink Yeti was stored `augment: false`; n00b confirmed in-game that it does not attack, so it IS an augment. Corrected. This matters beyond display: the optimizer bars augments from the SUMMONED slot by default, so a wrong flag makes an illegal summon look legal. There is **no reliable signal in the data** to audit the rest - 37 companions have a "...'s Presence" power without the augment flag, while 26 flagged augments use other power names entirely. **Add "does it attack?" to the per-companion check as we pass through.** Proud Pink Yeti also still needs its `augmentShares` read off its Inspect panel (it is the only augment missing that).

**CONFLICT TO RESOLVE:** Toon Forge's own per-tier table (toon-forge.html, the comp-bolster hint text and `compBolsterFromCollection`) reads Common 1 / Uncommon 2 / Rare 3.5 / Epic 5 / Legendary 7.5 / Mythic 10 / Celestial 12. Mythic and Celestial agree with n00b; the five lower tiers do not. Those five were flagged "unverified (estimated)" in project memory. Engine NOT changed yet - needs n00b's go, because it moves TIL math.

| # | Companion | Status | Base rarity (stored) | Slot (stored) | Slotted bonuses (stored) | Summoned (stored) |
|---|---|---|---|---|---|---|
| 1 | Abyssal Chicken | **VERIFIED 4/4** (Epic / Offense / no slotted stats / no summoned bonuses) | Epic | Offense | PROC | - |
| 2 | Acolyte of Kelemvor | **VERIFIED** - summoned bonus added and measured; Blessings of Kelemvor duration still open | Uncommon | Utility | Deflect 0.75%, Incoming Healing 0.75% | - |
| 3 | Air Archon | **VERIFIED** - rarity corrected to Rare; double-counted Power bonus fixed | Common | Offense/Utility | Power 0.75% | - |
| 4 | Alchemist Experimenter | **VERIFIED** - no summoned bonus (heal, ruled out) | Epic | Offense/Utility | Critical Strike 1.88%, Combat Advantage 1.88% | - |
| 5 | Savage Allosaur (was Allosaurus) | **VERIFIED** - renamed; stat normalized; NO skills text so summoned bonus UNKNOWN | Epic | Defense/Utility | Maximum Hit Points 7500, Critical Strike 1.9% | - |
| 6 | Alpha Compy | **VERIFIED** - Call of Vengeance ruled out; Chult doubling captured | Mythic | Utility | Power 7.5% | party: Damage Bonus 1.0% |
| 7 | Ambush Drake | **VERIFIED** - all four checks confirmed off card c054, nothing to fix | Epic | Offense/Utility | Critical Severity 1.88%, Awareness 1.88% | - |
| 8 | Angel of Protection | **VERIFIED** - Protective Ward always-on + non-stacking; Ward captured, blocked on per-effect uptime | Epic | Defense | PROC | party: Defense 3.0% |
| 9 | Aoth Fezim & Brightwing | **VERIFIED** off card c140; Keen Eyes 9.6% confirmed genuine; name spelling open | Mythic | Offense/Utility | Accuracy 3.75%, Combat Advantage 3.75% | - |
| 10 | Apprentice Healer | **VERIFIED** off two named screenshots; Max HP moved out of a fake proc; exact-rung sweep | Common | Utility | Incoming Healing 0.37% | - |
| 11 | Aranea | **VERIFIED** off card c144; chance is flat 5%, magnitude ladder derived and Celestial predicted at 270 | Uncommon | Offense | PROC | - |
| 12 | Armored Orc Wolf | **VERIFIED** off card c070; base corrected Common -> Uncommon (n00b: green) | Common | Offense | Accuracy 0.38%, Critical Strike 0.38% | - |
| 13 | Assassin Drake | unchecked | Epic | Offense | Accuracy 1.88%, Critical Severity 1.88% | - |
| 14 | Astral Deva | unchecked | Rare | Defense | Heal Percent 2.5% | - |
| 15 | Baby Bear (augment) | unchecked | Uncommon | Defense | PROC | - |
| 16 | Baby Boar (augment) | unchecked | Uncommon | Offense | Deflect 0.75%, Critical Severity 0.75% | - |
| 17 | Baby Bulette (augment) | unchecked | Epic | Defense | PROC | - |
| 18 | Baby Deep Crow (augment) | unchecked | Mythic | Offense | Power 7.5% | - |
| 19 | Baby Displacer Beast (augment) | unchecked | Uncommon | Defense/Offense | PROC | - |
| 20 | Baby Gorilla (augment) | unchecked | Epic | Offense/Utility | Deflect 1.88%, Critical Severity 1.88% | - |
| 21 | Baby Owlbear (augment) | unchecked | Mythic | Utility | PROC | - |
| 22 | Barbarian Shaman | unchecked | Rare | Offense/Utility | Combat Advantage 1.25%, Power 1.25% | - |
| 23 | Basic Bok | unchecked | Epic | Utility | PROC | - |
| 24 | Batiri Runt | unchecked | Legendary | Offense | Damage Vs Bosses 8.25% | - |
| 25 | Battlefield Medic | unchecked | Epic | Utility | Combat Advantage 1.88%, Incoming Healing 1.88% | - |
| 26 | Black Dragon Ioun Stone (augment) | unchecked | Mythic | Offense | Critical Strike 7.5% | - |
| 27 | Black Ice Prospector | unchecked | Epic | Defense | Deflect 1.88%, Critical Avoidance 1.88% | - |
| 28 | Black Ice Stone (augment) | unchecked | Uncommon | Utility | PROC | - |
| 29 | Black Scorpion | unchecked | Celestial | Offense | PROC | enemy |
| 30 | Blacksmith | unchecked | Rare | Utility | PROC | - |
| 31 | Blaspheme Assassin | unchecked | Mythic | Offense | PROC | enemy |
| 32 | Blink Dog | unchecked | Uncommon | Offense | Deflect 0.75%, Critical Avoidance 0.75% | enemy |
| 33 | Blue Fire Eye | unchecked | Common | Offense | PROC | party: Critical Strike 3.0% |
| 34 | Bobby | unchecked | Mythic | Defense/Utility | Maximum Hit Points 12000, Defense 4.5% | - |
| 35 | Book Imp | unchecked | Epic | Offense/Utility | Accuracy 1.88%, Combat Advantage 1.88% | - |
| 36 | Bruenor Battlehammer | unchecked | Mythic | Defense | Awareness 3.75%, Defense 3.75% | party: Incoming Damage -3.0% |
| 37 | Butterfly (augment) | unchecked | Mythic | Defense | PROC | - |
| 38 | Cambion Magus | unchecked | Common | Offense | Accuracy 0.38%, Critical Severity 0.38% | - |
| 39 | Cantankerous Mage | unchecked | Uncommon | Defense | Accuracy 0.75%, Defense 0.75% | enemy |
| 40 | Captain Elaina Sartell | unchecked | Epic | Offense/Defense | Heal And Damage 3.75% | party: Action Point Gain 5.0%, Critical Severity 5.0% |
| 41 | Cat (augment) | unchecked | Rare | Defense/Utility | Deflect 1.25%, Defense 1.25% | - |
| 42 | Catti-brie | unchecked | Epic | Utility | Movement Speed 1.88%, Control Resist 1.88% | party: Movement Speed 5.0% |
| 43 | Cave Bear | unchecked | Legendary | Offense/Utility | Maximum Hit Points 11000, Accuracy 2.8% | - |
| 44 | Celeste | unchecked | Epic | Utility | PROC | - |
| 45 | Celestial Lion | unchecked | Epic | Utility | PROC | - |
| 46 | Chicken (augment) | unchecked | Epic | Defense | PROC | - |
| 47 | Chultan Hunter | unchecked | Epic | Utility | PROC | - |
| 48 | Cleric Disciple | unchecked | Uncommon | Utility | Incoming Healing 0.75%, Power 0.75% | - |
| 49 | Cockatrice | unchecked | Epic | Utility | PROC | - |
| 50 | Cold Iron Warrior | unchecked | Common | Offense | Damage Vs Fey 1.13% | - |
| 51 | Coldlight Walker | unchecked | Mythic | Utility | Critical Strike 3.75%, Critical Severity 3.75% | - |
| 52 | Con Artist | unchecked | Common | Offense | PROC | - |
| 53 | Crab | unchecked | Epic | Utility | PROC | - |
| 54 | Crimson Crystal Golem | unchecked | Common | Utility/Defense | Accuracy 0.38%, Combat Advantage 0.38% | - |
| 55 | Crystalline Golem | unchecked | Epic | Offense/Utility | Power 1.9% | - |
| 56 | Cunning Mimic | unchecked | Mythic | Offense | Forte 3.8% | - |
| 57 | Cyclops War Drummer | unchecked | Epic | Utility | Incoming Healing 1.88% | party: Incoming Damage -3.0% |
| 58 | Damaran Shepherd | unchecked | Common | Offense | Critical Strike 0.38%, Critical Avoidance 0.38% | - |
| 59 | Dancing Blade | unchecked | Common | Offense | Critical Severity 0.38%, Combat Advantage 0.38% | enemy |
| 60 | Dancing Shield | unchecked | Uncommon | Defense | Deflect 0.75%, Critical Strike 0.75% | - |
| 61 | Dark Dealer | unchecked | Epic | Utility | Combat Advantage 1.88%, Accuracy 1.88% | - |
| 62 | Death Slaad | unchecked | Uncommon | Offense | PROC | - |
| 63 | Dedicated Squire | unchecked | Legendary | Utility | Accuracy 2.75%, Incoming Healing 2.75% | - |
| 64 | Demonic Servant | unchecked | Epic | Utility | Forte 1.88%, Accuracy 1.88% | - |
| 65 | Deva Champion | unchecked | Rare | Utility | Critical Avoidance 1.25%, Incoming Healing 1.25% | self |
| 66 | Diana | unchecked | Mythic | Utility | Movement Speed 3.75%, Stamina Regeneration 3.75% | party: Movement Speed 10.0% |
| 67 | Displacer Beast | unchecked | Epic | Offense | PROC | - |
| 68 | Dog | unchecked | Mythic | Offense | Critical Severity 3.75%, Power 3.75% | - |
| 69 | Dragon Hunter | unchecked | Epic | Offense | Damage Vs Dragons 5.63% | - |
| 70 | Dragonborn Brawler | unchecked | Rare | Defense | Deflect 1.25%, Awareness 1.25% | - |
| 71 | Dragonborn Raider | unchecked | Uncommon | Defense/Offense | Awareness 0.75%, Combat Advantage 0.75% | - |
| 72 | Dread Warrior | unchecked | Mythic | Utility | PROC | party: Power 5000%, Critical Severity 5.0% |
| 73 | Drizzt Do'Urden | unchecked | Celestial | Offense | Critical Strike 4.5%, Critical Severity 4.5% | party: Damage Bonus 3.0% |
| 74 | Duergar Guard | unchecked | Celestial | Defense | Critical Avoidance 9% | - |
| 75 | Duergar Theurge | unchecked | Epic | Defense | Critical Severity 1.88%, Incoming Healing 1.88% | - |
| 76 | Dwarven Battlerager | unchecked | Uncommon | Defense | Critical Severity 0.75%, Critical Avoidance 0.75% | - |
| 77 | Earl the Chickenmancer | unchecked | Rare | Offense/Utility | PROC | - |
| 78 | Earth Archon | unchecked | Uncommon | Defense/Offense | PROC | - |
| 79 | Eladrin | unchecked | Epic | Utility | PROC | - |
| 80 | Elemental Air Cultist | unchecked | Uncommon | Defense | Accuracy Reduction 0.75% | - |
| 81 | Elite Intern | unchecked | Common | Offense | Critical Severity 0.38%, Awareness 0.38% | - |
| 82 | Elminster Aumar | unchecked | Mythic | Defense | PROC | - |
| 83 | Elminster Simulacrum | unchecked | Legendary | Offense | PROC | - |
| 84 | Encore the Virtuoso | unchecked | Mythic | Defense/Utility | Critical Severity 2.5%, Outgoing Healing 2.5%, Power 2.5% | mixed: Outgoing Healing 1.5%, Power 1.5%, Critical Severity 1.5% |
| 85 | Energon | unchecked | Mythic | Utility | PROC | - |
| 86 | Eric the Cavalier | unchecked | Epic | Utility/Defense | PROC | - |
| 87 | Erinyes of Belial | unchecked | Rare | Offense | Critical Severity 1.25%, Defense 1.25% | - |
| 88 | Etrien | unchecked | Epic | Utility | Movement Speed 1.3%, Action Point Gain 1.3%, Recharge Speed 1.3% | party: Power 2.0%, Critical Strike 2.0% |
| 89 | Faithful Initiate | unchecked | Epic | Offense | Combat Advantage 1.88%, Outgoing Healing 1.88% | - |
| 90 | Fawn | unchecked | Mythic | Offense/Utility | Critical Strike 3.75%, Power 3.75% | - |
| 91 | Feral Velociraptor | unchecked | Epic | Offense | Awareness 1.88% | - |
| 92 | Festive Tiger (augment) | unchecked | Uncommon | Offense | Movement Speed 0.75%, Critical Strike 0.75% | - |
| 93 | Feywild Sylph | unchecked | Common | Defense | Critical Strike 0.38%, Critical Avoidance 0.38% | - |
| 94 | Fire Archon | unchecked | Epic | Defense/Offense | PROC | - |
| 95 | Fireblossom Zealot | unchecked | Epic | Defense | PROC | party |
| 96 | Flame Sprite | unchecked | Uncommon | Offense | Accuracy 0.75%, Critical Strike 0.75% | - |
| 97 | Flaming Skull | unchecked | Common | Defense/Offense | Combat Advantage 0.38%, Defense 0.38% | - |
| 98 | Flapjack | unchecked | Celestial | Defense/Utility | Stamina Regeneration 9% | party: Combat Advantage 5.0% |
| 99 | Flumph | unchecked | Mythic | Defense | PROC | - |
| 100 | Frost Mimic | unchecked | Mythic | Defense | Defense 3.75%, Awareness 3.75% | - |
| 101 | Galeb Duhr | unchecked | Rare | Offense | Stamina Restore 2.5% | - |
| 102 | Ghost | unchecked | Epic | Offense/Utility | Power 1.88%, Critical Strike 1.88% | - |
| 103 | Githyanki | unchecked | Epic | Utility | Stamina Regeneration 1.88%, Power 1.88% | - |
| 104 | Goat (augment) | unchecked | Uncommon | Defense/Utility | Maximum Hit Points 3000, Deflect 0.75% | - |
| 105 | Golden Bulette Pup (augment) | unchecked | Mythic | Offense/Defense/Utility | Outgoing Healing 7.5% | - |
| 106 | Golden Cat (augment) | unchecked | Celestial | Defense/Utility/Offense | Combat Advantage 9% | - |
| 107 | Golden Deep Crow Egg (augment) | unchecked | Mythic | Defense/Offense/Utility | Awareness 7.5% | - |
| 108 | Golden Goat (augment) | unchecked | Epic | Defense/Utility/Offense | Forte 3.75% | - |
| 109 | Goldfish (augment) | unchecked | Uncommon | Offense/Utility | Critical Avoidance 0.75%, Incoming Healing 0.75% | - |
| 110 | Grace Revoir | unchecked | Mythic | Offense | At Will Dmg Bonus 5.0% | - |
| 111 | Grazilaxx | unchecked | Rare | Defense/Offense | Deflect 1.25%, Critical Strike 1.25% | - |
| 112 | Green Slime | unchecked | Uncommon | Defense | Defense 1.5% | - |
| 113 | Greenscale Hunter | unchecked | Legendary | Utility | PROC | - |
| 114 | Grillmaster | unchecked | Epic | Offense/Defense | Power 1.88%, Movement Speed 1.88% | - |
| 115 | Gromph Baenre | unchecked | Epic | Offense | Critical Strike 3.75% | - |
| 116 | Grung | unchecked | Epic | Offense | PROC | - |
| 117 | Halfling Wayward Wizard | unchecked | Uncommon | Utility | PROC | - |
| 118 | Hank the Ranger | unchecked | Mythic | Offense | PROC | - |
| 119 | Harper Bard | unchecked | Common | Defense/Utility | Maximum Hit Points 1500, Awareness 0.38% | party: Power 2.0%, Critical Strike 2.0% |
| 120 | Hawk | unchecked | Rare | Offense | Critical Severity 1.25%, Critical Strike 1.25% | - |
| 121 | Hell Hound | unchecked | Epic | Utility | PROC | - |
| 122 | Helmite Paladin Ghost | unchecked | Uncommon | Offense/Utility | Critical Strike 0.75% | - |
| 123 | Honey Badger | unchecked | Epic | Defense/Utility | Damage Taken Reduction 3.75% | - |
| 124 | Hunting Drake | unchecked | Epic | Defense | Maximum Hit Points 7500, Accuracy 1.9% | - |
| 125 | Hunting Hawk | unchecked | Common | Offense/Utility | At Will Damage Range 0.75% | - |
| 126 | Ice Galeb Duhr | unchecked | Epic | Defense | Damage Resistance 3.75% | - |
| 127 | Ice Sprite | unchecked | Uncommon | Defense | Accuracy 0.75%, Critical Avoidance 0.75% | - |
| 128 | Icosahedron Ioun Stone (augment) | unchecked | Mythic | Utility | Movement Speed 7.5% | - |
| 129 | Incubus | unchecked | Epic | Offense | PROC | - |
| 130 | Intellect Devourer | unchecked | Mythic | Offense | Awareness 3.75%, Combat Advantage 3.75% | - |
| 131 | Ioun Stone of Allure (augment) | unchecked | Mythic | Defense/Utility | Incoming Healing 3.75%, Forte 3.75% | - |
| 132 | Ioun Stone of Might (augment) | unchecked | Epic | Defense/Utility | Deflect 1.88%, Power 1.88% | - |
| 133 | Ioun Stone of Radiance (augment) | unchecked | Epic | Defense/Utility | Deflect 1.88%, Outgoing Healing 1.88% | - |
| 134 | Iron Golem | unchecked | Epic | Defense/Utility | Maximum Hit Points 7500, Defense 1.9% | - |
| 135 | Jagged Dancing Blade | unchecked | Uncommon | Offense | Defense Reduction 1.5% | - |
| 136 | Jarlaxle Baenre | unchecked | Common | Offense | Accuracy 0.75% | - |
| 137 | Kavatos Stormeye | unchecked | Mythic | Defense | Critical Strike 3.75%, Forte 3.75% | - |
| 138 | Kenku Archer | unchecked | Mythic | Offense/Utility | Power 3.75%, Critical Severity 3.75% | - |
| 139 | Kingfisher Intern | unchecked | Common | Offense/Utility | Maximum Hit Points 1500%, Combat Advantage 0.38% | - |
| 140 | Kuo-toa | unchecked | Uncommon | Defense/Offense | PROC | - |
| 141 | Laughing Skull | unchecked | Epic | Defense/Offense | Combat Advantage 1.88%, Defense 1.88% | - |
| 142 | Lava Galeb Duhr | unchecked | Epic | Offense | Daily Damage 3.75% | - |
| 143 | Leprechaun | unchecked | Rare | Defense | Critical Avoidance 1.25%, Combat Advantage 1.25% | - |
| 144 | Lich | unchecked | Celestial | Defense | Incoming Damage -9.0% | - |
| 145 | Lich Makos | unchecked | Mythic | Offense | PROC | - |
| 146 | Lightfoot Thief | unchecked | Rare | Offense | Critical Strike 1.25%, Critical Severity 1.25% | - |
| 147 | Lillend | unchecked | Epic | Utility | PROC | - |
| 148 | Linu La'neral | unchecked | Mythic | Utility | Forte 3.75%, Outgoing Healing 3.75% | - |
| 149 | Little White (augment) | unchecked | Epic | Utility | Incoming Healing 1.25%, Critical Avoidance 1.25%, Movement Speed 1.25% | - |
| 150 | Lizardfolk Shaman | unchecked | Uncommon | Utility | Awareness 0.75%, Incoming Healing 0.75% | - |
| 151 | Lulu the Hollyphant | unchecked | Epic | Defense | Damage Resistance 1.88%, Heal Percent 3.75% | - |
| 152 | Lysaera | unchecked | Mythic | Utility/Defense | PROC | enemy |
| 153 | Mage Slayer | unchecked | Epic | Utility | PROC | - |
| 154 | Makos | unchecked | Epic | Defense | Defense 1.88%, Deflect 1.88% | - |
| 155 | Man at Arms | unchecked | Uncommon | Defense | Defense 0.75%, Combat Advantage 0.75% | - |
| 156 | Manticore | unchecked | Epic | Utility | PROC | - |
| 157 | Mercenary | unchecked | Celestial | Offense/Utility | Power 4.5%, Combat Advantage 4.5% | - |
| 158 | Mini Apparatus of Gond (augment) | unchecked | Common | Defense | Critical Strike 0.38%, Critical Severity 0.38% | - |
| 159 | Minotaur | unchecked | Mythic | Defense | PROC | - |
| 160 | Minsc | unchecked | Celestial | Defense | Damage Vs Strong 9.8% | party: Combat Advantage 2.0%, Incoming Healing 2.0% |
| 161 | Minstrel | unchecked | Uncommon | Defense/Utility | Power 0.75%, Awareness 0.75% | - |
| 162 | Moonshae Druid | unchecked | Uncommon | Defense/Utility | Critical Avoidance 0.75% | - |
| 163 | Mornhelm the Severed | unchecked | Epic | Offense | Forte 1.88%, Combat Advantage 1.88% | - |
| 164 | Myconid | unchecked | Epic | Defense | Critical Avoidance 1.88%, Awareness 1.88% | - |
| 165 | Mystagogue | unchecked | Legendary | Offense | Critical Severity 2.75%, Combat Advantage 2.75% | - |
| 166 | Mystic Phoera | unchecked | Epic | Defense/Utility | PROC | - |
| 167 | Netherese Arcanist | unchecked | Uncommon | Offense | Damage Vs Not Facing 0.75% | - |
| 168 | Neverember Guard | unchecked | Rare | Offense | Awareness 1.25%, Outgoing Healing 1.25% | - |
| 169 | Neverember Guard Archer | unchecked | Uncommon | Utility | Power 0.75%, Defense 0.75% | - |
| 170 | Neverwinter Knight | unchecked | Epic | Offense | Outgoing Damage 3.75% | party: Defense 2.0% |
| 171 | Orc Wolf | unchecked | Uncommon | Offense | Accuracy 0.75%, Critical Strike 0.75% | - |
| 172 | Owl | unchecked | Mythic | Defense/Utility | Maximum Hit Points 15000, Awareness 3.8% | - |
| 173 | Ox Stot (augment) | unchecked | Uncommon | Offense | PROC | - |
| 174 | Panther | unchecked | Uncommon | Offense | At Will Damage Vs Rooted 1.13% | enemy |
| 175 | Paranoid Delusion | unchecked | Epic | Offense | At Will Damage Vs Disabled 5.63% | - |
| 176 | Pewter Golem | unchecked | Rare | Defense/Utility | Defense 1.25%, Critical Strike 1.25% | - |
| 177 | Phasespider | unchecked | Common | Defense | Critical Strike 0.38%, Combat Advantage 0.38% | - |
| 178 | Phoera | unchecked | Uncommon | Utility | PROC | - |
| 179 | Pig | unchecked | Uncommon | Utility | PROC | - |
| 180 | Polar Bear Cub (augment) | unchecked | Epic | Defense/Utility | Outgoing Healing 1.88%, Defense 1.88% | - |
| 181 | Portal Hound | unchecked | Uncommon | Defense | Damage Vs Kabal 1.5% | - |
| 182 | Portobello DaVinci | unchecked | Celestial | Utility | PROC | party: Power 3.5%, Combat Advantage 3.5% |
| 183 | Presto the Magician | unchecked | Mythic | Utility/Defense | Outgoing Healing 3.75%, Defense 3.75% | - |
| 184 | Priestess of Sehanine Moonbow | unchecked | Mythic | Defense | Deflect 3.75%, Awareness 3.75% | mixed |
| 185 | Priestess of Sune | unchecked | Rare | Defense | Deflect 1.25%, Accuracy 1.25% | - |
| 186 | Proud Pink Yeti | unchecked | Common | Defense/Offense/Utility | Outgoing Healing 0.75% | - |
| 187 | Pseudodragon | unchecked | Epic | Utility | PROC | - |
| 188 | Quasit (augment) | unchecked | Legendary | Defense/Utility | Deflect 2.75%, Critical Severity 2.75% | - |
| 189 | Quickling | unchecked | Mythic | Offense/Utility | Critical Strike 3.75%, Outgoing Healing 3.75% | - |
| 190 | Rabbit (augment) | unchecked | Uncommon | Utility | Movement Speed 0.75%, Critical Avoidance 0.75% | - |
| 191 | Rat Pup (augment) | unchecked | Uncommon | Offense | PROC | - |
| 192 | Rath Modar | unchecked | Mythic | Utility/Defense | PROC | - |
| 193 | Rattigan the Wise | unchecked | Mythic | Utility | PROC | enemy |
| 194 | Razorwood | unchecked | Epic | Offense | Accuracy 1.88%, Critical Severity 1.88% | - |
| 195 | Red Dragon Ioun Stone (augment) | unchecked | Rare | Defense/Utility | Incoming Healing 1.3% | - |
| 196 | Red Slaad | unchecked | Rare | Defense | Accuracy 1.25%, Critical Severity 1.25% | - |
| 197 | Redcap Powrie | unchecked | Epic | Defense/Offense | Critical Severity 1.88%, Critical Avoidance 1.88% | - |
| 198 | Redeemed Fallen | unchecked | Epic | Defense | Accuracy 1.88%, Combat Advantage 1.88% | - |
| 199 | Regis | unchecked | Celestial | Defense | Deflect 4.5%, Deflect Severity 4.5% | party: Recharge Speed 3.0% |
| 200 | Remorhaz | unchecked | Epic | Offense | PROC | - |
| 201 | Renegade Evoker | unchecked | Uncommon | Offense | PROC | - |
| 202 | Renegade Illusionist | unchecked | Uncommon | Defense | Accuracy 0.75%, Critical Avoidance 0.75% | - |
| 203 | Repentant Dragon Cultist | unchecked | Epic | Offense | PROC | - |
| 204 | Rimefire Golem | unchecked | Epic | Offense/Utility | Maximum Hit Points 7500, Critical Severity 1.9% | - |
| 205 | Riotous Rothe | unchecked | Common | Defense/Utility | Incoming Healing 0.75% | enemy |
| 206 | Rothé | unchecked | Uncommon | Defense/Utility | Incoming Healing 1.5% | - |
| 207 | Rumpadump | unchecked | Mythic | Offense | PROC | - |
| 208 | Rust Monster | unchecked | Epic | Defense | Critical Severity Reduction 3.75% | - |
| 209 | Sardina the Tressym | unchecked | Mythic | Offense/Utility | Power 3.75%, Movement Speed 4% | - |
| 210 | Scarecrow | unchecked | Rare | Offense/Utility | Critical Severity 1.25%, Defense 1.25% | - |
| 211 | Sellsword | unchecked | Uncommon | Offense/Utility | Accuracy 0.75%, Awareness 0.75% | - |
| 212 | Sergeant Knox | unchecked | Epic | Defense | Defense 1.88%, Accuracy 1.88% | - |
| 213 | Shadar-kai Witch | unchecked | Epic | Utility | Power 1.88%, Critical Strike 1.88% | - |
| 214 | Shadow Demon | unchecked | Epic | Utility | PROC | - |
| 215 | Shadow Elemental | unchecked | Epic | Offense | PROC | party: Critical Avoidance 1.5%, Movement Speed 2.5% |
| 216 | Shieldmaiden | unchecked | Common | Defense | Deflect 0.38%, Combat Advantage 0.38% | - |
| 217 | Siege Master | unchecked | Rare | Offense | At Will Power 3.75% | party: Defense 3.0% |
| 218 | Sir Waddlelot | unchecked | Mythic | Defense/Offense | PROC | party: Defense 3.5%, Power 3.5% |
| 219 | Skeletal Dog | unchecked | Epic | Defense | Critical Avoidance 1.88% | - |
| 220 | Skeleton | unchecked | Uncommon | Defense | Critical Avoidance 0.75%, Defense 0.75% | - |
| 221 | Skyblazer | unchecked | Epic | Utility | PROC | - |
| 222 | Slyblade Kobold | unchecked | Uncommon | Offense | Encounter Damage Vs Disabled 2.25% | - |
| 223 | Snow Fawn | unchecked | Uncommon | Utility | Critical Severity 0.75%, Defense 0.75% | - |
| 224 | Snow Leopard | unchecked | Epic | Offense | PROC | - |
| 225 | Songstress | unchecked | Rare | Defense/Utility | Control Resist 1.25%, Incoming Healing 1.25% | - |
| 226 | Soradiel | unchecked | Common | Defense | Critical Strike 0.38%, Critical Severity 0.38% | - |
| 227 | Spined Devil | unchecked | Celestial | Offense | PROC | enemy |
| 228 | Splinters | unchecked | Uncommon | Defense | Critical Severity 0.75%, Critical Avoidance 0.75% | - |
| 229 | Sprite | unchecked | Epic | Defense/Offense | Accuracy 1.88%, Critical Avoidance 1.88% | - |
| 230 | Staldorf | unchecked | Epic | Offense | Combat Advantage 3.75% | - |
| 231 | Stalwart Golden Lion | unchecked | Celestial | Utility | PROC | self |
| 232 | Star of Simril (augment) | unchecked | Uncommon | Offense/Utility | Maximum Hit Points 2000, Critical Strike 0.5%, Gold Bonus 1% | - |
| 233 | Storm Rider | unchecked | Uncommon | Utility | Power 0.75% | - |
| 234 | Stronghold's Cleric | unchecked | Epic | Utility | PROC | - |
| 235 | Succubus | unchecked | Epic | Offense | PROC | enemy |
| 236 | Swashbuckler | unchecked | Uncommon | Offense | PROC | enemy |
| 237 | Sylph | unchecked | Epic | Defense | Critical Strike 1.88%, Awareness 1.88% | - |
| 238 | Tamed Velociraptor | unchecked | Celestial | Offense | Power 4.5% | - |
| 239 | Tiger | unchecked | Epic | Offense | PROC | - |
| 240 | Tomb Spider | unchecked | Rare | Offense | PROC | - |
| 241 | Traveling Entertainer | unchecked | Uncommon | Offense | Critical Strike 0.75%, Defense 0.75% | - |
| 242 | Trobriand's Construct | unchecked | Epic | Defense | PROC | - |
| 243 | Tutor | unchecked | Celestial | Offense | PROC | party: Combat Advantage 5.0% |
| 244 | Twitchspine the Clinging | unchecked | Mythic | Defense | PROC | - |
| 245 | Vallenhas Elite Soldier | unchecked | Epic | Offense/Utility | Outgoing Healing 1.3%, Awareness 1.3% | - |
| 246 | Vampire | unchecked | Epic | Offense | PROC | - |
| 247 | Vampire Bride | unchecked | Epic | Offense | PROC | - |
| 248 | Vanguard of the Citadel | unchecked | Rare | Defense | Critical Avoidance 1.25% | - |
| 249 | Verdant Elder | unchecked | Epic | Offense/Utility | Power 1.9% | - |
| 250 | Vicious Dire Wolf | unchecked | Epic | Utility | PROC | - |
| 251 | Vistani Wanderer | unchecked | Epic | Utility | PROC | party: Movement Speed 5.0% |
| 252 | Volcanic Galeb Duhr | unchecked | Epic | Offense | Encounter Damage 3.75% | - |
| 253 | War Boar | unchecked | Common | Offense | PROC | - |
| 254 | War Dog | unchecked | Common | Defense | Awareness 0.38%, Defense 0.38% | - |
| 255 | Water Archon | unchecked | Rare | Offense/Utility | PROC | - |
| 256 | Watler (augment) | unchecked | Rare | Utility | Deflect 2.5% | - |
| 257 | Wayward Wizard | unchecked | Uncommon | Utility | PROC | - |
| 258 | Wererat Thief | unchecked | Rare | Offense | PROC | - |
| 259 | Werewolf | unchecked | Rare | Offense | Incoming Healing 1.25%, Defense 1.25% | - |
| 260 | Wiggins the Undead Intern | unchecked | Epic | Utility | PROC | - |
| 261 | Wild Hunt Rider | unchecked | Uncommon | Offense | PROC | - |
| 262 | Will-O'-Wisp | unchecked | Epic | Defense/Offense | Critical Severity 1.88%, Awareness 1.88% | - |
| 263 | Windsoul Genasi | unchecked | Epic | Offense | Deflect 1.88%, Combat Advantage 1.88% | - |
| 264 | Wolf | unchecked | Common | Offense/Utility | Critical Severity 0.75% | - |
| 265 | Wormungandr | unchecked | Mythic | Offense | Critical Strike 3.75%, Power 3.75% | mixed: Power 2.5% |
| 266 | Wulfgar | unchecked | Epic | Offense | Accuracy 1.88%, Combat Advantage 1.88% | party: Action Point Gain 3.0% |
| 267 | Xaryxian | unchecked | Mythic | Offense | Critical Strike 4.5%, Critical Severity 3% | - |
| 268 | Xuna | unchecked | Epic | Offense | PROC | - |
| 269 | Yeth Hound | unchecked | Uncommon | Offense | Damage Vs Gyrion 2.25% | enemy |
| 270 | Yeti | unchecked | Uncommon | Offense | PROC | - |
| 271 | Yojimbo | unchecked | Mythic | Defense | Deflect 7.5% | - |
| 272 | Zariel | unchecked | Epic | Defense | Critical Strike 1.88%, Critical Severity 1.88% | enemy |
| 273 | Zariel the Redeemed | unchecked | Epic | Defense | Critical Strike 1.88%, Critical Severity 1.88% | - |
| 274 | Zhentarim Warlock | unchecked | Legendary | Offense/Utility | Combat Advantage 2.8% | - |

---

## HOW SUMMONED BONUSES GET DECIDED (n00b ruling 2026-09-11)

**Case by case. There is no numeric threshold and we are not going to invent one.**

Process, per companion:
1. Claude reads the Powers list off the archived Inspect card (or a fresh screenshot) and **surfaces every ally-affecting or enemy-affecting power**, with whatever magnitude and duration the game states.
2. n00b rules on whether it is worth recording as a buff.
3. If yes, Claude measures what is missing and records it. If no, the effect is left out of `summonedBuff` entirely and the details go in the companion's `notes` so the work survives.

**PROC CHANCE AND PROC MAGNITUDE SCALE DIFFERENTLY (Aranea, 2026-09-11).** n00b read Aranea's ladder in game: the **chance stays 5% at every rarity** while only the **magnitude** moves - 45 / 75 / 112 / 165 / 225 across Uncommon to Mythic. Do not assume a proc's chance scales just because its numbers do.

The magnitude is a flat **0.30 per item level** at every rung (the Epic 112 is the game truncating 112.5), so **Celestial is 270**. Stored as an `effectScaling` ladder with `chanceFlat: true`.

**DISPLAY THE EXACT VALUE, NOT THE GAME'S TRUNCATION (n00b ruling 2026-09-11).** The card shows Epic as **112.5** where the game prints 112. Same rule as the stat rungs: we hold and show the real number, because the game's display rounds and truncates inconsistently and its figure is the derived one, not the source. Applies to magnitudes and stat values alike.

Contrast with Abyssal Chicken, where the *chance* scales (7.5% Epic to 18% Celestial) and there is no magnitude at all. Both shapes exist; read which one before storing.

**STORE THE EXACT RUNG, NOT THE 2dp TABLE (found on Apprentice Healer, 2026-09-11).** The rarity tables in our code are themselves rounded to two decimals. The double-stat anchor is 4.50 at Celestial, so the true Common rung is **0.375**, not the 0.38 the table lists - and the game's own tooltip shows **0.37**, truncating rather than rounding. All three numbers disagree and only 0.375 derives correctly.

| stored | derives to at Celestial |
|---|---|
| 0.37 (the game's display) | 4.44 |
| 0.38 (our table) | 4.56 |
| **0.375 (exact)** | **4.50** |

**99 values across 53 powers** were 2dp roundings and are now stored exact.

**But storing exact values was only half the fix - n00b caught the other half.** The card still showed 4.44% at Celestial, because `scaleStats` derives by RATIO against the same rounded tables: `0.375 stored / 0.38 table x 4.50 = 4.44`. The tables themselves had to be exact. Fixed in **both** copies (`js/companions-page.js` and `scripts/gen-item-pages.js`):

| table | was | now |
|---|---|---|
| DOUBLE 75 | 0.38 | **0.375** |
| DOUBLE 375 | 1.88 | **1.875** |
| TRIPLE 250 | 0.83 | **0.8333** |
| TRIPLE 550 | 1.83 | **1.8333** |

The whole Apprentice Healer ladder now reads 0.38 / 0.75 / 1.25 / 1.88 / 2.75 / 3.75 / **4.5**, which is what n00b sees in game. Lesson: **a rounded lookup table is not just a display issue when it is also the denominator of a ratio.** The error scales with the gap between the base rung and Celestial, so it was worst on low-rarity companions - 0.06 points for a Common base, 0.012 for an Epic one. This supersedes the earlier "normalize to the table" fix, which was right in direction but stopped one decimal short.

**Also confirmed on this companion:** the in-game roster shows **"Companions Bolster Contribution: 0.5%"** for a Common, which independently verifies the bolster table n00b supplied.

And its Maximum Hit Points was stored as a `trigger: "Passive"` proc when the card plainly lists it as a stat - same miscategorisation shape as the Raptor powers. Moved into `stats[]`.

**KEEN EYES 9.6% IS REAL (2026-09-11).** I had flagged it as a likely misread, since every other single-stat enhancement is 9%. Card c140 shows it verbatim: "up to 9.6% ... Maximum 9.6%." It is a genuine outlier, now carrying its verbatim tooltip. **Do not "correct" it.**

**STORED BASE RARITY IS NOT RELIABLE - CHECK EVERY ONE.** Two of the twelve companions checked so far had the wrong starting rarity: Air Archon (stored Common, really Rare) and Armored Orc Wolf (stored Common, really Uncommon). Both were stored a tier or two too low, and in both cases the archive card could not catch it because the card shows an upgraded copy.

That is **2 wrong out of the 8 we could actually check** - the other 4 had cards at their base rung. The Common tier looks over-used: **24 companions are stored as Common**, and two of the three we have examined were wrong. Apprentice Healer is the only confirmed Common so far (its roster screen reads Neophyte and 0.5% bolster).

The stat VALUES survive a base change, because they derive by ratio - Armored Orc Wolf still lands on 3.75 at Mythic either way. What breaks is **which rarity buttons appear** and therefore what a player thinks they can reach. **Only n00b's in-game check settles this**, so keep asking.

The 24 stored as Common: Apprentice Healer (confirmed), Blue Fire Eye, Cambion Magus, Cold Iron Warrior, Con Artist, Crimson Crystal Golem, Damaran Shepherd, Dancing Blade, Elite Intern, Feywild Sylph, Flaming Skull, Harper Bard, Hunting Hawk, Jarlaxle Baenre, Kingfisher Intern, Mini Apparatus of Gond, Phasespider, Proud Pink Yeti, Riotous Rothe, Shieldmaiden, Soradiel, War Boar, War Dog, Wolf.

**Card-map misses keep turning up.** c140 (Aoth Fezim) and c070 (Armored Orc Wolf) were both missed by the indexing pass but named in project docs - c070 in `docs/data_trust.md`. **When a companion shows no card, grep the docs for its name before concluding none exists.** Map now at 159.

**The card map has OCR misses.** c140 was not matched to Aoth Fezim & Brightwing by the indexing pass, yet the companion's own notes named it. When a companion shows no card, check its notes for a c-number before concluding none exists. Map repaired: 158 companions mapped.

**ENGINE GAP: ONE UPTIME PER SUMMONED BUFF (found on Angel of Protection, 2026-09-11).** The own-summon path in toon-forge.html reads a single `sb.uptime` and applies it to **every** effect in a `summonedBuff`. That is fine while a companion has one effect, but Angel of Protection has two of very different shapes: Protective Ward is **always on** (+3% Defense to allies) while Ward intercepts **half of all incoming damage for 10s once every 60s** (16.7% uptime max).

They cannot share an uptime. Ward is therefore captured in `summonedBuff.cooldownEffects`, which nothing reads, rather than in `effects[]` where it would be credited at full uptime and make this the strongest defensive companion in the game. **Per-effect uptime is the fix** and it is engine work needing n00b's go. Until then the interception is invisible to the optimizer.

Also captured from card c203: Protective Ward **does not stack** with a second Angel of Protection - party-composition relevant and previously unrecorded.

**NOTES ARE FOR OPEN ITEMS ONLY (n00b ruling 2026-09-11).** A `notes` field should contain something we need to **revisit, verify or fix** - nothing else - so open work stands out instead of hiding inside provenance prose. Start them with VERIFY: or FIX:.

History does NOT belong there. Git carries provenance, and this document carries the findings; repeating "normalized 2026-07-04" or "verified by n00b" on the record itself only buries the two notes that actually need action.

Current state: **534 notes across powers and companions, and only 8 flag an open item.** 66 power notes are nothing but the 2026-07-04 normalization line.

**They cannot be bulk-cleared yet.** A power's `notes` still doubles as its card description whenever the power has no verbatim text, so wiping them would blank the description for most of the database. They get cleared companion by companion as we capture verbatim text and set `verbatimChecked` - which is exactly what the pass is already doing. Companions 1-7 are now clean, with notes surviving only on Acolyte of Kelemvor and Savage Allosaur, where something really is outstanding.

**ZONE CONDITIONALS ARE NOW STRUCTURED (n00b ruling 2026-09-11: capture the zone).** Alpha Compy's power doubles in Chult and that was only prose in its notes - the power carried no `zoneConditional` field at all. Now stored as `{zone, multiplier, note}` and the card reads **"Doubled in Chult"** instead of a generic badge. Static pages show it too (the generator ignored zone conditionals entirely).

**15 other powers still carry a bare `zoneConditional: true`** - the flag says a zone matters but not WHICH zone or by HOW MUCH, so the card can only show a generic badge. Capture zone and multiplier for each as we pass through: Hell Hound's Senses, Yeth Hound's Presence, Dragon's Bane, Eladrin's Senses, Chultan Hunter's Discipline, Vistani's Discipline, Mageslayer's Assault, Vallenhas' Discipline, Siege Master's Discipline, Wiggin's Wisdom, Stronghold Cleric's Wisdom, Skyblazer's Sight, Dark Dealings, Sense Through the Shadowfell, Fire Eye's Insight.

**Not scored by the optimizer.** Structuring the data does not make the engine use it; a Chult build still sees half the real value of these powers. Wiring that is engine work and needs n00b's go.

**RENAMES NEED AN ALIAS MAP, AND COMPANIONS DO NOT HAVE ONE.** Saved and shared builds store companions by NAME, so a rename silently blanks the slot. Toon Forge already solves this for gear - `GEAR_NAME_ALIASES` in toon-forge.html rewrites old names on load and toasts the player - but **nothing equivalent exists for companions or mounts**. Three renames have already happened with no alias: Raptor -> Tamed Velociraptor, Olive the Octopus -> Ollie the Octie, and now Allosaurus -> Savage Allosaur. A 274-companion audit will produce more.

Interim: `formerNames` is now recorded on the companion entries themselves (Savage Allosaur, Tamed Velociraptor). **Wiring an alias map into build loading is engine work and needs n00b's go** - the gear version is the pattern to copy.

**ROUNDED TOOLTIP VALUES NORMALIZED (2026-09-11).** The game displays rounded stat figures and several were stored as displayed. Left alone they derive wrong upward, because the ladder multiplies: 1.9% at Epic becomes 4.56% at Celestial instead of 4.50%. Nine values across seven powers fixed - Iron Golem's Presence, Hunting Drake's Presence, Rimefire Golem's Presence, Allosaurus's Instincts, Cave Bear's Instincts, Owl's Instincts and Etrien's Exuberance (three stats, the worst at 0.12 points over). This continues the same normalization the project ran on 2026-07-04.

**A HEAL IS NOT A BUFF (n00b ruling 2026-09-11).** Healing an ally does not get recorded as a summoned bonus, whatever its size. First application: Alchemist Experimenter's Rejuvenating Potion (5% of an ally's life). Existing entries checked against this - none are heal-only:
- **Minsc** records Incoming Healing, which is a stat buff (it raises healing received), not a heal. Stays.
- **Encore the Virtuoso** records the Outgoing Healing / Power / Critical Severity buff from Mending Melody; the heal itself was never recorded as an effect. Stays.
- **Deva Champion** records "+5% of max HP as shield" with **no stat effects at all** - it is a shield, not a stat buff, and closer to a heal than to anything else on the tab. **Flagged for n00b** - probably should come off by the same rule.

**Why no formula.** Usefulness is not only magnitude x uptime. Some buffs matter because a group will *let you bring that companion* on the strength of it, and some large-looking effects are irrelevant in practice. That judgement is n00b's and it is not reducible to a number.

First application: **Acolyte of Kelemvor** — Kelemvor's Sword (+1 point Critical Avoidance, 8s) and Blessings of Kelemvor (10% damage reduction, 3s) both ruled not worth recording.

### 43 is a FLOOR, not the candidate pool

43 is how many we have **recorded**, not how many exist. Acolyte of Kelemvor itself had none recorded until this session, and Encore the Virtuoso, Wormungandr and Sir Waddlelot were all added today. Scanning the skills text of companions that currently have no `summonedBuff`:

| | Count |
|---|---|
| Recorded summoned buff today | 43 |
| No entry, but skills text mentions allies / party / "grants you" / shield | **19** |
| No entry and **no skills text at all**, so unknowable from data | **50** |

So the real pool is at least 62 and possibly over 100. The 50 with no skills text are the blind spot — those need their Inspect panel read before we can say anything. The 19 named candidates include obvious ones like Battlefield Medic ("Aid All"), Stronghold's Cleric ("Aid and Protect") and Linu La'neral ("Lunar Light").

**Practical consequence:** testing usability only on the 43 as we pass them would miss the rest. The per-companion check already reads the Powers list off the Inspect card, which is where an unrecorded buff shows up, so this is covered as long as we keep doing that for every companion rather than only for the ones already flagged.
