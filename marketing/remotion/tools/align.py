# /// script
# requires-python = ">=3.10"
# dependencies = ["faster-whisper==1.1.1", "requests", "av>=11,<14"]
# ///
"""Tempo real de cada palavra da narração (Whisper), alinhado ao texto do roteiro.

Uso: uv run tools/align.py <copy_final.json> <pasta_audio> <pasta_saida>
Gera <pasta_saida>/n<k>.json = {"duration": s, "words": [{"w": "palavra", "s": ini, "e": fim}, ...]}
O texto exibido é sempre o do roteiro; o Whisper só fornece os tempos.
"""
import difflib, json, re, sys, unicodedata
from pathlib import Path
from faster_whisper import WhisperModel

copy_path, audio_dir, out_dir = map(Path, sys.argv[1:4])
out_dir.mkdir(parents=True, exist_ok=True)


def norm(s: str) -> str:
    s = unicodedata.normalize("NFD", s.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in s if unicodedata.category(c) != "Mn"))


model = WhisperModel("small", device="cpu", compute_type="int8")
for n in json.load(open(copy_path))["narrations"]:
    k = n["k"]
    audio = audio_dir / f"n{k}.mp3"
    script = re.sub(r"\[[^\]]*\]\s*", "", n["text"]).replace("…", "… ").split()
    segs, info = model.transcribe(str(audio), language="pt", word_timestamps=True, initial_prompt=n["text"])
    heard = [w for s in segs for w in s.words]
    a, b = [norm(w) for w in script], [norm(w.word) for w in heard]
    times: list = [None] * len(script)
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if tag == "equal" or (tag == "replace" and i2 - i1 == j2 - j1):
            for d in range(i2 - i1):
                times[i1 + d] = (heard[j1 + d].start, heard[j1 + d].end)
        elif tag == "replace":  # blocos de tamanhos diferentes: divide o intervalo ouvido
            s0, e0 = heard[j1].start, heard[j2 - 1].end
            L = sum(len(x) + 1 for x in script[i1:i2]); acc = 0
            for d in range(i2 - i1):
                ln = len(script[i1 + d]) + 1
                times[i1 + d] = (s0 + (e0 - s0) * acc / L, s0 + (e0 - s0) * (acc + ln) / L); acc += ln
    # palavras que o Whisper não ouviu: interpola entre vizinhas
    for i, t in enumerate(times):
        if t is None:
            prev = next((times[j][1] for j in range(i - 1, -1, -1) if times[j]), 0.0)
            nxt = next((times[j][0] for j in range(i + 1, len(times)) if times[j]), prev + 0.3)
            times[i] = (prev, max(prev + 0.05, min(nxt, prev + 0.4)))
    missed = sum(1 for t in times if t is None)
    matched = sum(sz for *_, sz in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks())
    out = {"duration": info.duration, "words": [{"w": w, "s": round(t[0], 3), "e": round(t[1], 3)} for w, t in zip(script, times)]}
    (out_dir / f"n{k}.json").write_text(json.dumps(out, ensure_ascii=False, indent=0))
    print(f"n{k}: {len(script)} palavras do roteiro, {len(heard)} ouvidas, {matched} casadas exatamente, dur {info.duration:.2f}s")
