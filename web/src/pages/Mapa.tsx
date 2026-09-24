import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Input } from "../components/ds/Input";
import { Tag } from "../components/ds/Tag";
import { Tabs } from "../components/ds/Tabs";
import { IconButton } from "../components/ds/IconButton";
import { SpotCard } from "../components/ds/SpotCard";
import { SpotDetail } from "../components/SpotDetail";
import { DATA, resolveCoords, photoUrl } from "../lib/data";
import { pinIcon } from "../lib/leafletPin";
import { GROUP_LABEL, GROUP_ORDER } from "../data/categoryStyle";
import { useSaved } from "../lib/useSaved";
import { useToast } from "../lib/ToastProvider";
import type { Group, Place } from "../types";

const CDMX_CENTER: [number, number] = [19.4195, -99.165];

function useMobile() {
  const [m, setM] = useState(() => window.innerWidth < 760);
  useEffect(() => {
    const r = () => setM(window.innerWidth < 760);
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);
  return m;
}

function FlyToActive({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, Math.max(map.getZoom(), 15), { duration: 0.6 });
  }, [target, map]);
  return null;
}

function MapControls() {
  const map = useMap();
  return (
    <div style={{ position: "absolute", right: 20, top: 20, zIndex: 500, display: "flex", flexDirection: "column", gap: 10 }}>
      <IconButton icon="locate-fixed" label="Near me" variant="primary" shadow onClick={() => map.flyTo(CDMX_CENTER, 15)} />
      <IconButton icon="plus" label="Zoom in" shadow onClick={() => map.zoomIn()} />
      <IconButton icon="minus" label="Zoom out" shadow onClick={() => map.zoomOut()} />
    </div>
  );
}

