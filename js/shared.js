/* ============================================================
   NWCB Shared Utilities
   ============================================================ */

// Navigation pages config
const NAV_PAGES = [
  { label: "Home",       href: "index.html" },
  { label: "Mounts",     href: "mounts.html" },
  { label: "Companions", href: "companions.html" },
  { label: "Consumables", href: "consumables.html" },
  { label: "Artifacts",    href: "artifacts.html" },
  { label: "Mekaniks",    href: "mekaniks.html" },
  { label: "Campaign Boosters", href: "campaign-boosters.html" },
  { label: "Professions", href: "professions.html" },
  { label: "NW Patch Notes", href: "patchnotes.html" },
  { label: "Reports",    href: "reports.html" },
  { label: "Creators & Tools", href: "creators-tools.html" },
];

// ---- Navigation ----
function renderNav(activePage) {
  const nav = document.querySelector(".navbar");
  if (!nav) return;

  // Build a working copy so we don't mutate NAV_PAGES.
  const pages = NAV_PAGES.slice();
  if (typeof PREVIEW_ACTIVE !== "undefined" && PREVIEW_ACTIVE) {
    pages.splice(1, 0, { label: PREVIEW_LABEL, href: "preview.html" });
  }

  let html = '<span class="navbar-brand">NWC</span><div class="navbar-links">';
  for (const p of pages) {
    const cls = p.label === activePage ? " active" : "";
    html += `<a href="${p.href}" class="${cls}">${p.label}</a>`;
  }
  html += '<a href="https://www.youtube.com/@N00binHard" target="_blank" rel="noopener" style="color:#ff0000;" title="The N00bin Network on YouTube">&#9654; The N00bin Network</a>';
  html += '<a href="https://www.youtube.com/channel/UCYAaw-fpgBHP0h_fPVN4Udw/join" target="_blank" rel="noopener" style="color:#f0883e;" title="Join The N00bin Network on YouTube">Join on YouTube</a>';
  html += "</div>";
  nav.innerHTML = html;

  // ---- Footer ----
  var footer = document.createElement("footer");
  footer.style.cssText = "text-align:center;padding:2rem 1rem;margin-top:3rem;border-top:1px solid var(--border-default);color:var(--text-muted);font-size:0.82rem;";
  footer.innerHTML = '<a href="https://www.youtube.com/@N00binHard" target="_blank" rel="noopener" style="color:#ff0000;text-decoration:none;margin-right:1rem;">&#9654; The N00bin Network</a>' +
    '<a href="https://www.youtube.com/channel/UCYAaw-fpgBHP0h_fPVN4Udw/join" target="_blank" rel="noopener" style="color:#f0883e;text-decoration:none;">Join on YouTube</a>' +
    '<div style="margin-top:0.75rem;font-size:0.8rem;color:var(--text-secondary);">Want to collaborate or contribute data? Reach out: <a href="mailto:n00binhard@gmail.com" style="color:var(--accent);text-decoration:none;">n00binhard@gmail.com</a></div>' +
    '<div style="margin-top:0.6rem;"><a href="db/" style="color:var(--accent);text-decoration:none;">Browse the full item database &rarr;</a> <span style="color:var(--text-secondary);">&mdash; every companion, mount, gear piece, artifact &amp; more</span></div>' +
    '<div style="margin-top:0.5rem;">Neverwinter Compendium &copy; N00bin ' + new Date().getFullYear() + '</div>';
  document.body.appendChild(footer);
}

// ---- Lookup map builder ----
function buildLookup(dataArray, keyField) {
  keyField = keyField || "id";
  const map = {};
  for (let i = 0; i < dataArray.length; i++) {
    map[dataArray[i][keyField]] = dataArray[i];
  }
  return map;
}

