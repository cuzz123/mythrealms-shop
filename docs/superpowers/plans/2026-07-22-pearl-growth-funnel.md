# Pearl Growth Funnel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Build a consent-safe, editorial pearl discovery and conversion funnel using the approved 45-SKU catalog, with truthful gift, guide, merchandising, and SEO/GEO surfaces.

**Architecture:** A typed edit registry is the sole source for selected-product discovery, page copy, hero media, internal links, sitemap entries, and product complements. Server pages render discovery routes from that registry and existing guide data. Client components enhance product, cart, and first-order interactions without making prices or commerce claims client-authoritative.

**Tech Stack:** Next.js 16.2.6 App Router, React 19.2.4, TypeScript 5.9, Tailwind CSS 4, Zustand 5, Node test runner with tsx, Playwright.

## Global Constraints

- Public merchandising exposes only getStorefrontProducts() and retains the approved 45-SKU Pearl Edit boundary.
- Do not copy Buddha Stones wording, assets, product data, religious positioning, or transactional claims.
- Do not publish fabricated reviews, scarcity, stock counts, countdowns, health claims, spiritual outcomes, delivery dates, or unconfigured discounts.
- Pricing, discounts, shipping, and order persistence remain server-authoritative through existing checkout and discount contracts.
- Gift-note content is never sent to analytics and is capped at 240 trimmed characters.
- Tracking fires only through the existing consent gate. All media uses approved assets and stable responsive dimensions.
- Preserve keyboard operation, focus management, reduced-motion behavior, unique canonical metadata, truthful JSON-LD, and existing public-route noindex boundaries.

---

### Task 1: Build the Pearl Edit Registry and Discovery Contracts

**Files:**
- Create: src/lib/storefront/pearl-edits.ts
- Create: tests/pearl-edits.test.ts
- Modify: src/lib/storefront/navigation.ts
- Modify: src/lib/seo/sitemap.ts
- Modify: src/app/sitemap.ts

**Interfaces:**
- Produces PearlEdit, PEARL_EDITS, getPearlEditBySlug(slug), getPearlEditProducts(edit, products), and getComplementaryProducts(productSlug, products).
- Consumes getStorefrontProducts() and StorefrontProduct only.
- Sitemap and public components consume PEARL_EDITS, never duplicated hard-coded SKU lists.

- [ ] **Step 1: Write the failing registry tests**
Create tests/pearl-edits.test.ts. Assert that each edit resolves every declared product slug to an approved storefront product, rejects an unavailable product slug, excludes the source product from complements, and returns complements in stable order. Extend the sitemap test to assert every /edits/[slug] URL appears exactly once.

- [ ] **Step 2: Run the tests and verify they fail**
Run: node --import tsx --test tests/pearl-edits.test.ts
Expected: FAIL because pearl-edits and canonical edit URLs do not exist.

- [ ] **Step 3: Implement the registry**
Define PearlEdit with the four approved slugs: everyday-light, dinner-by-the-water, a-gift-to-keep, and soft-gold-and-pearl. Each record contains title, description, approved hero image path, productSlugs, and canonical route. Build an indexed lookup from approved StorefrontProduct data; throw if a registry SKU is missing. Select two to four deterministic complements from the first edit containing the source SKU and otherwise use stable catalog order.

- [ ] **Step 4: Wire navigation and sitemap**
Add Pearl Stories and Pearl Symbolism to the existing Discover/Learn link arrays. Add PEARL_EDITS to buildSitemapEntries. Do not change catalog visibility or add a top-level menu.

- [ ] **Step 5: Verify and commit**
Run: node --import tsx --test tests/pearl-edits.test.ts tests/storefront-navigation.test.ts tests/seo-catalog.test.ts
Expected: PASS.
Commit: git add src/lib/storefront/pearl-edits.ts src/lib/storefront/navigation.ts src/lib/seo/sitemap.ts src/app/sitemap.ts tests/pearl-edits.test.ts && git commit -m "feat: add pearl edit registry"

### Task 2: Implement Discovery, Gifts, and Guide Pages

**Files:**
- Create: src/app/edits/[slug]/page.tsx
- Create: src/app/pearls/stories/page.tsx
- Create: src/app/pearls/symbolism/page.tsx
- Modify: src/app/gifts/page.tsx
- Modify: src/app/pearls/care/page.tsx
- Modify: src/components/ui/JsonLd.tsx
- Modify: src/lib/seo/schema.ts
- Create: tests/pearl-growth-pages.test.ts

