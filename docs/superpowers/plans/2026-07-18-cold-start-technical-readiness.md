# MythRealms Cold-Start Technical Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the storefront measurable, indexable, and factually trustworthy before sending US organic traffic to it.

**Architecture:** Keep the existing Next.js App Router storefront and catalog as the source of truth. Add small pure helpers for sitemap generation, cookie consent, and commerce payloads so tests do not require a browser or database. UI components will only bridge real user actions to those helpers.

**Tech Stack:** Next.js 16.2.6 App Router, React 19, TypeScript, Prisma, Zustand, Node test runner with `tsx`, Vercel.

## Global Constraints

- Read the relevant files under `node_modules/next/dist/docs/` immediately before changing metadata, sitemap, JSON-LD, or analytics code.
- Do not alter unrelated user assets under `public/`, `video-pipeline/`, or other dirty worktree paths.
- Preserve all 45 approved public products. The four hero products are a marketing focus, not a catalog deletion.
- Do not add ratings, reviews, sales counts, urgency, provenance, pearl type, or material claims without evidence.
- Supplier photos must remain the product-truth reference. AI editorial images may supplement but must not replace those references.
- Analytics consent and marketing consent are separate. GA4 requires analytics consent; Meta and Pinterest require marketing consent.
- Every implementation task starts with a failing test and ends with a focused commit.

---

### Task 1: Make the journal indexable and include it in the sitemap

**Files:**
- Modify: `tests/seo-catalog.test.ts`
- Create: `src/lib/seo/blog.ts`
- Create: `src/lib/seo/sitemap.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/components/ui/JsonLd.tsx`

- [ ] **Step 1: Replace the obsolete noindex tests with the desired behavior**

Update `tests/seo-catalog.test.ts` so it imports a pure `buildSitemapEntries` helper instead of calling the database-backed route. Use a fixed post fixture:

```ts
const posts = [
  { slug: "pearl-earrings-under-50", updatedAt: new Date("2026-07-18T00:00:00Z") },
];

test("the sitemap includes the journal and published article URLs", () => {
  const entries = buildSitemapEntries(siteUrl, getStorefrontProducts(), posts);
  const urls = new Set(entries.map((entry) => entry.url));
  assert.equal(urls.has(`${siteUrl}/blog`), true);
  assert.equal(urls.has(`${siteUrl}/blog/pearl-earrings-under-50`), true);
});

test("the journal archive is indexable", () => {
  const robots = blogMetadata.robots;
  assert.notEqual(
    robots && typeof robots === "object" && "index" in robots ? robots.index : undefined,
    false,
  );
});
```

Import and test a pure `buildBlogMetadata` helper with a real-post fixture. Assert that it returns the canonical URL and article Open Graph data without `robots.index: false`. Keep the not-found response noindex in the route itself.

- [ ] **Step 2: Run the focused test and confirm failure**

```powershell
npm run test:unit -- tests/seo-catalog.test.ts
```

Expected: failure because the helper does not exist and the current journal is noindex.

- [ ] **Step 3: Add pure blog metadata and sitemap builders**

Create `src/lib/seo/blog.ts` with a `buildBlogMetadata` function that accepts `{ slug, title, excerpt, image }` and returns the existing canonical, Open Graph, and Twitter fields for an indexable article. This separates the database query from metadata policy and makes the indexability contract unit-testable.

Create `src/lib/seo/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import type { StorefrontProduct } from "@/lib/storefront/catalog";

export interface SitemapPost {
  slug: string;
  updatedAt: Date;
}

export function buildSitemapEntries(
  baseUrl: string,
  products: StorefrontProduct[],
  posts: SitemapPost[],
): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/collections/pearl-series`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/pearls`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/faq`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/size-guide`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/shipping`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/refund`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  return [
    ...staticPages,
    ...products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
```

- [ ] **Step 4: Convert the sitemap route to an async database adapter**

In `src/app/sitemap.ts`, query only the required fields and pass them to the pure helper:

```ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await db.blogPost.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
  return buildSitemapEntries(siteUrl, getStorefrontProducts(), posts);
}
```

- [ ] **Step 5: Replace archive/noindex language with an active journal contract**

In `src/app/blog/page.tsx`:

- Remove `dynamic = "force-dynamic"` unless the current Next.js docs require it for this database access.
- Use `export const revalidate = 3600` if compatible with the configured database runtime.
- Set title to `Pearl Jewelry Journal | MythRealms`.
- Set description to a factual summary of styling, care, gifting, fit, and shipping guidance.
- Remove `robots: { index: false, follow: false }`.
- Change visible `Journal Archive` and archived-note copy to `Pearl Jewelry Journal` and active editorial copy.

In `src/app/blog/[slug]/page.tsx`, retain `noindex` only for the not-found metadata response. Existing posts must call `buildBlogMetadata`.

- [ ] **Step 6: Add BlogPosting JSON-LD**

Add a pure `buildBlogPostingData` function and a thin `BlogPostingJsonLd` component to `src/components/ui/JsonLd.tsx`. Inputs are `headline`, `description`, `url`, optional `image`, `datePublished`, `dateModified`, and `authorName`. It must emit `BlogPosting`, `mainEntityOfPage`, publisher `MythRealms`, and ISO dates, without invented credentials. Test the pure builder in `tests/seo-catalog.test.ts`.

Render it from `src/app/blog/[slug]/page.tsx` using the actual database fields and `absoluteUrl`/`absoluteImageUrl` helpers.

- [ ] **Step 7: Run tests and build checks**

```powershell
npm run test:unit -- tests/seo-catalog.test.ts
npm run lint
npm run build
```

Expected: all commands exit 0; build generates `/sitemap.xml`, `/blog`, and article routes without metadata errors.

- [ ] **Step 8: Commit the journal/search work**

```powershell
git add -- tests/seo-catalog.test.ts src/lib/seo/blog.ts src/lib/seo/sitemap.ts src/app/sitemap.ts src/app/blog/page.tsx 'src/app/blog/[slug]/page.tsx' src/components/ui/JsonLd.tsx
git commit -m "seo: index the pearl journal"
```

---

### Task 2: Make supplier imagery the product-truth reference

**Files:**
- Modify: `tests/storefront-catalog.test.ts`
- Modify: `tests/storefront-trust.test.ts`
- Modify: `src/lib/1688-products.ts`
- Modify: `src/app/products/[slug]/1688-product.tsx`
- Modify: `src/components/ui/JsonLd.tsx`

- [ ] **Step 1: Write the trust regression tests**

Replace the test that requires `pearl-series-01` to use only editorial images. The new test must require:

```ts
assert.equal(
  pilot.image,
  "/images/products/1688-shop/pearl-series/pearl-series-01-main.webp",
);
assert.deepEqual(pilot.images.slice(0, 3), [
  "/images/products/1688-shop/pearl-series/pearl-series-01-main.webp",
  "/images/products/1688-shop/pearl-series/pearl-series-01-detail2.webp",
  "/images/products/1688-shop/pearl-series/pearl-series-01-detail1.webp",
]);
assert.ok(pilot.images.some((image) => image.includes("-editorial-v1-")));
```

In `tests/storefront-trust.test.ts`, assert that the product detail page contains a visible editorial-image disclosure and that `OrganizationJsonLd` no longer claims `Freshwater pearls` as expertise.

- [ ] **Step 2: Run the focused tests and confirm failure**

```powershell
npm run test:unit -- tests/storefront-catalog.test.ts tests/storefront-trust.test.ts
```

Expected: failure because the pilot currently replaces its source gallery.

- [ ] **Step 3: Prepend source images and retain editorial images as supplements**

In `src/lib/1688-products.ts`, change the pilot branch to:

```ts
const editorialImages = EDITORIAL_PILOT_IMAGES[product.slug];
if (images && editorialImages) {
  product.image = images[0];
  product.images = [...images, ...editorialImages];
} else if (images) {
  product.image = images[0];
  product.images = [...images];
}
```

