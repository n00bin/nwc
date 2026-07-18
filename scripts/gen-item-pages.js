#!/usr/bin/env node
/* Generates one static, SEO-indexable HTML page per item for the flat/
 * self-contained data types (Phase 1). Run from the website dir:
 *   node scripts/gen-item-pages.js
 * Reads source JSON from ../data/*.json (+ artisans from data/artisans.js),
 * writes pages under ./db/<type>/, per-type index.html, and a sitemap index.
 * No scaling / ref-resolution here — those types (companions, mounts,
 * insignias) are Phase 2 and rendered by a separate step. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const WEB = path.resolve(__dirname, '..');          // .../website
const SRC = path.resolve(WEB, '..', 'data');        // parent repo /data (JSON source of truth)
const ROOT = 'https://n00bin.github.io/nwc/';
const BUILD_DATE = new Date().toISOString().slice(0, 10);   // sitemap <lastmod> stamp for this build
const OGIMG = ROOT + 'og-image.png';

/* ---------- ported helpers (kept faithful to js/shared.js) ---------- */
function esc(s) {
  if (s == null) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
// Mirrors noTranslate()/nameHtml() in js/shared.js — keeps item names in
// English when a browser auto-translates the page, so they still match the
// player's (English-only) console client. See the note in js/shared.js.
function nt(html) { return html == null || html === '' ? '' : '<span translate="no" class="notranslate">' + html + '</span>'; }
function ntName(s) { return nt(esc(s)); }
function fmt(n) { return n == null ? '—' : Number(n).toLocaleString('en-US'); }
function slugify(s) {
  return String(s).toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'item';
}
const STAT_DISPLAY_NAMES = {
  "Power":"Power","CriticalStrike":"Critical Strike","Critical Strike":"Critical Strike","CriticalSeverity":"Critical Severity","Critical Severity":"Critical Severity","CombatAdvantage":"Combat Advantage","Combat Advantage":"Combat Advantage","Accuracy":"Accuracy","AccuracyReduction":"Accuracy Reduction","Accuracy Reduction":"Accuracy Reduction","Defense":"Defense","DefenseReduction":"Defense Reduction","Defense Reduction":"Defense Reduction","Awareness":"Awareness","CriticalAvoidance":"Critical Avoidance","Critical Avoidance":"Critical Avoidance","Deflect":"Deflect","DeflectSeverity":"Deflect Severity","Deflect Severity":"Deflect Severity","DamageResistance":"Damage Resistance","Damage Resistance":"Damage Resistance","DamageTakenReduction":"Damage Taken Reduction","Damage Taken Reduction":"Damage Taken Reduction","IncomingDamage":"Incoming Damage","Incoming Damage":"Incoming Damage","IncomingDamageReduction":"Incoming Damage Reduction","Incoming Damage Reduction":"Incoming Damage Reduction","ControlBonus":"Control Bonus","Control Bonus":"Control Bonus","ControlResist":"Control Resist","Control Resist":"Control Resist","Forte":"Forte","MaximumHitPoints":"Maximum Hit Points","Maximum Hit Points":"Maximum Hit Points","CombinedRating":"Combined Rating","Combined Rating":"Combined Rating","ActionPointGain":"Action Point Gain","Action Point Gain":"Action Point Gain","RechargeSpeed":"Recharge Speed","Recharge Speed":"Recharge Speed","MovementSpeed":"Movement Speed","Movement Speed":"Movement Speed","StaminaRegeneration":"Stamina Regeneration","Stamina Regeneration":"Stamina Regeneration","Stamina Restore":"Stamina Restore","Stamina":"Stamina","MovementDebuff":"Movement Debuff","Movement Debuff":"Movement Debuff","OutgoingHealing":"Outgoing Healing","Outgoing Healing":"Outgoing Healing","IncomingHealing":"Incoming Healing","Incoming Healing":"Incoming Healing","OverallOutgoingHealing":"Overall Outgoing Healing","Overall Outgoing Healing":"Overall Outgoing Healing","Heal And Damage":"Heal And Damage","Heal Percent":"Heal Percent","CriticalSeverityReduction":"Critical Severity Reduction","Critical Severity Reduction":"Critical Severity Reduction","OutgoingDamage":"Outgoing Damage","Outgoing Damage":"Outgoing Damage","DamageBonus":"Damage Bonus","Damage Bonus":"Damage Bonus","DmgBonus":"Dmg Bonus","Dmg Bonus":"Dmg Bonus","CompanionDamageBoost":"Companion Damage Boost","Companion Damage Boost":"Companion Damage Boost","ClassResourceRegen":"Class Resource Regen","Class Resource Regen":"Class Resource Regen","DivinityRegen":"Divinity Regen","Divinity Regen":"Divinity Regen","SoulweaveRegen":"Soulweave Regen","Soulweave Regen":"Soulweave Regen","PerformanceRegen":"Performance Regen","Performance Regen":"Performance Regen"
};
function statName(k) {
  if (!k) return k;
  if (STAT_DISPLAY_NAMES[k] !== undefined) return STAT_DISPLAY_NAMES[k];
  return String(k).replace(/([a-z])([A-Z])/g, '$1 $2');
}
const AUDIT_TRAIL_PATTERNS = [
  /\s*Stored at Mythic.*?\.(?:\s|$)/gi, /\s*Re-verified(?:\s+in-game)? \d{4}-\d{2}-\d{2}.*?\.(?:\s|$)/gi,
  /\s*(?:In-game )?(?:re-)?verified \d{4}-\d{2}-\d{2}.*?\.(?:\s|$)/gi, /\s*In-game confirmed \d{4}-\d{2}-\d{2}.*?\.(?:\s|$)/gi,
  /\s*Recalibrated \d{4}-\d{2}-\d{2}.*?\.(?:\s|$)/gi, /\s*Corrected \d{4}-\d{2}-\d{2}.*?\.(?:\s|$)/gi,
  /\s*The earlier \d{4}-\d{2}-\d{2}.*?\.(?:\s|$)/gi, /\s*The notes claim of .*?\.(?:\s|$)/gi,
  /\s*Standard \w+-tier \w+ power with intrinsically.*?\.(?:\s|$)/gi, /\s*Previously-stored values?.*?\.(?:\s|$)/gi,
  /\s*Previous stored value.*?\.(?:\s|$)/gi, /\s*Source:?\s*confirmed by n00b.*?\.(?:\s|$)/gi,
  /\s*Source from NW Hub.*?\.(?:\s|$)/gi, /\s*Power data confirmed by n00b.*?\.(?:\s|$)/gi,
  /\s*confirmed by n00b \d{4}-\d{2}-\d{2}.*?\.(?:\s|$)/gi, /\s*\(Mythic-\d+%-bolster baseline\)/gi,
  /\s*\[[^\]]*verified[^\]]*\]/gi, /\s*[\d.]+%?\s*vs Bosses @ IL[\s\S]*$/gi,
  /\s*Orphan duplicate[\s\S]*$/gi, /\s*Report #\d+\s*[—–-][\s\S]*$/gi,
  /(?:^|\s)[^.!?]*screenshots?\b[^.!?]*(?:[.!?]+|$)/gi
];
function cleanNotes(str) {
  if (!str) return '';
  var s = String(str).split(/\s*\|\s*normalized:/i)[0]  // drop internal "| normalized: ..." tails
    .replace(/^Screenshot (?:intake|confirmed|reconciliation) \(Mount Preview(?:, scrolled)?\)[.:]\s*/i, 'Tooltip: ')
    .replace(/^Screenshot (?:intake|confirmed|reconciliation) \(Inspect Companion\)[.:]\s*/i, 'Tooltip: ')
    .replace(/^Screenshot (?:intake|confirmed|reconciliation)[.:]\s*/i, '').replace(/^Tooltip:\s*$/i, '');
  for (var i = 0; i < AUDIT_TRAIL_PATTERNS.length; i++) s = s.replace(AUDIT_TRAIL_PATTERNS[i], '');
  s = s.replace(/\s+/g, ' ').trim();
  // If what's left still reads like internal reconciliation prose, drop it.
  if (/reconciliation|placeholder|ledger|baseline|IL set to|was\s+\d/i.test(s)) return '';
  return s;
}
// Cleaned free text for display, or '' if it still looks like internal provenance.
function showText(s) {
  var d = cleanNotes(s);
  if (!d) return '';
  if (/screenshot|report\s*#|verified|reconcil|placeholder|ledger|\d{4}-\d{2}-\d{2}/i.test(d)) return '';
  return d;
}

/* ---------- stat/effect rendering (uses site classes) ---------- */
function statsRows(obj, type) {
  if (!obj) return '';
  var keys = Object.keys(obj).filter(function (k) { return obj[k] !== 0 && obj[k] != null; });
  if (!keys.length) return '';
  return keys.map(function (k) {
    var v = obj[k];
    var pct = type === 'percent';
    var cls = v > 0 ? 'stat-positive' : v < 0 ? 'stat-negative' : 'stat-neutral';
    var val = (v > 0 ? '+' : '') + (pct ? v + '%' : fmt(v));
    return '<div class="stat-row"><span class="stat-name">' + esc(statName(k)) + '</span><span class="stat-value ' + cls + '">' + esc(val) + '</span></div>';
  }).join('');
}
function statsBlock(item) {
  var r = statsRows(item.ratingStats, 'rating') + statsRows(item.percentStats, 'percent') + statsRows(item.abilityBonuses, 'rating');
  return r ? '<div class="item-sec"><h2>Stats</h2>' + r + '</div>' : '';
}
// Per-entry display text: cleaned prose, else synthesized from stat/amount.
function equipBonusEffectText(b) {
  // description -> effectText -> synthesized. Overload equip bonuses carry their
  // zone-conditional prose in `effectText` (no `description`), so without the
  // effectText fallback the page synthesized a bare "+5% Dmg Bonus" line that
  // hid the "in Thay"/"in Wildspace" qualifier and read as an always-on bonus.
  // Guard to strings: `condition` (and occasionally other fields) can be a
  // structured object (e.g. {distance_ft_max:25}) that would stringify to
  // "[object Object]" — so we only fall back to effectText when it's a string.
  var dt = showText(b.description);
  if (!dt && typeof b.effectText === 'string') dt = showText(b.effectText);
  if (!dt && b.stat != null && typeof b.amount === 'number') {
    // structured-only entries (no prose) — synthesize from stat/amount.
    // Percent is the default; kind:"rating"/"flat" marks plain numbers.
    var isPct = b.isPercent === true || !b.kind;
    dt = (b.stacking && b.stacking.notes) ? b.stacking.notes
      : (b.amount > 0 ? '+' : '') + (isPct ? b.amount + '%' : fmt(b.amount)) + ' ' + statName(b.stat);
  }
  return dt || '';
}
function equipBlock(list) {
  if (!Array.isArray(list) || !list.length) return '';
  // Group entries by name so a multi-stat bonus stored as one entry per stat
  // (e.g. Eagle's Mastery = Power + Crit Strike + Crit Severity) renders its
  // shared name + description ONCE — mirrors the live Toon Forge gear card's
  // _equipBonusSection. Distinct effect lines within a name are de-duped, so a
  // repeated description collapses but a genuine multi-line bonus keeps its lines.
  // Unnamed entries stay individual (a fallback heading could merge unrelated
  // bonuses), preserving prior behavior.
  var byName = {};
  list.forEach(function (b) { if (b && b.name) { (byName[b.name] = byName[b.name] || []).push(b); } });
  var emitted = {}, blocks = [];
  list.forEach(function (b) {
    if (!b) return;
    if (b.name) {
      if (emitted[b.name]) return;       // group already rendered at first sight
      emitted[b.name] = true;
      var effects = [], seenTxt = {};
      byName[b.name].forEach(function (e) {
        var t = equipBonusEffectText(e);
        if (t && !seenTxt[t]) { seenTxt[t] = true; effects.push(t); }
      });
      var desc = effects.map(function (t) { return '<div class="item-effect">' + esc(t) + '</div>'; }).join('');
      blocks.push('<div style="margin-bottom:0.5rem"><strong>' + ntName(b.name) + '</strong>' + desc + '</div>');
    } else {
      var t = equipBonusEffectText(b);
      if (!t) return;                    // nothing meaningful to show
      var head = esc(b.type === 'Set' ? 'Set bonus' : 'Equip bonus');
      blocks.push('<div style="margin-bottom:0.5rem"><strong>' + head + '</strong><div class="item-effect">' + esc(t) + '</div></div>');
    }
  });
  var rows = blocks.join('');
  return rows ? '<div class="item-sec"><h2>Bonuses</h2>' + rows + '</div>' : '';
}

/* ---------- page template ---------- */
function page(o) {
  // o: {type, file, title, desc, h1, sub, bodyHtml, backHref, backLabel, breadcrumb}
  var url = ROOT + 'db/' + o.type + '/' + o.file;
  var ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': ROOT + '#website', url: ROOT, name: 'Neverwinter Compendium', publisher: { '@id': ROOT + '#org' }, inLanguage: 'en' },
      { '@type': 'Organization', '@id': ROOT + '#org', name: 'The N00bin Network', url: ROOT, logo: OGIMG },
      { '@type': 'WebPage', '@id': url + '#webpage', url: url, name: o.title, description: o.desc, isPartOf: { '@id': ROOT + '#website' }, inLanguage: 'en', primaryImageOfPage: OGIMG, breadcrumb: { '@id': url + '#breadcrumb' } },
      { '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: ROOT },
        { '@type': 'ListItem', position: 2, name: o.breadcrumb, item: ROOT + o.backHref },
        { '@type': 'ListItem', position: 3, name: o.h1, item: url }
      ] }
    ]
  };
  return '<!DOCTYPE html>\n<html lang="en">\n<head>\n' +
    '  <base href="' + ROOT + '">\n' +
    '  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '  <title>' + esc(o.title) + '</title>\n' +
    '  <meta name="description" content="' + esc(o.desc) + '">\n' +
    '  <link rel="canonical" href="' + url + '">\n' +
    '  <meta property="og:type" content="website">\n  <meta property="og:site_name" content="Neverwinter Compendium">\n' +
    '  <meta property="og:title" content="' + esc(o.title) + '">\n  <meta property="og:description" content="' + esc(o.desc) + '">\n' +
    '  <meta property="og:url" content="' + url + '">\n  <meta property="og:image" content="' + OGIMG + '">\n' +
    '  <meta name="twitter:card" content="summary_large_image">\n  <meta name="twitter:title" content="' + esc(o.title) + '">\n' +
    '  <meta name="twitter:description" content="' + esc(o.desc) + '">\n  <meta name="twitter:image" content="' + OGIMG + '">\n' +
    '  <link rel="icon" type="image/svg+xml" href="favicon.svg">\n' +
    '  <link rel="stylesheet" href="css/theme.css">\n  <link rel="stylesheet" href="css/layout.css">\n' +
    '  <style>.item-wrap{max-width:900px;margin:0 auto;padding:1.25rem 1.5rem 3rem}.item-crumb{font-size:0.82rem;color:var(--text-muted);margin-bottom:0.6rem}.item-crumb a{color:var(--accent);text-decoration:none}.item-h1{font-size:1.6rem;color:var(--highlight);margin:0 0 0.25rem}.item-sub{color:var(--text-secondary);font-size:0.92rem;margin-bottom:1rem}.item-sec{background:var(--bg-surface);border:1px solid var(--border-default);border-radius:var(--radius-md);padding:0.85rem 1.1rem;margin-bottom:0.75rem}.item-sec h2{font-size:0.8rem;text-transform:uppercase;letter-spacing:0.05em;color:var(--highlight);margin:0 0 0.5rem}.stat-row{display:flex;justify-content:space-between;padding:0.22rem 0;border-bottom:1px solid var(--border-default)}.stat-row:last-child{border-bottom:none}.stat-name{color:var(--text-secondary)}.stat-value{font-weight:600}.stat-positive{color:var(--stat-positive,#3fb950)}.stat-negative{color:var(--stat-negative,#f85149)}.stat-neutral{color:var(--text-secondary)}.item-badge{display:inline-block;font-size:0.72rem;padding:0.12rem 0.5rem;border-radius:999px;background:var(--bg-elevated);border:1px solid var(--border-default);color:var(--text-secondary);margin:0 0.3rem 0.3rem 0}.item-effect{color:var(--text-secondary);line-height:1.55}.item-back{display:inline-block;margin-top:0.4rem;color:var(--accent);text-decoration:none;font-weight:600}.item-list a{color:var(--accent);text-decoration:none}.item-list li{margin:0.15rem 0}</style>\n' +
    '  <script type="application/ld+json">' + JSON.stringify(ld) + '</script>\n' +
    '</head>\n<body>\n  <nav class="navbar"></nav>\n' +
    '  <main class="item-wrap">\n' +
    '    <div class="item-crumb"><a href="index.html">Home</a> &rsaquo; <a href="' + o.backHref + '">' + esc(o.breadcrumb) + '</a> &rsaquo; ' + ntName(o.h1) + '</div>\n' +
    '    <h1 class="item-h1">' + ntName(o.h1) + '</h1>\n' +
    (o.sub ? '    <div class="item-sub">' + o.sub + '</div>\n' : '') +
    o.bodyHtml +
    '    <a class="item-back" href="' + o.backHref + '">' + esc(o.backLabel) + ' &rarr;</a>\n' +
    '  </main>\n  <script src="js/shared.js"></script>\n' +
    '  <script>if(typeof renderNav==="function"){try{renderNav("");}catch(e){}}if(typeof renderFooter==="function"){try{renderFooter();}catch(e){}}</script>\n' +
    '</body>\n</html>\n';
}

