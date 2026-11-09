# N5 · O reset pequeno · autocrítica v6 (design-critique contra o PADRAO-PRODUCAO-V6)

09/11/2026. Revisei a folha `remotion/out/v6/folha_V6-N5-9x16.png` (16 quadros), a `folha_V6-N5-1x1.png` (8 quadros) e quadros isolados das transições (f0, 10, 63, 67, 73, 79, 88, 106, 146, 152, 156, 165, 200, 246, 262, 275, 359), nos dois formatos.

## Impressão geral
Lê como um post calmo no meio do barulho. No f0 já está tudo na tela: o muro branco de "reset" correndo como letreiro, um card nude com a frase e o leque do símbolo, que é a única cor. A virada vem em 2,5 s, sem grito. O maior risco é o contrário do sensacionalismo: o filme pode parecer contido demais para o feed. A força do gancho vem do contraste entre o muro em movimento e o card parado, não de cor nem de volume.

## Regras (passa / falha)
| Regra | Situação |
|---|---|
| Cores sólidas; sem degradê, sombra, blur, vinheta ou textura | passa: só `rect`, `path` e texto chapados |
| Sem opacidade animada | passa: entradas e saídas por máscara, painéis, campo que cresce (geometria), escala de uma palavra e traço. O leque troca de cor por recorte (clipPath), não por opacidade |
| Sem flash, pisca, tremida, zoom, glitch ou partícula | passa: câmera fixa, só com deriva em x de ±14 px |
| Molas ≤ 6% | passa: {1, 200, 21}, ζ 0,74, overshoot de 3,1% |
| Saída ≈ 60% da entrada | passa: entradas de 10 f, saídas de 6 f; painéis de 10 f |
| Nada importante < 1,5 s; troca a cada 1,5–3 s | passa: c01 1,9 s, c02 1,8 s, c03 2,3 s, CTA montado por 2,7 s. As telas trocam a 2,5 / 2,5 / 3,0 / 4,0 s |
| Uma ideia por tela, editorial | passa: 4 telas, uma frase cada |
| Zona segura e 1:1 | passa: o essencial fica em y 570–1410. No 1:1 nenhum texto é cortado; o muro aparece só acima da faixa |
| CTA claro | passa: "Descubra por onde começar." + URL sublinhada + "1 pergunta. Leva 2 minutos." até o último quadro |
| Sem mãos; sem nome de curso, preço ou renda | passa |
| Política Meta (crise, desinformação, atributo pessoal, SIEP) | passa: "reset" só em minúsculas, entre aspas como fala alheia na 1ª tela. Sem apagão, data, "global", economia, escuridão ou urgência. Fala de "todo mundo" e "a gente" |
| Assinatura própria | passa: página rosé, acento framboesa, faixa de leitura, letreiro horizontal, HN Light e o par whoosh/impact são inéditos na série. Detalhes na seção Consistência |

## Usabilidade (público 25–54, celular, Reels sem som)
| Achado | Gravidade | O que foi feito |
|---|---|---|
| Na 1ª versão, o campo framboesa nascia da linha central da faixa por cima do texto. Em f152 ele virava um traço sobre "a gente indica", que lia como palavra riscada | 🔴 | O texto do c02 sai por máscara em f142–150, antes de o campo crescer. A faixa já está vazia quando ele nasce |
| Texto a 84 px deixava o card com muito vazio e letra fina demais no celular | 🟡 | As frases passaram para 92 px, a faixa para 440 px (y 740–1180) e o leque de 0,62 para 0,7 (~360 px) |
| No f0 está só "Todo mundo" ("falando em “reset”." entra em f3–13) | 🟡 | Mantido: o movimento no 1º segundo faz parte do gancho. **Pendência:** no Meta, escolher como miniatura um quadro entre f20 e f55, com a frase inteira |
| "pequeno." encolhe para 66 px: a piada depende de perceber a escala | 🟢 | Está a 66 px e em framboesa, legível |
| Sem som, o anúncio é entendido por inteiro | 🟢 | Não há informação só no áudio |

## Hierarquia visual
- **O que chama primeiro:** o card nude, por contraste (tinta sobre nude 12,3:1). O muro branco (2,3:1) é maior, mas fica claramente em segundo plano. Correto.
- **Leitura:** card → leque (única cor) → letreiro ao fundo. No c03, a palavra gigante "aprender." vem antes do apoio. No CTA, a ordem é título → URL sublinhada → "1 pergunta" → símbolo.
- **Ênfase:** framboesa só no que fica ("reset" reapropriado, "pequeno.", a página de "aprender." e do CTA).

## Consistência
| Elemento | Situação |
|---|---|
| Tipografia | HN Light nas frases (92 / 96 / 150), HN Regular no apoio (60–64), HN Medium na URL (56). Georgia só em "reset" (muro e frases). Nenhuma fonte de reserva: as fontes carregam antes do f0 |
| Grade | Margem de 96 px e tudo alinhado à esquerda. Só o leque é centrado, como emblema |
| Movimento | Todo texto usa a mesma máscara de linha e a mesma mola. O leque não se mexe do f0 ao fim: é a âncora |
| Contra N1–N4 | Não repete o corte seco nem a guilhotina (N1), persiana ou página virada (N2), gota, inundação ou push-in (N3), nem feed vertical que freia, cursor ou faixa da URL (N4). A URL não fica em retângulo nem faixa. Som só com whoosh e impact, que nenhum v6 usa |

## Acessibilidade
- **Contraste:**
  - tinta/nude 12,3:1.
  - framboesa/nude e nude/framboesa 4,7:1. Passa AA para texto grande: tudo ≥ 56 px.
  - Muro branco/rosé 2,3:1, decorativo e intencional.
- **Leque sobre rosé:** a unha #C77D92 fica só a 1,4:1 e a nude a 2,0:1. É grafismo, não texto, e a forma do leque continua legível pelas unhas escuras. 🟢, mantido para não alterar o símbolo.
- **Legibilidade:** o menor texto essencial tem 56 px (URL, ~20 pt no celular).

## O que funciona
- A piada é visual e sonora ao mesmo tempo: o muro acelera junto do whoosh, os painéis fecham, o som corta seco e o que sobra é um card calmo.
- O leque presente desde o 0 s diz "unhas" antes de qualquer palavra. Ao virar nude sob o campo, ele conecta as duas metades do filme sem nenhum movimento.
- "aprender." responde direto à frase que converteu no N1, e a /comecar continua a conversa.

## Prioridades (o que ficou para o Lucas)
1. **Ouvir o som no celular.** O impact afinado a 3,0× / 1,5× / 2,0× é grave: no alto-falante do celular sobra o ataque. Medi o arquivo (fundamental ~37 Hz, harmônicos de 74–80 Hz, perto de ré), mas não ouvi.
2. **Leito musical.** O filme não tem trilha por decisão (as 4 trilhas são de N1–N4). Se o Lucas quiser leito, a opção é musica.mp3 a 1,0× a partir de f75, a −20 dB, mas isso repete o N3 e precisa do OK dele.
3. **Miniatura:** escolher f30 no Meta.
