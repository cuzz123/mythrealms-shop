# Maverenne Signature UI/UX System Design

**Date:** 2026-08-13

**Owner:** Storefront UI/UX

**Status:** Approved direction; written-spec review pending

**Candidate base:** `099c800d279b5a7d48d755b0a38fd93ad63bfadc`

**Candidate branch:** `codex/maverenne-uiux-signature-system`

## 1. Objective

Create a cohesive, high-impact Maverenne storefront visual system across the homepage, global navigation, collection browsing, product cards, product detail, cart entry, Gifts, Pearl Guide, Pearl Care, and Journal. The system must strengthen brand recall and product browsing without changing product facts, price or inventory logic, fulfillment promises, SEO-controlled copy, metadata, schema, canonical URLs, analytics events, or release state.

SEO/GEO remains the sole P0. This UI/UX project is P1 except where layout, responsive behavior, accessibility, image stability, or content hierarchy directly supports SEO/GEO.

## 2. Baseline and evidence boundary

- Implementation starts from immutable release-candidate base `099c800d…`, not from the dirty shared root and not from migration source `9454f355…`.
- The public site at `https://www.maverenne.com/` is visual reference evidence, not proof that any local file or SHA is deployed.
- The public site currently exposes the Maverenne identity, a single homepage H1, 63 products in The Pearl Edit, one-image Gifts, an image-rich Pearl hub, a text-only Pearl Care route, an empty-state Journal, and the existing cart/product flows.
- `9454f355…` may be consulted only as immutable reference. No wholesale merge or cherry-pick is authorized.
- This candidate remains local-only. Merge, push, deploy, DNS, canonical, external accounts, product state, and policy changes are outside scope.

## 3. Considered approaches

### A. Surface polish only

Retune color, spacing, typography, and button styles without changing page composition. This has the lowest regression risk but would not solve the repeated image-card rhythm or create a recognizable Maverenne signature.

### B. Signature system with route-local composition upgrades — selected

Introduce a small set of reusable visual roles, rebuild the homepage rhythm, refine shopping surfaces, and add at most one controlled editorial image role to sparse content routes. It produces a meaningful visual upgrade while preserving route facts, navigation, SEO content hierarchy, and existing commerce behavior.

### C. Campaign-style art-direction rebuild

Replace most layouts and assets with a highly animated campaign experience. This could create stronger short-term spectacle but carries excessive LCP, accessibility, SEO, content-authority, and conversion risk. It is rejected.

## 4. Visual system

### 4.1 Image roles

Every visible image must use one of four roles:

1. **Signature:** one route-level hero at most; desktop landscape and mobile portrait focal contracts.
2. **Editorial:** a person, setting, or story image in 2:3 or 3:2; never used as product proof.
3. **Product:** 4:5 product presentation with consistent crop, information order, and controls.
4. **Detail:** 1:1 or narrow landscape close-up supporting an editorial composition.

No route may add a second hero. A supporting editorial image cannot link to a product unless an existing approved route contract already does so. AI/editorial imagery must never establish material, construction, scale, availability, care, delivery, or product identity.

### 4.2 Typography and hierarchy

- Preserve the existing serif/sans pairing and CSS token architecture.
- Use larger display scale only for the single route H1 or section-defining statement.
- Eyebrows remain concise and uppercase; body text remains readable at 16px-equivalent on mobile where it carries essential guidance.
- Limit each viewport to one dominant visual statement and one high-contrast primary CTA.
- Keep all H1 and direct-answer text in semantic DOM order and outside image-only rendering.

### 4.3 Color, borders, and radius

- Reuse existing brand variables; introduce no independent page-local palette.
- Alternate warm surface, paper surface, and charcoal/deep-green emphasis sections to create rhythm.
- Standardize card and control radii into three roles: image/card, compact control, and pill/status.
- Replace decorative box proliferation with thin rules, whitespace, and selective contrast blocks.

### 4.4 Motion

- Motion is limited to opacity reveals, approximately 2% image scale, and short navigation transitions.
- All nonessential animation must be disabled by `prefers-reduced-motion: reduce`.
- Homepage slides may not change automatically in reduced-motion mode.
- No scroll-jacking, parallax, cursor effects, autoplay video, or auto-opening subscription modal.

## 5. Global shell

### Header

- Preserve top-level Maverenne navigation contract and URLs.
- Keep the transparent-to-solid homepage state, but increase logo/wordmark ownership and standardize icon-button hit areas.
- Desktop menus retain keyboard-open, Escape-close, outside-click, focus-return, and visible-focus behavior.
- Mobile navigation remains a modal menu with focus containment and 44px minimum targets.
- Search stays a dedicated dialog with current query/result behavior; its visual treatment must use the same surface, radius, and typography system as the storefront.

### Mobile bottom navigation

