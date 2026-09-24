import type { CSSProperties } from "react";
import { Icon } from "./Icon";

export interface TabItem {
  value: string;
  label?: string;
  icon?: string;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange?: (value: string) => void;
  variant?: "pill" | "marker";
  style?: CSSProperties;
}

export function Tabs({ items = [], value, onChange, variant = "pill", style }: TabsProps) {
  if (variant === "marker") {
    return (
      <div role="tablist" style={{ display: "flex", gap: 28, borderBottom: "var(--border-hair) solid var(--line-soft)", ...style }}>
        {items.map((it) => {
          const on = it.value === value;
          return (
            <button
              key={it.value}
              role="tab"
              aria-selected={on}
              onClick={() => onChange && onChange(it.value)}
              style={{
                position: "relative",
                border: 0,
                background: "none",
                padding: "10px 0 12px",
                font: `${on ? "italic 400 " : "400 "}19px var(--font-serif)`,
                color: on ? "var(--vino-900)" : "var(--text-3)",
                cursor: "pointer",
                display: "inline-flex",
                gap: 6,
                alignItems: "center",
              }}
            >
              {it.icon && <Icon name={it.icon} size={15} />}
              {it.label}
              <span style={{ position: "absolute", left: 0, right: 0, bottom: -1, height: 2, background: on ? "var(--rosa-500)" : "transparent", transition: "background var(--dur-base)" }} />
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <div role="tablist" style={{ display: "inline-flex", gap: 2, padding: 3, background: "var(--leche-50)", border: "var(--border-hair) solid var(--line-soft)", borderRadius: "var(--radius-pill)", ...style }}>
      {items.map((it) => {
        const on = it.value === value;
        return (
          <button
            key={it.value}
            role="tab"
            aria-selected={on}
            aria-label={it.label || it.value}
            onClick={() => onChange && onChange(it.value)}
            style={{
              height: 34,
              padding: it.label ? "0 16px" : "0 11px",
              border: 0,
              borderRadius: "var(--radius-pill)",
              background: on ? "var(--vino-800)" : "transparent",
              color: on ? "var(--rosa-200)" : "var(--vino-900)",
              fontFamily: "var(--font-caps)",
              fontWeight: 700,
              fontSize: 10.5,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              cursor: "pointer",
              display: "inline-flex",
              gap: 7,
              alignItems: "center",
              whiteSpace: "nowrap",
              transition: "background var(--dur-base) var(--ease-out)",
            }}
          >
            {it.icon && <Icon name={it.icon} size={15} />}
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
