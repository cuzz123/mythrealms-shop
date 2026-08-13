# Maverenne signature UI/UX local acceptance — 2026-08-13

## Scope and candidate

- Base: `099c800d279b5a7d48d755b0a38fd93ad63bfadc`
- Final local candidate before this evidence commit: `9da3f13521ee6ae45ff5752d1d953cac4c04435d`
- Branch: `codex/maverenne-uiux-signature-system`
- Local-only candidate. It has not been merged, pushed, deployed, or represented as published.

## Implemented lots

- Shared signature presentation primitives: `810c0227`
- Storefront shell: `1bd2ac8d`, with policy-surface correction `8a2eeb1f`
- Homepage composition: `6520d481`, with strengthened contracts `91c551ff`
- Collection browsing: `4ef71b87`, with test-contract corrections `6f67efb4` and `ef50fc8c`
- Product purchase hierarchy: `da389f87`
- Homepage growth-order test alignment: `31c10a19`

## Static verification

Run locally on the candidate after the test-contract correction:

```text
pnpm run test:unit
# 523 passed; 0 failed

pnpm exec tsc --noEmit
# exit 0

pnpm run lint
# exit 0; 37 pre-existing repository warnings, 0 errors

git diff --check
# exit 0
```

The focused signature suite had separately passed 64/64 before the full suite. The full-suite-only failure was an obsolete `HomepageOccasionEdit` order assertion. Its root cause was traced to the approved Task 3 replacement with `EditorialDiptych`; the test-only contract was updated and the full suite then passed 523/523.

## Controlled boundaries confirmed

- No metadata, schema, canonical, sitemap, robots, OG/Twitter, consent, event-name/payload, product fact, price, stock, fulfillment, policy, route, or snapshot change is included in the local candidate.
- Collection divider stays render-only: its 11/12-product threshold, position after item eight, ordering, identity, mobile targets, and reduced-motion contract have dedicated tests.
- Product page retains state and analytics ownership; purchase summary precedes long form, and gallery position is polite-live.
- Task 6 is **Blocked — not a code failure**. The controlled Pack 01/02 source images have no approved public runtime identity and rights/publication remains blocked; Pack 02 Gifts placement is also `Fix`. No Task 6 source, test, asset, SEO, or route change was retained.

## Runtime evidence status

### Browser and screenshot matrix

Chrome was run locally against the isolated Next dev server at `http://127.0.0.1:3113`. Evidence is stored under `artifacts/uiux-acceptance-2026-08-13/` (local, non-sensitive, untracked). The initial `pnpm run dev -- --hostname ...` invocation was invalid because the package script passed the hostname as a project directory; `pnpm exec next dev --hostname 127.0.0.1 --port 3113` was used instead.

| Route | 390×844 | 768×900 | 1440×900 | Result |
| --- | --- | --- | --- | --- |
| `/` | screenshot, 1 H1, no horizontal overflow | screenshot, 1 H1, no overflow | screenshot, 1 H1, no overflow | Pass after reveal-gap correction |
| `/collections/pearl-series` | screenshot, 1 H1, no overflow | screenshot, 1 H1, no overflow | screenshot, 1 H1, no overflow | Pass |
| `/products/new-series-pearl-glasses-chain` | screenshot, 1 H1, no overflow | screenshot, 1 H1, no overflow | screenshot, 1 H1, no overflow | Pass |
| `/gifts` | screenshot, 1 H1, no overflow | screenshot, 1 H1, no overflow | screenshot, 1 H1, no overflow | Pass |

Visual correction discovered and verified in this runtime pass: the category section could be hidden by the old `IntersectionObserver` threshold while still occupying space after the hero. `ScrollRevealEnhancer` now reveals at a 1% intersection with no negative root margin. `home-fixed-390x844.png`, `home-fixed-768x900.png`, and `home-fixed-1440x900.png` show opacity `1` and no overflow after the correction.

### Interaction and no-JS evidence

- Focused Chromium route suite against port 3113: six relevant tests ran (Gifts readability, homepage desktop/mobile sequence, reduced motion, collection/product media, product purchase entry). The runner returned no test-failure summary; a targeted rerun of the mobile product test also exited successfully after test start. Treat this as supporting evidence; the final full browser suite was not run.
- Product gallery keyboard check at 390×844: focusing the native next-image button then pressing Enter changed `data-gallery-position` from `1 / 3` to `2 / 3`.
- No-JS local checks at 390×844: `/`, `/gifts`, and `/pearls/care` each rendered one H1 with no horizontal overflow. `/blog` rendered no H1 in the current truthful archive state, so it is not marked as a no-JS heading Pass.
- Gift direct-fragment history automation did not obtain a hash through the chosen accessible-link lookup; therefore Tab/Enter plus browser back/forward fragment behavior remains **Pending**, not Pass.
- No screen-reader run was performed or claimed.

### Performance and image risk

- No visible horizontal overflow was measured on the four implemented routes across the three required viewports.
- Product-route Next dev output warned that the above-fold product image was an LCP candidate and suggested eager loading. This candidate did not alter image loading because it would exceed the visual-only scope; it remains a P1 performance follow-up requiring an isolated performance decision.
- No field LCP, CLS, or production performance claim is made from local dev evidence.

## Release boundary

This record is acceptance evidence for an isolated local candidate only. It is not release, rights, publication, or deployment approval.
