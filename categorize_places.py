#!/usr/bin/env python3
"""
Categorize Google Maps saved places from Google Takeout exports.

HOW TO GET YOUR DATA:
  1. Go to https://takeout.google.com
  2. Click "Deselect all", then check only "Maps (your places)"
  3. Click "Next step", choose export format, and create export
  4. Download the ZIP, extract it
  5. Your saved list files are in: Takeout/Maps (your places)/
     Each list is a separate JSON file (e.g. "CDMX.json", "Mexico City manifesto.json")

USAGE:
  # Single list:
  python categorize_places.py "CDMX.json"

  # Multiple lists (merged before categorizing):
  python categorize_places.py "CDMX.json" "Mexico City manifesto.json"

  # With Google Places API for better accuracy on ambiguous places:
  python categorize_places.py "CDMX.json" --api-key YOUR_API_KEY

  # Custom output folder:
  python categorize_places.py "CDMX.json" --output-dir my_lists
"""

import argparse
import json
import os
import sys
import unicodedata
from pathlib import Path

# ---------------------------------------------------------------------------
# Category definitions — ordered by priority (earlier = higher priority).
# Seafood must come before Dinner because "mariscos" can match both.
# ---------------------------------------------------------------------------
CATEGORIES = [
    (
        "seafood",
        [
            "mariscos", "seafood", "pescado", "ceviche", "ostión", "ostion",
            "camarón", "camaron", "shrimp", "oyster", "pulpo", "jaiba",
            "langosta", "tuna", "atún", "atun", "salmón", "salmon",
        ],
    ),
    (
        "bakery",
        [
            "panadería", "panaderia", "bakery", "pastelería", "pasteleria",
            "boulangerie", "croissant", "bread", "horno", "brioche",
            "baguette", "muffin", "donut", "dona", "rosquilla",
        ],
    ),
    (
        "dessert",
        [
            "helado", "ice cream", "nieve", "paleta", "postre", "dulce",
            "chocolate", "waffle", "crepe", "gelato", "candy", "sweet",
            "pastel", "cake", "cupcake", "brownie", "macaron", "tarta",
            "churro", "flan", "mousse",
        ],
    ),
    (
        "dinner",
        [
            "restaurante", "restaurant", "bistro", "cantina", "taquería",
        "taqueria", "tacos", "comida", "grill", "cocina", "fonda",
            "brasserie", "taberna", "steakhouse", "carne", "bbq",
            "barbacoa", "carnitas", "pozole", "mole", "enchiladas",
            "sushi", "ramen", "pizza", "burger", "hamburgesa",
        ],
    ),
    (
        "salons",
        [
            "salón", "salon", "spa", "estética", "estetica", "nail",
            "uñas", "unas", "beauty", "peluquería", "peluqueria",
            "barbería", "barberia", "barber", "cabello", "hair",
            "cosmetología", "cosmetologia", "masaje", "massage",
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
            "electronica", "electrónica",
        ],
    ),
]

CATEGORY_NAMES = [c[0] for c in CATEGORIES]


def normalize(text: str) -> str:
    """Lowercase and strip accents for robust matching."""
    nfkd = unicodedata.normalize("NFKD", text.lower())
    return "".join(c for c in nfkd if not unicodedata.combining(c))


def classify(title: str) -> str:
    """Return the best matching category for a place title, or 'uncategorized'."""
    norm_title = normalize(title)
    for category, keywords in CATEGORIES:
        for kw in keywords:
            if normalize(kw) in norm_title:
                return category
    return "uncategorized"


def parse_takeout_file(path: str) -> list[dict]:
    """Parse a Google Takeout saved-places JSON file into a list of place dicts."""
    with open(path, encoding="utf-8") as f:
        data = json.load(f)

    places = []

    # Standard Google Takeout format: GeoJSON FeatureCollection
    if data.get("type") == "FeatureCollection":
        features = data.get("features", [])
        for feat in features:
            props = feat.get("properties", {})
            loc = props.get("Location", {})
            geo = feat.get("geometry") or {}
            coords = geo.get("coordinates", [None, None])

            place = {
                "name": props.get("Title", "Unknown"),
                "address": loc.get("Address", ""),
                "maps_url": props.get("Google Maps URL", ""),
                "latitude": loc.get("Latitude") or (coords[1] if len(coords) > 1 else None),
                "longitude": loc.get("Longitude") or (coords[0] if coords else None),
                "source_file": os.path.basename(path),
            }
            places.append(place)
    else:
        print(f"  Warning: {path} is not a GeoJSON FeatureCollection — skipping.")

    return places


