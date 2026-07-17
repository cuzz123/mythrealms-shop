# Mediterranean Editorial Storefront Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the MythRealms homepage and shared storefront visual layer around the approved Mediterranean Editorial direction while preserving product truth, navigation usability, SEO/GEO signals, and checkout behavior.

**Architecture:** Keep the homepage as a static Server Component that composes focused editorial sections from a typed media manifest. Restrict client JavaScript to the existing interactive header, product controls, newsletter, and a small IntersectionObserver-based reveal component. Add explicit product image roles so cards never infer an on-model image from array position or filename.

**Tech Stack:** Next.js 16.2.6 App Router, React 19.2.4, TypeScript 5.9, Tailwind CSS 4 utilities, global CSS tokens, `next/image`, Lucide React, Node test runner, Playwright.

## Global Constraints

- Implement in `D:\mythrealms-shop`; preserve every unrelated staged, modified, and untracked file.
- Use `git commit --only -- <task paths>` for every task so existing video and Blender staging is not included.
- Follow Next.js 16 local documentation under `node_modules/next/dist/docs/`; use `Image preload` instead of deprecated `priority` for the single LCP hero image.
- Do not add a motion dependency. Use the existing CSS-first stack and a focused client IntersectionObserver.
- Generated product imagery must preserve at least 95% visible similarity to the source product. Do not introduce or approve new SKU-specific AI imagery in this implementation.
- Keep checkout, payment, cart state, pricing, inventory, account, and admin behavior unchanged.
- Keep all 45 public pearl SKUs and every public product-type filter discoverable.
- No Vercel deployment. Finish with a local URL and desktop/mobile visual evidence.
- No infinite floating, pulsing, shimmer, glow, automatic zoom, or decorative motion loops.
- `prefers-reduced-motion: reduce` must render content immediately with nonessential motion removed.

---

## File Map

### New files

- `src/lib/homepage-editorial.ts`: typed homepage media and category-link manifest.
- `src/components/home/HomepageHero.tsx`: full-bleed hero and primary calls to action.
- `src/components/home/HomepageCategoryStories.tsx`: three photographic category stories and two compact category index links.
- `src/components/home/HomepagePearlEdit.tsx`: selected product edit using the shared truthful card media contract.
- `src/components/home/HomepageEditorialStory.tsx`: Pearl Guide and brand story image/text bands.
- `src/components/home/HomepageGuardian.tsx`: scene-led quiz entry and borderless archetype index.
- `tests/homepage-editorial.test.ts`: media existence, category-link, and homepage source-contract tests.
- `public/images/brand/editorial/model-short-bob-blue-linen.png`: approved model asset copied from the curated style pack.
- `public/images/brand/editorial/scene-seaside-stairs.png`: approved seaside scene copied from the curated style pack.
- `public/images/brand/editorial/scene-olive-courtyard.png`: approved courtyard scene copied from the curated style pack.

### Modified files

- `src/app/page.tsx`: compose the new homepage sections and preserve static metadata.
- `src/app/layout.tsx`: remove the duplicate manual image preload after the hero owns `preload`.
- `src/app/globals.css`: refine tokens, remove storefront-facing synthetic effects, and define reveal/header/editorial utilities.
- `src/components/layout/HeroCarousel.tsx`: remove after replacing its import with `HomepageHero`.
- `src/components/layout/Header.tsx`: transparent-over-hero state, solid scrolled state, restored Intention menu, accessible menu behavior.
- `src/components/layout/Footer.tsx`: charcoal editorial footer without a gradient.
- `src/components/layout/NewsletterForm.tsx`: light/dark tone contract and accessible status output.
- `src/components/layout/SearchOverlay.tsx`: remove the decorative infinite empty-state animation.
- `src/components/product/ProductCard.tsx`: consume explicit image roles and restrained interactions.
- `src/components/ui/Button.tsx`: shared sea-green, lightly squared button styling.
- `src/components/ui/ScrollReveal.tsx`: progressive IntersectionObserver reveal with reduced-motion support.
- `src/lib/1688-products.ts`: explicit `imageRoles` type and role assignment for source-preserved pearl products.
- `src/lib/new-series-products.ts`: explicit primary/detail roles with no fabricated wearing role.
- `src/lib/storefront/catalog.ts`: clone `imageRoles` with the rest of each product.
- `src/app/collections/[slug]/1688-collection.tsx`: pass image roles into `ProductCard`.
- `e2e/core-flows.spec.ts`: homepage editorial, header-state, navigation, image, overflow, and reduced-motion coverage.
- `e2e/release-surfaces.spec.ts`: update hero truth assertion without weakening storefront checks.
- `tests/storefront-catalog.test.ts`: product image-role contract coverage.
- `tests/storefront-trust.test.ts`: new hero file and no synthetic-effect source assertions.

