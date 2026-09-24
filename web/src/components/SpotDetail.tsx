import { Dialog } from "./ds/Dialog";
import { Badge } from "./ds/Badge";
import { Button } from "./ds/Button";
import { Icon } from "./ds/Icon";
import { CATEGORY_STYLE, BUCKET_STYLE } from "../data/categoryStyle";
import { instagramUrl, mapsSearchUrl, photoUrl } from "../lib/data";
import type { Michelin, Place } from "../types";
import { useSaved } from "../lib/useSaved";
import { useToast } from "../lib/ToastProvider";

const MICHELIN_LABEL: Record<Michelin["level"], string> = {
  "two-star": "Michelin · 2 Stars",
  "one-star": "Michelin · 1 Star",
  bib: "Michelin · Bib Gourmand",
  "green-star": "Michelin · Green Star",
};

export function SpotDetail({ spot, onClose, mobile }: { spot: Place | null; onClose: () => void; mobile?: boolean }) {
  const { isSaved, toggle } = useSaved();
  const showToast = useToast();
  if (!spot) return null;

  const cat = CATEGORY_STYLE[spot.category];
  const c = BUCKET_STYLE[cat.bucket];
  const saved = isSaved(spot.id);
  const gmaps = spot.mapsUrl || mapsSearchUrl(spot.name);
  const photo = photoUrl(spot);
  const badge = spot.hot ? "hot" : spot.essential ? "pick" : undefined;

  function onToggle() {
    toggle(spot!.id);
    showToast(saved ? "Removed. Their loss." : "Saved. Good taste.", saved ? "heart-off" : "heart");
  }

  return (
    <Dialog open onClose={onClose} variant={mobile ? "sheet" : "modal"} width={600} style={{ padding: mobile ? "10px 20px 28px" : 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "220px 1fr" }}>
        <div
          style={{
            position: "relative",
            minHeight: mobile ? 180 : "100%",
            borderRadius: mobile ? 4 : "8px 0 0 8px",
            background: photo
              ? `url(${photo}) center/cover`
              : `conic-gradient(rgba(42,7,16,.16) 25%,transparent 0 50%,rgba(42,7,16,.16) 0 75%,transparent 0) 0 0/36px 36px,${c.bg}`,
          }}
        >
          {badge && <Badge variant={badge} shape="stamp" style={{ position: "absolute", bottom: 14, left: 14 }} />}
        </div>
        <div style={{ padding: mobile ? "20px 0 0" : "32px 32px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {spot.neighborhood && (
              <span style={{ fontFamily: "var(--font-caps)", fontWeight: 700, fontSize: 10, letterSpacing: ".2em", color: "var(--text-2)" }}>
                {spot.neighborhood.toUpperCase()}
              </span>
            )}
            {spot.priceTier && <Badge>{spot.priceTier}</Badge>}
            {spot.michelin && <Badge variant="ink">{MICHELIN_LABEL[spot.michelin.level]}</Badge>}
          </div>
          <h2 style={{ margin: "10px 0 16px", font: `400 ${mobile ? 40 : 48}px/.95 var(--font-serif)`, letterSpacing: "-.02em", paddingRight: mobile ? 0 : 36 }}>
            {spot.name}
          </h2>
          {spot.vibe && <p style={{ margin: 0, font: "italic 400 19px/1.4 var(--font-serif)", color: "var(--vino-700)" }}>&ldquo;{spot.vibe}&rdquo;</p>}
          <div style={{ font: "400 30px/1 var(--font-script)", color: "var(--rosa-500)", margin: "6px 0 0 60%", transform: "rotate(-4deg)" }}>la güera</div>
          {spot.michelin?.note && (
            <div style={{ marginTop: 16, font: "400 13px/1.5 var(--font-mono)", color: "var(--text-3)" }}>{spot.michelin.note}</div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
            <Button icon="navigation" href={gmaps} target="_blank" rel="noopener" style={{ flex: mobile ? 1 : "none" }}>
              Cómo llegar
            </Button>
            {spot.instagram && (
              <Button variant="secondary" icon="instagram" href={instagramUrl(spot.instagram)} target="_blank" rel="noopener" style={{ flex: mobile ? 1 : "none" }}>
                Instagram
              </Button>
            )}
            <Button variant={saved ? "pink" : "secondary"} icon="heart" onClick={onToggle} style={{ flex: mobile ? 1 : "none" }}>
              {saved ? "Guardado" : "Guardar"}
            </Button>
          </div>
          {spot.occasionTags.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 18 }}>
              {spot.occasionTags.map((t) => (
                <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
                  <Icon name="sparkle" size={11} />
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
