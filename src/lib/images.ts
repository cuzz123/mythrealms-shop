/**
 * Resolve image URLs — local path in dev, Vercel Blob CDN in production.
 *
 * Set NEXT_PUBLIC_MEDIA_BASE in .env to your Blob store base URL:
 *   NEXT_PUBLIC_MEDIA_BASE=https://xxxx.public.blob.vercel-storage.com
 *
 * When not set, images resolve to local /images/ (existing behaviour).
 */

const BLOB_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE || "";

export function imageUrl(path: string): string {
  if (BLOB_BASE && path.startsWith("/images/")) {
    return `${BLOB_BASE}${path}`;
  }
  return path;
}
