# N1 · A capa dela · blueprint v6

09/11/2026. Base: Livro de assinaturas (§4), `remotion/src/timing/n1.json` e a narração já gravada (`audio/n1.mp3`, voz "Pri"). Nenhum áudio foi gerado e nenhuma API foi chamada. Revisto no mesmo dia (ajustes 9–14 do §1): onde este blueprint e o Livro divergem, vale o blueprint.
Fontes, cores e figura: `../ADAPTACAO-MARCA.md` prevalece (Georgia e Helvetica Neue, paleta da marca, unhas no lugar das mãos). Os limites deste blueprint (zona do Reels, tempos, níveis de som) valem igual na versão adaptada.
Convenção: t = 0,45 + s da palavra; f = arredonda(t × 30). **Duração: 31,92 + 0,45 + 2,6 = 34,97 s = 1049 f** (9:16 principal, 1:1 de corte, 30 fps).

## 1. Auditoria & validação

**O que o roteiro já faz bem (não muda):**
| Trecho | Por que funciona |
|---|---|
| "Ela olhava pras próprias mãos… e só via cansaço." | 3ª pessoa: não afirma nada sobre quem assiste, o que mantém o compliance. É uma imagem concreta (mãos) e nomeia a emoção em 5 s. |
| "Até que viu um caminho." | A virada chega cedo (6,99 s), antes da queda de retenção típica do Reels. |
| "Primeiro, nas próprias unhas. Depois, na irmã. Depois, na vizinha." | Escada em três degraus: prova social que cresce, com ritmo de lista. |
| "Hoje, cada unha bem-feita tem a assinatura dela." | O orgulho vem da autoria, não de renda. |
| "Não começou com coragem. Começou com uma decisão pequena: aprender." | É a mensagem da imagem N1, que levou 88% do gasto (R$ 35,29), CTR de 4,58% e 7 de 7 leads. Reenquadra a barreira, de coragem para uma decisão pequena. |
| "No tempo dela. Sem sair de casa." · "Leva dois minutos." | Derruba as objeções de tempo e deslocamento. O CTA tem atrito baixo e casa com a /comecar/ (uma pergunta). |

**O que falhou (dados de 08/11):** os vídeos v1 quase não tiveram entrega, e os que tiveram não seguraram 3 s (N4: p25 11 de 20 views, p75 1; N2: p25 10 de 19, p75 2). O v5 do N1 abria com cena centralizada, trilha desde o f0, opacidade e o mesmo molde dos outros vídeos, sem nenhum laço. Só Reels e Stories entregaram, e a maior fatia do gasto foi para 65+: a tela principal é 9:16, com tipo grande e contraste alto.

**Gatilho injetado: laço aberto por ação interrompida (efeito Zeigarnik) + reenquadramento de autoeficácia.**
- No quadro 0, uma unha está pintada até 52% e congela. O cérebro quer completar a tarefa, então o polegar espera. O laço só fecha em "Sem sair de casa" (23,71 s), e quem chega até lá ouve a frase vencedora inteira.
- O clímax tipográfico (c10, 18,97–23,71 s) recompõe a imagem que converteu como hierarquia: "coragem." riscada, "pequena:" em 30 px e "aprender." em 200 px vermelho. O vídeo entrega a mesma promessa que já provou converter (*message match*), e o quadro de 21,8 s serve de estático para teste A/B sem custo.
- O silêncio absoluto até 6,99 s faz a quebra de padrão sonora num feed cheio de música.

