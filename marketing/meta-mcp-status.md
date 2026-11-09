# Status Meta Ads via MCP — 2026-11-08 ~12:20 (BRT)

Só leitura feita, nada foi alterado. Fonte: servidor MCP `meta-ads` (oficial), conta `act_1052748413971495`.

## 0. Achado principal

**A campanha "Unhas | Indireto | Lead" ainda NÃO está publicada.** Ela existe só como **rascunho do Ads Manager**
(draft, `status=EDITING`, `validation_status=VALIDATED`, sem erros). Por isso ela não aparece entre as campanhas
"live" e `ads_get_errors` não acha os IDs.

**Atenção:** no rascunho, campanha, conjunto e os 4 anúncios estão com `status=ACTIVE`. Ao clicar em **Publicar**
(no navegador ou com `ads_activate_entity`), a campanha **entra no ar na hora e começa a gastar R$ 50/dia**.
Para publicar desligada é preciso, antes de publicar, desligar a campanha no rascunho (botão no Ads Manager ou
`ads_update_entity` com `{"status":"PAUSED"}`, que fica salvo no rascunho), ou só publicar quando os vídeos já estiverem prontos.

## 1. Ferramentas do MCP meta-ads (resumo)

| Ferramenta | Para que serve |
|---|---|
| `ads_get_ad_accounts`, `ads_get_ad_account_pages`, `ads_get_ig_accounts`, `ads_get_pages_for_business` | contas, Páginas e Instagram ligados |
| `ads_get_ad_entities` | lê campanhas, conjuntos e anúncios (live ou **draft**) e métricas; `effective_status` mostra PENDING_REVIEW / DISAPPROVED / ACTIVE |
| `ads_get_field_context` | valida nomes de campos antes de consultar |
| `ads_get_errors` | erros que bloqueiam a entrega (não cobre reprovação de anúncio) |
| `ads_account_get_activity_logs` | histórico de alterações |
| `ads_get_creatives`, `ads_get_ad_images`, `ads_get_ad_videos`, `ads_get_ad_preview` | lê criativos, imagens, vídeos (status de processamento) e prévia |
| **`ads_creative_upload_media`** | **faz upload de imagem ou VÍDEO** para a conta: por `URL` pública direta, ou `LOCAL_FILE` (só em cliente com MCP Apps interativo) |
| **`ads_create_creative`** | **cria criativo de vídeo** (`video_id` + miniatura obrigatória), imagem, carrossel e **placement_customizations** (9:16 em Stories/Reels e 1:1 como padrão no mesmo criativo) |
| **`ads_create_ad`** | cria anúncio num conjunto existente (no modo rascunho, entra no draft) |
| `ads_create_campaign`, `ads_create_ad_set` | cria campanha / conjunto (rascunho) |
| **`ads_update_entity`** | **muda orçamento** (`daily_budget` em centavos), **pausa** (`status=PAUSED`), nome, público, agenda; descarta rascunho |
| **`ads_activate_entity`** | **liga / publica** campanha, conjunto ou anúncio (`publish_as_active`); só com aprovação explícita |
| `ads_creative_update`, `ads_creative_delete` | renomeia / apaga criativo |
| `ads_creative_create_image_variations`, `ads_creative_update_image_elements` | variações / edição de imagem por IA |
| `ads_get_datasets`, `ads_get_dataset_details`, `ads_get_dataset_quality`, `ads_get_dataset_stats` | pixel: dados, EMQ, volume de eventos |
| `ads_pixel_event_*`, `ads_pixel_parameter_*` | configuração de eventos do pixel |
| `ads_create_custom_audience`, `ads_update_custom_audience(_users)`, `ads_delete_custom_audience`, `ads_get_ad_account_custom_audiences` | públicos personalizados e semelhantes |
| `ads_insights_*`, `ads_get_opportunity_score` | tendências, benchmarks, anomalias, recomendações |
| `ads_experiment_*` | testes A/B e estudos de lift |
| `ads_boost_ig_post`, `ads_get_ig_media` | impulsionar post do Instagram |
| `ads_catalog_*` | catálogo de produtos (não usado aqui) |
| `ads_library_search`, `ads_get_help_article` | biblioteca de anúncios, ajuda |

**Regras automáticas: não existe ferramenta** no MCP para criar ou ler regras automáticas.

## 2. Campanhas da conta `act_1052748413971495` (live)

Todas pausadas. Nenhuma é do projeto de unhas.

| ID | Nome | Status | Objetivo | Orçamento diário | Gasto total |
|---|---|---|---|---|---|
| 52513492314991 | FLUX_GOIATUBA_DRIVER — Cópia — Cópia | PAUSED | ENGAGEMENT | R$ 150 (campanha) | R$ 19,09 |
| 52513461734591 | FLUX_GOIATUBA_DRIVER — Cópia | PAUSED | ENGAGEMENT | R$ 150 (campanha) | R$ 40,44 |
| 52513318772191 | FLUX_GOIATUBA_DRIVER | PAUSED | ENGAGEMENT | R$ 50 (campanha) | R$ 19,45 |
| 52512491563991 | TALITA FRAZZINO | PAUSED | TRAFFIC | no conjunto | R$ 87,86 |
| 6999153484187 | C-VID-AB01-WP | PAUSED | ENGAGEMENT | R$ 250 (campanha) | R$ 186,74 |
| 6998824302987 | LA \| WHATSAPP MSG \| BJG-GO \| 2D R$300 | PAUSED | ENGAGEMENT | no conjunto | R$ 76,81 |

