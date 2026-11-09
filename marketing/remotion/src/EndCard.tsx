import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { C, SANS, SERIF, SPRING_POP, SPRING_UI } from './theme';
import { Stage, Svg, useAd } from './core';
import { NailSun } from './parts';

/** Cartão final: círculo ameixa abre, símbolo, título na voz, os 3 caminhos e o endereço. */
export const EndCard: React.FC<{ title: string; sub?: string }> = ({ title, sub = 'Leva 2 minutos' }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const { sq } = useAd();
  const wipe = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: 'clamp', easing: Easing.bezier(0.65, 0, 0.35, 1) });
  const R = Math.hypot(W, H) * 0.62 * wipe;
  const words = title.split(' ');
  const half = Math.ceil(words.length / 2);
  const lines = words.length > 3 ? [words.slice(0, half).join(' '), words.slice(half).join(' ')] : [title];
  const chips = ['Do zero', 'Completo', 'Alongamento'];
  const tE = spring({ frame: frame - 8, fps, config: SPRING_UI });
  const pill = spring({ frame: frame - 26, fps, config: SPRING_POP });
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: W / 2 - R, top: H * 0.45 - R, width: 2 * R, height: 2 * R, borderRadius: '50%', background: C.plum }} />
      <Stage>
        <Svg>
          <NailSun cx={500} cy={sq ? 150 : 170} s={1.0} start={4} light />
        </Svg>
        <div style={{ position: 'absolute', top: sq ? 330 : 360, width: 1000, textAlign: 'center' }}>
          {lines.map((l, i) => (
            <div key={i} style={{ fontFamily: SERIF, fontSize: lines.length > 1 ? 104 : 118, lineHeight: 1.1, color: C.white, letterSpacing: '-0.01em',
              opacity: tE, transform: `translateY(${(1 - tE) * 30 + i * (1 - tE) * 14}px)` }}>{l}</div>
          ))}
        </div>
        <div style={{ position: 'absolute', top: sq ? 610 : 650, width: 1000, display: 'flex', justifyContent: 'center', gap: 18 }}>
          {chips.map((c, i) => {
            const e = spring({ frame: frame - 16 - i * 4, fps, config: SPRING_POP });
            return (
              <div key={c} style={{ fontFamily: SANS, fontWeight: 600, fontSize: 36, color: C.bg, border: '2px solid rgba(246,237,232,.4)', borderRadius: 999,
                padding: '14px 28px', opacity: e, transform: `translateY(${(1 - e) * 24}px)` }}>{c}</div>
            );
          })}
        </div>
      </Stage>
      <div style={{ position: 'absolute', width: W, top: sq ? H * 0.8 : H * 0.545, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 * (W / 1080) }}>
        <div style={{ background: C.gold, color: C.plumDeep, fontFamily: SANS, fontWeight: 800, fontSize: 44 * (W / 1080), letterSpacing: '0.02em',
          padding: `${26 * (W / 1080)}px ${52 * (W / 1080)}px`, borderRadius: 999, transform: `scale(${pill})`, opacity: Math.min(1, pill * 2) }}>
          cursosdeunhas.com.br
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 34 * (W / 1080), color: 'rgba(246,237,232,.85)', opacity: interpolate(frame, [34, 44], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
          {sub} · toque em Saiba mais
        </div>
      </div>
    </AbsoluteFill>
  );
};
