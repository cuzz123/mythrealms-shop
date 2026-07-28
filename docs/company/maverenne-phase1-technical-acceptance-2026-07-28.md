# Maverenne Phase 1 Technical Acceptance — 2026-07-28

## Scope and decision

This is a local, non-production acceptance record for `codex/maverenne-phase-1` at
`62b2521a7c77373c4dafa7906c89ab8bebeead78` (`test: close Maverenne phase one verification gaps`).
This record does not authorize deployment, DNS change, external-account action, production credential,
production database, merge, push, or release.

This record has two intentionally separate decisions:

1. **Phase 1 merge-readiness: conditional GO.** Phase 1's explicit public foundation scope has no remaining
   unremediated legacy brand/Guardian/unsupported-claim residue after the two small fixes recorded below.
   The integration branch must still run the normal local suite and review this uncommitted delta; this is
   not a merge action or a production authorization.
2. **Full brand/SEO production-release readiness: NO-GO.** The allowlisted Phase 2 public surfaces remain
   intentionally unconverted, the ten legacy routes lack external evidence, and complete
   generate/prerender still needs an isolated PostgreSQL fixture.

## Fixed revision and integration state

| Check | Result |
| --- | --- |
| Phase 1 worktree | Clean before this acceptance record; `HEAD` was exactly `62b2521a7c77373c4dafa7906c89ab8bebeead78`. |
| Branch containment | `git branch --all --contains 62b2521a` returned only `codex/maverenne-phase-1`. No local branch has integrated this commit. |
| Phase 2 relationship | `codex/maverenne-phase-2-task-1` does **not** contain Phase 1 (`merge-base --is-ancestor` exit `1`); its merge base is `87676984`. |
| Acceptance-delta caveat | This record and the two scoped Phase 1 public-brand fixes are reviewed together in one independent commit after the fixed-HEAD check. |

## Re-run evidence

The baseline commands ran on the fixed revision before this document was added. The focused Phase 1
fixes and the complete local suite below were then run against the current acceptance delta.

| Command | Result |
| --- | --- |
| `npm run test:unit` | Exit `0`; 480 passed, 0 failed (including the new Phase 1 public-brand regression). |
| `npx tsc --noEmit` | Exit `0`. |
| `npm run lint` | Exit `0`; 0 errors, 38 pre-existing warnings. |
| `npm run build -- --experimental-build-mode compile` | Exit `0`; Next.js 16.2.6 compiled successfully. Next explicitly reported that `generate` or `generate-env` is still required to finalize a full build. |
| `BASE_URL=http://127.0.0.1:3001 playwright test e2e/release-surfaces.spec.ts --project=chromium --grep 'public navigation|homepage preserves'` | Exit `0`; 2 passed against the current acceptance delta. The hidden local Next service returned HTTP 200 before the run. |

For the external-service browser run, the service was started with an ephemeral local `AUTH_SECRET`, bound
only to `127.0.0.1:3001`, and was not reused from another process. The command-line/parent-child checks
matched the Phase 1 worktree before cleanup. The process tree exited during targeted cleanup; final
post-cleanup verification found no listener on port 3001. No secret is recorded here.

## PostgreSQL boundary and database-free substitute

The schema declares `provider = "postgresql"` and `url = env("DATABASE_URL")`. `src/app/sitemap.ts`
directly awaits `db.blogPost.findMany()`. Therefore a SQLite replacement is not a valid verification of
the full Next `generate`/prerender path.

This machine has no usable local PostgreSQL fixture: `psql` and `docker` are absent, no PostgreSQL Windows
service was found, and the repository has no compose or local database fixture. No software was installed
and no `DATABASE_URL` was read or set.

The best available **database-free substitute** is already included in the passing unit suite:

- `tests/seo-catalog.test.ts` checks the canonical sitemap entry construction, uniqueness, catalog URL
  coverage, and that the sitemap retains `revalidate = 3600` plus the `db.blogPost.findMany` contract.
- `tests/pearl-growth-pages.test.ts` checks discovery URL inclusion and static metadata/schema contracts.
- compile-only build proves the route graph, including `/sitemap.xml`, type-checks and compiles.

This substitute does **not** prove a real database connection, blog query, generated sitemap XML, or full
prerender. It is insufficient to change the full-build result to GO.

### Minimal isolated PostgreSQL fixture runbook (not executed)

Use this only after a local-only PostgreSQL instance is supplied by the developer. Do not install it as
part of this release and do not copy a production URL, dump, user, or password.

1. Create a fresh local database named `maverenne_phase1_verify` on `127.0.0.1` with a throwaway local
   role. Before proceeding, use `psql` to assert both `inet_server_addr() = '127.0.0.1'` and
   `current_database() = 'maverenne_phase1_verify'`.
2. In a new terminal only, set `DATABASE_URL` to that local database and set a temporary `AUTH_SECRET`.
   Do not write either value to `.env` or source control.
