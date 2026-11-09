import { V6Def } from './engine';
import { SMOKE } from './smoke';
import { N1 } from './n1';
import { N2 } from './n2';
import { N4 } from './n4';
import { N5 } from './n5';

export const V6_ADS: V6Def[] = [N1, N2, N4, N5, SMOKE];
export const getV6 = (k: number) => V6_ADS.find((a) => a.k === k)!;
