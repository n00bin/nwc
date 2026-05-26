"""
reconcile_ami.py — AMI (Add Missing Item) reconciliation helper.

Matches open "Missing Item" reports against a list of newly-added gear
entries, then calls mark_ami_resolved to link each report to its canonical
gear id and flip its status to Fixed.

Usage:
  # From the website root directory:

  # Bulk reconcile after adding a batch of gear (called from merge scripts):
  from scripts.reconcile_ami import reconcile_added_items
  reconcile_added_items([{"name": "Dusk Ring of the Seldarine", "new_id": 501}])

  # Dry-run (print what would be linked, no RPC calls):
  python scripts/reconcile_ami.py --dry-run

  # Manual one-off link:
  python scripts/reconcile_ami.py --link <report_id> <gear_id>
"""

import sys
import argparse
import re
import requests
from pathlib import Path

# ---- Constants ---------------------------------------------------------------
SUPABASE_URL  = "https://ynrfmmccarrpqjdrpvqn.supabase.co"
SUPABASE_ANON = "sb_publishable_RSK4LJnJ4-HQDudcRq3gRw_WJI5WIUw"

# Title prefix used by saveAddMissingItem in toon-forge.html when submitting.
AMI_TITLE_PREFIX = "Missing item: "

# Statuses that count as "still open" (not yet resolved or closed).
OPEN_STATUSES = {"New", "Confirmed", "In Progress"}


# ---- Helpers -----------------------------------------------------------------

def _read_admin_pass(admin_pass=None):
    """
    Read the admin password from the secrets file.
    Returns the password string stripped of whitespace.
    Raises FileNotFoundError if the file doesn't exist.
    """
    if admin_pass is not None:
        return admin_pass
    secret_path = Path.home() / ".claude" / "secrets" / "nwcb_supabase_admin.txt"
    return secret_path.read_text(encoding="utf-8").strip()


def _normalize_name(raw):
    """
    Normalize an item name for fuzzy matching.
    - Strips the 'Missing item: ' prefix (case-insensitive)
    - Lowercases
    - Collapses whitespace
    """
    s = raw.strip()
    # Strip the report title prefix if present (case-insensitive)
    prefix_lower = AMI_TITLE_PREFIX.lower()
    if s.lower().startswith(prefix_lower):
        s = s[len(AMI_TITLE_PREFIX):]
    return re.sub(r"\s+", " ", s).strip().lower()


def _supabase_headers():
    return {
        "apikey":        SUPABASE_ANON,
        "Authorization": f"Bearer {SUPABASE_ANON}",
        "Content-Type":  "application/json",
    }


def _fetch_open_ami_reports():
    """
    GET all open 'Missing Item' reports from reports_public.
    Returns a list of {id, title, status} dicts.
    """
    url = (
        f"{SUPABASE_URL}/rest/v1/reports_public"
        "?select=id,title,status,admin_notes"
        "&category=eq.Missing Item"
        "&status=in.(New,Confirmed,In Progress)"
        "&order=id.asc"
    )
    resp = requests.get(url, headers=_supabase_headers(), timeout=15)
    resp.raise_for_status()
    return resp.json()


def _call_mark_ami_resolved(report_id, gear_id, admin_pass, dry_run=False):
    """
    Call the mark_ami_resolved RPC to link a report to a canonical gear id.
    Returns the parsed JSON response dict, or a fake success dict on dry_run.
    """
    if dry_run:
        return {"ok": True, "__dry_run": True}
    url = f"{SUPABASE_URL}/rest/v1/rpc/mark_ami_resolved"
    payload = {
        "p_report_id":  report_id,
        "p_gear_id":    gear_id,
        "p_admin_pass": admin_pass,
    }
    resp = requests.post(url, json=payload, headers=_supabase_headers(), timeout=15)
    resp.raise_for_status()
    return resp.json()


# ---- Public API --------------------------------------------------------------

