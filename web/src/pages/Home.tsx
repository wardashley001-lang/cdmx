import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ds/Input";
import { Button } from "../components/ds/Button";
import { Tag } from "../components/ds/Tag";
import { Badge } from "../components/ds/Badge";
import { SpotCard } from "../components/ds/SpotCard";
import { SpotDetail } from "../components/SpotDetail";
import { DATA, photoUrl } from "../lib/data";
import { GROUP_LABEL, GROUP_ORDER } from "../data/categoryStyle";
import { useSaved } from "../lib/useSaved";
import { useToast } from "../lib/ToastProvider";
import type { Michelin, Place } from "../types";

const HOOD_PATTERNS = ["var(--pattern-checker)", "var(--pattern-gingham)", "var(--pattern-storia)", "var(--pattern-carpet)", "var(--pattern-stripes)"];

const MICHELIN_ORDER: { level: Michelin["level"]; label: string }[] = [
  { level: "two-star", label: "Two Stars" },
  { level: "one-star", label: "One Star" },
  { level: "green-star", label: "Green Star" },
  { level: "bib", label: "Bib Gourmand" },
];

function Eyebrow({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div style={{ fontFamily: "var(--font-caps)", fontWeight: 700, fontSize: 10, letterSpacing: ".24em", textTransform: "uppercase", color }}>
      {children}
    </div>
  );
}

function Section({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <section style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "56px 20px", ...style }}>{children}</section>;
}

function CardGrid({ places, onSave, onOpen, isSaved }: { places: Place[]; onSave: (p: Place) => void; onOpen: (p: Place) => void; isSaved: (id: string) => boolean }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3.5 gap-y-7 sm:gap-8">
      {places.map((p) => (
        <SpotCard
          key={p.id}
          name={p.name}
          neighborhood={p.neighborhood}
          category={p.category}
          price={p.priceTier}
          hot={p.hot}
          essential={p.essential}
          michelin={p.michelin}
          note={p.vibe}
          image={photoUrl(p)}
          saved={isSaved(p.id)}
          onSave={() => onSave(p)}
          onClick={() => onOpen(p)}
        />
      ))}
    </div>
  );
}