3. Run `npx prisma db push`, then `npm run build` (without compile mode). Start the built app on an unused
   localhost port, request `/sitemap.xml`, and assert HTTP 200 plus XML content with no 4xx/noindex URL.
4. Stop only the recorded local server PID. Re-run the database-name and localhost assertions, then drop
   exactly `maverenne_phase1_verify`. Preserve only non-sensitive command exit codes and assertion output.

## Scope classification: public brand residue

`npm run brand:audit-routes` exited 0, but its CSV has `not_available` click and backlink evidence for all
10 reviewed routes. The tool correctly returns `keep` rather than inventing a redirect decision; it is not
a content-clearance audit.

### Phase 1 public foundation fixes

| File / route | Residue and customer-visible path | Phase | Action and test |
| --- | --- | --- | --- |
| `src/components/growth/FirstOrderInvitation.tsx` (global provider, including home) | Default newsletter dialog said “quiet notes from MythRealms” and its visible label was “MythRealms Notes”. | 1 — global customer communication/foundation surface. | Fixed to `BRAND.name`; `tests/homepage-growth.test.ts` proves default copy and visible label consume the shared brand. |
| `src/components/product/ProductCard.tsx` (home Pearl Edit/Gifts and catalog cards) | Primary product image alt said “MythRealms pearl jewelry”. | 1 — the Phase 1 home surface renders this shared card. No SKU, price, inventory, cart, or checkout behavior changed. | Fixed to `BRAND.name`; the same focused test asserts the shared-brand alt template. |

The focused test was first run red and failed on the old default invitation description, then passed 7/7
after the minimal implementation. A direct scan of the remaining Phase 1 plan files—layout, Header,
Footer, AnnouncementBar, CartDrawer, home sections, contact, policy pages, customer email/PayPal code,
root metadata/OG, and schema components—found no customer-visible MythRealms/Guardian or prohibited
promise. `src/lib/seo/blog.ts` retains a retired-language **filter**, and launch-readiness retains the
currently approved technical host; neither is customer-visible residue.

### Phase 2 release-blocker allowlist

The following items are public, intentionally **not** Phase 1 merge blockers, and must be completed before
a full brand/SEO production release. “Rewrite” means content/metadata in place; it does not authorize a
redirect.

| File / route | Residue | Customer-visible way | Phase and reason | Required action / test |
| --- | --- | --- | --- | --- |
| `src/app/guardian-quiz/page.tsx`, `quiz-client.tsx` / `/guardian-quiz` | MythRealms metadata; Guardian archetypes, symbolic-intention matching. | Title/description/OG and interactive quiz. | 2 Task 2; the plan explicitly defines audited retirement/noindex or evidence-backed redirect. | Keep CSV `not_available` decision; do not bulk redirect. Implement retirement behavior and `seo-catalog` + Playwright guardian/legacy tests only when Phase 2 starts. |
| `src/app/about/page.tsx` / `/about` | `siteName` and About schema name use MythRealms. | Metadata, OG, JSON-LD. | 2 Task 4 explicitly owns About entity expression. | Rewrite in place; test story/editorial schema output. |
| `src/app/blog/page.tsx`, `blog/[slug]/page.tsx` / `/blog`, `/blog/[slug]` | MythRealms titles/authors; legacy posts remain in the route-audit CSV. | Metadata, byline, article schema/content. | 2 Task 4 owns Journal; the separate route-audit task preserves search assets. | Keep all ten CSV paths as `keep/not_available`; rewrite only with approved editorial facts and add blog/schema tests. |
| `src/app/pearls/stories/page.tsx`, `pearls/symbolism/page.tsx` | MythRealms identity; prior Guardian/meaning language. | Page copy, metadata, internal links. | 2 Task 4 explicitly owns Pearl Guide/Stories/Symbolism. | Rewrite in place with cited general education; test guides, internal links, and no unsupported outcomes. |
| `src/app/collections/page.tsx`, `collections/[slug]/page.tsx` | MythRealms page metadata/alt text. | Collection title, description, OG and images. | 2 SEO/canonical release scope; not among Phase 1's listed global metadata files. | Rewrite page-level metadata in Phase 2; preserve collection/product paths and add canonical/schema tests. |
| `src/app/products/[slug]/page.tsx`, `products/[slug]/1688-product.tsx` / product routes | MythRealms product metadata, JSON-LD fallback, and visible product language. | Product title/metadata/schema and product page. | 2 Task 3 explicitly covers product JSON-LD/canonical sources. | Use `BRAND`/`siteUrl`; retain SKU, price, state, cart, and checkout behavior; test catalog count and product schema. |
| `src/app/edits/[slug]/page.tsx` / editorial routes | MythRealms title. | Editorial metadata. | 2 SEO/editorial metadata scope. | Rewrite in place and test canonical/ItemList output. |
| `src/app/faq/layout.tsx`, `faq/page.tsx` / `/faq` | MythRealms identity/contact and Guardian/intention prose. | Metadata and visible FAQ answers. | 2 content/SEO scope; Phase 1 policies are shipping/refund/privacy/terms, not FAQ. | Rewrite only verified policies; add FAQ metadata/content test. |
| `src/app/checkout/page.tsx`, `checkout/success/page.tsx` | Visible MythRealms name and delivery claim; internal `MythRealmsWindow` key. | Checkout copy/metadata; internal identifier is not visible. | 2 content pass; Phase 1 only authorized PayPal description and forbade checkout-logic changes. | Rewrite approved customer copy separately; do not change payment state/cart/checkout logic; test rendered copy. |
| `src/app/loyalty/page.tsx`, `search/page.tsx`, `size-guide/page.tsx`, `tiktok/page.tsx`, `referral/page.tsx`, `unsubscribe/page.tsx`, `not-found.tsx` | Legacy titles, labels, or campaign copy. | Public route content/metadata (several are noindex). | 2 utility/content/SEO scope, outside Phase 1 plan files. | Rewrite/noindex decision per route; add only route-specific metadata/content tests. |
| `src/app/llms.txt/route.ts`, `src/lib/storefront/feed.ts`, feed API routes | MythRealms machine-readable identity. | `llms.txt` and merchant/feed consumers. | 2 Task 3 explicitly owns machine-readable surfaces. | Align `BRAND`, canonical host, sitemap/feed and product count; test `seo-catalog` + `public-catalog`. |

