# Product Imagery Reconstruction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce and locally review four product-faithful editorial images for all 45 approved MythRealms SKUs, beginning with a five-SKU pilot and switching the storefront only after explicit approval.

**Architecture:** A private production manifest stores absolute source references, style references, prompts, and QA state; a public catalog module contains only approved web paths. Built-in image generation creates models and environments around supplier-defined product identity anchors, while Python/Pillow tooling normalizes output without cropping and verifies dimensions, format, size, hashes, and per-SKU ownership. The storefront remains on source-preserved galleries until the pilot gate and final per-SKU approval gates pass.

**Tech Stack:** Next.js 16.2.6, React 19, TypeScript 5.9, Node test runner, Python 3 with Pillow, built-in `image_gen`, Playwright 1.61.

## Global Constraints

- The catalog contains exactly 45 approved SKUs: 20 core Pearl Edit products and 25 approved `new_series` products.
- Produce exactly four approved images per SKU: `01-main.webp`, `02-on-model.webp`, `03-macro.webp`, and `04-lifestyle.webp`.
- Every final image is 1600 by 2000 pixels, 4:5, WebP, and no larger than 900 KB.
- Supplier originals are immutable identity anchors and fallbacks; never overwrite, re-encode, rename, or delete them.
- Product structure must remain at least 95% visually similar. Any changed pearl count, chain path, fitting, clasp, connector, orientation, or product topology is an automatic failure.
- The 72 files under `C:\Users\11458\.codex\generated_images\019f4467-ba2f-7870-96c2-66c210cfcd72` are style references only, not product identity references.
- Use diverse adult Western-market casting across white, Black, Latina, Mediterranean, mixed-heritage, and other models; do not repeat one face across the catalog.
- Use built-in `image_gen` for generation and editing. Do not switch to CLI/API image generation without a separate explicit user decision.
- Generate the five-SKU pilot first. Do not generate the remaining 40 SKUs or change storefront mappings until the user approves the pilot.
- Keep all work local. Do not deploy to Vercel.
- Before modifying Next.js image code, read `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` and heed current deprecations.

---

## File Structure

- `assets/product-imagery/pilot-manifest.json`: private pilot production data, absolute source references, output paths, and QA state.
- `assets/product-imagery/source-hashes.json`: immutable SHA-256 baseline for every supplier image used by the production manifest.
- `assets/product-imagery/style-references/`: curated copies of approved style references with readable names.
- `assets/product-imagery/qa/`: one QA record per SKU; records pass/fail checks and generation attempt history.
- `src/lib/product-imagery/editorial-assets.ts`: manifest-independent public types, slot order, and approved gallery lookup.
- `src/lib/product-imagery/editorial-catalog.ts`: generated public mapping containing only approved `/images/...` paths.
- `scripts/product_imagery/pilot-prompts.ts`: exact Chinese prompt builder and SKU structure contracts.
- `scripts/product_imagery/normalize_image.py`: non-cropping WebP normalization.
- `scripts/product_imagery/lock_source_hashes.py`: creates the supplier-source hash baseline once.
- `scripts/product_imagery/validate_packages.py`: verifies hashes, dimensions, format, file size, slot order, and path ownership.
- `scripts/product_imagery/build_review.ts`: creates the local pilot and full-catalog review page.
- `public/images/products/editorial-v2/`: final approved image packages, one directory per SKU.
- `public/preview/product-imagery-review.html`: generated local comparison page.
- `tests/editorial-assets.test.ts`: manifest and public catalog behavior.
- `tests/product-imagery-tools.test.py`: normalization and validation behavior.
- `e2e/product-imagery.spec.ts`: storefront aspect ratio, hover image, gallery order, and broken-image coverage.

---

### Task 1: Define The Pilot Manifest And Public Asset Contract

**Files:**
- Create: `assets/product-imagery/pilot-manifest.json`
- Create: `src/lib/product-imagery/editorial-assets.ts`
- Create: `src/lib/product-imagery/editorial-catalog.ts`
- Create: `tests/editorial-assets.test.ts`

**Interfaces:**
- Produces: `EDITORIAL_SLOTS`, `EditorialSlot`, `EditorialGallery`, and `getApprovedEditorialGallery(slug: string): EditorialGallery | undefined`.
- Produces: five pilot manifest records with exact supplier references and four output paths each.
- Consumes: no generated image files yet; all pilot records begin with `status: "draft"`.

- [ ] **Step 1: Write the failing contract tests**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import manifest from "../assets/product-imagery/pilot-manifest.json";
import {
  EDITORIAL_SLOTS,
  getApprovedEditorialGallery,
} from "../src/lib/product-imagery/editorial-assets";

const PILOT_SLUGS = [
  "pearl-series-01",
  "new-series-round-shell-disc-drops",
  "new-series-shell-twist-pearl-cuff",
  "new-series-pearl-dreamcatcher-lariat",
  "new-series-pearl-glasses-chain",
];

test("pilot manifest defines five representative products and four ordered slots", () => {
  assert.deepEqual(manifest.products.map((product) => product.slug), PILOT_SLUGS);
  assert.deepEqual(EDITORIAL_SLOTS, ["main", "on-model", "macro", "lifestyle"]);
  for (const product of manifest.products) {
    assert.equal(Object.keys(product.outputs).length, 4);
    assert.equal(product.status, "draft");
    assert.equal(product.sourceReferences.length >= 2, true);
  }
});

