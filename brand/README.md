# Brand assets

## Instagram profile pictures (`instagram/`)

- `la-guera-guide-profile-dark.png` and `la-guera-guide-profile-light.png`:
  1080×1080 profile picture options (made 2026-11-02). Instagram crops profile
  pictures to a circle; the lettering sits well inside it.
- `profile-dark.html` and `profile-light.html`: the source for each. Open one in
  a browser at 1080×1080 and screenshot it to re-export. They use the app's own
  fonts from `web/src/assets/fonts/` and its colors (oxblood `#4A0B18`, rosa
  `#E0368C` / `#C81F72`, blush `#FBE4EA`).

Not yet chosen or uploaded. Setting the picture is Ashley's call once the
Instagram account exists.

## Photo grade (`photo-grade/`)

`grade.py` gives every photo the same look (warm, slightly contrasty, deeper
shadows, a touch more color, fine film grain, a light vignette) and crops to 4:5
at 1080×1350, the size used by both the app cards and Instagram posts. Run it on
photos Ashley supplies or approves, then record the source and a credit line in
`places.json`. Usage is in the script header. The first set was El Silverio's five
photos (2026-11-03). If Ashley wants the look warmer, cooler, more or less grainy,
change the numbers at the top of `grade()` and re-run on the originals.
