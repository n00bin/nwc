/* ============================================================
   NWC Consumables Page
   ============================================================ */

(function () {
  // ---- DOM refs ----
  var searchInput      = document.getElementById("search");
  var filterCategory   = document.getElementById("filter-category");
  var filterExpiration = document.getElementById("filter-expiration");
  var listContainer    = document.getElementById("buff-list");
  var listCount        = document.getElementById("list-count");
  var detailPanel      = document.getElementById("detail-panel");

  var selectedId = null;
  var currentQuery = "";

  // ---- Init nav ----
  renderNav("Consumables");

  // ---- Populate category filter ----
  var categories = {};
  for (var i = 0; i < BUFFS_DATA.length; i++) {
    var cat = BUFFS_DATA[i].category;
    if (cat) categories[cat] = true;
  }
  populateFilter(filterCategory, Object.keys(categories).sort(), "All Categories");

  // ---- Filter logic ----
  function getFilteredBuffs() {
    var query   = searchInput.value.trim().toLowerCase();
    var catVal  = filterCategory.value;
    var expVal  = filterExpiration.value;
    currentQuery = query;

    return BUFFS_DATA.filter(function (b) {
      if (query) {
        var haystack = (b.name + " " + b.category + " " + (b.notes || "")).toLowerCase();
        if (haystack.indexOf(query) === -1) return false;
      }
      if (catVal && b.category !== catVal) return false;
      if (expVal && b.expiration !== expVal) return false;
      return true;
    });
  }

  // ---- Category badge class ----
  function getCategoryClass(cat) {
    var map = {
      "Elixir": "badge-defense",
      "Potion": "badge-offense",
      "Event Food": "badge-utility",
      "Stronghold Food": "badge-utility",
      "Scroll": "badge-offense",
      "Belt Item": "badge-defense",
      "Other": "badge-universal"
    };
    return map[cat] || "badge-universal";
  }

  // ---- Format duration ----
  function formatDuration(seconds) {
    if (!seconds || seconds === 0) return "Permanent";
    if (seconds < 60) return seconds + "s";
    if (seconds < 3600) return Math.round(seconds / 60) + " min";
    return Math.round(seconds / 3600) + " hour";
  }

  // ---- Render list ----
  function renderList(buffs) {
    listCount.textContent = buffs.length + " of " + BUFFS_DATA.length + " consumables";

    if (buffs.length === 0) {
      listContainer.innerHTML = '<div class="empty-state">No consumables match your filters</div>';
      return;
    }

    var html = "";
    for (var i = 0; i < buffs.length; i++) {
      var b = buffs[i];
      var sel = b.id === selectedId ? " selected" : "";
      var name = currentQuery ? highlightMatch(b.name, currentQuery) : escapeHtml(b.name);
      var catClass = getCategoryClass(b.category);

      var listImg = window.CONSUMABLE_IMAGES && window.CONSUMABLE_IMAGES[b.name];
      html += '<div class="list-item' + sel + '" data-id="' + b.id + '">';
      if (listImg) {
        html += '<img class="list-icon" src="images/consumables/' + listImg + '" alt="">';
      }
      html += '<span class="item-name">' + name + "</span>";
      html += '<span class="item-meta"><span class="badge ' + catClass + '" style="font-size:0.6rem;padding:0.1rem 0.35rem;">' + escapeHtml(b.category.charAt(0)) + "</span></span>";
      html += "</div>";
    }
    listContainer.innerHTML = html;
  }

  // ---- Render detail ----
  function renderDetail(buff) {
    if (!buff) {
      detailPanel.innerHTML = '<div class="empty-state">Select a consumable to view details</div>';
      return;
    }

    var html = "";

    // Image
    var buffImg = window.CONSUMABLE_IMAGES && window.CONSUMABLE_IMAGES[buff.name];
    if (buffImg) {
      html += '<img class="consumable-icon" src="images/consumables/' + buffImg + '" alt="">';
    }

    // Name
    html += '<h2 style="margin-bottom:0.75rem;">' + escapeHtml(buff.name) + "</h2>";

    // ---- Info block ----
    html += '<div class="proc-block">';
    html += '<div class="detail-meta">';
    html += '<span class="badge ' + getCategoryClass(buff.category) + '">' + escapeHtml(buff.category) + "</span> ";
    if (buff.expiration === "persist") {
      html += '<span class="badge" style="background:var(--stat-positive);color:#fff;">Persists through death</span> ';
    } else if (buff.expiration === "on_death") {
      html += '<span class="badge" style="background:var(--stat-negative);color:#fff;">Lost on death</span> ';
    } else if (buff.expiration === "permanent") {
      html += '<span class="badge" style="background:var(--accent);color:#fff;">Permanent</span> ';
    }
    html += "</div>";

    html += '<div class="detail-meta" style="margin-top:0.4rem;">';
    html += "<span>Duration: " + formatDuration(buff.duration_s) + "</span>";
    if (buff.scope) {
      html += "<span>Scope: " + escapeHtml(buff.scope) + "</span>";
    }
    if (buff.exclusiveGroup) {
      html += "<span>Group: " + escapeHtml(buff.exclusiveGroup) + "</span>";
    }
    html += "</div>";
    if (buff.source) {
      html += '<div style="margin-top:0.4rem;font-size:0.85rem;"><span style="color:var(--text-muted);">Source: </span><span style="color:var(--highlight);">' + escapeHtml(buff.source) + "</span></div>";
    }
    html += "</div>";

    // ---- Rating Stats ----
    var ratingKeys = buff.ratingStats ? Object.keys(buff.ratingStats) : [];
    if (ratingKeys.length > 0) {
      html += '<div class="section-header">Rating Stats</div>';
      html += '<div class="proc-block">';
      for (var r = 0; r < ratingKeys.length; r++) {
        var stat = ratingKeys[r];
        var val = buff.ratingStats[stat];
        html += '<div class="stat-row">';
        html += '<span class="stat-name">' + escapeHtml(stat) + "</span>";
        html += renderStatValue(val, "rating");
        html += "</div>";
      }
      html += "</div>";
    }

    // ---- Percent Stats ----
    var pctKeys = buff.percentStats ? Object.keys(buff.percentStats) : [];
    if (pctKeys.length > 0) {
      html += '<div class="section-header">Percent Stats</div>';
      html += '<div class="proc-block">';
      for (var p = 0; p < pctKeys.length; p++) {
        var pstat = pctKeys[p];
        var pval = buff.percentStats[pstat];
        html += '<div class="stat-row">';
        html += '<span class="stat-name">' + escapeHtml(pstat) + "</span>";
        html += renderStatValue(pval, "percent");
        html += "</div>";
      }
      html += "</div>";
    }

    // ---- Ability Bonuses ----
    if (buff.abilityBonuses) {
      var abilityKeys = Object.keys(buff.abilityBonuses);
      if (abilityKeys.length > 0) {
        html += '<div class="section-header">Ability Bonuses</div>';
        html += '<div class="proc-block">';
        for (var a = 0; a < abilityKeys.length; a++) {
          html += '<div class="stat-row">';
          html += '<span class="stat-name">' + escapeHtml(abilityKeys[a]) + "</span>";
          html += renderStatValue(buff.abilityBonuses[abilityKeys[a]], "rating");
          html += "</div>";
        }
        html += "</div>";
      }
    }

    // ---- Enemy Type Damage ----
    if (buff.enemyType && buff.damagePct) {
      html += '<div class="section-header">Special Effect</div>';
      html += '<div class="proc-block">';
      html += '<div class="stat-row">';
      html += '<span class="stat-name">Damage vs ' + escapeHtml(buff.enemyType) + "</span>";
      html += renderStatValue(buff.damagePct, "percent");
      html += "</div>";
      html += "</div>";
    }

    // ---- Notes ----
    if (buff.notes) {
      html += '<div class="section-header">Notes</div>';
      html += '<div class="effect-text">' + escapeHtml(cleanNotes(buff.notes)) + "</div>";
    }

    detailPanel.innerHTML = html;
  }

  // ---- Event handlers ----
  function onFilterChange() {
    var filtered = getFilteredBuffs();
    renderList(filtered);
    if (selectedId != null) {
      var stillVisible = filtered.some(function (b) { return b.id === selectedId; });
      if (!stillVisible) {
        selectedId = null;
        renderDetail(null);
      }
    }
  }

  listContainer.addEventListener("click", function (e) {
    var item = e.target.closest(".list-item");
    if (!item) return;
    var id = parseInt(item.getAttribute("data-id"), 10);
    selectedId = id;

    var items = listContainer.querySelectorAll(".list-item");
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle("selected", parseInt(items[i].getAttribute("data-id"), 10) === id);
    }

    var buff = null;
    for (var j = 0; j < BUFFS_DATA.length; j++) {
      if (BUFFS_DATA[j].id === id) { buff = BUFFS_DATA[j]; break; }
    }
    renderDetail(buff);
  });

  searchInput.addEventListener("input", onFilterChange);
  filterCategory.addEventListener("change", onFilterChange);
  filterExpiration.addEventListener("change", onFilterChange);

  // ---- Initial render ----
  renderList(BUFFS_DATA);
})();