**Ajustes de engenharia sobre o livro** (as regras desta etapa venceram os conflitos):
1. Duração de 1049 f, e não 1065: o livro usou `t.duration` (32,44 s, com 0,52 s de silêncio no fim do mp3). A saída do leito vira f1013–1049, mantendo os 1,2 s.
2. Cada cena abre na palavra: a guilhotina de "Não" passa de f505 para f512, a do cartão de f878 para f885 ("Descubra") e a capa do gancho em cor de f705 para f711 ("Sem").
3. "aprender." em Didot Bold 300 px mede 1302 px (medido na Didot.ttc) e cortaria "er.". A 240 px o "r." ainda cairia sob o trilho de ações do Reels (curtir, comentar, compartilhar: x > 940, y 1000–1600). Fica em 200 px com tracking −0,02 em: tinta em x 80–907 em repouso e até x 932 no pico da mola. Na Georgia Bold da adaptação, o mesmo limite dá 172 px (a 206 px, começando em x 64, ela vai até x 1072).
4. "caminho." viveria 0,83 s. Em "Primeiro," ele recolhe a cabeçalho de capa (96 px) e atravessa os capítulos I–III (6,5 s). "coragem." viveria 1 s: no corte de "Começou" ele é reescalado e fica até 23,71 s.
5. "Hoje," passa a ser palavra promovida. Sem isso, "Hoje," grande duplicaria a legenda.
6. Corte novo em "mãos…" (2,93 s, plano 1,5×): sem ele, seriam 3,9 s sem troca dentro do gancho.
7. Antes da virada a câmera fica parada e só a mão afunda (o tilt anulava a descida). O recuo do vermelho passa para f147–159, junto do voo de "cansaço.".
8. As manchetes descem para a linha de base y 540, para a altura-x ficar no quadrado central. O floreio de "Hoje," vai para o canto vermelho, porque osso sobre a unha osso sumiria.

**Ajustes da revisão** (medidos decodificando os arquivos e as fontes, só leitura; o Livro ainda traz os valores antigos):
9. **Golpe de "caminho." a −26 dB, e não a −10.** O golpe do `0_sounds` tem pico de −1,9 dBFS (RMS de 50 ms −7,4). A −10 dB ele ficaria 13–24 dB acima de "caminho.", que na gravação está a −30/−41 dBFS RMS. A −26 dB o pico fica em ≈ −28 dBFS e o RMS em ≈ −33, no nível da palavra ou abaixo. Fica em f210 porque mudar o golpe para o vão (f219) levaria junto o corte para a cor, e a capa deixaria de abrir na palavra.
10. **"aprender." só na voz; o drop vem depois.** Na gravação, "aprender." está a −42 dBFS RMS, quase sussurrado. O leito B entra em f645 (trimBefore 470), o drop cai em f656, quando a palavra termina (f655), e o leito fica a −20 dB, com duck de −8. A palavra continua pousando na tela em f640, com a mola: o som chega como resposta.
11. **O laço fecha em "Sem sair de casa." (f711–735) e fica 1,67 s completo.** A unha enche em 24 f, sem atraso, e c12 passa a abrir em "começa" (f785; 0,45 + 25,70 = 26,15 s, que o motor arredonda de 784,5 para 785). O "1" se desenha em f789–819.
12. **Escada.** As unhas da vizinha enchem em f366–380 (stagger de 2 f) e as três mãos atravessam o corte para a página vermelha até "unha" (f430): 50 f com o 3º degrau completo. O floreio da página vermelha se desenha em 16 f (f474–490).
13. **Zona segura do Reels.** As três mãos de c07 passam a 0,52, com a unha do meio em x 200 / 470 / 740. Mudar só a vizinha para x 800 a 0,52 não basta: a unha do mínimo dela ficaria em x 936–986, ainda sob o trilho. Com as três a 0,52, todas as unhas ficam em x ≤ 926 e a mão inteira em x ≤ 932, e as sobreposições entre as mãos continuam como eram.
14. **Nenhum payload de TTS.** O JSON não traz mais modelo, voz nem texto marcado (§3), e nenhuma etapa automática tem o que mandar para uma API.

## 2. Upgrade do gancho (0–3 s)

Câmera frontal e parada; a escala muda só por corte (origem 540,960). Só a voz, sem trilha e sem efeito. A legenda troca por corte, sem pílula. Linha de base da legenda em y≈1360, com o fio de 6 px sob a palavra falada.

