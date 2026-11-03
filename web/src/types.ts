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

export type FeaturedApprovalState = "pending-ashley-review" | "approved";

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

export interface PlaceSource {
  label: string;
  checkedOn: string;
  url?: string;
  note?: string;
}

export interface Place {
  id: string;
  name: string;
  category: string;
  mapsUrl: string;
  neighborhood: string | null;
  address?: string | null;
  hours?: string | null;
  instagram: string | null;
  vibe: string | null;
  lat: number | null;
  lng: number | null;
  priceTier: PriceTier | null;
  occasionTags: OccasionTag[];
  sourceFile: string;
  sources?: PlaceSource[];
  unverifiedFields?: string[];
  /** Which top-level section of the guide the place lives in. */
  group: Group;
  hot?: boolean;
  /** Ashley-approved first-person note. Only places with this get the "Güera's pick" stamp and signature. */
  pick?: { text: string; approvedOn: string };
  /** Explicit Home candidate order; independent from raw JSON position. */
  featuredOrder?: number;
  /** Approval gate for the ordered Home candidate surface. */
  featuredApprovalState?: FeaturedApprovalState;
  essential?: boolean;
  michelin?: Michelin;
  /** Path under web/public, e.g. "photos/contramar.jpg". */
  image?: string | null;
  imageCredit?: string;
  gallery?: string[];
}

export interface PlacesData {
  meta?: {
    /** Legacy source-batch label; not presented as a whole-catalog verification date. */
    updated?: string;
    /** Date the local catalog structure/content was last revised. */
    catalogRevisedOn?: string;
    /** Latest source-check date shared by the ordered featured candidates. */
    featuredSourcesCheckedOn?: string;
  };
  categories: Record<string, CategoryMeta>;
  places: Place[];
}
