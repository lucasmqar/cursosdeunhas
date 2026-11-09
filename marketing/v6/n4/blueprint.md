# N4 · Medir com calma · blueprint v6

28,73 s · 862 quadros a 30 fps · 1080×1920, com corte 1080×1080 (y 420–1500) · voz fixa `audio/n4.mp3` em 0,45 s · nenhum crédito, nenhum áudio gerado ou processado.
Tempo = 0,45 + tempo da palavra em `timing/n4.json`; quadro = `Math.round(s × 30)`, como o `wf()` do motor. A fonte da verdade para o pipeline é `blueprint.json`, nesta pasta (convenções em `convencoes`).

**Revisão 2 (09/11), 7 apontamentos aplicados**
1. Gesto 2 da interface sai de cima de "seu.": `from 785` (a palavra termina em f784), −26 dB, e o check nasce junto em f785. A nota "pico −14" estava errada (era RMS): a −10 dB o pico era −10 dBFS.
2. Cartão sem o molde dos outros três: "2 min" fixo, que aparece por corte quando o cursor passa (sem contador); "qual caminho é o seu" já posto em cinza e escurecendo no `s` de cada palavra; a URL como última linha da tabela, sem barra; o check é o único traço do cartão.
3. t1 deixa de ser colunas em sentidos opostos (família da guilhotina do N1): vira o arquivo da ficha, com um fio e a ficha inteira subindo 6 módulos.
4. Legenda sem célula cobalto por palavra (karaokê de CapCut; repetia o fio do N1 e a palavra cheia do N3).
5. Paleta fria e mais escura: papel azulado #D0D9E6, ΔE00 de 11,0 contra o osso do N1 (a sugestão #DCE2EA dava só 8,3).
6. Gancho com tinta na f0: os três "?" em grafite na tela desde a f0, a faixa anda só 360 px (passo máximo de 49,5 px/f) e "Antes" já nasce grafite.
7. JSON legível por máquina: objeto `render` em narração, trilha e efeitos; `familia` + `src_local` nas fontes; `null` na última cena; prefixo único `legenda: ` em `texto_tela`.

## 1. Auditoria & validação

**O que funciona no roteiro (fica)**
- "Antes de pagar por um curso de unhas": abre no momento da compra e fala em 3ª pessoa ("ela"). Conversa com quem está decidindo sem afirmar nada sobre quem assiste, como pede o compliance.
- "ela fez uma coisa simples: comparou.": dois-pontos, 0,68 s de silêncio medido (de 3,74 a 4,42 s) e a revelação numa palavra só. É a cadência da única peça que converteu ("Começou com uma decisão pequena: aprender.", N1 imagem: CTR 4,58% e 7 de 7 leads).
- "O que ensina. Se tem certificado. Quanto custa. Se tem garantia.": quatro frases curtas e paralelas ("Se tem…" duas vezes). É um checklist falado que responde, em ordem, às objeções de quem compra curso online.
- "Porque escolha boa é escolha com calma.": a repetição de "escolha" e o "é" alongado (0,50 s) fazem soar como regra, não como pitch.
- "três caminhos, do zero ao alongamento… lado a lado": oferta concreta e de baixa carga cognitiva, igual ao funil (/comecar/: uma pergunta, 3 caminhos).
- "Sem pressa, sem pressão." e "Leva dois minutos": anti-urgência com custo de tempo declarado. Fala com o público de 45 a 65+, que levou a maior parte da verba.

**O que falhou na execução v5 (sai)**
- O N4 v1 teve 20 views, 11 no p25 e 1 no p75. A f0 do v5 é quase vazia: os cartões entram por `opacity` de mola a partir de 0 (`ads/n4.tsx`, `Cards`), sobre manchas em degradê. Nada para o polegar.
- Sob "Antes de pagar…" toca `musica.mp3` (ré maior, brilhante, 3,2 ataques/s), que contradiz a dúvida e o "com calma" (regra 4). Há whoosh em todo corte e sparkle no fim, iguais aos dos outros três vídeos.
- A linha de preço mostra "R$", as barras são proporcionais aos preços reais (49,9 / 100 / 147) e aparecem descritores de produto ("17 níveis", "fibra e gel"). É preço absoluto disfarçado e quase nome de curso.
- Pílula de 3 palavras centralizada, sombras e cantos arredondados: cara de template.

