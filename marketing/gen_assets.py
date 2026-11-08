#!/usr/bin/env python3
"""Gera os criativos vetoriais (SVG) e os PNG para anúncios.
Uso: python3 marketing/gen_assets.py  -> marketing/ativos/<conceito>_<formato>.svg/.png"""
import pathlib, subprocess

OUT = pathlib.Path(__file__).resolve().parent / "ativos"
OUT.mkdir(exist_ok=True)
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BG, PLUM, ROSE, GOLD, INK = "#F6EDE8", "#6E1F45", "#D99BA8", "#C9A27E", "#3B2430"
SERIF = "Georgia, 'Times New Roman', serif"
SANS = "-apple-system, 'Helvetica Neue', Arial, sans-serif"


def nail(x, y, s, fill, rot=0, stroke=None):
    st = f' stroke="{stroke}" stroke-width="{3*s:.1f}"' if stroke else ""
    return (f'<g transform="translate({x},{y}) rotate({rot}) scale({s})">'
            f'<path d="M-22,10 C-22,-40 22,-40 22,10 L22,34 C22,44 -22,44 -22,34 Z" fill="{fill}"{st}/>'
            f'<path d="M-12,-14 C-8,-24 6,-26 10,-20" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/></g>')


def sparkle(x, y, r, c=GOLD):
    return f'<path d="M{x},{y-r} Q{x},{y} {x+r},{y} Q{x},{y} {x},{y+r} Q{x},{y} {x-r},{y} Q{x},{y} {x},{y-r} Z" fill="{c}"/>'


def symbol(k, cx, cy, s):
    if k == 1:  # sol de ovais
        cols = [ROSE, "#C77D92", "#A24E6F", "#86325A", PLUM]
        g = f'<line x1="{cx-150*s}" y1="{cy+40*s}" x2="{cx+150*s}" y2="{cy+40*s}" stroke="{GOLD}" stroke-width="{3*s}" stroke-linecap="round"/>'
        for i, a in enumerate((-64, -32, 0, 32, 64)):
            g += f'<g transform="rotate({a} {cx} {cy+40*s})">{nail(cx, cy-95*s, 1.0*s, cols[i])}</g>'
        return g
    if k == 2:  # lua + oval acesa
        return (f'<defs><radialGradient id="h"><stop offset="0" stop-color="{GOLD}" stop-opacity=".45"/>'
                f'<stop offset="1" stop-color="{GOLD}" stop-opacity="0"/></radialGradient>'
                f'<mask id="m"><rect x="0" y="0" width="4000" height="4000" fill="#fff"/><circle cx="{cx-70*s}" cy="{cy-95*s}" r="{50*s}" fill="#000"/></mask></defs>'
                f'<circle cx="{cx-95*s}" cy="{cy-80*s}" r="{52*s}" fill="{GOLD}" mask="url(#m)"/>'
                f'<circle cx="{cx+40*s}" cy="{cy+20*s}" r="{120*s}" fill="url(#h)"/>' + nail(cx + 40*s, cy + 20*s, 1.6*s, PLUM)
                + sparkle(cx + 130*s, cy - 90*s, 10*s) + sparkle(cx - 150*s, cy + 40*s, 7*s, ROSE))
    if k == 3:  # um detalhe
        return (f'<circle cx="{cx}" cy="{cy}" r="{150*s}" fill="none" stroke="{ROSE}" stroke-width="{2*s}" stroke-dasharray="{2*s} {10*s}" stroke-linecap="round"/>'
                + nail(cx, cy, 2.4*s, PLUM) + sparkle(cx + 70*s, cy - 80*s, 22*s) + sparkle(cx + 100*s, cy - 30*s, 9*s))
    # 4: tres caminhos
    return (nail(cx - 110*s, cy + 10*s, 1.5*s, "none", stroke=ROSE) + nail(cx, cy, 1.9*s, PLUM)
            + nail(cx + 110*s, cy + 10*s, 1.5*s, "none", stroke=ROSE)
            + f'<path d="M{cx-20*s},{cy-120*s} l{14*s},{14*s} l{28*s},{-30*s}" fill="none" stroke="{GOLD}" stroke-width="{6*s}" stroke-linecap="round" stroke-linejoin="round"/>')


CONCEPTS = {
    1: (["Não começou com coragem.", "Começou com uma", "decisão pequena."], "aprender."),
    2: (["Onze da noite.", "Um tempo", "que é só seu."], "uma aula de cada vez."),
    3: (["Unha é detalhe."], "mas é no detalhe que muita gente volta a se sentir bonita."),
    4: (["Escolha boa", "é com calma."], "três caminhos, lado a lado."),
}


def text(lines, sub, x, y, size, anchor="middle", maxsub=None):
    t = "".join(f'<text x="{x}" y="{y+i*size*1.18:.0f}" font-family="{SERIF}" font-size="{size}" fill="{INK}" text-anchor="{anchor}">{l}</text>'
                for i, l in enumerate(lines))
    y2 = y + len(lines) * size * 1.18 + size * 0.35
    words, rows, cur = sub.split(), [], ""
    for w in words:
        if maxsub and len(cur + " " + w) > maxsub:
            rows.append(cur); cur = w
        else:
            cur = (cur + " " + w).strip()
    rows.append(cur)
    t += "".join(f'<text x="{x}" y="{y2+i*size*0.62:.0f}" font-family="{SERIF}" font-style="italic" font-size="{size*0.5:.0f}" fill="{PLUM}" text-anchor="{anchor}">{r}</text>'
                 for i, r in enumerate(rows))
    return t


def tag(x, y, size, anchor="middle"):
    return f'<text x="{x}" y="{y}" font-family="{SANS}" font-size="{size}" letter-spacing="{size*0.12:.1f}" fill="{PLUM}" fill-opacity=".75" text-anchor="{anchor}">CURSOSDEUNHAS.COM.BR</text>'


def svg(w, h, body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><rect width="{w}" height="{h}" fill="{BG}"/>{body}</svg>'


def build():
    files = []
    for k, (lines, sub) in CONCEPTS.items():
        fmt = {
            "1x1": (1080, 1080, symbol(k, 540, 360, 1.25) + text(lines, sub, 540, 640, 66, maxsub=34) + tag(540, 1010, 24)),
            "9x16": (1080, 1920, symbol(k, 540, 640, 1.6) + text(lines, sub, 540, 1080, 78, maxsub=30) + tag(540, 1700, 28)),
            "1.91x1": (1200, 628, symbol(k, 300, 300, 1.0) + text(lines, sub, 540, 230 if len(lines) > 1 else 300, 44, "start", 40) + tag(540, 580, 18, "start")),
        }
        for name, (w, h, body) in fmt.items():
            p = OUT / f"n{k}_{name}.svg"
            p.write_text(svg(w, h, body), "utf-8")
            png = p.with_suffix(".png")
            subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", f"--window-size={w},{h}",
                            f"--screenshot={png}", p.as_uri()], check=True, capture_output=True)
            files.append(png.name)
    print("\n".join(files))


if __name__ == "__main__":
    build()
