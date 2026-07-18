import { useMemo, useState } from "react";
import { CategoryTile } from "../components/CategoryTile";
import { PlaceCard } from "../components/PlaceCard";
import { CATEGORY_ORDER, DATA, categoryCount } from "../lib/data";
import type { ColorToken } from "../types";

export function Home() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return DATA.places
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.neighborhood ?? "").toLowerCase().includes(q) ||
          (p.vibe ?? "").toLowerCase().includes(q)
      )
      .slice(0, 24);
  }, [query]);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 sm:pt-20 pb-10 sm:pb-14">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] mb-4" style={{ color: "var(--pink)" }}>
          172 places · Ciudad de México
        </p>
        <h1
          className="font-display font-900 leading-[0.92] tracking-tight text-[13vw] sm:text-[64px] lg:text-[84px]"
          style={{ fontStretch: "expanded", textWrap: "balance", maxWidth: "16ch" }}
        >
          The México City guide, sorted.
        </h1>
        <p className="mt-5 max-w-xl text-[15px] sm:text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          Every saved place, organized by category — with the neighborhood, the
          vibe, and a direct link to Maps and Instagram, so you never have to
          scroll a messy list again.
        </p>

        <div className="mt-8 max-w-md">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a place, neighborhood, or vibe…"
            className="w-full px-4 py-3 text-sm outline-none transition-colors"
            style={{
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
              color: "var(--text)",
            }}
          />
        </div>
      </section>

      {query.trim() ? (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] mb-4" style={{ color: "var(--muted)" }}>
            {results.length} result{results.length === 1 ? "" : "s"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {results.map((p) => (
              <PlaceCard key={p.id} place={p} token={DATA.categories[p.category].token as ColorToken} />
            ))}
          </div>
          {results.length === 0 && (
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              No matches. Try a different search.
            </p>
          )}
        </section>
      ) : (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-[2px]" style={{ background: "var(--border)" }}>
            {CATEGORY_ORDER.map((id) => {
              const meta = DATA.categories[id];
              return (
                <CategoryTile
                  key={id}
                  id={id}
                  label={meta.label}
                  token={meta.token as ColorToken}
                  count={categoryCount(id)}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
