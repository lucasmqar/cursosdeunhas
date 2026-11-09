# N4 · Medir com calma · storyboard v6 (blueprint rev. 2 + marca + leitura no celular)

862 quadros (28,73 s) a 30 fps · 1080×1920, com o 1:1 como recorte puro do quadrado y 420–1500 · voz `audio/n4.mp3` em f14 · implementação em `remotion/src/v6/n4.tsx`.
Base: `blueprint.md/json` (revisão 2, 10:19) com cores e fontes de `../ADAPTACAO-MARCA.md`, que vence o blueprint nesses dois pontos.

**Cor**
- Fundo nude2 #EFE1DA e tipo tinta #3B2430 (11:1).
- Cinza-régua #846D78 (3,7:1) para palavras ainda não ditas e números.
- Fios de 2 px em #8D7682 (3,3:1); cabeças e arquivo em tinta de 3 px.
- Acento ameixa profunda #3E1028, só na família do cursor (cursor de 5 px, campo apontado, régua medida, bloco do t2, check).

**Fonte**
- Helvetica Neue Medium: legenda 56, rótulos 46, linha do cartão 56, URL 48.
- HN Condensed Bold (números 46, $ 96) e Condensed Black ("2 min" 260), via `local()`.
- Georgia Italic: "?" a 220 e nota a 40.

**Grade (revisão de leitura, 11:26)**
- Módulo de linha 140 (era 120); cabeçalho 270; tabela com 830 px de altura; faixa da legenda com 140 px.
- No 1:1, centrada no quadrado: cabeçalho em y 475, legenda em 1305–1445.
- No 9:16, o sistema sobe 175 px: cabeçalho em y 300 e legenda em y 1130–1270, longe da faixa do N1 (~1290–1380). O cartão sobe 100 px.
- As unhas ○◐● ficam 1,45× maiores (148×232), sob a seta "do zero → alongamento". Barras de 24 px e quadrados de 64.
- c04 virou uma régua grossa (barra de 56 px com marcas). O cursor de 5 px mede de x 64 até o centro, e o trecho medido enche de ameixa profunda.

**Sem mãos**: a figura é só a unha do símbolo.

As faixas de y da tabela abaixo seguem o blueprint (módulo 120). Os valores reais estão na seção "Grade".

| Cena | Quadros | Âncora | Na tela | Movimento | Câmera |
|---|---|---|---|---|---|
| c01 gancho | 0–82 (83) | f0 / "Antes" f14 | Na f0: o fim de outra ficha (07–08) no alto, os três "?" Georgia Italic em tinta já na janela, a linha 01 e G1 com "Antes" em tinta | A faixa sobe 360 px em 14 f, bezier(0.5,1,0.89,1), passo máx. ~50 px/f, e para seca em "Antes" (clique). O cursor se desenha na calha x 298 (f20–28) e o campo 1 acende em bloco. Salta para o campo 2 em "curso" (f47–55). | Deriva +12 px em x, f14–145 |
| c02 problema | 83–145 (63) | "ela" f83 | A mesma ficha, com G3 | O cursor salta para o campo 3 (f83–91) e volta ao zero (x 48) em "simples:" (f110–120). Os três "?" apagam. Silêncio com o rumor subindo. | Mesma deriva |
| c03 caminho | 146–318 (173) | "comparou." f146 | t1: o fio de arquivo se desenha sobre o topo da ficha (f146–154). A ficha inteira sobe 6 módulos como um bloco (f154–170), com a ficha de método presa por baixo. Depois, os 4 critérios são arquivados. | Arquivo ×4: o fio tinta se desenha sobre a legenda (8 f) e a linha sobe 120 px (10 f). Fio em f183/227/263/301, empurrão em f191/235/271/309. A palavra dita só escurece, sem célula. | Nenhuma: o arquivo é o movimento |
| t2 | 319–340 | "Porque" f319 | O cursor se alarga até x 290 (bloco ameixa profunda, 10 f) e o painel nude2 entra da direita (f329–341) | bezier(0.7,0,0.3,1) e (0.83,0,0.17,1) | — |
| c04 calma | 341–414 | "boa" f341 → "calma." f387 | Papel e um fio tinta em y 960. O cursor desliza até o centro, e o trecho medido vira uma barra de 12 px. | 46 f, bezier(0.45,0,0.55,1), parada seca | Deriva +12 px |
| c05 prova | 415–639 (225) | "A gente" f415 | t3: a varredura do cursor revela a tabela: Conteúdo / Preço / Garantia (40 px), régua, unhas ○◐● em "três", seta de "zero" a "alongamento,", barras 1/3, 2/3 e 3/3 em "ensina,", $ / $$ / $$$ em "preço", três quadrados iguais em "garantia" e o encaixe em "lado" | Máscaras de 6–8 f com atraso de 3 f | Deriva +12 px |
| c06 respiro | 640–707 (68) | "Sem" f640 | t4: os caminhos recolhem por baixo do vizinho (8/8/7 f) e sobra a coluna de rótulos. Leito a −40 dB. | Overshoot 0 | Deriva +12 px |
| c07 cartão | 708–861 (154) | "Leva" f708 | t5: a página sobe e a ficha completa vem por baixo, com a URL impressa como última linha da tabela. O cursor passa (f720–732) e deixa "2 min" glifo a glifo. "qual caminho é o seu" escurece palavra a palavra. O check ameixa profunda entra em f785, depois de "seu.", e a nota Georgia Italic 40 em f800. **Sem saída em loop: a URL fica até o último quadro.** | — | Deriva +12 px, f720–861 |

Soma: 83 + 63 + 173 + 96 + 225 + 68 + 154 = **862 f**.

**Som** (só arquivos existentes, via props do `<Audio>`):
- riser a 0,41 de f0 a f145, com corte seco em "comparou.";
- gesto 1 da interface em f14, 177, 213, 255 e 291;
- beat2 a 0,5 a partir de f173, com chaves: entra em −18, −22 em "calma.", −40 em "Sem pressa", −14 no cartão e −60 no fim; duck −3;
- gesto 2 da interface em f785, a −26 dB, junto com o check.
