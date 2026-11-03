#!/usr/bin/env python3
"""La Güera's Guide photo grade: one look for every photo in the app and on Instagram.

The look: warm, slightly contrasty, deeper shadows, a touch more color, fine film
grain and a very light vignette (flash-on-film, like Ashley's film shots).

Usage:
    python3 brand/photo-grade/grade.py OUT_DIR NAME=SOURCE[:FOCUS] ...
  e.g. python3 brand/photo-grade/grade.py web/public/photos bars-el-silverio=/path/a.jpg:0.55

FOCUS (0 to 1, default 0.5) is how far down the photo the 4:5 crop is centered.
Writes OUT_DIR/NAME.jpg at 1080x1350 (4:5), the size used by both the app cards and
Instagram posts. Needs: pip install pillow numpy. Only grades photos that Ashley
supplied or approved; record the source and a credit line in places.json.
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image

W, H = 1080, 1350
SEED = 7


def grade(img: Image.Image) -> Image.Image:
    a = np.asarray(img.convert("RGB"), dtype=np.float32) / 255.0
    # warm white balance
    a *= np.array([1.05, 1.0, 0.92], dtype=np.float32)
    # black point and gentle white point
    a = np.clip((a - 0.02) / 0.97, 0, 1)
    # S-curve contrast (blend of identity and smoothstep)
    s = a * a * (3 - 2 * a)
    a = a * 0.62 + s * 0.38
    # saturation +10%
    lum = (a * np.array([0.299, 0.587, 0.114], dtype=np.float32)).sum(axis=2, keepdims=True)
    a = np.clip(lum + (a - lum) * 1.10, 0, 1)
    # fine film grain, strongest in the midtones
    rng = np.random.default_rng(SEED)
    grain = rng.normal(0, 1, a.shape[:2]).astype(np.float32)[..., None]
    mid = 1 - np.abs(lum - 0.5) * 1.6
    a = np.clip(a + grain * 0.022 * np.clip(mid, 0.25, 1), 0, 1)
    # light vignette
    h, w = a.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2) / 1.41
    a *= (1 - 0.14 * np.clip(d, 0, 1) ** 2.2)[..., None]
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))


def crop_4x5(img: Image.Image, focus: float) -> Image.Image:
    w, h = img.size
    target_h = int(w * 5 / 4)
    if target_h <= h:
        top = int((h - target_h) * focus)
        img = img.crop((0, top, w, top + target_h))
    else:  # wider than 4:5: crop the sides
        target_w = int(h * 4 / 5)
        left = (w - target_w) // 2
        img = img.crop((left, 0, left + target_w, h))
    return img.resize((W, H), Image.LANCZOS)


def main(argv):
    out = Path(argv[0]); out.mkdir(parents=True, exist_ok=True)
    for spec in argv[1:]:
        name, rest = spec.split("=", 1)
        src, _, focus = rest.rpartition(":") if rest.rpartition(":")[2].replace(".", "").isdigit() else (rest, "", "0.5")
        img = crop_4x5(Image.open(src), float(focus or 0.5))
        graded = grade(img)
        graded.save(out / f"{name}.jpg", quality=88, optimize=True, progressive=True)
        print(out / f"{name}.jpg")


if __name__ == "__main__":
    main(sys.argv[1:])