---

### Task 1: Establish Homepage Media And Product Image Roles

**Files:**
- Create: `src/lib/homepage-editorial.ts`
- Create: `tests/homepage-editorial.test.ts`
- Create: `public/images/brand/editorial/model-short-bob-blue-linen.png`
- Create: `public/images/brand/editorial/scene-seaside-stairs.png`
- Create: `public/images/brand/editorial/scene-olive-courtyard.png`
- Modify: `src/lib/1688-products.ts:2,86-139`
- Modify: `src/lib/new-series-products.ts:12-46`
- Modify: `src/lib/storefront/catalog.ts:34-43`
- Modify: `tests/storefront-catalog.test.ts`

**Interfaces:**
- Produces: `EditorialImage`, `HOMEPAGE_MEDIA`, `HOMEPAGE_CATEGORY_LINKS`, `homepageEditorialSources()`.
- Produces: `ProductImageRoles = { primary: string; wearing?: string; detail?: string }` on public `Product` records.
- Consumers: Tasks 2 and 4.

- [ ] **Step 1: Write failing media-contract tests**

Create `tests/homepage-editorial.test.ts` with exact public-path and category assertions:

```ts
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import {
  HOMEPAGE_CATEGORY_LINKS,
  homepageEditorialSources,
} from "../src/lib/homepage-editorial";

test("homepage editorial media exists under public and stays portable", () => {
  for (const source of homepageEditorialSources()) {
    assert.match(source, /^\/images\/brand\//);
    assert.equal(existsSync(resolve("public", source.slice(1))), true, source);
  }
});

test("homepage exposes all approved pearl shopping categories", () => {
  assert.deepEqual(
    HOMEPAGE_CATEGORY_LINKS.map(({ label, href }) => [label, href]),
    [
      ["Everyday Pearl", "/collections/pearl-series"],
      ["Pearl Earrings", "/collections/pearl-series?type=earrings"],
      ["Pearl Necklaces", "/collections/pearl-series?type=necklaces"],
      ["Pearl Bracelets", "/collections/pearl-series?type=bracelets"],
      ["Pearl Eyewear Chains", "/collections/pearl-series?type=eyewear-chains"],
    ],
  );
});
```

Append role assertions to `tests/storefront-catalog.test.ts`:

```ts
test("storefront products expose truthful card image roles", () => {
  const sourcePreserved = getStorefrontProductBySlug("pearl-series-13");
  const noSupplierWearing = getStorefrontProductBySlug("pearl-series-18");
  const newSeries = getStorefrontProductBySlug("new-series-round-shell-disc-drops");

  assert.ok(sourcePreserved?.imageRoles?.wearing);
  assert.equal(noSupplierWearing?.imageRoles?.wearing, undefined);
  assert.equal(newSeries?.imageRoles?.wearing, undefined);
  assert.equal(newSeries?.imageRoles?.primary, newSeries?.images[0]);
});
```

- [ ] **Step 2: Run tests and verify the new contracts fail**

Run:

```powershell
npm run test:unit -- tests/homepage-editorial.test.ts tests/storefront-catalog.test.ts
```

Expected: FAIL because `src/lib/homepage-editorial.ts` and `imageRoles` do not exist.

- [ ] **Step 3: Copy the approved portable assets into public**

Run:

```powershell
New-Item -ItemType Directory -Force -Path 'public\images\brand\editorial'
Copy-Item -LiteralPath 'assets\product-imagery\style-references\model-short-bob-blue-linen.png' -Destination 'public\images\brand\editorial\model-short-bob-blue-linen.png'
Copy-Item -LiteralPath 'assets\product-imagery\style-references\scene-seaside-stairs.png' -Destination 'public\images\brand\editorial\scene-seaside-stairs.png'
Copy-Item -LiteralPath 'assets\product-imagery\style-references\scene-olive-courtyard.png' -Destination 'public\images\brand\editorial\scene-olive-courtyard.png'
```

- [ ] **Step 4: Add the typed homepage manifest**

