# Traffic and Conversion First Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a locally verified release candidate for three high-intent SEO pages, restore the build prerequisite needed to ship it, and establish an evidence-only measurement readiness record.

**Architecture:** Keep public routes and the current MythRealms identity stable while name clearance is false. Reuse the existing guide data/layout and JSON-LD components; change only evidence-backed editorial fields and links. Treat Prisma as a release prerequisite, not a growth feature, and keep external-account validation separate from local code evidence.

**Tech Stack:** Next.js 16.2.6 App Router, TypeScript, Node test runner, Prisma 5.22, Markdown operating records.

## Global Constraints

- Do not deploy, publish, buy, contact third parties, write external accounts, or change product state.
- Keep `name_clearance_passed=false`; do not expose Maverenne in customer-visible code.
- Do not infer SKU material, pearl type, treatment, dimensions, stock, price, fulfillment, return eligibility, or performance from general educational sources.
- Read relevant guidance in `node_modules/next/dist/docs/` before changing Next.js metadata or routes.
- Production-code behavior changes require a failing test first and fresh verification after implementation.

---

### Task 1: Restore the local Prisma release prerequisite

**Files:**
- Modify only if evidence requires it: `docs/company/maverenne-build-runtime-compatibility-followup.md`
- Do not modify `prisma/schema.prisma`, application code, or dependency versions.

**Interfaces:**
- Consumes: `package-lock.json`, Prisma generator targets, bundled Node 24 runtime.
- Produces: a resolvable generated `@prisma/client` in the local workspace or a bounded, reproducible blocker report.

- [ ] **Step 1:** Record current `@prisma/client` resolution and engine-file state.
- [ ] **Step 2:** Run `npm ci --ignore-scripts` using bundled Node 24 and record exit code/time.
- [ ] **Step 3:** Run Prisma generation with a bounded process-tree-safe method; record target downloads, time, exit code, and cleanup.
- [ ] **Step 4:** If generation exits 0, verify `require.resolve('@prisma/client')`; otherwise stop without changing schema or versions.
- [ ] **Step 5:** Only after resolution succeeds, run the targeted unit suite, lint, and clean build in that order; record actual results.

### Task 2: Implement the three evidence-backed high-intent pages

**Files:**
- Modify: `src/lib/editorial/guides.ts`
- Modify: `src/app/pearls/how-to-wear/page.tsx`
- Modify: `src/app/pearls/care/page.tsx`
- Modify: `src/app/gifts/page.tsx`
- Test: existing SEO, editorial, navigation, and policy tests; add one focused test only where current coverage cannot detect the intended copy/link boundary.

**Interfaces:**
- Consumes: `docs/company/maverenne-seo-draft-pack-01.md`, `maverenne-seo-draft-pack-02.md`, and `maverenne-seo-source-evidence.md`.
- Produces: existing routes `/pearls/how-to-wear`, `/pearls/care`, and `/gifts` with brand-stable metadata, direct answers, FAQ/internal links, and no unverified commercial claims.

- [ ] **Step 1:** Write or identify a test that fails on the current unsafe/outdated copy or missing evidence boundary.
- [ ] **Step 2:** Run the focused test and confirm the expected failure.
- [ ] **Step 3:** Apply the smallest evidence-backed copy and internal-link changes; preserve route paths, layouts, current public brand, and shopping behavior.
- [ ] **Step 4:** Run the focused test, SEO/catalog/policy unit tests, and `git diff --check`.
- [ ] **Step 5:** Do not mark pages publishable unless build verification also succeeds; otherwise label the result a local release candidate only.

### Task 3: Measurement readiness and launch evidence

**Files:**
- Modify: `docs/company/metrics.md`
- Modify: `docs/company/growth-readiness.md`
- Modify: `docs/company/operations-queue.md`

**Interfaces:**
- Consumes: current analytics code/tests and existing Pinterest/Search Console/GA4 evidence.
- Produces: a single table separating local implementation, production deployment, external receipt, report readability, baseline data, and decision eligibility.

- [ ] **Step 1:** Audit the current source/tests for `view_item`, `add_to_cart`, `begin_checkout`, `purchase`, consent, sitemap, and verification metadata.
- [ ] **Step 2:** Record only observed local/production evidence; external values without proof remain `待确认`.
- [ ] **Step 3:** Define the minimum Day 0 fields for Search Console, Pinterest outbound clicks, GA4 engaged product visits, and permanent exclusion of test orders.
- [ ] **Step 4:** Verify document consistency and confirm no external account action, deployment, publishing, or product-state change occurred.

