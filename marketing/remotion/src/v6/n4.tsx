// N4 v6 · Medir com calma — guia comparativo em grade suíça: uma ficha que se preenche, um cursor como personagem.
// Fonte da verdade: marketing/v6/n4/blueprint.* (revisão 2) + ADAPTACAO-MARCA.md (vence em cor e fonte:
// Helvetica Neue + Condensed via local() e Georgia Italic; nude2 / tinta / ameixa profunda só na família do cursor).
// Revisão de leitura no celular (11:26): módulo 140, texto ≥ 46 px, fios de 2 px a ≥ 3:1, cursor de 5 px, unhas 1,45×.
// Física do N4: só bezier, overshoot 0, nenhuma mola, nenhum zoom, nenhuma rotação, nenhum 3D, nenhuma opacidade.
import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import timing from '../timing/n4.json';
import { Timing } from '../theme';
import { V6Def, useV6, wf } from './engine';
import { HN_COND_CSS, PAL, SANS, SERIF, tint, unhaD } from './marca';

const t = timing as Timing;
export const N4_TOTAL = 862;

// ---------- cor (só paleta da marca, sólida) ----------
const PAPEL = PAL.nude2;
const TINTA = PAL.tinta; // 11:1 sobre o papel
const REGUA = tint(PAL.tinta, PAL.cinza, 0.25); // ≈ #846D78, 3,7:1: palavra ainda não dita, número (troca de cor, nunca opacidade)
const FIO = tint(PAL.tinta, PAL.cinza, 0.15); // ≈ #8D7682, 3,3:1, fios de 2 px
const ACC = PAL.ameixaProf; // só a família do cursor: cursor, campo que ele aponta, trecho medido, bloco do t2, check

// ---------- grade em coordenadas do 1:1 (centrada no quadrado y 420–1500); o 9:16 desloca ----------
// 12 col.: margem 64, calha 16, coluna 64,67 · módulo de linha 140 · cabeçalho 270
const TOP = 475;
const HDR = 270;
const M = 140;
const R0 = TOP + HDR; // 745: fio de cabeça
const RT = [R0, R0 + M, R0 + 2 * M, R0 + 3 * M]; // topo das linhas 01–04
const TB = R0 + 4 * M; // 1305: fim da tabela = topo da faixa da legenda
const CB = TB + M; // 1445: fim da faixa da legenda
const BL = 86; // linha de base do texto dentro de uma linha de 140
const QB = TOP + 226; // linha de base dos "?"
const COLS: [number, number][] = [[64, 290], [306, 532], [548, 774], [790, 1016]]; // rótulos, caminho 1, 2, 3
const NUM = { fontFamily: 'HNCond', fontWeight: 700, fontVariantNumeric: 'tabular-nums' as const };
// 9:16: tabela + legenda sobem (faixa da legenda em y 1130–1270, longe da do N1 em ~1290–1380); o cartão fica centrado na área útil do Reels
const useSY = () => (useV6().sq ? 0 : 300 - TOP);
const useSYCard = () => (useV6().sq ? 0 : -100);

// ---------- curvas (só bezier) ----------
const bz = Easing.bezier;
const E = {
  frena: bz(0.5, 1, 0.89, 1),
  eixo: bz(0.83, 0, 0.17, 1),
  bloco: bz(0.7, 0, 0.3, 1),
  medir: bz(0.65, 0, 0.35, 1),
  arquivo: bz(0.6, 0, 0.2, 1),
  calma: bz(0.45, 0, 0.55, 1),
  deriva: bz(0.37, 0, 0.63, 1),
};
const pr = (f: number, a: number, d: number, e: (x: number) => number) =>
  interpolate(f, [a, a + Math.max(1, d)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e });
const lerp = (a: number, b: number, x: number) => a + (b - a) * x;

// ---------- tempo da fala ----------
const W = (i: number) => wf(t, i); // quadro absoluto em que a palavra i começa