- Preserve existing destinations and cart behavior.
- Reduce visual competition with product purchase controls through lower contrast, quieter labels, and safe-area spacing.
- Sticky Add to Cart must never overlap the bottom navigation.

### Footer

- Preserve approved link groups and existing customer-facing facts.
- Create stronger brand closure through wordmark, restrained editorial statement, quieter newsletter treatment, and clearer link hierarchy.
- Do not add social, support, schedule, payment, shipping, or returns claims that are not already controlled facts.

## 6. Homepage

### Signature hero

- Keep exactly one H1 and the existing approved Maverenne hero copy and destinations.
- Desktop: full-width landscape composition with subject focus within the right 55–75%, left text field, one filled primary CTA, and one text secondary CTA.
- Mobile: independent 4:5 crop and content-safe focal position; H1, supporting copy, and primary CTA visible without horizontal scrolling.
- Introduce a restrained editorial index/line detail such as `Maverenne / Editorial 01`; it is decorative and not announced by assistive technology.
- Preserve stable aspect ratio and explicit responsive image sizing. Only the initial visible hero image may preload.

### Page rhythm

Recompose existing content rather than adding marketing claims:

1. Signature hero.
2. Compact category index.
3. Occasion editorial diptych.
4. First product edit.
5. Dark brand/story emphasis band.
6. Knowledge/gifting editorial links.
7. Second product edit.
8. Narrow newsletter letter.

Repeated `image + title + link` blocks must not appear with identical scale and background in consecutive sections. Existing destinations remain unchanged. No new product category, price tier, stock statement, or promotion is introduced.

### Editorial diptych

- One large 2:3 image paired with one smaller detail image and a compact text block.
- Desktop may use an asymmetric 58/42 composition; mobile reading order is primary image, heading/copy, detail image, link.
- The component appears at most once on the homepage.

## 7. Collection and product cards

### Collection page

- Preserve query parameters, product count, filtering, sorting, and product DOM order.
- Improve filter hierarchy and maintain a compact mobile filter/sort surface.
- Add no more than one clearly non-product editorial divider after the first 8–12 rendered products. It must not resemble a product card, carry product facts, or change the sequence used by search/filter logic.
- Product grid remains two columns at 390, transitions appropriately at 768, and uses four columns at 1440 where space allows.

### Product card

- Preserve product name, current price, compare price, savings, wishlist, and quick-add logic.
- Maintain 4:5 imagery and consistent title/price vertical rhythm.
- Prevent wishlist and quick-add controls from colliding on 390px cards.
- Mobile controls must be at least 44px touch targets or be replaced by a single clearly labeled action treatment that meets that size.
- Desktop hover imagery remains enhancement-only; the card is understandable without hover and under reduced motion.

## 8. Product detail and cart entry

### Product detail

- Preserve product facts, gallery ordering, price, quantity, gift note, availability behavior, analytics, and Add to Cart logic.
- Desktop: gallery may remain sticky within its column; purchase information uses a controlled 440–500px readable measure.
- Mobile gallery gains an explicit current/total indicator and touch-safe navigation.
- Purchase hierarchy becomes: realm/eyebrow → H1 → price → verified concise facts → shipping progress → quantity/gift note → primary Add to Cart.
- Long description, care, story, detailed accordions, and learning links remain below the primary purchase decision.
- Sticky Add to Cart contains a shortened accessible label, price, and action without obscuring navigation or page controls.

### Cart drawer

- Preserve focus containment, Escape close, focus return, quantity updates, removal, recommendations, shipping-progress calculation, View Cart, and Checkout destinations.
- Improve subtotal/primary checkout emphasis while keeping View Cart available.
- Recommendations stay visually subordinate to current cart contents.
- Empty cart uses one primary return-to-shopping action and no fabricated recommendations.

## 9. Editorial routes

### Gifts

- Preserve the exact current H1, direct guidance, `#gift-method`, and `#gift-help` facts and fragments.
- Add at most one non-linked, contextual 3:2 still after the introductory answer and before the checklist.
- Do not add price bands, inventory states, delivery promises, editorial product selections, captions, CTA, or product links.
- Introduce a typographic three-step index only if its labels restate existing checklist concepts without creating new facts.

### Pearl hub

- Retain the existing hero and guide hierarchy; replace or refine only the visual role, crop, overlay, and responsive presentation.
- Keep guide cards, FAQ, related content, metadata, schema, and action destinations unchanged.
- Do not reuse the hero as a product or guide-card image.

### Pearl Care

- Preserve H1, complete 48-word direct answer, body, FAQ, sources, metadata, schema, and canonical.
- Add one 1536×1024 contextual image after the direct answer and before the first body section.
- Render it as an in-flow 3:2 image, descriptive alt per the controlling SEO/alt contract, no link, caption, CTA, or priority loading.
- DOM reading order remains H1 → direct answer → image → article sections → FAQ → sources.

