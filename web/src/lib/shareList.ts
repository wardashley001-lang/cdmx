import type { Place } from "../types";

const SITE = "https://laguerasguide.com";

/** Plain-text version of a saved list: names, neighborhoods, map links. Works in any app. */
export function listText(places: Place[]): string {
  const lines = places.map((p) => {
    const where = [p.neighborhood, p.address].filter(Boolean).join(" · ");
    return [`• ${p.name}${where ? ` (${where})` : ""}`, p.mapsUrl ? `  ${p.mapsUrl}` : ""].filter(Boolean).join("\n");
  });
  return [`My Mexico City list (${places.length} ${places.length === 1 ? "spot" : "spots"})`, "", ...lines, "", `From La Güera's Guide: ${SITE}`].join("\n");
}

export const canNativeShare = () => typeof navigator !== "undefined" && typeof navigator.share === "function";

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers or blocked clipboard: fall back to a temporary textarea.
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}
