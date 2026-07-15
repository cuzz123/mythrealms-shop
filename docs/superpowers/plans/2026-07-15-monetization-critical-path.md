# MythRealms Monetization Critical Path Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current pearl storefront into a deployable PayPal-only shop whose authoritative payment, order confirmation, admin handling, and provider-first refund path can be proven before any live-money test.

**Architecture:** Keep the static storefront catalog and the existing authoritative quote/PayPal verification modules. Fail the legacy Lemon Squeezy checkout closed, add additive SQL plus a raw `information_schema` gate, normalize admin order snapshots, and expose a dependency-injected read-only launch checker. Live PayPal configuration, database SQL execution, deployment, and real charge/refund remain separately authorized operator actions.

**Tech Stack:** Next.js 16.2.6 App Router, React 19.2.4, TypeScript 5.9, Prisma 5.22/PostgreSQL, Node 25 test runner, PayPal REST API, Resend, Playwright 1.61.

## Global Constraints

- The approved design is `docs/superpowers/specs/2026-07-15-monetization-critical-path-design.md`.
- Work in the current checkout because the approved storefront/payment work is uncommitted; a worktree based on old `HEAD` would omit it.
- Preserve unrelated user changes. Before each task, record `git diff -- <owned-files>`. For already-dirty files, stage only attributable hunks with `git add -p`; if a hunk overlaps prior work, leave it unstaged.
- Before modifying Next.js code, read `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` and `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md`.
- Every production behavior starts with a failing test and a witnessed RED result.
- Never run `prisma db push`, `prisma migrate deploy`, or the additive SQL against the configured database during implementation.
- Never create/update/delete PayPal webhooks, send mail, create/capture/refund a PayPal order, deploy, push, or perform a real-money test.
- Lemon Squeezy webhook verification remains for historical reconciliation; no public surface may create a new Lemon Squeezy checkout.
- The current 45-product static catalog remains unchanged.
- Repository-wide ESLint has unrelated failures. Run targeted ESLint for owned files and report it separately from global lint.

## File Map

- `tests/paypal-only-checkout.test.ts`: PayPal-only public contract.
- `src/app/checkout/page.tsx`: PayPal-only customer checkout.
- `src/app/api/checkout/route.ts`: fail-closed legacy card endpoint.
- `src/lib/checkout/discount-preview.ts`: shared client discount-preview adapter.
- `prisma/sql/2026-07-15-order-confirmation-columns.sql`: explicit additive production SQL.
- `src/lib/launch/database-preflight.ts`: raw payment-schema inspection.
- `src/lib/orders/admin-order-view.ts`: admin snapshot/address normalization.
- `src/lib/orders/admin-order-transition.ts`: provider-owned payment-state boundary.
- `src/lib/server/resend-config.ts`: Resend key/sender validation.
- `src/lib/launch/readiness.ts` and `scripts/launch-check.ts`: read-only release gate and CLI.
- `docs/runbooks/paypal-only-launch.md`: operator sequence and rollback.

---

### Task 1: Expose PayPal Only And Fail The Legacy Card Endpoint Closed

**Files:**
- Create: `tests/paypal-only-checkout.test.ts`
- Modify: `tests/lemonsqueezy-verification.test.ts`
- Modify: `src/app/checkout/page.tsx`
- Modify: `src/app/cart/page.tsx`
- Modify: `src/app/api/checkout/route.ts`
- Modify: `src/app/api/checkout/paypal/route.ts`
- Modify: `src/app/api/checkout/paypal/capture/route.ts`
- Modify: `src/app/faq/page.tsx`
- Modify: `src/app/terms/page.tsx`
- Modify: `src/app/privacy/page.tsx`
- Modify: `src/app/refund/page.tsx`
- Modify: `e2e/release-surfaces.spec.ts`

**Interfaces:**
- Preserves `POST /api/checkout/paypal` and `POST /api/checkout/paypal/capture`.
- Produces `POST /api/checkout` returning HTTP 410 with `{ error: "This checkout endpoint is disabled" }` and no quote, order, or provider work.
- Produces a PayPal button constrained to `paypal.FUNDING.PAYPAL`.

- [ ] **Step 1: Read the installed Next.js guides**

```powershell
Get-Content -Raw node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md
Get-Content -Raw node_modules/next/dist/docs/01-app/02-guides/environment-variables.md
```

Expected: both installed Next.js 16.2.6 guides are read completely before code changes.

- [ ] **Step 2: Write the failing PayPal-only contract test**

Create `tests/paypal-only-checkout.test.ts`:

```ts
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
```

Replace the old “card checkout includes the server payment binding” test in `tests/lemonsqueezy-verification.test.ts` with:

```ts
test("public Lemon Squeezy checkout is retired while verification remains", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/app/api/checkout/route.ts"),
    "utf8",
  );
  assert.match(source, /status:\s*410/);
  assert.doesNotMatch(source, /createPendingOrder|createLemonSqueezyPaymentBinding/);
});
```

Add to `e2e/release-surfaces.spec.ts`:

```ts
test("checkout offers only PayPal for a populated cart", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("cookie-consent", JSON.stringify({ necessary: true }));
  });
  await page.goto("/products/pearl-series-01");
  await page.getByRole("button", { name: /Add to Cart/ }).click();
  await page.goto("/checkout");
  await expect(page.getByText("PayPal", { exact: true })).toBeVisible();
  await expect(page.getByText("Card", { exact: true })).toHaveCount(0);
  await expect(page.getByText(/Afterpay|Klarna/)).toHaveCount(0);
});
```

- [ ] **Step 3: Run RED**

```powershell
node --import tsx --test tests/paypal-only-checkout.test.ts tests/lemonsqueezy-verification.test.ts
```

Expected: FAIL because the Card/BNPL surface and active Lemon Squeezy route exist and `FUNDING.PAYPAL` is absent.

- [ ] **Step 4: Implement the minimum PayPal-only behavior**

Replace `src/app/api/checkout/route.ts` with:

```ts
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "This checkout endpoint is disabled" },
    { status: 410 },
  );
}
```

In `src/app/checkout/page.tsx`:

- remove the `CreditCard` import, `paymentMethod` state, `handleCheckout`, Card selector, card-brand SVGs, BNPL badges, card submit button, and `paymentMethod` prop/checks;
- set the form handler to `onSubmit={(event) => event.preventDefault()}`;
- replace the payment block with:

```tsx
<div className="mt-6">
  <p className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
    Payment
  </p>
  <div className="rounded-lg border border-[#0070BA]/30 bg-[#0070BA]/5 p-3 text-center text-sm text-[#0070BA]">
    PayPal
  </div>
  <div id="paypal-button-container" className="mt-4" />
</div>
```

Render `PayPalButton` unconditionally after the form:

```tsx
<PayPalButton
  items={items}
  email={email}
  shippingAddress={{ name, phone, address, city, state, country, zip }}
  discountCode={appliedDiscountCode}
  validateForm={validateAll}
  onSuccess={clearCart}
/>
```

Set the PayPal Buttons option:

```ts
fundingSource: (window as any).paypal.FUNDING.PAYPAL,
```

Replace the cart card-brand row with:

```tsx
<p className="mt-4 text-center text-xs font-semibold text-[var(--text-muted)]">
  Checkout securely with PayPal
</p>
```

Change PayPal route/client errors containing Card or “another payment method” to “Please try PayPal again later.” Do not change authoritative quoting, provider binding, capture reservation, webhook verification, or the Lemon Squeezy webhook.

Replace unsupported policy claims with:

- FAQ: “We currently accept PayPal checkout. Funding options shown inside PayPal vary by account and country.”
- Terms: “We currently accept PayPal. PayPal controls the funding options available to each buyer.”
- Privacy: name PayPal as the payment processor and state that payment credentials are handled by PayPal, not stored by MythRealms; remove Stripe and PCI-DSS claims the project cannot substantiate.
- Refund: direct delayed-refund questions to PayPal or the buyer’s financial institution, not specifically to a credit-card company.

- [ ] **Step 5: Run GREEN and targeted checks**

