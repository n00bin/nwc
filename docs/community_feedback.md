# Community Feedback & Feature Requests

A log of community-suggested features, organized by where they came from. Separate from bug reports (which go to Supabase reports table).

---

## Toon Forge — Roadmap signal

### Extend "+ Add Missing Item" to artifacts, companions, mounts, etc.
**Source:** Internal — n00b, 2026-05-26 (the day AMI shipped for gear)

**Status:** Deferred. The Add Missing Item modal currently exists only on the gear picker. The reconciliation backbone (Supabase RPCs, `__reportId` linkage, "Your Submissions" modal, intake-script auto-linking) is generic — extending to other types is mostly schema-specific form work, not re-architect.

**Priority ranking (when this gets picked up):**
1. **Artifacts** — simplest schema (name, IL, on-use power, equip power, stats); new ones each module. ~1-2 hr build.
2. **Companions** — more fields (slot, rarity, summoned/active stats, enhancement). High community value. ~3-4 hr.
3. **Mounts** — most complex (combat power, equip power, insignia slots). ~3-4 hr.
4. **Insignias** — tied to mount set releases.
5. **Mount Collars** — small catalog, rare additions.

Lower-priority types (probably skip unless requested): enchants, boons, buffs/consumables — small catalogs, change rarely.

**Trigger to revisit:** when a community comment or report asks "can I add a missing X?" where X is one of the types above. Start with whatever was asked.

### "Best Build" min/max optimizer
**Source:** YouTube comment by @MarkLewis (27 subs), 2026-05-25

> "If it doesn't have it... Needs a Min/Max Optimize 'Best Build' feature, where we put in all our gear, artifacts, etc. and it tells us all the best items to slot, and where. Looks helpful."

**Status:** Aligns with the project's stated mission goal #3 (auto-optimizer). Not yet implemented. The current Toon Forge lets you BUILD a character manually; this request is for the engine to PICK the best loadout from owned items.

**Scope:**
- Input: player's owned gear/artifacts/enchants/companions/mounts + role goal (DPS/Tank/Healer)
- Output: best loadout for the chosen role + reasoning ("why this gear")
- Must respect slot rules, set bonuses, unique-equip rules, class restrictions

**Dependencies:**
- Owned-gear data structure (player profile)
- Role objective function (e.g. DPS = max effective damage; Tank = max effective HP × mitigation; Healer = max effective heal × OOH)
- Search/optimization algorithm (greedy with backtracking, or branch-and-bound)

---

### Weapon upgrade-level chooser
**Source:** Toon Forge correction-editor submission, Report #33, 2026-05-26

> "Upgrade Level for Main Hand and Off Hand/Grimoire needs to have a choice (Epic, Legendary, Mythic, etc.)."

**Status:** Concrete UI request. Currently Main Hand and Off Hand items display at their base IL only; the request is to expose a rarity/upgrade-level selector similar to how companion powers already have one.

**Scope:**
- Add a rarity/upgrade-level dropdown to the Main Hand and Off Hand pickers in Toon Forge
- Stats should scale based on the chosen rarity (similar to how companion power scaling already works)
- Need a stat-scaling table per rarity tier for weapons (research input from NW Hub or in-game)

---

### AI build-improvement assistant
**Source:** YouTube comment by @JHON_AMORIM (612 subs), 2026-05-25

> "I'll give you a golden tip: for your project, after we finalize the build based on our characters or other areas of interest, integrate an AI that will help the user improve their current build by giving tips on better item combinations to increase damage, healing, defense, etc."

**Status:** Forward-looking. Builds on top of the min/max optimizer — once we have the engine that can score a loadout, an AI layer can generate plain-English "swap X for Y because Z" suggestions.

**Scope:**
- Input: a built character (gear locked in)
- Output: suggested swaps with explained tradeoffs ("Swap your Ring of Power for Coldsilver Coil of Wrath — +1,300 CR and you'll hit Critical Strike cap")

**Dependencies:**
- The optimizer engine (above)
- Access to a language model API (Claude/OpenAI) OR a deterministic suggestion engine that just compares stat deltas

---

## How to log future feedback

Drop new entries above this line in reverse-chronological order (newest at top of the relevant section). Include:
- Source (YouTube comment / Reddit / Discord / direct message)
- Author + handle if known
- Date
- Verbatim quote
- Short scope + dependency notes from the dev side
