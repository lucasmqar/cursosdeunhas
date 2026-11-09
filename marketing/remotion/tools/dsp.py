"""Processamento de áudio sem crédito: o ffmpeg do Remotion só tem asetrate/atempo/atrim/volume/loudnorm/amix/adelay/apad/pan,
então filtro de frequência e reverb são feitos aqui com numpy (FFT).

Uso (caminhos absolutos ou relativos à pasta remotion/):
  python3 tools/dsp.py ENTRADA SAIDA [operações...]
Operações, aplicadas na ordem:
  trim=INI:DUR          recorta (s)
  pitch=SEMITONS        muda o tom (e a velocidade junto, como fita) via asetrate do ffmpeg
  tempo=FATOR           muda a velocidade sem mudar o tom (atempo, 0.5–2)
  lowpass=HZ            passa-baixa suave (zero fase)
  highpass=HZ           passa-alta suave
  reverb=SEG:MIX        cauda exponencial de SEG segundos, MIX 0–1 de sinal molhado
  gain=DB               ganho
  norm=DB               normaliza o pico para DB (ex.: -1)
  mono                  soma para mono
Ex.: python3 tools/dsp.py ../../../flux/.../base.mp3 public/audio/v6/n2_noite.mp3 pitch=-2 lowpass=900 reverb=2.4:0.35 norm=-3
"""
import os, subprocess, sys, tempfile, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
FF = os.path.join(HERE, '..', 'node_modules', '@remotion', 'compositor-darwin-arm64')
SR = 44100


def ff(*args):
    r = subprocess.run(['./ffmpeg', '-v', 'error', '-y', *args], cwd=FF, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f'ffmpeg falhou: {r.stderr.strip()}')


def load(path, extra_af=None):
    t = tempfile.mktemp(suffix='.wav')
    af = ['-af', extra_af] if extra_af else []
    ff('-i', os.path.abspath(path), *af, '-ac', '2', '-ar', str(SR), '-acodec', 'pcm_s16le', t)
    w = wave.open(t)
    x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
    w.close(); os.remove(t)
    return x.reshape(-1, 2)


def save(x, path):
    t = tempfile.mktemp(suffix='.wav')
    y = np.clip(x, -1, 1)
    w = wave.open(t, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((y * 32767).astype(np.int16).tobytes()); w.close()
    out = os.path.abspath(path)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    codec = ['-acodec', 'libmp3lame', '-b:a', '192k'] if out.endswith('.mp3') else []
    ff('-i', t, *codec, out)
    os.remove(t)


def spectral(x, fn):
    n = len(x)
    N = 1 << (n - 1).bit_length()
    X = np.fft.rfft(x, n=N, axis=0)
    f = np.fft.rfftfreq(N, 1 / SR)
    return np.fft.irfft(X * fn(f)[:, None], n=N, axis=0)[:n]


def lowpass(x, hz):  # 2ª ordem aproximada (−12 dB/oitava), sem fase
    return spectral(x, lambda f: 1 / np.sqrt(1 + (f / hz) ** 4))


def highpass(x, hz):
    return spectral(x, lambda f: 1 / np.sqrt(1 + (hz / np.maximum(f, 1e-6)) ** 4))


def reverb(x, secs, mix):
    rng = np.random.default_rng(7)
    L = int(secs * SR)
    tt = np.arange(L) / SR
    ir = rng.standard_normal((L, 2)) * np.exp(-6.9 * tt / secs)[:, None]  # −60 dB em `secs`
    ir = lowpass(ir, 5000)
    ir /= np.sqrt(np.sum(ir ** 2, axis=0, keepdims=True)) + 1e-12
    n = len(x) + L
    N = 1 << (n - 1).bit_length()
    wet = np.fft.irfft(np.fft.rfft(x, n=N, axis=0) * np.fft.rfft(ir, n=N, axis=0), n=N, axis=0)[:n]
    dry = np.vstack([x, np.zeros((L, 2))])
    return (1 - mix) * dry + mix * wet * (np.max(np.abs(dry)) / (np.max(np.abs(wet)) + 1e-12))


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    src, dst, ops = sys.argv[1], sys.argv[2], sys.argv[3:]
    af = []
    for op in ops:  # o que é do ffmpeg vai na decodificação
        k, _, v = op.partition('=')
        if k == 'trim':
            a, b = v.split(':'); af.append(f'atrim={a}:{float(a) + float(b)},asetpts=PTS-STARTPTS')
        elif k == 'pitch':
            r = 2 ** (float(v) / 12); af.append(f'asetrate={int(SR * r)},aresample={SR}')
        elif k == 'tempo':
            af.append(f'atempo={v}')
    x = load(src, ','.join(af) if af else None)
    for op in ops:
        k, _, v = op.partition('=')
        if k == 'lowpass': x = lowpass(x, float(v))
        elif k == 'highpass': x = highpass(x, float(v))
        elif k == 'reverb': s, m = v.split(':'); x = reverb(x, float(s), float(m))
        elif k == 'gain': x = x * 10 ** (float(v) / 20)
        elif k == 'norm': x = x / (np.max(np.abs(x)) + 1e-12) * 10 ** (float(v) / 20)
        elif k == 'mono': x = np.repeat(x.mean(axis=1, keepdims=True), 2, axis=1)
    save(x, dst)
    print(f'ok {dst} {len(x) / SR:.2f}s pico {20 * np.log10(np.max(np.abs(x)) + 1e-12):.1f} dB')


if __name__ == '__main__':
    main()
