# Brand assets

**Current version: brand guide v2 (14 pages, 2026-11-04).** There is only one current guide. `BRAND_GUIDE.pdf` here is the official copy, with `BRAND_GUIDE.html` as its source. `kit/BRAND_GUIDE.pdf` is an identical copy for the kit download, and `kit/guide-pages/` has the same 14 pages as images. Older brand branches (9-page guide, early kit, templates) were all merged into `main` and are superseded by this version; nothing from them is missing here.

**Brand kit (logos, colors, fonts, profile pictures) is in `kit/`** with its own README, including Canva setup steps. **Then read `BRAND_GUIDE.pdf`** (source: `BRAND_GUIDE.html`): the one-stop brand guide covering the name, logo, color, type, photos, voice and Instagram. Items marked "Ashley to confirm" in it are my reading of how the app uses things, not rules she set.

## Wordmark

The logo is **LA GÜERA’S** in wide caps with **guide** in script underneath, right-aligned (decided with Ashley, 2026-11-03). The full name is always "La Güera's Guide". Live in `web/src/components/ds/Wordmark.tsx`. Use the typographic apostrophe (’) in the caps. In the script font the apostrophe looks detached, so don't set "güera's" in script; keep the possessive in the caps line.

## Instagram profile pictures (`instagram/`)

- `la-guera-guide-profile-dark.png` and `la-guera-guide-profile-light.png`: 1080×1080 profile picture options showing the wordmark (updated 2026-11-03 for the new name). Instagram crops to a circle; the wordmark sits well inside it.
- `profile-dark.html` and `profile-light.html`: the source for each. Open one in a browser at 1080×1080 and screenshot it to re-export. They use the app's fonts from `web/src/assets/fonts/` and its colors.

Not yet chosen or uploaded. Setting the picture is Ashley's call.

## Photos: no filter (`photo-grade/` is retired)

Ashley does not want edited photos (decided 2026-11-06). Photos go in the app and on Instagram as she shot them: no color grade, no film grain, no vignette. The only edit is cropping to 4:5 (1080×1350) so cards and posts line up. `photo-grade/grade.py` is kept for history only; do not run it on new photos. Photos already on the site that were graded before this decision should be replaced with her originals when she sends them (see `docs/PHOTO_TODO.md`).
