/* ============================================================
   NWC — Private page-view counter
   ============================================================

   Counts which pages get opened, so n00b can see what's actually used
   and decide what to build next. The numbers are NOT shown anywhere on
   the site — they're readable only in admin.html, behind the admin
   password. See docs/supabase/site_analytics.sql for the storage.

   What this sends: the page filename, two "first time today?" flags, and
   the referring site's HOSTNAME (never the full URL). That's it. No IP,
   no user agent, no account, no cookies — the two localStorage keys below
   exist purely so one person reading five pages isn't counted as five
   people, and they never leave the browser.

   Deliberately standalone: Toon Forge does not load js/shared.js, and
   this uses plain fetch rather than the Supabase SDK, so it can be
   dropped into every page identically with no dependencies.
   ============================================================ */

(function () {
  "use strict";

  var SUPABASE_URL  = "https://ynrfmmccarrpqjdrpvqn.supabase.co";
  var SUPABASE_ANON = "sb_publishable_RSK4LJnJ4-HQDudcRq3gRw_WJI5WIUw";

  // ---- Opt-outs, checked before anything is recorded ----

  // Honour an explicit Do Not Track signal.
  var dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
  if (dnt === "1" || dnt === "yes") return;

  // Never count n00b's own local development.
  var host = location.hostname;
  if (!host || host === "localhost" || host === "127.0.0.1" ||
      host === "[::1]" || host.indexOf(".local") !== -1 ||
      location.protocol === "file:") return;

  // A private window with storage blocked would throw on every read below.
  // No storage means no way to dedupe, so skip rather than over-count.
  var store;
  try {
    store = window.localStorage;
    store.setItem("nwc_a_probe", "1");
    store.removeItem("nwc_a_probe");
  } catch (e) { return; }

  // ---- Which page is this? ----
  // Trailing "/" means the directory index. Anything the database doesn't
  // recognise gets bucketed as "other" server-side, so a typo here is safe.
  var path = location.pathname;
  var page = path.substring(path.lastIndexOf("/") + 1).toLowerCase();
  if (!page) page = "index.html";

  // ---- "First time today?" flags ----
  // UTC date, to match the day boundary the database uses.
  var today = new Date().toISOString().slice(0, 10);

  var lastDay = store.getItem("nwc_a_day");
  var firstToday = lastDay !== today;

  // Pages already seen today, reset whenever the day rolls over.
  var seen = [];
  if (!firstToday) {
    try { seen = JSON.parse(store.getItem("nwc_a_pages") || "[]"); } catch (e) { seen = []; }
    if (!Array.isArray(seen)) seen = [];
  }
  var firstForPage = seen.indexOf(page) === -1;

  if (firstToday) store.setItem("nwc_a_day", today);
  if (firstForPage) {
    seen.push(page);
    // Bound it — the site has 14 pages, so this only grows if something
    // unexpected is feeding us page names.
    if (seen.length > 40) seen = seen.slice(-40);
    store.setItem("nwc_a_pages", JSON.stringify(seen));
  }

  // ---- Referrer: hostname only, and only when it's another site ----
  var referrer = "";
  try {
    if (document.referrer) {
      var refHost = new URL(document.referrer).hostname.toLowerCase();
      // Clicking between our own pages isn't a referral.
      if (refHost && refHost !== location.hostname) {
        referrer = refHost.replace(/^www\./, "");
      }
    }
  } catch (e) { referrer = ""; }

  // ---- Send ----
  // keepalive so the request still completes if the page is closing.
  // Failures are swallowed on purpose: a counter must never break a page
  // or spam the console for a visitor who can't do anything about it.
  try {
    fetch(SUPABASE_URL + "/rest/v1/rpc/record_pageview", {
      method: "POST",
      headers: {
        "apikey": SUPABASE_ANON,
        "Authorization": "Bearer " + SUPABASE_ANON,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        p_page: page,
        p_first_for_page: firstForPage,
        p_first_today: firstToday,
        p_referrer: referrer
      }),
      keepalive: true
    }).catch(function () { /* offline or blocked — nothing to do */ });
  } catch (e) { /* no fetch — nothing to do */ }
})();
