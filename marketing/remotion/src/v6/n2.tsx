// N2 v6 · "A noite dela" — edição noturna de revista literária (Hopper + The New Yorker).
// Fonte: marketing/v6/n2/blueprint.* + Livro §5, com fontes e cores da marca (marketing/v6/ADAPTACAO-MARCA.md):
// Georgia no diário e no título; Helvetica Neue no fólio-relógio e na URL; noite #24101C, acento dourado.
// Física do N2: crítica, zero overshoot; câmera em tripé (só deriva de +19 px por página, na ilustração).
// Nada de opacidade: tudo entra/sai por máscara (clip-path), persiana, traço, morph ou página virada.
import React from 'react';
import { Audio, Easing, Sequence, spring, staticFile, useCurrentFrame } from 'remotion';
import timing from '../timing/n2.json';
import { Timing } from '../theme';
import { T, Transition, V6Def, gainAt, sec, speech, useV6, wf, wfe } from './engine';
import { PAL, SANS, SERIF } from './marca';

const t = timing as Timing;
const B = Easing.bezier;
const E = {
  persiana: B(0.45, 0, 0.55, 1),
  janela: B(0.76, 0, 0.24, 1),
  linha: B(0.33, 0, 0.67, 1),
  vira: B(0.65, 0, 0.35, 1),
  varre: B(0.16, 1, 0.3, 1),
  sai: B(0.7, 0, 0.84, 0),
};
const sine = Easing.inOut(Easing.sin);
const cl = (x: number) => Math.min(1, Math.max(0, x));
/** progresso 0..1 a partir do quadro absoluto a, em d quadros */
const P = (f: number, a: number, d: number, e: (x: number) => number) => (d <= 0 ? (f >= a ? 1 : 0) : e(cl((f - a) / d)));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// ---------- cores (marca) ----------
const NOITE = PAL.noite;
const APAG = PAL.ameixaProf; // janela/oval apagada, verso
const OURO = PAL.dourado; // a luz dela
const LUA = PAL.nude; // texto e janelas acesas dos vizinhos sobre a noite
const FIO = PAL.cinza; // fólio sobre a noite

// ---------- tempo ----------
const ws = (i: number) => wf(t, i);
const we = (i: number) => wfe(t, i);
const useF = () => useCurrentFrame() + useV6().from;

// ---------- 1:1 ----------
// O 1:1 é o quadrado y 420–1500. Para dar respiro (o diário encostaria na borda), a página inteira
// (menos o fundo) vai a 0,9 e sobe 30 px no 1:1. A linha 1 da fachada some (já nasce apagada).
const SQS = 0.9;
const SQDY = -30;
const sqX = (x: number) => 540 + (x - 540) * SQS;
const sqY = (y: number) => 960 + (y - 960) * SQS + SQDY;
const Scaled: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sq } = useV6();
  return (
    <div style={{ position: 'absolute', inset: 0, transformOrigin: '540px 960px', transform: sq ? `translateY(${SQDY}px) scale(${SQS})` : undefined }}>
      {children}
    </div>
  );
};

// ---------- deriva da câmera (tripé): +19 px por página, só na ilustração ----------
const PAGES = { p1: [0, 105], p2: [105, 380], p3: [380, 569], p4: [569, 704], p5: [704, 868] } as const;
const drift = (f: number, [a, b]: readonly [number, number]) => 19 * sine(cl((f - a) / (b - a)));

// ---------- diário (a legenda é a página) ----------
// Georgia Regular 62/80; linha de escrita com linha de base em y 1470; 3 linhas visíveis em y 1250–1490.
const LINES: [number, number][] = [
  [0, 2], [3, 5], [6, 8], [9, 13], [14, 17], [18, 22], [23, 24], [25, 29], [30, 33],
  [34, 38], [39, 43], [44, 45], [46, 49], [50, 53], [54, 56], [57, 58], [59, 61],
];
const NO_RISE = new Set([12, 16]); // a página vira / a persiana cobre
const KEY = new Set([16, 17, 30, 58]); // só dela · aprender · agradecer
const lineOf = (i: number) => LINES.findIndex(([a, b]) => i >= a && i <= b);
/** subida da linha L: começa logo que a frase acaba e TERMINA antes da 1ª palavra da linha seguinte
 *  (a linha nova nasce sempre parada e inteira na linha de escrita). 12 f quando há folga, 6 f no mínimo. */
const rise = (L: number) => {
  const last = LINES[L][1];
  const next = LINES[L + 1]?.[0];
  if (NO_RISE.has(L) || next === undefined) return { r: Infinity, d: 12 };
  const d = Math.max(6, Math.min(12, ws(next) - (ws(last) + 3)));
  return { r: Math.min(we(last), ws(next) - d), d };
};
const riseP = (L: number, f: number) => {
  const { r, d } = rise(L);
  return P(f, r, d, E.linha);
};
const wordP = (i: number, f: number) => P(f, ws(i), Math.max(1, Math.min(we(i) - ws(i), 8)), E.linha);

