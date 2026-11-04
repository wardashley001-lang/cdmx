# Brand assets

**Brand kit (logos, colors, fonts, profile pictures) is in `kit/`** with its own README, including Canva setup steps. **Then read `BRAND_GUIDE.pdf`** (source: `BRAND_GUIDE.html`): the one-stop brand guide covering the name, logo, color, type, photos, voice and Instagram. Items marked "Ashley to confirm" in it are my reading of how the app uses things, not rules she set.

## Wordmark

The logo is **LA GÜERA’S** in wide caps with **guide** in script underneath, right-aligned (decided with Ashley, 2026-11-03). The full name is always "La Güera's Guide". Live in `web/src/components/ds/Wordmark.tsx`. Use the typographic apostrophe (’) in the caps. In the script font the apostrophe looks detached, so don't set "güera's" in script; keep the possessive in the caps line.

## Instagram profile pictures (`instagram/`)

- `la-guera-guide-profile-dark.png` and `la-guera-guide-profile-light.png`: 1080×1080 profile picture options showing the wordmark (updated 2026-11-03 for the new name). Instagram crops to a circle; the wordmark sits well inside it.
- `profile-dark.html` and `profile-light.html`: the source for each. Open one in a browser at 1080×1080 and screenshot it to re-export. They use the app's fonts from `web/src/assets/fonts/` and its colors.

Not yet chosen or uploaded. Setting the picture is Ashley's call.

## Photo grade (`photo-grade/`)

`grade.py` gives every photo the same look (warm, slightly contrasty, deeper
shadows, a touch more color, fine film grain, a light vignette) and crops to 4:5
at 1080×1350, the size used by both the app cards and Instagram posts. Run it on
photos Ashley supplies or approves, then record the source and a credit line in
`places.json`. Usage is in the script header. The first set was El Silverio's five
photos (2026-11-03). If Ashley wants the look warmer, cooler, more or less grainy,
change the numbers at the top of `grade()` and re-run on the originals.