**Interfaces:**
- Consumes Task 1 registry, ProductCard, BreadcrumbJsonLd, FAQPageJsonLd, ArticleJsonLd, and policy facts.
- Produces canonical pages and ItemListJsonLd with name, URL, position, product name, and canonical product URL.

- [ ] **Step 1: Write failing page and schema tests**
Add tests which render /edits/everyday-light and assert it has visible edit title, registry product links, one ItemList schema, and canonical metadata. Add a /pearls/symbolism test that confirms visible neutral styling/gift copy and rejects health, protection, luck, manifestation, and healing claims.

- [ ] **Step 2: Run tests and verify failure**
Run: node --import tsx --test tests/pearl-growth-pages.test.ts
Expected: FAIL because route pages and ItemListJsonLd do not exist.

- [ ] **Step 3: Add ItemList structured-data builder**
Add buildItemListSchema to src/lib/seo/schema.ts and ItemListJsonLd to src/components/ui/JsonLd.tsx. It returns an ItemList whose itemListElement is a sequence of ListItem values with position, name, and URL. Escape JSON through existing JsonLd.

- [ ] **Step 4: Implement page content**
Render edit pages as unframed editorial bands with a hero, selected product list, short selection rationale, and guide links. Rework /gifts around recipient, occasion, and price anchors using approved products only. Expand existing /pearls/care with fact-bounded visible FAQ. Make Stories a focused index linking current /blog entries rather than a duplicate archive. Keep Symbolism about gift giving and personal style only.

- [ ] **Step 5: Verify and commit**
Run: node --import tsx --test tests/pearl-growth-pages.test.ts tests/pearl-guides.test.ts tests/structured-data.test.ts tests/seo-catalog.test.ts
Expected: PASS with unique canonical metadata and no schema claims absent from visible text.
Commit: git add src/app/edits src/app/pearls/stories src/app/pearls/symbolism src/app/gifts/page.tsx src/app/pearls/care/page.tsx src/components/ui/JsonLd.tsx src/lib/seo/schema.ts tests/pearl-growth-pages.test.ts && git commit -m "feat: add pearl discovery pages"

### Task 3: Add Homepage Growth Bands and First-Order Invitation

**Files:**
- Create: src/components/home/HomepageOccasionEdit.tsx
- Create: src/components/home/HomepageGiftSets.tsx
- Create: src/components/home/HomepageWhyPearls.tsx
- Create: src/components/growth/FirstOrderInvitation.tsx
- Modify: src/app/page.tsx
- Modify: src/app/providers.tsx
- Create: tests/homepage-growth.test.ts
- Modify: tests/homepage-editorial.test.ts

**Interfaces:**
- Homepage bands consume Task 1 PEARL_EDITS and approved images.
- FirstOrderInvitation accepts campaignCode optional and cooldownDays optional, calls /api/newsletter, and uses existing dialog focus support.
- It never sends form content in any tracking payload.

- [ ] **Step 1: Write failing section and invitation tests**
Assert src/app/page.tsx renders HomepageOccasionEdit, HomepageGiftSets, and HomepageWhyPearls in that order after existing editorial sections. Test a pure invitation state helper: no campaign code means no discount copy; dismissal suppresses it for 14 days; a fresh session cannot show it twice.

- [ ] **Step 2: Run tests and verify failure**
Run: node --import tsx --test tests/homepage-growth.test.ts
Expected: FAIL because the new sections and invitation helper do not exist.

- [ ] **Step 3: Implement editorial bands**
Use full-width bands with constrained inner grids, explicit aspect-ratios, existing product-card behavior, and approved media only. Keep existing home sections intact. Do not add nested cards, decorative icons, gradients, or high-pressure sales copy.

- [ ] **Step 4: Implement accessible invitation**
Delay display for 20 seconds of an engaged visit, use session memory to prevent duplicate mounts, and store dismissal in local storage for 14 days. Render code-specific copy only when NEXT_PUBLIC_FIRST_ORDER_CODE is non-empty; otherwise offer newsletter notes without a price claim. Support Escape, labelled close, focus restore, and reduced motion.