## 3. "Unhas | Indireto | Lead" (RASCUNHO, não publicada)

### Campanha `52521304526791`
- Objetivo: `OUTCOME_LEADS` (tipo unificado de leads), leilão.
- Orçamento: **R$ 50,00/dia na campanha** (`daily_budget=5000`, CBO), lance de menor custo sem limite.
- Categoria especial: nenhuma. Status no rascunho: ACTIVE (ver alerta no item 0).

### Conjunto `52521304526991` — "BR | Mulheres 20-50 | Advantage+"
- Meta de desempenho: `OFFSITE_CONVERSIONS`, evento **LEAD** no pixel `1828949965085065`. Cobrança por impressões.
- Atribuição: 7 dias clique, 1 dia visualização, 1 dia visualização engajada.
- Início: 2026-11-08 12:02 (BRT), sem data de fim.
- Público: Brasil (casa, recente, frequente); mulheres; idade mínima fixa 20 (máx. 65), **Advantage+ público ligado**
  com sugestão de 20–50 anos e interesses sugeridos: Salões de beleza, Esmaltes, Manicure, unhas decoradas,
  Unhas artificiais; idioma `locales: [1005]`.
- Posicionamentos: **Advantage+ (automáticos)**, sem lista manual de plataformas. Filtro de segurança de marca "relaxado".

### Anúncios (estado no momento da leitura)

Ainda **sem status de análise**: anúncio em rascunho não vai para revisão. A análise (em análise / aprovado /
reprovado) só começa depois de publicar.

| ID | Nome | URL | Texto / título |
|---|---|---|---|
| 52521304527191 | N1 — imagem | `/comecar/?src=meta-n1` | texto N1, título "Descubra por onde começar" |
| 52521306411991 | N2 — imagem | `/comecar/?src=meta-n2` | **ainda com texto, título e imagem do N1** |
| 52521306412191 | N1 — imagem — Cópia | `/comecar/?src=meta-n1` | cópia do N1 (não editada) |
| 52521306412391 | N1 — imagem — Cópia | `/comecar/?src=meta-n1` | cópia do N1 (não editada) |

Comum aos 4 no momento: texto principal "Não começou com coragem. Começou com uma decisão pequena: aprender. Veja por
onde começar, no seu ritmo."; descrição "Guia de cursos de unhas on-line. Contém links de afiliado."; botão
"Saiba mais"; mesma imagem (`bff6697d556b91871f53223a795098b5`); Página `171858119345866`, Instagram
`17841479956486639`; melhorias Advantage+ de criativo todas desligadas; rastreamento no pixel.
A outra sessão parece estar no meio da edição: N2 só teve a URL trocada, e N3/N4 ainda são cópias do N1
(em `copy_final.json`, os títulos esperados são N2 "Uma aula de cada vez", N3 "Aprender unhas é aprender a cuidar",
N4 "Compare antes de escolher"). Conferir de novo quando ela terminar.

## 4. Pixel / conjunto de dados `1828949965085065` — "Cursos de Unhas Site"

- Ativo; criado hoje 11:56 (BRT); **último disparo do navegador hoje 12:09 (BRT)**, então o pixel já recebeu sinal.
- **Ligado à conta:** aparece na lista de datasets da `act_1052748413971495`, é do mesmo Business
  `2087946084950183`, e o conjunto do rascunho já o usa (evento LEAD + rastreamento).
- Conversions API (servidor): **nunca disparou** (`server_last_fired_time` vazio). Gateway não configurado.
- Correspondência avançada automática: **desligada** (`enable_automatic_matching=false`).
- Qualidade (EMQ): **sem dados ainda** (pixel novo).
- Eventos (PageView / Lead / InitiateCheckout): as estatísticas dos últimos 7 dias ainda vêm **vazias**. É normal para
  um pixel criado há ~1 h (a agregação atrasa). Não dá para confirmar evento por evento pelo MCP agora. Ler de
  novo mais tarde, ou usar a aba "Testar eventos" do Gerenciador de Eventos no navegador.
- Cookie próprio ligado; uso de dados "publicidade e análise".

## 5. O que o MCP faz sozinho e o que exige o navegador

### Dá para fazer só pelo MCP (depois que a outra sessão terminar de editar o rascunho)
1. **Subir os 8 vídeos** com `ads_creative_upload_media`, mas **só por URL pública direta**. O modo arquivo local
   exige cliente com MCP Apps interativo, e o Claude Code não serve. Caminho prático: publicar temporariamente
   `marketing/videos/n<k>_9x16.mp4` e `n<k>_1x1.mp4` (4–9 MB cada, ~48 MB no total) no próprio site
   (ex.: `https://cursosdeunhas.com.br/midia/n1_9x16.mp4`), subir por URL e tirar do site depois. Conferir o
   processamento com `ads_get_ad_videos` até `ready`.
2. **Criar 1 criativo por N<k>** com `ads_create_creative` + `placement_customizations`: 9:16 em Stories/Reels
   (Facebook e Instagram) e 1:1 como padrão; texto, título e descrição do `copy_final.json`;
   `link_url=https://cursosdeunhas.com.br/comecar/?src=meta-n<k>`; botão LEARN_MORE; `page_id 171858119345866`;
   `instagram_user_id 17841479956486639`. Miniatura obrigatória: pode usar o hash da imagem existente ou subir a
   arte N<k> por URL. O campo `self_ai_disclosure` (aviso de conteúdo feito com IA) precisa ser decidido pelo usuário
   antes, porque não dá para mudar depois.
