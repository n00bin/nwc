# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

(Empty — last published June 4, 2026: "Massive Gear Audit, 1,300+ Bonuses Now Count & Pack Meta Toggle")

## Week of 2026-06-04 (since last publish)

### Features
- **Toon Forge — companion damage procs now count.** Companions whose real value is a damage proc (Xuna's poison, Black Scorpion's sting, Hank the Ranger's bleed, Elminster's lightning, Spined Devil's spines, and ~17 more) used to contribute nothing to the damage estimate — their procs were tooltip text only. The damage sim now models them properly: proc chance × how often the trigger happens in a real rotation (crit-based procs even scale with your actual crit chance) × the proc's magnitude at your companion's rarity. The damage readout shows the bonus and which companions provide it, and the numbers line up with community testing (a Mythic+ Xuna adds ~14%). Companion choices in the sim — and the upcoming optimizer — just got a lot more honest.
- **Toon Forge — gear damage procs now count too.** Same treatment as the companion procs: gear bonuses like Critical Force (175 magnitude on crit), Daily Burst, Explosive Force and Summon Myconid now feed the damage estimate at their real cadence (chance × trigger rate, respecting internal cooldowns). Magnitude-based procs scale with your build; flat-damage procs are counted at face value — which correctly shows them fading at endgame.
