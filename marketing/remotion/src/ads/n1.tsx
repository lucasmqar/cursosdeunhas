// N1 — As mãos dela: recomeço, autonomia. Rede que se espalha (Vox), tipografia no tempo da voz (Apple), UI da primeira aula (Linear).
import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { AdDef } from '../Ad';
import { Stage, Svg, ramp, SceneProps } from '../core';
import { C, SANS, SERIF, SPRING_POP, SPRING_UI } from '../theme';
import { Chip, Draw, ICON, IconDraw, Kinetic, Label, Nail, NailSun, Sparkle } from '../parts';
import { EndCard } from '../EndCard';
import timing from '../timing/n1.json';

const Tired: React.FC<SceneProps> = ({ atw }) => {
  const frame = useCurrentFrame();
  const g = 0.85;
  const sink = ramp(frame, atw('cansaço') - 6, atw('cansaço') + 20);
  return (
    <Stage>
      <Svg>
        <g transform={`translate(0 ${sink * 30})`} opacity={1 - sink * 0.35}>
          <NailSun cx={500} cy={440} s={2.5} start={0} grey={g} />
        </g>
      </Svg>
    </Stage>
  );
};

const Path: React.FC<SceneProps> = ({ atw }) => {
  const frame = useCurrentFrame();
  const c = atw('caminho');
  const road = 'M 90 860 C 300 860 360 640 500 600 C 640 560 700 420 910 400';
  return (
    <Stage>
      <Svg>
        <Draw d={road} p={ramp(frame, 0, c + 6)} color={C.gold} w={6} />
        <NailSun cx={500} cy={330} s={2.3} start={c - 4} />
        <Sparkle x={910} y={400} r={22 * ramp(frame, c + 4, c + 14)} />
      </Svg>
    </Stage>
  );
};

/** Rede que se espalha: ela → irmã → vizinha → outras. */
const Network: React.FC<SceneProps> = ({ atw }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tU = atw('unhas'), tI = atw('irmã'), tV = atw('vizinha');
  const A = { x: 500, y: 330 }, B = { x: 230, y: 640 }, Cc = { x: 770, y: 640 };
  const extra = [
    { x: 90, y: 880, from: B }, { x: 330, y: 900, from: B }, { x: 640, y: 900, from: Cc }, { x: 900, y: 860, from: Cc },
    { x: 110, y: 420, from: A }, { x: 890, y: 410, from: A },
  ];
  const node = (p: { x: number; y: number }, at: number, s: number, fill: string, ring: boolean) => {
    const e = spring({ frame: frame - at, fps, config: SPRING_POP });
    return (
      <g>
        {ring && <circle cx={p.x} cy={p.y + 6 * s} r={62 * s * e} fill="none" stroke={C.gold} strokeWidth={3} opacity={0.9} />}
        <circle cx={p.x} cy={p.y + 6 * s} r={50 * s * e} fill="#FFFFFF" />
        {e > 0.01 && <Nail x={p.x} y={p.y} s={s * 1.05 * e} fill={fill} />}
      </g>
    );
  };
  const edge = (a: { x: number; y: number }, b: { x: number; y: number }, at: number, w = 4, color = C.rose) => (
    <Draw d={`M ${a.x} ${a.y + 6} L ${b.x} ${b.y + 6}`} p={ramp(frame, at - 10, at + 6)} color={color} w={w} />
  );
  const cur = frame >= tV ? 2 : frame >= tI ? 1 : 0;
  return (
    <Stage>
      <Svg>
        {edge(A, B, tI)}
        {edge(A, Cc, tV)}
        {extra.map((p, i) => edge(p.from, p, tV + 16 + i * 3, 2.5, 'rgba(217,155,168,.7)'))}
        {node(A, 0, 1.5, C.plum, cur === 0)}
        {node(B, tI - 4, 1.2, '#A24E6F', cur === 1)}
        {node(Cc, tV - 4, 1.2, '#C77D92', cur === 2)}
        {extra.map((p, i) => node(p, tV + 18 + i * 3, 0.6, C.fan[i % 5], false))}
      </Svg>
      <Label x={500} y={190} text="as próprias unhas" at={tU - 6} size={38} color={cur === 0 ? C.plum : C.muted} />
      <Label x={230} y={500} text="a irmã" at={tI - 2} size={38} color={cur === 1 ? C.plum : C.muted} />
      <Label x={770} y={500} text="a vizinha" at={tV - 2} size={38} color={cur === 2 ? C.plum : C.muted} />
    </Stage>
  );
};

const Signature: React.FC<SceneProps> = ({ atw }) => {
  const frame = useCurrentFrame();
  const a = atw('assinatura');
  const sig = 'M 330 610 C 360 540 400 540 400 600 C 400 650 360 650 380 600 C 400 550 450 560 450 610 C 450 640 480 640 500 600 C 520 560 540 580 540 610 C 540 640 580 640 600 590 C 620 545 650 560 660 600 L 700 600';
  const e = spring({ frame, fps: 30, config: SPRING_UI });
  return (
    <Stage>
      <Svg>
        <circle cx={500} cy={440} r={230 * e} fill="#FFFFFF" opacity={0.75} />
        <Nail x={500} y={420} s={4.6 * e} fill={C.plum} />
        <Draw d={sig} p={ramp(frame, a - 4, a + 22)} color={C.gold} w={9} />
        <Sparkle x={680} y={300} r={26 * ramp(frame, a + 18, a + 28)} />
      </Svg>
    </Stage>
  );
};

