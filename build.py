#!/usr/bin/env python3
"""Gerador estático (só biblioteca padrão) do cursosdeunhas.com.br.
Uso:  python3 build.py         -> gera docs/ (publicada pelo GitHub Pages)
      python3 build.py --ping  -> avisa Bing/Yandex/Seznam/Naver via IndexNow
Edite products.json (cursos + hotlinks) e content/*.html (artigos)."""
import datetime, hashlib, html, json, pathlib, re, shutil, sys, urllib.request

R = pathlib.Path(__file__).resolve().parent
OUT = R / "docs"
S = json.loads((R / "site.json").read_text("utf-8"))
P = json.loads((R / "products.json").read_text("utf-8"))
BASE = S["url"].rstrip("/")
KEY = hashlib.sha1(S["domain"].encode()).hexdigest()[:32]
TODAY = datetime.date.today().isoformat()
ORG = {"@type": "Organization", "@id": BASE + "/#org", "name": S["name"], "url": BASE + "/", "logo": BASE + "/favicon.svg"}


def e(s):
    return html.escape(str(s), quote=True)


def br(d):
    return "/".join(reversed(d.split("-")))


CSS = (":root{--p:#a3245e;--t:#1f1a1d;--m:#5f565c;--b:#faf4f7;--l:#eadde4}*{box-sizing:border-box}"
       "body{margin:0;font:17px/1.65 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--t);background:#fff}"
       ".w{max-width:760px;margin:0 auto;padding:0 16px}a{color:var(--p)}"
       ".skip{position:absolute;left:-999px}.skip:focus{left:8px;top:8px;background:#fff;padding:8px}"
       ".top{border-bottom:1px solid var(--l);background:var(--b)}"
       ".top .w{display:flex;flex-wrap:wrap;gap:6px 18px;align-items:center;justify-content:space-between;padding-top:12px;padding-bottom:12px}"
       ".logo{font-weight:700;text-decoration:none;color:var(--t)}nav a{margin-right:14px;font-size:15px;text-decoration:none}"
       "h1{font-size:1.85rem;line-height:1.25;margin:20px 0 8px}h2{font-size:1.4rem;line-height:1.3;margin:32px 0 8px}h3{font-size:1.15rem;margin:22px 0 6px}"
       ".meta,.crumb{color:var(--m);font-size:14px}.crumb{margin-top:16px}.crumb a{color:var(--m)}"
       ".disc{background:var(--b);border-left:4px solid var(--p);padding:10px 14px;font-size:14px}"
       ".card{border:1px solid var(--l);border-radius:12px;padding:16px;margin:16px 0}"
       ".btn{display:inline-block;background:var(--p);color:#fff;text-decoration:none;padding:11px 18px;border-radius:10px;font-weight:600}"
       "table{width:100%;border-collapse:collapse;font-size:15px;display:block;overflow-x:auto}"
       "th,td{border:1px solid var(--l);padding:8px;text-align:left;vertical-align:top}th{background:var(--b)}"
       "details{border-bottom:1px solid var(--l);padding:10px 0}summary{cursor:pointer;font-weight:600}"
       "footer{margin-top:48px;border-top:1px solid var(--l);background:var(--b);font-size:14px;color:var(--m)}"
       "footer .w{padding-top:16px;padding-bottom:16px}footer a{color:var(--m);margin-right:14px}")


