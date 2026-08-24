# Maverenne Release Stability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the current approved Maverenne storefront pass all 64 Playwright tests, preserve the SEO production-host contract, commit only release-owned files, and deploy the verified candidate to production.

**Architecture:** Keep the current direct-link Maverenne navigation, sparse About page, concise Gifts page, first-three Pearl purchase-guide gate, and globally unmounted first-order invitation. Repair the confirmed small-mobile hero geometry and sticky-purchase visibility defects; align stale E2E contracts and visual golds to the already-approved UI rather than restoring retired features.

**Tech Stack:** Next.js 16.2.6 App Router, React 19, Tailwind CSS 4, Playwright 1.61.1, Node test runner, PostgreSQL 16, Vercel.

**Spec:** `.superpowers/sdd/2026-08-24-release-surface-stability/full-playwright-classification.md`, `.superpowers/sdd/2026-08-24-release-surface-stability/core-flows-root-cause.md`, and `.superpowers/sdd/2026-08-24-release-surface-stability/secondary-failures-root-cause.md`.

## Global Constraints

- Production identity and canonical host remain `Maverenne` and `https://www.maverenne.com`.
- `HEADER_MENUS` remains empty; desktop and mobile navigation use the approved direct `HEADER_LINKS` model.
- Do not restore `Find Your Guardian` to public chrome and do not remount `FirstOrderInvitation` globally.
- The founder-approved active Pearl purchase guides remain exactly the first three; held guides remain 404 and absent from hub/sitemap.
- Never use a production database for tests. Use a resettable loopback-only PostgreSQL 16 database with process-only credentials.
- Do not print credentials or environment-variable values.
- The dirty director-card, first-frame, Obsidian, media, and tmp files are user-owned and must not be edited, staged, committed, removed, or reverted.
- Implementers do not commit. The controller creates one explicit release commit after final review because the shared worktree contains unrelated staged and unstaged files.
- Read relevant Next.js 16 local documentation under `node_modules/next/dist/docs/` before changing Next/React production code.

---

### Task 1: Align current UI behavior contracts and repair 320px hero clipping

**Files:**
- Modify: `e2e/core-flows.spec.ts`
- Modify: `e2e/pearl-growth-funnel.spec.ts`
- Modify: `e2e/release-surfaces.spec.ts`
- Modify: `tests/storefront-trust.test.ts`
- Modify: `tests/storefront-catalog.test.ts`
- Modify: `src/components/home/HomepageHero.tsx`
- Modify: `src/components/storefront/StickyAddToCart.tsx`

**Interfaces:**
- Consumes: `BRAND`, `HEADER_LINKS`, `HOMEPAGE_CATEGORY_LINKS`, `DEFAULT_SITE_URL`.
- Produces: a hero that contains all approved copy and both CTAs inside the visible hero at 320x800 and 390x844; a mobile sticky purchase control that waits until the primary control has been encountered or passed; E2E contracts for the current direct-link navigation and production canonical.

- [ ] **Step 1: Update the E2E expectations to the approved current contract without changing production code**

In `e2e/core-flows.spec.ts`:

- Import `BRAND`, `HEADER_LINKS`, and `HOMEPAGE_CATEGORY_LINKS`.
- Make `expectHeroContentWithinVisibleBounds` locate `BRAND.heroTitle`, `BRAND.heroDescription`, `BRAND.primaryCta.label`, `BRAND.secondaryCta.label`, and the current eyebrow.
- Scope category assertions to `section[aria-labelledby="pearl-edit-categories-title"]` and assert every `HOMEPAGE_CATEGORY_LINKS` href.
- Replace removed Shop/Gifts/Discover menu flows with current direct-link header href and keyboard-focus coverage over `HEADER_LINKS`.
- Make the mobile last-link journey use `HEADER_LINKS.at(-1)` and assert the current `/about` route.
- Require search controls to be at least 44x44 rather than exactly 40x40.
- Remove the retired `Find Your Guardian` footer expectation and explicitly assert it is absent.
- Keep all overlay-to-solid header, reveal/reduced-motion, no-JavaScript visibility, dialog focus restoration, horizontal overflow, image readiness, and real-navigation assertions.