const D = { left: 120, top: 1250, h: 240, lh: 80, fs: 62, base: 61.63 };
const PAD = 20; // folga à esquerda da janela de recorte (o cursor não é cortado)
const WRITE_TOP = 1470 - D.base - D.top; // topo da linha de escrita dentro da janela
const CUR = { w: 4, h: 56, top: 1425 - (1470 - D.base) }; // cursor de 0,9 em, sem piscar

const Cursor: React.FC<{ color: string; left: string | number; top: number; h?: number; w?: number; sy?: number }> = ({ color, left, top, h = CUR.h, w = CUR.w, sy = 1 }) => (
  <span style={{ position: 'absolute', left, top, width: w, height: h, background: color, transform: sy < 1 ? `scaleY(${sy})` : undefined, transformOrigin: '50% 100%' }} />
);

/** palavra revelada por máscara da esquerda para a direita (nunca opacidade) */
const Word: React.FC<{ i: number; f: number; color: string; italic?: boolean; cursor?: { color: string; h: number; w: number; top: number; sy?: number } }> = ({ i, f, color, italic, cursor }) => {
  const p = wordP(i, f);
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span
        style={{
          display: 'inline-block', color, fontStyle: italic ? 'italic' : 'normal',
          visibility: p <= 0 ? 'hidden' : 'visible',
          clipPath: p >= 1 ? undefined : `inset(-14px ${((1 - p) * 100).toFixed(3)}% -14px -14px)`,
        }}
      >
        {t.words[i].w}
      </span>
      {cursor ? <Cursor color={cursor.color} left={`calc(${(p * 100).toFixed(3)}% - ${cursor.w / 2}px)`} top={cursor.top} h={cursor.h} w={cursor.w} sy={cursor.sy} /> : null}
    </span>
  );
};

const Diario: React.FC<{ f: number; L0: number; L1: number; ink: string; hi: string; cur: string }> = ({ f, L0, L1, ink, hi, cur }) => {
  const i0 = LINES[L0][0], i1 = LINES[L1][1];
  let last = -1;
  for (let i = i0; i <= i1; i++) if (f >= ws(i)) last = i;
  type Mode = { k: 'park' } | { k: 'word'; i: number } | { k: 'rise'; L: number; q: number };
  let mode: Mode = { k: 'park' };
  if (last >= 0) {
    const Lw = lineOf(last);
    const { r, d } = rise(Lw);
    if (f >= r + d) mode = { k: 'park' };
    else if (f >= r) mode = { k: 'rise', L: Lw, q: riseP(Lw, f) };
    else mode = { k: 'word', i: last };
  }
  const cDef = { color: cur, h: CUR.h, w: CUR.w, top: CUR.top };
  const lines = [];
  for (let M = L0; M <= L1; M++) {
    // quantas vezes a linha M já subiu (ela sobe uma vez a cada frase completada a partir dela)
    let up = 0;
    for (let L = M; L <= L1; L++) up += riseP(L, f);
    // 3 vagas: escrita (0), meio (1), topo (2). Ao passar do topo, a linha sai INTEIRA pela própria máscara
    // (o texto sobe dentro da caixa da vaga do topo, 60% do tempo da subida, ease-in); nunca para cortada.
    let exitP = 0;
    if (up > 2) {
      const L = M + 2;
      if (L > L1) continue;
      const { r, d } = rise(L);
      exitP = P(f, r, Math.max(3, Math.round(d * 0.6)), E.sai);
      if (exitP >= 1) continue;
    }
    const top = up > 2 ? WRITE_TOP - 2 * D.lh : WRITE_TOP - D.lh * up;
    if (top > D.h) continue;
    const [a, b] = LINES[M];
    const words = [];
    for (let i = a; i <= b; i++) {
      words.push(<Word key={i} i={i} f={f} color={KEY.has(i) ? hi : ink} italic={KEY.has(i)} cursor={mode.k === 'word' && mode.i === i ? cDef : undefined} />);
      if (i < b) words.push(' ');
    }
    lines.push(
      <div key={M} style={{ position: 'absolute', left: 0, top, width: 960, height: D.lh, whiteSpace: 'nowrap', overflow: up > 2 ? 'hidden' : 'visible' }}>
        <div style={{ position: 'absolute', left: PAD, top: 0, transform: exitP > 0 ? `translateY(${(-108 * exitP).toFixed(3)}%)` : undefined }}>
          <span style={{ position: 'relative', display: 'inline-block' }}>
            {words}
            {mode.k === 'rise' && mode.L === M ? (
              <Cursor color={cur} left={`calc(${((1 - mode.q) * 100).toFixed(3)}% - ${CUR.w / 2}px)`} top={CUR.top + D.lh * mode.q} />
            ) : null}
          </span>
        </div>
      </div>,
    );
  }
  return (
    <div style={{ position: 'absolute', left: D.left - PAD, top: D.top, width: 960, height: D.h, overflow: 'hidden', font: `400 ${D.fs}px/${D.lh}px ${SERIF}`, fontSynthesis: 'none' }}>
      {lines}
      {mode.k === 'park' ? <Cursor color={cur} left={PAD - CUR.w / 2} top={WRITE_TOP + CUR.top} /> : null}
    </div>
  );
};