export function Mapa() {
  const mobile = useMobile();
  const { saved, toggle } = useSaved();
  const showToast = useToast();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [group, setGroup] = useState<Group | null>(() => (searchParams.get("g") as Group | null) ?? null);
  const [view, setView] = useState<"map" | "list">("map");
  const [spot, setSpot] = useState<Place | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const plotted = useMemo(() => {
    const counters: Record<string, number> = {};
    return DATA.places
      .map((p) => {
        const key = p.neighborhood ?? p.id;
        counters[key] = (counters[key] ?? 0) + 1;
        const coords = resolveCoords(p, counters[key]);
        return coords ? { place: p, coords } : null;
      })
      .filter((x): x is { place: Place; coords: { lat: number; lng: number; approximate: boolean } } => x !== null);
  }, []);

  const ql = query.trim().toLowerCase();
  const filtered = plotted.filter(({ place }) => {
    if (group && place.group !== group) return false;
    if (!ql) return true;
    const hay = `${place.name} ${place.neighborhood ?? ""} ${place.vibe ?? ""} ${place.category}`.toLowerCase();
    return hay.includes(ql);
  });

  const [activeId, setActiveId] = useState<string | undefined>(filtered[0]?.place.id);
  useEffect(() => {
    if (!filtered.some((f) => f.place.id === activeId)) setActiveId(filtered[0]?.place.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group, ql]);

  const active = filtered.find((f) => f.place.id === activeId) ?? null;

  useEffect(() => {
    if (!listRef.current || !activeId) return;
    const n = listRef.current.querySelector<HTMLElement>(`[data-id="${activeId}"]`);
    if (!n) return;
    if (mobile) listRef.current.scrollTo({ left: n.offsetLeft - 16, behavior: "smooth" });
    else listRef.current.scrollTo({ top: n.offsetTop - listRef.current.offsetTop - 12, behavior: "smooth" });
  }, [activeId, mobile]);

  function onSave(p: Place) {
    const wasSaved = saved.includes(p.id);
    toggle(p.id);
    showToast(wasSaved ? "Removed. Their loss." : "Saved. Good taste.", wasSaved ? "heart-off" : "heart");
  }

  const filters = (
    <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "2px 2px 6px", scrollbarWidth: "none" }}>
      <Tag label="All" selected={!group} onClick={() => setGroup(null)} size={mobile ? "sm" : "md"} />
      {GROUP_ORDER.map((g) => (
        <Tag key={g} label={GROUP_LABEL[g]} selected={group === g} onClick={() => setGroup(group === g ? null : g)} count={plotted.filter((p) => p.place.group === g).length} size={mobile ? "sm" : "md"} />
      ))}
    </div>
  );

  const row = ({ place, coords }: { place: Place; coords: { approximate: boolean } }) => (
    <div key={place.id} data-id={place.id} style={{ flex: mobile ? "0 0 86%" : "none", background: mobile && view === "map" ? "var(--leche-50)" : "transparent", borderRadius: 10, boxShadow: mobile && view === "map" ? "var(--shadow-float)" : "none", scrollSnapAlign: "start" }}>
      <SpotCard
        layout="row"
        name={place.name}
        neighborhood={place.neighborhood}
        category={place.category}
        price={place.priceTier}
        hot={place.hot}
        essential={place.essential}
        michelin={place.michelin}
        note={place.vibe}
        image={photoUrl(place)}
        selected={place.id === activeId}
        saved={saved.includes(place.id)}
        onSave={() => onSave(place)}
        onClick={() => {
          if (place.id === activeId) setSpot(place);
          else setActiveId(place.id);
        }}
      />
      {coords.approximate && (
        <div style={{ marginLeft: 102, marginTop: -2, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)" }}>colonia aprox.</div>
      )}
    </div>
  );

  const empty = (
    <div style={{ padding: 32, textAlign: "center" }}>
      <div style={{ font: "italic 400 40px var(--font-serif)" }}>Nada.</div>
      <div style={{ font: "400 15px var(--font-mono)", color: "var(--text-3)", marginTop: 6 }}>try another search, babe</div>
    </div>
  );

  const map = (
    <MapContainer center={CDMX_CENTER} zoom={13} zoomControl={false} scrollWheelZoom style={{ position: "absolute", inset: 0, background: "var(--nude-100)" }}>
      <TileLayer attribution="&copy; OpenStreetMap &copy; CARTO" url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      {filtered.map(({ place, coords }) => (
        <Marker
          key={place.id}
          position={[coords.lat, coords.lng]}
          icon={pinIcon(place.category, place.id === activeId)}
          eventHandlers={{ click: () => setActiveId(place.id) }}
          zIndexOffset={place.id === activeId ? 1000 : 0}
        />
      ))}
      <FlyToActive target={active ? [active.coords.lat, active.coords.lng] : null} />
      <MapControls />
    </MapContainer>
  );

  if (mobile) {
    return (
      <main style={{ position: "relative", height: "calc(100vh - 68px)", overflow: "hidden", isolation: "isolate" }}>
        {view === "map" ? map : (
          <div style={{ position: "absolute", inset: 0, overflowY: "auto", padding: "128px 10px 100px", display: "flex", flexDirection: "column", gap: 4, background: "var(--leche-100)" }} ref={listRef}>
            {filtered.length ? filtered.map(row) : empty}
          </div>
        )}
        <div style={{ position: "absolute", left: 12, right: 12, top: 12, zIndex: 500, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <Input icon="search" size="sm" placeholder="Search a spot…" value={query} onChange={setQuery} onClear={() => setQuery("")} style={{ flex: 1 }} />
            <Tabs value={view} onChange={(v) => setView(v as "map" | "list")} items={[{ value: "map", icon: "map" }, { value: "list", icon: "list" }]} style={{ padding: 2 }} />
          </div>
          {filters}
        </div>
        {view === "map" && (
          <div ref={listRef} style={{ position: "absolute", left: 0, right: 0, bottom: 86, zIndex: 500, display: "flex", gap: 12, overflowX: "auto", padding: "8px 16px 10px", scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>
            {filtered.map(row)}
          </div>
        )}
        <SpotDetail spot={spot} onClose={() => setSpot(null)} mobile />
      </main>
    );
  }

  return (
    <main style={{ display: "grid", gridTemplateColumns: "440px 1fr", height: "calc(100vh - 68px)" }}>
      <aside style={{ display: "flex", flexDirection: "column", borderRight: "1px solid var(--line-soft)", background: "var(--leche-100)", minHeight: 0 }}>
        <div style={{ padding: "20px 20px 12px", display: "flex", flexDirection: "column", gap: 12, borderBottom: "1px solid var(--line-soft)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <h1 style={{ margin: 0, font: "400 44px/.9 var(--font-serif)", letterSpacing: "-.02em" }}>
              The <i style={{ color: "var(--rosa-600)" }}>map</i>
            </h1>
            <span style={{ fontFamily: "var(--font-caps)", fontWeight: 700, fontSize: 10, letterSpacing: ".2em", color: "var(--text-3)" }}>{filtered.length} SPOTS</span>
          </div>
          <Input icon="search" placeholder="Tacos, mezcal, Roma Norte…" value={query} onChange={setQuery} onClear={() => setQuery("")} />
          {filters}
        </div>
        <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: "16px 20px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
          {filtered.length ? filtered.map(row) : empty}
        </div>
      </aside>
      <section style={{ position: "relative", isolation: "isolate" }}>{map}</section>
      <SpotDetail spot={spot} onClose={() => setSpot(null)} />
    </main>
  );
}
