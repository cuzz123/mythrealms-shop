# MythRealms Storefront Release Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the pearl-only MythRealms storefront safe to publish by enforcing authoritative checkout pricing, payment binding, catalog isolation, server-side authorization, truthful UX, responsive navigation, and consistent SEO/GEO.

**Architecture:** Keep the 20 active pearl products as the storefront source of truth and use Prisma only for orders, discounts, users, and operational data. Introduce small pure modules for catalog visibility, checkout validation/quoting, PayPal verification, and paid-order fulfillment; route handlers become adapters around those modules.

**Tech Stack:** Next.js 16.2.6 App Router, React 19, TypeScript, Prisma 5, Node 25 test runner with `tsx`, Playwright, Tailwind CSS 4.

## Global Constraints

- Read relevant guides under `node_modules/next/dist/docs/` before changing Next.js APIs or conventions.
- Exactly 20 active `pearl-series` products are public; no database Product is part of the storefront catalog.
- Product prices, quantities, shipping, discounts, totals, provider IDs, and paid state are server-authoritative.
- Money is calculated as integer cents; quantity is an integer from 1 through 10 per line, with at most 20 lines and 50 total units.
- Static supplier product images are not replaced or rewritten.
- Gift cards and legacy crystal blog content are unpublished rather than rebuilt in this implementation.
- Existing unrelated worktree changes and media assets must not be reverted, staged, or reformatted.
- Implementation tasks remain uncommitted in this dirty worktree so pre-existing changes in shared files are never captured accidentally; each task uses a uniquely named diff/report checkpoint instead of a commit.
- No Vercel deployment or production database mutation is part of this plan.
- Every production behavior change follows RED, GREEN, REFACTOR and records the covering command.

---

### Task 1: Test Harness And Pearl-Only Storefront Catalog

**Files:**
- Modify: `package.json`
- Create: `src/lib/storefront/catalog.ts`
- Create: `tests/storefront-catalog.test.ts`
- Modify: `src/lib/1688-products.ts`

**Interfaces:**
- Produces `StorefrontProductType`, `getStorefrontProducts()`, `getStorefrontProductById()`, `getStorefrontProductBySlug()`, `isCustomerVisibleProduct()`, and `getProductType()`.
- Later checkout, page, search, feed, sitemap, and recommendation tasks consume only these functions.

- [ ] **Step 1: Add the unit-test command and write failing catalog tests**

Add `"test:unit": "node --import tsx --test tests"` to scripts. Create tests asserting exactly 20 products, all `category === "pearl-series"`, all active and in stock, unique IDs/slugs, retired slugs absent, and deterministic product types for all 20 slugs.

- [ ] **Step 2: Run the catalog test and verify RED**

Run: `npm run test:unit -- tests/storefront-catalog.test.ts`

Expected: FAIL because `@/lib/storefront/catalog` does not exist.

- [ ] **Step 3: Implement the catalog module**

Use an explicit `Record<string, StorefrontProductType>` keyed by the 20 pearl slugs. Filter `PRODUCTS` by `category === "pearl-series" && isActive && inStock`, return copies from list functions, and return `undefined` for legacy or unknown IDs/slugs.

- [ ] **Step 4: Run catalog tests and source-image verification**

Run: `npm run test:unit -- tests/storefront-catalog.test.ts`

Run: `npx tsx scripts/verify-source-preserved-catalog.ts`

Expected: both PASS; verifier reports 20 source-preserved galleries.

- [ ] **Step 5: Record the Task 1 review checkpoint**

Write the changed-file list and test output to `.superpowers/sdd/task-1-report.md`. Do not stage implementation files.

### Task 2: Authoritative Checkout Validation And Quote

**Files:**
- Create: `src/lib/checkout/types.ts`
- Create: `src/lib/checkout/validation.ts`
- Create: `src/lib/checkout/quote.ts`
- Create: `src/lib/checkout/discount.ts`
- Create: `tests/checkout-validation.test.ts`
- Create: `tests/checkout-quote.test.ts`

**Interfaces:**
- `parseCheckoutRequest(value: unknown): CheckoutRequest` validates email, address, line count, quantities, and product IDs.
- `quoteStorefrontCart(lines: CheckoutLineInput[]): BaseQuote` resolves product facts from Task 1 and returns cents.
- `quoteCheckout(input, discountRepository): Promise<CheckoutQuote>` applies a server-loaded discount and returns authoritative lines and totals.

