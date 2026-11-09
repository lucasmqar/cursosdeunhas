import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { evolvePath } from '@remotion/paths';
import { C, SANS, SERIF, SPRING_POP, SPRING_SOFT, SPRING_UI } from './theme';
import { ramp, useAd } from './core';

// ---------- unha (oval) ----------
export const NAIL_PATH = 'M -22 10 C -22 -40 22 -40 22 10 L 22 34 C 22 44 -22 44 -22 34 Z';
const GLOSS = 'M -12 -14 C -8 -24 6 -26 10 -20';

export const Nail: React.FC<{
  x: number; y: number; s?: number; rot?: number; fill?: string; stroke?: string; strokeW?: number; gloss?: boolean; opacity?: number;
}> = ({ x, y, s = 1, rot = 0, fill = C.plum, stroke, strokeW = 3, gloss = true, opacity = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={opacity}>
    <path d={NAIL_PATH} fill={fill === 'none' ? 'none' : fill} stroke={stroke} strokeWidth={stroke ? strokeW / s : 0} />
    {gloss && fill !== 'none' && <path d={GLOSS} stroke="rgba(255,255,255,.55)" strokeWidth={3} strokeLinecap="round" fill="none" />}
  </g>
);

/** Símbolo do conceito 1: cinco unhas nascendo como um sol sobre uma linha dourada. */
export const NailSun: React.FC<{ cx: number; cy: number; s?: number; start?: number; light?: boolean; grey?: number }> = ({
  cx, cy, s = 1, start = 0, light = false, grey = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const base = cy + 40 * s;
  const lineE = spring({ frame: frame - start, fps, config: SPRING_SOFT });
  const greyC = (c: string) => (grey > 0 ? mix(c, '#B9AEB3', grey) : c);
  return (
    <g>
      <line x1={cx - 160 * s * lineE} x2={cx + 160 * s * lineE} y1={base} y2={base} stroke={C.gold} strokeWidth={3 * s} strokeLinecap="round" />
      {[-64, -32, 0, 32, 64].map((ang, i) => {
        const e = spring({ frame: frame - start - 6 - i * 3, fps, config: SPRING_UI });
        if (e <= 0.001) return null;
        const rad = (ang * e * Math.PI) / 180, d = 100 * s * e;
        return (
          <Nail key={i} x={cx + Math.sin(rad) * d} y={base - Math.cos(rad) * d} s={s * e} rot={ang * e}
            fill={light ? mix(C.fan[i], '#FFFFFF', 0.12) : greyC(C.fan[i])} />
        );
      })}
    </g>
  );
};

// ---------- traço que se desenha ----------
export const Draw: React.FC<{ d: string; p: number; color?: string; w?: number; fill?: string; cap?: 'round' | 'butt' }> = ({
  d, p, color = C.plum, w = 4, fill = 'none', cap = 'round',
}) => {
  if (p <= 0) return null;
  const ev = evolvePath(Math.min(1, p), d);
  return <path d={d} fill={fill} stroke={color} strokeWidth={w} strokeLinecap={cap} strokeLinejoin="round" style={ev} />;
};

// ---------- tipografia cinética (palavras sobem de trás de uma máscara, no tempo da voz) ----------
export const Kinetic: React.FC<{
  lines: { text: string; at: number; color?: string; italic?: boolean }[][];
  y: number; size: number; font?: 'serif' | 'sans'; weight?: number; lineGap?: number; strikeAt?: number; strikeLine?: [number, number];
}> = ({ lines, y, size, font = 'serif', weight = 400, lineGap = 1.3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { dark } = useAd();
  return (
    <div style={{ position: 'absolute', left: 0, width: 1000, top: y, textAlign: 'center' }}>
      {lines.map((ln, li) => (
        <div key={li} style={{ height: size * lineGap, overflow: 'hidden', display: 'flex', justifyContent: 'center', gap: size * 0.26 }}>
          {ln.map((wd, wi) => {
            const e = spring({ frame: frame - wd.at, fps, config: SPRING_UI });
            return (
              <span key={wi} style={{
                fontFamily: font === 'serif' ? SERIF : SANS, fontSize: size, fontWeight: weight, fontStyle: wd.italic ? 'italic' : 'normal',
                lineHeight: `${size * lineGap}px`, color: wd.color ?? (dark ? C.bg : C.ink), letterSpacing: font === 'serif' ? '-0.01em' : '-0.02em',
                transform: `translateY(${(1 - e) * size * 1.1}px)`, opacity: interpolate(e, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }), display: 'inline-block',
              }}>{wd.text}</span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ---------- etiqueta (pill) ----------
export const Chip: React.FC<{ x: number; y: number; text: string; at: number; active?: boolean; activeAt?: number; size?: number; icon?: React.ReactNode; w?: number }> = ({
  x, y, text, at, active = false, activeAt, size = 40, icon, w,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { dark } = useAd();
  const e = spring({ frame: frame - at, fps, config: SPRING_POP });
  const on = activeAt !== undefined ? ramp(frame, activeAt, activeAt + 8) : active ? 1 : 0;
  const bg = mix(dark ? 'rgba(255,255,255,0)' : '#FFFFFF', dark ? C.gold : C.plum, on);
  return (
    <div style={{
      position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * e})`, opacity: Math.min(1, e * 1.5),
      background: on > 0 ? bg : dark ? 'rgba(255,255,255,0.06)' : '#FFFFFF', border: `2px solid ${on > 0.5 ? 'transparent' : dark ? 'rgba(246,237,232,.35)' : 'rgba(110,31,69,.16)'}`,
      borderRadius: 999, padding: `${size * 0.4}px ${size * 0.75}px`, display: 'flex', alignItems: 'center', gap: size * 0.35, whiteSpace: 'nowrap',
      fontFamily: SANS, fontWeight: 600, fontSize: size, color: on > 0.5 ? (dark ? C.night : C.white) : dark ? C.bg : C.ink,
      boxShadow: dark ? 'none' : '0 10px 30px rgba(110,31,69,.10)', width: w, justifyContent: 'center',
    }}>
      {icon}
      {text}
    </div>
  );
};

// ---------- ícones de traço (desenhados com evolvePath) ----------
export const ICON = {
  check: 'M -14 0 L -4 10 L 16 -12',
  house: 'M -70 10 L 0 -55 L 70 10 M -52 -6 L -52 70 L 52 70 L 52 -6 M -16 70 L -16 28 L 16 28 L 16 70',
  clock: 'M 0 -70 A 70 70 0 1 1 -0.1 -70 M 0 -40 L 0 0 L 30 18',
  shield: 'M 0 -40 L 32 -28 L 32 4 C 32 24 16 36 0 44 C -16 36 -32 24 -32 4 L -32 -28 Z',
  cert: 'M -34 -26 L 34 -26 L 34 22 L -34 22 Z M -22 -10 L 22 -10 M -22 4 L 10 4 M 18 22 L 18 44 L 24 38 L 30 44 L 30 22',
  book: 'M 0 -24 C -14 -34 -30 -34 -40 -28 L -40 30 C -30 24 -14 24 0 34 C 14 24 30 24 40 30 L 40 -28 C 30 -34 14 -34 0 -24 Z M 0 -24 L 0 34',
};

export const IconDraw: React.FC<{ d: string; x: number; y: number; s?: number; p: number; color?: string; w?: number }> = ({ d, x, y, s = 1, p, color = C.plum, w = 4 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Draw d={d} p={p} color={color} w={w / s} />
  </g>
);

// ---------- brilho (estrela de 4 pontas) ----------
export const Sparkle: React.FC<{ x: number; y: number; r: number; color?: string; opacity?: number }> = ({ x, y, r, color = C.gold, opacity = 1 }) =>
  r <= 0 ? null : (
    <path opacity={opacity} fill={color}
      d={`M ${x} ${y - r} Q ${x} ${y} ${x + r} ${y} Q ${x} ${y} ${x} ${y + r} Q ${x} ${y} ${x - r} ${y} Q ${x} ${y} ${x} ${y - r} Z`} />
  );

// ---------- util ----------
export function mix(a: string, b: string, t: number): string {
  const pa = parse(a), pb = parse(b);
  const k = Math.max(0, Math.min(1, t));
  const v = pa.map((x, i) => x + (pb[i] - x) * k);
  return `rgba(${Math.round(v[0])},${Math.round(v[1])},${Math.round(v[2])},${v[3].toFixed(3)})`;
}
function parse(c: string): number[] {
  if (c.startsWith('#')) {
    const n = parseInt(c.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  const m = c.match(/[\d.]+/g)!.map(Number);
  return [m[0], m[1], m[2], m[3] ?? 1];
}

export const Label: React.FC<{ x: number; y: number; text: string; at: number; size?: number; color?: string; serif?: boolean; italic?: boolean; weight?: number; anchor?: 'center' | 'left' }> = ({
  x, y, text, at, size = 36, color, serif = false, italic = false, weight = 600, anchor = 'center',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { dark } = useAd();
  const e = spring({ frame: frame - at, fps, config: SPRING_UI });
  return (
    <div style={{
      position: 'absolute', left: x, top: y, transform: `translate(${anchor === 'center' ? '-50%' : '0'}, calc(-50% + ${(1 - e) * 18}px))`, opacity: e,
      fontFamily: serif ? SERIF : SANS, fontStyle: italic ? 'italic' : 'normal', fontWeight: weight, fontSize: size, whiteSpace: 'nowrap',
      color: color ?? (dark ? C.bg : C.ink),
    }}>{text}</div>
  );
};
