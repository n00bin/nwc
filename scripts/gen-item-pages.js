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
function equipBlock(list) {
  if (!Array.isArray(list) || !list.length) return '';
  var rows = list.map(function (b) {
    var head = esc(b.name || (b.type === 'Set' ? 'Set bonus' : 'Equip bonus'));
    var dt = showText(b.description);
    var desc = dt ? '<div class="item-effect">' + esc(dt) + '</div>' : '';
    return '<div style="margin-bottom:0.5rem"><strong>' + head + '</strong>' + desc + '</div>';
  }).join('');
  return '<div class="item-sec"><h2>Bonuses</h2>' + rows + '</div>';
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
    '    <div class="item-crumb"><a href="index.html">Home</a> &rsaquo; <a href="' + o.backHref + '">' + esc(o.breadcrumb) + '</a> &rsaquo; ' + esc(o.h1) + '</div>\n' +
    '    <h1 class="item-h1">' + esc(o.h1) + '</h1>\n' +
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

function build(type, items, opts) {
  urls[type] = [];
  var idxRows = [];
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
    idxRows.push('<li><a href="db/' + type + '/' + file + '">' + esc(name) + '</a></li>');
  });
  // per-type index page
  var idxBody = '<div class="item-sec"><h2>' + esc(opts.breadcrumb) + ' (' + items.length + ')</h2><ul class="item-list">' + idxRows.join('') + '</ul></div>';
  var idxHtml = page({
    type: type, file: 'index.html',
    title: opts.breadcrumb + ' — Neverwinter Compendium',
    desc: 'Every Neverwinter ' + opts.breadcrumb.toLowerCase() + ' — ' + items.length + ' entries with stats and effects.',
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
    var parts = [statsBlock(b)];
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
    var parts = [statsBlock(o)];
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
function renderProc(proc, il) {
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
    for (var i = 0; i < proc.statEffects.length; i++) { var se = proc.statEffects[i]; var scope = se.scope ? ' (' + se.scope + ')' : ''; parts.push(statRow(statName(se.stat) + scope, renderStatValue(se.value, se.type))); }
  }
  if (proc.durationSeconds) parts.push('<div class="item-effect"><span class="stat-name">Duration:</span> ' + proc.durationSeconds + 's</div>');
  if (proc.cooldown) parts.push('<div class="item-effect"><span class="stat-name">Cooldown:</span> ' + esc(String(proc.cooldown)) + '</div>');
  else if (proc.cooldownSeconds) parts.push('<div class="item-effect"><span class="stat-name">Cooldown:</span> ' + proc.cooldownSeconds + 's</div>');
  if (proc.maxStacks) parts.push('<div class="item-effect"><span class="stat-name">Max stacks:</span> ' + proc.maxStacks + '</div>');
  return parts.join('');
}

/* ---- mount combat-power scaling (verbatim from mounts-page.js) ---- */
const MOUNT_CP_RARITY_MULT = { Mythic: 1.0, Celestial: 1.3124444 };
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
  var storm = cPowerMap[3];                                   // Storm Eyes: 2 stats (double scale), base IL 750, 3.8 each
  eq('StormEyes@750(base)', scaleStats(storm, 750).stats[0].value, 3.8);
  eq('StormEyes@900(double)', scaleStats(storm, 900).stats[0].value, 4.56);   // 3.8 * (4.50/3.75)
  var ev = scaleCombatPower(mCombatMap[1], 'Celestial');      // Ethereal Vortex, Mythic-anchored
  eq('EtherealVortex mag Celestial', ev.magnitude, 1050);     // 800 * 1.3124444
  eq('EtherealVortex debuff Celestial', ev.equipBonuses[0].amount, 20.7);      // 15.8 * 1.3124444
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
        var topIL = isScalablePower(pw) ? getAvailableRarities(pw.item_level).slice(-1)[0].il : (pw.item_level || 900);
        var pr = renderProc(pw.procEffect, topIL);
        if (pr) pbody += '<div style="margin-top:0.5rem">' + pr + '</div>';
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

/* ---------- db root index ---------- */
(function () {
  var links = Object.keys(urls).map(function (t) { return '<li><a href="db/' + t + '/index.html">' + esc(t) + '</a> (' + (urls[t].length - 1) + ')</li>'; }).join('');
  var body = '<div class="item-sec"><h2>Item Databases</h2><ul class="item-list">' + links + '</ul></div>';
  var html = page({ type: '', file: 'index.html', title: 'Item Database — Neverwinter Compendium', desc: 'Browse every Neverwinter item — artifacts, consumables, gear, and more.', h1: 'Item Database', sub: '', bodyHtml: body, backHref: 'index.html', backLabel: 'Home', breadcrumb: 'Home' });
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
