# Guía CDMX

The México City guide — 172 saved places organized by category, each with
neighborhood, vibe, and direct links to Google Maps and Instagram, plus an
interactive map.

## Stack

React + TypeScript + Vite, Tailwind CSS v4, React Router (hash routing, so it
works on static GitHub Pages hosting), Leaflet/OpenStreetMap for the map.

## Development

```bash
npm install
npm run dev
```

## Data

`src/data/places.json` is generated from the categorization pipeline in the
repo root, then enriched with neighborhood / vibe / Instagram data:

```bash
# from the repo root
python scripts/build_site_data.py      # regenerate places.json from output/*.json
python scripts/merge_enrichment.py     # merge in researched enrichment fields
```

`src/data/neighborhoods.ts` holds approximate centroid coordinates used to
place map pins until exact lat/lng are available from a GeoJSON Takeout
export (see `Place.lat` / `Place.lng` in `src/types.ts`).

## Deployment

Pushes to `Two-nights-in` or `claude/google-maps-category-lists-8w3hfp` that
touch `web/**` trigger `.github/workflows/deploy-web.yml`, which builds and
publishes to GitHub Pages.
