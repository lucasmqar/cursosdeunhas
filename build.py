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


TAG = "<script>window.dataLayer=window.dataLayer||[];dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});</script><script async src=\"https://www.googletagmanager.com/gtm.js?id=GTM-MMW9HHNS\"></script><script>function gtag(){dataLayer.push(arguments)}gtag('js',new Date());</script>"


MP = S.get("meta_pixel", "")
PIXEL = ("<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};"
         "if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];"
         "s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','%s');fbq('track','PageView');</script>" % MP) if MP else ""
# origem da visita (src) que precisa chegar à Hotmart: vem da URL (?src=, ou gclid/gbraid/wbraid = Google Ads),
# fica na sessão da aba e é acrescentada a todo link /ir/ (inclusive saindo das páginas de análise).
SRCJS = ("<script>(function(){try{var q=new URLSearchParams(location.search),s=q.get('src'),K='cdu_src';"
         "if(!s&&(q.get('gclid')||q.get('gbraid')||q.get('wbraid')))s='gads';"
         "if(s){s=s.replace(/[^a-z0-9_-]/gi,'').slice(0,30);try{sessionStorage.setItem(K,s)}catch(e){}}"
         "else{try{s=sessionStorage.getItem(K)}catch(e){}}if(!s)return;window.cduSrc=s;"
         "var fix=function(){document.querySelectorAll('a[href*=\"/ir/\"]').forEach(function(a){if(a.href.indexOf('src=')<0)"
         "a.href+=(a.href.indexOf('?')<0?'?':'&')+'src='+encodeURIComponent(s)})};"
         "document.readyState=='loading'?document.addEventListener('DOMContentLoaded',fix):fix()}catch(e){}})();</script>")
CL = S.get("clarity", "")
if CL:
    PIXEL += ('<script>(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;'
              't.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","%s");</script>' % CL)


def e(s):
    return html.escape(str(s), quote=True)


def br(d):
    return "/".join(reversed(d.split("-")))


BOOTSTRAP = ('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" '
             'integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">')
# só sobreposições de marca (contraste medido: branco sobre ameixa #6E1F45 ≈ 10:1; ameixa sobre branco ≈ 10:1)
CSS = (":root{--bs-link-color:#6E1F45;--bs-link-color-rgb:110,31,69;--bs-link-hover-color:#4f1631;--bs-link-hover-color-rgb:79,22,49}"
       ".btn-primary{--bs-btn-bg:#6E1F45;--bs-btn-border-color:#6E1F45;--bs-btn-hover-bg:#5a1838;--bs-btn-hover-border-color:#5a1838;"
       "--bs-btn-active-bg:#4f1631;--bs-btn-active-border-color:#4f1631;--bs-btn-focus-shadow-rgb:110,31,69}"
       ".badge-uso{background:#F6EDE8;color:#6E1F45;border:1px solid #e3cfd8;font-weight:600}"
       "summary{cursor:pointer}.leitura{max-width:860px}")

# todas as rotas (preenchido em main antes de renderizar): rodapé global
ROUTES = []


def footer():
    li = "".join('<li class="nav-item"><a class="nav-link px-0 link-secondary" href="%s">%s</a></li>' % (u, e(n)) for n, u in ROUTES)
    return (f'<footer class="border-top mt-5 py-4 small"><div class="container leitura"><nav aria-label="Todas as páginas">'
            f'<ul class="nav flex-column flex-md-row flex-md-wrap column-gap-3 row-gap-1">{li}</ul></nav>'
            f'<p class="text-body-secondary mt-3 mb-0">© {TODAY[:4]} {e(S["name"])} · Guia independente: não somos produtores dos cursos. '
            'Se você comprar pelos nossos links, recebemos comissão da Hotmart, sem custo extra para você. '
            'Preços e condições podem mudar; confirme na página oficial. <a href="/aviso-legal/">Aviso legal</a> · '
            '<a href="/politica-de-privacidade/">Privacidade</a></p></div></footer>')


