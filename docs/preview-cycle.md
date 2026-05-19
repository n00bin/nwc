# Preview Cycle Runbook

The website has a temporary preview page (`preview.html`) for the
upcoming Neverwinter module. When that module ships live, the preview
should hide everywhere on the site. When the next module enters preview,
flip it back on.

## Enabling preview for the next mod

When a new mod (say Mod 34) enters preview:

1. Open `js/preview-config.js`. Set `PREVIEW_ACTIVE = true` and update
   `PREVIEW_LABEL` to the new mod name, e.g. `"Mod 34 Preview"`.
2. Edit `preview.html` — update the `<title>` tag, `<meta name="description">`,
   `<meta property="og:title">`, and `<meta property="og:description">`
   so they reference the new mod.
3. Edit `preview.html` line ~202 — update the `renderNav(...)` argument
   string to match the new `PREVIEW_LABEL` so the new nav entry is
   highlighted as active when on this page.
4. Update the preview content on `preview.html` itself with the new mod's
   gear, companions, mounts, etc.
5. Commit and push. GitHub Pages auto-deploys in 1-2 minutes.
6. Hard-refresh your browser (Ctrl+F5). The nav entry, the home-page
   banner, the home-page landing card, and the toon-forge link should
   all show the new label.

## Disabling preview when the mod ships live

The day the module goes live:

1. Open `js/preview-config.js`. Set `PREVIEW_ACTIVE = false`.
2. Commit and push.
3. Wait 1-5 minutes for GitHub Pages and CDN cache to refresh.
4. (Optional) If you want the archived notice on `preview.html` to name
   the specific mod that shipped, edit the text inside
   `<div id="preview-closed-notice">` in preview.html.

When PREVIEW_ACTIVE is false: the nav entry disappears site-wide, the
home-page banner and landing card hide, the toon-forge link hides, and
preview.html itself shows an "archived" notice at the top — but the
page is still reachable by URL so bookmarks keep working.

## How it works

- `js/preview-config.js` exports two values: `PREVIEW_ACTIVE` (boolean)
  and `PREVIEW_LABEL` (string).
- `js/shared.js` reads them inside `renderNav` to decide whether to
  include the preview entry in the nav bar.
- Any HTML element with `class="preview-link"` is hidden when
  PREVIEW_ACTIVE is false. Marked elements: the index.html banner card
  and landing card, and the toon-forge.html navbar link.
- `index.html` has a `<span id="preview-banner-label">` that gets filled
  with `PREVIEW_LABEL + " is live"` at runtime, so the banner text
  updates with the label.
- `preview.html` has a hidden `#preview-closed-notice` div that appears
  when PREVIEW_ACTIVE is false.
