import raw from "../data/places.json";
import type { PlacesData } from "../types";
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
  place: PlacesData["places"][number],
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