// ---- HTML escaping ----
function escapeHtml(str) {
  if (!str) return "";
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ---- Clean notes for display ----
// Strips internal prefixes ("Screenshot intake (Mount Preview): ...")
// and audit-trail / calibration sentences (verification dates, bolster
// baselines, previously-stored values, NW Hub source notes).
// Sentence terminator allows decimals like "1.3124" inside the matched span
// by requiring the terminating "." to be followed by whitespace or end-of-string.
var AUDIT_TRAIL_PATTERNS = [
  /\s*Stored at Mythic.*?\.(?:\s|$)/gi,
  /\s*Re-verified(?:\s+in-game)? \d{4}-\d{2}-\d{2}.*?\.(?:\s|$)/gi,
  /\s*(?:In-game )?(?:re-)?verified \d{4}-\d{2}-\d{2}.*?\.(?:\s|$)/gi,
  /\s*In-game confirmed \d{4}-\d{2}-\d{2}.*?\.(?:\s|$)/gi,
  /\s*Recalibrated \d{4}-\d{2}-\d{2}.*?\.(?:\s|$)/gi,
  /\s*Corrected \d{4}-\d{2}-\d{2}.*?\.(?:\s|$)/gi,
  /\s*The earlier \d{4}-\d{2}-\d{2}.*?\.(?:\s|$)/gi,
  /\s*The notes claim of .*?\.(?:\s|$)/gi,
  /\s*Standard \w+-tier \w+ power with intrinsically.*?\.(?:\s|$)/gi,
  /\s*Previously-stored values?.*?\.(?:\s|$)/gi,
  /\s*Previous stored value.*?\.(?:\s|$)/gi,
  /\s*Source:?\s*confirmed by n00b.*?\.(?:\s|$)/gi,
  /\s*Source from NW Hub.*?\.(?:\s|$)/gi,
  /\s*Power data confirmed by n00b.*?\.(?:\s|$)/gi,
  /\s*confirmed by n00b \d{4}-\d{2}-\d{2}.*?\.(?:\s|$)/gi,
  /\s*\(Mythic-\d+%-bolster baseline\)/gi,
  // Internal screenshot-verification tags, e.g. "[SS-proc-verified c011 2026-06-14.]"
  // or "[SS-verified c181 ...: removed phantom permanent ...]" — never user-facing.
  /\s*\[[^\]]*verified[^\]]*\]/gi,
  // Calibration reconciliation prose appended to a tooltip (value cross-checks,
  // orphan-duplicate cleanup, community-report provenance) — internal, cut to end.
  /\s*[\d.]+%?\s*vs Bosses @ IL[\s\S]*$/gi,
  /\s*Orphan duplicate[\s\S]*$/gi,
  /\s*Report #\d+\s*[—–-][\s\S]*$/gi,
  // Blanket sweep: any remaining sentence that mentions screenshots
  // (intake / verification workflow chatter) is internal provenance and
  // never user-facing. Runs after cleanNotes' leading-marker rewrites, so
  // "Tooltip: <description>" conversions are preserved.
  /(?:^|\s)[^.!?]*screenshots?\b[^.!?]*(?:[.!?]+|$)/gi
];

function stripAuditTrail(str) {
  if (!str) return "";
  var s = str;
  for (var i = 0; i < AUDIT_TRAIL_PATTERNS.length; i++) {
    s = s.replace(AUDIT_TRAIL_PATTERNS[i], "");
  }
  return s.replace(/\s+/g, " ").trim();
}

function cleanNotes(str) {
  if (!str) return "";
  var s = str
    .replace(/^Screenshot (?:intake|confirmed|reconciliation) \(Mount Preview(?:, scrolled)?\)[.:]\s*/i, "Tooltip: ")
    .replace(/^Screenshot (?:intake|confirmed|reconciliation) \(Inspect Companion\)[.:]\s*/i, "Tooltip: ")
    .replace(/^Screenshot (?:intake|confirmed|reconciliation)[.:]\s*/i, "")
    .replace(/^Tooltip:\s*$/i, "");
  return stripAuditTrail(s);
}

// ---- Number formatting ----
function formatNumber(n) {
  if (n == null) return "—";
  return Number(n).toLocaleString();
}

