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
3. **Photos:** only photos Ashley supplies (her own, or ones she pulls from a
   venue's Instagram and sends, as with El Bar). She decided on 2026-11-04 that
   no written venue permission is needed; use them with a credit line
   (`imageCredit`, e.g. "Photo: La Güera"). The catalog check fails if a photo
   has no credit. Agents must not scrape Instagram or save venue images
   themselves; it blocks logged-out access, and Ashley's own account is hers.
4. **Keep private material out of this repo:** interview records, voice notes,
   financial or legal details, internal tool paths.

## Current state (2026-11-02)

- 295 places in `web/src/data/places.json`; 285 have exact `lat`/`lng` and
  a street address from its Google Maps listing, and 10 Michelin additions have
  building-level OpenStreetMap pins.
- Home order, top to bottom: hero (search); **New & hot** (four tiles, "See all 9");
  **La Güera's Picks** (4, wording approved by Ashley); the "What are you in the
  mood for?" buttons (Eat, Drinks, Coffee & Sweets, Beyond Food, Tacos); colonia
  tiles; then "More from la güera" (placeholder cards matching OpenClaw's deliverables: free
  starter, the guide (itineraries and notes; the paid product), Instagram) and, when switched on, the email spot. All place discovery comes before
  the not-yet-live items. No Michelin, Essentials, Tacos or Cafés shelf on Home
  (Ashley, 2026-11-03). El Silverio and Lalo are on both New & hot and Picks at her
  request. The placeholder cards carry no status label (Ashley: wording would have
  to change at launch); make one a link by setting `href` on its entry in `MORE`
  in `Home.tsx` once she approves the destination. The Instagram card links to
  https://www.instagram.com/laguerasguide/ (Ashley asked for it, 2026-11-03). No price
  or live email form on Home until she says so. The Michelin tags, badges and the
  `/mapa?f=michelin` filter remain.
- Michelin tags (19 places) were checked against Michelin's 2026 lists on
  2026-11-02. Baldío's Green Star is dated 2025.
- Six places have photos (El Bar; El Silverio, Botánico, ARDA, Lalo and Bikini Pizza, each with more in its detail view). `docs/PHOTO_TODO.md` lists who still needs one, homepage places first. The rest show a pink initial tile. Ashley wants every photo in the app and on Instagram to share one look: use `brand/photo-grade/grade.py` on her originals (ask for original files, not screenshots, when possible).
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
- Photos for the other featured places (send screenshots or originals; credit
  each venue). No permission requests needed (Ashley, 2026-11-04).
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
- Closure checks beyond the featured places, Picks and Michelin additions: Ashley
  dropped them (2026-11-04). Don't run them.
- Direct Google Maps place URLs for places that only have a name-and-address
  search link (every record now has at least that fallback link).
- Add the remaining Michelin-listed places that aren't in the guide yet. Ashley
  said yes on 2026-11-02. 10 are added (Pujol, Esquina Común, Máximo, Expendio de
  Maíz, Raíz, Aleli Rooftop, Jowong, Caracol de Mar, Comedor Jacinta, Molino El
  Pujol) with building-level OpenStreetMap pins. These 10 are **held back**
  because only a street-level pin was available and Google Maps had started
  blocking automated lookups (do not work around that). Add each with an exact
  pin from a Google Maps share link, which Ashley can send, then confirm the
  Michelin page text and write a short sourced description:
  Pargot (Córdoba 212, Roma Norte), Tacos Los Alexis (Chiapas 46, Roma Norte),
  Comal Oculto (Gob. Protasio Tagle 66A, San Miguel Chapultepec), Fugaz (Orizaba
  3B, Roma Norte), Filigrana (Av. Veracruz 62, Roma Norte), Galea (Sinaloa 67,
  Roma Norte), Galanga Thai House (Monterrey 204, Roma Norte), Masala y Maíz
  (Artículo 123 #116, Centro), Sud 777 (Blvd. de la Luz 777, Pedregal), Pink
  Rambo (Cedro 66, Santa María la Ribera). Also swap the 10 added OSM pins for
  Google Maps ones when possible.
- Link-preview image once the final domain is known.
- Brand assets (Instagram profile picture options) are in `brand/`.

**Email signup spot (built, switched off)**
`EmailSpot` in `web/src/pages/Home.tsx` ("Get the starter": email field plus a send
button) renders only when `VITE_EMAIL_FORM_ACTION` is set at build time, so the live
site shows nothing and collects nothing. It posts a plain HTML form to the provider's
form URL. Before switching it on, Ashley must approve: the provider (OpenClaw's
preflight leaned to Kit's free tier), creating that account, the consent and privacy
wording (the lines in the component are drafts), the sender name, and what people
receive (the starter PDF). Then set the form URL as the repository variable `VITE_EMAIL_FORM_ACTION` (GitHub:
Settings > Secrets and variables > Actions > Variables; the deploy workflow already
passes it to the build) and re-run the deploy. The Free starter card then scrolls to
the form. Test on a real iPhone:
form, confirmation email, PDF, unsubscribe. Don't collect emails any other way.

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
