# Storefront Content, Story, SEO/GEO Implementation Plan

> **For Claude/Codex:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Add high-intent shopping and editorial entry points, turn `/about` into a credible brand Story, and strengthen standard SEO plus answer-engine discoverability without inventing product, founder, review, sourcing, or sustainability claims.

**Architecture:** Keep the 45-product storefront catalog as the only product source of truth. Put navigation, gift merchandising, new-arrival selection, and pearl-guide content in typed registries or pure selectors; render them through small server-first editorial components. Generate metadata and JSON-LD from the same visible page data, then verify crawlability, keyboard navigation, no-JavaScript output, and responsive layouts with Node tests and Playwright.

**Tech Stack:** Next.js 16.2 App Router, React 19, TypeScript 5.9, Tailwind CSS 4, Node test runner with `tsx`, Playwright 1.61, existing `ProductCard`, `JsonLd`, catalog, and editorial image assets.

**Approved design:** `docs/superpowers/specs/2026-07-18-storefront-content-story-seo-geo-design.md`

## Scope And Truth Guardrails

- Keep `/collections/pearl-series` and `getStorefrontProducts()` as the authoritative public catalog.
- Do not add "Best Seller," "Most Loved," star ratings, review counts, origin, certification, handmade, founder, studio, sustainability, medical, or emotional-outcome claims unless backed by real data already visible on the same page.
- Product source photography remains the reference for shape, construction, finish, color, and scale. Editorial imagery may illustrate styling, but the Story page must disclose that some editorial images are digitally created.
- Public content must render in server HTML. Client code is limited to existing interactive controls and consent-aware analytics.
- Query-filtered collection URLs remain `noindex,follow`; new canonical landing pages receive their own canonical URLs.
- IndexNow submission is deferred until a stable custom domain is connected. The implementation only documents that launch step.

---

### Task 1: Centralize Header And Footer Information Architecture

**Files:**
- Create: `src/lib/storefront/navigation.ts`
- Create: `tests/storefront-navigation.test.ts`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `e2e/core-flows.spec.ts`

**Interfaces:**
- Produces `HEADER_MENUS`, `HEADER_LINKS`, and `FOOTER_GROUPS` as readonly typed data.
- `Header` consumes `HEADER_MENUS` and `HEADER_LINKS` while preserving its existing focus management.
- `Footer` consumes `FOOTER_GROUPS`; social links and newsletter behavior stay local.

**Step 1: Write the failing navigation contract test**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import {
  FOOTER_GROUPS,
  HEADER_LINKS,
  HEADER_MENUS,
} from "../src/lib/storefront/navigation";

test("storefront navigation exposes every approved discovery route", () => {
  assert.deepEqual(HEADER_MENUS.map(({ id, label }) => [id, label]), [
    ["shop", "Shop"],
    ["gifts", "Gifts"],
    ["discover", "Discover"],
  ]);
  const hrefs = [
    ...HEADER_MENUS.flatMap((menu) => menu.links.map((link) => link.href)),
    ...HEADER_LINKS.map((link) => link.href),
  ];
  for (const href of [
    "/collections/new-arrivals",
    "/gifts",
    "/pearls/care",
    "/pearls/how-to-wear",
    "/pearls/freshwater-pearls",
    "/guardian-quiz",
    "/about",
  ]) assert.ok(hrefs.includes(href), href);
});

test("footer groups are Shop, Learn, About, and Help", () => {
  assert.deepEqual(FOOTER_GROUPS.map((group) => group.label), [
    "Shop",
    "Learn",
    "About",
    "Help",
  ]);
  assert.deepEqual(FOOTER_GROUPS[0].links[0], {
    label: "The Pearl Edit",
    href: "/collections/pearl-series",
  });
  assert.ok(FOOTER_GROUPS[1].links.some(({ href }) => href === "/faq"));
  assert.equal(FOOTER_GROUPS[3].links.some(({ href }) => href === "/faq"), false);
});

test("retired collections never return to public navigation", () => {
  const navigation = JSON.stringify({ HEADER_MENUS, HEADER_LINKS, FOOTER_GROUPS });
  assert.doesNotMatch(navigation, /balance\s*&\s*light|serenity collection|crystal/i);
});
```

**Step 2: Run the test and confirm it fails because the module does not exist**

Run: `npm run test:unit -- tests/storefront-navigation.test.ts`

Expected: FAIL with `Cannot find module '../src/lib/storefront/navigation'`.

**Step 3: Add the typed navigation registry**

```ts
export type NavigationLink = Readonly<{ label: string; href: string }>;
export type HeaderMenuId = "shop" | "gifts" | "discover";

export const HEADER_MENUS = [
  {
    id: "shop",
    label: "Shop",
    links: [
      { label: "All Pearl Jewelry", href: "/collections/pearl-series" },
      { label: "New Arrivals", href: "/collections/new-arrivals" },
      { label: "Pearl Earrings", href: "/collections/pearl-series?type=earrings" },
      { label: "Pearl Necklaces", href: "/collections/pearl-series?type=necklaces" },
      { label: "Pearl Bracelets", href: "/collections/pearl-series?type=bracelets" },
      { label: "Pearl Rings", href: "/collections/pearl-series?type=rings" },
      { label: "Pearl Eyewear Chains", href: "/collections/pearl-series?type=eyewear-chains" },
    ],
  },
  {
    id: "gifts",
    label: "Gifts",
    links: [
      { label: "All Gifts", href: "/gifts" },
      { label: "Under $50", href: "/gifts#under-50" },
      { label: "Under $70", href: "/gifts#under-70" },
      { label: "Everyday Pearls", href: "/gifts#everyday" },
      { label: "Statement Pearls", href: "/gifts#statement" },
    ],
  },
  {
    id: "discover",
    label: "Discover",
    links: [
      { label: "Pearl Knowledge", href: "/pearls" },
      { label: "Pearl Care", href: "/pearls/care" },
      { label: "How to Wear Pearls", href: "/pearls/how-to-wear" },
      { label: "Freshwater Pearls", href: "/pearls/freshwater-pearls" },
      { label: "Find Your Guardian", href: "/guardian-quiz" },
      { label: "Our Story", href: "/about" },
    ],
  },
] as const;

