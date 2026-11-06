# Instagram templates

Built from the brand guide (themes, fonts, patterns). Sources: `templates.html` (open in a browser; `data-t` = cover | closing | story, `data-text` = 1 shows sample text) and `build.js` (Playwright script that renders everything below).

| File | Size | Use |
|---|---|---|
| `1-carousel-cover-bg.png` / `-preview.png` | 1080 x 1350 | Carousel cover. Wine checker background and logo. Drop the photo (as shot, no filter) full-bleed behind, then add the venue name, colonia and one line in Ashley's words. |
| `2-carousel-closing-bg.png` / `-preview.png` | 1080 x 1350 | Last slide: save line, address, GUARDAR button. |
| `3-story-bg.png` / `-preview.png` | 1080 x 1920 | Story: arch photo frame, logo, CÓMO LLEGAR button. Keep text out of the top and bottom ~250 px. |
| `highlight-*.png` (6) | 1080 x 1920 | Highlight covers: Eat, Drinks, Coffee, Tacos, New and hot, Mapa. Icon only (Instagram shows the name underneath). |

`-bg.png` has no text, so add your own text on top. `-preview.png` shows the intended layout with sample text. The 9:16 safe area and the story size are Instagram conventions, not Ashley's rules.
In Canva: the same files are in the La Güera's Guide folder, as designs with editable text. Set fonts from the Brand Kit (Bodoni Moda headlines, Syne caps labels, Mrs Saint Delafield script).

## Carousel set (10 slides, 1080×1350)

`carousel-set/carousel-set.html` is the source; `carousel-set.pdf` is what gets imported into Canva (text stays editable, photo spots are swappable images); `preview-01.png` to `preview-10.png` are previews. Slides: 1 cover (photo + wine panel), 2 cover (arch on checker), 3 full photo with label, 4 photo with caption, 5 two photos, 6 what to order, 7 quote, 8 numbered list, 9 save + map, 10 starter guide promo. Photos go in as shot, no filter. Rebuild with `NODE_PATH=$(npm root -g) node brand/kit/templates/carousel-set/build.js`.
