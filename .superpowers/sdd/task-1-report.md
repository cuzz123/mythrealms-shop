# Task 1 Report: Pearl Edit Registry and Discovery Contracts

## Status

Completed. The registry is the single source of truth for the four initial editorial pearl edits and their canonical routes.

## Delivered

- Added `src/lib/storefront/pearl-edits.ts` with the `PearlEdit` contract, `PEARL_EDITS`, edit lookup, strict product resolution, and deterministic complementary product selection.
- Configured the original edits: `everyday-light`, `dinner-by-the-water`, `a-gift-to-keep`, and `soft-gold-and-pearl`.
- Used existing editorial product hero assets and only slugs returned by the 45-SKU storefront catalog.
- Added `Pearl Stories` to Discover and `Pearl Symbolism` to the Learn footer group without adding a top-level menu.
- Added canonical edit routes to the shared sitemap builder and updated the application sitemap to reuse one catalog snapshot.
- Updated the existing sitemap expectation to derive edit paths from `PEARL_EDITS`, preventing duplicated route data.

## TDD Evidence

1. Added `tests/pearl-edits.test.ts` before the registry module existed.
2. Ran `node --import tsx --test tests/pearl-edits.test.ts` and observed the expected missing-module failure.
3. Implemented the minimum registry and integration code.
4. Ran the required focused command successfully:
   `node --import tsx --test tests/pearl-edits.test.ts tests/storefront-navigation.test.ts tests/seo-catalog.test.ts`
5. Ran the required full unit suite successfully:
   `npm run test:unit`

## Verification

- Focused tests: 28 passed, 0 failed.
- Full unit suite: 427 passed, 0 failed.
- Self-review confirmed each configured hero asset exists and every edit resolves exactly four approved storefront products.
- `npx tsc --noEmit` remains blocked by the pre-existing `tests/seo-catalog.test.ts:159` `OpenGraph` union error. The Task 1 registry type errors found during review were corrected; this remaining line is outside the staged Task 1 diff.

## Scope Notes

- Pre-existing untracked `.superpowers/sdd/progress.md` and `.superpowers/sdd/task-1-brief.md` were not changed or staged.
- No plan/spec files or unrelated user work were modified.

## Ordering Correction

The Task 1 registry was published in navigation and the sitemap before Task 2 created the `/edits/[slug]` pages. That made the canonical edit URLs crawler-facing 404s.

- Removed the Task 1 edit-route entries from `buildSitemapEntries` and restored the application sitemap call to its pre-registry form.
- Removed the Task 1 Discover and Learn navigation additions.
- Restored the existing sitemap expectation and added a regression assertion that unpublished `/edits/` URLs are absent.
- Reduced `tests/pearl-edits.test.ts` to direct registry, approved-SKU, missing-SKU, and deterministic-complement behavior only.

### Correction Verification

1. Changed the sitemap test to reject `/edits/` URLs and ran it against the prior implementation; it failed because those URLs were present.
2. Removed the premature public integrations.
3. Ran `node --import tsx --test tests/pearl-edits.test.ts tests/storefront-catalog.test.ts tests/seo-catalog.test.ts`: 30 passed, 0 failed.
4. Ran `npm run test:unit`: 425 passed, 0 failed.
