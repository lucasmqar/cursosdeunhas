// N2 — Onze da noite: tempo só dela. Relógio (Apple), anel das 24 horas (Vox), contadores com física de UI (Linear).
import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { AdDef } from '../Ad';
import { Stage, Svg, ramp, SceneProps } from '../core';
import { C, SANS, SPRING_POP, SPRING_UI } from '../theme';
import { Chip, Draw, ICON, IconDraw, Kinetic, Label, Nail, Sparkle } from '../parts';
import { EndCard } from '../EndCard';
import timing from '../timing/n2.json';

const Moon: React.FC<{ x: number; y: number; r: number; p?: number }> = ({ x, y, r, p = 1 }) => (
  <g opacity={p}>
    <defs>
      <mask id={`moon${x}${y}`}>
        <rect x={x - r * 2} y={y - r * 2} width={r * 4} height={r * 4} fill="#fff" />
        <circle cx={x + r * 0.45} cy={y - r * 0.3} r={r * 0.92} fill="#000" />
      </mask>
    </defs>
    <circle cx={x} cy={y} r={r} fill={C.gold} mask={`url(#moon${x}${y})`} />
  </g>
);

/** 22:59 → 23:00, dígitos rolando no tempo de "noite". */
const Clock: React.FC<SceneProps> = ({ atw }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = atw('noite') - 6;
  const roll = spring({ frame: frame - n, fps, config: SPRING_UI });
  const from = '22:59', to = '23:00';
  const size = 250;
  return (
    <Stage>
      <Svg><Moon x={790} y={180} r={64} p={ramp(frame, 0, 14)} /></Svg>
      <div style={{ position: 'absolute', top: 330, width: 1000, display: 'flex', justifyContent: 'center', fontFamily: SANS, fontWeight: 500,
        fontSize: size, color: C.bg, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
        {to.split('').map((ch, i) => {
          const changes = ch !== from[i];
          return (
            <div key={i} style={{ height: size * 1.05, overflow: 'hidden', position: 'relative', width: ch === ':' ? size * 0.32 : size * 0.6, textAlign: 'center' }}>
              {changes ? (
                <div style={{ transform: `translateY(${-roll * size * 1.05}px)` }}>
                  <div style={{ height: size * 1.05, lineHeight: `${size * 1.05}px`, opacity: 1 - roll }}>{from[i]}</div>
                  <div style={{ height: size * 1.05, lineHeight: `${size * 1.05}px`, color: i >= 3 ? C.bg : C.gold }}>{ch}</div>
                </div>
              ) : (
                <div style={{ lineHeight: `${size * 1.05}px`, opacity: ch === ':' ? 0.5 + 0.5 * Math.round((Math.sin(frame / 5) + 1) / 2) : 1 }}>{ch}</div>
              )}
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

const House: React.FC<SceneProps> = ({ atw }) => {
  const frame = useCurrentFrame();
  const d = atw('dorme');
  const light = 1 - ramp(frame, d + 2, d + 14);
  return (
    <Stage>
      <Svg>
        <Moon x={760} y={200} r={56} />
        <rect x={470} y={470} width={60} height={60} rx={6} fill={C.gold} opacity={0.15 + 0.85 * light} />
        <IconDraw d={ICON.house} x={500} y={470} s={3.4} p={ramp(frame, 0, 26)} color={C.bg} w={8} />
        {[0, 1, 2].map((i) => (
          <text key={i} x={610 + i * 40} y={360 - i * 40} fill={C.bg} fontFamily={SANS} fontWeight={600} fontSize={36 + i * 8}
            opacity={ramp(frame, d + 10 + i * 6, d + 18 + i * 6) * 0.7}>z</text>
        ))}
      </Svg>
    </Stage>
  );
};

/** Anel das 24 horas: o pedaço do dia que é só dela. */
const DayRing: React.FC<SceneProps> = ({ atw }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cx = 500, cy = 470, r = 280;
  const ring = ramp(frame, 0, 30);
  const sliceAt = atw('pedaço') - 4;
  const pop = spring({ frame: frame - sliceAt, fps, config: SPRING_POP });
  const arc = (h0: number, h1: number, rr: number) => {
    const a0 = (h0 / 24) * 2 * Math.PI - Math.PI / 2, a1 = (h1 / 24) * 2 * Math.PI - Math.PI / 2;
    return `M ${cx + rr * Math.cos(a0)} ${cy + rr * Math.sin(a0)} A ${rr} ${rr} 0 ${h1 - h0 > 12 ? 1 : 0} 1 ${cx + rr * Math.cos(a1)} ${cy + rr * Math.sin(a1)}`;
  };
  const mid = ((23.5 / 24) * 2 * Math.PI) - Math.PI / 2;
  const out = 26 * pop;
  return (
    <Stage>
      <Svg>
        <Draw d={arc(0, 23.99, r)} p={ring} color="rgba(246,237,232,.22)" w={56} cap="butt" />
        {[0, 6, 12, 18].map((h) => {
          const a = (h / 24) * 2 * Math.PI - Math.PI / 2;
          return <text key={h} x={cx + (r - 80) * Math.cos(a)} y={cy + (r - 80) * Math.sin(a) + 12} textAnchor="middle" fill="rgba(246,237,232,.55)"
            fontFamily={SANS} fontWeight={600} fontSize={34} opacity={ring}>{h}h</text>;
        })}
        <g transform={`translate(${Math.cos(mid) * out} ${Math.sin(mid) * out})`} opacity={Math.min(1, pop * 2)}>
          <path d={arc(23, 24, r)} stroke={C.gold} strokeWidth={56 + 10 * pop} fill="none" />
        </g>
        <Nail x={cx} y={cy - 6} s={1.6 * spring({ frame: frame - atw('dela') + 6, fps, config: SPRING_POP })} fill={C.rose} />
      </Svg>
      <Label x={cx} y={cy + 90} text="23h – 0h" at={sliceAt + 4} size={34} color="rgba(246,237,232,.7)" />
      <Label x={300} y={150} text="só dela" at={atw('só') - 2} size={46} color={C.gold} serif italic weight={400} />
    </Stage>
  );
};

const Choice: React.FC<SceneProps> = ({ atw }) => {
  const frame = useCurrentFrame();
  const d = atw('descansar'), a = atw('aprender');
  const dim = ramp(frame, a, a + 10);
  return (
    <Stage>
      <div style={{ opacity: 1 - dim * 0.55 }}>
        <Chip x={500} y={330} text="descansar" at={d - 4} size={54} />
      </div>
      <Label x={500} y={470} text="ou" at={atw('e', 3) - 2} size={40} color="rgba(246,237,232,.6)" serif italic weight={400} />
      <Chip x={500} y={610} text="aprender a fazer unhas" at={a - 4} activeAt={atw('unhas')} size={54} />
    </Stage>
  );
};

/** Uma aula de cada vez. Uma unha de cada vez. */
const OneByOne: React.FC<SceneProps> = ({ atw }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = atw('aula'), u = atw('unha');
  const step = 9;
  return (
    <Stage>
      <Label x={500} y={250} text="aula" at={a - 6} size={40} color="rgba(246,237,232,.6)" />
      {[0, 1, 2, 3, 4].map((i) => {
        const e = spring({ frame: frame - a - i * step, fps, config: SPRING_POP });
        return (
          <div key={i} style={{ position: 'absolute', left: 500 - 2.5 * 130 + i * 130 + 10, top: 300, width: 110, height: 110, borderRadius: 26,
            border: `3px solid rgba(246,237,232,.3)`, background: `rgba(201,162,126,${e})`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: SANS, fontWeight: 700, fontSize: 46, color: e > 0.5 ? C.night : 'rgba(246,237,232,.4)', transform: `scale(${0.9 + 0.1 * e})` }}>{i + 1}</div>
        );
      })}
      <Label x={500} y={540} text="unha" at={u - 6} size={40} color="rgba(246,237,232,.6)" />
      <Svg>
        {[0, 1, 2, 3, 4].map((i) => {
          const e = spring({ frame: frame - u - i * step, fps, config: SPRING_POP });
          const x = 500 - 2 * 130 + i * 130;
          return (
            <g key={i}>
              <Nail x={x} y={650} s={1.7} fill="none" stroke="rgba(246,237,232,.35)" strokeW={3} gloss={false} />
              {e > 0.01 && <Nail x={x} y={650} s={1.7 * e} fill={C.fan[i]} />}
            </g>
          );
        })}
      </Svg>
    </Stage>
  );
};

const NoRush: React.FC<SceneProps> = ({ atw }) => (
  <Stage>
    <Kinetic y={340} size={130} lines={[
      [{ text: 'Sem', at: 0 }, { text: 'pressa,', at: atw('pressa'), italic: true, color: C.rose }],
      [{ text: 'sem', at: atw('sem', 2) }, { text: 'sair', at: atw('sair') }, { text: 'de', at: atw('de', 3) }, { text: 'casa.', at: atw('casa', 2), italic: true, color: C.gold }],
    ]} />
  </Stage>
);

/** Linha do tempo: noites que ficaram para trás; uma delas brilha. */
const LookBack: React.FC<SceneProps> = ({ atw, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tr = atw('trás'), ag = atw('agradecer'), no = atw('noite', 2);
  const shift = interpolate(frame, [0, tr + 20], [0, 520], { extrapolateRight: 'clamp', easing: (x) => 1 - Math.pow(1 - x, 3) });
  const glow = spring({ frame: frame - ag, fps, config: SPRING_POP });
  const N = 16, gap = 110, hi = 8;
  return (
    <Stage>
      <Svg>
        <line x1={-200} x2={1200} y1={500} y2={500} stroke="rgba(246,237,232,.25)" strokeWidth={3} />
        {Array.from({ length: N }).map((_, i) => {
          const x = 960 - (N - 1 - i) * gap + shift;
          const isHi = i === hi;
          return (
            <g key={i}>
              <circle cx={x} cy={500} r={isHi ? 14 + 18 * glow : 12} fill={isHi ? C.gold : 'rgba(246,237,232,.45)'} />
              {isHi && glow > 0 && <circle cx={x} cy={500} r={60 * glow} fill="none" stroke={C.gold} strokeWidth={3} opacity={0.6 * (1 - glow * 0.4)} />}
              {isHi && <Sparkle x={x + 50} y={430} r={22 * ramp(frame, ag + 8, ag + 16)} />}
            </g>
          );
        })}
      </Svg>
      <Label x={960 - (N - 1 - hi) * gap + shift} y={610} text="essa noite" at={no - 4} size={46} color={C.gold} serif italic weight={400} />
      <Label x={500} y={330} text="um dia, olhando pra trás" at={4} size={40} color="rgba(246,237,232,.6)" />
    </Stage>
  );
};

const End: React.FC<SceneProps> = () => <EndCard title="Veja por onde começar" sub="Uma aula de cada vez" />;

export const N2: AdDef = {
  k: 2,
  timing,
  dark: true,
  keywords: ['noite', 'dela', 'aprender', 'aula', 'unha', 'agradecer'],
  scenes: [
    { from: 0, C: Clock },
    { from: ['a'], C: House },
    { from: ['pra'], C: DayRing, whoosh: true },
    { from: ['tem'], C: Choice },
    { from: ['uma'], C: OneByOne, whoosh: true },
    { from: ['sem'], C: NoRush },
    { from: ['um'], C: LookBack, whoosh: true },
    { from: ['se'], C: End, end: true },
  ],
};
