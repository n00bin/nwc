# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

## Week of 2026-05-23

### Data Additions
- **Gear database expanded by 376 items.** Major intake pass covering bard, warlock (current + legacy), and rogue gear from screenshot batches. New additions include:
  - **Bard:** Strings of the Forsaken (IL 3,400/4,100/4,800), Bismuth Lute, Bloodbrass Lute, Solarium and Xaryxian Rapier variants, full Howling/Earthen/Burning/Drowned Bard artifact sets, Woote Jambiya and Lute variants (IL 350–800), Shadesinger's Rapier and Lute (IL 350–800).
  - **Warlock:** Curseford's Raid + Assault 8-piece armor set (IL 770), Codex of Eternal Chains at IL 3,400 / 3,750 / 4,100 (previously only had IL 4,800), Bronzewood Quauhololli/Tlahuitolli weapon set, Mirage / Fey / Lifeforged / Aboleth / Hexweaver Pact Blade and Grimoire variants, Dusk Raid + Assault armor at IL 1,375.
  - **Rogue:** Lionsmane Stronghold armor (Duelist + Executioner sets), Trapper of the Twilight / Stealer of the Star / Mugger of the Maze 3-set armor at IL 3,000, Nightspiercer Dagger of the Thayan Zealot, Loithian set (Circlet/Leathers/Sleeves/Poulaines), Primal Omihuiclli weapon variants.
  - **High-end:** Coldsilver Jotunskar rings (IL 5,700, all 7 variants), Celestial Bow of Dignity and Celestial Steel of Grace (IL 650–1,400), Manticore Raid/Duelist gear.
  - **Low-IL variants:** Hammerstone full set at IL 152, Elk Tribe Noble's weapons at IL 199 — so early-game characters in Toon Forge can find appropriate gear.

### Toon Forge / Optimizer Fixes
- **~960 items now contribute their stats correctly to the optimizer.** A long-running issue caused hundreds of items to have their stats silently dropped from optimization because the engine didn't recognize the stat name format. Fixed:
  - 708 items with "Deflection" — now recognized as the canonical "Deflect"
  - 72 items with "Control Resistance" — now recognized as "Control Resist"
  - 164 items had Combined Rating misplaced in the wrong field — now correctly counted
  - **Tank, Deflect-stacking, and Control-resistance builds will see different (correct) optimization results.**
- **Solar Band and Lunar Knot — double stat values now apply.** These rings each show two stacking sources of the same stat in their tooltip, but only half the value was being counted. Now correctly summed: Solar Band shows Deflect 6,000 (was 4,500); Lunar Knot shows Critical Severity 6,600 (was 4,950).
- **Item stat corrections — fixed misread stats on several items:**
  - Ring of Orcus +1 through +5: stat is Forte (was incorrectly stored as "Force")
  - Vestments of the Crimson Magister: stat split fixed to Combat Advantage + Control Bonus + Control Resist
  - Vistani Raiments: stats fixed to Critical Strike + Combat Advantage
  - Elemental Drowcraft Raid Wristguards: stats fixed to Accuracy + Combat Advantage + Defense
  - 5 Bard weapons (Woote Jambiya/Lute, Twisted Makhira): missing third stat identified as Critical Strike
  - 6 Dominion tank pieces: "Combat Resistance" corrected to "Control Resist"

### Bug Fixes
- **Item name corrections (35 fixes).** Repaired misspellings introduced during data entry:
  - Loithian → Lolthian (drow goddess set, 14 items)
  - Cuises → Cuisses (NW thigh armor, 9 items)
  - Crystallex → Crystalflex (2 items)
  - Glaves → Greaves, Bronerwood → Bronzewood, Chinibii → Chinibili, Omibuitsili → Omihuiclli, Tecpail → Tecpatl, Preaches → Breeches, and others
  - Veinlit set: three OCR variants (Veistil, Veiniti, Velnnti) consolidated to the correct spelling
- **Duplicate gear entries removed (83 items).** Some gear items had been entered twice from separate screenshot sessions. The less-complete copy was removed; the more-complete version (with set bonus info and class restrictions) is kept.
- **Enchant stat names normalized (21 universal enchants, 70 stat entries).** The universal enchant slots stored stat names in a mix of camelCase (CriticalStrike) and Title Case (Critical Strike); now consistently use Title Case across all 40 enchants, matching gear and other data.
- **Notes panels no longer show developer audit trails.** Mount and companion detail panels were leaking internal calibration notes (e.g., "Stored at Mythic-125%-bolster baseline (3000). Re-verified 2026-05-20 by n00b...") into the user-visible Notes section. These sentences are now stripped from display; real game-info text (proc effects, magnitudes, slot info) still shows.

## Week of 2026-05-22

### Bug Fixes
- **Mounts — Insignia slots fixed for 5 mounts:** Ornate Apparatus of Gond, Red-Hued Apparatus of Gond, Carmine Bulette, Sienna Tribal Lion, and Blueforged Rage Drake were showing no valid insignia types in the slot calculator. Their universal slots are now correctly recognized and the insignia calculator works for them.
- **Gear — Corrupted text fixed in 3 item descriptions:** Two Pact Blade items (Durgarrn Thord Pactblade and Earthen Pact Blade) had a garbled arrow symbol (`→`) in their description text where a real arrow should appear. Fixed.
- **Companions — "Rothé" name display fixed:** The companion named Rothé had a double-encoded special character in its name, causing it to appear garbled in some browsers. The name now displays correctly.
- **Reports — Admin status change now refreshes the list immediately:** Previously, after an admin changed a report's status, the page had to be manually reloaded to see the update. The list now refreshes automatically.
- **Reports — Shadow variable bug fixed in sort logic:** An internal variable naming conflict in the reports sort code could silently break the Supabase connection under certain conditions. Fixed.
- **Reports — Reply section now shows a clear waiting message:** When a report hasn't been reviewed by an admin yet, the replies area now shows "Replies open once an admin has reviewed this report." instead of being blank, so players know it's not a glitch.
- **Insignia Tracker — Nav no longer highlights the wrong page:** The Insignia Tracker page was incorrectly highlighting "Creators & Tools" in the navigation bar. The nav bar now shows no active highlight when on that page.
- **Stat names — All stat names now display in plain English:** Throughout the site, internal stat names like "CriticalStrike" and "MaximumHitPoints" now display as "Critical Strike" and "Maximum Hit Points" wherever stats are shown (companion powers, mount powers, gear bonuses, etc.).
