# News Staging — Unpublished Changes

Add entries here as changes are made. When ready to publish, say "publish news" and these will be formatted and added to the News tab.

## Week of 2026-05-03

### Features
- New **Insignias** tab on the Mounts page: browseable reference of all 16 stat templates × 6 quality tiers (Uncommon → Celestial), with stats auto-scaled per tier and slot-type badges showing which insignia categories carry each template. Filter by name, quality, or slot type. Cross-checked against external sources — every value verified.
- Mount detail panel now shows compatible bonuses with their required insignias **in slot order** (matching the mount's actual slot layout) instead of canonical order. Makes it visible at a glance which slot each insignia would land in.
- Gold ★ markers on bonuses that activate a preferred slot (+20% IL & stats), and on slot boxes themselves with a preferred type. Tooltips on hover.

### Bug Fixes
- Fixed mount name typo: "Legendary Barigura" → "Legendary Barlgura" (matches the regular Barlgura spelling and D&D source).
- Mekaniks: corrected 3 wrong rows in the Forte distribution table — Cleric Arbiter primary (Divinity Regen → Power), Fighter Vanguard secondaries (CritStrike/DeflectSev → Accuracy/CritAvoid), Paladin Oathkeeper secondaries (Accuracy/Awareness → CritStrike/DeflectSev).
- Mekaniks: removed incorrect "At 0 rating: ~45% base" line from the Rating-to-Percentage card (formula returns 0%/clamped at 0 rating, not 45%).

### Data Additions
- Mekaniks: added **Control Bonus** and **Control Resist** as full stat cards under a new "Control Stats" section.
- Mekaniks: rating cap vs. total cap distinction now explained — rating contribution alone caps at 50% (for 90% stats) or 60% (for 120% stats); the rest comes from non-rating sources.
- Mekaniks: documented Forte's special property of **bypassing individual rating caps** (contributes directly to total percentage).
- Mekaniks: added "1 IL ≈ 15 stat rating points" rule of thumb and a worked rating-to-percent example.
- Mekaniks: new **Base Damage & Base HP by Role** card on the Damage tab, showing the inverted role multipliers (DPS ×1.2 dmg / ×1.0 HP, Healer ×1.1 / ×1.1, Tank ×1.0 / ×1.2).