| f | s | Fala | Imagem | Tipo cinético | Câmera |
|---|---|---|---|---|---|
| 0 | 0,00 | (silêncio) | O primeiro quadro já é cheio: dedo médio cinza-cansaço, unha osso de 264×384 em (540,900) e esmalte vermelho cobrindo 40% a partir da cutícula, com borda reta (barra de progresso). As unhas do indicador e do anelar ficam cortadas nas bordas, nuas. | nenhum texto | 2,4× (x −48, y 972) |
| 0–8 | 0,00–0,27 | | O esmalte avança de 40% a 52% (cubic-bezier(0.2,0,0,1)) e **congela**: ação interrompida. A mão começa a afundar +72 px até f209 (inOut sine): nada para. | | parada |
| 12 | 0,40 | | | Corte de G1 "Ela olhava pras" (Futura Medium 60, grafite, x 72). O fio nasce sob "Ela" (scaleX 0→1, 4 f). | |
| 14 | 0,45 | **Ela** | | | |
| 30 | 1,01 | **olhava** | **Corte seco** para a capa 1,0×: a mão cinza é enorme e a palma sangra. A zona de manchete está **vazia** (a capa ainda sem título) e a única cor da tela é a unha a 52%. | O fio escorrega para "olhava" (f28–32). | 1,0× |
| 63 | 2,09 | **pras** | | fio → "pras" | |
| 72 | 2,40 | | | Corte de G2 "próprias mãos…" | |
| 74 | 2,45 | **próprias** | | fio → "próprias" | |
| 88 | 2,93 | **mãos…** | **Corte seco** para plano médio 1,5×: as quatro pontas ocupam y 525–1000 e a unha a 52% fica em (480,655). Ela olha para as próprias mãos. | fio → "mãos…" | 1,5× (x −90, y 300) |
| 89 | 2,97 | | Fecha a janela de 3 s com o laço ainda aberto. | | |

A partir dali: corte de G3 "e só via" em f120. Em f147 ("cansaço.") vem o corte de volta a 1,0×. "cansaço." sai da legenda, nasce em Didot Italic 90 px e voa em arco até a manchete a 230 px (12 f, cubic-bezier(0.3,0,0,1)), pousando atrás do dedo médio. No mesmo voo, o vermelho recua de 52% a 0% (cubic-bezier(0.5,0,0.75,0)). A quebra de padrão é tripla: cortes em 1,0 / 2,9 / 4,9 s, silêncio num feed com música e uma única mancha vermelha num quadro cinza.

## 3. Matriz de ritmo & áudio

**Ritmo de troca de estímulo** (o plano troca por corte ou guilhotina; o acento é um evento novo dentro do plano). O maior intervalo sem estímulo é de 2,47 s, no cartão parado.
| Trecho | s | Estímulos (s) | Intervalo |
|---|---|---|---|
| Gancho / problema | 0–6,99 | 0,00 · 1,01 · 2,93 · 4,91 | 1,0 / 1,9 / 2,0 / 2,1: cortes lentos, peso do cansaço |
| Virada | 6,99–7,83 | 6,99 (cor + golpe) · 7,83 (cabeçalho + "I") | 0,8 |
| Rede | 7,83–13,49 | 9,31 · 10,15 · 11,07 · 11,77 · 12,20 | 0,4–1,5: acelera, a rede se espalha |
| Orgulho | 13,49–17,07 | 13,49 · 14,33 · 15,79 | 0,8 / 1,5 / 1,3 |
| Frase que converteu | 17,07–23,71 | 17,07 · 17,97 · 18,37 · 18,97 · 20,27 · 21,33 | 0,4–1,3, depois **2,4 s de pausa em "aprender."** (≥1,5 s); o drop de 21,87 é só som |
| Fecho | 23,71–29,49 | 23,71 · 24,50 (unha a 100%) · 26,15 · 26,30–27,30 (contorno do "1") · 28,23 | 0,8 / 1,65 / 0,9 / 1,3 |
| CTA | 29,49–34,97 | 29,49 · 30,11 · 30,43 · 30,66 · 31,33 · 32,50 | 0,2–1,2, depois fica parado 2,47 s |