### Non-public matches excluded from both release gates

- Analytics event names, client-storage keys, checkout window keys, and wishlist keys contain `mythrealms`
  but are implementation identifiers, not customer-facing copy. Do not rename them in a brand migration
  without a separate compatibility plan.
- `src/lib/1688-products.ts` is not a public catalog source under the existing public-catalog tests.
- Admin/automation/operations routes and test fixtures are not public website content. They are not a
  substitute for the Phase 2 public-surface audit.

## Separate readiness checklists

### Phase 1 merge-readiness

- [x] Fixed commit and clean baseline were recorded before this acceptance delta.
- [x] Unit, TypeScript, lint, compile-only, and external BASE_URL browser evidence passed on the fixed
      revision.
- [x] Phase 1 invitation and homepage-card residues are covered by a red-green regression test.
- [x] Re-run the relevant local test set and normal merge-candidate checks for this scoped acceptance
      delta.
- [ ] Review and integrate through the chosen branch. This record does not perform that action.

### Full brand/SEO production-release readiness

- [ ] Complete every row in the Phase 2 allowlist with route-specific evidence and tests.
- [ ] Keep the ten legacy routes `keep/not_available` until GSC/backlink evidence and a reviewer-approved
      mapping exist. Never bulk redirect them or send them to `/`.
- [ ] Run the isolated PostgreSQL fixture runbook and real `/sitemap.xml` smoke below.
- [ ] Obtain independent production release authorization after the prior three conditions are met.

## Merge-readiness checklist

The following applies only to the eventual full brand/SEO release; it is not a Phase 1 merge gate:

- [ ] Rebase or merge the Phase 1 commit range into the selected integration branch in a new reviewable
      worktree; do not infer integration from the present branch list.
- [ ] Resolve the Phase 2 allowlist with explicit page-by-page decisions. Add focused regression tests
      covering metadata, rendered text, JSON-LD, `llms.txt`, feed output, and redirect behavior for every
      decided route.
- [ ] Keep legacy blog/Guardian routes indexable, rewritten, noindexed, or redirected only after recorded
      Search Console/backlink evidence and an approved route mapping. Never redirect a route to `/` merely
      to remove a term.
- [ ] Run the five local checks in **Re-run evidence** on the exact merge candidate, plus the complete
      PostgreSQL fixture runbook and `/sitemap.xml` smoke.
- [ ] Compare the generated sitemap against canonical product/page URLs; reject 4xx, noindex, duplicate,
      or non-canonical entries.
- [ ] Obtain separate production approval for deployment. This checklist does not grant deployment, DNS,
      naming, payment, catalog, or external-account authority.

## Rollback checklist

1. Before production, retain the previous deployed commit/immutable deployment identifier and export the
   redirect map plus sitemap response hashes. Do not alter production data for a brand rollback.
2. If smoke checks fail, route traffic back to that prior deployment through the existing approved release
   control. Do not use broad process termination, DNS edits, or ad-hoc database changes as rollback.
3. Verify `/`, representative product, `/robots.txt`, `/sitemap.xml`, legacy routes, canonical tags, and
   JSON-LD on the restored deployment. Record HTTP status and target only; do not store customer or payment
   data in the release record.
4. Open a new remediation branch for the failed condition. Do not amend this acceptance record into a
   production authorization.
