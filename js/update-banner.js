/* ============================================================
   Auto-update banner (standalone)
   ------------------------------------------------------------
   The same one-tap "Refresh now" bar that js/shared.js gives the
   rest of the site, pulled into its own file so Toon Forge can use
   it too. Toon Forge does NOT load shared.js (it has its own nav /
   footer), so it never got the banner — this fixes that.

   The deploy (scripts/stamp_cache_version.py) stamps this script's
   URL with ?v=<build> and writes version.json. We read our own ?v=,
   poll version.json, and show the bar when the deployed build is
   newer. Locally (no ?v=) or offline (no version.json) it quietly
   does nothing. Keep this in sync with the copy in js/shared.js.
   ============================================================ */
(function () {
  var thisScript = document.currentScript;
  if (!thisScript || !thisScript.src) return;
  var match = thisScript.src.match(/[?&]v=([^&]+)/);
  var BUILD = match ? match[1] : null;
  if (!BUILD) return; // unstamped (local dev / file://) — nothing to compare against

  var bannerShown = false;
  var POLL_MS = 5 * 60 * 1000; // re-check every 5 min while the tab stays open

  function showRefreshBanner() {
    if (bannerShown || !document.body) return;
    bannerShown = true;

    var style = document.createElement("style");
    style.textContent =
      "#nwc-update-bar{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:10000;background:#161b22;border:1px solid #f0883e;border-radius:10px;padding:0.6rem 0.9rem;display:flex;align-items:center;gap:0.75rem;color:#e6edf3;font-size:0.9rem;box-shadow:0 8px 32px rgba(0,0,0,0.5);max-width:92vw;}" +
      "#nwc-update-refresh{background:#f0883e;color:#161b22;border:none;font-weight:700;padding:0.4rem 0.9rem;border-radius:6px;cursor:pointer;}" +
      "#nwc-update-refresh:hover{background:#ffa657;}" +
      "#nwc-update-dismiss{background:transparent;color:#8b949e;border:none;font-size:1.15rem;line-height:1;cursor:pointer;padding:0 0.25rem;}" +
      "#nwc-update-dismiss:hover{color:#e6edf3;}";
    document.head.appendChild(style);

    var bar = document.createElement("div");
    bar.id = "nwc-update-bar";
    bar.innerHTML =
      "<span>A newer version of the site is available.</span>" +
      '<button id="nwc-update-refresh">Refresh now</button>' +
      '<button id="nwc-update-dismiss" aria-label="Dismiss">×</button>';
    document.body.appendChild(bar);

    document.getElementById("nwc-update-refresh").addEventListener("click", function () {
      location.reload();
    });
    document.getElementById("nwc-update-dismiss").addEventListener("click", function () {
      bar.remove();
    });
  }

  function check() {
    if (bannerShown) return;
    fetch("version.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || !d.version || d.version === BUILD) return;
        if (document.body) showRefreshBanner();
        else document.addEventListener("DOMContentLoaded", showRefreshBanner);
      })
      .catch(function () { /* offline / no version.json — ignore */ });
  }

  // Check on first load, whenever the tab regains focus, and on a slow timer.
  check();
  window.addEventListener("focus", check);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") check();
  });
  setInterval(check, POLL_MS);
})();
