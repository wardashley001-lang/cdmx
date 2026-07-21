import type { ColorToken, OccasionTag, PriceTier } from "../types";
import { TOKEN_VAR, TOKEN_INK } from "./CategoryTile";

export function CategoryBadge({ token, label }: { token: ColorToken; label: string }) {
  return (
    <span
      className="inline-block px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] leading-none whitespace-nowrap"
      style={{ background: TOKEN_VAR[token], color: TOKEN_INK[token] }}
    >
      {label}
    </span>
  );
}

export function PriceTierBadge({ tier }: { tier: PriceTier }) {
  return (
    <span
      className="inline-block px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] leading-none tabular-nums whitespace-nowrap"
      style={{ background: "var(--surface-2)", color: "var(--text)" }}
    >
      {tier}
    </span>
  );
}

export function TagPill({ tag }: { tag: OccasionTag }) {
  return (
    <span
      className="inline-block px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.06em] leading-none whitespace-nowrap"
      style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
    >
      {tag}
    </span>
  );
}
