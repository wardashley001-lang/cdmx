import type { CSSProperties } from "react";
import { iconAssetUrl } from "../../lib/iconAsset";

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  label?: string;
  style?: CSSProperties;
  className?: string;
}

/** Lucide icon rendered as a CSS mask so it inherits `color`. */
export function Icon({ name, size = 20, color = "currentColor", label, style, className }: IconProps) {
  const url = iconAssetUrl(name);
  const mask = `url(${url}) center/contain no-repeat`;
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        flex: "none",
        backgroundColor: color,
        WebkitMask: mask,
        mask,
        verticalAlign: "middle",
        ...style,
      }}
    />
  );
}
