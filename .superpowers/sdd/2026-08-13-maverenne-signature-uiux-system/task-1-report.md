# Task 1 report: Maverenne signature presentation primitives

## Scope

- `src/app/globals.css`
- `src/components/editorial/SignatureHero.tsx`
- `src/components/editorial/SectionHeading.tsx`
- `src/components/editorial/EditorialInlineImage.tsx`
- `tests/signature-ui-components.test.tsx`

## TDD evidence

### RED

Command:

```powershell
node --import tsx --test tests/signature-ui-components.test.tsx
```

Result: failed as expected before implementation with `Error: Cannot find module '../src/components/editorial/EditorialInlineImage'`. The test runner reported one failed test file and zero passing tests.

### GREEN

Command:

```powershell
node --import tsx --test tests/signature-ui-components.test.tsx tests/editorial-components.test.ts
```

Result: passed with 9 tests, 9 passes, and 0 failures. The new component contract tests cover one semantic H1, a decorative `indexLabel`, hero `sizes="100vw"`, and a lazy in-flow inline image with no link, button, or caption wrapper.

## Implementation

- Added global content, spacing, and signature-rule tokens plus the requested reduced-motion `.signature-motion` rule.
- Added `SignatureHero` as a Server Component with an explicit responsive aspect-ratio-bearing, positioned hero-image parent and `next/image` `fill`; it supports base through large responsive object positions, optional index label, and explicit link actions only.
- Added `SectionHeading` as a semantic reusable section header.
- Added `EditorialInlineImage` as a non-interactive in-flow `next/image` with explicit intrinsic width, height, sizes, and lazy loading.

## Verification

```powershell
pnpm exec eslint src/components/editorial/SignatureHero.tsx src/components/editorial/SectionHeading.tsx src/components/editorial/EditorialInlineImage.tsx tests/signature-ui-components.test.tsx
git diff --check
node --import tsx --test tests/signature-ui-components.test.tsx tests/editorial-components.test.ts
```

All commands completed successfully. The targeted test run reported 9 passes and 0 failures. `git diff --check` reported no whitespace errors. Git emitted a pre-existing line-ending notice for `src/app/globals.css`; it is informational and did not fail the check.

## Self-review

- No `"use client"` directive is present; the components remain static Server Components.
- Hero image geometry is stable through a positioned parent plus `fill`; the in-flow image has explicit dimensions.
- Only explicit action props use `Link`; the inline image accepts no `href`, caption, or CTA prop.
- Responsive focal positioning is presentation-only CSS data, with no business logic.
- The new motion class is disabled under reduced motion, and the existing global reduced-motion rule also suppresses nonessential transitions.

## Concerns

None. The implementation is local-only and does not alter product, policy, SEO, analytics, canonical, or release-state facts.
