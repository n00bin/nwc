# CLAUDE.md — Neverwinter Compendium Website

## What This Is
A static website (GitHub Pages) for Neverwinter (PS5) players. It's a reference compendium with searchable databases for companions, mounts, artifacts, consumables, and game mechanics. Hosted at GitHub Pages, auto-deployed on push to `main`.

## Team
- **n00b (N00binHard)** — project owner, provides in-game screenshots and data, verifies values
- **Claude (NWCB-Dev)** — implements features, adds data, fixes bugs, pushes code

## Workflow
1. n00b provides in-game screenshots or info
2. Claude extracts data from screenshots (stats, power names, scaling values, slot types)
3. Claude edits source JSON in `../data/`, runs `build-data.py`, updates website JS
4. Claude commits and pushes — GitHub Actions deploys to Pages automatically

---

## Site Structure

### Pages (10)
| File | Purpose |
|------|---------|
| `index.html` | Home page with collapsible news feed |
| `companions.html` | Companion database (Lookup, Summoned Buffs, Enhancements, Damage tabs) |
| `mounts.html` | Mount database (Lookup, Ranking, Insignia Calculator) |
| `artifacts.html` | Artifact reference with icons |
| `consumables.html` | Buffs/consumables with duration filters |
| `mekaniks.html` | Game mechanics and stat explanations |
| `professions.html` | Crafting/profession guide |
| `campaign-boosters.html` | Companions and items that boost campaign currencies |
| `patchnotes.html` | Auto-updated patch notes from Arc Games API |
| `reports.html` | Community bug reports (Supabase backend) |

### JavaScript
| File | Purpose |
|------|---------|
| `js/shared.js` | Nav, footer, utility functions (renderNav, buildLookup, escapeHtml, etc.) |
| `js/companions-page.js` | Companion rendering, rarity scaling, proc effect scaling |
| `js/mounts-page.js` | Mount rendering, insignia calculator, ranking |
| `js/artifacts-page.js` | Artifact data and rendering (data embedded in file) |
| `js/consumables-page.js` | Consumables filtering and rendering |
| `js/reports-page.js` | Supabase integration for reports, voting, admin, replies |

### Data Pipeline
Source JSON lives in `../data/` (parent repo). Build pipeline:
```
../data/*.json  →  build-data.py  →  data/*.js (browser globals)
```

Key source files:
- `mounts.json`, `mount_combat_powers.json`, `mount_equip_powers.json`
- `mount_insignia_bonuses.json`, `mount_insignias.json`
- `companions.json`, `companion_powers.json`, `companion_enhancements.json`
- `buffs.json`

**Always run `python3 build-data.py` after editing source JSON.**

The `data/news.js` and `data/patch-notes-var.js` are edited directly (not built from source JSON).

---

## Companion Data Schema
```json
// companions.json entry
{
  "id": 260,
  "name": "Soradiel",
  "enhancementRef": 16,    // links to companion_enhancements.json id (null = none)
  "powerRef": 249,          // links to companion_powers.json id
  "notes": "...",
  "source": "..."
}

// companion_powers.json entry
{
  "id": 249,
  "slot": ["Defense"],           // Offense, Defense, Utility (can be multiple)
  "name": "Divine Judgement",
  "item_level": 75,              // base rarity IL (determines which rarity buttons show)
  "stats": [
    {"stat": "CriticalStrike", "value": 0.38},
    {"stat": "CriticalSeverity", "value": 0.38}
  ],
  "combinedRating": 75,
  "notes": "..."
}
```

### Scaling Tables (in companions-page.js)
```
SINGLE_STAT:  75→0.75  150→1.50  250→2.50  375→3.75  550→5.50  750→7.50  900→9.00
DOUBLE_STAT:  75→0.38  150→0.75  250→1.25  375→1.88  550→2.75  750→3.75  900→4.50
MAX_HP:       75→1500  150→3000  250→5000  375→7500  550→11000 750→15000 900→18000
```

- 1 percent stat = SINGLE_STAT_SCALE
- 2 percent stats = DOUBLE_STAT_SCALE
- MaximumHitPoints always uses MAX_HP_SCALE

### Proc Effect Scaling (effectScaling)
For proc effects that change with rarity, use `effectScaling` in procEffect:
```json
{
  "procEffect": {
    "trigger": "Daily use",
    "chance": 50,
    "effect": "Heal for {heal}% of Maximum Hit Points",
    "effectScaling": {
      "heal": { "75": 2.5, "150": 5.0, "250": 8.3, "375": 12.5, "550": 18.3, "750": 25.0, "900": 30.0 }
    }
  }
}
```
Placeholders `{key}` in the effect text get replaced with the value for the selected rarity.

---

## Mount Data Schema
```json
// mounts.json entry
{
  "id": 272,
  "name": "Cactus the Hedgehog",
  "combatRef": 88,       // links to mount_combat_powers.json
  "equipRef": 57,        // links to mount_equip_powers.json
  "bonusRef": 0,         // links to mount_insignia_bonuses.json (0 = none)
  "insigniaSlots": [
    {"allowed": ["Regal"]},
    {"allowed": ["Barbed"]},
    {"allowed": ["*"]},                          // universal
    {"allowed": ["*"], "preferred": "Illuminated"} // universal with preferred
  ],
  "notes": "...",
  "source": ""
}
```

Insignia types: Crescent, Barbed, Illuminated, Enlightened, Regal, `*` (universal)

---

## Supabase Backend (Reports System)

**URL:** `https://ynrfmmccarrpqjdrpvqn.supabase.co`
**Anon Key:** `sb_publishable_RSK4LJnJ4-HQDudcRq3gRw_WJI5WIUw`
**Admin Password:** stored in `admin_config` table

