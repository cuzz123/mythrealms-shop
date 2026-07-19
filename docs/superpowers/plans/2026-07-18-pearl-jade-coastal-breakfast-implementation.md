# 珍珠玉石项链海边早餐桌视频包 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为异形珍珠与雾绿玉石项链建立真实海岸早餐世界资产、32 秒分镜、剪辑节拍与 Seedance 2.0 提示词。

**Architecture:** 环境、角色、道具、产品和视频方案各自独立保存；`asset-pack-manifest.json` 是机器清单，Obsidian 卡是人工入口。人物与产品分开生成，用光线、桌面与声音完成连续性。

**Tech Stack:** PNG/WebP、JSON、Markdown、Obsidian、Seedance 2.0、Node.js 路径验证。

## Global Constraints

- 全部引用使用 `D:\mythrealms-shop\...` 绝对路径；不得有 `@alias.png` 或 worktree 临时路径。
- 9:16、8 段、每段 4 秒、总长 32 秒；S01–S05 不露项链，S06 首次露出。
- 产品锁只控制异形珍珠、雾绿椭圆玉石、金色扣链与短项链比例。
- 不生成文字、水印或 Logo；禁止黑金奇幻、过度油亮皮肤和旅游海报式海景。

---

### Task 1: 生成海岸早餐露台锚点

**Files:**
- Create: `video-pipeline/asset-library/03-scene-kits/ENV_MR_COASTAL_BREAKFAST_TERRACE_001/source/coastal-breakfast-panorama-v1.png`
- Create: `video-pipeline/asset-library/03-scene-kits/ENV_MR_COASTAL_BREAKFAST_TERRACE_001/source/coastal-breakfast-reverse-v1.png`
- Create: `video-pipeline/asset-library/03-scene-kits/ENV_MR_COASTAL_BREAKFAST_TERRACE_001/README.md`

**Produces:** 无人物、无产品、无文字的正反向环境锚点；米白石灰岩、白亚麻、浅木、白瓷、未切柠檬、低饱和远海和清晨自然侧光必须连续。

- [ ] 生成全景锚点并保存到 `coastal-breakfast-panorama-v1.png`。
- [ ] 生成同一空间反打锚点并保存到 `coastal-breakfast-reverse-v1.png`。
- [ ] 写 README，规定石材、桌面、海平线、光向和禁止元素。
- [ ] 运行 `Test-Path` 检查上述三个文件；提交：`git commit -m "assets: add coastal breakfast terrace anchors"`。

### Task 2: 生成模特与早餐道具参考包

**Files:**
- Create: `video-pipeline/asset-library/05-characters/CHAR_MR_TALENT_COASTAL_BREAKFAST_001/source/turnaround-v1.png`
- Create: `video-pipeline/asset-library/05-characters/CHAR_MR_TALENT_COASTAL_BREAKFAST_001/source/expressions-v1.png`
- Create: `video-pipeline/asset-library/05-characters/CHAR_MR_TALENT_COASTAL_BREAKFAST_001/source/motion-contacts-v1.png`
- Create: `video-pipeline/asset-library/05-characters/CHAR_MR_TALENT_COASTAL_BREAKFAST_001/README.md`
- Create: `video-pipeline/asset-library/03-scene-kits/PROP_MR_COASTAL_BREAKFAST_SET_001/source/turnaround-v1.png`
- Create: `video-pipeline/asset-library/03-scene-kits/PROP_MR_COASTAL_BREAKFAST_SET_001/README.md`

**Produces:** 一位成年女性的无首饰三视图、平静表情九宫格、放信/入座/端杯/阅读/触锁骨/走过桌边的六格动作表，以及白瓷碟、柠檬、不可读折信、浅木桌、亚麻餐巾三视图。

- [ ] 生成并保存角色三视图、表情表、动作表；所有角色参考均无项链。
- [ ] 生成并保存早餐道具三视图；道具参考中也不得出现项链。
- [ ] 在两个 README 中写明身份、动作和道具的单一控制职责。
- [ ] 运行 `Test-Path` 检查六个文件；提交：`git commit -m "assets: add coastal breakfast talent and props"`。

### Task 3: 锁定项链并登记资产库

