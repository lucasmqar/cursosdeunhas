# Livro de assinaturas · v6 (N1–N4)

09/11/2026 · Decisão da direção executiva de criação sobre as Propostas 1 e 2. É a fonte de verdade para escrever `remotion/src/v6/n1..n4.tsx`.
Os quadros são absolutos, a 30 fps, com o LEAD de 0,45 s incluído: f = round((0,45 + s) × 30), sobre `remotion/src/timing/n{k}.json`. Totais: N1 1065 · N2 868 · N3 880 · N4 873.

## 1. Decisões
| Vídeo | Base | O que entra da outra proposta | O que sai, e por quê |
|---|---|---|---|
| N1 | P1, capa de moda | P2: trilha cortada em "Não", só voz na frase que converteu, drop exato em "aprender." | pincelada (pertence ao N3), portal da letra (zoom de mergulho pertence ao N3), relógio e casa (N2), impact no f0 (grita) |
| N2 | P1, fachada + diário | P2: base.mp3 no f0 sem atraso (medido), tique a meia velocidade, catraca em "pra trás" | lowpass em degraus e eco no twang (exigem arquivo novo), fachada 4×7 (não cabia no bloco) |
| N3 | P2, linha do sorriso | P1: push-in contínuo e canção de ninar (musica a 0,6674) | "respiração" de escala senoidal (é zoom pulsante), arquivo abafado com crossfade (arquivo novo) |
| N4 | P1, ficha suíça | P2: gancho de frenagem, cursor cobalto, gesto 2 da interface no check | marca-texto amarelo (colide com o âmbar do N2), dobra 3D (rotateY pertence ao N2), SF Mono |

**Áudio, pelo pedido do Lucas** ("não gastar créditos, usar os áudios existentes, criar o mínimo"): nenhuma API e **nenhum arquivo de áudio processado**. Tom, andamento, recorte e volume saem das props do `<Audio>` no próprio render. Os únicos arquivos novos são 7 cópias intactas para `remotion/public/audio/v6/`, porque o `staticFile` só lê `public/`. Os arquivos musica, pop, sparkle e riser já estão em `public/audio`. O script de cópia está na seção 7.

**O que medi hoje (só leitura, sem gerar áudio):**
- **base.mp3**: as notas caem em 0,06 / 2,40 / 5,07 / 10,73 / 13,0 / 15,75 / 21,40 / 23,75 / 26,25 s. Começando no f0, sem atraso, elas caem em "pedaço" (f152), "pra" (f322, logo antes de "aprender") e "agradecer" (f642, exato). O atraso de 0,41 s da P1 empurraria esses retornos para f334 e f654.
- **beat1**: o break vai de 14,25 a 15,0 s, a antecipação está em 15,76 s e o drop em 16,02 s. Com `from 220` e `trimBefore 60`, o drop cai em f641, colado em "aprender." (f640).
- **0_sounds**: silêncio até 2,57 s, depois um golpe em si♭4 + fá5 em 2,58 s, que cai a −47 dB em 2,9 s.
- **Soft UI**: o gesto 1 vai de 0 a 0,36 s (pico −25 dB); o gesto 2 está em 1,22 s (sol5, −4 dB).
- **C/tick** dura 50 ms. **pop** = si♭4, **twang** = sol5, **sparkle** = dó (5/6/7).
- **Remotion 4.0.541**: `<Audio playbackRate={r} preservePitch={false}>` vira `asetrate=48000*r,aresample=48000` no render (`@remotion/renderer/dist/stringify-ffmpeg-filter.js`) e também funciona no Studio. Afinar não exige arquivo. Passa-baixa, eco e reverso exigiriam arquivo, então ficaram de fora.
- **Fontes** (NSFontManager): SF Mono não aparece por nome. Big Caslon só tem o peso Medium. Didot não tem Bold Italic (o cartão da P1 passa a usar Didot Italic). Helvetica Neue Condensed Bold e Black só entram via `@font-face { src: local('HelveticaNeue-CondensedBold') }`.
- **Repetições cruzadas que eliminei**: zoom de mergulho (fica só no N3), pincel (só no N3), rotateY (só no N2), recuo de câmera no gancho (só no N3), persiana (só no N2), abertura sem trilha (só no N1).