Do not alter any other source-preserved gallery.

- [ ] **Step 4: Add a concise product-gallery disclosure**

Under the thumbnail gallery in `src/app/products/[slug]/1688-product.tsx`, render a quiet line of copy only when an image path contains `-editorial-`:

```tsx
{images.some((image) => image.includes("-editorial-")) && (
  <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)]">
    Supplier-supplied product views appear first. Later editorial scenes may be AI-generated; refer to the first views for product shape and details.
  </p>
)}
```

- [ ] **Step 5: Remove the unsupported pearl-type expertise claim**

In `OrganizationJsonLd`, remove `Freshwater pearls` from `knowsAbout`. Keep `Pearl jewelry`, `Jewelry styling`, and `Pearl care` only.

- [ ] **Step 6: Verify and commit**

```powershell
npm run test:unit -- tests/storefront-catalog.test.ts tests/storefront-trust.test.ts tests/public-catalog.test.ts
npm run lint
git add -- tests/storefront-catalog.test.ts tests/storefront-trust.test.ts src/lib/1688-products.ts 'src/app/products/[slug]/1688-product.tsx' src/components/ui/JsonLd.tsx
git commit -m "fix: preserve supplier product references"
```

---

### Task 3: Make consent state reactive and platform-specific

**Files:**
- Create: `tests/analytics-consent.test.ts`
- Create: `src/lib/analytics/consent.ts`
- Modify: `src/components/layout/Analytics.tsx`
- Modify: `src/components/layout/CookieConsent.tsx`

- [ ] **Step 1: Write pure consent tests**

Cover missing, malformed, essential-only, analytics-only, and all-consent values:

```ts
assert.deepEqual(parseConsent(null), { analytics: false, marketing: false });
assert.deepEqual(parseConsent("not-json"), { analytics: false, marketing: false });
assert.deepEqual(
  parseConsent(JSON.stringify({ necessary: true, analytics: true, marketing: false })),
  { analytics: true, marketing: false },
);
```

Also test `serializeConsent("all")` and `serializeConsent("essential")`.

- [ ] **Step 2: Run the focused test and confirm failure**

```powershell
npm run test:unit -- tests/analytics-consent.test.ts
```

- [ ] **Step 3: Add the consent helper and event contract**

Create `src/lib/analytics/consent.ts` with:

```ts
export const CONSENT_STORAGE_KEY = "cookie-consent";
export const CONSENT_CHANGED_EVENT = "mythrealms:consent-changed";

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
}

export function parseConsent(raw: string | null): ConsentState { /* fail closed */ }
export function serializeConsent(level: "all" | "essential"): string { /* include timestamp */ }
```

- [ ] **Step 4: Dispatch consent changes immediately**

In both cookie-consent button handlers, write the serialized value and dispatch:

```ts
window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT));
```

- [ ] **Step 5: Make Analytics react without a refresh**

Refactor `Analytics.tsx` to read `ConsentState` on mount, subscribe to both `CONSENT_CHANGED_EVENT` and the browser `storage` event, and clean up listeners.

Render GA scripts only when `consent.analytics` is true. Render Meta Pixel and Pinterest Tag only when `consent.marketing` is true. Keep all IDs optional and do not log them. Pending-event flushing is added after the tracking queue exists in Task 4.

- [ ] **Step 6: Verify and commit**

```powershell
npm run test:unit -- tests/analytics-consent.test.ts
npm run lint
git add -- tests/analytics-consent.test.ts src/lib/analytics/consent.ts src/components/layout/Analytics.tsx src/components/layout/CookieConsent.tsx
git commit -m "fix: apply analytics consent immediately"
```

---

### Task 4: Wire the complete ecommerce event funnel

**Files:**
- Create: `tests/analytics-tracking.test.ts`
- Modify: `src/lib/tracking.ts`
- Modify: `src/lib/cart.ts`
- Modify: `src/components/layout/Analytics.tsx`
- Modify: `src/app/products/[slug]/1688-product.tsx`
- Modify: `src/app/checkout/page.tsx`
- Modify: `src/app/checkout/success/tracker.tsx`

