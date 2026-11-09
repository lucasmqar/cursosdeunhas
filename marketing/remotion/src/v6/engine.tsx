// v6 · motor de assinaturas. Regras do Lucas: cores sólidas, nenhuma opacidade animada,
// entradas/saídas por máscara, corte, deslocamento, escala, traço ou divisão; som segue a emoção da fala.
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AbsoluteFill, Audio, Easing, Sequence, continueRender, delayRender, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig,
} from 'remotion';
import { Timing, norm } from '../theme';

export const FPS = 30;
export const LEAD = 0.45; // respiro antes da voz (igual ao v5: os tempos do Whisper partem daqui)
export const TAIL = 2.6;
export const W = 1080;
export const H = 1920;
/** zona que a interface do Reels cobre no 9:16 */
export const SAFE = { top: 250, bottom: 420, side: 72 };
/** quadrado central que sobrevive ao corte 1:1 (y de 420 a 1500 no 9:16) */
export const SQ = { top: (H - W) / 2, bottom: (H + W) / 2 };

export const sec = (s: number) => Math.round(s * FPS);
export const totalFrames = (t: Timing) => sec(LEAD + t.duration + TAIL);

// ---------- curvas ----------
export const EASE = {
  entra: Easing.bezier(0.16, 1, 0.3, 1),
  sai: Easing.bezier(0.7, 0, 0.84, 0),
  troca: Easing.bezier(0.76, 0, 0.24, 1),
  suave: Easing.bezier(0.4, 0.14, 0.3, 1),
};
/** ζ≈0,7: passa ~4–5% do alvo (teto do Lucas: 6%) */
export const MOLA = {
  pico: { mass: 1, stiffness: 170, damping: 18.3 },
  firme: { mass: 1, stiffness: 220, damping: 30 },
  lenta: { mass: 1.2, stiffness: 90, damping: 21 },
};