3. **Criar os 4 anúncios de vídeo** no conjunto `52521304526991` com `ads_create_ad`. Como o conjunto ainda é
   rascunho, eles entram no mesmo rascunho (que é do mesmo usuário).
4. **Mudar orçamento** (`ads_update_entity`, `daily_budget` em centavos) e **pausar** (`status=PAUSED`).
5. **Publicar e ligar**: `ads_activate_entity` na campanha (publica o rascunho; com `publish_as_active=true` sai
   ligada). Precisa de aprovação explícita. Depois, verificar com `ads_get_ad_entities`.
6. **Acompanhar a análise**: `ads_get_ad_entities` (nível ad, `effective_status`) mostra em análise / aprovado /
   reprovado.

### Ainda exige o navegador
- **Regras automáticas** (criar, editar, ler): não há ferramenta no MCP.
- **Motivo detalhado de reprovação** e pedido de nova análise: o MCP só mostra `DISAPPROVED` (`ads_get_errors` não
  cobre reprovação). Usar Ads Manager / Qualidade da Conta.
- **Upload de vídeo direto do Mac** sem hospedar em URL pública.
- **Ligar a correspondência avançada automática** e configurar a Conversions API no Gerenciador de Eventos.
- **Testar eventos em tempo real** (Lead / InitiateCheckout) no Gerenciador de Eventos.

### Cuidado com edição ao mesmo tempo
O MCP enxerga e edita **o mesmo rascunho** que a sessão do navegador. Não mexer pelo MCP enquanto a outra sessão
estiver editando, para um lado não sobrescrever o outro. E lembrar: publicar o rascunho como está = campanha
**ligada**.

## Publicação

2026-11-08, feita só pelo MCP `meta-ads` (sessão lateral). Nada foi mexido no Instagram nem no navegador.

**Resultado:** campanha publicada e **ATIVA**. Os 8 anúncios foram publicados. Na última leitura, as 4 imagens estavam em `PENDING_REVIEW` (em análise) e os 4 vídeos
em `IN_PROCESS` (ainda processando, antes de entrar em análise). Nenhum reprovado até então. `ads_get_errors` na
campanha: **nenhum erro de entrega**. Rascunho vazio depois da publicação.

### IDs publicados

| Nível | ID | Nome | status / effective_status | Conferido |
|---|---|---|---|---|
| Campanha | 52521304526791 | Unhas \| Indireto \| Lead | ACTIVE / ACTIVE | OUTCOME_LEADS, R$ 50/dia (CBO) |
| Conjunto | 52521304526991 | BR \| Mulheres 20-50 \| Advantage+ | ACTIVE / ACTIVE | OFFSITE_CONVERSIONS, evento LEAD no pixel 1828949965085065 |

| Anúncio | ID | Criativo publicado | URL | Aviso de IA | effective_status |
|---|---|---|---|---|---|
| N1 — imagem | 52521307478391 | 1705238621319385 | /comecar/?src=meta-n1 | não | PENDING_REVIEW (em análise) |
| N2 — imagem | 52521307605191 | 1020620541069757 | /comecar/?src=meta-n2 | não | PENDING_REVIEW (em análise) |
| N3 — imagem | 52521307644591 | 1574200841131703 | /comecar/?src=meta-n3 | não | PENDING_REVIEW (em análise) |
| N4 — imagem | 52521307656791 | 2201784817380674 | /comecar/?src=meta-n4 | não | PENDING_REVIEW (em análise) |
| N1 — vídeo | 52521307661591 | 1634673481485702 | /comecar/?src=meta-n1 | sim | IN_PROCESS |
| N2 — vídeo | 52521307665391 | 1444206491149198 | /comecar/?src=meta-n2 | sim | IN_PROCESS |
| N3 — vídeo | 52521307668591 | 2190487218203973 | /comecar/?src=meta-n3 | sim | IN_PROCESS |
| N4 — vídeo | 52521307673391 | 1160406769999960 | /comecar/?src=meta-n4 | sim | IN_PROCESS |

Textos e títulos conferidos um a um contra a tarefa antes de publicar (N1 "Descubra por onde começar", N2 "Uma aula de
cada vez", N3 "Aprender unhas é aprender a cuidar", N4 "Compare antes de escolher"). Comum aos 8: descrição "Guia de
cursos de unhas on-line. Contém links de afiliado.", botão LEARN_MORE, Página 171858119345866, Instagram
17841479956486639, rastreamento `offsite_conversion` no pixel 1828949965085065.

### Mídia enviada (URL `raw.githubusercontent.com/lucasmqar/cursosdeunhas/midia/…`)

| | 1:1 | 9:16 |
|---|---|---|
| N1 vídeo (33,2 s) | 1758728738526404 | 2196453047968779 |
| N2 vídeo (28,7 s) | 1460586542697828 | 2073808356668134 |
| N3 vídeo (31,4 s) | 1442141034690088 | 1857743112314031 |
| N4 vídeo (31,9 s) | 1537873954768087 | 1686673763068833 |
| N1 arte | bff6697d556b91871f53223a795098b5 | dca73b41ddaa5640636c67b558b1ad01 |
| N2 arte | 4a613def255155864206e7ab9d51a7b3 | 38bc0f95612b695093ef0a6616ccb5ec |
| N3 arte | 60e4eccaed20f02bc8666f91c9120f9a | b90a8ee8c4a3fe5052087cbd9dfab384 |
| N4 arte | d73912e58dabe2d619080559062ba591 | d96f093e438641e01275d182e65fa33e |

Os 8 vídeos ficaram `ready` logo na primeira consulta. As artes já existiam na conta (o upload devolveu o mesmo hash).

### Como os anúncios foram montados (desvio de ferramenta)

- **Personalização por posicionamento:** `ads_create_creative` com `placement_customizations` foi recusado: *"Placement
  Asset Customization is not enabled for this ad account in Ads MCP yet"* (o modo multi-mídia tem o mesmo bloqueio, e não
  dá para ligar pelo Ads Manager). Usei o formato padrão da API direto no anúncio (`ads_create_ad` / `ads_update_entity`):
  `asset_feed_spec` com `optimization_type=PLACEMENT` e 2 regras: (1) **9:16** em Facebook Stories + Reels e Instagram
  Stories + Reels; (2) **1:1** no resto (Facebook, Instagram, Messenger, Audience Network). Nos vídeos, a miniatura de cada
  formato é a arte N<k> do mesmo formato.
