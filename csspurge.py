# --- purgador de CSS (só biblioteca padrão) -------------------------------------------------------------
# Recebe o CSS do Bootstrap e o HTML gerado e devolve só as regras que podem casar com algum elemento.
# Regra de decisão, por seletor (cada item de uma lista "a,b,c" é avaliado à parte):
#   - o seletor é quebrado em compostos pelos combinadores (espaço, >, +, ~); cada composto precisa casar com
#     pelo menos UM elemento do HTML: mesma tag (ou nenhuma), todas as classes no MESMO elemento, mesmo id e
#     atributos presentes (com valor, quando o seletor diz [a=v]); os combinadores em si não são verificados
#     (conservador: pode sobrar regra, nunca falta);
#   - pseudo-classes (:hover, :focus, :active, :not(...), :first-child...) são ignoradas, então os estados ficam;
#   - classes que aparecem em strings de <script> contam como "podem estar em qualquer elemento" (JS);
#   - :root, *, html e body ficam sempre; pseudo-elementos de formulário (::-webkit-...) só se houver
#     input/button/select/textarea.
# Depois: variáveis --x declaradas e nunca lidas por var(--x) saem (até ponto fixo), @keyframes sem uso saem,
# @media/@supports vazios saem. A ordem das regras é preservada (a cascata não muda).
import html.parser, re


def _scan(s, i, close):
    """avança de s[i] até o caractere `close` no mesmo nível (respeita strings, comentários, () e {})"""
    depth = 0
    n = len(s)
    while i < n:
        c = s[i]
        if c in "\"'":
            j = i + 1
            while j < n and s[j] != c:
                j += 2 if s[j] == "\\" else 1
            i = j + 1
            continue
        if s.startswith("/*", i):
            i = s.index("*/", i + 2) + 2
            continue
        if c in "({[":
            depth += 1
        elif c in ")}]":
            if depth == 0 and c == close:
                return i
            depth -= 1
        elif c == close and depth == 0:
            return i
        i += 1
    return n


def css_parse(css):
    """lista de nós: ('rule', seletor, corpo) | ('at', prelúdio, [filhos] ou corpo) | ('stmt', texto) | ('banner', texto)"""
    out, i, n = [], 0, len(css)
    while i < n:
        while i < n and css[i].isspace():
            i += 1
        if i >= n:
            break
        if css.startswith("/*", i):
            j = css.index("*/", i + 2) + 2
            if css.startswith("/*!", i):
                out.append(("banner", css[i:j]))
            i = j
            continue
        j = i
        while j < n and css[j] not in "{;":
            if css[j] in "\"'":
                j = _skipstr(css, j)
                continue
            j += 1
        if j >= n:
            break
        pre = css[i:j].strip()
        if css[j] == ";":
            out.append(("stmt", pre + ";"))
            i = j + 1
            continue
        k = _scan(css, j + 1, "}")
        body = css[j + 1:k]
        if pre.startswith("@"):
            name = pre[1:].split("(")[0].split()[0].lower()
            nested = name in ("media", "supports", "layer", "container", "document")
            out.append(("at", pre, css_parse(body) if nested else body))
        else:
            out.append(("rule", pre, body))
        i = k + 1
    return out


def _skipstr(s, i):
    q, j = s[i], i + 1
    while j < len(s) and s[j] != q:
        j += 2 if s[j] == "\\" else 1
    return j + 1


def _split(s, sep):
    """divide em `sep` no nível 0 (fora de (), [], strings)"""
    parts, depth, cur, i = [], 0, [], 0
    while i < len(s):
        c = s[i]
        if c in "\"'":
            j = _skipstr(s, i)
            cur.append(s[i:j])
            i = j
            continue
        if c in "([":
            depth += 1
        elif c in ")]":
            depth -= 1
        if c == sep and depth == 0:
            parts.append("".join(cur))
            cur = []
        else:
            cur.append(c)
        i += 1
    parts.append("".join(cur))
    return parts


