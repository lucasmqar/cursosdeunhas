# v6 · Adaptação do Livro de Assinaturas à marca (09/11/2026)

O Livro (`LIVRO-DE-ASSINATURAS.md`) e os blueprints `n{k}/blueprint.*` continuam valendo para conceito, tempos, transições, câmera, legenda e som. **Esta tabela prevalece sobre eles em duas coisas: fontes e cores.** Decisão da tarefa de 09/11: base nos assets reais da marca (`marketing/ativos/n{1..4}_*.svg`); a imagem do N1 levou 88% do gasto e todos os leads.

## Fontes (fixas nos 4 vídeos)
- Serifa: **Georgia** (Regular, Italic, Bold, Bold Italic). Substitui Didot, Big Caslon, Hoefler Text e Charter.
- Sem serifa: **Helvetica Neue** (Light, Regular, Medium, Bold; Condensed Bold/Black via `local()`, `HN_COND_CSS` em `src/v6/marca.tsx`) ou `-apple-system` (SF). Substitui Futura, Gill Sans e Optima.
- Assinatura tipográfica = **uso**, não família: corpo, peso, caixa, alinhamento, tracking e papel de cada fonte mudam por vídeo.

| Vídeo | Manchete / título | Legenda | Apoio |
|---|---|---|---|
| N1 · A capa dela | Georgia Bold e Georgia Italic gigantes (até ~230 px), sangrando | Helvetica Neue Medium 60, caixa-baixa, à esquerda | Helvetica Neue Bold 30–34, caixa-alta, +0,14 em (linhas de capa) |
| N2 · A noite dela | Georgia Regular 92 (título do cartão) | o diário em **Georgia Regular 62**, palavras-chave em Georgia Italic | Helvetica Neue Medium 34, algarismos tabulares (fólio-relógio), marginália em HN Medium 28 caixa-alta |
| N3 · Linha do sorriso | Georgia Bold Italic 88 (cartão) | **Helvetica Neue Bold 60 centrada**, palavras-chave em Georgia Italic | Helvetica Neue Regular 38 (URL) |
| N4 · Medir com calma | Helvetica Neue Condensed Black 260 (contador) | **Helvetica Neue Medium 56** à esquerda, linha de tabela | HN Condensed Bold 40–64 (01–04, $); Georgia Italic nos "?" (220) e na nota (28) |

## Cores (só a paleta da marca, sempre sólidas)
Paleta: nude #F6EDE8 · nude2 #EFE1DA · ameixa #6E1F45 · ameixa profunda #3E1028 · noite #24101C · rosé #D99BA8 · dourado #C9A27E · tinta #3B2430 · cinza #9C8590 · branco #FFFFFF · leque das unhas #D99BA8 #C77D92 #A24E6F #86325A #6E1F45. Tons de pele das mãos (ilustração neutra, não acento): dourado #C9A27E, areia #D9B79E, canela #A97A5E.

| Vídeo | Fundo | Texto | Acento exclusivo | Apoio | Substitui no Livro |
|---|---|---|---|---|---|
| N1 | nude #F6EDE8 (o do asset que converteu) | tinta #3B2430 | **ameixa #6E1F45** (esmalte, palavras, retângulo da URL) | cinza #9C8590 = cansaço (mão antes da virada); peles dourado/areia/canela depois | osso → nude; grafite → tinta; vermelho #A6192E → ameixa; cinza-cansaço → cinza |
| N2 | noite #24101C | nude #F6EDE8 | **dourado #C9A27E** (janela acesa, abajur, página final) | ameixa profunda #3E1028 = janela apagada / verso; cinza #9C8590 = fios e fólio | noite-ameixa → noite; âmbar → dourado; papel-lua → nude; lilás → cinza |
| N3 | branco #FFFFFF | ameixa #6E1F45 | **rosé #D99BA8** (esmalte, gota, inundação) | branco = linha do sorriso (só sobre rosé/ameixa); nude2 = unha nua | leite → branco; rosa-chá → rosé |
| N4 | nude2 #EFE1DA | tinta #3B2430 | **ameixa profunda #3E1028** (cursor, célula da legenda, Harvey balls, faixa da URL) | cinza #9C8590 = palavra não dita/inativo; fio #D8C6BE (tint) = hairline | papel-frio → nude2; grafite → tinta; cobalto → ameixa profunda; cinza-régua → cinza |

## Forma
- **Sem mãos vetoriais** (Lucas, 09/11: "mãos vetoriais não é ideal"). Nenhuma mão, palma ou dedo desenhado em nenhum vídeo: a figura é só a unha como objeto, como nos assets (o leque de 5 unhas do símbolo, a unha única, as 3 unhas lado a lado). Onde o Livro fala em mão, use o leque ou a unha.
- A unha é a do símbolo (`Unha`, `unhaD`, `brilhoD` em `src/v6/marca.tsx`): borda livre arredondada em cima, cutícula embaixo, reflexo em arco. Reflexo em cor sólida (tint), nunca opacidade.
- Regras de movimento, som e legenda: as do `PADRAO-PRODUCAO-V6.md` e do Livro, sem mudança.