def bs(body):
    """aplica classes do Bootstrap ao HTML simples dos artigos (content/*.html)"""
    body = re.sub(r"<table>(.*?)</table>", r'<div class="table-responsive"><table class="table table-sm align-middle">\1</table></div>', body, flags=re.S)
    return (body
            .replace("<details>", '<details class="border rounded-3 p-3 mb-2">').replace("<summary>", '<summary class="fw-semibold">')
            .replace('class="box"', 'class="border rounded-3 p-3 mb-3"').replace('class="m"', 'class="small text-body-secondary"')
            .replace('class="meta"', 'class="small text-body-secondary"'))


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
    elif "noindex" not in m.get("robots", ""):
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
    crumb = "" if path == "/" else ('<nav aria-label="Trilha"><ol class="breadcrumb small mt-3 mb-2"><li class="breadcrumb-item"><a href="/">Início</a></li>'
                                     '<li class="breadcrumb-item active" aria-current="page">%s</li></ol></nav>' % e(crumbs[-1][0]))
    disc = ('<p class="small text-body-secondary border-start border-3 ps-2">Se você comprar pelos nossos links, recebemos comissão da Hotmart. '
            'O preço para você é o mesmo. <a href="/aviso-legal/">Como funciona</a></p>') if kind in ("article", "review", "home") else ""
    byline = ('<p class="small text-body-secondary">Por <a href="/sobre/">Equipe %s</a> · Atualizado em <time datetime="%s">%s</time>%s</p>'
              % (e(S["name"]), upd, br(upd), ' · <a href="#como-avaliamos">Como avaliamos</a>' if m.get("como") else "")) if kind in ("article", "review", "home") else ""
    ver = "".join('<meta name="%s" content="%s">' % (n, e(v)) for n, v in (
        ("google-site-verification", S["verify"].get("google")), ("msvalidate.01", S["verify"].get("bing"))) if v)
    robots = m.get("robots", "index,follow,max-image-preview:large,max-snippet:-1")
    ogtype = "website" if kind == "home" else "article"
    return f"""<!doctype html>
<html lang="pt-BR" data-bs-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(m['title'])}</title>
<meta name="description" content="{e(m['desc'])}">
{'' if 'noindex' in robots else f'<link rel="canonical" href="{url}">'}
<meta name="robots" content="{robots}">
<meta property="og:type" content="{ogtype}">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="{e(S['name'])}">
<meta property="og:title" content="{e(m['title'])}">
<meta property="og:description" content="{e(m['desc'])}">
<meta property="og:url" content="{url}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
{ver}{TAG}{PIXEL}{SRCJS}
{BOOTSTRAP}<style>{CSS}</style>
<script type="application/ld+json">{ld}</script>
</head>
<body>
<a class="visually-hidden-focusable" href="#c">Pular para o conteúdo</a>
<header class="border-bottom"><nav class="navbar" aria-label="Principal"><div class="container leitura"><a class="navbar-brand fw-semibold" href="/">{e(S['name'])}</a><div class="d-flex gap-3"><a class="nav-link" href="/melhor-curso-de-unhas-online/">Comparativo</a><a class="nav-link" href="/comecar/">Por onde começar</a></div></div></nav></header>
<main id="c" class="container leitura">{crumb}<article class="pt-2">
<h1 class="h2 mt-3">{e(m['h1'])}</h1>{disc}{byline}
{bs(body)}
</article></main>
{footer()}
</body>
</html>"""


def hot(p):
    return "/ir/%s/" % p["slug"]


def ck(p):
    """checkout direto da Hotmart, com o código de afiliado na URL (ref=); cai na página de vendas se não houver"""
    return "/ir/%s/checkout/" % p["slug"] if p.get("checkout") else hot(p)


def short(p):
    return p['price'].split(' (')[0]


# ordem de exibição: do mais simples ao mais avançado; rótulo de uso (badge) por curso
ORDEM = ["curso-de-manicure-e-pedicure-profissional", "nail-academy", "escola-designer-de-unhas"]
USO = {"curso-de-manicure-e-pedicure-profissional": "Para começar do zero, mais barato",
       "nail-academy": "Mais completo, do zero ao alongamento",
       "escola-designer-de-unhas": "Para quem já faz unhas"}


def ordenados():
    return sorted(P, key=lambda p: ORDEM.index(p["slug"]) if p["slug"] in ORDEM else 9)


def aviso_cta():
    return '<p class="small text-body-secondary mt-2 mb-0">Link de parceria: recebemos comissão, sem custo extra para você.</p>'


def ctas(p, w100=False):
    cls = "btn btn-primary btn-lg" + (" w-100" if w100 else "")
    direto = (f'<a class="link-secondary small d-inline-block py-2" href="{ck(p)}" rel="sponsored nofollow">ou ir direto para o pagamento</a>'
              if p.get("checkout") else "")
    return f'<a class="{cls}" href="{hot(p)}" rel="sponsored nofollow">Ver o curso na Hotmart<span class="visually-hidden">: {e(p["name"])}</span></a>{aviso_cta()}{direto}'


