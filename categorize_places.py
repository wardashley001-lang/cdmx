#!/usr/bin/env python3
"""
Categorize Google Maps saved places from Google Takeout exports.

Supports both CSV and GeoJSON formats exported from Google Takeout.

HOW TO GET YOUR DATA:
  1. Go to https://takeout.google.com
  2. Click "Deselect all", then check only "Maps (your places)"
  3. Click "Next step", choose export format, and create export
  4. Download the ZIP, extract it
  5. Your saved list files are in: Takeout/Maps (your places)/
     Each list is a separate CSV or JSON file

USAGE:
  # Single list:
  python categorize_places.py data/CDMX.csv

  # Multiple lists merged and deduplicated:
  python categorize_places.py data/CDMX.csv data/Hotlist.csv data/Dinner.csv

  # Custom output folder:
  python categorize_places.py data/CDMX.csv --output-dir my_sorted_lists

  # With Google Places API for better accuracy on ambiguous names:
  python categorize_places.py data/CDMX.csv --api-key YOUR_API_KEY
"""

import argparse
import csv
import json
import os
import sys
import unicodedata
from pathlib import Path

# ---------------------------------------------------------------------------
# Category definitions — ordered by priority (earlier wins on a tie).
# Seafood before dinner: "mariscos" overlaps.
# Salons before bars: "nail bar" should go to salons, not bars.
# ---------------------------------------------------------------------------
CATEGORIES = [
    (
        "seafood",
        [
            "mariscos", "marisqueria", "marisquería", "seafood", "pescado",
            "ceviche", "ostión", "ostion", "ostería", "osteria", "ostrería",
            "ostreria", "camarón", "camaron", "shrimp", "oyster", "pulpo",
            "jaiba", "langosta", "atún", "atun", "salmón", "salmon",
            "abrasamar", "contramar", "tibur",
        ],
    ),
    (
        "bakery",
        [
            "panadería", "panaderia", "bakery", "pastelería", "pasteleria",
            "boulangerie", "croissant", "bread", "horno", "brioche",
            "baguette", "muffin", "donut", "dona", "rosquilla", "churrería",
            "churreria", "churro", "bagel", "delicatessen",
        ],
    ),
    (
        "dessert",
        [
            "helado", "ice cream", "nieve", "paleta", "postre", "dulce",
            "chocolate", "waffle", "crepe", "gelato", "candy", "sweet",
            "cake", "cupcake", "brownie", "macaron", "tarta", "flan",
            "mousse", "amorino",
        ],
    ),
    (
        "cafe",
        [
            "café", "cafe", "caffè", "caffe", "coffee", "momo coffee",
            "cafebrería", "cafeteria", "cafetería", "matcha", "espresso",
        ],
    ),
    # Salons before bars so "nail bar" / "self-care bar" stay in salons
    (
        "salons",
        [
            "nail", "nails", "nailbar", "nail bar", "uñas", "unas",
            "estética", "estetica", "beauty", "peluquería", "peluqueria",
            "barbería", "barberia", "cabello", "hair", "salon", "salón",
            "spa", "wellness", "massage", "masaje", "hydrafacial",
            "manicura", "pedicure", "sauna", "recovery", "self-care",
        ],
    ),
    (
        "bars",
        [
            "wine bar", "bar", "speakeasy", "mezcalería", "mezcaleria",
            "pulquería", "pulqueria", "cervecería", "cerveceria",
            "meadery", "cocktail", "rooftop", "roof top", "terraza",
        ],
    ),
    (
        "dinner",
        [
            "restaurante", "restaurant", "bistro", "taquería", "taqueria",
            "tacos", "comida", "grill", "cocina", "fonda", "brasserie",
            "taberna", "taverna", "steakhouse", "carne", "bbq", "barbacoa",
            "carnitas", "pozole", "mole", "enchiladas", "sushi", "ramen",
            "pizza", "burger", "hamburgesa", "asador", "estiatorio",
        ],
    ),
    (
        "stores",
        [
            "tienda", "store", "shop", "boutique", "mercado", "market",
            "farmacia", "pharmacy", "supermarket", "supermercado",
            "librería", "libreria", "bookstore", "galería", "galeria",
            "vintage", "thrift", "moda", "fashion", "ropa", "clothing",
            "joyería", "joyeria", "jewelry", "ferretería", "ferreteria",
            "electronica", "electrónica", "concept store", "perfumérica",
            "perfumerica", "sartoria",
        ],
    ),
]

