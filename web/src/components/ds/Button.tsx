import { useState, type CSSProperties, type ReactNode } from "react";
import { Icon } from "./Icon";

type Size = "sm" | "md" | "lg";
type Variant = "primary" | "pink" | "secondary" | "inverse" | "ghost" | "loud";

const SIZES: Record<Size, { h: number; px: number; fs: number; ic: number }> = {
  sm: { h: 36, px: 16, fs: 11, ic: 14 },
  md: { h: 46, px: 24, fs: 12, ic: 16 },
  lg: { h: 56, px: 32, fs: 13, ic: 18 },
};

const VARIANTS: Record<Variant, { bg: string; fg: string; bd: string; hbg: string; hfg: string; hbd: string }> = {
  primary: { bg: "var(--vino-800)", fg: "var(--rosa-200)", bd: "var(--vino-800)", hbg: "var(--rosa-500)", hfg: "var(--vino-900)", hbd: "var(--rosa-500)" },
  pink: { bg: "var(--rosa-500)", fg: "var(--vino-900)", bd: "var(--rosa-500)", hbg: "var(--vino-800)", hfg: "var(--rosa-200)", hbd: "var(--vino-800)" },
  secondary: { bg: "transparent", fg: "var(--vino-900)", bd: "var(--vino-900)", hbg: "var(--vino-900)", hfg: "var(--rosa-200)", hbd: "var(--vino-900)" },
  inverse: { bg: "transparent", fg: "var(--rosa-200)", bd: "var(--rosa-200)", hbg: "var(--rosa-200)", hfg: "var(--vino-900)", hbd: "var(--rosa-200)" },
  ghost: { bg: "transparent", fg: "currentColor", bd: "transparent", hbg: "transparent", hfg: "currentColor", hbd: "transparent" },
  loud: { bg: "var(--rosa-500)", fg: "var(--vino-900)", bd: "var(--rosa-500)", hbg: "var(--vino-800)", hfg: "var(--rosa-200)", hbd: "var(--vino-800)" },
};

export interface ButtonProps {
  children?: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: string;
  iconRight?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  href?: string;
  target?: string;
  rel?: string;
  style?: CSSProperties;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  fullWidth,
  disabled,
  onClick,
  type = "button",
  href,
  style,
  ...rest
}: ButtonProps) {
  const [h, setH] = useState(false);
  const [p, setP] = useState(false);
  const s = SIZES[size] ?? SIZES.md;
  const v = VARIANTS[variant] ?? VARIANTS.primary;
  const on = h && !disabled;
  const ghost = variant === "ghost";

  const st: CSSProperties = {
    display: fullWidth ? "flex" : "inline-flex",
    width: fullWidth ? "100%" : undefined,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: s.h,
    padding: ghost ? "0 2px" : `0 ${s.px}px`,
    fontFamily: "var(--font-caps)",
    fontWeight: 700,
    fontSize: s.fs,
    letterSpacing: ".16em",
    textTransform: "uppercase",
    lineHeight: 1,
    whiteSpace: "nowrap",
    background: on ? v.hbg : v.bg,
    color: on ? v.hfg : v.fg,
    border: `var(--border-w) solid ${on ? v.hbd : v.bd}`,
    borderRadius: "var(--radius-pill)",
    textDecoration: ghost ? "underline" : "none",
    textDecorationThickness: 1,
    textUnderlineOffset: 6,
    textDecorationColor: ghost && on ? "var(--rosa-500)" : "currentColor",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    transform: p && !disabled ? "scale(.97)" : "none",
    transition:
      "background var(--dur-base) var(--ease-out),color var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out),transform var(--dur-fast) var(--ease-out)",
    ...style,
  };

  const content = (
    <>
      {icon && <Icon name={icon} size={s.ic} />}
      {children}
      {iconRight && (
        <Icon
          name={iconRight}
          size={s.ic}
          style={{ transform: on ? "translateX(3px)" : "none", transition: "transform var(--dur-base) var(--ease-out)" }}
        />
      )}
    </>
  );

  const handlers = {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => {
      setH(false);
      setP(false);
    },
    onMouseDown: () => setP(true),
    onMouseUp: () => setP(false),
  };

  if (href) {
    return (
      <a href={href} style={st} onClick={disabled ? undefined : onClick} {...handlers} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} disabled={disabled} onClick={disabled ? undefined : onClick} style={st} {...handlers} {...rest}>
      {content}
    </button>
  );
}
