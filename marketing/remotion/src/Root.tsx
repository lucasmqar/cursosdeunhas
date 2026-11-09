import React from 'react';
import { Composition } from 'remotion';
import { Ad, totalFrames } from './Ad';
import { ADS, getAd } from './registry';
import { FPS } from './theme';
import { V6Ad, defFrames } from './v6/engine';
import { V6_ADS, getV6 } from './v6/registry';

const FORMATS = [
  { id: '9x16', w: 1080, h: 1920 },
  { id: '1x1', w: 1080, h: 1080 },
];

const AdByK: React.FC<{ k: number }> = ({ k }) => <Ad def={getAd(k)} />;
const V6ByK: React.FC<{ k: number }> = ({ k }) => <V6Ad def={getV6(k)} />;

export const Root: React.FC = () => (
  <>
    {V6_ADS.flatMap((def) =>
      FORMATS.map((f) => (
        <Composition key={`V6-N${def.k}-${f.id}`} id={`V6-N${def.k}-${f.id}`} component={V6ByK} defaultProps={{ k: def.k }}
          durationInFrames={defFrames(def)} fps={FPS} width={f.w} height={f.h} />
      )),
    )}
    {ADS.flatMap((def) =>
      FORMATS.map((f) => (
        <Composition key={`N${def.k}-${f.id}`} id={`N${def.k}-${f.id}`} component={AdByK} defaultProps={{ k: def.k }}
          durationInFrames={totalFrames(def.timing)} fps={FPS} width={f.w} height={f.h} />
      )),
    )}
  </>
);