def render(m, body):
    path = m["path"]
    url = BASE + path
    kind = m.get("type", "article")
    upd = m.get("updated", TODAY)
    crumbs = [("Início", "/")] + ([] if path == "/" else [(m.get("crumb", m["h1"]), path)])
    graph = [ORG]
    if kind == "home":
        graph.append({"@type": "WebSite", "@id": BASE + "/#site", "name": S["name"], "url": BASE + "/",
                      "inLanguage": "pt-BR", "publisher": {"@id": ORG["@id"]}})
    else:
        graph.append({"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": n, "item": BASE + u} for i, (n, u) in enumerate(crumbs)]})
        if kind in ("article", "review"):
            art = {"@type": "Article", "headline": m["h1"], "description": m["desc"], "inLanguage": "pt-BR",
                   "datePublished": m.get("date", upd), "dateModified": upd, "author": {"@id": ORG["@id"]},
                   "publisher": {"@id": ORG["@id"]}, "mainEntityOfPage": url}
            if m.get("about"):
                art["about"] = m["about"]
            graph.append(art)
    ld = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False)
    crumb = "" if path == "/" else '<nav class="crumb" aria-label="Trilha"><a href="/">Início</a> › %s</nav>' % e(crumbs[-1][0])
    byline = ('<p class="meta">Por <a href="/sobre/">Equipe %s</a> · Atualizado em <time datetime="%s">%s</time></p>'
              % (e(S["name"]), upd, br(upd))) if kind in ("article", "review") else ""
    disc = ('<p class="disc"><strong>Transparência:</strong> alguns links deste site são de afiliado. Se você comprar por eles, '
            'podemos receber uma comissão, sem custo extra para você. Isso não altera nossas avaliações. '
            '<a href="/aviso-legal/">Saiba mais</a>.</p>') if kind in ("article", "review", "home") else ""
    ver = "".join('<meta name="%s" content="%s">' % (n, e(v)) for n, v in (
        ("google-site-verification", S["verify"].get("google")), ("msvalidate.01", S["verify"].get("bing"))) if v)
    robots = m.get("robots", "index,follow,max-image-preview:large,max-snippet:-1")
    ogtype = "website" if kind == "home" else "article"
    return f"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(m['title'])}</title>
<meta name="description" content="{e(m['desc'])}">
<link rel="canonical" href="{url}">
<meta name="robots" content="{robots}">
<meta property="og:type" content="{ogtype}">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="{e(S['name'])}">
<meta property="og:title" content="{e(m['title'])}">
<meta property="og:description" content="{e(m['desc'])}">
<meta property="og:url" content="{url}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#a3245e">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
{ver}<style>{CSS}</style>
<script type="application/ld+json">{ld}</script>
</head>
<body>
<a class="skip" href="#c">Pular para o conteúdo</a>
<header class="top"><div class="w"><a class="logo" href="/">💅 {e(S['name'])}</a><nav aria-label="Principal"><a href="/melhor-curso-de-unhas-online/">Melhores cursos</a><a href="/vale-a-pena-fazer-curso-de-unha-em-gel/">Vale a pena?</a><a href="/sobre/">Sobre</a></nav></div></header>
<main id="c" class="w">{crumb}<article>
<h1>{e(m['h1'])}</h1>{byline}{disc}
{body}
</article></main>
<footer><div class="w"><p><a href="/sobre/">Sobre e contato</a><a href="/politica-de-privacidade/">Privacidade</a><a href="/aviso-legal/">Aviso legal</a></p><p>© {TODAY[:4]} {e(S['name'])} · Site independente: não somos produtores dos cursos citados. Preços e condições podem mudar; confirme na página oficial.</p></div></footer>
</body>
</html>"""


def hot(p):
    return "/ir/%s/" % p["slug"]


def cards():
    if not P:
        return '<p class="card">Análises dos cursos em atualização.</p>'
    out = []
    for i, p in enumerate(P, 1):
        out.append(f"""<div class="card"><h3>{i}. {e(p['name'])}</h3><p class="meta">{e(p['producer'])} · {e(p['best'])}</p><p>{e(p['summary'])}</p><p><strong>Preço:</strong> {e(p['price'])} · <strong>Garantia:</strong> {e(p['guarantee'])} · <strong>Certificado:</strong> {e(p['certificate'])}</p><p><a href="/{p['slug']}/">Ler análise completa</a> &nbsp; <a class="btn" href="{hot(p)}" rel="sponsored nofollow">Ver página oficial</a></p></div>""")
    return "".join(out)


def table():
    if not P:
        return ""
    rows = "".join(f"<tr><td><a href='/{p['slug']}/'>{e(p['name'])}</a></td><td>{e(p['best'])}</td><td>{e(p['price'])}</td><td>{e(p['certificate'])}</td><td>{e(p['guarantee'])}</td></tr>" for p in P)
    return ("<table><thead><tr><th>Curso</th><th>Melhor para</th><th>Preço</th><th>Certificado</th><th>Garantia</th></tr></thead><tbody>"
            + rows + "</tbody></table>")


def ul(xs):
    return "<ul>" + "".join("<li>%s</li>" % e(x) for x in xs) + "</ul>"


def review_body(p):
    return f"""<p>{e(p['intro'])}</p>
