# Seedance 2.0 TikTok Video Production Desk Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 14-day, founder-operated TikTok production system that turns three daily 4-second Seedance 2.0 generations into one 7–8 second publishable candidate and one alternate hook while preserving product identity and avoiding static “PPT-like” motion.

**Architecture:** Keep the existing v2 knowledge and six product recipe cards intact, then add a shared v3 motion grammar, append-only v3 production sections to each product card, and one operational execution card. The founder remains the only operator of Xiaoyunque, CapCut/Jianying, AdsPower, and TikTok; the repository stores prompts, edit decisions, QA, and evidence only.

**Tech Stack:** Markdown, Obsidian Wiki links, Seedance 2.0 Fast I2V on Xiaoyunque, CapCut/Jianying manual editing, PowerShell and ripgrep for static validation, Git for scoped history.

## Global Constraints

- SEO/GEO remains the company’s only P0; this desk is a support line under Content & Brand.
- Do not create a permanent department during the 14-day pilot.
- Do not overwrite or delete v2 prompts, existing take records, first frames, or source assets.
- Do not operate Xiaoyunque, CapCut/Jianying, AdsPower, TikTok, payment, advertising, purchasing, supplier outreach, deployment, or product status.
- Use three 4-second generation slots per day as: main hook, response shot, alternate hook.
- Do not treat generated clips as final or published until the founder manually confirms the edit and platform record.
- Do not use unverified material, price, stock, shipping, hypoallergenic, durability, healing, luck, or spiritual-effect claims.
- Keep Maverenne customer-visible copy out of the production pack while `name_clearance_passed` remains false; use brand-neutral copy.
- Blender and AE stay outside the default pipeline; allow a paired control test only after three failures of the same important motion.
- Audit exact first-frame, character, scene, and product inputs before writing a runnable prompt; use the built-in image generation tool to fill safe gaps and never invent a product without a reliable structure source.
- Save every selected generated project image under the relevant workspace shot-template directory with a versioned filename and a recorded generation trace; never leave a referenced final only in the built-in tool’s default directory.
- Preserve unrelated dirty-worktree changes and stage only files named by each task.

---

## File Structure

- Create `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Seedance 动态叙事动作库 v3.md`: shared motion grammar, prompt contract, five reusable movement families, QA, and Blender/AE escalation rule.
- Create `video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜输入资产完整性审计.md`: shot-by-shot evidence for first frames, character references, scene references, product references, generated-asset traces, and blockers.
- Create as needed: `video-pipeline/asset-library/09-shot-templates/<SHOT_ID>/reference-pack/*.png`: selected generated character views, scene masters, product-support views, and exact v3 first frames; filenames are versioned and never overwrite approved originals.
- Modify `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Baroque Orbit 真实地中海冷启动 9x16.md`: append Baroque main hook, response, and alternate hook using v3.
- Modify `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Falling Pearl 屋顶黄昏冷启动 9x16.md`: append lariat-specific v3 sequence.
- Modify `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Luxury Product Reveal 9x16.md`: append a blocked previsualization-only v3 sequence without claiming a production-ready product asset.
- Modify `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Moon Disc 海光变彩冷启动 9x16.md`: append light-transition and foreground-reveal v3 sequence.
- Modify `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Turquoise Leaf 泳池庭院冷启动 9x16.md`: append motivated wrist and pool-light v3 sequence.
- Modify `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Violet Rain 紫暮庭院冷启动 9x16.md`: append wet-courtyard movement v3 sequence.
- Create `video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜14天每日3×4秒执行卡.md`: daily queue, first-day pack, Jianying timeline, file-return contract, QA, metrics, and pilot-end decision.

---

### Task 0: Audit and Complete the Input Reference Packs

**Files:**
- Create: `video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜输入资产完整性审计.md`
- Create as needed: `video-pipeline/asset-library/09-shot-templates/SHOT_BAROQUE_ORBIT_COLD_START_001/reference-pack/*.png`
- Create as needed: `video-pipeline/asset-library/09-shot-templates/SHOT_FALLING_PEARL_COLD_START_001/reference-pack/*.png`
- Create as needed: `video-pipeline/asset-library/09-shot-templates/SHOT_MOON_DISC_COLD_START_001/reference-pack/*.png`
- Create as needed: `video-pipeline/asset-library/09-shot-templates/SHOT_TURQUOISE_LEAF_COLD_START_001/reference-pack/*.png`
- Create as needed: `video-pipeline/asset-library/09-shot-templates/SHOT_VIOLET_RAIN_COLD_START_001/reference-pack/*.png`
- Do not create production assets for `SHOT_LUXURY_PRODUCT_REVEAL_9X16_001` while its product source remains blocked.

