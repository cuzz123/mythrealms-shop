# Pearl Series 01 Editorial Image Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce and ship a five-image Mediterranean editorial gallery for The Calm Tide - Ring without changing any other product or overwriting supplier assets.

**Architecture:** Five square PNGs are generated as new product-local assets and individually checked against the source ring's physical invariants. A narrowly scoped `EDITORIAL_PILOT_IMAGES` override in the catalog takes precedence only for `pearl-series-01`; all other active pearl products continue to use `SOURCE_PRESERVED_PRODUCT_IMAGES` unchanged.

**Tech Stack:** Next.js 16, TypeScript, Node test runner, built-in image generation, static files in `public/images`.

## Global Constraints

- Keep the gold-toned coiled open band and pale blush asymmetric pearl cluster faithful to the existing five source photographs.
- Generate square images only; no text, watermark, logo, measurement overlay, extra jewelry, or product/packaging claim.
- Use the Mediterranean editorial palette: warm white, limestone, oat linen, muted olive, pearl blush, and soft gold.
- Create only non-destructive files under `public/images/products/1688-shop/pearl-series/`; do not overwrite a supplier source.
- Change only `pearl-series-01`; every other active pearl product must retain its exact source-preserved gallery.

---

### Task 1: Generate and approve the five pilot assets

**Files:**
- Create: `public/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-01-hero.png`
- Create: `public/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-02-macro.png`
- Create: `public/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-03-worn.png`
- Create: `public/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-04-profile.png`
- Create: `public/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-05-atmosphere.png`
- Reference: `public/images/products/1688-shop/pearl-series/pearl-series-01-main.webp`
- Reference: `public/images/products/1688-shop/pearl-series/pearl-series-01-detail1.webp`
- Reference: `public/images/products/1688-shop/pearl-series/pearl-series-01-detail2.webp`
- Reference: `public/images/products/1688-shop/pearl-series/pearl-series-01-detail3.webp`
- Reference: `public/images/products/1688-shop/pearl-series/pearl-series-01-detail4.webp`

**Interfaces:**
- Consumes: the five existing supplier photographs as product-geometry references.
- Produces: five square PNG paths consumed verbatim by `EDITORIAL_PILOT_IMAGES` in Task 2.

- [ ] **Step 1: Load all five source images before generation**

Use the local source gallery as reference images. Record these invariants before accepting any render: gold-toned tightly coiled open band, a clustered set of pale blush freshwater pearls, no gemstones, and no measurement or supplier overlay.

- [ ] **Step 2: Generate the hero image**

Use this prompt with the source images as references:

```text
Use case: product-mockup
Asset type: square e-commerce product-gallery hero
Primary request: faithfully stage the exact reference ring, preserving its gold-toned coiled open band and asymmetrical cluster of pale blush freshwater pearls.
Scene/backdrop: warm white oat linen draped over pale Mediterranean limestone.
Style/medium: premium Mediterranean jewelry editorial photography.
Composition/framing: square 1:1, ring centered and large in frame, product fully visible and sharply focused.
Lighting/mood: soft diffuse morning sunlight, gentle natural shadow, refined and calm.
Constraints: retain the exact product structure and pearl cluster; no text, no logo, no watermark, no measurement graphic, no extra jewelry, no packaging, no hands.
Avoid: black supplier backdrop, glossy marble, harsh studio flash, altered band geometry, added gemstones.
```

Save the approved output as `pearl-series-01-editorial-v1-01-hero.png`.

- [ ] **Step 3: Generate the macro image**

```text
Use case: product-mockup
Asset type: square e-commerce product-gallery detail image
Primary request: faithfully show the exact reference ring, with a close crop on the pale blush pearl cluster and the gold coiled band.
Scene/backdrop: warm cream linen and pale limestone, only subtly visible.
Style/medium: premium Mediterranean jewelry editorial macro photography.
Composition/framing: square 1:1, pearl cluster and coil texture occupy most of the frame, no product parts cut in a misleading way.
Lighting/mood: diffuse warm daylight with accurate pearl luster and soft gold highlights.
Constraints: retain the exact product structure; no text, logo, watermark, measurement graphic, extra jewelry, packaging, or hands.
Avoid: altered pearl count, rhinestones, oversharpening, black backdrop.
```

