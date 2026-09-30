/* ============================================================
   NWC — Crafting Codex (recipes.html)

   Standalone for now: not in the navbar, not wired into build-data.py.

   What it does
   ------------
   1. BROWSE   pick a crafted item, get the full material tree down to raw
               mats, with a shopping list and morale/time totals.
   2. ADD      type a recipe in. Live tree preview while you type.
   3. WANTED   the gap list, split by what is actually known: materials
               confirmed craftable whose recipe is missing (real work),
               materials nobody has classified yet (one-click triage), and
               materials confirmed gathered (nothing to do). A gathered
               material is NOT a missing recipe and must never be listed
               as one.
   4. REVIEW   n00b only, password gated. Approve / reject / export.

   Where the data comes from
   -------------------------
   data/recipes.js is the committed base. On top of that the page pulls APPROVED community
   submissions live from Supabase, so an approved recipe is usable the
   moment it is approved instead of waiting for a commit.

   Nothing pending is ever shown to the public.

   LOCAL MODE. If the submission backend is not deployed (or Supabase is
   unreachable) the page detects that on load and switches the Add tab to
   a local workflow: recipes are kept in this browser, join the tree
   immediately, and export as a recipes.js file to commit. No failing
   submit button, no server involved. Deploying
   docs/supabase/recipe_submissions.sql turns submissions back on by
   itself — nothing here needs changing.
   ============================================================ */

