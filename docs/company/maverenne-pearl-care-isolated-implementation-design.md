# `/pearls/care` isolated implementation: RED-test and minimum-diff design

**Status:** design only. No route, page, URL, canonical, sitemap, robots, production, or `/pearls/freshwater-pearls` change is authorized by this record.

## Inputs and non-negotiable boundary

This design is based on the shared review-ready copy package and local acceptance matrix:

- `D:\mythrealms-shop\docs\company\maverenne-pearl-care-source-and-copy.md`
- `D:\mythrealms-shop\docs\company\maverenne-pearl-care-local-acceptance-matrix.md`

The existing route stays `/pearls/care`. The acceptance matrix records the precise approved old-domain canonical hostname as `not_available`; therefore, no implementation may replace, hard-code, infer, or otherwise alter the current canonical host. The existing `absoluteUrl("/pearls/care")` intent must remain untouched until an authorized environment supplies the old-host evidence.

## Current implementation facts

- Route component: `src/app/pearls/care/page.tsx`.
- Shared editorial facts: `PEARL_GUIDES.care` in `src/lib/editorial/guides.ts`.
- Existing route uses `GuideLayout`, Article, FAQPage, and Breadcrumb JSON-LD; it also owns a three-item practical-answer section.
- Existing local coverage is distributed across `tests/traffic-conversion-pages.test.ts`, `tests/pearl-guides.test.ts`, `tests/structured-data.test.ts`, and existing e2e route reachability. None currently proves the new approved wording, exclusion boundary, or source-to-visible-copy mapping.

## Required RED tests before any source change

Each test must first fail because the candidate wording/contract is absent, not because of a test setup error.

| Test name | Assertion contract | Intended scope |
| --- | --- | --- |
| `care route keeps its existing URL and canonical expression` | Render/import `/pearls/care`; assert the route/crumb stays `/pearls/care`, no redirect is introduced, and the implementation still delegates canonical construction to the pre-existing expression. Do not assert an invented hostname. | `tests/traffic-conversion-pages.test.ts` or a new focused route contract. |
| `care metadata and one H1 match the approved fields` | Exact title `How to Care for Pearls | Pearl Care Guide`, exact meta description, and exactly one H1 `How to Care for Pearls`. | Focused care-route test. |
| `care direct answer is 40–70 words and preserves the general-education boundary` | Exact approved 48-word direct answer appears visibly; its word count is 40–70; it states that guidance is not instruction for a store item, setting, string, or finish. | Focused care-route test. |
| `care body uses only approved general-care boundaries` | Assert the four approved section meanings: exposure, ultrasonic/steam and conditional warm-soapy-water boundary, missing-item-detail pause, and general education beside exact instructions. Assert no item-specific care conclusion. | Focused care-route test. |
| `care FAQ visibly and structurally matches the four approved questions` | Extract FAQPage JSON-LD and compare its four question/answer pairs to visible FAQ text. No hidden-only FAQ or rich-result promise. | Focused care-route test plus existing JSON-LD helper pattern. |
| `care breadcrumbs and ordinary links keep approved destinations` | Breadcrumb end is `/pearls/care`; descriptive anchors use only `/pearls`, `/pearls/how-to-wear`, `/pearls/freshwater-pearls`, and `/contact`. Do not modify or implement freshwater. Add an actual local destination check only when its existing route is verified. | Focused care-route and e2e route check. |
| `care candidate excludes unsupported item and outcome claims` | Scan rendered copy/schema for SKU pearl status, material, treatment, setting, string, adhesive, metal, coating, cleaning tolerance, waterproofing, tarnish/durability, fit/comfort, price/stock/shipping/returns/repair/warranty, guaranteed outcomes, and Guardian/mythology/healing/effect language. | Focused negative contract test. |
| `care Article JSON-LD mirrors only visible verified facts` | Article headline/description match visible approved values; FAQ and breadcrumb schemas mirror visible content. Dates/image/author remain the existing verified guide values and are not replaced by inferred source metadata. | Focused route/schema test. |

## Provisional minimum diff

After the RED suite is accepted, the minimum candidate is limited to:

1. `src/lib/editorial/guides.ts` — replace only the `care` guide title, description/direct answer, approved sections, and FAQ with the review-ready package, preserving existing verified dates/image/identity fields.
2. `src/app/pearls/care/page.tsx` — replace only the page-owned practical-answer area and add approved ordinary links where a destination has passed local verification; retain the existing route and canonical expression unchanged.
3. One focused care-route contract test (and existing targeted tests only where they encode affected shared-guide behavior).
4. Optional focused e2e local route test after the component contract is green; it must not claim production metadata, sitemap, indexing, or GIA availability.

No change is permitted to `src/app/pearls/freshwater-pearls`, `src/lib/site.*`, redirects, sitemap, robots, canonical host/path construction, product data, prices, CTA destinations, or external accounts.

## Stop conditions before implementation

Stop the candidate and report rather than filling gaps when:

- the approved old-domain canonical host is still unavailable and a desired assertion/change would require it;
- a proposed ordinary link destination fails local resolution or lacks approval;
- a factual paragraph cannot be mapped to the reviewed GIA support register;
- a test requires inventing a product construction/care fact, source date, author, image fact, or external evidence; or
- the only way to make a test pass changes `/pearls/care` URL behavior or touches freshwater.

## Local verification sequence after separate code authorization

1. Add the focused RED tests above and record their expected failures.
2. Implement the minimal diff only.
3. Run targeted unit/structural tests, targeted e2e route test, typecheck, and full lint.
4. Record the candidate SHA, exact commands, exit codes, local environment, and exclusions scan. Local results are not deployment, indexing, source-access, or production canonical evidence.
