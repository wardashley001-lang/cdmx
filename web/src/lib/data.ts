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

export function mapsSearchUrl(name: string) {
  return "https://maps.google.com/?q=" + encodeURIComponent(name + " Ciudad de Mexico");
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
