import type { Group } from "../types";

/**
 * The design system's own taxonomy is 6 buckets (comer/beber/cafe/bailar/
 * tienda/ver). Our real category list is more granular (21 cuisines/
 * activities), so each one is mapped onto a bucket for color + icon,
 * keeping the brand's restrained palette instead of inventing a hue per
 * category.
 */
export type DsBucket = "comer" | "beber" | "cafe" | "bailar" | "tienda" | "ver";

export const BUCKET_STYLE: Record<DsBucket, { bg: string; fg: string }> = {
  comer: { bg: "var(--cat-comer)", fg: "var(--leche-0)" },
  beber: { bg: "var(--cat-beber)", fg: "var(--vino-900)" },
  cafe: { bg: "var(--cat-cafe)", fg: "var(--vino-900)" },
  bailar: { bg: "var(--cat-bailar)", fg: "var(--vino-900)" },
  tienda: { bg: "var(--cat-tienda)", fg: "var(--vino-900)" },
  ver: { bg: "var(--cat-ver)", fg: "var(--rosa-200)" },
};

export interface CategoryStyle {
  label: string;
  group: Group;
  bucket: DsBucket;
  icon: string;
}

export const CATEGORY_STYLE: Record<string, CategoryStyle> = {
  mexican: { label: "Mexican", group: "eat", bucket: "comer", icon: "chef-hat" },
  tacos: { label: "Tacos", group: "eat", bucket: "comer", icon: "flame" },
  seafood: { label: "Seafood", group: "eat", bucket: "comer", icon: "fish" },
  italian: { label: "Italian & Pizza", group: "eat", bucket: "comer", icon: "pizza" },
  japanese: { label: "Japanese & Asian", group: "eat", bucket: "comer", icon: "soup" },
  french: { label: "French", group: "eat", bucket: "comer", icon: "croissant" },
  mediterranean: { label: "Mediterranean", group: "eat", bucket: "comer", icon: "sun" },
  american: { label: "American", group: "eat", bucket: "comer", icon: "beef" },
  contemporary: { label: "Contemporary", group: "eat", bucket: "comer", icon: "gem" },
  brunch: { label: "Brunch", group: "eat", bucket: "comer", icon: "egg-fried" },
  healthy: { label: "Healthy", group: "eat", bucket: "comer", icon: "leaf" },
  bars: { label: "Bars", group: "drinks", bucket: "beber", icon: "martini" },
  wine: { label: "Wine", group: "drinks", bucket: "beber", icon: "wine" },
  nightlife: { label: "Nightlife", group: "drinks", bucket: "bailar", icon: "disc-3" },
  cafe: { label: "Café", group: "coffee", bucket: "cafe", icon: "coffee" },
  bakery: { label: "Bakery", group: "coffee", bucket: "cafe", icon: "croissant" },
  dessert: { label: "Dessert", group: "coffee", bucket: "cafe", icon: "ice-cream-cone" },
  stores: { label: "Shops & Markets", group: "beyond", bucket: "tienda", icon: "shopping-bag" },
  salons: { label: "Beauty & Wellness", group: "beyond", bucket: "tienda", icon: "flower-2" },
  attractions: { label: "Sights", group: "beyond", bucket: "ver", icon: "landmark" },
  daytrips: { label: "Day Trips", group: "beyond", bucket: "ver", icon: "compass" },
};

export const GROUP_LABEL: Record<Group, string> = {
  eat: "Eat",
  drinks: "Drinks",
  coffee: "Coffee & Sweets",
  beyond: "Beyond Food",
};

export const GROUP_ORDER: Group[] = ["eat", "drinks", "coffee", "beyond"];
