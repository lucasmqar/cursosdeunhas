# Estratégia de vendas — Cursos de Unhas (afiliado Hotmart)

Atualizado em 08/11/2026.

## 1. Estrutura de afiliados

| Produto (Hotmart) | ID | Produtor | Preço conferido | Hotlink | Papel no funil |
|---|---|---|---|---|---|
| Curso de Manicure e Pedicure Profissional | 1781682 | WebHoje | até R$ 49,90 | go.hotmart.com/H108389444X | Entrada: quem começa do zero |
| Nail Academy (17 níveis) | 2239636 | WebHoje | até R$ 100 | go.hotmart.com/J108389456B | Principal: formação completa |
| Escola Designer de Unhas | 897412 | WebHoje | até R$ 147 | go.hotmart.com/Q108389424A | Upgrade: quem já faz e quer alongamento |
| VOLL + | 4222809 | — | — | — | Fora do nicho, não usado |

- Os 3 cursos de unha são do mesmo produtor, então o funil não compete consigo mesmo: cada pessoa é levada ao curso do seu momento.
- Rastreio: todo clique sai por `/ir/<curso>/?src=<origem>`; o `src` chega à Hotmart e aparece no relatório de vendas por origem.
  - `src=meta-<conceito>` nos anúncios Meta, `src=gads` no Google, `src=cursosdeunhas` no orgânico.
- Conversão: "Compra Hotmart" (Google Ads) já está no Pixel de Rastreamento da Hotmart. Para o Meta otimizar por compra, falta colar o Pixel do Meta no mesmo campo da Hotmart (ver item 6).
- Regras que seguimos: não usar os nomes de marca nos anúncios até o produtor autorizar; não prometer renda; não afirmar atributos pessoais de quem vê o anúncio ("você está desempregada?") — política do Meta.
- Comissão: conferir em Hotmart › Mercado de afiliação › produto › "Comissão" (não aparece na lista de afiliações).

## 2. Funil

```
Anúncio indireto (Reels/Stories/Feed, narrado)  ─┐
Google Pesquisa (intenção "curso de unha...")   ─┼─>  /comecar/  (3 momentos)  ─>  /ir/<curso>/?src=...  ─>  checkout Hotmart
Orgânico (artigos e análises)                   ─┘
```

A página `/comecar/` não vende curso: ela faz uma pergunta ("em que momento você está?") e entrega o caminho certo. É o marketing indireto: o anúncio vende a sensação (autonomia, tempo seu, cuidado), a página ajuda a escolher, e a página oficial do produtor vende o curso.

## 3. Conceitos criativos (vetoriais, minimalistas, emotivos)

Paleta: nude #F6EDE8, ameixa #6E1F45, rosé #D99BA8, dourado #C9A27E. Formas: ovais de unha como símbolo único; nada de foto de banco de imagem, nada de "ganhe dinheiro".

| # | Conceito | Símbolo | Emoção | Público |
|---|---|---|---|---|
| 1 | As mãos dela | 5 ovais nascendo como um sol | Recomeço, autonomia | Mulheres 22–45 interessadas em beleza, unhas e manicure |
| 2 | Onze da noite | Lua + oval acesa | Tempo só seu | Mulheres 25–45, rotina cheia |
| 3 | O detalhe | Uma oval com brilho | Orgulho, cuidado | Interessadas em manicure e nail art |
| 4 | Com calma | 3 ovais lado a lado (escolha) | Segurança para decidir | Quem já pesquisa curso (remarketing e Google) |

## 4. Roteiros das narrações (revisados por 3 revisores + editor; 25–35 s)

**N1 — As mãos dela**
> Ela olhava pras próprias mãos… e só via cansaço. Até que viu um caminho. Primeiro, nas próprias unhas. Depois, na irmã. Depois, na vizinha. Hoje, cada unha bem-feita tem a assinatura dela. Não começou com coragem. Começou com uma decisão pequena: aprender. No tempo dela. Sem sair de casa. Toda história assim começa do mesmo jeito: com uma primeira aula. Descubra por onde começar. Leva dois minutos.

**N2 — Onze da noite**
> Onze da noite. A casa dorme. Pra muita mulher, é o pedaço do dia que é só dela. Tem quem use esse tempo pra descansar. E tem quem use pra aprender a fazer unhas. Uma aula de cada vez. Uma unha de cada vez. Sem pressa, sem sair de casa. Um dia ela vai olhar pra trás… e agradecer por essa noite. Se der vontade, veja por onde começar.

**N3 — O detalhe**
> Sabe aquela sensação de olhar pra mão e sorrir sozinha? Tem sempre alguém por trás desse sorriso. Agora imagina ser essa pessoa. A que devolve esse sorriso pra outra mulher. Unha é detalhe. Mas é no detalhe que muita gente volta a se sentir bonita. Aprender isso é aprender a cuidar. Dá pra começar do zero, no seu ritmo, sem sair de casa. Veja qual caminho é o seu.

