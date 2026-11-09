// N5 v6 · O reset pequeno (ruído do feed → o reset que a gente indica é pequeno → aprender → CTA).
// Sem narração: só tipografia, o leque do símbolo e som (whoosh desacelerado + impact afinado, inéditos no v6).
// Fonte da verdade: marketing/v6/n5/storyboard.md. Uma cena única ("Filme"), composta quadro a quadro em SVG.
// Compliance: "reset" só em minúsculas e no sentido de recomeço pessoal; sem apagão, data, "global", economia,
// escuridão, nome de curso, preço ou renda; fala de "todo mundo" e "a gente", nunca de quem assiste.
import React from 'react';
import { Easing, spring, useCurrentFrame } from 'remotion';
import { Timing } from '../theme';
import { EASE, FPS, LEAD, V6Def, mix, prog } from './engine';
import { PAL, brilhoD, tint, unhaD } from './marca';

const TOTAL = 360;

// ---------- paleta do N5 (só marca) ----------
const COR = {
  pagina: PAL.rose,
  card: PAL.nude,
  ink: PAL.tinta,
  /** acento exclusivo: framboesa, a unha do meio do símbolo */
  acc: PAL.leque[2],
  muro: PAL.branco,
  claro: PAL.nude,
};

// ---------- curvas ----------
const bz = Easing.bezier;
const E = {
  painel: bz(0.65, 0, 0.35, 1),
  cam: Easing.inOut(Easing.sin),
  traco: bz(0.6, 0, 0.2, 1),
};
/** mola do N5: ζ 0,74, overshoot 3,1% */
const MOLA5 = { mass: 1, stiffness: 200, damping: 21 };
const mola = (f: number, from: number) => (f < from ? 0 : spring({ frame: f - from, fps: FPS, config: MOLA5 }));

// ---------- tipografia ----------
const HN = '"Helvetica Neue"';
const GEO = 'Georgia';
const FT = {
  frase: `300 92px ${HN}`,
  fraseSerif: `400 92px ${GEO}`,
  cta: `300 96px ${HN}`,
  aprender: `300 150px ${HN}`,
  apoio: `400 64px ${HN}`,
  info: `400 60px ${HN}`,
  url: `500 56px ${HN}`,
  muro: `400 120px ${GEO}`,
  muroI: `italic 400 120px ${GEO}`,
};
let ctx: CanvasRenderingContext2D | null = null;
const measure = (txt: string, font: string) => {
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  ctx!.font = font;
  return ctx!.measureText(txt).width;
};

// ---------- tempos (quadros absolutos) ----------
const C = { gancho: 0, virada: 75, aprender: 150, cta: 240 };
const X0 = 96;
/** faixa de leitura (card do feed) */
const FAIXA = { top: 740, bottom: 1180 };
const MEIO = (FAIXA.top + FAIXA.bottom) / 2;

// ---------- linha que nasce da própria máscara ----------
/** `at` < 0 = já composta no f0. Sai para cima por máscara em 6 f (60% da entrada). */
const Linha: React.FC<{ f: number; at: number; out?: number; base: number; size: number; children: React.ReactNode }> = ({
  f, at, out, base, size, children,
}) => {
  if (f < at) return null;
  const q = out === undefined ? 0 : prog(f, out, 6, EASE.sai);
  if (q >= 1) return null;
  const asc = 1.0, h = size * 1.32;
  const p = at < 0 ? 1 : mola(f, at);
  const off = (1 - p) * h * 1.04 - q * h * 1.04;
  return (
    <svg x={X0 - 24} y={base - size * asc} width={1040} height={h} overflow="hidden">
      <g transform={`translate(24 ${size * asc + off})`}>{children}</g>
    </svg>
  );
};

// ---------- o muro de "reset" (o falatório do feed) ----------
const LINHAS_MURO = [80, 230, 380, 530, 680, 1580, 1730, 1880];
const SLOT = 360;
const Muro: React.FC<{ f: number }> = ({ f }) => {
  if (f >= C.gancho + 72) return null;
  // letreiro que acelera de leve (hype que cresce): 2,6 → 4,3 px/f, sem frear
  const s = 2.6 * f + 0.012 * f * f;
  return (
    <g>
      {LINHAS_MURO.map((y, r) => {
        const dir = r % 2 ? 1 : -1;
        const x0 = [0, 180, 360][r % 3] - 3 * SLOT + dir * s;
        return Array.from({ length: 10 }, (_, k) => (
          <text key={`${r}-${k}`} x={x0 + k * SLOT} y={y} fill={COR.muro} style={{ font: (k + r) % 2 ? FT.muroI : FT.muro }}>reset</text>
        ));
      })}
    </g>
  );
};

