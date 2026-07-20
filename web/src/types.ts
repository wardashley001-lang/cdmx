export type ColorToken = "pink" | "cobalt" | "ochre" | "terracotta" | "violet";
export type PriceTier = "$" | "$$" | "$$$" | "$$$$";

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
  sourceFile: string;
}

export interface PlacesData {
  categories: Record<string, CategoryMeta>;
  places: Place[];
}
