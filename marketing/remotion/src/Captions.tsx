import React, { useMemo } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { measureText } from '@remotion/layout-utils';
import { C, SANS, SPRING_UI, Timing, norm } from './theme';
import { useAd, wordEndFrame, wordFrame } from './core';

type Chunk = { idx: number[]; from: number; to: number };

/** Blocos de até 3 palavras; quebra em pontuação ou pausa da voz. */
const buildChunks = (t: Timing, untilFrame: number): Chunk[] => {
  const chunks: Chunk[] = [];
  let cur: number[] = [];
  t.words.forEach((w, i) => {
    cur.push(i);
    const next = t.words[i + 1];
    const punct = /[.,!?:…]$/.test(w.w);
    const pause = next ? next.s - w.e > 0.32 : true;
    if (cur.length === 3 || punct || pause) {
      chunks.push({ idx: cur, from: wordFrame(t, cur[0]) - 2, to: 0 });
      cur = [];
    }
  });
  chunks.forEach((c, i) => {
    const lastEnd = wordEndFrame(t, c.idx[c.idx.length - 1]) + 14;
    c.to = Math.min(i + 1 < chunks.length ? chunks[i + 1].from : lastEnd, lastEnd, untilFrame);
  });
  return chunks.filter((c) => c.from < untilFrame);
};

export const Captions: React.FC<{ hideFrom: number }> = ({ hideFrom }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const { timing, keywords, dark, sq } = useAd();
  const chunks = useMemo(() => buildChunks(timing, hideFrom), [timing, hideFrom]);
  const ci = chunks.findIndex((c) => frame >= c.from && frame < c.to);
  if (ci < 0) return null;
  const c = chunks[ci];

  let size = sq ? 62 : 84;
  const gapK = 0.42;
  const words = c.idx.map((i) => timing.words[i].w.replace(/…$/, '…'));
  const meas = (s: number) => words.map((w) => measureText({ text: w, fontFamily: SANS, fontSize: s, fontWeight: '700' }).width);
  let widths = meas(size);
  const total = (ws: number[], s: number) => ws.reduce((a, b) => a + b, 0) + s * gapK * (ws.length - 1);
  const maxW = W * 0.84;
  if (total(widths, size) > maxW) {
    size = (size * maxW) / total(widths, size);
    widths = meas(size);
  }
  const tw = total(widths, size);
  const xs: number[] = [];
  let acc = (W - tw) / 2;
  widths.forEach((w) => { xs.push(acc); acc += w + size * gapK; });

  // palavra ativa = última que já começou a ser dita
  let aj = 0;
  const LEADF = 2; // o destaque chega um pouco antes da voz, para estar no lugar quando a palavra soa
  c.idx.forEach((wi, j) => { if (wordFrame(timing, wi) - LEADF <= frame) aj = j; });
  const since = frame - (wordFrame(timing, c.idx[aj]) - LEADF);
  const move = spring({ frame: since, fps, config: { damping: 20, stiffness: 260, mass: 0.5 } });
  const pj = Math.max(0, aj - 1);
  const pad = size * 0.2;
  const px = aj === 0 ? xs[0] : interpolate(move, [0, 1], [xs[pj], xs[aj]]);
  const pw = aj === 0 ? widths[0] : interpolate(move, [0, 1], [widths[pj], widths[aj]]);
  const pillIn = aj === 0 ? spring({ frame: since, fps, config: SPRING_UI }) : 1;
  const enter = spring({ frame: frame - c.from, fps, config: SPRING_UI });
  const out = interpolate(frame, [c.to - 4, c.to], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cy = sq ? H * 0.835 : H * 0.62;
  const isKey = (j: number) => keywords.has(norm(words[j]));
  const activeKey = isKey(aj);

  return (
    <div style={{ position: 'absolute', left: 0, top: cy - size * 0.75, width: W, height: size * 1.5, opacity: Math.min(enter * 1.4, out),
      transform: `translateY(${(1 - enter) * 18}px)` }}>
      <div style={{
        position: 'absolute', left: px - pad, top: size * 0.06, width: pw + pad * 2, height: size * 1.38, borderRadius: size * 0.32,
        background: activeKey ? C.gold : dark ? C.bg : C.plum, transform: `scale(${0.85 + 0.15 * pillIn})`, opacity: pillIn,
        boxShadow: dark ? 'none' : '0 8px 24px rgba(110,31,69,.18)',
      }} />
      {words.map((w, j) => {
        const on = j === aj;
        const color = on ? (activeKey ? C.night : dark ? C.night : C.white) : isKey(j) ? (dark ? C.gold : C.plum) : dark ? C.bg : C.ink;
        return (
          <div key={j} style={{ position: 'absolute', left: xs[j], top: size * 0.22, fontFamily: SANS, fontWeight: 700, fontSize: size,
            lineHeight: `${size * 1.1}px`, color, whiteSpace: 'nowrap', opacity: wordFrame(timing, c.idx[j]) <= frame + 1 ? 1 : 0.38 }}>
            {w}
          </div>
        );
      })}
    </div>
  );
};
