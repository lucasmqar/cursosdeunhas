// v6 · marca Cursos de Unhas (fonte: marketing/ativos/n{1..4}_*.svg). Fontes FIXAS: Georgia + Helvetica Neue/SF.
// Cada vídeo varia acento (da paleta), grade, transição, câmera, legenda, som e fecho; nunca a família tipográfica.
import React from 'react';

export const PAL = {
  nude: '#F6EDE8',
  nude2: '#EFE1DA',
  ameixa: '#6E1F45',
  ameixaProf: '#3E1028',
  noite: '#24101C',
  rose: '#D99BA8',
  dourado: '#C9A27E',
  tinta: '#3B2430',
  cinza: '#9C8590',
  branco: '#FFFFFF',
  /** leque das 5 unhas do símbolo (rosé → ameixa) */
  leque: ['#D99BA8', '#C77D92', '#A24E6F', '#86325A', '#6E1F45'],
};

/** famílias da marca (as dos assets) */
export const SERIF = "Georgia, 'Times New Roman', serif";
export const SANS = "'Helvetica Neue', -apple-system, Arial, sans-serif";
/** Helvetica Neue Condensed Bold/Black só existem via local() */
export const HN_COND_CSS = `
@font-face { font-family: 'HNCond'; font-weight: 700; src: local('HelveticaNeue-CondensedBold'); }
@font-face { font-family: 'HNCond'; font-weight: 900; src: local('HelveticaNeue-CondensedBlack'); }
`;

/** mistura sólida (sem opacidade): c sobre base, t = 0..1 */
export const tint = (c: string, base: string, t: number) => {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const a = h(c), b = h(base);
  return '#' + a.map((v, i) => Math.round(b[i] + (v - b[i]) * t).toString(16).padStart(2, '0')).join('');
};

// ---------- a unha do símbolo ----------
// Caminho original (assets): M-22,10 C-22,-40 22,-40 22,10 L22,34 C22,44 -22,44 -22,34 Z
// caixa x −22..22 (44), y −27,5..41,5 (69); borda livre em cima, cutícula embaixo.
const NW = 44, NH = 69, NCY = 7;
const P = (cx: number, cy: number, w: number, h: number) => {
  const sx = w / NW, sy = h / NH;
  return (x: number, y: number) => `${(cx + x * sx).toFixed(2)},${(cy + (y - NCY) * sy).toFixed(2)}`;
};
/** contorno da unha centrado em (cx, cy) com caixa w × h */
export const unhaD = (cx: number, cy: number, w: number, h: number) => {
  const p = P(cx, cy, w, h);
  return `M${p(-22, 10)} C${p(-22, -40)} ${p(22, -40)} ${p(22, 10)} L${p(22, 34)} C${p(22, 44)} ${p(-22, 44)} ${p(-22, 34)} Z`;
};
/** reflexo (arco curto perto da borda livre) */
export const brilhoD = (cx: number, cy: number, w: number, h: number) => {
  const p = P(cx, cy, w, h);
  return `M${p(-12, -14)} C${p(-8, -24)} ${p(6, -26)} ${p(10, -20)}`;
};
/** y da cutícula (base) e da borda livre (topo) para a caixa dada */
export const unhaY = (cy: number, h: number) => ({ topo: cy - h / 2, base: cy + h / 2 });

/** Unha da marca: preenchimento sólido ou contorno; reflexo sólido (tinta clara, sem opacidade). */
export const Unha: React.FC<{
  cx: number; cy: number; w: number; h: number; fill?: string; stroke?: string; sw?: number; brilho?: string | false; bg?: string;
}> = ({ cx, cy, w, h, fill, stroke, sw, brilho, bg = PAL.nude }) => {
  const hi = brilho === false ? null : brilho ?? (fill ? tint(PAL.branco, fill, 0.55) : tint(PAL.branco, bg, 0.55));
  return (
    <g>
      <path d={unhaD(cx, cy, w, h)} fill={fill ?? 'none'} stroke={stroke} strokeWidth={sw} />
      {hi ? <path d={brilhoD(cx, cy, w, h)} fill="none" stroke={hi} strokeWidth={(3 * w) / NW} strokeLinecap="round" /> : null}
    </g>
  );
};
