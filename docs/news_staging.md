# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

## Week of July 5, 2026

(Last published July 6, 2026: "Report Day: 18 Community Reports Closed + Artifact Ranks + a Remove Button")

### Data Additions
- Bard: added the missing Songblade at-will **Staccato** to the Toon Forge power list (multi-hit melee, physical). Magnitude/cast/hit-count pending in-game tooltip verification.
- Bard: the Main Hand **artifact modification** menu is now in Toon Forge — all six Enhanced-power mods (Reprise, Fleche, Con Elemento, Staccato, Phantasmal Concerto +10% damage; Arpeggio +10% healing). Provided by n00b.

### Bug Fixes
- Healer builds: the "What would this heal for?" panel now credits master boons that heal for a % of Max HP (Blessed Advantage's HoT, Death's Bulwark's temp HP) — they previously counted for nothing. "Chance on kill" boons are now weighted realistically for healers, who rarely land killing blows. (Engine-side; also drives major healer pick improvements in the optimizer — optimizer notes tracked privately with n00b.)
- Gauntlets of the Wrathborn: Toon Forge now credits the tooltip's "+4% Combat Advantage" rider — equipping them previously moved Accuracy but never Combat Advantage. (Reported by n00b in-session.)
- Toon Forge: Vengeful Blades no longer shows in the General section for every class — it's a Warlock-only skill (unlocked at level 10) and now appears on Warlocks only. It had been mis-filed as a universal account skill. (Caught by n00b on his Bard.)
- Bard Impending Doom weapons (Dirgeblade + Strings of the Forsaken): all six ranks now group into ONE card with a rank dropdown in the gear picker (like the Warlock pair) instead of separate cards per rank. While merging them we re-verified every rank against collection screenshots and fixed wrong stats on four Dirgeblade ranks (values had slipped one rank down), added the missing +50/+100/+200 Damage lines on Legendary/Mythic/Celestial, and fixed the rank-1 set bonus: at IL 3400 the pair is the "Whisper of Power" set (+5,200 Power) and only upgrades to Impending Doom from IL 3750 up. Old share links with the per-rank names migrate automatically and keep their rank. (Caught by n00b on his Bard.)
- Siege Master: its "Increases At-Will power by 3.8%" passive was mis-entered as a +3.8% Power stat grant (~13.5% at Celestial rarity), silently inflating any build that slotted it — most visibly healer builds, where the optimizer recommended it purely for phantom Power. Corrected to the at-will damage channel (unmodeled until the damage-output layer exists). (Caught by n00b asking why a healer would need Siege Master.)
- Gear cards: weapons with a bonus Damage line (e.g. Dirgeblade at Legendary+, Omen of Doom) now show it on the card — the value was stored but never displayed. Combined Rating now shows next to the rarity label on artifact-weapon cards instead of being hidden by it. Also removed a phantom "+0.5/1/2% Damage Bonus" line on three Dirgeblade ranks that no in-game tooltip has. (Reported by n00b.)
