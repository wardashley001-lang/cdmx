# La Güera's Guide

An interactive Mexico City catalog with Home collections, a searchable and
filterable map/list, and a saveable **Mi lista**. The current build contains
284 places. Editorial collections and ordering remain review candidates until
Ashley approves them; the app does not present that pending state as an
endorsement.

Catalog coverage is intentionally explicit rather than implied: 10 records
have source-backed exact coordinates, 54 lack a direct Google Maps URL, 22
lack an Instagram handle, 5 lack a vibe note, and every image slot is still
empty pending identity, reuse-rights, credit, and approval checks. Mapa uses
labeled neighborhood-level approximations where available and keeps the one
unresolved record searchable in the list without fabricating a pin. Prices are
not currently published.

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

`localStorage` is browser-local storage, not an account, cloud sync, or a
one-tap Google/Apple Maps import. Those phone-delivery behaviors require a
separate real-device compatibility test.

## Development

```bash
npm install
npm run qa:data
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

`npm run qa:data` is the repeatable catalog gate. It checks unique IDs,
required fields, the explicit pending featured-review order, coordinate and
neighborhood consistency, and the honest unpinned-list state. Run it after
every data or curation change; the counts above reflect its 2026-10-31 result
and should be updated from the generated catalog rather than by assumption.

`src/data/neighborhoods.ts` holds approximate centroid coordinates used to
place map pins until exact lat/lng are available from a GeoJSON Takeout
export (see `Place.lat` / `Place.lng` in `src/types.ts`).

## Deployment

Pushes to `main` that touch `web/**` trigger
`.github/workflows/deploy-web.yml`, which builds and publishes to GitHub
Pages.
