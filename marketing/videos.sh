#!/bin/zsh
# Monta os vídeos dos anúncios: arte (9:16 e 1:1) + narração.  Uso: zsh marketing/videos.sh
cd "${0:A:h}" && mkdir -p videos
BIN="${VIDEO_BIN:-swift video.swift}"
for k in 1 2 3 4; do
  [ -f audio/n$k.mp3 ] || { echo "falta audio/n$k.mp3"; continue; }
  for f in 9x16 1x1; do ${=BIN} ativos/n${k}_$f.png audio/n$k.mp3 videos/n${k}_$f.mp4; done
done
