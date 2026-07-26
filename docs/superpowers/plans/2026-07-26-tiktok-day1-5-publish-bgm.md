# TikTok Day 1–5 Publish and BGM Package Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Day 1–5 Seedance production cards into founder-ready TikTok publishing handoffs with captions, cover text, on-screen text, BGM search and beat guidance, CapCut mixing notes, QA, and post-publication evidence fields.

**Architecture:** Keep long-lived generation prompts in the existing shot recipe cards and place founder execution details in focused Day handoff files under `04-待办`. Day 1–4 receive a complete publish package; Day 5 remains a winner-selection template so the project does not invent a winning subject before footage and analytics exist. A final validation pass checks day mapping, prompt syntax, local reference files, BGM fields, prohibited claims, and exclusion of already-published Baroque Orbit and Gold Shell assets.

**Tech Stack:** Obsidian Markdown, PowerShell validation, Git.

## Global Constraints

- Day mapping is exactly: Day 1 Moon Disc, Day 2 Turquoise Leaf, Day 3 Violet Rain, Day 4 Falling Pearl, Day 5 best QA subject from Day 1–4.
- Every generation prompt starts with `9:16 竖屏，4 秒，首帧生视频（I2V）。`.
- Every image reference begins with `@D:\` and resolves to a local file.
- Public posting cadence defaults to three TikTok posts per week; a production Day is not a mandatory calendar day.
- Captions and on-screen text cannot claim unverified material, price, stock, shipping, durability, allergy suitability, healing, luck, or performance.
- BGM is chosen manually from the founder account's available TikTok library or a separately verified commercial source; no song title is a hard dependency.
- BGM defaults to 12%–18%; approved ambience may remain at 3%–6%; generated clip audio is otherwise muted.
- Baroque Orbit and Gold Shell Teardrops published assets cannot appear in Day 1–5 active packages.
- No agent logs into TikTok, CapCut, Xiaoyunque, AdsPower, or any external account; no publishing, ads, payment, procurement, deployment, or product-state action is authorized.

---

### Task 1: Complete Day 1 Moon Disc publishing handoff

**Files:**
- Modify: `video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜Day 1 Moon Disc QA与剪辑交接.md`

**Interfaces:**
- Consumes: accepted main hook, accepted response take, `D01_MOON_DISC_CANDIDATE_C01_REVIEW.mp4`, and the approved design specification.
- Produces: a complete founder publishing section reusable by the final Day 1 CapCut export.

- [ ] **Step 1: Add the fixed publication copy**

Add these exact fields without changing the generation verdicts:

```markdown
## TikTok 发布包

- 封面字：`Light Changes Everything`
- 屏幕字：`Which view caught you first?`
- Caption：`The same shape can feel completely different when the light moves. Which view caught you first?`
- 标签：`#PearlEarrings #JewelryStyling #CoastalStyle #EverydayJewelry`
- CTA 类型：评论互动；不附商品链接。
```

- [ ] **Step 2: Add the Moon Disc BGM card**

Add the exact search and mixing contract:

```markdown
## BGM 与卡点

- 曲库搜索词：`coastal minimal`；`warm pluck`；`soft editorial`。
- 建议节奏：92–100 BPM，4/4，前半拍点清晰但没有重低音 drop。
- 0.00 秒：从可辨识的轻拍或拨弦起点进入。
- 3.15 秒：主钩子切回应镜头，对齐一次 downbeat。
- 6.55–6.79 秒：保留尾音并做 0.20 秒淡出。
- BGM：15%；生成音频：关闭；若另有经审核海风环境音：4%。
- 当天候选曲：只记录创始人账号内最终可用曲目，不把文件中的搜索词视为授权证明。
```

- [ ] **Step 3: Add export and evidence fields**

Add filenames `D01_MOON_DISC_CANDIDATE_C01_MASTER.mp4` and `D01_MOON_DISC_CANDIDATE_C01_POST.mp4`, plus unchecked fields for final track, published URL, published time, plays, average watch time, completion rate, likes, comments, shares, profile visits, and site clicks. Unknown values must say `待确认`.

- [ ] **Step 4: Validate and commit Day 1**

Run:

```powershell
rg -n "Light Changes Everything|coastal minimal|92–100 BPM|BGM：15%|D01_MOON_DISC_CANDIDATE_C01_MASTER" -- "video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜Day 1 Moon Disc QA与剪辑交接.md"
git diff --check -- "video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜Day 1 Moon Disc QA与剪辑交接.md"
```

Expected: all five fields are found and `git diff --check` exits 0.

Commit:

```powershell
git add -- "video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜Day 1 Moon Disc QA与剪辑交接.md"
git commit -m "docs: add Moon Disc TikTok publishing package"
```

### Task 2: Complete Day 2 Turquoise Leaf publishing handoff

**Files:**
- Modify: `video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜Day 2 Turquoise Leaf 投喂包.md`

**Interfaces:**
- Consumes: the three copy-ready Day 2 prompts and their existing output filenames.
- Produces: founder publishing copy and BGM rules ready once the returned takes pass QA.

- [ ] **Step 1: Add the Day 2 publication copy**

```markdown
## TikTok 发布包

