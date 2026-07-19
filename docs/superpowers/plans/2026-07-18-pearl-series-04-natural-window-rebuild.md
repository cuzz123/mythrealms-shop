# Pearl Series 04 Natural Window Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable, realistic natural-window asset pack for Pearl Series 04 before creating new storyboard frames or Seedance prompts.

**Architecture:** Keep scene, talent, product, prop, and storyboard references independent. Generated raster anchors live inside the relevant asset folders; a small manifest makes absolute reference paths explicit for later prompting. The older dark `VID_MR_BLUE_RELIQUARY_001` package remains untouched and is not a dependency.

**Tech Stack:** Built-in image generation, PowerShell, Markdown, JSON asset registry, Obsidian Markdown cards.

## Global Constraints

- Visual direction is a real window-side linen apartment: cream mineral plaster, pale walnut, ivory linen, gentle daylight, realistic human skin.
- Reuse `CHAR_MR_TALENT_CURLY_LINEN_001` as the talent identity basis.
- The product structure is locked to `D:\mythrealms-shop\public\images\products\1688-shop\pearl-series\pearl-series-04-detail1.webp`.
- Preserve cobalt-blue stones, blush pearl clusters, antique-gold filigree and link geometry; do not substitute generic diamonds, silver jewelry, or a redesign.
- Create no black void, stage spotlight, fantasy smoke, ornate antique-box, or plastic-skin imagery.
- Every output is additive and versioned; do not overwrite historical dark-package files.
- Every new visual asset must be stored in the workspace and listed by an absolute path in the package manifest.

---

## File Structure

- Create: `video-pipeline/asset-library/03-scene-kits/ENV_MR_NATURAL_WINDOW_LINEN_APARTMENT_001/source/`
  - Environment panorama and reverse-angle environment anchor.
- Create: `video-pipeline/asset-library/05-characters/CHAR_MR_TALENT_CURLY_LINEN_001/source/natural-window-pack/`
  - Three-view turnaround, expression sheet, and motion contact sheet.
- Create: `video-pipeline/asset-library/03-scene-kits/PROP_MR_LINEN_BOOK_AND_CERAMIC_001/source/`
  - Prop turnaround.
