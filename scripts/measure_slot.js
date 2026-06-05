// Controlled measurement: for a gear slot, swap through candidates and record
// how the tool's damage + TIL + priority-stat finalPcts respond. Read-only
// (restores the original after each). Answers: WHY does the engine prefer the
// odd-looking pick? Usage: node measure_slot.js "Neck"
const fs = require('fs'), path = require('path'), puppeteer = require('puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const LINK = path.join(__dirname, '..', 'docs', 'best_build_warlock_dps_bis.link.txt');
const LABEL = process.argv[2] || 'Neck';
const DATASLOT = ({ 'Ring 1': 'Ring', 'Ring 2': 'Ring' })[LABEL] || LABEL;

(async () => {
  const url = fs.readFileSync(LINK, 'utf8').trim().replace('https://n00bin.github.io/nwc/', 'http://127.0.0.1:8765/');
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-gpu'] });
  const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2500));

  const out = await p.evaluate((LABEL, DATASLOT) => {
    if (typeof gotoStep === 'function') gotoStep(6);
    const PR = ['Power', 'Combat Advantage', 'Critical Severity', 'Critical Strike', 'Accuracy'];
    function measure() {
      renderSim();
      const r = getEngineResult();
      const hero = document.querySelector('.sim-hero-value');
      const dmg = hero ? Number(String(hero.textContent).replace(/[^0-9.]/g, '')) : 0;
      const st = {}; PR.forEach(n => st[n] = Math.round(r.stats[n].finalPct * 10) / 10);
      return { dmg, til: r.totalItemLevel, st };
    }
    const orig = state.gear[LABEL];
    const baseline = measure();
    // candidate set: top 10 by IL + the current pick + ensure variety
    let cands = (gearOptionsForSlot(DATASLOT, state.class) || []).slice(0, 40);
    // de-dup by name, keep current first
    const seen = new Set(); const list = [];
    [orig, ...cands.map(c => c.name)].forEach(n => { if (n && !seen.has(n)) { seen.add(n); list.push(n); } });
    const rows = [];
    for (const nm of list.slice(0, 16)) {
      const it = findGearByName(nm, DATASLOT);
      state.gear[LABEL] = nm;
      const m = measure();
      rows.push({ name: nm, il: it && it.item_level, dmg: m.dmg, til: m.til, acc: m.st['Accuracy'],
        stats: it ? Object.keys(it.ratingStats || {}).join('+') : '' });
    }
    state.gear[LABEL] = orig; // restore
    rows.sort((a, b) => b.dmg - a.dmg);
    return { LABEL, orig, baseline, rows, tilFixed: rows.every(r => r.til === baseline.til) };
  }, LABEL, DATASLOT);

  console.log('PAGE ERRORS:', JSON.stringify(errs.slice(0, 3)));
  console.log(`\n===== SLOT: ${out.LABEL}  (current = ${out.orig}) =====`);
  console.log(`baseline: dmg ${out.baseline.dmg.toLocaleString()}  TIL ${out.baseline.til.toLocaleString()}  Accuracy ${out.baseline.st['Accuracy']}%`);
  console.log('TIL changes when gear swaps? ' + (out.tilFixed ? 'NO — TIL is fixed; swaps only change the item own stats' : 'YES — TIL moves with gear IL'));
  console.log('\n  damage      ΔvsCur     IL    Accuracy%   item stats                         name');
  for (const r of out.rows) {
    const d = (r.dmg - out.baseline.dmg);
    const mark = r.name === out.orig ? ' <= CURRENT' : '';
    console.log(`  ${String(r.dmg).padStart(9)}  ${(d >= 0 ? '+' : '') + d.toString().padStart(7)}  ${String(r.il).padStart(5)}  ${String(r.acc).padStart(8)}   ${(r.stats || '').padEnd(34)} ${r.name}${mark}`);
  }
  await b.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
