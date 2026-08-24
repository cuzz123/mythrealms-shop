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

test("product schema derives Google merchant policies from verified store facts", () => {
  const schema = buildProductSchema({
    name: "Pearl Drop Earrings",
    description: "Pearl drop earrings.",
    images: ["https://example.com/product.jpg"],
    price: 39.99,
    currency: "USD",
    availability: "InStock",
    url: "https://example.com/products/pearl-drop-earrings",
    policyFacts: STORE_POLICY_FACTS,
  });

  assert.deepEqual(schema.offers.shippingDetails, {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      maxValue: 4.99,
      currency: "USD",
    },
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: "US",
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 2,
        maxValue: 5,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 8,
        maxValue: 14,
        unitCode: "DAY",
      },
    },
  });
  assert.deepEqual(schema.offers.hasMerchantReturnPolicy, {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "US",
    returnPolicyCategory:
      "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 30,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
  });
});

test("product schema emits free US shipping at the verified threshold", () => {
  const schema = buildProductSchema({
    name: "Pearl Collar",
    description: "Pearl collar.",
    images: ["https://example.com/collar.jpg"],
    price: STORE_POLICY_FACTS.freeShippingThresholdUsd,
    currency: "USD",
    availability: "InStock",
    url: "https://example.com/products/pearl-collar",
    policyFacts: STORE_POLICY_FACTS,
  });

  assert.ok(schema.offers.shippingDetails);
  assert.equal(schema.offers.shippingDetails.shippingRate.value, 0);
  assert.equal(schema.offers.shippingDetails.shippingRate.currency, "USD");
});

test("product offers use a maximum below the order threshold and free value at or above it", () => {
  const below = buildProductSchema({
    name: "Pearl Collar",
    description: "Pearl collar.",
    images: ["https://example.com/collar.jpg"],
    price: STORE_POLICY_FACTS.freeShippingThresholdUsd - 0.01,
    currency: "USD",
    availability: "InStock",
    url: "https://example.com/products/pearl-collar-below",
    policyFacts: STORE_POLICY_FACTS,
  });
  const at = buildProductSchema({
    name: "Pearl Collar",
    description: "Pearl collar.",
    images: ["https://example.com/collar.jpg"],
    price: STORE_POLICY_FACTS.freeShippingThresholdUsd,
    currency: "USD",
    availability: "InStock",
    url: "https://example.com/products/pearl-collar-at",
    policyFacts: STORE_POLICY_FACTS,
  });
  const above = buildProductSchema({
    name: "Pearl Collar",
    description: "Pearl collar.",
    images: ["https://example.com/collar.jpg"],
    price: STORE_POLICY_FACTS.freeShippingThresholdUsd + 0.01,
    currency: "USD",
    availability: "InStock",
    url: "https://example.com/products/pearl-collar-above",
    policyFacts: STORE_POLICY_FACTS,
  });

  assert.deepEqual(below.offers.shippingDetails?.shippingRate, {
    "@type": "MonetaryAmount",
    maxValue: STORE_POLICY_FACTS.standardShippingFlatRateUsd,
    currency: "USD",
  });
  assert.deepEqual(at.offers.shippingDetails?.shippingRate, {
    "@type": "MonetaryAmount",
    value: 0,
    currency: "USD",
  });
  assert.deepEqual(above.offers.shippingDetails?.shippingRate, {
    "@type": "MonetaryAmount",
    value: 0,
    currency: "USD",
  });
});

