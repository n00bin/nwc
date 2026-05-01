# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

## Week of 2026-04-28

### Features
- Added per-rarity proc-chance scaling to companion powers (new `chanceScaling` field) — Chance line on the detail panel now updates with the selected rarity

### Bug Fixes
- Fixed Blue Fire Eye: power was incorrectly showing Movement Speed, corrected to damage versus Kabal's minions with full rarity scaling (Report #22)
- Fixed Abyssal Guidance: chance to summon Abyssal Chicken now scales with rarity (1.50%/3.00%/5.00%/7.50%/11.00%/15.00%/18.00%) instead of a flat 2.5%

## Week of 2026-03-25

### Features
- Added admin delete button for reports
- Added artifact icons for all artifacts (92+ from wiki, 4 from PS5 screenshots)
- Added consumable icons (50+) with list and detail display
- Added companion enhancement icons (all 28)
- Added companion icons (all 264 companions now have icons from PS5 screenshots)
- Added companion rarity scaling system (Common through Celestial)
- Added rarity selector buttons on companion detail panel
- Reports page: Active/Resolved split with collapsible resolved section
- Reports page: In Progress reports sort to top
- Reports page: Resolved reports can no longer be upvoted
- Mounts page: Alphabetical sorting
- Mounts page: 4-Slot Only filter checkbox
- Artifacts page: Icons in All Artifacts list view headers
- YouTube and N00bin Network links added to nav, landing page, and footer
- Disabled homepage popup

### Data Additions
- 4 new Mod 26 artifacts: Demon Skull, Nightflame Censer, Marilith Mask, Xeleth's Blast Scepter
- 9 new foods: 7 Menzoberranzan vendor foods + Fried Spring Rolls + Pho
- New companion: Demonic Servant (Menzoberranzan campaign booster)
- New companion: Little White (Phasespider's Instincts)
- New mount: Balgora (Hell's Impact + Seeing Red)
- 177 companion sources filled in
- All companion power data filled in (83 Offense/Defense + 24 Utility)
- Campaign boosters page expanded with 8+ new companions and Gravity Orb gadget
- Removed WIP banner from campaign boosters page

### Bug Fixes
- Fixed insignia bonus matching: 3-slot bonuses now only check first 3 mount slots (report #13)
- Removed Vision of Lolth from artifacts (it's a mount combat power)
- Removed duplicate Fire Eye companion (was Blue Fire Eye)
- Fixed Phasespider power assignment (was using Little White's power)
- Fixed multiple companion names: Wailer->Watler, Portalerhound->Portalhound, Undying Overbound->Undying Overlord
- Fixed Celeste power: was Divine Answers, now Celeste's Wisdom
- Fixed Apprentice Healer: IL 75->150, added Max HP stat
- Fixed multiple mount preferred insignia slots: Maltese Tiger, Demonic Gravehound, Red Mountain Fox, Space Guppy School, Brain Stealer Dragon, Phantom Panther, Golden Rage Drake, Protective Pink Yeti
- Fixed Golden Goose: slots, combat power, and equip power all corrected