**Interfaces:**
- Consumes: existing approved first frames, product images, scene cards, character cards, and the built-in `image_gen` tool.
- Produces: one audit row per planned main hook, response shot, and alternate hook; each row ends as `ready`, `generated_pending_review`, or `blocked` and provides exact file paths consumed by Tasks 2–5.

- [ ] **Step 1: Inventory each shot’s four input classes**

For Baroque Orbit, Falling Pearl, Moon Disc, Turquoise Leaf, Violet Rain, and Luxury Product Reveal, create three rows named `main_hook`, `response`, and `alternate_hook`. Record these columns:

```text
shot_id | slot | exact_first_frame | character_identity | character_views | scene_reference | product_structure | product_detail | status | missing_items | generated_trace | reviewer | reviewed_at
```

Use only existing local paths that can be opened. A Wiki link, stale manifest value, or filename without a present file does not count as ready evidence.

- [ ] **Step 2: Apply the minimum-reference decision rules**

Mark a row `ready` only when:

```text
Every slot has one exact 9:16 first frame matching the intended start state.
A close or identity-sensitive human shot has one clear identity source.
A turn, walk, or side/back reveal has front plus three-quarter plus side/back support, whether separate images or a reviewed turnaround sheet.
Every shot has a scene master that shows spatial path and light direction.
Every product shot has one reliable full-structure source; close detail or major angle change also has a relevant detail/angle source.
```

If no reliable product structure source exists, mark the row `blocked` and do not generate a substitute product.

- [ ] **Step 3: Generate only the missing safe inputs with built-in image generation**

For every non-product-identity gap, call the built-in `image_gen` tool once per distinct asset. For an edit or identity-preserving derivative from a local file, load every target/reference first with `view_image`, label each image role in the prompt, then generate non-destructively.

Use this prompt scaffold for character views:

```text
Use case: identity-preserve
Asset type: Seedance 2.0 character reference for a 9:16 jewelry video
Input images: Image 1 is the approved character identity and wardrobe reference; any additional images are supporting product and scene references only.
Primary request: create the missing front, three-quarter, or side/back reference while preserving the same fictional adult identity, face proportions, hairstyle, wardrobe, visible jewelry placement, natural skin texture, and lighting family.
Composition/framing: neutral readable pose, full required anatomy visible, portrait orientation, no final advertising text.
Constraints: do not change identity, age, wardrobe, jewelry count, jewelry geometry, or body proportions; no real-person claim, no logo, no watermark.
```

Use this scaffold for a scene master:

```text
Use case: photorealistic-natural
Asset type: Seedance 2.0 scene and movement-path reference
Input images: Image 1 is the approved scene/style reference; character and product references do not define architecture.
Primary request: create a 9:16 master view that clearly shows foreground, subject path, endpoint, depth layers, and a single consistent light direction for the planned shot.
Constraints: preserve the approved location family; no people, product, text, logo, watermark, impossible stairs, or broken perspective.
```

Use this scaffold for an exact v3 first frame:

```text
Use case: ads-marketing
Asset type: exact first frame for a 4-second Seedance 2.0 I2V shot
Input images: Image 1 is the approved fictional adult identity; Image 2 is the product-structure lock; Image 3 is the scene and light-direction lock.
Primary request: depict the planned action already in progress at frame zero, with visible imbalance and a clear direction of travel; do not present a finished static beauty pose.
Composition/framing: 9:16, mobile-safe crop, foreground and endpoint path readable, product visible at the required scale.
Constraints: preserve identity, product count and key geometry, wardrobe, spatial perspective, and light direction; no text, logo, watermark, extra jewelry, extra people, or floating product.
```

Product-support views may be generated only from an existing reliable product image and must use `precise-object-edit` or `product-mockup` with the input explicitly labeled as the structure lock. If structure changes, reject the output rather than revising the product facts around it.

- [ ] **Step 4: Save selected outputs into the workspace**

Copy each selected built-in output from its generated-images location into the relevant `reference-pack` directory. Use only these filename families:

```text
REF_CHARACTER_FRONT-v1.png
REF_CHARACTER_THREE_QUARTER-v1.png
REF_CHARACTER_SIDE_BACK-v1.png
REF_SCENE_MASTER-v1.png
REF_PRODUCT_SUPPORT-v1.png
FF_V3_MAIN_HOOK-v1.png
FF_V3_RESPONSE-v1.png
FF_V3_ALT_HOOK-v1.png
```

If a name already exists, increment `v2`, `v3`, and so on. Do not overwrite existing approved first frames.

- [ ] **Step 5: Record generation trace and visually validate**

For every generated file, write the final prompt, all input image roles and paths, output path, generation date, tool=`built-in image_gen`, corresponding shot/slot, and result status into the audit card. Inspect the selected file with `view_image` and check identity, anatomy, product count and geometry, wearing position, perspective, light direction, 9:16 crop, text/logo/watermark absence, and endpoint space.

Change the audit row to `ready` only after human-visible review. A generated product derivative remains `generated_pending_review` if structure cannot be confidently matched.

- [ ] **Step 6: Validate the audit and files**

Run:

```powershell
$p = 'video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜输入资产完整性审计.md'
$text = Get-Content -LiteralPath $p -Raw -Encoding utf8
foreach ($shot in @('SHOT_BAROQUE_ORBIT_COLD_START_001','SHOT_FALLING_PEARL_COLD_START_001','SHOT_LUXURY_PRODUCT_REVEAL_9X16_001','SHOT_MOON_DISC_COLD_START_001','SHOT_TURQUOISE_LEAF_COLD_START_001','SHOT_VIOLET_RAIN_COLD_START_001')) {
  if ($text -notmatch [regex]::Escape($shot)) { throw "missing audit shot: $shot" }
}
foreach ($slot in @('main_hook','response','alternate_hook')) {
  if (($text | Select-String -Pattern ([regex]::Escape($slot)) -AllMatches).Matches.Count -lt 6) { throw "incomplete slot audit: $slot" }
}
$paths = [regex]::Matches($text, 'D:\\mythrealms-shop\\video-pipeline\\asset-library\\09-shot-templates\\[^`|\r\n]+\.png') | ForEach-Object Value | Sort-Object -Unique
foreach ($path in $paths) { if (-not (Test-Path -LiteralPath $path)) { throw "missing referenced input: $path" } }
git diff --check -- $p
```

Expected: PASS; Luxury Product Reveal may remain explicitly `blocked`, but no `ready` row may reference a missing file.

- [ ] **Step 7: Commit the audited reference packs**

Stage only the audit card and selected new `reference-pack` PNGs. Review the staged file list before committing:

```powershell
git diff --cached --name-only
git diff --cached --check
git commit -m "assets: complete Seedance v3 input reference packs"
```

### Task 1: Create the Shared Seedance v3 Motion Grammar

**Files:**
- Create: `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Seedance 动态叙事动作库 v3.md`
- Reference only: `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Seedance 动态叙事动作库 v2.md`
- Reference only: `docs/superpowers/specs/2026-07-26-seedance-tiktok-production-desk-design.md`

**Interfaces:**
- Consumes: the approved six-part prompt contract and the daily C allocation from the design spec.
- Produces: Obsidian anchors `#E1｜前景擦镜进入侧脸`, `#E2｜越过光界完成转身`, `#N1｜跨过门洞链坠追随`, `#W1｜完成动作后露出手腕`, `#P1｜环境运动证明产品`, and `#D1｜运动落点形成新构图` for the six product cards.

- [ ] **Step 1: Create a validation command that must initially fail**

Run:

```powershell
$p = 'video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Seedance 动态叙事动作库 v3.md'
if (-not (Test-Path -LiteralPath $p)) { throw 'v3 motion library missing' }
```

Expected: FAIL with `v3 motion library missing`.

- [ ] **Step 2: Write the v3 frontmatter and operating contract**

Create the file with frontmatter values:

```yaml
id: SEEDANCE_DYNAMIC_NARRATIVE_LIBRARY_V3
asset_type: prompt_library
status: active
version: v3
format: 9:16
surface: Xiaoyunque Seedance 2.0 Fast I2V
clip_duration_seconds: 4
daily_slots: 3
allocation: main_hook_response_alternate_hook
```

Add sections in this exact order:

```markdown
## v3 与 v2 的关系
## 每日方案 C
## 六段提示词契约
## 首帧选择规则
## E. 耳饰动作
### E1｜前景擦镜进入侧脸
### E2｜越过光界完成转身
## N. 项链动作
### N1｜跨过门洞链坠追随
## W. 手腕动作
### W1｜完成动作后露出手腕
## P. 产品证明
### P1｜环境运动证明产品
## D. 情绪落点
### D1｜运动落点形成新构图
## Blender / AE 升级门槛
## 生成后 QA
```

For each movement anchor, include: intended product type, start state at frame zero, one motivated event, camera scale/direction/subject relationship/end frame, physical secondary motion, a three-to-five-feature product lock, and a clean edit point. The event must already be in progress at frame zero and must produce a composition different from the first frame.

- [ ] **Step 3: Add the reusable prompt language**

Use these movement definitions without the old default phrases `机位基本锁定`, `2%`, `眨眼一次`, `轻摆一次后停稳`, or `全部停稳`:

```text
E1: a real foreground edge crosses the lens as the subject steps from a hidden three-quarter angle into a readable side profile; the camera clears the obstruction with the subject and lands on the near earring.
E2: the subject is already crossing a boundary between shade and side light; her torso and gaze finish one turn while hair, fabric, and the earring follow with delayed inertia.
N1: the subject is already stepping through a doorway; the torso crosses first, fabric follows, and the pendant settles last while the camera travels diagonally to keep the full vertical line readable.
W1: the hand is completing a real task such as releasing a railing or pushing a sleeve back after a step; the wrist becomes visible as the camera follows the hand path, not through an isolated wrist spin.
P1: the product stays physically supported while moving leaf shadow, water reflection, passing fabric shadow, or foreground parallax gives the frame change; the camera makes one decisive diagonal or low lateral move and ends on the identity feature.
D1: the subject completes movement into an off-center end position; the camera and subject stop because the action resolves, leaving one clean region for optional post-production text.
```

Add a compact negative block limited to identity failure, geometry duplication, extra jewelry, face replacement, floating product, text, logo, and watermark. Do not repeat environment-description paragraphs already visible in the first frame.

- [ ] **Step 4: Add the Blender/AE escalation gate and QA checklist**

Record all five approved escalation conditions verbatim from the design spec. Add checkboxes for motion in the first 0.5 seconds, causal action, new endpoint, shared physical space, product structure, clean cut point, and prohibited claim scan.

- [ ] **Step 5: Run static validation**

Run:

```powershell
$p = 'video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Seedance 动态叙事动作库 v3.md'
$text = Get-Content -LiteralPath $p -Raw -Encoding utf8
$required = @('E1｜前景擦镜进入侧脸','E2｜越过光界完成转身','N1｜跨过门洞链坠追随','W1｜完成动作后露出手腕','P1｜环境运动证明产品','D1｜运动落点形成新构图','Blender / AE 升级门槛','生成后 QA')
$missing = $required | Where-Object { $text -notmatch [regex]::Escape($_) }
if ($missing) { throw "missing sections: $($missing -join ', ')" }
$forbidden = @('机位基本锁定','只允许不超过2%','眨眼一次','全部停稳')
$hits = $forbidden | Where-Object { $text -match [regex]::Escape($_) }
if ($hits) { throw "old static defaults found: $($hits -join ', ')" }
```

Expected: PASS with no output.

- [ ] **Step 6: Commit the shared library**

```powershell
git add -- 'video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Seedance 动态叙事动作库 v3.md'
git diff --cached --check
git commit -m "docs: add Seedance dynamic motion library v3"
```

### Task 2: Add v3 Sequences to Baroque Orbit and Falling Pearl

**Files:**
- Modify: `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Baroque Orbit 真实地中海冷启动 9x16.md`
- Modify: `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Falling Pearl 屋顶黄昏冷启动 9x16.md`

**Interfaces:**
- Consumes: the six anchors produced by Task 1 and existing approved first-frame paths in each card.
- Produces: one `## v3｜每日方案 C` section in each card with `主钩子`, `回应镜头`, and `备用钩子` prompts.

- [ ] **Step 1: Capture the existing file hashes and confirm append-only scope**

Run:

```powershell
$files = @(
  'video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Baroque Orbit 真实地中海冷启动 9x16.md',
  'video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Falling Pearl 屋顶黄昏冷启动 9x16.md'
)
$files | ForEach-Object { Get-FileHash -Algorithm SHA256 -LiteralPath $_ }
```

Save the two pre-edit hashes in the task notes; do not revert any existing user edits.

