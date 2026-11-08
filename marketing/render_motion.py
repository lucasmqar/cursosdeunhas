#!/usr/bin/env python3
"""Renderiza os 8 vídeos motion (N1–N4 × 9:16 e 1:1). Uso: python3 marketing/render_motion.py <binario_motion>"""
import json, pathlib, re, subprocess, sys
M = pathlib.Path(__file__).resolve().parent
F = json.load(open(M / "copy_final.json"))
KEYS = {1: ["cansaco", "caminho", "assinatura", "coragem", "aprender"], 2: ["noite", "dela", "aprender", "agradecer"],
        3: ["sorrir", "sorriso", "bonita", "cuidar"], 4: ["comparou", "certificado", "garantia", "calma"]}
ads = {a["k"]: a for a in F["ads"]}
(M / "videos_motion").mkdir(exist_ok=True)
for n in F["narrations"]:
    k = n["k"]; narr = M / "audio" / "v4" / f"n{k}.mp3"
    if not narr.exists(): print("falta", narr); continue
    for name, w, h in (("9x16", 1080, 1920), ("1x1", 1080, 1080)):
        cfg = {"k": k, "w": w, "h": h, "narration": str(narr), "music": str(M / "audio/sfx/musica.mp3"), "sfx": str(M / "audio/sfx"),
               "text": re.sub(r"\[[^\]]*\]\s*", "", n["text"]), "out": str(M / "videos_motion" / f"n{k}_{name}.mp4"),
               "keywords": KEYS[k], "endTitle": ads[k]["headline"]}
        p = M / "videos_motion" / f"n{k}_{name}.json"; p.write_text(json.dumps(cfg, ensure_ascii=False))
        print(subprocess.run([sys.argv[1], str(p)], capture_output=True, text=True).stdout.strip())
