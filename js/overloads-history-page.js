/* ============================================================
   NWC — Historical Overloads tab on the Consumables page
   Display-only reference. Reads data/overloads-historical.json (hand-curated,
   community wiki text, NOT screenshot-verified). Toon Forge and the optimizer
   never read that file — their overloads live in ../data/overloads.json.
   Tab switching for all three Consumables tabs lives in lockboxes-page.js.
   ============================================================ */
(function () {
  "use strict";

  var searchInput = document.getElementById("ovh-search");
  var categorySelect = document.getElementById("ovh-category");
  var targetSelect = document.getElementById("ovh-target");
  var countEl = document.getElementById("ovh-count");
  var sectionsEl = document.getElementById("ovh-sections");
  if (!sectionsEl) return;

  var ALIAS_CATEGORY = "Legacy Greater Draconic Glyph aliases";
  var categories = [];
  var catalogVersion = "";
  try {
    var scriptSource = document.currentScript && document.currentScript.src;
    if (scriptSource) catalogVersion = new URL(scriptSource).searchParams.get("v") || "";
  } catch (e) {}

  function esc(value) {
    return escapeHtml(String(value == null ? "" : value));
  }

  // "Rank 1" -> "rank_1_effect", "Greater" -> "greater_effect" (the source schema).
  function versionKey(version) {
    return String(version).toLowerCase().replace(/\s+/g, "_") + "_effect";
  }

  function isCompanionCategory(cat) {
    return /^Companion /.test(cat.category);
  }

  function versionLabel(cat) {
    if (cat.category === ALIAS_CATEGORY) return "Older names";
    if (Array.isArray(cat.versions) && cat.versions.length) return cat.versions.join(" / ");
    return "Single version";
  }

  function effectRows(cat, entry) {
    if (entry.same_family_as) {
      return '<p class="lb-muted">Older name for ' + nameHtml(entry.same_family_as)
        + ' (see Draconic Glyphs above). Same item family, not a separate effect.</p>';
    }
    var rows = [];
    if (Array.isArray(cat.versions) && cat.versions.length) {
      cat.versions.forEach(function (v) {
        var text = entry[versionKey(v)];
        rows.push('<div class="ovh-effect"><span class="ovh-effect-label">' + esc(v) + "</span>"
          + '<span class="ovh-effect-text">' + (text ? esc(text) : '<em class="lb-muted">Not listed</em>') + "</span></div>");
      });
    } else if (entry.effect) {
      rows.push('<div class="ovh-effect ovh-effect-single"><span class="ovh-effect-text">' + esc(entry.effect) + "</span></div>");
    }
    return rows.join("");
  }

  function cardHtml(cat, entry) {
    var condition = entry.trigger_condition
      ? '<p class="ovh-condition">' + esc(entry.trigger_condition) + "</p>"
      : "";
    return '<article class="lb-card ovh-card">'
      + '<h3 class="lb-name">' + nameHtml(entry.name) + "</h3>"
      + condition + effectRows(cat, entry)
      + "</article>";
  }

  function sectionHtml(cat, entries) {
    var tags = '<span class="lb-tag">' + esc(versionLabel(cat)) + "</span>";
    if (isCompanionCategory(cat)) tags += '<span class="lb-tag ovh-tag-companion">Companion only</span>';
    var facts = [];
    if (cat.trigger) facts.push("<strong>Trigger:</strong> " + esc(cat.trigger));
    if (cat.duration) facts.push("<strong>Duration:</strong> " + esc(cat.duration));
    // The alias category's source note is an instruction for data entry, not
    // player text — show a plain explanation instead.
    var note = cat.category === ALIAS_CATEGORY
      ? "Some older wiki pages list the Draconic Glyphs under these names. They are the same items as the Draconic Glyphs above."
      : (cat.effect_note || "");
    return '<section class="cnsm-section ovh-section">'
      + '<div class="cnsm-section-head"><span class="cnsm-section-name">' + esc(cat.category) + "</span>"
      + '<span class="lb-tags">' + tags + "</span>"
      + '<span class="cnsm-section-count">' + entries.length + (entries.length === 1 ? " item" : " items") + "</span></div>"
      + (facts.length ? '<p class="ovh-facts">' + facts.join(" &middot; ") + "</p>" : "")
      + (note ? '<p class="ovh-note">' + esc(note) + "</p>" : "")
      + '<div class="lb-grid">' + entries.map(function (e) { return cardHtml(cat, e); }).join("") + "</div>"
      + "</section>";
  }

  function render() {
    var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var category = categorySelect ? categorySelect.value : "";
    var target = targetSelect ? targetSelect.value : "";
    var total = 0;
    var shown = 0;
    var html = "";
    categories.forEach(function (cat) {
      total += cat.entries.length;
      if (category && cat.category !== category) return;
      if (target === "player" && isCompanionCategory(cat)) return;
      if (target === "companion" && !isCompanionCategory(cat)) return;
      var matches = cat.entries.filter(function (e) {
        return !query || e._search.indexOf(query) >= 0;
      });
      if (!matches.length) return;
      shown += matches.length;
      html += sectionHtml(cat, matches);
    });
    sectionsEl.innerHTML = html || '<div class="lb-empty">No overloads match those filters.</div>';
    countEl.textContent = "Showing " + shown + " of " + total + " entries";
  }

  function load(data) {
    categories = (data && Array.isArray(data.categories)) ? data.categories : [];
    // Alias names feed their family's search text, so searching an old name
    // ("Greater Red Dragon Glyph") also finds the glyph it refers to.
    var aliasesByFamily = {};
    categories.forEach(function (cat) {
      (cat.entries || []).forEach(function (e) {
        if (e.same_family_as) (aliasesByFamily[e.same_family_as] = aliasesByFamily[e.same_family_as] || []).push(e.name);
      });
    });
    categories.forEach(function (cat) {
      cat.entries = Array.isArray(cat.entries) ? cat.entries : [];
      cat.entries.forEach(function (e) {
        var parts = [cat.category, cat.trigger, cat.duration, cat.effect_note];
        Object.keys(e).forEach(function (k) { if (k.charAt(0) !== "_") parts.push(e[k]); });
        parts = parts.concat(aliasesByFamily[e.name] || []);
        e._search = parts.filter(Boolean).join(" ").toLowerCase();
      });
    });
    if (categorySelect) {
      categorySelect.innerHTML = '<option value="">All Categories</option>' + categories.map(function (cat) {
        return '<option value="' + esc(cat.category) + '">' + esc(cat.category) + "</option>";
      }).join("");
    }
    render();
  }

  if (searchInput) searchInput.addEventListener("input", render);
  if (categorySelect) categorySelect.addEventListener("change", render);
  if (targetSelect) targetSelect.addEventListener("change", render);

  var url = "data/overloads-historical.json";
  if (catalogVersion) url += "?v=" + encodeURIComponent(catalogVersion);
  fetch(url)
    .then(function (response) {
      if (!response.ok) throw new Error("Overload reference could not be loaded.");
      return response.json();
    })
    .then(load)
    .catch(function () {
      countEl.textContent = "The overload reference could not be loaded. Please refresh the page.";
      sectionsEl.innerHTML = "";
    });
})();
