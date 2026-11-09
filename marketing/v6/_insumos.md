# v6 · Insumos para a direção dos 4 anúncios de unhas (N1–N4)

Data: 09/11/2026. Pasta de trabalho: `cursosdeunhas/marketing/v6/`. Motor: `cursosdeunhas/marketing/remotion/` (Remotion 4.0.541, React 19, 30 fps, composições 1080×1920 e 1080×1080).

## Regras do Lucas (não negociáveis)
1. **Não reescrever do zero.** Upgrade de qualidade sobre o material existente.
2. **Zero crédito novo.** Nada de gerar voz, música ou efeito no ElevenLabs agora. Usar **as narrações já gravadas** (`remotion/public/audio/n1..n4.mp3`, voz "Pri", ElevenLabs) e **só os sons listados abaixo**. Processar áudio com o ffmpeg do Remotion (filtro, pitch, tempo, reverb, recorte) é permitido e não custa nada. Criar o mínimo de arquivos novos.
3. **Cada vídeo é uma assinatura própria.** Nenhuma repetição entre os 4 de: conceito visual, paleta de destaque, par tipográfico, grade, vocabulário de transição, trilha/tema sonoro, efeitos, tratamento de legenda, cartão final. Nada de cabeçalho repetido, selo/tag fixa ("CURSOS DE UNHAS" em todo vídeo), moldura padrão.
4. **Som segue a emoção da fala.** Se a fala abre triste, o som abre triste/neutro; nada alegre antes da virada emocional. Som feliz só depois que a narração vira para esperança. A trilha não pode contradizer nenhum trecho.
5. **Cada take parece um editorial de revista**: composição de página, hierarquia tipográfica, respiro, uma ideia por tela, simples, direto e claro. Referência de motion design de estúdio (nível ManvsMachine / Buck / Apple), nunca template.
6. **Só motion design.** Cores **sólidas** (sem degradê, vinheta, glow, blur, sombra difusa, textura). **Proibido fade/crossfade/opacidade animada** como entrada, saída ou transição. Entradas e saídas por máscara, corte, deslocamento, escala, desenho de traço, divisão de plano, morph de forma. Nada de tremida, flash, zoom pulsante, RGB split.
7. Molas com overshoot ≤ 6% (o Lucas rejeitou excesso de efeito em 08/11). Nada se move linearmente. Saída ≈ 60% do tempo da entrada.
8. Legenda presa ao tempo real da voz (Whisper, `remotion/src/timing/n{k}.json`, campos `w`, `s`, `e` em segundos). Texto grande na tela não pode duplicar a legenda ao mesmo tempo.
9. Mostrar quadros ao Lucas antes de publicar. Nada vai ao Meta sem OK.

## Habilidade "launch-motion" (anexada pelo Lucas), adaptada
- Storyboard é a fonte da verdade: lista de cenas com faixa de quadros, o que está na tela, como move, câmera. Somar exatamente a duração.
- História: atenção → problema/sensação → caminho → payoff (CTA).
- Algo importante fica ≥ 1,5 s na tela. Contadores ~1 s com ease-out.
- Câmera: um contêiner por cena, sempre easy-ease, micro-push contínuo; "nada para totalmente" (deriva lenta de 1–2%).
- Parenting, offset de 2–4 quadros entre elementos de um grupo, overlap no último ~20% do movimento.
- Posicionar tudo a partir do centro; elemento-chave dentro do quadrado central 1080×1080 (para o corte 1:1).
- Checklist: fontes carregadas antes do quadro 0, nenhum texto sobreposto em nenhum quadro, repetidos com stagger, nada sai do quadro sem intenção.

## Dados de desempenho (Meta, campanha 52521304526791, desde 08/11 15h)
- Gasto R$ 39,89; 1.968 impressões; 78 cliques no link; 63 visitas; 7 leads (escolha na /comecar/); 10 idas à Hotmart (initiate_checkout).
- **88% do gasto foi para "N1 — imagem"** (R$ 35,29, 70 cliques, CTR 4,58%, todos os 7 leads). Os 4 vídeos v1 quase não receberam entrega (5 a 60 impressões cada). N4 vídeo: 20 views, p25 11, p75 1. N2 vídeo: 19 views, p25 10, p75 2.
- Posicionamentos que entregaram: **só Reels e Stories** (FB e IG). Logo, 9:16 é o formato principal; respeitar a zona coberta pela interface do Reels (topo ~250 px e base ~420 px no 1080×1920).
- Idade: 65+ levou a maior fatia do gasto; 25–34 e 45–54 deram mais cliques.
- Leitura: a mensagem estática do N1 ("Não começou com coragem. Começou com uma decisão pequena: aprender.") converteu; os vídeos não seguraram nem os 3 primeiros segundos. O gancho visual é o maior gargalo.