/* ---------- data loading ---------- */
function loadJSON(f) { return JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8')); }
function loadJSGlobal(relPath, varName) {
  var js = fs.readFileSync(path.join(WEB, relPath), 'utf8');
  return vm.runInNewContext(js + '\n;' + varName + ';', {});
}
function writePage(type, file, html) {
  var dir = path.join(WEB, 'db', type);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, file), html);
}

/* ---------- per-type builders ---------- */
const ARTIFACT_TYPE = { debuff: 'Group Debuff', personal: 'Personal Buff', tank: 'Tank', utility: 'Utility', damage: 'Damage' };
const urls = {}; // type -> [ {loc} ]

// Shared styling for the searchable database index pages.
const DB_IDX_STYLE = '<style>' +
  '.db-tools{display:flex;align-items:center;gap:0.75rem;margin:0 0 1rem;flex-wrap:wrap}' +
  '#dbq{flex:1 1 220px;padding:0.5rem 0.75rem;background:var(--bg-surface);border:1px solid var(--border-default);border-radius:var(--radius-md);color:var(--highlight);font-size:0.95rem}' +
  '#dbq:focus{outline:none;border-color:var(--accent)}' +
  '#dbcount{color:var(--text-muted);font-size:0.82rem;white-space:nowrap}' +
  '.db-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:0.5rem}' +
  '.db-card{display:flex;flex-direction:column;padding:0.5rem 0.7rem;background:var(--bg-surface);border:1px solid var(--border-default);border-radius:var(--radius-md);text-decoration:none;transition:border-color .15s,background .15s}' +
  '.db-card:hover{border-color:var(--accent);background:var(--bg-elevated)}' +
  '.db-card-name{color:var(--accent);font-weight:600;font-size:0.9rem;line-height:1.3}' +
  '.db-card-meta{color:var(--text-muted);font-size:0.76rem;margin-top:0.15rem}' +
  '</style>';
