import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import RefundPage from "../src/app/refund/page";
import ShippingPage from "../src/app/shipping/page";
import { buildOrganizationSchema } from "../src/lib/seo/schema";
import { STORE_POLICY_FACTS } from "../src/lib/storefront/policies";

test("structured policy facts match the public shipping and return promises", () => {
  assert.deepEqual(STORE_POLICY_FACTS, {
    freeShippingThresholdUsd: 69.99,
    handlingBusinessDays: { min: 2, max: 5 },
    usStandardTransitBusinessDays: { min: 8, max: 14 },
    returnWindowDays: 30,
    returnMethod: "https://schema.org/ReturnByMail",
    defaultReturnFees: "https://schema.org/ReturnShippingFees",
  });
});

test("visible policy headlines render the centralized policy facts", () => {
  const shipping = renderToStaticMarkup(createElement(ShippingPage));
  const refund = renderToStaticMarkup(createElement(RefundPage));

  assert.match(shipping, /orders over \$69\.99/i);
  assert.match(shipping, /2-5 business days/i);
  assert.match(shipping, /8-14 days/i);
  assert.match(refund, /30-Day Return Window/i);
  assert.match(refund, /30 days from the delivery date/i);
});

test("organization schema emits only verified shipping and return policy facts", () => {
  const schema = buildOrganizationSchema({
    url: "https://example.com",
    logo: "https://example.com/logo.png",
    contactEmail: "support@example.com",
    policyFacts: STORE_POLICY_FACTS,
  });

  assert.deepEqual(schema.hasShippingService, {
    "@type": "ShippingService",
    name: "MythRealms Standard Shipping",
    url: "https://example.com/shipping",
    description:
      "2-5 business-day handling, 8-14 business-day US standard transit, and free shipping on orders over $69.99.",
  });
  assert.deepEqual(schema.hasMerchantReturnPolicy, {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "US",
    returnPolicyCategory:
      "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 30,
    returnMethod: "https://schema.org/ReturnByMail",
    customerRemorseReturnFees: "https://schema.org/ReturnShippingFees",
    merchantReturnLink: "https://example.com/refund",
  });
  assert.equal("returnFees" in schema.hasMerchantReturnPolicy, false);
  assert.equal(schema.contactPoint.url, "https://example.com/contact");

  const serialized = JSON.stringify(schema);
  assert.doesNotMatch(serialized, /shippingRate/);
  assert.doesNotMatch(serialized, /free returns?/i);
});
