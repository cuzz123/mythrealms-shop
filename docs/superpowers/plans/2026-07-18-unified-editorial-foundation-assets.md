# Unified Editorial Foundation Assets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add twelve reusable, photorealistic 9:16 jewelry foundation assets with Chinese four-second I2V prompts and Obsidian relationships for the four cold-start product lines.

**Architecture:** Store each approved image in a stable `FOUNDATION_*` directory beside an `asset.json` manifest. Add character, scene, product, and style reference records; each foundation manifest connects those records by ID. Obsidian cards mirror the metadata and prompt so the 5174 asset library can show the asset without storefront changes.

**Tech Stack:** Existing asset-library conventions, JSON metadata, Markdown/Obsidian frontmatter, built-in image generation, PowerShell validation, local 5174 preview.

## Global Constraints

- Output is photorealistic 9:16 Mediterranean warm-sun editorial: natural adult models, ivory plaster, pale limestone, undyed linen, olive-leaf shadows, late-afternoon side light.
- Generate exactly twelve approved frames: three per product.
- Exclude text, logos, watermarks, duplicate jewelry, cups, tables, laptops, vases, and unrelated props.
- Each Chinese I2V prompt uses `@Image1`, exactly one subject action, exactly one camera move, and a four-second duration.
- Do not modify storefront files, existing shot-template files, or unrelated dirty worktree files.

---

### Task 1: Add reusable relationship records

**Files:**
- Create: `video-pipeline/asset-library/05-characters/CHAR_FOUNDATION_{VIOLET_RAIN,MOON_DISC,TURQUOISE_LEAF,FALLING_PEARL}_001/reference.json`
- Create: `video-pipeline/asset-library/03-scenes/SCENE_FOUNDATION_MEDITERRANEAN_{COURTYARD,SEA_TERRACE,POOL_COURTYARD,ROOFTOP}_001/reference.json`
- Create: `video-pipeline/asset-library/01-products/PROD_FOUNDATION_{VIOLET_RAIN,MOON_DISC,TURQUOISE_LEAF,FALLING_PEARL}_001/reference.json`
- Create: `video-pipeline/asset-library/07-styles/STYLE_FOUNDATION_MEDITERRANEAN_EDITORIAL_001/reference.json`

**Interfaces:**
- Consumes: approved product references and product slugs from `09-shot-templates`.
- Produces: stable `character_id`, `scene_id`, `product_id`, and `style_id` values for asset manifests.

- [ ] **Step 1: Add the reference-record schema**

Use one small JSON object per record, following existing `reference.json` conventions:

```json
{
  "id": "CHAR_FOUNDATION_VIOLET_RAIN_001",
  "asset_type": "editorial_character_reference",
  "status": "foundation_ready",
  "version": "v1",
  "title": "Violet Rain Editorial Model",
  "created_at": "2026-07-18",
  "tags": ["foundation", "mediterranean-editorial"],
  "relationships": {
    "product_id": "PROD_FOUNDATION_VIOLET_RAIN_001",
    "scene_id": "SCENE_FOUNDATION_MEDITERRANEAN_COURTYARD_001",
    "style_id": "STYLE_FOUNDATION_MEDITERRANEAN_EDITORIAL_001"
  }
}
```

- [ ] **Step 2: Verify IDs are unique**

Run:

```powershell
$records = Get-ChildItem video-pipeline/asset-library/05-characters,video-pipeline/asset-library/03-scenes,video-pipeline/asset-library/01-products,video-pipeline/asset-library/07-styles -Recurse -Filter reference.json | ForEach-Object { Get-Content $_.FullName -Raw | ConvertFrom-Json }
$records.id | Group-Object | Where-Object Count -gt 1
```

Expected: no output.

- [ ] **Step 3: Commit**

```powershell
git add video-pipeline/asset-library/05-characters video-pipeline/asset-library/03-scenes video-pipeline/asset-library/01-products video-pipeline/asset-library/07-styles
git commit -m "assets: add foundation visual relationship records"
```

### Task 2: Define all twelve first-frame manifests and I2V prompts

**Files:**
- Create: `video-pipeline/asset-library/06-reference-inputs/FOUNDATION_{VIOLET_RAIN,MOON_DISC,TURQUOISE_LEAF,FALLING_PEARL}_{HALF_BODY,SIDE_PROFILE,FULL_BODY}_001/asset.json`
- Replace the non-applicable role names with `WRIST` for Turquoise Leaf and `COLLARBONE` for Falling Pearl.

