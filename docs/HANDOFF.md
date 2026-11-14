# La Güera's Guide: working notes for the next agent

Last updated 2026-11-13. This file is public, so it holds no private details.
Private planning for the paid guide, the storefront and Instagram stays in the
private OpenClaw repo, not here.

Live site: https://laguerasguide.com (custom domain on GitHub Pages; DNS on Cloudflare)
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

## Starter download page (2026-11-05)

- `/#/your-starter` is where people land after confirming their email in Kit (set Kit's "After confirming redirect to" to `https://laguerasguide.com/#/your-starter`). It is not linked from the site and carries a `noindex` tag. The PDF is a normal file at `web/public/la-gueras-guide-mexico-city-starter.pdf`, so anyone with the link can download it.
- To update the starter, replace that PDF file (keep the name) and the two preview images `web/public/starter-cover.jpg` and `starter-silverio.jpg` if the pages changed. Source: the private OpenClaw repo, `la-gueras-guide/deliverables/2026-11-06-free-starter-v6/` (the only starter version kept; older ones were deleted 2026-11-06).
- **Starter v6 (2026-11-06):** El Silverio's page uses Ashley's unedited seafood-tower original and Botánico's page uses her unedited tuna-tostada original, and Lalo's page uses her unedited pasta (cavatelli) original (no filter). La Once Mil now also uses her unedited taco original, so all four starter photos are unedited. Lead photos on the map and place cards for El Silverio, Botánico, Lalo and La Once Mil are also her unedited originals (`*-original.jpg`; older edited shots remain in each gallery). Note: Lalo's approved quote mentions the prosciutto while the photo is the pasta. The signup and download pages show the El Silverio page (`starter-silverio.jpg`) as the second phone card. Map cards (pin on a small map) were tried on each pick page and removed the same day because Ashley didn't like the look; the map images are parked in `assets/maps/` in the OpenClaw source folder.
- Ashley decided 2026-11-06: no edited photos (no filter); see `brand/README.md`.
- `/#/starter` is the signup landing page; it stays hidden until `VITE_EMAIL_FORM_ACTION` is set.

## Email images (2026-11-05)

`web/public/email/` holds the images used in Kit's confirmation email (header banner, checker strip, "xo, la güera" signature). Emails load images by absolute URL (`https://laguerasguide.com/email/...`), so do not rename or move these files without updating the email in Kit.

## Signup flow (2026-11-05)

1. `/#/starter` or the Home box: visitor types their email (form posts to Kit, same tab).
2. Kit redirects to `/#/check-your-email` (Kit form > Form Settings > General > "Redirect to an external page": `https://laguerasguide.com/#/check-your-email`). Not linked, noindex.
3. Kit emails the confirmation (custom HTML in Kit, images in `web/public/email/`). Visitor taps confirm.
4. Kit redirects to `/#/your-starter` (Form Settings > Confirmation email > URL: `https://laguerasguide.com/#/your-starter`), where the PDF downloads.
All of this stays hidden until `VITE_EMAIL_FORM_ACTION` is set and the privacy page is live.

## Privacy page and signup gate (2026-11-05)

- `/#/privacy` is built from `web/src/lib/privacy.ts` (name, country, contact email, updated date). Ashley chose **not** to publish a mailing address; do not add one. Update the date there whenever the page text changes.
- The signup (Home box, `/#/starter`) only renders when `PRIVACY_READY` is true, so nothing collects an email unless the privacy page exists. The Kit form address is a constant in `web/src/lib/email.ts` (public, not a secret; `VITE_EMAIL_FORM_ACTION` overrides it).
- Emails need a physical address in the footer. Kit's shared address is used; that is a Kit setting, not part of this site.
- The page text is a plain-language draft built from OpenClaw's `PRIVACY_CONSENT_TERMS_DRAFT.md`. It is not legal advice. Open question for Ashley: Mexican privacy law (LFPDPPP) may expect a privacy notice to name the controller's address; get a professional's view before promoting the list widely.
- **Quotes (2026-11-06):** Ashley asked to improve the four starter picks' quotes (La Once Mil, Botánico, Lalo, El Silverio); tightened in her voice, no new facts. Lalo's prosciutto line dropped to match the pasta photo. Same text in the site's `pick.text` and the starter PDF.
- **Book a table (2026-11-06):** new optional `reserveUrl` on a place shows a pink "Book a table" button in the place card (SpotDetail) and a "Book a table" button on the starter PDF pick pages. Set for Botánico and Lalo (OpenTable) and El Silverio (CoverManager; URL as Ashley gave it, spelled "el-siverio"). La Once Mil takes no reservations, so none.
- **Botánico quote (2026-11-06):** rewritten with Ashley's notes (botanical-garden feel, axolotl pond, tuna tostada her favorite in the city, caramelos rellenos de cebolla caramelizada, rib eye burger). Site `pick.text` + starter PDF (smaller quote size on that page so it fits).
- **Lalo quote (2026-11-06):** rewritten with Ashley's notes (newest restaurant from Chef Eduardo García of Máximo, start with the prosciutto he slices fresh in the middle of the room, best tiramisu in the city). Site `pick.text` + starter PDF (smaller quote size on that page). Photo is still the pasta.
- **Best-of callouts (2026-11-06):** optional `bestOf` on a place shows a pink pill "✦ La Güera's pick · Best …" above her quote (place card + starter PDF). Set: La Once Mil = Best tacos, Botánico = Best tuna tostada, Lalo = Best tiramisu, El Silverio = Best steak. Starter pick pages: photo trimmed to 88mm to fit the pill; `starter-silverio.jpg` re-rendered from the new El Silverio page.
- **El Silverio quote (2026-11-06):** rewritten with Ashley's notes (seafood tower + clams, bread to dip in the clam juice, 400-gram Wagyu steak to share). She wrote "the Waegu cross"; I wrote "400-gram Wagyu" and need her to confirm the exact menu name. Site `pick.text` + starter PDF (smaller quote size on that page).
- **El Silverio quote, Gus (2026-11-06):** added "Say hello to my friend and favorite sommelier there, Gus, and tell him Ashley sent you." Site + starter PDF (quote size 3.4mm on that page).
- **Pick order (2026-11-06):** starter PDF pick pages are now El Silverio (1/4), Botánico, Lalo, La Once Mil last. Home 'La Güera's Picks' shelf uses the same order (hard-coded ORDER in Home.tsx). `starter-silverio.jpg` re-rendered from PDF page 2 (El Silverio).
- **El Silverio steak name (2026-11-06):** menu says "ENTRECOT (CRUZA WAGYU HARAGI) 400 g" ($1500); quote now says "the entrecot, the 400-gram Wagyu Haragi cross".
- **La Once Mil quote (2026-11-06):** rewritten with Ashley's notes (ribeye Chairman's Reserve taco "estilo costra", melts in your mouth, muy rico, no reservations but put your name on the list, Roma Norte near Colima, beer at the door, Lomas Michelin star). "costra" (cheese crust) is my reading of her "Costa style" and should be confirmed; address line still says Orizaba 83 while she said Colima. Site + starter PDF.