In `e2e/pearl-growth-funnel.spec.ts`, replace the removed automatic invitation close-flow with a negative route-level contract: after an engaged homepage visit and accelerated former delay, no `notes from the coast` dialog is mounted.

In `e2e/release-surfaces.spec.ts`, build the Pearl Care expected canonical with `DEFAULT_SITE_URL`, not the loopback test-process `siteUrl`.

- [ ] **Step 2: Run the updated core and secondary tests to verify the correct RED boundary**

Run the affected tests against an isolated production server before changing `HomepageHero.tsx`.

Expected:

- Current-copy, navigation, invitation-negative, and production-canonical assertions pass.
- `homepage fits a 320px viewport` fails because the approved eyebrow/heading are clipped outside the visible hero.
- The 390px viewport passes.

- [ ] **Step 3: Add a source-level regression contract for the small-mobile hero height**

In `tests/storefront-trust.test.ts`, extend the existing hero geometry test to require `min-h-[30rem]` together with the existing `aspect-[4/5]`, desktop `lg:aspect-[21/10]`, and object-position contracts.

Run:

```text
node --import tsx --test tests/storefront-trust.test.ts
```

Expected before the production change: FAIL because `min-h-[30rem]` is absent.

- [ ] **Step 4: Implement the minimal production fix**

In `HomepageHero.tsx`, add `min-h-[30rem]` and `w-full` to the hero section's base classes. Preserve `aspect-[4/5]`, `sm:aspect-[3/2]`, `lg:aspect-[21/10]`, all copy, CTA destinations, slide behavior, image crop, and desktop first-viewport behavior. `w-full` prevents the minimum height plus 4:5 aspect ratio from back-solving a 384px width inside a 320px viewport.

At 320px, the aspect height is 400px and the 480px minimum supplies the measured 80px needed to move the clipped eyebrow from approximately y=-21 into the visible hero. At 390px the existing 487.5px aspect height remains larger than the minimum.

In `StickyAddToCart.tsx`, require the primary purchase control to have intersected the viewport or passed above it before the mobile sticky action can render. Add pure-function coverage in `tests/storefront-catalog.test.ts` for initial-below-viewport, intersecting, and fast-scroll-past states.

- [ ] **Step 5: Verify Task 1 green**

Run the full affected E2E files in one isolated lifecycle, then run each formerly failing exact test a second time with `workers=1,retries=0`.

Also run:

```text
node --import tsx --test tests/storefront-trust.test.ts tests/homepage-growth.test.ts tests/seo-catalog.test.ts tests/traffic-conversion-pages.test.ts
npx eslint src/components/home/HomepageHero.tsx e2e/core-flows.spec.ts e2e/pearl-growth-funnel.spec.ts e2e/release-surfaces.spec.ts tests/storefront-trust.test.ts
npx tsc --noEmit
git diff --check -- src/components/home/HomepageHero.tsx e2e/core-flows.spec.ts e2e/pearl-growth-funnel.spec.ts e2e/release-surfaces.spec.ts tests/storefront-trust.test.ts
```

Expected: all commands exit 0; no Playwright retry or skip.

---

### Task 2: Refresh and review the four approved editorial visual baselines

**Files:**
- Modify: `e2e/editorial-visuals.spec.ts-snapshots/homepage-chromium-win32.png`
- Modify: `e2e/editorial-visuals.spec.ts-snapshots/story-chromium-win32.png`
- Modify: `e2e/editorial-visuals.spec.ts-snapshots/pearls-hub-chromium-win32.png`
- Modify: `e2e/editorial-visuals.spec.ts-snapshots/gifts-mobile-chromium-win32.png`

**Interfaces:**
- Consumes: Task 1's final hero geometry and the approved current Homepage, sparse About, Pearl hub with three purchase guides, and concise Gifts surfaces.
- Produces: Windows/Chromium gold images matching those approved current pages.

- [ ] **Step 1: Verify the four existing golds are RED against the current pages**

Run `e2e/editorial-visuals.spec.ts` without snapshot updates in an isolated production lifecycle.

Expected: the four screenshot assertions fail against the obsolete page shapes described in the root-cause report.

- [ ] **Step 2: Generate only the four replacement golds**