test("product schema omits USD-only policies for non-USD offers", () => {
  const schema = buildProductSchema({
    name: "Pearl Collar",
    description: "Pearl collar.",
    images: ["https://example.com/collar.jpg"],
    price: 39.99,
    currency: "GBP",
    availability: "InStock",
    url: "https://example.com/products/pearl-collar",
    policyFacts: STORE_POLICY_FACTS,
  });

  assert.equal("shippingDetails" in schema.offers, false);
  assert.equal("hasMerchantReturnPolicy" in schema.offers, false);
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

test("ProductJsonLd forwards verified policy facts into the rendered Offer", () => {
  const html = renderToStaticMarkup(
    createElement(ProductJsonLd, {
      name: "Pearl Drop Earrings",
      description: "Pearl drop earrings.",
      images: ["https://example.com/product.jpg"],
      price: 39.99,
      currency: "USD",
      availability: "InStock",
      url: "https://example.com/products/pearl-drop-earrings",
      policyFacts: STORE_POLICY_FACTS,
    }),
  );
  const match = html.match(
    /<script type="application\/ld\+json">([^<]+)<\/script>/,
  );

  assert.ok(match, "expected a Product JSON-LD script");
  const schema = JSON.parse(match[1]) as {
    offers: {
      shippingDetails?: Record<string, unknown>;
      hasMerchantReturnPolicy?: Record<string, unknown>;
    };
  };
  assert.deepEqual(schema.offers.shippingDetails, {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      maxValue: 4.99,
      currency: "USD",
    },
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: "US",
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 2,
        maxValue: 5,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 8,
        maxValue: 14,
        unitCode: "DAY",
      },
    },
  });
  assert.deepEqual(schema.offers.hasMerchantReturnPolicy, {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "US",
    returnPolicyCategory:
      "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 30,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
  });
});

test("ProductJsonLd omits USD-only policy objects from a rendered non-USD Offer", () => {
  const html = renderToStaticMarkup(
    createElement(ProductJsonLd, {
      name: "Pearl Drop Earrings",
      description: "Pearl drop earrings.",
      images: ["https://example.com/product.jpg"],
      price: 39.99,
      currency: "GBP",
      availability: "InStock",
      url: "https://example.com/products/pearl-drop-earrings",
      policyFacts: STORE_POLICY_FACTS,
    }),
  );

  assert.doesNotMatch(html, /shippingDetails/);
  assert.doesNotMatch(html, /hasMerchantReturnPolicy/);
});

test("the product page renders exactly one ProductJsonLd wrapper", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/app/products/[slug]/1688-product.tsx"),
    "utf8",
  );

  assert.equal((source.match(/<ProductJsonLd\b/g) || []).length, 1);
});

test("the product page passes verified policy facts to ProductJsonLd", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/app/products/[slug]/1688-product.tsx"),
    "utf8",
  );

  assert.match(
    source,
    /import \{ STORE_POLICY_FACTS \} from "@\/lib\/storefront\/policies"/,
  );
  assert.match(source, /policyFacts=\{STORE_POLICY_FACTS\}/);
});

test("the product page uses centralized order-level free-shipping wording", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/app/products/[slug]/1688-product.tsx"),
    "utf8",
  );

  const thresholdShippingLines = source
    .split(/\r?\n/)
    .filter(
      (line) =>
        /shipping/i.test(line) &&
        (/(?:freeShippingThresholdUsd|\$69\.99)/i.test(line)),
    );
  const approvedBoundary = /orders of (?:\{formatPrice\(STORE_POLICY_FACTS\.freeShippingThresholdUsd\)\}|\$69\.99) or more/i;

  assert.equal(thresholdShippingLines.length, 3);
  for (const line of thresholdShippingLines) {
    assert.match(line, approvedBoundary);
  }
  assert.doesNotMatch(source, /orders over \$69\.99/i);
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

test("public organization JSON-LD includes verified shipping and return policies", () => {
  const html = renderToStaticMarkup(createElement(OrganizationJsonLd));
  const match = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/);

  assert.ok(match, "expected an organization JSON-LD script");
  const schema = JSON.parse(match[1]) as Record<string, unknown>;
  assert.equal("hasShippingService" in schema, true);
  assert.equal("hasMerchantReturnPolicy" in schema, true);
  assert.equal(
    (schema.hasShippingService as { name: string }).name,
    "Maverenne Standard Shipping",
  );
  assert.equal(
    (schema.hasMerchantReturnPolicy as { merchantReturnDays: number }).merchantReturnDays,
    STORE_POLICY_FACTS.returnWindowDays,
  );
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
