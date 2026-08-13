# Maverenne Signature UI/UX System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cohesive, responsive Maverenne storefront visual system across global chrome, homepage, collection, product, cart, Gifts, Pearl Guide, Pearl Care, and Journal without changing controlled facts, SEO fields, commerce state, analytics, or release state.

**Architecture:** Keep route pages and static editorial compositions as Server Components, and preserve existing Client Component boundaries for navigation, search, cart, product cards, gallery, and purchase behavior. Add a small presentation-only component layer (`SignatureHero`, `SectionHeading`, `EditorialDiptych`, `EditorialDivider`, and `EditorialInlineImage`) that consumes existing copy and media data without owning product, policy, metadata, schema, canonical, or analytics truth.

**Tech Stack:** Next.js 16.2.6 App Router, React 19.2.4, TypeScript 5.9, Tailwind CSS 4, `next/image`, Node test runner with `tsx`, Playwright 1.61.1.

## Global Constraints

- Work only in `D:\mythrealms-shop\.worktrees\maverenne-uiux-signature-system` on `codex/maverenne-uiux-signature-system`, based on `099c800d279b5a7d48d755b0a38fd93ad63bfadc`.
- Do not merge, push, deploy, modify DNS/canonical/external accounts, or describe this local candidate as published.
- SEO/GEO remains the sole P0; this visual work is P1 except for responsive, accessibility, image stability, and content-hierarchy support.
- Do not change product selection, activation, price, inventory, variants, material, fulfillment, shipping, returns, support, or legal-policy facts.
- Do not change metadata, schema, canonical, sitemap, robots, llms, feeds, OG/Twitter, analytics-event names/payloads, or consent behavior.
- Keep exactly one H1 per route, preserve direct-answer/FAQ/source order, and preserve existing URLs and fragments.
- Use Next.js `Image` with a reserved ratio or intrinsic dimensions. Only an actual initial-viewport hero may preload; below-fold content images are lazy-loaded.
- All nonessential motion must stop under `prefers-reduced-motion: reduce`.
- Required review viewports are 390×844, 768×900, and 1440×900.

---

## File and responsibility map

### New presentation units

- `src/components/editorial/SignatureHero.tsx`: route-level visual hero with stable image geometry and semantic content slot.
- `src/components/editorial/SectionHeading.tsx`: shared eyebrow/title/description/action alignment.
- `src/components/editorial/EditorialInlineImage.tsx`: noninteractive in-flow image with explicit aspect ratio, alt, sizes, and loading intent.
- `src/components/home/EditorialDiptych.tsx`: one asymmetric homepage narrative block using existing approved copy/media.
- `src/components/storefront/EditorialDivider.tsx`: one non-product collection rhythm break that never enters product selection logic.

### Existing behavior owners retained

- `src/components/layout/Header.tsx`, `SearchOverlay.tsx`, `MobileBottomNav.tsx`, `Footer.tsx`, `CartDrawer.tsx`: keep existing state, focus, and navigation ownership.
- `src/components/product/ProductCard.tsx`: keep wishlist and quick-add ownership.
- `src/app/products/[slug]/1688-product.tsx` and `src/components/storefront/StickyAddToCart.tsx`: keep gallery and purchase state ownership.
- Route pages remain the only owners of section ordering and route-specific copy.

---

### Task 1: Establish visual tokens and reusable presentation components

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/components/editorial/SignatureHero.tsx`
- Create: `src/components/editorial/SectionHeading.tsx`
- Create: `src/components/editorial/EditorialInlineImage.tsx`
- Test: `tests/signature-ui-components.test.tsx`

**Interfaces:**
- Produces:
  - `SignatureHero(props: SignatureHeroProps): React.JSX.Element`
  - `SectionHeading(props: SectionHeadingProps): React.JSX.Element`
  - `EditorialInlineImage(props: EditorialInlineImageProps): React.JSX.Element`
- `SignatureHeroProps` accepts `eyebrow`, `title`, `description`, `image`, optional `primaryAction`, optional `secondaryAction`, optional `indexLabel`, and optional responsive `objectPosition` values.
- `EditorialInlineImageProps` accepts `src`, `alt`, `width`, `height`, `sizes`, optional `className`, and optional `imageClassName`; it never accepts `href`, caption, or CTA.

- [ ] **Step 1: Write the failing component contract tests**

Create `tests/signature-ui-components.test.tsx` with focused server-render assertions:

```tsx
import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { SignatureHero } from "@/components/editorial/SignatureHero";
import { EditorialInlineImage } from "@/components/editorial/EditorialInlineImage";