export function Home() {
  const navigate = useNavigate();
  const { saved, toggle, isSaved } = useSaved();
  const showToast = useToast();
  const [q, setQ] = useState("");
  const [spot, setSpot] = useState<Place | null>(null);

  function onSave(p: Place) {
    const wasSaved = saved.includes(p.id);
    toggle(p.id);
    showToast(wasSaved ? "Removed. Their loss." : "Saved. Good taste.", wasSaved ? "heart-off" : "heart");
  }

  const hot = useMemo(() => DATA.places.filter((p) => p.hot), []);
  const essentials = useMemo(() => DATA.places.filter((p) => p.essential), []);
  const tacos = useMemo(() => DATA.places.filter((p) => p.category === "tacos").sort((a, b) => a.name.localeCompare(b.name)), []);
  const michelinByLevel = useMemo(() => {
    const map = new Map<Michelin["level"], Place[]>();
    for (const p of DATA.places) {
      if (!p.michelin || p.category === "tacos") continue;
      const list = map.get(p.michelin.level) ?? [];
      list.push(p);
      map.set(p.michelin.level, list);
    }
    return map;
  }, []);

  const hoods = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of DATA.places) {
      if (!p.neighborhood) continue;
      counts.set(p.neighborhood, (counts.get(p.neighborhood) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, []);

  function goToMap(query?: string, group?: string) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (group) params.set("g", group);
    navigate(params.toString() ? `/mapa?${params}` : "/mapa");
  }

  return (
    <main>
      {/* Hero */}
      <section style={{ background: "var(--vino-800)", overflow: "hidden" }}>
        <div className="grid-cols-1 sm:[grid-template-columns:1.15fr_.85fr]" style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "48px 20px 64px", display: "grid", gap: 40, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Eyebrow color="var(--rosa-400)">Mexico City · the hot list</Eyebrow>
            <div style={{ position: "relative" }}>
              <h1 className="text-[64px] sm:text-[clamp(84px,9vw,132px)]" style={{ margin: "18px 0 0", fontFamily: "var(--font-serif)", fontWeight: 400, lineHeight: 0.9, letterSpacing: "-.03em", color: "var(--rosa-200)" }}>
                Comer,
                <br />
                <i style={{ color: "var(--rosa-500)" }}>beber,</i>
                <br />
                bailar.
              </h1>
              <div className="text-[40px] sm:text-[60px]" style={{ fontFamily: "var(--font-script)", fontWeight: 400, lineHeight: 1, color: "var(--rosa-300)", transform: "rotate(-5deg)", whiteSpace: "nowrap", pointerEvents: "none", margin: "6px 0 0 40%" }}>
                xo, la güera
              </div>
            </div>
            <p style={{ font: "400 18px/1.55 var(--font-sans)", color: "var(--nude-300)", maxWidth: 460, margin: "24px 0 28px" }}>
              The spots I actually send my friends to. Tap a pin, get a table, thank me later.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                goToMap(q);
              }}
              style={{ display: "flex", gap: 10, flexWrap: "wrap", maxWidth: 560 }}
            >
              <Input size="lg" icon="search" placeholder="Tacos, mezcal, Roma Norte…" value={q} onChange={setQ} style={{ flex: "1 1 260px" }} />
              <Button size="lg" variant="pink" type="submit" iconRight="arrow-right">
                Vámonos
              </Button>
            </form>
          </div>
          <div className="hidden sm:block" style={{ position: "relative", justifySelf: "end", width: "min(100%,440px)" }}>
            <div style={{ aspectRatio: "4/5", borderRadius: "var(--radius-arch)", background: "var(--pattern-storia)", overflow: "hidden", display: "flex", alignItems: "flex-end", padding: 18 }}>
              <span style={{ font: "400 12px var(--font-mono)", color: "var(--vino-900)", background: "var(--leche-50)", padding: "4px 8px", borderRadius: 2 }}>
                {DATA.places.length} spots · updated {DATA.meta?.updated ?? ""}
              </span>
            </div>
            <Badge variant="pick" shape="stamp" style={{ position: "absolute", top: 40, right: -10, width: 90, height: 90, fontSize: 16 }} />
          </div>
        </div>
      </section>

      {/* Hot ahorita */}
      {hot.length > 0 && (
        <Section>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
            <div>
              <Eyebrow color="var(--rosa-600)">This week</Eyebrow>
              <h2 className="text-[48px] sm:text-[72px]" style={{ margin: "10px 0 0", fontFamily: "var(--font-serif)", fontWeight: 400, lineHeight: 0.9, letterSpacing: "-.02em" }}>
                Hot <i>ahorita</i>
              </h2>
            </div>
            <span style={{ flex: 1 }} />
            <Button variant="ghost" iconRight="arrow-right" onClick={() => goToMap()}>
              See all
            </Button>
          </div>
          <CardGrid places={hot.slice(0, 8)} onSave={onSave} onOpen={setSpot} isSaved={isSaved} />
        </Section>
      )}

      {/* Michelin 2026 */}
      {michelinByLevel.size > 0 && (
        <Section style={{ background: "var(--leche-50)" }}>
          <Eyebrow color="var(--rosa-600)">Announced May 2026</Eyebrow>
          <h2 className="text-[48px] sm:text-[72px]" style={{ margin: "10px 0 32px", fontFamily: "var(--font-serif)", fontWeight: 400, lineHeight: 0.9, letterSpacing: "-.02em" }}>
            The <i>Michelin</i> Guide
          </h2>
          <div className="flex flex-col gap-10">
            {MICHELIN_ORDER.filter((m) => michelinByLevel.has(m.level)).map((m) => (
              <div key={m.level}>
                <h3 style={{ marginBottom: 12, fontFamily: "var(--font-caps)", fontWeight: 700, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--text-3)" }}>
                  {m.label}
                </h3>
                <CardGrid places={michelinByLevel.get(m.level) ?? []} onSave={onSave} onOpen={setSpot} isSaved={isSaved} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Essentials */}
      {essentials.length > 0 && (
        <Section>
          <Eyebrow color="var(--rosa-600)">Always</Eyebrow>
          <h2 className="text-[48px] sm:text-[72px]" style={{ margin: "10px 0 32px", fontFamily: "var(--font-serif)", fontWeight: 400, lineHeight: 0.9, letterSpacing: "-.02em" }}>
            The <i>Essentials</i>
          </h2>
          <CardGrid places={essentials} onSave={onSave} onOpen={setSpot} isSaved={isSaved} />
        </Section>
      )}

      {/* Best tacos */}
      {tacos.length > 0 && (
        <Section style={{ background: "var(--leche-50)" }}>
          <Eyebrow color="var(--rosa-600)">Obsessed</Eyebrow>
          <h2 className="text-[48px] sm:text-[72px]" style={{ margin: "10px 0 32px", fontFamily: "var(--font-serif)", fontWeight: 400, lineHeight: 0.9, letterSpacing: "-.02em" }}>
            Best <i>Tacos</i>
          </h2>
          <CardGrid places={tacos} onSave={onSave} onOpen={setSpot} isSaved={isSaved} />
        </Section>
      )}

      {/* Mood tags */}
      <section style={{ background: "var(--rosa-200)" }}>
        <div className="flex-col sm:flex-row" style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "56px 20px", display: "flex", gap: 32, alignItems: "center", justifyContent: "space-between" }}>
          <h2 className="text-[38px] sm:text-[52px]" style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 400, lineHeight: 1, letterSpacing: "-.02em", maxWidth: 520 }}>
            What are you <i style={{ color: "var(--rosa-600)" }}>in the mood</i> for?
          </h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", maxWidth: 520 }}>
            {GROUP_ORDER.map((g) => (
              <Tag
                key={g}
                label={GROUP_LABEL[g]}
                onClick={() => goToMap(undefined, g)}
                count={DATA.places.filter((p) => p.group === g).length}
                style={{ background: "var(--leche-50)", borderColor: "transparent", height: 40, padding: "0 18px" }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* By colonia */}
      <Section>
        <Eyebrow color="var(--rosa-600)">By colonia</Eyebrow>
        <div className="grid-cols-2 sm:[grid-template-columns:repeat(5,1fr)]" style={{ display: "grid", gap: 16, marginTop: 20 }}>
          {hoods.map(([name, count], i) => (
            <button
              key={name}
              onClick={() => goToMap(name)}
              style={{ aspectRatio: "3/4", border: 0, borderRadius: "var(--radius-arch)", background: HOOD_PATTERNS[i % HOOD_PATTERNS.length], cursor: "pointer", padding: 12, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
            >
              <span style={{ background: "var(--leche-50)", borderRadius: 999, padding: "9px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <span style={{ font: "italic 400 20px/1 var(--font-serif)", color: "var(--vino-900)" }}>{name}</span>
                <span style={{ fontFamily: "var(--font-caps)", fontWeight: 700, fontSize: 8.5, letterSpacing: ".2em", color: "var(--text-3)" }}>{count} SPOTS</span>
              </span>
            </button>
          ))}
        </div>
      </Section>

      <SpotDetail spot={spot} onClose={() => setSpot(null)} />
    </main>
  );
}
