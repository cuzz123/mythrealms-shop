import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

function source(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

function discountValidationSource(checkout: string): string {
  const validationStart = checkout.indexOf("async function validateDiscount");
  const applyStart = checkout.indexOf("function handleApplyDiscount", validationStart);
  assert.notEqual(validationStart, -1);
  assert.notEqual(applyStart, -1);
  return checkout.slice(validationStart, applyStart);
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

test("PayPal checkout validates the form and sends identity without client-owned pricing", () => {
  const checkout = source("src/app/checkout/page.tsx");
  assert.match(checkout, /discountCode=\{appliedDiscountCode\}/);
  assert.match(checkout, /validateForm=\{validateAll\}/);
  assert.doesNotMatch(checkout, /discountInfo=\{discountInfo\}|total=\{total\}/);

  const createOrderStart = checkout.indexOf("createOrder: async () => {");
  const onApproveStart = checkout.indexOf("onApprove: async", createOrderStart);
  assert.notEqual(createOrderStart, -1);
  assert.notEqual(onApproveStart, -1);
  const createOrder = checkout.slice(createOrderStart, onApproveStart);
  const validation = createOrder.indexOf("validateRef.current()");
  const request = createOrder.indexOf('fetch("/api/checkout/paypal"');
  assert.ok(validation >= 0 && validation < request);
  assert.match(
    createOrder,
    /discountCode:\s*latest\.discountCode\.trim\(\)\s*\|\|\s*undefined/,
  );
  assert.match(createOrder, /variantId:\s*item\.product\.variantId/);
  assert.doesNotMatch(createOrder, /\bprice:|\btotal:|\bdiscount:/);
});

test("non-2xx cart discount revalidation clears the stale applied code", () => {
  const checkout = source("src/app/checkout/page.tsx");
  assert.match(checkout, /validateDiscount\(appliedDiscountCode\)/);
  const validation = discountValidationSource(checkout);

  const nonOkStart = validation.indexOf("if (!res.ok) {");
  const nonOkReturn = validation.indexOf("return;", nonOkStart);
  assert.ok(nonOkStart >= 0 && nonOkReturn > nonOkStart);
  assert.match(
    validation.slice(nonOkStart, nonOkReturn),
    /setAppliedDiscountCode\(""\)/,
  );
});

test("thrown cart discount revalidation clears the stale applied code", () => {
  const validation = discountValidationSource(
    source("src/app/checkout/page.tsx"),
  );
  const catchStart = validation.indexOf("catch");
  const finallyStart = validation.indexOf("finally", catchStart);
  assert.ok(catchStart >= 0 && finallyStart > catchStart);
  assert.match(
    validation.slice(catchStart, finallyStart),
    /setAppliedDiscountCode\(""\)/,
  );
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
