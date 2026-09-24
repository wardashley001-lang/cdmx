import { useState, type CSSProperties } from "react";
import { Icon } from "./Icon";
import { CATEGORY_STYLE, BUCKET_STYLE } from "../../data/categoryStyle";

export interface MapPinProps {
  category: string;
  label?: string;
  selected?: boolean;
  number?: number;
  onClick?: () => void;
  style?: CSSProperties;
}

export function MapPin({ category, label, selected, number, onClick, style }: MapPinProps) {
  const [h, setH] = useState(false);
  const cat = CATEGORY_STYLE[category] ?? CATEGORY_STYLE.mexican;
  const c = BUCKET_STYLE[cat.bucket];
  const big = selected || h;
  const d = selected ? 44 : 34;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: onClick ? "pointer" : "default",
        zIndex: big ? 2 : 1,
        transform: `translateY(${big ? -3 : 0}px)`,
        transition: "transform var(--dur-base) var(--ease-out)",
        ...style,
      }}
    >
      <div
        style={{
          width: d,
          height: d,
          borderRadius: "50% 50% 50% 3px",
          transform: "rotate(-45deg)",
          background: selected ? "var(--vino-900)" : c.bg,
          border: "2px solid var(--leche-0)",
          boxShadow: "var(--shadow-pin)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "width var(--dur-base) var(--ease-out),height var(--dur-base) var(--ease-out),background var(--dur-base)",
        }}
      >
        <span style={{ transform: "rotate(45deg)", display: "inline-flex", color: selected ? c.bg : c.fg }}>
          {number != null ? (
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: selected ? 20 : 15 }}>{number}</span>
          ) : (
            <Icon name={cat.icon} size={selected ? 19 : 15} />
          )}
        </span>
      </div>
      {label && (selected || h) && (
        <span
          style={{
            position: "absolute",
            left: "100%",
            top: selected ? 9 : 5,
            marginLeft: 10,
            whiteSpace: "nowrap",
            background: "var(--vino-900)",
            color: "var(--rosa-200)",
            padding: "6px 12px",
            borderRadius: 999,
            font: "italic 400 14px var(--font-serif)",
            boxShadow: "var(--shadow-pin)",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
