# Community Feedback & Feature Requests

A log of community-suggested features, organized by where they came from. Separate from bug reports (which go to Supabase reports table).

---

## Toon Forge — Roadmap signal

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
