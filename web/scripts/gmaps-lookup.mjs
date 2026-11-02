// Looks up exact coordinates and the street address of places on Google Maps by
// reading the place data Google's own page loads in a headless browser.
//
// Usage:  node web/scripts/gmaps-lookup.mjs input.json output.json [concurrency]
//   input.json  = [{ "id": "...", "name": "...", "hood": "...", "url": "<google maps place or search URL>" }]
//   output.json = { id: { name, hood, url, cands: [{ name, lat, lng, address }] } }
//
// Needs Playwright (`npm i -D playwright` + `npx playwright install chromium`).
// ALWAYS check that the returned name and address match the venue before using
// a result: search URLs sometimes return a different business. Validate against
// a few places with known-exact coordinates first.
import { chromium } from 'playwright';
import fs from 'fs';
const [,, inFile, outFile, conc='3'] = process.argv;
const items = JSON.parse(fs.readFileSync(inFile));
let res = {}; try { res = JSON.parse(fs.readFileSync(outFile)); } catch {}
const todo = items.filter(i => !(i.id in res));
const launchOpts = process.env.HTTPS_PROXY ? { proxy:{ server:process.env.HTTPS_PROXY } } : {};
const b = await chromium.launch(launchOpts);
const ctx = await b.newContext({ locale:'es-MX', userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36', viewport:{width:1200,height:800} });
function cands(t){
  t=t.replace(/^\)\]\}'\s*/,''); const i=t.lastIndexOf('/*""*/'); if(i>0) t=t.slice(0,i);
  let j; try{ j=JSON.parse(t.slice(t.indexOf('\n')+1)||t); }catch{ try{ j=JSON.parse(t);}catch{ return []; } }
  const out=[];
  (function walk(x,d){ if(!Array.isArray(x)||d>9) return;
    if(Array.isArray(x[9])&&typeof x[9][2]==='number'&&typeof x[9][3]==='number'&&typeof x[11]==='string') out.push({name:x[11],lat:x[9][2],lng:x[9][3],address:x[18]||x[39]||null});
    for(const y of x) walk(y,d+1); })(j,0);
  return out;
}
async function one(it){
  const p = await ctx.newPage(); let got=null;
  p.on('response', async r => { const u=r.url(); if(!got && /google\.com\/(search\?tbm=map|maps\/preview\/place)/.test(u)){ try{ const c=cands(await r.text()); if(c.length) got=c; }catch{} } });
  try{ await p.goto(it.url,{waitUntil:'domcontentloaded',timeout:30000}); for(let k=0;k<26&&!got;k++) await p.waitForTimeout(500); }catch(e){}
  await p.close(); return got;
}
let idx=0,done=0;
async function worker(){ while(idx<todo.length){ const it=todo[idx++]; const c=await one(it); res[it.id]={name:it.name,hood:it.hood,url:it.url,cands:c||[]}; done++; if(done%10===0){fs.writeFileSync(outFile,JSON.stringify(res));console.log(done,todo.length);} await new Promise(r=>setTimeout(r,800+Math.random()*700)); } }
await Promise.all(Array.from({length:+conc},worker));
fs.writeFileSync(outFile,JSON.stringify(res,null,1)); console.log('DONE'); await b.close();
