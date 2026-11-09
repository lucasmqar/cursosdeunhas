// Identidade e tempos compartilhados por todos os anúncios.
export const C = {
  bg: '#F6EDE8',
  bg2: '#EFE1DA',
  plum: '#6E1F45',
  plumDeep: '#3E1028',
  night: '#24101C',
  rose: '#D99BA8',
  gold: '#C9A27E',
  ink: '#3B2430',
  muted: '#9C8590',
  white: '#FFFFFF',
  fan: ['#D99BA8', '#C77D92', '#A24E6F', '#86325A', '#6E1F45'],
};

export const SERIF = "Georgia, 'Times New Roman', serif";
export const SANS = "'Avenir Next', 'Helvetica Neue', Arial, sans-serif";

export const FPS = 30;
export const LEAD = 0.45; // segundos de respiro antes da voz
export const TAIL = 2.6; // segundos de cartão final depois da voz

// Molas no estilo "UI physics": rápidas, sem quicar demais.
export const SPRING_UI = { damping: 18, stiffness: 140, mass: 0.7 };
export const SPRING_SOFT = { damping: 26, stiffness: 90, mass: 1 };
export const SPRING_POP = { damping: 12, stiffness: 160, mass: 0.6 };

export type Word = { w: string; s: number; e: number };
export type Timing = { duration: number; words: Word[] };

export const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9-]/g, '');

export const sec = (s: number) => Math.round(s * FPS);
