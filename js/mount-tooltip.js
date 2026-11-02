/*
 * mount-tooltip.js — a mount power's tooltip text with its numbers tied to the table rows
 * (gaps J-10 + J-2, 2026-11-02). One copy, used by mounts.html and scripts/gen-item-pages.js.
 *
 * Data (../data/mount_combat_powers.json, mount_equip_powers.json):
 *   tooltip        the game's own words, numbers exactly as the game showed them. "" = no text box.
 *   tooltipIL      the item level the text was read at (3000 Mythic, 3937 Celestial, 3500 Mount
 *                  Preview, 2000 Legendary, ...). Mount powers scale with item level / 3000.
 *   tooltipTagged  numbers that change with tier but have no table row: they stay as written and
 *                  get a grey "(at Mythic)" style tag when the page shows another tier.
 * `notes` is internal and is never shown.
 *
 * A number in the text that equals a table row (at tooltipIL) is replaced by that row's value at the
 * tier being shown, so the text and the table can never disagree.
 */
(function (root) {
  var TIER_MULT = { Mythic: 1, Celestial: 1.3125 };

  function ilMult(il) {
    if (!il) return 1;
    return il === 3937 ? 1.3125 : il / 3000;
  }
  function ilLabel(il) {
    if (!il || il === 3000) return "Mythic";
    if (il === 3937) return "Celestial";
    if (il === 2000) return "Legendary";
    return "IL " + Number(il).toLocaleString("en-US");
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function round1(x) {
    var r = Math.round(x * 10) / 10;
    return r === Math.round(r) ? Math.round(r) : r;
  }

  // Table rows at the power's anchor: [{v, pct}]
  function rowsOf(p, kind) {
    var r = [];
    if (kind === "combat") {
      if (p.magnitude) r.push({ v: Math.abs(p.magnitude), pct: false });
      (p.equipBonuses || []).forEach(function (b) {
        if (b.amount != null) r.push({ v: Math.abs(b.amount), pct: true });
        if (b.roleMap) Object.keys(b.roleMap).forEach(function (k) {
          var a = b.roleMap[k] && b.roleMap[k].amount;
          if (a != null) r.push({ v: Math.abs(a), pct: true });
        });
      });
    } else {
      (p.stats || []).forEach(function (s) {
        if (s.value != null) r.push({ v: Math.abs(s.value), pct: s.type === "percent" });
      });
      var sb = p.stackingBuff;
      if (sb && sb.perStack && !sb.flatPerStack) Object.keys(sb.perStack).forEach(function (k) {
        var v = sb.perStack[k];
        if (v != null) r.push({ v: Math.abs(v), pct: Math.abs(v) <= 100 });
      });
    }
    return r;
  }

  var NUM = /([+-]?)(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)(%?)/g;

  // Parse the text into pieces: {text} or {num, sign, value, pct, row (index or -1), tagged}
  function analyse(p, kind) {
    var text = p.tooltip || "";
    var rows = rowsOf(p, kind);
    var anchorMult = TIER_MULT[p.anchorRarity] || 1;
    var readMult = ilMult(p.tooltipIL || (p.anchorRarity === "Celestial" ? 3937 : 3000));
    var tagged = p.tooltipTagged || [];
    var out = [], last = 0, m;
    NUM.lastIndex = 0;
    while ((m = NUM.exec(text))) {
      var raw = m[0], v = parseFloat(m[2].replace(/,/g, "")), pct = !!m[3];
      var nextCh = text.charAt(m.index + raw.length);
      var unit = (!pct && nextCh === "s" && !/[a-z]/i.test(text.charAt(m.index + raw.length + 1))) ? "s" : "";
      var row = -1;
      // seconds ("10s") and distances ("25'") never link
      if (pct || !/[s']/.test(nextCh)) {
        for (var i = 0; i < rows.length; i++) {
          if (rows[i].pct !== pct) continue;
          var at = rows[i].v * readMult / anchorMult;
          if (pct ? Math.abs(round1(at) - v) < 0.051 : Math.abs(Math.round(at) - v) <= 1) { row = i; break; }
        }
      }
      if (m.index > last) out.push({ text: text.slice(last, m.index) });
      // A tag names the number plus its unit: "460", "60%", "3s" (a stun of 3 seconds).
      var key = raw.replace(/^[+-]/, "") + unit;
      out.push({ num: raw + unit, key: key, sign: m[1], value: v, pct: pct, row: row, rowV: row >= 0 ? rows[row].v : null,
                 tagged: row < 0 && tagged.indexOf(key) !== -1 });
      last = m.index + raw.length + unit.length;
      NUM.lastIndex = last;
    }
    if (last < text.length) out.push({ text: text.slice(last) });
    return { pieces: out, anchorMult: anchorMult, readMult: readMult };
  }

  function fmtNum(x, pct) {
    if (pct) return String(round1(x));
    return Math.round(x).toLocaleString("en-US");
  }

  // HTML for the text at a display tier ("Mythic" | "Celestial").
  function mountTooltipHtml(p, kind, showTier) {
    if (!p || !p.tooltip) return "";
    var a = analyse(p, kind);
    var showMult = TIER_MULT[showTier] || 1;
    var sameTier = Math.abs(showMult - a.readMult) < 1e-9;
    var html = "";
    a.pieces.forEach(function (pc) {
      if (pc.text != null) { html += esc(pc.text); return; }
      if (pc.row >= 0) {
        html += esc(pc.sign + fmtNum(pc.rowV * showMult / a.anchorMult, pc.pct) + (pc.pct ? "%" : ""));
      } else {
        html += esc(pc.num);
        if (pc.tagged && !sameTier) html += ' <span class="tt-tier">(at ' + esc(ilLabel(p.tooltipIL)) + ")</span>";
      }
    });
    return html;
  }

  var api = { mountTooltipHtml: mountTooltipHtml, analyse: analyse, ilLabel: ilLabel, ilMult: ilMult };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.mountTooltipHtml = mountTooltipHtml;
})(this);
