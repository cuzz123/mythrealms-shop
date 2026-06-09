// GET /api/feed/google — Google Merchant Center XML product feed

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mythrealms-shop.vercel.app";
  const products = await db.product.findMany({
    where: { isActive: true },
    include: {
      variants: { orderBy: { price: "asc" } },
      category: { select: { name: true } },
    },
  });

  const items = products.map((p) => {
    const images = JSON.parse(p.images as string) as string[];
    const minPrice = Math.min(...p.variants.map((v) => v.price));
    const availability = p.variants.some((v) => v.stock > 0) ? "in_stock" : "out_of_stock";

    return `  <item>
    <g:id>${p.id}</g:id>
    <g:title>${escapeXml(p.name)}</g:title>
    <g:description>${escapeXml(p.description.slice(0, 500))}</g:description>
    <g:link>${baseUrl}/products/${p.slug}</g:link>
    <g:image_link>${images[0]?.startsWith("http") ? images[0] : `${baseUrl}${images[0]}`}</g:image_link>
    <g:price>${minPrice.toFixed(2)} USD</g:price>
    <g:availability>${availability}</g:availability>
    <g:condition>new</g:condition>
    <g:brand>MythRealms</g:brand>
    <g:google_product_category>188</g:google_product_category>
    <g:product_type>${escapeXml(p.category?.name || "")}</g:product_type>
  </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
  <title>MythRealms</title>
  <link>${baseUrl}</link>
  <description>Luxury jewelry inspired by Chinese mythology — the Classic of Mountains and Seas</description>
${items.join("\n")}
</channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
