// Loads the current build, ensures it's converged, and prints an ANNOTATED
// readout: every equipped pick + its stats, flagging which contributions are
// wasted-on-cap vs useful vs uncapped-damage — so questionable picks stand out.
const fs = require('fs'), path = require('path'), puppeteer = require('puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const LINK = path.join(__dirname, '..', 'docs', 'best_build_warlock_dps_bis.link.txt');
(async () => {
  const url = fs.readFileSync(LINK, 'utf8').trim().replace('https://n00bin.github.io/nwc/', 'http://127.0.0.1:8765/');
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-gpu'] });
  const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2500));

  const out = await p.evaluate(() => {
    const r = getEngineResult();
    if (typeof gotoStep === 'function') gotoStep(6); renderSim();
    const hero = document.querySelector('.sim-hero-value');
    const PRIO = ['Power', 'Combat Advantage', 'Critical Severity', 'Critical Strike', 'Accuracy'];
    const capped = {}; PRIO.forEach(n => { const s = r.stats[n]; capped[n] = s.finalPct >= s.cap; });
    const prioStats = {}; PRIO.forEach(n => { const s = r.stats[n]; prioStats[n] = Math.round(s.finalPct * 10) / 10 + '/' + s.cap + (s.finalPct >= s.cap ? ' (CAP)' : ''); });

    // annotate an item's rating/percent stats: which feed a capped priority stat (wasted) vs useful
    function annStats(obj) {
      if (!obj) return [];
      return Object.entries(obj).map(([k, v]) => {
        let tag = '';
        if (PRIO.includes(k)) tag = capped[k] ? ' [CAPPED→wasted]' : ' [under-cap→useful]';
        else if (/Defense|Deflect|Awareness|Avoidance|Control|Hit Points|Stamina|Movement/.test(k)) tag = ' [off-role]';
        else if (/Damage|Outgoing|Bonus|Boost/.test(k)) tag = ' [DAMAGE↑]';
        return `${k} ${v}${tag}`;
      });
    }
    function dmgFromEquip(item) {
      const out = [];
      for (const eb of (item && item.equipBonuses || [])) {
        if (eb.stat && /Damage|Dmg|Outgoing|Boost/.test(eb.stat)) out.push(`${eb.stat}+${eb.amount}${eb.zones ? ' (zone:' + eb.zones.join('/') + ')' : ''} [DAMAGE↑]`);
        else if (eb.description) out.push(`"${(eb.name || '')}: ${eb.description}".slice`.slice(0, 0) + (eb.name || eb.stat || 'bonus'));
      }
      if (item && item.percentStats) for (const [k, v] of Object.entries(item.percentStats)) if (/Damage|Dmg|Bonus/.test(k)) out.push(`${k}+${v} [DAMAGE↑]`);
      return out;
    }

    const GEAR = ['Head', 'Armor', 'Arms', 'Feet', 'Neck', 'Waist', 'Shirt', 'Pants', 'Main Hand', 'Off Hand', 'Ring 1', 'Ring 2'];
    const SLOTMAP = { 'Ring 1': 'Ring', 'Ring 2': 'Ring' };
    const gear = GEAR.map(label => {
      const nm = state.gear[label];
      const it = nm ? findGearByName(nm, SLOTMAP[label] || label) : null;
      return { label, name: nm, il: it && it.item_level, rating: annStats(it && it.ratingStats), pct: annStats(it && it.percentStats), dmg: dmgFromEquip(it) };
    });
    const ACTIVE = ['Offense', 'Defense', 'Universal', 'Universal', 'Utility'];
    const comps = ACTIVE.map((t, i) => {
      const nm = state.activeComps[i];
      const c = nm && COMPANIONS_DATA.find(x => x.name === nm);
      const pw = c && findCompanionPower(c.powerRef);
      return { slot: t, name: nm, gives: pw && pw.stats ? pw.stats.map(s => `${s.stat} ${s.value}${/Damage|Outgoing|Bonus/.test(s.stat) ? ' [DAMAGE↑]' : (PRIO.includes(s.stat) ? (capped[s.stat] ? ' [CAPPED→wasted]' : ' [useful]') : '')}`) : [] };
    });
    const arts = ['Primary', 'Secondary 1', 'Secondary 2', 'Secondary 3'].map(s => ({ slot: s, name: state.artifacts[s] }));
    return {
      damage: hero && hero.textContent, TIL: r.totalItemLevel,
      buckets: { generic: r.damageBoosts.generic, base: r.damageBoosts.base, magical: r.damageBoosts.magical },
      prioStats, gear, comps, arts,
      overloads: state.overloads, summon: state.summoned, summonEnh: state.summonedEnh,
      compGear: state.summonedGear, equipPower: state.activeEquipPower, combatPower: state.activeCombatPower,
      errs: 0,
    };
  });

  console.log('PAGE ERRORS:', JSON.stringify(errs.slice(0, 3)));
  console.log(`\n===== DAMAGE ${out.damage}  (TIL ${out.TIL.toLocaleString()})  =====`);
  console.log(`Damage buckets: generic ${out.buckets.generic}%  base ${out.buckets.base}%  magical ${out.buckets.magical}%`);
  console.log('\nPriority stats vs cap:');
  Object.entries(out.prioStats).forEach(([k, v]) => console.log(`   ${k}: ${v}`));
  console.log('\n===== GEAR =====');
  out.gear.forEach(g => {
    console.log(`\n  [${g.label}] ${g.name} (IL ${g.il})`);
    if (g.rating.length) console.log(`     rating: ${g.rating.join('  |  ')}`);
    if (g.pct.length) console.log(`     percent: ${g.pct.join('  |  ')}`);
    if (g.dmg.length) console.log(`     damage/bonus: ${g.dmg.join('  |  ')}`);
  });
  console.log('\n===== COMPANIONS =====');
  out.comps.forEach(c => console.log(`  [${c.slot}] ${c.name}: ${c.gives.join('  |  ') || '(no modeled stats)'}`));
  console.log('  Summon:', out.summon, '| Enhancement:', out.summonEnh, '| CompGear:', JSON.stringify(out.compGear));
  console.log('\n===== ARTIFACTS =====');
  out.arts.forEach(a => console.log(`  [${a.slot}] ${a.name}`));
  console.log('\n===== OVERLOADS / MOUNT POWERS =====');
  console.log('  Overloads:', out.overloads.join(', '));
  console.log('  Active equip power id:', out.equipPower, '| combat power id:', out.combatPower);
  await b.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
