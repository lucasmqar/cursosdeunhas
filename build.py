#!/usr/bin/env python3
"""Gerador estático (só biblioteca padrão) do cursosdeunhas.com.br.
Uso:  python3 build.py         -> gera docs/ (publicada pelo GitHub Pages)
      python3 build.py --ping  -> avisa Bing/Yandex/Seznam/Naver via IndexNow
Edite products.json (cursos + hotlinks) e content/*.html (artigos)."""
import datetime, hashlib, html, json, pathlib, re, shutil, sys, urllib.request
from csspurge import css_parse, purge_css

R = pathlib.Path(__file__).resolve().parent
OUT = R / "docs"
S = json.loads((R / "site.json").read_text("utf-8"))
P = json.loads((R / "products.json").read_text("utf-8"))
BASE = S["url"].rstrip("/")
KEY = hashlib.sha1(S["domain"].encode()).hexdigest()[:32]
TODAY = datetime.date.today().isoformat()
ORG = {"@type": "Organization", "@id": BASE + "/#org", "name": S["name"], "url": BASE + "/", "logo": BASE + "/favicon.svg"}


# Rastreadores (tag do Google/GTM, Pixel do Meta e Clarity) só carregam no domínio publicado (com ou sem www).
# Em localhost ou em qualquer cópia de teste nada é carregado, para não sujar os dados; dataLayer e gtag continuam
# definidos e o resto do site funciona igual (as chamadas a fbq usam window.fbq&&...).
PROD_JS = "/^(www\\.)?%s$/.test(location.hostname)" % re.escape(S["domain"])
TAG = ("<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}"
       "if(%s){dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});"
       "(function(d,s){var j=d.createElement(s),f=d.getElementsByTagName(s)[0];j.async=true;"
       "j.src='https://www.googletagmanager.com/gtm.js?id=GTM-MMW9HHNS';f.parentNode.insertBefore(j,f)})(document,'script');"
       "gtag('js',new Date());}</script>" % PROD_JS)


MP = S.get("meta_pixel", "")
PIXEL = ("<script>if(%s){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};"
         "if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];"
         "s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','%s');fbq('track','PageView');}</script>" % (PROD_JS, MP)) if MP else ""
# origem da visita (src) que precisa chegar à Hotmart: vem da URL (?src=, ou gclid/gbraid/wbraid = Google Ads),
# fica na sessão da aba e é acrescentada a todo link /ir/ (inclusive saindo das páginas de análise).
# Os identificadores de clique de anúncio (gclid, gbraid, wbraid, fbclid) também ficam na sessão (cdu_<nome>)
# e são repassados ao hotlink pela página /ir/ (ver redirect()).
# O src é guardado aqui como veio (com hífen); a normalização para a Hotmart acontece só em redirect().
SRCJS = ("<script>(function(){try{var q=new URLSearchParams(location.search),s=q.get('src'),K='cdu_src',ids={},"
         "g=function(k){try{return sessionStorage.getItem(k)}catch(e){return null}};"
         "['gclid','gbraid','wbraid','fbclid'].forEach(function(k){var v=q.get(k);"
         "if(v&&v.length<=500){try{sessionStorage.setItem('cdu_'+k,v)}catch(e){}}else v=g('cdu_'+k);if(v&&v.length<=500)ids[k]=v});"
         "if(!s&&(q.get('gclid')||q.get('gbraid')||q.get('wbraid')))s='gads';"
         "if(s){s=s.replace(/[^a-z0-9_-]/gi,'').slice(0,30);try{sessionStorage.setItem(K,s)}catch(e){}}else s=g(K);"
         "if(s)window.cduSrc=s;else if(!Object.keys(ids).length)return;ids.src=s;"
         # os IDs de clique também vão na URL do /ir/ (como o url_passthrough do Google): a tag do Google no /ir/
         # lê o gclid da própria URL e a conversão não depende de cookie, referrer nem de a tag ter rodado na entrada
         "var fix=function(){document.querySelectorAll('a[href*=\"/ir/\"]').forEach(function(a){var h=a.href;"
         "['src','gclid','gbraid','wbraid','fbclid'].forEach(function(k){var v=ids[k];"
         "if(v&&!RegExp('[?&]'+k+'=').test(h))h+=(h.indexOf('?')<0?'?':'&')+k+'='+encodeURIComponent(v)});a.href=h})};"
         "document.readyState=='loading'?document.addEventListener('DOMContentLoaded',fix):fix()}catch(e){}})();</script>")
