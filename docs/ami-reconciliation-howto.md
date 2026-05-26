# AMI Reconciliation — How To Use

**AMI = Add Missing Item.** This is the feature that lets players tell you about gear
that isn't in your database yet, and then automatically cleans up their build once
you've added it for real.

---

## What this feature does

When a player opens the Toon Forge gear picker and doesn't see an item they own,
they can click **+ Add Missing Item**, fill in the stats, and hit **Add to my build**.
Their item is saved in their browser storage immediately so their build works right
away. At the same time, a report is sent to your Supabase reports table so you know
what to add.

Once you add the real item to `gear.json` and mark the report Fixed, the next time
that player loads Toon Forge their local placeholder is replaced by the verified
version — no action needed from them. If you decide not to add the item (Won't Fix),
their local copy is removed and they see a note with your admin message explaining why.

Players can see all their pending and resolved submissions any time by clicking
**"Your submissions"** in the correction callout at the top of Toon Forge.

---

## One-time setup: run the SQL

You only need to do this once to add the new database columns and functions.

1. Open your Supabase project at `https://supabase.com/dashboard/project/ynrfmmccarrpqjdrpvqn`
2. Click **SQL Editor** in the left sidebar
3. Open `G:\AI_PROJECTS\NWCB\website\supabase-ami-reconciliation-setup.sql` in any
   text editor and copy its contents into the SQL Editor
4. Run each block **in order from top to bottom**, one at a time. The steps are:
   - **A0** — Lists the columns `reports` already has, then safely adds `admin_notes`
     if it's missing. You should see a table of column names in the result.
   - **A1** — Adds `resolved_gear_id` column (stores the gear.json id once you merge
     a submitted item). Result: "ALTER TABLE" success message.
   - **A2** — Adds `updated_at` column. **Must run before A4c.** All existing reports
     get today's date as their `updated_at` — that's expected and harmless.
   - **A3** — Rebuilds the `reports_public` view to include the two new columns.
     Result: "CREATE VIEW" success message.
   - **A4** — Creates the `mark_ami_resolved` database function (used by the Python
     helper script to link a resolved report to its gear.json id).
   - **A4b** — Audit query. Shows you the RLS policies on the reports table. You're
     just confirming the INSERT policy still matches what you expect — no changes needed
     unless the output looks different from the comment in the file.
   - **A4c** — Updates the `update_report_status` function so it also stamps `updated_at`
     when you change a report's status.
   - **A5** — Creates the `submit_missing_item_report` function that Toon Forge calls
     when a player submits a missing item. Result: "CREATE FUNCTION" success message.

5. **If something goes wrong:** The rollback SQL is at the bottom of the file
   (commented out). Uncomment and run the blocks in reverse order — A5 first, A0 last.

---

## Day-to-day: how it works with your intake flow

When you process gear screenshots and add items to `gear.json` via your batch scripts
(e.g. `add_rogue_mod27_batch1.py`), you can optionally resolve matching missing-item
reports at the same time.

**Note:** `scripts/reconcile_ami.py` was planned as a helper for this step but
**has not been created yet**. Until it exists, use the manual method below.

### Manual resolution (works right now)

After you add a new item to `gear.json` and run `python3 build-data.py`, find the
report in your Reports page and mark it Fixed using the admin panel. Or use the curl
command from the CLAUDE.md "Fixing a Report" section, substituting the report id and
your admin password.

The `resolved_gear_id` field (used for the automatic swap on the player's end) also
needs to be set. You can do that from the Supabase SQL Editor:

```sql
SELECT mark_ami_resolved(
  <report_id>,       -- the report number (integer)
  <gear_json_id>,    -- the id you assigned in gear.json
  '<admin_password>' -- your admin password from the config table
);
```

Replace `<report_id>`, `<gear_json_id>`, and `<admin_password>` with real values.
A result of `{"ok": true}` means it worked.

### Once reconcile_ami.py exists

When the Python helper script is created in `scripts/reconcile_ami.py`, you'll be
able to do this instead:

```bash
# See what reports would be linked — no changes made
python3 scripts/reconcile_ami.py --dry-run

# Link one specific report to a gear.json id
python3 scripts/reconcile_ami.py --link 42 4821
```

And you'll be able to add 2 lines at the end of any intake script:

```python
from reconcile_ami import reconcile_added_items
reconcile_added_items([{"name": item["name"], "new_id": item["id"]} for item in added])
```

---

## Manual control via admin notes

You can still mark reports Won't Fix the normal way through the admin panel on the
Reports page. When you add an admin note before marking Won't Fix, that note appears
in the player's Toon Forge toast message so they understand why their item wasn't added.

Keep admin notes in plain English — players see them directly. One or two short
sentences. Example: "This item was removed in a recent patch." Not: "resolved_gear_id
not mappable, status→wf."

Only Missing Item reports trigger the auto-clean behaviour. Bug reports and
Suggestions don't affect the player's gear or overrides.

---

## Testing checklist before pushing to live

After running the SQL (or to verify the feature is working correctly):

1. Open `http://localhost:8000/toon-forge.html` (run `python3 -m http.server 8000`
   from `G:\AI_PROJECTS\NWCB\website\`)
2. Open the gear picker for any slot, click **+ Add Missing Item**, fill in any name
   and stats, and click **Add to my build**. The item should appear in your build
   immediately with a "Added to your build!" toast.
3. Check your Supabase Reports page — a new "Missing item: [name]" report should
   appear with category "Missing Item".
4. Click **"Your submissions"** in the correction callout. Your new item should appear
   in the Pending section.
5. In Supabase SQL Editor, run `SELECT mark_ami_resolved(<report_id>, 999, '<pass>');`
   using the report id from step 3 (use a fake gear id like 999 for this test).
6. Reload Toon Forge. Within 10 seconds a toast should appear saying the item
   "was approved but data hasn't refreshed yet." The item disappears from the
   Pending list in Your Submissions and moves to Resolved.

---

## Known caveats

- **Old submissions without a report ID:** Players who submitted missing items before
  this feature was deployed don't have a report ID stored in their browser, so those
  items won't auto-reconcile. They stay in the player's build indefinitely. The C5
  duplicate-cleanup (runs on every page load) handles the most common case: if you
  add a canonical item with the exact same name later, the player's local copy is
  quietly dropped. Items with slightly different capitalisation or spelling won't match.
  Not a problem in practice — new submissions from this point forward all get IDs.

- **10-minute cache:** Reconciliation checks run once per page load and cache the
  result for 10 minutes in sessionStorage. A player who submits an item and immediately
  clicks "Your submissions" will see fresh status there (it bypasses the cache). But
  background reconciliation on the *next* load will still reflect the latest data.

- **resolved_gear_id must be set:** Marking a report Fixed without also setting
  `resolved_gear_id` (via `mark_ami_resolved`) means the player's local item is NOT
  swapped for the canonical version — it's kept as-is. The fixed status alone isn't
  enough. Always use `mark_ami_resolved` or the Python helper when you merge a
  submitted item.

---

## What to do if it breaks

- All AMI feature code is on branch `wip-add-missing-item`. If you need to roll back,
  switch to `main` (which is at the pre-AMI state) and don't merge the branch.
- The SQL changes are additive — they don't drop any existing columns or data. To undo
  just the schema changes, run the rollback SQL at the bottom of
  `supabase-ami-reconciliation-setup.sql` (uncomment the blocks, run A5 first, A0 last).
- If the `submit_missing_item_report` RPC is broken and players see "couldn't send
  report," their item is still saved locally — they don't lose their build. The report
  just won't appear in your inbox.
