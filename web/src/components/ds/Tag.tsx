import { useState, type CSSProperties } from "react";
import { Icon } from "./Icon";
import { CATEGORY_STYLE, BUCKET_STYLE } from "../../data/categoryStyle";

export interface TagProps {
  label?: string;
  category?: string;
  icon?: string;
  selected?: boolean;
  size?: "sm" | "md";
  onClick?: () => void;
  count?: number;
  dark?: boolean;
  style?: CSSProperties;
}

export function Tag({ label, category, icon, selected, size = "md", onClick, count, dark, style }: TagProps) {
  const [h, setH] = useState(false);
  const cat = category ? CATEGORY_STYLE[category] : null;
  const c = cat ? BUCKET_STYLE[cat.bucket] : null;
  const text = label ?? cat?.label ?? "";
  const base = dark ? "var(--rosa-200)" : "var(--vino-900)";
  const bg = selected ? (c ? c.bg : base) : h && onClick ? (dark ? "rgba(247,202,216,.12)" : "var(--rosa-100)") : "transparent";
  const fg = selected ? (c ? c.fg : dark ? "var(--vino-900)" : "var(--rosa-200)") : base;
  const bd = selected ? (c ? c.bg : base) : dark ? "var(--line-on-dark)" : "var(--line-soft)";
  const sm = size === "sm";
  const El = onClick ? "button" : "span";

  return (
    <El
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-pressed={onClick ? !!selected : undefined}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        height: sm ? 26 : 34,
        padding: sm ? "0 11px" : "0 15px",
        borderRadius: "var(--radius-pill)",
        border: `var(--border-hair) solid ${bd}`,
        background: bg,
        color: fg,
        fontFamily: "var(--font-caps)",
        fontWeight: 700,
        fontSize: sm ? 9.5 : 10.5,
        letterSpacing: ".16em",
        textTransform: "uppercase",
        lineHeight: 1,
        whiteSpace: "nowrap",
        cursor: onClick ? "pointer" : "default",
        transition: "background var(--dur-base) var(--ease-out),color var(--dur-base),border-color var(--dur-base)",
        ...style,
      }}
    >
      {c && !selected && <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.bg, flex: "none" }} />}
      {icon && <Icon name={icon} size={sm ? 12 : 13} />}
      {text}
      {count != null && (
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 400, fontSize: sm ? 10 : 11, letterSpacing: 0, opacity: 0.7 }}>{count}</span>
      )}
    </El>
  );
}