- [ ] **Step 1: Write failing validation tests**

Cover empty cart, more than 20 lines, quantity `0`, `1.5`, `11`, more than 50 total units, invalid email, missing name/address/city/postal/country, unknown product ID, and acceptance of a valid US address.

- [ ] **Step 2: Verify validation RED**

Run: `npm run test:unit -- tests/checkout-validation.test.ts`

Expected: FAIL because the validation module does not exist.

- [ ] **Step 3: Implement request types and validation**

Use type guards and a `CheckoutInputError extends Error` carrying a stable status of 400. Normalize email, country and discount code; ignore client names, images, prices, subtotal, discount amount, shipping and total.

- [ ] **Step 4: Write failing quote tests**

Assert a tampered client price cannot affect subtotal, `$69.99` is the free-shipping threshold, lower totals add `499` cents, fixed and percentage discounts are capped at subtotal, expired/inactive/exhausted/first-order codes fail, and all returned dollar values derive from integer cents.

- [ ] **Step 5: Verify quote RED and implement quote modules**

Run: `npm run test:unit -- tests/checkout-quote.test.ts`

Expected: FAIL because quote functions do not exist. Then implement a repository interface for discount lookups and prior-paid-order count, leaving Prisma access in `discount.ts`.

- [ ] **Step 6: Run both test files**

Run: `npm run test:unit -- tests/checkout-validation.test.ts tests/checkout-quote.test.ts`

Expected: PASS.

- [ ] **Step 7: Record the Task 2 review checkpoint**

Write the changed-file list and test output to `.superpowers/sdd/task-2-report.md`. Do not stage implementation files.

### Task 3: Refactor Card And PayPal Order Creation

**Files:**
- Create: `src/lib/checkout/create-order.ts`
- Modify: `src/app/api/checkout/route.ts`
- Modify: `src/app/api/checkout/paypal/route.ts`
- Modify: `src/app/api/discounts/validate/route.ts`
- Modify: `src/app/checkout/page.tsx`
- Create: `tests/checkout-order.test.ts`

**Interfaces:**
- `createPendingOrder(input, quote, sessionUserId?)` persists authoritative order lines and discount-code metadata.
- Both payment routes call Task 2 validation and quote services.
- The client sends `{ items: [{ productId, variantId?, quantity }], email, shippingAddress, discountCode? }` only.

- [ ] **Step 1: Write a failing order-payload test**

Test that persisted OrderItem prices and snapshots come from `CheckoutQuote`, static product IDs are not assigned to Prisma foreign keys, loyalty points are not created, and discount usage is not incremented while the order is `PENDING`.

- [ ] **Step 2: Verify RED and implement order creation helper**

Run: `npm run test:unit -- tests/checkout-order.test.ts`

Expected: FAIL before `createPendingOrder` exists. Inject the Prisma-like repository into the helper so the test uses an in-memory fake.

- [ ] **Step 3: Replace duplicate route pricing**

Card and PayPal routes must parse once, quote once, create one pending order, and send the exact quote total to the provider. Missing provider configuration returns 503; provider failure returns 502. PayPal order creation includes `custom_id: order.id` and saves its order ID in `stripeSessionId`.

- [ ] **Step 4: Align discount preview and checkout client**

Make `/api/discounts/validate` call the same quote path. Remove client-submitted discount amount and price from checkout API payloads. Validate the form before rendering/starting PayPal createOrder. Keep the cart until paid confirmation.

- [ ] **Step 5: Run checkout tests and TypeScript**

Run: `npm run test:unit -- tests/checkout-validation.test.ts tests/checkout-quote.test.ts tests/checkout-order.test.ts`

Run: `npx tsc --noEmit --pretty false`

Expected: PASS.

- [ ] **Step 6: Record the Task 3 review checkpoint**

Write the changed-file list and test output to `.superpowers/sdd/task-3-report.md`. Do not stage implementation files.

### Task 4: PayPal Binding And Idempotent Fulfillment

**Files:**
- Create: `src/lib/payments/paypal-verification.ts`
- Create: `src/lib/payments/fulfillment.ts`
- Modify: `src/app/api/checkout/paypal/capture/route.ts`
- Modify: `src/app/api/webhooks/paypal/route.ts`
- Modify: `src/app/api/webhooks/lemonsqueezy/route.ts`
- Create: `tests/paypal-verification.test.ts`
- Create: `tests/fulfillment.test.ts`

