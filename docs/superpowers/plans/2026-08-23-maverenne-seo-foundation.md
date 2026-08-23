# Maverenne SEO Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove retired public SEO identity, make the production canonical safe by default, emit truthful sitemap freshness signals, and strengthen product metadata without unsupported claims.

**Architecture:** Keep `BRAND` and `site.ts` as the identity and canonical sources, add one pure product-metadata helper, and keep sitemap construction in the existing pure builder. Route files consume these helpers; tests enforce the public contract and production smoke validates rendered output.

**Tech Stack:** Next.js 16.2 App Router metadata routes, TypeScript, Node test runner with `tsx`, Playwright, PostgreSQL-backed blog sitemap.

**Spec:** `docs/superpowers/specs/2026-08-23-maverenne-seo-foundation-design.md`

## Global Constraints

- Production canonical is exactly `https://www.maverenne.com`.
- Do not expose `MythRealms` on an indexable sitemap page title, description, visible publisher label, or first-party structured-data identity.
- Do not create rolling sitemap freshness with `new Date()` or build time.
- Do not invent materials, certifications, availability, shipping promises, or health/spiritual effects.
- Keep the three held pearl guides 404 and absent from the hub and sitemap.
- Do not touch checkout, authentication, order, video-production, or unrelated dirty-worktree files.
- Follow the checked-in Next.js 16 documentation under `node_modules/next/dist/docs/`.

---

### Task 1: Canonical production host

**Files:**
- Modify: `src/lib/site.ts`
- Modify: `tests/seo-catalog.test.ts`

**Interfaces:**
- Consumes: `BRAND` from `src/lib/brand-identity.ts`.
- Produces: `DEFAULT_SITE_URL === "https://www.maverenne.com"`; unchanged `siteUrl` and `absoluteUrl(path)` interfaces.

- [ ] **Step 1: Write the failing canonical-host test**

Add a source-level regression test alongside the existing root metadata tests:

```ts
test("the default site URL is the canonical Maverenne production host", async () => {
  const { DEFAULT_SITE_URL } = await import("../src/lib/site");
  assert.equal(DEFAULT_SITE_URL, "https://www.maverenne.com");
});
```

- [ ] **Step 2: Run the focused test and verify the old fallback fails**

Run:

```powershell
node --import tsx --test tests/seo-catalog.test.ts
```

Expected: FAIL showing `https://mythrealms-shop.vercel.app` instead of the canonical production host.

- [ ] **Step 3: Change only the fallback constant**

Update `src/lib/site.ts`:

```ts
export const DEFAULT_SITE_URL = "https://www.maverenne.com";
```

Keep trimming, slash normalization, environment override, and `absoluteUrl` unchanged.

- [ ] **Step 4: Run the focused test**

Run:

```powershell
node --import tsx --test tests/seo-catalog.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit only Task 1 files**

```powershell
git add src/lib/site.ts tests/seo-catalog.test.ts
git commit -m "fix: default SEO URLs to Maverenne"
```

### Task 2: Product metadata builder

**Files:**
- Create: `src/lib/seo/product-metadata.ts`
- Create: `tests/product-metadata.test.ts`
- Modify: `src/app/products/[slug]/page.tsx`

**Interfaces:**
- Consumes: `StorefrontProduct`, `getProductType(product)`, `SITE_NAME`, and `absoluteUrl(path)`.
- Produces: `buildProductMetadata(product: StorefrontProduct): Metadata`.

- [ ] **Step 1: Write failing product metadata tests**

Create tests that load a real storefront product and assert the pure result:

```ts
import assert from "node:assert/strict";
import test from "node:test";

import { getStorefrontProductBySlug } from "../src/lib/storefront/catalog";
import { buildProductMetadata } from "../src/lib/seo/product-metadata";

test("product metadata uses Maverenne and a verified product type", () => {
  const product = getStorefrontProductBySlug("new-series-round-shell-gold-cuff");
  assert.ok(product);
  const metadata = buildProductMetadata(product);
  assert.equal(metadata.title, `${product.name} | Pearl Bracelet | Maverenne`);
  assert.doesNotMatch(JSON.stringify(metadata), /MythRealms|vercel\.app/i);
  assert.equal(
    metadata.alternates?.canonical,
    `https://www.maverenne.com/products/${product.slug}`,
  );
});