```powershell
node --import tsx --test tests/paypal-only-checkout.test.ts tests/paypal-verification.test.ts tests/paypal-webhook.test.ts tests/lemonsqueezy-verification.test.ts
npx tsc --noEmit --pretty false
npx eslint src/app/checkout/page.tsx src/app/cart/page.tsx src/app/api/checkout/route.ts src/app/api/checkout/paypal/route.ts src/app/api/checkout/paypal/capture/route.ts src/app/faq/page.tsx src/app/terms/page.tsx src/app/privacy/page.tsx src/app/refund/page.tsx tests/paypal-only-checkout.test.ts
```

Expected: selected tests, TypeScript, and targeted ESLint exit 0.

- [ ] **Step 6: Create a narrow checkpoint**

```powershell
git add -- tests/paypal-only-checkout.test.ts
git add -p -- tests/lemonsqueezy-verification.test.ts src/app/checkout/page.tsx src/app/cart/page.tsx src/app/api/checkout/route.ts src/app/api/checkout/paypal/route.ts src/app/api/checkout/paypal/capture/route.ts src/app/faq/page.tsx src/app/terms/page.tsx src/app/privacy/page.tsx src/app/refund/page.tsx e2e/release-surfaces.spec.ts
git diff --cached --check
git diff --cached --name-only
git commit -m "fix: make checkout PayPal only"
```

Expected: only Task 1 hunks. If an interactive hunk overlaps pre-existing work, answer `n` and leave it uncommitted.

### Task 2: Unify Cart And Checkout Discount Preview

**Files:**
- Create: `src/lib/checkout/discount-preview.ts`
- Create: `tests/discount-preview.test.ts`
- Modify: `src/app/api/discounts/validate/route.ts`
- Modify: `src/app/cart/page.tsx`
- Modify: `src/app/checkout/page.tsx`

**Interfaces:**
- Produces `buildDiscountPreviewRequest(items, discountCode, email?)`.
- Produces `parseDiscountPreviewResponse(value)` returning `{ discount, label, total }`.
- Standardizes the API field as `discountCode`; client subtotal/discount values are never accepted.

- [ ] **Step 1: Write the failing adapter tests**

Create `tests/discount-preview.test.ts`:

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  buildDiscountPreviewRequest,
  parseDiscountPreviewResponse,
} from "../src/lib/checkout/discount-preview";

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
  ].map((file) => readFileSync(path.join(process.cwd(), file), "utf8"));
  for (const value of files) assert.match(value, /discountCode/);
  assert.doesNotMatch(files[0], /subtotal:\s*subtotal\(\)|discountValue\s*\?\?/);
  assert.doesNotMatch(files[2], /body\?\.code/);
});
```

- [ ] **Step 2: Run RED**

```powershell
node --import tsx --test tests/discount-preview.test.ts
```

Expected: FAIL because the adapter does not exist and the cart/route still use the old contract.

- [ ] **Step 3: Implement the adapter and canonical field**

Create `src/lib/checkout/discount-preview.ts`:

```ts
interface DiscountLineSource {
  product: { id: string };
  quantity: number;
}

export function buildDiscountPreviewRequest(
  items: readonly DiscountLineSource[],
  discountCode: string,
  email?: string,
) {
  const normalizedCode = discountCode.trim().toUpperCase();
  const normalizedEmail = email?.trim().toLowerCase();
  return {
    items: items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    })),
    ...(normalizedCode ? { discountCode: normalizedCode } : {}),
    ...(normalizedEmail ? { email: normalizedEmail } : {}),
  };
}

export function parseDiscountPreviewResponse(value: unknown): {
  discount: number;
  label: string;
  total: number;
} {
  if (typeof value !== "object" || value === null) {
    throw new Error("Invalid discount preview response");
  }
  const record = value as Record<string, unknown>;
  if (
    typeof record.discount !== "number" ||
    !Number.isFinite(record.discount) ||
    record.discount < 0 ||
    typeof record.total !== "number" ||
    !Number.isFinite(record.total) ||
    record.total < 0
  ) {
    throw new Error("Invalid discount preview response");
  }
  const first = Array.isArray(record.appliedDiscounts)
    ? record.appliedDiscounts[0]
    : null;
  const label =
    typeof first === "object" &&
    first !== null &&
    typeof (first as Record<string, unknown>).label === "string"
      ? String((first as Record<string, unknown>).label)
      : "Applied";
  return { discount: record.discount, label, total: record.total };
}
```

Make the discount route read:

```ts
const discountCode =
  typeof body?.discountCode === "string" && body.discountCode.trim()
    ? body.discountCode.trim().toUpperCase()
    : undefined;
```

Use `buildDiscountPreviewRequest(items, codeToUse, email)` in checkout and `buildDiscountPreviewRequest(items, code)` in cart. In cart, replace the client fallback with:

```ts
const preview = parseDiscountPreviewResponse(data);
setDiscountApplied(true);
setDiscountValue(preview.discount);
setDiscountLabel(preview.label);
```

The cart preview is provisional because it has no buyer email; checkout revalidates eligibility with the real email. Do not persist a client-computed discount into the paid checkout.

- [ ] **Step 4: Run GREEN**

```powershell
node --import tsx --test tests/discount-preview.test.ts tests/checkout-validation.test.ts tests/checkout-quote.test.ts tests/checkout-order.test.ts
npx tsc --noEmit --pretty false
npx eslint src/lib/checkout/discount-preview.ts src/app/api/discounts/validate/route.ts src/app/cart/page.tsx src/app/checkout/page.tsx tests/discount-preview.test.ts
```

Expected: selected tests, TypeScript, and targeted ESLint exit 0.

- [ ] **Step 5: Create a narrow checkpoint**

```powershell
git add -- src/lib/checkout/discount-preview.ts tests/discount-preview.test.ts
git add -p -- src/app/api/discounts/validate/route.ts src/app/cart/page.tsx src/app/checkout/page.tsx
git diff --cached --check
git commit -m "fix: align discount preview with checkout quote"
```

Expected: only Task 2 hunks; overlapping prior work remains unstaged.

### Task 3: Add An Explicit Database Payment-Schema Gate

**Files:**
- Create: `prisma/sql/2026-07-15-order-confirmation-columns.sql`
- Create: `src/lib/launch/database-preflight.ts`
- Create: `tests/database-preflight.test.ts`

**Interfaces:**
- Produces `inspectPaymentSchema(queryRaw): Promise<DatabaseCheck>`.
- Produces additive SQL for exactly two nullable `Order` confirmation columns.
- Consumes a tagged raw-query adapter; never calls `db.order`.

- [ ] **Step 1: Write the failing schema tests**

Create `tests/database-preflight.test.ts`:

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  inspectPaymentSchema,
  type PaymentSchemaState,
  type RawQuery,
} from "../src/lib/launch/database-preflight";

function query(state: PaymentSchemaState, capture: string[]): RawQuery {
  return async (strings) => {
    capture.push(strings.join(""));
    return [state] as never;
  };
}

test("uses information_schema and passes when the payment columns exist", async () => {
  const statements: string[] = [];
  const result = await inspectPaymentSchema(
    query(
      {
        tableExists: true,
        confirmationClaimedAtExists: true,
        confirmationSentAtExists: true,
      },
      statements,
    ),
  );
  assert.deepEqual(result, { ok: true, missing: [] });
  assert.match(statements[0], /information_schema\.tables/);
  assert.match(statements[0], /information_schema\.columns/);
  assert.match(statements[0], /confirmationClaimedAt/);
  assert.match(statements[0], /confirmationSentAt/);
});

test("reports a missing table and both columns without a Prisma model read", async () => {
  const result = await inspectPaymentSchema(
    query(
      {
        tableExists: false,
        confirmationClaimedAtExists: false,
        confirmationSentAtExists: false,
      },
      [],
    ),
  );
  assert.equal(result.ok, false);
  assert.deepEqual(result.missing, [
    "current_schema().Order",
    "current_schema().Order.confirmationClaimedAt",
    "current_schema().Order.confirmationSentAt",
  ]);
});

test("the manual SQL is additive and limited to the two nullable columns", () => {
  const sql = readFileSync(
    path.join(
      process.cwd(),
      "prisma/sql/2026-07-15-order-confirmation-columns.sql",
    ),
    "utf8",
  );
  assert.match(sql, /ADD COLUMN IF NOT EXISTS "confirmationClaimedAt" TIMESTAMP\(3\)/);
  assert.match(sql, /ADD COLUMN IF NOT EXISTS "confirmationSentAt" TIMESTAMP\(3\)/);
  assert.doesNotMatch(sql, /\bDROP\b|\bDELETE\b|\bUPDATE\b|NOT NULL/i);
});
```

