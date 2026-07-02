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
    locs.map(function (u) { return '  <url><loc>' + u + '</loc></url>'; }).join('\n') + '\n</urlset>\n';
}
fs.writeFileSync(path.join(WEB, 'sitemap-pages.xml'), urlset(MAIN_PAGES.map(function (p) { return ROOT + p; })));
var childSitemaps = ['sitemap-pages.xml'];
Object.keys(urls).forEach(function (t) {
  var f = 'sitemap-' + t + '.xml';
  fs.writeFileSync(path.join(WEB, f), urlset(urls[t]));
  childSitemaps.push(f);
});
var idx = '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  childSitemaps.map(function (f) { return '  <sitemap><loc>' + ROOT + f + '</loc></sitemap>'; }).join('\n') + '\n</sitemapindex>\n';
fs.writeFileSync(path.join(WEB, 'sitemap.xml'), idx);

var total = Object.keys(urls).reduce(function (n, t) { return n + urls[t].length; }, 0);
console.log('\nTOTAL item/index pages: ' + total);
console.log('sitemap.xml is now an index over ' + childSitemaps.length + ' child sitemaps.');
