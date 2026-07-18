# Task 5 Report

## Status

Implemented the MythRealms Story registry and rebuilt `/about` with the approved narrative, imagery, disclosure, metadata, and structured data. Added the requested `/story` page-level `permanentRedirect("/about")`, a matching pre-render permanent redirect for the raw 308 boundary, Story unit coverage, and focused release-surface browser coverage.

## RED / GREEN

### RED

- `npm run test:unit -- tests/story-page.test.ts` failed because `src/lib/editorial/story.ts` did not exist.
- `npx playwright test e2e/release-surfaces.spec.ts --grep "Story|about"` failed because `/about` still rendered the old H1 and `/story` returned 404.

### GREEN

- Focused unit: 4 passed, 0 failed.
- Focused Playwright with the pre-render redirect boundary present: 2 passed, 0 failed. This covered the Story H1, visible digitally-created disclosure, loaded images, 390x844 overflow, raw 308 response, `Location: /about`, and final `/about` URL.
- Targeted ESLint: passed.
- TypeScript: passed after making the optional editorial image position fallback explicit.
- Full unit: 337 passed, 0 failed.
- Production build: passed with the pre-render redirect configured; `/about` and the `/story` page fallback were emitted as static routes.

## Browser / Build Results

- The `/about` browser surface passed its loaded-image and no-horizontal-overflow checks at 390x844.
- The final production build completed with Next.js 16.2.6 and generated 139 static pages.
- Temporary development and production servers were stopped. Generated Task 5 `test-results` and server logs were removed.

## Files

- `src/lib/editorial/story.ts`
- `src/app/about/page.tsx`
- `src/app/story/page.tsx`
- `next.config.ts`
- `tests/story-page.test.ts`
- `e2e/release-surfaces.spec.ts`
- `.superpowers/sdd/task-5-report.md`

## Commit

- Branch: `codex/mediterranean-editorial-storefront`
- Message: `feat: rebuild the MythRealms Story`
- No push or deployment performed.

## Redirect Boundary

The shared root loading boundary commits a streamed 200 response before the leaf `permanentRedirect` is processed. The `next.config.ts` permanent redirect therefore runs before rendering and guarantees the binding raw 308 response with `Location: /about`. `src/app/story/page.tsx` retains the brief's route-level `permanentRedirect("/about")` as the route fallback. Both are necessary in this application shell: the config owns the HTTP status boundary, while the page preserves the route convention and prevents duplicate Story content if that boundary is bypassed.

## Review Fix: Truthful Story Media

### RED

`npm run test:unit -- tests/story-page.test.ts tests/homepage-editorial.test.ts` passed 5 tests and failed 3 before the production edits:

- Shared hero media still described the shell-and-pearl earring image as Mediterranean sunlight.
- The Story hero still used that studio image instead of the Mediterranean on-model image.
- About social metadata still inherited the old image and inaccurate alt.

### Changes

- Story hero, Open Graph, and Twitter now share the Mediterranean on-model `model-short-bob-blue-linen.png` asset, its accurate alt, and the established `center 38%` crop.
- Editorial Styling now uses the distinct on-model shell-and-pearl drop earring image in warm studio light.
- Product Reference remains the source-supplied `pearl-series-13-main.webp` SKU image.
- Corrected the shared necklace, bracelet, and eyewear descriptions to identify their actual display contexts.
- Locked exact canonical/social metadata and exact AboutPage/Breadcrumb schema names and URLs.
- Broadened prohibited-claim coverage while explicitly permitting the approved statement that unconfirmed material, sourcing, and certification claims are not added.

### GREEN

- Focused Story/media unit tests: 8 passed, 0 failed.
- Affected Story, homepage media, editorial component, and landing-page tests: 21 passed, 0 failed.
- Stale inaccurate-alt search: no matches.
- Targeted ESLint: passed.
- TypeScript: passed.
- Focused Story/about Playwright: 2 passed, 0 failed, including loaded images, disclosure, 390x844 overflow, and raw 308 redirect behavior.
- Full unit suite: 339 passed, 0 failed.
- Build was not rerun because page structure, metadata typing, and redirect configuration were unchanged; exact metadata tests, TypeScript, and focused browser redirect coverage passed.

### Redirect Clarification

The config redirect is required to produce the raw HTTP 308 before the shared streaming boundary commits a response. The page-level `permanentRedirect("/about")` is retained as the brief-mandated route fallback and convention; it does not also execute during normal requests handled by the config redirect.

### Commit

- Message: `fix: correct Story editorial media roles`
