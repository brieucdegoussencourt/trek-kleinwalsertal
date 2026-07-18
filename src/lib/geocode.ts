// ============================================================
// Reverse geocoding via Nominatim (OpenStreetMap).
// Free, no key; usage policy asks for a UA and modest volume —
// we call it at most ~1/min per recording user and memoise per
// ~100 m grid cell for the lifetime of the server instance.
// ============================================================

const cache = new Map<string, string>();

export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<string | null> {
  const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;

  try {
    const url =
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2` +
      `&lat=${lat}&lon=${lng}&zoom=14&accept-language=fr`;
    const res = await fetch(url, {
      headers: { "User-Agent": "trek-kleinwalsertal/1.0 (personal hiking site)" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      address?: Record<string, string>;
      display_name?: string;
    };
    const a = data.address ?? {};
    const locality =
      a.village || a.town || a.city || a.hamlet || a.municipality || a.suburb;
    const region = a.state || a.county;
    const country = a.country;
    const place =
      [locality, region, country].filter(Boolean).join(", ") ||
      data.display_name?.split(",").slice(0, 3).join(",").trim() ||
      null;
    if (place) cache.set(key, place);
    return place;
  } catch {
    // offline / timeout — the log entry still stores the coordinates
    return null;
  }
}
