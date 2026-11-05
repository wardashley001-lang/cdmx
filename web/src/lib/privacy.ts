// Details for the privacy page. The page, its footer link and the email signup all stay hidden
// until every field below is filled in by Ashley. Do not invent values.
export const PRIVACY = {
  /** Name as it should appear, e.g. a legal or creator name. */
  sellerName: "Ashley Ward",
  /** Operating country, e.g. "United States" or "Mexico". */
  country: "Mexico",
  /** Where people send privacy or unsubscribe questions. */
  contactEmail: "contact.ashward@gmail.com",
  /** Last updated date as shown on the page, e.g. "November 5, 2026". */
  updated: "November 5, 2026",
};

export const PRIVACY_READY = Object.values(PRIVACY).every((v) => v.trim() !== "");
