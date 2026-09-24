# Place photos

Drop a photo here named after the place's `id` (see `web/src/data/places.json`),
e.g. `contramar` → `seafood-contramar.jpg`, or just the slugified name
(`contramar.jpg`). Then run:

    python scripts/attach_photos.py

That fills each matching place's `image` field. Places without a photo show a
clean pink-initial tile, so you can add photos gradually.

Use photos you took or have permission to use. Aim for landscape, ~1200px wide.
