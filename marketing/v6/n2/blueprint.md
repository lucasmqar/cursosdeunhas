# N2 · A noite dela · blueprint v6

09/11/2026 · Equipe de Engenharia de Crescimento + Direção de Criação. Fonte de verdade: `v6/LIVRO-DE-ASSINATURAS.md` §5. Tempos: `remotion/src/timing/n2.json`. Quadros como o motor calcula (`Math.round((0,45 + s) × 30)`).
**Duração: 868 f = 28,93 s.** O motor soma 0,45 + duração do arquivo de voz (25,89 s) + 2,6. A última palavra termina em 25,42 s; somando a partir dela daria 854 f, e o cartão perderia 14 f. Ficamos com 868, o mesmo total do livro.
Nenhum crédito gasto, nenhum áudio gerado e nenhum arquivo processado. Os únicos arquivos novos de áudio são 3 cópias intactas (§5).

## 1. Auditoria & validação

**O que o roteiro já faz bem (não muda):**
- "Onze da noite. A casa dorme." monta uma cena concreta (hora e lugar) em 2,98 s, sem pedir nada. A identificação é pela situação e fica em terceira pessoa, então não afirma nada sobre quem assiste (compliance ok).
- "o pedaço do dia que é **só dela**": autonomia. É a palavra-chave emocional do filme.
- "Tem quem use esse tempo pra descansar. E tem quem use pra aprender a fazer unhas.": o contraste não julga ninguém, porque descansar não está errado. Isso gera pouca reatância no público 65+, que concentrou o gasto.
- "Uma aula de cada vez. Uma unha de cada vez.": anáfora e passo mínimo. É o mesmo mecanismo da única peça que converteu ("Começou com uma decisão pequena: aprender.", N1 imagem: CTR 4,58%, 70 cliques e os 7 leads).
- "Sem pressa, sem sair de casa." derruba as duas objeções de quem tem 45–65+: tempo e deslocamento.
- "Um dia ela vai olhar pra trás… e agradecer por essa noite." fala com o eu futuro. Na gravação, "trás…" dura 0,94 s, um vão natural para um gesto.
- "Se der vontade, veja por onde começar." é um CTA de permissão e combina com o destino de uma pergunta só (/comecar/).

**O que falhou no v1** (19 views, p25 = 10, p75 = 2): metade das pessoas saiu antes de 25%, e ~90% antes de 75%. O gancho era um "22:59 → 23:00" grande, que repetia a fala, mais lua, fades e um primeiro quadro sem padrão forte. Os insumos chegam ao mesmo diagnóstico: o gancho visual é o gargalo.

