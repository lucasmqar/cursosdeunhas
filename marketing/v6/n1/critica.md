# N1 · A capa dela · autocrítica (design-critique) · 09/11/2026

Folhas revisadas: `remotion/out/v6/folha_V6-N1-9x16.png` (24 quadros) e `folha_V6-N1-1x1.png` (12 quadros), mais quadros-chave avulsos (f20, 160, 214, 300, 385, 420, 516, 680, 740, 870, 1040). Regras de referência: `PADRAO-PRODUCAO-V6.md`, `ADAPTACAO-MARCA.md` (Georgia + Helvetica Neue, paleta, **sem mãos**), `n1/blueprint.md` revisado às 10:19.

## Impressão geral
A peça agora parece da mesma família da imagem que converteu: fundo nude, Georgia tinta, ameixa como único acento e o leque de 5 unhas do símbolo como figura. Cada capa tem uma ideia (a unha a 52%, "cansaço.", "caminho.", I/II/III, "Hoje,", "coragem." riscada, "aprender.", o "1", o cartão). O maior risco que restou é de escala: os leques do capítulo III são pequenos para a tela do celular.

## Usabilidade (o anúncio cumpre a função?)
| Achado | Severidade | Ação |
|---|---|---|
| Primeiro quadro (macro da unha cinza com ameixa a 40→52%) é cheio e incomum no feed; o laço só fecha em f711–735 e fica completo 50 f | 🟢 ok | mantido |
| A frase que converteu é recomposta em f640–710: "coragem." riscada, "pequena:", "aprender." em Georgia Bold ameixa | 🟢 ok | mantido; o quadro f680 serve de estático para teste |
| CTA claro: "DESCUBRA / por onde / começar." + faixa ameixa com `cursosdeunhas.com.br/comecar` + "LEVA 2 MINUTOS", parado 2,5 s no fim | 🟢 ok | mantido |
| "pequena:" a 30 px era quase ilegível no celular (≈10 px reais) | 🟡 moderada | corrigido (revisão da sessão principal): 48 px, ainda bem menor que "aprender." |
| Leques do capítulo III a 0,33 (unhas de ~47×74 px) leem como guirlanda, não como três pessoas | 🟡 moderada | mantido por causa do trilho do Reels (tudo em x ≤ 930) e de não sobrepor os leques; alternativa seria empilhar, mas mudaria a grade |

## Hierarquia visual
- **O olho vai primeiro** para a manchete Georgia de cada capa, depois para a figura e por último para a legenda. Correto: a legenda é apoio e nunca repete a manchete (as palavras grandes saem da própria legenda).
- **Leitura**: manchete em cima à esquerda → figura ao centro → legenda à esquerda em y 1360. Sempre a mesma ordem, alinhada à margem de 72 px (nada centralizado, como o Livro pede para o N1).
- **Respiro**: há uma faixa vazia entre a figura (até ~y 1060) e a legenda (y 1310). Deixei assim: é a página de revista, e a faixa de baixo do Reels começa em 1500.

## Consistência
| Elemento | Achado | Ação |
|---|---|---|
| Tipografia | Só Georgia (Regular, Italic, Bold) e Helvetica Neue (Medium, Bold). Sem fonte de reserva nos quadros (Georgia e HN conferidas por inspeção dos glifos: "ç", "ã", itálico real) | ok |
| Cor | Só paleta da marca; unha limpa em branco com contorno dourado (antes: contorno sozinho lia como um cesto; corrigido) | corrigido |
| Figura | Nenhuma mão, palma ou dedo (pedido do Lucas). O leque do asset (raio 216 → 440, mesmos ângulos e cores) e o fio dourado | ok |
| Movimento | Sem opacidade animada: entradas por voo, máscara, traço, corte e guilhotina. Mola só no cabeçalho e em "aprender." (3,1%) | ok |
| Manchete pousando com o tilt | O alvo do voo não acompanhava o tilt da página e a palavra saltava até 28 px ao pousar ("coragem.") | corrigido: o alvo inclui o tilt |

