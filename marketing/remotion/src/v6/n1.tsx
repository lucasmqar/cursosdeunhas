// N1 v6 · A capa dela (cansaço → caminho → orgulho). Fonte: marketing/v6/n1/blueprint.* + LIVRO §4,
// com fontes e cores da marca (marketing/v6/ADAPTACAO-MARCA.md): Georgia + Helvetica Neue; nude, tinta, acento ameixa.
// Uma única cena no motor: as 13 capas, a legenda que pertence à página e a guilhotina (que divide a página
// que sai em dois polígonos) são compostas aqui, quadro a quadro.
import React from 'react';
import { Easing, spring, useCurrentFrame } from 'remotion';
import timing from '../timing/n1.json';
import { Timing } from '../theme';
import { FPS, V6Def, capGroups, mix, prog, useV6, wf } from './engine';
import { PAL, unhaD, brilhoD, tint } from './marca';

const t = timing as Timing;
const TOTAL = 1049;
const F = (i: number) => wf(t, i);

// ---------- paleta do N1 (só marca) ----------
const COR = {
  bg: PAL.nude,
  ink: PAL.tinta,
  acc: PAL.ameixa,
  cansaco: PAL.cinza,
  /** texto e unha sobre a página ameixa */
  claro: PAL.nude,
  /** unha limpa (ainda sem esmalte) depois da virada: só contorno dourado, como o fio do símbolo */
  contorno: PAL.dourado,
  /** unha limpa: branco com contorno dourado (sem branco, o contorno sozinho lia como cesto) */
  limpa: PAL.branco,
};

// ---------- curvas ----------
const bz = Easing.bezier;
const E = {
  esmalte: bz(0.2, 0, 0, 1),
  recuo: bz(0.5, 0, 0.75, 0),
  voo: bz(0.3, 0, 0, 1),
  traco: bz(0.6, 0, 0.2, 1),
  laco: bz(0.45, 0, 0.55, 1),
  mascara: bz(0.16, 1, 0.3, 1),
  tilt: bz(0.37, 0, 0.63, 1),
  guil: bz(0.7, 0, 0.84, 0),
};
/** mola do N1: ζ 0,74, overshoot 3,1% */
const molaN1 = (f: number, from: number) => spring({ frame: f - from, fps: FPS, config: { mass: 1, stiffness: 220, damping: 22 } });

// ---------- tipografia ----------
const GEO = 'Georgia';
const HN = '"Helvetica Neue"';
const CAP = { size: 60, weight: 500 };
const CAP_FONT = `${CAP.weight} ${CAP.size}px ${HN}`;
let ctx: CanvasRenderingContext2D | null = null;
const measure = (txt: string, font: string) => {
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  ctx!.font = font;
  return ctx!.measureText(txt).width;
};

// ---------- palavras e capas ----------
const W_ = {
  cansaco: 8, caminho: 13, primeiro: 14, unhas: 17, depois1: 18, irma: 20, depois2: 21, vizinha: 23, hoje: 24,
  unha: 26, bemfeita: 27, assinatura: 30, nao: 32, coragem: 35, comecou: 36, pequena: 40, aprender: 41, sem: 45,
  toda: 49, comeca: 52, primeira: 58, descubra: 60, por: 61, comecar: 63, leva: 64, minutos: 66,
};
const PAGE = {
  c01: 0, c02: F(1), c03: F(4), c04: F(W_.cansaco), c05: F(W_.caminho), c06: F(W_.depois1), c07: F(W_.depois2),
  c08: F(W_.hoje), c09: F(W_.nao), c10: F(W_.comecou), c11: F(W_.sem), c12: F(W_.comeca), c13: F(W_.descubra),
};
type PageId = keyof typeof PAGE;
const ORDER = Object.keys(PAGE) as PageId[];
const GUIL = 10; // guilhotina: quadros
/** a virada: antes dela, nada tem cor além da unha do gancho; nenhum som */
const VIRADA = PAGE.c05;