- [ ] **Step 2: Append the Baroque Orbit v3 sequence**

Use the existing Frame 05 or Frame 01 path for the main hook, Frame 02 for the response, and the unused approved human frame for the alternate. The three prompts must implement:

```text
Main hook: E1 foreground wipe; the subject is already passing the limestone arch edge, the camera clears it beside her, and the near earring becomes readable during a committed quarter turn.
Response: P1 product proof; both earrings remain supported on limestone while olive shadow and foreground parallax move in the same screen direction as the hook, ending on the irregular white drop and green accent.
Alternate: E2 light-boundary turn; change only the opening mechanism from foreground wipe to shade-to-light crossing while preserving product, scene, duration, and endpoint purpose.
```

Use only observable copy such as `irregular white drops` and `green accents`; do not add material, price, stock, or shipping claims. Add a Wiki link to the exact Task 1 anchor for each prompt.

- [ ] **Step 3: Append the Falling Pearl v3 sequence**

Use Frame 01 for the main hook, Frame 02 for the response, and Frame 04 for the alternate. The three prompts must implement:

```text
Main hook: N1 doorway crossing; torso and ivory fabric cross first, the full vertical jewelry line follows, and the lowest drop settles last as the camera travels diagonally with the subject.
Response: P1 product proof; the product remains fully supported while a real fabric shadow crosses the surface and the camera descends along the vertical silhouette to the terminal drop.
Alternate: D1 rooftop endpoint; the subject is already moving along the roof edge and arrives at an off-center profile, changing only the hook mechanism while keeping the same visual direction and no hand-to-jewelry contact.
```

Do not repeat the existing unverified `$59.99` value in the new v3 section. Refer to the item only by existing internal product ID and observable vertical silhouette.

- [ ] **Step 4: Validate both append-only sections**

Run:

```powershell
$files = @(
  'video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Baroque Orbit 真实地中海冷启动 9x16.md',
  'video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Falling Pearl 屋顶黄昏冷启动 9x16.md'
)
foreach ($file in $files) {
  $text = Get-Content -LiteralPath $file -Raw -Encoding utf8
  foreach ($section in @('## v3｜每日方案 C','### 主钩子','### 回应镜头','### 备用钩子')) {
    if ($text -notmatch [regex]::Escape($section)) { throw "$file missing $section" }
  }
}
git diff --check -- $files
```

Expected: PASS with no missing-section or whitespace errors.

- [ ] **Step 5: Commit the two product cards**

```powershell
git add -- 'video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Baroque Orbit 真实地中海冷启动 9x16.md' 'video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Falling Pearl 屋顶黄昏冷启动 9x16.md'
git diff --cached --check
git commit -m "docs: add dynamic v3 sequences for first jewelry set"
```

### Task 3: Add v3 Sequences to Moon Disc, Turquoise Leaf, and Violet Rain

**Files:**
- Modify: `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Moon Disc 海光变彩冷启动 9x16.md`
- Modify: `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Turquoise Leaf 泳池庭院冷启动 9x16.md`
- Modify: `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Violet Rain 紫暮庭院冷启动 9x16.md`

**Interfaces:**
- Consumes: Task 1 anchors and the cards’ existing approved first-frame paths.
- Produces: three complete daily-C prompt triplets with product-specific physical motion.

- [ ] **Step 1: Append the Moon Disc v3 sequence**

Use Frame 01 for main, Frame 02 for response, and Frame 03 or 04 for alternate:

```text
Main hook: E2; the subject is already crossing from terrace shade into side light, torso and gaze finish the turn, and the near round drop changes visible color because its angle changes.
Response: P1; the pair stays on limestone while water reflection and low lateral parallax cross the frame, ending with both round silhouettes readable.
Alternate: E1; a real curtain, arch edge, or foreground shoulder clears the lens and reveals the side profile, changing only the opening mechanism.
```

Do not state shell, pearl, metal, price, or stock as verified product facts in the new v3 prompts or copy.

- [ ] **Step 2: Append the Turquoise Leaf v3 sequence**

Use Frame 01 for main, Frame 02 for response, and Frame 04 for alternate:

```text
Main hook: W1; the subject is already taking one step beside the pool and releases a stone railing as her sleeve slides back, revealing the wrist without rotating it for display.
Response: P1; the bracelet stays supported on limestone while pool caustics and a low diagonal camera move reveal its open silhouette and contrasting center and side details.
Alternate: D1/W1 hybrid; the hand finishes sliding along the wall and leaves it as the subject arrives off-center, changing only the hand task while preserving direction and endpoint.
```

