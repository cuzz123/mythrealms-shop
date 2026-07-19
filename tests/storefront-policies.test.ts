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
    standardShippingFlatRateUsd: 4.99,
    handlingBusinessDays: { min: 2, max: 5 },
    usStandardTransitBusinessDays: { min: 8, max: 14 },
    returnWindowDays: 30,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
    customerRemorseReturnFees:
      "https://schema.org/ReturnFeesCustomerResponsibility",
    itemDefectReturnFees: "https://schema.org/FreeReturn",
    returnLabelSource:
      "https://schema.org/ReturnLabelCustomerResponsibility",
    customerRemorseReturnLabelSource:
      "https://schema.org/ReturnLabelCustomerResponsibility",
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
      "US standard shipping costs $4.99 below $69.99 and is free for orders of $69.99 or more, with 2-5 business-day handling and 8-14 business-day transit.",
    fulfillmentType: "https://schema.org/FulfillmentTypeDelivery",
    handlingTime: {
      "@type": "ServicePeriod",
      duration: {
        "@type": "QuantitativeValue",
        minValue: 2,
        maxValue: 5,
        unitCode: "DAY",
      },
      businessDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    shippingConditions: [
      {
        "@type": "ShippingConditions",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "US",
        },
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
        transitTime: {
          "@type": "ServicePeriod",
          duration: {
            "@type": "QuantitativeValue",
            minValue: 8,
            maxValue: 14,
            unitCode: "DAY",
          },
          businessDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },
      },
      {
        "@type": "ShippingConditions",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "US",
        },
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
        transitTime: {
          "@type": "ServicePeriod",
          duration: {
            "@type": "QuantitativeValue",
            minValue: 8,
            maxValue: 14,
            unitCode: "DAY",
          },
          businessDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },
      },
    ],
  });
  assert.deepEqual(schema.hasMerchantReturnPolicy, {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "US",
    returnPolicyCategory:
      "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 30,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
    customerRemorseReturnFees:
      "https://schema.org/ReturnFeesCustomerResponsibility",
    itemDefectReturnFees: "https://schema.org/FreeReturn",
    returnLabelSource:
      "https://schema.org/ReturnLabelCustomerResponsibility",
    customerRemorseReturnLabelSource:
      "https://schema.org/ReturnLabelCustomerResponsibility",
    merchantReturnLink: "https://example.com/refund",
  });
  assert.equal("returnShippingFeesAmount" in schema.hasMerchantReturnPolicy, false);
  assert.equal("customerRemorseReturnShippingFeesAmount" in schema.hasMerchantReturnPolicy, false);
  assert.equal(schema.contactPoint.url, "https://example.com/contact");

  const serialized = JSON.stringify(schema);
  assert.doesNotMatch(serialized, /free returns?/i);
});
