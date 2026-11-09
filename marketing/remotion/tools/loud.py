"""Normaliza o áudio dos MP4 v6 para −14 LUFS / −1 dBTP (loudnorm em 2 passes, ffmpeg do Remotion). Vídeo copiado sem recompressão.
uso: python3 tools/loud.py ../videos_v6/n1_9x16.mp4 [...]"""
import json, os, re, subprocess, sys
FF = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ff.sh")
T = "I=-14:TP=-1:LRA=11"
for f in sys.argv[1:]:
    f = os.path.abspath(f)
    p = subprocess.run([FF, "ffmpeg", "-hide_banner", "-nostats", "-i", f, "-vn", "-af", f"loudnorm={T}:print_format=json", "-f", "null", "-"], capture_output=True, text=True)
    m = json.loads(re.findall(r"\{[^{}]*\}", p.stderr)[-1])
    tmp = f[:-4] + ".loud.mp4"
    af = (f"loudnorm={T}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
          f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    r = subprocess.run([FF, "ffmpeg", "-hide_banner", "-y", "-i", f, "-c:v", "copy", "-af", af, "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", tmp], capture_output=True, text=True)
    if r.returncode: print("ERRO", f, r.stderr[-400:]); continue
    os.replace(tmp, f)
    print(f"{os.path.basename(f)}: {m['input_i']} LUFS → −14 (pico {m['input_tp']} dBTP)")
