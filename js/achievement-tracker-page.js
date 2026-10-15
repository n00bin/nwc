/* ============================================================
   Dungeon Achievement Tracker
   ------------------------------------------------------------
   Catalog:   data/achievements-dungeons.json   (loaded once, the one place to
              update the list of achievements; see CLAUDE.md "Achievement tracker")
   Progress:  one record per achievement id, kept in localStorage and, when the
              player signs in with Discord, mirrored to their account through
              the premium backend (/api/achievements), like Toon Forge cloud
              saves. Mobile Safari evicts site storage after ~7 days unused, so
              a copy off the device is the only real protection.

   Record shape (short keys on purpose, this goes over the wire):
     P[id] = { t: <epoch ms of last change>, d: 0|1, s: [sub ids ticked],
               c: { counterId: count } }

   Where a checklist item is itself an achievement in the catalog (sub.ref),
   its tick is NOT stored on the parent: the parent READS the child's record
   and ticking the box WRITES the child's record. One tick, one place.
   `s` is only used for checklist items that are not catalog entries.

   MERGE (this file's mergeInto/mergeRecords and SQL achievement_merge_record
   must stay identical), per achievement id, PER FIELD:
     s  union of both sides (un-ticking a loose sub-item does not stick)
     c  counters and d  taken from the NEWER record, so a counter typo can be
        corrected and an older device's stale value never comes back
        (exact tie: max counter, done wins)
     t  the larger t, clamped to now + 5 min
   NEITHER SIDE EVER DELETES records. A wiped browser arrives with an empty map
   and must not be able to erase the cloud copy.
   ============================================================ */
