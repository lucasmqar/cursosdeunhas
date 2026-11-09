"""CSV de ativação (upload em massa): liga F1-F3 e ajusta a Campaign #1 (orçamento, src, negativas cruzadas, pausa grupo Manicure)."""
import csv, json, pathlib
D = pathlib.Path(__file__).parent
cfg = json.loads((D / "campanhas.json").read_text()); ab = cfg["aberta"]
H = ["Action","Campaign ID","Ad group ID","Campaign","Campaign status","Budget","Final URL suffix","Ad group","Ad group status","Negative keyword","Keyword or list","Match type"]
rows = []
def r(**k): rows.append({h: k.get(h, "") for h in H})
for c in cfg["campanhas"]: r(**{"Action": "Edit", "Campaign ID": c["campaign_id"], "Campaign": c["nome"], "Campaign status": "Enabled"})
r(**{"Action": "Edit", "Campaign ID": ab["campaign_id"], "Campaign": ab["nome"], "Budget": f'{ab["orcamento"]:.2f}'.replace(".", ","), "Final URL suffix": "src=" + ab["src"]})
for w in ab["negativas_cruzadas_frase"]: r(**{"Action": "Add", "Campaign ID": ab["campaign_id"], "Campaign": ab["nome"], "Negative keyword": w, "Keyword or list": "Keyword", "Match type": "Phrase Match"})
r(**{"Action": "Edit", "Campaign ID": ab["campaign_id"], "Campaign": ab["nome"], "Ad group ID": ab["grupo_id"], "Ad group": ab["pausar_grupo"], "Ad group status": "Paused"})
out = D / "ativacao_upload.csv"
with out.open("w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=H); w.writeheader(); w.writerows(rows)
print(out, len(rows))
