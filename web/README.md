# La Güera's Guide

An interactive Mexico City catalog with Home collections, a searchable and
filterable map/list, and a saveable **Mi lista**. The current build contains
295 places. Editorial collections and ordering remain review candidates until
Ashley approves them; the app does not present that pending state as an
endorsement.

Catalog coverage is intentionally explicit rather than implied: 285 records
have exact map coordinates and a street address taken from their Google Maps
listing (checked 2026-11-02), and the 10 Michelin places added later have
building-level pins from OpenStreetMap. 34 lack a direct Google Maps place URL (the
Cómo llegar button falls back to a name-and-address search), 31 lack an
Instagram handle, 4 lack a vibe note, and 284 image slots are still empty
pending identity, reuse-rights, credit, and approval checks. Prices are not
currently published.

Working notes for the next person or agent: [`docs/HANDOFF.md`](../docs/HANDOFF.md).

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

Three pages: **Home** (hero + New & hot + La Güera's Picks + mood buttons + colonias +
More from la güera) → **Mapa** (map, list, search and filters together) →
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

`src/data/places.json` was first generated from the categorization pipeline in
the repo root (`categorize_places.py`, `scripts/build_site_data.py`,
`scripts/merge_enrichment.py`, `scripts/apply_curation.py`,
`scripts/attach_photos.py`, `curation.json`).

**Do not re-run that pipeline.** It no longer matches `places.json`: pins,
addresses, picks, featured order, sources and photos were added directly to the
JSON, and running the pipeline would overwrite that work. Edit `places.json` by
hand or with a small script, then run `npm run qa:data`. `docs/HANDOFF.md` has
the data model and the rules for editing it. `CURATION_NOTES.md` is a record of
the original curation pass, not a current to-do list.

`npm run qa:data` is the repeatable catalog gate. It checks unique IDs,
required fields, the explicit pending featured-review order, coordinate and
neighborhood consistency, and the honest unpinned-list state. Run it after
every data or curation change; the counts above reflect its 2026-10-31 result
and should be updated from the generated catalog rather than by assumption.

`src/data/neighborhoods.ts` holds approximate neighborhood centers. They are only a
fallback for any new place that does not yet have exact `lat`/`lng` in
`src/data/places.json`.

## Deployment

Pushes to `main` that touch `web/**` trigger
`.github/workflows/deploy-web.yml`, which builds and publishes to GitHub
Pages.