**Gatilho injetado: tarefa incompleta (efeito Zeigarnik) com revelação em uma palavra**
- Desde a f0 está na tela uma ficha em branco, com três "?" em grafite e linhas numeradas vazias; em f14 ela para. Formulário vazio pede para ser completado, e o vídeo preenche a ficha diante dela: cada critério dito vira uma linha arquivada, com 4 pequenas recompensas entre 6,7 e 10,6 s, e a tabela fecha a tarefa em "lado a lado" (20,25 s). O cartão fecha o ciclo: a mesma ficha, com "2 min" onde estavam os "?" e a caixa marcada.
- "comparou." ganha o maior evento do filme (a ficha da dúvida é arquivada inteira: um fio e a subida de 6 módulos) e o único corte de som. É o "dois-pontos + uma palavra" que converteu no N1, agora com imagem.
- Redução de risco percebido: preço só relativo ($ / $$ / $$$), garantia idêntica nas três colunas e "sem pressão" com o leito a −40 dB.
- **Por que este gatilho:** o gargalo medido são os 3 primeiros segundos (de 11 views no p25 para 1 no p75). A ficha vazia dá um motivo visual para ficar que não depende do som: só Reels e Stories entregaram, e Stories toca mudo. Para o público 45–65+, calma e clareza rendem mais que energia; a peça calma e declarativa do N1 foi a que venceu.

## 2. Upgrade do gancho (0–3 s)

**Mecânica.** O vídeo nasce rolando como o próprio feed e freia seco em "Antes", com um clique. É o polegar parando ("antes de pagar, pare").
- **Quebra de padrão:** no meio de rostos e vídeos, uma ficha impressa em grade suíça, sobre papel azulado, rola e para.
- **Tipografia cinética:** a legenda é uma linha de tabela que se preenche: cada palavra troca de cinza-régua para grafite no seu `s`, sem célula e sem caixa. O "?" ao lado do cursor acende em cobalto.
- **Câmera:** nenhuma. Só a faixa anda em y; depois da parada, a deriva de +12 px em x.

**Upgrade sobre o livro.**
- A frenagem do livro, bezier(0.22,1,0.36,1) em 360 px, assenta em f9, 5 f antes do clique. Fica a distância de 3 módulos (360 px), com bezier(0.5,1,0.89,1): o primeiro passo é de 49,5 px/f (≤ 60, sem o estrobo dos 116 px/f da versão anterior), os passos caem até 1,4 px e a parada é em f14, junto com o clique.
- A f0 tem tinta: os três "?" em grafite já estão na janela (base y 1136, tinta y 986–1138) e "Antes" já nasce grafite (11:1 sobre o papel). As palavras ainda não ditas e os números ficam em cinza-régua #646D7A, a 3,7:1 (antes, 2,1:1). Só os fios ficam claros (#AEB7C4, 1,4:1), porque são régua, não leitura.
- O cursor mora nas calhas (x 298 / 540 / 782), como um cursor de texto antes do campo. No centro da coluna (x 420), ele ficaria a 6 px do "?", que tem 107 px.