- [ ] **Step 1: Write tests for payloads, independent dispatch, and purchase deduplication keys**

Expose pure builders and test exact currency, value, item IDs, quantities, and transaction ID. Use a fake target where GA is absent but Meta and Pinterest are present, and assert those platforms still receive events.

Required test cases:

- `view_item` payload for one product.
- `add_to_cart` value equals `price * quantity`.
- `begin_checkout` includes every item.
- `purchase` contains `transaction_id`.
- Meta/Pinterest dispatch is not gated by `gtag`.
- Events queued before a platform initializer exists flush exactly once when that platform becomes ready.
- Analytics-denied events are neither dispatched nor queued for GA; marketing-denied events are neither dispatched nor queued for Meta/Pinterest.
- `purchaseStorageKey("order_123")` returns a stable namespaced key.

- [ ] **Step 2: Run the focused test and confirm failure**

```powershell
npm run test:unit -- tests/analytics-tracking.test.ts
```

- [ ] **Step 3: Refactor `tracking.ts` around a typed optional target**

Use one target type and independent guards:

```ts
export interface TrackingTarget {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  pintrk?: (...args: unknown[]) => void;
}

function browserTarget(): TrackingTarget | undefined {
  return typeof window === "undefined" ? undefined : window;
}
```

Each public tracker accepts optional target, consent state, and configured-platform state for tests and calls each configured, permitted, available platform independently. The browser default configured-platform state comes from the three `NEXT_PUBLIC_*` IDs. When consent permits a configured platform but its initializer does not exist yet, store one platform-specific pending event. Export `flushTrackingQueue(platform, target)` so `Analytics.tsx` can drain only the platform that just initialized; this prevents a late Meta initializer from replaying an event to GA. Map Pinterest to its supported ecommerce events (`addtocart` and `checkout`) without sending personal data. Export:

```ts
export const PURCHASE_STORAGE_PREFIX = "mythrealms:purchase-tracked:";
export const purchaseStorageKey = (orderId: string) => `${PURCHASE_STORAGE_PREFIX}${orderId}`;
```

- [ ] **Step 4: Flush each platform queue when its initializer is ready**

In `src/components/layout/Analytics.tsx`, add an `onReady` callback to each enabled platform's initialization `Script`. Call only the matching queue:

```tsx
onReady={() => flushTrackingQueue("ga")}
onReady={() => flushTrackingQueue("meta")}
onReady={() => flushTrackingQueue("pinterest")}
```

Confirm from the installed Next.js 16 docs that `onReady` is valid for the chosen `Script` usage. If inline scripts do not invoke it in the local runtime, use a small client callback immediately after the initializer establishes its queue function; do not use arbitrary timeouts.

- [ ] **Step 5: Track every cart addition centrally**

In `src/lib/cart.ts`, call `trackAddToCart` once at the start of `addItem`. This covers product detail, sticky add, product cards, and wishlist without duplicating component hooks:

```ts
addItem: (product, quantity = 1) => {
  trackAddToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity,
    variant: product.variantName,
  });
  set(/* existing state update */);
},
```

- [ ] **Step 6: Track product views after consent can become active**

In `Product1688`, create one `useEffect` that calls `trackViewItem` on mount and responds to `CONSENT_CHANGED_EVENT`. Include `id`, display name, price, category, and slug/variant where available. Remove the listener on unmount.

The tracking layer must deduplicate identical pending events per platform. Do not use a component-level flag that marks a product view complete before the event is either dispatched or queued; that would lose the first view when consent is accepted after mount.

- [ ] **Step 7: Track begin checkout once per checkout mount**

In `src/app/checkout/page.tsx`, use a ref and an effect after the empty-cart guard inputs are available:

```ts
const checkoutTracked = useRef(false);
useEffect(() => {
  if (checkoutTracked.current || items.length === 0) return;
  checkoutTracked.current = true;
  trackBeginCheckout(
    items.map(({ product, quantity }) => ({ ...product, quantity })),
    total,
  );
}, [items, total]);
```