- [ ] **Step 2: Run RED**

```powershell
node --import tsx --test tests/database-preflight.test.ts
```

Expected: FAIL because the preflight module and SQL file do not exist.

- [ ] **Step 3: Implement raw inspection and additive SQL**

Create `prisma/sql/2026-07-15-order-confirmation-columns.sql`:

```sql
ALTER TABLE "Order"
  ADD COLUMN IF NOT EXISTS "confirmationClaimedAt" TIMESTAMP(3);

ALTER TABLE "Order"
  ADD COLUMN IF NOT EXISTS "confirmationSentAt" TIMESTAMP(3);
```

Create `src/lib/launch/database-preflight.ts`:

```ts
export interface PaymentSchemaState {
  tableExists: boolean;
  confirmationClaimedAtExists: boolean;
  confirmationSentAtExists: boolean;
}

export type RawQuery = <T>(
  strings: TemplateStringsArray,
  ...values: unknown[]
) => PromiseLike<T>;

export interface DatabaseCheck {
  ok: boolean;
  missing: string[];
}

export async function inspectPaymentSchema(
  queryRaw: RawQuery,
): Promise<DatabaseCheck> {
  const rows = await queryRaw<PaymentSchemaState[]>`
    SELECT
      EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = current_schema() AND table_name = 'Order'
      ) AS "tableExists",
      EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'Order'
          AND column_name = 'confirmationClaimedAt'
      ) AS "confirmationClaimedAtExists",
      EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'Order'
          AND column_name = 'confirmationSentAt'
      ) AS "confirmationSentAtExists"
  `;
  const state = rows[0] ?? {
    tableExists: false,
    confirmationClaimedAtExists: false,
    confirmationSentAtExists: false,
  };
  const missing = [
    ...(!state.tableExists ? ["current_schema().Order"] : []),
    ...(!state.confirmationClaimedAtExists
      ? ["current_schema().Order.confirmationClaimedAt"]
      : []),
    ...(!state.confirmationSentAtExists
      ? ["current_schema().Order.confirmationSentAt"]
      : []),
  ];
  return { ok: missing.length === 0, missing };
}
```

Do not create a Prisma migration baseline and do not run the SQL. `prisma db push` would apply unrelated dirty-schema changes.

- [ ] **Step 4: Run GREEN**

```powershell
node --import tsx --test tests/database-preflight.test.ts
npx prisma validate
npx tsc --noEmit --pretty false
npx eslint src/lib/launch/database-preflight.ts tests/database-preflight.test.ts
```

Expected: all commands exit 0 without opening a database connection.

- [ ] **Step 5: Commit the three new files**

```powershell
git add -- prisma/sql/2026-07-15-order-confirmation-columns.sql src/lib/launch/database-preflight.ts tests/database-preflight.test.ts
git diff --cached --check
git commit -m "feat: add payment schema launch gate"
```

Expected: only the three newly created files.

### Task 4: Normalize Static-Catalog Orders For Admin

**Files:**
- Create: `src/lib/orders/admin-order-view.ts`
- Create: `tests/admin-order-view.test.ts`
- Modify: `src/app/api/admin/orders/[id]/route.ts`
- Modify: `src/app/admin/orders/[id]/page.tsx`

**Interfaces:**
- Produces `toAdminOrderItemView(source): AdminOrderItemView`.
- Produces `parseAdminShippingAddress(raw): AdminShippingAddressView | null`.
- Changes only the admin detail response; customer order APIs remain unchanged.

- [ ] **Step 1: Write the failing view-model tests**

Create `tests/admin-order-view.test.ts`:

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  parseAdminShippingAddress,
  toAdminOrderItemView,
} from "../src/lib/orders/admin-order-view";

const base = {
  id: "item-1",
  quantity: 2,
  price: 29.99,
  variant: null,
};

test("linked product wins and preserves line facts", () => {
  assert.deepEqual(
    toAdminOrderItemView({
      ...base,
      productSnapshot: JSON.stringify({ name: "Snapshot", slug: "snapshot" }),
      product: {
        name: "Linked Pearl",
        slug: "linked-pearl",
        images: JSON.stringify(["/linked.webp"]),
      },
    }),
    {
      id: "item-1",
      quantity: 2,
      price: 29.99,
      name: "Linked Pearl",
      slug: "linked-pearl",
      image: "/linked.webp",
      variantName: null,
    },
  );
});

test("null relation falls back to the static product snapshot", () => {
  const result = toAdminOrderItemView({
    ...base,
    product: null,
    productSnapshot: JSON.stringify({
      name: "Snapshot Pearl",
      slug: "pearl-series-01",
      image: "/snapshot.webp",
    }),
  });
  assert.equal(result.name, "Snapshot Pearl");
  assert.equal(result.slug, "pearl-series-01");
  assert.equal(result.image, "/snapshot.webp");
});

test("missing or corrupt snapshots degrade without a broken link", () => {
  for (const productSnapshot of [null, "{broken", "[]"]) {
    const result = toAdminOrderItemView({
      ...base,
      product: null,
      productSnapshot,
    });
    assert.equal(result.name, "Unknown item");
    assert.equal(result.slug, null);
    assert.equal(result.image, null);
  }
});

test("address prefers current address and supports legacy line1", () => {
  assert.equal(
    parseAdminShippingAddress(
      JSON.stringify({ address: "123 Pearl St", line1: "legacy" }),
    )?.address,
    "123 Pearl St",
  );
  assert.equal(
    parseAdminShippingAddress(JSON.stringify({ line1: "456 Legacy Rd" }))?.address,
    "456 Legacy Rd",
  );
  assert.equal(parseAdminShippingAddress("{broken"), null);
});

test("admin page never dereferences a nullable product relation", () => {
  const page = readFileSync(
    path.join(process.cwd(), "src/app/admin/orders/[id]/page.tsx"),
    "utf8",
  );
  assert.doesNotMatch(page, /item\.product\.(slug|name)/);
  assert.match(page, /item\.slug/);
});
```

- [ ] **Step 2: Run RED**

```powershell
node --import tsx --test tests/admin-order-view.test.ts
```

Expected: FAIL because `admin-order-view.ts` does not exist.

- [ ] **Step 3: Implement the view model**

Create `src/lib/orders/admin-order-view.ts`:

```ts
export interface AdminOrderItemInput {
  id: string;
  quantity: number;
  price: number;
  productSnapshot: string | null;
  product: { name: string; slug: string; images: string } | null;
  variant: { name: string } | null;
}

export interface AdminOrderItemView {
  id: string;
  name: string;
  slug: string | null;
  image: string | null;
  variantName: string | null;
  quantity: number;
  price: number;
}

