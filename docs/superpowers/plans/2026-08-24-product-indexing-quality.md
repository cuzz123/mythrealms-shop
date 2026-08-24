# Product Indexing Quality Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the indexable value of all 43 New Series product pages and add truthful merchant shipping and return data to Product offers without inventing reviews, ratings, materials, or identifiers.

**Architecture:** Keep the existing storefront catalog and Product page flow. Replace the shared New Series description template with explicit per-product copy based only on visually verifiable product traits and non-factual styling guidance. Extend the existing centralized schema builder to derive Offer shipping and return objects from `STORE_POLICY_FACTS`, then pass those verified facts through `ProductJsonLd`.

**Tech Stack:** Next.js 16, React 19, TypeScript, Node test runner, Playwright.

**Spec:** Approved in the 2026-08-24 user conversation: prioritize independent product content, add verified shipping/return schema, and never fabricate reviews or aggregate ratings.

## Global Constraints

- Do not add `review` or `aggregateRating` until genuine, page-visible customer data exists.
- Do not claim materials, dimensions, weight, pearl type, plating, certifications, origin, SKU, GTIN, or MPN unless already verified in repository data.
- Product copy must be unique, natural English and describe only visible form, color, silhouette, arrangement, or styling use; avoid unsupported quality and durability claims.
- Preserve all 63 active product URLs, prices, images, availability, canonicals, and category membership.
- Use only the verified US policy facts in `src/lib/storefront/policies.ts`.
- Do not touch, stage, commit, or delete director-card, Obsidian, generated media, or `tmp/` changes already present in the worktree.
- Read relevant Next.js 16 documentation in `node_modules/next/dist/docs/` before changing application code.

---

### Task 1: Independent New Series product copy

**Files:**
- Modify: `src/lib/new-series-products.ts`
- Modify: `tests/storefront-catalog.test.ts`

- [ ] Add failing catalog tests proving all 43 New Series descriptions are explicit, unique, substantial, and free of the old shared source-photo disclaimer.
- [ ] Run the focused test and record the expected failure.
- [ ] Make description a required input for every New Series product and write distinct copy for all 43 products.
- [ ] Ensure copy contains no unverified material, dimension, origin, certification, durability, or manufacturing claims.
- [ ] Run focused catalog tests and `git diff --check`.
- [ ] Review the full diff for product-to-description mismatches.

### Task 2: Verified Product Offer policies

**Files:**
- Modify: `src/lib/seo/schema.ts`
- Modify: `src/components/ui/JsonLd.tsx`
- Modify: `src/app/products/[slug]/1688-product.tsx`
- Modify: `tests/structured-data.test.ts`
- Modify if necessary: `tests/storefront-policies.test.ts`

- [ ] Add failing tests for Google-compatible `shippingDetails` and `hasMerchantReturnPolicy` derived from `STORE_POLICY_FACTS`.
- [ ] Run focused structured-data tests and record the expected failure.
- [ ] Extend `ProductSchemaInput`, `buildProductSchema`, and `ProductJsonLd` with verified policy facts.
- [ ] Emit US `OfferShippingDetails` with the current standard shipping rate and verified handling/transit windows.
- [ ] Emit the existing verified MerchantReturnPolicy under the Offer.
- [ ] Pass `STORE_POLICY_FACTS` from the product page; do not add ratings or reviews.
- [ ] Run focused structured-data and storefront-policy tests plus `git diff --check`.

### Task 3: Integration verification and production release

**Files:**
- Modify only if a verified defect is found in release-owned paths.

- [ ] Run all unit tests, lint, typecheck, and a fresh production build.
- [ ] Run relevant Product/SEO Playwright tests and the complete Playwright suite if the isolated database prerequisites are available.
- [ ] Audit production-candidate HTML for all 63 product URLs: 200, indexable, self-canonical, unique metadata, unique New Series descriptions, Product Offer shipping and return data, and zero review/rating fabrication.
- [ ] Review the exact release diff and commit only release-owned files.
- [ ] Push the candidate to remote `main` without force and wait for Vercel Production Ready.
- [ ] Smoke-test `https://www.maverenne.com`, representative products, sitemap, robots, canonical, and Product JSON-LD.
- [ ] Record unavailable Search Console counts as `not_available`, never `0`.
