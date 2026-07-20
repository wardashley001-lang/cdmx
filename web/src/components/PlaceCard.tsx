import type { ColorToken, Place } from "../types";
import { TOKEN_VAR } from "./CategoryTile";
import { CategoryBadge, PriceTierBadge } from "./CategoryBadge";
import { instagramUrl, mapsSearchUrl } from "../lib/data";

function IconMaps() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22s7-7.58 7-13A7 7 0 0 0 5 9c0 5.42 7 13 7 13Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function PlaceCard({
  place,
  token,
  categoryLabel,
}: {
  place: Place;
  token: ColorToken;
  categoryLabel?: string;
}) {
  const mapsHref = place.mapsUrl || mapsSearchUrl(place.name);
  const hasBadges = categoryLabel || place.priceTier;

  return (
    <article
      className="group relative border-l-[3px] pl-4 pr-4 py-4 sm:pl-5 sm:pr-5 transition-colors"
      style={{ borderColor: TOKEN_VAR[token], background: "var(--surface)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display font-700 text-[17px] leading-tight tracking-tight" style={{ textWrap: "balance" }}>
            {place.name}
          </h3>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: "var(--muted)" }}>
            {place.neighborhood && <span>{place.neighborhood}</span>}
          </div>

          {place.vibe && (
            <p className="mt-2.5 text-[13.5px] leading-relaxed" style={{ color: "var(--text)", opacity: 0.85, maxWidth: "60ch" }}>
              {place.vibe}
            </p>
          )}
        </div>

        {hasBadges && (
          <div className="shrink-0 flex flex-col items-end gap-1.5">
            {categoryLabel && <CategoryBadge token={token} label={categoryLabel} />}
            {place.priceTier && <PriceTierBadge tier={place.priceTier} />}
          </div>
        )}
      </div>

      <div className="mt-3.5 flex items-center gap-2">
        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11.5px] font-semibold tracking-wide transition-opacity hover:opacity-70"
          style={{ background: "var(--surface-2)", color: "var(--text)" }}
        >
          <IconMaps /> Maps
        </a>
        {place.instagram && (
          <a
            href={instagramUrl(place.instagram)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11.5px] font-semibold tracking-wide transition-opacity hover:opacity-70"
            style={{ background: "var(--surface-2)", color: "var(--text)" }}
          >
            <IconInstagram /> @{place.instagram}
          </a>
        )}
      </div>
    </article>
  );
}