**Interfaces:**
- `verifyPayPalCapture(capture, order): VerifiedPayment` checks provider order ID, `custom_id`, `COMPLETED`, `USD`, and exact cents.
- `fulfillPaidOrder(orderId, payment, repository): Promise<"fulfilled" | "already-fulfilled">` atomically claims `PENDING -> PAID` and runs side effects once.

- [ ] **Step 1: Write PayPal mismatch tests and verify RED**

Cover wrong provider order ID, wrong database order ID, wrong currency, wrong amount, incomplete status, and a matching capture.

Run: `npm run test:unit -- tests/paypal-verification.test.ts`

Expected: FAIL because the verification module does not exist.

- [ ] **Step 2: Implement PayPal verification and make tests GREEN**

Normalize PayPal decimal strings to cents without floating-point comparison. Return a typed conflict error for any mismatch.

- [ ] **Step 3: Write fulfillment concurrency tests and verify RED**

Use a fake repository to invoke fulfillment twice for one order. Assert only one status claim, points award, discount increment, inventory pass and email enqueue occur.

- [ ] **Step 4: Implement centralized fulfillment**

Use Prisma `order.updateMany({ where: { id, status: "PENDING" } })` as the claim. Only the winner loads items and performs side effects. Existing `PAID` returns idempotent success; other states reject. Variant decrements use conditional stock updates.

- [ ] **Step 5: Refactor capture and webhooks**

Capture locates the order through saved `stripeSessionId`, confirms optional `dbOrderId` equality, captures PayPal, verifies the response, then calls fulfillment. Both signed webhooks extract provider facts, verify amount and order binding, then call the same fulfillment function.

- [ ] **Step 6: Run payment tests and TypeScript**

Run: `npm run test:unit -- tests/paypal-verification.test.ts tests/fulfillment.test.ts`

Run: `npx tsc --noEmit --pretty false`

Expected: PASS.

- [ ] **Step 7: Record the Task 4 review checkpoint**

Write the changed-file list and test output to `.superpowers/sdd/task-4-report.md`. Do not stage implementation files.

### Task 5: Server Authorization And Truthful Operational Features

**Files:**
- Create: `src/lib/server/admin-auth.ts`
- Create: `tests/authorization.test.ts`
- Modify: `src/app/admin/layout.tsx`
- Modify: affected routes under `src/app/api/admin/`, `src/app/api/studio/`, `src/app/api/automation/`, `src/app/api/pinterest/`, and `src/app/api/upload/route.ts`
- Modify: `src/app/api/debug/discounts/route.ts`
- Modify: `src/app/gift-cards/page.tsx`
- Modify: `src/app/api/gift-cards/route.ts`
- Modify: `src/app/api/contact/route.ts`
- Modify: `src/app/api/returns/route.ts`
- Modify: `src/app/contact/page.tsx`
- Modify: `src/app/returns/page.tsx`
- Modify: `src/app/checkout/success/page.tsx`

**Interfaces:**
- `getAdminDecision(session)` returns `authenticated`, `unauthenticated`, or `forbidden` for pure tests.
- `requireAdminPage()` redirects before rendering server content.
- `requireAdminApi()` returns a 401/403 response or `null`.

- [ ] **Step 1: Write authorization decision tests and verify RED**

Cover no session, customer session and admin session. Run `npm run test:unit -- tests/authorization.test.ts`; expect missing module failure.

- [ ] **Step 2: Implement server authorization and protect routes**

Convert Admin layout to a server component. Apply admin auth to paid-generation and upload routes. Apply existing signed cron auth to scheduled automation routes. Remove duplicate local admin helpers.

- [ ] **Step 3: Disable unsafe public features**

Gift card page calls `notFound()` and its API returns 404. Debug discounts returns 404. Pinterest token exchange requires admin and never returns access tokens to a client page; callback rejects missing/invalid server state.

- [ ] **Step 4: Make support and success states truthful**

Contact/Returns return 503 when email is unconfigured and 502 when provider delivery fails; clients only show success for `response.ok`. Checkout success calls `notFound()` for unknown orders, renders pending for `PENDING`, and confirms only paid/fulfilled states.

- [ ] **Step 5: Run unit, TypeScript and targeted route checks**

Run: `npm run test:unit -- tests/authorization.test.ts`

Run: `npx tsc --noEmit --pretty false`

Expected: PASS.

- [ ] **Step 6: Record the Task 5 review checkpoint**