<div class="card"><p><strong>Resumo:</strong> {e(p['verdict'])}</p><a class="btn" href="{hot(p)}" rel="sponsored nofollow">Ver condições na página oficial</a></div>
<h2>Ficha do curso</h2>
<table><tbody><tr><th>Produtor(a)</th><td>{e(p['producer'])}</td></tr><tr><th>Indicado para</th><td>{e(p['best'])}</td></tr><tr><th>Preço</th><td>{e(p['price'])}</td></tr><tr><th>Acesso</th><td>{e(p['access'])}</td></tr><tr><th>Certificado</th><td>{e(p['certificate'])}</td></tr><tr><th>Garantia</th><td>{e(p['guarantee'])}</td></tr></tbody></table>
<h2>O que o curso ensina</h2>{ul(p['modules'])}
<h2>Pontos fortes</h2>{ul(p['pros'])}
<h2>Pontos de atenção</h2>{ul(p['cons'])}
<h2>Para quem é indicado</h2>{ul(p['for'])}
<h2>Para quem não é</h2>{ul(p['notfor'])}
<h2>{e(p['name'])} vale a pena?</h2><p>{e(p['verdict'])}</p>
<h2>Como comprar com segurança</h2><p>Compre apenas pela página oficial, que tem checkout seguro. Pelo Código de Defesa do Consumidor, compras on-line têm direito de arrependimento em até 7 dias; confira também a garantia informada pelo produtor.</p>
<p><a class="btn" href="{hot(p)}" rel="sponsored nofollow">Acessar a página oficial</a></p>
<p class="meta">Como fizemos esta análise: reunimos as informações públicas da página oficial e da plataforma de vendas em {br(p.get('checked', TODAY))}. Não é depoimento de aluno; preços e condições podem mudar.</p>
<p>Compare com outras opções no nosso <a href="/melhor-curso-de-unhas-online/">ranking de cursos de unhas on-line</a>.</p>"""


def redirect(url):
    return ('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow">'
            '<title>Redirecionando…</title><meta http-equiv="refresh" content="0;url=%s"></head><body><p>Abrindo a página oficial… '
            '<a href="%s" rel="sponsored nofollow">clique aqui</a> se não abrir.</p><script>location.replace(%s)</script></body></html>'
            % (e(url), e(url), json.dumps(url)))


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    pages = []
    for f in sorted((R / "content").glob("*.html")):
        raw = f.read_text("utf-8")
        m = json.loads(re.match(r"<!--META(.*?)-->", raw, re.S).group(1))
        pages.append((m, raw.split("-->", 1)[1].strip().replace("{{CARDS}}", cards()).replace("{{TABLE}}", table())))
    for p in P:
        chk = p.get("checked", TODAY)
        pages.append(({"path": "/%s/" % p["slug"], "type": "review", "title": p["title"], "desc": p["desc"],
                       "h1": "%s vale a pena? Análise completa" % p["name"], "crumb": p["name"], "updated": chk, "date": chk,
                       "about": {"@type": "Course", "name": p["name"], "description": p["summary"],
                                 "provider": {"@type": "Person", "name": p["producer"]}}}, review_body(p)))
        d = OUT / "ir" / p["slug"]
        d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(redirect(p["hotlink"]), "utf-8")
    urls = []
    for m, body in pages:
        d = OUT / m["path"].strip("/")
        d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(render(m, body), "utf-8")
        if "noindex" not in m.get("robots", ""):
            urls.append((BASE + m["path"], m.get("updated", TODAY)))
    (OUT / "404.html").write_text(render(
        {"path": "/404.html", "type": "page", "title": "Página não encontrada | " + S["name"], "crumb": "Erro 404",
         "desc": "A página procurada não existe ou mudou de endereço.", "h1": "Página não encontrada", "robots": "noindex,follow"},
        '<p>Essa página não existe ou mudou de endereço. <a href="/">Voltar ao início</a> ou veja os '
        '<a href="/melhor-curso-de-unhas-online/">melhores cursos de unhas on-line</a>.</p>'), "utf-8")
    sm = "".join("<url><loc>%s</loc><lastmod>%s</lastmod></url>" % u for u in urls)
    (OUT / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
                                     + sm + "</urlset>\n", "utf-8")
    (OUT / "robots.txt").write_text("User-agent: *\nAllow: /\nDisallow: /ir/\n\nSitemap: %s/sitemap.xml\n" % BASE, "utf-8")
    (OUT / "CNAME").write_text(S["domain"] + "\n", "utf-8")
    (OUT / ".nojekyll").write_text("", "utf-8")
    (OUT / (KEY + ".txt")).write_text(KEY, "utf-8")
    shutil.copy(R / "static" / "favicon.svg", OUT / "favicon.svg")
    for extra in (R / "static").glob("google*.html"):
        shutil.copy(extra, OUT / extra.name)
    (OUT / "llms.txt").write_text("# %s\n\n> %s\n\n" % (S["name"], S["tagline"]) + "".join(
        "- [%s](%s%s): %s\n" % (m["h1"], BASE, m["path"], m["desc"]) for m, _ in pages if "noindex" not in m.get("robots", "")), "utf-8")
    audit(len(urls))


def audit(n):
    files = {str(x.relative_to(OUT)) for x in OUT.rglob("*") if x.is_file()}
    bad = 0
    for f in OUT.rglob("*.html"):
        rel = str(f.relative_to(OUT))
        if rel.startswith("ir/") or rel.startswith("google"):
            continue
        t = f.read_text("utf-8")
        title = html.unescape(re.search(r"<title>(.*?)</title>", t).group(1))
        desc = html.unescape(re.search(r'name="description" content="(.*?)"', t).group(1))
        probs = []
        if not 20 <= len(title) <= 65:
            probs.append("title=%d" % len(title))
        if not 70 <= len(desc) <= 160:
            probs.append("desc=%d" % len(desc))
        if t.count("<h1") != 1:
            probs.append("h1")
        for href in re.findall(r"href=[\"'](/[^\"'#]*)[\"']", t):
            k = href.strip("/")
            k = k + "/index.html" if k and "." not in k.split("/")[-1] else (k or "index.html")
            if k not in files:
                probs.append("link:" + href)
        if probs:
            bad += 1
            print("AVISO", rel, probs)
    print("OK: %d URLs no sitemap, %d páginas com aviso. IndexNow key: %s" % (n, bad, KEY))


def ping():
    urls = re.findall(r"<loc>(.*?)</loc>", (OUT / "sitemap.xml").read_text("utf-8"))
    data = json.dumps({"host": S["domain"], "key": KEY, "keyLocation": "%s/%s.txt" % (BASE, KEY), "urlList": urls}).encode()
    req = urllib.request.Request("https://api.indexnow.org/indexnow", data=data,
                                 headers={"Content-Type": "application/json; charset=utf-8"})
    print("IndexNow HTTP", urllib.request.urlopen(req, timeout=30).status, "-", len(urls), "URLs")


if __name__ == "__main__":
    ping() if "--ping" in sys.argv else main()