def attrs(p):
    rows = (("Para quem", p["best"]), ("Preço", f"{short(p)} (conferido em {br(p.get('checked', TODAY))})"),
            ("Certificado", p["certificate"]), ("Acesso", p["access"]), ("Garantia", p["guarantee"]))
    return "".join(f'<li class="list-group-item d-flex justify-content-between gap-3"><span class="text-body-secondary">{k}</span><span class="text-end">{e(v)}</span></li>' for k, v in rows)


def cards():
    if not P:
        return '<p>Análises dos cursos em atualização.</p>'
    out = []
    for p in ordenados():
        out.append(f"""<div class="col"><article class="card h-100"><div class="card-body"><span class="badge badge-uso mb-2">{e(USO.get(p['slug'], p['best']))}</span>
<h3 class="card-title h5"><a class="link-body-emphasis" href="/{p['slug']}/">{e(p['name'])}</a></h3><p class="card-text">{e(p['summary'])}</p></div>
<ul class="list-group list-group-flush small">{attrs(p)}</ul><div class="card-footer bg-transparent border-0 pb-3">{ctas(p, True)}</div></article></div>""")
    return '<div class="row row-cols-1 row-cols-md-3 g-3 my-3">' + "".join(out) + "</div>"


def table():
    if not P:
        return ""
    ps = ordenados()
    head = "".join(f'<th scope="col"><a href="/{p["slug"]}/">{e(p["name"])}</a></th>' for p in ps)
    linhas = (("À vista", lambda p: short(p).replace(" à vista", "")), ("Certificados", lambda p: p.get("cert_short", p["certificate"])),
              ("Acesso", lambda p: p["access"]), ("Garantia", lambda p: p["guarantee"]), ("Para quem", lambda p: p["best"]))
    body = "".join(f'<tr><th scope="row">{k}</th>' + "".join(f"<td>{e(f(p))}</td>" for p in ps) + "</tr>" for k, f in linhas)
    data = br(max(p.get("checked", TODAY) for p in ps))
    return (f'<div class="table-responsive"><table class="table table-sm align-middle"><caption class="caption-top">Preços conferidos em {data}</caption>'
            f'<thead><tr><td></td>{head}</tr></thead><tbody>{body}</tbody></table></div>')


def secoes():
    out = []
    for n, p in enumerate(ordenados(), 1):
        out.append(f"""<section class="mt-4"><h2 class="h4">{n}. {e(p['name'])}: {e(USO.get(p['slug'], p['best']).lower())}</h2><p>{e(p['verdict'])}</p>
<div class="row g-3"><div class="col-md-6"><div class="border rounded-3 p-3 h-100"><h3 class="h6">É para você se…</h3>{ul(p['for'][:3])}</div></div>
<div class="col-md-6"><div class="border rounded-3 p-3 h-100"><h3 class="h6">Não é para você se…</h3>{ul(p['notfor'][:3])}</div></div></div>
<h3 class="h6 mt-3">Pontos de atenção</h3>{ul(p['cons'][:3])}<p class="mt-3"><a href="/{p['slug']}/">Análise completa do {e(p['name'])}</a></p>{ctas(p)}</section>""")
    return "".join(out)


def picks():
    return ""


def ul(xs):
    return '<ul class="mb-0">' + "".join("<li>%s</li>" % e(x) for x in xs) + "</ul>"


