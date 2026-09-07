# Set-bonus audit — what the optimizer can and cannot see (2026-09-07)

Read-only audit of every `type: "Set"` equip bonus in `../data/gear.json` (plus `set`
tags on `../data/artifacts.json`). Trigger: the Bard DPS optimizer handed n00b
Solarium/Starcore (Dark Matter, IL 2700) over Wintermarked (Chilling Flow, IL 5800).
Root cause write-up: memory `project_optimizer_weapon_set_text_bias.md`.

**How the engine scores a set** (toon-forge.html ~L13329): a set bonus counts only if
the entry has a `stat` + `amount`, the equipped piece count reaches `pieces`, and the
role gate passes. Description-only entries (`stat: null`) score **zero**. Dedup is by
`setName + stat`, so a pair still scores if EITHER equipped piece carries the wired
entry — a class is blind only when ALL of its pieces are unwired. Placeholder entries
(`stat` set, `amount: 0`) also score zero.

## Headline numbers

| Bucket | Count |
|---|---|
| Distinct set names (gear + artifacts) | 335 |
| Fully structured, no obvious misread | 27 |
| Structured but text says conditional / "up to" and no uptime flag | 20 |
| Partially structured (numbers in text not in any entry) | 36 |
| Structured with a stat name the engine does not know | 2 |
| Text captured, nothing structured at all | 30 |
| Set tag only, no bonus text captured at all | 220 (136 armor families, 44 accessories, 26 artifacts, 14 weapons) |
| Sets wired on some classes' pieces but not others | 48 |
| Placeholder `amount: 0` entries (score zero) | 283 entries across 37 sets |

The 220 "no text" sets are mostly armor families (NW armor generally has no set
bonus; the `set` field is a family label there). They are NOT necessarily missing
data. The weapon/accessory/artifact ones at IL >= 1800 are listed at the bottom as
screenshot leads.

## Tier 1 — endgame sets the optimizer is BLIND to for some or all classes

These matter most: high IL, and a whole class's pair scores zero. Wiring exists on
another class's copy of the same set, so the fix is copying the structured entries
across (values are identical per set; only `role` lines differ).

| Set | Top IL | Classes with NO wired piece | Classes wired | What the bonus really is |
|---|---|---|---|---|
| **Chilling Flow** (Wintermarked / Runefrost / Frostbound) | 5800 | Bard, Barbarian, Cleric, Fighter, Ranger, Rogue, Warlock, Wizard | Paladin only | 10 stacks x (+0.4% Power; DPS +0.6% Crit Sev; Heal +0.5% OOH; Tank +0.5% Awareness) = +4% Power / +6% Crit Sev at full stacks |
| Umbral Stride | 3900 | Paladin (3900), Barbarian, Ranger, Wizard (3300) | Bard, Fighter, Rogue, Warlock | 10 stacks x (+0.25% Power; DPS +0.35% Crit Sev) |
| Whisper of Power | 3750 | Barbarian, Fighter, Paladin, Ranger, Wizard (3400) | Bard, Rogue, Warlock | +7,700 Critical Severity |
| Prismatic Defier of Dread | 3400 | Barbarian, Ranger, Wizard | Bard, Fighter, Paladin, Rogue, Warlock | 10 stacks x (+0.35% Power; DPS +0.5% Crit Sev) |
| Living Magma | 3200 | Barbarian, Paladin, Ranger, Wizard | Bard, Fighter, Rogue, Warlock | +7.5% Power at full HP (decays) + role +2.5% CA/Def/OH |
| Peer Into the Void | 3000 | Bard, Barbarian, Paladin, Ranger, Wizard | Rogue, Warlock | +5% OOH, -5% Incoming Damage, Darklight stacks |
| Skyhold Arms | 2750 | Barbarian, Paladin, Ranger, Wizard | Bard, Fighter, Rogue, Warlock | 10 stacks x (+0.25% Power; DPS +0.35% Crit Sev) |
| Dark Matter | 2700 | Barbarian, Fighter, Ranger, Warlock, Wizard | Bard, Paladin, Rogue | see Tier 3 — the wired copy is itself misread |
| Demonweb Empowerment | 2475 | Barbarian, Fighter, Paladin, Ranger, Warlock, Wizard | Bard, Rogue | +3% BDB / OOH; +1% to 5% Crit Strike and Sev ramp |
| Meteoric Fury | 2450 | everyone but Rogue | Rogue | +2% BDB always-on (DPS) + "up to 3%" HP-diff |
| Beholder Slayer | 2050 | everyone but Rogue | Rogue | +1% BDB per ally stack (max 5) + "up to 5%" HP-diff |
| Duergar / Stormforged / Blaspheme / Scalebreaker's Wrath / Fortified Vale | 1800-2000 | most classes | Rogue (+Bard on some) | leveling-tier; low priority |

