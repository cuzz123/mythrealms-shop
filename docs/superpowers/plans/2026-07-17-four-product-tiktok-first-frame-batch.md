# Four-Product TikTok First-Frame Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce 16 approved photorealistic first frames, four Seedance shot templates, four TikTok distribution packages, and four Chinese Obsidian shot cards for New Series products 004, 008, 012, and 016.

**Architecture:** Work product by product so product-identity errors are repaired before the visual grammar propagates. Each product owns one self-contained shot-template folder with four images and one `template.json`; its Chinese Obsidian card links to that folder and carries the same prompts, cost ledger, captions, BGM direction, and landing URLs.

**Tech Stack:** Built-in `image_gen`, Seedance 2.0 Fast I2V prompt contracts, PNG, JSON, Markdown/Obsidian, PowerShell verification, MythRealms 5174 Next.js asset preview.

## Global Constraints

- Follow `docs/superpowers/specs/2026-07-17-four-product-tiktok-first-frame-batch-design.md` exactly.
- Generate 16 portrait images at approximately 9:16; every frame must be motion-ready for one 4-second clip.
- Preserve exact product geometry from the selected storefront gallery; product identity has priority over scene spectacle.
- Use photorealistic adult models, natural skin texture, Mediterranean architecture, and physically plausible light.
- Do not generate text, logos, watermarks, packaging, unrelated jewelry, cups, books, tables, chairs, vases, flowers, or decorative product substitutes.
- Use one subject action and one camera move per Seedance prompt; include a concrete end state.
- Add captions, CTA, logo, BGM, and jewelry chime in post only.
- Use TikTok Commercial Music Library or documented owned music; no unlicensed track names.
- Store final artifacts only in the Obsidian film asset library; do not replace storefront product images.
- Four base Seedance takes cost 176 credits per product at 44 credits per 4-second take; the four-product base cost is 704 credits.
- Inspect each generated frame before moving to the next product. Repair one failed variable at a time.

## File Map

**Create:**

- `video-pipeline/asset-library/09-shot-templates/SHOT_VIOLET_RAIN_COLD_START_001/template.json`
- `video-pipeline/asset-library/09-shot-templates/SHOT_VIOLET_RAIN_COLD_START_001/Thumbnail.png`
- `video-pipeline/asset-library/09-shot-templates/SHOT_VIOLET_RAIN_COLD_START_001/first-frames/*.png`
- `video-pipeline/asset-library/09-shot-templates/SHOT_MOON_DISC_COLD_START_001/template.json`
- `video-pipeline/asset-library/09-shot-templates/SHOT_MOON_DISC_COLD_START_001/Thumbnail.png`
- `video-pipeline/asset-library/09-shot-templates/SHOT_MOON_DISC_COLD_START_001/first-frames/*.png`
- `video-pipeline/asset-library/09-shot-templates/SHOT_TURQUOISE_LEAF_COLD_START_001/template.json`
- `video-pipeline/asset-library/09-shot-templates/SHOT_TURQUOISE_LEAF_COLD_START_001/Thumbnail.png`
- `video-pipeline/asset-library/09-shot-templates/SHOT_TURQUOISE_LEAF_COLD_START_001/first-frames/*.png`
- `video-pipeline/asset-library/09-shot-templates/SHOT_FALLING_PEARL_COLD_START_001/template.json`
- `video-pipeline/asset-library/09-shot-templates/SHOT_FALLING_PEARL_COLD_START_001/Thumbnail.png`
- `video-pipeline/asset-library/09-shot-templates/SHOT_FALLING_PEARL_COLD_START_001/first-frames/*.png`
- `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Violet Rain 紫暮庭院冷启动 9x16.md`
- `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Moon Disc 海光变彩冷启动 9x16.md`
- `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Turquoise Leaf 泳池庭院冷启动 9x16.md`
- `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Falling Pearl 屋顶黄昏冷启动 9x16.md`

**Read-only references:**

- `video-pipeline/asset-library/09-shot-templates/SHOT_BAROQUE_ORBIT_COLD_START_001/template.json`
- `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Baroque Orbit 真实地中海冷启动 9x16.md`
- `C:/Users/11458/.codex/generated_images/019f4467-ba2f-7870-96c2-66c210cfcd72/*.png`

---

### Task 1: Product 004 - The Violet Rain

**Files:**
- Create: `video-pipeline/asset-library/09-shot-templates/SHOT_VIOLET_RAIN_COLD_START_001/`
- Create: `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Violet Rain 紫暮庭院冷启动 9x16.md`
- Reference: `public/images/products/new-series/new-series-purple-gem-pearl-drops/main.jpg`
- Reference: `public/images/products/new-series/new-series-purple-gem-pearl-drops/detail-01.jpg`
- Reference: `public/images/products/new-series/new-series-purple-gem-pearl-drops/detail-02.jpg`
- Reference: `public/images/products/new-series/new-series-purple-gem-pearl-drops/detail-03.jpg`