// ---------- o leque do símbolo (5 unhas, sem mão e sem fio) ----------
// asset n1_9x16.svg: pivô, raio 216, unhas 70×110 a −64/−32/0/32/64°. Aqui em escala 0,7: ~360 px de largura, y 1245–1410.
const ANG = [-64, -32, 0, 32, 64];
const LQ = { cx: 540, py: 1435, s: 0.7 };
/** na página rosé a unha rosé sumiria: vira nude */
const CORES_LEQUE = [PAL.nude, PAL.leque[1], PAL.leque[2], PAL.leque[3], PAL.leque[4]];
const Leque: React.FC<{ colors: string[]; brilho: (c: string) => string }> = ({ colors, brilho }) => {
  const R = 216 * LQ.s, w = 70.4 * LQ.s, h = 110.4 * LQ.s;
  const ncx = LQ.cx, ncy = LQ.py - R;
  return (
    <g>
      {ANG.map((a, k) => (
        <g key={k} transform={`rotate(${a} ${LQ.cx} ${LQ.py})`}>
          <path d={unhaD(ncx, ncy, w, h)} fill={colors[k]} />
          <path d={brilhoD(ncx, ncy, w, h)} fill="none" stroke={brilho(colors[k])} strokeWidth={(3 * w) / 44} strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
};

// ---------- a faixa vira página (campo framboesa) ----------
const campo = (f: number) => {
  const p1 = prog(f, C.aprender, 7, EASE.troca);
  const p2 = prog(f, C.aprender + 5, 12, E.painel);
  return { top: mix(mix(MEIO, FAIXA.top, p1), -20, p2), bottom: mix(mix(MEIO, FAIXA.bottom, p1), 1940, p2) };
};

const URL = 'cursosdeunhas.com.br/comecar';

const Filme: React.FC = () => {
  const f = useCurrentFrame();
  const dx = mix(14, -14, E.cam(f / TOTAL));

  // c01: painéis rosé que fecham sobre o muro em movimento
  const pp = prog(f, C.gancho + 60, 10, E.painel);
  // c02: "pequeno." encolhe 92 → 66 px a partir da linha de base
  const enc = mix(1, 66 / 92, mola(f, C.virada + 26));
  const wE = measure('é ', FT.frase);
  // c03/c04
  const cp = f >= C.aprender ? campo(f) : null;
  const urlW = measure(URL, FT.url);
  const pU = prog(f, C.cta + 24, 8, E.traco);

  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', left: 0, top: 0 }}>
      <rect width={1080} height={1920} fill={COR.pagina} />
      <g transform={`translate(${dx} 0)`}>
        {/* c01: o muro e os painéis */}
        <Muro f={f} />
        {f >= C.gancho + 60 && f < C.gancho + 72 ? (
          <>
            <rect x={-60} y={-20} width={1200} height={20 + FAIXA.top * pp} fill={COR.pagina} />
            <rect x={-60} y={1920 - (1920 - FAIXA.bottom) * pp} width={1200} height={20 + (1920 - FAIXA.bottom) * pp} fill={COR.pagina} />
          </>
        ) : null}

        {/* a faixa de leitura (card do feed) */}
        {f < C.aprender + 10 ? <rect x={-60} y={FAIXA.top} width={1200} height={FAIXA.bottom - FAIXA.top} fill={COR.card} /> : null}

        {/* c01 */}
        <Linha f={f} at={-1} out={C.gancho + 68} base={937} size={92}>
          <text x={0} y={0} fill={COR.ink} style={{ font: FT.frase }}>Todo mundo</text>
        </Linha>
        <Linha f={f} at={C.gancho + 3} out={C.gancho + 70} base={1045} size={92}>
          <text x={0} y={0} fill={COR.ink} style={{ font: FT.frase, whiteSpace: 'pre' }}>
            {'falando em '}<tspan fill={COR.acc} style={{ font: FT.fraseSerif }}>“reset”.</tspan>
          </text>
        </Linha>

        {/* c02 */}
        <Linha f={f} at={C.virada} out={C.aprender - 8} base={878} size={92}>
          <text x={0} y={0} fill={COR.ink} style={{ font: FT.frase, whiteSpace: 'pre' }}>
            {'O '}<tspan fill={COR.acc} style={{ font: FT.fraseSerif }}>reset</tspan>{' que'}
          </text>
        </Linha>
        <Linha f={f} at={C.virada + 3} out={C.aprender - 7} base={984} size={92}>
          <text x={0} y={0} fill={COR.ink} style={{ font: FT.frase }}>a gente indica</text>
        </Linha>
        <Linha f={f} at={C.virada + 6} out={C.aprender - 6} base={1090} size={92}>
          <text x={0} y={0} fill={COR.ink} style={{ font: FT.frase }}>é</text>
          <text x={0} y={0} fill={COR.acc} transform={`translate(${wE} 0) scale(${enc})`} style={{ font: FT.frase }}>pequeno.</text>
        </Linha>

        {/* o leque: colorido na página rosé */}
        <Leque colors={CORES_LEQUE} brilho={(c) => tint(PAL.branco, c, 0.45)} />

        {/* c03: a faixa vira página; sob o campo, o leque é nude (máscara, sem opacidade) */}
        {cp ? (
          <>
            <clipPath id="n5campo"><rect x={-60} y={cp.top} width={1200} height={cp.bottom - cp.top} /></clipPath>
            <rect x={-60} y={cp.top} width={1200} height={cp.bottom - cp.top} fill={COR.acc} />
            <g clipPath="url(#n5campo)">
              <Leque colors={ANG.map(() => COR.claro)} brilho={() => tint(COR.acc, COR.claro, 0.3)} />
            </g>
          </>
        ) : null}

        <Linha f={f} at={C.aprender + 12} out={C.cta} base={930} size={150}>
          <text x={0} y={0} fill={COR.claro} style={{ font: FT.aprender, letterSpacing: '-0.01em' }}>aprender.</text>
        </Linha>
        <Linha f={f} at={C.aprender + 18} out={C.cta + 2} base={1035} size={64}>
          <text x={0} y={0} fill={COR.claro} style={{ font: FT.apoio }}>unhas, do zero,</text>
        </Linha>
        <Linha f={f} at={C.aprender + 21} out={C.cta + 2} base={1110} size={64}>
          <text x={0} y={0} fill={COR.claro} style={{ font: FT.apoio }}>no seu ritmo.</text>
        </Linha>

        {/* c04: CTA */}
        <Linha f={f} at={C.cta + 6} base={640} size={96}>
          <text x={0} y={0} fill={COR.claro} style={{ font: FT.cta }}>Descubra</text>
        </Linha>
        <Linha f={f} at={C.cta + 9} base={752} size={96}>
          <text x={0} y={0} fill={COR.claro} style={{ font: FT.cta }}>por onde começar.</text>
        </Linha>
        <Linha f={f} at={C.cta + 18} base={905} size={56}>
          <text x={0} y={0} fill={COR.claro} style={{ font: FT.url }}>{URL}</text>
        </Linha>
        {pU > 0 ? <rect x={X0} y={930} width={urlW * pU} height={3} fill={COR.claro} /> : null}
        <Linha f={f} at={C.cta + 30} base={1020} size={60}>
          <text x={0} y={0} fill={COR.claro} style={{ font: FT.info }}>1 pergunta. Leva 2 minutos.</text>
        </Linha>
      </g>
    </svg>
  );
};

// ---------- tempo sintético (só âncora: sem voz, sem legenda) ----------
const BATIDAS: [number, number, string][] = [
  [0, 68, 'Todo mundo falando em “reset”.'],
  [75, 149, 'O reset que a gente indica é pequeno.'],
  [162, 239, 'aprender. unhas, do zero, no seu ritmo.'],
  [246, 280, 'Descubra por onde começar. cursosdeunhas.com.br/comecar 1 pergunta. Leva 2 minutos.'],
];
const timing: Timing = {
  duration: TOTAL / FPS - LEAD,
  words: BATIDAS.flatMap(([a, b, txt]) => {
    const ws = txt.split(' ');
    const dur = (b - a) / ws.length;
    return ws.map((w, i) => ({
      w,
      s: +Math.max(0, (a + i * dur) / FPS - LEAD).toFixed(3),
      e: +Math.max(0, (a + (i + 1) * dur) / FPS - LEAD).toFixed(3),
    }));
  }),
};

export const N5: V6Def = {
  k: 5,
  timing,
  total: TOTAL,
  lead: 0,
  voice: false,
  fonts: [FT.frase, FT.fraseSerif, FT.cta, FT.aprender, FT.apoio, FT.info, FT.url, FT.muro, FT.muroI],
  scenes: [{ id: 'filme', from: 0, bg: COR.pagina, C: Filme }],
  tracks: [],
  sfx: [
    // c01: o falatório (whoosh a −14 st e −12 st); o 2º chega ao pico em ~f56 e é cortado seco em f60
    { src: 'audio/whoosh.mp3', at: 0, rate: 0.45, dur: 60, db: -24, keys: [[0, -26], [40, -22], [59, -22], [60, -60]] },
    { src: 'audio/whoosh.mp3', at: 36, rate: 0.5, dur: 24, db: -16, keys: [[36, -20], [59, -14], [60, -60]] },
    // c02: "pequeno." encolhe: toque pequeno (impact a 3,0×, lá ~110 Hz)
    { src: 'audio/impact.mp3', at: 101, rate: 3, dur: 10, db: -24, keys: [[101, -24], [107, -24], [111, -60]] },
    // c03: a página fica framboesa: peso de decisão (impact a 1,5×, lá grave)
    { src: 'audio/impact.mp3', at: 164, rate: 1.5, dur: 54, db: -14, keys: [[164, -14], [188, -18], [218, -40]] },
    // c04: a URL abre: resolução em ré (impact a 2,0×)
    { src: 'audio/impact.mp3', at: 268, rate: 2, dur: 30, db: -18, keys: [[268, -18], [284, -24], [298, -50]] },
  ],
};
