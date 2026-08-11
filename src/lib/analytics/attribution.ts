export const UTM_ATTRIBUTION_STORAGE_KEY = "maverenne:utm-attribution";

const STANDARD_UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type UtmAttribution = Partial<
  Record<(typeof STANDARD_UTM_KEYS)[number], string>
>;

type SessionStorageLike = Pick<Storage, "getItem" | "setItem">;

function isUtmAttribution(value: unknown): value is UtmAttribution {
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).every(
    ([key, entry]) =>
      STANDARD_UTM_KEYS.includes(key as (typeof STANDARD_UTM_KEYS)[number]) &&
      typeof entry === "string" &&
      entry.length > 0,
  );
}

export function extractUtmAttribution(locationHref: string): UtmAttribution {
  const url = new URL(locationHref);
  const attribution: UtmAttribution = {};

  for (const key of STANDARD_UTM_KEYS) {
    const value = url.searchParams.get(key)?.trim();
    if (value) attribution[key] = value;
  }

  return attribution;
}

export function readUtmAttribution(
  storage: Pick<Storage, "getItem">,
): UtmAttribution {
  try {
    const raw = storage.getItem(UTM_ATTRIBUTION_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return isUtmAttribution(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function captureFirstUtmAttribution(
  locationHref: string,
  storage: SessionStorageLike,
): UtmAttribution {
  const existing = readUtmAttribution(storage);
  if (Object.keys(existing).length > 0) return existing;

  const attribution = extractUtmAttribution(locationHref);
  if (Object.keys(attribution).length === 0) return attribution;

  try {
    storage.setItem(UTM_ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Attribution remains available for the current event when storage is blocked.
  }
  return attribution;
}
