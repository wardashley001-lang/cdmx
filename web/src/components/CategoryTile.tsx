import { Link } from "react-router-dom";
import type { ColorToken } from "../types";

const TOKEN_VAR: Record<ColorToken, string> = {
  wine: "var(--wine)",
  crimson: "var(--crimson)",
  cherry: "var(--cherry)",
  terracotta: "var(--terracotta)",
  rust: "var(--rust)",
  tan: "var(--tan)",
  amber: "var(--amber)",
  mustard: "var(--mustard)",
  gold: "var(--gold)",
  blush: "var(--blush)",
  fuchsia: "var(--fuchsia)",
  magenta: "var(--magenta)",
  orchid: "var(--orchid)",
  plum: "var(--plum)",
  navy: "var(--navy)",
  slate: "var(--slate)",
  denim: "var(--denim)",
  teal: "var(--teal)",
  sage: "var(--sage)",
  olive: "var(--olive)",
  taupe: "var(--taupe)",
};
const TOKEN_INK: Record<ColorToken, string> = {
  wine: "var(--wine-ink)",
  crimson: "var(--crimson-ink)",
  cherry: "var(--cherry-ink)",
  terracotta: "var(--terracotta-ink)",
  rust: "var(--rust-ink)",
  tan: "var(--tan-ink)",
  amber: "var(--amber-ink)",
  mustard: "var(--mustard-ink)",
  gold: "var(--gold-ink)",
  blush: "var(--blush-ink)",
  fuchsia: "var(--fuchsia-ink)",
  magenta: "var(--magenta-ink)",
  orchid: "var(--orchid-ink)",
  plum: "var(--plum-ink)",
  navy: "var(--navy-ink)",
  slate: "var(--slate-ink)",
  denim: "var(--denim-ink)",
  teal: "var(--teal-ink)",
  sage: "var(--sage-ink)",
  olive: "var(--olive-ink)",
  taupe: "var(--taupe-ink)",
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