- [ ] **Step 5: Verify and commit**
Run: node --import tsx --test tests/homepage-growth.test.ts tests/homepage-editorial.test.ts tests/editorial-components.test.ts
Expected: PASS.
Commit: git add src/components/home src/components/growth src/app/page.tsx src/app/providers.tsx tests/homepage-growth.test.ts tests/homepage-editorial.test.ts && git commit -m "feat: add pearl discovery homepage funnel"

### Task 4: Extend Cart and Checkout Safely for Gift Notes

**Files:**
- Modify: src/lib/cart.ts
- Modify: src/app/products/[slug]/1688-product.tsx
- Modify: src/app/cart/page.tsx
- Modify: src/app/checkout/page.tsx
- Modify: src/app/api/checkout/paypal/route.ts
- Modify: src/lib/checkout/quote.ts
- Create: tests/cart-gift-note.test.ts
- Modify: tests/checkout-validation.test.ts
- Modify: tests/checkout-quote.test.ts

**Interfaces:**
- CartItem gains optional giftNote.
- Store exposes setGiftNote(productId, variantId, note), backed by normalizeGiftNote(note).
- PayPal creation accepts only the validated gift note, never client-owned price or totals.

- [ ] **Step 1: Write failing gift-note tests**
Assert normalization trims input, caps it at 240 characters, preserves subtotal, drops an empty note, and rejects a note over 240 characters at checkout validation. Assert analytics payload serialization cannot include note text.

- [ ] **Step 2: Run tests and verify failure**
Run: node --import tsx --test tests/cart-gift-note.test.ts tests/checkout-validation.test.ts tests/checkout-quote.test.ts
Expected: FAIL because normalizing and validating gift notes do not exist.

- [ ] **Step 3: Implement cart and checkout support**
Add labelled max-length textarea by the purchase control and explicit editing in cart. Adding an existing SKU keeps a single line; replacement note changes only through cart editing. Preview the note at checkout, normalize it server-side in the PayPal order path, and persist it in the existing private Order.notes field through createPendingOrder. Return 400 for invalid input.

- [ ] **Step 4: Verify and commit**
Run: node --import tsx --test tests/cart-gift-note.test.ts tests/checkout-validation.test.ts tests/checkout-quote.test.ts tests/paypal-only-checkout.test.ts
Expected: PASS with no price or payment lifecycle changes.
Commit: git add src/lib/cart.ts src/app/products/[slug]/1688-product.tsx src/app/cart/page.tsx src/app/checkout/page.tsx src/app/api/checkout/paypal/route.ts src/lib/checkout/quote.ts tests/cart-gift-note.test.ts tests/checkout-validation.test.ts tests/checkout-quote.test.ts && git commit -m "feat: support gift notes in checkout"

### Task 5: Add Complements, Shipping Progress, and Consent-Safe Tracking

**Files:**
- Create: src/components/storefront/ComplementaryProducts.tsx
- Create: src/components/storefront/FreeShippingProgress.tsx
- Modify: src/app/products/[slug]/1688-product.tsx
- Modify: src/app/cart/page.tsx
- Modify: src/app/checkout/page.tsx
- Modify: src/lib/tracking.ts
- Create: tests/growth-merchandising.test.ts
- Modify: tests/analytics-tracking.test.ts

**Interfaces:**
- ComplementaryProducts accepts sourceSlug and variant product or cart, consuming Task 1 complements.
- FreeShippingProgress accepts subtotal and consumes STORE_POLICY_FACTS.freeShippingThresholdUsd.
- Tracking adds consent-gated view_item_list, select_item, view_promotion, select_promotion, add_gift_note, and view_edit event builders.

- [ ] **Step 1: Write failing component and tracking tests**
Assert complements are stable, exclude their source SKU, and remain approved. Assert shipping progress is bounded by the verified threshold. Assert denied consent causes no dispatch or queue and analytics payloads never include gift-note text or email.

- [ ] **Step 2: Run tests and verify failure**
Run: node --import tsx --test tests/growth-merchandising.test.ts tests/analytics-tracking.test.ts
Expected: FAIL because helpers and growth event builders do not exist.

