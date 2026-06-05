# Companion Power Procs — Census & Engine Visibility (2026-06-04)

72 of 120 companion `procEffect`s have no structured `statEffects` (prose
only). Investigation found most candidates ALREADY carry structured values
in `stats[]` — the gap was the **engine's damage-bucket routing table**, not
missing data. Fixes shipped + honest categorization of the rest.

## Fixed now (engine routing, toon-forge-engine.js DAMAGE_BUCKET_MAP)
| Stat name in data | Routed to | Example companions |
|---|---|---|
| "Encounter Damage" | slot.encounter | Volcanic Galeb Duhr (3.75% base, scales w/ rarity) |
| "Daily Damage" | slot.daily | Lava Galeb Duhr |
| "At Will Damage Range" | slot.atwill | Hunting Hawk (max-range value; fits ranged endgame) |
| "Damage Vs Strong" | generic | The Bigger They Are / Minsc (routed earlier today) |
| (data fix) Unseelie Cruelty stat → "At Will Dmg Bonus" | slot.atwill | proc text: Disabled/Held bonus "also applies vs bosses" → unconditional for boss sim. (Delusional Insight stays Disabled-only and unrouted on purpose.) |

Verified live: slotting Lava/Volcanic Galeb Duhr moves slot.daily/encounter
5 → 14 on the BiS warlock; Unseelie pushes slot.atwill +13.5.

## Left unrouted ON PURPOSE — situational vs-enemy-type damage
"Damage Vs Dragons" (Dragon's Bane), Gynion/Kabal/Avernus/fey minion
bonuses, "Damage Vs Not Facing" (Netherese Warlock), "At Will Damage Vs
Disabled" (Delusional). Crediting them at 100% would inflate the general
boss sim; same stance as gear vs-enemy bonuses (0 uptime in general sim).
Future: a content-zone/enemy-type sim setting could activate them.

## Awaiting engine layers (do NOT structure as stats)
- **~22 magnitude damage procs** (bleeds/poisons/strikes/AoE: Hank's Aim,
  Black Scorpion, Xuna, Spined Devil, Elminster's Chain Lightning, …) —
  this is the BIG remaining companion value gap. Scaffolding exists:
  `data/companion_power_proc_profiles.json` + `combat_proc_overrides.json`
  (currently unconsumed by the engine). Needs a proc-damage layer that
  converts magnitude × trigger-rate × chance into expected damage.
- **~14 heal/shield/stamina procs** (Vampire's Kiss, Baby Bulette, Angel's
  Insight, …) — heal-sim layer.
- **~7 control procs** (stun/daze/root/interrupt) — no control-value model.
- **~8 currency/drop-rate passives** (Chultan Hunter, Vistani, …) —
  non-combat; correctly invisible to the optimizer forever.

## Needs in-game verification before structuring (do not guess)
- ~~[247] "Battiri's Wisdom"~~ RESOLVED 2026-06-04: n00b's AH-inspect
  screenshots proved it was a duplicate of Batiri's Wisdom (164) captured
  at Mythic — 8.25@IL550 × 900/550 = 13.5 exactly. Orphan deleted. Bonus:
  empirically confirms linear IL scaling for companion values.
- ~~[126] Repentant Cultist's Discipline~~ RESOLVED 2026-06-04: verified at
  two rarities (1.5%@IL150 AH inspect + 3.8%@IL375 archive screenshot, same
  linear curve); structured as a conditional Daily Damage statEffect.
- [20] Celestial Lion (stacking radiant damage, no stated stack cap) — still open.

## UPDATE — proc-damage layer SHIPPED (2026-06-04, same day)
The "~22 magnitude damage procs" above are now modeled. `PROC_DAMAGE`
config + `computeCompanionProcMagPerHit()` in toon-forge.html convert
structured `procEffect.procDamage` fields (added by
`scripts/comp_proc_damage.py`) into expected bonus magnitude per player
hit: trigger rate (crit/noncrit rates derive from the build's actual
crit chance) × chance, capped by ICD, × magnitude (base-rarity values
scale via compRarityScale; {mag} placeholders resolve through
effectScaling per rarity). Folded multiplicatively into
computeDpsExpectedDamage — sim, advisor, and optimizer all see it.
Verified vs hand-calcs and community meta: Xuna +14.1%, Black Scorpion
+13.5%, Hank +10.1%, Elminster +9.0%, Spined Devil +4.5% on the BiS
warlock. Still open: heal/control procs, [38] stack explosion, [231]
chain bolt (~1%), and the ~430 skipped GEAR procs (same procDamage
field design can extend to them).
