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

   PER CHARACTER (2026-10-14): confirmed dungeon achievements belong to a
   character, so everything below is kept once per character:
     CH[charId] = { name, created, t, deleted?: <ms>, p: { achId: record } }
   `P` (used all over this file) is simply CH[cur].p, the selected character's
   records. charId is "c_" + random base36. Everything saved before characters
   existed (local or cloud) becomes the character "Main" with the FIXED id
   "c_main", so two devices migrating on their own land in the same character.
   Character merge (mirrors SQL achievement_merge_char): name from the newer
   character t, created = earlier, t = larger (clamped), deleted = larger. A
   removed character is a TOMBSTONE (`deleted`), hidden, never physically
   deleted; the tombstone wins only over records older than it (a record newer
   than the removal shows the character again). Re-adding a name = a new id.

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

  var CAT_URL = "data/achievements-dungeons.json?v=20261015a";
  // v1 = the flat one-character blob; it is READ once (migrated into c_main) and
  // then left alone on the device as a safety copy. v2 is the per-character blob.
  var LS_KEY_V1 = "nwcb:achievements:v1";
  var LS_KEY = "nwcb:achievements:v2";
  var V1_MARK_KEY = "nwcb:achievements:v1merged";   // fingerprint of the v1 text last merged into c_main
  var CHAR_KEY = "nwcb:achievements:char";   // last selected character on this device
  var UI_KEY = "nwcb:achievements:ui";
  // Same account door and token as Toon Forge cloud saves: one free Discord
  // sign-in covers both tools. It is NOT the premium token (nwcb_premium_token).
  // Because the token is shared, a 401 below drops it for Toon Forge as well.
  var ACCT_KEY = "toon-forge:acct";
  var MAX_IDS = 1000;            // records PER CHARACTER; keep equal to MAX_IDS in premium/lib/achievements.py
  var MAX_CHARS = 10;            // characters shown per account; keep equal to MAX_CHARS there and v_max_chars in the SQL
  var MAX_CHAR_ROWS = 30;        // stored characters incl. hidden removed ones with progress; equal to MAX_CHAR_ROWS / v_max_rows
  var MAX_CHAR_ROWS_HARD = 100;  // absolute ceiling, empty tombstones included; equal to MAX_CHAR_ROWS_HARD / v_hard_rows
  var TOMB_TTL_MS = 30 * 24 * 3600 * 1000;   // an empty tombstone older than this is dropped (SQL v_tomb_ttl)
  var NAME_MAX = 24;
  var MAIN_ID = "c_main";
  var SLUG = /^[a-z0-9][a-z0-9-]{0,119}$/;
  var CHAR_ID = /^c_[a-z0-9]{1,16}$/;
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
  var CH = {};           // characters: charId -> { name, created, t, deleted?, p }
  var cur = MAIN_ID;     // selected character id
  var P = {};            // the SELECTED character's progress: achievement id -> record (CH[cur].p)
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

  /* ---------- characters ---------- */
  function cleanName(n) {
    if (typeof n !== "string") return "";
    var cps = Array.from(n.replace(/[\u0000-\u001f\u007f-\u009f]/g, "").trim());
    return cps.slice(0, NAME_MAX).join("").trim();
  }
  function fallbackName(id) { return id === MAIN_ID ? "Main" : "Character"; }
  function msVal(v) {
    return (typeof v === "number" && isFinite(v) && v >= 0) ? Math.min(Math.floor(v), Date.now() + CLOCK_SLACK_MS) : null;
  }
  function freshMain() { return { name: "Main", created: 0, t: 0, p: {} }; }

  /* A clean copy of one character, or null if the id/shape is junk. The name may
     come back "" (unusable); the merge decides what to do about that. */
  function cleanChar(id, c) {
    if (!CHAR_ID.test(id) || !c || typeof c !== "object") return null;
    var out = { name: cleanName(c.name), created: msVal(c.created) || 0, t: msVal(c.t) || 0, p: {} };
    var del = msVal(c.deleted);
    if (del !== null) out.deleted = del;
    if (c.p && typeof c.p === "object") {
      for (var k in c.p) {
        if (!Object.prototype.hasOwnProperty.call(c.p, k) || !SLUG.test(k)) continue;
        if (Object.keys(out.p).length >= MAX_IDS) break;
        var rec = cleanRecord(c.p[k]);
        if (rec) out.p[k] = rec;
      }
    }
    return out;
  }

  /* Shown or hidden? A removed character carries `deleted`. The tombstone wins
     only over records OLDER than it: a record newer than the removal (made on a
     device that had not heard about it yet) shows the character again. */
  function isLive(c) {
    if (c.deleted === undefined || c.deleted === null) return true;
    for (var k in c.p) if (c.p[k].t > c.deleted) return true;
    return false;
  }
  function liveChars() {
    return Object.keys(CH).filter(function (id) { return isLive(CH[id]); }).map(function (id) { return { id: id, c: CH[id] }; })
      .sort(function (a, b) { return (a.c.created - b.c.created) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0); });
  }
  /* A removed character that holds no records carries nothing worth keeping: it does
     not count toward the stored-rows cap, is kept as a tombstone so other devices learn
     of the removal, and is dropped 30 days later (after a successful sync).
     c_main is exempt (its tombstone must stay or a fresh device would re-invent it).
     Mirrors the SQL and clean_progress() in premium/lib/achievements.py. */
  function emptyTomb(id, c) {
    return id !== MAIN_ID && c.deleted !== undefined && c.deleted !== null && Object.keys(c.p).length === 0;
  }
  function countedRows(map) {
    var n = 0;
    for (var id in map) if (!emptyTomb(id, map[id])) n++;
    return n;
  }
  function compactTombs() {
    var changed = false;
    Object.keys(CH).forEach(function (id) {
      if (emptyTomb(id, CH[id]) && id !== cur && CH[id].deleted < Date.now() - TOMB_TTL_MS) { delete CH[id]; changed = true; }
    });
    return changed;
  }
  function liveCount(map) {
    var n = 0;
    for (var id in map) if (isLive(map[id])) n++;
    return n;
  }

  /* Merge CLEAN character `inc` into `have` (in place; mirrors SQL
     achievement_merge_char). Returns { meta: bool, recs: [changed record ids] }. */
  function mergeChar(id, have, inc) {
    var before = have.name + "|" + have.created + "|" + have.t + "|" + have.deleted;
    var nm;
    if (!inc.name) nm = have.name;
    else if (!have.name) nm = inc.name;
    else if (inc.t > have.t) nm = inc.name;
    else if (inc.t < have.t) nm = have.name;
    else nm = inc.name >= have.name ? inc.name : have.name;      // exact tie: the larger text, so every device agrees
    have.name = nm || fallbackName(id);
    have.created = Math.min(have.created, inc.created);
    have.t = Math.max(have.t, inc.t);
    if (inc.deleted !== undefined) have.deleted = (have.deleted === undefined) ? inc.deleted : Math.max(have.deleted, inc.deleted);
    return { meta: before !== have.name + "|" + have.created + "|" + have.t + "|" + have.deleted, recs: mergeInto(have.p, inc.p) };
  }

  /* Merge a map of characters into `local` (CH), in place. NEVER deletes.
     Caps match the SQL: MAX_CHAR_ROWS stored, MAX_CHARS shown. Returns
     { any, recs (records changed/added), chars (added), skipped, curRecs }. */
  function mergeCharsInto(local, incoming) {
    var res = { any: false, recs: 0, chars: 0, skipped: 0, curRecs: [] };
    if (!incoming || typeof incoming !== "object") return res;
    Object.keys(incoming).sort().slice(0, 60).forEach(function (id) {
      var inc = cleanChar(id, incoming[id]);
      if (!inc) return;
      var have = local[id];
      if (!have) {
        if (emptyTomb(id, inc)) return;                 // nothing in it: not worth a row
        if (countedRows(local) >= MAX_CHAR_ROWS || Object.keys(local).length >= MAX_CHAR_ROWS_HARD || (isLive(inc) && liveCount(local) >= MAX_CHARS)) { res.skipped++; return; }
        if (!inc.name) inc.name = fallbackName(id);
        local[id] = inc;
        res.any = true; res.chars++; res.recs += Object.keys(inc.p).length;
        if (id === cur) res.curRecs = Object.keys(inc.p);
        return;
      }
      if (!isLive(have)) {                          // would this bring a hidden character back past the cap?
        var trial = JSON.parse(JSON.stringify(have));
        mergeChar(id, trial, inc);
        if (isLive(trial) && liveCount(local) >= MAX_CHARS) { res.skipped++; return; }
      }
      var m = mergeChar(id, have, inc);
      if (m.meta || m.recs.length) res.any = true;
      res.recs += m.recs.length;
      if (id === cur) res.curRecs = m.recs;
    });
    return res;
  }

  function isCharsShape(p) {
    var c = p && typeof p === "object" ? p.chars : null;
    return !!c && typeof c === "object" && !Array.isArray(c) && !("t" in c || "d" in c || "s" in c || "c" in c);
  }
  /* Whatever shape a blob arrives in -> a map of characters. The OLD flat shape
     (achievement id -> record, from an older device, file or cloud row) is the
     character c_main. */
  function incomingChars(prog) {
    if (!prog || typeof prog !== "object") return {};
    if (isCharsShape(prog)) return prog.chars;
    var flat = {}, n = 0;
    for (var k in prog) if (Object.prototype.hasOwnProperty.call(prog, k) && k !== "chars") { flat[k] = prog[k]; n++; }
    var out = {};
    if (n) out[MAIN_ID] = { name: "Main", created: 0, t: 0, p: flat };
    return out;
  }

  function nameTaken(name, exceptId) {
    var low = name.toLowerCase();
    return liveChars().some(function (x) { return x.id !== exceptId && x.c.name.toLowerCase() === low; });
  }
  function cutName(base, room) { return Array.from(base).slice(0, room).join("").trim(); }
  function uniqueName(base) {
    var nm = base, n = 2;
    while (nameTaken(nm)) { var suf = " " + (n++); nm = cutName(base, NAME_MAX - suf.length) + suf; }
    return nm;
  }
  /* Two devices can each add a character with the same name. Names are unique
     per account (case-insensitive), so the later-created one gets " 2" etc. The
     order is deterministic, so every device lands on the same names. */
  function fixDuplicateNames() {
    var list = liveChars(), taken = {}, firstSeen = {}, changed = false;
    list.forEach(function (x) { taken[x.c.name.toLowerCase()] = 1; });
    list.forEach(function (x) {
      var key = x.c.name.toLowerCase();
      if (!firstSeen[key]) { firstSeen[key] = 1; return; }
      var n = 2, nm;
      do { var suf = " " + (n++); nm = cutName(x.c.name, NAME_MAX - suf.length) + suf; } while (taken[nm.toLowerCase()]);
      taken[nm.toLowerCase()] = 1;
      x.c.name = nm; x.c.t = Math.max(Date.now(), x.c.t + 1);
      changed = true;
    });
    return changed;
  }
  function newCharId() {
    var a = "", i;
    try { var b = new Uint8Array(8); crypto.getRandomValues(b); for (i = 0; i < 8; i++) a += (b[i] % 36).toString(36); }
    catch (e) { for (i = 0; i < 8; i++) a += Math.floor(Math.random() * 36).toString(36); }
    return "c_" + a;
  }
  function bindCur() { P = CH[cur].p; }
  function setCur(id) { cur = id; bindCur(); lsSet(CHAR_KEY, id); }

  /* After anything that can change the character set (load, sync, restore):
     there is always a Main, always at least one shown character, no duplicate
     names, and a valid selection. Returns true if it had to change data. */
  function reconcile() {
    var changed = false;
    if (!CH[MAIN_ID] && (liveCount(CH) < MAX_CHARS)) { CH[MAIN_ID] = freshMain(); changed = true; }
    if (!liveChars().length) {                 // every character was removed (e.g. from two devices)
      var id; do { id = newCharId(); } while (CH[id]);
      var now = Date.now();
      CH[id] = { name: uniqueName("Main"), created: now, t: now, p: {} };
      changed = true;
    }
    if (fixDuplicateNames()) changed = true;
    var live = liveChars();
    if (!CH[cur] || !isLive(CH[cur])) {
      var want = lsGet(CHAR_KEY);
      cur = (want && CH[want] && isLive(CH[want])) ? want : live[0].id;
    }
    bindCur();
    return changed;
  }
  function hasLocalProgress() {
    return Object.keys(CH).some(function (id) {
      return Object.keys(CH[id].p).length > 0 || id !== MAIN_ID || CH[id].t > 0;
    });
  }

  function fingerprint(str) {
    var h = 5381;
    for (var i = 0; i < str.length; i++) h = ((h * 33) ^ str.charCodeAt(i)) >>> 0;
    return str.length + ":" + h;
  }
  function loadLocal() {
    var migrated = false, raw = lsGet(LS_KEY);
    if (raw) {
      try {
        var o = JSON.parse(raw);
        owner = (o && typeof o.o === "string") ? o.o : "";
        mergeCharsInto(CH, incomingChars(o));
      } catch (e) {
        // Unreadable: keep the bad copy aside instead of silently overwriting it.
        lsSet(LS_KEY + ":corrupt", raw);
      }
    }
    // The old v1 blob is merged into Main whenever its text is not the one already merged: that
    // covers the first visit after this update AND an old cached tab that keeps writing v1 while
    // signed out. Idempotent and never deletes. v1 itself is left in place.
    var v1 = lsGet(LS_KEY_V1);
    if (v1 && fingerprint(v1) !== lsGet(V1_MARK_KEY)) {
      try {
        var o1 = JSON.parse(v1);
        if (!raw) owner = (o1 && typeof o1.o === "string") ? o1.o : "";
        mergeCharsInto(CH, incomingChars(o1 && o1.p && typeof o1.p === "object" ? o1.p : {}));
        lsSet(V1_MARK_KEY, fingerprint(v1));
        migrated = true;
      } catch (e) {
        lsSet(LS_KEY_V1 + ":corrupt", v1);
      }
    }
    return migrated;
  }
  function saveLocal() {
    var ok = lsSet(LS_KEY, JSON.stringify({ v: 2, o: owner, chars: CH }));
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
    Object.keys(CH).forEach(function (cid) {
      var Pm = CH[cid].p;
      Object.keys(alias).forEach(function (al) {
        if (!Pm[al] || BY[al]) return;
        var id = alias[al], have = Pm[id];
        Pm[id] = have ? mergeRecords(have, Pm[al]) : Pm[al];
        delete Pm[al]; moved = true;
      });
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
    var who = liveChars().length > 1 ? CH[cur].name + ": " : "";
    $("ach-sum").textContent = who + shown + " shown · " + open + " not done (" + pts.toLocaleString() + " points left) · " + done + " done";
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
    lsDel(ACCT_KEY); lsDel(LS_KEY); lsDel(LS_KEY_V1); lsDel(V1_MARK_KEY); lsDel(CHAR_KEY);
    resetTimers();
    CH = {}; cur = MAIN_ID; owner = ""; status = ""; pendingOwnerChoice = false;
    reconcile();
    renderAcct(); renderChars(); renderList();
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

  var notSaved = {};   // charId -> why the server skipped it on the last sync ("live" | "rows" | "bytes")
  /* One plain sentence per cause. The server reports which characters it skipped
     (skipped_chars) and how many records (skipped_records). */
  function skipMessage(res) {
    var sc = res.skipped_chars || {}, n = { live: 0, rows: 0, bytes: 0 }, parts = [];
    Object.keys(sc).forEach(function (id) { if (n[sc[id]] !== undefined) n[sc[id]]++; });
    var maxc = res.max_chars || MAX_CHARS;
    if (n.live) parts.push(n.live + " character" + (n.live === 1 ? " was" : "s were") + " not saved to your account: it already has " + maxc + " characters. Remove one to make room.");
    if (n.rows) parts.push(n.rows + " character" + (n.rows === 1 ? " was" : "s were") + " not saved: too many removed characters are stored on your account.");
    if (n.bytes) parts.push("Some characters were not saved: your account storage is full.");
    if (res.skipped_records) parts.push("Some achievements were not saved: a character reached its limit of " + (res.limit || MAX_IDS) + ".");
    if (!parts.length && res.skipped_full) parts.push("Some entries were not saved: your account is full.");
    return parts.join(" ");
  }
  var status = "", syncing = false, dirty = false, pushTimer = null, retryTimer = null, lastSync = 0;
  function setStatus(s) { status = s; var el = $("ach-status-line"); if (el) el.textContent = s; }

  /* Whose progress is on this device? If it belongs to a different Discord
     account than the one now signed in, never upload it silently. */
  function checkOwner() {
    var sub = tokenSub();
    if (!sub) return;
    if (owner && owner !== sub && hasLocalProgress()) { pendingOwnerChoice = true; return; }
    if (owner !== sub) { owner = sub; saveLocal(); }
  }
  function keepSeparate() {
    lsSet(LS_KEY + ":prev:" + (owner || "unknown"), JSON.stringify({ v: 2, o: owner, chars: CH }));   // kept aside, not deleted
    CH = {}; cur = MAIN_ID; owner = tokenSub(); pendingOwnerChoice = false;
    reconcile();
    saveLocal(); renderAcct(); renderChars(); renderList(); sync({});
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
    return acctPost({ op: "sync", progress: { chars: CH } }).then(function (res) {
      var before = cur, beforeName = CH[cur] ? CH[cur].name : "";
      var r = mergeCharsInto(CH, incomingChars(res.progress || {}));
      var fixed = reconcile();
      if (compactTombs()) fixed = true;
      notSaved = (res.skipped_chars && typeof res.skipped_chars === "object") ? res.skipped_chars : {};
      if (r.any || fixed) {
        saveLocal();
        renderChars();
        if (cur !== before || (!inputFocused() && r.curRecs.length)) renderList();
        else if (r.curRecs.length) refreshRelated(r.curRecs);     // never rebuild the list under a focused input
        else updateSummary();
      } else renderChars();
      var movedOff = cur !== before && beforeName && (!CH[before] || !isLive(CH[before]));
      if (movedOff) toast(beforeName + " was removed on another device.", 4500);
      lastSync = Date.now();
      setStatus(skipMessage(res) || "Saved to your account");
      if (opts.loud && !movedOff) {
        var n = r.recs + r.chars;
        toast(n ? "Synced: " + n + " updated from your account." : "Synced. Your account and this browser already match.", 3200);
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

  /* ---------- character switcher ---------- */
  var charSig = "", panelMode = "";
  function renderChars() {
    var sel = $("ach-char");
    if (!sel) return;                         // an old cached page without the switcher: nothing to draw
    var live = liveChars();
    var sig = live.map(function (x) { return x.id + "\u0001" + x.c.name; }).join("\u0002");
    if (sig !== charSig) {
      charSig = sig;
      sel.innerHTML = live.map(function (x) { return '<option value="' + esc(x.id) + '">' + esc(x.c.name) + "</option>"; }).join("");
    }
    sel.value = cur;
    $("ach-char-remove").disabled = live.length < 2;
    $("ach-char-copy").disabled = live.length < 2;
    $("ach-char-add").disabled = live.length >= MAX_CHARS;
    $("ach-char-count").textContent = live.length + " of " + MAX_CHARS + " characters";
    if (live.length < 2) closeCopy();
    var who = $("ach-bar-who");
    if (who) { who.hidden = live.length < 2; who.textContent = "Character: " + CH[cur].name; }
    // characters the server could not take stay visible here, with a note
    var note = $("ach-char-note");
    if (note) {
      var msgs = [];
      live.forEach(function (x) {
        if (!notSaved[x.id]) return;
        msgs.push(x.c.name + " is not saved to your account yet (" +
          (notSaved[x.id] === "live" ? "the account already has " + MAX_CHARS + " characters" :
           notSaved[x.id] === "rows" ? "too many removed characters are stored" : "account storage is full") + ").");
      });
      note.textContent = msgs.join(" ");
      note.hidden = !msgs.length;
    }
    renderRemoved();
  }
  /* Removed characters that still hold progress can be brought back. */
  function removedWithData() {
    return Object.keys(CH).filter(function (id) { return !isLive(CH[id]) && Object.keys(CH[id].p).length > 0; })
      .sort(function (a, b) { return (CH[b].deleted || 0) - (CH[a].deleted || 0); });
  }
  function renderRemoved() {
    var el = $("ach-removed");
    if (!el) return;
    var ids = removedWithData();
    el.hidden = !ids.length;
    el.innerHTML = ids.length ? '<span class="ach-ctl-label">Removed characters</span>' + ids.map(function (id) {
      return '<div class="ach-removed-row"><span class="ach-removed-name">' + esc(CH[id].name) + '</span>' +
             '<button class="ach-btn" type="button" data-restore="' + esc(id) + '" aria-label="Restore ' + esc(CH[id].name) + '">Restore</button></div>';
    }).join("") : "";
  }
  /* Restore = a newer record + a newer character t, so the existing revival rule
     brings it back on every device. */
  function restoreCharacter(id) {
    var c = CH[id];
    if (!c || isLive(c)) return;
    if (liveChars().length >= MAX_CHARS) { toast("You already have " + MAX_CHARS + " characters. Remove one first.", 4000); return; }
    var now = Date.now(), key = null, newest = -1;
    for (var k in c.p) if (c.p[k].t > newest) { newest = c.p[k].t; key = k; }
    if (key === null) return;
    c.p[key].t = Math.max(now, (c.deleted || 0) + 1, newest + 1);
    c.t = Math.max(now, c.t + 1);
    if (nameTaken(c.name, id)) c.name = uniqueName(c.name);
    setCur(id); closePanel(); closeCopy(); afterCharChange();
    toast("Restored " + c.name + ".", 3000);
  }
  function closeCopy() { var el = $("ach-copy"); if (el) el.hidden = true; }
  function closePanel() { var el = $("ach-panel"); if (el) el.hidden = true; panelMode = ""; }
  function afterCharChange() { saveLocal(); renderChars(); renderList(); schedulePush(); }
  function checkName(raw, exceptId) {
    var name = raw.replace(/[\u0000-\u001f\u007f-\u009f]/g, "").trim();
    if (!name) return { err: "Type a name first." };
    if (Array.from(name).length > NAME_MAX) return { err: "Names can be up to " + NAME_MAX + " characters." };
    if (nameTaken(name, exceptId)) return { err: "You already have a character called " + name + "." };
    return { name: name };
  }
  function panelNote(msg, isErr) {
    var n = $("ach-panel-note");
    n.textContent = msg; n.className = "ach-fine" + (isErr ? " ach-err" : "");
    if (isErr) toast(msg, 3500);
  }
  /* Add / Rename / Remove use an inline panel, not window.prompt/confirm: in-app
     browsers (Discord, YouTube) block those. */
  function openPanel(mode) {
    if (!$("ach-panel")) return;
    var c = CH[cur], field = $("ach-panel-field"), inp = $("ach-panel-input"), go = $("ach-panel-go");
    if (mode === "add") {
      if (liveChars().length >= MAX_CHARS) { toast("You can have up to " + MAX_CHARS + " characters. Remove one to add another.", 4000); return; }
      if (countedRows(CH) >= MAX_CHAR_ROWS || Object.keys(CH).length >= MAX_CHAR_ROWS_HARD) { toast("This account has too many removed characters stored to add a new one.", 4500); return; }
    } else if (mode === "remove" && liveChars().length < 2) { toast("Keep at least one character.", 3500); return; }
    closeCopy();
    panelMode = mode;
    field.hidden = mode === "remove";
    inp.value = mode === "rename" ? c.name : "";
    $("ach-panel-label").textContent = mode === "add" ? "Name for the new character" : "New name for " + c.name;
    go.textContent = mode === "add" ? "Add character" : mode === "rename" ? "Rename" : "Remove";
    go.className = "ach-btn " + (mode === "remove" ? "" : "ach-btn-primary");
    if (mode === "remove") {
      panelNote(Object.keys(c.p).length
        ? 'Remove "' + c.name + '"? Its progress is hidden here and on your other devices. You can bring it back from "Removed characters".'
        : 'Remove "' + c.name + '"? It has no progress yet.');
    } else panelNote("Up to " + NAME_MAX + " characters. Each character keeps its own list.");
    $("ach-panel").hidden = false;
    (mode === "remove" ? go : inp).focus();
  }
  function panelSubmit() {
    var c = CH[cur], chk, now;
    if (panelMode === "add") {
      chk = checkName($("ach-panel-input").value, null);
      if (chk.err) { panelNote(chk.err, true); return; }
      var id; do { id = newCharId(); } while (CH[id]);
      now = Date.now();
      CH[id] = { name: chk.name, created: now, t: now, p: {} };
      setCur(id); closePanel(); afterCharChange();
      toast("Added " + chk.name + ". Their list starts empty.", 3000);
    } else if (panelMode === "rename") {
      chk = checkName($("ach-panel-input").value, cur);
      if (chk.err) { panelNote(chk.err, true); return; }
      closePanel();
      if (chk.name === c.name) return;
      c.name = chk.name; c.t = Math.max(Date.now(), c.t + 1);
      afterCharChange();
      toast("Renamed to " + chk.name + ".", 2500);
    } else if (panelMode === "remove") {
      if (liveChars().length < 2) { closePanel(); return; }
      var newest = 0;
      for (var k in c.p) newest = Math.max(newest, c.p[k].t);
      c.deleted = Math.max(Date.now(), newest + 1);      // hidden, not erased: the data stays stored with a tombstone
      var gone = c.name;
      setCur(liveChars()[0].id); closePanel(); afterCharChange();
      toast("Removed " + gone + ".", 3000);
    }
  }
  function openCopy() {
    var others = liveChars().filter(function (x) { return x.id !== cur; });
    if (!others.length) { toast("Add another character first.", 3000); return; }
    closePanel();
    $("ach-copy-from").innerHTML = others.map(function (x) { return '<option value="' + esc(x.id) + '">' + esc(x.c.name) + "</option>"; }).join("");
    $("ach-copy-note").textContent = "Adds that character\u2019s progress to " + CH[cur].name + ". Anything newer on " + CH[cur].name + " is kept.";
    $("ach-copy").hidden = false;
    $("ach-copy-from").focus();
  }
  function doCopy() {
    var src = CH[$("ach-copy-from").value];
    if (!src || !isLive(src)) { closeCopy(); return; }
    var changed = mergeInto(P, src.p);
    closeCopy();
    committed(); renderList();
    toast(changed.length ? "Copied " + changed.length + " achievement" + (changed.length === 1 ? "" : "s") + " from " + src.name + " into " + CH[cur].name + "."
                         : "Nothing to copy: " + CH[cur].name + " already has all of it.", 4000);
  }
  function wireChars() {
    // An old cached HTML page with this newer script has none of this markup: skip quietly.
    var need = ["ach-char", "ach-char-add", "ach-char-rename", "ach-char-remove", "ach-char-copy", "ach-char-count",
                "ach-copy", "ach-copy-from", "ach-copy-note", "ach-copy-go", "ach-copy-cancel",
                "ach-panel", "ach-panel-field", "ach-panel-label", "ach-panel-input", "ach-panel-note", "ach-panel-go", "ach-panel-cancel"];
    for (var i = 0; i < need.length; i++) if (!$(need[i])) return;
    $("ach-char").addEventListener("change", function () {
      if (CH[this.value] && isLive(CH[this.value])) { setCur(this.value); closeCopy(); closePanel(); renderChars(); renderList(); }
    });
    $("ach-char-add").addEventListener("click", function () { openPanel("add"); });
    $("ach-char-rename").addEventListener("click", function () { openPanel("rename"); });
    $("ach-char-remove").addEventListener("click", function () { openPanel("remove"); });
    $("ach-char-copy").addEventListener("click", openCopy);
    $("ach-copy-go").addEventListener("click", doCopy);
    $("ach-copy-cancel").addEventListener("click", closeCopy);
    $("ach-panel-go").addEventListener("click", panelSubmit);
    $("ach-panel-cancel").addEventListener("click", closePanel);
    $("ach-panel-input").addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); panelSubmit(); }
      else if (e.key === "Escape") closePanel();
    });
    var rm = $("ach-removed");
    if (rm) rm.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("button[data-restore]") : null;
      if (b) restoreCharacter(b.getAttribute("data-restore"));
    });
  }

  /* ---------- backup / restore file ---------- */
  function backupToFile() {
    // v2 = every character (removed ones included, so a restore can't bring one back by accident)
    var data = { app: "nwcb-achievements", v: 2, exported: new Date().toISOString(), progress: { chars: CH } };
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
      var nRecs = 0, nChars = 0, skipped = 0, into = "";
      try {
        var o = JSON.parse(String(rd.result));
        if (!o || o.app !== "nwcb-achievements" || !o.progress || typeof o.progress !== "object" || Array.isArray(o.progress)) throw new Error("not an achievement backup");
        if (isCharsShape(o.progress)) {
          // new file: every character is merged by its id
          var r = mergeCharsInto(CH, o.progress.chars);
          nRecs = r.recs; nChars = r.chars; skipped = r.skipped;
        } else {
          // old file (one flat list, from before characters): it goes into the character you are on
          var flat = {};
          Object.keys(o.progress).forEach(function (k) { if (k !== "chars") flat[k] = o.progress[k]; });
          nRecs = mergeInto(P, flat).length; into = CH[cur].name;
        }
      } catch (e) {
        toast("That file isn't an achievement backup (" + e.message + ").", 5000);
        input.value = ""; return;
      }
      input.value = "";
      reconcile();
      saveLocal(); renderChars(); renderList(); schedulePush();
      var what = nRecs + " achievement" + (nRecs === 1 ? "" : "s") + (nChars ? " and " + nChars + " character" + (nChars === 1 ? "" : "s") : "");
      var skipNote = skipped ? " " + skipped + " character" + (skipped === 1 ? " was" : "s were") + " skipped: the limit is " + MAX_CHARS + "." : "";
      toast((nRecs || nChars) ? "Restored " + what + (into ? " into " + into : "") + " from the file (merged with what is here)." + skipNote
                              : "Nothing to restore: this browser already has everything in that file." + skipNote, 6000);
    };
    rd.onerror = function () { toast("Couldn't read that file.", 4000); };
    rd.readAsText(f);
  }

  /* ---------- boot ---------- */
  function boot() {
    loadUi();
    var justSignedIn = acctCaptureFromHash();
    var migrated = loadLocal();          // v1 (one flat list) -> the character Main (c_main)
    reconcile();
    var want = lsGet(CHAR_KEY);          // the character this device had selected last time
    if (want && CH[want] && isLive(CH[want])) setCur(want);
    if (migrated) saveLocal();
    if (signedIn()) checkOwner();
    renderAcct();
    renderChars();
    wireChars();
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