| Quadros | Voz | Imagem | Legenda (base y 1368) | Som |
|---|---|---|---|---|
| f0 | — | faixa a +360 px na máscara y 250–1300: em y 250–580, o fim de uma ficha anterior (números 06–08 em cinza-régua, fios #AEB7C4); papel; a ficha nova com os três "?" em grafite (base y 1136) e a linha 01 | G1 "Antes de pagar": "Antes" já em grafite, "de pagar" em cinza-régua | riser a 0,41 nasce (≈ −88 dBFS) |
| f1–7 | — | sobe em passos de 49,5 a 27,7 px/f | — | — |
| f8–13 | — | freia de 24,1 a 5,3 px/f; a ficha anterior sai pela borda de cima até f10 | — | — |
| **f14** | **Antes** | parada seca (último passo de 1,4 px, sem recuo): três "?" em Charter Italic 220 px grafite (base y 776, x 306 / 548 / 790) e linhas 01–04 vazias (y 820–1300) | "Antes" segue grafite | **clique** (interface g1, 0 dB) |
| f15–19 | Antes / de | parado; a deriva em x começa | — | — |
| f20–27 | de / pagar | o cursor cobalto de 3 px se desenha de cima para baixo na calha x 298 (y 580→1300), 8 f, (0.65,0,0.35,1) | f22 "de", f27 "pagar" | sem som |
| f28–33 | pagar | o "?" da coluna 1 troca para cobalto (corte) | — | — |
| f34–46 | por / um | parado | f34: G2 "por um curso de unhas," por corte; f35 "por", f43 "um" | — |
| **f47–55** | **curso** | o cursor salta de 298 para 540 em 8 f, (0.83,0,0.17,1); o "?" 1 volta a grafite em f47 e o "?" 2 acende em f55 | f47 "curso", f54 "de" | sem som |
| f56–81 | de / unhas, | parado, em deriva | f62 "unhas,"; de f78 a f81 a linha toda em grafite | riser ≈ −55 dBFS |
| **f82–89** | **ela** / fez | f83: c02 começa sobre a mesma ficha; o cursor salta de 540 para 782 (f83–91), o "?" 2 apaga e o "?" 3 acende em f91 | f82: G3 "ela fez uma coisa simples:" por corte; f83 "ela", f89 "fez" | — |

Depois disso: o cursor volta ao zero (calha x 48) em "simples:" (f110–120), e os três "?" voltam a grafite. Em f126–145 vem o silêncio da voz, com o rumor subindo até −28 dBFS. Em f146 ("comparou."), o rumor corta seco e um fio grafite se desenha sobre o topo da ficha (f146–154); a ficha da dúvida sobe inteira, 6 módulos, com a ficha de método presa por baixo (f154–170, t1).

## 3. Matriz de ritmo & áudio

**Ritmo de troca de estímulo**
| Trecho | s · quadros | O que troca | Intervalo |
|---|---|---|---|
| Dúvida | 0,00–4,87 · f0–145 | frenagem, parada com clique, cursor, "?" que acende, 3 saltos, volta ao zero, 3 legendas | 0,4–1,2 s |
| Decisão | 4,87–5,75 · f146–172 | fio de arquivo e a ficha que sobe inteira; 0,9 s sem leito | 0,9 s |
| Método | 5,75–10,63 · f173–318 | 4 × (clique → fio → empurrão da linha) | 1,2–1,5 s |
| Calma | 10,63–13,83 · f319–414 | cursor que vira bloco, painel, cursor lento (1,53 s), parada | 0,4 / 1,5 / 0,9 s (o trecho mais lento, de propósito) |
| Tabela | 13,83–21,35 · f415–639 | varredura, Harvey balls, seta, barras, $, quadrados, encaixe | 0,7–1,0 s |
| Respiro | 21,35–23,61 · f640–707 | 3 paradas em 0,77 s, depois 1,5 s parado | 1,5 s |
| Cartão | 23,61–28,73 · f708–861 | empurrão, varredura do "2 min", 5 palavras que escurecem, check, nota, loop | 0,3–1,8 s |

Nenhuma tela fica mais de 1,6 s sem estímulo novo, fora a leitura final do cartão (f800–855, 1,8 s, com a URL na tela desde f708). Tudo o que importa fica 1,5 s ou mais.

**Curvas (só bezier; nenhuma mola, overshoot 0)**
| Nome | cubic-bezier | Onde |
|---|---|---|
| frenagem | (0.5,1,0.89,1) | feed f0–14, 360 px |
| eixo | (0.83,0,0.17,1) | saltos do cursor, subida da ficha no t1, painel do t2, t4, t5, encaixe em "lado", máscaras de entrada |
| bloco | (0.7,0,0.3,1) | o cursor que se alarga em bloco no t2 |
| medição | (0.65,0,0.35,1) | varredura t3, varredura do "2 min", empurrão do arquivo, traços do cursor, seta e check |
| arquivo | (0.6,0,0.2,1) | fio grafite do arquivo (na legenda e, no t1, na ficha) |
| calma | (0.45,0,0.55,1) | cursor lento, x 48→540 |
| saída | (0.7,0,0.84,0) | saída em loop, f855–861 (7 f, 60% da entrada) |
| deriva | (0.37,0,0.63,1) | +12 px em x por parada |

**Pontos de impacto sonoro** (voz em 0 dB, −21 dBFS RMS medido; "seu." tem pico −15 e RMS −29 dBFS)
| t (s) · quadro | Palavra-âncora | Arquivo | Volume | Motivo emocional |
|---|---|---|---|---|
| 0,00 · f0 | (antes da voz) | `audio/riser.mp3` a 0,41, sem preservar tom | −3 dB (de −88 a −28 dBFS) | a dúvida nasce inaudível e sobe |
| 0,45 · f14 | Antes | `audio/v6/n4_interface.mp3`, gesto 1 | 0 dB (pico −19,5 dBFS, RMS −30) | a frenagem: o feed para |
| 4,83→4,87 · f145→146 | comparou. | riser | de −3 a −60 dB em 1 f | decisão: corte seco e 0,9 s sem leito |
| 5,75 · f173 | O (que ensina) | `audio/v6/n4_beat2.mp3` a 0,5 | de −60 a −18 dB em 12 f; duck −3 | o método começa: pulso grave a 60 bpm |
| 5,91 · f177 | ensina | interface, gesto 1 | 0 dB | medida conferida (1/4) |
| 7,09 · f213 | certificado | interface, gesto 1 | 0 dB | medida conferida (2/4) |
| 8,49 · f255 | custa | interface, gesto 1 | 0 dB | medida conferida (3/4) |
| 9,71 · f291 | garantia | interface, gesto 1 | 0 dB | 4/4; cliques idênticos, porque método não sobe de tom |
| 12,67→13,07 · f380→392 | escolha com calma. | beat2 | de −18 a −22 dB | calma: o leito recua 4 dB |
| 13,83 · f415 | A gente reuniu | beat2 | de −22 a −18 dB | segurança pela constância; nenhum efeito |
| 21,35 · f640 | Sem | beat2 | de −18 a −40 dB em 10 f | o único silêncio no meio: sem pressão |
| 23,61 · f708 | Leva | beat2 | de −40 a −18 dB | o pulso volta para o convite |
| 26,13 · f784 | (fim de "seu.") | beat2 | de −18 a −14 dB em 14 f | o cartão sem voz: o leito fica 6 dB abaixo da voz |
| 26,17 · f785 | depois de "seu." (que termina em f784) | interface, gesto 2 (sol5), `trimBefore 36` | −26 dB (pico ≈ −26 dBFS, RMS ≈ −30) | "pronto": confirmação contida, na dominante de dó, sem voz por baixo e um pouco acima do leito (≈ −31 dBFS) |
| 27,63→28,73 · f829→862 | — | beat2 | de −14 a −60 dB | fecha junto com a subida do loop |

O gesto 2 mede, no arquivo (1,25–1,35 s), pico −0,1 dBFS e RMS de 50 ms −4,1 dBFS. Na versão anterior ele tocava em f776 a −10 dB (pico −10 dBFS; a nota "−14" confundia RMS com pico), por cima de "seu.": um agudo 5 dB acima do pico da última palavra do CTA. Com `trimBefore 36` (1,2 s), ele soa em f786–790, junto com o traço do check (f785–793).

**Execução sem crédito.** Os únicos arquivos novos são duas cópias intactas em `public/audio/v6/`: `n4_beat2.mp3` (de `F/trilha/beat2.mp3`) e `n4_interface.mp3` (de `D/Soft,_electronic_UI…mp3`). O comando está no livro, §8.
Tom, andamento e recorte saem das props do `<Audio>` no render: `playbackRate` com `preservePitch={false}`, que vira `asetrate=48000*r,aresample=48000`, e `trimBefore`/`durationInFrames`, que viram `atrim`. Cada arquivo tem os parâmetros prontos no objeto `render` do JSON (`from_f`, `trimBefore_f`, `durationInFrames`, `playbackRate`, `preservePitch`, `ganho_db_chaves` em quadros absolutos, `duck_db`). Ficam fora: whoosh, sparkle, musica, impact, ping, `F/sfx2`.

**Entonação e pausas para o ElevenLabs v3** (`eleven_v3`, voz `8EY2gK6oUxZCDZAlvUpZ`, estabilidade "Natural"). É só documentação para uma regravação futura: **não gerar**.
> [thoughtful] Antes de pagar por um curso de unhas, ela fez uma coisa simples: [long pause] [matter-of-fact] comparou. [short pause] [calm, measured] O que ensina. [short pause] Se tem certificado. [short pause] Quanto custa. [short pause] Se tem garantia. [short pause] [warm] Porque escolha boa… é escolha com calma. [short pause] [reassuring] A gente reuniu três caminhos, do zero ao alongamento, com o que cada um ensina, preço e garantia lado a lado. [short pause] [softly, slower] Sem pressa, [short pause] sem pressão. [short pause] [warm, inviting] Leva dois minutos pra ver qual caminho é o seu.

| Ponto | Hoje | Alvo | Por quê |
|---|---|---|---|
| "simples:" → "comparou." | 0,68 s | 0,7 s | é a pausa que converte; manter |
| depois de cada critério | 0,24 / 0,18 / 0,16 / 0,24 s | 0,6 s | o arquivo (18 f) caberia depois da palavra, e não durante |
| "escolha boa… é" | "é" com 0,50 s | igual | a tese precisa do apoio |
| "Sem pressa," → "sem pressão." | 0,18 s | 0,3 s | respiração; mais lento e mais baixo |

Com esses alvos, a voz cresce cerca de 1,6 s (para ≈ 27,3 s). Depois de regravar, é preciso realinhar `timing/n4.json` com `tools/align.py` e recalcular os quadros.

## 4. Mapeamento de camadas visuais

**Paleta (sólida; conferida)**
- Papel azulado #D0D9E6 (fundo) · grafite #1B2433 (tipo, fios de cabeça, dados) · fio #AEB7C4 (hairlines) · cinza-régua #646D7A (palavras ainda não ditas e números; troca de cor, nunca opacidade) · cobalto #3D5AC2.
- Contraste sobre o papel: grafite 11,0:1, cinza-régua 3,68:1, cobalto 4,29:1, fio 1,42:1.
- ΔE00 do papel: 11,0 contra o osso do N1, 11,7 contra o leite do N3, 14,6 contra o papel-lua do N2 (e 11,4 / 12,4 / 10,5 contra nude, nude2 e branco da marca). O grafite fica a ΔE00 10,7 do grafite do N1. O papel anterior (#EDEFEA) estava a 4,0 do osso.
- O cobalto é só do cursor: o corpo dele, as duas varreduras, o "?" que ele aponta, o trecho que ele mede em "calma.", o bloco em que ele se alarga no t2 e o check. Legenda, Harvey balls, barras, quadrados de garantia e URL ficam em grafite.
- Pendência: `ADAPTACAO-MARCA.md` diz prevalecer em cores e fontes e manda o N4 para nude2 + tinta #3B2430 + ameixa profunda (e Georgia no lugar de Charter). Isso devolve o N4 para a base do N1 (a mesma tinta, ΔE00 3,2 entre os fundos). O Lucas precisa escolher antes de escrever `n4.tsx`.

**Grade fixa (vale para todas as cenas)**
- 12 colunas, com margem 64, calha 16, coluna 64,67, módulo de linha 120 e linha de base 8.
- Colunas: rótulos 1–3 (x 64–290) e caminhos 4–6 (306–532), 7–9 (548–774) e 10–12 (790–1016).
- Calhas do cursor: x 48 (o zero), 298, 540 (o centro exato do quadro) e 782; no cartão, também x 1032.
- Tabela em y 580–1300: cabeçalho 580–820 e linhas de 120 px de 820 a 1300.
- Legenda em y 1300–1396, base em 1368.
- O bloco inteiro fica centrado no quadrado 1:1 (centro em 988 contra 960), então o corte 1:1 é recorte puro.
- Cartão (a ficha completa, um módulo abaixo da tabela): cabeçalho y 700–940 com "2 min" (base 896), fio grafite em y 940, linha da caixa y 940–1060, linha da URL y 1060–1180 e nota em y 1228.

**Storyboard** (soma: 2,77 + 2,10 + 5,76 + 3,20 + 7,52 + 2,26 + 5,12 = **28,73 s** = 83 + 63 + 173 + 96 + 225 + 68 + 154 = **862 f**)
| Cena | s (dur.) · quadros | Papel | Na tela | Camadas | Entra / sai | Câmera | Transição |
|---|---|---|---|---|---|---|---|
| c01 | 0,00–2,77 (2,77) · f0–82 | gancho | o feed freia em "Antes"; ficha em branco com três "?" (na tela desde a f0) e linhas 01–04; o cursor nasce na coluna 1 e salta para a 2 em "curso" | papel · faixa do feed · "?" · linhas 01–04 · cursor · "?" ativo · legenda G1–G2 | a faixa desloca +360→0 em 14 f; o cursor se desenha (traço, 8 f) | escala 1; deriva x 0→6 a partir de f14 | t0 (salto do cursor) |
| c02 | 2,77–4,87 (2,10) · f83–145 | problema | a mesma ficha; o cursor salta para a 3 em "ela" e volta ao zero em "simples:"; silêncio com o rumor subindo | ficha · cursor · "?" ativo · legenda G3 | entra por corte invisível; sai arquivada inteira (t1) | deriva x 6→12 (mesma parada) | t1 |
| c03 | 4,87–10,63 (5,76) · f146–318 | caminho | em "comparou." o fio de arquivo se desenha e a ficha sobe inteira; ficha de método vazia; cada critério se arquiva como linha (4 cliques, 4 empurrões) | fio de arquivo · ficha que sobe · ficha de método · cursor no zero · linha arquivada · pilha · bloco do cursor · legenda G4–G9 | fio f146–154, subida em bloco f154–170; sai sob o painel do t2 | deriva x 0→12 (f171–318) | t2 |
| c04 | 10,63–13,83 (3,20) · f319–414 | caminho | papel quase vazio; o fio em y 960; o cursor desliza de 48 a 540 e para em "calma."; o trecho medido fica cobalto | painel · fio · trecho medido · cursor · legenda G9–G10 | painel da direita (12 f, depois de 10 f do cursor que vira bloco); sai pela máscara do t3 | deriva x 0→12 (f341–414) | t3 |
| c05 | 13,83–21,35 (7,52) · f415–639 | prova | a tabela dos três caminhos, em grafite: ○ ◐ ● em "três", seta do zero ao alongamento, barras em "ensina", $ em "preço", quadrados em "garantia", encaixe em "lado" | varredura · régua · grade · rótulos · Harvey · seta · barras · $ · quadrados · legenda G11–G14 | revelada à esquerda do cursor (18 f); os elementos entram por máscara, com stagger de 3 f | deriva x 0→12 (f433–639) | t4 |
| c06 | 21,35–23,61 (2,26) · f640–707 | payoff | a tabela se recolhe em 3 paradas até sobrar a coluna de rótulos; o resto é papel; leito a −40 dB | tabela · recolher · barra · legenda G15 | entra por corte invisível; as colunas deslizam para baixo da vizinha (8/8/7 f) | deriva x 0→12 (f663–707) | t5 |
| c07 | 23,61–28,73 (5,12) · f708–861 | cta | a ficha completa: o cursor passa e deixa "2 min" (f720–732); "qual caminho é o seu" escurece palavra a palavra; o check depois de "seu." (f785); a URL como última linha desde f708; a nota em f800; em f855 sai em loop | cartão · grade · cursor · "2 min" · caixa · linha · check · URL · nota · loop | sobe por baixo (12 f) com grade, caixa, linha e URL impressas; "2 min" por corte, glifo a glifo; o check é o único traço; sai pelo topo (7 f) | deriva x 0→12 (f720–854) | nenhuma (`null`; a saída em loop é a camada t6) |

**Pilha de camadas e lógica de transição**
- De baixo para cima:
  - L0: papel de cada cena.
  - L1: grade (fios).
  - L2: conteúdo (números, "?", Harvey balls, barras, $, quadrados, rótulos).
  - L3: o cursor, sempre acima do conteúdo e sempre numa calha, nunca sobre um glifo.
  - L4: a legenda, global, que não deriva e só sai com o t5.
  - A transição em curso fica sempre abaixo da L4.
- Uma cena só cobre a anterior por geometria:
  - arquivo da ficha: um fio e a subida de um bloco só (t1);
  - o cursor que se alarga em bloco e um painel que desloca (t2);
  - máscara presa ao cursor (t3);
  - deslocamento por baixo da vizinha (t4);
  - empurrão (t5).
  - c01→c02 e c05→c06 são cortes invisíveis: a cena nova redesenha o último quadro da anterior.
- A personagem é o cursor:
  - ele nasce em f20 e hesita entre as colunas;
  - volta ao zero;
  - espera no zero durante o arquivo da ficha e o método;
  - se alarga em bloco em "Porque";
  - mede até o centro em "calma.";
  - é recolhido pela varredura em f424;
  - volta no cartão para medir "2 min" (f720–732);
  - e vira check depois de "seu." (f785).
- O texto nunca se repete na tela:
  - o rótulo da tabela é a legenda que subiu;
  - a linha do cartão só aparece depois que a legenda sai (f708).
- O que separa o N4 dos outros três:
  - o t1 é o arquivo do próprio N4 em escala de ficha: um fio que se desenha e um bloco de 6 módulos que sobe uma vez. Não é a "linha que sobe" do diário do N2 (texto corrido, 80 px por linha, sem fio);
  - a varredura do cartão é um fio de medição mais alto que o tipo (y 700–940), que passa uma vez em 12 f e deixa glifos inteiros por corte. Não é o cursor de texto do N2, que compõe palavra por palavra com máscara contínua;
  - o cartão não tem título falado em destaque, traço de fecho decorativo nem URL por máscara: a URL é uma linha impressa da tabela, e o único traço é o check.

**Ajustes sobre o livro de assinaturas (e por quê)**
1. **Duração de 862 f** (fim da voz + 3,05 s), e não 873: o cartão segura até f855 e sai em loop em 7 f.
2. **Quadros pelo `Math.round` do motor.** "curso" cai em f47, "O" em f173, "Quanto" em f245, o segundo "Se" em f281 e o segundo "sem" em f677; o livro tem 46 / 172 / 244 / 280 / 676. Por isso o leito entra em f173.
3. **Tabela em y 580–1300**, e não com cabeçalho em 480–700 e linhas a partir de 700. É a única geometria em que quatro empurrões de 120 px a partir da legenda (y 1300) caem exatamente nas linhas 01–04.
4. **O arquivo termina no início da palavra seguinte**, porque os vãos entre critérios são de 0,16 a 0,24 s e não cabem 18 f depois da palavra. O fio começa 18 f antes e o empurrão 10 f antes.
5. **O t1 é o arquivo da ficha, e não colunas deslizantes.** Colunas alternadas saindo em sentidos opostos são da família da guilhotina do N1 (página partida em peças que saem em direções opostas). A ficha da dúvida inteira, com os números 01–04, sobe 720 px como um bloco, de f154 a f170.
6. **Recolher por baixo da vizinha.** Sobra a coluna de rótulos, e não o "$$$" durante "sem pressão". A última parada tem 7 f para o respiro ter 45 f.
7. **Deriva de +12 px com curva por parada**, e não +0,4 px/f linear. A linear quebraria a regra 7 e somaria 90 px em c05, empurrando a coluna 3 para fora da margem.
8. **O cartão começa em "Leva" (f708)**, e não em f702, porque toda cena abre na palavra-âncora. A legenda sai com o empurrão.
9. **Sem célula cobalto na legenda, sem contador e sem faixa cobalto no cartão, e papel azulado no lugar do papel-frio** (revisão 2, acima). O t2 passa a nascer do cursor, porque a célula de "Porque" deixou de existir.

## 5. Blueprint de automação

O pipeline lê **`/Users/lucasmqar/Desktop/lovit/cursosdeunhas/marketing/v6/n4/blueprint.json`**: 7 cenas, 7 transições (t0–t6), 1 leito, 7 efeitos e as legendas G1–G15, com tempos em segundos já somados ao LEAD.

Para implementar em `remotion/src/v6/n4.tsx`:
- `V6Def` com `lead: 0` em todas as cenas (as transições caem na palavra).
- Composição com `durationInFrames = 862`: o `totalFrames` do motor dá 873 porque usa `t.duration`, que é a duração do mp3 (26,04 s).
- Legenda própria a partir de G1–G15. `capGroups` e `activeCap` não servem: quebram por contagem e somem no silêncio.
- No motor, `Sfx` e `Track` precisam ganhar `trimBefore`, `playbackRate` com `preservePitch={false}` e ganho por chaves em dB (livro, §8). Os valores estão no objeto `render` de cada arquivo.
- Fontes: `useSystemFonts(['500 56px "Helvetica Neue"', '700 64px HNCond', '900 260px HNCond', 'italic 400 220px Charter'])`, com um `@font-face` por entrada de `fontes` (`font-family: familia; src: local(src_local)`), `font-synthesis: none` e `tabular-nums`.
- Antes do Meta, gerar stills de f0, f14, f91, f150, f162, f240, f324, f387, f424, f612, f663, f727, f790 e f800, mais a folha de contato para o Lucas (regra 9).