// ---------- legenda (pertence à página) ----------
const GROUPS = capGroups(t, 3);
const PROMO = new Set([W_.cansaco, W_.caminho, W_.hoje, W_.coragem, W_.pequena, W_.aprender]);
const gone = (i: number, f: number) => PROMO.has(i) && f >= F(i);
const groupAt = (f: number) => {
  let g = -1;
  for (let j = 0; j < GROUPS.length; j++) if (f >= GROUPS[j].s - 2) g = j;
  if (g < 0) return null;
  const G = GROUPS[g];
  const nextS = GROUPS[g + 1]?.s ?? Infinity;
  if (f > G.e + 10 && f < nextS - 2) return null;
  return G;
};
/** x de cada palavra do grupo (as que voaram fecham o vão em 6 f) */
const capLayout = (f: number) => {
  const G = groupAt(f);
  if (!G || f >= PAGE.c13) return null;
  const sp = measure(' ', CAP_FONT);
  let x = 0;
  const words: { i: number; x: number; w: number }[] = [];
  for (let i = G.i0; i <= G.i1; i++) {
    const w = measure(t.words[i].w, CAP_FONT);
    if (gone(i, f)) {
      const c = 1 - prog(f, F(i), 6, E.voo);
      x += (w + sp) * c;
      continue;
    }
    words.push({ i, x, w });
    x += w + sp;
  }
  return { G, words };
};
/** x (relativo à margem) da palavra i na legenda, no quadro em que ela sai */
const capX = (i: number) => {
  const G = GROUPS.find((g) => i >= g.i0 && i <= g.i1)!;
  const sp = measure(' ', CAP_FONT);
  let x = 0;
  for (let j = G.i0; j < i; j++) if (!gone(j, F(i) - 1)) x += measure(t.words[j].w, CAP_FONT) + sp;
  return x;
};

const Caption: React.FC<{ f: number; ink: string; fio: string; sq: boolean }> = ({ f, ink, fio, sq }) => {
  const L = capLayout(f);
  if (!L) return null;
  const X0 = 72;
  const base = sq ? 1452 : 1360;
  // palavra falada (as promovidas nunca recebem o fio)
  const cand = L.words.filter((w) => !PROMO.has(w.i) && f >= F(w.i) - 2);
  let fioEl: React.ReactNode = null;
  if (cand.length) {
    const cur = cand[cand.length - 1];
    const prev = cand.length > 1 ? cand[cand.length - 2] : null;
    const p = prog(f, F(cur.i) - 2, 4, E.esmalte);
    const x0 = prev ? mix(prev.x, cur.x, p) : cur.x;
    const x1 = prev ? mix(prev.x + prev.w, cur.x + cur.w, p) : cur.x + cur.w * p;
    fioEl = <rect x={X0 + x0} y={base + 16} width={Math.max(0, x1 - x0)} height={6} fill={fio} />;
  }
  return (
    <g>
      {L.words.map((w) => (
        <text key={w.i} x={X0 + w.x} y={base} fill={ink} style={{ font: CAP_FONT }}>{t.words[w.i].w}</text>
      ))}
      {fioEl}
    </g>
  );
};

// ---------- palavra promovida (sai da legenda e voa até a manchete) ----------
type Promo = { i: number; font: string; family?: string; size: number; x: number; base: number; color: string; dur?: number; startSize?: number; useMola?: boolean; ls?: string };
/** devolve [em voo, pousada]: a pousada vai para trás da figura */
const promoted = (p: Promo, f: number, sq: boolean): [React.ReactNode, React.ReactNode] => {
  const t0 = F(p.i);
  if (f < t0) return [null, null];
  const dur = p.dur ?? 12;
  const k = prog(f, t0, dur, E.voo);
  const capBase = sq ? 1452 : 1360;
  const xs = 72 + capX(p.i), ys = capBase;
  const cx = (xs + p.x) / 2 + 230, cy = (ys + p.base) / 2;
  const x = (1 - k) * (1 - k) * xs + 2 * (1 - k) * k * cx + k * k * p.x;
  const y = (1 - k) * (1 - k) * ys + 2 * (1 - k) * k * cy + k * k * p.base;
  const s0 = p.startSize ?? 90;
  const sizeNow = p.useMola ? s0 + (p.size - s0) * molaN1(f, t0) : mix(s0, p.size, k);
  const el = (
    <text x={0} y={0} fill={p.color} transform={`translate(${x} ${y}) scale(${sizeNow / p.size})`}
      style={{ font: `${p.font} ${p.size}px ${p.family ?? GEO}`, letterSpacing: p.ls }}>
      {t.words[p.i].w}
    </text>
  );
  const landed = k >= 1 && (!p.useMola || f - t0 > dur + 12);
  return landed ? [null, el] : [el, null];
};