## 2. Matriz anti-repetição
| Dimensão | N1 · A capa dela | N2 · A noite dela | N3 · Linha do sorriso | N4 · Medir com calma |
|---|---|---|---|---|
| Revista / objeto | capa de moda; mão chapada entrelaçada à manchete | revista literária noturna; fachada + diário | natureza-morta de beleza; gota e esmalte | guia comparativo suíço; ficha + cursor |
| Fundo | osso #EEE8E1 | noite-ameixa #1B1220 | leite #FBF3EE | papel-frio #EDEFEA |
| Destaque exclusivo | vermelho-esmalte #A6192E | âmbar #E9A23B | rosa-chá #E8A9A3 + branco #FFFFFF | cobalto #3D5AC2 (único frio) |
| Par tipográfico | Didot + Futura | Big Caslon + Gill Sans | Hoefler Text + Optima | Helvetica Neue + Charter |
| Grade | 6 col. assimétrica, sangria | cânone de Van de Graaf | eixo central simétrico | 12 col. suíça, módulo 120 |
| Transições | corte seco no compasso; guilhotina 12° | mini-persiana; janela que abre; persiana; linha que sobe; página virada | morph sorriso→francesinha; mergulho; inundação; gota-página; unha que cresce | colunas deslizantes; bloco cobalto; cursor; recolher em módulos; empurrar |
| Câmera | frontal; tilt de leitura; escala só por corte | tripé; deriva descendente | macro; push-in; recuo e mergulho | ortográfica; só em eixo; zero zoom |
| Física | mola com overshoot de 3,1% | crítica, 0% | esmalte superamortecido; sorriso 1,7% | só bezier, 0%, sem molas |
| Legenda | Futura à esquerda, fio que escorrega, palavra promovida a manchete | a legenda é o diário (cursor que compõe) | palavra pintada (contorno + esmalte que sobe) | linha de tabela, célula cobalto, linha arquivada |
| Gancho 0–3 s | ação interrompida + corte em 1 s + silêncio | subtração rítmica das janelas | queda da gota + recuo | frenagem do "feed" em "Antes" |
| Cartão final | capa assinada; retângulo vermelho | última página âmbar; 23:59→00:00 | unha gigante que sorri | contador 0:00→2:00; caixa marcada; faixa cobalto |
| Trilha | beat1 (fá maior), corte + drop | base (sol# menor), inteira e crua | musica a 0,6674 (sol maior, 80 bpm) | beat2 a 0,5 (dó grave, 60 bpm) |
| Efeitos | abertura (si♭ + fá) ×1 | tick a 0,5 ×14; twang −8 st ×1 | pop afinado ×4; sparkle −5 st ×1 | riser −15,4 st ×1; interface g1 ×5 + g2 ×1 |
| Abertura sonora | silêncio absoluto até f209 | tiques graves + nota escura | pop da gota → canção de ninar | clique de freio → rumor que sobe |
| URL no cartão | Futura em retângulo vermelho | Gill Sans sob fio lilás | Optima como linha de crédito | Helvetica em faixa cobalto |

## 3. Convenções comuns
- **dB** é o ganho aplicado ao volume do `<Audio>` (0 dB = arquivo cru). **Duck** é a redução extra só durante a fala (motor v6: ataque de 6 f, soltura de 10 f). A voz fica em 0 dB (−21 a −22 dBFS RMS, medido). O leito mira ~12 dB abaixo da voz sob a fala e ~6 dB nas pausas e no cartão. O ajuste final é de ouvido.
- **Zona segura 9:16**: nada essencial em y < 250 nem em y > 1500. **1:1** é o recorte do quadrado y 420–1500 (`sq` no motor); cada vídeo diz o que muda.
- **Movimento**: sem opacidade animada, sem degradê, sombra ou blur. Rampas de volume são permitidas (a proibição de fade é visual). Saída ≈ 60% da entrada.
- **Fontes** com `font-synthesis: none` (nada de itálico ou negrito sintético), carregadas antes do f0 por `useSystemFonts`.

## 4. N1 · A capa dela (cansaço → caminho → orgulho)
**Conceito.** Cada cena é uma capa de revista de moda (Harper's Bazaar de Fabien Baron). Uma palavra-manchete gigante em Didot sangra nas bordas e passa ATRÁS dos dedos de uma mão chapada (palma + 5 ovais), como o logotipo atrás da cabeça da modelo. O arco é cromático: a capa nasce cinza e o vermelho só entra inteiro na virada. A frase que converteu vira hierarquia tipográfica: "coragem" riscada, "pequena" minúscula, "aprender." gigante.
**Paleta.** osso #EEE8E1 (fundo) · grafite #1A1416 (tipo, fios, legenda) · cinza-cansaço #A8A19B (a mão até f209) · vermelho-esmalte #A6192E (destaque) · areia #D9B79E e canela #A97A5E (peles depois da virada). Unha nua em osso.
**Tipo.** Didot (Regular, Italic, Bold) + Futura (Medium 500, Bold 700). Manchete: Didot 230 px, tracking −0,02 em, sangrando 40–60 px. Didot nunca abaixo de 90 px. Legenda: Futura Medium 60 px, caixa-baixa. Linhas de capa: Futura 30–34 px, caixa-alta, +0,14 em.
**Grade.**
- 6 colunas: margem 72, calha 24, coluna 136 (x 72 / 232 / 392 / 552 / 712 / 872); linha de base 12. Manchete em y 260–640. Mão no quadrado y 420–1500, com as unhas em y 330–760: a manchete atravessa os dedos. A palma sangra abaixo de 1500, onde nada é essencial.
- Legenda em x 72, y 1290–1380. Tudo alinhado à esquerda ou sangrado. 1:1: a manchete desce para y 440–700, a figura vai a escala 0,8 ancorada em y 1380 e a legenda fica em y 1400–1470.
**Câmera.** Frontal, sem rotação e sem zoom contínuo: a escala só muda por corte. Tilt de leitura em cada capa: translateY 0 → −38 px, `Easing.inOut(Easing.sin)`. Paralaxe: manchete 1,0×, figura 1,6×. Mola {mass 1, stiffness 220, damping 22}: ζ 0,74, overshoot 3,1%. Entrada 15 f, saída 9 f.
**Transições (duas, só do N1).**
- (a) **Corte seco no compasso**: f30, f210, f235, f304, f353, f405, f569, f705, f756. (b) **Guilhotina 12°**: um corte reto divide a capa. A metade de cima sai para cima-esquerda e a de baixo para baixo-direita (110% na perpendicular ao corte), em 10 f, bezier(0.7,0,0.84,0). A capa nova já está parada por baixo. Usos: f505–515 ("Não", junto do corte da trilha) e f878–888 (cartão).
**Legenda.** Futura Medium 60 px grafite, x 72, y≈1330, em blocos de até 3 palavras (`capGroups`). A palavra falada ganha um fio de 6 px por baixo (scaleX 0→1 a partir da esquerda, 4 f, bezier(0.2,0,0,1)), que escorrega para a próxima. O fio é grafite até f209 e vermelho depois; na página vermelha (f405–504), legenda e fio ficam em osso. **Palavra promovida (só no N1)**: "cansaço." (f147), "caminho." (f210), "coragem." (f539) e "aprender." (f640) saltam da legenda para a manchete em arco: 12 f, bezier(0.3,0,0,1), de 60 para 230 px ("aprender." vai a 300 px). "pequena:" (f608) também sai da legenda, mas encolhe para Futura 30 px. As palavras restantes fecham o vão em 6 f. O texto grande nunca duplica a legenda, porque é a palavra que saiu dela. A legenda some em f878.
**Gancho 0–3 s.**
- f0–29: plano-detalhe por corte (2,4× a capa) na unha do meio, cinza. O vermelho já cobre 40% a partir da cutícula, com borda reta (é uma barra de progresso, não um pincel), avança até 52% em f0–8 (bezier(0.2,0,0,1)) e congela. f30 ("olhava"): corte seco para a capa inteira. A mão cinza é enorme, a zona de manchete está vazia e só a unha do meio tem cor.
- f30–146: a mão desce 60 px. f140–152: o vermelho recua a 0% (bezier(0.5,0,0.75,0)). Em f147, "cansaço." sobe para a manchete em Didot Italic grafite. Quebra de padrão dupla: um corte em 1 s e silêncio absoluto num feed cheio de música. O laço aberto (a unha pela metade) só fecha em f711–741.
**Mapa.**
- f210–234: capa em cor (osso, mão areia, unhas nuas). "caminho." em Didot Bold vermelho, sangrando à esquerda. f235–404: capítulos I / II / III, em Didot 200 px na zona de manchete, com 1, 2 e 3 mãos (escala 1,0 / 0,72 / 0,56; x 560 · 330 e 750 · 230, 540 e 850). As unhas ficam vermelhas por máscara reta a partir da cutícula (6 f cada, stagger 3 f) em "unhas." (f279), "irmã." (f332) e "vizinha." (f372). A mão da vizinha é canela.
- f405–504: "Hoje," em página inteira vermelha, com uma unha osso de 460×680 (x 310–770, y 500–1180). Em "assinatura" (f474–496), um floreio cursivo abstrato (sem letras) se desenha em osso, 9 px. f505–568: guilhotina para a página osso. "coragem." é promovida em Didot Italic, e em f548–557 um fio grafite de 6 px a risca (bezier(0.6,0,0.2,1)).
- f569–704: página vazia. "pequena:" (f608) fica em 30 px em (72, 900). "aprender." (f640) entra em Didot Bold 300 px vermelho, sangrando à direita, com a mola do N1, e fica 2,2 s na tela. f705–755: a capa do gancho, agora em cor: quatro unhas vermelhas e a do meio em 52%. Em "Sem sair de casa." (f711–741), ela completa até 100% (bezier(0.45,0,0.55,1)).
- f756–877: um "1" em Didot Bold de 900 px, só em contorno grafite de 3 px, desenhado em f760–790. Em "primeira" (f847), o vermelho sobe dentro dele por máscara (15 f, bezier(0.16,1,0.3,1)).
**Cartão (f878–1065).** Guilhotina para a capa final: fundo osso e a mão do gancho completa, com as 5 unhas vermelhas, embaixo à direita.
- Título: "DESCUBRA" (f885) em Futura Bold 34 px caixa-alta; "por onde" (f903) e "começar." (f913) em Didot Italic 150 px grafite, y 360–680. Cada linha sobe por máscara em 9 f: a fala vira o título. Retângulo reto vermelho (sem raio, sem sombra) com "cursosdeunhas.com.br/comecar" em Futura Medium 40 px osso, aberto por máscara horizontal de 9 f em f920.
- "LEVA 2 MINUTOS" (f940) em Futura 30 px. Fecho: o floreio da assinatura, vermelho, 9 px, se desenha sob o retângulo em f975–997. No 1:1, o bloco desce 180 px.
**Som, arco por palavra.**
- f0–209 ("Ela olhava… cansaço. Até que viu um"): silêncio absoluto sob a voz. f210 ("caminho."): o golpe de abertura (si♭ + fá, consonante com fá maior) cai junto do corte para a cor.
- f220–505 ("Primeiro… assinatura dela."): o beat1 entra fino e cresce sozinho (−27 → −20 dB no arquivo): é a rede crescendo. f506–512: rampa até zero junto da guilhotina. f512–629 ("Não começou com coragem. Começou com uma decisão pequena:"): 4 s só de voz.
- f630: o beat1 volta no break do arquivo; antecipação em f633; drop em f641, que é "aprender.". Orgulho. Depois, leito cheio e baixo. No cartão, a partir de f971, o leito sobe e sai em f1029–1065.

| Arquivo | Remotion | ffmpeg equivalente | dB |
|---|---|---|---|
| v6/n1_abertura.mp3 | `from 210`, `trimBefore 77`, `durationInFrames 36` | `atrim=start=2.567:duration=1.2` | −10 (pico −18 dBFS) |
| v6/n1_beat1.mp3 · A | `from 220`, `durationInFrames 292`, `trimBefore 60` | `atrim=start=2.0:duration=9.733` | f220→235: −60→−6; duck −4; f506→512: →−60 |
| v6/n1_beat1.mp3 · B | `from 630`, `durationInFrames 435`, `trimBefore 470` | `atrim=start=15.667` | f630→634: −60→−16; duck −6; f971→985: →−12; f1029→1065: →−60 |

Níveis esperados: leito em −33/−28 dBFS antes do corte e −26 depois do drop (−32 sob a voz). A posição final no arquivo é 30,2 s, de 32,0.
**Proibido no N1.** Qualquer som antes de f210 · vermelho fora da unha do gancho antes de f210 · zoom de mergulho, pincel, gota (são do N3) · persiana e 3D (são do N2) · texto centralizado · Didot abaixo de 90 px e Didot Bold Italic · pílula de legenda · sparkle, whoosh, impact · opacidade e sombra sob a mão.
**Referências.** Fabien Baron, Harper's Bazaar de set/1992 ("Enter the Era of Elegance", Linda Evangelista por Patrick Demarchelier) · Alexey Brodovitch, Harper's Bazaar (1934–58) · Kuntzel + Deygas, abertura de "Prenda-me se for capaz" (2002).

## 5. N2 · A noite dela (silêncio da casa → tempo só dela → gratidão serena)
**Conceito.** A edição noturna de uma revista literária (Hopper + The New Yorker). A fachada de um prédio é a grade da página, e a janela acesa dela vira a coluna onde a narração é composta ao vivo, como um diário. Nada quica. O fólio é um relógio que anda sem ninguém dizer: 23:00 → 23:07 → 23:20 → 23:58, rebobina para 23:00, depois 23:59 → 00:00. Há um único gesto de voltar a página, quando ela "olha pra trás".
**Paleta.** noite-ameixa #1B1220 (fundo) · janela-apagada #2B2030 (janelas, verso da página) · âmbar-abajur #E9A23B (destaque) · papel-lua #F1E6D6 (texto sobre a noite) · lilás-sombra #6B5A78 (fios, fólio).
**Tipo.** Big Caslon Medium (o único peso) no fólio-relógio a 34 px e no título do cartão a 92 px. Gill Sans Regular 62 px no diário: a Light é fina demais para o público de 65+. SemiBold nas palavras-chave, e SemiBold 28 px com +0,12 em na marginália.
**Grade.**
- Cânone de Van de Graaf adaptado: margem interna 120, externa 240, superior 250, inferior 427. O bloco fica em x 120–840, y 250–1493; a margem inferior do cânone coincide com a faixa do Reels. Fachada: 4 colunas × 5 linhas de janelas 150×150, calha 40, em x 120–840, y 300–1210. A janela dela é a coluna 2, linha 3 (x 310–460, y 680–830).
- Marginália em x 870–1040, com o fólio em y 300. Diário numa coluna de 720 px, entrelinha 80, no máximo 3 linhas, em y 1250–1490. 1:1: some a linha 1 da fachada (ficam 16 janelas, 13 acesas) e o fólio desce para y 450.
**Câmera.** Tripé. Deriva descendente de 1% por cena (translateY 0 → +19 px, inOut sine). Sem zoom e sem rotação. Nenhum overshoot: {mass 1.2, stiffness 60, damping 18} (ζ 1,06) e curvas bezier lentas. Entrada 24 f, saída 14 f.
**Transições (só do N2).**
- (a) **Mini-persiana por janela**: uma lâmina janela-apagada desce (apaga) ou sobe (acende) em 5 f, bezier(0.45,0,0.55,1). (b) **Janela que abre** (f100–124): a janela âmbar vira o quadro (clip-path inset do retângulo dela até 0) em 24 f, bezier(0.76,0,0.24,1).
- (c) **Persiana** (f372–396 e f696–720): 8 lâminas de 240 px crescem a partir do topo (scaleY 0→1, 10 f cada, atraso de 2 f), bezier(0.45,0,0.55,1). (d) **Linha que sobe**: no fim de cada frase, o diário sobe 80 px em 12 f, bezier(0.33,0,0.67,1). A linha mais velha é cortada pela borda do bloco, nunca esmaecida.
- (e) **Página virada para trás** (f566–588): rotateY de 0 a +180° com dobradiça na borda direita, perspective 1800, 22 f, bezier(0.65,0,0.35,1), verso chapado. É o único 3D do conjunto.
**Legenda.** A legenda é a página: o diário em Gill Sans 62 px, papel-lua sobre a noite e noite-ameixa sobre o âmbar.
- Cada palavra só existe a partir do seu `s` e é revelada por máscara da esquerda para a direita em min(duração, 8 f). Um cursor de 4 px × 0,9 em acompanha a borda da máscara, sem piscar: âmbar sobre a noite, noite sobre o âmbar.
- "só dela", "aprender" e "agradecer" ficam em SemiBold, em âmbar quando estão sobre a noite. Como não há texto grande paralelo, a legenda nunca duplica.
**Gancho 0–3 s.**
- f0: a fachada com 13 das 20 janelas acesas, espalhadas: o primeiro quadro já é um padrão gráfico forte. Nos tiques f0, f30, f60 e f90, um grupo de 3 janelas apaga por mini-persiana, de fora para dentro (ordem pela distância até a dela). Em f90 só a dela está acesa.
- O laço aberto é "qual janela sobra". O diário compõe "Onze da noite." em f14 e "A casa dorme." em f64. Há subtração em ritmo, sem zoom e sem texto grande ("23:00" grande duplicaria a fala).
**Mapa.**
- f100–371: a janela que abre leva ao interior âmbar (fólio 23:07). Em "pedaço" (f152), um anel lilás de 4 px (o dia) se desenha na metade de cima do bloco, com um setor noite de 15° preenchido. Em "só dela" (f186), o setor cresce 40 px.
- Em "descansar." (f262), o setor vira uma cápsula deitada de 520×200, por interpolatePath em 14 f. Em "aprender" (f329), a cápsula se levanta em uma oval de unha de 300×420: é a virada. Em "unhas." (f350), a oval ganha a borda livre.
- f372–565: persiana noite para 2 fileiras de 5 ovais de 110×160 (x 120–830, y 600–960), fólio 23:20. Uma oval acende por mini-persiana a cada 18 f, de f387 a f549. Há tiques em "Uma" (f380) e "Uma" (f432). f566–695: página virada para a fachada, toda apagada menos a dela (23:58).
- f602–630: o fólio rebobina até 23:00 (dígitos rolando, bezier(0.65,0,0.35,1)) sobre a catraca. Em "agradecer" (f642), todas as janelas acendem, irradiando a partir da dela (3 f por anel de distância). Logo depois de "noite." (f689), entra o twang.
**Cartão (f696–868).** Persiana âmbar para uma página inteira âmbar. "Se der vontade, / veja por onde / começar." é composto ao vivo em Big Caslon 92 px noite-ameixa, x 120, y 560–900, cada palavra no seu `s` (f704–764): a legenda vira o título. f776: fio lilás de 1,5 px (x 120–840, y 980) em 12 f. f780: "cursosdeunhas.com.br/comecar" em Gill Sans SemiBold 40 px noite, por máscara de 10 f. f800: o fólio rola de 23:59 para 00:00 (contador vertical, 20 f, bezier(0.16,1,0.3,1)): a noite vira o primeiro dia. Sem botão, sem pílula, sem símbolo.
**Som, arco por palavra.**
- "Onze da noite. A casa dorme.": é o silêncio da casa. 4 tiques graves e a base escura, com notas em f2 e f72. "pedaço" (f152): uma nota da base cai no quadro exato.
- "…descansar." (f210–321): a base decai sozinha até −40 dB no arquivo. Descansar é silêncio. f322 ("pra aprender"): a base volta. É a virada.
- "Uma…" (f380 e f432): um tique em cada. "…olhar pra trás…": o segundo vazio do arquivo, com a catraca cada vez mais baixa.
- "agradecer" (f642): a base reentra no quadro exato. Logo depois de "noite." (f689, antes de "Se"): twang −8 st (sol → si, a terça de sol# menor). É o primeiro som claro do filme.
- No cartão, notas em f713 e f788; o leito sai em f840–868.

| Arquivo | Remotion | ffmpeg equivalente | dB |
|---|---|---|---|
| v6/n2_base.mp3 | `from 0`, `durationInFrames 868`, `trimBefore 0` | nenhum | −9; duck −3; f777→792: →−6; f840→868: →−60 |
| v6/n2_tick.wav | `playbackRate 0.5`, `preservePitch false`, `durationInFrames 4` | `asetrate=48000*0.5,aresample=48000` (uma oitava abaixo, 0,1 s) | f0, 30, 60, 90: −6 · f380, 432: −9 · f602…630, a cada 4 f (8 tiques): −10 → −22 |
| v6/n2_twang.wav | `from 689`, `playbackRate 0.63`, `preservePitch false`, `durationInFrames 34` | `asetrate=48000*0.63,aresample=48000` (1,11 s) | −22 (pico ≈ −24 dBFS; o arquivo tem pico de −2,0) |

**Proibido no N2.** Cortes secos · overshoot · zoom ou rotação de câmera · "23:00" em texto grande · estrelas, lua, degradê e opacidade piscando (do v5) · som claro antes de f642 · Didot, Futura, Helvetica, Optima, Hoefler, Charter · itálico ou negrito sintético · beat1, beat2, musica.
**Referências.** Edward Hopper, "Night Windows" (1928, MoMA) · Jan Tschichold e o cânone de Van de Graaf ("A forma do livro") · The New Yorker, coluna "The Talk of the Town".

## 6. N3 · Linha do sorriso (ternura → orgulho de cuidar)
**Conceito.** Uma prancha de natureza-morta de revista de beleza: a unha como objeto de estúdio (Penn para a Clinique), em forma chapada. O sorriso da fala e a "linha do sorriso" da francesinha são a mesma curva, e esse é o match cut central. Física de esmalte: arranca devagar, escorre e assenta sem quicar. Gota, menisco e três pinceladas, como na técnica real.
**Paleta.** leite #FBF3EE (fundo) · rosa-chá #E8A9A3 (esmalte, inundação, destaque) · ameixa #6E1F45 (tipo, contornos, a mão de trás, esmalte escuro) · branco-francesinha #FFFFFF (só na linha do sorriso, sempre sobre rosa-chá ou ameixa).
**Tipo.** Optima Bold 60 px na legenda e Regular 38 px na URL. Hoefler Text Italic nas palavras-chave da legenda, no mesmo corpo, e Black Italic 88 px no título do cartão. Nada em caixa-alta.
**Grade.**
- Eixo central simétrico em x 540; é o único vídeo centrado. Unha-herói de 520×760, centro (540, 900), em y 520–1280, com respiro de pelo menos 180 px de cada lado.
- Mão vista de cima: 5 unhas de 150×220 num arco de raio 520 com centro em (540, 1300), a −36/−18/0/18/36°. Centros: (234, 879), (379, 806), (540, 780), (701, 806), (846, 879). Legenda centrada, linha de base em y 1430. No 1:1 tudo já cabe no quadrado, e nada muda.
**Câmera.** Macro de bancada, sem rotação. Push-in monotônico de 4% por cena (1,00 → 1,04, `Easing.inOut(Easing.cubic)`), sem nenhuma "respiração" senoidal. Paralaxe em 3 planos: fundo 0,6×, unhas 1×, gota e linha 1,4×. Recuo de 2,6× para 1× no gancho (f12–72, bezier(0.65,0,0.35,1)). Travelling de −640 px em "ser essa pessoa" (f259–287), com mola superamortecida {mass 1.2, stiffness 70, damping 20} (ζ 1,09). Mola só para o sorriso: {mass 1, stiffness 90, damping 15}, ζ 0,79, overshoot 1,7%. O esmalte sempre corre em bezier(0.45,0,0.15,1). Entrada 18 f, saída 11 f.
**Transições (nenhum corte seco; todas só do N3).**
- (a) **Match cut por morph**: em "sorriso." (f204), uma curva ameixa de 10 px se desenha em 8 f e vira, por interpolatePath (f212–226, bezier(0.65,0,0.35,1)), a linha do sorriso branca de uma francesinha. O contorno da unha se desenha em volta em f226–236. (b) **Mergulho na unha** (f403–433): escala de 1 a 9× sobre a unha recém-pintada, bezier(0.65,0,0.35,1). Nos últimos 12 f, a cena seguinte nasce dentro de uma máscara com o contorno exato da unha, que cresce de 1 a 14×.
- (c) **Inundação** (f529, "bonita."): um campo rosa-chá desce do topo em 20 f, bezier(0.45,0,0.15,1). A borda de baixo é uma linha do sorriso (arco côncavo com flecha de 120 px). (d) **Gota-página** (f632–650): uma gota leite cai em 8 f (bezier(0.55,0,1,0.45)), toca o fundo em "pra" (f642) e se espalha em menisco até cobrir o quadro (10 f, bezier(0.22,1,0.36,1)).
- (e) **Unha que cresce**: entrada do cartão, descrita abaixo.
**Legenda.** Palavra pintada. Optima Bold 60 px centrada, em blocos de até 3 palavras; a palavra que ainda não foi dita não aparece.
- Em s−2, a palavra surge só em contorno ameixa de 2,5 px, e o preenchimento sobe por dentro das letras como esmalte (máscara de baixo para cima, 6 f, bezier(0.45,0,0.15,1)). Quando a próxima palavra começa, o preenchimento da anterior escorre para baixo em 4 f, e ela fica só em contorno. Só a palavra falada está cheia.
- "sorrir", "sorriso", "detalhe", "bonita" e "cuidar" vão em Hoefler Text Italic. Saída do bloco: desce 30 px atrás de uma máscara em 4 f. A legenda some em f746.
**Gancho 0–3 s.**
- f0: câmera a 2,6× sobre uma gota rosa-chá em forma de lágrima, com 300 px (~40% da largura), já em queda sobre o leite. O contorno de uma unha nua entra por baixo. f12: a gota toca a unha (pop afinado, e a canção de ninar nasce no mesmo quadro) e vira um menisco que enche a oval em 30 f (bezier(0.22,1,0.36,1)).
- f12–72: o recuo revela que é uma de 5 unhas de uma mão, com as outras quatro já pintadas. A revelação cai em "mão" (f72). "sorrir" (f114): as 5 linhas do sorriso brancas se desenham nas pontas (4 f cada, stagger 3 f, mola do N3). É uma ação física em 0,4 s, sem gritar.
**Mapa.**
- f153–231: em "alguém" (f172), uma mão ameixa sobe por trás da primeira (atrás no z, 140 px acima e à direita, 18 f) e segura a dela. Em "sorriso." (f204), o match cut (a). f232–402: a francesinha grande. O travelling revela uma unha nua à direita. Em "devolve" (f312), a linha branca se solta e viaja em arco por 20 f; pousa em "mulher." (f362), e a unha se pinta de rosa-chá por menisco a partir do ponto de pouso (24 f).
- f403–528: mergulho (b) até o macro de uma borda de unha nua, com o arco da cutícula em ameixa de 12 px. f529–631: inundação (c). Sobre o campo, uma unha leite de 360×520 recebe três pinceladas ameixa (faixas de ponta arredondada, 8 f, bezier(0.16,1,0.3,1)): o centro em "Aprender" (f560), a esquerda em "aprender" (f596) e a direita em "cuidar." (f613). A linha branca se desenha em f622.
- f632–745: gota-página (d) para três unhas nuas em fila (x 300 / 540 / 780, 200×290). Cada uma enche em menisco em "zero," (f662), "ritmo," (f690) e "casa." (f730).
**Cartão (f746–880).**
- f746–764: a unha do meio cresce até 640×940, centrada (18 f, bezier(0.45,0,0.15,1)), e as laterais saem ±700 px em 11 f. Dentro dela, em Hoefler Text Black Italic 88 px ameixa: "Veja qual / caminho / é o seu.". Cada linha é pintada de baixo para cima, como a legenda, em f752, f765 e f777.
- Em "seu." (f786), a linha do sorriso branca se desenha na ponta (10 f, mola do N3): o cartão sorri. f792: "cursosdeunhas.com.br/comecar" em Optima Regular 38 px ameixa, em y 1440, por máscara de 8 f. Sem botão, sem brilho estrelado.
**Som, arco por palavra.**
- f12: o impacto da gota. Pop em sol4 e a canção de ninar nasce junto (musica a 0,6674: sol maior, 80 bpm, baixa). Ternura sob "Sabe aquela sensação… sorrir sozinha?". f153–528: leito baixo e constante, sem nada brilhante.
- "bonita." (f529): o leito sobe 5 dB em 10 f e entra o único brilho, um sparkle afinado em sol. f560–745: orgulho de cuidar. As gotas soam em arpejo de sol maior (sol, si, ré) em "zero", "ritmo" e "casa".
- Cartão: o leito sobe depois de "seu." e sai em f845–880.

| Arquivo | Remotion | ffmpeg equivalente | dB |
|---|---|---|---|
| musica.mp3 (já em public/audio) | `from 10`, `durationInFrames 870`, `playbackRate 0.6674`, `preservePitch false` (o 1º ataque cai em f12) | `asetrate=48000*0.6674,aresample=48000` (ré → sol, 120 → 80 bpm) | f10→22: −60→−19; duck −4; f529→539: →−14; f792→806: →−10; f845→880: →−60 |
| pop.mp3 (já em public/audio) | `from 12`, `playbackRate 0.8409` (si♭4 → sol4), `durationInFrames 18` | `asetrate=48000*0.8409,aresample=48000` | −6 |
| pop.mp3 | f662 a 0.8409 (sol4) · f690 a 1.0595 (si4) · f730 a 1.2599 (ré5) | idem, com o fator de cada uma | −10 cada |
| sparkle.mp3 (já em public/audio) | `from 529`, `playbackRate 0.7491` (dó → sol, 1,98 s), `durationInFrames 60` | `asetrate=48000*0.7491,aresample=48000` | −9 |

Níveis esperados: leito em −33 dBFS (−37 sob a voz), −28 depois de "bonita" e −24 no cartão. Opcional, só se o Lucas liberar 1 arquivo: `tools/dsp.py public/audio/musica.mp3 public/audio/v6/n3_abafada.wav lowpass=800`, para a "porta que abre" em "bonita".
**Proibido no N3.** Cortes secos · retas, tabela, grade, check, cursor (são do N4) · persiana, janela, página virada (N2) · palavra promovida, guilhotina, sangria tipográfica (N1) · caixa-alta · respiração de escala ou zoom pulsante · rotação de câmera · brilho antes de f529 · pílula de legenda.
**Referências.** Irving Penn, naturezas-mortas para a Clinique (desde 1968) · Cereal Magazine (respiro extremo, objeto único) · Saul Bass, abertura de "Um Corpo que Cai" (1958, o mergulho no detalhe) · o vocabulário de manicure: linha do sorriso e esmaltação em três pinceladas.

## 7. N4 · Medir com calma (dúvida → método → segurança)
**Conceito.** Um guia comparativo de revista de consumo, em grade suíça: uma ficha impressa que se preenche, com um cursor cobalto como personagem. A calma vem do rigor: tudo alinha na grade, nada quica e todo movimento é em eixo. A narração é arquivada na própria tabela. Preço só relativo ($ · $$ · $$$). Os três caminhos são colunas encabeçadas por Harvey balls (○ ◐ ●), não por nomes.
**Paleta.** papel-frio #EDEFEA (fundo) · grafite #1D2125 (tipo, fios) · fio #C9CDC6 (hairlines inativas) · cinza-régua #A3A8A1 (palavras ainda não ditas, números inativos; é troca de cor, não opacidade) · cobalto #3D5AC2 (destaque, o único frio do conjunto).
**Tipo.**
- Helvetica Neue Medium: legenda a 56 px, rótulos a 30 px. Helvetica Neue Condensed Bold (01–04, $ a 64 px) e Condensed Black (contador a 260 px), via `@font-face local()`, com algarismos tabulares.
- Charter Italic: os três "?" do gancho a 220 px e a nota do cartão a 28 px.
**Grade.**
- 12 colunas: margem 64, calha 16, coluna 64,7; linha de base 8; módulo de linha 120. Rótulos nas colunas 1–3 (x 64–290). Caminhos nas colunas 4–6 (307–533), 7–9 (549–775) e 10–12 (791–1016).
- Cabeçalho em y 480–700, linhas a partir de y 700. A legenda é a linha de rodapé, em y 1300–1396, com fios de 1,5 px de margem a margem. Tudo alinhado à esquerda; só o contador é centralizado. No 1:1 tudo cabe, e nada muda.
**Câmera.** Mesa ortográfica: nenhum zoom, nenhuma rotação, nenhum 3D. Só deslocamentos em x ou em y, em múltiplos do módulo, com bezier(0.83,0,0.17,1), overshoot 0 e paradas de pelo menos 45 f. Nas paradas, deriva de +0,4 px/f em x. Sem molas. Entrada 12 f, saída 7 f.
**Transições (só do N4).**
- (a) **Colunas deslizantes** (f146–165, "comparou."): as colunas de caminho 1 e 3 sobem (−100%) e a 2 desce (+100%), em 16 f com atraso de 3 f. O conteúdo novo entra pelo lado oposto. (b) **Bloco cobalto que vira página** (f319–341): a célula cobalto de "Porque" cresce na vertical (scaleY 1→20, 10 f, bezier(0.7,0,0.3,1)), e um painel de papel de borda dura entra da direita em 12 f.
- (c) **Cursor de medição** (f415–433): um fio cobalto de 3 px atravessa da esquerda para a direita em 18 f, bezier(0.65,0,0.35,1). À esquerda dele, a cena nova; marcas de 12 px nascem em y 1200 a cada 54 px. (d) **Recolher em módulos** (f640–664): as colunas deslizam para a esquerda em 3 paradas de 8 f, até virar uma barra única de 226 px.
- (e) **Empurrar para cima** (f702–714): a barra sai pelo topo e o cartão sobe, em 12 f.
**Legenda.** Linha de tabela em Helvetica Neue Medium 56 px, x 64, linha de base em y 1368.
- O bloco inteiro aparece desde o início: as palavras não ditas em cinza-régua, as ditas em grafite. A palavra falada vira uma célula cobalto (palavra + 16 px de cada lado) com texto papel, por corte em s−1, e volta ao normal quando a próxima começa.
- **Legenda arquivada (só no N4)**: no fim de cada critério ("ensina." f194, "certificado." f239, "custa." f276, "garantia." f312), um fio de 2 px se desenha sobre a linha (8 f) e a empurra 120 px para cima em 10 f (bezier(0.65,0,0.35,1)). Ela vira a linha mais nova da tabela, empilhando as anteriores. O rótulo da tabela é a própria legenda que subiu, então o mesmo texto nunca aparece duas vezes. A legenda some em f708.
**Gancho 0–3 s.**
- f0–14: a ficha corre para cima como um feed (fios a cada 120 px, números 01, 02, 03… em Condensed Bold 40 px cinza-régua) a ~120 px/f. Desacelera (bezier(0.22,1,0.36,1)) e para seco, sem overshoot, exatamente em "Antes" (f14), com um clique. É o polegar de quem rola o Reels parando. Na parada, a ficha em branco: três "?" em Charter Italic 220 px e as linhas vazias 01–04.
- f20: o cursor cobalto (3 px, y 480–1180) se desenha na coluna 1 (x 420). Salta para a 2 em "curso" (f46) e para a 3 em "ela" (f83), em 8 f e sem som. Volta ao zero (x 64) em "simples:" (f110). É a dúvida.
**Mapa.**
- f146–318: ficha de método, com as colunas de caminho vazias. Os critérios são arquivados como linhas, com um clique em "ensina" (f177), "certificado" (f213), "custa" (f255) e "garantia" (f291). f319–414: papel quase vazio e um fio grafite de 2 px em y 960. O cursor sai de x 64 em f341 e desliza até x 540 (46 f, bezier(0.45,0,0.55,1)), parando exato em "calma." (f387), sem recuo. É o movimento mais lento do filme.
- f415–639: a tabela dos três caminhos. Em "três" (f439), as Harvey balls cobalto de 120 px aparecem por máscara de cima (8 f, stagger 3 f). "do zero ao alongamento" (f477–518): uma seta-fio se desenha da coluna 4 à 12, em y 660. As linhas são as legendas arquivadas ("O que ensina.", "Quanto custa.", "Se tem garantia."). "ensina," (f548): barras cobalto de 12 px com 1/3, 2/3 e 3/3 da coluna. "preço" (f569): $ / $$ / $$$. "garantia" (f590): três quadrados cobalto de 40×40, idênticos. As colunas começam desencontradas (−6, +6, −4 px) e encaixam em "lado" (f608), em 8 f.
- f640–707: recolher em módulos até uma barra à esquerda e o resto do papel vazio. O leito some: puro respiro ("Sem pressa, sem pressão.").
**Cartão (f702–873).**
- Em "dois" (f718), um contador em Helvetica Condensed Black 260 px, centrado (y 560–780), roda de 0:00 a 2:00 em 30 f (bezier(0.16,1,0.3,1)). Linha de tabela em y 900–1000: uma caixa de 56×56 em x 64 e "qual caminho é o seu" em Helvetica Medium 52 px, palavra por palavra no seu `s` (f753–777).
- Em "seu." (f777), um check cobalto de 6 px se desenha na caixa em 8 f. f785: faixa cobalto reta de margem a margem (y 1340–1440) com "cursosdeunhas.com.br/comecar →" em Helvetica Medium 42 px papel, por máscara de 7 f.
- f800: nota em Charter Italic 28 px, em y 1240: "conteúdo, preço e garantia lado a lado".
**Som, arco por palavra.**
- "Antes de pagar… uma coisa simples:" (dúvida): o clique da frenagem em f14 e um rumor grave que nasce quase inaudível e sobe até −28 dBFS. Nada tonal. "comparou." (f146): o rumor corta seco. f146–171: sem leito, a decisão.
- f172–414 ("O que ensina… calma."), método: um pulso lento e grave, com um clique idêntico por critério (método não sobe de tom). Em "calma." o leito cai 4 dB. "A gente reuniu… lado a lado." (segurança): o leito constante, sem efeito.
- "Sem pressa, sem pressão." (f640–703): o leito vai a −40 dB, o único silêncio no meio do vídeo. "Leva…" (f704): o pulso volta. Em f776, o gesto 2 (sol5, a dominante de dó) no check: uma confirmação contida.

| Arquivo | Remotion | ffmpeg equivalente | dB |
|---|---|---|---|
| riser.mp3 (já em public/audio) | `from 0`, `durationInFrames 146`, `playbackRate 0.41`, `preservePitch false` | `asetrate=48000*0.41,aresample=48000` (−15,4 st; 2,0 → 4,88 s) | −3; f145→146: →−60 (corte seco) |
| v6/n4_interface.mp3 · gesto 1 | `from` 14 / 177 / 213 / 255 / 291, `trimBefore 0`, `durationInFrames 11` | `atrim=end=0.36` | 0 (pico −25 dBFS) |
| v6/n4_interface.mp3 · gesto 2 | `from 776`, `trimBefore 36`, `durationInFrames 20` | `atrim=start=1.2:end=1.867` | −10 (pico −14 dBFS) |
| v6/n4_beat2.mp3 | `from 172`, `durationInFrames 701`, `playbackRate 0.5`, `preservePitch false` | `asetrate=48000*0.5,aresample=48000` (dó uma oitava abaixo, 60 bpm) | f172→184: −60→−18; duck −3; f380→392: →−22; f415→427: →−18; f640→650: →−40; f704→714: →−18; f784→798: →−14; f840→873: →−60 |

**Proibido no N4.** Molas e overshoot · zoom, rotação, 3D (rotateY é do N2) · persiana (N2) · curvas orgânicas, gota, menisco, pincel (N3) · palavra promovida e corte seco de cena (N1) · preço em R$ e nome dos cursos · sombra · check antes do cartão · Didot, Bodoni, Optima · trilha antes de f172 · whoosh.
**Referências.** Josef Müller-Brockmann, "Grid Systems in Graphic Design" (1981) · Consumer Reports e as tabelas com Harvey balls · Monocle, páginas de survey e rankings.

## 8. Para implementar (sem crédito, sem áudio novo)
- Tudo entra por `V6Def` em `remotion/src/v6/n{k}.tsx`, no motor v6 (`V6Ad`). O `Ad.tsx` do v5 não muda.
- **Motor**:
  - `Sfx` precisa de `trimBefore`, `durationInFrames`, `playbackRate` com `preservePitch={false}` e ganho por quadro.
  - `Track` precisa de `trimBefore` (no lugar do `startFrom`, obsoleto), `playbackRate`, rampa configurável (hoje fixa em 12 e 18 f) e curva de ganho por chaves em dB, além do `duckDb`.
- **Transições novas**: guilhotina (2 polygons), mini-persiana, página virada (rotateY + backface-visibility), máscara de unha e borda-sorriso (`clip-path: path()`), colunas deslizantes, cursor. `T.slats` e `T.push` já existem.
- **Fontes** (`useSystemFonts`):
  - N1: `400 230px Didot`, `italic 400 150px Didot`, `700 300px Didot`, `500 60px Futura`, `700 34px Futura`.
  - N2: `500 92px "Big Caslon"`, `400 62px "Gill Sans"`, `600 28px "Gill Sans"`.
  - N3: `700 60px Optima`, `400 38px Optima`, `italic 400 60px "Hoefler Text"`, `italic 900 88px "Hoefler Text"`.
  - N4: `500 56px "Helvetica Neue"`, `700 64px HNCond`, `900 260px HNCond`, `italic 400 220px Charter`.
- **Cópias** (são os únicos arquivos novos; o `#` e a vírgula saem do nome porque quebram a URL do `staticFile`):
```sh
cd /Users/lucasmqar/Desktop/lovit/cursosdeunhas/marketing/remotion/public/audio/v6
F=/Users/lucasmqar/Desktop/flux/flux/outputs/marketing-2026-11/motor/public/trilha; C=/Users/lucasmqar/Desktop/lovit/canal/02-motor/public/sfx
cp "$F/beat1.mp3" n1_beat1.mp3; cp ~/Downloads/"0_sounds_to_inicial__#4-1786641394099.mp3" n1_abertura.mp3
cp "$F/base.mp3" n2_base.mp3; cp "$C/tick.wav" n2_tick.wav; cp "$C/twang.wav" n2_twang.wav
cp "$F/beat2.mp3" n4_beat2.mp3; cp ~/Downloads/"Soft,_electronic_UI__#4-1786641379593.mp3" n4_interface.mp3
```
- **Ficam de fora de propósito**: whoosh (S e C), impact, C/impacto, Notification ping e F/sfx2/*. Nenhum whoosh em corte, nenhuma trilha repetida e nenhum arquivo em mais de um vídeo.
- **Antes do Meta**: stills por cena e uma folha de contato para o Lucas (regra 9), e conferir de ouvido o nível dos leitos, o gesto 1 da interface e o twang a −8 st.
