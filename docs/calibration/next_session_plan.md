# Next calibration session — prepared 2026-07-05 (post overnight marathon)

## State going in
Erik (tank) and Lia (healer): every rating exact; every percent exact EXCEPT the
twin −0.4 on Lia's Crit Strike and Awareness totals (the two Soulweaver Forte-share
stats). Trust ledger has full session records.

## Target 1: the twin −0.4 (CS + Awareness percents)
Facts established:
- Share model `25% of Forte total` fits all three probe states within reading noise,
  but a CONSTANT +0.4 residual sits on both stats in every state.
- Candidates: (a) share is 25% of a Forte base ~1.6 higher than displayed
  (rounding/uncapped internals), (b) twin missing +0.4 atoms, (c) share slightly
  above 25% (25.6% fits standing but poorly at probe states).

Probe design (needs ~5 min in game, read PERCENTS each time):
1. Baseline standing: Forte %, CS %, Awareness % (fresh, after re-slotting everything).
2. Unslot the UTILITY enchant (Celestial Jade — kills its +3% CS gemSynergy via the
   Halo, does NOT touch Forte): read CS %. Confirms the non-Forte CS atoms cleanly.
3. Swap active companion Fawn out (kills its +4.5% CS): read CS %. Another clean atom check.
4. Big Forte swing WITHOUT breaking any 4-set: unslot BOTH Barbed Dominance insignias
   (Gravehound slot 2 + Dragon Chicken slot 1 — different mounts, neither is the 4th
   slot, so no insignia-bonus changes... NOTE: pulling ANY insignia disables that
   mount's 4-piece bonus. Gravehound + Dragon Chicken both carry Mender's Covenant —
   pulling one from EACH kills BOTH Mender's instances (defensive stats will move:
   fine, we know Mender's exactly). CD (M3/M4) untouched — that's what matters.
   ΔForte rating = 2×1,125 + 2×600 CR = 3,450 → expect ΔCS% = Δforte_total × share.
   With clean 0.1-precision readings at a 3.4k swing, share resolves to ±0.01.

## Target 2: leftover boon point (game 121 vs build 120)
Agent diff of the tree screenshot may already close this — check ledger/session
notes. If not: boon-for-boon walk like Erik's.

## Target 3 (backlog, non-blocking)
- Erik: Recharge Speed % never walked (tool expects CHA-fed + gear riders).
- Lia's saved build: user still needs to adopt Barbute + abilities (Desktop link has both).
- The ±0.4 CS/Awareness fix may slightly move other Forte-share classes — re-verify
  Erik's Justicar shares (Defense 50%) after any share-model change.
- Publish news: staging doc is heavily loaded (two calibration marathons' worth).

## Method reminders (hard-won this session)
- Compare RATINGS when a stat may be overcapped (rating-cap pins the % contribution).
- TIL shifts move every contribution: always read TIL alongside probe values.
- Stacking rules are PER-BONUS: CD = shared 5 standing; Mender's = 1,500+750 dim;
  GS/ICR = explicit ladders. A/B before assuming.
- When one stat is high and another low by a same-item-sized amount: the worn item
  is probably a different item than the build says (Barbute lesson).
- Ability inputs = the AT-REST sheet (campfire inflates all six).
