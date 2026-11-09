import React, { createContext, useContext } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { LEAD, SPRING_UI, Timing, norm, sec } from './theme';

// ---------- contexto do anúncio ----------
export type AdInfo = { sq: boolean; dark: boolean; timing: Timing; keywords: Set<string> };
export const AdCtx = createContext<AdInfo>(null as unknown as AdInfo);
export const useAd = () => useContext(AdCtx);

/** quadro absoluto em que a palavra i começa a ser dita */
export const wordFrame = (t: Timing, i: number) => sec(LEAD + t.words[Math.max(0, Math.min(i, t.words.length - 1))].s);
export const wordEndFrame = (t: Timing, i: number) => sec(LEAD + t.words[Math.max(0, Math.min(i, t.words.length - 1))].e);

/** índice da n-ésima ocorrência de uma palavra no roteiro (ignora acento e pontuação) */
export const findWord = (t: Timing, word: string, nth = 1) => {
  const target = norm(word);
  let seen = 0;
  for (let i = 0; i < t.words.length; i++) {
    if (norm(t.words[i].w) === target && ++seen === nth) return i;
  }
  throw new Error(`palavra não encontrada no roteiro: ${word} (#${nth})`);
};

// ---------- cena ----------
export type SceneProps = {
  /** quadro local (dentro da cena) em que a palavra i começa */
  at: (i: number) => number;
  /** idem, procurando pela palavra */
  atw: (word: string, nth?: number) => number;
  dur: number;
};

// ---------- animação ----------
export const useSpring = (delay = 0, config = SPRING_UI, durationInFrames?: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config, durationInFrames });
};

export const ramp = (frame: number, from: number, to: number, ease = Easing.bezier(0.25, 0.1, 0.25, 1)) =>
  interpolate(frame, [from, to], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });

// ---------- palco: caixa de 1000×1000 unidades, escalada para cada formato ----------
export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width: W, height: H } = useVideoConfig();
  const sq = W === H;
  const s = sq ? 0.62 : 0.95;
  const cy = sq ? H * 0.39 : H * 0.335;
  return (
    <div
      style={{
        position: 'absolute',
        left: (W - 1000 * s) / 2,
        top: cy - 500 * s,
        width: 1000,
        height: 1000,
        transform: `scale(${s})`,
        transformOrigin: 'top left',
      }}
    >
      {children}
    </div>
  );
};

/** SVG que ocupa o palco inteiro em unidades */
export const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg viewBox="0 0 1000 1000" width={1000} height={1000} style={{ position: 'absolute', inset: 0, overflow: 'visible', ...style }}>
    {children}
  </svg>
);
