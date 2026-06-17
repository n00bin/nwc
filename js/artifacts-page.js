/* ============================================================
   NWC Artifacts Page
   ============================================================ */
(function () {
  renderNav("Artifacts");

  // ============================================================
  // ALL ARTIFACTS DATA
  // ============================================================
  var artifacts = (typeof ARTIFACTS_DATA !== "undefined") ? ARTIFACTS_DATA : [];

  // ============================================================
  // DUNGEON / TRIAL RANKING (unified)
  // Ranked by debuff strength: + damage taken or − damage resistance.
  // Higher rank = stronger group damage amplification.
  // ============================================================
  var groupRanking = [
    { rank: 1,  name: "Demogorgon's Reach",            effect: "+3% damage taken per stack, up to +18% (6 stacks)",                       duration: "6s per stack" },
    { rank: 2,  name: "Charm of the Serpent",          effect: "+16% damage taken by enemies (cone)",                                     duration: "10s" },
    { rank: 3,  name: "Halaster's Blast Scepter",      effect: "−15% enemy damage resistance",                                            duration: "10s" },
    { rank: 4,  name: "Mythallar Fragment",            effect: "−15% enemy damage resistance",                                            duration: "10s" },
    { rank: 5,  name: "Nightflame Censer",             effect: "+12.5% damage taken, −11.9% enemy damage dealt + DoT",                    duration: "10s" },
    { rank: 6,  name: "Wyvern-Venom Coated Knives",    effect: "+12% damage taken, −12% enemy damage dealt",                              duration: "10s" },
    { rank: 7,  name: "Dragonbone Blades",             effect: "+12% damage taken, −12% enemy damage dealt",                              duration: "10s" },
    { rank: 8,  name: "Portable Spelljammer Detector", effect: "+12% damage taken (single-target arcane disrupt)",                        duration: "10s" },
    { rank: 9,  name: "Beacon of Meteor Swarm",        effect: "+10% damage taken + stun + DoT (AoE meteor storm)",                       duration: "10s" },
    { rank: 10, name: "Heart of the Volcano",          effect: "+10% damage taken from all sources + 10% self DR (line)",                 duration: "10s" },
    { rank: 11, name: "Jewel of the Caldera",          effect: "+10% damage taken (lunge, line)",                                         duration: "10s" },
    { rank: 12, name: "Marco's Mystic Marker",         effect: "+10% damage taken from all sources (single-target rapid arcane)",         duration: "10s" },
    { rank: 13, name: "Crystal of Soul's Flight",      effect: "+10% damage taken (all sources) + 15% from your attacks",                 duration: "10s" },
    { rank: 14, name: "Lantern of Revelation",         effect: "+10% damage taken by enemies (AoE)",                                      duration: "10s" },
    { rank: 15, name: "Thirst",                        effect: "+10% damage taken by enemies (lunge, line)",                              duration: "10s" },
    { rank: 16, name: "Frozen Storyteller's Journal",  effect: "+10% ally damage + 10% incoming damage reduction + stun",                 duration: "15s" },
    { rank: 17, name: "Black Dragon's Mark",           effect: "−10% enemy damage resistance (acid ball)",                                duration: "10s" },
    { rank: 18, name: "Heart of the Black Dragon",     effect: "+10% damage taken by enemies (line, shorter duration)",                   duration: "6s" },
    { rank: 19, name: "Broken Halo",                   effect: "+9% damage taken + stuns lesser enemies (AoE light burst)",               duration: "10s" },
    { rank: 20, name: "Marilith Mask",                 effect: "+7.5% damage taken (laser beams)",                                        duration: "10s" },
    { rank: 21, name: "Realm Engine Core",             effect: "+7.5% damage taken + self shield 15% HP (single-target)",                 duration: "10s" },
    { rank: 22, name: "Sealing Parchment",             effect: "+7.5% damage taken + DoT + self Deflect/Sev",                             duration: "10s" },
    { rank: 23, name: "Wand of Domination",            effect: "+7.5% damage taken + 4s charm (frontal gaze)",                            duration: "10s" },
    { rank: 24, name: "Wrath of Kossuth",              effect: "+7.5% damage taken (Primordial Burn) on attackers",                       duration: "10s" },
    { rank: 25, name: "Bloodbrass Pistol",             effect: "+6% damage taken (single-target Blunderbuss)",                            duration: "10s" },
    { rank: 26, name: "Demon Skull",                   effect: "+5% damage taken + −5% Accuracy (3-imp swarm)",                           duration: "10s" },
    { rank: 27, name: "Tentacle Rod",                  effect: "+5% damage taken + −5% Movement/Awareness + daze",                        duration: "10s" },
    { rank: 28, name: "Vanguard's Banner",             effect: "+5% damage taken + 5,000 ally Power/Crit Avoidance",                      duration: "30s" },
    { rank: 29, name: "Sparkling Fey Emblem",          effect: "+5% damage taken + 5% ally Defense/Crit Avoidance",                       duration: "15s" },
    { rank: 30, name: "Neverwinter's Standard",        effect: "+5% damage taken + 5% ally Recharge Speed",                               duration: "15s" },
    { rank: 31, name: "Alaric's Artillery Beacon",     effect: "Up to +5% damage taken + stun (AoE)",                                     duration: "10s" },
  ];

  // ============================================================
  // ARTIFACT SETS
  // ============================================================
  var artifactSets = [
    { name: "Apprentices' Spoils", pieces: "Arcturia's Music Box + Jhesiyra's Tattered Mantle + Trobriand's Conduction Cable", bonus: "When you use a Daily Power, deal 15% more damage vs monsters not facing you for 10s.", best: "DPS (Best in Slot)" },
    { name: "Armaments of the Wyvern", pieces: "Wyvern-Venom Coated Knives + Wyvern's Eye Necklace + Wyvern-Skin Belt", bonus: "Daily Power creates Rune of Aggression: allies gain +5% Power, +5% Crit Severity, +5% damage for 6s.", best: "Support DPS" },
    { name: "Reflective Armaments", pieces: "Erratic Drift Globe + Reflective Collar + Mirror-Plated Belt", bonus: "Daily Power creates Rune of Fortification: allies gain +5% Defense, +5% Deflect, -5% damage taken for 6s.", best: "Support Tank" },
    { name: "Enchanted Thumb", pieces: "Staff of Flowers + Woven Vine + Blooming Cord", bonus: "Daily Power creates Rune of Cooperation: allies gain +5% Awareness, +5% CA, CC immunity for 6s.", best: "Support" },
    { name: "Valhalla's Rebuke", pieces: "Horn of Valhalla + Cloak of Valhalla + Belt of Valhalla", bonus: "When foe hits you, they deal 1% less damage for 6s, stacks 5x (5% max).", best: "Tank (Best in Slot)" },
    { name: "Tiamat", pieces: "Tiamat's Orb of Majesty + Amulet of Tiamat's Demise + Tiamat Sash", bonus: "+5% Outgoing Healing and +5% Incoming Healing.", best: "Healer (Best in Slot)" },
    { name: "Dark Remnant", pieces: "Book of Vile Darkness + Engine Master's Mantle + Whip of the Erinyes", bonus: "+5% damage vs demons/devils/fiends, +2.5% vs others.", best: "DPS (Avernus/IC)" },
    { name: "Lostmauth's Hoard", pieces: "Lostmauth's Horn + Lostmauth's Hoard Necklace + Golden Belt of Puissance", bonus: "On crit, additional hit equal to your Damage stat.", best: "DPS (crit builds)" },
    { name: "Apocalypse", pieces: "Apocalypse Dagger + Apocalypse Choker + Apocalypse Bindings", bonus: "On crit, target takes +1% more damage for 5s, stacks 5x (5% group debuff).", best: "Support" },
    { name: "Star Set", pieces: "Sparkling Fey Emblem + Starshard Choker + Twinkle of the Stars", bonus: "Up to 10% additional damage or healing based on HP% difference.", best: "DPS / Healer" },
    { name: "Demon Lords' Immortality", pieces: "Shard of Orcus' Wand + Baphomet's Infernal Talisman + Demogorgon's Girdle", bonus: "Up to 10% additional damage based on HP% difference.", best: "DPS (budget)" },
    { name: "Mad Dash", pieces: "Halaster's Blast Scepter + Necklace/Belt of the Mad Mage", bonus: "Stand still 3s: +5% damage and movement speed.", best: "DPS (situational)" },
    { name: "Set of the Serpent", pieces: "Charm of the Serpent + Skin of the Serpent + Wrap of the Serpent", bonus: "Moving 3s: +1% damage, up to 5% after 15s. Resets standing still 5s.", best: "DPS (hard to use)" },
    { name: "Diamond Set", pieces: "Refulgent Diamond Pin + Iridescent Diamond Pendant + Scintilliant Diamond Buckle", bonus: "Stand still 3s: -5% damage taken, +5% Awareness.", best: "Tank (situational)" },
    { name: "Armaments of Construct Demise", pieces: "Trobriand's Ring + Electric Collar + Chained Restraints", bonus: "Daily Power: +5% damage, -5% damage taken for 10s.", best: "Hybrid" },
    { name: "Vistani", pieces: "Tarokka Deck + Vistani Pendant + Vistani Raiments", bonus: "Single-target AoE: target takes +5% damage for 5s.", best: "Tank support" },
    { name: "Soulmonger", pieces: "Decanter of Atropal Essence + Mantle/Cincture of Atropal Essence", bonus: "On heal: Temp HP = 25% of heal, up to 5% max HP (30s CD).", best: "Tank sustain" },
    { name: "Storyteller's Journals", pieces: "2-3 of 4 Journals", bonus: "2pc: +1 all ability scores, +0.5% Power, +5k HP per journal. 3pc: Crit = bonus damage hit.", best: "DPS (expensive)" },
    { name: "Hearts of the Dragons", pieces: "Any 3 of 5 Dragon Hearts", bonus: "+10% Recharge Speed.", best: "Cooldown builds" },
    { name: "Lathander", pieces: "Eye of Lathander + Lathander's Cloak + Greater Lathander's Belt", bonus: "On revive: allies heal 50% HP, +1% Awareness, injury immunity.", best: "Niche" },
    { name: "Redeemed", pieces: "Memories + Divine Focus + Celestial Sash", bonus: "+3% Incoming Healing. When healed: +5% Power for 6s.", best: "Healer (rare)" },
  ];

  // ============================================================
  // RENDERING
  // ============================================================
  var searchInput = document.getElementById("search");
  var filterType = document.getElementById("filter-type");
  var allControls = document.getElementById("all-controls");

  var typeLabels = { debuff: "Group Debuff", personal: "Personal DPS", tank: "Tank / Mitigation", utility: "Utility / Healing", damage: "Damage Only" };
  var typeBadgeClass = { debuff: "stat-negative", personal: "stat-positive", tank: "stat-neutral", utility: "stat-neutral", damage: "stat-positive" };

  var STAT_LABELS = {
    Power: "Power",
    "Critical Strike": "Critical Strike",
    "Critical Severity": "Critical Severity",
    "Critical Avoidance": "Critical Avoidance",
    "Combat Advantage": "Combat Advantage",
    Defense: "Defense",
    Deflect: "Deflect",
    "Deflect Severity": "Deflect Severity",
    Accuracy: "Accuracy",
    Awareness: "Awareness",
    Forte: "Forte",
    "Incoming Healing": "Incoming Healing",
    "Outgoing Healing": "Outgoing Healing",
    "Control Resist": "Control Resist",
    "Control Bonus": "Control Bonus",
    "Gold Bonus": "Gold Bonus",
    "Max HP": "Max HP",
    "Stamina Regen": "Stamina Regen"
  };
  function prettyArtifactStat(key) { return STAT_LABELS[key] || key; }

  function renderAllArtifacts() {
    var query = searchInput.value.trim().toLowerCase();
    var typeVal = filterType.value;

    var filtered = artifacts.filter(function (a) {
      if (query && (a.name + " " + a.power + " " + a.set).toLowerCase().indexOf(query) === -1) return false;
      if (typeVal && a.type !== typeVal) return false;
      return true;
    });

    var html = "";
    for (var i = 0; i < filtered.length; i++) {
      var a = filtered[i];
      html += '<div class="art-card" data-idx="' + i + '">';
      html += '<div class="art-card-header">';
      html += '<span class="art-card-name">';
      if (a.image) {
        html += '<img loading="lazy" class="art-list-icon" src="' + escapeHtml(a.image) + '" alt="">';
      }
      html += escapeHtml(a.name) + '</span>';
      html += '<span><span class="' + (typeBadgeClass[a.type] || '') + '" style="font-size:0.78rem;">' + (typeLabels[a.type] || a.type) + '</span> <span class="toggle-arrow">&#9654;</span></span>';
      html += '</div>';
      html += '<div class="art-card-body">';
      if (a.image) {
        html += '<img loading="lazy" class="art-icon" src="' + escapeHtml(a.image) + '" alt="' + escapeHtml(a.name) + '">';
      }
      html += '<div class="art-effect">' + escapeHtml(a.power) + '</div>';
      if (a.item_level || a.combinedRating) {
        html += '<div class="art-il-row">';
        if (a.item_level)      html += '<span class="art-il-pill"><span class="art-il-label">Item Level</span><span class="art-il-value">' + a.item_level.toLocaleString() + '</span></span>';
        if (a.combinedRating)  html += '<span class="art-il-pill"><span class="art-il-label">Combined Rating</span><span class="art-il-value">' + a.combinedRating.toLocaleString() + '</span></span>';
        html += '</div>';
      }
      // Stats at Mythic — rating stats + any percent stats (Stamina Regen, Gold
      // Bonus), shown as green chips matching the rest of the site.
      var statEntries = [];
      if (a.ratingStats && typeof a.ratingStats === 'object') {
        statEntries = Object.entries(a.ratingStats).map(function (e) { return [e[0], e[1], false]; });
      } else if (a.stats && a.stats.length > 0) {
        statEntries = a.stats.map(function (s) { return [s.stat, s.value, false]; });
      }
      if (a.percentStats && typeof a.percentStats === 'object') {
        Object.entries(a.percentStats).forEach(function (e) { statEntries.push([e[0], e[1], true]); });
      }
      if (statEntries.length > 0) {
        html += '<div class="art-stats-block">';
        html += '<div class="art-stats-title">Stats at Mythic</div>';
        html += '<div class="art-stats-chips">';
        for (var si = 0; si < statEntries.length; si++) {
          var statName = statEntries[si][0];
          var statVal  = statEntries[si][1];
          var isPct    = statEntries[si][2] || statName === 'Stamina Regen' || statName === 'StaminaRegen';
          var valStr   = isPct ? ('+' + statVal + '%') : ('+' + statVal.toLocaleString());
          html += '<span class="art-stat-chip">' + escapeHtml(prettyArtifactStat(statName)) + ': ' + valStr + '</span>';
        }
        html += '</div></div>';
      }
      if (a.debuff && a.debuff !== "None") {
        html += '<div class="art-info-row"><span class="art-info-label">Buff/Debuff</span><span class="art-info-value">' + escapeHtml(a.debuff) + '</span></div>';
      }
      html += '<div class="art-info-row"><span class="art-info-label">Cooldown</span><span class="art-info-value">' + a.cooldown + 's</span></div>';
      if (a.set && a.set !== "None") {
        html += '<div class="art-info-row"><span class="art-info-label">Set</span><span class="art-info-value">' + escapeHtml(a.set) + '</span></div>';
      }
      html += '<div class="art-info-row"><span class="art-info-label">Source</span><span class="art-info-value">' + escapeHtml(a.source) + '</span></div>';
      html += '</div></div>';
    }
    document.getElementById("all-list").innerHTML = html || '<div class="empty-state">No artifacts match your filters</div>';
  }

  function findArtifactImage(name) {
    for (var i = 0; i < artifacts.length; i++) {
      if (artifacts[i].name === name && artifacts[i].image) return artifacts[i].image;
    }
    return "";
  }

  function renderRanking(data, containerId) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
      var r = data[i];
      var img = findArtifactImage(r.name);
      html += '<div class="rank-card">';
      if (img) {
        html += '<img loading="lazy" class="art-icon" src="' + escapeHtml(img) + '" alt="' + escapeHtml(r.name) + '">';
      }
      html += '<div style="font-weight:600;"><span style="color:var(--highlight);margin-right:0.5rem;">#' + r.rank + '</span>' + escapeHtml(r.name) + '</div>';
      html += '<div class="art-effect" style="margin-top:0.4rem;">' + escapeHtml(r.effect) + '</div>';
      html += '<div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.25rem;">Duration: ' + r.duration + '</div>';
      html += '</div>';
    }
    document.getElementById(containerId).innerHTML = html;
  }

  function renderSets() {
    var html = "";
    for (var i = 0; i < artifactSets.length; i++) {
      var s = artifactSets[i];
      html += '<div class="art-card" data-idx="' + i + '">';
      html += '<div class="art-card-header">';
      html += '<span class="art-card-name">' + escapeHtml(s.name) + '</span>';
      html += '<span style="font-size:0.78rem;color:var(--text-muted);">' + escapeHtml(s.best) + ' <span class="toggle-arrow">&#9654;</span></span>';
      html += '</div>';
      html += '<div class="art-card-body">';
      html += '<div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.4rem;">' + escapeHtml(s.pieces) + '</div>';
      html += '<div class="art-set">' + escapeHtml(s.bonus) + '</div>';
      html += '</div></div>';
    }
    document.getElementById("sets-list").innerHTML = html;
  }

  // ============================================================
  // TAB SWITCHING
  // ============================================================
  // Enchantments tab — every enchant across all 6 rarities (the `rarities`
  // ladder lives in the data; companion enchant uses its own `rarityLadder`).
  function renderEnchants() {
    var data = (typeof ENCHANTS_DATA !== "undefined") ? ENCHANTS_DATA : [];
    var TIERS = ["Uncommon", "Rare", "Epic", "Legendary", "Mythic", "Celestial"];
    function cap(x) { return x.charAt(0).toUpperCase() + x.slice(1); }
    function fmt(v, pct) { return (v == null) ? "&mdash;" : (pct ? ("+" + v + "%") : ("+" + Number(v).toLocaleString())); }
    function lines(e) {
      var L = [];
      if (e.slotType === "companion" && e.rarityLadder) {
        L.push({ label: "Companion Damage", pct: true, vals: TIERS.map(function (t) { return e.rarityLadder[t] ? e.rarityLadder[t].companionDamagePct : null; }) });
        L.push({ label: "Augment Bonus (each stat)", pct: false, vals: TIERS.map(function (t) { return e.rarityLadder[t] ? e.rarityLadder[t].augmentBonusPerStat : null; }) });
        return L;
      }
      var rar = e.rarities || {};
      if (e.slotType === "Universal") {
        ["offense", "defense", "utility"].forEach(function (slot) {
          var cel = ((rar.Celestial || {}).universal || e.universal || {})[slot] || {};
          Object.keys(cel).forEach(function (stat) {
            L.push({ label: cap(slot) + ": " + stat, pct: false, vals: TIERS.map(function (t) { return (((rar[t] || {}).universal || {})[slot] || {})[stat]; }) });
          });
        });
      } else {
        var celp = (rar.Celestial || {}).percentStats || e.percentStats || {};
        Object.keys(celp).forEach(function (stat) {
          L.push({ label: stat, pct: true, vals: TIERS.map(function (t) { return ((rar[t] || {}).percentStats || {})[stat]; }) });
        });
      }
      return L;
    }
    // In-game rarity colors (Uncommon→Celestial). Celestial = the standout top tier.
    var RARITY_COLOR = { Uncommon: "#3ecf5a", Rare: "#3a9bff", Epic: "#b765ff", Legendary: "#ffaa33", Mythic: "#ff5b5b", Celestial: "#3fe0e0" };
    function card(e) {
      var ls = lines(e);
      var h = '<div class="art-card"><div class="art-card-header"><span class="art-card-name">' + escapeHtml(e.displayName || e.name) + '</span>';
      h += '<span><span style="font-size:0.68rem;padding:0.12rem 0.55rem;border-radius:10px;background:rgba(63,224,224,0.12);color:' + RARITY_COLOR.Celestial + ';border:1px solid rgba(63,224,224,0.35);">' + escapeHtml(e.slotType === "companion" ? "Companion" : e.slotType) + '</span> <span class="toggle-arrow">&#9654;</span></span></div>';
      h += '<div class="art-card-body">';
      if (e.description) h += '<div class="art-effect" style="margin-bottom:0.5rem;">' + escapeHtml(e.description) + '</div>';
      h += '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.82rem;">';
      h += '<thead><tr><th style="text-align:left;padding:0.35rem 0.6rem;color:var(--text-muted);font-weight:600;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.04em;">Stat</th>';
      TIERS.forEach(function (t) {
        var top = t === "Celestial";
        h += '<th style="padding:0.35rem 0.6rem;text-align:right;white-space:nowrap;color:' + RARITY_COLOR[t] + ';font-weight:' + (top ? '800' : '600') + ';font-size:' + (top ? '0.82rem' : '0.72rem') + ';' + (top ? 'border-bottom:2px solid ' + RARITY_COLOR.Celestial + ';' : '') + '">' + t + '</th>';
      });
      h += '</tr></thead><tbody>';
      ls.forEach(function (ln) {
        h += '<tr><td style="padding:0.3rem 0.6rem;color:var(--text-primary);font-weight:500;white-space:nowrap;">' + escapeHtml(ln.label) + '</td>';
        ln.vals.forEach(function (v, i) {
          var top = TIERS[i] === "Celestial";
          h += '<td style="padding:0.3rem 0.6rem;text-align:right;white-space:nowrap;' + (top ? 'background:rgba(63,224,224,0.09);color:' + RARITY_COLOR.Celestial + ';font-weight:700;font-size:0.88rem;' : 'color:var(--text-muted);font-weight:400;') + '">' + fmt(v, ln.pct) + '</td>';
        });
        h += '</tr>';
      });
      return h + '</tbody></table></div></div></div>';
    }
    var GROUPS = [
      { key: "Universal", label: "Universal &mdash; Gemstones (offense / defense / utility)" },
      { key: "Combat", label: "Combat &mdash; Weapon / Armor" },
      { key: "Bonus", label: "Bonus Slot" },
      { key: "companion", label: "Companion" }
    ];
    var html = '<div style="color:var(--text-secondary);font-size:0.88rem;margin:0.5rem 0 1rem;">Every enchantment across all 6 rarities (Uncommon &rarr; Celestial). You upgrade these over time, so a lower rank gives smaller numbers than the top Celestial tier &mdash; set the rank you own per slot in the Toon Forge build tool.</div>';
    GROUPS.forEach(function (g) {
      var list = data.filter(function (e) { return e.slotType === g.key; });
      if (!list.length) return;
      html += '<h2 style="font-size:1.05rem;margin:1.2rem 0 0.5rem;color:var(--accent);border-bottom:1px solid var(--border);padding-bottom:0.3rem;">' + g.label + ' <span style="color:var(--text-muted);font-weight:400;font-size:0.85rem;">(' + list.length + ')</span></h2>';
      list.forEach(function (e) { html += card(e); });
    });
    document.getElementById("enchants-list").innerHTML = html;
  }

  var tabs = document.querySelectorAll(".view-tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");
      document.querySelectorAll(".art-view").forEach(function (v) { v.classList.remove("active"); });
      document.getElementById("view-" + tab.getAttribute("data-tab")).classList.add("active");
      allControls.style.display = tab.getAttribute("data-tab") === "all" ? "" : "none";

      if (tab.getAttribute("data-tab") === "ranking") renderRanking(groupRanking, "ranking-list");
      if (tab.getAttribute("data-tab") === "enchants") renderEnchants();
      if (tab.getAttribute("data-tab") === "sets") renderSets();
    });
  });

  // ============================================================
  // EVENT HANDLERS
  // ============================================================
  document.querySelectorAll(".art-container").forEach(function (container) {
    container.addEventListener("click", function (e) {
      var card = e.target.closest(".art-card");
      if (card) card.classList.toggle("open");
    });
  });

  searchInput.addEventListener("input", renderAllArtifacts);
  filterType.addEventListener("change", renderAllArtifacts);

  // Initial render
  renderAllArtifacts();
})();
