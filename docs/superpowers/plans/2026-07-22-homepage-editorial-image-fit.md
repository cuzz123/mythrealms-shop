# Homepage Editorial Image Fit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the homepage free of supplier imagery and make its product and hero image composition consistent across desktop and mobile.

**Architecture:** The existing approved product-image roles remain the single source of truth for The Pearl Edit. A small homepage-only crop contract is added to the hero component: fixed, deliberate aspect-ratio behavior on mobile and desktop, rather than relying on one full-viewport crop.

**Tech Stack:** Next.js 16 App Router, React, TypeScript, Tailwind CSS, Node test runner.

## Global Constraints

- Reuse only files already under `public/images/brand` and `public/images/products`.
- Do not generate images or alter the product catalog.
- Preserve the existing category-story media and its no-motion behavior.

---

### Task 1: Lock the homepage image-source contract

**Files:**
- Modify: `tests/storefront-trust.test.ts`
- Modify: `src/components/home/HomepagePearlEdit.tsx`

**Interfaces:**
- Consumes: `Product.imageRoles.primary` and `Product.imageRoles.wearing`.
- Produces: a `ProductCard` prop object whose `images[0]` and `imageRoles` come from approved image roles.

- [ ] **Step 1: Write the failing test**

```ts
test("homepage pearl edit passes approved editorial image roles to product cards", () => {
  const edit = source("src/components/home/HomepagePearlEdit.tsx");
  assert.match(edit, /const primaryImage = product\.imageRoles\?\.primary \|\| product\.image;/);
  assert.match(edit, /images:\s*\[primaryImage\]/);
  assert.match(edit, /imageRoles:\s*product\.imageRoles/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:unit -- tests/storefront-trust.test.ts`

Expected: the new homepage media-role assertion fails until the component makes its primary image source explicit.

- [ ] **Step 3: Write minimal implementation**

```tsx
const primaryImage = product.imageRoles?.primary || product.image;

<ProductCard
  product={{
    // existing product fields
    images: [primaryImage],
    imageRoles: product.imageRoles,
  }}
/>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:unit -- tests/storefront-trust.test.ts`

Expected: all storefront trust tests pass.

### Task 2: Make hero composition viewport-specific

**Files:**
- Modify: `tests/storefront-trust.test.ts`
- Modify: `src/components/home/HomepageHero.tsx`

**Interfaces:**
- Consumes: `HOMEPAGE_MEDIA.hero` and the shared image component.
- Produces: a 4:5 mobile hero and 16:9-or-taller desktop hero with left-side copy safety.

- [ ] **Step 1: Write the failing test**

```ts
test("homepage hero has intentional mobile and desktop image crops", () => {
  const hero = source("src/components/home/HomepageHero.tsx");
  assert.match(hero, /aspect-\[4\/5\]/);
  assert.match(hero, /lg:aspect-\[16\/9\]/);
  assert.match(hero, /sm:object-\[65%_center\]/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:unit -- tests/storefront-trust.test.ts`

Expected: the aspect-ratio and desktop crop assertions fail because the component currently uses one viewport-height crop.

- [ ] **Step 3: Write minimal implementation**

```tsx
<section className="relative -mt-16 aspect-[4/5] overflow-hidden bg-[#24312f] text-white sm:aspect-[3/2] lg:aspect-[16/9]">
  <Image
    // existing src, alt, fill, preload, and sizes props
    className="object-cover object-[58%_center] sm:object-[65%_center]"
  />
  <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-10 pt-24 sm:pb-16 sm:pt-28 lg:pb-20 lg:pt-32">
    {/* existing copy and links */}
  </div>
</section>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:unit -- tests/storefront-trust.test.ts`

Expected: all storefront trust tests pass.

### Task 3: Verify the responsive homepage release

**Files:**
- Verify: `src/components/home/HomepageHero.tsx`
- Verify: `src/components/home/HomepagePearlEdit.tsx`
- Verify: `tests/storefront-trust.test.ts`

- [ ] **Step 1: Run focused verification**

Run: `npm run test:unit -- tests/storefront-trust.test.ts tests/storefront-catalog.test.ts`

Expected: all tests pass with zero failures.

- [ ] **Step 2: Run static checks**

Run: `npm run lint`

Expected: exit code 0 with no lint errors.

- [ ] **Step 3: Build production output**

Run: `npm run build`

Expected: exit code 0 and static production output is generated.