# Pré-busca do HTML do /ir/ quando o visitante encosta no botão (Speculation Rules; Chrome/Edge/Android, outros ignoram).
# É PREFETCH, nunca prerender: só baixa o HTML (~6 KB) e não executa JavaScript, então não dispara tag nem conversão;
# a página /ir/ roda normalmente só quando a navegação acontece.
SPEC = ('<script type="speculationrules">{"prefetch":[{"source":"document","where":{"href_matches":["/ir/*","/ir/*\\\\?*"]},'
        '"eagerness":"moderate"}]}</script>')
CL = S.get("clarity", "")
if CL:
    # o script do Clarity só é pedido depois do evento load da janela (não disputa banda com o CSS e o texto)
    PIXEL += ('<script>if(%s){(function(c,l,a,r,i){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};'
              'var go=function(){var t=l.createElement(r),y=l.getElementsByTagName(r)[0];t.async=1;'
              't.src="https://www.clarity.ms/tag/"+i;y.parentNode.insertBefore(t,y)};'
              'l.readyState==="complete"?go():c.addEventListener("load",go)})(window,document,"clarity","script","%s");}</script>' % (PROD_JS, CL))


def e(s):
    return html.escape(str(s), quote=True)


def br(d):
    return "/".join(reversed(d.split("-")))


# Bootstrap 5.3.8 guardado no repositório (static/vendor, mesmo arquivo do jsdelivr, conferido pelo SRI abaixo) e
# embutido em cada página só com as regras que ela usa (purge_css): sem pedido bloqueante a outro domínio antes
# da primeira pintura. O marcador abaixo é trocado pelo <style> enxuto em inline_bootstrap(), no fim do build.
BS_FILE = R / "static" / "vendor" / "bootstrap-5.3.8.min.css"
BS_SRI = "sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
BOOTSTRAP = "<!--BOOTSTRAP-->"
# só sobreposições de marca (contraste medido: branco sobre ameixa #6E1F45 ≈ 10:1; ameixa sobre branco ≈ 10:1)
CSS = (":root{--bs-link-color:#6E1F45;--bs-link-color-rgb:110,31,69;--bs-link-hover-color:#4f1631;--bs-link-hover-color-rgb:79,22,49}"
       ".btn-primary{--bs-btn-bg:#6E1F45;--bs-btn-border-color:#6E1F45;--bs-btn-hover-bg:#5a1838;--bs-btn-hover-border-color:#5a1838;"
       "--bs-btn-active-bg:#4f1631;--bs-btn-active-border-color:#4f1631;--bs-btn-focus-shadow-rgb:110,31,69}"
       ".badge-uso{background:#F6EDE8;color:#6E1F45;border:1px solid #e3cfd8;font-weight:600}"
       "summary{cursor:pointer}.leitura{max-width:860px}"
       # link "ir direto para o pagamento": #495057 dá ~8:1 no branco e ~7,7:1 na caixa cinza (#f8f9fa)
       ".link-direto{color:#495057}.link-direto:hover{color:#212529}"
       # lista de fatos da primeira tela das análises e botão de saída na largura toda no celular (Clarity 08–10/11/2026:
       # 93% das sessões em celular; na análise do Nail Academy 65% saíam antes de rolar 25% e só 3 de 266 tocaram o botão)
       ".checks li{position:relative;padding-left:1.6rem;margin-bottom:.3rem}.checks li::before{content:'\\2713';position:absolute;left:0;color:#6E1F45;font-weight:700}"
       ".escolha .list-group-item{border-color:#6E1F45;color:#6E1F45;font-weight:600}"
       "@media(max-width:575.98px){.btn-cta{display:block;width:100%}}"
       # celular: cabeçalho numa linha só (a marca e os 2 links cabem a partir de 336 px), alvo de toque >= 24 px
       "@media(max-width:575.98px){.navbar-brand{font-size:1.05rem;margin-right:.5rem}.navbar .nav-link{font-size:.875rem;padding-top:.125rem;padding-bottom:.125rem}"
       ".navbar .gap-3{gap:.75rem!important}}"
       "@media(max-width:399.98px){.navbar-brand{font-size:1rem;margin-right:0}.navbar .nav-link{font-size:.8125rem}}")

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
    crumb = "" if path == "/" else ('<nav aria-label="Trilha" class="d-none d-md-block"><ol class="breadcrumb small mt-3 mb-2"><li class="breadcrumb-item"><a href="/">Início</a></li>'
                                     '<li class="breadcrumb-item active" aria-current="page">%s</li></ol></nav>' % e(crumbs[-1][0]))
    # celular: trilha escondida (d-none d-md-block) e aviso + autoria em 2 linhas curtas, para o resumo com preço e botão
    # entrar na primeira tela; o aviso de comissão continua antes de qualquer botão
    disc = ('<p class="small text-body-secondary border-start border-3 ps-2 mb-1">Se você comprar pelos nossos links, recebemos comissão da Hotmart; '
            'o preço é o mesmo (<a href="/aviso-legal/">como funciona</a>).</p>') if kind in ("article", "review", "home") else ""
    byline = ('<p class="small text-body-secondary mb-2">Por <a href="/sobre/">Equipe %s</a> · atualizado em <time datetime="%s">%s</time>%s</p>'
              % (e(S["name"]), upd, br(upd), ' · <a href="#como-avaliamos">Como avaliamos</a>' if m.get("como") else "")) if kind in ("article", "review", "home") else ""
    topo = disc + byline
    if "<!--AVISO-->" in body:
        body, topo = body.replace("<!--AVISO-->", topo), ""
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
{ver}{BOOTSTRAP}<style>{CSS}</style>
{TAG}{PIXEL}{SRCJS}{SPEC}
<script type="application/ld+json">{ld}</script>
</head>
<body>
<a class="visually-hidden-focusable" href="#c">Pular para o conteúdo</a>
<header class="border-bottom"><nav class="navbar" aria-label="Principal"><div class="container leitura"><a class="navbar-brand fw-semibold" href="/">{e(S['name'])}</a><div class="d-flex gap-3"><a class="nav-link" href="/melhor-curso-de-unhas-online/">Comparativo</a><a class="nav-link" href="/comecar/">Por onde começar</a></div></div></nav></header>
<main id="c" class="container leitura">{crumb}<article class="pt-2">
<h1 class="h2 mt-3 mb-2">{e(m['h1'])}</h1>{topo}
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