test("product metadata derives its description from verified catalog copy", () => {
  const product = getStorefrontProductBySlug("new-series-round-shell-gold-cuff");
  assert.ok(product);
  const description = String(buildProductMetadata(product).description);
  assert.ok(description.length > 40 && description.length <= 160);
  assert.match(product.description, new RegExp(description.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").slice(0, 30)));
});
```

- [ ] **Step 2: Run the new test and verify the helper is missing**

Run:

```powershell
node --import tsx --test tests/product-metadata.test.ts
```

Expected: FAIL because `src/lib/seo/product-metadata.ts` does not exist.

- [ ] **Step 3: Implement the pure builder**

Create a helper with a fixed customer-facing type map:

```ts
import type { Metadata } from "next";

import { SITE_NAME, absoluteUrl } from "@/lib/site";
import {
  getProductType,
  type StorefrontProduct,
  type StorefrontProductType,
} from "@/lib/storefront/catalog";

const PRODUCT_TYPE_LABELS: Record<StorefrontProductType, string> = {
  rings: "Pearl Ring",
  bracelets: "Pearl Bracelet",
  earrings: "Pearl Earrings",
  necklaces: "Pearl Necklace",
  "hair-accessories": "Pearl Hair Accessory",
  "eyewear-chains": "Pearl Eyewear Chain",
};

function descriptionFor(product: StorefrontProduct): string {
  return product.description.trim().replace(/\s+/g, " ").slice(0, 155).trim();
}

export function buildProductMetadata(product: StorefrontProduct): Metadata {
  const canonical = absoluteUrl(`/products/${product.slug}`);
  const title = `${product.name} | ${PRODUCT_TYPE_LABELS[getProductType(product)]} | ${SITE_NAME}`;
  const description = descriptionFor(product);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, images: product.images.slice(0, 1) },
  };
}
```

If the existing product Open Graph/Twitter fields contain more verified fields than this skeleton, preserve them while keeping title, description, URL, and identity generated in one place.

- [ ] **Step 4: Connect the page metadata function**

In `src/app/products/[slug]/page.tsx`, keep the not-found `noindex` branch and replace only the found-product metadata object with:

```ts
return buildProductMetadata(product);
```

- [ ] **Step 5: Run product and structured-data tests**

Run:

```powershell
node --import tsx --test tests/product-metadata.test.ts tests/structured-data.test.ts tests/seo-catalog.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit only Task 2 files**

```powershell
git add src/lib/seo/product-metadata.ts tests/product-metadata.test.ts 'src/app/products/[slug]/page.tsx'
git commit -m "feat: unify Maverenne product metadata"
```

### Task 3: Indexable public-brand cleanup

**Files:**
- Modify: `src/app/collections/page.tsx`
- Modify: `src/app/collections/[slug]/page.tsx`
- Modify: `src/app/faq/layout.tsx`
- Modify: `src/app/faq/page.tsx`
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/edits/[slug]/page.tsx`
- Modify: `src/app/size-guide/page.tsx`
- Modify: `src/app/guardian-quiz/page.tsx`
- Modify: `src/app/pearls/stories/page.tsx`
- Modify: `src/app/pearls/symbolism/page.tsx`
- Modify: `tests/brand-identity.test.ts`

**Interfaces:**
- Consumes: `BRAND.name` and `SITE_NAME`.
- Produces: indexable public metadata and visible publisher labels with Maverenne identity.

- [ ] **Step 1: Expand the brand regression test**

Read the listed route files and assert that their public indexable surfaces do not contain the retired identity. The test must distinguish intentionally noindex utility files from sitemap pages:

```ts
const INDEXABLE_BRAND_FILES = [
  "src/app/collections/page.tsx",
  "src/app/collections/[slug]/page.tsx",
  "src/app/faq/layout.tsx",
  "src/app/faq/page.tsx",
  "src/app/blog/page.tsx",
  "src/app/blog/[slug]/page.tsx",
  "src/app/edits/[slug]/page.tsx",
  "src/app/size-guide/page.tsx",
  "src/app/guardian-quiz/page.tsx",
  "src/app/pearls/stories/page.tsx",
  "src/app/pearls/symbolism/page.tsx",
];

