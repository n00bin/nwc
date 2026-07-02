# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

(Last published June 23, 2026: "Providence & Cavalry Mount Fixes, Group-Stacking Toggles & Add-Missing Collar")

## Week of 2026-06-23 (since last publish)

### Features
- **Toon Forge — "Assume support party" toggle.** New switch in the Party Buffs
  section makes your build account for the support companions your allies bring
  (Tutor, Flapjack, Portobello DaVinci, etc.). Off by default — matches the
  Part-of-the-Pack and Providence group toggles. A **Fill standard set** button
  loads the common support trio in one click, all editable, and you can slot any
  party-buff companion you like. When off, the ally slots are dimmed and
  contribute nothing.
- **Mounts — combat powers now shown at Celestial (max tier) with a Mythic toggle.**
  Mount combat-power values now display at **Celestial** by default — what an endgame
  account actually sees — with a **Mythic ⇄ Celestial** toggle on each mount's detail.
  Previously the page showed a fixed lower-tier number that never matched the game.
- **Enchantments — pick the tier you own.** Every enchantment is stored at its top
  rank (Celestial); the enchantment picker now has a **"Tier you own"** dropdown
  (Uncommon → Celestial). Set it to your rank and the name, item level, and stat
  values all update to match — e.g. **Mythic Citrine**, **Mythic Companion**. Picking
  an enchant adds it at that tier, and the quick dropdown on each slot stays in sync.
  Works for both character and companion enchantments. (Reports #164 & #165.)

### Bug Fixes
- **Toon Forge — Master boons split into their two real rank models (and the
  boon point cap is 132).** Master campaign boons come in two kinds in game,
  and the tool previously treated them all the same way. **Progressive**
  masters (Deathly Rage, Death's Bulwark, Focused Retaliation) unlock one
  effect per rank — rank 1: +2% Combat Advantage, rank 2: adds +2% Power,
  rank 3: adds +2% Critical Severity — but were counted as if every effect
  multiplied by every rank (+6%/+6%/+6% at rank 3), up to a 3× over-value.
  **Stacking** masters (Blood Lust, Life Lessons, Enhanced Application,
  Blessed Advantage, Blessed Resilience) really do grow all of their effects
  with every rank, and still work that way. The boons panel now shows each
  master the right way ("R2: +2% Power" vs "+2% Power/rank"), the engine
  scores both models correctly, and the optimizer prices master ranks
  honestly. The total boon-point budget also moved from 130 to **132**,
  matching the current campaign list — so builds with all campaigns done no
  longer show as over the cap.
- **Toon Forge — campaign boons: over-cap warning + smarter optimizer handling.**
  The boons panel now flags in red when you've allocated more points than the
  maximum we have on record (130), instead of silently accepting any number —
  if a new campaign raised the in-game cap, report it and we'll update the data.
  Behind the scenes the build optimizer also stopped two bad boon habits: it no
  longer trims points off builds that have more than the recorded cap (your
  points are never removed), and the ~100 "filler" points it spends climbing to
  the Master tier now go into stats that fit your role — a healer gets Max HP
  and healing stats instead of leftovers like Gold Gain or single-enemy-family
  boons.
- **Toon Forge — healer math now matches the game's own Overall Outgoing Healing rule.**
  The in-game tooltip defines the Overall Outgoing Healing boost as your Outgoing
  Healing stat **plus** any other healing modifiers — one combined bonus (e.g.
  105.3% + 6% = +111.3%, verified against an in-game Oathkeeper panel). The heal
  simulator was applying them as two separate multipliers instead, which slightly
  inflated per-cast heals and made the optimizer over-value "Overall Outgoing
  Healing" gear/set bonuses (they looked ~2× as good as they really are at
  endgame). Healing now uses the game's additive rule, so healer optimizer picks
  shift a little toward Power and Critical Severity — matching what actually
  heals harder in game.
- **Stable Planner — mounts with preferred slots are now recommended first.**
  The planner's help text always promised that ★ mounts (preferred slot filled
  with its preferred type = +20% item level & stats on that insignia) are listed
  first — but two different sorting rules could bury them. For every 3-insignia
  bonus, plain 3-slot mounts outranked the ★ mounts, so the ★ pick never
  appeared (e.g. **Gladiator's Guile** now recommends **Snowtusk ★** instead of
  a starless 3-slot mount). And when a mount was already recommended for a
  bonus in another loadout, "reuse that mount" outranked ★ too — e.g. with
  bonuses in two loadouts, **Tactician's Precision** recommended a starless
  Bestial Fire Archon over **Snowtusk ★**. Preferred-slot mounts now genuinely
  come first; reusing a mount across loadouts only breaks ties between equally
  starred picks. Also, if the only mount that can activate a bonus's preferred
  slot is one you've excluded, the plan now says so — instead of silently
  recommending a lesser pick — and hovering the ★ explains what it means.
  All **6 upgrade ranks** (IL 3,400–5,250) are now in the database for **both** the main
  hand and off hand, with accurate set bonuses. The always-on bonus is a flat **+7,700
  Critical Severity** at the lowest ranks and converts to **percentages** higher up (up to
  **+9% Critical Severity / +5% Power**), and the Unleashed charge bonus scales **+3% → +5%
  Base Damage Boost**. The full Unleashed charge mechanic is now shown, and the item tier
  (Artifact Equipment) — which was blank — is fixed. (Report #166.)
- **Jotunskar Paladin gear — translated a German report, added a missing pants + fixed a slot.**
  A player reported two pieces in German. Translated and resolved: added the missing
  **Veinlit Lifebraid Vestment** (pants — *Charged Rejuvenation*: +4.5% Recharge Speed
  when healed in combat), and corrected **Runemarked Dawnshard Raiment** from pants to
  **shirt**. (The third, "Veinlit Dawnshard Raiment," was already in the database as the
  pants.) Reports #162 & #163.
- **Toon Forge — optimizer no longer always picks Tiefling.** A racial trait that
  only works part of the time (Tiefling's **Bloodhunt**, *+5% damage to targets
  below 50% HP*) was being counted as if it were on for the whole fight. That made
  Tiefling look like a permanent +5% damage no other race could match, so the
  optimizer chose it every time. Racial traits with a condition now use the same
  uptime model gear already uses — Bloodhunt now counts as its real execute-window
  value (~0.75%), so race is judged on its actual benefit. (Aasimar's party-aura
  trait is likewise weighted; always-on racials are unchanged.)
- **Cracked Dawnshard Raiment — fixed wrong stat & equip bonus (healer pants).**
  This Jotunskar item-level 4,600 piece was showing a DPS profile by mistake
  (Action Point Gain + an "Occult Advantage" +9% Critical Severity / −5% Defense
  bonus). The real item is a **healer** piece — corrected to **1.5% Stamina
  Regeneration** and a single **Rested Healing** bonus (*when your Stamina is over
  75%, your Outgoing Healing is increased by 7.5%*). Verified against an in-game
  screenshot. (Reports #155–#159.)
- **Mount combat-power values were stuck at lower rarities.** Six mounts had their
  combat-power numbers captured at a lower tier (Dragonbone Golem, Frost Salamander,
  Legendary Giant Toad, Legendary Carpet of Flying, Cosmos Stag, Radiant Rune Board)
  and now scale correctly. **Ethereal Vortex** (Twice-Pale Alder) now reads **20.7%**
  at Celestial instead of 16%. Verified against in-game screenshots. (Reports #160 & #161.)
- **Detector's set (Unstable Drive) was double-counted.** The Detector's Choker
  listed its "Unstable Scan" bonus twice in the data, so the engine applied
  **14% Combat Advantage / Forte / Outgoing Healing instead of 7%**. Removed the
  duplicate so the set now shows its true value. (This was also making the build
  optimizer over-favor the set.)
- **Removed a duplicate companion.** "Golden Bulette" and "Golden Bulette Pup"
  were the same companion entered twice (once at Mythic 7.5% Outgoing Healing,
  once at Celestial 9%). Merged into **Golden Bulette Pup** — choose Celestial
  rarity for the 9% value.
- **Bard weapons — Celestial Dirgeblade added + Impending Doom set fixed.** Added
  the missing item-level 5,250 (Celestial) Dirgeblade, and corrected the Impending
  Doom 2-piece set bonus on the Bard weapons (Dirgeblade + Strings of the Forsaken):
  now **+5% Power and +7.5% Critical Strike** (was 2.5% Power / wrong crit stat).
  Also fixed the item-level 3,400 Strings, which was mislabeled — at that tier the
  set is **Whisper of Power**, not Impending Doom. (Report #151.)
- **Impending Doom weapon sets — fixed per class (were all identical).** Every
  class's Mod 27 weapon set had the same wrong bonus stamped on it. Re-read each
  from in-game screenshots: each class now has its **own** correct set bonus —
  e.g. **Ranger** = Crit Strike + Accuracy, **Barbarian/Fighter** = Power +
  (Crit Severity / Combat Advantage) with a Tank mitigation, **Paladin** = Forte
  + Defense (Tank/Heal), **Bard/Warlock** add a Heal bonus, **Rogue** = Accuracy
  + Power. 8 of 9 classes done (89 weapon entries); only Cleric is left, pending
  its captures.