Do not include email, name, phone, or address in analytics payloads.

- [ ] **Step 8: Deduplicate paid purchase events**

Replace duplicated pixel calls in `src/app/checkout/success/tracker.tsx` with `trackPurchase`. Before dispatching, check `localStorage` using `purchaseStorageKey(orderId)`. `trackPurchase` must return whether at least one consented platform accepted the event for dispatch or queuing; write the key only when that return value is true. Listen for `CONSENT_CHANGED_EVENT` while the key is absent so accepting consent on the success page can still record the purchase. Include `items` in the effect dependency list and clean up the listener.

- [ ] **Step 9: Verify the focused event suite**

```powershell
npm run test:unit -- tests/analytics-tracking.test.ts tests/analytics-consent.test.ts
npm run lint
```

- [ ] **Step 10: Browser-verify the funnel**

Start a local server and use Playwright or the in-app browser with stubbed `gtag`, `fbq`, and `pintrk` functions. Verify:

1. Essential-only consent loads no analytics or marketing scripts.
2. Accept All loads scripts without refresh and flushes a queued current-page product view exactly once per configured platform.
3. Product visit emits one `view_item`.
4. Any add-to-cart entry point emits one add event.
5. Checkout emits one begin-checkout event.
6. Refreshing a paid success page does not emit a second purchase for the same order.

- [ ] **Step 11: Commit the funnel tracking**

```powershell
git add -- tests/analytics-tracking.test.ts src/lib/tracking.ts src/lib/cart.ts src/components/layout/Analytics.tsx 'src/app/products/[slug]/1688-product.tsx' src/app/checkout/page.tsx src/app/checkout/success/tracker.tsx
git commit -m "feat: track the ecommerce funnel"
```

---

### Task 5: Complete the launch gate and production verification

**Files:**
- Create: `docs/operations/cold-start-measurement-runbook.md`
- Modify: `.env.example`

- [ ] **Step 1: Document the required public environment variables**

Ensure `.env.example` contains blank placeholders and comments for:

```dotenv
NEXT_PUBLIC_APP_URL="https://mythrealms.shop"
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_META_PIXEL_ID=""
NEXT_PUBLIC_PINTEREST_TAG_ID=""
```

Do not add real IDs or secrets to Git.

- [ ] **Step 2: Write the measurement runbook**

The runbook must include:

- UTM format: `utm_source`, `utm_medium=organic_social`, `utm_campaign`, `utm_content`.
- Test URLs for the four hero products.
- GA4 event names and expected payload fields.
- Meta and Pinterest event equivalents.
- Consent checks.
- Purchase dedupe check.
- A place to record production test date, tester, order ID, and result.

- [ ] **Step 3: Run the full repository gate**

```powershell
npm run test:unit
npm run lint
npm run build
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 4: Deploy and verify production**

Deploy through the repository's existing Vercel flow. On `https://mythrealms.shop`, verify:

- `/robots.txt` allows public pages for `OAI-SearchBot`, `PerplexityBot`, and normal crawlers.
- `/sitemap.xml` contains `/blog` and real article URLs.
- Journal pages have no `noindex`.
- Product JSON-LD has no fabricated aggregate rating.
- `/api/feed` returns valid XML and all 45 approved SKUs.
- The four ecommerce events appear in debug/test tools after consent.

- [ ] **Step 5: Commit the runbook and environment documentation**

```powershell
git add -- .env.example docs/operations/cold-start-measurement-runbook.md
git commit -m "docs: add cold start measurement gate"
```

### Completion Criteria

- Journal archive and articles are indexable and listed in the sitemap.
- Product pages lead with supplier-source images where AI editorial imagery exists.
- Consent changes take effect on the same page and separate analytics from marketing.
- `view_item`, `add_to_cart`, `begin_checkout`, and deduplicated `purchase` work independently across configured platforms.
- Full tests, lint, and build pass.
- Production verification is recorded before any organic campaign links are published.
