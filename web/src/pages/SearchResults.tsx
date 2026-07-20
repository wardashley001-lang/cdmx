import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { DATA } from "../lib/data";
import { searchPlaces } from "../lib/search";
import { PlaceCard } from "../components/PlaceCard";
import { SearchBar } from "../components/SearchBar";
import type { ColorToken } from "../types";

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const results = useMemo(
    () => searchPlaces(DATA.places, DATA.categories, query),
    [query]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="font-display font-900 text-3xl sm:text-4xl tracking-tight mb-5" style={{ fontStretch: "expanded" }}>
        Search
      </h1>

      <div className="max-w-md mb-8">
        <SearchBar />
      </div>

      {query.trim() ? (
        <>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] mb-4" style={{ color: "var(--muted)" }}>
            {results.length} result{results.length === 1 ? "" : "s"} for "{query}"
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {results.map((p) => (
              <PlaceCard
                key={p.id}
                place={p}
                token={DATA.categories[p.category].token as ColorToken}
                categoryLabel={DATA.categories[p.category].label}
              />
            ))}
          </div>
          {results.length === 0 && (
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              No matches. Try a different search.
            </p>
          )}
        </>
      ) : (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Search by name, neighborhood, vibe, or category — try "tacos", "brunch", or "Roma Norte".
        </p>
      )}
    </div>
  );
}
