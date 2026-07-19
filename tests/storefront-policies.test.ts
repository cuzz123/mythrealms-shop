import assert from "node:assert/strict";
import test from "node:test";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import RefundPage from "../src/app/refund/page";
import ShippingPage, { metadata as shippingMetadata } from "../src/app/shipping/page";
import CheckoutPageModule from "../src/app/checkout/page";
import { useCartStore } from "../src/lib/cart";
import { buildOrganizationSchema } from "../src/lib/seo/schema";
import { STORE_POLICY_FACTS } from "../src/lib/storefront/policies";

const CheckoutPage =
  typeof CheckoutPageModule === "function"
    ? CheckoutPageModule
    : (CheckoutPageModule as unknown as { default: ComponentType }).default;

function renderCheckoutAtPrice(price: number) {
  const serverItems = useCartStore.getInitialState().items;
  const originalServerItems = [...serverItems];
  serverItems.splice(0, serverItems.length, {
    product: {
      id: "policy-test",
      name: "Policy Test",
      slug: "policy-test",
      image: "/policy-test.jpg",
      price,
    },
    quantity: 1,
  });

  try {
    return renderToStaticMarkup(createElement(CheckoutPage));
  } finally {
    serverItems.splice(0, serverItems.length, ...originalServerItems);
  }
}

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
    customerRemorseReturnLabelSource:
      "https://schema.org/ReturnLabelCustomerResponsibility",
    itemDefectReturnLabelSource:
      "https://schema.org/ReturnLabelDownloadAndPrint",
  });
});

test("visible shipping copy renders the exact centralized price boundary", () => {
  const threshold = STORE_POLICY_FACTS.freeShippingThresholdUsd.toFixed(2);
  const flatRate = STORE_POLICY_FACTS.standardShippingFlatRateUsd.toFixed(2);
  const shipping = renderToStaticMarkup(createElement(ShippingPage));
  const checkoutBelowThreshold = renderCheckoutAtPrice(20);
  const checkoutAtThreshold = renderCheckoutAtPrice(
    STORE_POLICY_FACTS.freeShippingThresholdUsd,
  );

  assert.equal(
    shippingMetadata.description,
    `Standard shipping costs $${flatRate} below $${threshold} and is free for orders of $${threshold} or more. View delivery times by country, shipping methods, and tracking information.`,
  );
  assert.ok(shipping.includes(`On all orders of $${threshold} or more`));
  assert.ok(
    shipping.includes(
      `$${flatRate} below $${threshold}; free on orders of $${threshold} or more`,
    ),
  );
  assert.ok(
    checkoutBelowThreshold.includes(
      `Free shipping on orders of $${threshold} or more`,
    ),
  );
  assert.ok(checkoutBelowThreshold.includes(`$${flatRate} shipping below $${threshold}`));
  assert.ok(checkoutBelowThreshold.includes(`Free at $${threshold} or more`));
  assert.match(checkoutBelowThreshold, /Shipping<\/span><span class="">\$4\.99<\/span>/);
  assert.match(
    checkoutAtThreshold,
    /Shipping<\/span><span class="text-\[var\(--success\)\]">FREE<\/span>/,
  );
  assert.doesNotMatch(
    checkoutAtThreshold,
    /Free shipping on orders of \$69\.99 or more - add/i,
  );
  assert.doesNotMatch(
    `${shipping}\n${checkoutBelowThreshold}\n${checkoutAtThreshold}`,
    /over \$69\.99/i,
  );
  assert.doesNotMatch(
    shipping,
    /otherwise (?:a )?flat rate calculated at checkout/i,
  );
});

test("visible policy timing and return headlines render the centralized facts", () => {
  const shipping = renderToStaticMarkup(createElement(ShippingPage));
  const refund = renderToStaticMarkup(createElement(RefundPage));

  assert.match(shipping, /2-5 business days/i);
  assert.match(shipping, /8-14 days/i);
  assert.match(refund, /30-Day Return Window/i);
  assert.match(refund, /30 days from the delivery date/i);
  assert.match(
    refund,
    /cover the cost of return shipping and provide a prepaid return label if the return is due to our error/i,
  );
  assert.match(refund, /received a defective or damaged item/i);
  assert.match(
    refund,
    /Return shipping costs are the customer(?:&#x27;|&apos;|')s responsibility in all other cases/i,
  );
  assert.match(refund, /changed your mind or no longer want the item/i);
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
    customerRemorseReturnLabelSource:
      "https://schema.org/ReturnLabelCustomerResponsibility",
    itemDefectReturnLabelSource:
      "https://schema.org/ReturnLabelDownloadAndPrint",
    merchantReturnLink: "https://example.com/refund",
  });
  assert.equal("returnLabelSource" in schema.hasMerchantReturnPolicy, false);
  assert.deepEqual(
    Object.keys(schema.hasMerchantReturnPolicy).filter((key) =>
      /returnShippingFeesAmount$/i.test(key),
    ),
    [],
  );
  assert.equal(schema.contactPoint.url, "https://example.com/contact");

  const serialized = JSON.stringify(schema);
  assert.doesNotMatch(serialized, /free returns?/i);
});
