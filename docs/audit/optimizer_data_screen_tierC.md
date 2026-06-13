# OPT-G3 Tier C — Items needing in-game screenshots (n00b)

> Generated 2026-06-10 after the C3 dedup pass. These are the conflicts no
> archive screenshot or community source can settle — one in-game tooltip
> capture each closes them. Drop captures in `docs/audit/_up/<class>-gear/`
> using the `Item Name_IL###.png` convention and say "process tier C".

## Duplicate conflicts (the 2 survivors of 59)
1. **Aegis of the Condemned — IL 4800 (Off Hand)** — ids 465 vs 5331 disagree
   on whether the item carries Awareness (3 stats vs 2). One capture settles it.
2. **Cosmic Band of Deflection — IL 2400 (Ring)** — ids 252 vs 775 differ only
   in the Survivor's Resilience description (max bonus at 25% HP or not).

## Class-variant tangles (guard preserved these; need per-class captures)
3. **Black Ice family (IL 512): Armor, Boots, Gloves, Mask** — captures show
   different stat distributions per class; no DB copy matches any capture
   exactly. Need one capture per class that can wear each piece.
4. **Hammerstone family (IL 352): Gloves, Boots, Mask** — the Wizard captures
   match NO database copy (a missing Wizard-variant record); Warlock Mask
   capture matches neither existing copy.
5. **Boots of the Thayan Servitor (IL 800)** — two distinct stat layouts seen
   (bard/rogue vs ranger captures); no copy matches either.
6. **Astral Raider's Jackboots (IL 2200)** — id 3240 now carries the
   tooltip-verified stats; ids 2769/3984 were preserved by the class-variant
   guard but contradict a 4-class-identical tooltip — likely true dupes.
   One Cleric or Ranger capture confirms whether variants exist.

## Low priority
7. **Masterwork II/III "Alacrity" set bonus text** — every capture had the set
   at 0/2 so the bonus text never rendered. One capture with 2 pieces equipped
   verifies the stored description.

## C1 budget suspects with no archive capture and no community trace (added 2026-06-12)
The researcher found ZERO community documentation for these — suspicious in itself.
One tooltip capture each settles whether the stat budget is real:
8. **Captain's Girdle + Captain's Pendant (IL 1400)** — inflated +143-154%
9. **Wrathful Waistband + Wrathful Strangler (IL 1400)** — inflated +49-68%
10. **Dragonsteel Spikes (IL 1900)** — inflated +38%
11. **Cuirass of the Black Flame + Bulwark of the Eternal Zulkirate (IL 4300)** — inflated +33-37% (plausible raid premium, unproven)
12. **Aegis of the Condemned — Ascendant / — Maximum (IL 3400)** — inflated +35-48%
13. **The Thorned Edict (IL 3450), Scream Seeker (IL 3400), Smoldering Ring (IL 2350)** — DEFLATED (missing-stat suspects)
14. **Sabatons of the Flayed Legion / Shrouds of the Ashen Chant / Greaves of the Red Bastion (IL 4100)** — DEFLATED; already in data_issues as missing-stat suspects
15. **Ring of Impenetrability +1..+5** — structure is sane (flat 1,701-1,827 x2 + unstructured invuln proc) but the flat values are community-unverifiable
16. **Shard of Orcus' Wand** — community sources say IL 150; our entry says IL 250. Verify which.

## C2 leftovers needing SET-PANEL captures or name checks (added 2026-06-12)
17. **Blaspheme Cleaver + Knife (IL 1900)** — the 7,500 Power/Defense/OOH role-proc set bonus lives in the right-side set panel, cropped in every capture. One set-panel shot verifies it.
18. **Dusk Raid/Assault set (IL 638)** — 5,000 Max HP 2-pc bonus; set panel cropped in all captures.
19. **The Legion Guard's weapons** — amount corrected to the sourced 1,000; one set-panel capture confirms it in-game.
20. **"Cerebral/Oceans' Warden Sigils" + "Abyss Striker's Mauler Wristguards"** — ZERO community trace under these names; researcher suspects name drift (e.g. "Abyss CONQUEROR's" exists in Mod-26 patch notes). Check in-game names; 'Enervated Parry'/'Skirmisher's Ferocity' amounts unverifiable until then.

## Full site audit (2026-06-13) — tooltip-dependent items
21. **Captain's Girdle + Pendant (589/590, IL 1400)** — combinedRating already fixed to the 0.9×IL convention (1260); but the ratingStats look inflated (Critical Strike 3060 == the old combinedRating — likely entered twice). Verify the real stat block.
22. **Aegis of the Condemned cluster (465/480/482/484/5328/5329/5330/5331 + 1807–1811)** — a duplicate tangle: 5328/5329 carry Critical Strike where the 2-stat series uses Outgoing Healing; 5331 is an incomplete ghost of 465; 465 (IL 4800) has IL-3400 stats copied unscaled. One tooltip per real tier settles which entries are canonical so the ghosts can be deleted.
23. **Wrathful Waistband (258) + Wrathful Strangler (238, IL 1400)** — ratingStats inflated vs the IL-1400 belt/neck norm, AND combinedRating (1060) sits below the 0.9×IL convention — both anomalous. Verify.
24. **~26 conditional-proc items scored at FULL value** — no uptimeOverride/procModel on big procs: Warden Sigils (Enervated Parry 10–13k), Abyss Striker Wristguards (10k), Flarefiber/Starwoven pants/shirts (7500 @ Stamina>75%), Faern Elendar rings (8000), Mod-28 Infernal/Forged/Divine helms/boots/bracers (5000 Power). Each needs a real uptime estimate before it stops over-ranking; batch-set uptimeOverride after verifying conditions.