test("indexable route sources do not expose the retired public brand", () => {
  for (const file of INDEXABLE_BRAND_FILES) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /MythRealms/i, file);
  }
});
```

- [ ] **Step 2: Run the brand test and verify it fails on current files**

Run:

```powershell
node --import tsx --test tests/brand-identity.test.ts
```

Expected: FAIL listing at least one current indexable route source.

- [ ] **Step 3: Replace public identity using the central helper**

For static metadata, interpolate `SITE_NAME` or `BRAND.name`. For visible React copy and author fallbacks, render the same central value. Preserve page-specific intent, canonical URLs, and verified content. Example patterns:

```ts
title: `Frequently Asked Questions | ${SITE_NAME}`
```

```tsx
<span>{post.author?.name || SITE_NAME}</span>
```

Do not edit operational emails, source comments, API automation prompts, internal TypeScript type names, or intentionally noindex campaign routes in this task.

- [ ] **Step 4: Run brand, catalog, story, and policy tests**

Run:

```powershell
node --import tsx --test tests/brand-identity.test.ts tests/seo-catalog.test.ts tests/story-page.test.ts tests/storefront-policies.test.ts tests/traffic-conversion-pages.test.ts
```

Expected: PASS. If an old test asserts the retired identity on an indexable public surface, update it to Maverenne; do not weaken unrelated assertions.

- [ ] **Step 5: Commit only Task 3 files**

```powershell
git add src/app/collections src/app/faq src/app/blog src/app/edits src/app/size-guide src/app/guardian-quiz src/app/pearls/stories src/app/pearls/symbolism tests/brand-identity.test.ts tests/story-page.test.ts tests/traffic-conversion-pages.test.ts
git commit -m "fix: remove retired brand from indexable pages"
```

Before committing, inspect `git diff --cached --name-only` and unstage any file not changed for Task 3 because the worktree already contains unrelated staged media work.

### Task 4: Truthful sitemap freshness

**Files:**
- Modify: `src/lib/seo/sitemap.ts`
- Modify: `tests/seo-catalog.test.ts`
- Modify: `tests/purchase-guide-registry.test.ts`

**Interfaces:**
- Consumes: current route registries, product catalog, database `post.updatedAt`.
- Produces: `buildSitemapEntries(...)` with stable `lastModified` values and no `changeFrequency` or `priority` output.

- [ ] **Step 1: Write failing sitemap freshness tests**

Add assertions to the existing pure sitemap test:

```ts
const entries = buildSitemapEntries(
  "https://www.maverenne.com",
  products,
  posts,
  editPaths,
  discoveryPaths,
);

