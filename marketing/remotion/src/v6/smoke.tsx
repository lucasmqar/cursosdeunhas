// Teste do motor v6 (não vai ao ar): confere fontes, máscara, transições, trilha com ducking.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import timing from '../timing/n4.json';
import { Timing } from '../theme';
import { EASE, MaskLine, Stroke, T, V6Def, W, H, prog, useAt } from './engine';

const t = timing as Timing;

const A: React.FC = () => {
  const { at } = useAt();
  return (
    <div style={{ position: 'absolute', left: 96, top: 520, width: W - 192 }}>
      <MaskLine inAt={at(0)} style={{ font: '400 120px Didot', color: '#111' }}>Antes de pagar</MaskLine>
      <svg width={W - 192} height={40}><Stroke d={`M0 20 H${W - 192}`} at={at(['pagar'])} color="#C0392B" width={6} /></svg>
    </div>
  );
};
const B: React.FC = () => {
  const f = useCurrentFrame();
  const { at } = useAt();
  const p = prog(f, at(['comparou']), 18, EASE.entra);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 96, top: 700, width: (W - 192) * p, height: 12, background: '#F4F1EA' }} />
      <MaskLine inAt={at(['comparou'])} style={{ position: 'absolute', left: 96, top: 760, font: '700 140px "Avenir Next"', color: '#F4F1EA' }}>comparou.</MaskLine>
    </div>
  );
};

export const SMOKE: V6Def = {
  k: 99,
  timing: t,
  fonts: ['400 120px Didot', '700 140px "Avenir Next"'],
  scenes: [
    { id: 'a', from: 0, bg: '#F4F1EA', C: A },
    { id: 'b', from: ['comparou'], bg: '#1B1B1B', C: B, enter: T.slats(5, 'y') },
    { id: 'c', from: ['certificado'], bg: '#C0392B', C: () => null, enter: T.iris(W / 2, H / 2, 1300) },
    { id: 'd', from: ['garantia'], bg: '#F4F1EA', C: () => null, enter: T.push('up') },
  ],
  tracks: [],
  sfx: [],
};
