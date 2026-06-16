# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

(Last published June 13, 2026: "503 Fighter Items, Honest Conditional Bonuses & the Big Audit Closes")

## Week of 2026-06-13 (since last publish)

### Features
- Toon Forge: the Race and Paragon Path selectors are now clean searchable pickers (same style as gear/companions) instead of cluttered dropdowns. Each race shows its name with its ability bonuses on a tidy second line; each paragon path shows its role and the stats its Forte boosts. Both let you type to filter.
- Toon Forge: the Class Features and Bard Active Song selectors now use the same searchable picker, so you can read each option's description (and a song's stat bonus) before you pick — matching the At-Will / Encounter / Daily slots right beside them.
- Toon Forge: the damage sim's Content zone selector is now the same searchable picker, so every selector in the build flow is consistent.

### Data Additions
- Toon Forge: 37 endgame gear equip bonuses (e.g. Daily's Gift, Deity's Gift, Dashing Ranger, Sharpened Instincts, Critical Daily, Battleforged Might) that previously showed only as text now feed the stat engine and optimizer — so the builder and auto-optimizer can actually "see" and value them.
- Gear equip bonuses now read in full, too. The same "shorthand" problem that hit set bonuses also hit each item's own **Equip:** line — many showed only a bare "+X% Stat" instead of the real effect (conditions, stacking, procs). **514 items** across every gear tier — endgame armor, weapons, clothing, and the whole accessory range (rings, necklaces, amulets), all the way down through the low-level leveling sets — now carry their complete, in-game-verified Equip bonus text, feeding both the builder display and the stat engine. (Most older low-level gear simply has no Equip bonus — that's correct, not missing — so those are now catalogued and no longer flagged as gaps.)
- Gear set bonuses now read in full. Many items were showing only a short stat line (like "+12% Movement Speed") for their set bonus, which hid the real effect — role splits, stacking, conditions. Every piece of 82 sets now shows the complete set-bonus text (including Chilling Flow, the Frost-Riven "Freezing" sets, Soulpiercer, and The Dark Maiden), and 9 more were transcribed straight from in-game tooltips (Executioner's Bloodthirst, Ghastly Eruption, Crimson Retaliation, Malignant Energy, and the Shadesinger / Manaseeker / Headsman weapon sets). A follow-up screenshot sweep then verified and wrote **36 more sets** directly from in-game tooltips — Dark Matter, Skyhold Arms, Peer Into the Void, Celestial, Blessed Blade, Dusk, the Drowned/Earthen/Howling Heart sets, Aboleth, Tyrant, Mirage, and more — and corrected a few wrong values along the way (Drowcraft's 3-piece bonus, Dragonflight's high-tier Power, a Vistani stat). **Over 130 sets** now show their complete bonus text; the rest are tracked for capture.

### Bug Fixes
- Toon Forge: the build summary now correctly reads "Active companions: X / 5" (was "/ 4").
- Toon Forge: fixed several bits of muted helper text (including the DPS note under the damage sim) that were using an undefined color and rendering in the wrong shade.
- Harness of the Flayed Legion was only showing for Barbarians — it's now available to every class, including Paladins (Report #113).
- Mark of the Adept (Challenger's Forte) was listed as a Shirt but is actually the Pants. Fixed, so the Enchanted Forte set now completes correctly (Report #114).
- Companions: the "Baby Polar Bear" is now correctly named **Polar Bear Cub**, and its starting rarity was fixed (it was stored as Mythic-only) — so its power now shows correct values at Epic and Legendary too, not just Mythic.
- Companions: **Quickling's Wisdom** now shows the correct **+3.8% Critical Strike** (was wrongly listed as 1.8%).
- Companions: **Deva Champion's Insight** now shows the correct **+1.3% / +1.3%** (was wrongly listed as 1.5%). All three were verified against in-game screenshots by the new data-checking team.
- Companions: **Cyclops War Drummer** was showing a *different pet's* power (the Crimson Crystal Golem's). It now correctly shows its own — **War Drummer's Discipline** (+4.5% Incoming Healing, +18,000 Max HP). And an invalid rating value was fixed on War Boar, Hunting Hawk, Wardog, and Air Archon companion powers.
- Companions: three more pets that were showing the *wrong* companion's power now show their own — **Stalwart Golden Lion** (Celestial Lion's Presence), **Portobello DaVinci** (Dungeon Master's Wisdom), and **Dread Warrior** (Dreadwarrior's Insight). Wolf, Damaran Shepherd, Linu La'neral, Vampire Bride and Blue Fire Eye were all double-checked against in-game screenshots and confirmed correct.
- Companions: **Baby Boar** now shows the correct stats — **Deflect + Critical Severity** (it was wrongly listing Maximum Hit Points). **Cyclops War Drummer**'s power now scales correctly from its true Epic starting rarity (so Epic/Legendary owners see right values). And a typo in **Mage Slayer**'s power was fixed ("Gyrion" → "Cyrion").
- Companions: **Mercenary** was showing Demonic Servant's power; it now correctly shows its own — **Mercenary's Discipline** (+4.5% Power, +4.5% Combat Advantage). **Cold Iron Warrior**'s missing Combined Rating was fixed too. And Apprentice Healer, Demonic Servant, Coldlight Walker, and Cantankerous Mage were all double-checked and confirmed correct.
- Companions: **Archmage's Apprentice** (renamed **Halfling Wayward Wizard** in-game) now shows its real power, **Wayward Wisdom** (a slow proc), instead of an unrelated pet's. This also corrected the regular **Wayward Wizard**, which shares the same power — both had fabricated stats before.