// ---------- primitivas ----------
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
    {children}
  </svg>
);
/** janela retangular (borda dura) com conteúdo em coordenadas absolutas; dx/dy deslocam o conteúdo */
const Clip: React.FC<{ x: number; y: number; w: number; h: number; dx?: number; dy?: number; children: React.ReactNode }> = ({ x, y, w, h, dx = 0, dy = 0, children }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: Math.max(0, w), height: Math.max(0, h), overflow: 'hidden' }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', left: -x, top: -y, overflow: 'visible' }}>
      <g transform={`translate(${dx} ${dy})`}>{children}</g>
    </svg>
  </div>
);
const HRule: React.FC<{ x0: number; x1: number; y: number; w?: number; c?: string }> = ({ x0, x1, y, w = 2, c = FIO }) => (
  <rect x={x0} y={y - w / 2} width={Math.max(0, x1 - x0)} height={w} fill={c} />
);
/** fios de uma coluna: cabeça tinta 3 px + fios de 2 px entre as linhas (interrompidos nas calhas) */
const ColRules: React.FC<{ c: number }> = ({ c }) => (
  <>
    <HRule x0={COLS[c][0]} x1={COLS[c][1]} y={R0} w={3} c={TINTA} />
    {RT.slice(1).map((y) => <HRule key={y} x0={COLS[c][0]} x1={COLS[c][1]} y={y} />)}
  </>
);
const CUR = 5; // espessura do cursor
const Cursor: React.FC<{ x: number; draw?: number; y0?: number; y1?: number }> = ({ x, draw = 1, y0 = TOP, y1 = TB }) => (
  <div style={{ position: 'absolute', left: x - CUR / 2, top: y0, width: CUR, height: (y1 - y0) * draw, background: ACC }} />
);

// ---------- legenda (linha de tabela; a palavra dita só escurece) ----------
const GROUPS: [number, number][] = [
  [0, 2], [3, 7], [8, 12], [13, 13], [14, 16], [17, 19], [20, 21], [22, 24],
  [25, 27], [28, 31], [32, 36], [37, 40], [41, 46], [47, 52], [53, 56],
];
/** G6–G9 entram pelo empurrão do arquivo (10 f antes da 1ª palavra); os outros por corte em s−1 */
const PUSHED = new Set([5, 6, 7, 8]);
const G0 = GROUPS.map(([a], g) => (g === 0 ? 0 : PUSHED.has(g) ? W(a) - 10 : W(a) - 1));
/** legenda arquivada: G5–G8 sobem para a tabela quando o grupo seguinte entra (fio em P−8, empurrão em P) */
const ARQ = [4, 5, 6, 7].map((g) => ({ g, P: G0[g + 1] }));
const CAP_TOP = TB + BL + 2 - 61; // caixa de 80 px com a linha de base em TB + 88

const CapLine: React.FC<{ g: number; f: number; mode: 'live' | 'filed' }> = ({ g, f, mode }) => {
  const [a, b] = GROUPS[g];
  const items: React.ReactNode[] = [];
  for (let i = a; i <= b; i++) {
    const said = mode === 'filed' || i === 0 || f >= W(i); // "Antes" já nasce tinta (a f0 tem tinta)
    items.push(<span key={i} style={{ color: said ? TINTA : REGUA }}>{t.words[i].w}</span>);
    if (i < b) items.push(' ');
  }
  return (
    <div style={{ whiteSpace: 'pre', fontFamily: SANS, fontWeight: 500, fontSize: 56, height: 80, lineHeight: '80px' }}>
      {items}
    </div>
  );
};

const T5 = W(57); // "Leva": a página sobe e o cartão vem por baixo

