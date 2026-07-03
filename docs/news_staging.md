# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

(Last published July 2, 2026: "Boons Rebuilt From Live Tooltips, Healer & Tank Optimizer Overhaul + Paragon Cleanup")

## Week of 2026-07-02 (since last publish)

### Features

### Data Additions

### Bug Fixes
- Rath Modar's summoned power (Rath's Patience) showed its base Mythic value at every quality: the Defense-per-stack buff now correctly reads 2% per stack at Mythic and 2.4% per stack at Celestial (up to 9.6% at 4 stacks), matching the in-game inspect tooltip. Toon Forge's math was already right — this was display-only.
- Companion proc-effect stat values now scale with the selected quality on the Companions page (they were always showing the base-quality number), and companion database pages now say which quality a proc's numbers are shown at ("At Celestial (IL 900)").
- Enchantment ranks now use their real per-quality values everywhere. The "Tier you own" picker and the stat engine were scaling every enchant linearly from Celestial, which gave wrong numbers for enchants whose progression isn't linear (Rime Temper's Incoming Damage Reduction at Epic showed 6% instead of 7%, Mythic Max HP showed 13% instead of the verified 14%). Both now read the verified per-quality tables.
- Rime Temper's Max HP and Incoming Damage Reduction are always-on equip effects, but Toon Forge was treating them like stack-based combat-enchant buffs (hidden behind "Show conditional"). They now count in your base stats.
- Celestial Rime Temper's values were wrong — they had been estimated instead of verified. Confirmed in game: +15% Maximum HP, +12% Incoming Damage Reduction, and the on-hit debuff is 4.5% per stack at Celestial (we showed +16%, +13%, and 4%). The name now also matches the in-game "Celestial Rime Temper (R)", and old saved builds still load fine.
- Item database pages no longer show empty "Equip bonus" headings — bonuses that only exist as structured data now display their stat and value (about 800 pages affected).
- Toon Forge no longer offers Artifact Modification pickers on weapons that aren't artifact weapons. The Wintermarked and Runefrost weapons (the Chilling Flow drops from Jotunskar) have no modification slots in game, so the Art Mod controls now hide — and any mod stats are excluded from your totals — while one of them is equipped.
- Cracked Stonevein Harness (IL 4,600) had the wrong bonus: the site showed "Survivors Healing Aura" on the Pants piece, but in game those stats belong to the "Survivor's Avoidance" variant (up to 8% Critical Avoidance based on health). Fixed the Pants entry and added the missing Survivors Healing Aura Shirt variant as its own item (with the correct 15s cooldown).