// ---- Stat display name map ----
// Maps raw stat keys (camelCase or single-word) to human-readable display names.
// Identity entries for already-spaced names are included so the map is the
// single canonical reference for any new rendering code.
// Fallback (for unmapped keys): insert spaces before capital letters.
const STAT_DISPLAY_NAMES = {
  // === Offensive ===
  "Power":                       "Power",
  "CriticalStrike":              "Critical Strike",
  "Critical Strike":             "Critical Strike",
  "CriticalSeverity":            "Critical Severity",
  "Critical Severity":           "Critical Severity",
  "CombatAdvantage":             "Combat Advantage",
  "Combat Advantage":            "Combat Advantage",
  "Accuracy":                    "Accuracy",
  "AccuracyReduction":           "Accuracy Reduction",
  "Accuracy Reduction":          "Accuracy Reduction",

  // === Defensive ===
  "Defense":                     "Defense",
  "DefenseReduction":            "Defense Reduction",
  "Defense Reduction":           "Defense Reduction",
  "Awareness":                   "Awareness",
  "CriticalAvoidance":           "Critical Avoidance",
  "Critical Avoidance":          "Critical Avoidance",
  "Deflect":                     "Deflect",
  "DeflectSeverity":             "Deflect Severity",
  "Deflect Severity":            "Deflect Severity",
  "DamageResistance":            "Damage Resistance",
  "Damage Resistance":           "Damage Resistance",
  "DamageTakenReduction":        "Damage Taken Reduction",
  "Damage Taken Reduction":      "Damage Taken Reduction",
  "IncomingDamage":              "Incoming Damage",
  "Incoming Damage":             "Incoming Damage",
  "IncomingDamageReduction":     "Incoming Damage Reduction",
  "Incoming Damage Reduction":   "Incoming Damage Reduction",

  // === Control ===
  "ControlBonus":                "Control Bonus",
  "Control Bonus":               "Control Bonus",
  "ControlResist":               "Control Resist",
  "Control Resist":              "Control Resist",

  // === Special ===
  "Forte":                       "Forte",
  "MaximumHitPoints":            "Maximum Hit Points",
  "Maximum Hit Points":          "Maximum Hit Points",
  "CombinedRating":              "Combined Rating",
  "Combined Rating":             "Combined Rating",

  // === Utility ===
  "ActionPointGain":             "Action Point Gain",
  "Action Point Gain":           "Action Point Gain",
  "RechargeSpeed":               "Recharge Speed",
  "Recharge Speed":              "Recharge Speed",
  "MovementSpeed":               "Movement Speed",
  "Movement Speed":              "Movement Speed",
  "StaminaRegeneration":         "Stamina Regeneration",
  "Stamina Regeneration":        "Stamina Regeneration",
  "Stamina Restore":             "Stamina Restore",
  "Stamina":                     "Stamina",
  "MovementDebuff":              "Movement Debuff",
  "Movement Debuff":             "Movement Debuff",

  // === Healing ===
  "OutgoingHealing":             "Outgoing Healing",
  "Outgoing Healing":            "Outgoing Healing",
  "IncomingHealing":             "Incoming Healing",
  "Incoming Healing":            "Incoming Healing",
  "OverallOutgoingHealing":      "Overall Outgoing Healing",
  "Overall Outgoing Healing":    "Overall Outgoing Healing",
  "Heal And Damage":             "Heal And Damage",
  "Heal Percent":                "Heal Percent",

  // === Combat / Damage modifiers ===
  "CriticalSeverityReduction":   "Critical Severity Reduction",
  "Critical Severity Reduction": "Critical Severity Reduction",
  "OutgoingDamage":              "Outgoing Damage",
  "Outgoing Damage":             "Outgoing Damage",
  "DamageBonus":                 "Damage Bonus",
  "Damage Bonus":                "Damage Bonus",
  "DmgBonus":                    "Dmg Bonus",
  "Dmg Bonus":                   "Dmg Bonus",
  "EncounterDamage":             "Encounter Damage",
  "Encounter Damage":            "Encounter Damage",
  "Encounter Damage Vs Disabled":"Encounter Damage Vs Disabled",
  "DailyDamage":                 "Daily Damage",
  "Daily Damage":                "Daily Damage",
  "Damage Vs Bosses":            "Damage Vs Bosses",
  "Damage Vs Dragons":           "Damage Vs Dragons",
  "Damage Vs Fey":               "Damage Vs Fey",
  "Damage Vs Gyrion":            "Damage Vs Gyrion",
  "Damage Vs Kabal":             "Damage Vs Kabal",
  "Damage Vs Not Facing":        "Damage Vs Not Facing",
  "Damage Vs Strong":            "Damage Vs Strong",
  "At Will Power":               "At Will Power",
  "At Will Damage Range":        "At Will Damage Range",
  "At Will Damage Vs Disabled":  "At Will Damage Vs Disabled",
  "At Will Damage Vs Rooted":    "At Will Damage Vs Rooted",
  "CompanionDamageBoost":        "Companion Damage Boost",
  "Companion Damage Boost":      "Companion Damage Boost",

  // === Class resource ===
  "ClassResourceRegen":          "Class Resource Regen",
  "Class Resource Regen":        "Class Resource Regen",
  "DivinityRegen":               "Divinity Regen",
  "Divinity Regen":              "Divinity Regen",
  "SoulweaveRegen":              "Soulweave Regen",
  "Soulweave Regen":             "Soulweave Regen",
  "PerformanceRegen":            "Performance Regen",
  "Performance Regen":           "Performance Regen",
};