Use `open gold-tone silhouette`, `white center detail`, and `blue-green side details` only as observable visual descriptions; do not assert turquoise, pearl, or shell materials.

- [ ] **Step 3: Append the Violet Rain v3 sequence**

Use Frame 01 for main, Frame 02 for response, and Frame 04 for alternate:

```text
Main hook: E1/E2; the subject is already taking a quick step past the wet roof edge into the courtyard, a foreground rain line clears the lens, and her turn resolves in side light.
Response: P1; the pair stays supported on wet limestone while reflected light and one foreground water ripple travel across the frame, ending with both silhouettes unchanged.
Alternate: D1; the subject is already crossing the arch opening and finishes in the right third, leaving a clean left field and changing only the opening action.
```

Keep rain on architecture and ground; do not add water interaction that changes the jewelry geometry or implies durability.

- [ ] **Step 4: Validate the three cards and prohibited new claims**

Run:

```powershell
$files = @(
  'video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Moon Disc 海光变彩冷启动 9x16.md',
  'video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Turquoise Leaf 泳池庭院冷启动 9x16.md',
  'video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Violet Rain 紫暮庭院冷启动 9x16.md'
)
foreach ($file in $files) {
  $v3 = (Get-Content -LiteralPath $file -Raw -Encoding utf8) -split '## v3｜每日方案 C', 2 | Select-Object -Last 1
  foreach ($section in @('### 主钩子','### 回应镜头','### 备用钩子')) {
    if ($v3 -notmatch [regex]::Escape($section)) { throw "$file missing $section" }
  }
  if ($v3 -match '\$\d|低敏|防过敏|不褪色|天然珍珠|925') { throw "$file contains prohibited v3 claim" }
}
git diff --check -- $files
```

Expected: PASS with no output.

- [ ] **Step 5: Commit the three product cards**

```powershell
git add -- 'video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Moon Disc 海光变彩冷启动 9x16.md' 'video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Turquoise Leaf 泳池庭院冷启动 9x16.md' 'video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Violet Rain 紫暮庭院冷启动 9x16.md'
git diff --cached --check
git commit -m "docs: add dynamic v3 sequences for coastal jewelry set"
```

### Task 4: Add the Blocked Luxury Product Reveal v3 Previsualization

**Files:**
- Modify: `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Luxury Product Reveal 9x16.md`

**Interfaces:**
- Consumes: Task 1 `P1` and `D1` motion grammar.
- Produces: a clearly blocked three-slot previsualization that cannot be mistaken for an approved product campaign.

- [ ] **Step 1: Append a v3 blocked-status section**

Add `## v3｜预演专用，禁止生产` and repeat the existing `blocked_by_product_asset` state. Define:

```text
Main hook preview: a foreground architectural edge or shadow clears a pedestal while the camera makes one diagonal reveal; no final product identity is generated.
Response preview: supported placeholder volume remains fixed while one environment reflection and camera parallax demonstrate the intended edit direction.
Alternate preview: a human silhouette completes a real task near the display and arrives off-center; hands do not touch or fabricate an unknown product.
```

State explicitly that these slots are motion rehearsals only and cannot consume the daily three Xiaoyunque credits until a product asset is approved.

- [ ] **Step 2: Validate the blocked state remains explicit**

Run:

```powershell
$p = 'video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Luxury Product Reveal 9x16.md'
$text = Get-Content -LiteralPath $p -Raw -Encoding utf8
foreach ($term in @('status: blocked_by_product_asset','## v3｜预演专用，禁止生产','不得占用每日三个小云雀生成名额')) {
  if ($text -notmatch [regex]::Escape($term)) { throw "missing blocked control: $term" }
}
git diff --check -- $p
```

Expected: PASS with no output.

- [ ] **Step 3: Commit the blocked previsualization card**

```powershell
git add -- 'video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Luxury Product Reveal 9x16.md'
git diff --cached --check
git commit -m "docs: define blocked luxury reveal v3 rehearsal"
```

### Task 5: Create the 14-Day Desk Card and Day 1 Pack

**Files:**
- Create: `video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜14天每日3×4秒执行卡.md`
- Reference only: the six product cards and v3 library created or modified in Tasks 1–4.