## Funil e compliance
- Destino: `cursosdeunhas.com.br/comecar/?src=meta-n{k}` (uma pergunta, 3 caminhos) → Hotmart (3 cursos WebHoje: Manicure até R$ 49,90; Nail Academy até R$ 100; Escola Designer até R$ 147).
- Proibido: prometer renda, nomes de marca dos cursos no anúncio, afirmar atributos pessoais de quem assiste ("você está desempregada?"). Preços só relativos. "Contém links de afiliado" vai na descrição do anúncio, não precisa estar no vídeo.

## Roteiros e tempos (narração gravada; não muda)
Arquivos de tempo: `remotion/src/timing/n{1..4}.json` → `{duration, words:[{w,s,e}]}`. O motor dá `LEAD = 0,45 s` de respiro antes da voz e `TAIL = 2,6 s` de cartão final depois.

| # | Conceito | Emoção (arco) | Fim da voz | Texto |
|---|---|---|---|---|
| N1 | As mãos dela | cansaço → caminho → orgulho/autonomia | 31,92 s | Ela olhava pras próprias mãos… e só via cansaço. Até que viu um caminho. Primeiro, nas próprias unhas. Depois, na irmã. Depois, na vizinha. Hoje, cada unha bem-feita tem a assinatura dela. Não começou com coragem. Começou com uma decisão pequena: aprender. No tempo dela. Sem sair de casa. Toda história assim começa do mesmo jeito: com uma primeira aula. Descubra por onde começar. Leva dois minutos. |
| N2 | Onze da noite | silêncio da casa → tempo só dela → gratidão serena | 25,42 s | Onze da noite. A casa dorme. Pra muita mulher, é o pedaço do dia que é só dela. Tem quem use esse tempo pra descansar. E tem quem use pra aprender a fazer unhas. Uma aula de cada vez. Uma unha de cada vez. Sem pressa, sem sair de casa. Um dia ela vai olhar pra trás… e agradecer por essa noite. Se der vontade, veja por onde começar. |
| N3 | O detalhe | ternura → orgulho de cuidar | 25,94 s | Sabe aquela sensação de olhar pra mão e sorrir sozinha? Tem sempre alguém por trás desse sorriso. Agora imagina ser essa pessoa. A que devolve esse sorriso pra outra mulher. Unha é detalhe. Mas é no detalhe que muita gente volta a se sentir bonita. Aprender isso é aprender a cuidar. Dá pra começar do zero, no seu ritmo, sem sair de casa. Veja qual caminho é o seu. |
| N4 | Com calma | dúvida → método → segurança | 25,68 s | Antes de pagar por um curso de unhas, ela fez uma coisa simples: comparou. O que ensina. Se tem certificado. Quanto custa. Se tem garantia. Porque escolha boa é escolha com calma. A gente reuniu três caminhos, do zero ao alongamento, com o que cada um ensina, preço e garantia lado a lado. Sem pressa, sem pressão. Leva dois minutos pra ver qual caminho é o seu. |

Textos atuais do anúncio (podem ganhar upgrade, sem custo): N1 título "Descubra por onde começar"; N2 "Uma aula de cada vez"; N3 "Aprender unhas é aprender a cuidar"; N4 "Compare antes de escolher".

## Sons disponíveis (medidos em 09/11; só estes)
Caminhos curtos: `S=cursosdeunhas/marketing/audio/sfx`, `F=flux/flux/outputs/marketing-2026-11/motor/public`, `C=lovit/canal/02-motor/public/sfx`, `D=~/Downloads`.

| Arquivo | Dur. | Caráter medido | Leitura emocional |
|---|---|---|---|
| `S/musica.mp3` (= `D/Quick_Hit…mp3`) | 40 s | ré maior, brilhante (2,5 kHz), 3,2 ataques/s, energia constante −14 dB | **alegre/animada**: só depois de virada positiva, e baixa |
| `F/trilha/base.mp3` | 45 s | sol# menor, escura (1,3 kHz), esparsa (1,3 ataques/s), −23 dB | melancólica, contemplativa, noturna |
| `F/trilha/beat1.mp3` | 32 s | fá maior, crescente (−24 → −11 dB), 3,1 ataques/s | otimismo que cresce; batida |
| `F/trilha/beat2.mp3` | 32 s | dó maior, brilhante, 3,8 ataques/s, constante | energia/pressa (ruim para "com calma") |
| `D/0_sounds_to_inicial…mp3` | 4 s | swell que nasce do silêncio (−73 → −19 dB), grave | abertura, respiração, "algo começa" |
| `D/Soft,_electronic_UI…mp3` | 2,3 s | sol menor, suave | interface delicada, contido |
| `D/Notification_ping…mp3` | 2,7 s | agudo (4,6 kHz) | notificação; usar com cuidado |
| `S/sparkle.mp3` (= `D/magical_sparkle…`) | 1,5 s | brilho, dó maior | encantamento (positivo) |
| `S/whoosh.mp3` (= `D/fast_airy_swoosh…`) | 1 s | ar médio | passagem rápida |
| `S/impact.mp3` (= `D/cinematic_deep_boom…`) | 2 s | grave 430 Hz, cauda longa | peso, decisão |
| `S/riser.mp3` (= `D/tension_riser…`) | 2 s | sobe | tensão/antecipação |
| `S/pop.mp3` (= `D/soft_bubbly_pop…`) | 0,5 s | pop macio | toque, clique |
| `C/tick.wav` | 0,2 s | tique seco e agudo | relógio, precisão |
| `C/twang.wav` | 0,7 s | corda, sol maior | leveza, "plim" |
| `C/impacto.wav` | 0,8 s | sub-grave 105 Hz | batida surda |
| `C/whoosh.wav` | 0,6 s | ar agudo | corte rápido |
| `F/sfx2/tick.mp3` | 0,5 s | tique metálico | precisão |
| `F/sfx2/{boom,cash,glitch,impacto,pop,riser,whoosh}.mp3` | curtos | usados nos reels do Flux | evitar (marca Flux; glitch/cash proibidos aqui) |