- **Summary for agents (2026-11-06):** full write-up of the starter/picks work, final quotes and open questions is in the OpenClawBabygirl repo at `la-gueras-guide/UPDATE_2026-11-06_starter-and-picks.md`. Pick order: El Silverio, Botánico, Lalo, La Once Mil. Open: La Once Mil "estilo costra" wording and Colima vs Orizaba address; El Silverio CoverManager link check; Lalo photo vs prosciutto lead.
- **Confirmed by Ashley (2026-11-06):** La Once Mil "estilo costra" is correct and the address is Orizaba 83. Open now: El Silverio CoverManager link check; Lalo photo vs prosciutto lead.
- **Home New & hot shelf (2026-11-06):** now shows Bikini Pizza, El Bar, La Belle Epoque, Astronomic (featuredOrder 1-4) so it no longer repeats La Güera's Picks; El Silverio, Lalo, La Bellezza, Cassette, Ranma follow (5-9, visible via See all). Astronomic lead photo is the restaurant's cocktail photo (`wine-astronomic-original.jpg`, 4:5 crop, credit "Photo: Astronomic"); old photo kept in its gallery. Ranma still has no photo: Ashley sent two restaurant photos but they did not save; waiting for a resend.
- **New stamp (2026-11-06):** optional `isNew` on a place shows a light-blue "New" stamp/pill instead of "Hot" (SpotCard, SpotDetail; priority pick > new > hot). Set on Bikini Pizza, El Bar, La Belle Epoque, Astronomic, Cassette. Map filter row now has a "New & hot" button (flag `hot`, the 9 featured places) next to All. Ranma's photo is still missing (Ashley's two Ranma photos did not save when sent mid-task).
- **Map category row (2026-11-06):** choosing Eat/Drinks/etc. on the map now shows that group's category buttons (Tacos, Seafood, Bars…, with counts) in a second row; tap one to filter, tap again to clear. Also shows after tapping a category button on Home. Mapa.tsx `groupCats`.
- **Map list order (2026-11-06):** the map's list now sorts La Güera's Picks first (PICK_ORDER), then New & hot (featuredOrder), then other places that have photos, then the rest (`mapListRank` in lib/data.ts); applies under every filter. `PICK_ORDER` now lives in lib/data.ts and is shared with the Home picks shelf.
- **Ranma photo (2026-11-06):** lead photo is the restaurant's open-kitchen photo (`japanese-ranma.jpg`, 4:5, credit "Photo: Ranma"). Ashley also sent a booth/interior photo that never saved; ask if she wants it in a gallery. She confirmed the El Silverio CoverManager booking link works.
- **Ranma off the New & hot list (2026-11-07):** Ashley said Ranma is not that new, so its `hot`, `featuredOrder` and `featuredApprovalState` were removed. It stays on the map with its photo and no stamp. New & hot is now 8 places.
- **Baby Bar on New & hot (2026-11-07):** Baby Bar was already on the map; now it has Ashley's martini photo (`bars-baby-bar.jpg`, 4:5 crop, credit "Photo: Baby Bar (@babybar____)"), the "Hot" stamp, and featuredOrder 5 (El Silverio, Lalo, La Bellezza, Cassette each moved down one, so New & hot is now 9). Added "No reservations" from its bio. Hours are not shown: the bio's day letters (M J V S L / D) are ambiguous. It uses Hot, not New, because we have no source saying when it opened. The homepage shelf still shows the first four (Bikini Pizza, El Bar, La Belle Epoque, Astronomic).
- **El Silverio marked new (2026-11-12):** `isNew: true` set on El Silverio (Ashley confirmed it is new). It stays in La Güera's Picks on the homepage; the pick stamp takes priority over New, so the card looks the same. Data-only change. Baby Bar's address confirmed correct by Ashley (same building as Chopsticks, C. Versalles 113).
- **Loup Bar added (2026-11-13):** new wine bar in Roma Norte (`wine-loup-bar`, Tonalá 23, @loupwinebar, since 2017), added at Ashley's request from her Instagram screenshot. Sources: her screenshot, En Primeur Club, OpenTable, OSM geocode. Pin is building-level (`unverifiedFields: Exact map pin`); no hours (sources disagree); no photo yet; no Hot/New/Pick flags.
- **Mesa added (2026-11-14, draft PR):** café/cocina/vino in San Miguel Chapultepec (`cafe-mesa`, Protasio Tagle 132), added at Ashley's request from her Instagram screenshot. Photo from Mesa's Instagram post, supplied by Ashley, credited "Photo: Mesa". `isNew` only: not on the homepage New & hot shelf (no `featuredOrder`), no pick. Hours copied from the Instagram bio (Tue–Fri, Sat–Sun, two blocks each). Pin is street-level (`unverifiedFields`). Needs Ashley's approval before merge.
