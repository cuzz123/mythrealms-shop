import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  buildBlogPostingData,
  JsonLd,
  OrganizationJsonLd,
  WebSiteJsonLd,
  ProductJsonLd,
} from "../src/components/ui/JsonLd";
import { BlogPostJsonLd as SeoBlogPostJsonLd } from "../src/components/ui/SeoJsonLd";
import { BRAND } from "../src/lib/brand-identity";
import {
  buildAboutPageSchema,
  buildArticleSchema,
  buildBreadcrumbListSchema,
  buildCollectionSchema,
  buildFAQPageSchema,
  buildOrganizationSchema,
  buildProductSchema,
} from "../src/lib/seo/schema";
import { STORE_POLICY_FACTS } from "../src/lib/storefront/policies";

test("article schema mirrors visible editorial facts", () => {
  const schema = buildArticleSchema({
    title: "How to Care for Pearl Jewelry",
    description: "A practical care guide.",
    url: "https://example.com/pearls/care",
    image: "https://example.com/care.jpg",
    datePublished: "2026-07-18",
    dateModified: "2026-07-18",
  });

  assert.equal(schema["@context"], "https://schema.org");
  assert.equal(schema["@type"], "Article");
  assert.deepEqual(schema.author, {
    "@type": "Organization",
    name: "Maverenne Editorial",
  });
  assert.deepEqual(schema.publisher, {
    "@type": "Organization",
    name: "Maverenne",
  });
  assert.equal(schema.headline, "How to Care for Pearl Jewelry");
});

test("collection schema contains only supplied product URLs", () => {
  const schema = buildCollectionSchema({
    name: "New Arrivals",
    description: "Recently added pearl jewelry.",
    url: "https://example.com/collections/new-arrivals",
    products: [
      {
        name: "Pearl Drop",
        url: "https://example.com/products/pearl-drop",
      },
    ],
  });

  assert.equal(schema.mainEntity.numberOfItems, 1);
  assert.equal(
    schema.mainEntity.itemListElement[0].url,
    "https://example.com/products/pearl-drop",
  );
});

test("about schema identifies the page without inventing a founder", () => {
  const schema = buildAboutPageSchema({
    name: "About Maverenne",
    description: "The Maverenne point of view.",
    url: "https://example.com/about",
  });

  assert.equal(schema["@type"], "AboutPage");
  assert.equal("founder" in schema, false);
});

test("product schema contains only verified commerce facts", () => {
  const schema = buildProductSchema({
    name: "Pearl Drop Earrings",
    description: "Pearl drop earrings.",
    images: ["https://example.com/product.jpg"],
    price: 39.99,
    currency: "USD",
    sku: "sku-1",
    availability: "InStock",
    url: "https://example.com/products/pearl-drop-earrings",
  });

  assert.equal(schema["@type"], "Product");
  assert.deepEqual(schema.brand, {
    "@type": "Brand",
    name: "Maverenne",
  });
  assert.deepEqual(schema.image, ["https://example.com/product.jpg"]);
  assert.deepEqual(schema.offers, {
    "@type": "Offer",
    url: "https://example.com/products/pearl-drop-earrings",
    priceCurrency: "USD",
    price: "39.99",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
  });

  for (const unsupportedClaim of [
    "aggregateRating",
    "review",
    "gtin",
    "mpn",
    "award",
    "certification",
    "countryOfOrigin",
    "origin",
    "founder",
  ]) {
    assert.equal(unsupportedClaim in schema, false);
  }
});

test("product schema cannot silently claim omitted availability", () => {
  // @ts-expect-error Pure schema callers must supply verified availability.
  const schema = buildProductSchema({
    name: "Pearl Drop Earrings",
    description: "Pearl drop earrings.",
    images: ["https://example.com/product.jpg"],
    price: 39.99,
    currency: "USD",
    url: "https://example.com/products/pearl-drop-earrings",
  });

  assert.equal("availability" in schema.offers, false);
});

