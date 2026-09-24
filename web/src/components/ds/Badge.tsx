import type { CSSProperties, ReactNode } from "react";

type Variant = "hot" | "new" | "pick" | "open" | "closed" | "neutral" | "ink";

const V: Record<Variant, { bg: string; fg: string; t: string }> = {
  hot: { bg: "var(--tomate-500)", fg: "var(--leche-0)", t: "Hot" },
  new: { bg: "var(--cielo-300)", fg: "var(--vino-900)", t: "Nuevo" },
  pick: { bg: "var(--rosa-500)", fg: "var(--vino-900)", t: "Güera's pick" },
  open: { bg: "transparent", fg: "var(--status-open)", t: "Abierto" },
  closed: { bg: "transparent", fg: "var(--status-closed)", t: "Cerrado" },
  neutral: { bg: "transparent", fg: "var(--vino-900)", t: "" },
  ink: { bg: "var(--vino-900)", fg: "var(--rosa-200)", t: "" },
};

export interface BadgeProps {
  children?: ReactNode;
  variant?: Variant;
  shape?: "pill" | "stamp";
  tilt?: number;
  style?: CSSProperties;
}

export function Badge({ children, variant = "neutral", shape = "pill", tilt, style }: BadgeProps) {
  const v = V[variant] ?? V.neutral;
  const txt = children ?? v.t;

  if (shape === "stamp") {
    return (
      <span
        style={{
          width: 74,
          height: 74,
          borderRadius: "50%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 8,
          background: v.bg,
          color: v.fg,
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: variant === "pick" ? 14 : 18,
          lineHeight: 0.95,
          transform: `rotate(${tilt ?? -8}deg)`,
          boxShadow: "var(--shadow-soft)",
          ...style,
        }}
      >
        <span>
          {txt}
          {variant === "hot" || variant === "pick" ? (
            <span style={{ display: "block", fontStyle: "normal", fontSize: 10, marginTop: 2 }}>✦</span>
          ) : null}
        </span>
      </span>
    );
  }

  const dot = variant === "open" || variant === "closed";
  const filled = v.bg !== "transparent";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        height: 20,
        padding: filled ? "0 8px" : dot ? 0 : "0 7px",
        borderRadius: "var(--radius-pill)",
        background: v.bg,
        color: v.fg,
        border: !filled && !dot ? "var(--border-hair) solid var(--line-soft)" : "none",
        fontFamily: "var(--font-caps)",
        fontWeight: 700,
        fontSize: 9.5,
        letterSpacing: ".16em",
        textTransform: "uppercase",
        lineHeight: 1,
        whiteSpace: "nowrap",
        transform: tilt ? `rotate(${tilt}deg)` : "none",
        ...style,
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />}
      {txt}
    </span>
  );
}