assert.ok(entries.some((entry) => entry.lastModified));
assert.ok(entries.every((entry) => entry.changeFrequency === undefined));
assert.ok(entries.every((entry) => entry.priority === undefined));
assert.doesNotMatch(readFileSync("src/lib/seo/sitemap.ts", "utf8"), /new Date\(\s*\)/);
```

Also assert that a supplied journal `updatedAt` is preserved exactly and that all product entries share the declared SEO release date.

- [ ] **Step 2: Run the sitemap tests and verify current ignored fields fail**

Run:

```powershell
node --import tsx --test tests/seo-catalog.test.ts tests/purchase-guide-registry.test.ts
```

Expected: FAIL because current entries contain `changeFrequency` and `priority` and product entries have no `lastModified`.

- [ ] **Step 3: Implement a stable significant-change date**

Declare:

```ts
export const SEO_FOUNDATION_LAST_MODIFIED = "2026-08-23";
```

Use it for the products and indexable route groups whose metadata, structured data, visible copy, or contextual links change in this release. Preserve each journal post's real `updatedAt`. Omit `lastModified` from untouched legal or operational information pages if they have no defensible update date. Remove every `changeFrequency` and `priority` property from the builder.

- [ ] **Step 4: Run sitemap and held-guide tests**

Run:

```powershell
node --import tsx --test tests/seo-catalog.test.ts tests/purchase-guide-registry.test.ts tests/pearl-growth-pages.test.ts
```

Expected: PASS, with exactly the three approved purchase guides present.

- [ ] **Step 5: Commit only Task 4 files**

```powershell
git add src/lib/seo/sitemap.ts tests/seo-catalog.test.ts tests/purchase-guide-registry.test.ts
git commit -m "feat: add truthful sitemap freshness"
```

### Task 5: Crawl hierarchy regression coverage

**Files:**
- Modify only if the audit finds a missing contextual path: `src/app/page.tsx`, `src/app/collections/new-arrivals/page.tsx`, `src/app/pearls/page.tsx`, or the existing product SEO-content component used by `src/app/products/[slug]/page.tsx`
- Modify: `tests/seo-catalog.test.ts`
- Modify: `tests/pearl-growth-pages.test.ts`

**Interfaces:**
- Consumes: current crawlable `<a href>` hierarchy and the active-guide registry.
- Produces: tested crawl paths from homepage or hub pages to priority collections, guides, and products.

- [ ] **Step 1: Audit existing crawlable links before changing UI**

Use source inspection and existing rendered tests to verify:

```text
Home -> /collections/new-arrivals
Home or navigation -> /pearls
/pearls -> all three active purchase guides
/collections/new-arrivals -> every visible new-arrival product
Relevant product SEO content -> at least one appropriate guide or hub
```

- [ ] **Step 2: Add failing assertions only for missing paths**

Use exact `href` assertions against the existing rendered/source contract. Do not add a test that already passes merely to force a UI edit.

- [ ] **Step 3: Add the minimum contextual links needed**

Reuse existing link components and visible sections. Use descriptive natural anchors; do not add hidden links, exact-match site-wide blocks, or held-guide URLs.

- [ ] **Step 4: Run crawl-hierarchy and release-surface tests**

Run:

```powershell
node --import tsx --test tests/seo-catalog.test.ts tests/pearl-growth-pages.test.ts tests/purchase-guide-layout.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit only actual Task 5 changes**

```powershell
git add tests/seo-catalog.test.ts tests/pearl-growth-pages.test.ts tests/purchase-guide-layout.test.tsx src/app/page.tsx src/app/collections/new-arrivals/page.tsx src/app/pearls/page.tsx
git commit -m "test: protect priority SEO crawl paths"
```

Do not create an empty commit if the audit proves the existing hierarchy already satisfies the spec.

### Task 6: Full verification and release evidence

**Files:**
- Modify only when existing release-evidence conventions require it: repository-local SEO/release evidence Markdown or JSON file discovered during implementation
- Do not modify the prior FILE 001 evidence files.

**Interfaces:**
- Consumes: Tasks 1–5 implementation and existing release commands.
- Produces: verified build artifacts and measured before/after SEO counts.

- [ ] **Step 1: Check patch hygiene**

Run:

```powershell
git diff --check
git status --short
```

Expected: no whitespace errors in SEO-owned files; unrelated existing dirty files remain untouched.

- [ ] **Step 2: Run the complete unit suite**

Run:

```powershell
npm test
```

Expected: all tests pass; do not report skipped or unavailable metrics as zero.

- [ ] **Step 3: Run static checks**

Run:

```powershell
npm run lint
npx tsc --noEmit
```

Expected: both exit 0. Record existing lint warnings separately from new warnings.

- [ ] **Step 4: Build production output**

Run the repository's established database-backed release build workflow. At minimum:

```powershell
npm run build
```

Expected: exit 0. If the build requires the established isolated PostgreSQL release-test service, use that workflow without exposing credentials and cleanly stop it afterward.

- [ ] **Step 5: Run Playwright release surfaces**

Run the existing production/local release specs for homepage, collections, pearl hub, active guides, held guides, sitemap, and robots.

Expected: active routes 200, held routes 404, and no regression on existing care, freshwater, and how-to-wear routes.

- [ ] **Step 6: Produce measured release evidence**

Record these exact fields:

```text
deployed_sha
deployed_at
production_url
sitemap_url_count
http_200_count
indexable_count
canonical_correct_count
legacy_brand_title_count
lastmod_count
unit_test_result
lint_result
typecheck_result
build_result
playwright_result
search_console_discovered_not_indexed=not_available
search_console_indexed=not_available
```

Search Console values remain `not_available` unless read from current authenticated evidence. The primary agent will generate the final before/after visual report and handle any production-promotion confirmation required by the browser workflow.
