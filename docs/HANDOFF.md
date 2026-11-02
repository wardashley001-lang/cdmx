# La Güera's Guide: working notes for the next agent

Last updated 2026-11-02. This file is public, so it holds no private details.
Private planning for the paid guide, the storefront and Instagram stays in the
private OpenClaw repo, not here.

Live site: https://wardashley001-lang.github.io/cdmx/
Repo: `wardashley001-lang/cdmx` (the app lives in `web/`).

## What this is

Ashley's interactive Mexico City food and venue guide: React 19 + TypeScript +
Vite + Tailwind v4, HashRouter, Leaflet/OpenStreetMap. Three pages: Home
(shelves), Mapa (map + list + filters), Mi lista (saved places, stored only in
that browser's `localStorage`).

## Rules that always apply

1. **Ashley approves what is featured, and what is public.** Nothing goes on
   social media, no accounts are created and no money is spent without her go.
2. **Never invent venue facts or firsthand experience.** Every claim needs a
   live, dated source recorded in the place's `sources[]`. The first-person
   "la güera" voice appears only on text Ashley approved (the `pick` field).
   See `VOICE.md`.
3. **Photos:** only photos Ashley supplies or approves. Record where each came
   from and a credit line (`imageCredit`). The catalog check fails if a photo
   has no credit. Do not scrape Instagram; it blocks logged-out access, and
   Ashley's own account is hers.
4. **Keep private material out of this repo:** interview records, voice notes,
   financial or legal details, internal tool paths.

## Current state (2026-11-02)

- 285 places in `web/src/data/places.json`, every one with exact `lat`/`lng` and
  a street address from its Google Maps listing.
- Home shelf order: **New & hot** (9, chosen by Ashley), **La Güera's Picks**
  (4, wording approved by Ashley), Michelin, Essentials, Best Tacos, mood tags,
  colonias. A place shows on only one of the later shelves. El Silverio and Lalo
  are on both New & hot and Picks at Ashley's request.
- Michelin tags (19 places) were checked against Michelin's 2026 lists on
  2026-11-02. Baldío's Green Star is dated 2025.
- One place has a photo (El Bar). The other 284 show a pink initial tile.
- Deploys on every push to `main` that touches `web/**`
  (`.github/workflows/deploy-web.yml`, about one to two minutes).

## Important: `places.json` is now edited directly

The Python pipeline in the repo root (`build_site_data.py`, `apply_curation.py`,
`merge_enrichment.py`, `attach_photos.py`, `curation.json`) **no longer matches**
`places.json`. Pins, addresses, picks, featured order, sources and photos were
added directly to the JSON. **Do not re-run the pipeline; it would overwrite
that work.** Edit `places.json` by hand or with a small script, then run
`npm run qa:data`.

## Data model (per place)

`id, name, category, group, mapsUrl, neighborhood, address, hours, instagram,
vibe, lat, lng, priceTier, occasionTags, image, imageCredit, sources[],
unverifiedFields` plus the editorial fields:

- `hot`: shows the "Hot" stamp.
- `featuredOrder` + `featuredApprovalState` (`pending-ashley-review` or
  `approved`): put a place on the New & hot shelf. Set both together, numbered
  from 1 with no gaps.
- `pick: { text, approvedOn }`: Ashley's approved wording. Shows on cards and in
  the detail dialog with the "la güera" signature.
- `michelin: { year, level, note }`, `essential`.
- `sources[]`: `{ label, checkedOn, url?, note? }`. Add one for every fact you
  add or change.

`web/scripts/check-catalog.mjs` (`npm run qa:data`) enforces unique IDs,
required fields, contiguous featured order, pick text and date, and that photos
have credits. Run it, plus `npx tsc -b`, `npm run build` and `npm run lint`,
before every push.

## How work gets merged

Branch from `main`, open a PR, squash-merge. Keep commits free of private
details. Check the deploy run in GitHub Actions after merging.

## Getting exact pins

`web/scripts/gmaps-lookup.mjs` reads the coordinates and address that Google
Maps itself loads in a headless browser (see the header of that file). It matched
9 places with known coordinates to 0 m. Always compare the returned name and
address with the venue; two searches returned the wrong business and were
rejected by hand. OpenStreetMap/Nominatim covers venues poorly. Decoding
Google place IDs by hand was off by kilometers, so don't.

## Open work

**Needs Ashley**
- Photos for the 13 featured places (send screenshots; credit each venue).
  Ideally she also asks each venue for permission.
- Test on a real phone: map, saving to Mi lista, "Cómo llegar". Saved places
  do not sync and do not import into Google or Apple Maps. A promise of a
  phone-saveable list needs a real build and test first.
- Review the Essentials, Michelin and Tacos shelves.
- What Animacura, BAR-RICA, Cochilada and La Papaya Smoothie House are (no
  online trace found; they have no description).
- Instagram handles for places that lack one: confirm, don't guess (login wall).
  Candidates: El Vilsito, Tacos Charly, Los Cocuyos, El Jarocho, Los Consentidos
  del Barrio, Tacos del Valle.

**Agent can do**
- Closure and new-opening check across the catalog with dated sources.
- Direct Google Maps place URLs for places that only have a name-and-address
  search link.
- Add Michelin-listed places that aren't in the guide yet (Pujol, Esquina
  Común, Expendio de Maíz, Masala y Maíz, Máximo, Sud 777, and the Bib list)
  **only if Ashley wants them**.
- Link-preview image once the final domain is known.

**Domain (not done)**
`laguerasguide.com` was available on 2026-11-02; nothing is registered. When
Ashley registers it: set the custom domain in the repo's Pages settings, add the
DNS records, add `web/public/CNAME`, and change `base` in `web/vite.config.ts`
from `/cdmx/` to `/`. Do the code change in the same PR as the DNS going live, or
the current link breaks.

**Business side (private)**
The paid guide, the storefront choice and the Instagram launch are tracked in
the private OpenClaw repo. Keep the free site as is until Ashley decides the
free/paid boundary. `docs/OFFER_BLUEPRINT.md` has the earlier offer sketch.

## Gotchas

- Inline `font` and `display` styles override Tailwind classes; check before
  adding classes to existing inline-styled elements.
- Browser checks of a local preview must not go through the sandbox proxy.
- `pkill -f` with a pattern that appears in your own command kills the shell.
