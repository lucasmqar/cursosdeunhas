import { AdDef } from './Ad';
import { N1 } from './ads/n1';
import { N2 } from './ads/n2';
import { N4 } from './ads/n4';

// As definições têm componentes (funções), que não sobrevivem à serialização de props do Remotion:
// a composição recebe só o número do anúncio e busca a definição aqui.
export const ADS: AdDef[] = [N1, N2, N4];
export const getAd = (k: number) => ADS.find((a) => a.k === k)!;
