import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  buildDiscountPreviewRequest,
  parseDiscountPreviewResponse,
} from "../src/lib/checkout/discount-preview";

function source(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

function sourceSection(
  value: string,
  startMarker: string,
  endMarker: string,
): string {
  const start = value.indexOf(startMarker);
  const end = value.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(start, -1, `Missing source marker: ${startMarker}`);
  assert.ok(end > start, `Missing source marker: ${endMarker}`);
  return value.slice(start, end);
}

function checkoutDiscountValidationSource(): string {
  return sourceSection(
    source("src/app/checkout/page.tsx"),
    "async function validateDiscount",
    "function handleApplyDiscount",
  );
}

function cartDiscountValidationSource(): string {
  return sourceSection(
    source("src/app/cart/page.tsx"),
    "const handleApplyDiscount",
    "if (isEmpty)",
  );
}

test("builds canonical discount-preview input", () => {
  assert.deepEqual(
    buildDiscountPreviewRequest(
      [{ product: { id: "pearl-01" }, quantity: 2 }],
      " myth15 ",
      " BUYER@EXAMPLE.COM ",
    ),
    {
      items: [{ productId: "pearl-01", quantity: 2 }],
      discountCode: "MYTH15",
      email: "buyer@example.com",
    },
  );
});

test("reads authoritative response keys without a percentage fallback", () => {
  assert.deepEqual(
    parseDiscountPreviewResponse({
      valid: true,
      discount: 4.5,
      total: 30.48,
      appliedDiscounts: [{ label: "Welcome 15%" }],
    }),
    { discount: 4.5, label: "Welcome 15%", total: 30.48 },
  );
  assert.throws(
    () => parseDiscountPreviewResponse({ valid: true, total: 30.48 }),
    /invalid discount preview/i,
  );
});

test("cart, checkout, and route use one discountCode contract", () => {
  const files = [
    "src/app/cart/page.tsx",
    "src/app/checkout/page.tsx",
    "src/app/api/discounts/validate/route.ts",
  ].map(source);
  for (const value of files) assert.match(value, /discountCode/);
  assert.doesNotMatch(files[0], /subtotal:\s*subtotal\(\)|discountValue\s*\?\?/);
  assert.doesNotMatch(files[2], /body\?\.code/);
});

test("checkout discount preview sends the canonical request with buyer email", () => {
  const request = sourceSection(
    checkoutDiscountValidationSource(),
    'const res = await fetch("/api/discounts/validate"',
    "const data = await res.json();",
  );
  assert.match(
    request,
    /body:\s*JSON\.stringify\(\s*buildDiscountPreviewRequest\(\s*items,\s*codeToUse,\s*email\s*\),\s*\)/,
  );
});

test("discount route reads only the canonical discountCode field", () => {
  const route = source("src/app/api/discounts/validate/route.ts");
  const parsingStart = route.indexOf("const body = await request.json();");
  const validationStart = route.indexOf("if (discountCode &&", parsingStart);
  assert.notEqual(parsingStart, -1, "Missing discount request parsing");
  assert.notEqual(validationStart, -1, "Missing canonical discount validation");
  const parsing = route.slice(parsingStart, validationStart);
  assert.match(
    parsing,
    /const discountCode =\s*typeof body\?\.discountCode === "string" && body\.discountCode\.trim\(\)\s*\? body\.discountCode\.trim\(\)\.toUpperCase\(\)\s*: undefined;/,
  );
  assert.doesNotMatch(parsing, /body\?\.code\b/);
});

test("checkout non-2xx discount revalidation clears stale preview state", () => {
  const nonOk = sourceSection(
    checkoutDiscountValidationSource(),
    "if (!res.ok) {",
    "return;",
  );
  assert.match(nonOk, /setAppliedDiscountCode\(""\)/);
  assert.match(nonOk, /setDiscountInfo\(null\)/);
});

test("checkout thrown discount revalidation clears stale preview state", () => {
  const caught = sourceSection(
    checkoutDiscountValidationSource(),
    "} catch (",
    "} finally {",
  );
  assert.match(caught, /setAppliedDiscountCode\(""\)/);
  assert.match(caught, /setDiscountInfo\(null\)/);
});

test("cart caught discount preview failures clear stale preview state", () => {
  const validation = cartDiscountValidationSource();
  const catchStart = validation.indexOf("} catch {");
  assert.notEqual(catchStart, -1, "Missing cart discount failure handler");
  for (const marker of [
    'fetch("/api/discounts/validate"',
    "res.json()",
    "parseDiscountPreviewResponse(data)",
  ]) {
    const operation = validation.indexOf(marker);
    assert.ok(operation >= 0 && operation < catchStart, `${marker} must be caught`);
  }
  const caught = sourceSection(validation, "} catch {", "} finally {");
  assert.match(caught, /setDiscountApplied\(false\)/);
  assert.match(caught, /setDiscountValue\(0\)/);
  assert.match(caught, /setDiscountLabel\(""\)/);
});
