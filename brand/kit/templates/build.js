const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const D='/home/user/cdmx/brand/kit/templates/';
const specs=[['cover',1080,1350,'1-carousel-cover'],['closing',1080,1350,'2-carousel-closing'],['story',1080,1920,'3-story']];
for(const [t,w,h,n] of specs) for(const txt of [0,1]){
 const p=await b.newPage({viewport:{width:w,height:h}});
 await p.goto('file://'+D+'templates.html');
 await p.evaluate(([t,txt])=>{document.body.dataset.t=t;document.body.dataset.text=txt;return document.fonts.ready},[t,txt]);await p.waitForTimeout(600);
 await p.screenshot({path:D+(txt?`${n}-preview.png`:`${n}-bg.png`)});await p.close()}
// highlight covers
const icons={eat:'chef-hat',drinks:'martini',coffee:'coffee',tacos:'flame','new-and-hot':'sparkles',mapa:'map'};
const cols={eat:['#4A0B18','#F7CAD8'],drinks:['#E0368C','#2A0710'],coffee:['#F7CAD8','#4A0B18'],tacos:['#2A0710','#F4A9C8'],'new-and-hot':['#F7CAD8','#E0368C'],mapa:['#4A0B18','#E0368C']};
const fs=require('fs');
for(const [k,ic] of Object.entries(icons)){
 let svg=fs.readFileSync('/home/user/cdmx/web/public/icons/lucide-0.460.0/'+ic+'.svg','utf8');
 const [bg,fg]=cols[k];
 svg=svg.replace(/stroke="currentColor"/g,`stroke="${fg}"`).replace(/width="24"/,'width="300"').replace(/height="24"/,'height="300"').replace(/stroke-width="2"/,'stroke-width="1.4"');
 const p=await b.newPage({viewport:{width:1080,height:1920}});
 await p.setContent(`<body style="margin:0;width:1080px;height:1920px;background:${bg};display:flex;align-items:center;justify-content:center">${svg}</body>`);
 await p.screenshot({path:D+`highlight-${k}.png`});await p.close()}
await b.close()})();