function record(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function json(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function firstImage(value: string): string | null {
  const parsed = json(value);
  if (Array.isArray(parsed) && typeof parsed[0] === "string") return parsed[0];
  return value.startsWith("/") || value.startsWith("https://") ? value : null;
}

export function toAdminOrderItemView(
  item: AdminOrderItemInput,
): AdminOrderItemView {
  const snapshot = record(json(item.productSnapshot));
  const snapshotName =
    typeof snapshot?.name === "string" ? snapshot.name : "Unknown item";
  const snapshotSlug =
    typeof snapshot?.slug === "string" ? snapshot.slug : null;
  const snapshotImage =
    typeof snapshot?.image === "string" ? snapshot.image : null;
  return {
    id: item.id,
    name: item.product?.name ?? snapshotName,
    slug: item.product?.slug ?? snapshotSlug,
    image: item.product
      ? firstImage(item.product.images) ?? snapshotImage
      : snapshotImage,
    variantName: item.variant?.name ?? null,
    quantity: item.quantity,
    price: item.price,
  };
}

export interface AdminShippingAddressView {
  name: string | null;
  address: string | null;
  line2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
}

export function parseAdminShippingAddress(
  raw: string | null | undefined,
): AdminShippingAddressView | null {
  const value = record(json(raw ?? null));
  if (!value) return null;
  const string = (key: string) =>
    typeof value[key] === "string" && value[key].trim()
      ? value[key].trim()
      : null;
  return {
    name: string("name"),
    address: string("address") ?? string("line1"),
    line2: string("line2"),
    city: string("city"),
    state: string("state"),
    zip: string("zip"),
    country: string("country"),
  };
}
```

In the admin route, use an item-level `select` for `id`, `quantity`, `price`, `productSnapshot`, nullable product summary, and nullable variant. Return:

```ts
const { items, shippingAddress, ...rest } = order;
return NextResponse.json({
  ...rest,
  shippingAddress: parseAdminShippingAddress(shippingAddress),
  items: items.map(toAdminOrderItemView),
});
```

Update the client types to the flat response and add:

```ts
import { LazyImage } from "@/components/ui/LazyImage";
import { imageUrl } from "@/lib/images";
```

Use this product cell:

```tsx
<td className="py-3 px-6">
  <div className="flex items-center gap-3">
    {item.image && (
      <div className="relative h-10 w-10 overflow-hidden rounded-md">
        <LazyImage
          src={imageUrl(item.image)}
          alt=""
          fill
          sizes="40px"
          className="object-cover"
          containerClassName="absolute inset-0"
        />
      </div>
    )}
    {item.slug ? (
      <Link
        href={`/products/${item.slug}`}
        className="font-medium text-[var(--accent)] hover:underline"
      >
        {item.name}
      </Link>
    ) : (
      <span className="font-medium text-[var(--text)]">{item.name}</span>
    )}
  </div>
</td>
```

Render `address.address` before `address.line2`; never parse the address again in the client because the API now returns the normalized object.

- [ ] **Step 4: Run GREEN**

```powershell
node --import tsx --test tests/admin-order-view.test.ts tests/authorization.test.ts
npx tsc --noEmit --pretty false
npx eslint src/lib/orders/admin-order-view.ts src/app/api/admin/orders/[id]/route.ts src/app/admin/orders/[id]/page.tsx tests/admin-order-view.test.ts
```

Expected: selected tests, TypeScript, and targeted ESLint exit 0.

- [ ] **Step 5: Create a narrow checkpoint**

```powershell
git add -- src/lib/orders/admin-order-view.ts tests/admin-order-view.test.ts
git add -p -- src/app/api/admin/orders/[id]/route.ts src/app/admin/orders/[id]/page.tsx
git diff --cached --check
git commit -m "fix: render static catalog orders in admin"
```

Expected: only Task 4 hunks; overlapping pre-existing hunks remain unstaged.

### Task 5: Make Paid And Refunded States Provider-Owned

**Files:**
- Modify: `src/lib/orders/admin-order-transition.ts`
- Modify: `tests/admin-order-transition.test.ts`
- Modify: `src/app/admin/orders/[id]/page.tsx`
- Modify: `src/lib/payments/paypal-verification.ts`
- Modify: `tests/paypal-verification.test.ts`
- Modify: `src/app/api/webhooks/paypal/route.ts`
- Modify: `tests/paypal-webhook.test.ts`

**Interfaces:**
- Ordinary admin transitions are exactly `PENDING -> CANCELLED`, `PAID -> SHIPPED`, and `SHIPPED -> DELIVERED`.
- `PAID`, paid cancellation, and `REFUNDED` are provider-owned and return conflict status 409 from the admin transition helper.
- Produces `getPayPalRefundOrderPatch(refund, captureId)`; only a verified cumulative full refund includes `status: "REFUNDED"`.

- [ ] **Step 1: Write failing provider-ownership tests**

Replace the refund/cancellation expectations in `tests/admin-order-transition.test.ts` with:

```ts
test("allows only fulfillment transitions in the admin", () => {
  assert.deepEqual(getAdminOrderTransition("PENDING", "CANCELLED"), {
    restock: false,
  });
  assert.deepEqual(getAdminOrderTransition("PAID", "SHIPPED"), {
    restock: false,
  });
  assert.deepEqual(getAdminOrderTransition("SHIPPED", "DELIVERED"), {
    restock: false,
  });
});

test("keeps paid, paid cancellation, and refunded states provider-owned", () => {
  for (const [current, next] of [
    ["PENDING", "PAID"],
    ["PAID", "CANCELLED"],
    ["PAID", "REFUNDED"],
    ["SHIPPED", "REFUNDED"],
    ["DELIVERED", "REFUNDED"],
  ]) {
    assert.throws(
      () => getAdminOrderTransition(current, next),
      (error: unknown) =>
        error instanceof AdminOrderTransitionError &&
        error.status === 409 &&
        /PayPal/i.test(error.message),
    );
  }
});
```

Add to `tests/paypal-verification.test.ts`:

```ts
// Add getPayPalRefundOrderPatch to the existing import from
// ../src/lib/payments/paypal-verification.
test("builds refund state only from a verified full refund", () => {
  assert.deepEqual(
    getPayPalRefundOrderPatch({ outcome: "full" }, "PAYPAL-CAPTURE-456"),
    {
      status: "REFUNDED",
      stripePaymentStatus: "paypal:refunded:PAYPAL-CAPTURE-456",
    },
  );
  const partial = getPayPalRefundOrderPatch(
    { outcome: "partial" },
    "PAYPAL-CAPTURE-456",
  );
  assert.deepEqual(partial, {
    stripePaymentStatus: "paypal:partial-refund:PAYPAL-CAPTURE-456",
  });
  assert.equal("status" in partial, false);
});
```

Extend `tests/paypal-webhook.test.ts`:

```ts
test("admin cannot claim a refund and the webhook owns refund patches", () => {
  const adminPage = readFileSync(
    path.join(process.cwd(), "src/app/admin/orders/[id]/page.tsx"),
    "utf8",
  );
  assert.doesNotMatch(adminPage, /updateStatus\("REFUNDED"\)|Refund Order/);
  assert.match(adminPage, /Issue refunds in PayPal/);
  assert.match(source, /getPayPalRefundOrderPatch/);
});
```

- [ ] **Step 2: Run RED**

```powershell
node --import tsx --test tests/admin-order-transition.test.ts tests/paypal-verification.test.ts tests/paypal-webhook.test.ts
```

Expected: FAIL because admin transitions still allow provider-owned states, the UI issues local refunds, and the refund-patch helper is absent.

- [ ] **Step 3: Implement the provider-owned boundary**

Replace the transition table/logic in `src/lib/orders/admin-order-transition.ts` with:

```ts
const VALID_TRANSITIONS: Record<string, readonly string[]> = {
  PENDING: ["CANCELLED"],
  PAID: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
};

export class AdminOrderTransitionError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 409,
  ) {
    super(message);
    this.name = "AdminOrderTransitionError";
  }
}

