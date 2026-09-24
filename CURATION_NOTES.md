# Guía CDMX redesign: what to double-check

## How places were sorted
Every place lives in exactly one section. Priority: Michelin > Hot > Essentials > its everyday group.

- **Hot Right Now (15):** on your New_Places_2026 or Hotlist lists AND tagged "trendy" or described as new/first/newest. Left out on purpose: Les Moustaches, Arturo's, El Sella Bar, Au Pied de Cochon (long-standing classics, not new), and the July 2025 Hotbook (over a year old). Michelin-listed places live in the Michelin section.
- **Michelin 2026 (11):** matched against the guide announced May 20, 2026. Stars are from Michelin's own announcement. The Bib Gourmand list came from a third-party aggregator of the 2026 selection, so spot-check those at guide.michelin.com.
- **Essentials (14):** institutions and top-ranked bars, pulled from your own descriptions (since 1935/1963/1969/1993, "one of the last real bars," 50 Best rankings). This is my pick, so swap freely.
- **Everyday groups (what's left on the page):** Eat 82 · Drinks 53 · Coffee & Sweets 28 · Beyond Food 47.

## Best Tacos (16)
Your 8 saved taquerías plus 8 Bib Gourmand taquerías from Michelin's 2026 selection that you hadn't saved: El Vilsito, Los Cocuyos, La 89, Los Consentidos del Barrio, Tacos Charly, Tacos del Valle (Roma Norte), Taquería El Jarocho, Taquería Los Milanesos. The blurbs are my paraphrases of a third-party summary, and they have no Instagram handle or Google Maps link yet (the Maps button falls back to a search). Add them to `curation.json` under `additions`, or delete any you don't want. Taquerías keep their Michelin badge but live in this section, not the Michelin one. Taquería Los Milanesos has no neighborhood yet.

## Please verify
1. **Aúna** — your blurb says "Michelin-starred," but it isn't on the 2026 Mexico City star list (Pujol, Quintonil, Em, Esquina Común, Expendio de Maíz, Gaba, La Once Mil, Masala y Maíz, Máximo, Rosetta, Sud 777). I did not tag it Michelin. Check the blurb.
2. **La Once Mil** — Michelin's star is for the Lomas de Chapultepec location. You saved the Roma Norte one. Tagged with a note on the card.
3. **Siembra Taqueria** — Michelin lists it as Siembra Tortillería (Bib Gourmand). Tagged Bib with a note.
4. **Migrante** ("Michelin-listed") and **Taco Tasting Room** — could not confirm a 2026 distinction, so not tagged.
5. **Missing info:** Cochilada, Rapsodia, La Papaya Smoothie House, Animacura, BAR-RICA have no neighborhood, description, or tags. Amorino has no neighborhood. 25 places have no vibe tags, so they disappear when a filter chip is on.

## Categories fixed (cross-group mistakes)
- Sights split into **Sights** and **Day Trips** (Teotihuacán's La Gruta, Tepotzotlán, Nido de Quetzalcoatl, Parque Quetzalcoatl).
- **Tacos** is now its own category (8 places, pulled out of Mexican).
- The **Dinner** category was dissolved (it was an occasion, not a cuisine). Its places went to Contemporary, Bars, or Japanese & Asian.
- Restaurants hiding in other buckets: LagoAlgo, Maleza, PLONK, Fónico, Asador Nerón, Travieso Travieso, Viamonte, Botánico.
- Brunch places filed as cafés/bakeries/stores/wine bars: Mendl, Alma Mia, Cafe Trucha, Farmacia Internacional, Pisca.
- Coffee places filed as "Healthy": Blend Station, CounterCulture Club, Joe & The Juice.
- Others: Café Drama (karaoke club) → Nightlife; Librería Valladolid (speakeasy) → Bars; Despacho Margarita → Bars; Fournier Rousseau → Bakery; Smart Food Pescado Sustentable (fish market) → Shops & Markets; Alae's Art Room (pole studio) → Beauty & Wellness; sona listening space → Sights; Boogie's Pizza → Italian & Pizza.

## Price tags removed
The old $–$$$$ values were a per-category default from the build script, not researched per place. Set `"dropPlaceholderPrices": false` in curation.json to bring them back.

## Michelin places you haven't saved yet
Stars: Pujol (2★), Esquina Común, Expendio de Maíz, Masala y Maíz, Máximo, Sud 777.
Bib Gourmand includes Fugaz (next door to your Fantasma), Galea, Filigrana, Raíz, Pargot, Jowong, Aleli Rooftop, Caracol de Mar, Comal Oculto, Comedor Jacinta, plus taquerías El Vilsito, Los Cocuyos, La 89, Tacos Charly, Tacos del Valle, Taquería El Jarocho, Los Milanesos.

## Photos
None included. Add your own to `web/public/photos/` and run `python scripts/attach_photos.py`. Places without a photo show a pink-initial tile.

## Added from The Happening (September 2026)
18 new places pulled from three thehappening.com roundups (new hotspots for July/August/September 2026, plus a sushi-specific and an "oriental food" roundup), all tagged `hot`: Torobi by Kazu Kumoto, Max, Itzu Prado Sur, Rekō Mx, Tori, Maison Frite, Café Tim, Tatsumi, Siembra Terraza, Kari Kari, Chalino Chino Coyoacán, Fame Pizza, Club Sándwich, Myka Parque Duraznos, Café Cruda, Taller de Grassa, Payna, Crumbl. Six other places from those same articles (El Mekong, Asaderos Orozco, Bar Amici, Pujolitto, Chopsticks, Futari) were already in the guide, so weren't re-added — Chopsticks did get its Instagram handle filled in from the article, though. None of the 18 have a Google Maps link yet (the Maps button falls back to a search) or exact lat/lng, since the articles only gave street addresses, not place IDs.
