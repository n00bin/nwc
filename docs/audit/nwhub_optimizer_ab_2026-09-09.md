# NW Hub ILS-VND vs Toon Forge optimizer - A/B (2026-09-09)

n00b ran nw-hub.com's Build Optimizer (ILS-VND, ~400M candidates, 4396.5 s, 500 restarts,
perturbation 4, 2-swap + set-swap) on a Wizard. Export: nw-hub-optimized-new-profile-2026-09-09.json.
Scope of their run: gear, enchants, artifacts, stable companions. No paragon, powers, mount,
summoned companion, overloads, kits, consumables or boons in the profile.

Imported into Toon Forge (Wizard / Arcanist assumed, Dragonborn, their ability scores, CA uptime
80% to match their default, dungeon). Everything their run did not touch was LOCKED EMPTY for our
runs (kits, overloads, summoned, companion gear/enhancement, mounts, collars, consumables) so the
scope matches. Ability optimization off. Quick mode. Harness: scratchpad nwhub_ab.js.

| | score (our model) | evals | time |
|---|---|---|---|
| NW Hub loadout, as exported | 396,765 | 400,000,000 | 73 min |
| Our optimizer started FROM their loadout | 516,160 (+30%) | 13,447 | 29 s |
| Our optimizer from a bare Wizard | 487,970 (+23% vs theirs) | 18,075 | 33 s |

Findings
- Under OUR model their loadout is far from optimal: the biggest moves are Shroomwood Amulet +1 /
  Scintillant Sash +1 (IL 1800 set pieces) -> Voidbound Necklace / Belt, Doomweaver weapons ->
  Wintermarked set, Red Slaad / Xaryxian / Alpha Compy -> Batiri Runt / Volcanic Galeb Duhr /
  Neverwinter Knight, Bone Filligree -> Garnet utility. Their TIL under our honest count: 98,710.
- The two MODELS disagree far more than the two SEARCHES. 400M evaluations of a different objective
  do not transfer. Their score for our loadout is unknown (no import path on their side).
- Our own search does leave value on the table: starting from their solution and climbing beats our
  from-bare climb by 5.8% (516k vs 488k). That is the greedy local-optimum gap -> restarts /
  perturbation / set-swap moves are worth adding (their ILS-VND idea, not their 73 minutes).
- Two optimizer bugs fixed while building the harness (js/optimizer-local.js, local + premium hardlink,
  Vercel NOT redeployed): kit SEED and kit BACKFILL both ignored 'kit:<slot>' locks; buff slots now
  carry 'buff:<group>' lockKeys.
- Follow-up: the optimizer's Belt Item group is still ONE pick; the builder now has three belt slots.
- Baby Deepcrow's Presence (companion) is missing from our data.
