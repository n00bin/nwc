/* ============================================================
   NWCB Mounts Page
   ============================================================ */

(function () {
  // ---- Build lookup maps ----
  var combatMap = buildLookup(MOUNT_COMBAT_POWERS_DATA);
  var equipMap  = buildLookup(MOUNT_EQUIP_POWERS_DATA);
  var bonusMap  = buildLookup(MOUNT_INSIGNIA_BONUSES_DATA);

  // ---- Compute compatible insignia bonuses per mount ----
  // Check if a single slot can accept a required insignia type
  function slotAccepts(slotAllowed, requiredType) {
    for (var i = 0; i < slotAllowed.length; i++) {
      if (slotAllowed[i] === "*" || slotAllowed[i] === requiredType) return true;
    }
    return false;
  }

  // Recursive check: can we assign required[rIdx..] to some subset of unused slots?
  function canAssign(slots, required, rIdx, used) {
    if (rIdx >= required.length) return true;
    for (var s = 0; s < slots.length; s++) {
      if (used[s]) continue;
      if (slotAccepts(slots[s].allowed, required[rIdx])) {
        used[s] = true;
        if (canAssign(slots, required, rIdx + 1, used)) return true;
        used[s] = false;
      }
    }
    return false;
  }

  function getCompatibleBonuses(mount) {
    var slots = mount.insigniaSlots;
    if (!slots || slots.length === 0) return [];
    var result = [];
    for (var i = 0; i < MOUNT_INSIGNIA_BONUSES_DATA.length; i++) {
      var bonus = MOUNT_INSIGNIA_BONUSES_DATA[i];
      var req = bonus.requiredInsignias;
      if (!req || req.length > slots.length) continue;
      var used = [];
      for (var u = 0; u < slots.length; u++) used.push(false);
      if (canAssign(slots, req, 0, used)) {
        result.push(bonus);
      }
    }
    return result;
  }

  // Pre-compute for all mounts (used by filter)
  var mountBonusCache = {};
  for (var mi = 0; mi < MOUNTS_DATA.length; mi++) {
    var m = MOUNTS_DATA[mi];
    mountBonusCache[m.id] = getCompatibleBonuses(m);
  }

  // ---- DOM refs ----
  var searchInput   = document.getElementById("search");
  var filterCombat  = document.getElementById("filter-combat");
  var filterEquip   = document.getElementById("filter-equip");
  var filterBonus   = document.getElementById("filter-bonus");
  var listContainer = document.getElementById("mount-list");
  var listCount     = document.getElementById("list-count");
  var detailPanel   = document.getElementById("detail-panel");

  var selectedId = null;
  var currentQuery = "";

  // ---- Init nav ----
  renderNav("Mounts");

  // ---- Populate filter dropdowns ----
  populateFilter(filterCombat,
    uniqueSorted(MOUNTS_DATA, function (m) {
      var cp = combatMap[m.combatRef];
      return cp ? cp.name : null;
    }),
    "All Combat Powers"
  );

  populateFilter(filterEquip,
    uniqueSorted(MOUNTS_DATA, function (m) {
      var ep = equipMap[m.equipRef];
      return ep ? ep.name : null;
    }),
    "All Equip Powers"
  );

  var bonusNames = uniqueSorted(MOUNT_INSIGNIA_BONUSES_DATA, function (b) {
    return b.name;
  });
  populateFilter(filterBonus, bonusNames, "All Insignia Bonuses");

  // ---- Filter logic ----
  function getFilteredMounts() {
    var query       = searchInput.value.trim().toLowerCase();
    var combatVal   = filterCombat.value;
    var equipVal    = filterEquip.value;
    var bonusVal    = filterBonus.value;
    currentQuery = query;

    return MOUNTS_DATA.filter(function (m) {
      // Text search
      if (query) {
        var cp = combatMap[m.combatRef];
        var ep = equipMap[m.equipRef];
        var haystack = (m.name + " " + (cp ? cp.name : "") + " " + (ep ? ep.name : "")).toLowerCase();
        if (haystack.indexOf(query) === -1) return false;
      }
      // Combat power filter
      if (combatVal) {
        var cp2 = combatMap[m.combatRef];
        if (!cp2 || cp2.name !== combatVal) return false;
      }
      // Equip power filter
      if (equipVal) {
        var ep2 = equipMap[m.equipRef];
        if (!ep2 || ep2.name !== equipVal) return false;
      }
      // Insignia bonus filter — check computed compatible bonuses
      if (bonusVal) {
        var compatible = mountBonusCache[m.id] || [];
        var found = false;
        for (var bi = 0; bi < compatible.length; bi++) {
          if (compatible[bi].name === bonusVal) { found = true; break; }
        }
        if (!found) return false;
      }
      return true;
    });
  }

  // ---- Render list ----
  function renderList(mounts) {
    listCount.textContent = mounts.length + " of " + MOUNTS_DATA.length + " mounts";

    if (mounts.length === 0) {
      listContainer.innerHTML = '<div class="empty-state">No mounts match your filters</div>';
      return;
    }

    var html = "";
    for (var i = 0; i < mounts.length; i++) {
      var m = mounts[i];
      var sel = m.id === selectedId ? " selected" : "";
      var name = currentQuery ? highlightMatch(m.name, currentQuery) : escapeHtml(m.name);
      html += '<div class="list-item' + sel + '" data-id="' + m.id + '">';
      html += '<span class="item-name">' + name + "</span>";
      html += "</div>";
    }
    listContainer.innerHTML = html;
  }

  // ---- Render detail ----
  function renderDetail(mount) {
    if (!mount) {
      detailPanel.innerHTML = '<div class="empty-state">Select a mount to view details</div>';
      return;
    }

    var cp = combatMap[mount.combatRef];
    var ep = equipMap[mount.equipRef];
    var compatibleBonuses = mountBonusCache[mount.id] || [];

    var html = "";

    // Mount name
    html += '<h2 style="margin-bottom:0.75rem;">' + escapeHtml(mount.name) + "</h2>";

    // ---- Combat Power ----
    html += '<div class="section-header">Combat Power</div>';
    if (cp) {
      html += '<div class="detail-name">' + escapeHtml(cp.name) + "</div>";
      html += '<div class="detail-meta">';
      html += "<span>IL " + formatNumber(cp.item_level) + "</span>";
      if (cp.magnitude) html += "<span>Magnitude " + formatNumber(cp.magnitude) + "</span>";
      html += "<span>Recharge " + cp.rechargeTimeSeconds + "s</span>";
      html += "</div>";

      // Equip bonuses from combat power
      if (cp.equipBonuses && cp.equipBonuses.length > 0) {
        html += renderCombatBonuses(cp.equipBonuses);
      }

      if (cp.notes) {
        html += '<div class="effect-text">' + escapeHtml(cp.notes) + "</div>";
      }
    } else {
      html += '<div class="detail-meta">No combat power data</div>';
    }

    // ---- Equip Power ----
    html += '<div class="section-header">Equip Power</div>';
    if (ep) {
      html += '<div class="detail-name">' + escapeHtml(ep.name) + "</div>";
      html += '<div class="detail-meta">';
      html += "<span>IL " + formatNumber(ep.item_level) + "</span>";
      html += "<span>Combined Rating " + formatNumber(ep.combinedRating) + "</span>";
      html += "</div>";

      if (ep.stats && ep.stats.length > 0) {
        html += renderStatsTable(ep.stats);
      }

      // Stacking buff
      if (ep.stackingBuff) {
        html += renderStackingBuff(ep.stackingBuff);
      }

      if (ep.notes) {
        html += '<div class="effect-text">' + escapeHtml(ep.notes) + "</div>";
      }
    } else {
      html += '<div class="detail-meta">No equip power data</div>';
    }

    // ---- Insignia Bonuses (all compatible) ----
    html += '<div class="section-header">Compatible Insignia Bonuses (' + compatibleBonuses.length + ')</div>';
    if (compatibleBonuses.length > 0) {
      for (var bi = 0; bi < compatibleBonuses.length; bi++) {
        var ib = compatibleBonuses[bi];
        html += '<div class="card" style="margin-bottom:0.6rem;padding:0.8rem;">';
        html += '<div class="detail-name">' + escapeHtml(ib.name) + "</div>";

        // Required insignias
        if (ib.requiredInsignias && ib.requiredInsignias.length > 0) {
          html += '<div style="margin:0.3rem 0;">';
          for (var ri = 0; ri < ib.requiredInsignias.length; ri++) {
            html += renderInsigniaBadge(ib.requiredInsignias[ri]) + " ";
          }
          html += "</div>";
        }

        // Stats from bonus
        if (ib.stats && ib.stats.length > 0) {
          html += renderStatsTable(ib.stats);
        }

        if (ib.effectText) {
          html += '<div class="effect-text">' + escapeHtml(ib.effectText) + "</div>";
        }
        html += "</div>";
      }
    } else {
      html += '<div class="detail-meta">No compatible insignia bonuses</div>';
    }

    // ---- Insignia Slots ----
    html += '<div class="section-header">Insignia Slots</div>';
    if (mount.insigniaSlots && mount.insigniaSlots.length > 0) {
      html += '<div class="insignia-slots-grid">';
      for (var s = 0; s < mount.insigniaSlots.length; s++) {
        var slot = mount.insigniaSlots[s];
        html += '<div class="insignia-slot-box">';
        html += '<div class="slot-label">Slot ' + (s + 1) + "</div>";
        for (var a = 0; a < slot.allowed.length; a++) {
          html += renderInsigniaBadge(slot.allowed[a]) + " ";
        }
        if (slot.preferred) {
          html += '<div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.2rem;">Preferred: ' + escapeHtml(slot.preferred) + "</div>";
        }
        html += "</div>";
      }
      html += "</div>";
    } else {
      html += '<div class="detail-meta">No insignia slots</div>';
    }

    // ---- Notes ----
    if (mount.notes) {
      html += '<div class="section-header">Notes</div>';
      html += '<div class="effect-text">' + escapeHtml(mount.notes) + "</div>";
    }

    detailPanel.innerHTML = html;
  }

  // ---- Render combat power equip bonuses (handles roleMap) ----
  function renderCombatBonuses(bonuses) {
    var html = "";
    for (var i = 0; i < bonuses.length; i++) {
      var b = bonuses[i];

      // Role-mapped bonus
      if (b.roleMap) {
        html += '<div class="proc-block">';
        html += '<div class="proc-label">Role-specific effects</div>';
        var roles = ["DPS", "Tank", "Heal"];
        for (var r = 0; r < roles.length; r++) {
          var rm = b.roleMap[roles[r]];
          if (rm) {
            html += '<div class="stat-row">';
            html += '<span class="stat-name">' + roles[r] + ": " + escapeHtml(rm.stat) + "</span>";
            html += renderStatValue(rm.amount, "percent");
            html += "</div>";
          }
        }
        html += "</div>";
      } else {
        // Flat bonus
        var scope = b.scope ? " (" + b.scope + ")" : "";
        html += '<div class="stat-row">';
        html += '<span class="stat-name">' + escapeHtml(b.stat) + escapeHtml(scope) + "</span>";
        html += renderStatValue(b.amount, "percent");
        html += "</div>";
      }
    }
    return html;
  }

  // ---- Render stacking buff ----
  function renderStackingBuff(sb) {
    var html = '<div class="proc-block">';
    html += '<div class="proc-label">Stacking Buff</div>';
    if (sb.trigger) {
      html += '<div><span class="stat-name">Trigger:</span> ' + escapeHtml(sb.trigger) + "</div>";
    }
    if (sb.perStack) {
      var keys = Object.keys(sb.perStack);
      for (var k = 0; k < keys.length; k++) {
        html += '<div class="stat-row">';
        html += '<span class="stat-name">Per stack: ' + escapeHtml(keys[k]) + "</span>";
        html += renderStatValue(sb.perStack[keys[k]], "percent");
        html += "</div>";
      }
    }
    if (sb.maxStacks) {
      html += "<div><span class=\"stat-name\">Max stacks:</span> " + sb.maxStacks + "</div>";
    }
    if (sb.duration) {
      html += "<div><span class=\"stat-name\">Duration:</span> " + sb.duration + "s</div>";
    }
    html += "</div>";
    return html;
  }

  // ---- Event handlers ----
  function onFilterChange() {
    var filtered = getFilteredMounts();
    renderList(filtered);
    // Keep selection if still visible
    if (selectedId) {
      var stillVisible = filtered.some(function (m) { return m.id === selectedId; });
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

    // Find mount and render detail
    var mount = null;
    for (var j = 0; j < MOUNTS_DATA.length; j++) {
      if (MOUNTS_DATA[j].id === id) { mount = MOUNTS_DATA[j]; break; }
    }
    renderDetail(mount);
  });

  searchInput.addEventListener("input", onFilterChange);
  filterCombat.addEventListener("change", onFilterChange);
  filterEquip.addEventListener("change", onFilterChange);
  filterBonus.addEventListener("change", onFilterChange);

  // ---- Initial render ----
  renderList(MOUNTS_DATA);
})();