**Files:**
- Create: `video-pipeline/asset-library/01-products/PROD_MR_PEARL_JADE_NECKLACE_001/README.md`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_PEARL_JADE_COASTAL_BREAKFAST_001/asset-pack-manifest.json`
- Create: `video-pipeline/asset-library/obsidian-vault/01-资产卡/ENV_MR_COASTAL_BREAKFAST_TERRACE_001｜海岸早餐露台.md`
- Create: `video-pipeline/asset-library/obsidian-vault/01-资产卡/PROP_MR_COASTAL_BREAKFAST_SET_001｜海岸早餐桌道具.md`
- Create: `video-pipeline/asset-library/obsidian-vault/01-资产卡/PROD_MR_PEARL_JADE_NECKLACE_001｜异形珍珠雾绿玉石项链.md`
- Create: `video-pipeline/asset-library/obsidian-vault/03-参考拆解/VID_MR_PEARL_JADE_COASTAL_BREAKFAST_001｜海岸早餐桌分镜.md`
- Modify: `video-pipeline/asset-library/registry/assets.json`

**Produces:** 正式产品锁、可解析 manifest 和 Obsidian 导航。源产品为 `public/images/products/new-series/new-series-pearl-jade-bracelet/main.jpg`，但产品命名采用“项链”。

- [ ] 写产品结构锁与五类资产的 ID、类别、用途、关联视频 ID。
- [ ] 用 UTF-8 追加 registry，绝不重写既有记录。
- [ ] 用 Node.js 执行 `JSON.parse` 并验证 manifest 内每个绝对路径存在。
- [ ] 提交：`git commit -m "assets: register coastal breakfast pearl jade pack"`。

### Task 4: 写 8 段分镜、剪辑节拍与 Seedance 提示词

**Files:**
- Create: `video-pipeline/work/2026-07-18-pearl-jade-coastal-breakfast/project-state.json`
- Create: `video-pipeline/work/2026-07-18-pearl-jade-coastal-breakfast/coastal-breakfast-master-storyboard.md`
- Create: `video-pipeline/work/2026-07-18-pearl-jade-coastal-breakfast/seedance-prompts.md`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_PEARL_JADE_COASTAL_BREAKFAST_001/cut-map.md`
- Create: `video-pipeline/asset-library/10-storyboard-videos/VID_MR_PEARL_JADE_COASTAL_BREAKFAST_001/README.md`

**Produces:** S01 空露台、S02 放信、S03 入座端杯、S04 柠檬与虚焦经过、S05 阅读触锁骨、S06 白瓷碟首露、S07 珍珠玉石微距、S08 项链/信/远海收尾。每条边界写硬切或匹配切、视觉锚点、J/L-cut 或静音切。

- [ ] 为 S01–S08 写 `duration_seconds: 4`；S01–S05 明确 `jewelry reveal reserved for later`。
- [ ] 写绝对路径全能模式提示词：每张图仅承担环境、身份、动作、道具或产品结构之一。
- [ ] 写 cut map，以亚麻摆动、信纸折线、白瓷高光、珍珠高光作为剪辑桥。
- [ ] 用 Node.js 断言：8 段、32 秒、S06 首露、无 `@`、无 `.worktrees`、所有引用存在。
- [ ] 提交：`git commit -m "docs: add coastal breakfast pearl jade storyboard"`。

### Task 5: 完整验收

**Files:** 无新增文件。

- [ ] 运行 `pnpm test:unit`，预期全部通过。
- [ ] 运行 Task 4 的资产合同校验，预期输出 `coastal-breakfast-qc=ok`。
- [ ] 目检全景/反打、角色三视图/表情/动作、道具三视图、产品锁、manifest、Obsidian 卡、主分镜、提示词和剪辑表均存在。
- [ ] 若验收发现文档问题，只提交修正文件：`git commit -m "docs: finalize coastal breakfast asset package"`。

## Plan Self-Review

- Task 1–2 覆盖环境、角色和道具；Task 3 覆盖产品锁与资产管理；Task 4 覆盖镜头、连续性和提示词；Task 5 覆盖测试与交付。
- 无待填充项；所有文件路径、视频 ID、时长、首露约束前后一致。
