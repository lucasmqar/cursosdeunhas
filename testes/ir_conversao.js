// Teste do /ir/: conversão do Google Ads sai antes do redirecionamento? src/gclid chegam à Hotmart?
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DOCS = require('path').resolve(process.argv[2] || __dirname + '/../docs');
const sleep = ms => new Promise(r => setTimeout(r, ms));
function serve(route) {
  const u = new URL(route.request().url());
  let p = path.join(DOCS, decodeURIComponent(u.pathname));
  if (p.endsWith('/')) p += 'index.html';
  if (!fs.existsSync(p)) return route.fulfill({ status: 404, body: 'nf' });
  const ct = p.endsWith('.html') ? 'text/html; charset=utf-8' : p.endsWith('.svg') ? 'image/svg+xml' : 'text/plain';
  return route.fulfill({ status: 200, contentType: ct, body: fs.readFileSync(p) });
}
// gtm.js de mentira: espera "proc" ms (GTM + gtag) e manda o hit de conversão como o gtag faz
const gtmStub = (mode, proc) => `(function(){if(location.pathname.indexOf('/ir/')!==0)return;setTimeout(function(){var q=new URLSearchParams(location.search),g=q.get('gclid')||'';
var u='https://www.googleadservices.com/pagead/conversion/18563480938/?label=TESTE&gclid='+g;
if(${JSON.stringify(mode)}==='img'){var i=new Image();i.src=u;return}
fetch(u,{keepalive:true,mode:'no-cors',credentials:'include'}).catch(function(){fetch(u.replace('/conversion/','/1p-conversion/'),{keepalive:true,mode:'no-cors'}).catch(function(){})})},${proc})})();`;
const fbStub = `window.fbq=window.fbq||function(){};`;
async function scenario(name, o) {
  const b = await chromium.launch();
  const ctx = await b.newContext(o.mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' } : {});
  const T = { t0: 0 }; const log = [];
  const now = () => Date.now() - T.t0;
  await ctx.route('https://cursosdeunhas.com.br/**', serve);
  await ctx.route('https://www.googletagmanager.com/**', async r => {
    if (o.gtm === 'block') return r.abort('blockedbyclient');
    await sleep(o.gtm); r.fulfill({ contentType: 'application/javascript', body: gtmStub(o.hit || 'fetch', o.proc ?? 100) });
  });
  await ctx.route('https://www.googleadservices.com/**', async r => {
    const kind = r.request().url().includes('1p-') ? '1p' : 'conv';
    log.push([kind + ':inicio', now()]);
    if (o.conv === 'block') return r.abort('blockedbyclient');
    await sleep(o.conv); log.push([kind + ':fim', now()]); r.fulfill({ status: 200, body: '' }).catch(() => log.push([kind + ':cancelado', now()]));
  });
  await ctx.route('https://connect.facebook.net/**', async r => { if (o.fb === 'block') return r.abort('blockedbyclient'); await sleep(o.fb || 50); r.fulfill({ contentType: 'application/javascript', body: fbStub }) });
  await ctx.route('https://www.clarity.ms/**', r => r.abort());
  await ctx.route('https://hotmart.com/**', r => { log.push(['hotmart', now(), r.request().url()]); r.fulfill({ contentType: 'text/html', body: 'hotmart' }) });
  await ctx.route('https://pay.hotmart.com/**', r => { log.push(['hotmart', now(), r.request().url()]); r.fulfill({ contentType: 'text/html', body: 'pay' }) });
  await ctx.route('https://go.hotmart.com/**', r => { log.push(['hotmart', now(), r.request().url()]); r.fulfill({ contentType: 'text/html', body: 'go' }) });
  const pg = await ctx.newPage();
  let res;
  if (o.entry) {
    await pg.goto('https://cursosdeunhas.com.br' + o.entry, { waitUntil: 'load' });
    await sleep(300);
    const a = pg.locator(o.click || 'main a.btn-primary').first();
    T.t0 = Date.now();
    await a.click();
  } else {
    T.t0 = Date.now();
    pg.goto('https://cursosdeunhas.com.br' + o.ir).catch(() => {});
  }
  for (let i = 0; i < 100 && !log.find(l => l[0] === 'hotmart'); i++) await sleep(50);
  await sleep(Math.max(o.conv || 0, 300) + 200);
  const h = log.find(l => l[0] === 'hotmart');
  const ini = log.find(l => /:inicio/.test(l[0]));
  const ok = ini && h && ini[1] <= h[1];
  res = { cenario: name, redireciona_ms: h && h[1], conversao_inicia_ms: ini ? ini[1] : null, conversao_antes: !!ok, url: h && h[2].replace(/^https:\/\/[^?]+/, ''), log: log.map(l => l[0] + '@' + l[1]).join(' ') };
  await b.close();
  return res;
}
(async () => {
  const IR = '/ir/nail-academy/?src=gads-a0&gclid=GCLIDTESTE';
  const S = [
    ['rapida (gtm em cache, hit 150 ms)', { ir: IR, gtm: 20, proc: 80, conv: 150 }],
    ['4G lenta (gtm 300 ms, hit 600 ms)', { ir: IR, gtm: 300, proc: 150, conv: 600 }],
    ['3G sem cache (gtm 1,5 s)', { ir: IR, gtm: 1500, proc: 200, conv: 800 }],
    ['3G muito lenta sem cache (gtm 2,5 s)', { ir: IR, gtm: 2500, proc: 300, conv: 1000 }],
    ['GTM carrega mas nao manda hit (consentimento/configuracao)', { ir: IR, gtm: 20, proc: 99999, conv: 100 }],
    ['GTM sem cache 600 ms, sem hit', { ir: IR, gtm: 600, proc: 99999, conv: 100 }],
    ['bloqueador (gtm.js bloqueado)', { ir: IR, gtm: 'block', conv: 100 }],
    ['bloqueador so da conversao', { ir: IR, gtm: 20, proc: 80, conv: 'block' }],
    ['hit por imagem (Safari sem keepalive) 400 ms', { ir: IR, gtm: 20, proc: 80, conv: 400, hit: 'img' }],
    ['ponta a ponta: analise -> botao (celular)', { entry: '/nail-academy/?gclid=GCLIDTESTE', gtm: 20, proc: 80, conv: 200, mobile: true }],
    ['ponta a ponta: comecar -> caminho 2', { entry: '/comecar/?src=meta-n4&fbclid=FBTESTE', click: '#caminho-2 a.btn-primary', gtm: 20, proc: 80, conv: 200, mobile: true }],
    ['ponta a ponta: comparativo -> checkout direto', { entry: '/melhor-curso-de-unhas-online/?gbraid=GBRAIDTESTE', click: 'a.link-direto', gtm: 20, proc: 80, conv: 200 }],
  ];
  const only = process.argv[3];
  for (const [n, o] of S) { if (only && !n.includes(only)) continue; console.log(JSON.stringify(await scenario(n, o))); }
})();