// ---------- o leque (símbolo da marca: 5 unhas em arco + fio dourado) ----------
// Asset n1_9x16.svg: pivô (540,704), raio 216, unhas 70×110 a −64/−32/0/32/64°, fio dourado de 480 px no pivô.
// Aqui em escala 1 = 1,85× o asset: raio 400, unhas 130×204, fio de 888 px. Nada de mão, palma ou dedo.
const ANG = [-64, -32, 0, 32, 64];
const R0 = 400, NW0 = 130, NH0 = 204, LH0 = 444;
const LEQUE = PAL.leque; // rosé → ameixa, como no asset
const MEIO = 2;
type LequeP = { id: string; cx: number; py: number; s: number; base?: string; contorno?: string; fill: number[]; colors?: string[]; linha?: number; brilhoBase?: boolean; only?: number[] };
const Leque: React.FC<LequeP> = ({ id, cx, py, s, base, contorno, fill, colors = LEQUE, linha = 0, brilhoBase, only }) => {
  const R = R0 * s, w = NW0 * s, h = NH0 * s;
  return (
    <g>
      {linha > 0 ? (
        <path d={`M${Math.max(cx - LH0 * s, cx - 390)} ${py} H${Math.min(cx + LH0 * s, cx + 390, 930)}`} pathLength={1} fill="none" stroke={PAL.dourado}
          strokeWidth={Math.max(4, 9 * s)} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - linha} />
      ) : null}
      {ANG.map((a, k) => {
        if (only && !only.includes(k)) return null;
        const ncx = cx, ncy = py - R;
        const d = unhaD(ncx, ncy, w, h);
        const p = fill[k] ?? 0;
        const cid = `${id}-u${k}`;
        const cor = colors[k];
        const sw = (3 * w) / 44;
        return (
          <g key={k} transform={`rotate(${a} ${cx} ${py})`}>
            <clipPath id={cid}><path d={d} /></clipPath>
            {base ? <path d={d} fill={base} /> : null}
            {base && brilhoBase ? <path d={brilhoD(ncx, ncy, w, h)} fill="none" stroke={tint(PAL.branco, base, 0.4)} strokeWidth={sw} strokeLinecap="round" /> : null}
            {contorno && p < 1 ? (
              <svg x={ncx - w} y={ncy - h} width={w * 2} height={Math.max(0, h / 2 + h - p * h)} overflow="hidden">
                <path d={d} transform={`translate(${-(ncx - w)} ${-(ncy - h)})`} fill="none" stroke={contorno} strokeWidth={Math.max(3, 5 * s)} />
              </svg>
            ) : null}
            {p > 0 ? (
              <g clipPath={`url(#${cid})`}>
                <rect x={ncx - w} y={ncy + h / 2 - p * h - 1} width={w * 2} height={p * h + 4} fill={cor} />
                {p > 0.72 ? <path d={brilhoD(ncx, ncy, w, h)} fill="none" stroke={tint(PAL.branco, cor, 0.45)} strokeWidth={sw} strokeLinecap="round" /> : null}
              </g>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

// ---------- elementos fixos ----------
const URL = 'cursosdeunhas.com.br/comecar';
const URL_FONT = `500 50px ${HN}`;
const FLOREIO = 'M0 120 C40 40 90 20 110 70 C125 110 80 140 70 110 C60 80 120 40 160 60 C190 75 175 120 200 115 C230 108 250 60 288 40';
/** "1" de Georgia Bold (algarismo de texto), contorno em coordenadas de tela: x 72–551, y 450–1090 */
const UM = 'M551.3 1090H74.3V1046.1Q91.7 1044.9 129.5 1040.3Q167.4 1035.7 181.3 1031Q198.6 1025.2 208.4 1011.4Q218.3 997.5 218.3 973.2V606.7H72V551.8H103.8Q154.1 551.8 190.8 540.8Q227.5 529.8 251.8 514.2Q276.7 498 292.6 480.6Q308.5 463.3 317.7 450H419.5Q417.7 487.6 416 537.9Q414.3 588.2 414.3 628.1V966.9Q414.3 987.7 423.2 1003Q432.2 1018.3 448.9 1026.4Q464 1033.3 499.2 1039.1Q534.5 1044.9 551.3 1046.1Z';

const Traco: React.FC<{ d: string; p: number; color: string; w: number; tr?: string }> = ({ d, p, color, w, tr }) =>
  p <= 0 ? null : (
    <path d={d} transform={tr} pathLength={1} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray="1 1" strokeDashoffset={1 - p} />
  );

/** linha que sobe por trás da própria máscara (svg aninhado recorta) */
const Sobe: React.FC<{ f: number; at: number; dur?: number; x: number; base: number; size: number; asc?: number; desc?: number; children: React.ReactNode }> = ({
  f, at, dur = 9, x, base, size, asc = 0.95, desc = 0.3, children,
}) => {
  if (f < at) return null;
  const p = prog(f, at, dur, E.mascara);
  const top = base - size * asc;
  const h = size * (asc + desc);
  return (
    <svg x={x - 20} y={top} width={1100} height={h} overflow="hidden">
      <g transform={`translate(20 ${size * asc + (1 - p) * h * 1.04})`}>{children}</g>
    </svg>
  );
};

// ---------- capas ----------
const tiltOf = (f: number, from: number, to: number) => prog(f, from, Math.max(1, to - from), E.tilt);
const nextPage = (id: PageId) => {
  const k = ORDER.indexOf(id);
  return k + 1 < ORDER.length ? PAGE[ORDER[k + 1]] : TOTAL;
};

/** câmera do plano da figura: escala a partir de (540,960), deslocamento em px de tela */
const cam = (s: number, x: number, y: number) => `translate(${540 + x} ${960 + y}) scale(${s}) translate(-540 -960)`;
/** câmera que põe o ponto (px,py) do plano em (sx,sy) da tela com escala s */
const camTo = (s: number, px: number, py: number, sx: number, sy: number) => cam(s, sx - 540 - s * (px - 540), sy - 960 - s * (py - 960));

/** antes da virada o leque afunda devagar (nada para totalmente) */
const desc = (f: number) => 36 * prog(f, 0, 209, E.tilt);
/** pivô do leque da capa (a unha do meio só morde o pé da manchete) */
const PY0 = 1020;
/** escala do leque da capa (1,1 = raio 440, unhas 143×224) */
const S1 = 1.1;
/** esmalte da unha do meio no gancho: 40→52% e congela; recua com "cansaço." */
const meioGancho = (f: number) =>
  f < PAGE.c04 ? mix(0.4, 0.52, prog(f, 0, 8, E.esmalte)) : 0.52 * (1 - prog(f, PAGE.c04, 12, E.recuo));
const cinzaFill = (f: number) => [0, 0, meioGancho(f), 0, 0];
/** a unha do meio fica em 52% até "Sem sair de casa" (o laço do gancho só fecha lá) */
/** as unhas da vizinha enchem em f366–380 (stagger 2 f): 50 f completas antes de "unha" (f430) */
const VIZ = 366;
const pinta = (f: number, at: number, meio = 0.52, stag = 3) => ANG.map((_, k) => prog(f, at + stag * k, 6, E.esmalte) * (k === MEIO ? meio : 1));

const Page: React.FC<{ id: PageId; f: number; sq: boolean }> = ({ id, f, sq }) => {
  const from = PAGE[id];
  const to = nextPage(id);
  const tilt = tiltOf(f, from, to);
  const ty = -38 * tilt; // manchete
  const fy = -61 * tilt; // figura (paralaxe 1,6×)
  const cap = (ink = COR.ink, fio = f < VIRADA ? COR.ink : COR.acc) => <Caption f={f} ink={ink} fio={fio} sq={sq} />;
  // 1:1: a faixa visível é y 420–1500 e o tilt sobe a manchete 38 px; os glifos ficam em y ≥ 480 em repouso
  const o = sq ? 60 : 0;
  let bg = COR.bg;
  let body: React.ReactNode = null;
  const head = (base9: number, baseSq: number) => (sq ? baseSq : base9);

  if (id === 'c01' || id === 'c02' || id === 'c03' || id === 'c04') {
    const py = PY0 + desc(f) + o;
    // nos planos fechados só entram as unhas que cabem inteiras (as laterais cortadas na borda viravam cunhas)
    const only = id === 'c01' ? [MEIO] : id === 'c03' ? [1, 2, 3] : undefined;
    const leque = <Leque id={id} cx={540} py={py} s={S1} base={COR.cansaco} brilhoBase fill={cinzaFill(f)} only={only} />;
    // gancho: macro 2,4× na unha do meio; c03: plano médio 1,5×
    const camT = id === 'c01' ? camTo(2.4, 540, PY0 + o - R0 * S1, 540, 900)
      : id === 'c03' ? camTo(1.5, 540, PY0 + o - R0 * S1, 540, 720) : '';
    let fly: React.ReactNode = null, landed: React.ReactNode = null;
    if (id === 'c04') {
      [fly, landed] = promoted({ i: W_.cansaco, font: `italic 400`, size: 230, x: 72, base: head(540, 600), color: COR.ink, ls: '-0.02em' }, f, sq);
    }
    body = (
      <>
        {landed}
        <g transform={camT}>{leque}</g>
        {fly}
      </>
    );
  } else if (id === 'c05') {
    const py = PY0 + 36 + (sq ? 90 : 0); // 1:1: "caminho." desce a 630, a unha acompanha
    const [fly, landed] = promoted({ i: W_.caminho, font: '700', size: 200, x: 72, base: head(540, 630) + ty, color: COR.acc, ls: '-0.02em' }, f, sq);
    const m = molaN1(f, F(W_.primeiro));
    const recolhe = f >= F(W_.primeiro);
    const linha = prog(f, from, 16, E.traco); // "um caminho": o fio dourado do símbolo se desenha
    body = (
      <>
        {recolhe ? null : landed}
        <g transform={`translate(0 ${fy})`}>
          <Leque id={id} cx={540} py={py} s={S1} base={COR.limpa} contorno={COR.contorno} fill={pinta(f, F(W_.unhas))} linha={linha} />
        </g>
        {fly}
        {recolhe ? (
          <text x={0} y={0} fill={COR.acc} transform={`translate(72 ${mix(head(540, 630) + ty, head(345, 540), m)}) scale(${mix(1, 96 / 200, m)})`}
            style={{ font: `700 200px ${GEO}`, letterSpacing: '-0.02em' }}>caminho.</text>
        ) : null}
        <g transform={`translate(0 ${ty})`}>
          <Sobe f={f} at={F(W_.primeiro) + 2} dur={15} x={72} base={head(640, 760)} size={200}>
            <text x={0} y={0} fill={COR.ink} style={{ font: `400 200px ${GEO}` }}>I</text>
          </Sobe>
        </g>
      </>
    );
  } else if (id === 'c06' || id === 'c07') {
    const header = (
      <text x={72} y={head(345, 540)} fill={COR.acc} style={{ font: `700 96px ${GEO}`, letterSpacing: '-0.02em' }}>caminho.</text>
    );
    const num = (
      <text x={72} y={head(640, 760) + ty} fill={COR.ink} style={{ font: `400 200px ${GEO}` }}>{id === 'c06' ? 'II' : 'III'}</text>
    );
    const dela = pinta(Infinity, 0);
    const py = sq ? 1150 : 1090;
    // os leques dividem um único fio dourado de margem a margem: o caminho que passa de uma para outra
    const fio = <path d={`M72 ${py} H930`} stroke={PAL.dourado} strokeWidth={6} strokeLinecap="round" />;
    let leques: React.ReactNode;
    if (id === 'c06') {
      leques = (
        <>
          {fio}
          <Leque id="c06e" cx={260} py={py} s={0.5} base={COR.limpa} contorno={COR.contorno} fill={dela} />
          <Leque id="c06i" cx={690} py={py} s={0.5} base={COR.limpa} contorno={COR.contorno} fill={pinta(f, F(W_.irma), 1)} />
        </>
      );
    } else {
      leques = (
        <>
          {fio}
          <Leque id="c07e" cx={180} py={py} s={0.33} base={COR.limpa} contorno={COR.contorno} fill={dela} />
          <Leque id="c07i" cx={470} py={py} s={0.33} base={COR.limpa} contorno={COR.contorno} fill={pinta(Infinity, 0, 1)} />
          <Leque id="c07v" cx={760} py={py} s={0.33} base={COR.limpa} contorno={COR.contorno} fill={pinta(f, VIZ, 1, 2)} />
        </>
      );
    }
    body = (
      <>
        {header}
        {num}
        <g transform={`translate(0 ${fy})`}>{leques}</g>
      </>
    );
  } else if (id === 'c08') {
    bg = COR.acc;
    const [fly, landed] = promoted({ i: W_.hoje, font: 'italic 400', size: 230, x: 72, base: head(600, 660) + ty, color: COR.claro, ls: '-0.02em' }, f, sq);
    const pN = prog(f, F(W_.unha), F(W_.bemfeita) - F(W_.unha), E.esmalte);
    const cx = 432, cy = sq ? 1000 : 960, w = 400, h = 560;
    const d = unhaD(cx, cy, w, h);
    // a escada atravessa o corte: os 3 leques de c07 seguem (claros sobre o ameixa) até "unha" (f430),
    // e a unha gigante nasce no lugar deles
    const escada = f < F(W_.unha) ? (() => {
      const py = sq ? 1150 : 1090;
      const all = [1, 1, 1, 1, 1], claro = ANG.map(() => COR.claro);
      return (
        <g transform={`translate(0 ${-61 + fy})`}>
          <path d={`M72 ${py} H930`} stroke={PAL.dourado} strokeWidth={6} strokeLinecap="round" />
          {[180, 470, 760].map((x, k) => <Leque key={k} id={`c08e${k}`} cx={x} py={py} s={0.33} base={COR.claro} fill={all} colors={claro} />)}
        </g>
      );
    })() : null;
    body = (
      <>
        {landed}
        {escada}
        <g transform={`translate(0 ${fy})`}>
          <clipPath id="c08n"><path d={d} /></clipPath>
          {pN > 0 ? (
            <g clipPath="url(#c08n)">
              <rect x={cx - w} y={cy + h / 2 - pN * h - 1} width={w * 2} height={pN * h + 4} fill={COR.claro} />
              {pN > 0.8 ? <path d={brilhoD(cx, cy, w, h)} fill="none" stroke={PAL.branco} strokeWidth={(3 * w) / 44} strokeLinecap="round" /> : null}
            </g>
          ) : null}
        </g>
        <g transform={`translate(0 ${ty})`}>
          <Traco d={FLOREIO} tr={`translate(720 1060)`} p={prog(f, F(W_.assinatura), 16, E.traco)} color={COR.claro} w={9} />
        </g>
        {fly}
      </>
    );
    return <PageSvg bg={bg}>{body}{cap(COR.claro, COR.claro)}</PageSvg>;
  } else if (id === 'c09') {
    const base = head(540, 600);
    const [fly, landed] = promoted({ i: W_.coragem, font: 'italic 400', size: 230, x: 72, base: base + ty, color: COR.ink, ls: '-0.02em' }, f, sq);
    const pR = prog(f, F(W_.coragem) + 12, 9, E.traco);
    body = (
      <>
        {landed}
        <g transform={`translate(0 ${ty})`}>
          <Traco d={`M60 ${base - 55} H1054`} p={pR} color={COR.ink} w={6} />
        </g>
        {fly}
      </>
    );
  } else if (id === 'c10') {
    const [flyP, landedP] = promoted({ i: W_.pequena, font: '500', family: HN, size: 48, x: 72, base: 925 + ty, color: COR.ink, startSize: 60 }, f, sq);
    const [flyA, landedA] = promoted({ i: W_.aprender, font: '700', size: 168, x: 72, base: 1170 + ty, color: COR.acc, ls: '-0.02em', useMola: true, dur: 15 }, f, sq);
    body = (
      <>
        <g transform={`translate(0 ${ty})`}>
          <text x={72} y={head(520, 560)} fill={COR.ink} style={{ font: `italic 400 150px ${GEO}`, letterSpacing: '-0.02em' }}>coragem.</text>
          <rect x={60} y={head(520, 560) - 39} width={668} height={6} fill={COR.ink} />
        </g>
        {landedP}
        {landedA}
        {flyP}
        {flyA}
      </>
    );
  } else if (id === 'c11') {
    // o gancho em cor: a unha do meio completa de 52% a 100% em "Sem sair de casa." (o laço fecha)
    const camY = mix(900, 862, tilt);
    const pM = mix(0.52, 1, prog(f, F(W_.sem), 24, E.laco));
    body = (
      <g transform={camTo(2.4, 540, PY0 + o - R0 * S1, 540, camY)}>
        <Leque id="c11" cx={540} py={PY0 + o} s={S1} base={COR.limpa} contorno={COR.contorno} fill={[1, 1, pM, 1, 1]} only={[MEIO]} />
      </g>
    );
  } else if (id === 'c12') {
    const pC = prog(f, from + 4, 30, E.traco);
    const pF = prog(f, F(W_.primeira), 15, E.mascara);
    body = (
      <g transform={`translate(0 ${ty + (sq ? 60 : 0)})`}>
        <clipPath id="c12um"><path d={UM} /></clipPath>
        {pF > 0 ? <rect x={60} y={1092 - pF * 650} width={510} height={pF * 650 + 4} fill={COR.acc} clipPath="url(#c12um)" /> : null}
        <Traco d={UM} p={pC} color={COR.ink} w={3} />
      </g>
    );
  } else if (id === 'c13') {
    const ob = sq ? 180 : 0;
    const pR = prog(f, F(W_.comecar) + 7, 9, E.mascara);
    const urlW = Math.ceil(measure(URL, URL_FONT)) + 64;
    body = (
      <>
        <g transform={`translate(0 ${fy})`}>
          <Leque id="c13" cx={690} py={(sq ? 1468 : 1420)} s={0.54} fill={[1, 1, 1, 1, 1]} linha={1} />
        </g>
        <g transform={`translate(0 ${ty + ob})`}>
          <Sobe f={f} at={F(W_.descubra)} x={72} base={382} size={44}>
            <text x={0} y={0} fill={COR.ink} style={{ font: `700 44px ${HN}`, letterSpacing: '0.14em' }}>DESCUBRA</text>
          </Sobe>
          <Sobe f={f} at={F(W_.por)} x={72} base={540} size={150}>
            <text x={0} y={0} fill={COR.ink} style={{ font: `italic 400 150px ${GEO}`, letterSpacing: '-0.01em' }}>por onde</text>
          </Sobe>
          <Sobe f={f} at={F(W_.comecar)} x={72} base={690} size={150}>
            <text x={0} y={0} fill={COR.ink} style={{ font: `italic 400 150px ${GEO}`, letterSpacing: '-0.01em' }}>começar.</text>
          </Sobe>
          {pR > 0 ? (
            <svg x={72} y={776} width={urlW * pR} height={108} overflow="hidden">
              <rect x={0} y={0} width={urlW} height={108} fill={COR.acc} />
              <text x={32} y={71} fill={COR.claro} style={{ font: URL_FONT }}>{URL}</text>
            </svg>
          ) : null}
          <Sobe f={f} at={F(W_.leva)} x={72} base={962} size={40}>
            <text x={0} y={0} fill={COR.ink} style={{ font: `500 40px ${HN}`, letterSpacing: '0.14em' }}>LEVA 2 MINUTOS</text>
          </Sobe>
          <Traco d={FLOREIO} tr="translate(72 996)" p={prog(f, F(W_.minutos) + 18, 22, E.traco)} color={COR.acc} w={9} />
        </g>
      </>
    );
    return <PageSvg bg={bg}>{body}</PageSvg>;
  }
  return <PageSvg bg={bg}>{body}{cap()}</PageSvg>;
};

const PageSvg: React.FC<{ bg: string; children: React.ReactNode }> = ({ bg, children }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', left: 0, top: 0 }}>
    <rect width={1080} height={1920} fill={bg} />
    {children}
  </svg>
);

// ---------- guilhotina 12° ----------
const TAN = Math.tan((12 * Math.PI) / 180);
const yL = 960 + 540 * TAN, yR = 960 - 540 * TAN;
const NX = -Math.sin((12 * Math.PI) / 180), NY = -Math.cos((12 * Math.PI) / 180);
const Guilhotina: React.FC<{ old: PageId; f: number; at: number; sq: boolean }> = ({ old, f, at, sq }) => {
  const p = prog(f, at, GUIL, E.guil);
  const dist = 1.1 * 1080 * p;
  const half = (top: boolean) => (
    <div style={{
      position: 'absolute', inset: 0,
      clipPath: top ? `polygon(0 0, 1080px 0, 1080px ${yR}px, 0 ${yL}px)` : `polygon(0 ${yL}px, 1080px ${yR}px, 1080px 1920px, 0 1920px)`,
      transform: `translate(${(top ? 1 : -1) * NX * dist}px, ${(top ? 1 : -1) * NY * dist}px)`,
    }}>
      <Page id={old} f={f} sq={sq} />
    </div>
  );
  return <>{half(true)}{half(false)}</>;
};

const Filme: React.FC = () => {
  const f = useCurrentFrame();
  const { sq } = useV6();
  let cur: PageId = 'c01';
  for (const id of ORDER) if (f >= PAGE[id]) cur = id;
  const guil = (id: PageId, prev: PageId) => cur === id && f < PAGE[id] + GUIL ? <Guilhotina old={prev} f={f} at={PAGE[id]} sq={sq} /> : null;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, overflow: 'hidden' }}>
      <Page id={cur} f={f} sq={sq} />
      {guil('c09', 'c08')}
      {guil('c13', 'c12')}
    </div>
  );
};

export const N1: V6Def = {
  k: 1,
  timing: t,
  total: TOTAL,
  lead: 0,
  fonts: [
    `italic 400 230px ${GEO}`, `700 200px ${GEO}`, `400 200px ${GEO}`, `italic 400 150px ${GEO}`,
    `500 60px ${HN}`, `700 44px ${HN}`, `500 48px ${HN}`, `500 50px ${HN}`, `500 40px ${HN}`,
  ],
  scenes: [{ id: 'capas', from: 0, bg: COR.bg, C: Filme }],
  tracks: [
    // A: a rede que se espalha (cresce sozinha no arquivo); corta a zero antes de "Não"
    { src: 'audio/v6/n1_beat1.mp3', from: 220, to: 512, db: -6, trimBefore: 60, duckDb: -4,
      keys: [[220, -60], [235, -6], [506, -6], [512, -60]] },
    // B: "aprender." fica só na voz (−42 dBFS); o drop (16,02 s do arquivo) responde em f656, quando a palavra termina
    { src: 'audio/v6/n1_beat1.mp3', from: 645, to: TOTAL, db: -20, trimBefore: 470, duckDb: -8,
      keys: [[645, -60], [656, -20], [971, -20], [985, -16], [1013, -16], [1049, -60]] },
  ],
  sfx: [
    // o caminho aparece: golpe si♭4 + fá5 no corte para a cor, a −26 dB (nunca por cima de "caminho."); único efeito
    { src: 'audio/v6/n1_abertura.mp3', at: 210, db: -26, trimBefore: 77, dur: 36 },
  ],
};