Write the exact changed-file list and test output to `.superpowers/sdd/task-5-report.md`. Do not stage implementation files or use a directory-wide `git add`.

### Task 6: Remove Legacy Catalog Leaks And Unsupported Trust Claims

**Files:**
- Modify: `src/app/products/[slug]/page.tsx`
- Modify: `src/app/products/[slug]/1688-product.tsx`
- Modify: `src/app/search/page.tsx`
- Modify: `src/app/api/products/route.ts`
- Modify: `src/app/api/products/[slug]/route.ts`
- Modify: `src/components/layout/SearchOverlay.tsx`
- Modify: `src/app/guardian-quiz/quiz-client.tsx`
- Modify: `src/app/tiktok/page.tsx`
- Modify: `src/components/ui/RecentlyViewed.tsx`
- Modify: `src/app/wishlist/page.tsx`
- Modify: `src/components/layout/HeroCarousel.tsx`
- Modify: `src/components/ui/JsonLd.tsx`
- Create: `tests/public-catalog.test.ts`

**Interfaces:**
- Every listed surface consumes Task 1 catalog functions and never imports unfiltered `PRODUCTS` for customer rendering.

- [ ] **Step 1: Write a failing source-boundary test**

Scan the listed public files and assert retired slugs/categories are absent and direct unfiltered `PRODUCTS.filter` is not used. Assert static product lookup returns true Next 404 behavior through the page resolver boundary.

- [ ] **Step 2: Verify RED and update public surfaces**

Run: `npm run test:unit -- tests/public-catalog.test.ts`; expect legacy references to fail. Replace Quiz recommendations with active pearl slugs, filter persisted wishlist/recent items, and return only the 20 pearls from public product APIs.

- [ ] **Step 3: Remove unsupported trust claims**

Remove random viewer counts, hard-coded aggregate ratings/review counts from UI and JSON-LD, static review submission, and Afterpay/Klarna claims. Replace generic material statements with available product-specific facts or omit them. Make hero editorial copy non-SKU-specific unless the image is the exact supplier view.

- [ ] **Step 4: Run public catalog, source image and TypeScript checks**

Run: `npm run test:unit -- tests/public-catalog.test.ts tests/storefront-catalog.test.ts`

Run: `npx tsx scripts/verify-source-preserved-catalog.ts`

Run: `npx tsc --noEmit --pretty false`

Expected: PASS.

- [ ] **Step 5: Record the Task 6 review checkpoint**

Write the exact changed-file list and test output to `.superpowers/sdd/task-6-report.md`. Do not stage implementation files.

### Task 7: Responsive Navigation, Product Filters And Dialog Accessibility