## Zona segura e 1:1
- 9:16: nada essencial em y < 250 nem em y > 1500. Na faixa do trilho de ações (x > 930, y 1000–1600) não há nada: "aprender." foi a 168 px (tinta até x ≈ 905; pico da mola ≈ 930), o fio dourado termina em x 930, os leques de II/III e do cartão ficam em x ≤ 930.
- 1:1: a faixa visível é y 420–1500 e o tilt sobe a manchete 38 px; manchetes, cabeçalho, algarismos e o "1" desceram (glifo em y ≥ 480 em repouso). Antes da correção, "caminho.", "coragem." e o "1" encostavam/cortavam no topo.

## Acessibilidade
- Contraste: tinta sobre nude ≈ 12:1; nude sobre ameixa ≈ 9:1; ameixa sobre nude ≈ 9:1. Todos passam AA.
- Corpo: legenda HN Medium 60 px (boa para o público 45+/65+ que mais recebeu entrega); linhas de apoio 30–40 px em caixa-alta com tracking.

## O que funciona
- O gancho mudo e cinza com uma única cor (a unha a 52%) e o fecho do laço em "Sem sair de casa".
- A virada: no corte para a cor o leque fica limpo (branco) e o fio dourado do símbolo se desenha sob "um caminho."; em "unhas." as unhas se pintam da cutícula para a ponta.
- A escada I → II → III: os leques dividem o mesmo fio dourado, e o 3º degrau atravessa o corte para a página ameixa até "unha" (f430).

## Prioridades (o que foi feito)
1. Figura trocada de mãos vetoriais para o leque do símbolo (pedido do Lucas).
2. Revisão do blueprint das 10:19 aplicada: golpe de "caminho." a −26 dB; leito B entra em f645 e o drop responde em f656, depois de "aprender." (duck −8); laço em 24 f (f711–735) + 50 f completo; c12 abre em "começa" (f785); vizinha em f366–380 (stagger 2); floreio da página ameixa em 16 f; tudo fora do trilho do Reels.
3. 1:1 refeito com folga para o tilt.

## Revisão da folha pela sessão principal (aplicada antes do MP4)
1. "pequena:" 30 → 48 px.
2. Cartão para o público 50+: "DESCUBRA" 34 → 44 px; URL 40 → 50 px num retângulo de 108 px de altura com largura medida (x 72–~836, dentro de x ≤ 930); "LEVA 2 MINUTOS" 30 → 40 px; floreio desce para y 996.
3. Planos fechados (c01 macro 2,4×, c03 1,5×, c11 macro): as unhas laterais cortadas na borda viravam "cunhas" sem leitura. Agora c01 e c11 mostram só a unha do meio, e c03 mostra só as 3 unhas centrais, inteiras.

## Áudio medido no MP4 final (`videos_v6/n1_9x16.mp4`, decodificado, RMS)
O mix inteiro sai ~3 dB abaixo do arquivo cru (o mesmo em todos os trechos, inclusive onde só há voz): é a margem do mix do Remotion, não muda o equilíbrio.
| Trecho | Mix | Voz crua | Leitura |
|---|---|---|---|
| f0–13, antes de "Ela" | silêncio digital | — | nada antes da voz |
| vão pré-virada (5,83–6,03 s) | −53,1 | −50,5 | só o ar da própria gravação: **nenhum som antes de f210** |
| "caminho." + golpe (−26 dB) | −34,0 | −33,4 | o golpe soma ~2 dB: no nível da palavra, não por cima |
| fala sob o leito A ("Primeiro… dela.") | −21,5 | −18,7 | leito nos vãos −35 dBFS: ~13 dB abaixo da voz |
| vão "dela." → "Não" (16,98–17,06 s) | −63,1 | −62,3 | o leito A já cortou: "Não começou com coragem" só na voz |
| "aprender." | −44,5 | −41,5 | sussurrado e sozinho (vão anterior −44,9 = ar da gravação) |
| drop, vão "aprender." → "No" | −33,8 | — | o leito B responde depois da palavra |
| fala sob o leito B ("No tempo… minutos.") | −22,9 | −20,1 | leito com duck −8: voz domina por ~19 dB |
| cartão depois da voz | −27,6 | — | o leito sobe 4 dB e sai em f1013–1049 |

## Pendências de ouvido
Medido acima; falta só a escuta do Lucas (golpe de "caminho." e o drop depois de "aprender.").