test("ProductJsonLd emits exactly one Product object with its legacy InStock default", () => {
  const html = renderToStaticMarkup(
    createElement(ProductJsonLd, {
      name: "Pearl Drop Earrings",
      description: "Pearl drop earrings.",
      images: ["https://example.com/product.jpg"],
      price: 39.99,
      url: "https://example.com/products/pearl-drop-earrings",
    }),
  );

  assert.equal((html.match(/application\/ld\+json/g) || []).length, 1);
  assert.equal((html.match(/"@type":"Product"/g) || []).length, 1);
  assert.match(html, /"brand":\{"@type":"Brand","name":"Maverenne"\}/);
  assert.match(html, /https:\/\/schema\.org\/InStock/);
});

test("the product page renders exactly one ProductJsonLd wrapper", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/app/products/[slug]/1688-product.tsx"),
    "utf8",
  );

  assert.equal((source.match(/<ProductJsonLd\b/g) || []).length, 1);
});

test("the product page builds structured-data URLs through the approved site helpers", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/app/products/[slug]/1688-product.tsx"),
    "utf8",
  );

  assert.match(source, /import \{ absoluteImageUrl \} from "@\/lib\/images"/);
  assert.match(source, /import \{ absoluteUrl \} from "@\/lib\/site"/);
  assert.match(source, /images=\{p\.images\.map\(\(image\) => absoluteImageUrl\(image\)\)\}/);
  assert.match(source, /url=\{absoluteUrl\(`\/products\/\$\{p\.slug\}`\)\}/);
  assert.match(source, /url: absoluteUrl\("\/"\)/);
  assert.match(source, /url: absoluteUrl\(`\/collections\/\$\{p\.category\}`\)/);
  assert.match(source, /url: absoluteUrl\(`\/products\/\$\{p\.slug\}`\)/);
  assert.doesNotMatch(source, /NEXT_PUBLIC_APP_URL/);
  assert.doesNotMatch(source, /vercel\.app/i);
});

test("breadcrumb and FAQ schema mirror supplied visible content", () => {
  const breadcrumb = buildBreadcrumbListSchema([
    { name: "Home", url: "https://example.com/" },
    { name: "Pearl Care", url: "https://example.com/pearls/care" },
  ]);
  const faq = buildFAQPageSchema([
    {
      question: "Can pearls get wet?",
      answer: "Keep them away from prolonged moisture.",
    },
  ]);

  assert.equal(breadcrumb.itemListElement.length, 2);
  assert.equal(breadcrumb.itemListElement[1].position, 2);
  assert.equal(faq.mainEntity.length, 1);
  assert.equal(faq.mainEntity[0].name, "Can pearls get wet?");
});

test("organization schema accepts verified policy data without inventing people", () => {
  const schema = buildOrganizationSchema({
    url: "https://example.com",
    logo: "https://example.com/logo.png",
    contactEmail: "support@example.com",
  });

  assert.deepEqual(schema["@type"], ["Organization", "OnlineStore"]);
  assert.equal(schema.name, "Maverenne");
  assert.equal(schema.url, "https://example.com");
  assert.equal(schema.contactPoint.email, "support@example.com");
  assert.equal("founder" in schema, false);
});

test("public organization JSON-LD omits unverified shipping and return policies", () => {
  const html = renderToStaticMarkup(createElement(OrganizationJsonLd));
  const match = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/);

  assert.ok(match, "expected an organization JSON-LD script");
  const schema = JSON.parse(match[1]) as Record<string, unknown>;
  assert.equal("hasShippingService" in schema, false);
  assert.equal("hasMerchantReturnPolicy" in schema, false);
});

test("organization schema mirrors optional verified policy objects", () => {
  const shippingService = {
    "@type": "ShippingService",
    name: "Verified shipping",
  };
  const returnPolicy = {
    "@type": "MerchantReturnPolicy",
    merchantReturnDays: 30,
  };
  const schema = buildOrganizationSchema({
    url: "https://example.com",
    logo: "https://example.com/logo.png",
    contactEmail: "support@example.com",
    shippingService,
    returnPolicy,
  });

  assert.deepEqual(schema.hasShippingService, shippingService);
  assert.deepEqual(schema.hasMerchantReturnPolicy, returnPolicy);
});