def review_body(p):
    outros = [o for o in ordenados() if o["slug"] != p["slug"]]
    alt = "".join(f'<li class="list-group-item d-flex justify-content-between gap-3"><a href="/{o["slug"]}/">{e(o["name"])}</a><span class="text-body-secondary small text-end">{e(USO.get(o["slug"], o["best"]))} · {e(short(o))}</span></li>' for o in outros)
    return f"""<div class="border rounded-3 p-3 my-3"><p class="fw-semibold mb-2">Veredito</p><p>{e(p['verdict'])}</p>
<ul class="list-group list-group-flush small mb-3">{attrs(p)}</ul>{ctas(p)}</div>
<div class="row g-3"><div class="col-md-6"><div class="border rounded-3 p-3 h-100"><h2 class="h6">É para você se…</h2>{ul(p['for'][:3])}</div></div>
<div class="col-md-6"><div class="border rounded-3 p-3 h-100"><h2 class="h6">Não é para você se…</h2>{ul(p['notfor'][:3])}</div></div></div>
<h2 class="h5 mt-4">O que ensina</h2>{ul(p['modules'])}
<div class="row g-3 mt-2"><div class="col-md-6"><h2 class="h6">Pontos fortes</h2>{ul(p['pros'][:3])}</div><div class="col-md-6"><h2 class="h6">Pontos de atenção</h2>{ul(p['cons'][:3])}</div></div>
<h2 class="h5 mt-4">Alternativas</h2><ul class="list-group mb-2">{alt}</ul><p><a href="/melhor-curso-de-unhas-online/">Ver os 3 lado a lado</a></p>
<p class="small text-body-secondary mt-4">Dados conferidos na página oficial em {br(p.get('checked', TODAY))}. Não é depoimento de aluno; preços podem mudar. Compre só pela página oficial (garantia de 7 dias).</p>"""


def redirect(url):
    base = url + ("&" if "?" in url else "?") + "src="
    url = base + "cursosdeunhas"
    js = ("var q=new URLSearchParams(location.search),s=q.get('src');if(!s){try{s=sessionStorage.getItem('cdu_src')}catch(e){}}"
          "if(!s&&(q.get('gclid')||q.get('gbraid')||q.get('wbraid')))s='gads';"
          "s=s?s.replace(/[^a-z0-9_-]/gi,'').slice(0,30):'cursosdeunhas';"
          "window.fbq&&fbq('track','InitiateCheckout');setTimeout(function(){location.replace(%s+s)},900)" % json.dumps(base))
    return ('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">'
            '<title>Redirecionando…</title>' + TAG + PIXEL + '<meta http-equiv="refresh" content="3;url=%s"></head><body><p>Abrindo a página oficial… '
            '<a href="%s" rel="sponsored nofollow">Abrir a página oficial do curso na Hotmart</a>.</p><script>%s</script></body></html>'
            % (e(url), e(url), js))


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    pages = []
    for f in sorted((R / "content").glob("*.html")):
        raw = f.read_text("utf-8")
        m = json.loads(re.match(r"<!--META(.*?)-->", raw, re.S).group(1))
        pages.append((m, raw.split("-->", 1)[1].strip().replace("{{CARDS}}", cards()).replace("{{TABLE}}", table()).replace("{{PICKS}}", picks()).replace("{{SECOES}}", secoes())))
    for p in P:
        chk = p.get("checked", TODAY)
        pages.append(({"path": "/%s/" % p["slug"], "type": "review", "title": p["title"], "desc": p["desc"],
                       "h1": "%s vale a pena? Análise completa" % p["name"], "crumb": p["name"], "updated": chk, "date": chk,
                       "about": {"@type": "Course", "name": p["name"], "description": p["summary"],
                                 "provider": {"@type": "Organization", "name": p["producer"]}}}, review_body(p)))
        d = OUT / "ir" / p["slug"]
        d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(redirect(p["hotlink"]), "utf-8")
        if p.get("checkout"):
            (d / "checkout").mkdir(exist_ok=True)
            (d / "checkout" / "index.html").write_text(redirect(p["checkout"]), "utf-8")
    global ROUTES
    lab = lambda m: "Início" if m["path"] == "/" else m.get("crumb", m["h1"])
    rs = [(lab(m), m["path"]) for m, _ in pages] + [("Por onde começar", "/comecar/")]
    ordem = ["/", "/melhor-curso-de-unhas-online/", "/comecar/"] + ["/%s/" % p["slug"] for p in P]
    fim = ["/sobre/", "/aviso-legal/", "/politica-de-privacidade/"]
    ROUTES[:] = sorted(rs, key=lambda r: ordem.index(r[1]) if r[1] in ordem else (100 + fim.index(r[1]) if r[1] in fim else 50))
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
    for lp in (R / "static" / "lp").glob("*.html"):
        d = OUT / lp.stem
        d.mkdir(exist_ok=True)
        (d / "index.html").write_text(lp.read_text("utf-8").replace("{{TAG}}", TAG).replace("{{PIXEL}}", PIXEL + SRCJS).replace("{{BOOTSTRAP}}", BOOTSTRAP).replace("{{CSS}}", CSS).replace("{{FOOTER}}", footer()), "utf-8")
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
        if rel.startswith("ir/") or rel.startswith("google") or rel == "404.html":
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