Create `src/lib/homepage-editorial.ts` with this public contract:

```ts
export type EditorialImage = {
  src: string;
  alt: string;
  objectPosition?: string;
};

export const HOMEPAGE_MEDIA = {
  hero: {
    src: "/images/brand/hero/pearl-earrings-editorial.png",
    alt: "Model wearing pearl earrings in Mediterranean sunlight",
    objectPosition: "center 38%",
  },
  everyday: {
    src: "/images/brand/editorial/model-short-bob-blue-linen.png",
    alt: "Model in pale linen wearing pearl jewelry outdoors",
  },
  earrings: {
    src: "/images/brand/hero/pearl-earrings-editorial.png",
    alt: "Pearl earrings worn in warm natural light",
  },
  necklaces: {
    src: "/images/brand/hero/pearl-necklace-editorial.png",
    alt: "Pearl necklace worn with a white linen shirt",
  },
  bracelets: {
    src: "/images/brand/hero/pearl-bracelet-editorial.png",
    alt: "Pearl bracelet worn in warm cafe light",
  },
  eyewear: {
    src: "/images/brand/hero/pearl-eyewear-chain-editorial.png",
    alt: "Pearl eyewear chain shown against a dark background",
  },
  seaside: {
    src: "/images/brand/editorial/scene-seaside-stairs.png",
    alt: "Sunlit limestone steps leading toward the sea",
  },
  courtyard: {
    src: "/images/brand/editorial/scene-olive-courtyard.png",
    alt: "Olive courtyard in warm afternoon light",
  },
} as const satisfies Record<string, EditorialImage>;

export const HOMEPAGE_CATEGORY_LINKS = [
  { label: "Everyday Pearl", href: "/collections/pearl-series", image: HOMEPAGE_MEDIA.everyday },
  { label: "Pearl Earrings", href: "/collections/pearl-series?type=earrings", image: HOMEPAGE_MEDIA.earrings },
  { label: "Pearl Necklaces", href: "/collections/pearl-series?type=necklaces", image: HOMEPAGE_MEDIA.necklaces },
  { label: "Pearl Bracelets", href: "/collections/pearl-series?type=bracelets", image: HOMEPAGE_MEDIA.bracelets },
  { label: "Pearl Eyewear Chains", href: "/collections/pearl-series?type=eyewear-chains", image: HOMEPAGE_MEDIA.eyewear },
] as const;

export function homepageEditorialSources(): string[] {
  return [...new Set(Object.values(HOMEPAGE_MEDIA).map(({ src }) => src))];
}
```

- [ ] **Step 5: Add explicit product image roles**

Expand `Product` in `src/lib/1688-products.ts` with:

```ts
export type ProductImageRoles = {
  primary: string;
  wearing?: string;
  detail?: string;
};

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryName: string;
  description: string;
  price: number;
  compareAt?: number;
  image: string;
  images: string[];
  imageRoles?: ProductImageRoles;
  tag?: string;
  isBestSeller: boolean;
  isNew: boolean;
  isActive: boolean;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  intention?: string;
  benefitTriplet?: string;
}
```

When applying `SOURCE_PRESERVED_PRODUCT_IMAGES`, assign the roles with this exact rule:

```ts
if (images) {
  const [primary, alternate, detail] = images;
  const hasSupplierWearingImage = product.slug !== "pearl-series-18";
  product.image = primary;
  product.images = [...images];
  product.imageRoles = {
    primary,
    ...(hasSupplierWearingImage ? { wearing: alternate } : {}),
    detail: hasSupplierWearingImage ? detail : alternate,
  };
}
```

In `new-series-products.ts`, assign only roles that the supplier gallery actually proves:

```ts
imageRoles: {
  primary: images[0],
  ...(images[1] ? { detail: images[1] } : {}),
},
```

Clone roles in `src/lib/storefront/catalog.ts` without sharing mutable objects:

```ts
function cloneProduct(product: Product): Product {
  return {
    ...product,
    images: [...product.images],
    imageRoles: product.imageRoles ? { ...product.imageRoles } : undefined,
  };
}
```

- [ ] **Step 6: Re-run focused tests**

Run:

