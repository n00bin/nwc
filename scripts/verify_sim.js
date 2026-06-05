const fs=require('fs'),path=require('path'),puppeteer=require('puppeteer-core');
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const LINK=path.join(__dirname,'..','docs','best_build_warlock_dps_bis.link.txt');
(async()=>{
 const url=fs.readFileSync(LINK,'utf8').trim().replace('https://n00bin.github.io/nwc/','http://127.0.0.1:8765/');
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--disable-gpu']});
 const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
 await p.goto(url,{waitUntil:'networkidle2',timeout:60000}); await new Promise(r=>setTimeout(r,2500));
 const out=await p.evaluate(()=>{
   if(typeof gotoStep==='function')gotoStep(6);
   const mag=document.getElementById('sim-mag'); if(mag){mag.value=900;}
   renderSim();
   const hero=document.querySelector('.sim-hero-value');
   const cards=[...document.querySelectorAll('.sim-card')].map(c=>({
     sc:c.querySelector('.sim-card-title')?.innerText.trim(),
     vals:[...c.querySelectorAll('.sim-card-stat-value')].map(v=>v.innerText.trim())}));
   const note=document.querySelector('.sim-body, #sim-body')?.innerText.match(/crit chance[^.]*\./i);
   return {hero:hero&&hero.textContent, nCards:cards.length, cards,
     noteHasCrit: !!document.body.innerText.match(/crit chance \d+%/i)};
 });
 console.log('PAGE ERRORS:',JSON.stringify(errs.slice(0,3)));
 console.log('hero:',out.hero,'| cards:',out.nCards,'| note shows crit chance:',out.noteHasCrit);
 out.cards.forEach(c=>console.log('  ',c.sc,'->',c.vals.join(' / ')));
 await b.close();
})().catch(e=>{console.error('FATAL',e);process.exit(1)});
