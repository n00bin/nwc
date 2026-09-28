/* ============================================================
   NWC — Lockboxes tab on the Consumables page
   ============================================================ */
(function () {
  "use strict";

  var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-consumables-tab]"));
  var panels = {
    consumables: document.getElementById("consumables-view"),
    lockboxes: document.getElementById("lockboxes-view")
  };
  var controls = {
    consumables: document.getElementById("consumables-controls"),
    lockboxes: document.getElementById("lockboxes-controls")
  };
  var searchInput = document.getElementById("lb-search");
  var groupSelect = document.getElementById("lb-group");
  var availabilitySelect = document.getElementById("lb-availability");
  var countEl = document.getElementById("lb-count");
  var cardsEl = document.getElementById("lb-cards");
  var entries = [];
  var catalogVersion = "";
  try {
    var scriptSource = document.currentScript && document.currentScript.src;
    if (scriptSource) catalogVersion = new URL(scriptSource).searchParams.get("v") || "";
  } catch (e) {}

  function esc(value) {
    return escapeHtml(String(value == null ? "" : value));
  }

  function humanize(value) {
    return String(value || "").replace(/[_-]+/g, " ").replace(/\b\w/g, function (letter) {
      return letter.toUpperCase();
    });
  }

  function groupName(group) {
    if (group === "keyed_lockboxes") return "Keyed Lockbox";
    if (group === "related_containers") return "Related Container";
    return "Historical Variant";
  }

  function availabilityKey(item) {
    var known = ["currently_dropping", "rotated_out_of_current_drops", "periodic_resurgence"];
    return known.indexOf(item.availability_status) >= 0 ? item.availability_status : "unknown";
  }

  function availabilityName(status) {
    if (status === "currently_dropping") return "Currently Dropping";
    if (status === "rotated_out_of_current_drops") return "Not Currently Dropping";
    if (status === "periodic_resurgence") return "Periodic Return";
    return "Availability Not Confirmed";
  }

  function formatDate(value) {
    if (!value) return "";
    var date = new Date(value + "T00:00:00Z");
    if (isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
  }

  function dateInfo(item) {
    if (item.release_date_pc) return "PC introduction: " + formatDate(item.release_date_pc);
    if (Array.isArray(item.date_range_pc) && item.date_range_pc.length) {
      return "PC variant dates: " + item.date_range_pc.map(formatDate).join(" – ");
    }
    return "Introduction date not listed";
  }

  function keyInfo(item) {
    if (item.key_required === true) return "Key required";
    if (item.key_required === false) return "No key required";
    return "Key requirement not listed";
  }

  function renderTree(value) {
    if (Array.isArray(value)) {
      if (!value.length) return '<span class="lb-muted">None listed</span>';
      return '<ul class="lb-rewards">' + value.map(function (part) {
        return "<li>" + renderTree(part) + "</li>";
      }).join("") + "</ul>";
    }
    if (value && typeof value === "object") {
      return '<div class="lb-detail-body">' + Object.keys(value).map(function (key) {
        return '<div class="lb-tree-group"><strong>' + esc(humanize(key)) + ":</strong> " + renderTree(value[key]) + "</div>";
      }).join("") + "</div>";
    }
    return esc(value);
  }

  function percent(value) {
    var number = Number(value);
    if (!isFinite(number)) return "";
    return number.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") + "%";
  }

  function oddsText(rate) {
    var values = [];
    if (rate.odds_raw) values.push(String(rate.odds_raw));
    if (rate.rate_percent != null) values.push(percent(rate.rate_percent));
    if (rate.average_amount != null) values.push("historical average: " + rate.average_amount + " per opening");
    return values.length ? values.join(" · ") : "Rate details not listed";
  }

  function rateBlock(item) {
    var rates = item.drop_rates || {};
    var official = Array.isArray(rates.official_exact) ? rates.official_exact : [];
    var estimates = Array.isArray(rates.historical_community_estimates) ? rates.historical_community_estimates : [];
    if (!official.length && !estimates.length) {
      return '<p class="lb-muted">No drop rate found in the sources reviewed.</p>';
    }

    var html = "";
    if (official.length) {
      html += '<div class="lb-section-label">Displayed in-game chances</div>';
      html += '<table class="lb-rate-table"><thead><tr><th scope="col">Outcome</th><th scope="col">Chance</th></tr></thead><tbody>';
      html += official.map(function (rate) {
        return "<tr><td>" + esc(rate.item) + "</td><td>" + esc(oddsText(rate)) + "</td></tr>";
      }).join("");
      html += "</tbody></table>";
    }
    if (estimates.length) {
      html += '<div class="lb-section-label">Historical community sample</div>';
      html += '<table class="lb-rate-table"><thead><tr><th scope="col">Outcome</th><th scope="col">Sample result</th></tr></thead><tbody>';
      html += estimates.map(function (rate) {
        return "<tr><td>" + esc(rate.item) + "</td><td>" + esc(oddsText(rate)) + "</td></tr>";
      }).join("");
      html += "</tbody></table>";
    }
    return html;
  }

  function sourceName(url, index) {
    var host = "";
    try { host = new URL(url).hostname.toLowerCase(); } catch (e) {}
    if (host.indexOf("fandom.com") >= 0) return "Neverwinter Wiki";
    if (host.indexOf("arcgames.com") >= 0) return "Arc Games";
    if (host.indexOf("nwo-uncensored.com") >= 0) return "NW Uncensored";
    return "Source " + (index + 1);
  }

  function sourceLinks(item) {
    var urls = Array.isArray(item.source_urls) ? item.source_urls.slice() : [];
    var iconUrl = item.icon && item.icon.source_page_url;
    if (iconUrl && urls.indexOf(iconUrl) < 0) urls.push(iconUrl);
    if (!urls.length) return "";
    return '<div class="lb-source-links">' + urls.map(function (url, index) {
      return '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(sourceName(url, index)) + "</a>";
    }).join("") + "</div>";
  }

  function statusText(value) {
    var labels = {
      full_outcome_pool_transcribed: "Full listed pool transcribed",
      detailed_box_outcomes_transcribed: "Detailed outcomes transcribed",
      headliners_only: "Headliners only",
      reward_list_not_yet_verified: "Reward list needs verification",
      needs_version_check_or_varies_by_event: "Varies by version or event"
    };
    return labels[value] || "Reward details not fully verified";
  }

  function cardHtml(item) {
    var imageUrl = item.icon && item.icon.direct_image_url;
    var iconHtml = imageUrl
      ? '<img class="lb-icon" src="' + esc(imageUrl) + '" alt="" loading="lazy">'
      : '<div class="lb-icon-placeholder" role="img" aria-label="No verified box icon">Icon<br>unverified</div>';
    var headliners = Array.isArray(item.confirmed_headliner_rewards) ? item.confirmed_headliner_rewards : [];
    var rewardHtml = headliners.length
      ? '<div class="lb-section-label">Confirmed headliners</div><ul class="lb-rewards">' + headliners.map(function (name) { return "<li>" + esc(name) + "</li>"; }).join("") + "</ul>"
      : '<p class="lb-muted">No confirmed headliner listed.</p>';

    var details = "";
    if (item.contents_detail && typeof item.contents_detail === "object") {
      details += '<details class="lb-details"><summary>Reward outcomes — ' + esc(statusText(item.contents_detail_status)) + "</summary>" + renderTree(item.contents_detail) + "</details>";
    } else {
      details += '<p class="lb-muted">' + esc(statusText(item.contents_detail_status)) + "</p>";
    }
    var rates = item.drop_rates || {};
    if ((rates.official_exact && rates.official_exact.length) || (rates.historical_community_estimates && rates.historical_community_estimates.length)) {
      details += '<details class="lb-details"><summary>Drop-rate details</summary>' + rateBlock(item) + "</details>";
    } else {
      details += rateBlock(item);
    }
    if (item.guarantee_after_openings) {
      details += '<p class="lb-muted">Milestone system: ' + esc(item.guarantee_after_openings) + " openings.</p>";
    }

    var currentClass = availabilityKey(item) === "currently_dropping" ? " lb-tag-current" : "";
    return '<article class="lb-card">'
      + '<div class="lb-card-head">' + iconHtml
      + '<div class="lb-title-wrap"><h3 class="lb-name">' + esc(item.name) + '</h3><div class="lb-tags">'
      + '<span class="lb-tag">' + esc(groupName(item.catalog_group)) + "</span>"
      + '<span class="lb-tag' + currentClass + '">' + esc(availabilityName(availabilityKey(item))) + "</span>"
      + "</div></div></div>"
      + '<p class="lb-facts">' + esc(dateInfo(item)) + " · " + esc(keyInfo(item)) + "</p>"
      + rewardHtml + details + sourceLinks(item)
      + "</article>";
  }

  function applyFilters() {
    var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var group = groupSelect ? groupSelect.value : "";
    var availability = availabilitySelect ? availabilitySelect.value : "";
    var shown = entries.filter(function (item) {
      var groupMatch = !group || item.catalog_group === group;
      var availabilityMatch = !availability || availabilityKey(item) === availability;
      var searchMatch = !query || item.search_text.indexOf(query) >= 0;
      return groupMatch && availabilityMatch && searchMatch;
    });
    cardsEl.innerHTML = shown.length
      ? shown.map(cardHtml).join("")
      : '<div class="lb-empty">No lockboxes match those filters.</div>';
    var checked = window.lockboxCatalogLastChecked || "";
    countEl.textContent = "Showing " + shown.length + " of " + entries.length + " entries"
      + (checked ? " · Catalog checked " + formatDate(checked) : "");
  }

  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (groupSelect) groupSelect.addEventListener("change", applyFilters);
  if (availabilitySelect) availabilitySelect.addEventListener("change", applyFilters);

  function setTab(name, updateHash) {
    var active = name === "lockboxes" ? "lockboxes" : "consumables";
    tabs.forEach(function (tab) {
      var selected = tab.getAttribute("data-consumables-tab") === active;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
    });
    Object.keys(panels).forEach(function (key) {
      if (panels[key]) panels[key].hidden = key !== active;
      if (controls[key]) controls[key].hidden = key !== active;
    });
    document.title = active === "lockboxes" ? "Lockboxes — Neverwinter Compendium" : "Consumables — Neverwinter Compendium";
    if (updateHash) {
      var url = window.location.pathname + window.location.search + (active === "lockboxes" ? "#lockboxes" : "");
      window.history.replaceState(null, "", url);
    }
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      setTab(tab.getAttribute("data-consumables-tab"), true);
    });
    tab.addEventListener("keydown", function (event) {
      var next = index;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].focus();
      setTab(tabs[next].getAttribute("data-consumables-tab"), true);
    });
  });

  window.addEventListener("hashchange", function () {
    setTab(window.location.hash === "#lockboxes" ? "lockboxes" : "consumables", false);
  });
  setTab(window.location.hash === "#lockboxes" ? "lockboxes" : "consumables", false);

  var catalogUrl = "data/lockboxes.json";
  if (catalogVersion) catalogUrl += "?v=" + encodeURIComponent(catalogVersion);
  fetch(catalogUrl)
    .then(function (response) {
      if (!response.ok) throw new Error("Lockbox catalog could not be loaded.");
      return response.json();
    })
    .then(function (catalog) {
      window.lockboxCatalogLastChecked = catalog.last_checked || "";
      var groups = [
        ["keyed_lockboxes", catalog.keyed_lockboxes],
        ["related_containers", catalog.related_containers],
        ["historical_variants", catalog.variants]
      ];
      groups.forEach(function (group) {
        (Array.isArray(group[1]) ? group[1] : []).forEach(function (item) {
          var entry = Object.assign({}, item, { catalog_group: group[0] });
          entry.search_text = JSON.stringify(entry).toLowerCase();
          entries.push(entry);
        });
      });
      applyFilters();
    })
    .catch(function () {
      countEl.textContent = "The lockbox catalog could not be loaded. Please refresh the page.";
      cardsEl.innerHTML = "";
    });
})();