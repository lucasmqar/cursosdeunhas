// Renderiza os anúncios. Uso:
//   node render.mjs                 -> todos os vídeos em ../videos_v5/
//   node render.mjs N1-9x16         -> só um
//   node render.mjs --stills N1-9x16 2 5.5 9   -> quadros PNG (segundos) em out/stills/ para conferência
import path from 'node:path';
import fs from 'node:fs';
import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia, renderStill } from '@remotion/renderer';

const args = process.argv.slice(2);
const stills = args[0] === '--stills';
const ids = stills ? [args[1]] : args;
// áudios vêm de ../audio (versionados lá); copia para public/ antes de empacotar
fs.mkdirSync('public/audio', { recursive: true });
for (const k of [1, 2, 3, 4]) fs.copyFileSync(`../audio/v4/n${k}.mp3`, `public/audio/n${k}.mp3`);
for (const f of ['musica', 'whoosh', 'sparkle']) fs.copyFileSync(`../audio/sfx/${f}.mp3`, `public/audio/${f}.mp3`);

const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const comps = await getCompositions(serveUrl);
const outDir = path.resolve('../videos_v5');
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync('out/stills', { recursive: true });

for (const comp of comps.filter((c) => ids.length === 0 || ids.includes(c.id))) {
  if (stills) {
    for (const s of args.slice(2).map(Number)) {
      const frame = Math.min(comp.durationInFrames - 1, Math.round(s * comp.fps));
      const output = `out/stills/${comp.id}_${String(s).replace('.', '_')}s.png`;
      await renderStill({ composition: comp, serveUrl, output, frame });
      console.log('still', output);
    }
    continue;
  }
  const [k, fmt] = comp.id.toLowerCase().split('-');
  const output = path.join(outDir, `${k}_${fmt}.mp4`);
  await renderMedia({ composition: comp, serveUrl, codec: 'h264', crf: 18, audioBitrate: '192k', outputLocation: output });
  console.log('ok', output, (comp.durationInFrames / comp.fps).toFixed(1) + 's');
}