**Interfaces:**
- Consumes: IDs from Task 1.
- Produces: twelve `asset.json` records with `image_path`, relationships, and Chinese `i2v.prompt_zh`.

- [ ] **Step 1: Use the manifest contract**

```json
{
  "schema_version": "1.0",
  "id": "FOUNDATION_VIOLET_RAIN_HALF_BODY_001",
  "asset_type": "foundation_first_frame",
  "status": "planned",
  "format": "9:16",
  "image_path": "image.png",
  "relationships": {
    "character_id": "CHAR_FOUNDATION_VIOLET_RAIN_001",
    "scene_id": "SCENE_FOUNDATION_MEDITERRANEAN_COURTYARD_001",
    "product_id": "PROD_FOUNDATION_VIOLET_RAIN_001",
    "style_id": "STYLE_FOUNDATION_MEDITERRANEAN_EDITORIAL_001"
  },
  "i2v": {
    "mode": "I2V",
    "duration_seconds": 4,
    "prompt_zh": "@Image1为首帧，严格保持……"
  }
}
```

- [ ] **Step 2: Lock the action/camera pair by role**

| Role | Only subject action | Only camera move |
| --- | --- | --- |
| half-body earring | model turns chin once | restrained push-in |
| side-profile earring | model tucks hair behind ear once | slow lateral slide |
| full-body interaction | model pauses beside wall once | gentle pull-back |
| wrist close-up | wrist turns once | macro push-in |
| collarbone close-up | model exhales once | slow downward tilt |

Each prompt must prohibit extra jewelry, duplicate body parts, substitutions, text, logos, and watermarks.

- [ ] **Step 3: Validate the planned records**

```powershell
$assets = Get-ChildItem video-pipeline/asset-library/06-reference-inputs/FOUNDATION_* -Recurse -Filter asset.json | ForEach-Object { Get-Content $_.FullName -Raw | ConvertFrom-Json }
if ($assets.Count -ne 12) { throw "Expected 12 manifests, got $($assets.Count)" }
$assets | ForEach-Object {
  if ($_.format -ne '9:16' -or $_.i2v.mode -ne 'I2V' -or $_.i2v.duration_seconds -ne 4 -or [string]::IsNullOrWhiteSpace($_.i2v.prompt_zh)) { throw "Invalid manifest: $($_.id)" }
}
```

Expected: command exits successfully.

- [ ] **Step 4: Commit**

```powershell
git add video-pipeline/asset-library/06-reference-inputs
git commit -m "assets: define foundation first-frame prompts"
```

### Task 3: Generate, inspect, and retain the twelve images

**Files:**
- Create: `image.png` beside each Task 2 `asset.json`.
- Modify: each Task 2 `asset.json`, changing `status` to `approved` only after visual acceptance.

**Interfaces:**
- Consumes: the exact product, framing, and relationship requirements from Task 2.
- Produces: twelve decodable vertical PNG images ready to upload as Xiaoyunque `@Image1` references.

- [ ] **Step 1: Generate each asset independently**

Use the built-in image generator once per manifest with this prompt skeleton:

```text
Use case: photorealistic-natural
Asset type: reusable 9:16 I2V first frame for jewelry advertising
Primary request: [manifest-specific product placement and framing]
Scene/backdrop: Mediterranean warm-sun editorial, ivory plaster, pale limestone, undyed linen, olive-leaf shadows, late-afternoon side light
Subject: one believable adult female model wearing only the intended jewelry item
Composition: [close, half-body, side-profile, or full-body as required]; product is clearly readable
Avoid: text, logos, watermark, cups, tables, laptops, vases, unrelated props, extra jewelry, duplicate limbs, deformed fingers
```

- [ ] **Step 2: Copy only the selected output**

Save each approved image as:

```text
video-pipeline/asset-library/06-reference-inputs/FOUNDATION_<PRODUCT>_<ROLE>_001/image.png
```

Do not overwrite an image belonging to another stable ID.

- [ ] **Step 3: Perform visual acceptance**

Regenerate when the intended jewelry is unreadable or misplaced, a model is not a believable adult, hands are malformed, a forbidden prop appears, the frame is not vertical, or the visual language breaks the shared direction.

- [ ] **Step 4: Decode and dimension-check**

