import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { IconButton } from "./IconButton";

export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  ariaLabel?: string;
  children?: ReactNode;
  footer?: ReactNode;
  variant?: "modal" | "sheet";
  width?: number;
  tone?: "leche" | "rosa" | "vino";
  style?: CSSProperties;
}

export function Dialog({ open, onClose, title, ariaLabel, children, footer, variant = "modal", width = 520, tone = "leche", style }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((element) => !element.hasAttribute("hidden") && element.getAttribute("aria-hidden") !== "true");

    requestAnimationFrame(() => (focusable()[0] ?? dialog)?.focus());
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose();
      if (e.key !== "Tab" || !dialog) return;
      const elements = focusable();
      if (elements.length === 0) {
        e.preventDefault();
        dialog.focus();
        return;
      }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (e.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", k);
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title ? undefined : ariaLabel}
        tabIndex={-1}
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
            {onClose && <IconButton icon="x" label="Cerrar" variant={dark ? "inverse" : "secondary"} onClick={onClose} />}
          </div>
        )}
        {children}
        {footer && <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24, flexWrap: "wrap" }}>{footer}</div>}
      </div>
    </div>
  );
}
