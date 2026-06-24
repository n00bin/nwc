# Community Feedback & Feature Requests

A log of community-suggested features, organized by where they came from. Separate from bug reports (which go to Supabase reports table).

---

## Toon Forge — Roadmap signal

### Crowd-sourced builds → "learning" optimizer (blind-spot flywheel)
**Source:** Internal — n00b, 2026-06-20 · tracked as report #142

> Idea: capture the builds people make (through the optimizer or by hand), compile them, understand why players chose what they did, and feed that back so the optimizer "learns" — turn it from a fixed engine into one that gets smarter from real usage.

**Status:** Phase 1 **BUILT** (2026-06-21) — opt-in "🧠 Help improve the optimizer" button + consent modal + anonymized capture shipped in toon-forge.html. The backend SQL in `docs/supabase/shared_builds.sql` must be run once in Supabase (creates the `shared_builds` table + `submit_shared_build` RPC) before it goes live. Phases 2–5 still unscheduled.

**Key design decision (do not skip):** do **NOT** make the optimizer imitate popular builds. Popular ≠ optimal — crowd data is biased by what players OWN, streamer copying, and fashion, and an imitation/black-box model would break the project's two core promises (deterministic output + "explain *why* every pick"). Instead use crowd builds as a **blind-spot detector**: when many players consistently slot something the optimizer would NOT pick (e.g. the Shroomwood/Scintellant rotation pieces or the Arbiter divinity slot from report #141), that flags a mechanic the engine hasn't been taught yet. The crowd tells us WHAT to model next; a human encodes it into the deterministic engine, which stays explainable. Same gap the manual slot-pin (#141) works around.

**Two hard constraints:**
- Captured data is the WHAT, never the WHY. Don't infer intent — treat "crowd diverges from optimizer" as a question to investigate, not an answer to copy. (Optional user "why" tags are a bonus, not the foundation.)
- Capture MUST be opt-in + anonymized. This is a consent/privacy requirement, NOT a Neverwinter-ToS issue (build configs typed into our own tool are fine; the ToS guardrail is about gameplay/packet manipulation). The opt-in doubles as a feature: "share your build, see how you compare to the community."

**Phased plan (each phase ships value on its own):**
1. ✅ **BUILT (2026-06-21)** — Opt-in "Share this build" → new Supabase `shared_builds` table (anonymized: class, role, slots, item names, total IL, optimizer-used flag). Reuses the existing share-link serialization + Supabase backend (same infra as reports / Add-Missing-Item). Client = `🧠 Help improve the optimizer` button + consent modal in toon-forge.html (`submitSharedBuild()` → `submit_shared_build` RPC); backend = `docs/supabase/shared_builds.sql` (run once in Supabase). Anonymization: the build's user-entered name is stripped before submit; an anonymous random `client_token` (localStorage) groups repeat shares without identifying anyone. De-dupe: unique `(client_token, build_hash)` index — the same browser can't re-submit an identical build (no bloat), but a *different* player's identical build still inserts (that's the popularity signal). The dialog also hides its Share button for a build this browser already shared.
2. ✅ **BUILT (2026-06-21)** — Community meta view ("meta tracker") — frequency stats per class+**paragon**+role/slot ("71% of DPS Warlock Hellbringers run Killing Flames"). The reward that drives opt-in. FREE for everyone (the optimizer stays the premium feature). Client = the meta tracker modal opened from the `🌐 Community ▾` dropdown (folds contribute + view) → calls the `meta_counts` RPC live each open; tabs in builder order (Race → At-Wills → Encounters → Dailies → Class Features → Feats → Gear → Companions), top-N = slot count, `✓ YOU` marks the current build's picks, companions bucketed by active-slot type (Off/Def/Util/2×Universal), gear per-slot top 3. Backend = `docs/supabase/shared_builds_meta.sql` — `meta_counts(class,paragon,role)` returns AGGREGATE COUNTS ONLY (never raw builds), with a privacy floor (no counts below 5 builds/segment, so a low-sample segment can't expose an individual build). Run once in Supabase to activate. **Cold-start thin-data fallback (2026-06-23):** when the exact paragon is below the floor, `meta_counts` now widens one level to the whole CLASS+role (every paragon) and returns a `scope` field (`'exact'|'class'|'none'`) so the client banners it honestly instead of dead-ending. Deliberately does NOT fall back to role-only/all-classes — at-wills/encounters/dailies/class-features/feats/class-gear are class-bound, so mixing classes would be fabricated meta; within one class those pools are shared across paragons, so the class view stays accurate. Re-run `shared_builds_meta.sql` to apply.
3. ⭐ **Blind-spot detector** — automated diff of frequent player picks vs optimizer picks → flagged for human review → encode the missing mechanic into the engine. The payoff; feeds the principled engine instead of replacing it.
4. *(Later)* crowd frequency as a **tie-breaker** only inside the engine's near-equal "indifference band" — never overrides the math.
5. *(Maybe never)* an actual ML model — only if data volume **and** a real outcome signal (parse/DPS) ever justify it. With a few hundred biased, unlabeled builds, literal ML would hurt, not help.

The "learning" = phases 3–4 compounding into a flywheel (more builds → more blind spots found → smarter engine → better recs → more users → more builds), with a human in the loop so explainability survives.

