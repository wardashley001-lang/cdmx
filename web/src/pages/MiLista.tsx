import { useState } from "react";
import { SpotCard } from "../components/ds/SpotCard";
import { Button } from "../components/ds/Button";
import { SpotDetail } from "../components/SpotDetail";
import { DATA, noteOf, photoUrl } from "../lib/data";
import { useSaved } from "../lib/useSaved";
import { GUIDE_URL } from "../lib/guide";
import { canNativeShare, copyText, listText } from "../lib/shareList";
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

  async function onShare() {
    try {
      await navigator.share({ title: "My Mexico City list", text: listText(list) });
    } catch {
      // Closing the share sheet counts as an error; nothing to do.
    }
  }

  async function onCopy() {
    const ok = await copyText(listText(list));
    showToast(ok ? "Copied. Paste it anywhere." : "Couldn't copy. Try the share button.", ok ? "copy" : "x");
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

      {list.length > 0 && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "-16px 0 32px" }}>
          {canNativeShare() && (
            <Button variant="pink" size="sm" icon="share-2" onClick={onShare}>
              Share my list
            </Button>
          )}
          <Button variant={canNativeShare() ? "secondary" : "pink"} size="sm" icon="copy" onClick={onCopy}>
            Copy my list
          </Button>
        </div>
      )}

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
              pick={!!p.pick}
              michelin={p.michelin}
              note={noteOf(p)}
              image={photoUrl(p)}
              saved
              onSave={() => onToggle(p)}
              onClick={() => setSpot(p)}
            />
          ))}
        </div>
      )}

      {GUIDE_URL && list.length > 0 && (
        <section style={{ marginTop: 56, background: "var(--vino-800)", borderRadius: 4, padding: "32px 24px", color: "var(--rosa-200)" }}>
          <div style={{ font: "italic 400 34px/1 var(--font-serif)" }}>Want the whole guide?</div>
          <p style={{ font: "400 15px/1.5 var(--font-sans)", color: "var(--nude-300)", margin: "12px 0 20px", maxWidth: 460 }}>
            Itineraries and my notes, all in one place.
          </p>
          <Button variant="pink" iconRight="arrow-right" href={GUIDE_URL} target="_blank" rel="noopener noreferrer">
            Get the guide
          </Button>
        </section>
      )}

      <SpotDetail spot={spot} onClose={() => setSpot(null)} />
    </main>
  );
}
