# Warlock DPS — Community Meta Check (2026-08-11)

**Question:** what does the community meta run for Warlock DPS, and what can we learn from it?
**Sources:** (1) our own Supabase shared-build capture — **20 real Warlock Hellbringer DPS builds**, TIL 80,297–149,887 (median 132,939), captured 2026-06-21 → 2026-08-11, 0/20 used the optimizer (kill switch is on, so these are players' real in-game builds); (2) web sweep of creator content (researcher agent); (3) cached community sheets / NW Hub mirror.

**Headline:** every written creator guide reachable on the web is 2020–2021 stale (mmorpgtips "updated 2025" is a metadata touch on Mod-30 content; jannenw abandoned since 2020; Charisma's Compendium ~2021). The genuinely current sources (Apr-2026 "M32.5 Warlock DPS Build" video, Feb-2026 class tier list ranking Warlock DPS A-tier) are YouTube/Sheets and not machine-extractable. **Our capture data is currently the best available Warlock meta source, period.**

---

## The community consensus build (from our 20 captured builds)

| System | Consensus (count/20) |
|---|---|
| Weapons | **Omen of Doom + Codex of Eternal Chains — 20/20**, Impending Doom 2pc (IL4800 tier) |
| Head | Wintermarked Hunter Hood (11) |
| Armor | Enchanted Depthweave Coat (11), Wintermarked Hunter's Coat (6) |
| Arms | Wintermarked Swiftguards (16) |
| Feet | Wintermarked Trail Boots (9), Greaves of the Crimson March (8) |
| Neck / Waist | Scintillant Amulet (11+2) / Scintillant Sash +1 (12) |
| Shirt / Pants | Bloodwoven Signs — Critical Empowerment (9) / Bloodwoven Sigils (Reckless Advantage) (11) |
| Rings | The Bloodlit Veil (7), Rotsteel Loop of Ash (9), Frostsilver Coil of Wrath / Ring of Initiative (5+5) |
| Artifacts | Nightflame Censer (17), Sealing Parchment (17), Crimson Calamity (10), Heart of the Volcano (10) |
| Enchants | Celestial Garnet everywhere (109 slots), Celestial Amethyst (31); combat: Celestial Swift Synergy (15, stored under old "(R)" name) |
| Summoned | Flapjack (12), Drizzt (3) — augments: zero (gate's community-taboo assumption confirmed) |
| Actives | Minsc (19), Neverwinter Knight (18), Batiri Runt (17), **Raptor→Tamed Velociraptor (16)**, Stalwart Golden Lion (8) |
| Enhancement | Perfect Vision (11), Potent Precision (7) |
| Mounts (stable) | Demon Wings (17), Grubshank the Burdened (12), Neverwinter's Hand (11), Golden Armored Griffon (10), Demonic Gravehound (10) |
| Insignia bonuses | Tactician's Precision (25 slots), Cavalry's Haste (17), Executioner's Covenant (16), Mender's Covenant (14) |
| Mount powers | Equip: Ferocity (12); Combat: Infernal Pounce (15) |
| Kits | Major Combat Advantage Jewel +1 (63 slots), Major Power Armor Kit +1 (42) |
| Encounters | **Vampiric Embrace (18)**, Killing Flames (17), Hadar's Grasp (16) |
| Daily / At-wills | Tyrannical Curse (19); Hellish Rebuke (19) + Dark Helix (16) |
| Class features | All-Consuming Curse (19), Dark Prayers (10), Dust to Dust (9) |
| Feats | Double Scorch (19), Warlock's Curse (17), Creeping Death (17), Soul Desecration (15), Wrathful Souls (11) |
| Overloads | Rage of Flames (15), Devil's Precision (12) |
| Race | Half-Orc (10), Gith (5) |

Every consensus item above **exists in our data and is optimizer-visible** — the meta path is fully modeled. The audit's Warlock set gaps (5 Pact Blade sets missing Grimoires, Masterwork III/VII holes) are all off-meta items nobody runs.

## What we learned (actionable)

1. **Rename drift silently breaks saved builds — no alias layer exists anywhere.** Community builds reference three ghost names: companion **"Raptor"** (16/20 builds; renamed to *Tamed Velociraptor* — the Pack-meta companion, so those builds silently lose a top-4 active comp on reload), enchant **"Celestial Swift Synergy (R)"** (15/20), and **"Celestial Rubelite Tourmaline"** (5/20, one-L). Grep confirms no rename map in `data-corrections.js` or `toon-forge.html`. **Recommend:** a small legacy-name alias map (old→new) applied at state-load, and a rule: any future item rename adds an alias entry.
2. **The one-L Rubelite ghost confirms the audit's Frostsilver gemSynergy bug** from the other direction — the ring's `gemSynergy` still references the pre-rename spelling, so the +3% synergy can never fire. Same fix family as #1.
3. **The rotation cooldown bug is off-meta for Hellbringer today.** Old guides (2020-21) all had Blades of Vanquished Armies in the core loop; the 2026 community has moved to **Vampiric Embrace (18/20)** — and 0/20 slot BoVA or Dreadtheft, the two powers the audit found scoring 0. So the bug doesn't distort current Hellbringer rankings, but the Vampiric Embrace half (17× undervalued on Soulweaver) still matters and the fix is the same three lines.
4. **Meta rotation ≠ our old assumptions.** Vampiric Embrace as a near-universal Hellbringer DPS encounter is a real meta shift no written guide documents. Worth reflecting in the DPS rotation profile for Warlock (`docs/audit/dps_rotation_profiles.md`) when it's next touched.
5. **Scintillant name fragmentation is visible in the wild:** builds store both "Scintillant Amulet" and "Scintillant Amulet · IL 800" — gear.json carries "· IL ###"-suffixed AND "(Uncommon)/(Rare)"-suffixed duplicates of the same family. Consolidation candidate (name = clean, tiers = item_level rows).
6. **Sealing Parchment + Crimson Calamity are top-meta artifacts** (17 and 10 of 20 builds) — and both carry the audit's `set:"None"` display desync (artifacts page shows no set row, not searchable by set). That fix just became high-visibility.
7. **Validation wins:** zero augment summons (augment gate assumption holds); kit meta (CA Jewel + Power kits) matches our optimizer's kit logic; insignia-bonus meta names match our modeled bonuses; feat/stat-priority shape from every era of guide matches `project_nw_role_priorities`.
8. **Doc fix:** NW Hub's real domain is **`nw-hub.com`** — `nwhub.com` (referenced in project docs) is now a parked GoDaddy page.

## Gaps / next steps (pick if wanted)
- Watch the Apr-2026 "M32.5 Warlock DPS Build" video (youtube.com/watch?v=2iapYYdErpU) manually — the only unread current creator source; n00b-watchable in ~15 min.
- A/B the optimizer: run Warlock DPS owned-only on a median community build's item pool and diff its picks vs the consensus table above — the cleanest "does our optimizer agree with the meta" test.
- Add the legacy-name alias map (fix #1/#2) — small, high-impact for the 20 captured builds and any player share-links from before the renames.