```powershell
npm run test:unit -- tests/homepage-editorial.test.ts tests/storefront-catalog.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit Task 1 only**

```powershell
git add -- 'src/lib/homepage-editorial.ts' 'src/lib/1688-products.ts' 'src/lib/new-series-products.ts' 'src/lib/storefront/catalog.ts' 'tests/homepage-editorial.test.ts' 'tests/storefront-catalog.test.ts' 'public/images/brand/editorial/model-short-bob-blue-linen.png' 'public/images/brand/editorial/scene-seaside-stairs.png' 'public/images/brand/editorial/scene-olive-courtyard.png'
git commit --only -m "feat: define truthful editorial media contracts" -- 'src/lib/homepage-editorial.ts' 'src/lib/1688-products.ts' 'src/lib/new-series-products.ts' 'src/lib/storefront/catalog.ts' 'tests/homepage-editorial.test.ts' 'tests/storefront-catalog.test.ts' 'public/images/brand/editorial/model-short-bob-blue-linen.png' 'public/images/brand/editorial/scene-seaside-stairs.png' 'public/images/brand/editorial/scene-olive-courtyard.png'
```

### Task 2: Build The Photography-Led Homepage

**Files:**
- Create: `src/components/home/HomepageHero.tsx`
- Create: `src/components/home/HomepageCategoryStories.tsx`
- Create: `src/components/home/HomepagePearlEdit.tsx`
- Create: `src/components/home/HomepageEditorialStory.tsx`
- Create: `src/components/home/HomepageGuardian.tsx`
- Modify: `src/app/page.tsx:1-211`
- Modify: `src/app/layout.tsx:52-55`
- Delete: `src/components/layout/HeroCarousel.tsx`
- Modify: `e2e/release-surfaces.spec.ts:69-84`
- Modify: `tests/storefront-trust.test.ts:15-20`

**Interfaces:**
- Consumes: `HOMEPAGE_MEDIA`, `HOMEPAGE_CATEGORY_LINKS`, and server-side storefront products.
- Produces: semantic section labels `The Pearl Edit`, `Shop by Style`, `Pearl Guide`, and `Find Your Guardian` for tests and navigation.

- [ ] **Step 1: Update tests to the approved hero and sections**

Change the release-surface test to assert the new hero and truthful editorial label:

```ts
await page.goto("/");
await expect(page.getByRole("heading", { level: 1, name: "Pearls for sunlit days." })).toBeVisible();
await expect(page.getByText("Editorial / Summer 2026", { exact: true })).toBeVisible();
await expect(page.getByRole("heading", { name: "Choose your starting point" })).toBeVisible();
await expect(page.getByRole("heading", { name: "A pearl point of view." })).toBeVisible();
```

Update `tests/storefront-trust.test.ts` to read `src/components/home/HomepageHero.tsx` and retain the rule that editorial hero imagery is not presented as a named SKU.

- [ ] **Step 2: Run tests and confirm the new homepage assertions fail**

Run:

```powershell
npm run test:unit -- tests/storefront-trust.test.ts
npx playwright test e2e/release-surfaces.spec.ts --grep "editorial and utility surfaces"
```

Expected: FAIL because the approved hero and section headings are not rendered.

- [ ] **Step 3: Implement the full-bleed hero**

Create `HomepageHero.tsx` as a Server Component using `Image preload` and no card wrapper:

```tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_MEDIA } from "@/lib/homepage-editorial";

export function HomepageHero() {
  const hero = HOMEPAGE_MEDIA.hero;
  return (
    <section className="relative -mt-16 min-h-[calc(100svh-2.25rem)] overflow-hidden bg-[#24312f] text-white" aria-labelledby="homepage-hero-title">
      <Image
        src={hero.src}
        alt={hero.alt}
        fill
        preload
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: hero.objectPosition }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,22,21,.74)_0%,rgba(13,22,21,.28)_48%,rgba(13,22,21,.06)_72%)]" />
      <div className="relative mx-auto flex min-h-[calc(100svh-2.25rem)] max-w-7xl items-end px-6 pb-16 pt-32 md:pb-20">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase text-white/80">Editorial / Summer 2026</p>
          <h1 id="homepage-hero-title" className="mt-4 max-w-lg font-serif text-5xl font-medium leading-none sm:text-6xl lg:text-7xl">Pearls for sunlit days.</h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/85 md:text-base">Pearl jewelry selected for natural light, everyday movement, and the moments worth keeping.</p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href="/collections/pearl-series" className="editorial-button">Shop the Pearl Edit <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/pearls" className="editorial-text-link">Read the Pearl Guide</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Implement the category, product, story, and Guardian sections**

