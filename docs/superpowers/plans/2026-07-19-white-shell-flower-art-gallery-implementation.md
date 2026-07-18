# 白贝母花耳环石灰岩花影馆视频包 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立白贝母花垂坠耳环的真实艺术馆资产包、32 秒镜头合同、剪辑节拍与 Seedance 全能模式提示词。

**Architecture:** 环境、角色、道具和产品锁独立保存；manifest 将它们编入视频包，Obsidian 卡提供浏览入口。前五段只建立花影、石材与耳侧轮廓；耳环、人物与产品桌面镜头分离，减少 AI 对手部和耳环结构的误改。

**Tech Stack:** PNG/JPG 参考图、Markdown、JSON、Obsidian、Seedance 2.0、Node.js 合同校验。

## Global Constraints

- 所有最终提示词为 `D:\mythrealms-shop\...` 绝对路径；不可有 `@` 图片别名或临时 worktree 路径。
- 9:16、8 段、每段 4 秒、总长 32 秒；S01–S05 禁止耳环，S06 首次露出一只耳环。
- 产品锁只控制乳白贝母花瓣、小珍珠串、金色连接件和比例；原图背景、包装和文字不得转移。
- 不生成 Logo、文字、水印、黑金背景、虚构博物馆品牌、塑料皮肤或过冷蓝光。

---

### Task 1: 创建石灰岩花影馆环境锚点

**Files:**
- Create: `video-pipeline/asset-library/03-scene-kits/ENV_MR_LIMESTONE_FLORAL_GALLERY_001/source/gallery-forward-v1.png`
- Create: `video-pipeline/asset-library/03-scene-kits/ENV_MR_LIMESTONE_FLORAL_GALLERY_001/source/gallery-reverse-v1.png`
- Create: `video-pipeline/asset-library/03-scene-kits/ENV_MR_LIMESTONE_FLORAL_GALLERY_001/README.md`

**Produces:** 同一真实艺术馆的正反锚点：高窗、浅灰白石灰岩、稳定晨光、缓慢植物影、空展台，无人无首饰。

- [ ] 生成朝向高窗和展台的正向图；保存 `gallery-forward-v1.png`。
- [ ] 生成从展台回望高窗/入口的反向图；保存 `gallery-reverse-v1.png`。
- [ ] 写 README：石材、光向、花影速度、展台位置和禁止元素。
- [ ] 使用 `Test-Path` 检查三项；提交 `git commit -m "assets: add limestone floral gallery anchors"`。

### Task 2: 创建模特与石膏花雕资产

**Files:**
- Create: `video-pipeline/asset-library/05-characters/CHAR_MR_TALENT_LIMESTONE_GALLERY_001/source/turnaround-v1.png`
- Create: `video-pipeline/asset-library/05-characters/CHAR_MR_TALENT_LIMESTONE_GALLERY_001/source/expressions-v1.png`
- Create: `video-pipeline/asset-library/05-characters/CHAR_MR_TALENT_LIMESTONE_GALLERY_001/source/motion-contacts-v1.png`
- Create: `video-pipeline/asset-library/05-characters/CHAR_MR_TALENT_LIMESTONE_GALLERY_001/README.md`
- Create: `video-pipeline/asset-library/03-scene-kits/PROP_MR_PLASTER_FLOWER_PEDESTAL_001/source/turnaround-v1.png`
- Create: `video-pipeline/asset-library/03-scene-kits/PROP_MR_PLASTER_FLOWER_PEDESTAL_001/README.md`

**Produces:** 无首饰模特三视图、自然表情、慢侧头/头发轻动动作表，以及无文字石膏花雕与石灰岩展台三视图。

- [ ] 生成或复用一组已验收的真实人物身份参考；服装为奶油白极简长裙，所有人物参考无耳环。
- [ ] 生成或复用表情/动作表，动作只包括走入停下、慢侧头、头发在微风中露出耳侧；不可提前露耳环。
- [ ] 生成石膏花雕和石灰岩展台三视图；花瓣形状须与耳环花瓣区分，不可成为产品替代品。
- [ ] 写两个 README，定义每张图的单一控制职责；检查文件存在并提交 `git commit -m "assets: add limestone gallery talent and prop"`。

