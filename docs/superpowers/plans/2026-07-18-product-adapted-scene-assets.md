# Product-Adapted Scene Assets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build twelve reusable 9:16 photorealistic location assets with Chinese four-second I2V prompts and Obsidian scene cards.

**Architecture:** Each scene lives under `03-scenes/SCENE_FOUNDATION_*` with a machine-readable `scene.json`, one approved `image.png`, and a product-use tag set. Obsidian cards mirror the metadata and expose the image, framing zone, model position, light direction, and copyable prompt.

**Tech Stack:** Built-in image generation, JSON metadata, Markdown/Obsidian frontmatter, PowerShell validation, local 5174 preview.

## Global Constraints

- Images are 9:16, photorealistic Mediterranean late-afternoon editorial spaces with pale limestone, weathered ivory plaster, and physically coherent light.
- Every scene must provide a credible place for a person to stand, sit, lean, or pass through; no composited cutout look.
- Preserve foreground, middle distance, background depth, contact shadows, environmental bounce light, and a usable product-framing zone.
- Exclude text, logos, watermarks, cups, tables, laptops, vases, and unrelated product props.
- Each Chinese I2V prompt has one environmental motion, one camera motion, and a four-second duration.
- Do not modify storefront files or existing product/shot-template assets.

---

### Task 1: Define twelve scene manifests

**Files:**
- Create: twelve `video-pipeline/asset-library/03-scenes/SCENE_FOUNDATION_*/scene.json` files.

**Interfaces:**
- Produces: `id`, `compatible_product_types`, `model_position`, `light_direction`, `framing_zone`, `image_path`, and `i2v.prompt_zh` for Tasks 2 and 3.

- [ ] **Step 1: Create the scene record contract**

```json
{
  "schema_version": "1.0",
  "id": "SCENE_FOUNDATION_SEA_STAIR_LANDING_001",
  "asset_type": "product_adapted_scene",
  "status": "planned",
  "format": "9:16",
  "style_id": "STYLE_FOUNDATION_MEDITERRANEAN_EDITORIAL_001",
  "compatible_product_types": ["earrings"],
  "model_position": "pause on the lower stair, shoulder clear of the sea horizon",
  "light_direction": "late-afternoon sun from frame right",
  "framing_zone": "head and near ear remain clear against pale sea and stone",
  "image_path": "image.png",
  "i2v": {
    "mode": "I2V",
    "duration_seconds": 4,
    "prompt_zh": "@Image1为首帧，……"
  }
}
```

- [ ] **Step 2: Define the exact scene IDs**

```text
SCENE_FOUNDATION_SEA_STAIR_LANDING_001
SCENE_FOUNDATION_LIMESTONE_ARCH_SHADE_001
SCENE_FOUNDATION_TERRACE_RAILING_001
SCENE_FOUNDATION_POOLSIDE_LOUNGER_EDGE_001
SCENE_FOUNDATION_WATER_SIDE_STONE_LEDGE_001
SCENE_FOUNDATION_OLIVE_TREE_BENCH_001
SCENE_FOUNDATION_ROOFTOP_DOORWAY_001
SCENE_FOUNDATION_SUNSET_TERRACE_001
SCENE_FOUNDATION_LINEN_WINDOW_CHAIR_001
SCENE_FOUNDATION_WHITE_WALL_MOVING_SHADE_001
SCENE_FOUNDATION_PLANTED_COURTYARD_PASSAGE_001
SCENE_FOUNDATION_SEA_VIEW_CORRIDOR_001
```

- [ ] **Step 3: Validate all planned manifests**

```powershell
$scenes = Get-ChildItem video-pipeline/asset-library/03-scenes/SCENE_FOUNDATION_* -Recurse -Filter scene.json | ForEach-Object { Get-Content $_.FullName -Raw -Encoding utf8 | ConvertFrom-Json }
if ($scenes.Count -ne 12) { throw "Expected 12 scenes, got $($scenes.Count)" }
$scenes | ForEach-Object {
  if ($_.format -ne '9:16' -or $_.i2v.mode -ne 'I2V' -or $_.i2v.duration_seconds -ne 4 -or [string]::IsNullOrWhiteSpace($_.i2v.prompt_zh)) { throw "Invalid scene: $($_.id)" }
}
```

Expected: command exits successfully.

- [ ] **Step 4: Commit**

```powershell
git add video-pipeline/asset-library/03-scenes/SCENE_FOUNDATION_*
git commit -m "assets: define product-adapted scene manifests"
```

