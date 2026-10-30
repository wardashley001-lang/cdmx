# Handoff for OpenClaw: La Güera's Guide offer

Written 2026-10-30. This repo is public, so this file contains no personal financial, legal, employer, or third-party details. Ashley holds a separate private file, `FULL_SESSION_RECORD.md`, with the full interview. Ask her for it if you need background, and do not commit it here.

## Goal

Turn La Güera's Guide (the Mexico City map site in this repo) into a **paid digital product** sold in volume at roughly **$15–$25**, marketed on Instagram, TikTok, and Pinterest. The product is delivered instantly and runs with minimal work from Ashley (a couple of hours a week, AI-assisted where possible).

The original brief was a $3K+ Facebook offer. Ashley decided that doesn't fit this product and isn't active on Facebook, so the target is now a low-price, high-volume guide.

## Current status

The strategy work is **done**. No product has been built or launched yet.

- Six-stage offer interview completed (story, skills, audience, offer design, pricing, positioning).
- Market research on comparable guide prices and call-to-action approaches completed.
- Offer blueprint written and merged to `main` (`docs/OFFER_BLUEPRINT.md`).
- Voice guide exists and is the source of truth for all copy (`VOICE.md`).
- Nothing is sold, gated, or published as a paid product. The full 276-place site is still public and free.

## Files changed

In `wardashley001-lang/cdmx`:

| File | State |
|---|---|
| `docs/OFFER_BLUEPRINT.md` | Added, merged to `main` in `85d3824` |
| `VOICE.md` | Pre-existing (`03173b4`), not modified |
| `CURATION_NOTES.md` | Pre-existing, not modified |
| `HANDOFF.md` | This file, added on branch `claude/openclaw-handoff` |

No site code (`web/`), data (`data/`, `places.json`), or workflows were changed.

In `wardashley001-lang/ubiquitous-octo-waffle`: a duplicate copy of `docs/OFFER_BLUEPRINT.md` on branch `claude/offer-blueprint` (commit `8bd285e`), open as draft PR #3 into `claude/google-maps-category-lists-8w3hfp`. Not merged, and not needed if you read `cdmx`.

## Branch / commit

- `cdmx` `main` at `85d3824` ("Add offer blueprint doc") is the latest merged state. The blueprint is there.
- This handoff is on `claude/openclaw-handoff` in `cdmx`, opened as a **draft PR and intentionally not merged**.
- Waffle repo: branch `claude/offer-blueprint` at `8bd285e`, draft PR #3, not merged.

## Decisions made

1. **Price:** $15–$25, not $3K+. Test $15 against $25.
2. **Format:** a digital download, not coaching or live events. Fully hands-off for Ashley.
3. **Brand:** "La Güera's Guide" (güera = blonde). Character: the blonde private-equity girl who moved to CDMX and always has the reservation. Dry, confident, a little bitchy, never mean.
4. **Platforms:** Instagram and TikTok first, Pinterest for evergreen search traffic. Facebook skipped for now.
5. **Free vs. paid:**
   - Free: Instagram content, a public map of about 20–25 top spots, and the "Hot ahorita" section.
   - Paid: 3–4 itineraries, the full list saveable to a phone (Google/Apple Maps list), insider notes (how to get in, what to order, when to go), and a first-timer kit. A monthly "new this month" drop of Instagram-only openings is a $25 tier.
6. **Delivery:** sold as a separate download (Gumroad, Payhip, or similar), **not** by locking the site. The site is static and `places.json` is downloadable, so locking it wouldn't hold.
7. **Call to action:** Instagram "Comment MAP and I'll send it" with a bio-link backup. TikTok bio link plus a pinned comment. Pinterest pins that link to the sales page. Use a separate tracking link per platform. The research behind this is mostly vendor claims, so treat it as a hypothesis to test.
8. **Copy rules:** follow `VOICE.md`. English first with a short fixed list of Spanish accents, no emoji, no adjective stacks, and never invent a place detail.

## What remains

1. **Get Ashley's inputs** (these block the writing):
   - About 10 places where she can honestly give a "how to get in" or "ask for this" note.
   - The two trips visiting friends ask for most.
   - Where she wants to sell (Gumroad, Payhip, Shopify, other).
   - Whether the monthly drop is built by hand or with an AI-assisted pipeline.
2. Draft the 3–4 itineraries in the `VOICE.md` voice.
3. Draft the sales page.
4. Build the saveable Google/Apple Maps list from the data in `data/`.
5. Cut the free preview map to about 20–25 spots.
6. Draft 5–10 hook posts, for example:
   - "Everyone's going to Pujol. Here's where I send my friends instead."
   - "Mexico City has a new restaurant every week. Half of them aren't on Google."
7. Set up per-platform tracking links and choose the sales platform.
8. Rewrite place notes (the `vibe` field) into the `VOICE.md` voice, **without adding facts that aren't in the source research**.

## Known issues

- **Unverified claims in the data** (from `CURATION_NOTES.md`). Fix or remove these before selling:
  - Aúna's "Michelin-starred" blurb: it isn't on the 2026 star list.
  - La Once Mil: the star is for the Lomas location, but the saved one is Roma Norte.
  - Siembra: Michelin lists it as Siembra Tortillería (Bib Gourmand).
  - Migrante and Taco Tasting Room: no confirmed 2026 distinction.
  - The Bib Gourmand list came from a third-party aggregator and should be spot-checked at guide.michelin.com.
- **Missing data:** no photos. The 18 places added from The Happening have no Maps links or exact lat/lng. Pins sit at neighborhood centers. Several places have no neighborhood, description, or tags (Cochilada, Rapsodia, La Papaya Smoothie House, Animacura, BAR-RICA, Amorino), and 25 have no vibe tags. Per-place prices were removed because they were placeholders.
- **Count mismatch:** `web/README.md` says 258 places, but `places.json` has 276.
- **Voice rewrite pending:** place notes are still the original researched copy, not yet in the first-person `VOICE.md` voice.
- **Price evidence is thin.** The comparable prices are listing prices, not sales data, and several competitor prices could not be confirmed.
- **Conversion numbers in the CTA research** come from tool vendors. No independent test was found.
- **Legal and tax:** Ashley should check immigration and tax implications of selling a business before launch. Don't give her specifics here; suggest she talk to a professional.

## Exact next step

Message Ashley and ask for the two blocking inputs: the roughly 10 places she can honestly write insider notes for, and the two trips visiting friends ask for most. Once she answers, draft the itineraries and the sales page in the `VOICE.md` voice, and do not invent any place detail she did not give you or that is not in the source data.