class _Doc(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.els, self.js, self.inscript, self.styles = [], set(), False, []

    def handle_starttag(self, tag, attrs):
        a = {k.lower(): (v or "") for k, v in attrs}
        self.els.append((tag.lower(), set(a.get("class", "").split()), a.get("id"), a))
        if a.get("style"):
            self.styles.append(a["style"])
        self.inscript = tag.lower() == "script" and "json" not in a.get("type", "")

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.inscript = False

    def handle_endtag(self, tag):
        self.inscript = False

    def handle_data(self, data):
        if self.inscript:  # classes que um script pode pôr: toda palavra dentro de strings JS
            for q in re.findall(r"'([^'\n]*)'|\"([^\"\n]*)\"", data):
                self.js.update(re.findall(r"-?[A-Za-z_][\w-]*", q[0] or q[1]))


_PSEUDO_FN = re.compile(r"::?[A-Za-z-]+\(")
_FORM_TAGS = {"input", "button", "select", "textarea"}


def _strip_fn(s):
    """remove :not(...), :is(...), :nth-child(...) etc. com o conteúdo balanceado"""
    while True:
        m = _PSEUDO_FN.search(s)
        if not m:
            return s
        k = _scan(s, m.end(), ")")
        s = s[:m.start()] + s[k + 1:]


def _compound_ok(c, doc):
    attrs = []

    def grab(m):
        attrs.append(m.group(1))
        return " "
    c = re.sub(r"\[([^\]]*)\]", grab, c)
    vendor = re.search(r"::(-webkit-|-moz-|-ms-|file-selector-button)", c)
    c = re.sub(r"::?-?[A-Za-z][\w-]*", "", c)  # pseudo-classes e pseudo-elementos
    c = c.replace("*", "").strip()
    if vendor and not any(e[0] in _FORM_TAGS for e in doc.els):
        return False
    tag = re.match(r"^[A-Za-z][\w-]*", c)
    tag = tag.group(0).lower() if tag else None
    classes = set(re.findall(r"\.(-?[_A-Za-z][\w-]*)", c)) - doc.js
    ids = set(re.findall(r"#(-?[_A-Za-z][\w-]*)", c))
    if not (tag or classes or ids or attrs):
        return True
    for et, ec, eid, ea in doc.els:
        if tag and tag != et:
            continue
        if not classes <= ec:
            continue
        if ids and (len(ids) > 1 or eid not in ids):
            continue
        ok = True
        for at in attrs:
            m = re.match(r"\s*([\w-]+)\s*(?:([~|^$*]?=)\s*[\"']?([^\"'\]]*?)[\"']?\s*(?:\s[is])?)?\s*$", at)
            if not m:
                continue
            name, op, val = m.group(1).lower(), m.group(2), m.group(3)
            if name not in ea:
                ok = False
            elif op == "=" and ea[name] != val:
                ok = False
            elif op == "~=" and val not in ea[name].split():
                ok = False
            if not ok:
                break
        if ok:
            return True
    return False


def _sel_ok(sel, doc):
    s = _strip_fn(sel.strip())
    if not s.replace(":root", "").strip(" *"):
        return True
    for comp in re.split(r"\s*[>+~]\s*|\s+", s):
        if comp and not _compound_ok(comp, doc):
            return False
    return True


def _decls(body):
    return [d for d in _split(body, ";") if d.strip()]


def _filter(nodes, doc):
    out = []
    for node in nodes:
        if node[0] == "rule":
            sels = [x for x in _split(node[1], ",") if _sel_ok(x, doc)]
            if sels:
                out.append(["rule", ",".join(x.strip() for x in sels), _decls(node[2])])
        elif node[0] == "at":
            if isinstance(node[2], list):
                kids = _filter(node[2], doc)
                if kids:
                    out.append(["at", node[1], kids])
            elif node[1].lower().startswith("@charset"):
                continue
            else:
                out.append(["at", node[1], node[2]])
        elif node[0] == "banner":
            out.append(["banner", node[1]])
        # 'stmt' (@charset/@import) sai: dentro de <style> não serve
    return out


def _walk(nodes):
    for node in nodes:
        if node[0] == "rule":
            yield node
        elif node[0] == "at" and isinstance(node[2], list):
            yield from _walk(node[2])


def _prune_vars(nodes, extra):
    rules = list(_walk(nodes))
    while True:
        used = set(re.findall(r"var\(\s*(--[\w-]+)", extra))
        for r in rules:
            for d in r[2]:
                used.update(re.findall(r"var\(\s*(--[\w-]+)", d.split(":", 1)[1] if ":" in d else d))
        changed = False
        for r in rules:
            keep = [d for d in r[2] if not (d.strip().startswith("--") and d.split(":", 1)[0].strip() not in used)]
            if len(keep) != len(r[2]):
                r[2], changed = keep, True
        if not changed:
            return


def _prune_keyframes(nodes, text):
    out = []
    for node in nodes:
        if node[0] == "at" and node[1].lower().split()[0].endswith("keyframes"):
            name = node[1].split(None, 1)[1].strip()
            if not re.search(r"animation(-name)?\s*:[^;}]*\b%s\b" % re.escape(name), text):
                continue
        elif node[0] == "at" and isinstance(node[2], list):
            node = ["at", node[1], _prune_keyframes(node[2], text)]
        out.append(node)
    return out


def _emit(nodes):
    out = []
    for node in nodes:
        if node[0] == "banner":
            out.append(node[1])
        elif node[0] == "rule":
            if node[2]:
                out.append("%s{%s}" % (node[1], ";".join(d.lstrip() for d in node[2])))
        elif isinstance(node[2], list):
            inner = _emit(node[2])
            if inner:
                out.append("%s{%s}" % (node[1], inner))
        else:
            out.append("%s{%s}" % (node[1], node[2]))
    return "".join(out)


def purge_css(css, htmls, extra_css="", parsed=None, safelist=()):
    """css: texto do Bootstrap (ou a lista já devolvida por css_parse, em `parsed`); htmls: lista de HTML;
    extra_css: CSS próprio que vem depois (as var() lidas nele mantêm as variáveis vivas);
    safelist: classes que algum script monta em tempo de execução sem aparecer como texto (ex.: 'show', 'collapsing').
    Devolve o CSS enxuto."""
    doc = _Doc()
    doc.js.update(safelist)
    for h in htmls:
        doc.feed(h)
        doc.inscript = False
    nodes = _filter(parsed if parsed is not None else css_parse(css), doc)
    _prune_vars(nodes, extra_css + " ".join(doc.styles))
    text = _emit(nodes)
    nodes = _prune_keyframes(nodes, text)
    return _emit(nodes)