- Create: `video-pipeline/asset-library/01-products/PROD_MR_PEARL_SERIES_04_001/`
  - Product structure-lock card that references the existing e-commerce source image without duplicating it.
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_PEARL_SERIES_04_NATURAL_WINDOW_001/`
  - Asset-pack manifest and later storyboard prompt package.
- Create: `video-pipeline/asset-library/obsidian-vault/01-资产卡/`
  - One Obsidian card per new scene, prop, product and storyboard package.
- Modify: `video-pipeline/asset-library/registry/assets.json`
  - Add records after previews and cards exist.

### Task 1: Establish the environment anchors

**Files:**
- Create: `video-pipeline/asset-library/03-scene-kits/ENV_MR_NATURAL_WINDOW_LINEN_APARTMENT_001/source/window-apartment-panorama-v1.png`
- Create: `video-pipeline/asset-library/03-scene-kits/ENV_MR_NATURAL_WINDOW_LINEN_APARTMENT_001/source/window-apartment-reverse-v1.png`
- Create: `video-pipeline/asset-library/03-scene-kits/ENV_MR_NATURAL_WINDOW_LINEN_APARTMENT_001/README.md`

**Consumes:** The global visual constraints.

**Produces:** A forward panorama and reverse anchor that locate the window, linen curtain, armchair, pale walnut table and walking space.

- [ ] **Step 1: Generate the forward panorama**

Use the built-in image generator with this prompt:

```text
Use case: photorealistic-natural
Asset type: Seedance environment anchor, forward wide panorama
Primary request: a truly photoreal editorial photograph of a quiet lived-in apartment corner in late morning, viewed from the interior toward a tall window. Cream mineral-plaster walls, sheer ivory linen curtains, a simple oatmeal linen armchair, pale walnut side table, a hand-thrown off-white ceramic dish, a closed flax-covered book, pale oak floor. There is an open clear walking path between window and chair. No people, no jewelry, no text, no logo.
Composition/framing: 16:9 wide horizontal frame, natural eye level, enough information to preserve spatial geometry for later moving-camera shots.
Lighting/mood: soft side daylight through linen, gentle true shadows, natural exposure, editorial lifestyle photography.
Constraints: believable scale and materials; nothing theatrical, no black void, no ornate set dressing, no staged spotlight, no CGI look, no watermark.
```

- [ ] **Step 2: Generate the reverse environment anchor**

Use the built-in image generator with this prompt:

```text
Use case: photorealistic-natural
Asset type: Seedance environment anchor, reverse angle
Primary request: a truly photoreal editorial photograph of the same quiet lived-in apartment corner, viewed from beside the tall window back into the room. Keep the same cream mineral-plaster walls, ivory linen curtains at the frame edge, oatmeal linen armchair, pale walnut side table, off-white ceramic dish, flax-covered book and pale oak floor. Show how the chair and table relate to the doorway and the window. No people, no jewelry, no text, no logo.
Composition/framing: 16:9 wide horizontal frame, natural eye level, reverse of the forward environment anchor.
Lighting/mood: the same late-morning soft window daylight, true shadows and restrained warm neutrals.
Constraints: physically plausible spatial continuity; no black void, no fantasy objects, no ornate set, no stage lighting, no watermark.
```

- [ ] **Step 3: Validate the pair**

Run this PowerShell validation after files are copied into the workspace:

```powershell
$dir = 'video-pipeline/asset-library/03-scene-kits/ENV_MR_NATURAL_WINDOW_LINEN_APARTMENT_001/source'
$required = 'window-apartment-panorama-v1.png','window-apartment-reverse-v1.png'
$missing = $required | Where-Object { -not (Test-Path (Join-Path $dir $_)) }
if ($missing) { throw "Missing environment anchor(s): $($missing -join ', ')" }
"environment-anchors=ok"
```

Expected: `environment-anchors=ok`.

- [ ] **Step 4: Document the environment card**

Write `README.md` with the two relative paths, camera continuity rule, daylight rule and reuse note.

- [ ] **Step 5: Commit**

```powershell
git add -- video-pipeline/asset-library/03-scene-kits/ENV_MR_NATURAL_WINDOW_LINEN_APARTMENT_001
git commit -m "assets: add natural window environment anchors"
```

### Task 2: Establish the talent identity and natural performance pack

**Files:**
- Create: `video-pipeline/asset-library/05-characters/CHAR_MR_TALENT_CURLY_LINEN_001/source/natural-window-pack/turnaround-v1.png`
- Create: `video-pipeline/asset-library/05-characters/CHAR_MR_TALENT_CURLY_LINEN_001/source/natural-window-pack/expressions-v1.png`
- Create: `video-pipeline/asset-library/05-characters/CHAR_MR_TALENT_CURLY_LINEN_001/source/natural-window-pack/motion-contacts-v1.png`
- Create: `video-pipeline/asset-library/05-characters/CHAR_MR_TALENT_CURLY_LINEN_001/source/natural-window-pack/README.md`

**Consumes:** Existing `CHAR_MR_TALENT_CURLY_LINEN_001` turnaround as identity reference and Task 1 environment anchors as scene reference.

**Produces:** A front/side/back sheet, a restrained expression sheet and a usable action-contact sheet.

- [ ] **Step 1: Generate the three-view sheet**

Use the existing talent turnaround as an identity reference. Generate a front, left-profile and back full-body sheet on the same neutral real apartment-light background; the woman wears a low-saturation ivory linen dress, natural curls and minimal makeup. Require anatomical proportions, unposed shoulders and real skin texture. Exclude product jewelry and text.

- [ ] **Step 2: Generate the expression sheet**

Use the approved turnaround as identity reference. Generate a 3×3 close portrait sheet with neutral, reading, a small off-window glance, lowered gaze, relaxed inhale, subtle recognition, soft concentration, a restrained half-smile and a calm direct look. Keep each panel photographic, same daylight and same person; no exaggerated commercial smile or beauty-filter skin.

- [ ] **Step 3: Generate the motion contacts**

Use the approved turnaround and forward environment anchor. Generate six separated full-body stills of the same woman: seated reading, rising from chair, walking toward window, pausing at curtain, arranging linen cuff, touching the side of her neck below the ear. Keep hands anatomically plausible and no jewelry in frame so later product insert shots stay controlled.

- [ ] **Step 4: Validate the identity pack**

```powershell
$dir = 'video-pipeline/asset-library/05-characters/CHAR_MR_TALENT_CURLY_LINEN_001/source/natural-window-pack'
$required = 'turnaround-v1.png','expressions-v1.png','motion-contacts-v1.png'
$missing = $required | Where-Object { -not (Test-Path (Join-Path $dir $_)) }
if ($missing) { throw "Missing talent anchor(s): $($missing -join ', ')" }
"talent-pack=ok"
```

Expected: `talent-pack=ok`.

- [ ] **Step 5: Document and commit**

Document reference role and do-not-change identity traits in `README.md`, then run:

```powershell
git add -- video-pipeline/asset-library/05-characters/CHAR_MR_TALENT_CURLY_LINEN_001/source/natural-window-pack
git commit -m "assets: add natural window talent pack"
```

### Task 3: Establish the product structure lock and supporting prop

**Files:**
- Create: `video-pipeline/asset-library/01-products/PROD_MR_PEARL_SERIES_04_001/README.md`
- Create: `video-pipeline/asset-library/03-scene-kits/PROP_MR_LINEN_BOOK_AND_CERAMIC_001/source/turnaround-v1.png`
- Create: `video-pipeline/asset-library/03-scene-kits/PROP_MR_LINEN_BOOK_AND_CERAMIC_001/README.md`

**Consumes:** The existing product source image and Task 1 palette.

**Produces:** An explicit product lock and one non-distracting supporting-prop turnaround.

- [ ] **Step 1: Write the product lock**

Create a Markdown card that names and links the exact source image:

```text
D:\mythrealms-shop\public\images\products\1688-shop\pearl-series\pearl-series-04-detail1.webp
```

The card must list cobalt-blue stones, blush pearl clusters, antique-gold filigree, antique-gold links and no redesign rule.

- [ ] **Step 2: Generate the prop turnaround**

Create one three-panel photo sheet of a small flax-covered book, an off-white ceramic dish and pale walnut side-table edge: front, side and overhead / usable placement views. Match the window-apartment daylight and avoid jewelry, brand text or extra decorative props.

- [ ] **Step 3: Validate product and prop records**

```powershell
$product = 'video-pipeline/asset-library/01-products/PROD_MR_PEARL_SERIES_04_001/README.md'
$prop = 'video-pipeline/asset-library/03-scene-kits/PROP_MR_LINEN_BOOK_AND_CERAMIC_001/source/turnaround-v1.png'
if (-not (Test-Path $product)) { throw 'Missing product lock card' }
if (-not (Test-Path $prop)) { throw 'Missing prop turnaround' }
"product-prop-pack=ok"
```

Expected: `product-prop-pack=ok`.

- [ ] **Step 4: Document and commit**

```powershell
git add -- video-pipeline/asset-library/01-products/PROD_MR_PEARL_SERIES_04_001 video-pipeline/asset-library/03-scene-kits/PROP_MR_LINEN_BOOK_AND_CERAMIC_001
git commit -m "assets: lock pearl series 04 and window props"
```

### Task 4: Register the asset pack and create the storyboard-package manifest

**Files:**
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_PEARL_SERIES_04_NATURAL_WINDOW_001/asset-pack-manifest.json`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_PEARL_SERIES_04_NATURAL_WINDOW_001/README.md`
- Create: `video-pipeline/asset-library/obsidian-vault/01-资产卡/ENV_MR_NATURAL_WINDOW_LINEN_APARTMENT_001｜自然窗边亚麻公寓.md`
- Create: `video-pipeline/asset-library/obsidian-vault/01-资产卡/PROP_MR_LINEN_BOOK_AND_CERAMIC_001｜亚麻书与陶瓷托盘.md`
- Create: `video-pipeline/asset-library/obsidian-vault/01-资产卡/PROD_MR_PEARL_SERIES_04_001｜钴蓝粉珍珠首饰组.md`
- Create: `video-pipeline/asset-library/obsidian-vault/03-参考拆解/VID_MR_PEARL_SERIES_04_NATURAL_WINDOW_001｜自然窗边重构.md`
- Modify: `video-pipeline/asset-library/registry/assets.json`

**Consumes:** Tasks 1–3 asset paths.

**Produces:** A reference manifest with absolute paths and library / Obsidian discoverability.

- [ ] **Step 1: Create the asset manifest**

Use this JSON shape, replacing no paths with aliases:

```json
{
  "id": "VID_MR_PEARL_SERIES_04_NATURAL_WINDOW_001",
  "asset_roles": {
    "environment_forward": "D:\\mythrealms-shop\\video-pipeline\\asset-library\\03-scene-kits\\ENV_MR_NATURAL_WINDOW_LINEN_APARTMENT_001\\source\\window-apartment-panorama-v1.png",
    "environment_reverse": "D:\\mythrealms-shop\\video-pipeline\\asset-library\\03-scene-kits\\ENV_MR_NATURAL_WINDOW_LINEN_APARTMENT_001\\source\\window-apartment-reverse-v1.png",
    "talent_turnaround": "D:\\mythrealms-shop\\video-pipeline\\asset-library\\05-characters\\CHAR_MR_TALENT_CURLY_LINEN_001\\source\\natural-window-pack\\turnaround-v1.png",
    "talent_expressions": "D:\\mythrealms-shop\\video-pipeline\\asset-library\\05-characters\\CHAR_MR_TALENT_CURLY_LINEN_001\\source\\natural-window-pack\\expressions-v1.png",
    "talent_actions": "D:\\mythrealms-shop\\video-pipeline\\asset-library\\05-characters\\CHAR_MR_TALENT_CURLY_LINEN_001\\source\\natural-window-pack\\motion-contacts-v1.png",
    "product_structure": "D:\\mythrealms-shop\\public\\images\\products\\1688-shop\\pearl-series\\pearl-series-04-detail1.webp",
    "prop_turnaround": "D:\\mythrealms-shop\\video-pipeline\\asset-library\\03-scene-kits\\PROP_MR_LINEN_BOOK_AND_CERAMIC_001\\source\\turnaround-v1.png"
  }
}
```

- [ ] **Step 2: Validate every absolute reference path**

```powershell
$manifest = Get-Content -Raw 'video-pipeline/asset-library/10-storyboard-videos/VID_MR_PEARL_SERIES_04_NATURAL_WINDOW_001/asset-pack-manifest.json' | ConvertFrom-Json
$missing = $manifest.asset_roles.psobject.Properties | Where-Object { -not (Test-Path $_.Value) }
if ($missing) { throw "Broken asset role(s): $($missing.Name -join ', ')" }
"natural-window-manifest=ok"
```

Expected: `natural-window-manifest=ok`.

- [ ] **Step 3: Add registry and Obsidian cards**

Add `available` records that point only to files proven by Step 2. Each Obsidian card must embed or link its preview image and point back to the manifest.

- [ ] **Step 4: Commit**

```powershell
git add -- video-pipeline/asset-library/10-storyboard-videos/VID_MR_PEARL_SERIES_04_NATURAL_WINDOW_001 video-pipeline/asset-library/obsidian-vault video-pipeline/asset-library/registry/assets.json
git commit -m "assets: register natural window pearl pack"
```

### Task 5: Rebuild the storyboard only after asset-pack acceptance

**Files:**
- Create: `video-pipeline/work/2026-07-18-pearl-series-04-natural-window/natural-window-master-storyboard.md`
- Create: `video-pipeline/work/2026-07-18-pearl-series-04-natural-window/seedance-prompts.md`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_PEARL_SERIES_04_NATURAL_WINDOW_001/cut-map.md`

