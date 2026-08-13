# Pearl Growth Funnel Design

## Goal

Turn Mythrealms from a browse-only pearl catalog into a calm, gift-ready purchase journey that earns discovery traffic through useful pearl guidance and improves conversion through truthful merchandising. The work takes structural lessons from large jewelry stores without copying their assets, wording, brand identity, religious positioning, or high-pressure selling patterns.

## Product Positioning

Mythrealms remains a focused Mediterranean editorial pearl jewelry store. Every public route continues to sell only the approved 45-SKU Pearl Edit. The experience is organized around occasions, styles, care, gifting, and personal expression rather than an expansive marketplace taxonomy.

## User Journeys

### First visit

1. A visitor lands on the editorial home page from social, search, or an AI answer.
2. They see a restrained first-order offer only after meaningful engagement; dismissing it suppresses it for a defined local-storage period.
3. They choose an occasion or Pearl Edit, view products, and add an item to the cart.
4. The cart makes the verified free-shipping threshold visible and offers compatible pearl pieces without implying that any selection is scarce or socially popular.

### Gift buyer

1. A visitor enters through Pearl Gifts or a product page.
2. They select a recipient/occasion editorial path and arrive at a selected collection of existing products.
3. They can add a gift note to their order and see gift-ready packaging and policy facts that the store can actually fulfil.
4. They receive no invented delivery promise, inventory count, countdown, or purchase activity claim.

### Research-led visitor

1. A visitor lands on Pearl Care, Pearl Stories, Pearl Symbolism, or a focused guide article.
2. The page supplies concise, fact-bounded guidance and links to a relevant Pearl Edit.
3. Article, FAQ, breadcrumb, and item-list structured data mirror visible content exactly.

## Information Architecture

### Strengthened and new public entry points

- `/gifts`: Rework the existing route around occasion, recipient, and budget-minded edits; add a gift-note explanation and existing product links.
- `/pearls/care`: Expand the existing practical care and storage guide, with only visible, fact-bounded FAQ content.
- `/pearls/stories`: Editorial index for origin, styling, and gift stories; canonical index rather than a duplicate of `/blog`.
- `/pearls/symbolism`: A neutral guide to pearl associations in gift giving and personal style, without health, protection, luck, or spiritual outcome claims.
- `/edits/[slug]`: A small, curated set of occasion and style edits generated from approved product slugs. Initial edits are Everyday Light, Dinner by the Water, A Gift to Keep, and Soft Gold & Pearl.

### Navigation and homepage

- Keep the existing concise top-level navigation.
- Add a discoverable Pearl Gifts entry and a Learn menu linking Pearl Care, Pearl Stories, and Pearl Symbolism.
- Replace no existing editorial home sections. Add four visual, full-width bands in this order: Shop by Occasion, Pearl Edits, Gift-ready Sets, and Why Pearls.
- Each band uses existing approved editorial images and product data. It must not add decorative stock graphics or a card grid nested inside another card.

## Functional Design

### Edit registry

Create one typed registry that owns edit IDs, labels, descriptions, canonical paths, hero image references, supporting SEO copy, and a limited list of approved product slugs. Pages, cards, sitemap entries, JSON-LD, and related-product selection all consume this registry so an invalid or retired SKU cannot leak into a public edit.

### Product-page merchandising

- Add a `Complete the look` strip after product details with two to four deterministic complementary products from the edit registry. Do not use random selection or claim that these are frequently bought together.
- Add a gift note input next to the purchase controls. Store the note in the local cart item/order payload only when it is non-empty, trim it, and cap it at 240 characters.
- Present policy facts by consuming the existing centralized shipping and returns facts.
- Add a mobile sticky purchase bar that uses the exact same in-stock and add-to-cart behavior as the main purchase control; it is not shown for out-of-stock products.

### Cart and offer behavior

- Preserve the existing server-validated discount flow and free-shipping threshold.
- Add a visible, accessible progress indicator for the remaining verified amount to free shipping.
- Add a single `Complete the edit` recommendation section powered by the same deterministic registry.
- Support explicit, server-validated bundle discount codes only. Do not automatically change prices client-side and do not announce a bundle until an actual discount code has been configured.
- Add a client-only first-order invitation that reuses `/api/newsletter`; show it no earlier than 20 seconds after an engaged page view, once per session, and no more than once every 14 days after dismissal. The offer copy must not promise an unavailable code. A code is shown only when configured by an environment-backed public campaign value.

### Tracking and consent

- Reuse the existing consent gate and tracking contracts.
- Track `view_item_list`, `select_item`, `view_promotion`, `select_promotion`, `add_gift_note`, and `view_edit` only after the relevant consent is present.
- The event payloads include product IDs, edit ID, and list name; they never include the gift-note content, email address, or other personal data.

## SEO and GEO

- Give each new route a unique canonical URL, title, description, Open Graph image, and visible introductory copy.
- Add new routes and edit pages to the sitemap only when they are public, canonical, and backed by real approved products.
- Use `ItemList` schema for edits, `FAQPage` only where visible FAQs exist, and `Article`/`CollectionPage` schema where the page type warrants it. Do not add ratings, aggregate offers, author biographies, medical claims, pearl expertise claims, or generic FAQ markup.
- Update internal links among product pages, edit pages, guides, `/blog`, `/pearls`, `/gifts`, and the footer. The website must offer direct answers to realistic questions such as pearl-care basics, gift selection, and styling rather than keyword-stuffed pages.
- Keep `/llms.txt`, product feed, robots rules, and public route tests aligned with the new canonical discovery pages.

## Content Rules

- Use original Mythrealms copy. No Buddha Stones phrases, design assets, product names, or claims are reused.
- All visual imagery comes from the existing approved Mythrealms library or genuine supplier product views. Editorial imagery remains disclosed where it appears beside a concrete SKU.
- Claims must be supportable by the storefront's existing shipping, returns, payment, packaging, and product data. No invented founder narrative, customer testimonial, inventory urgency, delivery dates, review count, healing benefit, or spiritual outcome.

## Accessibility and Performance

- Keyboard-operable navigation, dialog focus management, escape handling, labelled dismissal, and reduced-motion support are mandatory for the first-order invitation.
- New image surfaces use responsive `next/image` sizes, stable aspect ratios, descriptive alt text, and only load above-the-fold media at priority.
- All promotion, progress, gift-note, and complementary-product states render meaningful empty and error states.
- Desktop and mobile visual regression tests cover the new home sections, a representative product page, gifts, an edit page, the cart, and the invitation's visible/dismissed state.

## Delivery Slices

1. Typed edit registry, new discoverability routes, homepage/navigation/footer links, sitemap, and structured data.
2. Product and cart merchandising, gift note persistence, free-shipping progress, deterministic complements, and analytics contracts.
3. Consent-safe first-order invitation, campaign configuration, accessibility handling, content polish, and cross-device visual verification.

## Acceptance Criteria

- A visitor can find approved products by occasion and style from home, navigation, product pages, cart, and new guide pages.
- No page offers a product slug that is absent from the approved storefront catalog.
- Gift note, cart, and checkout preserve validated order facts in the existing private `Order.notes` field without exposing personal content to analytics.
- Every public addition has canonical metadata and truthful visible structured-data counterparts.
- The full unit suite, production build, and Playwright suite pass; no new lint errors are introduced.
- The production deployment is made only after local verification and follows the repository's existing `main` deployment flow.