**Files:**
- Modify: `next.config.ts`
- Modify: `src/components/layout/AnnouncementBar.tsx`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/layout/CartDrawer.tsx`
- Modify: `src/components/layout/SearchOverlay.tsx`
- Modify: `src/app/collections/[slug]/1688-collection.tsx`
- Modify: `src/app/products/[slug]/1688-product.tsx`
- Modify: `e2e/core-flows.spec.ts`

**Interfaces:**
- Shop links use `?type=<StorefrontProductType>`.
- Collection filtering parses only allowed type values and combines type with price/sort.
- Shared modal behavior unmounts closed content and manages initial focus, Escape, focus containment and restoration.

- [ ] **Step 1: Update Playwright tests first**

Add tests for 320px and 390px `scrollWidth <= innerWidth`, complete hamburger visibility, type-filtered results, unique header/footer keys, gallery labels, and keyboard-safe Cart/Search/mobile navigation.

- [ ] **Step 2: Run the targeted E2E tests and verify RED**

Run against the local server with installed Chrome. Expected failures: mobile overflow, identical category destinations, and modal focus behavior.

- [ ] **Step 3: Implement responsive Header and announcement flow**

Keep the announcement in document flow. On mobile show search, cart and menu only; account/wishlist remain in the menu or bottom navigation. Add `allowedDevOrigins` using the exact Next 16 config documented locally.

- [ ] **Step 4: Implement real product-type filters and footer policies**

Use Task 1 types in links and collection filtering. Add Privacy, Terms, Shipping, Refund and FAQ links. Use unique semantic keys.

- [ ] **Step 5: Implement accessible dialogs and gallery controls**

Unmount closed dialog panels; focus their close/title control when opened; trap Tab/Shift+Tab; close on Escape; restore trigger focus. Label gallery previous/next and thumbnails with image position and `aria-current`.

- [ ] **Step 6: Run E2E, TypeScript and mobile screenshot checks**

Run the targeted navigation tests, then `npx tsc --noEmit --pretty false`. Capture 320px, 390px and 1440px screenshots and assert no horizontal overflow.

- [ ] **Step 7: Record the Task 7 review checkpoint**

Write the exact changed-file list, screenshots and test output to `.superpowers/sdd/task-7-report.md`. Do not stage implementation files.

### Task 8: Pearl-Only SEO And GEO

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/opengraph-image.tsx`
- Modify: `src/app/robots.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `public/llms.txt`
- Modify: `src/app/api/feed/route.ts`
- Modify: `src/app/api/feed/google/route.ts`
- Modify: `src/app/api/feed/blog/route.ts`
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: public indexable collection/product metadata files
- Create: `tests/seo-catalog.test.ts`

**Interfaces:**
- SEO test imports metadata generators and feed/catalog helpers without querying the database for the 20 static product URLs.

- [ ] **Step 1: Write failing SEO source tests**

Assert public pearl surfaces contain no `crystal wellness`, `Stones With Intention`, `The Serenity Collection`, or retired feed URL; assert root layout has no global homepage canonical; assert sitemap includes all 20 pearl slugs without needing Prisma.

- [ ] **Step 2: Verify RED and update metadata**

Run: `npm run test:unit -- tests/seo-catalog.test.ts`; expect stale copy failures. Move homepage canonical to `page.tsx`, add self-canonicals or intentional noindex to public routes, and rewrite OG copy for pearl jewelry.

- [ ] **Step 3: Unify feeds, robots and llms.txt**

Make `/api/feed` authoritative and pearl-only. Google feed reuses the same 20 product source. Remove legacy blog feed from llms.txt, allow only intended public feed paths, and keep other `/api` paths disallowed.

- [ ] **Step 4: Archive stale blog indexing and make sitemap resilient**

Set blog list/articles to noindex and remove them from sitemap/feed/navigation. Generate static and product sitemap entries without Prisma. Database-backed extras must not silently turn an otherwise valid sitemap incomplete.

- [ ] **Step 5: Run SEO tests, build and inspect artifacts**

Run: `npm run test:unit -- tests/seo-catalog.test.ts`

Run: `npm run build`

Inspect generated sitemap, robots, llms and Open Graph metadata for stale crystal terms and confirm all 20 product URLs.

- [ ] **Step 6: Record the Task 8 review checkpoint**

Write the exact changed-file list and artifact inspection results to `.superpowers/sdd/task-8-report.md`. Do not stage implementation files.

### Task 9: Full Verification And Review Closure

**Files:**
- Modify only files required by failures directly caused by Tasks 1-8.
- Update: `.superpowers/sdd/progress.md` as task reviews complete.

**Interfaces:**
- No new feature interfaces; this task verifies the complete release boundary.

- [ ] **Step 1: Run the full automated verification suite**

```powershell
npm run test:unit
npx tsc --noEmit --pretty false
npx prisma validate
npx tsx scripts/verify-source-preserved-catalog.ts
npm run build
python -m unittest discover -s video-pipeline\tests -v
git diff --check
```

Run `npx eslint` against the exact TypeScript files changed by this plan and require zero errors there. Also run the repository-wide lint command once and report the remaining pre-existing debt separately; it is not a false completion condition for this plan.

- [ ] **Step 2: Run Playwright core flows with real Chrome**

Exercise homepage, collection type filters, product, search, Quiz, cart, checkout validation, unknown/pending/success order states, mobile menu and keyboard dialogs at desktop, 390px and 320px.

- [ ] **Step 3: Perform payment boundary probes**

Submit tampered price, discount, quantity, provider order ID and database order ID payloads against route handlers using mocked provider/network adapters. Confirm 400/409 outcomes and unchanged order state.

- [ ] **Step 4: Run final whole-branch review**

Review the complete implementation against `docs/superpowers/specs/2026-07-14-storefront-release-hardening-design.md`, prioritizing payment correctness, authorization, catalog leakage, misleading claims, accessibility and missing regression tests.

- [ ] **Step 5: Fix all Critical and Important review findings and rerun covering tests**

Record exact commands and outputs in the task report. Do not defer release blockers.

- [ ] **Step 6: Restore local preview and report status**

Start the site at `http://localhost:3001/`, verify HTTP 200 and interactive hydration through both `localhost` and `127.0.0.1`, and leave Vercel untouched.
