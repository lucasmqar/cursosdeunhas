# N5 · O reset pequeno · storyboard v6

360 quadros (12,0 s) a 30 fps · 1080×1920. O 1:1 é o recorte puro do quadrado y 420–1500. **Sem narração** (`voice: false`): só tipografia, leque e som. Implementação em `remotion/src/v6/n5.tsx`, numa cena única chamada "Filme".

## Assinatura
**Cor**
- Página rosé #D99BA8 (só o N3 usou rosé, e só na inundação de uma cena).
- Card nude #F6EDE8, texto tinta #3B2430, muro branco #FFFFFF (~2,3:1, de propósito secundário).
- Acento exclusivo framboesa #A24E6F, a unha do meio do símbolo. Aparece em "reset", em "pequeno." e na página de "aprender." e do CTA. Não há fundo escuro.

**Grade**
- Uma faixa de leitura (o "card do feed") de largura total, em y 740–1180, com margem de 96 px e texto alinhado à esquerda.
- O leque de 5 unhas (pivô 540,1435; escala 0,7; ~360 px; y 1245–1410) fica abaixo da faixa, numa zona limpa (y 1180–1520), sem muro.
- O muro ocupa o resto: linhas com passo de 150 px e recuos de 0, 180 e 360.

**Tipo**
- Helvetica Neue Light 92 (frases), 96 (CTA) e 150 ("aprender.").
- HN Regular 60–64 (apoio) e HN Medium 56 (URL).
- Georgia Regular e Italic só na palavra "reset".

**Transições**
- Letreiro horizontal do muro.
- Painéis que fecham sobre o muro em movimento.
- Linha que nasce da máscara da própria linha (mola com 3% de overshoot).
- Encolher de palavra.
- A faixa vira página: um campo framboesa cresce da linha central da faixa e depois até as bordas. O leque troca de cor sob o campo, por máscara.
- Traço sob a URL.

**Câmera**: fixa, com deriva em x de +14 a −14 px no filme todo (inOut seno). Sem zoom e sem eixo y.

**Física**: mola {1, 200, 21}, com ζ 0,74 e overshoot de 3,1%. Entradas de 10 f e saídas de 6 f (60%).

## Cenas
| Cena | Quadros | Na tela | Movimento | Som |
|---|---|---|---|---|
| c01 gancho | 0–74 (75) | Página rosé. O muro de "reset" branco em Georgia 120 (Regular/Italic alternadas) fica acima da faixa (linhas em y 80–680) e abaixo do leque (y ≥ 1580). Faixa nude. **f0 já composto:** "Todo mundo" (HN Light 92 tinta, x 96, linha de base 937) + leque colorido (unha 1 em nude, porque a rosé sumiria na página). "falando em “reset”." (linha de base 1045) sobe por máscara em f3–13, com "“reset”." em Georgia framboesa. Legível de f13 a f68 (1,8 s). | Letreiro: linhas ímpares ←, pares →, desde o f0, acelerando de leve (2,6→4,3 px/f, o hype que cresce). Em f60–70 dois painéis rosé fecham da borda de cima e da de baixo até a faixa (bezier .65,0,.35,1) e cobrem o muro ainda em movimento. A frase sai para cima por máscara em f68–74 (6 f, 2 f de offset). | whoosh.mp3 a 0,45× (−14 st) em f0, a −26→−22 dB, e um 2º whoosh a 0,5× (−12 st) em f36, a −20→−14 dB, com o pico em ~f56. **Corte seco em f60**, quando os painéis começam a fechar: o "grande reset" que cresce e não chega a lugar nenhum. |
| c02 virada | 75–149 (75) | Faixa nude sobre a página limpa. "O reset que" / "a gente indica" / "é pequeno." em HN Light 92 tinta, linhas de base em 878/984/1090, com "reset" em Georgia framboesa (sem aspas: agora é o nosso) e "pequeno." em framboesa. O leque fica imóvel. | As linhas nascem da máscara em f75, f78 e f81 (10 f, mola 3%). Em f101–111, "pequeno." encolhe de 92 para 66 px (escala 0,72 a partir da linha de base, mola 3%), a única escala do filme. As linhas saem para cima por máscara em f142–150, antes de o campo nascer (senão o campo riscaria "a gente indica"). Legível de f91 a f142 (1,7 s). | Silêncio desde f60: o ruído foi deixado de lado. Em f101, quando "pequeno." encolhe, um toque pequeno: impact.mp3 a 3,0× (lá, ~110 Hz), −24 dB, cortado em 0,33 s. |
| c03 aprender | 150–239 (90) | Página framboesa. "aprender." em HN Light 150 nude (linha de base 930), "unhas, do zero," / "no seu ritmo." em HN Regular 64 nude (1035/1110). O leque fica no mesmo lugar, todo nude. | A faixa vira página: o campo framboesa cresce da linha central da faixa até as bordas dela (f150–157, scaleY) e depois as bordas viajam até y 0 e 1920 (f155–167). Por onde o campo passa, o leque fica nude (máscara, sem opacidade). "aprender." nasce da máscara em f162; as linhas de apoio em f168 e f171. Legível até f239 ("aprender." 2,2 s; apoio 1,9 s). | f164, página completa: impact.mp3 a 1,5× (lá grave, ~55/110 Hz), −14 dB, com rampa até −40 dB em f218. É o peso da decisão, em volume baixo. |
| c04 CTA | 240–359 (120) | Página framboesa. "Descubra" / "por onde começar." em HN Light 96 nude (640/752). "cursosdeunhas.com.br/comecar" em HN Medium 56 nude (905), com traço nude de 3 px por baixo. "1 pergunta. Leva 2 minutos." em HN Regular 60 nude (1020). Leque nude imóvel em y 1245–1410. Todo o bloco fica em y 570–1410, dentro do quadrado do 1:1. | O texto anterior sai para cima por máscara (f240–248, offset de 2 f). "Descubra" entra em f246, "por onde começar." em f249, URL em f258, traço em f264–272 (8 f) e "1 pergunta…" em f270. **Fica montado e parado de f280 a f359 (2,7 s)**, só com a deriva. | f268, quando a URL abre: impact.mp3 a 2,0× (ré, ~75/150 Hz), −18 dB, rampa até −50 dB em f298. É a resolução lá → ré. Depois, silêncio até o fim. |

Soma: 75 + 75 + 90 + 120 = **360 f**.

## Checklist
- f0 já é um cartaz completo, com frase, card, leque e muro.
- Nenhum texto importante fica menos de 1,5 s inteiro na tela.
- Nada de fade ou opacidade, degradê, sombra, blur, flash, partícula, tremida, zoom, mão, preto, caixa-alta de alerta, "apagão", data, "global", economia, nome de curso, preço ou renda.
- No 9:16 tudo o que é essencial fica em y 570–1410. No 1:1 o muro só aparece acima da faixa (linhas 530 e 680), e o recorte não corta nenhum texto.
