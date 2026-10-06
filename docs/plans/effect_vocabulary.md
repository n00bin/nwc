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

## Rules the simulator follows (added with the Warlock batch, step 2.2)

1. **A power's damage.** If a power's `fx` has any `hit` or `dot` record with no `when`, those records ARE the power's
   damage and the top-level `magnitude` is only the tooltip total for display (Hellfire Ring 450 = blast 200 + field
   50 x5). Otherwise the top-level `magnitude` is one hit when the cast ends.
2. **`when` on a power without `from`** means this power's own hits; on a mechanic, feature or feat it means any of
   your hits. `hit` fires for every damage instance, including dot ticks and channel ticks; `dotTick` fires for
   ticks only.
3. **Order at a cast.** Every gate on the cast's records is read first, then the power's own records apply, then
   triggered records fire. So a Curse Consume power sees the Curse it is about to remove.
4. **`paragon`** limits a record on a class-wide power to one paragon (Dark Helix sparks are Hellbringer only).
5. **`scalesWith` {resource, per}** on `hit`, `dot` or `stack` adds `per` for each stack of that resource the same
   cast consumed (Soul Scorch 25 per spark, Dark Helix 50 per Dark Spiral). `min` on a consume is the least it needs.
6. **Simulator-time gate keys:** `stack:<name>` (that stack is up; perStack reads the count), `buff:<name>` (that
   named buff is up), `pool:<name>Pct` (how full a bar is). Stage 1 panel keys stay as they are.
7. **New events:** `stackApplied` / `stackRemoved` (a stack is put on, or consumed or expires; `resource`),
   `buffRefreshed` (a named buff is applied again while still up; `name`). `periodic` with `name` runs only while
   that named buff is up (pets).
8. **A `buff` with no `seconds`** lasts while its gate holds. **`stacking: "stack"`** on a dot = independent stacks;
   a new one past `maxStacks` is ignored. A `stack` add with `seconds` gives each stack its own timer; `set` resets.
9. **`targets: "others"`** = only the extra enemies, never the main target (Brood of Hadar splash).
10. **`mod` targets:** `power`, `mechanic`, `buff`, or `filter` (same keys as `from`, plus `tags`), and optionally
    `record` (a record's `name`). Fields the simulator understands: `magnitude`, `magnitudePct` (adds a percent to
    the magnitude), a dotted path into the record (`scalesWith.per`), `permanent` (on a buff), `dropFx` (a list of
    record matchers to remove) and `fx` with `addFx`. A gated `mod` applies only while its gate holds.
11. **Stack caps** live on the class entry in classes.json as `fxStackCaps` (Warlock: Soul Spark 30, Soul
    Investiture 5, Curse 1, Dark Spiral 2). Extra stack names live in `docs/plans/effect_vocabulary_resources.json`.

## Added with the Wizard batch (step 2.2 / 2.3)

12. **Stack rules on the class:** `fxStacks` {name: {max, seconds, refresh}} replaces `fxStackCaps`. `seconds` is the
    default lifetime for any add without its own; `refresh: "all"` means a new stack resets every timer (Arcane
    Mastery). A `mod` with `target: {stack: <name>}` changes a rule (A Step Above Mastery: max 10, 10 s).
13. **Gates:** `gate` may be a list (all apply, fractions multiply); `invert: true` flips a gate; threshold, count and
    linear use the Stage 1 fields (`op`/`value`, `perUnit`/`maxUnits`, `at0`/`at100` or `fullAt`/`zeroAt`).
    Keys added: `pick:<setting>:<value>` (a player's pick, e.g. Chaos Magic), `otherEnemies` (enemy count - 1),
    `enemyCount`, `targetRangeFt`, `flankUptime` (0-100). A hit or dot gated by a non-toggle shape is scaled by it.
14. **`slot`:** `"spellMastery"` = only while that encounter sits in the R1 slot, `"normal"` = only outside it. In the
    slot, a power's `modes.spellMastery.magnitude` replaces its top-level magnitude.
15. **Filters** (`from`, `appliesTo`, mod `filter`): `element` and `damageType` take a list; `hasControl: true` =
    powers with any control tag; `tags` values may be lists.
16. **`every` on a power's own on-cast record** = only every Nth cast (Magic Missile's third cast); on
    `stackApplied` = once per stack applied (Snap Freeze). Cast-triggered records obey `every`, lockout and chance.
17. **Action point gains** (`resource`, pool `actionPoints`, `pctOfBar` of a 1,000 bar) fill the simulated AP bar.

## What is deliberately left out

- Healing and survival timelines (PT2-16: the search is damage-focused). `heal` and `shield` records are
  migrated so the data is complete, but the damage simulator ignores them.
- Party value (PT2-15 revised). `buff` records with `scope: party` count for the player only.
- Prose-only effects that name no number (`stealthEffect` strings). They are listed by the migration as
  unmapped for review, never guessed.
