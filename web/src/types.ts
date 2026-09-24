export type PriceTier = "$" | "$$" | "$$$" | "$$$$";

export type OccasionTag =
  | "romantic"
  | "trendy"
  | "casual"
  | "lively atmosphere"
  | "good for lunch"
  | "good for dinner"
  | "outdoor";

export type Group = "eat" | "drinks" | "coffee" | "beyond";

export type MichelinLevel = "two-star" | "one-star" | "bib" | "green-star";

export interface Michelin {
  level: MichelinLevel;
  year?: number;
  /** Newly awarded in the latest guide. */
  new?: boolean;
  /** Short caveat shown on the card (e.g. which location holds the star). */
  note?: string;
}

export interface CategoryMeta {
  label: string;
  group: Group;
}

export interface Place {
  id: string;
  name: string;
  category: string;
  mapsUrl: string;
  neighborhood: string | null;
  instagram: string | null;
  vibe: string | null;
  lat: number | null;
  lng: number | null;
  priceTier: PriceTier | null;
  occasionTags: OccasionTag[];
  sourceFile: string;
  /** Which top-level section of the guide the place lives in. */
  group: Group;
  hot?: boolean;
  essential?: boolean;
  michelin?: Michelin;
  /** Path under web/public, e.g. "photos/contramar.jpg". */
  image?: string | null;
}

export interface PlacesData {
  meta?: { updated?: string };
  categories: Record<string, CategoryMeta>;
  places: Place[];
}