**Gatilho injetado: um laço aberto por subtração que vira progresso visível em passos mínimos.**
1. **Gancho (Zeigarnik + pop-out pré-atentivo).** No f0, 13 janelas estão acesas: 12 em papel-lua e só a dela em âmbar. O olho acha a diferente em menos de 200 ms. A cada tique, 3 janelas apagam, de fora para dentro, e a pergunta "a dela sobra?" segura o polegar. A resposta vem em f95, e em f100 a janela abre: a recompensa chega 0,17 s depois.
2. **Corpo (efeito do progresso dotado / gradiente de meta).** A página âmbar fecha de volta numa janela, e essa janela vira a 1ª de 10 janelas-unha (retângulos de canto vivo de 120×170: as unhas de duas mãos, desenhadas com o vocabulário da fachada). As outras 9 acendem uma a uma, a cada 11–12 f, até "pressa," (f497); em "sem sair de casa." a fileira completa fica parada por 2 s. É a tradução visual de "decisão pequena", o único dado de conversão que temos. Nada se completa em "casa.": esse fecho é do N1.
3. **Payoff (gratidão antecipada).** O fólio rebobina até 23:00 ("essa noite"), e em "agradecer" a luz dela acende o prédio inteiro. A base escura sai, e dois twangs (si, depois ré#) formam si maior, a relativa maior, no "00:00" do cartão: o som chega à serenidade da fala.
4. **CTA (permissão).** "Se der vontade", sem botão e sem urgência.

**Escolhas que vêm dos dados:**
- Só Reels e Stories entregaram. Por isso o 9:16 é o principal, tudo fica em y 250–1500 e o elemento-chave fica no quadrado y 420–1500.
- O diário é a própria legenda e já tem texto em f14, então o vídeo funciona no mudo.
- Para o público 65+: Gill Sans Regular a 62 px (a Light é fina demais), contraste de 14,8:1 (papel-lua sobre a noite) e de 8,4:1 (noite sobre o âmbar).
- O fim fica parado no CTA (2,27 s). O Stories avança em vez de repetir, então não há loop.

## 2. Upgrade do gancho (0–3 s)

Fachada de 4 × 5 janelas de 150 px, com calha de 40, em x 120–840 e y 300–1210. A dela é a c2l3 (x 310–460, y 680–830). A linha 1 já nasce apagada, e assim o 1:1 (sem a linha 1) mantém 16 janelas, 13 acesas: a mesma conta.

| f | Voz (s) | Fachada | Tipografia cinética | Som |
|---|---|---|---|---|
| 0 | — | 13 acesas (12 em papel-lua + a dela em âmbar). G1 apaga por mini-persiana (f0–5): c4l5, c4l2 e c1l5, os cantos do bloco | fólio "23:00" pequeno e parado; cursor âmbar de 4×56 parado em x 120, na linha de escrita | tique 1 (−18 dB) |
| 2 | — | — | — | 1ª nota da base (sol# menor), a −22 dB |
| 14–22 | "Onze" 0,45 | — | "Onze" se revela por máscara da esquerda para a direita (8 f), com o cursor junto da borda | — |
| 27–41 | "da noite." 0,91 | f30–35: G2 apaga (c3l5, c4l3, c2l5) | "da" (6 f), "noite." (8 f) | tique 2 (−18) |
| 47–59 | pausa | — | a coluna sobe 80 px, e o cursor volta a x 120 no mesmo movimento | — |
| 60–65 | pausa | G3 apaga (c1l2, c3l2, c3l4) | — | tique 3 (−18) |
| 64–82 | "A casa dorme." 2,13 | — | "A" (3 f), "casa" (7 f), "dorme." (8 f) | f72: 2ª nota da base, em "casa" (−22, duck −6) |
| 90–95 | "dorme." | G4 apaga (c1l3, c3l3, c2l4), as vizinhas: sobra só a dela | — | tique 4 (−18) |
| 95–99 | — | uma janela âmbar no centro do quadrado e o prédio apagado | f101: a coluna sobe para "Pra" | — |
| 100–124 | "Pra" 3,49 (f105) | a janela dela abre e vira a página âmbar (t2) | a cor do diário vira noite na borda da máscara | f105–124: a base sobe de −22 para −9 com a janela |

- **Quebra de padrão.** O feed é claro, barulhento e aditivo, com coisas que aparecem. Este gancho é escuro, quieto e subtrativo: as coisas somem. Há movimento desde o f0 (G1), então os primeiros 200 ms já mexem. O ritmo é de 1 Hz, como um relógio de parede: dá para prever quando a próxima apaga, mas não onde termina.
- **Som medido na voz real.** "Onze da noite. A casa dorme." é sussurrado: −37 dBFS RMS (−33 em "Onze", −40 em "A casa dorme."), 16 dB abaixo do meio do filme. Por isso a base fica a −22 dB com duck −6 (≈ −48 sob a voz, 11 dB abaixo dela; ≈ −41 nas pausas) e os tiques a −18 (pico ≈ −21 dBFS). A −9 dB, as notas empatariam com a voz justamente no gargalo dos 3 s.
- **Câmera.** Tripé, com deriva de 0 → +19 px em f0–105, inOut(sine), só na fachada. Diário, cursor e fólio ficam presos à grade. Sem zoom.
- **Em relação ao v1:** sai o "23:00" grande (repetia a fala), a lua e os fades. **Em relação ao livro:** as janelas dos outros ficam em papel-lua (o âmbar passa a ser exclusivo dela desde o f0), o cursor já está visível no f0 (promete texto), a linha 1 nasce apagada (o 1:1 sai de graça) e os grupos estão definidos janela por janela.

## 3. Matriz de ritmo & áudio

**3.1 Troca de estímulo** (troca principal = muda a imagem-chave; micro = palavra, linha, tique)
| Trecho | s | Troca principal | Micro |
|---|---|---|---|
| Gancho | 0–3,49 | a cada 1,0 s (um grupo apaga em f0/30/60/90): é mais rápido de propósito | palavras f14–82; linhas f47 e f101 |
| Página âmbar | 3,49–12,67 | 1,7 · 1,1 · 2,6 · 2,2 · 1,4 s (f100 janela → 152 setor → 186 "só dela" → 263 cápsula → 329 oval → 372) | anel f128; linhas f135/174/209/252/288/325/364; borda livre f350 |
| Janelas-unha | 12,67–18,97 | janela que fecha em f372 (14 f), que vira a 1ª janela-unha em f393; depois uma a cada 0,38 s (f405→497); fileira completa parada f502→563 (2,0 s) | linhas f421/482/518 |
| Olhar pra trás | 18,97–23,47 | 1,3 · 1,3 · 1,8 s (f563 página → 602 rebobina → 642 janelas → 696) | linhas f590/632/659; twang f689 |
| Cartão | 23,47–28,93 | 2,7 · 0,8 · 2,3 s (f696 persiana de 4 lâminas → 776 fio + URL → 800 "00:00" → 868) | palavras do título f704–772; 2º twang f800 |

Nenhuma troca principal passa de 3 s. O maior trecho parado é f800→868 (2,27 s, o CTA legível).
- Tudo o que é importante fica ≥ 1,5 s: o setor 3,7 s, a cápsula 2,2 s, a oval 2,2 s, a fileira completa de janelas-unha de f502 a f575 (2,4 s, contando o giro da página), a fachada acesa 1,8 s e a URL 2,9 s.
- Exceções conscientes: a dela fica sozinha só em f95–100, mas logo vira o próprio quadro (f100–124), e o olho fica nela de f0 a f124 (4,1 s); a janela que fechou fica sozinha só em f386–393, mas é a 1ª janela-unha e continua na tela até f575; e a borda livre (f350–386) é um detalhe, não uma informação.

**3.2 Curvas**
| Curva | Uso |
|---|---|
| cubic-bezier(0.45,0,0.55,1) | mini-persiana que apaga (5 f) e persiana do cartão (4 lâminas, 15 f cada, 24 f no total) |
| cubic-bezier(0.76,0,0.24,1) | janela que abre (24 f), janela que fecha (14 f) e cada luz que acende (janela em miniatura, 5 f) |
| cubic-bezier(0.33,0,0.67,1) | linha que sobe, volta do cursor e máscara de cada palavra |
| cubic-bezier(0.65,0,0.35,1) | página virada, traço do anel e do fio, morphs (inclusive a janela que vira unha, 150×150 → 120×170 em 5 f), degraus do rebobinar |
| cubic-bezier(0.16,1,0.3,1) | varredura do setor, URL, 23:59→00:00 |
| cubic-bezier(0.7,0,0.84,0) | saídas: o anel recolhe (14 f = 60% de 24) e o cursor do cartão |
| spring {1.2, 60, 18}, ζ 1,06 | o setor cresce em "só dela" (0% de overshoot) |
| inOut(sine) | deriva da câmera, +19 px por página |

**3.3 Pontos de impacto sonoro** (voz `audio/n2.mp3` a 0 dB, em 0,45 s). O nível foi medido na voz real, por trecho, e não na média: o gancho é sussurrado (−37 dBFS RMS: −33 em "Onze", −38 em "da noite.", −40 em "A casa dorme."), o meio é cheio (−21), "agradecer… noite." volta ao sussurro (−36 / −35 / −43) e o CTA é cheio (−21). As notas da base valem −18/−19 dBFS RMS no arquivo, o tique tem pico de −3,1 dBFS e o twang, pico de −2,0 (RMS de 50 ms de −11,9 a 0,63×).
| s | f | Âncora | Arquivo | dB | Motivo emocional |
|---|---|---|---|---|---|
| 0,00 / 1,00 / 2,00 / 3,00 | 0/30/60/90 | f0, "da", antes de "A", "dorme." | n2_tick.wav a 0,5× | −18 (pico ≈ −21 dBFS) | o relógio da casa que dorme; cada tique apaga 3 janelas sem passar por cima do sussurro |
| 0,07 · 2,40 | 2 · 72 | início, "casa" | n2_base.mp3 (notas do arquivo) | −22; duck −6 | noite escura, sol# menor: ≈ −41 dBFS nas pausas e ≈ −48 sob a voz (pior caso: f72 em "casa", ≈ 8 dB abaixo) |
| 3,50→4,13 | 105→124 | "Pra" | base | −22 → −9 | a voz sai do sussurro e o leito abre junto com a janela |
| 5,07 | 152 | "pedaço" | base (nota) | −9 / −12 sob a voz | o pedaço do dia cai no quadro exato |
| 7,0–10,7 | 210–321 | "…descansar." | base (o arquivo decai até −40 dB) | — | descansar é silêncio |
| 10,73 | 322 | "pra" → "aprender" (f329) | base volta | −9 | a virada |
| 13,00 · 15,75 | 390 · 473 | "aula" · "vez." | base (notas) | −12 sob a voz | leito sob as janelas-unha; nenhum som marca os passos (um som por passo é o método do N4) |
| 19,33→20,00 | 580→600 | "Um dia ela vai" | base (2º vazio do arquivo, decai até −41 dB) | −9 → −22 | o passado, quieto; a descida não se ouve |
| 20,07→21,00 | 602→630, a cada 4 f | "pra trás…" | n2_tick.wav a 0,5× ×8 | −20 → −30 | catraca: o relógio rebobina e o passado se afasta (picos de ≈ −23 a −33 dBFS sobre "trás…", que sai a −29 RMS) |
| 21,40 | 642 | "agradecer" | base reentra | −24; duck −6 | gratidão sem peso: a nota fica ≈ −48 sob a voz (−36), 12 dB abaixo |
| 22,97 | 689 | entre "noite." (termina em f687) e "Se" (f704) | n2_twang.wav a 0,63× (−8 st, sol→si) | −22 (pico ≈ −24 dBFS, RMS ≈ −34) | o 1º som claro do filme, no vão e não em cima da última palavra da frase-tese (−43): si, a terça de sol# menor e a tônica de si maior |
| 23,20→24,00 | 696→720 | persiana | base | −24 → −60 | a cortina fecha a noite e leva o menor junto |
| 26,67 | 800 | "00:00" | n2_twang.wav a 0,7937× (−4 st, sol→ré#) | −18 (pico ≈ −20 dBFS, RMS ≈ −30) | ré# sobre o si de f689: si maior, a relativa maior de sol# menor; a noite vira dia e a trilha chega à serenidade da fala |

Mix: chaves de ganho por trecho, no lugar de um volume só. Gancho (f0–104): base −22, duck −6; tiques −18. Meio (f105–599): base −9, duck −3 (≈ −28 nas pausas e ≈ −31 sob a voz de −21, ~10 dB abaixo). Olhar pra trás e gratidão (f600–720): base −22 até f641 e −24 a partir de f642, duck −6; catraca −20 → −30; a base chega a −60 em f720 e acaba ali (`durationInFrames 720`). Cartão (f720–868): sem leito, só a voz e o 2º twang. Duck com ataque de 6 f e soltura de 10 f. Nada claro antes de f689. Não entram musica, beat1, beat2, whoosh, sparkle, impact nem riser. Conferir de ouvido em f14–100 e f636–690.

**3.4 ElevenLabs v3: só documentação, NÃO gerar** (voz Pri `8EY2gK6oUxZCDZAlvUpZ`, `eleven_v3`, texto idêntico, só tags)
```
[calm] [softly] Onze da noite. [short pause] [whispers] A casa dorme. [pause]
[warmly] Pra muita mulher, [short pause] é o pedaço do dia que é só dela. [pause]
[matter-of-fact] Tem quem use esse tempo pra descansar. [short pause]
[gentle smile] E tem quem use pra aprender a fazer unhas. [pause]
[slowly] Uma aula de cada vez. [short pause] Uma unha de cada vez. [short pause]
[reassuring] Sem pressa, sem sair de casa. [long pause]
[tender] Um dia ela vai olhar pra trás… [short pause] e agradecer por essa noite. [long pause]
[softly] Se der vontade, [short pause] veja por onde começar.
```
Pausas-alvo (as de hoje, para não mexer na montagem): 0,58 s depois de "noite."; **0,40 s depois de "dorme."** (hoje são 0,06 s; o ganho é deixar a janela abrir); 0,42 s depois de "dela."; 0,52 s depois de "unhas."; 0,40 s depois de "casa."; 0,58 s depois de "noite." (2ª). Se regravar, rode `tools/align.py`: as cenas estão presas à palavra e se recalculam.

## 4. Mapeamento de camadas visuais

**4.1 Storyboard** (as camadas estão na ordem z, de baixo para cima; "deriva" é a translateY da ilustração)
| Cena | s | f | Papel | Na tela | Camadas | Entra / sai | Câmera | → |
|---|---|---|---|---|---|---|---|---|
| c01 | 0,00–3,49 | 0–105 | gancho | fachada 13→1 acesas, fólio 23:00, "Onze da noite. / A casa dorme." | fundo noite · fachada · janela dela · G1–G4 · fólio · cursor · diário | tudo presente no f0; G1–G4 por mini-persiana em f0/30/60/90; saem cobertos pela t2 (f100) | deriva 0→19 | t2 |
| c02 | 3,49–5,07 | 105–152 | problema | página âmbar, fólio 23:07, "Pra muita mulher, / é o…" | página âmbar · anel-dia · fólio · cursor · diário (noite) | a página entra pela janela (f100–124); o anel se desenha no sentido anti-horário a partir da meia-noite (f128–152) | 0→1,3 | t6 |
| c03 | 5,07–8,75 | 152–263 | problema | setor de 15° (23h→0h) que cresce em "só dela" | setor · setor que cresce · diário | o setor varre 15° em 8 f; em "só" (f186) o raio vai de 240 a 280 por mola | 1,3→11,7 | t6 |
| c04 | 8,75–10,97 | 263–329 | problema | cápsula deitada 520×200: descansar | cápsula · diário | morph setor→cápsula em 14 f; o anel recolhe em 14 f | 11,7→17,4 | t6 |
| c05 | 10,97–12,67 | 329–380 | caminho | a cápsula se levanta numa oval de unha 300×420: a virada | oval · borda livre · diário | morph em 14 f; fio âmbar reto em "unhas." (f350); em f372 a página âmbar inteira recolhe na janela que fecha (t3, 14 f) | 17,4→19 | t3 |
| c06 | 12,67–16,33 | 380–490 | caminho | 10 janelas-unha apagadas (120×170, canto vivo); a janela que fechou vira a 1ª; 2–9 acendem; fólio 23:20 | página noite · janelas-unha apagadas · janela-unha 1 · janelas-unha 2–9 · fólio · cursor · diário (papel-lua) | a página já está por baixo e aparece quando o âmbar fecha (f372–386); a janela de 150×150 vira unha em f393; 2–9 em f405, 416, 428, 439, 451, 462, 474, 485 (janela em miniatura, 5 f) | 0→11,9 | t6 |
| c07 | 16,33–18,97 | 490–569 | prova | a 10ª janela-unha acende em "pressa,"; em "sem sair de casa." a fileira completa fica parada (2 s) | janela-unha 10 · diário | f497 (janela em miniatura, 5 f); parada f502–563; sai com a página (t5) | 11,9→19 | t5 |
| c08 | 18,97–21,41 | 569–642 | payoff | a página vira de volta para a fachada apagada (só a dela acesa); o fólio 23:58 rebobina até 23:00 | verso · fachada · janela dela · fólio · degraus · cursor · diário novo | t5 em f563–585; 8 degraus de 4 f em f602–630 | 0→10,7 | t6 |
| c09 | 21,41–23,47 | 642–704 | payoff | as 19 janelas acendem em âmbar a partir da dela | janelas · diário | anéis em f642/645/648/651/654 (janela em miniatura, 5 f); saem cobertos pela persiana âmbar (t7) | 10,7→19 | t7 |
| c10 | 23,47–28,93 | 704–868 | cta | "Se der vontade, / veja por onde / começar.", fio, URL, 23:59→00:00 | página âmbar · título · cursor · fio · URL · fólio | persiana âmbar de 4 lâminas (t7) f696–720; palavras f704–772; fio f776; URL f780; fólio f800 | 0→19 | fim |

Soma: 3,49 + 1,58 + 3,68 + 2,22 + 1,70 + 3,66 + 2,64 + 2,44 + 2,06 + 5,46 = **28,93 s (868 f)**.

**4.2 Diário** (Gill Sans 62/80; cada frase abre uma linha nova; quebras por sentido, todas ≤ 720 px, medidas na fonte do sistema)
| Linha | Texto | Palavras (f) | Sobe em |
|---|---|---|---|
| 1–2 | Onze da noite. · A casa dorme. | 14–41 · 64–82 | f47 · f101 |
| 3–5 | Pra muita mulher, · é o pedaço do dia · que é **só dela.** | 105–130 · 144–177 · 178–204 | f135 · f174 · f209 |
| 6–7 | Tem quem use esse tempo · pra descansar. | 222–254 · 256–271 | f252 · f288 |
| 8–9 | E tem quem use pra · **aprender** a fazer unhas. | 297–329 · 329–358 | f325 · f364 |
| 10–13 | Uma aula de cada vez. · Uma unha de cada vez. · Sem pressa, · sem sair de casa. | 380–417 · 432–475 · 490–505 · 523–554 | f421 · f482 · f518 · (sai com a página) |
| 14–17 | Um dia ela vai · olhar pra trás… · e **agradecer** · por essa noite. | 569–594 · 594–616 · 636–650 · 663–683 | f590 · f632 · f659 · (coberto pela t3) |

A subida começa em min(fim da última palavra, s da próxima − 4 f) e dura 12 f. A linha de escrita fica fixa (linha de base em y 1470), e a 4ª linha mais velha passa pela borda dura em y 1250. "aprender" está em noite sobre o âmbar e vira âmbar quando a janela fecha e a noite aparece por baixo (f372–386).

**4.3 Lógica entre camadas**
- **Cinco páginas** (P1 fachada, P2 âmbar, P3 janelas-unha, P4 fachada de volta, P5 cartão), cada uma uma `<Sequence>` com fundo chapado. Na janela que abre (t2) e na persiana (t7), a página que entra fica por cima e é recortada pela transição, e a que sai fica parada por baixo até a máscara fechar. Na janela que fecha (t3) e na página virada (t5) é o inverso: a que sai fica por cima e recolhe ou vira, e a que entra já está parada por baixo. Nada some por opacidade.
- **Ordem z dentro de cada página:** fundo → ilustração (com deriva) → diário, cursor e fólio (presos à grade, sem deriva: o diário nunca passa de y 1490).
- **O diário é renderizado dentro de cada página**, nas cores dela e com o mesmo estado. Por isso a cor troca exatamente na borda da janela e da persiana, e a legenda nunca falta. Em P1→P2→P3 o diário é contínuo. Em P4 ele recomeça vazio, porque a página que vira leva as linhas antigas (é o passado). P5 não tem diário: o título é a própria fala, então nada duplica.
- **Dentro de uma página (t6)** muda uma camada-chave por vez, presa à palavra: traço → varredura → mola → morph → morph → traço.
- **Corte em J:** as trocas de plano começam um pouco antes da âncora (t2 5 f, t3 8 f, t5 6 f, t7 8 f), e cada cena começa na palavra. A saída dura ~60% da entrada (24 → 14 f): a janela que fecha é a saída da página que entrou pela janela que abre.
- **Acender e apagar.** Apagar é sempre a mini-persiana que desce (t1, só no gancho). Acender é sempre a janela que abre, em miniatura: as folhas abrem do eixo vertical para os lados em 5 f. Nada no N2 se enche por máscara reta de baixo para cima (é o esmalte do N1) nem cresce por escala a partir do centro (é o N3).

**4.4 Desvios conscientes do livro** (os de tempo são ≤ 6 f e servem à sincronia; os outros corrigem nível de som e repetição entre os 4)
- A página virada passa de f566 para **f563**. A fachada de baixo só aparece na margem quando a página passa de ~42°, e assim "Um" (f569) já sai legível.
- As 10 ovais de 110×160 viram **janelas-unha** de canto vivo, 120×170 (ovais do mesmo tamanho, enchidas por máscara reta, eram o esmalte do N1). Acendem pela janela em miniatura, a cada 11–12 f de f393 a "pressa," (f497), e não a cada 18 f até f549: nada se completa em "casa." (o fecho em "casa" é do N1, f711–747).
- Em f372 a página âmbar sai pela **janela que fecha** (14 f), no lugar da persiana noite de 8 lâminas. A **persiana** fica uma vez só, no cartão (f696–720), com 4 lâminas de 480 px, e não 8 de 240.
- As 19 janelas de "agradecer" acendem pela janela em miniatura, e não por lâmina que sobe.
- Som: tiques do gancho a −18 dB (livro: −6); catraca de −20 a −30 (livro: −10 a −22); sem tiques em "Uma" (livro: f380 e f432); base com chaves por trecho, saindo em f696–720 (o livro a leva até f868); twang em f689 (livro: f675) e um 2º twang em f800.
- O anel **termina** em "pedaço" (desenhado em f128–152) em vez de começar nele: o setor nasce na palavra, sobre um anel pronto.
- "descansar." fica em f263, e não f262, porque é o arredondamento do motor.
- Os outros moradores ficam em papel-lua no gancho e ganham âmbar só em "agradecer": o âmbar só se espalha depois da gratidão.

## 5. Blueprint de automação
O pipeline lê **`v6/n2/blueprint.json`**: 10 cenas, 48 camadas, 7 transições e 14 sfx. Os tempos estão em segundos com 2 casas, já com o LEAD de 0,45. O JSON passou em `json.load` e nas checagens de soma, âncora, paleta, tipos de entrada e zona segura.
O motor ainda precisa de (livro §8):
- `Track` com `trimBefore`, rampa de entrada configurável (precisa ser **0 f**, senão a nota de f2 some), curva de ganho por chaves em dB (`curva_ganho_db`) e duck por trecho (`duck_db_por_trecho`: −6 / −3 / −6).
- `Sfx` com `playbackRate` + `preservePitch={false}` e `durationInFrames`.
- Uma variante de `T.slats` em linhas, em que cada lâmina cresce a partir do próprio topo (4 lâminas de 480 px, atraso 3 f).
- `clip-path: inset()` animado entre dois retângulos: janela que abre, janela que fecha (até 150×150), janela que vira unha (150×150 → 120×170) e janela em miniatura (`inset(0 50% 0 50%)` → `inset(0)`).
- A página virada (rotateY + backface-visibility).
- O diário como componente por página.
- `interpolatePath` (já instalado em `@remotion/paths`) para setor → cápsula → oval.

Fontes: `500 34px "Big Caslon"`, `500 92px "Big Caslon"`, `400 62px "Gill Sans"`, `600 62px "Gill Sans"`, `600 40px "Gill Sans"`.
Cópias, que são os únicos arquivos novos:
```sh
cd /Users/lucasmqar/Desktop/lovit/cursosdeunhas/marketing/remotion/public/audio/v6
cp /Users/lucasmqar/Desktop/flux/flux/outputs/marketing-2026-11/motor/public/trilha/base.mp3 n2_base.mp3
cp /Users/lucasmqar/Desktop/lovit/canal/02-motor/public/sfx/tick.wav n2_tick.wav
cp /Users/lucasmqar/Desktop/lovit/canal/02-motor/public/sfx/twang.wav n2_twang.wav
```
Antes do Meta: stills de f0, 30, 60, 95, 112, 186, 270, 340, 380, 393, 450, 530, 575, 630, 660, 708, 810 e uma folha de contato para o Lucas (regra 9). Conferir de ouvido f14–100 e f636–690 (voz sussurrada contra base, tiques e catraca), o tique a 0,5× e os twangs a −8 st e −4 st.