const Legenda: React.FC<{ hideFrom: number }> = () => {
  const f = useCurrentFrame();
  const SY = useSY();
  if (f >= T5 + 12) return null;
  let g = 0;
  for (let j = 0; j < GROUPS.length; j++) if (f >= G0[j]) g = j;
  const dy = PUSHED.has(g) && f < G0[g] + 10 ? M * (1 - pr(f, G0[g], 10, E.medir)) : 0;
  const up = -1920 * pr(f, T5, 12, E.eixo); // t5: a legenda sai com a página
  const rules = ARQ.filter((a) => f >= a.P - 8 && f < a.P + 10);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${SY + up}px)` }}>
      <Svg>
        <HRule x0={64} x1={1016} y={TB} />
        <HRule x0={64} x1={1016} y={CB} />
      </Svg>
      <div style={{ position: 'absolute', left: 0, top: TB, width: 1080, height: M, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 64, top: CAP_TOP - TB, transform: `translateY(${dy}px)` }}>
          <CapLine g={g} f={f} mode="live" />
        </div>
      </div>
      <Svg>
        {rules.map((a) => (
          <HRule key={a.P} x0={64} x1={64 + 952 * pr(f, a.P - 8, 8, E.arquivo)} y={TB - M * pr(f, a.P, 10, E.medir)} w={3} c={TINTA} />
        ))}
      </Svg>
    </div>
  );
};

// ---------- c01–c02 · a ficha em branco (gancho) ----------
const GAP = 3 * M; // a faixa do feed corre 3 módulos (420 px; passo máx. 60 px/f)
const PREV = [6, 7, 8].map((k) => ({ k, top: TOP - GAP - (9 - k) * M })); // fim de uma ficha anterior
const Q_ON: [number, number, number][] = [
  [1, 28, W(5)], // o campo 1 acende quando o cursor nasce, apaga em "curso"
  [2, W(5) + 8, W(8)], // campo 2 depois do salto, apaga em "ela"
  [3, W(8) + 8, W(12)], // campo 3 depois do salto, apaga em "simples:"
];
const qActive = (c: number, f: number) => Q_ON.some(([k, a, b]) => k === c && f >= a && f < b);

/** uma coluna da ficha da dúvida (coordenadas finais) */
const FichaCol: React.FC<{ c: number; f: number; prev?: boolean }> = ({ c, f, prev }) => {
  const [x0, x1] = COLS[c];
  // ameixa profunda e tinta têm quase o mesmo valor: o campo apontado acende como bloco (troca de cor do "?" não se veria)
  const on = c > 0 && qActive(c, f);
  return (
    <>
      {prev ? (
        <>
          {PREV.map(({ k, top }) => (
            <g key={k}>
              <HRule x0={x0} x1={x1} y={top} />
              {c === 0 ? <text x={64} y={top + BL} fontSize={46} fill={REGUA} style={NUM}>{String(k).padStart(2, '0')}</text> : null}
            </g>
          ))}
          <HRule x0={x0} x1={x1} y={TOP - GAP} w={3} c={TINTA} />
        </>
      ) : null}
      <ColRules c={c} />
      {c === 0
        ? ['01', '02', '03', '04'].map((n, i) => <text key={n} x={64} y={RT[i] + BL} fontSize={46} fill={REGUA} style={NUM}>{n}</text>)
        : (
          <>
            {on ? <rect x={x0} y={TOP} width={x1 - x0} height={HDR - 2} fill={ACC} /> : null}
            <text x={x0 + 34} y={QB} fontFamily={SERIF} fontStyle="italic" fontSize={220} fill={on ? PAPEL : TINTA}>?</text>
          </>
        )}
    </>
  );
};

/** ficha de método (c03): só os fios, cabeçalho vazio */
const Metodo: React.FC = () => <>{[0, 1, 2, 3].map((c) => <ColRules key={c} c={c} />)}</>;

const drift1 = (f: number) => 12 * pr(f, 14, 131, E.deriva);
const cursorX1 = (f: number) => {
  let g = 298;
  g = lerp(g, 540, pr(f, W(5), 8, E.eixo)); // "curso"
  g = lerp(g, 782, pr(f, W(8), 8, E.eixo)); // "ela"
  return lerp(g + drift1(f), 48, pr(f, W(12), 10, E.eixo)); // "simples:" → volta ao zero (absoluto, fora da deriva)
};

const T1 = W(13); // "comparou."
const T2 = W(25); // "Porque"
const FICHA = TB - TOP; // 830: altura da ficha inteira

const Act1: React.FC<{ f: number; SY: number }> = ({ f, SY }) => {
  const O = f < 14 ? GAP * (1 - E.frena(f / 14)) : 0; // feed que freia em "Antes"
  const dx = drift1(f);
  const archFio = pr(f, T1, 8, E.arquivo); // t1 fase A: fio sobre o topo da ficha
  const rise = FICHA * pr(f, T1 + 8, 16, E.eixo); // t1 fase B: a ficha inteira sobe e sai pela borda de cima
  const archived = ARQ.filter((a) => f >= a.P);
  const filedOff = (j: number) => -M * ARQ.slice(j).reduce((s, a) => s + pr(f, a.P, 10, E.medir), 0);
  const block = pr(f, T2, 10, E.bloco); // t2: o cursor se alarga até x 290
  const winTop = 250 - SY; // janela do feed: do topo seguro do Reels até o fim da tabela
  return (
    <div style={{ position: 'absolute', inset: 0, background: PAPEL }}>
      {f < T1 ? (
        <Clip x={0} y={winTop} w={1080} h={TB - winTop} dx={dx} dy={O}>
          {[0, 1, 2, 3].map((c) => <FichaCol key={c} c={c} f={f} prev={f < 14} />)}
        </Clip>
      ) : f < T1 + 24 ? (
        // t1: arquivo da ficha — um bloco só, em eixo, dentro da máscara da tabela; o método vem preso por baixo
        <Clip x={0} y={TOP} w={1080} h={FICHA} dy={-rise}>
          <g transform={`translate(${dx} 0)`}>
            {[0, 1, 2, 3].map((c) => <FichaCol key={c} c={c} f={f} />)}
            <HRule x0={64} x1={64 + 952 * archFio} y={TOP + 1.5} w={3} c={TINTA} />
          </g>
          <g transform={`translate(0 ${FICHA})`}><Metodo /></g>
        </Clip>
      ) : (
        <Svg><Metodo /></Svg>
      )}
      {/* legenda arquivada: as linhas viram a tabela */}
      {archived.map((a, j) => {
        const off = filedOff(j);
        return (
          <React.Fragment key={a.g}>
            <div style={{ position: 'absolute', left: 64, top: CAP_TOP + off }}>
              <CapLine g={a.g} f={f} mode="filed" />
            </div>
            {f >= a.P + 10 ? <Svg><HRule x0={64} x1={1016} y={TB + off} w={3} c={TINTA} /></Svg> : null}
          </React.Fragment>
        );
      })}
      {f >= 20 ? <Cursor x={f < T1 ? cursorX1(f) : 48} draw={pr(f, 20, 8, E.medir)} /> : null}
      {block > 0 ? <div style={{ position: 'absolute', left: 48 - CUR / 2, top: TOP, width: CUR + (290 - 48 - CUR / 2) * block, height: FICHA, background: ACC }} /> : null}
    </div>
  );
};

// ---------- c04 · calma: a régua; o cursor mede até o centro ----------
const RY = TOP + FICHA / 2; // centro da tabela
const TICKS = Array.from({ length: 18 }, (_, i) => 64 + 56 * i);
const Panel: React.FC<{ f: number }> = ({ f }) => {
  const x = 1080 * (1 - pr(f, T2 + 10, 12, E.eixo)); // painel da direita, borda dura
  const dx = 12 * pr(f, W(27), 73, E.deriva);
  const cx = lerp(64, 540, pr(f, W(27), W(31) - W(27), E.calma)); // "boa" → "calma."
  return (
    <div style={{ position: 'absolute', inset: 0, background: PAPEL, transform: `translateX(${x}px)` }}>
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${dx}px)` }}>
        <Svg>
          {/* régua: barra de 56 px com contorno de 4 px, marcas a cada 56 px (maiores a cada 3) */}
          <rect x={64} y={RY - 28} width={cx - 64} height={56} fill={ACC} />
          <rect x={66} y={RY - 26} width={948} height={52} fill="none" stroke={TINTA} strokeWidth={4} />
          {TICKS.map((m, i) => <rect key={m} x={m} y={RY + 28} width={3} height={i % 3 === 0 ? 40 : 22} fill={TINTA} />)}
        </Svg>
        <Cursor x={cx} />
      </div>
    </div>
  );
};

