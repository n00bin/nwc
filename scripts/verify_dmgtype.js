const fs=require('fs'),path=require('path'),puppeteer=require('puppeteer-core');
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const LINK=path.join(__dirname,'..','docs','best_build_warlock_dps_bis.link.txt');
(async()=>{
 const url=fs.readFileSync(LINK,'utf8').trim().replace('https://n00bin.github.io/nwc/','http://127.0.0.1:8765/');
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--disable-gpu']});
 const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
 await p.goto(url,{waitUntil:'networkidle2',timeout:60000}); await new Promise(r=>setTimeout(r,2500));
 const out=await p.evaluate(()=>{
   if(typeof gotoStep==='function')gotoStep(6); renderSim();
   const sel=document.getElementById('sim-type');
   const hero=()=>Number(document.querySelector('.sim-hero-value').textContent.replace(/[^0-9.]/g,''));
   const r=getEngineResult();
   const def={selValue:sel.value, dmg:hero()};                 // default (should sync to class=Magical)
   sel.value='Physical'; sel.dispatchEvent(new Event('change')); // user picks Physical
   const phys={selValue:sel.value, dmg:hero()};
   sel.value='Magical'; sel.dispatchEvent(new Event('change'));
   const mag={selValue:sel.value, dmg:hero()};
   return {buckets:{magical:r.damageBoosts.magical, physical:r.damageBoosts.physical}, def, phys, mag};
 });
 console.log('PAGE ERRORS:',JSON.stringify(errs.slice(0,3)));
 console.log('damage buckets: magical',out.buckets.magical,' physical',out.buckets.physical);
 console.log('default dropdown:',out.def.selValue,'-> dmg',out.def.dmg.toLocaleString());
 console.log('set Physical:    ',out.phys.selValue,'-> dmg',out.phys.dmg.toLocaleString());
 console.log('set Magical:     ',out.mag.selValue,'-> dmg',out.mag.dmg.toLocaleString());
 await b.close();
})().catch(e=>{console.error('FATAL',e);process.exit(1)});
