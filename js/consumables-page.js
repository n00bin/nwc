/* ============================================================
   NWC Consumables Page — card grid layout
   ============================================================ */

(function () {
  var searchInput = document.getElementById('cnsm-search');
  var sectionsEl  = document.getElementById('cnsm-sections');
  var countEl     = document.getElementById('cnsm-count');

  renderNav('Consumables');

  // Section ordering and exclusivity flags (matches Neverwinter rules).
  // Categories not in this list still render under "Other" at the end.
  var SECTIONS = [
    { key: 'Elixir',          exclusive: true  },
    { key: 'Event Food',      exclusive: true  },
    { key: 'Stronghold Food', exclusive: true  },
    { key: 'Potion',          exclusive: true  },
    { key: 'Scroll',          exclusive: false },
    { key: 'Belt Item',       exclusive: false },
    { key: 'Other',           exclusive: false }
  ];

  var STAT_CHIP_CLASSES = {
    'Power':              'cnsm-chip-power',
    'Defense':            'cnsm-chip-defense',
    'Critical Strike':     'cnsm-chip-crit',
    'Critical Severity':   'cnsm-chip-critsev',
    'Critical Avoidance':  'cnsm-chip-critavoid',
    'Deflect':            'cnsm-chip-deflect',
    'Accuracy':           'cnsm-chip-accuracy',
    'Awareness':          'cnsm-chip-awareness',
    'CombatAdvantage':    'cnsm-chip-cadv',
    'Combat Advantage':   'cnsm-chip-cadv',
    'Movement Speed':      'cnsm-chip-movement',
    'Incoming Healing':    'cnsm-chip-healing',
    'Outgoing Healing':    'cnsm-chip-healing',
    'Max HP Percent':       'cnsm-chip-hp',
    'Maximum Hit Points':   'cnsm-chip-hp',
    'Incoming Damage':     'cnsm-chip-damage',
    'Outgoing Damage':     'cnsm-chip-damage',
    'Stamina':            'cnsm-chip-stamina',
    'StaminaRegen':       'cnsm-chip-stamina',
    'ActionPoints':       'cnsm-chip-ap'
  };

  function chipClass(stat) {
    return STAT_CHIP_CLASSES[stat] || 'cnsm-chip-default';
  }

  function prettyStat(stat) {
    return String(stat)
      .replace(/MaxHPPercent/, 'Max HP %')
      .replace(/MaximumHitPoints/, 'Max HP')
      .replace(/ActionPoints/, 'AP')
      .replace(/StaminaRegen/, 'Stamina Regen')
      .replace(/IncomingHealing/, 'Incoming Healing')
      .replace(/OutgoingHealing/, 'Outgoing Healing')
      .replace(/IncomingDamage/, 'Incoming Damage')
      .replace(/OutgoingDamage/, 'Outgoing Damage')
      .replace(/CombatAdvantage/, 'Combat Advantage')
      .replace(/CriticalStrike/, 'Critical Strike')
      .replace(/CriticalSeverity/, 'Critical Severity')
      .replace(/CriticalAvoidance/, 'Critical Avoidance')
      .replace(/MovementSpeed/, 'Movement Speed');
  }

  function formatRating(v) {
    if (v == null) return '';
    var sign = v > 0 ? '+' : (v < 0 ? '' : '');
    return sign + Math.round(v).toLocaleString();
  }

  function formatPercent(v) {
    if (v == null) return '';
    var sign = v > 0 ? '+' : '';
    return sign + v + '%';
  }

  function formatDuration(seconds) {
    if (!seconds || seconds === 0) return null;
    if (seconds < 60) return seconds + 's';
    if (seconds < 3600) return Math.round(seconds / 60) + ' min';
    var hours = seconds / 3600;
    if (hours === Math.floor(hours)) return hours + 'h';
    return hours.toFixed(1) + 'h';
  }

  // Some notes are plain stat dumps duplicating the chips. Skip those.
  // Show notes only if they contain narrative info.
  function shouldShowNotes(notes) {
    if (!notes) return false;
    var trimmed = notes.replace(/normalized:.*$/i, '').trim();
    if (!trimmed) return false;
    // Looks like just "+X stat" or "+X% stat" repeated? skip.
    if (/^[+\-]?[\d.,%\sA-Za-z\/]+$/.test(trimmed) && trimmed.length < 60) return false;
    return true;
  }

  function cleanCardNote(notes) {
    return notes
      .replace(/\|\s*normalized:.*$/i, '')
      .replace(/normalized:.*$/i, '')
      .trim();
  }

  function renderCard(b) {
    var img = window.CONSUMABLE_IMAGES && window.CONSUMABLE_IMAGES[b.name];
    var html = '<div class="cnsm-card">';

    html += '<div class="cnsm-card-head">';
    if (img) {
      html += '<img class="cnsm-card-icon" src="images/consumables/' + escapeHtml(img) + '" alt="" loading="lazy">';
    } else {
      html += '<div class="cnsm-card-icon-ph"></div>';
    }
    html += '<div class="cnsm-card-id">';
    html += '<div class="cnsm-card-name">' + escapeHtml(b.name) + '</div>';
    if (b.source) html += '<div class="cnsm-card-source">' + escapeHtml(b.source) + '</div>';
    html += '</div>';
    html += '</div>';

    // Stat chips
    var chips = '';
    if (b.ratingStats) {
      Object.keys(b.ratingStats).forEach(function (s) {
        chips += '<span class="cnsm-chip ' + chipClass(s) + '">'
              +  escapeHtml(formatRating(b.ratingStats[s])) + ' ' + escapeHtml(prettyStat(s))
              +  '</span>';
      });
    }
    if (b.percentStats) {
      Object.keys(b.percentStats).forEach(function (s) {
        chips += '<span class="cnsm-chip ' + chipClass(s) + '">'
              +  escapeHtml(formatPercent(b.percentStats[s])) + ' ' + escapeHtml(prettyStat(s))
              +  '</span>';
      });
    }
    if (b.abilityBonuses) {
      Object.keys(b.abilityBonuses).forEach(function (s) {
        chips += '<span class="cnsm-chip cnsm-chip-ability">'
              +  escapeHtml(formatRating(b.abilityBonuses[s])) + ' ' + escapeHtml(s)
              +  '</span>';
      });
    }
    if (b.enemyType && b.damagePct) {
      chips += '<span class="cnsm-chip cnsm-chip-damage">'
            +  escapeHtml(formatPercent(b.damagePct)) + ' vs ' + escapeHtml(b.enemyType)
            +  '</span>';
    }
    if (chips) {
      html += '<div class="cnsm-chips">' + chips + '</div>';
    }

    // Narrative note (only if it adds info beyond the chips)
    if (shouldShowNotes(b.notes)) {
      html += '<div class="cnsm-note">' + escapeHtml(cleanCardNote(b.notes)) + '</div>';
    }

    // Status pills
    var pills = '';
    var dur = formatDuration(b.duration_s);
    if (dur) pills += '<span class="cnsm-pill">⏱ ' + escapeHtml(dur) + '</span>';
    if (b.expiration === 'persist') {
      pills += '<span class="cnsm-pill cnsm-pill-persist">Persists through death</span>';
    } else if (b.expiration === 'on_death') {
      pills += '<span class="cnsm-pill cnsm-pill-ondeath">Lost on death</span>';
    } else if (b.expiration === 'permanent') {
      pills += '<span class="cnsm-pill cnsm-pill-permanent">Permanent</span>';
    }
    if (b.scope === 'party') {
      pills += '<span class="cnsm-pill cnsm-pill-party">Party</span>';
    }
    if (pills) {
      html += '<div class="cnsm-pills">' + pills + '</div>';
    }

    html += '</div>';
    return html;
  }

  function render() {
    var query = (searchInput.value || '').trim().toLowerCase();
    var groups = {};
    SECTIONS.forEach(function (s) { groups[s.key] = []; });

    var totalShown = 0;
    BUFFS_DATA.forEach(function (b) {
      if (query) {
        var hay = (b.name + ' ' + (b.category || '') + ' ' + (b.notes || '') + ' ' + (b.source || '')).toLowerCase();
        if (hay.indexOf(query) === -1) return;
      }
      var cat = b.category || 'Other';
      if (!groups.hasOwnProperty(cat)) groups[cat] = [];
      groups[cat].push(b);
      totalShown += 1;
    });

    countEl.textContent = totalShown + ' of ' + BUFFS_DATA.length;

    if (totalShown === 0) {
      sectionsEl.innerHTML = '<div class="cnsm-empty">No consumables match your search.</div>';
      return;
    }

    var html = '';
    // Render sections in defined order, then any extra categories at the end.
    var rendered = {};
    SECTIONS.forEach(function (s) {
      rendered[s.key] = true;
      var items = groups[s.key];
      if (!items || items.length === 0) return;
      items.sort(function (a, b) { return a.name.localeCompare(b.name); });

      html += '<div class="cnsm-section">';
      html += '<div class="cnsm-section-head">';
      html += '<div class="cnsm-section-name">' + escapeHtml(s.key) + '</div>';
      if (s.exclusive) {
        html += '<span class="cnsm-excl-badge">Only one active at a time</span>';
      }
      html += '<span class="cnsm-section-count">' + items.length + '</span>';
      html += '</div>';
      html += '<div class="cnsm-grid">';
      items.forEach(function (b) { html += renderCard(b); });
      html += '</div>';
      html += '</div>';
    });
    Object.keys(groups).forEach(function (k) {
      if (rendered[k]) return;
      var items = groups[k];
      if (!items || items.length === 0) return;
      items.sort(function (a, b) { return a.name.localeCompare(b.name); });

      html += '<div class="cnsm-section">';
      html += '<div class="cnsm-section-head">';
      html += '<div class="cnsm-section-name">' + escapeHtml(k) + '</div>';
      html += '<span class="cnsm-section-count">' + items.length + '</span>';
      html += '</div>';
      html += '<div class="cnsm-grid">';
      items.forEach(function (b) { html += renderCard(b); });
      html += '</div>';
      html += '</div>';
    });

    sectionsEl.innerHTML = html;
  }

  searchInput.addEventListener('input', render);
  render();
})();
