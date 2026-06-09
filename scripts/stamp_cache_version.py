#!/usr/bin/env python3
"""Stamp a cache-busting version onto local asset URLs in the deployed HTML.

WHY THIS EXISTS
---------------
The site loads assets with plain paths like ``js/shared.js`` and
``data/companions.js``. Because the path never changes between deploys,
browsers happily serve the cached (old) copy and visitors see stale content
until they do a manual hard-refresh. This script appends a per-deploy
``?v=<version>`` to those URLs so the URL changes whenever we ship, which
forces the browser to download the fresh file. It also writes ``version.json``
so the in-page "Refresh now" banner (in js/shared.js) can detect new deploys.

WHEN IT RUNS
------------
Only in CI (GitHub Actions), on the throwaway checkout, right before the Pages
artifact is uploaded. It is NOT meant to be committed back to the repo, so the
source HTML in git stays clean and readable.

SAFETY
------
Conservative on purpose:
  * only rewrites local css/ js/ data/ assets and root-level *.js files
  * never touches external URLs (http, //, data:), anchors (#) or mailto:
  * idempotent — an already-stamped URL (has ?v=) is skipped, never doubled
"""

import os
import re
import glob
import json


def main():
    # Prefer an explicit BUILD_VERSION; fall back to the commit SHA in CI;
    # "dev" locally. Trim to 12 chars — plenty unique, keeps URLs short.
    version = (
        os.environ.get("BUILD_VERSION")
        or os.environ.get("GITHUB_SHA")
        or "dev"
    )
    version = version[:12]

    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    # Matches  src="js/foo.js"  href="css/bar.css"  src="data/x.js"
    # and root-level  src="toon-forge-engine.js"  — but NOT external URLs
    # (they contain "/" before the filename and so fail the no-slash branch,
    # or do not start with css/js/data) and NOT already-stamped URLs (the
    # closing quote must come right after .css/.js, so a trailing ?v= fails).
    attr_re = re.compile(
        r'((?:src|href)\s*=\s*")'
        r'((?:css|js|data)/[^"?#]+\.(?:css|js)|[^"?#/]+\.js)'
        r'(")'
    )

    def repl(m):
        return m.group(1) + m.group(2) + "?v=" + version + m.group(3)

    html_files = sorted(glob.glob(os.path.join(root, "*.html")))
    changed = 0
    for path in html_files:
        with open(path, "r", encoding="utf-8") as f:
            src = f.read()
        new = attr_re.sub(repl, src)
        if new != src:
            with open(path, "w", encoding="utf-8") as f:
                f.write(new)
            changed += 1

    with open(os.path.join(root, "version.json"), "w", encoding="utf-8") as f:
        json.dump({"version": version}, f)

    print("stamped version %s into %d/%d html files; wrote version.json"
          % (version, changed, len(html_files)))


if __name__ == "__main__":
    main()
