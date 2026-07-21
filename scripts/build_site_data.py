#!/usr/bin/env python3
"""
Convert categorize_places.py output into the structured data file
consumed by the web app (web/src/data/places.json).

Adds placeholder fields (neighborhood, instagram, vibe, lat/lng) that
get filled in by enrichment research or a future GeoJSON re-import.
"""
import json
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = REPO_ROOT / "output"
DEST = REPO_ROOT / "web" / "src" / "data" / "places.json"

CATEGORY_META = {
    "seafood":       {"label": "Seafood",       "token": "denim"},
    "bakery":        {"label": "Bakery",        "token": "gold"},
    "brunch":        {"label": "Brunch",        "token": "tan"},
    "dessert":       {"label": "Dessert",       "token": "blush"},
    "healthy":       {"label": "Healthy",       "token": "sage"},
    "cafe":          {"label": "Café",          "token": "rust"},
    "salons":        {"label": "Salons",        "token": "magenta"},
    "wine":          {"label": "Wine",          "token": "wine"},
    "bars":          {"label": "Bars",          "token": "plum"},
    "nightlife":     {"label": "Nightlife",     "token": "navy"},
    "mexican":       {"label": "Mexican",       "token": "crimson"},
    "italian":       {"label": "Italian",       "token": "cherry"},
    "japanese":      {"label": "Japanese",      "token": "orchid"},
    "mediterranean": {"label": "Mediterranean", "token": "amber"},
    "french":        {"label": "French",        "token": "mustard"},
    "american":      {"label": "American",      "token": "terracotta"},
    "contemporary":  {"label": "Contemporary",  "token": "fuchsia"},
    "dinner":        {"label": "Dinner",        "token": "taupe"},
    "stores":        {"label": "Stores",        "token": "olive"},
    "attractions":   {"label": "Attractions",   "token": "teal"},
    "hotel":         {"label": "Hotels",        "token": "slate"},
}

# Rough heuristic price tier per category — not researched per-place, just a
# reasonable default so cards/popups have *something* until real data exists.
CATEGORY_PRICE_TIER = {
    "seafood":       "$$$",
    "bakery":        "$",
    "brunch":        "$$",
    "dessert":       "$",
    "healthy":       "$$",
    "cafe":          "$",
    "salons":        "$$",
    "wine":          "$$$",
    "bars":          "$$",
    "nightlife":     "$$",
    "mexican":       "$$$",
    "italian":       "$$$",
    "japanese":      "$$$$",
    "mediterranean": "$$$",
    "french":        "$$$$",
    "american":      "$$$",
    "contemporary":  "$$$$",
    "dinner":        "$$",
    "stores":        "$$",
    "attractions":   None,
    "hotel":         "$$$",
}


def slugify(name: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return s


def main():
    places = []
    for cat_id, meta in CATEGORY_META.items():
        f = OUTPUT_DIR / f"{cat_id}.json"
        if not f.exists():
            continue
        items = json.loads(f.read_text(encoding="utf-8"))
        for item in items:
            places.append({
                "id": f"{cat_id}-{slugify(item['name'])}",
                "name": item["name"],
                "category": cat_id,
                "mapsUrl": item.get("maps_url") or "",
                "neighborhood": None,
                "instagram": None,
                "vibe": None,
                "lat": None,
                "lng": None,
                "priceTier": CATEGORY_PRICE_TIER.get(cat_id),
                "occasionTags": [],
                "sourceFile": item.get("source_file", ""),
            })

    DEST.parent.mkdir(parents=True, exist_ok=True)
    DEST.write_text(
        json.dumps({"categories": CATEGORY_META, "places": places}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Wrote {len(places)} places to {DEST}")


if __name__ == "__main__":
    main()