**Interfaces:**
- Consumes: Product gallery and the approved four-frame contract in the design spec.
- Produces: Four approved frame files, `template.json` ID `SHOT_VIOLET_RAIN_COLD_START_001`, and one linked Obsidian card.

- [ ] **Step 1: Generate the macro hook**

Use built-in image generation with the product gallery as exact identity references. Generate a 9:16 blue-hour macro of one earring: irregular central white pearl, purple stone border, gold connector, dark-haired adult model context only if needed, violet practical reflection, 85 mm editorial realism. Save as:

`first-frames/FF_VIOLET_RAIN_01_MACRO_HOOK-v1.png`

- [ ] **Step 2: Generate the pair proof**

Generate the exact pair resting on dark wet limestone, separated and fully readable, one narrow violet reflection path, no decorative props. Save as:

`first-frames/FF_VIOLET_RAIN_02_WET_LIMESTONE_PAIR-v1.png`

- [ ] **Step 3: Generate the wearing proof**

Generate a tight side profile of the same realistic dark-haired olive-skin adult model in a deep plum or black sleeveless top. Keep one complete earring unobstructed and action-ready for a 10-degree chin turn. Save as:

`first-frames/FF_VIOLET_RAIN_03_WEARING_PROFILE-v1.png`

- [ ] **Step 4: Generate the arch look-back ending**

Generate a medium-wide courtyard arch composition with the same model entering the right third, earring visible, evening sky and arch providing left-side copy-safe space. Save as:

`first-frames/FF_VIOLET_RAIN_04_ARCH_LOOKBACK_END-v1.png`

- [ ] **Step 5: Review and repair the four images**

Inspect all four with `view_image`. Reject any frame with a changed pearl shape, missing purple border, extra earring components, plastic skin, malformed ear, duplicated jewelry, illegible product, generated text, or repeated composition. Repair only the failed attribute and use a sibling `-v2.png` filename; never overwrite the rejected file.

- [ ] **Step 6: Write the shot template and Obsidian card**

Create `template.json` with `version: "v1"`, four approved dynamic frames, 4-second Chinese Seedance prompts, `recommended_base_cost_credits: 176`, landing path `/products/new-series-purple-gem-pearl-drops`, campaign `violet_rain_cold_start`, three English captions, direct-product pinned comment, hashtags, 96-100 BPM CML music plan, and 24-hour test rules. Use the ending frame as `Thumbnail.png`.

- [ ] **Step 7: Verify Product 004**

Run:

```powershell
$t = Get-Content -Raw -LiteralPath 'video-pipeline\asset-library\09-shot-templates\SHOT_VIOLET_RAIN_COLD_START_001\template.json' | ConvertFrom-Json
if ($t.frames.Count -ne 4 -or ($t.frames | Where-Object animate).Count -ne 4) { throw '004 frame contract failed' }
$t.frames | ForEach-Object { if (-not (Test-Path -LiteralPath (Join-Path 'video-pipeline\asset-library\09-shot-templates\SHOT_VIOLET_RAIN_COLD_START_001' $_.path))) { throw "Missing $($_.path)" } }
```

Expected: no output and exit code 0.

- [ ] **Step 8: Commit Product 004 assets**

```powershell
git add -- 'video-pipeline/asset-library/09-shot-templates/SHOT_VIOLET_RAIN_COLD_START_001' 'video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Violet Rain 紫暮庭院冷启动 9x16.md'
git commit -m "assets: add Violet Rain TikTok shot package"
```

### Task 2: Product 008 - The Moon Disc

**Files:**
- Create: `video-pipeline/asset-library/09-shot-templates/SHOT_MOON_DISC_COLD_START_001/`
- Create: `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Moon Disc 海光变彩冷启动 9x16.md`
- Reference: `public/images/products/new-series/new-series-round-shell-disc-drops/main.jpg`
- Reference: `public/images/products/new-series/new-series-round-shell-disc-drops/detail-01.jpg`
- Reference: `public/images/products/new-series/new-series-round-shell-disc-drops/detail-02.jpg`
- Reference: `public/images/products/new-series/new-series-round-shell-disc-drops/detail-06.jpg`

**Interfaces:**
- Consumes: Exact round-disc geometry and bright seaside visual contract.
- Produces: Four approved frame files, `template.json` ID `SHOT_MOON_DISC_COLD_START_001`, and one linked Obsidian card.

- [ ] **Step 1: Generate four distinct images**

Generate and save:

1. `FF_MOON_DISC_01_IRIDESCENT_MACRO-v1.png`: one round mother-of-pearl disc, hook and pearl cluster visible, green-pink spectral color ready for a few-degree rotation.
2. `FF_MOON_DISC_02_SEASIDE_PAIR-v1.png`: exact pair hanging against pale limestone with blue-water negative space and moving-caustic potential.
3. `FF_MOON_DISC_03_SUN_TURN-v1.png`: realistic short-haired brunette in a white linen shirt beginning in open shade, one complete disc below the jaw.
4. `FF_MOON_DISC_04_OVER_SHOULDER_FOCUS_END-v1.png`: over-shoulder coastal composition, sea in deep background, one foreground disc ready for a sea-to-product focus pull.

- [ ] **Step 2: Review and repair Product 008**

Reject noncircular or duplicated discs, lost shell iridescence, incorrect hook, missing pearl cluster, extra jewelry, face obstruction, artificial skin, generated text, or any composition that repeats Product 004. Repair one variable and version the filename.

- [ ] **Step 3: Write the package**

Create `template.json`, `Thumbnail.png`, and the Chinese Obsidian card. Use `/products/new-series-round-shell-disc-drops`, campaign `moon_disc_cold_start`, hook `The color changes when you move.`, 102-106 BPM organic house/Balearic CML direction, four Chinese Seedance prompts, three captions, direct pinned comment, and 24-hour diagnostics.

- [ ] **Step 4: Verify and commit Product 008**

Parse the JSON, assert four dynamic frames, assert each image path exists, assert the landing path matches the slug, then commit only the Product 008 shot folder and card with:

```powershell
git commit -m "assets: add Moon Disc TikTok shot package"
```

### Task 3: Product 012 - The Turquoise Leaf

**Files:**
- Create: `video-pipeline/asset-library/09-shot-templates/SHOT_TURQUOISE_LEAF_COLD_START_001/`
- Create: `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Turquoise Leaf 泳池庭院冷启动 9x16.md`
- Reference: `public/images/products/new-series/new-series-leaf-turquoise-pearl-cuff/main.jpg`
- Reference: `public/images/products/new-series/new-series-leaf-turquoise-pearl-cuff/detail-01.jpg`
- Reference: `public/images/products/new-series/new-series-leaf-turquoise-pearl-cuff/detail-02.jpg`

**Interfaces:**
- Consumes: Exact open-cuff geometry and pool-courtyard visual contract.
- Produces: Four approved frame files, `template.json` ID `SHOT_TURQUOISE_LEAF_COLD_START_001`, and one linked Obsidian card.

- [ ] **Step 1: Generate four distinct images**

Generate and save:

1. `FF_TURQUOISE_LEAF_01_WRIST_ROLL_MACRO-v1.png`: realistic freckled red-haired adult model, cream linen sleeve, complete open cuff with turquoise side stones, central shell element, pearl row, and terminal pearl ends.
2. `FF_TURQUOISE_LEAF_02_POOL_LIMESTONE_PRODUCT-v1.png`: bracelet alone on pale limestone near turquoise water, no bowl, cup, flower, book, or furniture.
3. `FF_TURQUOISE_LEAF_03_SLEEVE_REVEAL-v1.png`: waist-up crop with one hand ready to draw back the sleeve and reveal the bracelet.
4. `FF_TURQUOISE_LEAF_04_STAIR_WALL_TRACK_END-v1.png`: hand at a limestone wall while descending steps, wrist and bracelet readable, sun patch ahead as the motion endpoint.

- [ ] **Step 2: Review and repair Product 012**

Reject closed-circle bracelets, missing turquoise stones, changed central shell, wrong pearl count pattern, extra cuffs, malformed hands, sleeve covering the product, decorative props, generated text, or repeated earring-style compositions. Repair one variable and version the filename.

- [ ] **Step 3: Write the package**

Create `template.json`, `Thumbnail.png`, and the Chinese card with `/products/new-series-leaf-turquoise-pearl-cuff`, campaign `turquoise_leaf_cold_start`, hook `Made for sunlit skin.`, 108-112 BPM minimal-fashion-percussion CML direction, four Chinese Seedance prompts, three captions, direct pinned comment, and 24-hour diagnostics.

- [ ] **Step 4: Verify and commit Product 012**

Parse the JSON, assert four dynamic frames and four existing image paths, inspect all links, then commit only the Product 012 folder and card with:

```powershell
git commit -m "assets: add Turquoise Leaf TikTok shot package"
```

### Task 4: Product 016 - The Falling Pearl

**Files:**
- Create: `video-pipeline/asset-library/09-shot-templates/SHOT_FALLING_PEARL_COLD_START_001/`
- Create: `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Falling Pearl 屋顶黄昏冷启动 9x16.md`
- Reference: `public/images/products/new-series/new-series-pearl-y-lariat/main.jpg`
- Reference: `public/images/products/new-series/new-series-pearl-y-lariat/detail-01.jpg`
- Reference: `public/images/products/new-series/new-series-pearl-y-lariat/detail-02.jpg`

