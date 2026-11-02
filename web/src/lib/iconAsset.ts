const LUCIDE_VERSION = "0.460.0";

export function iconAssetUrl(name: string): string {
  return `${import.meta.env.BASE_URL}icons/lucide-${LUCIDE_VERSION}/${name}.svg`;
}