export function getAdminOrderTransition(
  currentStatus: string,
  nextStatus: string,
): { restock: boolean } {
  const providerOwned =
    nextStatus === "PAID" ||
    nextStatus === "REFUNDED" ||
    (nextStatus === "CANCELLED" && currentStatus !== "PENDING");
  if (providerOwned) {
    throw new AdminOrderTransitionError(
      "Payment state must be changed by PayPal",
      409,
    );
  }
  if (!(VALID_TRANSITIONS[currentStatus] ?? []).includes(nextStatus)) {
    throw new AdminOrderTransitionError(
      `Cannot transition from ${currentStatus} to ${nextStatus}`,
      currentStatus === "PROCESSING_PAYMENT" ? 409 : 400,
    );
  }
  return { restock: false };
}
```

In `src/lib/payments/paypal-verification.ts`, export:

```ts
export function getPayPalRefundOrderPatch(
  refund: { outcome: "full" | "partial" },
  captureId: string,
): {
  status?: "REFUNDED";
  stripePaymentStatus: string;
} {
  return {
    ...(refund.outcome === "full" ? { status: "REFUNDED" as const } : {}),
    stripePaymentStatus:
      `paypal:${refund.outcome === "full" ? "refunded" : "partial-refund"}:${captureId}`,
  };
}
```

Use this helper for the PayPal webhook `data` patch, preserving eligible current states `PAID`, `SHIPPED`, and `DELIVERED`.

```ts
const patch = getPayPalRefundOrderPatch(refund, captureId);
await db.order.updateMany({
  where: {
    id: order.id,
    status: { in: ["PAID", "SHIPPED", "DELIVERED"] },
  },
  data: patch,
});
```

Remove the admin refund button and paid-order cancel button. For `PAID`, `SHIPPED`, and `DELIVERED`, render:

```tsx
<p className="rounded-lg border border-orange-900/30 bg-orange-900/10 p-3 text-xs leading-relaxed text-orange-300">
  Issue refunds in PayPal. This order will update automatically after PayPal confirms a full refund.
</p>
```

When saving tracking without a status transition, send `{ trackingNumber: trackingInput }` rather than sending the current status back through the transition helper.

- [ ] **Step 4: Run GREEN**

```powershell
node --import tsx --test tests/admin-order-transition.test.ts tests/paypal-verification.test.ts tests/paypal-webhook.test.ts
npx tsc --noEmit --pretty false
npx eslint src/lib/orders/admin-order-transition.ts src/app/admin/orders/[id]/page.tsx src/lib/payments/paypal-verification.ts src/app/api/webhooks/paypal/route.ts tests/admin-order-transition.test.ts tests/paypal-verification.test.ts tests/paypal-webhook.test.ts
```

Expected: selected tests, TypeScript, and targeted ESLint exit 0.

- [ ] **Step 5: Create a narrow checkpoint**

```powershell
git add -p -- src/lib/orders/admin-order-transition.ts tests/admin-order-transition.test.ts src/app/admin/orders/[id]/page.tsx src/lib/payments/paypal-verification.ts tests/paypal-verification.test.ts src/app/api/webhooks/paypal/route.ts tests/paypal-webhook.test.ts
git diff --cached --check
git commit -m "fix: make refund status provider owned"
```

Expected: only Task 5 hunks; no unrelated payment refactor.

### Task 6: Require A Verified Sender For All Storefront Email

**Files:**
- Create: `src/lib/server/resend-config.ts`
- Create: `tests/email.test.ts`
- Modify: `src/lib/email.ts`
- Modify: `src/lib/server/support-email.ts`
- Modify: `tests/fulfillment.test.ts`
- Modify: `tests/support-email.test.ts`
- Modify: `.env.example`

**Interfaces:**
- Produces `readResendConfig(env): { apiKey, from }`.
- Extends `sendOrderConfirmation(..., idempotencyKey?, options?)` with an injectable transport while preserving existing call sites.
- Extends `SupportEmailOptions` with `from?: string`.

- [ ] **Step 1: Write failing sender and transport tests**

Create `tests/email.test.ts`:

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { sendOrderConfirmation } from "../src/lib/email";
import {
  ResendConfigError,
  readResendConfig,
} from "../src/lib/server/resend-config";

test("requires both API key and verified sender", () => {
  assert.throws(
    () => readResendConfig({ RESEND_API_KEY: "", RESEND_FROM_EMAIL: "orders@example.com" }),
    (error: unknown) =>
      error instanceof ResendConfigError && /RESEND_API_KEY/.test(error.message),
  );
  assert.throws(
    () => readResendConfig({ RESEND_API_KEY: "key", RESEND_FROM_EMAIL: "" }),
    (error: unknown) =>
      error instanceof ResendConfigError && /RESEND_FROM_EMAIL/.test(error.message),
  );
  assert.throws(
    () =>
      readResendConfig({
        RESEND_API_KEY: "key",
        RESEND_FROM_EMAIL: "MythRealms <onboarding@resend.dev>",
      }),
    /verified sender/i,
  );
});

test("passes configured sender and idempotency key to the transport", async () => {
  let payload: Record<string, unknown> | undefined;
  let requestOptions: Record<string, unknown> | undefined;
  await sendOrderConfirmation(
    "buyer@example.com",
    "order-123",
    31.98,
    [],
    "order-confirmation/order-123",
    {
      apiKey: "resend-key",
      fromEmail: "MythRealms <orders@example.com>",
      transport: {
        async send(nextPayload, nextOptions) {
          payload = nextPayload as unknown as Record<string, unknown>;
          requestOptions = nextOptions as unknown as Record<string, unknown>;
          return { data: { id: "email-123" }, error: null };
        },
      },
    },
  );
  assert.equal(payload?.from, "MythRealms <orders@example.com>");
  assert.equal(payload?.to, "buyer@example.com");
  assert.equal(requestOptions?.idempotencyKey, "order-confirmation/order-123");
});

test("no storefront mailer uses the Resend testing sender", () => {
  for (const file of ["src/lib/email.ts", "src/lib/server/support-email.ts"]) {
    const source = readFileSync(path.join(process.cwd(), file), "utf8");
    assert.doesNotMatch(source, /onboarding@resend\.dev/);
  }
});
```

In `tests/fulfillment.test.ts`, add a case that sets `RESEND_API_KEY` but deletes `RESEND_FROM_EMAIL` and expects `sendOrderConfirmation` to reject with `RESEND_FROM_EMAIL`. In every `tests/support-email.test.ts` success/provider case, pass `from: "MythRealms <support@example.com>"`; add a missing-sender 503 case.

- [ ] **Step 2: Run RED**

```powershell
node --import tsx --test tests/email.test.ts tests/fulfillment.test.ts tests/support-email.test.ts
```

Expected: FAIL because the config module/options do not exist and both mailers hard-code the test sender.

- [ ] **Step 3: Implement runtime sender validation**

Create `src/lib/server/resend-config.ts`:

```ts
export class ResendConfigError extends Error {
  readonly status = 503;

  constructor(message: string) {
    super(message);
    this.name = "ResendConfigError";
  }
}

type ResendEnvironment = Pick<
  NodeJS.ProcessEnv,
  "RESEND_API_KEY" | "RESEND_FROM_EMAIL"
>;

export function readResendConfig(
  env: ResendEnvironment = process.env,
): { apiKey: string; from: string } {
  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey) throw new ResendConfigError("RESEND_API_KEY is missing");
  if (!from) throw new ResendConfigError("RESEND_FROM_EMAIL is missing");
  const senderPattern =
    /^(?:[^<>]+<[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+>|[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+)$/;
  if (/onboarding@resend\.dev/i.test(from) || !senderPattern.test(from)) {
    throw new ResendConfigError("RESEND_FROM_EMAIL must be a verified sender");
  }
  return { apiKey, from };
}
```

In `src/lib/email.ts`, use this exact import and define:

```ts
import {
  Resend,
  type CreateEmailOptions,
  type CreateEmailRequestOptions,
  type CreateEmailResponse,
} from "resend";
```

```ts
export interface OrderEmailTransport {
  send(
    payload: CreateEmailOptions,
    options?: CreateEmailRequestOptions,
  ): Promise<CreateEmailResponse>;
}

export interface OrderEmailOptions {
  apiKey?: string;
  fromEmail?: string;
  transport?: OrderEmailTransport;
}
```

Append `options: OrderEmailOptions = {}` to `sendOrderConfirmation`. Resolve config at call time:

