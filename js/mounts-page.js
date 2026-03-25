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
  var filterBonus     = document.getElementById("filter-bonus");
  var togglePreferred = document.getElementById("toggle-preferred");
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
    var bonusVal = filterBonus.value;

    var html = "";

    // Mount name
    html += '<h2 style="margin-bottom:0.75rem;">' + escapeHtml(mount.name) + "</h2>";

    // ---- Pinned selected insignia bonus ----
    if (bonusVal) {
      var pinnedBonus = null;
      for (var pbi = 0; pbi < compatibleBonuses.length; pbi++) {
        if (compatibleBonuses[pbi].name === bonusVal) { pinnedBonus = compatibleBonuses[pbi]; break; }
      }
      if (pinnedBonus) {
        html += '<div class="pinned-bonus">';
        html += '<div class="section-header" style="margin-top:0;">Selected Insignia Bonus</div>';
        html += '<div class="detail-name">' + escapeHtml(pinnedBonus.name) + "</div>";
        if (pinnedBonus.requiredInsignias && pinnedBonus.requiredInsignias.length > 0) {
          html += '<div style="margin:0.3rem 0;">';
          for (var pri = 0; pri < pinnedBonus.requiredInsignias.length; pri++) {
            html += renderInsigniaBadge(pinnedBonus.requiredInsignias[pri]) + " ";
          }
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
      html += '<div class="insignia-slots-grid">';
      for (var s = 0; s < mount.insigniaSlots.length; s++) {
        var slot = mount.insigniaSlots[s];
        html += '<div class="insignia-slot-box">';
        html += '<div class="slot-label">Slot ' + (s + 1) + "</div>";
        for (var a = 0; a < slot.allowed.length; a++) {
          html += renderInsigniaBadge(slot.allowed[a]) + " ";
        }
        if (slot.preferred) {
          html += '<div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.2rem;">Preferred: ' + escapeHtml(String(slot.preferred)) + "</div>";
        }
        html += "</div>";
      }
      html += "</div>";
    } else {
      html += '<div class="detail-meta">No insignia slots</div>';
    }

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
        html += '<div class="effect-text">' + escapeHtml(cleanNotes(cp.notes)) + "</div>";
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
        html += '<div class="effect-text">' + escapeHtml(cleanNotes(ep.notes)) + "</div>";
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

    // ---- Notes ----
    if (mount.notes) {
      html += '<div class="section-header">Notes</div>';
      html += '<div class="effect-text">' + escapeHtml(cleanNotes(mount.notes)) + "</div>";
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
  togglePreferred.addEventListener("change", onFilterChange);

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

  var trialData = [
    { rank: 1, name: "Hag's Enchanted Cauldron", effect: "-7.5% to enemy Defense and Critical Avoidance" },
    { rank: 2, name: "Pegasus", effect: "1,000 magnitude damage, all allies gain +15% damage or damage resist or healing depending on role", source: "Lockbox of Justice" },
    { rank: 3, name: "Red Dragon", effect: "-15% to target's Critical Avoidance and outgoing damage, +15% damage to caster and +15% Crit Strike + Accuracy", source: "Jubilee 2024" },
    { rank: 4, name: "Glorious Undead Lion", effect: "+16% incoming damage received by targets, reduces their Accuracy by 16%", source: "Glorious Undead Lockbox" },
    { rank: 5, name: "Twice-Pale Alder", effect: "+16% incoming damage received by targets, reduces their outgoing damage by 16%" },
    { rank: 6, name: "Phantom Panther", effect: "+16% incoming damage received by targets, reduces their Critical Strike by 16%", source: "Phantasmal Fantasy Lockbox" },
    { rank: 7, name: "Swarm", effect: "+15% incoming damage received by target, -15% outgoing damage and Critical Chance", source: "Reaper's Challenge Store" },
    { rank: 8, name: "Eclipse Lion / Neo Eclipse Lion", effect: "600 magnitude damage, +15% incoming damage received and -15% outgoing damage to targets", source: "Wondrous Bazaar / Astral Lockbox" },
    { rank: 9, name: "King of Spines / Tyrannosaur", effect: "6s Root to controllable targets, +15% incoming damage received, minion consume", source: "Reaper's Challenge Store" },
    { rank: 10, name: "Brain Stealer Dragon", effect: "+15% incoming damage received to targets", source: "Psionic Lockbox" },
    { rank: 11, name: "Bestial Fire Archon", effect: "+15% incoming damage received to targets within magma pools", source: "Leaping Flame Lockbox" },
    { rank: 12, name: "Barlgura", effect: "750 magnitude damage, 20 magnitude DoT for 10s, +11% damage taken by targets", source: "Appointment Event Store" },
    { rank: 13, name: "Reconnaissance Balloons", effect: "800 magnitude, +7.5% damage taken by targets. Treasure increases a random stat by 1.5% for 10s", source: "Reconnaissance Lockbox" },
    { rank: 14, name: "Hag's Cooking Cauldron", effect: "115 magnitude DoT for 10s, all allies gain +15% Accuracy + Combat Advantage", source: "Spellbound Lockbox" },
    { rank: 15, name: "Frost Salamander", effect: "+15% damage buff to caster. Target is 13% slowed, -15% Deflect, -15% damage, -13% Crit Chance", source: "Stealth Lockbox" },
  ];

  var dungeonData = [
    { rank: 1, name: "Hag's Enchanted Cauldron", effect: "-7.5% to enemy Defense and Critical Avoidance" },
    { rank: 2, name: "Glorious Undead Lion", effect: "+16% incoming damage received by targets, reduces their Accuracy by 16%", source: "Glorious Undead Lockbox" },
    { rank: 3, name: "Phantom Panther", effect: "+16% incoming damage received by targets, reduces their Critical Strike by 16%", source: "Phantasmal Fantasy Lockbox" },
    { rank: 4, name: "Twice-Pale Alder", effect: "+16% incoming damage received by targets, reduces their outgoing damage by 16%" },
    { rank: 5, name: "Swarm", effect: "+15% incoming damage received by target, -15% outgoing damage and Critical Chance", source: "Reaper's Challenge Store" },
    { rank: 6, name: "Eclipse Lion / Neo Eclipse Lion", effect: "600 magnitude damage, +15% incoming damage received and -15% outgoing damage to targets", source: "Wondrous Bazaar / Astral Lockbox" },
    { rank: 7, name: "Pegasus", effect: "1,000 magnitude damage, all allies gain +15% damage or damage resist or healing depending on role", source: "Lockbox of Justice" },
    { rank: 8, name: "King of Spines / Tyrannosaur", effect: "6s Root to controllable targets, +15% incoming damage received, minion consume", source: "Reaper's Challenge Store" },
    { rank: 9, name: "Brain Stealer Dragon", effect: "+15% incoming damage received to targets", source: "Psionic Lockbox" },
    { rank: 10, name: "Bestial Fire Archon", effect: "+15% incoming damage received to targets within magma pools", source: "Leaping Flame Lockbox" },
    { rank: 11, name: "Red Dragon", effect: "-15% to target's Critical Avoidance and outgoing damage, +15% damage to caster and +15% Crit Strike + Accuracy", source: "Jubilee 2024" },
    { rank: 12, name: "Barlgura", effect: "750 magnitude damage, 20 magnitude DoT for 10s, +11% damage taken by targets", source: "Appointment Event Store" },
    { rank: 13, name: "Reconnaissance Balloons", effect: "800 magnitude, +7.5% damage taken by targets. Treasure increases a random stat by 1.5% for 10s", source: "Reconnaissance Lockbox" },
    { rank: 14, name: "Hag's Cooking Cauldron", effect: "115 magnitude DoT for 10s, all allies gain +15% Accuracy + Combat Advantage", source: "Spellbound Lockbox" },
    { rank: 15, name: "Frost Salamander", effect: "+15% damage buff to caster. Target is 13% slowed, -15% Deflect, -15% damage, -13% Crit Chance", source: "Stealth Lockbox" },
  ];

  var stdpsData = [
    { name: "Demonic Gravehound", effect: "Physical 3,938 + 394 magnitude damage against control immune enemies" },
    { name: "Grubshank the Burdened", effect: "Magical 2,362 + 2,264 DoT for 5s" },
    { name: "Legendary Hellfire Engine", effect: "Magical 1,969 + 2,264 DoT for 5s" },
    { name: "Tunnel Vision mounts", effect: "Magical 3,938 magnitude damage" },
    { name: "Legendary Giant Toad", effect: "Magical 3,938 magnitude damage", source: "Reaper's Challenge Store" },
    { name: "Golden Warhorse", effect: "Magical 3,938 magnitude damage", source: "Appointment Event Store" },
    { name: "Bigby's Hand", effect: "Physical 3,347 + 591 magnitude damage against control immune enemies", source: "Dragonslayer Lockbox" },
  ];

  var equipData = [
    { name: "Ebon Riding Lizard", bonus: "Pack Tactics", effect: "+2,953 Combat Advantage and Awareness" },
    { name: "Myconid Bulette", bonus: "Mystic Aura", effect: "+2,953 Power and Accuracy" },
    { name: "Runeclad Manticore", bonus: "Runic Aura", effect: "+2,953 Power and Defense" },
    { name: "Dragon Chicken", bonus: "Avian Aura", effect: "Forte and Power" },
    { name: "Turmish Lion", bonus: "Ferocity", effect: "Extra damage per hit" },
  ];

  function renderRankingList(data, container) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
      var d = data[i];
      html += '<div class="ranking-card">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
      html += '<div style="font-weight:600;">';
      if (d.rank) html += '<span style="color:var(--highlight);margin-right:0.5rem;">#' + d.rank + '</span>';
      html += escapeHtml(d.name) + '</div>';
      html += '</div>';
      html += '<div class="effect-text" style="margin-top:0.4rem;">' + escapeHtml(d.effect) + '</div>';
      if (d.source) {
        html += '<div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.25rem;">Source: ' + escapeHtml(d.source) + '</div>';
      }
      if (d.bonus) {
        html += '<div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.25rem;">Equip Power: ' + escapeHtml(d.bonus) + '</div>';
      }
      html += '</div>';
    }
    document.getElementById(container).innerHTML = html;
  }

  // Tab switching
  function switchMountTab(activeTab) {
    var tabs = [tabLookup, tabTrial, tabDungeon, tabStdps, tabEquip];
    var views = {
      lookup: [lookupView, lookupControls],
      trial: [trialView],
      dungeon: [dungeonView],
      stdps: [stdpsView],
      equip: [equipView]
    };
    for (var t = 0; t < tabs.length; t++) {
      tabs[t].classList.remove("active");
    }
    // Hide all
    lookupView.style.display = "none";
    lookupControls.style.display = "none";
    trialView.style.display = "none";
    dungeonView.style.display = "none";
    stdpsView.style.display = "none";
    equipView.style.display = "none";
    // Show active
    var active = views[activeTab];
    for (var v = 0; v < active.length; v++) {
      active[v].style.display = "";
    }
  }

  tabLookup.addEventListener("click", function () {
    tabLookup.classList.add("active");
    switchMountTab("lookup");
  });
  tabTrial.addEventListener("click", function () {
    tabTrial.classList.add("active");
    switchMountTab("trial");
    renderRankingList(trialData, "trial-list");
  });
  tabDungeon.addEventListener("click", function () {
    tabDungeon.classList.add("active");
    switchMountTab("dungeon");
    renderRankingList(dungeonData, "dungeon-list");
  });
  tabStdps.addEventListener("click", function () {
    tabStdps.classList.add("active");
    switchMountTab("stdps");
    renderRankingList(stdpsData, "stdps-list");
  });
  tabEquip.addEventListener("click", function () {
    tabEquip.classList.add("active");
    switchMountTab("equip");
    renderRankingList(equipData, "equip-list");
  });

  // ---- Initial render ----
  renderList(MOUNTS_DATA);
})();
