# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

---

## Week of October 12, 2026

### Features

- **Dungeon Achievement Tracker** (new, under Creators & Tools). Track dungeon achievements, tick them off, and see which ones you are closest to finishing. It is a growing list (about 160 so far) with more being added. Search by dungeon, name or text; filter by dungeon, Not done / Done / All, and Master only; sort by closest to completion, dungeon, points or name. Tick the sub-achievements, keep counters like 9/25, and watch the progress bar fill. Built for phones first: one column, big buttons, and the filters tuck into a Filter sheet. Sign in with Discord (free, the same sign-in as Toon Forge cloud saves) and your progress follows you to any device, so clearing your browser no longer loses it. Signed out it saves in your browser only, and there is a Back up to a file / Restore from a file pair as a safety net. Entries whose details are not added yet are hidden by default (a toggle shows them).

- **Dungeon Achievement Tracker now keeps progress per character.** Dungeon achievements belong to a character in game, so the tracker now does too. Pick your character at the top of the page, add up to 10 ("+ Add character"), rename them, remove ones you no longer play, or copy progress from one character into another (it only adds, it never overwrites newer ticks). Search, filters, the closest-to-completion sort and the points-left count all follow the character you have selected, and the page remembers which one you were on. Everything you had already ticked is kept: it moves into a character called Main on every device, in the browser and in your Discord account. Back up to a file now saves all your characters, and older backup files still restore (into the character you are on).

### Data Additions

### Bug Fixes
- **Arbiter clerics now run out of divinity in the fight simulator (Toon Forge).** Searing Javelin and Forgemaster's Flame cost divinity, but the simulator let them fire every second forever, so the optimizer overrated Arbiter rotations built on them. It now tracks your divinity bar (1,000, plus 150 with Expanded Faith), refills it naturally and by holding Channel Divinity (with the Judgement gauge refund), and stops attacking while you channel. Divinity-regeneration items now count for an Arbiter, and Divine Equilibrium reads your real divinity level. Thanks to the player whose recordings measured all of it.