```ts
const { apiKey, from } = readResendConfig({
  RESEND_API_KEY: options.apiKey ?? process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: options.fromEmail ?? process.env.RESEND_FROM_EMAIL,
});
const transport = options.transport ?? new Resend(apiKey).emails;
const { data, error } = await transport.send(
  {
    from,
    to: email,
    subject: `Order Confirmed — #${orderId.slice(-8)}`,
    html: OrderConfirmationTemplate(orderId, total, items),
  },
  { idempotencyKey },
);
if (error) throw new Error(`Resend order confirmation failed: ${error.message}`);
```

Make `sendAbandonedCart` use the same resolved `from`; if config is missing, preserve its existing best-effort return behavior.

In `support-email.ts`, add `from?: string` to options and resolve `{ apiKey, from }` using the same helper. Send `from` in the REST body.

Add to `.env.example`:

```dotenv
# Must be verified in Resend before production launch.
RESEND_FROM_EMAIL=""
```

- [ ] **Step 4: Run GREEN and durable-retry regression**

```powershell
node --import tsx --test tests/email.test.ts tests/fulfillment.test.ts tests/support-email.test.ts
npx tsc --noEmit --pretty false
npx eslint src/lib/server/resend-config.ts src/lib/email.ts src/lib/server/support-email.ts tests/email.test.ts tests/fulfillment.test.ts tests/support-email.test.ts
```

Expected: selected tests pass, including claim release/retry and no duplicate confirmation; TypeScript and targeted ESLint exit 0.

- [ ] **Step 5: Create a narrow checkpoint**

```powershell
git add -- src/lib/server/resend-config.ts tests/email.test.ts
git add -p -- src/lib/email.ts src/lib/server/support-email.ts tests/fulfillment.test.ts tests/support-email.test.ts .env.example
git diff --cached --check
git commit -m "fix: require verified storefront email sender"
```

Expected: only Task 6 hunks; secrets and `.env` are never staged.

### Task 7: Build A Read-Only Launch Readiness Gate

**Files:**
- Create: `src/lib/launch/readiness.ts`
- Create: `scripts/launch-check.ts`
- Create: `tests/launch-readiness.test.ts`
- Modify: `package.json`
- Modify: `.env.example`

**Interfaces:**
- Produces `runLaunchReadiness(env, dependencies): Promise<ReadinessReport>`.
- Produces `formatReadinessReport(report): string`.
- Produces `readinessExitCode(report): 0 | 1`.
- CLI performs only a raw DB read, PayPal OAuth token request, and `GET /v1/notifications/webhooks/{id}`.

- [ ] **Step 1: Write failing readiness tests**

Create `tests/launch-readiness.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";

import {
  formatReadinessReport,
  readinessExitCode,
  runLaunchReadiness,
  type ReadinessDependencies,
} from "../src/lib/launch/readiness";

const env = {
  DATABASE_URL: "postgresql://sentinel-db",
  NEXT_PUBLIC_APP_URL: "https://mythrealms-shop.vercel.app",
  AUTH_URL: "https://mythrealms-shop.vercel.app",
  LAUNCH_ALLOW_VERCEL_APP_URL: "true",
  PAYPAL_API_BASE: "https://api-m.paypal.com",
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: "sentinel-client",
  PAYPAL_CLIENT_SECRET: "sentinel-secret",
  PAYPAL_WEBHOOK_ID: "sentinel-webhook",
  RESEND_API_KEY: "sentinel-resend",
  RESEND_FROM_EMAIL: "MythRealms <orders@mythrealms.shop>",
} satisfies NodeJS.ProcessEnv;

function dependencies(
  webhook: Record<string, unknown> = {
    id: "sentinel-webhook",
    url: "https://mythrealms-shop.vercel.app/api/webhooks/paypal",
    event_types: [
      { name: "PAYMENT.CAPTURE.COMPLETED" },
      { name: "PAYMENT.CAPTURE.REFUNDED" },
    ],
  },
) {
  const calls: Array<{ url: string; method: string }> = [];
  const value: ReadinessDependencies = {
    inspectDatabase: async () => ({ ok: true, missing: [] }),
    fetch: async (input, init) => {
      const url = String(input);
      const method = init?.method ?? "GET";
      calls.push({ url, method });
      if (url.endsWith("/v1/oauth2/token")) {
        return new Response(JSON.stringify({ access_token: "sentinel-token" }));
      }
      return new Response(JSON.stringify(webhook));
    },
  };
  return { value, calls };
}

test("passes only with live matching configuration and required events", async () => {
  const deps = dependencies();
  const report = await runLaunchReadiness(env, deps.value);
  assert.equal(report.ok, true);
  assert.equal(readinessExitCode(report), 0);
  assert.deepEqual(deps.calls.map((call) => call.method), ["POST", "GET"]);
  assert.match(deps.calls[1].url, /\/v1\/notifications\/webhooks\/sentinel-webhook$/);
});

test("every required environment variable fails closed when missing", async () => {
  for (const key of [
    "DATABASE_URL",
    "NEXT_PUBLIC_APP_URL",
    "AUTH_URL",
    "PAYPAL_API_BASE",
    "NEXT_PUBLIC_PAYPAL_CLIENT_ID",
    "PAYPAL_CLIENT_SECRET",
    "PAYPAL_WEBHOOK_ID",
    "RESEND_API_KEY",
    "RESEND_FROM_EMAIL",
  ]) {
    const next = { ...env, [key]: "" };
    const report = await runLaunchReadiness(next, dependencies().value);
    assert.equal(report.ok, false, key);
    assert.equal(readinessExitCode(report), 1, key);
  }
});

test("rejects sandbox, unsafe app URLs, and split callback origins", async () => {
  for (const override of [
    { PAYPAL_API_BASE: "https://api-m.sandbox.paypal.com" },
    { NEXT_PUBLIC_APP_URL: "http://localhost:3000" },
    { NEXT_PUBLIC_APP_URL: "https://other.vercel.app" },
    { LAUNCH_ALLOW_VERCEL_APP_URL: "false" },
    { AUTH_URL: "https://different.example.com" },
  ]) {
    const report = await runLaunchReadiness(
      { ...env, ...override },
      dependencies().value,
    );
    assert.equal(report.ok, false);
  }
});

test("fails on webhook ID, URL, or event mismatch", async () => {
  for (const webhook of [
    {
      id: "other",
      url: "https://mythrealms-shop.vercel.app/api/webhooks/paypal",
      event_types: [
        { name: "PAYMENT.CAPTURE.COMPLETED" },
        { name: "PAYMENT.CAPTURE.REFUNDED" },
      ],
    },
    {
      id: "sentinel-webhook",
      url: "https://wrong.example.com/api/webhooks/paypal",
      event_types: [
        { name: "PAYMENT.CAPTURE.COMPLETED" },
        { name: "PAYMENT.CAPTURE.REFUNDED" },
      ],
    },
    {
      id: "sentinel-webhook",
      url: "https://mythrealms-shop.vercel.app/api/webhooks/paypal",
      event_types: [{ name: "PAYMENT.CAPTURE.COMPLETED" }],
    },
  ]) {
    const report = await runLaunchReadiness(env, dependencies(webhook).value);
    assert.equal(report.ok, false);
  }
});

test("database and provider failures are generic and secrets never print", async () => {
  const deps = dependencies();
  deps.value.inspectDatabase = async () => {
    throw new Error("postgresql://user:password@private-host");
  };
  deps.value.fetch = async () => {
    throw new Error("sentinel-token");
  };
  const report = await runLaunchReadiness(env, deps.value);
  const output = formatReadinessReport(report);
  for (const secret of [
    "sentinel-db",
    "sentinel-client",
    "sentinel-secret",
    "sentinel-webhook",
    "sentinel-resend",
    "sentinel-token",
    "private-host",
  ]) {
    assert.doesNotMatch(output, new RegExp(secret));
  }
  assert.equal(report.ok, false);
});
```

- [ ] **Step 2: Run RED**

```powershell
node --import tsx --test tests/launch-readiness.test.ts
```

Expected: FAIL because the readiness module does not exist.

- [ ] **Step 3: Implement the dependency-injected checker**

Create `src/lib/launch/readiness.ts` with:

```ts
import type { DatabaseCheck } from "@/lib/launch/database-preflight";
import { readResendConfig } from "@/lib/server/resend-config";

