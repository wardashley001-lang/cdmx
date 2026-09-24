import { useState, type CSSProperties } from "react";
import { Icon } from "./Icon";

type Variant = "secondary" | "primary" | "pink" | "inverse" | "loud";

const V: Record<Variant, { bg: string; fg: string; bd: string }> = {
  secondary: { bg: "var(--leche-50)", fg: "var(--vino-900)", bd: "var(--line-soft)" },
  primary: { bg: "var(--vino-800)", fg: "var(--rosa-200)", bd: "var(--vino-800)" },
  pink: { bg: "var(--rosa-500)", fg: "var(--vino-900)", bd: "var(--rosa-500)" },
  inverse: { bg: "transparent", fg: "var(--rosa-200)", bd: "var(--line-on-dark)" },
  loud: { bg: "var(--rosa-500)", fg: "var(--vino-900)", bd: "var(--rosa-500)" },
};

export interface IconButtonProps {
  icon: string;
  label: string;
  variant?: Variant;
  size?: number;
  active?: boolean;
  shadow?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
}

export function IconButton({
  icon,
  label,
  variant = "secondary",
  size = 44,
  active,
  shadow = false,
  onClick,
  disabled,
  style,
}: IconButtonProps) {
  const [h, setH] = useState(false);
  const v = active ? V.pink : V[variant] ?? V.secondary;
  const on = h && !disabled && !active;
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: size,
        height: size,
        flex: "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        borderRadius: "50%",
        background: on && variant === "secondary" ? "var(--rosa-100)" : v.bg,
        color: v.fg,
        border: `var(--border-hair) solid ${on ? "var(--vino-900)" : v.bd}`,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        boxShadow: shadow ? "var(--shadow-soft)" : "none",
        transition: "background var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out)",
        ...style,
      }}
    >
      <Icon name={icon} size={Math.round(size * 0.42)} />
    </button>
  );
}
