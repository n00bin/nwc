/* ============================================================
   NWCB Mounts Page
   ============================================================ */

(function () {
  // ---- Build lookup maps ----
  var combatMap = buildLookup(MOUNT_COMBAT_POWERS_DATA);
  var equipMap  = buildLookup(MOUNT_EQUIP_POWERS_DATA);
  var bonusMap  = buildLookup(MOUNT_INSIGNIA_BONUSES_DATA);

  // ---- Stacking badge helper ----
  function renderStackBadge(bonus) {
    if (!bonus.maxStacks) return "";
    var label, color;
    if (bonus.maxStacks === 1) {
      label = "1x only";
      color = "var(--stat-negative)";
    } else {
      label = "Max " + bonus.maxStacks + "x";
      color = "var(--highlight)";
    }
    var html = ' <span class="badge" style="background:' + color + ';color:#000;font-size:0.7rem;padding:0.1rem 0.35rem;">' + label + '</span>';
    if (bonus.exclusiveWith) {
      html += ' <span style="font-size:0.7rem;color:var(--text-muted);font-style:italic;">excl. ' + escapeHtml(bonus.exclusiveWith) + '</span>';
    }
    return html;
  }

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

  // True if there is some assignment of the bonus's required insignias to this
  // mount's slots such that a preferred slot ends up holding its preferred type
  // (granting the +20% IL/stat bonus). Mirrors the 3-slot truncation rule used
  // by getCompatibleBonuses below.
  function bonusActivatesPreferred(mount, bonus) {
    var slots = mount.insigniaSlots || [];
    var required = bonus && bonus.requiredInsignias ? bonus.requiredInsignias : [];
    if (!required.length || !slots.length) return false;
    var checkSlots = (required.length <= 3 && slots.length > 3) ? slots.slice(0, 3) : slots;
    for (var pi = 0; pi < checkSlots.length; pi++) {
      var pref = checkSlots[pi].preferred;
      if (!pref || pref === "unknown" || pref === true) continue;
      if (required.indexOf(pref) === -1) continue;
      var remainingReq = required.slice();
      remainingReq.splice(remainingReq.indexOf(pref), 1);
      var used = [];
      for (var u = 0; u < checkSlots.length; u++) used.push(u === pi);
      if (canAssign(checkSlots, remainingReq, 0, used)) return true;
    }
    return false;
  }

  // canAssign variant that records which insignia type each slot received
  // into the assignment[] out-array. Same backtracking shape as canAssign.
  function tryAssignWithRecord(slots, required, rIdx, used, assignment) {
    if (rIdx >= required.length) return true;
    for (var s = 0; s < slots.length; s++) {
      if (used[s]) continue;
      if (slotAccepts(slots[s].allowed, required[rIdx])) {
        used[s] = true;
        assignment[s] = required[rIdx];
        if (tryAssignWithRecord(slots, required, rIdx + 1, used, assignment)) return true;
        used[s] = false;
        assignment[s] = null;
      }
    }
    return false;
  }

  // Returns an array (length = checkSlots.length) of insignia types in slot
  // order, representing how this bonus's required insignias would be placed
  // onto the mount's slots. Prefers an assignment that lands a preferred-type
  // insignia in a preferred slot (activating the +20% IL/stat bonus). Returns
  // null if no valid assignment exists.
  function assignBonusToSlots(mount, bonus) {
    var slots = mount.insigniaSlots || [];
    var required = bonus && bonus.requiredInsignias ? bonus.requiredInsignias : [];
    if (!required.length || !slots.length) return null;
    var checkSlots = (required.length <= 3 && slots.length > 3) ? slots.slice(0, 3) : slots;

    // First: try to find an assignment that activates a preferred slot
    for (var pi = 0; pi < checkSlots.length; pi++) {
      var pref = checkSlots[pi].preferred;
      if (!pref || pref === "unknown" || pref === true) continue;
      if (required.indexOf(pref) === -1) continue;
      var remainingReq = required.slice();
      remainingReq.splice(remainingReq.indexOf(pref), 1);
      var assignment = [];
      var used = [];
      for (var u = 0; u < checkSlots.length; u++) {
        assignment.push(u === pi ? pref : null);
        used.push(u === pi);
      }
      if (tryAssignWithRecord(checkSlots, remainingReq, 0, used, assignment)) {
        return assignment;
      }
    }
    // Fallback: any valid assignment
    var assignment2 = [];
    var used2 = [];
    for (var u2 = 0; u2 < checkSlots.length; u2++) {
      assignment2.push(null);
      used2.push(false);
    }
    if (tryAssignWithRecord(checkSlots, required, 0, used2, assignment2)) {
      return assignment2;
    }
    return null;
  }

  // Render insignia badges in slot order using the assignment from
  // assignBonusToSlots. Falls back to canonical requiredInsignias order
  // if no valid assignment is found (defensive — shouldn't happen for
  // bonuses already filtered as compatible).
  function renderSlotOrderedBadges(mount, bonus) {
    var assignment = assignBonusToSlots(mount, bonus);
    var html = "";
    if (assignment) {
      for (var ai = 0; ai < assignment.length; ai++) {
        if (assignment[ai] !== null) {
          html += renderInsigniaBadge(assignment[ai]) + " ";
        }
      }
    } else if (bonus.requiredInsignias) {
      for (var ri = 0; ri < bonus.requiredInsignias.length; ri++) {
        html += renderInsigniaBadge(bonus.requiredInsignias[ri]) + " ";
      }
    }
    return html;
  }

  function getCompatibleBonuses(mount) {
    var slots = mount.insigniaSlots;
    if (!slots || slots.length === 0) return [];
    var result = [];
    for (var i = 0; i < MOUNT_INSIGNIA_BONUSES_DATA.length; i++) {
      var bonus = MOUNT_INSIGNIA_BONUSES_DATA[i];
      var req = bonus.requiredInsignias;
      if (!req) continue;
      // 3-slot bonuses can only use the first 3 slots; 4-slot bonuses use all 4
      var checkSlots = (req.length <= 3 && slots.length > 3) ? slots.slice(0, 3) : slots;
      if (req.length > checkSlots.length) continue;
      var used = [];
      for (var u = 0; u < checkSlots.length; u++) used.push(false);
      if (canAssign(checkSlots, req, 0, used)) {
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
  var filterBonus     = document.getElementById("filter-bonus");
  var togglePreferred = document.getElementById("toggle-preferred");
  var toggle4Slot     = document.getElementById("toggle-4slot");
  var listContainer   = document.getElementById("mount-list");
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
      // 4-slot only toggle
      if (toggle4Slot.checked) {
        var slotCount = m.insigniaSlots ? m.insigniaSlots.length : 0;
        if (slotCount < 4) return false;
      }
      // Preferred slot toggle
      if (togglePreferred.checked) {
        var slots = m.insigniaSlots || [];
        if (bonusVal) {
          // Find the selected bonus
          var selectedBonus = null;
          for (var sbi = 0; sbi < MOUNT_INSIGNIA_BONUSES_DATA.length; sbi++) {
            if (MOUNT_INSIGNIA_BONUSES_DATA[sbi].name === bonusVal) {
              selectedBonus = MOUNT_INSIGNIA_BONUSES_DATA[sbi]; break;
            }
          }
          var required = selectedBonus ? selectedBonus.requiredInsignias : [];
          // Check: can this mount activate the bonus WITH the preferred
          // slot actually using its preferred type (not overridden)?
          // Find preferred slots and try to assign the bonus requirements
          // such that at least one preferred slot holds its preferred type.
          var prefMatch = false;
          for (var pi = 0; pi < slots.length; pi++) {
            var pref = slots[pi].preferred;
            if (!pref || pref === "unknown" || pref === true) continue;
            // Does this preferred type appear in the required list?
            var prefInRequired = required.indexOf(pref) !== -1;
            if (!prefInRequired) continue;
            // Try assigning: lock this slot to its preferred type,
            // then see if remaining required types fit remaining slots
            var remainingReq = required.slice();
            // Remove one instance of the preferred type from requirements
            var prefIdx = remainingReq.indexOf(pref);
            remainingReq.splice(prefIdx, 1);
            // Try to assign remaining requirements to other slots
            var used = [];
            for (var u = 0; u < slots.length; u++) used.push(u === pi);
            if (canAssign(slots, remainingReq, 0, used)) {
              prefMatch = true; break;
            }
          }
          if (!prefMatch) return false;
        } else {
          // No bonus selected — just check if mount has any preferred slot
          var hasPreferred = false;
          for (var pi2 = 0; pi2 < slots.length; pi2++) {
            if (slots[pi2].preferred) { hasPreferred = true; break; }
          }
          if (!hasPreferred) return false;
        }
      }
      return true;
    });
  }

  // ---- Render list ----
  function renderList(mounts) {
    mounts.sort(function (a, b) { return a.name.localeCompare(b.name); });
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
      var listImg = window.MOUNT_IMAGES && window.MOUNT_IMAGES[m.name];
      html += '<div class="list-item' + sel + '" data-id="' + m.id + '">';
      html += '<span class="item-name" style="display:flex;align-items:center;">';
      if (listImg) {
        html += '<img class="list-icon" src="images/mounts/' + listImg + '" alt="">';
      }
      html += name + "</span>";
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
    var bonusVal = filterBonus.value;

    var html = "";

    // Mount name with icon
    var mountImg = window.MOUNT_IMAGES && window.MOUNT_IMAGES[mount.name];
    html += '<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.25rem;">';
    if (mountImg) {
      html += '<img class="mount-icon" src="images/mounts/' + mountImg + '" alt="">';
    }
    html += '<h2 style="margin:0;">' + escapeHtml(mount.name) + "</h2>";
    html += "</div>";
    if (mount.source) {
      html += '<div style="margin-bottom:0.75rem;font-size:0.85rem;"><span style="color:var(--text-muted);">Source: </span><span style="color:var(--highlight);">' + escapeHtml(mount.source) + "</span></div>";
    }

    // ---- Pinned selected insignia bonus ----
    if (bonusVal) {
      var pinnedBonus = null;
      for (var pbi = 0; pbi < compatibleBonuses.length; pbi++) {
        if (compatibleBonuses[pbi].name === bonusVal) { pinnedBonus = compatibleBonuses[pbi]; break; }
      }
      if (pinnedBonus) {
        html += '<div class="pinned-bonus">';
        html += '<div class="section-header" style="margin-top:0;">Selected Insignia Bonus</div>';
        html += '<div class="detail-name">' + escapeHtml(pinnedBonus.name) + renderStackBadge(pinnedBonus) + "</div>";
        if (pinnedBonus.requiredInsignias && pinnedBonus.requiredInsignias.length > 0) {
          html += '<div style="margin:0.3rem 0;">';
          html += renderSlotOrderedBadges(mount, pinnedBonus);
          html += "</div>";
        }
        if (pinnedBonus.stats && pinnedBonus.stats.length > 0) {
          html += renderStatsTable(pinnedBonus.stats);
        }
        if (pinnedBonus.effectText) {
          html += '<div class="effect-text">' + escapeHtml(pinnedBonus.effectText) + "</div>";
        }
        html += "</div>";
      }
    }

    // ---- Insignia Slots (at top) ----
    html += '<div class="section-header">Insignia Slots</div>';
    if (mount.insigniaSlots && mount.insigniaSlots.length > 0) {
      html += '<div class="proc-block">';
      html += '<div class="insignia-slots-grid">';
      for (var s = 0; s < mount.insigniaSlots.length; s++) {
        var slot = mount.insigniaSlots[s];
        html += '<div class="insignia-slot-box">';
        html += '<div class="slot-label">Slot ' + (s + 1) + "</div>";
        for (var a = 0; a < slot.allowed.length; a++) {
          html += renderInsigniaBadge(slot.allowed[a]) + " ";
        }
        if (slot.preferred) {
          html += '<div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.2rem;" title="Preferred slot grants +20% IL & stats when this insignia type is equipped"><span style="color:var(--highlight);">&#9733;</span> Preferred: ' + escapeHtml(String(slot.preferred)) + "</div>";
        }
        html += "</div>";
      }
      html += "</div>";
      html += "</div>";
    } else {
      html += '<div class="detail-meta">No insignia slots</div>';
    }

    // ---- Combat Power ----
    html += '<div class="section-header">Combat Power</div>';
    if (cp) {
      html += '<div class="proc-block">';
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
      html += "</div>"; // close proc-block

      if (cp.notes) {
        html += '<div class="effect-text">' + escapeHtml(cleanNotes(cp.notes)) + "</div>";
      }
    } else {
      html += '<div class="detail-meta">No combat power data</div>';
    }

    // ---- Equip Power ----
    html += '<div class="section-header">Equip Power</div>';
    if (ep) {
      html += '<div class="proc-block">';
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
      html += "</div>"; // close proc-block

      if (ep.notes) {
        html += '<div class="effect-text">' + escapeHtml(cleanNotes(ep.notes)) + "</div>";
      }
    } else {
      html += '<div class="detail-meta">No equip power data</div>';
    }

    // ---- Insignia Bonuses (all compatible, collapsible) ----
    html += '<div class="section-header">Compatible Insignia Bonuses (' + compatibleBonuses.length + ')</div>';
    if (compatibleBonuses.length > 0) {
      for (var bi = 0; bi < compatibleBonuses.length; bi++) {
        var ib = compatibleBonuses[bi];
        var activatesPref = bonusActivatesPreferred(mount, ib);
        html += '<div class="card ib-collapse" style="margin-bottom:0.6rem;padding:0.6rem 0.8rem;cursor:pointer;">';
        // Header row (always visible) - name + insignia badges
        html += '<div class="ib-header" style="display:flex;justify-content:space-between;align-items:center;">';
        html += '<div>';
        html += '<span style="font-weight:600;">' + escapeHtml(ib.name) + "</span>";
        if (activatesPref) {
          html += ' <span title="Activates preferred slot (+20% IL & stats)" style="color:var(--highlight);font-size:0.95em;">&#9733;</span>';
        }
        html += renderStackBadge(ib);
        if (ib.requiredInsignias && ib.requiredInsignias.length > 0) {
          html += '<span style="margin-left:0.5rem;">';
          html += renderSlotOrderedBadges(mount, ib);
          html += "</span>";
        }
        html += '</div>';
        html += '<span class="ib-arrow" style="color:var(--text-muted);font-size:0.8rem;transition:transform 0.2s;">&#9654;</span>';
        html += "</div>";
        // Body (hidden by default)
        html += '<div class="ib-body" style="display:none;margin-top:0.5rem;">';
        if (ib.stats && ib.stats.length > 0) {
          html += renderStatsTable(ib.stats);
        }
        if (ib.effectText) {
          html += '<div class="effect-text">' + escapeHtml(ib.effectText) + "</div>";
        }
        html += "</div>";
        html += "</div>";
      }
    } else {
      html += '<div class="detail-meta">No compatible insignia bonuses</div>';
    }

    // ---- Notes ----
    if (mount.notes) {
      html += '<div class="section-header">Notes</div>';
      html += '<div class="effect-text">' + escapeHtml(cleanNotes(mount.notes)) + "</div>";
    }

    detailPanel.innerHTML = html;

    // Wire up collapsible insignia bonus cards
    var ibCards = detailPanel.querySelectorAll(".ib-collapse");
    for (var ibc = 0; ibc < ibCards.length; ibc++) {
      ibCards[ibc].addEventListener("click", function () {
        var body = this.querySelector(".ib-body");
        var arrow = this.querySelector(".ib-arrow");
        if (body.style.display === "none") {
          body.style.display = "";
          arrow.style.transform = "rotate(90deg)";
          this.style.borderColor = "var(--accent)";
        } else {
          body.style.display = "none";
          arrow.style.transform = "";
          this.style.borderColor = "";
        }
      });
    }
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
  togglePreferred.addEventListener("change", onFilterChange);
  toggle4Slot.addEventListener("change", onFilterChange);

  // ============================================================
  // Ranking Views
  // ============================================================
  var tabLookup  = document.getElementById("tab-lookup");
  var tabTrial   = document.getElementById("tab-trial");
  var tabDungeon = document.getElementById("tab-dungeon");
  var tabStdps   = document.getElementById("tab-stdps");
  var tabEquip   = document.getElementById("tab-equip");
  var lookupView     = document.getElementById("lookup-view");
  var lookupControls = document.getElementById("lookup-controls");
  var trialView   = document.getElementById("trial-view");
  var dungeonView = document.getElementById("dungeon-view");
  var stdpsView   = document.getElementById("stdps-view");
  var equipView   = document.getElementById("equip-view");

  var combatData = [
    { rank: 1, power: "Perilous Polymorph Potion", effect: "-7.5% to enemy Defense and Critical Avoidance", mounts: ["Hag's Enchanted Cauldron"] },
    { rank: 2, power: "Grand Inspiration", effect: "1,000 magnitude damage, all allies gain +15% damage or damage resist or healing depending on role", mounts: ["Pegasus"] },
    { rank: 3, power: "Mighty Dragon's Roar", effect: "-15% to target's Critical Avoidance and outgoing damage, +15% damage to caster and +15% Crit Strike + Accuracy", mounts: ["Red Dragon"] },
    { rank: 4, power: "Necrotic Roar", effect: "+16% incoming damage received by targets, reduces their Accuracy by 16%", mounts: ["Glorious Undead Lion"] },
    { rank: 5, power: "Ethereal Vortex", effect: "+16% incoming damage received by targets, reduces their outgoing damage by 16%", mounts: ["Twice-Pale Alder"] },
    { rank: 6, power: "Phantasmic Wake", effect: "+16% incoming damage received by targets, reduces their Critical Strike by 16%", mounts: ["Phantom Panther"] },
    { rank: 7, power: "Bat Swarm", effect: "+15% incoming damage received by target, -15% outgoing damage and Critical Chance", mounts: ["Swarm"] },
    { rank: 8, power: "Eclipsed Armament", effect: "600 magnitude damage, +15% incoming damage received and -15% outgoing damage to targets", mounts: ["Eclipse Lion", "Neo Eclipse Lion"] },
    { rank: 9, power: "Mythic Tyrannosaurus Rex'em", effect: "6s Root to controllable targets, +15% incoming damage received, minion consume", mounts: ["King of Spines"] },
    { rank: 10, power: "Psionic Blast", effect: "+15% incoming damage received to targets", mounts: ["Brain Stealer Dragon"] },
    { rank: 11, power: "Hot Streak", effect: "+15% incoming damage received to targets within magma pools", mounts: ["Bestial Fire Archon"] },
    { rank: 12, power: "Meteoric Impact", effect: "750 magnitude damage, 20 magnitude DoT for 10s, +11% damage taken by targets", mounts: ["Legendary Barlgura", "Barlgura"] },
    { rank: 13, power: "Marvelous Balloon Bombardment", effect: "800 magnitude, +7.5% damage taken by targets. Treasure increases a random stat by 1.5% for 10s", mounts: ["Marvelous Reconnaissance Balloons", "Legendary Reconnaissance Balloons"] },
    { rank: 14, power: "Cauldron Gasses", effect: "115 magnitude DoT for 10s, all allies gain +15% Accuracy + Combat Advantage", mounts: ["Hag's Cooking Cauldron"] },
    { rank: 15, power: "Frozen Retribution", effect: "+15% damage buff to caster. Target is 13% slowed, -15% Deflect, -15% damage, -13% Crit Chance", mounts: ["Frost Salamander", "Rimefire Salamander"] },
  ];

  var stdpsData = [
    { rank: 1, power: "Infernal Pounce", effect: "Physical 3,938 + 394 magnitude damage against control immune enemies", mounts: ["Demonic Gravehound"] },
    { rank: 2, power: "Grubshank SMAAASH", effect: "Magical 2,362 + 2,264 DoT for 5s", mounts: ["Grubshank the Burdened"] },
    { rank: 3, power: "Hell on Faer\u00fbn", effect: "Magical 1,969 + 2,264 DoT for 5s", mounts: ["Legendary Hellfire Engine"] },
    { rank: 4, power: "Tunnel Vision", effect: "Magical 3,938 magnitude damage", mounts: ["Maltese Tiger", "Giant Crab", "Heavy Worg", "Leopard of Chult", "Armored Bear", "Polar Bear", "Hell Hound", "Wolf of the Wild Hunt", "Hellfire Engine", "Epic Giant Toad", "Cavalry Tyrannosaur", "Aberrant Fey Wolf", "Aberrant Drake", "Savage Polar Bear", "Owlbear", "Bulette", "Panther", "Moonbear", "Crag Cat", "Turmish Lion", "and many more"] },
    { rank: 5, power: "Giant Toad Tongue Lash", effect: "Magical 3,938 magnitude damage", mounts: ["Legendary Giant Toad"] },
    { rank: 6, power: "Golden Touch", effect: "Magical 3,938 magnitude damage", mounts: ["Golden Warhorse"] },
    { rank: 7, power: "Bigby's Crushing Hand", effect: "Physical 3,347 + 591 magnitude damage against control immune enemies", mounts: ["Bigby's Hand"] },
  ];

  var equipData = [
    { rank: 1, power: "Pack Tactics", effect: "+2,953 Combat Advantage and Awareness to you and party members within 80'", mounts: ["Ebon Riding Lizard"] },
    { rank: 2, power: "Mystic Aura", effect: "+2,953 Power and Accuracy to you and party members within 80'", mounts: ["Myconid Bulette"] },
    { rank: 3, power: "Runic Aura", effect: "+2,953 Power and Defense to you and party members within 80'", mounts: ["Runeclad Manticore", "Manticore", "Royal Winter Sled", "Snowclad Manticore"] },
    { rank: 4, power: "Avian Aura", effect: "Forte and Power to you and party members", mounts: ["Dragon Chicken"] },
    { rank: 5, power: "Providence", effect: "When you or a party member are struck, chance to heal for 6% of Max HP. You gain Radiant Weapon (+2% additional radiant damage per stack, up to 8 stacks)", mounts: ["Brain Stealer Dragon", "Swift Golden Lion"] },
    { rank: 6, power: "Ferocity", effect: "When you or a party member are struck, chance to gain Ferocity (+1.6% additional damage per stack, up to 3 stacks for 10s)", mounts: ["Turmish Lion"] },
  ];

  function renderCombatRanking(data, container, query) {
    query = (query || "").toLowerCase();
    var html = "";
    for (var i = 0; i < data.length; i++) {
      var d = data[i];
      if (query && (d.power + " " + d.effect + " " + (d.mounts || []).join(" ")).toLowerCase().indexOf(query) === -1) continue;
      html += '<div class="ranking-card" style="flex-direction:column;align-items:stretch;">';
      html += '<div style="font-weight:600;">';
      if (d.rank) html += '<span style="color:var(--highlight);margin-right:0.5rem;">#' + d.rank + '</span>';
      html += escapeHtml(d.power) + '</div>';
      if (d.mounts) {
        html += '<div style="font-size:0.85rem;color:var(--text-muted);margin-top:0.25rem;">' + d.mounts.map(function(m) { return escapeHtml(m); }).join(', ') + '</div>';
      }
      html += '<div class="effect-text" style="margin-top:0.4rem;">' + escapeHtml(d.effect) + '</div>';
      html += '</div>';
    }
    document.getElementById(container).innerHTML = html || '<div class="empty-state">No results match your search</div>';
  }

  function renderSimpleList(data, container) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
      var d = data[i];
      html += '<div class="ranking-card">';
      html += '<div style="font-weight:600;">' + escapeHtml(d.name) + '</div>';
      html += '<div class="effect-text" style="margin-top:0.4rem;">' + escapeHtml(d.effect) + '</div>';
      if (d.bonus) {
        html += '<div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.25rem;">Equip Power: ' + escapeHtml(d.bonus) + '</div>';
      }
      html += '</div>';
    }
    document.getElementById(container).innerHTML = html;
  }

  // Tab switching
  var tabCombat = document.getElementById("tab-combat");
  var combatView = document.getElementById("combat-view");
  var combatControls = document.getElementById("combat-controls");
  var combatSearchInput = document.getElementById("combat-search");
  var stdpsControls = document.getElementById("stdps-controls");
  var stdpsSearchInput = document.getElementById("stdps-search");
  var equipControls = document.getElementById("equip-controls");
  var equipSearchInput = document.getElementById("equip-search");

  var tabCollars = document.getElementById("tab-collars");
  var collarsView = document.getElementById("collars-view");
  var collarsControls = document.getElementById("collars-controls");
  var collarsSearch = document.getElementById("collars-search");
  var filterCollarCategory = document.getElementById("filter-collar-category");
  var filterCollarSlot = document.getElementById("filter-collar-slot");

  var activeRankingTab = "lookup";

  var tabInsignias = document.getElementById("tab-insignias");
  var insigniasView = document.getElementById("insignias-view");
  var insigniasControls = document.getElementById("insignias-controls");
  var filterInsigniaTemplate = document.getElementById("filter-insignia-template");
  var filterInsigniaTier = document.getElementById("filter-insignia-tier");
  var filterInsigniaCategory = document.getElementById("filter-insignia-category");

  var tabPlanner       = document.getElementById("tab-planner");
  var plannerView      = document.getElementById("planner-view");
  var plannerControls  = document.getElementById("planner-controls");
  var plannerEditor    = document.getElementById("planner-editor");
  var plannerResults   = document.getElementById("planner-results");
  var plannerAddBtn    = document.getElementById("planner-add-loadout");
  var plannerClearBtn  = document.getElementById("planner-clear");

  function switchMountTab(activeTab) {
    activeRankingTab = activeTab;
    var tabs = [tabLookup, tabCombat, tabStdps, tabEquip, tabCollars, tabInsignias, tabPlanner];
    for (var t = 0; t < tabs.length; t++) if (tabs[t]) tabs[t].classList.remove("active");
    lookupView.style.display = "none";
    lookupControls.style.display = "none";
    combatView.style.display = "none";
    combatControls.style.display = "none";
    stdpsView.style.display = "none";
    stdpsControls.style.display = "none";
    equipView.style.display = "none";
    equipControls.style.display = "none";
    if (collarsView) collarsView.style.display = "none";
    if (collarsControls) collarsControls.style.display = "none";
    if (insigniasView) insigniasView.style.display = "none";
    if (insigniasControls) insigniasControls.style.display = "none";
    if (plannerView) plannerView.style.display = "none";
    if (plannerControls) plannerControls.style.display = "none";
  }

  tabLookup.addEventListener("click", function () {
    switchMountTab("lookup");
    tabLookup.classList.add("active");
    lookupView.style.display = "";
    lookupControls.style.display = "";
  });
  tabCombat.addEventListener("click", function () {
    switchMountTab("combat");
    tabCombat.classList.add("active");
    combatView.style.display = "";
    combatControls.style.display = "";
    renderCombatRanking(combatData, "combat-list");
  });
  tabStdps.addEventListener("click", function () {
    switchMountTab("stdps");
    tabStdps.classList.add("active");
    stdpsView.style.display = "";
    stdpsControls.style.display = "";
    renderCombatRanking(stdpsData, "stdps-list");
  });
  tabEquip.addEventListener("click", function () {
    switchMountTab("equip");
    tabEquip.classList.add("active");
    equipView.style.display = "";
    equipControls.style.display = "";
    renderCombatRanking(equipData, "equip-list");
  });

  combatSearchInput.addEventListener("input", function () {
    renderCombatRanking(combatData, "combat-list", combatSearchInput.value);
  });
  stdpsSearchInput.addEventListener("input", function () {
    renderCombatRanking(stdpsData, "stdps-list", stdpsSearchInput.value);
  });
  equipSearchInput.addEventListener("input", function () {
    renderCombatRanking(equipData, "equip-list", equipSearchInput.value);
  });

  // ============================================================
  // Collars view
  // ============================================================
  var COLLAR_RANK_LABEL = { 1: "I (Uncommon)", 2: "II (Rare)", 3: "III (Epic)", 4: "IV (Legendary)", 5: "V (Mythic)" };
  var COLLAR_RANK_CLASS = { 1: "uncommon", 2: "rare", 3: "epic", 4: "legendary", 5: "mythic" };

  function parseCollarName(name) {
    var m = (name || "").match(/^(\w+)\s+(\w+)\s+Collar\s+(I{1,3}|IV|V)$/i);
    if (!m) return { category: "", slot: "", rank: 0 };
    var rankMap = { I: 1, II: 2, III: 3, IV: 4, V: 5 };
    return {
      category: m[1],
      slot: m[2],
      rank: rankMap[m[3].toUpperCase()] || 0
    };
  }

  function getCollarPercent(c) {
    // percentStats holds at most one entry per collar (eg {GloryBonus: 2.0})
    if (c.percentStats) {
      var keys = Object.keys(c.percentStats);
      if (keys.length > 0) return c.percentStats[keys[0]];
    }
    // Practical Regal collars store nothing in percentStats — value is in effectText
    var m = (c.effectText || "").match(/(\d+(?:\.\d+)?)\s*%/);
    return m ? parseFloat(m[1]) : null;
  }

  function buildCollarBonusText(c) {
    // "Glory Gain increased by 2%" -> "Glory Gain"
    return (c.effectText || "")
      .replace(/\s+increased\s+by\s+\d+(\.\d+)?\s*%\s*\.?\s*$/i, "")
      .replace(/\s+do\s+\d+(\.\d+)?\s*%\s+more\s+damage\s*\.?\s*$/i, " Damage")
      .replace(/\.\s*$/, "");
  }

  function populateCollarFilters() {
    if (typeof MOUNT_COLLARS_DATA === "undefined") return;
    var cats = {}, slots = {};
    for (var i = 0; i < MOUNT_COLLARS_DATA.length; i++) {
      var p = parseCollarName(MOUNT_COLLARS_DATA[i].name);
      if (p.category) cats[p.category] = true;
      if (p.slot) slots[p.slot] = true;
    }
    populateFilter(filterCollarCategory, Object.keys(cats).sort(), "All Categories");
    populateFilter(filterCollarSlot, Object.keys(slots).sort(), "All Types");
  }

  function renderCollars() {
    var listEl = document.getElementById("collars-list");
    if (!listEl) return;
    if (typeof MOUNT_COLLARS_DATA === "undefined") {
      listEl.innerHTML = '<div class="empty-state">Collar data is not available.</div>';
      return;
    }

    var query = (collarsSearch.value || "").trim().toLowerCase();
    var catFilter = filterCollarCategory.value;
    var slotFilter = filterCollarSlot.value;

    // Build rows: parse + filter + sort
    var rows = [];
    for (var i = 0; i < MOUNT_COLLARS_DATA.length; i++) {
      var c = MOUNT_COLLARS_DATA[i];
      var p = parseCollarName(c.name);
      if (catFilter && p.category !== catFilter) continue;
      if (slotFilter && p.slot !== slotFilter) continue;

      var bonusText = buildCollarBonusText(c);
      if (query) {
        var hay = (c.name + " " + (c.effectText || "") + " " + bonusText).toLowerCase();
        if (hay.indexOf(query) === -1) continue;
      }
      rows.push({
        category: p.category,
        slot: p.slot,
        rank: p.rank,
        bonusText: bonusText,
        effect: c.effectText || "",
        pct: getCollarPercent(c),
        combinedRating: c.combinedRating,
        itemLevel: c.item_level
      });
    }

    if (rows.length === 0) {
      listEl.innerHTML = '<div class="empty-state">No collars match your filters.</div>';
      return;
    }

    rows.sort(function (a, b) {
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      if (a.slot !== b.slot) return a.slot.localeCompare(b.slot);
      return a.rank - b.rank;
    });

    var html = '<table class="collars-table">';
    html += '<thead><tr>';
    html += '<th>Category</th><th>Type</th><th>Bonus</th><th>Rank</th><th style="text-align:right;">%</th><th style="text-align:right;">Combined Rating</th><th style="text-align:right;">Item Level</th>';
    html += '</tr></thead><tbody>';
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      var slotLower = (row.slot || "").toLowerCase();
      var rankLabel = COLLAR_RANK_LABEL[row.rank] || "—";
      var rankClass = COLLAR_RANK_CLASS[row.rank] || "";
      var pctText = row.pct == null ? "—" : (row.pct + "%");
      html += '<tr>';
      html += '<td>' + escapeHtml(row.category) + '</td>';
      html += '<td><span class="badge badge-' + escapeHtml(slotLower) + '" style="font-size:0.7rem;padding:0.15rem 0.55rem;">' + escapeHtml(row.slot) + '</span></td>';
      html += '<td>' + escapeHtml(row.bonusText) + '</td>';
      html += '<td><span class="collar-rank collar-rank-' + rankClass + '">' + escapeHtml(rankLabel) + '</span></td>';
      html += '<td style="text-align:right;font-family:var(--font-mono,monospace);">' + escapeHtml(pctText) + '</td>';
      html += '<td style="text-align:right;font-family:var(--font-mono,monospace);color:var(--text-secondary);">' + (row.combinedRating != null ? row.combinedRating.toLocaleString() : "—") + '</td>';
      html += '<td style="text-align:right;font-family:var(--font-mono,monospace);color:var(--text-secondary);">' + (row.itemLevel != null ? row.itemLevel.toLocaleString() : "—") + '</td>';
      html += '</tr>';
    }
    html += '</tbody></table>';
    listEl.innerHTML = html;
  }

  if (tabCollars) {
    populateCollarFilters();

    tabCollars.addEventListener("click", function () {
      switchMountTab("collars");
      tabCollars.classList.add("active");
      collarsView.style.display = "";
      collarsControls.style.display = "";
      renderCollars();
    });
    collarsSearch.addEventListener("input", renderCollars);
    filterCollarCategory.addEventListener("change", renderCollars);
    filterCollarSlot.addEventListener("change", renderCollars);
  }

  // ============================================================
  // Insignias view — aggregated by stat template, scaled per tier
  // ============================================================
  var INSIGNIA_TIER_ORDER = ["Celestial", "Mythic", "Legendary", "Epic", "Rare", "Uncommon"];
  var INSIGNIA_TIER_CLASS = {
    Celestial:  "tier-celestial",
    Mythic:     "collar-rank-mythic",
    Legendary:  "collar-rank-legendary",
    Epic:       "collar-rank-epic",
    Rare:       "collar-rank-rare",
    Uncommon:   "collar-rank-uncommon"
  };

  function prettyInsigniaStat(stat) {
    return String(stat)
      .replace(/MaximumHitPoints/, "Max HP")
      .replace(/CriticalStrike/,   "Crit Strike")
      .replace(/CriticalSeverity/, "Crit Severity")
      .replace(/CriticalAvoidance/,"Crit Avoidance")
      .replace(/ControlBonus/,     "Control Bonus")
      .replace(/ControlResist/,    "Control Resist")
      .replace(/OutgoingHealing/,  "Outgoing Healing")
      .replace(/GoldBonus/,        "Gold Bonus")
      .replace(/GloryBonus/,       "Glory Bonus");
  }

  // Group all 49 insignia items by statTemplate. All categories of a template
  // share the same Mythic-base stats and combinedRating.
  function buildInsigniaTemplates() {
    if (typeof MOUNT_INSIGNIAS_DATA === "undefined") return {};
    var byTemplate = {};
    for (var i = 0; i < MOUNT_INSIGNIAS_DATA.length; i++) {
      var ins = MOUNT_INSIGNIAS_DATA[i];
      var t = ins.statTemplate;
      if (!byTemplate[t]) {
        byTemplate[t] = {
          template: t,
          categories: [],
          stats: ins.stats,
          baseCombinedRating: ins.combinedRating
        };
      }
      if (byTemplate[t].categories.indexOf(ins.category) === -1) {
        byTemplate[t].categories.push(ins.category);
      }
    }
    return byTemplate;
  }

  function renderInsignias() {
    if (typeof MOUNT_INSIGNIAS_TIER_SCALING === "undefined") {
      document.getElementById("insignias-list").innerHTML =
        '<div class="empty-state">Insignia data not loaded.</div>';
      return;
    }
    var byTemplate = buildInsigniaTemplates();
    var templates = Object.keys(byTemplate).sort();
    var templateFilter = filterInsigniaTemplate.value;
    var tierFilter = filterInsigniaTier.value;
    var categoryFilter = filterInsigniaCategory.value;

    var rows = [];
    for (var ti = 0; ti < templates.length; ti++) {
      var t = byTemplate[templates[ti]];
      if (templateFilter && t.template !== templateFilter) continue;
      if (categoryFilter && t.categories.indexOf(categoryFilter) === -1) continue;

      for (var tii = 0; tii < INSIGNIA_TIER_ORDER.length; tii++) {
        var tier = INSIGNIA_TIER_ORDER[tii];
        if (tierFilter && tier !== tierFilter) continue;
        var scaling = MOUNT_INSIGNIAS_TIER_SCALING[tier];
        if (!scaling) continue;
        rows.push({
          template:        t.template,
          tier:            tier,
          item_level:      scaling.item_level,
          multiplier:      scaling.multiplier,
          stats:           t.stats,
          combinedRating:  Math.round(t.baseCombinedRating * scaling.multiplier),
          categories:      t.categories
        });
      }
    }

    if (rows.length === 0) {
      document.getElementById("insignias-list").innerHTML =
        '<div class="empty-state">No insignias match your filters.</div>';
      return;
    }

    var html = '<table class="insignias-table"><thead><tr>'
      + '<th>Name</th><th>Quality</th><th>Item Level</th><th>Stats</th><th>Slot Types</th>'
      + '</tr></thead><tbody>';
    for (var ri = 0; ri < rows.length; ri++) {
      var r = rows[ri];
      var tierClass = INSIGNIA_TIER_CLASS[r.tier] || "";
      html += "<tr>";
      html += "<td>" + escapeHtml(r.template) + "</td>";
      html += '<td><span class="' + tierClass + '" style="font-weight:600;">' + r.tier + "</span></td>";
      html += "<td>" + r.item_level + "</td>";
      // Stats column
      html += "<td>";
      for (var si = 0; si < r.stats.length; si++) {
        var st = r.stats[si];
        var label = prettyInsigniaStat(st.stat);
        var val;
        var suffix = "";
        if (st.type === "percent") {
          val = Math.round(st.value * r.multiplier * 10) / 10;
          suffix = "%";
        } else {
          val = Math.round(st.value * r.multiplier);
        }
        html += '<span class="stat-pill">' + escapeHtml(label) + ": " + val + suffix + "</span> ";
      }
      html += '<span class="stat-pill stat-pill-cr">Combined Rating: ' + r.combinedRating + "</span>";
      html += "</td>";
      // Slot types — pill color tinted by row quality
      html += "<td>";
      for (var ci = 0; ci < r.categories.length; ci++) {
        html += '<span class="insignia-cat-pill" data-tier="' + r.tier + '">'
              + escapeHtml(r.categories[ci]) + "</span> ";
      }
      html += "</td>";
      html += "</tr>";
    }
    html += "</tbody></table>";
    document.getElementById("insignias-list").innerHTML = html;
  }

  function populateInsigniaTemplateFilter() {
    if (!filterInsigniaTemplate) return;
    var byTemplate = buildInsigniaTemplates();
    var names = Object.keys(byTemplate).sort();
    for (var i = 0; i < names.length; i++) {
      var opt = document.createElement("option");
      opt.value = names[i];
      opt.textContent = names[i];
      filterInsigniaTemplate.appendChild(opt);
    }
  }

  if (tabInsignias) {
    populateInsigniaTemplateFilter();

    tabInsignias.addEventListener("click", function () {
      switchMountTab("insignias");
      tabInsignias.classList.add("active");
      insigniasView.style.display = "";
      insigniasControls.style.display = "";
      renderInsignias();
    });
    filterInsigniaTemplate.addEventListener("change", renderInsignias);
    filterInsigniaTier.addEventListener("change", renderInsignias);
    filterInsigniaCategory.addEventListener("change", renderInsignias);
  }

  // ============================================================
  // Loadout Planner
  // ============================================================
  var PLANNER_STORAGE_KEY = "nwcb.loadouts.v1";
  var ROLE_OPTIONS = ["DPS", "Tank", "Healer"];
  var MAX_BONUSES_PER_LOADOUT = 5;

  var plannerState = loadPlannerState();
  var plannerIdCounter = computeNextLoadoutId(plannerState.loadouts);

  function loadPlannerState() {
    try {
      var raw = localStorage.getItem(PLANNER_STORAGE_KEY);
      if (!raw) return { loadouts: [], excludedMounts: [] };
      var parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.loadouts)) return { loadouts: [], excludedMounts: [] };
      if (!Array.isArray(parsed.excludedMounts)) parsed.excludedMounts = [];
      return parsed;
    } catch (e) {
      return { loadouts: [], excludedMounts: [] };
    }
  }

  function savePlannerState() {
    try { localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(plannerState)); }
    catch (e) { /* quota — ignore */ }
  }

  function computeNextLoadoutId(loadouts) {
    var max = 0;
    for (var i = 0; i < loadouts.length; i++) {
      var m = /^ld(\d+)$/.exec(loadouts[i].id || "");
      if (m) { var n = parseInt(m[1], 10); if (n > max) max = n; }
    }
    return max + 1;
  }

  function newLoadoutId() { return "ld" + (plannerIdCounter++); }

  function findLoadout(id) {
    for (var i = 0; i < plannerState.loadouts.length; i++) {
      if (plannerState.loadouts[i].id === id) return plannerState.loadouts[i];
    }
    return null;
  }

  function addPlannerLoadout() {
    plannerState.loadouts.push({
      id: newLoadoutId(),
      name: "Loadout " + (plannerState.loadouts.length + 1),
      role: "DPS",
      desiredBonuses: []
    });
    savePlannerState();
    renderPlanner();
  }

  function deletePlannerLoadout(id) {
    plannerState.loadouts = plannerState.loadouts.filter(function (l) { return l.id !== id; });
    savePlannerState();
    renderPlanner();
  }

  function clearAllPlannerLoadouts() {
    if (!plannerState.loadouts.length) return;
    if (!window.confirm("Delete all loadouts? This cannot be undone.")) return;
    plannerState.loadouts = [];
    savePlannerState();
    renderPlanner();
  }

  function renderLoadoutCard(ld) {
    var html = '<div class="ranking-card" data-loadout-id="' + ld.id + '" style="flex-direction:column;align-items:stretch;gap:0.5rem;margin-bottom:0.75rem;">';
    html += '<div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">';
    html += '<input type="text" class="search-input planner-name" data-id="' + ld.id + '" value="' + escapeHtml(ld.name) + '" style="max-width:240px;">';
    html += '<select class="filter-select planner-role" data-id="' + ld.id + '">';
    for (var r = 0; r < ROLE_OPTIONS.length; r++) {
      var role = ROLE_OPTIONS[r];
      html += '<option value="' + role + '"' + (ld.role === role ? ' selected' : '') + '>' + role + '</option>';
    }
    html += '</select>';
    html += '<button class="filter-select planner-delete" data-id="' + ld.id + '" style="cursor:pointer;color:var(--stat-negative,#f85149);">Delete</button>';
    html += '</div>';
    html += '<div style="display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;">';
    for (var b = 0; b < ld.desiredBonuses.length; b++) {
      var bonus = bonusMap[ld.desiredBonuses[b]];
      if (!bonus) continue;
      html += '<span class="badge" style="background:var(--bg-elevated);border:1px solid var(--border-default);color:var(--text-primary);padding:0.2rem 0.5rem;display:inline-flex;align-items:center;gap:0.25rem;">';
      html += escapeHtml(bonus.name);
      html += '<button class="planner-remove-bonus" data-id="' + ld.id + '" data-index="' + b + '" style="background:transparent;border:none;color:var(--text-muted);cursor:pointer;font-weight:700;font-size:1rem;line-height:1;padding:0 0.15rem;">×</button>';
      html += '</span>';
    }
    if (ld.desiredBonuses.length < MAX_BONUSES_PER_LOADOUT) {
      html += '<select class="filter-select planner-add-bonus" data-id="' + ld.id + '">';
      html += '<option value="">+ Add Bonus…</option>';
      var sorted = MOUNT_INSIGNIA_BONUSES_DATA.slice().sort(function (a, b) {
        return (a.name || "").localeCompare(b.name || "");
      });
      for (var sb = 0; sb < sorted.length; sb++) {
        var sbo = sorted[sb];
        html += '<option value="' + sbo.id + '">' + escapeHtml(sbo.name) + '</option>';
      }
      html += '</select>';
      html += '<span style="color:var(--text-muted);font-size:0.75rem;">' + ld.desiredBonuses.length + '/' + MAX_BONUSES_PER_LOADOUT + ' slots used</span>';
    } else {
      html += '<span style="color:var(--text-muted);font-size:0.8rem;">All ' + MAX_BONUSES_PER_LOADOUT + ' slots filled</span>';
    }
    html += '</div></div>';
    return html;
  }

  function renderPlannerEditor() {
    if (!plannerState.loadouts.length) {
      plannerEditor.innerHTML = '<div class="empty-state">No loadouts yet. Click "+ Add Loadout" to start.</div>';
      return;
    }
    var html = "";
    for (var i = 0; i < plannerState.loadouts.length; i++) {
      html += renderLoadoutCard(plannerState.loadouts[i]);
    }
    plannerEditor.innerHTML = html;
  }

  function getCandidateMounts(bonus) {
    var excluded = plannerState.excludedMounts || [];
    var candidates = [];
    for (var mi = 0; mi < MOUNTS_DATA.length; mi++) {
      var m = MOUNTS_DATA[mi];
      if (excluded.indexOf(m.id) !== -1) continue;
      var compatible = mountBonusCache[m.id] || [];
      var hosts = false;
      for (var ci = 0; ci < compatible.length; ci++) {
        if (compatible[ci].id === bonus.id) { hosts = true; break; }
      }
      if (!hosts) continue;
      candidates.push({
        mount: m,
        preferred: bonusActivatesPreferred(m, bonus),
        slotCount: (m.insigniaSlots || []).length
      });
    }
    var bonusSize = (bonus.requiredInsignias || []).length;
    candidates.sort(function (a, b) {
      // Prefer mounts with exactly the bonus's slot count (fewer wasted slots = fewer extra insignias)
      var aExact = a.slotCount === bonusSize ? 0 : 1;
      var bExact = b.slotCount === bonusSize ? 0 : 1;
      if (aExact !== bExact) return aExact - bExact;
      if (a.preferred !== b.preferred) return a.preferred ? -1 : 1;
      return (a.mount.name || "").localeCompare(b.mount.name || "");
    });
    return candidates;
  }

  function renderBonusBlock(bonus, currentLoadout, sharingLoadoutNames, count) {
    var candidates = getCandidateMounts(bonus);
    var others = sharingLoadoutNames.filter(function (n) { return n !== currentLoadout.name; });
    var html = '<div style="margin:0.75rem 0 0.5rem;border-top:1px solid var(--border-default);padding-top:0.6rem;">';
    html += '<div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.4rem;">';
    html += '<span style="font-weight:600;color:var(--highlight);">' + escapeHtml(bonus.name) + '</span>';
    if (count > 1) {
      html += '<span style="font-size:0.75rem;font-weight:700;color:#000;background:var(--accent,#58a6ff);border-radius:var(--radius-sm);padding:0.1rem 0.4rem;">×' + count + ' (needs ' + count + ' distinct mounts)</span>';
    }
    var req = bonus.requiredInsignias || [];
    for (var r = 0; r < req.length; r++) html += renderInsigniaBadge(req[r]);
    if (others.length) {
      html += '<span style="font-size:0.72rem;font-weight:600;color:#000;background:#d29922;border-radius:var(--radius-sm);padding:0.1rem 0.4rem;">↔ Also wanted by: ' + escapeHtml(others.join(", ")) + '</span>';
    }
    html += '</div>';
    if (bonus.effectText) {
      html += '<div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.4rem;">' + escapeHtml(bonus.effectText) + '</div>';
    }
    if (!candidates.length) {
      html += '<div style="color:var(--stat-negative,#f85149);font-size:0.85rem;">No mount in the database can host this bonus.</div>';
    } else {
      html += '<div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.3rem;">' + candidates.length + ' candidate mount' + (candidates.length === 1 ? '' : 's') + ' (★ = a preferred slot can be filled with its preferred type)</div>';
      html += '<div style="display:flex;flex-wrap:wrap;gap:0.4rem;">';
      for (var c = 0; c < candidates.length; c++) {
        var cand = candidates[c];
        var prefStr = cand.preferred ? ' ★' : '';
        var slotInfo = cand.slotCount + '-slot';
        html += '<span style="display:inline-flex;align-items:center;gap:0.3rem;background:var(--bg-elevated);border:1px solid var(--border-default);border-radius:var(--radius-sm);padding:0.2rem 0.5rem;font-size:0.85rem;">';
        html += escapeHtml(cand.mount.name) + prefStr;
        html += '<span style="font-size:0.7rem;color:var(--text-muted);">' + slotInfo + '</span>';
        html += '</span>';
      }
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function renderLoadoutResultsCard(ld, bonusToLoadoutNames) {
    var html = '<div class="ranking-card" style="flex-direction:column;align-items:stretch;margin-bottom:1rem;">';
    html += '<div style="font-weight:700;font-size:1rem;color:var(--text-primary);margin-bottom:0.5rem;">';
    html += escapeHtml(ld.name) + ' <span style="color:var(--text-muted);font-weight:400;font-size:0.8rem;">— ' + escapeHtml(ld.role) + '</span>';
    html += '</div>';
    if (!ld.desiredBonuses.length) {
      html += '<div class="empty-state" style="padding:0.5rem;">No bonuses selected.</div>';
    } else {
      // Count occurrences per bonus to render each unique bonus once with a ×N badge
      var counts = {};
      var order = [];
      for (var b = 0; b < ld.desiredBonuses.length; b++) {
        var bid = ld.desiredBonuses[b];
        if (counts[bid] === undefined) { counts[bid] = 0; order.push(bid); }
        counts[bid]++;
      }
      for (var oi = 0; oi < order.length; oi++) {
        var bonus = bonusMap[order[oi]];
        if (!bonus) continue;
        html += renderBonusBlock(bonus, ld, bonusToLoadoutNames[bonus.id] || [], counts[bonus.id]);
      }
    }
    html += '</div>';
    return html;
  }

  function renderExcludedMountsBar() {
    var excluded = plannerState.excludedMounts || [];
    if (!excluded.length) return "";
    var mountById = {};
    for (var mi = 0; mi < MOUNTS_DATA.length; mi++) mountById[MOUNTS_DATA[mi].id] = MOUNTS_DATA[mi];
    var html = '<div class="ranking-card" style="flex-direction:column;align-items:stretch;margin-bottom:1rem;border-color:var(--border-default);">';
    html += '<div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.4rem;">';
    html += '<span style="font-weight:600;color:var(--text-secondary);">Excluded mounts</span>';
    html += '<span style="font-size:0.75rem;color:var(--text-muted);">(' + excluded.length + ' — these will not be recommended)</span>';
    html += '<button class="planner-clear-excluded" style="background:transparent;border:1px solid var(--border-default);border-radius:var(--radius-sm);color:var(--text-secondary);cursor:pointer;font-size:0.75rem;padding:0.15rem 0.5rem;margin-left:auto;">Restore all</button>';
    html += '</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:0.4rem;">';
    for (var i = 0; i < excluded.length; i++) {
      var m = mountById[excluded[i]];
      var name = m ? m.name : ('mount #' + excluded[i]);
      html += '<span style="display:inline-flex;align-items:center;gap:0.3rem;background:var(--bg-elevated);border:1px solid var(--border-default);border-radius:var(--radius-sm);padding:0.15rem 0.5rem;font-size:0.85rem;color:var(--text-muted);text-decoration:line-through;">';
      html += escapeHtml(name);
      html += '<button class="planner-restore-mount" data-mount="' + excluded[i] + '" title="Restore this mount" style="background:transparent;border:none;color:var(--accent,#58a6ff);cursor:pointer;font-weight:700;font-size:0.95rem;line-height:1;padding:0 0.15rem;text-decoration:none;">↻</button>';
      html += '</span>';
    }
    html += '</div></div>';
    return html;
  }

  function excludeMount(mountId) {
    if (!plannerState.excludedMounts) plannerState.excludedMounts = [];
    if (plannerState.excludedMounts.indexOf(mountId) === -1) {
      plannerState.excludedMounts.push(mountId);
      savePlannerState();
      renderPlanner();
    }
  }

  function restoreMount(mountId) {
    if (!plannerState.excludedMounts) return;
    plannerState.excludedMounts = plannerState.excludedMounts.filter(function (x) { return x !== mountId; });
    savePlannerState();
    renderPlanner();
  }

  function clearExcludedMounts() {
    if (!plannerState.excludedMounts || !plannerState.excludedMounts.length) return;
    plannerState.excludedMounts = [];
    savePlannerState();
    renderPlanner();
  }

  function computeSharingPlan() {
    var bonusStats = {};
    for (var i = 0; i < plannerState.loadouts.length; i++) {
      var ld = plannerState.loadouts[i];
      var localCount = {};
      for (var b = 0; b < ld.desiredBonuses.length; b++) {
        var bid = ld.desiredBonuses[b];
        localCount[bid] = (localCount[bid] || 0) + 1;
      }
      for (var key in localCount) {
        if (!bonusStats[key]) bonusStats[key] = { perLoadout: [], totalInstances: 0, maxPerLoadout: 0 };
        bonusStats[key].perLoadout.push({ name: ld.name, count: localCount[key] });
        bonusStats[key].totalInstances += localCount[key];
        if (localCount[key] > bonusStats[key].maxPerLoadout) bonusStats[key].maxPerLoadout = localCount[key];
      }
    }
    var rows = [];
    for (var bid2 in bonusStats) {
      var bonus = bonusMap[bid2];
      if (!bonus) continue;
      var s = bonusStats[bid2];
      var bonusSize = (bonus.requiredInsignias || []).length;
      var savings = (s.totalInstances - s.maxPerLoadout) * bonusSize;
      rows.push({ bonus: bonus, stats: s, bonusSize: bonusSize, savings: savings });
    }
    rows.sort(function (a, b) {
      if (a.savings !== b.savings) return b.savings - a.savings;
      return (a.bonus.name || "").localeCompare(b.bonus.name || "");
    });
    return rows;
  }

  function renderSharingSummary() {
    var rows = computeSharingPlan();
    if (!rows.length) return "";

    var totalSavings = 0;
    for (var s = 0; s < rows.length; s++) totalSavings += rows[s].savings;

    var html = '<div class="ranking-card" style="flex-direction:column;align-items:stretch;margin-bottom:1.25rem;border-color:var(--accent,#58a6ff);border-width:2px;">';
    html += '<div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.4rem;">';
    html += '<span style="font-weight:700;font-size:1.05rem;color:var(--accent,#58a6ff);">Insignia Sharing Plan</span>';
    if (totalSavings > 0) {
      html += '<span style="font-size:0.78rem;font-weight:700;color:#000;background:#3fb950;border-radius:var(--radius-sm);padding:0.15rem 0.5rem;">Total potential savings: ' + totalSavings + ' insignia upgrades</span>';
    }
    html += '</div>';
    html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:0.6rem;">For each bonus wanted across your loadouts, this shows the minimum number of distinct mounts you need — and which mounts to pick so the same insignia set covers every loadout that wants the bonus. Pick these mounts and slot insignias once.</div>';

    var usedMountIds = {};
    for (var ri = 0; ri < rows.length; ri++) {
      var r = rows[ri];
      var candidates = getCandidateMounts(r.bonus);
      var minMounts = Math.min(r.stats.maxPerLoadout, candidates.length);
      // Prefer mounts not yet picked for an earlier (higher-savings) bonus
      var unused = [];
      var alreadyUsed = [];
      for (var ci = 0; ci < candidates.length; ci++) {
        if (usedMountIds[candidates[ci].mount.id]) alreadyUsed.push(candidates[ci]);
        else unused.push(candidates[ci]);
      }
      var recommended = unused.slice(0, minMounts);
      var forcedReuseStart = recommended.length;
      if (recommended.length < minMounts) {
        recommended = recommended.concat(alreadyUsed.slice(0, minMounts - recommended.length));
      }
      for (var ui = 0; ui < recommended.length; ui++) {
        usedMountIds[recommended[ui].mount.id] = true;
      }

      html += '<div style="border-top:1px solid var(--border-default);padding-top:0.6rem;margin-top:0.5rem;">';
      html += '<div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.3rem;">';
      html += '<span style="font-weight:600;color:var(--highlight);">' + escapeHtml(r.bonus.name) + '</span>';
      var req = r.bonus.requiredInsignias || [];
      for (var rq = 0; rq < req.length; rq++) html += renderInsigniaBadge(req[rq]);
      if (r.savings > 0) {
        html += '<span style="font-size:0.72rem;font-weight:700;color:#000;background:#3fb950;border-radius:var(--radius-sm);padding:0.1rem 0.4rem;">Save ' + r.savings + ' insignia upgrade' + (r.savings === 1 ? '' : 's') + '</span>';
      } else if (r.stats.totalInstances === 1) {
        html += '<span style="font-size:0.72rem;color:var(--text-muted);">single use — no sharing possible</span>';
      } else {
        html += '<span style="font-size:0.72rem;color:var(--text-muted);">all instances in one loadout — already optimal</span>';
      }
      html += '</div>';

      var pieces = [];
      for (var pl = 0; pl < r.stats.perLoadout.length; pl++) {
        var pe = r.stats.perLoadout[pl];
        pieces.push(escapeHtml(pe.name) + (pe.count > 1 ? ' ×' + pe.count : ''));
      }
      html += '<div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.4rem;">Wanted by: ' + pieces.join(', ');
      html += ' &nbsp;·&nbsp; ' + r.stats.totalInstances + ' instance' + (r.stats.totalInstances === 1 ? '' : 's') + ', need ' + minMounts + ' distinct mount' + (minMounts === 1 ? '' : 's') + '.</div>';

      if (!recommended.length) {
        html += '<div style="color:var(--stat-negative,#f85149);font-size:0.85rem;">No mount in the database can host this bonus.</div>';
      } else if (candidates.length < r.stats.maxPerLoadout) {
        html += '<div style="color:var(--stat-negative,#f85149);font-size:0.85rem;">Only ' + candidates.length + ' mount' + (candidates.length === 1 ? '' : 's') + ' can host this bonus, but you need ' + r.stats.maxPerLoadout + ' distinct mounts in a single loadout.</div>';
      } else {
        html += '<div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:0.25rem;">Pick ' + (recommended.length === 1 ? 'this mount' : 'these ' + recommended.length + ' mounts') + ' and use ' + (recommended.length === 1 ? 'it' : 'them') + ' in every loadout wanting this bonus:</div>';
        html += '<div style="display:flex;flex-wrap:wrap;gap:0.4rem;">';
        for (var rec = 0; rec < recommended.length; rec++) {
          var cand = recommended[rec];
          var prefStr = cand.preferred ? ' ★' : '';
          var isReuse = rec >= forcedReuseStart;
          var borderColor = isReuse ? '#d29922' : 'var(--accent,#58a6ff)';
          var reuseTitle = isReuse ? ' title="Already picked for a higher-savings bonus — not enough distinct mounts available."' : '';
          html += '<span' + reuseTitle + ' style="display:inline-flex;align-items:center;gap:0.3rem;background:var(--bg-elevated);border:2px solid ' + borderColor + ';border-radius:var(--radius-sm);padding:0.25rem 0.6rem;font-size:0.92rem;font-weight:600;">';
          html += escapeHtml(cand.mount.name) + prefStr;
          html += '<span style="font-size:0.7rem;font-weight:400;color:var(--text-muted);">' + cand.slotCount + '-slot</span>';
          if (isReuse) {
            html += '<span style="font-size:0.65rem;font-weight:700;color:#000;background:#d29922;border-radius:var(--radius-sm);padding:0.05rem 0.3rem;">reused</span>';
          }
          html += '<button class="planner-exclude-mount" data-mount="' + cand.mount.id + '" title="I don\'t own this — pick something else" style="background:transparent;border:none;color:var(--text-muted);cursor:pointer;font-weight:700;font-size:1rem;line-height:1;padding:0 0.15rem;margin-left:0.15rem;">×</button>';
          html += '</span>';
        }
        html += '</div>';
      }
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function renderPlannerResults() {
    if (!plannerState.loadouts.length) {
      plannerResults.innerHTML = "";
      return;
    }
    var bonusToLoadoutNames = {};
    for (var i = 0; i < plannerState.loadouts.length; i++) {
      var ld = plannerState.loadouts[i];
      for (var b = 0; b < ld.desiredBonuses.length; b++) {
        var bid = ld.desiredBonuses[b];
        if (!bonusToLoadoutNames[bid]) bonusToLoadoutNames[bid] = [];
        if (bonusToLoadoutNames[bid].indexOf(ld.name) === -1) {
          bonusToLoadoutNames[bid].push(ld.name);
        }
      }
    }
    var html = renderExcludedMountsBar();
    html += renderSharingSummary();
    html += '<h3 style="margin:1rem 0 0.75rem;color:var(--text-secondary);font-size:0.95rem;">All Candidate Mounts (per loadout, for reference)</h3>';
    for (var li = 0; li < plannerState.loadouts.length; li++) {
      html += renderLoadoutResultsCard(plannerState.loadouts[li], bonusToLoadoutNames);
    }
    plannerResults.innerHTML = html;
  }

  function renderPlanner() {
    renderPlannerEditor();
    renderPlannerResults();
  }

  // Event delegation for editor (handles dynamically-rendered inputs)
  if (plannerEditor) {
    plannerEditor.addEventListener("input", function (e) {
      var t = e.target;
      if (!t || !t.dataset || !t.dataset.id) return;
      var ld = findLoadout(t.dataset.id);
      if (!ld) return;
      if (t.classList.contains("planner-name")) {
        ld.name = t.value;
        savePlannerState();
        renderPlannerResults(); // name change affects "Also wanted by" labels
      }
    });
    plannerEditor.addEventListener("change", function (e) {
      var t = e.target;
      if (!t || !t.dataset) return;
      if (t.classList.contains("planner-role")) {
        var ld = findLoadout(t.dataset.id);
        if (!ld) return;
        ld.role = t.value;
        savePlannerState();
        renderPlannerResults();
      } else if (t.classList.contains("planner-add-bonus")) {
        var ld2 = findLoadout(t.dataset.id);
        if (!ld2) return;
        var bid = parseInt(t.value, 10);
        if (!bid) return;
        if (ld2.desiredBonuses.length >= MAX_BONUSES_PER_LOADOUT) return;
        ld2.desiredBonuses.push(bid);
        savePlannerState();
        renderPlanner();
      }
    });
    plannerEditor.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.dataset) return;
      if (t.classList.contains("planner-delete")) {
        deletePlannerLoadout(t.dataset.id);
      } else if (t.classList.contains("planner-remove-bonus")) {
        var ld = findLoadout(t.dataset.id);
        if (!ld) return;
        var idx = parseInt(t.dataset.index, 10);
        if (idx >= 0 && idx < ld.desiredBonuses.length) {
          ld.desiredBonuses.splice(idx, 1);
          savePlannerState();
          renderPlanner();
        }
      }
    });
  }

  if (plannerResults) {
    plannerResults.addEventListener("click", function (e) {
      var t = e.target;
      if (!t) return;
      if (t.classList.contains("planner-exclude-mount")) {
        var mid = parseInt(t.dataset.mount, 10);
        if (mid) excludeMount(mid);
      } else if (t.classList.contains("planner-restore-mount")) {
        var mid2 = parseInt(t.dataset.mount, 10);
        if (mid2) restoreMount(mid2);
      } else if (t.classList.contains("planner-clear-excluded")) {
        clearExcludedMounts();
      }
    });
  }

  if (plannerAddBtn) plannerAddBtn.addEventListener("click", addPlannerLoadout);
  if (plannerClearBtn) plannerClearBtn.addEventListener("click", clearAllPlannerLoadouts);

  if (tabPlanner) {
    tabPlanner.addEventListener("click", function () {
      switchMountTab("planner");
      tabPlanner.classList.add("active");
      plannerView.style.display = "";
      plannerControls.style.display = "";
      renderPlanner();
    });
  }

  // ---- Hash-based deep link (e.g., mounts.html#planner) ----
  (function () {
    var hashTabs = {
      "planner": tabPlanner,
      "lookup": tabLookup,
      "combat": tabCombat,
      "stdps": tabStdps,
      "equip": tabEquip,
      "collars": tabCollars,
      "insignias": tabInsignias
    };
    var initial = (window.location.hash || "").replace(/^#/, "");
    if (initial && hashTabs[initial]) {
      hashTabs[initial].click();
    }
  })();

  // ---- Initial render ----
  renderList(MOUNTS_DATA);
})();