- **Aviso de IA:** `generative_asset_spec.transparency_metadata.self_disclosure` = `OPT_IN` nos 4 vídeos e `OPT_OUT` nas 4
  imagens. O nome do campo veio do criativo que o próprio `ads_create_creative` gerou com `self_ai_disclosure`. O Meta só
  mostra o selo onde há regra de transparência (UE, Índia, Taiwan, Califórnia, Nova York); com público só no Brasil, na
  prática ele não deve aparecer.
- **Advantage+ de criativo desligado:** opt-out explícito de image_touchups, text_optimizations, image_animation,
  image_templates, inline_comment, enhance_cta, image_brightness_and_contrast e site_extensions (+ video_auto_crop nos
  vídeos); `contextual_multi_ads` OPT_OUT.

### Outros desvios e pendências

1. **Anúncios antigos descartados do rascunho:** 52521304527191, 52521306411991, 52521306412191, 52521306412391 (o descarte
   só atingiu esses 4). Quando li o rascunho, eles já **não** eram cópias do N1: a sessão do navegador tinha deixado N1–N4
   imagem com textos e URLs certos. Mas não tinham o aviso de IA definido e tinham `featured_offering` / `website_summary`
   ligados. Foram substituídos mesmo assim, como a tarefa pedia.
2. **4 criativos sem uso** na biblioteca (vídeo único 1:1, criados no caminho antes de passar para o formato com regras):
   1539152961379031, 1154179100867298, 2250023258890125, 1716285496521632. Não estão em nenhum anúncio e podem ser apagados.
3. **Conferir no Ads Manager** a prévia de Stories/Reels de 1 imagem e 1 vídeo: o MCP não mostra qual regra de
   posicionamento foi aplicada depois de publicado.
4. **Análise:** ler `effective_status` de novo mais tarde (esperado PENDING_REVIEW → ACTIVE, ou DISAPPROVED). O motivo de
   reprovação só aparece no Ads Manager.

## Troca de Página

2026-11-08, só pelo MCP `meta-ads`. **Motivo:** os 8 anúncios da seção "Publicação" saíam com a Página errada (App FLUX
171858119345866 / Instagram pede_flux 17841479956486639). A sessão principal pausou a campanha antes de qualquer gasto
(R$ 0, 0 impressões). A Página Talita Frazzino foi cogitada e cancelada; nada foi criado com ela.

**Página nova:** "Cursos de Unhas", `page_id` **1392422033959176**. **Sem Instagram:** os criativos não têm
`instagram_user_id`, então o Meta usa a identidade da própria Página no Instagram. Não usei o pede_flux. A API aceitou
sem pedir Instagram nem vínculo extra da Página com a conta. Mesmo assim, a Página ainda não aparece em
`ads_get_ad_account_pages`, que hoje lista App FLUX, Talita Frazzino e Lucas Marques.

### Estado atual (leitura de volta)

| Nível | ID | status / effective_status |
|---|---|---|
| Campanha "Unhas \| Indireto \| Lead" | 52521304526791 | **ACTIVE / ACTIVE**, R$ 50/dia |
| Conjunto "BR \| Mulheres 20-50 \| Advantage+" | 52521304526991 | ACTIVE / ACTIVE |

**8 anúncios novos (Página Cursos de Unhas):**

| Anúncio | ID | Criativo | Post (Página_post) | effective_status |
|---|---|---|---|---|
| N1 — imagem — CdU | 52521309791191 | 1423493029898578 | 1392422033959176_122107607925532915 | PENDING_REVIEW (em análise) |
| N2 — imagem — CdU | 52521309827791 | 1673765444124104 | 1392422033959176_122107607961532915 | PENDING_REVIEW (em análise) |
| N3 — imagem — CdU | 52521309843991 | 1584700273426440 | 1392422033959176_122107607913532915 | PENDING_REVIEW (em análise) |
| N4 — imagem — CdU | 52521309853391 | 1074943402259503 | 1392422033959176_122107607967532915 | PENDING_REVIEW (em análise) |
| N1 — vídeo — CdU | 52521309885991 | 2295412684366219 | 1392422033959176_122107608141532915 | PENDING_REVIEW (em análise) |
| N2 — vídeo — CdU | 52521309907391 | 1881415766360536 | 1392422033959176_122107608297532915 | PENDING_REVIEW (em análise) |
| N3 — vídeo — CdU | 52521309994391 | 2079558266078030 | 1392422033959176_122107608243532915 | PENDING_REVIEW (em análise) |
| N4 — vídeo — CdU | 52521310001591 | 1868347700988460 | 1392422033959176_122107608201532915 | PENDING_REVIEW (em análise) |