// Returns human-readable display name for a stat key.
// Falls back to inserting spaces before capital letters if key not in map.
function getStatDisplayName(key) {
  if (!key) return key;
  if (STAT_DISPLAY_NAMES[key] !== undefined) return STAT_DISPLAY_NAMES[key];
  // Graceful fallback: split camelCase only (already-spaced strings pass through unchanged)
  return key.replace(/([a-z])([A-Z])/g, '$1 $2');
}

// ---- Stat rendering ----
function renderStatValue(value, type) {
  if (value == null) return "—";
  var isPercent = type === "percent" || (typeof value === "number" && Math.abs(value) < 100 && String(value).includes("."));
  var prefix = value > 0 ? "+" : "";
  var colorClass = value > 0 ? "stat-positive" : value < 0 ? "stat-negative" : "stat-neutral";

  if (isPercent) {
    return '<span class="stat-value ' + colorClass + '">' + prefix + value + "%</span>";
  }
  return '<span class="stat-value ' + colorClass + '">' + prefix + formatNumber(value) + "</span>";
}

function renderStatsTable(stats) {
  if (!stats || stats.length === 0) return '<div class="detail-meta">No stat bonuses</div>';

  var html = "";
  for (var i = 0; i < stats.length; i++) {
    var s = stats[i];
    html += '<div class="stat-row">';
    html += '<span class="stat-name">' + escapeHtml(getStatDisplayName(s.stat)) + "</span>";
    html += renderStatValue(s.value, s.type);
    html += "</div>";
  }
  return html;
}

// ---- Badge rendering ----
function renderSlotBadges(slots) {
  if (!slots || slots.length === 0) return "";
  var html = "";
  for (var i = 0; i < slots.length; i++) {
    var s = slots[i].toLowerCase();
    html += '<span class="badge badge-' + s + '">' + escapeHtml(slots[i]) + "</span> ";
  }
  return html;
}

function renderInsigniaBadge(category) {
  var lower = category === "*" ? "universal" : category.toLowerCase();
  var label = category === "*" ? "Universal" : category;
  return '<span class="badge badge-' + lower + '">' + escapeHtml(label) + "</span>";
}

// ---- Search wiring ----
function initSearch(inputEl, getItems, searchFields, renderCallback) {
  var debounceTimer = null;

  inputEl.addEventListener("input", function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      var query = inputEl.value.trim().toLowerCase();
      var items = getItems();

      if (!query) {
        renderCallback(items);
        return;
      }

      var filtered = items.filter(function (item) {
        for (var i = 0; i < searchFields.length; i++) {
          var val = searchFields[i](item);
          if (val && val.toLowerCase().indexOf(query) !== -1) return true;
        }
        return false;
      });

      renderCallback(filtered);
    }, 150);
  });
}

// ---- Dropdown filter wiring ----
function populateFilter(selectEl, options, allLabel) {
  allLabel = allLabel || "All";
  var html = '<option value="">' + escapeHtml(allLabel) + "</option>";
  for (var i = 0; i < options.length; i++) {
    html += '<option value="' + escapeHtml(options[i]) + '">' + escapeHtml(options[i]) + "</option>";
  }
  selectEl.innerHTML = html;
}