test("signature hero keeps one semantic heading and decorative index", () => {
  const html = renderToStaticMarkup(
    <SignatureHero
      eyebrow="Editorial / Summer 2026"
      title="A little something for yourself."
      description="Jewelry and accessories for finding your way back to you."
      image={{ src: "/images/brand/home/hero-earrings-model-v2.png", alt: "Model wearing pearl earrings" }}
      indexLabel="Maverenne / Editorial 01"
      primaryAction={{ label: "Find Your Piece", href: "/collections/pearl-series" }}
    />,
  );
  assert.equal((html.match(/<h1/g) ?? []).length, 1);
  assert.match(html, /aria-hidden="true"[^>]*>Maverenne \/ Editorial 01/);
  assert.match(html, /sizes="100vw"/);
});

test("inline editorial image cannot become an interactive content surface", () => {
  const html = renderToStaticMarkup(
    <EditorialInlineImage
      src="/images/editorial/care.png"
      alt="Pearl jewelry care objects in soft light"
      width={1536}
      height={1024}
      sizes="(max-width: 767px) 100vw, 768px"
    />,
  );
  assert.doesNotMatch(html, /<a\b|<button\b|<figcaption\b/);
  assert.match(html, /loading="lazy"/);
});
```

- [ ] **Step 2: Run the new test and confirm it fails because the components do not exist**

Run:

```powershell
node --import tsx --test tests/signature-ui-components.test.tsx
```

Expected: FAIL with module-resolution errors for the new components.

- [ ] **Step 3: Add the shared tokens and minimal components**

Add only global tokens/utilities to `globals.css`, including:

```css
:root {
  --content-wide: 80rem;
  --content-reading: 48rem;
  --section-space: clamp(4rem, 7vw, 7rem);
  --signature-rule: color-mix(in srgb, var(--text) 22%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .signature-motion {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
```

Implement the three components as Server Components. Use `next/image` with a ratio-bearing parent for `fill` heroes and explicit `width`/`height` for in-flow images. Use `Link` only for the explicit hero/heading action props.

- [ ] **Step 4: Run component and existing editorial tests**

Run:

```powershell
node --import tsx --test tests/signature-ui-components.test.tsx tests/editorial-components.test.ts
```

Expected: all tests PASS.

- [ ] **Step 5: Run target lint and commit**

Run:

```powershell
pnpm exec eslint src/components/editorial/SignatureHero.tsx src/components/editorial/SectionHeading.tsx src/components/editorial/EditorialInlineImage.tsx tests/signature-ui-components.test.tsx
git diff --check
```

Commit:

```powershell
git add src/app/globals.css src/components/editorial/SignatureHero.tsx src/components/editorial/SectionHeading.tsx src/components/editorial/EditorialInlineImage.tsx tests/signature-ui-components.test.tsx
git commit -m "feat: add Maverenne signature presentation primitives"
```

---

### Task 2: Refine global shell without changing navigation behavior

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/SearchOverlay.tsx`
- Modify: `src/components/layout/MobileBottomNav.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/layout/CartDrawer.tsx`
- Test: `tests/storefront-navigation.test.ts`
- Test: `tests/storefront-search.test.ts`
- Test: `tests/signature-shell.test.tsx`

**Interfaces:**
- Consumes existing `HEADER_MENUS`, `HEADER_LINKS`, `FOOTER_GROUPS`, `useDialogFocus`, cart stores, and search-result selector.
- Produces no new business interface. Existing props and state-store calls remain unchanged.

- [ ] **Step 1: Add failing source and render contracts**

Create `tests/signature-shell.test.tsx` to assert:

```tsx
test("mobile bottom navigation reserves safe area and does not own purchase state", () => {
  const source = readFileSync("src/components/layout/MobileBottomNav.tsx", "utf8");
  assert.match(source, /pb-\[calc\(env\(safe-area-inset-bottom\)\+0\.5rem\)\]/);
  assert.doesNotMatch(source, /addItem|price|inventory|checkout/);
});

test("search dialog preserves its accessible label and focus owner", () => {
  const source = readFileSync("src/components/layout/SearchOverlay.tsx", "utf8");
  assert.match(source, /role="dialog"/);
  assert.match(source, /aria-modal="true"/);
  assert.match(source, /useDialogFocus/);
});
```

Extend navigation tests to lock the existing URLs and top-level order, not CSS strings.

- [ ] **Step 2: Run shell tests and confirm the new safe-area contract fails**

Run:

```powershell
node --import tsx --test tests/storefront-navigation.test.ts tests/storefront-search.test.ts tests/signature-shell.test.tsx
```

Expected: existing tests PASS; new safe-area contract FAILS.

- [ ] **Step 3: Apply the visual-only shell refactor**

- Increase wordmark presence without changing its accessible name or destination.
- Preserve desktop menu `ArrowDown`, Escape, outside click, focus return, and menu roles.
- Keep the mobile menu dialog and its focus containment; standardize 44px targets and spacing.
- Retheme SearchOverlay with storefront tokens, full mobile gutters, and an explicit close control whose accessible name is `Close search` while retaining Escape behavior.
- Add safe-area padding and quieter border/surface treatment to MobileBottomNav.
- Recompose Footer hierarchy while rendering exactly the existing groups, links, newsletter, and controlled facts.
- Recompose CartDrawer emphasis without changing quantity/remove/recommendation/progress/route behavior.

- [ ] **Step 4: Run shell tests and focused lint**

Run:

```powershell
node --import tsx --test tests/storefront-navigation.test.ts tests/storefront-search.test.ts tests/signature-shell.test.tsx
pnpm exec eslint src/components/layout/Header.tsx src/components/layout/SearchOverlay.tsx src/components/layout/MobileBottomNav.tsx src/components/layout/Footer.tsx src/components/layout/CartDrawer.tsx
```

Expected: all tests PASS and lint exits 0.

- [ ] **Step 5: Commit the global shell lot**

```powershell
git add src/components/layout/Header.tsx src/components/layout/SearchOverlay.tsx src/components/layout/MobileBottomNav.tsx src/components/layout/Footer.tsx src/components/layout/CartDrawer.tsx tests/storefront-navigation.test.ts tests/storefront-search.test.ts tests/signature-shell.test.tsx
git commit -m "feat: refine Maverenne storefront shell"
```

---

### Task 3: Build the homepage Signature composition

**Files:**
- Modify: `src/components/home/HomepageHero.tsx`
- Create: `src/components/home/EditorialDiptych.tsx`
- Modify: `src/components/home/HomepageCategoryStories.tsx`
- Modify: `src/components/home/HomepagePearlEdit.tsx`
- Modify: `src/components/home/HomepageGiftSets.tsx`
- Modify: `src/components/home/HomepageEditorialStory.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/lib/homepage-editorial.ts`
- Test: `tests/homepage-editorial.test.ts`
- Test: `tests/signature-homepage.test.tsx`
- Modify: `e2e/release-surfaces.spec.ts`

**Interfaces:**
- Consumes `BRAND.heroTitle`, existing approved homepage routes, existing product selectors, and existing approved media records.
- Produces `EditorialDiptych({ primaryImage, detailImage, eyebrow, title, description, href, linkLabel })`.
- Keeps `HomepageHero()` prop-free and keeps route data outside the component.

- [ ] **Step 1: Add failing homepage composition tests**

Assert the page renders components in this exact order:

```tsx
const html = renderToStaticMarkup(<HomePage />);
const markers = [
  "homepage-signature-hero",
  "homepage-category-index",
  "homepage-editorial-diptych",
  "homepage-primary-edit",
  "homepage-story-band",
  "homepage-editorial-links",
  "homepage-secondary-edit",
  "homepage-newsletter-letter",
];
for (let index = 1; index < markers.length; index += 1) {
  assert.ok(html.indexOf(markers[index - 1]) < html.indexOf(markers[index]));
}
assert.equal((html.match(/<h1/g) ?? []).length, 1);
```

Add source assertions that no new price band, inventory phrase, promotion, or unapproved Gifts fragment is introduced.

- [ ] **Step 2: Run homepage tests and confirm the new markers fail**

```powershell
node --import tsx --test tests/homepage-editorial.test.ts tests/signature-homepage.test.tsx
```

Expected: FAIL on missing signature markers/diptych.

- [ ] **Step 3: Implement the homepage composition**

- Rebuild HomepageHero around `SignatureHero`, preserving existing H1 copy and destinations.
- Only preload the first visible hero image; hidden slide images use normal loading.
- Keep manual slide controls and current reduced-motion auto-rotation stop.
- Add `EditorialDiptych` using only existing approved homepage media and copy.
- Reorder the existing sections to the approved eight-part rhythm.
- Keep product arrays and selectors unchanged.
- Use `SectionHeading` to normalize repeated section headings without changing link targets.

- [ ] **Step 4: Run homepage and navigation regression tests**

```powershell
node --import tsx --test tests/homepage-editorial.test.ts tests/signature-homepage.test.tsx tests/storefront-navigation.test.ts
pnpm exec eslint src/app/page.tsx src/components/home src/lib/homepage-editorial.ts
```

Expected: all tests PASS and lint exits 0.

- [ ] **Step 5: Update focused Playwright contracts without rebaselining snapshots**

Update `e2e/release-surfaces.spec.ts` to assert the new section markers, one H1, no overflow, and reduced-motion stability. Do not update `editorial-visuals.spec.ts` snapshots in this task.

Run the focused source-level test suite only if the isolated browser server is available; otherwise record the exact runtime blocker in the acceptance task.

- [ ] **Step 6: Commit the homepage lot**

```powershell
git add src/app/page.tsx src/components/home src/lib/homepage-editorial.ts tests/homepage-editorial.test.ts tests/signature-homepage.test.tsx e2e/release-surfaces.spec.ts
git commit -m "feat: compose Maverenne signature homepage"
```

---

### Task 4: Improve collection browsing and product cards

**Files:**
- Create: `src/components/storefront/EditorialDivider.tsx`
- Modify: `src/app/collections/[slug]/1688-collection.tsx`
- Modify: `src/components/product/ProductCard.tsx`
- Test: `tests/signature-collection.test.tsx`
- Test: `tests/storefront-catalog.test.ts`

**Interfaces:**
- `EditorialDividerProps = { image: { src: string; alt: string }; eyebrow: string; title: string; description: string }` with no route, product, price, inventory, or CTA props.
- Collection filtering and sorting continue to produce the product array. The divider is inserted only at render time after index 7 when at least 12 products are rendered and never enters the data array.

- [ ] **Step 1: Add failing collection contracts**

```tsx
test("editorial divider is not a product or interactive merchandising card", () => {
  const html = renderToStaticMarkup(
    <EditorialDivider
      image={{ src: "/images/brand/editorial/scene-seaside-stairs.png", alt: "Sunlit limestone steps near the sea" }}
      eyebrow="Maverenne Notes"
      title="Made for the life around them."
      description="A quiet pause between pieces."
    />,
  );
  assert.doesNotMatch(html, /<a\b|<button\b|\$|price|stock/i);
  assert.match(html, /data-editorial-divider="true"/);
});
```

Add a source contract that the product array is not spliced or mutated to insert the divider.

- [ ] **Step 2: Run the focused tests and confirm component absence fails**

```powershell
node --import tsx --test tests/signature-collection.test.tsx tests/storefront-catalog.test.ts
```

- [ ] **Step 3: Implement the collection and card refinements**

- Add one render-only divider after product index 7 only when the current rendered set contains at least 12 products.
- Preserve product keys, order, filter/sort controls, counts, and query parameters.
- Keep 2-column mobile and 4-column desktop product rhythm.
- Increase mobile wishlist and quick-add targets to at least 44px and position them to avoid collision.
- Preserve product name, price, sale, savings, wishlist, and quick-add event/state behavior.
- Add `motion-reduce` variants to hover image transitions.

- [ ] **Step 4: Run collection tests and lint**

```powershell
node --import tsx --test tests/signature-collection.test.tsx tests/storefront-catalog.test.ts
pnpm exec eslint src/components/storefront/EditorialDivider.tsx 'src/app/collections/[slug]/1688-collection.tsx' src/components/product/ProductCard.tsx
```

- [ ] **Step 5: Commit the browsing lot**

```powershell
git add src/components/storefront/EditorialDivider.tsx 'src/app/collections/[slug]/1688-collection.tsx' src/components/product/ProductCard.tsx tests/signature-collection.test.tsx tests/storefront-catalog.test.ts
git commit -m "feat: improve Maverenne collection browsing"
```

---

### Task 5: Recompose product detail and purchase entry

**Files:**
- Modify: `src/app/products/[slug]/1688-product.tsx`
- Modify: `src/components/storefront/StickyAddToCart.tsx`
- Test: `tests/signature-product-detail.test.tsx`
- Test: `tests/cart-gift-note.test.ts`
- Modify: `e2e/release-surfaces.spec.ts`

**Interfaces:**
- Preserve `Product1688({ product }: { product: StorefrontProduct })`.
- Preserve `StickyAddToCart` behavior props: `visible`, `disabled`, `onAdd`, `price`, and `label`.
- Add no new price, inventory, care, shipping, or analytics data source.

- [ ] **Step 1: Add failing hierarchy and behavior-preservation tests**

Add source/render assertions for:

```tsx
assert.ok(source.indexOf('data-purchase-summary') < source.indexOf('data-product-longform'));
assert.match(source, /aria-live="polite"/);
assert.match(source, /data-gallery-position/);
assert.match(source, /trackViewItem/);
assert.match(source, /trackAddGiftNote/);
```

Keep existing gift-note tests unchanged to prove state behavior survives the visual refactor.

- [ ] **Step 2: Run tests and confirm missing hierarchy markers fail**

```powershell
node --import tsx --test tests/signature-product-detail.test.tsx tests/cart-gift-note.test.ts
```

- [ ] **Step 3: Split presentation sections inside the existing client owner**

Within `1688-product.tsx`, extract file-local render functions only where they do not own state:

```tsx
function PurchaseFacts({ description, benefitTriplet }: { description: string; benefitTriplet: string }) { /* presentational markup */ }
function LearningLinks() { /* current four controlled URLs */ }
```

Then:

- Keep the component as the single owner of gallery, wishlist, share, quantity, gift note, notify, and Add to Cart state.
- Add visible `current / total` gallery status with `aria-live="polite"`.
- Place primary purchase information before long-form details in DOM and visual order.
- Preserve all exact existing controlled text and logic; move rather than rewrite it.
- Make desktop gallery sticky only at `lg` and keep mobile flow natural.
- Keep sticky purchase action above the mobile bottom-nav safe area.

- [ ] **Step 4: Run product tests and lint**

```powershell
node --import tsx --test tests/signature-product-detail.test.tsx tests/cart-gift-note.test.ts tests/storefront-catalog.test.ts
pnpm exec eslint 'src/app/products/[slug]/1688-product.tsx' src/components/storefront/StickyAddToCart.tsx
```

- [ ] **Step 5: Add focused e2e assertions and commit**

Add Playwright assertions for mobile gallery position, primary Add to Cart visibility, no sticky overlap, keyboard-operable gallery controls, and unchanged cart opening. Do not change checkout, events, or snapshots.

```powershell
git add 'src/app/products/[slug]/1688-product.tsx' src/components/storefront/StickyAddToCart.tsx tests/signature-product-detail.test.tsx tests/cart-gift-note.test.ts e2e/release-surfaces.spec.ts
git commit -m "feat: clarify Maverenne product purchase hierarchy"
```

---

### Task 6: Add controlled editorial image roles to Gifts, Pearl Care, and Journal

**Files:**
- Modify: `src/app/gifts/page.tsx`
- Modify: `src/app/pearls/care/page.tsx`
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/pearls/page.tsx`
- Modify: `src/lib/homepage-editorial.ts` or create `src/lib/editorial/route-media.ts`
- Test: `tests/signature-editorial-routes.test.tsx`
- Test: `tests/editorial-landing-pages.test.ts`
- Test: `tests/editorial-guides.test.ts`
- Modify: `e2e/release-surfaces.spec.ts`

**Interfaces:**
- Consume `EditorialInlineImage` and existing controlled media records.
- Gifts keeps only `#gift-method` and `#gift-help` as route fragments.
- Pearl Care uses the controlled 1536×1024 asset and SEO/alt-contract description.
- Journal image is decorative with `alt=""`; no `/journal` route or redirect is created.

- [ ] **Step 1: Add failing route-order contracts**

```tsx
test("pearl care keeps direct answer before its single editorial image", () => {
  const html = renderToStaticMarkup(<PearlCarePage />);
  assert.ok(html.indexOf("data-direct-answer") < html.indexOf("data-editorial-inline-image"));
  assert.ok(html.indexOf("data-editorial-inline-image") < html.indexOf('id="everyday-exposure"'));
  assert.equal((html.match(/data-editorial-inline-image/g) ?? []).length, 1);
});

test("gifts retains only its two controlled fragments", () => {
  const html = renderToStaticMarkup(<GiftsPage />);
  assert.match(html, /id="gift-method"/);
  assert.match(html, /id="gift-help"/);
  assert.doesNotMatch(html, /under-50|under-70|everyday|statement/);
});
```

Add Journal assertions for `alt=""`, one H1, no fabricated post/date/author, and no `/journal` URL.

- [ ] **Step 2: Run route tests and confirm the image-order contracts fail**

```powershell
node --import tsx --test tests/signature-editorial-routes.test.tsx tests/editorial-landing-pages.test.ts tests/editorial-guides.test.ts
```

- [ ] **Step 3: Implement route-local presentation only**

- Gifts: place one contextual in-flow image after the introductory guidance and before `#gift-method`; no caption/link/CTA/product selection.
- Pearl Care: mark the existing direct answer wrapper and place the controlled image directly after it, using width 1536, height 1024, the contract alt, route-appropriate sizes, and lazy loading.
- Pearl hub: use `SignatureHero` or a compatible visual-only refinement while retaining copy, action URLs, guide content, FAQ, metadata, and schema.
- Journal: place one decorative image after H1/intro and before the truthful empty state; keep `/blog` and no fabricated entries.

- [ ] **Step 4: Run editorial suites, lint, and fragment checks**

```powershell
node --import tsx --test tests/signature-editorial-routes.test.tsx tests/editorial-landing-pages.test.ts tests/editorial-guides.test.ts tests/editorial-components.test.ts
pnpm exec eslint src/app/gifts/page.tsx src/app/pearls/page.tsx src/app/pearls/care/page.tsx src/app/blog/page.tsx src/lib/editorial/route-media.ts
rg -n "under-50|under-70|active|in-stock|editorial product selection|/journal" src/app/gifts src/app/blog src/lib/editorial/route-media.ts
```

Expected: tests and lint PASS; residue scan returns no forbidden Gifts/Journal additions.

- [ ] **Step 5: Update route-level e2e contracts and commit**

Add assertions for reading order, single editorial image, direct fragments, keyboard links, no overflow, and JS-disabled semantic readability. Do not change snapshots in this task.

```powershell
git add src/app/gifts/page.tsx src/app/pearls/page.tsx src/app/pearls/care/page.tsx src/app/blog/page.tsx src/lib/editorial/route-media.ts tests/signature-editorial-routes.test.tsx tests/editorial-landing-pages.test.ts tests/editorial-guides.test.ts e2e/release-surfaces.spec.ts
git commit -m "feat: add controlled Maverenne editorial image roles"
```

---

### Task 7: Full static, type, lint, and contract verification

**Files:**
- Modify only files required to fix regressions introduced by Tasks 1–6.
- Create: `docs/company/maverenne-signature-uiux-local-acceptance-2026-08-13.md`

**Interfaces:**
- Consumes the complete local candidate.
- Produces a factual acceptance record scoped to its exact SHA and environment.

- [ ] **Step 1: Run the focused UI/UX unit suites**

```powershell
node --import tsx --test tests/signature-ui-components.test.tsx tests/signature-shell.test.tsx tests/signature-homepage.test.tsx tests/signature-collection.test.tsx tests/signature-product-detail.test.tsx tests/signature-editorial-routes.test.tsx tests/homepage-editorial.test.ts tests/editorial-components.test.ts tests/editorial-landing-pages.test.ts tests/editorial-guides.test.ts tests/storefront-navigation.test.ts tests/storefront-search.test.ts tests/storefront-catalog.test.ts tests/cart-gift-note.test.ts
```

Expected: zero failures.

- [ ] **Step 2: Run the full unit suite**

```powershell
pnpm run test:unit
```

Expected: zero unexplained failures. If a pre-existing baseline failure appears, record its exact test and prove it exists at `099c800d…` before classifying it as unrelated.

- [ ] **Step 3: Run lint and TypeScript**

```powershell
pnpm run lint
pnpm exec tsc --noEmit
```

Expected: both exit 0.

- [ ] **Step 4: Run controlled change-boundary scans**

```powershell
git diff 099c800d279b5a7d48d755b0a38fd93ad63bfadc --name-only
git diff 099c800d279b5a7d48d755b0a38fd93ad63bfadc -- src/app src/components src/lib tests e2e
git diff --check
rg -n "metadata|canonical|JsonLd|track[A-Z]|price:|stock:|inStock:" src/components/editorial/SignatureHero.tsx src/components/editorial/EditorialInlineImage.tsx src/components/home/EditorialDiptych.tsx src/components/storefront/EditorialDivider.tsx
```

Expected: new presentation components contain no controlled data ownership or analytics calls; diff check is clean.

- [ ] **Step 5: Write the static acceptance section**

Record exact candidate SHA, changed files, command outputs, exclusions, and any unresolved runtime evidence. Do not claim browser, assistive-technology, LCP, CLS, or deployment evidence not actually run.

- [ ] **Step 6: Commit verification fixes and the acceptance shell**

```powershell
git add docs/company/maverenne-signature-uiux-local-acceptance-2026-08-13.md
git commit -m "test: record Maverenne signature UIUX static acceptance"
```

If verification required source fixes, stage those exact files in the same commit only when the acceptance record names the regression and evidence.

---

### Task 8: Real-browser responsive, accessibility, and performance-risk acceptance

**Files:**
- Modify: `docs/company/maverenne-signature-uiux-local-acceptance-2026-08-13.md`
- Modify snapshots only after each changed route is independently accepted and only in a separate test/snapshot-only commit.

**Interfaces:**
- Consumes a fixed clean candidate SHA from Task 7.
- Produces screenshots and a Pass/Fix/Blocked evidence matrix; it does not modify application behavior.

- [ ] **Step 1: Start the isolated candidate with no production binding**

Use existing dependencies and a dedicated local port:

```powershell
pnpm run dev -- --port 3113
```

Record the exact PID and port. Do not connect or seed a production database. If startup fails, record the single exact blocker and reproduction command.

- [ ] **Step 2: Run 390×844 acceptance**

For `/`, `/collections/pearl-series`, one controlled product route, `/gifts`, `/pearls`, `/pearls/care`, and `/blog`, capture viewport and relevant full-page evidence. Check:

- no horizontal overflow or clipped text;
- 44px targets;
- hero focal crop and text contrast;
- product-card control collision;
- product gallery position indicator;
- sticky Add to Cart versus bottom-nav separation;
- direct fragments clear of sticky chrome.

- [ ] **Step 3: Run 768×900 and 1440×900 acceptance**

Repeat the same routes, checking intentional tablet composition, dialog gutters, bounded desktop measure, grid rhythm, focal crop, and sticky-header/fragment clearance.

- [ ] **Step 4: Run keyboard, reduced-motion, fragment, and no-JS checks**

Use actual browser input to verify:

- skip link and main navigation order;
- desktop menu ArrowDown/Escape/focus return;
- search and mobile-nav dialogs focus containment/Escape/return;
- Gifts fragment links through Tab/Enter and browser back/forward;
- product gallery and purchase controls;
- reduced-motion disables nonessential rotation/transition behavior;
- `javaScriptEnabled: false` preserves route headings, body content, Gifts fragments, and editorial links where native behavior is expected.

Do not claim a screen-reader run unless one is actually performed.

- [ ] **Step 5: Review performance risk and console output**

Record rendered image dimensions, unexpected layout movement, initial hero request priority, duplicate hero/LCP candidates, and console errors. Mark Fix for missing reserved dimensions, unexpected eager below-fold images, visible CLS, or material LCP risk. Do not convert HTTP 200 into performance or usability evidence.

- [ ] **Step 6: Stop the targeted server and update the acceptance record**

Terminate only the recorded PID for port 3113, verify the port no longer listens, and write exact screenshot paths, viewports, SHA, browser/runtime, Pass/Fix/Blocked results, limitations, and rollback condition.

- [ ] **Step 7: Run final diff checks and commit evidence**

```powershell
git diff --check
git status --short
git add docs/company/maverenne-signature-uiux-local-acceptance-2026-08-13.md
git commit -m "test: complete Maverenne signature UIUX browser acceptance"
```

If accepted screenshots require baseline replacement, create a separate commit containing only the four controlled snapshot files and their test-only contract update. Never auto-rebaseline a failed screenshot.

---

## Final candidate handoff

The final handoff must report:

1. candidate base, final SHA, branch, and clean/dirty status;
2. exact changed files grouped by implementation lot;
3. static, unit, lint, TypeScript, responsive, keyboard, no-JS, reduced-motion, console, and image-stability evidence;
4. any Fix/Blocked items and their exact reproduction command;
5. explicit confirmation that the candidate remains local-only, unmerged, unpushed, undeployed, and does not authorize product, policy, SEO-field, analytics, rights, or publication changes.