// ---------- c05–c06 · a tabela dos três caminhos e o recolher ----------
const AY = TOP + 18; // seta "do zero ao alongamento", acima das unhas
const MARKS = Array.from({ length: 18 }, (_, i) => 64 + 54 * i);
const colOf = (x: number) => (x < 298 ? 0 : x < 540 ? 1 : x < 782 ? 2 : 3);
// rótulos legíveis no celular (46 px) e que cabem nos 226 px da coluna; ecoam "o que cada um ensina, preço e garantia"
const LABELS = ['Conteúdo', 'Preço', 'Garantia'];
const NW_ = 148, NH_ = 232; // unha 1,45× (contorno · metade · cheia)

/** unha da marca no lugar da bola de Harvey: vazia (do zero) · metade · cheia (alongamento) */
const UnhaHarvey: React.FC<{ k: number; x0: number }> = ({ k, x0 }) => {
  const cx = x0 + NW_ / 2, cy = TOP + 34 + NH_ / 2;
  const d = unhaD(cx, cy, NW_ - 8, NH_ - 8);
  return (
    <g>
      <clipPath id={`n4-metade-${k}`}><rect x={cx} y={TOP} width={200} height={HDR} /></clipPath>
      {k === 2 ? <path d={d} fill={TINTA} /> : null}
      {k === 1 ? <path d={d} fill={TINTA} clipPath={`url(#n4-metade-${k})`} /> : null}
      <path d={d} fill="none" stroke={TINTA} strokeWidth={8} />
    </g>
  );
};

