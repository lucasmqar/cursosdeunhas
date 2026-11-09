# N4 · autocrítica v6 (design-critique contra o PADRAO-PRODUCAO-V6)

09/11/2026. Fontes da revisão: `remotion/out/v6/folha_V6-N4-9x16.png` (24 quadros) e `folha_V6-N4-1x1.png` (12 quadros), mais quadros-chave isolados. Esta é a 2ª passada: a 1ª foi feita sobre o blueprint antigo; esta incorpora a revisão 2 do blueprint e os 8 apontamentos da crítica adversarial.

## Impressão geral
É uma ficha de revista de consumo em grade suíça, monocromática em nude2 + tinta, com um único ator de cor: o cursor ameixa profunda. Funciona como "editorial", com uma ideia por tela, muito respiro e nenhum efeito. O maior risco é ser contido demais para o feed: a força do gancho depende do movimento de frenagem e dos três "?" grandes, e não de cor.

## Regras (passa / falha)
| Regra | Situação |
|---|---|
| Cores sólidas; sem degradê, sombra, blur, vinheta ou textura | passa: só `rect`/`path`/texto chapados |
| Sem opacidade animada | passa: as entradas são por máscara, traço, deslocamento, escala (bloco do t2) ou corte (glifos de "2 min", nota). As palavras escurecem por troca de cor |
| Molas ≤ 6% (no N4, nenhuma) | passa: só bezier, overshoot 0 |
| Saída ≈ 60% da entrada | passa nas máscaras; o t5 é empurrão (12 f), simétrico por natureza |
| Troca de estímulo a cada 1,5–3 s; nada importante < 1,5 s | passa: o maior trecho parado é o respiro f663–707 (1,5 s, intencional) |
| Legenda presa ao Whisper; texto grande não duplica a legenda | passa: a palavra escurece no `s`; os rótulos "Conteúdo / Preço / Garantia" não são o texto da legenda do momento; "2 min" é imagem de "dois minutos" |
| Zona segura (y 250–1500) e quadrado central no 1:1 | passa: no 9:16, sistema em y 460–1276; cartão em 700–1250; no 1:1, grade original centrada |
| CTA claro (unhas → /comecar/) | passa: "qual caminho é o seu" + caixa marcada + cursosdeunhas.com.br/comecar como linha da tabela, na tela de f708 até o último quadro |
| Compliance: preço só relativo, sem nome de curso, 3ª pessoa | passa: $ / $$ / $$$, unhas ○◐●, nenhum produto nomeado |
| Sem mãos vetoriais | passa: a figura é só a unha do símbolo (`unhaD`) |

## Usabilidade e legibilidade (público 45–65+)
| Achado | Gravidade | O que foi feito |
|---|---|---|
| Rótulos da tabela a 30 px ("O que ensina." etc.) ilegíveis no celular | 🔴 | Viraram "Conteúdo / Preço / Garantia" a 46 px. O texto longo não cabe nos 226 px da coluna. Os rótulos ecoam a fala ("o que cada um ensina, preço e garantia") |
| f0 com fios a 1,3:1 e números a 2,7:1 | 🔴 | Cinza-régua passou a #846D78 (3,7:1). Os fios agora têm 2 px em #8D7682 (3,3:1) e as cabeças 3 px em tinta. Os "?" e "Antes" já estão em tinta na f0 |
| Tabela pequena no celular (revisão das 11:26) | 🔴 | O módulo passou de 120 para 140. Números 01–04 a 46 px, $ a 96, barras de 24 px, quadrados de 64, unhas 1,45× maiores (148×232) e cursor de 5 px |
| c04 (f341–413) vazio: um fio cruzado parecia quadro quebrado | 🟡 | Virou uma régua grossa: barra de 56 px com contorno de 4 px e marcas. O cursor mede de x 64 até o centro, e o trecho medido enche de ameixa profunda |
| Cartão pequeno: nota a 28 px, URL a 44 | 🟡 | URL a 48, "qual caminho é o seu" a 56 com caixa de 64, nota Georgia Italic a 40 |
| A URL sumia nos 7 quadros finais (saída em loop) | 🔴 | O loop saiu: o cartão fica até f861, em deriva, e a URL nunca sai da tela |
| Célula colorida pulando de palavra em palavra (cara de CapCut) | 🟡 | Removida: a palavra dita só escurece |
| O "?" apontado trocando de tinta para ameixa profunda não se vê (valores quase iguais) | 🟡 | O campo apontado acende como bloco ameixa profunda com o "?" em nude2. É a mesma família do cursor (campo em foco) |
| Check ameixa profunda dentro da caixa tinta tem pouco contraste de cor | 🟢 | Fica: lê pela forma (6 px); é o único traço do cartão |

