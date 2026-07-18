# Task 4 Report: Complete Ecommerce Event Funnel

## Status

Implemented and verified on `codex/us-cold-start-readiness` from base `8d595f2`.

## Files

- Created `tests/analytics-tracking.test.ts`
- Modified `src/lib/tracking.ts`
- Modified `src/lib/cart.ts`
- Modified `src/components/layout/Analytics.tsx`
- Modified `src/app/products/[slug]/1688-product.tsx`
- Modified `src/app/checkout/page.tsx`
- Modified `src/app/checkout/success/tracker.tsx`
- Created `.superpowers/sdd/task-4-report.md`

No unrelated source files were changed. Existing untracked SDD artifacts were left untouched.

## Architecture

`src/lib/tracking.ts` now owns the ecommerce event contract:

- Pure GA4 payload builders provide exact USD currency, values, item IDs, names, prices, quantities, categories/variants, and purchase transaction IDs.
- A typed optional `TrackingTarget` supports GA, Meta, and Pinterest without making one platform depend on another.
- Browser defaults read platform configuration from the three `NEXT_PUBLIC_*` IDs and consent through Task 3's strict `parseConsent` path. Missing, malformed, or inaccessible consent remains fail-closed.
- GA uses analytics consent. Meta and Pinterest use marketing consent.
- Each platform has its own pending `Map`, keyed by serialized call arguments. Identical pending events deduplicate, live retries remove the matching pending event, and `flushTrackingQueue(platform)` drains only that platform.
- Dispatch exceptions are isolated per platform and do not break cart or checkout behavior.
- Pinterest maps product views to `pagevisit`, cart additions to `addtocart`, and paid purchases to `checkout`.
- `trackPurchase` returns true only when at least one configured and consented platform dispatched or queued the event.

Funnel integrations:

- `Analytics.tsx` keeps Next 16 `Script.onReady` callbacks and adds synchronous platform-ready DOM events because browser verification proved inline `Script` elements execute without invoking `onReady` in this runtime. Listeners are registered before the consent controller can enable scripts.
- The cart store tracks every `addItem` call once, covering all existing entry points centrally.
- Product detail tracks on mount and on `CONSENT_CHANGED_EVENT`; pending-map deduplication preserves consent retry without a lossy component flag.
- Checkout uses a ref to emit `begin_checkout` once per mount when the cart is non-empty.
- Paid success uses `purchaseStorageKey(orderId)`, writes the dedupe key only after dispatch/queue acceptance, retries on consent changes while absent, and removes the listener on cleanup.
- Payloads contain product/order facts only. No email, customer name, phone, or address is sent.

## TDD Evidence

### Initial RED

Command:

```powershell
npm run test:unit -- tests/analytics-tracking.test.ts
```

Result: exit 1; 15 tests, 0 passed, 15 failed for the intended missing builders, return values, queues, consent/config gates, storage key, and funnel wiring.

### Initial GREEN

Same command after implementation: exit 0; 15 tests, 15 passed.

### Browser-Discovered RED/GREEN

The first Playwright funnel run timed out waiting for `view_item`. A diagnostic showed all three inline initializer functions existed but contained only bootstrap calls, proving inline `Script.onReady` did not flush the queues.

A new focused test, `inline initializers signal an immediate platform-specific flush`, was added first:

```powershell
npm run test:unit -- tests/analytics-tracking.test.ts
```

RED result: exit 1; 16 tests, 15 passed, 1 failed for the missing ready signal.

GREEN result after the synchronous ready-event implementation: exit 0; 16 tests, 16 passed.

## Verification

Local Next 16 documentation read before editing:

```powershell
Get-Content -Raw node_modules\next\dist\docs\01-app\03-api-reference\02-components\script.md
```

Confirmed `onReady` is available and client-only.

Focused analytics and consent suites:

```powershell
npm run test:unit -- tests/analytics-tracking.test.ts tests/analytics-consent.test.ts
```

Result: exit 0; 28 tests, 28 passed, 0 failed.

Full unit suite:

```powershell
npm run test:unit
```

Result: exit 0; 324 tests, 324 passed, 0 failed.

Scoped direct ESLint (the worktree has no `node_modules/.bin`):

