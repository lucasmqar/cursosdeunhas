const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DOCS = require('path').resolve(process.argv[2] || __dirname + '/../docs');
function serve(route) {
  const u = new URL(route.request().url()); let p = path.join(DOCS, decodeURIComponent(u.pathname));
  if (p.endsWith('/')) p += 'index.html';
  if (!fs.existsSync(p)) return route.fulfill({ status: 404, body: 'nf' });
  return route.fulfill({ status: 200, contentType: p.endsWith('.html') ? 'text/html; charset=utf-8' : 'image/svg+xml', body: fs.readFileSync(p) });
}
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext();
  await ctx.route('https://cursosdeunhas.com.br/**', serve);
  await ctx.route(/googletagmanager|facebook|clarity/, r => r.abort());
  const pages = fs.readFileSync(path.join(DOCS, 'sitemap.xml'), 'utf8').match(/<loc>[^<]+/g).map(x => x.slice(5).replace('https://cursosdeunhas.com.br', '')).concat(['/comecar/']);
  let tot = 0, bad = 0;
  for (const p of pages) {
    const pg = await ctx.newPage();
    // 1) chegada com os IDs na URL; 2) página seguinte da mesma aba, sem nada na URL (IDs vêm da sessão)
    for (const [label, url] of [['url', p + '?src=gads-f1&gclid=GC1&fbclid=FB1'], ['sessao', p]]) {
      await pg.goto('https://cursosdeunhas.com.br' + url, { waitUntil: 'domcontentloaded' });
      const links = await pg.$$eval('a[href*="/ir/"]', as => as.map(a => a.href));
      for (const h of links) { tot++; const q = new URL(h).searchParams; if (q.get('src') !== 'gads-f1' || q.get('gclid') !== 'GC1' || q.get('fbclid') !== 'FB1') { bad++; console.log('FALTA', label, p, h) } }
      if (label === 'url') console.log(p, links.length, 'links de saída');
    }
    await pg.close();
  }
  console.log('total', tot, 'sem src/gclid', bad); await b.close();
})();