Save the approved output as `pearl-series-01-editorial-v1-02-macro.png`.

- [ ] **Step 4: Generate the worn image**

```text
Use case: product-mockup
Asset type: square e-commerce product-gallery worn image
Primary request: faithfully show the exact reference ring worn naturally on one adult hand, preserving the gold coiled open band and pale blush pearl cluster.
Scene/backdrop: sunlit Mediterranean limestone terrace with softly defocused olive greenery.
Style/medium: premium understated jewelry editorial photography.
Composition/framing: square 1:1, hand and ring are the primary focus; ring is large enough to inspect; no face in frame.
Lighting/mood: gentle morning sunlight, warm but true-to-product color.
Constraints: one ring only; anatomically natural hand; no text, logo, watermark, measurement graphic, additional jewelry, nail art, or packaging.
Avoid: distorted fingers, altered ring geometry, multiple hands, crowded background.
```

Save the approved output as `pearl-series-01-editorial-v1-03-worn.png`.

- [ ] **Step 5: Generate the profile image**

```text
Use case: product-mockup
Asset type: square e-commerce product-gallery profile image
Primary request: faithfully show the exact reference ring from a side angle that clearly reveals the open coiled band and depth of the pale blush pearl cluster.
Scene/backdrop: quiet cream paper and pale limestone, minimal studio-like Mediterranean editorial setting.
Style/medium: premium jewelry product photography.
Composition/framing: square 1:1, ring fully visible, product large, uncluttered negative space.
Lighting/mood: soft natural window light with gentle contact shadow.
Constraints: exact product shape and pearl cluster; no text, logo, watermark, measurement graphic, extra jewelry, packaging, or hands.
Avoid: closed smooth ring band, added stones, black backdrop, hard flash.
```

Save the approved output as `pearl-series-01-editorial-v1-04-profile.png`.

- [ ] **Step 6: Generate the atmosphere image**

```text
Use case: product-mockup
Asset type: square e-commerce product-gallery still life
Primary request: faithfully stage the exact reference ring as the clear focal point in a restrained Mediterranean still life.
Scene/backdrop: oat linen, one matte ivory ceramic vessel, and a single soft olive branch on pale limestone.
Style/medium: premium quiet-luxury jewelry editorial photography.
Composition/framing: square 1:1, ring large and unobstructed, props secondary and non-branded.
Lighting/mood: warm diffuse morning light, soft natural shadows.
Constraints: exact product geometry and pale blush pearls; no text, logo, watermark, measurement graphic, extra jewelry, packaging, or claims.
Avoid: busy styling, dark palette, reflective mirror surface, altered pearl arrangement.
```

Save the approved output as `pearl-series-01-editorial-v1-05-atmosphere.png`.

- [ ] **Step 7: Perform visual acceptance review**

Inspect all five outputs at full size and card-size. Reject and regenerate any image that alters the band profile, clearly changes the pearl cluster, introduces text or another jewelry item, has implausible hands, or breaks the agreed color system.

- [ ] **Step 8: Commit the approved asset set**

```bash
git add public/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-*.png
git commit -m "feat: add calm tide editorial image pilot"
```

### Task 2: Add a narrowly scoped pilot gallery override

**Files:**
- Modify: `src/lib/1688-products.ts:85-125`
- Modify: `tests/storefront-catalog.test.ts`

**Interfaces:**
- Consumes: five image paths produced in Task 1.
- Produces: `getStorefrontProductBySlug("pearl-series-01")` returns five `-editorial-v1-` gallery images while all other active pearl-series products continue using their `SOURCE_PRESERVED_PRODUCT_IMAGES` paths.

- [ ] **Step 1: Add a failing storefront-catalog test**