Use the typed media manifest in each focused Server Component. The structural contract is:

```tsx
<HomepageCategoryStories />
<HomepagePearlEdit products={featuredProducts} />
<HomepageEditorialStory />
<HomepageGuardian />
```

`HomepageCategoryStories` renders the first three `HOMEPAGE_CATEGORY_LINKS` as image-led links with stable media ratios, then renders the final two as fine-rule index links. Give the section `aria-labelledby="shop-by-style-title"` and use that id on the `Choose your starting point` heading.

`HomepagePearlEdit` renders four active/in-stock products with the shared `ProductCard`. Until Task 4 adds role-aware card props, pass only the verified primary in the array so an arbitrary detail cannot appear on hover:

```tsx
<ProductCard
  key={product.slug}
  product={{
    id: product.id,
    name: productDisplayName(product),
    slug: product.slug,
    images: [product.imageRoles?.primary || product.image],
    variants: [{ price: product.price }],
    comparePrice: product.compareAt ?? null,
  }}
/>
```

`HomepageEditorialStory` creates two unframed image/text bands linking to `/pearls` and `/about`. `HomepageGuardian` uses the courtyard image, a direct `/guardian-quiz` action, and four fine-rule archetype rows without a bordered card.

- [ ] **Step 5: Recompose `src/app/page.tsx`**

Keep `dynamic`, canonical, and Open Graph metadata unchanged. Replace the old icon-card, shortlist-card, Guardian-card, and footer-banner markup with the new components. Preserve `NewsletterForm` and `RecentlyViewed`, but render the newsletter in a full-width unframed band.

- [ ] **Step 6: Remove deprecated and duplicate hero loading code**

Delete `HeroCarousel.tsx`. Remove the manual `<link rel="preload">` from `src/app/layout.tsx`; the single `Image preload` call in `HomepageHero` owns LCP preloading.

- [ ] **Step 7: Run focused tests**

```powershell
npm run test:unit -- tests/homepage-editorial.test.ts tests/storefront-trust.test.ts
npx playwright test e2e/release-surfaces.spec.ts --grep "editorial and utility surfaces"
```

Expected: PASS.

- [ ] **Step 8: Commit Task 2 only**

```powershell
git add -- 'src/components/home' 'src/app/page.tsx' 'src/app/layout.tsx' 'src/components/layout/HeroCarousel.tsx' 'e2e/release-surfaces.spec.ts' 'tests/storefront-trust.test.ts'
git commit --only -m "feat: rebuild homepage as Mediterranean editorial" -- 'src/components/home' 'src/app/page.tsx' 'src/app/layout.tsx' 'src/components/layout/HeroCarousel.tsx' 'e2e/release-surfaces.spec.ts' 'tests/storefront-trust.test.ts'
```

### Task 3: Rebuild Header, Menus, Footer, And Shared Controls

**Files:**
- Modify: `src/components/layout/Header.tsx:13-293`
- Modify: `src/components/layout/Footer.tsx:1-158`
- Modify: `src/components/layout/NewsletterForm.tsx:7-73`
- Modify: `src/components/ui/Button.tsx:4-45`
- Modify: `src/app/globals.css:14-141,188-205`
- Modify: `e2e/core-flows.spec.ts:17-39,88-105`

**Interfaces:**
- Produces: `Header` attribute `data-visual-state="overlay" | "solid"`.
- Produces: `NewsletterForm({ tone?: "light" | "dark" })`.
- Preserves: search, account, wishlist, cart, mobile focus trap, and policy links.

- [ ] **Step 1: Add failing header and footer browser assertions**

Add to `e2e/core-flows.spec.ts`:

```ts
test("homepage header moves from editorial overlay to solid navigation", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header[data-visual-state]");
  await expect(header).toHaveAttribute("data-visual-state", "overlay");
  await page.evaluate(() => window.scrollTo(0, window.innerHeight));
  await expect(header).toHaveAttribute("data-visual-state", "solid");
  await expect(page.getByRole("button", { name: "Shop menu" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Intention menu" })).toBeVisible();
});
```

Keep the existing footer policy-route test unchanged.

- [ ] **Step 2: Run the focused browser tests and verify failure**

```powershell
npx playwright test e2e/core-flows.spec.ts --grep "header moves|shop navigation|footer exposes"
```

Expected: FAIL because the header has no state attribute and no Intention menu.

- [ ] **Step 3: Implement header visual states and accessible menus**