**Consumes:** Approved Task 4 asset manifest.

**Produces:** New 4-second-or-longer generation prompts that reference every asset by absolute path, hold product reveal until the story has established the room and model, and include edit / audio continuity at each cut.

- [ ] **Step 1: Write a shot audit before prompts**

List every shot with `scene role`, `action`, `product visibility`, `duration >= 4s`, `camera`, `incoming bridge`, and `outgoing bridge`. Reject any shot which cannot cite an asset role in `asset-pack-manifest.json`.

- [ ] **Step 2: Write the prompt records**

For each prompt, include only absolute paths from the approved manifest. Give each path one role: environment, talent identity, product structure or action. State the intended first frame, movement, lighting continuity, no-redesign product rule, and sound bridge.

- [ ] **Step 3: Validate story prompts**

```powershell
$promptFile = 'video-pipeline/work/2026-07-18-pearl-series-04-natural-window/seedance-prompts.md'
$text = Get-Content -Raw $promptFile
if ($text -match '@[A-Za-z0-9_-]+\.png') { throw 'Unresolved image alias found' }
if ($text -notmatch 'D:\\mythrealms-shop\\') { throw 'No absolute reference paths found' }
if ($text -notmatch '4 秒|4s') { throw 'No four-second duration rule found' }
"natural-window-prompts=ok"
```

Expected: `natural-window-prompts=ok`.

- [ ] **Step 4: Commit**

```powershell
git add -- video-pipeline/work/2026-07-18-pearl-series-04-natural-window video-pipeline/asset-library/10-storyboard-videos/VID_MR_PEARL_SERIES_04_NATURAL_WINDOW_001
git commit -m "docs: add natural window pearl storyboard"
```
