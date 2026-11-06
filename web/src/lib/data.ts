import raw from "../data/places.json";
import type { Place, PlacesData } from "../types";
import { NEIGHBORHOOD_CENTROIDS, jitter } from "../data/neighborhoods";

export const DATA = raw as PlacesData;

export const CATEGORY_ORDER = Object.keys(DATA.categories);

export function placesByCategory(categoryId: string) {
  return DATA.places
    .filter((p) => p.category === categoryId)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function categoryCount(categoryId: string) {
  return DATA.places.filter((p) => p.category === categoryId).length;
}

/** Resolves display coordinates: exact if known, else a jittered neighborhood centroid. */
export function resolveCoords(
  place: Place,
  jitterIndex = 0
): { lat: number; lng: number; approximate: boolean } | null {
  if (place.lat != null && place.lng != null) {
    return { lat: place.lat, lng: place.lng, approximate: false };
  }
  if (place.neighborhood && NEIGHBORHOOD_CENTROIDS[place.neighborhood]) {
    const [lat, lng] = NEIGHBORHOOD_CENTROIDS[place.neighborhood];
    const [dLat, dLng] = jitter(place.id, jitterIndex);
    return { lat: lat + dLat, lng: lng + dLng, approximate: true };
  }
  return null;
}

export function mapsSearchUrl(name: string, address?: string | null) {
  const query = address ? `${name}, ${address}` : `${name} Ciudad de Mexico`;
  return "https://maps.google.com/?q=" + encodeURIComponent(query);
}

export function instagramUrl(handle: string) {
  return `https://instagram.com/${handle}`;
}

/** Resolves a place photo (files live in web/public/photos). */
export function photoUrl(place: Place): string | null {
  if (!place.image) return null;
  return `${import.meta.env.BASE_URL}${place.image.replace(/^\//, "")}`;
}

export type SectionId =
  | "hot"
  | "michelin"
  | "essentials"
  | "tacos"
  | "eat"
  | "drinks"
  | "coffee"
  | "beyond";

/**
 * Every place lives in exactly one section. Priority:
 * Tacos > Michelin > Hot > Essentials > its everyday group.
 * (Taquerías keep their Michelin badge inside the Tacos list.)
 */
export function sectionOf(place: Place): SectionId {
  if (place.category === "tacos") return "tacos";
  if (place.michelin) return "michelin";
  if (place.hot) return "hot";
  if (place.essential) return "essentials";
  return place.group;
}

/** The note to show for a place: Ashley's approved pick text if it has one, else the researched description. */
export function noteOf(place: Place): string | null {
  return place.pick?.text ?? place.vibe;
}

/** Ashley's order for La Güera's Picks (also used for the map list). */
export const PICK_ORDER = ["bars-el-silverio", "italian-bot-nico", "italian-lalo-roma-norte", "mexican-la-once-mil-roma-norte"];

/** Map list order: picks first, then New & hot, then other places with photos, then the rest (stable). */
export function mapListRank(p: { id: string; pick?: unknown; featuredOrder?: number | null; image?: string | null }): number {
  if (p.pick) {
    const i = PICK_ORDER.indexOf(p.id);
    return i === -1 ? PICK_ORDER.length : i;
  }
  if (p.featuredOrder != null) return 100 + p.featuredOrder;
  if (p.image) return 500;
  return 1000;
}
