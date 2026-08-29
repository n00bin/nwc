# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

## Week of August 24, 2026

### Bug Fixes

- **"Add Missing" submissions were being lost.** If you used **+ Add Missing Artifact, Mount, Companion, Enchantment, Insignia, Collar, Buff, Guild Boon or Overload** in Toon Forge, the item still went into your own build — but the report telling us about it never reached us, so it could never be added to the site for everyone. (The gear one always worked; these nine did not.) That's fixed. If you added something this way and it never showed up on the site, please add it again — it will reach us now, and you'll see it under **Your Submissions**.

### Data Additions

- **Bloodthirst Chalice added** — the artifact from Tempus Arena: The Slaughterhouse. All five ranks are in, from Uncommon (item level 1,300) up to Artifact Maximum Quality (item level 2,600), each with its own stats, recharge time and debuff strength. At the top rank it gives **1,638 Power / 1,092 Defense / 1,502 Critical Avoidance**, hits for 26,171 AoE damage, applies a bleed, and weakens enemy damage by 10% while slowing lesser enemies by 15%. Thanks to the player who flagged it as missing. (Reports #268-#273)

### Bug Fixes

- **Bulwark of the Eternal Zulkirate had two wrong stats.** The IL 4,300 chest piece was listed with 4,154 Deflect Severity and a Defense stat it does not have. It is actually **4,354 Deflect Severity** and **2,612 Forte** — now corrected and verified against the in-game Collections tooltip. (Report #265)
- **Ruthless Might (Lesser) was under-valued.** The IL 4,050 Bulwark of the Zulkirate's equip bonus was stored as 1% Critical Strike and Critical Severity per stack; in game it is **1.2% per stack** (5 stacks = 6%). Toon Forge now scores this chest correctly.

### Features

- **Currency Tracker now resets your week by itself.** Set your weekly reset day and time once in the bar at the top, and this week's earnings zero themselves the moment it arrives — you no longer have to press “Reset week now”. It works even if you leave the page open (or come back to a sleeping tab): the tracker re-checks the moment you return, drops the week back to 0, and tells you a new week started. The bar also shows a live countdown (“auto-resets in 2d 14h”) so you can see when it is due. Your held totals and your full log are untouched — only the this-week numbers roll over. The “Reset week now” button is still there as a manual override if you want to start a fresh week early.

---

## Week of August 17, 2026

### Features

- **Currency Tracker — Cap Status now counts up.** Each character row in the Cap Status list now shows progress as earned / cap (e.g. "1,200 / 3,000 this week") instead of counting down what's left, matching the progress lines on the character cards. Capped rows show the full amount with a checkmark.

### Bug Fixes

- **Ranger at-will and encounter pickers are readable again.** Since mid-July, opening the At-Will or Encounter picker on a Ranger in Toon Forge showed a wall of raw code text instead of the powers. The pickers now show each ranged/melee pair properly again — 🏹 ranged side and ⚔ melee side, each with its own damage, cast time and description — and searching the list by power name works too. Only Rangers were affected (they're the only class whose powers come in stance pairs).

---

## Week of August 10, 2026

### Data Additions

- **Star of Simril added** — the Winter Festival augment companion. It shares Power, Awareness and Critical Avoidance with you, comes with the Perfect Vision enhancement, and its Offense/Utility power (Star of Simril's Insight) gives Maximum Hit Points, Critical Strike and a Gold Bonus — 12,000 HP / 3% Critical Strike / 6% Gold at Celestial. Thanks to the player who reported it missing! (Report #253)

### Features

- **Guild boons now say which rank you're looking at.** When you open a guild boon's correction card in Toon Forge, it now explains up front that the numbers shown are the fully upgraded rank-10 values, and that each structure rank is worth 300 stat / 80 Combined Rating / 100 item level — with a pointer to the Rank dropdown on the Boons panel. Two players' "wrong value" reports turned out to be rank-3 guild structures. (Reports #254, #255)

### Bug Fixes

- **Correction reports now remember the site's original value.** If you edited the same field twice on a Toon Forge correction card, the report sent to us said the site showed "(empty)" instead of the real original number. Reports now always carry the site's original value, and re-typing your own earlier edit no longer counts as a change. (Reports #256–#262)

---

## Week of August 3, 2026

(Last published August 3, 2026: "The Optimizer & Forgemaster's Verdict Go Live, Toon Forge Hits v1.0 & a Stable Cleanup")

### Features

- **Optimizer "Build style" choice — Formula vs Cap Stats.** (LOCAL-ONLY until n00b's go — optimizer is the premium tool.) The Optimizer Setup dialog now lets you pick how the search builds: **Formula** (the default — chases the highest real damage/healing/survivability, and only caps a main stat when doing so is free; that's why a healer's Crit Severity can sit under cap on purpose — it's halved on heals) or **Cap Stats** (the community build order — push every main stat to its cap first, then maximize output with what's left; it will trade output away to raise an uncapped main). The result panel's Build order note now says which style produced the build. Your choice is remembered between runs.

- **Preview page rotated to Mod 33.5: Monoliths of Madness.** The preview section now covers the upcoming module (PC test servers opened August 5; release aimed at early September): the new Monoliths of Madness event campaign across four returning zones, a second Combat Enchantment slot (Offense + Defense), item stacks raised from 99 to 999, and the announced upcoming rewards (Abyssal Spider mount, Burning Hope artifact, Staring Cat of Uldunn-Dar legendary companion, Renewed gear, and more). Mod 33 preview screenshots have been retired. Test-server screenshots will be added as content gets verified.

### Data Additions (Preview)

- **First Mod 33.5 test-server screenshots are up on the Preview page (29 images).** The Staring Cat of Uldun-Dar legendary companion (both tooltip tabs), the Umbral Widow mount (equip/combat powers + insignia slots), the Burning Hope artifact, and the full Renewed gear lineup: Delzoun armor (Head/Chest/Arms/Feet, 3 variants each) plus all 6 Obsidian shirt and 6 pants variants. The Renewed gear has no class requirement, so the Gear section now has an "All Classes" group with slot filters.

### Bug Fixes

- **Wizard Thaumaturge — Critical Burn feat now counts.** Slotting the Critical Burn paragon feat now adds its +10% Critical Severity to your stat panel in Toon Forge, matching the in-game sheet. (Report #248)

- **Ichorpact Gauntlets** — the Renegade's Stamina equip bonus is now applied to your stats (1.4% Stamina Regeneration per stack, 7% at 5 stacks), not just shown as text. (Report #236)

### Data Additions

- **Rogue frost weapons — all four Chilling Flow daggers.** Added the Rogue Jotunskar weapon pairs: Runefrost Nightknife + Runefrost Sideblade (Item Level 5,500, Advanced) and Wintermarked Shardfang + Wintermarked Offhand Fang (Item Level 5,800, Master), all screenshot-verified from in-game collections, including the tier-exact Chilling Flow set bonuses. Thanks to the player who submitted them! (Reports #239, #240, #241)

- **Reinforcement kits — full Greater/Major ladder, 33 new kits.** Every armor kit and jewel family (Power, Defense, Critical Strike, Critical Severity, Deflect, Accuracy, Critical Avoidance, Hit Points, Awareness, Combat Advantage, Stamina Regeneration) now lists the Greater, Greater +1, and Major tiers alongside the existing Major +1 — so lower-budget builds can pick the kit they actually own. Started from a player report suggesting the Major Combat Advantage Jewel +1 (+880) was misnamed — it's correct; Greater and Major are separate crafting tiers. (Report #242)

- **The Slaughterhouse tier 2 — 8 more armor pieces at Item Level 4,600.** Full Head/Armor/Arms/Feet sets for two more families from the Soul Collector Campaign Store: **Ichorpact** (Paladin/Barbarian/Fighter) and **Cruorforged** (Paladin/Cleric), all screenshot-verified with their equip bonuses. These went live August 2 but were never announced. (Reports #234, #235, #236, #237, #238)