Bard-specific consequence: Chilling Flow scores 0, Impending Doom's +5% BDB is
haircut to ~60% uptime, Dark Matter's "up to 5.5%" is credited at a flat 5.5% —
that ordering is exactly why Solarium/Starcore won.

## Tier 2 — endgame sets with NO structured entry on any class

| Set | IL | Slots / class | Text (abridged) |
|---|---|---|---|
| Crimson Retaliation | 4050 | Neck/Belt/Artifact (3pc) | Stacks amplify Crimson Calamity: shield +4%, self damage +4% per stack, max 10 |
| Crimson Clarity (Greater) / Crimson Clarity | 4000 / 3800 | Ranger weapons | Thay: +12% move, +3% Damage; current HP -> Crit Sev up to 5% |
| Executioner's Bloodthirst (Greater) / base | 4000 / 3800 | Wizard weapons | Thay: +2% Damage; on kill +5% Damage 10s |
| Ghastly Eruption (Greater) / base | 4000 / 3800 | Barbarian weapons | Thay: +2% Damage; daily -> 300 mag AoE |
| Umbral Convergence (Greater) / base | 4000 / 3800 | Fighter weapons | Thay: +3% Forte; daily pull, +5% Deflect Sev 6s |
| Astral Dash | 2600 | Neck/Belt/Artifact (3pc) | Stand still 3s -> +4% BDB and move speed |
| Rune of Replenishment | 2300 | Neck/Belt (3pc) | Heal rune 12,500/s, +5% Awareness and Crit Strike |
| Astral Absorption | 2250 | Neck/Belt (3pc) | Below 75% HP: 21,795 arcane burst + 103,225 shield |
| Lolthian Might | 2050 | Rings (2pc) | +2% BDB vs Bosses; 10% chance 100 mag |
| Insightful / Aggressive / Vanguard's / Celestial Alacrity | 1600 | Neck/Belt/Artifact (3pc) | encounter -> 3 stacks x 2.5% Crit Sev / CA / Awareness / Crit Strike |
| Demon Lords' Immortality | 600 | Neck/Belt/Artifact (3pc) | "up to 10%" HP-diff damage |
| Lostmauth's Hoard | 600 | Neck/Belt/Artifact (3pc) | 100 mag extra hit on crit |

The Thay "(Greater)" weapon sets are the IL 4000 rung for four classes and carry a
flat always-on "+2-3% Damage while in Thay" that is easy to structure (zone-gated
via `zones`).

## Tier 3 — structured, but read at full value when the text says otherwise

The uptime classifier (`conditionalDamageUptime`) returns 1.0 for these because the
text has no rule it recognises. Fix = `uptimeOverride` / `alwaysActive:false` on
the entry, or split the entry into its always-on and conditional parts.

| Set | Stored as | Text actually says | Suggested shape |
|---|---|---|---|
| **Dark Matter** | Damage Bonus 5.5 always-on | "up to 5.5% based on HP% difference" + DPS +3% BDB always-on | BDB 3 always-on (dps) + Damage Bonus 5.5 at low uptime |
| Meteoric Fury | Damage Bonus 3 | same shape, "up to 3%" + DPS +2% BDB | BDB 2 always-on + 3 at low uptime |
| Beholder Slayer | Damage Bonus 5 | "up to 5%" + +1% BDB per ally stack (max 5) | BDB perStack 1 x 5 party + 5 at low uptime |
| Evolving Form | CA 2, CS 2 always-on | lasting +2%/+2%, DOUBLED 13s on Corrupting Form | fine as baseline; optional proc double |
| Grand Alliance | Power 3 always-on | only within 25' of target | melee ~1.0, ranged classes lower (range_gated) |
| Duergar / Masterwork / Stronghold weapon sets | BDB 2 always-on | +2% per ally with the set, up to 5 | party-stack model |
| Celestial | BDB 7.5 always-on | 5 charges -> 30s Divine Fury, once per window | proc / duty-cycle |
| Aboleth | Dmg Bonus 4 + Outgoing Damage 4 | one 4% Outgoing Damage on encounter, 10s | double-counted AND full uptime |
| Tyrant / Primal / Pioneer / Vistani / Chultan / Duality / Hellfire / Devil's Legion | various | all conditional (ramp / party size / on-hit) | leveling tier — low priority |