**Interfaces:**
- Consumes: Exact Y-lariat chain and rooftop blue-hour visual contract.
- Produces: Four approved frame files, `template.json` ID `SHOT_FALLING_PEARL_COLD_START_001`, and one linked Obsidian card.

- [ ] **Step 1: Generate four distinct images**

Generate and save:

1. `FF_FALLING_PEARL_01_VERTICAL_DROP_REVEAL-v1.png`: tight ivory-neckline crop showing the upper pearl sequence and central Y junction, with room to tilt down toward the final pearl.
2. `FF_FALLING_PEARL_02_LIMESTONE_FULL_PRODUCT-v1.png`: complete exact necklace arranged vertically on plain pale limestone, no bust, bowl, flowers, or unrelated props.
3. `FF_FALLING_PEARL_03_LOWEST_PEARL_TOUCH-v1.png`: realistic dark-skinned adult model, ivory open neckline, entire Y path visible, one hand poised at the lowest pearl.
4. `FF_FALLING_PEARL_04_ROOFTOP_WALK_END-v1.png`: three-quarter rooftop walk toward the skyline, profile turn available, necklace readable against ivory fabric, no product substitution.

- [ ] **Step 2: Review and repair Product 016**

Reject altered Y geometry, missing final pearl, shortened chain, extra necklace layers, covered junction, malformed hand, plastic skin, dark unreadable product, generated text, or an ending that repeats the Violet Rain arch. Repair one variable and version the filename.

- [ ] **Step 3: Write the package**

Create `template.json`, `Thumbnail.png`, and the Chinese card with `/products/new-series-pearl-y-lariat`, campaign `falling_pearl_cold_start`, hook `One line. One falling pearl.`, 88-92 BPM ambient R&B instrumental CML direction, four Chinese Seedance prompts, three captions, direct pinned comment, and 24-hour diagnostics.

- [ ] **Step 4: Verify and commit Product 016**

Parse the JSON, assert four dynamic frames and four existing image paths, inspect all links, then commit only the Product 016 folder and card with:

```powershell
git commit -m "assets: add Falling Pearl TikTok shot package"
```

### Task 5: Cross-Batch Verification And 5174 Preview

**Files:**
- Verify: all four shot-template folders and all four Obsidian cards created in Tasks 1-4.

**Interfaces:**
- Consumes: Four independently verified shot packages.
- Produces: One batch-level verification result and four usable preview cards on port 5174.

- [ ] **Step 1: Verify JSON contracts and links**

Run a PowerShell loop over the four `template.json` files. Assert:

- `schema_version` equals `1.0`.
- `format` equals `9:16`.
- `frames.Count` equals `4`.
- Every frame has `animate: true`, `target_duration_seconds: 4`, a nonempty `seedance_prompt_zh`, and an existing image file.
- `recommended_base_cost_credits` equals `176` for each product.
- Each `landing_path` uses the exact product slug.
- Every Obsidian `file:///` image link resolves locally.

Expected: summary reports `templates=4`, `frames=16`, `dynamic=16`, `missing=0`, `prompt_missing=0`, and `cost=704`.

- [ ] **Step 2: Verify image dimensions and decoding**

Use `System.Drawing.Image::FromFile()` on all 16 PNG files. Assert every image decodes, portrait height exceeds width, and `abs((width / height) - (9 / 16)) < 0.03`.

Expected: `decoded=16`, `portrait=16`, `ratio_ok=16`.

- [ ] **Step 3: Verify 5174 service**

Run:

```powershell
$listener = Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue
if (-not $listener) {
  Start-Process -FilePath 'D:\Softwares\node.exe' -ArgumentList @('node_modules/next/dist/bin/next','start','-p','5174') -WorkingDirectory 'D:\react-flow' -WindowStyle Hidden
}
(Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:5174/' -TimeoutSec 10).StatusCode
```

Expected: `200`.

- [ ] **Step 4: Inspect the four cards in the browser**

Open `http://127.0.0.1:5174/?category=shotTemplate`, select each new shot ID, and confirm the thumbnail, all four first-frame links, Chinese Seedance prompts, TikTok captions, BGM plan, and UTM values render without overlap or broken media.

- [ ] **Step 5: Final worktree audit**

Run:

```powershell
git status --short
git log -6 --oneline
```

Confirm the four product commits contain only their own shot folder and Obsidian card. Do not stage or revert unrelated user changes.

## Self-Review Result

- Spec coverage: all four product shot grids, all 16 frames, prompts, TikTok packages, cost accounting, Obsidian storage, and 5174 verification are assigned to explicit tasks.
- Completeness scan: every output path and required value is explicit.
- Contract consistency: shot IDs, filenames, product slugs, campaign IDs, costs, and card paths match between tasks and the approved design.
