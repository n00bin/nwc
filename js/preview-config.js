/* ============================================================
   NWCB Preview Cycle Config
   ============================================================
   Single source of truth for whether the upcoming-mod preview
   page (preview.html) is visible site-wide.

   See docs/preview-cycle.md for the cycle runbook.
   ============================================================ */

// Set to true while a mod is in preview (currently Mod 33).
// Flip to false the day the mod ships live.
const PREVIEW_ACTIVE = true;

// Display label used in nav, banner, and landing card.
// Update each cycle (e.g., "Mod 34 Preview").
const PREVIEW_LABEL = "Mod 33 Preview";

// When PREVIEW_ACTIVE is false, hide every element marked
// with class="preview-link" so banners + cards disappear.
document.addEventListener("DOMContentLoaded", function () {
  if (PREVIEW_ACTIVE) return;
  var links = document.querySelectorAll(".preview-link");
  for (var i = 0; i < links.length; i++) {
    links[i].style.display = "none";
  }
});