const PathCol: React.FC<{ k: number; f: number }> = ({ k, f }) => {
  const c = k + 1;
  const [x0] = COLS[c];
  const st = 3 * k;
  const ball = pr(f, W(35) + st, 8, E.eixo); // "três"
  const bar = pr(f, W(46) + st, 8, E.eixo); // "ensina,"
  const cash = pr(f, W(47) + st, 8, E.eixo); // "preço"
  const sq = pr(f, W(49) + st, 6, E.eixo); // "garantia"
  const arrow = pr(f, W(38), W(40) + 22 - W(38), E.medir); // de "zero" ao fim de "alongamento,"
  const head = pr(f, W(40) + 18, 4, E.medir);
  return (
    <>
      <Svg>
        <ColRules c={c} />
        {MARKS.filter((m) => colOf(m) === c).map((m) => <rect key={m} x={m} y={RT[3] + 22} width={2} height={18} fill={TINTA} />)}
        {arrow > 0 ? <HRule x0={306} x1={lerp(306, 1016, arrow)} y={AY} w={3} c={TINTA} /> : null}
        {head > 0 ? (
          <g stroke={TINTA} strokeWidth={3} strokeLinecap="square" fill="none">
            <path d={`M1016 ${AY} L${1016 - 14 * head} ${AY - 14 * head}`} />
            <path d={`M1016 ${AY} L${1016 - 14 * head} ${AY + 14 * head}`} />
          </g>
        ) : null}
      </Svg>
      <Clip x={x0 - 6} y={TOP + 26} w={NW_ + 12} h={(NH_ + 12) * ball}><UnhaHarvey k={k} x0={x0} /></Clip>
      <div style={{ position: 'absolute', left: x0, top: RT[0] + BL - 24, width: ((226 * (k + 1)) / 3) * bar, height: 24, background: TINTA }} />
      <Clip x={x0} y={RT[1]} w={226} h={M} dy={(1 - cash) * M}>
        <text x={x0} y={RT[1] + BL + 4} fontSize={96} fill={TINTA} style={NUM}>{'$'.repeat(k + 1)}</text>
      </Clip>
      <div style={{ position: 'absolute', left: x0, top: RT[2] + BL - 64, width: 64, height: 64 * sq, background: TINTA }} />
    </>
  );
};

const LabelCol: React.FC = () => (
  <Svg>
    <ColRules c={0} />
    {MARKS.filter((m) => colOf(m) === 0).map((m) => <rect key={m} x={m} y={RT[3] + 22} width={2} height={18} fill={TINTA} />)}
    {LABELS.map((l, i) => (
      <text key={l} x={64} y={RT[i] + BL} fontFamily={SANS} fontWeight={500} fontSize={46} letterSpacing="-0.5" fill={TINTA}>{l}</text>
    ))}
  </Svg>
);

const T3 = W(32); // "A gente reuniu"
const T4 = W(53); // "Sem"