export const prog = (f: number, from: number, dur: number, ease = EASE.entra) =>
  interpolate(f, [from, from + Math.max(1, dur)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
export const mola = (f: number, from: number, cfg = MOLA.pico) =>
  spring({ frame: f - from, fps: FPS, config: cfg });
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;

// ---------- tempo da fala ----------
export const wordAt = (t: Timing, i: number) => t.words[Math.max(0, Math.min(i, t.words.length - 1))];
/** quadro absoluto em que a palavra i começa / termina */
export const wf = (t: Timing, i: number) => sec(LEAD + wordAt(t, i).s);
export const wfe = (t: Timing, i: number) => sec(LEAD + wordAt(t, i).e);
/** índice da n-ésima ocorrência da palavra (sem acento/pontuação) */
export const findWord = (t: Timing, word: string, nth = 1) => {
  const target = norm(word);
  let seen = 0;
  for (let i = 0; i < t.words.length; i++) if (norm(t.words[i].w) === target && ++seen === nth) return i;
  throw new Error(`palavra não encontrada: ${word} (#${nth})`);
};
export type Anchor = number | [string, number?];
export const anchorIdx = (t: Timing, a: Anchor) => (typeof a === 'number' ? a : findWord(t, a[0], a[1] ?? 1));

/** trechos de fala contínua (para abaixar a trilha só quando há voz) */
export const speech = (t: Timing, gap = 0.35) => {
  const seg: [number, number][] = [];
  for (const w of t.words) {
    const s = LEAD + w.s, e = LEAD + w.e;
    if (seg.length && s - seg[seg.length - 1][1] < gap) seg[seg.length - 1][1] = e;
    else seg.push([s, e]);
  }
  return seg;
};

// ---------- contexto ----------
export type V6Info = { k: number; t: Timing; sq: boolean; from: number };
const Ctx = createContext<V6Info>(null as unknown as V6Info);
export const useV6 = () => useContext(Ctx);
/** quadro local da palavra (dentro da cena atual) */
export const useAt = () => {
  const { t, from } = useV6();
  return {
    at: (a: Anchor) => wf(t, anchorIdx(t, a)) - from,
    end: (a: Anchor) => wfe(t, anchorIdx(t, a)) - from,
  };
};

// ---------- fontes do sistema (fonte de reserva é bug) ----------
export const useSystemFonts = (specs: string[]) => {
  const [handle] = useState(() => delayRender(`fontes v6: ${specs.join(', ')}`));
  useEffect(() => {
    Promise.all(specs.map((s) => document.fonts.load(s)))
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle, specs]);
};

// ---------- texto por máscara ----------
/** Linha que nasce por baixo da própria máscara e sai para cima (nunca por opacidade). */
export const MaskLine: React.FC<{
  inAt: number; outAt?: number; dur?: number; outDur?: number; from?: 'below' | 'above' | 'left' | 'right';
  style?: React.CSSProperties; children: React.ReactNode;
}> = ({ inAt, outAt, dur = 14, outDur, from = 'below', style, children }) => {
  const f = useCurrentFrame();
  const p = prog(f, inAt, dur);
  const q = outAt === undefined ? 0 : prog(f, outAt, outDur ?? Math.round(dur * 0.6), EASE.sai);
  const axis = from === 'left' || from === 'right' ? 'X' : 'Y';
  const sign = from === 'below' || from === 'right' ? 1 : -1;
  const off = sign * 108 * (1 - p) - sign * 108 * q;
  return (
    <div style={{ overflow: 'hidden', ...style }}>
      <div style={{ transform: `translate${axis}(${off}%)` }}>{children}</div>
    </div>
  );
};

/** Traço SVG que se desenha (dashoffset) e recolhe na saída. */
export const Stroke: React.FC<{ d: string; at: number; dur?: number; outAt?: number; color: string; width: number; cap?: 'round' | 'butt' | 'square' }> = ({
  d, at, dur = 16, outAt, color, width, cap = 'round',
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur, EASE.troca);
  const q = outAt === undefined ? 0 : prog(f, outAt, Math.round(dur * 0.6), EASE.sai);
  return <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={width} strokeLinecap={cap}
    strokeDasharray="1 1" strokeDashoffset={1 - p + q} />;
};

// ---------- transições (só geometria) ----------
/** Recebe o progresso 0..1 e devolve o estilo da cena que ENTRA (e, opcionalmente, da que sai). */
export type Transition = { dur: number; ease?: (x: number) => number; inStyle: (p: number) => React.CSSProperties; outStyle?: (p: number) => React.CSSProperties };

export const T = {
  cut: (): Transition => ({ dur: 1, inStyle: () => ({}) }),
  wipe: (dir: 'up' | 'down' | 'left' | 'right', dur = 14, ease = EASE.troca): Transition => ({
    dur, ease,
    inStyle: (p) => {
      const r = (1 - p) * 100;
      const inset = { up: `${r}% 0 0 0`, down: `0 0 ${r}% 0`, left: `0 0 0 ${r}%`, right: `0 ${r}% 0 0` }[dir];
      return { clipPath: `inset(${inset})` };
    },
  }),
  /** abertura em forma (círculo/elipse) a partir de um ponto */
  iris: (cx: number, cy: number, rx: number, ry = rx, dur = 16, ease = EASE.entra): Transition => ({
    dur, ease, inStyle: (p) => ({ clipPath: `ellipse(${rx * p}px ${ry * p}px at ${cx}px ${cy}px)` }),
  }),
  /** n faixas que abrem em sequência (stagger), como colunas de página */
  slats: (n: number, axis: 'x' | 'y', dur = 18, stagger = 2, ease = EASE.troca): Transition => ({
    dur: dur + stagger * (n - 1), ease: (x) => x,
    // clip-path aceita uma forma só: as faixas viram um polígono único em zigue-zague
    inStyle: (p) => ({ clipPath: slatPolygon(n, axis, p, dur + stagger * (n - 1), stagger, dur, ease) }),
  }),
  /** empurra: a que sai desliza junto com a que entra */
  push: (dir: 'up' | 'down' | 'left' | 'right', dur = 16, ease = EASE.troca): Transition => {
    const v = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[dir];
    return {
      dur, ease,
      inStyle: (p) => ({ transform: `translate(${-v[0] * (1 - p) * 100}%, ${-v[1] * (1 - p) * 100}%)` }),
      outStyle: (p) => ({ transform: `translate(${v[0] * p * 100}%, ${v[1] * p * 100}%)` }),
    };
  },
};

const slatPolygon = (n: number, axis: 'x' | 'y', p: number, total: number, stagger: number, dur: number, ease: (x: number) => number) => {
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const local = ease(Math.min(1, Math.max(0, (p * total - i * stagger) / dur)));
    const a = (i / n) * 100, b = ((i + 1) / n) * 100, f = local * 100;
    if (axis === 'y') pts.push(`${a}% 0`, `${a}% ${f}%`, `${b}% ${f}%`, `${b}% 0`);
    else pts.push(`0 ${a}%`, `${f}% ${a}%`, `${f}% ${b}%`, `0 ${b}%`);
  }
  return `polygon(${pts.join(', ')})`;
};

// ---------- áudio ----------
/** chaves de ganho [quadro absoluto, dB]; interpolação linear em dB entre chaves, constante fora delas */
export type GainKeys = [number, number][];
export type Track = {
  src: string; from: number; to: number; db: number; duckDb?: number; attackF?: number; releaseF?: number;
  /** @deprecated use trimBefore (quadros do arquivo a 30 fps) */
  startFromS?: number;
  trimBefore?: number;
  /** tom e andamento juntos (asetrate): 0,5 = uma oitava abaixo e metade do andamento */
  rate?: number;
  /** rampa de entrada/saída do envelope (quadros); 0 = corte seco */
  rampIn?: number; rampOut?: number;
  /** curva de ganho por chaves; quando existe, substitui db + rampas */
  keys?: GainKeys;
};
export type Sfx = { src: string; at: number; db: number; durS?: number; dur?: number; trimBefore?: number; rate?: number; keys?: GainKeys };
const lin = (db: number) => Math.pow(10, db / 20);
export const gainAt = (keys: GainKeys, f: number) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [f1, d1] = keys[i];
    if (f <= f1) {
      const [f0, d0] = keys[i - 1];
      return f1 === f0 ? d1 : d0 + ((d1 - d0) * (f - f0)) / (f1 - f0);
    }
  }
  return keys[keys.length - 1][1];
};

