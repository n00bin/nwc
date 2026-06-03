# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

## Week of 2026-05-30

### Features
- **Stable Planner — "What can I build with my insignias?"** Each loadout now has its own **My insignias** counts (just 5 numbers — Crescent / Barbed / Illuminated / Enlightened / Regal), so you can plan loadouts that use different insignia sets. Fill them in, then click **"What can I build with my insignias?"** on that loadout to see which of its bonuses you can run at the same time with no insignia doing double duty, plus exactly how many more of each type you're short for the rest. No more sorting your insignia pile by hand. Saves in your browser with the rest of your loadouts.
- **Chain of Scales belt — upgrade-level picker.** The Chain of Scales (Belt Item) is now one entry with a dropdown for its 7 upgrade levels; pick your level and the Awareness value updates (1.2% base → 3% Empowered). On the Consumables page.
- **Toon Forge — "Clear all" button.** A new **🗑️ Clear all** button (next to Share link) resets every field back to a blank build in one click, so you can start fresh without hunting through each section. It asks for confirmation first, and your saved builds in **My Builds** are kept safe.
- **Toon Forge — "Add Missing" is now everywhere.** The "Add Missing" flow (add it yourself, it slots into your build immediately, files a report, and is tracked in My Contributions) now covers **Overloads, Insignias, Buffs, Guild Boons, Artifacts, Companions, and Mounts** — not just gear and enchantments. If anything's missing from a picker, you can add it on the spot. (Companions capture the companion + its active power; Mounts capture the insignia-slot layout.)

### Data Additions
- **Mount icons overhauled.** The whole Mounts page now uses consistent, high-quality artwork from the Official Neverwinter Wiki. 103 previously-missing icons were added and the entire set was standardized (207 mounts now wiki-sourced; coverage 255/279). The remaining 24 mounts have no wiki icon available — they're listed in `docs/mount_icons_missing.md` and need in-game captures.
- **Companion icons completed and tidied.** Every companion (264/264) now has an icon. Added the missing **Festive Tiger** and fixed **Rothé**, whose icon wasn't showing due to a character-encoding bug in its name. Also sharpened 18 low-res companion icons. The existing companion art was already high quality, so the rest was left untouched.
- **543 new gear pieces** added from a big in-game screenshot batch (read via the OCR/vision review pipeline, transcribe-only). Mostly Barbarian and all-class armor/weapon sets — Aboleth artifact weapons, Adamant (Assault/Duelist/Gladiator), Bladelord's, Astral Raider's, Bloodbrass/Bloodforged, Bloodborne Reaper, Thayan Servitor, Crone's, Elk Tribe Noble's, and many more, each across its item-level tiers with equip bonuses. 32 duplicates were skipped.
- **43 new Wizard gear pieces** added from in-game screenshots: full Wizard armor sets for **Alliance**, **Elemental Alliance**, **Elven**, **Elemental Elven**, **Manticore** (Assault / Raid / Duelist / Executioner), and the **Elemental Drowcraft** cap. The Manticore pieces include their equip bonuses (Gladiator's Accuracy/Focus, Challenger's Might, Survivor's Parry).

### Bug Fixes
- **Report #94 — insignia Combined Rating "wrong" was a display bug, now fixed.** The insignia detail popup (🔍) used to keep showing the Mythic numbers even after you switched the insignia to a higher rarity, so a Celestial insignia could read "400" Combined Rating. The popup now scales to whatever rarity you pick. The "suggest a fix" card also now clearly says its values are base Mythic, so higher-rarity / preferred-slot numbers don't get entered as corrections.
- **Wizard weapons now show up in the Main Hand and Off Hand pickers.** Hundreds of Wizard Orbs and Talismans were mis-filed as "Artifact Equipment," so the Wizard weapon pickers looked nearly empty. All 232 were re-sorted into Main Hand (Orbs) and Off Hand (Talismans) — the pickers now list 144 / 145 weapons instead of 23 / 22.
- **Report #84 — Bloodwoven Ink (healer Pants) corrected.** The Pants showed the Butcher's Zeal bonus, but it's actually the Survivor's Gift version (current HP boosts Outgoing Healing + Power). The two look identical in-game; the stats and bonus were swapped to match the real tooltip.
- **Report #91 — Deathsilver Ring of Submission corrected.** The ring listed a Forte stat it doesn't actually have. Removed it, so it now correctly shows just Accuracy, Combat Advantage, and the 1.5% Action Point Gain bonus.
