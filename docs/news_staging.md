# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

## Week of 2026-05-29

### Features
- Toon Forge: added an **"+ Add Missing Enchantment"** button to the enchantment pickers (Offense / Defense / Utility / Combat / Bonus), matching the existing "Add Missing Item" flow for gear. If your enchantment isn't in our list, you can add it yourself — it shows up in your build right away and computes its stats, and a report is filed so we can add it site-wide for everyone. The form adapts to the slot: Universal enchants capture per-slot stats (Offense/Defense/Utility), while Combat/Bonus enchants capture rating + percent stats and an optional effect description. Approved or declined submissions are tracked in "My Contributions" and auto-cleaned up once we review them.

### Bug Fixes
- Gear: fixed Bulwark of the Eternal Zulkirate (Eternal Dominion Armor) so its Ruthless Might (Greater) buff now applies in the builder. The 1.5% Critical Strike and Critical Severity per stack (up to 7.5% each at 5 stacks) was stored as text only, so the stat engine never counted it. It now contributes correctly as a conditional in-combat buff.
- Mounts: fixed insignia-bonus matching for 4-slot mounts. The old logic only ever looked at the first 3 slots, which both hid valid bonuses and showed invalid ones. The matcher now follows the real rule: a mount's fixed (non-universal) slots are mandatory, so every bonus it forms must use them, while universal slots are optional fill. This means a mount with 4 locked slots can only form 4-insignia bonuses, and a mount with universal slots correctly lists exactly the bonuses it can actually build. Affects all 51 four-slot mounts.

### Data Additions
- Mounts: corrected Snowtusk's insignia slots to Regal / Illuminated / Universal / Universal (4th slot prefers Enlightened), verified in-game. Slots 3-4 were previously mis-recorded as locked Enlightened. Snowtusk now correctly lists exactly its 5 three-insignia bonuses (Gladiator's Guile, Shepherd's Devotion, Wanderer's Fortune, Alchemist's Invigoration, Combatant's Maneuver) plus 7 four-insignia bonuses.
