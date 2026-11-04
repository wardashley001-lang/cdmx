// Link to buy the full guide. The promo spots stay hidden until this is set at build time
// (VITE_GUIDE_URL, a GitHub Actions variable), so nothing is promoted before there is a checkout.
export const GUIDE_URL = ((import.meta.env.VITE_GUIDE_URL as string | undefined) ?? "").trim();