const NotCourage: React.FC<SceneProps> = ({ atw }) => {
  const frame = useCurrentFrame();
  const c = atw('coragem');
  return (
    <Stage>
      <Kinetic y={330} size={120} lines={[
        [{ text: 'Não', at: atw('não') }, { text: 'começou', at: atw('começou') }],
        [{ text: 'com', at: atw('com') }, { text: 'coragem.', at: c, italic: true, color: C.plum }],
      ]} />
      <Svg>
        <Draw d="M 250 532 L 760 516" p={ramp(frame, c + 14, c + 24)} color={C.gold} w={9} />
      </Svg>
    </Stage>
  );
};

const Decision: React.FC<SceneProps> = ({ atw }) => {
  const frame = useCurrentFrame();
  const a = atw('aprender');
  return (
    <Stage>
      <Kinetic y={250} size={56} font="sans" weight={600} lines={[
        [{ text: 'Começou', at: 0, color: C.muted }, { text: 'com', at: atw('com', 2), color: C.muted }, { text: 'uma', at: atw('uma'), color: C.muted }],
        [{ text: 'decisão', at: atw('decisão'), color: C.ink }, { text: 'pequena:', at: atw('pequena'), color: C.ink }],
      ]} />
      <Kinetic y={450} size={190} lines={[[{ text: 'aprender.', at: a - 2, italic: true, color: C.plum }]]} />
      <Svg>
        <Draw d="M 230 700 C 400 685 600 685 770 700" p={ramp(frame, a + 6, a + 22)} color={C.gold} w={8} />
      </Svg>
    </Stage>
  );
};

const AtHome: React.FC<SceneProps> = ({ atw }) => {
  const frame = useCurrentFrame();
  const t1 = atw('tempo'), t2 = atw('casa');
  return (
    <Stage>
      <Svg>
        <circle cx={280} cy={460} r={150 * spring({ frame: frame - t1 + 8, fps: 30, config: SPRING_UI })} fill="#FFFFFF" opacity={0.8} />
        <circle cx={720} cy={460} r={150 * spring({ frame: frame - t2 + 10, fps: 30, config: SPRING_UI })} fill="#FFFFFF" opacity={0.8} />
        <IconDraw d={ICON.clock} x={280} y={460} s={1.35} p={ramp(frame, t1 - 6, t1 + 18)} color={C.plum} w={7} />
        <IconDraw d={ICON.house} x={720} y={455} s={1.25} p={ramp(frame, t2 - 8, t2 + 16)} color={C.plum} w={7} />
      </Svg>
      <Label x={280} y={690} text="no tempo dela" at={t1} size={40} />
      <Label x={720} y={690} text="sem sair de casa" at={t2 - 4} size={40} />
    </Stage>
  );
};

/** Card da primeira aula, com física de interface. */
const FirstClass: React.FC<SceneProps> = ({ atw }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = atw('primeira'), au = atw('aula');
  const card = spring({ frame: frame - (p - 18), fps, config: SPRING_UI });
  const play = spring({ frame: frame - au, fps, config: SPRING_POP });
  const prog = interpolate(frame, [au + 4, au + 40], [0, 0.34], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Stage>
      <Label x={500} y={170} text="toda história começa com" at={0} size={40} color={C.muted} />
      <div style={{ position: 'absolute', left: 180, top: 270, width: 640, height: 470, borderRadius: 40, background: '#FFFFFF',
        boxShadow: '0 30px 80px rgba(110,31,69,.16)', transform: `translateY(${(1 - card) * 160}px) rotate(${(1 - card) * -4}deg)`, opacity: card, overflow: 'hidden' }}>
        <div style={{ height: 300, background: `linear-gradient(135deg, ${C.rose}, ${C.plum})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 120, height: 120, borderRadius: 60, background: 'rgba(255,255,255,.95)', transform: `scale(${0.6 + 0.4 * play})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 0, height: 0, borderTop: '26px solid transparent', borderBottom: '26px solid transparent', borderLeft: `42px solid ${C.plum}`, marginLeft: 10 }} />
          </div>
        </div>
        <div style={{ padding: '34px 40px' }}>
          <div style={{ fontFamily: SERIF, fontSize: 58, color: C.ink }}>Aula 1</div>
          <div style={{ marginTop: 22, height: 12, borderRadius: 6, background: '#F1E4DE' }}>
            <div style={{ width: `${prog * 100}%`, height: '100%', borderRadius: 6, background: C.gold }} />
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, width: 1000, top: 800, textAlign: 'center', fontFamily: SANS, fontSize: 36, fontWeight: 600, color: C.muted,
        opacity: ramp(frame, au + 6, au + 16) }}>
        on-line · no seu ritmo
      </div>
    </Stage>
  );
};

const End: React.FC<SceneProps> = () => <EndCard title="Descubra por onde começar" />;

export const N1: AdDef = {
  k: 1,
  timing,
  dark: false,
  keywords: ['cansaco', 'caminho', 'assinatura', 'coragem', 'aprender', 'aula'],
  scenes: [
    { from: 0, C: Tired },
    { from: ['até'], C: Path, whoosh: true },
    { from: ['primeiro'], C: Network },
    { from: ['hoje'], C: Signature, whoosh: true },
    { from: ['não'], C: NotCourage },
    { from: ['começou', 2], C: Decision },
    { from: ['no'], C: AtHome, whoosh: true },
    { from: ['toda'], C: FirstClass },
    { from: ['descubra'], C: End, end: true },
  ],
};
