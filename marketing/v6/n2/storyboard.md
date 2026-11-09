# N2 · A noite dela · storyboard v6 (marca)

09/11/2026 (refeito sobre o blueprint reescrito às 10:12). Fonte: `blueprint.md`/`.json` (acima do Livro) + Livro §5, com fontes e cores de `../ADAPTACAO-MARCA.md`. Código: `remotion/src/v6/n2.tsx`. 30 fps, **868 f = 28,93 s**. Quadros absolutos, LEAD 0,45 s incluído.

**Marca.** Fundo noite #24101C · texto nude #F6EDE8 · acento exclusivo **dourado #C9A27E** (a janela dela, a página, as unhas acesas, o cursor) · ameixa profunda #3E1028 = janela/unha apagada · cinza #9C8590 = fólio sobre a noite. Diário e título em **Georgia** (Regular 62/80; Italic nas palavras-chave "só dela", "aprender", "agradecer" e em "começar."); fólio-relógio e URL em **Helvetica Neue Medium** (34 tabular / 40). Sem mão desenhada: a figura é janela ou unha do símbolo. As "janelas-unha" do blueprint usam o contorno da unha do símbolo (120×170), não retângulos, por `ADAPTACAO-MARCA.md` §Forma.

**Grade.** Cânone de Van de Graaf: bloco x 120–840, y 250–1493. Fachada 4 × 5 janelas de 150 (calha 40) em x 120–840, y 300–1210; a dela é c2l3 (x 310–460, y 680–830). Fólio em x 870, linha de base y 300. Diário: coluna x 120, linha de escrita com base em y 1470, 3 linhas visíveis em y 1250–1490 (recorte duro). 1:1: a linha 1 da fachada some, a página vai a 0,9 e sobe 30 px (respiro), o fólio desce para y 480.

**Câmera.** Tripé, sem zoom nem rotação. Deriva de +19 px por página (inOut sine) só na ilustração. Física crítica, zero overshoot. Entrada 24 f, saída 14 f.

| Cena (página) | Quadros | Dur. | Na tela | Movimento | Transição de entrada |
|---|---|---|---|---|---|
| P1 · fachada (gancho) | 0–99 (+24 sob a P2) | 100 | 13 janelas acesas (12 nude + a dela dourada); fólio 23:00; cursor parado; "Onze da noite." / "A casa dorme." | a cada tique (f0/30/60/90) 3 janelas apagam por mini-persiana (5 f), de fora para dentro; em f95 só a dela | — |
| P2 · página dourada | 100–371 | 272 | fólio 23:07; anel-dia (f128–152); setor 23h→24h em "pedaço" (f152) que cresce em "só" (f186, mola ζ 1,06); vira cápsula deitada em "descansar." (f263); vira a unha do símbolo 300×420 em "aprender" (f329); borda livre dourada em "unhas." (f350) | morph por função suporte (sempre convexo); anel recolhe em 14 f | **janela que abre**: a janela dela vira o quadro (inset, 24 f, bezier .76,0,.24,1); a cor do diário troca na borda |
| P3 · as dez janelas-unha | 372–562 | 191 | **janela que fecha** (f372–386): a página dourada recolhe por cima até uma janela de 150×150 (x 120–270, y 600–750) e a noite aparece em volta; em f393 essa janela vira a 1ª unha (5 f); as outras 9 acendem pela **janela em miniatura** (folhas abrem do eixo vertical, 5 f) em f405, 416, 428, 439, 451, 462, 474, 485 e f497 ("pressa,"); fileira completa parada f502–563 | nada se completa em "casa." (é do N1); sem som por passo | corte (a página dourada que fecha é desenhada por cima) |
| P4 · olhar pra trás | 563–695 (+24 sob a P5) | 133 | a página das unhas vira para trás (f563–585) e revela a fachada apagada, só a dela acesa; fólio 23:58 rebobina até 23:00 (8 degraus de 4 f, f602–630); em "agradecer" (f642) as 19 janelas acendem **pela janela em miniatura**, em anéis a partir da dela | rotateY 0→−180° com dobradiça na borda direita, perspectiva 1800 (o único 3D do conjunto); diário recomeça vazio | corte (a página que vira é desenhada por cima) |
| P5 · cartão | 696–867 | 172 | "Se der vontade, / veja por onde / *começar.*" composto ao vivo em Georgia 92 (f704–776); fio 1,5 px (f776); "cursosdeunhas.com.br/comecar" (f780); fólio 23:59 → 00:00 (f800) | cursor recolhe em f776; bloco deriva 19 px | **persiana** dourada, a única do filme: 4 lâminas de 480 px, 15 f cada, atraso 3 f |

Soma: 100 + 272 + 191 + 133 + 172 = **868 f**.

**Legenda = diário.** Cada palavra nasce no seu `s` do Whisper por máscara esquerda→direita em min(duração, 8 f); o cursor (4 × 56, sem piscar) acompanha a borda. No fim de cada frase a coluna sobe 80 px e o cursor volta a x 120 no mesmo movimento; a subida **termina antes da 1ª palavra da linha seguinte** (12 f quando há folga, 6 f no mínimo), então a linha nova nasce parada e inteira. São 3 vagas; a linha que passa da vaga do topo **sai inteira pela própria máscara** (sobe dentro da caixa, 60% do tempo da subida) e nunca fica parada cortada. No cartão não há diário: o título é a fala.

**Som** (só cópias intactas, tom/andamento pelas props; níveis medidos na voz real — gancho sussurrado a −37 dBFS RMS, meio −21, "agradecer… noite." −36/−43):
- Base (sol# menor), f0–720, chaves: −22 (gancho, duck −6) → sobe a −9 com a janela (f105–124, duck −3) → desce a −22 em f580–600 → −24 em "agradecer" (duck −6) → sai sob a persiana (f696–720). O menor não atravessa a gratidão nem o cartão.
- Tique a 0,5× em f0/30/60/90 (−18) e catraca de 8 tiques em f602–630 (−20 → −30). Nenhum som por passo nas janelas-unha.
- Twang a 0,63× (−8 st, si) no vão depois de "noite." (f689, −22) e twang a 0,7937× (−4 st, ré#) em "00:00" (f800, −18): si maior, a relativa maior. Nada claro antes de f689.
