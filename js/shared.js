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
  { label: "Patch Notes", href: "patchnotes.html" },
  { label: "Reports",    href: "reports.html" },
];

// ---- Navigation ----
function renderNav(activePage) {
  const nav = document.querySelector(".navbar");
  if (!nav) return;

  let html = '<span class="navbar-brand">NWC</span><div class="navbar-links">';
  for (const p of NAV_PAGES) {
    const cls = p.label === activePage ? " active" : "";
    html += `<a href="${p.href}" class="${cls}">${p.label}</a>`;
  }
  html += "</div>";
  nav.innerHTML = html;
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
// Strips internal prefixes like "Screenshot intake (Mount Preview): ..." → "Tooltip: ..."
function cleanNotes(str) {
  if (!str) return "";
  return str
    .replace(/^Screenshot (?:intake|confirmed|reconciliation) \(Mount Preview(?:, scrolled)?\)[.:]\s*/i, "Tooltip: ")
    .replace(/^Screenshot (?:intake|confirmed|reconciliation) \(Inspect Companion\)[.:]\s*/i, "Tooltip: ")
    .replace(/^Screenshot (?:intake|confirmed|reconciliation)[.:]\s*/i, "")
    .replace(/^Tooltip:\s*$/i, "");
}

// ---- Number formatting ----
function formatNumber(n) {
  if (n == null) return "—";
  return Number(n).toLocaleString();
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
    html += '<span class="stat-name">' + escapeHtml(s.stat) + "</span>";
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