export const HEADER_LINKS = [] as const satisfies readonly NavigationLink[];

export const FOOTER_GROUPS = [
  { label: "Shop", links: [
    { label: "The Pearl Edit", href: "/collections/pearl-series" },
    { label: "New Arrivals", href: "/collections/new-arrivals" },
    { label: "Pearl Earrings", href: "/collections/pearl-series?type=earrings" },
    { label: "Pearl Necklaces", href: "/collections/pearl-series?type=necklaces" },
    { label: "Pearl Bracelets", href: "/collections/pearl-series?type=bracelets" },
    { label: "Pearl Rings", href: "/collections/pearl-series?type=rings" },
    { label: "Pearl Eyewear Chains", href: "/collections/pearl-series?type=eyewear-chains" },
  ] },
  { label: "Learn", links: [
    { label: "Pearl Guide", href: "/pearls" },
    { label: "Pearl Care", href: "/pearls/care" },
    { label: "How to Wear Pearls", href: "/pearls/how-to-wear" },
    { label: "Freshwater Pearls", href: "/pearls/freshwater-pearls" },
    { label: "FAQs", href: "/faq" },
  ] },
  { label: "About", links: [
    { label: "Our Story", href: "/about" },
    { label: "Find Your Guardian", href: "/guardian-quiz" },
    { label: "Contact", href: "/contact" },
  ] },
  { label: "Help", links: [
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Refund Policy", href: "/refund" },
    { label: "Track Order", href: "/track-order" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ] },
] as const;
```

Keep the header's current `Escape`, `ArrowDown`, outside-click, focus-return, mobile-dialog, overlay, and solid-state logic. Derive the menu ID type from `HeaderMenuId` instead of maintaining a local union. Render four footer groups in a five-column desktop grid with the brand/newsletter column first; do not put cards inside the footer.

**Step 4: Update browser assertions**

Replace Intention-menu assertions with Gifts and Discover assertions. Test `ArrowDown` and `Escape` for all three menus, and assert the new footer links.

**Step 5: Run focused verification**

Run: `npm run test:unit -- tests/storefront-navigation.test.ts`

Expected: PASS.

Run: `npx playwright test e2e/core-flows.spec.ts --grep "navigation|footer"`

Expected: PASS with the local server reused on port 3001.

**Step 6: Commit**

```bash
git add src/lib/storefront/navigation.ts src/components/layout/Header.tsx src/components/layout/Footer.tsx tests/storefront-navigation.test.ts e2e/core-flows.spec.ts
git commit -m "feat: expand storefront discovery navigation"
```

---

### Task 2: Add Deterministic Merchandising And Editorial Registries

**Files:**
- Create: `src/lib/editorial/gifts.ts`
- Create: `src/lib/editorial/guides.ts`
- Create: `tests/editorial-merchandising.test.ts`
- Create: `tests/editorial-guides.test.ts`

**Interfaces:**
- `getNewArrivalProducts()` returns only visible, active, in-stock products with `isNew === true`.
- `getGiftSections()` returns four ordered sections and deduplicates first-screen products across price sections where possible.
- `PEARL_GUIDES` is the single source for guide metadata, summaries, sections, FAQ, related product types, author, update date, and source links.

**Step 1: Write failing selector tests**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import {
  EVERYDAY_SLUGS,
  STATEMENT_SLUGS,
  getGiftSections,
  selectNewArrivalProducts,
} from "../src/lib/editorial/gifts";
import { getStorefrontProducts } from "../src/lib/storefront/catalog";

test("new arrivals are visible in-stock products marked new", () => {
  const products = selectNewArrivalProducts([
    { slug: "visible-new", isNew: true, isActive: true, inStock: true },
    { slug: "old", isNew: false, isActive: true, inStock: true },
    { slug: "inactive", isNew: true, isActive: false, inStock: true },
    { slug: "unavailable", isNew: true, isActive: true, inStock: false },
  ]);
  assert.deepEqual(products.map(({ slug }) => slug), ["visible-new"]);
});

test("gift price sections enforce their thresholds", () => {
  const sections = getGiftSections();
  for (const product of sections.find((section) => section.id === "under-50")!.products) {
    assert.ok(product.price < 50);
  }
  for (const product of sections.find((section) => section.id === "under-70")!.products) {
    assert.ok(product.price < 70);
  }
});

test("gift labels do not claim unverified popularity", () => {
  const copy = JSON.stringify(getGiftSections());
  assert.doesNotMatch(copy, /best seller|most loved|top rated/i);
});

test("every configured editorial gift SKU resolves in the current catalog", () => {
  const catalogSlugs = new Set(getStorefrontProducts().map(({ slug }) => slug));
  for (const slug of [...EVERYDAY_SLUGS, ...STATEMENT_SLUGS]) {
    assert.equal(catalogSlugs.has(slug), true, slug);
  }
});
```

**Step 2: Write the failing guide registry test**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { PEARL_GUIDES, PEARL_HUB_FAQ } from "../src/lib/editorial/guides";

test("pearl guide registry contains complete, citable articles", () => {
  assert.deepEqual(Object.keys(PEARL_GUIDES), [
    "care",
    "how-to-wear",
    "freshwater-pearls",
  ]);
  for (const guide of Object.values(PEARL_GUIDES)) {
    assert.equal(guide.author, "MythRealms Editorial");
    assert.match(guide.updated, /^2026-07-18$/);
    assert.ok(guide.sections.length >= 3);
    assert.ok(guide.faq.length >= 3);
    assert.ok(guide.sources.every((source) => source.href.startsWith("https://")));
  }
});

test("pearl hub owns a visible general FAQ set", () => {
  assert.ok(PEARL_HUB_FAQ.length >= 3);
  assert.ok(PEARL_HUB_FAQ.every(({ question, answer }) => question && answer));
});
```

**Step 3: Confirm both files fail to import**

Run: `npm run test:unit -- tests/editorial-merchandising.test.ts tests/editorial-guides.test.ts`

Expected: FAIL on the two missing modules.

**Step 4: Implement gift selectors with explicit editorial SKU lists**

Use these exact exported lists. Runtime selectors omit products that are unavailable, but the registry test must fail if a configured slug no longer resolves so an editor explicitly updates the list:

```ts
export const EVERYDAY_SLUGS = [
  "pearl-series-05",
  "pearl-series-13",
  "pearl-series-17",
  "new-series-white-shell-flower-drops",
  "new-series-pearl-drop-choker",
  "new-series-pearl-glasses-chain",
] as const;

export const STATEMENT_SLUGS = [
  "pearl-series-12",
  "pearl-series-14",
  "pearl-series-20",
  "new-series-mother-of-pearl-cluster-earrings",
  "new-series-pearl-y-lariat",
  "new-series-multi-strand-pearl-choker",
] as const;
```

Expose the pure selector and catalog wrapper separately so empty seasons are valid:

```ts
export function selectNewArrivalProducts<
  T extends Pick<StorefrontProduct, "isNew" | "isActive" | "inStock">
>(products: readonly T[]): T[] {
  return products.filter((product) => product.isNew && product.isActive && product.inStock);
}

export function getNewArrivalProducts() {
  return selectNewArrivalProducts(getStorefrontProducts());
}
```

The New Arrivals page must render an explanatory link back to The Pearl Edit when this wrapper returns an empty array.

Price sections sort ascending and take eight items. `Under $70` first excludes the eight `Under $50` slugs, then fills from remaining eligible products if fewer than eight remain. Everyday and Statement preserve editorial order. Every selector starts from `getStorefrontProducts()`, so inactive and unavailable products cannot leak into a landing page.

**Step 5: Implement the guide registry**

Use this exported shape:

```ts
export type GuideSlug = "care" | "how-to-wear" | "freshwater-pearls";
export type GuideSection = Readonly<{
  id: string;
  heading: string;
  answer: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  table?: Readonly<{ headers: readonly string[]; rows: readonly (readonly string[])[] }>;
}>;
export type PearlGuide = Readonly<{
  slug: GuideSlug;
  title: string;
  seoTitle: string;
  description: string;
  eyebrow: string;
  directAnswer: string;
  image: { src: string; alt: string; objectPosition?: string };
  author: "MythRealms Editorial";
  updated: "2026-07-18";
  sections: readonly GuideSection[];
  faq: readonly { question: string; answer: string }[];
  relatedTypes: readonly ("earrings" | "necklaces" | "bracelets" | "rings")[];
  sources: readonly { label: string; href: string }[];
}>;
```

Also export `PEARL_HUB_FAQ` as a dedicated set of general questions for the hub. Keep it separate from each article's FAQ and include a visible link from the hub to `/faq` for the complete customer FAQ.

Required article content:

- `care`: direct answer says put pearls on after cosmetics, wipe after wear, keep dry, store separately; sections cover daily routine, cleaning, storage, and what to avoid; include a do/don't table; sources include GIA pearl care guidance.
- `how-to-wear`: direct answer says choose placement first, then scale, then neckline/outfit; sections cover earrings, necklaces, wrist/hand, and mixing with daily wardrobes; include a placement-to-effect table; avoid age, body-type, or "flattering" rules.
- `freshwater-pearls`: direct answer defines cultured freshwater pearls and explains natural variation; sections cover formation, shape/luster/surface/tone, comparison considerations, and purchase checks; explicitly tell readers to use each product gallery as the exact visual reference.

All prose must be plain English, factual, and useful without a product purchase. Do not state that MythRealms pearls have a particular origin or grading unless the product record supplies it.

**Step 6: Run tests and commit**

Run: `npm run test:unit -- tests/editorial-merchandising.test.ts tests/editorial-guides.test.ts`

Expected: PASS.

```bash
git add src/lib/editorial/gifts.ts src/lib/editorial/guides.ts tests/editorial-merchandising.test.ts tests/editorial-guides.test.ts
git commit -m "feat: add editorial merchandising registries"
```

---

### Task 3: Build Reusable Editorial Layout And Schema Builders

**Files:**
- Create: `src/components/editorial/EditorialHero.tsx`
- Create: `src/components/editorial/GuideLayout.tsx`
- Create: `src/components/editorial/RelatedProducts.tsx`
- Create: `src/components/editorial/EditorialLinkBand.tsx`
- Create: `src/lib/seo/schema.ts`
- Create: `tests/structured-data.test.ts`
- Modify: `src/components/ui/JsonLd.tsx`

**Interfaces:**
- Editorial components are server components and accept serializable data only.
- `buildArticleSchema`, `buildAboutPageSchema`, `buildCollectionSchema`, `buildProductSchema`, `buildBreadcrumbListSchema`, `buildFAQPageSchema`, and `buildOrganizationSchema` return plain objects used by `JsonLd` and unit tests.
- `ArticleJsonLd` is a small wrapper in `JsonLd.tsx` that renders `buildArticleSchema(input)` through the existing safe `JsonLd` serializer.
- `RelatedProducts` accepts storefront products and maps them to the existing `ProductCard` shape.

**Step 1: Write failing schema tests**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import {
  buildAboutPageSchema,
  buildArticleSchema,
  buildBreadcrumbListSchema,
  buildCollectionSchema,
  buildFAQPageSchema,
  buildOrganizationSchema,
  buildProductSchema,
} from "../src/lib/seo/schema";

test("article schema mirrors visible editorial facts", () => {
  const schema = buildArticleSchema({
    title: "How to Care for Pearl Jewelry",
    description: "A practical care guide.",
    url: "https://example.com/pearls/care",
    image: "https://example.com/care.jpg",
    datePublished: "2026-07-18",
    dateModified: "2026-07-18",
  });
  assert.equal(schema["@type"], "Article");
  assert.deepEqual(schema.author, { "@type": "Organization", name: "MythRealms Editorial" });
  assert.equal(schema.headline, "How to Care for Pearl Jewelry");
});

test("collection schema contains only supplied product URLs", () => {
  const schema = buildCollectionSchema({
    name: "New Arrivals",
    description: "Recently added pearl jewelry.",
    url: "https://example.com/collections/new-arrivals",
    products: [{ name: "Pearl Drop", url: "https://example.com/products/pearl-drop" }],
  });
  assert.equal(schema.mainEntity.numberOfItems, 1);
  assert.equal(schema.mainEntity.itemListElement[0].url, "https://example.com/products/pearl-drop");
});

test("about schema identifies the page without inventing a founder", () => {
  const schema = buildAboutPageSchema({
    name: "About MythRealms",
    description: "The MythRealms pearl point of view.",
    url: "https://example.com/about",
  });
  assert.equal(schema["@type"], "AboutPage");
  assert.equal("founder" in schema, false);
});

test("product schema contains only verified commerce facts", () => {
  const schema = buildProductSchema({
    name: "Pearl Drop Earrings",
    description: "Pearl drop earrings.",
    images: ["https://example.com/product.jpg"],
    price: 39.99,
    currency: "USD",
    sku: "sku-1",
    availability: "InStock",
    url: "https://example.com/products/pearl-drop-earrings",
    brand: "MythRealms",
  });
  assert.equal(schema["@type"], "Product");
  assert.equal("aggregateRating" in schema, false);
  assert.equal("review" in schema, false);
  assert.equal("gtin" in schema, false);
});

test("breadcrumb and FAQ schema mirror supplied visible content", () => {
  const breadcrumb = buildBreadcrumbListSchema([
    { name: "Home", url: "https://example.com/" },
    { name: "Pearl Care", url: "https://example.com/pearls/care" },
  ]);
  const faq = buildFAQPageSchema([
    { question: "Can pearls get wet?", answer: "Keep them away from prolonged moisture." },
  ]);
  assert.equal(breadcrumb.itemListElement.length, 2);
  assert.equal(faq.mainEntity.length, 1);
  assert.equal(faq.mainEntity[0].name, "Can pearls get wet?");
});

test("organization schema accepts verified policy data without inventing people", () => {
  const schema = buildOrganizationSchema({
    url: "https://example.com",
    logo: "https://example.com/logo.png",
    contactEmail: "support@example.com",
  });
  assert.deepEqual(schema["@type"], ["Organization", "OnlineStore"]);
  assert.equal("founder" in schema, false);
});
```

**Step 2: Confirm failure, then implement pure builders**

Run: `npm run test:unit -- tests/structured-data.test.ts`

Expected: FAIL on missing `src/lib/seo/schema.ts`.

The builders must add `@context`, stable publisher/author organization data, and only caller-supplied facts. They must never synthesize aggregate ratings, reviews, GTIN, MPN, awards, certification, origin, or founder data. Refactor the existing `ProductJsonLd`, `BreadcrumbJsonLd`, `FAQPageJsonLd`, and `OrganizationJsonLd` components to call their corresponding pure builders, preserving current public behavior and giving all new route schemas the same tested implementation. `buildOrganizationSchema` accepts optional verified shipping and return-policy objects; Task 8 supplies those only after policy facts are centralized.

**Step 3: Implement editorial components**

`EditorialHero` props:

```ts
type EditorialHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: { src: string; alt: string; objectPosition?: string };
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
};
```

Use a full-width editorial composition with the image as the dominant first-viewport signal, readable text over a restrained solid scrim, square corners, and no floating hero card. Keep the next section visible at common desktop and mobile heights.

`GuideLayout` renders, in order: breadcrumb, hero/direct answer, table of contents, semantic `<article>`, section headings linked by IDs, optional table/checklist, visible FAQ, author/update/source block, related guides, and related products. `EditorialLinkBand` renders two image-led links without nesting cards. `RelatedProducts` uses a 2/3/4-column responsive grid.

**Step 4: Run tests and lint, then commit**

Run: `npm run test:unit -- tests/structured-data.test.ts`

Expected: PASS.

Run: `npm run lint -- src/components/editorial src/lib/seo/schema.ts src/components/ui/JsonLd.tsx`

Expected: PASS.

```bash
git add src/components/editorial src/lib/seo/schema.ts src/components/ui/JsonLd.tsx tests/structured-data.test.ts
git commit -m "feat: add editorial layouts and schema builders"
```

---

### Task 4: Add Gifts And New Arrivals Landing Pages

**Files:**
- Create: `src/app/gifts/page.tsx`
- Create: `src/app/collections/new-arrivals/page.tsx`
- Create: `tests/editorial-landing-pages.test.ts`
- Modify: `src/lib/editorial/gifts.ts`

**Interfaces:**
- Both pages consume selectors from `src/lib/editorial/gifts.ts` and schema builders from `src/lib/seo/schema.ts`.
- Neither page duplicates product filtering logic.
- Both pages render existing `ProductCard` through `RelatedProducts`.

**Step 1: Write failing route metadata tests and browser assertions**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { metadata as giftsMetadata } from "../src/app/gifts/page";
import { metadata as arrivalsMetadata } from "../src/app/collections/new-arrivals/page";
import { absoluteUrl } from "../src/lib/site";

test("gift and new-arrival routes declare unique social and canonical metadata", () => {
  assert.match(JSON.stringify(giftsMetadata.alternates), new RegExp(absoluteUrl("/gifts")));
  assert.match(
    JSON.stringify(arrivalsMetadata.alternates),
    new RegExp(absoluteUrl("/collections/new-arrivals")),
  );
  assert.ok(giftsMetadata.openGraph && giftsMetadata.twitter);
  assert.ok(arrivalsMetadata.openGraph && arrivalsMetadata.twitter);
});
```

Before implementation, add Playwright assertions for the Gifts H1, four section IDs, price thresholds, New Arrivals H1, and the empty-state contract by unit-testing `selectNewArrivalProducts([])`.

**Step 2: Confirm missing routes fail**

Run: `npm run test:unit -- tests/editorial-landing-pages.test.ts`

Expected: FAIL with `ENOENT` for `/gifts/page.tsx`.

**Step 3: Implement `/gifts`**

- Metadata title: `Pearl Jewelry Gifts | MythRealms Gift Guide`.
- Description: `Shop pearl jewelry gifts under $50 and $70, plus everyday and statement pearl edits selected from the current MythRealms catalog.`
- Canonical and OG URL: `/gifts`.
- Twitter card: `summary_large_image` using the same truthful editorial image and copy as Open Graph.
- Hero H1: `Pearl gifts, chosen by how they will be worn.`
- Intro copy explains the four edits without popularity claims.
- Render sections with exact IDs `under-50`, `under-70`, `everyday`, `statement` and their deterministic products.
- Add `CollectionPage` plus `ItemList` JSON-LD for all unique products rendered on the page.
- End with links to `/shipping`, `/returns`, and `/pearls/care`.

**Step 4: Implement `/collections/new-arrivals`**

- Metadata title: `New Pearl Jewelry Arrivals | MythRealms`.
- Canonical and OG URL: `/collections/new-arrivals`.
- Twitter card: `summary_large_image` using the same image and copy as Open Graph.
- H1: `New pearl arrivals.`
- Copy says these are recently added pieces in the active catalog; do not imply sales or popularity.
- Render all `getNewArrivalProducts()` products and CollectionPage/ItemList JSON-LD.
- If no products are currently new, render `There are no new arrivals right now.` and a link to `/collections/pearl-series`; do not render an empty product grid.

**Step 5: Verify and commit**

Run: `npm run test:unit -- tests/editorial-landing-pages.test.ts tests/editorial-merchandising.test.ts tests/structured-data.test.ts`

Expected: PASS.

Run: `npm run build`

Expected: both routes appear as prerendered public pages.

```bash
git add src/app/gifts/page.tsx src/app/collections/new-arrivals/page.tsx src/lib/editorial/gifts.ts tests/editorial-landing-pages.test.ts
git commit -m "feat: add gifts and new arrivals entry points"
```

---

### Task 5: Rebuild The Story Page And Preserve `/story`

**Files:**
- Create: `src/lib/editorial/story.ts`
- Modify: `src/app/about/page.tsx`
- Create: `src/app/story/page.tsx`
- Create: `tests/story-page.test.ts`
- Modify: `e2e/release-surfaces.spec.ts`

**Interfaces:**
- `/about` uses `EditorialHero`, `AboutPage` schema, existing brand media, and existing storefront links.
- `/story` has no duplicate content; it performs a 308 `permanentRedirect("/about")`.

**Step 1: Write the failing Story data and metadata test**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { metadata as aboutMetadata } from "../src/app/about/page";
import { STORY_CONTENT } from "../src/lib/editorial/story";

test("Story states the approved point of view and avoids invented claims", () => {
  const content = JSON.stringify(STORY_CONTENT);
  assert.equal(STORY_CONTENT.hero.title, "Pearls, edited for real life.");
  assert.match(content, /digitally created/i);
  assert.doesNotMatch(content, /our founder|our studio|handmade by us|sustainably sourced|ethical sourcing/i);
});

test("About owns unique canonical and social metadata", () => {
  assert.match(JSON.stringify(aboutMetadata.alternates), /\/about/);
  assert.ok(aboutMetadata.openGraph && aboutMetadata.twitter);
});
```

Add failing Playwright checks in `e2e/release-surfaces.spec.ts` for the new H1 and visible disclosure. Add a request-level redirect test with `maxRedirects: 0` that asserts `/story` returns status 308 and `location: /about`; this validates behavior instead of matching implementation strings.

**Step 2: Confirm failure, then implement the approved narrative**

Run: `npm run test:unit -- tests/story-page.test.ts`

Expected: FAIL because `STORY_CONTENT` is missing and the current About metadata has no page-specific Twitter card.

Page order and exact message responsibilities:

1. Hero: eyebrow `Our Story`; H1 `Pearls, edited for real life.`; copy positions MythRealms as a focused online pearl edit.
2. `Why pearls`: luster, natural variation, and ease across ordinary and dressier moments.
3. `How the edit is built`: selection by recognizable product structure, wearability, gallery clarity, and fit within a pearl-led storefront.
4. `Product reference and editorial styling`: source-supplied product photos are the reference; editorial images show styling context; some editorial images are digitally created and are not a substitute for product galleries.
5. `What we promise`: clear current pricing, availability, product galleries, shipping information, return information, and customer support. Do not promise material facts absent from the SKU.
6. Editorial image strip using the existing Mediterranean model and scene assets.
7. CTAs: `Shop the Pearl Edit`, `Read the Pearl Guide`, and `Explore Gifts`.

Add unique metadata, canonical `/about`, OG image, matching Twitter card, breadcrumb JSON-LD, and AboutPage JSON-LD. Keep exactly one `<main>` through the shared layout shell.

**Step 3: Add redirect and browser checks**

Playwright must assert the new H1, visible disclosure, loaded imagery, no horizontal overflow at 390x844, and `/story` ending at `/about`.

**Step 4: Verify and commit**

Run: `npm run test:unit -- tests/story-page.test.ts`

Expected: PASS.

Run: `npx playwright test e2e/release-surfaces.spec.ts --grep "Story|about"`

Expected: PASS.

```bash
git add src/lib/editorial/story.ts src/app/about/page.tsx src/app/story/page.tsx tests/story-page.test.ts e2e/release-surfaces.spec.ts
git commit -m "feat: rebuild the MythRealms Story"
```

---

### Task 6: Turn `/pearls` Into A Knowledge Hub And Add Three Guides

**Files:**
- Modify: `src/app/pearls/page.tsx`
- Create: `src/app/pearls/care/page.tsx`
- Create: `src/app/pearls/how-to-wear/page.tsx`
- Create: `src/app/pearls/freshwater-pearls/page.tsx`
- Create: `tests/pearl-guides.test.ts`
- Modify: `e2e/release-surfaces.spec.ts`

**Interfaces:**
- Hub and articles consume only `PEARL_GUIDES`.
- Article pages pass registry data to `GuideLayout`; route files own their static metadata and canonical URLs.
- Related products come from `getStorefrontProducts()` filtered by `getProductType()` and the guide's `relatedTypes`.

**Step 1: Write failing route metadata tests and browser contracts**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { metadata as careMetadata } from "../src/app/pearls/care/page";
import { metadata as stylingMetadata } from "../src/app/pearls/how-to-wear/page";
import { metadata as freshwaterMetadata } from "../src/app/pearls/freshwater-pearls/page";

for (const [slug, metadata] of [
  ["care", careMetadata],
  ["how-to-wear", stylingMetadata],
  ["freshwater-pearls", freshwaterMetadata],
] as const) {
  test(`${slug} has unique canonical and social metadata`, () => {
    assert.match(JSON.stringify(metadata.alternates), new RegExp(`/pearls/${slug}`));
    assert.ok(metadata.openGraph && metadata.twitter);
  });
}
```

Before implementation, add Playwright assertions that each route renders one H1, a direct-answer paragraph, table of contents, visible FAQ, author/update block, external source links, related products, and JSON-LD scripts whose types include `Article`, `BreadcrumbList`, and `FAQPage`.

**Step 2: Confirm missing route failures**

Run: `npm run test:unit -- tests/pearl-guides.test.ts`

Expected: three failing route assertions.

**Step 3: Implement the hub**

- H1: `Pearl knowledge for choosing, wearing, and caring.`
- Above the fold: one-sentence direct answer to what the hub contains and a real pearl editorial image.
- Three article entries with descriptive link text, summary, update date, and image.
- A `Start with the question you have` unframed link list.
- Visible FAQ sourced from the hub's current general pearl questions.
- A visible `Read all customer FAQs` link to `/faq` after the general pearl questions.
- Related products and CTA to the Pearl Edit.
- Metadata title: `Pearl Jewelry Guide: Care, Styling & Freshwater Pearls | MythRealms`.
- Canonical, Open Graph, and `summary_large_image` Twitter metadata all point to `/pearls` and use the visible hub hero image.

**Step 4: Implement the three article pages**

Each page:

- exports static metadata from its registry item;
- uses the exact canonical `/pearls/<slug>`;
- exports a `summary_large_image` Twitter card matching the page's Open Graph data;
- renders BreadcrumbList, Article, and FAQPage JSON-LD matching visible content;
- shows `MythRealms Editorial` and `Updated July 18, 2026` visibly;
- includes source links with `rel="noopener noreferrer"` where external;
- uses a semantic `<table>` when the registry has table data;
- links to the other two guides and 4-6 current products;
- remains readable with JavaScript disabled.

**Step 5: Verify content and rendering**

Run: `npm run test:unit -- tests/editorial-guides.test.ts tests/pearl-guides.test.ts tests/structured-data.test.ts`

Expected: PASS.

Run: `npx playwright test e2e/release-surfaces.spec.ts --grep "pearl guide|knowledge"`

Expected: PASS at mobile and desktop sizes, with images loaded and no overflow.

**Step 6: Commit**

```bash
git add src/app/pearls tests/pearl-guides.test.ts e2e/release-surfaces.spec.ts
git commit -m "feat: add the pearl knowledge hub"
```

---

### Task 7: Add Restrained Homepage And Product-Page Discovery Links

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/lib/homepage-editorial.ts`
- Modify: `src/components/home/HomepageEditorialStory.tsx`
- Modify: `src/app/products/[slug]/1688-product.tsx`
- Modify: `tests/homepage-editorial.test.ts`
- Modify: `e2e/core-flows.spec.ts`

**Interfaces:**
- Homepage consumes `EditorialLinkBand` with exactly two entries.
- Product detail pages link to the guides but do not alter product images, descriptions, prices, cart behavior, or JSON-LD facts.

**Step 1: Extend the failing homepage contract**

```ts
import { HOMEPAGE_EDITORIAL_LINKS } from "../src/lib/homepage-editorial";

test("homepage promotes only the two approved editorial destinations", () => {
  assert.deepEqual(
    HOMEPAGE_EDITORIAL_LINKS.map(({ label, href }) => [label, href]),
    [
      ["Pearl Gift Guide", "/gifts"],
      ["Pearl Knowledge", "/pearls"],
    ],
  );
  assert.deepEqual(
    HOMEPAGE_EDITORIAL_LINKS[1].links.map(({ href }) => href),
    ["/pearls", "/pearls/care", "/pearls/how-to-wear"],
  );
});
```

Run: `npm run test:unit -- tests/homepage-editorial.test.ts`

Expected: FAIL because `HOMEPAGE_EDITORIAL_LINKS` is missing.

**Step 2: Add the two editorial links**

Use existing approved media:

```ts
export const HOMEPAGE_EDITORIAL_LINKS = [
  {
    label: "Pearl Gift Guide",
    title: "Choose by the way they wear it.",
    copy: "Pearl gifts under $50 and $70, plus everyday and statement edits.",
    href: "/gifts",
    image: HOMEPAGE_MEDIA.earrings,
  },
  {
    label: "Pearl Knowledge",
    title: "Care, styling, and freshwater pearls.",
    copy: "Straight answers for choosing and looking after pearl jewelry.",
    href: "/pearls",
    image: HOMEPAGE_MEDIA.seaside,
    links: [
      { label: "Pearl Guide", href: "/pearls" },
      { label: "Pearl Care", href: "/pearls/care" },
      { label: "How to Wear Pearls", href: "/pearls/how-to-wear" },
    ],
  },
] as const;
```

Place the band after `HomepageEditorialStory` and before `HomepageGuardian`. Keep it image-led, full-width, and limited to these two destinations.

**Step 3: Add product-guide links**

Near the lower product-details area, add an unframed `Learn about your pearls` section with:

- `How to care for pearl jewelry` -> `/pearls/care`
- `How to wear pearls` -> `/pearls/how-to-wear`
- `What are freshwater pearls?` -> `/pearls/freshwater-pearls`

Do not use these links to state that a product is freshwater unless its product record says so.

**Step 4: Verify and commit**

Run: `npm run test:unit -- tests/homepage-editorial.test.ts`

Expected: PASS.

Run: `npx playwright test e2e/core-flows.spec.ts --grep "homepage|product"`

Expected: PASS; hero remains fully visible at 320x800 and 390x844.

```bash
git add src/app/page.tsx src/lib/homepage-editorial.ts src/components/home/HomepageEditorialStory.tsx src/app/products/[slug]/1688-product.tsx tests/homepage-editorial.test.ts e2e/core-flows.spec.ts
git commit -m "feat: connect shopping and pearl knowledge journeys"
```

---

### Task 8: Complete SEO/GEO Discovery Surfaces And AI Referral Tracking

**Files:**
- Create: `src/lib/analytics/referral.ts`
- Create: `tests/referral-source.test.ts`
- Create: `src/lib/storefront/policies.ts`
- Create: `tests/storefront-policies.test.ts`
- Create: `src/app/llms.txt/route.ts`
- Delete: `public/llms.txt`
- Create: `docs/seo-domain-launch.md`
- Modify: `src/components/layout/Analytics.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/robots.ts`
- Modify: `src/components/ui/JsonLd.tsx`
- Modify: `src/app/collections/[slug]/page.tsx`
- Modify: `src/app/shipping/page.tsx`
- Modify: `src/app/refund/page.tsx`
- Modify: `tests/seo-catalog.test.ts`

**Interfaces:**
- `classifyReferralSource(locationHref)` returns `"chatgpt.com"` only for the approved ChatGPT campaign parameter, otherwise `null`.
- `/llms.txt` is generated from `siteUrl`, so it follows `NEXT_PUBLIC_APP_URL` after a custom domain is configured.
- Sitemap enumerates every canonical public content route and every public product, never query URLs.

**Step 1: Write failing referral-source tests**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { classifyReferralSource } from "../src/lib/analytics/referral";

test("classifies only the approved ChatGPT campaign source", () => {
  assert.equal(
    classifyReferralSource("https://shop.example/?utm_source=chatgpt.com"),
    "chatgpt.com",
  );
  assert.equal(
    classifyReferralSource("https://shop.example/?utm_source=perplexity.ai"),
    null,
  );
});

test("does not label ordinary direct traffic as AI referral", () => {
  assert.equal(classifyReferralSource("https://shop.example/"), null);
});
```

**Step 2: Write failing policy, sitemap, and llms tests**

Centralize only facts already visible on `/shipping` and `/refund`:

```ts
import { STORE_POLICY_FACTS } from "../src/lib/storefront/policies";

test("structured policy facts match the public shipping and return promises", () => {
  assert.deepEqual(STORE_POLICY_FACTS, {
    freeShippingThresholdUsd: 69.99,
    handlingBusinessDays: { min: 2, max: 5 },
    usStandardTransitBusinessDays: { min: 8, max: 14 },
    returnWindowDays: 30,
    returnMethod: "https://schema.org/ReturnByMail",
    defaultReturnFees: "https://schema.org/ReturnShippingFees",
  });
});
```

Refactor the visible headline facts on `/shipping` and `/refund` to render these constants, then test `buildOrganizationSchema` includes:

- a `ShippingService` named `MythRealms Standard Shipping`, linked to `/shipping`, whose description states 2-5 business-day handling, 8-14 business-day US standard transit, and free shipping over $69.99;
- a US `MerchantReturnPolicy` linked to `/refund`, with a 30-day finite window, return by mail, and customer-paid return shipping by default;
- no claim that all returns are free, because the public policy says MythRealms pays only when the return is caused by its error.

Assert sitemap contains:

```ts
const canonicalContentPaths = [
  "/gifts",
  "/collections/new-arrivals",
  "/pearls",
  "/pearls/care",
  "/pearls/how-to-wear",
  "/pearls/freshwater-pearls",
  "/about",
];
```

Assert no sitemap URL contains `?`. Import `GET` from `src/app/llms.txt/route`, read its response text, and assert it contains URLs derived from `siteUrl`, the new guides, the gift guide, the product feed, and the truth guardrails.

Extend the existing retired-language contract so the new navigation registry, sitemap output, llms response, and product feed remain free of `Balance & Light`, `The Serenity Collection`, crystal positioning, and all other retired collection names.

**Step 3: Confirm tests fail**

Run: `npm run test:unit -- tests/referral-source.test.ts tests/storefront-policies.test.ts tests/seo-catalog.test.ts`

Expected: FAIL on the missing referral module, missing policy module, missing llms route, and missing sitemap URLs.

**Step 4: Implement consent-aware AI referral classification**

```ts
export function classifyReferralSource(locationHref: string) {
  const current = new URL(locationHref);
  const campaign = current.searchParams.get("utm_source")?.toLowerCase();
  return campaign === "chatgpt.com" ? "chatgpt.com" : null;
}
```

After analytics consent and GA initialization, send one `ai_referral` event per session with `{ source: "chatgpt.com" }`, guarded by `sessionStorage`. Do not run tracking before consent. Preserve Meta and Pinterest behavior. Do not classify or emit events for other answer platforms in this scope.

**Step 5: Generate `/llms.txt` from the canonical site URL**

The route returns `text/plain; charset=utf-8` and documents:

- brand, language, support email;
- Pearl Edit scope and product-gallery truth rule;
- no medical or guaranteed emotional claims;
- canonical links to collection, new arrivals, gifts, Story, all pearl guides, policies, sitemap, robots, and product feed;
- instruction to cite the most specific product, guide, collection, or policy page.

Remove `public/llms.txt` so only one root resource exists.

**Step 6: Update crawl and schema surfaces**

- Add all canonical content routes to sitemap with appropriate monthly/weekly frequencies.
- Preserve OAI-SearchBot and OAI-AdsBot access to public pages and the exact `/api/feed$` exception.
- Preserve private/API disallows and wildcard rules.
- Use the pure Collection schema builder in `/collections/pearl-series`.
- Keep the existing single Product JSON-LD object emitted by `Product1688`; verify that the refactored `ProductJsonLd` wrapper still emits exactly one Product object per page.
- Keep Offer fields limited to visible URL, USD price, availability, and new condition. Do not include rating/review fields from the legacy product records because those are not verified customer data.
- Organization schema must receive the tested `STORE_POLICY_FACTS`, link to `/refund`, `/shipping`, and `/contact`, and emit the verified ShippingService and MerchantReturnPolicy described in Step 2. It must not add unsupported founder, sourcing, certification, origin, or free-return claims.
- Do not fabricate an `OfferShippingDetails.shippingRate` for sub-threshold orders because the visible policy says the rate is calculated at checkout. If Google Rich Results requires a field that the store cannot truthfully supply, omit that enhancement and retain the factual ShippingService description.

**Step 7: Add the custom-domain launch runbook**

`docs/seo-domain-launch.md` must list, in order:

1. connect the owned domain to Vercel;
2. set `NEXT_PUBLIC_APP_URL` to the exact HTTPS URL of the connected production domain in Vercel Production;
3. redeploy and verify canonical, sitemap, robots, llms, OG, checkout callback, and feed URLs;
4. add and verify the property in Google Search Console and Bing Webmaster Tools;
5. submit sitemap;
6. add IndexNow key and submit changed canonical URLs only after the domain is stable;
7. update social profiles and merchant destinations;
8. retain the Vercel domain as a redirect, not a second canonical host.

The runbook must describe the domain as a user-supplied value and must not hardcode an unconfirmed production host.

**Step 8: Verify and commit**

Run: `npm run test:unit -- tests/referral-source.test.ts tests/storefront-policies.test.ts tests/seo-catalog.test.ts tests/structured-data.test.ts`

Expected: PASS.

Run: `npm run build`

Expected: PASS with `/llms.txt`, sitemap, robots, guides, gifts, and new arrivals listed in the route output.

```bash
git add src/lib/analytics/referral.ts src/lib/storefront/policies.ts src/app/llms.txt/route.ts docs/seo-domain-launch.md src/components/layout/Analytics.tsx src/app/sitemap.ts src/app/robots.ts src/components/ui/JsonLd.tsx src/app/collections/[slug]/page.tsx src/app/shipping/page.tsx src/app/refund/page.tsx tests/referral-source.test.ts tests/storefront-policies.test.ts tests/seo-catalog.test.ts
git rm public/llms.txt
git commit -m "feat: strengthen storefront SEO and answer discovery"
```

---

### Task 9: Add End-To-End And Visual Release Coverage

**Files:**
- Modify: `e2e/core-flows.spec.ts`
- Modify: `e2e/release-surfaces.spec.ts`
- Create: `e2e/editorial-visuals.spec.ts`
- Create: `e2e/editorial-visuals.spec.ts-snapshots/homepage-chromium-win32.png`
- Create: `e2e/editorial-visuals.spec.ts-snapshots/story-chromium-win32.png`
- Create: `e2e/editorial-visuals.spec.ts-snapshots/pearls-hub-chromium-win32.png`
- Create: `e2e/editorial-visuals.spec.ts-snapshots/gifts-mobile-chromium-win32.png`

**Step 1: Add failing journey tests before visual snapshots**

Required journeys:

- desktop Shop, Gifts, and Discover menus open, navigate, close on Escape, and restore focus;
- mobile menu exposes the same route families without overflow;
- `/gifts#under-50` scroll target exists and every rendered price is below $50;
- `/collections/new-arrivals` renders only products returned by `getNewArrivalProducts()`;
- `/story` returns a permanent redirect and lands on `/about`;
- every guide has one H1, table of contents, visible FAQ, author/update text, source links, related products, and loaded images;
- all new pages render their primary content with JavaScript disabled;
- all internal links in the Story, gift, and pearl journeys return a non-error response;
- no new page has horizontal overflow at 320x800, 390x844, or 1440x900.

Run: `npx playwright test e2e/core-flows.spec.ts e2e/release-surfaces.spec.ts`

Expected before implementation is complete: FAIL on missing routes and labels.

**Step 2: Add stable visual assertions**

```ts
import { expect, test } from "@playwright/test";

test("homepage editorial discovery", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("heading", { name: "Choose by the way they wear it." }).scrollIntoViewIfNeeded();
  await expect(page).toHaveScreenshot("homepage.png", { fullPage: true, animations: "disabled" });
});
```

Create equivalent snapshots for `/about`, `/pearls`, and mobile `/gifts`. Mask only genuinely dynamic fields such as the footer year if necessary; do not mask layout, images, headings, product grids, or navigation.

**Step 3: Generate and inspect baselines**

Run: `npx playwright test e2e/editorial-visuals.spec.ts --update-snapshots`

Expected: four snapshots generated. Open each image and inspect text fit, image crop, section rhythm, product integrity, and card nesting before accepting it.

**Step 4: Run the final browser suite**

Run: `npx playwright test`

Expected: PASS.

**Step 5: Commit**

```bash
git add e2e/core-flows.spec.ts e2e/release-surfaces.spec.ts e2e/editorial-visuals.spec.ts e2e/editorial-visuals.spec.ts-snapshots
git commit -m "test: cover editorial discovery journeys"
```

---

### Task 10: Full Verification And Review Handoff

**Files:**
- Modify only files required by verification findings; do not deploy in this task.

**Step 1: Run all unit tests**

Run: `npm run test:unit`

Expected: all tests PASS, including the existing 45-product catalog and truthfulness contracts.

**Step 2: Run lint**

Run: `npm run lint`

Expected: PASS with no new warnings.

**Step 3: Run production build**

Run: `npm run build`

Expected: PASS; all public editorial routes are prerendered, and private routes retain their current behavior.

**Step 4: Run Playwright**

Run: `npx playwright test`

Expected: PASS.

**Step 5: Inspect generated public responses locally**

Run the production server on an unused local port, then verify:

```bash
curl -I http://127.0.0.1:3002/story
curl http://127.0.0.1:3002/robots.txt
curl http://127.0.0.1:3002/sitemap.xml
curl http://127.0.0.1:3002/llms.txt
```

Expected: `/story` returns 308 to `/about`; public discovery files return 200 and reference the configured canonical host.

**Step 6: Truth and placeholder scan**

Run:

```bash
rg -n -i "best seller|most loved|top rated|our founder|our studio|handmade by us|sustainably sourced|ethical sourcing|balance[[:space:]]*&[[:space:]]*light|serenity collection|crystals?|lorem|todo|placeholder" src/app/about src/app/gifts src/app/collections/new-arrivals src/app/pearls src/lib/editorial src/lib/storefront/navigation.ts src/app/sitemap.ts
```

Expected: no unsupported claims or unfinished copy. Contextually legitimate phrases must be manually reviewed, not blindly removed.

**Step 7: Review diff and hand off local URL**

Run: `git status --short && git diff --check && git log --oneline --decorate -10`

Expected: clean worktree, no whitespace errors, and one focused commit per completed task. Start the verified local server and provide its URL for user review. Do not merge, push, or deploy until the user explicitly approves the reviewed implementation.
