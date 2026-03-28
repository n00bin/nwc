/* ============================================================
   NWCB Companions Page
   ============================================================ */

(function () {
  // ---- Build lookup maps ----
  var powerMap       = buildLookup(COMPANION_POWERS_DATA);
  var enhancementMap = buildLookup(COMPANION_ENHANCEMENTS_DATA);

  // ---- Rarity scaling ----
  var RARITIES = [
    { name: "Common",    il: 75,  color: "#fff" },
    { name: "Uncommon",  il: 150, color: "#00cc00" },
    { name: "Rare",      il: 250, color: "#4488ff" },
    { name: "Epic",      il: 375, color: "#a335ee" },
    { name: "Legendary", il: 550, color: "#f0a000" },
    { name: "Mythic",    il: 750, color: "#66ddff" },
    { name: "Celestial", il: 900, color: "#cc66ff" }
  ];

  var SINGLE_STAT_SCALE = { 75: 0.75, 150: 1.50, 250: 2.50, 375: 3.75, 550: 5.50, 750: 7.50, 900: 9.00 };
  var DOUBLE_STAT_SCALE = { 75: 0.38, 150: 0.75, 250: 1.25, 375: 1.88, 550: 2.75, 750: 3.75, 900: 4.50 };
  var TRIPLE_STAT_SCALE = { 75: 0.25, 150: 0.50, 250: 0.83, 375: 1.25, 550: 1.83, 750: 2.50, 900: 3.00 };
  var MAX_HP_SCALE = { 75: 1500, 150: 3000, 250: 5000, 375: 7500, 550: 11000, 750: 15000, 900: 18000 };

  var selectedRarity = 900; // Default to Celestial

  function getRarityByIL(il) {
    for (var i = RARITIES.length - 1; i >= 0; i--) {
      if (il >= RARITIES[i].il) return RARITIES[i];
    }
    return RARITIES[0];
  }

  function getBaseRarity(pw) {
    if (!pw || !pw.item_level) return RARITIES[0];
    return getRarityByIL(pw.item_level);
  }

  function getAvailableRarities(pw) {
    var base = getBaseRarity(pw);
    var available = [];
    for (var i = 0; i < RARITIES.length; i++) {
      if (RARITIES[i].il >= base.il) available.push(RARITIES[i]);
    }
    return available;
  }

  // Scalable power whitelist - companions confirmed to follow standard scaling
  var SCALABLE_POWER_IDS = {
    156: true,  // Acolyte of Kelemvor - Acolyte's Wisdom (Deflect, Incoming Healing)
    54: true,  // Alpha Compy - Compy's Instincts (Power)
    147: true, // Battlefield Medic - Battlefield Medic's Wisdom (Combat Advantage, Incoming Healing)
    234: true, // Catti-brie - Catti's Coordination (Movement Speed, Control Resist)
    170: true, // Cleric Disciple - Cleric Disciple's Wisdom (Incoming Healing, Power)
    228: true, // Coldlight Walker - Coldlight Walker's Gaze (Critical Strike, Critical Severity)
    232: true, // Dark Dealer - Dark Dealings (Combat Advantage, Accuracy + 10% Northdark Reaches currency)
    113: true, // Dedicated Squire - Squire's Discipline (Accuracy, Incoming Healing)
    210: true, // Deva Champion - Deva Champion's Insight (Critical Avoidance, Incoming Healing)
    87: true,  // Diana - Acrobatic Speed (Movement Speed, Stamina Regeneration)
    99: true,  // Githyanki - Githyanki Vigor (Stamina Regeneration, Power)
    194: true, // Icosahedron Ioun Stone - Icosahedron Stone's Insight (Movement Speed)
    226: true, // Linu La'neral - Divine Answers (Forte, Outgoing Healing)
    161: true, // Lizardfolk Shaman - Lizardman Shaman's Wisdom (Awareness, Incoming Healing)
    120: true, // Neverember Guard Archer - Archer Guard's Discipline (Power, Defense)
    77: true,  // Rabbit - Elusive Rabbit (Movement Speed, Critical Avoidance)
    242: true, // Shadar-kai Witch - Sense Through the Shadowfell (Power, Critical Strike + 10% Dragonbone Vale currency)
    70: true,  // Snow Fawn - Snow Fawn's Instincts (Critical Severity, Defense)
    128: true, // Storm Rider - Stormrider's Discipline (Power, Max HP)
    26: true,  // Watler - Watler's Presence (Deflect + 2x Portobello's Campaign currency)
    168: true, // Apprentice Healer - Apprentice's Wisdom (Max HP, Incoming Healing)
    174: true, // Lysaera - Spiteful Hex (Incoming Damage debuff, Defense buff)
    104: true, // Tutor - Tutor's Discipline (Critical Severity, Combat Advantage)
    248: true  // Demonic Servant - Highborn Status (Forte, Accuracy + 10% Menzoberranzan currency)
  };

  function isScalablePower(pw) {
    if (!pw || !pw.slot) return false;
    // Check whitelist first
    if (SCALABLE_POWER_IDS[pw.id]) return true;
    // Default: Offense/Defense slot with 1-2 stats
    var hasOffDef = false;
    for (var i = 0; i < pw.slot.length; i++) {
      if (pw.slot[i] === "Offense" || pw.slot[i] === "Defense") { hasOffDef = true; break; }
    }
    if (!hasOffDef) return false;
    var realStats = (pw.stats || []).filter(function (s) { return s.stat !== "CombinedRating"; });
    return realStats.length === 1 || realStats.length === 2;
  }

  function scaleStats(pw, targetIL) {
    if (!isScalablePower(pw)) return null;
    var realStats = pw.stats.filter(function (s) { return s.stat !== "CombinedRating"; });
    // Count non-HP stats to determine scaling table
    var pctStats = realStats.filter(function (s) { return s.stat !== "MaximumHitPoints"; });
    var hasHP = realStats.length !== pctStats.length;
    var scale;
    if (pctStats.length === 0) {
      scale = SINGLE_STAT_SCALE; // HP-only, won't be used for pct but need a fallback
    } else if (pctStats.length === 1 && !hasHP) {
      scale = SINGLE_STAT_SCALE;
    } else {
      scale = DOUBLE_STAT_SCALE;
    }
    var scaledStats = [];
    for (var i = 0; i < realStats.length; i++) {
      if (realStats[i].stat === "MaximumHitPoints") {
        scaledStats.push({ stat: realStats[i].stat, value: MAX_HP_SCALE[targetIL], type: "flat" });
      } else {
        scaledStats.push({ stat: realStats[i].stat, value: scale[targetIL], type: realStats[i].type || "percent" });
      }
    }
    return { stats: scaledStats, combinedRating: targetIL };
  }

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
    companions.sort(function (a, b) { return a.name.localeCompare(b.name); });
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

      // Companion list icon
      var listImg = window.COMPANION_IMAGES && window.COMPANION_IMAGES[c.name];

      html += '<div class="list-item' + sel + '" data-id="' + c.id + '">';
      html += '<span class="item-name" style="display:flex;align-items:center;">';
      if (listImg) {
        html += '<img class="list-icon" src="images/companions/' + listImg + '" alt="">';
      }
      html += name + "</span>";
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

    // Companion name with icon
    var compImg = window.COMPANION_IMAGES && window.COMPANION_IMAGES[companion.name];
    html += '<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.25rem;">';
    if (compImg) {
      html += '<img class="companion-icon" src="images/companions/' + compImg + '" alt="">';
    }
    html += '<h2 style="margin:0;">' + escapeHtml(companion.name) + "</h2>";
    html += "</div>";
    if (companion.source) {
      html += '<div style="margin-bottom:0.75rem;font-size:0.85rem;"><span style="color:var(--text-muted);">Source: </span><span style="color:var(--highlight);">' + escapeHtml(companion.source) + "</span></div>";
    }

    // ---- Power ----
    html += '<div class="section-header">Power</div>';
    if (pw) {
      var scalable = isScalablePower(pw);
      var availableRarities = getAvailableRarities(pw);
      var activeIL = scalable ? selectedRarity : pw.item_level;
      // Clamp to available rarities
      if (scalable) {
        var validILs = availableRarities.map(function (r) { return r.il; });
        if (validILs.indexOf(activeIL) === -1) activeIL = validILs[validILs.length - 1];
      }
      var activeRarity = getRarityByIL(activeIL);
      var scaled = scalable ? scaleStats(pw, activeIL) : null;
      var displayStats = scaled ? scaled.stats : pw.stats;
      var displayCR = scaled ? scaled.combinedRating : pw.combinedRating;

      html += '<div class="proc-block">';
      html += '<div class="detail-name">' + escapeHtml(pw.name) + "</div>";

      // Slot badges
      if (pw.slot && pw.slot.length > 0) {
        html += '<div style="margin:0.3rem 0;">' + renderSlotBadges(pw.slot) + "</div>";
      }

      // Rarity selector (only for scalable powers)
      if (scalable) {
        html += '<div style="margin:0.4rem 0;display:flex;flex-wrap:wrap;gap:0.25rem;">';
        for (var ri = 0; ri < availableRarities.length; ri++) {
          var r = availableRarities[ri];
          var active = r.il === activeIL ? ' style="background:' + r.color + ';color:#000;border-color:' + r.color + ';"' : ' style="color:' + r.color + ';border-color:' + r.color + ';"';
          html += '<button class="rarity-btn" data-il="' + r.il + '"' + active + '>' + r.name + '</button>';
        }
        html += '</div>';
      }

      html += '<div class="detail-meta">';
      html += '<span style="color:' + activeRarity.color + ';">IL ' + formatNumber(activeIL) + ' (' + activeRarity.name + ')</span>';
      html += "<span>Combined Rating " + formatNumber(displayCR) + "</span>";
      html += "</div>";

      // Stats
      if (displayStats && displayStats.length > 0) {
        html += renderStatsTable(displayStats);
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

      html += "</div>"; // close proc-block

      if (pw.notes) {
        html += '<div class="effect-text">' + escapeHtml(cleanNotes(pw.notes)) + "</div>";
      }
    } else {
      html += '<div class="detail-meta">No power data</div>';
    }

    // ---- Enhancement ----
    html += '<div class="section-header">Enhancement</div>';
    if (en) {
      var enImg = window.ENHANCEMENT_IMAGES && window.ENHANCEMENT_IMAGES[en.name];
      html += '<div class="proc-block">';
      html += '<div style="display:flex;align-items:center;gap:0.5rem;">';
      if (enImg) {
        html += '<img class="enhancement-icon" src="images/enhancements/' + enImg + '" alt="">';
      }
      html += '<div class="detail-name">' + escapeHtml(en.name) + "</div>";
      html += "</div>";
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
      html += "</div>"; // close proc-block

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

  detailPanel.addEventListener("click", function (e) {
    var btn = e.target.closest(".rarity-btn");
    if (!btn) return;
    selectedRarity = parseInt(btn.getAttribute("data-il"), 10);
    // Re-render current companion
    if (selectedId) {
      for (var j = 0; j < COMPANIONS_DATA.length; j++) {
        if (COMPANIONS_DATA[j].id === selectedId) { renderDetail(COMPANIONS_DATA[j]); break; }
      }
    }
  });

  searchInput.addEventListener("input", onFilterChange);
  filterSlot.addEventListener("change", onFilterChange);
  filterEnhancement.addEventListener("change", onFilterChange);
  filterStat.addEventListener("change", onFilterChange);

  // ---- Summoned Buffs View ----
  var tabLookup  = document.getElementById("tab-lookup");
  var tabSummoned = document.getElementById("tab-summoned");
  var lookupView = document.getElementById("lookup-view");
  var summonedView = document.getElementById("summoned-view");
  var lookupControls = document.getElementById("lookup-controls");
  var summonedControls = document.getElementById("summoned-controls");
  var summonedList = document.getElementById("summoned-list");
  var summonedCount = document.getElementById("summoned-count");
  var summonedSearch = document.getElementById("summoned-search");
  var enhancementControls = document.getElementById("enhancement-controls");
  var enhancementSearch = document.getElementById("enhancement-search");

  // Build summoned data from summonedBuff field
  var summonedData = [];
  for (var si = 0; si < COMPANIONS_DATA.length; si++) {
    var comp = COMPANIONS_DATA[si];
    if (!comp.summonedBuff) continue;
    var sb = comp.summonedBuff;
    if (sb.scope !== "party") continue;  // Only show party buffs
    summonedData.push({
      companionName: comp.name,
      companionId: comp.id,
      buff: sb.buff,
      scope: sb.scope || "party",
      range: sb.range || null,
      damageBoost: sb.damageBoost || null,
      condition: sb.condition || null,
      uptime: sb.uptime || null
    });
  }

  function renderSummonedView() {
    var query = summonedSearch.value.trim().toLowerCase();
    var filtered = summonedData.filter(function (s) {
      if (query && (s.companionName + " " + s.buff).toLowerCase().indexOf(query) === -1) return false;
      return true;
    });

    // Sort: party scope first, then by scope
    filtered.sort(function (a, b) {
      if (a.scope !== b.scope) {
        var order = { party: 0, self: 1, enemy: 2, mixed: 3 };
        return (order[a.scope] || 9) - (order[b.scope] || 9);
      }
      return a.companionName < b.companionName ? -1 : 1;
    });

    summonedCount.textContent = filtered.length + " of " + summonedData.length + " companions with summoned buffs";

    if (filtered.length === 0) {
      summonedList.innerHTML = '<div class="empty-state">No companions match your filters</div>';
      return;
    }

    var html = "";
    for (var i = 0; i < filtered.length; i++) {
      var s = filtered[i];

      var sumImg = window.COMPANION_IMAGES && window.COMPANION_IMAGES[s.companionName];
      html += '<div class="summoned-card" style="flex-direction:column;align-items:stretch;">';
      html += '<div style="display:flex;align-items:center;gap:0.5rem;font-weight:600;">';
      if (sumImg) {
        html += '<img class="companion-icon" src="images/companions/' + sumImg + '" alt="">';
      }
      html += '<span><span style="color:var(--highlight);margin-right:0.5rem;">#' + (i + 1) + '</span>' + escapeHtml(s.companionName) + '</span></div>';
      html += '<div class="effect-text" style="margin-top:0.4rem;">' + escapeHtml(s.buff) + '</div>';
      if (s.range) {
        html += '<div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.2rem;">Range: ' + s.range + "'</div>";
      }
      if (s.condition) {
        html += '<div style="font-size:0.78rem;color:var(--highlight);margin-top:0.2rem;">Condition: ' + escapeHtml(s.condition) + '</div>';
      }
      html += '</div>';
    }
    summonedList.innerHTML = html;
  }

  // ---- Enhancement Ranking View ----
  var tabEnhancements = document.getElementById("tab-enhancements");
  var enhancementView = document.getElementById("enhancement-view");
  var enhancementList = document.getElementById("enhancement-list");

  // Build enhancement list dynamically from data
  function cleanNotes(notes) {
    if (!notes) return "";
    return notes.replace(/^Screenshot intake[^:]*:\s*/i, "").replace(/^[A-Z][A-Za-z'\- ]+ enhancement\.\s*/i, "").replace(/\s*Conditional proc;.*$/i, "").replace(/\s*Value depends on summoned companion.*?(?=\.|$)\.?\s*/g, " ").replace(/\s*Debuff\s*[—\-]\s*reduces enemy stat\.?\s*/gi, "").replace(/\s*Heal effect\s*[—\-]\s*modeled as HP sustain\.?\s*/gi, "").replace(/\s*Permanent buff while summoned\s*\(not a proc\)\.?\s*/gi, "Permanent while summoned.").replace(/\s*Affects both.*$/gi, "").replace(/\s*\.?\s*Scaling:.*$/gi, "").replace(/\s*\.?\s*Standard magnitude scaling:.*$/gi, "").replace(/\s*\.?\s*Magnitude scaling:.*$/gi, "").replace(/\s*\.?\s*(Per-stack value |Chance |Both values |Both |DR |Crit Severity |Stat values |Reflect )?[Ff]ollows\s+\d*\.?\d*x?\s*(single|standard|double|triple|the)[\s\w]*scaling\.?\s*/gi, "").replace(/\s*\([\w\s]+stat scaling\)\.?\s*/gi, "").replace(/\s*Also damage versus[\w\s']*\(single stat scaling\)\.?\s*/gi, "").trim();
  }

  function buildEnhancementList() {
    var enMap = {};
    for (var i = 0; i < COMPANION_ENHANCEMENTS_DATA.length; i++) {
      var en = COMPANION_ENHANCEMENTS_DATA[i];
      if (!enMap[en.name]) {
        var desc = en.notes ? cleanNotes(en.notes) : (en.stat + " +" + en.value + "%");
        enMap[en.name] = { name: en.name, description: desc, companions: [] };
      }
    }
    // Map companions to their enhancements
    for (var j = 0; j < COMPANIONS_DATA.length; j++) {
      var c = COMPANIONS_DATA[j];
      var ce = enhancementMap[c.enhancementRef];
      if (ce && enMap[ce.name]) {
        enMap[ce.name].companions.push(c.name);
      }
    }
    var list = [];
    for (var key in enMap) {
      list.push(enMap[key]);
    }
    list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    // Number them
    for (var k = 0; k < list.length; k++) {
      list[k].num = k + 1;
    }
    return list;
  }

  var enhancementListData = buildEnhancementList();

  function renderEnhancementView() {
    var query = enhancementSearch.value.trim().toLowerCase();
    var html = "";
    for (var i = 0; i < enhancementListData.length; i++) {
      var e = enhancementListData[i];
      if (query && (e.name + " " + e.description + " " + e.companions.join(" ")).toLowerCase().indexOf(query) === -1) continue;
      var enImg = window.ENHANCEMENT_IMAGES && window.ENHANCEMENT_IMAGES[e.name];
      html += '<div class="summoned-card" style="flex-direction:column;align-items:stretch;">';
      html += '<div style="display:flex;align-items:center;gap:0.5rem;">';
      if (enImg) {
        html += '<img class="enhancement-icon" src="images/enhancements/' + enImg + '" alt="">';
      }
      html += '<div>';
      html += '<span style="color:var(--highlight);font-weight:700;margin-right:0.5rem;">#' + e.num + '</span>';
      html += '<span style="font-weight:600;">' + escapeHtml(e.name) + '</span>';
      html += '</div>';
      html += '</div>';
      html += '<div class="effect-text" style="margin-top:0.4rem;">' + escapeHtml(e.description) + '</div>';
      if (e.companions.length > 0) {
        html += '<div style="font-size:0.85rem;color:var(--text-muted);margin-top:0.25rem;">Companions: ' + e.companions.map(function(c) { return escapeHtml(c); }).join(', ') + '</div>';
      }
      html += '</div>';
    }
    enhancementList.innerHTML = html;
  }

  // ---- Damage Companions View ----
  var tabDamage = document.getElementById("tab-damage");
  var damageView = document.getElementById("damage-view");
  var damageControls = document.getElementById("damage-controls");
  var damageList = document.getElementById("damage-list");
  var damageSearch = document.getElementById("damage-search");
  var filterDamageCat = document.getElementById("filter-damage-cat");

  // Categorize damage companions from data
  var damageExclude = { "Baby Displacer Beast": true };

  function buildDamageList() {
    var result = [];
    for (var di = 0; di < COMPANIONS_DATA.length; di++) {
      var c = COMPANIONS_DATA[di];
      if (damageExclude[c.name]) continue;
      var pw = powerMap[c.powerRef];
      if (!pw) continue;
      var notes = (pw.notes || "").toLowerCase();
      var stats = (pw.stats || []).map(function (s) { return s.stat || ""; });

      var match = false;
      var category = "";

      if (stats.indexOf("OutgoingDamage") !== -1) { match = true; category = "Outgoing Damage"; }
      else if (stats.indexOf("DamageVsBosses") !== -1) { match = true; category = "Boss Damage"; }
      else if (stats.some(function (s) { return s.indexOf("DamageVs") === 0; })) { match = true; category = "Enemy Type Damage"; }
      else if (stats.some(function (s) { return s.indexOf("AtWillDamage") === 0; })) { match = true; category = "At-Will Damage"; }
      else if (stats.indexOf("EncounterDamage") !== -1 || stats.indexOf("DailyDamage") !== -1) { match = true; category = "Power Damage"; }
      else if (stats.indexOf("AtWillPower") !== -1) { match = true; category = "At-Will Damage"; }

      if (notes.indexOf("magnitude") !== -1 && (notes.indexOf("chance") !== -1 || notes.indexOf("on hit") !== -1 || notes.indexOf("on critical") !== -1 || notes.indexOf("on attack") !== -1 || notes.indexOf("on encounter") !== -1 || notes.indexOf("on at-will") !== -1)) {
        match = true; category = category || "Damage Proc";
      }
      if (notes.indexOf("incoming damage") !== -1 && (notes.indexOf("increase") !== -1 || notes.indexOf("14.8%") !== -1)) {
        match = true; category = category || "Enemy Debuff";
      }
      if (notes.indexOf("more damage") !== -1 && notes.indexOf("bigger they are") === -1) {
        match = true; category = category || "Enemy Debuff";
      }
      if (stats.indexOf("IncomingDamage") !== -1) { match = true; category = category || "Enemy Debuff"; }
      if (notes.indexOf("additional hit") !== -1 || notes.indexOf("additional force") !== -1) {
        match = true; category = category || "Extra Hit";
      }
      if (notes.indexOf("2.3% - 5.3% damage") !== -1) { match = true; category = category || "Boss Damage"; }

      if (match) {
        var desc = pw.notes ? cleanNotes(pw.notes) : "";
        var realStats = (pw.stats || []).filter(function (s) { return s.stat !== "CombinedRating"; });
        // Scale stats to Celestial using ratio from current IL
        var curIL = pw.item_level || 75;
        if (curIL !== 900 && realStats.length > 0) {
          var pctCount = realStats.filter(function (x) { return x.stat !== "MaximumHitPoints"; }).length;
          var curScale = pctCount <= 1 ? SINGLE_STAT_SCALE[curIL] : DOUBLE_STAT_SCALE[curIL];
          var celScale = pctCount <= 1 ? SINGLE_STAT_SCALE[900] : DOUBLE_STAT_SCALE[900];
          var ratio = curScale > 0 ? celScale / curScale : 1;
          var scaledStats = [];
          for (var sti = 0; sti < realStats.length; sti++) {
            var rs = realStats[sti];
            if (rs.stat === "MaximumHitPoints") {
              scaledStats.push({ stat: rs.stat, value: MAX_HP_SCALE[900], type: "flat" });
            } else {
              scaledStats.push({ stat: rs.stat, value: Math.round(rs.value * ratio * 100) / 100, type: rs.type || "percent" });
            }
          }
          realStats = scaledStats;
        }
        // Extract Celestial magnitude from notes for procs
        var celMag = null;
        var rawNotes = pw.notes || "";
        var celMatch = rawNotes.match(/Cel(?:estial)?\s+(\d+\.?\d*)/i);
        if (celMatch) { celMag = celMatch[1]; }
        else {
          // Try fixed magnitude patterns
          var fixedMag = rawNotes.match(/(\d+\.?\d*)\s*magnitude/i);
          if (fixedMag && category === "Damage Proc") { celMag = fixedMag[1]; }
        }
        result.push({ name: c.name, powerName: pw.name, category: category, description: desc, stats: realStats, il: pw.item_level || 0, celMag: celMag });
      }
    }
    result.sort(function (a, b) {
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      return a.name.localeCompare(b.name);
    });
    return result;
  }

  var damageData = buildDamageList();

  function renderDamageView() {
    var query = damageSearch.value.trim().toLowerCase();
    var catFilter = filterDamageCat.value;
    var categories = {};
    var order = ["Outgoing Damage", "Boss Damage", "At-Will Damage", "Power Damage", "Enemy Type Damage", "Damage Proc", "Extra Hit", "Enemy Debuff"];

    for (var i = 0; i < damageData.length; i++) {
      var d = damageData[i];
      if (query && (d.name + " " + d.powerName + " " + d.description + " " + d.category).toLowerCase().indexOf(query) === -1) continue;
      if (catFilter && d.category !== catFilter) continue;
      if (!categories[d.category]) categories[d.category] = [];
      categories[d.category].push(d);
    }

    var html = "";
    var num = 1;
    for (var oi = 0; oi < order.length; oi++) {
      var cat = order[oi];
      if (!categories[cat]) continue;
      html += '<div style="font-size:0.85rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--highlight);padding:0.75rem 0 0.4rem;margin-bottom:0.5rem;border-bottom:1px solid var(--border-default);">' + cat + '</div>';
      for (var j = 0; j < categories[cat].length; j++) {
        var d2 = categories[cat][j];
        var compImg = window.COMPANION_IMAGES && window.COMPANION_IMAGES[d2.name];
        html += '<div class="summoned-card" style="flex-direction:column;align-items:stretch;">';
        html += '<div style="display:flex;align-items:center;gap:0.5rem;font-weight:600;">';
        if (compImg) {
          html += '<img class="companion-icon" src="images/companions/' + compImg + '" alt="">';
        }
        html += '<span><span style="color:var(--highlight);margin-right:0.5rem;">#' + num + '</span>' + escapeHtml(d2.name) + '</span></div>';
        html += '<div style="font-size:0.82rem;color:var(--text-muted);margin-top:0.2rem;">' + escapeHtml(d2.powerName) + '</div>';
        if ((d2.stats && d2.stats.length > 0) || d2.celMag) {
          html += '<div style="margin-top:0.3rem;">';
          if (d2.stats) {
            for (var si = 0; si < d2.stats.length; si++) {
              var st = d2.stats[si];
              var statLabel = st.stat.replace(/([A-Z])/g, ' $1').trim();
              var val = st.type === 'percent' ? st.value + '%' : st.value;
              html += '<span style="display:inline-block;background:var(--bg-elevated);border:1px solid var(--border-default);border-radius:var(--radius-sm);padding:0.15rem 0.5rem;margin:0.15rem 0.25rem 0.15rem 0;font-size:0.82rem;font-weight:600;color:var(--stat-positive);">' + escapeHtml(statLabel) + ': ' + val + '</span>';
            }
          }
          if (d2.celMag) {
            html += '<span style="display:inline-block;background:var(--bg-elevated);border:1px solid var(--border-default);border-radius:var(--radius-sm);padding:0.15rem 0.5rem;margin:0.15rem 0.25rem 0.15rem 0;font-size:0.82rem;font-weight:600;color:var(--stat-positive);">Magnitude: ' + d2.celMag + '</span>';
          }
          html += '</div>';
        }
        html += '<div class="effect-text" style="margin-top:0.4rem;">' + escapeHtml(d2.description) + '</div>';
        html += '</div>';
        num++;
      }
    }

    if (!html) html = '<div class="empty-state">No damage companions match your search</div>';
    damageList.innerHTML = html;
  }

  // Tab switching
  function switchTab(activeTab) {
    tabLookup.classList.toggle("active", activeTab === "lookup");
    tabSummoned.classList.toggle("active", activeTab === "summoned");
    tabEnhancements.classList.toggle("active", activeTab === "enhancements");
    tabDamage.classList.toggle("active", activeTab === "damage");
    lookupView.style.display = activeTab === "lookup" ? "" : "none";
    lookupControls.style.display = activeTab === "lookup" ? "flex" : "none";
    summonedView.style.display = activeTab === "summoned" ? "" : "none";
    summonedControls.style.display = activeTab === "summoned" ? "flex" : "none";
    enhancementView.style.display = activeTab === "enhancements" ? "" : "none";
    enhancementControls.style.display = activeTab === "enhancements" ? "flex" : "none";
    damageView.style.display = activeTab === "damage" ? "" : "none";
    damageControls.style.display = activeTab === "damage" ? "flex" : "none";
  }

  tabLookup.addEventListener("click", function () {
    switchTab("lookup");
  });

  tabSummoned.addEventListener("click", function () {
    switchTab("summoned");
    renderSummonedView();
  });

  tabEnhancements.addEventListener("click", function () {
    switchTab("enhancements");
    renderEnhancementView();
  });

  tabDamage.addEventListener("click", function () {
    switchTab("damage");
    renderDamageView();
  });

  summonedSearch.addEventListener("input", renderSummonedView);
  enhancementSearch.addEventListener("input", renderEnhancementView);
  damageSearch.addEventListener("input", renderDamageView);
  filterDamageCat.addEventListener("change", renderDamageView);

  // ---- Initial render ----
  renderList(COMPANIONS_DATA);
})();
