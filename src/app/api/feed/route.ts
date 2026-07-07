import { NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/1688-products";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://mythrealms-shop.vercel.app";

export async function GET() {
  const items = PRODUCTS.filter((p) => p.isActive && p.inStock)
    .map((p) => {
      const link = `${APP_URL}/products/${p.slug}`;
      const imageLink = p.image.startsWith("http") ? p.image : `${APP_URL}${p.image}`;
      const availability = p.inStock ? "in stock" : "out of stock";
      const condition = "new";
      const googleCategory = p.categoryName?.includes("Pearl")
        ? "Apparel & Accessories > Jewelry > Bracelets"
        : "Apparel & Accessories > Jewelry";

      return `
    <item>
      <g:id>${p.id}</g:id>
      <g:title>${escapeXml(p.name)}</g:title>
      <g:description>${escapeXml(p.description.slice(0, 5000))}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(imageLink)}</g:image_link>
      <g:additional_image_link>${p.images.slice(0, 5).map((img) => escapeXml(img.startsWith("http") ? img : `${APP_URL}${img}`)).join(",")}</g:additional_image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${p.price.toFixed(2)} USD</g:price>
      ${p.compareAt ? `<g:sale_price>${p.price.toFixed(2)} USD</g:sale_price>` : ""}
      <g:condition>${condition}</g:condition>
      <g:google_product_category>${googleCategory}</g:google_product_category>
      <g:brand>MythRealms</g:brand>
      <g:gtin></g:gtin>
      <g:mpn>${p.id}</g:mpn>
      <g:product_type>${escapeXml(p.categoryName || "")}</g:product_type>
      <g:custom_label_0>${escapeXml(p.category || "")}</g:custom_label_0>
      <g:custom_label_1>${p.intention || ""}</g:custom_label_1>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>MythRealms — Intention Crystal Jewelry</title>
    <link>${APP_URL}</link>
    <description>Hand-selected crystal and pearl jewelry. Each piece carries a singular intention.</description>
    ${items}
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