Replace desktop `<details>` navigation with controlled buttons so Escape, outside click, route change, and focus return are explicit. Define:

```ts
type DesktopMenu = "shop" | "intention" | null;

const intentionLinks = [
  { label: "Find Your Guardian", href: "/guardian-quiz" },
  { label: "Pearl Guide", href: "/pearls" },
  { label: "Everyday Pearl", href: "/collections/pearl-series" },
  { label: "Our Story", href: "/about" },
];
```

Set `isOverlay = isHome && !isScrolled`, render `data-visual-state`, use white controls over the hero, and switch to warm-white/charcoal at the existing scroll threshold. Keep 44px mobile controls and all existing cart/search behavior.

- [ ] **Step 4: Make footer and newsletter tone explicit**

Change `NewsletterForm` to:

```ts
export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" })
```

Use `aria-live="polite"` for success and `role="alert"` for errors. Pass `tone="dark"` from `Footer`. Replace the footer gradient with a solid charcoal background and fine separators; preserve every current destination.

- [ ] **Step 5: Align buttons and global visual tokens**

Update shared button variants to use deep sea green for primary actions, a maximum 8px radius, no glow, and a visible focus ring. In `globals.css`, keep warm white, charcoal, sea green, muted blue, and terracotta roles while removing negative letter spacing from headings and neutralizing `.magnetic-glow` on storefront controls.

- [ ] **Step 6: Re-run focused tests**

```powershell
npx playwright test e2e/core-flows.spec.ts --grep "header moves|shop navigation|focus|footer exposes"
```

Expected: PASS.

- [ ] **Step 7: Commit Task 3 only**

```powershell
git add -- 'src/components/layout/Header.tsx' 'src/components/layout/Footer.tsx' 'src/components/layout/NewsletterForm.tsx' 'src/components/ui/Button.tsx' 'src/app/globals.css' 'e2e/core-flows.spec.ts'
git commit --only -m "feat: align storefront navigation and controls" -- 'src/components/layout/Header.tsx' 'src/components/layout/Footer.tsx' 'src/components/layout/NewsletterForm.tsx' 'src/components/ui/Button.tsx' 'src/app/globals.css' 'e2e/core-flows.spec.ts'
```

### Task 4: Make Product Cards Truthful And Editorial

**Files:**
- Modify: `src/components/product/ProductCard.tsx:10-177`
- Modify: `src/components/home/HomepagePearlEdit.tsx`
- Modify: `src/app/collections/[slug]/1688-collection.tsx:160-173`
- Modify: `src/components/product/ProductGrid.tsx:1-21`
- Modify: `tests/storefront-trust.test.ts`
- Modify: `e2e/core-flows.spec.ts`

**Interfaces:**
- Consumes: `ProductImageRoles` from Task 1.
- Product-card prop adds: `imageRoles?: ProductImageRoles`.
- Behavior: only `imageRoles.wearing` can become the hover/focus alternate; failed media falls back within the same SKU.

- [ ] **Step 1: Add failing card-truth tests**

Add source assertions to `tests/storefront-trust.test.ts`:

```ts
test("product cards never infer wearing media from array position or filename", () => {
  const card = source("src/components/product/ProductCard.tsx");
  assert.doesNotMatch(card, /images\[1\]/);
  assert.doesNotMatch(card, /includes\(["']-worn\./);
  assert.match(card, /imageRoles\?\.wearing/);
});
```

Add a browser test that a new-series card has one loaded card image while a source-preserved pearl card exposes two card images.

- [ ] **Step 2: Run focused tests and verify failure**

```powershell
npm run test:unit -- tests/storefront-trust.test.ts
npx playwright test e2e/core-flows.spec.ts --grep "product card media"
```

Expected: FAIL because cards still infer the alternate from `images[1]`.

- [ ] **Step 3: Implement explicit card media**

Extend the card product interface:

```ts
import type { ProductImageRoles } from "@/lib/1688-products";

export interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
  imageRoles?: ProductImageRoles;
  variants: { price: number; stock?: number }[];
  comparePrice?: number | null;
}
```

Resolve media with:

```ts
const primaryImage = product.imageRoles?.primary || product.images[0] || "";
const wearingImage = product.imageRoles?.wearing;
const hasWearingImage = Boolean(wearingImage);
```

Track failures explicitly:

```ts
const [primaryFailed, setPrimaryFailed] = useState(false);
const [wearingFailed, setWearingFailed] = useState(false);
const showPrimaryImage = Boolean(primaryImage) && !primaryFailed;
const showWearingImage = Boolean(wearingImage) && !wearingFailed;
```

Render `ProductImage` when `showPrimaryImage` is false. Add `onError={() => setPrimaryFailed(true)}` to the primary and `onError={() => setWearingFailed(true)}` to the wearing layer, so a broken alternate reveals the same SKU's primary instead of an empty layer. Render the second layer only when `showWearingImage` is true. Limit hover/focus scale to `1.02`, use both `group-hover` and `group-focus-within`, remove glow/shadow lift, keep title and price visible, and retain factual sale/stock UI.

- [ ] **Step 4: Pass roles from collection data**

Add `imageRoles: product.imageRoles` in both `HomepagePearlEdit.tsx` and `1688-collection.tsx`. Keep `ProductGrid` compatible by making the field optional.

- [ ] **Step 5: Run focused tests**

```powershell
npm run test:unit -- tests/storefront-trust.test.ts tests/storefront-catalog.test.ts
npx playwright test e2e/core-flows.spec.ts --grep "product card media"
```

Expected: PASS.

- [ ] **Step 6: Commit Task 4 only**

```powershell
git add -- 'src/components/product/ProductCard.tsx' 'src/components/home/HomepagePearlEdit.tsx' 'src/app/collections/[slug]/1688-collection.tsx' 'src/components/product/ProductGrid.tsx' 'tests/storefront-trust.test.ts' 'e2e/core-flows.spec.ts'
git commit --only -m "fix: use explicit product card media roles" -- 'src/components/product/ProductCard.tsx' 'src/components/home/HomepagePearlEdit.tsx' 'src/app/collections/[slug]/1688-collection.tsx' 'src/components/product/ProductGrid.tsx' 'tests/storefront-trust.test.ts' 'e2e/core-flows.spec.ts'
```

### Task 5: Implement Restrained Scroll Motion

**Files:**
- Modify: `src/components/ui/ScrollReveal.tsx:1-19`
- Modify: `src/app/globals.css:97-141,154-340`
- Modify: `src/components/layout/SearchOverlay.tsx:140-150`
- Modify: `e2e/core-flows.spec.ts`

**Interfaces:**
- `ScrollReveal` keeps `as`, `className`, and `children`; adds optional `delay?: number` capped by callers at 240ms.
- DOM state: `data-reveal-ready` and `data-reveal-visible`.

- [ ] **Step 1: Add failing motion and reduced-motion tests**

Add to `e2e/core-flows.spec.ts`:

```ts
test("homepage reveal motion resolves and reduced motion stays visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const sections = page.locator("[data-reveal-ready]");
  await expect(sections.first()).toHaveAttribute("data-reveal-visible", "true");
  await expect(page.getByRole("heading", { name: "Choose your starting point" })).toBeVisible();
});
```

- [ ] **Step 2: Run the test and verify failure**

```powershell
npx playwright test e2e/core-flows.spec.ts --grep "reveal motion"
```

Expected: FAIL because `ScrollReveal` has no runtime state attributes.

- [ ] **Step 3: Implement progressive IntersectionObserver motion**

Convert `ScrollReveal` into a Client Component. Render content visible on the server, enable the hidden pre-entry state only after hydration when motion is allowed, observe once with `threshold: 0.15` and `rootMargin: "0px 0px -10% 0px"`, then disconnect. Reduced-motion users always receive `data-reveal-visible="true"`.

Use `opacity` and `translateY(14px)` only, `600ms` duration, and per-item delay no greater than `240ms`. Do not apply `will-change` after the transition completes.

- [ ] **Step 4: Remove unused synthetic storefront animations**

Remove the `animate-search-breathe` class from the search empty-state punctuation. Remove unused homepage carousel loops, Ken Burns, shine sweep, glow pulse, search breathing, and shimmer-reveal rules after confirming no remaining live component references them with:

```powershell
rg -n "hero-carousel|animate-kenburns|shine-effect|magnetic-glow|animate-search-breathe|animate-shimmer-reveal" src
```

Keep animation rules still referenced by dialogs, cart feedback, and loading indicators.

- [ ] **Step 5: Re-run motion tests**

```powershell
npx playwright test e2e/core-flows.spec.ts --grep "reveal motion|homepage fits"
```