### Journal `/blog`

- Do not create `/journal` or a redirect.
- Preserve the current empty-state truth; do not fabricate posts, dates, authors, or article cards.
- Add at most one decorative editorial image with `alt=""` after H1 and introduction, before the empty state or existing post grid.
- Provide only existing approved reading destinations if a route-local empty-state navigation group already has a controlled URL contract.

## 10. Responsive and accessibility contract

### 390 × 844

- No horizontal overflow or clipped text.
- Minimum 44px interactive targets.
- H1 and primary CTA are not covered by sticky chrome.
- Product card actions do not overlap.
- Sticky purchase control and mobile bottom navigation remain independently operable.

### 768 × 900

- Tablet layouts must be intentional rather than compressed desktop grids.
- Hero and diptych focal points remain legible; no stranded one-item grid rows where a more balanced composition is available.
- Dialog widths respect viewport gutters.

### 1440 × 900

- Content measure remains bounded; hero copy does not expand into image focal areas.
- Product and editorial grids maintain consistent gutters and baseline rhythm.
- Sticky elements do not obscure direct fragments or headings.

### Keyboard and semantics

- Skip link, landmark order, one H1, semantic heading progression, named controls, focus-visible states, dialogs, Escape, focus return, and native fragment behavior are required.
- Images never become focus stops unless an existing approved link wraps them.
- No screen-reader interaction claim may be made without running one; DOM/ARIA evidence must be labeled accurately.

## 11. Performance and stability

- Reserve intrinsic dimensions or explicit aspect ratios for every image.
- Only an actual initial-viewport hero may preload; content/editorial images below it are lazy-loaded.
- Use route-appropriate `sizes`; never default every image to `100vw`.
- Stop and mark Fix for horizontal overflow, visible layout shift, missing image dimensions, hero text contrast failure, unexpected duplicate LCP candidates, or a material LCP/CLS regression against the fixed candidate baseline.
- A successful HTTP response is not usability or performance evidence.

## 12. Component boundaries

The implementation should prefer the following focused units while reusing existing component APIs where safe:

- `SignatureHero`: route-level hero composition and responsive focal contract.
- `EditorialDiptych`: the single asymmetric homepage editorial composition.
- `EditorialDivider`: non-product collection rhythm break.
- `EditorialInlineImage`: in-flow Gifts/Care/Journal image with controlled semantics and loading.
- `SectionHeading`: repeated eyebrow/title/action alignment.
- Existing `ProductCard`, `StickyAddToCart`, `Header`, `SearchOverlay`, `CartDrawer`, and `Footer` remain behavior owners; their visual refactors must not duplicate state or commerce logic.

No component may own product selection, price truth, policy truth, metadata, schema, canonical, or analytics-event definitions merely to support presentation.

## 13. Verification

Each implementation lot requires:

- focused server-render/static contract tests before implementation and after;
- target lint and TypeScript checks;
- existing relevant unit tests with zero unexplained regressions;
- 390/768/1440 real rendering evidence for all touched routes;
- keyboard focus, dialog, fragment, reduced-motion, and no-JS evidence where behavior is expected to remain native;
- console-error review and scoped `git diff --check`;
- changed-file audit confirming no metadata, canonical, schema, analytics, product-state, policy, or external-system change unless explicitly listed and separately authorized.

## 14. Implementation lots and rollback

1. Tokens and global shell.
2. Homepage Signature system.
3. Collection and product cards.
4. Product detail and cart entry.
5. Gifts, Pearl hub, Pearl Care, and Journal.
6. Cross-route responsive, accessibility, and performance acceptance.

Each lot must be independently reviewable and reversible. A lot may be reverted without requiring rollback of later product or policy data because this candidate changes presentation and layout only. If a lot cannot preserve that isolation, implementation stops and the design boundary is revised.

## 15. Out of scope

- Merge, push, deploy, production configuration, DNS, canonical host, external accounts, or publication.
- Product creation, deletion, activation, inventory, price, material, variant, fulfillment, shipping, return, support, or legal-policy facts.
- GA4 event names, payloads, consent behavior, experiments, or conversion claims.
- Schema, metadata, canonical, sitemap, robots, llms, feed, or OG/Twitter changes.
- New routes, `/journal`, redirects, fabricated articles, testimonials, ratings, reviews, press, certifications, or supplier claims.
- Rights clearance or publication approval for any asset.

## 16. Success criteria

The candidate is ready for independent review when every touched route presents a recognizable Maverenne visual system, the homepage has one clear visual signature, collection and purchase paths remain efficient, sparse editorial pages gain only their controlled single-image role, and all responsive/a11y/performance gates pass without changing controlled facts or release state.
