export type ColorToken =
  | "wine"
  | "crimson"
  | "cherry"
  | "terracotta"
  | "rust"
  | "tan"
  | "amber"
  | "mustard"
  | "gold"
  | "blush"
  | "fuchsia"
  | "magenta"
  | "orchid"
  | "plum"
  | "navy"
  | "slate"
  | "denim"
  | "teal"
  | "sage"
  | "olive"
  | "taupe";

export type PriceTier = "$" | "$$" | "$$$" | "$$$$";

export type OccasionTag =
  | "romantic"
  | "trendy"
  | "casual"
  | "lively atmosphere"
  | "good for lunch"
  | "good for dinner"
  | "outdoor";

export interface CategoryMeta {
  label: string;
  token: ColorToken;
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
}

export interface PlacesData {
  categories: Record<string, CategoryMeta>;
  places: Place[];
}
