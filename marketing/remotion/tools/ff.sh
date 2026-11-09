#!/bin/zsh
# ffmpeg/ffprobe que vêm no Remotion (só funcionam rodando de dentro da pasta deles). Use caminhos ABSOLUTOS.
#   tools/ff.sh ffmpeg -y -i /abs/entrada.mp3 -af "lowpass=f=900,atempo=0.9" /abs/saida.mp3
#   tools/ff.sh ffprobe -v error -show_entries format=duration -of csv=p=0 /abs/arquivo.mp3
DIR="$(cd "$(dirname "$0")/.." && pwd)/node_modules/@remotion/compositor-darwin-arm64"
bin="$1"; shift
cd "$DIR" && exec "./$bin" "$@"
