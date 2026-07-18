import { useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { CATEGORY_ORDER, DATA, resolveCoords } from "../lib/data";
import { TOKEN_VAR } from "../components/CategoryTile";
import type { ColorToken } from "../types";
import { instagramUrl, mapsSearchUrl } from "../lib/data";
import "leaflet/dist/leaflet.css";

const CDMX_CENTER: [number, number] = [19.4126, -99.1670];

export function MapPage() {
  const [active, setActive] = useState<string | null>(null);

  const pins = useMemo(() => {
    const counters: Record<string, number> = {};
    return DATA.places
      .filter((p) => !active || p.category === active)
      .map((p) => {
        counters[p.neighborhood ?? p.id] = (counters[p.neighborhood ?? p.id] ?? 0) + 1;
        const coords = resolveCoords(p, counters[p.neighborhood ?? p.id]);
        return coords ? { place: p, coords } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [active]);

  const missing = (active
    ? DATA.places.filter((p) => p.category === active)
    : DATA.places
  ).length - pins.length;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
        <div>
          <h1 className="font-display font-900 text-3xl sm:text-4xl tracking-tight" style={{ fontStretch: "expanded" }}>
            The Map
          </h1>
          <p className="mt-1 text-[13px]" style={{ color: "var(--muted)" }}>
            {pins.length} of {active ? DATA.places.filter((p) => p.category === active).length : DATA.places.length} places plotted
            {missing > 0 && ` · ${missing} without a known neighborhood yet`}
          </p>
        </div>
      </div>

      <div className="mb-4 p-3 text-[12.5px] leading-relaxed" style={{ background: "var(--ochre-ink)", color: "var(--text)", border: "1px solid var(--border)" }}>
        <strong className="font-semibold">Pins are approximate</strong> — clustered near each place's neighborhood
        until exact coordinates are imported from a GeoJSON Takeout export.
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <button
          onClick={() => setActive(null)}
          className="px-3 py-1.5 text-[12px] font-semibold tracking-wide font-mono uppercase transition-opacity"
          style={{
            background: active === null ? "var(--text)" : "var(--surface-2)",
            color: active === null ? "var(--bg)" : "var(--text)",
          }}
        >
          All
        </button>
        {CATEGORY_ORDER.map((id) => {
          const meta = DATA.categories[id];
          const token = meta.token as ColorToken;
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(isActive ? null : id)}
              className="px-3 py-1.5 text-[12px] font-semibold tracking-wide font-mono uppercase transition-opacity"
              style={{
                background: isActive ? TOKEN_VAR[token] : "var(--surface-2)",
                color: isActive ? "white" : "var(--text)",
                opacity: isActive ? 1 : 0.75,
              }}
            >
              {meta.label}
            </button>
          );
        })}
      </div>

      <div className="h-[60vh] sm:h-[70vh] w-full overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <MapContainer center={CDMX_CENTER} zoom={13} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {pins.map(({ place, coords }) => {
            const token = DATA.categories[place.category].token as ColorToken;
            return (
              <CircleMarker
                key={place.id}
                center={[coords.lat, coords.lng]}
                radius={7}
                pathOptions={{
                  color: "white",
                  weight: 2,
                  fillColor: TOKEN_VAR[token].startsWith("var")
                    ? getComputedColor(TOKEN_VAR[token])
                    : TOKEN_VAR[token],
                  fillOpacity: 0.9,
                }}
              >
                <Popup>
                  <div className="font-display font-700 text-[14px]">{place.name}</div>
                  {place.neighborhood && (
                    <div className="font-mono text-[10px] uppercase tracking-wide opacity-70 mt-0.5">
                      {place.neighborhood}
                      {coords.approximate ? " · approx." : ""}
                    </div>
                  )}
                  {place.vibe && <p className="text-[12px] mt-1.5">{place.vibe}</p>}
                  <div className="mt-2 flex gap-2 text-[11px] font-semibold">
                    <a href={place.mapsUrl || mapsSearchUrl(place.name)} target="_blank" rel="noopener noreferrer">
                      Maps ↗
                    </a>
                    {place.instagram && (
                      <a href={instagramUrl(place.instagram)} target="_blank" rel="noopener noreferrer">
                        Instagram ↗
                      </a>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

function getComputedColor(cssVar: string): string {
  if (typeof window === "undefined") return "#E0227A";
  const match = cssVar.match(/var\((--[\w-]+)\)/);
  if (!match) return cssVar;
  return getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim() || "#E0227A";
}