test("draft packages never replace source-preserved storefront galleries", () => {
  for (const slug of PILOT_SLUGS) {
    assert.equal(getApprovedEditorialGallery(slug), undefined);
  }
});
```

- [ ] **Step 2: Run the test and verify the missing modules fail**

Run: `node --import tsx --test tests/editorial-assets.test.ts`

Expected: FAIL because `pilot-manifest.json` and `editorial-assets.ts` do not exist.

- [ ] **Step 3: Create the pilot manifest**

Use schema version `1` and these exact pilot records:

```json
{
  "schemaVersion": 1,
  "referenceRoot": "C:\\Users\\11458\\.codex\\generated_images\\019f4467-ba2f-7870-96c2-66c210cfcd72",
  "products": [
    {
      "slug": "pearl-series-01",
      "kind": "ring",
      "sourceReferences": [
        "public/images/products/1688-shop/pearl-series/pearl-series-01-main.webp",
        "public/images/products/1688-shop/pearl-series/pearl-series-01-detail1.webp",
        "public/images/products/1688-shop/pearl-series/pearl-series-01-detail3.webp"
      ],
      "styleReferences": ["product-warm-linen-ring.png", "pose-empty-hand-linen.png", "scene-cafe-terrace.png"],
      "outputs": {
        "main": "public/images/products/editorial-v2/pearl-series-01/01-main.webp",
        "on-model": "public/images/products/editorial-v2/pearl-series-01/02-on-model.webp",
        "macro": "public/images/products/editorial-v2/pearl-series-01/03-macro.webp",
        "lifestyle": "public/images/products/editorial-v2/pearl-series-01/04-lifestyle.webp"
      },
      "status": "draft"
    },
    {
      "slug": "new-series-round-shell-disc-drops",
      "kind": "earrings",
      "sourceReferences": [
        "public/images/products/new-series/new-series-round-shell-disc-drops/main.jpg",
        "public/images/products/new-series/new-series-round-shell-disc-drops/detail-02.jpg",
        "public/images/products/new-series/new-series-round-shell-disc-drops/detail-06.jpg",
        "public/images/products/new-series/new-series-round-shell-disc-drops/detail-07.jpg"
      ],
      "styleReferences": ["product-warm-white-earrings.png", "model-mediterranean-earring-sun.png", "scene-olive-courtyard.png"],
      "outputs": {
        "main": "public/images/products/editorial-v2/new-series-round-shell-disc-drops/01-main.webp",
        "on-model": "public/images/products/editorial-v2/new-series-round-shell-disc-drops/02-on-model.webp",
        "macro": "public/images/products/editorial-v2/new-series-round-shell-disc-drops/03-macro.webp",
        "lifestyle": "public/images/products/editorial-v2/new-series-round-shell-disc-drops/04-lifestyle.webp"
      },
      "status": "draft"
    },
    {
      "slug": "new-series-shell-twist-pearl-cuff",
      "kind": "bracelet",
      "sourceReferences": [
        "public/images/products/new-series/new-series-shell-twist-pearl-cuff/main.jpg",
        "public/images/products/new-series/new-series-shell-twist-pearl-cuff/detail-01.jpg",
        "public/images/products/new-series/new-series-shell-twist-pearl-cuff/detail-02.jpg",
        "public/images/products/new-series/new-series-shell-twist-pearl-cuff/detail-05.jpg"
      ],
      "styleReferences": ["product-baroque-bracelet-cream.png", "model-bracelet-cafe.png", "scene-seaside-stairs.png"],
      "outputs": {
        "main": "public/images/products/editorial-v2/new-series-shell-twist-pearl-cuff/01-main.webp",
        "on-model": "public/images/products/editorial-v2/new-series-shell-twist-pearl-cuff/02-on-model.webp",
        "macro": "public/images/products/editorial-v2/new-series-shell-twist-pearl-cuff/03-macro.webp",
        "lifestyle": "public/images/products/editorial-v2/new-series-shell-twist-pearl-cuff/04-lifestyle.webp"
      },
      "status": "draft"
    },
    {
      "slug": "new-series-pearl-dreamcatcher-lariat",
      "kind": "necklace",
      "sourceReferences": [
        "public/images/products/new-series/new-series-pearl-dreamcatcher-lariat/main.jpg",
        "public/images/products/new-series/new-series-pearl-dreamcatcher-lariat/detail-01.jpg"
      ],
      "styleReferences": ["product-pearl-necklace-linen.png", "model-black-necklace-pool.png", "scene-pool-courtyard.png"],
      "outputs": {
        "main": "public/images/products/editorial-v2/new-series-pearl-dreamcatcher-lariat/01-main.webp",
        "on-model": "public/images/products/editorial-v2/new-series-pearl-dreamcatcher-lariat/02-on-model.webp",
        "macro": "public/images/products/editorial-v2/new-series-pearl-dreamcatcher-lariat/03-macro.webp",
        "lifestyle": "public/images/products/editorial-v2/new-series-pearl-dreamcatcher-lariat/04-lifestyle.webp"
      },
      "status": "draft"
    },
    {
      "slug": "new-series-pearl-glasses-chain",
      "kind": "eyewear-chain",
      "sourceReferences": [
        "public/images/products/new-series/new-series-pearl-glasses-chain/main.jpg",
        "public/images/products/new-series/new-series-pearl-glasses-chain/detail-01.jpg",
        "public/images/products/new-series/new-series-pearl-glasses-chain/detail-02.jpg",
        "public/images/products/new-series/new-series-pearl-glasses-chain/detail-03.jpg"
      ],
      "styleReferences": ["product-eyewear-chain-dark.png", "model-short-bob-blue-linen.png", "scene-flower-storefront.png"],
      "outputs": {
        "main": "public/images/products/editorial-v2/new-series-pearl-glasses-chain/01-main.webp",
        "on-model": "public/images/products/editorial-v2/new-series-pearl-glasses-chain/02-on-model.webp",
        "macro": "public/images/products/editorial-v2/new-series-pearl-glasses-chain/03-macro.webp",
        "lifestyle": "public/images/products/editorial-v2/new-series-pearl-glasses-chain/04-lifestyle.webp"
      },
      "status": "draft"
    }
  ]
}
```

- [ ] **Step 4: Implement the public asset lookup with an empty approved catalog**

```ts
import { EDITORIAL_CATALOG } from "@/lib/product-imagery/editorial-catalog";

export const EDITORIAL_SLOTS = ["main", "on-model", "macro", "lifestyle"] as const;
export type EditorialSlot = (typeof EDITORIAL_SLOTS)[number];
export type EditorialGallery = readonly [string, string, string, string];

export function getApprovedEditorialGallery(slug: string): EditorialGallery | undefined {
  const gallery = EDITORIAL_CATALOG[slug];
  return gallery ? [...gallery] as EditorialGallery : undefined;
}
```

Initialize `src/lib/product-imagery/editorial-catalog.ts` with:

```ts
import type { EditorialGallery } from "@/lib/product-imagery/editorial-assets";

