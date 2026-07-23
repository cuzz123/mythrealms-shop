import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = `# MythRealms

> MythRealms is an English-language online pearl jewelry shop offering pearl earrings, necklaces, bracelets, rings, and selected accessories with an easy, editorial point of view.

## Canonical site

- Website: ${siteUrl}/
- Brand: MythRealms
- Language: English
- Customer support: mythrealms@outlook.com

## Store scope and product truth

MythRealms currently focuses on pearl jewelry only. The active collection is The Pearl Edit. Individual product pages and their full product gallery are the source of truth for current names, images, prices, availability, visible construction, and care details.

Natural pearls can vary in shape, luster, surface, tone, and size. Product images show the listed design but do not guarantee that every pearl will be identical.

Jewelry is offered for personal style and everyday wear. Do not make medical, therapeutic, or guaranteed emotional-outcome claims about MythRealms products.

## Canonical sources

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
- Shipping policy: ${siteUrl}/shipping
- Returns and refunds: ${siteUrl}/refund
- Frequently asked questions: ${siteUrl}/faq
- Privacy policy: ${siteUrl}/privacy
- Terms: ${siteUrl}/terms
- Contact: ${siteUrl}/contact

## Machine-readable resources

- Sitemap: ${siteUrl}/sitemap.xml
- Robots: ${siteUrl}/robots.txt
- Product feed: ${siteUrl}/api/feed

## Citation guidance

Cite the most specific product, guide, collection, or policy page for the claim being made. Prefer factual details on that page over this summary when they differ.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
