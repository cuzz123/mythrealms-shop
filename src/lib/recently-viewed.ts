export const RECENTLY_VIEWED_STORAGE_KEY = "maverenne-recently-viewed";
// Read once to migrate existing browser state; all writes use the Maverenne key.
export const LEGACY_RECENTLY_VIEWED_STORAGE_KEY = "mythrealms-recently-viewed";

type RecentlyViewedStorage = Pick<Storage, "getItem" | "setItem">;

function readSlugs(storage: RecentlyViewedStorage, key: string): string[] {
  try {
    const value = storage.getItem(key);
    if (!value) return [];
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((slug): slug is string => typeof slug === "string" && slug.length > 0);
  } catch {
    return [];
  }
}

export function readRecentlyViewed(
  storage: RecentlyViewedStorage,
  limit = 6,
): string[] {
  const current = readSlugs(storage, RECENTLY_VIEWED_STORAGE_KEY);
  const legacy = readSlugs(storage, LEGACY_RECENTLY_VIEWED_STORAGE_KEY);
  const merged = [...new Set([...current, ...legacy])].slice(0, limit);

  if (legacy.length > 0 && merged.length > 0 && JSON.stringify(merged) !== JSON.stringify(current.slice(0, limit))) {
    try {
      storage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(merged));
    } catch {
      // Private browsing or storage quotas must not break the storefront.
    }
  }

  return merged;
}

export function recordRecentlyViewed(
  storage: RecentlyViewedStorage,
  slug: string,
  limit = 6,
): string[] {
  const current = readRecentlyViewed(storage, limit);
  const updated = [slug, ...current.filter((item) => item !== slug)].slice(0, limit);
  try {
    storage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Private browsing or storage quotas must not break the storefront.
  }
  return updated;
}
