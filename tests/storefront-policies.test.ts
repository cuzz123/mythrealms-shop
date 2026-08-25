import assert from "node:assert/strict";
import test from "node:test";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import RefundPage from "../src/app/refund/page";
import ShippingPage, { metadata as shippingMetadata } from "../src/app/shipping/page";
import ContactPage from "../src/app/contact/page";
import AboutPage from "../src/app/about/page";
import PrivacyPage, { metadata as privacyMetadata } from "../src/app/privacy/page";
import TermsPage, { metadata as termsMetadata } from "../src/app/terms/page";
import CheckoutPageModule from "../src/app/checkout/page";
import { useCartStore } from "../src/lib/cart";
import { buildOrganizationSchema } from "../src/lib/seo/schema";
import { STORE_POLICY_FACTS } from "../src/lib/storefront/policies";
import { OrganizationJsonLd } from "../src/components/ui/JsonLd";

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

test("structured policy facts remain stable for checkout and schema consumers", () => {
  assert.deepEqual(STORE_POLICY_FACTS, {
    freeShippingThresholdUsd: 69.99,
    standardShippingFlatRateUsd: 4.99,
    handlingBusinessDays: { min: 2, max: 5 },
    usStandardTransitBusinessDays: { min: 8, max: 14 },
    returnWindowDays: 30,
    acceptedReturnCondition: "unused-or-lightly-used",
    refundInitiationBusinessDays: 1,
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

test("checkout continues to render the centralized price boundary", () => {
  const threshold = STORE_POLICY_FACTS.freeShippingThresholdUsd.toFixed(2);
  const flatRate = STORE_POLICY_FACTS.standardShippingFlatRateUsd.toFixed(2);
  const checkoutBelowThreshold = renderCheckoutAtPrice(20);
  const checkoutAtThreshold = renderCheckoutAtPrice(
    STORE_POLICY_FACTS.freeShippingThresholdUsd,
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
    `${checkoutBelowThreshold}\n${checkoutAtThreshold}`,
    /over \$69\.99/i,
  );
});

test("customer-facing trust pages disclose the merchant identity, support channel, and fulfillment model", () => {
  const shipping = renderToStaticMarkup(createElement(ShippingPage));
  const refund = renderToStaticMarkup(createElement(RefundPage));
  const privacy = renderToStaticMarkup(createElement(PrivacyPage));
  const terms = renderToStaticMarkup(createElement(TermsPage));
  const contact = renderToStaticMarkup(createElement(ContactPage));
  const about = renderToStaticMarkup(createElement(AboutPage));
  const checkout = renderCheckoutAtPrice(20);
  const visible = [shipping, refund, privacy, terms, contact, about, checkout].join("\n");

  assert.match(visible, /Maverenne/);
  assert.match(contact, /Maverenne@outlook\.com/i);
  assert.match(about, /independent online jewelry retailer/i);
  assert.match(about, /supplier-direct fulfillment/i);
  assert.match(checkout, /supplier-direct fulfillment/i);
  assert.match(checkout, /2[–-]5 business days/i);
  assert.match(checkout, /8[–-]14 business days/i);
  assert.match(checkout, /value="United States"/i);
  assert.match(checkout, /aria-readonly="true"/i);
  assert.doesNotMatch(checkout, /country-list|United Kingdom|Canada/i);
  assert.doesNotMatch(visible, /MythRealms|mythrealms\.com|mythrealms@|maverenne\.invalid/i);
  assert.doesNotMatch(checkout, /handcrafted|crafted to order|2-3 weeks/i);
  assert.doesNotMatch(
    visible,
    /ships? worldwide|DHL|FedEx|7-20 business days|6-8 business days|48 hours|tracking number|guardian match/i,
  );
  assert.match(String(shippingMetadata.title), /Maverenne/);
  assert.match(String(privacyMetadata.title), /Maverenne/);
  assert.match(String(termsMetadata.title), /Maverenne/);
});

test("visible shipping and return promises match the structured policy facts", () => {
  const shipping = renderToStaticMarkup(createElement(ShippingPage));
  const refund = renderToStaticMarkup(createElement(RefundPage));

  assert.match(shipping, /United States/i);
  assert.match(shipping, /2[–-]5 business days/i);
  assert.match(shipping, /8[–-]14 business days/i);
  assert.match(shipping, /\$4\.99/);
  assert.match(shipping, /\$69\.99/);
  assert.match(shipping, /estimated/i);

  assert.match(refund, /30 days (?:of|after) delivery/i);
  assert.match(refund, /unused or lightly used/i);
  assert.match(refund, /1 business day/i);
  assert.match(refund, /received and inspected/i);
  assert.match(refund, /contact us before (?:mailing|sending|returning)/i);
  assert.match(refund, /return address/i);
  assert.match(refund, /customer is responsible for return shipping/i);
  assert.match(refund, /defective|incorrect item/i);
  assert.match(refund, /original payment method/i);
});

test("public organization schema exposes the verified Maverenne support email", () => {
  const organization = renderToStaticMarkup(createElement(OrganizationJsonLd));

  assert.match(organization, /Maverenne@outlook\.com/i);
  assert.match(organization, /customer service/i);
  assert.doesNotMatch(organization, /maverenne\.invalid|mythrealms/i);
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
    name: "Maverenne Standard Shipping",
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
