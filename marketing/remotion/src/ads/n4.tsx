// N4 — Com calma: segurança para escolher. Cartões que se abrem (Linear), lista de critérios e tabela comparativa animada (Vox).
import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { AdDef } from '../Ad';
import { Stage, Svg, ramp, SceneProps } from '../core';
import { C, SANS, SERIF, SPRING_POP, SPRING_UI } from '../theme';
import { Draw, ICON, IconDraw, Kinetic, Label } from '../parts';
import { EndCard } from '../EndCard';
import timing from '../timing/n4.json';

const COLS = [
  { x: 330, t: 'Do zero', what: 'manicure', price: 49.9, c: C.rose },
  { x: 575, t: 'Completo', what: '17 níveis', price: 100, c: '#A24E6F' },
  { x: 820, t: 'Alongamento', what: 'fibra e gel', price: 147, c: C.plum },
];

/** Três cursos empilhados que se abrem lado a lado em "comparou". */
const Cards: React.FC<SceneProps> = ({ atw }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cmp = atw('comparou') - 4;
  const open = spring({ frame: frame - cmp, fps, config: SPRING_UI });
  const xs = [230, 500, 770];
  return (
    <Stage>
      {[0, 1, 2].map((i) => {
        const inE = spring({ frame: frame - i * 5, fps, config: SPRING_UI });
        const x = 500 + (xs[i] - 500) * open, rot = (i - 1) * 7 * (1 - open);
        return (
          <div key={i} style={{ position: 'absolute', left: x - 115, top: 300 + (1 - inE) * 200 + (1 - open) * (i - 1) * -12, width: 230, height: 320, borderRadius: 26,
            background: '#FFFFFF', boxShadow: '0 24px 60px rgba(110,31,69,.14)', transform: `rotate(${rot}deg)`, opacity: inE, overflow: 'hidden', zIndex: i === 1 ? 2 : 1 }}>
            <div style={{ height: 120, background: `linear-gradient(135deg, ${C.rose}, ${COLS[i].c})` }} />
            {[0, 1, 2].map((r) => (
              <div key={r} style={{ margin: '20px 22px 0', height: 16, borderRadius: 8, width: [150, 120, 90][r], background: '#F1E4DE' }} />
            ))}
          </div>
        );
      })}
      <Svg>
        <Draw d="M 130 690 L 870 690" p={ramp(frame, cmp + 6, cmp + 20)} color={C.gold} w={6} />
      </Svg>
    </Stage>
  );
};

/** Os critérios, um por frase. */
const Criteria: React.FC<SceneProps> = ({ atw }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = [
    { t: 'o que ensina', at: atw('ensina'), icon: ICON.book },
    { t: 'certificado', at: atw('certificado'), icon: ICON.cert },
    { t: 'quanto custa', at: atw('custa'), icon: '' },
    { t: 'garantia', at: atw('garantia'), icon: ICON.shield },
  ];
  return (
    <Stage>
      {rows.map((r, i) => {
        const e = spring({ frame: frame - r.at + 8, fps, config: SPRING_UI });
        const y = 200 + i * 165;
        return (
          <div key={i} style={{ position: 'absolute', left: 140, top: y, width: 720, height: 130, borderRadius: 34, background: '#FFFFFF',
            boxShadow: '0 14px 40px rgba(110,31,69,.10)', opacity: e, transform: `translateX(${(1 - e) * 80}px)`, display: 'flex', alignItems: 'center' }}>
            <div style={{ marginLeft: 150, fontFamily: SANS, fontWeight: 600, fontSize: 52, color: C.ink }}>{r.t}</div>
          </div>
        );
      })}
      <Svg>
        {rows.map((r, i) => {
          const y = 200 + i * 165 + 65, p = ramp(frame, r.at - 4, r.at + 14);
          return (
            <g key={i} opacity={ramp(frame, r.at - 8, r.at - 2)}>
              {r.icon ? <IconDraw d={r.icon} x={225} y={y} s={1.15} p={p} color={C.plum} w={5} />
                : <text x={225} y={y + 17} textAnchor="middle" fontFamily={SERIF} fontSize={52} fill={C.plum} opacity={p}>R$</text>}
              <circle cx={790} cy={y} r={30 * Math.min(1, p * 2)} fill={C.gold} />
              <g transform={`translate(790 ${y}) scale(1.15)`}><Draw d={ICON.check} p={p * 1.4 - 0.4} color="#FFFFFF" w={6} /></g>
            </g>
          );
        })}
      </Svg>
    </Stage>
  );
};