Conteúdo igual ao da seção "Publicação": mesmos vídeos e artes, regras 9:16 (Stories/Reels FB+IG) e 1:1 (resto),
textos, títulos, descrição, URLs `?src=meta-n<k>`, LEARN_MORE, rastreamento no pixel 1828949965085065, Advantage+ de
criativo desligado (`ads_get_creatives` não lista nenhuma melhoria ligada), aviso de IA `OPT_IN` nos vídeos e `OPT_OUT`
nas imagens. `effective_object_story_id` dos 8 começa com 1392422033959176, ou seja, o post é da Página Cursos de Unhas.
6 dos 8 já têm `effective_instagram_media_id` (a cópia do post no Instagram); N1 vídeo e N2 vídeo ainda não.

**8 anúncios antigos (App FLUX / pede_flux):** PAUSED / PAUSED, não apagados. Imagens 52521307478391, 52521307605191,
52521307644591 e 52521307656791; vídeos 52521307661591, 52521307665391, 52521307668591 e 52521307673391.

**Erros de entrega** (`ads_get_errors` na campanha): nenhum. Rascunho da conta: vazio depois da publicação.

### Previews do N1 — vídeo — CdU (52521309885991)

- Facebook Reels: https://business.facebook.com/ads/api/preview_iframe.php?d=AQLr7BlY6cj5pph5kPVJ2xRnARVDHBtHhx37rYf6y7DWcCW8O6WU_Nphn7_MF4xa4BqhPSnv-x6rLDiPhtKQf6mcxS9fR5sFVVs9l6bCTGc_IpKYuGtpVyaOM47WVdI2Zu1cK4kdPg2uEmoyMPgByXE2iDn5xtfbW_-8FJEC-zZ1fHDVzYFd_Z1mtDNgl4Rg-RMFZfHb7BIwHRmhKgpcWnbdTFLjv74wYn2p163w6LpnHQ&t=AQKVSmoR--1YyCtolTg
- Facebook Feed: https://business.facebook.com/ads/api/preview_iframe.php?d=AQIW3PglqcFUJfVVIGD0N6ODCAzS7yIXQJpPfN70nwoEFJTAYsBu1S5ch0xvanLmGB2lexjM1mSoI89S44gbChZuVgmr9UStokcgv8vo2_D4_11_LfD5kTPodekNY335I7UbfGdgHCsCK4Q62YZrDWBXvgoRXsQzb_RQvnqAKpjULR31ttDpN8dG6OzcBEzJWZIvl06fQM4VFRS8EPCTLBAx-zQhpAMKUjkR0fmgpRWDbg&t=AQJVTJGBJqAZ1voSZnI
- Instagram Reels: https://business.facebook.com/ads/api/preview_iframe.php?d=AQKe6en87LxBQ2EQILfUOj9LOUtQOCWY1smyKyWsS3TqZnuGfiKEIo-1HVF3Fv0euZC7RwWn5hmmqm7E-lRfQpU68V4_6zclWmobTW6koFjpiDTGEmuI9naQmYstpCf0TDNAY801KQcme9mGW74TeuYp1AHgWHCDSozwqNXewlj9ed5r_JTFt5GV-Zbhw0eWh1oBo6Oc3_Ql2Q_FYwrXd0EOMoMu1JfqEqQkf2XWL6ZaLQ&t=AQKmkeMv5h-LK4arRRY

**Não confirmado visualmente:** o preview do MCP não devolve o nome exibido, e o link baixado fora do navegador volta só
como página de redirecionamento. A Página está confirmada pelo ID do post. O nome "Cursos de Unhas" na tela, sobretudo
no Instagram, onde aparece a identidade da própria Página, precisa ser visto abrindo esses links logado (os links expiram).

### Pendências
- Abrir os previews logado e conferir o nome no Reels/Feed do Facebook e no Reels do Instagram.
- Ler `effective_status` de novo (hoje os 8 estão em PENDING_REVIEW; próximo: ACTIVE ou DISAPPROVED). O motivo de reprovação só aparece no Ads Manager.
- Os 4 criativos sem uso da seção anterior (App FLUX) continuam na biblioteca e podem ser apagados.

## Regras automatizadas (08/11/2026, criadas no Ads Manager com confirmação do usuário "Sim, as 3")

| Regra | Aplica a | Ação | Condições | Intervalo |
|---|---|---|---|---|
| Unhas - pausar anúncio sem lead (ID 1695407632107630) | anúncios ativos com Nome da campanha contém "Unhas \| Indireto \| Lead" | desativar anúncio | Gasto > R$ 25 e Resultados < 1 | últimos 3 dias (incl. hoje), contínua |
| Unhas - escalar se barato | campanhas ativas com Nome da campanha contém "Unhas \| Indireto \| Lead" | +20% no orçamento diário, teto R$ 100/dia, no máx. 1x por semana | Custo por resultado < R$ 1,50, Resultados > 4, Impressões vitalícias > 8.000 (trava padrão do Meta) | últimos 3 dias (excl. hoje), diária |

**Regra "pausar CTR baixo" não existe:** o Meta recusa regras que pausam anúncio por métrica de desempenho em campanhas com orçamento na campanha (CBO). A regra de lead e o próprio CBO cobrem esse papel.
**Frequência:** a interface não tem "a cada 72 h"; ficou "1 vez por semana" (mais conservador).

## Vídeos motion