(function () {
  "use strict";

  // ---- Supabase (same project as the reports page) ----
  var SUPABASE_URL  = "https://ynrfmmccarrpqjdrpvqn.supabase.co";
  var SUPABASE_ANON = "sb_publishable_RSK4LJnJ4-HQDudcRq3gRw_WJI5WIUw";
  var sb = (window.supabase && window.supabase.createClient)
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON)
    : null;

  /* Bumped by hand whenever this file changes. It is shown on the page and
     logged to the console, so "I still see the old behaviour" can be
     answered by looking instead of guessing. The <script> tags carry the
     same token as a query string, so a plain reload picks up new code. */
  var BUILD = "20260929a";

  var NL = String.fromCharCode(10);   // newline, for the exported file header

  var PROFESSIONS = [
    "Adventuring", "Alchemy", "Armorsmithing", "Artificing",
    "Blacksmithing", "Jewelcrafting", "Leatherworking", "Tailoring"
  ];
  var TIERS = ["Normal", "MW I", "MW II", "MW III", "MW IV", "MW V"];

  // A recipe tree that somehow referred to itself would recurse forever.
  // This is the hard stop; real Neverwinter chains are nowhere near it.
  var MAX_DEPTH = 12;

  // ---- State ----
  var state = {
    base:      (typeof RECIPES_DATA !== "undefined" ? RECIPES_DATA.slice() : []),
    community: [],          // approved submissions pulled from Supabase
    examples:  false,       // showing the clearly-fake demo set?
    drafts:    [],          // typed here, kept in this browser only
    materials: [],          // committed crafted/gathered classifications
    matDrafts: [],          // classifications made on this browser
    localMode: false,       // true when the submission backend is not deployed
    editingId: null,        // recipe id being edited, null when adding a new one
    target:    null,        // recipe id being expanded on Browse
    qty:       1,
    collapsed: {},          // tree node path -> true
    adminPass: "",
    reviewRows: []
  };

  // ---- DOM ----
  var $ = function (id) { return document.getElementById(id); };

  // ============================================================
  // Data
  // ============================================================

  // Everything the page currently knows about, in priority order:
  // committed base first, then approved community rows, then (only if the
  // user asked for it) the placeholder examples.
  function allRecipes() {
    // A draft carrying _overrides is an edit of a committed recipe, so the
    // original has to drop out - otherwise buildIndex (first wins, base
    // first) would keep serving the stale copy.
    var overridden = {};
    state.drafts.forEach(function (d) { if (d._overrides) overridden[d._overrides] = true; });
    var base = state.base.filter(function (r) { return !overridden[r.id]; });

    var out = base.concat(state.community).concat(state.drafts);
    if (state.examples && typeof EXAMPLE_RECIPES !== "undefined") {
      out = out.concat(EXAMPLE_RECIPES);
    }
    return out;
  }

  /* ---- Drafts: recipes typed on this browser, not sent anywhere -------

     This is the whole workflow while the submission backend is switched
     off. Drafts behave exactly like committed recipes — they show in the
     tree, they satisfy the Wanted list, chains build on them — they just
     live in localStorage until they are exported and committed.

     localStorage is NOT safe long-term storage. Safari in particular
     evicts it without warning, which has already cost this project a set
     of saved builds once. Hence the standing nag to export, and hence
     never treating a draft as filed. */
  var DRAFT_KEY = "nwc_recipe_drafts";

  function loadDrafts() {
    try {
      var raw = localStorage.getItem(DRAFT_KEY);
      state.drafts = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(state.drafts)) state.drafts = [];
    } catch (e) { state.drafts = []; }
    state.drafts.forEach(function (d) { d._draft = true; });
  }

  function persistDrafts() {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(state.drafts));
      return true;
    } catch (e) {
      return false;   // quota, private mode, blocked storage
    }
  }

  function draftsAsFile() {
    var corrections = [];
    var clean = state.drafts.map(function (d) {
      var c = Object.assign({}, d);
      delete c._draft;
      if (c._overrides) { corrections.push(c._overrides); delete c._overrides; }
      return c;
    });
    var header = corrections.length
      ? "// CORRECTIONS - these REPLACE the committed recipes with these ids:" + NL +
        "//   " + corrections.join(", ") + NL + NL
      : "";
    var out = header + "const RECIPES_DATA = " + JSON.stringify(clean, null, 2) + ";\n";
    if (state.matDrafts.length) {
      out += "\nconst MATERIALS_DATA = " + JSON.stringify(state.matDrafts, null, 2) + ";\n";
    }
    return out;
  }

  /* ---- Is a material crafted or gathered? -----------------------------

     The tree already knows a material is craftable when it holds that
     material's recipe. The thing it CANNOT infer is the difference between
     a material whose recipe simply has not been typed yet and one that is
     gathered or bought and has no recipe at all. Both look like "no recipe
     found", which made the Wanted tab demand recipes for raw mats.

     So materials get classified once, by hand, and remembered. */
  var MAT_KEY = "nwc_material_kinds";

  function loadMaterials() {
    state.materials = (typeof MATERIALS_DATA !== "undefined" ? MATERIALS_DATA.slice() : []);
    try {
      var raw = localStorage.getItem(MAT_KEY);
      state.matDrafts = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(state.matDrafts)) state.matDrafts = [];
    } catch (e) { state.matDrafts = []; }
  }

  function persistMaterials() {
    try { localStorage.setItem(MAT_KEY, JSON.stringify(state.matDrafts)); return true; }
    catch (e) { return false; }
  }

  // Locally classified entries win, so a correction made on this browser
  // takes effect straight away rather than waiting to be committed.
  function materialEntry(name) {
    var key = String(name || "").trim().toLowerCase();
    for (var i = 0; i < state.matDrafts.length; i++) {
      if (String(state.matDrafts[i].name).trim().toLowerCase() === key) return state.matDrafts[i];
    }
    for (var j = 0; j < state.materials.length; j++) {
      if (String(state.materials[j].name).trim().toLowerCase() === key) return state.materials[j];
    }
    return null;
  }

  /* What should the page say about this material?
       "known"       - the Codex holds its recipe, so the tree expands it
       "gathered"    - raw: gather or buy it, there is no recipe to find
       "crafted"     - craftable, but the recipe is not in the Codex yet
       "unclassified"- nobody has said which, so the page asks             */
  function materialKind(name, index) {
    if (index && index[String(name || "").trim().toLowerCase()]) return "known";
    var e = materialEntry(name);
    if (!e) return "unclassified";
    return e.kind === "gathered" ? "gathered" : "crafted";
  }

  function classifyMaterial(name, kind, source) {
    var key = String(name || "").trim().toLowerCase();
    var existing = null;
    for (var i = 0; i < state.matDrafts.length; i++) {
      if (String(state.matDrafts[i].name).trim().toLowerCase() === key) existing = state.matDrafts[i];
    }
    if (existing) {
      existing.kind = kind;
      if (source) existing.source = source;
    } else {
      var rec = { name: String(name).trim(), kind: kind };
      if (source) rec.source = source;
      state.matDrafts.push(rec);
    }
    persistMaterials();
  }

  // name (lowercased) -> recipe. First one wins; later duplicates are
  // reported on the Wanted tab rather than silently shadowing.
  function buildIndex(list) {
    var idx = {}, dupes = [];
    for (var i = 0; i < list.length; i++) {
      var key = String(list[i].name || "").trim().toLowerCase();
      if (!key) continue;
      if (idx[key]) { dupes.push(list[i].name); continue; }
      idx[key] = list[i];
    }
    return { map: idx, dupes: dupes };
  }

  // ============================================================
  // The material tree
  // ============================================================

  /* Expand `qty` of `name` into a tree of everything it consumes.
     Each node reports how many CRAFTS are needed, not just units, because
     a recipe that yields 2 per craft only needs 3 crafts for 5 units. */
  function expand(name, qty, index, trail, depth) {
    var key = String(name || "").trim().toLowerCase();
    var recipe = index[key];

    var node = {
      name:     name,
      qty:      qty,
      recipe:   recipe || null,
      crafts:   0,
      children: [],
      cyclic:   false,
      tooDeep:  false
    };

    if (!recipe) return node;                  // raw material — buy or gather

    if (trail.indexOf(key) !== -1) {           // A needs B needs A
      node.cyclic = true;
      return node;
    }
    if (depth >= MAX_DEPTH) {
      node.tooDeep = true;
      return node;
    }

    var perCraft = Number(recipe.yield) > 0 ? Number(recipe.yield) : 1;
    node.crafts = Math.ceil(qty / perCraft);

    var mats = recipe.materials || [];
    var nextTrail = trail.concat([key]);
    for (var i = 0; i < mats.length; i++) {
      var need = (Number(mats[i].qty) || 0) * node.crafts;
      node.children.push(expand(mats[i].item, need, index, nextTrail, depth + 1));
    }
    return node;
  }

  /* Walk a tree and add up what actually matters to a crafter: the raw
     materials to go and get, and the morale and time it all costs.
     `unknown` counts crafting steps whose morale or duration nobody has
     typed in yet, so the totals can say honestly that they are incomplete. */
  /* ---- Rolled-up totals across the WHOLE tree -------------------------

     The tree shows each material where it is used. That is not the number
     you shop with: a material can appear in several branches, and what you
     need is the sum.

     It also changes the craft count, which is why this is a separate pass
     rather than adding up the tree's nodes. Take a material that yields 3
     per craft, needed twice in the tree, 1 each time. Per branch that is
     ceil(1/3) + ceil(1/3) = two crafts. Batched it is ceil(2/3) = ONE
     craft. Adding up the tree would overstate the work, the morale and the
     time, so the totals below are computed by batching each material once.

     Parents must be resolved before their materials (you cannot know how
     much ore you need until you know how many ingots), so this walks the
     craft graph in dependency order rather than recursing. */
  function aggregate(rootName, rootQty, index) {
    var need = {};      // material name -> total units required
    var usedIn = {};    // material name -> which recipes call for it
    var order = [];     // craftable materials, parents first
    var seen = {};
    var cyclic = [];

    var key = function (n) { return String(n || "").trim().toLowerCase(); };

    // Depth-first pass to find every craftable material in the tree and the
    // order to resolve them in. `trail` catches a recipe loop.
    (function visit(name, trail, depth) {
      var k = key(name);
      var recipe = index[k];
      if (!recipe) return;                       // raw: nothing under it
      if (trail.indexOf(k) !== -1) { cyclic.push(name); return; }
      if (depth >= MAX_DEPTH) return;

      // Already placed? Move it later in the order so it still sits after
      // every recipe that consumes it.
      if (seen[k]) {
        var at = order.indexOf(k);
        if (at !== -1) order.splice(at, 1);
      }
      seen[k] = true;
      order.push(k);

      var mats = recipe.materials || [];
      var next = trail.concat([k]);
      for (var i = 0; i < mats.length; i++) visit(mats[i].item, next, depth + 1);
    })(rootName, [], 0);

    need[key(rootName)] = rootQty;

    var totals = {
      crafts: 0, morale: 0, minutes: 0,
      unknownMorale: 0, unknownTime: 0,
      cyclic: cyclic, rows: []
    };
    var craftsFor = {};

    // Resolve in dependency order, batching each material into one run.
    for (var o = 0; o < order.length; o++) {
      var k2 = order[o];
      var recipe = index[k2];
      var required = need[k2] || 0;
      if (!recipe || required <= 0) continue;

      var per = Number(recipe.yield) > 0 ? Number(recipe.yield) : 1;
      var crafts = Math.ceil(required / per);
      craftsFor[k2] = crafts;

      totals.crafts += crafts;
      if (Number(recipe.morale) > 0) totals.morale += Number(recipe.morale) * crafts;
      else totals.unknownMorale += crafts;
      if (Number(recipe.minutes) > 0) totals.minutes += Number(recipe.minutes) * crafts;
      else totals.unknownTime += crafts;

      var mats2 = recipe.materials || [];
      for (var m = 0; m < mats2.length; m++) {
        var mk = key(mats2[m].item);
        need[mk] = (need[mk] || 0) + (Number(mats2[m].qty) || 0) * crafts;
        if (!usedIn[mk]) usedIn[mk] = [];
        if (usedIn[mk].indexOf(recipe.name) === -1) usedIn[mk].push(recipe.name);
      }
    }

    // One row per material, the root excluded (it is the thing being made).
    var rootKey = key(rootName);
    Object.keys(need).forEach(function (k3) {
      if (k3 === rootKey) return;
      var recipe = index[k3];
      totals.rows.push({
        name:    recipe ? recipe.name : displayName(k3, index, rootName),
        qty:     need[k3],
        crafted: !!recipe,
        crafts:  craftsFor[k3] || 0,
        yield:   recipe ? (Number(recipe.yield) > 0 ? Number(recipe.yield) : 1) : 0,
        profession: recipe ? recipe.profession : "",
        usedIn:  usedIn[k3] || []
      });
    });

    totals.rows.sort(function (a, b) {
      if (a.crafted !== b.crafted) return a.crafted ? -1 : 1;   // crafted first
      return String(a.name).localeCompare(String(b.name));
    });

    return totals;
  }

  /* need{} is keyed lowercase so quantities merge regardless of how a name
     was typed; this recovers the spelling actually used in the data. */
  function displayName(lowerKey, index, rootName) {
    var list = allRecipes();
    for (var i = 0; i < list.length; i++) {
      var mats = list[i].materials || [];
      for (var m = 0; m < mats.length; m++) {
        if (String(mats[m].item).trim().toLowerCase() === lowerKey) return mats[m].item;
      }
    }
    return lowerKey;
  }

  function fmtMinutes(mins) {
    if (!mins) return "0m";
    var d = Math.floor(mins / 1440);
    var h = Math.floor((mins % 1440) / 60);
    var m = Math.round(mins % 60);
    var parts = [];
    if (d) parts.push(d + "d");
    if (h) parts.push(h + "h");
    if (m || !parts.length) parts.push(m + "m");
    return parts.join(" ");
  }

  // ============================================================
  // BROWSE
  // ============================================================

  function renderBrowseControls() {
    var list = allRecipes().slice().sort(function (a, b) {
      return String(a.name).localeCompare(String(b.name));
    });
    var sel = $("browse-target");
    var current = state.target;
    var html = '<option value="">Pick an item to craft…</option>';
    for (var i = 0; i < list.length; i++) {
      html += '<option value="' + escapeHtml(list[i].id) + '">' +
              escapeHtml(list[i].name) + " — " + escapeHtml(list[i].profession) +
              (list[i].tier && list[i].tier !== "Normal" ? " (" + escapeHtml(list[i].tier) + ")" : "") +
              "</option>";
    }
    sel.innerHTML = html;
    if (current) sel.value = current;
  }

  function renderBrowse() {
    var box = $("browse-content");
    var list = allRecipes();

    if (!list.length) {
      box.innerHTML =
        '<div class="empty-state">' +
          "<h3>No recipes yet</h3>" +
          "<p>The Codex is empty because nobody has typed a recipe into it yet — " +
          "and this site does not publish guessed numbers.</p>" +
          '<p>Open the <strong>Add a Recipe</strong> tab and put in one you can see ' +
          "in your own workshop. One recipe is a real contribution; the tree gets " +
          "more useful with every single one.</p>" +
          '<p><button class="rc-btn" id="load-examples">Show me an example tree</button> ' +
          '<span class="rc-muted">(placeholder data, clearly labelled, not real recipes)</span></p>' +
        "</div>";
      var btn = $("load-examples");
      if (btn) btn.addEventListener("click", function () {
        state.examples = true;
        state.target = "example-blade";
        renderBrowseControls();
        renderBrowse();
      });
      return;
    }

    var index = buildIndex(list).map;
    var target = null;
    for (var i = 0; i < list.length; i++) if (list[i].id === state.target) target = list[i];

    if (!target) {
      box.innerHTML =
        '<div class="empty-state"><h3>Pick an item</h3>' +
        "<p>Choose something from the dropdown above and the Codex will break it " +
        "down into every material underneath it, all the way to the raw mats you " +
        "have to gather or buy.</p></div>";
      return;
    }

    var wanted = Math.max(1, Number(state.qty) || 1);
    var tree = expand(target.name, wanted, index, [], 0);
    // The authoritative planning numbers: every material rolled up across
    // the whole tree, with each one batched into a single run.
    var agg  = aggregate(target.name, wanted, index);

    var html = "";

    if (state.examples) {
      html += '<div class="rc-warn">You are looking at <strong>placeholder example data</strong>, ' +
              "not real Neverwinter recipes. It is here to show how the tree works.</div>";
    }

    // ---- Totals ----
    html += '<div class="rc-totals">';
    html += totalCard("Crafting steps", formatNumber(agg.crafts), "crafts, batching each material");
    html += totalCard("Morale",
              agg.unknownMorale && !agg.morale ? "?" : formatNumber(agg.morale) + (agg.unknownMorale ? "+" : ""),
              agg.unknownMorale ? agg.unknownMorale + " craft(s) missing a morale cost" : "total morale spent");
    html += totalCard("Crafting time",
              agg.unknownTime && !agg.minutes ? "?" : fmtMinutes(agg.minutes) + (agg.unknownTime ? "+" : ""),
              agg.unknownTime ? agg.unknownTime + " craft(s) missing a duration" : "if run one after another");
    html += totalCard("Raw materials", formatNumber(agg.rows.filter(function (r) { return !r.crafted; }).length),
              "different things to gather or buy");
    html += "</div>";

    if (agg.unknownMorale || agg.unknownTime) {
      html += '<div class="rc-note">Some steps in this tree have no morale cost or duration typed in yet, ' +
              "so the totals above are a floor, not the final number. The " +
              '<strong>Wanted</strong> tab lists what is missing.</div>';
    }

    // ---- Shopping list ----
    // Split three ways. Lumping these together was the old behaviour and it
    // made a gathered mat and a missing recipe look like the same thing.
    var rawQty = {};
    agg.rows.forEach(function (r) { if (!r.crafted) rawQty[r.name] = r.qty; });
    var rawNames = Object.keys(rawQty).sort();
    var gathered = [], craftable = [], unclassified = [];
    rawNames.forEach(function (n) {
      var k = materialKind(n, null);
      if (k === "gathered") gathered.push(n);
      else if (k === "crafted") craftable.push(n);
      else unclassified.push(n);
    });

    var shopRow = function (n, extra) {
      return '<div class="rc-shop-row"><span class="rc-shop-qty">' +
             formatNumber(rawQty[n]) + "&times;</span> " +
             '<span class="rc-shop-name">' + escapeHtml(n) + "</span>" + (extra || "") + "</div>";
    };

    html += '<div class="rc-section">Gather or buy (' + gathered.length + ")</div>";
    if (!gathered.length) {
      html += '<p class="rc-muted">Nothing confirmed as a gathered material yet in this tree.</p>';
    } else {
      html += '<div class="rc-shop">';
      gathered.forEach(function (n) {
        var e = materialEntry(n);
        html += shopRow(n, e && e.source ? ' <span class="rc-muted">' + escapeHtml(e.source) + "</span>" : "");
      });
      html += "</div>";
    }

    if (craftable.length) {
      html += '<div class="rc-section">Craftable — recipe still missing (' + craftable.length + ")</div>";
      html += '<div class="rc-note">These are made, not gathered, so the tree below stops short. ' +
              "Add their recipes and the totals will go deeper.</div>";
      html += '<div class="rc-shop">';
      craftable.forEach(function (n) {
        html += shopRow(n, ' <a href="#" class="rc-addlink" data-add="' + escapeHtml(n) + '">+ add its recipe</a>');
      });
      html += "</div>";
    }

    if (unclassified.length) {
      html += '<div class="rc-section">Not classified yet (' + unclassified.length + ")</div>";
      html += '<div class="rc-note">Is each of these something you gather or buy, or something you craft? ' +
              "One click each and the Codex stops asking.</div>";
      html += '<div class="rc-shop">';
      unclassified.forEach(function (n) {
        html += shopRow(n,
          ' <a href="#" class="rc-addlink" data-kind="gathered" data-matname="' + escapeHtml(n) + '">gathered</a>' +
          ' <a href="#" class="rc-addlink" data-kind="crafted" data-matname="' + escapeHtml(n) + '">craftable</a>');
      });
      html += "</div>";
    }

    // ---- The tree ----
    html += '<div class="rc-section">Material tree &amp; total materials needed</div>';
    html += '<div class="rc-split">';
    html += '<div class="rc-split-col"><div class="rc-split-head">Where each material is used</div>' +
            '<div class="rc-tree">' + renderNode(tree, "0", 0) + "</div></div>";
    html += '<div class="rc-split-col"><div class="rc-split-head">Total needed for ' +
            formatNumber(wanted) + " &times; " + escapeHtml(target.name) + "</div>" +
            renderTotalsTable(agg) + "</div>";
    html += "</div>";

    // ---- What we know about the item itself ----
    html += '<div class="rc-section">Recipe details</div>' + renderRecipeFacts(target);
    html += '<div style="margin-top:0.7rem;"><button class="rc-btn" data-edit="' +
            escapeHtml(target.id) + '">Edit this recipe</button> ' +
            '<span class="rc-muted">Fill in what is missing, or fix a value.</span></div>';

    box.innerHTML = html;
  }

  /* The rolled-up list. Crafted materials first (they are the work), then
     the things you go and fetch. "Used in" is the answer to "why do I need
     so many of these" when a material turns up in several recipes. */
  function renderTotalsTable(agg) {
    if (!agg.rows.length) {
      return '<p class="rc-muted">This recipe has no materials listed yet.</p>';
    }

    var html = '<table class="rc-totals-table"><thead><tr>' +
               "<th>Need</th><th>Material</th><th>What it is</th><th>Used in</th>" +
               "</tr></thead><tbody>";

    for (var i = 0; i < agg.rows.length; i++) {
      var r = agg.rows[i];
      var what;

      if (r.crafted) {
        what = '<span class="rc-tag rc-tag-mw">craft ' + r.crafts + "&times;</span>" +
               (r.yield > 1 ? ' <span class="rc-sub">' + r.yield + " per craft</span>" : "") +
               (r.profession ? ' <span class="rc-tag">' + escapeHtml(r.profession) + "</span>" : "");
      } else {
        var kind = materialKind(r.name, null);
        if (kind === "gathered")      what = '<span class="rc-tag rc-tag-raw">gather / buy</span>';
        else if (kind === "crafted")  what = '<span class="rc-tag rc-tag-mw">craftable — recipe missing</span>';
        else                          what = '<span class="rc-tag">not classified</span>';
      }

      // Only worth showing when it is used in more than one place, which is
      // exactly the case the per-node tree numbers cannot answer.
      var used = r.usedIn.length > 1
        ? '<span class="rc-multi">' + escapeHtml(r.usedIn.join(", ")) + "</span>"
        : '<span class="rc-muted">' + escapeHtml(r.usedIn[0] || "") + "</span>";

      html += "<tr" + (r.usedIn.length > 1 ? ' class="rc-row-multi"' : "") + ">" +
              '<td class="rc-total-qty">' + formatNumber(r.qty) + "&times;</td>" +
              "<td><strong>" + escapeHtml(r.name) + "</strong></td>" +
              "<td>" + what + "</td>" +
              "<td>" + used + "</td></tr>";
    }
    html += "</tbody></table>";

    var multi = agg.rows.filter(function (r) { return r.usedIn.length > 1; });
    if (multi.length) {
      html += '<div class="rc-note">' + multi.length + " material" + (multi.length === 1 ? " is" : "s are") +
              " needed by more than one recipe in this tree (highlighted). The quantity above is the " +
              "combined total, and the craft counts assume you make each material in one batch rather " +
              "than once per recipe that wants it.</div>";
    }

    if (agg.cyclic.length) {
      html += '<div class="rc-note">Skipped, because they loop back on themselves: ' +
              escapeHtml(agg.cyclic.join(", ")) + "</div>";
    }
    return html;
  }

  function totalCard(label, value, sub) {
    return '<div class="rc-total"><div class="rc-total-label">' + escapeHtml(label) + "</div>" +
           '<div class="rc-total-value">' + value + "</div>" +
           '<div class="rc-total-sub">' + escapeHtml(sub) + "</div></div>";
  }

  function renderNode(node, path, depth) {
    var isCraft = !!node.recipe;
    var collapsed = !!state.collapsed[path];
    var cls = "rc-node" + (isCraft ? " is-craft" : " is-raw");

    var html = '<div class="' + cls + '" style="margin-left:' + (depth * 18) + 'px">';

    if (isCraft && node.children.length) {
      html += '<button class="rc-toggle" data-path="' + path + '">' +
              (collapsed ? "+" : "−") + "</button>";
    } else {
      html += '<span class="rc-toggle-spacer"></span>';
    }

    html += '<span class="rc-qty">' + formatNumber(node.qty) + "&times;</span> ";
    html += '<span class="rc-name">' + escapeHtml(node.name) + "</span>";

    if (node.cyclic) {
      html += ' <span class="rc-tag rc-tag-bad">loops back on itself</span>';
    } else if (node.tooDeep) {
      html += ' <span class="rc-tag rc-tag-bad">tree too deep to expand</span>';
    } else if (isCraft) {
      var per = Number(node.recipe.yield) > 0 ? Number(node.recipe.yield) : 1;
      html += ' <span class="rc-tag">' + escapeHtml(node.recipe.profession) + "</span>";
      if (node.recipe.tier && node.recipe.tier !== "Normal") {
        html += ' <span class="rc-tag rc-tag-mw">' + escapeHtml(node.recipe.tier) + "</span>";
      }
      html += ' <span class="rc-sub">' + node.crafts + " craft" + (node.crafts === 1 ? "" : "s") +
              (per > 1 ? " &times; " + per + " each" : "") + "</span>";
    } else {
      html += renderLeafTags(node.name);
    }

    html += "</div>";

    if (isCraft && !collapsed) {
      for (var i = 0; i < node.children.length; i++) {
        html += renderNode(node.children[i], path + "." + i, depth + 1);
      }
    }
    return html;
  }

  /* The tags on a material that has no recipe in the Codex. Three very
     different situations that used to look identical. */
  function renderLeafTags(name) {
    var kind = materialKind(name, null);
    var esc = escapeHtml(name);

    if (kind === "gathered") {
      var e = materialEntry(name);
      return ' <span class="rc-tag rc-tag-raw">gather / buy</span>' +
             (e && e.source ? ' <span class="rc-sub">' + escapeHtml(e.source) + "</span>" : "") +
             ' <a href="#" class="rc-addlink" data-kind="crafted" data-matname="' + esc +
             '" title="Wrong? Mark it craftable instead">craftable?</a>';
    }

    if (kind === "crafted") {
      return ' <span class="rc-tag rc-tag-mw">craftable — recipe not typed yet</span>' +
             ' <a href="#" class="rc-addlink" data-add="' + esc + '">+ add its recipe</a>';
    }

    // Unclassified: ask, in one click, rather than assuming.
    return ' <span class="rc-tag">not classified</span>' +
           ' <a href="#" class="rc-addlink" data-kind="gathered" data-matname="' + esc + '">gathered</a>' +
           ' <a href="#" class="rc-addlink" data-kind="crafted" data-matname="' + esc + '">craftable</a>';
  }

  function renderRecipeFacts(r) {
    var rows = [
      ["Profession", r.profession],
      ["Tier", r.tier],
      ["Level required", r.level],
      ["Yield per craft", r.yield],
      ["Morale per craft", r.morale],
      ["Time per craft", Number(r.minutes) > 0 ? fmtMinutes(Number(r.minutes)) : ""],
      ["Commission", r.commission],
      ["Tool", r.tool],
      ["Proficiency needed", r.proficiency],
      ["Focus needed", r.focus],
      ["How it is unlocked", r.unlock],
      ["Seen in", r.source],
      ["Submitted by", r.submitter],
      ["Notes", r.notes]
    ];
    var html = '<table class="rc-facts">';
    var missing = [];
    for (var i = 0; i < rows.length; i++) {
      var v = rows[i][1];
      if (v === undefined || v === null || v === "" ) {
        if (i < 12) missing.push(rows[i][0]);
        continue;
      }
      html += "<tr><th>" + escapeHtml(rows[i][0]) + "</th><td>" + escapeHtml(String(v)) + "</td></tr>";
    }
    html += "</table>";
    if (missing.length) {
      html += '<div class="rc-note">Not filled in yet: ' + escapeHtml(missing.join(", ")) +
              ". If you can see these in your workshop, the Add tab takes corrections too.</div>";
    }
    return html;
  }

  // ============================================================
  // WANTED — the gap list that drives contributions
  // ============================================================

  function renderWanted() {
    var list = allRecipes();
    var built = buildIndex(list);
    var index = built.map;

    // Materials that are referenced by a recipe but have no recipe of
    // their own. Some are genuinely raw; the point is that a human can
    // look down this list and spot the ones that are not.
    var refs = {};
    for (var i = 0; i < list.length; i++) {
      var mats = list[i].materials || [];
      for (var m = 0; m < mats.length; m++) {
        var nm = String(mats[m].item || "").trim();
        if (!nm) continue;
        if (index[nm.toLowerCase()]) continue;
        if (!refs[nm]) refs[nm] = [];
        refs[nm].push(list[i].name);
      }
    }

    // Recipes that exist but are missing the numbers a planner needs.
    var incomplete = [];
    for (var j = 0; j < list.length; j++) {
      var r = list[j], gaps = [];
      if (!(Number(r.morale)  > 0)) gaps.push("morale");
      if (!(Number(r.minutes) > 0)) gaps.push("craft time");
      if (!(Number(r.yield)   > 0)) gaps.push("yield");
      if (!r.tool)                  gaps.push("tool");
      if (gaps.length) incomplete.push({ id: r.id, name: r.name, gaps: gaps });
    }

    // Split by what we actually know about each one. A gathered material
    // is not a gap — asking for its recipe forever would be noise.
    var names = Object.keys(refs).sort();
    var needRecipe = [], needAnswer = [], knownRaw = [];
    names.forEach(function (n) {
      var k = materialKind(n, index);
      if (k === "crafted") needRecipe.push(n);
      else if (k === "gathered") knownRaw.push(n);
      else needAnswer.push(n);
    });

    var neededBy = function (n) {
      return '<span class="rc-muted">needed by ' + escapeHtml(refs[n].slice(0, 3).join(", ")) +
             (refs[n].length > 3 ? " +" + (refs[n].length - 3) + " more" : "") + "</span>";
    };

    var html = "";
    html += '<div class="rc-note">This is the to-do list. Everything here is something ' +
            "the Codex cannot work out on its own — it needs someone with the game open.</div>";

    // The real work queue: known to be craftable, recipe not typed yet.
    html += '<div class="rc-section">Recipes still needed (' + needRecipe.length + ")</div>";
    if (!needRecipe.length) {
      html += '<p class="rc-muted">Nothing outstanding that anyone has confirmed is craftable.</p>';
    } else {
      html += '<div class="rc-shop">';
      needRecipe.forEach(function (n) {
        html += '<div class="rc-shop-row"><span class="rc-shop-name">' + escapeHtml(n) + "</span> " +
                neededBy(n) + ' <a href="#" class="rc-addlink" data-add="' + escapeHtml(n) +
                '">+ add its recipe</a></div>';
      });
      html += "</div>";
    }

    // Triage queue: one click each turns these into either of the others.
    html += '<div class="rc-section">Crafted or gathered? (' + needAnswer.length + ")</div>";
    if (!needAnswer.length) {
      html += '<p class="rc-muted">Every material in the Codex has been classified.</p>';
    } else {
      html += '<div class="rc-note">Some of these are made at a workshop and some are picked up ' +
              "or bought. Until someone says which, the Codex has to keep asking about both.</div>";
      html += '<div class="rc-shop">';
      needAnswer.forEach(function (n) {
        html += '<div class="rc-shop-row"><span class="rc-shop-name">' + escapeHtml(n) + "</span> " +
                neededBy(n) +
                ' <a href="#" class="rc-addlink" data-kind="gathered" data-matname="' + escapeHtml(n) + '">gathered</a>' +
                ' <a href="#" class="rc-addlink" data-kind="crafted" data-matname="' + escapeHtml(n) + '">craftable</a>' +
                "</div>";
      });
      html += "</div>";
    }

    // Settled. Listed so a wrong call can be spotted and undone.
    if (knownRaw.length) {
      html += '<div class="rc-section">Confirmed gathered — nothing to do (' + knownRaw.length + ")</div>";
      html += '<div class="rc-shop">';
      knownRaw.forEach(function (n) {
        var e = materialEntry(n);
        html += '<div class="rc-shop-row"><span class="rc-shop-name">' + escapeHtml(n) + "</span> " +
                (e && e.source ? '<span class="rc-muted">' + escapeHtml(e.source) + "</span> " : "") +
                '<a href="#" class="rc-addlink" data-kind="crafted" data-matname="' + escapeHtml(n) +
                '">actually craftable</a></div>';
      });
      html += "</div>";
    }

    html += '<div class="rc-section">Recipes missing numbers (' + incomplete.length + ")</div>";
    if (!incomplete.length) {
      html += '<p class="rc-muted">Every recipe in the Codex is fully filled in.</p>';
    } else {
      html += '<div class="rc-shop">';
      for (var k = 0; k < incomplete.length; k++) {
        html += '<div class="rc-shop-row"><span class="rc-shop-name">' + escapeHtml(incomplete[k].name) + "</span> " +
                '<span class="rc-muted">missing ' + escapeHtml(incomplete[k].gaps.join(", ")) + "</span> " +
                '<a href="#" class="rc-addlink" data-edit="' + escapeHtml(incomplete[k].id) + '">fill it in</a></div>';
      }
      html += "</div>";
    }

    if (built.dupes.length) {
      html += '<div class="rc-section">Duplicate names (' + built.dupes.length + ")</div>";
      html += '<div class="rc-note">Two recipes share a name, so the tree can only use the first one: ' +
              escapeHtml(built.dupes.join(", ")) + "</div>";
    }

    $("wanted-content").innerHTML = html;
  }

  // ============================================================
  // ADD A RECIPE
  // ============================================================

  var matRowSeq = 0;

  function addMaterialRow(item, qty) {
    var id = "mat-" + (matRowSeq++);
    var div = document.createElement("div");
    div.className = "rc-mat-row";
    div.id = id;
    // The kind dropdown is here rather than on a separate screen because
    // this is the one moment the contributor is actually looking at the
    // material in game and knows the answer.
    div.innerHTML =
      '<input type="text" class="rc-input rc-mat-item" placeholder="Material name, spelled as in game" ' +
        'value="' + escapeHtml(item || "") + '" list="known-items">' +
      '<input type="number" class="rc-input rc-mat-qty" placeholder="Qty" min="1" step="1" ' +
        'value="' + (qty || "") + '">' +
      '<select class="rc-input rc-mat-kind" title="Do you gather or buy this, or craft it?">' +
        '<option value="">not sure</option>' +
        '<option value="gathered">gathered / bought</option>' +
        '<option value="crafted">crafted</option>' +
      "</select>" +
      '<button type="button" class="rc-btn rc-btn-ghost rc-mat-del" title="Remove this material">&times;</button>';
    $("mat-rows").appendChild(div);

    var itemEl = div.querySelector(".rc-mat-item");
    var kindEl = div.querySelector(".rc-mat-kind");

    // Preselect what is already known about this material, so an existing
    // classification is shown rather than silently re-asked.
    var syncKind = function () {
      var known = materialEntry(itemEl.value);
      if (known && !kindEl.value) kindEl.value = known.kind;
    };
    syncKind();

    div.querySelector(".rc-mat-del").addEventListener("click", function () {
      div.remove();
      previewForm();
    });
    itemEl.addEventListener("input", function () { syncKind(); previewForm(); });
    div.querySelector(".rc-mat-qty").addEventListener("input", previewForm);
    kindEl.addEventListener("change", previewForm);
  }

  function slugify(s) {
    return String(s || "").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);
  }

  // Read the form into a recipe object. Empty optional fields are dropped
  // rather than stored as empty strings, so a half-filled recipe stays
  // visibly half-filled instead of pretending to have data.
  function readForm() {
    var r = {
      id:         state.editingId || slugify($("f-name").value) || "recipe-" + Date.now(),
      name:       $("f-name").value.trim(),
      profession: $("f-profession").value,
      tier:       $("f-tier").value,
      yield:      Number($("f-yield").value) || 1,
      materials:  [],
      _kinds:     []
    };

    var rows = document.querySelectorAll("#mat-rows .rc-mat-row");
    for (var i = 0; i < rows.length; i++) {
      var item = rows[i].querySelector(".rc-mat-item").value.trim();
      var qty  = Number(rows[i].querySelector(".rc-mat-qty").value);
      var kindEl = rows[i].querySelector(".rc-mat-kind");
      if (!item) continue;
      r.materials.push({ item: item, qty: qty > 0 ? qty : 1 });
      // Not part of the recipe itself - collected alongside it and applied
      // to the material registry when the recipe is saved.
      if (kindEl && kindEl.value) r._kinds.push({ name: item, kind: kindEl.value });
    }

    var optNum = { level: "f-level", morale: "f-morale", minutes: "f-minutes",
                   proficiency: "f-proficiency", focus: "f-focus" };
    Object.keys(optNum).forEach(function (k) {
      var v = Number($(optNum[k]).value);
      if (v > 0) r[k] = v;
    });

    var optTxt = { commission: "f-commission", tool: "f-tool",
                   unlock: "f-unlock", source: "f-source", notes: "f-notes" };
    Object.keys(optTxt).forEach(function (k) {
      var v = $(optTxt[k]).value.trim();
      if (v) r[k] = v;
    });

    return r;
  }

  function validate(r) {
    var errs = [];
    if (!r.name) errs.push("The crafted item needs a name.");
    if (r.name && r.name.length > 120) errs.push("That item name is too long.");
    if (!r.profession) errs.push("Pick a profession.");
    if (!r.tier) errs.push("Pick a tier.");
    if (!r.materials.length) errs.push("Add at least one material.");
    if (r.materials.length > 20) errs.push("That is more materials than any recipe uses.");

    var seen = {};
    for (var i = 0; i < r.materials.length; i++) {
      var k = r.materials[i].item.toLowerCase();
      if (seen[k]) errs.push('"' + r.materials[i].item + '" is listed twice — combine it into one row.');
      seen[k] = true;
      if (k === r.name.toLowerCase()) {
        errs.push("A recipe cannot use itself as a material.");
      }
    }

    // The duplicate check must not fire on the recipe you are editing.
    var existing = buildIndex(allRecipes()).map[r.name.toLowerCase()];
    if (existing && existing.tier === r.tier && existing.id !== state.editingId) {
      errs.push("The Codex already has a recipe for " + r.name + " at " + r.tier + ".");
    }
    return errs;
  }

  function previewForm() {
    var r = readForm();
    var box = $("form-preview");
    if (!r.name || !r.materials.length) {
      box.innerHTML = '<p class="rc-muted">Fill in the item name and at least one material to see the tree.</p>';
      return;
    }
    var list = allRecipes().concat([r]);
    var index = buildIndex(list).map;
    var tree = expand(r.name, 1, index, [], 0);
    var agg  = aggregate(r.name, 1, index);
    var rawCount = agg.rows.filter(function (x) { return !x.crafted; }).length;
    box.innerHTML =
      '<div class="rc-tree">' + renderNode(tree, "p0", 0) + "</div>" +
      '<div class="rc-muted" style="margin-top:0.5rem;">' +
      agg.crafts + " crafting step(s), " + rawCount + " raw material(s)." +
      "</div>";
  }

  function refreshKnownItems() {
    var list = allRecipes();
    var names = {};
    for (var i = 0; i < list.length; i++) {
      names[list[i].name] = true;
      var mats = list[i].materials || [];
      for (var m = 0; m < mats.length; m++) names[mats[m].item] = true;
    }
    var html = "";
    Object.keys(names).sort().forEach(function (n) {
      html += '<option value="' + escapeHtml(n) + '"></option>';
    });
    $("known-items").innerHTML = html;
  }

  function fingerprint() {
    var raw = [navigator.userAgent, screen.width + "x" + screen.height,
               navigator.language, new Date().getTimezoneOffset()].join("|");
    var h = 5381;
    for (var i = 0; i < raw.length; i++) { h = ((h << 5) + h) + raw.charCodeAt(i); h = h & h; }
    return "r1_" + Math.abs(h).toString(36);
  }

  async function submitForm() {
    var msg = $("form-msg");
    var r = readForm();
    var errs = validate(r);

    if (errs.length) {
      msg.className = "rc-msg rc-msg-bad";
      msg.innerHTML = "<strong>Not sent:</strong><ul><li>" +
        errs.map(escapeHtml).join("</li><li>") + "</li></ul>";
      return;
    }

    var handle = $("f-submitter").value.trim();
    if (handle) { try { localStorage.setItem("nwc_recipe_handle", handle); } catch (e) {} }

    // Submissions switched off: keep it here instead of failing at a server
    // that was never deployed.
    if (state.localMode) { saveDraft(r, handle); return; }

    // The material classifications are ours to keep either way; the server
    // only ever sees the recipe itself.
    (r._kinds || []).forEach(function (k) { classifyMaterial(k.name, k.kind); });
    delete r._kinds;

    $("submit-recipe").disabled = true;
    msg.className = "rc-msg";
    msg.textContent = "Sending…";

    var failed = null;
    if (sb) {
      try {
        var res = await sb.rpc("submit_recipe", {
          p_payload: r, p_submitter: handle || null, p_fingerprint: fingerprint()
        });
        if (res.error) failed = res.error.message;
        else if (res.data && res.data.ok === false) failed = res.data.error;
      } catch (e) {
        failed = e && e.message ? e.message : "Could not reach the server.";
      }
    } else {
      failed = "The submission service did not load.";
    }

    $("submit-recipe").disabled = false;

    if (!failed) {
      msg.className = "rc-msg rc-msg-good";
      msg.innerHTML = "<strong>Thank you.</strong> " + escapeHtml(r.name) +
        " is in the queue. It appears in the Codex once it has been checked — " +
        "that is deliberate, so nothing unverified lands in other people's build plans.";
      clearForm();
      loadProgress();
      return;
    }

    // Backend unavailable (or the SQL has not been run yet): do not lose
    // the person's work. Hand them the JSON so it can still be sent in.
    msg.className = "rc-msg rc-msg-bad";
    msg.innerHTML =
      "<strong>That did not send:</strong> " + escapeHtml(failed) +
      "<p>Your typing is not lost. Copy the text below and send it to " +
      '<a href="mailto:n00binhard@gmail.com?subject=Neverwinter%20recipe">n00binhard@gmail.com</a> ' +
      "and it will be added by hand.</p>" +
      '<textarea class="rc-input" rows="8" id="fallback-json"></textarea>' +
      '<button class="rc-btn" id="copy-json">Copy it</button>';
    var ta = $("fallback-json");
    ta.value = JSON.stringify(r, null, 2);

    // Clicking anywhere in the box selects the lot, so a manual Ctrl+C
    // always works even if the clipboard is blocked outright.
    ta.addEventListener("focus", function () { this.select(); });

    $("copy-json").addEventListener("click", function () { copyToClipboard(ta, this); });
  }

  /* Copy a textarea's contents, and SAY SO HONESTLY if it did not work.
     The old version called document.execCommand("copy") and announced
     "Copied" without checking the return value, so a blocked copy looked
     exactly like a successful one and the clipboard stayed empty. */
  async function copyToClipboard(textarea, btn) {
    var original = textarea.value;

    // Preferred path. Needs a secure context (https, or localhost).
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(original);
        btn.textContent = "Copied";
        return true;
      }
    } catch (e) { /* fall through to the old way */ }

    // Fallback for older or non-secure contexts. execCommand returns false
    // rather than throwing when it is refused, so check the result.
    try {
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, original.length);
      if (document.execCommand("copy")) {
        btn.textContent = "Copied";
        return true;
      }
    } catch (e) { /* fall through to telling the truth */ }

    // Both refused. The text is selected — say what to press.
    textarea.focus();
    textarea.select();
    btn.textContent = "Press Ctrl+C now";
    return false;
  }

  /* Keep a finished recipe on this browser. It joins the tree immediately,
     so the next recipe can be built on top of it without waiting for
     anything to be committed. */
  function saveDraft(r, handle) {
    var msg = $("form-msg");
    if (handle) r.submitter = handle;
    (r._kinds || []).forEach(function (k) { classifyMaterial(k.name, k.kind); });
    delete r._kinds;
    r._draft = true;

    var replaced = false;
    if (state.editingId) {
      // Editing something already in your local list: replace it in place.
      for (var i = 0; i < state.drafts.length; i++) {
        if (state.drafts[i].id === state.editingId) {
          r._overrides = state.drafts[i]._overrides;   // keep the correction link
          state.drafts[i] = r;
          replaced = true;
          break;
        }
      }
      // Editing a COMMITTED recipe: a browser cannot rewrite data/recipes.js,
      // so keep it as a correction that shadows the original and exports
      // marked as such.
      if (!replaced && state.base.some(function (b) { return b.id === state.editingId; })) {
        r._overrides = state.editingId;
        state.drafts.push(r);
        replaced = true;
      }
    }
    if (!replaced) state.drafts.push(r);

    if (!persistDrafts()) {
      if (!replaced) state.drafts.pop();
      msg.className = "rc-msg rc-msg-bad";
      msg.innerHTML = "<strong>This browser refused to store it.</strong> " +
        "Private browsing or blocked site data will do that. Use " +
        "<em>Copy all as JSON</em> below after each recipe instead of relying on the list.";
      return;
    }

    msg.className = "rc-msg rc-msg-good";
    msg.innerHTML = state.editingId
      ? "<strong>Updated.</strong> " + escapeHtml(r.name) +
        " now reads as you just typed it, everywhere on the page. " +
        "Export the file when you are done for the session."
      : "<strong>Saved.</strong> " + escapeHtml(r.name) +
        " is in your list below and is already usable in the tree. " +
        "Export the file when you are done for the session.";

    stopEditing();
    clearForm();
    renderDrafts();
    applyLocalMode();
    refreshKnownItems();
    renderBrowseControls();
  }

  function removeDraft(idx) {
    state.drafts.splice(idx, 1);
    persistDrafts();
    renderDrafts();
    applyLocalMode();
    refreshKnownItems();
    renderBrowseControls();
  }

  function renderDrafts() {
    var box = $("drafts-box");
    if (!box) return;

    if (!state.localMode) { box.innerHTML = ""; return; }

    var html = '<div class="rc-section">Your recipes (' + state.drafts.length + ")</div>";

    if (!state.drafts.length) {
      html += '<p class="rc-muted">Nothing typed yet. Recipes you add are kept in this ' +
              "browser and appear in the tree straight away.</p>";
      box.innerHTML = html;
      return;
    }

    html += '<div class="rc-warn"><strong>These live in this browser only.</strong> ' +
            "Clearing site data, or Safari deciding to tidy up, wipes them. " +
            "Export the file when you finish a batch.</div>";

    html += '<div class="rc-shop">';
    for (var i = 0; i < state.drafts.length; i++) {
      var d = state.drafts[i];
      html += '<div class="rc-shop-row"><span class="rc-shop-name">' + escapeHtml(d.name) + "</span> " +
              '<span class="rc-tag">' + escapeHtml(d.profession) + "</span> " +
              '<span class="rc-tag rc-tag-mw">' + escapeHtml(d.tier) + "</span> " +
              '<span class="rc-muted">' + (d.materials || []).length + " materials</span> " +
              '<a href="#" class="rc-addlink" data-edit="' + escapeHtml(d.id) + '">edit</a>' +
              '<a href="#" class="rc-addlink" data-draftdel="' + i + '">remove</a></div>';
    }
    html += "</div>";

    html += '<div style="margin-top:0.7rem;">' +
            '<button class="rc-btn" id="download-drafts">Download recipes.js</button> ' +
            '<button class="rc-btn rc-btn-ghost" id="copy-drafts">Copy all as JSON</button>' +
            "</div>" +
            '<textarea class="rc-input" id="drafts-json" rows="6" style="margin-top:0.5rem;display:none;"></textarea>';

    box.innerHTML = html;
  }

  function downloadDrafts() {
    var blob = new Blob([draftsAsFile()], { type: "text/javascript" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "recipes.js";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ---- Editing an existing recipe ------------------------------------

     Two cases, and the difference matters. Editing a DRAFT just replaces
     it. Editing a COMMITTED recipe cannot rewrite data/recipes.js from a
     browser, so it is stored as an override that shadows the original and
     is exported marked as a correction, ready to be merged. */
  function startEdit(id) {
    var list = allRecipes(), r = null;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) r = list[i];
    if (!r) return;

    switchTab("add");
    state.editingId = id;

    $("f-name").value        = r.name || "";
    $("f-profession").value  = r.profession || "";
    $("f-tier").value        = r.tier || "Normal";
    $("f-yield").value       = r.yield || 1;
    $("f-level").value       = r.level || "";
    $("f-morale").value      = r.morale || "";
    $("f-minutes").value     = r.minutes || "";
    $("f-commission").value  = r.commission || "";
    $("f-tool").value        = r.tool || "";
    $("f-proficiency").value = r.proficiency || "";
    $("f-focus").value       = r.focus || "";
    $("f-unlock").value      = r.unlock || "";
    $("f-source").value      = r.source || "";
    $("f-notes").value       = r.notes || "";

    $("mat-rows").innerHTML = "";
    (r.materials || []).forEach(function (m) { addMaterialRow(m.item, m.qty); });
    addMaterialRow();

    renderEditBanner(r);
    $("submit-recipe").textContent = "Save changes";
    $("form-msg").textContent = "";
    previewForm();
    $("f-name").focus();
  }

  function renderEditBanner(r) {
    var bar = $("edit-banner");
    if (!bar) return;
    if (!state.editingId) { bar.innerHTML = ""; bar.style.display = "none"; return; }

    var isCommitted = state.base.some(function (b) { return b.id === state.editingId; });
    bar.style.display = "block";
    bar.className = "rc-warn";
    bar.innerHTML =
      "<strong>Editing " + escapeHtml(r.name) + ".</strong> " +
      (isCommitted
        ? "This one is already committed, so your changes are kept as a correction " +
          "that replaces it on this browser and exports alongside the recipes."
        : "Saving replaces the copy in your list.") +
      ' <a href="#" class="rc-addlink" id="cancel-edit">cancel and start a new recipe instead</a>';
  }

  function stopEditing() {
    state.editingId = null;
    var bar = $("edit-banner");
    if (bar) { bar.innerHTML = ""; bar.style.display = "none"; }
    $("submit-recipe").textContent = state.localMode ? "Save this recipe" : "Submit recipe";
  }

  function clearForm() {
    ["f-name", "f-level", "f-morale", "f-minutes", "f-commission", "f-tool",
     "f-proficiency", "f-focus", "f-unlock", "f-notes"].forEach(function (id) {
      $(id).value = "";
    });
    $("f-yield").value = "1";
    $("mat-rows").innerHTML = "";
    addMaterialRow(); addMaterialRow(); addMaterialRow();
    previewForm();
  }

  // ============================================================
  // REVIEW (n00b only)
  // ============================================================

  async function loadReview() {
    var box = $("review-content");
    if (!sb) { box.innerHTML = '<p class="rc-muted">The server did not load.</p>'; return; }

    box.innerHTML = '<p class="rc-muted">Loading…</p>';
    var statusFilter = $("review-status").value;

    var res;
    try {
      res = await sb.rpc("list_recipe_submissions", {
        p_status: statusFilter, p_admin_pass: state.adminPass
      });
    } catch (e) {
      box.innerHTML = '<div class="rc-msg rc-msg-bad">Could not reach the server.</div>';
      return;
    }

    if (res.error || !res.data || res.data.ok === false) {
      box.innerHTML = '<div class="rc-msg rc-msg-bad">' +
        escapeHtml((res.data && res.data.error) || (res.error && res.error.message) || "Rejected.") +
        "</div>";
      return;
    }

    state.reviewRows = res.data.rows || [];
    if (!state.reviewRows.length) {
      box.innerHTML = '<p class="rc-muted">Nothing in that queue.</p>';
      return;
    }

    var html = '<div class="rc-note">' + state.reviewRows.length + " submission(s). " +
               "Approving one makes it visible on the site immediately; export to " +
               "<code>data/recipes.js</code> when you want it committed.</div>";
    html += '<button class="rc-btn" id="export-approved">Export approved as recipes.js</button>';

    for (var i = 0; i < state.reviewRows.length; i++) {
      var row = state.reviewRows[i];
      var p = row.payload || {};
      html += '<div class="rc-sub-card">';
      html += '<div class="rc-sub-head"><strong>' + escapeHtml(p.name || row.output_name) + "</strong> " +
              '<span class="rc-tag">' + escapeHtml(row.profession) + "</span> " +
              '<span class="rc-tag rc-tag-mw">' + escapeHtml(row.tier) + "</span> " +
              '<span class="rc-tag rc-tag-' + escapeHtml(row.status) + '">' + escapeHtml(row.status) + "</span> " +
              '<span class="rc-muted">#' + row.id +
              (row.submitter ? " by " + escapeHtml(row.submitter) : "") + "</span></div>";
      html += '<pre class="rc-json">' + escapeHtml(JSON.stringify(p, null, 2)) + "</pre>";
      html += '<div class="rc-sub-actions">' +
              '<button class="rc-btn" data-review="approved" data-id="' + row.id + '">Approve</button> ' +
              '<button class="rc-btn rc-btn-ghost" data-review="rejected" data-id="' + row.id + '">Reject</button> ' +
              '<button class="rc-btn rc-btn-ghost" data-del="' + row.id + '">Delete</button>' +
              "</div>";
      html += "</div>";
    }
    box.innerHTML = html;
  }

  async function review(id, status) {
    var res = await sb.rpc("review_recipe_submission", {
      p_id: Number(id), p_status: status, p_admin_pass: state.adminPass
    });
    if (res.error || (res.data && res.data.ok === false)) {
      alert((res.data && res.data.error) || "That did not work.");
      return;
    }
    await loadReview();
    await loadCommunity();
  }

  function exportApproved() {
    var approved = state.reviewRows.filter(function (r) { return r.status === "approved"; });
    var clean = approved.map(function (r) {
      var p = Object.assign({}, r.payload);
      if (r.submitter) p.submitter = r.submitter;
      return p;
    });
    var text = "const RECIPES_DATA = " + JSON.stringify(clean, null, 2) + ";\n";
    var blob = new Blob([text], { type: "text/javascript" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "recipes-approved.js";
    a.click();
  }

  // ============================================================
  // Loading
  // ============================================================

  async function loadCommunity() {
    if (!sb) return;
    try {
      var res = await sb.rpc("get_approved_recipes");
      if (!res.error && Array.isArray(res.data)) {
        // Anything already committed to data/recipes.js wins, so a recipe
        // that has been exported does not appear twice.
        var have = {};
        state.base.forEach(function (r) { have[String(r.name).toLowerCase() + "|" + r.tier] = true; });
        state.community = res.data.filter(function (r) {
          return !have[String(r.name).toLowerCase() + "|" + r.tier];
        });
      }
    } catch (e) { /* offline is fine — the committed data still works */ }
  }

  async function loadProgress() {
    if (!sb) return;
    try {
      var res = await sb.rpc("get_recipe_progress");
      if (!res.error && res.data) {
        var total = state.base.length + (res.data.approved || 0);
        $("rc-progress").textContent =
          total + " recipe" + (total === 1 ? "" : "s") + " in the Codex" +
          (res.data.pending ? " · " + res.data.pending + " waiting to be checked" : "");
      }
    } catch (e) { /* no counter is better than a wrong one */ }
  }

  // ============================================================
  // Wiring
  // ============================================================

  function switchTab(name) {
    document.querySelectorAll(".view-tab").forEach(function (t) {
      t.classList.toggle("active", t.getAttribute("data-tab") === name);
    });
    document.querySelectorAll(".rc-view").forEach(function (v) {
      v.classList.toggle("active", v.id === "view-" + name);
    });
    var mobileTabSelect = $("mobile-view-select");
    if (mobileTabSelect) mobileTabSelect.value = name;
    $("browse-controls").style.display = name === "browse" ? "flex" : "none";

    if (name === "browse") { renderBrowseControls(); renderBrowse(); }
    if (name === "wanted") renderWanted();
    if (name === "add")    { refreshKnownItems(); previewForm(); }
    if (name === "review" && state.adminPass) loadReview();
  }

  function jumpToAdd(itemName) {
    switchTab("add");
    $("f-name").value = itemName;
    $("f-name").focus();
    previewForm();
  }

  async function init() {
    renderNav("");

    var buildEl = $("rc-build");
    if (buildEl) buildEl.textContent = "build " + BUILD;
    if (window.console) console.log("Crafting Codex build " + BUILD);

    // Tabs
    document.querySelectorAll(".view-tab").forEach(function (t) {
      t.addEventListener("click", function () { switchTab(t.getAttribute("data-tab")); });
    });
    var mobileTabSelect = $("mobile-view-select");
    if (mobileTabSelect) mobileTabSelect.addEventListener("change", function () { switchTab(this.value); });

    // Browse controls
    $("browse-target").addEventListener("change", function () {
      state.target = this.value;
      state.collapsed = {};
      renderBrowse();
    });
    $("browse-qty").addEventListener("input", function () {
      state.qty = Number(this.value) || 1;
      renderBrowse();
    });

    // Tree expand/collapse and "+ recipe" links, anywhere on the page.
    document.body.addEventListener("click", function (e) {
      var toggle = e.target.closest(".rc-toggle");
      if (toggle) {
        var p = toggle.getAttribute("data-path");
        state.collapsed[p] = !state.collapsed[p];
        if (document.querySelector("#view-browse.active")) renderBrowse();
        else previewForm();
        return;
      }
      // Checked FIRST: edit controls also carry .rc-addlink, so the generic
      // handler below would otherwise swallow them.
      var ed = e.target.closest("[data-edit]");
      if (ed) { e.preventDefault(); startEdit(ed.getAttribute("data-edit")); return; }
      if (e.target.id === "cancel-edit") { e.preventDefault(); stopEditing(); clearForm(); return; }

      var add = e.target.closest(".rc-addlink");
      if (add) {
        e.preventDefault();
        var kind = add.getAttribute("data-kind");
        if (kind) {
          classifyMaterial(add.getAttribute("data-matname"), kind);
          if (document.querySelector("#view-wanted.active")) renderWanted();
          else renderBrowse();
          return;
        }
        jumpToAdd(add.getAttribute("data-add"));
        return;
      }
      var rev = e.target.closest("[data-review]");
      if (rev) { review(rev.getAttribute("data-id"), rev.getAttribute("data-review")); return; }
      var del = e.target.closest("[data-del]");
      if (del) {
        if (!confirm("Delete submission #" + del.getAttribute("data-del") + " permanently?")) return;
        sb.rpc("delete_recipe_submission", {
          p_id: Number(del.getAttribute("data-del")), p_admin_pass: state.adminPass
        }).then(loadReview);
        return;
      }
      if (e.target.id === "export-approved") exportApproved();

      var dd = e.target.closest("[data-draftdel]");
      if (dd) {
        e.preventDefault();
        removeDraft(Number(dd.getAttribute("data-draftdel")));
        return;
      }
      if (e.target.id === "download-drafts") { downloadDrafts(); return; }
      if (e.target.id === "copy-drafts") {
        var ta = $("drafts-json");
        ta.style.display = "block";
        ta.value = draftsAsFile();
        copyToClipboard(ta, e.target);
        return;
      }
    });

    // Form
    PROFESSIONS.forEach(function (p) {
      $("f-profession").innerHTML += '<option value="' + p + '">' + p + "</option>";
    });
    TIERS.forEach(function (t) {
      $("f-tier").innerHTML += '<option value="' + t + '">' + t + "</option>";
    });
    try {
      var saved = localStorage.getItem("nwc_recipe_handle");
      if (saved) $("f-submitter").value = saved;
    } catch (e) {}

    addMaterialRow(); addMaterialRow(); addMaterialRow();
    $("add-mat").addEventListener("click", function () { addMaterialRow(); });
    $("submit-recipe").addEventListener("click", submitForm);
    $("clear-recipe").addEventListener("click", function () { stopEditing(); clearForm(); });
    ["f-name", "f-profession", "f-tier", "f-yield"].forEach(function (id) {
      $(id).addEventListener("input", previewForm);
      $(id).addEventListener("change", previewForm);
    });

    // Review gate
    $("review-login").addEventListener("click", function () {
      state.adminPass = $("review-pass").value;
      loadReview();
    });
    $("review-status").addEventListener("change", function () {
      if (state.adminPass) loadReview();
    });

    loadDrafts();
    loadMaterials();
    await probeBackend();
    await loadCommunity();
    loadProgress();
    applyLocalMode();
    renderDrafts();
    renderBrowseControls();
    renderBrowse();
  }

  /* Is the submission backend actually there? A single cheap call decides
     it. Getting this wrong in the optimistic direction is what produced a
     red "that did not send" error every time, so the page asks first
     rather than finding out at the worst moment. */
  async function probeBackend() {
    if (!sb) { state.localMode = true; return; }
    try {
      var res = await sb.rpc("get_recipe_progress");
      state.localMode = !!res.error;
    } catch (e) {
      state.localMode = true;
    }
  }

  // Reword the Add tab so it describes what the button will really do.
  function applyLocalMode() {
    if (!state.localMode) return;

    $("submit-recipe").textContent = "Save this recipe";
    $("f-submitter").closest(".rc-field").style.display = "none";

    var note = $("add-note");
    if (note) {
      note.className = "rc-warn";
      note.innerHTML =
        "<strong>Community submissions are switched off for now.</strong> " +
        "Recipes you add here are kept in this browser and export as a " +
        "<code>recipes.js</code> file to commit — they are not sent anywhere. " +
        "Everything else works normally: what you add shows in the tree " +
        "immediately and counts towards the Wanted list.";
    }

    var prog = $("rc-progress");
    if (prog) {
      var n = state.base.length;
      prog.textContent = n + " recipe" + (n === 1 ? "" : "s") + " committed" +
        (state.drafts.length ? " · " + state.drafts.length + " typed in this browser, not exported yet" : "");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
