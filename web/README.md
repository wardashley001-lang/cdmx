# La Güera's Guide

Ashley's Mexico City, one page: Hot Right Now, Michelin 2026, Essentials, and
Best Tacos, then Eat / Drinks / Coffee & Sweets / Beyond Food — 258 saved
places, each with neighborhood, vibe, price and direct links to Google Maps
and Instagram, plus an interactive map and a saveable "Mi lista".

## Stack

React + TypeScript + Vite, Tailwind CSS v4, React Router (hash routing, so it
works on static GitHub Pages hosting), Leaflet/OpenStreetMap for the map.

## Design system

Visuals follow the "La Güera's Guide" design system (oxblood/rosa mexicano,
Bodoni Moda + Syne + Mrs Saint Delafield + Instrument Sans + Courier Prime,
teardrop map pins, checker/gingham/storia/carpet patterns), with copy kept
mostly English and Spanish used as an accent (Mapa, Mi lista, Guardar, Cómo
llegar, Abierto/Cerrado):

- `src/index.css` — design tokens (colors, typography, spacing, patterns)
  and self-hosted `@font-face` declarations
- `src/assets/fonts/` — self-hosted woff2 subset
- `src/components/ds/` — design system primitives (Button, IconButton, Tag,
  Badge, Dialog, Toast, Input, Tabs, SpotCard, MapPin)
- `src/data/categoryStyle.ts` — maps the 21 real categories onto the design
  system's 6 color/icon buckets (comer/beber/cafe/bailar/tienda/ver)

Three pages: **Home** (hero + Hot ahorita + Michelin + Essentials + Tacos +
mood tags + colonias) → **Mapa** (map, list, search and filters together) →
**Mi lista** (saved places, persisted to `localStorage`).

## Development

```bash
npm install
npm run dev
```

## Data & curation

`src/data/places.json` is generated from the categorization pipeline in the
repo root, then enriched and curated:

```bash
# from the repo root
python categorize_places.py data/*.csv --output-dir output
python scripts/build_site_data.py      # regenerate places.json from output/*.json
python scripts/merge_enrichment.py     # merge in researched enrichment fields
python scripts/apply_curation.py       # apply curation.json (Hot/Michelin/Essentials/Tacos, category moves)
python scripts/attach_photos.py        # after adding files to web/public/photos/
```

What's Hot, Essential, or Michelin-listed, and which category each place
belongs in, lives in `curation.json` at the repo root — see
`CURATION_NOTES.md` for what to double-check.

`src/data/neighborhoods.ts` holds approximate centroid coordinates used to
place map pins until exact lat/lng are available from a GeoJSON Takeout
export (see `Place.lat` / `Place.lng` in `src/types.ts`).

## Deployment

Pushes to `main` that touch `web/**` trigger
`.github/workflows/deploy-web.yml`, which builds and publishes to GitHub
Pages.
