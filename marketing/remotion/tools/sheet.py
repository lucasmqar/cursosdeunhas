# /// script
# dependencies = ["pillow"]
# ///
"""Folha de contato: uv run tools/sheet.py saida.png img1.png img2.png ... (colunas = 5)"""
import sys
from PIL import Image, ImageDraw
out, files = sys.argv[1], sys.argv[2:]
ims = [Image.open(f).convert("RGB") for f in files]
w = 300; h = int(ims[0].height * w / ims[0].width); cols = min(5, len(ims)); rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (w + 8) + 8, rows * (h + 30) + 8), "white"); d = ImageDraw.Draw(sheet)
for i, (im, f) in enumerate(zip(ims, files)):
    x, y = 8 + (i % cols) * (w + 8), 8 + (i // cols) * (h + 30)
    sheet.paste(im.resize((w, h)), (x, y + 22)); d.text((x, y + 4), f.split("_", 1)[-1].replace(".png", ""), fill="black")
sheet.save(out)