// ---- Unique sorted values from an array of objects ----
function uniqueSorted(dataArray, fieldExtractor) {
  var seen = {};
  var list = [];
  for (var i = 0; i < dataArray.length; i++) {
    var val = fieldExtractor(dataArray[i]);
    if (val && !seen[val]) {
      seen[val] = true;
      list.push(val);
    }
  }
  list.sort();
  return list;
}

// ---- Highlight search match in text ----
function highlightMatch(text, query) {
  if (!query || !text) return escapeHtml(text);
  var escaped = escapeHtml(text);
  var regex = new RegExp("(" + query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
  return escaped.replace(regex, '<mark>$1</mark>');
}

// ---- Community notice popup (home page only) ----
(function () {
  return; // DISABLED — remove this line to re-enable the popup
  // Only show on home/index page
  var path = window.location.pathname;
  if (path.indexOf("index.html") === -1 && !path.endsWith("/nwc/") && !path.endsWith("/")) return;

  var overlay = document.createElement("div");
  overlay.id = "nwc-notice-overlay";
  overlay.innerHTML =
    '<div id="nwc-notice-box">' +
    '<div style="font-size:1.2rem;font-weight:700;color:#f0883e;margin-bottom:0.75rem;">Help Us Improve!</div>' +
    '<p style="color:#e6edf3;font-size:0.92rem;line-height:1.6;margin:0 0 0.75rem;">' +
    'This compendium may contain <strong>missing or outdated information</strong>. ' +
    'We depend on the community to help keep it accurate.' +
    '</p>' +
    '<p style="color:#8b949e;font-size:0.88rem;line-height:1.5;margin:0 0 1rem;">' +
    'If you spot anything wrong or missing, please submit a <strong>Report</strong> with a screenshot. ' +
    'Your contributions help every Neverwinter player.' +
    '</p>' +
    '<div style="display:flex;gap:0.5rem;justify-content:center;">' +
    '<a href="reports.html" id="nwc-notice-report" style="background:#58a6ff;color:#fff;padding:0.5rem 1.2rem;border-radius:6px;text-decoration:none;font-weight:600;font-size:0.9rem;">Submit a Report</a>' +
    '<button id="nwc-notice-close" style="background:#30363d;color:#e6edf3;border:1px solid #30363d;padding:0.5rem 1.2rem;border-radius:6px;cursor:pointer;font-size:0.9rem;">Got it</button>' +
    '</div>' +
    '</div>';

  var style = document.createElement("style");
  style.textContent =
    '#nwc-notice-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem;}' +
    '#nwc-notice-box{background:#161b22;border:2px solid #f0883e;border-radius:12px;padding:1.5rem 2rem;max-width:480px;width:100%;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.5);}' +
    '#nwc-notice-close:hover{background:#21262d;border-color:#58a6ff;}' +
    '#nwc-notice-report:hover{background:#79b8ff;}';
  document.head.appendChild(style);

  document.addEventListener("DOMContentLoaded", function () {
    document.body.appendChild(overlay);
    document.getElementById("nwc-notice-close").addEventListener("click", function () {
      overlay.remove();
    });
    document.getElementById("nwc-notice-report").addEventListener("click", function () {
      overlay.remove();
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) overlay.remove();
    });
  });
})();

/* ============================================================
   Auto-update banner
   ------------------------------------------------------------
   Lets visitors get the newest site without knowing how to do a
   hard-refresh. The deploy workflow stamps this script's URL with
   ?v=<build> and writes version.json holding the latest build. We
   read our own ?v=, then poll version.json; if the deployed build
   is newer we show a one-tap "Refresh now" bar. Locally (no ?v=)
   or offline (no version.json) this quietly does nothing.
   ============================================================ */
(function () {
  var thisScript = document.currentScript;
  if (!thisScript || !thisScript.src) return;
  var match = thisScript.src.match(/[?&]v=([^&]+)/);
  var BUILD = match ? match[1] : null;
  if (!BUILD) return; // unstamped (local dev) — nothing to compare against

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