```powershell
Add-Type -AssemblyName System.Drawing
$images = Get-ChildItem video-pipeline/asset-library/06-reference-inputs/FOUNDATION_* -Recurse -Filter image.png
if ($images.Count -ne 12) { throw "Expected 12 images, got $($images.Count)" }
$images | ForEach-Object {
  $img = [System.Drawing.Image]::FromFile($_.FullName)
  try { if ($img.Height -le $img.Width) { throw "Not portrait: $($_.FullName)" } } finally { $img.Dispose() }
}
```

Expected: command exits successfully.

- [ ] **Step 5: Commit**

```powershell
git add video-pipeline/asset-library/06-reference-inputs
git commit -m "assets: add unified editorial foundation frames"
```

### Task 4: Publish the foundation assets to Obsidian and validate 5174

**Files:**
- Create: twelve `FOUNDATION_*.md` cards in `video-pipeline/asset-library/obsidian-vault/01-资产卡/`.
- Modify: `video-pipeline/asset-library/99-manifests/local-assets.json` by appending twelve foundation entries.

**Interfaces:**
- Consumes: approved Task 3 files and Task 1 relationships.
- Produces: previewable, searchable foundation asset cards with copyable Chinese I2V prompts.

- [ ] **Step 1: Create a card per manifest**

```markdown
---
id: FOUNDATION_VIOLET_RAIN_HALF_BODY_001
asset_type: foundation_first_frame
status: approved
format: 9:16
product_id: PROD_FOUNDATION_VIOLET_RAIN_001
character_id: CHAR_FOUNDATION_VIOLET_RAIN_001
scene_id: SCENE_FOUNDATION_MEDITERRANEAN_COURTYARD_001
style_id: STYLE_FOUNDATION_MEDITERRANEAN_EDITORIAL_001
duration_seconds: 4
tags: [foundation, I2V, Violet-Rain, Mediterranean-Editorial]
---

# Violet Rain｜半身耳饰基础首帧

![](file:///D:/mythrealms-shop/video-pipeline/asset-library/06-reference-inputs/FOUNDATION_VIOLET_RAIN_HALF_BODY_001/image.png)

## 小云雀 I2V 提示词

[copy the matching manifest value of i2v.prompt_zh exactly]
```

- [ ] **Step 2: Append the local manifest records**

Each `local-assets.json` entry must have `id`, `asset_type: "foundation-first-frame"`, `status: "available"`, `library_path`, `preview.thumbnail` pointing to `image.png`, and `obsidian_card`.

- [ ] **Step 3: Check cards, files, and prompts**

```powershell
$manifests = Get-ChildItem video-pipeline/asset-library/06-reference-inputs/FOUNDATION_* -Recurse -Filter asset.json | ForEach-Object { Get-Content $_.FullName -Raw | ConvertFrom-Json }
$cards = Get-ChildItem 'video-pipeline/asset-library/obsidian-vault/01-资产卡' -Filter 'FOUNDATION_*.md'
if ($cards.Count -ne 12) { throw "Expected 12 Obsidian cards, got $($cards.Count)" }
$manifests | ForEach-Object {
  if (-not (Test-Path (Join-Path (Split-Path $_.PSPath) $_.image_path))) { throw "Missing image: $($_.id)" }
  if ([string]::IsNullOrWhiteSpace($_.i2v.prompt_zh)) { throw "Missing I2V prompt: $($_.id)" }
}
```

Expected: command exits successfully.

- [ ] **Step 4: Preview in the local library and run tests**

Open `http://127.0.0.1:5174/`, search `FOUNDATION_VIOLET_RAIN_HALF_BODY_001`, and confirm the still image, relationship metadata, and prompt are shown. Then run:

```powershell
npm run test:unit
```

Expected: all existing unit tests pass.

- [ ] **Step 5: Commit**

```powershell
git add video-pipeline/asset-library/obsidian-vault/01-资产卡 video-pipeline/asset-library/99-manifests/local-assets.json
git commit -m "assets: publish foundation frames to Obsidian library"
```

## Plan Self-Review

- Spec coverage: Task 1 builds reusable model, scene, product, and style links. Task 2 supplies every fixed-four-second Chinese I2V prompt. Task 3 creates and accepts exactly twelve 9:16 frames. Task 4 makes all assets searchable and previewable in Obsidian/5174.
- Placeholder scan: this plan contains no unfinished markers. The one card template instruction requires copying a defined manifest field exactly rather than inventing new content.
- Type consistency: all tasks use `FOUNDATION_<PRODUCT>_<ROLE>_001`, `asset.json`, `reference.json`, `relationships`, `image_path`, and `i2v.prompt_zh` consistently.
