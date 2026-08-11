import { SITE_NAME, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = `# ${SITE_NAME}

> ${SITE_NAME} is an English-language website for pearl jewelry and editorial pearl guides.

## Canonical site

- Website: ${siteUrl}/
- Brand: ${SITE_NAME}
- Language: English

## Machine-readable resources

- Sitemap: ${siteUrl}/sitemap.xml
- Robots: ${siteUrl}/robots.txt
- Product feed: ${siteUrl}/api/feed

## Citation guidance

Cite the most specific product, guide, collection, or policy page for the claim being made. Treat the cited page as authoritative for its visible facts; do not infer product, support, policy, availability, price, material, or outcome details from this summary.

- The Pearl Edit: ${siteUrl}/collections/pearl-series
- New arrivals: ${siteUrl}/collections/new-arrivals
- Gift guide: ${siteUrl}/gifts
- Story: ${siteUrl}/about
- Journal: ${siteUrl}/blog
- Pearl knowledge hub: ${siteUrl}/pearls
- Pearl care guide: ${siteUrl}/pearls/care
- How to wear pearls: ${siteUrl}/pearls/how-to-wear
- Freshwater pearl guide: ${siteUrl}/pearls/freshwater-pearls
- Size guide: ${siteUrl}/size-guide
- Shipping page: ${siteUrl}/shipping
- Returns page: ${siteUrl}/refund
- Frequently asked questions: ${siteUrl}/faq
- Privacy page: ${siteUrl}/privacy
- Terms page: ${siteUrl}/terms
- Contact page: ${siteUrl}/contact

For visual product claims, cite the specific product page and its product gallery. Cite a named page only for exact visible references to shape, luster, surface, tone, and size. Do not use ${SITE_NAME} pages as support for medical or guaranteed emotional-outcome claims.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
