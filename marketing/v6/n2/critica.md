# N2 · A noite dela · autocrítica (design-critique) · 09/11/2026

Base: folhas `remotion/out/v6/folha_V6-N2-9x16.png` (24 quadros) e `folha_V6-N2-1x1.png` (12), quadros-chave avulsos, revisão da coordenação e a crítica adversarial que reescreveu o blueprint (10:12). Regras: `PADRAO-PRODUCAO-V6.md`, Livro §5, `ADAPTACAO-MARCA.md`.

## Impressão geral
O vídeo lê como edição noturna de revista: uma ideia por página (fachada → página dourada → dez unhas → a fachada de volta → cartão), o diário em Georgia é a legenda e o fio narrativo. O gancho funciona sem som: 13 quadrados acesos e um só dourado, que vão apagando no ritmo do relógio. O maior risco era o diário: na primeira versão a linha velha ficava cortada pela metade no topo e a linha nova nascia cortada embaixo. Corrigido (ver abaixo).

## Usabilidade (anúncio)
| Achado | Gravidade | O que foi feito |
|---|---|---|
| Diário: a linha mais velha aparecia cortada no topo durante a subida (q. 488, 524) e parecia erro na folha | 🔴 | A linha que passa da 3ª vaga agora sai **inteira pela própria máscara** (o texto sobe dentro da caixa da vaga do topo em 60% do tempo da subida, ease-in) e some antes de a subida terminar. Em repouso há sempre 3 linhas inteiras. |
| Diário: a palavra nova começava antes de a coluna terminar de subir e nascia cortada embaixo (q. 597 "ol…") | 🔴 | A subida agora **termina exatamente antes da 1ª palavra da linha seguinte** (12 f quando há folga, 6 f no mínimo, começando no fim da frase). A linha nova nasce parada e inteira na linha de escrita. |
| Morph setor → cápsula → unha fazia formas intermediárias estranhas ("!" e bolhas) | 🟡 | Troca do morph radial por mistura de funções suporte (soma de Minkowski): toda forma intermediária é convexa e lisa. |
| As 10 ovais acendendo uma a uma por máscara de baixo para cima e completando em "casa." repetiam a mecânica do N1 | 🔴 | Viraram **janelas-unha**: a página dourada sai pela **janela que fecha** (f372–386) e essa janela vira a 1ª unha (f393); as outras acendem pela **janela em miniatura** (folhas abrem do eixo vertical), a cada 11–12 f até "pressa," (f497). Nada se completa em "casa.". |
| Persiana de 8 lâminas usada duas vezes (cara de template) | 🟡 | Persiana só no cartão, com 4 lâminas de 480 px (15 f, atraso 3 f). A entrada das unhas é a janela que fecha. As 19 janelas de "agradecer" acendem pela janela em miniatura. |
| Mixagem: base a −9 e tiques a −6 brigavam com o gancho sussurrado (−37 dBFS RMS); a conta do pico do twang estava errada (pico real −2 dBFS) | 🔴 | Base por chaves (−22 no gancho, −9 no meio, −22/−24 no fim) e duck por trecho (−6/−3/−6); tiques a −18; catraca −20→−30; twangs a −22 e −18. |
| A base em sol# menor atravessava a gratidão e o cartão | 🟡 | A base sai sob a persiana (f696–720); o cartão fica com a voz e dois twangs (si em f689, ré# em f800) = si maior, a relativa maior. |
| Tiques por item ("Uma"/"Uma") repetiam a função dos efeitos de N3/N4 | 🟢 | Removidos: nenhum som por passo. |
| CTA: "Se der vontade, veja por onde começar." + URL em Helvetica Neue Medium 40 | 🟢 | Claro e direto, título é a própria fala (sem duplicar legenda). Fica parado ~1,9 s legível no fim. |

## Hierarquia visual
- **O olho vai primeiro** para a janela dourada no meio de 12 quadrados claros (correto: é a dela). Depois para o diário, que é o texto.
- **Leitura**: imagem no quadrado central (y 300–1210), diário embaixo à esquerda (y 1250–1490), fólio pequeno no canto (x 870, y 300). Grade de Van de Graaf assimétrica, nada centralizado por padrão.
- **Ênfase**: só três palavras em Georgia Italic dourada ("só dela", "aprender", "agradecer"); no cartão, "começar." em itálico ecoa o "aprender." do asset do N1.

