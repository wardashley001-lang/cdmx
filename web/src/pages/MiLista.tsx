import { useState } from "react";
import { SpotCard } from "../components/ds/SpotCard";
import { Button } from "../components/ds/Button";
import { SpotDetail } from "../components/SpotDetail";
import { DATA, photoUrl } from "../lib/data";
import { useSaved } from "../lib/useSaved";
import { useToast } from "../lib/ToastProvider";
import type { Place } from "../types";

export function MiLista() {
  const { saved, toggle } = useSaved();
  const showToast = useToast();
  const [spot, setSpot] = useState<Place | null>(null);
  const list = DATA.places.filter((p) => saved.includes(p.id));

  function onToggle(p: Place) {
    const wasSaved = saved.includes(p.id);
    toggle(p.id);
    showToast(wasSaved ? "Removed. Their loss." : "Saved. Good taste.", wasSaved ? "heart-off" : "heart");
  }

  return (
    <main style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "56px 20px 120px", minHeight: "70vh" }}>
      <div style={{ position: "relative", marginBottom: 48 }}>
        <div style={{ fontFamily: "var(--font-caps)", fontWeight: 700, fontSize: 10, letterSpacing: ".24em", color: "var(--rosa-600)" }}>
          {list.length} {list.length === 1 ? "SPOT" : "SPOTS"} SAVED
        </div>
        <h1 className="text-[60px] sm:text-[96px]" style={{ margin: "10px 0 0", fontFamily: "var(--font-serif)", fontWeight: 400, lineHeight: 0.9, letterSpacing: "-.03em" }}>
          Mi <i style={{ color: "var(--rosa-500)" }}>lista</i>
        </h1>
        <div className="hidden sm:block" style={{ position: "absolute", left: 250, top: 70, font: "400 64px/1 var(--font-script)", color: "var(--rosa-400)", transform: "rotate(-5deg)" }}>
          the good ones
        </div>
      </div>

      {list.length === 0 ? (
        <div style={{ background: "var(--vino-800)", borderRadius: 4, padding: 56, textAlign: "center", color: "var(--rosa-200)" }}>
          <div style={{ font: "italic 400 44px/1 var(--font-serif)" }}>Nothing yet?</div>
          <p style={{ font: "400 15px var(--font-mono)", color: "var(--nude-300)", margin: "14px 0 24px" }}>
            tap the heart on any spot and it lands here.
          </p>
          <Button variant="pink" icon="map" href="#/mapa">
            Open the map
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3.5 gap-y-7 sm:gap-8">
          {list.map((p) => (
            <SpotCard
              key={p.id}
              name={p.name}
              neighborhood={p.neighborhood}
              category={p.category}
              price={p.priceTier}
              hot={p.hot}
              essential={p.essential}
              note={p.vibe}
              image={photoUrl(p)}
              saved
              onSave={() => onToggle(p)}
              onClick={() => setSpot(p)}
            />
          ))}
        </div>
      )}

      <SpotDetail spot={spot} onClose={() => setSpot(null)} />
    </main>
  );
}
