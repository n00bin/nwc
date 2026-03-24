/* ============================================================
   NWCB Companions Page
   ============================================================ */

(function () {
  // ---- Build lookup maps ----
  var powerMap       = buildLookup(COMPANION_POWERS_DATA);
  var enhancementMap = buildLookup(COMPANION_ENHANCEMENTS_DATA);

  // ---- DOM refs ----
  var searchInput       = document.getElementById("search");
  var filterSlot        = document.getElementById("filter-slot");
  var filterEnhancement = document.getElementById("filter-enhancement");
  var filterStat        = document.getElementById("filter-stat");
  var listContainer     = document.getElementById("companion-list");
  var listCount         = document.getElementById("list-count");
  var detailPanel       = document.getElementById("detail-panel");

  var selectedId = null;
  var currentQuery = "";

  // ---- Init nav ----
  renderNav("Companions");

  // ---- Populate filter dropdowns ----

  // Slot types: collect all unique slot values across all powers
  var allSlots = {};
  for (var i = 0; i < COMPANION_POWERS_DATA.length; i++) {
    var slots = COMPANION_POWERS_DATA[i].slot;
    if (slots) {
      for (var j = 0; j < slots.length; j++) {
        allSlots[slots[j]] = true;
      }
    }
  }
  var slotList = Object.keys(allSlots).sort();
  populateFilter(filterSlot, slotList, "All Slot Types");

  // Stats: collect from power stats + power procEffect.statEffects
  var allStats = {};
  for (var si = 0; si < COMPANION_POWERS_DATA.length; si++) {
    var pw = COMPANION_POWERS_DATA[si];
    if (pw.stats) {
      for (var sj = 0; sj < pw.stats.length; sj++) {
        allStats[pw.stats[sj].stat] = true;
      }
    }
    if (pw.procEffect && pw.procEffect.statEffects) {
      for (var sk = 0; sk < pw.procEffect.statEffects.length; sk++) {
        allStats[pw.procEffect.statEffects[sk].stat] = true;
      }
    }
  }
  populateFilter(filterStat, Object.keys(allStats).sort(), "All Stats");

  // Enhancement names
  populateFilter(filterEnhancement,
    uniqueSorted(COMPANIONS_DATA, function (c) {
      var e = enhancementMap[c.enhancementRef];
      return e ? e.name : null;
    }),
    "All Enhancements"
  );

  // ---- Filter logic ----
  function getFilteredCompanions() {
    var query        = searchInput.value.trim().toLowerCase();
    var slotVal      = filterSlot.value;
    var enhanceVal   = filterEnhancement.value;
    var statVal      = filterStat.value;
    currentQuery = query;

    return COMPANIONS_DATA.filter(function (c) {
      var pw = powerMap[c.powerRef];
      var en = enhancementMap[c.enhancementRef];

      // Text search
      if (query) {
        var haystack = (c.name + " " + (pw ? pw.name : "") + " " + (en ? en.name : "")).toLowerCase();
        if (haystack.indexOf(query) === -1) return false;
      }

      // Slot type filter (contains logic — powers can have multiple slots)
      if (slotVal) {
        if (!pw || !pw.slot || pw.slot.indexOf(slotVal) === -1) return false;
      }

      // Enhancement filter
      if (enhanceVal) {
        if (!en || en.name !== enhanceVal) return false;
      }

      // Stat filter — match if the power's stats or procEffect.statEffects contain this stat
      if (statVal) {
        if (!pw) return false;
        var found = false;
        if (pw.stats) {
          for (var si = 0; si < pw.stats.length; si++) {
            if (pw.stats[si].stat === statVal) { found = true; break; }
          }
        }
        if (!found && pw.procEffect && pw.procEffect.statEffects) {
          for (var sj = 0; sj < pw.procEffect.statEffects.length; sj++) {
            if (pw.procEffect.statEffects[sj].stat === statVal) { found = true; break; }
          }
        }
        if (!found) return false;
      }

      return true;
    });
  }

  // ---- Render list ----
  function renderList(companions) {
    listCount.textContent = companions.length + " of " + COMPANIONS_DATA.length + " companions";

    if (companions.length === 0) {
      listContainer.innerHTML = '<div class="empty-state">No companions match your filters</div>';
      return;
    }

    var html = "";
    for (var i = 0; i < companions.length; i++) {
      var c = companions[i];
      var sel = c.id === selectedId ? " selected" : "";
      var name = currentQuery ? highlightMatch(c.name, currentQuery) : escapeHtml(c.name);

      // Show slot badges in the list
      var pw = powerMap[c.powerRef];
      var badges = "";
      if (pw && pw.slot) {
        for (var s = 0; s < pw.slot.length; s++) {
          var slotLower = pw.slot[s].toLowerCase();
          badges += '<span class="badge badge-' + slotLower + '" style="font-size:0.6rem;padding:0.1rem 0.35rem;">' + pw.slot[s].charAt(0) + "</span> ";
        }
      }

      html += '<div class="list-item' + sel + '" data-id="' + c.id + '">';
      html += '<span class="item-name">' + name + "</span>";
      html += '<span class="item-meta">' + badges + "</span>";
      html += "</div>";
    }
    listContainer.innerHTML = html;
  }

  // ---- Render detail ----
  function renderDetail(companion) {
    if (!companion) {
      detailPanel.innerHTML = '<div class="empty-state">Select a companion to view details</div>';
      return;
    }

    var pw = powerMap[companion.powerRef];
    var en = enhancementMap[companion.enhancementRef];

    var html = "";

    // Companion name
    html += '<h2 style="margin-bottom:0.75rem;">' + escapeHtml(companion.name) + "</h2>";

    // ---- Power ----
    html += '<div class="section-header">Power</div>';
    if (pw) {
      html += '<div class="detail-name">' + escapeHtml(pw.name) + "</div>";

      // Slot badges
      if (pw.slot && pw.slot.length > 0) {
        html += '<div style="margin:0.3rem 0;">' + renderSlotBadges(pw.slot) + "</div>";
      }

      html += '<div class="detail-meta">';
      html += "<span>IL " + formatNumber(pw.item_level) + "</span>";
      html += "<span>Combined Rating " + formatNumber(pw.combinedRating) + "</span>";
      html += "</div>";

      // Stats
      if (pw.stats && pw.stats.length > 0) {
        html += renderStatsTable(pw.stats);
      }

      // Role conditional
      if (pw.roleConditional) {
        html += renderRoleConditional(pw.roleConditional);
      }

      // Proc effect
      if (pw.procEffect) {
        html += renderProcEffect(pw.procEffect);
      }

      // Zone conditional indicator
      if (pw.zoneConditional) {
        html += '<div style="margin-top:0.4rem;"><span class="badge" style="background:var(--highlight);color:#000;">Zone Conditional</span></div>';
      }

      if (pw.notes) {
        html += '<div class="effect-text">' + escapeHtml(cleanNotes(pw.notes)) + "</div>";
      }
    } else {
      html += '<div class="detail-meta">No power data</div>';
    }

    // ---- Enhancement ----
    html += '<div class="section-header">Enhancement</div>';
    if (en) {
      html += '<div class="detail-name">' + escapeHtml(en.name) + "</div>";
      html += '<div class="detail-meta">';
      html += "<span>IL " + formatNumber(en.item_level) + "</span>";
      if (en.scope) {
        html += '<span>Scope: ' + escapeHtml(en.scope) + "</span>";
      }
      html += "</div>";

      // Single stat display
      html += '<div class="stat-row">';
      html += '<span class="stat-name">' + escapeHtml(en.stat) + "</span>";
      html += renderStatValue(en.value, en.type);
      html += "</div>";

      if (en.notes) {
        html += '<div class="effect-text">' + escapeHtml(cleanNotes(en.notes)) + "</div>";
      }
    } else {
      html += '<div class="detail-meta">No enhancement data</div>';
    }

    // ---- Notes ----
    if (companion.notes) {
      html += '<div class="section-header">Notes</div>';
      html += '<div class="effect-text">' + escapeHtml(cleanNotes(companion.notes)) + "</div>";
    }

    detailPanel.innerHTML = html;
  }

  // ---- Render proc effect ----
  function renderProcEffect(proc) {
    var html = '<div class="proc-block">';
    html += '<div class="proc-label">Proc Effect</div>';

    if (proc.trigger) {
      html += "<div><span class=\"stat-name\">Trigger:</span> " + escapeHtml(proc.trigger) + "</div>";
    }
    if (proc.chance != null) {
      html += "<div><span class=\"stat-name\">Chance:</span> " + proc.chance + "%</div>";
    }
    if (proc.effect) {
      html += "<div><span class=\"stat-name\">Effect:</span> " + escapeHtml(proc.effect) + "</div>";
    }

    // Stat effects within proc
    if (proc.statEffects && proc.statEffects.length > 0) {
      for (var i = 0; i < proc.statEffects.length; i++) {
        var se = proc.statEffects[i];
        var scope = se.scope ? " (" + se.scope + ")" : "";
        html += '<div class="stat-row">';
        html += '<span class="stat-name">' + escapeHtml(se.stat) + escapeHtml(scope) + "</span>";
        html += renderStatValue(se.value, se.type);
        html += "</div>";
      }
    }

    if (proc.durationSeconds) {
      html += "<div><span class=\"stat-name\">Duration:</span> " + proc.durationSeconds + "s</div>";
    }
    if (proc.cooldown) {
      html += "<div><span class=\"stat-name\">Cooldown:</span> " + escapeHtml(String(proc.cooldown)) + "</div>";
    } else if (proc.cooldownSeconds) {
      html += "<div><span class=\"stat-name\">Cooldown:</span> " + proc.cooldownSeconds + "s</div>";
    }
    if (proc.maxStacks) {
      html += "<div><span class=\"stat-name\">Max stacks:</span> " + proc.maxStacks + "</div>";
    }

    html += "</div>";
    return html;
  }

  // ---- Render role conditional ----
  function renderRoleConditional(rc) {
    var html = '<div class="proc-block">';
    html += '<div class="proc-label">Role-Specific Stats</div>';
    var roles = ["DPS", "Tank", "Healer"];
    for (var i = 0; i < roles.length; i++) {
      var data = rc[roles[i]];
      if (data) {
        html += '<div class="stat-row">';
        html += '<span class="stat-name">' + roles[i] + ": " + escapeHtml(data.stat) + "</span>";
        html += renderStatValue(data.value, "percent");
        html += "</div>";
      }
    }
    html += "</div>";
    return html;
  }

  // ---- Event handlers ----
  function onFilterChange() {
    var filtered = getFilteredCompanions();
    renderList(filtered);
    if (selectedId) {
      var stillVisible = filtered.some(function (c) { return c.id === selectedId; });
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

    // Update selection highlight
    var items = listContainer.querySelectorAll(".list-item");
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle("selected", parseInt(items[i].getAttribute("data-id"), 10) === id);
    }

    // Find companion and render detail
    var companion = null;
    for (var j = 0; j < COMPANIONS_DATA.length; j++) {
      if (COMPANIONS_DATA[j].id === id) { companion = COMPANIONS_DATA[j]; break; }
    }
    renderDetail(companion);
  });

  searchInput.addEventListener("input", onFilterChange);
  filterSlot.addEventListener("change", onFilterChange);
  filterEnhancement.addEventListener("change", onFilterChange);
  filterStat.addEventListener("change", onFilterChange);

  // ---- Initial render ----
  renderList(COMPANIONS_DATA);
})();
