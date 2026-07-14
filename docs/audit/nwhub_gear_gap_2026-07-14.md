# Gear gap audit — NW Hub `/gear/list` vs our `gear.json` (2026-07-14)

Cross-checked NW Hub's **curated current-endgame gear list (278 items)** against our
`../data/gear.json` (6,706 entries). **This is a verification worklist, not changes.**
NW Hub is a *lead* — per our standing rule (*no unverified adds; screenshots win*),
every item below gets confirmed against an in-game screenshot before we touch data.

**Headline:** 238/278 matched cleanly. The raw diff flagged 40 "missing", 48 "slot"
and 108 "equip-power" mismatches — but after filtering our naming conventions, the
**real** worklist is small. Most "mismatches" are NOT errors (see §E).

---

## A. Genuinely missing items (verify in-game, likely add) — ~14

### A1. Abyss Conqueror's set — *The Demonweb Pits (Master)* — we have ZERO
| NW Hub name | Slot | IL | Equip power |
|---|---|---|---|
| Abyss Conqueror's Healing Guard | Head | 2000 | Butcher's Focus |
| Abyss Conqueror's Mauler Plate | Armor | 2000 | Reckless Rage |
| Abyss Conqueror's Provoker Cuirass | Armor | 2000 | Provoker's Stance |

Confirmed absent (`grep "Abyss Conqueror" → 0`). Highest-confidence gap.

### A2. Rogue frost weapons (Chilling Flow family) — we have Paladin/Cleric frost, not Rogue
| NW Hub name | Slot | Class | IL | Set |
|---|---|---|---|---|
| Runefrost Nightknife | Main Hand | Rogue | 5500 | Jotunskar (Advanced) |
| Runefrost Sideblade | Off-hand | Rogue | 5500 | Jotunskar (Advanced) |
| Wintermarked Shardfang | Main Hand | Rogue | 5800 | Jotunskar (Master) |
| Wintermarked Offhand Fang | Off-hand | Rogue | 5800 | Jotunskar (Master) |
| Frostbound Knife | Main Hand | Rogue | 4800 | — |
| Frostbound Sideknife | Off-hand | Rogue | 4800 | — |

### A3. Cleric frost weapons — verify (we have Frostbound War Mace/Oath Shield, not these)
| NW Hub name | Slot | IL |
|---|---|---|
| Frostbound Crookstaff | Main Hand | 4800 |
| Frostbound Faith Symbol | Off-hand | 4800 |

### A4. Duergar Cleric weapons — confirmed absent (`Steel Symbol/Icon → 0`)
| NW Hub name | Slot | IL |
|---|---|---|
| Duergar Mercenary's Steel Symbol +1 | Main Hand | 2000 |
| Duergar Mercenary's Steel Icon +1 | Off-hand | 2000 |

### A5. New tier
- **Scream Seeker (Celestial, IL 5300)** — we have IL 3400/3750/4100 only. New Celestial rung.

---

## B. Real data fixes (high confidence)

1. **Typo: `Pact of Vengence` → `Pact of Vengeance`** — equip-bonus name on the ring
   *The Claw of Covetous Flame*. NW Hub spells it correctly.
2. **Dread Confessor wrong-slot duplicates** — Dread Confessor is an **Off-Hand**
   (we have 6 IL-tiered Off Hand entries, correct). But we ALSO have **6 "Dread
   Confessor" / Main Hand** entries with no IL — phantom/wrong-slot dupes. Investigate
   & clean (relates to the dup-name set-conflict pattern).

---

## C. Equip-power name discrepancies (verify which is right)
| Item | Slot | Ours | NW Hub |
|---|---|---|---|
| Veinlit Lifebraid Vestment | Pants | Charged Rejuvenation | Super Rejuvenation |
| Veinlit Aetherwrap | Pants | Sprinter's Advantage | Survivor's Rush |
| Detector's Pendant | Neck | Unstable Drive | Unstable Scan |
| Detector's Girdle | Waist | Unstable Drive | Unstable Scan |
| Detector's Sash | Waist | Unstable Drive | Unstable Scan |

---

## D. Ambiguous — probably the same item under a different NW name (low priority)
- **Tiamat**: ours `Tiamat's Golden Necklace` / `Tiamat's Golden Sash` vs NW
  `Amulet of Tiamat's Demise` / `Tiamat Sash` (NW shows no IL). Likely the same
  neck+waist items; confirm before adding anything.

---

## E. NOT errors — documented so we don't re-chase (no action)
- **Slot spelling (~47):** we use `Off Hand` / `Belt`; NW Hub uses `Off-hand` / `Waist`.
  Same slots, our convention.
- **Per-variant naming:** we split same-name clothing by power
  (`Arcane Conduit Crest — Combatant's Advantage`), NW Hub appends `(shirt)`. Both
  Conduit sets (Arcane 6+6, Mystic 6+6), Bloodwoven, Prismatic, Mirestep are **fully
  covered** — the "missing" flags were this naming difference.
- **NW Hub's own typos:** `Wintermarked Frostmau` (ours correct: `Frostmaul`).
- **Set-name in NW's Equip column:** for set items NW shows the set bonus
  (`Impending Doom`, `Set of the Apocalypse`, `Duergar Weapon Set`) where we show the
  item's own equip power — matches after suffix/`(2/2)` normalization.

---

*Method: rendered NW Hub SPA (paginated 50/page × 6), parsed name/class/slot/quality/
IL/stats/equip/set per row; normalized-name diff vs gear.json with suffix-stripping and
per-variant fuzzy matching. Read-only — no `../data` changes made.*
