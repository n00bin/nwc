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

  function switchMountTab(activeTab) {
    activeRankingTab = activeTab;
    var tabs = [tabLookup, tabCombat, tabStdps, tabEquip, tabCollars, tabInsignias];
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
      // Slot types
      html += "<td>";
      for (var ci = 0; ci < r.categories.length; ci++) {
        html += renderInsigniaBadge(r.categories[ci]) + " ";
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

  // ---- Initial render ----
  renderList(MOUNTS_DATA);
})();