# rótulo do botão de saída: no comparativo antigo, "Ver preço" recebeu 8 de 18 toques em 63 visitas; "Ver a página
# oficial do curso" recebeu 3 toques em 266 visitas da análise (Clarity, 08–10/11/2026)
CTA = "Ver conteúdo e preço do curso"


def aviso_cta():
    return '<p class="small text-body-secondary mt-2 mb-0">Link de parceria: recebemos comissão, sem custo extra para você.</p>'


def ctas(p, w100=False):
    cls = "btn btn-primary btn-lg btn-cta" + (" w-100" if w100 else "")
    direto = (f'<a class="link-direto small d-inline-block py-2" href="{ck(p)}" rel="sponsored nofollow">ou ir direto para o pagamento</a>'
              if p.get("checkout") else "")
    return f'<a class="{cls}" href="{hot(p)}" rel="sponsored nofollow">{CTA}<span class="visually-hidden">: {e(p["name"])}</span></a>{aviso_cta()}{direto}'


# rótulo do certificado: é certificado de conclusão de curso livre, não reconhecimento oficial
CERT = "Certificado de conclusão (curso livre)"


def attrs(p):
    rows = (("Para quem", p["best"]), ("Preço", f"{short(p)} (conferido em {br(p.get('checked', TODAY))})"),
            (CERT, p["certificate"]), ("Acesso", p["access"]), ("Garantia", p["guarantee"]))
    return "".join(f'<li class="list-group-item d-flex justify-content-between gap-3"><span class="text-body-secondary">{k}</span><span class="text-end">{e(v)}</span></li>' for k, v in rows)