## Tier 4 — stat names the engine does not recognise

| Set | Entry | Problem |
|---|---|---|
| Burning Heart | `Action Points 25` | not a stat; should be an AP-gain proc or dropped |
| Drowned Heart | `Heal Self 50` | not a stat; self-heal proc, dropped by design (self-heal not credited) |

Both are IL 300-600 leveling weapons. Harmless but noisy.

## Tier 5 — partially structured at endgame (numbers in text missing from entries)

Living Magma (role +2.5% CA missing), Peer Into the Void (Incoming Damage -5 and the
Darklight stacks missing), Enchanted Advantage (stored as `Accuracy 3000`, text says
+3% Combat Advantage — wrong stat), Demonweb Empowerment (Crit ramp missing),
Soulpiercer (+2.3-2.5% at 25'+ missing), Essence Reap / Abyssal Prowess (proc stats
missing), Whisper of Power (`Power 5200` on some pieces vs `Critical Severity 7700`
on others — inconsistent). Full list: regenerate with `scripts/_set_bonus_audit.py`.

## Screenshot leads — sets with a tag but no bonus text at all (IL >= 1800, non-armor)

Armor families are excluded here (no set bonus expected). These may or may not have
an in-game bonus; a tooltip screenshot settles each one.

- **Rings: Soul Harvest** — ?pc, IL 4650-4900, Ring, (any) — Deathsilver Band of Sacrifice, Deathsilver Coil of Dominion, Deathsilver Halo of Obedience, Deathsilver Hoop of Oppression, Deathsilver Loop
- **Focused Radiance** — 3pc, IL 4050-4050, Belt, Neck, (any) — Belt of the Forsaken, Necklace of the Forsaken
- **Finish the Job** — 3pc, IL 4050-4050, Belt, Neck, (any) — Nightpiercer Bindings, Nightpiercer Choker
- **Doomvault Remains** — 8pc, IL 3150-4050, Pants, Ring, Shirt, (any) — Graveveil Band of Unlife, Graveveil Coil of Silence, Graveveil Halo of Finality, Graveveil Hoop of Decay, Graveveil Loop of Mourning, Gravev
- **Soul Harvest** — ?pc, IL 3600-3800, Pants, Shirt, (any) — Arcane Conduit Crest — Combatant's Advantage, Arcane Conduit Crest — Critical Momentum, Arcane Conduit Ink — Brutal Power, Arcane Conduit In
- **Clothing: Soul Harvest** — ?pc, IL 3150-3600, Pants, Shirt, (any) — Mystic Conduit Sigil — Sudden Intuition, Mystic Conduit Sigil — Survivor's Avoidance (Lesser), Tempest Gaze Crest, Tempest Gaze Crest (Deple
- **Tyrators** — 8pc, IL 3450-3450, Ring, (any) — The Forgotten Relic, The Hollow Maw, The Lesion Band, The Path of Dusk, The Thorned Edict, The Unbroken Seal
- **Wrathful Bindings** — 3pc, IL 3400-3400, Belt, Neck, (any) — Wrathful Strangler, Wrathful Waistband
- **Volcanic Jewels** — 3pc, IL 3200-3200, Belt, Neck, (any) — Belt of the Caldera, Locket of the Caldera
- **Clothing: Doomvault Remains** — 2pc, IL 3150-3150, Shirt, (any) — Tempest Gaze Seal — Charged Fury
- **Magmatic Efficiency** — 3pc, IL 2800-2800, Belt, Neck, (any) — Choker of Searing Magma, Girdle of Coagulated Magma
- **None** — ?pc, IL 310-2600, Artifact, Barbarian, Bard, Cleric, Fighter, Paladi — Alaric's Artillery Beacon, Arma-Egg-On, Assassin's Dice, Assassin's Knife, Astral Seed Tendril, Aurora's Whole Realms Catalogue, Beacon of M
- **Clothing: The Dread Sanctum** — 2pc, IL 2600-2600, Pants, Shirt, (any) — Cerebral Predator Ink — Combat Advantage/Awareness, Cerebral Predator Ink — Combat Advantage/Critical Severity, Cerebral Predator Ink — Crit
- **Infused Recharge** — 2pc, IL 2200-2400, Pants, Shirt, (any) — Ember Burned Pants, Ember Burned Shirt, Ember Glazed Pants, Ember Glazed Shirt, Magma Burned Pants, Magma Burned Shirt, Magma Glazed Pants, 
- **Infused Accuracy** — 2pc, IL 2200-2400, Pants, Shirt, (any) — Ember Infused Pants, Ember Infused Shirt, Ember Stitched Pants, Ember Stitched Shirt, Magma Infused Pants, Magma Infused Shirt, Magma Stitch
- **Clothing: Pirates' Skyhold Region** — 2pc, IL 2100-2350, Pants, Shirt, (any) — Mudwalker's Predator Ink — Combat Advantage/Critical Severity, Mudwalker's Predator Ink — Combat Advantage/Critical Strike, Mudwalker's Pred
- **Abyssal Fury** — 2pc, IL 2250-2250, Ring, (any) — Amethyst Abyssal Loop, Diamond Abyssal Loop, Emerald Abyssal Loop, Garnet Abyssal Loop, Malachite Abyssal Loop, Opal Abyssal Loop, Platinum 
- **Ruthless Domination** — 3pc, IL 1500-2050, Artifact, Belt, Neck, (any), Barbarian, Bard, Cleric, Fighter, — Greater Beholder Belt, Hypnotizing Pendant, Wand of Domination
- **Infused Power** — 2pc, IL 1900-2000, Pants, Shirt, (any) — Basalt Infused Pants, Basalt Infused Shirt, Basalt Stitched Pants, Basalt Stitched Shirt, Obsidian Infused Pants, Obsidian Infused Shirt, Ob
- **Infused Healing** — 2pc, IL 1900-2000, Pants, Shirt, (any) — Basalt Burned Pants, Basalt Burned Shirt, Basalt Glazed Pants, Basalt Glazed Shirt, Obsidian Burned Pants, Obsidian Burned Shirt, Obsidian G
- **Dashing Action** — 3pc, IL 2000-2000, Belt, Neck, (any) — House Baenre Brooch, House Baenre Wrap
- **Attuned Eye of Odran** — 3pc, IL 1500-2000, Artifact, Belt, Neck, (any), Barbarian, Bard, Cleric, Fighter, — Eye of Odran, Sanity Preservation Choker, Tassets of Mind Restraint
- **Tentacle Rod** — 3pc, IL 1800-1800, Belt, Neck, (any) — Tentacle Eye, Tentacle Wrap
- **Rings of the Demonweb Pits** — 2pc, IL 1700-1800, Ring, (any) — Darklake Ward Ring, Darklake Ward Ring +1, Scintillant Assault Ring, Scintillant Restoration Ring, Shroomwood Raid Ring
- **Reflective Armaments** — 3pc, IL 550-1800, Artifact, Belt, Neck, (any), Barbarian, Bard, Cleric, Fighter, — Erratic Drift Globe, Mirror-Plated Belt, Reflective Collar, Vibrating Erratic Drift Globe
- **Enchanted Thumb** — 3pc, IL 550-1800, Artifact, Belt, Neck, (any), Barbarian, Bard, Cleric, Fighter, — Blooming Cord, Imbued Staff of Flowers, Staff of Flowers, Woven Vine
- **Assassin's Luck** — 3pc, IL 1800-1800, Belt, Neck, (any) — Assassin's Belt, Assassin's Choker
- **Armaments of Construct Demise** — ?pc, IL 600-1800, Artifact, Barbarian, Bard, Cleric, Fighter, Paladi — Trobriand's Overcharged Ring, Trobriand's Ring
- **Apprentices' Spoils** — ?pc, IL 600-1800, Artifact, Barbarian, Bard, Cleric, Fighter, Paladi — Arcturia's Music Box, Arcturia's Resonating Music Box

