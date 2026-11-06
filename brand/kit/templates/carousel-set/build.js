// Renders carousel-set.html to carousel-set.pdf and per-slide PNG previews.
// Usage: NODE_PATH=$(npm root -g) node brand/kit/templates/carousel-set/build.js
const {chromium}=require('playwright');const path=require('path');
(async()=>{const d=__dirname;const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1080,height:1350}});
await p.goto('file://'+path.join(d,'placeholder.html'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);
await p.screenshot({path:path.join(d,'placeholder-photo.png')});
await p.goto('file://'+path.join(d,'carousel-set.html'),{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(600);
await p.pdf({path:path.join(d,'carousel-set.pdf'),width:'1080px',height:'1350px',printBackground:true});
const s=await p.locator('.s').all();for(let i=0;i<s.length;i++)await s[i].screenshot({path:path.join(d,`preview-${String(i+1).padStart(2,'0')}.png`)});
console.log('slides',s.length);await b.close();})();
