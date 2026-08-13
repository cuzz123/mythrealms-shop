import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync("src/app/products/[slug]/1688-product.tsx", "utf8");
const stickySource = readFileSync("src/components/storefront/StickyAddToCart.tsx", "utf8");

test("product purchase summary precedes long-form details and retains gallery status", () => {
  assert.ok(source.indexOf("data-purchase-summary") < source.indexOf("data-product-longform"));
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /data-gallery-position/);
});

test("product detail preserves its existing view and gift-note tracking boundaries", () => {
  assert.match(source, /trackViewItem/);
  assert.match(source, /trackAddGiftNote/);
});

test("mobile sticky purchase action clears the existing bottom navigation safe area", () => {
  assert.match(stickySource, /bottom:\s*"calc\(4\.5rem \+ env\(safe-area-inset-bottom, 0px\)\)"/);
});
