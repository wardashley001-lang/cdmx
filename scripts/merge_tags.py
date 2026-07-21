#!/usr/bin/env python3
"""
Merge occasion/atmosphere tag research into web/src/data/places.json,
matched by place name. Sources: cuisine_and_tags.json (fine dining +
dinner batch, tags bundled with the cuisine research) plus three
dedicated tag-only research batches.
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
TAG_FILES = [
    "cuisine_and_tags.json",
    "tags_bars_wine.json",
    "tags_misc.json",
    "tags_other.json",
]

VALID_TAGS = {
    "romantic", "trendy", "casual", "lively atmosphere",
    "good for lunch", "good for dinner", "outdoor",
}


def norm(text: str) -> str:
    text = text.replace("‘", "'").replace("’", "'")
    nfkd = unicodedata.normalize("NFKD", text.lower().strip())
    return "".join(c for c in nfkd if not unicodedata.combining(c))


def main():
    data = json.loads(PLACES_FILE.read_text(encoding="utf-8"))
    by_name = {norm(p["name"]): p for p in data["places"]}

    total_entries = 0
    filled = 0
    invalid_tags = set()
    unmatched = []

    for fname in TAG_FILES:
        f = SCRATCH / fname
        if not f.exists():
            print(f"  (skip, not found: {fname})")
            continue
        entries = json.loads(f.read_text(encoding="utf-8"))
        for entry in entries:
            total_entries += 1
            key = norm(entry["name"])
            place = by_name.get(key)
            if not place:
                candidates = [p for k, p in by_name.items() if key in k or k in key]
                place = candidates[0] if len(candidates) == 1 else None
            if not place:
                unmatched.append(entry["name"])
                continue
            tags = entry.get("tags") or []
            clean_tags = []
            for t in tags:
                if t in VALID_TAGS:
                    clean_tags.append(t)
                else:
                    invalid_tags.add(t)
            if clean_tags:
                place["occasionTags"] = clean_tags
                filled += 1

    PLACES_FILE.write_text(
        json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print(f"Processed {total_entries} tag entries.")
    print(f"Places with 1+ tags: {filled}")
    if invalid_tags:
        print(f"WARNING — invalid tags dropped (not in vocabulary): {invalid_tags}")
    if unmatched:
        print(f"Unmatched names ({len(unmatched)}): {unmatched}")

    no_tags = [p["name"] for p in data["places"] if not p["occasionTags"]]
    print(f"\nPlaces with no tags ({len(no_tags)}): {no_tags}")


if __name__ == "__main__":
    main()
