import L from "leaflet";
import { CATEGORY_STYLE, BUCKET_STYLE } from "../data/categoryStyle";

const LUCIDE = "https://unpkg.com/lucide-static@0.460.0/icons";

const cache = new Map<string, L.DivIcon>();

/** Teardrop pin matching <MapPin>, rendered as static HTML for Leaflet's divIcon. */
export function pinIcon(category: string, selected: boolean): L.DivIcon {
  const key = category + (selected ? ":on" : ":off");
  const cached = cache.get(key);
  if (cached) return cached;

  const cat = CATEGORY_STYLE[category] ?? CATEGORY_STYLE.mexican;
  const c = BUCKET_STYLE[cat.bucket];
  const d = selected ? 44 : 34;
  const bg = selected ? "var(--vino-900)" : c.bg;
  const fg = selected ? c.bg : c.fg;
  const iconSize = selected ? 19 : 15;

  const html = `
    <div style="width:${d}px;height:${d}px;border-radius:50% 50% 50% 3px;transform:rotate(-45deg);
      background:${bg};border:2px solid var(--leche-0);box-shadow:var(--shadow-pin);
      display:flex;align-items:center;justify-content:center;">
      <span style="transform:rotate(45deg);display:inline-flex;width:${iconSize}px;height:${iconSize}px;
        background-color:${fg};
        -webkit-mask:url(${LUCIDE}/${cat.icon}.svg) center/contain no-repeat;
        mask:url(${LUCIDE}/${cat.icon}.svg) center/contain no-repeat;"></span>
    </div>`;

  const icon = L.divIcon({
    className: "guide-pin",
    html,
    iconSize: [d, d],
    iconAnchor: [d / 2, d],
    popupAnchor: [0, -d],
  });
  cache.set(key, icon);
  return icon;
}
