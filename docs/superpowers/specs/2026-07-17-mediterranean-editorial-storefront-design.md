# MythRealms Mediterranean Editorial Storefront Design

## Status

- Date: 2026-07-17
- Approved direction: `A - Mediterranean Editorial`
- Initial delivery scope: homepage and shared storefront visual layer
- Deployment boundary: local review only; no Vercel deployment in this phase

## Objective

Reduce the storefront's template-like and AI-generated visual feel by rebuilding the homepage and shared visual language around MythRealms' strongest photography: natural Mediterranean sunlight, visible skin texture, white linen, pale stone, olive foliage, sea blue, and physically credible pearl jewelry.

The redesign must preserve the clarity of an ecommerce site. Photography should carry the brand, while navigation, category discovery, product browsing, Pearl Guide discovery, and the Guardian Quiz remain direct and usable.

## Success Criteria

- The homepage reads as one coherent jewelry editorial rather than a sequence of repeated rounded cards.
- The jewelry is the first-viewport signal, with a real-looking on-model image visible immediately.
- Every public category remains discoverable from the homepage and navigation.
- Product imagery never implies a construction that differs from the source product.
- Header, menus, buttons, product cards, footer, and motion share one restrained visual system.
- Desktop, tablet, and mobile layouts remain stable, accessible, and free from overlap or horizontal scrolling.
- Existing SEO/GEO, product schema, canonical, feed, and Pearl Guide entry points remain intact or improve.

## Approved Direction

The selected direction is photography-led, warm, and editorial, with clear commercial entry points. It uses large images, asymmetric composition, fine rules, and restrained sea-green interaction color.

The following alternatives were considered and rejected for this phase:

- `Quiet Gallery`: refined but too detached from the warmth and outdoor realism of the approved asset library.
- `Sunlit Journal`: memorable but too collage-heavy for repeated product discovery and mobile commerce.

## Scope

### Included

- Homepage information architecture and visual composition.
- Shared header, navigation menus, buttons, links, product-card presentation, footer, focus states, and motion behavior.
- Homepage use of approved model, product, and scene assets.
- Explicit image-role and fallback behavior for product cards.
- Responsive, accessibility, performance, SEO/GEO, and local visual verification.

### Not Included

- Checkout, payment, cart-state, pricing, inventory, account, or admin architecture changes.
- A full product-detail-page redesign.
- Regenerating every SKU image in this implementation phase.
- Publishing or deploying to Vercel before local approval.

## Experience Principles

1. Photography leads; interface chrome recedes.
2. Sections are full-width editorial bands or unframed layouts, not floating cards.
3. Product shopping remains explicit through plain category names, prices, and direct links.
4. Decoration never imitates product information.
5. Motion establishes reading order and image presence; it does not call attention to itself.
6. Product truth overrides visual novelty.

## Homepage Structure

### 1. Full-Bleed Hero

Use one strong on-model pearl image as a full-width background, cropped to preserve the face, jewelry, and natural environment. The brand offer and primary shopping action sit directly over an intentional low-detail area of the image, never inside a card.

- Suggested headline: `Pearls for sunlit days.`
- Primary action: shop the current pearl edit.
- Secondary action: view the editorial story or Pearl Guide.
- Desktop height leaves a visible hint of the next section.
- Mobile uses an alternate crop or focal position; text must not cover the product.
- Only this image receives eager or priority loading.

### 2. Shop By Style

Replace the five identical icon cards with a photographic category composition:

- Three large image-led entries: Everyday Pearl, Pearl Earrings, and Pearl Necklaces.
- Pearl Bracelets and Pearl Eyewear Chains remain available through compact image/index rows.
- Every entry uses a literal category label and visible link behavior.
- No repeated sparkle icons, nested cards, or equal-width template boxes.

### 3. The Pearl Edit

Present a restrained shortlist of sellable pearl SKUs.

- Stable `4:5` image ratio.
- Verified product image is the default.
- A verified on-model image may replace it on hover or focus-capable interaction.
- Product name and price sit directly below the image.
- No tilt, lift, gloss sweep, artificial urgency, or fabricated rating content.