### Task 2: Generate and accept twelve real-location images

**Files:**
- Create: `image.png` beside each Task 1 scene manifest.
- Modify: each `scene.json` status from `planned` to `approved`.

**Interfaces:**
- Consumes: Task 1 location metadata.
- Produces: twelve vertical base frames with coherent model placement, depth, and product-framing zones.

- [ ] **Step 1: Generate one image per scene**

Use the built-in generator once per scene:

```text
Use case: photorealistic-natural
Asset type: reusable 9:16 jewelry advertising location
Primary request: [scene-specific location and model movement lane]
Scene: one continuous Mediterranean real location, foreground / middle distance / background all visible
Lighting: natural late-afternoon sun with a stated direction, contact shadows, reflected light, and aerial depth
Composition: clear [ear / wrist / collarbone] product zone; real scale for an adult model
Avoid: isolated subject, cutout silhouette, studio backdrop, text, logos, watermarks, cups, tables, laptops, vases, unrelated props
```

- [ ] **Step 2: Accept only location-realistic outputs**

Reject and regenerate a scene if it looks composited, lacks a usable position for a model, has inconsistent shadows, lacks depth, or blocks the intended product zone.

- [ ] **Step 3: Verify image files and aspect ratios**

```powershell
Add-Type -AssemblyName System.Drawing
$images = Get-ChildItem video-pipeline/asset-library/03-scenes/SCENE_FOUNDATION_* -Recurse -Filter image.png
if ($images.Count -ne 12) { throw "Expected 12 images, got $($images.Count)" }
$images | ForEach-Object {
  $image = [System.Drawing.Image]::FromFile($_.FullName)
  try { if ($image.Height -le $image.Width) { throw "Not portrait: $($_.FullName)" } } finally { $image.Dispose() }
}
```

Expected: command exits successfully.

- [ ] **Step 4: Commit**

```powershell
git add video-pipeline/asset-library/03-scenes/SCENE_FOUNDATION_*
git commit -m "assets: add product-adapted scene images"
```

### Task 3: Publish scene cards to Obsidian and check 5174

**Files:**
- Create: twelve cards in `video-pipeline/asset-library/obsidian-vault/01-资产卡/`.
- Modify: `video-pipeline/asset-library/99-manifests/local-assets.json`.

**Interfaces:**
- Consumes: approved Task 2 scene files.
- Produces: searchable scene asset cards in the existing local library.

- [ ] **Step 1: Create one Obsidian card per scene**

```markdown
---
id: SCENE_FOUNDATION_SEA_STAIR_LANDING_001
asset_type: product_adapted_scene
status: approved
format: 9:16
style_id: STYLE_FOUNDATION_MEDITERRANEAN_EDITORIAL_001
compatible_product_types: [earrings]
light_direction: late-afternoon sun from frame right
tags: [scene, foundation, Mediterranean-Editorial, earrings]
---

# 海边石阶落点

![](file:///D:/mythrealms-shop/video-pipeline/asset-library/03-scenes/SCENE_FOUNDATION_SEA_STAIR_LANDING_001/image.png)

## 模特站位
下层石阶停留，肩部避开海平线。

## 小云雀 I2V 提示词

[copy the matching scene.json i2v.prompt_zh exactly]
```

- [ ] **Step 2: Add the twelve local-library manifest records**

Each entry must expose `id`, `asset_type: "product-adapted-scene"`, `status: "available"`, `library_path`, `preview.thumbnail` pointing to `image.png`, and `obsidian_card`.

- [ ] **Step 3: Verify cards and browse a representative scene**

Run the Task 1 JSON check plus the Task 2 image check. Open `http://127.0.0.1:5174/`, search `SCENE_FOUNDATION_SEA_STAIR_LANDING_001`, and confirm its image plus prompt metadata render.

- [ ] **Step 4: Commit**

```powershell
git add video-pipeline/asset-library/obsidian-vault/01-资产卡 video-pipeline/asset-library/99-manifests/local-assets.json
git commit -m "assets: publish product-adapted scenes to Obsidian"
```

## Plan Self-Review

- Spec coverage: Task 1 defines all twelve locations and their prompts. Task 2 creates and validates real-location images. Task 3 makes every approved scene available in Obsidian and 5174.
- Placeholder scan: no unfinished markers exist; card prompt text is copied from a defined manifest field.
- Type consistency: all tasks use `SCENE_FOUNDATION_*`, `scene.json`, `image.png`, and `i2v.prompt_zh` consistently.

