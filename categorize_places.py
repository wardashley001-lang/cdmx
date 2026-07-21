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
# Brunch before dessert: waffle/hotcakes venues beat dessert spots.
# Salons before bars: "nail bar" / "self-care bar" stay in salons.
# Healthy before cafe: juice/smoothie before coffee.
# Wine before bars: wine bars go to wine, not cocktail bars.
# Fine dining before dinner: tasting/degustación keywords win.
# Attractions at end: landmark keywords are broad.
# ---------------------------------------------------------------------------
CATEGORIES = [
    (
        "seafood",
        [
            "mariscos", "marisqueria", "marisquería", "seafood", "pescado",
            "ceviche", "ostión", "ostion", "ostería", "osteria", "ostrería",
            "ostreria", "camarón", "camaron", "shrimp", "oyster", "pulpo",
            "jaiba", "langosta", "langostino", "atún", "atun", "salmón", "salmon",
            "callo", "almeja", "almejas", "aguachile", "bacalao", "marlin",
            "tikin", "ostras", "clamato", "tostada de atun",
            "abrasamar", "contramar", "tibur",
        ],
    ),
    (
        "bakery",
        [
            "panadería", "panaderia", "bakery", "pastelería", "pasteleria",
            "boulangerie", "croissant", "bread", "horno", "brioche",
            "baguette", "muffin", "donut", "dona", "rosquilla", "churrería",
            "churreria", "churro", "bagel", "delicatessen", "repostería",
            "reposteria", "pâtisserie", "patisserie", "galleta", "cookie",
            "polvorón", "polvoron", "medialuna", "concha", "conchas", "danish",
        ],
    ),
    # Brunch before dessert: "hotcakes" and "waffle" at brunch spots beat dessert
    (
        "brunch",
        [
            "brunch", "desayunos", "desayuno", "hotcakes", "pancakes",
            "omelette", "omeletes", "omelet", "french toast",
            "avocado toast", "eggs benedict", "benedict",
        ],
    ),
    (
        "dessert",
        [
            "helado", "ice cream", "nieve", "paleta", "postre", "dulce",
            "chocolate", "waffle", "crepe", "gelato", "candy", "sweet",
            "cake", "cupcake", "brownie", "macaron", "tarta", "flan",
            "mousse", "amorino", "sorbete", "parfait", "sundae",
            "pastelito", "marquesita", "rolled ice cream", "trufas",
        ],
    ),
    (
        "healthy",
        [
            "juice", "jugo", "jugos", "smoothie", "granel", "organico",
            "orgánico", "vegano", "vegan", "frutas", "wheatgrass",
            "superfoods", "acai", "açaí", "detox", "bowl", "ensalada",
            "salad", "poke", "plant-based", "granola", "juicery",
            "raw food", "sin gluten", "gluten free", "nutricion", "nutrición",
        ],
    ),
    (
        "cafe",
        [
            "café", "cafe", "caffè", "caffe", "coffee", "momo coffee",
            "cafebrería", "cafeteria", "cafetería", "matcha", "espresso",
            "brewing", "roastery", "cold brew", "third wave",
            "specialty coffee", "boba", "bubble tea", "té", "teahouse",
            "chai",
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
            "lash", "brow", "wax", "depilación", "depilacion",
            "skincare", "facial", "threading", "pilates", "yoga",
        ],
    ),
    # Wine before bars so wine bars go to wine, not cocktail bars
    (
        "wine",
        [
            "vino", "vinos", "wine", "enoteca", "vinoteca", "cava",
            "vineria", "viñedo", "vinedo", "sommelier", "natural wine",
            "vigneron", "bodega", "champagne", "champán", "champan",
            "vino natural", "vinos naturales", "pet nat", "ampelidae",
        ],
    ),
    (
        "bars",
        [
            "wine bar", "bar", "speakeasy", "mezcalería", "mezcaleria",
            "mezcal", "tequila", "agave", "destilería", "destileria",
            "pulquería", "pulqueria", "cervecería", "cerveceria",
            "meadery", "cocktail", "rooftop", "roof top", "terraza",
            "cantina", "tepache", "sotol", "raicilla", "charanda",
        ],
    ),
    (
        "nightlife",
        [
            "nightclub", "disco", "after party", "dj set",
            "club nocturno", "live music", "música en vivo", "musica en vivo",
            "jazz club", "rave", "after hours",
        ],
    ),
    (
        "mexican",
        [
            "taquería", "taqueria", "tacos", "carnitas", "pozole", "mole",
            "enchiladas", "birria", "tlayuda", "mixiote", "tamales",
            "antojitos", "cocina mexicana", "mexicana", "mexicano",
            "oaxaqueño", "oaxaqueña", "yucateco", "yucateca",
        ],
    ),
    (
        "italian",
        [
            "italiana", "italiano", "pizza", "pasta", "osteria", "trattoria",
            "risotto", "gnocchi",
        ],
    ),
    (
        "japanese",
        [
            "japonés", "japones", "sushi", "ramen", "omakase", "izakaya",
            "yakitori", "robata", "wagyu",
        ],
    ),
    (
        "mediterranean",
        [
            "mediterráneo", "mediterraneo", "libanés", "libanes", "griega",
            "griego", "hummus", "falafel", "shawarma", "tapas",
        ],
    ),
    (
        "french",
        [
            "francesa", "francés", "frances", "bistro", "brasserie",
            "croque monsieur", "bistronomy",
        ],
    ),
    (
        "american",
        [
            "burger", "hamburgesa", "steakhouse", "bbq", "barbacoa", "grill",
            "diner",
        ],
    ),
    (
        "contemporary",
        [
            "fusion", "mashup", "cocina de autor", "open-kitchen",
            "open kitchen", "creative plates",
        ],
    ),
    (
        "dinner",
        [
            "restaurante", "restaurant", "comida", "cocina", "fonda",
            "taberna", "taverna", "carne", "asador", "estiatorio", "comedor",
            "coreano", "coreana", "thai", "vietnamita", "peruano", "peruana",
            "argentina", "colombiano", "tasting menu", "degustación",
            "degustacion", "chef's table", "prix fixe", "gastronomico",
            "gastronómico", "alta cocina",
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
            "perfumerica", "sartoria", "zapatos", "zapatería", "zapateria",
            "shoes", "sneakers", "accesorios", "accessories", "regalo",
            "florería", "floreria", "flores", "floristería", "floristeria",
            "cerámica", "ceramica", "artesanías", "artesanias", "handmade",
            "antigüedades", "antiguedades", "antiques", "consignment",
        ],
    ),
    (
        "attractions",
        [
            "museo", "museum", "castle", "castillo", "palacio", "palace",
            "biblioteca", "library", "zona arqueologica", "zona arqueológica",
            "pyramid", "piramide", "pirámide", "monument", "monumento",
            "parque", "catedral", "cathedral", "templo mayor",
            "jardín", "jardin", "centro cultural", "ex convento", "hacienda",
            "mirador", "azotea", "teatro", "theater", "galería de arte",
            "mercado de artesanias", "zona arqueológica",
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
    "mezcal": "bars",
    "cantina": "bars",
    "hotel": "hotel",
    "airbnb": "hotel",
    "restaurant": "dinner",
    "omakase": "japanese",
    "tasting": "dinner",
    "fine dining": "dinner",
    "brunch": "brunch",
    "desayuno": "brunch",
    "breakfast": "brunch",
    "pizza": "dinner",
    "nail": "salons",
    "nails": "salons",
    "spa": "salons",
    "wellness": "salons",
    "yoga": "salons",
    "pilates": "salons",
    "coffee": "cafe",
    "smoothie": "healthy",
    "vegan": "healthy",
    "matcha": "cafe",
    "wine": "wine",
    "club": "nightlife",
    "museum": "attractions",
    "attraction": "attractions",
    "seafood": "seafood",
    "ceviche": "seafood",
}

# ---------------------------------------------------------------------------
# Known Mexico City places — exact normalized name → category.
# Used for places whose names give no keyword signal (proper nouns, addresses).
# ---------------------------------------------------------------------------
KNOWN_PLACES = {
    # Cuisine — chef-driven / sit-down restaurants, classified by cuisine
    # rather than a flat "fine dining"/"dinner" split. Source: per-place
    # research (vibe text + web search); see the audit notes below for
    # places whose true identity turned out to be a bar/cafe/dessert spot
    # rather than a cuisine restaurant.
    "cometa": "dinner",   # ambiguous — common name, no confident match
    "l'enfant": "french",
    "castizo roma": "mediterranean",
    "el jamil": "mediterranean",
    "fugu sushi": "japanese",
    "darosa": "italian",
    "rapsodia": "dinner",  # ambiguous — multiple unrelated venues share the name
    "etranger": "french",
    "arda": "contemporary",
    "ticuchi": "bars",     # Olvera's agave/mezcal bar, not a full restaurant
    "rosa negra": "american",
    "animal masaryk": "contemporary",
    "propio": "contemporary",
    "orbita": "bars",      # coffee-bar-by-day/cocktail-bar-by-night hybrid
    "em": "mexican",
    "havre 77": "french",
    "migrante": "contemporary",
    "huset": "mexican",
    "quintonil": "mexican",
    "casa mandarine": "dinner",  # ambiguous — matches a concept store, not confirmed as a restaurant
    "lardo": "mediterranean",
    "balcon del zocalo": "mexican",
    "blanco colima": "mediterranean",
    "restaurante rosetta": "mexican",
    "san angel inn": "mexican",
    "botanico": "italian",
    "feral": "contemporary",
    "baldio": "mexican",
    "alterna": "contemporary",
    "wagyu jyube": "japanese",
    "chopsticks": "dinner",  # ambiguous — no confident CDMX match found
    "maizajo": "mexican",
    "sartoria": "italian",   # Italian pasta restaurant (not a tailor shop)
    "boogie's pizza": "american",
    "el olvidado": "cafe",   # English-inspired bakery/café, not a cuisine restaurant
    "gaba restaurante": "contemporary",
    "travieso travieso": "nightlife",  # natural-wine bar + DJs, shifts into a dance venue
    "homare cocina tradicional japonesa": "japanese",
    "auna restaurante": "mexican",
    "casa elena restaurante": "mexican",
    "restaurante castizo": "mediterranean",
    "taqueria \"sin nombre\"": "mexican",
    "taverna": "mediterranean",
    "estiatorio nostos (lomas)": "mediterranean",
    "casa visconti": "dessert",  # Italian gelato shop, not a cuisine restaurant
    "bartola": "italian",
    "cursi": "american",
    "lotti": "contemporary",
    "la pantera asador": "mexican",
    "babero": "italian",
    "cochilada": "dinner",  # ambiguous — no matching venue found
    "tosco restaurante": "contemporary",
    "biggie's": "american",
    "amin": "cafe",  # gourmet neighborhood café, not a cuisine restaurant
    "taqueria orinoco": "mexican",
    "alma mia condesa": "cafe",
    # More cuisine restaurants — marquee CDMX names, for future re-imports
    "pujol": "mexican",
    "dulce patria": "mexican",
    "merotoro": "mexican",
    "maximo bistrot": "mexican",
    "limosneros": "mexican",
    "expendio de maiz": "mexican",
    "guzina oaxaca": "mexican",
    "rokai": "japanese",
    "crudo": "seafood",
    "pastel": "mexican",     # Modern Mexican in Polanco
    "amaya": "mexican",
    "lorea": "mexican",
    "mog": "japanese",
    # Wine bars & natural wine spots
    "plonk": "wine",
    "vigneron": "wine",
    "despacho margarita": "wine",
    "hugo": "wine",
    "fournier rousseau": "wine",
    "pisca": "wine",
    # Bars / cocktail spots that keyword matching missed
    "barra lupe": "bars",
    "essex": "bars",
    "dacopa": "bars",
    "ololo": "bars",
    "roca": "bars",
    "tlecan": "bars",
    "caiman": "bars",
    "balagan": "bars",
    "kinshasa roma": "bars",
    "anonimo": "bars",
    "el tigre silencioso": "bars",
    "yage": "bars",
    "zimo": "bars",
    "maleza": "bars",
    "altanera roma": "bars",
    "carajo maria": "bars",
    "licoreria limantour": "bars",
    "salon corona": "bars",         # Historic cantina
    "la polar": "bars",             # Historic cantina
    "el nivel": "bars",             # Oldest cantina in CDMX
    # Nightlife — clubs, music venues, DJ and live music spots
    "void": "nightlife",
    "trampa": "nightlife",
    "ruido": "nightlife",
    "departamento": "nightlife",
    "jazzatlan capital": "nightlife",
    "fonico": "nightlife",
    "sona - listening space": "nightlife",
    "multiforo alicia": "nightlife",
    "tokyo music bar": "nightlife",  # Live music venue; "bar" keyword → bars
    # Seafood — ceviche bars, oyster spots
    "la docena": "seafood",          # Oyster bar
    "entremar": "seafood",
    # Brunch spots
    "todo en domingo": "brunch",
    "lula bistro": "brunch",
    "evoka": "brunch",
    # Healthy — juice bars, smoothies, organic markets
    "happy fruit": "healthy",
    "blend station": "healthy",
    "botanica granel": "stores",
    "the green corner": "healthy",
    "por siempre vegano": "healthy",
    "wild": "healthy",
    # More casual restaurants — marquee names, for future re-imports
    "nicos": "mexican",
    "el turix": "mexican",
    "boca grande": "mexican",
    # Bakery
    "molino el pujol": "bakery",
    # Stores (keyword-missed)
    "armario comunal": "stores",
    "fueguia 1833 mexico": "stores",
    # Hotels (keyword-missed)
    "haab project condesa": "hotel",
    # Café (keyword-missed)
    "oly.": "cafe",
    "tomasa condesa": "cafe",
    "buna": "cafe",
    "almanegra cafe": "cafe",
    "casa simera": "cafe",  # viral café/pilates studio in Polanco, not lodging
    # Attractions — museums, landmarks, cultural sites, day trips
    "frida kahlo museum": "attractions",
    "museo soumaya": "attractions",
    "chapultepec castle": "attractions",
    "palacio de bellas artes": "attractions",
    "biblioteca vasconcelos": "attractions",
    "la gruta": "attractions",
    "xochimilco": "attractions",
    "tepotzotlan": "attractions",
    "the house of tiles": "attractions",
    "parque quetzalcoatl": "attractions",
    "nido de quetzalcoatl": "attractions",
    "national art museum": "attractions",
    "lagoalgo": "attractions",
    "alae's art room": "attractions",
    # Audit corrections — proper-noun overrides for keyword false-positives
    "salon palomilla": "bars",              # Cantina/pulquería; "salon" keyword → salons
    "disco cafe & bar": "bars",             # Late-night bar; "cafe" keyword → cafe
    # Hotbook July 2025 hotspots
    "ricochet apero": "bars",
    "la romana": "bars",
    "la belle epoque": "dessert",
}

# Raw street addresses saved as location pins — no useful place info, excluded from output.
SKIP_PLACES = {
    "cordoba 87",
    "amsterdam 133",
    "amsterdam 213",
    "durango 136",
    "av nuevo leon 155",
    "av. nuevo leon 206",
}


def normalize(text: str) -> str:
    """Lowercase, strip accents, and normalize curly apostrophes for robust matching."""
    text = text.replace("‘", "'").replace("’", "'")
    nfkd = unicodedata.normalize("NFKD", text.lower())
    return "".join(c for c in nfkd if not unicodedata.combining(c))


def classify(title: str, note: str = "", tags: str = "") -> str:
    """
    Return the best category. Priority order:
    1. Note/tag overrides (explicit user labels)
    2. Known places lookup (proper-noun CDMX venues)
    3. Title keyword matching (short keywords use word-boundary check)
    """
    hints = (note + " " + tags).lower().strip()
    for hint_kw, category in NOTE_OVERRIDES.items():
        if hint_kw in hints:
            return category

    norm_title = normalize(title)

    if norm_title in SKIP_PLACES:
        return "_skip"

    if norm_title in KNOWN_PLACES:
        return KNOWN_PLACES[norm_title]

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
            "seafood_restaurant": "seafood", "bar": "bars", "night_club": "nightlife",
            "beauty_salon": "salons", "hair_care": "salons", "spa": "salons",
            "nail_salon": "salons", "clothing_store": "stores", "store": "stores",
            "shopping_mall": "stores", "supermarket": "stores",
            "pharmacy": "stores", "book_store": "stores", "jewelry_store": "stores",
            "museum": "attractions", "tourist_attraction": "attractions",
            "park": "attractions", "library": "attractions",
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

    summary_lines = ["GOOGLE MAPS PLACES — MASTER CDMX GUIDE", "=" * 48, ""]
    total = sum(len(p) for p in categorized.values())
    summary_lines.append(f"Total places processed: {total}")
    summary_lines.append("")

    for cat in all_cats:
        places = categorized.get(cat, [])
        if not places:
            continue
        summary_lines.append(f"{'─' * 44}")
        summary_lines.append(f"  {cat.upper().replace('_', ' ')}  ({len(places)} places)")
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
        if cat == "_skip":
            continue
        if cat == "uncategorized" and args.api_key:
            print(f"  Querying API for: {place['name']}")
            cat = try_api_classify(place, args.api_key)
        if cat not in categorized:
            cat = "uncategorized"
        categorized[cat].append(place)

    write_output(categorized, Path(args.output_dir))


if __name__ == "__main__":
    main()