CATEGORY_NAMES = [c[0] for c in CATEGORIES]

# Note/tag values that hard-override keyword matching on title
NOTE_OVERRIDES = {
    "bar": "bars",
    "speakeasy": "bars",
    "wine bar": "bars",
    "cocktail": "bars",
    "hotel": "hotel",
    "airbnb": "hotel",
    "restaurant": "dinner",
    "omakase": "dinner",
    "breakfast": "dinner",
    "pizza": "dinner",
    "nail": "salons",
    "nails": "salons",
    "spa": "salons",
    "wellness": "salons",
    "coffee": "cafe",
    "smoothie": "cafe",
    "matcha": "cafe",
}


def normalize(text: str) -> str:
    """Lowercase and strip accents for robust matching."""
    nfkd = unicodedata.normalize("NFKD", text.lower())
    return "".join(c for c in nfkd if not unicodedata.combining(c))


def classify(title: str, note: str = "", tags: str = "") -> str:
    """
    Return the best category. Checks note/tags first (explicit user labels),
    then title keywords. Short keywords use word-boundary matching.
    """
    hints = (note + " " + tags).lower().strip()
    for hint_kw, category in NOTE_OVERRIDES.items():
        if hint_kw in hints:
            return category

    norm_title = normalize(title)
    for category, keywords in CATEGORIES:
        for kw in keywords:
            norm_kw = normalize(kw)
            if len(norm_kw) <= 4:
                # Word-boundary check: pad with spaces so "bar" won't match inside "barra"
                if f" {norm_kw} " in f" {norm_title} ":
                    return category
            else:
                if norm_kw in norm_title:
                    return category

    return "uncategorized"


# ---------------------------------------------------------------------------
# Parsers
# ---------------------------------------------------------------------------

def parse_csv_file(path: str) -> list[dict]:
    places = []
    with open(path, encoding="utf-8-sig") as f:
        lines = f.readlines()

    # Find the CSV header line (starts with "Title")
    start = 0
    for i, line in enumerate(lines):
        if line.strip().startswith("Title"):
            start = i
            break

    reader = csv.DictReader("".join(lines[start:]).splitlines())
    for row in reader:
        title = (row.get("Title") or "").strip()
        if not title or title == "Title":
            continue
        if title.lower().startswith("dropped pin"):
            continue

        place = {
            "name": title,
            "note": (row.get("Note") or "").strip(),
            "tags": (row.get("Tags") or "").strip(),
            "maps_url": (row.get("URL") or "").strip(),
            "address": "",
            "source_file": os.path.basename(path),
        }
        places.append(place)
    return places


def parse_geojson_file(path: str) -> list[dict]:
    with open(path, encoding="utf-8") as f:
        data = json.load(f)

    places = []
    if data.get("type") != "FeatureCollection":
        print(f"  Warning: {path} is not a GeoJSON FeatureCollection — skipping.")
        return places

    for feat in data.get("features", []):
        props = feat.get("properties", {})
        loc = props.get("Location", {})
        title = props.get("Title", "").strip()
        if not title or title.lower().startswith("dropped pin"):
            continue
        place = {
            "name": title,
            "note": "",
            "tags": "",
            "maps_url": props.get("Google Maps URL", ""),
            "address": loc.get("Address", ""),
            "source_file": os.path.basename(path),
        }
        places.append(place)
    return places


def parse_file(path: str) -> list[dict]:
    ext = Path(path).suffix.lower()
    if ext == ".csv":
        return parse_csv_file(path)
    elif ext == ".json":
        return parse_geojson_file(path)
    else:
        print(f"  Warning: unsupported file type {path} — skipping.")
        return []


# ---------------------------------------------------------------------------
# Optional Google Places API enrichment
# ---------------------------------------------------------------------------