- 封面字：`A Small Release`
- 屏幕字：`Pool light or golden hour?`
- Caption：`One small movement changes the whole frame. Pool light or golden hour?`
- 标签：`#BraceletStyle #JewelryDetails #PoolsideStyle #EverydayJewelry`
- CTA 类型：评论互动；不附商品链接。
```

- [ ] **Step 2: Add the Turquoise Leaf BGM card**

Use search terms `organic house`, `poolside groove`, and `sunlit fashion`; 98–108 BPM; first clean beat at 0.00; the hook-to-response hard cut aligns to a downbeat selected after QA; BGM 14%–17%; generated audio muted; optional verified pool ambience 3%–5%; 0.20-second ending fade.

- [ ] **Step 3: Add conditional CapCut and evidence fields**

State that exact in/out points remain `待回传 QA`, name the two exports `D02_TURQUOISE_LEAF_CANDIDATE_C01_MASTER.mp4` and `D02_TURQUOISE_LEAF_CANDIDATE_C01_POST.mp4`, and add the same final-track and platform-data fields as Day 1.

- [ ] **Step 4: Validate and commit Day 2**

Run:

```powershell
$p="video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜Day 2 Turquoise Leaf 投喂包.md"
$t=Get-Content -Raw -Encoding UTF8 -LiteralPath $p
if ([regex]::Matches($t,'9:16 竖屏，4 秒，首帧生视频（I2V）。').Count -ne 3) { exit 1 }
rg -n "A Small Release|organic house|98–108 BPM|D02_TURQUOISE_LEAF_CANDIDATE_C01_MASTER" -- $p
git diff --check -- $p
```

Expected: three prompt headers, all publication fields found, and diff check exits 0.

Commit:

```powershell
git add -- $p
git commit -m "docs: add Turquoise Leaf TikTok publishing package"
```

### Task 3: Create Day 3 Violet Rain and correct Day 4 Falling Pearl

**Files:**
- Create: `video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜Day 3 Violet Rain 投喂包.md`
- Rename: `video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜Day 3 Falling Pearl 投喂包.md` to `video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜Day 4 Falling Pearl 投喂包.md`
- Read: `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Violet Rain 紫暮庭院冷启动 9x16.md`
- Read: `video-pipeline/asset-library/obsidian-vault/02-镜头配方/镜头配方｜Falling Pearl 屋顶黄昏冷启动 9x16.md`

**Interfaces:**
- Consumes: each source recipe's `v3｜每日方案 C` three-prompt section.
- Produces: correct Day 3 and Day 4 copy-ready handoffs with aligned output names and publish/BGM cards.

- [ ] **Step 1: Create the Violet Rain Day 3 handoff**

Copy the three v3 prompts verbatim from the Violet Rain recipe. Set output names to `D03_VIOLET_RAIN_MAIN_HOOK_T01.mp4`, `D03_VIOLET_RAIN_RESPONSE_T01.mp4`, `D03_VIOLET_RAIN_ALT_HOOK_T01.mp4`, and `D03_VIOLET_RAIN_CANDIDATE_C01.mp4`.

- [ ] **Step 2: Add Violet Rain publication and BGM fields**

Use:

```markdown
- 封面字：`After the Rain`
- 屏幕字：`Rainlight or twilight?`
- Caption：`The light changes after the rain. Rainlight or twilight?`
- 标签：`#PurpleJewelry #JewelryMood #RainyEvening #EverydayJewelry`
- 曲库搜索词：`rainy r&b instrumental`；`moody garden`；`soft pulse`。
- 建议节奏：78–90 BPM。
- BGM：14%；生成音频：关闭；若另有经审核雨声：5%。
```

The hard-cut beat remains `待回传 QA`; ending fade is 0.20 seconds.

- [ ] **Step 3: Rename and correct Falling Pearl to Day 4**

Use `git mv`, set frontmatter `day: 4`, change every `D03_FALLING_PEARL_` output prefix to `D04_FALLING_PEARL_`, and keep all three generation prompts unchanged.

- [ ] **Step 4: Add Falling Pearl publication and BGM fields**

Use:

```markdown
- 封面字：`Follow the Line`
- 屏幕字：`Would you wear it this way?`
- Caption：`One line, one step, one quiet shift. Would you wear it this way?`
- 标签：`#PearlNecklace #NecklaceStyling #RooftopLight #EverydayJewelry`
- 曲库搜索词：`dusk electronic`；`cinematic pulse`；`rooftop editorial`。
- 建议节奏：88–100 BPM。
- BGM：15%；生成音频：关闭；若另有经审核屋顶环境音：4%。
```

The hook-to-response hard cut aligns with the first rebound endpoint after footage QA; ending fade is 0.20 seconds.

- [ ] **Step 5: Validate references, mapping, and commit**

Run a PowerShell reference scan over both handoffs. Extract every `@D:\...png|jpg|jpeg` path and require `Test-Path` true. Require exactly three prompt headers per file, `day: 3` only in Violet Rain, `day: 4` only in Falling Pearl, no `D03_FALLING_PEARL_`, and no Baroque/Gold Shell path.

Commit:

```powershell
git add -- "video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜Day 3 Violet Rain 投喂包.md" "video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜Day 4 Falling Pearl 投喂包.md"
git commit -m "docs: prepare Violet Rain and Falling Pearl publish packages"
```

### Task 4: Add the Day 5 winner template and queue links

**Files:**
- Create: `video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜Day 5 胜出主体复用模板.md`
- Modify: `video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜14天每日3×4秒执行卡.md`

**Interfaces:**
- Consumes: completed QA results from Day 1–4.
- Produces: a no-guessing selection contract and direct links from the 14-day desk to Day 1–5 handoffs.

- [ ] **Step 1: Create the Day 5 selection gate**

Require these fields before the subject can be selected: subject, accepted hook, accepted response, visible defect count, cuttable duration, founder effort, and platform metrics if available. Selection order is footage stability first, then opening motion clarity, then product readability, then platform data. If Day 2–4 footage is absent, status remains `waiting_footage`.

- [ ] **Step 2: Define Day 5's single-variable contract**

State that Day 5 changes only character-motion amplitude. It inherits the winning subject, response take, caption structure, BGM search terms, BPM range, and cut logic. Provide empty evidence fields labeled `待确认`, not a preselected product.

- [ ] **Step 3: Add direct Day links to the 14-day desk**

Add an `执行文件` column or a compact list linking Day 1 Moon Disc, Day 2 Turquoise Leaf, Day 3 Violet Rain, Day 4 Falling Pearl, and Day 5 winner template. Do not copy full prompts into the 14-day desk again.

- [ ] **Step 4: Validate and commit Day 5**

Run:

```powershell
rg -n "waiting_footage|动作幅度|待确认|Moon Disc QA与剪辑交接|Day 3 Violet Rain|Day 4 Falling Pearl|Day 5 胜出主体" -- "video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜Day 5 胜出主体复用模板.md" "video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜14天每日3×4秒执行卡.md"
git diff --check -- "video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜Day 5 胜出主体复用模板.md" "video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜14天每日3×4秒执行卡.md"
```

Expected: all five Day links and all selection fields are present; diff check exits 0.

Commit:

```powershell
git add -- "video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜Day 5 胜出主体复用模板.md" "video-pipeline/asset-library/obsidian-vault/04-待办/TikTok 制作台｜14天每日3×4秒执行卡.md"
git commit -m "docs: add TikTok Day 5 selection template"
```

### Task 5: Run final consistency and safety verification

**Files:**
- Verify: all Day 1–5 handoffs and the 14-day desk.

**Interfaces:**
- Consumes: Tasks 1–4 outputs.
- Produces: a final evidence summary; no new external action.

- [ ] **Step 1: Validate mappings and prompt contracts**

Require Day 1 Moon, Day 2 Turquoise, Day 3 Violet, Day 4 Falling, Day 5 unselected. Require exactly three prompt headers in Day 2–4. Require every `@D:\` image path to exist.

- [ ] **Step 2: Validate publication and BGM fields**

Require each Day 1–4 file to contain cover text, on-screen text, caption, hashtags, CTA type, music search terms, BPM, BGM percentage, original-audio rule, fade, final-track field, and platform-data fields.

- [ ] **Step 3: Scan prohibited claims and stale assets**

Run a scoped scan for `hypoallergenic`, `healing`, `luck`, `waterproof`, `free shipping`, `in stock`, `925`, explicit prices, `SHOT_BAROQUE_ORBIT_COLD_START_001`, `SHOT_GOLD_SHELL_TEARDROPS_COLD_START_001`, and `D03_FALLING_PEARL_`. Any match must be either removed or confined to a clearly labeled prohibition sentence; active publication copy must have zero matches.

- [ ] **Step 4: Verify Git scope and report**

Run `git diff --check`, `git status --short`, and `git log -5 --oneline`. Confirm no unrelated working-tree file was staged or committed, and report that no external action occurred.
