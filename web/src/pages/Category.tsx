import { Link, Navigate, useParams } from "react-router-dom";
import { DATA, placesByCategory } from "../lib/data";
import { PlaceCard } from "../components/PlaceCard";
import { TOKEN_VAR, TOKEN_INK } from "../components/CategoryTile";
import type { ColorToken } from "../types";

export function Category() {
  const { id = "" } = useParams();
  const meta = DATA.categories[id];

  if (!meta) return <Navigate to="/" replace />;

  const token = meta.token as ColorToken;
  const places = placesByCategory(id);

  return (
    <div>
      <section
        className="px-4 sm:px-6 py-10 sm:py-14"
        style={{ background: TOKEN_VAR[token], color: TOKEN_INK[token] }}
      >
        <div className="mx-auto max-w-6xl">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] opacity-75 hover:opacity-100 transition-opacity"
          >
            ← All categories
          </Link>
          <h1
            className="mt-4 font-display font-900 leading-[0.92] tracking-tight text-[13vw] sm:text-[52px]"
            style={{ fontStretch: "expanded", textWrap: "balance" }}
          >
            {meta.label}
          </h1>
          <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.14em] opacity-80 tabular-nums">
            {places.length} place{places.length === 1 ? "" : "s"}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {places.map((p) => (
            <PlaceCard key={p.id} place={p} token={token} />
          ))}
        </div>
      </section>
    </div>
  );
}
