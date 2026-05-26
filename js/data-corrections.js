/* =====================================================================
   Data Corrections — client plumbing
   ---------------------------------------------------------------------
   Lets users submit corrections to the underlying game data (e.g. a
   companion power's stat value, a gear piece's IL, an insignia bonus
   amount) from inline ✎ UI in Toon Forge. Identical corrections from
   different users are deduped server-side via the submit_data_correction
   RPC and surface as one report with N upvotes.

   Public API on window.NWCBDataCorrections:

     getVoterHash()
       Returns a stable per-browser identifier used for upvote dedup.

     fingerprint(parts)
       Pure: stringifies and SHA-256-hashes the ordered key fields so the
       same correction submitted by N users produces the same hash.

     submitCorrection({ type, id, field, rarityScalingRule, baseIL,
                        claimedBaseValue, userObserved, title, notes })
       Submits to the Supabase RPC. Returns a promise that resolves to
       { ok, action, report_id, upvotes } on success, or { ok:false, error }
       on failure.

     setOverride(key, value)  /  getOverride(key)  /  getAllOverrides()
       localStorage-backed override store the engine can consult to apply
       any pending in-browser corrections immediately (before they're
       approved + merged into source JSON).
   ===================================================================== */

(function () {
  "use strict";

  var SUPABASE_URL  = "https://ynrfmmccarrpqjdrpvqn.supabase.co";
  var SUPABASE_ANON = "sb_publishable_RSK4LJnJ4-HQDudcRq3gRw_WJI5WIUw";

  // Lazy supabase client — only built if window.supabase is loaded.
  var _sb = null;
  function sbClient() {
    if (_sb) return _sb;
    if (!window.supabase) return null;
    _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    return _sb;
  }

  // ---- voter hash ---------------------------------------------------
  // Stable per-browser identifier. Reused by the existing upvote_report
  // RPC for dedup. We mint once on first call and persist in
  // localStorage. Not personally identifying.
  function getVoterHash() {
    var KEY = "nwcb_voter_hash";
    try {
      var h = localStorage.getItem(KEY);
      if (h && h.length >= 16) return h;
      h = _randomHex(32);
      localStorage.setItem(KEY, h);
      return h;
    } catch (e) {
      // localStorage blocked — fall back to a per-session hash that
      // won't dedup across reloads but at least lets the call succeed.
      if (!window.__nwcb_voter_hash) {
        window.__nwcb_voter_hash = _randomHex(32);
      }
      return window.__nwcb_voter_hash;
    }
  }

  function _randomHex(n) {
    var bytes = new Uint8Array(n / 2);
    (window.crypto || window.msCrypto).getRandomValues(bytes);
    return Array.from(bytes).map(function (b) {
      return ("0" + b.toString(16)).slice(-2);
    }).join("");
  }

  // ---- fingerprint --------------------------------------------------
  // Deterministic hash of the correction's identity fields. Same inputs
  // → same hash → server dedupes into one report.
  //
  // parts: ordered array of strings/numbers. The caller is responsible
  // for picking the right normalization (e.g. base-IL value instead of
  // displayed-at-rarity value) before computing the hash.
  function fingerprint(parts) {
    var s = parts.map(function (p) {
      return (p === null || p === undefined) ? "" : String(p);
    }).join("|");
    return _sha256Hex(s);
  }

  function _sha256Hex(s) {
    // Synchronous SubtleCrypto fallback wrapper. We return a promise
    // because SubtleCrypto.digest is async; callers should `await` it.
    var enc = new TextEncoder().encode(s);
    return crypto.subtle.digest("SHA-256", enc).then(function (buf) {
      return Array.from(new Uint8Array(buf)).map(function (b) {
        return ("0" + b.toString(16)).slice(-2);
      }).join("");
    });
  }

  // ---- submission ---------------------------------------------------
  // Posts a correction to the submit_data_correction RPC.
  //
  // Required input fields:
  //   type   — short identifier of what kind of data is being corrected,
  //            e.g. "companion_power", "gear", "insignia_bonus"
  //   id     — the source JSON's id of the affected entry
  //   field  — dotted path to the corrected field, e.g. "stats[0].value"
  //   claimedBaseValue — the corrected value (already back-calculated to
  //            base IL if the data is rarity-scaled)
  //   title  — user-facing report title, 3–200 chars
  //
  // Optional fields:
  //   rarityScalingRule — "DOUBLE_STAT" / "SINGLE_STAT" / "FIXED" / null
  //   baseIL            — the IL that claimedBaseValue is stored at
  //   userObserved      — { il, value, rarity? } what the user saw in-game
  //   notes             — user's free-text comment, becomes the report
  //                       description (10–2000 chars; auto-padded server-side)
  //
  // Resolves with { ok, action, report_id, upvotes } on success.
  // Resolves with { ok:false, error } on RPC failure.
  function submitCorrection(opts) {
    opts = opts || {};

    // Allowlist guard: refuse to submit corrections for protected fields.
    // Mirrors NEVER_EDIT_FIELDS in toon-forge.html. This is a belt-and-
    // suspenders check — the correction modal UI already hides pencils for
    // these fields, but a direct call to submitCorrection must also be safe.
    var NEVER_EDIT = new Set([
      "id",
      "powerRef", "combatRef", "equipRef", "enhancementRef", "bonusRef",
      "source_version", "effects"
    ]);
    if (opts.field && NEVER_EDIT.has(opts.field)) {
      return Promise.resolve({ ok: false, error: "This field is not user-correctable." });
    }

    // Defensive: refuse zero-change submissions. The Toon Forge modal
    // (_ccSaveField) already guards against this, but a direct caller
    // could submit identical old/new values and create a noise report
    // (see Won't-Fix Report #31). When userObserved.old === .new after
    // normalization, treat it as a no-op.
    if (opts.userObserved && typeof opts.userObserved === "object") {
      var oldV = opts.userObserved.old;
      var newV = opts.userObserved.new;
      var same = oldV === newV;
      if (!same && oldV != null && newV != null) {
        var oldS = String(oldV).trim();
        var newS = String(newV).trim();
        var oldN = Number(oldS), newN = Number(newS);
        if (oldS !== "" && newS !== "" && isFinite(oldN) && isFinite(newN)) {
          same = Math.round(oldN * 10000) === Math.round(newN * 10000);
        } else if (typeof oldV === "object" || typeof newV === "object") {
          try { same = JSON.stringify(oldV) === JSON.stringify(newV); } catch (e) { same = false; }
        } else {
          same = oldS === newS;
        }
      }
      if (same) {
        return Promise.resolve({ ok: false, error: "No change to submit — old and new values are identical." });
      }
    }

    var sb = sbClient();
    if (!sb) return Promise.resolve({ ok: false, error: "supabase client not loaded" });

    var fpParts = [
      "v1",                              // schema version
      opts.type,
      opts.id,
      opts.field,
      opts.rarityScalingRule || "",
      _normalizeNumber(opts.claimedBaseValue)
    ];

    return fingerprint(fpParts).then(function (fp) {
      var payload = {
        type:              opts.type,
        id:                opts.id,
        field:             opts.field,
        rarityScalingRule: opts.rarityScalingRule || null,
        baseIL:            opts.baseIL || null,
        claimedBaseValue:  opts.claimedBaseValue,
        userObserved:      opts.userObserved || null,
        submittedAt:       new Date().toISOString()
      };
      return sb.rpc("submit_data_correction", {
        p_fingerprint: fp,
        p_payload:     payload,
        p_voter_hash:  getVoterHash(),
        p_title:       opts.title,
        p_description: opts.notes || null
      });
    }).then(function (res) {
      if (res && res.error) return { ok: false, error: res.error.message || String(res.error) };
      var data = (res && res.data) || {};
      var result = {
        ok:        true,
        action:    data.action,
        report_id: data.report_id,
        upvotes:   data.upvotes
      };
      // When the RPC returns a report_id, stamp it onto the stored override entry
      // so runReconciliation() can later match this correction against its report.
      // setOverride is called with (key, existingValue, existingOriginalSourceValue,
      // reportId) — but we only know the key here, not the stored value. Passing
      // undefined for value/originalSourceValue triggers the deletion path, so
      // we guard: only call when there IS a stored entry to update.
      if (result.report_id && opts.type && opts.id != null && opts.field) {
        var overrideKey = opts.type + ":" + opts.id + ":" + opts.field;
        var existing = getAllOverrides()[overrideKey];
        if (existing) {
          setOverride(overrideKey, existing.value, existing.originalSourceValue, result.report_id);
        }
      }
      return result;
    }).catch(function (err) {
      return { ok: false, error: (err && err.message) || String(err) };
    });
  }

  function _normalizeNumber(v) {
    if (v === null || v === undefined || v === "") return "";
    var n = Number(v);
    if (Number.isNaN(n)) return String(v);
    // Round to 4 decimals to absorb floating-point noise across browsers.
    return String(Math.round(n * 10000) / 10000);
  }

  // ---- localStorage overrides --------------------------------------
  // Keyed by an opaque string the engine constructs (e.g.
  // `companion_power:160:stats[0].value`). Stores the user's locally-
  // applied value so the prototype reflects their correction before any
  // admin merges it into source JSON.
  var OVERRIDES_KEY = "nwcb_data_overrides";

  function getAllOverrides() {
    try {
      var raw = localStorage.getItem(OVERRIDES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  // setOverride(key, value, originalSourceValue, reportId?)
  //   reportId (optional) — the Supabase report id returned by submit_missing_item_report
  //   or submit_data_correction, stored so runReconciliation() can match this
  //   override against its server-side report when checking for Fixed/Won't Fix status.
  //   Passing reportId on an existing entry updates it in-place; existing entries
  //   without a reportId are unaffected (backward compatible — 3-arg callers work fine).
  function setOverride(key, value, originalSourceValue, reportId) {
    var all = getAllOverrides();
    if (value === null || value === undefined) {
      delete all[key];
    } else {
      // Preserve the originalSourceValue across re-edits — only capture
      // it the first time we override this field. That value is the
      // "source snapshot" we compare against later to detect when an
      // admin has corrected the source JSON; if source changes, we
      // drop the override and trust the new source.
      var existing = all[key];
      var entry = { value: value, savedAt: new Date().toISOString() };
      if (existing && existing.originalSourceValue !== undefined) {
        entry.originalSourceValue = existing.originalSourceValue;
      } else if (originalSourceValue !== undefined && originalSourceValue !== null) {
        entry.originalSourceValue = originalSourceValue;
      }
      // Preserve an existing reportId if the caller doesn't supply a new one.
      if (reportId !== undefined && reportId !== null) {
        entry.reportId = reportId;
      } else if (existing && existing.reportId !== undefined) {
        entry.reportId = existing.reportId;
      }
      all[key] = entry;
    }
    try {
      localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all));
    } catch (e) { /* full or blocked — silently no-op */ }
  }

  function getOverride(key) {
    var all = getAllOverrides();
    var entry = all[key];
    return entry ? entry.value : undefined;
  }

  function getOverrideEntry(key) {
    var all = getAllOverrides();
    return all[key] || null;
  }

  // Loose value equality — numbers compare numerically, others as strings.
  // Used to detect whether the source JSON has been corrected since the
  // user's override was saved.
  function _valuesEqual(a, b) {
    if (a === b) return true;
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    var na = Number(a), nb = Number(b);
    if (Number.isFinite(na) && Number.isFinite(nb)) return na === nb;
    return String(a) === String(b);
  }

  // Read the current source value of a field on a raw (pre-override) item.
  // Mirrors _applyFieldOverride's resolution rules but reads instead of writes.
  function _readFieldValue(obj, field) {
    if (!obj || !field) return undefined;
    if (Object.prototype.hasOwnProperty.call(obj, field)) return obj[field];
    if (obj.ratingStats && Object.prototype.hasOwnProperty.call(obj.ratingStats, field)) return obj.ratingStats[field];
    if (obj.percentStats && Object.prototype.hasOwnProperty.call(obj.percentStats, field)) return obj.percentStats[field];
    if (Array.isArray(obj.stats)) {
      for (var i = 0; i < obj.stats.length; i++) {
        if (obj.stats[i] && obj.stats[i].stat === field) return obj.stats[i].value;
      }
    }
    if (field.indexOf(".") >= 0 || field.indexOf("[") >= 0) {
      var parts = field.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
      var cur = obj;
      for (var j = 0; j < parts.length; j++) {
        if (cur == null) return undefined;
        cur = cur[parts[j]];
      }
      return cur;
    }
    var lower = field.toLowerCase();
    var keys = Object.keys(obj);
    for (var k = 0; k < keys.length; k++) {
      if (keys[k].toLowerCase() === lower) return obj[keys[k]];
    }
    if (obj.ratingStats) {
      var rk = Object.keys(obj.ratingStats);
      for (var a = 0; a < rk.length; a++) {
        if (rk[a].toLowerCase() === lower) return obj.ratingStats[rk[a]];
      }
    }
    if (obj.percentStats) {
      var pk = Object.keys(obj.percentStats);
      for (var b = 0; b < pk.length; b++) {
        if (pk[b].toLowerCase() === lower) return obj.percentStats[pk[b]];
      }
    }
    return undefined;
  }

  function clearAllOverrides() {
    try { localStorage.removeItem(OVERRIDES_KEY); } catch (e) {}
  }

  // ---- engine integration ------------------------------------------
  // applyOverridesToItem(type, item)
  //   Returns a possibly-cloned copy of `item` with any locally-saved
  //   overrides applied. The find* functions in toon-forge wrap their
  //   return values with this so the engine + UI naturally pick up the
  //   user's pending corrections without needing to consult overrides
  //   at every read site.
  //
  // Override key format: `${type}:${id}:${field}` where `field` is the
  // free-form text the user typed in the correction modal — we try to
  // resolve it against the item's structure in this order:
  //   1) Top-level key matching `field` exactly (e.g. "item_level")
  //   2) ratingStats[field]
  //   3) percentStats[field]
  //   4) stats[].stat === field → write to that entry's .value
  //   5) Dotted/bracket path (e.g. "stats[0].value")
  //   6) Case-insensitive variants of 1–4
  function applyOverridesToItem(type, item) {
    if (!item || !type || item.id === undefined || item.id === null) return item;
    var all = getAllOverrides();
    var prefix = type + ":" + item.id + ":";
    var keys = Object.keys(all).filter(function (k) { return k.indexOf(prefix) === 0; });
    if (!keys.length) return item;

    var clone = null;
    var anyApplied = false;
    keys.forEach(function (k) {
      var field = k.slice(prefix.length);
      var entry = all[k];
      if (!entry) return;
      // If we snapshotted the source value at override time, compare it
      // against the current source value. A mismatch means an admin has
      // corrected the source JSON since the player saved their override
      // — trust the new source, clear the override, and let the new
      // source value flow through unchanged.
      if (entry.originalSourceValue !== undefined && entry.originalSourceValue !== null) {
        var currentSource = _readFieldValue(item, field);
        if (currentSource !== undefined && !_valuesEqual(entry.originalSourceValue, currentSource)) {
          setOverride(k, null);  // clears it from localStorage
          return;
        }
      }
      // Lazy-clone so we don't pay deep-copy cost for items with no
      // surviving overrides.
      if (!clone) clone = JSON.parse(JSON.stringify(item));
      _applyFieldOverride(clone, field, entry.value);
      anyApplied = true;
    });

    if (clone && anyApplied) {
      clone.__overridden = true;  // marker for UI badges if desired
      return clone;
    }
    return item;
  }

  function _applyFieldOverride(obj, field, value) {
    var coerced = _coerceNumberIfPossible(value);
    // 1) Direct top-level
    if (Object.prototype.hasOwnProperty.call(obj, field)) {
      obj[field] = coerced; return true;
    }
    // 2 / 3) ratingStats / percentStats
    if (obj.ratingStats && Object.prototype.hasOwnProperty.call(obj.ratingStats, field)) {
      obj.ratingStats[field] = coerced; return true;
    }
    if (obj.percentStats && Object.prototype.hasOwnProperty.call(obj.percentStats, field)) {
      obj.percentStats[field] = coerced; return true;
    }
    // 4) stats[].stat === field
    if (Array.isArray(obj.stats)) {
      for (var i = 0; i < obj.stats.length; i++) {
        if (obj.stats[i] && obj.stats[i].stat === field) {
          obj.stats[i].value = coerced;
          return true;
        }
      }
    }
    // 5) Dotted / bracket path
    if (field.indexOf(".") >= 0 || field.indexOf("[") >= 0) {
      return _setByPath(obj, field, coerced);
    }
    // 6) Case-insensitive retry
    var lower = field.toLowerCase();
    var keys = Object.keys(obj);
    for (var j = 0; j < keys.length; j++) {
      if (keys[j].toLowerCase() === lower) {
        obj[keys[j]] = coerced; return true;
      }
    }
    if (obj.ratingStats) {
      var rk = Object.keys(obj.ratingStats);
      for (var a = 0; a < rk.length; a++) {
        if (rk[a].toLowerCase() === lower) { obj.ratingStats[rk[a]] = coerced; return true; }
      }
    }
    if (obj.percentStats) {
      var pk = Object.keys(obj.percentStats);
      for (var b = 0; b < pk.length; b++) {
        if (pk[b].toLowerCase() === lower) { obj.percentStats[pk[b]] = coerced; return true; }
      }
    }
    return false;
  }

  function _coerceNumberIfPossible(v) {
    if (typeof v === "number") return v;
    var n = Number(v);
    if (Number.isFinite(n)) return n;
    return v;
  }

  function _setByPath(obj, path, value) {
    // Accepts: "stats[0].value", "ratingStats.Power", "a.b.c"
    //
    // NOTE: walks dotted/bracketed paths. Returns false if an intermediate
    // node is null/undefined (e.g. the key doesn't exist yet). So saving
    // "procEffect.effectScaling.heal.75" when procEffect is null fails
    // silently. The toon-forge correction modal treats effectScaling as a
    // single JSON field (kind:"json") to avoid this — the override path is
    // just "procEffect.effectScaling", which has only one intermediate node
    // (procEffect itself). Don't add pencils to individual effectScaling
    // sub-values; use the JSON editor only.
    var parts = path.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
    var cur = obj;
    for (var i = 0; i < parts.length - 1; i++) {
      if (cur[parts[i]] === undefined) return false;
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
    return true;
  }

  // ---- export -------------------------------------------------------
  window.NWCBDataCorrections = {
    getVoterHash:        getVoterHash,
    fingerprint:         fingerprint,
    submitCorrection:    submitCorrection,
    getOverride:         getOverride,
    getOverrideEntry:    getOverrideEntry,
    setOverride:         setOverride,
    getAllOverrides:     getAllOverrides,
    applyOverridesToItem: applyOverridesToItem,
    clearAllOverrides: clearAllOverrides
  };
})();