```powershell
node node_modules/eslint/bin/eslint.js tests/analytics-tracking.test.ts src/lib/tracking.ts src/lib/cart.ts src/components/layout/Analytics.tsx 'src/app/products/[slug]/1688-product.tsx' src/app/checkout/page.tsx src/app/checkout/success/tracker.tsx
```

Result: exit 0; no errors or warnings.

Repository-wide direct ESLint:

```powershell
node node_modules/eslint/bin/eslint.js .
```

Result: exit 0; 0 errors and 169 pre-existing warnings in unrelated source, scripts, and bundled `.claude` assets.

Whitespace check:

```powershell
git diff --check
```

Result: exit 0; no whitespace errors. Git printed only line-ending conversion notices for existing CRLF policy.

Optional TypeScript check:

```powershell
node node_modules/typescript/bin/tsc --noEmit
```

Result: exit 2 due one unrelated pre-existing error at `tests/seo-catalog.test.ts:85` (`OpenGraph.type`). Task 3's consent-listener casts in the modified analytics component were corrected and no Task 4 type error remained.

No `npm install` or `npm ci` was run.

## Browser Verification

The direct Next entry point was required because `.bin` is absent. Turbopack rejected the worktree's external `node_modules` symlink, so the documented `--webpack` engine was used:

```powershell
node node_modules/next/dist/bin/next dev --webpack -p 3214
```

The bundled Playwright Chromium executable was absent, so no install was performed. The existing system Chrome executable was passed to Playwright. Third-party endpoints were aborted so the local platform queues remained inspectable.

Result: exit 0 with:

```json
{"essentialOnlyScripts":0,"productView":{"ga":1,"meta":1,"pinterest":1},"addToCart":{"ga":1,"meta":1,"pinterest":1},"beginCheckout":{"ga":1,"meta":1},"personalDataFields":0}
```

This verified essential-only script gating, same-page consent activation and one-per-platform product-view flush, centralized add-to-cart, once-per-mount begin checkout, and absence of personal fields. The local server was stopped after verification.

## Self-Review

- Re-read the complete brief and inspected every changed diff.
- Confirmed consent parsing still delegates to Task 3 and no permissive fallback was added.
- Confirmed configured-platform checks precede dispatch/queue acceptance.
- Confirmed a late platform flush cannot replay another platform's events.
- Confirmed pending duplicates collapse and live retries remove the matching pending entry.
- Confirmed React listeners use matching add/remove callbacks and checkout tracks only once per mount.
- Confirmed success tracking writes storage only after `trackPurchase` returns true and includes `items` in dependencies.
- Searched tracking and success files for email, phone, address, and shipping payload fields; none are present.
- Confirmed only scoped files will be staged.

## Concerns

- A paid success refresh was not browser-tested because no safe paid-order fixture was available. Purchase payload/storage-key behavior and component wiring are covered by focused tests, and the full unit suite remains green.
- Repository-wide ESLint retains 169 unrelated warnings.
- The optional TypeScript check retains the unrelated `tests/seo-catalog.test.ts:85` error described above.
- A separate read-only Claude review was started but did not return promptly and was terminated at the user's status request; Codex completed the documented self-review directly.

## Review Fixes

### RED

```powershell
npm run test:unit -- tests/analytics-tracking.test.ts tests/analytics-consent.test.ts
```

Result: exit 1; 31 tests, 28 passed, 3 failed.

- `drops queued events when consent is revoked before platform readiness`: dispatched the queued GA `view_item` after consent was revoked.
- `keeps a queued event when an identical live dispatch throws`: expected the later flush to dispatch once; received 0 calls.
- `maps begin checkout to Pinterest checkout`: `trackBeginCheckout` returned `false` with only Pinterest configured.

### GREEN

```powershell
npm run test:unit -- tests/analytics-tracking.test.ts tests/analytics-consent.test.ts
```

Result: exit 0; 31 tests, 31 passed, 0 failed.

- Queue flushing rechecks platform consent and clears events revoked before readiness.
- A queued duplicate remains until its live dispatcher succeeds.
- `trackBeginCheckout` emits Pinterest's supported `checkout` event.
