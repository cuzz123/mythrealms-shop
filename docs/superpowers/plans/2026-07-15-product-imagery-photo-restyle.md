# Product Imagery Photo-Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the rejected hard-cutout ring package with four source-anchored, photorealistic editorial images that preserve the supplier ring.

**Architecture:** Generate each slot independently from the closest supplier photograph, then perform native-output visual review before normalization. Only a complete four-slot package may update the manifest from `draft` to `approved`.

**Tech Stack:** Built-in `image_gen`, `view_image`, existing Python normalization/validation tools, Node test runner.

## Global Constraints

- Work only in `D:\mythrealms-shop-worktrees\product-imagery`.
- Do not modify or overwrite supplier originals.
- Do not use hard alpha cutouts, deterministic product overlays, or a separately generated hand plate.
- Preserve pearl count, wire topology, coiled band, wrapped junctions, and one-finger wearing at least 95%.
- Each slot allows at most three source-anchored attempts.
- Final assets are exactly `1600x2000` WebP and no larger than `900KB`.
- Keep the manifest `draft` if any slot fails.
- Do not deploy or change storefront mappings in this plan.

---

### Task 1: Remove The Rejected Composite

**Files:**
- Delete: `scripts/product_imagery/compose_ring_package.mjs`
- Delete: `tests/product-imagery-ring-composite.test.ts`
- Delete: `public/images/products/editorial-v2/pearl-series-01/01-main.webp`
- Delete: `public/images/products/editorial-v2/pearl-series-01/02-on-model.webp`
- Delete: `public/images/products/editorial-v2/pearl-series-01/03-macro.webp`
- Delete: `public/images/products/editorial-v2/pearl-series-01/04-lifestyle.webp`

**Interfaces:**
- Consumes: the rejected uncommitted Task 5B worktree state.
- Produces: a clean `draft` package ready for source-anchored generation.

- [ ] **Step 1: Verify every deletion target is untracked and inside the worktree**

Run:

```powershell
git status --short
Resolve-Path scripts/product_imagery/compose_ring_package.mjs
Resolve-Path tests/product-imagery-ring-composite.test.ts
Resolve-Path public/images/products/editorial-v2/pearl-series-01
```

Expected: only the rejected compositor, its test, and four output files are present; every resolved path starts with `D:\mythrealms-shop-worktrees\product-imagery`.

- [ ] **Step 2: Delete only the rejected files**

Use PowerShell `Remove-Item -LiteralPath` for the six verified targets, then remove the empty output directory.

- [ ] **Step 3: Verify the package is draft and supplier hashes pass**

Run:

```powershell
python scripts/product_imagery/validate_packages.py assets/product-imagery/pilot-manifest.json
git status --short
```

Expected: validator exits `0`; no rejected composite files remain.

### Task 2: Generate And Review Four Source-Anchored Photos

**Files:**
- Create: `tmp/product-imagery/pearl-series-01/main.png`
- Create: `tmp/product-imagery/pearl-series-01/on-model.png`
- Create: `tmp/product-imagery/pearl-series-01/macro.png`
- Create: `tmp/product-imagery/pearl-series-01/lifestyle.png`

**Interfaces:**
- Consumes: supplier `detail1` and `detail3` images plus the approved photo-restyle design.
- Produces: four visually accepted native 4:5 PNGs.

- [ ] **Step 1: Inspect both supplier anchors with `view_image`**

Record ten pearls, asymmetric wire branch, coiled band, wrapped junctions, and correct one-finger placement.

- [ ] **Step 2: Generate main and macro independently**

Use one built-in `image_gen` call per slot. Reference `pearl-series-01-detail1.webp` as the identity/base photograph. Request a background-and-lighting restyle only; explicitly preserve the complete ring and its contact with the surface.

- [ ] **Step 3: Generate on-model independently**

Reference only `pearl-series-01-detail3.webp`. Preserve the hand, finger, ring, and wearing relationship. Replace only the surrounding background and overall photographic lighting.

- [ ] **Step 4: Generate lifestyle independently**

Reference `pearl-series-01-detail1.webp` and `scene-cafe-terrace.png`. Keep the ring at realistic physical scale, fully supported by the tabletop, with matching focus and contact shadow.

- [ ] **Step 5: Inspect every native result with `view_image`**

Reject topology drift, cutout appearance, floating, wrong scale, inconsistent grain/focus/light, incorrect wearing, text, logos, or watermark. Stop at three attempts per slot and leave the package draft if no attempt passes.

### Task 3: Normalize, Record QA, And Approve

**Files:**
- Create: `public/images/products/editorial-v2/pearl-series-01/01-main.webp`
- Create: `public/images/products/editorial-v2/pearl-series-01/02-on-model.webp`
- Create: `public/images/products/editorial-v2/pearl-series-01/03-macro.webp`
- Create: `public/images/products/editorial-v2/pearl-series-01/04-lifestyle.webp`
- Create: `assets/product-imagery/qa/pearl-series-01.json`
- Modify: `assets/product-imagery/pilot-manifest.json`

**Interfaces:**
- Consumes: four accepted native PNGs from Task 2.
- Produces: one validated approved package and review-page assets.

- [ ] **Step 1: Normalize without cropping**

Run the four existing `normalize_image.py` commands from the original Task 5 brief. Every command must succeed from a native 4:5 input.

- [ ] **Step 2: Write truthful QA evidence**

Record for each slot: supplier source, attempt number, topology checks, realism checks, and concise observations. Set the manifest record to `approved` only when all four pass.

- [ ] **Step 3: Run validation and tests**

Run:

```powershell
python scripts/product_imagery/validate_packages.py assets/product-imagery/pilot-manifest.json
node --import tsx --test tests/editorial-assets.test.ts tests/product-imagery-prompts.test.ts
python tests/product-imagery-tools.test.py
npx tsx scripts/product_imagery/build_review.ts
```

Expected: validator exits `0`, Node tests pass `11/11`, Python tests pass `17/17`, and the review page shows four real images for `pearl-series-01`.

- [ ] **Step 4: Final visual review**

Open all four final WebPs with `view_image`. If any image looks pasted or changes the product, return the manifest to `draft` and remove the failed final.

- [ ] **Step 5: Commit**

```powershell
git add -- public/images/products/editorial-v2/pearl-series-01 assets/product-imagery/qa/pearl-series-01.json assets/product-imagery/pilot-manifest.json
git commit -m "feat(images): add source-anchored pearl ring package"
```