// A short secondary label for an index card, derived from common item fields.
function autoMeta(it) {
  if (!it || typeof it !== 'object') return '';
  var bits = [];
  var slot = it.slot || it.slotType || it.collarSlot || it.category || it.prof;
  if (slot && typeof slot === 'string') bits.push(slot.replace(/,/g, ' / '));
  else if (Array.isArray(it.roles) && it.roles.length) bits.push(it.roles.join(' / '));
  if (it.item_level) bits.push('IL ' + fmt(it.item_level));
  else if (it.tier && typeof it.tier === 'string') bits.push(it.tier);
  return bits.join(' · ');
}

function build(type, items, opts) {
  urls[type] = [];
  var entries = [];
  items.forEach(function (it, i) {
    var name = it.name || it.displayName || ('Item ' + i);
    var idPart = (it.id != null ? it.id : ('a' + i));
    var file = idPart + '-' + slugify(name) + '.html';
    var built = opts.render(it, name);
    var html = page({
      type: type, file: file,
      title: built.title, desc: built.desc, h1: name, sub: built.sub || '',
      bodyHtml: built.body, backHref: opts.backHref, backLabel: opts.backLabel, breadcrumb: opts.breadcrumb
    });
    writePage(type, file, html);
    urls[type].push(ROOT + 'db/' + type + '/' + file);
    entries.push({ name: name, file: file, meta: built.indexMeta != null ? built.indexMeta : autoMeta(it) });
  });
  // per-type index page — searchable, responsive card grid (sorted A–Z)
  entries.sort(function (a, b) { var x = a.name.toLowerCase(), y = b.name.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
  var cards = entries.map(function (e) {
    return '<a class="db-card" href="db/' + type + '/' + e.file + '" data-n="' + esc((e.name + ' ' + (e.meta || '')).toLowerCase()) + '">' +
      '<span class="db-card-name">' + ntName(e.name) + '</span>' + (e.meta ? '<span class="db-card-meta">' + esc(e.meta) + '</span>' : '') + '</a>';
  }).join('');
  var idxBody = DB_IDX_STYLE +
    '<div class="db-tools"><input id="dbq" type="search" placeholder="Filter ' + items.length + ' ' + esc(opts.breadcrumb.toLowerCase()) + '…" autocomplete="off" aria-label="Filter ' + esc(opts.breadcrumb) + '"><span id="dbcount"></span></div>' +
    '<div id="dbgrid" class="db-grid">' + cards + '</div>' +
    '<script>(function(){var q=document.getElementById("dbq"),g=document.getElementById("dbgrid"),c=document.getElementById("dbcount"),k=g.children,total=k.length,tmr;function upd(){var t=q.value.trim().toLowerCase(),n=0,i;for(i=0;i<k.length;i++){var m=!t||k[i].getAttribute("data-n").indexOf(t)>-1;k[i].style.display=m?"":"none";if(m)n++;}c.textContent=t?(n+" of "+total+" shown"):(total+" total");}q.addEventListener("input",function(){clearTimeout(tmr);tmr=setTimeout(upd,80);});upd();})();</script>';
  var idxHtml = page({
    type: type, file: 'index.html',
    title: opts.breadcrumb + ' — Neverwinter Compendium',
    desc: 'Browse every Neverwinter ' + opts.breadcrumb.toLowerCase() + ' — ' + items.length + ' searchable entries with stats and effects.',
    h1: opts.breadcrumb, sub: items.length + ' entries', bodyHtml: idxBody,
    backHref: opts.backHref, backLabel: opts.backLabel, breadcrumb: opts.breadcrumb
  });
  writePage(type, 'index.html', idxHtml);
  urls[type].push(ROOT + 'db/' + type + '/index.html');
  console.log(type + ': ' + items.length + ' pages');
}

/* Artifacts */
build('artifacts', loadJSON('artifacts.json'), {
  breadcrumb: 'Artifacts', backHref: 'artifacts.html', backLabel: 'View in the full Artifacts database',
  render: function (a, name) {
    var tl = ARTIFACT_TYPE[a.type] || a.type || '';
    var parts = [];
    if (a.power) parts.push('<div class="item-sec"><h2>Power</h2><div class="item-effect">' + esc(a.power) + '</div>' + (a.cooldown ? '<div class="item-effect" style="margin-top:0.4rem">Cooldown: ' + esc(a.cooldown) + 's</div>' : '') + '</div>');
    if (a.debuff) parts.push('<div class="item-sec"><h2>Debuff</h2><div class="item-effect">' + esc(a.debuff) + '</div></div>');
    parts.push(statsBlock(a));
    var meta = [];
    if (a.item_level) meta.push('Item Level ' + fmt(a.item_level));
    if (a.combinedRating) meta.push('Combined Rating ' + fmt(a.combinedRating));
    if (a.set) meta.push('Set: ' + esc(a.set));
    var as = showText(a.source); if (as) meta.push('Source: ' + esc(as));
    if (meta.length) parts.push('<div class="item-sec"><h2>Details</h2><div class="item-effect">' + meta.join(' · ') + '</div></div>');
    return {
      title: name + ' — Neverwinter Artifact — Compendium',
      desc: 'Neverwinter artifact ' + name + (tl ? ' (' + tl + ')' : '') + (a.power ? ': ' + String(a.power).replace(/\s+/g, ' ').slice(0, 110) : '') + '.',
      sub: tl ? '<span class="item-badge">' + esc(tl) + '</span>' : '',
      body: parts.join('')
    };
  }
});

/* Consumables / buffs */
build('consumables', loadJSON('buffs.json'), {
  breadcrumb: 'Consumables', backHref: 'consumables.html', backLabel: 'View in the full Consumables database',
  render: function (b, name) {
    // statsBlock only renders rating/percent/ability stats. Buffs that grant a
    // vs-enemy damage bonus carry it separately in enemyType+damagePct (e.g.
    // Wondrous White Dragon's +1% vs Dragon, Scroll of Dragon Slaying's +10%), so
    // append it as a stat row — otherwise that whole effect is dropped from the
    // detail page. Matches the "+X% vs <enemy>" chip on the consumables grid.
    var statsHtml = statsRows(b.ratingStats, 'rating') + statsRows(b.percentStats, 'percent') + statsRows(b.abilityBonuses, 'rating');
    if (b.enemyType && b.damagePct) {
      statsHtml += '<div class="stat-row"><span class="stat-name">' + esc('Damage vs ' + b.enemyType)
                +  '</span><span class="stat-value stat-positive">' + esc('+' + b.damagePct + '%') + '</span></div>';
    }
    var parts = [];
    if (statsHtml) parts.push('<div class="item-sec"><h2>Stats</h2>' + statsHtml + '</div>');
    var note = showText(b.notes);
    if (note) parts.push('<div class="item-sec"><h2>Effect</h2><div class="item-effect">' + esc(note) + '</div></div>');
    var meta = [];
    if (b.category) meta.push('Category: ' + esc(b.category));
    if (b.duration_s) meta.push('Duration: ' + fmt(b.duration_s) + 's');
    if (b.scope && b.scope !== 'self') meta.push('Scope: ' + esc(b.scope));
    if (b.exclusiveGroup && b.exclusiveGroup !== 'Other') meta.push('Only one active at a time (' + esc(b.exclusiveGroup) + ')');
    var bs = showText(b.source); if (bs) meta.push('Source: ' + esc(bs));
    if (meta.length) parts.push('<div class="item-sec"><h2>Details</h2><div class="item-effect">' + meta.join(' · ') + '</div></div>');
    return {
      title: name + ' — Neverwinter Consumable — Compendium',
      desc: 'Neverwinter consumable/buff ' + name + (note ? ': ' + note.slice(0, 110) : '') + '.',
      body: parts.join('')
    };
  }
});

/* Overloads */
build('overloads', loadJSON('overloads.json'), {
  breadcrumb: 'Overloads', backHref: 'toon-forge.html', backLabel: 'Use in Toon Forge',
  render: function (o, name) {
    var parts = [statsBlock(o), equipBlock(o.equipBonuses)];
    var meta = [];
    if (o.slotType) meta.push('Slot: ' + esc(o.slotType));
    if (o.enemyType) meta.push('Vs ' + esc(o.enemyType) + (o.damagePct ? ' +' + o.damagePct + '%' : ''));
    if (meta.length) parts.push('<div class="item-sec"><h2>Details</h2><div class="item-effect">' + meta.join(' · ') + '</div></div>');
    return { title: name + ' — Neverwinter Overload Enchantment — Compendium', desc: 'Neverwinter overload enchantment ' + name + '.', body: parts.join('') };
  }
});

/* Mount collars */
build('collars', loadJSON('mount_collars.json'), {
  breadcrumb: 'Mount Collars', backHref: 'mounts.html#collars', backLabel: 'View in the Mounts database',
  render: function (c, name) {
    var parts = [];
    if (c.effectText) parts.push('<div class="item-sec"><h2>Effect</h2><div class="item-effect">' + esc(c.effectText) + '</div></div>');
    parts.push(statsBlock(c));
    var meta = [];
    if (c.collarSlot) meta.push('Slot: ' + esc(c.collarSlot));
    if (c.item_level) meta.push('Item Level ' + fmt(c.item_level));
    if (c.combinedRating) meta.push('Combined Rating ' + fmt(c.combinedRating));
    if (meta.length) parts.push('<div class="item-sec"><h2>Details</h2><div class="item-effect">' + meta.join(' · ') + '</div></div>');
    return { title: name + ' — Neverwinter Mount Collar — Compendium', desc: 'Neverwinter mount collar ' + name + (c.effectText ? ': ' + esc(c.effectText) : '') + '.', body: parts.join('') };
  }
});

/* Kits */
build('kits', loadJSON('kits.json'), {
  breadcrumb: 'Kits', backHref: 'toon-forge.html', backLabel: 'Use in Toon Forge',
  render: function (k, name) {
    var parts = [statsBlock(k)];
    var meta = [];
    if (k.item_level) meta.push('Item Level ' + fmt(k.item_level));
    if (Array.isArray(k.appliesTo) && k.appliesTo.length) meta.push('Applies to: ' + k.appliesTo.map(esc).join(', '));
    if (meta.length) parts.push('<div class="item-sec"><h2>Details</h2><div class="item-effect">' + meta.join(' · ') + '</div></div>');
    return { title: name + ' — Neverwinter Kit — Compendium', desc: 'Neverwinter armor/weapon kit ' + name + '.', body: parts.join('') };
  }
});

/* Companion gear */
build('companion-gear', loadJSON('companion_gear.json'), {
  breadcrumb: 'Companion Gear', backHref: 'companions.html', backLabel: 'View Companions',
  render: function (g, name) {
    var parts = [statsBlock(g), equipBlock(g.equipBonuses)];
    var meta = [];
    if (g.slot) meta.push('Slot: ' + esc(g.slot));
    if (g.tier) meta.push('Tier: ' + esc(g.tier));
    if (g.item_level) meta.push('Item Level ' + fmt(g.item_level));
    if (g.combinedRating) meta.push('Combined Rating ' + fmt(g.combinedRating));
    var gs = showText(g.source); if (gs) meta.push('Source: ' + esc(gs));
    if (meta.length) parts.push('<div class="item-sec"><h2>Details</h2><div class="item-effect">' + meta.join(' · ') + '</div></div>');
    return { title: name + ' — Neverwinter Companion Gear — Compendium', desc: 'Neverwinter companion gear ' + name + (g.slot ? ' (' + g.slot + ')' : '') + '.', body: parts.join('') };
  }
});

/* Artisans (professions) */
build('artisans', loadJSGlobal('data/artisans.js', 'ARTISANS_DATA'), {
  breadcrumb: 'Artisans', backHref: 'professions.html', backLabel: 'View the Professions guide',
  render: function (a, name) {
    var rows = [['Profession', a.prof], ['Proficiency', a.proficiency], ['Focus', a.focus], ['Commission', a.commission], ['Speed', a.speed], ['Special Skill', a.skill + (a.skillPct ? ' (' + a.skillPct + '%)' : '')]]
      .filter(function (r) { return r[1] !== undefined && r[1] !== '' && r[1] !== null; })
      .map(function (r) { return '<div class="stat-row"><span class="stat-name">' + esc(r[0]) + '</span><span class="stat-value">' + esc(r[1]) + '</span></div>'; }).join('');
    return {
      title: name + ' — Neverwinter Artisan (' + esc(a.prof) + ') — Compendium',
      desc: 'Neverwinter ' + esc(a.prof) + ' artisan ' + name + ': ' + a.proficiency + ' proficiency, ' + a.focus + ' focus' + (a.skill ? ', ' + esc(a.skill) + ' skill' : '') + '.',
      sub: '<span class="item-badge">' + esc(a.prof) + '</span>',
      body: '<div class="item-sec"><h2>Artisan Stats</h2>' + rows + '</div>'
    };
  }
});

/* Gear (largest) */
build('gear', loadJSON('gear.json'), {
  breadcrumb: 'Gear', backHref: 'toon-forge.html', backLabel: 'Use in Toon Forge',
  render: function (g, name) {
    var parts = [statsBlock(g), equipBlock(g.equipBonuses)];
    var meta = [];
    if (g.slot) meta.push('Slot: ' + esc(String(g.slot).replace(/,/g, ' /')));
    if (g.item_level) meta.push('Item Level ' + fmt(g.item_level));
    if (g.combinedRating) meta.push('Combined Rating ' + fmt(g.combinedRating));
    if (g.set) meta.push('Set: ' + esc(g.set) + (g.setSize ? ' (' + g.setSize + '-piece)' : ''));
    if (Array.isArray(g.allowedClasses) && g.allowedClasses.length && g.allowedClasses.length < 9) meta.push('Classes: ' + g.allowedClasses.map(esc).join(', '));
    var gs = showText(g.source); if (gs) meta.push('Source: ' + esc(gs));
    if (meta.length) parts.push('<div class="item-sec"><h2>Details</h2><div class="item-effect">' + meta.join(' · ') + '</div></div>');
    var slotTxt = g.slot ? ' ' + String(g.slot).replace(/,.*/, '') : '';
    return {
      title: name + ' — Neverwinter' + slotTxt + ' Gear (IL ' + (g.item_level || '?') + ') — Compendium',
      desc: 'Neverwinter gear ' + name + (g.slot ? ' (' + String(g.slot).replace(/,/g, ' /') + ')' : '') + ' at item level ' + (g.item_level || '?') + (g.set ? ', ' + g.set + ' set' : '') + '.',
      body: parts.join('')
    };
  }
});

/* ==========================================================================
   PHASE 2 — companions, mounts, mount insignias.
   Ports the EXACT rarity-scaling + ref-resolution math from
   js/companions-page.js and js/mounts-page.js so the static pages match the
   live tools 1:1. Regression assertions below ABORT the run if any ported
   number drifts (no silently-wrong stats can ship).
   ========================================================================== */

/* faithful port of shared.js renderStatValue */
function renderStatValue(value, type) {
  if (value == null) return '—';
  var isPercent = type === 'percent' || (typeof value === 'number' && Math.abs(value) < 100 && String(value).includes('.'));
  var prefix = value > 0 ? '+' : '';
  var cls = value > 0 ? 'stat-positive' : value < 0 ? 'stat-negative' : 'stat-neutral';
  var val = isPercent ? (prefix + value + '%') : (prefix + fmt(value));
  return '<span class="stat-value ' + cls + '">' + esc(val) + '</span>';
}
function statRow(name, valueHtml) { return '<div class="stat-row"><span class="stat-name">' + esc(name) + '</span>' + valueHtml + '</div>'; }
function statsTable(stats) {
  if (!stats || !stats.length) return '';
  return stats.map(function (s) { return statRow(statName(s.stat), renderStatValue(s.value, s.type)); }).join('');
}
function buildLookup(arr) { var m = {}; arr.forEach(function (x) { if (x && x.id != null) m[x.id] = x; }); return m; }
const TT_STYLE = '<style>.tt{width:100%;border-collapse:collapse;font-size:0.9rem}.tt th,.tt td{text-align:left;padding:0.25rem 0.6rem;border-bottom:1px solid var(--border-default);white-space:nowrap}.tt th{color:var(--highlight);font-size:0.72rem;text-transform:uppercase;letter-spacing:0.04em}.tt tr:last-child td{border-bottom:none}.tt td:first-child{color:var(--text-secondary)}</style>';

/* ---- companion rarity scaling (verbatim from companions-page.js) ---- */
const RARITIES = [
  { name: 'Common', il: 75 }, { name: 'Uncommon', il: 150 }, { name: 'Rare', il: 250 },
  { name: 'Epic', il: 375 }, { name: 'Legendary', il: 550 }, { name: 'Mythic', il: 750 }, { name: 'Celestial', il: 900 }
];
const SINGLE_STAT_SCALE = { 75: 0.75, 150: 1.50, 250: 2.50, 375: 3.75, 550: 5.50, 750: 7.50, 900: 9.00 };
const DOUBLE_STAT_SCALE = { 75: 0.38, 150: 0.75, 250: 1.25, 375: 1.88, 550: 2.75, 750: 3.75, 900: 4.50 };
const TRIPLE_STAT_SCALE = { 75: 0.25, 150: 0.50, 250: 0.83, 375: 1.25, 550: 1.83, 750: 2.50, 900: 3.00 };
const MAX_HP_SCALE = { 75: 1500, 150: 3000, 250: 5000, 375: 7500, 550: 11000, 750: 15000, 900: 18000 };
const SCALABLE_POWER_IDS = {};
[156, 54, 147, 234, 170, 228, 232, 113, 210, 87, 99, 194, 226, 161, 120, 77, 242, 70, 128, 26, 168, 174, 104, 248].forEach(function (id) { SCALABLE_POWER_IDS[id] = true; });
function isScalablePower(pw) {
  if (!pw || !pw.slot) return false;
  if (SCALABLE_POWER_IDS[pw.id]) return true;
  var hasOffDef = pw.slot.some(function (s) { return s === 'Offense' || s === 'Defense'; });
  if (!hasOffDef) return false;
  var realStats = (pw.stats || []).filter(function (s) { return s.stat !== 'CombinedRating'; });
  return realStats.length === 1 || realStats.length === 2;
}
function scaleStats(pw, targetIL) {
  if (!isScalablePower(pw)) return null;
  var realStats = pw.stats.filter(function (s) { return s.stat !== 'CombinedRating'; });
  var pctStats = realStats.filter(function (s) { return s.stat !== 'Maximum Hit Points'; });
  var hasHP = realStats.length !== pctStats.length;
  var totalStats = pctStats.length + (hasHP ? 1 : 0);
  var scale;
  if (pctStats.length === 0) scale = SINGLE_STAT_SCALE;
  else if (totalStats <= 1) scale = SINGLE_STAT_SCALE;
  else if (totalStats === 2) scale = DOUBLE_STAT_SCALE;
  else scale = TRIPLE_STAT_SCALE;
  var baseIL = pw.item_level || targetIL;
  var pctRatio = scale[baseIL] ? scale[targetIL] / scale[baseIL] : 1;
  var hpRatio = MAX_HP_SCALE[baseIL] ? MAX_HP_SCALE[targetIL] / MAX_HP_SCALE[baseIL] : 1;
  var out = [];
  for (var i = 0; i < realStats.length; i++) {
    var st = realStats[i];
    if (st.stat === 'Maximum Hit Points') out.push({ stat: st.stat, value: Math.round((st.value || 0) * hpRatio), type: 'flat' });
    else out.push({ stat: st.stat, value: Math.round((st.value || 0) * pctRatio * 100) / 100, type: st.type || 'percent' });
  }
  return { stats: out, combinedRating: targetIL };
}
function getRarityByIL(il) {
  var best = RARITIES[0];
  for (var i = 0; i < RARITIES.length; i++) { if (RARITIES[i].il === il) return RARITIES[i]; if (RARITIES[i].il <= il) best = RARITIES[i]; }
  return best;
}
function getAvailableRarities(baseIL) { var b = getRarityByIL(baseIL); return RARITIES.filter(function (r) { return r.il >= b.il; }); }

/* proc-effect rendering (faithful port of companions-page.js renderProcEffect) */
function renderProc(proc, il, baseIL) {
  var parts = [];
  if (proc.trigger) parts.push('<div class="item-effect"><span class="stat-name">Trigger:</span> ' + esc(proc.trigger) + '</div>');
  var chance = proc.chance;
  if (proc.chanceScaling && il != null) { var cv = proc.chanceScaling[String(il)]; if (cv != null) chance = cv; }
  if (chance != null) parts.push('<div class="item-effect"><span class="stat-name">Chance:</span> ' + chance + '%</div>');
  if (proc.effect) {
    var t = proc.effect;
    if (proc.effectScaling && il) { var k = String(il); for (var key in proc.effectScaling) { var v = proc.effectScaling[key][k]; if (v != null) t = t.replace('{' + key + '}', v); } }
    t = t.replace(/\{[^}]+\}/g, '?');
    parts.push('<div class="item-effect"><span class="stat-name">Effect:</span> ' + esc(t) + '</div>');
  }
  if (proc.statEffects && proc.statEffects.length) {
    // values are stored at the power's BASE rarity IL — scale to the shown
    // rarity like companions-page.js does (linear IL ratio, engine model)
    for (var i = 0; i < proc.statEffects.length; i++) {
      var se = proc.statEffects[i]; var scope = se.scope ? ' (' + se.scope + ')' : '';
      var sv = se.value;
      // se.noRarityScale = flat proc-buff % (doesn't grow with rarity/IL); must
      // match toon-forge.html engine + companions-page.js. (Shadow Demon +90% Deflect Sev.)
      if (typeof sv === 'number' && il && baseIL && il !== baseIL && !se.noRarityScale) {
        sv = sv * il / baseIL;
        sv = (se.type === 'percent') ? Math.round(sv * 100) / 100 : Math.round(sv);
      }
      parts.push(statRow(statName(se.stat) + scope, renderStatValue(sv, se.type)));
    }
  }
  if (proc.durationSeconds) parts.push('<div class="item-effect"><span class="stat-name">Duration:</span> ' + proc.durationSeconds + 's</div>');
  if (proc.cooldown) parts.push('<div class="item-effect"><span class="stat-name">Cooldown:</span> ' + esc(String(proc.cooldown)) + '</div>');
  else if (proc.cooldownSeconds) parts.push('<div class="item-effect"><span class="stat-name">Cooldown:</span> ' + proc.cooldownSeconds + 's</div>');
  if (proc.maxStacks) parts.push('<div class="item-effect"><span class="stat-name">Max stacks:</span> ' + proc.maxStacks + '</div>');
  return parts.join('');
}

/* ---- mount combat-power scaling (verbatim from mounts-page.js) ---- */
const MOUNT_CP_RARITY_MULT = { Mythic: 1.0, Celestial: 1.3125 };
const MOUNT_CP_IL_RATIO = { Mythic: 1.0, Celestial: 3937 / 3000 };
function cpRoundAmt(x) { var r = Math.round(x * 10) / 10; return r === Math.round(r) ? Math.round(r) : r; }
function scaleCombatPower(p, tier) {
  if (!p) return p;
  var anchor = p.anchorRarity || 'Mythic';
  var vmult = (MOUNT_CP_RARITY_MULT[tier] || 1) / (MOUNT_CP_RARITY_MULT[anchor] || 1);
  var ilSel = MOUNT_CP_IL_RATIO[tier], ilAnc = MOUNT_CP_IL_RATIO[anchor];
  var c = JSON.parse(JSON.stringify(p));
  if (ilSel != null && ilAnc != null && c.item_level) c.item_level = Math.round(c.item_level * ilSel / ilAnc);
  if (c.magnitude) c.magnitude = Math.round(c.magnitude * vmult);
  (c.equipBonuses || []).forEach(function (eb) {
    if (eb.amount != null) eb.amount = cpRoundAmt(eb.amount * vmult);
    if (eb.roleMap) Object.keys(eb.roleMap).forEach(function (rk) { if (eb.roleMap[rk] && eb.roleMap[rk].amount != null) eb.roleMap[rk].amount = cpRoundAmt(eb.roleMap[rk].amount * vmult); });
  });
  return c;
}
/* insignia slot matcher (verbatim from mounts-page.js) */
function slotAccepts(allowed, req) { for (var i = 0; i < allowed.length; i++) { if (allowed[i] === '*' || allowed[i] === req) return true; } return false; }
function slotIsUniversal(slot) { return slot.allowed.indexOf('*') !== -1; }
function allFixedSlotsFilled(slots, used) { for (var f = 0; f < slots.length; f++) { if (!used[f] && !slotIsUniversal(slots[f])) return false; } return true; }
function canAssign(slots, req, rIdx, used) {
  if (rIdx >= req.length) return allFixedSlotsFilled(slots, used);
  for (var s = 0; s < slots.length; s++) { if (used[s]) continue; if (slotAccepts(slots[s].allowed, req[rIdx])) { used[s] = true; if (canAssign(slots, req, rIdx + 1, used)) return true; used[s] = false; } }
  return false;
}
function getCompatibleBonuses(mount, bonuses) {
  var slots = mount.insigniaSlots; if (!slots || !slots.length) return [];
  var out = [];
  for (var i = 0; i < bonuses.length; i++) { var b = bonuses[i]; var req = b.requiredInsignias; if (!req) continue; if (req.length > slots.length) continue; var used = []; for (var u = 0; u < slots.length; u++) used.push(false); if (canAssign(slots, req, 0, used)) out.push(b); }
  return out;
}
/* insignia tier scaling (verbatim from data/mount-insignias.js) */
const MOUNT_INSIGNIAS_TIER_SCALING = { Uncommon: { item_level: 25, multiplier: 0.05 }, Rare: { item_level: 50, multiplier: 0.1 }, Epic: { item_level: 100, multiplier: 0.2 }, Legendary: { item_level: 200, multiplier: 0.4 }, Mythic: { item_level: 500, multiplier: 1 }, Celestial: { item_level: 750, multiplier: 1.5 } };
const INSIGNIA_TIER_ORDER = ['Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic', 'Celestial'];

/* ---- Phase 2 data + lookups ---- */
var cPowers = loadJSON('companion_powers.json');
var cEnh = loadJSON('companion_enhancements.json');
var mCombat = loadJSON('mount_combat_powers.json');
var mEquip = loadJSON('mount_equip_powers.json');
var mBonuses = loadJSON('mount_insignia_bonuses.json');
var mInsignias = loadJSGlobal('data/mount-insignias.js', 'MOUNT_INSIGNIAS_DATA');
var cPowerMap = buildLookup(cPowers);
var cEnhMap = buildLookup(cEnh);
var mCombatMap = buildLookup(mCombat);
var mEquipMap = buildLookup(mEquip);
var mBonusMap = buildLookup(mBonuses);
var mInsigniaMap = buildLookup(mInsignias);
var COMPANION_SKILLS = {};
try { COMPANION_SKILLS = loadJSGlobal('data/companion-skills.js', 'COMPANION_SKILLS') || {}; } catch (e) { COMPANION_SKILLS = {}; }

/* ---- regression assertions (abort on drift) ---- */
(function assertPhase2() {
  function eq(label, got, want) { if (String(got) !== String(want)) throw new Error('PHASE2 REGRESSION ' + label + ': got ' + got + ' want ' + want); }
  var storm = cPowerMap[3];                                   // Storm Eyes: 2 stats (double scale), base IL 750, 3.75 each (normalized to canonical rung 2026-07-04)
  eq('StormEyes@750(base)', scaleStats(storm, 750).stats[0].value, 3.75);
  eq('StormEyes@900(double)', scaleStats(storm, 900).stats[0].value, 4.5);    // 3.75 * (4.50/3.75)
  var ev = scaleCombatPower(mCombatMap[1], 'Celestial');      // Ethereal Vortex, Mythic-anchored
  eq('EtherealVortex mag Celestial', ev.magnitude, 1050);     // 800 * 1.3125
  eq('EtherealVortex debuff Celestial', ev.equipBonuses[0].amount, 20.7);      // 15.8 * 1.3125
  var evM = scaleCombatPower(mCombatMap[1], 'Mythic');
  eq('EtherealVortex mag Mythic', evM.magnitude, 800);
  eq('EtherealVortex debuff Mythic', evM.equipBonuses[0].amount, 15.8);
  eq('Regal Aggression Celestial', Math.round(mInsigniaMap[1].stats[0].value * 1.5), 1125); // 750 * 1.5
  eq('Regal Aggression Uncommon', Math.round(mInsigniaMap[1].stats[0].value * 0.05), 38);   // 750 * 0.05 -> 37.5 -> 38
  console.log('Phase 2 regression assertions passed.');
})();

/* Companions */
build('companions', loadJSON('companions.json'), {
  breadcrumb: 'Companions', backHref: 'companions.html', backLabel: 'View in the full Companions database',
  render: function (c, name) {
    var parts = [], usedTT = false;
    var pw = c.powerRef != null ? cPowerMap[c.powerRef] : null;
    var enh = c.enhancementRef != null ? cEnhMap[c.enhancementRef] : null;
    if (pw) {
      var slotBadges = (pw.slot || []).map(function (s) { return '<span class="item-badge">' + esc(s) + '</span>'; }).join('');
      var pbody = slotBadges ? '<div style="margin-bottom:0.4rem">' + slotBadges + '</div>' : '';
      var realStats = (pw.stats || []).filter(function (s) { return s.stat !== 'CombinedRating'; });
      if (isScalablePower(pw)) {
        var avail = getAvailableRarities(pw.item_level);
        var statNames = realStats.map(function (s) { return statName(s.stat); });
        var head = '<tr><th>Quality</th><th>IL</th>' + statNames.map(function (n) { return '<th>' + esc(n) + '</th>'; }).join('') + '</tr>';
        var rows = avail.map(function (r) {
          var sc = scaleStats(pw, r.il);
          var cells = sc.stats.map(function (st) { return '<td>' + renderStatValue(st.value, st.type) + '</td>'; }).join('');
          return '<tr><td>' + esc(r.name) + '</td><td>' + r.il + '</td>' + cells + '</tr>';
        }).join('');
        pbody += '<div style="overflow-x:auto"><table class="tt"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>';
        usedTT = true;
      } else if (realStats.length) {
        var base = getRarityByIL(pw.item_level);
        pbody += '<div style="margin-bottom:0.3rem;color:var(--text-muted);font-size:0.8rem">At ' + esc(base.name) + ' (IL ' + fmt(pw.item_level) + ')</div>' + statsTable(realStats);
      }
      if (pw.procEffect) {
        // procs with a per-rarity ladder (effectScaling) render at the top
        // rarity too — e.g. Rath's Patience is stored at base Mythic (2%)
        // but reads 2.4% at Celestial in game
        var topIL = (isScalablePower(pw) || pw.procEffect.effectScaling) ? getAvailableRarities(pw.item_level).slice(-1)[0].il : (pw.item_level || 900);
        var pr = renderProc(pw.procEffect, topIL, pw.item_level);
        var prLabel = (topIL !== pw.item_level) ? '<div style="color:var(--text-muted);font-size:0.8rem">At ' + esc(getRarityByIL(topIL).name) + ' (IL ' + fmt(topIL) + ')</div>' : '';
        if (pr) pbody += '<div style="margin-top:0.5rem">' + prLabel + pr + '</div>';
      }
      var pnote = showText(pw.notes);
      if (pnote) pbody += '<div class="item-effect" style="margin-top:0.4rem">' + esc(pnote) + '</div>';
      parts.push('<div class="item-sec"><h2>Summoned Power' + (pw.name ? ' — ' + esc(pw.name) : '') + '</h2>' + pbody + '</div>');
    }
    if (enh) {
      parts.push('<div class="item-sec"><h2>Enhancement — ' + esc(enh.name) + '</h2>' + statRow(statName(enh.stat), renderStatValue(enh.value, enh.type)) + '<div class="item-effect" style="margin-top:0.3rem">Item Level ' + fmt(enh.item_level) + '</div></div>');
    }
    var skills = COMPANION_SKILLS[String(name).toLowerCase()];
    if (Array.isArray(skills) && skills.length) {
      var sk = skills.map(function (s) { return '<div style="margin-bottom:0.4rem"><strong>' + esc(s.name) + '</strong>' + (s.text ? '<div class="item-effect">' + esc(s.text) + '</div>' : '') + '</div>'; }).join('');
      parts.push('<div class="item-sec"><h2>Active Skills</h2>' + sk + '</div>');
    }
    var meta = [];
    if (c.augment) meta.push('Augment companion' + (Array.isArray(c.augmentShares) && c.augmentShares.length ? ' — shares your ' + c.augmentShares.map(esc).join(', ') : ''));
    var cs = showText(c.source); if (cs) meta.push('Source: ' + esc(cs));
    var cn = showText(c.notes); if (cn) meta.push(esc(cn));
    if (meta.length) parts.push('<div class="item-sec"><h2>Details</h2><div class="item-effect">' + meta.join(' · ') + '</div></div>');
    return {
      title: name + ' — Neverwinter Companion — Compendium',
      desc: 'Neverwinter companion ' + name + (pw && pw.name ? ': ' + pw.name + ' summoned buff' : '') + (c.augment ? ' (augment)' : '') + (enh ? ', ' + enh.name + ' enhancement' : '') + '.',
      sub: c.augment ? '<span class="item-badge">Augment</span>' : '',
      body: (usedTT ? TT_STYLE : '') + parts.join('')
    };
  }
});

/* Mounts */
build('mounts', loadJSON('mounts.json'), {
  breadcrumb: 'Mounts', backHref: 'mounts.html', backLabel: 'View in the full Mounts database',
  render: function (m, name) {
    var parts = [], usedTT = false;
    var cp = m.combatRef != null ? mCombatMap[m.combatRef] : null;
    var ep = m.equipRef != null ? mEquipMap[m.equipRef] : null;
    var bonus = m.bonusRef ? mBonusMap[m.bonusRef] : null;
    if (Array.isArray(m.insigniaSlots) && m.insigniaSlots.length) {
      var slotTxt = m.insigniaSlots.map(function (s, i) {
        var types = s.allowed.map(function (a) { return a === '*' ? 'Universal' : a; }).join(' / ');
        return 'Slot ' + (i + 1) + ': ' + esc(types) + (s.preferred ? ' <span style="color:var(--highlight)">★ preferred ' + esc(String(s.preferred)) + '</span>' : '');
      }).join(' · ');
      parts.push('<div class="item-sec"><h2>Insignia Slots</h2><div class="item-effect">' + slotTxt + '</div></div>');
    }
    if (cp) {
      var cM = scaleCombatPower(cp, 'Mythic'), cC = scaleCombatPower(cp, 'Celestial');
      var rows = '';
      if (cM.magnitude || cC.magnitude) rows += '<tr><td>Total Magnitude</td><td>' + fmt(cM.magnitude) + '</td><td>' + fmt(cC.magnitude) + '</td></tr>';
      var ebM = cM.equipBonuses || [], ebC = cC.equipBonuses || [];
      for (var i = 0; i < ebC.length; i++) {
        var bc = ebC[i], bm = ebM[i] || {};
        if (bc.roleMap) {
          ['DPS', 'Tank', 'Heal'].forEach(function (rk) {
            var rc = bc.roleMap[rk]; if (!rc) return;
            var rm = (bm.roleMap && bm.roleMap[rk]) || {};
            rows += '<tr><td>' + esc(rk + ': ' + rc.stat) + '</td><td>' + (rm.amount != null ? rm.amount + '%' : '—') + '</td><td>' + (rc.amount != null ? rc.amount + '%' : '—') + '</td></tr>';
          });
        } else {
          var label = bc.stat + (bc.scope ? ' (' + bc.scope + ')' : '');
          rows += '<tr><td>' + esc(label) + '</td><td>' + (bm.amount != null ? bm.amount + '%' : '—') + '</td><td>' + (bc.amount != null ? bc.amount + '%' : '—') + '</td></tr>';
        }
      }
      var recharge = cp.rechargeTimeSeconds != null ? '<div class="item-effect" style="margin-bottom:0.4rem">Recharge ' + cp.rechargeTimeSeconds + 's</div>' : '';
      var tbl = rows ? '<div style="overflow-x:auto"><table class="tt"><thead><tr><th>Effect</th><th>Mythic</th><th>Celestial</th></tr></thead><tbody>' + rows + '</tbody></table></div>' : '';
      var cnote = showText(cp.notes);
      parts.push('<div class="item-sec"><h2>Combat Power — ' + esc(cp.name) + '</h2>' + recharge + tbl + (cnote ? '<div class="item-effect" style="margin-top:0.4rem">' + esc(cnote) + '</div>' : '') + '</div>');
      if (rows) usedTT = true;
    }
    if (ep) {
      var enote = showText(ep.notes);
      parts.push('<div class="item-sec"><h2>Equip Power — ' + esc(ep.name) + '</h2>' + statsTable(ep.stats) + '<div class="item-effect" style="margin-top:0.3rem">Item Level ' + fmt(ep.item_level) + ' · Combined Rating ' + fmt(ep.combinedRating) + '</div>' + (enote ? '<div class="item-effect" style="margin-top:0.3rem">' + esc(enote) + '</div>' : '') + '</div>');
    }
    if (bonus) {
      var bmeta = [];
      if (Array.isArray(bonus.requiredInsignias) && bonus.requiredInsignias.length) bmeta.push('Requires: ' + bonus.requiredInsignias.map(esc).join(' + '));
      if (bonus.maxStacks) bmeta.push('Stacks up to ' + bonus.maxStacks + 'x');
      parts.push('<div class="item-sec"><h2>Insignia Set Bonus — ' + esc(bonus.name) + '</h2>' + statsTable(bonus.stats) + (bmeta.length ? '<div class="item-effect" style="margin-top:0.3rem">' + bmeta.join(' · ') + '</div>' : '') + (bonus.effectText ? '<div class="item-effect" style="margin-top:0.3rem">' + esc(bonus.effectText) + '</div>' : '') + '</div>');
    }
    var compat = getCompatibleBonuses(m, mBonuses);
    if (compat.length) {
      var cl = compat.map(function (b) {
        var req = Array.isArray(b.requiredInsignias) ? ' <span style="color:var(--text-muted);font-size:0.8rem">(' + b.requiredInsignias.map(esc).join(' + ') + ')</span>' : '';
        return '<li>' + esc(b.name) + req + '</li>';
      }).join('');
      parts.push('<div class="item-sec"><h2>Compatible Insignia Bonuses (' + compat.length + ')</h2><ul class="item-list">' + cl + '</ul></div>');
    }
    var meta = [];
    var ms = showText(m.source); if (ms) meta.push('Source: ' + esc(ms));
    var mn = showText(m.notes); if (mn) meta.push(esc(mn));
    if (meta.length) parts.push('<div class="item-sec"><h2>Details</h2><div class="item-effect">' + meta.join(' · ') + '</div></div>');
    return {
      title: name + ' — Neverwinter Mount — Compendium',
      desc: 'Neverwinter mount ' + name + (cp && cp.name ? ': ' + cp.name + ' combat power' : '') + (ep && ep.name ? ', ' + ep.name + ' equip power' : '') + '.',
      body: (usedTT ? TT_STYLE : '') + parts.join('')
    };
  }
});

/* Mount insignias */
build('insignias', mInsignias, {
  breadcrumb: 'Mount Insignias', backHref: 'mounts.html#insignias', backLabel: 'View in the Mounts database',
  render: function (ins, name) {
    var stats = ins.stats || [];
    var statNames = stats.map(function (s) { return statName(s.stat); });
    var head = '<tr><th>Quality</th><th>IL</th>' + statNames.map(function (n) { return '<th>' + esc(n) + '</th>'; }).join('') + '<th>Combined Rating</th></tr>';
    var rows = INSIGNIA_TIER_ORDER.map(function (tier) {
      var sc = MOUNT_INSIGNIAS_TIER_SCALING[tier];
      var cells = stats.map(function (st) {
        if (st.type === 'percent') { var pv = Math.round(st.value * sc.multiplier * 10) / 10; return '<td>' + (pv >= 0 ? '+' : '') + pv + '%</td>'; }
        var rv = Math.round(st.value * sc.multiplier); return '<td>' + (rv >= 0 ? '+' : '') + fmt(rv) + '</td>';
      }).join('');
      var cr = Math.round((ins.combinedRating || 0) * sc.multiplier);
      return '<tr><td>' + tier + '</td><td>' + sc.item_level + '</td>' + cells + '<td>' + fmt(cr) + '</td></tr>';
    }).join('');
    var tbl = '<div style="overflow-x:auto"><table class="tt"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>';
    return {
      title: name + ' — Neverwinter Mount Insignia — Compendium',
      desc: 'Neverwinter ' + esc(ins.category) + ' insignia ' + name + ' (' + ins.statTemplate + ' template) — stats at every quality from Uncommon to Celestial.',
      sub: '<span class="item-badge">' + esc(ins.category) + '</span>',
      body: TT_STYLE + '<div class="item-sec"><h2>Stats by Quality</h2>' + tbl + '</div><div class="item-sec"><h2>Details</h2><div class="item-effect">Slot type: ' + esc(ins.category) + ' · Stat template: ' + esc(ins.statTemplate) + '</div></div>'
    };
  }
});

/* Enchantments — per-rarity ladder is stored verbatim (no derived scaling). */
var enchantsData = loadJSON('enchants.json');
(function assertEnchants() {
  var m = {}; enchantsData.forEach(function (x) { m[x.id] = x; });
  function eq(l, g, w) { if (String(g) !== String(w)) throw new Error('ENCHANT REGRESSION ' + l + ': got ' + g + ' want ' + w); }
  eq('Cobalt Celestial offense', m[1].rarities.Celestial.universal.offense['Critical Severity'], 2700);
  eq('Cobalt Uncommon offense', m[1].rarities.Uncommon.universal.offense['Critical Severity'], 450);
  eq('Cursed Burn Celestial Dmg Bonus', m[27].rarities.Celestial.percentStats['Dmg Bonus'], 12);
  console.log('Enchant assertions passed.');
})();
build('enchants', enchantsData, {
  breadcrumb: 'Enchantments', backHref: 'toon-forge.html', backLabel: 'Use in Toon Forge',
  render: function (e, name) {
    var parts = [], usedTT = false;
    var RANK = ['Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic', 'Celestial'];
    function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
    function cleanDesc(s) {
      if (!s) return '';
      s = String(s).split(/\n+\s*Note\s*:/i)[0];               // drop trailing internal "Note:" annotation
      for (var i = 0; i < AUDIT_TRAIL_PATTERNS.length; i++) s = s.replace(AUDIT_TRAIL_PATTERNS[i], '');
      return s.trim();
    }
    var effText = cleanDesc(e.description);
    function tierStats(t) {
      var out = [];
      if (t.universal) {
        ['offense', 'defense', 'utility'].forEach(function (slot) {
          var mp = t.universal[slot]; if (!mp) return;
          Object.keys(mp).forEach(function (k) { if (mp[k] != null) out.push({ label: cap(slot) + ': ' + statName(k), value: mp[k], type: 'rating' }); });
        });
      }
      if (t.ratingStats) Object.keys(t.ratingStats).forEach(function (k) { if (t.ratingStats[k] != null && t.ratingStats[k] !== 0) out.push({ label: statName(k), value: t.ratingStats[k], type: 'rating' }); });
      if (t.percentStats) Object.keys(t.percentStats).forEach(function (k) { if (t.percentStats[k] != null && t.percentStats[k] !== 0) out.push({ label: statName(k), value: t.percentStats[k], type: 'percent' }); });
      return out;
    }
    if (effText) parts.push('<div class="item-sec"><h2>Effect</h2><div class="item-effect">' + esc(effText).replace(/\n+/g, '<br>') + '</div></div>');
    var tierNames = e.rarities ? RANK.filter(function (r) { return e.rarities[r]; }) : [];
    if (tierNames.length) {
      var cols = tierStats(e.rarities[tierNames[tierNames.length - 1]]).map(function (s) { return s.label; });
      var head = '<tr><th>Quality</th><th>IL</th>' + cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '<th>Combined Rating</th></tr>';
      var rows = tierNames.map(function (rn) {
        var t = e.rarities[rn];
        var byLabel = {}; tierStats(t).forEach(function (s) { byLabel[s.label] = s; });
        var cells = cols.map(function (c) { var s = byLabel[c]; return '<td>' + (s ? renderStatValue(s.value, s.type) : '—') + '</td>'; }).join('');
        return '<tr><td>' + rn + '</td><td>' + fmt(t.item_level) + '</td>' + cells + '<td>' + fmt(t.combinedRating) + '</td></tr>';
      }).join('');
      parts.push('<div class="item-sec"><h2>Stats by Quality</h2><div style="overflow-x:auto"><table class="tt"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div></div>');
      usedTT = true;
    } else {
      var st = tierStats(e);
      if (st.length) parts.push('<div class="item-sec"><h2>Stats</h2>' + st.map(function (s) { return statRow(s.label, renderStatValue(s.value, s.type)); }).join('') + '</div>');
    }
    var eb = equipBlock(e.equipBonuses); if (eb) parts.push(eb);
    var meta = [];
    if (e.slotType) meta.push('Slot: ' + esc(e.slotType));
    if (Array.isArray(e.appliesTo) && e.appliesTo.length) meta.push('Applies to: ' + e.appliesTo.map(esc).join(', '));
    if (e.companionEnchant) meta.push('Companion enchantment');
    var en = showText(e.notes); if (en) meta.push(esc(en));
    if (meta.length) parts.push('<div class="item-sec"><h2>Details</h2><div class="item-effect">' + meta.join(' · ') + '</div></div>');
    return {
      title: name + ' — Neverwinter Enchantment — Compendium',
      desc: 'Neverwinter enchantment ' + name + (e.slotType ? ' (' + e.slotType + ' slot)' : '') + (effText ? ': ' + effText.replace(/\s+/g, ' ').slice(0, 110) : '') + '.',
      sub: e.slotType ? '<span class="item-badge">' + esc(e.slotType) + '</span>' : '',
      body: (usedTT ? TT_STYLE : '') + parts.join('')
    };
  }
});

/* ==========================================================================
   PHASE 4 — reference sets: campaign boons, guild boons, classes, races.
   Mostly verbatim stored data (no derived scaling). Provenance in notes
   fields is filtered with showText(); descriptions are authored game text.
   ========================================================================== */
function kvRows(obj) {
  if (!obj) return '';
  if (Array.isArray(obj)) return obj.map(function (b) { return statRow(b.stat || b.name || '', '<span class="stat-value">' + esc(b.amount != null ? b.amount : b.value) + '</span>'); }).join('');
  return Object.keys(obj).map(function (k) { return statRow(k, '<span class="stat-value">' + esc(obj[k]) + '</span>'); }).join('');
}

/* Campaign boons (the shared endgame boons live under .master) */
var campaignBoons = (loadJSON('campaign_boons.json').master || []);
/* Guild boons: flatten the Offense/Defense/Utility buckets, assign unique ids */
var guildRaw = loadJSON('guild_boons.json');
var guildBoons = [];
['Offense', 'Defense', 'Utility'].forEach(function (cat) { (guildRaw[cat] || []).forEach(function (gb) { gb = Object.assign({}, gb); gb.category = cat; guildBoons.push(gb); }); });
guildBoons.forEach(function (gb, i) { gb.id = i + 1; });
/* Classes / races are name-keyed — give them sequential ids for clean slugs */
var classesData = loadJSON('classes.json').map(function (c, i) { c = Object.assign({}, c); c.id = i + 1; return c; });
var racesData = loadJSON('races.json').map(function (r, i) { r = Object.assign({}, r); r.id = i + 1; return r; });

(function assertPhase4() {
  function eq(l, g, w) { if (String(g) !== String(w)) throw new Error('PHASE4 REGRESSION ' + l + ': got ' + g + ' want ' + w); }
  eq('Deathly Rage boon', campaignBoons[0].perRankEffects[0].amount, 2);
  eq('Guild Power Bonus', guildBoons[0].amount, 3000);
  if (!classesData.find(function (c) { return c.name === 'Barbarian'; })) throw new Error('PHASE4: Barbarian class missing');
  if (!racesData.find(function (r) { return r.name === 'Aasimar'; })) throw new Error('PHASE4: Aasimar race missing');
  console.log('Phase 4 assertions passed.');
})();

build('campaign-boons', campaignBoons, {
  breadcrumb: 'Campaign Boons', backHref: 'toon-forge.html', backLabel: 'Use in Toon Forge',
  render: function (b, name) {
    var parts = [];
    var eff = (b.perRankEffects || []).map(function (pe) {
      return statRow(statName(pe.stat) + ' (per rank' + (pe.unlockRank ? ', unlocks at rank ' + pe.unlockRank : '') + ')', renderStatValue(pe.amount, pe.type));
    }).join('');
    if (eff) parts.push('<div class="item-sec"><h2>Per-Rank Effects</h2>' + eff + '</div>');
    var meta = [];
    if (b.trigger) meta.push('Trigger: ' + esc(b.trigger));
    if (b.chance != null) meta.push('Chance: ' + b.chance + '%');
    if (b.duration != null) meta.push('Duration: ' + b.duration + 's');
    if (b.maxRanks != null) meta.push('Max ranks: ' + b.maxRanks);
    if (b.totalCost != null) meta.push('Cost: ' + b.totalCost + ' boon points');
    var bn = showText(b.notes); if (bn) meta.push(esc(bn));
    if (meta.length) parts.push('<div class="item-sec"><h2>Details</h2><div class="item-effect">' + meta.join(' · ') + '</div></div>');
    return {
      title: name + ' — Neverwinter Campaign Boon — Compendium',
      desc: 'Neverwinter campaign boon ' + name + (b.trigger ? ': ' + String(b.trigger).replace(/\s+/g, ' ').slice(0, 100) : '') + '.',
      body: parts.join('')
    };
  }
});

build('guild-boons', guildBoons, {
  breadcrumb: 'Guild Boons', backHref: 'toon-forge.html', backLabel: 'Use in Toon Forge',
  render: function (gb, name) {
    var parts = [];
    if (gb.stat) parts.push('<div class="item-sec"><h2>Bonus at Max Rank</h2>' + statRow(statName(gb.stat), renderStatValue(gb.amount, gb.statType === 'percent' ? 'percent' : 'rating')) + (gb.maxRank ? '<div class="item-effect" style="margin-top:0.3rem">Rank ' + gb.maxRank + (gb.item_level ? ' &middot; Item Level ' + fmt(gb.item_level) : '') + (gb.combinedRating ? ' &middot; Combined Rating ' + fmt(gb.combinedRating) : '') + '</div>' : '') + '</div>');
    var meta = [];
    if (gb.perRank) { var pr = gb.perRank, bits = []; if (pr.amount != null) bits.push('+' + fmt(pr.amount) + ' ' + statName(gb.stat)); if (pr.itemLevel != null) bits.push('+' + pr.itemLevel + ' IL'); if (pr.combinedRating != null) bits.push('+' + pr.combinedRating + ' CR'); if (bits.length) meta.push('Per rank: ' + bits.join(', ')); }
    meta.push('Category: ' + esc(gb.category));
    if (gb.minAmount != null && gb.maxAmount != null) meta.push('Range: ' + fmt(gb.minAmount) + '–' + fmt(gb.maxAmount));
    var gn = showText(gb.notes); if (gn) meta.push(esc(gn));
    parts.push('<div class="item-sec"><h2>Details</h2><div class="item-effect">' + meta.join(' · ') + '</div></div>');
    return {
      title: name + ' — Neverwinter Guild Boon — Compendium',
      desc: 'Neverwinter guild stronghold boon ' + name + ' (' + gb.category + ')' + (gb.stat ? ': ' + statName(gb.stat) + ' +' + fmt(gb.amount) + ' at rank ' + gb.maxRank : '') + '.',
      sub: '<span class="item-badge">' + esc(gb.category) + '</span>',
      body: parts.join('')
    };
  }
});

build('classes', classesData, {
  breadcrumb: 'Classes', backHref: 'toon-forge.html', backLabel: 'Use in Toon Forge',
  render: function (c, name) {
    var parts = [];
    if (c.baseAbilityScores) { var abs = {}; Object.keys(c.baseAbilityScores).forEach(function (k) { abs[k.length <= 3 ? k.toUpperCase() : k] = c.baseAbilityScores[k]; }); parts.push('<div class="item-sec"><h2>Base Ability Scores</h2>' + kvRows(abs) + '</div>'); }
    if (Array.isArray(c.paragonPaths) && c.paragonPaths.length) {
      var pp = c.paragonPaths.map(function (p) {
        var h = '<div style="margin-bottom:0.7rem"><strong>' + esc(p.name) + '</strong>' + (Array.isArray(p.roles) ? ' <span style="color:var(--text-muted);font-size:0.8rem">(' + p.roles.map(esc).join(', ') + (p.damageType ? ', ' + esc(p.damageType) : '') + ')</span>' : '');
        if (p.percentStats) h += statsRows(p.percentStats, 'percent');
        if (Array.isArray(p.slottedClassFeatures)) h += p.slottedClassFeatures.map(function (f) { return '<div class="item-effect" style="margin-top:0.25rem"><strong>' + esc(f.name || '') + '</strong>' + (f.description ? ' &mdash; ' + esc(f.description) : '') + '</div>'; }).join('');
        return h + '</div>';
      }).join('');
      parts.push('<div class="item-sec"><h2>Paragon Paths</h2>' + pp + '</div>');
    }
    var meta = [];
    if (Array.isArray(c.classFeatures) && c.classFeatures.length) meta.push('Class features: ' + c.classFeatures.map(function (f) { return esc(typeof f === 'string' ? f : (f.name || '')); }).filter(Boolean).join(', '));
    if (meta.length) parts.push('<div class="item-sec"><h2>Details</h2><div class="item-effect">' + meta.join(' · ') + '</div></div>');
    return {
      title: name + ' — Neverwinter Class — Compendium',
      desc: 'Neverwinter ' + name + ' class' + (Array.isArray(c.roles) ? ' (' + c.roles.join('/') + ')' : '') + ' — paragon paths, ability scores, and class features.',
      sub: Array.isArray(c.roles) ? c.roles.map(function (r) { return '<span class="item-badge">' + esc(r) + '</span>'; }).join('') : '',
      body: parts.join('')
    };
  }
});

build('races', racesData, {
  breadcrumb: 'Races', backHref: 'toon-forge.html', backLabel: 'Use in Toon Forge',
  render: function (r, name) {
    var parts = [];
    var fixed = (r.fixedBonuses || []).map(function (b) { return statRow(b.stat, renderStatValue(b.amount, 'rating')); }).join('');
    var choice = (r.choiceBonuses || []);
    if (fixed || choice.length) {
      var ch = choice.length ? '<div class="item-effect" style="margin-top:0.3rem">Choose one: ' + choice.map(function (b) { return esc(b.stat) + ' +' + b.amount; }).join(' or ') + '</div>' : '';
      parts.push('<div class="item-sec"><h2>Ability Score Bonuses</h2>' + fixed + ch + '</div>');
    }
    if (Array.isArray(r.traits) && r.traits.length) {
      var tr = r.traits.map(function (t) {
        var h = '<div style="margin-bottom:0.5rem"><strong>' + esc(t.name || '') + '</strong>' + (t.description ? '<div class="item-effect">' + esc(t.description) + '</div>' : '');
        if (t.percentStats) h += statsRows(t.percentStats, 'percent');
        return h + '</div>';
      }).join('');
      parts.push('<div class="item-sec"><h2>Racial Traits</h2>' + tr + '</div>');
    }
    return {
      title: name + ' — Neverwinter Race — Compendium',
      desc: 'Neverwinter ' + name + ' race' + (r.premium ? ' (premium)' : '') + ' — ability score bonuses and racial traits.',
      sub: r.premium ? '<span class="item-badge">Premium</span>' : '',
      body: parts.join('')
    };
  }
});

/* ---------- db root index ---------- */
(function () {
  var TYPE_LABELS = { 'companion-gear': 'Companion Gear', 'campaign-boons': 'Campaign Boons', 'guild-boons': 'Guild Boons' };
  function typeLabel(t) { return TYPE_LABELS[t] || t.charAt(0).toUpperCase() + t.slice(1); }
  var cards = Object.keys(urls).sort().map(function (t) { return '<a class="db-card" href="db/' + t + '/index.html"><span class="db-card-name">' + esc(typeLabel(t)) + '</span><span class="db-card-meta">' + (urls[t].length - 1) + ' entries</span></a>'; }).join('');
  var body = DB_IDX_STYLE + '<div class="db-grid">' + cards + '</div>';
  var html = page({ type: '', file: 'index.html', title: 'Item Database — Neverwinter Compendium', desc: 'Browse every Neverwinter item database — artifacts, gear, companions, mounts, enchantments, insignias, and more.', h1: 'Item Database', sub: Object.keys(urls).length + ' databases', bodyHtml: body, backHref: 'index.html', backLabel: 'Home', breadcrumb: 'Home' });
  // fix: db root page lives at /db/index.html, its own canonical
  html = html.replace(ROOT + 'db//index.html', ROOT + 'db/index.html');
  fs.mkdirSync(path.join(WEB, 'db'), { recursive: true });
  fs.writeFileSync(path.join(WEB, 'db', 'index.html'), html);
})();

/* ---------- sitemaps: an index + per-type child sitemaps ---------- */
const MAIN_PAGES = ['', 'mounts.html', 'companions.html', 'consumables.html', 'artifacts.html', 'mekaniks.html', 'campaign-boosters.html', 'professions.html', 'patchnotes.html', 'reports.html', 'creators-tools.html', 'toon-forge.html', 'insignia-priority.html', 'preview.html', 'dungeon-currency.html', 'db/index.html'];
function urlset(locs) {
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    locs.map(function (u) { return '  <url><loc>' + u + '</loc><lastmod>' + BUILD_DATE + '</lastmod></url>'; }).join('\n') + '\n</urlset>\n';
}
fs.writeFileSync(path.join(WEB, 'sitemap-pages.xml'), urlset(MAIN_PAGES.map(function (p) { return ROOT + p; })));
var childSitemaps = ['sitemap-pages.xml'];
Object.keys(urls).forEach(function (t) {
  var f = 'sitemap-' + t + '.xml';
  fs.writeFileSync(path.join(WEB, f), urlset(urls[t]));
  childSitemaps.push(f);
});
var idx = '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  childSitemaps.map(function (f) { return '  <sitemap><loc>' + ROOT + f + '</loc><lastmod>' + BUILD_DATE + '</lastmod></sitemap>'; }).join('\n') + '\n</sitemapindex>\n';
fs.writeFileSync(path.join(WEB, 'sitemap.xml'), idx);

var total = Object.keys(urls).reduce(function (n, t) { return n + urls[t].length; }, 0);
console.log('\nTOTAL item/index pages: ' + total);
console.log('sitemap.xml is now an index over ' + childSitemaps.length + ' child sitemaps.');
