import { useEffect, type CSSProperties, type ReactNode } from "react";
import { IconButton } from "./IconButton";

export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children?: ReactNode;
  footer?: ReactNode;
  variant?: "modal" | "sheet";
  width?: number;
  tone?: "leche" | "rosa" | "vino";
  style?: CSSProperties;
}

export function Dialog({ open, onClose, title, children, footer, variant = "modal", width = 520, tone = "leche", style }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);

  if (!open) return null;
  const sheet = variant === "sheet";
  const dark = tone === "vino";
  const bg = tone === "rosa" ? "var(--rosa-200)" : dark ? "var(--vino-800)" : "var(--leche-50)";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "var(--surface-overlay)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: sheet ? "flex-end" : "center",
        justifyContent: "center",
        padding: sheet ? 0 : 24,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: sheet ? "100%" : width,
          maxHeight: "90vh",
          overflow: "auto",
          background: bg,
          color: dark ? "var(--rosa-200)" : "var(--vino-900)",
          borderRadius: sheet ? "22px 22px 0 0" : "var(--radius-md)",
          boxShadow: "var(--shadow-float)",
          padding: sheet ? "10px 20px 28px" : "28px",
          ...style,
        }}
      >
        {sheet && <div style={{ width: 40, height: 4, borderRadius: 2, background: "currentColor", opacity: 0.25, margin: "0 auto 14px" }} />}
        {(title || onClose) && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: title ? 16 : 0,
              position: title ? "static" : "absolute",
              right: title ? undefined : sheet ? 16 : 18,
              top: title ? undefined : sheet ? 22 : 18,
              zIndex: 2,
            }}
          >
            {title && (
              <h2 style={{ flex: 1, margin: 0, fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 34, lineHeight: 1, letterSpacing: "-.01em" }}>
                {title}
              </h2>
            )}
            {onClose && <IconButton icon="x" label="Cerrar" size={38} variant={dark ? "inverse" : "secondary"} onClick={onClose} />}
          </div>
        )}
        {children}
        {footer && <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24, flexWrap: "wrap" }}>{footer}</div>}
      </div>
    </div>
  );
}
