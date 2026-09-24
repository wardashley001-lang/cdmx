import { useState, type CSSProperties } from "react";
import { Icon } from "./Icon";

export interface InputProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  icon?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  onClear?: () => void;
  type?: string;
  style?: CSSProperties;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function Input({ value, onChange, placeholder, icon, label, size = "md", onClear, type = "text", style, ...rest }: InputProps) {
  const [focus, setFocus] = useState(false);
  const h = size === "lg" ? 58 : size === "sm" ? 40 : 48;
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}>
      {label && (
        <span style={{ fontFamily: "var(--font-caps)", fontWeight: 700, fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-2)" }}>
          {label}
        </span>
      )}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          height: h,
          padding: "0 18px",
          background: "var(--leche-50)",
          border: `var(--border-hair) solid ${focus ? "var(--vino-900)" : "var(--line-soft)"}`,
          borderRadius: "var(--radius-pill)",
          boxShadow: focus ? "0 0 0 4px var(--rosa-200)" : "none",
          transition: "box-shadow var(--dur-base) var(--ease-out),border-color var(--dur-base)",
        }}
      >
        {icon && <Icon name={icon} size={17} color="var(--vino-700)" />}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange && onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{ flex: 1, minWidth: 0, border: 0, outline: 0, background: "transparent", font: `400 ${size === "lg" ? 17 : 15}px var(--font-sans)`, color: "var(--vino-900)" }}
          {...rest}
        />
        {onClear && value ? (
          <button
            type="button"
            aria-label="Clear"
            onClick={onClear}
            style={{ border: 0, background: "var(--rosa-100)", borderRadius: "50%", width: 24, height: 24, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--vino-900)" }}
          >
            <Icon name="x" size={13} />
          </button>
        ) : null}
      </span>
    </label>
  );
}