**N4 — Com calma**
> Antes de pagar por um curso de unhas, ela fez uma coisa simples: comparou. O que ensina. Se tem certificado. Quanto custa. Se tem garantia. Porque escolha boa é escolha com calma. A gente reuniu três caminhos, do zero ao alongamento, com o que cada um ensina, preço e garantia lado a lado. Sem pressa, sem pressão. Leva dois minutos pra ver qual caminho é o seu.

Configuração ElevenLabs: voz "Pri – Warm & Natural Brazilian Portuguese" (biblioteca), Multilingual v2, estabilidade 45, similaridade 75, estilo 25, velocidade 0,95, speaker boost ligado. Custo: ~1.550 créditos para as 4.

## 5. Textos dos anúncios Meta (final)

| # | Texto principal | Título | Descrição | URL |
|---|---|---|---|---|
| N1 | Não começou com coragem. Começou com uma decisão pequena: aprender. Veja por onde começar, no seu ritmo. | Descubra por onde começar | Guia de cursos de unhas on-line. Contém links de afiliado. | /comecar/?src=meta-n1 |
| N2 | Onze da noite. A casa dorme. Uma aula de unhas de cada vez, no seu ritmo. Veja por onde começar. | Uma aula de cada vez | Guia de cursos de unhas on-line. Contém links de afiliado. | /comecar/?src=meta-n2 |
| N3 | Unha é detalhe. Mas é no detalhe que muita gente volta a se sentir bonita. Veja por onde começar a aprender. | Aprender unhas é aprender a cuidar | Guia de cursos de unhas on-line. Contém links de afiliado. | /comecar/?src=meta-n3 |
| N4 | Do zero ao alongamento: compare conteúdo, certificado, preço e garantia de três caminhos. Leva 2 minutos. | Compare antes de escolher | Guia de cursos de unhas on-line. Contém links de afiliado. | /comecar/?src=meta-n4 |

Chamada: Saiba mais. A página /comecar/ troca título e subtítulo conforme o `src` (n2, n3, n4).

## 6. Campanhas e automação

**Meta — "Unhas | Vendas | Indireto"**
- Objetivo: Vendas, conversão no site (evento: clique de saída `/ir/` como `Lead` até o Pixel do Meta receber compras da Hotmart; depois `Purchase`).
- Orçamento da campanha (Advantage) — R$ 50/dia (aprovado em 08/11/2026), 4 anúncios (N1–N4) em vídeo 9:16 + imagem 1:1.
- Público: Brasil, mulheres 20–50, Advantage+ público com sugestão de interesses: unhas, manicure, nail art, esmaltes, alongamento de unhas, salão de beleza.
- Posicionamentos Advantage+ (Reels, Stories, Feed).
- URL: `https://cursosdeunhas.com.br/comecar/?src=meta-n<1..4>`.

**Regras automáticas (Meta)**
1. Pausar anúncio com gasto > R$ 25 e 0 cliques de saída (Lead) nos últimos 3 dias.
2. Pausar anúncio com CTR do link < 0,6% depois de 2.000 impressões.
3. Aumentar orçamento em 20% (máx. 1x/3 dias, teto R$ 100/dia) quando custo por Lead < R$ 1,50 nos últimos 3 dias.

**Google** — Pesquisa já configurada; trocar para "Maximizar conversões" após ~15 vendas.

## 7. Métricas de controle

| Métrica | Bom | Ação se ruim |
|---|---|---|
| CTR do link (Meta) | > 1% | trocar o gancho (3 primeiros segundos) |
| Custo por clique de saída | < R$ 1,50 | revisar público/criativo |
| Taxa LP → /ir/ | > 25% | simplificar a página |
| Custo por venda | < 60% da comissão | pausar o conceito |

## Comprar direto (09/11/2026)
Hotlinks de **checkout direto** da Hotmart (Ferramentas › Gerenciador de links › Escolher HotLink › "Página de Pagamento"). Eles levam o código de afiliado na própria URL do checkout (`ref=`), então não dependem só do cookie (os botões da página do produtor não levam `ref`).
| Curso | Checkout direto | Preço no checkout |
|---|---|---|
| Manicure e Pedicure | go.hotmart.com/H108389444X?ap=46e8 | R$ 47 à vista |
| Nail Academy | go.hotmart.com/J108389456B?ap=4d48 | R$ 97 à vista |
| Escola Designer | go.hotmart.com/Q108389424A?ap=b64d | R$ 67 à vista (os checkouts 1912 e 2b70 são de R$ 147) |
No site: `/ir/<curso>/checkout/` (mesmo `src`, Pixel InitiateCheckout e conversão "Clique de saída" do Google). Link discreto "ou comprar direto" nos cards, nas análises e na /comecar/.
