import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DATA } from "../lib/data";
import { searchPlaces } from "../lib/search";
import { PlaceCard } from "../components/PlaceCard";
import { SearchBar } from "../components/SearchBar";
import type { ColorToken, OccasionTag } from "../types";

const ALL_TAGS: OccasionTag[] = [
  "romantic",
  "trendy",
  "casual",
  "lively atmosphere",
  "good for lunch",
  "good for dinner",
  "outdoor",
];

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [activeTags, setActiveTags] = useState<Set<OccasionTag>>(new Set());

  function toggleTag(tag: OccasionTag) {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  const results = useMemo(() => {
    const base = query.trim()
      ? searchPlaces(DATA.places, DATA.categories, query, 500)
      : DATA.places;
    if (activeTags.size === 0) return base.slice(0, 60);
    return base
      .filter((p) => [...activeTags].every((t) => p.occasionTags.includes(t)))
      .slice(0, 60);
  }, [query, activeTags]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="font-display font-900 text-3xl sm:text-4xl tracking-tight mb-5" style={{ fontStretch: "expanded" }}>
        Search
      </h1>

      <div className="max-w-md mb-6">
        <SearchBar />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {ALL_TAGS.map((tag) => {
          const isActive = activeTags.has(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className="px-3 py-1.5 text-[12px] font-semibold tracking-wide font-mono uppercase transition-opacity"
              style={{
                background: isActive ? "var(--accent)" : "var(--surface-2)",
                color: isActive ? "var(--accent-ink)" : "var(--text)",
                opacity: isActive ? 1 : 0.75,
              }}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {query.trim() || activeTags.size > 0 ? (
        <>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] mb-4" style={{ color: "var(--muted)" }}>
            {results.length} result{results.length === 1 ? "" : "s"}
            {query.trim() && ` for "${query}"`}
            {activeTags.size > 0 && ` tagged ${[...activeTags].join(", ")}`}
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
              No matches. Try a different search or tag combination.
            </p>
          )}
        </>
      ) : (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Search by name, neighborhood, vibe, or category — try "tacos", "brunch", or "Roma Norte" — or tap a tag above to browse by occasion.
        </p>
      )}
    </div>
  );
}
