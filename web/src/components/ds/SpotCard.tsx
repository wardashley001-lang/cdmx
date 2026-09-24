import { useState, type CSSProperties } from "react";
import { IconButton } from "./IconButton";
import { Tag } from "./Tag";
import { Badge } from "./Badge";
import { CATEGORY_STYLE, BUCKET_STYLE } from "../../data/categoryStyle";
import type { Michelin } from "../../types";

const MICHELIN_LABEL: Record<Michelin["level"], string> = {
  "two-star": "Michelin · 2 Stars",
  "one-star": "Michelin · 1 Star",
  bib: "Michelin · Bib Gourmand",
  "green-star": "Michelin · Green Star",
};

function Photo({ image, category, ratio, radius, zoom, label }: { image?: string | null; category: string; ratio: string; radius: number; zoom?: boolean; label?: boolean }) {
  const cat = CATEGORY_STYLE[category] ?? CATEGORY_STYLE.mexican;
  const c = BUCKET_STYLE[cat.bucket];
  const fill = image
    ? `url(${image}) center/cover`
    : `conic-gradient(rgba(42,7,16,.16) 25%,transparent 0 50%,rgba(42,7,16,.16) 0 75%,transparent 0) 0 0/36px 36px,${c.bg}`;
  return (
    <div style={{ position: "relative", aspectRatio: ratio, borderRadius: radius, overflow: "hidden", flex: "none", background: "var(--neutral-200)" }}>
      <div style={{ position: "absolute", inset: 0, background: fill, transform: zoom ? "scale(1.04)" : "none", transition: "transform var(--dur-slow) var(--ease-out)" }} />
      {!image && label && (
        <span style={{ position: "absolute", left: 10, bottom: 9, fontFamily: "var(--font-mono)", fontSize: 10, color: c.fg, opacity: 0.85 }}>
          foto · {cat.label.toLowerCase()}
        </span>
      )}
    </div>
  );
}

export interface SpotCardProps {
  name: string;
  neighborhood?: string | null;
  category: string;
  note?: string | null;
  price?: string | null;
  image?: string | null;
  hot?: boolean;
  essential?: boolean;
  michelin?: Michelin;
  saved?: boolean;
  onSave?: () => void;
  onClick?: () => void;
  layout?: "vertical" | "row";
  selected?: boolean;
  style?: CSSProperties;
}

export function SpotCard({
  name,
  neighborhood,
  category,
  note,
  price,
  image,
  hot,
  essential,
  michelin,
  saved,
  onSave,
  onClick,
  layout = "vertical",
  selected,
  style,
}: SpotCardProps) {
  const [h, setH] = useState(false);
  const on = h && !!onClick;
  const badge = hot ? "hot" : essential ? "pick" : undefined;

  const meta = (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      {neighborhood && (
        <span style={{ fontFamily: "var(--font-caps)", fontWeight: 700, fontSize: 9.5, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text-2)" }}>
          {neighborhood}
        </span>
      )}
      {michelin && (
        <Badge variant="ink" style={{ fontSize: 8.5 }}>
          {MICHELIN_LABEL[michelin.level]}
        </Badge>
      )}
    </div>
  );

  const title = (sz: number) => (
    <div style={{ fontFamily: "var(--font-serif)", fontStyle: on ? "italic" : "normal", fontWeight: 400, fontSize: sz, lineHeight: 1.02, letterSpacing: "-.01em", color: "var(--vino-900)" }}>
      {name}
    </div>
  );

  const heart = onSave && (
    <span onClick={(e) => e.stopPropagation()}>
      <IconButton icon="heart" label={saved ? "Remove" : "Guardar"} active={saved} size={layout === "row" ? 34 : 38} onClick={onSave} />
    </span>
  );

  if (layout === "row") {
    return (
      <div
        onClick={onClick}
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          display: "flex",
          gap: 14,
          padding: 10,
          borderRadius: "var(--radius-md)",
          background: selected ? "var(--rosa-100)" : on ? "rgba(247,202,216,.35)" : "transparent",
          cursor: onClick ? "pointer" : "default",
          transition: "background var(--dur-base) var(--ease-out)",
          ...style,
        }}
      >
        <div style={{ width: 88 }}>
          <Photo image={image} category={category} ratio="1/1" radius={4} zoom={on} />
        </div>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 5 }}>
          {meta}
          {title(21)}
          {note && (
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.45, color: "var(--text-3)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {note}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto" }}>
            <Tag category={category} size="sm" />
            {price && <Badge>{price}</Badge>}
            {badge && <Badge variant={badge} />}
          </div>
        </div>
        {heart}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ position: "relative", display: "flex", flexDirection: "column", gap: 14, cursor: onClick ? "pointer" : "default", textAlign: "left", ...style }}
    >
      <div style={{ position: "relative" }}>
        <Photo image={image} category={category} ratio="4/5" radius={4} zoom={on} label />
        {badge && <Badge variant={badge} shape="stamp" style={{ position: "absolute", top: 12, right: 12 }} />}
        {heart && <span style={{ position: "absolute", left: 12, top: 12 }}>{heart}</span>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {meta}
        {title(28)}
        {note && (
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.5, color: "var(--text-3)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {note}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 2 }}>
          <Tag category={category} size="sm" />
          {price && <Badge>{price}</Badge>}
        </div>
      </div>
    </div>
  );
}
