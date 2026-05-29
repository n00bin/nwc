# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

## Week of 2026-05-29

### Features
- **Companions — Summoned Buffs tab now shows all buff scopes.** Previously only party-wide buffs appeared; enemy debuffs (like Black Scorpion's Combat Advantage grant), self buffs, and mixed buffs were hidden. Each entry now carries a color-coded scope tag (Party / Self / Enemy Debuff / Mixed).
- **Toon Forge — Party Buffs section now models ally summoned companions of every scope.** Combat-Advantage-granting allies (Black Scorpion, Yeth Hound, Panther, etc.) raise your effective CA uptime in the damage sim; enemy "takes more damage" debuffs (Spined Devil, Succubus, Rattigan, Zariel) boost your simulated damage (Spined Devil and Succubus correctly don't stack). Self buffs and enemy stat debuffs are shown for reference. All 40 summoned-buff companions are now selectable.

### Bug Fixes
- Black Scorpion (and 17 other companions) were missing from the Summoned Buffs list and the Toon Forge Party Buffs picker.
- Enchantments: Celestial Jade's defense stat was wrong — it listed Deflect Severity but the enchant actually gives Critical Avoidance (2,700 at Celestial). Corrected, so Jade now shows Critical Strike / Critical Avoidance / Outgoing Healing. (Reports #71, #72)
