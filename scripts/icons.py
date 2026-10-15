"""Genera le icone ottimizzate in public/ da assets/AnonymAI.png.

Uso: python scripts/icons.py   (richiede Pillow: pip install pillow)
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'assets' / 'AnonymAI.png'
OUT = ROOT / 'public'
CORNER_RADIUS = 0.2  # frazione del lato
SUPERSAMPLE = 4      # maschera disegnata più grande e ridotta: bordi arrotondati senza scalini

# (file, lato in px, angoli trasparenti)
TARGETS = [
    ('favicon.png', 64, True),
    ('logo.png', 96, True),
    ('apple-touch-icon.png', 180, False),  # iOS vuole un'icona piena: arrotonda da sé
]

image = Image.open(SOURCE).convert('RGB')

# ritaglia il riquadro scuro, escludendo sfondo bianco e ombra chiara
box = image.convert('L').point(lambda v: 255 if v < 200 else 0).getbbox()
square = image.crop(box)
side = max(square.size)
square = ImageOps.pad(square, (side, side), color=(255, 255, 255))

big = side * SUPERSAMPLE
mask = Image.new('L', (big, big), 0)
ImageDraw.Draw(mask).rounded_rectangle((0, 0, big - 1, big - 1), radius=int(big * CORNER_RADIUS), fill=255)
rounded = square.convert('RGBA')
rounded.putalpha(mask.resize((side, side), Image.LANCZOS))

for name, size, transparent in TARGETS:
    (rounded if transparent else square).resize((size, size), Image.LANCZOS).save(OUT / name, optimize=True)
    print(f'{name}: {size}px')