// ---------- fólio-relógio (Helvetica Neue Medium 34, algarismos tabulares) ----------
type Step = { at: number; v: string; dur: number; dir: 1 | -1 };
const Folio: React.FC<{ f: number; init: string; steps?: Step[]; color: string }> = ({ f, init, steps = [], color }) => {
  const { sq } = useV6();
  let prev = init, cur = init, q = 1, dir: 1 | -1 = 1;
  for (const s of steps) {
    if (f >= s.at) {
      prev = cur;
      cur = s.v;
      q = P(f, s.at, s.dur, s.dur >= 12 ? E.varre : E.vira);
      dir = s.dir;
    }
  }
  const base = sq ? 480 : 300; // linha de base (no 1:1 o fólio desce para dentro do quadrado)
  const box = 40, bl = 32.9;
  const txt = (s: string, y: number) => (
    <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateY(${y}%)`, whiteSpace: 'nowrap' }}>{s}</div>
  );
  return (
    <div style={{ position: 'absolute', left: 870, top: base - bl, width: 160, height: box, overflow: 'hidden', font: `500 34px/${box}px ${SANS}`, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em', color, fontSynthesis: 'none' }}>
      {q < 1 ? (
        <>
          {txt(prev, dir * q * 100)}
          {txt(cur, -dir * (1 - q) * 100)}
        </>
      ) : (
        txt(cur, 0)
      )}
    </div>
  );
};

// ---------- fachada (4 × 5 janelas de 150, calha 40, x 120–840, y 300–1210) ----------
const COLX = [120, 310, 500, 690];
const ROWY = [300, 490, 680, 870, 1060];
const WIN = 150;
const HER: [number, number] = [1, 2]; // c2l3
const key = (c: number, l: number) => `c${c + 1}l${l + 1}`;
// gancho: 12 acesas + a dela; apagam em 4 grupos nos tiques (de fora para dentro)
const G_APAGA: Record<string, number> = {
  c4l5: 0, c4l2: 0, c1l5: 0,
  c3l5: 30, c4l3: 30, c2l5: 30,
  c1l2: 60, c3l2: 60, c3l4: 60,
  c1l3: 90, c3l3: 90, c2l4: 90,
};
// "agradecer": as 19 acendem em anéis a partir da dela (3 f por anel de distância)
const ringAt = (c: number, l: number) => {
  const d = Math.hypot(c - HER[0], l - HER[1]);
  const rings = [1, Math.SQRT2, 2, Math.sqrt(5), Math.sqrt(8)];
  const k = rings.findIndex((r) => Math.abs(r - d) < 1e-6);
  return 642 + 3 * k;
};

const Fachada: React.FC<{ f: number; modo: 'gancho' | 'volta' }> = ({ f, modo }) => {
  const { sq } = useV6();
  const rects: React.ReactNode[] = [];
  for (let l = 0; l < 5; l++) {
    if (sq && l === 0) continue; // 1:1: a linha 1 some
    for (let c = 0; c < 4; c++) {
      const x = COLX[c], y = ROWY[l], k = key(c, l);
      const dela = c === HER[0] && l === HER[1];
      if (dela) {
        rects.push(<rect key={k} x={x} y={y} width={WIN} height={WIN} fill={OURO} />);
        continue;
      }
      if (modo === 'gancho') {
        const a = G_APAGA[k];
        if (a === undefined) {
          rects.push(<rect key={k} x={x} y={y} width={WIN} height={WIN} fill={APAG} />);
        } else {
          // mini-persiana: a lâmina apagada desce sobre a janela acesa (5 f)
          const p = P(f, a, 5, E.persiana);
          rects.push(<rect key={k} x={x} y={y} width={WIN} height={WIN} fill={LUA} />);
          if (p > 0) rects.push(<rect key={k + 'p'} x={x} y={y} width={WIN} height={WIN * p} fill={APAG} />);
        }
      } else {
        // a luz dela acende as outras pela janela em miniatura: as folhas abrem do eixo vertical (5 f)
        const p = P(f, ringAt(c, l), 5, E.janela);
        rects.push(<rect key={k} x={x} y={y} width={WIN} height={WIN} fill={APAG} />);
        if (p > 0) rects.push(<rect key={k + 'p'} x={x + (WIN / 2) * (1 - p)} y={y} width={WIN * p} height={WIN} fill={OURO} />);
      }
    }
  }
  return <>{rects}</>;
};

const Svg: React.FC<{ children: React.ReactNode; dy?: number }> = ({ children, dy = 0 }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
    <g transform={`translate(0 ${dy.toFixed(3)})`}>{children}</g>
  </svg>
);

// ---------- P1 · a fachada (gancho) ----------
const P1Page: React.FC = () => {
  const f = useF();
  return (
    <Scaled>
      <Svg dy={drift(f, PAGES.p1)}>
        <Fachada f={f} modo="gancho" />
      </Svg>
      <Folio f={f} init="23:00" color={FIO} />
      <Diario f={f} L0={0} L1={12} ink={LUA} hi={OURO} cur={OURO} />
    </Scaled>
  );
};

// ---------- P2 · a página dourada (o pedaço do dia → descanso → a unha) ----------
// formas por raio a partir do centro (480, 720): setor → cápsula → unha (morph ponto a ponto, 1° por amostra)
const CX = 480, CY = 720;
const bez = (p0: number[], p1: number[], p2: number[], p3: number[], s: number) =>
  [0, 1].map((i) => (1 - s) ** 3 * p0[i] + 3 * (1 - s) ** 2 * s * p1[i] + 3 * (1 - s) * s * s * p2[i] + s ** 3 * p3[i]);
/** contorno da unha da marca (caixa w × h, centro cx, cy) como polilinha */
const unhaPoly = (cx: number, cy: number, w: number, h: number): [number, number][] => {
  const m = (x: number, y: number): [number, number] => [cx + (x * w) / 44, cy + ((y - 7) * h) / 69];
  const pts: [number, number][] = [];
  for (let s = 0; s <= 1; s += 1 / 120) { const [x, y] = bez([-22, 10], [-22, -40], [22, -40], [22, 10], s); pts.push(m(x, y)); }
  pts.push(m(22, 34));
  for (let s = 0; s <= 1; s += 1 / 60) { const [x, y] = bez([22, 34], [22, 44], [-22, 44], [-22, 34], s); pts.push(m(x, y)); }
  return pts;
};
const capsulaPoly = (): [number, number][] => {
  const pts: [number, number][] = [];
  const hw = 160, r = 100; // 520 × 200, raio 100
  for (let a = -90; a <= 90; a += 2) pts.push([CX + hw + r * Math.cos((a * Math.PI) / 180), CY + r * Math.sin((a * Math.PI) / 180)]);
  for (let a = 90; a <= 270; a += 2) pts.push([CX - hw + r * Math.cos((a * Math.PI) / 180), CY + r * Math.sin((a * Math.PI) / 180)]);
  return pts;
};
const UNHA_P2 = { w: 300, h: 420 };
const UNHA_POLY = unhaPoly(CX, CY, UNHA_P2.w, UNHA_P2.h);
const CAPS_POLY = capsulaPoly();
// morph entre formas convexas por "função suporte" (soma de Minkowski): para cada direção normal,
// o ponto de cada forma que mais avança nela; a mistura é sempre convexa e lisa (sem bolhas).
const K = 720;
const NORMS = Array.from({ length: K }, (_, k) => [Math.cos((k / K) * 2 * Math.PI), Math.sin((k / K) * 2 * Math.PI)] as const);
const support = (poly: [number, number][]) =>
  NORMS.map(([nx, ny]) => {
    let best = -Infinity, bp: [number, number] = poly[0];
    for (const v of poly) { const d = v[0] * nx + v[1] * ny; if (d > best) { best = d; bp = v; } }
    return bp;
  });
const SUP_CAPS = support(CAPS_POLY);
const SUP_UNHA = support(UNHA_POLY);
const setorPoly = (R: number): [number, number][] => {
  const pts: [number, number][] = [[CX, CY]];
  for (let d = 345; d <= 360; d += 0.5) { const a = (d * Math.PI) / 180; pts.push([CX + R * Math.sin(a), CY - R * Math.cos(a)]); }
  return pts;
};
const mixSup = (A: [number, number][], Bs: [number, number][], m: number) =>
  `M${A.map((a, k) => `${lerp(a[0], Bs[k][0], m).toFixed(2)},${lerp(a[1], Bs[k][1], m).toFixed(2)}`).join(' L')} Z`;
// borda livre: corda horizontal a 92 px do topo da unha
const BORDA_Y = CY - UNHA_P2.h / 2 + 92;
const BORDA_X = (() => {
  const xs: number[] = [];
  for (let j = 0; j < UNHA_POLY.length; j++) {
    const [x1, y1] = UNHA_POLY[j], [x2, y2] = UNHA_POLY[(j + 1) % UNHA_POLY.length];
    if ((y1 - BORDA_Y) * (y2 - BORDA_Y) <= 0 && y1 !== y2) xs.push(x1 + ((BORDA_Y - y1) / (y2 - y1)) * (x2 - x1));
  }
  return [Math.min(...xs), Math.max(...xs)];
})();

const SETOR0 = 345; // 23h, sentido horário a partir do topo (meia-noite)
const polar = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `${(CX + r * Math.sin(a)).toFixed(2)},${(CY - r * Math.cos(a)).toFixed(2)}`;
};

/** conteúdo da página dourada num quadro absoluto f (sem o recorte de entrada/saída) */
const DouradaInner: React.FC<{ f: number }> = ({ f }) => {
  const dy = drift(f, PAGES.p2);
  // anel-dia: desenhado de f128 a f152 (anti-horário a partir da meia-noite), recolhe em "descansar." (f263, 14 f)
  const ringIn = P(f, 128, 24, E.vira);
  const ringOut = P(f, 263, 14, E.sai);
  // setor 23h→24h nasce em "pedaço" (f152, 8 f); cresce em "só" (f186) sem overshoot
  const ext = 15 * P(f, 152, 8, E.varre);
  const R = 240 + 40 * cl(spring({ frame: f - 186, fps: 30, config: { mass: 1.2, stiffness: 60, damping: 18 } }));
  const m1 = P(f, 263, 14, E.vira); // setor → cápsula (descansar.)
  const m2 = P(f, 329, 14, E.vira); // cápsula → unha (aprender)
  let shape: string | null = null;
  if (f >= 152 && ext > 0.01) {
    if (m1 <= 0) shape = `M${CX},${CY} L${polar(R, SETOR0)} A${R},${R} 0 0 1 ${polar(R, SETOR0 + ext)} Z`;
    else if (m2 <= 0) shape = mixSup(support(setorPoly(R)), SUP_CAPS, m1);
    else shape = mixSup(SUP_CAPS, SUP_UNHA, m2);
  }
  const borda = P(f, 350, 10, E.vira); // "unhas.": a borda livre se desenha
  return (
    <Scaled>
      <Svg dy={dy}>
        {ringIn > 0 && ringOut < 1 ? (
          <path d={`M${CX},${CY - 240} A240,240 0 1,0 ${CX},${CY + 240} A240,240 0 1,0 ${CX},${CY - 240}`} pathLength={1} fill="none" stroke={NOITE} strokeWidth={4}
            strokeDasharray="1 1" strokeDashoffset={1 - ringIn + ringOut} />
        ) : null}
        {shape ? <path d={shape} fill={NOITE} /> : null}
        {borda > 0 ? <line x1={BORDA_X[0]} x2={lerp(BORDA_X[0], BORDA_X[1], borda)} y1={BORDA_Y} y2={BORDA_Y} stroke={OURO} strokeWidth={6} strokeLinecap="butt" /> : null}
      </Svg>
      <Folio f={f} init="23:07" color={NOITE} />
      <Diario f={f} L0={0} L1={12} ink={NOITE} hi={NOITE} cur={NOITE} />
    </Scaled>
  );
};

const insetTo = (r: { l: number; r: number; t: number; b: number }, k: number) =>
  `inset(${(r.t * k).toFixed(2)}px ${((1080 - r.r) * k).toFixed(2)}px ${((1920 - r.b) * k).toFixed(2)}px ${(r.l * k).toFixed(2)}px)`;
const mapR = (sq: boolean, r: { l: number; r: number; t: number; b: number }) => (sq ? { l: sqX(r.l), r: sqX(r.r), t: sqY(r.t), b: sqY(r.b) } : r);

const P2Page: React.FC = () => {
  const f = useF();
  const { sq } = useV6();
  // janela que abre: a janela dela (x 310–460, y 680–830 + deriva de 19) vira o quadro (f100–124)
  const pw = P(f, 100, 24, E.janela);
  const clip = pw < 1 ? insetTo(mapR(sq, { l: 310, r: 460, t: 699, b: 849 }), 1 - pw) : undefined;
  return (
    <div style={{ position: 'absolute', inset: 0, background: OURO, clipPath: clip }}>
      <DouradaInner f={f} />
    </div>
  );
};

// ---------- P3 · as dez janelas-unha (uma aula de cada vez) ----------
// A página dourada sai pela JANELA QUE FECHA (f372–386) até 150×150 (x 120–270, y 600–750); a página noite já
// está por baixo. Em f393 essa janela vira a 1ª unha (150×150 → unha 120×170, 5 f). As outras acendem pela
// janela em miniatura (folhas abrem do eixo vertical, 5 f), a cada 11–12 f, até "pressa," (f497).
// Contorno: a unha do símbolo (ADAPTACAO-MARCA §Forma), não o retângulo do blueprint.
const JU = { w: 120, h: 170, xs: [180, 330, 480, 630, 780], ys: [675, 875] };
const JU_AT = [393, 405, 416, 428, 439, 451, 462, 474, 485, 497];
const JU_POLY = JU.ys.flatMap((y) => JU.xs.map((x) => unhaPoly(x, y, JU.w, JU.h)));
const polyD = (p: [number, number][]) => `M${p.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' L')} Z`;
const JU_D = JU_POLY.map(polyD);
const FECHA = { l: 120, r: 270, t: 600, b: 750 }; // a janela que fecha (150×150)
const SUP_FECHA = support([[FECHA.l, FECHA.t], [FECHA.r, FECHA.t], [FECHA.r, FECHA.b], [FECHA.l, FECHA.b]]);
const SUP_JU1 = support(JU_POLY[0]);

const UnhasContent: React.FC<{ f: number; pre: string }> = ({ f, pre }) => {
  const m = P(f, 393, 5, E.vira); // a janela vira unha
  return (
    <Scaled>
      <Svg dy={drift(f, PAGES.p3)}>
        <defs>
          {JU_AT.map((a, k) => {
            if (k === 0) return null;
            const p = P(f, a, 5, E.janela);
            const cx = JU.xs[k % 5];
            return <clipPath key={k} id={`${pre}-ju${k}`}><rect x={cx - (JU.w / 2 + 2) * p} y={0} width={(JU.w + 4) * p} height={1920} /></clipPath>;
          })}
        </defs>
        {JU_D.map((d, k) => <path key={'a' + k} d={d} fill={APAG} />)}
        {f >= 393 ? <path d={m >= 1 ? JU_D[0] : mixSup(SUP_FECHA, SUP_JU1, m)} fill={OURO} /> : null}
        {JU_D.map((d, k) => (k === 0 || f < JU_AT[k] ? null : <path key={'l' + k} d={d} fill={OURO} clipPath={`url(#${pre}-ju${k})`} />))}
      </Svg>
      <Folio f={f} init="23:20" color={FIO} />
      <Diario f={f} L0={0} L1={12} ink={LUA} hi={OURO} cur={OURO} />
    </Scaled>
  );
};
const P3Page: React.FC = () => {
  const f = useF();
  const { sq } = useV6();
  // a página dourada (que saiu da cena anterior) recolhe por cima até a janela de 150×150 e fica até f393
  const pc = P(f, 372, 14, E.janela);
  return (
    <>
      <UnhasContent f={f} pre="p3" />
      {f < 393 ? (
        <div style={{ position: 'absolute', inset: 0, background: OURO, clipPath: insetTo(mapR(sq, FECHA), pc) }}>
          <DouradaInner f={f} />
        </div>
      ) : null}
    </>
  );
};

