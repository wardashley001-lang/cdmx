#!/usr/bin/env python3
"""
Attach photos in web/public/photos/ to places in web/src/data/places.json.

A photo matches a place if its filename (without extension) equals the
place's id (e.g. "seafood-contramar") or the slugified place name
(e.g. "contramar"). Run after dropping new photos in:

    python scripts/attach_photos.py
"""
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLACES = ROOT / "web" / "src" / "data" / "places.json"
PHOTOS = ROOT / "web" / "public" / "photos"
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".avif"}


def slug(s: str) -> str:
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def main():
    data = json.loads(PLACES.read_text(encoding="utf-8"))
    files = {p.stem.lower(): p.name for p in PHOTOS.iterdir() if p.suffix.lower() in EXTS}
    hits = 0
    for place in data["places"]:
        match = files.get(place["id"].lower()) or files.get(slug(place["name"]))
        place["image"] = f"photos/{match}" if match else None
        hits += bool(match)
    PLACES.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    unmatched = sorted(set(files.values()) - {Path(p["image"]).name for p in data["places"] if p["image"]})
    print(f"{hits}/{len(data['places'])} places have photos")
    if unmatched:
        print("Photos that matched no place:", ", ".join(unmatched))


if __name__ == "__main__":
    main()