2026-11-08, só pelo MCP `meta-ads`. Pedido do usuário: trocar **só os anúncios de vídeo** pelos novos vídeos em motion
design (legenda, trilha, efeitos e narração mais emotiva). As imagens, a campanha e o conjunto não foram mexidos.

### Vídeos enviados (mesmas URLs `raw.githubusercontent.com/lucasmqar/cursosdeunhas/midia/n<k>_*.mp4`, arquivos novos)

| | 1:1 | 9:16 | Duração |
|---|---|---|---|
| N1 motion | 2206346463562553 | 2010900476245753 | 36,0 s |
| N2 motion | 1386375326908383 | 4084628831830784 | 29,4 s |
| N3 motion | 1323215999866321 | 2416190892539448 | 29,8 s |
| N4 motion | 3675956985907032 | 1031360420001825 | 29,6 s |

São arquivos novos: etag diferente da versão anterior no GitHub, 10–16 MB cada, durações diferentes das antigas. Os 8
ficaram `ready` antes de os anúncios serem criados.

### Anúncios

| Anúncio | ID | Criativo | Post (Página_post) | status / effective_status |
|---|---|---|---|---|
| N1 — motion — CdU | 52521322782991 | 1664735558602541 | 1392422033959176_122107681185532915 | ACTIVE / **ACTIVE (aprovado)** |
| N2 — motion — CdU | 52521322809191 | 29149789511304441 | 1392422033959176_122107681137532915 | ACTIVE / **ACTIVE (aprovado)** |
| N3 — motion — CdU | 52521322831391 | 1435513638154066 | 1392422033959176_122107681071532915 | ACTIVE / **ACTIVE (aprovado)** |
| N4 — motion — CdU | 52521322863791 | 1588199096323531 | 1392422033959176_122107681083532915 | ACTIVE / **ACTIVE (aprovado)** |
| N1 — vídeo — CdU (antigo) | 52521309885991 | | | **PAUSED / PAUSED** |
| N2 — vídeo — CdU (antigo) | 52521309907391 | | | **PAUSED / PAUSED** |
| N3 — vídeo — CdU (antigo) | 52521309994391 | | | **PAUSED / PAUSED** |
| N4 — vídeo — CdU (antigo) | 52521310001591 | | | **PAUSED / PAUSED** |
| N1 — imagem — CdU | 52521309791191 | | | ACTIVE / **ACTIVE (aprovado)** |
| N2 — imagem — CdU | 52521309827791 | | | ACTIVE / **ACTIVE (aprovado)** |
| N3 — imagem — CdU | 52521309843991 | | | ACTIVE / **ACTIVE (aprovado)** |
| N4 — imagem — CdU | 52521309853391 | | | ACTIVE / **ACTIVE (aprovado)** |

Os vídeos antigos foram pausados direto no publicado (`is_draft=false`); a leitura seguinte já mostrou
`effective_status=PAUSED`. Nada foi apagado.

Campanha 52521304526791: **ACTIVE / ACTIVE**, R$ 50/dia. Erros de entrega (`ads_get_errors`): nenhum. Rascunho da conta
vazio depois da publicação.

**Configuração dos 4 motion:** igual aos vídeos CdU anteriores. Página 1392422033959176 sem `instagram_user_id`, 9:16 em
Stories/Reels FB+IG e 1:1 no resto, mesmos textos, títulos, descrição, URL `?src=meta-n<k>`, LEARN_MORE, pixel
1828949965085065 e miniatura = arte N<k> do mesmo formato. Aviso de IA `OPT_IN`. Advantage+ de criativo desligado, agora
também com `video_auto_crop`, `audio` e `music_generation` em OPT_OUT e `audios: [{type: opted_out}]` no asset_feed_spec
(sem música automática). `ads_get_creatives` não lista nenhuma melhoria ligada. Os 4 posts são da Página Cursos de Unhas.
A cópia no Instagram (`effective_instagram_media_id`) ainda não tinha sido gerada na leitura.

### Previews do N1 — motion — CdU (52521322782991)

- Instagram Reels: https://business.facebook.com/ads/api/preview_iframe.php?d=AQLf602rNkdFdKH7XJbn4gle884rXp6612jcyY8W8PhLZQsKeaL90Z4-8dn5WYr5uxb3VEnLP2wF4iJfxqinHXM0Sj3htF52M6pk0QeixCWw37mwaKQRUEL7BUVOu1k5lzectbG0EARKSAPsgQWpPQYc6aK3rFLA97nxN2_qZrMA0c9UXAKImwDCXRUM08SwsSJN7AcBmx0oslJPOHwKxg55GcKQlaz0DhIUxy-3B9T-Aw&t=AQI1d3fVDLQCT40jvJU
- Facebook Feed: https://business.facebook.com/ads/api/preview_iframe.php?d=AQIwQV0RTGgxERQWY3i5QMCX8OGTk3xhlUzRo00P1wBwBLRb2AdkchU-3kj9DoGMqS22ZlvUIfawA1YSwmtMe5TUyWEmaxjQzwhp_OlhyY2SNrBPHArA7HBrQcGwKSp39SQktgD4AJoS2iS1Nuj4p3LXt_QOyMJxIRe6uX-x-gmzlvy7nKxUGRmlj6PjF4MZ_mMzVGrWxjauaOL0E-3tn1o2X38YvMLrDjQLZiaNSVqV8Q&t=AQJ5yVNpfONTr3y51uc

Os links abrem logado e expiram. O MCP não devolve imagem nem nome exibido, então a conferência visual (legenda,
trilha, nome da Página) é feita abrindo os links.

