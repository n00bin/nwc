# Effect vocabulary (POWER-TAGS-2 step 2.1)

Written 2026-10-06 from PT2-10 ("one small effect vocabulary, the data migrated into it, a validator rejects
anything outside it"). The tag-driven simulator (step 2.3) reads ONLY this vocabulary. Everything the power tag
review stored in free-form blocks (`resource`, `buff`, `debuff`, `procDamage`, `procHeal`, `featAdded`,
`powerMods`, `cooldownRefund`, `dot`, `shield`, `selfHeal`, `controlModel`, `comboModel`, `hitModel`, `window`,
`mechanicMods`, `rechargeBuff`, `magnitudeConditional`, `charge`, `channel`, `stealthEffect`) is migrated into it
by `scripts/_pt2_migration_b.py` (step 2.2). The old blocks stay in place as the human record; only `fx` is read.

## Where it lives

Every power, mechanic, class feature, feat and General skill may carry `fx`: an ordered list of effect records.
A record never repeats what the power's own top-level fields already say (magnitude, castSeconds,
cooldownSeconds, actionPointCost, tags). Those stay where they are and the simulator reads them directly.

```json
"fx": [
  { "kind": "stack", "resource": "Chill", "op": "add", "amount": 1, "when": { "on": "hit" } },
  { "kind": "control", "control": "stun", "seconds": 1, "perStack": { "resource": "Arcane Mastery", "seconds": 0.2 } }
]
```

## Common fields (any record)

| Field | Meaning |
|---|---|
| `kind` | one of the twelve kinds below (required) |
| `when` | the trigger; omitted = on the owner's own cast (powers) or always (features, feats) |
| `gate` | a PT2-2 gate (`toggle`, `linear`, `perStack`, `dutyCycle`, `threshold`, `count`) that scales the record |
| `requiresFeat` / `requiresFeature` / `requiresSlotted` | the record only exists with that feat / class feature / those powers slotted |
| `provisional` | `true` when a number in the record is assumed; feeds the PT2-14 confidence line |
| `missing` | list of field names whose real value is unknown; they count as zero (PT2-14) |
| `note` | plain text for people; never read by code |

## Triggers (`when`)

`{ "on": <event>, "from": <filter>, "chance": <0-100>, "icdSeconds": <n>, "every": <n> }`

| `on` | fires |
|---|---|
| `cast` | when a power is cast (default for powers) |
| `hit` | per damage hit (each tick of a channel or each hit of a combo) |
| `crit` | per critical hit |
| `dotTick` | per damage-over-time tick |
| `kill` | when a target dies |
| `combatStart` | once at the pull |
| `periodic` | every `every` seconds while the owner is active |
| `stackSpent` | when a resource is spent (`resource`, and `every` = per N spent) |
| `stackReached` | when a resource reaches `amount` |
| `takeHit` / `block` / `deflect` / `dodge` | defensive events |
| `buffApplied` | when another named effect starts (`name`) |

`from` filters the source: `{ "type": "atWill"|"encounter"|"daily"|"any", "names": [...], "element": "...",
"hasControl": true, "slot": "spellMastery" }`. `chance` is a percent, scored at its expected value (PT2-13).
`icdSeconds` is the lockout.

## The twelve kinds

| `kind` | Fields | Example |
|---|---|---|
| `hit` | `magnitude`, `count`, `targets` (`single`/`area`/`mixed` + `areaShare`), `radius`, `damageType`, `element`, `delaySeconds` | Storm Pillar's pillar: 50 x 3, area |
| `dot` | `magnitude` (total) or `perTick`, `ticks`, `seconds`, `stacking` (`refresh`/`stack`/`none`), `maxStacks`, `damageType`, `element` | Ray of Enfeeblement: 520 over 10 s |
| `buff` | `stats` {name: amount}, `scope` (`self`/`party`/`selfPlusAllies`), `seconds`, `appliesTo` (filter like `from`), `stacks`, `maxStacks`, `radius`, `name` | Arcane Empowerment: encounters +20% for 10 s |
| `debuff` | `stats` on the enemy {`Damage Taken`, `Outgoing Damage`, `Damage Resistance`, ...}, `personal` (only your damage), `appliesTo`, `seconds`, `maxStacks`, `name` | Arcane Conduit: +15% taken from your arcane powers, 5 s |
| `stack` | `resource`, `op` (`add`/`refresh`/`consume`/`set`), `amount`, `target` (`self`/`enemy`), `max`, `seconds` (stack lifetime) | Ice Knife: 3 Chill on the target |
| `resource` | `pool` (`actionPoints`/`stamina`/`divinity`/`rage`/`performance`/`soulweave`/`vengeance`), `op` (`gain`/`spend`/`regenPct`/`set`), `amount`, `pctOfBar` | Spell Twisting: 1% of the AP bar per stack spent |
| `cooldown` | `targets` (filter like `from`, or `self`), `op` (`reduce`/`reset`/`rechargePct`), `seconds`, `pct` | Soul Spark Recovery: -1 s per 6 sparks spent |
| `proc` | `effects`: nested records fired by `when` (chance, lockout) | Storm Spell: 20% on crit -> hit 120 lightning |
| `control` | `control` (`stun`/`hold`/`root`/`daze`/`slow`/`knockdown`/`push`/`pull`/`freeze`/...), `seconds`, `perStack` {resource, seconds}, `targets` | Steal Time: slow 4 s, stun 1 s, +0.2 s per Arcane Mastery |
| `heal` | `magnitude`, `pctMaxHp`, `pctOfDamage` (lifesteal), `scope`, `seconds`, `perTick` | Bloodletter: heal for 100% of damage dealt |
| `shield` | `magnitude`, `pctMaxHp`, `pctOfHealed`, `scope`, `seconds` | Shield: 30% of Maximum Hit Points |
| `mod` | changes another power or mechanic: `target` {`power` / `mechanic` / `filter`}, `field`, `op` (`set`/`add`/`mult`), `value`, or `addFx` (records appended to the target) | Iced Lightning: x1.3 magnitude on five named powers vs chilled targets |

`mod` is how feats and features change powers (`featAdded.powerMods`, `mechanicMods`) without editing the
power itself, so a feat can be picked or dropped and the power returns to its tooltip base.

## Validator rules (`build-data.py`)

1. Every `fx` record has a known `kind` and only the fields listed for it (plus the common fields).
2. Every `when.on` is a known event; every `resource` / `pool` name is in the resource list below.
3. Numbers are numbers; `missing` names fields that are absent or null.
4. A `mod` target must resolve to a power or mechanic that exists for that class and paragon.
5. A bad record FAILS the build loudly with the class, owner and record index.

## Resources (stack and pool names)

Stacks: `Chill`, `Arcane Mastery`, `Smolder`, `Soul Spark`, `Soul Investiture`, `Curse`, `Spell Twisting`,
`Stealth`, `Sly Flourish`, `Vengeance`, plus any name listed in `docs/plans/effect_vocabulary_resources.json`
(added when a class needs one, never invented by code).
Pools: `actionPoints`, `stamina`, `divinity`, `rage`, `performance`, `soulweave`, `vengeance`, `stealthMeter`.

## What is deliberately left out

- Healing and survival timelines (PT2-16: the search is damage-focused). `heal` and `shield` records are
  migrated so the data is complete, but the damage simulator ignores them.
- Party value (PT2-15 revised). `buff` records with `scope: party` count for the player only.
- Prose-only effects that name no number (`stealthEffect` strings). They are listed by the migration as
  unmapped for review, never guessed.