Append this test to `tests/storefront-catalog.test.ts`:

```ts
test("the calm tide pilot uses its complete editorial gallery without changing other pearl source galleries", () => {
  const pilot = getStorefrontProductBySlug("pearl-series-01");
  assert.ok(pilot);
  assert.equal(pilot.image, "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-01-hero.png");
  assert.deepEqual(pilot.images, [
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-01-hero.png",
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-02-macro.png",
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-03-worn.png",
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-04-profile.png",
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-05-atmosphere.png",
  ]);

  const unchanged = getStorefrontProductBySlug("pearl-series-02");
  assert.ok(unchanged);
  assert.ok(unchanged.images.every((image) => !image.includes("-editorial-v1-")));
});
```

- [ ] **Step 2: Run the targeted test and verify it fails**

Run: `node --import tsx --test tests/storefront-catalog.test.ts`

Expected: the new test fails because `pearl-series-01` still resolves to its source-preserved three-image gallery.

- [ ] **Step 3: Add the pilot map and precedence rule**

Immediately after `SOURCE_PRESERVED_PRODUCT_IMAGES`, add:

```ts
const EDITORIAL_PILOT_IMAGES: Record<string, [string, string, string, string, string]> = {
  "pearl-series-01": [
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-01-hero.png",
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-02-macro.png",
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-03-worn.png",
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-04-profile.png",
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-05-atmosphere.png",
  ],
};
```

Inside the `PRODUCTS` mapping callback, replace the current final `if (images)` block with:

```ts
  const editorialImages = EDITORIAL_PILOT_IMAGES[product.slug];
  if (editorialImages) {
    product.image = editorialImages[0];
    product.images = [...editorialImages];
  } else if (images) {
    product.image = images[0];
    product.images = [...images];
  }
```

- [ ] **Step 4: Run the targeted test and verify it passes**

Run: `node --import tsx --test tests/storefront-catalog.test.ts`

Expected: all tests pass, including the five-image pilot and unchanged `pearl-series-02` assertions.

- [ ] **Step 5: Commit the catalog integration**

```bash
git add src/lib/1688-products.ts tests/storefront-catalog.test.ts
git commit -m "feat: surface calm tide editorial gallery"
```

### Task 3: Verify the static assets and storefront surfaces

**Files:**
- Verify: `public/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-01-hero.png`
- Verify: `public/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-02-macro.png`
- Verify: `public/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-03-worn.png`
- Verify: `public/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-04-profile.png`
- Verify: `public/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-05-atmosphere.png`
- Verify: `src/app/page.tsx`
- Verify: `src/app/products/[slug]/1688-product.tsx`

**Interfaces:**
- Consumes: the complete pilot assets and catalog override from Tasks 1-2.
- Produces: a passing build with a usable home-card image and five-image product gallery.

- [ ] **Step 1: Verify every referenced asset exists and is square**

Run:

```powershell
Get-ChildItem public/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-*.png |
  Select-Object Name, Length
```

Expected: exactly five non-empty files whose names match the catalog map.

- [ ] **Step 2: Run focused and full verification**

Run:

```bash
node --import tsx --test tests/storefront-catalog.test.ts
npm run test:unit
npm run lint
npm run build
```

Expected: all commands exit successfully. The build must resolve all five static image paths.

- [ ] **Step 3: Inspect rendered surfaces**

Open `/`, `/collections/pearl-series`, and `/products/pearl-series-01`. Confirm that the product card resolves an editorial pilot image, the product page starts at the hero image, all five thumbnails load in order, next/previous controls cycle exactly five images, and no other product image has changed.

- [ ] **Step 4: Commit verification-only adjustments if needed**

If a correction is necessary, keep it limited to the five pilot assets, `EDITORIAL_PILOT_IMAGES`, or its dedicated test. Re-run Step 2 after every correction, then commit with:

```bash
git add public/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-*.png src/lib/1688-products.ts tests/storefront-catalog.test.ts
git commit -m "fix: refine calm tide editorial gallery"
```
