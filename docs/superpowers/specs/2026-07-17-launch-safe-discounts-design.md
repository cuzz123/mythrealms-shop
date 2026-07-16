# Launch-safe discount policy design

## Context

The current checkout validates `maxUses`, `firstOrderOnly`, activation dates, and expiry while quoting a pending PayPal order. The accepted discount is then stored on that pending order. Payment fulfillment happens later and increments `usedCount` without atomically reserving eligibility.

That separation permits several pending orders to pass the same capped or first-order check before any one of them is paid. Once PayPal captures the money, fulfillment must not reject the order, so rechecking only after capture cannot safely enforce the promotion limit.

## Launch decision

For the initial launch, server-side checkout will fail closed for discount codes that require reservation semantics:

- reject every code with `firstOrderOnly: true`;
- reject every code with `maxUses > 0`;
- continue supporting active, date-valid, unlimited codes where `firstOrderOnly` is false and `maxUses` is zero;
- continue enforcing minimum subtotal, supported discount type, percentage/fixed amount, activation time, and expiry for those supported codes.

The rejection occurs inside the authoritative quote path used by cart preview, checkout revalidation, and PayPal order creation. Client behavior is not trusted to enforce the policy.

## Customer behavior

Unsupported constrained codes return a clear launch-safe validation error and are not applied to the quote. Existing cart and checkout error handling clears stale discount preview state after a failed revalidation.

The message must not imply that the customer is ineligible. It should say that limited or first-order promotions are temporarily unavailable, so the storefront does not make a false eligibility claim.

## Existing pending orders

Orders created before this policy is deployed may already contain a constrained discount. If such an order is later captured successfully, fulfillment continues normally and preserves the amount PayPal actually charged. The fulfillment path must not reject or reprice an already-captured payment.

`usedCount` may continue to increment for those grandfathered orders. This keeps historical records truthful while preventing new constrained reservations from entering the system.

## Scope

Implementation is intentionally narrow:

- add the fail-closed policy to the authoritative server quote validation;
- add regression tests for capped, first-order, and unlimited codes;
- verify the discount preview and PayPal order creation paths continue to depend on the authoritative quote;
- preserve existing payment fulfillment and historical pending-order behavior.

Out of scope for this launch fix:

- a discount reservation/redemption table;
- serializable quota allocation;
- reservation expiry or cleanup jobs;
- changes to admin discount management;
- production database mutations;
- retroactive cancellation of pending orders;
- deployment or live payment testing.

## Error handling and safety invariants

1. A constrained code never changes the server-calculated total for a newly quoted order.
2. An unlimited supported code retains the current integer-cent calculation behavior.
3. A client-supplied price, discount amount, or eligibility result remains ignored.
4. Payment fulfillment stays idempotent and never fails solely because a previously accepted code is now unsupported.
5. No schema migration is required.

## Verification

The implementation must demonstrate:

- a `maxUses > 0` code is rejected even when `usedCount` is below the cap;
- a `firstOrderOnly` code is rejected even for an email with no paid orders;
- an active unlimited non-first-order code still applies correctly;
- existing unusable-code checks still pass;
- checkout/discount contract tests, fulfillment tests, TypeScript, scoped ESLint, and the production build pass from committed code.

Production readiness remains separate: no live launch gate, provider call, database change, deployment, purchase, or refund is authorized by this design.