### Tables
- `reports` — user-submitted bug reports (title, description, category, status, upvotes, image_url, admin_notes)
- `report_replies` — community replies on reports with admin notes (report_id, message, image_url)
- `admin_config` — key/value store for admin password

### Views
- `reports_public` — read-only view of reports
- `report_replies_public` — read-only view of replies

### RPCs
- `upvote_report(report_id, voter_hash)` — upvote with fingerprint dedup
- `update_report_status(report_id, new_status, admin_pass)` — admin status change
- `delete_report(report_id, admin_pass)` — admin delete
- `update_report_note(report_id, note_text, admin_pass)` — admin note on report
- `submit_report_reply(p_report_id, p_message, p_image_url)` — community reply (only works when admin_notes exists)
- `delete_report_reply(reply_id, admin_pass)` — admin delete reply

### Report Statuses
New → Confirmed → In Progress → Fixed / Won't Fix

### Reply Rules
- Replies only available on reports with an admin note
- Reply form hidden when report is Fixed or Won't Fix
- Image uploads go to `report-images` storage bucket (5MB max)

---

## Deployment
- **GitHub Actions** (`deploy.yml`): pushes to `main` → auto-deploys to GitHub Pages
- **Patch Notes** (`update-patch-notes.yml`): daily cron fetches from Arc Games API

---

## News Workflow

### Staging
As changes are made during a session, add them to `docs/news_staging.md` under the current week. Group by Features, Data Additions, and Bug Fixes.

### Publishing
When n00b says "publish news" or "update news", take all staged entries from `docs/news_staging.md` and:
1. Add a new entry at the top of `data/news.js` (newest first)
2. Use the existing HTML format (tags, ul/li lists)
3. Clear the published items from the staging doc
4. `news.js` is edited directly — it is NOT built from source JSON

### News Display
- Latest entry is expanded by default, older ones are collapsed
- Click title to toggle open/close
- Tags: Feature (blue), Fix (green), Data (yellow)

---

## Common Tasks

### Adding a New Companion
1. Check if the enhancement already exists in `../data/companion_enhancements.json`
2. Add power entry to `../data/companion_powers.json` (next available id)
   - Set `item_level` to the companion's base rarity IL (75=Common, 150=Uncommon, etc.)
   - For stat values, store the value at the base rarity IL
   - 1 percent stat → single stat scaling, 2 percent stats → double stat scaling
3. Add companion entry to `../data/companions.json` (next available id)
   - `enhancementRef` → enhancement id (or `null` if none)
   - `powerRef` → the power id you just created
4. Run `python3 build-data.py`
5. Commit both `data/companion-powers.js` and `data/companions.js`

### Adding a New Mount
1. Check if combat power and equip power already exist
2. Add equip power to `../data/mount_equip_powers.json` (if new)
3. Add combat power to `../data/mount_combat_powers.json` (if new)
4. Add mount to `../data/mounts.json` with insignia slot layout
5. Run `python3 build-data.py`
6. Commit all changed `data/*.js` files

### Adding Proc Effect Scaling
For companion powers where proc values change per rarity:
1. Get values at 2+ rarities from in-game
2. Determine multiplier (check against single stat scale: value / SINGLE_STAT[IL])
3. Calculate all 7 rarity values
4. Add `effectScaling` to the power's `procEffect` with `{placeholder}` in effect text
5. The rendering code handles interpolation automatically

### Fixing a Report
1. Make the data/code fix
2. Run `build-data.py`
3. Commit and push
4. Mark report status via API:
```bash
curl -s "https://ynrfmmccarrpqjdrpvqn.supabase.co/rest/v1/rpc/update_report_status" \
  -H "apikey: sb_publishable_RSK4LJnJ4-HQDudcRq3gRw_WJI5WIUw" \
  -H "Authorization: Bearer sb_publishable_RSK4LJnJ4-HQDudcRq3gRw_WJI5WIUw" \
  -H "Content-Type: application/json" \
  -d '{"report_id": ID, "new_status": "Fixed", "admin_pass": "PASSWORD"}'
```
5. Update `docs/data_issues.md` if the issue was tracked there

### Checking Live Reports
```bash
curl -s "https://ynrfmmccarrpqjdrpvqn.supabase.co/rest/v1/reports_public?select=*&order=created_at.desc" \
  -H "apikey: sb_publishable_RSK4LJnJ4-HQDudcRq3gRw_WJI5WIUw" \
  -H "Authorization: Bearer sb_publishable_RSK4LJnJ4-HQDudcRq3gRw_WJI5WIUw"
```

---

## Rules and Conventions

### Do
- Always run `python3 build-data.py` after editing source JSON
- Commit data JS files (in `data/`) and source JSON (in `../data/`) separately when possible
- Push after each logical fix so the site updates immediately
- Update `docs/data_issues.md` when resolving tracked issues
- Stage news items in `docs/news_staging.md` as you go
- Use in-game verified values — don't guess stats

### Don't
- Don't edit `data/*.js` files directly (except `news.js` and `patch-notes-var.js`) — they're auto-generated
- Don't fabricate item stats — if data is missing, mark it as needing verification
- Don't commit the admin password in plain text in code (it's in Supabase `admin_config` table)

### Commit Style
- Short descriptive title (what changed)
- Body with bullet points for multiple changes
- Reference report numbers when fixing bugs (e.g., "Report #19")
- Always include: `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`

---

## Key Docs
- `docs/data_issues.md` — tracks data bugs, scaling issues, missing companions
- `docs/news_staging.md` — staging area for news posts
- `docs/rank_checklist.md` — mount ranking verification

## Contact
- **YouTube:** The N00bin Network (@N00binHard)
- **Email:** n00binhard@gmail.com
