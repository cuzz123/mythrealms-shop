# Task 3 report — Maverenne signature homepage

## Status

Completed the assigned homepage composition in the Task 3 file set. The page now exposes the required eight semantic section markers in order, retains one route-level H1, and adds the asymmetric editorial diptych using approved local media.

## Files

- `src/app/page.tsx`
- `src/components/home/HomepageHero.tsx`
- `src/components/home/EditorialDiptych.tsx`
- `src/components/home/HomepageCategoryStories.tsx`
- `src/components/home/HomepagePearlEdit.tsx`
- `src/components/home/HomepageGiftSets.tsx`
- `src/components/home/HomepageEditorialStory.tsx`
- `src/lib/homepage-editorial.ts`
- `tests/homepage-editorial.test.ts`
- `tests/signature-homepage.test.tsx`
- `e2e/release-surfaces.spec.ts`

## Verification

### RED

No recoverable RED command output was present when this task was taken over. The inherited changes and new composition test were already in the worktree, so no failing-test result is claimed.

### GREEN

Ran:

```powershell
node --import tsx --test tests/homepage-editorial.test.ts tests/signature-homepage.test.tsx tests/storefront-navigation.test.ts
```

Result: 14 passed, 0 failed.

Ran:

```powershell
pnpm exec eslint src/app/page.tsx src/components/home src/lib/homepage-editorial.ts tests/signature-homepage.test.tsx
```

Result: exit 0.

Ran:

```powershell
git diff --check
```

Result: exit 0.

## Self-review

- Marker order is `homepage-signature-hero`, `homepage-category-index`, `homepage-editorial-diptych`, `homepage-primary-edit`, `homepage-story-band`, `homepage-editorial-links`, `homepage-secondary-edit`, and `homepage-newsletter-letter`.
- The homepage renders exactly one H1. The client-owned hero retains manual controls, the reduced-motion interval guard, and preloads only slide zero.
- The diptych reads primary image, text, detail image, then link on mobile; desktop uses a 58/42 grid.
- Existing product selectors and previously approved destinations remain unchanged. The Task 3 addition does not add product, price, inventory, promotion, policy, metadata, analytics, or URL claims.
- E2E contracts cover the semantic markers, single H1, horizontal overflow, and reduced-motion stability without changing snapshots.

## Concerns

- No prior RED evidence was available from the inherited worktree; this report records that gap rather than reconstructing it.
- The required browser E2E suite was updated as a source contract but was not run in this takeover; the focused unit/navigation suite, scoped lint, and diff integrity check were run.

## Fix round 1/5 — test-contract hardening

### Scope

Test-only changes were made to `tests/signature-homepage.test.tsx`, `tests/homepage-editorial.test.ts`, and `e2e/release-surfaces.spec.ts`. No production implementation change was needed.

### RED

The strengthened unit source contracts passed immediately against the existing implementation, so no implementation RED result exists for this round. The first focused browser run exposed two errors in the newly written mobile DOM assertion and interval probe filtering; those were corrected in the tests before the clean rerun below. They did not identify a homepage implementation defect.

### Added coverage

- The server-rendered page still proves marker order, one H1, and one diptych.
- The client-only hero source contract now requires the exact `preload={index === 0}` mapping inside the slide image loop, and requires each manual control to map `slide` and `index` to `setActiveSlide(index)`, its `Show ${slide.eyebrow}` label, and `aria-current` state.
- Editorial data locks the diptych to `HOMEPAGE_MEDIA.everyday`, `HOMEPAGE_MEDIA.courtyard`, and `/collections/new-arrivals`; approved moment routes are explicitly retained.
- Browser coverage asserts the diptych destination, complete mobile marker DOM/visual order, and the diptych mobile child order of primary image, text, detail image, then action.
- The reduced-motion browser contract wraps `setInterval` before the app loads and verifies no 7000ms carousel interval is registered. The installed Playwright typings did not expose a deterministic clock API, so this init-time probe avoids an eight-second wait while failing if the guard is removed.

### Verification

```powershell
npx playwright test e2e/release-surfaces.spec.ts --grep "homepage (renders the Maverenne signature|keeps its marker sequence|hero does not register|moment route definitions)" --project=chromium
```

Result: 4 passed.

```powershell
node --import tsx --test tests/homepage-editorial.test.ts tests/signature-homepage.test.tsx tests/storefront-navigation.test.ts
```

Result: 16 passed, 0 failed.

```powershell
pnpm exec eslint src/app/page.tsx src/components/home src/lib/homepage-editorial.ts tests/signature-homepage.test.tsx tests/homepage-editorial.test.ts e2e/release-surfaces.spec.ts
git diff --check
```

Result: both exit 0.
