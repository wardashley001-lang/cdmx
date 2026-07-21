import type { CategoryMeta, Place } from "../types";

// Small, pragmatic keyword -> category alias table. Not an exhaustive
// cuisine index — just covers common search terms that don't already
// appear literally in enough vibe lines or category labels to be found
// by substring matching alone.
const KEYWORD_ALIASES: Record<string, string[]> = {
  taco: ["mexican"],
  tacos: ["mexican"],
  taqueria: ["mexican"],
  antojitos: ["mexican"],
  sushi: ["japanese"],
  ramen: ["japanese"],
  omakase: ["japanese"],
  izakaya: ["japanese"],
  pizza: ["italian"],
  pasta: ["italian"],
  trattoria: ["italian"],
  burger: ["american"],
  burgers: ["american"],
  steak: ["american"],
  bbq: ["american"],
  hummus: ["mediterranean"],
  shawarma: ["mediterranean"],
  falafel: ["mediterranean"],
  tapas: ["mediterranean"],
  bistro: ["french"],
  mezcal: ["bars", "nightlife"],
  cocktail: ["bars", "nightlife"],
  cocktails: ["bars", "nightlife"],
  coffee: ["cafe"],
  rooftop: ["bars", "nightlife"],
  vegan: ["healthy"],
  vegetarian: ["healthy"],
  speakeasy: ["bars", "nightlife"],
  jazz: ["nightlife"],
  club: ["nightlife"],
  dancing: ["nightlife"],
  shopping: ["stores"],
  museum: ["attractions"],
  nails: ["salons"],
  spa: ["salons"],
  massage: ["salons"],
};

const COMBINING_MARKS = /[̀-ͯ]/g;

function normalize(text: string): string {
  return text.normalize("NFKD").replace(COMBINING_MARKS, "").toLowerCase();
}

export function searchPlaces(
  places: Place[],
  categories: Record<string, CategoryMeta>,
  query: string,
  limit = 24
): Place[] {
  const q = normalize(query.trim());
  if (!q) return [];

  const aliasCategories = new Set(KEYWORD_ALIASES[q] ?? []);

  const results = places.filter((p) => {
    if (normalize(p.name).includes(q)) return true;
    if (p.neighborhood && normalize(p.neighborhood).includes(q)) return true;
    if (p.vibe && normalize(p.vibe).includes(q)) return true;
    const categoryLabel = categories[p.category]?.label;
    if (categoryLabel && normalize(categoryLabel).includes(q)) return true;
    if (p.occasionTags.some((t) => normalize(t).includes(q))) return true;
    if (aliasCategories.has(p.category)) return true;
    return false;
  });

  return results.slice(0, limit);
}
