const fs=require('fs'),path=require('path'),puppeteer=require('puppeteer-core');
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const LINK=path.join(__dirname,'..','docs','best_build_warlock_dps_bis.link.txt');
(async()=>{
 const url=fs.readFileSync(LINK,'utf8').trim().replace('https://n00bin.github.io/nwc/','http://127.0.0.1:8765/');
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--disable-gpu']});
 const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
 await p.goto(url,{waitUntil:'networkidle2',timeout:60000}); await new Promise(r=>setTimeout(r,2500));
 const note=await p.evaluate(()=>{ if(typeof gotoStep==='function')gotoStep(6); renderSim();
   const el=document.getElementById('sim-body')||document.querySelector('.sim-body');
   const m=(el?el.innerText:'').match(/You crit about[^]*?average\.?/); return m?m[0]:'(note not found)'; });
 console.log('PAGE ERRORS:',JSON.stringify(errs.slice(0,3)));
 console.log('NOTE:',note);
 await b.close();
})().catch(e=>{console.error('FATAL',e);process.exit(1)});
