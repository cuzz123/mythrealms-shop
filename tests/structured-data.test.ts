import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { JsonLd, ProductJsonLd } from "../src/components/ui/JsonLd";
import {
  buildAboutPageSchema,
  buildArticleSchema,
  buildBreadcrumbListSchema,
  buildCollectionSchema,
  buildFAQPageSchema,
  buildOrganizationSchema,
  buildProductSchema,
} from "../src/lib/seo/schema";

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
    name: "MythRealms Editorial",
  });
  assert.deepEqual(schema.publisher, {
    "@type": "Organization",
    name: "MythRealms",
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
    name: "About MythRealms",
    description: "The MythRealms pearl point of view.",
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
    brand: "MythRealms",
  });

  assert.equal(schema["@type"], "Product");
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
  assert.match(html, /https:\/\/schema\.org\/InStock/);
});

test("the product page renders exactly one ProductJsonLd wrapper", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/app/products/[slug]/1688-product.tsx"),
    "utf8",
  );

  assert.equal((source.match(/<ProductJsonLd\b/g) || []).length, 1);
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
  assert.equal(schema.url, "https://example.com");
  assert.equal(schema.contactPoint.email, "support@example.com");
  assert.equal("founder" in schema, false);
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

test("organization return policy never applies customer-paid fees globally", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/lib/seo/schema.ts"),
    "utf8",
  );

  assert.match(source, /customerRemorseReturnFees/);
  assert.doesNotMatch(source, /\breturnFees:\s*input\.policyFacts/);
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