## Recommended order (not started — n00b decides)

1. **Chilling Flow wiring for the 8 unwired classes** — copy Paladin's structured entries. Biggest single blind spot: it is the top weapon set in the game.
2. **Dark Matter / Meteoric Fury / Beholder Slayer re-shape** — always-on BDB + "up to" at low uptime. Stops the Solarium/Starcore pick.
3. Class-hole copy pass for Umbral Stride, Whisper of Power, Prismatic Defier, Living Magma, Peer Into the Void, Skyhold Arms.
4. Structure the four Thay (Greater) weapon sets' flat zone damage line.
5. Optimizer: refresh TIL per weapon pair (separate from data; see memory).

Regenerate: `python3 scripts/_set_bonus_audit.py` (set-level scan, writes set_audit_raw.md)
then `python3 scripts/_set_bonus_audit_report.py <dir with set_audit_raw.md>`.

---

## Status after the fix sweep (same day, 2026-09-07, all pushed)

n00b's go: "fix the equip bonuses that are missing or text based or placeholders".
Four batches, each verified in Toon Forge (per role, per zone, no page errors):

| Batch | What | Commits |
|---|---|---|
| 1 | Chilling Flow 5800/5500 wired on all 9 classes (4800 rung stays text-only: no numbers captured) | 6a94f6e8 |
| 2 | Engine: `CONDITIONAL_UPTIME.hp_diff = 0.40` + `uptimeClass` entry field. Data: Dark Matter / Meteoric Fury / Beholder Slayer / Demon Lords re-shaped (HP-difference part at 40%, always-on role riders added) on every class | 6049c43a |
| 3 | Engine: set dedup key carries #stack/#zone/#cond so two bonuses on one stat coexist. Data: 21 endgame weapon sets (Umbral Stride, Prismatic Defier, Skyhold Arms, Living Magma, Peer Into the Void, Demonweb, Whisper of Power, 8 Thay sets x2 tiers) on every class | a8d2e167 |
| 4 | ~50 leveling / accessory / armor sets structured with stated uptimes; 283 amount-0 placeholders removed; unknown stats dropped; Dusk + Dragonflight Max HP as flat pool; 17 structural weapon-slot fixes | faacfb3f |