const Act3: React.FC<{ f: number }> = ({ f }) => {
  const sx = 1080 * pr(f, T3, 18, E.medir); // t3: varredura do cursor
  const dx = 12 * pr(f, T3 + 18, 206, E.deriva) + 12 * pr(f, T4 + 23, 44, E.deriva);
  const s1 = pr(f, T4, 8, E.eixo), s2 = pr(f, T4 + 8, 8, E.eixo), s3 = pr(f, T4 + 16, 7, E.eixo); // t4
  const shift = [-242 * s3, -242 * (s2 + s3), -242 * (s1 + s2 + s3)];
  const snap = 1 - pr(f, W(50), 8, E.eixo); // "lado": as colunas encaixam
  const yoff = [-6, 6, -4];
  const colBox = (c: number) => ({ l: COLS[c][0] - 8, r: COLS[c][1] + 8 });
  const y0 = TOP - 10, y1 = TB + 10;
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, clipPath: f < T3 + 18 ? `inset(0 ${1080 - sx}px 0 0)` : undefined }}>
        <div style={{ position: 'absolute', inset: 0, background: PAPEL }} />
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${dx}px)` }}>
          {[2, 1, 0].map((k) => {
            const b = colBox(k + 1);
            return (
              <div key={k} style={{
                position: 'absolute', inset: 0, transform: `translate(${shift[k]}px, ${yoff[k] * snap}px)`,
                clipPath: `inset(${y0}px ${1080 - b.r}px ${1920 - y1}px ${b.l}px)`,
              }}>
                <div style={{ position: 'absolute', left: b.l, top: y0, width: b.r - b.l, height: y1 - y0, background: PAPEL }} />
                <PathCol k={k} f={f} />
              </div>
            );
          })}
          <div style={{ position: 'absolute', inset: 0, clipPath: `inset(${y0}px ${1080 - colBox(0).r}px ${1920 - y1}px 0)` }}>
            <div style={{ position: 'absolute', left: 0, top: y0, width: colBox(0).r, height: y1 - y0, background: PAPEL }} />
            <LabelCol />
          </div>
        </div>
      </div>
      {f < T3 + 18 ? <Cursor x={sx} /> : null}
    </>
  );
};

// ---------- c07 · cartão: a ficha completa ----------
const KB = 870; // linha de base de "2 min"
const KR = 905; // fio de cabeça do cartão
// "2 min" no lugar dos "?": cada glifo aparece inteiro, por corte, quando o cursor passa a borda direita da tinta dele
const SWEEP0 = T5 + 12; // f720, cartão assentado
const sweepX = (f: number) => lerp(298, 1032, pr(f, SWEEP0, 12, E.medir));
const firstPast = (x: number) => {
  for (let f = SWEEP0; f <= SWEEP0 + 12; f++) if (sweepX(f) >= x) return f;
  return SWEEP0 + 12;
};
const GLYPHS: [string, number][] = [['2', firstPast(544)], [' ', 0], ['m', firstPast(815)], ['i', firstPast(880)], ['n', firstPast(1016)]];
const CHECK_AT = W(66) + 8; // f785: logo depois de "seu." (que termina em f784)

const Card: React.FC<{ f: number }> = ({ f }) => {
  const SYc = useSYCard();
  const y = 1920 * (1 - pr(f, T5, 12, E.eixo)) + SYc; // t5: sobe por baixo; fica até o último quadro (a URL nunca sai)
  const dx = 12 * pr(f, SWEEP0, 141, E.deriva);
  const check = pr(f, CHECK_AT, 8, E.medir);
  const cardWords = [62, 63, 64, 65, 66];
  return (
    <div style={{ position: 'absolute', left: 0, top: -400, width: 1080, height: 2720, background: PAPEL, transform: `translateY(${y}px)` }}>
      <div style={{ position: 'absolute', left: 0, top: 400, width: 1080, height: 1920, transform: `translateX(${dx}px)` }}>
        <Svg>
          <text x={1016} y={KB} textAnchor="end" fontSize={260} style={{ ...NUM, fontWeight: 900 }}>
            {GLYPHS.map(([ch, at], i) => <tspan key={i} fill={f >= at ? TINTA : 'none'}>{ch}</tspan>)}
          </text>
          <HRule x0={64} x1={1016} y={KR} w={3} c={TINTA} />
          <HRule x0={64} x1={1016} y={KR + M} />
          <HRule x0={64} x1={1016} y={KR + 2 * M} />
          <rect x={65.5} y={KR + 38 + 1.5} width={61} height={61} fill="none" stroke={TINTA} strokeWidth={3} />
          {check > 0 ? <path d={`M79 ${KR + 70} L94 ${KR + 85} L116 ${KR + 53}`} fill="none" stroke={ACC} strokeWidth={8} strokeLinecap="square" strokeLinejoin="miter" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - check} /> : null}
          <text x={160} y={KR + 90} fontFamily={SANS} fontWeight={500} fontSize={56}>
            {cardWords.map((i, j) => (
              <tspan key={i} fill={f >= W(i) ? TINTA : REGUA}>{(j ? ' ' : '') + t.words[i].w.replace('.', '')}</tspan>
            ))}
          </text>
          <text x={160} y={KR + M + 88} fontFamily={SANS} fontWeight={500} fontSize={48} fill={TINTA}>cursosdeunhas.com.br/comecar</text>
          {f >= 800 ? <text x={160} y={KR + 2 * M + 72} fontFamily={SERIF} fontStyle="italic" fontSize={40} fill={TINTA}>conteúdo, preço e garantia lado a lado</text> : null}
        </Svg>
        {f >= SWEEP0 && f <= SWEEP0 + 12 ? <Cursor x={sweepX(f)} y0={KB - 200} y1={KR} /> : null}
      </div>
    </div>
  );
};

// ---------- filme ----------
const Filme: React.FC = () => {
  const f = useCurrentFrame();
  const SY = useSY();
  const up = -1920 * pr(f, T5, 12, E.eixo); // t5: a página sobe
  return (
    <div style={{ position: 'absolute', inset: 0, fontSynthesis: 'none' } as React.CSSProperties}>
      <style>{HN_COND_CSS}</style>
      {f < T5 + 12 ? (
        <div style={{ position: 'absolute', left: 0, top: -400, width: 1080, height: 2720, transform: `translateY(${SY + up}px)` }}>
          <div style={{ position: 'absolute', left: 0, top: 400, width: 1080, height: 1920 }}>
            {f < T2 + 22 ? <Act1 f={f} SY={SY} /> : null}
            {f >= T2 + 10 && f < T3 + 18 ? <Panel f={f} /> : null}
            {f >= T3 ? <Act3 f={f} /> : null}
          </div>
        </div>
      ) : null}
      {f >= T5 ? <Card f={f} /> : null}
    </div>
  );
};

export const N4: V6Def = {
  k: 4,
  timing: t,
  total: N4_TOTAL,
  lead: 0,
  fonts: ['500 56px "Helvetica Neue"', '500 46px "Helvetica Neue"', '700 64px HNCond', '900 260px HNCond', 'italic 400 220px Georgia'],
  scenes: [{ id: 'ficha', from: 0, bg: PAPEL, C: Filme }],
  Caption: Legenda,
  tracks: [
    {
      src: 'audio/v6/n4_beat2.mp3', from: W(14), to: N4_TOTAL, db: -18, duckDb: -3, rate: 0.5,
      keys: [[173, -60], [185, -18], [380, -18], [392, -22], [415, -22], [427, -18], [640, -18], [650, -40],
        [708, -40], [718, -18], [784, -18], [798, -14], [829, -14], [862, -60]],
    },
  ],
  sfx: [
    { src: 'audio/riser.mp3', at: 0, db: -5.5, dur: T1, rate: 0.41 }, // dúvida que sobe até ≈ −28 dBFS (medido); corta seco em "comparou."
    ...[0, 16, 19, 21, 24].map((i) => ({ src: 'audio/v6/n4_interface.mp3', at: W(i), db: 0, dur: 11, trimBefore: 0 })), // clique: "Antes" + 4 critérios
    { src: 'audio/v6/n4_interface.mp3', at: CHECK_AT, db: -26, dur: 20, trimBefore: 36 }, // gesto 2 com o check, depois de "seu."
  ],
};