### Pendências
- Os 4 motion foram aprovados (`effective_status=ACTIVE`) cerca de 3 min depois de publicados. Falta só a conferência visual nos previews.

### Motion desfeito (08/11/2026, a pedido do usuário: "ficou estranho")
- 4 anúncios motion (52521322782991, 52521322809191, 52521322831391, 52521322863791): PAUSED, não apagados.
- 4 vídeos anteriores da Cursos de Unhas (52521309885991, 52521309907391, 52521309994391, 52521310001591): reativados (ACTIVE, voltando a veicular).
- 4 imagens da Cursos de Unhas: ACTIVE. Campanha ACTIVE a R$ 50/dia. Branch `midia` apagado de novo.
- O motor (marketing/motion.swift) e as narrações v4 ficam no repositório para uma próxima versão.

## Consolidação (08/11/2026)
- Uma só campanha de unhas: "Unhas | Indireto | Lead" 52521304526791 (ACTIVE, R$ 50/dia). A outra ativa na conta é a de mensagens do PEDE FLUX (R$ 13/dia), do usuário, não mexida.
- ATIVOS (Página Cursos de Unhas, originais sem motion): imagens 52521309791191, 52521309827791, 52521309843991, 52521309853391; vídeos 52521309885991, 52521309907391, 52521309994391, 52521310001591.
- ARQUIVADOS: 7 anúncios da Página errada (App FLUX/pede_flux) e os 4 motion.
- "N3 — vídeo" antigo (52521307668591, pede_flux): edição solta do rascunho descartada com confirmação do usuário e anúncio ARQUIVADO. Rascunho da conta vazio. Os 8 anúncios da Página errada estão arquivados.
- Renomeadas (08/11): 52521304526791 → "CURSOS DE UNHAS | Unhas | Indireto | Lead | Site /comecar" (mantém o trecho "Unhas | Indireto | Lead" usado pelas 2 regras automáticas); 52521322785991 → "PEDE FLUX | Mensagens | Messenger". Nenhuma campanha de unhas duplicada em nenhuma das 4 contas; cópias antigas de outros projetos mantidas (usuário optou por não excluir).

## v6 · reconstrução (09/11/2026, sessão "esteira Cursos de Unhas")

Pela Graph API v23.0 com o usuário do sistema "Claude" (token em `~/.config/lovit/chaves/meta.env`, nunca impresso). Cliente mínimo e roteiros em scratchpad; IDs gravados em `marketing/v6/meta_v6.json`. **Tudo criado PAUSADO**; nada ativado sem OK do Lucas.

### Diagnóstico antes da troca (campanha antiga 52521304526791, desde 08/11 15h)
- R$ 41,34 · 2.024 impressões · 80 cliques no link · 65 visitas · 8 Lead · 11 InitiateCheckout · 0 venda.
- N1 imagem levou R$ 35,29 (85%) e todos os leads; os 4 vídeos v1 quase não entregaram.
- Entrega só em Reels/Stories. Facebook Stories: CTR 11,5% e 4 leads. 65+: maior gasto (R$ 12,98), mas também CTR 8% e 3 leads.
- Limite de gasto da conta: R$ 562,17; gasto R$ 480,62 → **restam R$ 81,55** (às 10h de 09/11), divididos com o PEDE FLUX (R$ 13/dia). O Lucas decidiu não subir o limite: `spend_cap` não foi tocado.

