import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, LEAD, SPRING_UI, TAIL, Timing, sec } from './theme';
import { AdCtx, SceneProps, findWord, wordFrame } from './core';
import { Captions } from './Captions';

export type SceneDef = {
  /** palavra que abre a cena: índice ou [palavra, ocorrência] */
  from: number | [string, number?];
  C: React.FC<SceneProps>;
  /** som de transição suave ao entrar */
  whoosh?: boolean;
  /** cena final: esconde a legenda (o título já diz a frase) */
  end?: boolean;
};

export type AdDef = { k: number; timing: Timing; dark: boolean; keywords: string[]; scenes: SceneDef[] };

const OVER = 8; // quadros de sobreposição entre cenas

export const totalFrames = (t: Timing) => sec(LEAD + t.duration + TAIL);

export const Ad: React.FC<{ def: AdDef }> = ({ def }) => {
  const { width: W, height: H } = useVideoConfig();
  const sq = W === H;
  const t = def.timing;
  const total = totalFrames(t);
  const idx = (f: SceneDef['from']) => (typeof f === 'number' ? f : findWord(t, f[0], f[1] ?? 1));
  const starts = def.scenes.map((s, i) => (i === 0 ? 0 : wordFrame(t, idx(s.from)) - 4));
  const endScene = def.scenes.findIndex((s) => s.end);
  const endFrom = endScene >= 0 ? starts[endScene] : total;

  return (
    <AdCtx.Provider value={{ sq, dark: def.dark, timing: t, keywords: new Set(def.keywords) }}>
      <AbsoluteFill style={{ background: def.dark ? C.night : C.bg, overflow: 'hidden' }}>
        <Background dark={def.dark} />
        {def.scenes.map((s, i) => {
          const from = starts[i];
          const last = i === def.scenes.length - 1;
          const dur = (last ? total : starts[i + 1] + OVER) - from;
          const props: SceneProps = {
            at: (w) => wordFrame(t, w) - from,
            atw: (w, n) => wordFrame(t, findWord(t, w, n)) - from,
            dur,
          };
          return (
            <Sequence key={i} from={from} durationInFrames={dur} layout="none">
              <Shell dur={dur} exit={!last} first={i === 0}>
                <s.C {...props} />
              </Shell>
            </Sequence>
          );
        })}
        <Captions hideFrom={endFrom} />

        {/* áudio: voz, trilha que abaixa sob a voz, poucos efeitos */}
        <Sequence from={sec(LEAD)} layout="none">
          <Audio src={staticFile(`audio/n${def.k}.mp3`)} volume={1} />
        </Sequence>
        <Audio src={staticFile('audio/musica.mp3')} volume={(f) => musicVol(f, total, endFrom)} />
        {def.scenes.map((s, i) =>
          s.whoosh && i > 0 ? (
            <Sequence key={`w${i}`} from={Math.max(0, starts[i] - 6)} durationInFrames={sec(1)} layout="none">
              <Audio src={staticFile('audio/whoosh.mp3')} volume={0.22} />
            </Sequence>
          ) : null,
        )}
        {endScene >= 0 && (
          <Sequence from={endFrom + 10} durationInFrames={sec(1.5)} layout="none">
            <Audio src={staticFile('audio/sparkle.mp3')} volume={0.3} />
          </Sequence>
        )}
      </AbsoluteFill>
    </AdCtx.Provider>
  );
};

const musicVol = (f: number, total: number, endFrom: number) => {
  const v = sec(LEAD);
  if (f < v) return interpolate(f, [0, v], [0.0, 0.32]);
  if (f < endFrom) return interpolate(f, [v, v + 12], [0.32, 0.11], { extrapolateRight: 'clamp' });
  if (f < total - sec(1.2)) return interpolate(f, [endFrom, endFrom + 20], [0.11, 0.3], { extrapolateRight: 'clamp' });
  return interpolate(f, [total - sec(1.2), total], [0.3, 0], { extrapolateRight: 'clamp' });
};

/** Entrada com mola e saída curta: cada cena sobe levemente e some sem corte seco. */
const Shell: React.FC<{ dur: number; exit: boolean; first: boolean; children: React.ReactNode }> = ({ dur, exit, first, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = first ? 1 : spring({ frame, fps, config: SPRING_UI });
  const x = exit ? interpolate(frame, [dur - OVER, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, e * 1.3) * (1 - x), transform: `translateY(${(1 - e) * 36 - x * 24}px) scale(${0.985 + 0.015 * e})` }}>
      {children}
    </AbsoluteFill>
  );
};

/** Fundo calmo: manchas suaves que derivam devagar (claro) ou céu com estrelas (noite). */
const Background: React.FC<{ dark: boolean }> = ({ dark }) => {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const t = frame / 30;
  if (dark) {
    return (
      <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 50% 30%, #4A1834 0%, ${C.night} 70%)` }}>
        <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
          {Array.from({ length: 46 }).map((_, i) => {
            const rx = frac(Math.sin(i * 12.9898) * 43758.5453), ry = frac(Math.sin(i * 78.233) * 12543.21);
            const tw = 0.35 + 0.35 * Math.sin(t * (0.8 + rx) + i);
            return <circle key={i} cx={rx * W} cy={ry * H * 0.9} r={(1 + 2.2 * frac(rx * 7)) * (W / 1080)} fill={C.bg} opacity={tw} />;
          })}
        </svg>
      </AbsoluteFill>
    );
  }
  const blobs = [
    { c: 'rgba(217,155,168,0.30)', ph: 0 },
    { c: 'rgba(201,162,126,0.22)', ph: 2.1 },
    { c: 'rgba(110,31,69,0.07)', ph: 4.2 },
  ];
  return (
    <AbsoluteFill>
      {blobs.map((b, i) => {
        const x = W * (0.5 + 0.32 * Math.sin(t * 0.22 + b.ph)), y = H * (0.45 + 0.28 * Math.cos(t * 0.18 + b.ph)), r = W * 0.75;
        return <div key={i} style={{ position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: '50%',
          background: `radial-gradient(circle, ${b.c} 0%, rgba(246,237,232,0) 70%)` }} />;
      })}
    </AbsoluteFill>
  );
};
const frac = (x: number) => Math.abs(x - Math.trunc(x));