test("organization policy schema distinguishes shipping bands and return reasons", () => {
  const schema = buildOrganizationSchema({
    url: "https://example.com",
    logo: "https://example.com/logo.png",
    contactEmail: "support@example.com",
    policyFacts: STORE_POLICY_FACTS,
  });
  const shipping = schema.hasShippingService as Record<string, unknown>;
  const returns = schema.hasMerchantReturnPolicy as Record<string, unknown>;

  assert.equal(shipping["@type"], "ShippingService");
  assert.ok(Array.isArray(shipping.shippingConditions));
  assert.deepEqual(
    (shipping.shippingConditions as Array<Record<string, unknown>>).map(
      (condition) => ({
        orderValue: condition.orderValue,
        shippingRate: condition.shippingRate,
      }),
    ),
    [
      {
        orderValue: {
          "@type": "MonetaryAmount",
          minValue: 0,
          maxValue: 69.98,
          currency: "USD",
        },
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 4.99,
          currency: "USD",
        },
      },
      {
        orderValue: {
          "@type": "MonetaryAmount",
          minValue: 69.99,
          currency: "USD",
        },
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "USD",
        },
      },
    ],
  );
  assert.equal(returns.returnFees, "https://schema.org/ReturnFeesCustomerResponsibility");
  assert.equal(
    returns.customerRemorseReturnFees,
    "https://schema.org/ReturnFeesCustomerResponsibility",
  );
  assert.equal(returns.itemDefectReturnFees, "https://schema.org/FreeReturn");
  assert.equal("returnLabelSource" in returns, false);
  assert.equal(
    returns.customerRemorseReturnLabelSource,
    "https://schema.org/ReturnLabelCustomerResponsibility",
  );
  assert.equal(
    returns.itemDefectReturnLabelSource,
    "https://schema.org/ReturnLabelDownloadAndPrint",
  );
  assert.deepEqual(
    Object.keys(returns).filter((key) => /returnShippingFeesAmount$/i.test(key)),
    [],
  );
  assert.doesNotMatch(
    JSON.stringify(schema),
    /"name":"(?:MythRealms|Phoenix|Moon Rabbit|White Tiger)/i,
  );
});

test("JsonLd safely escapes less-than characters", () => {
  const html = renderToStaticMarkup(
    createElement(JsonLd, {
      data: { description: "</script><script>alert('unsafe')</script>" },
    }),
  );

  assert.match(html, /\\u003c\/script>/);
  assert.doesNotMatch(html, /<\/script><script>/);
});

test("editorial schemas derive their public identity from Maverenne", () => {
  const data = buildBlogPostingData({
    headline: "How to Style Pearl Earrings",
    description: "A practical styling guide.",
    url: "https://example.com/blog/how-to-style-pearl-earrings",
    datePublished: new Date("2026-07-01T00:00:00Z"),
    dateModified: new Date("2026-07-02T00:00:00Z"),
    authorName: "Legacy Editorial",
  });

  assert.deepEqual(data.author, {
    "@type": "Organization",
    name: "Maverenne Editorial",
  });
  assert.deepEqual(data.publisher, {
    "@type": "Organization",
    name: "Maverenne",
  });
  assert.equal(BRAND.name, "Maverenne");
  assert.doesNotMatch(
    JSON.stringify(data),
    /MythRealms|Phoenix|Moon Rabbit|White Tiger|Chinese mythology/i,
  );
});

test("rendered WebSite and alternate BlogPosting schemas expose only Maverenne entity names", () => {
  const websiteHtml = renderToStaticMarkup(createElement(WebSiteJsonLd));
  const articleHtml = renderToStaticMarkup(
    createElement(SeoBlogPostJsonLd, {
      title: "How to Style Pearl Earrings",
      excerpt: "A practical styling guide.",
      datePublished: "2026-07-01",
      author: "Legacy Editorial",
      url: "https://example.com/blog/how-to-style-pearl-earrings",
    }),
  );

  for (const html of [websiteHtml, articleHtml]) {
    assert.match(html, /"name":"Maverenne/);
    assert.doesNotMatch(
      html,
      /"name":"(?:MythRealms|Phoenix|Moon Rabbit|White Tiger)/i,
    );
  }
});
