// Approximate centroid coordinates for CDMX neighborhoods/colonias.
// Used to place map pins when a place doesn't yet have precise
// lat/lng from a GeoJSON Takeout export — swap in exact coordinates
// as they become available (see Place.lat / Place.lng).
export const NEIGHBORHOOD_CENTROIDS: Record<string, [number, number]> = {
  "Roma Norte": [19.4177, -99.1636],
  "Roma Sur": [19.4090, -99.1580],
  "Condesa": [19.4109, -99.1734],
  "Hipódromo": [19.4090, -99.1755],
  "Juárez": [19.4270, -99.1595],
  "Centro Histórico": [19.4326, -99.1332],
  "Polanco": [19.4326, -99.1946],
  "Nápoles": [19.3903, -99.1780],
  "Doctores": [19.4130, -99.1470],
  "Narvarte": [19.3970, -99.1560],
  "San Ángel": [19.3467, -99.1910],
  "Coyoacán": [19.3467, -99.1618],
  "Xochimilco": [19.2647, -99.1031],
  "Lomas de Chapultepec": [19.4225, -99.2119],
  "Chapultepec": [19.4204, -99.1817],
  "Tepotzotlán": [19.7144, -99.2249],
  "Tepotzotlán, State of Mexico (day trip)": [19.7144, -99.2249],
  "Anzures": [19.4291, -99.1830],
  "Cuauhtémoc": [19.4350, -99.1580],
  "Escandón": [19.4060, -99.1840],
  "Del Valle": [19.3826, -99.1660],
  "Santa María la Ribera": [19.4460, -99.1550],
  "Tlalpan": [19.2930, -99.1660],
  "Buenavista": [19.4453, -99.1508],
  "Roma": [19.4140, -99.1610],
  "Polanco (Nuevo Polanco)": [19.4406, -99.2050],
  "Naucalpan, State of Mexico (day trip)": [19.4747, -99.2394],
  "Teotihuacán, State of Mexico (day trip)": [19.6925, -98.8438],
  "Tula de Allende, Hidalgo (day trip)": [20.0667, -99.3333],
};

/** Deterministic small offset so multiple pins in one neighborhood don't fully overlap. */
export function jitter(seed: string, index: number): [number, number] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const angle = ((hash % 360) + index * 47) * (Math.PI / 180);
  const radius = 0.0035 + ((Math.abs(hash) % 100) / 100) * 0.004;
  return [Math.cos(angle) * radius, Math.sin(angle) * radius];
}