def reconcile_added_items(added_items, admin_pass=None, dry_run=False):
    """
    Match newly-added gear against open AMI reports and resolve them.

    Parameters
    ----------
    added_items : list of {"name": str, "new_id": int}
        The items that were just added to gear.json. Each entry needs a
        human-readable name (matching the original report title) and the
        canonical gear id assigned during the merge.

    admin_pass : str or None
        Admin password for the Supabase RPC. When None, read from
        ~/.claude/secrets/nwcb_supabase_admin.txt.

    dry_run : bool
        When True, print what would be linked but make no RPC calls.

    Returns
    -------
    dict
        {"linked": [(report_id, gear_id, name), ...],
         "missed":  [name, ...]}
    """
    if not added_items:
        print("reconcile_ami: no items provided, nothing to do.")
        return {"linked": [], "missed": []}

    # Read admin pass once (fails fast if file missing)
    if not dry_run:
        try:
            admin_pass = _read_admin_pass(admin_pass)
        except FileNotFoundError as exc:
            print(f"ERROR: Could not read admin password — {exc}", file=sys.stderr)
            raise

    # Fetch open reports
    print("Fetching open AMI reports…")
    reports = _fetch_open_ami_reports()
    print(f"  Found {len(reports)} open report(s).")

    # Build name → [report_ids] lookup (one name can appear multiple times
    # if the same item was reported by multiple players)
    name_to_ids: dict[str, list[int]] = {}
    for r in reports:
        norm = _normalize_name(r["title"])
        name_to_ids.setdefault(norm, []).append(r["id"])

    linked = []
    missed = []

    for entry in added_items:
        item_name = entry["name"]
        gear_id   = entry["new_id"]
        norm      = _normalize_name(item_name)

        if norm not in name_to_ids:
            print(f"  No open AMI report for: {item_name}")
            missed.append(item_name)
            continue

        for report_id in name_to_ids[norm]:
            result = _call_mark_ami_resolved(report_id, gear_id, admin_pass, dry_run=dry_run)
            if result.get("ok"):
                tag = " [DRY RUN]" if dry_run else ""
                print(f"  Linked report #{report_id} → gear id {gear_id} ({item_name}){tag}")
                linked.append((report_id, gear_id, item_name))
            else:
                err = result.get("error", "unknown error")
                print(f"  ERROR linking report #{report_id}: {err}", file=sys.stderr)

    print(f"Done. {len(linked)} linked, {len(missed)} missed.")
    return {"linked": linked, "missed": missed}


# ---- CLI ---------------------------------------------------------------------

def _cli_dry_run():
    """List what would be linked without making any RPC calls."""
    print("DRY RUN — fetching open AMI reports (no RPC calls will be made)…")
    reports = _fetch_open_ami_reports()
    if not reports:
        print("  No open AMI reports found.")
        return
    print(f"\n  {'ID':>6}  {'Status':<14}  Title")
    print("  " + "-" * 60)
    for r in reports:
        print(f"  {r['id']:>6}  {r['status']:<14}  {r['title']}")
    print(f"\nTotal: {len(reports)} open AMI report(s).")
    print("To link one manually: python scripts/reconcile_ami.py --link <report_id> <gear_id>")


def _cli_manual_link(report_id, gear_id):
    """Manually link a single report to a gear id."""
    try:
        admin_pass = _read_admin_pass()
    except FileNotFoundError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)

    print(f"Linking report #{report_id} → gear id {gear_id}…")
    result = _call_mark_ami_resolved(report_id, gear_id, admin_pass)
    if result.get("ok"):
        print(f"  Done. Report #{report_id} is now Fixed with resolved_gear_id={gear_id}.")
    else:
        print(f"  ERROR: {result.get('error', 'unknown')}", file=sys.stderr)
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="AMI reconciliation helper for the NWCB website."
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "--dry-run",
        action="store_true",
        help="List all open AMI reports without making any RPC calls.",
    )
    group.add_argument(
        "--link",
        nargs=2,
        metavar=("REPORT_ID", "GEAR_ID"),
        help="Manually link a single report to a canonical gear id.",
    )
    args = parser.parse_args()

    if args.dry_run:
        _cli_dry_run()
    elif args.link:
        try:
            report_id = int(args.link[0])
            gear_id   = int(args.link[1])
        except ValueError:
            print("ERROR: REPORT_ID and GEAR_ID must be integers.", file=sys.stderr)
            sys.exit(1)
        _cli_manual_link(report_id, gear_id)


if __name__ == "__main__":
    main()