def try_api_classify(place: dict, api_key: str) -> str:
    try:
        import urllib.parse
        import urllib.request

        query = place["name"]
        if place.get("address"):
            query += " " + place["address"]

        params = urllib.parse.urlencode({
            "input": query,
            "inputtype": "textquery",
            "key": api_key,
            "fields": "types",
            "language": "es",
            "locationbias": "circle:50000@19.4326,-99.1332",
        })
        url = f"https://maps.googleapis.com/maps/api/place/findplacefromtext/json?{params}"

        with urllib.request.urlopen(url, timeout=5) as resp:
            result = json.loads(resp.read())

        candidates = result.get("candidates", [])
        if not candidates:
            return "uncategorized"

        type_map = {
            "bakery": "bakery", "cafe": "cafe", "coffee_shop": "cafe",
            "restaurant": "dinner", "meal_takeaway": "dinner", "food": "dinner",
            "seafood_restaurant": "seafood", "bar": "bars", "night_club": "bars",
            "beauty_salon": "salons", "hair_care": "salons", "spa": "salons",
            "nail_salon": "salons", "clothing_store": "stores", "store": "stores",
            "shopping_mall": "stores", "supermarket": "stores",
            "pharmacy": "stores", "book_store": "stores", "jewelry_store": "stores",
        }
        for t in candidates[0].get("types", []):
            if t in type_map:
                return type_map[t]

    except Exception as e:
        print(f"    API lookup failed for '{place['name']}': {e}")

    return "uncategorized"


# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------

def write_output(categorized: dict[str, list], output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)

    all_cats = CATEGORY_NAMES + ["hotel", "uncategorized"]

    for cat, places in categorized.items():
        if not places:
            continue
        with open(output_dir / f"{cat}.json", "w", encoding="utf-8") as f:
            json.dump(places, f, ensure_ascii=False, indent=2)

    summary_lines = ["GOOGLE MAPS PLACES — CATEGORY SUMMARY", "=" * 48, ""]
    total = sum(len(p) for p in categorized.values())
    summary_lines.append(f"Total places processed: {total}")
    summary_lines.append("")

    for cat in all_cats:
        places = categorized.get(cat, [])
        if not places:
            continue
        summary_lines.append(f"{'─' * 44}")
        summary_lines.append(f"  {cat.upper()}  ({len(places)} places)")
        summary_lines.append(f"{'─' * 44}")
        for p in sorted(places, key=lambda x: x["name"].lower()):
            line = f"  • {p['name']}"
            hints = [h for h in [p.get("note"), p.get("tags")] if h]
            if hints:
                line += f"  ({', '.join(hints)})"
            summary_lines.append(line)
        summary_lines.append("")

    summary_text = "\n".join(summary_lines)
    (output_dir / "summary.txt").write_text(summary_text, encoding="utf-8")
    print(summary_text)
    print(f"Output written to: {output_dir}/")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Categorize Google Maps saved places from Takeout exports.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("input_files", nargs="+", metavar="FILE",
                        help="CSV or JSON files from Google Takeout")
    parser.add_argument("--output-dir", default="output", metavar="DIR",
                        help="Directory to write results (default: ./output)")
    parser.add_argument("--api-key", metavar="KEY",
                        help="Google Places API key for better accuracy on ambiguous names")
    args = parser.parse_args()

    all_places: list[dict] = []
    for path in args.input_files:
        if not os.path.exists(path):
            print(f"Error: file not found: {path}", file=sys.stderr)
            sys.exit(1)
        places = parse_file(path)
        print(f"Loaded {path}: {len(places)} places")
        all_places.extend(places)

    if not all_places:
        print("No places found.")
        sys.exit(0)

    seen: set[str] = set()
    unique: list[dict] = []
    for p in all_places:
        key = normalize(p["name"])
        if key not in seen:
            seen.add(key)
            unique.append(p)

    dupes = len(all_places) - len(unique)
    if dupes:
        print(f"Removed {dupes} duplicate(s).")

    print(f"\nCategorizing {len(unique)} unique places...\n")

    all_cats = CATEGORY_NAMES + ["hotel", "uncategorized"]
    categorized: dict[str, list] = {c: [] for c in all_cats}

    for place in unique:
        cat = classify(place["name"], place.get("note", ""), place.get("tags", ""))
        if cat == "uncategorized" and args.api_key:
            print(f"  Querying API for: {place['name']}")
            cat = try_api_classify(place, args.api_key)
        if cat not in categorized:
            cat = "uncategorized"
        categorized[cat].append(place)

    write_output(categorized, Path(args.output_dir))


if __name__ == "__main__":
    main()