### Estrutura nova
| Nível | ID | Configuração |
|---|---|---|
| Campanha | 52521474830791 | "CURSOS DE UNHAS \| Vendas \| v6 \| /comecar \| ABO" · OUTCOME_SALES · orçamento por conjunto (ABO), para a regra de CTR ser aceita |
| Conjunto N1 | 52521474878791 | Recomeço · mulheres 22–45 · interesses unhas/manicure/esmaltes/salões · R$ 20/dia |
| Conjunto N2 | 52521474888391 | Rotina cheia · mulheres 25–45 · (unhas) E (maternidade ou ensino a distância) · R$ 10/dia |
| Conjunto N3 | 52521474916391 | Nail art · mulheres 20–50 · unhas decoradas/artificiais/esmaltes · R$ 10/dia |
| Conjunto N4 | pendente | Remarketing (visitantes do site 30 d + quem viu os vídeos) · bloqueado: a conta não aceitou os Termos de Públicos Personalizados (erro #2663) |

Comum aos conjuntos: otimização OFFSITE_CONVERSIONS no evento **INITIATED_CHECKOUT** do pixel 1828949965085065 (= ida à Hotmart, o evento mais perto da venda com volume; trocar para PURCHASE quando o pixel receber compras da Hotmart). Idade travada (`advantage_audience: 0`). Posicionamentos manuais no celular: Stories e Reels (FB/IG) com o 9:16 e Feed/Stream com o 1:1. Atribuição 7 d clique / 1 d visualização. Interesses "Manicure & Pedicure" e "Nail Art Club" foram descontinuados pelo Meta e ficaram de fora.

### Anúncios (PAUSADOS)
| Anúncio | ID | Criativo | URL |
|---|---|---|---|
| N1 — imagem — v6 | 52521475045991 | 1074376655653568 | /comecar/?src=meta-n1i |
| N2 — imagem — v6 | 52521475059391 | 1033546806425077 | /comecar/?src=meta-n2i |
| N3 — imagem — v6 | 52521475084191 | 2666544720443662 | /comecar/?src=meta-n3i |

`src` por anúncio: `meta-n<k>i` (imagem) e `meta-n<k>v` (vídeo). A /comecar/ troca o título pelo prefixo `meta-n<k>`. A Hotmart tira o hífen: no relatório aparece `metan1i`. Identidade no Instagram: conta da própria Página (`instagram_user_id` 17841455683002194). Advantage+ de criativo todo em OPT_OUT, como antes.

### Regras automáticas (criadas DESLIGADAS; ligam com a campanha)
| Regra | ID | Condição → ação |
|---|---|---|
| Sem ida à Hotmart | 1507792387826491 | anúncio com gasto > R$ 12 e 0 resultado em 3 dias → pausa (a cada 30 min) |
| CTR baixo | 2252971232233957 | anúncio com > 2.000 impressões na vida e CTR do link < 0,6% → pausa. Aceita porque a campanha é ABO |
| Escalar | 1487451800224362 | conjunto com custo por resultado < R$ 1,50 e > 4 resultados em 3 dias → +20% no orçamento, teto R$ 100/dia, **no máx. 1x a cada 72 h** (`action_frequency` 4320 min, que a interface não oferece) |
| Frequência | 1697074748810074 | anúncio com frequência > 4 em 7 dias → pausa |

As 2 regras antigas filtram o nome "Unhas \| Indireto \| Lead" e não pegam a campanha nova.

### Publicação e ativação (09/11/2026, OK do Lucas: "publicar e ativar todos… vai pra 180")
- **Vídeos v6 enviados** (`/advideos`, upload direto do Mac, sem URL pública): N1 9:16 1540420794594456 · 1:1 1070511086009565; N2 9:16 1164154535946839 · 1:1 1878285279892068; N4 9:16 2058452092098310 · 1:1 1449161936546329. Áudio normalizado a −14 LUFS antes do envio.
- **Conjunto N4 novo** 52521496964191 · "Com calma (compara curso)" · mulheres 25–54 · (unhas) E (ensino a distância). Substitui o remarketing, que depende dos Termos de Públicos Personalizados (não aceitos).
- **Anúncios de vídeo** (9:16 em Stories/Reels, 1:1 nos feeds, aviso de IA OPT_IN porque a voz é sintética): N1 52521497062791 (`meta-n1v`), N2 52521497097191 (`meta-n2v`), N4 52521497146191 (`meta-n4v`); imagem N4 52521497157591 (`meta-n4i`).
- **Ativado:** campanha 52521474830791, conjuntos N1/N2/N4 a **R$ 45/dia cada** (R$ 180/dia com o N5, equilibrado para comparar conceitos), 6 anúncios e as 4 regras v6. Leitura de volta: tudo ACTIVE, nenhum anúncio reprovado.
- **Campanha antiga 52521304526791 ARQUIVADA**; regras antigas 2303943963721994 e 1695407632107630 DESLIGADAS.
- **N3 removido** (Lucas: "n3 péssimo, remova totalmente daqui e da conta"): apagados o conjunto 52521474916391, os anúncios 52521497122391 e 52521475084191 (v6) e 52521309994391 e 52521309843991 (campanha antiga). Os 2 vídeos N3 v6 (2379825092836330, 1808001350496448) não saem pela API (exige permissão de Página) e a biblioteca de mídia pediu 2FA no Chrome: ficam na biblioteca, sem uso. No projeto, todos os arquivos N3 (código v5/v6, narrações, MP4 v1/v4/v5/v6, folhas, assets n3_*, blueprint) foram para a Lixeira do Mac em `cursosdeunhas-N3-removido-2026-11-09` (recuperáveis).
- **Limite de gasto:** às 12h55 restavam R$ 79,26 de R$ 562,17. A R$ 180/dia + R$ 13 do PEDE FLUX, a conta para em ~10 h. O `spend_cap` não foi tocado (decisão do Lucas).
- **N5 "O reset pequeno"** (criativo novo pedido pelo Lucas sobre o boato de "reset/apagão"; vídeo de 12 s sem narração, sem citar apagão nem data; aprovado por júri de política Meta e verificação): vídeos 9:16 1126126103600529 · 1:1 2298926587563366; miniaturas do próprio gancho (212738712cdf9d62c24e0cb5828d6e7b, b8f87eab3279f5c7584ea2360afa47c0); **conjunto 52521511022991** (mulheres 22–54, interesses unhas/beleza, R$ 45/dia, ACTIVE); **anúncio 52521511050991** (`meta-n5v`, texto: «Todo mundo falando em "reset". O reset que a gente indica é pequeno: aprender unhas do zero, no seu ritmo. Responda uma pergunta e veja por onde começar. Leva 2 minutos.»; título «Descubra por onde começar»). A /comecar/ mostra «Um reset pequeno: aprender unhas do zero.» para `meta-n5*`.
- **Total no ar:** 4 conjuntos × R$ 45 = **R$ 180/dia**; 7 anúncios (N1 imagem+vídeo, N2 imagem+vídeo, N4 imagem+vídeo, N5 vídeo). Conferido por API e no Gerenciador às ~13h.
- **N3, limpeza final:** além dos anúncios, saíram da biblioteca os 6 vídeos N3 (v1, motion, v6; pelo Chrome), os 3 anúncios N3 arquivados, os 16 criativos N3 e as 2 imagens N3. Não sobra nada do N3 na conta.
- **Atenção:** um gancho com "reset" na semana do boato atrai comentários com o boato; moderar/ocultar comentários de desinformação no anúncio N5. Há um rascunho pendente no Gerenciador ("Conferir e publicar (1)") que não é desta sessão e não foi tocado.