export type CheckStatus = "pass" | "fail" | "skipped";

export interface ReadinessCheck {
  id:
    | "environment"
    | "app-url"
    | "database"
    | "paypal-webhook"
    | "resend-sender";
  status: CheckStatus;
  message: string;
  remediation?: string;
}

export interface ReadinessReport {
  ok: boolean;
  checks: ReadinessCheck[];
}

export interface ReadinessDependencies {
  inspectDatabase(): Promise<DatabaseCheck>;
  fetch: typeof fetch;
}

const REQUIRED = [
  "DATABASE_URL",
  "NEXT_PUBLIC_APP_URL",
  "AUTH_URL",
  "PAYPAL_API_BASE",
  "NEXT_PUBLIC_PAYPAL_CLIENT_ID",
  "PAYPAL_CLIENT_SECRET",
  "PAYPAL_WEBHOOK_ID",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
] as const;

function configured(value: string | undefined): value is string {
  return Boolean(
    value?.trim() &&
      !/your-|placeholder|postgresql:\/\/user:password|\.example\b/i.test(value),
  );
}

function origin(
  value: string | undefined,
  allowKnownTemporaryOrigin = false,
): URL | null {
  try {
    if (!configured(value)) return null;
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash ||
      ["localhost", "127.0.0.1"].includes(url.hostname)
    ) {
      return null;
    }
    if (
      url.hostname.endsWith(".vercel.app") &&
      !(
        allowKnownTemporaryOrigin &&
        url.hostname === "mythrealms-shop.vercel.app"
      )
    ) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

function check(
  checks: ReadinessCheck[],
  id: ReadinessCheck["id"],
  ok: boolean,
  message: string,
  remediation: string,
) {
  checks.push({
    id,
    status: ok ? "pass" : "fail",
    message,
    ...(!ok ? { remediation } : {}),
  });
}

export async function runLaunchReadiness(
  env: NodeJS.ProcessEnv,
  dependencies: ReadinessDependencies,
): Promise<ReadinessReport> {
  const checks: ReadinessCheck[] = [];
  const missing = REQUIRED.filter((key) => !configured(env[key]));
  check(
    checks,
    "environment",
    missing.length === 0,
    missing.length === 0
      ? "Required launch environment is present."
      : "Required launch environment is incomplete.",
    "Set every required launch variable to a non-placeholder value.",
  );

  const allowKnownTemporaryOrigin =
    env.LAUNCH_ALLOW_VERCEL_APP_URL === "true";
  const appUrl = origin(
    env.NEXT_PUBLIC_APP_URL,
    allowKnownTemporaryOrigin,
  );
  const authUrl = origin(env.AUTH_URL, allowKnownTemporaryOrigin);
  const appUrlsMatch =
    Boolean(appUrl && authUrl) && appUrl?.origin === authUrl?.origin;
  check(
    checks,
    "app-url",
    appUrlsMatch,
    appUrlsMatch
      ? "Public and authentication origins match."
      : "Public and authentication origins are unsafe or inconsistent.",
    "Use the same approved HTTPS origin for NEXT_PUBLIC_APP_URL and AUTH_URL.",
  );

  try {
    const database = await dependencies.inspectDatabase();
    check(
      checks,
      "database",
      database.ok,
      database.ok
        ? "Payment schema is ready."
        : "Payment schema is missing required additive columns.",
      "Apply the reviewed additive SQL, then rerun this check.",
    );
  } catch {
    check(
      checks,
      "database",
      false,
      "Payment schema could not be inspected.",
      "Verify database connectivity without printing the connection string.",
    );
  }

  let resendReady = true;
  try {
    readResendConfig(env);
  } catch {
    resendReady = false;
  }
  check(
    checks,
    "resend-sender",
    resendReady,
    resendReady
      ? "Order-confirmation sender is configured."
      : "Order-confirmation sender is missing or unsafe.",
    "Configure a sender verified by Resend.",
  );

  const paypalBase = origin(env.PAYPAL_API_BASE);
  const paypalStaticReady =
    appUrlsMatch &&
    paypalBase?.origin === "https://api-m.paypal.com" &&
    [
      env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      env.PAYPAL_CLIENT_SECRET,
      env.PAYPAL_WEBHOOK_ID,
    ].every(configured);
  if (!paypalStaticReady || !appUrl) {
    check(
      checks,
      "paypal-webhook",
      false,
      "PayPal live configuration is incomplete or unsafe.",
      "Use PayPal live API credentials and matching public callback URLs.",
    );
  } else {
    try {
      const tokenResponse = await dependencies.fetch(
        "https://api-m.paypal.com/v1/oauth2/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              Buffer.from(
                `${env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`,
              ).toString("base64"),
          },
          body: "grant_type=client_credentials",
        },
      );
      const tokenPayload = tokenResponse.ok
        ? ((await tokenResponse.json()) as Record<string, unknown>)
        : {};
      const token =
        typeof tokenPayload.access_token === "string"
          ? tokenPayload.access_token
          : null;
      if (!token) throw new Error("provider-auth");

      const webhookResponse = await dependencies.fetch(
        `https://api-m.paypal.com/v1/notifications/webhooks/${encodeURIComponent(
          env.PAYPAL_WEBHOOK_ID!,
        )}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!webhookResponse.ok) throw new Error("provider-webhook");
      const webhook = (await webhookResponse.json()) as Record<string, unknown>;
      const events = Array.isArray(webhook.event_types)
        ? webhook.event_types
            .map((event) =>
              typeof event === "object" &&
              event !== null &&
              typeof (event as Record<string, unknown>).name === "string"
                ? String((event as Record<string, unknown>).name)
                : "",
            )
            .filter(Boolean)
        : [];
      const expectedUrl = new URL("/api/webhooks/paypal", appUrl).href;
      const webhookReady =
        webhook.id === env.PAYPAL_WEBHOOK_ID &&
        webhook.url === expectedUrl &&
        events.includes("PAYMENT.CAPTURE.COMPLETED") &&
        events.includes("PAYMENT.CAPTURE.REFUNDED");
      check(
        checks,
        "paypal-webhook",
        webhookReady,
        webhookReady
          ? "PayPal webhook ID, URL, and required events match."
          : "PayPal webhook ID, URL, or required events do not match.",
        "Correct the live webhook in PayPal after receiving explicit authorization.",
      );
    } catch {
      check(
        checks,
        "paypal-webhook",
        false,
        "PayPal webhook could not be verified.",
        "Verify live credentials and webhook ownership without printing provider responses.",
      );
    }
  }

  return {
    ok: checks.every((item) => item.status === "pass"),
    checks,
  };
}

export function formatReadinessReport(report: ReadinessReport): string {
  return report.checks
    .map(
      (item) =>
        `[${item.status.toUpperCase()}] ${item.id}: ${item.message}` +
        (item.remediation ? ` ${item.remediation}` : ""),
    )
    .join("\n");
}

export function readinessExitCode(report: ReadinessReport): 0 | 1 {
  return report.ok ? 0 : 1;
}
```

Do not log caught error messages, response bodies, tokens, IDs, URLs containing credentials, or environment values.

- [ ] **Step 4: Implement the CLI adapter and package command**

Create `scripts/launch-check.ts`:

```ts
import { db } from "../src/lib/db";
import {
  inspectPaymentSchema,
  type RawQuery,
} from "../src/lib/launch/database-preflight";
import {
  formatReadinessReport,
  readinessExitCode,
  runLaunchReadiness,
} from "../src/lib/launch/readiness";

async function main() {
  const report = await runLaunchReadiness(process.env, {
    inspectDatabase: () =>
      inspectPaymentSchema(db.$queryRaw.bind(db) as unknown as RawQuery),
    fetch,
  });
  console.log(formatReadinessReport(report));
  process.exitCode = readinessExitCode(report);
}

main()
  .catch(() => {
    console.error("[FAIL] launch-check: readiness check could not complete.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
```

Add to `package.json`:

```json
"launch:check": "node --env-file-if-exists=.env --import tsx scripts/launch-check.ts"
```

Consolidate the duplicate PayPal section in `.env.example`. Document all required live values, including `AUTH_URL`, `NEXT_PUBLIC_APP_URL`, `PAYPAL_API_BASE=https://api-m.paypal.com`, `PAYPAL_WEBHOOK_ID`, and `RESEND_FROM_EMAIL`. Add `LAUNCH_ALLOW_VERCEL_APP_URL="false"`; setting it to `true` is the explicit approval for the one known temporary host. Do not add `launch:check` to `vercel.json`.

- [ ] **Step 5: Run GREEN with fakes only**

```powershell
node --import tsx --test tests/launch-readiness.test.ts tests/database-preflight.test.ts
npx tsc --noEmit --pretty false
npx eslint src/lib/launch/readiness.ts scripts/launch-check.ts tests/launch-readiness.test.ts
```

Expected: selected tests, TypeScript, and targeted ESLint exit 0. Do not run `npm run launch:check` against the current environment yet.

- [ ] **Step 6: Create a narrow checkpoint**

```powershell
git add -- src/lib/launch/readiness.ts scripts/launch-check.ts tests/launch-readiness.test.ts
git add -p -- package.json .env.example
git diff --cached --check
git commit -m "feat: add read-only launch readiness gate"
```

Expected: only Task 7 files/hunks; no secret values and no Vercel build change.

### Task 8: Add The Operator Runbook And Verify The Release Candidate

**Files:**
- Create: `docs/runbooks/paypal-only-launch.md`
- Create: `tests/launch-runbook.test.ts`
- Modify: `e2e/release-surfaces.spec.ts` only if the Task 1 scenario needs selector stabilization.

**Interfaces:**
- Produces an executable operator sequence without performing any production action.
- Produces the final verification evidence for the local release candidate.

- [ ] **Step 1: Write the failing runbook contract test**

Create `tests/launch-runbook.test.ts`:

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

test("PayPal launch runbook contains every safety gate", () => {
  const runbook = readFileSync(
    path.join(process.cwd(), "docs/runbooks/paypal-only-launch.md"),
    "utf8",
  );
  for (const required of [
    "Record the production database backup",
    "Record the current deployment ID",
    "npm run launch:check",
    "prisma/sql/2026-07-15-order-confirmation-columns.sql",
    "PAYMENT.CAPTURE.COMPLETED",
    "PAYMENT.CAPTURE.REFUNDED",
    "explicit user authorization",
    "PENDING",
    "PAID",
    "REFUNDED",
    "never capture the order a second time",
  ]) {
    assert.match(runbook, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(runbook, /(?:^|\n)\s*prisma db push\b|DROP COLUMN|PAYPAL_CLIENT_SECRET=/);
});
```

- [ ] **Step 2: Run RED**

```powershell
node --import tsx --test tests/launch-runbook.test.ts
```

Expected: FAIL because the runbook does not exist.

- [ ] **Step 3: Write the complete runbook**

Create `docs/runbooks/paypal-only-launch.md` with these exact ordered sections:

```markdown
# PayPal-Only Production Launch

## Authority Boundary

This document does not authorize database writes, deployment, PayPal webhook changes, a charge, or a refund. Obtain explicit user authorization before each production mutation and before the live-money probe.

## 1. Record And Back Up

- Record the production database backup and verify it can be restored.
- Record the current deployment ID and public origin.
- Confirm `NEXT_PUBLIC_APP_URL` and `AUTH_URL` are the same HTTPS origin.

## 2. Read-Only Gate

Run `npm run launch:check`. Stop on any failure. Do not print or paste secrets.

## 3. Additive Database Change

After database-write authorization, run:

`npx prisma db execute --file prisma/sql/2026-07-15-order-confirmation-columns.sql --schema prisma/schema.prisma`

Run `npm run launch:check` again. Never use `prisma db push`.

## 4. Provider And Sender

- Verify the PayPal live webhook URL ends in `/api/webhooks/paypal`.
- Require `PAYMENT.CAPTURE.COMPLETED` and `PAYMENT.CAPTURE.REFUNDED`.
- Verify `RESEND_FROM_EMAIL` is a sender verified inside Resend.

## 5. Pre-Money Smoke Test

- Checkout shows PayPal only.
- Disabled legacy checkout returns 410 without creating an order.
- Admin renders a static snapshot item and current shipping address.
- Admin cannot mark `PAID` or `REFUNDED`.
- An unsigned PayPal webhook is rejected.

## 6. Authorized Live Probe

After separate explicit user authorization, make one small real purchase. Verify `PENDING -> PAID`, the brand-sender email, and the exact admin item/address. Initiate the refund in PayPal, never in admin. A partial refund must not claim `REFUNDED`; cumulative/full refund confirmation must produce `REFUNDED`.

## 7. Rollback And Reconciliation

Before capture, restore the prior deployment if smoke tests fail. After a capture/app-write failure, never capture the order a second time; query PayPal by provider order/custom ID and reconcile manually. Keep the two nullable confirmation columns during application rollback. Do not use a destructive down migration.
```

- [ ] **Step 4: Run the focused browser acceptance**

```powershell
npx playwright test e2e/release-surfaces.spec.ts --grep "checkout offers only PayPal" --project=chromium
```

Expected: one selected PayPal-only scenario passes.

- [ ] **Step 5: Run the complete local verification matrix**

```powershell
npm run test:unit
npx tsc --noEmit --pretty false
npx prisma validate
npx tsx scripts/verify-source-preserved-catalog.ts
npx playwright test e2e/release-surfaces.spec.ts --project=chromium
npx eslint src/app/checkout/page.tsx src/app/cart/page.tsx src/app/api/checkout/route.ts src/app/api/checkout/paypal/route.ts src/app/api/checkout/paypal/capture/route.ts src/app/faq/page.tsx src/app/terms/page.tsx src/app/privacy/page.tsx src/app/refund/page.tsx src/app/api/discounts/validate/route.ts src/lib/checkout/discount-preview.ts src/lib/launch/database-preflight.ts src/lib/launch/readiness.ts scripts/launch-check.ts src/lib/orders/admin-order-view.ts src/lib/orders/admin-order-transition.ts src/app/api/admin/orders/[id]/route.ts src/app/admin/orders/[id]/page.tsx src/lib/payments/paypal-verification.ts src/app/api/webhooks/paypal/route.ts src/lib/server/resend-config.ts src/lib/email.ts src/lib/server/support-email.ts tests/paypal-only-checkout.test.ts tests/discount-preview.test.ts tests/database-preflight.test.ts tests/launch-readiness.test.ts tests/admin-order-view.test.ts tests/admin-order-transition.test.ts tests/paypal-verification.test.ts tests/paypal-webhook.test.ts tests/email.test.ts tests/support-email.test.ts tests/fulfillment.test.ts tests/launch-runbook.test.ts
npm run build
git diff --check
```

Expected:

- all unit tests pass;
- TypeScript, Prisma validation, catalog verification, release-surface Playwright, targeted ESLint, production build, and diff check exit 0;
- no claim is made about repository-wide ESLint;
- `npm run launch:check` is not run against real credentials until the user authorizes that read-only production check.

- [ ] **Step 6: Review every acceptance criterion**

Re-read `docs/superpowers/specs/2026-07-15-monetization-critical-path-design.md` and record evidence for: PayPal-only UI, disabled LS checkout, authoritative quote/binding preserved, DB gate, admin snapshot/address, provider-owned refund, verified sender, safe readiness output, runbook, and no production mutation.

- [ ] **Step 7: Create the final documentation checkpoint**

```powershell
git add -- docs/runbooks/paypal-only-launch.md tests/launch-runbook.test.ts
git add -p -- e2e/release-surfaces.spec.ts
git diff --cached --check
git commit -m "docs: add PayPal launch runbook"
```

Expected: only Task 8 files/hunks. Do not push or deploy.
