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
- `tsc --noEmit`: passed; changed-file ESLint: passed.
- Compile build remains an environment gate, not a candidate-code failure: Turbopack rejects a dependency junction that points outside the isolated worktree, and webpack stops before application compilation because the baseline contains both `.browserslistrc` and a `browsers` entry in `package.json`. No build configuration was changed for this candidate.
