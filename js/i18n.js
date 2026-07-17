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

  function translate(text) {
    if (!text) return null;
    var m = text.match(SPLIT);
    if (!m) return null;
    var core = m[2];
    if (!core) return null;
    var ru = (typeof I18N_RU !== "undefined") && I18N_RU[core];
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

  // Walk visible text nodes and translate exact matches. Skips <script>,
  // <style>, and any translate="no" / .notranslate subtree (item names).
  function sweep(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        for (var e = n.parentElement; e; e = e.parentElement) {
          var tag = e.tagName;
          if (tag === "SCRIPT" || tag === "STYLE") return NodeFilter.FILTER_REJECT;
          if (e.getAttribute && (e.getAttribute("translate") === "no" ||
              (e.classList && e.classList.contains("notranslate")))) return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var pending = [], node;
    while ((node = walker.nextNode())) {
      var ru = translate(node.nodeValue);
      if (ru !== null && ru !== node.nodeValue) pending.push([node, ru]);
    }
    pending.forEach(function (p) { p[0].nodeValue = p[1]; });
  }

  // Public: translate the whole page (or a subtree after dynamic render).
  window.applyI18n = function (root) {
    if (getLang() !== "ru") return;
    try {
      sweep(root || document.body);
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

  function boot() { mountToggle(); window.applyI18n(); }
  if (document.readyState === "complete") boot();
  else window.addEventListener("load", boot);
})();
