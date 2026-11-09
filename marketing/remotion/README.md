# Vídeos v5 dos anúncios (Remotion)

Estilo: movimento de mola e uma ideia por tela (Linear), palavra-chave grande no tempo da voz (Apple),
diagramas animados (Vox) e legenda palavra a palavra com destaque que desliza (Hormozi, versão contida).
Sem tremida, flash ou efeito sonoro a cada bloco (o que deixou a versão motion "estranha").

- `tools/align.py`: tempos reais de cada palavra (Whisper), alinhados ao texto do roteiro em `../copy_final.json`.
  `uv run tools/align.py ../copy_final.json ../audio/v4 src/timing`
- `src/ads/n1.tsx` … `n4.tsx`: as cenas de cada anúncio, presas às palavras da narração.
- `node render.mjs`: renderiza os 8 vídeos em `../videos_v5/` (9:16 e 1:1).
- `node render.mjs --stills N1-9x16 2 5.5`: quadros PNG em `out/stills/` para conferir.
- `npm run studio`: abre o Remotion Studio para ajustar com pré-visualização.

Preços na tabela do N4 são só relativos (barras), sem valores, porque mudam.
