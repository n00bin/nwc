/* ============================================================
   NWC lightweight UI translation (PILOT: home page)
   ------------------------------------------------------------
   Swaps English UI text for Russian when the visitor picks RU.
   - Translations live in data/i18n-ru.js (I18N_RU + I18N_RU_COUNTS),
     keyed by the exact English string.
   - Default is English; a missing translation falls back to English,
     so a half-finished sheet never breaks a page.
   - Item NAMES are skipped automatically: any element marked
     translate="no" / .notranslate is left alone (the same guard the
     browser-translate fix uses), so names keep matching the game.

   Toggling reloads the page: English is restored cleanly from source,
   then re-translated if RU is active. No original-text bookkeeping.
   ============================================================ */
(function () {
  var LS_KEY = "nwc_lang";
  function getLang() {
    try { return localStorage.getItem(LS_KEY) === "ru" ? "ru" : "en"; }
    catch (e) { return "en"; }
  }
  function setLang(l) {
    try { localStorage.setItem(LS_KEY, l); } catch (e) {}
  }

  // Leading/trailing "decoration": whitespace, arrows, dashes, dingbats,
  // emoji-ish symbols. Stripped before matching, re-attached after, so
  // "View Preview →" and "…friendly place. ⚔" still match their keys.
  var DECO = "\\s\\u2013\\u2014\\u2190-\\u21FF\\u2600-\\u27BF\\u2B00-\\u2BFF\\uFE0F►▶◀◄»«…·";
  var SPLIT = new RegExp("^([" + DECO + "]*)([\\s\\S]*?)([" + DECO + "]*)$");

  var WSPLIT = /^(\s*)([\s\S]*?)(\s*)$/;   // just the surrounding whitespace

  function translate(text) {
    if (!text || typeof I18N_RU === "undefined") return null;
    // 1) Exact match on the whitespace-trimmed value. Keys copied verbatim
    //    from the DOM (incl. "★ …", "Search mounts...", the "…" placeholder)
    //    hit here directly; the surrounding whitespace is re-attached.
    var w = text.match(WSPLIT);
    if (w && w[2] && I18N_RU[w[2]]) return w[1] + I18N_RU[w[2]] + w[3];
    // 2) Fall back to the decoration-aware match, so decorated UI like
    //    "View Preview →" still resolves to the bare "View Preview" key.
    var m = text.match(SPLIT);
    if (!m) return null;
    var core = m[2];
    if (!core) return null;
    var ru = I18N_RU[core];
    if (!ru) return null;
    return m[1] + ru + m[3];          // keep the original decoration
  }

  // Russian plural: pick one / few / many by the number (Dark Lord's rule).
  function pluralRu(n, forms) {
    n = Math.abs(n) % 100;
    if (n >= 11 && n <= 14) return forms.many;
    var d = n % 10;
    if (d === 1) return forms.one;
    if (d >= 2 && d <= 4) return forms.few;
    return forms.many;
  }

  // Rewrite a "<number> <english-word>" count like "339 mounts".
  function ruCount(n, wordKey) {
    var forms = (typeof I18N_RU_COUNTS !== "undefined") && I18N_RU_COUNTS[wordKey];
    if (!forms) return null;
    return n + " " + pluralRu(n, forms);
  }

  // Element-id → count word, for the simple "<n> <word>" home cards.
  var COUNT_IDS = { "mount-count": "mounts", "companion-count": "companions", "buff-count": "buffs" };

  function applyCounts() {
    Object.keys(COUNT_IDS).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var m = el.textContent.match(/^\s*([\d,]+)\s+(.+)$/);
      if (!m) return;
      var out = ruCount(parseInt(m[1].replace(/,/g, ""), 10), COUNT_IDS[id]);
      if (out) el.textContent = out;
    });
    // "140 artifacts & 38 sets" — two numbers, joined with Russian "и".
    var a = document.getElementById("artifact-count");
    if (a) {
      var am = a.textContent.match(/^\s*([\d,]+)\D+?([\d,]+)/);
      if (am) {
        var arts = ruCount(parseInt(am[1].replace(/,/g, ""), 10), "artifacts");
        var sets = ruCount(parseInt(am[2].replace(/,/g, ""), 10), "sets");
        if (arts && sets) a.textContent = arts + " и " + sets;
      }
    }
  }

  // Preview banner "<label> is live" — label may be dynamic, so translate
  // the two parts separately (label via the map if known, else left as-is).
  function applyPreviewBanner() {
    var el = document.getElementById("preview-banner-label");
    if (!el) return;
    var t = el.textContent.replace(/\s+$/, "");
    var suffix = " is live";
    if (t.slice(-suffix.length) === suffix && typeof I18N_RU !== "undefined") {
      var label = t.slice(0, -suffix.length);
      el.textContent = (I18N_RU[label] || label) + " " + (I18N_RU[suffix.trim()] || suffix.trim());
    }
  }

  // True if the element (or any ancestor) is <script>/<style> or an
  // opted-out translate="no" / .notranslate subtree — i.e. item names.
  function inNoTranslate(el) {
    for (var e = el; e; e = e.parentElement) {
      var tag = e.tagName;
      if (tag === "SCRIPT" || tag === "STYLE") return true;
      if (e.getAttribute && (e.getAttribute("translate") === "no" ||
          (e.classList && e.classList.contains("notranslate")))) return true;
    }
    return false;
  }

  // Walk visible text nodes and translate exact matches. Skips <script>,
  // <style>, and any translate="no" / .notranslate subtree (item names).
  function sweep(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return inNoTranslate(n.parentElement) ? NodeFilter.FILTER_REJECT
                                              : NodeFilter.FILTER_ACCEPT;
      }
    });
    var pending = [], node;
    while ((node = walker.nextNode())) {
      var ru = translate(node.nodeValue);
      if (ru !== null && ru !== node.nodeValue) pending.push([node, ru]);
    }
    pending.forEach(function (p) { p[0].nodeValue = p[1]; });
  }

  // Attributes that hold user-facing text: search placeholders, tooltips.
  // (Text-node sweep can't reach these — they're not text nodes.)
  var ATTRS = ["placeholder", "title", "aria-label"];
  function sweepAttrs(root) {
    if (!root.querySelectorAll) return;
    var els = root.querySelectorAll("[placeholder],[title],[aria-label]");
    var list = root.matches && root.matches("[placeholder],[title],[aria-label]")
      ? [root].concat(Array.prototype.slice.call(els))
      : Array.prototype.slice.call(els);
    list.forEach(function (el) {
      if (inNoTranslate(el)) return;
      ATTRS.forEach(function (a) {
        if (!el.hasAttribute(a)) return;
        var v = el.getAttribute(a);
        var ru = translate(v);
        if (ru !== null && ru !== v) el.setAttribute(a, ru);
      });
    });
  }

  // Whole-element fallback for sentences broken up by inline markup, e.g.
  // "<li><strong>Click …</strong> for each loadout…</li>" — the text-node
  // sweep sees two fragments and can't match the full key. Only fires on
  // long keys (>=40 chars) so no short generic word (Notes/Type/DPS) can be
  // matched here; replacing textContent drops the inline <strong> bolding.
  function sweepBlocks(root) {
    if (!root.querySelectorAll) return;
    var els = root.querySelectorAll("li,p,button,span,label,td,th,div,a");
    Array.prototype.forEach.call(els, function (el) {
      if (!el.children || el.children.length === 0) return;   // not fragmented
      if (inNoTranslate(el)) return;
      var key = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (key.length < 40) return;
      var ru = I18N_RU[key];
      if (ru) el.textContent = ru;
    });
  }

  // Re-translate content that pages render AFTER load (mount list, detail
  // panel, planner, pickers — all via innerHTML). We observe only childList,
  // never characterData/attributes, so our own writes can't re-trigger it.
  var observer = null;
  function startObserver() {
    if (observer || typeof MutationObserver === "undefined" || !document.body) return;
    observer = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var n = added[j];
          if (n.nodeType === 1) { sweep(n); sweepAttrs(n); sweepBlocks(n); }
          else if (n.nodeType === 3) {
            var ru = translate(n.nodeValue);
            if (ru !== null && ru !== n.nodeValue) n.nodeValue = ru;
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Public: translate the whole page (or a subtree after dynamic render).
  window.applyI18n = function (root) {
    if (getLang() !== "ru") return;
    try {
      var r = root || document.body;
      sweep(r);
      sweepAttrs(r);
      sweepBlocks(r);
      if (!root) { applyCounts(); applyPreviewBanner(); }
      document.documentElement.setAttribute("lang", "ru");
    } catch (e) { /* never let translation break the page */ }
  };

  // Small EN | RU switch dropped into the navbar.
  function mountToggle() {
    var nav = document.querySelector(".navbar");
    if (!nav || document.getElementById("nwc-lang-toggle")) return;
    var lang = getLang();
    var box = document.createElement("div");
    box.id = "nwc-lang-toggle";
    box.style.cssText = "display:inline-flex;gap:0.15rem;align-items:center;margin-left:auto;font-size:0.8rem;";
    ["en", "ru"].forEach(function (l) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = l.toUpperCase();
      var on = lang === l;
      b.style.cssText = "cursor:pointer;border:1px solid var(--border-default);background:" +
        (on ? "var(--accent)" : "transparent") + ";color:" + (on ? "#fff" : "var(--text-secondary)") +
        ";padding:0.15rem 0.45rem;border-radius:4px;font-weight:600;line-height:1;";
      b.addEventListener("click", function () {
        if (getLang() === l) return;
        setLang(l);
        location.reload();
      });
      box.appendChild(b);
    });
    nav.appendChild(box);
  }

  function boot() {
    mountToggle();
    if (getLang() === "ru") startObserver();   // catch content rendered after load
    window.applyI18n();
  }
  if (document.readyState === "complete") boot();
  else window.addEventListener("load", boot);
})();
