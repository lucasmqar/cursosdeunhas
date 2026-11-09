# Google Ads · fundo de funil (09/11/2026)

Criado por **upload em massa** (Ferramentas > Ações em massa > Uploads), sem API nem script: a autorização OAuth do Scripts não concluía.

- `campanhas.json`: fonte única (palavras, negativas, títulos, descrições, orçamento, CPC, src, URL).
- `gerar_csv.py` → `fundo_funil_upload.csv`: colunas dos modelos oficiais do Google (Action, Match type = "Exact Match"/"Phrase Match"/"Broad Match", negativas de campanha com "Negative keyword" + "Keyword or list" = Keyword). Valores em pt-BR: `10,00`.
- `gerar_script.py` / `fundo_funil.ads.js`: versão Scripts (não usada; fica para quando houver autorização).

| Campanha | ID | Orçamento | Limite CPC | src | Destino |
|---|---|---|---|---|---|
| F1 Manicure e Pedicure | 24455534869 | R$ 10 | R$ 1,10 | gads-f1 | /curso-de-manicure-e-pedicure-profissional/ |
| F2 Alongamento e Gel | 24449805539 | R$ 12 | R$ 1,40 | gads-f2 | /escola-designer-de-unhas/ |
| F3 Formação Completa | 24449805551 | R$ 16 | R$ 1,60 | gads-f3 | /nail-academy/ |

Pesquisa Google só (sem parceiros e sem Display), Brasil, Maximizar cliques com limite de CPC (definido na interface, a coluna não entra pelo upload), homens excluídos nos 3 grupos. Status: **ativas desde 09/11/2026 20:09** (OK do Lucas), por `gerar_ativacao.py` → `ativacao_upload.csv`. Edições de campanhas existentes exigem a coluna `Campaign ID`.

Na ativação: Campaign #1 (ID 24445403891) caiu de R$ 50 para R$ 12 (total segue R$ 50/dia), recebeu `src=gads-a0` e negativas cruzadas (frase: manicure, pedicure, unha em gel, alongamento, fibra, polygel, nail designer, completo, iniciante…), e o grupo "Manicure" dela foi pausado (a F1 assume).
