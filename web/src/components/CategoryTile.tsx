import { Link } from "react-router-dom";
import type { ColorToken } from "../types";

const TOKEN_VAR: Record<ColorToken, string> = {
  pink: "var(--pink)",
  terracotta: "var(--terracotta)",
  ochre: "var(--ochre)",
  gold: "var(--gold)",
  olive: "var(--olive)",
  moss: "var(--moss)",
  emerald: "var(--emerald)",
  jade: "var(--jade)",
  turquoise: "var(--turquoise)",
  sky: "var(--sky)",
  cobalt: "var(--cobalt)",
  indigo: "var(--indigo)",
  violet: "var(--violet)",
  plum: "var(--plum)",
  crimson: "var(--crimson)",
};
const TOKEN_INK: Record<ColorToken, string> = {
  pink: "var(--pink-ink)",
  terracotta: "var(--terracotta-ink)",
  ochre: "var(--ochre-ink)",
  gold: "var(--gold-ink)",
  olive: "var(--olive-ink)",
  moss: "var(--moss-ink)",
  emerald: "var(--emerald-ink)",
  jade: "var(--jade-ink)",
  turquoise: "var(--turquoise-ink)",
  sky: "var(--sky-ink)",
  cobalt: "var(--cobalt-ink)",
  indigo: "var(--indigo-ink)",
  violet: "var(--violet-ink)",
  plum: "var(--plum-ink)",
  crimson: "var(--crimson-ink)",
};

export function CategoryTile({
  id,
  label,
  token,
  count,
}: {
  id: string;
  label: string;
  token: ColorToken;
  count: number;
}) {
  return (
    <Link
      to={`/category/${id}`}
      className="group relative flex flex-col justify-between p-5 sm:p-6 min-h-[132px] overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
      style={{ background: TOKEN_VAR[token], color: TOKEN_INK[token] }}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] opacity-80 tabular-nums">
        {String(count).padStart(2, "0")} places
      </span>
      <span className="font-display font-800 text-2xl sm:text-3xl leading-[0.95] tracking-tight" style={{ fontStretch: "expanded", textWrap: "balance" }}>
        {label}
      </span>
      <span
        aria-hidden="true"
        className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full opacity-[0.14] transition-transform duration-300 group-hover:scale-125"
        style={{ background: TOKEN_INK[token] }}
      />
    </Link>
  );
}

export { TOKEN_VAR, TOKEN_INK };