def cards():
    if not P:
        return '<p>Análises dos cursos em atualização.</p>'
    out = []
    # preço e botão antes da lista de atributos: no comparativo 47% saíam antes de 30% da página (Clarity, 08–10/11/2026)
    for p in ordenados():
        out.append(f"""<div class="col"><article class="card h-100"><div class="card-body"><span class="badge badge-uso mb-2">{e(USO.get(p['slug'], p['best']))}</span>
<h3 class="card-title h5"><a class="link-body-emphasis" href="/{p['slug']}/">{e(p['name'])}</a></h3><p class="card-text">{e(p['summary'])}</p>
<p class="mb-2"><strong class="fs-5">{e(short(p))}</strong> <span class="small text-body-secondary">· garantia de {e(p['guarantee'])}</span></p>{ctas(p, True)}</div>
<ul class="list-group list-group-flush small border-top">{attrs(p)}</ul></article></div>""")
    return '<div class="row row-cols-1 row-cols-md-3 g-3 my-3">' + "".join(out) + "</div>"


def table():
    if not P:
        return ""
    ps = ordenados()
    head = "".join(f'<th scope="col"><a href="/{p["slug"]}/">{e(p["name"])}</a></th>' for p in ps)
    linhas = (("À vista", lambda p: short(p).replace(" à vista", "")), ("Certificados de conclusão (curso livre)", lambda p: p.get("cert_short", p["certificate"])),
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
    # primeiro parágrafo: apresentação do curso, com a nota e o número de avaliações na data da conferência
    intro = f"<p>{e(p['intro'])}</p>\n" if p.get("intro") else ""
    # primeira tela (celular): frase do que é o curso, 4 fatos, preço e botão; o aviso de comissão completo e a autoria
    # vêm logo abaixo (<!--AVISO-->, preenchido em render) e o aviso curto fica colado ao botão (aviso_cta)
    hook = f'<p class="lead mb-2">{e(p["hook"])}</p>' if p.get("hook") else ""
    fatos = ('<ul class="list-unstyled checks mb-3">' + "".join(f"<li>{e(x)}</li>" for x in p["facts"]) + "</ul>") if p.get("facts") else ""
    parc = re.search(r"\((.*?)\)", p["price"])
    parc = f' <span class="text-body-secondary">{e(parc.group(1))}</span>' if parc else ""
    resumo = (f'{hook}{fatos}<div class="border rounded-3 p-3 mb-3 bg-body-tertiary"><p class="mb-2"><strong class="fs-5">{e(short(p))}</strong>{parc} '
              f'<span class="small text-body-secondary">(conferido em {br(p.get("checked", TODAY))})</span></p>{ctas(p)}</div><!--AVISO-->\n')
    return f"""{resumo}{intro}<div class="border rounded-3 p-3 my-3"><p class="fw-semibold mb-2">Veredito</p><p>{e(p['verdict'])}</p>
<ul class="list-group list-group-flush small mb-0">{attrs(p)}</ul></div>
<div class="row g-3"><div class="col-md-6"><div class="border rounded-3 p-3 h-100"><h2 class="h6">É para você se…</h2>{ul(p['for'][:3])}</div></div>
<div class="col-md-6"><div class="border rounded-3 p-3 h-100"><h2 class="h6">Não é para você se…</h2>{ul(p['notfor'][:3])}</div></div></div>
<h2 class="h5 mt-4">O que ensina</h2>{ul(p['modules'])}
<div class="row g-3 mt-2"><div class="col-md-6"><h2 class="h6">Pontos fortes</h2>{ul(p['pros'][:3])}</div><div class="col-md-6"><h2 class="h6">Pontos de atenção</h2>{ul(p['cons'][:3])}</div></div>
<div class="my-4">{ctas(p)}</div>
<h2 class="h5 mt-4">Alternativas</h2><ul class="list-group mb-2">{alt}</ul><p><a href="/melhor-curso-de-unhas-online/">Ver os 3 lado a lado</a></p>
<p class="small text-body-secondary mt-4">Dados conferidos na página oficial em {br(p.get('checked', TODAY))}. Não é depoimento de aluno; preços podem mudar. Compre só pela página oficial (garantia de 7 dias).</p>""" + barra_fixa(p)


def barra_fixa(p):
    """Barra com o botão no rodapé da tela, só no celular (d-md-none). Aparece depois que o botão do resumo saiu da tela
    por cima e some enquanto outro botão de saída ou o rodapé (com o aviso de comissão) estiverem visíveis.
    O link é estático (/ir/<curso>/), então o SRCJS acrescenta src e IDs de clique como em qualquer outro botão.
    Sem IntersectionObserver (ou sem isIntersecting) a barra simplesmente não aparece."""
    return (f'<div id="cta-fixo" class="d-md-none fixed-bottom bg-body border-top shadow px-3 py-2" hidden>'
            f'<div class="d-flex align-items-center gap-2"><span class="small flex-grow-1 lh-sm"><strong>{e(short(p))}</strong><br>'
            f'<span class="text-body-secondary">link de parceria</span></span>'
            f'<a class="btn btn-primary" href="{hot(p)}" rel="sponsored nofollow" data-saida="fixo">Ver conteúdo e preço'
            f'<span class="visually-hidden">: {e(p["name"])}</span></a></div></div>'
            '<script>document.addEventListener("DOMContentLoaded",function(){try{var b=document.getElementById("cta-fixo");'
            'if(!b||!("IntersectionObserver"in window)||!("isIntersecting"in IntersectionObserverEntry.prototype))return;'
            'var c=[].filter.call(document.querySelectorAll("main a.btn-primary"),function(a){return!b.contains(a)});if(!c.length)return;'
            'var vis=[],f=document.querySelector("footer");'
            'var upd=function(){var show=c[0].getBoundingClientRect().bottom<0&&vis.length===0;'
            'if(b.hidden===!show)return;b.hidden=!show;document.body.style.paddingBottom=show?b.offsetHeight+"px":""};'
            'var io=new IntersectionObserver(function(es){for(var i=0;i<es.length;i++){var x=es[i],k=vis.indexOf(x.target);'
            'if(x.isIntersecting){if(k<0)vis.push(x.target)}else if(k>=0)vis.splice(k,1)}upd()});'
            'for(var i=0;i<c.length;i++)io.observe(c[i]);if(f)io.observe(f);window.addEventListener("scroll",upd,{passive:true})}catch(e){}});</script>')


# /ir/: o redirecionamento sai assim que os hits que importam foram entregues, em vez de esperar 900 ms fixos.
# IR_HOOK roda ANTES da tag do Google e do Pixel e observa (window.__ir):
#   Google Ads: a conversão "Clique de saída" é a regra de URL page_view em /ir/; o hit vai por fetch keepalive para
#   .../pagead/conversion/<id>/?...label=... (e, se falhar, um reenvio para .../pagead/1p-conversion/...).
#     gs = início do hit; g = hit concluído (promise do fetch; PerformanceObserver só quando o hit não passou pelo fetch,
#     porque ele também lista pedidos que falharam; sendBeacon conta ao enfileirar);
#     gf = hit falhou (espera o reenvio); ge = gtm.js não carregou (bloqueador: não adianta esperar).
#   Meta: ViewContent/AddToCart vão por <img> (o navegador cancela na troca de página), então só contam CONCLUÍDOS
#     (m, via PerformanceObserver); me = fbevents.js não carregou.
IR_HOOK = ("<script>(function(w){try{var P=w.performance,N=function(){return P&&P.now?P.now():+new Date},"
           "R=w.__ir={t0:N(),gs:0,g:0,gf:0,ge:0,m:0,me:0},"
           "G=/\\/pagead\\/(1p-)?conversion\\/\\d+\\/[^#]*[?&]label=/,M=/facebook\\.com\\/tr\\/?\\?[^#]*ev=%s/,"
           "ok=function(){R.g=R.g||N()},ko=function(){R.gf=N()},"
           "see=function(u,pr){try{u=String(u&&u.url||u||'');if(G.test(u)){R.gs=R.gs||N();"
           "if(pr&&pr.then){R.gw=1;pr.then(ok,ko)}else if(pr||!R.gw)ok()}if(!R.m&&!pr&&M.test(u))R.m=N()}catch(x){}};"
           "var f=w.fetch;if(f)w.fetch=function(i){var p=f.apply(w,arguments);see(i,p||1);return p};"
           "var n=w.navigator,b=n&&n.sendBeacon;if(b)n.sendBeacon=function(u){var r=b.apply(n,arguments);if(r)see(u,1);return r};"
           "try{new PerformanceObserver(function(l){var a=l.getEntries();for(var k=0;k<a.length;k++)see(a[k].name)}).observe({type:'resource',buffered:true})}catch(x){}"
           "w.addEventListener('error',function(v){var s=v&&v.target&&v.target.src||'';"
           "if(/googletagmanager\\.com\\/gtm\\.js/.test(s))R.ge=N();if(/connect\\.facebook\\.net/.test(s))R.me=N()},true)"
           "}catch(x){}})(window);</script>")
# Regra de saída (ms desde o IR_HOOK): nunca antes de IR_PISO; Google pronto = hit concluído, gtm.js bloqueado, hit iniciado
# há IR_GVIVO (keepalive segue sozinho) ou falha há IR_GFALHA (tempo do reenvio); Meta pronto = concluído, bloqueado, sem
# Pixel ou passou IR_META (campanhas do Meta pausadas: não vale segurar o visitante por ele). Sai SEMPRE em IR_TETO.
IR_PISO, IR_GVIVO, IR_GFALHA, IR_META, IR_TETO = 150, 700, 600, 600, 2500
IR_CSS = ("body{margin:0;min-height:90vh;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;"
          "font:16px/1.5 system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;background:#fff;color:#212529;text-align:center}"
          "p{margin:0 0 12px}a.b{display:inline-block;padding:12px 20px;border-radius:8px;background:#6E1F45;color:#fff;"
          "text-decoration:none;font-weight:600}.n{margin-top:16px;font-size:.8125rem;color:#6c757d}")


def redirect(url, slug, checkout=False):
    """Página /ir/<curso>/ (checkout=False: página de vendas do produtor) e /ir/<curso>/checkout/ (pagamento).
    Só aqui o src é normalizado para a Hotmart: minúsculas, só [a-z0-9] (ela remove o hífen e reserva o underline),
    até 30 caracteres; na rota de checkout o src é cortado em 28 e ganha o sufixo "ck" (gadsf3 x gadsf3ck).
    gclid/gbraid/wbraid/fbclid (da URL ou da sessão) seguem no hotlink com o mesmo nome.
    Pixel do Meta: ViewContent na rota normal e AddToCart na de checkout; InitiateCheckout e Purchase vêm só da Hotmart.
    Com JavaScript, o link de reserva visível recebe a mesma URL do redirecionamento (src e IDs de clique), para
    quem tocar nele antes do redirecionamento ou em rede lenta não sair como tráfego sem origem.
    Sem JavaScript valem o href estático do link e o meta refresh dentro de <noscript>, com o src padrão."""
    base = url + ("&" if "?" in url else "?") + "src="
    url = base + "cursosdeunhas" + ("ck" if checkout else "")
    src = "n.slice(0,28)+'ck'" if checkout else "n"
    ev = "AddToCart" if checkout else "ViewContent"
    js = ("(function(){var b=%s,n='cursosdeunhas',u;try{var q=new URLSearchParams(location.search),"
          "g=function(k){try{return sessionStorage.getItem(k)}catch(e){return null}},s=q.get('src')||g('cdu_src');"
          "if(!s&&(q.get('gclid')||q.get('gbraid')||q.get('wbraid')))s='gads';"
          "n=String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,30)||n;u=b+%s;"
          "['gclid','gbraid','wbraid','fbclid'].forEach(function(k){var v=q.get(k)||g('cdu_'+k);"
          "if(v&&v.length<=500)u+='&'+k+'='+encodeURIComponent(v)})}catch(e){n='cursosdeunhas';u=b+%s}"
          "try{var a=document.querySelector('a[rel~=\"sponsored\"]');if(a)a.href=u}catch(e){}"
          "try{window.fbq&&fbq('track','%s',{content_name:%s,content_category:n})}catch(e){}"
          "var R=window.__ir||{},P=window.performance,N=function(){return P&&P.now?P.now():+new Date},T=R.t0||N(),d=0,iv,"
          "go=function(){if(d)return;d=1;try{clearInterval(iv)}catch(e){}location.replace(u)},"
          "ck=function(){try{var o=N(),t=o-T;if(t<%d)return;"
          "var gp=R.g||R.ge||(R.gs&&o-R.gs>=%d)||(R.gf&&o-R.gf>=%d)||!document.querySelector('script[src*=\"googletagmanager.com/gtm.js\"]'),"
          "mp=R.m||R.me||!window.fbq||t>=%d;if(gp&&mp)go()}catch(e){go()}};"
          # toque no link visível: não navega por cima do vigia (perderia o hit); sai pela mesma regra, no máximo em 600 ms
          "try{var A=document.querySelector('a[rel~=\"sponsored\"]');if(A)A.addEventListener('click',function(v){"
          "try{v.preventDefault()}catch(e){}setTimeout(go,600)},false)}catch(e){}"
          "try{iv=setInterval(ck,30);ck()}catch(e){}setTimeout(go,Math.max(0,%d-(N()-T)))})();"
          % (json.dumps(base), src, src, ev, json.dumps(slug), IR_PISO, IR_GVIVO, IR_GFALHA, IR_META, IR_TETO))
    txt = (('<p>Abrindo o pagamento na Hotmart…</p><a class="b" href="%s" rel="sponsored nofollow">Ir para o pagamento</a>' if checkout
            else '<p>Abrindo a página oficial do curso…</p><a class="b" href="%s" rel="sponsored nofollow">Ver a página oficial</a>') % e(url)
           + '<p class="n">%s · link de parceria: recebemos comissão se você comprar.</p>' % e(S["name"]))
    return ('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">'
            '<title>Redirecionando…</title><style>' + IR_CSS + '</style>' + (IR_HOOK % ev) + TAG + PIXEL
            + '<noscript><meta http-equiv="refresh" content="0;url=%s"></noscript></head><body><main>%s</main>'
            '<script>%s</script></body></html>' % (e(url), txt, js))


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
        (d / "index.html").write_text(redirect(p["hotlink"], p["slug"]), "utf-8")
        if p.get("checkout"):
            (d / "checkout").mkdir(exist_ok=True)
            (d / "checkout" / "index.html").write_text(redirect(p["checkout"], p["slug"], True), "utf-8")
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
        '<p>Essa página não existe ou mudou de endereço. <a href="/">Voltar ao início</a> ou veja o '
        '<a href="/melhor-curso-de-unhas-online/">comparativo dos 3 cursos que analisamos</a>.</p>'), "utf-8")
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
        (d / "index.html").write_text(lp.read_text("utf-8").replace("{{TAG}}", TAG).replace("{{PIXEL}}", PIXEL + SRCJS + SPEC).replace("{{BOOTSTRAP}}", BOOTSTRAP).replace("{{CSS}}", CSS).replace("{{FOOTER}}", footer()), "utf-8")
    for extra in (R / "static").glob("google*.html"):
        shutil.copy(extra, OUT / extra.name)
    (OUT / "llms.txt").write_text("# %s\n\n> %s\n\n" % (S["name"], S["tagline"]) + "".join(
        "- [%s](%s%s): %s\n" % (m["h1"], BASE, m["path"], m["desc"]) for m, _ in pages if "noindex" not in m.get("robots", "")), "utf-8")
    inline_bootstrap()
    audit(len(urls))


def inline_bootstrap():
    """troca o marcador de cada página pelo Bootstrap reduzido às regras que aquela página usa"""
    raw = BS_FILE.read_bytes()
    import base64
    if base64.b64encode(hashlib.sha384(raw).digest()).decode() != BS_SRI:
        sys.exit("ERRO: %s não é o bootstrap.min.css 5.3.8 original (SRI diferente)" % BS_FILE)
    parsed = css_parse(raw.decode("utf-8"))
    tot = n = 0
    for f in OUT.rglob("*.html"):
        t = f.read_text("utf-8")
        if BOOTSTRAP not in t:
            continue
        css = purge_css(None, [t], extra_css=CSS, parsed=parsed)
        f.write_text(t.replace(BOOTSTRAP, "<style>%s</style>" % css, 1), "utf-8")
        tot, n = tot + len(css), n + 1
    print("Bootstrap embutido em %d páginas (média %d bytes)" % (n, tot // max(n, 1)))


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