const Calm: React.FC<SceneProps> = ({ atw }) => {
  const frame = useCurrentFrame();
  const c = atw('calma');
  return (
    <Stage>
      <Kinetic y={260} size={60} font="sans" weight={600} lines={[
        [{ text: 'Escolha', at: atw('escolha'), color: C.muted }, { text: 'boa', at: atw('boa'), color: C.muted }],
        [{ text: 'é', at: atw('é'), color: C.ink }, { text: 'escolha', at: atw('escolha', 2), color: C.ink }, { text: 'com', at: atw('com'), color: C.ink }],
      ]} />
      <Kinetic y={470} size={200} lines={[[{ text: 'calma.', at: c - 2, italic: true, color: C.plum }]]} />
      <Svg>
        <Draw d="M 300 730 C 420 712 580 712 700 730" p={ramp(frame, c + 6, c + 22)} color={C.gold} w={8} />
      </Svg>
    </Stage>
  );
};

/** Tabela comparativa: três caminhos, o que ensina, preço relativo e garantia lado a lado. */
const Table: React.FC<SceneProps> = ({ atw }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const heads = [atw('zero'), atw('ao'), atw('alongamento')];
  const en = atw('ensina', 2), pr = atw('preço'), ga = atw('garantia', 2), la = atw('lado');
  const rowY = { what: 420, price: 600, guar: 790 };
  const hl = spring({ frame: frame - la, fps, config: SPRING_UI });
  return (
    <Stage>
      {COLS.map((c, i) => {
        const e = spring({ frame: frame - heads[i] + 4, fps, config: SPRING_POP });
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: c.x - 115, top: 200, width: 230, height: 690, borderRadius: 30, background: '#FFFFFF',
              opacity: 0.85 * e, transform: `translateY(${(1 - e) * 60}px)`, boxShadow: `0 0 0 ${4 * hl}px ${C.gold}` }} />
            <div style={{ position: 'absolute', left: c.x - 115, top: 230, width: 230, textAlign: 'center', fontFamily: SANS, fontWeight: 700,
              fontSize: 30, color: C.plum, opacity: e, transform: `translateY(${(1 - e) * 60}px)` }}>{c.t}</div>
          </React.Fragment>
        );
      })}
      {[
        { y: rowY.what, t: 'ensina', at: en }, { y: rowY.price, t: 'preço', at: pr }, { y: rowY.guar, t: 'garantia', at: ga },
      ].map((r) => (
        <Label key={r.t} x={95} y={r.y} text={r.t} at={r.at - 6} size={32} color={C.muted} />
      ))}
      {COLS.map((c, i) => (
        <Label key={c.t} x={c.x} y={rowY.what} text={c.what} at={en + i * 4} size={32} color={C.ink} />
      ))}
      <Svg>
        <Draw d={`M ${COLS[0].x} 160 L ${COLS[2].x} 160`} p={ramp(frame, heads[0], heads[2] + 6)} color={C.gold} w={5} />
        <path d={`M ${COLS[2].x - 18} 146 L ${COLS[2].x} 160 L ${COLS[2].x - 18} 174`} fill="none" stroke={C.gold} strokeWidth={5} strokeLinecap="round"
          opacity={ramp(frame, heads[2] + 2, heads[2] + 8)} />
        {COLS.map((c, i) => {
          const e = spring({ frame: frame - pr - i * 4, fps, config: SPRING_UI });
          const h = (c.price / 147) * 110 * e;
          return <rect key={i} x={c.x - 34} y={rowY.price + 55 - h} width={68} height={h} rx={10} fill={c.c} />;
        })}
        {COLS.map((c, i) => (
          <g key={i}>
            <IconDraw d={ICON.shield} x={c.x} y={rowY.guar} s={1.1} p={ramp(frame, ga - 2 + i * 4, ga + 14 + i * 4)} color={C.plum} w={5} />
            <g transform={`translate(${c.x} ${rowY.guar + 2})`}><Draw d={ICON.check} p={ramp(frame, ga + 10 + i * 4, ga + 20 + i * 4)} color={C.gold} w={6} /></g>
          </g>
        ))}
      </Svg>
    </Stage>
  );
};

const NoPressure: React.FC<SceneProps> = ({ atw }) => (
  <Stage>
    <Kinetic y={360} size={140} lines={[
      [{ text: 'Sem', at: 0 }, { text: 'pressa,', at: atw('pressa'), italic: true, color: C.plum }],
      [{ text: 'sem', at: atw('sem', 2) }, { text: 'pressão.', at: atw('pressão'), italic: true, color: C.plum }],
    ]} />
  </Stage>
);

const End: React.FC<SceneProps> = () => <EndCard title="Qual caminho é o seu?" sub="Leva 2 minutos" />;

export const N4: AdDef = {
  k: 4,
  timing,
  dark: false,
  keywords: ['comparou', 'certificado', 'garantia', 'calma', 'caminhos', 'preco'],
  scenes: [
    { from: 0, C: Cards },
    { from: ['o'], C: Criteria, whoosh: true },
    { from: ['porque'], C: Calm },
    { from: ['a'], C: Table, whoosh: true },
    { from: ['sem'], C: NoPressure },
    { from: ['leva'], C: End, end: true },
  ],
};
