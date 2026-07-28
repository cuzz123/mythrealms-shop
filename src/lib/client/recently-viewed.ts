import { useSyncExternalStore } from "react";

const RECENTLY_VIEWED_KEY = "mythrealms-recently-viewed";
const EMPTY_SLUGS: string[] = [];

let cachedRawValue: string | null | undefined;
let cachedSlugs = EMPTY_SLUGS;

export function readRecentlyViewedSlugs(
  storage: Pick<Storage, "getItem"> | null,
): string[] {
  const raw = storage?.getItem(RECENTLY_VIEWED_KEY);
  if (!raw) return EMPTY_SLUGS;

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every((slug) => typeof slug === "string")
      ? parsed.slice(0, 4)
      : EMPTY_SLUGS;
  } catch {
    return EMPTY_SLUGS;
  }
}

function getRecentlyViewedSnapshot(): string[] {
  const raw = window.localStorage.getItem(RECENTLY_VIEWED_KEY);
  if (raw === cachedRawValue) return cachedSlugs;

  cachedRawValue = raw;
  cachedSlugs = readRecentlyViewedSlugs(window.localStorage);
  return cachedSlugs;
}

function subscribe() {
  return () => {};
}

export function useRecentlyViewedSlugs(): string[] {
  return useSyncExternalStore(subscribe, getRecentlyViewedSnapshot, () => EMPTY_SLUGS);
}
