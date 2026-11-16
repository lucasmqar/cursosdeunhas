# Testes do site (rodam no docs/ gerado, sem internet)

Precisam do Playwright com o Chromium (`require('playwright')` precisa funcionar).
Os rastreadores (GTM, Pixel, Clarity) e a Hotmart são simulados: nada é enviado para fora.

- `node testes/ir_conversao.js [docs] [filtro]`: o /ir/ em 12 cenários de rede (rápida, 4G, 3G sem cache, bloqueador,
  hit por imagem, ponta a ponta). Mostra quando o redirecionamento sai, se o hit da conversão começou antes dele e a URL
  que chega à Hotmart (src e IDs de clique).
- `node testes/links_saida.js [docs]`: toda página do sitemap, chegando com `?src=&gclid=&fbclid=` e depois só com a
  sessão; acusa qualquer link /ir/ sem os três.
- `node testes/barra_fixa.js [docs]`: altura do botão de saída em 320 e 375 px e a barra fixa depois de rolar.