**Curvas** (nada linear; saída com 60% do tempo da entrada; zero opacidade animada):
| Uso | Curva | Duração |
|---|---|---|
| Corte seco (t1) | steps(1) | 1 f |
| Guilhotina 12° (t2) | cubic-bezier(0.7, 0, 0.84, 0) | 10 f |
| Palavra promovida (t3) | cubic-bezier(0.3, 0, 0, 1) | 12 f |
| Esmalte da cutícula (t4) e fio da legenda | cubic-bezier(0.2, 0, 0, 1) | 6 f (stagger 3; 2 na vizinha) / 4 f |
| Recuo do vermelho | cubic-bezier(0.5, 0, 0.75, 0) | 12 f |
| Traço: risco, contorno do "1", floreio (t5) | cubic-bezier(0.6, 0, 0.2, 1) | 9 / 30 / 16 f (página vermelha) e 22 f (cartão) |
| Laço fecha (52%→100%) | cubic-bezier(0.45, 0, 0.55, 1) | 24 f (f711–735) |
| Máscara de linha e recheio do "1" (t6) | cubic-bezier(0.16, 1, 0.3, 1) | 9 / 15 f |
| Tilt de leitura (c05–c13) e descida da mão | cubic-bezier(0.37, 0, 0.63, 1) | a cena / f0–209 |
| Mola do N1 (cabeçalho, escala de "aprender.") | spring {1, 220, 22}: ζ 0,74, overshoot 3,1% | 15 f |

**Pontos de impacto sonoro** (voz a 0 dB ≈ −21 dBFS na média; o leito fica ~12 dB abaixo sob a fala). Os níveis foram medidos decodificando os arquivos, só leitura. Sons proibidos no N1: whoosh, sparkle e impact.
| s | f | Âncora | Arquivo | Volume | Motivo emocional |
|---|---|---|---|---|---|
| 0,00–6,99 | 0–209 | "Ela… viu um" | só a voz | 0 dB | O silêncio é o cansaço e faz a quebra de padrão. |
| 6,99 | 210 | **caminho.** | `audio/v6/n1_abertura.mp3`, trimBefore 77 (2,567 s), 36 f | −26 dB (pico ≈ −28 dBFS, RMS ≈ −33) | O caminho aparece sem cobrir a palavra. "caminho." está a −30/−41 dBFS RMS (pico −24) e o golpe soa em f211–217, no nível dela ou abaixo. O golpe em si♭4 + fá5, consonante com o fá maior, cai no corte para a cor. |
| 7,33→7,83 | 220→235 | antes de "Primeiro," | `audio/v6/n1_beat1.mp3` trecho A, trimBefore 60 | −60 → −6 dB; duck −4 | A rede começa. O trecho cresce sozinho no arquivo (−27 → −20 dB). |
| 16,87→17,07 | 506→512 | entre "dela." e **Não** | beat1 A | −6 → −60 dB | A frase que converteu fica só na voz. |
| 17,07–21,50 | 512–644 | "Não começou… aprender." | só a voz | — | 4,4 s de decisão nua. "aprender." (f640–655) está a −42 dBFS RMS, quase sussurrado, e nada toca por baixo dele. A guilhotina corta sem som. |
| 21,50→21,87 | 645→656 | durante "aprender." | beat1 trecho B, trimBefore 470 (15,667 s) | −60 → −20 dB em 11 f | O fim do break e a antecipação (15,76 s do arquivo, f648) ficam abaixo de −50 dBFS até f654: não se ouvem sob a voz. |
| 21,87 | 656 | fim de **aprender.** (f655) | beat1 B, drop em 16,02 s do arquivo | −20 dB (−30 dBFS RMS); duck −8 (−38) | Orgulho como resposta: a palavra pousa na tela em f640 só com a voz, e o drop responde quando ela termina. Sob "No tempo dela… minutos.", que mede −20 dBFS RMS, o leito fica ~18 dB abaixo. |
| 32,37→32,83 | 971→985 | fim de "minutos." | beat1 B | −20 → −16 dB | O leito toma o cartão. |
| 33,77→34,97 | 1013→1049 | cartão | beat1 B | −16 → −60 dB | Saída de 1,2 s; termina em 29,1 s do arquivo. |

Leito B no render: `<Sequence from={645} durationInFrames={404}><Audio trimBefore={470}/>` (ffmpeg só para conferência: `atrim=start=15.667:duration=13.467,adelay=21500|21500`).
Arquivos: as cópias intactas `n1_beat1.mp3` e `n1_abertura.mp3` já estão em `remotion/public/audio/v6/`. Em 09/11 conferi com ls e md5 que as 7 cópias do Livro (§8) batem com a origem; os md5 do N1 estão em `audio.preparo`, no JSON. Nenhum arquivo será criado nem processado: corte, ganho e duck saem das props do `<Audio>`.