**Dependencies:** Supabase `shared_builds` table + opt-in UX; build serialization (exists); a diff/aggregation script for phase 3; for phase 5 only, an outcome signal that NW PS5 doesn't expose via API (would be self-reported / proxy such as total IL).

---

### Manual slot pin / lock — "optimize around this fixed piece"
**Source:** YouTube comment by @darklord123210 (2 subs), 2026-06-20

> "is there a function that will allow you to manually set a slot & you can have the optimizer work around that? ... if I know I need that shroomwood/scintelent to complete my rotation properly, I can plug it in & have the optimizer build around it ... it could be a good interim solution until those misc bonuses can be properly added into the formula.
>
> Edit: Arbiter came to mind for me. The piece that increases your divinity is MANDATORY. Maybe you can figure out a way to automatically slot in gear for specific classes. Or maybe make it a toggle, kinda like how you did the raptor."

**Status:** ACCEPTED — on the to-do list. n00b locked **Option 1 (per-slot Pin/Lock)** on 2026-06-20; not yet built (no code this pass).

**Why it's a clean add:** the optimizer already keeps each slot's incumbent unless it scores something *strictly* better (`js/optimizer-local.js:274`, `tryBest`; per-slot passes at `:970` and `:985`). A pin just means **skipping pinned slots** in those passes. Because the engine recomputes the whole character per candidate, every *other* slot auto-optimizes around the locked piece — set bonuses and stat caps included. This is the exact interim fix the commenter wants for misc set bonuses the scorer is still blind to (their Shroomwood/Scintellant rotation pieces, the Arbiter divinity piece).

**Scope (Option 1 — chosen):**
- Per-slot **lock** control in the Toon Forge builder (Raptor-style toggle / lock badge on the slot).
- `state.pinned` (set of slot labels), serialized alongside `partyPackMeta` / `gearIL` (`:3116`, `:3195`, `:3197`) and carried in share links.
- Optimizer skips pinned slots; each `SLOTS` entry (built from `:382`) needs a stable label to match the pinned set.
- Pinning a weapon locks the Main Hand / Off Hand pair together (weapons optimize as a set, `:456`).
- It's the inverse of the existing "✕ I don't have this" exclude control (`:2183`) and can reuse that result-panel plumbing.

**Deferred sub-idea (Option 2 — the commenter's "auto-slot mandatory gear per class," e.g. the Arbiter divinity piece):** build later as a *suggested-locks* layer ON TOP of Option 1. It needs a per-class/role "mandatory piece" data table (upkeep + judgment calls), so it stays deferred — the manual pin covers the need generically in the meantime.

---

### Extend "+ Add Missing Item" to artifacts, companions, mounts, etc.
**Source:** Internal — n00b, 2026-05-26 (the day AMI shipped for gear)

**Status:** ✅ **DONE — every item type now has an "Add Missing …" flow (last one shipped 2026-06-23).** The generic reconciliation backbone (Supabase RPCs, `__reportId` linkage, "Your Submissions" modal, intake-script auto-linking) covers all 10 pickable types. Each has a schema-specific form on its picker that: saves the item to localStorage so it's usable in the build immediately, files a "Missing …" report to Supabase, and participates in reconciliation (swap → canonical on *Fixed*, drop on *Won't Fix*) exactly like gear.

**Priority ranking (status):**
1. **Artifacts** — ✅ Shipped 2026-05-30 (`0af6d18`). Schema: name, IL, CR, type, rating/percent stats, on-use power, cooldown, allowed classes.
2. **Companions** — ✅ Shipped 2026-05-30 (`fc3bc73`).
3. **Mounts** — ✅ Shipped 2026-05-30 (`90e1d41`).
4. **Insignias** — ✅ Shipped 2026-05-30 (`b1f2671`).
5. **Mount Collars** — ✅ **Shipped 2026-06-23.** Schema: name, category (collarSlot: Practical/Sturdy/Supportive/Unified/Wayfaring), IL, CR, percent/rating stats, effect text. Mirrors the insignia flow; report category "Missing Collar".

Also shipped, though they'd been tagged lower-priority: **enchants** (`a806ebc`, 2026-05-29), **overloads** (`128cdf2`, 2026-05-29), **buffs/consumables** (`166bf8a`, 2026-05-30), **guild boons** (`71c76f2`, 2026-05-30). Plus the original **gear** flow (2026-05-26).

**Trigger to revisit:** nothing left to build — all 10 types are covered. New game systems (a future slot type) would each need their own form, but the backbone is reusable.

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

**Update 2026-06-19 — RESOLVED (all parts):** Report #33 was multi-part and every thread is
done. The build **optimizer** it sparked is built + in QA (`optimizer_design.md`). The
**missing gear** it flagged is resolved — Fighter's Soul Collector weapons (Ironfang +
Bulwark of Ruin) are in, all 9 classes (see `data_issues.md`). And this **weapon
upgrade-level chooser IS built**: the gear picker groups same-name items into one row with
an **"Upgrade tier:"** dropdown (`renderGearItem` → `.gear-tier-sel`, ~line 12853) listing
each IL tier with its quality/CR; selecting one sets `state.gearIL` and the stats scale to
that tier. Main Hand / Off Hand use this like any gear; artifacts use the same selector
labeled "rarities". (The original "base IL only" status note below is pre-build and
superseded.) Minor polish only: tiers are labeled `IL N — <quality/CR>`, so literal
Epic/Legendary/Mythic names show only where each tier carries a `quality` field.

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
