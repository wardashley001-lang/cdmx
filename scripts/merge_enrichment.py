#!/usr/bin/env python3
"""
Merge enrichment research batches (instagram / neighborhood / vibe) into
web/src/data/places.json, matched by place name.
"""
import json
import unicodedata
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
PLACES_FILE = REPO_ROOT / "web" / "src" / "data" / "places.json"
SCRATCH = Path(
    "/tmp/claude-0/-home-user-ubiquitous-octo-waffle/"
    "f6a2025c-0e65-5107-b863-a68e110a288c/scratchpad"
)
ENRICHMENT_FILES = [
    "enrich_fine_dining.json",
    "enrich_bars.json",
    "enrich_dinner_wine_nightlife.json",
    "enrich_cafe_salons_healthy.json",
    "enrich_stores_attractions_hotel.json",
    "enrich_gap_fill.json",
]


def norm(text: str) -> str:
    text = text.replace("‘", "'").replace("’", "'")
    nfkd = unicodedata.normalize("NFKD", text.lower().strip())
    return "".join(c for c in nfkd if not unicodedata.combining(c))


def main():
    data = json.loads(PLACES_FILE.read_text(encoding="utf-8"))
    by_name = {norm(p["name"]): p for p in data["places"]}

    filled = {"instagram": 0, "neighborhood": 0, "vibe": 0}
    unmatched = []
    total_entries = 0

    for fname in ENRICHMENT_FILES:
        f = SCRATCH / fname
        if not f.exists():
            print(f"  (skip, not found yet: {fname})")
            continue
        entries = json.loads(f.read_text(encoding="utf-8"))
        for entry in entries:
            total_entries += 1
            key = norm(entry["name"])
            place = by_name.get(key)
            if not place:
                # fall back to substring match (agents sometimes trim long names)
                candidates = [p for k, p in by_name.items() if key in k or k in key]
                place = candidates[0] if len(candidates) == 1 else None
            if not place:
                unmatched.append(entry["name"])
                continue
            for field in ("instagram", "neighborhood", "vibe"):
                if entry.get(field):
                    place[field] = entry[field]
                    filled[field] += 1

    PLACES_FILE.write_text(
        json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print(f"Processed {total_entries} enrichment entries.")
    print(f"Filled: instagram={filled['instagram']} neighborhood={filled['neighborhood']} vibe={filled['vibe']}")
    if unmatched:
        print(f"Unmatched names ({len(unmatched)}): {unmatched}")

    still_empty = [p["name"] for p in data["places"] if not p["vibe"]]
    print(f"\nPlaces with no vibe line yet ({len(still_empty)}): {still_empty}")


if __name__ == "__main__":
    main()