**Interfaces:**
- Consumes: product-specific `主钩子`, `回应镜头`, and `备用钩子` triplets plus Task 0 audit rows whose three Baroque slots are all `ready`.
- Produces: a founder-readable daily queue, filename convention, return contract, edit timeline, and review record.

- [ ] **Step 1: Create the card with fixed operating sections**

Add frontmatter:

```yaml
type: production_desk
status: pilot
pilot_days: 14
daily_seedance_clips: 3
clip_seconds: 4
execution_owner: founder
support_owner: content_brand
external_actions: founder_only
```

Add sections:

```markdown
## 每天只做这七步
## 文件命名
## 14 天队列
## Day 1｜Baroque Orbit 校准包
## 剪映 7–8 秒模板
## 生成结果回传格式
## 发布记录
## 2 小时 / 24 小时复盘
## Blender / AE 例外申请
## 试点结束判断
```

- [ ] **Step 2: Define the 14-day queue**

Use this exact queue:

| Day | Main subject | Test variable |
| --- | --- | --- |
| 1 | Baroque Orbit | foreground wipe versus light-boundary hook |
| 2 | Moon Disc | angle-driven light change versus foreground reveal |
| 3 | Turquoise Leaf | railing release versus wall-release task |
| 4 | Violet Rain | wet-foreground reveal versus arch crossing |
| 5 | Falling Pearl | doorway crossing versus rooftop endpoint |
| 6 | Best usable Day 1–5 subject | increase or decrease subject action amplitude only |
| 7 | Best usable Day 1–5 subject | change camera relationship only |
| 8 | Baroque Orbit second pass | use the better hook and a new response endpoint |
| 9 | Moon Disc second pass | use the better hook and a new response endpoint |
| 10 | Turquoise Leaf second pass | use the better hook and a new response endpoint |
| 11 | Violet Rain second pass | use the better hook and a new response endpoint |
| 12 | Falling Pearl second pass | use the better hook and a new response endpoint |
| 13 | Best retention candidate | two alternate hooks with the same response |
| 14 | Pilot synthesis | one final candidate plus two reusable motion-bank clips |

Luxury Product Reveal remains outside the queue while blocked.

- [ ] **Step 3: Add the Day 1 founder handoff**

Before writing the handoff, read the Task 0 audit and stop if any Baroque slot is not `ready`. Copy the complete Baroque Orbit v3 main, response, and alternate prompts into the Day 1 section. Include every exact `@Image` role and workspace path from the audit plus these expected output filenames:

```text
D01_BAROQUE_MAIN_HOOK_T01.mp4
D01_BAROQUE_RESPONSE_T01.mp4
D01_BAROQUE_ALT_HOOK_T01.mp4
```

Add the brand-neutral on-screen copy:

```text
Line 1: Not made to stand still.
Line 2: Which detail caught you first?
```

Add a brand-neutral caption that makes no material or fulfillment claim:

```text
Movement changes what you notice first. Which detail caught your eye?
```

Do not include a public product URL, price, material, stock, shipping, Maverenne, or MythRealms claim in this internal Day 1 pack. The founder decides the final platform caption and link at publish time.

- [ ] **Step 4: Add the beginner Jianying timeline and return contract**

Use this exact timeline:

```text
0.00–0.20: begin inside the strongest motion; no fade.
0.20–3.15: main hook; trim before the motion visibly dies.
3.15: hard cut on matching direction, foreground clearance, or light change.
3.15–6.90: response shot; preserve the clean product endpoint.
6.90–7.80: optional final copy; no template transition.
Audio: one continuous commercial-use track; at most one subtle cut accent.
```

Require the founder to return: three raw MP4 paths, selected in/out points, exported candidate path, rejected-take reason, and any visible platform metrics. Unknown fields must be `待确认`, not zero.

- [ ] **Step 5: Validate the execution card**

Run:

```powershell
$p = 'video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜14天每日3×4秒执行卡.md'
$text = Get-Content -LiteralPath $p -Raw -Encoding utf8
$required = @('daily_seedance_clips: 3','## 14 天队列','## Day 1｜Baroque Orbit 校准包','D01_BAROQUE_MAIN_HOOK_T01.mp4','D01_BAROQUE_RESPONSE_T01.mp4','D01_BAROQUE_ALT_HOOK_T01.mp4','0.00–0.20','待确认','Blender / AE 例外申请')
$missing = $required | Where-Object { $text -notmatch [regex]::Escape($_) }
if ($missing) { throw "execution card missing: $($missing -join ', ')" }
if ($text -match '\$\d|925|低敏|防过敏|不褪色|Maverenne') { throw 'execution card contains prohibited or uncleared copy' }
git diff --check -- $p
```

