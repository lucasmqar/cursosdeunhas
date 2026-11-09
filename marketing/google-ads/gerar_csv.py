"""Gera o CSV de upload em massa (Ferramentas > Ações em massa > Uploads) das 3 campanhas fundo de funil, PAUSADAS.
Colunas seguem os modelos oficiais do Google (support.google.com/google-ads/answer/10702525)."""
import csv, json, pathlib
D = pathlib.Path(__file__).parent
cfg = json.loads((D / "campanhas.json").read_text())
H = ["Action","Campaign","Campaign status","Campaign type","Networks","Budget","Budget type","Bid strategy type",
     "Maximum CPC bid limit","Language","Location","Final URL suffix","EU political ads",
     "Ad group","Ad group status","Keyword","Keyword status","Negative keyword","Keyword or list","Match type",
     "Ad status","Ad type"] + [f"Headline {i}" for i in range(1,16)] + ["Description"] + [f"Description {i}" for i in range(2,5)] + \
    ["Path 1","Path 2","Final URL"]
br = lambda v: f"{v:.2f}".replace(".", ",")
rows = []
def r(**k): rows.append({h: k.get(h, "") for h in H})
base = cfg["base_negativas"]
for c in cfg["campanhas"]:
    n, ag = c["nome"], f'{c["id"]} · {c["path1"]}'
    r(**{"Action": "Add", "Campaign": n, "Campaign status": "Paused", "Campaign type": "Search", "Networks": "Google Search",
         "Budget": br(c["orcamento"]), "Budget type": "Daily", "Bid strategy type": "Maximize clicks",
         "Maximum CPC bid limit": br(c["cpc_max"]), "Language": "pt", "Location": "Brazil",
         "Final URL suffix": "src=" + c["src"], "EU political ads": "No"})
    negs = [(w, "Broad Match") for w in base["ampla"]] + [(w, "Phrase Match") for w in base["frase"] + c["negativas_frase"]]
    for w, m in negs: r(**{"Action": "Add", "Campaign": n, "Negative keyword": w, "Keyword or list": "Keyword", "Match type": m})
    r(**{"Action": "Add", "Campaign": n, "Ad group": ag, "Ad group status": "Enabled"})
    for w in c["exata"]: r(**{"Action": "Add", "Campaign": n, "Ad group": ag, "Keyword": w, "Keyword status": "Enabled", "Match type": "Exact Match"})
    for w in c["frase"]: r(**{"Action": "Add", "Campaign": n, "Ad group": ag, "Keyword": w, "Keyword status": "Enabled", "Match type": "Phrase Match"})
    ad = {"Action": "Add", "Campaign": n, "Ad group": ag, "Ad status": "Enabled", "Ad type": "Responsive search ad",
          "Final URL": c["url"], "Path 1": c["path1"], "Path 2": c["path2"]}
    for i, t in enumerate(c["titulos"], 1): ad[f"Headline {i}"] = t
    for i, t in enumerate(c["descricoes"], 1): ad["Description" if i == 1 else f"Description {i}"] = t
    r(**ad)
out = D / "fundo_funil_upload.csv"
with out.open("w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=H); w.writeheader(); w.writerows(rows)
print(out, len(rows), "linhas")