export const EDITORIAL_CATALOG: Readonly<Record<string, EditorialGallery>> = {};
```

- [ ] **Step 5: Run the focused test**

Run: `node --import tsx --test tests/editorial-assets.test.ts`

Expected: 2 tests PASS.

- [ ] **Step 6: Commit the manifest contract**

```powershell
git add -- assets/product-imagery/pilot-manifest.json src/lib/product-imagery/editorial-assets.ts src/lib/product-imagery/editorial-catalog.ts tests/editorial-assets.test.ts
git commit -m "feat(assets): define editorial image packages"
```

---

### Task 2: Add Non-Cropping Normalization And Package Validation

**Files:**
- Create: `scripts/product_imagery/normalize_image.py`
- Create: `scripts/product_imagery/lock_source_hashes.py`
- Create: `scripts/product_imagery/validate_packages.py`
- Create: `tests/product-imagery-tools.test.py`

**Interfaces:**
- Produces: `normalize_image(source: Path, destination: Path) -> None`.
- Produces: `validate_manifest(manifest_path: Path, require_outputs: bool) -> list[str]`.
- Consumes: `assets/product-imagery/pilot-manifest.json`.

- [ ] **Step 1: Write failing Python tests for ratio rejection and valid output**

```python
import tempfile
import unittest
from pathlib import Path
from PIL import Image

from scripts.product_imagery.normalize_image import normalize_image


