import { readFile } from "node:fs/promises";

const catalog = JSON.parse(
  await readFile(new URL("../src/data/places.json", import.meta.url), "utf8")
);

const errors = [];
const warnings = [];
const ids = new Set();
const featuredOrders = new Map();
const featuredApprovalStates = new Set(["pending-ashley-review", "approved"]);

for (const [index, place] of catalog.places.entries()) {
  const label = place.id || `row ${index + 1}`;
  if (!place.id) errors.push(`row ${index + 1}: missing id`);
  if (!place.name) errors.push(`${label}: missing name`);
  if (ids.has(place.id)) errors.push(`${label}: duplicate id`);
  ids.add(place.id);
  if (!catalog.categories[place.category]) errors.push(`${label}: unknown category ${place.category}`);
  if (!place.group) errors.push(`${label}: missing group`);
  if ((place.lat == null) !== (place.lng == null)) errors.push(`${label}: incomplete coordinate pair`);
  if (place.pick && (!place.pick.text?.trim() || !place.pick.approvedOn)) {
    errors.push(`${label}: a pick needs text and an approvedOn date`);
  }
  if ((place.featuredOrder == null) !== (place.featuredApprovalState == null)) {
    errors.push(`${label}: featured order and approval state must be set together`);
  }
  if (place.featuredOrder != null) {
    if (!Number.isInteger(place.featuredOrder) || place.featuredOrder < 1) {
      errors.push(`${label}: featured order must be a positive integer`);
    } else if (featuredOrders.has(place.featuredOrder)) {
      errors.push(`${label}: duplicate featured order ${place.featuredOrder}`);
    } else {
      featuredOrders.set(place.featuredOrder, label);
    }
    if (!featuredApprovalStates.has(place.featuredApprovalState)) {
      errors.push(`${label}: invalid featured approval state ${place.featuredApprovalState}`);
    }
  }
  if (!place.neighborhood && (place.lat == null || place.lng == null)) {
    warnings.push(`${label}: no exact coordinates or neighborhood fallback`);
  }
}

const orderedFeatured = [...featuredOrders.keys()].sort((a, b) => a - b);
for (const [index, order] of orderedFeatured.entries()) {
  if (order !== index + 1) errors.push(`featured order must be contiguous from 1; found ${order} at position ${index + 1}`);
}

if (errors.length) {
  console.error(`Catalog QA failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Catalog QA passed: ${catalog.places.length} places, ${ids.size} unique ids.`);
  console.log(`Featured config passed: ${featuredOrders.size} explicitly ordered candidate(s).`);
}

if (warnings.length) {
  console.log(`${warnings.length} place(s) require an honest unpinned list state:`);
  for (const warning of warnings) console.log(`- ${warning}`);
}
