# Maverenne SEO Foundation Design

**Date:** 2026-08-23

**Status:** Approved direction (方案 A), pending written-spec review

**Production domain:** `https://www.maverenne.com`

## Objective

Improve Maverenne's crawl and indexing signals without asking the owner to submit dozens of URLs manually. This release will remove legacy public-brand metadata, make the canonical production host safe by default, add truthful sitemap freshness signals, strengthen product-page metadata, and add regression tests for every changed SEO contract.

The work is a technical and on-page SEO foundation pass. It does not promise that Google will index every eligible URL, and it will not generate artificial freshness dates, doorway pages, or unsupported product claims.

## Baseline Evidence

The production crawl on 2026-08-23 found:

- 91 sitemap URLs; all 91 returned HTTP 200.
- All 91 pages emitted `index, follow`.
- All 91 pages emitted a self-canonical on `www.maverenne.com`.
- The sitemap contained no Vercel-domain URLs.
- 75 of 91 sitemap-page titles still contained the retired `MythRealms` name.
- The sitemap contained 91 `changefreq` values and 91 `priority` values, but no `lastmod` values.
- The catalog contributes 63 of the 91 sitemap URLs, closely matching the 68 URLs reported as “Discovered – currently not indexed” in Search Console.
- The focused SEO test baseline passed 51 of 51 tests.

## Success Criteria

After deployment:

1. Every URL in the production sitemap returns 200, remains indexable, and has a self-canonical on `https://www.maverenne.com`.
2. No indexable sitemap page title, description, visible publisher label, or first-party structured-data identity exposes `MythRealms`.
3. `DEFAULT_SITE_URL` is the canonical production domain, so missing environment configuration cannot emit a Vercel canonical.
4. Sitemap entries omit ignored `changefreq` and `priority` fields and include a truthful, stable `lastModified` only where a real significant-change date is known.
5. Product metadata uses Maverenne and is derived only from verified catalog fields.
6. Held pearl purchase guides remain 404 and absent from the hub and sitemap.
7. Automated tests fail if a public indexable SEO surface reintroduces the retired brand, a non-production canonical, a rolling freshness timestamp, or unsupported product claims.

## Scope

### 1. Canonical identity and host

Use the existing `BRAND` and `SITE_NAME` definitions as the only public brand source. Change the fallback site URL to `https://www.maverenne.com`. Preserve environment-variable override support for controlled preview and test environments.

Public indexable surfaces in scope include products, collections, journal pages, FAQ, size guide, pearl discovery pages, editorial edits, and the guardian quiz. Utility pages intentionally marked `noindex` are not part of the crawl/index KPI, though customer-facing copy may be corrected when it shares the same metadata helper.

### 2. Public metadata remediation

Replace retired-brand title and description text on indexable pages with Maverenne. Prefer importing `SITE_NAME` or `BRAND.name` over scattering new string literals. Keep existing page-specific search intent and do not force a single generic title across all routes.

For product pages, introduce a small pure metadata builder that composes:

- a page-specific title containing the product name, verified product type, and Maverenne;
- a concise description derived from existing catalog copy;
- the existing self-canonical and social-image URLs;
- `noindex` only for the not-found branch.

The builder must not infer materials, certifications, availability, shipping promises, or health/spiritual effects.

### 3. Sitemap freshness contract

Remove `changeFrequency` and `priority` because Google ignores them. Preserve database-backed `updatedAt` values for published journal posts.

Static and catalog-backed routes may receive a stable release-date value only when this release significantly changes their metadata, structured data, visible content, or internal links. The date must be a declared constant or supplied value, never `new Date()` at request/build time. Routes without a defensible significant-change date omit `lastModified`.

This release will not split the 91-URL sitemap; the current size is far below sitemap limits, and splitting would add operational complexity without improving discovery.

### 4. Crawl-demand and internal-link reinforcement

Preserve the current crawlable hierarchy:

`Home → collection / pearl hub → guide or product`

Add or adjust contextual links only where an existing page has a clear relationship to the target. The initial pass prioritizes the new-arrivals collection, pearl hub, three active buying guides, and relevant product-type collections. It will not add site-wide exact-match anchor spam or expose the three held guides.

### 5. Measurement and owner workflow

The automated release evidence will record crawl results as counts, not invented scores:

- sitemap URL count;
- HTTP 200 count;
- indexable count;
- canonical-correct count;
- legacy-brand-title count;
- sitemap `lastmod` count;
- schema types on representative product and guide pages.

Search Console remains the source for discovered, crawled, and indexed counts. The owner submits `https://www.maverenne.com/sitemap.xml` once after release or waits for Google's normal refresh. Individual inspection requests are reserved for a small set of high-value entry pages; the owner is not asked to submit all product URLs.

## Data Flow

1. Brand and canonical helpers provide trusted identity and host values.
2. Route metadata functions consume those helpers plus verified route/catalog data.
3. The sitemap builder consumes route registries, the catalog, and database post timestamps.
4. Unit tests validate source-level SEO contracts and sitemap output.
5. A production smoke crawl validates the deployed HTML, headers, canonical links, robots directives, and schema.
6. Search Console observes the submitted sitemap and Google's later crawl/index decisions.

## Failure Handling and Rollback

- If a metadata builder lacks a product, it returns the existing not-found, noindex behavior.
- If database-backed blog retrieval fails during a production build or request, existing application error handling remains authoritative; this change will not silently manufacture sitemap entries.
- If production smoke detects non-200 sitemap URLs, noindex on intended public pages, incorrect canonicals, or held-guide exposure, do not treat the release as successful.
- Deployment rollback follows the repository's established production rollback procedure. Search Console submission is not repeated until the corrected production sitemap is live.

## Verification

Before release:

- focused tests for brand identity, sitemap output, catalog SEO, structured data, pearl guides, and held-guide gates;
- lint and TypeScript checks;
- production build;
- existing release-surface Playwright checks where the environment supports them.

After release:

- fetch the complete sitemap as Googlebot;
- crawl every sitemap URL with bounded concurrency;
- verify status, robots metadata, canonical, title brand, and representative schemas;
- verify `/robots.txt`, `/sitemap.xml`, the homepage, collections, pearl hub, active guides, held guides, and representative products;
- publish a before/after visual report using measured values, writing `not_available` when Search Console metrics are not available rather than substituting zero.

## Non-Goals

- Guaranteeing Google indexing or ranking.
- Manually requesting indexing for all 68 discovered URLs.
- Publishing the three held pearl guides.
- Creating large volumes of new SEO pages in this release.
- Changing checkout, authentication, order, or video-production behavior.
- Renaming purely internal historical identifiers where they cannot affect public SEO.