### Task 3: 产品锁和资产库登记

**Files:**
- Create: `video-pipeline/asset-library/01-products/PROD_MR_WHITE_SHELL_FLOWER_DROPS_001/README.md`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/asset-pack-manifest.json`
- Create: `video-pipeline/asset-library/obsidian-vault/01-资产卡/ENV_MR_LIMESTONE_FLORAL_GALLERY_001｜石灰岩花影馆.md`
- Create: `video-pipeline/asset-library/obsidian-vault/01-资产卡/PROP_MR_PLASTER_FLOWER_PEDESTAL_001｜石膏花雕展台.md`
- Create: `video-pipeline/asset-library/obsidian-vault/01-资产卡/PROD_MR_WHITE_SHELL_FLOWER_DROPS_001｜白贝母花垂坠耳环.md`
- Create: `video-pipeline/asset-library/obsidian-vault/03-参考拆解/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001｜石中花影分镜.md`
- Modify: `video-pipeline/asset-library/registry/assets.json`

**Produces:** 产品结构锁和可浏览、可解析的资产包入口。

- [ ] 记录产品源图 `public/images/products/new-series/new-series-white-shell-flower-drops/detail-04.jpg` 和不能改变的几何细节。
- [ ] 写 manifest 和 Obsidian 卡；每项引用必须标明环境、身份、动作、道具或产品结构的单一角色。
- [ ] 用 UTF-8 追加 registry；不得重写既有记录。
- [ ] Node.js 解析 JSON 并验证 manifest 每条绝对路径存在；提交 `git commit -m "assets: register limestone flower gallery pack"`。

### Task 4: 写镜头合同、剪辑表与 Seedance 提示词

**Files:**
- Create: `video-pipeline/work/2026-07-19-white-shell-flower-gallery/project-state.json`
- Create: `video-pipeline/work/2026-07-19-white-shell-flower-gallery/limestone-gallery-master-storyboard.md`
- Create: `video-pipeline/work/2026-07-19-white-shell-flower-gallery/seedance-prompts.md`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/cut-map.md`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_WHITE_SHELL_FLOWER_GALLERY_001/README.md`

**Produces:** S01 高窗花影、S02 石膏花雕、S03 模特走入、S04 耳侧轮廓遮挡、S05 轻侧头仍遮挡、S06 风带开发丝首露一只耳环、S07 耳部微距、S08 一对耳环与石膏花雕收尾。

- [ ] 每段写 `target_duration_sec: 4`，S01–S05 写 `jewelry reveal reserved for later`，S06 为首次露出。
- [ ] 每段提示词列出正式绝对路径、引用单一职责、一个主动作、一个主镜头、物理光源、声音层和禁止项。
- [ ] 剪辑表以高窗光块、石膏花瓣、头发弧线、贝母高光和金属高光作为连续性桥。
- [ ] Node.js 断言 8 段、总 32 秒、S06 首露、无图片别名/临时路径、所有路径存在；提交 `git commit -m "docs: add limestone flower gallery storyboard"`。

### Task 5: 交付验收

**Files:** 无新增文件。

- [ ] 运行 `pnpm test:unit`，预期 0 failures。
- [ ] 运行 Task 4 合同校验，预期输出 `limestone-flower-gallery-qc=ok`。
- [ ] 目检环境正反锚点、角色三视图/表情/动作、花雕道具图、产品锁、manifest、Obsidian 卡、分镜、提示词和剪辑表。

## Plan Self-Review

- Task 1–2 覆盖世界、人物与道具；Task 3 覆盖产品和资产管理；Task 4 覆盖片段与连续性；Task 5 覆盖测试与交付。
- 无待填充项；视频 ID、8×4 秒时长、S06 首次露出和正式路径约束前后一致。
