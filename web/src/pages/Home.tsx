import { CategoryTile } from "../components/CategoryTile";
import { SearchBar } from "../components/SearchBar";
import { CATEGORY_ORDER, DATA, categoryCount } from "../lib/data";
import type { ColorToken } from "../types";

export function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 sm:pt-20 pb-10 sm:pb-14">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] mb-4" style={{ color: "var(--accent)" }}>
          {DATA.places.length} places · Ciudad de México
        </p>
        <h1
          className="font-display font-900 leading-[0.92] tracking-tight text-[13vw] sm:text-[58px] lg:text-[76px]"
          style={{ fontStretch: "expanded", textWrap: "balance", maxWidth: "18ch" }}
        >
          La güera's guide to Mexico City.
        </h1>
        <p className="mt-5 max-w-xl text-[15px] sm:text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          Every place we've actually saved — sorted by vibe, tagged by
          neighborhood, one tap from Maps or Instagram. No more digging
          through screenshots for "that one restaurant."
        </p>

        <div className="mt-8 max-w-md">
          <SearchBar />
        </div>
      </section>

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
    </div>
  );
}