Observação: `musica.mp3` hoje é a mesma trilha nos 4 vídeos, com whoosh nos cortes e sparkle no fim de todos — exatamente a repetição a eliminar.

## Fontes disponíveis no Mac (Chrome headless enxerga por nome)
Serifadas editoriais: Didot, Bodoni 72 (e Smallcaps, Ornaments), Big Caslon, Baskerville, Hoefler Text, Athelas, Iowan Old Style, Charter, Georgia, Palatino. Sem serifa: Avenir Next (e Condensed), Futura, Gill Sans, Helvetica Neue, Optima, Seravek, SF (SFNS, SF Compact, SF Mono). Display: SuperClarendon, Rockwell, Copperplate, SignPainter (script).

## Paleta atual da marca (pode ser variada por vídeo, sempre sólida)
nude #F6EDE8 · nude2 #EFE1DA · ameixa #6E1F45 · ameixa profunda #3E1028 · noite #24101C · rosé #D99BA8 · dourado #C9A27E · tinta #3B2430 · cinza #9C8590. Símbolo do projeto: ovais de unha.

## Motor atual (o que existe; v5)
- `src/Ad.tsx` casca comum (trilha única, fundo com manchas em degradê, transição fade+sobe 36 px em todo corte, legenda, EndCard); `src/core.tsx` (palco centralizado, easing `ramp` = ease do CSS); `src/parts.tsx` (Kinetic, Chip, Label com opacity); `src/Captions.tsx` (pílula de 3 palavras que desliza); `src/EndCard.tsx` (idêntico nos 4); `src/ads/n1..n4.tsx` (cenas presas às palavras); `src/registry.ts`, `src/Root.tsx`, `render.mjs`, `tools/align.py`, `tools/sheet.py`.
- Problemas medidos: mesma transição em todos os cortes (`Ad.tsx:86-97`), mesmo layout centralizado, gradientes e sombras, EndCard igual, mesma trilha/curva/whoosh/sparkle nos 4, cena-molde repetida (frase pequena + palavra serifada gigante + sublinhado) em N1, N3 e N4, checklist repetido em N3 e N4, fades por toda parte.

## Ferramentas v6 (prontas em 09/11)
- Motor: `remotion/src/v6/engine.tsx` — `V6Ad`/`V6Def` (cenas presas à palavra, fundo sólido por cena, `enter` por geometria), `T.cut|wipe|iris|slats|push`, `MaskLine` (texto por máscara), `Stroke` (traço que se desenha), `EASE.entra|sai|troca|suave`, `MOLA.pico|firme|lenta` (overshoot ≤ ~5%), `useAt()` (quadro local da palavra), `capGroups/activeCap` (legenda presa à fala), `useSystemFonts`, trilhas com ducking automático sob a voz (`tracks[].duckDb`) e efeitos (`sfx[]`). Canvas 1080×1920; no 1:1 mostra o quadrado central (y 420–1500). Exemplo: `src/v6/smoke.tsx`. Registro: `src/v6/registry.ts`; composições `V6-N{k}-9x16|1x1`.
- Render: `node render_v6.mjs [--stills ID s1 s2…] [--sheet ID 24]` → `out/v6/*.png` e `../videos_v6/`. Folha de contato: `python3 tools/sheet.py saida.png quadros*.png`.
- Áudio sem crédito: o ffmpeg do Remotion só tem asetrate/atempo/atrim/volume/loudnorm/amix/adelay/apad/pan (`tools/ff.sh ffmpeg …`, caminhos absolutos). Filtro e reverb: `python3 tools/dsp.py ENTRADA SAIDA trim=INI:DUR pitch=ST tempo=F lowpass=HZ highpass=HZ reverb=S:MIX gain=DB norm=DB mono` (saída em `public/audio/v6/`).