Expected: PASS.

- [ ] **Step 6: Commit Task 5 only**

```powershell
git add -- 'src/components/ui/ScrollReveal.tsx' 'src/components/layout/SearchOverlay.tsx' 'src/app/globals.css' 'e2e/core-flows.spec.ts'
git commit --only -m "feat: add restrained accessible storefront motion" -- 'src/components/ui/ScrollReveal.tsx' 'src/components/layout/SearchOverlay.tsx' 'src/app/globals.css' 'e2e/core-flows.spec.ts'
```

### Task 6: Complete SEO, Responsive, And Local Visual Verification

**Files:**
- Modify: `e2e/core-flows.spec.ts`
- Modify: `e2e/release-surfaces.spec.ts`
- Modify: `tests/homepage-editorial.test.ts`
- Modify only when a verification failure requires it: files changed in Tasks 1-5.

**Interfaces:**
- Produces no new runtime API.
- Validates the complete approved design at 1440px, 390px, and 320px.

- [ ] **Step 1: Add final homepage acceptance coverage**

Extend browser tests to verify:

```ts
const styleRegion = page.getByRole("region", { name: "Choose your starting point" });
await expect(styleRegion.getByRole("link", { name: "Everyday Pearl" })).toHaveAttribute("href", "/collections/pearl-series");
await expect(styleRegion.getByRole("link", { name: "Pearl Earrings" })).toHaveAttribute("href", "/collections/pearl-series?type=earrings");
await expect(styleRegion.getByRole("link", { name: "Pearl Necklaces" })).toHaveAttribute("href", "/collections/pearl-series?type=necklaces");
await expect(styleRegion.getByRole("link", { name: "Pearl Bracelets" })).toHaveAttribute("href", "/collections/pearl-series?type=bracelets");
await expect(styleRegion.getByRole("link", { name: "Pearl Eyewear Chains" })).toHaveAttribute("href", "/collections/pearl-series?type=eyewear-chains");
```

At 320px and 390px, assert no horizontal overflow and all `#main-content img` nodes load with `naturalWidth > 0`. At 1440px, assert hero, category, product, guide, Guardian, newsletter, and footer headings are visible in document order.

- [ ] **Step 2: Run all unit tests**

```powershell
npm run test:unit
```

Expected: all tests PASS.

- [ ] **Step 3: Run lint and production build**

```powershell
npm run lint
npm run build
```

Expected: both commands exit 0; the build contains no Next 16 `priority` deprecation warning from the new hero.

- [ ] **Step 4: Run complete Playwright coverage**

```powershell
npx playwright test
```

Expected: all Chromium tests PASS.

- [ ] **Step 5: Start the local review server**

Run the development server at `http://127.0.0.1:3001/`. If port 3001 is occupied by a stale process, inspect it before choosing the next free port; do not terminate an unrelated process.

- [ ] **Step 6: Capture and inspect visual evidence**

Using the in-app browser, capture:

- Desktop homepage at 1440px.
- Mobile homepage at 390px.
- Mobile menu open at 390px.
- A collection grid showing a verified wearing-image card and a new-series primary-only card.

Inspect image loading, product fidelity, hero crop, text contrast, header state, menu interaction, stable media ratios, focus visibility, overlap, and horizontal overflow. Check browser console errors.

- [ ] **Step 7: Run a color and synthetic-effect audit**

```powershell
rg -n "gradient|glow|shimmer|kenburns|bokeh|rounded-full|tracking-\[-" src/app/page.tsx src/components/home src/components/layout/Header.tsx src/components/layout/Footer.tsx src/components/product/ProductCard.tsx src/app/globals.css
```

Review every match. Keep only the hero readability scrim, circular count badges/avatar/social icon controls, and functional loading indicators. Remove decorative or template-like matches.

- [ ] **Step 8: Commit final verification changes only**

```powershell
git add -- 'e2e/core-flows.spec.ts' 'e2e/release-surfaces.spec.ts' 'tests/homepage-editorial.test.ts'
git commit --only -m "test: verify editorial storefront across viewports" -- 'e2e/core-flows.spec.ts' 'e2e/release-surfaces.spec.ts' 'tests/homepage-editorial.test.ts'
```

- [ ] **Step 9: Present local review without deploying**

Report the local URL, the exact verification commands and results, the screenshots reviewed, and any remaining product-photo fidelity caveats. Do not push or run a Vercel deployment command.