const TrackAudio: React.FC<{ tr: Track; seg: [number, number][]; total: number }> = ({ tr, seg, total }) => {
  const a = tr.attackF ?? 6, r = tr.releaseF ?? 10;
  const from = Math.max(0, tr.from), to = Math.min(total, tr.to);
  const ri = tr.rampIn ?? 12, ro = tr.rampOut ?? 18;
  const vol = (lf: number) => {
    const f = from + lf;
    // envelope da própria trilha (rampa de volume é permitida; a regra de "sem fade" é visual)
    const env = tr.keys ? 1 : Math.min(1, ri ? (f - from) / ri : 1, ro ? (to - f) / ro : 1);
    let duck = 0;
    if (tr.duckDb) {
      for (const [s0, e0] of seg) {
        const s = sec(s0), e = sec(e0);
        if (f >= s - a && f <= e + r) {
          const d = f < s ? (f - (s - a)) / a : f > e ? 1 - (f - e) / r : 1;
          duck = Math.max(duck, Math.min(1, Math.max(0, d)));
        }
      }
    }
    const base = tr.keys ? gainAt(tr.keys, f) : tr.db;
    if (base <= -59.5) return 0;
    return Math.max(0, env) * lin(base + (tr.duckDb ?? 0) * duck);
  };
  const trim = tr.trimBefore ?? (tr.startFromS ? sec(tr.startFromS) : undefined);
  return (
    <Sequence from={from} durationInFrames={Math.max(1, to - from)} layout="none">
      <Audio src={staticFile(tr.src)} volume={vol} trimBefore={trim}
        playbackRate={tr.rate ?? 1} preservePitch={tr.rate ? false : undefined} />
    </Sequence>
  );
};

const SfxAudio: React.FC<{ s: Sfx }> = ({ s }) => {
  const from = Math.max(0, s.at);
  const vol = (lf: number) => {
    const g = s.keys ? gainAt(s.keys, from + lf) : s.db;
    return g <= -59.5 ? 0 : lin(g);
  };
  return (
    <Sequence from={from} durationInFrames={s.dur ?? sec(s.durS ?? 2.5)} layout="none">
      <Audio src={staticFile(s.src)} volume={vol} trimBefore={s.trimBefore}
        playbackRate={s.rate ?? 1} preservePitch={s.rate ? false : undefined} />
    </Sequence>
  );
};

// ---------- definição de um anúncio ----------
export type SceneDef = {
  id: string;
  /** palavra que abre a cena (a primeira cena abre no quadro 0) */
  from: Anchor;
  /** quantos quadros a imagem adianta a voz (até 3) */
  lead?: number;
  bg: string;
  C: React.FC;
  /** como esta cena ENTRA (a anterior fica por baixo até a máscara fechar) */
  enter?: Transition;
  /** cena final: a legenda some */
  end?: boolean;
};
export type V6Def = {
  k: number;
  timing: Timing;
  fonts: string[];
  scenes: SceneDef[];
  tracks: Track[];
  sfx: Sfx[];
  Caption?: React.FC<{ hideFrom: number }>;
  /** duração total em quadros (padrão: LEAD + duração do mp3 + TAIL) */
  total?: number;
  /** quantos quadros cada cena adianta a palavra, quando a cena não diz (padrão 2) */
  lead?: number;
  /** camada por cima de tudo (ex.: elemento que atravessa cenas) */
  Over?: React.FC;
  /** narração: padrão `audio/n{k}.mp3`; false = vídeo sem voz (só tipografia + trilha) */
  voice?: string | false;
};
export const defFrames = (def: V6Def) => def.total ?? totalFrames(def.timing);

export const sceneStarts = (def: V6Def) =>
  def.scenes.map((s, i) => (i === 0 ? 0 : Math.max(1, wf(def.timing, anchorIdx(def.timing, s.from)) - (s.lead ?? def.lead ?? 2))));