def try_api_classify(place: dict, api_key: str) -> str:
    """Use Google Places Text Search API to get place types for better categorization."""
    try:
        import urllib.parse
        import urllib.request

        query = place["name"]
        if place.get("address"):
            query += " " + place["address"]

        params = urllib.parse.urlencode({
            "query": query,
            "key": api_key,
            "fields": "types",
            "language": "es",
        })
        url = f"https://maps.googleapis.com/maps/api/place/findplacefromtext/json?{params}&inputtype=textquery"

        with urllib.request.urlopen(url, timeout=5) as resp:
            result = json.loads(resp.read())

        candidates = result.get("candidates", [])
        if not candidates:
            return "uncategorized"

        types = candidates[0].get("types", [])

        # Map Google place types to our categories
        type_map = {
            "bakery": "bakery",
            "cafe": "bakery",
            "meal_takeaway": "dinner",
            "restaurant": "dinner",
            "food": "dinner",
            "meal_delivery": "dinner",
            "seafood_restaurant": "seafood",
            "beauty_salon": "salons",
            "hair_care": "salons",
            "spa": "salons",
            "clothing_store": "stores",
            "store": "stores",
            "shopping_mall": "stores",
            "supermarket": "stores",
            "pharmacy": "stores",
            "book_store": "stores",
            "jewelry_store": "stores",
        }

        for t in types:
            if t in type_map:
                return type_map[t]

    except Exception as e:
        print(f"    API lookup failed for '{place['name']}': {e}")

    return "uncategorized"


def write_output(categorized: dict[str, list], output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)

    for category, places in categorized.items():
        out_path = output_dir / f"{category}.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(places, f, ensure_ascii=False, indent=2)

    # Human-readable summary
    summary_lines = ["GOOGLE MAPS PLACES — CATEGORY SUMMARY", "=" * 45, ""]
    total = sum(len(p) for p in categorized.values())
    summary_lines.append(f"Total places processed: {total}")
    summary_lines.append("")

    for category in CATEGORY_NAMES + ["uncategorized"]:
        places = categorized.get(category, [])
        summary_lines.append(f"{'─' * 40}")
        summary_lines.append(f"  {category.upper()}  ({len(places)} places)")
        summary_lines.append(f"{'─' * 40}")
        for p in sorted(places, key=lambda x: x["name"]):
            summary_lines.append(f"  • {p['name']}")
            if p.get("address"):
                summary_lines.append(f"    {p['address']}")
        summary_lines.append("")

    summary_text = "\n".join(summary_lines)
    summary_path = output_dir / "summary.txt"
    with open(summary_path, "w", encoding="utf-8") as f:
        f.write(summary_text)

    print(summary_text)
    print(f"\nOutput written to: {output_dir}/")
    print(f"  JSON files per category + summary.txt")


def main():
    parser = argparse.ArgumentParser(
        description="Categorize Google Maps saved places from Takeout exports.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "input_files",
        nargs="+",
        metavar="FILE",
        help="One or more Saved Places JSON files from Google Takeout",
    )
    parser.add_argument(
        "--output-dir",
        default="output",
        metavar="DIR",
        help="Directory to write categorized JSON files (default: ./output)",
    )
    parser.add_argument(
        "--api-key",
        metavar="KEY",
        help="Google Places API key for improved categorization of ambiguous places",
    )
    args = parser.parse_args()

    # --- Load all input files ---
    all_places: list[dict] = []
    for path in args.input_files:
        if not os.path.exists(path):
            print(f"Error: file not found: {path}", file=sys.stderr)
            sys.exit(1)
        print(f"Loading {path}...")
        places = parse_takeout_file(path)
        print(f"  Found {len(places)} places")
        all_places.extend(places)

    if not all_places:
        print("No places found in the provided files.")
        sys.exit(0)

    # Deduplicate by name + address
    seen = set()
    unique_places = []
    for p in all_places:
        key = (normalize(p["name"]), normalize(p.get("address", "")))
        if key not in seen:
            seen.add(key)
            unique_places.append(p)

    dupes = len(all_places) - len(unique_places)
    if dupes:
        print(f"\nRemoved {dupes} duplicate(s) across files.")

    print(f"\nCategorizing {len(unique_places)} places...")

    # --- Categorize ---
    categorized: dict[str, list] = {c: [] for c in CATEGORY_NAMES}
    categorized["uncategorized"] = []

    for place in unique_places:
        category = classify(place["name"])

        # If still uncategorized and API key provided, try the API
        if category == "uncategorized" and args.api_key:
            print(f"  Querying API for: {place['name']}")
            category = try_api_classify(place, args.api_key)

        categorized[category].append(place)

    # --- Write output ---
    write_output(categorized, Path(args.output_dir))


if __name__ == "__main__":
    main()
