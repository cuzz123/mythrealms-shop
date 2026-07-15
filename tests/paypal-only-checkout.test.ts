import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

function source(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test("public checkout exposes PayPal only", () => {
  const checkout = source("src/app/checkout/page.tsx");
  const cart = source("src/app/cart/page.tsx");
  assert.match(checkout, /paypal-button-container/);
  assert.match(checkout, /FUNDING\.PAYPAL/);
  assert.doesNotMatch(checkout, /paymentMethod|setPaymentMethod|CreditCard/);
  assert.doesNotMatch(checkout, />\s*Card\s*</);
  assert.doesNotMatch(checkout, /Afterpay|Klarna|\+ more/);
  assert.doesNotMatch(cart, />VISA<|>MC<|>AMEX</);
  assert.match(cart, /Checkout securely with PayPal/);
});

test("legacy checkout fails closed before creating an order", () => {
  const route = source("src/app/api/checkout/route.ts");
  assert.match(route, /This checkout endpoint is disabled/);
  assert.match(route, /status:\s*410/);
  assert.doesNotMatch(route, /createPendingOrder|quoteCheckout|lemonsqueezy\.com/);
});

test("PayPal failures never direct customers to unavailable Card", () => {
  for (const file of [
    "src/app/checkout/page.tsx",
    "src/app/api/checkout/paypal/route.ts",
    "src/app/api/checkout/paypal/capture/route.ts",
  ]) {
    assert.doesNotMatch(source(file), /use Card|Card payment|another payment method/i);
  }
});

test("public policy copy names only the payment capability actually offered", () => {
  for (const file of [
    "src/app/faq/page.tsx",
    "src/app/terms/page.tsx",
    "src/app/privacy/page.tsx",
  ]) {
    const value = source(file);
    assert.doesNotMatch(
      value,
      /Stripe|Visa|Mastercard|American Express|Discover|Google Pay|Apple Pay|major cards|PCI-DSS/i,
    );
    assert.match(value, /PayPal/);
  }
});