**Entonação (fora de escopo).** Não há regravação prevista: o vídeo usa a narração já gravada e não gasta nenhum crédito. Fica só como leitura da gravação atual: as pausas antes de "Até", "Não" e "aprender." medem 0,24 / 0,34 / 0,40 s, e "aprender." sai baixo. Por isso o som espera a palavra terminar.

## 4. Mapeamento de camadas visuais

Mão M (chapada, sem sombra): palma 560×700 em x 300–860, y 1100–1800; dedos-pílula de 140 px com topos em y 530 / 440 / 510 / 670 e polegar inclinado; unhas ovais 110×160 com a cutícula embaixo. As coordenadas completas estão no JSON (c01). Ordem z, de baixo para cima: fundo → manchete/algarismo (plano 1,0×) → figura (1,6×) → esmalte (recortado pela oval) → fios e traços → legenda → palavra em voo.

| Cena | s | f | Âncora | Papel | Na tela | Entra / sai | Câmera | → |
|---|---|---|---|---|---|---|---|---|
| c01 | 0,00–1,01 | 0–29 | Ela | gancho | plano-detalhe cinza; unha a 40→52%; G1 | corte / continua | 2,4×, parada | t1 |
| c02 | 1,01–2,93 | 30–87 | olhava | gancho | capa cinza 1,0×, manchete vazia, só a unha tem cor; G1–G2 | corte / corte | 1,0×, parada | t1 |
| c03 | 2,93–4,91 | 88–146 | mãos… | problema | plano médio 1,5× das pontas; G2–G4 | corte / corte | 1,5×, parada | t1 |
| c04 | 4,91–6,99 | 147–209 | cansaço. | problema | "cansaço." em Didot Italic 230 grafite atrás do dedo; o vermelho recua a 0; G5–G6 | promovida 12 f / corte | 1,0×, parada | t1 |
| c05 | 6,99–10,15 | 210–303 | caminho. | caminho | corte para a cor: mão areia; "caminho." em Didot Bold 230 vermelho → cabeçalho de 96 px em 7,83; "I"; 5 unhas vermelhas em 9,31 | corte / corte | tilt 0→−38 | t1 |
| c06 | 10,15–11,77 | 304–352 | Depois, | prova | cabeçalho; "II"; 2 mãos a 0,72; unhas da irmã em 11,07 | corte / corte | tilt | t1 |
| c07 | 11,77–13,49 | 353–404 | Depois, | prova | cabeçalho; "III"; 3 mãos a 0,52 com a unha do meio em x 200 / 470 / 740 (vizinha canela), todas as unhas em x ≤ 926; unhas da vizinha em 12,20 (f366–380, stagger 2 f) | corte / corte (as mãos continuam) | tilt | t1 |
| c08 | 13,49–17,07 | 405–511 | Hoje, | prova | página vermelha; as 3 mãos de c07 seguem por cima até f429 e a legenda fica grafite sobre elas; "Hoje," em Didot Italic osso; a unha osso de 400×560 nasce no lugar das mãos em 14,33; floreio osso em 15,79 (16 f) | corte / divisão | tilt | t2 |
| c09 | 17,07–18,97 | 512–568 | Não | caminho | página osso; "coragem." promovida em 17,97 e riscada em 18,37 | divisão / continua | tilt | t1 |
| c10 | 18,97–23,71 | 569–710 | Começou | payoff | hierarquia: "coragem." riscada em 150 px; "pequena:" em 30 px (20,27); "aprender." em Didot Bold 200 vermelho (21,33), parado 2,4 s, em x 80–907; o drop chega em 21,87 | corte / corte | tilt | t1 |
| c11 | 23,71–26,15 | 711–784 | Sem | payoff | o plano-detalhe do f0 em cor; a unha do meio vai de 52% a 100% em f711–735 ("Sem sair de casa.") e fica completa 50 f | corte / corte | 2,4×, tilt | t1 |
| c12 | 26,15–29,49 | 785–884 | começa | cta | "1" em Didot Bold 900 em contorno de 3 px (f789–819), cheio de vermelho em "primeira" (28,23) | corte / divisão | tilt | t2 |
| c13 | 29,49–34,97 | 885–1048 | Descubra | cta | capa final: mão completa embaixo à direita; DESCUBRA / por onde / começar.; retângulo vermelho com a URL; LEVA 2 MINUTOS; floreio vermelho | divisão (textos por máscara de 9 f) / fim | tilt | — |