## Consistência com a marca e o padrão
| Item | Situação |
|---|---|
| Fontes | Só Georgia (Regular/Italic) e Helvetica Neue Medium; `font-synthesis: none`; carregadas antes do f0 (sem fallback nos quadros). ✅ |
| Cores | Só paleta: noite, nude, dourado, ameixa profunda, cinza; reflexo das unhas por tint sólido. Sem degradê, sombra, blur, glow. ✅ |
| Movimento | Nenhuma opacidade animada: máscara (diário, URL), mini-persiana, persiana, janela que abre (inset), traço (anel, fio, borda livre), morph, página virada (único 3D). Zero overshoot (mola ζ 1,06 só no setor). Nada linear. ✅ |
| Mão vetorial | Nenhuma: a figura é janela ou a unha do símbolo. ✅ |
| Legenda | Presa ao Whisper palavra a palavra; nenhum texto grande duplica a fala (o cartão não tem diário). ✅ |
| Zona segura Reels | Tudo essencial em y 250–1500; diário termina em 1490. ✅ |
| 1:1 | Linha 1 da fachada some (sem a fresta de 30 px no topo); página a 0,9 e sobe 30 px para respirar; fólio a y 480. Fólio e diário cabem no quadrado com margem (~55 px embaixo). ✅ |

## Acessibilidade
- Contraste: nude sobre noite 15,6:1 · dourado sobre noite 7,7:1 · noite sobre dourado 7,7:1 · cinza (fólio) sobre noite 5,3:1. ✅
- Janela/unha apagada (ameixa profunda sobre noite) tem 1,1:1 de propósito (prédio apagado); não carrega informação sozinha: o que conta é o que acende. 🟢
- Diário em Georgia 62/80 (≈ 22 pt num celular de 390 pt), 3 linhas por vez, legível para 45–65+. ✅

## O que funciona
- Gancho subtrativo e silencioso num feed aditivo e barulhento; a resposta ("a dela sobra") chega em 3,2 s.
- O relógio que anda sozinho (23:00 → 23:07 → 23:20 → 23:58 → rebobina → 00:00) conta o tempo sem texto grande.
- A janela dela fecha e vira a primeira unha: o mesmo vocabulário de janela conta "uma aula de cada vez" (as outras acendem como janelas, em passo de relógio).
- Som segue a fala: base escura e baixa sob o sussurro, sobe com a janela, vazios do arquivo em "descansar" e "olhar pra trás", sai antes do cartão; primeiro som claro (twang) só no vão depois de "noite.", e o si maior fecha em "00:00".

## Som medido no MP4 (voz alinhada por correlação e subtraída)
- **Achado:** a voz (`n2.mp3`) e os efeitos são mono e entram na mixagem estéreo a −3 dB (lei de pan, ganho medido 0,70); a base (`n2_base.mp3`) é estéreo e entra inteira. Com as chaves do blueprint, a base ficava 3 dB mais alta que o planejado: no gancho, só 6,8 dB abaixo do sussurro. **Correção:** chaves da base −3 dB (`PAN` em `n2.tsx`). Isso vale para os outros vídeos com leito estéreo (N1 beat1, N4 beat2): as margens dos blueprints estão 3 dB otimistas.
- Medição final (`videos_v6/n2_9x16.mp4`, voz alinhada e subtraída; dBFS RMS):

| Trecho | Voz | Leito sob a voz | Leito nas pausas | Voz acima do leito |
|---|---|---|---|---|
| gancho f0–104 (sussurro) | −40,3 | −49,0 | −46,0 | 8,7 dB |
| janela f105–152 | −23,7 | −42,2 | −42,0 | 18,6 dB |
| meio f152–372 | −22,9 | −37,8 | −39,9 | 14,9 dB |
| janelas-unha f372–563 | −22,6 | −37,1 | −36,6 | 14,5 dB |
| olhar pra trás f563–641 | −26,8 | −50,9 | −43,6 | 24,0 dB |
| agradecer f642–696 | −39,5 | −53,2 | −41,2 | 13,7 dB |
| cartão f696–868 | −23,1 | (sem leito) | −48,6 | 39,3 dB |

Picos: tiques do gancho −23,3 dBFS; catraca −25,2 → −35,3; twang f689 −23,4; twang f800 −20,7. A voz domina em todos os trechos. Mix total −25,3 dBFS RMS, pico −5,9: o vídeo é baixo para o Reels; se os 4 forem normalizados juntos (loudnorm do ffmpeg do Remotion, ~−14 LUFS), as relações acima se mantêm.

## Desvio consciente do blueprint
- As janelas-unha usam o **contorno da unha do símbolo** (120×170), não retângulos de canto vivo: `ADAPTACAO-MARCA.md` §Forma manda usar a unha da marca, e a janela de 150×150 que "vira unha" fica literal. A mecânica nova (janela que fecha, janela em miniatura, nada completa em "casa.") foi mantida. Trocar para retângulos é uma linha (`JU_POLY`).

## Pendências / riscos aceitos
1. Durante a subida de 6 f (linhas com fala colada, ex. "dia"→"que") a coluna mexe enquanto a última palavra ainda se revela. É movimento, não fica parado; aceito.
2. Nas persianas aparecem pedaços da página anterior entre as lâminas (é a mecânica da persiana).
3. Ouvir no fone: nível do tique a 0,5× e do twang a −8 st (medidos abaixo no relatório, mas o ajuste final é de ouvido).