Expected: PASS with no output.

- [ ] **Step 6: Commit the execution card**

```powershell
git add -- 'video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜14天每日3×4秒执行卡.md'
git diff --cached --check
git commit -m "docs: add 14-day TikTok production desk card"
```

### Task 6: Run Cross-File Review and Final Handoff

**Files:**
- Verify all files created or modified in Tasks 1–5.
- Do not modify `docs/company/weekly-priorities.md`, `docs/company/content-calendar.md`, product data, or external platform records in this implementation.

**Interfaces:**
- Consumes: all v3 prompts and the execution card.
- Produces: a verified internal handoff to the founder with no external action.

- [ ] **Step 1: Verify Wiki links and version preservation**

Run:

```powershell
$root = 'video-pipeline/asset-library/obsidian-vault/02-镜头配方'
$v2 = Join-Path $root '镜头配方｜Seedance 动态叙事动作库 v2.md'
$v3 = Join-Path $root '镜头配方｜Seedance 动态叙事动作库 v3.md'
if (-not (Test-Path -LiteralPath $v2)) { throw 'v2 library was lost' }
if (-not (Test-Path -LiteralPath $v3)) { throw 'v3 library missing' }
$cards = Get-ChildItem -LiteralPath $root -File | Where-Object { $_.Name -match 'Baroque Orbit|Falling Pearl|Luxury Product Reveal|Moon Disc|Turquoise Leaf|Violet Rain' }
if ($cards.Count -ne 6) { throw "expected 6 product cards, found $($cards.Count)" }
$audit = 'video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜输入资产完整性审计.md'
if (-not (Test-Path -LiteralPath $audit)) { throw 'input asset audit missing' }
```

Expected: PASS with no output.

- [ ] **Step 2: Scan only new v3 sections for unsafe claims and static defaults**

Run:

```powershell
$files = Get-ChildItem -LiteralPath 'video-pipeline/asset-library/obsidian-vault/02-镜头配方' -File | Where-Object { $_.Name -match 'Baroque Orbit|Falling Pearl|Luxury Product Reveal|Moon Disc|Turquoise Leaf|Violet Rain|Seedance 动态叙事动作库 v3' }
foreach ($file in $files) {
  $text = Get-Content -LiteralPath $file.FullName -Raw -Encoding utf8
  $new = if ($text -match '## v3') { ($text -split '## v3', 2)[1] } else { $text }
  if ($new -match '\$\d|低敏|防过敏|不褪色|疗愈|招财|转运|name_clearance_passed: true') { throw "unsafe v3 copy in $($file.Name)" }
}
```

Expected: PASS with no output.

- [ ] **Step 3: Review Git scope**

Run:

```powershell
git status --short
git log --oneline -6
```

Confirm the implementation commits contain only the v3 library, six specified product cards, and one execution card. Unrelated dirty-worktree files remain unstaged and unmodified by this plan.

- [ ] **Step 4: Deliver the founder handoff**

Report:

```text
1) The exact Day 1 source images and three prompts.
2) The three expected output filenames.
3) The 7–8 second Jianying timeline.
4) The five-point raw-clip QA checklist.
5) The exact files the founder should return after Xiaoyunque generation.
6) Confirmation that no Xiaoyunque, Jianying, AdsPower, TikTok, payment, advertising, purchasing, deployment, or product-status action occurred.
```

- [ ] **Step 5: Do not create a final empty commit**

If Tasks 1–5 each produced their scoped commits and Task 6 required no correction, finish without another commit. If review finds a defect, fix only the affected file, rerun its validation, and commit with `fix: correct Seedance v3 production handoff`.

---

## Self-Review Results

- Spec coverage: input-asset audit and built-in image generation, organization, daily C allocation, v3 prompt contract, six product cards, beginner Jianying workflow, Blender/AE gate, QA, evidence boundary, and 14-day permanence decision are all assigned to Tasks 0–6.
- Placeholder scan: no unfinished markers, cross-task shorthand, or unspecified validation steps remain.
- Interface consistency: all product cards consume the six exact Task 1 anchor names; the execution card consumes the three exact slot names; validation commands use the same paths and headings defined in creation steps.
