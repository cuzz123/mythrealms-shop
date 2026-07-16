# Launch-safe Discounts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent new PayPal orders from using first-order or capped discount codes until atomic reservation semantics exist, while preserving unlimited discounts and historical paid-order fulfillment.

**Architecture:** The authoritative `quoteCheckout` path remains the single policy boundary for cart preview, checkout revalidation, and PayPal order creation. Discount validation fails closed before calculating a constrained discount; payment fulfillment is unchanged so previously accepted pending orders remain fulfillable after capture.

**Tech Stack:** TypeScript, Node test runner, Prisma repository interfaces, Next.js 16.2.6, ESLint 9.

## Global Constraints

- Reject every discount with `firstOrderOnly: true`.
- Reject every discount with `maxUses > 0`, even when `usedCount` is below the cap.
- Continue supporting active, date-valid, unlimited codes with `firstOrderOnly: false` and `maxUses: 0`.
- Use the exact customer-facing message `Limited and first-order promotions are temporarily unavailable`.
- Do not change payment fulfillment, admin discount management, Prisma schema, production data, provider configuration, or deployment state.
- Do not run the live launch gate, provider calls, database writes, purchases, or refunds.

---

### Task 1: Enforce the launch-safe discount policy

**Files:**
- Modify: `tests/checkout-quote.test.ts`
- Modify: `src/lib/checkout/quote.ts`

**Interfaces:**
- Consumes: `quoteCheckout(input: CheckoutQuoteInput, repository: DiscountRepository, now?: Date): Promise<CheckoutQuote>` and `DiscountRecord`.
- Produces: the same public interfaces; constrained discounts throw `CheckoutQuoteError` with status `400` before discount calculation or paid-order eligibility lookup.

- [ ] **Step 1: Write the failing constrained-discount regression test**

Add this test after `applies percentage and fixed discounts in integer cents` in `tests/checkout-quote.test.ts`:

```ts
test("fails closed for discounts that require reservation semantics", async () => {
  for (const record of [
    discount({ maxUses: 5, usedCount: 0 }),
    discount({ firstOrderOnly: true }),
  ]) {
    await assert.rejects(
      () =>
        quoteCheckout(
          checkoutRequest({ discountCode: record.code }),
          repository(record, 0),
          NOW,
        ),
      (error: unknown) => {
        assert.ok(error instanceof CheckoutQuoteError);
        assert.equal(error.status, 400);
        assert.equal(
          error.message,
          "Limited and first-order promotions are temporarily unavailable",
        );
        return true;
      },
    );
  }
});
```

- [ ] **Step 2: Run the new test and verify RED**

Run:

```powershell
node --import tsx --test tests/checkout-quote.test.ts
```

Expected: FAIL because a capped code below its current limit and a first-order code with zero paid orders are still accepted.

- [ ] **Step 3: Implement the minimal authoritative quote guard**

In `src/lib/checkout/quote.ts`, add this constant below the shipping constants:

```ts
const RESERVATION_REQUIRED_DISCOUNT_MESSAGE =
  "Limited and first-order promotions are temporarily unavailable";
```

In `validateDiscount`, replace the current `maxUses` exhaustion check with this fail-closed guard, after activation/expiry validation and before minimum-subtotal validation:

```ts
if (discount.firstOrderOnly || discount.maxUses > 0) {
  throw new CheckoutQuoteError(RESERVATION_REQUIRED_DISCOUNT_MESSAGE);
}
```

Delete this paid-order lookup block from `quoteCheckout`, because every `firstOrderOnly` code is now rejected inside `validateDiscount`:

```ts
if (
  discount.firstOrderOnly &&
  (await repository.countPaidOrdersByEmail(input.email)) > 0
) {
  throw new CheckoutQuoteError(
    `${discount.label} is only valid for first-time orders`,
  );
}
```

Do not change `DiscountRepository`, `prismaDiscountRepository`, or fulfillment in this launch fix. Retaining the repository method avoids an unrelated interface refactor and does not perform a database query because the call site is removed.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run:

```powershell
node --import tsx --test tests/checkout-quote.test.ts tests/discount-preview.test.ts tests/paypal-only-checkout.test.ts tests/fulfillment.test.ts
```

Expected: all tests pass. The new test proves both constrained cases fail closed; the existing percentage/fixed test proves unlimited codes still calculate in integer cents; fulfillment tests prove already accepted orders remain idempotently fulfillable.

- [ ] **Step 5: Run static checks**

Run:

```powershell
npx tsc --noEmit --pretty false
npx eslint -- src/lib/checkout/quote.ts tests/checkout-quote.test.ts
git diff --check -- src/lib/checkout/quote.ts tests/checkout-quote.test.ts
```

Expected: all three commands exit `0` with no TypeScript, lint, or whitespace error.

- [ ] **Step 6: Audit and commit only the policy files**

Run:

```powershell
git diff -- src/lib/checkout/quote.ts tests/checkout-quote.test.ts
git add -- src/lib/checkout/quote.ts tests/checkout-quote.test.ts
git diff --cached --name-status
git diff --cached --check
git commit -m "fix: disable unsafe launch discounts"
```

Expected: the cached manifest contains exactly the two listed files, and the commit succeeds.

- [ ] **Step 7: Verify the committed artifact without production access**

Run from committed code:

```powershell
$env:RESEND_API_KEY=''
$env:RESEND_FROM_EMAIL=''
npm run test:unit
npx tsc --noEmit --pretty false
npx prisma validate
npx eslint -- src/lib/checkout/quote.ts tests/checkout-quote.test.ts
npm run build
```

Expected: unit tests, TypeScript, Prisma validation, scoped ESLint, and the Next production build all pass. Do not run `npm run launch:check`.