- [ ] **Step 3: Implement UI and tracking**
Render two to four complements after product details and in cart only when candidates exist. Use existing product-card surfaces. Show free shipping unlocked only at the centralized threshold; otherwise state the exact remaining amount. Add pure event payload builders in src/lib/tracking.ts and route dispatch through existing consent behavior. Meta and Pinterest receive only supported commerce equivalents.

- [ ] **Step 4: Verify and commit**
Run: node --import tsx --test tests/growth-merchandising.test.ts tests/analytics-tracking.test.ts tests/storefront-policies.test.ts tests/paypal-only-checkout.test.ts
Expected: PASS.
Commit: git add src/components/storefront src/app/products/[slug]/1688-product.tsx src/app/cart/page.tsx src/app/checkout/page.tsx src/lib/tracking.ts tests/growth-merchandising.test.ts tests/analytics-tracking.test.ts && git commit -m "feat: add pearl cart merchandising"

### Task 6: Add Mobile Sticky Purchase Controls and Verify the Full Funnel

**Files:**
- Create: src/components/storefront/StickyAddToCart.tsx
- Modify: src/app/products/[slug]/1688-product.tsx
- Modify: src/app/globals.css
- Create: e2e/pearl-growth-funnel.spec.ts
- Modify: tests/storefront-catalog.test.ts
- Modify: tests/seo-catalog.test.ts
- Modify: tests/public-catalog.test.ts

**Interfaces:**
- StickyAddToCart takes visible, disabled, onAdd, price, and label and delegates to the product page’s existing add handler.
- It appears after the primary CTA leaves the viewport and only when a product is in stock.

- [ ] **Step 1: Write failing public-route and mobile tests**
Assert navigation and sitemap expose new routes. Add Playwright coverage at 390x844 proving sticky add appears after the main purchase control scrolls away, invokes the same cart behavior, and is absent for out-of-stock products.

- [ ] **Step 2: Run tests and verify failure**
Run: node --import tsx --test tests/storefront-catalog.test.ts tests/seo-catalog.test.ts tests/public-catalog.test.ts && npx playwright test e2e/pearl-growth-funnel.spec.ts
Expected: FAIL before sticky control and new discovery routes are present.

- [ ] **Step 3: Implement one behavior path**
Use IntersectionObserver to detect the main CTA, reserve fixed safe-area bottom height, and preserve disabled/loading/quantity/cart-opening state by calling the same page handler. Do not create a second cart mutation path.

- [ ] **Step 4: Add full cross-device verification**
Cover desktop and mobile home, one edit, gifts, care, symbolism, a representative product, cart progress, gift-note validation, invitation close/Escape, and sticky add-to-cart. Regenerate snapshots only after visual inspection confirms no blank images, overlap, crop error, or untruthful label.

- [ ] **Step 5: Run complete verification and commit**
Run: npm run test:unit && npm run lint && npm run build && npx playwright test && git diff --check
Expected: all unit and browser tests pass, production build completes, lint has no new errors, and diff check passes.
Commit: git add src/components/storefront/StickyAddToCart.tsx src/app/products/[slug]/1688-product.tsx src/app/globals.css e2e/pearl-growth-funnel.spec.ts tests/storefront-catalog.test.ts tests/seo-catalog.test.ts tests/public-catalog.test.ts && git commit -m "feat: complete pearl growth funnel"

### Task 7: Merge and Deploy

**Files:** No product code changes; resolve only touched integration files if main advances.

- [ ] **Step 1: Sync production safely**
Run: git fetch origin main && git merge --no-ff origin/main -m "merge: sync production before pearl growth release"
Expected: clean merge or conflict resolution limited to touched surfaces.

- [ ] **Step 2: Verify before push**
Run: npm run test:unit && npm run lint && npm run build && npx playwright test && git diff --check
Expected: PASS before production push.

- [ ] **Step 3: Merge and push**
Run: git checkout main && git merge --no-ff codex/full-growth-funnel -m "feat: launch pearl growth funnel" && git push origin main
Expected: remote main advances without force push.

- [ ] **Step 4: Verify Vercel**
In the authenticated Vercel project, verify the production deployment source is the pushed main commit and status is Ready. Request homepage, one edit, gifts, a product, and sitemap.xml.

- [ ] **Step 5: Report release**
Report the production URL, commit, deployment readiness, verification totals, and non-blocking existing lint warnings. Do not claim an unverified live result.