Soma: 30 + 58 + 59 + 63 + 94 + 49 + 52 + 107 + 57 + 142 + 74 + 100 + 164 = **1049 f = 34,97 s**. Nada importante fica menos de 1,5 s. A unha a 52% vive 4,9 s, de c01 a c04, e a unha completa do fecho fica 50 f (1,67 s, f735–784). As unhas da vizinha ficam completas 50 f (f380–429). "caminho." fica 6,5 s, "coragem." 5,7 s e "aprender." 2,4 s. A única exceção é o floreio da página vermelha, completo por 22 f (f490–511): a leitura dele termina na reprise do cartão, completa por 1,7 s (f997–1048).

**Lógica de transição entre camadas**
- **Corte (t1):** troca a página inteira num quadro, sem movimento, como na cobertura de um ensaio. O que persiste (a unha do meio de c01 a c04, o cabeçalho de c05 a c07, as três mãos de c07 até f429 na página vermelha, "coragem." de c09 a c10, a mão dela) é redesenhado na mesma posição de página. O tilt recomeça em 0 a cada capa. O cabeçalho fica fora do tilt para não saltar no corte, e as mãos que entram em c08 partem da posição em que c07 terminou (figura a −61 px).
- **Guilhotina (t2):** a página que sai, com a própria legenda, divide-se em 2 polígonos a 12°. A página nova já está parada por baixo, com a legenda dela posta (por isso a legenda nunca fica osso sobre osso). A única camada nova que anima durante os 10 f é "DESCUBRA", por máscara.
- **Palavra promovida (t3):** a legenda é dona da palavra até o quadro s. Em s, a palavra sai da legenda por corte e passa a existir só no voo (acima da figura). No quadro de pouso desce para o plano da manchete, atrás dos dedos. Nunca há duas cópias, e as palavras restantes fecham o vão em 6 f.
- **Esmalte (t4):** é sempre uma máscara reta que nasce da cutícula e fica recortada pela oval. Sobe (9,31 / 11,07 / 12,20 / 23,71) ou recua (4,91) e é o fio narrativo do vídeo: 40→52 · 0 · 100%.
- **Saídas:** só por corte, divisão ou máscara. Nenhuma camada some por opacidade, e o vermelho só existe na unha do gancho antes de 6,99 s.
- **1:1:** a regra completa está em `assinatura.grade.regra_1x1`. A figura das capas 1,0× vai a 0,8 ancorada em y 1380, a legenda fica em y 1400–1470 e o bloco do cartão desce 180 px.

## 5. Blueprint de automação

Fonte da verdade para o pipeline: [`blueprint.json`](./blueprint.json) (13 cenas, 68 camadas, tempos em s com 2 casas, cores só da paleta do N1; validado com `python3 -c 'import json;json.load(open(...))'`). O JSON não tem nenhum campo de TTS.
Notas de implementação em `remotion/src/v6/n1.tsx`:
- use `lead: 0` em cada cena (o padrão do motor adianta 2 f) e `durationInFrames` de 1049 (o `totalFrames(t)` do motor dá 1065);
- acrescente a `useSystemFonts` os pesos `700 200px Didot`, `italic 400 230px Didot`, `400 200px Didot` e `500 30px Futura`;
- tire o contorno do "1" da própria Didot.ttc uma única vez (fontTools, sem custo), ou desenhe o texto SVG com `stroke-dasharray`;
- confira no `n1.tsx` os pontos desta revisão: leito B, golpe, tamanho de "aprender.", posição das três mãos (ou das unhas da adaptação, que também não passam de x 930), c11/c12 e floreio.

Antes do Meta: stills de c01, c04, c05, c07 (f385), c08 (f420, mãos sobre a página vermelha), c10 (f680), c11 (f760, unha completa) e c13, mais a folha de contato para o OK do Lucas. Ouvir f200–240 e f630–680 para conferir o golpe a −26 dB e o drop depois de "aprender.".
