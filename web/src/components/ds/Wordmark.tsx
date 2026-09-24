import type { CSSProperties } from "react";

type Tone = "vino" | "rosa" | "pink" | "light" | "ink" | "cream";

const TONES: Record<Tone, { caps: string; script: string }> = {
  vino: { caps: "var(--vino-900)", script: "var(--rosa-500)" },
  rosa: { caps: "var(--rosa-200)", script: "var(--rosa-500)" },
  pink: { caps: "var(--vino-900)", script: "var(--leche-0)" },
  light: { caps: "var(--leche-0)", script: "var(--rosa-300)" },
  ink: { caps: "var(--vino-900)", script: "var(--rosa-500)" },
  cream: { caps: "var(--rosa-200)", script: "var(--rosa-500)" },
};

export function Wordmark({ size = 32, tone = "vino", style }: { size?: number; tone?: Tone; style?: CSSProperties }) {
  const t = TONES[tone] ?? TONES.vino;
  return (
    <span style={{ position: "relative", display: "inline-block", lineHeight: 1, paddingBottom: size * 0.75, paddingRight: size * 0.35, ...style }}>
      <span style={{ fontFamily: "var(--font-caps)", fontWeight: 800, fontSize: size, letterSpacing: "-.02em", color: t.caps, whiteSpace: "nowrap", lineHeight: 0.9, display: "block" }}>
        LA GÜERA
      </span>
      <span style={{ position: "absolute", right: 0, top: size * 0.6, fontFamily: "var(--font-script)", fontSize: size * 1.25, lineHeight: 1, color: t.script, whiteSpace: "nowrap", transform: "rotate(-4deg)" }}>
        guide
      </span>
    </span>
  );
}
