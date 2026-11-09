// v6 · render dos anúncios com assinatura. Uso:
//   node render_v6.mjs                              -> todos os V6 em ../videos_v6/
//   node render_v6.mjs V6-N1-9x16                   -> só um
//   node render_v6.mjs --stills V6-N1-9x16 0.3 1.2  -> quadros PNG (segundos) em out/v6/
//   node render_v6.mjs --frames V6-N1-9x16 0 30 88  -> quadros PNG (número do quadro) em out/v6/
//   node render_v6.mjs --sheet V6-N1-9x16 24        -> 24 quadros espaçados + folha out/v6/folha_<ID>.png
// Usa a trava com prioridade de ~/Desktop/lovit/.tools/trava.mjs (1 = Unhas, 2 = PEDE FLUX, 3 = canais): um Chrome por vez no Mac.
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { bundle } from '@remotion/bundler';
import { getCompositions, openBrowser, renderMedia, renderStill } from '@remotion/renderer';
import { travar } from '/Users/lucasmqar/Desktop/lovit/.tools/trava.mjs';

const args = process.argv.slice(2);
const mode = { '--stills': 'stills', '--frames': 'frames', '--sheet': 'sheet' }[args[0]] ?? 'video';
const ids = mode === 'video' ? args : [args[1]];
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browserExecutable = fs.existsSync(chrome) ? chrome : undefined;

const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const solta = await travar(`unhas v6 ${mode} ${ids.join(' ')}`, 1); // prioridade 1 = Cursos de Unhas (Lucas, 09/11)
// um Chrome por lote: menos tempo segurando a trava compartilhada
const browser = mode === 'video' ? undefined : await openBrowser('chrome', { browserExecutable });
const comps = (await getCompositions(serveUrl, { browserExecutable, puppeteerInstance: browser })).filter((c) => c.id.startsWith('V6-'));
const pick = ids.length ? comps.filter((c) => ids.includes(c.id)) : comps.filter((c) => !c.id.startsWith('V6-N99'));
if (!pick.length) { console.error('nenhuma composição V6 encontrada para', ids.join(' ') || '(todas)'); await browser?.close({ silent: true }); solta(); process.exit(1); }
fs.mkdirSync('out/v6', { recursive: true });
const outDir = path.resolve('../videos_v6');
fs.mkdirSync(outDir, { recursive: true });

for (const comp of pick) {
  if (mode !== 'video') {
    const n = Number(args[2] || 24);
    const frames = mode === 'frames' ? args.slice(2).map(Number)
      : mode === 'stills' ? args.slice(2).map((s) => Math.round(Number(s) * comp.fps))
      : Array.from({ length: n }, (_, i) => Math.round(((i + 0.5) / n) * comp.durationInFrames));
    const files = [];
    for (const fr of frames) {
      const frame = Math.min(comp.durationInFrames - 1, fr);
      const output = `out/v6/${comp.id}_${String(frame).padStart(4, '0')}.png`;
      await renderStill({ composition: comp, serveUrl, output, frame, browserExecutable, puppeteerInstance: browser });
      files.push(output);
      console.log('still', output, (frame / comp.fps).toFixed(2) + 's');
    }
    if (mode === 'sheet') {
      const sheet = `out/v6/folha_${comp.id}.png`;
      try { execFileSync('python3', ['tools/sheet.py', sheet, ...files]); console.log('folha', sheet); }
      catch (e) { console.error('folha falhou (pillow?)', e.message); }
    }
    continue;
  }
  const [, k, fmt] = comp.id.toLowerCase().split('-');
  const output = path.join(outDir, `${k}_${fmt}.mp4`);
  await renderMedia({ composition: comp, serveUrl, codec: 'h264', crf: 16, pixelFormat: 'yuv420p', audioBitrate: '192k', outputLocation: output, browserExecutable, concurrency: 3 });
  console.log('ok', output, (comp.durationInFrames / comp.fps).toFixed(1) + 's');
}
await browser?.close({ silent: true });
solta();
