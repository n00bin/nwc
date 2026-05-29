# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

## Week of 2026-05-29

### Bug Fixes
- Mounts: fixed insignia-bonus matching for 4-slot mounts. The old logic only ever looked at the first 3 slots, which both hid valid bonuses and showed invalid ones. The matcher now follows the real rule: a mount's fixed (non-universal) slots are mandatory, so every bonus it forms must use them, while universal slots are optional fill. This means a mount with 4 locked slots can only form 4-insignia bonuses, and a mount with universal slots correctly lists exactly the bonuses it can actually build. Affects all 51 four-slot mounts.

### Data Additions
- Mounts: corrected Snowtusk's insignia slots to Regal / Illuminated / Universal / Universal (4th slot prefers Enlightened), verified in-game. Slots 3-4 were previously mis-recorded as locked Enlightened. Snowtusk now correctly lists exactly its 5 three-insignia bonuses (Gladiator's Guile, Shepherd's Devotion, Wanderer's Fortune, Alchemist's Invigoration, Combatant's Maneuver) plus 7 four-insignia bonuses.