Re-running the scan afterwards: fully structured 27 -> 68 sets; text-only 30 -> 14
(all of them un-scorable by nature, listed below); unknown-stat 2 -> 0; per-class
wiring holes 48 -> 0 at endgame (the ones left are IL <= 1500 families such as
Lionsmane / Vistani 2pc / Masterwork VII). The remaining "PARTIAL" flags are the
scanner seeing cooldown or duration numbers in the text, not missing stats.

Result on the captured 145k Bard: Wintermarked 5800 now scores 208k vs Solarium
2700 at 198k (was 203k vs 197k, and Solarium won once every cap saturated).

**Deliberately left as text-only** (no stat to score): Crimson Retaliation (amplifies an
artifact), Astral Absorption (burst/shield/heal), Lostmauth's Hoard (100-mag proc),
Vistani 3pc, Chultan (random stat, 10s), Drowcraft (vs Demons), Relic, Black Ice,
Soulmonger, Apocalypse (enemy debuff), Golden Dragon / Dagger of Elemental Fire
(mod-slot sets), Burning Heart (AP restore), Drowned Heart (self-heal).

**Still open / needs a screenshot:** Chilling Flow 4800 per-stack numbers; Bard Pilgrim
pair (Fleshtaker / Earbleeder both tagged Main Hand); Paladin + Ranger Golden Dragon
pairs; Rogue "Nightspiercer Dagger" typo duplicate; Impending Doom untouched (per-class
entries exist, Unleashed at ~60% uptime by design).

**Not touched (paid IP, n00b's call):** the optimizer freezes total item level during the
weapon-pair search, so a low-IL pair is never charged for the item level it costs.

Data conventions used (scripts/_set_wire.py, local): one wired piece per class + tier
(Off Hand primary), marker entry stat-less, every entry named, uptime stated as
`uptimeOverride` / `uptimeClass` / `procModel` with the reasoning in the name.