// ---------- P4 · olhar pra trás (a página volta; o relógio rebobina; a luz dela acende o prédio) ----------
const REBOBINA: Step[] = ['23:50', '23:43', '23:36', '23:29', '23:21', '23:14', '23:07', '23:00'].map((v, k) => ({ at: 602 + 4 * k, v, dur: 4, dir: 1 }));
const P4Page: React.FC = () => {
  const f = useF();
  // a página dos ovais vira para trás (dobradiça na borda direita, afasta-se), f563–585
  const q = P(f, 563, 22, E.vira);
  return (
    <>
      <Scaled>
        <Svg dy={drift(f, PAGES.p4)}>
          <Fachada f={f} modo="volta" />
        </Svg>
        <Folio f={f} init="23:58" steps={REBOBINA} color={FIO} />
        <Diario f={f} L0={13} L1={16} ink={LUA} hi={OURO} cur={OURO} />
      </Scaled>
      {q < 1 ? (
        <div style={{ position: 'absolute', inset: 0, perspective: '1800px', perspectiveOrigin: '540px 960px' }}>
          <div style={{ position: 'absolute', inset: 0, background: NOITE, transformOrigin: '1080px 960px', transform: `rotateY(${(-180 * q).toFixed(3)}deg)`, backfaceVisibility: 'hidden', overflow: 'hidden' }}>
            <UnhasContent f={f} pre="p4v" />
          </div>
        </div>
      ) : null}
    </>
  );
};

