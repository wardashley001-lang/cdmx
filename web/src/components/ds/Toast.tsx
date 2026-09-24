import type { CSSProperties, ReactNode } from "react";
import { Icon } from "./Icon";

type Variant = "ink" | "rosa" | "leche" | "lima";

const V: Record<Variant, { bg: string; fg: string; ic: string }> = {
  ink: { bg: "var(--vino-900)", fg: "var(--rosa-200)", ic: "var(--rosa-500)" },
  rosa: { bg: "var(--rosa-500)", fg: "var(--vino-900)", ic: "var(--vino-900)" },
  leche: { bg: "var(--leche-50)", fg: "var(--vino-900)", ic: "var(--rosa-500)" },
  lima: { bg: "var(--leche-50)", fg: "var(--vino-900)", ic: "var(--rosa-500)" },
};

export interface ToastProps {
  children?: ReactNode;
  icon?: string;
  variant?: Variant;
  action?: string;
  onAction?: () => void;
  style?: CSSProperties;
}

export function Toast({ children, icon = "sparkles", variant = "ink", action, onAction, style }: ToastProps) {
  const v = V[variant] ?? V.ink;
  return (
    <div
      role="status"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        minHeight: 50,
        padding: "8px 8px 8px 18px",
        background: v.bg,
        color: v.fg,
        borderRadius: 999,
        boxShadow: "var(--shadow-float)",
        font: "italic 400 17px var(--font-serif)",
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={16} color={v.ic} />}
      <span style={{ paddingRight: action ? 0 : 10 }}>{children}</span>
      {action && (
        <button
          type="button"
          onClick={onAction}
          style={{
            height: 34,
            padding: "0 14px",
            borderRadius: 999,
            border: "1px solid currentColor",
            background: "transparent",
            color: "inherit",
            fontFamily: "var(--font-caps)",
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
}