(function () {
  "use strict";

  var CAT_URL = "data/achievements-dungeons.json?v=20261014c";
  var LS_KEY = "nwcb:achievements:v1";
  var UI_KEY = "nwcb:achievements:ui";
  // Same account door and token as Toon Forge cloud saves: one free Discord
  // sign-in covers both tools. It is NOT the premium token (nwcb_premium_token).
  // Because the token is shared, a 401 below drops it for Toon Forge as well.
  var ACCT_KEY = "toon-forge:acct";
  var MAX_IDS = 1000;            // keep equal to MAX_IDS in premium/lib/achievements.py
  var SLUG = /^[a-z0-9][a-z0-9-]{0,119}$/;
  var PUSH_DELAY_MS = 1500;
  var CLOCK_SLACK_MS = 5 * 60 * 1000;   // keep equal to the +300000 in the SQL

  var ACCT_API = (function () {
    var h = location.hostname;
    var local = h === "localhost" || h === "127.0.0.1" || h === "" || location.protocol === "file:";
    return local ? "http://127.0.0.1:8990" : "https://premium-tau-three.vercel.app";
  })();

  /* ---------- tiny helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }
  var toastTimer = null;
  function toast(msg, ms) {
    var t = $("ach-toast");
    t.textContent = msg;
    t.className = "show";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.className = ""; }, ms || 2600);
  }

  /* ---------- state ---------- */
  var CAT = [];          // catalog entries, in file order
  var BY = {};           // id -> entry
  var PARENTS = {};      // child id -> ids of entries that list it as a checklist item
  var P = {};            // progress: id -> record
  var owner = "";        // Discord id the local progress belongs to ("" = never signed in)
  var EMPTY = { t: 0, d: 0, s: [], c: {} };
  var DEFAULT_UI = { status: "open", sort: "left", dungeon: "", master: false, hideTodo: true };
  var ui = JSON.parse(JSON.stringify(DEFAULT_UI));
  var query = "";
  var storageOK = true;
  var pendingOwnerChoice = false;   // local progress belongs to a different account: no sync until the player chooses

  /* ---------- progress records ---------- */
  function cleanRecord(r) {
    if (!r || typeof r !== "object") return null;
    var out = { t: 0, d: (r.d === 1 || r.d === true || r.d === "1") ? 1 : 0, s: [], c: {} };
    var t = Number(r.t);
    // Clamp: a device with a wrong clock must not pin a record in the future.
    if (isFinite(t) && t > 0) out.t = Math.min(Math.floor(t), Date.now() + CLOCK_SLACK_MS);
    if (Array.isArray(r.s)) {
      for (var i = 0; i < r.s.length && out.s.length < 200; i++) {
        if (typeof r.s[i] === "string" && SLUG.test(r.s[i]) && out.s.indexOf(r.s[i]) < 0) out.s.push(r.s[i]);
      }
    }
    if (r.c && typeof r.c === "object") {
      var n = 0;
      for (var k in r.c) {
        if (!Object.prototype.hasOwnProperty.call(r.c, k) || !SLUG.test(k) || n >= 50) continue;
        var v = Math.floor(Number(r.c[k]));
        if (isFinite(v) && v > 0) { out.c[k] = Math.min(v, 999999); n++; }
      }
    }
    return out;
  }
  function recKey(r) { return JSON.stringify([r.t, r.d, r.s.slice().sort(), Object.keys(r.c).sort().map(function (k) { return [k, r.c[k]]; })]); }

  /* Per-field merge of two CLEAN records (see the header comment). */
  function mergeRecords(a, b) {
    var out = { t: Math.max(a.t, b.t), d: 0, s: [], c: {} };
    out.d = b.t > a.t ? b.d : (b.t < a.t ? a.d : Math.max(a.d, b.d));
    var seen = {};
    a.s.concat(b.s).forEach(function (x) { if (!seen[x] && out.s.length < 200) { seen[x] = 1; out.s.push(x); } });
    // Counters: the newer record's whole set wins; only an exact tie takes the max.
    var srcs = b.t > a.t ? [b.c] : (b.t < a.t ? [a.c] : [a.c, b.c]);
    srcs.forEach(function (cs) {
      for (var k in cs) {
        if (!Object.prototype.hasOwnProperty.call(cs, k)) continue;
        if (out.c[k] === undefined && Object.keys(out.c).length >= 50) continue;
        out.c[k] = Math.max(out.c[k] || 0, cs[k]);
      }
    });
    return out;
  }

  /* Merge `incoming` (a map id -> record) into `local`, in place. NEVER deletes.
     Returns the list of ids that changed. */
  function mergeInto(local, incoming) {
    var changed = [];
    if (!incoming || typeof incoming !== "object") return changed;
    for (var id in incoming) {
      if (!Object.prototype.hasOwnProperty.call(incoming, id) || !SLUG.test(id)) continue;
      var rec = cleanRecord(incoming[id]);
      if (!rec) continue;
      var have = local[id];
      if (!have) {
        if (Object.keys(local).length >= MAX_IDS) continue;
        local[id] = rec; changed.push(id);
      } else {
        var m = mergeRecords(have, rec);
        if (recKey(m) !== recKey(have)) { local[id] = m; changed.push(id); }
      }
    }
    return changed;
  }

  function loadLocal() {
    var raw = lsGet(LS_KEY);
    if (!raw) return;
    try {
      var o = JSON.parse(raw);
      owner = (o && typeof o.o === "string") ? o.o : "";
      mergeInto(P, (o && o.p && typeof o.p === "object") ? o.p : {});
    } catch (e) {
      // Unreadable: keep the bad copy aside instead of silently overwriting it.
      lsSet(LS_KEY + ":corrupt", raw);
    }
  }
  function saveLocal() {
    var ok = lsSet(LS_KEY, JSON.stringify({ v: 1, o: owner, p: P }));
    if (!ok && storageOK) {
      storageOK = false;
      toast("This browser is blocking site storage, so progress can't be kept here. Use Back up to a file.", 6000);
    }
  }

  /* ---------- progress maths ---------- */
  function R(id) { return P[id] || EMPTY; }
  function hasChild(sub) { return !!BY[sub.ref]; }
  function childDone(sub) { var o = P[sub.ref]; return !!(o && o.d === 1); }
  function subDone(r, sub) {
    if (r.d === 1) return true;
    return hasChild(sub) ? childDone(sub) : r.s.indexOf(sub.ref) >= 0;
  }
  function ctrHave(r, ctr) { return r.d === 1 ? ctr.need : Math.min(ctr.need, r.c[ctr.id] || 0); }
  function hasParts(a) { return a.subs.length > 0 || a.counters.length > 0; }
  function allComplete(a, r) {
    var i;
    for (i = 0; i < a.subs.length; i++) if (!subDone(r, a.subs[i])) return false;
    for (i = 0; i < a.counters.length; i++) if (ctrHave(r, a.counters[i]) < a.counters[i].need) return false;
    return hasParts(a);
  }
  /* Done = marked done, or every part is complete. Parts are the source of truth
     for checklists, so points-left, "N left" and the Done filter always agree. */
  function isDone(a) {
    var r = R(a.id);
    return r.d === 1 || allComplete(a, r);
  }
  function progress(a) {
    if (isDone(a)) return { left: 0, total: 1, pct: 100, done: true };
    var r = R(a.id), total = 0, got = 0, i;
    for (i = 0; i < a.subs.length; i++) { total++; if (subDone(r, a.subs[i])) got++; }
    for (i = 0; i < a.counters.length; i++) { total += a.counters[i].need; got += ctrHave(r, a.counters[i]); }
    if (!total) return { left: 1, total: 1, pct: 0, done: false };
    return { left: total - got, total: total, pct: Math.round(100 * got / total), done: false };
  }
  function leftText(a, p) {
    return p.done ? "Done" : (hasParts(a) ? p.left + " left of " + p.total + " (" + p.pct + "%)" : "Not done");
  }

  /* ---------- changing progress ---------- */
  function touch(id, fn) {
    var old = P[id];
    var r = old ? cleanRecord(old) : { t: 0, d: 0, s: [], c: {} };
    fn(r);
    r.t = Math.max(Date.now(), (old ? old.t : 0) + 1);   // always beats the copy it replaces
    P[id] = r;
  }
  function committed() { saveLocal(); schedulePush(); }

  /* Marked-done achievements display every part as complete. Before changing
     ONE part, write that state out so the rest stays complete. */
  function materialize(a, touched) {
    var r = R(a.id);
    if (r.d !== 1) return;
    a.subs.forEach(function (sub) {
      if (hasChild(sub) && !childDone(sub)) { touch(sub.ref, function (x) { x.d = 1; }); touched.push(sub.ref); }
    });
    touch(a.id, function (x) {
      x.d = 0;
      x.s = a.subs.filter(function (s) { return !hasChild(s); }).map(function (s) { return s.ref; });
      x.c = {};
      a.counters.forEach(function (c) { x.c[c.id] = c.need; });
    });
  }
  function toggleSub(a, idx, on) {
    var touched = [a.id], sub = a.subs[idx];
    materialize(a, touched);
    if (hasChild(sub)) {
      touch(sub.ref, function (x) { x.d = on ? 1 : 0; });
      touched.push(sub.ref);
    } else {
      touch(a.id, function (x) {
        var at = x.s.indexOf(sub.ref);
        if (on && at < 0) x.s.push(sub.ref);
        if (!on && at >= 0) x.s.splice(at, 1);
      });
    }
    committed();
    return touched;
  }
  function setCounter(a, cid, value) {
    var ctr = null;
    a.counters.forEach(function (c) { if (c.id === cid) ctr = c; });
    if (!ctr) return [];
    var n = Math.max(0, Math.min(ctr.need, Math.floor(Number(value)) || 0));
    var touched = [a.id];
    materialize(a, touched);
    touch(a.id, function (x) { if (n > 0) x.c[cid] = n; else delete x.c[cid]; });
    committed();
    return touched;
  }
  function setDone(a, on) {
    var touched = [a.id];
    if (on) { touch(a.id, function (x) { x.d = 1; }); committed(); return touched; }
    // Un-doing something that was finished by its parts starts it over,
    // otherwise it would still read as complete.
    var probe = cleanRecord(R(a.id)); probe.d = 0;
    var wasByParts = allComplete(a, probe);
    touch(a.id, function (x) { x.d = 0; if (wasByParts) { x.s = []; x.c = {}; } });
    if (wasByParts) a.subs.forEach(function (sub) {
      if (hasChild(sub) && childDone(sub)) { touch(sub.ref, function (x) { x.d = 0; }); touched.push(sub.ref); }
    });
    committed();
    return touched;
  }

  /* ---------- catalog -> display ---------- */
  function slugify(s) {
    return String(s).toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120) || "x";
  }
  function haystack(a) {
    return (a.name + " " + a.dungeon + " " + (a.dungeon_full || "") + " " + a.description + " " +
            a.subs.map(function (s) { return s.text; }).join(" ") + " " +
            a.counters.map(function (c) { return c.label; }).join(" ")).toLowerCase();
  }
  function prepare(list) {
    var alias = {};
    CAT = list.map(function (a) {
      var e = {
        id: a.id, name: a.name, points: Number(a.points) || 0, master: !!a.master,
        dungeon: a.dungeon || "Other", dungeon_full: a.dungeon_full || "",
        description: a.description || "", reward: a.reward || "", todo: !!a.catalog_only,
        subs: (a.subs || []).map(function (s) {
          return { text: s.text, ref: s.ref && SLUG.test(s.ref) ? s.ref : slugify(s.text) };
        }),
        counters: (a.counters || []).filter(function (c) { return c.need > 0; })
      };
      e.hay = haystack(e);
      BY[e.id] = e;
      (a.aliases || []).forEach(function (al) { alias[al] = e.id; });
      return e;
    });
    CAT.forEach(function (e) {
      e.subs.forEach(function (s) { if (BY[s.ref]) (PARENTS[s.ref] = PARENTS[s.ref] || []).push(e.id); });
    });
    // Id stability: an entry renamed in the catalog lists its old ids in `aliases`;
    // progress saved under an old id moves to the current one.
    var moved = false;
    Object.keys(alias).forEach(function (al) {
      if (!P[al] || BY[al]) return;
      var id = alias[al], cur = P[id];
      P[id] = cur ? mergeRecords(cur, P[al]) : P[al];
      delete P[al]; moved = true;
    });
    if (moved) saveLocal();
  }
  function scope() { return CAT.filter(function (a) { return !(ui.hideTodo && a.todo); }); }

  function visible() {
    var q = query.trim().toLowerCase();
    var out = scope().filter(function (a) {
      var done = isDone(a);
      if (ui.status === "open" && done) return false;
      if (ui.status === "done" && !done) return false;
      if (ui.dungeon && a.dungeon !== ui.dungeon) return false;
      if (ui.master && !a.master) return false;
      if (q && a.hay.indexOf(q) < 0) return false;
      return true;
    });
    var Pg = {};
    out.forEach(function (a) { Pg[a.id] = progress(a); });
    var byName = function (a, b) { return a.name.localeCompare(b.name); };
    if (ui.sort === "points") out.sort(function (a, b) { return (b.points - a.points) || byName(a, b); });
    else if (ui.sort === "name") out.sort(byName);
    else if (ui.sort === "dungeon") out.sort(function (a, b) {
      return a.dungeon.localeCompare(b.dungeon) || (Pg[a.id].left - Pg[b.id].left) || byName(a, b);
    });
    else out.sort(function (a, b) {   // closest to completion
      return (Pg[a.id].done - Pg[b.id].done) || (Pg[a.id].left - Pg[b.id].left) ||
             (Pg[b.id].pct - Pg[a.id].pct) || (b.points - a.points) || byName(a, b);
    });
    return out;
  }

  function cardHTML(a) {
    var r = R(a.id), p = progress(a), done = p.done, i;
    var h = '<article class="ach-card' + (done ? " done" : "") + (a.master ? " master" : "") + '" data-id="' + esc(a.id) + '">';
    h += '<div class="ach-top"><h3 class="ach-name">' + esc(a.name) + '</h3><span class="ach-pts">' +
         (a.points ? a.points + " pts" : "? pts") + "</span></div>";
    h += '<div class="ach-tags">' + (a.master ? '<span class="ach-tag m">MASTER</span>' : "") +
         '<span class="ach-tag">' + esc(a.dungeon) + "</span>" +
         (a.todo ? '<span class="ach-tag todo">details coming</span>' : "") + "</div>";
    h += a.description ? '<p class="ach-desc">' + esc(a.description) + "</p>"
                       : '<p class="ach-desc todo">Details for this one are still being added. You can still tick it off.</p>';
    if (a.reward) h += '<p class="ach-reward">Reward: ' + esc(a.reward) + "</p>";
    if (a.subs.length) {
      h += '<ul class="ach-subs">';
      for (i = 0; i < a.subs.length; i++) {
        var sd = subDone(r, a.subs[i]);
        h += '<li><label class="ach-sub' + (sd ? " d" : "") + '"><input type="checkbox" data-act="sub" data-i="' + i + '"' +
             (sd ? " checked" : "") + "><span>" + esc(a.subs[i].text) + "</span></label></li>";
      }
      h += "</ul>";
    }
    if (a.counters.length) {
      h += '<div class="ach-ctrs">';
      for (i = 0; i < a.counters.length; i++) {
        var c = a.counters[i], have = ctrHave(r, c);
        h += '<div class="ach-ctr"><span class="ach-ctr-label">' + esc(c.label) + "</span>" +
             '<button class="ach-step" type="button" data-act="dec" data-c="' + esc(c.id) + '" aria-label="One less: ' + esc(c.label) + '">&minus;</button>' +
             '<input class="ach-field ach-num" type="number" inputmode="numeric" min="0" max="' + c.need + '" value="' + have +
             '" data-act="ctr" data-c="' + esc(c.id) + '" aria-label="' + esc(c.label) + ' count">' +
             '<button class="ach-step" type="button" data-act="inc" data-c="' + esc(c.id) + '" aria-label="One more: ' + esc(c.label) + '">+</button>' +
             '<span class="ach-ctr-of">/ ' + c.need + "</span></div>";
      }
      h += "</div>";
    }
    h += '<div class="ach-progress" aria-hidden="true"><i style="width:' + p.pct + '%"></i></div>';
    h += '<div class="ach-foot"><span class="ach-left">' + leftText(a, p) + "</span>" +
         '<button class="ach-btn ach-donebtn" type="button" data-act="done" aria-pressed="' + (done ? "true" : "false") + '">' +
         (done ? "&#10003; Done" : "Mark done") + "</button></div>";
    return h + "</article>";
  }

  function renderList() {
    var list = visible(), el = $("ach-list"), parts = [], last = null;
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      if (ui.sort === "dungeon" && a.dungeon !== last) { last = a.dungeon; parts.push('<div class="ach-group">' + esc(a.dungeon) + "</div>"); }
      parts.push(cardHTML(a));
    }
    el.innerHTML = parts.length ? parts.join("") :
      '<div class="ach-empty" style="grid-column:1/-1">' +
      (ui.status === "open" && !query && !ui.dungeon && !ui.master
        ? "Nothing left to do here. Nice work!" : "Nothing matches those filters.") + "</div>";
    updateSummary(list.length);
  }

  function updateSummary(shown) {
    var open = 0, pts = 0, done = 0;
    scope().forEach(function (a) {
      if (isDone(a)) done++; else { open++; pts += a.points; }
    });
    if (shown == null) shown = $("ach-list").querySelectorAll(".ach-card").length;
    $("ach-sum").textContent = shown + " shown · " + open + " not done (" + pts.toLocaleString() + " points left) · " + done + " done";
    $("ach-apply").textContent = "Show " + shown + " result" + (shown === 1 ? "" : "s");
    var n = (ui.status !== DEFAULT_UI.status ? 1 : 0) + (ui.dungeon ? 1 : 0) + (ui.master ? 1 : 0) +
            (ui.hideTodo !== DEFAULT_UI.hideTodo ? 1 : 0) + (ui.sort !== DEFAULT_UI.sort ? 1 : 0);
    var badge = $("ach-filter-count");
    badge.textContent = n || "";
    badge.className = "ach-filter-count" + (n ? " on" : "");
  }

  /* Update a card IN PLACE (text, ticks, bar). The element is never replaced, so
     a tap that lands right after a typed counter change still reaches its button,
     focus stays put, and the list is not re-sorted under the player's thumb. */
  function refreshCard(id) {
    var el = $("ach-list").querySelector('[data-id="' + id + '"]');
    var a = BY[id];
    if (!el || !a) return;
    var r = R(id), p = progress(a), i;
    el.classList.toggle("done", p.done);
    var subs = el.querySelectorAll('input[data-act="sub"]');
    for (i = 0; i < subs.length; i++) {
      var sd = subDone(r, a.subs[Number(subs[i].getAttribute("data-i"))]);
      subs[i].checked = sd;
      subs[i].parentNode.classList.toggle("d", sd);
    }
    var nums = el.querySelectorAll('input[data-act="ctr"]');
    nums.forEach(function (inp) {
      if (document.activeElement === inp) return;
      var cid = inp.getAttribute("data-c");
      a.counters.forEach(function (c) { if (c.id === cid) inp.value = ctrHave(r, c); });
    });
    var bar = el.querySelector(".ach-progress i"); if (bar) bar.style.width = p.pct + "%";
    var left = el.querySelector(".ach-left"); if (left) left.textContent = leftText(a, p);
    var btn = el.querySelector('[data-act="done"]');
    if (btn) { btn.setAttribute("aria-pressed", p.done ? "true" : "false"); btn.innerHTML = p.done ? "&#10003; Done" : "Mark done"; }
  }
  /* The changed cards plus everything that reads them: parents list children as
     checklist items, and a marked-done parent draws its children as ticked. */
  function refreshRelated(ids) {
    var seen = {};
    function add(id) { if (id && !seen[id]) { seen[id] = 1; refreshCard(id); } }
    ids.forEach(function (id) {
      add(id);
      (PARENTS[id] || []).forEach(add);
      if (BY[id]) BY[id].subs.forEach(function (s) { add(s.ref); });
    });
    updateSummary();
  }

  /* ---------- list events (delegated: one listener, not hundreds) ---------- */
  function cardOf(t) { return t.closest ? t.closest(".ach-card") : null; }
  function onListClick(e) {
    var b = e.target.closest ? e.target.closest("button[data-act]") : null;
    if (!b) return;
    var card = cardOf(b); if (!card) return;
    var a = BY[card.getAttribute("data-id")]; if (!a) return;
    var act = b.getAttribute("data-act");
    if (act === "done") {
      var on = !isDone(a);
      refreshRelated(setDone(a, on)); toast(on ? "Marked done" : "Back on the list", 1400);
    } else if (act === "inc" || act === "dec") {
      var cid = b.getAttribute("data-c"), r = R(a.id), cur = 0;
      a.counters.forEach(function (c) { if (c.id === cid) cur = ctrHave(r, c); });
      refreshRelated(setCounter(a, cid, cur + (act === "inc" ? 1 : -1)));
    }
  }
  function onListChange(e) {
    var t = e.target, act = t.getAttribute && t.getAttribute("data-act");
    if (!act) return;
    var card = cardOf(t); if (!card) return;
    var a = BY[card.getAttribute("data-id")]; if (!a) return;
    if (act === "sub") refreshRelated(toggleSub(a, Number(t.getAttribute("data-i")), t.checked));
    else if (act === "ctr") {
      refreshRelated(setCounter(a, t.getAttribute("data-c"), t.value));
      // show the clamped value even though this input has focus
      var cid = t.getAttribute("data-c"), r = R(a.id);
      a.counters.forEach(function (c) { if (c.id === cid) t.value = ctrHave(r, c); });
    }
  }

  /* ---------- filter bar ---------- */
  function saveUi() { lsSet(UI_KEY, JSON.stringify(ui)); }
  function loadUi() {
    try {
      var o = JSON.parse(lsGet(UI_KEY) || "{}");
      if (["open", "done", "all"].indexOf(o.status) >= 0) ui.status = o.status;
      if (["left", "dungeon", "points", "name"].indexOf(o.sort) >= 0) ui.sort = o.sort;
      if (typeof o.dungeon === "string") ui.dungeon = o.dungeon;
      if (typeof o.master === "boolean") ui.master = o.master;
      if (typeof o.hideTodo === "boolean") ui.hideTodo = o.hideTodo;
    } catch (e) {}
  }
  function syncControls() {
    var btns = $("ach-status").querySelectorAll("button");
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute("aria-pressed", btns[i].getAttribute("data-v") === ui.status ? "true" : "false");
    $("ach-sort").value = ui.sort;
    $("ach-dungeon").value = ui.dungeon;
    $("ach-master").checked = ui.master;
    $("ach-hide-todo").checked = ui.hideTodo;
  }
  function fillDungeons() {
    var counts = {};
    CAT.forEach(function (a) { counts[a.dungeon] = (counts[a.dungeon] || 0) + 1; });
    var names = Object.keys(counts).sort(function (a, b) {
      if (a === "General" || a === "Other") return 1;      // catch-all groups last
      if (b === "General" || b === "Other") return -1;
      return a.localeCompare(b);
    });
    var sel = $("ach-dungeon");
    sel.innerHTML = '<option value="">All dungeons</option>' + names.map(function (n) {
      return '<option value="' + esc(n) + '">' + esc(n) + " (" + counts[n] + ")</option>";
    }).join("");
    if (ui.dungeon && !counts[ui.dungeon]) ui.dungeon = "";
  }
  function applyFilters() { saveUi(); renderList(); }
  var searchTimer = null;
  function wireBar() {
    $("ach-q").addEventListener("input", function () {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () { query = $("ach-q").value; renderList(); }, 120);
    });
    $("ach-status").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      ui.status = b.getAttribute("data-v"); syncControls(); applyFilters();
    });
    $("ach-sort").addEventListener("change", function () { ui.sort = this.value; applyFilters(); });
    $("ach-dungeon").addEventListener("change", function () { ui.dungeon = this.value; applyFilters(); });
    $("ach-master").addEventListener("change", function () { ui.master = this.checked; applyFilters(); });
    $("ach-hide-todo").addEventListener("change", function () { ui.hideTodo = this.checked; applyFilters(); });
    $("ach-clear").addEventListener("click", function () {
      ui = JSON.parse(JSON.stringify(DEFAULT_UI));
      query = ""; $("ach-q").value = ""; syncControls(); applyFilters();
    });
    function setSheet(open) {
      $("ach-filters").classList.toggle("open", open);
      document.body.classList.toggle("ach-sheet-open", open);
      $("ach-filter-btn").setAttribute("aria-expanded", open ? "true" : "false");
      if (open) $("ach-status").querySelector("button").focus();
    }
    $("ach-filter-btn").addEventListener("click", function () { setSheet(!$("ach-filters").classList.contains("open")); });
    $("ach-apply").addEventListener("click", function () { setSheet(false); });
    $("ach-backdrop").addEventListener("click", function () { setSheet(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setSheet(false); });
    // Keep the sticky bar flush under the navbar. On phones theme.css makes the
    // navbar position:relative (it scrolls away), so the offset must be 0 there.
    function navH() {
      var n = document.querySelector(".navbar"), h = 0;
      if (n && getComputedStyle(n).position === "sticky") h = n.offsetHeight;
      document.documentElement.style.setProperty("--nav-h", h + "px");
    }
    navH();
    window.addEventListener("resize", navH);
    window.addEventListener("orientationchange", function () { setTimeout(navH, 150); });
    window.addEventListener("load", navH);
  }

  /* ---------- account (free Discord sign-in, shared with Toon Forge) ---------- */
  function acctToken() { return lsGet(ACCT_KEY) || null; }
  function signedIn() { return !!acctToken(); }
  /* The Discord id inside the token (read for ownership checks only; the server
     is what actually trusts it). */
  function tokenSub() {
    var t = acctToken();
    if (!t) return "";
    try {
      var b = t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      while (b.length % 4) b += "=";
      return String(JSON.parse(atob(b)).sub || "");
    } catch (e) { return ""; }
  }
  function acctSignIn() {
    var sep = location.search ? "&" : "?";
    var back = location.origin + location.pathname + location.search + sep + "acct=1";
    location.href = ACCT_API + "/api/auth_login?return=" + encodeURIComponent(back);
  }
  function resetTimers() { clearTimeout(pushTimer); clearTimeout(retryTimer); }
  function acctSignOut() {
    lsDel(ACCT_KEY);
    resetTimers();
    status = "";
    pendingOwnerChoice = false;
    renderAcct();
    toast("Signed out. Your progress is still saved in this browser.");
  }
  function acctSignOutAndClear() {
    if (!confirm("Sign out and remove the saved achievement progress from this device? Your account keeps its copy.")) return;
    lsDel(ACCT_KEY); lsDel(LS_KEY);
    resetTimers();
    P = {}; owner = ""; status = ""; pendingOwnerChoice = false;
    renderAcct(); renderList();
    toast("Signed out and cleared this device.");
  }
  // Pick up the token the backend hands back as #acct=<jwt>.
  function acctCaptureFromHash() {
    var m = (location.hash || "").match(/[#&]acct=([^&]+)/);
    if (!m) return false;
    var tok;
    try { tok = decodeURIComponent(m[1]); } catch (e) { tok = m[1]; }
    var kept = lsSet(ACCT_KEY, tok) && lsGet(ACCT_KEY) === tok;
    var search = location.search.replace(/([?&])acct=1(?=&|$)/, "$1").replace(/[?&]$/, "");
    history.replaceState(null, "", location.pathname + search);
    if (!kept) {
      toast("Signed in, but this browser is blocking site storage, so the sign-in can't be remembered. " +
            "Open this page in a normal (non-private) window and sign in again.", 8000);
      return false;
    }
    return true;
  }
  function acctPost(payload) {
    var token = acctToken();
    if (!token) return Promise.reject(new Error("not signed in"));
    var body = JSON.stringify(payload);
    return fetch(ACCT_API + "/api/achievements", {
      method: "POST",
      keepalive: body.length < 60000,   // lets a last push finish while the tab closes
      headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
      body: body
    }).then(function (r) {
      if (r.status === 401) {          // expired or revoked: drop it and ask again (Toon Forge shares this token, so it signs out there too)
        lsDel(ACCT_KEY);
        renderAcct();
        throw new Error("your sign-in expired, please sign in again");
      }
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok || !j.ok) throw new Error(j.detail || ("server error " + r.status));
        return j;
      });
    });
  }

  var status = "", syncing = false, dirty = false, pushTimer = null, retryTimer = null, lastSync = 0;
  function setStatus(s) { status = s; var el = $("ach-status-line"); if (el) el.textContent = s; }

  /* Whose progress is on this device? If it belongs to a different Discord
     account than the one now signed in, never upload it silently. */
  function checkOwner() {
    var sub = tokenSub();
    if (!sub) return;
    if (owner && owner !== sub && Object.keys(P).length) { pendingOwnerChoice = true; return; }
    if (owner !== sub) { owner = sub; saveLocal(); }
  }
  function keepSeparate() {
    lsSet(LS_KEY + ":prev:" + (owner || "unknown"), JSON.stringify({ v: 1, o: owner, p: P }));   // kept aside, not deleted
    P = {}; owner = tokenSub(); pendingOwnerChoice = false;
    saveLocal(); renderAcct(); renderList(); sync({});
  }
  function mergeIntoAccount() {
    owner = tokenSub(); pendingOwnerChoice = false;
    saveLocal(); renderAcct(); sync({ loud: true });
  }

  function schedulePush() {
    if (!signedIn() || pendingOwnerChoice) return;
    dirty = true;
    setStatus("Saving…");
    clearTimeout(pushTimer);
    pushTimer = setTimeout(function () { sync({}); }, PUSH_DELAY_MS);
  }

  function inputFocused() {
    var f = document.activeElement;
    return !!(f && (f.tagName === "INPUT" || f.tagName === "SELECT" || f.tagName === "TEXTAREA"));
  }

  /* Push the local map up, pull the merged map back down. One round trip, and
     both sides end up holding the merge of the two. */
  function sync(opts) {
    opts = opts || {};
    if (!signedIn() || pendingOwnerChoice) return Promise.resolve(null);
    if (syncing) { dirty = true; return Promise.resolve(null); }
    syncing = true; dirty = false;
    resetTimers();
    setStatus("Syncing…");
    var failed = false;
    return acctPost({ op: "sync", progress: P }).then(function (res) {
      var changed = mergeInto(P, res.progress || {});
      if (changed.length) {
        saveLocal();
        // Never rebuild the list under a focused input: update only the changed cards.
        if (inputFocused()) refreshRelated(changed); else renderList();
      }
      lastSync = Date.now();
      var msg = "Saved to your account";
      if (res.skipped_full) msg = "Some entries were not saved: your account is full (" + (res.limit || MAX_IDS) + ").";
      setStatus(msg);
      if (opts.loud) {
        toast(changed.length ? "Synced: " + changed.length + " updated from your account." : "Synced. Your account and this browser already match.", 3200);
      }
      return res;
    }).catch(function (err) {
      failed = true; dirty = true;
      setStatus("Couldn't reach your account (" + err.message + "). Your progress is safe in this browser; will retry.");
      if (signedIn()) retryTimer = setTimeout(function () { sync({}); }, 20000);
      if (opts.loud) toast("Couldn't reach your account: " + err.message, 5000);
      return null;
    }).then(function (res) {
      syncing = false;
      if (dirty && !failed && signedIn()) schedulePush();
      return res;
    });
  }

  function renderAcct() {
    var el = $("ach-acct"), h;
    if (signedIn()) {
      h = '<div class="ach-acct-line"><strong>Signed in with Discord.</strong> <span id="ach-status-line">' + esc(status || "Your progress is saved to your account.") + "</span></div>";
      if (pendingOwnerChoice) {
        h += '<div class="ach-choice"><strong>This device holds someone else&rsquo;s progress.</strong> It was saved while a different Discord account was signed in. What should happen to it?' +
             '<div class="ach-acct-actions"><button class="ach-btn" id="ach-keepsep" type="button">Keep it separate (start empty)</button>' +
             '<button class="ach-btn" id="ach-merge" type="button">Merge it into this account</button></div></div>';
      }
      h += '<div class="ach-acct-actions"><button class="ach-btn" id="ach-sync" type="button">Sync now</button>' +
           '<button class="ach-btn" id="ach-signout" type="button">Sign out</button>' +
           '<button class="ach-btn" id="ach-signout-clear" type="button">Sign out and clear this device</button></div>';
    } else {
      h = '<div class="ach-acct-line"><strong>Saved on this device only.</strong> Sign in with Discord to keep your progress on any device.</div>' +
          '<div class="ach-acct-actions"><button class="ach-btn ach-btn-primary" id="ach-signin" type="button">Sign in with Discord</button></div>' +
          '<p class="ach-fine">Free. We only keep your Discord ID and your ticks.</p>';
    }
    h += '<details class="ach-more"><summary>Back up or restore a file</summary>' +
         '<p class="ach-fine" style="margin:0 0 0.5rem">Phones can clear a website&rsquo;s saved data when you have not visited for about a week. A backup file is your safety net.</p>' +
         '<div class="ach-acct-actions"><button class="ach-btn" id="ach-backup" type="button">Back up to a file</button>' +
         '<button class="ach-btn" id="ach-restore" type="button">Restore from a file</button>' +
         '<input type="file" id="ach-file" accept="application/json,.json" hidden></div></details>';
    el.innerHTML = h;
    var b;
    if ((b = $("ach-signin"))) b.addEventListener("click", acctSignIn);
    if ((b = $("ach-signout"))) b.addEventListener("click", acctSignOut);
    if ((b = $("ach-signout-clear"))) b.addEventListener("click", acctSignOutAndClear);
    if ((b = $("ach-sync"))) b.addEventListener("click", function () { sync({ loud: true }); });
    if ((b = $("ach-keepsep"))) b.addEventListener("click", keepSeparate);
    if ((b = $("ach-merge"))) b.addEventListener("click", mergeIntoAccount);
    $("ach-backup").addEventListener("click", backupToFile);
    $("ach-restore").addEventListener("click", function () { $("ach-file").click(); });
    $("ach-file").addEventListener("change", restoreFromFile);
  }

  /* ---------- backup / restore file ---------- */
  function backupToFile() {
    var data = { app: "nwcb-achievements", v: 1, exported: new Date().toISOString(), progress: P };
    var blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "nwcb-achievements-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    toast("Backup file saved. Keep it somewhere safe.", 3500);
  }
  function restoreFromFile() {
    var f = this.files && this.files[0], input = this;
    if (!f) return;
    var rd = new FileReader();
    rd.onload = function () {
      var changed = [];
      try {
        var o = JSON.parse(String(rd.result));
        if (!o || o.app !== "nwcb-achievements" || !o.progress || typeof o.progress !== "object") throw new Error("not an achievement backup");
        changed = mergeInto(P, o.progress);
      } catch (e) {
        toast("That file isn't an achievement backup (" + e.message + ").", 5000);
        input.value = ""; return;
      }
      input.value = "";
      saveLocal(); renderList(); schedulePush();
      toast(changed.length ? "Restored " + changed.length + " achievement" + (changed.length === 1 ? "" : "s") + " from the file (merged with what is here)."
                           : "Nothing to restore: this browser already has everything in that file.", 5000);
    };
    rd.onerror = function () { toast("Couldn't read that file.", 4000); };
    rd.readAsText(f);
  }

  /* ---------- boot ---------- */
  function boot() {
    loadUi();
    var justSignedIn = acctCaptureFromHash();
    loadLocal();
    if (signedIn()) checkOwner();
    renderAcct();
    wireBar();
    var list = $("ach-list");
    list.addEventListener("click", onListClick);
    list.addEventListener("change", onListChange);

    fetch(CAT_URL).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (data) {
      prepare(data.achievements || []);
      fillDungeons(); syncControls(); renderList();
      if (signedIn()) sync({ loud: justSignedIn });
    }).catch(function (err) {
      $("ach-sum").innerHTML = "Couldn't load the achievement list (" + esc(err.message) + "). " +
        '<button class="ach-btn" id="ach-retry" type="button">Try again</button>';
      $("ach-retry").addEventListener("click", function () { location.reload(); });
    });

    // Coming back to the tab (e.g. after changes on another device): pull, and
    // push anything still waiting before the page goes away.
    document.addEventListener("visibilitychange", function () {
      if (!signedIn() || !CAT.length) return;
      if (document.visibilityState === "hidden" && dirty) sync({});
      else if (document.visibilityState === "visible" && Date.now() - lastSync > 60000) sync({});
    });
  }
  boot();
})();