/** Anúncio desenhado em 1080×1920. No 1:1 mostra o quadrado central (y 420–1500), onde fica o elemento-chave. */
export const V6Ad: React.FC<{ def: V6Def }> = ({ def }) => {
  const { width, height } = useVideoConfig();
  const sq = width === height;
  useSystemFonts(def.fonts);
  const t = def.timing;
  const total = defFrames(def);
  const starts = sceneStarts(def);
  const endIdx = def.scenes.findIndex((s) => s.end);
  const hideFrom = endIdx >= 0 ? starts[endIdx] : total;
  const seg = speech(t);

  return (
    <AbsoluteFill style={{ background: def.scenes[0].bg, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: sq ? -SQ.top : 0, width: W, height: H }}>
        {def.scenes.map((s, i) => {
          const from = starts[i];
          const next = def.scenes[i + 1];
          const nextDur = next?.enter?.dur ?? 1;
          const dur = (i === def.scenes.length - 1 ? total : starts[i + 1] + nextDur) - from;
          return (
            <Sequence key={s.id} from={from} durationInFrames={dur} layout="none">
              <SceneLayer def={def} i={i} from={from} dur={dur} nextStart={next ? starts[i + 1] - from : undefined} sq={sq} />
            </Sequence>
          );
        })}
        {def.Over ? <Ctx.Provider value={{ k: def.k, t, sq, from: 0 }}><def.Over /></Ctx.Provider> : null}
        {def.Caption ? <Ctx.Provider value={{ k: def.k, t, sq, from: 0 }}><def.Caption hideFrom={hideFrom} /></Ctx.Provider> : null}
      </div>
      {def.voice === false ? null : (
        <Sequence from={sec(LEAD)} layout="none">
          <Audio src={staticFile(def.voice ?? `audio/n${def.k}.mp3`)} volume={1} />
        </Sequence>
      )}
      {def.tracks.map((tr, i) => <TrackAudio key={`t${i}`} tr={tr} seg={seg} total={total} />)}
      {def.sfx.map((s, i) => <SfxAudio key={`s${i}`} s={s} />)}
    </AbsoluteFill>
  );
};

const SceneLayer: React.FC<{ def: V6Def; i: number; from: number; dur: number; nextStart?: number; sq: boolean }> = ({ def, i, from, dur, nextStart, sq }) => {
  const f = useCurrentFrame();
  const s = def.scenes[i];
  const enter = i === 0 ? undefined : s.enter;
  const pIn = enter ? prog(f, 0, enter.dur, enter.ease ?? EASE.troca) : 1;
  const next = def.scenes[i + 1];
  const pOut = next?.enter?.outStyle && nextStart !== undefined ? prog(f, nextStart, next.enter.dur, next.enter.ease ?? EASE.troca) : 0;
  const style: React.CSSProperties = {
    position: 'absolute', inset: 0, background: s.bg, overflow: 'hidden',
    ...(enter && pIn < 1 ? enter.inStyle(pIn) : {}),
    ...(next?.enter?.outStyle && pOut > 0 ? next.enter.outStyle(pOut) : {}),
  };
  return (
    <Ctx.Provider value={{ k: def.k, t: def.timing, sq, from }}>
      <div style={style}>
        <s.C />
      </div>
    </Ctx.Provider>
  );
};

// ---------- legenda: grupos de palavras presos à fala ----------
export type CapGroup = { i0: number; i1: number; s: number; e: number };
/** quebra a fala em grupos curtos (pontuação ou max palavras) */
export const capGroups = (t: Timing, max = 3): CapGroup[] => {
  const out: CapGroup[] = [];
  let i0 = 0;
  for (let i = 0; i < t.words.length; i++) {
    const w = t.words[i].w;
    const brk = /[.,:;!?…]$/.test(w) || i - i0 + 1 >= max || i === t.words.length - 1;
    if (brk) {
      out.push({ i0, i1: i, s: sec(LEAD + t.words[i0].s), e: sec(LEAD + t.words[i].e) });
      i0 = i + 1;
    }
  }
  return out;
};
/** grupo e palavra ativos no quadro absoluto f */
export const activeCap = (t: Timing, groups: CapGroup[], f: number) => {
  let g = -1;
  for (let j = 0; j < groups.length; j++) if (f >= groups[j].s - 2) g = j;
  if (g < 0) return null;
  const G = groups[g];
  const nextS = groups[g + 1]?.s ?? Infinity;
  if (f > G.e + 10 && f < nextS - 2) return null; // silêncio longo: sem legenda
  let w = G.i0;
  for (let i = G.i0; i <= G.i1; i++) if (f >= sec(LEAD + t.words[i].s) - 1) w = i;
  return { g, G, w };
};