## Hierarquia
- **O olho vai primeiro** aos três "?" (Georgia Italic 220) no gancho, à linha arquivada (56 px) no método, às unhas ○◐● e aos $ na prova e a "2 min" (HN Condensed Black 260) no cartão. A ordem está certa.
- **Leitura**: sempre de cima para baixo e da esquerda para a direita, com a legenda como a última linha da tabela; o cursor conduz o olho entre as colunas.
- **Respiro**: no 9:16 há ~210 px vazios acima do cabeçalho e ~220 px abaixo da legenda, dentro da área visível do Reels. É editorial, não é buraco.

## Consistência e anti-repetição
| Ponto | Situação |
|---|---|
| Faixa da legenda perto da do N1 (ambas à esquerda, ~y 1300+) | Corrigido no 9:16: o sistema sobe 175 px, e a legenda fica em y 1130–1270 (a do N1 fica em ~1290–1380). No 1:1, a grade fica centrada no quadrado |
| t1 de colunas em sentidos opostos (família da guilhotina do N1) | Trocado pelo arquivo da ficha inteira: um fio e um bloco que sobe 6 módulos |
| Cartão no molde dos outros (contador + linha + check + faixa) | Trocado: "2 min" fixo, revelado pelo cursor; URL como linha impressa da tabela, sem faixa |
| Paleta: nude2 fica a ΔE ~3 do nude do N1 (o blueprint pediu papel azulado #D0D9E6) | ⚠️ Fica pela marca (a ADAPTACAO vence). A diferença do N1 está no sistema (grade, cursor, monocromia), não no fundo. **Decisão do Lucas** se quiser mais distância |

## O que funciona
- O gancho tem frenagem + campo que acende + cursor que hesita: três estímulos em 3 s sem gritar, e legível sem som.
- A legenda que vira a tabela ("arquivo") é a assinatura mais forte e não existe nos outros três.
- O cartão fecha o laço aberto da f0: onde estavam os "?", aparece "2 min", e a caixa fica marcada.

## Áudio (medido no MP4 9:16, mono)
| Trecho | Pico | RMS |
|---|---|---|
| Total | −5,8 dBFS | −24,1 dBFS |
| Gancho, voz + rumor (0,45–3,7 s) | −8,7 | −23,9 |
| Silêncio da voz, só rumor (4,2–4,8 s) | −19 a −21 | −25,5 na 1ª medição → riser baixado 2,5 dB → **−29,5 a −30,7** (alvo do blueprint: −28) |
| Método, voz + leito | −8,4 | −23,8 |
| "Sem pressa" (leito a −40 dB) | −14,4 | −30,7 |
| Cartão sem voz (leito −14 dB + gesto 2) | −15,4 | −27,4 (alvo −27,5) |
| Gesto 2 junto do check | −19,4 | −27,9: contido, abaixo da voz |
A voz domina em todos os trechos com fala.

## Pendências
1. Ouvir no fone: o clique do gesto 1 a 0 dB e o leito a −40 dB em "Sem pressa".
2. Fundo nude2 × papel azulado do blueprint: escolha do Lucas.