// ---------- P5 · cartão (a última página, dourada) ----------
const TL: [number, number][] = [[62, 64], [65, 67], [68, 68]];
const T5 = { left: 120, fs: 92, lh: 114, base: 89.1, bases: [636, 750, 864] };
const TCUR = { w: 4, h: 83, top: T5.base - 67 };
const titleLineOf = (i: number) => TL.findIndex(([a, b]) => i >= a && i <= b);

const P5Page: React.FC = () => {
  const f = useF();
  const dy = drift(f, PAGES.p5);
  let last = -1;
  for (let i = 62; i <= 68; i++) if (f >= ws(i)) last = i;
  type Mode = { k: 'park' } | { k: 'word'; i: number } | { k: 'ret'; L: number; q: number };
  let mode: Mode = { k: 'park' };
  if (last >= 0) {
    const Lw = titleLineOf(last);
    const p = wordP(last, f);
    const nextFirst = TL[Lw + 1]?.[0];
    const ret = nextFirst !== undefined && last === TL[Lw][1] ? ws(nextFirst) - 8 : Infinity;
    mode = p >= 1 && f >= ret ? { k: 'ret', L: Lw, q: P(f, ret, 8, E.linha) } : { k: 'word', i: last };
  }
  const sy = 1 - P(f, 776, 6, E.sai); // o cursor recolhe quando o fio nasce
  const cDef = sy > 0 ? { color: NOITE, h: TCUR.h, w: TCUR.w, top: TCUR.top, sy } : undefined;
  const fio = P(f, 776, 12, E.vira);
  const url = P(f, 780, 10, E.varre);
  return (
    <Scaled>
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${dy.toFixed(3)}px)` }}>
        <div style={{ font: `400 ${T5.fs}px/${T5.lh}px ${SERIF}`, fontSynthesis: 'none', color: NOITE }}>
          {TL.map(([a, b], L) => {
            const words = [];
            for (let i = a; i <= b; i++) {
              words.push(<Word key={i} i={i} f={f} color={NOITE} italic={i === 68} cursor={mode.k === 'word' && mode.i === i ? cDef : undefined} />);
              if (i < b) words.push(' ');
            }
            return (
              <div key={L} style={{ position: 'absolute', left: T5.left, top: T5.bases[L] - T5.base, height: T5.lh, whiteSpace: 'nowrap' }}>
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  {words}
                  {mode.k === 'ret' && mode.L === L && cDef ? (
                    <Cursor color={NOITE} left={`calc(${((1 - mode.q) * 100).toFixed(3)}% - ${TCUR.w / 2}px)`} top={TCUR.top + T5.lh * mode.q} h={TCUR.h} w={TCUR.w} />
                  ) : null}
                </span>
              </div>
            );
          })}
          {mode.k === 'park' ? <span style={{ position: 'absolute', left: T5.left - TCUR.w / 2, top: T5.bases[0] - T5.base + TCUR.top, width: TCUR.w, height: TCUR.h, background: NOITE }} /> : null}
        </div>
        {/* fio de 1,5 px (x 120–840, y 980) */}
        <div style={{ position: 'absolute', left: 120, top: 979.25, width: 720, height: 1.5, background: NOITE, transform: `scaleX(${fio})`, transformOrigin: '0 50%' }} />
        {/* URL por máscara da esquerda para a direita */}
        <div style={{ position: 'absolute', left: 120, top: 1050 - 46.98, height: 58, whiteSpace: 'nowrap', font: `500 48px/58px ${SANS}`, color: NOITE, fontSynthesis: 'none', letterSpacing: '0.01em',
          visibility: url <= 0 ? 'hidden' : 'visible', clipPath: url >= 1 ? undefined : `inset(-10px ${((1 - url) * 100).toFixed(3)}% -10px -10px)` }}>
          cursosdeunhas.com.br/comecar
        </div>
      </div>
      <Folio f={f} init="23:59" steps={[{ at: 800, v: '00:00', dur: 20, dir: -1 }]} color={NOITE} />
    </Scaled>
  );
};

// ---------- transições do N2 ----------
/** janela que abre: o recorte é feito dentro da própria P2 (depende do 1:1); aqui só segura a P1 por 24 f */
const janela: Transition = { dur: 24, ease: (x) => x, inStyle: () => ({}) };
/** persiana (só no cartão): 4 lâminas de 480 px crescem do próprio topo (15 f cada, atraso 3 f, 24 f no total) */
const bands = (lf: number) => {
  const pts: string[] = [];
  for (let i = 0; i < 4; i++) {
    const h = 480 * E.persiana(cl((lf - 3 * i) / 15));
    const y0 = 480 * i, y1 = y0 + h;
    pts.push(`-10px ${y0}px`, `1090px ${y0}px`, `1090px ${y1.toFixed(2)}px`, `-10px ${y1.toFixed(2)}px`);
  }
  return `polygon(${pts.join(', ')})`;
};
const persiana: Transition = { dur: 24, ease: (x) => x, inStyle: (p) => ({ clipPath: bands(p * 24) }) };

// ---------- som (só arquivos existentes; tom e andamento pelas props) ----------
// Medido na voz real: o gancho é sussurrado (−37 dBFS RMS), o meio é cheio (−21), "agradecer… noite." volta ao sussurro.
// A base (sol# menor) tem chaves de ganho por trecho e duck por trecho, e SAI sob a persiana (f696–720): o menor não
// atravessa a gratidão nem o cartão; o cartão fica com a voz e o si maior dos dois twangs (f689 si, f800 ré#).
const TICK = 'audio/v6/n2_tick.wav';
const tick = (at: number, db: number) => ({ src: TICK, at, db, dur: 4, rate: 0.5 });
// Chaves do blueprint −3 dB: a voz e os efeitos são mono e entram na mixagem estéreo a −3 dB (lei de pan);
// a base é estéreo e não perde nada. Medido no MP4 (voz alinhada por correlação): sem esta compensação a base
// ficava só 6,8 dB abaixo do sussurro do gancho.
const PAN = -3;
const BASE_KEYS: [number, number][] = ([[0, -22], [105, -22], [124, -9], [580, -9], [600, -22], [641, -22], [642, -24], [696, -24]] as [number, number][])
  .map(([f, d]) => [f, d + PAN] as [number, number]).concat([[720, -60]]);
const duckDbAt = (f: number) => (f < 105 ? -6 : f < 600 ? -3 : -6);
const SEG = speech(t);
const BaseN2: React.FC = () => {
  const vol = (lf: number) => {
    const f = lf; // a Sequence começa no f0
    let duck = 0;
    for (const [s0, e0] of SEG) {
      const a = sec(s0), e = sec(e0);
      if (f >= a - 6 && f <= e + 10) duck = Math.max(duck, cl(f < a ? (f - (a - 6)) / 6 : f > e ? 1 - (f - e) / 10 : 1));
    }
    const db = gainAt(BASE_KEYS, f) + duckDbAt(f) * duck;
    return db <= -59.5 ? 0 : Math.pow(10, db / 20);
  };
  return (
    <Sequence from={0} durationInFrames={720} layout="none">
      <Audio src={staticFile('audio/v6/n2_base.mp3')} trimBefore={0} volume={vol} />
    </Sequence>
  );
};

export const N2: V6Def = {
  k: 2,
  timing: t,
  total: 868,
  fonts: [`400 62px Georgia`, `italic 400 62px Georgia`, `400 92px Georgia`, `italic 400 92px Georgia`, `500 34px "Helvetica Neue"`, `500 40px "Helvetica Neue"`],
  scenes: [
    { id: 'p1-fachada', from: 0, bg: NOITE, C: P1Page },
    { id: 'p2-dourada', from: ['Pra'], lead: 5, bg: 'transparent', C: P2Page, enter: janela },
    { id: 'p3-unhas', from: ['Uma'], lead: 8, bg: NOITE, C: P3Page, enter: T.cut() },
    { id: 'p4-volta', from: ['Um'], lead: 6, bg: NOITE, C: P4Page, enter: T.cut() },
    { id: 'p5-cartao', from: ['Se'], lead: 8, bg: OURO, C: P5Page, enter: persiana, end: true },
  ],
  // a base vai pelo componente BaseN2 (duck diferente por trecho), desenhado na camada Over
  tracks: [],
  Over: BaseN2,
  sfx: [
    // o relógio da casa que dorme: cada tique apaga 3 janelas (−18: não passa por cima do sussurro)
    tick(0, -18), tick(30, -18), tick(60, -18), tick(90, -18),
    // catraca: o relógio rebobina e o passado se afasta (−20 → −30)
    ...[-20, -21.4, -22.9, -24.3, -25.7, -27.1, -28.6, -30].map((db, k) => tick(602 + 4 * k, db)),
    // no vão depois de "noite." (f689): twang −8 st (sol → si), o primeiro som claro do filme
    { src: 'audio/v6/n2_twang.wav', at: 689, db: -22, dur: 34, rate: 0.63 },
    // "00:00" (f800): twang −4 st (sol → ré#); com o si de f689, si maior — a relativa maior de sol# menor
    { src: 'audio/v6/n2_twang.wav', at: 800, db: -18, dur: 27, rate: 0.7937 },
  ],
};
