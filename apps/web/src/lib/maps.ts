export function mapsLink(address: string, overrideUrl: string): string {
  if (overrideUrl.trim()) return overrideUrl.trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
