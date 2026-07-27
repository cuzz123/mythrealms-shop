import { BRAND } from "./brand-identity";

export const SITE_NAME = BRAND.name;
export const DEFAULT_SITE_URL = "https://mythrealms-shop.vercel.app";

function normalizeSiteUrl(value: string): string {
  return value.replace(/\/+$/, "");
}

export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_APP_URL?.trim() || DEFAULT_SITE_URL,
);

export function absoluteUrl(path = "/"): string {
  return new URL(path, `${siteUrl}/`).toString();
}
