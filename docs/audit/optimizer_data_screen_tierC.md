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
