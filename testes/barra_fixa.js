const { chromium } = require('playwright');const fs=require('fs'),path=require('path');
const D=require('path').resolve(process.argv[2]||__dirname+'/../docs');
function serve(route){const u=new URL(route.request().url());let p=path.join(D,decodeURIComponent(u.pathname));if(p.endsWith('/'))p+='index.html';if(!fs.existsSync(p))return route.fulfill({status:404,body:'nf'});return route.fulfill({status:200,contentType:p.endsWith('.html')?'text/html; charset=utf-8':'image/svg+xml',body:fs.readFileSync(p)})}
(async()=>{const b=await chromium.launch();
for(const w of [320,375]){const ctx=await b.newContext({viewport:{width:w,height:640},isMobile:true,hasTouch:true});await ctx.route('https://cursosdeunhas.com.br/**',serve);await ctx.route(/googletagmanager|facebook|clarity/,r=>r.abort());
const pg=await ctx.newPage();await pg.goto('https://cursosdeunhas.com.br/nail-academy/?gclid=G1');
console.log(w, await pg.$$eval('a.btn-cta',as=>as.map(a=>Math.round(a.getBoundingClientRect().height)).join(',')));
await pg.evaluate(()=>scrollTo(0,1400));await pg.waitForTimeout(300);
console.log('barra', await pg.evaluate(()=>{const b=document.getElementById('cta-fixo');const a=b.querySelector('a');return JSON.stringify({vis:!b.hidden,h:Math.round(b.getBoundingClientRect().height),btnH:Math.round(a.getBoundingClientRect().height),href:a.href.replace(/^.*?\?/,'?'),pad:document.body.style.paddingBottom})}));
await pg.screenshot({path:`/tmp/barra-${w}.png`});await ctx.close()}
await b.close()})();