Run:

```text
npx playwright test e2e/editorial-visuals.spec.ts --project=chromium --workers=1 --retries=0 --update-snapshots
```

Do not change the visual-test source or its stabilization behavior.

- [ ] **Step 3: Perform visual review before accepting the golds**

Inspect all four PNGs. Confirm:

- Homepage: current Maverenne hero and eight-section sequence, no Guardian surface, no clipping at the captured desktop viewport.
- Story/About: sparse factual page, no retired image-rich story or invented founder content.
- Pearl hub: exactly the approved purchase-guide discovery section; held guides absent.
- Mobile Gifts: concise checklist/FAQ/help page, no fabricated product availability or policy promises, no horizontal clipping.

Reject and diagnose any blank, partially lazy-loaded, duplicated, clipped, or consent-obscured gold.

- [ ] **Step 4: Verify snapshot determinism**

Run the same visual spec again without `--update-snapshots` twice.

Expected: 6/6 tests pass in both runs with `workers=1,retries=0`.

---

### Task 3: Final release gate, review, explicit commit, push, and production deployment

**Files:**
- Modify only if evidence requires: release-owned files from Tasks 1 and 2.
- Create commit from an explicit path list; never stage unrelated dirty files.

**Interfaces:**
- Consumes: reviewed Task 1 code/tests and Task 2 golds.
- Produces: a single candidate SHA deployed to `https://www.maverenne.com` with release evidence.

- [ ] **Step 1: Run the complete local release gate from fresh inputs**

Use one fresh loopback-only PostgreSQL 16 database and run reset/seed/fresh build. Then run:

```text
npm run test:unit
npm run lint
npx tsc --noEmit
npx playwright test --project=chromium --workers=1 --retries=0
git diff --check
```

Expected: unit 538/538 or higher, lint 0 errors, TypeScript exit 0, Playwright 64/64 or higher, no skips, build exit 0. Record warning counts truthfully and use `not_available`, never zero, when a metric is unavailable.

- [ ] **Step 2: Run independent whole-candidate review**

Review the exact diff from `71f3c62690d6e3b49913b175b3ceeaa3a7f4be03` through the working candidate. Resolve all Critical/Important findings and re-run covering tests.

- [ ] **Step 3: Create a release branch and explicit commit**

Create branch `codex/maverenne-seo-ui-release-20260824` from the detached candidate. Stage only:

- `docs/superpowers/plans/2026-08-24-maverenne-release-stability.md`
- `src/components/home/HomepageHero.tsx`
- `src/components/storefront/StickyAddToCart.tsx`
- `e2e/core-flows.spec.ts`
- `e2e/pearl-growth-funnel.spec.ts`
- `e2e/release-surfaces.spec.ts`
- `tests/storefront-trust.test.ts`
- `tests/storefront-catalog.test.ts`
- the four reviewed snapshot PNGs

Verify `git diff --cached --name-only` contains exactly that list, then commit with message:

```text
fix: stabilize Maverenne release surfaces
```

- [ ] **Step 4: Reconcile and push the verified candidate**

Fetch `origin/main`, prove the candidate is a safe descendant or reconcile without dropping either side, then push the exact verified candidate to `origin/main`. Do not force-push.

- [ ] **Step 5: Promote the resulting Vercel deployment to production**

Wait for the GitHub/Vercel deployment to reach Ready. If it is staged and custom-domain assignment is skipped, use the authenticated Vercel console to Promote to Production. The user's current instruction explicitly authorizes commit and production deployment.

- [ ] **Step 6: Verify production and rollback if necessary**

On `https://www.maverenne.com`, verify:

- Homepage, `/pearls`, existing care/freshwater/how-to-wear routes, `/robots.txt`, and `/sitemap.xml` return healthy responses.
- The three active purchase guides return 200 with correct H1, self-canonical, Article, FAQPage, and BreadcrumbList.
- The three held guides remain 404 and absent from hub/sitemap.
- Homepage current hero/navigation and 320px layout are healthy.
- Hub and sitemap contain only the three active purchase guides.

If production verification fails, roll back to the pre-deployment production SHA recorded immediately before promotion, then repeat smoke verification.