### 4. Editorial Story And Pearl Guide

Use alternating image and text bands based on seaside steps, olive courtyards, white linen, and natural sunlight. One band leads to a curated pearl story; another exposes Pearl Guide content for both customers and search/answer engines.

- Copy explains material, styling, scale, and care in specific language.
- Article links remain crawlable HTML links.
- Text is concise on the homepage; deeper educational content remains in Pearl Guide pages.

### 5. Guardian Quiz

Replace the existing text-column-plus-card layout with a wide editorial scene or model image. Place the quiz headline and action directly in a safe image area. Present the four guardian archetypes as a borderless index separated by fine rules.

- The quiz remains clearly optional and does not block shopping.
- The archetype index uses plain links and remains keyboard accessible.
- Decorative iconography is limited to one meaningful mark, if retained.

### 6. Newsletter And Footer

Close the page with a restrained newsletter band followed by a charcoal editorial footer. The footer must preserve shopping, customer service, Pearl Guide, legal, social, and contact destinations.

## Shared Visual System

### Color

- Warm white: primary page ground.
- Charcoal: primary text and footer anchor.
- Deep sea green: primary actions, active navigation, and focus-supporting accents.
- Muted sky blue: occasional editorial metadata or background contrast.
- Terracotta: sparse editorial notation only, never a dominant theme.

The finished page must not read as a monochrome beige theme. Color appears through photography and a small number of functional accents.

### Typography

- Retain an editorial serif for brand statements and true section titles.
- Use the existing sans-serif family for navigation, prices, controls, metadata, and body copy.
- Reserve hero-scale type for the hero only.
- Use compact, stable heading sizes in product grids, menus, and narrow modules.
- Keep letter spacing at zero except where an existing small all-caps metadata style demonstrably needs adjustment; do not use negative tracking.

### Shape And Lines

- Controls use square or lightly rounded corners.
- Cards are not used as page-section containers.
- Product media may use minimal or no radius.
- Fine dividers establish rhythm instead of bordered boxes and shadows.
- No gradient orbs, glow fields, glass panels, nested cards, or decorative bokeh.

## Shared Component Contracts

### Header And Navigation

- Header begins transparent over the hero with sufficient contrast.
- After leaving the hero, it becomes a warm-white surface with charcoal text.
- Shop and Intention menus work with mouse, keyboard, and touch.
- Opening a menu exposes a visible focus target; Escape closes it and focus returns to the trigger.
- Mobile navigation shows all required actions without horizontal clipping from 320px upward.

### Buttons And Links

- Primary button: deep sea green, high-contrast text, minimum 44px touch target.
- Secondary action: text plus a familiar arrow icon.
- Icon-only buttons use the existing icon library and an accessible name.
- Hover and focus are visibly distinct; focus is not represented by color alone.
- Remove gradient, glow, shimmer, and pill styling from ordinary commands.

### Product Cards

- Media uses a constrained `4:5` aspect ratio and cannot resize from dynamic content.
- Title and price remain visible without hover.
- Hover may swap to an approved wearing image and scale no more than approximately `1.02`.
- When no wearing image exists, the card remains static.
- Product badges are limited to factual statuses that exist in product data.

### Footer

- Use charcoal ground, warm-white text, and fine separators.
- Keep legal and service destinations permanently visible.
- Newsletter controls use explicit labels and actionable success/error feedback.

## Motion Design

Use the project's existing CSS-first approach unless implementation discovery shows an established motion dependency.

- Section text may rise `12-16px` while fading in over roughly `600ms`.
- Related image groups may stagger by no more than `80ms` per item.
- Header surface and color transitions use roughly `180ms`.
- Image hover scale is subtle and never changes layout.
- No infinite floating, pulsing, shimmer, glow, automatic zoom, or decorative loop.
- Motion runs once per meaningful entrance rather than replaying on every small scroll.
- Under `prefers-reduced-motion: reduce`, content is immediately visible and all nonessential transforms and transitions are removed.

