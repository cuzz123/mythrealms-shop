# White Shell Triple Drops A/B First Frames Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create two approved 9:16, naturally integrated model-and-earring first frames and their four-second Xiaoyunque I2V production records.

**Architecture:** Each variant is stored as a standalone first-frame asset beneath a dedicated `SHOT_WHITE_SHELL_TRIPLE_DROPS_COLD_START_001` directory. A JSON record preserves the product lock, source scene, model action, and I2V prompt; a matching Obsidian card exposes the image and copyable prompt.

**Tech Stack:** Built-in image generation, PNG assets, JSON metadata, Markdown/Obsidian frontmatter, PowerShell validation.

## Global Constraints

- Use `public/images/products/new-series/new-series-white-shell-triple-drops/main.jpg` only as the product reference.
- Preserve one pair of gold fish-hook earrings with three vertically connected irregular white shell drops per earring.
- Both frames are photorealistic vertical 9:16 scenes with natural model-to-location integration and no text, watermark, extra jewelry, duplicated product, or cutout look.
- I2V uses `@Image1`, lasts four seconds, and has exactly one visible subject action plus one camera movement.
- Do not modify storefront files.

---

### Task 1: Create asset records and generate two approved frames

**Files:**
- Create: `video-pipeline/asset-library/09-shot-templates/SHOT_WHITE_SHELL_TRIPLE_DROPS_COLD_START_001/first-frames/FF_WHITE_SHELL_TRIPLE_DROPS_01_ARCH_HAIR_TUCK-v1.png`
- Create: `video-pipeline/asset-library/09-shot-templates/SHOT_WHITE_SHELL_TRIPLE_DROPS_COLD_START_001/first-frames/FF_WHITE_SHELL_TRIPLE_DROPS_02_SEA_STAIR_LOOKBACK-v1.png`
- Create: `video-pipeline/asset-library/09-shot-templates/SHOT_WHITE_SHELL_TRIPLE_DROPS_COLD_START_001/template.json`

**Interfaces:**
- Consumes: the product source image and `SCENE_FOUNDATION_LIMESTONE_ARCH_SHADE_001` / `SCENE_FOUNDATION_SEA_STAIR_LANDING_001`.
- Produces: two approved `frames[]` records with `path`, `target_duration_seconds: 4`, and a Chinese `seedance_prompt_zh`.

- [ ] **Step 1: Generate the arch hair-tuck hook**

Use the product image as a structure reference and generate a real 9:16 Mediterranean arch scene: adult model in right-third three-quarter close portrait, hand just finishing a hair tuck behind the near ear, white shell triple-drop earring fully legible against pale limestone, warm side light, foreground vine depth, no isolated subject.

- [ ] **Step 2: Generate the sea-stair look-back lifestyle frame**

Use the product image as a structure reference and generate a real 9:16 sea-stair scene: adult model pauses on the lower stone stair and looks back over the near shoulder, sea and olive foreground dominate the composition, the near white shell triple-drop earring remains readable, warm frame-right sun with water bounce, no isolated subject.

- [ ] **Step 3: Write `template.json`**

Include exactly two frames:

```json
{
  "id": "FF_WHITE_SHELL_TRIPLE_DROPS_01_ARCH_HAIR_TUCK",
  "role": "human_visual_hook_product_reveal",
  "path": "first-frames/FF_WHITE_SHELL_TRIPLE_DROPS_01_ARCH_HAIR_TUCK-v1.png",
  "approval_status": "approved",
  "mode": "I2V",
  "target_duration_seconds": 4,
  "scene_asset_id": "SCENE_FOUNDATION_LIMESTONE_ARCH_SHADE_001",
  "seedance_prompt_zh": "@Image1为首帧，严格保持..."
}
```

Frame two uses `SCENE_FOUNDATION_SEA_STAIR_LANDING_001` and role `scene_led_emotional_cta`.

- [ ] **Step 4: Validate image and record invariants**

Run:

```powershell
Add-Type -AssemblyName System.Drawing
$template = Get-Content video-pipeline/asset-library/09-shot-templates/SHOT_WHITE_SHELL_TRIPLE_DROPS_COLD_START_001/template.json -Raw -Encoding utf8 | ConvertFrom-Json
if ($template.frames.Count -ne 2) { throw 'Expected two frames' }
$template.frames | ForEach-Object {
  if ($_.mode -ne 'I2V' -or $_.target_duration_seconds -ne 4 -or [string]::IsNullOrWhiteSpace($_.seedance_prompt_zh)) { throw "Invalid frame: $($_.id)" }
  $image = Join-Path 'video-pipeline/asset-library/09-shot-templates/SHOT_WHITE_SHELL_TRIPLE_DROPS_COLD_START_001' $_.path
  $bitmap = [System.Drawing.Image]::FromFile($image)
  try { if ($bitmap.Height -le $bitmap.Width) { throw "Not portrait: $($_.id)" } } finally { $bitmap.Dispose() }
}
```

Expected: command exits successfully.

- [ ] **Step 5: Commit**

```powershell
git add video-pipeline/asset-library/09-shot-templates/SHOT_WHITE_SHELL_TRIPLE_DROPS_COLD_START_001
git commit -m "assets: add white shell first-frame variants"
```

### Task 2: Publish the production card

**Files:**
- Create: `video-pipeline/asset-library/obsidian-vault/02-镜头配方/SHOT_WHITE_SHELL_TRIPLE_DROPS_COLD_START_001｜白贝三垂耳环首帧A-B.md`

**Interfaces:**
- Consumes: the two approved frame records in Task 1.
- Produces: a previewable Obsidian card with product-lock constraints, both image links, and the exact copyable I2V prompts.

- [ ] **Step 1: Create the Obsidian production card**

Use frontmatter with `id: SHOT_WHITE_SHELL_TRIPLE_DROPS_COLD_START_001`, `asset_type: shot_template`, `status: approved_first_frames`, `format: 9:16`, and tags for `white-shell`, `earrings`, `first-frame`, and `xiaoyunque`.

- [ ] **Step 2: Verify the card**

Run:

```powershell
$card = Get-Content 'video-pipeline/asset-library/obsidian-vault/02-镜头配方/SHOT_WHITE_SHELL_TRIPLE_DROPS_COLD_START_001｜白贝三垂耳环首帧A-B.md' -Raw -Encoding utf8
if ($card -notmatch 'FF_WHITE_SHELL_TRIPLE_DROPS_01_ARCH_HAIR_TUCK' -or $card -notmatch '小云雀 I2V 提示词') { throw 'Production card is incomplete' }
```

Expected: command exits successfully.

- [ ] **Step 3: Commit**

```powershell
git add 'video-pipeline/asset-library/obsidian-vault/02-镜头配方/SHOT_WHITE_SHELL_TRIPLE_DROPS_COLD_START_001｜白贝三垂耳环首帧A-B.md'
git commit -m "assets: publish white shell production card"
```

## Plan Self-Review

- Spec coverage: Task 1 creates both approved first frames, product locks, and four-second I2V prompts; Task 2 publishes their previews and prompts in Obsidian.
- Placeholder scan: all output paths, IDs, scene IDs, record fields, and validation commands are explicit.
- Type consistency: both tasks use the same shot-template ID and frame IDs.