class NormalizeImageTest(unittest.TestCase):
    def test_normalizes_four_by_five_without_cropping(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.png"
            output = root / "output.webp"
            Image.new("RGB", (800, 1000), "white").save(source)
            normalize_image(source, output)
            with Image.open(output) as image:
                self.assertEqual(image.size, (1600, 2000))
                self.assertEqual(image.format, "WEBP")

    def test_rejects_an_image_that_would_need_cropping(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "square.png"
            Image.new("RGB", (1000, 1000), "white").save(source)
            with self.assertRaisesRegex(ValueError, "4:5"):
                normalize_image(source, root / "output.webp")


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run the test and verify import failure**

Run: `python tests/product-imagery-tools.test.py -v`

Expected: FAIL because `scripts.product_imagery.normalize_image` does not exist.

- [ ] **Step 3: Implement strict non-cropping normalization**

```python
from pathlib import Path
from PIL import Image


TARGET_SIZE = (1600, 2000)
TARGET_RATIO = 4 / 5
RATIO_TOLERANCE = 0.01


def normalize_image(source: Path, destination: Path) -> None:
    with Image.open(source) as image:
        ratio = image.width / image.height
        if abs(ratio - TARGET_RATIO) > RATIO_TOLERANCE:
            raise ValueError(f"Image must already be 4:5; received {image.width}x{image.height}")
        converted = image.convert("RGB").resize(TARGET_SIZE, Image.Resampling.LANCZOS)
        destination.parent.mkdir(parents=True, exist_ok=True)
        converted.save(destination, "WEBP", quality=86, method=6)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    arguments = parser.parse_args()
    normalize_image(arguments.source, arguments.destination)
```

- [ ] **Step 4: Implement source hash locking**

The script reads all `sourceReferences`, resolves them from the repository root, rejects missing files, and writes sorted SHA-256 values to `assets/product-imagery/source-hashes.json`. It refuses to overwrite an existing hash file unless `--verify` is used; verify mode compares without writing and exits nonzero on a mismatch.

- [ ] **Step 5: Implement package validation**

Validation must report all errors in one run and enforce:

```python
EXPECTED_FILES = {
    "main": "01-main.webp",
    "on-model": "02-on-model.webp",
    "macro": "03-macro.webp",
    "lifestyle": "04-lifestyle.webp",
}
EXPECTED_SIZE = (1600, 2000)
MAX_BYTES = 900 * 1024
```

For approved records, open every output with Pillow, require `WEBP`, require `EXPECTED_SIZE`, require the basename assigned to its slot, require the path to contain `/editorial-v2/{slug}/`, and require file size at most `MAX_BYTES`. For draft records, validate paths and sources but permit missing outputs. Always verify the saved supplier hashes.

- [ ] **Step 6: Extend tests for filename, size, and source-hash failures**

Create temporary valid and invalid packages and assert that invalid slot filenames, 1000 by 1000 images, oversized files, missing sources, and changed source hashes each produce a nonempty validation error list.

- [ ] **Step 7: Run Python tests and lock pilot source hashes**

Run: `python tests/product-imagery-tools.test.py -v`

Expected: all tests PASS.

Run: `python scripts/product_imagery/lock_source_hashes.py assets/product-imagery/pilot-manifest.json assets/product-imagery/source-hashes.json`

Expected: hash entries are written for 17 unique pilot supplier files.

- [ ] **Step 8: Commit validation tooling**

```powershell
git add -- scripts/product_imagery assets/product-imagery/source-hashes.json tests/product-imagery-tools.test.py
git commit -m "test(assets): validate editorial image packages"
```

---

### Task 3: Encode Chinese Prompts And Structure Contracts

**Files:**
- Create: `scripts/product_imagery/pilot-prompts.ts`
- Create: `tests/product-imagery-prompts.test.ts`

**Interfaces:**
- Produces: `buildPilotPrompt(slug: string, slot: EditorialSlot): string`.
- Produces: `PRODUCT_CONTRACTS`, with one exact identity rule and one casting rule per pilot SKU.
- Consumes: the four `EDITORIAL_SLOTS` from Task 1.

- [ ] **Step 1: Write the failing prompt coverage test**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { EDITORIAL_SLOTS } from "../src/lib/product-imagery/editorial-assets";
import { buildPilotPrompt, PRODUCT_CONTRACTS } from "../scripts/product_imagery/pilot-prompts";

test("pilot prompt builder emits 20 concrete Chinese prompts", () => {
  const prompts = Object.keys(PRODUCT_CONTRACTS).flatMap((slug) =>
    EDITORIAL_SLOTS.map((slot) => buildPilotPrompt(slug, slot)),
  );
  assert.equal(prompts.length, 20);
  for (const prompt of prompts) {
    assert.match(prompt, /产品身份优先级高于风格参考/);
    assert.match(prompt, /1600x2000/);
    assert.doesNotMatch(prompt, /TBD|TODO|SKU_PLACEHOLDER|占位/);
  }
});
```

- [ ] **Step 2: Run the test and verify the missing prompt module fails**

Run: `node --import tsx --test tests/product-imagery-prompts.test.ts`

Expected: FAIL because `pilot-prompts.ts` does not exist.

- [ ] **Step 3: Implement exact product contracts**

Use these exact identity and casting rules:

```ts
export const PRODUCT_CONTRACTS = {
  "pearl-series-01": {
    identity: "保留金色细环、环顶向一侧展开的金色枝状结构、同一组粉白色大小珍珠及其数量和排列；戒圈必须完整环绕手指，装饰位于手背上方，禁止把戒指贴在指尖或横跨两根手指。",
    casting: "成年黑人女性，真实皮肤纹理，白色亚麻衬衫，咖啡馆石桌旁；手自然握杯但戒指完整可见。",
  },
  "new-series-round-shell-disc-drops": {
    identity: "保留一对金色长耳钩、顶部小珍珠簇、圆形天然贝壳圆片和圆片正面的粉白珍珠竖向排列；左右成对，圆片尺寸、珍珠数量和挂接顺序不得改变。",
    casting: "成年地中海肤色短黑发女性，白色亚麻上衣，橄榄树庭院；头发不能遮住耳钩和圆形贝壳。",
  },
  "new-series-shell-twist-pearl-cuff": {
    identity: "保留金色扭绳开口手镯、两端白色圆珍珠、中央天然白色贝壳装饰及其金线缠绕结构；开口方向、两端珍珠和中央贝壳的相对位置不得改变。",
    casting: "成年白人红发雀斑女性，浅蓝亚麻衬衫，海边石阶露台；手镯围绕手腕，开口与中央贝壳方向合理。",
  },
  "new-series-pearl-dreamcatcher-lariat": {
    identity: "保留金色长链、间隔白色珍珠、圆形镂空中心件、中心件下方单颗珍珠和继续向下延伸的垂坠链；链路、节点顺序和吊坠长度不得改变。",
    casting: "成年黑人女性，象牙白缎面吊带上衣，棕榈水池庭院；完整展示锁骨至胸口的长链走向，不得缩短为普通短项链。",
  },
  "new-series-pearl-glasses-chain": {
    identity: "保留双侧对称金色细链、间隔分布的大小白色珍珠和两端透明眼镜连接套；链条必须分别连接眼镜两侧镜腿，后颈链路连续，不得变成项链或单侧耳饰。",
    casting: "成年拉丁裔短波波头女性，浅蓝亚麻衬衫，暖调花店门前；佩戴细金属框眼镜，两侧连接头和垂链清楚可见。",
  },
} as const;
```

- [ ] **Step 4: Implement four slot directions and the shared anti-drift prompt**

The shared prompt states: photorealistic editorial photography; product identity references override style references; 4:5 portrait composition intended for 1600x2000 output; no text, logo, watermark, extra jewelry, malformed anatomy, plastic skin, floating jewelry, impossible shadows, or changed product topology. Slot directions are:

- `main`: product centered on warm-white linen or limestone, entire silhouette visible, no model.
- `on-model`: use the exact casting rule, show anatomically correct wearing and contact shadows, product remains the focal point.
- `macro`: close structural view with enough depth of field to read fittings and pearl placement, no invented components.
- `lifestyle`: product remains large and readable in the assigned Mediterranean scene, with restrained props and natural hard sunlight.

Add a CLI that accepts `--slug` and prints the four prompts as JSON. Unknown slugs exit with code 1.

- [ ] **Step 5: Run prompt tests and inspect all generated text**

Run: `node --import tsx --test tests/product-imagery-prompts.test.ts`

Expected: PASS.

Run: `npx tsx scripts/product_imagery/pilot-prompts.ts --slug pearl-series-01`

Expected: JSON contains four complete Chinese prompts and no placeholder tokens.

- [ ] **Step 6: Commit prompt contracts**

```powershell
git add -- scripts/product_imagery/pilot-prompts.ts tests/product-imagery-prompts.test.ts
git commit -m "feat(assets): lock pilot image prompts"
```

---

### Task 4: Curate Style References And Build The Review Page

**Files:**
- Create: `assets/product-imagery/style-references/*.png`
- Create: `scripts/product_imagery/build_review.ts`
- Create: `public/preview/product-imagery-review.html`
- Modify: `tests/editorial-assets.test.ts`

**Interfaces:**
- Produces: readable project-local references used by all image-generation tasks.
- Produces: a static local review page with supplier references, four outputs, and QA status per SKU.

- [ ] **Step 1: Copy only the approved reference subset with stable names**

Use `Copy-Item -LiteralPath` to copy these exact sources into `assets/product-imagery/style-references/`:

```text
exec-0c753c28-b23e-4308-8de4-e9462358ac73.png -> product-warm-linen-ring.png
exec-17534d3d-9b49-44d2-add2-93afb0787e83.png -> product-warm-white-earrings.png
exec-55b2c9c8-9fe0-43d8-a3fc-1a48a8ae5747.png -> model-mediterranean-earring-sun.png
exec-5836b108-122c-4c77-93c8-85486453096a.png -> scene-cafe-terrace.png
exec-645bf7d4-a9a2-4f6d-8ecd-6fe30acc1493.png -> scene-flower-storefront.png
exec-73be4c38-4e97-48db-93ba-53d7373f67fd.png -> pose-empty-hand-linen.png
exec-7b46650f-80bc-4210-b421-763dfa5e8046.png -> scene-seaside-stairs.png
exec-82a04394-0685-4b10-94e6-18fa50a11d8f.png -> model-short-bob-blue-linen.png
exec-857fd299-0892-4e5d-b376-3a0aaf1459d0.png -> model-black-necklace-pool.png
exec-8b9ed2c4-02a1-4062-b179-d73888fad0f8.png -> product-pearl-necklace-linen.png
exec-ae794de7-89f5-4829-b177-104c2bd6a25e.png -> product-baroque-bracelet-cream.png
exec-b320c11f-7842-4c3d-bc19-8b0dfe8b7ea0.png -> model-bracelet-cafe.png
exec-cf7b1d47-dbf0-45a9-a7c9-49a3fefc76af.png -> scene-olive-courtyard.png
exec-d7d229be-0b6a-44dd-81a1-f938c4bfae08.png -> scene-pool-courtyard.png
exec-56d725bf-e0b6-44dc-a5ee-e8b45ee5282d.png -> product-eyewear-chain-dark.png
```

Do not copy `exec-a29f5e14-614d-4aa4-97fa-27744d37a9d9.png`; it contains the previously rejected ring-wearing direction.

- [ ] **Step 2: Extend the test to require every named style reference**

Resolve each manifest `styleReferences` item beneath `assets/product-imagery/style-references/` and assert that it exists. Also assert that no manifest string contains `C:\Users` outside the top-level `referenceRoot` field.

- [ ] **Step 3: Build the review-page generator**

The script reads the manifest and `assets/product-imagery/qa/{slug}.json`, converts repository paths beneath `public/` into root-relative URLs, and writes a responsive HTML table. Each product section contains source thumbnails, the four named output slots, status, rejection history, and identity checklist. Missing outputs render a visible `Not generated` block instead of a broken image.

- [ ] **Step 4: Generate the empty review shell and run tests**

Run: `npx tsx scripts/product_imagery/build_review.ts`

Expected: `public/preview/product-imagery-review.html` contains five product sections and 20 `Not generated` blocks.

Run: `npm run test:unit`

Expected: all unit tests PASS.

- [ ] **Step 5: Commit the reference pack and review tooling**

```powershell
git add -- assets/product-imagery/style-references scripts/product_imagery/build_review.ts public/preview/product-imagery-review.html tests/editorial-assets.test.ts
git commit -m "feat(assets): add pilot review workspace"
```

---

### Task 5: Generate And Approve The Ring Package

**Files:**
- Create: `public/images/products/editorial-v2/pearl-series-01/01-main.webp`
- Create: `public/images/products/editorial-v2/pearl-series-01/02-on-model.webp`
- Create: `public/images/products/editorial-v2/pearl-series-01/03-macro.webp`
- Create: `public/images/products/editorial-v2/pearl-series-01/04-lifestyle.webp`
- Create: `assets/product-imagery/qa/pearl-series-01.json`
- Modify: `assets/product-imagery/pilot-manifest.json`

**Interfaces:**
- Consumes: three supplier references, three project-local style references, and four prompts from Tasks 1, 3, and 4.
- Produces: one four-slot package with every ring topology check approved.

- [ ] **Step 1: Inspect all six inputs with `view_image`**

View the three supplier references and the three style references named by the ring manifest record. Record the ring's pearl count, branch direction, ring opening, and correct finger orientation before generation.

- [ ] **Step 2: Generate the four slots separately with built-in `image_gen`**

Print the exact prompts with:

`npx tsx scripts/product_imagery/pilot-prompts.ts --slug pearl-series-01`

Issue one `image_gen` call per slot. Each call references the three supplier images plus only the slot-relevant style images. Do not request four distinct assets in one call.

- [ ] **Step 3: Reject incorrect wearing before normalization**

The ring must encircle exactly one finger with the pearl branch on the back of the hand. Reject any image that places the ring on a fingertip, spans two fingers, changes the pearl cluster, or merges the cup with the jewelry.

- [ ] **Step 4: Normalize accepted PNG outputs**

Copy the four accepted paths reported by `image_gen` into `tmp/product-imagery/pearl-series-01/main.png`, `on-model.png`, `macro.png`, and `lifestyle.png`, then run:

```powershell
python scripts/product_imagery/normalize_image.py tmp/product-imagery/pearl-series-01/main.png public/images/products/editorial-v2/pearl-series-01/01-main.webp
python scripts/product_imagery/normalize_image.py tmp/product-imagery/pearl-series-01/on-model.png public/images/products/editorial-v2/pearl-series-01/02-on-model.webp
python scripts/product_imagery/normalize_image.py tmp/product-imagery/pearl-series-01/macro.png public/images/products/editorial-v2/pearl-series-01/03-macro.webp
python scripts/product_imagery/normalize_image.py tmp/product-imagery/pearl-series-01/lifestyle.png public/images/products/editorial-v2/pearl-series-01/04-lifestyle.webp
```

Every command must succeed without cropping.

- [ ] **Step 5: Write QA evidence and validate**

Write `assets/product-imagery/qa/pearl-series-01.json` with all critical checks set to `true`, the number of attempts for each slot, and concise observed notes. Set the manifest record to `approved` only when all four outputs pass.

Run: `python scripts/product_imagery/validate_packages.py assets/product-imagery/pilot-manifest.json`

Expected: the ring package passes; other draft packages may be missing.

- [ ] **Step 6: Commit the ring package**

```powershell
git add -- public/images/products/editorial-v2/pearl-series-01 assets/product-imagery/qa/pearl-series-01.json assets/product-imagery/pilot-manifest.json
git commit -m "feat(images): add pearl ring editorial package"
```

---

### Task 6: Generate And Approve The Shell Earring Package

**Files:**
- Create: `public/images/products/editorial-v2/new-series-round-shell-disc-drops/01-main.webp`
- Create: `public/images/products/editorial-v2/new-series-round-shell-disc-drops/02-on-model.webp`
- Create: `public/images/products/editorial-v2/new-series-round-shell-disc-drops/03-macro.webp`
- Create: `public/images/products/editorial-v2/new-series-round-shell-disc-drops/04-lifestyle.webp`
- Create: `assets/product-imagery/qa/new-series-round-shell-disc-drops.json`
- Modify: `assets/product-imagery/pilot-manifest.json`

**Interfaces:**
- Consumes: paired earring source views, wearing view, product dimensions, and exact prompt contract.
- Produces: a paired earring package with unchanged hooks, shell discs, and pearl arrangement.

- [ ] **Step 1: Inspect the four supplier references and three style references**

Explicitly note the pair symmetry, hook length, upper pearl cluster, round shell-disc size, and front pearl row.

- [ ] **Step 2: Generate four separate assets with the exact prompt CLI output**

Run: `npx tsx scripts/product_imagery/pilot-prompts.ts --slug new-series-round-shell-disc-drops`

Use built-in `image_gen`, one slot per call, with all four supplier references and only the relevant style reference for that slot.

- [ ] **Step 3: Reject structural drift and incorrect ear attachment**

Reject missing or doubled earrings, altered shell shapes, changed pearl rows, hooks that do not pass through the earlobe, hair passing through metal, or mismatched left and right earrings.

- [ ] **Step 4: Normalize, write QA, approve, and validate**

Normalize each accepted result to the four exact output paths, write the QA JSON, set the manifest record to `approved`, and run package validation.

- [ ] **Step 5: Commit the earring package**

```powershell
git add -- public/images/products/editorial-v2/new-series-round-shell-disc-drops assets/product-imagery/qa/new-series-round-shell-disc-drops.json assets/product-imagery/pilot-manifest.json
git commit -m "feat(images): add shell earring editorial package"
```

---

### Task 7: Generate And Approve The Pearl Cuff Package

**Files:**
- Create: `public/images/products/editorial-v2/new-series-shell-twist-pearl-cuff/01-main.webp`
- Create: `public/images/products/editorial-v2/new-series-shell-twist-pearl-cuff/02-on-model.webp`
- Create: `public/images/products/editorial-v2/new-series-shell-twist-pearl-cuff/03-macro.webp`
- Create: `public/images/products/editorial-v2/new-series-shell-twist-pearl-cuff/04-lifestyle.webp`
- Create: `assets/product-imagery/qa/new-series-shell-twist-pearl-cuff.json`
- Modify: `assets/product-imagery/pilot-manifest.json`

**Interfaces:**
- Consumes: full cuff views, end-detail views, and exact bracelet prompt contract.
- Produces: a cuff package preserving the open construction, two end pearls, center shell, and gold twist.

- [ ] **Step 1: Inspect source and style references and record cuff topology**

Confirm open direction, the two white end pearls, the central natural shell, wire wrapping, and wrist scale.

- [ ] **Step 2: Generate each slot separately**

Run: `npx tsx scripts/product_imagery/pilot-prompts.ts --slug new-series-shell-twist-pearl-cuff`

Use built-in `image_gen` with the four supplier references and slot-relevant style reference.

- [ ] **Step 3: Enforce wrist anatomy and cuff structure**

Reject a closed bangle, extra pearls, missing center shell, changed wire direction, bracelet worn through the hand, floating product, or implausible wrist pressure.

- [ ] **Step 4: Normalize, write QA, approve, validate, and commit**

Run package validation after writing the four files and QA JSON. Commit only this SKU and the manifest status change with message `feat(images): add pearl cuff editorial package`.

---

### Task 8: Generate And Approve The Dreamcatcher Lariat Package

**Files:**
- Create: `public/images/products/editorial-v2/new-series-pearl-dreamcatcher-lariat/01-main.webp`
- Create: `public/images/products/editorial-v2/new-series-pearl-dreamcatcher-lariat/02-on-model.webp`
- Create: `public/images/products/editorial-v2/new-series-pearl-dreamcatcher-lariat/03-macro.webp`
- Create: `public/images/products/editorial-v2/new-series-pearl-dreamcatcher-lariat/04-lifestyle.webp`
- Create: `assets/product-imagery/qa/new-series-pearl-dreamcatcher-lariat.json`
- Modify: `assets/product-imagery/pilot-manifest.json`

**Interfaces:**
- Consumes: two full necklace source views and the exact lariat prompt contract.
- Produces: a package preserving the complete long-chain topology and pendant order.

- [ ] **Step 1: Inspect the two supplier views at original detail**

Record every visible pearl interval, circular center piece, pearl below the center, lower drop chain, and total lariat proportion.

- [ ] **Step 2: Generate all four slots separately**

Run: `npx tsx scripts/product_imagery/pilot-prompts.ts --slug new-series-pearl-dreamcatcher-lariat`

Use built-in `image_gen`; the on-model frame must show enough torso to display the full lariat rather than crop the lower chain.

- [ ] **Step 3: Reject chain shortening and pendant changes**

Reject conversion into a choker, missing lower drop, altered center medallion, changed pearl order, impossible chain crossing, or clothing that hides the identity-defining chain path.

- [ ] **Step 4: Normalize, write QA, approve, validate, and commit**

Commit only this SKU and its manifest status with message `feat(images): add pearl lariat editorial package`.

---

### Task 9: Generate And Approve The Eyewear Chain Package

**Files:**
- Create: `public/images/products/editorial-v2/new-series-pearl-glasses-chain/01-main.webp`
- Create: `public/images/products/editorial-v2/new-series-pearl-glasses-chain/02-on-model.webp`
- Create: `public/images/products/editorial-v2/new-series-pearl-glasses-chain/03-macro.webp`
- Create: `public/images/products/editorial-v2/new-series-pearl-glasses-chain/04-lifestyle.webp`
- Create: `assets/product-imagery/qa/new-series-pearl-glasses-chain.json`
- Modify: `assets/product-imagery/pilot-manifest.json`

**Interfaces:**
- Consumes: front, rear, sunglasses, and dark-frame product views plus exact eyewear-chain prompt contract.
- Produces: a package preserving bilateral connectors, pearl spacing, and chain routing.

- [ ] **Step 1: Inspect all product references and identify both connector ends**

Record transparent connector loops, bilateral gold chains, pearl sizes and spacing, and the route behind the neck.

- [ ] **Step 2: Generate all four slots separately**

Run: `npx tsx scripts/product_imagery/pilot-prompts.ts --slug new-series-pearl-glasses-chain`

Use built-in `image_gen`; require both sides of the glasses chain to remain readable in the on-model and lifestyle frames.

- [ ] **Step 3: Reject necklace conversion or one-sided attachment**

Reject missing connector loops, chains attached to ears, chain converted into a necklace, one-sided chain, changed pearl distribution, or eyeglass temples passing through the head.

- [ ] **Step 4: Normalize, write QA, approve, validate, and commit**

Commit only this SKU and its manifest status with message `feat(images): add pearl eyewear chain package`.

---

### Task 10: Build And Present The Pilot Review Gate

**Files:**
- Modify: `public/preview/product-imagery-review.html`
- Create: `tmp/product-imagery/pilot-contact-sheet.png`

**Interfaces:**
- Consumes: five approved QA records and 20 normalized WebP assets.
- Produces: one local review URL and one compact contact sheet.

- [ ] **Step 1: Run all pilot validation**

Run: `python scripts/product_imagery/lock_source_hashes.py --verify assets/product-imagery/pilot-manifest.json assets/product-imagery/source-hashes.json`

Expected: all source hashes match.

Run: `python scripts/product_imagery/validate_packages.py assets/product-imagery/pilot-manifest.json --require-all`

Expected: 5 packages and 20 images pass.

- [ ] **Step 2: Rebuild the review page**

Run: `npx tsx scripts/product_imagery/build_review.ts`

Expected: the HTML contains five approved sections, all 20 final images, source references, SKU labels, slot labels, and QA status.

- [ ] **Step 3: Start the local production preview**

Run: `npm run build`

Expected: production build PASS.

Run: `npm run start -- --hostname 127.0.0.1 --port 3001`

Open: `http://127.0.0.1:3001/preview/product-imagery-review.html`

- [ ] **Step 4: Verify the review page in Playwright**

At 1440 by 1000 and 390 by 844, verify all 20 final images load, no source image is broken, labels remain readable, and document horizontal overflow is zero.

Save a full-page desktop screenshot to `tmp/product-imagery/pilot-contact-sheet.png` as the compact review artifact.

- [ ] **Step 5: Stop and request explicit user approval**

Do not run Task 11 until the user approves the pilot. If any slot is rejected, set that SKU back to `draft`, regenerate only the rejected slot, update its QA record, rerun validation, and rebuild the review page.

---

### Task 11: Expand The Manifest To All 45 SKUs After Pilot Approval

**Files:**
- Rename: `assets/product-imagery/pilot-manifest.json` to `assets/product-imagery/catalog-manifest.json`
- Modify: `scripts/product_imagery/pilot-prompts.ts`
- Modify: `tests/editorial-assets.test.ts`
- Modify: `tests/product-imagery-prompts.test.ts`

**Interfaces:**
- Consumes: `getStorefrontProducts()` and the approved five-SKU production rules.
- Produces: 45 manifest records, 180 output paths, 45 exact product contracts, and deterministic casting/scene rotation.

- [ ] **Step 1: Change tests to require all storefront products exactly once**

Assert manifest slugs equal `getStorefrontProducts().map(product => product.slug)` after sorting, output paths are unique, there are 180 paths, and the five pilot records remain approved.

- [ ] **Step 2: Add the remaining 40 records from the storefront catalog**

For each record, select two to four images from only that SKU's existing source gallery, assign four exact `editorial-v2` output paths, assign a casting rule that does not repeat the preceding SKU, and assign one product, model, and scene style reference.

- [ ] **Step 3: Add exact topology contracts before generation**

Each contract must enumerate visible components and correct wearing behavior. The prompt test rejects empty contracts, generic phrases shorter than 60 Chinese characters, and duplicate casting strings.

- [ ] **Step 4: Lock hashes for the expanded source set and commit**

Run the hash-lock script in expansion mode, then verify every source. Commit manifest, prompt contracts, hashes, and tests with message `feat(assets): expand editorial catalog manifest`.

---

### Task 12: Generate The Remaining Rings And Bracelets

**Files:**
- Create: `public/images/products/editorial-v2/{slug}/` for the two remaining rings and fourteen remaining bracelets.
- Create: sixteen matching QA JSON files beneath `assets/product-imagery/qa/`.
- Modify: `assets/product-imagery/catalog-manifest.json`.

**Interfaces:**
- Consumes: expanded exact prompt contracts and validated supplier references.
- Produces: 64 approved WebP assets.

- [ ] **Step 1: Generate `pearl-series-02` and `pearl-series-03` one SKU at a time**

For each SKU, print its four prompts, inspect every referenced supplier image, generate four separate images, normalize only accepted outputs, write QA, and validate before moving to the next SKU.

- [ ] **Step 2: Generate the remaining bracelet SKUs one at a time**

Process `pearl-series-04` through `pearl-series-12`, then `new-series-pearl-jade-bracelet`, `new-series-purple-gem-bangle`, `new-series-leaf-turquoise-pearl-cuff`, `new-series-leaf-pearl-bracelet`, and `new-series-round-shell-gold-cuff`.

- [ ] **Step 3: Commit after each approved SKU**

Each commit includes exactly one four-image directory, one QA JSON file, and one manifest status change. Set `$slug` to the literal manifest slug and run `git commit -m "feat(images): add $slug editorial package"`.

- [ ] **Step 4: Run the package validator for all completed records**

Expected: all 21 completed packages pass; ungenerated records remain draft.

---

### Task 13: Generate The Remaining Earrings

**Files:**
- Create: eleven remaining earring directories beneath `public/images/products/editorial-v2/`.
- Create: eleven matching QA JSON files.
- Modify: `assets/product-imagery/catalog-manifest.json`.

**Interfaces:**
- Produces: 44 approved earring WebP assets.

- [ ] **Step 1: Process the core earrings**

Generate and validate `pearl-series-13`, `pearl-series-14`, `pearl-series-15`, and `pearl-series-16` individually.

- [ ] **Step 2: Process the remaining new-series earrings**

Generate and validate `new-series-white-shell-flower-drops`, `new-series-gold-shell-teardrops`, `new-series-baroque-pearl-hoops`, `new-series-purple-gem-pearl-drops`, `new-series-white-petal-flower-earrings`, `new-series-mother-of-pearl-cluster-earrings`, and `new-series-white-shell-triple-drops` individually.

- [ ] **Step 3: Enforce pair and attachment checks before every commit**

Both earrings must match, fittings must attach anatomically, and hair occlusion cannot alter metal or pearl topology. Commit each approved SKU separately.

---

### Task 14: Generate The Remaining Necklaces And Eyewear Chains

**Files:**
- Create: ten remaining necklace directories and three remaining eyewear-chain directories beneath `public/images/products/editorial-v2/`.
- Create: thirteen matching QA JSON files.
- Modify: `assets/product-imagery/catalog-manifest.json`.

**Interfaces:**
- Produces: 52 approved WebP assets.

- [ ] **Step 1: Process the core necklaces**

Generate and validate `pearl-series-17`, `pearl-series-18`, `pearl-series-19`, and `pearl-series-20` individually.

- [ ] **Step 2: Process the remaining new-series necklaces**

Generate and validate `new-series-purple-stone-pendant-necklace`, `new-series-pearl-y-lariat`, `new-series-green-layered-pendant-necklace`, `new-series-pearl-drop-choker`, `new-series-multi-strand-pearl-choker`, and `new-series-black-drop-pearl-choker` individually.

- [ ] **Step 3: Process the remaining eyewear chains**

Generate and validate `new-series-shell-drop-glasses-chain`, `new-series-classic-pearl-chain`, and `new-series-turquoise-bead-chain` individually.

- [ ] **Step 4: Verify the complete production manifest**

Run validation with `--require-all`.

Expected: 45 packages, 180 WebP files, zero hash changes, zero size or ownership errors.

---

### Task 15: Map Approved Editorial Galleries Into The Storefront

**Files:**
- Modify: `src/lib/product-imagery/editorial-catalog.ts`
- Modify: `src/lib/storefront/catalog.ts`
- Modify: `src/app/products/[slug]/1688-product.tsx`
- Modify: `src/components/product/ProductCard.tsx`
- Modify: `tests/storefront-catalog.test.ts`
- Modify: `scripts/verify-source-preserved-catalog.ts`

**Interfaces:**
- Consumes: 45 approved manifest records.
- Produces: a public mapping with 45 four-image galleries and no private source paths.

- [ ] **Step 1: Read the installed Next.js Image documentation**

Read: `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`

Confirm `fill`, parent positioning, `sizes`, and current deprecations before editing components.

- [ ] **Step 2: Write failing storefront tests**

Require every storefront product to expose exactly four `/images/products/editorial-v2/{slug}/` images in slot order. Require public catalog source text not to contain `C:\Users`, `generated_images`, prompts, or QA notes.

- [ ] **Step 3: Generate the public editorial catalog**

Write 45 explicit readonly entries to `editorial-catalog.ts`, each containing the four public root-relative paths. Do not import the private manifest into browser code.

- [ ] **Step 4: Overlay approved galleries centrally**

In `src/lib/storefront/catalog.ts`, clone the base product, call `getApprovedEditorialGallery(product.slug)`, and replace `image` plus `images` only when a four-image approved gallery exists.

- [ ] **Step 5: Standardize storefront frames to 4:5**

Keep product cards at `aspect-[4/5]`. Change the product-detail main frame and thumbnails from `aspect-square` to `aspect-[4/5]`. Continue using `object-cover`, but verify all generated compositions keep the product inside the crop-safe area.

- [ ] **Step 6: Make hover labeling semantic rather than filename-dependent**

Replace the `secondImage.includes("-worn.")` check with `product.images.length === 4 && secondImage.endsWith("/02-on-model.webp")`. Use accurate alt text: main product view, product worn by a model, product construction detail, and product lifestyle view.

- [ ] **Step 7: Run focused tests and catalog verifier**

Run: `node --import tsx --test tests/editorial-assets.test.ts tests/storefront-catalog.test.ts`

Expected: PASS.

Run: `npx tsx scripts/verify-source-preserved-catalog.ts`

Expected: supplier hashes remain unchanged and all 45 approved editorial galleries resolve.

- [ ] **Step 8: Commit storefront integration**

```powershell
git add -- src/lib/product-imagery/editorial-catalog.ts src/lib/storefront/catalog.ts src/app/products/[slug]/1688-product.tsx src/components/product/ProductCard.tsx tests/storefront-catalog.test.ts scripts/verify-source-preserved-catalog.ts
git commit -m "feat(storefront): use approved editorial galleries"
```

---

### Task 16: Verify SEO Surfaces, Browser Behavior, And Local Preview

**Files:**
- Create: `e2e/product-imagery.spec.ts`
- Modify: `tests/seo-catalog.test.ts`
- Modify: `public/preview/product-imagery-review.html`

**Interfaces:**
- Consumes: final storefront catalog and 180 approved assets.
- Produces: release evidence without deployment.

- [ ] **Step 1: Write failing SEO and browser checks**

Unit tests require feed and structured-data image arrays to use approved editorial paths for all 45 products. Playwright visits one product per type, checks the 4:5 main frame, clicks through four labeled images in order, verifies product-card hover loads `02-on-model.webp`, checks all image responses are 200, and asserts zero horizontal overflow at 320, 390, and 1440 pixels.

- [ ] **Step 2: Run tests and fix only imagery-related failures**

Run: `npm run test:unit`

Run: `npx tsc --noEmit`

Run: `npm run build`

Expected: all commands PASS.

- [ ] **Step 3: Start the production server locally**

Run hidden on `127.0.0.1:3001`, writing stdout and stderr to `.superpowers/sdd/server.out.log` and `.superpowers/sdd/server.err.log`. If port 3001 belongs to an unrelated process, stop and report the conflict rather than killing it.

- [ ] **Step 4: Run complete Playwright coverage**

Run: `npx playwright test --reporter=line`

Expected: all existing tests plus `product-imagery.spec.ts` PASS.

- [ ] **Step 5: Rebuild the full review page**

Generate a 45-SKU comparison page and inspect representative ring, bracelet, earring, necklace, and eyewear-chain sections at desktop and mobile widths.

- [ ] **Step 6: Leave the local server running and report release blockers**

Provide `http://127.0.0.1:3001/` and `http://127.0.0.1:3001/preview/product-imagery-review.html`. Confirm no Vercel deployment occurred. Repeat the existing requirement to rotate the exposed Pinterest client secret before any public release.

- [ ] **Step 7: Commit verification coverage**

```powershell
git add -- e2e/product-imagery.spec.ts tests/seo-catalog.test.ts public/preview/product-imagery-review.html
git commit -m "test(storefront): verify editorial product imagery"
```