## Product Image Truth Contract

Each SKU may expose four explicit image roles:

- `primary`: verified product image and default commerce view.
- `detail`: verified construction, material, clasp, pearl, or finish detail.
- `wearing`: verified on-model image that changes only the person, environment, light, or camera angle.
- `editorial`: lifestyle image for storytelling; never the sole proof of product construction.

Generated imagery must preserve at least 95% visible similarity to the source product. Review includes pearl count, pearl shape and color, arrangement, metal topology, connection method, scale, and wearing orientation.

Specific rejection conditions include:

- a ring spanning the wrong fingers or facing the wrong direction;
- earrings attached at an anatomically impossible point;
- a necklace with changed length, pattern, pendant, clasp, or pearl count;
- floating jewelry, missing contact shadow, inconsistent focus, or pasted-edge artifacts;
- any image that substitutes a merely similar SKU.

When an image fails review, use the verified supplier or approved product image. Do not publish a more attractive but inaccurate generation.

## Missing And Failed Media

- If `wearing` is absent, do not render an empty hover layer or image switch.
- If a non-primary image fails, fall back to the same SKU's verified `primary` image.
- If the primary media cannot load, render a stable neutral placeholder with the product name and keep the product link usable.
- Never borrow an image from another SKU.
- Reserve media dimensions before loading to prevent layout shift.
- Provide descriptive alt text based on the actual product type, material, color, and view; decorative scene images use empty alt text.

## Responsive Behavior

- Desktop uses asymmetric editorial grids and wide image bands.
- Tablet simplifies column ratios while preserving photography hierarchy.
- Mobile uses edge-to-edge media, single-column reading order, and stable aspect ratios.
- Typography uses fixed breakpoint steps or container constraints, not viewport-width font scaling.
- Text never overlays a detailed product area without a verified safe crop and contrast.
- No target viewport from 320px to 1440px may show incoherent overlap or full-page horizontal scrolling.

## Accessibility

- Preserve semantic headings, links, buttons, landmarks, and crawlable navigation.
- All menus, modal surfaces, search, cart, and interactive product media remain keyboard operable.
- Touch targets are at least 44px where practical.
- Text and controls meet contrast requirements across both hero imagery and solid surfaces.
- Visible focus is provided for every interactive element.
- Reduced-motion behavior is verified, not inferred from CSS presence alone.

## SEO, GEO, And Performance

- Preserve route-specific canonical metadata, product JSON-LD, collection semantics, feed data, sitemap behavior, and Pearl Guide entry points.
- Homepage copy uses specific pearl category, material, styling, scale, and care terminology rather than generic brand adjectives.
- Image file names and alt text describe real subjects and views.
- Use responsive image sizing and modern optimized formats.
- Priority loading is limited to the hero and any image required for the initial viewport.
- Below-fold assets are lazy loaded.
- Visual changes must not introduce cumulative layout shift or hide indexable content behind client-only effects.

## Validation Strategy

### Automated

- Existing unit and integration tests relevant to shared navigation and storefront catalog.
- ESLint and TypeScript checks.
- Production build.
- Any existing image/source validation for public SKUs.

### Browser Verification

- Desktop at 1440px.
- Mobile at 390px, plus a 320px overflow check.
- Tablet breakpoint sanity check.
- Header transition, Shop menu, Intention menu, mobile menu, search, and cart access.
- Product-card hover/focus image behavior with and without a wearing image.
- Keyboard focus order and Escape behavior.
- Reduced-motion rendering.
- Console errors, broken images, layout shift, overlap, and horizontal overflow.

### Visual Review

Compare homepage screenshots against the approved Mediterranean Editorial direction. Reject the implementation if it reintroduces repeated rounded cards, decorative glow, template-like icon grids, product-inaccurate AI images, or excessive motion.

## Rollout

1. Implement the homepage and shared visual layer locally.
2. Verify automated checks and desktop/mobile screenshots.
3. Provide the local URL for user review.
4. Correct approved review findings.
5. Deploy only after explicit user approval in a later step.
