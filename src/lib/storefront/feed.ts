import {
  getProductType,
  getStorefrontProducts,
  type StorefrontProductType,
} from "@/lib/storefront/catalog";

const PRODUCT_TYPE_LABELS: Record<StorefrontProductType, string> = {
  rings: "Pearl Rings",
  bracelets: "Pearl Bracelets",
  earrings: "Pearl Earrings",
  necklaces: "Pearl Necklaces",
  "hair-accessories": "Pearl Hair Accessories",
  "eyewear-chains": "Pearl Eyewear Chains",
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absoluteAssetUrl(baseUrl: string, assetUrl: string): string {
  return assetUrl.startsWith("http") ? assetUrl : `${baseUrl}${assetUrl}`;
}

export function buildStorefrontFeedXml(baseUrl: string): string {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const items = getStorefrontProducts()
    .map((product) => {
      const typeLabel = PRODUCT_TYPE_LABELS[getProductType(product)];
      const images = product.images
        .slice(1, 6)
        .map(
          (image) =>
            `      <g:additional_image_link>${escapeXml(absoluteAssetUrl(normalizedBaseUrl, image))}</g:additional_image_link>`,
        )
        .join("\n");
      const regularPrice = product.compareAt || product.price;
      const salePrice = product.compareAt
        ? `\n      <g:sale_price>${product.price.toFixed(2)} USD</g:sale_price>`
        : "";

      return `    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(product.description)}</g:description>
      <g:link>${escapeXml(`${normalizedBaseUrl}/products/${product.slug}`)}</g:link>
      <g:image_link>${escapeXml(absoluteAssetUrl(normalizedBaseUrl, product.image))}</g:image_link>
${images}
      <g:availability>in_stock</g:availability>
      <g:price>${regularPrice.toFixed(2)} USD</g:price>${salePrice}
      <g:condition>new</g:condition>
      <g:brand>MythRealms</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>Apparel &amp; Accessories &gt; Jewelry</g:google_product_category>
      <g:product_type>The Pearl Edit &gt; ${typeLabel}</g:product_type>
      <g:custom_label_0>${typeLabel}</g:custom_label_0>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>MythRealms - The Pearl Edit</title>
    <link>${escapeXml(normalizedBaseUrl)}</link>
    <description>Pearl earrings, necklaces, bracelets, and rings for everyday wear.</description>
${items}
  </channel>
</rss>`;
}
