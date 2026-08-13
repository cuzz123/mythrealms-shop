# Phase 2 Candidate: `/pearls/how-to-wear`

**Status:** Local candidate only. Not deployed, pushed, or approved for production release.

## Scope

- Baseline: `cc4f6746913041c52000732aff0b4e69c9d60218`.
- Existing route only: `/pearls/how-to-wear`.
- The candidate replaces only the route's general styling copy in the shared pearl-guide registry.
- No new `/pearls/pearl-earrings-buying-guide` route, sitemap entry, navigation link, product link, product fact, price, CTA, cart, or checkout behavior is added or changed.

## Evidence boundary

The candidate maps Draft Pack 05's reviewed preference-based styling text: clothes already worn, contrast or repetition, and a final check of exact product and policy information. The registry marks this content `editorialStatus: "candidate"` and records that it does not establish material, composition, dimensions, fastening, fit, comfort, price, availability, delivery, or return eligibility.

The rendered sources are Google Search Central's people-first-content guidance and the two cited FTC consumer pages. They support the editorial/process and general check-information boundary only; they do not establish any store, SKU, policy, or wearable-result fact.

## Metadata and structured data

- The existing metadata title remains `How to Wear Pearl Jewelry Every Day | Pearl Guide | Maverenne`.
- The existing canonical remains the configured legacy origin plus `/pearls/how-to-wear`; this change does not set a Maverenne production canonical.
- The existing server-rendered `BreadcrumbList`, `Article`, and `FAQPage` JSON-LD continue to use the same guide record as the rendered page.
- Existing links to `/pearls` and `/pearls/care` are retained. Conditional Draft Pack links to gifts, collection, and contact were not added because their owner-verification gate has not been recorded here.

## Required release gate

Before any deployment or publication, an owner must verify the current linked product and policy destinations, source access and citation placement, image/SKU identity and rights, metadata/HTML/JSON-LD consistency, and the absence of unsupported promises. Production migration and canonical-domain authorization remain out of scope.

## Local verification

- TDD baseline: the candidate rendering test failed against the previous guide content, then passed after the registry change.
- `tsx --test tests/pearl-guides.test.ts tests/traffic-conversion-pages.test.ts tests/editorial-guides.test.ts`: 18 passed, 0 failed.
- Isolated dependency baseline: `pnpm install --frozen-lockfile --offline` reused all 577 locked packages without a network download. It completed `prisma generate`; a second explicit `prisma generate` also passed. pnpm returned `ERR_PNPM_IGNORED_BUILDS` only because the local package-build approval policy still lists native dependency scripts as unapproved.
- Browserslist resolution: Next 16.2.6 local documentation identifies the `package.json` `browserslist` field as the supported configuration. The older `.browserslistrc` duplicated those exact production targets, and caused webpack's configuration conflict. The duplicate file was removed without changing the `package.json` browser support range. `tests/prisma-build-contract.test.ts` now protects the single-source contract.
- `tsx --test tests/prisma-build-contract.test.ts tests/pearl-guides.test.ts tests/traffic-conversion-pages.test.ts tests/editorial-guides.test.ts`: 21 passed, 0 failed.
- `tsc --noEmit`: passed. `next build --experimental-build-mode compile`: passed and included `/pearls/how-to-wear`; complete `generate`/`generate-env` remains blocked pending a separate isolated database fixture.
- Full ESLint is an independent baseline gate: the lockfile-resolved lint run reports 14 errors and 38 warnings in existing files outside this candidate/build-baseline diff. No lint configuration or unrelated React, admin, checkout, or dialog code was changed here.
