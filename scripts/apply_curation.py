#!/usr/bin/env python3
"""
Apply curation.json (repo root) to web/src/data/places.json.

curation.json is the file you edit by hand: which places are Hot, which are
Essentials, which carry a Michelin distinction, and which category each
place belongs in. This script is idempotent — edit curation.json, re-run it,
commit places.json.

    python scripts/apply_curation.py
"""
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLACES = ROOT / "web" / "src" / "data" / "places.json"
CURATION = ROOT / "curation.json"


def norm(s: str) -> str:
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def main():
    cur = json.loads(CURATION.read_text(encoding="utf-8"))
    data = json.loads(PLACES.read_text(encoding="utf-8"))
    places = data["places"]
    by_name = {norm(p["name"]): p for p in places}

    def find(name: str):
        p = by_name.get(norm(name))
        if p is None:
            raise SystemExit(f"curation.json: no place named {name!r} in places.json")
        return p

    # ── categories ────────────────────────────────────────────
    cats = data["categories"]
    for cid in cur["removeCategories"]:
        cats.pop(cid, None)
    for cid, meta in cur["newCategories"].items():
        cats[cid] = dict(meta)
    for cid, label in cur["categoryLabels"].items():
        cats[cid]["label"] = label
    cat_to_group = {c: g for g, cs in cur["groups"].items() for c in cs}
    ordered = {}
    for cid in cur["categoryOrder"]:
        ordered[cid] = {**cats[cid], "group": cat_to_group[cid]}
    missing = set(cats) - set(ordered)
    if missing:
        raise SystemExit(f"categoryOrder is missing: {sorted(missing)}")
    data["categories"] = ordered

    # ── places added by curation (not in your Google Maps exports) ──
    def slug(x: str) -> str:
        return re.sub(r"[^a-z0-9]+", "-", norm(x)).strip("-")
    for add in cur.get("additions", []):
        if norm(add["name"]) in by_name:
            continue
        place = {
            "id": f"{add['category']}-{slug(add['name'])}",
            "name": add["name"],
            "category": add["category"],
            "mapsUrl": "",
            "neighborhood": add.get("neighborhood"),
            "instagram": add.get("instagram"),
            "vibe": add.get("vibe"),
            "lat": None,
            "lng": None,
            "priceTier": None,
            "occasionTags": add.get("occasionTags", []),
            "sourceFile": "added-in-curation",
        }
        places.append(place)
        by_name[norm(add["name"])] = place

    # ── per-place fields ──────────────────────────────────────
    for name, new_cat in cur["moves"].items():
        find(name)["category"] = new_cat

    hot = {norm(n) for n in cur["hot"]}
    ess = {norm(n) for n in cur["essentials"]}
    mich = {norm(n): v for n, v in cur["michelin"].items()}
    for n in list(hot) + list(ess) + list(mich):
        if n not in by_name:
            raise SystemExit(f"curation.json: unknown place {n!r}")

    for p in places:
        k = norm(p["name"])
        p.pop("hot", None); p.pop("essential", None); p.pop("michelin", None)
        if p["category"] not in ordered:
            raise SystemExit(f"{p['name']} is in unknown category {p['category']!r}")
        p["group"] = ordered[p["category"]]["group"]
        if k in mich:
            p["michelin"] = {"year": 2026, **mich[k]}
        if k in hot:
            p["hot"] = True
        if k in ess:
            p["essential"] = True
        if cur.get("dropPlaceholderPrices"):
            p["priceTier"] = None
        p.setdefault("image", None)

    data["meta"] = {"updated": cur["updated"]}
    PLACES.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    # ── summary ───────────────────────────────────────────────
    def section(p):
        if p["category"] == "tacos": return "tacos"
        if p.get("michelin"): return "michelin"
        if p.get("hot"): return "hot"
        if p.get("essential"): return "essentials"
        return p["group"]
    from collections import Counter
    print(len(places), "places ->", dict(Counter(section(p) for p in places)))


if __name__ == "__main__":
    main()
